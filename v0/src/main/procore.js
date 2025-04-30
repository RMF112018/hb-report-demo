// src/main/procore.js
// Handles Procore API integration with Authorization Code flow using redirectless redirect_uri
// Import in main.js or sync.js to initialize Procore integration
// Reference: https://developers.procore.com/reference/rest/v1.3/company-users#list-company-users

import fetch from 'node-fetch';
import config from './config.js';
import logger from './logger.js';
import { upsertEntity, batchUpsert, getTokenByUserId } from './db.js';
import readline from 'readline';

// Procore configuration from config.js
const {
  clientId,
  clientSecret,
  baseUrl = 'https://api-sandbox.procore.com',
  oauthUrl = 'https://login-sandbox.procore.com',
  redirectUri = 'urn:ietf:wg:oauth:2.0:oob', // Redirectless URI
  companyId,
} = config.procore;

// Token readiness promise
let tokenReadyPromise = null;
let tokenReadyResolver = null;

logger.info('Procore config loaded:', {
  clientId: clientId ? '[redacted]' : 'undefined',
  clientSecret: clientSecret ? '[redacted]' : 'undefined',
  baseUrl,
  oauthUrl,
  redirectUri,
  companyId,
});

/**
 * Validates Procore configuration
 * @throws {Error} If configuration is incomplete or invalid
 */
function validateProcoreConfig() {
  if (!clientId || !clientSecret || !companyId) {
    throw new Error('Procore configuration incomplete: clientId, clientSecret, and companyId are required');
  }
  if (!baseUrl.startsWith('https://') || !oauthUrl.startsWith('https://')) {
    throw new Error('Procore baseUrl and oauthUrl must use HTTPS');
  }
}

validateProcoreConfig();

/**
 * Initializes the token readiness promise
 */
function initializeTokenPromise() {
  tokenReadyPromise = new Promise((resolve) => {
    tokenReadyResolver = resolve;
  });
}
initializeTokenPromise();

/**
 * Prompts the user to manually retrieve the authorization code
 * @returns {Promise<string>} Authorization code
 */
async function getAuthorizationCode() {
  const authorizeUrl = `${oauthUrl}/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  logger.info(`Please open this URL in your browser to authorize: ${authorizeUrl}`);
  logger.info('After authorization, copy the code displayed in the browser and paste it here.');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Enter the authorization code: ', (code) => {
      rl.close();
      resolve(code.trim());
    });
  });
}

/**
 * Exchanges authorization code for access and refresh tokens
 * @param {string} code - Authorization code
 * @returns {Promise<Object>} Token data
 */
async function exchangeCodeForTokens(code) {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);

  const response = await fetch(`${oauthUrl}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
  }

  const tokens = await response.json();
  const tokenData = {
    user_id: 'admin',
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
  };

  await upsertEntity('tokens', tokenData);
  logger.info('Obtained and stored new admin token', { expires_at: tokenData.expires_at });
  return tokenData;
}

/**
 * Initializes the admin token, prompting for code if not present
 * @returns {Promise<Object>} Token data
 */
async function initializeAdminToken() {
  try {
    logger.debug('Starting admin token initialization');
    let token = await getTokenByUserId('admin');
    if (!token) {
      logger.info('No admin token found, initiating manual OAuth flow');
      const code = await getAuthorizationCode();
      token = await exchangeCodeForTokens(code);
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
}

/**
 * Gets a valid admin token, refreshing if necessary
 * @returns {Promise<Object>} Valid token data
 */
async function getValidToken() {
  await tokenReadyPromise;
  let token = await getTokenByUserId('admin');
  const currentTime = Math.floor(Date.now() / 1000);
  const buffer = 300; // 5-minute buffer

  if (!token || token.expires_at <= currentTime) {
    logger.info('No valid admin token found or token expired, refreshing');
    token = await refreshAdminToken(token?.refresh_token);
  } else if (token.expires_at <= currentTime + buffer) {
    logger.info('Admin token near expiry, refreshing proactively');
    token = await refreshAdminToken(token.refresh_token);
  }

  logger.debug('Using valid admin token', { expires_at: token.expires_at });
  return token;
}

/**
 * Schedules the next token refresh
 */
let refreshTimeouts = {};
function scheduleNextRefresh() {
  getValidToken()
    .then((token) => {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiration = token.expires_at - currentTime;
      const buffer = 300;
      const refreshIn = Math.max(timeUntilExpiration - buffer, 0);

      if (refreshTimeouts['admin']) clearTimeout(refreshTimeouts['admin']);
      refreshTimeouts['admin'] = setTimeout(async () => {
        try {
          await refreshAdminToken(token.refresh_token);
          logger.info('Admin token refreshed in background');
          scheduleNextRefresh();
        } catch (error) {
          logger.error('Scheduled refresh failed', { error: error.message });
        }
      }, refreshIn * 1000);

      logger.info('Scheduled next admin token refresh', { refreshInSeconds: refreshIn });
    })
    .catch((error) => {
      logger.error('Failed to schedule admin token refresh', { error: error.message });
    });
}

/**
 * Fetches and syncs company users from Procore API
 * @returns {Promise<Array>} Synced users
 */
async function syncCompanyUsers(options = {}) {
  const tokenData = await getValidToken();
  const response = await fetch(`${baseUrl}/rest/v1.3/companies/${companyId}/users`, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!response.ok) throw new Error(`Procore API error: ${await response.text()}`);
  const users = await response.json();
  const userEntities = users
    .map((user) => ({
      procore_user_id: user.id,
      email: user.email_address,
      first_name: user.first_name,
      last_name: user.last_name,
      is_employee: user.is_employee || 0,
    }))
    .filter((user) => user.procore_user_id);

  await batchUpsert('users', userEntities, options);
  logger.info(`Synced ${userEntities.length} users`);
  return userEntities;
}

/**
 * Schedules periodic sync of company users
 */
function scheduleUserSync() {
  setInterval(() => {
    syncCompanyUsers().catch((err) => logger.error('Scheduled user sync failed:', err.message));
  }, 24 * 60 * 60 * 1000); // Every 24 hours
  logger.info('Scheduled periodic user sync every 24 hours');
}

export {
  initializeAdminToken,
  getValidToken,
  scheduleNextRefresh,
  syncCompanyUsers,
  scheduleUserSync,
};