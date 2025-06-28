import type { RFP, Vendor, Proposal } from "@/types/estimating"

// Mapping for project names to mock-projects.ts IDs
const projectNameToIdMap: { [key: string]: number } = {
  "Atlantic Fields Club Core": 501001,
  "Oceanview Medical Center": 501002,
  "Sunset Marina Expansion": 501003,
  "Tech Campus Phase 1": 401004,
  "Residential Tower Complex": 401002, // Mapping to Panther Tower South as a similar large project
}

// Enhanced RFP data with comprehensive project information
export const enhancedMockRFPs: RFP[] = [
  {
    id: "rfp-001",
    projectName: "Atlantic Fields Club Core",
    client: "Atlantic Fields Development LLC",
    dateReceived: new Date("2024-01-15"),
    dueDate: new Date("2024-03-28"),
    status: "active",
    estimatedValue: 15750000,
    location: "Hobe Sound, FL",
    projectType: "Commercial Recreation",
    description:
      "Luxury golf club core facilities including clubhouse, pro shop, dining facilities, and member amenities with marine components",
    estimator: "John Doe",
    grossSF: 86144,
    acSF: 70101,
    trades: ["Concrete", "Marine", "Electrical", "Plumbing", "HVAC", "Landscaping"],
    buildingHeight: 45,
    floors: 3,
    constructionType: "Type II-B",
    duration: 12,
    riskFactors: ["Marine environment", "High-end finishes", "Complex MEP systems"],
    keyRequirements: ["LEED Silver certification", "Hurricane-rated construction", "Premium materials"],
    siteConditions: "Waterfront location with existing utilities",
    accessRestrictions: "Limited construction hours due to residential proximity",
    projectId: projectNameToIdMap["Atlantic Fields Club Core"], // Linked to mock-projects.ts ID
  },
  {
    id: "rfp-002",
    projectName: "Oceanview Medical Center",
    client: "Coastal Healthcare Systems",
    dateReceived: new Date("2024-01-20"),
    dueDate: new Date("2024-04-15"),
    status: "active",
    estimatedValue: 28500000,
    location: "Jupiter, FL",
    projectType: "Healthcare",
    description:
      "State-of-the-art medical facility with emergency services, surgical suites, outpatient clinics, and diagnostic imaging",
    estimator: "John Doe",
    grossSF: 125000,
    acSF: 110000,
    trades: ["General", "Electrical", "Plumbing", "HVAC", "Fire Protection", "Medical Equipment"],
    buildingHeight: 65,
    floors: 4,
    constructionType: "Type I-A",
    duration: 18,
    riskFactors: ["Complex MEP systems", "Medical equipment integration", "Strict code requirements"],
    keyRequirements: ["Joint Commission compliance", "Seismic design", "Backup power systems"],
    siteConditions: "Urban location with utility coordination required",
    accessRestrictions: "Phased construction to maintain adjacent facility operations",
    projectId: projectNameToIdMap["Oceanview Medical Center"], // Linked to mock-projects.ts ID
  },
  {
    id: "rfp-003",
    projectName: "Sunset Marina Expansion",
    client: "Marina Holdings Inc",
    dateReceived: new Date("2024-02-01"),
    dueDate: new Date("2024-05-01"),
    status: "active",
    estimatedValue: 12200000,
    location: "West Palm Beach, FL",
    projectType: "Marine Infrastructure",
    description:
      "Marina expansion with 200 additional slips, waterfront amenities, marine services facility, and fuel dock",
    estimator: "John Doe",
    grossSF: 75000,
    acSF: 65000,
    trades: ["General", "Marine", "Concrete", "Electrical", "Utilities"],
    buildingHeight: 35,
    floors: 2,
    constructionType: "Type V-A",
    duration: 16,
    riskFactors: ["Marine construction", "Tidal considerations", "Environmental permits"],
    keyRequirements: ["FDEP permits", "USACE coordination", "Hurricane-rated design"],
    siteConditions: "Active marina with ongoing operations",
    accessRestrictions: "Work must accommodate existing marina operations",
    projectId: projectNameToIdMap["Sunset Marina Expansion"], // Linked to mock-projects.ts ID
  },
  {
    id: "rfp-004",
    projectName: "Tech Campus Phase 1",
    client: "Innovation Hub Inc",
    dateReceived: new Date("2024-02-10"),
    dueDate: new Date("2024-06-01"),
    status: "active",
    estimatedValue: 45000000,
    location: "Boca Raton, FL",
    projectType: "Commercial Office",
    description:
      "Modern tech campus with office buildings, R&D facilities, collaborative spaces, and advanced technology infrastructure",
    estimator: "John Doe",
    grossSF: 200000,
    acSF: 180000,
    trades: ["General", "Electrical", "Data/Telecom", "HVAC", "Fire Protection", "Elevators"],
    buildingHeight: 80,
    floors: 6,
    constructionType: "Type I-A",
    duration: 18,
    riskFactors: ["Complex technology systems", "Fast-track schedule", "High-performance building"],
    keyRequirements: ["LEED Platinum", "Advanced data infrastructure", "Flexible floor plates"],
    siteConditions: "Greenfield site with new utility connections",
    accessRestrictions: "Standard construction hours",
    projectId: projectNameToIdMap["Tech Campus Phase 1"], // Linked to mock-projects.ts ID
  },
  {
    id: "rfp-005",
    projectName: "Residential Tower Complex",
    client: "Luxury Living Developers",
    dateReceived: new Date("2024-02-15"),
    dueDate: new Date("2024-07-15"),
    status: "active",
    estimatedValue: 85000000,
    location: "Fort Lauderdale, FL",
    projectType: "Multi-Family Residential",
    description: "Luxury residential towers with 300 units, amenities, underground parking, and waterfront views",
    estimator: "John Doe",
    grossSF: 350000,
    acSF: 320000,
    trades: ["General", "Concrete", "Steel", "Electrical", "Plumbing", "HVAC", "Elevators", "Fire Protection"],
    buildingHeight: 250,
    floors: 25,
    constructionType: "Type I-A",
    duration: 30,
    riskFactors: ["High-rise construction", "Luxury finishes", "Coastal location"],
    keyRequirements: ["Hurricane-rated design", "Premium amenities", "Underground parking"],
    siteConditions: "Urban waterfront with existing structures to demolish",
    accessRestrictions: "Limited laydown area, crane coordination required",
    projectId: projectNameToIdMap["Residential Tower Complex"], // Linked to mock-projects.ts ID
  },
]

