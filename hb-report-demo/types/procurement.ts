export interface BuyoutRecord {
  id: string
  projectId: string
  type: "subcontract" | "material"

  // Basic Information
  name: string
  description: string
  category: string
  costCode: string

  // Financial Data
  budgetAmount: number
  contractAmount?: number
  currentAmount: number
  variance: number
  variancePercentage: number
  retentionPercentage: number
  retentionAmount: number

  // Vendor Information
  vendorId?: string
  vendorName: string
  vendorContact: {
    name: string
    email: string
    phone: string
  }

  // Schedule Information
  startDate: string
  endDate: string
  milestones: BuyoutMilestone[]

  // Status and Compliance
  status: "planning" | "bidding" | "awarded" | "active" | "completed" | "cancelled"
  complianceStatus: "compliant" | "warning" | "non-compliant"
  complianceChecks: ComplianceCheck[]

  // Procurement Specific
  procurementMethod: "competitive-bid" | "negotiated" | "sole-source" | "emergency"
  bidCount: number
  awardDate?: string

  // Integration Data
  procoreCommitmentId?: string
  sageVendorId?: string

  // Metadata
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  approvedBy?: string
  approvedAt?: string
}

export interface BuyoutMilestone {
  id: string
  name: string
  description: string
  dueDate: string
  completedDate?: string
  status: "pending" | "in-progress" | "completed" | "overdue"
  deliverables: string[]
  dependencies: string[]
}

export interface ComplianceCheck {
  id: string
  type: "insurance" | "bonding" | "licensing" | "safety" | "quality"
  requirement: string
  status: "pending" | "submitted" | "approved" | "rejected" | "expired"
  dueDate: string
  submittedDate?: string
  approvedDate?: string
  documents: ComplianceDocument[]
  notes: string
}

export interface ComplianceDocument {
  id: string
  name: string
  type: string
  url: string
  uploadedAt: string
  expirationDate?: string
}

export interface MaterialProcurement extends BuyoutRecord {
  // Material Specific Fields
  materialType: "long-lead" | "bulk" | "specialty" | "equipment"
  specifications: MaterialSpecification[]
  deliveryLocation: string
  storageRequirements: string
  qualityRequirements: string

  // Procurement Details
  rfqSentDate?: string
  quotesReceived: VendorQuote[]
  selectedQuoteId?: string
  poNumber?: string
  poDate?: string

  // Delivery Tracking
  expectedDeliveryDate: string
  actualDeliveryDate?: string
  deliveryStatus: "pending" | "partial" | "complete" | "delayed"
  deliveryNotes: string
}

export interface MaterialSpecification {
  id: string
  category: string
  description: string
  quantity: number
  unit: string
  specifications: Record<string, any>
  alternatesAllowed: boolean
}

export interface VendorQuote {
  id: string
  vendorId: string
  vendorName: string
  quotedAmount: number
  quotedDate: string
  validUntil: string
  deliveryTime: number // days
  terms: string
  notes: string
  attachments: string[]
  score?: number
}

export interface SubcontractBuyout extends BuyoutRecord {
  // Subcontract Specific Fields
  workScope: string
  contractType: "lump-sum" | "unit-price" | "cost-plus" | "time-and-material"

  // Bidding Information
  bidPackageId: string
  prequalificationRequired: boolean
  bondingRequired: boolean
  insuranceRequirements: InsuranceRequirement[]

  // Contract Details
  contractDocuments: ContractDocument[]
  scheduleOfValues: ScheduleOfValuesItem[]
  changeOrders: ChangeOrder[]

  // Performance Tracking
  performanceMetrics: PerformanceMetric[]
  qualityScores: QualityScore[]
  safetyRecord: SafetyRecord[]
}

export interface InsuranceRequirement {
  type: "general-liability" | "workers-comp" | "auto" | "umbrella" | "professional"
  minimumAmount: number
  required: boolean
  verified: boolean
  expirationDate?: string
}

