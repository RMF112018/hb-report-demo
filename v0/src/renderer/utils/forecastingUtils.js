// src/renderer/utils/forecastingUtils.js
// Utility functions for forecasting data management in HB Report, optimized for AG Grid Enterprise
// Use these functions in ForecastingV2.js to fetch and process forecasting data
// Reference: https://www.electronjs.org/docs/latest/api/ipc-renderer
// *Additional Reference*: https://momentjs.com/docs/

import moment from 'moment';

/**
 * Fetches forecasting test data from Electron's IPC for a given tab.
 * @param {string} activeTab - The active tab key (e.g., 'gc-gr', 'owner-billing')
 * @returns {Promise<Array>} - Array of forecast data or empty array on error
 */
export const fetchForecastData = async (activeTab) => {
  try {
    console.log('Fetching data for activeTab:', activeTab);
    const forecastData = await window.electronAPI.getForecastingTestData(activeTab);
    console.log('Fetched forecast data for tab', activeTab, ':', forecastData);
    return forecastData || [];
  } catch (err) {
    console.error('Error fetching forecasting test data:', err);
    throw new Error('Failed to load forecasting data. Please try again.');
  }
};

/**
 * Generates dynamic date columns with Enterprise-compatible formatting based on existing data keys.
 * Ensures that group nodes (level 0 rows) do not display values in these columns.
 * @param {Array} data - Array of row data with monthly fields (e.g., march2025, april2025)
 * @returns {Array} - Array of column definitions for each month
 */
export const generateDateColumns = (data) => {
  const monthRegex = /^[a-z]+(\d{4})$/i; // Matches "march2025", "april2025", etc.
  const dateFields = new Set();

  // Collect all valid month-year keys from the data
  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      const match = key.match(monthRegex);
      if (match && typeof row[key] === 'object' && 'actualCost' in row[key]) {
        dateFields.add(key.toLowerCase());
      }
    });
  });

  if (dateFields.size === 0) {
    console.warn('No valid monthly fields found in data.');
    return [];
  }

  // Convert to column definitions
  const columns = Array.from(dateFields)
    .map((field) => {
      const monthName = field.replace(/\d{4}$/, ''); // e.g., "march"
      const year = field.match(/\d{4}$/)[0]; // e.g., "2025"
      const headerName = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
      return {
        field,
        headerName,
        width: 120,
        cellRenderer: 'numericCellRenderer',
        valueGetter: (params) => {
          // Return undefined for group nodes to prevent displaying values in level 0 rows
          if (params.node.group) {
            return undefined;
          }
          return Number(params.data[field]?.currentForecast ?? params.data[field] ?? 0);
        },
        valueFormatter: (params) => {
          if (params.value === undefined) {
            return '';
          }
          return Number(params.value).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        },
        filter: 'agNumberColumnFilter',
      };
    })
    .sort((a, b) => {
      // Sort chronologically
      const dateA = moment(a.field, 'MMMMYYYY');
      const dateB = moment(b.field, 'MMMMYYYY');
      return dateA - dateB;
    });

  console.log('Generated dynamicColumns:', columns);
  return columns;
};

/**
 * Initializes row data by adding missing date column fields with default values.
 * @param {Array} data - Raw forecast data
 * @param {Function} generateDateColumns - Function to generate date columns
 * @returns {Object} - { initializedData, dateColumns }
 */
export const initializeRowDataWithDateColumns = (data, generateDateColumnsFn = generateDateColumns) => {
  console.log('Initializing row data with date columns:', data);
  const dateColumns = generateDateColumnsFn(data);
  const initializedData = data.map((row) => {
    const newRow = { ...row };
    dateColumns.forEach((col) => {
      if (!(col.field in newRow)) {
        newRow[col.field] = { actualCost: 0, originalForecast: 0, currentForecast: 0 };
      }
    });
    return newRow;
  });
  console.log('Initialized data:', initializedData);
  return { initializedData, dateColumns };
};

/**
 * Calculates grand totals for GC & GR or Owner Billing tabs with Enterprise aggregation potential.
 * @param {Array} rowData - Array of row data
 * @param {Array} dynamicColumns - Array of dynamic date column definitions
 * @returns {Array} - Array with a single grand totals row
 */
