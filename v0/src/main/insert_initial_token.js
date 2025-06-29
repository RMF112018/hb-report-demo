// src/main/insert_initial_token.js
import { upsertEntity } from './db.js';
import logger from './logger.js';

async function insertInitialToken(accessToken, refreshToken) {
  await upsertEntity('tokens', {
    user_id: 'admin',
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: Math.floor(Date.now() / 1000) + 7200, // 2-hour expiry
  });
  logger.info('Initial admin token inserted');
}

const [, , accessToken, refreshToken] = process.argv;
if (!accessToken || !refreshToken) {
  logger.error('Usage: node insert_initial_token.js <access_token> <refresh_token>');
  process.exit(1);
}

insertInitialToken(accessToken, refreshToken).catch(err => {
  logger.error('Failed to insert initial token:', err.message);
  process.exit(1);
});