/**
 * Mock Report Data for HB Report Platform
 *
 * Comprehensive test data for demonstrating the Project Reports functionality.
 * Includes realistic construction project data, user profiles, and report templates.
 *
 * Data Structure:
 * - Users: Different roles with appropriate permissions
 * - Projects: Pre-construction projects with financial data
 * - Templates: Pre-built report configurations
 * - Generated Reports: Sample reports in various states
 *
 * @author HB Report Development Team
 * @version 2.0.0
 * @since 2024-01-01
 *
 * Business Context:
 * - Represents 5 active pre-construction projects
 * - Total project value: ~$54M across all projects
 * - Cost variances ranging from $500K-$1M as specified
 * - Realistic approval workflows and user interactions
 *
 * Technical Notes:
 * - All dates use ISO 8601 format for consistency
 * - IDs follow predictable patterns for testing
 * - Email addresses use company domain for realism
 * - Financial figures represent actual construction project scales
 */

import type { ReportTemplate, GeneratedReport, User, Project } from "@/types/reports"

/**
 * Mock Users with Role-Based Access
 * Represents the organizational hierarchy in construction companies
 */
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "jane.smith@hb.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "project-manager",
    avatar: "/placeholder-user.jpg",
    permissions: {
      canCreateReports: true,
      canEditReports: true,
      canSubmitForReview: true,
      canApproveReports: false,
      preConAccess: true,
    },
    assignedProjects: ["project-alpha", "project-beta", "project-gamma"],
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-23T09:00:00Z",
  },
  {
    id: "user-2",
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
      preConAccess: true,
    },
    assignedProjects: ["project-alpha", "project-beta", "project-gamma", "project-delta", "project-echo"],
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-23T08:30:00Z",
  },
  {
    id: "user-3",
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
      preConAccess: true,
    },
    assignedProjects: ["project-alpha", "project-beta", "project-gamma", "project-delta", "project-echo"],
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-23T07:45:00Z",
  },
]

/**
 * Mock Pre-Construction Projects
 * Realistic construction projects with comprehensive financial data
 */
export const mockProjects: Project[] = [
  {
    id: "project-alpha",
    mockProjectId: 401004, // Linked to Tech Campus Innovation Hub
    name: "Downtown Office Complex",
    description: "25-story mixed-use office building with retail ground floor",
    status: "pre-construction",
    phase: "design-development",
    budget: 12500000, // $12.5M
    costVariance: 750000, // $750K variance (6%)
    startDate: "2024-03-01",
    endDate: "2025-08-31",
    location: "Downtown Metro Area",
    client: "Metro Development Corp",
    projectManager: "jane.smith@hb.com",
    trades: ["General Contractor", "Structural", "MEP", "Architectural"],
    riskLevel: "medium",
    completionPercentage: 15,
    lastUpdated: "2024-01-23T10:00:00Z",
  },
  {
    id: "project-beta",
    mockProjectId: 401003, // Linked to Riverside Apartments Phase II
    name: "Luxury Residential Tower",
    description: "40-story luxury condominium tower with amenities",
    status: "pre-construction",
    phase: "schematic-design",
    budget: 18200000, // $18.2M
    costVariance: 910000, // $910K variance (5%)
    startDate: "2024-04-15",
    endDate: "2026-02-28",
    location: "Waterfront District",
    client: "Luxury Living LLC",
    projectManager: "jane.smith@hb.com",
    trades: ["General Contractor", "Structural", "MEP", "Architectural", "Landscaping"],
    riskLevel: "high",
    completionPercentage: 8,
    lastUpdated: "2024-01-22T14:30:00Z",
  },
  {
    id: "project-gamma",
    mockProjectId: 401001, // Linked to Tropical World Nursery Construction
    name: "Industrial Manufacturing Facility",
    description: "200,000 sq ft manufacturing and distribution center",
    status: "pre-construction",
    phase: "design-development",
    budget: 8900000, // $8.9M
    costVariance: 534000, // $534K variance (6%)
    startDate: "2024-02-01",
    endDate: "2024-12-15",
    location: "Industrial Park East",
    client: "Manufacturing Solutions Inc",
    projectManager: "jane.smith@hb.com",
    trades: ["General Contractor", "Structural", "MEP", "Site Work"],
    riskLevel: "low",
    completionPercentage: 25,
    lastUpdated: "2024-01-23T11:15:00Z",
  },
  {
    id: "project-delta",
    mockProjectId: 501002, // Linked to Oceanview Medical Center
    name: "Healthcare Campus Expansion",
    description: "Medical office building and parking structure",
    status: "pre-construction",
    phase: "programming",
    budget: 9800000, // $9.8M
    costVariance: 686000, // $686K variance (7%)
    startDate: "2024-05-01",
    endDate: "2025-11-30",
    location: "Medical District",
    client: "Regional Healthcare System",
    projectManager: "john.doe@hb.com",
    trades: ["General Contractor", "MEP", "Architectural", "Specialized Medical"],
    riskLevel: "medium",
    completionPercentage: 5,
    lastUpdated: "2024-01-21T16:45:00Z",
  },
  {
    id: "project-echo",
    mockProjectId: 401005, // Linked to Coastal Elementary School
    name: "Educational STEM Center",
    description: "University science and technology research facility",
    status: "pre-construction",
    phase: "design-development",
    budget: 15600000, // $15.6M
    costVariance: 858000, // $858K variance (5.5%)
    startDate: "2024-06-01",
    endDate: "2026-01-15",
    location: "University Campus",
    client: "State University System",
    projectManager: "john.doe@hb.com",
    trades: ["General Contractor", "Structural", "MEP", "Specialized Lab", "Technology"],
    riskLevel: "high",
    completionPercentage: 12,
    lastUpdated: "2024-01-23T09:30:00Z",
  },
]

