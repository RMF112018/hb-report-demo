export interface ResponsibilityTask {
  id: string
  type: "team" | "prime-contract" | "subcontract"
  category?: string
  task: string
  page?: string
  article?: string
  responsible?: string
  assignments?: Record<string, string> // role -> assignment (X, Support, "")
  createdAt: string
  updatedAt: string
}

export interface ProjectRole {
  key: string
  label: string
  description?: string
  color?: string
}

export interface ContractRole {
  key: string
  label: string
  description?: string
  color?: string
}

export interface ResponsibilityMatrix {
  id: string
  projectId: number
  teamTasks: ResponsibilityTask[]
  primeContractTasks: ResponsibilityTask[]
  subcontractTasks: ResponsibilityTask[]
  projectRoles: ProjectRole[]
  contractRoles: ContractRole[]
  settings: {
    activeRoles: string[]
    defaultAssignments: Record<string, string>
  }
  createdAt: string
  updatedAt: string
}

export interface ResponsibilityAssignment {
  taskId: string
  role: string
  assignment: "X" | "Support" | ""
  assignedBy: string
  assignedAt: string
}

export interface ResponsibilityFilter {
  roles?: string[]
  assignments?: string[]
  categories?: string[]
  search?: string
}

export interface ResponsibilityExport {
  format: "csv" | "excel" | "pdf"
  includeRoles?: string[]
  includeCategories?: string[]
  dateRange?: {
    start: string
    end: string
  }
}
