// src/renderer/components/ComponentHeader.js
// Reusable header component for child components in HB Report, rendering a title, tabs, actions, and optional create button
// Import this component in child components (e.g., Portfolio.js, Buyout.js) to render the header
// Reference: https://react.dev/reference/react
// *Additional Reference*: https://ant.design/components/tabs#api
// *Additional Reference*: https://ant.design/components/dropdown#api
// *Additional Reference*: https://ant.design/components/icon#api
// *Additional Reference*: https://ant.design/components/button#api

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Tabs, Dropdown, Space } from 'antd';
import { SettingFilled, DownOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons';

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

    const tabsContainerRef = useRef(null);
    const tabWidthsRef = useRef(new Map());
    const [containerWidth, setContainerWidth] = useState(0);
    const resizeTimeoutRef = useRef(null);

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

    // Update container width on resize
    const updateContainerWidth = useCallback(() => {
        if (tabsContainerRef.current) {
            setContainerWidth(tabsContainerRef.current.offsetWidth);
        }
    }, []);

    useEffect(() => {
        // Initial measurement
        updateContainerWidth();

        // Throttled resize handler
        const handleResize = () => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
            resizeTimeoutRef.current = setTimeout(() => {
                updateContainerWidth();
            }, 100); // Throttle delay of 100ms
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, [updateContainerWidth]);

    // Compute visible tabs and more tabs based on container width
    const { visibleTabs, moreTabs } = useMemo(() => {
        if (!containerWidth || tabs.length === 0) {
            return { visibleTabs: tabs, moreTabs: [] };
        }

        const moreButtonWidth = 80; // Approximate width of the "More" button
        let totalWidth = 0;
        let visibleCount = 0;

        for (let i = 0; i < tabs.length; i++) {
            const tabWidth = tabWidthsRef.current.get(tabs[i].key) || 0;
            totalWidth += tabWidth;

            // Check if adding the current tab plus the "More" button (if needed) fits within the container
            // If there will be hidden tabs after this one, we need to reserve space for the "More" button
            const remainingTabs = tabs.length - (i + 1);
            const needsMoreButton = remainingTabs > 0;
            const additionalWidth = needsMoreButton ? moreButtonWidth : 0;

            if (totalWidth + additionalWidth <= containerWidth) {
                visibleCount++;
            } else {
                break;
            }
        }

        return {
            visibleTabs: tabs.slice(0, visibleCount),
            moreTabs: tabs.slice(visibleCount),
        };
    }, [tabs, containerWidth]);

    // Map tabs to items for the Tabs component
    const tabItems = visibleTabs.map(tab => ({
        key: tab.key,
        label: (
            <span
                ref={el => {
                    if (el && !tabWidthsRef.current.has(tab.key)) {
                        tabWidthsRef.current.set(tab.key, el.offsetWidth);
                    }
                }}
            >
                {tab.label}
            </span>
        ),
    }));

    return (
        <div className="component-header">
            <div className="component-header-container">
                <div className="component-header-top-row">
                    <div className="component-header-left">
                        <Button
                            type="text"
                            icon={<SettingFilled style={{ color: 'var(--hb-orange)' }} />}
                            aria-label="Configure Settings"
                            onClick={onSettingsClick || (() => console.log('Navigate to configure tab'))}
                        />
                        {typeof title === 'string' ? <h1>{title}</h1> : title}
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
                {tabs.length > 0 && (
                    <div className="component-header-tabs-row" ref={tabsContainerRef}>
                        <Tabs
                            activeKey={activeTab}
                            onChange={onTabChange}
                            className="component-header-tabs"
                            items={tabItems}
                        />
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
                                <Button type="text" className="more-tabs-button">
                                    More <DownOutlined />
                                </Button>
                            </Dropdown>
                        )}
                    </div>
                )}
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