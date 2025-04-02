// src/renderer/components/Manpower.js
// Manpower component for HB Report, displaying and visualizing manpower logs with month-to-month trends
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://ant.design/components/layout#api
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/
// *Additional Reference*: https://ant.design/components/modal#api
// *Additional Reference*: https://ant.design/components/form#api
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/ipc-renderer
// *Additional Reference*: https://ant.design/components/date-picker#api
// *Additional Reference*: https://chartjs.org/docs/latest/

import React, { useState, useEffect, useMemo } from 'react';
import { Space, Spin, Button, Modal, Form, Input as AntInput, Select, message, DatePicker, Row, Col } from 'antd';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import ComponentHeader from './ComponentHeader.js';
import TableModule from './TableModule.js';
import Chart from 'chart.js/auto';
import '../styles/global.css';
import '../styles/Components.css';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * Manpower component for tracking and visualizing manpower logs with month-to-month trends
 * @param {Object} props - Component props
 * @param {Object} props.selectedProject - The currently selected project
 * @param {Object} props.headerContent - Header content passed from App.js
 * @returns {JSX.Element} Manpower tracking component
 */
const Manpower = ({ selectedProject, headerContent }) => {
  const [manpowerData, setManpowerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState('all');
  const [form] = Form.useForm();

  // Helper function to generate random colors for chart lines (moved up to ensure availability)
  const getRandomColor = () => {
    try {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    } catch (error) {
      console.error('Error generating random color:', error);
      return '#000000'; // Fallback color (black) if generation fails
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await window.electronAPI.getManpowerTestData();
        setManpowerData(data);
      } catch (error) {
        message.error('Failed to load manpower data.');
        console.error('Error fetching manpower data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter data based on date range and contractor
  const filteredData = useMemo(() => {
    return manpowerData.filter(entry => {
      const entryDate = moment(entry.date, 'YYYY-MM-DD');
      const withinDateRange =
        dateRange.length === 0 ||
        (entryDate.isSameOrAfter(dateRange[0], 'day') && entryDate.isSameOrBefore(dateRange[1], 'day'));
      const matchesContractor = selectedContractor === 'all' || entry.contractor === selectedContractor;
      return withinDateRange && matchesContractor;
    });
  }, [manpowerData, dateRange, selectedContractor]);

  // Extract unique contractors for filtering
  const contractors = useMemo(() => {
    const uniqueContractors = [...new Set(manpowerData.map(entry => entry.contractor))].sort();
    return [{ key: 'all', label: 'All Contractors' }, ...uniqueContractors.map(c => ({ key: c, label: c }))];
  }, [manpowerData]);

  // Prepare data for visualization (month-to-month trends)
  const chartData = useMemo(() => {
    const monthlyData = {};
    const months = [];
    manpowerData.forEach(entry => {
      const date = moment(entry.date, 'YYYY-MM-DD');
      const monthKey = date.format('YYYY-MM');
      if (!months.includes(monthKey)) months.push(monthKey);
      if (!monthlyData[monthKey]) monthlyData[monthKey] = {};
      if (!monthlyData[monthKey][entry.contractor]) monthlyData[monthKey][entry.contractor] = 0;
      monthlyData[monthKey][entry.contractor] += entry.workers;
    });

    months.sort();
    const datasets = contractors
      .filter(c => c.key !== 'all')
      .map(contractor => {
        const data = months.map(month => monthlyData[month]?.[contractor.key] || 0);
        return {
          label: contractor.label,
          data,
          borderColor: getRandomColor(), // Now guaranteed to be defined
          fill: false,
        };
      });

    return {
      labels: months.map(m => moment(m, 'YYYY-MM').format('MMM YYYY')),
      datasets,
    };
  }, [manpowerData, contractors]);

  // Render the chart
  useEffect(() => {
    const ctx = document.getElementById('manpowerChart')?.getContext('2d');
    if (!ctx) {
      console.warn('Chart canvas context not found.');
      return;
    }

    const chart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Number of Workers' },
          },
          x: {
            title: { display: true, text: 'Month' },
          },
        },
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Manpower Trends Over Time' },
        },
      },
    });

    return () => chart.destroy();
  }, [chartData]);

  const columns = [
    { field: 'date', headerName: 'Date', minWidth: 120, valueFormatter: params => moment(params.value).format('MM/DD/YYYY') },
    { field: 'contractor', headerName: 'Contractor', minWidth: 200 },
    { field: 'workers', headerName: '# Workers', minWidth: 100 },
    { field: 'hours', headerName: '# Hours', minWidth: 100 },
    { field: 'location', headerName: 'Location', minWidth: 250 },
    { field: 'notes', headerName: 'Notes', minWidth: 300 },
  ];

  const handleCreate = () => {
    setEditingEntry(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    form.setFieldsValue({
      date: moment(entry.date, 'YYYY-MM-DD'),
      contractor: entry.contractor,
      workers: entry.workers,
      hours: entry.hours,
      location: entry.location,
      notes: entry.notes,
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    const newEntry = {
      id: editingEntry ? editingEntry.id : `manpower-${Date.now()}`,
      date: values.date.format('YYYY-MM-DD'),
      contractor: values.contractor,
      workers: parseInt(values.workers, 10),
      hours: parseInt(values.hours, 10),
      location: values.location,
      notes: values.notes,
    };

    try {
      if (editingEntry) {
        const updatedData = await window.electronAPI.updateManpower(newEntry);
        setManpowerData(updatedData);
        message.success('Manpower entry updated successfully!');
      } else {
        const updatedData = await window.electronAPI.addManpower(newEntry);
        setManpowerData(updatedData);
        message.success('Manpower entry created successfully!');
      }
    } catch (error) {
      message.error('Failed to save manpower entry.');
      console.error('Error saving manpower entry:', error);
    }

    setIsModalVisible(false);
    setEditingEntry(null);
    form.resetFields();
  };

  const handleDelete = async (entry) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete the manpower entry for ${entry.contractor} on ${entry.date}?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const updatedData = await window.electronAPI.deleteManpower(entry.id);
          setManpowerData(updatedData);
          message.success('Manpower entry deleted successfully!');
        } catch (error) {
          message.error('Failed to delete manpower entry.');
          console.error('Error deleting manpower entry:', error);
        }
      },
    });
  };

  const handleExport = (format) => {
    const headers = columns.map(col => col.headerName);
    const csvRows = [headers.join(',')];
    filteredData.forEach(row => {
      const values = columns.map(col => {
        let value = row[col.field];
        if (col.field === 'date') value = moment(value).format('MM/DD/YYYY');
        return `"${value || ''}"`;
      });
      csvRows.push(values.join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `manpower-${moment().format('YYYYMMDD')}.csv`;
    link.click();
  };

  return (
    <div className="manpower-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', padding: '16px' }}>
      <ComponentHeader
        title={headerContent.title}
        actions={
          <Space>
            <RangePicker
              value={dateRange}
              onChange={dates => setDateRange(dates || [])}
              style={{ width: 240 }}
            />
            <Select
              value={selectedContractor}
              onChange={setSelectedContractor}
              style={{ width: 200 }}
            >
              {contractors.map(c => (
                <Option key={c.key} value={c.key}>{c.label}</Option>
              ))}
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              style={{ backgroundColor: 'var(--hb-orange)', borderColor: 'var(--hb-orange)' }}
            >
              Create
            </Button>
            <Button onClick={() => handleExport('csv')}>
              Export <DownOutlined />
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]} style={{ flex: 1, overflowY: 'auto' }}>
        <Col span={24}>
          <div style={{ marginBottom: '24px', border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px', background: '#fff' }}>
            <canvas id="manpowerChart" style={{ maxHeight: '300px' }}></canvas>
          </div>
        </Col>
        <Col span={24}>
          {isLoading ? (
            <Spin />
          ) : (
            <TableModule
              data={filteredData}
              columns={columns}
              enableSorting={true}
              enableFiltering={true}
              enablePagination={true}
              pageSize={10}
              className="manpower-table"
              loading={isLoading}
              enableFullscreen={true}
              onRowClick={handleEdit}
              rowClassRules={{
                'ag-row-hover': () => true,
              }}
            />
          )}
        </Col>
      </Row>

      <Modal
        title={editingEntry ? 'Edit Manpower Entry' : 'Create Manpower Entry'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingEntry(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={editingEntry ? {
            date: moment(editingEntry.date, 'YYYY-MM-DD'),
            contractor: editingEntry.contractor,
            workers: editingEntry.workers,
            hours: editingEntry.hours,
            location: editingEntry.location,
            notes: editingEntry.notes,
          } : {}}
        >
          <div className="manpower-modal-row">
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select a date' }]}
              className="manpower-modal-field"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="contractor"
              label="Contractor"
              rules={[{ required: true, message: 'Please select a contractor' }]}
              className="manpower-modal-field"
            >
              <Select placeholder="Select contractor">
                {contractors.filter(c => c.key !== 'all').map(c => (
                  <Option key={c.key} value={c.key}>{c.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="manpower-modal-row">
            <Form.Item
              name="workers"
              label="# Workers"
              rules={[{ required: true, message: 'Please enter the number of workers' }]}
              className="manpower-modal-field"
            >
              <AntInput type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="hours"
              label="# Hours"
              rules={[{ required: true, message: 'Please enter the number of hours' }]}
              className="manpower-modal-field"
            >
              <AntInput type="number" min={0} />
            </Form.Item>
          </div>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please enter the location' }]}
            className="manpower-modal-field"
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="notes"
            label="Notes"
            className="manpower-modal-field"
          >
            <AntInput.TextArea rows={3} />
          </Form.Item>
          <Form.Item className="manpower-modal-actions">
            <Space>
              <Button type="primary" htmlType="submit">
                {editingEntry ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingEntry(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
              {editingEntry && (
                <Button danger onClick={() => handleDelete(editingEntry)}>
                  Delete
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Manpower;