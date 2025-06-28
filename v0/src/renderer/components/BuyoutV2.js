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
import dayjs from 'dayjs';

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

// Validate buyout payload before sending to server
const validateBuyoutPayload = (payload, buyoutData) => {
  console.log('BuyoutV2.js: Validating payload:', payload);
  const errors = [];
  if (!payload.project_id) errors.push('project_id is required');
  if (!payload.commitment_id) errors.push('commitment_id is required');
  if (!payload.status) errors.push('status is required');
  if (!payload.bic) errors.push('bic is required');
  if (payload.allowances && !Array.isArray(payload.allowances)) {
    errors.push('allowances must be an array');
  } else if (payload.allowances) {
    payload.allowances.forEach((item, index) => {
      if (!item.item) errors.push(`allowances[${index}].item is required`);
      if (item.value == null) errors.push(`allowances[${index}].value is required`);
    });
  }
  if (payload.veItems && !Array.isArray(payload.veItems)) {
    errors.push('veItems must be an array');
  } else if (payload.veItems) {
    payload.veItems.forEach((item, index) => {
      if (!item.description) errors.push(`veItems[${index}].description is required`);
    });
  }
  if (payload.leadTimes && !Array.isArray(payload.leadTimes)) {
    errors.push('leadTimes must be an array');
  } else if (payload.leadTimes) {
    payload.leadTimes.forEach((item, index) => {
      if (!item.item) errors.push(`leadTimes[${index}].item is required`);
    });
  }
  if (payload.commitment_id) {
    const commitmentExists = buyoutData.some(row => row.procore_id === payload.commitment_id);
    if (!commitmentExists) errors.push(`Invalid commitment_id: ${payload.commitment_id} not found in commitments`);
  }
  console.log('BuyoutV2.js: Validation errors:', errors);
  return errors.length > 0 ? errors : null;
};

