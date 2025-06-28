export interface ResponsibilityTask {
  id: string
  projectId: string
  type: "team" | "prime-contract" | "subcontract"
  category: string
  task: string
  page: string
  article: string
  responsible: string
  assignments: { [roleKey: string]: "Approve" | "Primary" | "Support" | "None" }
  status: "active" | "pending" | "completed"
  createdAt: string
  updatedAt: string
  annotations: TaskAnnotation[]
}

export interface TaskAnnotation {
  id: string
  user: string
  timestamp: string
  comment: string
}

export interface ResponsibilityRole {
  key: string
  name: string
  color: string
  enabled: boolean
  description: string
}

export interface ResponsibilityMetrics {
  totalTasks: number
  unassignedTasks: number
  completedTasks: number
  pendingTasks: number
  roleWorkload: { [roleKey: string]: number }
  categoryDistribution: { [category: string]: number }
  completionRate: number
  averageTasksPerRole: number
}

export interface ResponsibilityData {
  tasks: ResponsibilityTask[]
  categories: string[]
  roles: ResponsibilityRole[]
}

export interface ResponsibilityExportOptions {
  format: "pdf" | "excel" | "csv"
  includeAnnotations?: boolean
  includeMetrics?: boolean
  aiaCompliant?: boolean
  paperSize?: "letter" | "tabloid"
  orientation?: "portrait" | "landscape"
  filterByType?: "team" | "prime-contract" | "subcontract"
  filterByCategory?: string
}

export interface ResponsibilityFilter {
  role?: string
  category?: string
  status?: string
  assignment?: string
  search?: string
}

export interface RoleAssignment {
  id: string
  taskId: string
  roleKey: string
  assignment: "Approve" | "Primary" | "Support" | "None"
  assignedBy: string
  assignedAt: string
  status: "active" | "inactive"
  notes?: string
}
