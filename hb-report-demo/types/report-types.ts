export interface Report {
  id: string
  name: string
  type: "financial-review" | "monthly-progress" | "monthly-owner"
  projectId: string
  projectName: string
  status: "draft" | "submitted" | "approved" | "rejected" | "published"
  creatorId: string
  creatorName: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
  distributedAt?: string
  sections: ReportSection[]
  distributionSettings?: DistributionSettings
  metadata: ReportMetadata
  version: number
  tags: string[]
}

export interface ReportSection {
  id: string
  title: string
  contentType: string
  paperSize: "letter" | "tabloid"
  orientation: "portrait" | "landscape"
  order: number
  required: boolean
  enabled: boolean
  lastUpdated: string
  dataSource?: string
  pageCount?: number
  reviewed: boolean
  content?: SectionContent
  customizations?: SectionCustomizations
}

export interface SectionContent {
  type: "financial" | "schedule" | "photos" | "charts" | "table" | "text" | "mixed"
  data: any
  visualizations?: ChartConfig[]
  images?: ImageContent[]
  tables?: TableContent[]
  text?: TextContent[]
}

export interface ChartConfig {
  id: string
  type: "line" | "bar" | "pie" | "area" | "scatter"
  title: string
  data: any[]
  config: {
    xAxis?: string
    yAxis?: string
    colors?: string[]
    showLegend?: boolean
    showGrid?: boolean
  }
}

export interface ImageContent {
  id: string
  url: string
  caption: string
  width?: number
  height?: number
  placement: "full-width" | "half-width" | "inline"
}

export interface TableContent {
  id: string
  title: string
  headers: string[]
  rows: any[][]
  formatting?: TableFormatting
}

export interface TableFormatting {
  headerStyle?: "bold" | "background" | "both"
  alternateRows?: boolean
  borders?: "all" | "horizontal" | "none"
  fontSize?: "small" | "medium" | "large"
}

export interface TextContent {
  id: string
  type: "paragraph" | "heading" | "bullet" | "numbered"
  content: string
  formatting?: TextFormatting
}

export interface TextFormatting {
  bold?: boolean
  italic?: boolean
  fontSize?: number
  color?: string
  alignment?: "left" | "center" | "right" | "justify"
}

export interface SectionCustomizations {
  headerColor?: string
  showPageNumbers?: boolean
  includeTimestamp?: boolean
  customHeader?: string
  customFooter?: string
  margins?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface ReportMetadata {
  sectionCount: number
  pageCount: number
  size: string
  lastExportedAt?: string
  exportFormat?: "pdf" | "word" | "excel"
  templateVersion?: string
  automationLevel: number
  accuracyScore?: number
}

export interface ReportTemplate {
  id: string
  name: string
  type: "financial-review" | "monthly-progress" | "monthly-owner"
  description: string
  category: string
  sections: TemplateSectionConfig[]
  defaultSettings: TemplateSettings
  requiredFields: string[]
  estimatedTime: string
  workflow: WorkflowConfig
  isActive: boolean
  version: string
  createdAt: string
  updatedAt: string
}

export interface TemplateSectionConfig {
  contentType: string
  title: string
  required: boolean
  defaultPaperSize: "letter" | "tabloid"
  defaultOrientation: "portrait" | "landscape"
  order: number
  dataBinding?: DataBinding
  customizations?: SectionCustomizations
}

export interface DataBinding {
  source: string
  endpoint?: string
  refreshInterval?: number
  filters?: Record<string, any>
  transformations?: DataTransformation[]
}

export interface DataTransformation {
  type: "filter" | "sort" | "group" | "calculate"
  config: Record<string, any>
}

export interface TemplateSettings {
  paperSize: "letter" | "tabloid"
  orientation: "portrait" | "landscape"
  margins: {
    top: number
    bottom: number
    left: number
    right: number
  }
  fonts: {
    primary: string
    secondary: string
    monospace: string
  }
  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
  }
  branding: BrandingConfig
}

export interface BrandingConfig {
  logo?: string
  companyName: string
  address?: string
  phone?: string
  email?: string
  website?: string
  tagline?: string
}

export interface WorkflowConfig {
  steps: WorkflowStep[]
  notifications: NotificationConfig[]
  approvals: ApprovalConfig[]
  distribution: DistributionConfig
}

export interface WorkflowStep {
  id: string
  name: string
  type: "create" | "review" | "approve" | "distribute" | "publish"
  assignedRole: string
  requiredFields?: string[]
  timeoutDays?: number
  automateIfPossible?: boolean
}

export interface NotificationConfig {
  trigger: "created" | "submitted" | "approved" | "rejected" | "overdue"
  recipients: string[]
  template: string
  method: "email" | "sms" | "push" | "all"
}

export interface ApprovalConfig {
  required: boolean
  approvers: string[]
  requireAllApprovers?: boolean
  escalationDays?: number
  escalationTo?: string[]
}

export interface DistributionConfig {
  autoDistribute: boolean
  recipients: DistributionRecipient[]
  schedule?: DistributionSchedule
  channels: DistributionChannel[]
}

export interface DistributionSettings {
  id: string
  reportId: string
  recipients: DistributionRecipient[]
  schedule: DistributionSchedule
  channels: DistributionChannel[]
  customMessage?: string
  includeAttachments: boolean
  requireConfirmation: boolean
  trackOpens: boolean
  expirationDate?: string
}

export interface DistributionRecipient {
  id: string
  name: string
  email: string
  role: string
  company?: string
  phone?: string
  preferences: RecipientPreferences
  status: "active" | "inactive" | "pending"
}

