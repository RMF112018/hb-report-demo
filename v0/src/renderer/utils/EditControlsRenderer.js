// src/renderer/utils/EditControlsRenderer.js
// Custom AG Grid cell renderer to handle edit, confirm, and cancel actions
// Use this in ForecastingV2.js within the autoGroupColumnDef to add edit controls
// Reference: https://www.ag-grid.com/react-data-grid/component-cell-renderer/
// *Additional Reference*: https://ant.design/components/icon

import React, { useState, useCallback } from 'react';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const EditControlsRenderer = (props) => {
    const { node, api, data, onEditStateChange } = props;
    const [isEditing, setIsEditing] = useState(false);
    const isEditableRow = data && ['Original Forecast', 'Current Forecast'].includes(data.forecast);

    const startEditing = useCallback(() => {
        api.forEachNode((otherNode) => {
            if (otherNode !== node && otherNode.data?.isEditing) {
                otherNode.data.isEditing = false;
                api.refreshCells({ rowNodes: [otherNode], force: true });
            }
        });
        setIsEditing(true);
        data.isEditing = true;
        data.originalData = { ...data };
        api.startEditingCell({
            rowIndex: node.rowIndex,
            colKey: 'startDate',
        });
        onEditStateChange(true); // Notify parent that editing has started
        api.refreshCells({ rowNodes: [node], force: true });
    }, [api, node, data, onEditStateChange]);

    const confirmEdit = useCallback(() => {
        setIsEditing(false);
        data.isEditing = false;
        delete data.originalData;
        api.stopEditing(false);
        api.refreshCells({ rowNodes: [node], force: true });
        props.onConfirmEdit(data);
        onEditStateChange(false); // Notify parent that editing has stopped
    }, [api, node, data, props.onConfirmEdit, onEditStateChange]);

    const cancelEdit = useCallback(() => {
        setIsEditing(false);
        data.isEditing = false;
        Object.assign(data, data.originalData);
        delete data.originalData;
        api.stopEditing(true);
        api.refreshCells({ rowNodes: [node], force: true });
        onEditStateChange(false); // Notify parent that editing has stopped
    }, [api, node, data, onEditStateChange]);

    if (!isEditableRow || node.level !== 1) {
        return <span>{data?.forecast || props.value}</span>;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{data.forecast}</span>
            {isEditing ? (
                <>
                    <Button
                        type="text"
                        icon={<CheckOutlined />}
                        onClick={confirmEdit}
                        aria-label="Confirm edit"
                    />
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={cancelEdit}
                        aria-label="Cancel edit"
                    />
                </>
            ) : (
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={startEditing}
                    aria-label="Edit row"
                />
            )}
        </div>
    );
};

export default EditControlsRenderer;