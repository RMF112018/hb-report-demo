export interface BudgetItem {
  id: string
  category: string
  budgeted: number
  actual: number
  variance: number
  percentage: number
}

export interface CostItem {
  id: string
  description: string
  category: string
  amount: number
  date: string
  vendor?: string
}

export interface ForecastItem {
  id: string
  category: string
  currentMonth: number
  nextMonth: number
  quarterProjection: number
  yearProjection: number
}

export interface ChangeOrderItem {
  id: string
  number: string
  description: string
  amount: number
  status: "pending" | "approved" | "rejected"
  date: string
  reason: string
}

export interface InvoiceItem {
  id: string
  number: string
  vendor: string
  amount: number
  dueDate: string
  status: "pending" | "paid" | "overdue"
  description: string
}

export interface PayAuthItem {
  id: string
  number: string
  contractor: string
  amount: number
  period: string
  status: "draft" | "submitted" | "approved" | "paid"
  workCompleted: number
}

export interface ProcoreBudgetItem {
  budgetCode: string
  description: string
  originalBudget: string
  budgetModifications: string
  approvedCOs: string
  revisedBudget: string
  projectedBudget: string
  committedCosts: string
  directCosts: string
  jobToDateCosts: string
  projectedCosts: string
  forecastToComplete: string
  estimatedCostAtCompletion: string
  projectedOverUnder: string
}

export interface SageJCHRItem {
  costCode: string
  description: string
  transactionDate: string
  commitCONumber: string
  vendorEmployee: string
  originalEstimate: string
  approvedChanges: string
  totalEstimate: string
  originalCommitment: string
  commitmentChanges: string
  totalCommitment: string
  jtdCosts: string
  remainingEstimate: string
}

export interface FinancialProject {
  id: string
  name: string
  budget: BudgetItem[]
  costs: CostItem[]
  forecasts: ForecastItem[]
  changeOrders: ChangeOrderItem[]
  invoices: InvoiceItem[]
  payAuthorizations: PayAuthItem[]
  procoreBudgetData?: ProcoreBudgetItem[]
  sageJCHRData?: SageJCHRItem[]
}
