// src/renderer/hooks/useBuyoutForm.js
// Custom hook for managing BuyoutForm state and submission
// Use in BuyoutForm to handle form logic
// Reference: https://react-hook-form.com/docs
// *Additional Reference*: https://redux-toolkit.js.org/rtk-query/usage/mutations

import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpsertBuyoutMutation } from '../apiSlice.js';
import { buyoutFormSchema } from '../utils/validationSchema.js';
import { message } from 'antd';

const useBuyoutForm = ({ projectId, commitmentId, initialData, onSubmitSuccess }) => {
  const [upsertBuyout, { isLoading: isSaving, error: saveError }] = useUpsertBuyoutMutation();

  const { control, handleSubmit, reset, watch, setValue, getValues } = useForm({
    defaultValues: {
      number: '',
      vendor: '',
      title: '',
      status: '',
      executed: false,
      retainage_percent: null,
      allowances: [],
      veItems: [],
      leadTimes: [],
      // ... other defaults
    },
    resolver: yupResolver(buyoutFormSchema),
  });

  const { fields: allowanceFields, append: appendAllowance, remove: removeAllowance } = useFieldArray({ control, name: 'allowances' });
  const { fields: veFields, append: appendVe, remove: removeVe } = useFieldArray({ control, name: 'veItems' });
  const { fields: leadFields, append: appendLead, remove: removeLead } = useFieldArray({ control, name: 'leadTimes' });

  const onSubmit = async (data) => {
    try {
      const payload = {
        project_id: projectId,
        commitment_id: commitmentId || data.procore_id,
        division: data.division_description || '',
        status: data.status || 'Pending',
        bic: data.bic || 'HB',
        comments: data.additional_notes_comments || '',
        variance_to_budget: parseFloat(data.savings_overage) || 0,
        own_approve_status: data.owner_approval_status || null,
        own_approve_date: data.owner_approval_date || null,
        own_meet_date: data.owner_meeting_date || null,
        allowance_included: data.allowance_included || false,
        allowance_total: parseFloat(data.total_contract_allowances) || null,
        allowance_reconciliation_total: parseFloat(data.allowance_reconciliation_total) || null,
        allowance_variance: parseFloat(data.allowance_variance) || null,
        ve_offered: data.ve_offered || false,
        includes_long_lead: data.long_lead_included || false,
        budget_item_id: data.link_to_budget_item || null,
        owner_approval_required: data.owner_approval_required || false,
        owner_meeting_required: data.owner_meeting_required || false,
        allowances: data.allowances || [],
        veItems: data.veItems || [],
        leadTimes: data.leadTimes || [],
        // ... other fields
      };
      await upsertBuyout(payload).unwrap();
      message.success('Buyout saved successfully!');
      onSubmitSuccess();
    } catch (error) {
      message.error(`Failed to save buyout: ${error.data?.details || error.message}`);
    }
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    reset,
    watch,
    setValue,
    getValues,
    isSaving,
    saveError,
    allowanceFields,
    appendAllowance,
    removeAllowance,
    veFields,
    appendVe,
    removeVe,
    leadFields,
    appendLead,
    removeLead,
  };
};

export default useBuyoutForm;