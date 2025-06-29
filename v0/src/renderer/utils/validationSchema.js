// src/renderer/utils/validationSchema.js
// Validation schema for BuyoutForm using Yup
// Use with react-hook-form to enforce form validation
// Reference: https://github.com/jquense/yup

import * as yup from 'yup';

export const buyoutFormSchema = yup.object().shape({
  number: yup.string().required('Contract number is required'),
  vendor: yup.string().required('Vendor is required'),
  title: yup.string().required('Title is required'),
  status: yup.string().required('Status is required'),
  retainage_percent: yup.number().nullable().min(0, 'Retainage must be non-negative'),
  savings_overage: yup.number().nullable().typeError('Savings/Overage must be a number'),
  allowances: yup.array().of(
    yup.object().shape({
      item: yup.string().required('Allowance item is required'),
      value: yup.number().required('Value is required').min(0, 'Value must be non-negative'),
      reconciled: yup.boolean(),
      reconciliation_value: yup.number().nullable().min(0, 'Reconciled value must be non-negative'),
      variance: yup.number().nullable(),
    })
  ),
  // ... other fields
});