import type { PreConProject, EstimateMetrics, UpcomingDeadline, TradeParticipation } from "@/types/precon"

// Mapping for project names to mock-projects.ts IDs
const preconProjectNameToIdMap: { [key: string]: number } = {
  "Atlantic Fields Club Core": 501001,
  "Oceanview Medical Center": 501002,
  "Sunset Marina Expansion": 501003,
}

export const mockPreConProjects: PreConProject[] = [
  {
    id: "pc-501001",
    projectId: preconProjectNameToIdMap["Atlantic Fields Club Core"], // Linked to mock-projects.ts ID
    name: "Atlantic Fields Club Core",
    client: "Atlantic Fields Development LLC",
    projectType: "Commercial Recreation",
    estimatedValue: 86500000,
    status: "active",
    estimateDeadline: new Date("2025-03-15"),
    estimator: "Lisa Martinez",
    trades: ["General", "Concrete", "Marine", "Electrical", "Plumbing", "HVAC", "Landscaping"],
    subcontractorCount: 28,
    participationByTrade: {
      General: 8,
      Concrete: 5,
      Marine: 4,
      Electrical: 4,
      Plumbing: 3,
      HVAC: 2,
      Landscaping: 2,
    },
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: "pc-501002",
    projectId: preconProjectNameToIdMap["Oceanview Medical Center"], // Linked to mock-projects.ts ID
    name: "Oceanview Medical Center",
    client: "Jupiter Healthcare Systems",
    projectType: "Healthcare",
    estimatedValue: 125000000,
    status: "active",
    estimateDeadline: new Date("2025-04-30"),
    estimator: "John Doe",
    trades: ["General", "Electrical", "Plumbing", "HVAC", "Fire Protection", "Medical Equipment", "IT Systems"],
    subcontractorCount: 35,
    participationByTrade: {
      General: 10,
      Electrical: 6,
      Plumbing: 5,
      HVAC: 4,
      "Fire Protection": 3,
      "Medical Equipment": 4,
      "IT Systems": 3,
    },
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2025-01-20"),
  },
  {
    id: "pc-501003",
    projectId: preconProjectNameToIdMap["Sunset Marina Expansion"], // Linked to mock-projects.ts ID
    name: "Sunset Marina Expansion",
    client: "West Palm Marina Holdings",
    projectType: "Marine Infrastructure",
    estimatedValue: 45000000,
    status: "active",
    estimateDeadline: new Date("2025-03-31"),
    estimator: "Lisa Martinez",
    trades: ["General", "Marine", "Concrete", "Electrical", "Utilities"],
    subcontractorCount: 18,
    participationByTrade: {
      General: 6,
      Marine: 5,
      Concrete: 3,
      Electrical: 2,
      Utilities: 2,
    },
    createdAt: new Date("2024-11-15"),
    updatedAt: new Date("2025-01-10"),
  },
]

export const mockEstimateMetrics: EstimateMetrics = {
  totalEstimates: 24,
  estimatesThisYear: 8,
  estimatesThisQuarter: 3,
  estimatesThisMonth: 1,
  estimatesLastYear: 16,
  winRate: 72.5,
  averageEstimateValue: 85500000,
  averageSubcontractorParticipation: 27.0,
  totalAwarded: 5,
  totalSubmitted: 24,
}

export const mockUpcomingDeadlines: UpcomingDeadline[] = [
  {
    id: "dl-501001",
    projectId: preconProjectNameToIdMap["Atlantic Fields Club Core"], // Linked to mock-projects.ts ID
    projectName: "Atlantic Fields Club Core",
    client: "Atlantic Fields Development LLC",
    deadline: new Date("2025-03-15"),
    daysRemaining: 45,
    estimator: "Lisa Martinez",
    status: "warning",
  },
  {
    id: "dl-501003",
    projectId: preconProjectNameToIdMap["Sunset Marina Expansion"], // Linked to mock-projects.ts ID
    projectName: "Sunset Marina Expansion",
    client: "West Palm Marina Holdings",
    deadline: new Date("2025-03-31"),
    daysRemaining: 61,
    estimator: "Lisa Martinez",
    status: "normal",
  },
  {
    id: "dl-501002",
    projectId: preconProjectNameToIdMap["Oceanview Medical Center"], // Linked to mock-projects.ts ID
    projectName: "Oceanview Medical Center",
    client: "Jupiter Healthcare Systems",
    deadline: new Date("2025-04-30"),
    daysRemaining: 91,
    estimator: "John Doe",
    status: "normal",
  },
]

export const mockTradeParticipation: TradeParticipation[] = [
  {
    trade: "General Contractors",
    averageParticipation: 8.0,
    totalProjects: 24,
    topSubcontractors: ["ABC Construction", "BuildRight Inc", "Premier Builders"],
  },
  {
    trade: "Concrete",
    averageParticipation: 4.3,
    totalProjects: 20,
    topSubcontractors: ["Precision Concrete Solutions", "Atlantic Concrete Works", "Coastal Concrete"],
  },
  {
    trade: "Electrical",
    averageParticipation: 4.0,
    totalProjects: 22,
    topSubcontractors: ["PowerTech Electric", "Voltage Solutions", "Current Electric"],
  },
  {
    trade: "Marine",
    averageParticipation: 4.5,
    totalProjects: 8,
    topSubcontractors: ["Coastal Marine Construction", "SeaWorks Marine Services", "Atlantic Marine"],
  },
  {
    trade: "HVAC",
    averageParticipation: 3.2,
    totalProjects: 18,
    topSubcontractors: ["Climate Control Inc", "AirFlow Systems", "TempTech Solutions"],
  },
]
