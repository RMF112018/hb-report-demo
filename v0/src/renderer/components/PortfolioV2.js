// src/renderer/components/PortfolioV2.js
// Enhanced Portfolio component fetching projects from hb-report-sync using JWT
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://ant.design/components/tabs
// *Additional Reference*: https://redux-toolkit.js.org/rtk-query/usage/queries

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Button, Input, Select, message, Modal, Card, Space, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, TableOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useGetProjectsQuery } from '../apiSlice.js';
import TableModuleV2 from './TableModuleV2.js';
import ComponentHeader from './ComponentHeader.js';
import logger from '../utils/logger.js';
import '../styles/Components.css';

const { Option } = Select;

const PortfolioV2 = ({ onProjectSelect, headerContent, procoreUserId, onTokenExpired }) => {
  const [groupBy, setGroupBy] = useState('None');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [quickFilterText, setQuickFilterText] = useState('');

  // Fetch projects using JWT (procoreUserId derived from token)
  const { data: projectsData, isLoading, isError, error } = useGetProjectsQuery();

  // Log errors and handle token expiration
  useEffect(() => {
    if (isError) {
      logger.error('Failed to fetch projects:', error);
      if (error?.status === 401 || error?.message?.includes('No authentication token')) {
        message.error('Session expired. Please log in again.');
        onTokenExpired?.();
      } else {
        message.error('Failed to load projects. Please try again.');
      }
    } else if (projectsData) {
      logger.debug(`Fetched ${projectsData.length} projects for procoreUserId: ${procoreUserId}`);
    }
  }, [isError, error, projectsData, procoreUserId, onTokenExpired]);

  const tableData = useMemo(() => projectsData || [], [projectsData]);

  const filteredData = useMemo(() => {
    let result = [...tableData];
    if (statusFilter !== 'All') {
      result = result.filter(project =>
        statusFilter === 'Active' ? project.active === 1 : project.active === 0
      );
    }
    return result;
  }, [tableData, statusFilter]);

  const columns = useMemo(() => [
    { field: 'procore_id', headerName: 'Project ID', width: 130 },
    { field: 'name', headerName: 'Name', width: 300 },
    {
      field: 'active',
      headerName: 'Status',
      width: 100,
      valueFormatter: (params) => (params.value ? 'Active' : 'Inactive'),
    },
    { field: 'street_address', headerName: 'Street Address', width: 200 },
    { field: 'city', headerName: 'City', width: 150 },
    {
      field: 'state',
      headerName: 'State',
      width: 80,
      rowGroup: groupBy === 'state'
    },
    { field: 'zip', headerName: 'Zip', width: 100 },
    { field: 'start_date', headerName: 'Start Date', width: 200 },
    { field: 'approved_completion_date', headerName: 'Contract End Date', width: 200 },
    { field: 'contract_value', headerName: 'Contract Value', width: 200 },
  ], [groupBy]);

  const handleRowClick = (event) => {
    const data = event.data;
    onProjectSelect(data.procore_id.toString());
  };

  const handleEditProject = (data) => {
    console.log('Edit project:', data);
  };

  const handleDeleteProject = (data) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete project ${data.procore_id}?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          message.success('Project deletion not yet implemented.');
        } catch (error) {
          message.error('Failed to delete project.');
          logger.error('Error deleting project:', error);
        }
      },
    });
  };

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

  const renderCardView = () => (
    <Row gutter={[16, 16]} style={{ padding: '16px' }}>
      {filteredData.map((project) => (
        <Col xs={24} sm={12} md={8} lg={6} key={project.procore_id}>
          <Card
            title={`${project.procore_id} - ${project.name}`}
            bordered={false}
            style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}
            hoverable
            actions={[
              <EditOutlined key="edit" onClick={() => handleEditProject(project)} />,
              <DeleteOutlined key="delete" onClick={() => handleDeleteProject(project)} />,
            ]}
            onClick={() => onProjectSelect(project.procore_id.toString())}
          >
            <p><strong>Status:</strong> {project.active ? 'Active' : 'Inactive'}</p>
            <p><strong>Contract Value:</strong> {project.contract_value || 'N/A'}</p>
            <p><strong>Contract End Date:</strong> {project.approved_completion_date || 'N/A'}</p>
            <p><strong>Address:</strong> {project.street_address}, {project.city}, {project.state} {project.zip}</p>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const tabItems = [
    {
      key: 'table',
      label: (
        <span>
          <TableOutlined /> Table
        </span>
      ),
      children: (
        <TableModuleV2
          data={filteredData}
          columns={columns}
          autoSizeOnLoad={true}
          selectionMode="single"
          globalFilter={quickFilterText}
          enableFiltering={true}
          agGridProps={{
            onRowClicked: handleRowClick,
            groupDisplayType: groupBy !== 'None' ? 'groupRows' : 'singleColumn',
            groupDefaultExpanded: 0,
            loading: isLoading,
            domLayout: 'autoHeight',
          }}
        />
      ),
    },
    {
      key: 'cards',
      label: (
        <span>
          <AppstoreOutlined /> Cards
        </span>
      ),
      children: isLoading ? <span>Loading projects...</span> : renderCardView(),
    },
  ];

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
          items={tabItems}
        />
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
  procoreUserId: PropTypes.number.isRequired,
  onTokenExpired: PropTypes.func,
};

PortfolioV2.defaultProps = {
  onTokenExpired: null,
};

export default PortfolioV2;