export interface ContractDocument {
  id: string
  name: string
  type: "contract" | "specification" | "drawing" | "addendum" | "change-order"
  version: string
  url: string
  uploadedAt: string
  signedBy?: string[]
  signedAt?: string
}

export interface ScheduleOfValuesItem {
  id: string
  lineItem: string
  description: string
  scheduledValue: number
  workCompletedPrevious: number
  workCompletedThisPeriod: number
  materialsStoredPrevious: number
  materialsStoredThisPeriod: number
  totalCompleted: number
  percentComplete: number
  balanceToFinish: number
  retentionAmount: number
}

export interface ChangeOrder {
  id: string
  number: string
  description: string
  reason: string
  amount: number
  timeImpact: number // days
  status: "draft" | "submitted" | "approved" | "rejected" | "executed"
  submittedDate: string
  approvedDate?: string
  executedDate?: string
  documents: string[]
}

export interface PerformanceMetric {
  id: string
  category: "schedule" | "quality" | "safety" | "cost"
  metric: string
  target: number
  actual: number
  variance: number
  measurementDate: string
  notes: string
}

export interface QualityScore {
  id: string
  inspectionDate: string
  inspector: string
  category: string
  score: number // 1-10
  deficiencies: string[]
  correctedDate?: string
  notes: string
}

export interface SafetyRecord {
  id: string
  recordDate: string
  incidentType?: "near-miss" | "first-aid" | "recordable" | "lost-time"
  description?: string
  correctiveActions: string[]
  safetyScore: number // 1-10
}

export interface BuyoutAnalytics {
  totalBuyoutValue: number
  totalVariance: number
  variancePercentage: number
  completedBuyouts: number
  activeBuyouts: number
  pendingBuyouts: number
  complianceRate: number
  averageVendorScore: number
  onTimeDeliveryRate: number
  costSavings: number
  riskScore: number
}

export interface VendorProfile {
  id: string
  name: string
  type: "subcontractor" | "supplier" | "manufacturer"

  // Contact Information
  primaryContact: {
    name: string
    title: string
    email: string
    phone: string
  }
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }

  // Business Information
  businessLicense: string
  taxId: string
  duns: string
  cageCode?: string

  // Capabilities
  specialties: string[]
  certifications: string[]
  bondingCapacity: number

  // Performance History
  overallScore: number
  qualityScore: number
  scheduleScore: number
  safetyScore: number
  financialScore: number

  // Financial Information
  annualRevenue: number
  creditRating: string
  bondingCompany: string
  insuranceCarrier: string

  // Project History
  projectsCompleted: number
  totalContractValue: number
  averageProjectSize: number

  // Status
  prequalified: boolean
  approved: boolean
  blacklisted: boolean
  lastUpdated: string
}

export interface BidComparison {
  id: string
  projectId: string
  buyoutId: string
  name: string
  description: string

  // Bid Package Information
  bidPackage: {
    scope: string
    specifications: string[]
    drawings: string[]
    addenda: string[]
  }

  // Evaluation Criteria
  evaluationCriteria: EvaluationCriterion[]

  // Bids
  bids: BidSubmission[]

  // Analysis
  recommendedBid?: string
  analysisNotes: string

  // Metadata
  createdBy: string
  createdAt: string
  evaluatedBy?: string
  evaluatedAt?: string
}

export interface EvaluationCriterion {
  id: string
  category: "price" | "schedule" | "experience" | "quality" | "safety" | "financial"
  description: string
  weight: number // percentage
  scoringMethod: "numerical" | "ranking" | "pass-fail"
}

export interface BidSubmission {
  id: string
  vendorId: string
  vendorName: string

  // Bid Details
  bidAmount: number
  alternateAmounts: AlternateBid[]
  unitPrices: UnitPrice[]

  // Schedule
  proposedStartDate: string
  proposedDuration: number // days
  milestoneSchedule: BidMilestone[]

