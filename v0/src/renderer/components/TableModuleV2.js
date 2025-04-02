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
}) => {
  const gridRef = useRef(null);
  const [searchText, setSearchText] = useState('');

  const onGridReady = useCallback(
    (params) => {
      gridRef.current = { api: params.api, columnApi: params.columnApi };
      if (autoSizeOnLoad && params.columnApi) {
        const allColumns = params.columnApi.getAllColumns();
        if (allColumns && allColumns.length > 0) {
          const allColumnIds = allColumns.map((col) => col.getId());
          params.api.autoSizeColumns(allColumnIds, false); // 'false' skips animation for performance
        } else {
          console.warn('No columns available to auto-size on grid ready.');
        }
      }
      if (agGridProps.onGridReady) {
        agGridProps.onGridReady(params);
      }
    },
    [autoSizeOnLoad, agGridProps]
  );

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    if (gridRef.current) {
      gridRef.current.api.setQuickFilter(value);
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
      rowSelection: { type: 'multiple', enableClickSelection: false }, // Updated to align with modern AG Grid syntax
      enableCellTextSelection: true, // Previously 'cellSelection', updated per current docs
      sideBar: enableFiltering
        ? {
            toolPanels: [
              {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
              },
              {
                id: 'filters',
                labelDefault: 'Filters',
                labelKey: 'filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
              },
            ],
          }
        : false,
      components: {
        numericCellRenderer: NumericCellRenderer,
      },
      rowHeight: 30, // Added: Increase row height for better readability
      rowClassRules: {
        'ag-row-even': (params) => params.node.rowIndex % 2 === 0,
        'ag-row-odd': (params) => params.node.rowIndex % 2 !== 0,
      }, // Added: Alternating row colors
      ...(treeData && { treeData, getDataPath, autoGroupColumnDef }),
    }),
    [enableFiltering, treeData, getDataPath, autoGroupColumnDef]
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

// PropTypes and defaultProps remain unchanged
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
};

/**
 * Usage Instructions:
 * Import and use this component in a parent component by passing required props:
 * <TableModuleV2
 *   data={rowData}              // Array of row data objects (flat or hierarchical with 'children' for treeData)
 *   columns={columnDefs}        // Array of column definition objects
 *   autoSizeOnLoad={true}       // Auto-size columns to fit content on load
 *   treeData={true}             // Enable tree data mode for hierarchical data
 *   getDataPath={(data) => data.path.split('.')} // Optional: Define path for tree data if not using 'children'
 *   autoGroupColumnDef={{       // Customize the auto-group column for tree or grouped data
 *     headerName: 'Group',
 *     minWidth: 200,
 *   }}
 *   agGridProps={{              // Object containing any AG Grid props
 *     enableCharts: true,       // Enable integrated charting
 *     sideBar: true,            // Show side bar with tool panels
 *     getContextMenuItems: (params) => ['copy', 'paste'], // Custom context menu
 *     // Add other AG Grid props as needed
 *   }}
 * />
 *
 * All AG Grid Enterprise features are configurable via the agGridProps object.
 * For tree data mode, set treeData={true} and provide data with a 'children' property or a getDataPath function.
 */

