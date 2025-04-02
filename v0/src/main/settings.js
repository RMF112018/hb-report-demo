// src/main/settings.js
// Loads and saves persistent settings for HB Report
// Import in main.js to override config defaults
// Reference: https://nodejs.org/api/fs.html

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import logger from './logger.js';

const settingsPath = join(__dirname, '..', 'settings.json');

function loadSettings(defaults) {
    try {
        if (existsSync(settingsPath)) {
            const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
            return { ...defaults, ...settings };
        }
        return defaults;
    } catch (err) {
        logger.error(`Failed to load settings: ${err.message}`, { stack: err.stack });
        return defaults;
    }
}

function saveSettings(settings) {
    try {
        writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        logger.info('Settings saved');
    } catch (err) {
        logger.error(`Failed to save settings: ${err.message}`, { stack: err.stack });
    }
}

export { loadSettings, saveSettings };