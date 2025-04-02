// src/renderer/components/Portfolio.js
// Portfolio component for HB Report, displaying a project portfolio table with local JSON data
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://ant.design/components/layout#api
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/ipc-renderer
// *Additional Reference*: https://github.com/jamiebuilds/prop-types

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Select, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import TableModule from './TableModule.js';
import ComponentHeader from './ComponentHeader.js';
import logger from '../utils/logger.js';
import '../styles/Components.css';

const { Option } = Select;

/**
 * Portfolio component for displaying and managing a project portfolio table
 * @param {Object} props - Component props
 * @param {Function} props.onProjectSelect - Callback to handle project selection
 * @param {Object} props.headerContent - Header content passed from App.js
 * @returns {JSX.Element} Portfolio component with table view
 */
const Portfolio = ({ onProjectSelect, headerContent }) => {
    const [groupBy, setGroupBy] = useState('None');
    const [statusFilter, setStatusFilter] = useState('Active');
    const [tableData, setTableData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);

    // Custom cell renderer for actions
    const ActionsCellRenderer = (params) => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditProject(params.data)}
                aria-label={`Edit project ${params.data.number}`}
            />
            <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteProject(params.data)}
                aria-label={`Delete project ${params.data.number}`}
            />
        </div>
    );

    const columns = [
        { field: 'number', headerName: 'Project Number', minWidth: 130 },
        { field: 'name', headerName: 'Name', minWidth: 300 },
        { field: 'leadPM', headerName: 'Lead PM', minWidth: 300 },
        {
            field: 'active',
            headerName: 'Status',
            width: 100,
            cellRenderer: (params) => (params.value ? 'Active' : 'Inactive'),
        },
        { field: 'rev_budget', headerName: 'Current Budget', minWidth: 200 },
        { field: 'current_completion', headerName: 'Contract End Date', minWidth: 200 },
        { field: 'forecast_completion', headerName: 'Current End Date', minWidth: 200 },
        { field: 'street_address', headerName: 'Street Address', width: 200 },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'state', headerName: 'State', width: 80 },
        { field: 'zip', headerName: 'Zip', width: 100 },
    ];

    const fetchPortfolioData = async () => {
        setLoading(true);
        try {
            const data = await window.electronAPI.getPortfolioTestData();
            console.log('Fetched portfolio data:', data); // Debug log
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

    // Compute filtered data using useMemo to avoid unnecessary re-renders
    const filteredData = useMemo(() => {
        let result = [...tableData];
        if (statusFilter !== 'All') {
            result = result.filter(project =>
                statusFilter === 'Active' ? project.active === 1 : project.active === 0
            );
        }
        if (globalFilter) {
            result = result.filter(project =>
                Object.values(project).some(val =>
                    String(val).toLowerCase().includes(globalFilter.toLowerCase())
                )
            );
        }
        return result;
    }, [tableData, statusFilter, globalFilter]);

    const handleGroupBy = (value) => {
        setGroupBy(value);
        if (value !== 'None') {
            logger.info(`Grouping by ${value}`);
        }
    };

    const handleRowClick = (data) => {
        logger.info('Row clicked', { project: data.number });
        onProjectSelect({ projectNumber: data.number, name: data.name });
    };

    const handleEditProject = (data) => {
        // Placeholder for edit functionality (similar to BuyoutForm.js)
        console.log('Edit project:', data);
    };

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

    const headerActions = (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => console.log('Create new project')} // Placeholder
                style={{ backgroundColor: 'var(--hb-orange)', borderColor: 'var(--hb-orange)' }}
            >
                Create
            </Button>
        </div>
    );

    return (
        <div className="portfolio-container" style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <ComponentHeader title={headerContent.title} actions={headerActions} />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <Input
                    placeholder="Search projects"
                    prefix={<SearchOutlined />}
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    style={{ width: '200px' }}
                    aria-label="Search projects"
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '5px', fontSize: '12px' }} htmlFor="group-by-select">Group By:</label>
                    <Select
                        id="group-by-select"
                        value={groupBy}
                        onChange={handleGroupBy}
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
                        setGlobalFilter('');
                        setGroupBy('None');
                        setStatusFilter('Active');
                    }}
                >
                    Clear All
                </Button>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
                <TableModule
                    data={filteredData}
                    columns={columns}
                    enableSorting={true}
                    enableFiltering={true}
                    enablePagination={false}
                    pageSize={10}
                    className="portfolio-table"
                    onRowClick={handleRowClick}
                    globalFilter={globalFilter}
                    loading={loading}
                    enableFullscreen={false}
                />
            </div>
        </div>
    );
};

Portfolio.propTypes = {
    onProjectSelect: PropTypes.func.isRequired,
    headerContent: PropTypes.shape({
        title: PropTypes.node.isRequired,
        actions: PropTypes.node,
    }).isRequired,
};

export default Portfolio;