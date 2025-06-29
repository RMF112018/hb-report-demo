// src/renderer/components/ForecastingV2.js
// Refactored Forecasting component using AG Grid with tree data mode and data paths for transaction updates
// Features real-time horizontal (Revised Budget, Balance to Finish, Total) and vertical (Grand Totals) aggregations
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://www.ag-grid.com/react-data-grid/tree-data/
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/data-update-transactions/
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/column-properties/#valueGetter
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/row-pinning/

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Spin, Button, Select, Space, message } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined, SyncOutlined } from '@ant-design/icons';
import ComponentHeader from './ComponentHeader.js';
import TableModuleV2 from './TableModuleV2.js';
import { NumericCellRenderer } from '../utils/CustomCellRenderer.js';
import {
    fetchForecastData,
    generateDateColumns,
    generateForecast,
    FORECAST_METHODS,
    normalizeForecastMethod,
} from '../utils/forecastingUtils.js';
// import '../styles/global.css';

// Determine if in development mode
const isDevMode = process.env.NODE_ENV === 'development';

// Currency formatter for USD formatting with type checking
const currencyFormatter = (params) => {
    const value = params.value;
    if (value === undefined || value === null) return '';
    if (value === 'N/A' || value === '') return value;
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
        return Number(value).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }
    return '';
};

