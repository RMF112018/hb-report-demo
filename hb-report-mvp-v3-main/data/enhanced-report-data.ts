/**
 * Enhanced Report Data for HB Report Platform
 *
 * Comprehensive test data for demonstrating advanced Project Reports functionality
 * with Pre-Construction projects, digital report samples, and approval workflows.
 *
 * Features:
 * - 5 Pre-Construction projects with realistic financial data
 * - Digital and PDF report templates with interactive elements
 * - Comprehensive approval workflow data
 * - AI insights and recommendations
 * - Multi-format export capabilities
 *
 * Business Context:
 * - Represents $65M+ in Pre-Construction project value
 * - Cost variances ranging from $500K-$1M as specified
 * - Realistic approval workflows with timestamps
 * - Digital report samples with interactive elements
 *
 * Technical Implementation:
 * - All dates use ISO 8601 format for consistency
 * - Digital reports include interactive element definitions
 * - Approval workflows track complete audit trail
 * - AI insights include confidence ratings and recommendations
 *
 * @author HB Report Development Team
 * @version 3.0.0
 * @since 2024-01-01
 * @lastModified 2024-01-23
 */

import type { ReportTemplate, GeneratedReport, User, Project } from "@/types/enhanced-reports"

/**
 * Enhanced User Profiles with Role-Based Permissions
 * Represents the organizational hierarchy in Pre-Construction teams
 */
export const enhancedUsers: User[] = [
  {
    id: "user-pm-jane",
    email: "jane.smith@hb.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "project-manager",
    avatar: "/placeholder-user.jpg",
    password: "demo123", // Mock password for demo
    permissions: {
      canCreateReports: true,
      canEditReports: true,
      canSubmitForReview: true,
      canApproveReports: false,
      canViewDigitalReports: true,
      canExportReports: true,
      preConAccess: true,
      maxProjects: 3,
    },
    assignedProjects: ["project-downtown-office", "project-luxury-tower", "project-industrial-facility"],
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-23T09:00:00Z",
    preferences: {
      defaultPaperSize: "letter",
      defaultOrientation: "portrait",
      emailNotifications: true,
      autoSave: true,
    },
  },
  {
    id: "user-exec-john",
    email: "john.doe@hb.com",
    firstName: "John",
    lastName: "Doe",
    role: "project-executive",
    avatar: "/placeholder-user.jpg",
    permissions: {
      canCreateReports: true,
      canEditReports: true,
      canSubmitForReview: true,
      canApproveReports: true,
      canRejectReports: true,
      canViewDigitalReports: true,
      canExportReports: true,
      canViewAllProjects: true,
      preConAccess: true,
      maxProjects: 5,
    },
    assignedProjects: [
      "project-downtown-office",
      "project-luxury-tower",
      "project-industrial-facility",
      "project-healthcare-campus",
      "project-educational-stem",
    ],
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-23T08:30:00Z",
    preferences: {
      defaultPaperSize: "a4",
      defaultOrientation: "portrait",
      emailNotifications: true,
      reviewReminders: true,
    },
  },
  {
    id: "user-ceo-alice",
    email: "alice.ceo@hb.com",
    firstName: "Alice",
    lastName: "Johnson",
    role: "c-suite",
    avatar: "/placeholder-user.jpg",
    permissions: {
      canCreateReports: false,
      canEditReports: false,
      canSubmitForReview: false,
      canApproveReports: false,
      canViewAllReports: true,
      canViewDigitalReports: true,
      canExportReports: true,
      receiveApprovedReports: true,
      preConAccess: true,
    },
    assignedProjects: [
      "project-downtown-office",
      "project-luxury-tower",
      "project-industrial-facility",
      "project-healthcare-campus",
      "project-educational-stem",
    ],
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-23T07:45:00Z",
    preferences: {
      emailDigest: "weekly",
      executiveSummaryOnly: true,
      mobileNotifications: true,
    },
  },
]

