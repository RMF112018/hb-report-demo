// src/main/config.js
// Central configuration for HB Report backend, extended with Procore credentials
// Import where needed to access settings
// Reference: https://nodejs.org/api/path.html
// *Additional Reference*: https://www.npmjs.com/package/dotenv

import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
dotenv.config({ path: resolve(__dirname, '..', '..', '.env') }); // Load from root

const config = {
    window: {
        width: 1200,
        height: 800,
    },
    db: {
        path: resolve(__dirname, '..', 'hb-report.db'),
    },
    logger: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
    debug: process.env.NODE_ENV !== 'production' || process.argv.includes('--debug'),
    procore: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        baseUrl: process.env.BASE_URL || 'https://api-sandbox.procore.com',
        oauthUrl: process.env.OAUTH_URL || 'https://login-sandbox.procore.com',
        redirectUri: process.env.REDIRECT_URI,
        companyId: process.env.COMPANY_ID,
    },
    agGrid: {
        licenseKey: process.env.AG_LICENSE_KEY,
    }
};

function validateConfig(cfg) {
    if (cfg.window.width <= 0 || cfg.window.height <= 0) {
        throw new Error('Window dimensions must be positive');
    }
    if (!cfg.db.path || typeof cfg.db.path !== 'string') {
        throw new Error('Database path must be a non-empty string');
    }
    if (!['debug', 'info', 'warn', 'error'].includes(cfg.logger.level)) {
        throw new Error('Invalid logger level');
    }
    if (!cfg.procore.clientId || !cfg.procore.clientSecret || !cfg.procore.redirectUri || !cfg.procore.companyId) {
        throw new Error('Procore credentials (clientId, clientSecret, redirectUri, companyId) must be provided');
    }
}

validateConfig(config);
export default config;