// src/renderer/components/BuyoutForm.js
// Component for creating or editing buyout records in HB Report, used within Buyout.js
// Import this component in Buyout.js to render within the main content area for adding or modifying buyout records
// Reference: https://ant.design/components/form/
// *Additional Reference*: https://react-hook-form.com/docs
// *Additional Reference*: https://s-yadav.github.io/react-number-format/docs/
// *Additional Reference*: https://ant.design/components/float-button
// *Additional Reference*: https://ant.design/components/layout
// *Additional Reference*: https://ant.design/components/steps

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Layout, Menu, Spin, Alert, message, Button, Space, Collapse, Grid } from 'antd';
import { SaveOutlined, CloseOutlined, MenuUnfoldOutlined, MenuFoldOutlined, EditOutlined } from '@ant-design/icons';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useGetBuyoutDataQuery, apiSlice } from '../apiSlice.js';
import { useDispatch } from 'react-redux';
import {
  GeneralInformationSection,
  OwnerApprovalSection,
  AllowanceSection,
  ValueEngineeringSection,
  LongLeadSection,
  FinancialsSection,
  CommentsSection,
  ContractWorkflowSection,
  SubcontractChecklistSection,
  ComplianceWaiverSection,
  HistorySection,
} from './BuyoutForm/index.js';
import { LoadingWrapper } from 'hb-report';
import { FloatButton } from 'antd';
import dayjs from 'dayjs';
import '../styles/BuyoutForm.css';

const { Sider, Content } = Layout;
const { Panel } = Collapse;
const { useBreakpoint } = Grid; // Correctly import useBreakpoint from Grid

// Utility function to compare two objects and return only changed fields
const getChangedFields = (newData, initialData) => {
  const changed = {};
  Object.keys(newData).forEach((key) => {
    const newValue = newData[key];
    const initialValue = initialData[key];

    // Handle arrays (e.g., allowances, veItems, leadTimes)
    if (Array.isArray(newValue) && Array.isArray(initialValue)) {
      if (JSON.stringify(newValue) !== JSON.stringify(initialValue)) {
        changed[key] = newValue;
      }
      return;
    }

    // Handle objects (e.g., licensing_requirements_to_waive)
    if (typeof newValue === 'object' && newValue !== null && typeof initialValue === 'object' && initialValue !== null) {
      if (JSON.stringify(newValue) !== JSON.stringify(initialValue)) {
        changed[key] = newValue;
      }
      return;
    }

    // Handle primitive values
    if (newValue !== initialValue) {
      changed[key] = newValue;
    }
  });
  return changed;
};