export interface RecipientPreferences {
  format: "pdf" | "digital" | "both"
  frequency: "immediate" | "daily" | "weekly" | "monthly"
  sections: string[]
  notifications: boolean
  language: string
}

export interface DistributionSchedule {
  type: "immediate" | "scheduled" | "recurring"
  startDate?: string
  time?: string
  frequency?: "daily" | "weekly" | "monthly" | "quarterly"
  daysOfWeek?: number[]
  dayOfMonth?: number
  endDate?: string
}

export interface DistributionChannel {
  type: "email" | "portal" | "api" | "ftp" | "sharepoint"
  config: Record<string, any>
  enabled: boolean
  priority: number
}

export interface ReportAnalytics {
  reportId: string
  metrics: AnalyticsMetrics
  performance: PerformanceMetrics
  engagement: EngagementMetrics
  quality: QualityMetrics
  trends: TrendAnalysis[]
}

export interface AnalyticsMetrics {
  creationTime: number
  approvalTime: number
  distributionTime: number
  totalTime: number
  accuracyScore: number
  completionRate: number
  errorCount: number
  revisionCount: number
}

export interface PerformanceMetrics {
  averageCreationTime: number
  averageApprovalTime: number
  approvalRate: number
  rejectionRate: number
  onTimeDelivery: number
  automationLevel: number
  costSavings: number
  timeSavings: number
}

export interface EngagementMetrics {
  opens: number
  views: number
  downloads: number
  shares: number
  comments: number
  ratings: number[]
  averageRating: number
  engagementScore: number
}

export interface QualityMetrics {
  dataAccuracy: number
  visualQuality: number
  contentCompleteness: number
  formatConsistency: number
  brandCompliance: number
  overallQuality: number
  improvementSuggestions: string[]
}

export interface TrendAnalysis {
  metric: string
  period: "daily" | "weekly" | "monthly" | "quarterly"
  values: number[]
  trend: "up" | "down" | "stable"
  changePercent: number
  insights: string[]
}

export interface AIAssistant {
  id: string
  name: string
  capabilities: AICapability[]
  confidence: number
  learningLevel: number
  suggestions: AISuggestion[]
}

export interface AICapability {
  type: "data-extraction" | "content-generation" | "error-detection" | "optimization" | "prediction"
  description: string
  accuracy: number
  enabled: boolean
}

export interface AISuggestion {
  id: string
  type: "content" | "layout" | "data" | "workflow" | "optimization"
  title: string
  description: string
  impact: "low" | "medium" | "high"
  confidence: number
  implementation: string
  benefits: string[]
  risks: string[]
}

export interface ExportConfig {
  format: "pdf" | "word" | "excel" | "powerpoint" | "html"
  quality: "draft" | "standard" | "high" | "print"
  compression: boolean
  watermark?: string
  password?: string
  restrictions?: ExportRestrictions
}

export interface ExportRestrictions {
  printing: boolean
  copying: boolean
  editing: boolean
  commenting: boolean
  formFilling: boolean
  pageExtraction: boolean
}

export interface ImportConfig {
  source: "file" | "template" | "api" | "database"
  format: string
  mapping: FieldMapping[]
  validation: ValidationRule[]
  transformation: DataTransformation[]
}

export interface FieldMapping {
  source: string
  target: string
  type: "string" | "number" | "date" | "boolean" | "object"
  required: boolean
  defaultValue?: any
}

export interface ValidationRule {
  field: string
  type: "required" | "format" | "range" | "custom"
  config: Record<string, any>
  message: string
}

export interface ReviewChecklistItem {
  sectionId: string
  sectionTitle: string
  reviewed: boolean
  hasContent: boolean
  lastUpdated: string
  issues: ReviewIssue[]
  approver?: string
  approvedAt?: string
  comments?: string
}

export interface ReviewIssue {
  id: string
  type: "error" | "warning" | "suggestion"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  location: string
  suggestedFix?: string
  resolvedAt?: string
  resolvedBy?: string
}

export interface ApprovalAction {
  id: string
  reportId: string
  action: "approve" | "reject" | "request-changes"
  approverId: string
  approverName: string
  timestamp: string
  comments?: string
  changes?: string[]
  nextSteps?: string[]
}

export interface DashboardStats {
  totalReports: number
  pendingApproval: number
  approved: number
  rejected: number
  thisMonth: number
  approvalRate: number
  avgProcessingTime: number
  timeSaved: number
  overdue: number
  byType: Record<string, number>
  byStatus: Record<string, number>
  byProject: Record<string, number>
}

export interface RecentActivity {
  id: string
  type: "created" | "submitted" | "approved" | "rejected" | "distributed" | "viewed"
  reportId: string
  reportName: string
  projectName: string
  userId: string
  userName: string
  timestamp: string
  details?: Record<string, any>
}

export interface ReportUser {
  id: string
  name: string
  email: string
  role: "project-manager" | "project-executive" | "executive" | "admin"
  permissions: ReportPermissions
  preferences: UserPreferences
  assignedProjects: string[]
  notifications: NotificationSettings
}

export interface ReportPermissions {
  canCreate: boolean
  canEdit: boolean
  canApprove: boolean
  canReject: boolean
  canDistribute: boolean
  canViewAll: boolean
  canExport: boolean
  canManageTemplates: boolean
  canViewAnalytics: boolean
}

export interface UserPreferences {
  defaultTemplate?: string
  autoSave: boolean
  notifications: boolean
  theme: "light" | "dark" | "auto"
  language: string
  timezone: string
  dateFormat: string
  numberFormat: string
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  frequency: "immediate" | "daily" | "weekly"
  types: string[]
}
