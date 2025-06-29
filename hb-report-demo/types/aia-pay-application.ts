export interface AiaPayApplication {
  id: string
  applicationNumber: number
  projectId: string
  projectName: string
  contractorName: string
  architectName: string
  ownerName: string

  // Contract Information
  contractSum: number
  changeOrdersApproved: number
  revisedContractSum: number

  // Application Period
  periodEndDate: string
  applicationDate: string

  // Financial Summary
  workCompletedToDate: number
  workCompletedThisPeriod: number
  materialsStoredToDate: number
  totalEarned: number
  retentionPercentage: number
  retentionAmount: number
  netAmountDue: number

  // Status and Workflow
  status: "draft" | "submitted" | "pm_approved" | "px_approved" | "executive_approved" | "rejected" | "paid"
  submittedBy: string
  submittedDate?: string
  approvals: AiaApproval[]

  // Line Items (G703 data)
  lineItems: AiaLineItem[]

  // Annotations and Comments
  annotations: AiaAnnotation[]

  // Distribution
  distributionList: AiaDistributionRecipient[]
  distributionHistory: AiaDistributionRecord[]

  // Metadata
  createdBy: string
  createdDate: string
  lastModifiedBy: string
  lastModifiedDate: string
  version: number

  // AI Insights
  aiInsights?: AiaInsight[]

  // Attachments
  attachments: AiaAttachment[]
}

export interface AiaLineItem {
  id: string
  scheduleOfValues: string
  description: string
  scheduledValue: number
  workCompletedPrevious: number
  workCompletedThisPeriod: number
  workCompletedToDate: number
  materialsStoredPrevious: number
  materialsStoredThisPeriod: number
  materialsStoredToDate: number
  totalCompleted: number
  percentComplete: number
  balanceToFinish: number
  retentionAmount: number

  // Data source tracking
  procoreData?: {
    budgetCode: string
    lastSync: string
  }
  sageData?: {
    costCode: string
    lastSync: string
  }

  // Annotations specific to this line item
  annotations: AiaAnnotation[]

  // Validation flags
  hasDiscrepancy: boolean
  discrepancyDetails?: string[]
}

export interface AiaApproval {
  id: string
  applicationId: string
  approverRole: "PM" | "PX" | "Executive"
  approverId: string
  approverName: string
  status: "pending" | "approved" | "rejected" | "conditional"
  comments: string
  approvalDate?: string
  conditions?: string[]

  // Approval-specific modifications
  modifications?: {
    originalAmount: number
    approvedAmount: number
    reason: string
  }
}

export interface AiaAnnotation {
  id: string
  applicationId: string
  lineItemId?: string // Optional - for line-item specific annotations
  section: "general" | "line_item" | "summary" | "certification"
  annotationType: "note" | "question" | "concern" | "approval_note"
  content: string
  authorId: string
  authorName: string
  authorRole: "PM" | "PX" | "Executive"
  createdDate: string
  isResolved: boolean
  resolvedBy?: string
  resolvedDate?: string

  // Rich content support
  formatting?: {
    bold?: boolean
    italic?: boolean
    color?: string
  }

  // Visibility controls
  visibleToRoles: ("PM" | "PX" | "Executive")[]
}

export interface AiaDistributionRecipient {
  id: string
  name: string
  email: string
  role: "Owner" | "Architect" | "Contractor" | "Consultant" | "Other"
  receivesPdf: boolean
  receivesNotifications: boolean
  isRequired: boolean
}

export interface AiaDistributionRecord {
  id: string
  applicationId: string
  distributionDate: string
  recipients: string[] // recipient IDs
  emailSubject: string
  emailBody: string
  attachments: string[] // attachment IDs
  deliveryStatus: "sent" | "delivered" | "failed" | "bounced"
  deliveryConfirmations: {
    recipientId: string
    status: "delivered" | "opened" | "failed"
    timestamp: string
  }[]
}

export interface AiaInsight {
  id: string
  applicationId: string
  type: "discrepancy" | "risk" | "opportunity" | "compliance"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  recommendation: string
  affectedLineItems?: string[]

  // Data source comparison
  dataComparison?: {
    procoreValue: number
    sageValue: number
    variance: number
    variancePercentage: number
  }

  // Risk assessment
  riskFactors?: string[]
  financialImpact?: number

  // Resolution tracking
  isResolved: boolean
  resolvedBy?: string
  resolvedDate?: string
  resolution?: string
}

export interface AiaAttachment {
  id: string
  applicationId: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedBy: string
  uploadedDate: string
  description?: string
  category: "supporting_document" | "change_order" | "photo" | "drawing" | "other"
  url: string
}

// Form validation schemas
export interface AiaValidationRule {
  field: string
  rule: "required" | "min" | "max" | "pattern" | "custom"
  value?: any
  message: string
  severity: "error" | "warning"
}

export interface AiaFormValidation {
  isValid: boolean
  errors: AiaValidationRule[]
  warnings: AiaValidationRule[]
}

// Email template structure
export interface AiaEmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[] // Available template variables
  isDefault: boolean
  applicableStatuses: string[]
}

// Project configuration for AIA applications
export interface AiaProjectConfig {
  projectId: string

  // Default values
  retentionPercentage: number
  paymentTerms: string

  // Integration settings
  procoreIntegration: {
    enabled: boolean
    budgetCodeMapping: Record<string, string>
    lastSyncDate?: string
  }

  sageIntegration: {
    enabled: boolean
    costCodeMapping: Record<string, string>
    lastSyncDate?: string
  }

  // Approval workflow
  approvalWorkflow: {
    requiresPmApproval: boolean
    requiresPxApproval: boolean
    requiresExecutiveApproval: boolean
    autoSubmitThreshold?: number
  }

  // Distribution settings
  defaultRecipients: AiaDistributionRecipient[]
  emailTemplates: AiaEmailTemplate[]

  // Validation rules
  customValidationRules: AiaValidationRule[]
}

// Dashboard summary data
export interface AiaApplicationSummary {
  totalApplications: number
  pendingApproval: number
  approvedThisMonth: number
  totalAmountRequested: number
  totalAmountApproved: number
  averageApprovalTime: number // in days

  // Status breakdown
  statusBreakdown: {
    draft: number
    submitted: number
    pmApproved: number
    pxApproved: number
    executiveApproved: number
    rejected: number
    paid: number
  }

  // Recent activity
  recentApplications: {
    id: string
    applicationNumber: number
    status: string
    amount: number
    submittedDate: string
  }[]
}
