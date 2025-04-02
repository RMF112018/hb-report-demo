// src/main/eventBus.js
// Lightweight event bus for decoupling backend logic in HB Report
// Import and use to emit/listen for events across modules
// Reference: https://nodejs.org/api/events.html

import { EventEmitter } from 'events';
import logger from './logger.js';

const eventBus = new EventEmitter();

// Log all events for debugging (optional)
eventBus.on('error', (err) => {
    logger.error(`Event bus error: ${err.message}`, { stack: err.stack });
});

export default eventBus;