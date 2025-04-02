// src/renderer/components/PermitsV2.js
// Enhanced Permits component for HB Report using AG Grid Enterprise with Master Detail for inspection data
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://www.ag-grid.com/react-data-grid/master-detail/
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/cell-content/
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/provided-cell-editors/
// *Additional Reference*: https://react.dev/reference/react/useState

import React, { useState, useEffect, useRef } from 'react';
import { Button, Space, message, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ComponentHeader from './ComponentHeader.js';
import TableModuleV2 from './TableModuleV2.js';
import '../styles/global.css';
import '../styles/Components.css';
import moment from 'moment';

/**
 * PermitsV2 component for managing permit logs with AG Grid Master Detail
 * @param {Object} props - Component props
 * @param {Object} props.selectedProject - The currently selected project
 * @param {Object} props.headerContent - Header content passed from App.js
 * @returns {JSX.Element} Permits log component with Master Detail
 */
const PermitsV2 = ({ selectedProject, headerContent }) => {
  const [rowData, setRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [dirtyRows, setDirtyRows] = useState(new Set());
  const gridApiRef = useRef(null);

  // Fetch permit data via IPC on mount
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

  // Custom renderer for status fields
  const StatusCellRenderer = (params) => {
    const value = params.value || '';
    const style = {
      color: value === 'Open' ? 'green' :
             value === 'Pending' ? 'orange' :
             value === 'Closed' ? 'gray' :
             value === 'Active' ? 'blue' : 'inherit',
      fontWeight: '500',
    };
    return <span style={style}>{value}</span>;
  };

  // Date formatter for display
  const dateFormatter = (params) => {
    return params.value ? moment(params.value).format('MM/DD/YYYY') : '-';
  };

  // Master grid column definitions
  const columnDefs = [
    { field: 'id', headerName: 'ID #', width: 80, minWidth: 60, maxWidth: 100, pinned: 'left', editable: false },
    { field: 'location', headerName: 'Location', width: 120, minWidth: 100, maxWidth: 150 },
    { field: 'type', headerName: 'Type', width: 100, minWidth: 80, maxWidth: 120, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Primary', 'Secondary'] } },
    { field: 'permitNumber', headerName: 'Permit #', width: 100, minWidth: 80, maxWidth: 120 },
    { field: 'description', headerName: 'Description', width: 200, minWidth: 150, maxWidth: 300, cellEditor: 'agLargeTextCellEditor', cellStyle: { whiteSpace: 'normal' } },
    { field: 'responsibleContractor', headerName: 'Responsible Contractor', width: 150, minWidth: 120, maxWidth: 200 },
    { 
      field: 'permitStatus', 
      headerName: 'Permit Status', 
      width: 120, 
      minWidth: 100, 
      maxWidth: 150, 
      cellRenderer: StatusCellRenderer,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Active', 'Pending', 'Closed'] }
    },
    { 
      field: 'dateReceived', 
      headerName: 'Date Received', 
      width: 120, 
      minWidth: 100, 
      maxWidth: 150, 
      cellEditor: 'agDateCellEditor',
      valueFormatter: dateFormatter
    },
    { 
      field: 'dateRequired', 
      headerName: 'Date Required', 
      width: 120, 
      minWidth: 100, 
      maxWidth: 150, 
      cellEditor: 'agDateCellEditor',
      valueFormatter: dateFormatter
    },
    { 
      field: 'dateIssued', 
      headerName: 'Date Issued', 
      width: 120, 
      minWidth: 100, 
      maxWidth: 150, 
      cellEditor: 'agDateCellEditor',
      valueFormatter: dateFormatter
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 100, 
      minWidth: 80, 
      maxWidth: 120, 
      cellRenderer: StatusCellRenderer,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Open', 'Closed', 'Pending'] }
    },
    { field: 'agency', headerName: 'Agency', width: 100, minWidth: 80, maxWidth: 120 },
    { 
      field: 'comments', 
      headerName: 'Comments', 
      width: 200, 
      minWidth: 150, 
      maxWidth: 300, 
      cellEditor: 'agLargeTextCellEditor', 
      cellStyle: { whiteSpace: 'normal' } 
    },
  ];

  // Detail grid column definitions
  const detailColumnDefs = [
    { field: 'ahj', headerName: 'AHJ', width: 150 },
    { field: 'inspectionCode', headerName: 'Inspection Code', width: 150 },
    { field: 'title', headerName: 'Title', width: 200 },
    { 
      field: 'scheduleDate', 
      headerName: 'Schedule Date', 
      width: 150, 
      cellEditor: 'agDateCellEditor', 
      valueFormatter: dateFormatter 
    },
    { 
      field: 'inspectionDate', 
      headerName: 'Inspection Date', 
      width: 150, 
      cellEditor: 'agDateCellEditor', 
      valueFormatter: dateFormatter 
    },
    { 
      field: 'result', 
      headerName: 'Result', 
      width: 150, 
      cellEditor: 'agSelectCellEditor', 
      cellEditorParams: { values: ['Pass', 'Conditional Pass', 'Fail', 'Cancel'] } 
    },
    { 
      field: 'reinspectDate', 
      headerName: 'Reinspect Date', 
      width: 150, 
      cellEditor: 'agDateCellEditor', 
      valueFormatter: dateFormatter 
    },
    { 
      field: 'comments', 
      headerName: 'Comments', 
      width: 300, 
      cellEditor: 'agLargeTextCellEditor', 
      cellStyle: { whiteSpace: 'normal' } 
    },
  ];

  // Handle grid initialization
  const onGridReady = (params) => {
    gridApiRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  // Track edited rows
  const onCellValueChanged = (params) => {
    setDirtyRows((prev) => new Set(prev).add(params.data.id));
  };

  // Add new permit
  const handleAddPermit = () => {
    const newPermit = {
      id: `NEW-${Date.now()}`,
      location: '',
      type: 'Primary',
      permitNumber: '',
      description: '',
      responsibleContractor: '',
      permitStatus: 'Active',
      dateReceived: null,
      dateRequired: null,
      dateIssued: null,
      status: 'Open',
      agency: '',
      comments: '',
      inspections: [],
    };
    gridApiRef.current.applyTransaction({ add: [newPermit] });
    setRowData([...rowData, newPermit]);
  };

  // Delete selected permits
  const handleDeletePermits = async () => {
    const selectedNodes = gridApiRef.current.getSelectedNodes();
    if (!selectedNodes.length) {
      message.warning('No permits selected for deletion.');
      return;
    }
    try {
      const selectedIds = selectedNodes.map(node => node.data.id);
      const updatedData = rowData.filter(row => !selectedIds.includes(row.id));
      for (const id of selectedIds) {
        if (!id.startsWith('NEW-')) {
          await window.electronAPI.deletePermit(id);
        }
      }
      gridApiRef.current.applyTransaction({ remove: selectedNodes.map(node => node.data) });
      setRowData(updatedData);
      setDirtyRows((prev) => {
        const newSet = new Set(prev);
        selectedIds.forEach(id => newSet.delete(id));
        return newSet;
      });
      message.success('Selected permits deleted successfully!');
    } catch (error) {
      message.error('Failed to delete permits.');
      console.error('Error deleting permits:', error);
    }
  };

  // Save changes
  const handleSaveChanges = async () => {
    if (!dirtyRows.size) {
      message.info('No changes to save.');
      return;
    }
    try {
      const updatedRows = [];
      const newRows = [];
      gridApiRef.current.forEachNode((node) => {
        if (dirtyRows.has(node.data.id)) {
          if (node.data.id.startsWith('NEW-')) {
            newRows.push({ ...node.data, id: `PERMIT-${Date.now() + newRows.length}` });
          } else {
            updatedRows.push(node.data);
          }
        }
      });

      let updatedData = [...rowData];
      for (const newRow of newRows) {
        updatedData = await window.electronAPI.addPermit(newRow);
      }
      for (const updatedRow of updatedRows) {
        updatedData = await window.electronAPI.updatePermit(updatedRow);
      }

      setRowData(updatedData);
      setDirtyRows(new Set());
      message.success('Changes saved successfully!');
    } catch (error) {
      message.error('Failed to save changes.');
      console.error('Error saving changes:', error);
    }
  };

  // Header actions
  const headerActions = (
    <Space>
      <Button
        style={{ backgroundColor: 'var(--hb-orange)', borderColor: 'var(--hb-orange)', color: '#fff' }}
        onClick={handleAddPermit}
        aria-label="Add new permit"
      >
        Add Permit
      </Button>
      <Button
        type="primary"
        onClick={handleSaveChanges}
        disabled={!dirtyRows.size}
        aria-label="Save changes"
      >
        Save Changes
      </Button>
      <Button
        danger
        onClick={handleDeletePermits}
        aria-label="Delete selected permits"
      >
        Delete Selected
      </Button>
    </Space>
  );

  return (
    <div
      className="permits-container"
      style={{ margin: 0, display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflowY: 'auto' }}
    >
      <ComponentHeader title={headerContent.title} actions={headerActions} />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '10px' }}>
        <Input
          placeholder="Search permits"
          prefix={<SearchOutlined />}
          value={quickFilterText}
          onChange={(e) => setQuickFilterText(e.target.value)}
          style={{ width: '200px' }}
          aria-label="Search permits records"
        />
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <TableModuleV2
          data={rowData}
          columns={columnDefs}
          autoSizeOnLoad={true}
          globalFilter={quickFilterText} // Updated to use globalFilter prop
          enableFiltering={true} // Enable filtering with sidebar
          agGridProps={{
            onGridReady,
            onCellValueChanged,
            masterDetail: true,
            detailCellRendererParams: {
              detailGridOptions: {
                columnDefs: detailColumnDefs,
              },
              getDetailRowData: (params) => {
                params.successCallback(params.data.inspections || []);
              },
            },
            loadingOverlayComponent: () => <span>Loading...</span>,
            domLayout: 'autoHeight', // Ensure grid grows dynamically
          }}
        />
      </div>
    </div>
  );
};

export default PermitsV2;