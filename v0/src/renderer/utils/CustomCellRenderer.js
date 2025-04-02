// src/renderer/utils/CustomCellRenderer.js
// Custom cell renderers for HB Report, including numeric editing and merged cell display for grouped rows
// Use these renderers in column definitions for AG Grid tables (e.g., in Forecasting.js for dynamic date columns and merged cells)
// Reference: https://www.ag-grid.com/react-data-grid/cell-rendering-components/
// *Additional Reference*: https://ant.design/components/input-number
// *Additional Reference*: https://react.dev/reference/react/useRef

import React, { useRef, useEffect } from 'react';
import { InputNumber } from 'antd';

// Renderer for numeric values, handling display and editing with Ant Design InputNumber
const NumericCellRenderer = (params) => {
    const { editingRow, tempRowData = {}, setTempRowData, dynamicColumns, inputRefs } = params.context || {};
    const rowId = params.data?.costCode || '';
    const colId = params.colDef?.field || '';
    const isEditing = editingRow === rowId;
    const isGrandTotals = rowId === 'Grand Totals';
    const isEditableCell = dynamicColumns && Array.isArray(dynamicColumns) ? dynamicColumns.some(col => col.field === colId) : false;
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRefs && isEditableCell && !isGrandTotals) {
            inputRefs.current[`${rowId}-${colId}`] = inputRef.current;
            console.log(`Registered ref for ${rowId}-${colId}, ref value:`, inputRef.current);
        }
        return () => {
            if (inputRefs && inputRefs.current[`${rowId}-${colId}`]) {
                delete inputRefs.current[`${rowId}-${colId}`];
                console.log(`Unregistered ref for ${rowId}-${colId}`);
            }
        };
    }, [isEditing, rowId, colId, inputRefs, isEditableCell]);

    if (isEditing && isEditableCell && !isGrandTotals) {
        const tempValue = tempRowData[rowId]?.[colId] ?? params.value ?? 0;
        return (
            <InputNumber
                ref={inputRef}
                value={tempValue}
                onChange={(value) => {
                    console.log(`Input changed for ${rowId}-${colId}: ${value}`);
                    setTempRowData(prev => ({
                        ...prev,
                        [rowId]: {
                            ...(prev[rowId] || {}),
                            [colId]: value,
                        },
                    }));
                }}
                onClick={() => console.log(`Clicked InputNumber for ${rowId}-${colId}`)}
                min={0}
                step={0.01}
                precision={2}
                style={{ width: '100%', height: '100%', padding: '2px 8px', fontSize: '11px' }}
            />
        );
    }

    const value = params.value;
    if (value === undefined) return <div style={{ padding: '0 8px' }}></div>;
    const formattedValue = params.valueFormatter
        ? params.valueFormatter({ ...params, value })
        : Number(value).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          });

    return <div style={{ padding: '0 8px' }}>{formattedValue}</div>;
};

// Renderer to merge cells across three rows for grouped display (e.g., in Compare tab for Cost Code and Description)
const MergedCellRenderer = (params) => {
    const { data, value, colDef } = params;
    const field = colDef.field; // 'costCode' or 'description'
    const isFirstRowOfGroup = data.type === 'Actual Cost'; // First row in the group

    // console.log(`MergedCellRenderer for ${field}: type=${data.type}, value=${value}, data=${JSON.stringify(data)}`);

    if (isFirstRowOfGroup) {
        return (
            <div className="merged-cell-content">
                {value || 'N/A'}
            </div>
        );
    } else {
        return null;
    }
};

export { NumericCellRenderer, MergedCellRenderer };

const FullWidthCostCodeRenderer = (props) => {
  const { data } = props;
  return (
    <div
      style={{
        padding: '10px',
        fontWeight: 'bold',
        backgroundColor: '#f5f5f5', // Light gray background
      }}
    >
      {data.costCode}
    </div>
  );
};

export { FullWidthCostCodeRenderer };