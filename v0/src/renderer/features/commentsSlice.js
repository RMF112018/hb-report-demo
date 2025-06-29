// src/renderer/features/commentsSlice.js
// Redux slice for managing comments data and unsynced changes
// Use by importing actions in components for state updates
// Reference: https://redux-toolkit.js.org/usage/usage-guide

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  comments: {}, // Keyed by `${toolName}-${projectId}-${itemId}` (e.g., "BuyoutForm-123-456")
  unsyncedComments: {}, // Keyed by the same key, storing comments pending sync with backend
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Set fetched comments for a specific key
    setComments: (state, action) => {
      const { key, comments } = action.payload;
      state.comments[key] = comments;
    },
    // Add a new comment (or reply) to the state, marking it as pending
    addComment: (state, action) => {
      const { key, comment, tempId } = action.payload;
      if (!state.comments[key]) state.comments[key] = [];
      state.comments[key].push({ ...comment, pending: true });
      if (!state.unsyncedComments[key]) state.unsyncedComments[key] = [];
      state.unsyncedComments[key].push({ ...comment, tempId });
    },
    // Mark a comment as synced after successful backend post
    markCommentSynced: (state, action) => {
      const { key, tempId, backendComment } = action.payload;
      // Update the comment in the comments array
      const commentIndex = state.comments[key].findIndex(c => c.id === tempId && c.pending);
      if (commentIndex !== -1) {
        state.comments[key][commentIndex] = { ...backendComment, pending: false };
      }
      // Remove from unsyncedComments
      state.unsyncedComments[key] = state.unsyncedComments[key].filter(c => c.tempId !== tempId);
      if (state.unsyncedComments[key].length === 0) {
        delete state.unsyncedComments[key];
      }
    },
    // Clear unsynced comments for a specific key
    clearUnsyncedComments: (state, action) => {
      const { key } = action.payload;
      delete state.unsyncedComments[key];
      if (state.comments[key]) {
        state.comments[key] = state.comments[key].filter(c => !c.pending);
      }
    },
  },
});

export const { setComments, addComment, markCommentSynced, clearUnsyncedComments } = commentsSlice.actions;
export default commentsSlice.reducer;