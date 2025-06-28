// Centralized type definitions for Staff Planning module
// This prevents type inconsistencies across components

export interface Employee {
  id: string
  name: string
  position: string
  assignment: {
    projectId: string
    role: string
    startDate: string
    endDate: string
  }
  laborRate: number
  billableRate: number
  experience: number
  strengths: string[]
  weaknesses: string[]
}

export interface Project {
  id: string
  name: string
  schedule: {
    startDate: string
    endDate: string
    milestones: string[]
  }
  budget: number
  assignedStaff: string[]
  projectExecutive: string
  status: string
}

export interface SPCR {
  id: string
  projectId: string
  type: "increase" | "decrease"
  position: string
  startDate: string
  endDate: string
  scheduleRef: string
  budget: number
  explanation: string
  status: "draft" | "submitted" | "approved" | "rejected"
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface HBIInsight {
  id: string
  projectId: string
  type: "staffing-need" | "overlap" | "employee-suggestion"
  description: string
  confidence: number
  suggestedEmployees: string[]
}

export interface StaffPlanningData {
  employees: Employee[]
  projects: Project[]
  spcrs: SPCR[]
  insights: HBIInsight[]
}

// User interface for role-based access control
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "project-executive" | "project-manager" | "staff"
}

// Component prop interfaces
export interface StaffPlanningHubProps {
  staffData: StaffPlanningData
  selectedProject: Project | null
  user: User | null
}

export interface StaffOverviewProps {
  staffData: StaffPlanningData
  selectedProject: Project | null
}

export interface StaffTableProps {
  employees: Employee[]
  projects: Project[]
  filteredEmployees?: Employee[]
}

export interface SPCRListProps {
  spcrs: SPCR[]
  projects: Project[]
}

export interface HBIStaffingInsightsProps {
  insights: HBIInsight[]
  projects: Project[]
  employees: Employee[]
}

// Utility types for filtering and sorting
export type StaffFilter = {
  position?: string
  project?: string
  status?: string
  searchTerm?: string
}

export type SortField = "name" | "position" | "laborRate" | "billableRate" | "experience"
export type SortDirection = "asc" | "desc"

// API response types
export interface StaffPlanningApiResponse {
  success: boolean
  data?: StaffPlanningData
  error?: string
  message?: string
}

export interface SPCRSubmissionResponse {
  success: boolean
  spcr?: SPCR
  error?: string
  message?: string
}
