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
  },
  {
    id: 'permit-log-comprehensive',
    name: 'Permit Log Complete Tour',
    description: 'Comprehensive guide to permit tracking, compliance management, and inspection workflows',
    page: 'permit-log',
    steps: [
      {
        id: 'permit-log-welcome',
        title: 'Welcome to the Permit Log!',
        content: 'Your comprehensive permit tracking and compliance management system. This tour will guide you through all six modules for managing construction permits, inspections, and regulatory compliance efficiently.',
        target: '[data-tour="permit-log-page-header"]',
        placement: 'center',
        nextButton: 'Begin Tour',
        showSkip: true
      },
      {
        id: 'permit-log-scope-badges',
        title: 'Project Scope & Compliance Overview',
        content: 'These badges show your current view scope and real-time permit compliance status:<br/><br/><strong>📊 View Scope</strong> - Single project, portfolio, or enterprise view<br/><strong>✅ Compliance Score</strong> - AI-calculated permit compliance indicator<br/><br/>The compliance score updates based on permit status, inspection results, and regulatory requirements.',
        target: '[data-tour="permit-log-scope-badges"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'permit-log-quick-stats',
        title: 'Permit Quick Stats Dashboard',
        content: 'Monitor key permit metrics at a glance:<br/><br/><strong>📋 Total Permits</strong> - All tracked permits<br/><strong>⏰ Pending Applications</strong> - Awaiting authority approval<br/><strong>✅ Active Permits</strong> - Currently valid permits<br/><strong>🔍 Inspections Due</strong> - Upcoming inspections required<br/><strong>⚠️ Expiring Soon</strong> - Permits nearing expiration<br/><br/>These metrics automatically adjust based on your role and project scope.',
        target: '[data-tour="permit-log-quick-stats"]',
        placement: 'bottom',
        nextButton: 'Next'
      },
      {
        id: 'permit-log-tabs-overview',
        title: 'Six Comprehensive Permit Management Modules',
        content: 'The Permit Log includes six specialized modules for complete permit lifecycle management:<br/><br/><strong>📊 Overview</strong> - Analytics & compliance insights<br/><strong>📋 Permits</strong> - Application tracking & management<br/><strong>🔍 Inspections</strong> - Inspection scheduling & results<br/><strong>📅 Calendar</strong> - Timeline view & scheduling<br/><strong>📈 Analytics</strong> - Performance metrics & trends<br/><strong>📄 Reports</strong> - Compliance reporting & documentation<br/><br/>Each module supports specific permit management workflows.',
        target: '[data-tour="permit-log-tabs"]',
        placement: 'bottom',
        nextButton: 'Explore Modules'
      },
      {
        id: 'overview-module-intro',
        title: 'Overview Module - Permit Analytics Dashboard',
        content: 'The Overview module provides comprehensive permit analytics and compliance insights. Start here to understand overall permit performance, identify issues, and get HBI recommendations for process improvements.',
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
        title: 'Key Permit Performance Metrics',
        content: 'Track critical permit indicators with visual progress tracking:<br/><br/><strong>📈 Approval Rate</strong> - Percentage of successful applications<br/><strong>⏱️ Processing Time</strong> - Average approval duration<br/><strong>✅ Compliance Score</strong> - Overall regulatory compliance<br/><strong>🔄 Renewal Rate</strong> - On-time permit renewals<br/><br/>Each metric includes trend indicators and benchmark comparisons.',
        target: '[data-tour="overview-key-metrics"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'overview-hbi-insights',
        title: 'HB Intelligence Permit Insights',
        content: 'AI-powered permit analysis provides:<br/><br/><strong>🚨 Compliance Alerts</strong> - Regulatory requirement warnings<br/><strong>💡 Process Optimization</strong> - Application improvement suggestions<br/><strong>🔍 Risk Assessment</strong> - Delay and rejection risk analysis<br/><strong>📊 Authority Intelligence</strong> - Historical approval patterns<br/><br/>Each insight includes confidence scores and actionable recommendations.',
        target: '[data-tour="overview-hbi-insights"]',
        placement: 'left',
        nextButton: 'Next Module'
      },
      {
        id: 'permits-module-intro',
        title: 'Permits Module - Application Management',
        content: 'The Permits module handles the complete permit application lifecycle from submission to approval. Manage applications, track status, and maintain comprehensive permit records.',
        target: '[data-tour="permits-tab"]',
        placement: 'bottom',
        nextButton: 'Explore Permits',
        onNext: () => {
          const permitsTab = document.querySelector('[data-tour="permits-tab"]') as HTMLButtonElement;
          if (permitsTab && !permitsTab.getAttribute('data-state')?.includes('active')) {
            permitsTab.click();
          }
        }
      },
      {
        id: 'permits-filters-panel',
        title: 'Advanced Permit Filtering System',
        content: 'Powerful filtering tools to find specific permits quickly:<br/><br/><strong>🏷️ Status Filtering</strong> - Filter by application/approval status<br/><strong>📅 Date Ranges</strong> - Application, approval, and expiration dates<br/><strong>🏛️ Authority Selection</strong> - Filter by issuing authority<br/><strong>🔍 Text Search</strong> - Search permit numbers, descriptions<br/><br/>Combine multiple filters for precise permit selection.',
        target: '[data-tour="permits-filters"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'permits-table-management',
        title: 'Permit Table Management',
        content: 'Comprehensive permit data management:<br/><br/><strong>📊 Sortable Columns</strong> - Sort by any field for analysis<br/><strong>📝 Quick Actions</strong> - Edit, view, or duplicate permits<br/><strong>🚨 Status Indicators</strong> - Visual permit status badges<br/><strong>📤 Bulk Operations</strong> - Export or manage multiple permits<br/><br/>Role-based permissions control available actions.',
        target: '[data-tour="permits-table"]',
        placement: 'left',
        nextButton: 'Next Module'
      },
      {
        id: 'inspections-module-intro',
        title: 'Inspections Module - Quality Control',
        content: 'The Inspections module manages all permit-related inspections from scheduling to results. Track inspector assignments, document findings, and ensure compliance with all requirements.',
        target: '[data-tour="inspections-tab"]',
        placement: 'bottom',
        nextButton: 'Explore Inspections',
        onNext: () => {
          const inspectionsTab = document.querySelector('[data-tour="inspections-tab"]') as HTMLButtonElement;
          if (inspectionsTab && !inspectionsTab.getAttribute('data-state')?.includes('active')) {
            inspectionsTab.click();
          }
        }
      },
      {
        id: 'inspections-scheduling',
        title: 'Inspection Scheduling & Management',
        content: 'Comprehensive inspection workflow management:<br/><br/><strong>📅 Schedule Inspections</strong> - Book inspector appointments<br/><strong>👥 Inspector Assignment</strong> - Track assigned inspectors<br/><strong>📋 Checklist Management</strong> - Standardized inspection criteria<br/><strong>📸 Photo Documentation</strong> - Visual inspection records<br/><br/>Integration with authority systems for seamless scheduling.',
        target: '[data-tour="inspections-scheduling"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'inspections-results-tracking',
        title: 'Inspection Results & Follow-up',
        content: 'Complete inspection results management:<br/><br/><strong>✅ Pass/Fail Tracking</strong> - Inspection outcome documentation<br/><strong>⚠️ Issue Management</strong> - Track deficiencies and corrections<br/><strong>🔄 Re-inspection Scheduling</strong> - Follow-up inspection management<br/><strong>📊 Compliance Scoring</strong> - Overall inspection performance<br/><br/>Automated follow-up notifications and compliance tracking.',
        target: '[data-tour="inspections-results"]',
        placement: 'left',
        nextButton: 'Next Module'
      },
      {
        id: 'calendar-module-intro',
        title: 'Calendar Module - Timeline Visualization',
        content: 'The Calendar module provides visual timeline management for all permit-related activities. View applications, inspections, and deadlines in an intuitive calendar interface.',
        target: '[data-tour="calendar-tab"]',
        placement: 'bottom',
        nextButton: 'Explore Calendar',
        onNext: () => {
          const calendarTab = document.querySelector('[data-tour="calendar-tab"]') as HTMLButtonElement;
          if (calendarTab && !calendarTab.getAttribute('data-state')?.includes('active')) {
            calendarTab.click();
          }
        }
      },
      {
        id: 'calendar-event-types',
        title: 'Permit Calendar Event Types',
        content: 'Color-coded events for different permit activities:<br/><br/><strong>🟦 Application Submissions</strong> - Permit application deadlines<br/><strong>🟩 Approvals Received</strong> - Permit approval dates<br/><strong>🟨 Inspections Scheduled</strong> - Upcoming inspections<br/><strong>🟧 Permit Expirations</strong> - Renewal requirements<br/><br/>Each event type uses distinct colors for easy identification.',
        target: '[data-tour="calendar-events"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'calendar-navigation',
        title: 'Calendar Navigation & Views',
        content: 'Flexible calendar viewing options:<br/><br/><strong>📅 Month View</strong> - Overview of monthly activities<br/><strong>📆 Week View</strong> - Detailed weekly scheduling<br/><strong>🔍 Event Details</strong> - Click events for full information<br/><strong>🏷️ Filter Events</strong> - Show/hide specific event types<br/><br/>Navigate easily between dates and view levels.',
        target: '[data-tour="calendar-navigation"]',
        placement: 'left',
        nextButton: 'Next Module'
      },
      {
        id: 'analytics-module-intro',
        title: 'Analytics Module - Performance Intelligence',
        content: 'The Analytics module provides deep insights into permit performance with trend analysis, authority benchmarking, and predictive modeling for process optimization.',
        target: '[data-tour="analytics-tab"]',
        placement: 'bottom',
        nextButton: 'Explore Analytics',
        onNext: () => {
          const analyticsTab = document.querySelector('[data-tour="analytics-tab"]') as HTMLButtonElement;
          if (analyticsTab && !analyticsTab.getAttribute('data-state')?.includes('active')) {
            analyticsTab.click();
          }
        }
      },
      {
        id: 'analytics-performance-charts',
        title: 'Permit Performance Analytics',
        content: 'Interactive charts and visualizations:<br/><br/><strong>📊 Approval Trends</strong> - Historical approval rate analysis<br/><strong>⏱️ Processing Time Charts</strong> - Authority performance comparison<br/><strong>🎯 Success Rate Analysis</strong> - Application success patterns<br/><strong>📈 Volume Forecasting</strong> - Predicted permit requirements<br/><br/>All charts support drill-down analysis and export capabilities.',
        target: '[data-tour="analytics-charts"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'analytics-authority-comparison',
        title: 'Authority Performance Benchmarking',
        content: 'Compare performance across different regulatory authorities:<br/><br/><strong>🏛️ Authority Profiles</strong> - Individual authority performance<br/><strong>⚖️ Comparative Analysis</strong> - Side-by-side authority comparison<br/><strong>📊 Historical Trends</strong> - Authority performance over time<br/><strong>💡 Best Practices</strong> - Optimization recommendations<br/><br/>Use this data to optimize application strategies by authority.',
        target: '[data-tour="analytics-authority-comparison"]',
        placement: 'left',
        nextButton: 'Final Module'
      },
      {
        id: 'reports-module-intro',
        title: 'Reports Module - Compliance Documentation',
        content: 'The Reports module generates comprehensive compliance reports for internal review, audits, and regulatory submissions with automated formatting and distribution.',
        target: '[data-tour="reports-tab"]',
        placement: 'bottom',
        nextButton: 'Explore Reports',
        onNext: () => {
          const reportsTab = document.querySelector('[data-tour="reports-tab"]') as HTMLButtonElement;
          if (reportsTab && !reportsTab.getAttribute('data-state')?.includes('active')) {
            reportsTab.click();
          }
        }
      },
      {
        id: 'reports-templates',
        title: 'Report Templates & Customization',
        content: 'Pre-configured report templates for common needs:<br/><br/><strong>📋 Compliance Summary</strong> - Overall permit compliance status<br/><strong>📊 Performance Reports</strong> - Detailed performance analytics<br/><strong>🔍 Audit Reports</strong> - Regulatory audit preparation<br/><strong>📈 Executive Dashboard</strong> - High-level management summary<br/><br/>All templates support customization and branding.',
        target: '[data-tour="reports-templates"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'reports-distribution',
        title: 'Automated Report Distribution',
        content: 'Efficient report sharing and distribution:<br/><br/><strong>📧 Email Distribution</strong> - Automated stakeholder notifications<br/><strong>📤 Export Options</strong> - PDF, Excel, and CSV formats<br/><strong>📅 Scheduled Reports</strong> - Recurring report generation<br/><strong>🔒 Access Control</strong> - Role-based report access<br/><br/>Set up automated workflows to keep stakeholders informed.',
        target: '[data-tour="reports-distribution"]',
        placement: 'left',
        nextButton: 'Complete Tour'
      },
      {
        id: 'permit-log-workflow-tips',
        title: 'Permit Log Workflow Best Practices',
        content: 'For optimal permit management:<br/><br/>📊 Start with Overview for compliance assessment<br/>📋 Use Permits tab for application management<br/>🔍 Track Inspections proactively<br/>📅 Monitor Calendar for deadlines<br/>📈 Review Analytics for process improvement<br/>📄 Generate Reports for stakeholder communication',
        target: '[data-tour="permit-log-tabs"]',
        placement: 'top'
      },
      {
        id: 'permit-log-tour-complete',
        title: 'Permit Log Tour Complete!',
        content: 'You\'re now equipped to manage permits effectively using all six modules. Remember that proactive permit management prevents delays and ensures regulatory compliance. Use the HBI insights to continuously optimize your permit processes!',
        target: '[data-tour="permit-log-page-header"]',
        placement: 'center',
        nextButton: 'Complete Tour'
      }
    ]
  },
  {
    id: 'constraints-log-comprehensive',
    name: 'Constraints Log Complete Tour',
    description: 'Comprehensive guide to constraint management, scheduling optimization, and project coordination',
    page: 'constraints-log',
    steps: [
      {
        id: 'constraints-log-welcome',
        title: 'Welcome to the Constraints Log!',
        content: 'Your comprehensive constraint management and schedule optimization system. This tour will guide you through all modules for identifying, tracking, and resolving project constraints that impact schedule performance.',
        target: '[data-tour="constraints-log-page-header"]',
        placement: 'center',
        nextButton: 'Begin Tour',
        showSkip: true
      },
      {
        id: 'constraints-log-scope-badges',
        title: 'Project Scope & Constraint Health',
        content: 'These badges show your current view scope and real-time constraint management status:<br/><br/><strong>📊 View Scope</strong> - Single project, portfolio, or enterprise view<br/><strong>⚠️ Constraint Score</strong> - AI-calculated constraint impact indicator<br/><br/>The constraint score reflects overall project health based on active constraints and resolution progress.',
        target: '[data-tour="constraints-log-scope-badges"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'constraints-log-quick-stats',
        title: 'Constraint Quick Stats Dashboard',
        content: 'Monitor key constraint metrics at a glance:<br/><br/><strong>⚠️ Active Constraints</strong> - Currently impacting project<br/><strong>🔴 Critical Constraints</strong> - High priority issues<br/><strong>📅 Overdue Actions</strong> - Past due resolution activities<br/><strong>🎯 Resolution Rate</strong> - Successfully resolved this month<br/><strong>📊 Impact Days</strong> - Total schedule impact<br/><br/>These metrics help prioritize constraint management efforts.',
        target: '[data-tour="constraints-log-quick-stats"]',
        placement: 'bottom',
        nextButton: 'Next'
      },
      {
        id: 'constraints-log-tabs-overview',
        title: 'Comprehensive Constraint Management Modules',
        content: 'The Constraints Log includes specialized modules for complete constraint lifecycle management:<br/><br/><strong>📊 Overview</strong> - Analytics & impact assessment<br/><strong>📋 Constraints</strong> - Constraint tracking & management<br/><strong>📈 Gantt View</strong> - Schedule impact visualization<br/><strong>🔍 Analysis</strong> - Root cause & trend analysis<br/><strong>📄 Reports</strong> - Constraint reporting & documentation<br/><br/>Each module supports specific constraint management workflows.',
        target: '[data-tour="constraints-log-tabs"]',
        placement: 'bottom',
        nextButton: 'Explore Modules'
      },
      {
        id: 'overview-module-intro',
        title: 'Overview Module - Constraint Analytics Dashboard',
        content: 'The Overview module provides comprehensive constraint analytics and impact assessment. Start here to understand overall constraint impact, identify patterns, and get HBI recommendations for resolution.',
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
        title: 'Key Constraint Performance Metrics',
        content: 'Track critical constraint indicators with visual impact analysis:<br/><br/><strong>📈 Resolution Rate</strong> - Percentage of constraints resolved<br/><strong>⏱️ Average Resolution Time</strong> - Time to constraint closure<br/><strong>🎯 Schedule Impact</strong> - Total days of schedule delay<br/><strong>🔄 Recurrence Analysis</strong> - Repeat constraint patterns<br/><br/>Each metric includes trend indicators and performance benchmarks.',
        target: '[data-tour="overview-key-metrics"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'overview-hbi-insights',
        title: 'HB Intelligence Constraint Insights',
        content: 'AI-powered constraint analysis provides:<br/><br/><strong>🚨 Critical Path Impact</strong> - Schedule disruption warnings<br/><strong>💡 Resolution Strategies</strong> - Proven resolution approaches<br/><strong>🔍 Pattern Recognition</strong> - Recurring constraint identification<br/><strong>📊 Predictive Modeling</strong> - Future constraint forecasting<br/><br/>Each insight includes confidence scores and implementation guidance.',
        target: '[data-tour="overview-hbi-insights"]',
        placement: 'left',
        nextButton: 'Next Module'
      },
      {
        id: 'constraints-module-intro',
        title: 'Constraints Module - Issue Management',
        content: 'The Constraints module handles the complete constraint lifecycle from identification to resolution. Log new constraints, assign ownership, and track progress to closure.',
        target: '[data-tour="constraints-tab"]',
        placement: 'bottom',
        nextButton: 'Explore Constraints',
        onNext: () => {
          const constraintsTab = document.querySelector('[data-tour="constraints-tab"]') as HTMLButtonElement;
          if (constraintsTab && !constraintsTab.getAttribute('data-state')?.includes('active')) {
            constraintsTab.click();
          }
        }
      },
      {
        id: 'constraints-filters-panel',
        title: 'Advanced Constraint Filtering System',
        content: 'Powerful filtering tools to manage constraint data effectively:<br/><br/><strong>🏷️ Status Filtering</strong> - Filter by constraint status<br/><strong>📅 Date Ranges</strong> - Creation, due, and resolution dates<br/><strong>👥 Assignment Filter</strong> - Filter by responsible party<br/><strong>🔍 Category Search</strong> - Filter by constraint type<br/><br/>Combine multiple filters for precise constraint analysis.',
        target: '[data-tour="constraints-filters"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'constraints-table-management',
        title: 'Constraint Table Management',
        content: 'Comprehensive constraint data management:<br/><br/><strong>📊 Priority Sorting</strong> - Sort by impact and urgency<br/><strong>📝 Quick Actions</strong> - Edit, update, or close constraints<br/><strong>🚨 Status Indicators</strong> - Visual constraint status badges<br/><strong>📤 Bulk Operations</strong> - Export or update multiple constraints<br/><br/>Role-based permissions control available actions.',
        target: '[data-tour="constraints-table"]',
        placement: 'left',
        nextButton: 'Next Module'
      },
      {
        id: 'gantt-module-intro',
        title: 'Gantt View Module - Schedule Impact Visualization',
        content: 'The Gantt View module provides visual representation of constraint impacts on project schedules. See how constraints affect critical path and activity dependencies.',
        target: '[data-tour="gantt-tab"]',
        placement: 'bottom',
        nextButton: 'Explore Gantt View',
        onNext: () => {
          const ganttTab = document.querySelector('[data-tour="gantt-tab"]') as HTMLButtonElement;
          if (ganttTab && !ganttTab.getAttribute('data-state')?.includes('active')) {
            ganttTab.click();
          }
        }
      },
      {
        id: 'gantt-schedule-visualization',
        title: 'Schedule Impact Visualization',
        content: 'Interactive Gantt chart showing constraint impacts:<br/><br/><strong>📊 Activity Timeline</strong> - Visual schedule representation<br/><strong>🔗 Dependency Links</strong> - Activity relationship mapping<br/><strong>⚠️ Constraint Overlays</strong> - Visual constraint impact indicators<br/><strong>🎯 Critical Path</strong> - Highlighted critical activities<br/><br/>Color coding indicates constraint severity and impact.',
        target: '[data-tour="gantt-visualization"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'gantt-interactive-features',
        title: 'Interactive Gantt Features',
        content: 'Advanced Gantt chart interaction capabilities:<br/><br/><strong>🔍 Zoom & Pan</strong> - Navigate large schedules easily<br/><strong>📅 Timeline Filtering</strong> - Focus on specific date ranges<br/><strong>🏷️ Activity Details</strong> - Click for constraint information<br/><strong>📊 Progress Tracking</strong> - Visual completion indicators<br/><br/>Interactive features help analyze complex constraint relationships.',
        target: '[data-tour="gantt-controls"]',
        placement: 'left',
        nextButton: 'Next Module'
      },
      {
        id: 'analysis-module-intro',
        title: 'Analysis Module - Deep Constraint Intelligence',
        content: 'The Analysis module provides advanced constraint analytics including root cause analysis, trend identification, and predictive modeling for proactive constraint management.',
        target: '[data-tour="analysis-tab"]',
        placement: 'bottom',
        nextButton: 'Explore Analysis',
        onNext: () => {
          const analysisTab = document.querySelector('[data-tour="analysis-tab"]') as HTMLButtonElement;
          if (analysisTab && !analysisTab.getAttribute('data-state')?.includes('active')) {
            analysisTab.click();
          }
        }
      },
      {
        id: 'analysis-root-cause',
        title: 'Root Cause Analysis Tools',
        content: 'Identify underlying causes of project constraints:<br/><br/><strong>🔍 Pattern Analysis</strong> - Recurring constraint identification<br/><strong>📊 Correlation Mapping</strong> - Related constraint clustering<br/><strong>🎯 Impact Assessment</strong> - Quantified constraint effects<br/><strong>💡 Prevention Strategies</strong> - Proactive constraint avoidance<br/><br/>Use these tools to address systemic constraint issues.',
        target: '[data-tour="analysis-root-cause"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'analysis-predictive-modeling',
        title: 'Predictive Constraint Modeling',
        content: 'Forecast future constraints using AI analysis:<br/><br/><strong>🔮 Constraint Forecasting</strong> - Predict likely future constraints<br/><strong>📈 Trend Analysis</strong> - Historical pattern recognition<br/><strong>⚖️ Risk Assessment</strong> - Probability-based constraint modeling<br/><strong>🎯 Prevention Planning</strong> - Proactive mitigation strategies<br/><br/>Predictive modeling helps prevent constraints before they occur.',
        target: '[data-tour="analysis-predictive"]',
        placement: 'left',
        nextButton: 'Final Module'
      },
      {
        id: 'reports-module-intro',
        title: 'Reports Module - Constraint Documentation',
        content: 'The Reports module generates comprehensive constraint reports for stakeholder communication, performance tracking, and management review with automated formatting.',
        target: '[data-tour="reports-tab"]',
        placement: 'bottom',
        nextButton: 'Explore Reports',
        onNext: () => {
          const reportsTab = document.querySelector('[data-tour="reports-tab"]') as HTMLButtonElement;
          if (reportsTab && !reportsTab.getAttribute('data-state')?.includes('active')) {
            reportsTab.click();
          }
        }
      },
      {
        id: 'reports-templates',
        title: 'Constraint Report Templates',
        content: 'Pre-configured report templates for various stakeholders:<br/><br/><strong>📋 Executive Summary</strong> - High-level constraint overview<br/><strong>📊 Detailed Analysis</strong> - Comprehensive constraint reporting<br/><strong>🎯 Action Plans</strong> - Resolution strategy documentation<br/><strong>📈 Performance Tracking</strong> - Constraint management metrics<br/><br/>All templates support customization and automated generation.',
        target: '[data-tour="reports-templates"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'reports-distribution',
        title: 'Automated Report Distribution',
        content: 'Efficient constraint report sharing:<br/><br/><strong>📧 Stakeholder Notifications</strong> - Automated report distribution<br/><strong>📤 Multiple Formats</strong> - PDF, Excel, and dashboard views<br/><strong>📅 Scheduled Reporting</strong> - Regular constraint updates<br/><strong>🔒 Access Control</strong> - Role-based report permissions<br/><br/>Keep all stakeholders informed of constraint status automatically.',
        target: '[data-tour="reports-distribution"]',
        placement: 'left',
        nextButton: 'Complete Tour'
      },
      {
        id: 'constraints-log-workflow-tips',
        title: 'Constraint Management Best Practices',
        content: 'For effective constraint management:<br/><br/>📊 Start with Overview for impact assessment<br/>📋 Log constraints immediately when identified<br/>📈 Use Gantt View for schedule impact analysis<br/>🔍 Perform regular Analysis for pattern recognition<br/>📄 Generate Reports for stakeholder communication<br/>🎯 Focus on prevention through predictive modeling',
        target: '[data-tour="constraints-log-tabs"]',
        placement: 'top'
      },
      {
        id: 'constraints-log-tour-complete',
        title: 'Constraints Log Tour Complete!',
        content: 'You\'re now equipped to manage project constraints effectively using advanced analytics and AI insights. Remember that proactive constraint management is key to project success. Use the predictive tools to prevent constraints before they impact your schedule!',
        target: '[data-tour="constraints-log-page-header"]',
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