const BuyoutV2 = ({ selectedProject, headerContent, userData }) => {
  const dispatch = useDispatch();
  const buyoutData = useSelector((state) => state.buyout.data);
  const changes = useSelector((state) => state.buyout.changes);
  const budgetLineItems = useSelector((state) => state.budgetLineItems?.items || []);
  const [globalFilter, setGlobalFilter] = useState('');
  const [view, setView] = useState('table');
  const [selectedCommitmentId, setSelectedCommitmentId] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
  const [isGridReady, setIsGridReady] = useState(false);
  const [activeTab, setActiveTab] = useState('buyout-details');
  const gridApiRef = useRef(null);
  const isMountedRef = useRef(true);

  // Log userData prop
  useEffect(() => {
    console.log('BuyoutV2.js: Received userData prop:', userData);
  }, [userData]);

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

  // Define tabs for BuyoutForm.js
  const tabs = view === 'form' ? [
    { key: 'buyout-details', label: 'Buyout Details' },
    { key: 'contract-workflow', label: 'Contract Workflow' },
    { key: 'subcontract-checklist', label: 'Subcontract Checklist' },
    { key: 'compliance-waiver', label: 'Compliance Waiver' },
    { key: 'history', label: 'History' },
  ] : [];

  // Log selectedProject changes
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

  // Load initial commitments data into Redux
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

  // Fetch and store budget line items
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

  // Update grid when buyoutData changes
  useEffect(() => {
    if (!isGridReady || !gridApiRef.current || !buyoutData) {
      console.log('Grid not ready yet or no data, deferring row data update');
      return;
    }
    console.log('Updating grid with new buyoutData:', buyoutData);
    gridApiRef.current.setGridOption('rowData', buyoutData);
  }, [buyoutData, isGridReady]);

  // Define valueSetter functions
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

  // Sync changes to backend
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
            message.success('Changes saved successfully.');
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

  // Trigger sync on unmount
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
      message.success('Buyout data refreshed successfully.');
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
    setActiveTab('buyout-details');
  }, []);

  // Handle create new buyout
  const handleCreate = useCallback(() => {
    setInitialFormData(null);
    setSelectedCommitmentId(null);
    setView('form');
    setActiveTab('buyout-details');
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
  console.log('BuyoutV2.js: handleCreateOrUpdateBuyout called with values:', values);

  // Construct payload with only the fields provided in values
  const buyoutDataPayload = {
    project_id: Number(values.project_id),
    commitment_id: Number(values.commitment_id || selectedCommitmentId),
    ...(values.division && { division: values.division }),
    ...(values.status && { status: values.status }),
    ...(values.bic && { bic: values.bic }),
    ...(values.buyout_days_remaining !== undefined && { buyout_days_remaining: Number(values.buyout_days_remaining) }),
    ...(values.owner_meeting_date && { own_meet_date: dayjs(values.owner_meeting_date).format('YYYY-MM-DD') }),
    ...(values.savings_owner !== undefined && { savings_owner: parseFloat(values.savings_owner) }),
    ...(values.savings_hb !== undefined && { savings_hb: parseFloat(values.savings_hb) }),
    ...(values.comments && { comments: values.comments }),
    ...(values.savings_overage !== undefined && { variance_to_budget: parseFloat(values.savings_overage) }),
    ...(values.owner_approval_status && { own_approve_status: values.owner_approval_status }),
    ...(values.owner_approval_date && { own_approve_date: dayjs(values.owner_approval_date).format('YYYY-MM-DD') }),
    ...(values.allowance_included !== undefined && { allowance_included: !!values.allowance_included }),
    ...(values.total_contract_allowances !== undefined && { allowance_total: parseFloat(values.total_contract_allowances) }),
    ...(values.allowance_reconciliation_total !== undefined && { allowance_reconciliation_total: parseFloat(values.allowance_reconciliation_total) }),
    ...(values.allowance_variance !== undefined && { allowance_variance: parseFloat(values.allowance_variance) }),
    ...(values.ve_offered !== undefined && { ve_offered: !!values.ve_offered }),
    ...(values.long_lead_included !== undefined && { includes_long_lead: !!values.long_lead_included }),
    ...(values.long_lead_released !== undefined && { long_lead_released: !!values.long_lead_released }),
    ...(values.link_to_budget_item && { budget_item_id: Number(values.link_to_budget_item) }),
    ...(values.owner_approval_required !== undefined && { owner_approval_required: !!values.owner_approval_required }),
    ...(values.owner_meeting_required !== undefined && { owner_meeting_required: !!values.owner_meeting_required }),
    ...(values.allowances && {
      allowances: values.allowances.map(item => ({
        item: item.item || '',
        value: item.value ? parseFloat(item.value) : null,
        reconciled: !!item.reconciled,
        reconciliation_value: item.reconciliation_value ? parseFloat(item.reconciliation_value) : null,
        variance: item.variance ? parseFloat(item.variance) : null,
      }))
    }),
    ...(values.veItems && {
      veItems: values.veItems.map(item => ({
        description: item.description || '',
        value: item.value ? parseFloat(item.value) : null,
        originalScope: item.originalScope ? parseFloat(item.originalScope) : null,
        savings: item.savings ? parseFloat(item.savings) : null,
        status: item.status || '',
      }))
    }),
    ...(values.leadTimes && {
      leadTimes: values.leadTimes.map(item => ({
        item: item.item || '',
        time: item.time ? parseInt(item.time) : null,
        procured: !!item.procured,
      }))
    }),
    ...(values.number && { number: values.number }),
    ...(values.vendor && { vendor: values.vendor }),
    ...(values.title && { title: values.title }),
    ...(values.executed !== undefined && { executed: !!values.executed }),
    ...(values.retainage_percent !== undefined && { retainage_percent: parseFloat(values.retainage_percent) }),
    ...(values.contract_start_date && { contract_start_date: dayjs(values.contract_start_date).format('YYYY-MM-DD') }),
    ...(values.contract_estimated_completion_date && { contract_estimated_completion_date: dayjs(values.contract_estimated_completion_date).format('YYYY-MM-DD') }),
    ...(values.actual_completion_date && { actual_completion_date: dayjs(values.actual_completion_date).format('YYYY-MM-DD') }),
    ...(values.contract_date && { contract_date: dayjs(values.contract_date).format('YYYY-MM-DD') }),
    ...(values.issued_on_date && { issued_on_date: dayjs(values.issued_on_date).format('YYYY-MM-DD') }),
    ...(values.total_ve_presented !== undefined && { total_ve_presented: parseFloat(values.total_ve_presented) }),
    ...(values.total_ve_accepted !== undefined && { total_ve_accepted: parseFloat(values.total_ve_accepted) }),
    ...(values.total_ve_rejected !== undefined && { total_ve_rejected: parseFloat(values.total_ve_rejected) }),
    ...(values.net_ve_savings !== undefined && { net_ve_savings: parseFloat(values.net_ve_savings) }),
    ...(values.scope_review_meeting_date && { scope_review_meeting_date: dayjs(values.scope_review_meeting_date).format('YYYY-MM-DD') }),
    ...(values.spm_review_date && { spm_review_date: dayjs(values.spm_review_date).format('YYYY-MM-DD') }),
    ...(values.spm_approval_status && { spm_approval_status: values.spm_approval_status }),
    ...(values.px_review_date && { px_review_date: dayjs(values.px_review_date).format('YYYY-MM-DD') }),
    ...(values.px_approval_status && { px_approval_status: values.px_approval_status }),
    ...(values.vp_review_date && { vp_review_date: dayjs(values.vp_review_date).format('YYYY-MM-DD') }),
    ...(values.vp_approval_status && { vp_approval_status: values.vp_approval_status }),
    ...(values.loi_sent_date && { loi_sent_date: dayjs(values.loi_sent_date).format('YYYY-MM-DD') }),
    ...(values.loi_returned_date && { loi_returned_date: dayjs(values.loi_returned_date).format('YYYY-MM-DD') }),
    ...(values.subcontract_agreement_sent_date && { subcontract_agreement_sent_date: dayjs(values.subcontract_agreement_sent_date).format('YYYY-MM-DD') }),
    ...(values.fully_executed_sent_date && { fully_executed_sent_date: dayjs(values.fully_executed_sent_date).format('YYYY-MM-DD') }),
    ...(values.contract_status && { contract_status: values.contract_status }),
    ...(values.schedule_a_status && { schedule_a_status: values.schedule_a_status }),
    ...(values.schedule_b_status && { schedule_b_status: values.schedule_b_status }),
    ...(values.exhibit_a_status && { exhibit_a_status: values.exhibit_a_status }),
    ...(values.exhibit_b_status && { exhibit_b_status: values.exhibit_b_status }),
    ...(values.exhibit_i_status && { exhibit_i_status: values.exhibit_i_status }),
    ...(values.labor_rates_status && { labor_rates_status: values.labor_rates_status }),
    ...(values.unit_rates_status && { unit_rates_status: values.unit_rates_status }),
    ...(values.exhibits_status && { exhibits_status: values.exhibits_status }),
    ...(values.schedule_of_values_status && { schedule_of_values_status: values.schedule_of_values_status }),
    ...(values.p_and_p_bond_status && { p_and_p_bond_status: values.p_and_p_bond_status }),
    ...(values.w_9_status && { w_9_status: values.w_9_status }),
    ...(values.license_status && { license_status: values.license_status }),
    ...(values.insurance_general_liability_status && { insurance_general_liability_status: values.insurance_general_liability_status }),
    ...(values.insurance_auto_status && { insurance_auto_status: values.insurance_auto_status }),
    ...(values.insurance_umbrella_liability_status && { insurance_umbrella_liability_status: values.insurance_umbrella_liability_status }),
    ...(values.insurance_workers_comp_status && { insurance_workers_comp_status: values.insurance_workers_comp_status }),
    ...(values.special_requirements_status && { special_requirements_status: values.special_requirements_status }),
    ...(values.compliance_manager_status && { compliance_manager_status: values.compliance_manager_status }),
    ...(values.scanned_returned_status && { scanned_returned_status: values.scanned_returned_status }),
    ...(values.px && { px: values.px }),
    ...(values.pm && { pm: values.pm }),
    ...(values.pa && { pa: values.pa }),
    ...(values.compliance_manager && { compliance_manager: values.compliance_manager }),
    ...(values.insurance_requirements_to_waive && { insurance_requirements_to_waive: values.insurance_requirements_to_waive }),
    ...(values.insurance_explanation && { insurance_explanation: values.insurance_explanation }),
    ...(values.insurance_risk_justification && { insurance_risk_justification: values.insurance_risk_justification }),
    ...(values.insurance_risk_reduction_actions && { insurance_risk_reduction_actions: values.insurance_risk_reduction_actions }),
    ...(values.insurance_waiver_level && { insurance_waiver_level: values.insurance_waiver_level }),
    ...(values.licensing_requirements_to_waive && { licensing_requirements_to_waive: values.licensing_requirements_to_waive }),
    ...(values.licensing_risk_justification && { licensing_risk_justification: values.licensing_risk_justification }),
    ...(values.licensing_risk_reduction_actions && { licensing_risk_reduction_actions: values.licensing_risk_reduction_actions }),
    ...(values.licensing_waiver_level && { licensing_waiver_level: values.licensing_waiver_level }),
    ...(values.subcontract_scope && { subcontract_scope: values.subcontract_scope }),
    ...(values.employees_on_site && { employees_on_site: values.employees_on_site }),
    ...(values.subcontract_value !== undefined && { subcontract_value: parseFloat(values.subcontract_value) }),
    ...(values.project_executive && { project_executive: values.project_executive }),
    ...(values.project_executive_date && { project_executive_date: dayjs(values.project_executive_date).format('YYYY-MM-DD') }),
    ...(values.cfo && { cfo: values.cfo }),
    ...(values.cfo_date && { cfo_date: dayjs(values.cfo_date).format('YYYY-MM-DD') }),
  };

  console.log('BuyoutV2.js: Submitting buyoutDataPayload:', buyoutDataPayload);

  try {
    await upsertBuyout(buyoutDataPayload).unwrap();
    message.success({ content: 'Buyout Item saved successfully.', key: 'saveBuyout', duration: 2 });
    refetch(); // Refresh data to display updated values
  } catch (error) {
    console.error('BuyoutV2.js: Error saving buyout:', {
      status: error.status,
      data: error.data,
      message: error.message,
      payload: buyoutDataPayload,
    });
    const errorMessage = error.data?.details || error.data?.error || 'Unknown error';
    message.error(`Failed to save buyout: ${errorMessage}`);
    throw error; // Re-throw to allow BuyoutForm.js to handle the error
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
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreate}
        aria-label="Create new buyout"
      >
        New Buyout
      </Button>
    </Space>
  ), [handleRefresh, handleExport, handleCreate, isSyncing, isFetching, isUpserting, isLoadingBudgetLineItems]);

  // Callback to receive the grid API
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

  // Render search input
  const searchInput = view === 'table' ? (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px 0 16px', gap: '8px', marginBottom: '16px' }}>
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
      <ComponentHeader
        title={headerContent.title}
        actions={headerActions}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
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
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userData={userData}
            toolName="BuyoutForm"
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
  userData: PropTypes.object,
};

export default BuyoutV2;