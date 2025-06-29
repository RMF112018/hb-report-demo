export interface Project {
  project_id: number
  name: string
  display_name?: string
  active: boolean
  duration?: number
  square_feet?: number
  total_value?: number
  completion_date?: string
  [key: string]: any
}