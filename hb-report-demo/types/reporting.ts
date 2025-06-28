export interface Report {
  id: string
  title: string
  type: "financial-review" | "monthly-progress" | "monthly-owner"
  projectId: string
  projectName: string
  createdBy: string
  createdAt: string
  updatedAt: string
  status: "draft" | "submitted" | "approved" | "rejected" | "published"
  version: number
  sections: ReportSection[]
  metadata: ReportMetadata
  approvalWorkflow?: ApprovalWorkflow
  distributionSettings?: DistributionSettings
}

export interface ReportSection {
  id: string
  type: string
  title: string
  content: any
  pageSize: "letter" | "tabloid"
  orientation: "portrait" | "landscape"
  order: number
  required: boolean
  enabled: boolean
  lastUpdated: string
}

export interface ReportMetadata {
  reportPeriod: string
  generatedAt: string
  totalPages: number
  fileSize?: string
  tags: string[]
  customFields: Record<string, any>
}

export interface ApprovalWorkflow {
  id: string
  reportId: string
  submittedAt: string
  submittedBy: string
  reviewedAt?: string
  reviewedBy?: string
  status: "pending" | "approved" | "rejected"
  comments: ApprovalComment[]
  approvalHistory: ApprovalHistoryEntry[]
}

export interface ApprovalComment {
  id: string
  userId: string
  userName: string
  comment: string
  timestamp: string
  sectionId?: string
  resolved: boolean
}

export interface ApprovalHistoryEntry {
  id: string
  action: "submitted" | "approved" | "rejected" | "revised"
  userId: string
  userName: string
  timestamp: string
  comment?: string
  version: number
}

export interface DistributionSettings {
  emailEnabled: boolean
  recipients: string[]
  subject: string
  message: string
  attachPdf: boolean
  scheduledDelivery?: string
}

export interface ReportTemplate {
  id: string
  name: string
  type: "financial-review" | "monthly-progress" | "monthly-owner"
  description: string
  sections: ReportSectionTemplate[]
  defaultSettings: any
}

export interface ReportSectionTemplate {
  id: string
  type: string
  title: string
  description: string
  pageSize: "letter" | "tabloid"
  orientation: "portrait" | "landscape"
  required: boolean
  defaultEnabled: boolean
  category: string
}

export interface ReportFilter {
  status?: string[]
  type?: string[]
  projectId?: string
  dateRange?: {
    start: string
    end: string
  }
  createdBy?: string
  search?: string
}

export interface ReportStats {
  totalReports: number
  pendingApproval: number
  approved: number
  rejected: number
  byType: Record<string, number>
  byProject: Record<string, number>
}
