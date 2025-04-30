// src/main/preload.cjs
// Preload script for HB Report Electron app, exposing safe APIs to the renderer process
// Include this file in the BrowserWindow webPreferences.preload option in main.js
// Reference: https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/context-bridge

const { contextBridge, ipcRenderer } = require('electron');

// Custom event emitter for renderer
const listeners = new Map();
const on = (eventName, callback) => {
  listeners.set(eventName, callback);
  ipcRenderer.on(eventName, (event, ...args) => callback(...args));
};

// Forward backend events to renderer
ipcRenderer.on('projects:synced', () => {
  const callback = listeners.get('projects:synced');
  if (callback) callback();
});

contextBridge.exposeInMainWorld('electronAPI', {
  // Login-related handlers (added for Create HB Report Account flow)
  login: (credentials) => ipcRenderer.invoke('login', credentials),
  hashPassword: (password) => ipcRenderer.invoke('hash-password', password),
  getRememberMeData: () => ipcRenderer.invoke('get-remember-me-data'),
  storeRememberMeData: (data) => ipcRenderer.invoke('store-remember-me-data', data),
  clearRememberMeData: () => ipcRenderer.invoke('clear-remember-me-data'),
  encryptPassword: (password) => ipcRenderer.invoke('encrypt-password', password),
  decryptPassword: (encrypted) => ipcRenderer.invoke('decrypt-password', encrypted),
  verifyEmail: (email) => ipcRenderer.invoke('verify-email', email),
  getAuthToken: () => ipcRenderer.invoke('get-auth-token'),
  createUser: (userData) => ipcRenderer.invoke('create-user', userData),
  syncUsers: () => ipcRenderer.invoke('sync-users'),
  getUserProfile: (procoreUserId, token) => {
    // Pass the token to the main process
    return ipcRenderer.invoke('get-user-profile', procoreUserId, token);
  },
  verifyEmailToken: (token) => ipcRenderer.invoke('verify-email-token', token),
  onVerifyEmailFromLink: (callback) => ipcRenderer.on('verify-email-from-link', (event, token) => callback(token)),
  clearToken: () => ipcRenderer.invoke('clear-token'),

  // AG Grid License Registration
  getAgGridLicense: () => ipcRenderer.invoke('get-ag-grid-license'),

  // Portfolio and Projects
  getProjects: async (procore_user_id) => {
    const token = await ipcRenderer.invoke('get-auth-token');
    return ipcRenderer.invoke('get-projects', { procore_user_id, token });
  },
  syncProcoreProjects: () => ipcRenderer.invoke('sync-procore-projects'),
  getPortfolioTestData: () => ipcRenderer.invoke('get-portfolio-test-data'),
  addPortfolio: (newPortfolio) => ipcRenderer.invoke('add-portfolio', newPortfolio),
  updatePortfolio: (updatedPortfolio) => ipcRenderer.invoke('update-portfolio', updatedPortfolio),
  deletePortfolio: (portfolioId) => ipcRenderer.invoke('delete-portfolio', portfolioId),

  getHealthTestData: () => ipcRenderer.invoke('get-health-test-data'),

  // Buyout and Commitments
  getCommitments: (projectId) => ipcRenderer.invoke('get-commitments', projectId),
  syncProjectCommitments: (projectId) => ipcRenderer.invoke('sync-project-commitments', projectId),
  getBuyoutTestData: () => ipcRenderer.invoke('get-buyout-test-data'),
  addBuyout: (newBuyout) => ipcRenderer.invoke('add-buyout', newBuyout),
  updateBuyout: (updatedBuyout) => ipcRenderer.invoke('update-buyout', updatedBuyout),
  deleteBuyout: (buyoutNumber) => ipcRenderer.invoke('delete-buyout', buyoutNumber),

  // Budget and Forecasting
  getForecastingTestData: (tab) => ipcRenderer.invoke('get-forecasting-test-data', tab),
  createForecastData: (newForecast, tab) => ipcRenderer.invoke('create-forecast-data', newForecast, tab),
  updateForecastData: (updatedRow, tab) => ipcRenderer.invoke('update-forecast-data', updatedRow, tab),
  deleteForecastData: (costCode, tab) => ipcRenderer.invoke('delete-forecast-data', costCode, tab),
  getBudgetDetails: (projectId, tab) => ipcRenderer.invoke('get-budget-details', { projectId, tab }),
  syncProjectBudget: (projectId) => ipcRenderer.invoke('sync-project-budget', projectId),

  getConstraintsTestData: () => ipcRenderer.invoke('get-constraints-test-data'),
  addConstraint: (newConstraint) => ipcRenderer.invoke('add-constraint', newConstraint),
  updateConstraint: (updatedConstraint) => ipcRenderer.invoke('update-constraint', updatedConstraint),
  deleteConstraint: (constraintId) => ipcRenderer.invoke('delete-constraint', constraintId),

  getResponsibilityTestData: () => ipcRenderer.invoke('get-responsibility-test-data'),
  addResponsibility: (responsibility) => ipcRenderer.invoke('add-responsibility', responsibility),
  updateResponsibility: (responsibility) => ipcRenderer.invoke('update-responsibility', responsibility),
  deleteResponsibility: (responsibilityId) => ipcRenderer.invoke('delete-responsibility', responsibilityId),

  getScheduleTestData: () => ipcRenderer.invoke('get-schedule-test-data'),

  getPermitTestData: () => ipcRenderer.invoke('get-permit-test-data'),
  addPermit: (permit) => ipcRenderer.invoke('add-permit', permit),
  updatePermit: (permit) => ipcRenderer.invoke('update-permit', permit),
  deletePermit: (permitId) => ipcRenderer.invoke('delete-permit', permitId),

  getSubgradeData: () => ipcRenderer.invoke('get-subgrade-data'),
  addSubgrade: (subgrade) => ipcRenderer.invoke('add-subgrade', subgrade),
  updateSubgrade: (subgrade) => ipcRenderer.invoke('update-subgrade', subgrade),
  deleteSubgrade: (subgradeId) => ipcRenderer.invoke('delete-subgrade', subgradeId),

  getStaffingTestData: () => ipcRenderer.invoke('get-staffing-test-data'),
  addStaffingActivity: (newActivity) => ipcRenderer.invoke('add-staffing-activity', newActivity),
  updateStaffingActivity: (updatedActivity) => ipcRenderer.invoke('update-staffing-activity', updatedActivity),
  deleteStaffingActivity: (activityId) => ipcRenderer.invoke('delete-staffing-activity', activityId),
  updateStaffingNeeds: (staffingNeed) => ipcRenderer.invoke('update-staffing-needs', staffingNeed),

  getManpowerTestData: () => ipcRenderer.invoke('get-manpower-test-data'),
  addManpower: (newEntry) => ipcRenderer.invoke('add-manpower', newEntry),
  updateManpower: (updatedEntry) => ipcRenderer.invoke('update-manpower', updatedEntry),
  deleteManpower: (entryId) => ipcRenderer.invoke('delete-manpower', entryId),

  // Utility methods
  log: (level, message, stack) => {
    ipcRenderer.send('log', { level, message, stack, process: 'renderer' });
  },
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  on,
});

// Log preload initialization via IPC
ipcRenderer.send('log', { level: 'info', message: 'Preload script loaded', process: 'preload' });

process.on('uncaughtException', (err) => {
  ipcRenderer.send('log', {
    level: 'error',
    message: 'Preload uncaught exception',
    stack: err.stack,
    process: 'preload',
  });
});