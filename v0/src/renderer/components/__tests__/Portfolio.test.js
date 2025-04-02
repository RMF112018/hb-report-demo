// src/renderer/components/__tests__/Portfolio.test.js
// Unit and integration tests for Portfolio.js component
// Run with `npm test` after setting up Jest and dependencies
// Reference: https://jestjs.io/docs/getting-started
// *Additional Reference*: https://testing-library.com/docs/react-testing-library/intro/

import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import Portfolio from '../Portfolio.js';
import logger from '../../utils/logger.js';

// Mock dependencies
jest.mock('../TableModule.js', () => ({ data, columns, loading, ...props }) => (
  <div data-testid="table-module" data-loading={loading.toString()}>
    {loading ? 'Loading...' : data.map((item, index) => (
      <div key={index} data-testid={`row-${item.id}`} data-active={item.active}>
        {item.name} - {item.number}
      </div>
    ))}
  </div>
));
jest.mock('../ComponentHeader.js', () => ({ title, actions }) => (
  <div data-testid="header">
    {title}
    {actions && <div data-testid="header-actions">{actions}</div>}
  </div>
));
jest.mock('../../utils/logger.js', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// Mock window.electronAPI
const mockPortfolioData = [
  { id: 6, name: 'Orchard Project 1', number: '24-863-00', active: 0 },
  { id: 7, name: 'Jade Project 2', number: '23-450-00', active: 1 },
];
beforeAll(() => {
  window.electronAPI = {
    getPortfolioTestData: jest.fn().mockResolvedValue(mockPortfolioData),
    deletePortfolio: jest.fn().mockResolvedValue(mockPortfolioData.slice(1)),
  };
});
afterEach(() => {
  jest.clearAllMocks();
});

describe('Portfolio Component', () => {
  const mockOnProjectSelect = jest.fn();
  const defaultProps = {
    onProjectSelect: mockOnProjectSelect,
    headerContent: {
      title: <h1>Portfolio</h1>,
      actions: null,
    },
  };

  test('renders without crashing', () => {
    render(<Portfolio {...defaultProps} />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search projects')).toBeInTheDocument();
  });

  test('fetches and displays portfolio data on mount', async () => {
    render(<Portfolio {...defaultProps} />);
    await waitFor(() => {
      expect(window.electronAPI.getPortfolioTestData).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('row-7')).toHaveTextContent('Jade Project 2 - 23-450-00'); // Active by default
    });
    expect(logger.info).toHaveBeenCalledWith('Portfolio data fetched successfully', { count: 2 });
  });

  test('handles fetch error and shows message', async () => {
    window.electronAPI.getPortfolioTestData.mockRejectedValueOnce(new Error('Fetch failed'));
    const messageErrorSpy = jest.spyOn(require('antd'), 'message').mockImplementation(() => ({
      error: jest.fn(),
    }));
    render(<Portfolio {...defaultProps} />);
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith('Failed to fetch portfolio data', expect.any(Object));
      expect(messageErrorSpy.error).toHaveBeenCalledWith('Failed to load portfolio data. Please try again.');
    });
    expect(screen.queryByTestId('row-6')).not.toBeInTheDocument();
    messageErrorSpy.mockRestore();
  });

  test('filters data by status correctly', async () => {
    render(<Portfolio {...defaultProps} />);
    await waitFor(() => expect(screen.getByTestId('row-7')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('Filter by status'), { target: { value: 'Inactive' } });
    await waitFor(() => {
      expect(screen.getByTestId('row-6')).toBeInTheDocument();
      expect(screen.queryByTestId('row-7')).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Filter by status'), { target: { value: 'All' } });
    await waitFor(() => {
      expect(screen.getByTestId('row-6')).toBeInTheDocument();
      expect(screen.getByTestId('row-7')).toBeInTheDocument();
    });
  });

  test('filters data by global search', async () => {
    render(<Portfolio {...defaultProps} />);
    await waitFor(() => expect(screen.getByTestId('row-7')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Search projects'), { target: { value: 'Orchard' } });
    await waitFor(() => {
      expect(screen.getByTestId('row-6')).toBeInTheDocument();
      expect(screen.queryByTestId('row-7')).not.toBeInTheDocument();
    });
  });

  test('triggers onProjectSelect when row is clicked', async () => {
    render(<Portfolio {...defaultProps} />);
    await waitFor(() => expect(screen.getByTestId('row-7')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('row-7'));
    expect(mockOnProjectSelect).toHaveBeenCalledWith({ projectNumber: '23-450-00', name: 'Jade Project 2' });
    expect(logger.info).toHaveBeenCalledWith('Row clicked', { project: '23-450-00' });
  });

  test('clears filters and resets state on Clear All click', async () => {
    render(<Portfolio {...defaultProps} />);
    await waitFor(() => expect(screen.getByTestId('row-7')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Search projects'), { target: { value: 'Jade' } });
    fireEvent.change(screen.getByLabelText('Group by column'), { target: { value: 'state' } });
    fireEvent.change(screen.getByLabelText('Filter by status'), { target: { value: 'Inactive' } });

    fireEvent.click(screen.getByText('Clear All'));
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search projects')).toHaveValue('');
      expect(screen.getByLabelText('Group by column')).toHaveValue('None');
      expect(screen.getByLabelText('Filter by status')).toHaveValue('Active');
      expect(screen.getByTestId('row-7')).toBeInTheDocument();
      expect(screen.queryByTestId('row-6')).not.toBeInTheDocument();
    });
  });

  test('deletes a project and updates table', async () => {
    const modalConfirmSpy = jest.spyOn(require('antd'), 'Modal').mockImplementation(({ onOk }) => {
      onOk();
      return { destroy: jest.fn() };
    });
    const messageSuccessSpy = jest.spyOn(require('antd'), 'message').mockImplementation(() => ({
      success: jest.fn(),
    }));

    render(<Portfolio {...defaultProps} />);
    await waitFor(() => expect(screen.getByTestId('row-6')).toBeInTheDocument());

    const deleteButton = screen.getByLabelText('Delete project 24-863-00');
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(window.electronAPI.deletePortfolio).toHaveBeenCalledWith(6);
      expect(screen.queryByTestId('row-6')).not.toBeInTheDocument();
      expect(screen.getByTestId('row-7')).toBeInTheDocument();
      expect(messageSuccessSpy.success).toHaveBeenCalledWith('Project deleted successfully!');
    });

    modalConfirmSpy.mockRestore();
    messageSuccessSpy.mockRestore();
  });

  test('handles delete error gracefully', async () => {
    window.electronAPI.deletePortfolio.mockRejectedValueOnce(new Error('Delete failed'));
    const modalConfirmSpy = jest.spyOn(require('antd'), 'Modal').mockImplementation(({ onOk }) => {
      onOk();
      return { destroy: jest.fn() };
    });
    const messageErrorSpy = jest.spyOn(require('antd'), 'message').mockImplementation(() => ({
      error: jest.fn(),
    }));

    render(<Portfolio {...defaultProps} />);
    await waitFor(() => expect(screen.getByTestId('row-6')).toBeInTheDocument());

    const deleteButton = screen.getByLabelText('Delete project 24-863-00');
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(messageErrorSpy.error).toHaveBeenCalledWith('Failed to delete project.');
      expect(screen.getByTestId('row-6')).toBeInTheDocument();
    });

    modalConfirmSpy.mockRestore();
    messageErrorSpy.mockRestore();
  });

  test('displays loading state during data fetch', async () => {
    window.electronAPI.getPortfolioTestData.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<Portfolio {...defaultProps} />);
    expect(screen.getByTestId('table-module')).toHaveTextContent('Loading...');
  });

  test('validates required props', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Portfolio />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('The prop `onProjectSelect` is marked as required'),
      expect.anything()
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('The prop `headerContent` is marked as required'),
      expect.anything()
    );
    consoleErrorSpy.mockRestore();
  });
});