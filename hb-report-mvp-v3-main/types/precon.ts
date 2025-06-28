export interface PreConProject {
  id: string
  projectId: number // Added projectId
  name: string
  client: string
  projectType: string
  estimatedValue: number
  status: "active" | "awarded" | "lost" | "on-hold"
  estimateDeadline: Date
  estimator: string
  trades: string[]
  subcontractorCount: number
  participationByTrade: { [key: string]: number }
  createdAt: Date
  updatedAt: Date
}

export interface EstimateMetrics {
  totalEstimates: number
  estimatesThisYear: number
  estimatesThisQuarter: number
  estimatesThisMonth: number
  estimatesLastYear: number
  winRate: number
  averageEstimateValue: number
  averageSubcontractorParticipation: number
  totalAwarded: number
  totalSubmitted: number
}

export interface UpcomingDeadline {
  id: string
  projectId: number // Added projectId
  projectName: string
  client: string
  deadline: Date
  daysRemaining: number
  estimator: string
  status: "warning" | "normal" | "critical"
}

export interface TradeParticipation {
  trade: string
  averageParticipation: number
  totalProjects: number
  topSubcontractors: string[]
}
