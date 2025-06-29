// src/main/window.js
// Window creation logic extracted from main.js
import { BrowserWindow } from 'electron';
import { join } from 'path';
import logger from './logger.js';

const indexPath = join(__dirname, '../../dist/index.html');
const preloadPath = join(__dirname, './preload.cjs');

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { preload: preloadPath, contextIsolation: true },
  });
  await win.loadFile(indexPath);
  logger.info('Window created and loaded');
  return win;
}

export { createWindow };