export const calculateGcGrTotals = (rowData, dynamicColumns) => {
  const totals = {
    costCode: 'Grand Totals',
    description: '',
    startDate: null,
    endDate: null,
    approvedCOs: rowData
      .reduce((sum, row) => sum + parseFloat(row.approvedCOs?.replace(/[^0-9.-]+/g, '') || 0), 0)
      .toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }),
    revisedBudget: rowData
      .reduce((sum, row) => sum + parseFloat(row.revisedBudget?.replace(/[^0-9.-]+/g, '') || 0), 0)
      .toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }),
  };
  dynamicColumns.forEach((col) => {
    totals[col.field] = {
      actualCost: 0, // Placeholder, adjust if actuals are tracked
      originalForecast: 0,
      currentForecast: rowData
        .filter((row) => row.costCode !== 'Grand Totals')
        .reduce((sum, row) => sum + (Number(row[col.field]?.currentForecast) || 0), 0),
    };
  });
  return [totals];
};

/**
 * Generates comparison data by duplicating rows for Actual, Original, and Current Forecast.
 * @param {Array} data - Raw forecast data
 * @param {Function} initializeRowDataWithDateColumns - Function to initialize data
 * @returns {Object} - { compareRows, dateColumns }
 */
export const generateCompareData = (
  data,
  initializeRowDataWithDateColumnsFn = initializeRowDataWithDateColumns
) => {
  const { initializedData, dateColumns } = initializeRowDataWithDateColumnsFn(data);
  const compareRows = [];
  let groupIndex = 0;

  initializedData.forEach((row) => {
    if (row.costCode !== 'Grand Totals') {
      compareRows.push({ ...row, type: 'Actual Cost', groupIndex });
      compareRows.push({ ...row, type: 'Original', groupIndex });
      compareRows.push({ ...row, type: 'Current Forecast', groupIndex });
      groupIndex++;
    }
  });

  console.log('Compare rows before totals:', compareRows);

  const totals = {
    costCode: 'Grand Totals',
    type: '',
    description: '',
    startDate: null,
    endDate: null,
    approvedCOs: compareRows
      .reduce((sum, row) => sum + parseFloat(row.approvedCOs?.replace(/[^0-9.-]+/g, '') || 0), 0)
      .toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }),
    revisedBudget: compareRows
      .reduce((sum, row) => sum + parseFloat(row.revisedBudget?.replace(/[^0-9.-]+/g, '') || 0), 0)
      .toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }),
  };
  dateColumns.forEach((col) => {
    totals[col.field] = {
      actualCost: 0,
      originalForecast: 0,
      currentForecast: compareRows
        .filter((row) => row.costCode !== 'Grand Totals')
        .reduce((sum, row) => sum + (Number(row[col.field]?.currentForecast) || 0), 0),
    };
  });
  compareRows.push(totals);

  console.log('Final compare rows:', compareRows);

  return { compareRows, dateColumns };
};

export const FORECAST_METHODS = {
  UI: {
    FRONT_LOADED: 'Front-Loaded S-Curve',
    BACK_LOADED: 'Back-Loaded S-Curve',
    BELL_CURVE: 'Bell Curve',
    MANUAL: 'Manual',
    HISTORICAL: 'Historical',
  },
  NORMALIZED: {
    FRONT_LOADED: 'frontloaded',
    BACK_LOADED: 'backloaded',
    BELL_CURVE: 'bell',
    MANUAL: 'manual',
    HISTORICAL: 'linear',
  },
};

/**
 * Normalizes a forecast method to its standardized form
 * @param {string} method - The input method from UI or elsewhere
 * @returns {string} - Normalized method name
 */
