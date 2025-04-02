// jest.setup.js
// Jest setup file to configure the testing environment
// This file is automatically loaded by Jest as specified in package.json
// Reference: https://jestjs.io/docs/configuration
// *Additional Reference*: https://testing-library.com/docs/react-testing-library/setup

import '@testing-library/jest-dom';

// Mock any additional browser APIs if needed
// For example, mock `document.querySelector` behavior for NavigationManager
document.querySelector = jest.fn().mockReturnValue({
  scrollBy: jest.fn(),
});

// Mock navigator.platform for platform-specific shortcut handling
Object.defineProperty(global.navigator, 'platform', {
  value: 'Win32', // Default to Windows for tests
  writable: true, // Allow tests to override
});