// src/components/TableModuleV2.js
import React, { useRef, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise'; // Updated to use AllEnterpriseModules for simplicity
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { NumericCellRenderer } from '../utils/CustomCellRenderer.js';
import '../styles/TableModule.css';

// Register AG Grid Enterprise modules
ModuleRegistry.registerModules([AllEnterpriseModule]);

const TableModuleV2 = ({
  data = [],
  columns = [],
  autoSizeOnLoad = false,
  enableFullscreen = false,
  enableFiltering = false,
  enableSearch = false,
  onSearchChange,
  treeData = false,
  getDataPath,
  autoGroupColumnDef,
  agGridProps = {},
  selectionMode = 'multiple', // Default to 'multiple'
  onGridApiReady,
}) => {
  const gridRef = useRef(null);
  const [searchText, setSearchText] = useState('');

  const onGridReady = useCallback(
    (params) => {
      gridRef.current = { api: params.api, columnApi: params.columnApi };
      if (autoSizeOnLoad && params.columnApi) {
        const allColumns = params.columnApi.getColumns();
        if (allColumns && allColumns.length > 0) {
          const allColumnIds = allColumns.map((col) => col.getId());
          params.columnApi.autoSizeColumns(allColumnIds, false);
        } else {
          console.warn('No columns available to auto-size on grid ready.');
        }
      }
      if (onGridApiReady) {
        onGridApiReady({ api: params.api, columnApi: params.columnApi });
      }
      if (agGridProps.onGridReady) {
        agGridProps.onGridReady(params);
      }
    },
    [autoSizeOnLoad, agGridProps, onGridApiReady]
  );

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    if (gridRef.current) {
      gridRef.current.api.setGridOption('quickFilterText', value);
    }
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: enableFiltering ? 'agTextColumnFilter' : false,
      resizable: true,
      editable: false,
    }),
    [enableFiltering]
  );

  const gridOptions = useMemo(
    () => ({
      animateRows: true,
      rowSelection: {
        mode: selectionMode === 'single' ? 'singleRow' : 'multiRow',
      },
      enableCellTextSelection: true,
      components: {
        numericCellRenderer: NumericCellRenderer,
      },
      rowHeight: 30,
      rowClassRules: {
        'ag-row-even': (params) => params.node.rowIndex % 2 === 0,
        'ag-row-odd': (params) => params.node.rowIndex % 2 !== 0,
      },
      ...(treeData && { treeData, getDataPath, autoGroupColumnDef }),
    }),
    [enableFiltering, treeData, getDataPath, autoGroupColumnDef, selectionMode]
  );

  return (
    <div className="table-container" style={{ height: '100%', width: '100%' }}>
      {enableSearch && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '10px',
            padding: '8px 0',
          }}
        >
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearchChange}
            style={{ width: '200px' }}
            aria-label="Search table records"
          />
        </div>
      )}
      <div className="ag-theme-quartz" style={{ height: enableSearch ? 'calc(100% - 56px)' : '100%', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={data}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          {...gridOptions}
          {...agGridProps}
        />
      </div>
    </div>
  );
};

TableModuleV2.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.object),
  autoSizeOnLoad: PropTypes.bool,
  enableFullscreen: PropTypes.bool,
  enableFiltering: PropTypes.bool,
  enableSearch: PropTypes.bool,
  onSearchChange: PropTypes.func,
  treeData: PropTypes.bool,
  getDataPath: PropTypes.func,
  autoGroupColumnDef: PropTypes.object,
  agGridProps: PropTypes.object,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  onGridApiReady: PropTypes.func,
};

TableModuleV2.defaultProps = {
  data: [],
  columns: [],
  autoSizeOnLoad: false,
  enableFullscreen: false,
  enableFiltering: false,
  enableSearch: false,
  onSearchChange: null,
  treeData: false,
  getDataPath: null,
  autoGroupColumnDef: null,
  agGridProps: {},
  selectionMode: 'multiple',
  onGridApiReady: null,
};

/**
 * Usage Instructions:
 * Import and use this component in a parent component by passing required props:
 * <TableModuleV2
 *   data={rowData}              // Array of row data objects
 *   columns={columnDefs}        // Array of column definition objects
 *   autoSizeOnLoad={true}       // Auto-size columns on load
 *   enableFiltering={true}      // Enable column filters
 *   enableSearch={true}         // Enable search bar
 *   selectionMode="multiple"    // Set to 'single' or 'multiple' for row selection
 *   agGridProps={{              // Additional AG Grid props
 *     onCellValueChanged: handleCellEdit,
 *   }}
 *   onGridApiReady={(params) => console.log(params.api)}
 * />
 *
 * Reference: https://www.ag-grid.com/react-data-grid/
 */
export default TableModuleV2;