export function normalizeForecastMethod(method) {
  const methodMap = {
    [FORECAST_METHODS.UI.FRONT_LOADED.toLowerCase()]: FORECAST_METHODS.NORMALIZED.FRONT_LOADED,
    [FORECAST_METHODS.UI.BACK_LOADED.toLowerCase()]: FORECAST_METHODS.NORMALIZED.BACK_LOADED,
    [FORECAST_METHODS.UI.BELL_CURVE.toLowerCase()]: FORECAST_METHODS.NORMALIZED.BELL_CURVE,
    [FORECAST_METHODS.UI.MANUAL.toLowerCase()]: FORECAST_METHODS.NORMALIZED.MANUAL,
    [FORECAST_METHODS.UI.HISTORICAL.toLowerCase()]: FORECAST_METHODS.NORMALIZED.HISTORICAL,
    [FORECAST_METHODS.NORMALIZED.FRONT_LOADED]: FORECAST_METHODS.NORMALIZED.FRONT_LOADED,
    [FORECAST_METHODS.NORMALIZED.BACK_LOADED]: FORECAST_METHODS.NORMALIZED.BACK_LOADED,
    [FORECAST_METHODS.NORMALIZED.BELL_CURVE]: FORECAST_METHODS.NORMALIZED.BELL_CURVE,
    [FORECAST_METHODS.NORMALIZED.MANUAL]: FORECAST_METHODS.NORMALIZED.MANUAL,
    [FORECAST_METHODS.NORMALIZED.LINEAR]: FORECAST_METHODS.NORMALIZED.LINEAR,
  };
  return methodMap[method.toLowerCase()] || FORECAST_METHODS.NORMALIZED.MANUAL;
}

// Helper function: Calculate business days between two dates (inclusive)
function businessDaysBetween(start, end) {
  let count = 0;
  let current = moment(start);
  while (current.isSameOrBefore(end, 'day')) {
    if (current.isoWeekday() <= 5) { // Monday to Friday
      count++;
    }
    current.add(1, 'day');
  }
  return count;
}

// Helper function: Approximate normal CDF (cumulative distribution function)
function normCdf(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}

/**
 * Generate monthly forecast amounts based on the selected method, ensuring the total equals revisedBudget
 * @param {string} revisedBudget - Total budget to distribute (e.g., "$85235.88")
 * @param {string} startDate - Project start date (ISO string, e.g., "2025-02-25T00:00:00.000Z")
 * @param {string} endDate - Project end date (ISO string, e.g., "2025-07-04T00:00:00.000Z")
 * @param {string} method - Forecast method (normalized: 'frontloaded', 'backloaded', 'bell', 'linear', 'manual')
 * @param {Array} dynamicColumns - Array of column definitions with 'field' like 'february2025'
 * @param {Object} actualCosts - Month keys to actual cost values (e.g., { "february2025": 0 })
 * @returns {Object} - Monthly forecast with { actualCost, originalForecast, currentForecast }
 */
