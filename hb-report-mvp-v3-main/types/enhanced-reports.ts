export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "project-manager" | "project-executive" | "c-suite" | "admin"
  avatar?: string
  password?: string // Mock password for demo purposes
  permissions: {
    canCreateReports: boolean
    canEditReports: boolean
    canSubmitForReview: boolean
    canApproveReports: boolean
    canRejectReports?: boolean
    canViewAllReports?: boolean
    canViewDigitalReports: boolean
    canExportReports: boolean
    receiveApprovedReports?: boolean
    canViewAllProjects?: boolean
    preConAccess: boolean
    maxProjects?: number
  }
  assignedProjects: string[]
  createdAt: string
  lastLogin: string
  preferences: {
    defaultPaperSize: "letter" | "a4"
    defaultOrientation: "portrait" | "landscape"
    emailNotifications: boolean
    autoSave?: boolean
    reviewReminders?: boolean
    emailDigest?: "daily" | "weekly" | "monthly"
    executiveSummaryOnly?: boolean
    mobileNotifications?: boolean
  }
}

export interface BuyoutItem {
  id: string
  trade: string
  budgetAmount: number
  committedAmount: number
  variance: number
  status: "committed" | "pending" | "on-hold"
  targetDate: string
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
  forecastBudget: number // Added forecast budget
  startDate: string
  endDate: string
  location: string
  client: string
  projectManager: string
  trades: string[]
  riskLevel: "low" | "medium" | "high"
  completionPercentage: number
  lastUpdated: string
  financialData: {
    totalBudget: number
    spentToDate: number
    commitments: number
    forecastAtCompletion: number
    contingency: number
    changeOrders: number
  }
  buyoutSchedule: BuyoutItem[]
}

export interface ReportTemplate {
  id: string
  name: string
  description: string
  type: string
  category: string
  previewImage: string // Added preview image
  features: string[]
  paperSize: "letter" | "a4"
  orientation: "portrait" | "landscape"
  digitalElements: {
    id: string
    type: string
    title: string
    chartType?: string
    interactive: boolean
    zoomable?: boolean
    clickable?: boolean
    exportable?: boolean
    expandable?: boolean
    sortable?: boolean
    filterable?: boolean
    annotations?: boolean
  }[] // Added digital elements
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
  aiInsights: {
    id: string
    type: string
    title: string
    description: string
    confidence: number
    recommendation: string
    priority: "low" | "medium" | "high"
  }[] // Added AI insights
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
  digitalUrl: string // Added digital URL
  version: string
  tags: string[]
  approvals: {
    role: string
    user: string
    status: "approved" | "pending" | "rejected" | "draft"
    timestamp: string | null
    comments: string | null
    reviewDuration?: number // Added review duration
  }[]
  analytics: {
    views: number
    downloads: number
    shares: number
    timeSpent: number // minutes
    digitalViews: number // Added digital views
    interactionRate: number // Added interaction rate
  }
  aiInsights: {
    id: string
    type: string
    title: string
    description: string
    confidence: number
    recommendation: string
    priority: "low" | "medium" | "high"
  }[] // Added AI insights
  digitalElements: {
    id: string
    type: string
    title: string
    data: any // Flexible data structure for charts/tables
    interactions: string[]
  }[] // Added digital elements
  exportFormats: string[] // Added export formats
  collaborators: {
    userId: string
    role: "editor" | "viewer" | "reviewer"
    lastAccess: string
  }[] // Added collaborators
}
