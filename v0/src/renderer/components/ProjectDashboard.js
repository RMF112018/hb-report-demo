// src/renderer/components/ProjectDashboard.js
// Project Dashboard component for HB Report, displaying key project metrics and summaries in a responsive grid layout
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://ant.design/components/grid/#api
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://ant.design/components/card/#api

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Space } from 'antd';
import { BarChartOutlined, CalendarOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons';
import ComponentHeader from './ComponentHeader.js'; // Import the shared ComponentHeader
import '../styles/global.css'; // Include global styles

/**
 * Project Dashboard component for displaying key project metrics and summaries
 * @param {Object} props - Component props
 * @param {Object} props.selectedProject - The currently selected project
 * @param {Object} props.headerContent - Header content passed from App.js
 * @returns {JSX.Element} Project Dashboard component with grid layout
 */
const ProjectDashboard = ({ selectedProject, headerContent }) => {
    const [dashboardData, setDashboardData] = useState({});

    // Mock dashboard data (replace with real data fetching logic from SQLite or Procore API)
    const fetchDashboardData = (project) => {
        // Simulate API or DB call using project data
        return {
            projectHealth: { score: 85, status: 'Good' },
            scheduleSummary: { onTrack: 70, delayed: 20, ahead: 10 },
            budgetConditions: { 
                total: project.budget || '$0', 
                spent: '$3,200,000', 
                remaining: '$1,800,000' 
            },
            manpowerRecap: { current: 45, peak: 60, avg: 50 },
        };
    };

    // Load data when selectedProject changes
    useEffect(() => {
        if (selectedProject) {
            const data = fetchDashboardData(selectedProject);
            setDashboardData(data);
        } else {
            setDashboardData({}); // Clear data if no project is selected
        }
    }, [selectedProject]);

    return (
        <div
            className="project-dashboard-container"
            style={{
                margin: 0, // Aligns to the top of the parent container
                display: 'flex',
                flexDirection: 'column',
                flex: 1, // Replaces minHeight to fit within the constrained Content height
            }}
        >
            {/* Render the ComponentHeader using headerContent */}
            <ComponentHeader title={headerContent.title} children={headerContent.actions} />

            {/* Dashboard Grid */}
            <div style={{ flex: 1, overflow: 'auto', padding: '0 24px' }}>
                {selectedProject ? (
                    <Row gutter={[16, 16]} style={{ minHeight: '100%' }}>
                        {/* Project Health */}
                        <Col xs={24} md={12} lg={6}>
                            <Card
                                title={
                                    <Space>
                                        <BarChartOutlined /> Project Health
                                    </Space>
                                }
                                bordered={false}
                                style={{ height: '100%' }}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <h2 style={{ fontSize: '24px', color: dashboardData.projectHealth?.status === 'Good' ? '#52c41a' : '#faad14' }}>
                                        {dashboardData.projectHealth?.score || 0}%
                                    </h2>
                                    <p>Status: {dashboardData.projectHealth?.status || 'N/A'}</p>
                                    <div style={{ height: '100px', background: '#f0f0f0', marginTop: '16px' }}>
                                        {/* Placeholder for gauge or chart */}
                                        <p style={{ padding: '40px 0', color: '#999' }}>Gauge Chart Placeholder</p>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        {/* Schedule Summary */}
                        <Col xs={24} md={12} lg={6}>
                            <Card
                                title={
                                    <Space>
                                        <CalendarOutlined /> Schedule Summary
                                    </Space>
                                }
                                bordered={false}
                                style={{ height: '100%' }}
                            >
                                <div>
                                    <p>On Track: {dashboardData.scheduleSummary?.onTrack || 0}%</p>
                                    <p>Delayed: {dashboardData.scheduleSummary?.delayed || 0}%</p>
                                    <p>Ahead: {dashboardData.scheduleSummary?.ahead || 0}%</p>
                                    <div style={{ height: '100px', background: '#f0f0f0', marginTop: '16px' }}>
                                        {/* Placeholder for bar or pie chart */}
                                        <p style={{ padding: '40px 0', color: '#999' }}>Pie Chart Placeholder</p>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        {/* Budget Conditions */}
                        <Col xs={24} md={12} lg={6}>
                            <Card
                                title={
                                    <Space>
                                        <DollarOutlined /> Budget Conditions
                                    </Space>
                                }
                                bordered={false}
                                style={{ height: '100%' }}
                            >
                                <div>
                                    <p>Total: {dashboardData.budgetConditions?.total || '$0'}</p>
                                    <p>Spent: {dashboardData.budgetConditions?.spent || '$0'}</p>
                                    <p>Remaining: {dashboardData.budgetConditions?.remaining || '$0'}</p>
                                    <div style={{ height: '100px', background: '#f0f0f0', marginTop: '16px' }}>
                                        {/* Placeholder for bar chart */}
                                        <p style={{ padding: '40px 0', color: '#999' }}>Bar Chart Placeholder</p>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        {/* Manpower Recap */}
                        <Col xs={24} md={12} lg={6}>
                            <Card
                                title={
                                    <Space>
                                        <TeamOutlined /> Manpower Recap
                                    </Space>
                                }
                                bordered={false}
                                style={{ height: '100%' }}
                            >
                                <div>
                                    <p>Current: {dashboardData.manpowerRecap?.current || 0}</p>
                                    <p>Peak: {dashboardData.manpowerRecap?.peak || 0}</p>
                                    <p>Average: {dashboardData.manpowerRecap?.avg || 0}</p>
                                    <div style={{ height: '100px', background: '#f0f0f0', marginTop: '16px' }}>
                                        {/* Placeholder for line chart */}
                                        <p style={{ padding: '40px 0', color: '#999' }}>Line Chart Placeholder</p>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        {/* Additional Section (e.g., Issues or Risks) */}
                        <Col xs={24} lg={12}>
                            <Card
                                title="Open Issues"
                                bordered={false}
                            >
                                <div style={{ height: '200px', background: '#f0f0f0' }}>
                                    {/* Placeholder for table or list */}
                                    <p style={{ padding: '90px 0', textAlign: 'center', color: '#999' }}>
                                        Table or List Placeholder
                                    </p>
                                </div>
                            </Card>
                        </Col>

                        {/* Additional Section (e.g., Milestones) */}
                        <Col xs={24} lg={12}>
                            <Card
                                title="Upcoming Milestones"
                                bordered={false}
                            >
                                <div style={{ height: '200px', background: '#f0f0f0' }}>
                                    {/* Placeholder for timeline or list */}
                                    <p style={{ padding: '90px 0', textAlign: 'center', color: '#999' }}>
                                        Timeline Placeholder
                                    </p>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                ) : (
                    <div style={{ textAlign: 'center', padding: '50px', color: 'var(--content-color)' }}>
                        <h2>No project selected</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDashboard;