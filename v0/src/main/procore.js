// src/main/procore.js
// Handles Procore API integration using Authorization Code Grant and Refresh Token flows with Procore JS SDK
// Import in main.js to initialize Procore integration; ensure @procore/js-sdk is updated to latest version
// Reference: https://developers.procore.com/documentation/tutorial-signup-signin
// *Additional Reference*: https://github.com/procore-oss/js-sdk
// *Additional Reference*: https://www.npmjs.com/package/@procore/js-sdk (Update to latest version, e.g., 4.2.1)

import { BrowserWindow } from 'electron';
import { URL } from 'url';
import sdk from '@procore/js-sdk';
import config from './config.js';
import logger from './logger.js';
import { upsertEntity, batchUpsert, db } from './db.js';

const { clientId, clientSecret, baseUrl, oauthUrl, redirectUri, companyId } = config.procore;

logger.info('Procore config loaded:', {
    clientId: clientId ? '[redacted]' : 'undefined',
    clientSecret: clientSecret ? '[redacted]' : 'undefined',
    baseUrl,
    oauthUrl,
    redirectUri,
    companyId: companyId ? String(companyId) : 'undefined',
});

// Validate configuration at startup
function validateProcoreConfig() {
    if (!clientId || !clientSecret || !redirectUri || !companyId) {
        throw new Error('Procore configuration incomplete: clientId, clientSecret, redirectUri, and companyId are required');
    }
    if (!baseUrl.startsWith('https://') || !oauthUrl.startsWith('https://')) {
        throw new Error('Procore baseUrl and oauthUrl must use HTTPS');
    }
}
validateProcoreConfig();

// Custom authorizer for Procore JS SDK
class TokenAuthorizer {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    authorize() {
        return {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
            },
        };
    }

    setAccessToken(newToken) {
        this.accessToken = newToken;
    }
}

/**
 * Initiates Authorization Code Grant authentication by opening a Procore login window and syncs projects
 * @returns {Promise<void>}
 */
async function initiateAuth() {
    return new Promise((resolve, reject) => {
        logger.info('Starting Procore Authorization Code Grant authentication');

        const authUrl = new URL(`${oauthUrl}/oauth/authorize`);
        authUrl.searchParams.append('client_id', clientId);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('redirect_uri', redirectUri);

        logger.info('Opening auth window with URL:', authUrl.toString().replace(/client_id=[^&]+/, 'client_id=[redacted]'));

        const authWindow = new BrowserWindow({
            width: 500,
            height: 800,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
            },
        });

        let isResolved = false;

        authWindow.loadURL(authUrl.toString());
        authWindow.on('closed', () => {
            if (!isResolved) {
                logger.warn('Authentication window closed before completion');
                reject(new Error('Authentication window closed by user'));
            }
        });

        authWindow.webContents.on('will-redirect', (event, url) => {
            logger.debug('will-redirect event triggered', { url });
            handleCallback(url, authWindow, resolve, reject).then(() => {
                isResolved = true;
            }).catch(err => {
                logger.debug('Redirect handling failed, continuing auth flow', { error: err.message });
            });
        });

        authWindow.webContents.on('did-navigate', (event, url) => {
            logger.debug('did-navigate event triggered', { url });
            handleCallback(url, authWindow, resolve, reject).then(() => {
                isResolved = true;
            }).catch(err => {
                logger.debug('Navigation handling failed, continuing auth flow', { error: err.message });
            });
        });
    }).then(async () => {
        logger.info('Authentication completed, syncing projects');
        await syncProjects();
    });
}

/**
 * Handles the redirect callback, exchanges code for tokens, and stores them
 * @param {string} url - The redirected URL
 * @param {BrowserWindow} authWindow - The authentication window
 * @param {Function} resolve - Promise resolve function
 * @param {Function} reject - Promise reject function
 * @returns {Promise<void>}
 */
