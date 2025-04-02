// src/renderer/components/Login.js
// Login component for HB Report, rendering a split-pane login screen with Procore and DEV login options
// Import this component in App.jsx to render the login screen on app launch
// Reference: https://ant.design/components/button#api
// *Additional Reference*: https://react.dev/reference/react/useState

import React, { useState } from 'react';
import { Button, message } from 'antd';
import logger from '../utils/logger.js';
import HBLogo from '../assets/images/HB_Logo_Large.png';
import '../styles/Login.css';

const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleProcoreLogin = async () => {
    logger.info('Procore login button clicked');
    setLoading(true);
    try {
      await window.electronAPI.initiateProcoreAuth();
      logger.info('Procore authentication and initial sync succeeded');
      message.success('Logged in and projects synced successfully');
      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      logger.error('Procore login or sync failed:', { message: error.message, stack: error.stack });
      message.error('Login or project sync failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = () => {
    logger.info('DEV login button clicked');
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="login-container">
      <div className="left-pane">
        <img src={HBLogo} alt="HB Report Logo" className="logo" />
        <div className="button-container">
          <Button
            className="login-button"
            onClick={handleProcoreLogin}
            loading={loading}
          >
            Login with Procore
          </Button>
          <Button
            className="dev-login-button"
            onClick={handleDevLogin}
            disabled={loading}
          >
            DEV Login
          </Button>
        </div>
      </div>
      <div className="right-pane">
        <div className="right-pane-content">
          <h2>Streamline Project Reporting</h2>
          <p>
            Manage your monthly reporting with ease using HB Report. Integrated with Procore for real-time data and enhanced accuracy.
          </p>
          <Button
            className="hb-orange-btn"
            onClick={() => logger.info('Learn More button clicked')}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;