/**
 * Enhanced Pre-Construction Projects with Comprehensive Financial Data
 * Realistic construction projects with detailed cost analysis and forecasting
 */
export const enhancedProjects: Project[] = [
  {
    id: "project-downtown-office",
    mockProjectId: 401004, // Linked to Tech Campus Innovation Hub
    name: "Downtown Office Complex",
    description: "25-story mixed-use office building with retail ground floor and underground parking",
    status: "pre-construction",
    phase: "design-development",
    budget: 12500000, // $12.5M
    costVariance: 750000, // $750K variance (6%)
    forecastBudget: 13250000, // Updated forecast
    startDate: "2024-03-01",
    endDate: "2025-08-31",
    location: "Downtown Metro Area",
    client: "Metro Development Corp",
    projectManager: "jane.smith@hb.com",
    trades: ["General Contractor", "Structural", "MEP", "Architectural", "Site Work"],
    riskLevel: "medium",
    completionPercentage: 15,
    lastUpdated: "2024-01-23T10:00:00Z",
    financialData: {
      totalBudget: 12500000,
      spentToDate: 1875000, // 15% completion
      commitments: 8750000, // 70% committed
      forecastAtCompletion: 13250000,
      contingency: 625000, // 5%
      changeOrders: 125000,
    },
    buyoutSchedule: [
      {
        id: "buyout-1",
        trade: "Structural Steel",
        budgetAmount: 2500000,
        committedAmount: 2350000,
        variance: -150000,
        status: "committed",
        targetDate: "2024-02-15",
      },
      {
        id: "buyout-2",
        trade: "MEP Systems",
        budgetAmount: 3200000,
        committedAmount: 0,
        variance: 0,
        status: "pending",
        targetDate: "2024-03-01",
      },
      {
        id: "buyout-3",
        trade: "Architectural Finishes",
        budgetAmount: 1800000,
        committedAmount: 1750000,
        variance: -50000,
        status: "committed",
        targetDate: "2024-02-28",
      },
    ],
  },
  {
    id: "project-luxury-tower",
    mockProjectId: 401003, // Linked to Riverside Apartments Phase II
    name: "Luxury Residential Tower",
    description: "40-story luxury condominium tower with premium amenities and waterfront views",
    status: "pre-construction",
    phase: "schematic-design",
    budget: 18200000, // $18.2M
    costVariance: 910000, // $910K variance (5%)
    forecastBudget: 19110000,
    startDate: "2024-04-15",
    endDate: "2026-02-28",
    location: "Waterfront District",
    client: "Luxury Living LLC",
    projectManager: "jane.smith@hb.com",
    trades: ["General Contractor", "Structural", "MEP", "Architectural", "Landscaping", "High-End Finishes"],
    riskLevel: "high",
    completionPercentage: 8,
    lastUpdated: "2024-01-22T14:30:00Z",
    financialData: {
      totalBudget: 18200000,
      spentToDate: 1456000, // 8% completion
      commitments: 12740000, // 70% committed
      forecastAtCompletion: 19110000,
      contingency: 910000, // 5%
      changeOrders: 182000,
    },
    buyoutSchedule: [
      {
        id: "buyout-4",
        trade: "Foundation & Excavation",
        budgetAmount: 3500000,
        committedAmount: 3400000,
        variance: -100000,
        status: "committed",
        targetDate: "2024-03-15",
      },
      {
        id: "buyout-5",
        trade: "Luxury Finishes",
        budgetAmount: 5200000,
        committedAmount: 0,
        variance: 0,
        status: "pending",
        targetDate: "2024-06-01",
      },
    ],
  },
  {
    id: "project-industrial-facility",
    mockProjectId: 401001, // Linked to Tropical World Nursery Construction
    name: "Industrial Manufacturing Facility",
    description: "200,000 sq ft advanced manufacturing and distribution center with automated systems",
    status: "pre-construction",
    phase: "design-development",
    budget: 8900000, // $8.9M
    costVariance: 534000, // $534K variance (6%)
    forecastBudget: 9434000,
    startDate: "2024-02-01",
    endDate: "2024-12-15",
    location: "Industrial Park East",
    client: "Manufacturing Solutions Inc",
    projectManager: "jane.smith@hb.com",
    trades: ["General Contractor", "Structural", "MEP", "Site Work", "Specialized Equipment"],
    riskLevel: "low",
    completionPercentage: 25,
    lastUpdated: "2024-01-23T11:15:00Z",
    financialData: {
      totalBudget: 8900000,
      spentToDate: 2225000, // 25% completion
      commitments: 6230000, // 70% committed
      forecastAtCompletion: 9434000,
      contingency: 445000, // 5%
      changeOrders: 89000,
    },
    buyoutSchedule: [
      {
        id: "buyout-6",
        trade: "Site Preparation",
        budgetAmount: 1200000,
        committedAmount: 1150000,
        variance: -50000,
        status: "committed",
        targetDate: "2024-01-15",
      },
      {
        id: "buyout-7",
        trade: "Structural Steel",
        budgetAmount: 2800000,
        committedAmount: 2750000,
        variance: -50000,
        status: "committed",
        targetDate: "2024-02-01",
      },
      {
        id: "buyout-8",
        trade: "Automated Systems",
        budgetAmount: 1500000,
        committedAmount: 0,
        variance: 0,
        status: "pending",
        targetDate: "2024-04-01",
      },
    ],
  },
  {
    id: "project-healthcare-campus",
    mockProjectId: 501002, // Linked to Oceanview Medical Center
    name: "Healthcare Campus Expansion",
    description: "Medical office building with specialized treatment facilities and parking structure",
    status: "pre-construction",
    phase: "programming",
    budget: 9800000, // $9.8M
    costVariance: 686000, // $686K variance (7%)
    forecastBudget: 10486000,
    startDate: "2024-05-01",
    endDate: "2025-11-30",
    location: "Medical District",
    client: "Regional Healthcare System",
    projectManager: "john.doe@hb.com",
    trades: ["General Contractor", "MEP", "Architectural", "Specialized Medical", "Technology"],
    riskLevel: "medium",
    completionPercentage: 5,
    lastUpdated: "2024-01-21T16:45:00Z",
    financialData: {
      totalBudget: 9800000,
      spentToDate: 490000, // 5% completion
      commitments: 6860000, // 70% committed
      forecastAtCompletion: 10486000,
      contingency: 490000, // 5%
      changeOrders: 98000,
    },
    buyoutSchedule: [
      {
        id: "buyout-9",
        trade: "Medical Equipment",
        budgetAmount: 2500000,
        committedAmount: 0,
        variance: 0,
        status: "pending",
        targetDate: "2024-07-01",
      },
      {
        id: "buyout-10",
        trade: "Specialized HVAC",
        budgetAmount: 1800000,
        committedAmount: 0,
        variance: 0,
        status: "pending",
        targetDate: "2024-06-15",
      },
    ],
  },
  {
    id: "project-educational-stem",
    mockProjectId: 401005, // Linked to Coastal Elementary School
    name: "Educational STEM Center",
    description: "University science and technology research facility with advanced laboratories",
    status: "pre-construction",
    phase: "design-development",
    budget: 15600000, // $15.6M
    costVariance: 858000, // $858K variance (5.5%)
    forecastBudget: 16458000,
    startDate: "2024-06-01",
    endDate: "2026-01-15",
    location: "University Campus",
    client: "State University System",
    projectManager: "john.doe@hb.com",
    trades: ["General Contractor", "Structural", "MEP", "Specialized Lab", "Technology", "Research Equipment"],
    riskLevel: "high",
    completionPercentage: 12,
    lastUpdated: "2024-01-23T09:30:00Z",
    financialData: {
      totalBudget: 15600000,
      spentToDate: 1872000, // 12% completion
      commitments: 10920000, // 70% committed
      forecastAtCompletion: 16458000,
      contingency: 780000, // 5%
      changeOrders: 156000,
    },
    buyoutSchedule: [
      {
        id: "buyout-11",
        trade: "Laboratory Equipment",
        budgetAmount: 4200000,
        committedAmount: 0,
        variance: 0,
        status: "pending",
        targetDate: "2024-08-01",
      },
      {
        id: "buyout-12",
        trade: "Clean Room Systems",
        budgetAmount: 2800000,
        committedAmount: 0,
        variance: 0,
        status: "pending",
        targetDate: "2024-07-15",
      },
    ],
  },
]

