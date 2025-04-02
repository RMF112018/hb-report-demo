// src/main/testData.js
// Populates the database with test data for HB Report development
// Import and call this function in main.js to insert test data on first run
// Reference: None (custom utility)

import { upsertEntity, batchUpsert } from './db.js'; // Added batchUpsert
import logger from './logger.js';

async function insertTestData() {
  const testData = {
    hb_positions: [
      { position: 'Director of Operations', division: 'commercial', code: 'snr', hierarchy: 1 },
      { position: 'Project Executive', division: 'commercial', code: 'snr', hierarchy: 2 },
      { position: 'Senior Project Manager', division: 'commercial', code: 'pm', hierarchy: 1 },
      { position: 'Project Manager III', division: 'commercial', code: 'pm', hierarchy: 2 },
      { position: 'Project Manager II', division: 'commercial', code: 'pm', hierarchy: 3 },
      { position: 'Project Manager I', division: 'commercial', code: 'pm', hierarchy: 4 },
      { position: 'Assistant Project Manager', division: 'commercial', code: 'pm', hierarchy: 5 },
      { position: 'General Superintendent', division: 'commercial', code: 'sup', hierarchy: 1 },
      { position: 'Senior Superintendent', division: 'commercial', code: 'sup', hierarchy: 2 },
      { position: 'Superintendent III', division: 'commercial', code: 'sup', hierarchy: 3 },
      { position: 'Superintendent II', division: 'commercial', code: 'sup', hierarchy: 4 },
      { position: 'Superintendent I', division: 'commercial', code: 'sup', hierarchy: 5 },
      { position: 'Assistant Superintendent', division: 'commercial', code: 'sup', hierarchy: 6 },
      { position: 'Project Accountant', division: 'commercial', code: 'gen', hierarchy: 1 }
    ],
    projects: [
      {
        project_id: 1,
        name: 'Test Project 1',
        number: 'P001',
        type_id: 1, // New Construction
        contract_type_id: 9, // Lump Sum
        start_date: '2025-01-01',
        duration: 365,
        contract_value: 1000000
      }
    ],
    tasks: [
      { project_id: 1, name: 'Foundation', start_date: '2025-01-15', duration: 30 }
    ]
  };

  for (const [table, entities] of Object.entries(testData)) {
    try {
      await batchUpsert(table, entities); // Use batchUpsert
      logger.info(`Inserted test ${table} batch`);
    } catch (err) {
      logger.error(`Failed to insert test data into ${table}: ${err.message}`, { stack: err.stack });
    }
  }
}

export { insertTestData };