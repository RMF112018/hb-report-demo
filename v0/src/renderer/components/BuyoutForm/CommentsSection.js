// src/renderer/components/BuyoutForm/CommentsSection.js
// Sidebar Comments Section for the Buyout Details panel using Ant Design v5 components
// Use within BuyoutForm to render a threaded comment system with reply functionality in the sidebar
// Reference: https://ant.design/components/list/
// *Additional Reference*: https://electronjs.org/docs/api/ipc-renderer
// *Additional Reference*: https://redux-toolkit.js.org/usage/usage-guide
// *Additional Reference*: https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization

import { List, Button, Typography, Space, message, Spin, Avatar, Modal, Input } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { setComments, addComment, markCommentSynced, clearUnsyncedComments } from '../../features/commentsSlice.js';

const { Text } = Typography;

// Utility to debounce a function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Memoized selectors
const selectCommentsState = (state) => state.comments.comments;
const selectUnsyncedCommentsState = (state) => state.comments.unsyncedComments;

const makeSelectComments = () =>
  createSelector(
    [selectCommentsState, (_, commentsKey) => commentsKey],
    (comments, key) => comments[key] || []
  );

const makeSelectUnsyncedComments = () =>
  createSelector(
    [selectUnsyncedCommentsState, (_, commentsKey) => commentsKey],
    (unsyncedComments, key) => unsyncedComments[key] || []
  );

// Utility to get initials from author name
const getInitials = (author) => {
  if (!author || typeof author !== 'string') return '??';
  const names = author.trim().split(/\s+/);
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
};

// Utility to sort comments
const sortCommentsByTime = (comments) => {
  const getLatestTimestamp = (comment) => {
    if (comment.replies && comment.replies.length > 0) {
      const replyTimestamps = comment.replies.map(reply => moment(reply.timestamp).valueOf());
      return Math.max(...replyTimestamps, moment(comment.timestamp).valueOf());
    }
    return moment(comment.timestamp).valueOf();
  };

  return [...comments].sort((a, b) => getLatestTimestamp(b) - getLatestTimestamp(a));
};

const CommentItem = ({ comment, level = 0, onReply, isUserDataLoaded }) => {
  const handleReplyClick = () => {
    onReply(comment);
  };

  return (
    <List.Item
      key={comment.id}
      actions={[
        <Button
          type="link"
          icon={<MessageOutlined />}
          size="small"
          onClick={handleReplyClick}
          disabled={!isUserDataLoaded}
        >
          Reply
        </Button>,
      ]}
      style={{ paddingLeft: level * 20 }}
    >
      <List.Item.Meta
        avatar={
          <Avatar className="comment-avatar" data-parentid={comment.parentId}>
            {getInitials(comment.author)}
          </Avatar>
        }
        description={moment(comment.timestamp).fromNow()}
      />
      <Text>{comment.content}</Text>
      {comment.pending && <Text type="secondary"> (Pending)</Text>}
      {comment.replies && comment.replies.length > 0 && (
        <List
          dataSource={sortCommentsByTime(comment.replies)}
          renderItem={(reply) => (
            <CommentItem
              comment={reply}
              level={level + 1}
              onReply={onReply}
              isUserDataLoaded={isUserDataLoaded}
            />
          )}
        />
      )}
    </List.Item>
  );
};

