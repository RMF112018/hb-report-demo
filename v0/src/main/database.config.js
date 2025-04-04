// src/main/database.config.js
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const defaultStorage = '/Library/Application Support/HB-Report/hb-report.db';

async function ensureDirectory() {
  const dir = dirname(defaultStorage); // /Library/Application Support/HB-Report
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.chmod(dir, 0o777); // Ensure writable (adjust as needed)
  } catch (e) {
    console.error(`Failed to create or set permissions for ${dir}: ${e.message}`);
    throw e;
  }
}

ensureDirectory().catch(err => {
  console.error('Directory setup failed:', err);
  process.exit(1);
});

export default function getConfig() {
  return {
    development: {
      dialect: 'sqlite',
      storage: defaultStorage,
      logging: false,
    },
    test: {
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    },
    production: {
      dialect: 'sqlite',
      storage: defaultStorage,
      logging: false,
    },
  };
}