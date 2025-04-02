// src/renderer/components/Schedule.js
// Schedule component for HB Report, displaying a milestone schedule table and an enhanced dumbbell chart
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://ant.design/components/layout#api
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/ipc-renderer
// *Additional Reference*: https://ant.design/components/tooltip#api
// *Additional Reference*: https://www.chartjs.org/docs/latest/
// *Additional Reference*: https://react-chartjs-2.js.org/

import React, { useState, useEffect, useRef } from 'react';
import { Spin, message, Tooltip, DatePicker, Button, Space, Switch, Slider, Dropdown, Menu } from 'antd';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ScatterController,
  PointElement,
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip as ChartJSTooltip,
  Legend,
  Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ZoomPlugin from 'chartjs-plugin-zoom';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import html2canvas from 'html2canvas';
import { DownloadOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import ComponentHeader from './ComponentHeader.js';
import TableModule from './TableModule.js';
import '../styles/global.css';
import '../styles/Components.css';

ChartJS.register(
  ScatterController,
  PointElement,
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  ChartJSTooltip,
  Legend,
  Filler,
  ChartDataLabels,
  ZoomPlugin,
  AnnotationPlugin
);

const { RangePicker } = DatePicker;

const Schedule = ({ selectedProject, headerContent }) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [varianceThreshold, setVarianceThreshold] = useState(30);
  const [hiddenDatasets, setHiddenDatasets] = useState([]);
  const [chartHeight, setChartHeight] = useState(40); // Percentage of container height
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const splitterRef = useRef(null);

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

  const parseDate = (dateString) => {
    const cleanDate = dateString.replace(' (A)', '');
    const [month, day, year] = cleanDate.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
      console.error(`Invalid date parsed from: ${dateString}`);
      return null;
    }
    return date;
  };

  const calculateDaysDifference = (date1, date2) => {
    if (!date1 || !date2) return 0;
    const diffTime = date2 - date1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    if (!dateRange[0] || !dateRange[1]) {
      setFilteredData(scheduleData);
      return;
    }

    const startDate = dateRange[0].toDate();
    const endDate = dateRange[1].toDate();

    const filtered = scheduleData.filter(item => {
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

  const getDateRange = () => {
    const allDates = filteredData.flatMap(item => [
      parseDate(item.revContractDate),
      parseDate(item.substantialCompletionLastMonth),
      parseDate(item.substantialCompletionThisMonth),
    ]).filter(date => date !== null);

    if (allDates.length === 0) {
      return {
        min: new Date('2023-01-01').getTime(),
        max: new Date('2025-12-31').getTime(),
      };
    }

    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));

    minDate.setMonth(minDate.getMonth() - 1);
    maxDate.setMonth(maxDate.getMonth() + 1);

    return {
      min: minDate.getTime(),
      max: maxDate.getTime(),
    };
  };

  const milestones = filteredData.map(item => item.milestone);
  const revContractDates = filteredData.map(item => parseDate(item.revContractDate)).filter(date => date !== null);
  const completionLastMonth = filteredData.map(item => parseDate(item.substantialCompletionLastMonth)).filter(date => date !== null);
  const completionThisMonth = filteredData.map(item => parseDate(item.substantialCompletionThisMonth)).filter(date => date !== null);

  const scatterDatasets = [
    {
      label: 'Rev Contract Date',
      data: revContractDates.map((date, index) => ({
        x: milestones[index],
        y: date,
        varianceToThisMonth: calculateDaysDifference(date, completionThisMonth[index]),
      })),
      backgroundColor: '#003087',
      pointRadius: 6,
      pointHoverRadius: 8,
      pointStyle: 'circle',
      hidden: hiddenDatasets.includes('Rev Contract Date'),
    },
    {
      label: 'Completion Last Month',
      data: completionLastMonth.map((date, index) => ({
        x: milestones[index],
        y: date,
        varianceToThisMonth: calculateDaysDifference(date, completionThisMonth[index]),
      })),
      backgroundColor: '#8c8c8c',
      pointRadius: 6,
      pointHoverRadius: 8,
      pointStyle: 'triangle',
      hidden: hiddenDatasets.includes('Completion Last Month'),
    },
    {
      label: 'Completion This Month',
      data: completionThisMonth.map((date, index) => ({
        x: milestones[index],
        y: date,
        varianceToRevContract: calculateDaysDifference(revContractDates[index], date),
      })),
      backgroundColor: '#ff4d4f',
      pointRadius: 6,
      pointHoverRadius: 8,
      pointStyle: 'rect',
      hidden: hiddenDatasets.includes('Completion This Month'),
    },
  ];

  const lineDatasets = [];
  for (let i = 0; i < milestones.length; i++) {
    if (!revContractDates[i] || !completionLastMonth[i] || !completionThisMonth[i]) continue;
    lineDatasets.push({
      label: `Line Rev to Last ${i}`,
      data: [
        { x: milestones[i], y: revContractDates[i] },
        { x: milestones[i], y: completionLastMonth[i] },
      ],
      borderColor: '#d3d3d3',
      borderWidth: 2,
      showLine: true,
      pointRadius: 0,
      type: 'line',
      showInLegend: false,
      hidden: hiddenDatasets.includes('Rev Contract Date') || hiddenDatasets.includes('Completion Last Month'),
    });
    lineDatasets.push({
      label: `Line Last to This ${i}`,
      data: [
        { x: milestones[i], y: completionLastMonth[i] },
        { x: milestones[i], y: completionThisMonth[i] },
      ],
      borderColor: '#d3d3d3',
      borderWidth: 2,
      showLine: true,
      pointRadius: 0,
      type: 'line',
      showInLegend: false,
      hidden: hiddenDatasets.includes('Completion Last Month') || hiddenDatasets.includes('Completion This Month'),
    });
  }

  const chartData = {
    datasets: [...scatterDatasets, ...lineDatasets],
  };

  const annotations = showAnnotations
    ? scatterDatasets[2].data
        .map((point, index) => {
          const variance = point.varianceToRevContract;
          if (Math.abs(variance) >= varianceThreshold) {
            return {
              type: 'label',
              x: point.x,
              y: point.y,
              content: `${variance > 0 ? '+' : ''}${variance}d`,
              backgroundColor: variance > 0 ? 'rgba(255, 77, 79, 0.8)' : 'rgba(0, 48, 135, 0.8)',
              color: '#fff',
              font: { size: 10, family: 'var(--font-family)' },
              borderRadius: 3,
              padding: 4,
              position: 'top',
              adjustScaleRange: true,
            };
          }
          return null;
        })
        .filter(annotation => annotation !== null)
    : [];

  const { min: minDate, max: maxDate } = getDateRange();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          font: { family: 'var(--font-family)', size: 12 },
          color: '#333',
          filter: (legendItem) => !legendItem.text.includes('Line'),
          usePointStyle: true,
          padding: 20,
          boxWidth: 10,
          boxHeight: 10,
        },
        onClick: (e, legendItem, legend) => {
          const label = legendItem.text;
          setHiddenDatasets(prev => {
            if (prev.includes(label)) {
              return prev.filter(item => item !== label);
            } else {
              return [...prev, label];
            }
          });
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const date = new Date(context.raw.y);
            const variance = context.raw.varianceToRevContract || context.raw.varianceToThisMonth || 0;
            return [
              `${label}: ${date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`,
              label === 'Completion This Month'
                ? `Variance to Rev Contract: ${variance > 0 ? '+' : ''}${variance} days`
                : `Variance to This Month: ${variance > 0 ? '+' : ''}${variance} days`,
            ];
          },
          title: (tooltipItems) => tooltipItems[0].raw.x,
        },
        backgroundColor: '#fff',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        cornerRadius: 4,
        padding: 8,
        bodySpacing: 4,
        titleFont: { family: 'var(--font-family)', size: 12, weight: 'bold' },
        bodyFont: { family: 'var(--font-family)', size: 12 },
      },
      datalabels: { display: false },
      zoom: {
        zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy' },
        pan: { enabled: true, mode: 'xy' },
      },
      annotation: { annotations },
    },
    scales: {
      x: {
        type: 'category',
        labels: milestones,
        title: {
          display: true,
          text: 'Milestone',
          font: { family: 'var(--font-family)', size: 14 },
          color: '#333',
          padding: 10,
        },
        ticks: {
          font: { family: 'var(--font-family)', size: 12 },
          color: '#333',
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false,
          callback: (value) => {
            const label = milestones[value];
            return label.length > 10 ? `${label.substring(0, 10)}...` : label;
          },
        },
        grid: { display: false },
      },
      y: {
        type: 'time',
        time: { unit: 'month', displayFormats: { month: 'MMM-yy' } },
        title: {
          display: true,
          text: 'Date',
          font: { family: 'var(--font-family)', size: 14 },
          color: '#333',
          padding: 10,
        },
        ticks: {
          font: { family: 'var(--font-family)', size: 12 },
          color: '#333',
        },
        grid: { color: '#e8e8e8' },
        min: minDate,
        max: maxDate,
      },
    },
    layout: {
      padding: { top: 10, bottom: 10, left: 10, right: 10 },
    },
    elements: {
      point: { borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.8)' },
      line: { tension: 0 },
    },
  };

  const exportChart = (format) => {
    const chartElement = chartRef.current;
    if (!chartElement) return;

    html2canvas(chartElement, { backgroundColor: '#fff', scale: 2 }).then(canvas => {
      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `schedule-chart-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else if (format === 'pdf') {
        message.info('PDF export is not implemented yet. Please use PNG for now.');
      }
    });
  };

  const exportMenu = (
    <Menu onClick={({ key }) => exportChart(key)}>
      <Menu.Item key="png">Export as PNG</Menu.Item>
      <Menu.Item key="pdf">Export as PDF</Menu.Item>
    </Menu>
  );

  const resetZoom = () => {
    if (chartRef.current && chartRef.current.chartInstance) {
      chartRef.current.chartInstance.resetZoom();
    }
  };

  const columns = [
    {
      field: 'milestone',
      headerName: 'Milestone',
      width: 120,
      minWidth: 100,
      pinned: 'left',
      cellStyle: { fontWeight: 'bold' },
    },
    {
      field: 'blContractDate',
      headerName: 'BL Contract Date',
      width: 120,
      minWidth: 100,
      tooltipValueGetter: () => 'Baseline milestone completion date based on original contract schedule',
    },
    {
      field: 'approvedTimeExtensions',
      headerName: 'Approved Time Extension(s)',
      width: 150,
      minWidth: 120,
      tooltipValueGetter: () => 'Extensions to contract schedule per milestone approved by the Owner in calendar days',
    },
    {
      field: 'revContractDate',
      headerName: 'Rev Contract Date',
      width: 120,
      minWidth: 100,
      tooltipValueGetter: () => 'BL Contract Date + Approved Time Extension(s)',
    },
    {
      field: 'substantialCompletionLastMonth',
      headerName: 'Substantial Completion Last Month',
      width: 180,
      minWidth: 150,
      tooltipValueGetter: () => 'Date of forecasted completion in the previous reporting period based on construction progress - (A) represents actual completion date',
    },
    {
      field: 'substantialCompletionThisMonth',
      headerName: 'Substantial Completion This Month',
      width: 180,
      minWidth: 150,
      tooltipValueGetter: () => 'Current date of forecasted completion based on construction progress - (A) represents actual completion date',
    },
    {
      field: 'momChange',
      headerName: 'MOM Change',
      width: 100,
      minWidth: 80,
      cellStyle: params => ({
        color: params.value > 0 ? 'green' : params.value < 0 ? 'red' : 'black',
      }),
      tooltipValueGetter: () => 'Substantial Completion Last Month - Substantial Completion This Month in calendar days',
    },
    {
      field: 'varianceToContract',
      headerName: 'Variance to Contract',
      width: 120,
      minWidth: 100,
      cellStyle: params => ({
        color: params.value > 0 ? 'green' : params.value < 0 ? 'red' : 'black',
      }),
      tooltipValueGetter: () => 'Rev Contract Date - Substantial Completion This Month in calendar days',
    },
    {
      field: 'pendingExtensionReq',
      headerName: 'Pending Extension Req.',
      width: 130,
      minWidth: 110,
      tooltipValueGetter: () => 'Extensions to Rev Contract Date pending Owner approval in calendar days',
    },
    {
      field: 'extensionsRequested',
      headerName: 'Extensions Requested',
      width: 130,
      minWidth: 110,
      tooltipValueGetter: () => 'Approved Time Extension(s) + Pending Extension Req. in calendar days',
    },
    {
      field: 'adverseWeatherDays',
      headerName: 'Adverse Weather Days',
      width: 130,
      minWidth: 110,
      tooltipValueGetter: () => 'Number of days where work related to critical path activities impacting the specified milestone could not occur due to unsafe weather conditions',
    },
  ];

  const rowClassRules = {
    'actual-completion-row': params => params.data.substantialCompletionThisMonth.includes('(A)'),
  };

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
      setChartHeight(Math.max(20, Math.min(80, newHeight))); // Limit between 20% and 80%
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

  return (
    <div className="schedule-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ComponentHeader title={headerContent.title} actions={headerContent.actions} />
      <div ref={containerRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="schedule-chart-section" style={{ height: `${chartHeight}%`, padding: '16px', overflow: 'auto' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: '16px', textAlign: 'center' }}>
            Schedule Update: Month Over Month vs. Contract
          </h3>
          <div className="chart-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
            <Space>
              <label style={{ fontSize: '14px', color: '#333', marginRight: '8px' }}>Filter by Date Range:</label>
              <RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates || [null, null])}
                format="MM/DD/YYYY"
                style={{ width: '300px' }}
                placeholder={['Start Date', 'End Date']}
                className="schedule-date-picker"
              />
            </Space>
            <Space>
              <Space>
                <label style={{ fontSize: '14px', color: '#333' }}>Show Annotations:</label>
                <Switch checked={showAnnotations} onChange={setShowAnnotations} size="small" />
              </Space>
              <Space>
                <label style={{ fontSize: '14px', color: '#333' }}>Variance Threshold (days):</label>
                <Slider min={0} max={100} value={varianceThreshold} onChange={setVarianceThreshold} style={{ width: '150px' }} />
              </Space>
              <Tooltip title="Use mouse wheel to zoom, drag to pan">
                <Button icon={<ZoomOutOutlined />} onClick={resetZoom} aria-label="Reset Zoom" className="schedule-control-button">
                  Reset Zoom
                </Button>
              </Tooltip>
              <Dropdown overlay={exportMenu} trigger={['click']}>
                <Button icon={<DownloadOutlined />} aria-label="Export Chart" className="schedule-control-button">
                  Export Chart
                </Button>
              </Dropdown>
            </Space>
          </div>
          <div ref={chartRef} style={{ position: 'relative', width: '100%', height: 'calc(100% - 80px)' }}>
            {milestones.length > 0 ? (
              <Scatter
                data={chartData}
                options={options}
                style={{ width: '100%', height: '100%' }}
                role="img"
                aria-label="Dumbbell chart showing schedule updates: Rev Contract Date, Completion Last Month, and Completion This Month for each milestone"
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                No data available for the selected date range.
              </div>
            )}
          </div>
        </div>
        <div ref={splitterRef} className="splitter" style={{ height: '4px', background: '#e8e8e8', cursor: 'row-resize' }} />
        <div className="schedule-table-section" style={{ height: `${100 - chartHeight}%`, padding: '16px', overflow: 'hidden' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: '16px' }}>
            Schedule Details
          </h3>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin />
            </div>
          ) : (
            <TableModule
              data={filteredData}
              columns={columns}
              enableSorting={true}
              enableFiltering={true}
              enablePagination={false}
              pageSize={10}
              className="schedule-table"
              globalFilter={globalFilter}
              loading={isLoading}
              enableFullscreen={true}
              rowClassRules={rowClassRules}
              enableFontSizeAdjustment={true}
              style={{ height: 'calc(100% - 40px)', width: '100%' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;