// Enhanced vendor database with detailed capabilities
export const enhancedMockVendors: Vendor[] = [
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
    capabilities: ["Structural concrete", "Decorative concrete", "Marine concrete"],
    certifications: ["ACI certified", "FDOT approved"],
    bondingCapacity: 5000000,
    yearEstablished: 1995,
    employees: 45,
    equipment: ["Concrete pumps", "Finishing equipment", "Testing lab"],
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
    capabilities: ["Foundation work", "Structural concrete", "Site concrete"],
    certifications: ["ACI certified"],
    bondingCapacity: 3000000,
    yearEstablished: 2001,
    employees: 32,
    equipment: ["Mobile mixers", "Pumping equipment"],
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
    capabilities: ["Dock construction", "Seawall repair", "Marine piling"],
    certifications: ["USACE approved", "FDEP certified"],
    bondingCapacity: 10000000,
    yearEstablished: 1988,
    employees: 28,
    equipment: ["Marine cranes", "Pile drivers", "Work barges"],
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
    capabilities: ["Marina construction", "Waterfront development", "Marine utilities"],
    certifications: ["USACE approved"],
    bondingCapacity: 7500000,
    yearEstablished: 1992,
    employees: 35,
    equipment: ["Floating equipment", "Diving services", "Marine welding"],
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
    capabilities: ["Commercial electrical", "Industrial systems", "Emergency power"],
    certifications: ["NECA member", "IBEW contractors"],
    bondingCapacity: 8000000,
    yearEstablished: 1985,
    employees: 65,
    equipment: ["Bucket trucks", "Cable pulling equipment", "Testing equipment"],
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
    capabilities: ["Low voltage systems", "Data/telecom", "Security systems"],
    certifications: ["BICSI certified", "Manufacturer certified"],
    bondingCapacity: 4000000,
    yearEstablished: 1998,
    employees: 28,
    equipment: ["Cable testing", "Fiber optic equipment", "Specialized tools"],
  },
  // Additional vendors for other trades
  {
    id: "vendor-007",
    name: "AquaFlow Plumbing",
    trade: "Plumbing",
    email: "bids@aquaflow.com",
    phone: "(561) 555-0401",
    rating: 4.6,
    previousProjects: 20,
    isPrequalified: true,
    contactPerson: "Carlos Rivera",
    capabilities: ["Commercial plumbing", "Medical gas systems", "Water treatment"],
    certifications: ["State licensed", "Medical gas certified"],
    bondingCapacity: 3500000,
    yearEstablished: 1990,
    employees: 38,
    equipment: ["Pipe threading", "Hydro-jetting", "Camera inspection"],
  },
  {
    id: "vendor-008",
    name: "Climate Control Systems",
    trade: "HVAC",
    email: "estimates@climatecontrol.com",
    phone: "(561) 555-0501",
    rating: 4.8,
    previousProjects: 22,
    isPrequalified: true,
    contactPerson: "Jennifer Park",
    capabilities: ["Commercial HVAC", "Clean room systems", "Energy management"],
    certifications: ["NATE certified", "EPA certified"],
    bondingCapacity: 6000000,
    yearEstablished: 1987,
    employees: 52,
    equipment: ["Sheet metal shop", "Duct cleaning", "Testing equipment"],
  },
]

