// src/renderer/utils/constants.js
// Centralized constants for field options in HB Report
// Use these in form components to ensure consistency
// Reference: None (general best practice)

export const BUYOUT_STATUSES = [
    'Pending',
    'In Progress',
    'LOI Sent',
    'Contract Sent',
    'Contract Executed',
    'On Hold',
  ];
  
  export const CHECKLIST_STATUSES = [
    { value: 'NR', label: 'Not Required' },
    { value: 'P', label: 'Pending (required, in progress)' },
    { value: 'Y', label: 'Yes (received)' },
    { value: 'N', label: 'No (required, not received)' },
  ];
  
  export const APPROVAL_STATUSES = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
  ];
  
  export const WAIVER_LEVELS = ['Project', 'Global'];
  
  export const EMPLOYEES_ON_SITE_OPTIONS = ['Yes', 'No'];