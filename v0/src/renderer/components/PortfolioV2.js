// src/renderer/components/PortfolioV2.js
// Enhanced Portfolio component for HB Report with configurable table and card views
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://ant.design/components/tabs
// *Additional Reference*: https://ant.design/components/card
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/ipc-renderer

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Button, Input, Select, message, Modal, Card, Space, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, TableOutlined, AppstoreOutlined } from '@ant-design/icons';
import TableModuleV2 from './TableModuleV2.js';
import ComponentHeader from './ComponentHeader.js';
import logger from '../utils/logger.js';
import '../styles/Components.css';

const { Option } = Select;
const { TabPane } = Tabs;

/**
 * PortfolioV2 component for displaying and managing a project portfolio with table and card views
 * @param {Object} props - Component props
 * @param {Function} props.onProjectSelect - Callback to handle project selection
 * @param {Object} props.headerContent - Header content passed from App.js
 * @returns {JSX.Element} Portfolio component with configurable views
 */
const PortfolioV2 = ({ onProjectSelect, headerContent }) => {
  const [groupBy, setGroupBy] = useState('None');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [tableData, setTableData] = useState([]);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch portfolio data via IPC
  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      const data = await window.electronAPI.getPortfolioTestData();
      logger.info('Portfolio data fetched successfully', { count: data.length });
      setTableData(data);
    } catch (err) {
      logger.error('Failed to fetch portfolio data', { message: err.message, stack: err.stack });
      message.error('Failed to load portfolio data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  // Filtered data using useMemo
  const filteredData = useMemo(() => {
    let result = [...tableData];
    if (statusFilter !== 'All') {
      result = result.filter(project =>
        statusFilter === 'Active' ? project.active === 1 : project.active === 0
      );
    }
    return result;
  }, [tableData, statusFilter]);

  // Table column definitions with dynamic grouping
  const columns = useMemo(() => [
    { field: 'number', headerName: 'Project Number', width: 130 },
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'leadPM', headerName: 'Lead PM', width: 300 },
    {
      field: 'active',
      headerName: 'Status',
      width: 100,
      valueFormatter: (params) => (params.value ? 'Active' : 'Inactive'),
    },
    { field: 'rev_budget', headerName: 'Current Budget', width: 200 },
    { field: 'current_completion', headerName: 'Contract End Date', width: 200 },
    { field: 'forecast_completion', headerName: 'Current End Date', width: 200 },
    { field: 'street_address', headerName: 'Street Address', width: 200 },
    { field: 'city', headerName: 'City', width: 150 },
    { 
      field: 'state', 
      headerName: 'State', 
      width: 80, 
      rowGroup: groupBy === 'state'
    },
    { field: 'zip', headerName: 'Zip', width: 100 },
  ], [groupBy]);

  // Handle row click for project selection
  const handleRowClick = (event) => {
    const data = event.data;
    logger.info('Row clicked', { project: data.number });
    onProjectSelect({ projectNumber: data.number, name: data.name });
  };

  // Handle edit project (placeholder)
  const handleEditProject = (data) => {
    console.log('Edit project:', data);
  };

  // Handle delete project
  const handleDeleteProject = (data) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete project ${data.number}?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          const updatedData = await window.electronAPI.deletePortfolio(data.id);
          setTableData(updatedData);
          message.success('Project deleted successfully!');
        } catch (error) {
          message.error('Failed to delete project.');
          console.error('Error deleting project:', error);
        }
      },
    });
  };

  // Header actions
  const headerActions = (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => console.log('Create new project')}
        style={{ backgroundColor: 'var(--hb-orange)', borderColor: 'var(--hb-orange)' }}
      >
        Create
      </Button>
    </div>
  );

  // Render card view
  const renderCardView = () => (
    <Row gutter={[16, 16]} style={{ padding: '16px' }}>
      {filteredData.map((project) => (
        <Col xs={24} sm={12} md={8} lg={6} key={project.id}>
          <Card
            title={`${project.number} - ${project.name}`}
            bordered={false}
            style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}
            hoverable
            actions={[
              <EditOutlined key="edit" onClick={() => handleEditProject(project)} />,
              <DeleteOutlined key="delete" onClick={() => handleDeleteProject(project)} />,
            ]}
            onClick={() => onProjectSelect({ projectNumber: project.number, name: project.name })}
          >
            <p><strong>Lead PM:</strong> {project.leadPM}</p>
            <p><strong>Status:</strong> {project.active ? 'Active' : 'Inactive'}</p>
            <p><strong>Current Budget:</strong> {project.rev_budget}</p>
            <p><strong>Contract End Date:</strong> {project.current_completion}</p>
            <p><strong>Current End Date:</strong> {project.forecast_completion}</p>
            <p><strong>Address:</strong> {project.street_address}, {project.city}, {project.state} {project.zip}</p>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <div className="portfolio-container" style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
      <ComponentHeader title={headerContent.title} actions={headerActions} />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <Input
          placeholder="Search projects"
          prefix={<SearchOutlined />}
          value={quickFilterText}
          onChange={(e) => setQuickFilterText(e.target.value)}
          style={{ width: '200px' }}
          aria-label="Search projects"
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '5px', fontSize: '12px' }} htmlFor="group-by-select">Group By:</label>
          <Select
            id="group-by-select"
            value={groupBy}
            onChange={(value) => setGroupBy(value)}
            style={{ width: '120px' }}
            aria-label="Group by column"
          >
            <Option value="None">None</Option>
            <Option value="state">State</Option>
          </Select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '5px', fontSize: '12px' }} htmlFor="status-filter-select">Status:</label>
          <Select
            id="status-filter-select"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: '120px' }}
            aria-label="Filter by status"
          >
            <Option value="All">All</Option>
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </div>
        <Button
          type="link"
          onClick={() => {
            setQuickFilterText('');
            setGroupBy('None');
            setStatusFilter('Active');
          }}
        >
          Clear All
        </Button>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Tabs
          defaultActiveKey="table"
          tabPosition="top"
          style={{ height: 'auto' }}
          tabBarStyle={{ textAlign: 'right' }}
        >
          <TabPane
            tab={<span><TableOutlined /> Table</span>}
            key="table"
            style={{ height: 'auto' }}
          >
            <TableModuleV2
              data={filteredData}
              columns={columns}
              autoSizeOnLoad={true}
              globalFilter={quickFilterText} // Updated to use globalFilter prop
              enableFiltering={true} // Enable filtering with sidebar
              agGridProps={{
                onRowClicked: handleRowClick,
                groupDisplayType: groupBy !== 'None' ? 'groupRows' : 'singleColumn',
                groupDefaultExpanded: 0,
                loadingOverlayComponent: () => <span>Loading...</span>,
                domLayout: 'autoHeight', // Ensure grid grows dynamically
              }}
            />
          </TabPane>
          <TabPane
            tab={<span><AppstoreOutlined /> Cards</span>}
            key="cards"
            style={{ height: 'auto', overflowY: 'auto' }}
          >
            {renderCardView()}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

PortfolioV2.propTypes = {
  onProjectSelect: PropTypes.func.isRequired,
  headerContent: PropTypes.shape({
    title: PropTypes.node.isRequired,
    actions: PropTypes.node,
  }).isRequired,
};

export default PortfolioV2;