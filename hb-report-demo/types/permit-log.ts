export interface Permit {
  id: string
  projectId: string
  number: string
  type: string
  status: "pending" | "approved" | "expired" | "rejected"
  authority: string
  applicationDate: string
  approvalDate?: string
  expirationDate: string
  cost: number
  comments?: string
  inspections: Inspection[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Inspection {
  id: string
  permitId: string
  type: string
  date: string
  inspector: string
  result: "passed" | "failed" | "conditional" | "pending"
  complianceScore: number
  issues: string[]
  comments?: string
  resolutionNotes?: string
  followUpRequired: boolean
  scheduledDate?: string
  completedDate?: string
}

export interface PermitAnalytics {
  totalPermits: number
  approvalRate: number
  averageProcessingTime: number
  expiringPermits: number
  totalInspections: number
  inspectionPassRate: number
  averageComplianceScore: number
  pendingInspections: number
  monthlyTrends: {
    month: string
    permits: number
    inspections: number
    approvalRate: number
    passRate: number
  }[]
  permitsByType: {
    type: string
    count: number
    approvalRate: number
  }[]
  inspectionsByResult: {
    result: string
    count: number
    percentage: number
  }[]
}

export interface PermitFilters {
  projectId?: string
  status?: string
  type?: string
  authority?: string
  dateRange?: {
    start: string
    end: string
  }
  inspectionResult?: string
  expiringWithin?: number // days
}

export interface HBIPermitInsight {
  id: string
  type: "warning" | "recommendation" | "opportunity" | "alert"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  confidence: number
  recommendation: string
  affectedPermits?: string[]
  dueDate?: string
  priority: number
}

export interface PermitExportOptions {
  format: "pdf" | "excel" | "csv"
  includeInspections: boolean
  includeAnalytics: boolean
  includeInsights: boolean
  dateRange?: {
    start: string
    end: string
  }
  filters: PermitFilters
  emailDistribution?: {
    recipients: string[]
    subject: string
    message: string
  }
}
