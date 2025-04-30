// src/renderer/components/BuyoutForm.js
// Component for creating or editing buyout records in HB Report, used within Buyout.js
// Import this component in Buyout.js to render within the main content area for adding or modifying buyout records
// Reference: https://ant.design/components/form/
// *Additional Reference*: https://react-hook-form.com/docs
// *Additional Reference*: https://s-yadav.github.io/react-number-format/docs/
// *Additional Reference*: https://ant.design/components/float-button
// *Additional Reference*: https://ant.design/components/layout
// *Additional Reference*: https://ant.design/components/steps

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Layout, Steps, Tabs, Spin, Alert, message } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useGetBuyoutDataQuery } from '../apiSlice.js';
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
  formatDate,
} from './BuyoutForm/index.js';
import { LoadingWrapper } from 'hb-report';
import { FloatButton } from 'antd';
import '../styles/BuyoutForm.css';
import dayjs from 'dayjs';

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

/**
 * Main Buyout Form component for creating or editing buyout records, with a consolidated layout and navigation sidebar using Steps
 * @param {Object} props - Component props
 * @param {string|number} props.projectId - The Procore project ID
 * @param {string|number} [props.commitmentId] - The commitment ID for editing
 * @param {Object} [props.initialData] - Initial data for editing an existing record
 * @param {Array} props.commitments - Array of all commitment records for computing history data
 * @param {Array} props.budgetLineItems - Array of budget line items for the project
 * @param {Function} props.onSubmit - Callback function to handle form submission
 * @param {Function} props.onCancel - Callback function to handle cancellation and return to table view
 * @returns {JSX.Element} Buyout Form component
 */