// Enhanced proposal data with detailed line items
export const enhancedMockProposals: Proposal[] = [
  {
    id: "prop-001",
    rfpId: "rfp-001",
    vendorId: "vendor-001",
    trade: "Concrete",
    totalAmount: 1250000,
    status: "submitted",
    submissionDate: new Date("2024-02-15"),
    validUntil: new Date("2024-04-15"),
    items: [
      {
        id: "item-001",
        trade: "Concrete",
        description: "Stabilized Subgrade",
        quantity: 15000,
        unit: "SY",
        unitPrice: 5.25,
        totalPrice: 78750,
        formula: "=quantity*unitPrice",
        category: "Site Preparation",
        includes: ["Material delivery", "Placement", "Compaction", "Testing"],
        excludes: ["Excavation", "Utilities", "Permits"],
        notes: 'Price includes 6" stabilized base with geotextile fabric',
        laborHours: 300,
        materialCost: 52500,
        laborCost: 26250,
      },
      {
        id: "item-002",
        trade: "Concrete",
        description: "Foundation Footings",
        quantity: 450,
        unit: "CY",
        unitPrice: 195,
        totalPrice: 87750,
        formula: "=quantity*unitPrice",
        category: "Foundations",
        includes: ["Concrete", "Rebar", "Forms", "Labor", "Finishing"],
        excludes: ["Excavation", "Waterproofing", "Anchor bolts"],
        notes: '4000 PSI concrete with #4 rebar @ 12" O.C.',
        laborHours: 720,
        materialCost: 61425,
        laborCost: 26325,
      },
      {
        id: "item-003",
        trade: "Concrete",
        description: "Structural Slabs",
        quantity: 12500,
        unit: "SF",
        unitPrice: 9.5,
        totalPrice: 118750,
        formula: "=quantity*unitPrice",
        category: "Structure",
        includes: ["Concrete", "Rebar", "Finishing", "Curing"],
        excludes: ["Post-tensioning", "Special finishes", "Saw cutting"],
        notes: '6" slab with WWF 6x6-W2.9xW2.9',
        laborHours: 950,
        materialCost: 83125,
        laborCost: 35625,
      },
    ],
    notes: "All prices include materials, labor, and equipment. Excludes permits and testing.",
    assumptions: ["Normal soil conditions", "Standard working hours", "Material availability"],
    alternates: [
      {
        id: "alt-001",
        description: "Upgrade to 5000 PSI concrete for footings",
        amount: 8500,
        notes: "Add $8,500 for higher strength concrete",
      },
    ],
    schedule: {
      mobilization: 3,
      duration: 45,
      completion: new Date("2024-06-15"),
    },
  },
]

// AI-powered cost prediction data
export const aiCostPredictions = {
  "rfp-001": {
    totalPrediction: 14750000,
    confidence: 85,
    factors: [
      { name: "Market conditions", impact: 0.03, description: "Current material costs trending up" },
      { name: "Project complexity", impact: 0.05, description: "Marine components add complexity" },
      { name: "Location factor", impact: -0.02, description: "Good contractor availability in area" },
      { name: "Schedule", impact: 0.01, description: "Reasonable timeline" },
    ],
    tradeBreakdown: {
      Concrete: { predicted: 1200000, confidence: 90, variance: 0.08 },
      Marine: { predicted: 950000, confidence: 75, variance: 0.15 },
      Electrical: { predicted: 850000, confidence: 85, variance: 0.1 },
      Plumbing: { predicted: 650000, confidence: 88, variance: 0.07 },
      HVAC: { predicted: 750000, confidence: 82, variance: 0.12 },
      Landscaping: { predicted: 350000, confidence: 80, variance: 0.1 },
    },
    recommendations: [
      "Consider early procurement for marine materials",
      "Verify soil conditions to avoid concrete overruns",
      "Lock in electrical pricing due to copper volatility",
    ],
  },
}

