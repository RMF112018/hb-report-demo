'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './auth-context'

export interface TourStep {
  id: string
  title: string
  content: string
  target: string // CSS selector for the element to highlight
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center'
  nextButton?: string
  prevButton?: string
  showSkip?: boolean
  onNext?: () => void
  onPrev?: () => void
  onSkip?: () => void
}

export interface TourDefinition {
  id: string
  name: string
  description: string
  steps: TourStep[]
  userRoles?: string[] // Which user roles can see this tour
  page?: string // Which page this tour is for
}

interface TourContextType {
  isActive: boolean
  currentTour: string | null
  currentStep: number
  availableTours: TourDefinition[]
  startTour: (tourId: string, isAutoStart?: boolean) => void
  stopTour: () => void
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
  goToStep: (stepIndex: number) => void
  toggleTourAvailability: () => void
  isTourAvailable: boolean
  getCurrentTourDefinition: () => TourDefinition | null
  getCurrentStep: () => TourStep | null
  resetTourState: () => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

// Tour definitions
const TOUR_DEFINITIONS: TourDefinition[] = [
  {
    id: 'login-demo-accounts',
    name: 'Demo Account Selection',
    description: 'Learn how to select different user roles and access demo accounts',
    page: 'login',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to HB Report Demo!',
        content: 'This guided tour will show you how to explore the application with different user roles. Each role provides access to different features and dashboard layouts.',
        target: '.login-card',
        placement: 'center',
        nextButton: 'Get Started',
        showSkip: true
      },
      {
        id: 'demo-accounts-button',
        title: 'Demo Account Access',
        content: 'Click this button to see available demo accounts. Each account represents a different user role with specific permissions and dashboard configurations.<br/><br/><strong>Go ahead and click it now!</strong>',
        target: '[data-tour="demo-accounts-toggle"]',
        placement: 'left',
        nextButton: 'Continue',
        onNext: () => {
          // Ensure demo accounts dropdown is open for next step
          const button = document.querySelector('[data-tour="demo-accounts-toggle"]') as HTMLButtonElement
          const dropdown = document.querySelector('[data-tour="demo-accounts-list"]')
          
          if (button && !dropdown) {
            button.click()
          }
          
          // Small delay to allow DOM to update
          setTimeout(() => {
            const newDropdown = document.querySelector('[data-tour="demo-accounts-list"]')
            if (newDropdown) {
              newDropdown.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }
          }, 300)
        }
      },
      {
        id: 'role-selection',
        title: 'Choose Your Role',
        content: 'Each demo account represents a different user role with unique dashboard layouts and features.<br/><br/><strong>💼 Executive</strong> - Portfolio overview<br/><strong>👥 Project Executive</strong> - Multi-project management<br/><strong>📊 Project Manager</strong> - Detailed controls<br/><strong>🏗️ Estimator</strong> - Pre-construction focus<br/><strong>⚙️ Admin</strong> - System administration<br/><br/><em>Click any account to log in and explore!</em>',
        target: '[data-tour="demo-accounts-list"]',
        placement: 'left',
        nextButton: 'Got it!'
      },
      {
        id: 'login-process',
        title: 'Automatic Login',
        content: 'Once you select a demo account, you\'ll be automatically logged in and redirected to the appropriate dashboard for that role. The dashboard content and available tools will vary based on your selected role.',
        target: '.login-form',
        placement: 'right',
        nextButton: 'Start Exploring',
        onNext: () => {
          // Close demo accounts dropdown if open
          const button = document.querySelector('[data-tour="demo-accounts-toggle"]') as HTMLButtonElement
          const dropdown = document.querySelector('[data-tour="demo-accounts-list"]')
          if (button && dropdown) {
            button.click()
          }
        }
      }
    ]
  },
  {
    id: 'dashboard-overview',
    name: 'Complete Dashboard Tour',
    description: 'Comprehensive guide to all dashboard features and navigation elements',
    page: 'dashboard',
    steps: [
      {
        id: 'dashboard-welcome',
        title: 'Welcome to Your Dashboard!',
        content: 'This dashboard is customized for your role and provides the most relevant information and tools for your daily work. Let\'s explore all the features available to you.',
        target: '[data-tour="dashboard-content"]',
        placement: 'center',
        nextButton: 'Start Tour'
      },
      {
        id: 'environment-menu',
        title: 'Environment Navigation',
        content: 'Switch between different work environments:<br/><br/><strong>📊 Operations</strong> - Active project management<br/><strong>🏗️ Pre-Construction</strong> - Planning and estimation<br/><strong>📁 Archive</strong> - Completed projects<br/><br/>Each environment provides specialized tools and views for different phases of work.',
        target: '[data-tour="environment-menu"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'projects-menu',
        title: 'Project Selection',
        content: 'Access and switch between your active projects. This dropdown shows all projects you have permissions to view and manage. Click to change your current project context.',
        target: '[data-tour="projects-menu"]',
        placement: 'bottom',
        nextButton: 'Next'
      },
      {
        id: 'tools-menu',
        title: 'Tools & Utilities',
        content: 'Access powerful tools and utilities for project management:<br/><br/>• Document management<br/>• Reporting tools<br/>• Import/export functions<br/>• Integration settings<br/>• Custom workflows',
        target: '[data-tour="tools-menu"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'search-bar',
        title: 'Global Search',
        content: 'Quickly find projects, documents, contacts, or any information across the platform. Use keywords, project names, or specific data to locate what you need instantly.',
        target: '[data-tour="search-bar"]',
        placement: 'bottom',
        nextButton: 'Next'
      },
      {
        id: 'tours-menu',
        title: 'Guided Tours',
        content: 'Access interactive tours and help resources. Tours are contextual - different tours are available based on your current page and role permissions.',
        target: '[data-tour="tour-controls"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'dashboard-selector',
        title: 'Dashboard Views',
        content: 'Switch between different dashboard layouts optimized for your role:<br/><br/>• Executive summary view<br/>• Detailed project controls<br/>• Financial overview<br/>• Custom layouts<br/><br/>Each view presents the most relevant information for your workflow.',
        target: '[data-tour="dashboard-selector"]',
        placement: 'left',
        nextButton: 'Next'
      },
      {
        id: 'dashboard-controls',
        title: 'Dashboard Controls',
        content: 'Customize your dashboard experience:<br/><br/><strong>✏️ Edit</strong> - Modify card layouts and content<br/><strong>📐 Layout</strong> - Adjust spacing and arrangement<br/><strong>⛶ Fullscreen</strong> - Maximize dashboard view<br/><br/>Make your dashboard work exactly how you need it.',
        target: '[data-tour="dashboard-controls"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'kpi-widgets',
        title: 'Key Performance Indicators',
        content: 'Monitor critical project metrics at a glance. These KPI widgets show real-time data for budget health, schedule performance, safety metrics, and other key indicators relevant to your role.',
        target: '[data-tour="kpi-widgets"]',
        placement: 'bottom',
        nextButton: 'Next'
      },
      {
        id: 'hbi-insights',
        title: 'HB Intelligence Insights',
        content: 'AI-powered insights and recommendations based on your project data. Get predictive analytics, risk assessments, and actionable recommendations to improve project outcomes.',
        target: '[data-tour="hbi-insights"]',
        placement: 'left',
        nextButton: 'Finish Tour'
      }
    ]
  },
  {
    id: 'scheduler-comprehensive',
    name: 'Scheduler Complete Tour',
    description: 'In-depth exploration of all scheduler modules and features for project schedule management',
    page: 'scheduler',
    steps: [
      {
        id: 'scheduler-welcome',
        title: 'Welcome to HB Report Scheduler!',
        content: 'The Scheduler is your central hub for AI-powered project scheduling and optimization. This comprehensive tour will guide you through all five modules and their powerful features for managing construction schedules.',
        target: '[data-tour="scheduler-page-header"]',
        placement: 'center',
        nextButton: 'Begin Tour',
        showSkip: true
      },
      {
        id: 'scheduler-scope-badges',
        title: 'Project Scope & Health Overview',
        content: 'These badges show your current view scope and real-time schedule health score:<br/><br/><strong>📊 View Scope</strong> - Single project, portfolio, or enterprise view<br/><strong>🎯 Health Score</strong> - AI-calculated schedule performance indicator<br/><br/>The health score updates in real-time based on critical path analysis, constraint validation, and risk assessment.',
        target: '[data-tour="scheduler-scope-badges"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'scheduler-quick-stats',
        title: 'Schedule Quick Stats Dashboard',
        content: 'Monitor key schedule metrics at a glance:<br/><br/><strong>📅 Total Activities</strong> - All scheduled tasks<br/><strong>🎯 Critical Path</strong> - Project duration driver<br/><strong>💯 Health Score</strong> - Overall schedule performance<br/><strong>📊 Variance</strong> - Schedule vs baseline deviation<br/><strong>⏰ Milestones</strong> - Upcoming critical dates<br/><br/>These metrics automatically adjust based on your role and project scope.',
        target: '[data-tour="scheduler-quick-stats"]',
        placement: 'bottom',
        nextButton: 'Next'
      },
      {
        id: 'scheduler-tabs-overview',
        title: 'Five Powerful Scheduler Modules',
        content: 'The Scheduler includes five specialized modules for comprehensive schedule management:<br/><br/><strong>📊 Overview</strong> - Analytics & insights<br/><strong>📺 Monitor</strong> - Schedule comparison & tracking<br/><strong>🩺 Health Analysis</strong> - Logic validation & quality checks<br/><strong>👁️ Look Ahead</strong> - Detailed planning & frag nets<br/><strong>⚡ Generator</strong> - AI-powered schedule creation<br/><br/>Each module is designed for specific scheduling workflows.',
        target: '[data-tour="scheduler-tabs"]',
        placement: 'bottom',
        nextButton: 'Explore Modules'
      },
      {
        id: 'overview-module-intro',
        title: 'Overview Module - Analytics Dashboard',
        content: 'The Overview module provides comprehensive schedule analytics and AI insights. It\'s your starting point for understanding overall schedule performance, trends, and HBI recommendations.',
        target: '[data-tour="overview-tab"]',
        placement: 'bottom',
        nextButton: 'See Features',
        onNext: () => {
          const overviewTab = document.querySelector('[data-tour="overview-tab"]') as HTMLButtonElement;
          if (overviewTab && !overviewTab.getAttribute('data-state')?.includes('active')) {
            overviewTab.click();
          }
        }
      },
      {
        id: 'overview-key-metrics',
        title: 'Key Performance Metrics',
        content: 'Track critical schedule indicators with visual progress tracking:<br/><br/><strong>📈 Schedule Progress</strong> - Completion percentage with activity breakdown<br/><strong>🎯 Critical Path</strong> - Current duration vs baseline<br/><strong>👥 Resource Utilization</strong> - Team efficiency metrics<br/><strong>🔄 Schedule Velocity</strong> - Progress rate analysis<br/><br/>Each metric includes trend indicators and variance tracking.',
        target: '[data-tour="overview-key-metrics"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'overview-hbi-insights',
        title: 'HB Intelligence Schedule Insights',
        content: 'AI-powered schedule analysis provides:<br/><br/><strong>🚨 Risk Alerts</strong> - Predictive delay warnings<br/><strong>💡 Optimization Opportunities</strong> - Resource reallocation suggestions<br/><strong>🔍 Coordination Issues</strong> - Trade interference detection<br/><strong>📊 Performance Forecasts</strong> - Completion probability analysis<br/><br/>Each insight includes confidence scores and actionable recommendations.',
        target: '[data-tour="overview-hbi-insights"]',
        placement: 'left',
        nextButton: 'Next Module'
      },
      {
        id: 'monitor-module-intro',
        title: 'Schedule Monitor - Comparison & Tracking',
        content: 'The Monitor module enables schedule comparison and detailed tracking. Upload new schedules, compare with baselines, and analyze milestone performance to identify variances and trends.',
        target: '[data-tour="monitor-tab"]',
        placement: 'bottom',
        nextButton: 'Explore Monitor',
        onNext: () => {
          const monitorTab = document.querySelector('[data-tour="monitor-tab"]') as HTMLButtonElement;
          if (monitorTab && !monitorTab.getAttribute('data-state')?.includes('active')) {
            monitorTab.click();
          }
        }
      },
      {
        id: 'monitor-file-upload',
        title: 'Schedule File Upload & Management',
        content: 'Upload and manage schedule files from multiple sources:<br/><br/><strong>📄 Supported Formats</strong> - .xer, .mpp, .xml, .csv files<br/><strong>📁 Drag & Drop</strong> - Simple file upload interface<br/><strong>🔄 Auto-Processing</strong> - Automatic validation and integration<br/><strong>📊 Version Control</strong> - Track schedule revisions and changes<br/><br/>Files are automatically validated for quality and completeness.',
        target: '[data-tour="monitor-file-upload"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'monitor-comparison-tools',
        title: 'Schedule Comparison Analytics',
        content: 'Powerful comparison tools for schedule analysis:<br/><br/><strong>📊 Baseline Comparison</strong> - Current vs original schedule<br/><strong>🔄 Period Comparison</strong> - Month-over-month changes<br/><strong>🎯 Milestone Tracking</strong> - Critical date variance analysis<br/><strong>📈 Trend Analysis</strong> - Performance patterns over time<br/><br/>Interactive charts show detailed variance and impact analysis.',
        target: '[data-tour="monitor-comparison"]',
        placement: 'left',
        nextButton: 'Next Module'
      },
      {
        id: 'health-analysis-intro',
        title: 'Health Analysis - Schedule Quality Validation',
        content: 'The Health Analysis module performs deep schedule logic validation inspired by SmartPM.com methodologies. It identifies logic issues, validates constraints, and ensures schedule integrity.',
        target: '[data-tour="health-tab"]',
        placement: 'bottom',
        nextButton: 'Explore Health',
        onNext: () => {
          const healthTab = document.querySelector('[data-tour="health-tab"]') as HTMLButtonElement;
          if (healthTab && !healthTab.getAttribute('data-state')?.includes('active')) {
            healthTab.click();
          }
        }
      },
      {
        id: 'health-overall-score',
        title: 'Overall Schedule Health Score',
        content: 'The health score is calculated using multiple factors:<br/><br/><strong>🔗 Logic Validation</strong> - Relationship integrity checks<br/><strong>⏱️ Duration Analysis</strong> - Activity duration reasonableness<br/><strong>🚫 Constraint Conflicts</strong> - Date and resource constraint validation<br/><strong>📊 Critical Path</strong> - Float and dependency analysis<br/><br/>A score of 85+ indicates a well-structured, reliable schedule.',
        target: '[data-tour="health-overall-score"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'health-logic-issues',
        title: 'Logic Issues Detection & Resolution',
        content: 'Comprehensive logic validation identifies:<br/><br/><strong>🔗 Missing Links</strong> - Activities without proper predecessors/successors<br/><strong>🔄 Circular Logic</strong> - Dependency loops and conflicts<br/><strong>❌ Invalid Relationships</strong> - Impossible or illogical sequences<br/><strong>⚠️ Constraint Conflicts</strong> - Date and resource conflicts<br/><br/>Each issue includes severity rating and resolution recommendations.',
        target: '[data-tour="health-logic-issues"]',
        placement: 'left',
        nextButton: 'Next Module'
      },
      {
        id: 'lookahead-intro',
        title: 'Look Ahead - Detailed Planning & Execution',
        content: 'The Look Ahead module creates detailed frag net schedules for field execution. Break down activities into granular tasks, assign resources, and track progress at the daily level.',
        target: '[data-tour="lookahead-tab"]',
        placement: 'bottom',
        nextButton: 'Explore Look Ahead',
        onNext: () => {
          const lookaheadTab = document.querySelector('[data-tour="lookahead-tab"]') as HTMLButtonElement;
          if (lookaheadTab && !lookaheadTab.getAttribute('data-state')?.includes('active')) {
            lookaheadTab.click();
          }
        }
      },
      {
        id: 'lookahead-frag-nets',
        title: 'Frag Net Schedule Creation',
        content: 'Create detailed execution schedules:<br/><br/><strong>🔄 Activity Breakdown</strong> - Split master schedule activities into executable tasks<br/><strong>👥 Resource Assignment</strong> - Assign specific crews and equipment<br/><strong>📅 Daily Planning</strong> - Hour-by-hour task scheduling<br/><strong>📊 Progress Tracking</strong> - Real-time completion monitoring<br/><br/>Frag nets bridge the gap between master schedule and daily execution.',
        target: '[data-tour="lookahead-frag-nets"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'lookahead-controls',
        title: 'Frag Net Management Controls',
        content: 'Powerful tools for frag net management:<br/><br/><strong>➕ Create New</strong> - Build new frag nets from master activities<br/><strong>✏️ Edit Existing</strong> - Modify tasks and assignments<br/><strong>📋 Clone Templates</strong> - Reuse proven sequences<br/><strong>📤 Export Plans</strong> - Share with field teams<br/><br/>Templates can be saved for similar activities across projects.',
        target: '[data-tour="lookahead-controls"]',
        placement: 'left',
        nextButton: 'Final Module'
      },
      {
        id: 'generator-intro',
        title: 'Generator - AI-Powered Schedule Creation',
        content: 'The Generator module uses HB Intelligence to create complete construction schedules from project parameters. Input your project details and let AI generate optimized schedules with industry best practices.',
        target: '[data-tour="generator-tab"]',
        placement: 'bottom',
        nextButton: 'Explore Generator',
        onNext: () => {
          const generatorTab = document.querySelector('[data-tour="generator-tab"]') as HTMLButtonElement;
          if (generatorTab && !generatorTab.getAttribute('data-state')?.includes('active')) {
            generatorTab.click();
          }
        }
      },
      {
        id: 'generator-project-setup',
        title: 'AI Schedule Generation Setup',
        content: 'Configure your project for AI schedule generation:<br/><br/><strong>🏗️ Project Type</strong> - Commercial, residential, infrastructure<br/><strong>📊 Complexity Level</strong> - Simple to highly complex projects<br/><strong>📅 Key Dates</strong> - Start, milestones, and completion targets<br/><strong>💰 Budget Range</strong> - Cost parameters for resource planning<br/><strong>👥 Team Size</strong> - Available resources and crew sizes<br/><br/>More detailed inputs result in more accurate AI-generated schedules.',
        target: '[data-tour="generator-project-setup"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'generator-optimization',
        title: 'Schedule Optimization Options',
        content: 'Choose optimization priorities for AI generation:<br/><br/><strong>⏱️ Time Optimization</strong> - Minimize project duration<br/><strong>💰 Cost Optimization</strong> - Reduce resource and equipment costs<br/><strong>⭐ Quality Focus</strong> - Maximize quality control and review time<br/><strong>⚖️ Balanced Approach</strong> - Optimize across all factors<br/><br/>The AI uses machine learning from thousands of successful construction projects.',
        target: '[data-tour="generator-optimization"]',
        placement: 'left',
        nextButton: 'Continue'
      },
      {
        id: 'generator-results',
        title: 'AI-Generated Schedule Results',
        content: 'Review and refine AI-generated schedules:<br/><br/><strong>📊 Confidence Scores</strong> - AI confidence in each activity and duration<br/><strong>🎯 Critical Path</strong> - Automatically identified critical activities<br/><strong>📈 Risk Analysis</strong> - Built-in risk assessment and contingencies<br/><strong>📤 Export Options</strong> - Multiple format export capabilities<br/><br/>Generated schedules can be further refined and customized before use.',
        target: '[data-tour="generator-results"]',
        placement: 'center',
        nextButton: 'Tour Complete!'
      }
    ]
  },
  {
    id: 'financial-hub-complete',
    name: 'Financial Hub Complete Tour',
    description: 'Comprehensive guide to all financial management features and workflows',
    page: 'financial-hub',
    steps: [
      {
        id: 'financial-hub-welcome',
        title: 'Welcome to the Financial Hub!',
        content: 'Your comprehensive financial management command center. This hub provides real-time financial insights, budget analysis, cash flow management, and automated payment processing for optimal project financial control.',
        target: '[data-tour="financial-hub-content"]',
        placement: 'center',
        nextButton: 'Start Tour'
      },
      {
        id: 'financial-hub-header-intro',
        title: 'Financial Hub Dashboard',
        content: 'The Financial Hub centralizes all your project financial data and tools. From here you can monitor budgets, analyze cash flow, process payments, and generate comprehensive financial reports.',
        target: '[data-tour="financial-hub-header"]',
        placement: 'bottom'
      },
      {
        id: 'financial-hub-scope-controls',
        title: 'Project Scope & Health Score',
        content: 'View your current project scope and overall financial health score. The scope determines which projects data you\'re viewing (single project, portfolio, or enterprise-wide), while the health score provides an instant assessment of financial performance.',
        target: '[data-tour="financial-hub-scope"]',
        placement: 'bottom'
      },
      {
        id: 'financial-hub-quick-stats-overview',
        title: 'Financial Quick Stats',
        content: 'These cards provide instant access to your most critical financial metrics. Each card shows current values with trend indicators to help you quickly assess financial performance at a glance.',
        target: '[data-tour="financial-hub-quick-stats"]',
        placement: 'bottom'
      },
      {
        id: 'financial-hub-contract-value-card',
        title: 'Total Contract Value',
        content: 'Monitor your total contracted revenue across all active projects. This represents the full value of your construction contracts and provides the foundation for all financial planning and analysis.',
        target: '[data-tour="financial-hub-contract-value"]',
        placement: 'bottom'
      },
      {
        id: 'financial-hub-cash-flow-card',
        title: 'Net Cash Flow Tracking',
        content: 'Real-time view of your net cash position showing the difference between cash inflows and outflows. Positive cash flow indicates healthy operations while negative flow may require attention to working capital management.',
        target: '[data-tour="financial-hub-cash-flow"]',
        placement: 'bottom'
      },
      {
        id: 'financial-hub-profit-margin-card',
        title: 'Profit Margin Analysis',
        content: 'Track your current profit margin percentage across projects. This key performance indicator helps you understand project profitability and identify opportunities for margin improvement or cost optimization.',
        target: '[data-tour="financial-hub-profit-margin"]',
        placement: 'bottom'
      },
      {
        id: 'financial-hub-pending-approvals-card',
        title: 'Pending Approvals Queue',
        content: 'Monitor payment applications and change orders awaiting approval. This helps you track approval bottlenecks and ensures timely processing of financial documents to maintain healthy cash flow.',
        target: '[data-tour="financial-hub-pending-approvals"]',
        placement: 'bottom'
      },
      {
        id: 'financial-hub-navigation-intro',
        title: 'Financial Module Navigation',
        content: 'Navigate between different financial management modules using these tabs. Each module provides specialized tools and analytics for specific aspects of financial management from overview dashboards to detailed forecasting.',
        target: '[data-tour="financial-hub-navigation"]',
        placement: 'bottom'
      },
      {
        id: 'financial-hub-overview-tab',
        title: 'Overview Module',
        content: 'The Overview module provides a comprehensive financial dashboard with key metrics, trend analysis, and HBI AI insights. Start here to get a complete picture of your financial performance and identify areas needing attention.',
        target: '[data-tour="financial-hub-tab-overview"]',
        placement: 'bottom'
      },
      {
        id: 'financial-hub-budget-tab',
        title: 'Budget Analysis Module',
        content: 'Deep dive into budget performance with variance analysis, cost tracking, and predictive modeling. This module helps you understand where money is being spent and identify opportunities for cost optimization.',
        target: '[data-tour="financial-hub-tab-budget-analysis"]',
        placement: 'bottom'
      },
      {
        id: 'financial-hub-cash-flow-tab',
        title: 'Cash Flow Management',
        content: 'Comprehensive cash flow analysis with forecasting, liquidity monitoring, and risk assessment. Essential for maintaining healthy working capital and predicting future cash needs.',
        target: '[data-tour="financial-hub-tab-cash-flow"]',
        placement: 'bottom'
      },
      {
        id: 'financial-hub-forecasting-tab',
        title: 'Financial Forecasting',
        content: 'Advanced forecasting tools with AI-powered predictions and scenario modeling. Use this module to plan future financial performance and make data-driven decisions about resource allocation.',
        target: '[data-tour="financial-hub-tab-forecasting"]',
        placement: 'bottom'
      },
      {
        id: 'financial-hub-pay-app-tab',
        title: 'Pay Applications',
        content: 'Generate and manage formal AIA G702/G703 payment applications. This module streamlines the payment request process with automated calculations, compliance tracking, and approval workflows.',
        target: '[data-tour="financial-hub-tab-pay-authorization"]',
        placement: 'bottom'
      },
      {
        id: 'overview-metrics-section',
        title: 'Overview: Key Financial Metrics',
        content: 'These metric cards show your most important financial KPIs including total budget, actual spend, budget variance, and completion rates. Colors indicate performance status - green for good, yellow for caution, red for attention needed.',
        target: '[data-tour="overview-key-metrics"]',
        placement: 'bottom'
      },
      {
        id: 'overview-hbi-insights-section',
        title: 'HBI AI Financial Insights',
        content: 'Our AI analyzes your financial data to provide actionable insights and recommendations. These insights help identify cost optimization opportunities, budget risks, and performance improvements automatically.',
        target: '[data-tour="overview-hbi-insights"]',
        placement: 'bottom'
      },
      {
        id: 'overview-charts-section',
        title: 'Financial Analytics Charts',
        content: 'Interactive charts provide visual analysis of your financial data trends. Use these to understand cash flow patterns, budget performance, and identify seasonal or cyclical patterns in your financial performance.',
        target: '[data-tour="overview-charts"]',
        placement: 'bottom'
      },
      {
        id: 'overview-cash-flow-chart',
        title: 'Cash Flow Trend Analysis',
        content: 'This chart shows monthly cash inflows, outflows, and net cash position over time. Use it to identify cash flow patterns, seasonal variations, and plan for future working capital needs.',
        target: '[data-tour="overview-cash-flow-chart"]',
        placement: 'top'
      },
      {
        id: 'overview-budget-chart',
        title: 'Budget vs Actual Performance',
        content: 'Compare budgeted amounts against actual spending by category. This visualization helps identify which cost categories are over or under budget and guides decision-making for cost control measures.',
        target: '[data-tour="overview-budget-chart"]',
        placement: 'top'
      },
      {
        id: 'pay-app-module-intro',
        title: 'Pay Applications Module',
        content: 'The Pay Applications module handles formal AIA payment requests with automated calculations, compliance tracking, and approval workflows. This is where you create, submit, and track payment applications for your projects.',
        target: '[data-tour="pay-app-header"]',
        placement: 'bottom'
      },
      {
        id: 'pay-app-create-button',
        title: 'Create New Payment Application',
        content: 'Click here to create a new AIA G702/G703 payment application. The system will guide you through the process with automated line item calculations, retention tracking, and compliance validation.',
        target: '[data-tour="pay-app-create-button"]',
        placement: 'bottom'
      },
      {
        id: 'pay-app-summary-overview',
        title: 'Payment Application Summary',
        content: 'These cards provide a quick overview of your payment application status including total applications, pending approvals, approved amounts, and monthly statistics to track your payment processing performance.',
        target: '[data-tour="pay-app-summary-cards"]',
        placement: 'bottom'
      },
      {
        id: 'pay-app-hbi-intelligence',
        title: 'HBI Payment Intelligence',
        content: 'Our AI analyzes your payment application data to identify approval bottlenecks, compliance issues, and optimization opportunities. Get automated insights to improve your payment processing efficiency.',
        target: '[data-tour="pay-app-hbi-insights"]',
        placement: 'bottom'
      },
      {
        id: 'pay-app-applications-management',
        title: 'Applications List Management',
        content: 'View, filter, and manage all your payment applications in one centralized location. Track status, amounts, approval progress, and access detailed application forms for editing or review.',
        target: '[data-tour="pay-app-applications-list"]',
        placement: 'top'
      },
      {
        id: 'financial-hub-workflow-tips',
        title: 'Financial Hub Workflow Tips',
        content: 'For optimal results:<br/><br/>📊 Start with Overview for health assessment<br/>💰 Use Cash Flow for liquidity planning<br/>📈 Check Budget Analysis for cost control<br/>📋 Process Pay Apps regularly for cash flow<br/>🔮 Use Forecasting for strategic planning',
        target: '[data-tour="financial-hub-navigation"]',
        placement: 'top'
      },
      {
        id: 'financial-hub-tour-complete',
        title: 'Financial Hub Tour Complete!',
        content: 'You\'re now equipped to use the Financial Hub effectively. Remember that all modules work together to provide comprehensive financial management. Start exploring and leverage the AI insights to optimize your project financial performance!',
        target: '[data-tour="financial-hub-content"]',
        placement: 'center',
        nextButton: 'Complete Tour'
      }
    ]
  }
]

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false)
  const [currentTour, setCurrentTour] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isTourAvailable, setIsTourAvailable] = useState(true)
  const { user } = useAuth()

  // Load tour availability preference
  useEffect(() => {
    const tourPref = localStorage.getItem('hb-tour-available')
    if (tourPref !== null) {
      const available = JSON.parse(tourPref)
      console.log('Tour availability from localStorage:', available)
      setIsTourAvailable(available)
    } else {
      console.log('No tour preference found, defaulting to true')
      setIsTourAvailable(true)
    }
  }, [])

  // Clean up completed tours
  useEffect(() => {
    if (!isActive && currentTour) {
      const timer = setTimeout(() => {
        setCurrentTour(null)
        setCurrentStep(0)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [isActive, currentTour])

  // Get available tours based on user role and current page
  const availableTours = TOUR_DEFINITIONS.filter(tour => {
    if (tour.userRoles && user) {
      return tour.userRoles.includes(user.role)
    }
    return true
  })

  // Debug available tours
  useEffect(() => {
    console.log('Available tours:', availableTours.map(t => t.id))
    console.log('Tour availability state:', isTourAvailable)
    console.log('Current user:', user?.role || 'no user')
  }, [availableTours, isTourAvailable, user])

  const getCurrentTourDefinition = (): TourDefinition | null => {
    if (!currentTour) return null
    return TOUR_DEFINITIONS.find(tour => tour.id === currentTour) || null
  }

  const getCurrentStep = (): TourStep | null => {
    const tour = getCurrentTourDefinition()
    if (!tour || currentStep >= tour.steps.length) return null
    return tour.steps[currentStep]
  }

  const startTour = (tourId: string, isAutoStart: boolean = false) => {
    console.log('Starting tour:', tourId, 'Auto-start:', isAutoStart)
    
    // If this is an auto-start, check if we've already shown this tour in this session
    if (isAutoStart) {
      const sessionKey = `hb-tour-shown-${tourId}`
      const hasShownInSession = sessionStorage.getItem(sessionKey)
      
      if (hasShownInSession) {
        console.log(`Tour ${tourId} already shown in this session, skipping auto-start`)
        return
      }
      
      // Mark as shown in this session
      sessionStorage.setItem(sessionKey, 'true')
    }
    
    const tour = TOUR_DEFINITIONS.find(t => t.id === tourId)
    console.log('Found tour:', tour)
    if (tour) {
      console.log('Setting tour active:', tourId)
      setCurrentTour(tourId)
      setCurrentStep(0)
      setIsActive(true)
    } else {
      console.error('Tour not found:', tourId)
    }
  }

  const stopTour = () => {
    console.log('Stopping tour')
    setIsActive(false)
    setCurrentTour(null)
    setCurrentStep(0)
    
    // Close any open dropdowns that might have been triggered by tour
    const demoAccountsButton = document.querySelector('[data-tour="demo-accounts-toggle"]') as HTMLButtonElement
    const dropdown = document.querySelector('[data-tour="demo-accounts-list"]')
    if (demoAccountsButton && dropdown) {
      demoAccountsButton.click()
    }
  }

  const nextStep = () => {
    const tour = getCurrentTourDefinition()
    if (!tour) return

    const step = getCurrentStep()
    if (step?.onNext) {
      step.onNext()
    }

    if (currentStep < tour.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      stopTour()
    }
  }

  const prevStep = () => {
    const step = getCurrentStep()
    if (step?.onPrev) {
      step.onPrev()
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTour = () => {
    console.log('Skipping tour')
    const step = getCurrentStep()
    if (step?.onSkip) {
      step.onSkip()
    }
    stopTour()
  }

  const goToStep = (stepIndex: number) => {
    const tour = getCurrentTourDefinition()
    if (tour && stepIndex >= 0 && stepIndex < tour.steps.length) {
      setCurrentStep(stepIndex)
    }
  }

  const toggleTourAvailability = () => {
    const newAvailability = !isTourAvailable
    setIsTourAvailable(newAvailability)
    localStorage.setItem('hb-tour-available', JSON.stringify(newAvailability))
    
    if (!newAvailability && isActive) {
      stopTour()
    }
  }

  // Add resetTourState function to context
  const resetTourState = () => {
    console.log('Resetting all tour state')
    setIsActive(false)
    setCurrentTour(null)
    setCurrentStep(0)
    
    // Clear all session-based tour tracking
    const keysToRemove = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && (key.startsWith('hb-tour-') || key.startsWith('hb-welcome-'))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key))
    
    // Reset tour availability preference
    localStorage.removeItem('hb-tour-available')
    setIsTourAvailable(true)
    
    console.log('Tour state completely reset')
  }

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentTour,
        currentStep,
        availableTours,
        startTour,
        stopTour,
        nextStep,
        prevStep,
        skipTour,
        goToStep,
        toggleTourAvailability,
        isTourAvailable,
        getCurrentTourDefinition,
        getCurrentStep,
        resetTourState,
      }}
    >
      {children}
    </TourContext.Provider>
  )
}

export const useTour = (): TourContextType => {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
} 