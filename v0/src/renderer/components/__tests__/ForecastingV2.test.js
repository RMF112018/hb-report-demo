// src/renderer/components/__tests__/ForecastingV2.test.js
// Unit tests for ForecastingV2 component in HB Report with TableModuleV2 integration
// Run these tests using `node scripts/runTests.js`
// Reference: https://testing-library.com/docs/react-testing-library/intro/
// *Additional Reference*: https://jestjs.io/docs/getting-started
// *Additional Reference*: https://ant.design/components/modal#api

import React from 'react';
import { render, screen, waitFor, act, fireEvent, within } from '@testing-library/react';
import ForecastingV2 from '../ForecastingV2';
import { Modal } from 'antd';
import * as forecastingUtils from '../../utils/forecastingUtils';
import { NumericCellRenderer, MergedCellRenderer } from '../../utils/CustomCellRenderer';
import { AgGridReact } from 'ag-grid-react';

// Mock Electron API
const mockElectronAPI = {
  getForecastingTestData: jest.fn().mockResolvedValue([
    {
      costCode: '001',
      description: 'Test Cost Code',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      approvedCOs: '$500.00',
      revisedBudget: '$10000.00',
      january2023: 1000,
      february2023: 2000,
    },
  ]),
};
global.window.electronAPI = mockElectronAPI;

// Mock forecastingUtils
jest.mock('../../utils/forecastingUtils', () => ({
  fetchForecastData: jest.fn(),
  generateDateColumns: jest.fn(),
  initializeRowDataWithDateColumns: jest.fn(),
  calculateGcGrTotals: jest.fn(),
  generateCompareData: jest.fn(),
}));

