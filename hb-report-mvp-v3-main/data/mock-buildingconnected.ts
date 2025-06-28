import type { RFP, Vendor, Proposal, GCsAndGRs } from "@/types/estimating"

export const mockRFPs: RFP[] = [
  {
    id: "rfp-001",
    projectName: "Atlantic Fields Club Core",
    client: "Atlantic Fields Development",
    dateReceived: new Date("2024-01-15"),
    dueDate: new Date("2024-03-28"),
    status: "active",
    estimatedValue: 15000000,
    location: "Hobe Sound, FL",
    projectType: "Commercial Recreation",
    description: "Core construction for Atlantic Fields Club including clubhouse and amenities",
    estimator: "John Doe",
    grossSF: 86144,
    acSF: 70101,
    trades: ["Concrete", "Marine", "Electrical", "Plumbing"],
  },
  {
    id: "rfp-002",
    projectName: "Oceanview Residential Complex",
    client: "Coastal Properties LLC",
    dateReceived: new Date("2024-01-20"),
    dueDate: new Date("2024-04-15"),
    status: "active",
    estimatedValue: 22000000,
    location: "Jupiter, FL",
    projectType: "Multi-Family Residential",
    description: "Luxury residential complex with 120 units",
    estimator: "John Doe",
    grossSF: 145000,
    acSF: 125000,
    trades: ["General", "Electrical", "Plumbing", "HVAC"],
  },
  {
    id: "rfp-003",
    projectName: "Tech Campus Phase 1",
    client: "Innovation Hub Inc",
    dateReceived: new Date("2024-02-01"),
    dueDate: new Date("2024-05-01"),
    status: "submitted",
    estimatedValue: 35000000,
    location: "West Palm Beach, FL",
    projectType: "Commercial Office",
    description: "Modern tech campus with office and R&D facilities",
    estimator: "John Doe",
    grossSF: 200000,
    acSF: 180000,
    trades: ["General", "Electrical", "Data/Telecom", "HVAC", "Fire Protection"],
  },
]

export const mockVendors: Vendor[] = [
  // Concrete Vendors
  {
    id: "vendor-001",
    name: "Precision Concrete Solutions",
    trade: "Concrete",
    email: "bids@precisionconcrete.com",
    phone: "(561) 555-0101",
    rating: 4.8,
    previousProjects: 15,
    isPrequalified: true,
    contactPerson: "Mike Rodriguez",
  },
  {
    id: "vendor-002",
    name: "Atlantic Concrete Works",
    trade: "Concrete",
    email: "estimates@atlanticconcrete.com",
    phone: "(561) 555-0102",
    rating: 4.5,
    previousProjects: 12,
    isPrequalified: true,
    contactPerson: "Sarah Chen",
  },
  // Marine Vendors
  {
    id: "vendor-003",
    name: "Coastal Marine Construction",
    trade: "Marine",
    email: "bids@coastalmarine.com",
    phone: "(561) 555-0201",
    rating: 4.9,
    previousProjects: 8,
    isPrequalified: true,
    contactPerson: "David Thompson",
  },
  {
    id: "vendor-004",
    name: "SeaWorks Marine Services",
    trade: "Marine",
    email: "proposals@seaworks.com",
    phone: "(561) 555-0202",
    rating: 4.6,
    previousProjects: 10,
    isPrequalified: true,
    contactPerson: "Lisa Martinez",
  },
  // Electrical Vendors
  {
    id: "vendor-005",
    name: "PowerTech Electric",
    trade: "Electrical",
    email: "bids@powertech.com",
    phone: "(561) 555-0301",
    rating: 4.7,
    previousProjects: 25,
    isPrequalified: true,
    contactPerson: "Robert Johnson",
  },
  {
    id: "vendor-006",
    name: "Voltage Solutions Inc",
    trade: "Electrical",
    email: "estimates@voltagesolutions.com",
    phone: "(561) 555-0302",
    rating: 4.4,
    previousProjects: 18,
    isPrequalified: true,
    contactPerson: "Amanda Wilson",
  },
]