/**
 * Pre-built Report Templates
 * Industry-standard report configurations for construction projects
 */
export const mockTemplates: ReportTemplate[] = [
  {
    id: "template-1",
    name: "Comprehensive Bid Package",
    description:
      "Complete bid package with all project details, cost breakdowns, and specifications for general contractors",
    type: "bid-package",
    category: "pre-construction",
    features: [
      "Executive Summary",
      "Project Overview",
      "Cost Analysis",
      "Schedule Overview",
      "Risk Assessment",
      "Technical Specifications",
      "Drawings & Plans",
      "Bid Instructions",
    ],
    paperSize: "letter",
    orientation: "portrait",
    sections: [
      {
        id: "section-1",
        type: "cover",
        title: "Cover Page",
        enabled: true,
        order: 0,
        settings: { includeLogo: true, includeDate: true },
      },
      {
        id: "section-2",
        type: "toc",
        title: "Table of Contents",
        enabled: true,
        order: 1,
        settings: { includePageNumbers: true },
      },
      {
        id: "section-3",
        type: "executive-summary",
        title: "Executive Summary",
        enabled: true,
        order: 2,
        settings: { maxLength: 500 },
      },
      {
        id: "section-4",
        type: "cost-breakdown",
        title: "Cost Analysis",
        enabled: true,
        order: 3,
        settings: { includeCharts: true, showVariance: true },
      },
    ],
    estimatedPages: 24,
    estimatedTime: 45, // minutes
    popularity: 95,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    createdBy: "admin@hb.com",
  },
  {
    id: "template-2",
    name: "Executive Cost Summary",
    description: "High-level financial overview and cost analysis for executive review and decision making",
    type: "cost-summary",
    category: "financial",
    features: [
      "Financial Overview",
      "Budget Analysis",
      "Cost Variance Report",
      "Cash Flow Projection",
      "Risk Factors",
      "Recommendations",
    ],
    paperSize: "a4",
    orientation: "portrait",
    sections: [
      {
        id: "section-5",
        type: "financial-overview",
        title: "Financial Overview",
        enabled: true,
        order: 0,
        settings: { includeCharts: true },
      },
      {
        id: "section-6",
        type: "variance-analysis",
        title: "Variance Analysis",
        enabled: true,
        order: 1,
        settings: { showTrends: true },
      },
    ],
    estimatedPages: 12,
    estimatedTime: 25,
    popularity: 88,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
    createdBy: "admin@hb.com",
  },
  {
    id: "template-3",
    name: "Weekly Project Update",
    description: "Comprehensive weekly progress report including schedule, milestones, and issue tracking",
    type: "project-update",
    category: "project-management",
    features: [
      "Progress Summary",
      "Schedule Status",
      "Milestone Tracking",
      "Issue Log",
      "Resource Allocation",
      "Next Week Preview",
      "Photos & Documentation",
    ],
    paperSize: "letter",
    orientation: "portrait",
    sections: [
      {
        id: "section-7",
        type: "progress-summary",
        title: "Progress Summary",
        enabled: true,
        order: 0,
        settings: { includePhotos: true },
      },
      {
        id: "section-8",
        type: "schedule-status",
        title: "Schedule Status",
        enabled: true,
        order: 1,
        settings: { showGantt: true },
      },
    ],
    estimatedPages: 8,
    estimatedTime: 20,
    popularity: 76,
    createdAt: "2024-01-12T11:30:00Z",
    updatedAt: "2024-01-22T13:15:00Z",
    createdBy: "admin@hb.com",
  },
]

