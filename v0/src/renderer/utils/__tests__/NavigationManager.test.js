// src/renderer/utils/__tests__/NavigationManager.test.js
// Unit tests for NavigationManager to ensure correct handler registration and unregistration
// Run with `npm test` to verify functionality
// Reference: https://jestjs.io/docs/getting-started
// *Additional Reference*: https://testing-library.com/docs/react-testing-library/intro

import NavigationManager from '../NavigationManager.js';

describe('NavigationManager', () => {
  let navigationManager;

  beforeEach(() => {
    // Reset mocks for document.querySelector
    document.querySelector.mockClear();
    document.querySelector.mockReturnValue({
      scrollBy: jest.fn(),
    });

    // Create a new instance of NavigationManager for each test
    navigationManager = new NavigationManager();
  });

  afterEach(() => {
    // Clean up any event listeners to prevent interference between tests
    jest.restoreAllMocks();
  });

  it('registers and triggers keyboard shortcut on Windows', () => {
    // Simulate Windows platform (default from jest.setup.js)
    const mockHandler = jest.fn();
    navigationManager.registerKeyboardShortcut('Ctrl+S', mockHandler);

    const event = new KeyboardEvent('keydown', { key: 'S', ctrlKey: true });
    window.dispatchEvent(event);

    expect(mockHandler).toHaveBeenCalled();
  });

  it('registers and triggers keyboard shortcut on macOS', () => {
    // Simulate macOS platform
    Object.defineProperty(global.navigator, 'platform', {
      value: 'MacIntel',
      writable: true,
    });

    const mockHandler = jest.fn();
    navigationManager.registerKeyboardShortcut('Ctrl+S', mockHandler);

    // On macOS, use metaKey (Command) instead of ctrlKey
    const event = new KeyboardEvent('keydown', { key: 'S', metaKey: true });
    window.dispatchEvent(event);

    expect(mockHandler).toHaveBeenCalled();
  });

  it('unregisters keyboard shortcut', () => {
    const mockHandler = jest.fn();
    const unregister = navigationManager.registerKeyboardShortcut('Ctrl+S', mockHandler);
    unregister();

    const event = new KeyboardEvent('keydown', { key: 'S', ctrlKey: true });
    window.dispatchEvent(event);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('registers and triggers mouse back handler', () => {
    const mockHandler = jest.fn();
    navigationManager.registerMouseHandler('back', mockHandler);

    const event = new MouseEvent('mousedown', { button: 3 });
    window.dispatchEvent(event);

    expect(mockHandler).toHaveBeenCalled();
  });

  it('toggles scroll mode on wheel event with Ctrl key', () => {
    const initialScrollMode = navigationManager.getScrollMode();
    expect(initialScrollMode).toBe('ratchet');

    const event = new WheelEvent('wheel', { ctrlKey: true, deltaY: 1 });
    window.dispatchEvent(event);

    expect(navigationManager.getScrollMode()).toBe('free');
  });
});