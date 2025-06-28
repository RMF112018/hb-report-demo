import type { LucideIcon } from "lucide-react"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "c-suite" | "project-executive" | "project-manager" | "estimator" | "admin" | "field-supervisor" | "accountant"
  company: string
  createdAt: string
  lastLogin?: string | null
  isActive: boolean
  phone?: string
  department?: string
  permissions?: {
    preConAccess?: boolean
  }
}

export interface Project {
  id: number
  name: string
  status: string
  streetAddress: string
  city: string
  state: string
  zip: string
  startDate: string
  contractEndDate: string
  contractValue: number
  managerId: string
  type: string
  description: string
  progress: number
  riskLevel: string
  stage: string // Added stage
}

export interface Permit {
  id: string
  projectId: number // Added projectId
  permitType: string
  status: "Approved" | "Pending" | "Rejected" | "Expired"
  issueDate: string
  expirationDate: string
  agency: string
  notes: string
  documents: string[]
  fees: number
  inspector: string
  lastUpdated: string
}

export interface Inspection {
  id: string
  permitId: string
  type: string
  date: string
  result: "passed" | "failed" | "conditional"
  inspector: string
  comments?: string
  scheduledDate?: string
  completedDate?: string
  photos?: string[]
  deficiencies?: string[]
}

export interface PermitDocument {
  id: string
  permitId: string
  name: string
  type: "application" | "approval" | "inspection" | "certificate" | "other"
  url: string
  uploadDate: string
  size: number
}

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof LucideIcon
  label?: string
  description?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithProps extends NavItem {
  props?: Record<string, any>
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export interface MarketingConfig {
  mainNav: MainNavItem[]
}

export interface DashboardConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export interface SubscriptionPlan {
  name: string
  description: string
  stripePriceId: string
}

export interface UserSubscriptionPlan extends SubscriptionPlan {
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
  stripeCurrentPeriodEnd?: string | null
  stripeProductId?: string | null
  isPro: boolean
}

export interface Issue {
  id: string
  projectId: number // Added projectId
  type: "RFI" | "Submittal" | "Change Order" | "Safety Incident" | "Quality Issue"
  status: "Open" | "Closed" | "Pending" | "In Review"
  priority: "High" | "Medium" | "Low"
  title: string
  description: string
  assignedTo: string
  dueDate: string
  createdAt: string
  updatedAt: string
  comments: {
    id: string
    userId: string
    comment: string
    timestamp: string
  }[]
  attachments: string[]
}

export interface Commitment {
  id: string
  projectId: number // Added projectId
  vendorName: string
  trade: string
  contractAmount: number
  committedAmount: number
  status: "Executed" | "Pending" | "Draft" | "Closed"
  issueDate: string
  dueDate: string
  description: string
  paymentTerms: string
  changeOrders: {
    id: string
    description: string
    amount: number
    status: "Approved" | "Pending" | "Rejected"
  }[]
  invoices: {
    id: string
    amount: number
    status: "Paid" | "Pending" | "Overdue"
    date: string
  }[]
}
