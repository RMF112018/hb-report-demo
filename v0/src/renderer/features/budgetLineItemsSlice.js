// src/renderer/features/budgetLineItemsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array of { costCode, category, label: `${costCode} - ${category}` }
};

const budgetLineItemsSlice = createSlice({
  name: 'budgetLineItems',
  initialState,
  reducers: {
    setBudgetLineItems: (state, action) => {
      state.items = action.payload.map(item => ({
        costCode: item.costCode,
        category: item.category,
        label: `${item.costCode} - ${item.category}`,
      }));
    },
    clearBudgetLineItems: (state) => {
      state.items = [];
    },
  },
});

export const { setBudgetLineItems, clearBudgetLineItems } = budgetLineItemsSlice.actions;
export default budgetLineItemsSlice.reducer;