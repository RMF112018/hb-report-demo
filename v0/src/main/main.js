// src/main/main.js
// Main process for HB Report Electron app with improved error handling and logging
// Import and run this file as the Electron entry point via `electron .`
// Reference: https://www.electronjs.org/docs/latest/api/app

import config from './config.js';
import { app, BrowserWindow, nativeImage } from 'electron';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import logger from './logger.js';
import { registerIpcHandlers } from './ipc.js';
import eventBus from './eventBus.js';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const indexPath = resolve(__dirname, '../../dist/index.html');
const preloadPath = resolve(__dirname, './preload.cjs');

console.log('Main process starting');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('__dirname:', __dirname);
console.log('Resolved indexPath:', indexPath);
console.log('index.html exists:', existsSync(indexPath));
console.log('Resolved preloadPath:', preloadPath);
console.log('preload.cjs exists:', existsSync(preloadPath));

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  console.error('Uncaught Exception:', err);
  app.quit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}`, { message: reason.message || reason, stack: reason.stack });
  console.error('Unhandled Rejection:', reason);
  app.quit(1);
});

const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf8'));

let relaunchAttempts = 0;
const maxRelaunchAttempts = 3;

function handleCriticalFailure(err) {
  logger.error(`Critical failure: ${err.message}`, { stack: err.stack });
  console.error('Critical failure:', err);
  if (relaunchAttempts < maxRelaunchAttempts) {
    const delay = Math.pow(2, relaunchAttempts) * 1000; // Exponential backoff
    logger.info(`Relaunching app in ${delay}ms (attempt ${relaunchAttempts + 1}/${maxRelaunchAttempts})`);
    relaunchAttempts++;
    setTimeout(() => {
      app.relaunch();
      app.quit();
    }, delay);
  } else {
    logger.error('Max relaunch attempts reached, exiting');
    app.quit(1);
  }
}

function createWindow() {
  try {
    logger.info('Creating main window');
    console.log('Creating window');
    const iconPath = join(__dirname, '../renderer/assets/images/hbIcon.ico');
    const icon = nativeImage.createFromPath(iconPath);
    const win = new BrowserWindow({
      icon: icon,
      width: config.window.width,
      height: config.window.height,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: preloadPath,
        webviewTag: true,
      },
    });

    if (!existsSync(indexPath)) {
      throw new Error(`index.html not found at ${indexPath}. Ensure Webpack has built the project.`);
    }
    if (!existsSync(preloadPath)) {
      throw new Error(`preload.cjs not found at ${preloadPath}. Ensure the file exists.`);
    }

    console.log('Loading file:', indexPath);
    return win.loadFile(indexPath).then(() => {
      logger.info('index.html loaded successfully');
      if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
      }
      return win;
    }).catch(err => {
      logger.error(`Failed to load index.html: ${err.message}`, { stack: err.stack });
      throw err;
    });
  } catch (err) {
    logger.error(`Failed to create window: ${err.message}`, { stack: err.stack });
    console.error('Window creation error:', err);
    throw err;
  }
}

app.whenReady().then(async () => {
  try {
    console.log('App is ready');
    logger.info(`Starting HB Report v${packageJson.version}`);
    registerIpcHandlers();
    const win = await createWindow();
    win.on('ready-to-show', () => win.show());
    await eventBus.emit('app:ready');
  } catch (err) {
    logger.error('Critical failure during startup', { message: err.message, stack: err.stack });
    handleCriticalFailure(err);
  }
});

app.on('window-all-closed', () => {
  logger.info('All windows closed');
  console.log('All windows closed');
  if (process.platform !== 'darwin') app.quit();
});

app.on('quit', () => {
  logger.info('App shutting down');
  console.log('App shutting down');
});