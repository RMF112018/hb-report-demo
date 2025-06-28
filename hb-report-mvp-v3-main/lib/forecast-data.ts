export interface ForecastRecord {
  subJob: string
  costCodeTier1: string
  costCodeTier2: string
  costCodeTier3: string
  costType: string
  budgetCode: string
  budgetCodeDescription: string
  startDate: string
  endDate: string
  curve: string
  approvedCOs: number
  revisedBudget: number
  projectedBudget: number
  projectedCosts: number
  estimatedCostAtCompletion: number
  jobToDateCosts: number
  projectedCostToComplete: number
  forecastToComplete: number
  projectedOverUnder: number
  remaining: number
  monthlyForecasts: Record<string, number>
}

export interface DualRowData {
  id: string
  costCode: string
  description: string
  status: "on-track" | "at-risk" | "over-budget"
  previous: {
    startDate: Date
    endDate: Date
    revisedBudget: number
    estimatedCostAtCompletion: number
    projectedOverUnder: number
    monthlyValues: Record<string, number>
  }
  current: {
    startDate: Date
    endDate: Date
    revisedBudget: number
    estimatedCostAtCompletion: number
    jobToDateCosts: number
    projectedCostToComplete: number
    projectedOverUnder: number
    forecastMethod: "Bell Curve" | "S-Curve" | "Linear" | "Manual"
    monthlyValues: Record<string, number>
  }
  variance: {
    startDateDays: number
    endDateDays: number
    monthlyValues: Record<string, number>
  }
}

