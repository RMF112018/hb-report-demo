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
    agGridLicense: process.env.AG_GRID_LICENSE_KEY,
    window: {
        width: 1200,
        height: 800,
    },
    db: {
        path: join('/Library/Application Support/HB-Report', 'hb-report.db'),
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
        vendorId: process.env.VENDOR_ID,
        initToken: process.env.INIT_TOKEN,
        initRefToken: process.env.INIT_REF_TOKEN,
    },
    agGrid: {
        licenseKey: process.env.AG_GRID_LICENSE_KEY,
    },
    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    encryption: {
        key: process.env.ENCRYPTION_KEY, // Load from .env
    },
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
    if (!cfg.encryption.key) {
        throw new Error('Encryption key must be provided in ENCRYPTION_KEY environment variable');
    }
    // Validate the encryption key length (32 bytes for AES-256-CBC)
    const keyBuffer = Buffer.from(cfg.encryption.key, 'hex');
    if (keyBuffer.length !== 32) {
        throw new Error('Encryption key must be 32 bytes long (64 hex characters)');
    }
}

validateConfig(config);
export default config;