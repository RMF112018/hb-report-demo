// src/renderer/components/ScheduleV2.js
// Enhanced Schedule component for HB Report using AG Grid and AG Charts for table and dumbbell chart visualization
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://www.ag-grid.com/react-data-grid/
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/integrated-charts/
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/ipc-renderer
// *Additional Reference*: https://ant.design/components/tooltip#api

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Spin, message, Tooltip, DatePicker, Switch, Slider } from 'antd';
import TableModuleV2 from './TableModuleV2.js';
import ComponentHeader from './ComponentHeader.js';
import moment from 'moment';
import '../styles/global.css';
import '../styles/TableModule.css';
import '../styles/Components.css';

const { RangePicker } = DatePicker;

const ScheduleV2 = ({ selectedProject, headerContent }) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [varianceThreshold, setVarianceThreshold] = useState(30);
  const gridRef = useRef(null);
  const containerRef = useRef(null);
  const splitterRef = useRef(null);
  const [chartHeight, setChartHeight] = useState(40); // Percentage of container height

  // Fetch data via IPC
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await window.electronAPI.getScheduleTestData();
        console.log('Fetched scheduleData:', data);
        setScheduleData(data);
        setFilteredData(data);
      } catch (error) {
        message.error('Failed to load schedule data.');
        console.error('Error fetching schedule data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Parse date strings into Date objects
  const parseDate = (dateString) => {
    const cleanDate = dateString.replace(' (A)', '');
    const [month, day, year] = cleanDate.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  };

  // Calculate days difference between two dates
  const calculateDaysDifference = (date1, date2) => {
    if (!date1 || !date2) return 0;
    const diffTime = date2 - date1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter data based on date range
  useEffect(() => {
    if (!dateRange[0] || !dateRange[1]) {
      setFilteredData(scheduleData);
      return;
    }
    const startDate = dateRange[0].toDate();
    const endDate = dateRange[1].toDate();

    const filtered = scheduleData.filter((item) => {
      const revContractDate = parseDate(item.revContractDate);
      const completionLastMonth = parseDate(item.substantialCompletionLastMonth);
      const completionThisMonth = parseDate(item.substantialCompletionThisMonth);
      if (!revContractDate || !completionLastMonth || !completionThisMonth) return false;
      return (
        (revContractDate >= startDate && revContractDate <= endDate) ||
        (completionLastMonth >= startDate && completionLastMonth <= endDate) ||
        (completionThisMonth >= startDate && completionThisMonth <= endDate)
      );
    });
    setFilteredData(filtered);
  }, [dateRange, scheduleData]);

  // Define AG Grid columns
  const columns = useMemo(
    () => [
      {
        field: 'milestone',
        headerName: 'Milestone',
        width: 120,
        pinned: 'left',
        cellStyle: { fontWeight: 'bold' },
      },
      {
        field: 'blContractDate',
        headerName: 'BL Contract Date',
        width: 120,
        tooltipValueGetter: () =>
          'Baseline milestone completion date based on original contract schedule',
      },
      {
        field: 'approvedTimeExtensions',
        headerName: 'Approved Time Extension(s)',
        width: 150,
        tooltipValueGetter: () =>
          'Extensions to contract schedule per milestone approved by the Owner in calendar days',
      },
      {
        field: 'revContractDate',
        headerName: 'Rev Contract Date',
        width: 120,
        tooltipValueGetter: () => 'BL Contract Date + Approved Time Extension(s)',
      },
      {
        field: 'substantialCompletionLastMonth',
        headerName: 'Substantial Completion Last Month',
        width: 180,
        tooltipValueGetter: () =>
          'Date of forecasted completion in the previous reporting period based on construction progress - (A) represents actual completion date',
      },
      {
        field: 'substantialCompletionThisMonth',
        headerName: 'Substantial Completion This Month',
        width: 180,
        tooltipValueGetter: () =>
          'Current date of forecasted completion based on construction progress - (A) represents actual completion date',
      },
      {
        field: 'momChange',
        headerName: 'MOM Change',
        width: 100,
        cellStyle: (params) => ({
          color: params.value > 0 ? 'green' : params.value < 0 ? 'red' : 'black',
        }),
        tooltipValueGetter: () =>
          'Substantial Completion Last Month - Substantial Completion This Month in calendar days',
      },
      {
        field: 'varianceToContract',
        headerName: 'Variance to Contract',
        width: 120,
        cellStyle: (params) => ({
          color: params.value > 0 ? 'green' : params.value < 0 ? 'red' : 'black',
        }),
        tooltipValueGetter: () =>
          'Rev Contract Date - Substantial Completion This Month in calendar days',
      },
      {
        field: 'pendingExtensionReq',
        headerName: 'Pending Extension Req.',
        width: 130,
        tooltipValueGetter: () =>
          'Extensions to Rev Contract Date pending Owner approval in calendar days',
      },
      {
        field: 'extensionsRequested',
        headerName: 'Extensions Requested',
        width: 130,
        tooltipValueGetter: () =>
          'Approved Time Extension(s) + Pending Extension Req. in calendar days',
      },
      {
        field: 'adverseWeatherDays',
        headerName: 'Adverse Weather Days',
        width: 130,
        tooltipValueGetter: () =>
          'Number of days where work related to critical path activities impacting the specified milestone could not occur due to unsafe weather conditions',
      },
    ],
    []
  );

  const rowClassRules = useMemo(
    () => ({
      'actual-completion-row': (params) =>
        params.data?.substantialCompletionThisMonth?.includes('(A)'),
    }),
    []
  );

  // Create AG Chart on grid ready
  const onGridReady = useCallback((params) => {
    gridRef.current = { api: params.api, columnApi: params.columnApi };
    const chartRangeParams = {
      cellRange: {
        columns: [
          'milestone',
          'revContractDate',
          'substantialCompletionLastMonth',
          'substantialCompletionThisMonth',
        ],
      },
      chartType: 'scatter',
      chartContainer: document.querySelector('.schedule-chart-container'),
      suppressChartRanges: true,
      processChartOptions: (chartOptions) => {
        const milestones = filteredData.map((item) => item.milestone);
        const revContractDates = filteredData.map((item) => parseDate(item.revContractDate));
        const completionLastMonth = filteredData.map((item) =>
          parseDate(item.substantialCompletionLastMonth)
        );
        const completionThisMonth = filteredData.map((item) =>
          parseDate(item.substantialCompletionThisMonth)
        );

        const minDate = new Date(Math.min(...revContractDates, ...completionLastMonth, ...completionThisMonth));
        const maxDate = new Date(Math.max(...revContractDates, ...completionLastMonth, ...completionThisMonth));
        minDate.setMonth(minDate.getMonth() - 1);
        maxDate.setMonth(maxDate.getMonth() + 1);

        chartOptions.series = [
          {
            type: 'scatter',
            xKey: 'milestone',
            yKey: 'revContractDate',
            label: 'Rev Contract Date',
            marker: { shape: 'circle', size: 6, fill: '#003087' },
          },
          {
            type: 'scatter',
            xKey: 'milestone',
            yKey: 'substantialCompletionLastMonth',
            label: 'Completion Last Month',
            marker: { shape: 'triangle', size: 6, fill: '#8c8c8c' },
          },
          {
            type: 'scatter',
            xKey: 'milestone',
            yKey: 'substantialCompletionThisMonth',
            label: 'Completion This Month',
            marker: { shape: 'square', size: 6, fill: '#ff4d4f' },
          },
        ];

        // Add dumbbell lines
        filteredData.forEach((item, index) => {
          chartOptions.series.push(
            {
              type: 'line',
              xKey: 'milestone',
              yKey: 'revContractDate',
              yKey2: 'substantialCompletionLastMonth',
              stroke: '#d3d3d3',
              strokeWidth: 2,
              marker: { enabled: false },
              showInLegend: false,
              data: [item],
            },
            {
              type: 'line',
              xKey: 'milestone',
              yKey: 'substantialCompletionLastMonth',
              yKey2: 'substantialCompletionThisMonth',
              stroke: '#d3d3d3',
              strokeWidth: 2,
              marker: { enabled: false },
              showInLegend: false,
              data: [item],
            }
          );
        });

        chartOptions.axes = [
          {
            type: 'category',
            position: 'bottom',
            keys: ['milestone'],
            label: {
              rotation: 45,
              formatter: (params) =>
                params.value.length > 10 ? `${params.value.substring(0, 10)}...` : params.value,
            },
            title: { text: 'Milestone' },
          },
          {
            type: 'time',
            position: 'left',
            nice: true,
            min: minDate,
            max: maxDate,
            label: { format: '%b-%y' },
            title: { text: 'Date' },
          },
        ];

        chartOptions.legend = { position: 'bottom' };
        chartOptions.title = { text: 'Schedule Update: Month Over Month vs. Contract' };
        chartOptions.background = { fill: '#fff' };

        // Annotations for variance
        if (showAnnotations) {
          chartOptions.calloutLabel = {
            enabled: true,
            formatter: (params) => {
              if (params.yKey === 'substantialCompletionThisMonth') {
                const revDate = parseDate(params.datum.revContractDate);
                const thisDate = parseDate(params.datum.substantialCompletionThisMonth);
                const variance = calculateDaysDifference(revDate, thisDate);
                if (Math.abs(variance) >= varianceThreshold) {
                  return `${variance > 0 ? '+' : ''}${variance}d`;
                }
              }
              return null;
            },
            color: '#fff',
            background: { fill: (params) => (params.value > 0 ? '#ff4d4f' : '#003087') },
            padding: 4,
          };
        }

        return chartOptions;
      },
    };
    params.api.createRangeChart(chartRangeParams);
  }, [filteredData, showAnnotations, varianceThreshold]);

  // Handle splitter drag
  useEffect(() => {
    const splitter = splitterRef.current;
    const container = containerRef.current;

    let isDragging = false;
    let startY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      startY = e.clientY;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const containerRect = container.getBoundingClientRect();
      const newY = e.clientY - containerRect.top;
      const newHeight = (newY / containerRect.height) * 100;
      setChartHeight(Math.max(20, Math.min(80, newHeight)));
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    splitter.addEventListener('mousedown', onMouseDown);
    return () => {
      splitter.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Header actions
  const headerActions = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Tooltip title="Filter by Date Range">
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates || [null, null])}
          format="MM/DD/YYYY"
          style={{ width: '300px' }}
          placeholder={['Start Date', 'End Date']}
        />
      </Tooltip>
      <Tooltip title="Show Variance Annotations">
        <Switch checked={showAnnotations} onChange={setShowAnnotations} size="small" />
      </Tooltip>
      <Tooltip title="Variance Threshold (days)">
        <Slider
          min={0}
          max={100}
          value={varianceThreshold}
          onChange={setVarianceThreshold}
          style={{ width: '150px' }}
        />
      </Tooltip>
    </div>
  );

  return (
    <div className="schedule-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ComponentHeader title={headerContent.title} actions={headerActions} />
      <div
        ref={containerRef}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <div
          className="schedule-chart-section"
          style={{ height: `${chartHeight}%`, padding: '16px', overflow: 'auto' }}
        >
          <div className="schedule-chart-container" style={{ height: '100%', width: '100%' }} />
        </div>
        <div
          ref={splitterRef}
          className="splitter"
          style={{ height: '4px', background: '#e8e8e8', cursor: 'row-resize' }}
        />
        <div
          className="schedule-table-section"
          style={{ height: `${100 - chartHeight}%`, padding: '16px', overflow: 'hidden' }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin />
            </div>
          ) : (
            <TableModuleV2
              data={filteredData}
              columns={columns}
              enableFiltering={true}
              enableSearch={true}
              autoSizeOnLoad={true}
              agGridProps={{
                onGridReady,
                rowClassRules,
                enableCharts: true,
                enableRangeSelection: true,
                popupParent: document.body,
                getContextMenuItems: (params) => [
                  'copy',
                  'paste',
                  'separator',
                  'chartRange',
                  'export',
                ],
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

ScheduleV2.propTypes = {
  selectedProject: PropTypes.shape({
    projectNumber: PropTypes.string,
    name: PropTypes.string,
  }),
  headerContent: PropTypes.shape({
    title: PropTypes.node.isRequired,
    actions: PropTypes.node,
  }).isRequired,
};

ScheduleV2.defaultProps = {
  selectedProject: null,
};

export default ScheduleV2;