async function handleCallback(url, authWindow, resolve, reject) {
    const parsedUrl = new URL(url);
    if (!parsedUrl.pathname.startsWith(new URL(redirectUri).pathname)) {
        logger.debug('Skipping redirect, not a callback', { url });
        return;
    }

    const code = parsedUrl.searchParams.get('code');
    const error = parsedUrl.searchParams.get('error');

    if (error) {
        logger.error(`Authorization error: ${error}`, { description: parsedUrl.searchParams.get('error_description') });
        authWindow.destroy();
        throw new Error(`OAuth error: ${error}`);
    }

    if (!code) {
        logger.warn('No authorization code found in redirect URL', { url });
        authWindow.destroy();
        throw new Error('No authorization code received');
    }

    logger.info('Authorization code received', { code: '[redacted]' });

    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('code', code);
        params.append('redirect_uri', redirectUri);

        const response = await fetch(`${oauthUrl}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });

        if (!response.ok) {
            const errorText = await response.text();
            logger.error('Token exchange failed', { status: response.status, body: errorText });
            throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
        }

        const tokens = await response.json();
        logger.info('Tokens received from Procore', {
            access_token: '[redacted]',
            refresh_token: '[redacted]',
            expires_in: tokens.expires_in,
        });

        const tokenData = {
            id: 1,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
        };

        if (!db) {
            throw new Error('Database connection not initialized');
        }

        logger.debug('Upserting token data', { tokenData: { ...tokenData, access_token: '[redacted]', refresh_token: '[redacted]' } });
        await upsertEntity('tokens', tokenData);
        logger.info('Token upsert completed successfully');

        const row = await new Promise((resolveQuery, rejectQuery) => {
            db.get('SELECT * FROM tokens WHERE id = 1', (err, row) => {
                if (err) rejectQuery(err);
                else resolveQuery(row);
            });
        });

        if (!row || row.access_token !== tokens.access_token) {
            throw new Error('Token not correctly stored in database');
        }

        authWindow.destroy();
        resolve();
    } catch (err) {
        logger.error(`Token exchange or storage error: ${err.message}`, { stack: err.stack });
        authWindow.destroy();
        throw err;
    }
}

/**
 * Refreshes the access token using the stored refresh token
 * @param {string} refreshToken - The refresh token to use
 * @returns {Promise<Object>} New token data
 */
async function refreshToken(refreshToken) {
    try {
        logger.info('Attempting to refresh access token');
        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('refresh_token', refreshToken);

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
        logger.info('New tokens received from Procore', {
            access_token: '[redacted]',
            refresh_token: '[redacted]',
            expires_in: tokens.expires_in,
        });

        const tokenData = {
            id: 1,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
        };

        await upsertEntity('tokens', tokenData);
        logger.info('Refreshed token upserted successfully');
        return tokenData;
    } catch (err) {
        logger.error(`Token refresh error: ${err.message}`, { stack: err.stack });
        throw err;
    }
}

/**
 * Fetches and syncs projects from Procore API using the SDK, with retry on 401
 * @returns {Promise<void>}
 */
async function syncProjects() {
    let tokenData = await getStoredToken();
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
                access_token: '[redacted]',
                expires_at: tokenData.expires_at,
                timeLeft: tokenData.expires_at - Math.floor(Date.now() / 1000),
                baseUrl,
                companyId,
            });

            const response = await client.get(
                { base: '/projects', qs: { company_id: companyId } },
                { companyId } // Added for alignment with SDK example
            );

            // Check HTTP status via response.response
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

            // Handle cases where body might be null or undefined
            if (!response.body) {
                logger.warn('No projects returned from Procore API', { response: JSON.stringify(response, null, 2) });
                const projectEntities = [];
                await batchUpsert('projects', projectEntities);
                logger.info('Synced 0 projects from Procore (empty response)');
                return;
            }

            // Ensure body is an array
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
                sample: JSON.stringify(projects.slice(0, 2), null, 2), // First 2 for brevity
            });

            const projectEntities = projects.map(project => ({
                procore_id: project.id,
                name: project.name,
                number: project.project_number,
                street_address: project.address,
                city: project.city,
                state: project.state_code,
                zip: project.zip,
                start_date: project.start_date,
                original_completion_date: project.completion_date,
            }));

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
                logger.warn('Received 401, forcing token refresh');
                const tokenParts = tokenData.access_token.split('.');
                const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
                logger.debug('Current token payload', { payload });
                tokenData = await refreshToken(tokenData.refresh_token);
                authorizer.setAccessToken(tokenData.access_token);
                attempts++;
                continue;
            } else if (status === 403) {
                throw new Error('Permission denied: User lacks access to projects for the specified company');
            } else if (status === 404) {
                throw new Error('Company ID not found or invalid');
            }
            throw error; // Re-throw other errors after logging
        }
    } // Added closing brace for while loop
}

/**
 * Retrieves the stored token, refreshing it if near expiry
 * @returns {Promise<Object>} Token data
 */
async function getStoredToken() {
    return new Promise((resolve, reject) => {
        if (!db) {
            logger.error('Database connection not initialized in getStoredToken');
            return reject(new Error('Database connection not initialized'));
        }
        db.get('SELECT * FROM tokens WHERE id = 1', (err, row) => {
            if (err) {
                logger.error(`Database query error: ${err.message}`, { stack: err.stack });
                return reject(err);
            }
            if (!row) {
                logger.info('No token found, initiating authentication');
                return initiateAuth().then(() => {
                    db.get('SELECT * FROM tokens WHERE id = 1', (err, newRow) => {
                        if (err) reject(err);
                        else resolve(newRow);
                    });
                }).catch(reject);
            }
            const currentTime = Math.floor(Date.now() / 1000);
            const buffer = 300; // 5-minute buffer
            if (currentTime >= row.expires_at - buffer) {
                logger.info('Access token near expiry, refreshing proactively', {
                    currentTime,
                    expires_at: row.expires_at,
                    timeLeft: row.expires_at - currentTime,
                });
                return refreshToken(row.refresh_token).then(newTokenData => {
                    resolve(newTokenData);
                }).catch(err => {
                    logger.warn('Refresh failed, falling back to full re-authentication');
                    initiateAuth().then(() => {
                        db.get('SELECT * FROM tokens WHERE id = 1', (err, newRow) => {
                            if (err) reject(err);
                            else resolve(newRow);
                        });
                    }).catch(reject);
                });
            }
            logger.debug('Using existing valid token', {
                expires_at: row.expires_at,
                timeLeft: row.expires_at - currentTime,
            });
            resolve(row);
        });
    });
}

export { initiateAuth, syncProjects };