// Generate comprehensive forecast data for all projects
export const generateProjectForecastData = (projectId: number): ForecastRecord[] => {
  const baseData: Partial<ForecastRecord>[] = []

  // Project-specific cost codes and data
  switch (projectId) {
    case 401001: // Tropical World Nursery
      baseData.push(
        {
          subJob: "1000 - TROPICAL WORLD NURSERY-CONSTR",
          costCodeTier1: "01 - GENERAL CONDITIONS",
          costCodeTier2: "01-01 - SUPERVISION",
          costCodeTier3: "01-01-100 - PROJECT MANAGER",
          costType: "LAB - Labor",
          budgetCode: "1000.01-01-100.LAB",
          budgetCodeDescription: "TROPICAL WORLD NURSERY-CONSTR.PROJECT MANAGER.Labor",
          revisedBudget: 429821.52,
          estimatedCostAtCompletion: 371437.74,
          jobToDateCosts: 156789.23,
          projectedOverUnder: -58383.78,
        },
        {
          subJob: "1000 - TROPICAL WORLD NURSERY-CONSTR",
          costCodeTier1: "01 - GENERAL CONDITIONS",
          costCodeTier2: "01-01 - SUPERVISION",
          costCodeTier3: "01-01-200 - SUPERINTENDENT",
          costType: "LAB - Labor",
          budgetCode: "1000.01-01-200.LAB",
          budgetCodeDescription: "TROPICAL WORLD NURSERY-CONSTR.SUPERINTENDENT.Labor",
          revisedBudget: 262285.15,
          estimatedCostAtCompletion: 249731.37,
          jobToDateCosts: 98456.78,
          projectedOverUnder: -12553.78,
        },
        {
          subJob: "1000 - TROPICAL WORLD NURSERY-CONSTR",
          costCodeTier1: "03 - CONCRETE",
          costCodeTier2: "03-10 - CONCRETE FORMING",
          costCodeTier3: "03-10-100 - FOUNDATION FORMS",
          costType: "MAT - Materials",
          budgetCode: "1000.03-10-100.MAT",
          budgetCodeDescription: "TROPICAL WORLD NURSERY-CONSTR.FOUNDATION FORMS.Materials",
          revisedBudget: 185000.0,
          estimatedCostAtCompletion: 178500.0,
          jobToDateCosts: 125000.0,
          projectedOverUnder: -6500.0,
        },
        {
          subJob: "1000 - TROPICAL WORLD NURSERY-CONSTR",
          costCodeTier1: "15 - MECHANICAL",
          costCodeTier2: "15-02 - HVAC SYSTEMS",
          costCodeTier3: "15-02-010 - HVAC EQUIPMENT",
          costType: "EQP - Equipment",
          budgetCode: "1000.15-02-010.EQP",
          budgetCodeDescription: "TROPICAL WORLD NURSERY-CONSTR.HVAC EQUIPMENT.Equipment",
          revisedBudget: 125000.0,
          estimatedCostAtCompletion: 132000.0,
          jobToDateCosts: 45000.0,
          projectedOverUnder: 7000.0,
        },
      )
      break

    case 401002: // Panther Tower South
      baseData.push(
        {
          subJob: "2000 - PANTHER TOWER SOUTH",
          costCodeTier1: "03 - CONCRETE",
          costCodeTier2: "03-30 - CAST-IN-PLACE CONCRETE",
          costCodeTier3: "03-30-100 - STRUCTURAL CONCRETE",
          costType: "MAT - Materials",
          budgetCode: "2000.03-30-100.MAT",
          budgetCodeDescription: "PANTHER TOWER SOUTH.STRUCTURAL CONCRETE.Materials",
          revisedBudget: 8500000.0,
          estimatedCostAtCompletion: 8750000.0,
          jobToDateCosts: 4250000.0,
          projectedOverUnder: 250000.0,
        },
        {
          subJob: "2000 - PANTHER TOWER SOUTH",
          costCodeTier1: "05 - METALS",
          costCodeTier2: "05-12 - STRUCTURAL STEEL",
          costCodeTier3: "05-12-100 - STEEL FRAMING",
          costType: "MAT - Materials",
          budgetCode: "2000.05-12-100.MAT",
          budgetCodeDescription: "PANTHER TOWER SOUTH.STEEL FRAMING.Materials",
          revisedBudget: 15500000.0,
          estimatedCostAtCompletion: 15200000.0,
          jobToDateCosts: 8750000.0,
          projectedOverUnder: -300000.0,
        },
        {
          subJob: "2000 - PANTHER TOWER SOUTH",
          costCodeTier1: "16 - ELECTRICAL",
          costCodeTier2: "16-05 - ELECTRICAL SYSTEMS",
          costCodeTier3: "16-05-100 - POWER DISTRIBUTION",
          costType: "LAB - Labor",
          budgetCode: "2000.16-05-100.LAB",
          budgetCodeDescription: "PANTHER TOWER SOUTH.POWER DISTRIBUTION.Labor",
          revisedBudget: 2850000.0,
          estimatedCostAtCompletion: 2950000.0,
          jobToDateCosts: 1200000.0,
          projectedOverUnder: 100000.0,
        },
      )
      break

    case 401003: // Riverside Apartments Phase II
      baseData.push(
        {
          subJob: "3000 - RIVERSIDE APARTMENTS PHASE II",
          costCodeTier1: "06 - WOOD & PLASTICS",
          costCodeTier2: "06-10 - ROUGH CARPENTRY",
          costCodeTier3: "06-10-100 - WOOD FRAMING",
          costType: "MAT - Materials",
          budgetCode: "3000.06-10-100.MAT",
          budgetCodeDescription: "RIVERSIDE APARTMENTS PHASE II.WOOD FRAMING.Materials",
          revisedBudget: 1850000.0,
          estimatedCostAtCompletion: 1825000.0,
          jobToDateCosts: 1650000.0,
          projectedOverUnder: -25000.0,
        },
        {
          subJob: "3000 - RIVERSIDE APARTMENTS PHASE II",
          costCodeTier1: "15 - MECHANICAL",
          costCodeTier2: "15-02 - HVAC SYSTEMS",
          costCodeTier3: "15-02-200 - HVAC INSTALLATION",
          costType: "SUB - Subcontractor",
          budgetCode: "3000.15-02-200.SUB",
          budgetCodeDescription: "RIVERSIDE APARTMENTS PHASE II.HVAC INSTALLATION.Subcontractor",
          revisedBudget: 2850000.0,
          estimatedCostAtCompletion: 2825000.0,
          jobToDateCosts: 1995000.0,
          projectedOverUnder: -25000.0,
        },
      )
      break

    case 401004: // Tech Campus Innovation Hub
      baseData.push(
        {
          subJob: "4000 - TECH CAMPUS INNOVATION HUB",
          costCodeTier1: "27 - COMMUNICATIONS",
          costCodeTier2: "27-10 - DATA SYSTEMS",
          costCodeTier3: "27-10-100 - NETWORK INFRASTRUCTURE",
          costType: "SUB - Subcontractor",
          budgetCode: "4000.27-10-100.SUB",
          budgetCodeDescription: "TECH CAMPUS INNOVATION HUB.NETWORK INFRASTRUCTURE.Subcontractor",
          revisedBudget: 3200000.0,
          estimatedCostAtCompletion: 3150000.0,
          jobToDateCosts: 2880000.0,
          projectedOverUnder: -50000.0,
        },
        {
          subJob: "4000 - TECH CAMPUS INNOVATION HUB",
          costCodeTier1: "21 - FIRE SUPPRESSION",
          costCodeTier2: "21-13 - FIRE SPRINKLER SYSTEMS",
          costCodeTier3: "21-13-100 - SPRINKLER INSTALLATION",
          costType: "SUB - Subcontractor",
          budgetCode: "4000.21-13-100.SUB",
          budgetCodeDescription: "TECH CAMPUS INNOVATION HUB.SPRINKLER INSTALLATION.Subcontractor",
          revisedBudget: 1450000.0,
          estimatedCostAtCompletion: 1425000.0,
          jobToDateCosts: 1305000.0,
          projectedOverUnder: -25000.0,
        },
      )
      break

    case 401005: // Coastal Elementary School
      baseData.push(
        {
          subJob: "5000 - COASTAL ELEMENTARY SCHOOL",
          costCodeTier1: "04 - MASONRY",
          costCodeTier2: "04-20 - UNIT MASONRY",
          costCodeTier3: "04-20-100 - CONCRETE MASONRY",
          costType: "MAT - Materials",
          budgetCode: "5000.04-20-100.MAT",
          budgetCodeDescription: "COASTAL ELEMENTARY SCHOOL.CONCRETE MASONRY.Materials",
          revisedBudget: 850000.0,
          estimatedCostAtCompletion: 835000.0,
          jobToDateCosts: 425000.0,
          projectedOverUnder: -15000.0,
        },
        {
          subJob: "5000 - COASTAL ELEMENTARY SCHOOL",
          costCodeTier1: "22 - PLUMBING",
          costCodeTier2: "22-10 - PLUMBING SYSTEMS",
          costCodeTier3: "22-10-100 - PLUMBING INSTALLATION",
          costType: "SUB - Subcontractor",
          budgetCode: "5000.22-10-100.SUB",
          budgetCodeDescription: "COASTAL ELEMENTARY SCHOOL.PLUMBING INSTALLATION.Subcontractor",
          revisedBudget: 850000.0,
          estimatedCostAtCompletion: 840000.0,
          jobToDateCosts: 425000.0,
          projectedOverUnder: -10000.0,
        },
      )
      break

    default:
      // Default data for preconstruction projects
      baseData.push({
        subJob: `${projectId} - PROJECT PLANNING`,
        costCodeTier1: "01 - GENERAL CONDITIONS",
        costCodeTier2: "01-01 - PRECONSTRUCTION",
        costCodeTier3: "01-01-500 - ESTIMATING",
        costType: "LAB - Labor",
        budgetCode: `${projectId}.01-01-500.LAB`,
        budgetCodeDescription: "PROJECT PLANNING.ESTIMATING.Labor",
        revisedBudget: 125000.0,
        estimatedCostAtCompletion: 120000.0,
        jobToDateCosts: 45000.0,
        projectedOverUnder: -5000.0,
      })
  }

  // Complete the forecast records with common fields and monthly data
  return baseData.map((item, index) => {
    const startDate = new Date(2024, 9, 1) // October 2024
    const endDate = new Date(2026, 2, 31) // March 2026

    // Generate monthly forecast data
    const monthlyForecasts: Record<string, number> = {}
    const months = [
      "Oct-24",
      "Nov-24",
      "Dec-24",
      "Jan-25",
      "Feb-25",
      "Mar-25",
      "Apr-25",
      "May-25",
      "Jun-25",
      "Jul-25",
      "Aug-25",
      "Sep-25",
      "Oct-25",
      "Nov-25",
      "Dec-25",
      "Jan-26",
      "Feb-26",
      "Mar-26",
    ]

    const totalBudget = item.revisedBudget || 100000
    const monthlyBase = totalBudget / 18 // Spread over 18 months

    months.forEach((month, idx) => {
      // Create bell curve distribution
      const progress = idx / (months.length - 1)
      const bellCurve = Math.exp(-Math.pow((progress - 0.5) * 4, 2))
      monthlyForecasts[month] = Math.round(monthlyBase * (0.5 + bellCurve))
    })

    return {
      subJob: item.subJob || `Project ${projectId}`,
      costCodeTier1: item.costCodeTier1 || "01 - GENERAL CONDITIONS",
      costCodeTier2: item.costCodeTier2 || "01-01 - SUPERVISION",
      costCodeTier3: item.costCodeTier3 || "01-01-100 - MANAGEMENT",
      costType: item.costType || "LAB - Labor",
      budgetCode: item.budgetCode || `${projectId}.01-01-100.LAB`,
      budgetCodeDescription: item.budgetCodeDescription || "Project Management Labor",
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      curve: ["Bell", "Linear", "S-Curve"][index % 3],
      approvedCOs: Math.random() * 50000,
      revisedBudget: item.revisedBudget || 100000,
      projectedBudget: (item.revisedBudget || 100000) * 0.95,
      projectedCosts: item.jobToDateCosts || 0,
      estimatedCostAtCompletion: item.estimatedCostAtCompletion || 100000,
      jobToDateCosts: item.jobToDateCosts || 0,
      projectedCostToComplete: (item.estimatedCostAtCompletion || 100000) - (item.jobToDateCosts || 0),
      forecastToComplete: (item.estimatedCostAtCompletion || 100000) - (item.jobToDateCosts || 0),
      projectedOverUnder: item.projectedOverUnder || 0,
      remaining: Math.max(0, (item.revisedBudget || 100000) - (item.jobToDateCosts || 0)),
      monthlyForecasts,
    } as ForecastRecord
  })
}

