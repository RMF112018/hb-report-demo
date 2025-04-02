// src/main/logger.js
// Configures a Winston logger with daily rotation for HB Report, shared between main and renderer processes
// Import this module in main.js and renderer files to log messages
// Reference: https://github.com/winstonjs/winston#usage
// *Additional Reference*: https://github.com/winstonjs/winston-daily-rotate-file#usage

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');

// Use an absolute path to ensure correct resolution
const logDir = resolve(__dirname, '..', '..', 'bin', 'logs');
const logFilePrefix = join(logDir, 'hb-report-');

// Ensure log directory exists and log the path for debugging
import { existsSync, mkdirSync } from 'fs';
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true }); // recursive ensures parent dirs are created if needed
  console.log(`Created log directory: ${logDir}`); // Temporary debug
}

// Create Winston logger with daily rotation
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, stack, process }) => {
      const baseMessage = `${timestamp} [${level.toUpperCase()}] [${process || 'main'}]: ${message}`;
      return stack ? `${baseMessage}\n${stack}` : baseMessage;
    })
  ),
  transports: [
    new DailyRotateFile({
      filename: `${logFilePrefix}%DATE%.log`, // e.g., hb-report-2025-03-19.log
      datePattern: 'YYYY-MM-DD',
      maxSize: '5m',
      maxFiles: '14d',
      zippedArchive: true,
      level: 'debug' // Ensure all levels are captured
    }),
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
    })
  ]
});

// Test the file transport immediately
logger.info(`Logger initialized, writing to: ${logFilePrefix}%DATE%.log`);

export default logger;