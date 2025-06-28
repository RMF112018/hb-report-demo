export interface SchedulerProject {
  project_id: string
  name: string
  description: string
  department: "Pre-Construction" | "Operations" | "Warranty"
  status: "planning" | "active" | "on-hold" | "completed"
  budget: number
  start_date: string
  end_date: string
  tasks: SchedulerTask[]
  resources: SchedulerResource[]
  milestones: SchedulerMilestone[]
  risks: SchedulerRisk[]
  constraints: SchedulerConstraints
}

export interface SchedulerTask {
  task_id: string
  name: string
  description: string
  duration: number
  priority: "Low" | "Medium" | "High"
  start_date: string
  end_date: string
  dependencies: string[]
  resources: string[]
  assigned_resources: string[]
  cost: number
  progress: number
  critical_path: boolean
  is_critical: boolean
  status: "Not Started" | "In Progress" | "Completed" | "On Hold"
  ai_optimized?: boolean
}

export interface SchedulerResource {
  resource_id: string
  name: string
  type: "Personnel" | "Equipment"
  cost: number
  availability: boolean
  available: boolean
  unit: "hour" | "day" | "week"
}

export interface SchedulerMilestone {
  milestone_id: string
  name: string
  date: string
  task_id: string
}

export interface SchedulerRisk {
  risk_id: string
  description: string
  impact: "Low" | "Medium" | "High"
  probability: "Low" | "Medium" | "High"
  mitigation: string
  affected_tasks: string[]
}

export interface SchedulerConstraints {
  non_working_days: string[]
  must_finish_by: string
  weather_restrictions: string[]
}

// New interfaces for schedule generation
export interface ProjectGenerationForm {
  name: string
  description: string
  department: "Pre-Construction" | "Operations" | "Warranty"
  budget: number
  start_date: string
  duration_weeks: number
  project_type: "Residential" | "Commercial" | "Industrial" | "Infrastructure"
  complexity: "Low" | "Medium" | "High"
  team_size: number
  weather_dependent: boolean
  critical_deadline: boolean
  must_finish_by?: string
}

export interface TaskTemplate {
  name: string
  description: string
  duration_days: number
  priority: "Low" | "Medium" | "High"
  dependencies: string[]
  resource_requirements: {
    personnel: number
    equipment: string[]
  }
  weather_dependent: boolean
  critical_path: boolean
}

export interface GeneratedSchedule {
  project: SchedulerProject
  critical_path_duration: number
  total_cost: number
  risk_score: number
  recommendations: string[]
  optimization_notes: string[]
}

export interface ScheduleGenerationOptions {
  optimize_for: "time" | "cost" | "quality" | "balanced"
  include_buffer: boolean
  buffer_percentage: number
  consider_weather: boolean
  prioritize_critical_path: boolean
  resource_leveling: boolean
}

export interface NewProjectForm {
  name: string
  project_id: string
  description: string
  department: "Pre-Construction" | "Operations" | "Warranty"
  start_date: string
  budget: number
}

export interface NewTaskForm {
  name: string
  description: string
  duration: number
  priority: "Low" | "Medium" | "High"
  dependencies: string[]
  resources: string[]
  cost: number
}

export interface NewResourceForm {
  name: string
  type: "Personnel" | "Equipment"
  cost: number
  unit: "hour" | "day" | "week"
}

export interface NewRiskForm {
  description: string
  impact: "Low" | "Medium" | "High"
  probability: "Low" | "Medium" | "High"
  mitigation: string
  affected_tasks: string[]
}

export interface ExportFormat {
  format: "XER" | "MPP" | "XML" | "CSV"
  filename: string
  data: string
}

export interface GanttChartData {
  task_id: string
  name: string
  start: Date
  end: Date
  progress: number
  dependencies: string[]
  critical_path: boolean
  resources: string[]
}
