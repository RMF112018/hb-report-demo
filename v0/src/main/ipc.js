// src/main/ipc.js
// IPC handlers for hb-report, communicating with hb-report-sync API
// Import in main.js to register handlers
// Reference: https://www.electronjs.org/docs/latest/api/ipc-main

import { ipcMain } from 'electron';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import Store from 'electron-store';
import { safeStorage } from 'electron';
import apiClient from './apiClient.js';
import fetch from 'node-fetch';
import logger from './logger.js';
import config from './config.js';

// Initialize electron-store
const store = new Store();

const algorithm = 'aes-256-cbc';
const key = Buffer.from(config.encryption.key, 'hex');

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const handlers = {
  'login': async (event, { email, password }) => {
    try {
      logger.debug('Login request received', { email, password: '[hidden]' });
      const response = await apiClient.post('/login', { email, password });
      if (response.success) {
        const { token, procore_user_id } = response.data;
        store.set('authToken', token);
        logger.info(`User logged in: ${email}`);
        return { procore_user_id, token };
      }
      throw new Error(response.error || 'Login failed');
    } catch (error) {
      logger.error(`IPC login error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'hash-password': async (event, password) => {
    try {
      logger.debug('Hashing password', { passwordLength: password.length });
      const hash = createHash('sha256').update(password).digest('hex');
      logger.debug('Password hashed successfully', { hashLength: hash.length });
      return hash;
    } catch (error) {
      logger.error(`IPC hash-password error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'store-remember-me-data': async (event, data) => {
    try {
      logger.debug('Storing Remember Me data', { email: data.email });
      store.set('rememberMe', {
        email: data.email,
        password: data.password,
        timestamp: data.timestamp,
      });
      logger.info('Remember Me data stored successfully', { email: data.email });
      return true;
    } catch (error) {
      logger.error(`IPC store-remember-me-data error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'get-remember-me-data': async () => {
    try {
      logger.debug('Fetching Remember Me data');
      const data = store.get('rememberMe');
      logger.debug('Remember Me data retrieved', { email: data?.email });
      return data || null;
    } catch (error) {
      logger.error(`IPC get-remember-me-data error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'clear-remember-me-data': async () => {
    try {
      logger.debug('Clearing Remember Me data');
      store.delete('rememberMe');
      logger.info('Remember Me data cleared');
      return true;
    } catch (error) {
      logger.error(`IPC clear-remember-me-data error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'encrypt-password': async (event, password) => {
    try {
      logger.debug('Encrypting password', { passwordLength: password.length });
      const iv = randomBytes(16);
      const cipher = createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(password, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      const encryptedWithIv = iv.toString('base64') + ':' + encrypted;
      logger.debug('Password encrypted successfully', {
        iv: iv.toString('base64'),
        encrypted: encrypted,
        encryptedWithIv: encryptedWithIv,
        encryptedWithIvLength: encryptedWithIv.length,
      });
      return encryptedWithIv;
    } catch (error) {
      logger.error(`IPC encrypt-password error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'decrypt-password': async (event, encryptedPassword) => {
    try {
      logger.debug('Decrypting password', {
        encryptedLength: encryptedPassword.length,
        encryptedPassword: encryptedPassword,
      });
      const parts = encryptedPassword.split(':');
      if (parts.length !== 2) {
        throw new Error(`Invalid encrypted password format: expected 'iv:encrypted', got ${parts.length} parts`);
      }
      const [ivBase64, encrypted] = parts;
      if (!ivBase64 || !encrypted) {
        throw new Error('Invalid encrypted password format: missing IV or encrypted data');
      }
      const iv = Buffer.from(ivBase64, 'base64');
      const decipher = createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      logger.debug('Password decrypted successfully', {
        iv: ivBase64,
        encrypted: encrypted,
        decryptedLength: decrypted.length,
      });
      return decrypted;
    } catch (error) {
      logger.error(`IPC decrypt-password error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'get-auth-token': async () => {
    try {
      logger.debug('Fetching auth token');
      const token = store.get('authToken');
      if (!token) {
        logger.warn('No authentication token available for get-auth-token');
        throw new Error('No authentication token available');
      }
      logger.debug('Auth token retrieved', { tokenLength: token.length });
      return token;
    } catch (error) {
      logger.error(`IPC get-auth-token error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'refresh-token': async () => {
    try {
      logger.debug('Refreshing auth token');
      const token = store.get('authToken');
      if (!token) {
        logger.warn('No authentication token available for refresh-token');
        throw new Error('No authentication token available');
      }
      const response = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to refresh token');
      }
      store.set('authToken', result.token);
      logger.info('Token refreshed');
      return result.token;
    } catch (error) {
      logger.error(`IPC refresh-token error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'clear-token': async () => {
    try {
      logger.debug('Clearing auth token');
      store.delete('authToken');
      logger.info('Auth token cleared');
      return true;
    } catch (error) {
      logger.error(`IPC clear-token error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'verify-email': async (event, email) => {
    try {
      logger.debug(`Verifying email: ${email}`);
      const response = await fetch(`${API_BASE_URL}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || `Verify email failed (status: ${response.status})`);
      }
      logger.debug(`Verify email response: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      logger.error(`IPC verify-email error: ${error.message}`, { stack: error.stack, email });
      throw error;
    }
  },

  'verify-email-token': async (event, token) => {
    try {
      logger.debug(`Verifying email token: ${token}`);
      const response = await fetch(`${API_BASE_URL}/verify-email-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || `Verify email token failed (status: ${response.status})`);
      }
      logger.info(`Email verified for procore_user_id: ${result.procore_user_id}`);
      return result;
    } catch (error) {
      logger.error(`IPC verify-email-token error: ${error.message}`, { stack: error.stack, token });
      throw error;
    }
  },

  'get-user-profile': async (event, procoreUserId) => {
    try {
      logger.debug(`Fetching user profile for procore_user_id: ${procoreUserId}`);
      const token = store.get('authToken');
      if (!token) {
        throw new Error('No authentication token available');
      }
      const response = await fetch(`${API_BASE_URL}/user-profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const user = await response.json();
      if (!response.ok) {
        throw new Error(user.error || 'Failed to fetch user profile');
      }
      logger.info(`User profile fetched for procore_user_id: ${procoreUserId}`);
      return user;
    } catch (error) {
      logger.error(`IPC get-user-profile error: ${error.message}`, { stack: error.stack, procoreUserId });
      throw error;
    }
  },

  'create-user': async (event, { procore_user_id, email, password }) => {
    try {
      logger.debug('Received create-user request', { procore_user_id, email, password: '[hidden]' });
      if (!procore_user_id || !email || !password) {
        throw new Error('Missing required fields in IPC payload');
      }
      const response = await fetch(`${API_BASE_URL}/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ procore_user_id, email, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || `Create user failed (status: ${response.status})`);
      }
      logger.info('User created', { procore_user_id, email });
      return result.success;
    } catch (error) {
      logger.error(`IPC create-user error: ${error.message}`, { stack: error.stack, procore_user_id, email });
      throw error;
    }
  },

  'sync-users': async () => {
    try {
      logger.debug('Sync users request received');
      const response = await fetch(`${API_BASE_URL}/sync-users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Sync users failed');
      }
      logger.info('Manual user sync completed');
      return result.success;
    } catch (error) {
      logger.error(`IPC sync-users error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'get-ag-grid-license': async () => {
    try {
      if (!config.agGridLicense) {
        logger.warn('AG Grid license key not found in config');
        return null;
      }
      return config.agGridLicense;
    } catch (error) {
      logger.error('Failed to fetch AG Grid license', { message: error.message, stack: error.stack });
      throw error;
    }
  },

  'get-projects': async (event, args) => {
    try {
      logger.debug('Received get-projects request', { args });
      const { procore_user_id, token } = args || {};
      if (!procore_user_id || !token) {
        throw new Error('Missing procore_user_id or token in request');
      }
      logger.debug(`Fetching projects for user: ${procore_user_id}`);
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const projects = await response.json();
      if (!response.ok) {
        throw new Error(projects.error || 'Get projects failed');
      }
      logger.debug(`Fetched projects: ${projects.length} items`);
      return projects;
    } catch (error) {
      logger.error(`IPC get-projects error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'get-commitments': async (event, projectId) => {
    try {
      logger.debug('Get commitments request received', { projectId });
      if (!projectId) {
        throw new Error('projectId is required for get-commitments');
      }
      const token = store.get('authToken');
      if (!token) {
        logger.warn('No authentication token available for get-commitments');
        throw new Error('No authentication token available');
      }
      const response = await fetch(`${API_BASE_URL}/commitments?projectId=${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const commitments = await response.json();
      if (!response.ok) {
        throw new Error(commitments.error || 'Failed to fetch commitments');
      }
      logger.debug(`Fetched ${commitments.length} commitments for projectId: ${projectId}`);
      return commitments;
    } catch (error) {
      logger.error(`IPC get-commitments error: ${error.message}`, { stack: error.stack, projectId });
      throw error;
    }
  },

  'get-buyout-data': async (event, projectId) => {
    try {
      logger.debug('Get buyout data request received', { projectId });
      if (!projectId) {
        throw new Error('projectId is required for get-buyout-data');
      }
      const token = store.get('authToken');
      if (!token) {
        logger.warn('No authentication token available for get-buyout-data');
        throw new Error('No authentication token available');
      }
      const response = await fetch(`${API_BASE_URL}/buyout-data?projectId=${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const buyoutData = await response.json();
      if (!response.ok) {
        throw new Error(buyoutData.error || 'Failed to fetch buyout data');
      }
      logger.debug(`Fetched ${buyoutData.length} buyout records for projectId: ${projectId}`);
      return buyoutData;
    } catch (error) {
      logger.error(`IPC get-buyout-data error: ${error.message}`, { stack: error.stack, projectId });
      throw error;
    }
  },

  'sync-project-commitments': async (event, projectId) => {
    try {
      logger.debug('Sync project commitments request received', { projectId });
      if (!projectId) {
        throw new Error('projectId is required for sync-project-commitments');
      }
      const token = store.get('authToken');
      if (!token) {
        logger.warn('No authentication token available for sync-project-commitments');
        throw new Error('No authentication token available');
      }
      const response = await fetch(`${API_BASE_URL}/sync-project-commitments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to sync commitments');
      }
      logger.info('Project commitments sync completed', { projectId });
      return result.success;
    } catch (error) {
      logger.error(`IPC sync-project-commitments error: ${error.message}`, { stack: error.stack, projectId });
      throw error;
    }
  },

  'sync-commitments': async (event, projectId) => {
    try {
      logger.debug('Sync commitments request received', { projectId });
      const token = store.get('authToken');
      if (!token) {
        logger.warn('No authentication token available for sync-commitments');
        throw new Error('No authentication token available');
      }
      const response = await fetch(`${API_BASE_URL}/sync-commitments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to sync commitments');
      }
      logger.info('Commitments sync completed', { projectId });
      return result.success;
    } catch (error) {
      logger.error(`IPC sync-commitments error: ${error.message}`, { stack: error.stack, projectId });
      throw error;
    }
  },

  'get-budget-details': async (event, { projectId, tab }) => {
    try {
      logger.debug('Get budget details request received', { projectId, tab });
      const token = store.get('authToken');
      if (!token) {
        logger.warn('No authentication token available for get-budget-details');
        throw new Error('No authentication token available');
      }
      const url = new URL(`${API_BASE_URL}/budget-details`);
      url.searchParams.append('projectId', projectId);
      url.searchParams.append('tab', tab);
      logger.debug('Fetching budget details with URL', { url: url.toString() });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        logger.error('Non-OK response from /budget-details:', { status: response.status, text });
        throw new Error(`Failed to fetch budget details: ${response.status} - ${text}`);
      }
      const allBudgetDetails = await response.json();

      logger.debug(`Fetched ${allBudgetDetails.length} budget details for project ${projectId}, tab ${tab}`);
      return allBudgetDetails;
    } catch (error) {
      logger.error(`IPC get-budget-details error: ${error.message}`, { stack: error.stack, projectId, tab });
      throw error;
    }
  },

  'sync-project-budget': async (event, projectId) => {
    try {
      logger.debug('Sync project budget request received', { projectId });
      const token = store.get('authToken');
      if (!token) {
        logger.warn('No authentication token available for sync-project-budget');
        throw new Error('No authentication token available');
      }
      const response = await fetch(`${API_BASE_URL}/sync-project-budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId }),
      });
      if (!response.ok) {
        const text = await response.text();
        logger.error('Non-OK response from /sync-project-budget:', { status: response.status, text });
        throw new Error(`Failed to sync project budget: ${response.status} - ${text}`);
      }
      const result = await response.json();
      logger.info('Project budget sync completed', { projectId });
      return result.success;
    } catch (error) {
      logger.error(`IPC sync-project-budget error: ${error.message}`, { stack: error.stack, projectId });
      throw error;
    }
  },

  'get-change-events': async (event) => {
    try {
      logger.debug('Get change events request received');
      const response = await fetch(`${API_BASE_URL}/change-events`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const changeEvents = await response.json();
      if (!response.ok) {
        throw new Error(changeEvents.error || 'Get change events failed');
      }
      logger.debug(`Fetched ${changeEvents.length} change events`);
      return changeEvents;
    } catch (error) {
      logger.error(`IPC get-change-events error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },

  'generate-pdf': async (event, { reportType, data, outputPath }) => {
    try {
      logger.debug('Generate PDF request received', { reportType, outputPath });
      const response = await fetch(`${API_BASE_URL}/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType, data, outputPath }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Generate PDF failed');
      }
      logger.info('PDF generated', { filePath: result.filePath });
      return { success: true, filePath: result.filePath };
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
      newPortfolio.id = Math.max(...data.map(item => item.id), 0) + 1;
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
      if (!newForecast.costCode) {
        newForecast.costCode = `TEMP-${Date.now()}`;
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
      const index = targetData.findIndex(item => item.costCode === updatedRow.costCode);
      if (index === -1) {
        targetData.push(updatedRow);
        writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        logger.info(`Created new forecast data as it was not found for ${tab}: ${JSON.stringify(updatedRow)}`);
        return targetData;
      }
      const existingRow = targetData[index];
      const forecastType = updatedRow.forecast;
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
      Object.keys(updatedRow).forEach(key => {
        const monthRegex = /^[a-z]+(\d{4})$/i;
        if (monthRegex.test(key)) {
          if (!existingRow[key]) {
            existingRow[key] = { actualCost: 0, originalForecast: 0, currentForecast: 0, originalVariance: 0, currentVariance: 0 };
          }
          if (forecastType === 'Actual Cost') {
            existingRow[key].actualCost = updatedRow[key] || existingRow[key].actualCost;
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
      existingRow.originalBudget = updatedRow.originalBudget || existingRow.originalBudget;
      existingRow.approvedCOs = updatedRow.approvedCOs || existingRow.approvedCOs;
      existingRow.revisedBudget = updatedRow.revisedBudget || existingRow.revisedBudget;
      existingRow.description = updatedRow.description || existingRow.description;
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
      const updatedData = targetData.filter(item => item.costCode !== costCode);
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
  },

  // Comments handlers
  'get-comments': async (event, { projectId, itemId, toolName }) => {
    try {
      console.log('ipc.js: get-comments handler received:', { projectId, itemId, toolName });
      const token = store.get('authToken');
      if (!token) {
        throw new Error('No authentication token available');
      }
      const queryParams = new URLSearchParams({ projectId, itemId, toolName }).toString();
      const url = `${API_BASE_URL}/comments?${queryParams}`;
      console.log('ipc.js: Fetching comments from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('ipc.js: Backend response status:', response.status, 'Status Text:', response.statusText);
      const comments = await response.json();
      console.log('ipc.js: Backend response body:', comments);
      if (!response.ok) {
        throw new Error(comments.error || 'Failed to fetch comments');
      }
      // Transform flat comments into a nested structure
      const nestedComments = comments.reduce((acc, comment) => {
        if (!comment.parentId) {
          acc.push({ ...comment, replies: [] });
        } else {
          const parent = acc.find((c) => c.id === comment.parentId) || 
                        acc.flatMap((c) => c.replies || []).find((c) => c.id === comment.parentId);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push({ ...comment, replies: [] });
          }
        }
        return acc;
      }, []);
      logger.info('ipc.js: Fetched comments:', { projectId, itemId, toolName, count: nestedComments.length });
      return nestedComments;
    } catch (error) {
      logger.error(`IPC get-comments error: ${error.message}`, { stack: error.stack, projectId, itemId, toolName });
      throw error;
    }
  },

  'add-comment': async (event, { projectId, itemId, content, parentId, toolName, author }) => {
    try {
      console.log('ipc.js: add-comment handler received:', { projectId, itemId, content, parentId, toolName, author });
      const token = store.get('authToken');
      if (!token) {
        throw new Error('No authentication token available');
      }
      const payload = { projectId, itemId, content, parentId, toolName, author };
      console.log('ipc.js: Sending to backend:', payload);
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log('ipc.js: Backend response:', result);
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add comment');
      }
      logger.info('ipc.js: Comment added:', { projectId, itemId, toolName, commentId: result.comment.id });
      return result.comment;
    } catch (error) {
      logger.error(`IPC add-comment error: ${error.message}`, { stack: error.stack });
      throw error;
    }
  },
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