// src/renderer/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice.js';
import buyoutReducer from './features/buyoutSlice.js';
import budgetLineItemsReducer from './features/budgetLineItemsSlice.js';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    buyout: buyoutReducer,
    budgetLineItems: budgetLineItemsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});