// Fetch forecast data (simulated API call)
export const fetchForecastData = async (projectId?: number | string): Promise<ForecastRecord[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!projectId || projectId === "all") {
    // Return data for all active construction projects
    const allData: ForecastRecord[] = []
    const activeProjects = [401001, 401002, 401003, 401004, 401005]

    for (const pid of activeProjects) {
      allData.push(...generateProjectForecastData(pid))
    }
    return allData
  }

  if (typeof projectId === "string") {
    projectId = Number.parseInt(projectId)
  }

  return generateProjectForecastData(projectId)
}

// Transform to dual row format for the advanced table
export const transformToDualRowData = (records: ForecastRecord[]): DualRowData[] => {
  return records.map((record, index) => {
    const currentStart = new Date(record.startDate)
    const currentEnd = new Date(record.endDate)
    const previousStart = new Date(currentStart.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days earlier
    const previousEnd = new Date(currentEnd.getTime() - 15 * 24 * 60 * 60 * 1000) // 15 days earlier

    // Generate previous month values (slightly different from current)
    const previousMonthlyValues: Record<string, number> = {}
    Object.entries(record.monthlyForecasts).forEach(([month, value]) => {
      previousMonthlyValues[month] = Math.round(value * (0.9 + Math.random() * 0.2))
    })

    // Calculate variance
    const varianceMonthlyValues: Record<string, number> = {}
    Object.entries(record.monthlyForecasts).forEach(([month, currentValue]) => {
      const previousValue = previousMonthlyValues[month] || 0
      varianceMonthlyValues[month] = currentValue - previousValue
    })

    // Determine status based on variance
    let status: "on-track" | "at-risk" | "over-budget" = "on-track"
    if (record.projectedOverUnder > 0) {
      status = record.projectedOverUnder > record.revisedBudget * 0.1 ? "over-budget" : "at-risk"
    }

    return {
      id: `${record.budgetCode}-${index}`,
      costCode: record.budgetCode,
      description: record.budgetCodeDescription,
      status,
      previous: {
        startDate: previousStart,
        endDate: previousEnd,
        revisedBudget: record.revisedBudget * 0.95,
        estimatedCostAtCompletion: record.estimatedCostAtCompletion * 0.95,
        projectedOverUnder: record.projectedOverUnder * 0.8,
        monthlyValues: previousMonthlyValues,
      },
      current: {
        startDate: currentStart,
        endDate: currentEnd,
        revisedBudget: record.revisedBudget,
        estimatedCostAtCompletion: record.estimatedCostAtCompletion,
        jobToDateCosts: record.jobToDateCosts,
        projectedCostToComplete: record.projectedCostToComplete,
        projectedOverUnder: record.projectedOverUnder,
        forecastMethod: ["Bell Curve", "S-Curve", "Linear", "Manual"][index % 4] as any,
        monthlyValues: record.monthlyForecasts,
      },
      variance: {
        startDateDays: Math.round((currentStart.getTime() - previousStart.getTime()) / (24 * 60 * 60 * 1000)),
        endDateDays: Math.round((currentEnd.getTime() - previousEnd.getTime()) / (24 * 60 * 60 * 1000)),
        monthlyValues: varianceMonthlyValues,
      },
    }
  })
}

// Calculate project totals
export const calculateProjectTotals = (data: DualRowData[]) => {
  return data.reduce(
    (totals, item) => ({
      totalBudget: totals.totalBudget + item.current.revisedBudget,
      totalActual: totals.totalActual + item.current.jobToDateCosts,
      totalProjected: totals.totalProjected + item.current.estimatedCostAtCompletion,
      totalVariance: totals.totalVariance + item.current.projectedOverUnder,
    }),
    {
      totalBudget: 0,
      totalActual: 0,
      totalProjected: 0,
      totalVariance: 0,
    },
  )
}

// Get project name from ID
export const getProjectName = (projectId: number): string => {
  const projectNames: Record<number, string> = {
    401001: "Tropical World Nursery",
    401002: "Panther Tower South",
    401003: "Riverside Apartments Phase II",
    401004: "Tech Campus Innovation Hub",
    401005: "Coastal Elementary School",
    501001: "Atlantic Fields Club Core",
    501002: "Oceanview Medical Center",
    501003: "Sunset Marina Expansion",
  }
  return projectNames[projectId] || `Project ${projectId}`
}
