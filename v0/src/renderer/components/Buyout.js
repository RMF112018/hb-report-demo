// src/renderer/components/Buyout.js
// Buyout component for HB Report, displaying a buyout table with filtering, export options, and row actions
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://ant.design/components/layout#api
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/ipc-renderer
// *Additional Reference*: https://github.com/jamiebuilds/prop-types

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Input, Space, Spin, Button, Dropdown, message, Modal, Tooltip, Tag } from 'antd';
import { SearchOutlined, DownOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FullscreenOutlined } from '@ant-design/icons';
import TableModule from './TableModule.js';
import BuyoutForm from './BuyoutForm.js';
import ComponentHeader from './ComponentHeader.js';
import '../styles/global.css';
import '../styles/Components.css';

/**
 * Buyout component for managing buyout records with a table view
 * @param {Object} props - Component props
 * @param {Object} props.selectedProject - The currently selected project
 * @param {Object} props.headerContent - Header content passed from App.js
 * @returns {JSX.Element} Buyout component with table view
 */
const Buyout = ({ selectedProject, headerContent }) => {
  const [rowData, setRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [view, setView] = useState('table');
  const [formData, setFormData] = useState(null);

  // Fetch initial data via IPC
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await window.electronAPI.getBuyoutTestData();
        setRowData(data);
      } catch (error) {
        message.error('Failed to load buyout data.');
        console.error('Error fetching buyout data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate grand totals
  const grandTotals = useMemo(() => {
    const safeParse = (value) => parseFloat((value || '$0.00').replace(/[^0-9.-]+/g, "")) || 0;
    const totals = {
      number: 'Grand Totals',
      contractCompany: '',
      title: '',
      erpStatus: '',
      status: '',
      executed: '',
      originalContractAmount: rowData.reduce((sum, row) => sum + safeParse(row.originalContractAmount), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      approvedChangeOrders: rowData.reduce((sum, row) => sum + safeParse(row.approvedChangeOrders), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      totalContractAmount: rowData.reduce((sum, row) => sum + safeParse(row.totalContractAmount), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      pendingChangeOrders: rowData.reduce((sum, row) => sum + safeParse(row.pendingChangeOrders), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      draftChangeOrders: rowData.reduce((sum, row) => sum + safeParse(row.draftChangeOrders), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      invoicesAmount: rowData.reduce((sum, row) => sum + safeParse(row.invoicesAmount), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      totalPayments: rowData.reduce((sum, row) => sum + safeParse(row.totalPayments), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      percentPaid: '0.00%', // TODO: Calculate dynamically if data supports it
      totalRemaining: rowData.reduce((sum, row) => sum + safeParse(row.totalRemaining), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      private: '',
    };
    return [totals];
  }, [rowData]);

  const tableData = useMemo(() => [...rowData, ...grandTotals], [rowData, grandTotals]);

  // Custom cell renderer for actions
  const ActionsCellRenderer = (params) => {
    if (params.data.number === 'Grand Totals') return null;
    return (
      <Space>
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleRowClick(params.data)}
          aria-label={`Edit buyout ${params.data.number}`}
        />
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteBuyout(params.data)}
          aria-label={`Delete buyout ${params.data.number}`}
        />
      </Space>
    );
  };

  // Custom cell renderer for status using Tag component
  const StatusCellRenderer = (params) => {
    const value = params.value || '';
    const color = value === 'Approved' ? 'green' :
                  value === 'DRAFT' ? 'orange' :
                  value === 'OUT_FOR_SIGNATURE' ? 'blue' :
                  'default';
    return value ? (
      <Tooltip title={`Status: ${value}`}>
        <Tag color={color}>{value}</Tag>
      </Tooltip>
    ) : null;
  };

  // Define columns with tooltips for accessibility
  const columns = [
    { field: 'number', headerName: 'Number', width: 130, pinned: 'left', headerTooltip: 'Click to sort or filter' },
    { field: 'contractCompany', headerName: 'Contract Company', width: 200, headerTooltip: 'Click to sort or filter' },
    { field: 'title', headerName: 'Title', width: 200, headerTooltip: 'Click to sort or filter' },
    { field: 'erpStatus', headerName: 'ERP Status', width: 140, headerTooltip: 'Click to sort or filter' },
    { field: 'status', headerName: 'Status', width: 180, cellRenderer: StatusCellRenderer, headerTooltip: 'Click to sort or filter' },
    { field: 'executed', headerName: 'Executed', width: 100, headerTooltip: 'Click to sort or filter' },
    { field: 'originalContractAmount', headerName: 'Original Contract Amount', width: 160, headerTooltip: 'Click to sort or filter' },
    { field: 'approvedChangeOrders', headerName: 'Approved Change Orders', width: 160, headerTooltip: 'Click to sort or filter' },
    { field: 'totalContractAmount', headerName: 'Revised Contract Amount', width: 160, headerTooltip: 'Click to sort or filter' },
    { field: 'pendingChangeOrders', headerName: 'Pending Change Orders', width: 160, headerTooltip: 'Click to sort or filter' },
    { field: 'draftChangeOrders', headerName: 'Draft Change Orders', width: 160, headerTooltip: 'Click to sort or filter' },
    { field: 'invoicesAmount', headerName: 'Invoiced', width: 160, headerTooltip: 'Click to sort or filter' },
    { field: 'totalPayments', headerName: 'Total Payments', width: 160, headerTooltip: 'Click to sort or filter' },
    { field: 'percentPaid', headerName: 'Percent Paid', width: 80, headerTooltip: 'Click to sort or filter' },
    { field: 'totalRemaining', headerName: 'Total Remaining', width: 160, headerTooltip: 'Click to sort or filter' },
    { field: 'private', headerName: 'Private', width: 120, headerTooltip: 'Click to sort or filter' },
    { field: 'actions', headerName: 'Actions', width: 110, cellRenderer: ActionsCellRenderer, headerTooltip: 'Actions for editing or deleting' },
  ];

  const handleRowClick = (data) => {
    // Prevent clicking on "Grand Totals" row
    if (data.number === 'Grand Totals') return;
    setFormData(data);
    setView('form');
  };

  const handleDeleteBuyout = async (data) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete buyout ${data.number}?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          const updatedData = await window.electronAPI.deleteBuyout(data.number);
          setRowData(updatedData);
          message.success('Buyout deleted successfully!');
        } catch (error) {
          message.error('Failed to delete buyout.');
          console.error('Error deleting buyout:', error);
        }
      },
    });
  };

  const handleCreateOrUpdateBuyout = async (values) => {
    try {
      let updatedData;
      if (formData) {
        updatedData = await window.electronAPI.updateBuyout(values);
        message.success('Buyout updated successfully!');
      } else {
        updatedData = await window.electronAPI.addBuyout(values);
        message.success('Buyout created successfully!');
      }
      setRowData(updatedData);
      setView('table');
      setFormData(null);
    } catch (error) {
      message.error(formData ? 'Failed to update buyout.' : 'Failed to create buyout.');
      console.error('Error saving buyout:', error);
    }
  };

  const handleCancel = () => {
    setView('table');
    setFormData(null);
  };

  // Status legend component
  const StatusLegend = () => (
    <div className="status-legend" style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
      <span>
        <Tag color="green">Approved</Tag>
      </span>
      <span>
        <Tag color="orange">DRAFT</Tag>
      </span>
      <span>
        <Tag color="blue">OUT FOR SIGNATURE</Tag>
      </span>
      <span>
        <Tag color="default">Default</Tag>
      </span>
    </div>
  );

  // Updated header actions
  const headerActions = (
    <Space>
      <Dropdown
        menu={{
          items: [
            { key: 'csv', label: <a href="#" onClick={() => console.log('Export to CSV')}>CSV</a> },
            { key: 'pdf', label: <a href="#" onClick={() => console.log('Export to PDF')}>PDF</a> },
          ],
        }}
        trigger={['click']}
      >
        <Button aria-label="Export" aria-expanded="false" aria-haspopup="menu">
          Export <DownOutlined />
        </Button>
      </Dropdown>
      <Button
        style={{ backgroundColor: 'var(--hb-orange)', borderColor: 'var(--hb-orange)', color: '#fff' }}
        onClick={() => { setFormData(null); setView('form'); }}
        aria-label="Create new buyout"
        disabled={view === 'form'}
      >
        <PlusOutlined /> Create
      </Button>
    </Space>
  );

  return (
    <div className="buyout-container" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <ComponentHeader title={headerContent.title} actions={headerActions} />
      {view === 'table' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <Input
            placeholder="Search buyouts"
            prefix={<SearchOutlined />}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '4px', backgroundColor: '#fff' }}
            aria-label="Search buyout records"
            title="Search buyout records by any field"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <StatusLegend />
            <Button
              className="fullscreen-btn"
              icon={<FullscreenOutlined />}
              onClick={() => document.querySelector('.table-container')?.requestFullscreen()}
              style={{
                border: '1px solid var(--hb-blue)',
                borderRadius: '4px',
                padding: '4px',
                height: 'auto',
                lineHeight: 'normal',
                color: 'var(--hb-blue)',
              }}
              aria-label="Enter full-screen"
            />
          </div>
        </div>
      )}
      <div style={{ width: '100%' }}>
        {view === 'table' ? (
          isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin />
            </div>
          ) : (
            <TableModule
              data={tableData}
              columns={columns}
              enableSorting={true}
              enableFiltering={true}
              enablePagination={true}
              pageSize={20}
              className="buyout-table"
              globalFilter={globalFilter}
              loading={isLoading}
              enableFullscreen={true}
              rowClassRules={{
                'grand-total-row': (params) => params.data.number === 'Grand Totals',
                'even-row': (params) => params.node.rowIndex % 2 === 0 && params.data.number !== 'Grand Totals',
              }}
              onRowClick={handleRowClick}
            />
          )
        ) : (
          <BuyoutForm
            initialData={formData}
            onSubmit={handleCreateOrUpdateBuyout}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

Buyout.propTypes = {
  selectedProject: PropTypes.shape({
    projectNumber: PropTypes.string,
    name: PropTypes.string,
  }),
  headerContent: PropTypes.shape({
    title: PropTypes.node.isRequired,
    actions: PropTypes.node,
  }).isRequired,
};

export default Buyout;