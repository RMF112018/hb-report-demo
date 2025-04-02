// src/main/ipc.js
// Defines IPC handlers for communication, including Procore data access, forecasting, and constraints test data
// Import in main.js to register handlers
// Reference: https://www.electronjs.org/docs/latest/api/ipc-main
// *Additional Reference*: https://nodejs.org/api/esm.html#no-__filename-or-__dirname

import { ipcMain } from 'electron';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import logger from './logger.js';
import { getProjects } from './db.js';
import { syncProjects, initiateAuth } from './procore.js';

// Derive __dirname for ESM
const __dirname = resolve(fileURLToPath(import.meta.url), '..');

const handlers = {
  'get-ag-grid-license': async () => {
    try {
      logger.info('Sending AG Grid license key to renderer');
      return config.agGrid.licenseKey;
    } catch (error) {
      logger.error(`IPC get-ag-grid-license error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'get-projects': async () => {
    try {
      return await getProjects();
    } catch (error) {
      logger.error(`IPC get-projects error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'sync-procore-projects': async () => {
    try {
      return await syncProjects();
    } catch (error) {
      logger.error(`IPC sync-procore-projects error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'initiate-procore-auth': async () => {
    try {
      await initiateAuth();
      return true; // Indicate success
    } catch (error) {
      logger.error(`IPC initiate-procore-auth error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'log': (event, { level, message, stack, process }) => {
    if (stack) logger[level](message, { stack, process });
    else logger[level](message, { process });
  },
  'generate-pdf': async (event, { reportType, data, outputPath }) => {
    try {
      const filePath = await generatePDF(reportType, data, outputPath);
      return { success: true, filePath };
    } catch (error) {
      logger.error(`IPC generate-pdf error: ${error.message}`, { stack: error.stack });
      return { success: false, error: error.message };
    }
  },
  'get-portfolio-test-data': async () => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/portfolioTestData.json');
      logger.info(`Fetching portfolio test data from: ${filePath}`);
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      return data || [];
    } catch (error) {
      logger.error(`IPC get-portfolio-test-data error: ${error.message}`, { stack: error.stack });
      return [];
    }
  },
  'add-portfolio': async (event, newPortfolio) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/portfolioTestData.json');
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      newPortfolio.id = Math.max(...data.map(item => item.id), 0) + 1; // Auto-increment ID
      data.push(newPortfolio);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Added new portfolio: ${JSON.stringify(newPortfolio)}`);
      return data;
    } catch (error) {
      logger.error(`IPC add-portfolio error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'update-portfolio': async (event, updatedPortfolio) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/portfolioTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      const index = data.findIndex(item => item.id === updatedPortfolio.id);
      if (index !== -1) {
        data[index] = updatedPortfolio;
        writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        logger.info(`Updated portfolio: ${JSON.stringify(updatedPortfolio)}`);
      }
      return data;
    } catch (error) {
      logger.error(`IPC update-portfolio error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'delete-portfolio': async (event, portfolioId) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/portfolioTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      data = data.filter(item => item.id !== portfolioId);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Deleted portfolio with ID: ${portfolioId}`);
      return data;
    } catch (error) {
      logger.error(`IPC delete-portfolio error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'get-health-test-data': async () => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/healthTestData.json');
      logger.info(`Fetching health test data from: ${filePath}`);
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      return data || [];
    } catch (error) {
      logger.error(`IPC get-health-test-data error: ${error.message}`, { stack: error.stack });
      return [];
    }
  },
  'get-buyout-test-data': async () => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/buyoutTestData.json');
      logger.info(`Fetching buyout test data from: ${filePath}`);
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      return data || [];
    } catch (error) {
      logger.error(`IPC get-buyout-test-data error: ${error.message}`, { stack: error.stack });
      return [];
    }
  },
  'add-buyout': async (event, newBuyout) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/buyoutTestData.json');
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.push(newBuyout);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Added new buyout: ${JSON.stringify(newBuyout)}`);
      return data;
    } catch (error) {
      logger.error(`IPC add-buyout error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'update-buyout': async (event, updatedBuyout) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/buyoutTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      const index = data.findIndex(item => item.number === updatedBuyout.number);
      if (index !== -1) {
        data[index] = updatedBuyout;
        writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        logger.info(`Updated buyout: ${JSON.stringify(updatedBuyout)}`);
      }
      return data;
    } catch (error) {
      logger.error(`IPC update-buyout error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'delete-buyout': async (event, buyoutNumber) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/buyoutTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      data = data.filter(item => item.number !== buyoutNumber);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Deleted buyout with number: ${buyoutNumber}`);
      return data;
    } catch (error) {
      logger.error(`IPC delete-buyout error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'get-forecasting-test-data': async (event, tab) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/forecastingTestData.json');
      logger.info(`Attempting to fetch forecasting test data from: ${filePath} for tab: ${tab}`);
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      const result = tab === 'gc-gr' ? data.gGrData : data.ownerBillingData;
      logger.info(`Returning data for tab ${tab}: ${JSON.stringify(result)}`);
      return result || [];
    } catch (error) {
      logger.error(`IPC get-forecasting-test-data error: ${error.message}`, { stack: error.stack });
      return [];
    }
  },

  'create-forecast-data': async (event, newForecast, tab) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/forecastingTestData.json');
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      const targetData = tab === 'gc-gr' ? data.gGrData : data.ownerBillingData;

      // Assign a unique ID if not provided (using costCode as identifier)
      if (!newForecast.costCode) {
        newForecast.costCode = `TEMP-${Date.now()}`; // Temporary ID generation
      }
      targetData.push(newForecast);

      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Created new forecast data for ${tab}: ${JSON.stringify(newForecast)}`);
      return targetData;
    } catch (error) {
      logger.error(`IPC create-forecast-data error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'update-forecast-data': async (event, updatedRow, tab) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/forecastingTestData.json');
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      const targetData = tab === 'gc-gr' ? data.gGrData : data.ownerBillingData;

      // Find the existing row by costCode
      const index = targetData.findIndex((item) => item.costCode === updatedRow.costCode);
      if (index === -1) {
        // If the row doesn't exist, create a new one
        targetData.push(updatedRow);
        writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        logger.info(`Created new forecast data as it was not found for ${tab}: ${JSON.stringify(updatedRow)}`);
        return targetData;
      }

      // Extract the forecast type (e.g., "Actual Cost", "Original Forecast", "Current Forecast")
      const forecastType = updatedRow.forecast;

      // Update the specific fields based on the forecast type
      const existingRow = targetData[index];
      if (forecastType === 'Actual Cost') {
        existingRow.startDate = updatedRow.startDate || existingRow.startDate;
        existingRow.endDate = updatedRow.endDate || existingRow.endDate;
        existingRow.estimatedCostAtCompletion = updatedRow.estimatedCostAtCompletion || existingRow.estimatedCostAtCompletion;
        existingRow.jobToDateCosts = updatedRow.jobToDateCosts || existingRow.jobToDateCosts;
        existingRow.projectedCostToComplete = updatedRow.projectedCostToComplete || existingRow.projectedCostToComplete;
        existingRow.forecastToComplete = updatedRow.forecastToComplete || existingRow.forecastToComplete;
        existingRow.projectedOverUnder = updatedRow.projectedOverUnder || existingRow.projectedOverUnder;
        existingRow.forecastRemainder = updatedRow.forecastRemainder || existingRow.forecastRemainder;
      } else if (forecastType === 'Original Forecast') {
        existingRow.originalStartDate = updatedRow.originalStartDate || existingRow.originalStartDate;
        existingRow.originalEndDate = updatedRow.originalEndDate || existingRow.originalEndDate;
        existingRow.originalMethod = updatedRow.originalMethod || existingRow.originalMethod;
        existingRow.originalForecastToComplete = updatedRow.originalForecastToComplete || existingRow.originalForecastToComplete;
        existingRow.originalEstimatedCostAtCompletion = updatedRow.originalEstimatedCostAtCompletion || existingRow.originalEstimatedCostAtCompletion;
      } else if (forecastType === 'Current Forecast') {
        existingRow.currentStartDate = updatedRow.currentStartDate || existingRow.currentStartDate;
        existingRow.currentEndDate = updatedRow.currentEndDate || existingRow.currentEndDate;
        existingRow.currentMethod = updatedRow.currentMethod || existingRow.currentMethod;
        existingRow.currentForecastToComplete = updatedRow.currentForecastToComplete || existingRow.currentForecastToComplete;
        existingRow.currentEstimatedCostAtCompletion = updatedRow.currentEstimatedCostAtCompletion || existingRow.currentEstimatedCostAtCompletion;
      }

      // Update monthly forecast values (e.g., march2025, april2025)
      Object.keys(updatedRow).forEach((key) => {
        const monthRegex = /^[a-z]+(\d{4})$/i; // Matches "march2025", "april2025", etc.
        if (monthRegex.test(key)) {
          if (!existingRow[key]) {
            existingRow[key] = { actualCost: 0, originalForecast: 0, currentForecast: 0, originalVariance: 0, currentVariance: 0 };
          }
          if (forecastType === 'Actual Cost') {
            existingRow[key].actualCost = updatedRow[key] || existingRow[key].actualCost;
            // Recalculate variances
            existingRow[key].originalVariance = existingRow[key].actualCost - existingRow[key].originalForecast;
            existingRow[key].currentVariance = existingRow[key].actualCost - existingRow[key].currentForecast;
          } else if (forecastType === 'Original Forecast') {
            existingRow[key].originalForecast = updatedRow[key] || existingRow[key].originalForecast;
            existingRow[key].originalVariance = existingRow[key].actualCost - existingRow[key].originalForecast;
          } else if (forecastType === 'Current Forecast') {
            existingRow[key].currentForecast = updatedRow[key] || existingRow[key].currentForecast;
            existingRow[key].currentVariance = existingRow[key].actualCost - existingRow[key].currentForecast;
          }
        }
      });

      // Update common fields
      existingRow.originalBudget = updatedRow.originalBudget || existingRow.originalBudget;
      existingRow.approvedCOs = updatedRow.approvedCOs || existingRow.approvedCOs;
      existingRow.revisedBudget = updatedRow.revisedBudget || existingRow.revisedBudget;
      existingRow.description = updatedRow.description || existingRow.description;

      // Write the updated data back to the file
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Updated forecast data for ${tab}: ${JSON.stringify(existingRow)}`);

      return targetData;
    } catch (error) {
      logger.error(`IPC update-forecast-data error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'delete-forecast-data': async (event, costCode, tab) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/forecastingTestData.json');
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      const targetData = tab === 'gc-gr' ? data.gGrData : data.ownerBillingData;

      const initialLength = targetData.length;
      const updatedData = targetData.filter((item) => item.costCode !== costCode);
      if (updatedData.length === initialLength) {
        logger.warn(`No forecast data found with costCode ${costCode} for ${tab}`);
      } else {
        if (tab === 'gc-gr') data.gGrData = updatedData;
        else data.ownerBillingData = updatedData;
        writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        logger.info(`Deleted forecast data with costCode ${costCode} for ${tab}`);
      }
      return updatedData;
    } catch (error) {
      logger.error(`IPC delete-forecast-data error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'get-constraints-test-data': async () => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/constraintsTestData.json');
      logger.info(`Attempting to fetch constraints test data from: ${filePath}`);
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      logger.info(`Returning constraints data: ${JSON.stringify(data)}`);
      return data || [];
    } catch (error) {
      logger.error(`IPC get-constraints-test-data error: ${error.message}`, { stack: error.stack });
      return [];
    }
  },
  'add-constraint': async (event, newConstraint) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/constraintsTestData.json');
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.push(newConstraint);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Added new constraint: ${JSON.stringify(newConstraint)}`);
      return data;
    } catch (error) {
      logger.error(`IPC add-constraint error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'update-constraint': async (event, updatedConstraint) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/constraintsTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      const index = data.findIndex(item => item.id === updatedConstraint.id);
      if (index !== -1) {
        data[index] = updatedConstraint;
        writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        logger.info(`Updated constraint: ${JSON.stringify(updatedConstraint)}`);
      }
      return data;
    } catch (error) {
      logger.error(`IPC update-constraint error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'delete-constraint': async (event, constraintId) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/constraintsTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      data = data.filter(item => item.id !== constraintId);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Deleted constraint with ID: ${constraintId}`);
      return data;
    } catch (error) {
      logger.error(`IPC delete-constraint error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'get-responsibility-test-data': async () => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/respTestData.json');
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      return {
        projectRoles: data.projectRoles || [],
        contractRoles: data.contractRoles || [],
        responsibilities: data.responsibilities || [],
        primeContractTasks: data.primeContractTasks || [],
        subcontractTasks: data.subcontractTasks || [],
      };
    } catch (error) {
      logger.error(`IPC get-responsibility-test-data error: ${error.message}`, { stack: error.stack });
      return { projectRoles: [], contractRoles: [], responsibilities: [], primeContractTasks: [], subcontractTasks: [] };
    }
  },
  'add-responsibility': async (event, newResponsibility) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/respTestData.json');
      let fileData = JSON.parse(readFileSync(filePath, 'utf8'));
      if (!fileData || typeof fileData !== 'object') {
        logger.warn(`Responsibility file data is invalid, initializing with default structure. Data: ${JSON.stringify(fileData)}`);
        fileData = { projectRoles: [], responsibilities: [] };
      }
      const { projectRoles = [], responsibilities = [] } = fileData;
      if (!Array.isArray(responsibilities)) {
        logger.warn(`Responsibilities data is not an array, initializing as empty array. Data: ${JSON.stringify(responsibilities)}`);
        fileData.responsibilities = [];
      }
      fileData.responsibilities.push(newResponsibility);
      writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
      logger.info(`Added new responsibility: ${JSON.stringify(newResponsibility)}`);
      return fileData.responsibilities;
    } catch (error) {
      logger.error(`IPC add-responsibility error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'update-responsibility': async (event, updatedResponsibility) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/respTestData.json');
      let fileData = JSON.parse(readFileSync(filePath, 'utf8'));
      if (!fileData || typeof fileData !== 'object') {
        logger.warn(`Responsibility file data is invalid, initializing with default structure. Data: ${JSON.stringify(fileData)}`);
        fileData = { projectRoles: [], responsibilities: [] };
      }
      const { projectRoles = [], responsibilities = [] } = fileData;
      if (!Array.isArray(responsibilities)) {
        logger.warn(`Responsibilities data is not an array, initializing as empty array. Data: ${JSON.stringify(responsibilities)}`);
        fileData.responsibilities = [];
      }
      const index = fileData.responsibilities.findIndex(item => item.id === updatedResponsibility.id);
      if (index !== -1) {
        fileData.responsibilities[index] = updatedResponsibility;
        writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
        logger.info(`Updated responsibility: ${JSON.stringify(updatedResponsibility)}`);
      } else {
        logger.warn(`Responsibility with ID ${updatedResponsibility.id} not found`);
      }
      return fileData.responsibilities;
    } catch (error) {
      logger.error(`IPC update-responsibility error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'delete-responsibility': async (event, responsibilityId) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/respTestData.json');
      let fileData = JSON.parse(readFileSync(filePath, 'utf8'));
      if (!fileData || typeof fileData !== 'object') {
        logger.warn(`Responsibility file data is invalid, initializing with default structure. Data: ${JSON.stringify(fileData)}`);
        fileData = { projectRoles: [], responsibilities: [] };
      }
      const { projectRoles = [], responsibilities = [] } = fileData;
      if (!Array.isArray(responsibilities)) {
        logger.warn(`Responsibilities data is not an array, initializing as empty array. Data: ${JSON.stringify(responsibilities)}`);
        fileData.responsibilities = [];
      }
      fileData.responsibilities = fileData.responsibilities.filter(item => item.id !== responsibilityId);
      writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
      logger.info(`Deleted responsibility with ID: ${responsibilityId}`);
      return fileData.responsibilities;
    } catch (error) {
      logger.error(`IPC delete-responsibility error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'get-schedule-test-data': async () => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/schedTestData.json');
      logger.info(`Attempting to fetch schedule test data from: ${filePath}`);
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      logger.info(`Returning schedule data: ${JSON.stringify(data)}`);
      return data || [];
    } catch (error) {
      logger.error(`IPC get-schedule-test-data error: ${error.message}`, { stack: error.stack });
      return [];
    }
  },
  'get-permit-test-data': async () => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/permitTestData.json');
      logger.info(`Attempting to fetch permit test data from: ${filePath}`);
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      logger.info(`Returning permit data: ${JSON.stringify(data)}`);
      return data || [];
    } catch (error) {
      logger.error(`IPC get-permit-test-data error: ${error.message}`, { stack: error.stack });
      return [];
    }
  },
  'add-permit': async (event, newPermit) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/permitTestData.json');
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.push(newPermit);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Added new permit: ${JSON.stringify(newPermit)}`);
      return data;
    } catch (error) {
      logger.error(`IPC add-permit error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'update-permit': async (event, updatedPermit) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/permitTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      const index = data.findIndex(item => item.id === updatedPermit.id);
      if (index !== -1) {
        data[index] = updatedPermit;
        writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        logger.info(`Updated permit: ${JSON.stringify(updatedPermit)}`);
      }
      return data;
    } catch (error) {
      logger.error(`IPC update-permit error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'delete-permit': async (event, permitId) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/permitTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      data = data.filter(item => item.id !== permitId);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Deleted permit with ID: ${permitId}`);
      return data;
    } catch (error) {
      logger.error(`IPC delete-permit error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'get-subgrade-data': async () => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/subGradeTestData.json');
      logger.info(`Attempting to fetch subgrade data from: ${filePath}`);
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      logger.info(`Returning subgrade data: ${JSON.stringify(data)}`);
      return data || [];
    } catch (error) {
      logger.error(`IPC get-subgrade-data error: ${error.message}`, { stack: error.stack });
      return [];
    }
  },
  'add-subgrade': async (event, newSubgrade) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/subGradeTestData.json');
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.push(newSubgrade);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Added new subgrade: ${JSON.stringify(newSubgrade)}`);
      return data;
    } catch (error) {
      logger.error(`IPC add-subgrade error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'update-subgrade': async (event, updatedSubgrade) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/subGradeTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      const index = data.findIndex(item => item.id === updatedSubgrade.id);
      if (index !== -1) {
        data[index] = updatedSubgrade;
        writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        logger.info(`Updated subgrade: ${JSON.stringify(updatedSubgrade)}`);
      }
      return data;
    } catch (error) {
      logger.error(`IPC update-subgrade error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'delete-subgrade': async (event, subgradeId) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/subGradeTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      data = data.filter(item => item.id !== subgradeId);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Deleted subgrade with ID: ${subgradeId}`);
      return data;
    } catch (error) {
      logger.error(`IPC delete-subgrade error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'get-staffing-test-data': async () => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/staffTestData.json');
      logger.info(`Attempting to fetch staffing test data from: ${filePath}`);
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      logger.info(`Returning staffing data: ${JSON.stringify(data)}`);
      return data || { activities: [], roles: [], staffingNeeds: [] };
    } catch (error) {
      logger.error(`IPC get-staffing-test-data error: ${error.message}`, { stack: error.stack });
      return { activities: [], roles: [], staffingNeeds: [] };
    }
  },
  'add-staffing-activity': async (event, newActivity) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/staffTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.activities.push(newActivity);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Added new staffing activity: ${JSON.stringify(newActivity)}`);
      return data.activities;
    } catch (error) {
      logger.error(`IPC add-staffing-activity error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'update-staffing-activity': async (event, updatedActivity) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/staffTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      const index = data.activities.findIndex(item => item.id === updatedActivity.id);
      if (index !== -1) {
        data.activities[index] = updatedActivity;
        writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        logger.info(`Updated staffing activity: ${JSON.stringify(updatedActivity)}`);
      }
      return data.activities;
    } catch (error) {
      logger.error(`IPC update-staffing-activity error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'delete-staffing-activity': async (event, activityId) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/staffTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.activities = data.activities.filter(item => item.id !== activityId);
      data.staffingNeeds = data.staffingNeeds.filter(item => item.activityId !== activityId);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Deleted staffing activity with ID: ${activityId}`);
      return { activities: data.activities, staffingNeeds: data.staffingNeeds };
    } catch (error) {
      logger.error(`IPC delete-staffing-activity error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'update-staffing-needs': async (event, staffingNeed) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/staffTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      const existingIndex = data.staffingNeeds.findIndex(
        item => item.activityId === staffingNeed.activityId && item.role === staffingNeed.role && item.month === staffingNeed.month
      );
      if (existingIndex !== -1) {
        if (staffingNeed.count === 0) {
          data.staffingNeeds.splice(existingIndex, 1);
        } else {
          data.staffingNeeds[existingIndex] = staffingNeed;
        }
      } else if (staffingNeed.count > 0) {
        data.staffingNeeds.push(staffingNeed);
      }
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Updated staffing needs: ${JSON.stringify(staffingNeed)}`);
      return data.staffingNeeds;
    } catch (error) {
      logger.error(`IPC update-staffing-needs error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'get-manpower-test-data': async () => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/manpowerTestData.json');
      logger.info(`Attempting to fetch manpower test data from: ${filePath}`);
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      logger.info(`Returning manpower data: ${JSON.stringify(data)}`);
      return data || [];
    } catch (error) {
      logger.error(`IPC get-manpower-test-data error: ${error.message}`, { stack: error.stack });
      return [];
    }
  },
  'add-manpower': async (event, newEntry) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/manpowerTestData.json');
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.push(newEntry);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Added new manpower entry: ${JSON.stringify(newEntry)}`);
      return data;
    } catch (error) {
      logger.error(`IPC add-manpower error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'update-manpower': async (event, updatedEntry) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/manpowerTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      const index = data.findIndex(item => item.id === updatedEntry.id);
      if (index !== -1) {
        data[index] = updatedEntry;
        writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        logger.info(`Updated manpower entry: ${JSON.stringify(updatedEntry)}`);
      }
      return data;
    } catch (error) {
      logger.error(`IPC update-manpower error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
  'delete-manpower': async (event, entryId) => {
    try {
      const filePath = resolve(__dirname, '../../bin/TestData/manpowerTestData.json');
      let data = JSON.parse(readFileSync(filePath, 'utf8'));
      data = data.filter(item => item.id !== entryId);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Deleted manpower entry with ID: ${entryId}`);
      return data;
    } catch (error) {
      logger.error(`IPC delete-manpower error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  }
};

function registerIpcHandlers() {
  Object.entries(handlers).forEach(([channel, handler]) => {
    if (channel === 'log') {
      ipcMain.on(channel, handler);
    } else {
      ipcMain.handle(channel, handler);
    }
  });
  logger.info('IPC handlers registered');
}

export { registerIpcHandlers };