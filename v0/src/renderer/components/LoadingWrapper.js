// src/renderer/components/LoadingWrapper.js
// Reusable component for handling loading and error states
// Use in components to wrap content with loading/error UI
// Reference: https://ant.design/components/spin

import React from 'react';
import { Spin, Alert } from 'antd';
import PropTypes from 'prop-types';

const LoadingWrapper = ({ isLoading, isError, errorMessage, children }) => {
  if (isLoading) {
    return <Spin tip="Loading..." />;
  }
  if (isError) {
    return <Alert message={errorMessage || 'Error loading data'} type="error" />;
  }
  return <>{children}</>;
};

LoadingWrapper.propTypes = {
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  errorMessage: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default LoadingWrapper;