const BuyoutForm = ({ projectId, commitmentId, initialData, commitments, budgetLineItems, onSubmit, onCancel, activeTab, onTabChange, userData, toolName }) => {
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('general-information');
  const [userCollapsed, setUserCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState({});
  const prevBreakpointRef = useRef(null);
  const sectionsContainerRef = useRef(null);
  const dispatch = useDispatch();
  const [initialFormValues, setInitialFormValues] = useState({});

  const screens = useBreakpoint(); // Use Grid.useBreakpoint
  const isSmallScreen = screens.xs;

  useEffect(() => {
    console.log('BuyoutForm.js: Received props:', { projectId, commitmentId, userData, toolName, commitmentsLength: commitments?.length });
  }, [projectId, commitmentId, userData, toolName, commitments]);

  useEffect(() => {
    if (!toolName || typeof toolName !== 'string' || toolName.trim() === '') {
      console.error('BuyoutForm.js: Invalid toolName prop:', toolName);
      message.error('Tool name is required for comments section');
    }
  }, [toolName]);

  const historyData = useMemo(() => {
    if (!initialData || !commitments || !Array.isArray(commitments)) {
      console.log('BuyoutForm.js: historyData is empty due to missing initialData or commitments');
      return [];
    }
    const filteredData = commitments
      .filter((c) => c.procore_id === initialData.procore_id)
      .sort((a, b) => parseInt(b.version || 0) - parseInt(a.version || 0));
    console.log('BuyoutForm.js: historyData:', filteredData);
    return filteredData;
  }, [initialData, commitments]);

  const { data: buyoutDetails, isLoading, isError, isFetching } = useGetBuyoutDataQuery(
    { projectId, commitmentId },
    { skip: !projectId || !commitmentId || isSaving }
  );

  const { control, handleSubmit, reset, watch, setValue, formState: { errors, isValid } } = useForm({
    defaultValues: {
      number: '',
      vendor: '',
      title: '',
      status: '',
      bic: 'HB',
      executed: false,
      retainage_percent: 0,
      contract_start_date: null,
      contract_estimated_completion_date: null,
      actual_completion_date: null,
      contract_date: null,
      signed_contract_received_date: null,
      issued_on_date: null,
      owner_approval_required: false,
      owner_approval_status: '',
      owner_meeting_required: false,
      owner_meeting_date: null,
      owner_approval_date: null,
      allowance_included: false,
      total_contract_allowances: 0,
      allowance_reconciliation_total: 0,
      allowance_variance: 0,
      ve_offered: false,
      total_ve_presented: 0,
      total_ve_accepted: 0,
      total_ve_rejected: 0,
      net_ve_savings: 0,
      long_lead_included: false,
      long_lead_released: false,
      link_to_budget_item: null,
      budget: 0,
      contract_value: 0,
      savings_overage: 0,
      allowances: [],
      veItems: [],
      leadTimes: [],
      scope_review_meeting_date: null,
      spm_review_date: null,
      spm_approval_status: '',
      px_review_date: null,
      px_approval_status: '',
      vp_review_date: null,
      vp_approval_status: '',
      loi_sent_date: null,
      loi_returned_date: null,
      subcontract_agreement_sent_date: null,
      fully_executed_sent_date: null,
      contract_status: 'N',
      schedule_a_status: 'N',
      schedule_b_status: 'N',
      exhibit_a_status: 'N',
      exhibit_b_status: 'N',
      exhibit_i_status: 'N',
      labor_rates_status: 'N',
      unit_rates_status: 'N',
      exhibits_status: 'N',
      schedule_of_values_status: 'N',
      p_and_p_bond_status: 'N',
      w_9_status: 'N',
      license_status: 'N',
      insurance_general_liability_status: 'N',
      insurance_auto_status: 'N',
      insurance_umbrella_liability_status: 'N',
      insurance_workers_comp_status: 'N',
      special_requirements_status: 'N',
      compliance_manager_status: 'N',
      scanned_returned_status: 'N',
      px: '',
      pm: '',
      pa: '',
      compliance_manager: '',
      insurance_requirements_to_waive: [],
      insurance_explanation: '',
      insurance_risk_justification: '',
      insurance_risk_reduction_actions: '',
      insurance_waiver_level: '',
      licensing_requirements_to_waive: { state: false, local: false, county: '' },
      licensing_risk_justification: '',
      licensing_risk_reduction_actions: '',
      licensing_waiver_level: '',
      subcontract_scope: '',
      employees_on_site: '',
      subcontract_value: null,
      project_executive: '',
      project_executive_date: null,
      cfo: '',
      cfo_date: null,
      procore_id: null,
    },
    mode: 'onChange',
    resolver: async (data) => {
      console.log('BuyoutForm.js: Running form resolver with data:', data);
      const errors = {};
      if (!data.status) errors.status = { type: 'required', message: 'Status is required' };
      if (!data.bic) errors.bic = { type: 'required', message: 'BIC is required' };
      if (data.allowances && !Array.isArray(data.allowances)) {
        errors.allowances = { type: 'typeError', message: 'Allowances must be an array' };
      } else if (data.allowances) {
        data.allowances.forEach((item, index) => {
          if (!item.item) {
            errors[`allowances[${index}].item`] = { type: 'required', message: `Allowance ${index + 1}: Item is required` };
          }
          if (item.value == null) {
            errors[`allowances[${index}].value`] = { type: 'required', message: `Allowance ${index + 1}: Value is required` };
          }
        });
      }
      if (data.ve_offered && data.veItems && !Array.isArray(data.veItems)) {
        errors.veItems = { type: 'typeError', message: 'Value Engineering items must be an array' };
      } else if (data.ve_offered && data.veItems) {
        data.veItems.forEach((item, index) => {
          if (!item.description) {
            errors[`veItems[${index}].description`] = { type: 'required', message: `VE Item ${index + 1}: Description is required` };
          }
        });
      }
      if (data.leadTimes && !Array.isArray(data.leadTimes)) {
        errors.leadTimes = { type: 'typeError', message: 'Lead Times must be an array' };
      } else if (data.leadTimes) {
        data.leadTimes.forEach((item, index) => {
          if (!item.item) {
            errors[`leadTimes[${index}].item`] = { type: 'required', message: `Lead Time ${index + 1}: Item is required` };
          }
        });
      }
      console.log('BuyoutForm.js: Resolver errors:', errors);
      return { values: data, errors };
    },
  });

  const allowanceIncluded = useWatch({ control, name: 'allowance_included' });
  const veOffered = useWatch({ control, name: 've_offered' });
  const longLeadIncluded = useWatch({ control, name: 'long_lead_included' });

  const { fields: allowanceFields, append: appendAllowance, remove: removeAllowance } = useFieldArray({ control, name: 'allowances' });
  const { fields: veFields, append: appendVe, remove: removeVe } = useFieldArray({ control, name: 'veItems' });
  const { fields: leadFields, append: appendLead, remove: removeLead } = useFieldArray({ control, name: 'leadTimes' });

  const sanitizeDate = (date) => {
    if (!date) {
      console.log('sanitizeDate: Null or undefined date, returning null');
      return null;
    }
    console.log('sanitizeDate: Input date:', date, 'Type:', typeof date);
    const parsed = dayjs(date);
    if (parsed.isValid()) {
      console.log('sanitizeDate: Valid date, returning Day.js object:', parsed);
      return parsed;
    }
    console.warn('sanitizeDate: Invalid date detected:', date);
    return null;
  };

  useEffect(() => {
    if (buyoutDetails && commitmentId && !isSaving) {
      console.log('BuyoutForm.js: buyoutDetails received:', buyoutDetails);
      const formatCurrency = (value) => {
        const num = value != null ? parseFloat(value) : 0;
        return isNaN(num) ? 0 : num;
      };
      const formatBoolean = (value) => !!value;
  
      const sanitizedVeItems = (buyoutDetails.veItems || []).map(item => ({
        ...item,
        description: item.description || item.item || 'Unknown',
        original_value: formatCurrency(item.originalScope),
        ve_value: formatCurrency(item.value),
        savings: formatCurrency(item.savings),
        status: item.status || 'Pending',
      }));
  
      const sanitizedLeadTimes = (buyoutDetails.longLeadItems || []).map(item => ({
        ...item,
        time: item.lead_time != null ? parseInt(item.lead_time) : 0,
        procured: item.status === 'Procured',
      }));
  
      const sanitizedAllowances = (buyoutDetails.allowanceItems || []).map(item => ({
        ...item,
        value: formatCurrency(item.value),
        reconciliation_value: formatCurrency(item.reconciliation_value),
        variance: formatCurrency(item.variance),
      }));
  
      const newData = {
        number: buyoutDetails.commitmentNumber || '',
        vendor: buyoutDetails.vendor || '',
        title: buyoutDetails.title || '',
        status: buyoutDetails.status || '',
        bic: buyoutDetails.bic || 'HB',
        executed: formatBoolean(buyoutDetails.isExecuted),
        retainage_percent: formatCurrency(buyoutDetails.defRetainage),
        contract_start_date: sanitizeDate(buyoutDetails.contractStartDate),
        contract_estimated_completion_date: sanitizeDate(buyoutDetails.contractEstimatedCompletionDate),
        actual_completion_date: sanitizeDate(buyoutDetails.actualCompletionDate),
        contract_date: sanitizeDate(buyoutDetails.contractDate),
        signed_contract_received_date: sanitizeDate(buyoutDetails.signedContractReceivedDate),
        issued_on_date: sanitizeDate(buyoutDetails.issuedOnDate),
        owner_approval_required: formatBoolean(buyoutDetails.ownerApprovalRequired),
        owner_approval_status: buyoutDetails.ownerApprovalStatus || '',
        owner_meeting_required: formatBoolean(buyoutDetails.ownerMeetingRequired),
        owner_meeting_date: sanitizeDate(buyoutDetails.ownerMeetingDate),
        owner_approval_date: sanitizeDate(buyoutDetails.ownerApprovalDate),
        allowance_included: formatBoolean(buyoutDetails.allowancesIncluded),
        total_contract_allowances: formatCurrency(buyoutDetails.allowancesTotal),
        allowance_reconciliation_total: formatCurrency(buyoutDetails.allowanceReconciliation),
        allowance_variance: formatCurrency(buyoutDetails.allowanceVariance),
        ve_offered: formatBoolean(buyoutDetails.veOffered),
        total_ve_presented: formatCurrency(buyoutDetails.veTotal),
        total_ve_accepted: formatCurrency(buyoutDetails.veAccepted),
        total_ve_rejected: formatCurrency(buyoutDetails.veRejected),
        net_ve_savings: formatCurrency(buyoutDetails.veSavings),
        long_lead_included: formatBoolean(buyoutDetails.longLeadIncluded),
        long_lead_released: formatBoolean(buyoutDetails.longLeadReleased),
        link_to_budget_item: buyoutDetails.budget_item_id ? String(buyoutDetails.budget_item_id) : null,
        budget: formatCurrency(buyoutDetails.budget),
        contract_value: formatCurrency(buyoutDetails.contractAmount),
        savings_overasties: formatCurrency(buyoutDetails.savingsLoss),
        allowances: sanitizedAllowances,
        veItems: sanitizedVeItems,
        leadTimes: sanitizedLeadTimes,
        scope_review_meeting_date: sanitizeDate(buyoutDetails.scopeReviewMeetingDate),
        spm_review_date: sanitizeDate(buyoutDetails.spmReviewDate),
        spm_approval_status: buyoutDetails.spmApprovalStatus || '',
        px_review_date: sanitizeDate(buyoutDetails.pxReviewDate),
        px_approval_status: buyoutDetails.pxApprovalStatus || '',
        vp_review_date: sanitizeDate(buyoutDetails.vpReviewDate),
        vp_approval_status: buyoutDetails.vpApprovalStatus || '',
        loi_sent_date: sanitizeDate(buyoutDetails.loiSentDate),
        loi_returned_date: sanitizeDate(buyoutDetails.loiReturnedDate),
        subcontract_agreement_sent_date: sanitizeDate(buyoutDetails.subcontractAgreementSentDate),
        fully_executed_sent_date: sanitizeDate(buyoutDetails.fullyExecutedSentDate),
        contract_status: buyoutDetails.contractStatus || 'N',
        schedule_a_status: buyoutDetails.scheduleAStatus || 'N',
        schedule_b_status: buyoutDetails.scheduleBStatus || 'N',
        exhibit_a_status: buyoutDetails.exhibitAStatus || 'N',
        exhibit_b_status: buyoutDetails.exhibitBStatus || 'N',
        exhibit_i_status: buyoutDetails.exhibitIStatus || 'N',
        labor_rates_status: buyoutDetails.laborRatesStatus || 'N',
        unit_rates_status: buyoutDetails.unitRatesStatus || 'N',
        exhibits_status: buyoutDetails.exhibitsStatus || 'N',
        schedule_of_values_status: buyoutDetails.scheduleOfValuesStatus || 'N',
        p_and_p_bond_status: buyoutDetails.pAndPBondStatus || 'N',
        w_9_status: buyoutDetails.w9Status || 'N',
        license_status: buyoutDetails.licenseStatus || 'N',
        insurance_general_liability_status: buyoutDetails.insuranceGeneralLiabilityStatus || 'N',
        insurance_auto_status: buyoutDetails.insuranceAutoStatus || 'N',
        insurance_umbrella_liability_status: buyoutDetails.insuranceUmbrellaLiabilityStatus || 'N',
        insurance_workers_comp_status: buyoutDetails.insuranceWorkersCompStatus || 'N',
        special_requirements_status: buyoutDetails.specialRequirementsStatus || 'N',
        compliance_manager_status: buyoutDetails.complianceManagerStatus || 'N',
        scanned_returned_status: buyoutDetails.scannedReturnedStatus || 'N',
        px: buyoutDetails.px || '',
        pm: buyoutDetails.pm || '',
        pa: buyoutDetails.pa || '',
        compliance_manager: buyoutDetails.complianceManager || '',
        insurance_requirements_to_waive: buyoutDetails.insuranceRequirementsToWaive || [],
        insurance_explanation: buyoutDetails.insuranceExplanation || '',
        insurance_risk_justification: buyoutDetails.insuranceRiskJustification || '',
        insurance_risk_reduction_actions: buyoutDetails.insuranceRiskReductionActions || '',
        insurance_waiver_level: buyoutDetails.insuranceWaiverLevel || '',
        licensing_requirements_to_waive: buyoutDetails.licensingRequirementsToWaive || { state: false, local: false, county: '' },
        licensing_risk_justification: buyoutDetails.licensingRiskJustification || '',
        licensing_risk_reduction_actions: buyoutDetails.licensingRiskReductionActions || '',
        licensing_waiver_level: buyoutDetails.licensingWaiverLevel || '',
        subcontract_scope: buyoutDetails.subcontractScope || '',
        employees_on_site: buyoutDetails.employeesOnSite || '',
        subcontract_value: formatCurrency(buyoutDetails.subcontractValue),
        project_executive: buyoutDetails.projectExecutive || '',
        project_executive_date: sanitizeDate(buyoutDetails.projectExecutiveDate),
        cfo: buyoutDetails.cfo || '',
        cfo_date: sanitizeDate(buyoutDetails.cfoDate),
        procore_id: commitmentId || null,
      };
  
      console.log('BuyoutForm.js: Sanitized buyoutDetails for reset:', newData);
      reset(newData);
      setInitialFormValues(newData); // Store initial values for comparison
    }
  }, [buyoutDetails, commitmentId, reset, commitments, isSaving]);

  useEffect(() => {
    if (initialData && !commitmentId) {
      console.log('BuyoutForm.js: initialData received:', initialData);
      const formatCurrency = (value) => {
        const num = value != null ? parseFloat(value) : 0;
        return isNaN(num) ? 0 : num;
      };
      const formatBoolean = (value) => !!value;

      const sanitizedVeItems = (initialData.veItems || []).map(item => ({
        ...item,
        description: item.description || item.item || 'Unknown',
        original_value: formatCurrency(item.originalScope),
        ve_value: formatCurrency(item.value),
        savings: formatCurrency(item.savings),
        status: item.status || 'Pending',
      }));

      const sanitizedLeadTimes = (initialData.leadTimes || []).map(item => ({
        ...item,
        time: item.time != null ? parseInt(item.time) : 0,
        procured: item.procured || false,
      }));

      const sanitizedAllowances = (initialData.allowances || []).map(item => ({
        ...item,
        value: formatCurrency(item.value),
        reconciliation_value: formatCurrency(item.reconciliation_value),
        variance: formatCurrency(item.variance),
      }));

      const newData = {
        number: initialData.number?.toString() || '',
        vendor: initialData.vendor || '',
        title: initialData.title || '',
        status: initialData.status || '',
        bic: initialData.bic || 'HB',
        executed: formatBoolean(initialData.executed),
        retainage_percent: formatCurrency(initialData.retainage_percent),
        contract_start_date: sanitizeDate(initialData.contract_start_date),
        contract_estimated_completion_date: sanitizeDate(initialData.contract_estimated_completion_date),
        actual_completion_date: sanitizeDate(initialData.actual_completion_date),
        contract_date: sanitizeDate(initialData.contract_date),
        signed_contract_received_date: sanitizeDate(initialData.signed_contract_received_date),
        issued_on_date: sanitizeDate(initialData.issued_on_date),
        owner_approval_required: formatBoolean(initialData.owner_approval_required),
        owner_approval_status: initialData.owner_approval_status || '',
        owner_meeting_required: formatBoolean(initialData.owner_meeting_required),
        owner_meeting_date: sanitizeDate(initialData.owner_meeting_date),
        owner_approval_date: sanitizeDate(initialData.owner_approval_date),
        allowance_included: formatBoolean(initialData.allowance_included),
        total_contract_allowances: formatCurrency(initialData.total_contract_allowances),
        allowance_reconciliation_total: formatCurrency(initialData.allowance_reconciliation_total),
        allowance_variance: formatCurrency(initialData.allowance_variance),
        ve_offered: formatBoolean(initialData.ve_offered),
        total_ve_presented: formatCurrency(initialData.total_ve_presented),
        total_ve_accepted: formatCurrency(initialData.total_ve_accepted),
        total_ve_rejected: formatCurrency(initialData.total_ve_rejected),
        net_ve_savings: formatCurrency(initialData.net_ve_savings),
        long_lead_included: formatBoolean(initialData.long_lead_included),
        long_lead_released: formatBoolean(initialData.long_lead_released),
        link_to_budget_item: initialData.link_to_budget_item || null,
        budget: formatCurrency(initialData.budget),
        contract_value: formatCurrency(initialData.contract_value),
        savings_overage: formatCurrency(initialData.savings_overage),
        allowances: sanitizedAllowances,
        veItems: sanitizedVeItems,
        leadTimes: sanitizedLeadTimes,
        scope_review_meeting_date: sanitizeDate(initialData.scope_review_meeting_date),
        spm_review_date: sanitizeDate(initialData.spm_review_date),
        spm_approval_status: initialData.spm_approval_status || '',
        px_review_date: sanitizeDate(initialData.px_review_date),
        px_approval_status: initialData.px_approval_status || '',
        vp_review_date: sanitizeDate(initialData.vp_review_date),
        vp_approval_status: initialData.vp_approval_status || '',
        loi_sent_date: sanitizeDate(initialData.loi_sent_date),
        loi_returned_date: sanitizeDate(initialData.loi_returned_date),
        subcontract_agreement_sent_date: sanitizeDate(initialData.subcontract_agreement_sent_date),
        fully_executed_sent_date: sanitizeDate(initialData.fully_executed_sent_date),
        contract_status: initialData.contract_status || 'N',
        schedule_a_status: initialData.schedule_a_status || 'N',
        schedule_b_status: initialData.schedule_b_status || 'N',
        exhibit_a_status: initialData.exhibit_a_status || 'N',
        exhibit_b_status: initialData.exhibit_b_status || 'N',
        exhibit_i_status: initialData.exhibit_i_status || 'N',
        labor_rates_status: initialData.labor_rates_status || 'N',
        unit_rates_status: initialData.unit_rates_status || 'N',
        exhibits_status: initialData.exhibits_status || 'N',
        schedule_of_values_status: initialData.schedule_of_values_status || 'N',
        p_and_p_bond_status: initialData.p_and_p_bond_status || 'N',
        w_9_status: initialData.w_9_status || 'N',
        license_status: initialData.license_status || 'N',
        insurance_general_liability_status: initialData.insurance_general_liability_status || 'N',
        insurance_auto_status: initialData.insurance_auto_status || 'N',
        insurance_umbrella_liability_status: initialData.insurance_umbrella_liability_status || 'N',
        insurance_workers_comp_status: initialData.insurance_workers_comp_status || 'N',
        special_requirements_status: initialData.special_requirements_status || 'N',
        compliance_manager_status: initialData.compliance_manager_status || 'N',
        scanned_returned_status: initialData.scanned_returned_status || 'N',
        px: initialData.px || '',
        pm: initialData.pm || '',
        pa: initialData.pa || '',
        compliance_manager: initialData.compliance_manager || '',
        insurance_requirements_to_waive: initialData.insurance_requirements_to_waive || [],
        insurance_explanation: initialData.insurance_explanation || '',
        insurance_risk_justification: initialData.insurance_risk_justification || '',
        insurance_risk_reduction_actions: initialData.insurance_risk_reduction_actions || '',
        insurance_waiver_level: initialData.insurance_waiver_level || '',
        licensing_requirements_to_waive: initialData.licensing_requirements_to_waive || { state: false, local: false, county: '' },
        licensing_risk_justification: initialData.licensing_risk_justification || '',
        licensing_risk_reduction_actions: initialData.licensing_risk_reduction_actions || '',
        licensing_waiver_level: initialData.licensing_waiver_level || '',
        subcontract_scope: initialData.subcontract_scope || '',
        employees_on_site: initialData.employees_on_site || '',
        subcontract_value: formatCurrency(initialData.subcontract_value),
        project_executive: initialData.project_executive || '',
        project_executive_date: sanitizeDate(initialData.project_executive_date),
        cfo: initialData.cfo || '',
        cfo_date: sanitizeDate(initialData.cfo_date),
        procore_id: initialData.procore_id || null,
      };

      console.log('BuyoutForm.js: Sanitized initialData for reset:', newData);
      reset(newData);
      setInitialFormValues(newData); // Store initial values for comparison
    }
  }, [initialData, commitmentId, reset, commitments]);

  const onFormSubmit = async (data) => {
    console.log('BuyoutForm.js: onFormSubmit called with data:', data);
    setSaveButtonDisabled(true);
    setIsSaving(true);
    message.loading({ content: 'Saving...', key: 'saveBuyout' });

    try {
      const formattedData = {
        ...data,
        contract_start_date: data.contract_start_date ? dayjs(data.contract_start_date).format('YYYY-MM-DD') : null,
        contract_estimated_completion_date: data.contract_estimated_completion_date ? dayjs(data.contract_estimated_completion_date).format('YYYY-MM-DD') : null,
        actual_completion_date: data.actual_completion_date ? dayjs(data.actual_completion_date).format('YYYY-MM-DD') : null,
        contract_date: data.contract_date ? dayjs(data.contract_date).format('YYYY-MM-DD') : null,
        signed_contract_received_date: data.signed_contract_received_date ? dayjs(data.signed_contract_received_date).format('YYYY-MM-DD') : null,
        issued_on_date: data.issued_on_date ? dayjs(data.issued_on_date).format('YYYY-MM-DD') : null,
        owner_meeting_date: data.owner_meeting_date ? dayjs(data.owner_meeting_date).format('YYYY-MM-DD') : null,
        owner_approval_date: data.owner_approval_date ? dayjs(data.owner_approval_date).format('YYYY-MM-DD') : null,
        scope_review_meeting_date: data.scope_review_meeting_date ? dayjs(data.scope_review_meeting_date).format('YYYY-MM-DD') : null,
        spm_review_date: data.spm_review_date ? dayjs(data.spm_review_date).format('YYYY-MM-DD') : null,
        px_review_date: data.px_review_date ? dayjs(data.px_review_date).format('YYYY-MM-DD') : null,
        vp_review_date: data.vp_review_date ? dayjs(data.vp_review_date).format('YYYY-MM-DD') : null,
        loi_sent_date: data.loi_sent_date ? dayjs(data.loi_sent_date).format('YYYY-MM-DD') : null,
        loi_returned_date: data.loi_returned_date ? dayjs(data.loi_returned_date).format('YYYY-MM-DD') : null,
        subcontract_agreement_sent_date: data.subcontract_agreement_sent_date ? dayjs(data.subcontract_agreement_sent_date).format('YYYY-MM-DD') : null,
        fully_executed_sent_date: data.fully_executed_sent_date ? dayjs(data.fully_executed_sent_date).format('YYYY-MM-DD') : null,
        project_executive_date: data.project_executive_date ? dayjs(data.project_executive_date).format('YYYY-MM-DD') : null,
        cfo_date: data.cfo_date ? dayjs(data.cfo_date).format('YYYY-MM-DD') : null,
      };

      // Compute changed fields only
      const changedData = getChangedFields(formattedData, initialFormValues);
      changedData.project_id = projectId;
      changedData.commitment_id = commitmentId;
      console.log('BuyoutForm.js: Changed fields for submission:', changedData);

      await onSubmit(changedData);

      // Update the RTK Query cache with the submitted data
      dispatch(
        apiSlice.util.updateQueryData('getBuyoutData', { projectId, commitmentId }, (draft) => {
          Object.keys(changedData).forEach((key) => {
            if (draft[key] !== undefined) {
              draft[key] = changedData[key];
            }
          });
        })
      );

      message.success({ content: 'Buyout saved successfully', key: 'saveBuyout', duration: 2 });
      setIsEditing({});
    } catch (error) {
      console.error('BuyoutForm.js: Save failed:', {
        error,
        message: error.message,
        status: error.status,
        data: error.data,
      });
      const errorMessage = error.data?.details || error.data?.error || 'Unknown error';
      message.error({ content: `Failed to save buyout: ${errorMessage}`, key: 'saveBuyout', duration: 4 });
    } finally {
      setSaveButtonDisabled(false);
      setIsSaving(false);
    }
  };

  const onSectionSubmit = (sectionId) => async (data, event) => {
    console.log(`BuyoutForm.js: onSectionSubmit called for section ${sectionId} with data:`, data);
    event?.stopPropagation();
    setSaveButtonDisabled(true);
    setIsSaving(true);
    message.loading({ content: `Saving section ${sectionId}...`, key: 'saveBuyout' });

    try {
      const formattedData = {
        ...data,
        contract_start_date: data.contract_start_date ? dayjs(data.contract_start_date).format('YYYY-MM-DD') : null,
        contract_estimated_completion_date: data.contract_estimated_completion_date ? dayjs(data.contract_estimated_completion_date).format('YYYY-MM-DD') : null,
        actual_completion_date: data.actual_completion_date ? dayjs(data.actual_completion_date).format('YYYY-MM-DD') : null,
        contract_date: data.contract_date ? dayjs(data.contract_date).format('YYYY-MM-DD') : null,
        signed_contract_received_date: data.signed_contract_received_date ? dayjs(data.signed_contract_received_date).format('YYYY-MM-DD') : null,
        issued_on_date: data.issued_on_date ? dayjs(data.issued_on_date).format('YYYY-MM-DD') : null,
        owner_meeting_date: data.owner_meeting_date ? dayjs(data.owner_meeting_date).format('YYYY-MM-DD') : null,
        owner_approval_date: data.owner_approval_date ? dayjs(data.owner_approval_date).format('YYYY-MM-DD') : null,
        scope_review_meeting_date: data.scope_review_meeting_date ? dayjs(data.scope_review_meeting_date).format('YYYY-MM-DD') : null,
        spm_review_date: data.spm_review_date ? dayjs(data.spm_review_date).format('YYYY-MM-DD') : null,
        px_review_date: data.px_review_date ? dayjs(data.px_review_date).format('YYYY-MM-DD') : null,
        vp_review_date: data.vp_review_date ? dayjs(data.vp_review_date).format('YYYY-MM-DD') : null,
        loi_sent_date: data.loi_sent_date ? dayjs(data.loi_sent_date).format('YYYY-MM-DD') : null,
        loi_returned_date: data.loi_returned_date ? dayjs(data.loi_returned_date).format('YYYY-MM-DD') : null,
        subcontract_agreement_sent_date: data.subcontract_agreement_sent_date ? dayjs(data.subcontract_agreement_sent_date).format('YYYY-MM-DD') : null,
        fully_executed_sent_date: data.fully_executed_sent_date ? dayjs(data.fully_executed_sent_date).format('YYYY-MM-DD') : null,
        project_executive_date: data.project_executive_date ? dayjs(data.project_executive_date).format('YYYY-MM-DD') : null,
        cfo_date: data.cfo_date ? dayjs(data.cfo_date).format('YYYY-MM-DD') : null,
      };

      // Compute changed fields only
      const changedData = getChangedFields(formattedData, initialFormValues);
      changedData.project_id = projectId;
      changedData.commitment_id = commitmentId;
      console.log('BuyoutForm.js: Changed fields for submission:', changedData);

      await onSubmit(changedData);

      // Update the RTK Query cache with the submitted data
      dispatch(
        apiSlice.util.updateQueryData('getBuyoutData', { projectId, commitmentId }, (draft) => {
          Object.keys(changedData).forEach((key) => {
            if (draft[key] !== undefined) {
              draft[key] = changedData[key];
            }
          });
        })
      );

      message.success({ content: 'Section saved successfully', key: 'saveBuyout', duration: 2 });
      setIsEditing((prev) => ({ ...prev, [sectionId]: false }));
    } catch (error) {
      console.error(`BuyoutForm.js: Section save failed for ${sectionId}:`, {
        error,
        message: error.message,
        status: error.status,
        data: error.data,
      });
      const errorMessage = error.data?.details || error.data?.error || 'Unknown error';
      message.error({ content: `Failed to save section: ${errorMessage}`, key: 'saveBuyout', duration: 4 });
    } finally {
      setSaveButtonDisabled(false);
      setIsSaving(false);
    }
  };

  const toggleEdit = (sectionId) => {
    console.log(`BuyoutForm.js: Toggling edit for section ${sectionId}`);
    setIsEditing((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const getSectionsForTab = useCallback((tabKey) => {
    console.log('BuyoutForm.js: Getting sections for tab:', tabKey);
    switch (tabKey) {
      case 'buyout-details':
        return [
          { title: 'General Information', id: 'general-information' },
          { title: 'Financials', id: 'financials' },
          { title: 'Owner Approval', id: 'owner-approval' },
          { title: 'Allowances', id: 'allowances' },
          { title: 'Value Engineering', id: 'value-engineering' },
          { title: 'Long Lead Items', id: 'long-lead-items' },
        ];
      case 'contract-workflow':
        return [
          { title: 'Scope Review Meeting', id: 'contract-workflow' },
          { title: 'Contract Review and Approval', id: 'contract-workflow' },
          { title: 'Contract Execution Dates', id: 'contract-workflow' },
          { title: 'Project Timeline', id: 'contract-workflow' },
        ];
      case 'subcontract-checklist':
        return [
          { title: 'Subcontract Checklist', id: 'subcontract-checklist' },
        ];
      case 'compliance-waiver':
        return [
          { title: 'Insurance Waiver', id: 'compliance-waiver' },
          { title: 'Licensing Waiver', id: 'compliance-waiver' },
          { title: 'Scope & Value', id: 'compliance-waiver' },
          { title: 'Approval', id: 'compliance-waiver' },
        ];
      case 'history':
        return [
          { title: 'History', id: 'history' },
        ];
      default:
        return [];
    }
  }, []);

  const sections = useMemo(() => getSectionsForTab(activeTab), [activeTab, getSectionsForTab]);

  const handleNavClick = useCallback((key) => {
    console.log('BuyoutForm.js: Navigating to section:', key);
    setActiveSection(key);
    const element = document.getElementById(key);
    const container = sectionsContainerRef.current;
    if (element && container) {
      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const offsetTop = elementRect.top - containerRect.top + container.scrollTop - 16;
      container.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  }, []);

  const renderContent = () => {
    console.log('BuyoutForm.js: Rendering content for activeTab:', activeTab);
    switch (activeTab) {
      case 'buyout-details':
        return (
          <LoadingWrapper isLoading={isLoading || isFetching} isError={isError} errorMessage="Error loading buyout details">
            <Collapse defaultActiveKey={sections.map((s) => s.id)}>
              {sections.map((section) => (
                <Panel
                  header={section.title}
                  key={section.id}
                  className="buyout-form-panel"
                  extra={
                    !isEditing[section.id] && (
                      <Button
                        className="buyout-form-edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEdit(section.id);
                        }}
                      >
                        <EditOutlined /> Edit
                      </Button>
                    )
                  }
                >
                  <div id={section.id}>
                    {section.id === 'general-information' && (
                      <GeneralInformationSection
                        control={control}
                        isEditing={isEditing[section.id] || false}
                      />
                    )}
                    {section.id === 'financials' && (
                      <FinancialsSection
                        control={control}
                        setValue={setValue}
                        projectId={projectId}
                        isEditing={isEditing[section.id] || false}
                      />
                    )}
                    {section.id === 'owner-approval' && (
                      <OwnerApprovalSection
                        control={control}
                        isEditing={isEditing[section.id] || false}
                      />
                    )}
                    {section.id === 'allowances' && (
                      <AllowanceSection
                        control={control}
                        allowanceIncluded={allowanceIncluded}
                        allowanceFields={allowanceFields}
                        appendAllowance={appendAllowance}
                        removeAllowance={removeAllowance}
                        isEditing={isEditing[section.id] || false}
                      />
                    )}
                    {section.id === 'value-engineering' && (
                      <ValueEngineeringSection
                        control={control}
                        veOffered={veOffered}
                        veFields={veFields}
                        appendVe={appendVe}
                        removeVe={removeVe}
                        isEditing={isEditing[section.id] || false}
                      />
                    )}
                    {section.id === 'long-lead-items' && (
                      <LongLeadSection
                        control={control}
                        longLeadIncluded={longLeadIncluded}
                        leadFields={leadFields}
                        appendLead={appendLead}
                        removeLead={removeLead}
                        isEditing={isEditing[section.id] || false}
                      />
                    )}
                  </div>
                  {isEditing[section.id] && (
                    <div className="buyout-form-panel-footer">
                      <Space>
                        <Button
                          className="buyout-form-cancel-button"
                          onClick={() => toggleEdit(section.id)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="buyout-form-save-button"
                          onClick={(e) => {
                            console.log(`BuyoutForm.js: Save button clicked for section ${section.id}`);
                            handleSubmit((data) => onSectionSubmit(section.id)(data, e))();
                          }}
                          disabled={saveButtonDisabled}
                        >
                          Save
                        </Button>
                      </Space>
                    </div>
                  )}
                </Panel>
              ))}
            </Collapse>
          </LoadingWrapper>
        );
      case 'contract-workflow':
        return <ContractWorkflowSection control={control} />;
      case 'subcontract-checklist':
        return <SubcontractChecklistSection control={control} />;
      case 'compliance-waiver':
        return <ComplianceWaiverSection control={control} />;
      case 'history':
        return <HistorySection historyData={historyData} />;
      default:
        return null;
    }
  };

  const collapsed = isSmallScreen ? userCollapsed : false;

  return (
    <div>
      {Object.keys(errors).length > 0 && (
        <Alert
          message="Form Validation Errors"
          description={Object.values(errors).map((err) => err.message).join(', ')}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}
      <Layout className="buyout-form-layout">
        <Sider width={250} collapsed={collapsed} collapsedWidth={0} className="buyout-form-sider">
          <div className="buyout-form-sider-content">
            <Menu
              mode="inline"
              selectedKeys={[activeSection]}
              items={sections.map((section) => ({
                key: section.id,
                label: section.title,
                onClick: () => handleNavClick(section.id),
              }))}
              className="buyout-form-sider-menu"
            />
            <div className="buyout-form-sider-comments">
              <CommentsSection
                projectId={projectId}
                itemId={commitmentId}
                userData={userData}
                toolName={toolName || "BuyoutForm"}
              />
            </div>
          </div>
        </Sider>
        <Content className="buyout-form-content">
          {isSmallScreen && (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setUserCollapsed(!userCollapsed)}
              className="buyout-form-toggle-button"
            />
          )}
          <div className="buyout-form-sections-container" ref={sectionsContainerRef}>
            {renderContent()}
          </div>
          <FloatButton
            shape="circle"
            icon={<SaveOutlined />}
            type="primary"
            onClick={handleSubmit(onFormSubmit)}
            tooltip="Save"
            disabled={saveButtonDisabled || !isValid}
            htmlType="submit"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !saveButtonDisabled && isValid) {
                handleSubmit(onFormSubmit)();
              }
            }}
          />
          <FloatButton
            shape="circle"
            icon={<CloseOutlined />}
            onClick={onCancel}
            tooltip="Cancel"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onCancel();
              }
            }}
          />
        </Content>
      </Layout>
    </div>
  );
};

BuyoutForm.propTypes = {
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  commitmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialData: PropTypes.object,
  commitments: PropTypes.array.isRequired,
  budgetLineItems: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  userData: PropTypes.object,
  toolName: PropTypes.string,
};

BuyoutForm.defaultProps = {
  toolName: "BuyoutForm",
};

export default React.memo(BuyoutForm);