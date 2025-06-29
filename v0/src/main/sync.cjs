// src/main/sync.cjs
// Standalone DB sync with token refresh and continuous operation
// Run via: node src/main/sync.cjs
// Reference: https://developers.procore.com/reference/rest/v1.3/company-users#list-company-users

const loggerModule = require('./logger.js');
const logger = loggerModule.default;
const dbModule = require('./db.js');
const { initDatabase, closeDatabase, db: sequelize, getTokenByUserId } = dbModule; // Rename db to sequelize for clarity
const procoreModule = require('./procore.js');
const { initializeAdminToken, getValidToken, syncCompanyUsers, syncProjects } = procoreModule;
const getConfigModule = require('./database.config.js');
const getConfig = getConfigModule.default;
const fs = require('fs/promises');
const cron = require('node-cron');

async function startTokenRefreshLoop() {
  const refreshLoop = async () => {
    try {
      const token = await getTokenByUserId('admin');
      if (!token) {
        logger.error('Admin token not found in database');
        throw new Error('Admin token not found');
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const buffer = 600;
      const timeUntilRefresh = token.expires_at - currentTime - buffer;

      if (timeUntilRefresh <= 0) {
        logger.info('Token expired or near expiration, refreshing now');
        const newToken = await getValidToken();
        const newTimeUntilRefresh = newToken.expires_at - Math.floor(Date.now() / 1000) - buffer;
        logger.info('Token refreshed, scheduling next refresh', { inSeconds: newTimeUntilRefresh });
        setTimeout(refreshLoop, Math.max(newTimeUntilRefresh, 1) * 1000);
      } else {
        logger.info('Scheduling next token refresh', { inSeconds: timeUntilRefresh });
        setTimeout(refreshLoop, timeUntilRefresh * 1000);
      }
    } catch (error) {
      logger.error('Token refresh failed', { message: error.message });
      setTimeout(refreshLoop, 60 * 1000);
    }
  };

  logger.info('Starting admin token refresh loop');
  refreshLoop();
}

async function syncDataPeriodically() {
  cron.schedule('0 0 * * *', async () => {
    try {
      await sequelize.transaction(async (t) => {
        const users = await syncCompanyUsers({ transaction: t });
        const projects = await syncProjects({ transaction: t });
        logger.info(`Synced ${users.length} users, ${projects.length} projects`);
      });

      const [userCount, projectCount] = await Promise.all([
        sequelize.models.User.count(),
        sequelize.models.Project.count(),
      ]);
      logger.info(`Post-sync count: ${userCount} users, ${projectCount} projects`);

      await sequelize.query('PRAGMA wal_checkpoint(TRUNCATE);');
      logger.info('Forced SQLite WAL checkpoint');
    } catch (error) {
      logger.error('Data sync failed:', { message: error.message });
    }
  });
  logger.info('Scheduled data sync every 24 hours');
}

async function main() {
  try {
    const dbPath = getConfig().development.storage;
    logger.info(`Starting sync process - April 04, 2025 - DB Path: ${dbPath}`);

    await initDatabase(false);
    const token = await initializeAdminToken();
    if (!token) {
      logger.error('Admin token initialization failed. Please follow the manual OAuth flow instructions logged above.');
      throw new Error('Admin token initialization failed');
    }

    if (!sequelize) {
      throw new Error('Sequelize instance (db) is undefined after initDatabase');
    }

    await sequelize.transaction(async (t) => {
      const users = await syncCompanyUsers({ transaction: t });
      const projects = await syncProjects({ transaction: t });
      logger.info(`Initial sync: ${users.length} users, ${projects.length} projects`);
    });

    const fileStats = await fs.stat(dbPath);
    logger.info(`DB file size: ${fileStats.size} bytes`);

    startTokenRefreshLoop();
    syncDataPeriodically();

    process.on('SIGINT', async () => {
      logger.info('Shutting down sync process');
      await closeDatabase();
      logger.info('Database connection closed');
      process.exit(0);
    });

    logger.info('Sync process running. Verify DB at:', { path: dbPath });
    logger.info('Run: sqlite3 /Library/Application Support/HB-Report/hb-report.db "SELECT * FROM users; SELECT * FROM projects;"');

    await new Promise(() => {});
  } catch (err) {
    logger.error(`Sync process failed: ${err.message}`, { stack: err.stack });
    await closeDatabase();
    process.exit(1);
  }
}

main();