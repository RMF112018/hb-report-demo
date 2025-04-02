// src/renderer/components/ComponentHeader.js
// Reusable header component for child components in HB Report, rendering a title, tabs, actions, and optional create button
// Import this component in child components (e.g., Portfolio.js, Buyout.js) to render the header
// Reference: https://react.dev/reference/react
// *Additional Reference*: https://ant.design/components/tabs#api
// *Additional Reference*: https://ant.design/components/dropdown#api
// *Additional Reference*: https://ant.design/components/icon#api
// *Additional Reference*: https://ant.design/components/button#api

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tabs, Dropdown, Space } from 'antd';
import { SettingFilled, DownOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import '../styles/global.css';

const { TabPane } = Tabs;

/**
 * ComponentHeader renders a header with a settings icon, title, tabs, actions, and optional create dropdown
 * @param {Object} props - Component props
 * @param {JSX.Element|string} props.title - The title to display
 * @param {Object[]} props.tabs - Array of tab objects with key and label
 * @param {string} props.activeTab - The key of the currently active tab
 * @param {Function} props.onTabChange - Callback for tab changes
 * @param {JSX.Element} props.actions - Action buttons or elements to render on the right
 * @param {Object[]} props.createOptions - Array of create options with key and label
 * @param {Function} props.onCreateClick - Callback for create option selection
 * @param {Function} props.onSettingsClick - Callback for settings button click
 * @param {Function} props.onExport - Callback for export action
 * @param {Object[]} props.exportRoleOptions - Array of role options for export
 * @param {Object} props.createButtonStyle - [DEPRECATED] Inline styles for the create button
 * @param {string} props.buttonSize - Size of the action buttons ('large', 'default', 'small')
 * @returns {JSX.Element} The header component
 */
const ComponentHeader = ({ 
    title, 
    tabs = [], 
    activeTab, 
    onTabChange, 
    actions, 
    createOptions = [], 
    onCreateClick, 
    onSettingsClick,
    onExport,
    exportRoleOptions = [],
    createButtonStyle,
    buttonSize = 'default',
}) => {
    if (createButtonStyle) {
        console.warn(
            'The "createButtonStyle" prop in ComponentHeader is deprecated. ' +
            'Please use the ".create-button" class in global.css to style the create button.'
        );
    }

    const visibleTabs = tabs.slice(0, 4);
    const moreTabs = tabs.slice(4);

    const exportMenu = {
        items: [
            { key: 'all', label: 'All Tasks', onClick: () => onExport('all') },
            exportRoleOptions.length > 0 && {
                key: 'by-role',
                label: 'By Role',
                children: exportRoleOptions.map(role => ({
                    key: role.key,
                    label: role.label,
                    onClick: () => onExport(role.key),
                })),
            },
        ].filter(Boolean),
    };

    const combinedActions = (
        <Space>
            {actions}
            {onExport && (
                <Dropdown menu={exportMenu} trigger={['click']}>
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        size={buttonSize}
                        aria-label="Export"
                        className="export-button"
                    >
                        Export
                    </Button>
                </Dropdown>
            )}
        </Space>
    );

    return (
        <div className="component-header">
            <div className="component-header-container">
                <div className="component-header-left">
                    <Button
                        type="text"
                        icon={<SettingFilled style={{ color: 'var(--hb-orange)' }} />}
                        aria-label="Configure Settings"
                        onClick={onSettingsClick || (() => console.log('Navigate to configure tab'))}
                    />
                    {typeof title === 'string' ? <h1>{title}</h1> : title}
                    {tabs.length > 0 && (
                        <div className="component-header-tabs">
                            <Tabs activeKey={activeTab} onChange={onTabChange}>
                                {visibleTabs.map(tab => (
                                    <TabPane tab={tab.label} key={tab.key} />
                                ))}
                            </Tabs>
                            {moreTabs.length > 0 && (
                                <Dropdown
                                    menu={{
                                        items: moreTabs.map(tab => ({
                                            key: tab.key,
                                            label: tab.label,
                                            onClick: () => onTabChange(tab.key),
                                        })),
                                    }}
                                    trigger={['click']}
                                >
                                    <Button type="text">
                                        More <DownOutlined />
                                    </Button>
                                </Dropdown>
                            )}
                        </div>
                    )}
                </div>
                <div className="component-header-actions">
                    <Space>
                        {createOptions.length > 0 && (
                            <Dropdown
                                menu={{
                                    items: createOptions.map(option => ({
                                        key: option.key,
                                        label: option.label,
                                        onClick: () => onCreateClick(option),
                                    })),
                                }}
                                trigger={['click']}
                            >
                                <Button
                                    className="create-button"
                                    style={createButtonStyle}
                                    aria-label="Create new buyout"
                                    size={buttonSize}
                                >
                                    <PlusOutlined /> Create <DownOutlined />
                                </Button>
                            </Dropdown>
                        )}
                        {combinedActions}
                    </Space>
                </div>
            </div>
        </div>
    );
};

ComponentHeader.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    activeTab: PropTypes.string,
    onTabChange: PropTypes.func,
    actions: PropTypes.element,
    createOptions: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    onCreateClick: PropTypes.func,
    onSettingsClick: PropTypes.func,
    onExport: PropTypes.func,
    exportRoleOptions: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    createButtonStyle: PropTypes.object,
    buttonSize: PropTypes.oneOf(['large', 'default', 'small']),
};

ComponentHeader.defaultProps = {
    tabs: [],
    createOptions: [],
    exportRoleOptions: [],
    createButtonStyle: undefined,
    buttonSize: 'default',
};

export default ComponentHeader;