/**
 * Generated Reports with Realistic Workflow States
 * Demonstrates various stages of the approval process
 */
export const mockGeneratedReports: GeneratedReport[] = [
  {
    id: "report-1",
    name: "Downtown Office Complex - Bid Package",
    description: "Complete bid package for the 25-story downtown office complex project",
    type: "bid-package",
    project: "Downtown Office Complex",
    projectId: 401004, // Linked to Tech Campus Innovation Hub
    status: "completed",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T16:30:00Z",
    createdBy: "jane.smith@hb.com",
    pageCount: 28,
    fileSize: "3.2 MB",
    downloadUrl: "/reports/downtown-office-bid-package.pdf",
    version: "1.2",
    tags: ["bid-package", "pre-construction", "high-priority"],
    approvals: [
      {
        role: "Project Manager",
        user: "jane.smith@hb.com",
        status: "approved",
        timestamp: "2024-01-20T12:00:00Z",
        comments: "All sections complete and accurate. Ready for executive review.",
      },
      {
        role: "Project Executive",
        user: "john.doe@hb.com",
        status: "approved",
        timestamp: "2024-01-20T15:30:00Z",
        comments: "Excellent work. Cost analysis is thorough and risk assessment is comprehensive.",
      },
    ],
    analytics: {
      views: 24,
      downloads: 8,
      shares: 3,
      timeSpent: 180, // minutes
    },
  },
  {
    id: "report-2",
    name: "Luxury Residential Tower - Cost Summary",
    description: "Executive cost summary and financial analysis for Q1 review",
    type: "cost-summary",
    project: "Luxury Residential Tower",
    projectId: 401003, // Linked to Riverside Apartments Phase II
    status: "review",
    createdAt: "2024-01-22T09:15:00Z",
    updatedAt: "2024-01-22T14:45:00Z",
    createdBy: "jane.smith@hb.com",
    pageCount: 14,
    fileSize: "2.1 MB",
    downloadUrl: "/reports/luxury-tower-cost-summary.pdf",
    version: "1.0",
    tags: ["cost-summary", "financial", "q1-review"],
    approvals: [
      {
        role: "Project Manager",
        user: "jane.smith@hb.com",
        status: "approved",
        timestamp: "2024-01-22T11:00:00Z",
        comments: "Cost variance analysis complete. Submitted for executive approval.",
      },
      {
        role: "Project Executive",
        user: "john.doe@hb.com",
        status: "pending",
        timestamp: null,
        comments: null,
      },
    ],
    analytics: {
      views: 12,
      downloads: 2,
      shares: 1,
      timeSpent: 95,
    },
  },
  {
    id: "report-3",
    name: "Industrial Facility - Weekly Update #3",
    description: "Week 3 progress report for manufacturing facility construction",
    type: "project-update",
    project: "Industrial Manufacturing Facility",
    projectId: 401001, // Linked to Tropical World Nursery Construction
    status: "draft",
    createdAt: "2024-01-23T14:20:00Z",
    updatedAt: "2024-01-23T16:10:00Z",
    createdBy: "jane.smith@hb.com",
    pageCount: 9,
    fileSize: "1.8 MB",
    downloadUrl: "/reports/industrial-facility-weekly-update-3.pdf",
    version: "0.5",
    tags: ["project-update", "weekly-report", "manufacturing"],
    approvals: [
      {
        role: "Project Manager",
        user: "jane.smith@hb.com",
        status: "draft",
        timestamp: null,
        comments: "Awaiting final data inputs and photo uploads.",
      },
    ],
    analytics: {
      views: 5,
      downloads: 0,
      shares: 0,
      timeSpent: 40,
    },
  },
]
export const mockReportData = {
  templates: mockTemplates,
  generatedReports: mockGeneratedReports,
  projects: mockProjects,
  users: mockUsers,
}
