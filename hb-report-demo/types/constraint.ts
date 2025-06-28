/**
 * Constraint interface for project constraint management
 * Represents a single constraint item with all necessary fields
 */
export interface Constraint {
  id: string
  no: string
  category: string
  description: string
  dateIdentified: string
  daysElapsed: number
  reference: string
  closureDocument: string
  assigned: string
  bic: string
  dueDate: string
  completionStatus: "Identified" | "Pending" | "In Progress" | "Closed"
  dateClosed: string
  comments: string
}

/**
 * Project interface containing constraints
 */
export interface ConstraintProject {
  project_id: string
  name: string
  department: string
  constraints: Constraint[]
}

/**
 * Statistics interface for constraint metrics
 */
export interface ConstraintStats {
  total: number
  open: number
  closed: number
  overdue: number
  byCategory: Record<string, number>
  byStatus: Record<string, number>
}

/**
 * Filter interface for constraint filtering
 */
export interface ConstraintFilters {
  search: string
  status: string
  category: string
  assigned: string
  dateRange: {
    start: Date | null
    end: Date | null
  }
}

/**
 * HBI Insight interface for AI-driven recommendations
 */
export interface HbiInsight {
  id: string
  type: "warning" | "success" | "recommendation" | "info"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  confidence: number
  actionable: boolean
  relatedConstraints: string[]
}
