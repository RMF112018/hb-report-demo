// src/main/db.js
// Manages SQLite3 database initialization, migrations, and data operations for HB Report
// Import this module in main.js to set up the database; call exported functions for CRUD operations
// Reference: https://github.com/TryGhost/node-sqlite3/wiki/API

import sqlite3 from 'sqlite3';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';
import config from './config.js';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const dbPath = join(__dirname, '..', '..', 'hb-report.db');
logger.info(`Attempting to open database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) logger.error(`SQLite connection error: ${err.message}`, { stack: err.stack });
  else {
    logger.info('Connected to SQLite database');
    db.run('PRAGMA journal_mode = WAL');
    db.run('PRAGMA synchronous = NORMAL');
    db.run('PRAGMA cache_size = -20000');
    db.run('PRAGMA foreign_keys = ON');
    db.run('PRAGMA temp_store = MEMORY');
    db.run('PRAGMA mmap_size = 268435456');
  }
});

// Migration definitions (version 1 includes full schema)
const migrations = [
  {
    version: 1,
    queries: [
      `CREATE TABLE IF NOT EXISTS schema_version (
                version INTEGER PRIMARY KEY,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
      `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                role TEXT,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
      `CREATE TABLE IF NOT EXISTS tokens (
                id INTEGER PRIMARY KEY DEFAULT 1,
                access_token TEXT NOT NULL,
                refresh_token TEXT NOT NULL,
                expires_at INTEGER NOT NULL,
                version INTEGER DEFAULT 1,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
      `CREATE TABLE IF NOT EXISTS csi_codes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tier INTEGER NOT NULL,
                code TEXT NOT NULL,
                description TEXT NOT NULL,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (code, tier)
            )`,
      `CREATE TABLE IF NOT EXISTS project_types (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                code TEXT NOT NULL,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (type)
            )`,
      `CREATE TABLE IF NOT EXISTS contract_types (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                code TEXT NOT NULL,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (type)
            )`,
      `CREATE TABLE IF NOT EXISTS hb_positions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                position TEXT NOT NULL,
                division TEXT NOT NULL,
                code TEXT NOT NULL,
                hierarchy INTEGER NOT NULL,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (position, division)
            )`,
      `CREATE TABLE IF NOT EXISTS projects (
                project_id INTEGER PRIMARY KEY AUTOINCREMENT,
                procore_id INTEGER UNIQUE,
                name TEXT NOT NULL,
                number TEXT UNIQUE,
                company_id INTEGER DEFAULT 5280,
                type_id INTEGER,
                contract_type_id INTEGER,
                street_address TEXT,
                city TEXT,
                state TEXT,
                zip TEXT,
                active BOOLEAN DEFAULT TRUE,
                start_date DATE,
                original_completion_date DATE,
                approved_completion_date DATE,
                duration INTEGER,
                approved_extensions INTEGER DEFAULT 0,
                contract_value REAL,
                approved_changes REAL DEFAULT 0,
                approved_value REAL GENERATED ALWAYS AS (contract_value + approved_changes) STORED,
                contingency_original REAL,
                contingency_approved REAL,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (type_id) REFERENCES project_types(id),
                FOREIGN KEY (contract_type_id) REFERENCES contract_types(id)
            )`,
      `CREATE TABLE IF NOT EXISTS owners (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                contact TEXT,
                lending_partner TEXT,
                contract_executed DATE,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
            )`,
      `CREATE TABLE IF NOT EXISTS hb_team (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                position_id INTEGER NOT NULL,
                member_name TEXT NOT NULL,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
                FOREIGN KEY (position_id) REFERENCES hb_positions(id)
            )`,
      `CREATE TABLE IF NOT EXISTS cost_codes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER,
                procore_id INTEGER UNIQUE,
                code TEXT NOT NULL,
                full_code TEXT NOT NULL,
                name TEXT NOT NULL,
                budgeted BOOLEAN DEFAULT FALSE,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
                UNIQUE (project_id, full_code)
            )`,
      `CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                procore_id INTEGER UNIQUE,
                name TEXT NOT NULL,
                start_date DATE NOT NULL,
                finish_date DATE,
                duration INTEGER,
                percent_complete REAL DEFAULT 0.0,
                is_critical BOOLEAN DEFAULT FALSE,
                is_milestone BOOLEAN DEFAULT FALSE,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
            )`,
      `CREATE TABLE IF NOT EXISTS schedule_extensions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                task_id INTEGER NOT NULL,
                milestone TEXT NOT NULL,
                approved_time_extensions INTEGER DEFAULT 0,
                pending_extension_req INTEGER DEFAULT 0,
                extensions_requested INTEGER DEFAULT 0,
                adverse_weather_days INTEGER DEFAULT 0,
                start_date DATE,
                end_date DATE,
                details TEXT,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
                FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
            )`,
      `CREATE TABLE IF NOT EXISTS commitments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                number TEXT NOT NULL,
                title TEXT DEFAULT 'placeholder',
                vendor TEXT,
                status TEXT DEFAULT 'Draft',
                original_contract_amount REAL,
                approved_change_orders REAL,
                revised_contract_amount REAL GENERATED ALWAYS AS (original_contract_amount + approved_change_orders) STORED,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
            )`,
      `CREATE TABLE IF NOT EXISTS buyout (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                cost_code_id INTEGER,
                subcontractor TEXT,
                status TEXT DEFAULT 'Pending',
                commitment_id INTEGER,
                variance REAL,
                contract_executed DATE,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
                FOREIGN KEY (cost_code_id) REFERENCES cost_codes(id),
                FOREIGN KEY (commitment_id) REFERENCES commitments(id)
            )`,
      `CREATE TABLE IF NOT EXISTS allowances (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                buyout_id INTEGER NOT NULL,
                item TEXT NOT NULL,
                value REAL NOT NULL,
                reconciled BOOLEAN DEFAULT FALSE,
                reconciliation_value REAL,
                variance REAL DEFAULT 0,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (buyout_id) REFERENCES buyout(id) ON DELETE CASCADE
            )`,
      `CREATE TABLE IF NOT EXISTS value_engineering (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                buyout_id INTEGER NOT NULL,
                item TEXT NOT NULL,
                original_value REAL DEFAULT 0,
                ve_value REAL DEFAULT 0,
                savings REAL DEFAULT 0,
                status TEXT DEFAULT 'Pending',
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (buyout_id) REFERENCES buyout(id) ON DELETE CASCADE
            )`,
      `CREATE TABLE IF NOT EXISTS long_lead_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                buyout_id INTEGER NOT NULL,
                item TEXT NOT NULL,
                lead_time INTEGER,
                status TEXT DEFAULT 'Pending',
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (buyout_id) REFERENCES buyout(id) ON DELETE CASCADE
            )`,
      `CREATE TABLE IF NOT EXISTS forecast_periods (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                label TEXT NOT NULL,
                sort_order INTEGER,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
                UNIQUE (project_id, label)
            )`,
      `CREATE TABLE IF NOT EXISTS forecast_values (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                cost_code_id INTEGER NOT NULL,
                period_id INTEGER NOT NULL,
                original_value REAL DEFAULT 0,
                projected_value REAL DEFAULT 0,
                actual_value REAL DEFAULT 0,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
                FOREIGN KEY (cost_code_id) REFERENCES cost_codes(id) ON DELETE CASCADE,
                FOREIGN KEY (period_id) REFERENCES forecast_periods(id) ON DELETE CASCADE,
                UNIQUE (project_id, cost_code_id, period_id)
            )`,
      `CREATE TABLE IF NOT EXISTS budget (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                period_id INTEGER NOT NULL,
                cost_code_id INTEGER NOT NULL,
                original_budget_amount REAL DEFAULT 0,
                revised_budget_amount REAL,
                committed_costs REAL DEFAULT 0,
                projected_costs REAL DEFAULT 0,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
                FOREIGN KEY (period_id) REFERENCES forecast_periods(id) ON DELETE CASCADE,
                FOREIGN KEY (cost_code_id) REFERENCES cost_codes(id) ON DELETE CASCADE
            )`,
      `CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                entity_type TEXT NOT NULL,
                entity_id INTEGER NOT NULL,
                data JSON NOT NULL,
                version INTEGER NOT NULL,
                superseded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
      `CREATE INDEX idx_projects_procore_id ON projects(procore_id)`,
      `CREATE INDEX idx_projects_number ON projects(number)`,
      `CREATE INDEX idx_history_entity ON history(entity_type, entity_id)`,
      `CREATE INDEX idx_tasks_project_id ON tasks(project_id)`,
      `CREATE INDEX idx_cost_codes_project_id ON cost_codes(project_id)`,
      `CREATE INDEX idx_forecast_values_project_cost_period ON forecast_values(project_id, cost_code_id, period_id)`
    ],
  },
];

// Apply migrations
async function applyMigrations() {
  return new Promise((resolve, reject) => {
    db.get('SELECT version FROM schema_version ORDER BY version DESC LIMIT 1', (err, row) => {
      if (err && err.code !== 'SQLITE_ERROR') return reject(err);
      const currentVersion = row ? row.version : 0;
      logger.info(`Current schema version: ${currentVersion}`);
      const pendingMigrations = migrations.filter(m => m.version > currentVersion);

      if (!pendingMigrations.length) {
        logger.info('Database schema up to date');
        return resolve();
      }

      db.serialize(() => {
        pendingMigrations.forEach(migration => {
          migration.queries.forEach(query => db.run(query));
          db.run('INSERT OR REPLACE INTO schema_version (version) VALUES (?)', migration.version);
          logger.info(`Applied migration version ${migration.version}`);
        });
        resolve();
      });
    });
  });
}

/**
 * Upserts an entity into the specified table with versioning and history tracking
 * @param {string} table - The table name to upsert into
 * @param {Object} entity - The entity data to upsert
 * @returns {Promise<void>}
 */
/**
 * Upserts an entity into the specified table with versioning and history tracking
 * @param {string} table - The table name to upsert into
 * @param {Object} entity - The entity data to upsert
 * @returns {Promise<void>}
 */
async function upsertEntity(table, entity) {
  return new Promise((resolve, reject) => {
    if (!table || typeof entity !== 'object') {
      return reject(new Error('Invalid table or entity data'));
    }
    const idField = table === 'projects' ? 'project_id' : 'id';
    db.get(`SELECT version FROM ${table} WHERE ${idField} = ?`, [entity[idField]], (err, row) => {
      if (err) return reject(err);
      const currentVersion = row ? row.version : 0;
      const newVersion = currentVersion + 1;

      if (row) {
        db.get(`SELECT * FROM ${table} WHERE ${idField} = ?`, [entity[idField]], (err, oldData) => {
          if (err) return reject(err);
          db.run(
            'INSERT INTO history (entity_type, entity_id, data, version) VALUES (?, ?, ?, ?)',
            [table, entity[idField], JSON.stringify(oldData), currentVersion],
            err => { if (err) reject(err); }
          );
        });
      }

      const fields = Object.keys(entity).filter(k => k !== idField);
      const placeholders = fields.map(() => '?').join(', ');
      const updateSet = fields.map(f => `${f} = excluded.${f}`).join(', ');
      const sql = `
                INSERT OR REPLACE INTO ${table} (${idField}, ${fields.join(', ')}, version, updated_at)
                VALUES (?, ${placeholders}, ?, CURRENT_TIMESTAMP)
            `;
      const values = [entity[idField] || null, ...fields.map(f => entity[f]), newVersion];

      logger.debug(`Executing upsert SQL: ${sql}`, { values });
      const stmt = db.prepare(sql);
      stmt.run(values, function(err) {
        if (err) {
          logger.error(`Upsert failed: ${err.message}`, { stack: err.stack, sql, values });
          if (err.code === 'SQLITE_CONSTRAINT') {
            logger.warn(`Constraint violation during upsert into ${table}: ${err.message}`);
            resolve(); // Treat as non-fatal for duplicates
          } else {
            reject(err);
          }
        } else {
          logger.debug(`Upsert into ${table} succeeded`, { changes: this.changes, lastID: this.lastID });
          resolve();
        }
      });
      stmt.finalize();
    });
  });
}

/**
 * Batch upserts multiple entities into the specified table within a transaction
 * @param {string} table - The table name to upsert into
 * @param {Object[]} entities - Array of entity data to upsert
 * @returns {Promise<void>}
 */
async function batchUpsert(table, entities) {
  const operations = entities.map(entity => () => upsertEntity(table, entity));
  await runInTransaction(operations);
  logger.info(`Batch upserted ${entities.length} records into ${table}`);
}

/**
 * Retrieves all active projects from the database
 * @returns {Promise<Object[]>} Array of project objects
 */
async function getProjects() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM projects WHERE active = TRUE', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Executes an array of operations within a single transaction
 * @param {Function[]} operations - Array of async functions to execute
 * @returns {Promise<void>}
 */
async function runInTransaction(operations) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) return reject(err);
        Promise.all(operations.map(op => op()))
          .then(() => {
            db.run('COMMIT', err => {
              if (err) reject(err);
              else resolve();
            });
          })
          .catch(err => {
            db.run('ROLLBACK', () => reject(err));
          });
      });
    });
  });
}

// Initialize database and populate lookup tables
async function initializeLookups() {
  const projectTypes = [
    { type: 'New Construction', code: 'NEW' }, { type: 'Renovation', code: 'REN' },
    { type: 'Restoration', code: 'REST' }, { type: 'Retrofit', code: 'RETRO' },
    { type: 'Demolition', code: 'DEMO' }, { type: 'Maintenance', code: 'MAINT' },
    { type: 'Expansion', code: 'EXP' }, { type: 'Reconstruction', code: 'RECON' },
    { type: 'Tenant Improvement', code: 'TI' }, { type: 'Fit-Out', code: 'FO' },
    { type: 'Adaptive Reuse', code: 'ADRE' }, { type: 'Remodel', code: 'REMO' }
  ];
  const contractTypes = [
    { type: 'Construction Management', code: 'CM' }, { type: 'Cost-Plus', code: 'CP' },
    { type: 'Design - Bid - Build', code: 'DBB' }, { type: 'Design - Build', code: 'DB' },
    { type: 'Guaranteed Maximum', code: 'GMP' }, { type: 'Incentive', code: 'INC' },
    { type: 'Integrated Project Delivery', code: 'IPD' }, { type: 'Joint Venture', code: 'JV' },
    { type: 'Lump Sum', code: 'LS' }, { type: 'Percentage of Construction Cost', code: 'PCC' },
    { type: 'Progressive Design - Build', code: 'PDB' }, { type: 'Subcontract', code: 'SUB' },
    { type: 'Target Cost', code: 'TC' }, { type: 'Time and Materials', code: 'TM' },
    { type: 'Unit Price', code: 'UP' }
  ];

  try {
    await batchUpsert('project_types', projectTypes);
    await batchUpsert('contract_types', contractTypes);
    logger.info('Lookup tables initialized');
  } catch (err) {
    logger.error(`Failed to initialize lookups: ${err.message}`, { stack: err.stack });
    throw err;
  }
}

/**
 * Initializes the database by applying migrations and populating lookup tables
 * @returns {Promise<void>}
 */
async function initDatabase() {
  await applyMigrations();
  await initializeLookups();
}

/**
 * Removes stale tokens from the tokens table where expires_at is in the past
 * @returns {Promise<void>}
 */
async function clearStaleTokens() {
  return new Promise((resolve, reject) => {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const query = 'DELETE FROM tokens WHERE expires_at < ?';
      db.run(query, [currentTime], function(err) {
          if (err) {
              logger.error(`Failed to clear stale tokens: ${err.message}`, { stack: err.stack });
              return reject(err);
          }
          logger.info(`Cleared ${this.changes} stale tokens from database`);
          resolve();
      });
  });
}

/**
 * Closes the database connection gracefully
 * @returns {Promise<void>}
 */
function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (!db) {
      logger.info('No database connection to close');
      return resolve();
    }
    db.close((err) => {
      if (err) {
        logger.error(`Failed to close database: ${err.message}`, { stack: err.stack });
        reject(err);
      } else {
        logger.info('Database connection closed');
        resolve();
      }
    });
  });
}

// No initialization on import; defer to explicit call
export { upsertEntity, getProjects, runInTransaction, batchUpsert, db, closeDatabase, initDatabase, clearStaleTokens };