const BuyoutForm = ({ projectId, commitmentId, initialData, commitments, budgetLineItems, onSubmit, onCancel }) => {
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

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

  const { data: buyoutDetails, isLoading, isError } = useGetBuyoutDataQuery(
    { projectId, commitmentId },
    { skip: !projectId || !commitmentId }
  );

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      number: '',
      vendor: '',
      title: '',
      status: '',
      executed: false,
      retainage_percent: null,
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
      total_contract_allowances: null,
      allowance_reconciliation_total: null,
      allowance_variance: null,
      ve_offered: false,
      total_ve_presented: null,
      total_ve_accepted: null,
      total_ve_rejected: null,
      net_ve_savings: null,
      long_lead_included: false,
      long_lead_released: false,
      link_to_budget_item: null,
      budget: null,
      contract_value: null,
      savings_overage: null,
      allowances: [],
      veItems: [],
      leadTimes: [],
      additional_notes_comments: '',
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
    },
  });

  const allowanceIncluded = useWatch({ control, name: 'allowance_included' });
  const veOffered = useWatch({ control, name: 've_offered' });
  const longLeadIncluded = useWatch({ control, name: 'long_lead_included' });

  const { fields: allowanceFields, append: appendAllowance, remove: removeAllowance } = useFieldArray({ control, name: 'allowances' });
  const { fields: veFields, append: appendVe, remove: removeVe } = useFieldArray({ control, name: 'veItems' });
  const { fields: leadFields, append: appendLead, remove: removeLead } = useFieldArray({ control, name: 'leadTimes' });

  // Utility to sanitize date values
  const sanitizeDate = (date) => {
    if (!date) {
      console.log('sanitizeDate: Null or undefined date, returning null');
      return null;
    }
    console.log('sanitizeDate: Input date:', date, 'Type:', typeof date);
    const parsed = dayjs(date);
    if (parsed.isValid()) {
      console.log('sanitizeDate: Valid date, returning Day.js object:', parsed);
      return parsed; // Return Day.js object
    }
    console.warn('sanitizeDate: Invalid date detected:', date);
    return null;
  };

  useEffect(() => {
    if (buyoutDetails && commitmentId) {
      console.log('BuyoutForm.js: buyoutDetails received:', buyoutDetails);
      const formatCurrency = (value) => (value != null ? parseFloat(value) : null);
      const formatBoolean = (value) => !!value;

      const newData = {
        number: buyoutDetails.commitmentNumber || '',
        vendor: buyoutDetails.vendor || '',
        title: buyoutDetails.title || '',
        status: buyoutDetails.status || '',
        executed: formatBoolean(buyoutDetails.isExecuted),
        retainage_percent: buyoutDetails.defRetainage != null ? parseFloat(buyoutDetails.defRetainage) : null,
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
        link_to_budget_item: buyoutDetails.budgetItem || null,
        budget: formatCurrency(buyoutDetails.budget),
        contract_value: formatCurrency(buyoutDetails.contractAmount),
        savings_overage: formatCurrency(buyoutDetails.savingsLoss),
        allowances: buyoutDetails.allowanceItems || [],
        veItems: buyoutDetails.veItems || [],
        leadTimes: buyoutDetails.longLeadItems || [],
        additional_notes_comments: buyoutDetails.comments || '',
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
      };

      console.log('BuyoutForm.js: Sanitized buyoutDetails for reset:', newData);
      reset(newData);
    }
  }, [buyoutDetails, commitmentId, reset]);

  useEffect(() => {
    if (initialData && !commitmentId) {
      console.log('BuyoutForm.js: initialData received:', initialData);
      const formatCurrency = (value) => (value != null ? parseFloat(value) : null);
      const formatBoolean = (value) => !!value;

      const newData = {
        number: initialData.number?.toString() || '',
        vendor: initialData.vendor || '',
        title: initialData.title || '',
        status: initialData.status || '',
        executed: formatBoolean(initialData.executed),
        retainage_percent: initialData.retainage_percent != null ? parseFloat(initialData.retainage_percent) : null,
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
        allowances: initialData.allowances || [],
        veItems: initialData.veItems || [],
        leadTimes: initialData.leadTimes || [],
        additional_notes_comments: initialData.comments || '',
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
      };

      console.log('BuyoutForm.js: Sanitized initialData for reset:', newData);
      reset(newData);
    }
  }, [initialData, commitmentId, reset]);

  const onFormSubmit = async (data) => {
    console.log('BuyoutForm.js: Form submission data:', data);
    setSaveButtonDisabled(true);
    message.loading({ content: 'Saving...', key: 'saveBuyout' });

    try {
      // Convert Day.js objects to strings for submission
      const formattedData = {
        ...data,
        contract_start_date: data.contract_start_date ? dayjs(data.contract_start_date).format('MM/DD/YYYY') : null,
        contract_estimated_completion_date: data.contract_estimated_completion_date ? dayjs(data.contract_estimated_completion_date).format('MM/DD/YYYY') : null,
        actual_completion_date: data.actual_completion_date ? dayjs(data.actual_completion_date).format('MM/DD/YYYY') : null,
        contract_date: data.contract_date ? dayjs(data.contract_date).format('MM/DD/YYYY') : null,
        signed_contract_received_date: data.signed_contract_received_date ? dayjs(data.signed_contract_received_date).format('MM/DD/YYYY') : null,
        issued_on_date: data.issued_on_date ? dayjs(data.issued_on_date).format('MM/DD/YYYY') : null,
        owner_meeting_date: data.owner_meeting_date ? dayjs(data.owner_meeting_date).format('MM/DD/YYYY') : null,
        owner_approval_date: data.owner_approval_date ? dayjs(data.owner_approval_date).format('MM/DD/YYYY') : null,
        scope_review_meeting_date: data.scope_review_meeting_date ? dayjs(data.scope_review_meeting_date).format('MM/DD/YYYY') : null,
        spm_review_date: data.spm_review_date ? dayjs(data.spm_review_date).format('MM/DD/YYYY') : null,
        px_review_date: data.px_review_date ? dayjs(data.px_review_date).format('MM/DD/YYYY') : null,
        vp_review_date: data.vp_review_date ? dayjs(data.vp_review_date).format('MM/DD/YYYY') : null,
        loi_sent_date: data.loi_sent_date ? dayjs(data.loi_sent_date).format('MM/DD/YYYY') : null,
        loi_returned_date: data.loi_returned_date ? dayjs(data.loi_returned_date).format('MM/DD/YYYY') : null,
        subcontract_agreement_sent_date: data.subcontract_agreement_sent_date ? dayjs(data.subcontract_agreement_sent_date).format('MM/DD/YYYY') : null,
        fully_executed_sent_date: data.fully_executed_sent_date ? dayjs(data.fully_executed_sent_date).format('MM/DD/YYYY') : null,
        project_executive_date: data.project_executive_date ? dayjs(data.project_executive_date).format('MM/DD/YYYY') : null,
        cfo_date: data.cfo_date ? dayjs(data.cfo_date).format('MM/DD/YYYY') : null,
      };

      console.log('BuyoutForm.js: Formatted submission data:', formattedData);
      await onSubmit(formattedData);
      message.success({ content: 'Buyout saved successfully', key: 'saveBuyout', duration: 2 });
    } catch (error) {
      console.error('BuyoutForm.js: Save failed:', { error, message: error.message, data: error.data });
      message.error({ content: `Failed to save buyout: ${error.data?.details || error.message}`, key: 'saveBuyout', duration: 4 });
    } finally {
      setSaveButtonDisabled(false);
    }
  };

  // Define sections for each tab dynamically
  const getSectionsForTab = (tabKey) => {
    switch (tabKey) {
      case 'buyout-details':
        return [
          { title: 'General Information', id: 'general-information' },
          { title: 'Owner Approval', id: 'owner-approval' },
          { title: 'Allowances', id: 'allowances' },
          { title: 'Value Engineering', id: 'value-engineering' },
          { title: 'Long Lead Items', id: 'long-lead-items' },
          { title: 'Financials', id: 'financials' },
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
  };

  const [activeSection, setActiveSection] = useState(0);
  const [activeTab, setActiveTab] = useState('buyout-details');

  const sections = getSectionsForTab(activeTab);

  const handleNavClick = (index) => {
    setActiveSection(index);
    const sectionId = sections[index].id;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderTabPane = (key) => {
    switch (key) {
      case 'buyout-details':
        return (
          <TabPane tab="Buyout Details" key="buyout-details">
            <div className="tabContent">
              <LoadingWrapper isLoading={isLoading} isError={isError} errorMessage="Error loading buyout details">
                <GeneralInformationSection control={control} />
                <FinancialsSection control={control} setValue={setValue} projectId={projectId} />
                <OwnerApprovalSection control={control} />
                <AllowanceSection
                  control={control}
                  allowanceIncluded={allowanceIncluded}
                  allowanceFields={allowanceFields}
                  appendAllowance={appendAllowance}
                  removeAllowance={removeAllowance}
                />
                <ValueEngineeringSection
                  control={control}
                  veOffered={veOffered}
                  veFields={veFields}
                  appendVe={appendVe}
                  removeVe={removeVe}
                />
                <LongLeadSection
                  control={control}
                  longLeadIncluded={longLeadIncluded}
                  leadFields={leadFields}
                  appendLead={appendLead}
                  removeLead={removeLead}
                />
              </LoadingWrapper>
            </div>
          </TabPane>
        );
      case 'contract-workflow':
        return (
          <TabPane tab="Contract Workflow" key="contract-workflow">
            <div className="tabContent">
              <ContractWorkflowSection control={control} />
            </div>
          </TabPane>
        );
      case 'subcontract-checklist':
        return (
          <TabPane tab="Subcontract Checklist" key="subcontract-checklist">
            <div className="tabContent">
              <SubcontractChecklistSection control={control} />
            </div>
          </TabPane>
        );
      case 'compliance-waiver':
        return (
          <TabPane tab="Compliance Waiver" key="compliance-waiver">
            <div className="tabContent">
              <ComplianceWaiverSection control={control} />
            </div>
          </TabPane>
        );
      case 'history':
        return (
          <TabPane tab="History" key="history">
            <div className="tabContent">
              <HistorySection historyData={historyData} />
            </div>
          </TabPane>
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ height: '100vh', backgroundColor: '#f9f9f9', overflow: 'hidden' }}>
      <Sider
        width={250}
        style={{
          backgroundColor: '#f0f2f5',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          padding: '16px',
          zIndex: 10,
        }}
      >
        {activeTab === 'buyout-details' ? (
          <>
            <Steps
              direction="vertical"
              size="small"
              current={activeSection}
              onChange={handleNavClick}
              items={sections.map(section => ({ title: section.title }))}
              className="buyoutFormSteps"
            />
            <CommentsSection control={control} />
          </>
        ) : (
          <Steps
            direction="vertical"
            size="small"
            current={activeSection}
            onChange={handleNavClick}
            items={sections.map(section => ({ title: section.title }))}
            className="buyoutFormSteps"
          />
        )}
      </Sider>
      <Content style={{ marginLeft: 250, height: '100vh', overflow: 'hidden' }}>
        <div className="fixedTabsContainer">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              setActiveSection(0);
            }}
            className="fixedTabs"
            style={{ background: '#f9f9f9' }}
          >
            {renderTabPane('buyout-details')}
            {renderTabPane('contract-workflow')}
            {renderTabPane('subcontract-checklist')}
            {renderTabPane('compliance-waiver')}
            {renderTabPane('history')}
          </Tabs>
        </div>
        <FloatButton
          shape="circle"
          icon={<SaveOutlined />}
          type="primary"
          onClick={handleSubmit(onFormSubmit)}
          tooltip="Save"
          style={{ position: 'fixed', right: 72, bottom: 72, zIndex: 1000 }}
          disabled={saveButtonDisabled}
          htmlType="submit"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ' && !saveButtonDisabled) {
              handleSubmit(onFormSubmit)();
            }
          }}
        />
        <FloatButton
          shape="circle"
          icon={<CloseOutlined />}
          onClick={onCancel}
          tooltip="Cancel"
          style={{ position: 'fixed', right: 72, bottom: 16, zIndex: 1000 }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onCancel();
            }
          }}
        />
      </Content>
    </Layout>
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
};

export default React.memo(BuyoutForm);