// src/renderer/components/BuyoutV2.js
// Component for displaying and managing buyout records in HB Report, with improved state management
// Import this component in App.js to render within the main content area
// Reference: https://react.dev/reference/react
// *Additional Reference*: https://redux-toolkit.js.org/rtk-query/overview
// *Additional Reference*: https://ant.design/components/overview
// *Additional Reference*: https://www.ag-grid.com/react-data-grid/

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Space, Button, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import { useGetCommitmentsQuery, useSyncProjectCommitmentsMutation, useUpsertBuyoutMutation, useGetBudgetLineItemsQuery } from '../apiSlice.js';
import { setBuyoutData, updateBuyoutCell, clearChanges } from '../features/buyoutSlice.js';
import { setBudgetLineItems, clearBudgetLineItems } from '../features/budgetLineItemsSlice.js';
import TableModuleV2 from './TableModuleV2.js';
import BuyoutForm from './BuyoutForm.js';
import ComponentHeader from './ComponentHeader.js';
import '../styles/global.css';
import '../styles/Components.css';

// Function to calculate business days between two dates
const calculateBusinessDays = (startDate, endDate) => {
  let count = 0;
  const currentDate = new Date(startDate);
  const targetDate = new Date(endDate);
  while (currentDate <= targetDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return count;
};

// Utility to deep clone data to ensure mutability
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Utility to debounce a function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const BuyoutV2 = ({ selectedProject, headerContent }) => {
  const dispatch = useDispatch();
  const buyoutData = useSelector((state) => state.buyout.data);
  const changes = useSelector((state) => state.buyout.changes);
  const budgetLineItems = useSelector((state) => state.budgetLineItems?.items || []);
  const [globalFilter, setGlobalFilter] = useState('');
  const [view, setView] = useState('table');
  const [selectedCommitmentId, setSelectedCommitmentId] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
  const [isGridReady, setIsGridReady] = useState(false);
  const gridApiRef = useRef(null);
  const isMountedRef = useRef(true);

  const projectId = selectedProject?.procore_id;
  const [upsertBuyout, { isLoading: isUpserting }] = useUpsertBuyoutMutation();
  const [syncProjectCommitments, { isLoading: isSyncing }] = useSyncProjectCommitmentsMutation();
  const {
    data: fetchedData,
    isLoading: isFetching,
    isError: isCommitmentsError,
    refetch,
  } = useGetCommitmentsQuery(projectId, { skip: !projectId });
  const {
    data: budgetLineItemsData,
    isLoading: isLoadingBudgetLineItems,
    isError: isBudgetLineItemsError,
    refetch: refetchBudgetLineItems,
  } = useGetBudgetLineItemsQuery(projectId, { skip: !projectId });

  // Log selectedProject changes for debugging
  useEffect(() => {
    console.log('selectedProject changed:', selectedProject);
  }, [selectedProject]);

  // Set mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      console.log('BuyoutV2 unmounting, isMountedRef set to false');
    };
  }, []);

  // Load initial commitments data into Redux when fetched from backend and clear changes
  useEffect(() => {
    if (fetchedData) {
      const mutableData = deepClone(fetchedData);
      const gridData = mutableData.map(item => ({
        procore_id: item.commitmentId,
        division_description: item.division,
        title: item.commitment,
        number: item.commitmentNumber,
        vendor: item.vendor,
        status: item.status,
        bic: item.bic,
        contract_start_date: item.scopeStart,
        grand_total: item.contractAmount,
        budget: item.budget,
        allowances: item.allowances,
        savings_loss: item.savingsLoss,
        ownerApproval: item.ownerApproval,
        signed_contract_received_date: item.contractExecutedDate,
        comments: item.buyoutComments,
      }));
      dispatch(setBuyoutData(gridData));
      dispatch(clearChanges());
      console.log('BuyoutV2 commitments loaded into Redux:', gridData);
    }
    if (isCommitmentsError) {
      console.error('Error fetching commitments');
      message.error('Failed to fetch commitments');
    }
  }, [fetchedData, isCommitmentsError, dispatch]);

  // Fetch and store budget line items in Redux when available
  useEffect(() => {
    if (budgetLineItemsData && projectId) {
      dispatch(setBudgetLineItems(budgetLineItemsData));
      console.log('BuyoutV2 budget line items stored in Redux:', budgetLineItemsData);
    }
    if (isBudgetLineItemsError) {
      console.error('Error fetching budget line items');
      message.warning('Failed to load budget line items; picker options may be unavailable');
    }
  }, [budgetLineItemsData, isBudgetLineItemsError, projectId, dispatch]);

  // Update grid when buyoutData changes and grid is ready
  useEffect(() => {
    if (!isGridReady || !gridApiRef.current || !buyoutData) {
      console.log('Grid not ready yet or no data, deferring row data update');
      return;
    }
    console.log('Updating grid with new buyoutData:', buyoutData);
    gridApiRef.current.setGridOption('rowData', buyoutData);
  }, [buyoutData, isGridReady]);

  // Define valueSetter functions at top level
  const statusValueSetter = useCallback((params) => {
    if (params.data.number === 'Grand Totals') return false;
    const rowId = params.data.procore_id;
    if (rowId && !isNaN(parseInt(rowId))) {
      const oldValue = params.data.status;
      if (oldValue !== params.newValue) {
        dispatch(updateBuyoutCell({
          rowId,
          field: 'status',
          value: params.newValue,
        }));
        return true;
      }
    }
    return false;
  }, [dispatch]);

  const bicValueSetter = useCallback((params) => {
    if (params.data.number === 'Grand Totals') return false;
    const rowId = params.data.procore_id;
    if (rowId && !isNaN(parseInt(rowId))) {
      const oldValue = params.data.bic;
      if (oldValue !== params.newValue) {
        dispatch(updateBuyoutCell({
          rowId,
          field: 'bic',
          value: params.newValue,
        }));
        return true;
      }
    }
    return false;
  }, [dispatch]);

  const commentsValueSetter = useCallback((params) => {
    if (params.data.number === 'Grand Totals') return false;
    const rowId = params.data.procore_id;
    if (rowId && !isNaN(parseInt(rowId))) {
      const oldValue = params.data.comments;
      if (oldValue !== params.newValue) {
        dispatch(updateBuyoutCell({
          rowId,
          field: 'comments',
          value: params.newValue,
        }));
        return true;
      }
    }
    return false;
  }, [dispatch]);

  // Memoize column definitions
  const columns = useMemo(() => [
    {
      headerName: 'Division',
      field: 'division_description',
      minWidth: 200,
      cellStyle: { fontWeight: 'bold' },
    },
    {
      headerName: 'Commitment',
      field: 'title',
      minWidth: 200,
      cellStyle: { fontWeight: 'bold' },
    },
    {
      headerName: 'Commitment #',
      field: 'number',
      minWidth: 150,
    },
    {
      headerName: 'Vendor',
      field: 'vendor',
      minWidth: 200,
    },
    {
      headerName: 'Status',
      field: 'status',
      minWidth: 180,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        values: ['Pending', 'In Progress', 'LOI Sent', 'Contract Sent', 'Contract Executed', 'On Hold'],
      },
      editable: (params) => params.data.number !== 'Grand Totals',
      valueSetter: statusValueSetter,
      valueFormatter: (params) => params.value ?? 'Pending',
    },
    {
      headerName: 'BIC',
      field: 'bic',
      minWidth: 120,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        values: ['HB', 'Vendor', 'Owner', 'N/A'],
      },
      editable: (params) => params.data.number !== 'Grand Totals',
      valueSetter: bicValueSetter,
      valueFormatter: (params) => params.value ?? 'N/A',
    },
    {
      headerName: 'Scope Start',
      field: 'contract_start_date',
      minWidth: 150,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      },
    },
    {
      headerName: 'Contract Amount',
      field: 'grand_total',
      minWidth: 160,
      valueFormatter: (params) => {
        const value = parseFloat(params.value || 0);
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      },
    },
    {
      headerName: 'Budget',
      field: 'budget',
      minWidth: 160,
      valueFormatter: (params) => {
        const value = parseFloat(params.value || 0);
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      },
    },
    {
      headerName: 'Allowances',
      field: 'allowances',
      minWidth: 160,
      valueFormatter: (params) => {
        const value = parseFloat(params.value || 0);
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      },
    },
    {
      headerName: 'Savings / Loss',
      field: 'savings_loss',
      minWidth: 160,
      valueFormatter: (params) => {
        const value = parseFloat(params.value || 0);
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      },
    },
    {
      headerName: 'Owner Approval',
      field: 'ownerApproval',
      minWidth: 150,
      editable: (params) => params.data.number !== 'Grand Totals',
    },
    {
      headerName: 'Contract Executed',
      field: 'signed_contract_received_date',
      minWidth: 150,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      },
    },
    {
      headerName: 'Comments',
      field: 'comments',
      minWidth: 200,
      cellEditor: 'agLargeTextCellEditor',
      editable: (params) => params.data.number !== 'Grand Totals',
      valueSetter: commentsValueSetter,
    },
    {
      headerName: 'Actions',
      minWidth: 120,
      cellRenderer: 'actionsCellRenderer',
      pinned: 'right',
      editable: false,
      sortable: false,
      filter: false,
    },
  ], [statusValueSetter, bicValueSetter, commentsValueSetter]);

  // Sync changes to backend, debounced to avoid rapid unmount/remount
  const syncChanges = useCallback(
    debounce(async () => {
      if (!isMountedRef.current && Object.keys(changes).length > 0) {
        try {
          console.log('Syncing changes:', changes);
          const updatePromises = Object.entries(changes).map(([rowIdStr, fields]) => {
            const rowId = Number(rowIdStr);
            const rowData = buyoutData.find(row => row.procore_id === rowId);
            if (!rowData) {
              console.warn(`Row data not found for rowId: ${rowId}. Skipping update.`);
              return Promise.resolve(null);
            }

            const buyoutDataPayload = {
              project_id: projectId,
              commitment_id: rowId,
              division: fields.division_description || rowData.division_description || '',
              status: fields.status || rowData.status,
              bic: fields.bic || rowData.bic,
              comments: fields.comments || rowData.comments || '',
              variance_to_budget: parseFloat(fields.savings_loss) || parseFloat(rowData.savings_loss) || 0,
              own_approve_status: fields.ownerApproval || rowData.ownerApproval || null,
            };

            console.log(`Sending upsertBuyout for rowId: ${rowId}`, buyoutDataPayload);
            return upsertBuyout(buyoutDataPayload)
              .unwrap()
              .then(result => {
                console.log(`upsertBuyout successful for rowId: ${rowId}`, result);
                return result;
              })
              .catch(error => {
                console.error(`upsertBuyout failed for rowId: ${rowId}`, error);
                throw error;
              });
          });

          const results = await Promise.all(updatePromises);
          console.log('All upsertBuyout calls completed:', results);
          const successfulUpdates = results.filter(result => result !== null);
          if (successfulUpdates.length > 0) {
            dispatch(clearChanges());
            message.success('Changes saved successfully!');
          } else {
            dispatch(clearChanges());
            message.info('No valid changes to sync.');
          }
        } catch (error) {
          console.error('Sync error:', error);
          message.error(`Failed to save changes: ${error.message || 'Unknown error'}`);
        }
      } else {
        console.log('Sync skipped: Component is mounted or no changes');
      }
    }, 500),
    [changes, buyoutData, projectId, upsertBuyout, dispatch]
  );

  // Trigger sync on component unmount
  useEffect(() => {
    return () => {
      syncChanges();
    };
  }, [syncChanges]);

  // Handle data refresh
  const handleRefresh = useCallback(async () => {
    if (!projectId) {
      message.error('No project selected to refresh.');
      return;
    }
    try {
      await syncProjectCommitments(projectId).unwrap();
      refetch();
      refetchBudgetLineItems();
      message.success('Buyout data refreshed successfully!');
    } catch (error) {
      message.error('Failed to refresh buyout data.');
      console.error('Error refreshing buyout data:', error);
    }
  }, [projectId, syncProjectCommitments, refetch, refetchBudgetLineItems]);

  // Actions cell renderer
  const ActionsCellRenderer = useCallback((params) => {
    if (params.data.number === 'Grand Totals') return null;
    return (
      <Space>
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(params.data)}
          aria-label={`Edit commitment ${params.data.number}`}
        />
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteBuyout(params.data)}
          aria-label={`Delete commitment ${params.data.number}`}
        />
      </Space>
    );
  }, []);

  // Handle edit button click
  const handleEdit = useCallback((data) => {
    if (data.number === 'Grand Totals') return;
    setInitialFormData(data);
    setSelectedCommitmentId(data.procore_id);
    setView('form');
  }, []);

  // Handle create new buyout
  const handleCreate = useCallback(() => {
    setInitialFormData(null);
    setSelectedCommitmentId(null);
    setView('form');
  }, []);

  // Handle buyout deletion
  const handleDeleteBuyout = useCallback((data) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete commitment ${data.number}?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        message.info('Delete functionality not implemented yet.');
      },
    });
  }, []);

  // Handle create or update buyout
  const handleCreateOrUpdateBuyout = useCallback(async (values) => {
    try {
      const buyoutDataPayload = {
        project_id: projectId,
        commitment_id: selectedCommitmentId || values.procore_id,
        division: values.division_description || '',
        status: values.status || 'Pending',
        bic: values.bic || 'HB',
        comments: values.additional_notes_comments || '',
        variance_to_budget: parseFloat(values.savings_overage) || 0,
        own_approve_status: values.owner_approval_status || null,
        own_approve_date: values.owner_approval_date || null,
        own_meet_date: values.owner_meeting_date || null,
        allowance_included: values.allowance_included || false,
        allowance_total: parseFloat(values.total_contract_allowances) || null,
        allowance_reconciliation_total: parseFloat(values.allowance_reconciliation_total) || null,
        allowance_variance: parseFloat(values.allowance_variance) || null,
        ve_offered: values.ve_offered || false,
        includes_long_lead: values.long_lead_included || false,
        budget_item_id: values.link_to_budget_item || null,
        owner_approval_required: values.owner_approval_required || false,
        owner_meeting_required: values.owner_meeting_required || false,
        allowances: values.allowances || [],
      };
      console.log('Submitting buyoutDataPayload:', buyoutDataPayload);
      await upsertBuyout(buyoutDataPayload).unwrap();
      message.success('Buyout saved successfully!');
      setView('table');
      setSelectedCommitmentId(null);
      setInitialFormData(null);
      refetch();
    } catch (error) {
      message.error('Failed to save buyout.');
      console.error('Error saving buyout:', error);
    }
  }, [projectId, selectedCommitmentId, upsertBuyout, refetch]);

  // Handle cell editing stopped
  const handleCellEditingStopped = useCallback((event) => {
    try {
      console.log('Cell editing stopped:', event);
      if (event.data.number === 'Grand Totals') {
        console.log('Skipping edit for Grand Totals row');
        return;
      }

      const fieldsWithValueSetter = ['status', 'bic', 'comments'];
      if (fieldsWithValueSetter.includes(event.colDef.field)) {
        console.log('Field handled by valueSetter, skipping:', event.colDef.field);
        return;
      }

      const editableFields = ['division_description', 'ownerApproval'];
      if (!editableFields.includes(event.colDef.field)) {
        console.log('Field not editable:', event.colDef.field);
        return;
      }

      const rowId = event.data.procore_id;
      if (!rowId || isNaN(parseInt(rowId))) {
        console.warn('Skipping save: Invalid or missing procore_id in row data', {
          rowData: event.data,
          procoreId: rowId,
          fieldEdited: event.colDef.field,
        });
        message.warning(`Cannot save changes for commitment ${event.data.number || 'unknown'}: Invalid commitment ID`);
        return;
      }

      const oldValue = event.data[event.colDef.field];
      if (oldValue !== event.newValue) {
        dispatch(updateBuyoutCell({
          rowId,
          field: event.colDef.field,
          value: event.newValue,
        }));
        console.log('Dispatched updateBuyoutCell for rowId:', rowId, 'field:', event.colDef.field, 'newValue:', event.newValue);
      }
    } catch (error) {
      console.error('Error in handleCellEditingStopped:', error);
    }
  }, [dispatch]);

  // Handle form cancellation
  const handleCancel = useCallback(() => {
    setView('table');
    setSelectedCommitmentId(null);
    setInitialFormData(null);
  }, []);

  // Handle export
  const handleExport = useCallback((format) => {
    if (!gridApiRef.current) return;
    if (format === 'csv') {
      gridApiRef.current.exportDataAsCsv();
    } else if (format === 'excel') {
      gridApiRef.current.exportDataAsExcel();
    }
  }, []);

  // Define header actions
  const headerActions = useMemo(() => (
    <Space>
      <Button
        onClick={handleRefresh}
        loading={isSyncing || isFetching || isUpserting || isLoadingBudgetLineItems}
        icon={<SyncOutlined />}
        aria-label="Refresh buyout data"
      >
        {isSyncing || isFetching || isUpserting || isLoadingBudgetLineItems ? 'Refreshing...' : 'Refresh Data'}
      </Button>
      <Button onClick={() => handleExport('csv')} aria-label="Export to CSV">
        Export CSV
      </Button>
      <Button onClick={() => handleExport('excel')} aria-label="Export to Excel">
        Export Excel
      </Button>
      <Button
        style={{ backgroundColor: 'var(--hb-orange)', borderColor: 'var(--hb-orange)', color: '#fff' }}
        onClick={handleCreate}
        aria-label="Create new commitment"
        disabled={view === 'form'}
      >
        <PlusOutlined /> Create
      </Button>
    </Space>
  ), [handleRefresh, handleExport, isSyncing, isFetching, isUpserting, isLoadingBudgetLineItems, view, handleCreate]);

  // Callback to receive the grid API from TableModuleV2
  const handleGridApiReady = useCallback(({ api }) => {
    console.log('BuyoutV2: Grid API received:', api);
    if (api) {
      gridApiRef.current = api;
      setIsGridReady(true);
      const allColumns = api.getColumns() || [];
      if (allColumns.length > 0) {
        const allColumnIds = allColumns.map(col => col.getColId());
        api.autoSizeColumns(allColumnIds, false);
        console.log('Columns auto-sized:', allColumnIds);
      } else {
        console.warn('No columns available to auto-size');
      }
    } else {
      console.warn('Grid API is not available');
    }
  }, []);

  // Memoize agGridProps
  const agGridProps = useMemo(() => ({
    onCellEditingStopped: handleCellEditingStopped,
    getRowId: (params) => params.data.procore_id ? params.data.procore_id.toString() : `total-${params.data.number}`,
    rowClassRules: {
      'grand-total-row': (params) => params.data.number === 'Grand Totals',
      'even-row': (params) => params.node.rowIndex % 2 === 0 && params.data.number !== 'Grand Totals',
    },
    domLayout: 'autoHeight',
    components: {
      actionsCellRenderer: ActionsCellRenderer,
    },
  }), [handleCellEditingStopped, ActionsCellRenderer]);

  // Render search input conditionally
  const searchInput = view === 'table' ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
      <Input
        placeholder="Search commitments"
        prefix={<SearchOutlined />}
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        style={{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '4px', backgroundColor: '#fff' }}
        aria-label="Search commitment records"
        title="Search commitment records by any field"
      />
    </div>
  ) : null;

  return (
    <div className="buyout-container" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <ComponentHeader title={headerContent.title} actions={headerActions} />
      {searchInput}
      <div style={{ width: '100%' }}>
        {view === 'table' ? (
          <TableModuleV2
            data={buyoutData}
            columns={columns}
            autoSizeOnLoad={true}
            selectionMode="multiple"
            globalFilter={globalFilter}
            enableFiltering={true}
            agGridProps={agGridProps}
            onGridApiReady={handleGridApiReady}
            isLoading={isFetching || isSyncing || isUpserting || isLoadingBudgetLineItems}
            isError={isCommitmentsError || isBudgetLineItemsError}
            errorMessage="Error loading buyout data"
          />
        ) : projectId ? (
          <BuyoutForm
            projectId={projectId}
            commitmentId={selectedCommitmentId}
            initialData={initialFormData}
            budgetLineItems={budgetLineItems}
            onSubmit={handleCreateOrUpdateBuyout}
            onCancel={handleCancel}
            commitments={buyoutData}
          />
        ) : (
          <div>No project selected</div>
        )}
      </div>
    </div>
  );
};

BuyoutV2.propTypes = {
  selectedProject: PropTypes.shape({
    projectNumber: PropTypes.string,
    name: PropTypes.string,
    procore_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }),
  headerContent: PropTypes.shape({
    title: PropTypes.node.isRequired,
    actions: PropTypes.node,
  }).isRequired,
};

export default BuyoutV2;