export function generateForecast(revisedBudget, startDate, endDate, method, dynamicColumns = [], actualCosts = {}) {
  const currentDate = moment();
  const start = moment(startDate);
  const end = moment(endDate);
  const budget = parseFloat(revisedBudget.replace('$', '')) || 0;
  const monthlyForecast = {};

  // Validate inputs
  if (!start.isValid() || !end.isValid() || start > end || isNaN(budget) || budget <= 0) {
    console.warn('Invalid inputs:', { startDate, endDate, budget });
    return dynamicColumns.reduce((acc, col) => ({
      ...acc,
      [col.field]: { actualCost: 0, originalForecast: 0, currentForecast: 0 },
    }), {});
  }

  // Determine month keys
  let monthKeys = dynamicColumns.length > 0
    ? dynamicColumns.map(col => col.field)
    : (() => {
        const keys = [];
        for (let d = moment(start).startOf('month'); d.isSameOrBefore(end, 'month'); d.add(1, 'month')) {
          keys.push(d.format('MMMMYYYY').toLowerCase());
        }
        return keys;
      })();

  // Find start and end indices
  const startMonth = start.format('MMMMYYYY').toLowerCase();
  const endMonth = end.format('MMMMYYYY').toLowerCase();
  const startIdx = monthKeys.indexOf(startMonth);
  const endIdx = monthKeys.indexOf(endMonth);

  if (startIdx === -1 || endIdx === -1) {
    console.warn('Start or end month not found:', { startMonth, endMonth, monthKeys });
    return monthKeys.reduce((acc, month) => ({
      ...acc,
      [month]: { actualCost: actualCosts[month] || 0, originalForecast: 0, currentForecast: 0 },
    }), {});
  }

  // Calculate business days per month within project period
  const d_m = {};
  monthKeys.forEach(month => {
    const firstDay = moment(month, 'MMMMYYYY').startOf('month');
    const lastDay = moment(month, 'MMMMYYYY').endOf('month');
    const effectiveStart = moment.max(start, firstDay);
    const effectiveEnd = moment.min(end, lastDay);
    d_m[month] = (effectiveStart <= effectiveEnd) ? businessDaysBetween(effectiveStart, effectiveEnd) : 0;
  });

  // Separate past and future months
  const pastMonths = [];
  const futureMonths = [];
  let pastActualTotal = 0;

  monthKeys.forEach((month, idx) => {
    const monthEnd = moment(month, 'MMMMYYYY').endOf('month');
    if (monthEnd.isBefore(currentDate) && idx >= startIdx && idx <= endIdx && d_m[month] > 0) {
      const actualCost = Number(actualCosts[month]) || 0;
      pastMonths.push({ month, actualCost });
      pastActualTotal += actualCost;
    } else if (idx >= startIdx && idx <= endIdx && d_m[month] > 0) {
      futureMonths.push(month);
    }
  });

  const remainingBudget = Math.max(0, budget - pastActualTotal);

  // Initialize forecast object
  monthKeys.forEach(month => {
    monthlyForecast[month] = {
      actualCost: Number(actualCosts[month]) || 0,
      originalForecast: 0, // Placeholder; adjust if needed
      currentForecast: 0,
    };
  });

  // Set past months to actual costs
  pastMonths.forEach(({ month, actualCost }) => {
    monthlyForecast[month].currentForecast = actualCost;
  });

  // Distribute remaining budget across future months
  if (futureMonths.length > 0) {
    futureMonths.sort((a, b) => moment(a, 'MMMMYYYY') - moment(b, 'MMMMYYYY'));
    const D_future = futureMonths.reduce((sum, month) => sum + d_m[month], 0);

    if (D_future > 0) {
      // Define CDF based on method
      let F;
      switch (method) {
        case FORECAST_METHODS.NORMALIZED.LINEAR:
        case FORECAST_METHODS.NORMALIZED.MANUAL:
          F = u => u; // Linear distribution
          break;
        case FORECAST_METHODS.NORMALIZED.BELL_CURVE:
          const mu = 0.4 + Math.random() * 0.2; // 40% to 60%
          const sigma = 0.15;
          F = u => normCdf((u - mu) / sigma);
          break;
        case FORECAST_METHODS.NORMALIZED.FRONT_LOADED:
          const u0_front = 0.25 + Math.random() * 0.25; // 25% to 50%
          const k_front = 10;
          F = u => 1 / (1 + Math.exp(-k_front * (u - u0_front)));
          break;
        case FORECAST_METHODS.NORMALIZED.BACK_LOADED:
          const u0_back = 0.5 + Math.random() * 0.25; // 50% to 75%
          const k_back = 10;
          F = u => 1 / (1 + Math.exp(-k_back * (u - u0_back)));
          break;
        default:
          console.warn(`Unknown method: "${method}". Defaulting to linear.`);
          F = u => u;
      }

      // Calculate forecast values
      let cumulative = 0;
      let totalDistributed = 0;
      futureMonths.forEach((month, idx) => {
        const t_start = cumulative / D_future;
        cumulative += d_m[month];
        const t_end = cumulative / D_future;
        const forecastValue = (F(t_end) - F(t_start)) * remainingBudget;
        monthlyForecast[month].currentForecast = forecastValue;
        totalDistributed += forecastValue;
      });

      // Adjust last month for exact total
      if (futureMonths.length > 0) {
        const lastMonth = futureMonths[futureMonths.length - 1];
        monthlyForecast[lastMonth].currentForecast += remainingBudget - totalDistributed;
      }
    }
  }

  // Verify total
  const finalSum = Object.values(monthlyForecast)
    .filter((val, idx) => idx >= startIdx && idx <= endIdx)
    .reduce((sum, val) => sum + val.currentForecast, 0);
  console.log('Final forecast sum:', finalSum, 'Expected budget:', budget);

  return monthlyForecast;
}