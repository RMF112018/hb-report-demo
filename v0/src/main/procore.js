// src/main/procore.js
// Handles Procore API integration with Authorization Code flow, using initial token and background refresh
// Import in main.js to initialize Procore integration
// Reference: https://developers.procore.com/reference/rest/v1.3/company-users#list-company-users

import fetch from 'node-fetch';
import config from './config.js';
import logger from './logger.js';
import { upsertEntity, batchUpsert, getTokenByUserId } from './db.js';
import sdk from '@procore/js-sdk';

const { clientId, clientSecret, baseUrl = 'https://api-sandbox.procore.com', oauthUrl = 'https://login-sandbox.procore.com', redirectUri, companyId, initToken, initRefToken } = config.procore;

// Token readiness promise without timeout
let tokenReadyPromise = null;
let tokenReadyResolver = null;

logger.info('Procore config loaded:', {
  clientId: clientId ? '[redacted]' : 'undefined',
  clientSecret: clientSecret ? '[redacted]' : 'undefined',
  baseUrl,
  oauthUrl,
  redirectUri,
  companyId,
  initToken: initToken ? '[redacted]' : 'undefined',
  initRefToken: initRefToken ? '[redacted]' : 'undefined',
});

function validateProcoreConfig() {
  if (!clientId || !clientSecret || !companyId || !redirectUri) {
    throw new Error('Procore configuration incomplete: clientId, clientSecret, companyId, and redirectUri are required');
  }
  if (!baseUrl.startsWith('https://') || !oauthUrl.startsWith('https://')) {
    throw new Error('Procore baseUrl and oauthUrl must use HTTPS');
  }
  if (!initToken || !initRefToken) {
    logger.warn('Initial token (INIT_TOKEN) and refresh token (INIT_REF_TOKEN) missing in .env; standalone sync may fail');
  }
}

validateProcoreConfig();

function initializeTokenPromise() {
  tokenReadyPromise = new Promise(resolve => {
    tokenReadyResolver = resolve;
  });
}
initializeTokenPromise();

class TokenAuthorizer {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  authorize() {
    return {
      headers: { 'Authorization': `Bearer ${this.accessToken}` },
    };
  }

  setAccessToken(newToken) {
    this.accessToken = newToken;
  }
}

/**
 * Initializes the admin token from .env if not present in DB
 * @returns {Promise<Object>} Token data
 */
async function initializeAdminToken() {
  try {
    logger.debug('Starting admin token initialization');
    let token = await getTokenByUserId('admin');
    logger.debug('Retrieved token from DB', { token: token ? 'exists' : 'null' });

    if (!token) {
      const { initToken, initRefToken } = config.procore;
      if (!initToken || !initRefToken) {
        throw new Error('Missing INIT_TOKEN or INIT_REF_TOKEN in environment variables');
      }
      token = {
        user_id: 'admin',
        access_token: initToken,
        refresh_token: initRefToken,
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1-hour expiry
      };
      logger.debug('Upserting initial token to DB');
      await upsertEntity('tokens', token);
      logger.info('Initialized admin token from .env', {
        access_token: process.env.NODE_ENV === 'development' ? token.access_token : '[redacted]',
        expires_at: token.expires_at,
      });
    }
    tokenReadyResolver(token);
    return token;
  } catch (error) {
    logger.error('Failed to initialize admin token', { message: error.message, stack: error.stack });
    tokenReadyResolver(null);
    throw error;
  }
}

/**
 * Refreshes the admin token using the refresh token
 * @param {string} refreshToken - The refresh token
 * @returns {Promise<Object>} New token data
 */
async function refreshAdminToken(refreshToken) {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  try {
    logger.debug('Refreshing admin token');
    const response = await fetch(`${oauthUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token refresh failed: ${response.status} - ${errorText}`);
    }

    const tokens = await response.json();
    const tokenData = {
      user_id: 'admin',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || refreshToken,
      expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
    };

    await upsertEntity('tokens', tokenData);
    logger.info('Admin token refreshed', { expires_at: tokenData.expires_at });
    return tokenData;
  } catch (error) {
    logger.error('Failed to refresh admin token', { message: error.message, stack: error.stack });
    throw error;
  }
}

