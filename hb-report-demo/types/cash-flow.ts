export interface CashFlowInflows {
  ownerPayments: number
  loans: number
  changeOrders: number
  retentionRelease: number
  other: number
  total: number
}

export interface CashFlowOutflows {
  subcontractorPayments: number
  materialCosts: number
  laborCosts: number
  equipmentCosts: number
  overhead: number
  other: number
  total: number
}

export interface MonthlyCashFlow {
  project_id?: number
  month: string
  inflows: CashFlowInflows
  outflows: CashFlowOutflows
  netCashFlow: number
  cumulativeCashFlow: number
  workingCapital: number
  retentionHeld: number
  forecastAccuracy?: number
}

export interface AggregatedMonthlyCashFlow {
  month: string
  totalInflows: number
  totalOutflows: number
  netCashFlow: number
  cumulativeCashFlow: number
}

export interface CashFlowForecast {
  month: string
  projectedInflows: number
  projectedOutflows: number
  projectedNetCashFlow: number
  projectedCumulativeCashFlow: number
  confidence: number
}

export interface CashFlowSummary {
  totalInflows: number
  totalOutflows: number
  netCashFlow: number
  peakCashRequirement: number
  cashFlowAtRisk: number
  workingCapital: number
  lastUpdated: string
}

export interface PortfolioCashFlowSummary {
  totalInflows: number
  totalOutflows: number
  netCashFlow: number
  peakCashRequirement: number
  cashFlowAtRisk: number
  averageWorkingCapital: number
}

export interface CashFlowInsight {
  id: string
  type: "critical" | "warning" | "info" | "success"
  category: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  confidence: number
  recommendation: string
  affectedMonths: string[]
}

export interface ProjectCashFlow {
  project_id: number
  name: string
  cashFlowData: {
    summary: CashFlowSummary
    monthlyData: MonthlyCashFlow[]
    forecast: CashFlowForecast[]
    aiInsights: CashFlowInsight[]
  }
}

export interface PortfolioCashFlow {
  portfolioSummary: {
    totalProjects: number
    aggregatedMetrics: PortfolioCashFlowSummary
    monthlyAggregated: AggregatedMonthlyCashFlow[]
  }
  projects: ProjectCashFlow[]
}

export interface CashFlowFilters {
  dateRange: {
    start: string
    end: string
  }
  costTypes: string[]
  status: string[]
  projects: string[]
  viewMode: "single" | "portfolio"
}

export interface CashFlowExportOptions {
  format: "pdf" | "excel" | "csv"
  includeCharts: boolean
  includeInsights: boolean
  dateRange?: {
    start: string
    end: string
  }
  sections: string[]
}

export interface CashFlowAnnotation {
  id: string
  month: string
  userId: string
  userName: string
  userRole: string
  comment: string
  timestamp: string
  type: "note" | "approval" | "concern"
}
