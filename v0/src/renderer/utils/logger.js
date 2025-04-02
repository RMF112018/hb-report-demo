// src/renderer/utils/logger.js
// Utility to send logs from renderer to main process via IPC with process context and console output
// Import this in renderer files (e.g., Login.js) to log messages
// Reference: https://www.electronjs.org/docs/latest/api/ipc-renderer
// *Additional Reference*: https://www.electronjs.org/docs/latest/tutorial/context-isolation

const logger = {
  debug(message, meta = {}) {
    if (window.electronAPI && window.electronAPI.log) {
      window.electronAPI.log('debug', message, meta.stack);
    }
    console.debug(`[DEBUG] [renderer]: ${message}`, meta);
  },
  info(message, meta = {}) {
    if (window.electronAPI && window.electronAPI.log) {
      window.electronAPI.log('info', message, meta.stack);
    }
    console.info(`[INFO] [renderer]: ${message}`, meta);
  },
  warn(message, meta = {}) {
    if (window.electronAPI && window.electronAPI.log) {
      window.electronAPI.log('warn', message, meta.stack);
    }
    console.warn(`[WARN] [renderer]: ${message}`, meta);
  },
  error(message, meta = {}) {
    if (window.electronAPI && window.electronAPI.log) {
      window.electronAPI.log('error', message, meta.stack);
    }
    console.error(`[ERROR] [renderer]: ${message}`, meta);
  },
};

export default logger;