// Enhanced API with comprehensive functionality
export const enhancedBuildingConnectedAPI = {
  // Get all opportunities with enhanced filtering
  async getOpportunities(filters?: {
    status?: string
    projectType?: string
    location?: string
    estimator?: string
  }): Promise<RFP[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredRFPs = [...enhancedMockRFPs]

    if (filters) {
      if (filters.status) {
        filteredRFPs = filteredRFPs.filter((rfp) => rfp.status === filters.status)
      }
      if (filters.projectType) {
        filteredRFPs = filteredRFPs.filter((rfp) => rfp.projectType === filters.projectType)
      }
      if (filters.location) {
        filteredRFPs = filteredRFPs.filter((rfp) => rfp.location.includes(filters.location))
      }
      if (filters.estimator) {
        filteredRFPs = filteredRFPs.filter((rfp) => rfp.estimator === filters.estimator)
      }
    }

    return filteredRFPs
  },

  // Get vendors by trade with enhanced filtering
  async getVendorsByTrade(
    trade: string,
    filters?: {
      prequalified?: boolean
      minRating?: number
      maxDistance?: number
    },
  ): Promise<Vendor[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    let vendors = enhancedMockVendors.filter((vendor) => vendor.trade === trade)

    if (filters) {
      if (filters.prequalified !== undefined) {
        vendors = vendors.filter((v) => v.isPrequalified === filters.prequalified)
      }
      if (filters.minRating) {
        vendors = vendors.filter((v) => v.rating >= filters.minRating)
      }
    }

    return vendors
  },

  // Get proposals with detailed information
  async getProposalsByRFP(rfpId: string): Promise<Proposal[]> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return enhancedMockProposals.filter((proposal) => proposal.rfpId === rfpId)
  },

  // Submit bid invitation with tracking
  async submitBidInvitation(
    rfpId: string,
    vendorIds: string[],
    message?: string,
  ): Promise<{
    success: boolean
    invitationId: string
    sentCount: number
    failedCount: number
  }> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const invitationId = `inv-${Date.now()}`
    const sentCount = vendorIds.length
    const failedCount = 0

    console.log(`Bid invitations sent for RFP ${rfpId}:`, {
      invitationId,
      vendorIds,
      message,
      sentCount,
    })

    return {
      success: true,
      invitationId,
      sentCount,
      failedCount,
    }
  },

  // Get AI cost predictions
  async getCostPredictions(rfpId: string): Promise<(typeof aiCostPredictions)[keyof typeof aiCostPredictions]> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return aiCostPredictions[rfpId as keyof typeof aiCostPredictions] || null
  },

  // Save project data
  async saveProjectData(projectId: string, data: any): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    console.log(`Saving project data for ${projectId}:`, data)
    return true
  },

  // Export bid package
  async exportBidPackage(
    rfpId: string,
    format: "pdf" | "excel",
  ): Promise<{
    success: boolean
    downloadUrl: string
    fileName: string
  }> {
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const fileName = `bid-package-${rfpId}.${format}`
    const downloadUrl = `/api/downloads/${fileName}`

    return {
      success: true,
      downloadUrl,
      fileName,
    }
  },

  // Real-time collaboration features
  async getProjectCollaborators(projectId: string): Promise<
    Array<{
      userId: string
      name: string
      role: string
      status: "online" | "offline"
      lastSeen: Date
    }>
  > {
    await new Promise((resolve) => setTimeout(resolve, 200))

    return [
      {
        userId: "user-001",
        name: "John Doe",
        role: "Estimator",
        status: "online",
        lastSeen: new Date(),
      },
      {
        userId: "user-002",
        name: "Sarah Johnson",
        role: "Project Executive",
        status: "offline",
        lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
      },
    ]
  },

  // Submit comment or note
  async submitComment(projectId: string, section: string, comment: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    console.log(`Comment submitted for ${projectId} in ${section}:`, comment)
    return true
  },
}