/**
 * Available agGridProps (AG Grid Enterprise Features and Options):
 * This documentation reflects AG Grid Enterprise features as of March 31, 2025, based on the latest available documentation.
 * For a complete, up-to-date list of props, events, APIs, grid state, lifecycle methods, and context options, refer to:
 * - [AG Grid Reference](https://www.ag-grid.com/react-data-grid/reference/)
 * - [Grid Options](https://www.ag-grid.com/react-data-grid/grid-options/)
 * - [Grid Events](https://www.ag-grid.com/react-data-grid/grid-events/)
 * - [Grid API](https://www.ag-grid.com/react-data-grid/grid-api/)
 * - [Column API](https://www.ag-grid.com/react-data-grid/column-api/)
 * - [Tree Data](https://www.ag-grid.com/react-data-grid/tree-data/)
 *
 * Below is a curated list of commonly used options, with emphasis on tree data support and general grid functionality.
 *
 * Core Grid Options:
 * - rowData: array - Data to display (overridden by 'data' prop).
 * - columnDefs: array - Column definitions (overridden by 'columns' prop).
 * - defaultColDef: object - Default column properties (e.g., { sortable: true, filter: true }).
 * - animateRows: boolean - Animate row changes (default: false).
 * - suppressRowClickSelection: boolean - Prevent row selection on click (default: false).
 * - rowSelection: object|string - Selection mode: { type: 'single'|'multiple' } or 'single'|'multiple' (default: undefined).
 * - rowMultiSelectWithClick: boolean - Enable multi-select with clicks (default: false).
 * - rowHeight: number - Row height in pixels (default: 25).
 * - headerHeight: number - Header height in pixels (default: 25).
 * - domLayout: string - Layout mode: 'normal', 'autoHeight', 'print' (default: 'normal').
 *
 * Tree Data (Enterprise):
 * - treeData: boolean - Enable tree data mode (default: false).
 * - getDataPath: function(data) - Returns hierarchy path (e.g., (data) => data.path.split('.')) if not using 'children'.
 * - treeDataChildren: string - Property name for children in tree data (default: 'children').
 * - autoGroupColumnDef: object - Customize the auto-group column for tree or grouped data.
 * - groupDefaultExpanded: number - Default expansion level (-1 for all, 0 for none, 1 for first level, etc.).
 *
 * Row Grouping (Enterprise):
 * - groupDisplayType: string - Grouping style: 'singleColumn', 'multipleColumns', 'groupRows', 'custom'.
 * - groupHideOpenParents: boolean - Hide parent rows when expanded (default: false).
 * - groupSelectsChildren: boolean - Selecting a group selects its children (default: false).
 *
 * Pivoting (Enterprise):
 * - pivotMode: boolean - Enable pivot mode (default: false).
 * - pivotColumnGroupTotals: string - Totals position: 'before', 'after'.
 *
 * Filtering:
 * - enableAdvancedFilter: boolean - Enable advanced filtering (default: false).
 * - floatingFilter: boolean - Show floating filters (default: false).
 * - quickFilterText: string - Text for quick filter.
 *
 * Sorting:
 * - sortingOrder: array - Sort order options (e.g., ['asc', 'desc', null]).
 * - multiSortKey: string - Key for multi-column sorting (e.g., 'ctrl').
 *
 * Pagination:
 * - pagination: boolean - Enable pagination (default: false).
 * - paginationPageSize: number - Rows per page (default: 100).
 *
 * Side Bar (Enterprise):
 * - sideBar: boolean|object - Enable side bar (e.g., { toolPanels: ['columns', 'filters'] }).
 * - defaultToolPanel: string - Default open tool panel (e.g., 'filters').
 *
 * Context Menu (Enterprise):
 * - getContextMenuItems: function(params) - Custom context menu items (e.g., (params) => ['copy', 'paste']).
 *
 * Charting (Enterprise):
 * - enableCharts: boolean - Enable integrated charting (default: false).
 * - chartThemeOverrides: object - Customize chart styles (e.g., { bar: { strokeWidth: 2 } }).
 *
 * Export (Enterprise):
 * - suppressExcelExport: boolean - Disable Excel export (default: false).
 * - suppressCsvExport: boolean - Disable CSV export (default: false).
 *
 * Server-Side Row Model (Enterprise):
 * - rowModelType: string - Row model: 'clientSide', 'serverSide', 'infinite', 'viewport' (default: 'clientSide').
 * - serverSideStoreType: string - Store type: 'partial', 'full' (default: 'partial').
 * - cacheBlockSize: number - Rows per block (default: 100).
 *
 * Selection:
 * - enableCellTextSelection: boolean - Enable cell text selection (default: false).
 * - enableRangeSelection: boolean - Enable range selection (default: false).
 * - enableFillHandle: boolean - Enable fill handle (default: false).
 *
 * Editing:
 * - singleClickEdit: boolean - Start editing on single click (default: false).
 * - undoRedoCellEditing: boolean - Enable undo/redo for edits (default: false).
 *
 * Events:
 * - onGridReady: function(params) - Grid initialized.
 * - onRowClicked: function(event) - Row clicked.
 * - onCellValueChanged: function(event) - Cell value changed.
 * - onFilterChanged: function(event) - Filter changed.
 * - onRowGroupOpened: function(event) - Group expanded/collapsed.
 * - onChartCreated: function(event) - Chart created.
 * - (See https://www.ag-grid.com/react-data-grid/grid-events/ for full list)
 *
 * Appearance:
 * - suppressColumnVirtualisation: boolean - Disable column virtualization (default: false).
 * - rowClassRules: object - Conditional row classes (e.g., { 'highlight': 'data.value > 100' }).
 *
 * Miscellaneous:
 * - ensureDomOrder: boolean - Ensure DOM matches grid order (default: false).
 * - loadingOverlayComponent: string|function - Custom loading overlay.
 *
 * Instructions for Use:
 * 1. Pass required props (data, columns) and optional props as needed.
 * 2. For tree data, set treeData={true} and provide hierarchical data with 'children' or use getDataPath.
 * 3. Use agGridProps to enable advanced features (e.g., { enableCharts: true, pivotMode: true }).
 * 4. Customize styles via TableModule.css and AG Grid CSS variables (e.g., --ag-background-color).
 * 5. Ensure AG Grid Enterprise license is set in the application (e.g., via LicenseManager in App.js).
 */

export default TableModuleV2;