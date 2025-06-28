// src/renderer/hooks/useBudgetItems.js
// Custom hook for managing budget line items in HB Report
// Use in form components to handle budget item selection and updates
// Reference: https://redux-toolkit.js.org/rtk-query/usage/queries

import { useState } from 'react';
import { useGetBudgetLineItemsQuery } from '../apiSlice.js';

const useBudgetItems = (projectId, setValue) => {
  // Fetch budget line items using RTK Query, skip if no projectId is provided
  const { data: budgetLineItems = [], isLoading, isError } = useGetBudgetLineItemsQuery(projectId, {
    skip: !projectId,
  });

  // State for tracking the search input value
  const [searchValue, setSearchValue] = useState('');

  // Transform budget line items into options for a dropdown/select component
  // Filter out items missing cost_code_level_3 or procore_id
  const options = budgetLineItems
    .filter(item => item.cost_code_level_3 != null && item.procore_id != null)
    .map(item => ({
      value: String(item.procore_id),          // Convert procore_id to string for consistency
      label: item.cost_code_level_3,           // Display name for the option
      searchText: item.cost_code_level_3.toLowerCase(), // Lowercase for case-insensitive search
    }));

  // Handle budget item selection and update the form's budget field
  const handleBudgetItemChange = (value) => {
    // Find the selected item by matching procore_id
    const selectedItem = budgetLineItems.find(item => String(item.procore_id) === value);
    if (selectedItem) {
      // If item exists, set the budget to its revised_budget (default to 0 if undefined)
      setValue('budget', selectedItem.revised_budget || 0, { shouldValidate: false });
    } else {
      // If no item is found (e.g., value is cleared), reset budget to 0
      setValue('budget', 0, { shouldValidate: false });
    }
  };

  // Return all necessary data and functions for the component using this hook
  return {
    options,            // Array of filtered and transformed budget items
    isLoading,          // Loading state from the query
    isError,            // Error state from the query
    searchValue,        // Current search input value
    setSearchValue,     // Function to update search input value
    handleBudgetItemChange, // Function to handle budget item selection
  };
};

export default useBudgetItems;