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
    getAgGridLicense: () => ipcRenderer.invoke('get-ag-grid-license'),
    getProjects: () => ipcRenderer.invoke('get-projects'),
    syncProcoreProjects: () => ipcRenderer.invoke('sync-procore-projects'),
    initiateProcoreAuth: () => ipcRenderer.invoke('initiate-procore-auth'),
    generatePDF: (reportType, data, outputPath) => ipcRenderer.invoke('generate-pdf', { reportType, data, outputPath }),
    getForecastingTestData: (tab) => ipcRenderer.invoke('get-forecasting-test-data', tab),
    createForecastData: (newForecast, tab) => ipcRenderer.invoke('create-forecast-data', newForecast, tab),
    updateForecastData: (updatedRow, tab) => ipcRenderer.invoke('update-forecast-data', updatedRow, tab),
    deleteForecastData: (costCode, tab) => ipcRenderer.invoke('delete-forecast-data', costCode, tab),
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
    // Buyout IPC handlers (already present)
    getBuyoutTestData: () => ipcRenderer.invoke('get-buyout-test-data'),
    addBuyout: (newBuyout) => ipcRenderer.invoke('add-buyout', newBuyout),
    updateBuyout: (updatedBuyout) => ipcRenderer.invoke('update-buyout', updatedBuyout),
    deleteBuyout: (buyoutNumber) => ipcRenderer.invoke('delete-buyout', buyoutNumber),
    // Portfolio IPC handlers (newly added)
    getPortfolioTestData: () => ipcRenderer.invoke('get-portfolio-test-data'),
    addPortfolio: (newPortfolio) => ipcRenderer.invoke('add-portfolio', newPortfolio),
    updatePortfolio: (updatedPortfolio) => ipcRenderer.invoke('update-portfolio', updatedPortfolio),
    deletePortfolio: (portfolioId) => ipcRenderer.invoke('delete-portfolio', portfolioId),
    // Dashboard handlers
    getHealthTestData: () => ipcRenderer.invoke('get-health-test-data'),
    // Existing utility methods
    log: (level, message, stack) => {
        ipcRenderer.send('log', { level, message, stack, process: 'renderer' });
    },
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    on, // Expose event listener
});

process.on('uncaughtException', (err) => {
    ipcRenderer.send('log', {
        level: 'error',
        message: `Preload uncaught exception: ${err.message}`,
        stack: err.stack,
        process: 'preload',
    });
});

console.log('Preload script loaded');