const CommentsSection = ({ projectId, itemId, userData, toolName }) => {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('new'); // 'new' or 'reply'
  const [modalContent, setModalContent] = useState('');
  const [parentComment, setParentComment] = useState(null);
  const isMountedRef = useRef(true);

  // Log the received props and handle userData loading
  useEffect(() => {
    console.log('CommentsSection.js: Received props:', { projectId, itemId, userData, toolName });
    if (userData) {
      console.log('CommentsSection.js: userData structure:', userData);
      if (userData.first_name && userData.last_name) {
        console.log('CommentsSection.js: userData has required fields, setting isUserDataLoaded to true');
        setIsUserDataLoaded(true);
      } else {
        console.warn('CommentsSection.js: userData missing required fields (first_name, last_name):', userData);
        setIsUserDataLoaded(false);
      }
    } else {
      console.warn('CommentsSection.js: userData is undefined');
      setIsUserDataLoaded(false);
    }
  }, [userData, toolName, projectId, itemId]);

  // Fallback mechanism: If userData isn't loaded after a timeout, use a default
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isUserDataLoaded) {
        console.warn('CommentsSection.js: userData not loaded after 10 seconds, using default user');
        setIsUserDataLoaded(true);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isUserDataLoaded]);

  // Validate toolName prop
  if (!toolName || typeof toolName !== 'string' || toolName.trim() === '') {
    console.error('CommentsSection.js: Invalid toolName prop:', toolName);
    throw new Error('CommentsSection.js: toolName prop is required and must be a non-empty string');
  }

  // Generate a unique key for this instance of CommentsSection
  const commentsKey = `${toolName}-${projectId}-${itemId || 'no-item'}`;

  // Use memoized selectors
  const selectComments = useMemo(makeSelectComments, []);
  const selectUnsyncedComments = useMemo(makeSelectUnsyncedComments, []);
  const comments = useSelector((state) => selectComments(state, commentsKey));
  const unsyncedComments = useSelector((state) => selectUnsyncedComments(state, commentsKey));

  // Fetch comments when the component mounts or when projectId/itemId/toolName changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log('Fetching comments with:', { projectId, itemId, toolName });
        const fetchedComments = await window.electronAPI.getComments(projectId, itemId, toolName);
        if (isMountedRef.current) {
          dispatch(setComments({ key: commentsKey, comments: fetchedComments }));
          console.log('Comments fetched and stored:', fetchedComments);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        message.error('Failed to fetch comments: ' + (error.message || 'Unknown error'));
      }
    };
    fetchComments();

    return () => {
      isMountedRef.current = false;
    };
  }, [projectId, itemId, toolName, dispatch, commentsKey]);

  // Sync unsynced comments to the backend, debounced
  const syncComments = useCallback(
    debounce(async () => {
      if (!isMountedRef.current && unsyncedComments.length > 0) {
        try {
          for (const unsyncedComment of unsyncedComments) {
            const { tempId, content, parentId } = unsyncedComment;
            console.log('Syncing unsynced comment:', { projectId, itemId, content, parentId, toolName });
            const author = userData?.first_name && userData?.last_name 
              ? `${userData.first_name} ${userData.last_name}` 
              : 'Guest User';
            const backendComment = await window.electronAPI.addComment(projectId, itemId, content, parentId, toolName, author);
            console.log('Synced comment response:', backendComment);
            dispatch(markCommentSynced({ key: commentsKey, tempId, backendComment }));
          }
          message.success('Comments synced successfully!');
        } catch (error) {
          console.error('Failed to sync comments:', error);
          message.error('Failed to sync comments: ' + (error.message || 'Unknown error'));
        }
      } else {
        console.log('No unsynced comments to sync or component is mounted:', {
          isMounted: isMountedRef.current,
          unsyncedCount: unsyncedComments.length,
        });
      }
    }, 500),
    [unsyncedComments, projectId, itemId, toolName, userData, dispatch, commentsKey]
  );

  // Trigger sync on unmount
  useEffect(() => {
    return () => {
      syncComments();
    };
  }, [syncComments]);

  // Handle adding a new comment or reply
  const handleAddComment = async (parentId = null, content) => {
    if (!content.trim()) return;
    if (!isUserDataLoaded) {
      message.error('User data not loaded. Please wait.');
      return;
    }
    setSubmitting(true);
    try {
      const tempId = Date.now();
      const author = userData?.first_name && userData?.last_name 
        ? `${userData.first_name} ${userData.last_name}` 
        : 'Guest User';
      const newComment = {
        id: tempId,
        toolId: null,
        projectId: projectId || null,
        itemId: itemId || null,
        parentId: parentId || null,
        content,
        author,
        timestamp: new Date().toISOString(),
        replies: [],
        pending: true,
      };

      console.log('Adding new comment to Redux:', newComment);
      dispatch(addComment({ key: commentsKey, comment: newComment, tempId }));

      console.log('Invoking addComment with payload:', { projectId, itemId, content, parentId, toolName, author });
      const backendComment = await window.electronAPI.addComment(projectId, itemId, content, parentId, toolName, author);
      console.log('Received backend comment:', backendComment);
      dispatch(markCommentSynced({ key: commentsKey, tempId, backendComment }));
      message.success(parentId ? 'Reply added successfully!' : 'Comment added successfully!');
    } catch (error) {
      console.error('Failed to add comment:', error);
      message.error('Failed to add comment: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
      setModalVisible(false);
      setModalContent('');
      setParentComment(null);
    }
  };

  // Open modal for new comment
  const openNewCommentModal = () => {
    setModalType('new');
    setModalVisible(true);
  };

  // Open modal for reply
  const openReplyModal = (comment) => {
    setModalType('reply');
    setParentComment(comment);
    setModalVisible(true);
  };

  // Handle modal confirm
  const handleModalConfirm = () => {
    if (modalType === 'new') {
      handleAddComment(null, modalContent);
    } else if (modalType === 'reply' && parentComment) {
      handleAddComment(parentComment.id, modalContent);
    }
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setModalVisible(false);
    setModalContent('');
    setParentComment(null);
  };

  // Render modal content
  const renderModalContent = () => {
    if (modalType === 'new') {
      return (
        <>
          <Input.TextArea
            rows={4}
            value={modalContent}
            onChange={(e) => setModalContent(e.target.value)}
            placeholder="Add a comment"
            style={{ marginBottom: 16 }}
          />
          <div className="modal-comments-container">
            {comments.filter((comment) => !comment.parentId).length > 0 && (
              <List
                dataSource={sortCommentsByTime(comments.filter((comment) => !comment.parentId))}
                renderItem={(comment) => (
                  <CommentItem
                    comment={comment}
                    onReply={openReplyModal}
                    isUserDataLoaded={isUserDataLoaded}
                  />
                )}
              />
            )}
          </div>
        </>
      );
    } else if (modalType === 'reply' && parentComment) {
      return (
        <>
          <Input.TextArea
            rows={4}
            value={modalContent}
            onChange={(e) => setModalContent(e.target.value)}
            placeholder="Add a reply"
            style={{ marginBottom: 16 }}
          />
          <div className="modal-comments-container">
            <h4>In response to:</h4>
            <List
              dataSource={[parentComment]}
              renderItem={(comment) => (
                <CommentItem
                  comment={comment}
                  onReply={openReplyModal}
                  isUserDataLoaded={isUserDataLoaded}
                />
              )}
            />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="comments-section-container">
      <div className="comments-list-container">
        {comments.filter((comment) => !comment.parentId).length > 0 && (
          <List
            dataSource={sortCommentsByTime(comments.filter((comment) => !comment.parentId))}
            header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
            itemLayout="vertical"
            renderItem={(comment) => (
              <CommentItem
                comment={comment}
                onReply={openReplyModal}
                isUserDataLoaded={isUserDataLoaded}
              />
            )}
          />
        )}
      </div>
      <Button
        type="primary"
        onClick={openNewCommentModal}
        disabled={!isUserDataLoaded}
        className="new-comment-button"
      >
        Post New Comment
      </Button>

      <Modal
        title={modalType === 'new' ? 'Add a New Comment' : 'Post a Reply'}
        visible={modalVisible}
        onOk={handleModalConfirm}
        onCancel={handleModalCancel}
        okText={modalType === 'new' ? 'Post Comment' : 'Post Reply'}
        cancelText="Cancel"
        confirmLoading={submitting}
        okButtonProps={{ disabled: !modalContent.trim() }}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

CommentsSection.propTypes = {
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userData: PropTypes.object,
  toolName: PropTypes.string.isRequired,
};

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    replies: PropTypes.array,
    parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    pending: PropTypes.bool,
  }).isRequired,
  level: PropTypes.number,
  onReply: PropTypes.func.isRequired,
  isUserDataLoaded: PropTypes.bool.isRequired,
};

export default CommentsSection;