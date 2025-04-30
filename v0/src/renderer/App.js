// src/renderer/App.js
// Main renderer component with global keyboard and mouse navigation
// Import this component in src/renderer/main.js to render the app's root layout
// Reference: https://ant.design/components/layout#api
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://ant.design/components/dropdown#api
// *Additional Reference*: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent

import React, { useState, useEffect } from 'react';
import { LicenseManager } from 'ag-grid-enterprise';
import '@ant-design/v5-patch-for-react-19';
import { Layout, Menu, Button, theme, Dropdown, Space, Badge, Avatar, Switch, Typography, Modal, message } from 'antd';
import { MenuOutlined, CaretRightOutlined, CaretLeftOutlined, BellOutlined, ExclamationCircleOutlined, QuestionCircleOutlined, DownOutlined, HomeOutlined, StarOutlined, PlusOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import HBLogo from './assets/images/HB_Logo_Large.png';
import Login from './components/Login.js';
import ErrorBoundary from './components/ErrorBoundary.js';
import Portfolio from './components/Portfolio.js';
import PortfolioV2 from './components/PortfolioV2.js';
import ProjectDashboard from './components/ProjectDashboard.js';
import ProjectDashboardV2 from './components/ProjectDashboardV2.js';
import Buyout from './components/Buyout.js';
import BuyoutV2 from './components/BuyoutV2.js';
import Forecasting from './components/Forecasting.js';
import ForecastingV2 from './components/ForecastingV2.js';
import Constraints from './components/Constraints.js';
import ConstraintsV2 from './components/ConstraintsV2.js';
import Responsibility from './components/Responsibility.js';
import ResponsibilityV2 from './components/ResponsibilityV2.js';
import Schedule from './components/Schedule.js';
import ScheduleV2 from './components/ScheduleV2.js';
import Permits from './components/Permits.js';
import PermitsV2 from './components/PermitsV2.js';
import SubGrades from './components/SubGrades.js';
import Staffing from './components/Staffing.js';
import Manpower from './components/Manpower.js';
import UserProfile from './components/UserProfile.js';
import navigationManager from './utils/NavigationManager.js';
import './styles/Components.css';
import './styles/global.css';
import './styles/ProjectToolsMenu.css';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);
    const [procoreUserId, setProcoreUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userData, setUserData] = useState(null);
    const [authView, setAuthView] = useState('login');
    const [collapsed, setCollapsed] = useState(false);
    const [activeView, setActiveView] = useState('portfolio');
    const [selectedProject, setSelectedProject] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [forecastingTab, setForecastingTab] = useState('gc-gr');
    const [projectToolsVisible, setProjectToolsVisible] = useState(false);
    const [useBeta, setUseBeta] = useState(false);
    const [navigationHistory, setNavigationHistory] = useState(['portfolio']);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [projectOptions, setProjectOptions] = useState([]);
    const [projectsData, setProjectsData] = useState([]);
    const [appKey, setAppKey] = useState(0);
    const [authToken, setAuthToken] = useState(null);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // Fetch and set AG Grid Enterprise license key on mount
    useEffect(() => {
        const setLicenseKey = async () => {
          try {
            const licenseKey = await window.electronAPI.getAgGridLicense();
            if (licenseKey) {
              LicenseManager.setLicenseKey(licenseKey);
              logger.info('AG Grid Enterprise license set successfully');
            } else {
              logger.warn('No AG Grid license key provided; running in Community mode');
            }
          } catch (error) {
            logger.error('Failed to set AG Grid license', { message: error.message, stack: error.stack });
          }
        };
        setLicenseKey();
      }, []);

    // Update window width on resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Trigger grid resize when activeView changes
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    }, [activeView]);

    // Register global navigation handlers (unchanged)
    useEffect(() => {
        const keyboardShortcuts = {
            'Ctrl+1': () => handleViewChange('portfolio'),
            'Ctrl+2': () => selectedProject && handleViewChange('health-dashboard'),
            'Ctrl+3': () => selectedProject && handleViewChange('buyout'),
            'Ctrl+4': () => selectedProject && handleViewChange('forecasting'),
            'Ctrl+T': () => setProjectToolsVisible(true),
            'Ctrl+P': () => document.querySelector('.ant-dropdown-trigger')?.focus(),
            'Ctrl+S': () => console.log('Export/Save action triggered'),
            'Ctrl+Shift+C': () => setCollapsed(!collapsed),
            'Tab': () => {
                const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const focused = document.activeElement;
                const index = Array.from(focusableElements).indexOf(focused);
                const nextElement = focusableElements[index + 1] || focusableElements[0];
                nextElement?.focus();
            },
        };
    
        const mouseHandlers = {
            back: () => {
                if (historyIndex > 0) {
                    setHistoryIndex(historyIndex - 1);
                    setActiveView(navigationHistory[historyIndex - 1]);
                }
            },
            forward: () => {
                if (historyIndex < navigationHistory.length - 1) {
                    setHistoryIndex(historyIndex + 1);
                    setActiveView(navigationHistory[historyIndex + 1]);
                }
            },
            middleClick: () => setProjectToolsVisible(!projectToolsVisible),
            gesture: (direction) => {
                if (direction === 'right') setCollapsed(false);
                else setCollapsed(true);
            },
        };
    
        const unregisterKeyboardShortcuts = Object.entries(keyboardShortcuts).map(([shortcut, handler]) =>
            navigationManager.registerKeyboardShortcut(shortcut, handler)
        );
        const unregisterMouseHandlers = Object.entries(mouseHandlers).map(([eventType, handler]) =>
            navigationManager.registerMouseHandler(eventType, handler)
        );
    
        return () => {
            unregisterKeyboardShortcuts.forEach(unregister => unregister());
            unregisterMouseHandlers.forEach(unregister => unregister());
        };
    }, [historyIndex, navigationHistory, selectedProject, projectToolsVisible, collapsed]);

    useEffect(() => {
        if (!isAuthenticated || !procoreUserId) {
            console.log('Not fetching projects: isAuthenticated or procoreUserId missing', { isAuthenticated, procoreUserId });
            return;
        }
    
        const fetchProjects = async () => {
            setIsLoadingProjects(true); // Assuming loading state from previous fix
            try {
                console.log('Fetching projects with procoreUserId:', procoreUserId);
                const token = await window.electronAPI.getAuthToken();
                console.log('Auth token available:', !!token);
                if (!token) {
                    console.error('No auth token available for fetching projects');
                    message.error('Authentication token missing. Please log in again.');
                    handleLogout();
                    return;
                }
    
                const projects = await window.electronAPI.getProjects(procoreUserId);
                console.log('Fetched Projects:', projects);
    
                setProjectsData(projects);
    
                const mappedOptions = projects.map(project => {
                    if (!project.procore_id) {
                        console.error('Project missing procore_id:', project);
                        return null;
                    }
                    if (!project.project_number || !project.name) {
                        console.error('Project missing required fields:', project);
                        return null;
                    }
                    const option = {
                        key: project.procore_id.toString(),
                        label: `${project.project_number} - ${project.name}`, // Updated to use project_number and name
                        procore_id: project.procore_id,
                        name: project.name,
                        projectNumber: project.project_number // Updated field name
                    };
                    console.log('Mapped Project Option:', option);
                    return option;
                }).filter(Boolean);
    
                console.log('Final Project Options:', mappedOptions);
                setProjectOptions(mappedOptions);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
                message.error('Failed to load projects. Please try again.');
            } finally {
                setIsLoadingProjects(false);
            }
        };
    
        fetchProjects();
    }, [isAuthenticated, procoreUserId]);

    const handleLoginSuccess = async (userId, email, token) => {
        setIsAuthenticated(true);
        setProcoreUserId(userId);
        setUserEmail(email);
        setAuthToken(token); // Store token in state for debugging
        await fetchUserData(userId);
        setActiveView('portfolio');
        setNavigationHistory(['portfolio']);
        setHistoryIndex(0);
        console.log(`Logged in with procore_user_id: ${userId}, email: ${email}, token: ${token ? 'present' : 'missing'}`);
    };

    const handleRegisterSuccess = (userId, email, nextView) => {
        if (userId && email) {
            setIsAuthenticated(true);
            setProcoreUserId(userId);
            setUserEmail(email);
            fetchUserData(userId);
            setActiveView('portfolio');
            setNavigationHistory(['portfolio']);
            setHistoryIndex(0);
        } else if (nextView === 'login') {
            setAuthView('login');
        }
    };

    const fetchUserData = async (userId) => {
        try {
            const data = await window.electronAPI.getUserProfile(userId);
            setUserData(data);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            message.error('Failed to load user profile. Please try again later.');
        }
    };

    const handleTokenExpired = () => {
        setLogoutModalVisible(true); // Show the logout modal
    };

    const handleLogout = () => {
        setLogoutModalVisible(true); // Show custom modal
    };

    const confirmLogout = () => {
        setLogoutModalVisible(false);
        setTimeout(() => {
            setIsAuthenticated(false);
            setProcoreUserId(null);
            setUserEmail(null);
            setUserData(null);
            setAuthToken(null);
            window.electronAPI.clearToken();
            setActiveView('portfolio');
            setSelectedProject(null);
            setNavigationHistory(['portfolio']);
            setHistoryIndex(0);
            setForecastingTab('gc-gr');
            setProjectToolsVisible(false);
            setUseBeta(false);
            setCollapsed(false);
            setAuthView('login');
            setAppKey((prev) => prev + 1);
            console.log('User logged out due to token expiration');
        }, 300);
    };

    const cancelLogout = () => {
        setLogoutModalVisible(false); // Trigger animated hide
        console.log('Logout canceled');
    };

    const handleViewChange = (view) => {
        const newHistory = navigationHistory.slice(0, historyIndex + 1);
        newHistory.push(view);
        setNavigationHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setActiveView(view);
    };

    const handleMenuClick = ({ key }) => {
        console.log(`Menu item clicked: ${key}`);
        handleViewChange(key);
        setProjectToolsVisible(false);
        console.log(`New activeView: ${key}`);
    };

    const handleProjectSelect = (arg) => {
        let key;
        if (typeof arg === 'string') {
            key = arg;
        } else if (arg && typeof arg === 'object') {
            key = arg.key || arg.procore_id?.toString();
        }
    
        console.log('Selected key:', key);
        const selected = projectOptions.find(p => p.key === key);
        console.log('Selected project option:', selected);
        if (!selected) {
            console.error('No project found for key:', key);
            return;
        }
        setSelectedProject({
            projectNumber: selected.projectNumber, // This is now project_number from the database
            name: selected.name,
            procore_id: selected.procore_id
        });
        handleViewChange('health-dashboard');
    };

    const projectToolsData = [
        {
            category: 'Core Tools',
            items: [
                { key: 'portfolio', label: 'Portfolio' },
                { key: 'open-items', label: 'My Open Items' },
                ...(selectedProject ? [
                    { key: 'health-dashboard', label: 'Project Dashboard' },
                    { key: 'staffing', label: 'Staffing Schedule' },
                    { key: 'subgrades', label: 'Subcontractor Score Card' },
                ] : []),
            ],
        },
        {
            category: 'Financial Reporting',
            items: [
                { key: 'health-dashboard', label: 'Project Dashboard' },
                ...(selectedProject ? [
                    { key: 'buyout', label: 'Buyout Schedule', quickCreate: true },
                    { key: 'forecasting', label: 'Budget Forecasting' },
                ] : []),
            ],
        },
        {
            category: 'Project Management',
            items: [
                ...(selectedProject ? [
                    { key: 'constraints', label: 'Constraints Log' },
                    { key: 'responsibility', label: 'Responsibility Matrix' },
                    { key: 'schedule', label: 'Schedule' },
                    { key: 'permits', label: 'Permit Log' },
                ] : []),
            ],
        },
        {
            category: 'Field Productivity',
            items: [
                ...(selectedProject ? [
                    { key: 'schedule', label: 'Schedule Monitor' },
                    { key: 'manpower', label: 'Manpower Log' },
                ] : []),
            ],
        },
        {
            category: 'Reports',
            items: [
                ...(selectedProject ? [
                    { key: 'reports', label: 'Monthly Reports' },
                ] : []),
            ],
        },
    ];

    const renderProjectToolsMenu = () => (
        <div className="project-tools-menu">
            {projectToolsData.map((group) => (
                <div key={group.category} className="tool-menu-column">
                    <div className="tool-menu-group-title">{group.category}</div>
                    <div className="tool-menu-group">
                        {group.items.map((item) => (
                            <div
                                key={item.key}
                                className="tool-menu-item"
                                onClick={() => handleMenuClick({ key: item.key })}
                            >
                                <StarOutlined className="tool-menu-star" />
                                <span className="tool-menu-item-label">{item.label}</span>
                                {item.quickCreate && (
                                    <PlusOutlined
                                        className="quick-create-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log(`Quick create for ${item.label}`);
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    const projectPickerMenu = (
        <Menu>
            {/* Bold "Projects" heading */}
            <Menu.Item
                key="header"
                disabled
                style={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#000',
                    cursor: 'default',
                    padding: '8px 16px',
                    borderBottom: '1px solid #e8e8e8',
                    marginBottom: '4px'
                }}
            >
                Projects
            </Menu.Item>
            {/* Loading state */}
            {isLoadingProjects ? (
                <Menu.Item key="loading" disabled>
                    Loading projects...
                </Menu.Item>
            ) : projectOptions.length > 0 ? (
                projectOptions.map(option => (
                    <Menu.Item
                        key={option.key}
                        onClick={() => handleProjectSelect(option)}
                    >
                        {option.label}
                    </Menu.Item>
                ))
            ) : (
                <Menu.Item key="no-projects" disabled>
                    No projects available
                </Menu.Item>
            )}
        </Menu>
    );

    const projectToolsText = () => {
        switch (activeView) {
            case 'portfolio': return 'Portfolio';
            case 'health-dashboard': return 'Project Dashboard';
            case 'buyout': return 'Buyout Schedule';
            case 'forecasting': return 'Budget Forecasting';
            case 'constraints': return 'Constraints Log';
            case 'open-items': return 'My Open Items';
            case 'schedule': return 'Schedule Monitor';
            case 'responsibility': return 'Responsibility Matrix';
            case 'permits': return 'Permit Log';
            case 'subgrades': return 'Subcontractor Score Card';
            case 'staffing': return 'Staffing Schedule';
            case 'manpower': return 'Manpower Log';
            default: return 'Portfolio';
        }
    };

    const getAvatarInitials = () => {
        if (userData && userData.first_name && userData.last_name) {
            return `${userData.first_name.charAt(0)}${userData.last_name.charAt(0)}`.toUpperCase();
        }
        return 'HB'; // Default fallback until userData is loaded
    };

    const userMenu = {
        items: [
            { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
            { key: 'sign-out', label: 'Sign Out', icon: <LogoutOutlined /> },
        ],
        onClick: ({ key }) => {
            if (key === 'profile') {
                if (!userData && procoreUserId) {
                    fetchUserData(procoreUserId);
                }
                handleViewChange('user-profile');
            } else if (key === 'sign-out') {
                handleLogout();
            }
        },
    };

    if (!isAuthenticated) {
        return authView === 'login' ? (
            <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setAuthView('register')} />
        ) : (
            <Register onRegisterSuccess={handleRegisterSuccess} />
        );
    }

    const projectPickerText = () =>
        activeView === 'portfolio' || !selectedProject
            ? 'Select a Project'
            : `${selectedProject.projectNumber} - ${selectedProject.name}`;

    const renderContent = () => {
        switch (activeView) {
            case 'portfolio':
                return (
                    <ErrorBoundary>
                        {useBeta ? (
                            <PortfolioV2
                                onProjectSelect={handleProjectSelect}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Portfolio (Beta)
                                        </h1>
                                    ),
                                    actions: null,
                                }}
                                procoreUserId={procoreUserId}
                                onTokenExpired={handleTokenExpired}
                                projectsData={projectsData} // Pass full projects data
                            />
                        ) : (
                            <Portfolio
                                onProjectSelect={handleProjectSelect}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Portfolio
                                        </h1>
                                    ),
                                    actions: null,
                                }}
                            />
                        )}
                    </ErrorBoundary>
                );
            case 'user-profile':
                return (
                    <ErrorBoundary>
                        <UserProfile
                            userData={userData}
                            onClose={() => handleViewChange(navigationHistory[historyIndex - 1] || 'portfolio')}
                        />
                    </ErrorBoundary>
                );
            case 'health-dashboard':
                return (
                    <ErrorBoundary>
                        {useBeta ? (
                            <ProjectDashboard
                                selectedProject={selectedProject}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Project Dashboard (Beta)
                                        </h1>
                                    ),
                                    actions: (
                                        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
                                            <li style={{ marginRight: '16px' }}>
                                                <Button type="text" style={{ color: 'var(--hb-blue)', fontWeight: 500 }} className="active">
                                                    Contracts
                                                </Button>
                                            </li>
                                            <li style={{ marginRight: '16px' }}>
                                                <Button type="text" onClick={() => console.log('Navigate to Recycle Bin')}>
                                                    Recycle Bin
                                                </Button>
                                            </li>
                                            <li>
                                                <Dropdown
                                                    menu={{
                                                        items: [{ key: 'additional-tab', label: 'Additional Tab' }],
                                                        onClick: ({ key }) => console.log(`Navigate to ${key}`),
                                                    }}
                                                    trigger={['click']}
                                                >
                                                    <Button type="text">
                                                        More <DownOutlined />
                                                    </Button>
                                                </Dropdown>
                                            </li>
                                        </ul>
                                    ),
                                }}
                            />
                        ) : (
                            <ProjectDashboard
                                selectedProject={selectedProject}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Project Dashboard
                                        </h1>
                                    ),
                                    actions: (
                                        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
                                            <li style={{ marginRight: '16px' }}>
                                                <Button type="text" style={{ color: 'var(--hb-blue)', fontWeight: 500 }} className="active">
                                                    Contracts
                                                </Button>
                                            </li>
                                            <li style={{ marginRight: '16px' }}>
                                                <Button type="text" onClick={() => console.log('Navigate to Recycle Bin')}>
                                                    Recycle Bin
                                                </Button>
                                            </li>
                                            <li>
                                                <Dropdown
                                                    menu={{
                                                        items: [{ key: 'additional-tab', label: 'Additional Tab' }],
                                                        onClick: ({ key }) => console.log(`Navigate to ${key}`),
                                                    }}
                                                    trigger={['click']}
                                                >
                                                    <Button type="text">
                                                        More <DownOutlined />
                                                    </Button>
                                                </Dropdown>
                                            </li>
                                        </ul>
                                    ),
                                    createOptions: [{ key: 'buyout', label: 'New Buyout' }],
                                    onCreateClick: (option) => console.log(`Create ${option.label}`),
                                    onExport: (type) => console.log(`Export ${type}`),
                                    exportRoleOptions: [{ key: 'csv', label: 'CSV' }, { key: 'pdf', label: 'PDF' }],
                                    buttonSize: 'default',
                                }}
                            />
                        )}
                    </ErrorBoundary>
                );
            case 'buyout':
                return (
                    <ErrorBoundary>
                        {useBeta ? (
                            <BuyoutV2
                                selectedProject={selectedProject} // Pass full selectedProject with procore_id
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Buyout Schedule (Beta)
                                        </h1>
                                    ),
                                    actions: (
                                        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
                                            <li style={{ marginRight: '16px' }}>
                                                <Button type="text" style={{ color: 'var(--hb-blue)', fontWeight: 500 }} className="active">
                                                    Contracts
                                                </Button>
                                            </li>
                                            <li style={{ marginRight: '16px' }}>
                                                <Button type="text" onClick={() => console.log('Navigate to Recycle Bin')}>
                                                    Recycle Bin
                                                </Button>
                                            </li>
                                            <li>
                                                <Dropdown
                                                    menu={{
                                                        items: [{ key: 'additional-tab', label: 'Additional Tab' }],
                                                        onClick: ({ key }) => console.log(`Navigate to ${key}`),
                                                    }}
                                                    trigger={['click']}
                                                >
                                                    <Button type="text">
                                                        More <DownOutlined />
                                                    </Button>
                                                </Dropdown>
                                            </li>
                                        </ul>
                                    ),
                                }}
                            />
                        ) : (
                            <Buyout
                                selectedProject={selectedProject}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Buyout Schedule
                                        </h1>
                                    ),
                                    actions: (
                                        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
                                            <li style={{ marginRight: '16px' }}>
                                                <Button type="text" style={{ color: 'var(--hb-blue)', fontWeight: 500 }} className="active">
                                                    Contracts
                                                </Button>
                                            </li>
                                            <li style={{ marginRight: '16px' }}>
                                                <Button type="text" onClick={() => console.log('Navigate to Recycle Bin')}>
                                                    Recycle Bin
                                                </Button>
                                            </li>
                                            <li>
                                                <Dropdown
                                                    menu={{
                                                        items: [{ key: 'additional-tab', label: 'Additional Tab' }],
                                                        onClick: ({ key }) => console.log(`Navigate to ${key}`),
                                                    }}
                                                    trigger={['click']}
                                                >
                                                    <Button type="text">
                                                        More <DownOutlined />
                                                    </Button>
                                                </Dropdown>
                                            </li>
                                        </ul>
                                    ),
                                    createOptions: [{ key: 'buyout', label: 'New Buyout' }],
                                    onCreateClick: (option) => console.log(`Create ${option.label}`),
                                    onExport: (type) => console.log(`Export ${type}`),
                                    exportRoleOptions: [{ key: 'csv', label: 'CSV' }, { key: 'pdf', label: 'PDF' }],
                                    buttonSize: 'default',
                                }}
                            />
                        )}
                    </ErrorBoundary>
                );
            case 'forecasting':
                return (
                    <ErrorBoundary>
                        {useBeta ? (
                            <ForecastingV2
                                selectedProject={selectedProject}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Budget Forecasting (Beta)
                                        </h1>
                                    ),
                                    tabs: [
                                        { key: 'gc-gr', label: 'GC & GR' },
                                        { key: 'owner-billing', label: 'Owner Billing' },
                                    ],
                                    actions: (
                                        <Space>
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        { key: 'pdf', label: <a href="#" onClick={() => console.log('Export to PDF')}>PDF</a> },
                                                        { key: 'csv', label: <a href="#" onClick={() => console.log('Export to CSV')}>CSV</a> },
                                                    ],
                                                }}
                                                trigger={['click']}
                                            >
                                                <Button aria-label="Export">
                                                    Export <DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </Space>
                                    ),
                                }}
                                activeTab={forecastingTab}
                                onTabChange={(key) => setForecastingTab(key)}
                            />
                        ) : (
                            <Forecasting
                                selectedProject={selectedProject}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Budget Forecasting
                                        </h1>
                                    ),
                                    tabs: [
                                        { key: 'gc-gr', label: 'GC & GR' },
                                        { key: 'owner-billing', label: 'Owner Billing' },
                                    ],
                                    actions: (
                                        <Space>
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        { key: 'pdf', label: <a href="#" onClick={() => console.log('Export to PDF')}>PDF</a> },
                                                        { key: 'csv', label: <a href="#" onClick={() => console.log('Export to CSV')}>CSV</a> },
                                                    ],
                                                }}
                                                trigger={['click']}
                                            >
                                                <Button aria-label="Export">
                                                    Export <DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </Space>
                                    ),
                                }}
                                activeTab={forecastingTab}
                                onTabChange={(key) => setForecastingTab(key)}
                            />
                        )}
                    </ErrorBoundary>
                );
            case 'constraints':
                return (
                    <ErrorBoundary>
                        {useBeta ? (
                            <ConstraintsV2
                                selectedProject={selectedProject}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Constraints (Beta)
                                        </h1>
                                    ),
                                    actions: (
                                        <Space>
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        { key: 'pdf', label: <a href="#" onClick={() => console.log('Export to PDF')}>PDF</a> },
                                                        { key: 'csv', label: <a href="#" onClick={() => console.log('Export to CSV')}>CSV</a> },
                                                    ],
                                                }}
                                                trigger={['click']}
                                            >
                                                <Button aria-label="Export">
                                                    Export <DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </Space>
                                    ),
                                }}
                            />
                        ) : (
                            <Constraints
                                selectedProject={selectedProject}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Constraints
                                        </h1>
                                    ),
                                    actions: (
                                        <Space>
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        { key: 'pdf', label: <a href="#" onClick={() => console.log('Export to PDF')}>PDF</a> },
                                                        { key: 'csv', label: <a href="#" onClick={() => console.log('Export to CSV')}>CSV</a> },
                                                    ],
                                                }}
                                                trigger={['click']}
                                            >
                                                <Button aria-label="Export">
                                                    Export <DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </Space>
                                    ),
                                }}
                            />
                        )}
                    </ErrorBoundary>
                );
            case 'responsibility':
                return (
                    <ErrorBoundary>
                        {useBeta ? (
                            <ResponsibilityV2
                                selectedProject={selectedProject}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Responsibility Matrix (Beta)
                                        </h1>
                                    ),
                                    actions: (
                                        <Space>
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        { key: 'pdf', label: <a href="#" onClick={() => console.log('Export to PDF')}>PDF</a> },
                                                        { key: 'csv', label: <a href="#" onClick={() => console.log('Export to CSV')}>CSV</a> },
                                                    ],
                                                }}
                                                trigger={['click']}
                                            >
                                                <Button aria-label="Export">
                                                    Export <DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </Space>
                                    ),
                                }}
                            />
                        ) : (
                            <Responsibility
                                selectedProject={selectedProject}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Responsibility Matrix
                                        </h1>
                                    ),
                                    actions: (
                                        <Space>
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        { key: 'pdf', label: <a href="#" onClick={() => console.log('Export to PDF')}>PDF</a> },
                                                        { key: 'csv', label: <a href="#" onClick={() => console.log('Export to CSV')}>CSV</a> },
                                                    ],
                                                }}
                                                trigger={['click']}
                                            >
                                                <Button aria-label="Export">
                                                    Export <DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </Space>
                                    ),
                                }}
                            />
                        )}
                    </ErrorBoundary>
                );
            case 'schedule':
                return (
                    <ErrorBoundary>
                        {useBeta ? (
                            <ScheduleV2
                                selectedProject={selectedProject}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Schedule Monitor (Beta)
                                        </h1>
                                    ),
                                    actions: (
                                        <Space>
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        { key: 'pdf', label: <a href="#" onClick={() => console.log('Export to PDF')}>PDF</a> },
                                                        { key: 'csv', label: <a href="#" onClick={() => console.log('Export to CSV')}>CSV</a> },
                                                    ],
                                                }}
                                                trigger={['click']}
                                            >
                                                <Button aria-label="Export">
                                                    Export <DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </Space>
                                    ),
                                }}
                            />
                        ) : (
                            <Schedule
                                selectedProject={selectedProject}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Schedule Monitor
                                        </h1>
                                    ),
                                    actions: (
                                        <Space>
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        { key: 'pdf', label: <a href="#" onClick={() => console.log('Export to PDF')}>PDF</a> },
                                                        { key: 'csv', label: <a href="#" onClick={() => console.log('Export to CSV')}>CSV</a> },
                                                    ],
                                                }}
                                                trigger={['click']}
                                            >
                                                <Button aria-label="Export">
                                                    Export <DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </Space>
                                    ),
                                }}
                            />
                        )}
                    </ErrorBoundary>
                );
            case 'permits':
                return (
                    <ErrorBoundary>
                        {useBeta ? (
                            <PermitsV2
                                selectedProject={selectedProject}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Permit Log (Beta)
                                        </h1>
                                    ),
                                    actions: (
                                        <Space>
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        { key: 'pdf', label: <a href="#" onClick={() => console.log('Export to PDF')}>PDF</a> },
                                                        { key: 'csv', label: <a href="#" onClick={() => console.log('Export to CSV')}>CSV</a> },
                                                    ],
                                                }}
                                                trigger={['click']}
                                            >
                                                <Button aria-label="Export">
                                                    Export <DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </Space>
                                    ),
                                }}
                            />
                        ) : (
                            <Permits
                                selectedProject={selectedProject}
                                headerContent={{
                                    title: (
                                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                            Permit Log
                                        </h1>
                                    ),
                                    actions: (
                                        <Space>
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        { key: 'pdf', label: <a href="#" onClick={() => console.log('Export to PDF')}>PDF</a> },
                                                        { key: 'csv', label: <a href="#" onClick={() => console.log('Export to CSV')}>CSV</a> },
                                                    ],
                                                }}
                                                trigger={['click']}
                                            >
                                                <Button aria-label="Export">
                                                    Export <DownOutlined />
                                                </Button>
                                            </Dropdown>
                                        </Space>
                                    ),
                                }}
                            />
                        )}
                    </ErrorBoundary>
                );
            case 'subgrades':
                return (
                    <ErrorBoundary>
                        <SubGrades
                            selectedProject={selectedProject}
                            headerContent={{
                                title: (
                                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                        Subcontractor Score Card
                                    </h1>
                                ),
                                actions: (
                                    <Space>
                                        <Dropdown
                                            menu={{
                                                items: [
                                                    { key: 'pdf', label: <a href="#" onClick={() => console.log('Export to PDF')}>PDF</a> },
                                                    { key: 'csv', label: <a href="#" onClick={() => console.log('Export to CSV')}>CSV</a> },
                                                ],
                                            }}
                                            trigger={['click']}
                                        >
                                            <Button aria-label="Export">
                                                Export <DownOutlined />
                                            </Button>
                                        </Dropdown>
                                    </Space>
                                ),
                            }}
                        />
                    </ErrorBoundary>
                );
            case 'staffing':
                return (
                    <ErrorBoundary>
                        <Staffing
                            selectedProject={selectedProject}
                            headerContent={{
                                title: (
                                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                        Staffing Schedule
                                    </h1>
                                ),
                                actions: (
                                    <Space>
                                        <Dropdown
                                            menu={{
                                                items: [
                                                    { key: 'pdf', label: <a href="#" onClick={() => console.log('Export to PDF')}>PDF</a> },
                                                    { key: 'csv', label: <a href="#" onClick={() => console.log('Export to CSV')}>CSV</a> },
                                                ],
                                            }}
                                            trigger={['click']}
                                        >
                                            <Button aria-label="Export">
                                                Export <DownOutlined />
                                            </Button>
                                        </Dropdown>
                                    </Space>
                                ),
                            }}
                        />
                    </ErrorBoundary>
                );
            case 'manpower':
                return (
                    <ErrorBoundary>
                        <Manpower
                            selectedProject={selectedProject}
                            headerContent={{
                                title: (
                                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                        Manpower Log
                                    </h1>
                                ),
                            }}
                        />
                    </ErrorBoundary>
                );
            case 'open-items':
                return (
                    <ErrorBoundary>
                        <div>
                            <h1>My Open Items</h1>
                            <p>Placeholder for My Open Items content.</p>
                        </div>
                    </ErrorBoundary>
                );
            default:
                return (
                    <ErrorBoundary>
                        <Portfolio
                            onProjectSelect={handleProjectSelect}
                            headerContent={{
                                title: (
                                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: 0 }}>
                                        Portfolio
                                    </h1>
                                ),
                                actions: null,
                            }}
                        />
                    </ErrorBoundary>
                );
        }
    };

    const hideSidebar = ['buyout', 'forecasting', 'constraints', 'responsibility', 'schedule', 'permits', 'staffing'].includes(activeView);

    if (!isAuthenticated) {
        return <Login onLoginSuccess={(userId, email) => handleLoginSuccess(userId, email)} />;
    }

    return (
        <Layout style={{ height: '100vh', overflow: 'hidden', background: '#ffffff' }}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--hb-blue)',
                    padding: '0 16px',
                    height: 52,
                    lineHeight: '52px',
                    position: 'fixed',
                    width: '100%',
                    zIndex: 1000,
                }}
            >
                <Space size="small">
                    <Button
                        type="text"
                        icon={<HomeOutlined style={{ color: '#fff', fontSize: 16 }} />}
                        onClick={() => {
                            setSelectedProject(null);
                            handleViewChange('portfolio');
                        }}
                        style={{ padding: '0 8px', height: 40, lineHeight: '46.8px' }}
                    />
                    <img src={HBLogo} alt="HB Report Logo" style={{ height: 32, marginRight: 8, verticalAlign: 'middle' }} />
                    <Dropdown
                        overlay={projectPickerMenu}
                        trigger={['click']}
                    >
                        <div
                            style={{
                                color: '#fff',
                                cursor: 'pointer',
                                padding: '2px 8px',
                                height: 40,
                                background: '#0060a9',
                                borderRadius: 4,
                                border: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                width: 240,
                            }}
                        >
                            <div style={{ fontSize: '9px', lineHeight: '1.1', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                HB Report
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 500, lineHeight: '1.1', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {projectPickerText()}
                                <DownOutlined style={{ marginLeft: 4, fontSize: 10 }} />
                            </div>
                        </div>
                    </Dropdown>
                    <Dropdown
                        open={projectToolsVisible}
                        onOpenChange={(visible) => setProjectToolsVisible(visible)}
                        overlay={renderProjectToolsMenu}
                        trigger={['click']}
                        overlayClassName="project-tools-dropdown"
                        overlayStyle={{ width: windowWidth, left: 0 }}
                    >
                        <div
                            style={{
                                color: '#fff',
                                cursor: 'pointer',
                                padding: '2px 8px',
                                height: 40,
                                background: '#0060a9',
                                borderRadius: 4,
                                border: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                minWidth: 260,
                            }}
                        >
                            <div style={{ fontSize: '9px', lineHeight: '1.1', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Project Tools
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 500, lineHeight: '1.1', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {projectToolsText()}
                                <DownOutlined style={{ marginLeft: 4, fontSize: 10 }} />
                            </div>
                        </div>
                    </Dropdown>
                </Space>
                <Space size="small">
                    {process.env.NODE_ENV === 'development' && (
                        <Space size="small" style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 12 }}>Beta</Text>
                            <Switch
                                checked={useBeta}
                                onChange={(checked) => setUseBeta(checked)}
                                size="small"
                                checkedChildren="On"
                                unCheckedChildren="Off"
                            />
                        </Space>
                    )}
                    <QuestionCircleOutlined style={{ color: '#fff', fontSize: 18, verticalAlign: 'middle' }} onClick={() => console.log('Help clicked')} />
                    <Badge count={3} offset={[0, 0]} size="small">
                        <BellOutlined style={{ color: '#fff', fontSize: 18, verticalAlign: 'middle' }} onClick={() => console.log('Notifications clicked')} />
                    </Badge>
                    <Dropdown menu={userMenu} trigger={['click']}>
                        <Avatar
                            style={{ backgroundColor: '#fff', color: '#000', fontSize: 12, width: 24, height: 24, lineHeight: '24px', verticalAlign: 'middle', cursor: 'pointer' }}
                        >
                            {getAvatarInitials()}
                        </Avatar>
                    </Dropdown>
                </Space>
            </Header>

            <Layout style={{ marginTop: 52 }}>
                <Content
                    style={{
                        marginRight: hideSidebar ? 0 : (collapsed ? 80 : 250),
                        height: 'calc(100vh - 52px)',
                        padding: '0 16px 16px',
                        boxSizing: 'border-box',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        {renderContent()}
                    </div>
                </Content>
                {!hideSidebar && (
                    <Sider
                        width={250}
                        collapsedWidth={80}
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}
                        trigger={null}
                        style={{
                            position: 'fixed',
                            top: 52,
                            right: 0,
                            height: 'calc(100vh - 52px)',
                            zIndex: 10,
                            background: colorBgContainer,
                            transition: 'width 0.2s',
                        }}
                    >
                        <div style={{ height: 'calc(100% - 40px)', overflowY: 'auto' }}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['active']}
                                defaultOpenKeys={['custom-reports']}
                                items={[
                                    {
                                        key: 'custom-reports',
                                        label: 'Custom Reports',
                                        children: [
                                            { key: 'active', label: 'Active' },
                                            { key: 'aviation', label: 'Aviation' },
                                            { key: 'residential', label: 'Residential' },
                                        ],
                                    },
                                ]}
                            />
                        </div>
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                textAlign: 'center',
                                padding: '8px 0',
                                borderTop: '1px solid #e8e8e8',
                                background: colorBgContainer,
                            }}
                        >
                            <Button type="text" onClick={() => setCollapsed(!collapsed)} style={{ width: '100%' }}>
                                {collapsed ? (
                                    <>
                                        <CaretLeftOutlined /> Expand Sidebar
                                    </>
                                ) : (
                                    <>
                                        Minimize Sidebar <CaretRightOutlined />
                                    </>
                                )}
                            </Button>
                        </div>
                    </Sider>
                )}
            </Layout>

            <Footer
                style={{
                    textAlign: 'center',
                    background: 'var(--hb-blue)',
                    color: '#fff',
                    padding: '5px 0',
                    height: 21,
                    display: 'none',
                }}
            >
                <span>Powered by HB Report ©{new Date().getFullYear()}</span>
            </Footer>
            <Modal
                visible={logoutModalVisible}
                onCancel={cancelLogout}
                footer={null}
                className="logout-modal"
                closable={false}
                centered
            >
                <div className="logout-modal-content">
                    <ExclamationCircleOutlined className="logout-modal-icon" />
                    <h2>Confirm Logout</h2>
                    <p>Are you sure you want to sign out of HB Report?</p>
                    <div className="logout-modal-buttons">
                        <Button onClick={cancelLogout} className="logout-modal-cancel">
                            No, Stay Logged In
                        </Button>
                        <Button type="primary" onClick={confirmLogout} className="logout-modal-confirm">
                            Yes, Sign Out
                        </Button>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default App;