export const mockProposals: Proposal[] = [
  {
    id: "prop-001",
    rfpId: "rfp-001",
    vendorId: "vendor-001",
    trade: "Concrete",
    totalAmount: 850000,
    status: "submitted",
    submissionDate: new Date("2024-02-15"),
    items: [
      {
        id: "item-001",
        trade: "Concrete",
        description: "Foundation and Footings",
        quantity: 2500,
        unit: "CY",
        unitPrice: 180,
        totalPrice: 450000,
        formula: "=quantity*unitPrice",
      },
      {
        id: "item-002",
        trade: "Concrete",
        description: "Structural Slabs",
        quantity: 1800,
        unit: "CY",
        unitPrice: 220,
        totalPrice: 396000,
        formula: "=quantity*unitPrice",
      },
    ],
    notes: "Includes all materials, labor, and equipment",
  },
  {
    id: "prop-002",
    rfpId: "rfp-001",
    vendorId: "vendor-002",
    trade: "Concrete",
    totalAmount: 920000,
    status: "submitted",
    submissionDate: new Date("2024-02-18"),
    items: [
      {
        id: "item-003",
        trade: "Concrete",
        description: "Foundation and Footings",
        quantity: 2500,
        unit: "CY",
        unitPrice: 195,
        totalPrice: 487500,
        formula: "=quantity*unitPrice",
      },
      {
        id: "item-004",
        trade: "Concrete",
        description: "Structural Slabs",
        quantity: 1800,
        unit: "CY",
        unitPrice: 240,
        totalPrice: 432000,
        formula: "=quantity*unitPrice",
      },
    ],
  },
  {
    id: "prop-003",
    rfpId: "rfp-001",
    vendorId: "vendor-003",
    trade: "Marine",
    totalAmount: 1200000,
    status: "submitted",
    submissionDate: new Date("2024-02-20"),
    items: [
      {
        id: "item-005",
        trade: "Marine",
        description: "Dock Construction",
        quantity: 500,
        unit: "LF",
        unitPrice: 1800,
        totalPrice: 900000,
        formula: "=quantity*unitPrice",
      },
      {
        id: "item-006",
        trade: "Marine",
        description: "Seawall Repairs",
        quantity: 200,
        unit: "LF",
        unitPrice: 1500,
        totalPrice: 300000,
        formula: "=quantity*unitPrice",
      },
    ],
  },
]

export const mockGCsAndGRs: GCsAndGRs[] = [
  {
    id: "gc-001",
    rfpId: "rfp-001",
    description: "General Conditions - Site Management",
    amount: 125000,
    category: "general_conditions",
    notes: "Project management, site supervision, temporary facilities",
  },
  {
    id: "gc-002",
    rfpId: "rfp-001",
    description: "General Requirements - Insurance & Bonds",
    amount: 85000,
    category: "general_requirements",
    notes: "Performance bond, payment bond, general liability",
  },
  {
    id: "gc-003",
    rfpId: "rfp-001",
    description: "Overhead",
    amount: 150000,
    category: "overhead",
    notes: "Home office overhead allocation",
  },
  {
    id: "gc-004",
    rfpId: "rfp-001",
    description: "Profit",
    amount: 180000,
    category: "profit",
    notes: "Target profit margin 8%",
  },
]

// Mock API functions
export const mockBuildingConnectedAPI = {
  async getOpportunities(): Promise<RFP[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockRFPs
  },

  async getVendorsByTrade(trade: string): Promise<Vendor[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockVendors.filter((vendor) => vendor.trade === trade)
  },

  async getProposalsByRFP(rfpId: string): Promise<Proposal[]> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return mockProposals.filter((proposal) => proposal.rfpId === rfpId)
  },

  async submitBidInvitation(rfpId: string, vendorIds: string[]): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log(`Bid invitations sent for RFP ${rfpId} to vendors:`, vendorIds)
    return true
  },
}
