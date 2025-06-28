export type RFPStatus = "active" | "archived" | "awarded" | "lost"

export interface RFP {
  id: string
  projectName: string
  client: string
  dateReceived: Date
  dueDate: Date
  status: RFPStatus
  estimatedValue: number
  location: string
  projectType: string
  description: string
  estimator: string
  grossSF: number
  acSF: number
  trades: string[]
  buildingHeight: number
  floors: number
  constructionType: string
  duration: number
  riskFactors: string[]
  keyRequirements: string[]
  siteConditions: string
  accessRestrictions: string
  projectId: number // Added projectId
}

export type VendorTrade =
  | "General"
  | "Concrete"
  | "Marine"
  | "Electrical"
  | "Plumbing"
  | "HVAC"
  | "Fire Protection"
  | "Medical Equipment"
  | "IT Systems"
  | "Utilities"
  | "Structural"
  | "Architectural"
  | "Site Work"
  | "Landscaping"
  | "High-End Finishes"
  | "Specialized Equipment"
  | "Specialized Medical"
  | "Technology"
  | "Specialized Lab"
  | "Research Equipment"

export interface Vendor {
  id: string
  name: string
  trade: VendorTrade
  email: string
  phone: string
  rating: number
  previousProjects: number
  isPrequalified: boolean
  contactPerson: string
  capabilities: string[]
  certifications: string[]
  bondingCapacity: number
  yearEstablished: number
  employees: number
  equipment: string[]
}

export interface ProposalItem {
  id: string
  trade: VendorTrade
  description: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  formula: string
  category: string
  includes: string[]
  excludes: string[]
  notes: string
  laborHours: number
  materialCost: number
  laborCost: number
}

export interface Proposal {
  id: string
  rfpId: string
  vendorId: string
  trade: VendorTrade
  totalAmount: number
  status: "submitted" | "pending" | "awarded" | "rejected"
  submissionDate: Date
  validUntil: Date
  items: ProposalItem[]
  notes: string
  assumptions: string[]
  alternates: { id: string; description: string; amount: number; notes: string }[]
  schedule: {
    mobilization: number
    duration: number
    completion: Date
  }
}
