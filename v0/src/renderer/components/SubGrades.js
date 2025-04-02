// src/renderer/components/SubGrades.js
// SubGrades component for HB Report, displaying a subcontractor performance score card with inline editing and reporting features
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://ant.design/components/layout#api
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/
// *Additional Reference*: https://ant.design/components/modal#api
// *Additional Reference*: https://ant.design/components/form#api
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/ipc-renderer
// *Additional Reference*: https://ant.design/components/tag#api

import React, { useState, useEffect } from 'react';
import { Space, Spin, Button, Modal, Form, Input as AntInput, Select, message, Tag, Tooltip, Typography } from 'antd';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import ComponentHeader from './ComponentHeader.js';
import TableModule from './TableModule.js';
import '../styles/global.css';
import '../styles/Components.css';

const { Option } = Select;
const { TextArea } = AntInput;
const { Text } = Typography;

/**
 * SubGrades component for managing and visualizing subcontractor performance metrics
 * @param {Object} props - Component props
 * @param {Object} props.selectedProject - The currently selected project
 * @param {Object} props.headerContent - Header content passed from App.js
 * @returns {JSX.Element} Subcontractor score card component
 */
const SubGrades = ({ selectedProject, headerContent }) => {
  const [subgradeData, setSubgradeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [subgradeToDelete, setSubgradeToDelete] = useState(null);
  const [editingSubgrade, setEditingSubgrade] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await window.electronAPI.getSubgradeData();
        setSubgradeData(data);
      } catch (error) {
        message.error('Failed to load subgrade data.');
        console.error('Error fetching subgrade data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const gradeColors = {
    A: 'green',
    B: 'gold',
    C: 'orange',
    D: 'red',
  };

  const recommendationColors = {
    Preferred: 'green',
    Consider: 'gold',
    Avoid: 'red',
  };

  const GradeCellRenderer = (params) => {
    const grade = params.data.grade || 'N/A';
    return (
      <Tag color={gradeColors[grade]} style={{ fontWeight: 500 }}>
        {grade}
      </Tag>
    );
  };

  const RecommendationCellRenderer = (params) => {
    const recommendation = params.data.recommendation || 'N/A';
    return (
      <Tag color={recommendationColors[recommendation]} style={{ fontWeight: 500 }}>
        {recommendation}
      </Tag>
    );
  };

  const PerformanceCommentsCellRenderer = (params) => {
    const comments = params.data.performanceComments || '';
    return (
      <Tooltip title={comments}>
        <Text ellipsis style={{ maxWidth: 200 }}>
          {comments}
        </Text>
      </Tooltip>
    );
  };

  const RiskFactorsCellRenderer = (params) => {
    const { ccpIssues, lowBidder } = params.data;
    return (
      <Space>
        {ccpIssues === 'Yes' && <Tag color="red">CCP Issues</Tag>}
        {lowBidder === 'Yes' && <Tag color="orange">Low Bidder</Tag>}
      </Space>
    );
  };

  const columns = [
    { field: 'csiDivision', headerName: 'CSI Division', maxWidth: 100, pinned: 'left' },
    { field: 'subcontractor', headerName: 'Subcontractor', minWidth: 200, pinned: 'left' },
    { field: 'grade', headerName: 'Grade', maxWidth: 100, cellRenderer: GradeCellRenderer },
    { field: 'performanceComments', headerName: 'Performance Comments', minWidth: 250, cellRenderer: PerformanceCommentsCellRenderer },
    { field: 'advice', headerName: 'Advice for Future', minWidth: 300 },
    { field: 'contractOriginal', headerName: 'Contract (Original)', minWidth: 150, valueFormatter: params => `$${params.value.toLocaleString()}` },
    { field: 'contractCurrent', headerName: 'Contract (Current)', minWidth: 150, valueFormatter: params => `$${params.value.toLocaleString()}` },
    { field: 'percentOfCurrentContract', headerName: '% of Current Contract', maxWidth: 150, valueFormatter: params => `${params.value}%` },
    { field: 'changeOrderImpact', headerName: 'Change Order Impact', maxWidth: 150, valueFormatter: params => `${params.value}%` },
    { field: 'financialComments', headerName: 'Financial Comments', minWidth: 200 },
    { field: 'projectRegion', headerName: 'Project/Region', minWidth: 150 },
    { field: 'previousBidder', headerName: 'Previous Bidder', maxWidth: 120 },
    { field: 'bidWon', headerName: 'Bid Won', maxWidth: 100 },
    { field: 'preQualified', headerName: 'Pre-Qualified', maxWidth: 120 },
    { field: 'ccpIssues', headerName: 'CCP Issues', maxWidth: 120 },
    { field: 'lowBidder', headerName: 'Low Bidder', maxWidth: 120 },
    { field: 'riskFactors', headerName: 'Risk Factors', minWidth: 150, cellRenderer: RiskFactorsCellRenderer },
    { field: 'lastReviewed', headerName: 'Last Reviewed', minWidth: 120 },
    { field: 'recommendation', headerName: 'Recommendation', maxWidth: 150, cellRenderer: RecommendationCellRenderer },
  ];

  const handleCreate = () => {
    setEditingSubgrade(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCreateSubgrade = async (values) => {
    const newSubgrade = {
      id: editingSubgrade ? editingSubgrade.id : `sub-${Date.now()}`,
      ...values,
      contractOriginal: parseFloat(values.contractOriginal) || 0,
      contractCurrent: parseFloat(values.contractCurrent) || 0,
      percentOfCurrentContract: parseFloat(values.percentOfCurrentContract) || 0,
      changeOrderImpact: parseFloat(values.changeOrderImpact) || 0,
      performanceTrend: editingSubgrade ? editingSubgrade.performanceTrend : [values.grade === 'A' ? 4 : values.grade === 'B' ? 3 : values.grade === 'C' ? 2 : 1],
    };

    try {
      const updatedData = editingSubgrade
        ? await window.electronAPI.updateSubgrade(new Subgrade)
        : await window.electronAPI.addSubgrade(newSubgrade);
      setSubgradeData(updatedData);
      message.success(editingSubgrade ? 'Subgrade updated successfully!' : 'Subgrade created successfully!');
    } catch (error) {
      message.error('Failed to save subgrade.');
      console.error('Error saving subgrade:', error);
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEditSubgrade = (subgrade) => {
    setEditingSubgrade(subgrade);
    form.setFieldsValue(subgrade);
    setIsModalVisible(true);
  };

  const handleDeleteSubgrade = async () => {
    if (!subgradeToDelete) return;
    try {
      const updatedData = await window.electronAPI.deleteSubgrade(subgradeToDelete.id);
      setSubgradeData(updatedData);
      message.success('Subgrade deleted successfully!');
    } catch (error) {
      message.error('Failed to delete subgrade.');
      console.error('Error deleting subgrade:', error);
    }
    setIsDeleteModalVisible(false);
    setSubgradeToDelete(null);
  };

  const handleExport = (subcontractor) => {
    let dataToExport = [];
    if (subcontractor === 'all') {
      dataToExport = subgradeData;
    } else {
      dataToExport = subgradeData.filter(item => item.subcontractor === subcontractor);
    }

    const headers = columns.map(col => col.headerName);
    const csvRows = [headers.join(',')];
    dataToExport.forEach(row => {
      const values = headers.map(header => {
        const field = columns.find(col => col.headerName === header)?.field;
        let value = row[field] || '';
        if (field === 'contractOriginal' || field === 'contractCurrent') {
          value = `$${value.toLocaleString()}`;
        } else if (field === 'percentOfCurrentContract' || field === 'changeOrderImpact') {
          value = `${value}%`;
        }
        return `"${value}"`;
      });
      csvRows.push(values.join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `subgrade-${subcontractor === 'all' ? 'all' : subcontractor}.csv`;
    link.click();
  };

  return (
    <div className="subgrades-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
      <ComponentHeader
        title={headerContent.title}
        actions={headerContent.actions}
        createOptions={[{ key: 'subgrade', label: 'Add Subcontractor Grade' }]}
        onCreateClick={handleCreate}
        onExport={handleExport}
        exportRoleOptions={subgradeData.map(item => ({ key: item.subcontractor, label: item.subcontractor }))}
      />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isLoading ? (
          <Spin />
        ) : (
          <TableModule
            data={subgradeData}
            columns={columns}
            enableSorting={true}
            enableFiltering={true}
            enablePagination={false}
            className="subgrades-table"
            loading={isLoading}
            enableFullscreen={false}
            onRowClick={handleEditSubgrade}
          />
        )}
      </div>

      <Modal
        title={editingSubgrade ? 'Edit Subcontractor Grade' : 'Add Subcontract subcontractor Grade'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingSubgrade(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateSubgrade}
          layout="vertical"
          initialValues={editingSubgrade || {}}
          className="subgrades-modal-form"
        >
          <div className="subgrades-modal-row">
            <Form.Item
              name="csiDivision"
              label="CSI Division"
              rules={[{ required: true, message: 'Please enter the CSI Division' }]}
              className="subgrades-modal-field"
            >
              <AntInput />
            </Form.Item>
            <Form.Item
              name="subcontractor"
              label="Subcontractor"
              rules={[{ required: true, message: 'Please enter the subcontractor name' }]}
              className="subgrades-modal-field"
            >
              <AntInput />
            </Form.Item>
            <Form.Item
              name="grade"
              label="Grade"
              rules={[{ required: true, message: 'Please select a grade' }]}
              className="subgrades-modal-field"
            >
              <Select>
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="C">C</Option>
                <Option value="D">D</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item
            name="performanceComments"
            label={
              <span>
                Performance Comments <InfoCircleOutlined style={{ marginLeft: 4 }} />
              </span>
            }
            rules={[{ required: true, message: 'Please enter performance comments' }]}
            className="subgrades-modal-field-comments"
          >
            <TextArea rows={4} maxLength={500} showCount />
          </Form.Item>
          <Form.Item
            name="advice"
            label="Advice for Future"
            rules={[{ required: true, message: 'Please enter advice for future projects' }]}
            className="subgrades-modal-field-comments"
          >
            <TextArea rows={2} />
          </Form.Item>
          <div className="subgrades-modal-row">
            <Form.Item
              name="contractOriginal"
              label="Contract (Original)"
              rules={[{ required: true, message: 'Please enter the original contract amount' }]}
              className="subgrades-modal-field"
            >
              <AntInput type="number" addonBefore="$" />
            </Form.Item>
            <Form.Item
              name="contractCurrent"
              label="Contract (Current)"
              rules={[{ required: true, message: 'Please enter the current contract amount' }]}
              className="subgrades-modal-field"
            >
              <AntInput type="number" addonBefore="$" />
            </Form.Item>
            <Form.Item
              name="percentOfCurrentContract"
              label="% of Current Contract"
              rules={[{ required: true, message: 'Please enter the percentage' }]}
              className="subgrades-modal-field"
            >
              <AntInput type="number" addonAfter="%" />
            </Form.Item>
            <Form.Item
              name="changeOrderImpact"
              label="Change Order Impact"
              rules={[{ required: true, message: 'Please enter the change order impact' }]}
              className="subgrades-modal-field"
            >
              <AntInput type="number" addonAfter="%" />
            </Form.Item>
          </div>
          <Form.Item
            name="financialComments"
            label="Financial Comments"
            rules={[{ required: true, message: 'Please enter financial comments' }]}
            className="subgrades-modal-field-comments"
          >
            <TextArea rows={2} />
          </Form.Item>
          <div className="subgrades-modal-row">
            <Form.Item
              name="projectRegion"
              label="Project/Region"
              rules={[{ required: true, message: 'Please enter the project/region' }]}
              className="subgrades-modal-field"
            >
              <AntInput />
            </Form.Item>
            <Form.Item
              name="previousBidder"
              label="Previous Bidder"
              rules={[{ required: true, message: 'Please select an option' }]}
              className="subgrades-modal-field"
            >
              <Select>
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="bidWon"
              label="Bid Won"
              rules={[{ required: true, message: 'Please select an option' }]}
              className="subgrades-modal-field"
            >
              <Select>
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="preQualified"
              label="Pre-Qualified"
              rules={[{ required: true, message: 'Please select an option' }]}
              className="subgrades-modal-field"
            >
              <Select>
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            </Form.Item>
          </div>
          <div className="subgrades-modal-row">
            <Form.Item
              name="ccpIssues"
              label="CCP Issues"
              rules={[{ required: true, message: 'Please select an option' }]}
              className="subgrades-modal-field"
            >
              <Select>
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="lowBidder"
              label="Low Bidder"
              rules={[{ required: true, message: 'Please select an option' }]}
              className="subgrades-modal-field"
            >
              <Select>
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="lastReviewed"
              label="Last Reviewed"
              rules={[{ required: true, message: 'Please enter the last reviewed date' }]}
              className="subgrades-modal-field"
            >
              <AntInput type="date" />
            </Form.Item>
            <Form.Item
              name="recommendation"
              label="Recommendation"
              rules={[{ required: true, message: 'Please select a recommendation' }]}
              className="subgrades-modal-field"
            >
              <Select>
                <Option value="Preferred">Preferred</Option>
                <Option value="Consider">Consider</Option>
                <Option value="Avoid">Avoid</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item className="subgrades-modal-actions">
            <Space>
              <Button type="primary" htmlType="submit">
                {editingSubgrade ? 'Update' : 'Create'}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingSubgrade(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={handleDeleteSubgrade}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setSubgradeToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this subgrade for: <strong>{subgradeToDelete?.subcontractor}</strong>?</p>
      </Modal>
    </div>
  );
};

export default SubGrades;