/**
 * Gets a valid admin token, refreshing if necessary
 * @returns {Promise<Object>} Valid token data
 */
async function getValidToken() {
  await tokenReadyPromise; // Wait for initial token
  let token = await getTokenByUserId('admin');
  const currentTime = Math.floor(Date.now() / 1000);
  const buffer = 300; // 5-minute buffer

  if (!token || token.expires_at <= currentTime) {
    logger.info('No valid admin token found or token expired, refreshing');
    token = await refreshAdminToken(token?.refresh_token || initRefToken);
  } else if (token.expires_at <= currentTime + buffer) {
    logger.info('Admin token near expiry, refreshing proactively');
    token = await refreshAdminToken(token.refresh_token);
  }

  logger.debug('Using valid admin token', { expires_at: token.expires_at });
  return token;
}

/**
 * Schedules the next token refresh for admin token
 * @returns {void}
 */
let refreshTimeouts = {};
function scheduleNextRefresh() {
  getValidToken().then(token => {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = token.expires_at - currentTime;
    const buffer = 300;
    const refreshIn = Math.max(timeUntilExpiration - buffer, 0);

    if (refreshTimeouts['admin']) clearTimeout(refreshTimeouts['admin']);
    refreshTimeouts['admin'] = setTimeout(async () => {
      try {
        await refreshAdminToken(token.refresh_token);
        logger.info('Admin token refreshed in background');
      } catch (error) {
        logger.error('Scheduled refresh failed, retrying', { error: error.message });
        await refreshAdminToken(token.refresh_token);
      }
      scheduleNextRefresh();
    }, refreshIn * 1000);

    logger.info('Scheduled next admin token refresh', { refreshInSeconds: refreshIn });
  }).catch(error => {
    logger.error('Failed to schedule admin token refresh', { error: error.message });
  });
}

/**
 * Fetches and syncs company users from Procore API using admin token
 * @returns {Promise<Array>} Synced users
 */
async function syncCompanyUsers(options = {}) {
  const tokenData = await getValidToken();
  const response = await fetch(`${baseUrl}/rest/v1.3/companies/${companyId}/users`, {
    headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
  });
  if (!response.ok) throw new Error(`Procore API error: ${await response.text()}`);
  const users = await response.json();
  const userEntities = users.map(user => ({
    procore_user_id: user.id,
    email: user.email_address,
    first_name: user.first_name,
    last_name: user.last_name,
    is_employee: user.is_employee || 0,
  })).filter(user => user.procore_user_id);
  await batchUpsert('users', userEntities, options);
  logger.info(`Synced ${userEntities.length} users`);
  return userEntities;
}

/**
 * Schedules periodic sync of company users
 * @returns {void}
 */
function scheduleUserSync() {
  setInterval(() => {
    syncCompanyUsers().catch(err => logger.error('Scheduled user sync failed:', err.message));
  }, 24 * 60 * 60 * 1000);
  logger.info('Scheduled periodic user sync every 24 hours');
}

/**
 * Fetches and syncs projects from Procore API using admin token
 * @returns {Promise<Array>} Synced projects
 */
async function syncProjects(options = {}) {
  const tokenData = await getValidToken();
  const response = await fetch(`${baseUrl}/rest/v1.0/projects?company_id=${companyId}`, {
    headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
  });
  if (!response.ok) throw new Error(`Procore API error: ${await response.text()}`);
  const projects = await response.json();
  const projectEntities = projects.map(project => ({
    procore_id: project.id,
    name: project.name,
    number: project.project_number,
    street_address: project.address,
    city: project.city,
    state: project.state_code,
    zip: project.zip,
  })).filter(project => project.procore_id);
  await batchUpsert('projects', projectEntities, options);
  logger.info(`Synced ${projectEntities.length} projects`);
  return projectEntities;
}

export {
  initializeAdminToken,
  getValidToken,
  scheduleNextRefresh,
  syncCompanyUsers,
  scheduleUserSync,
  syncProjects,
};