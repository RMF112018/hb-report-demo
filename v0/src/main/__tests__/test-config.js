// src/main/__tests__/test-config.js
import config from '../config.js'; // Adjusted to point to src/main/config.js

console.log('Config loaded:', {
  clientId: config.procore.clientId ? '[redacted]' : 'undefined',
  clientSecret: config.procore.clientSecret ? '[redacted]' : 'undefined',
  redirectUri: config.procore.redirectUri,
  companyId: config.procore.companyId,
  initToken: config.procore.initToken ? '[redacted]' : 'undefined',
  initRefToken: config.procore.initRefToken ? '[redacted]' : 'undefined',
  baseUrl: config.procore.baseUrl,
  oauthUrl: config.procore.oauthUrl,
  dbPath: config.db.path,
  loggerLevel: config.logger.level,
});