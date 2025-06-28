// src/renderer/hooks/useRefreshData.js
// Custom hook for refreshing component data via IPC calls to hb-report-sync
// Use in components to fetch and refresh data (e.g., projects, buyouts)
// Reference: https://react.dev/reference/react/useState
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/ipc-renderer

import { useState, useCallback } from 'react';
import { message } from 'antd';

/**
 * Hook to manage data fetching and refreshing for a component
 * @param {string} ipcChannel - IPC channel for data fetching (e.g., 'get-projects')
 * @param {Function} fetchFn - Function to invoke IPC call with arguments
 * @returns {Object} - Data, loading state, error, and refresh function
 */
const useRefreshData = (ipcChannel, fetchFn) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      message.error(`Failed to refresh data: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  return { data, isLoading, error, refresh };
};

export default useRefreshData;