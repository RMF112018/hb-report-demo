// src/renderer/components/__tests__/Buyout.test.js
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import Buyout from '../Buyout';
import { Modal } from 'antd';

// Mock Electron API
const mockElectronAPI = {
  getBuyoutTestData: jest.fn().mockResolvedValue([
    {
      number: 'SC-001',
      contractCompany: 'Test Company',
      title: 'Test Contract',
      status: 'Approved',
      executed: 'Yes',
      originalContractAmount: '$1000.00',
      approvedChangeOrders: '$0.00',
      totalContractAmount: '$1000.00',
      pendingChangeOrders: '$0.00',
      draftChangeOrders: '$0.00',
      invoicesAmount: '$0.00',
      totalPayments: '$0.00',
      percentPaid: '0.00%',
      totalRemaining: '$0.00',
      private: 'No',
    },
  ]),
  deleteBuyout: jest.fn().mockResolvedValue([]),
};
global.window.electronAPI = mockElectronAPI;

// Mock Modal.confirm
jest.spyOn(Modal, 'confirm').mockImplementation(({ onOk }) => {
  onOk();
});

describe('Buyout Component', () => {
  const defaultProps = {
    headerContent: { title: <h1>Buyout Schedule</h1> },
    selectedProject: { projectNumber: '123', name: 'Test Project' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner initially', async () => {
    await act(async () => {
      render(<Buyout {...defaultProps} />);
    });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders table with data after loading', async () => {
    await act(async () => {
      render(<Buyout {...defaultProps} />);
    });
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByText('SC-001')).toBeInTheDocument();
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });
  });

  test('triggers delete confirmation and updates data', async () => {
    await act(async () => {
      render(<Buyout {...defaultProps} />);
    });
    await waitFor(() => {
      const deleteButton = screen.getAllByLabelText('Delete buyout SC-001')[0];
      act(() => {
        deleteButton.click();
      });
    });
    await waitFor(() => {
      expect(mockElectronAPI.deleteBuyout).toHaveBeenCalledWith('SC-001');
      expect(screen.queryByText('SC-001')).not.toBeInTheDocument();
    });
  });
});