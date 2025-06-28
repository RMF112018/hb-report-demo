// src/renderer/components/ConstraintsV2.js
// Enhanced Constraints component for HB Report using TableModuleV2 with native AG Grid features
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://www.ag-grid.com/react-data-grid/
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://ant.design/components/modal#api
// *Additional Reference*: https://ant.design/components/form#api
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/ipc-renderer

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Spin, Modal, Form, Input as AntInput, Select, message, DatePicker, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ComponentHeader from './ComponentHeader.js';
import TableModuleV2 from './TableModuleV2.js';
import moment from 'moment';
// import '../styles/global.css';
import '../styles/TableModule.css';
// import '../styles/Components.css';

const { Option } = Select;
const { TabPane } = Tabs;

const ConstraintsV2 = ({ selectedProject, headerContent }) => {
  const [rowData, setRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConstraintModalVisible, setIsConstraintModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingConstraint, setEditingConstraint] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
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
          id: item.id || `${item.category}-${index}`,
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

  // Group data by category for Open Constraints (tree data structure)
  const openConstraintsData = useMemo(() => {
    const categoryMap = {};
    rowData
      .filter((item) => item.completionStatus !== 'Closed')
      .forEach((item) => {
        if (!categoryMap[item.category]) {
          categoryMap[item.category] = {
            id: `${item.category}-root`,
            category: item.category,
            isCategory: true,
            children: [],
          };
        }
        categoryMap[item.category].children.push({ ...item, isCategory: false });
      });
    return Object.values(categoryMap).sort((a, b) => {
      const numA = parseInt(a.category.split('.')[0]);
      const numB = parseInt(b.category.split('.')[0]);
      return numA - numB;
    });
  }, [rowData]);

  // Filter and sort Closed Constraints
  const closedConstraints = useMemo(() => {
    return rowData
      .filter((item) => item.completionStatus === 'Closed')
      .sort((a, b) => {
        const dateA = a.dateClosed ? moment(a.dateClosed, 'MM/DD/YYYY') : moment(0);
        const dateB = b.dateClosed ? moment(b.dateClosed, 'MM/DD/YYYY') : moment(0);
        return dateB - dateA;
      });
  }, [rowData]);

  // AG Grid tree data configuration
  const getDataPath = useCallback((data) => {
    return data.isCategory ? [data.category] : [data.category, data.id];
  }, []);

  const autoGroupColumnDef = useMemo(() => ({
    headerName: 'Category / No.',
    field: 'no',
    width: 150,
    cellRendererParams: {
      suppressCount: true,
    },
    pinned: 'left',
  }), []);

  // Custom cell renderers with null checks
  const CompletionStatusCellRenderer = (params) => {
    if (!params || params.value === undefined) return '-';
    const value = params.value || 'Identified';
    const color = {
      Closed: 'green',
      'In Progress': '#faad14',
      Pending: '#1890ff',
      Identified: 'red',
    }[value] || 'red';
    return (
      <span style={{ color, fontWeight: value === 'Closed' ? 'bold' : 'normal' }}>
        {value}
      </span>
    );
  };

  const DateClosedCellRenderer = (params) => {
    if (!params || !params.value) return '';
    return moment(params.value).format('MM/DD/YYYY');
  };

  // Column definitions
  const columns = useMemo(
    () => [
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
      { field: 'dateClosed', headerName: 'Date Closed', width: 120, cellRenderer: DateClosedCellRenderer },
      { field: 'comments', headerName: 'Comments', width: 400, cellStyle: { whiteSpace: 'normal' } },
    ],
    []
  );

  // Context menu for edit/delete actions with null check
  const getContextMenuItems = useCallback(
    (params) => {
      if (!params || !params.node || !params.node.data || params.node.data.isCategory) {
        return ['copy', 'paste'];
      }
      return [
        {
          name: 'Edit',
          action: () => {
            const data = params.node.data;
            setEditingConstraint(data);
            form.setFieldsValue({
              category: data.category,
              description: data.description,
              dateIdentified: data.dateIdentified
                ? moment(data.dateIdentified, 'MM/DD/YYYY')
                : null,
              reference: data.reference,
              closureDocument: data.closureDocument,
              assigned: data.assigned,
              bic: data.bic,
              dueDate: data.dueDate ? moment(data.dueDate, 'MM/DD/YYYY') : null,
              completionStatus: data.completionStatus || 'Identified',
              dateClosed: data.dateClosed ? moment(data.dateClosed, 'MM/DD/YYYY') : null,
              comments: data.comments,
            });
            setIsConstraintModalVisible(true);
          },
        },
        {
          name: 'Delete',
          action: () => {
            setItemToDelete({ type: 'constraint', data: params.node.data });
            setIsDeleteModalVisible(true);
          },
        },
        'separator',
        'copy',
        'paste',
      ];
    },
    [form]
  );

  // Handle row click with try-catch and enhanced null check
  const handleRowClick = useCallback(
    (event) => {
      try {
        console.log('handleRowClick event:', event); // Debug log
        if (!event || !event.data || event.data.isCategory) {
          console.warn('Invalid row click event or category node:', event);
          return;
        }
        const data = event.data;
        setEditingConstraint(data);
        form.setFieldsValue({
          category: data.category,
          description: data.description,
          dateIdentified: data.dateIdentified ? moment(data.dateIdentified, 'MM/DD/YYYY') : null,
          reference: data.reference,
          closureDocument: data.closureDocument,
          assigned: data.assigned,
          bic: data.bic,
          dueDate: data.dueDate ? moment(data.dueDate, 'MM/DD/YYYY') : null,
          completionStatus: data.completionStatus || 'Identified',
          dateClosed: data.dateClosed ? moment(data.dateClosed, 'MM/DD/YYYY') : null,
          comments: data.comments,
        });
        setIsConstraintModalVisible(true);
      } catch (error) {
        console.error('Error in handleRowClick:', error);
        message.error('An error occurred while handling row click.');
      }
    },
    [form]
  );

  // Handle create or update constraint
  const handleCreateOrUpdateConstraint = async (values) => {
    const category = values.category;
    const categoryData = openConstraintsData.find((cat) => cat.category === category)?.children || [];
    const newConstraint = {
      id: editingConstraint ? editingConstraint.id : `${category}-${Date.now()}`,
      no: editingConstraint
        ? editingConstraint.no
        : categoryData.length > 0
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
      dateClosed:
        values.completionStatus === 'Closed'
          ? values.dateClosed
            ? values.dateClosed.format('MM/DD/YYYY')
            : moment().format('MM/DD/YYYY')
          : '',
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
      setRowData(
        updatedData.map((item, index) => ({
          ...item,
          id: item.id || `${item.category}-${index}`,
          daysElapsed: item.dateIdentified
            ? moment().diff(moment(item.dateIdentified, 'MM/DD/YYYY'), 'days')
            : '',
        }))
      );
    } catch (error) {
      message.error(editingConstraint ? 'Failed to update constraint.' : 'Failed to create constraint.');
      console.error('Error saving constraint:', error);
    }
    setIsConstraintModalVisible(false);
    setEditingConstraint(null);
    form.resetFields();
  };

  // Handle create or update category
  const handleCreateOrUpdateCategory = async (values) => {
    const newCategoryNumber = editingCategory
      ? editingCategory.number
      : openConstraintsData.length + 1;
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
        updatedData = rowData.map((item) =>
          item.category === editingCategory.name ? { ...item, category: newCategory } : item
        );
        await Promise.all(updatedData.map((item) => window.electronAPI.updateConstraint(item)));
        message.success('Category updated successfully!');
      } else {
        updatedData = await window.electronAPI.addConstraint(newCategoryEntry);
        message.success('Category created successfully!');
      }
      setRowData(
        updatedData.map((item, index) => ({
          ...item,
          id: item.id || `${item.category}-${index}`,
          daysElapsed: item.dateIdentified
            ? moment().diff(moment(item.dateIdentified, 'MM/DD/YYYY'), 'days')
            : '',
        }))
      );
    } catch (error) {
      message.error(editingCategory ? 'Failed to update category.' : 'Failed to create category.');
      console.error('Error saving category:', error);
    }
    setIsCategoryModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  // Handle delete (constraint or category)
  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'constraint') {
        const updatedData = await window.electronAPI.deleteConstraint(itemToDelete.data.id);
        setRowData(
          updatedData.map((item, index) => ({
            ...item,
            id: item.id || `${item.category}-${index}`,
            daysElapsed: item.dateIdentified
              ? moment().diff(moment(item.dateIdentified, 'MM/DD/YYYY'), 'days')
              : '',
          }))
        );
        message.success('Constraint deleted successfully!');
      } else {
        const updatedData = rowData.filter((item) => item.category !== itemToDelete.data.name);
        await Promise.all(updatedData.map((item) => window.electronAPI.updateConstraint(item)));
        setRowData(
          updatedData.map((item, index) => ({
            ...item,
            id: item.id || `${item.category}-${index}`,
            daysElapsed: item.dateIdentified
              ? moment().diff(moment(item.dateIdentified, 'MM/DD/YYYY'), 'days')
              : '',
          }))
        );
        message.success('Category and its constraints deleted successfully!');
      }
    } catch (error) {
      message.error(`Failed to delete ${itemToDelete.type}.`);
      console.error(`Error deleting ${itemToDelete.type}:`, error);
    }
    setIsDeleteModalVisible(false);
    setItemToDelete(null);
  };

  // Header actions with create button
  const headerActions = (
    <button
      style={{
        backgroundColor: 'var(--hb-orange)',
        borderColor: 'var(--hb-orange)',
        color: '#fff',
        padding: '4px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
      onClick={() => {
        setEditingConstraint(null);
        form.resetFields();
        setIsConstraintModalVisible(true);
      }}
    >
      <PlusOutlined /> Create Constraint
    </button>
  );

  return (
    <div className="constraints-container" style={{ height: '100%', overflowY: 'auto' }}>
      <ComponentHeader title={headerContent.title} actions={headerActions} />
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="constraints-tabs">
        <TabPane tab="Open Constraints" key="open">
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin />
            </div>
          ) : (
            <TableModuleV2
              data={openConstraintsData}
              columns={columns}
              treeData={true}
              getDataPath={getDataPath}
              autoGroupColumnDef={autoGroupColumnDef}
              enableFiltering={true}
              enableSearch={true}
              autoSizeOnLoad={true}
              agGridProps={{
                groupDefaultExpanded: 1,
                getContextMenuItems,
                onRowClicked: handleRowClick,
              }}
            />
          )}
        </TabPane>
        <TabPane tab="Closed Constraints" key="closed">
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin />
            </div>
          ) : (
            <TableModuleV2
              data={closedConstraints}
              columns={columns}
              enableFiltering={true}
              enableSearch={true}
              autoSizeOnLoad={true}
              agGridProps={{
                getContextMenuItems,
                onRowClicked: handleRowClick,
              }}
            />
          )}
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
      >
        <Form
          form={form} // Explicitly connect form instance
          onFinish={handleCreateOrUpdateConstraint}
          layout="vertical"
        >
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select a category">
              {openConstraintsData.map((cat) => (
                <Option key={cat.category} value={cat.category}>
                  {cat.category}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item name="dateIdentified" label="Date Identified">
            <DatePicker format="MM/DD/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date">
            <DatePicker format="MM/DD/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="completionStatus" label="Completion Status">
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
              {['Identified', 'Pending', 'In Progress', 'Closed'].map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="dateClosed"
            label="Date Closed"
            dependencies={['completionStatus']}
            rules={[
              {
                validator: (_, value) => {
                  const status = form.getFieldValue('completionStatus');
                  if (status === 'Closed' && !value) {
                    return Promise.reject(new Error('Date Closed is required when status is Closed'));
                  }
                  if (value && moment(value).isAfter(moment(), 'day')) {
                    return Promise.reject(new Error('Date Closed cannot be in the future'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              format="MM/DD/YYYY"
              style={{ width: '100%' }}
              disabled={form.getFieldValue('completionStatus') !== 'Closed'}
            />
          </Form.Item>
          <Form.Item name="assigned" label="Assigned">
            <AntInput />
          </Form.Item>
          <Form.Item name="bic" label="B.I.C.">
            <AntInput />
          </Form.Item>
          <Form.Item name="reference" label="Reference">
            <AntInput />
          </Form.Item>
          <Form.Item
            name="closureDocument"
            label="Closure Document"
            dependencies={['completionStatus']}
            rules={[
              {
                validator: (_, value) => {
                  const status = form.getFieldValue('completionStatus');
                  if (status === 'Closed' && !value) {
                    return Promise.reject(
                      new Error('Closure Document is required when status is Closed')
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item name="comments" label="Comments">
            <AntInput.TextArea rows={2} />
          </Form.Item>
          <Form.Item>
            <button type="submit" style={{ marginRight: '8px' }}>
              {editingConstraint ? 'Update' : 'Create'}
            </button>
            <button
              onClick={() => {
                setIsConstraintModalVisible(false);
                setEditingConstraint(null);
                form.resetFields();
              }}
            >
              Cancel
            </button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Delete Confirmation */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setItemToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete{' '}
          {itemToDelete?.type === 'constraint'
            ? `this constraint: ${itemToDelete.data?.description || ''}`
            : `the category ${itemToDelete.data?.name || ''} and all its constraints`}
          ?
        </p>
      </Modal>
    </div>
  );
};

ConstraintsV2.propTypes = {
  selectedProject: PropTypes.shape({
    projectNumber: PropTypes.string,
    name: PropTypes.string,
  }),
  headerContent: PropTypes.shape({
    title: PropTypes.node.isRequired,
    actions: PropTypes.node,
  }).isRequired,
};

ConstraintsV2.defaultProps = {
  selectedProject: null,
};

export default ConstraintsV2;