  // Qualifications
  projectReferences: ProjectReference[]
  keyPersonnel: KeyPersonnel[]
  subcontractors: SubcontractorInfo[]

  // Compliance
  bondProvided: boolean
  insuranceProvided: boolean
  licensesProvided: boolean

  // Evaluation Scores
  scores: BidScore[]
  totalScore: number
  ranking: number

  // Status
  status: "submitted" | "under-review" | "clarification-needed" | "rejected" | "selected"
  submittedAt: string
  reviewedAt?: string
  notes: string
}

export interface AlternateBid {
  id: string
  description: string
  amount: number
  addDeduct: "add" | "deduct"
}

export interface UnitPrice {
  id: string
  item: string
  unit: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface BidMilestone {
  id: string
  description: string
  duration: number // days from start
  dependencies: string[]
}

export interface ProjectReference {
  id: string
  projectName: string
  owner: string
  contractValue: number
  completionDate: string
  contactName: string
  contactPhone: string
  contactEmail: string
}

export interface KeyPersonnel {
  id: string
  name: string
  role: string
  experience: number // years
  certifications: string[]
  availability: number // percentage
}

export interface SubcontractorInfo {
  id: string
  name: string
  scope: string
  percentage: number
  prequalified: boolean
}

export interface BidScore {
  criterionId: string
  score: number
  maxScore: number
  notes: string
}

export interface HbiBuyoutInsight {
  id: string
  type: "risk" | "opportunity" | "recommendation" | "alert"
  category: "vendor" | "schedule" | "cost" | "compliance" | "market"
  title: string
  description: string
  impact: "low" | "medium" | "high" | "critical"
  confidence: number // 0-100

  // Risk Specific
  riskFactors?: string[]
  mitigation?: string[]

  // Recommendations
  recommendations?: string[]
  expectedBenefit?: number

  // Data Sources
  dataSources: string[]
  lastUpdated: string

  // Actions
  actionRequired: boolean
  assignedTo?: string
  dueDate?: string
  status: "new" | "acknowledged" | "in-progress" | "resolved" | "dismissed"
}

// Export Options
export interface BuyoutExportOptions {
  format: "pdf" | "excel" | "csv"
  sections: {
    summary: boolean
    analytics: boolean
    buyoutSchedule: boolean
    vendorDetails: boolean
    compliance: boolean
    insights: boolean
  }
  filters: {
    status?: string[]
    category?: string[]
    dateRange?: {
      start: string
      end: string
    }
  }
  includeCharts: boolean
  includeAttachments: boolean
}

// API Integration Types
export interface ProcoreIntegration {
  commitments: ProcoreCommitment[]
  vendors: ProcoreVendor[]
  budgetLineItems: ProcoreBudgetItem[]
}

export interface ProcoreCommitment {
  id: string
  title: string
  number: string
  status: string
  vendor: {
    id: string
    name: string
  }
  contractAmount: number
  approvedChangeOrders: number
  pendingChangeOrders: number
  revisedContract: number
}

export interface ProcoreVendor {
  id: string
  name: string
  trade: string
  contactInfo: {
    email: string
    phone: string
    address: string
  }
  prequalified: boolean
}

export interface ProcoreBudgetItem {
  id: string
  costCode: string
  description: string
  budgetedAmount: number
  forecastAmount: number
  actualAmount: number
}

export interface SageIntegration {
  vendors: SageVendor[]
  jobCosts: SageJobCost[]
  payments: SagePayment[]
}

export interface SageVendor {
  id: string
  name: string
  address: string
  paymentTerms: string
  creditLimit: number
  currentBalance: number
}

export interface SageJobCost {
  jobNumber: string
  costCode: string
  description: string
  budgetAmount: number
  actualAmount: number
  commitmentAmount: number
}

export interface SagePayment {
  id: string
  vendorId: string
  amount: number
  paymentDate: string
  checkNumber: string
  invoiceNumber: string
}
