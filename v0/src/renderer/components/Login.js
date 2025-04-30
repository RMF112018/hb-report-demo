// src/renderer/components/Login.js
// Login component with fixed state management for create-user workflow, including email verification and "Remember Me" functionality
// Import in App.jsx to render the login screen
// Reference: https://ant.design/components/input#api
// Reference: https://ant.design/components/switch#api

import React, { useState, useEffect } from 'react';
import { Button, Input, message, Space, Typography, Switch } from 'antd';
import logger from '../utils/logger.js';
import HBLogo from '../assets/images/HB_Logo_Large.png';
import '../styles/Login.css';

const { Text, Link } = Typography;
const isDev = process.env.NODE_ENV === 'development';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
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
  const [verificationStep, setVerificationStep] = useState('input');

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.login({ email: username, password });
      logger.info('Login successful', { procoreUserId: result.procore_user_id });
      onLoginSuccess(result.procore_user_id, username, result.token);

      if (rememberMe) {
        try {
          const encryptedPassword = await window.electronAPI.encryptPassword(password);
          const timestamp = Date.now();
          await window.electronAPI.storeRememberMeData({
            email: username,
            password: encryptedPassword,
            timestamp,
          });
          logger.info('Stored Remember Me data', { email: username });
        } catch (storageError) {
          logger.error('Failed to store Remember Me data', { message: storageError.message });
          message.warning('Login succeeded, but "Remember Me" data could not be saved.');
        }
      } else {
        try {
          await window.electronAPI.clearRememberMeData();
          logger.info('Cleared Remember Me data');
        } catch (clearError) {
          logger.error('Failed to clear Remember Me data', { message: clearError.message });
        }
      }
    } catch (error) {
      logger.error('Login failed', { message: error.message });
      message.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadRememberMeData = async () => {
      try {
        const data = await window.electronAPI.getRememberMeData();
        if (!data) {
          logger.debug('No Remember Me data found');
          return;
        }
        const { email, password, timestamp } = data;
        if (!email || !password || !timestamp) {
          logger.warn('Invalid Remember Me data format', { data });
          await window.electronAPI.clearRememberMeData();
          return;
        }

        const now = Date.now();
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        if (now - timestamp < thirtyDaysInMs) {
          setUsername(email);
          try {
            const decryptedPassword = await window.electronAPI.decryptPassword(password);
            setPassword(decryptedPassword);
            setRememberMe(true);
            logger.info('Loaded Remember Me data successfully', { email });

            try {
              const result = await window.electronAPI.login({ email, password: decryptedPassword });
              logger.debug('Remember Me credentials validated', { procoreUserId: result.procore_user_id });
            } catch (loginError) {
              logger.error('Remember Me credentials invalid, clearing data', { message: loginError.message });
              await window.electronAPI.clearRememberMeData();
              setUsername('');
              setPassword('');
              setRememberMe(false);
              message.warning('Stored credentials are invalid and have been cleared. Please log in again.');
            }
          } catch (decryptError) {
            logger.error('Failed to decrypt Remember Me password', { message: decryptError.message });
            await window.electronAPI.clearRememberMeData();
            setUsername('');
            setPassword('');
            setRememberMe(false);
            message.warning('Failed to decrypt stored password. Please log in again.');
          }
        } else {
          logger.info('Remember Me data expired', { timestamp });
          await window.electronAPI.clearRememberMeData();
        }
      } catch (error) {
        logger.error('Failed to load Remember Me data', { message: error.message });
      }
    };
    loadRememberMeData();

    window.electronAPI.onVerifyEmailFromLink((token) => {
      handleVerifyToken(token);
    });

    return () => {};
  }, []);

  const handleCreateAccount = () => {
    setCreateMode(true);
    setVerificationStep('input');
    setEmailVerified(null);
    setProcoreUserId(null);
    setEmailMessage('');
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleVerifyEmail = async () => {
    if (!email) {
      message.error('Please enter an email address');
      return;
    }
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
        message.success('Email found! Please proceed to create your account.');
        setVerificationStep('setup');
      }
    } catch (error) {
      logger.error('Email verification failed', { message: error.message });
      message.error(error.message || 'Failed to verify email address');
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    if (newPassword !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }
    if (!procoreUserId || !email) {
      message.error('Missing email or user ID from verification');
      logger.error('Incomplete data for account creation', { procoreUserId, email });
      return;
    }
    setLoading(true);
    try {
      const payload = { procore_user_id: procoreUserId, email, password: newPassword };
      logger.debug('Sending verification email with payload', payload);
      const result = await window.electronAPI.createUser(payload);
      logger.info('Verification email sent', { procore_user_id: procoreUserId, email });
      message.success(result.message);
      setVerificationStep('verify');
    } catch (error) {
      logger.error('Failed to send verification email', { message: error.message });
      message.error(error.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (token) => {
    setLoading(true);
    try {
      const result = await window.electronAPI.verifyEmailToken(token);
      logger.info('Email verified successfully', { procore_user_id: result.procore_user_id });
      message.success('Email verified! You can now log in.');
      setCreateMode(false);
      setVerificationStep('input');
      setEmailVerified(null);
      setProcoreUserId(null);
      setEmailMessage('');
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
      onLoginSuccess(result.procore_user_id, email, null);
    } catch (error) {
      logger.error('Token verification failed', { message: error.message });
      message.error(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncUsers = async () => {
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

  const handleBackToLogin = () => {
    setCreateMode(false);
    setVerificationStep('input');
    setEmailVerified(null);
    setProcoreUserId(null);
    setEmailMessage('');
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
                disabled={loading}
              />
              <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
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
              {verificationStep === 'input' && (
                <>
                  <Input
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    onClick={handleVerifyEmail}
                    loading={loading}
                    style={{ width: '100%' }}
                  >
                    Verify Email Address
                  </Button>
                </>
              )}
              {verificationStep === 'setup' && (
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
                    onClick={handleSendVerificationEmail}
                    loading={loading}
                    style={{ width: '100%' }}
                  >
                    Send Verification Email
                  </Button>
                </>
              )}
              {verificationStep === 'verify' && (
                <>
                  <Text>
                    We’ve sent a verification link to {email}. Please check your inbox and click the link to complete registration.
                  </Text>
                  <Button
                    onClick={handleBackToLogin}
                    disabled={loading}
                    style={{ width: '100%' }}
                  >
                    Back to Login
                  </Button>
                </>
              )}
              {emailMessage && (
                <Text type={emailVerified === false ? 'danger' : 'success'}>{emailMessage}</Text>
              )}
            </>
          )}
        </Space>

        {!createMode && (
          <div style={{ marginBottom: '16px', textAlign: 'left' }}>
            <Switch
              checked={rememberMe}
              onChange={(checked) => setRememberMe(checked)}
              disabled={loading}
            />
            <span style={{ marginLeft: 8 }}>Remember Me</span>
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
            {isDev && !createMode && (
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