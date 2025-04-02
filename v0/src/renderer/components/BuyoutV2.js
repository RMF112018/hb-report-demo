// src/renderer/components/BuyoutV2.js
// Enhanced Buyout component for HB Report using AG Grid Enterprise with TableModuleV2
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://www.ag-grid.com/react-data-grid/
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/ipc-renderer
// *Additional Reference*: https://ant.design/components/modal#api

import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Input, Space, Button, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import TableModuleV2 from './TableModuleV2.js';
import BuyoutForm from './BuyoutForm.js';
import ComponentHeader from './ComponentHeader.js';
import '../styles/global.css';
import '../styles/Components.css';

/**
 * BuyoutV2 component for managing buyout records with an AG Grid table view
 * @param {Object} props - Component props
 * @param {Object} props.selectedProject - The currently selected project
 * @param {Object} props.headerContent - Header content passed from App.js
 * @returns {JSX.Element} Buyout component with table view
 */
const BuyoutV2 = ({ selectedProject, headerContent }) => {
  const [rowData, setRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [view, setView] = useState('table');
  const [formData, setFormData] = useState(null);
  const gridApiRef = useRef(null);

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

  // Custom cell renderer for status
  const StatusCellRenderer = (params) => {
    const value = params.value || '';
    const color = value === 'Approved' ? '#2ecc71' :
                  value === 'DRAFT' ? '#f39c12' :
                  value === 'OUT_FOR_SIGNATURE' ? '#3498db' :
                  '#7f8c8d';
    return value ? (
      <span style={{ color, fontWeight: '500' }}>{value}</span>
    ) : null;
  };

  // Define columns
  const columns = [
    { field: 'number', headerName: 'Number', width: 130, pinned: 'left' },
    { field: 'contractCompany', headerName: 'Contract Company', width: 200 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'erpStatus', headerName: 'ERP Status', width: 140 },
    { field: 'status', headerName: 'Status', width: 180, cellRenderer: StatusCellRenderer },
    { field: 'executed', headerName: 'Executed', width: 100 },
    { field: 'originalContractAmount', headerName: 'Original Contract Amount', width: 160 },
    { field: 'approvedChangeOrders', headerName: 'Approved Change Orders', width: 160 },
    { field: 'totalContractAmount', headerName: 'Revised Contract Amount', width: 160 },
    { field: 'pendingChangeOrders', headerName: 'Pending Change Orders', width: 160 },
    { field: 'draftChangeOrders', headerName: 'Draft Change Orders', width: 160 },
    { field: 'invoicesAmount', headerName: 'Invoiced', width: 160 },
    { field: 'totalPayments', headerName: 'Total Payments', width: 160 },
    { field: 'percentPaid', headerName: 'Percent Paid', width: 80 },
    { field: 'totalRemaining', headerName: 'Total Remaining', width: 160 },
    { field: 'private', headerName: 'Private', width: 120 },
    { field: 'actions', headerName: 'Actions', width: 110, cellRenderer: ActionsCellRenderer },
  ];

  // Handle row click for editing
  const handleRowClick = (data) => {
    if (data.number === 'Grand Totals') return;
    setFormData(data);
    setView('form');
  };

  // Handle delete buyout
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

  // Handle create or update buyout
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

  // Handle cancel form
  const handleCancel = () => {
    setView('table');
    setFormData(null);
  };

  // Status legend as a status bar component
  const StatusLegendComponent = (props) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', padding: '0 8px' }}>
      <span style={{ color: '#2ecc71' }}>Approved</span>
      <span style={{ color: '#f39c12' }}>DRAFT</span>
      <span style={{ color: '#3498db' }}>OUT FOR SIGNATURE</span>
      <span style={{ color: '#7f8c8d' }}>Default</span>
    </div>
  );

  // Export actions using AG Grid
  const handleExport = (type) => {
    if (!gridApiRef.current) return;
    if (type === 'csv') {
      gridApiRef.current.exportDataAsCsv();
    } else if (type === 'excel') {
      gridApiRef.current.exportDataAsExcel();
    }
  };

  // Header actions
  const headerActions = (
    <Space>
      <Button onClick={() => handleExport('csv')} aria-label="Export to CSV">
        Export CSV
      </Button>
      <Button onClick={() => handleExport('excel')} aria-label="Export to Excel">
        Export Excel
      </Button>
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

  // Grid ready handler
  const onGridReady = (params) => {
    gridApiRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

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
        </div>
      )}
      <div style={{ width: '100%' }}>
        {view === 'table' ? (
          <TableModuleV2
            data={tableData}
            columns={columns}
            autoSizeOnLoad={true}
            globalFilter={globalFilter}
            enableFiltering={true}
            agGridProps={{
              onGridReady,
              rowClassRules: {
                'grand-total-row': (params) => params.data.number === 'Grand Totals',
                'even-row': (params) => params.node.rowIndex % 2 === 0 && params.data.number !== 'Grand Totals',
              },
              statusBar: {
                statusPanels: [
                  { statusPanel: () => <StatusLegendComponent />, align: 'left' },
                ],
              },
              domLayout: 'autoHeight',
            }}
          />
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

BuyoutV2.propTypes = {
  selectedProject: PropTypes.shape({
    projectNumber: PropTypes.string,
    name: PropTypes.string,
  }),
  headerContent: PropTypes.shape({
    title: PropTypes.node.isRequired,
    actions: PropTypes.node,
  }).isRequired,
};

export default BuyoutV2;