/**
 * Enhanced Report Templates with Digital and PDF Capabilities
 * Industry-standard report configurations with interactive elements
 */
export const enhancedTemplates: ReportTemplate[] = [
  {
    id: "template-owner-report",
    name: "Owner Report",
    description: "Comprehensive executive summary for project owners with financial analysis and progress tracking",
    type: "owner-report",
    category: "executive",
    previewImage: "/report-previews/owner-report.png",
    features: [
      "Executive Summary",
      "Financial Overview",
      "Schedule Status",
      "Risk Assessment",
      "Milestone Tracking",
      "Budget Analysis",
      "Change Order Summary",
      "Quality Metrics",
    ],
    paperSize: "letter",
    orientation: "portrait",
    digitalElements: [
      {
        id: "chart-budget-variance",
        type: "interactive-chart",
        title: "Budget Variance Analysis",
        chartType: "line",
        interactive: true,
        zoomable: true,
        clickable: true,
      },
      {
        id: "timeline-milestones",
        type: "interactive-timeline",
        title: "Project Milestones",
        interactive: true,
        expandable: true,
      },
    ],
    sections: [
      {
        id: "section-exec-summary",
        type: "executive-summary",
        title: "Executive Summary",
        enabled: true,
        order: 0,
        settings: {
          includeLogo: true,
          includeDate: true,
          maxLength: 500,
          includeKPIs: true,
        },
      },
      {
        id: "section-financial-overview",
        type: "financial-overview",
        title: "Financial Overview",
        enabled: true,
        order: 1,
        settings: {
          includeCharts: true,
          showVariance: true,
          includeForecasting: true,
          showCommitments: true,
        },
      },
      {
        id: "section-schedule-status",
        type: "schedule-status",
        title: "Schedule Status",
        enabled: true,
        order: 2,
        settings: {
          showGantt: true,
          includeMilestones: true,
          showCriticalPath: true,
        },
      },
    ],
    estimatedPages: 18,
    estimatedTime: 35, // minutes
    popularity: 98,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-23T14:30:00Z",
    createdBy: "admin@hb.com",
    aiInsights: [
      {
        id: "insight-1",
        type: "cost-variance",
        title: "Cost Variance Alert",
        description: "Budget variance exceeds 5% threshold on 3 projects",
        confidence: 0.92,
        recommendation: "Review buyout schedule and implement cost control measures",
        priority: "high",
      },
    ],
  },
  {
    id: "template-financial-forecast",
    name: "Financial Forecast",
    description: "Detailed financial projections and budget analysis with cash flow forecasting",
    type: "financial-forecast",
    category: "financial",
    previewImage: "/report-previews/financial-forecast.png",
    features: [
      "Budget Analysis",
      "Cash Flow Projection",
      "Cost Variance Report",
      "Commitment Analysis",
      "Change Order Tracking",
      "Risk Assessment",
      "Forecasting Models",
      "ROI Analysis",
    ],
    paperSize: "a4",
    orientation: "landscape",
    digitalElements: [
      {
        id: "chart-cash-flow",
        type: "interactive-chart",
        title: "Cash Flow Projection",
        chartType: "area",
        interactive: true,
        zoomable: true,
        exportable: true,
      },
      {
        id: "table-commitments",
        type: "interactive-table",
        title: "Commitment Analysis",
        interactive: true,
        sortable: true,
        filterable: true,
      },
    ],
    sections: [
      {
        id: "section-budget-analysis",
        type: "budget-analysis",
        title: "Budget Analysis",
        enabled: true,
        order: 0,
        settings: {
          includeCharts: true,
          showVariance: true,
          includeForecasting: true,
          detailLevel: "high",
        },
      },
      {
        id: "section-cash-flow",
        type: "cash-flow",
        title: "Cash Flow Projection",
        enabled: true,
        order: 1,
        settings: {
          projectionPeriod: 12,
          includeScenarios: true,
          showConfidenceIntervals: true,
        },
      },
    ],
    estimatedPages: 24,
    estimatedTime: 45,
    popularity: 89,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-22T16:45:00Z",
    createdBy: "admin@hb.com",
    aiInsights: [
      {
        id: "insight-2",
        type: "cash-flow",
        title: "Cash Flow Optimization",
        description: "Optimize payment schedules to improve cash flow by 15%",
        confidence: 0.87,
        recommendation: "Negotiate extended payment terms with key subcontractors",
        priority: "medium",
      },
    ],
  },
  {
    id: "template-progress-report",
    name: "Progress Report",
    description: "Comprehensive project progress tracking with schedule analysis and milestone updates",
    type: "progress-report",
    category: "project-management",
    previewImage: "/report-previews/progress-report.png",
    features: [
      "Progress Summary",
      "Schedule Analysis",
      "Milestone Tracking",
      "Resource Utilization",
      "Quality Metrics",
      "Safety Performance",
      "Issue Tracking",
      "Next Period Forecast",
    ],
    paperSize: "letter",
    orientation: "portrait",
    digitalElements: [
      {
        id: "chart-progress-curve",
        type: "interactive-chart",
        title: "Progress S-Curve",
        chartType: "line",
        interactive: true,
        zoomable: true,
        annotations: true,
      },
      {
        id: "gantt-schedule",
        type: "interactive-gantt",
        title: "Project Schedule",
        interactive: true,
        zoomable: true,
        filterable: true,
      },
    ],
    sections: [
      {
        id: "section-progress-summary",
        type: "progress-summary",
        title: "Progress Summary",
        enabled: true,
        order: 0,
        settings: {
          includePhotos: true,
          showPercentComplete: true,
          includeKPIs: true,
        },
      },
      {
        id: "section-schedule-analysis",
        type: "schedule-analysis",
        title: "Schedule Analysis",
        enabled: true,
        order: 1,
        settings: {
          showGantt: true,
          includeCriticalPath: true,
          showVariance: true,
        },
      },
    ],
    estimatedPages: 16,
    estimatedTime: 30,
    popularity: 94,
    createdAt: "2024-01-12T11:30:00Z",
    updatedAt: "2024-01-23T13:15:00Z",
    createdBy: "admin@hb.com",
    aiInsights: [
      {
        id: "insight-3",
        type: "schedule-risk",
        title: "Schedule Risk Analysis",
        description: "Critical path activities show 2-week delay risk",
        confidence: 0.78,
        recommendation: "Accelerate structural steel delivery and increase crew size",
        priority: "high",
      },
    ],
  },
]

