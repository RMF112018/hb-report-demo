// src/renderer/components/TableModule.js
// Reusable table component for HB Report using AG Grid Community Edition, with sorting, filtering, pagination, full-screen, and font size adjustment
// Use this component in other React components (e.g., Portfolio.js, Buyout.js, Forecasting.js) by passing props for data, columns, and configuration
// Reference: https://www.ag-grid.com/react-data-grid/
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://react.dev/reference/react/useEffect
// *Additional Reference*: https://github.com/facebook/prop-types

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import { Button, Dropdown, Menu } from 'antd';
import { FilterOutlined, FontSizeOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../styles/TableModule.css';
import { ModuleRegistry } from 'ag-grid-community';
import {
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule,
  PaginationModule,
  RowStyleModule,
  ColumnAutoSizeModule,
  CellStyleModule,
} from 'ag-grid-community';

// Register the necessary modules for filtering and core functionality
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule,
  PaginationModule,
  RowStyleModule,
  ColumnAutoSizeModule,
  CellStyleModule,
]);

const TableModule = ({
  data = [],
  columns = [],
  enableSorting = true,
  enableFiltering = false,
  enablePagination = false,
  pageSize = 10,
  className = '',
  globalFilter = '',
  loading = false,
  enableFullscreen = false,
  context = {},
  rowClassRules = {},
  onRowClick,
  rowSelection = null,
  onSelectionChanged = () => {},
  enableFontSizeAdjustment = false,
  defaultFontSize = 'medium',
}) => {
  const gridRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});
  const [fontSize, setFontSize] = useState(defaultFontSize);

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      flex: 1,
      sortable: enableSorting,
      filter: enableFiltering ? 'agTextColumnFilter' : false,
      floatingFilter: false,
    }),
    [enableSorting, enableFiltering]
  );

  // Font size options
  const fontSizeOptions = [
    { label: 'Small', value: 'small', size: '10px' },
    { label: 'Medium', value: 'medium', size: '12px' },
    { label: 'Large', value: 'large', size: '14px' },
  ];

  const fontSizeMenu = (
    <Menu>
      {fontSizeOptions.map((option) => (
        <Menu.Item key={option.value} onClick={() => setFontSize(option.value)}>
          {option.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  const CustomHeader = (props) => {
    const { column, displayName, api } = props;
    const field = column.getColDef().field;
    const sortState = column.getSort();

    const uniqueValues = useMemo(() => {
      const values = new Set(data.map((item) => item[field]?.toString() || ''));
      return ['All', ...Array.from(values).sort()];
    }, [data, field]);

    const handleFilterSelect = ({ key }) => {
      if (key === 'All') {
        setColumnFilters((prev) => {
          const newFilters = { ...prev };
          delete newFilters[field];
          return newFilters;
        });
      } else {
        setColumnFilters((prev) => ({
          ...prev,
          [field]: key,
        }));
      }
    };

    const menu = (
      <Menu onClick={handleFilterSelect}>
        {uniqueValues.map((value) => (
          <Menu.Item key={value}>{value}</Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div className="custom-header-container" style={{ display: 'flex', alignItems: 'center' }}>
        <span className="header-name">{displayName}</span>
        {sortState && (
          <span style={{ marginLeft: '4px' }}>
            {sortState === 'asc' ? '↑' : '↓'}
          </span>
        )}
        {enableFiltering && (
          <Dropdown overlay={menu} trigger={['click']}>
            <FilterOutlined
              className="filter-icon"
              aria-label={`Filter ${displayName} column`}
              style={{ marginLeft: '4px' }}
            />
          </Dropdown>
        )}
      </div>
    );
  };

  const columnDefs = columns.map((col) => ({
    field: col.field,
    headerName: col.headerName,
    sortable: enableSorting,
    filter: enableFiltering ? 'agTextColumnFilter' : false,
    width: col.width || undefined,
    minWidth: col.minWidth || 100,
    maxWidth: col.maxWidth,
    pinned: col.pinned || null,
    valueGetter: col.valueGetter,
    valueFormatter: col.valueFormatter,
    cellRenderer: col.cellRenderer,
    cellStyle: col.cellStyle,
    headerComponent: CustomHeader,
    onCellClicked: col.onCellClicked,
  }));

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setFilterModel(
        Object.entries(columnFilters).reduce((model, [field, value]) => {
          if (value) {
            model[field] = { filterType: 'text', type: 'equals', filter: value };
          }
          return model;
        }, {})
      );
    }
  }, [columnFilters]);

  const onGridReady = useCallback(
    (params) => {
      gridRef.current = { api: params.api, columnApi: params.columnApi };
      if (globalFilter) {
        params.api.setQuickFilter(globalFilter);
      }
    },
    [globalFilter]
  );

  const onFirstDataRendered = useCallback((params) => {
    if (containerRef.current && containerRef.current.offsetWidth > 0) {
      params.api.sizeColumnsToFit();
    }
  }, []);

  const onGridSizeChanged = useCallback((params) => {
    if (containerRef.current && containerRef.current.offsetWidth > 0) {
      params.api.sizeColumnsToFit();
    }
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setQuickFilter(globalFilter || '');
    }
  }, [globalFilter]);

  const handleRowClicked = (event) => {
    if (onRowClick) {
      onRowClick(event.data);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch((err) => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch((err) => {
        console.error('Error exiting fullscreen:', err);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (gridRef.current?.api && containerRef.current && containerRef.current.offsetWidth > 0) {
        gridRef.current.api.sizeColumnsToFit();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const rowSelectionConfig = rowSelection
    ? {
        mode: rowSelection,
        enableClickSelection: rowSelection === 'multiple',
      }
    : undefined;

  // Apply .even-row class to even-numbered rows
  const getRowClass = useCallback((params) => {
    if (params.node.rowIndex % 2 === 0) {
      return 'even-row';
    }
    return '';
  }, []);

  return (
    <div ref={containerRef} className={`table-container ${className}`.trim()} style={{ width: '100%', position: 'relative' }}>
      {enableFontSizeAdjustment && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1001 }}>
          <Dropdown overlay={fontSizeMenu} trigger={['click']}>
            <Button
              type="text"
              icon={<FontSizeOutlined />}
              style={{ color: 'var(--hb-blue)' }}
              aria-label="Adjust font size"
            />
          </Dropdown>
        </div>
      )}
      <div
        className={`ag-theme-alpine ag-font-size-${fontSize}`}
        style={{ width: '100%' }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
          onGridSizeChanged={onGridSizeChanged}
          pagination={enablePagination}
          paginationPageSize={pageSize}
          suppressPaginationPanel={false}
          animateRows={true}
          enableCellTextSelection={true}
          ensureDomOrder={true}
          loadingOverlayComponent={loading ? 'agLoadingOverlay' : undefined}
          domLayout="autoHeight"
          rowHeight={32}
          context={context}
          rowClassRules={rowClassRules}
          getRowClass={getRowClass} // Added to apply .even-row
          onRowClicked={handleRowClicked}
          rowSelection={rowSelectionConfig}
          onSelectionChanged={onSelectionChanged}
        />
      </div>
      {isFullscreen && (
        <Button
          className="fullscreen-exit-btn"
          shape="circle"
          icon={<FullscreenExitOutlined />}
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1001,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: 'none',
          }}
          aria-label="Exit full-screen"
        />
      )}
      {enablePagination && (
        <div style={{ color: 'var(--content-color)', padding: '8px 0' }}>
          <em>
            Displaying 1 - {data.length > pageSize && enablePagination ? pageSize : data.length} of {data.length}
          </em>
        </div>
      )}
    </div>
  );
};

TableModule.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      width: PropTypes.number,
      minWidth: PropTypes.number,
      maxWidth: PropTypes.number,
      pinned: PropTypes.oneOf(['left', 'right', null]),
      valueGetter: PropTypes.func,
      valueFormatter: PropTypes.func,
      cellRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      cellStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
      onCellClicked: PropTypes.func,
    })
  ),
  enableSorting: PropTypes.bool,
  enableFiltering: PropTypes.bool,
  enablePagination: PropTypes.bool,
  pageSize: PropTypes.number,
  className: PropTypes.string,
  globalFilter: PropTypes.string,
  loading: PropTypes.bool,
  enableFullscreen: PropTypes.bool,
  context: PropTypes.object,
  rowClassRules: PropTypes.object,
  onRowClick: PropTypes.func,
  rowSelection: PropTypes.oneOf(['single', 'multiple', null]),
  onSelectionChanged: PropTypes.func,
  enableFontSizeAdjustment: PropTypes.bool,
  defaultFontSize: PropTypes.oneOf(['small', 'medium', 'large']),
};

TableModule.defaultProps = {
  data: [],
  columns: [],
  enableSorting: true,
  enableFiltering: false,
  enablePagination: false,
  pageSize: 10,
  className: '',
  globalFilter: '',
  loading: false,
  enableFullscreen: false,
  context: {},
  rowClassRules: {},
  onRowClick: undefined,
  rowSelection: null,
  onSelectionChanged: () => {},
  enableFontSizeAdjustment: false,
  defaultFontSize: 'medium',
};

export default TableModule;