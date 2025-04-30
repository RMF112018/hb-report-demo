// src/renderer/features/buyoutSlice.js
// Redux slice for managing buyout data and changes
// Use by importing actions in components for state updates
// Reference: https://redux-toolkit.js.org/rtk-query/usage/mutations
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],        // The full grid data
  changes: {},     // Unsaved changes keyed by row ID (procore_id)
};

const buyoutSlice = createSlice({
  name: 'buyout',
  initialState,
  reducers: {
    setBuyoutData: (state, action) => {
      state.data = action.payload;
      const validRowIds = new Set(action.payload.map(row => row.procore_id)); // Numbers
      const updatedChanges = Object.fromEntries(
        Object.entries(state.changes).filter(([rowId]) => validRowIds.has(Number(rowId))) // Convert rowId to number
      );
      state.changes = updatedChanges;
    },
    updateBuyoutCell: (state, action) => {
      const { rowId, field, value } = action.payload;
      const rowIndex = state.data.findIndex(row => row.procore_id === rowId);
      if (rowIndex !== -1) {
        state.data[rowIndex][field] = value; // Update local data
        if (!state.changes[rowId]) state.changes[rowId] = {};
        state.changes[rowId][field] = value; // Track the change
      }
    },
    clearChanges: (state) => {
      state.changes = {}; // Clear changes after syncing
    },
  },
});

export const { setBuyoutData, updateBuyoutCell, clearChanges } = buyoutSlice.actions;
export default buyoutSlice.reducer;