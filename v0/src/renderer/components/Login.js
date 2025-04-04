// src/renderer/components/Login.js
// Login component for HB Report with email verification, password setup, and dev-only user sync
// Import this component in App.jsx to render the login screen
// Reference: https://ant.design/components/input#api

import React, { useState } from 'react';
import { Button, Input, message, Space, Typography, Radio } from 'antd';
import logger from '../utils/logger.js';
import HBLogo from '../assets/images/HB_Logo_Large.png';
import '../styles/Login.css';

const { Text, Link } = Typography;
const isDev = process.env.NODE_ENV === 'development'; // Check for dev environment

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailVerified, setEmailVerified] = useState(null);
  const [procoreUserId, setProcoreUserId] = useState(null);
  const [emailMessage, setEmailMessage] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    try {
      const procoreUserId = await window.electronAPI.login({ email: username, password });
      logger.info('Login successful', { procoreUserId });
      onLoginSuccess(procoreUserId);
    } catch (error) {
      logger.error('Login failed', { message: error.message });
      message.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    setCreateMode(true);
    setEmailVerified(null);
    setEmailMessage('');
  };

  const handleVerifyEmail = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.verifyEmail(email);
      if (!result.exists) {
        setEmailVerified(false);
        setEmailMessage(result.message);
        message.error(result.message);
      } else if (result.hasPassword) {
        setEmailVerified(false);
        setEmailMessage(result.message);
        message.info(result.message);
      } else {
        setEmailVerified(true);
        setProcoreUserId(result.procore_user_id);
        setEmailMessage('');
        message.success('Email verified, please set your password');
      }
    } catch (error) {
      logger.error('Email verification failed', { message: error.message });
      message.error('Email verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSetup = async () => {
    if (newPassword !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await window.electronAPI.createUser({ procore_user_id: procoreUserId, email, password: newPassword });
      logger.info('Account created successfully', { procore_user_id: procoreUserId, email });
      message.success('Account created successfully');
      onLoginSuccess(procoreUserId);
    } catch (error) {
      logger.error('Account creation failed', { message: error.message });
      message.error('Account creation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncUsers = async () => { // New handler
    setLoading(true);
    try {
      await window.electronAPI.syncUsers();
      logger.info('Manual user sync initiated');
      message.success('Users synced successfully');
    } catch (error) {
      logger.error('User sync failed', { message: error.message });
      message.error('Failed to sync users');
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = () => {
    logger.info('DEV login button clicked');
    onLoginSuccess();
  };

  return (
    <div className="login-container">
      <div className="left-pane">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <img src={HBLogo} alt="HB Report Logo" className="logo" />
          <Text strong style={{ fontSize: '24px', color: 'var(--hb-blue)' }}>HB Report</Text>
        </div>

        <Space direction="vertical" size="middle" style={{ width: '100%', maxWidth: '300px', marginBottom: '16px' }}>
          {!createMode ? (
            <>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
              <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="primary"
                onClick={handleLogin}
                loading={loading}
                style={{ width: '100%' }}
              >
                Login
              </Button>
            </>
          ) : (
            <>
              <Input
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || emailVerified}
              />
              {!emailVerified && (
                <Button
                  onClick={handleVerifyEmail}
                  loading={loading}
                  style={{ width: '100%' }}
                >
                  Verify Email Address
                </Button>
              )}
              {emailVerified && (
                <>
                  <Input.Password
                    placeholder="Set Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                  />
                  <Input.Password
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    type="primary"
                    onClick={handleCompleteSetup}
                    loading={loading}
                    style={{ width: '100%' }}
                  >
                    Complete Setup
                  </Button>
                </>
              )}
              {emailMessage && <Text type="danger">{emailMessage}</Text>}
            </>
          )}
        </Space>

        {!createMode && (
          <div style={{ marginBottom: '16px', textAlign: 'left' }}>
            <Radio
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            >
              Remember Me
            </Radio>
          </div>
        )}

        {!createMode ? (
          <Space direction="horizontal" size="small" style={{ marginBottom: '24px' }}>
            <Link onClick={() => logger.info('Forgot username or password clicked')} disabled={loading}>
              Forgot username or password
            </Link>
            <Text>|</Text>
            <Link onClick={handleCreateAccount} disabled={loading}>
              Create HB Report Account
            </Link>
          </Space>
        ) : null}

        <div style={{ marginTop: 'auto' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {isDev && !createMode && ( // Show only in dev and not in create mode
              <Button
                onClick={handleSyncUsers}
                disabled={loading}
                style={{ width: '100%' }}
              >
                Sync Users (Dev)
              </Button>
            )}
            <Button
              className="dev-login-button"
              onClick={handleDevLogin}
              disabled={loading}
            >
              DEV Login
            </Button>
          </Space>
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