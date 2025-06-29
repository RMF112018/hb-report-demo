// src/renderer/features/budgetSlice.js
// Redux slice for managing budget data and changes
// Use by importing actions in components for state updates
// Reference: https://redux-toolkit.js.org/rtk-query/usage/mutations

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],        // The full grid data
  changes: {},     // Unsaved changes keyed by budgetItemId
  items: [],
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setBudgetData: (state, action) => {
      state.data = action.payload;
      const validRowIds = new Set(action.payload.map(row => row.budgetItemId)); // Numbers
      const updatedChanges = Object.fromEntries(
        Object.entries(state.changes).filter(([rowId]) => validRowIds.has(Number(rowId))) // Convert rowId to number
      );
      state.changes = updatedChanges;
    },
    updateBudgetCell: (state, action) => {
      const { budgetItemId, field, value } = action.payload;
      const rowIndex = state.data.findIndex(row => row.budgetItemId === budgetItemId);
      if (rowIndex !== -1) {
        state.data[rowIndex][field] = value; // Update local data
        if (!state.changes[budgetItemId]) state.changes[budgetItemId] = {};
        state.changes[budgetItemId][field] = value; // Track the change
      }
    },
    clearChanges: (state) => {
      state.changes = {}; // Clear changes after syncing
    },
  },
});

export const { setBudgetLineItems, clearBudgetLineItems, setBudgetData, updateBudgetCell, clearChanges } = budgetSlice.actions;
export default budgetSlice.reducer;