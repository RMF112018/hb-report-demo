// src/renderer/components/Staffing.js
// Staffing component for HB Report, displaying activities in a TableModule, a Gantt chart, and staffing needs in a single view
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://ant.design/components/layout#api
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/
// *Additional Reference*: https://ant.design/components/modal#api
// *Additional Reference*: https://ant.design/components/form#api
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/ipc-renderer
// *Additional Reference*: https://ant.design/components/tag#api
// *Additional Reference*: https://www.npmjs.com/package/react-google-charts

import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Space, Spin, Button, Modal, Form, Input as AntInput, Select, message, Row, Col, Tag, Flex, DatePicker, Table } from 'antd';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import ComponentHeader from './ComponentHeader.js';
import TableModule from './TableModule.js';
import StaffingGantt from '../utils/StaffingGantt.js';
import staffingService from '../services/staffingService.js';
import dayjs from 'dayjs';
import '../styles/global.css';
import '../styles/Components.css';

const { Option } = Select;

/**
 * Staffing component for managing and visualizing staffing needs over a project timeline
 * @param {Object} props - Component props
 * @param {Object} props.selectedProject - The currently selected project
 * @param {Object} props.headerContent - Header content passed from App.js
 * @returns {JSX.Element} Staffing schedule component
 */
const Staffing = ({ selectedProject, headerContent }) => {
  const [activities, setActivities] = useState([]);
  const [roles, setRoles] = useState([]);
  const [staffingNeeds, setStaffingNeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [view, setView] = useState('table');
  const [activeRoles, setActiveRoles] = useState([]);
  const [roleFilters, setRoleFilters] = useState({});

  // State for resizable panes
  const [leftPaneWidth, setLeftPaneWidth] = useState(40); // Percentage width of the activities table
  const [ganttSectionHeight, setGanttSectionHeight] = useState(40); // Percentage height of the Gantt chart section

  const [form] = Form.useForm();
  const containerRef = useRef(null);
  const horizontalSplitterRef = useRef(null);
  const verticalSplitterRef = useRef(null);

  // Define the timeline (e.g., March 2025 to December 2027)
  const timeline = useMemo(() => {
    const start = new Date('2025-03-01');
    const end = new Date('2027-12-31');
    const months = [];
    let current = new Date(start);
    while (current <= end) {
      months.push({
        year: current.getFullYear(),
        month: current.toLocaleString('default', { month: 'short' }),
        key: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`,
      });
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await staffingService.getStaffingTestData();
        setActivities(data.activities);
        setRoles(data.roles);
        setStaffingNeeds(data.staffingNeeds);
        setActiveRoles(data.roles.map(role => role.key));
      } catch (error) {
        message.error('Failed to load staffing data.');
        console.error('Error fetching staffing data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Group activities by category for TableModule.js with expandable rows
  const groupedActivities = useMemo(() => {
    const grouped = activities.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, children], index) => ({
      id: `category-${category}`,
      name: category,
      children: children.map((child, childIndex) => ({
        id: child.id,
        name: child.name,
        startMonth: child.startMonth,
        endMonth: child.endMonth,
      })),
    }));
  }, [activities]);

  // Filter activities based on role filters (for staffing needs)
  const filteredActivities = useMemo(() => {
    return groupedActivities.map(group => ({
      ...group,
      children: group.children.filter(item => {
        if (Object.keys(roleFilters).length === 0) return true;
        return staffingNeeds.some(need => 
          need.activityId === item.id && 
          Object.keys(roleFilters).some(role => need.role === role && need.count > 0)
        );
      }),
    })).filter(group => group.children.length > 0);
  }, [groupedActivities, roleFilters, staffingNeeds]);

  // Flatten activities for staffing needs table
  const flatActivities = useMemo(() => {
    return filteredActivities.reduce((acc, group) => {
      acc.push(...group.children);
      return acc;
    }, []);
  }, [filteredActivities]);

  // Prepare data for staffing needs table
  const staffingData = useMemo(() => {
    const result = [];
    const filteredRoles = roles.filter(role => activeRoles.includes(role.key));

    // Add roles as rows
    result.push(...filteredRoles.map(role => ({
      id: `role-${role.key}`,
      type: 'role',
      name: role.label,
      roleKey: role.key,
    })));

    return result;
  }, [roles, activeRoles]);

  const activityColumns = [
    {
      field: 'name',
      headerName: 'Activity',
      minWidth: 300,
    },
    {
      field: 'startMonth',
      headerName: 'Start Date',
      minWidth: 150,
      cellRenderer: (params) => {
        const date = params.data.startMonth ? dayjs(`${params.data.startMonth}-01`) : null;
        const handleChange = async (date) => {
          if (!date) return;
          const newStartMonth = date.format('YYYY-MM');
          const endMonth = params.data.endMonth;
          if (endMonth && dayjs(`${newStartMonth}-01`).isAfter(dayjs(`${endMonth}-01`))) {
            message.error('Start date must be before end date.');
            return;
          }
          const updatedActivity = { ...params.data, startMonth: newStartMonth };
          try {
            const updatedData = await staffingService.updateStaffingActivity(updatedActivity);
            setActivities(updatedData);
            message.success(`Updated start date for "${params.data.name}".`);
          } catch (error) {
            message.error('Failed to update start date.');
            console.error('Error updating start date:', error);
          }
        };
        return (
          <DatePicker
            picker="month"
            value={date}
            onChange={handleChange}
            format="MMM YYYY"
            style={{ width: '100%' }}
          />
        );
      },
    },
    {
      field: 'endMonth',
      headerName: 'End Date',
      minWidth: 150,
      cellRenderer: (params) => {
        const date = params.data.endMonth ? dayjs(`${params.data.endMonth}-01`) : null;
        const handleChange = async (date) => {
          if (!date) return;
          const newEndMonth = date.format('YYYY-MM');
          const startMonth = params.data.startMonth;
          if (startMonth && dayjs(`${newEndMonth}-01`).isBefore(dayjs(`${startMonth}-01`))) {
            message.error('End date must be after start date.');
            return;
          }
          const updatedActivity = { ...params.data, endMonth: newEndMonth };
          try {
            const updatedData = await staffingService.updateStaffingActivity(updatedActivity);
            setActivities(updatedData);
            message.success(`Updated end date for "${params.data.name}".`);
          } catch (error) {
            message.error('Failed to update end date.');
            console.error('Error updating end date:', error);
          }
        };
        return (
          <DatePicker
            picker="month"
            value={date}
            onChange={handleChange}
            format="MMM YYYY"
            style={{ width: '100%' }}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 150,
      cellRenderer: (params) => {
        if (params.data.children) return null;
        return (
          <Space>
            <Button type="link" onClick={() => handleEditActivity(params.data)}>Edit</Button>
            <Button type="link" danger onClick={() => handleDeleteActivity(params.data)}>Delete</Button>
          </Space>
        );
      },
    },
  ];

  const staffingColumns = [
    { 
      field: 'name', 
      headerName: 'Role', 
      minWidth: 300, 
      pinned: 'left', 
      cellStyle: params => ({
        backgroundColor: '#f5f5f5',
      }) 
    },
    ...timeline.map(month => ({
      field: month.key,
      headerName: `${month.month} ${month.year}`,
      minWidth: 80,
      cellRenderer: params => {
        const monthKey = params.colDef.field;
        const role = params.data.roleKey;
        const need = staffingNeeds.find(
          n => n.activityId === params.data.id && n.role === role && n.month === monthKey
        );
        const count = need ? need.count : 0;

        const handleChange = async (newCount) => {
          const staffingNeed = {
            id: need ? need.id : `${params.data.id}-${role}-${monthKey}`,
            activityId: params.data.id,
            role,
            month: monthKey,
            count: parseInt(newCount) || 0,
          };
          try {
            const updatedData = await staffingService.updateStaffingNeeds(staffingNeed);
            setStaffingNeeds(updatedData);
            message.success(`Updated staffing for ${role} in ${monthKey}.`);
          } catch (error) {
            message.error('Failed to update staffing needs.');
            console.error('Error updating staffing needs:', error);
          }
        };

        return (
          <AntInput
            type="number"
            min={0}
            value={count}
            onChange={(e) => handleChange(e.target.value)}
            style={{ width: '100%', height: '100%', textAlign: 'center' }}
          />
        );
      },
      cellStyle: params => ({
        backgroundColor: '#f5f5f5',
      }),
    })),
  ];

  // Handle horizontal splitter drag (between activities table and Gantt chart)
  useEffect(() => {
    const splitter = horizontalSplitterRef.current;
    const container = containerRef.current;

    let isDragging = false;
    let startX = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const containerRect = container.getBoundingClientRect();
      const newX = e.clientX - containerRect.left;
      const newWidth = (newX / containerRect.width) * 100;
      setLeftPaneWidth(Math.max(20, Math.min(80, newWidth))); // Limit between 20% and 80%
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

  // Handle vertical splitter drag (between Gantt chart section and Staffing Needs table)
  useEffect(() => {
    const splitter = verticalSplitterRef.current;
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
      setGanttSectionHeight(Math.max(20, Math.min(80, newHeight))); // Limit between 20% and 80%
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

  const handleCreate = () => {
    setEditingActivity(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCreateActivity = async (values) => {
    const newActivity = {
      id: editingActivity ? editingActivity.id : `act-${Date.now()}`,
      category: values.category,
      name: values.name,
      startMonth: values.startMonth ? values.startMonth.format('YYYY-MM') : null,
      endMonth: values.endMonth ? values.endMonth.format('YYYY-MM') : null,
    };

    if (!newActivity.startMonth || !newActivity.endMonth) {
      message.error('Both start and end dates are required.');
      return;
    }

    if (dayjs(`${newActivity.endMonth}-01`).isBefore(dayjs(`${newActivity.startMonth}-01`))) {
      message.error('End date must be after start date.');
      return;
    }

    try {
      const updatedData = editingActivity
        ? await staffingService.updateStaffingActivity(newActivity)
        : await staffingService.addStaffingActivity(newActivity);
      setActivities(updatedData);
      message.success('Activity created successfully!');
    } catch (error) {
      message.error('Failed to create activity.');
      console.error('Error creating activity:', error);
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeleteActivity = async (record) => {
    setActivityToDelete(record);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!activityToDelete) return;
    try {
      const updatedData = await staffingService.deleteStaffingActivity(activityToDelete.id);
      setActivities(updatedData.activities);
      setStaffingNeeds(updatedData.staffingNeeds);
      message.success('Activity deleted successfully!');
    } catch (error) {
      message.error('Failed to delete activity.');
      console.error('Error deleting activity:', error);
    }
    setIsDeleteModalVisible(false);
    setActivityToDelete(null);
  };

  const handleEditActivity = (record) => {
    setEditingActivity(record);
    form.setFieldsValue({
      category: record.category,
      name: record.name,
      startMonth: record.startMonth ? dayjs(`${record.startMonth}-01`) : null,
      endMonth: record.endMonth ? dayjs(`${record.endMonth}-01`) : null,
    });
    setIsModalVisible(true);
  };

  const handleExport = (roleKey) => {
    let dataToExport = [];
    if (roleKey === 'all') {
      dataToExport = staffingData;
    } else {
      dataToExport = staffingData.filter(item => item.roleKey === roleKey);
    }

    const ganttHeaders = ['Activity', 'Start Date', 'End Date'];
    const staffingHeaders = staffingColumns.map(col => col.headerName);
    const csvRows = [
      ['Gantt Chart'],
      ganttHeaders.join(','),
      ...flatActivities.map(row => [
        `"${row.name || ''}"`,
        `"${row.startMonth || ''}"`,
        `"${row.endMonth || ''}"`,
      ].join(',')),
      [''],
      ['Staffing Needs'],
      staffingHeaders.join(','),
    ];

    dataToExport.forEach(row => {
      const values = staffingHeaders.map(header => {
        const field = staffingColumns.find(col => col.headerName === header)?.field;
        if (field === 'name') return `"${row[field] || ''}"`;
        const need = staffingNeeds.find(n => n.activityId === row.id && n.role === row.roleKey && n.month === field);
        return `"${need ? need.count : 0}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `staffing-${roleKey === 'all' ? 'all' : roleKey}.csv`;
    link.click();
  };

  const renderCombinedView = () => (
    <div ref={containerRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <div className="staffing-role-filters" style={{ marginBottom: '8px', padding: '8px' }}>
            <span style={{ marginRight: '8px', fontWeight: 500, color: 'var(--hb-blue)' }}>Filter by Role:</span>
            <Flex wrap="wrap" gap="small">
              {roles.map(role => (
                <Tag
                  key={role.key}
                  color={roleFilters[role.key] ? 'blue' : undefined}
                  style={{ color: roleFilters[role.key] ? '#fff' : undefined }}
                  onClick={() => {
                    setRoleFilters(prev => ({
                      ...prev,
                      [role.key]: prev[role.key] ? '' : role.key,
                    }));
                  }}
                  className="ant-tag-checkable"
                >
                  {role.label}
                </Tag>
              ))}
            </Flex>
          </div>
          <div className="gantt-section" style={{ height: `${ganttSectionHeight}%`, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
            <div style={{ width: `${leftPaneWidth}%`, border: '1px solid #e8e8e8', borderRadius: '4px', padding: '4px', overflow: 'auto' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--hb-blue)', marginBottom: '4px', paddingLeft: '4px' }}>
                Gantt Chart
              </h3>
              <TableModule
                data={filteredActivities}
                columns={activityColumns}
                enableSorting={true}
                enableFiltering={true}
                enablePagination={false}
                className="activity-table"
                loading={isLoading}
                enableFullscreen={false}
                rowClassRules={{
                  'category-row': params => params.data.children,
                }}
                domLayout="autoHeight"
              />
            </div>
            <div ref={horizontalSplitterRef} className="splitter-horizontal" style={{ width: '4px', background: '#e8e8e8', cursor: 'col-resize' }} />
            <div style={{ width: `${100 - leftPaneWidth}%`, overflow: 'auto' }}>
              <StaffingGantt activities={activities} />
            </div>
          </div>
          <div ref={verticalSplitterRef} className="splitter-vertical" style={{ height: '4px', background: '#e8e8e8', cursor: 'row-resize' }} />
          <div className="staffing-needs-section" style={{ height: `${100 - ganttSectionHeight}%`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--hb-blue)', marginBottom: '4px', marginTop: '0', paddingLeft: '12px' }}>
              Staffing Needs
            </h3>
            <div style={{ flex: '1 1 auto', border: '1px solid #e8e8e8', borderRadius: '4px', padding: '4px', overflow: 'auto' }}>
              <TableModule
                data={staffingData}
                columns={staffingColumns}
                enableSorting={true}
                enableFiltering={true}
                enablePagination={false}
                className="staffing-table"
                loading={isLoading}
                enableFullscreen={false}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderSettingsView = () => (
    <div style={{ padding: '16px', flex: 1 }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: '24px' }}>
        Staffing Schedule Settings
      </h2>
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
          Assigned Roles
        </h3>
        <List
          dataSource={roles}
          renderItem={role => (
            <List.Item>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>{role.label}</span>
                <Radio.Group
                  value={activeRoles.includes(role.key)}
                  onChange={(e) => {
                    if (e.target.value) {
                      setActiveRoles(prev => [...prev, role.key]);
                    } else {
                      setActiveRoles(prev => prev.filter(r => r !== role.key));
                    }
                  }}
                >
                  <Radio value={true}>Enabled</Radio>
                  <Radio value={false}>Disabled</Radio>
                </Radio.Group>
              </Space>
            </List.Item>
          )}
        />
      </div>
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
          Project Activities
        </h3>
        <List
          dataSource={activities}
          renderItem={item => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => handleEditActivity(item)}>Edit</Button>,
                <Button
                  type="link"
                  onClick={() => {
                    setActivityToDelete(item);
                    setIsDeleteModalVisible(true);
                  }}
                  danger
                >
                  Delete
                </Button>,
              ]}
            >
              {item.name} ({item.startMonth} to {item.endMonth})
            </List.Item>
          )}
        />
      </div>
    </div>
  );

  return (
    <div className="staffing-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
      <ComponentHeader
        title={headerContent.title}
        actions={headerContent.actions}
        createOptions={[{ key: 'activity', label: 'Create Activity' }]}
        onCreateClick={handleCreate}
        onSettingsClick={() => setView(view === 'table' ? 'settings' : 'table')}
        onExport={handleExport}
        exportRoleOptions={roles}
      />
      {view === 'table' ? renderCombinedView() : renderSettingsView()}

      <Modal
        title={editingActivity ? 'Edit Activity' : 'Create Activity'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingActivity(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateActivity}
          layout="vertical"
          initialValues={editingActivity ? {
            category: editingActivity.category,
            name: editingActivity.name,
            startMonth: editingActivity.startMonth ? dayjs(`${editingActivity.startMonth}-01`) : null,
            endMonth: editingActivity.endMonth ? dayjs(`${editingActivity.endMonth}-01`) : null,
          } : {}}
        >
          <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please enter a category' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item name="name" label="Activity Name" rules={[{ required: true, message: 'Please enter an activity name' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item name="startMonth" label="Start Month" rules={[{ required: true, message: 'Please select a start month' }]}>
            <DatePicker picker="month" format="MMM YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="endMonth" label="End Month" rules={[{ required: true, message: 'Please select an end month' }]}>
            <DatePicker picker="month" format="MMM YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingActivity ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingActivity(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setActivityToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this activity: <strong>{activityToDelete?.name}</strong>?</p>
      </Modal>
    </div>
  );
};

Staffing.propTypes = {
  selectedProject: PropTypes.shape({
    projectNumber: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  headerContent: PropTypes.shape({
    title: PropTypes.node.isRequired,
    actions: PropTypes.node,
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

Staffing.defaultProps = {
  selectedProject: null,
};

export default Staffing;