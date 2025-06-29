import type { Meta, StoryObj } from "@storybook/react"
import { BuyoutAnalytics } from "../../components/buyout/BuyoutAnalytics"

const meta: Meta<typeof BuyoutAnalytics> = {
  title: "Buyout/BuyoutAnalytics",
  component: BuyoutAnalytics,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Buyout Analytics Component

Comprehensive analytics dashboard for subcontract buyout and material procurement data.
Integrates with multiple APIs to provide real-time insights and performance metrics.

## Features
- **Multi-API Integration**: BuildingConnected, Compass, SiteMate, Procore, Sage 300
- **Real-time Metrics**: Budget variance, compliance rates, safety scores
- **Interactive Charts**: Cost analysis, compliance distribution, safety trends
- **Drill-down Capabilities**: Click metrics to view detailed breakdowns
- **AIA Compliance**: Tracks AIA document requirements and compliance

## API Integrations
- **BuildingConnected**: Vendor performance and bid analysis
- **Compass**: Compliance and risk assessment
- **SiteMate**: Safety metrics and incident tracking
- **Procore**: Budget and cost code analysis
- **Sage 300**: Financial data and payment history

## Chart Types
- Bar charts for cost code analysis
- Pie charts for compliance distribution
- Line charts for safety performance trends
- Gauge charts for KPI tracking
        `,
      },
    },
  },
  argTypes: {
    buyoutRecords: {
      description: "Array of buyout records for analysis",
    },
    materialRecords: {
      description: "Array of material procurement records",
    },
    onDrillDown: {
      action: "drillDown",
      description: "Callback function when user clicks on a metric for detailed view",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes for styling",
    },
  },
}

export default meta
type Story = StoryObj<typeof BuyoutAnalytics>

// Mock data for stories
const mockBuyoutRecords = [
  {
    id: "bo_001",
    projectId: "proj_001",
    name: "Site Work & Excavation",
    vendorName: "Pacific Excavation Inc.",
    status: "active",
    contractAmount: 1180000,
    budgetAmount: 1200000,
    variance: 20000,
    variancePercentage: 1.67,
    costCode: "02-200",
    complianceStatus: "compliant",
    complianceChecks: [
      { item: "Insurance", status: "approved" },
      { item: "W-9", status: "approved" },
    ],
  },
  {
    id: "bo_002",
    projectId: "proj_001",
    name: "Concrete Work - Foundations",
    vendorName: "Superior Concrete Solutions",
    status: "active",
    contractAmount: 2480000,
    budgetAmount: 2500000,
    variance: 20000,
    variancePercentage: 0.8,
    costCode: "03-300",
    complianceStatus: "compliant",
    complianceChecks: [
      { item: "Insurance", status: "approved" },
      { item: "Bonding", status: "approved" },
    ],
  },
]

const mockMaterialRecords = [
  {
    id: "mp_001",
    projectId: "proj_001",
    item: {
      name: "Structural Steel Beams",
      quantity: 50,
      unit: "tons",
    },
    vendor: {
      name: "Steel Supply Co",
    },
    quoteValue: 125000,
    orderedStatus: "Delivered",
    deliveryDate: "2024-03-15",
    costCode: "05-120",
  },
]

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Default Analytics View** - Standard analytics dashboard with all metrics visible.

Shows:
- Total buyout value and budget variance
- Executed vs pending contracts
- Compliance and safety metrics
- Material delivery status
- API integration status
        `,
      },
    },
  },
  args: {
    buyoutRecords: mockBuyoutRecords,
    materialRecords: mockMaterialRecords,
    onDrillDown: (metric: string, filters: any) => {
      console.log("Drill down:", metric, filters)
    },
  },
}

export const HighVariance: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**High Budget Variance** - Shows analytics when there are significant budget overruns.

This story demonstrates:
- Red variance indicators for over-budget items
- Risk alerts and warnings
- Detailed variance analysis
- Recommended actions for cost control
        `,
      },
    },
  },
  args: {
    buyoutRecords: [
      {
        ...mockBuyoutRecords[0],
        contractAmount: 1350000,
        variance: -150000,
        variancePercentage: -12.5,
      },
      {
        ...mockBuyoutRecords[1],
        contractAmount: 2750000,
        variance: -250000,
        variancePercentage: -10.0,
      },
    ],
    materialRecords: mockMaterialRecords,
  },
}

export const ComplianceIssues: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Compliance Issues** - Analytics view highlighting compliance problems.

Features:
- Non-compliant vendor indicators
- Missing documentation alerts
- Risk assessment metrics
- Compliance improvement recommendations
        `,
      },
    },
  },
  args: {
    buyoutRecords: [
      {
        ...mockBuyoutRecords[0],
        complianceStatus: "non-compliant",
        complianceChecks: [
          { item: "Insurance", status: "expired" },
          { item: "W-9", status: "missing" },
        ],
      },
      {
        ...mockBuyoutRecords[1],
        complianceStatus: "warning",
        complianceChecks: [
          { item: "Insurance", status: "approved" },
          { item: "Bonding", status: "pending" },
        ],
      },
    ],
    materialRecords: mockMaterialRecords,
  },
}

export const SafetyAlerts: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Safety Alerts** - Shows analytics when safety incidents are detected.

Highlights:
- Safety incident tracking
- Vendor safety scores
- Risk mitigation recommendations
- Safety performance trends
        `,
      },
    },
  },
  args: {
    buyoutRecords: mockBuyoutRecords,
    materialRecords: mockMaterialRecords,
  },
}

export const MaterialDelays: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Material Delivery Delays** - Analytics showing delayed material deliveries.

Shows:
- Overdue delivery indicators
- Schedule impact analysis
- Vendor performance metrics
- Expediting recommendations
        `,
      },
    },
  },
  args: {
    buyoutRecords: mockBuyoutRecords,
    materialRecords: [
      {
        ...mockMaterialRecords[0],
        orderedStatus: "Ordered",
        deliveryDate: "2024-01-15", // Past due
      },
    ],
  },
}

export const APIDisconnected: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**API Disconnected** - Shows analytics when external APIs are unavailable.

Features:
- Offline mode indicators
- Cached data usage
- Connection retry options
- Degraded functionality warnings
        `,
      },
    },
  },
  args: {
    buyoutRecords: mockBuyoutRecords,
    materialRecords: mockMaterialRecords,
  },
}

export const EmptyData: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Empty Data State** - Analytics view when no data is available.

Shows:
- Empty state messaging
- Getting started guidance
- Data import options
- Template suggestions
        `,
      },
    },
  },
  args: {
    buyoutRecords: [],
    materialRecords: [],
  },
}

export const InteractiveDrillDown: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Interactive Drill-Down** - Demonstrates the drill-down functionality.

Features:
- Clickable metrics and charts
- Detailed breakdowns
- Filter applications
- Context-sensitive actions

Click on any metric card or chart element to see detailed information.
        `,
      },
    },
  },
  args: {
    buyoutRecords: mockBuyoutRecords,
    materialRecords: mockMaterialRecords,
    onDrillDown: (metric: string, filters: any) => {
      alert(`Drilling down into ${metric} with filters: ${JSON.stringify(filters)}`)
    },
  },
}
