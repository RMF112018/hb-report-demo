export interface Permit {
  id: string
  projectId: string | number
  number: string
  type: string
  status: "pending" | "approved" | "expired" | "rejected" | "renewed"
  priority?: "low" | "medium" | "high" | "urgent" | "critical"
  authority: string
  authorityContact?: AuthorityContact
  applicationDate: string
  approvalDate?: string
  expirationDate: string
  renewalDate?: string
  cost?: number
  bondAmount?: number
  description: string
  comments?: string
  conditions?: string[]
  tags?: string[]
  inspections: Inspection[]
  createdBy: string
  createdAt: string
  updatedBy?: string
  updatedAt: string
}

export interface AuthorityContact {
  name?: string
  phone?: string
  email?: string
  address?: string
}

export interface Inspection {
  id: string
  permitId: string
  type: string
  scheduledDate?: string
  completedDate?: string
  inspector: string
  inspectorContact?: InspectorContact
  result: "passed" | "failed" | "conditional" | "pending"
  complianceScore?: number
  issues?: InspectionIssue[] | string[]
  comments?: string
  resolutionNotes?: string
  followUpRequired?: boolean
  duration?: number
  createdAt: string
  updatedAt: string
}

export interface InspectorContact {
  phone?: string
  email?: string
  badge?: string
}

export interface InspectionIssue {
  id?: string
  description: string
  severity?: "low" | "medium" | "high" | "critical"
  resolved?: boolean
  resolutionNotes?: string
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
  permitsByStatus: {
    status: string
    count: number
    percentage: number
  }[]
  averageCostByType: {
    type: string
    averageCost: number
    totalCost: number
  }[]
  authorityPerformance: {
    authority: string
    averageProcessingTime: number
    approvalRate: number
    permitCount: number
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
  search?: string
  priority?: string
}

export interface HBIPermitInsight {
  id: string
  type: "warning" | "recommendation" | "opportunity" | "alert" | "risk" | "performance" | "forecast"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  text: string
  action: string
  confidence: number
  relatedMetrics: string[]
  affectedPermits?: string[]
  dueDate?: string
  priority?: number
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

export interface PermitTableProps {
  permits: Permit[]
  filters?: PermitFilters
  onEdit?: (permit: Permit) => void
  onView?: (permit: Permit) => void
  onExport?: (permit: Permit) => void
  onDrillDown?: (filterType: string, filterValue: string) => void
  compact?: boolean
  showInspections?: boolean
  userRole?: string
  className?: string
}

export interface PermitFormData {
  id?: string
  projectId: string
  number: string
  type: string
  status: "pending" | "approved" | "expired" | "rejected" | "renewed"
  priority?: "low" | "medium" | "high" | "urgent" | "critical"
  authority: string
  authorityContact?: AuthorityContact
  applicationDate: string
  approvalDate?: string
  expirationDate: string
  renewalDate?: string
  cost?: number
  bondAmount?: number
  description: string
  comments?: string
  conditions?: string[]
  tags?: string[]
  inspections?: Inspection[]
}

export interface CalendarEvent {
  id: string
  type: "permit-application" | "permit-approval" | "permit-expiration" | "inspection"
  date: Date
  title: string
  status: string
  permit: Permit
  inspection?: Inspection
  priority?: string
}

export interface PermitSettings {
  defaultView: "overview" | "permits" | "inspections" | "calendar" | "analytics" | "reports"
  autoRefresh: boolean
  refreshInterval: number
  notificationsEnabled: boolean
  expirationWarningDays: number
  defaultFilters: PermitFilters
  tablePageSize: number
  calendarView: "month" | "week"
}
