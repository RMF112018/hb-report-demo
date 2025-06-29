import type {
  DailyLog,
  ManpowerRecord,
  SafetyAudit,
  QualityInspection,
  FieldMetrics,
  FieldReportsData,
} from "@/types/field-reports"

// Import mock data
import dailyLogsData from "@/data/mock-daily-logs.json"
import manpowerData from "@/data/mock-manpower.json"
import safetyAuditsData from "@/data/mock-safety-audits.json"
import qualityInspectionsData from "@/data/mock-quality-inspections.json"

export const mockDailyLogs = dailyLogsData as DailyLog[]
export const mockManpower = manpowerData as ManpowerRecord[]
export const mockSafetyAudits = safetyAuditsData as SafetyAudit[]
export const mockQualityInspections = qualityInspectionsData as QualityInspection[]

export const mockFieldData: FieldReportsData = {
  dailyLogs: mockDailyLogs,
  manpower: mockManpower,
  safetyAudits: mockSafetyAudits,
  qualityInspections: mockQualityInspections,
}

export const mockMetrics: FieldMetrics = {
  totalLogs: mockDailyLogs.length,
  logComplianceRate: Math.round(
    (mockDailyLogs.filter((log) => log.status === "submitted").length / mockDailyLogs.length) * 100,
  ),
  totalWorkers: mockManpower.reduce((sum, mp) => sum + mp.workers, 0),
  averageEfficiency: Math.round(mockManpower.reduce((sum, mp) => sum + mp.efficiency, 0) / mockManpower.length),
  safetyViolations: mockSafetyAudits.reduce((sum, sa) => sum + sa.violations, 0),
  safetyComplianceRate: Math.round(
    (mockSafetyAudits.filter((sa) => sa.status === "pass").length / mockSafetyAudits.length) * 100,
  ),
  qualityDefects: mockQualityInspections.reduce((sum, qi) => sum + qi.defects, 0),
  qualityPassRate: Math.round(
    (mockQualityInspections.filter((qi) => qi.status === "pass").length / mockQualityInspections.length) * 100,
  ),
}

// Role-based data filtering
export const getFilteredDataByRole = (role: string): FieldReportsData => {
  const filtered = { ...mockFieldData }

  switch (role) {
    case "project-manager":
      // PM sees only their active project
      const activeProject = "401001"
      filtered.dailyLogs = filtered.dailyLogs.filter((log) => log.projectId === activeProject)
      filtered.manpower = filtered.manpower.filter((mp) => mp.projectId === activeProject)
      filtered.safetyAudits = filtered.safetyAudits.filter((sa) => sa.projectId === activeProject)
      filtered.qualityInspections = filtered.qualityInspections.filter((qi) => qi.projectId === activeProject)
      break
    case "project-executive":
      // PX sees projects they oversee
      const overseeProjects = ["401001", "401002", "401003"]
      filtered.dailyLogs = filtered.dailyLogs.filter((log) => overseeProjects.includes(log.projectId))
      filtered.manpower = filtered.manpower.filter((mp) => overseeProjects.includes(mp.projectId))
      filtered.safetyAudits = filtered.safetyAudits.filter((sa) => overseeProjects.includes(sa.projectId))
      filtered.qualityInspections = filtered.qualityInspections.filter((qi) => overseeProjects.includes(qi.projectId))
      break
    // Admin and Executive see all data
    default:
      break
  }

  return filtered
}

export const getMetricsByRole = (role: string): FieldMetrics => {
  const data = getFilteredDataByRole(role)

  return {
    totalLogs: data.dailyLogs.length,
    logComplianceRate:
      data.dailyLogs.length > 0
        ? Math.round((data.dailyLogs.filter((log) => log.status === "submitted").length / data.dailyLogs.length) * 100)
        : 0,
    totalWorkers: data.manpower.reduce((sum, mp) => sum + mp.workers, 0),
    averageEfficiency:
      data.manpower.length > 0
        ? Math.round(data.manpower.reduce((sum, mp) => sum + mp.efficiency, 0) / data.manpower.length)
        : 0,
    safetyViolations: data.safetyAudits.reduce((sum, sa) => sum + sa.violations, 0),
    safetyComplianceRate:
      data.safetyAudits.length > 0
        ? Math.round((data.safetyAudits.filter((sa) => sa.status === "pass").length / data.safetyAudits.length) * 100)
        : 0,
    qualityDefects: data.qualityInspections.reduce((sum, qi) => sum + qi.defects, 0),
    qualityPassRate:
      data.qualityInspections.length > 0
        ? Math.round(
            (data.qualityInspections.filter((qi) => qi.status === "pass").length / data.qualityInspections.length) *
              100,
          )
        : 0,
  }
}

// Mock user contexts for different roles
export const mockUsers = {
  admin: {
    id: "admin-001",
    name: "Admin User",
    email: "admin@hbcompanies.com",
    role: "admin",
    permissions: ["read", "write", "delete", "export", "manage"],
  },
  executive: {
    id: "exec-001",
    name: "Executive User",
    email: "executive@hbcompanies.com",
    role: "executive",
    permissions: ["read", "export", "view-all"],
  },
  projectExecutive: {
    id: "px-001",
    name: "Project Executive",
    email: "px@hbcompanies.com",
    role: "project-executive",
    permissions: ["read", "write", "export"],
  },
  projectManager: {
    id: "pm-001",
    name: "Project Manager",
    email: "pm@hbcompanies.com",
    role: "project-manager",
    permissions: ["read", "write"],
  },
}

// State variations for different scenarios
export const stateVariations = {
  highCompliance: {
    ...mockMetrics,
    logComplianceRate: 98,
    safetyComplianceRate: 96,
    qualityPassRate: 94,
    safetyViolations: 1,
    qualityDefects: 2,
  },
  lowCompliance: {
    ...mockMetrics,
    logComplianceRate: 72,
    safetyComplianceRate: 78,
    qualityPassRate: 68,
    safetyViolations: 12,
    qualityDefects: 18,
  },
  criticalIssues: {
    ...mockMetrics,
    logComplianceRate: 45,
    safetyComplianceRate: 62,
    qualityPassRate: 55,
    safetyViolations: 25,
    qualityDefects: 32,
  },
}