/**
 * Enhanced Generated Reports with Digital and PDF Versions
 * Demonstrates comprehensive approval workflows and version control
 */
export const enhancedGeneratedReports: GeneratedReport[] = [
  {
    id: "report-downtown-owner-001",
    name: "Downtown Office Complex - Owner Report Q1",
    description: "Comprehensive quarterly owner report with financial analysis and progress tracking",
    type: "owner-report",
    project: "Downtown Office Complex",
    projectId: 401004, // Linked to Tech Campus Innovation Hub
    status: "completed",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T16:30:00Z",
    createdBy: "jane.smith@hb.com",
    pageCount: 22,
    fileSize: "4.8 MB",
    downloadUrl: "/reports/downtown-office-owner-report-q1.pdf",
    digitalUrl: "/project-reports/view/report-downtown-owner-001/digital",
    version: "1.3",
    tags: ["owner-report", "quarterly", "high-priority", "approved"],
    approvals: [
      {
        role: "Project Manager",
        user: "jane.smith@hb.com",
        status: "approved",
        timestamp: "2024-01-20T12:00:00Z",
        comments: "All sections complete with comprehensive financial analysis. Ready for executive review.",
        reviewDuration: 45, // minutes
      },
      {
        role: "Project Executive",
        user: "john.doe@hb.com",
        status: "approved",
        timestamp: "2024-01-20T15:30:00Z",
        comments:
          "Excellent work. Cost variance analysis is thorough and recommendations are actionable. Approved for C-Suite distribution.",
        reviewDuration: 30,
      },
    ],
    analytics: {
      views: 34,
      downloads: 12,
      shares: 5,
      timeSpent: 240, // minutes
      digitalViews: 28,
      interactionRate: 0.82,
    },
    aiInsights: [
      {
        id: "insight-report-1",
        type: "performance",
        title: "Project Performance Summary",
        description: "Project is 2% ahead of schedule with 6% budget variance",
        confidence: 0.94,
        recommendation: "Continue current trajectory while monitoring cost variance",
        priority: "medium",
      },
    ],
    digitalElements: [
      {
        id: "chart-budget-performance",
        type: "interactive-chart",
        title: "Budget Performance",
        data: {
          budget: 12500000,
          spent: 1875000,
          forecast: 13250000,
          variance: 750000,
        },
        interactions: ["zoom", "filter", "export"],
      },
    ],
    exportFormats: ["pdf", "excel", "word", "digital"],
    collaborators: [
      {
        userId: "user-pm-jane",
        role: "editor",
        lastAccess: "2024-01-23T09:00:00Z",
      },
      {
        userId: "user-exec-john",
        role: "reviewer",
        lastAccess: "2024-01-20T15:30:00Z",
      },
    ],
  },
  {
    id: "report-luxury-financial-001",
    name: "Luxury Residential Tower - Financial Forecast",
    description: "Detailed financial projections and cash flow analysis for luxury residential project",
    type: "financial-forecast",
    project: "Luxury Residential Tower",
    projectId: 401003, // Linked to Riverside Apartments Phase II
    status: "review",
    createdAt: "2024-01-22T09:15:00Z",
    updatedAt: "2024-01-22T14:45:00Z",
    createdBy: "jane.smith@hb.com",
    pageCount: 28,
    fileSize: "5.2 MB",
    downloadUrl: "/reports/luxury-tower-financial-forecast.pdf",
    digitalUrl: "/project-reports/view/report-luxury-financial-001/digital",
    version: "1.1",
    tags: ["financial-forecast", "luxury-project", "pending-review"],
    approvals: [
      {
        role: "Project Manager",
        user: "jane.smith@hb.com",
        status: "approved",
        timestamp: "2024-01-22T11:00:00Z",
        comments: "Financial projections complete with detailed cash flow analysis. Submitted for executive approval.",
        reviewDuration: 60,
      },
      {
        role: "Project Executive",
        user: "john.doe@hb.com",
        status: "pending",
        timestamp: null,
        comments: null,
        reviewDuration: null,
      },
    ],
    analytics: {
      views: 18,
      downloads: 4,
      shares: 2,
      timeSpent: 120,
      digitalViews: 15,
      interactionRate: 0.67,
    },
    aiInsights: [
      {
        id: "insight-report-2",
        type: "financial-risk",
        title: "Financial Risk Assessment",
        description: "High-end finishes budget shows 8% variance risk",
        confidence: 0.85,
        recommendation: "Secure luxury finish commitments early to control costs",
        priority: "high",
      },
    ],
    digitalElements: [
      {
        id: "chart-cash-flow-projection",
        type: "interactive-chart",
        title: "Cash Flow Projection",
        data: {
          projections: [
            { month: "Feb 2024", inflow: 2500000, outflow: 1800000 },
            { month: "Mar 2024", inflow: 3200000, outflow: 2400000 },
          ],
        },
        interactions: ["zoom", "scenario-analysis", "export"],
      },
    ],
    exportFormats: ["pdf", "excel", "digital"],
    collaborators: [
      {
        userId: "user-pm-jane",
        role: "editor",
        lastAccess: "2024-01-22T14:45:00Z",
      },
    ],
  },
  {
    id: "report-industrial-progress-001",
    name: "Industrial Manufacturing Facility - Progress Report Week 4",
    description: "Weekly progress report with schedule analysis and milestone updates",
    type: "progress-report",
    project: "Industrial Manufacturing Facility",
    projectId: 401001, // Linked to Tropical World Nursery Construction
    status: "draft",
    createdAt: "2024-01-23T14:20:00Z",
    updatedAt: "2024-01-23T16:10:00Z",
    createdBy: "jane.smith@hb.com",
    pageCount: 14,
    fileSize: "3.1 MB",
    downloadUrl: "/reports/industrial-facility-progress-week-4.pdf",
    digitalUrl: "/project-reports/view/report-industrial-progress-001/digital",
    version: "0.8",
    tags: ["progress-report", "weekly", "manufacturing", "draft"],
    approvals: [
      {
        role: "Project Manager",
        user: "jane.smith@hb.com",
        status: "draft",
        timestamp: null,
        comments: "Awaiting final progress photos and updated schedule data.",
        reviewDuration: null,
      },
    ],
    analytics: {
      views: 8,
      downloads: 0,
      shares: 0,
      timeSpent: 45,
      digitalViews: 6,
      interactionRate: 0.45,
    },
    aiInsights: [
      {
        id: "insight-report-3",
        type: "progress-optimization",
        title: "Progress Optimization",
        description: "Site preparation ahead of schedule by 3 days",
        confidence: 0.91,
        recommendation: "Accelerate steel delivery to maintain momentum",
        priority: "medium",
      },
    ],
    digitalElements: [
      {
        id: "gantt-progress-schedule",
        type: "interactive-gantt",
        title: "Progress Schedule",
        data: {
          tasks: [
            { id: "site-prep", name: "Site Preparation", progress: 100, status: "completed" },
            { id: "foundation", name: "Foundation Work", progress: 75, status: "in-progress" },
          ],
        },
        interactions: ["zoom", "filter", "timeline-navigation"],
      },
    ],
    exportFormats: ["pdf", "digital"],
    collaborators: [
      {
        userId: "user-pm-jane",
        role: "editor",
        lastAccess: "2024-01-23T16:10:00Z",
      },
    ],
  },
]

/**
 * Comprehensive Mock Data Export
 * Aggregates all enhanced data for use throughout the application
 */
export const enhancedReportData = {
  templates: enhancedTemplates,
  generatedReports: enhancedGeneratedReports,
  projects: enhancedProjects,
  users: enhancedUsers,

  // Additional metadata for system configuration
  systemConfig: {
    maxReportsPerUser: 50,
    maxProjectsPerUser: 10,
    supportedFormats: ["pdf", "excel", "word", "digital"],
    aiInsightsEnabled: true,
    collaborationEnabled: true,
    versionControlEnabled: true,
    auditLoggingEnabled: true,
  },

  // Performance benchmarks for optimization
  performanceBenchmarks: {
    targetLoadTime: 2000, // 2 seconds
    maxReportSize: 10485760, // 10MB
    maxDigitalElements: 20,
    cacheExpiration: 3600000, // 1 hour
  },
}

/**
 * Export individual data sets for modular usage
 */
export {
  enhancedUsers as users,
  enhancedProjects as projects,
  enhancedTemplates as templates,
  enhancedGeneratedReports as generatedReports,
}