// Mock AG Grid React to match TableModuleV2.js behavior
jest.mock('ag-grid-react', () => {
  const mockAgGridReact = (props) => {
    const { rowData, columnDefs, context, rowClassRules, getRowClass, 'data-testid': dataTestId } = props;
    return (
      <div data-testid={dataTestId || 'ag-grid'}>
        {rowData.map((row, index) => {
          const rowClasses = [];
          Object.entries(rowClassRules).forEach(([className, rule]) => {
            if (rule({ data: row, rowIndex: index })) rowClasses.push(className);
          });
          if (getRowClass) {
            const additionalClass = getRowClass({ node: { rowIndex: index } });
            if (additionalClass) rowClasses.push(additionalClass);
          }
          return (
            <div key={index} data-testid={`row-${index}-${dataTestId.split('-')[2]}`} className={rowClasses.join(' ')} style={{ display: 'flex' }}>
              {columnDefs.map((col) => (
                <div key={col.field} data-testid={`cell-${col.field}-${index}-${dataTestId.split('-')[2]}`} style={{ width: col.width || 100 }}>
                  {col.cellRenderer ? (
                    col.cellRenderer({
                      data: row,
                      value: col.valueGetter ? col.valueGetter({ data: row }) : row[col.field],
                      context,
                    })
                  ) : col.valueFormatter && col.valueGetter ? (
                    col.valueFormatter({ value: col.valueGetter({ data: row }) })
                  ) : col.valueGetter ? (
                    col.valueGetter({ data: row })
                  ) : (
                    row[col.field] || ''
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };
  return { AgGridReact: mockAgGridReact };
});

// Mock Ant Design components: Modal.confirm is mocked; Drawer is used as a component directly
jest.spyOn(Modal, 'confirm').mockImplementation(({ onOk }) => onOk());

// Mock Custom Cell Renderers
jest.mock('../../utils/CustomCellRenderer', () => ({
  NumericCellRenderer: jest.fn(({ value }) => <span>{value}</span>),
  MergedCellRenderer: jest.fn(({ value }) => <span>{value}</span>),
}));

describe('ForecastingV2 Component', () => {
  const defaultProps = {
    selectedProject: { projectNumber: '123', name: 'Test Project' },
    headerContent: {
      title: <h1>Budget Forecasting (Beta)</h1>,
      tabs: [
        { key: 'gc-gr', label: 'GC & GR' },
        { key: 'owner-billing', label: 'Owner Billing' },
      ],
      actions: <div>Export</div>,
    },
    activeTab: 'gc-gr',
    onTabChange: jest.fn(),
  };

  const mockRowData = [
    {
      costCode: '001',
      description: 'Test Cost Code',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      approvedCOs: '$500.00',
      revisedBudget: '$10000.00',
      january2023: 1000,
      february2023: 2000,
    },
  ];

  const mockDateColumns = [
    {
      field: 'january2023',
      headerName: 'January 2023',
      width: 120,
      cellRenderer: NumericCellRenderer,
      valueGetter: (params) => Number(params.data['january2023'] ?? 0),
      valueFormatter: (params) =>
        Number(params.value ?? 0).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      field: 'february2023',
      headerName: 'February 2023',
      width: 120,
      cellRenderer: NumericCellRenderer,
      valueGetter: (params) => Number(params.data['february2023'] ?? 0),
      valueFormatter: (params) =>
        Number(params.value ?? 0).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
  ];

  const mockCompareData = [
    {
      costCode: '001',
      description: 'Test Cost Code',
      type: 'Actual Cost',
      groupIndex: 0,
      approvedCOs: '$500.00',
      revisedBudget: '$10000.00',
      january2023: 1000,
      february2023: 2000,
    },
    {
      costCode: '001',
      description: 'Test Cost Code',
      type: 'Original',
      groupIndex: 0,
      approvedCOs: '$500.00',
      revisedBudget: '$10000.00',
      january2023: 1000,
      february2023: 2000,
    },
    {
      costCode: '001',
      description: 'Test Cost Code',
      type: 'Current Forecast',
      groupIndex: 0,
      approvedCOs: '$500.00',
      revisedBudget: '$10000.00',
      january2023: 1000,
      february2023: 2000,
    },
    {
      costCode: 'Grand Totals',
      type: '',
      description: '',
      approvedCOs: '$500.00',
      revisedBudget: '$10000.00',
      january2023: 1000,
      february2023: 2000,
    },
  ];

  const mockGcGrTotals = [
    {
      costCode: 'Grand Totals',
      description: '',
      startDate: null,
      endDate: null,
      approvedCOs: '$500.00',
      revisedBudget: '$10000.00',
      january2023: 1000,
      february2023: 2000,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    forecastingUtils.fetchForecastData.mockResolvedValue(mockRowData);
    forecastingUtils.generateDateColumns.mockReturnValue(mockDateColumns);
    forecastingUtils.initializeRowDataWithDateColumns.mockReturnValue({
      initializedData: mockRowData,
      dateColumns: mockDateColumns,
    });
    forecastingUtils.calculateGcGrTotals.mockReturnValue(mockGcGrTotals);
    forecastingUtils.generateCompareData.mockReturnValue({
      compareRows: mockCompareData,
      dateColumns: mockDateColumns,
    });
    NumericCellRenderer.mockImplementation(({ value }) => <span>{value}</span>);
    MergedCellRenderer.mockImplementation(({ value }) => <span>{value}</span>);
  });

  test('renders loading spinner initially', async () => {
    await act(async () => {
      render(<ForecastingV2 {...defaultProps} />);
      // Wait for the initial loading state
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders table with data after loading', async () => {
    await act(async () => {
      render(<ForecastingV2 {...defaultProps} />);
    });
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      const grid = screen.getByTestId('ag-grid-original');
      expect(within(grid).getByText('Test Cost Code')).toBeInTheDocument();
      expect(within(grid).getByText('Grand Totals')).toBeInTheDocument();
    });
  });

  test('displays error message on data fetch failure', async () => {
    forecastingUtils.fetchForecastData.mockRejectedValue(new Error('Fetch failed'));
    await act(async () => {
      render(<ForecastingV2 {...defaultProps} />);
    });
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByText('Fetch failed')).toBeInTheDocument();
    });
  });

  test('switches tabs and updates view', async () => {
    await act(async () => {
      render(<ForecastingV2 {...defaultProps} />);
    });
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const currentForecastTab = screen.getByText('Current forecast'); // Match exact text
    await act(async () => {
      fireEvent.click(currentForecastTab);
    });
    expect(screen.getByText('Current forecast')).toHaveClass('ant-tabs-tab-active');
  });

  test('triggers edit mode and opens drawer', async () => {
    await act(async () => {
      render(<ForecastingV2 {...defaultProps} />);
    });
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await act(async () => {
      fireEvent.click(editButton);
    });
    expect(screen.getByText(/Editing budget forecast for 001/)).toBeInTheDocument();
  });

  test('cancels edit mode and closes drawer', async () => {
    await act(async () => {
      render(<ForecastingV2 {...defaultProps} />);
    });
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await act(async () => {
      fireEvent.click(editButton);
    });
    const cancelButton = screen.getByText('Cancel');
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    expect(screen.queryByText(/Editing budget forecast for 001/)).not.toBeInTheDocument();
  });

  test('updates forecast data on save', async () => {
    await act(async () => {
      render(<ForecastingV2 {...defaultProps} />);
    });
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await act(async () => {
      fireEvent.click(editButton);
    });

    const updateButton = screen.getByText('Update Budget Item Forecast');
    await act(async () => {
      fireEvent.click(updateButton);
    });

    expect(screen.queryByText(/Editing budget forecast for 001/)).not.toBeInTheDocument();
    const grid = screen.getByTestId('ag-grid');
    expect(within(grid).getByText('Test Cost Code')).toBeInTheDocument();
  });

  test('applies global filter', async () => {
    await act(async () => {
      render(<ForecastingV2 {...defaultProps} />);
    });
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Test Cost Code' } });
    });

    expect(searchInput).toHaveValue('Test Cost Code');
    const grid = screen.getByTestId('ag-grid');
    expect(within(grid).getByText('Test Cost Code')).toBeInTheDocument();
  });

  test('renders compare tab with grouped data and row classes', async () => {
    await act(async () => {
      render(<ForecastingV2 {...defaultProps} />);
    });
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const compareTab = screen.getByText('Compare');
    await act(async () => {
      fireEvent.click(compareTab);
    });

    const grid = screen.getByTestId('ag-grid-compare');
    const row0 = screen.getByTestId('row-0-compare');
    const row1 = screen.getByTestId('row-1-compare');
    const row2 = screen.getByTestId('row-2-compare');
    const row3 = screen.getByTestId('row-3-compare');

    expect(within(row0).getByText('Actual Cost')).toBeInTheDocument();
    expect(within(row1).getByText('Original')).toBeInTheDocument();
    expect(within(row2).getByText('Current Forecast')).toBeInTheDocument();
    expect(within(row3).getByText('Grand Totals')).toBeInTheDocument();

    expect(row0).toHaveClass('even-row');
    expect(row2).toHaveClass('group-separator');
    expect(row3).toHaveClass('grand-total-row');
  });

  test('applies row class rules in editable tab', async () => {
    await act(async () => {
      render(<ForecastingV2 {...defaultProps} />);
    });
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await act(async () => {
      fireEvent.click(editButton);
    });

    const row0 = screen.getByTestId('row-0');
    const row1 = screen.getByTestId('row-1');

    expect(row0).toHaveClass('editing-row');
    expect(row1).toHaveClass('grand-total-row');
  });

  test('renders custom cell renderers correctly', async () => {
    await act(async () => {
      render(<ForecastingV2 {...defaultProps} />);
    });
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const compareTab = screen.getByText('Compare');
    await act(async () => {
      fireEvent.click(compareTab);
    });

    const cellCostCode = screen.getByTestId('cell-costCode-0-compare');
    const cellTotal = screen.getByTestId('cell-total-0-compare');

    expect(MergedCellRenderer).toHaveBeenCalledWith(expect.objectContaining({ value: '001' }), expect.anything());
    expect(NumericCellRenderer).toHaveBeenCalledWith(expect.objectContaining({ value: 3000 }), expect.anything());

    expect(within(cellCostCode).getByText('001')).toBeInTheDocument();
    expect(within(cellTotal).getByText('3000')).toBeInTheDocument();
  });
});