// src/renderer/components/ProjectDashboardV2.js
// Enhanced Project Dashboard V2 component for HB Report with corrected AG Charts configurations
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://charts.ag-grid.com/javascript-charts-overview/
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://www.ag-grid.com/charts/react/gauge-charts/
// *Additional Reference*: https://github.com/react-grid-layout/react-grid-layout
// *Additional Reference*: https://www.ag-grid.com/charts/react/treemap-series/
// *Additional Reference*: https://www.ag-grid.com/charts/react/area-series/
// *Additional Reference*: https://www.ag-grid.com/charts/react/line-series/

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Space, message, Spin, Button } from 'antd';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { AgCharts } from 'ag-charts-react';
import { AgChartsEnterpriseModule } from 'ag-charts-enterprise';
import { AllEnterpriseModule,} from 'ag-grid-enterprise';
import { ModuleRegistry } from 'ag-grid-community';
import 'chartjs-adapter-moment';
import { BarChartOutlined, CalendarOutlined, DollarOutlined, TeamOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import ComponentHeader from './ComponentHeader.js';
import '../styles/global.css';

ModuleRegistry.registerModules([
  AllEnterpriseModule.with(AgChartsEnterpriseModule),
]);

// Utility function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

// Utility function to parse dates and calculate days since a reference point
const parseDateToDays = (dateStr, referenceDate = new Date('2023-01-01')) => {
  const date = new Date(dateStr);
  const timeDiff = date - referenceDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
};

// Initial panel configuration
const initialPanels = [
  { i: 'project-health', x: 0, y: 0, w: 3, h: 2, minW: 2, maxW: 4, minH: 2, maxH: 4, title: 'Health Metrics', icon: <BarChartOutlined /> },
  { i: 'schedule-summary', x: 3, y: 0, w: 5, h: 2, minW: 3, maxW: 6, minH: 2, maxH: 4, title: 'Schedule Summary', icon: <CalendarOutlined /> },
  { i: 'budget-conditions', x: 0, y: 2, w: 4, h: 2, minW: 3, maxW: 6, minH: 2, maxH: 4, title: 'Budget Conditions', icon: <DollarOutlined /> },
  { i: 'manpower-recap', x: 4, y: 2, w: 4, h: 2, minW: 3, maxW: 6, minH: 2, maxH: 4, title: 'Workers per Day by Contractor', icon: <TeamOutlined /> },
  { i: 'permits-status', x: 0, y: 4, w: 12, h: 2, minW: 8, maxW: 12, minH: 2, maxH: 4, title: 'Permit Status Distribution', icon: <FileTextOutlined /> },
];

// Load panel layout from localStorage
const loadPanelLayout = () => {
  const savedLayout = localStorage.getItem('dashboardPanelLayout');
  if (savedLayout) {
    const layout = JSON.parse(savedLayout);
    return initialPanels.map((defaultPanel) => ({
      ...defaultPanel,
      ...layout.find((p) => p.i === defaultPanel.i),
    }));
  }
  return initialPanels;
};

const ProjectDashboardV2 = ({ selectedProject, headerContent }) => {
  const [dashboardData, setDashboardData] = useState({
    buyoutData: [],
    manpowerData: [],
    scheduleData: [],
    permitData: [],
    healthData: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useState(loadPanelLayout());

  const fetchData = async () => {
    if (!selectedProject) {
      setDashboardData({ buyoutData: [], manpowerData: [], scheduleData: [], permitData: [], healthData: [] });
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const buyoutData = await window.electronAPI.getBuyoutTestData(selectedProject.projectNumber);
      const manpowerData = await window.electronAPI.getManpowerTestData(selectedProject.projectNumber);
      const scheduleData = await window.electronAPI.getScheduleTestData(selectedProject.projectNumber);
      const permitData = await window.electronAPI.getPermitTestData(selectedProject.projectNumber);
      const healthData = await window.electronAPI.getHealthTestData();

      const parsedManpowerData = manpowerData.map(item => ({
        ...item,
        date: new Date(item.date),
      }));

      console.log('Fetched dashboard data:', { buyoutData, manpowerData: parsedManpowerData, scheduleData, permitData, healthData });

      setDashboardData({ buyoutData, manpowerData: parsedManpowerData, scheduleData, permitData, healthData });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      setDashboardData({ buyoutData: [], manpowerData: [], scheduleData: [], permitData: [], healthData: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedProject]);

  // Define linear gauge options for project_health, financial_health, and schedule_health
  const healthMetrics = ['project_health', 'financial_health', 'schedule_health'];
  const gaugeOptions = healthMetrics.map(metric => ({
    type: 'linear-gauge',
    value: dashboardData.healthData[0]?.[metric] || 0,
    min: 0,
    max: 100,
    segments: [
      { min: 0, max: 50, color: '#f5222d' },  // Red for 0-50
      { min: 50, max: 75, color: '#faad14' }, // Yellow for 50-75
      { min: 75, max: 100, color: '#52c41a' }, // Green for 75-100
    ],
    label: {
      text: metric.replace('_', ' ').toUpperCase(), // e.g., "PROJECT HEALTH"
      fontSize: 12,
      color: '#333',
    },
    valueLabel: {
      text: `${(dashboardData.healthData[0]?.[metric] || 0).toFixed(1)}%`,
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
    },
    height: 50,  // Adjusted height to fit three gauges in the panel
    width: '100%',
  }));

  // Line Chart for Schedule Summary
  const scheduleSummaryOptions = {
    data: dashboardData.scheduleData.map((item) => ({
      milestone: item.milestone,
      lastMonthDays: parseDateToDays(item.substantialCompletionLastMonth),
      thisMonthDays: parseDateToDays(item.substantialCompletionThisMonth),
    })),
    series: [
      {
        type: 'line',
        xKey: 'milestone',
        yKey: 'lastMonthDays',
        yName: 'Completion Last Month',
        stroke: '#4682b4',
        strokeWidth: 2,
        marker: { size: 8, fill: '#4682b4', stroke: '#2f4f4f', strokeWidth: 1 },
        lineDash: [4, 2],
        tooltip: {
          enabled: true,
          renderer: ({ datum }) => ({
            title: datum.milestone,
            content: `Days: ${datum.lastMonthDays}`,
          }),
        },
      },
      {
        type: 'line',
        xKey: 'milestone',
        yKey: 'thisMonthDays',
        yName: 'Completion This Month',
        stroke: '#2e8b57',
        strokeWidth: 2,
        marker: { size: 8, fill: '#2e8b57', stroke: '#2f4f4f', strokeWidth: 1 },
        tooltip: {
          enabled: true,
          renderer: ({ datum }) => ({
            title: datum.milestone,
            content: `Days: ${datum.thisMonthDays}`,
          }),
        },
      },
    ],
    height: 200,
    axes: [
      {
        type: 'category',
        position: 'bottom',
        label: { rotation: -45, fontSize: 12, fontFamily: 'Roboto, sans-serif', color: '#333' },
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Days Since Jan 2023', fontSize: 12 },
        label: { fontSize: 12, fontFamily: 'Roboto, sans-serif', color: '#333' },
        gridLine: { style: [{ stroke: '#e8e8e8', lineDash: [2, 4] }] },
      },
    ],
    background: { fill: '#ffffff' },
    legend: { position: 'top', item: { label: { fontSize: 12, fontFamily: 'Roboto, sans-serif', color: '#333' } } },
    animation: { enabled: true, duration: 1000 },
  };

  // Bar Chart for Budget Conditions
  const budgetConditionsOptions = {
    data: dashboardData.buyoutData.map((item) => ({
      category: item.title || item.description || 'Unknown',
      total: parseFloat(item.totalContractAmount?.replace(/[$,]/g, '') || 0),
      spent: parseFloat(item.invoicesAmount?.replace(/[$,]/g, '') || 0),
      remaining: parseFloat(item.totalRemaining?.replace(/[$,]/g, '') || 0),
    })),
    series: [
      {
        type: 'bar',
        xKey: 'category',
        yKey: 'total',
        yName: 'Total',
        fill: '#4682b4',
        tooltip: {
          enabled: true,
          renderer: ({ datum }) => ({
            title: datum.category,
            content: `Total: ${formatCurrency(datum.total)}`,
          }),
        },
      },
      {
        type: 'bar',
        xKey: 'category',
        yKey: 'spent',
        yName: 'Spent',
        fill: '#2e8b57',
        tooltip: {
          enabled: true,
          renderer: ({ datum }) => ({
            title: datum.category,
            content: `Spent: ${formatCurrency(datum.spent)}`,
          }),
        },
      },
      {
        type: 'bar',
        xKey: 'category',
        yKey: 'remaining',
        yName: 'Remaining',
        fill: '#faad14',
        tooltip: {
          enabled: true,
          renderer: ({ datum }) => ({
            title: datum.category,
            content: `Remaining: ${formatCurrency(datum.remaining)}`,
          }),
        },
      },
    ],
    height: 200,
    axes: [
      { type: 'category', position: 'bottom', label: { fontSize: 12, fontFamily: 'Roboto, sans-serif', color: '#333' } },
      { type: 'number', position: 'left', label: { fontSize: 12, fontFamily: 'Roboto, sans-serif', color: '#333' } },
    ],
    background: { fill: '#ffffff' },
    legend: { position: 'top', item: { label: { fontSize: 12, fontFamily: 'Roboto, sans-serif', color: '#333' } } },
    animation: { enabled: true, duration: 1000 },
  };

  // Area Chart for Manpower Recap
  const manpowerRecapOptions = {
    data: dashboardData.manpowerData,
    series: [...new Set(dashboardData.manpowerData.map(item => item.contractor))].map(contractor => ({
      type: 'area',
      xKey: 'date',
      yKey: 'workers',
      yName: contractor,
      fillOpacity: 0.6,
      stroke: '#4682b4',
      strokeWidth: 2,
      marker: { enabled: true, size: 5, fill: '#4682b4', stroke: '#2f4f4f', strokeWidth: 1 },
      tooltip: {
        enabled: true,
        renderer: ({ datum }) => ({
          title: contractor,
          content: `Date: ${datum.date.toLocaleDateString()}\nWorkers: ${datum.workers}`,
        }),
      },
    })),
    height: 200,
    axes: [
      {
        type: 'time',
        position: 'bottom',
        nice: true,
        label: { format: '%m/%d/%Y', fontSize: 12, fontFamily: 'Roboto, sans-serif', color: '#333' },
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Workers', fontSize: 12 },
        label: { fontSize: 12, fontFamily: 'Roboto, sans-serif', color: '#333' },
      },
    ],
    background: { fill: '#ffffff' },
    legend: { position: 'top', item: { label: { fontSize: 12, fontFamily: 'Roboto, sans-serif', color: '#333' } } },
    animation: { enabled: true, duration: 1000 },
  };

  // Treemap for Permits Status
  const permitsStatusOptions = {
    data: [
      {
        name: 'Permits',
        children: Object.entries(
          dashboardData.permitData.reduce((acc, permit) => {
            const status = permit.status || 'Unknown';
            if (!acc[status]) {
              acc[status] = { name: status, children: [] };
            }
            acc[status].children.push({
              name: permit.description || 'Unnamed Permit',
              value: 1,
              status: status,
            });
            return acc;
          }, {})
        ).map(([_, group]) => group),
      },
    ],
    series: [
      {
        type: 'treemap',
        labelKey: 'name',
        sizeKey: 'value',
        colorKey: 'value',
        labels: {
          large: {
            fontSize: 12,
            color: '#fff',
            formatter: ({ datum }) => {
              const status = datum.status || 'Unknown';
              return {
                fill: status === 'Open' ? '#52c41a' :
                  status === 'Pending' ? '#faad14' :
                    status === 'Closed' ? '#f5222d' :
                      '#999999',
              };
            },
          },
        },
        tooltip: {
          enabled: true,
          renderer: ({ datum }) => ({
            title: datum.name,
            content: `Status: ${datum.status || 'Unknown'}`,
          }),
        },
        listeners: {
          nodeClick: (event) => {
            console.log('Permit clicked:', event.datum);
          },
        },
      },
    ],
    height: 200,
    legend: {
      enabled: true,
      position: 'bottom',
      item: {
        label: {
          formatter: ({ datum }) => datum.name,
          fontSize: 12,
          fontFamily: 'Roboto, sans-serif',
          color: '#333',
        },
      },
    },
    background: { fill: '#ffffff' },
    animation: { enabled: true, duration: 1000 },
  };

  // Panel content configuration
  const panelContent = {
    'project-health': {
      options: gaugeOptions,  // Now an array of three linear gauge options
    },
    'schedule-summary': { options: scheduleSummaryOptions },
    'budget-conditions': { options: budgetConditionsOptions },
    'manpower-recap': {
      options: manpowerRecapOptions,
      extra: (
        <p style={{ fontSize: 14, color: '#666' }}>
          Current: {dashboardData.manpowerData[dashboardData.manpowerData.length - 1]?.workers || 0}
        </p>
      ),
    },
    'permits-status': { options: permitsStatusOptions },
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem('dashboardPanelLayout', JSON.stringify(newLayout));
    message.success('Layout updated!');
  };

  const handleRefresh = () => {
    fetchData();
    message.info('Refreshing dashboard data...');
  };

  const enhancedHeaderContent = {
    ...headerContent,
    actions: (
      <Space>
        {headerContent.actions}
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          aria-label="Refresh dashboard data"
        >
          Refresh
        </Button>
      </Space>
    ),
  };

  return (
    <div
      className="project-dashboard-v2-container"
      style={{
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)',
      }}
    >
      <ComponentHeader title={enhancedHeaderContent.title} children={enhancedHeaderContent.actions} />

      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spin size="large" tip="Loading dashboard data..." />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#f5222d' }}>
            {error}
            <div style={{ marginTop: '16px' }}>
              <Button type="primary" onClick={fetchData}>Retry</Button>
            </div>
          </div>
        ) : selectedProject ? (
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={100}
            width={window.innerWidth - 32}
            onLayoutChange={handleLayoutChange}
            isResizable={true}
            isDraggable={true}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            style={{ minHeight: '100%' }}
          >
            {layout.map((panel) => (
              <div key={panel.i}>
                <Card
                  title={
                    <Space style={{ color: '#fff', fontSize: 18 }}>
                      {panel.icon ? React.cloneElement(panel.icon, { style: { fontSize: 20 } }) : <></>}
                      {panel.title}
                    </Space>
                  }
                  className="dashboard-card"
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                  headStyle={{
                    backgroundColor: 'var(--hb-blue)',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                    padding: '12px 16px',
                  }}
                  bodyStyle={{ padding: '16px' }}
                  hoverable
                >
                  {panel.i === 'project-health' ? (
                    dashboardData.healthData[0] ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {panelContent[panel.i].options.map((opts, index) => (
                          <AgCharts key={index} options={opts} />
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                        No data available
                      </div>
                    )
                  ) : panelContent[panel.i].options.data ? (
                    (panel.i === 'permits-status' && panelContent[panel.i].options.data[0]?.children?.length === 0) ||
                    (panel.i !== 'permits-status' && panelContent[panel.i].options.data.length === 0) ? (
                      <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                        No data available
                      </div>
                    ) : (
                      <AgCharts options={panelContent[panel.i].options} />
                    )
                  ) : (
                    <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                      No data available
                    </div>
                  )}
                  {panelContent[panel.i].extra || null}
                </Card>
              </div>
            ))}
          </GridLayout>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--content-color)' }}>
            <h2>No project selected</h2>
            <p>Please select a project to view the dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

ProjectDashboardV2.propTypes = {
  selectedProject: PropTypes.shape({
    projectNumber: PropTypes.string,
    name: PropTypes.string,
    budget: PropTypes.string,
  }),
  headerContent: PropTypes.shape({
    title: PropTypes.node.isRequired,
    actions: PropTypes.node,
  }).isRequired,
};

ProjectDashboardV2.defaultProps = {
  selectedProject: null,
};

export default ProjectDashboardV2;