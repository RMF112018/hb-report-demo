export interface DailyLog {
  id: string
  projectId: string
  projectName: string
  date: string
  submittedBy: string
  status: "submitted" | "pending" | "overdue" | "draft"
  totalWorkers: number
  totalHours: number
  weatherConditions?: any
  manpowerEntries: ManpowerEntry[]
  activities: Activity[]
  comments: string
}

export interface Activity {
  id: string
  type: "task" | "inspection" | "delivery" | "safety" | "other"
  description: string
  status: "completed" | "in-progress" | "planned"
  responsibleParty: string
}

export interface ManpowerEntry {
  id: string
  contactCompany: string
  workers: number
  hours: number
  totalHours: number
  location: string
  comments: string
  trade: string
}

export interface ManpowerRecord {
  id: string
  projectId: string
  projectName: string
  date: string
  contractor: string
  workers: number
  hours: number
  totalHours: number
  location: string
  comments: string
  trade: string
  efficiency: number
  costPerHour: number
}

export interface SafetyAudit {
  id: string
  projectId: string
  projectName: string
  date: string
  type: string
  trade: string
  status: "pass" | "fail" | "pending"
  location: string
  createdBy: string
  description: string
  responses: SafetyResponse[]
  violations: number
  atRiskItems: number
  complianceScore: number
  attachments: string[]
}

export interface SafetyResponse {
  question: string
  response: "Safe" | "At Risk" | "N/A"
}

export interface QualityInspection {
  id: string
  projectId: string
  projectName: string
  date: string
  type: string
  trade: string
  status: "pass" | "fail" | "pending"
  location: string
  createdBy: string
  description: string
  checklist: QualityChecklistItem[]
  defects: number
  issues: string[]
  attachments: string[]
}

export interface QualityChecklistItem {
  question: string
  response: "Yes" | "No" | "N/A"
}

export interface FieldReportsData {
  dailyLogs: DailyLog[]
  manpower: ManpowerRecord[]
  safetyAudits: SafetyAudit[]
  qualityInspections: QualityInspection[]
}

export interface FieldMetrics {
  totalLogs: number
  logComplianceRate: number
  expectedLogs: number
  completedLogs: number
  totalWorkers: number
  averageEfficiency: number
  safetyViolations: number
  safetyComplianceRate: number
  qualityDefects: number
  qualityPassRate: number
  totalInspections: number
  atRiskSafetyItems: number
  businessDaysInMonth: number
  businessDaysToDate: number
}

export interface InsightItem {
  type: "critical" | "warning" | "positive" | "info"
  category: string
  title: string
  description: string
  recommendation: string
  impact: "Critical" | "High" | "Medium" | "Low"
  priority: "urgent" | "high" | "medium" | "low"
}

export interface FilterState {
  project: string
  status: string
  dateRange: { from: Date | undefined; to: Date | undefined }
  contractor: string
  trade: string
  search: string
}

export interface WeatherReport {
  temperature: {
    low: string
    high: string
    avg: string
  }
  precipitation: {
    midnight: string
    twoDaysAgo: string
    threeDaysAgo: string
  }
  humidity: {
    low: string
    avg: string
    high: string
  }
  windSpeed: {
    dew: string
    avg: string
    gust: string
  }
}

export interface DashboardData {
  dailyLogs: DailyLog[]
  qualityControl: QualityInspection[]
  safety: SafetyAudit[]
  manpower: ManpowerRecord[]
}
