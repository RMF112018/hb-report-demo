// src/renderer/apiSlice.js
// RTK Query API slice for hb-report-sync renderer
// Use these endpoints to fetch data from the backend
// Reference: https://redux-toolkit.js.org/rtk-query/overview

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    prepareHeaders: async (headers) => {
      const token = await window.electronAPI.getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Commitments', 'BudgetDetails', 'BudgetDetail', 'Projects', 'BuyoutData', 'BudgetLineItems'],
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({
        url: '/projects',
        method: 'GET',
      }),
      providesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
    getCommitments: builder.query({
      query: (projectId) => ({
        url: `/commitments?projectId=${projectId}`,
        method: 'GET',
      }),
      providesTags: (result, error, projectId) => [{ type: 'Commitments', id: projectId }],
    }),
    getBuyoutData: builder.query({
      query: ({ projectId, commitmentId }) => ({
        url: `/buyout-data?projectId=${projectId}&commitmentId=${commitmentId}`,
        method: 'GET',
      }),
      providesTags: (result, error, { projectId, commitmentId }) => [
        { type: 'BuyoutData', id: `${projectId}-${commitmentId}` },
      ],
    }),
    getBudgetDetailsByProject: builder.query({
      query: (projectId) => ({
        url: `/budget-details/project?projectId=${projectId}`,
        method: 'GET',
      }),
      providesTags: (result, error, projectId) => [{ type: 'BudgetDetails', id: projectId }],
    }),
    getBudgetDetailByRow: builder.query({
      query: (budgetRowId) => ({
        url: `/budget-details/row?budgetRowId=${budgetRowId}`,
        method: 'GET',
      }),
      providesTags: (result, error, budgetRowId) => [{ type: 'BudgetDetail', id: budgetRowId }],
    }),
    getBudgetLineItems: builder.query({
      query: (projectId) => ({
        url: `/budget-line-items?projectId=${projectId}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        console.log('Raw budgetLineItems response:', response);
        return response.filter(
          item => item.cost_code_level_3 != null && item.procore_id != null
        );
      },
      providesTags: (result, error, projectId) => [{ type: 'BudgetLineItems', id: projectId }],
    }),
    syncResource: builder.mutation({
      query: ({ resource, projectId }) => ({
        url: '/api/sync',
        method: 'POST',
        body: { resource, projectId },
      }),
      invalidatesTags: (result, error, { resource, projectId }) => {
        const tagMap = {
          projectCommitments: [{ type: 'Commitments', id: projectId }, { type: 'BuyoutData', id: projectId }],
          projectBudget: [
            { type: 'BudgetDetails', id: projectId },
            { type: 'BudgetDetail', id: projectId },
            { type: 'BudgetLineItems', id: projectId },
          ],
          projects: [{ type: 'Projects', id: 'LIST' }],
        };
        return tagMap[resource] || [];
      },
    }),
    syncProjectCommitments: builder.mutation({
      query: (projectId) => ({
        url: '/api/sync',
        method: 'POST',
        body: { resource: 'projectCommitments', projectId },
      }),
      invalidatesTags: (result, error, projectId) => [
        { type: 'Commitments', id: projectId },
        { type: 'BuyoutData', id: projectId },
      ],
    }),
    upsertBuyout: builder.mutation({
      query: (buyoutData) => ({
        url: '/buyout',
        method: 'POST',
        body: buyoutData,
      }),
      invalidatesTags: (result, error, { project_id }) => [
        { type: 'Commitments', id: project_id },
        { type: 'Buyout', id: project_id },
        // Removed { type: 'BuyoutData', id: project_id } to prevent refetch
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetCommitmentsQuery,
  useGetBuyoutDataQuery,
  useGetBudgetDetailsByProjectQuery,
  useGetBudgetDetailByRowQuery,
  useGetBudgetLineItemsQuery,
  useSyncResourceMutation,
  useSyncProjectCommitmentsMutation,
  useUpsertBuyoutMutation,
} = apiSlice;