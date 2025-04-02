// src/renderer/components/Forecasting.js
// Extended Forecasting component to include a "Charts" tab that visualizes data from the "Compare" tab using ag-charts.
// Instructions for use:
// 1. Ensure you have installed the required packages:
//      npm install ag-charts-community ag-charts-react
// 2. Import this updated component in src/renderer/App.js.
// 3. The "Charts" tab automatically processes the compare data to produce a pivoted dataset and displays a professional column chart.
// Reference: https://www.ag-grid.com/charts/react/quick-start/

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Input, Space, Spin, Button, Tabs, DatePicker, Drawer } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import ComponentHeader from './ComponentHeader.js';
import TableModule from './TableModule.js';
import { NumericCellRenderer, MergedCellRenderer } from '../utils/CustomCellRenderer.js';
import moment from 'moment';
import { AgCharts } from 'ag-charts-react';
import '../styles/global.css';
import '../styles/TableModule.css';

const { TabPane } = Tabs;

const Forecasting = ({ selectedProject, headerContent, activeTab, onTabChange }) => {
    // Existing state and refs...
    const [rowData, setRowData] = useState([]);
    const [compareData, setCompareData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [viewTab, setViewTab] = useState('original');
    const [error, setError] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [tempRowData, setTempRowData] = useState({});
    const [dynamicColumns, setDynamicColumns] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const inputRefs = useRef({});
    const dataCache = useRef({});

    const StartDateCellRenderer = (params) => {
        if (!params.data || params.data.costCode === 'Grand Totals') return null;
        return (
            <DatePicker
                value={params.data.startDate ? moment(params.data.startDate) : null}
                onChange={(date) => {
                    const newData = [...rowData];
                    const index = newData.findIndex((row) => row.costCode === params.data.costCode);
                    newData[index].startDate = date ? date.toDate() : null;
                    setRowData(newData);
                }}
                format="MM/DD/YYYY"
                style={{ width: '100%', height: '28px' }}
                allowClear
            />
        );
    };

    const EndDateCellRenderer = (params) => {
        if (!params.data || params.data.costCode === 'Grand Totals') return null;
        return (
            <DatePicker
                value={params.data.endDate ? moment(params.data.endDate) : null}
                onChange={(date) => {
                    const newData = [...rowData];
                    const index = newData.findIndex((row) => row.costCode === params.data.costCode);
                    newData[index].endDate = date ? date.toDate() : null;
                    setRowData(newData);
                }}
                format="MM/DD/YYYY"
                style={{ width: '100%', height: '28px' }}
                allowClear
            />
        );
    };

    // Base columns definitions (editable and read-only) remain unchanged…
    const baseColumnsEditable = [
        {
            headerName: 'Actions',
            field: 'actions',
            pinned: 'left',
            width: 100,
            cellRenderer: (params) => {
                if (params.data.costCode === 'Grand Totals') return '';
                return (
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                            console.log('Edit button clicked for row:', params.data.costCode);
                            setEditingRow(params.data.costCode);
                            setTempRowData({ ...params.data });
                            setIsDrawerOpen(true);
                            setTimeout(() => {
                                const firstDynamicCol = dynamicColumns[0]?.field;
                                const refKey = `${params.data.costCode}-${firstDynamicCol}`;
                                console.log('Attempting to focus:', refKey);
                                if (firstDynamicCol && inputRefs.current[refKey]) {
                                    inputRefs.current[refKey].focus();
                                    console.log('Focused input for:', refKey);
                                } else {
                                    console.log('No input ref found for:', refKey);
                                }
                            }, 200);
                        }}
                    />
                );
            },
        },
        { field: 'costCode', headerName: 'Cost Code', width: 150, pinned: 'left' },
        { field: 'description', headerName: 'Description', width: 250, pinned: 'left' },
        { field: 'startDate', headerName: 'Start Date', width: 150, cellRenderer: StartDateCellRenderer },
        { field: 'endDate', headerName: 'End Date', width: 150, cellRenderer: EndDateCellRenderer },
        { field: 'approvedCOs', headerName: 'Approved COs', width: 120 },
        { field: 'revisedBudget', headerName: 'Revised Budget', width: 150 },
    ];

    const baseColumnsReadOnly = [
        { 
            field: 'costCode', 
            headerName: 'Cost Code', 
            width: 150, 
            pinned: 'left', 
            cellRenderer: MergedCellRenderer,
            valueGetter: (params) => params.data.costCode || 'N/A',
            cellStyle: () => ({ minHeight: '96px' }),
        },
        { 
            field: 'description', 
            headerName: 'Description', 
            width: 250, 
            pinned: 'left', 
            cellRenderer: MergedCellRenderer,
            valueGetter: (params) => params.data.description || 'N/A',
            cellStyle: () => ({ minHeight: '96px' }),
        },
        { field: 'type', headerName: 'Type', width: 150 },
        { field: 'startDate', headerName: 'Start Date', width: 150, valueFormatter: (params) => params.value ? moment(params.value).format('MM/DD/YYYY') : '' },
        { field: 'endDate', headerName: 'End Date', width: 150, valueFormatter: (params) => params.value ? moment(params.value).format('MM/DD/YYYY') : '' },
        { 
            field: 'approvedCOs', 
            headerName: 'Approved COs', 
            width: 120,
            valueGetter: (params) => params.data.approvedCOs || '$0.00',
            valueFormatter: (params) => params.value || '$0.00',
        },
        { 
            field: 'revisedBudget', 
            headerName: 'Revised Budget', 
            width: 150,
            valueGetter: (params) => params.data.revisedBudget || '$0.00',
            valueFormatter: (params) => params.value || '$0.00',
        },
        {
            field: 'total',
            headerName: 'Total',
            width: 150,
            cellRenderer: NumericCellRenderer,
            valueGetter: (params) => {
                let total = 0;
                if (dynamicColumns && dynamicColumns.length > 0) {
                    dynamicColumns.forEach(col => {
                        total += Number(params.data[col.field] || 0);
                    });
                }
                return total;
            },
            valueFormatter: (params) =>
                Number(params.value ?? 0).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }),
        },
        {
            field: 'variance',
            headerName: 'Variance',
            width: 150,
            cellRenderer: NumericCellRenderer,
            valueGetter: (params) => {
                const total = dynamicColumns && dynamicColumns.length > 0
                    ? dynamicColumns.reduce((sum, col) => sum + (Number(params.data[col.field]) || 0), 0)
                    : 0;
                const revisedBudget = parseFloat(params.data.revisedBudget?.replace(/[^0-9.-]+/g, '') || 0);
                return revisedBudget - total;
            },
            valueFormatter: (params) =>
                Number(params.value ?? 0).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }),
            cellClassRules: {
                'positive-variance': (params) => params.value > 0,
                'negative-variance': (params) => params.value < 0,
            },
        },
    ];

    // New hook: Pivot compareData for charting. This creates a dataset with one row per costCode,
    // and keys for each forecast type (e.g., "Actual Cost", "Original", "Current Forecast")
    const pivotedData = useMemo(() => {
        if (!compareData || compareData.length === 0) return [];
        const result = {};
        compareData.forEach(row => {
            if (row.costCode !== 'Grand Totals') {
                if (!result[row.costCode]) {
                    result[row.costCode] = { costCode: row.costCode };
                }
                // Parse revisedBudget value (assumes string with currency symbols)
                const value = parseFloat(row.revisedBudget ? row.revisedBudget.replace(/[^0-9.-]+/g, '') : 0);
                result[row.costCode][row.type] = value;
            }
        });
        return Object.values(result);
    }, [compareData]);

    // New hook: Define chart options per ag-charts-react quick start guidelines.
    const chartOptions = useMemo(() => ({
        data: pivotedData,
        title: { text: 'Forecast Comparison Chart' },
        subtitle: { text: 'Comparison of Original, Current Forecast, and Actual Cost' },
        series: [
            {
                type: 'column',
                xKey: 'costCode',
                yKey: 'Actual Cost',
                title: 'Actual Cost',
                // Optional: add styling or tooltip customization here
            },
            {
                type: 'column',
                xKey: 'costCode',
                yKey: 'Original',
                title: 'Original',
            },
            {
                type: 'column',
                xKey: 'costCode',
                yKey: 'Current Forecast',
                title: 'Current Forecast',
            },
        ],
        axes: [
            {
                type: 'category',
                position: 'bottom',
                title: { text: 'Cost Code' },
            },
            {
                type: 'number',
                position: 'left',
                title: { text: 'Revised Budget ($)' },
                label: {
                    formatter: params => '$' + params.value.toFixed(2),
                },
            },
        ],
        legend: { position: 'bottom' },
        tooltip: {
            renderer: params => ({
                content: `<b>${params.title}</b><br/>${params.seriesId}: $${params.yValue.toFixed(2)}`,
            }),
        },
    }), [pivotedData]);

    // Existing memoized data for table rendering
    const gcGrTotals = useMemo(() => {
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
            totals[col.field] = rowData
                .filter((row) => row.costCode !== 'Grand Totals')
                .reduce((sum, row) => sum + (Number(row[col.field]) || 0), 0);
        });
        return [totals];
    }, [rowData, dynamicColumns]);

    const tableData = useMemo(() => ({
        'gc-gr': [...rowData, ...gcGrTotals],
        'owner-billing': [...rowData, ...gcGrTotals],
    }), [rowData, gcGrTotals]);

    // Existing functions: generateDateColumns, initializeRowDataWithDateColumns, generateCompareData, etc.
    const generateDateColumns = useCallback((data) => {
        const allRanges = data
            .filter((row) => row.startDate && row.endDate)
            .map((row) => ({
                start: moment(row.startDate).startOf('month'),
                end: moment(row.endDate).endOf('month'),
            }));

        if (allRanges.length === 0) return [];

        const minStart = moment.min(allRanges.map((r) => r.start));
        const maxEnd = moment.max(allRanges.map((r) => r.end));
        const columns = [];
        for (let d = moment(minStart); d.isSameOrBefore(maxEnd, 'month'); d.add(1, 'month')) {
            const monthYear = d.format('MMMMYYYY').toLowerCase();
            columns.push({
                field: monthYear,
                headerName: d.format('MMMM YYYY'),
                width: 120,
                cellRenderer: NumericCellRenderer,
                valueGetter: (params) => Number(params.data[monthYear] ?? 0),
                valueFormatter: (params) =>
                    Number(params.value ?? 0).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }),
            });
        }
        console.log('Generated dynamicColumns:', columns); // Debug log
        return columns;
    }, []);

    const initializeRowDataWithDateColumns = useCallback((data) => {
        console.log('Initializing row data with date columns:', data);
        const dateColumns = generateDateColumns(data);
        const initializedData = data.map((row) => {
            const newRow = { ...row };
            dateColumns.forEach((col) => {
                if (!(col.field in newRow)) {
                    newRow[col.field] = 0;
                }
            });
            return newRow;
        });
        console.log('Initialized data:', initializedData);
        return { initializedData, dateColumns };
    }, [generateDateColumns]);

    const generateCompareData = useCallback((data) => {
        const { initializedData, dateColumns } = initializeRowDataWithDateColumns(data);
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
            totals[col.field] = compareRows
                .filter((row) => row.costCode !== 'Grand Totals')
                .reduce((sum, row) => sum + (Number(row[col.field]) || 0), 0);
        });
        compareRows.push(totals);

        console.log('Final compare rows:', compareRows);

        return { compareRows, dateColumns };
    }, [initializeRowDataWithDateColumns]);

    useEffect(() => {
        const fetchData = async () => {
            if (dataCache.current[activeTab]) {
                const { rowData: cachedRowData, compareData: cachedCompareData, dateColumns: cachedDateColumns } = dataCache.current[activeTab];
                setRowData(cachedRowData);
                setCompareData(cachedCompareData);
                setDynamicColumns(cachedDateColumns);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                console.log('Fetching data for activeTab:', activeTab);
                const forecastData = await window.electronAPI.getForecastingTestData(activeTab);
                console.log('Fetched forecast data for tab', activeTab, ':', forecastData);
                const { initializedData, dateColumns } = initializeRowDataWithDateColumns(forecastData || []);
                const { compareRows } = generateCompareData(forecastData || []);
                setRowData(initializedData);
                setCompareData(compareRows);
                setDynamicColumns(dateColumns);
                dataCache.current[activeTab] = { rowData: initializedData, compareData: compareRows, dateColumns };
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching forecasting test data:', err);
                setError('Failed to load forecasting data. Please try again.');
                setIsLoading(false);
            }
        };
        fetchData();
    }, [activeTab, generateCompareData, initializeRowDataWithDateColumns]);

    const handleUpdateForecast = () => {
        console.log('Updating forecast with tempRowData:', tempRowData);
        const newData = rowData.map(row =>
            row.costCode === editingRow ? { ...row, ...tempRowData[editingRow] } : row
        );
        setRowData(newData);
        setEditingRow(null);
        setTempRowData({});
        setIsDrawerOpen(false);
    };

    const handleCancelEdit = () => {
        console.log('Canceling edit for row:', editingRow);
        setEditingRow(null);
        setTempRowData({});
        setIsDrawerOpen(false);
    };

    const editableColumns = useMemo(() => [...baseColumnsEditable, ...dynamicColumns], [dynamicColumns]);
    const readOnlyColumns = useMemo(() => [...baseColumnsReadOnly, ...dynamicColumns], [dynamicColumns]);

    // Updated renderTabPane function to handle the new "charts" tab.
    const renderTabPane = useCallback((key) => {
        if (key === 'charts') {
            return (
                <TabPane tab="Charts" key="charts">
                    <div style={{ height: '100%', width: '100%', padding: '16px' }}>
                        <AgCharts options={chartOptions} />
                    </div>
                </TabPane>
            );
        }
        const isEditableTab = ['original', 'current-forecast'].includes(key);
        const isCompareTab = key === 'compare';
        const columnsToUse = isEditableTab ? editableColumns : readOnlyColumns;
        const dataToUse = isCompareTab ? compareData : (tableData[activeTab] || []);
        const context = isEditableTab
            ? {
                  editingRow,
                  tempRowData,
                  setTempRowData,
                  dynamicColumns,
                  inputRefs,
              }
            : {
                  dynamicColumns,
              };
        const rowClassRules = isCompareTab
            ? {
                  'group-separator': (params) => {
                      const rowIndex = params.rowIndex;
                      const groupSize = 3;
                      return (rowIndex + 1) % groupSize === 0 && params.data.costCode !== 'Grand Totals';
                  },
                  'grand-total-row': (params) => params.data.costCode === 'Grand Totals',
              }
            : {
                  'grand-total-row': (params) => params.data.costCode === 'Grand Totals',
                  'editing-row': (params) => editingRow === params.data.costCode,
                  'blurred-row': (params) => editingRow && editingRow !== params.data.costCode,
              };

        return (
            <TabPane tab={key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')} key={key}>
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Spin />
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>
                ) : (
                    <div style={{ position: 'relative' }}>
                        <TableModule
                            data={dataToUse}
                            columns={columnsToUse}
                            context={context}
                            rowClassRules={rowClassRules}
                            globalFilter={globalFilter}
                            enableFullscreen={true}
                        />
                        {isEditableTab && (
                            <Drawer
                                placement="bottom"
                                closable={false}
                                onClose={handleCancelEdit}
                                open={isDrawerOpen}
                                height={100}
                                zIndex={900}
                                styles={{
                                    body: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px',
                                    },
                                }}
                                className="editing-footer"
                            >
                                <span>
                                    Editing budget forecast for {editingRow} -{' '}
                                    {rowData.find((r) => r.costCode === editingRow)?.description}
                                </span>
                                <Space>
                                    <Button type="primary" onClick={handleUpdateForecast}>
                                        Update Budget Item Forecast
                                    </Button>
                                    <Button onClick={handleCancelEdit}>Cancel</Button>
                                </Space>
                            </Drawer>
                        )}
                    </div>
                )}
            </TabPane>
        );
    }, [
        isLoading,
        error,
        activeTab,
        tableData,
        editableColumns,
        readOnlyColumns,
        editingRow,
        tempRowData,
        dynamicColumns,
        isDrawerOpen,
        globalFilter,
        compareData,
        chartOptions,
    ]);

    return (
        <div
            className="forecasting-container"
            style={{ margin: 0, display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}
        >
            <ComponentHeader
                title={headerContent.title}
                tabs={headerContent.tabs}
                activeTab={activeTab}
                onTabChange={onTabChange}
                actions={headerContent.actions}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <Input
                    placeholder="Search"
                    prefix={<SearchOutlined />}
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    style={{ width: '200px' }}
                    aria-label="Search forecast records"
                />
            </div>
            <Tabs activeKey={viewTab} onChange={(key) => setViewTab(key)} style={{ flex: 1 }}>
                {renderTabPane('original')}
                {renderTabPane('current-forecast')}
                {renderTabPane('actual-cost')}
                {renderTabPane('compare')}
                {renderTabPane('charts')}
            </Tabs>
        </div>
    );
};

export default Forecasting;