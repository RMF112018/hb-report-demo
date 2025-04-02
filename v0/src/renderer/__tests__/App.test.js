// src/renderer/__tests__/App.test.js
// Integration tests for App.js to verify global navigation functionality
// Run with `npm test` to verify functionality
// Reference: https://testing-library.com/docs/react-testing-library/intro

import { render, fireEvent } from '@testing-library/react';
import App from '../App';

// Mock the Login component to simulate login
jest.mock('../components/Login', () => ({ onLoginSuccess }) => (
  <button onClick={() => onLoginSuccess()}>Login</button>
));

// Mock other components to simplify rendering
jest.mock('../components/Portfolio', () => () => <div>Portfolio</div>);
jest.mock('../components/Buyout', () => () => <div>Buyout Schedule</div>);

describe('App Navigation', () => {
  it('navigates to Portfolio with Ctrl+1 on Windows', () => {
    // Simulate Windows platform (default from jest.setup.js)
    const { getByText } = render(<App />);

    // Simulate login
    fireEvent.click(getByText('Login'));

    // Navigate to Buyout
    fireEvent.click(getByText('Buyout Schedule'));
    expect(getByText('Buyout Schedule')).toBeInTheDocument();

    // Press Ctrl+1 to return to Portfolio
    fireEvent.keyDown(window, { key: '1', ctrlKey: true });
    expect(getByText('Portfolio')).toBeInTheDocument();
  });

  it('navigates to Portfolio with Command+1 on macOS', () => {
    // Simulate macOS platform
    Object.defineProperty(global.navigator, 'platform', {
      value: 'MacIntel',
      writable: true,
    });

    const { getByText } = render(<App />);

    // Simulate login
    fireEvent.click(getByText('Login'));

    // Navigate to Buyout
    fireEvent.click(getByText('Buyout Schedule'));
    expect(getByText('Buyout Schedule')).toBeInTheDocument();

    // Press Command+1 (metaKey) to return to Portfolio
    fireEvent.keyDown(window, { key: '1', metaKey: true });
    expect(getByText('Portfolio')).toBeInTheDocument();
  });

  it('navigates back with mouse back button', () => {
    const { getByText } = render(<App />);

    // Simulate login
    fireEvent.click(getByText('Login'));

    // Navigate to Buyout
    fireEvent.click(getByText('Buyout Schedule'));
    expect(getByText('Buyout Schedule')).toBeInTheDocument();

    // Simulate back button (Mouse Button 4)
    fireEvent.mouseDown(window, { button: 3 });
    expect(getByText('Portfolio')).toBeInTheDocument();
  });
});