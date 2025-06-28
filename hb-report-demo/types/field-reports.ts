export interface DailyLog {
  id: string
  projectId: string
  date: string
  submittedBy: string
  status: "submitted" | "pending" | "overdue" | "draft"
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

export interface ManpowerRecord {
  id: string
  projectId: string
  date: string
  contractor: string
  workers: number
  hours: number
  trade: string
  totalManHours: number
  efficiency: number
  costPerHour: number
}

export interface SafetyAudit {
  id: string
  projectId: string
  date: string
  violations: number
  complianceScore: number
  issues: string[]
  status: "pass" | "fail"
}

export interface QualityInspection {
  id: string
  projectId: string
  date: string
  defects: number
  status: "pass" | "fail" | "pending"
  issues: string[]
  resolutionNotes: string
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
  totalWorkers: number
  averageEfficiency: number
  safetyViolations: number
  safetyComplianceRate: number
  qualityDefects: number
  qualityPassRate: number
}
