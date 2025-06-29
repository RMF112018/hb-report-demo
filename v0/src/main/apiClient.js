// src/main/apiClient.js
// Centralized API client for communicating with hb-report-sync
// Import into ipc.js or other main process files to make API calls
// Reference: https://nodejs.org/api/http.html
// Reference: https://www.npmjs.com/package/node-fetch
// Reference: https://www.npmjs.com/package/electron-store
// Reference: https://www.npmjs.com/package/jwt-decode

import fetch from 'node-fetch';
import Store from 'electron-store';
import logger from './logger.js';
import { jwtDecode } from 'jwt-decode'; // Add static import

const store = new Store();
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

class ApiClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Get the current auth token, refreshing if necessary
    async getAuthToken() {
        let token = store.get('authToken');
        if (!token) throw new Error('No authentication token available');
        const needsRefresh = await this.shouldRefreshToken(token);
        if (needsRefresh) token = await this.refreshToken(token);
        logger.debug('Token payload:', jwtDecode(token)); // Use static import
        return token;
    }

    // Placeholder for token refresh logic; implement JWT expiry check
    async shouldRefreshToken(token) {
        try {
            const payload = jwtDecode(token); // Use static import
            const now = Math.floor(Date.now() / 1000);
            return payload.exp < now; // Check if token is expired
        } catch (error) {
            logger.warn('Failed to decode token for refresh check', { message: error.message });
            return true; // Force refresh on decode failure
        }
    }

    async refreshToken(token) {
        try {
            const response = await fetch(`${this.baseUrl}/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to refresh token');
            store.set('authToken', result.token);
            logger.info('Token refreshed successfully');
            return result.token;
        } catch (error) {
            logger.error('Token refresh failed', { message: error.message });
            throw error;
        }
    }

    async request(endpoint, options = {}) {
        const { method = 'GET', body, retries = 2, headers = {} } = options;
        let attempts = 0;

        while (attempts <= retries) {
            try {
                let token;
                if (endpoint !== '/login') {
                    token = await this.getAuthToken();
                }
                const response = await fetch(`${this.baseUrl}${endpoint}`, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                        ...headers,
                    },
                    body: body ? JSON.stringify(body) : undefined,
                });

                const text = await response.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    data = { error: text || 'Unknown error' };
                }

                if (!response.ok) {
                    throw new Error(data.error || `Request failed with status ${response.status}`);
                }

                // Store token on successful login
                if (endpoint === '/login' && data.token) {
                    store.set('authToken', data.token);
                }

                return { success: true, data };
            } catch (error) {
                attempts++;
                if (attempts > retries) {
                    logger.error(`API request failed after ${retries + 1} attempts`, {
                        endpoint,
                        message: error.message,
                    });
                    return { success: false, error: error.message };
                }
                const delay = Math.pow(2, attempts) * 100;
                logger.warn(`Retrying API request (${attempts}/${retries})`, { endpoint });
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    }
}

export default new ApiClient();