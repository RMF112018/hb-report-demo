// src/renderer/components/Permits.js
// Permits component for HB Report, displaying a log of permits with inline editing, filtering, and enhanced UI/UX
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://ant.design/components/layout#api
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/
// *Additional Reference*: https://ant.design/components/modal#api
// *Additional Reference*: https://ant.design/components/form#api
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/ipc-renderer

import React, { useState, useEffect, useMemo } from 'react';
import { Space, Spin, Button, Modal, Form, Input as AntInput, Select, Dropdown, message, DatePicker, Tag, Input } from 'antd';
import { SearchOutlined, DownOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ComponentHeader from './ComponentHeader.js';
import TableModule from './TableModule.js';
import '../styles/global.css';
import '../styles/Components.css';
import moment from 'moment';

const { Option } = Select;

/**
 * Permits component for managing and visualizing permit logs
 * @param {Object} props - Component props
 * @param {Object} props.selectedProject - The currently selected project
 * @param {Object} props.headerContent - Header content passed from App.js
 * @returns {JSX.Element} Permits log component
 */
const Permits = ({ selectedProject, headerContent }) => {
    const [rowData, setRowData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPermitModalVisible, setIsPermitModalVisible] = useState(false);
    const [editingPermit, setEditingPermit] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [permitToDelete, setPermitToDelete] = useState(null);
    const [form] = Form.useForm();

    // Fetch data via IPC
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await window.electronAPI.getPermitTestData();
                setRowData(data);
            } catch (error) {
                message.error('Failed to load permit data.');
                console.error('Error fetching permit data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter rowData based on status
    const filteredRowData = useMemo(() => {
        if (statusFilter === 'All') return rowData;
        return rowData.filter(item => item.status === statusFilter);
    }, [rowData, statusFilter]);

    // Custom cell renderer for date fields
    const DateCellRenderer = (params) => {
        return params.value ? moment(params.value).format('MM/DD/YYYY') : '-';
    };

    // Custom cell renderer for status fields
    const StatusCellRenderer = (params) => {
        const value = params.value || '';
        const color = value === 'Open' ? 'green' :
                      value === 'Pending' ? 'orange' :
                      value === 'Closed' ? 'gray' :
                      value === 'Active' ? 'blue' : 'default';
        return <Tag color={color}>{value}</Tag>;
    };

    // Define columns based on the Permit Log table
    const tableColumns = [
        { field: 'id', headerName: 'ID #', width: 80, minWidth: 60, maxWidth: 100, pinned: 'left' },
        { field: 'location', headerName: 'Location', width: 120, minWidth: 100, maxWidth: 150 },
        { field: 'type', headerName: 'Type', width: 100, minWidth: 80, maxWidth: 120 },
        { field: 'permitNumber', headerName: 'Permit #', width: 100, minWidth: 80, maxWidth: 120 },
        { field: 'description', headerName: 'Description', width: 200, minWidth: 150, maxWidth: 300, cellStyle: { whiteSpace: 'normal', textAlign: 'left' } },
        { field: 'responsibleContractor', headerName: 'Responsible Contractor', width: 150, minWidth: 120, maxWidth: 200 },
        { 
            field: 'permitStatus', 
            headerName: 'Permit Status', 
            width: 120, 
            minWidth: 100, 
            maxWidth: 150, 
            cellRenderer: StatusCellRenderer 
        },
        { field: 'dateReceived', headerName: 'Date Received', width: 120, minWidth: 100, maxWidth: 150, cellRenderer: DateCellRenderer },
        { field: 'dateRequired', headerName: 'Date Required', width: 120, minWidth: 100, maxWidth: 150, cellRenderer: DateCellRenderer },
        { field: 'dateIssued', headerName: 'Date Issued', width: 120, minWidth: 100, maxWidth: 150, cellRenderer: DateCellRenderer },
        { 
            field: 'status', 
            headerName: 'Status', 
            width: 100, 
            minWidth: 80, 
            maxWidth: 120, 
            cellRenderer: StatusCellRenderer 
        },
        { field: 'agency', headerName: 'Agency', width: 100, minWidth: 80, maxWidth: 120 },
        { field: 'comments', headerName: 'Comments', width: 200, minWidth: 150, maxWidth: 300, cellStyle: { whiteSpace: 'normal', textAlign: 'left' } },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            minWidth: 100,
            maxWidth: 150,
            cellRenderer: (params) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleRowClick(params.data)}
                        aria-label={`Edit permit ${params.data.permitNumber}`}
                    />
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            setPermitToDelete(params.data);
                            setIsDeleteModalVisible(true);
                        }}
                        aria-label={`Delete permit ${params.data.permitNumber}`}
                    />
                </Space>
            ),
        },
    ];

    // Handle "New Permit" or "Edit Permit" modal submission
    const handleCreateOrUpdatePermit = async (values) => {
        const newPermit = {
            id: editingPermit ? editingPermit.id : `PERMIT-${Date.now()}`,
            location: values.location,
            type: values.type,
            permitNumber: values.permitNumber,
            description: values.description,
            responsibleContractor: values.responsibleContractor,
            permitStatus: values.permitStatus,
            dateReceived: values.dateReceived ? values.dateReceived.format('YYYY-MM-DD') : null,
            dateRequired: values.dateRequired ? values.dateRequired.format('YYYY-MM-DD') : null,
            dateIssued: values.dateIssued ? values.dateIssued.format('YYYY-MM-DD') : null,
            status: values.status,
            agency: values.agency,
            comments: values.comments,
        };

        try {
            let updatedData;
            if (editingPermit) {
                updatedData = await window.electronAPI.updatePermit(newPermit);
                message.success('Permit updated successfully!');
            } else {
                updatedData = await window.electronAPI.addPermit(newPermit);
                message.success('Permit created successfully!');
            }
            setRowData(updatedData);
        } catch (error) {
            message.error(editingPermit ? 'Failed to update permit.' : 'Failed to create permit.');
            console.error('Error saving permit:', error);
        }

        setIsPermitModalVisible(false);
        setEditingPermit(null);
        form.resetFields();
    };

    // Handle row click to edit
    const handleRowClick = (permit) => {
        setEditingPermit(permit);
        form.setFieldsValue({
            ...permit,
            dateReceived: permit.dateReceived ? moment(permit.dateReceived) : null,
            dateRequired: permit.dateRequired ? moment(permit.dateRequired) : null,
            dateIssued: permit.dateIssued ? moment(permit.dateIssued) : null,
        });
        setIsPermitModalVisible(true);
    };

    // Handle delete confirmation
    const handleDeletePermit = async () => {
        if (!permitToDelete) return;
        try {
            const updatedData = await window.electronAPI.deletePermit(permitToDelete.id);
            setRowData(updatedData);
            message.success('Permit deleted successfully!');
        } catch (error) {
            message.error('Failed to delete permit.');
            console.error('Error deleting permit:', error);
        }
        setIsDeleteModalVisible(false);
        setPermitToDelete(null);
    };

    // Header actions with "Create" button
    const headerActions = (
        <Space>
            <Button
                style={{ backgroundColor: 'var(--hb-orange)', borderColor: 'var(--hb-orange)', color: '#fff' }}
                onClick={() => {
                    setEditingPermit(null);
                    form.resetFields();
                    setIsPermitModalVisible(true);
                }}
                aria-label="Create new permit"
            >
                <PlusOutlined /> Create
            </Button>
            {headerContent.actions}
        </Space>
    );

    return (
        <div
            className="permits-container"
            style={{ margin: 0, display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflowY: 'auto' }}
        >
            <ComponentHeader title={headerContent.title} actions={headerActions} />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <Input
                    placeholder="Search permits"
                    prefix={<SearchOutlined />}
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    style={{ width: '200px' }}
                    aria-label="Search permits records"
                />
                <Select
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value)}
                    style={{ width: '150px' }}
                    aria-label="Filter by status"
                >
                    <Option value="All">All Statuses</Option>
                    <Option value="Open">Open</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Closed">Closed</Option>
                </Select>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Spin />
                    </div>
                ) : (
                    <TableModule
                        data={filteredRowData}
                        columns={tableColumns}
                        enableSorting={true}
                        enableFiltering={true}
                        enablePagination={true}
                        pageSize={20}
                        className="permits-table"
                        globalFilter={globalFilter}
                        loading={isLoading}
                        enableFullscreen={true}
                        onRowClick={handleRowClick}
                    />
                )}
            </div>

            {/* Modal for New/Edit Permit */}
            <Modal
                title={editingPermit ? 'Edit Permit' : 'Create New Permit'}
                open={isPermitModalVisible}
                onCancel={() => {
                    setIsPermitModalVisible(false);
                    setEditingPermit(null);
                    form.resetFields();
                }}
                footer={null}
                className="permits-modal"
            >
                <Form form={form} onFinish={handleCreateOrUpdatePermit} layout="vertical" className="permits-modal-form">
                    <div className="permits-modal-row">
                        <Form.Item
                            name="location"
                            label="Location"
                            rules={[{ required: true, message: 'Please enter the location' }]}
                            className="permits-modal-field permits-modal-field-location"
                        >
                            <AntInput />
                        </Form.Item>
                        <Form.Item
                            name="type"
                            label="Type"
                            rules={[{ required: true, message: 'Please select the type' }]}
                            className="permits-modal-field permits-modal-field-type"
                        >
                            <Select placeholder="Select type">
                                <Option value="Primary">Primary</Option>
                                <Option value="Secondary">Secondary</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="permitNumber"
                            label="Permit #"
                            rules={[{ required: true, message: 'Please enter the permit number' }]}
                            className="permits-modal-field permits-modal-field-permitNumber"
                        >
                            <AntInput />
                        </Form.Item>
                    </div>
                    <div className="permits-modal-row">
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please enter the description' }]}
                            className="permits-modal-field permits-modal-field-description"
                        >
                            <AntInput.TextArea rows={3} />
                        </Form.Item>
                    </div>
                    <div className="permits-modal-row">
                        <Form.Item
                            name="responsibleContractor"
                            label="Responsible Contractor"
                            rules={[{ required: true, message: 'Please enter the responsible contractor' }]}
                            className="permits-modal-field permits-modal-field-responsibleContractor"
                        >
                            <AntInput />
                        </Form.Item>
                        <Form.Item
                            name="permitStatus"
                            label="Permit Status"
                            rules={[{ required: true, message: 'Please select the permit status' }]}
                            className="permits-modal-field permits-modal-field-permitStatus"
                        >
                            <Select placeholder="Select permit status">
                                <Option value="Active">Active</Option>
                                <Option value="Pending">Pending</Option>
                                <Option value="Closed">Closed</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select the status' }]}
                            className="permits-modal-field permits-modal-field-status"
                        >
                            <Select placeholder="Select status">
                                <Option value="Open">Open</Option>
                                <Option value="Closed">Closed</Option>
                                <Option value="Pending">Pending</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="permits-modal-row">
                        <Form.Item
                            name="dateReceived"
                            label="Date Received"
                            className="permits-modal-field permits-modal-field-dateReceived"
                        >
                            <DatePicker format="MM/DD/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="dateRequired"
                            label="Date Required"
                            className="permits-modal-field permits-modal-field-dateRequired"
                        >
                            <DatePicker format="MM/DD/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="dateIssued"
                            label="Date Issued"
                            className="permits-modal-field permits-modal-field-dateIssued"
                        >
                            <DatePicker format="MM/DD/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                    </div>
                    <div className="permits-modal-row">
                        <Form.Item
                            name="agency"
                            label="Agency"
                            rules={[{ required: true, message: 'Please enter the agency' }]}
                            className="permits-modal-field permits-modal-field-agency"
                        >
                            <AntInput />
                        </Form.Item>
                    </div>
                    <div className="permits-modal-row">
                        <Form.Item
                            name="comments"
                            label="Comments"
                            className="permits-modal-field permits-modal-field-comments"
                        >
                            <AntInput.TextArea rows={2} />
                        </Form.Item>
                    </div>
                    <Form.Item className="permits-modal-actions">
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingPermit ? 'Update' : 'Create'}
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsPermitModalVisible(false);
                                    setEditingPermit(null);
                                    form.resetFields();
                                }}
                            >
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal for Delete Confirmation */}
            <Modal
                title="Confirm Deletion"
                open={isDeleteModalVisible}
                onOk={handleDeletePermit}
                onCancel={() => {
                    setIsDeleteModalVisible(false);
                    setPermitToDelete(null);
                }}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to delete this permit: <strong>{permitToDelete?.permitNumber}</strong>?</p>
            </Modal>
        </div>
    );
};

export default Permits;