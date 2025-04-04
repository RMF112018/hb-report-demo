// src/main/sync.js
// Standalone DB sync with path verification
// Run via: node src/main/sync.js

import logger from './logger.js';
import { initDatabase, closeDatabase, db } from './db.js';
import { initializeAdminToken, syncCompanyUsers, syncProjects } from './procore.js';
import getConfig from './database.config.js';
import fs from 'fs/promises';

async function main() {
  try {
    const dbPath = getConfig().development.storage;
    logger.info(`Starting sync - April 04, 2025 - DB Path: ${dbPath}`);

    await initDatabase(true);
    const token = await initializeAdminToken();
    if (!token) throw new Error('Admin token initialization failed');

    await db.transaction(async (t) => {
      const users = await syncCompanyUsers({ transaction: t });
      const projects = await syncProjects({ transaction: t });
      logger.info(`Synced ${users.length} users, ${projects.length} projects`);
    });

    const [userCount, projectCount] = await Promise.all([
      db.models.User.count(),
      db.models.Project.count(),
    ]);
    logger.info(`Post-sync count: ${userCount} users, ${projectCount} projects`);

    await db.query('PRAGMA wal_checkpoint(TRUNCATE);');
    logger.info('Forced SQLite WAL checkpoint');

    const fileStats = await fs.stat(dbPath);
    logger.info(`DB file size: ${fileStats.size} bytes`);

    await new Promise(resolve => setTimeout(resolve, 1000));
    await closeDatabase();
    logger.info(`Database closed - Verify at: ${dbPath}`);
    logger.info('Run: sqlite3 /Library/Application Support/HB-Report/hb-report.db "SELECT * FROM users; SELECT * FROM projects;"');
    process.exit(0);
  } catch (err) {
    logger.error(`Sync failed: ${err.message}`, { stack: err.stack });
    await closeDatabase();
    process.exit(1);
  }
}

main();