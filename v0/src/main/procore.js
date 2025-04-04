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

// Validate configuration at startup
function validateProcoreConfig() {
  if (!clientId || !clientSecret || !companyId || !redirectUri) {
    throw new Error('Procore configuration incomplete: clientId, clientSecret, companyId, and redirectUri are required');
  }
  if (!baseUrl.startsWith('https://') || !oauthUrl.startsWith('https://')) {
    throw new Error('Procore baseUrl and oauthUrl must use HTTPS');
  }
  if (!initToken || !initRefToken) {
    throw new Error('Initial token (INIT_TOKEN) and refresh token (INIT_REF_TOKEN) must be provided in .env');
  }
}
validateProcoreConfig();

// Token readiness promise to ensure API calls wait
let tokenReadyPromise = null;
let tokenReadyResolver = null;

function initializeTokenPromise() {
  tokenReadyPromise = new Promise((resolve, reject) => {
    tokenReadyResolver = resolve;
    // Extend timeout to 30 seconds
    setTimeout(() => reject(new Error('Token initialization timed out after 30 seconds')), 30000);
  });
}
initializeTokenPromise();

// Custom authorizer for Procore JS SDK
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
      token = {
        user_id: 'admin',
        access_token: initToken,
        refresh_token: initRefToken,
        expires_at: Math.floor(Date.now() / 1000) + 3600, // Assume 1-hour expiry
      };
      logger.debug('Upserting initial token to DB');
      await upsertEntity('tokens', token);
      logger.info('Initialized admin token from .env', {
        access_token: process.env.NODE_ENV === 'development' ? token.access_token : '[redacted]',
        expires_at: token.expires_at,
      });
    }
    tokenReadyResolver(token); // Resolve promise once token is ready
    return token;
  } catch (error) {
    logger.error('Failed to initialize admin token', { message: error.message, stack: error.stack });
    tokenReadyResolver(null); // Resolve with null to allow fallback
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
    logger.debug('Refreshing admin token', { refreshToken: '[redacted]' });
    const response = await fetch(`${oauthUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Token refresh failed', { status: response.status, body: errorText });
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
    logger.info('Admin token refreshed and stored', {
      access_token: process.env.NODE_ENV === 'development' ? tokens.access_token : '[redacted]',
      expires_at: tokenData.expires_at,
      scope: tokens.scope || 'default',
    });
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
    logger.info('Admin token near expiry, refreshing proactively', { timeLeft: token.expires_at - currentTime });
    token = await refreshAdminToken(token.refresh_token);
  }

  logger.debug('Using valid admin token', { expires_at: token.expires_at, timeLeft: token.expires_at - currentTime });
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
    const buffer = 300; // 5-minute buffer
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
 * @returns {Promise<void>}
 */
async function syncCompanyUsers() {
  const tokenData = await getValidToken();
  try {
    logger.debug('Fetching company users', {
      endpoint: `${baseUrl}/rest/v1.3/companies/${companyId}/users`,
      token: process.env.NODE_ENV === 'development' ? tokenData.access_token : '[redacted]',
      expires_at: tokenData.expires_at,
    });
    const response = await fetch(`${baseUrl}/rest/v1.3/companies/${companyId}/users`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
      redirect: 'follow',
    });

    const responseText = await response.text();
    logger.debug('Raw response from Procore API', { status: response.status, body: responseText });

    if (!response.ok) {
      logger.error('Failed to fetch company users', {
        status: response.status,
        body: responseText,
        token: process.env.NODE_ENV === 'development' ? tokenData.access_token : '[redacted]',
        endpoint: `${baseUrl}/rest/v1.3/companies/${companyId}/users`,
      });
      throw new Error(`Failed to fetch company users: ${response.status} - ${responseText}`);
    }

    const users = JSON.parse(responseText);
    logger.debug('Parsed users from Procore API', { userCount: users.length, sample: JSON.stringify(users.slice(0, 2)) });

    if (!Array.isArray(users) || users.length === 0) {
      logger.warn('No users returned from Procore API', { response: responseText });
      return;
    }

    const userEntities = users
      .map(user => {
        if (!user.id) {
          logger.warn('User missing id from Procore API, skipping', { user });
          return null;
        }
        const entity = {
          procore_user_id: user.id,
          email: user.email_address,
          first_name: user.first_name,
          last_name: user.last_name,
          business_id: user.business_id,
          address: user.address,
          avatar: user.avatar,
          business_phone: user.business_phone,
          city: user.city,
          country_code: user.country_code,
          state_code: user.state_code,
          zip: user.zip,
          is_employee: user.is_employee || 0,
        };
        logger.debug('Mapped user entity', { entity });
        return entity;
      })
      .filter(Boolean);

    if (userEntities.length === 0) {
      logger.warn('No valid user entities to sync after mapping');
      return;
    }

    await batchUpsert('users', userEntities);
    logger.info(`Synced ${userEntities.length} company users from Procore`);
  } catch (error) {
    logger.error('Company users sync failed', { message: error.message, stack: error.stack });
    throw error; // Re-throw to ensure caller sees the failure
  }
}

/**
 * Schedules periodic sync of company users
 * @returns {void}
 */
function scheduleUserSync() {
  setInterval(() => {
    syncCompanyUsers().catch(err => logger.error('Scheduled user sync failed:', err.message));
  }, 24 * 60 * 60 * 1000); // Every 24 hours
  logger.info('Scheduled periodic user sync every 24 hours');
}

/**
 * Fetches and syncs projects from Procore API using admin token
 * @returns {Promise<void>}
 */
async function syncProjects() {
  const tokenData = await getValidToken();
  const authorizer = new TokenAuthorizer(tokenData.access_token);
  const client = sdk.client(authorizer, undefined, {
    apiHostname: baseUrl.replace('https://', ''),
    defaultCompanyId: companyId,
    defaultVersion: 'v1.0',
  });
  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
      logger.debug('Fetching projects from Procore', {
        attempt: attempts + 1,
        access_token: process.env.NODE_ENV === 'development' ? tokenData.access_token : '[redacted]',
        expires_at: tokenData.expires_at,
        timeLeft: tokenData.expires_at - Math.floor(Date.now() / 1000),
        baseUrl,
        companyId,
      });

      const response = await client.get(
        { base: '/projects', qs: { company_id: companyId } },
        { companyId }
      );

      if (!response.response.ok) {
        const status = response.response.status;
        const errorBody = response.body || 'No body returned';
        logger.error('Procore API request failed', {
          status,
          statusText: response.response.statusText,
          headers: Object.fromEntries(response.response.headers.entries()),
          body: JSON.stringify(errorBody, null, 2),
        });
        throw new Error(`Procore API returned ${status}: ${response.response.statusText}`);
      }

      if (!response.body) {
        logger.warn('No projects returned from Procore API', { response: JSON.stringify(response, null, 2) });
        const projectEntities = [];
        await batchUpsert('projects', projectEntities);
        logger.info('Synced 0 projects from Procore (empty response)');
        return;
      }

      if (!Array.isArray(response.body)) {
        logger.error('Expected response.body to be an array', {
          type: typeof response.body,
          value: JSON.stringify(response.body, null, 2),
          fullResponse: JSON.stringify(response, null, 2),
        });
        throw new Error('Invalid response format from Procore API: body is not an array');
      }

      const projects = response.body;
      logger.debug('Projects fetched successfully', {
        status: response.response.status,
        totalRecords: response.response.headers.get('Total') || 'Not provided',
        projectCount: projects.length,
        sample: JSON.stringify(projects.slice(0, 2), null, 2),
      });

      const projectEntities = projects.map(project => {
        if (!project.id) {
          logger.warn('Project missing ID', { project });
          return null;
        }
        return {
          procore_id: project.id,
          name: project.name,
          number: project.project_number,
          street_address: project.address,
          city: project.city,
          state: project.state_code,
          zip: project.zip,
          start_date: project.start_date,
          original_completion_date: project.completion_date,
        };
      }).filter(Boolean);

      await batchUpsert('projects', projectEntities);
      logger.info(`Synced ${projects.length} projects from Procore`);
      return;
    } catch (error) {
      const status = error.response && error.response.status ? error.response.status : 'unknown';
      logger.error('Sync attempt failed', {
        message: error.message,
        status,
        stack: error.stack,
        response: error.response ? JSON.stringify(error.response, null, 2) : 'none',
      });

      if (status === 401 && attempts < maxAttempts - 1) {
        logger.warn('Received 401, refreshing token');
        const newTokenData = await refreshAdminToken(tokenData.refresh_token);
        authorizer.setAccessToken(newTokenData.access_token);
        attempts++;
        continue;
      } else if (status === 403) {
        throw new Error('Permission denied: User lacks access to projects');
      } else if (status === 404) {
        throw new Error('Company ID not found or invalid');
      }
      throw error;
    }
  }
}

export {
  initializeAdminToken,
  getValidToken,
  scheduleNextRefresh,
  syncCompanyUsers,
  scheduleUserSync,
  syncProjects,
};