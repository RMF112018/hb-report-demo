// src/renderer/components/Constraints.js
// Constraints component for HB Report, displaying a constraints log with separate tables for each category, modals for adding constraints/categories, and CRUD operations via IPC
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://ant.design/components/layout#api
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/
// *Additional Reference*: https://ant.design/components/modal#api
// *Additional Reference*: https://ant.design/components/form#api
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/ipc-renderer

import React, { useState, useEffect, useMemo } from 'react';
import { Input, Space, Spin, Button, Modal, Form, Input as AntInput, Select, Dropdown, message, DatePicker, Tabs } from 'antd';
import { SearchOutlined, DownOutlined, PlusOutlined, CaretDownFilled, CaretRightFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ComponentHeader from './ComponentHeader.js';
import TableModule from './TableModule.js';
import moment from 'moment';
// import '../styles/global.css';
import '../styles/TableModule.css';
// import '../styles/Components.css';

const { Option } = Select;
const { TabPane } = Tabs;

const Constraints = ({ selectedProject, headerContent }) => {
    const [rowData, setRowData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isConstraintModalVisible, setIsConstraintModalVisible] = useState(false);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [isDeleteConstraintModalVisible, setIsDeleteConstraintModalVisible] = useState(false);
    const [isDeleteCategoryModalVisible, setIsDeleteCategoryModalVisible] = useState(false);
    const [constraintToDelete, setConstraintToDelete] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [editingConstraint, setEditingConstraint] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [collapsedCategories, setCollapsedCategories] = useState({});
    const [activeTab, setActiveTab] = useState('open');

    const [form] = Form.useForm();

    // Fetch data via IPC
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await window.electronAPI.getConstraintsTestData();
                const initializedData = data.map((item, index) => ({
                    ...item,
                    id: item.id || `${item.category}-${index}`, // Ensure each item has an ID
                    daysElapsed: item.dateIdentified
                        ? moment().diff(moment(item.dateIdentified, 'MM/DD/YYYY'), 'days')
                        : '',
                }));
                setRowData(initializedData);
            } catch (error) {
                message.error('Failed to load constraints data.');
                console.error('Error fetching constraints data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Group data by category for Open Constraints
    const categories = useMemo(() => {
        const categoryMap = {};
        rowData
            .filter(item => item.completionStatus !== 'Closed')
            .forEach(item => {
                if (!categoryMap[item.category]) {
                    categoryMap[item.category] = [];
                }
                categoryMap[item.category].push(item);
            });
        return categoryMap;
    }, [rowData]);

    // Get sorted category keys for Open Constraints
    const categoryKeys = useMemo(() => {
        return Object.keys(categories).sort((a, b) => {
            const numA = parseInt(a.split('.')[0]);
            const numB = parseInt(b.split('.')[0]);
            return numA - numB;
        });
    }, [categories]);

    // Filter and sort Closed Constraints
    const closedConstraints = useMemo(() => {
        return rowData
            .filter(item => item.completionStatus === 'Closed')
            .sort((a, b) => {
                const dateA = a.dateClosed ? moment(a.dateClosed, 'MM/DD/YYYY') : moment(0);
                const dateB = b.dateClosed ? moment(b.dateClosed, 'MM/DD/YYYY') : moment(0);
                return dateB - dateA; // Most recent to oldest
            });
    }, [rowData]);

    // Completion Status options for Dropdown
    const completionStatusItems = [
        { label: 'Identified', key: 'Identified' },
        { label: 'Pending', key: 'Pending' },
        { label: 'In Progress', key: 'In Progress' },
        { label: 'Closed', key: 'Closed' },
    ];

    // Handle row click to open modal with pre-filled data
    const handleRowClick = (row) => {
        setEditingConstraint(row);
        form.setFieldsValue({
            category: row.category,
            description: row.description,
            dateIdentified: row.dateIdentified ? moment(row.dateIdentified, 'MM/DD/YYYY') : null,
            reference: row.reference,
            closureDocument: row.closureDocument,
            assigned: row.assigned,
            bic: row.bic,
            dueDate: row.dueDate ? moment(row.dueDate, 'MM/DD/YYYY') : null,
            completionStatus: row.completionStatus || 'Identified',
            dateClosed: row.dateClosed ? moment(row.dateClosed, 'MM/DD/YYYY') : null,
            comments: row.comments,
        });
        setIsConstraintModalVisible(true);
    };

    // Completion Status cell renderer for the table
    const CompletionStatusCellRenderer = (params) => {
        const value = params.value || 'Identified';
        const color = value === 'Closed' ? 'green' :
                      value === 'In Progress' ? '#faad14' :
                      value === 'Pending' ? '#1890ff' : 'red'; // Identified in red
        return (
            <span style={{ color, fontWeight: value === 'Closed' ? 'bold' : 'normal' }}>
                {value}
            </span>
        );
    };

    // Date Closed cell renderer for the table
    const DateClosedCellRenderer = (params) => {
        return params.value ? moment(params.value).format('MM/DD/YYYY') : '';
    };

    // Columns definition with actions for edit and delete
    const columns = [
        { field: 'no', headerName: 'No.', width: 80, pinned: 'left' },
        { field: 'description', headerName: 'Description', width: 300, pinned: 'left', cellStyle: { whiteSpace: 'normal' } },
        { field: 'dateIdentified', headerName: 'Date Identified', width: 120 },
        { field: 'daysElapsed', headerName: 'Days Elapsed', width: 100 },
        { field: 'reference', headerName: 'Reference', width: 200, cellStyle: { whiteSpace: 'normal' } },
        { field: 'closureDocument', headerName: 'Closure Document', width: 150, cellStyle: { whiteSpace: 'normal' } },
        { field: 'assigned', headerName: 'Assigned', width: 120 },
        { field: 'bic', headerName: 'B.I.C.', width: 100 },
        { field: 'dueDate', headerName: 'Due Date', width: 120 },
        {
            field: 'completionStatus',
            headerName: 'Completion Status',
            width: 120,
            cellRenderer: CompletionStatusCellRenderer,
        },
        { 
            field: 'dateClosed', 
            headerName: 'Date Closed', 
            width: 120, 
            cellRenderer: DateClosedCellRenderer 
        },
        { field: 'comments', headerName: 'Comments', width: 400, cellStyle: { whiteSpace: 'normal' } },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            cellRenderer: (params) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingConstraint(params.data);
                            form.setFieldsValue({
                                category: params.data.category,
                                description: params.data.description,
                                dateIdentified: params.data.dateIdentified ? moment(params.data.dateIdentified, 'MM/DD/YYYY') : null,
                                reference: params.data.reference,
                                closureDocument: params.data.closureDocument,
                                assigned: params.data.assigned,
                                bic: params.data.bic,
                                dueDate: params.data.dueDate ? moment(params.data.dueDate, 'MM/DD/YYYY') : null,
                                completionStatus: params.data.completionStatus || 'Identified',
                                dateClosed: params.data.dateClosed ? moment(params.data.dateClosed, 'MM/DD/YYYY') : null,
                                comments: params.data.comments,
                            });
                            setIsConstraintModalVisible(true);
                        }}
                    />
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            setConstraintToDelete(params.data);
                            setIsDeleteConstraintModalVisible(true);
                        }}
                    />
                </Space>
            ),
        },
    ];

    // Toggle collapse/expand for a category
    const toggleCategory = (category) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    // Handle "New Constraint" or "Edit Constraint" modal submission
    const handleCreateOrUpdateConstraint = async (values) => {
        const category = values.category;
        const categoryData = categories[category];
        const newConstraint = {
            id: editingConstraint ? editingConstraint.id : `${category}-${Date.now()}`,
            no: editingConstraint
                ? editingConstraint.no
                : categoryData && categoryData.length > 0
                ? `${parseFloat(categoryData[categoryData.length - 1].no) + 0.1}`
                : parseFloat(category.split('.')[0]).toString(),
            category,
            description: values.description,
            dateIdentified: values.dateIdentified ? values.dateIdentified.format('MM/DD/YYYY') : '',
            daysElapsed: values.dateIdentified ? moment().diff(values.dateIdentified, 'days') : '',
            reference: values.reference || '',
            closureDocument: values.closureDocument || '',
            assigned: values.assigned || '',
            bic: values.bic || '',
            dueDate: values.dueDate ? values.dueDate.format('MM/DD/YYYY') : '',
            completionStatus: values.completionStatus || 'Identified',
            dateClosed: values.completionStatus === 'Closed' ? (values.dateClosed ? values.dateClosed.format('MM/DD/YYYY') : moment().format('MM/DD/YYYY')) : '',
            comments: values.comments || '',
        };

        try {
            let updatedData;
            if (editingConstraint) {
                updatedData = await window.electronAPI.updateConstraint(newConstraint);
                message.success('Constraint updated successfully!');
            } else {
                updatedData = await window.electronAPI.addConstraint(newConstraint);
                message.success('Constraint created successfully!');
            }
            setRowData(updatedData.map((item, index) => ({
                ...item,
                id: item.id || `${item.category}-${index}`,
                daysElapsed: item.dateIdentified
                    ? moment().diff(moment(item.dateIdentified, 'MM/DD/YYYY'), 'days')
                    : '',
            })));
        } catch (error) {
            message.error(editingConstraint ? 'Failed to update constraint.' : 'Failed to create constraint.');
            console.error('Error saving constraint:', error);
        }

        setIsConstraintModalVisible(false);
        setEditingConstraint(null);
        form.resetFields();
    };

    // Handle "New Category" or "Edit Category" modal submission
    const handleCreateOrUpdateCategory = async (values) => {
        const newCategoryNumber = editingCategory ? editingCategory.number : categoryKeys.length + 1;
        const newCategory = `${newCategoryNumber}. ${values.categoryName.toUpperCase()}`;
        const newCategoryEntry = {
            id: editingCategory ? editingCategory.id : `${newCategory}-0`,
            no: `${newCategoryNumber}`,
            category: newCategory,
            description: '',
            dateIdentified: '',
            daysElapsed: '',
            reference: '',
            closureDocument: '',
            assigned: '',
            bic: '',
            dueDate: '',
            completionStatus: '',
            dateClosed: '',
            comments: '',
        };

        try {
            let updatedData;
            if (editingCategory) {
                // Update all items in the category with the new category name
                updatedData = rowData.map(item => {
                    if (item.category === editingCategory.name) {
                        return { ...item, category: newCategory };
                    }
                    return item;
                });
                // Update the JSON file by replacing all entries
                updatedData.forEach(async (item) => {
                    await window.electronAPI.updateConstraint(item);
                });
                message.success('Category updated successfully!');
            } else {
                updatedData = await window.electronAPI.addConstraint(newCategoryEntry);
                message.success('Category created successfully!');
            }
            setRowData(updatedData.map((item, index) => ({
                ...item,
                id: item.id || `${item.category}-${index}`,
                daysElapsed: item.dateIdentified
                    ? moment().diff(moment(item.dateIdentified, 'MM/DD/YYYY'), 'days')
                    : '',
            })));
        } catch (error) {
            message.error(editingCategory ? 'Failed to update category.' : 'Failed to create category.');
            console.error('Error saving category:', error);
        }

        setIsCategoryModalVisible(false);
        setEditingCategory(null);
        form.resetFields();
    };

    // Handle delete constraint confirmation
    const handleDeleteConstraint = async () => {
        if (!constraintToDelete) return;
        try {
            const updatedData = await window.electronAPI.deleteConstraint(constraintToDelete.id);
            setRowData(updatedData.map((item, index) => ({
                ...item,
                id: item.id || `${item.category}-${index}`,
                daysElapsed: item.dateIdentified
                    ? moment().diff(moment(item.dateIdentified, 'MM/DD/YYYY'), 'days')
                    : '',
            })));
            message.success('Constraint deleted successfully!');
        } catch (error) {
            message.error('Failed to delete constraint.');
            console.error('Error deleting constraint:', error);
        }
        setIsDeleteConstraintModalVisible(false);
        setConstraintToDelete(null);
    };

    // Handle delete category confirmation
    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;
        try {
            // Delete all items in the category
            const updatedData = rowData.filter(item => item.category !== categoryToDelete.name);
            // Update the JSON file by replacing all entries
            updatedData.forEach(async (item) => {
                await window.electronAPI.updateConstraint(item);
            });
            // Since we're filtering out the category, we need to re-fetch or update the data
            setRowData(updatedData.map((item, index) => ({
                ...item,
                id: item.id || `${item.category}-${index}`,
                daysElapsed: item.dateIdentified
                    ? moment().diff(moment(item.dateIdentified, 'MM/DD/YYYY'), 'days')
                    : '',
            })));
            message.success('Category and its constraints deleted successfully!');
        } catch (error) {
            message.error('Failed to delete category.');
            console.error('Error deleting category:', error);
        }
        setIsDeleteCategoryModalVisible(false);
        setCategoryToDelete(null);
        setIsCategoryModalVisible(false);
        setEditingCategory(null);
        form.resetFields();
    };

    // Handle edit category button click
    const handleEditCategory = (category) => {
        const categoryNumber = parseInt(category.split('.')[0]);
        setEditingCategory({ name: category, number: categoryNumber });
        form.setFieldsValue({
            categoryName: category.split('. ')[1],
        });
        setIsCategoryModalVisible(true);
    };

    // Header actions with "Create" dropdown
    const headerActions = (
        <Space>
            <Dropdown
                menu={{
                    items: [
                        { key: 'new-constraint', label: 'New Constraint' },
                        { key: 'new-category', label: 'New Category' },
                    ],
                    onClick: ({ key }) => {
                        if (key === 'new-constraint') {
                            setEditingConstraint(null);
                            form.resetFields();
                            setIsConstraintModalVisible(true);
                        } else {
                            setEditingCategory(null);
                            form.resetFields();
                            setIsCategoryModalVisible(true);
                        }
                    },
                }}
                trigger={['click']}
            >
                <Button
                    style={{ backgroundColor: 'var(--hb-orange)', borderColor: 'var(--hb-orange)', color: '#fff' }}
                    aria-label="Create"
                >
                    <PlusOutlined /> Create <DownOutlined />
                </Button>
            </Dropdown>
            {headerContent.actions}
        </Space>
    );

    return (
        <div
            className="constraints-container"
            style={{ margin: 0, display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflowY: 'auto' }}
        >
            <ComponentHeader
                title={headerContent.title}
                actions={headerActions}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <Input
                    placeholder="Search"
                    prefix={<SearchOutlined />}
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    style={{ width: '200px' }}
                    aria-label="Search constraints records"
                />
            </div>
            <Tabs activeKey={activeTab} onChange={setActiveTab} className="constraints-tabs">
                <TabPane tab="Open Constraints" key="open">
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {isLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Spin />
                            </div>
                        ) : (
                            categoryKeys.map(category => (
                                <div key={category} className="constraints-category-section">
                                    <div className="constraints-category-header">
                                        <Button
                                            type="text"
                                            icon={
                                                collapsedCategories[category] ? (
                                                    <CaretRightFilled className="constraints-collapse-icon" />
                                                ) : (
                                                    <CaretDownFilled className="constraints-collapse-icon" />
                                                )
                                            }
                                            onClick={() => toggleCategory(category)}
                                            style={{ marginRight: '8px' }}
                                        >
                                            {category}
                                        </Button>
                                        <Button
                                            type="link"
                                            icon={<EditOutlined />}
                                            onClick={() => handleEditCategory(category)}
                                            className="constraints-category-edit-button"
                                        />
                                    </div>
                                    {!collapsedCategories[category] && (
                                        <TableModule
                                            data={categories[category].filter(item => item.description || item.no === category.split('.')[0])}
                                            columns={columns}
                                            enableSorting={true}
                                            enableFiltering={true}
                                            enablePagination={false}
                                            pageSize={10}
                                            className="constraints-table"
                                            globalFilter={globalFilter}
                                            loading={isLoading}
                                            enableFullscreen={false}
                                            onRowClick={handleRowClick}
                                        />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </TabPane>
                <TabPane tab="Closed Constraints" key="closed">
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {isLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Spin />
                            </div>
                        ) : (
                            <div className="constraints-resolved-section">
                                <h2 className="constraints-resolved-title">Resolved Constraints</h2>
                                <TableModule
                                    data={closedConstraints}
                                    columns={columns}
                                    enableSorting={true}
                                    enableFiltering={true}
                                    enablePagination={false}
                                    pageSize={10}
                                    className="constraints-table"
                                    globalFilter={globalFilter}
                                    loading={isLoading}
                                    enableFullscreen={false}
                                    onRowClick={handleRowClick}
                                />
                            </div>
                        )}
                    </div>
                </TabPane>
            </Tabs>

            {/* Modal for New/Edit Constraint */}
            <Modal
                title={editingConstraint ? 'Edit Constraint' : 'Create New Constraint'}
                open={isConstraintModalVisible}
                onCancel={() => {
                    setIsConstraintModalVisible(false);
                    setEditingConstraint(null);
                    form.resetFields();
                }}
                footer={null}
                className="constraints-modal"
            >
                <Form form={form} onFinish={handleCreateOrUpdateConstraint} layout="vertical" className="constraints-modal-form">
                    <div className="constraints-modal-row">
                        <Form.Item
                            name="category"
                            label="Category"
                            rules={[{ required: true, message: 'Please select a category' }]}
                            className="constraints-modal-field constraints-modal-field-category"
                        >
                            <Select placeholder="Select a category">
                                {categoryKeys.map(cat => (
                                    <Option key={cat} value={cat}>{cat}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please enter a description' }]}
                            className="constraints-modal-field constraints-modal-field-description"
                        >
                            <AntInput />
                        </Form.Item>
                    </div>
                    <div className="constraints-modal-row">
                        <Form.Item
                            name="dateIdentified"
                            label="Date Identified"
                            className="constraints-modal-field constraints-modal-field-date"
                        >
                            <DatePicker format="MM/DD/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="dueDate"
                            label="Due Date"
                            className="constraints-modal-field constraints-modal-field-date"
                        >
                            <DatePicker format="MM/DD/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="completionStatus"
                            label="Completion Status"
                            className="constraints-modal-field constraints-modal-field-completion"
                        >
                            <Select
                                placeholder="Select status"
                                onChange={(value) => {
                                    if (value !== 'Closed') {
                                        form.setFieldsValue({ dateClosed: null });
                                    } else if (!form.getFieldValue('dateClosed')) {
                                        form.setFieldsValue({ dateClosed: moment() });
                                    }
                                }}
                            >
                                {completionStatusItems.map(item => (
                                    <Option key={item.key} value={item.key}>{item.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="constraints-modal-row">
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) => prevValues.completionStatus !== currentValues.completionStatus}
                        >
                            {({ getFieldValue }) => (
                                <Form.Item
                                    name="dateClosed"
                                    label="Date Closed"
                                    className="constraints-modal-field constraints-modal-field-date"
                                    dependencies={['completionStatus']}
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                const status = getFieldValue('completionStatus');
                                                if (status === 'Closed') {
                                                    if (!value) {
                                                        return Promise.reject(new Error('Date Closed is required when status is Closed'));
                                                    }
                                                    if (moment(value).isAfter(moment(), 'day')) {
                                                        return Promise.reject(new Error('Date Closed cannot be in the future'));
                                                    }
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        format="MM/DD/YYYY"
                                        style={{ width: '100%' }}
                                        disabled={getFieldValue('completionStatus') !== 'Closed'}
                                    />
                                </Form.Item>
                            )}
                        </Form.Item>
                        <Form.Item
                            name="assigned"
                            label="Assigned"
                            className="constraints-modal-field constraints-modal-field-assigned"
                        >
                            <AntInput />
                        </Form.Item>
                        <Form.Item
                            name="bic"
                            label="B.I.C."
                            className="constraints-modal-field constraints-modal-field-bic"
                        >
                            <AntInput />
                        </Form.Item>
                    </div>
                    <div className="constraints-modal-row">
                        <Form.Item
                            name="reference"
                            label="Reference"
                            className="constraints-modal-field constraints-modal-field-reference"
                        >
                            <AntInput />
                        </Form.Item>
                        <Form.Item
                            name="closureDocument"
                            label="Closure Document"
                            className="constraints-modal-field constraints-modal-field-closure"
                            dependencies={['completionStatus']}
                            rules={[
                                {
                                    validator: (_, value) => {
                                        const status = form.getFieldValue('completionStatus');
                                        if (status === 'Closed' && !value) {
                                            return Promise.reject(new Error('Closure Document is required when status is Closed'));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <AntInput />
                        </Form.Item>
                    </div>
                    <div className="constraints-modal-row">
                        <Form.Item
                            name="comments"
                            label="Comments"
                            className="constraints-modal-field constraints-modal-field-comments"
                        >
                            <AntInput.TextArea rows={2} />
                        </Form.Item>
                    </div>
                    <Form.Item className="constraints-modal-actions">
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingConstraint ? 'Update' : 'Create'}
                            </Button>
                            <Button onClick={() => {
                                setIsConstraintModalVisible(false);
                                setEditingConstraint(null);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal for New/Edit Category */}
            <Modal
                title={editingCategory ? 'Edit Category' : 'Create New Category'}
                open={isCategoryModalVisible}
                onCancel={() => {
                    setIsCategoryModalVisible(false);
                    setEditingCategory(null);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form form={form} onFinish={handleCreateOrUpdateCategory} layout="vertical">
                    <Form.Item
                        label="Category Number"
                        initialValue={editingCategory ? editingCategory.number : categoryKeys.length + 1}
                    >
                        <AntInput value={editingCategory ? editingCategory.number : categoryKeys.length + 1} disabled />
                    </Form.Item>
                    <Form.Item
                        name="categoryName"
                        label="Category Name"
                        rules={[{ required: true, message: 'Please enter a category name' }]}
                    >
                        <AntInput />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingCategory ? 'Update' : 'Create'}
                            </Button>
                            {editingCategory && (
                                <Button
                                    danger
                                    onClick={() => {
                                        setCategoryToDelete(editingCategory);
                                        setIsDeleteCategoryModalVisible(true);
                                    }}
                                >
                                    Delete
                                </Button>
                            )}
                            <Button onClick={() => {
                                setIsCategoryModalVisible(false);
                                setEditingCategory(null);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal for Delete Constraint Confirmation */}
            <Modal
                title="Confirm Deletion"
                open={isDeleteConstraintModalVisible}
                onOk={handleDeleteConstraint}
                onCancel={() => {
                    setIsDeleteConstraintModalVisible(false);
                    setConstraintToDelete(null);
                }}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to delete this constraint: <strong>{constraintToDelete?.description}</strong>?</p>
            </Modal>

            {/* Modal for Delete Category Confirmation */}
            <Modal
                title="Confirm Category Deletion"
                open={isDeleteCategoryModalVisible}
                onOk={handleDeleteCategory}
                onCancel={() => {
                    setIsDeleteCategoryModalVisible(false);
                    setCategoryToDelete(null);
                }}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to delete the category <strong>{categoryToDelete?.name}</strong> and all its associated constraints?</p>
            </Modal>
        </div>
    );
};

export default Constraints;