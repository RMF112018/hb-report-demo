export interface DashboardCard {
  id: string
  type: string
  title: string
  size: "small" | "medium" | "large" | "xl"
  position: { x: number; y: number }
  visible: boolean
  config?: any
}

export interface DashboardLayout {
  id: string
  name: string
  description: string
  cards: DashboardCard[]
  isTemplate: boolean
  templateType?: "financial" | "health" | "schedule" | "custom"
  createdAt: Date
  updatedAt: Date
}

export interface AIInsight {
  id: string
  type: "trend" | "alert" | "recommendation" | "prediction"
  title: string
  description: string
  severity: "high" | "medium" | "low"
  confidence: number
  relatedCards: string[]
  actionable: boolean
  dismissed: boolean
  createdAt: Date
}

export interface CardType {
  type: string
  title: string
  description: string
  category: "financial" | "health" | "schedule" | "performance"
  defaultSize: "small" | "medium" | "large" | "xl"
  configurable: boolean
}
