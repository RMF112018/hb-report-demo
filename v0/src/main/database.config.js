// src/main/database.config.js
import { app } from 'electron'; // Import app from Electron
import { join } from 'path';
import logger from './logger.js';

// Ensure this runs in the main process after app is ready
const getConfig = () => ({
  development: {
    dialect: 'sqlite',
    storage: join(app.getPath('userData'), 'hb-report.db'), // Dynamic path
    logging: msg => logger.debug(msg),
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    logging: msg => logger.debug(msg),
  },
});

export default getConfig;