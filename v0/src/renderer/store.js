// src/renderer/store.js
// Redux store configuration for HB Report frontend
// Import this store in main.js or index.js to provide Redux state to the app
// Reference: https://redux-toolkit.js.org/usage/usage-guide

import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice.js';
import buyoutReducer from './features/buyoutSlice.js';
import budgetLineItemsReducer from './features/budgetLineItemsSlice.js';
import commentsReducer from './features/commentsSlice.js';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    buyout: buyoutReducer,
    budgetLineItems: budgetLineItemsReducer,
    comments: commentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});