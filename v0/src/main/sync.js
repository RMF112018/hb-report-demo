// src/main/sync.js
// Standalone script to initialize database and sync Procore data
// Run via `node src/main/sync.js` or schedule with cron
// Reference: https://sequelize.org/docs/v6/
import logger from './logger.js';
import { initDatabase, closeDatabase } from './db.js';
import { syncCompanyUsers, syncProjects } from './procore.js';

async function main() {
  try {
    logger.info('Starting sync process - April 04, 2025');
    await initDatabase(); // Define models, sync schema, populate lookups
    const users = await syncCompanyUsers();
    logger.info(`Synced ${users.length} company users`);
    const projects = await syncProjects();
    logger.info(`Synced ${projects.length} projects`);
    await closeDatabase();
    logger.info('Sync completed successfully');
    process.exit(0);
  } catch (err) {
    logger.error(`Sync failed: ${err.message}`, { stack: err.stack });
    await closeDatabase();
    process.exit(1);
  }
}

main();