const ForecastingV2 = ({ selectedProject, headerContent, activeTab, onTabChange }) => {
    const [rowData, setRowData] = useState([]);
    const [grandTotals, setGrandTotals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false); // New state for refresh loading
    const [error, setError] = useState(null);
    const [dynamicColumns, setDynamicColumns] = useState([]);
    const [dataCache, setDataCache] = useState({});
    const [isAnyRowEditing, setIsAnyRowEditing] = useState(false);
    const [editingRowNode, setEditingRowNode] = useState(null);

    // Log selectedProject for debugging
    useEffect(() => {
        console.log('ForecastingV2 selectedProject:', selectedProject);
    }, [selectedProject]);

    // Calculate grand totals for pinned rows
    const calculateGrandTotals = useCallback((treeData) => {
        const categories = [
            { forecast: 'Actual Cost', label: 'Actual Cost Total' },
            { forecast: 'Original Forecast', label: 'Original Forecast Total' },
            { forecast: 'Current Forecast', label: 'Current Forecast Total' },
        ];
        return categories.map(({ forecast, label }) => {
            const categoryRows = treeData.filter((row) => row.forecast === forecast);
            const totalRow = {
                path: ['Grand Totals', label],
                costCode: 'Grand Totals',
                forecast: forecast,
                originalBudget: categoryRows.reduce((sum, row) => sum + (row.originalBudget || 0), 0),
                approvedCOs: categoryRows.reduce((sum, row) => sum + (row.approvedCOs || 0), 0),
                revisedBudget: categoryRows.reduce((sum, row) => sum + (row.originalBudget || 0) + (row.approvedCOs || 0), 0),
                startDate: '',
                endDate: '',
                projectedBudget: categoryRows.reduce((sum, row) => sum + (row.projectedBudget || 0), 0),
                projectedCosts: categoryRows.reduce((sum, row) => sum + (row.projectedCosts || 0), 0),
                estimatedCostAtCompletion: categoryRows.reduce((sum, row) => sum + (row.estimatedCostAtCompletion || row.currentEstimatedCostAtCompletion || row.originalEstimatedCostAtCompletion || 0), 0),
                jobToDateCosts: categoryRows.reduce((sum, row) => sum + (row.jobToDateCosts || 0), 0),
                projectedCostToComplete: categoryRows.reduce((sum, row) => sum + (row.projectedCostToComplete || 0), 0),
                forecastToComplete: 0,
                projectedOverUnder: categoryRows.reduce((sum, row) => sum + (row.projectedOverUnder || 0), 0),
                forecastRemainder: 'N/A',
            };

            dynamicColumns.forEach((col) => {
                totalRow[col.field] = {
                    actualCost: forecast === 'Actual Cost' ? categoryRows.reduce((sum, row) => sum + (row[col.field]?.actualCost || 0), 0) : 0,
                    originalForecast: forecast === 'Original Forecast' ? categoryRows.reduce((sum, row) => sum + (row[col.field]?.originalForecast || 0), 0) : 0,
                    currentForecast: forecast === 'Current Forecast' ? categoryRows.reduce((sum, row) => sum + (row[col.field]?.currentForecast || 0), 0) : 0,
                };
            });

            const total = dynamicColumns.reduce((sum, col) => {
                if (forecast === 'Actual Cost') return sum + (totalRow[col.field].actualCost || 0);
                if (forecast === 'Original Forecast') return sum + (totalRow[col.field].originalForecast || 0);
                if (forecast === 'Current Forecast') return sum + (totalRow[col.field].currentForecast || 0);
                return sum;
            }, 0);
            totalRow.forecastToComplete = totalRow.revisedBudget - total;
            return totalRow;
        });
    }, [dynamicColumns]);

    // Initial data load
    useEffect(() => {
        const loadData = async () => {
            if (!selectedProject?.procore_id) {
                setError('No project selected to fetch budget details.');
                setRowData([]);
                setIsLoading(false);
                return;
            }
            if (dataCache[activeTab]) {
                const result = dataCache[activeTab];
                setRowData(result.treeData);
                setDynamicColumns(result.dateColumns);
                setGrandTotals(calculateGrandTotals(result.treeData));
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const rawData = await fetchForecastData(activeTab, selectedProject.procore_id);
                const result = processGroupedData(rawData);
                setRowData(result.treeData);
                setDynamicColumns(result.dateColumns);
                setGrandTotals(calculateGrandTotals(result.treeData));
                setIsLoading(false);
                setDataCache((prev) => ({ ...prev, [activeTab]: result }));
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };
        loadData();
    }, [activeTab, dataCache, calculateGrandTotals, selectedProject?.procore_id]);

    // Handle refresh of project-specific budget details
    const handleRefresh = async () => {
        if (!selectedProject?.procore_id) {
          message.error('No project selected to refresh.');
          return;
        }
        try {
            setIsRefreshing(true);
            await window.electronAPI.syncProjectBudget(selectedProject.procore_id);
            const updatedData = await fetchForecastData(activeTab, selectedProject.procore_id);
            const result = processGroupedData(updatedData);
            setRowData(result.treeData);
            setDynamicColumns(result.dateColumns);
            setGrandTotals(calculateGrandTotals(result.treeData));
            setDataCache((prev) => ({ ...prev, [activeTab]: result }));
            message.success('Budget details refreshed successfully!');
        } catch (error) {
            message.error('Failed to refresh budget details.');
            console.error('Error refreshing budget details:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleConfirmEdit = useCallback(async (updatedRow, api) => {
        try {
            const result = await window.electronAPI.updateForecastData(updatedRow, activeTab);
            setDataCache((prev) => {
                const cached = prev[activeTab];
                if (!cached) return prev;
                const newTreeData = cached.treeData.map((row) =>
                    row.costCode === updatedRow.costCode && row.forecast === updatedRow.forecast
                        ? { ...row, ...updatedRow }
                        : row
                );
                return { ...prev, [activeTab]: { ...cached, treeData: newTreeData } };
            });
            setRowData((prev) => {
                const newTreeData = prev.map((row) =>
                    getRowId({ data: row }) === getRowId({ data: updatedRow }) ? updatedRow : row
                );
                setGrandTotals(calculateGrandTotals(newTreeData));
                return newTreeData;
            });
            setIsAnyRowEditing(false);
            setEditingRowNode(null);
            api.stopEditing(false);
            api.refreshCells({ force: true });
        } catch (error) {
            console.error('Failed to update forecast data:', error);
            setError('Failed to save changes. Please try again.');
        }
    }, [activeTab, editingRowNode, calculateGrandTotals]);

    const onCellValueChanged = useCallback((params) => {
        const updatedRow = { ...params.data };
        setRowData((prev) => {
            const newTreeData = prev.map((row) =>
                getRowId({ data: row }) === getRowId({ data: updatedRow }) ? updatedRow : row
            );
            setGrandTotals(calculateGrandTotals(newTreeData));
            params.api.refreshCells({ force: true });
            return newTreeData;
        });
    }, [getRowId, calculateGrandTotals]);

    const processGroupedData = (forecastData) => {
        const validDate = (dateStr) => {
            if (!dateStr || typeof dateStr !== 'string') return '';
            const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z)?$/;
            return isoDateRegex.test(dateStr) ? dateStr : '';
        };

        const dateColumns = generateDateColumns(forecastData);
        const treeData = [];

        forecastData.forEach((row) => {
            const costCode = row.costCode;
            const groupNode = { path: [costCode], costCode };
            treeData.push(groupNode);

            const actualCostRow = {
                path: [costCode, 'Actual Cost'],
                costCode,
                description: row.description || '',
                forecast: 'Actual Cost',
                originalBudget: row.originalBudget || 0,
                approvedCOs: row.approvedCOs || 0,
                startDate: validDate(row.startDate),
                endDate: validDate(row.endDate),
                projectedBudget: row.projectedBudget || 0,
                projectedCosts: row.projectedCosts || 0,
                estimatedCostAtCompletion: row.estimatedCostAtCompletion || 0,
                jobToDateCosts: row.jobToDateCosts || 0,
                projectedCostToComplete: row.projectedCostToComplete || 0,
                projectedOverUnder: row.projectedOverUnder || 0,
                forecastRemainder: row.forecastRemainder || 'N/A',
            };

            const guidanceRow = {
                path: [costCode, 'Forecast Guidance'],
                costCode,
                description: 'Computed Guidance',
                forecast: 'Forecast Guidance',
                method: row.currentMethod || 'manual',
                originalBudget: '',
                approvedCOs: '',
                revisedBudget: '',
                startDate: '',
                endDate: '',
            };

            const originalForecastRow = {
                path: [costCode, 'Original Forecast'],
                costCode,
                description: '',
                forecast: 'Original Forecast',
                originalBudget: row.originalBudget || 0,
                approvedCOs: row.approvedCOs || 0,
                originalStartDate: validDate(row.originalStartDate),
                originalEndDate: validDate(row.originalEndDate),
                forecastToComplete: row.originalForecastToComplete || 0,
                originalEstimatedCostAtCompletion: row.originalEstimatedCostAtCompletion || 0,
            };

            const originalVarianceRow = {
                path: [costCode, 'Original Forecast', 'Variance to Actual'],
                costCode,
                description: '',
                forecast: 'Variance',
                varianceLabel: 'Variance to Actual',
                originalBudget: row.originalBudget || 0,
                approvedCOs: row.approvedCOs || 0,
            };

            const currentForecastRow = {
                path: [costCode, 'Current Forecast'],
                costCode,
                description: '',
                forecast: 'Current Forecast',
                originalBudget: row.originalBudget || 0,
                approvedCOs: row.approvedCOs || 0,
                currentStartDate: validDate(row.currentStartDate),
                currentEndDate: validDate(row.currentEndDate),
                forecastToComplete: row.currentForecastToComplete || 0,
                currentEstimatedCostAtCompletion: row.currentEstimatedCostAtCompletion || 0,
            };

            const currentVarianceRow = {
                path: [costCode, 'Current Forecast', 'Variance to Actual'],
                costCode,
                description: '',
                forecast: 'Variance',
                varianceLabel: 'Variance to Actual',
                originalBudget: row.originalBudget || 0,
                approvedCOs: row.approvedCOs || 0,
            };

            dateColumns.forEach((col) => {
                const fieldData = row[col.field] || {};
                actualCostRow[col.field] = {
                    actualCost: fieldData.actualCost || 0,
                    originalForecast: 0,
                    currentForecast: 0,
                };
                guidanceRow[col.field] = {
                    actualCost: 0,
                    originalForecast: 0,
                    currentForecast: generateForecast(
                        `${row.originalBudget + row.approvedCOs}`,
                        row.currentStartDate,
                        row.currentEndDate,
                        row.currentMethod,
                        dateColumns
                    )[col.field]?.currentForecast || 0,
                };
                originalForecastRow[col.field] = {
                    actualCost: 0,
                    originalForecast: fieldData.originalForecast || 0,
                    currentForecast: 0,
                };
                originalVarianceRow[col.field] = (fieldData.actualCost || 0) - (fieldData.originalForecast || 0);
                currentForecastRow[col.field] = {
                    actualCost: 0,
                    originalForecast: 0,
                    currentForecast: fieldData.currentForecast || 0,
                };
                currentVarianceRow[col.field] = (fieldData.actualCost || 0) - (fieldData.currentForecast || 0);
            });

            treeData.push(actualCostRow);
            treeData.push(guidanceRow);
            treeData.push(originalForecastRow);
            treeData.push(originalVarianceRow);
            treeData.push(currentForecastRow);
            treeData.push(currentVarianceRow);
        });

        return { treeData, dateColumns };
    };

    const baseColumns = [
        {
            headerName: 'Original Budget',
            field: 'originalBudget',
            width: 150,
            valueGetter: (params) => {
                if (params.node.level === 0 && params.data.costCode !== 'Grand Totals') return undefined;
                return params.data?.forecast === 'Forecast Guidance' ? '' : params.data?.originalBudget;
            },
            valueSetter: (params) => {
                if (params.data && params.data.isEditing && params.data.forecast !== 'Forecast Guidance') {
                    params.data.originalBudget = params.newValue || 0;
                    return true;
                }
                return false;
            },
            valueFormatter: currencyFormatter,
            editable: (params) => params.data?.isEditing && ['Actual Cost', 'Original Forecast', 'Current Forecast'].includes(params.data.forecast),
            cellClassRules: {
                'no-select': (params) => !params.data?.isEditing || !['Actual Cost', 'Original Forecast', 'Current Forecast'].includes(params.data.forecast),
            },
        },
        {
            headerName: 'Approved COs',
            field: 'approvedCOs',
            width: 150,
            valueGetter: (params) => {
                if (params.node.level === 0 && params.data.costCode !== 'Grand Totals') return undefined;
                return params.data?.forecast === 'Forecast Guidance' ? '' : params.data?.approvedCOs;
            },
            valueSetter: (params) => {
                if (params.data && params.data.isEditing && params.data.forecast !== 'Forecast Guidance') {
                    params.data.approvedCOs = params.newValue || 0;
                    return true;
                }
                return false;
            },
            valueFormatter: currencyFormatter,
            editable: (params) => params.data?.isEditing && ['Actual Cost', 'Original Forecast', 'Current Forecast'].includes(params.data.forecast),
            cellClassRules: {
                'no-select': (params) => !params.data?.isEditing || !['Actual Cost', 'Original Forecast', 'Current Forecast'].includes(params.data.forecast),
            },
        },
        {
            headerName: 'Revised Budget',
            field: 'revisedBudget',
            width: 150,
            valueGetter: (params) => {
                if (params.node.level === 0 && params.data.costCode !== 'Grand Totals') return undefined;
                if (!params.data || params.data.forecast === 'Forecast Guidance') return '';
                const originalBudget = Number(params.data.originalBudget) || 0;
                const approvedCOs = Number(params.data.approvedCOs) || 0;
                return originalBudget + approvedCOs;
            },
            valueFormatter: currencyFormatter,
            editable: false,
        },
        {
            headerName: 'Start Date',
            field: 'startDate',
            width: 150,
            valueGetter: (params) => {
                if (params.node.level === 0 && params.data.costCode !== 'Grand Totals') return undefined;
                if (!params.data) return '';
                if (params.data.forecast === 'Forecast Guidance') return '';
                const date = params.data.startDate || params.data.originalStartDate || params.data.currentStartDate;
                return date ? new Date(date) : '';
            },
            valueFormatter: (params) => (params.value instanceof Date ? params.value.toISOString().split('T')[0] : params.value || ''),
            valueSetter: (params) => {
                if (params.data && params.data.isEditing && params.data.forecast !== 'Forecast Guidance') {
                    if (params.data.forecast === 'Actual Cost') params.data.startDate = params.newValue ? params.newValue.toISOString().split('T')[0] : '';
                    else if (params.data.forecast === 'Original Forecast') params.data.originalStartDate = params.newValue ? params.newValue.toISOString().split('T')[0] : '';
                    else if (params.data.forecast === 'Current Forecast') params.data.currentStartDate = params.newValue ? params.newValue.toISOString().split('T')[0] : '';
                    return true;
                }
                return false;
            },
            editable: (params) => params.data?.isEditing && ['Actual Cost', 'Original Forecast', 'Current Forecast'].includes(params.data.forecast),
            cellEditor: 'agDateCellEditor',
            cellClassRules: {
                'no-select': (params) => !params.data?.isEditing || !['Actual Cost', 'Original Forecast', 'Current Forecast'].includes(params.data.forecast),
            },
        },
        {
            headerName: 'End Date',
            field: 'endDate',
            width: 150,
            valueGetter: (params) => {
                if (params.node.level === 0 && params.data.costCode !== 'Grand Totals') return undefined;
                if (!params.data) return '';
                if (params.data.forecast === 'Forecast Guidance') return '';
                const date = params.data.endDate || params.data.originalEndDate || params.data.currentEndDate;
                return date ? new Date(date) : '';
            },
            valueFormatter: (params) => (params.value instanceof Date ? params.value.toISOString().split('T')[0] : params.value || ''),
            valueSetter: (params) => {
                if (params.data && params.data.isEditing && params.data.forecast !== 'Forecast Guidance') {
                    if (params.data.forecast === 'Actual Cost') params.data.endDate = params.newValue ? params.newValue.toISOString().split('T')[0] : '';
                    else if (params.data.forecast === 'Original Forecast') params.data.originalEndDate = params.newValue ? params.newValue.toISOString().split('T')[0] : '';
                    else if (params.data.forecast === 'Current Forecast') params.data.currentEndDate = params.newValue ? params.newValue.toISOString().split('T')[0] : '';
                    return true;
                }
                return false;
            },
            editable: (params) => params.data?.isEditing && ['Actual Cost', 'Original Forecast', 'Current Forecast'].includes(params.data.forecast),
            cellEditor: 'agDateCellEditor',
            cellClassRules: {
                'no-select': (params) => !params.data?.isEditing || !['Actual Cost', 'Original Forecast', 'Current Forecast'].includes(params.data.forecast),
            },
        },
        {
            headerName: 'Projected Budget',
            field: 'projectedBudget',
            width: 150,
            hide: true,
            valueGetter: (params) => {
                if (params.node.level === 0 && params.data.costCode !== 'Grand Totals') return undefined;
                return params.data?.projectedBudget;
            },
            valueSetter: (params) => {
                if (params.data && params.data.isEditing) {
                    params.data.projectedBudget = params.newValue || 0;
                    return true;
                }
                return false;
            },
            valueFormatter: currencyFormatter,
            editable: (params) => params.data?.isEditing && ['Actual Cost'].includes(params.data.forecast),
        },
        {
            headerName: 'Projected Costs',
            field: 'projectedCosts',
            width: 150,
            hide: true,
            valueGetter: (params) => {
                if (params.node.level === 0 && params.data.costCode !== 'Grand Totals') return undefined;
                return params.data?.projectedCosts;
            },
            valueSetter: (params) => {
                if (params.data && params.data.isEditing) {
                    params.data.projectedCosts = params.newValue || 0;
                    return true;
                }
                return false;
            },
            valueFormatter: currencyFormatter,
            editable: (params) => params.data?.isEditing && ['Actual Cost'].includes(params.data.forecast),
        },
        {
            headerName: 'Job to Date Costs',
            field: 'jobToDateCosts',
            width: 150,
            hide: true,
            valueGetter: (params) => {
                if (params.node.level === 0 && params.data.costCode !== 'Grand Totals') return undefined;
                return params.data?.jobToDateCosts;
            },
            valueSetter: (params) => {
                if (params.data && params.data.isEditing) {
                    params.data.jobToDateCosts = params.newValue || 0;
                    return true;
                }
                return false;
            },
            valueFormatter: currencyFormatter,
            editable: (params) => params.data?.isEditing && ['Actual Cost'].includes(params.data.forecast),
        },
        {
            headerName: 'Projected Cost to Complete',
            field: 'projectedCostToComplete',
            width: 150,
            hide: true,
            valueGetter: (params) => {
                if (params.node.level === 0 && params.data.costCode !== 'Grand Totals') return undefined;
                return params.data?.projectedCostToComplete;
            },
            valueSetter: (params) => {
                if (params.data && params.data.isEditing) {
                    params.data.projectedCostToComplete = params.newValue || 0;
                    return true;
                }
                return false;
            },
            valueFormatter: currencyFormatter,
            editable: (params) => params.data?.isEditing && ['Actual Cost'].includes(params.data.forecast),
        },
        {
            headerName: 'Projected Over/Under',
            field: 'projectedOverUnder',
            width: 150,
            hide: true,
            valueGetter: (params) => {
                if (params.node.level === 0 && params.data.costCode !== 'Grand Totals') return undefined;
                return params.data?.projectedOverUnder;
            },
            valueSetter: (params) => {
                if (params.data && params.data.isEditing) {
                    params.data.projectedOverUnder = params.newValue || 0;
                    return true;
                }
                return false;
            },
            valueFormatter: currencyFormatter,
            editable: (params) => params.data?.isEditing && ['Actual Cost'].includes(params.data.forecast),
        },
        {
            headerName: 'Forecast Remainder',
            field: 'forecastRemainder',
            width: 150,
            hide: true,
            valueGetter: (params) => {
                if (params.node.level === 0 && params.data.costCode !== 'Grand Totals') return undefined;
                return params.data?.forecastRemainder;
            },
            valueSetter: (params) => {
                if (params.data && params.data.isEditing) {
                    params.data.forecastRemainder = params.newValue || 'N/A';
                    return true;
                }
                return false;
            },
            valueFormatter: (params) => params.value || '',
            editable: (params) => params.data?.isEditing && ['Actual Cost'].includes(params.data.forecast),
        },
    ];

    const dynamicColumnsDefs = dynamicColumns.map((col) => ({
        headerName: col.headerName,
        field: col.field,
        width: 120,
        cellRenderer: 'numericCellRenderer',
        valueGetter: (params) => {
            if (params.node.level === 0 && params.data.costCode !== 'Grand Totals') return undefined;
            if (!params.data || !(col.field in params.data)) return 0;
            const fieldData = params.data[col.field];
            if (!fieldData) {
                console.warn(`Field ${col.field} is undefined for row:`, params.data);
                return 0;
            }
            if (params.data.forecast === 'Actual Cost') return fieldData.actualCost || 0;
            if (params.data.forecast === 'Forecast Guidance') return fieldData.currentForecast || 0;
            if (params.data.forecast === 'Original Forecast') return fieldData.originalForecast || 0;
            if (params.data.forecast === 'Current Forecast') return fieldData.currentForecast || 0;
            if (params.data.forecast === 'Variance') {
                const parentForecast = params.node.parent.data.forecast;
                const actualCostRow = params.node.parent.parent.childrenAfterFilter.find(n => n.data.forecast === 'Actual Cost');
                const actualCost = actualCostRow ? (actualCostRow.data[col.field]?.actualCost || 0) : 0;
                const forecastValue = parentForecast === 'Original Forecast'
                    ? (params.node.parent.data[col.field]?.originalForecast || 0)
                    : (params.node.parent.data[col.field]?.currentForecast || 0);
                const variance = actualCost - forecastValue;
                if (isNaN(variance)) {
                    console.warn(`Variance calculation resulted in NaN for ${col.field}:`, { actualCost, forecastValue });
                    return 0;
                }
                return variance;
            }
            return 0;
        },
        valueFormatter: currencyFormatter,
        valueSetter: (params) => {
            if (params.data && params.data.isEditing) {
                params.data[col.field] = {
                    ...params.data[col.field],
                    actualCost: params.data.forecast === 'Actual Cost' ? params.newValue || 0 : params.data[col.field].actualCost,
                    originalForecast: params.data.forecast === 'Original Forecast' ? params.newValue || 0 : params.data[col.field].originalForecast,
                    currentForecast: params.data.forecast === 'Current Forecast' ? params.newValue || 0 : params.data[col.field].currentForecast,
                };
                return true;
            }
            return false;
        },
        editable: (params) => params.data?.isEditing && ['Actual Cost', 'Original Forecast', 'Current Forecast'].includes(params.data.forecast),
        cellEditor: 'agNumberCellEditor',
        cellClassRules: {
            'no-select': (params) => !params.data?.isEditing || !['Actual Cost', 'Original Forecast', 'Current Forecast'].includes(params.data.forecast),
        },
    }));

    const additionalColumns = [
        {
            headerName: 'Balance to Finish',
            field: 'balanceToFinish',
            width: 150,
            type: 'numericColumn',
            pinned: 'right',
            valueGetter: (params) => {
                if (params.node.level === 0 && params.data.costCode !== 'Grand Totals') return undefined;
                if (!params.data) return 0;
                let originalBudget = params.data.originalBudget || 0;
                let approvedCOs = params.data.approvedCOs || 0;
                if (params.data.forecast === 'Forecast Guidance') {
                    const currentForecastRow = params.node.parent.childrenAfterFilter.find(
                        (n) => n.data.forecast === 'Current Forecast'
                    )?.data;
                    originalBudget = currentForecastRow?.originalBudget || 0;
                    approvedCOs = currentForecastRow?.approvedCOs || 0;
                }
                const revisedBudget = Number(originalBudget) + Number(approvedCOs);
                const total = dynamicColumns.reduce((sum, col) => {
                    if (params.data.forecast === 'Actual Cost') return sum + (params.data[col.field]?.actualCost || 0);
                    if (params.data.forecast === 'Original Forecast') return sum + (params.data[col.field]?.originalForecast || 0);
                    if (params.data.forecast === 'Current Forecast' || params.data.forecast === 'Forecast Guidance') {
                        return sum + (params.data[col.field]?.currentForecast || 0);
                    }
                    return sum;
                }, 0);
                return revisedBudget - total;
            },
            valueFormatter: currencyFormatter,
            editable: false,
            cellStyle: (params) => {
                const style = { fontWeight: 'bold' };
                if (params.value < 0) {
                    style.color = 'red';
                }
                return style;
            },
        },
        {
            headerName: 'Total',
            field: 'total',
            width: 150,
            type: 'numericColumn',
            pinned: 'right',
            valueGetter: (params) => {
                if (params.node.level === 0 && params.data.costCode !== 'Grand Totals') return undefined;
                if (!params.data) return 0;
                return dynamicColumns.reduce((sum, col) => {
                    if (params.data.forecast === 'Actual Cost') return sum + (params.data[col.field]?.actualCost || 0);
                    if (params.data.forecast === 'Original Forecast') return sum + (params.data[col.field]?.originalForecast || 0);
                    if (params.data.forecast === 'Current Forecast' || params.data.forecast === 'Forecast Guidance') {
                        return sum + (params.data[col.field]?.currentForecast || 0);
                    }
                    return sum;
                }, 0);
            },
            valueFormatter: currencyFormatter,
            editable: false,
            cellStyle: { fontWeight: 'bold' },
        },
    ];

    const columns = [...baseColumns, ...dynamicColumnsDefs, ...additionalColumns];

    const getDataPath = useMemo(() => {
        return (data) => data.path;
    }, []);

    const getRowId = useMemo(() => {
        return (params) => {
            const data = params.data;
            return `${data.path.join('.')}.${data.forecast || 'group'}${data.varianceLabel ? `.${data.varianceLabel}` : ''}`;
        };
    }, []);

    const autoGroupColumnDef = useMemo(() => {
        return {
            headerName: 'Cost Code',
            minWidth: 250,
            pinned: 'left',
            autoHeight: true,
            cellRendererParams: {
                suppressCount: true,
                suppressDoubleClickExpand: true,
                suppressEnterExpand: true,
                innerRenderer: (params) => {
                    const { node, api, data } = params;

                    if (node.rowPinned === 'bottom') {
                        const label = `${data.forecast} Total`;
                        return <span>{label}</span>;
                    }

                    const isEditableRow = data && (
                        ['Original Forecast', 'Current Forecast', 'Forecast Guidance'].includes(data.forecast) ||
                        (data.forecast === 'Actual Cost' && isDevMode)
                    );
                    const isEditingThisRow = editingRowNode && node.id === editingRowNode.id;

                    const startEditing = () => {
                        api.forEachNode((otherNode) => {
                            if (otherNode !== node && otherNode.data?.isEditing) {
                                otherNode.data.isEditing = false;
                                api.refreshCells({ rowNodes: [otherNode], force: true });
                            }
                        });
                        setIsAnyRowEditing(true);
                        setEditingRowNode(node);
                        data.isEditing = true;
                        data.originalData = { ...data };
                        api.startEditingCell({
                            rowIndex: node.rowIndex,
                            colKey: 'startDate',
                        });
                        api.refreshCells({ rowNodes: [node], force: true });
                    };

                    const confirmEdit = () => {
                        handleConfirmEdit(data, api);
                    };

                    const cancelEdit = () => {
                        setIsAnyRowEditing(false);
                        setEditingRowNode(null);
                        data.isEditing = false;
                        Object.assign(data, data.originalData);
                        delete data.originalData;
                        api.stopEditing(true);
                        api.refreshCells({ rowNodes: [node], force: true });
                    };

                    const handleMethodChange = (value) => {
                        if (data.forecast === 'Forecast Guidance' && isEditingThisRow) {
                            data.method = value;
                            const currentForecastRow = node.parent.childrenAfterFilter.find(n => n.data.forecast === 'Current Forecast')?.data;
                            const actualCosts = {};
                            dynamicColumns.forEach(col => {
                                actualCosts[col.field] = currentForecastRow[col.field]?.actualCost || 0;
                            });
                            const forecastValues = generateForecast(
                                `${(currentForecastRow.originalBudget || 0) + (currentForecastRow.approvedCOs || 0)}.00`,
                                currentForecastRow.currentStartDate,
                                currentForecastRow.currentEndDate,
                                value,
                                dynamicColumns,
                                actualCosts
                            );
                            dynamicColumns.forEach(col => {
                                data[col.field] = {
                                    actualCost: 0,
                                    originalForecast: 0,
                                    currentForecast: forecastValues[col.field]?.currentForecast || 0,
                                };
                            });
                            api.refreshCells({ rowNodes: [node], force: true });
                        }
                    };

                    let label = '';
                    if (node.level === 0) {
                        label = data?.costCode || params.value;
                    } else if (node.level === 1) {
                        label = data?.forecast || params.value;
                    } else if (node.level === 2 && data?.varianceLabel) {
                        label = data.varianceLabel;
                    }

                    if (!isEditableRow || node.level !== 1) {
                        return <span>{label}</span>;
                    }

                    if (data.forecast === 'Forecast Guidance') {
                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <span>{label}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {isEditingThisRow ? (
                                            <>
                                                <Button type="text" icon={<CheckOutlined />} onClick={confirmEdit} aria-label="Confirm edit" />
                                                <Button type="text" icon={<CloseOutlined />} onClick={cancelEdit} aria-label="Cancel edit" />
                                            </>
                                        ) : (
                                            <Button type="text" icon={<EditOutlined />} onClick={startEditing} aria-label="Edit row" />
                                        )}
                                    </div>
                                </div>
                                {isEditingThisRow ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        <span style={{ fontSize: 9 }}>Method:</span>
                                        <Select
                                            value={data.method}
                                            onChange={handleMethodChange}
                                            options={Object.values(FORECAST_METHODS.NORMALIZED).map(value => ({ label: value, value }))}
                                            style={{ width: 120, height: 16, fontSize: 9 }}
                                        />
                                    </div>
                                ) : (
                                    <span style={{ fontSize: 9 }}>Method: {data.method}</span>
                                )}
                            </div>
                        );
                    }

                    return (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', width: '100%' }}>
                            <span>{label}</span>
                            {isEditingThisRow ? (
                                <>
                                    <Button type="text" icon={<CheckOutlined />} onClick={confirmEdit} aria-label="Confirm edit" />
                                    <Button type="text" icon={<CloseOutlined />} onClick={cancelEdit} aria-label="Cancel edit" />
                                </>
                            ) : (
                                <Button type="text" icon={<EditOutlined />} onClick={startEditing} aria-label="Edit row" />
                            )}
                        </div>
                    );
                },
                suppressExpand: () => false,
            },
        };
    }, [handleConfirmEdit, editingRowNode, dynamicColumns]);

    const gridOptions = useMemo(() => ({
        treeData: true,
        getDataPath: getDataPath,
        getRowId: getRowId,
        autoGroupColumnDef: {
            ...autoGroupColumnDef,
            cellStyle: { backgroundColor: '#f3f3f3', fontWeight: 'bold' },
        },
        components: {
            numericCellRenderer: NumericCellRenderer,
        },
        defaultColDef: {
            editable: false,
        },
        singleClickEdit: isAnyRowEditing,
        suppressMultiRanges: true,
        cellSelection: true,
        groupDefaultExpanded: 1,
        pinnedBottomRowData: grandTotals,
        suppressStickyTotalRow: false,
        columnHoverHighlight: true,
        onGridReady: (params) => {
            params.api.forEachNode((node) => {
                if (node.level === 0) node.setExpanded(true);
                else node.setExpanded(false);
            });
        },
        onCellValueChanged: onCellValueChanged,
        rowClassRules: {
            'cost-code-row': (params) => params.node.level === 0,
            'guidance-variance-row': (params) => ['Forecast Guidance', 'Variance'].includes(params.data.forecast),
        },
    }), [getDataPath, getRowId, autoGroupColumnDef, isAnyRowEditing, grandTotals, onCellValueChanged]);

    // Updated header actions with Refresh button
    const headerActions = (
        <Space>
            <Button
                onClick={handleRefresh}
                loading={isRefreshing}
                icon={<SyncOutlined />}
                aria-label="Refresh budget details"
            >
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            {headerContent.actions}
        </Space>
    );

    const headerHeight = 48;
    const totalFixedHeight = headerHeight;

    return (
        <div
            className="forecasting-container"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 52px)',
                position: 'relative',
            }}
        >
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backgroundColor: '#fff',
                }}
            >
                <ComponentHeader
                    title={headerContent.title}
                    tabs={headerContent.tabs}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                    actions={headerActions}
                />
            </div>
            {isLoading ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        height: `calc(100% - ${totalFixedHeight}px)`,
                    }}
                >
                    <Spin />
                </div>
            ) : error ? (
                <div
                    style={{
                        textAlign: 'center',
                        color: 'red',
                        flex: 1,
                        height: `calc(100% - ${totalFixedHeight}px)`,
                    }}
                >
                    {error}
                </div>
            ) : (
                <div
                    style={{
                        flex: 1,
                        height: `calc(100% - ${totalFixedHeight}px)`,
                        overflowY: 'auto',
                        overflowX: 'auto',
                    }}
                >
                    <TableModuleV2
                        data={rowData}
                        columns={columns}
                        enableFullscreen={true}
                        enableFiltering={true}
                        enableSearch={false}
                        gridId="forecasting"
                        treeData={true}
                        getDataPath={getDataPath}
                        autoGroupColumnDef={autoGroupColumnDef}
                        agGridProps={gridOptions}
                    />
                </div>
            )}
        </div>
    );
};

ForecastingV2.propTypes = {
    selectedProject: PropTypes.shape({
        projectNumber: PropTypes.string,
        name: PropTypes.string,
        procore_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired, // Make selectedProject required
    headerContent: PropTypes.shape({
        title: PropTypes.node.isRequired,
        tabs: PropTypes.arrayOf(
            PropTypes.shape({
                key: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired,
            })
        ),
        actions: PropTypes.node,
    }).isRequired,
    activeTab: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
};

export default ForecastingV2;