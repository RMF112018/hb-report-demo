export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "project-manager" | "project-executive" | "c-suite" | "admin"
  avatar?: string
  permissions: {
    canCreateReports: boolean
    canEditReports: boolean
    canSubmitForReview: boolean
    canApproveReports: boolean
    canRejectReports?: boolean
    canViewAllReports?: boolean
    preConAccess: boolean
  }
  assignedProjects: string[]
  createdAt: string
  lastLogin: string
}

export interface Project {
  id: string
  mockProjectId: number // Added mockProjectId to link to mock-projects.ts
  name: string
  description: string
  status: "pre-construction" | "active" | "completed" | "on-hold"
  phase: string
  budget: number
  costVariance: number
  startDate: string
  endDate: string
  location: string
  client: string
  projectManager: string
  trades: string[]
  riskLevel: "low" | "medium" | "high"
  completionPercentage: number
  lastUpdated: string
}

export interface ReportTemplate {
  id: string
  name: string
  description: string
  type: string
  category: string
  features: string[]
  paperSize: "letter" | "a4"
  orientation: "portrait" | "landscape"
  sections: {
    id: string
    type: string
    title: string
    enabled: boolean
    order: number
    settings: Record<string, any>
  }[]
  estimatedPages: number
  estimatedTime: number // minutes
  popularity: number
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface GeneratedReport {
  id: string
  name: string
  description: string
  type: string
  project: string
  projectId: number // Changed to number to match mock-projects.ts
  status: "draft" | "review" | "approved" | "completed" | "rejected"
  createdAt: string
  updatedAt: string
  createdBy: string
  pageCount: number
  fileSize: string
  downloadUrl: string
  version: string
  tags: string[]
  approvals: {
    role: string
    user: string
    status: "approved" | "pending" | "rejected" | "draft"
    timestamp: string | null
    comments: string | null
  }[]
  analytics: {
    views: number
    downloads: number
    shares: number
    timeSpent: number // minutes
  }
}
