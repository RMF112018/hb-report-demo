// src/renderer/hooks/useBudgetItems.js
// Custom hook for managing budget line items in HB Report
// Use in form components to handle budget item selection and updates
// Reference: https://redux-toolkit.js.org/rtk-query/usage/queries

import { useState } from 'react';
import { useGetBudgetLineItemsQuery } from '../apiSlice.js';

const useBudgetItems = (projectId, setValue) => {
  const { data: budgetLineItems = [], isLoading, isError } = useGetBudgetLineItemsQuery(projectId, {
    skip: !projectId,
  });

  const [searchValue, setSearchValue] = useState('');

  const options = budgetLineItems
    .filter(item => item.cost_code_level_3 != null && item.procore_id != null)
    .map(item => ({
      value: String(item.procore_id),
      label: item.cost_code_level_3,
      searchText: item.cost_code_level_3.toLowerCase(),
    }));

  const handleBudgetItemChange = (value) => {
    const selectedItem = budgetLineItems.find(item => String(item.procore_id) === value);
    if (selectedItem) {
      setValue('budget', selectedItem.revised_budget || 0, { shouldValidate: false });
    } else {
      setValue('budget', 0, { shouldValidate: false });
    }
  };

  return {
    options,
    isLoading,
    isError,
    searchValue,
    setSearchValue,
    handleBudgetItemChange,
  };
};

export default useBudgetItems;