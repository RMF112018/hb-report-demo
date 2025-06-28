export interface DashboardCard {
  id: string
  type: string
  title: string
  size?: "small" | "medium" | "large" | "wide" | "tall" | "extra-large"
  position?: { x: number; y: number }
  span: { cols: number; rows: number }
  visible?: boolean
  config?: any
  metadata?: CardMetadata
  customizable?: boolean
  pinned?: boolean
}

export interface DashboardLayout {
  id: string
  name: string
  description: string
  role: string
  cards: DashboardCard[]
}

export interface CardConfig {
  [key: string]: any
}

export interface DashboardLayoutData {
  id: string
  name: string
  description?: string
  role?: string
  cards: DashboardCard[]
}

// Card size definitions for responsive grid
export interface CardSizeConfig {
  small: {
    cols: { base: 1; sm: 1; lg: 1; xl: 1 }
    rows: 1
    minHeight: "200px"
    maxHeight: "400px"
  }
  medium: {
    cols: { base: 1; sm: 2; lg: 2; xl: 2 }
    rows: 1
    minHeight: "200px"
    maxHeight: "500px"
  }
  large: {
    cols: { base: 1; sm: 2; lg: 2; xl: 2 }
    rows: 2
    minHeight: "400px"
    maxHeight: "800px"
  }
  wide: {
    cols: { base: 1; sm: 2; lg: 3; xl: 3 }
    rows: 1
    minHeight: "200px"
    maxHeight: "600px"
  }
  tall: {
    cols: { base: 1; sm: 1; lg: 1; xl: 1 }
    rows: 2
    minHeight: "400px"
    maxHeight: "800px"
  }
  "extra-large": {
    cols: { base: 1; sm: 2; lg: 3; xl: 3 }
    rows: 2
    minHeight: "400px"
    maxHeight: "1000px"
  }
}

export interface ProjectData {
  project_id: string
  name: string
  budget?: number
  status?: string
  completion_percentage?: number
  start_date?: string
  end_date?: string
}

export interface MetricData {
  value: number
  trend?: "up" | "down" | "stable"
  target?: number
  unit?: string
  format?: "currency" | "percentage" | "number" | "days"
}

// Add after existing interfaces

export interface CardMetadata {
  category: "performance" | "financial" | "risk" | "project"
  severity: "low" | "medium" | "high"
  description: string
  helpText: string
  tags?: string[]
}

export interface DashboardPreferences {
  layout: DashboardCard[]
  hiddenCards: string[]
  filterBy: string
  sortBy: string
  lastSaved: string
}

export interface CardToolbarAction {
  id: string
  label: string
  icon: string
  action: (cardId: string) => void
  tooltip: string
}
