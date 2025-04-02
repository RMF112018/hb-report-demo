// src/renderer/components/ErrorBoundary.js
// Error boundary component to catch and display errors in the React tree
// Import this in App.js to wrap the Login component
// Reference: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

import React from 'react';
import { Button } from 'antd';
import logger from '../utils/logger.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Uncaught error in component tree', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error.message}</p>
          <Button
            type="primary"
            onClick={() => window.location.reload()}
          >
            Reload App
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;