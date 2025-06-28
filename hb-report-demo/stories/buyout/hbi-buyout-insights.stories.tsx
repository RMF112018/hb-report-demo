import type { Meta, StoryObj } from "@storybook/react"
import { HbiBuyoutInsights } from "../../components/buyout/HbiBuyoutInsights"

const meta: Meta<typeof HbiBuyoutInsights> = {
  title: "Buyout/HbiBuyoutInsights",
  component: HbiBuyoutInsights,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# HBI Buyout Insights

AI-powered procurement intelligence component that analyzes buyout and material procurement data
to provide actionable insights, risk alerts, and optimization opportunities.

## Features
- **AI-Powered Analysis**: Machine learning algorithms analyze procurement patterns
- **Multi-API Integration**: Real-time data from BuildingConnected, Compass, SiteMate, Procore, Sage 300
- **Risk Detection**: Proactive identification of compliance, safety, and financial risks
- **Opportunity Identification**: Cost savings and optimization recommendations
- **Real-time Monitoring**: Continuous analysis with auto-refresh capabilities
- **Actionable Insights**: Specific recommendations with implementation guidance

## Insight Categories
- **Compliance**: Regulatory compliance and documentation issues
- **Safety**: Safety incidents and risk assessments
- **Cost**: Budget variances and cost optimization opportunities
- **Schedule**: Delivery delays and timeline impacts
- **Vendor**: Vendor performance and relationship management
- **Market**: Market intelligence and trend analysis

## Insight Types
- **Critical**: Immediate action required, high impact
- **Risk**: Potential problems requiring attention
- **Warning**: Issues that need monitoring
- **Opportunity**: Optimization and improvement possibilities
- **Info**: General information and market intelligence

## AI Analysis Sources
- **Historical Data**: Past project performance and patterns
- **Market Intelligence**: Industry trends and benchmarks
- **Vendor Performance**: Supplier reliability and quality metrics
- **Compliance Monitoring**: Regulatory requirement tracking
- **Safety Analytics**: Incident patterns and risk factors
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
    projectId: {
      control: { type: "text" },
      description: "Project identifier for insights context",
    },
    currentUser: {
      description: "Current user information for personalized insights",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
    autoRefresh: {
      control: { type: "boolean" },
      description: "Enable automatic insight refresh",
    },
    refreshInterval: {
      control: { type: "number" },
      description: "Auto-refresh interval in milliseconds",
    },
  },
}

export default meta
type Story = StoryObj<typeof HbiBuyoutInsights>

const mockBuyoutRecords = [
  {
    id: "bo_001",
    projectId: "proj_001",
    name: "Site Work & Excavation",
    vendorName: "Pacific Excavation Inc.",
    vendorId: "vendor_001",
    status: "active",
    contractAmount: 1180000,
    budgetAmount: 1200000,
    currentAmount: 1180000,
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
    vendorId: "vendor_002",
    status: "active",
    contractAmount: 2480000,
    budgetAmount: 2500000,
    currentAmount: 2480000,
    variance: 20000,
    variancePercentage: 0.8,
    costCode: "03-300",
    complianceStatus: "warning",
    complianceChecks: [
      { item: "Insurance", status: "approved" },
      { item: "Bonding", status: "pending" },
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
  },
]

const mockUser = {
  id: "user_001",
  name: "Sarah Johnson",
  role: "PM" as const,
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Default Insights View** - Standard AI insights with multiple categories.

Shows:
- Critical compliance issues
- Safety risk assessments
- Cost optimization opportunities
- Schedule impact analysis
- Vendor performance insights
- Market intelligence updates

This represents typical insights generated for an active project.
        `,
      },
    },
  },
  args: {
    buyoutRecords: mockBuyoutRecords,
    materialRecords: mockMaterialRecords,
    projectId: "proj_001",
    currentUser: mockUser,
    autoRefresh: true,
    refreshInterval: 300000,
  },
}

export const CriticalIssues: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Critical Issues** - High-priority insights requiring immediate attention.

Features:
- Critical compliance violations
- Safety incident alerts
- Budget overrun warnings
- Schedule delay notifications
- Vendor performance issues

These insights require immediate action to prevent project impacts.
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
        contractAmount: 2750000,
        variance: -250000,
        variancePercentage: -10.0,
      },
    ],
    materialRecords: mockMaterialRecords,
    projectId: "proj_001",
    currentUser: mockUser,
  },
}

export const OpportunitiesOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Opportunities Only** - Focusing on optimization and improvement opportunities.

Shows:
- Cost savings opportunities
- Vendor partnership potential
- Process improvements
- Market advantages
- Performance optimizations

Helps teams identify ways to improve project outcomes.
        `,
      },
    },
  },
  args: {
    buyoutRecords: [
      {
        ...mockBuyoutRecords[0],
        contractAmount: 1150000,
        variance: 50000,
        variancePercentage: 4.17,
      },
      {
        ...mockBuyoutRecords[1],
        contractAmount: 2450000,
        variance: 50000,
        variancePercentage: 2.0,
      },
    ],
    materialRecords: mockMaterialRecords,
    projectId: "proj_001",
    currentUser: mockUser,
  },
}

export const SafetyFocused: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Safety-Focused Insights** - Emphasizing safety-related insights and recommendations.

Features:
- Safety incident analysis
- Vendor safety performance
- Risk mitigation recommendations
- Safety training requirements
- Compliance monitoring

Critical for maintaining project safety standards.
        `,
      },
    },
  },
  args: {
    buyoutRecords: mockBuyoutRecords,
    materialRecords: mockMaterialRecords,
    projectId: "proj_001",
    currentUser: mockUser,
  },
}

export const ComplianceAlerts: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Compliance Alerts** - Highlighting compliance issues and requirements.

Shows:
- Regulatory compliance gaps
- Documentation requirements
- Certification expirations
- Audit findings
- Remediation actions

Essential for maintaining regulatory compliance.
        `,
      },
    },
  },
  args: {
    buyoutRecords: [
      {
        ...mockBuyoutRecords[0],
        complianceStatus: "warning",
        complianceChecks: [
          { item: "Insurance", status: "expiring" },
          { item: "License", status: "pending" },
        ],
      },
    ],
    materialRecords: mockMaterialRecords,
    projectId: "proj_001",
    currentUser: mockUser,
  },
}

export const MarketIntelligence: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Market Intelligence** - Market trends and industry insights.

Features:
- Material price trends
- Labor availability
- Equipment costs
- Market conditions
- Industry benchmarks

Helps teams make informed procurement decisions.
        `,
      },
    },
  },
  args: {
    buyoutRecords: mockBuyoutRecords,
    materialRecords: mockMaterialRecords,
    projectId: "proj_001",
    currentUser: mockUser,
  },
}

export const ProjectExecutiveView: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Project Executive View** - Insights tailored for PX role.

Features:
- Executive-level insights
- Portfolio overview
- Strategic recommendations
- Risk summaries
- Performance metrics

Provides high-level insights for project oversight.
        `,
      },
    },
  },
  args: {
    buyoutRecords: mockBuyoutRecords,
    materialRecords: mockMaterialRecords,
    projectId: "proj_001",
    currentUser: {
      id: "user_002",
      name: "Michael Chen",
      role: "PX" as const,
    },
  },
}

export const ExecutiveView: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Executive View** - High-level insights for executive oversight.

Features:
- Company-wide insights
- Portfolio performance
- Strategic opportunities
- Risk management
- Financial impact analysis

Provides executive-level visibility into procurement performance.
        `,
      },
    },
  },
  args: {
    buyoutRecords: mockBuyoutRecords,
    materialRecords: mockMaterialRecords,
    projectId: "proj_001",
    currentUser: {
      id: "user_003",
      name: "Jennifer Liu",
      role: "Executive" as const,
    },
  },
}

export const LoadingState: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Loading State** - AI insights being generated.

Shows:
- Loading animations
- Progress indicators
- API connection status
- Analysis progress
- Processing feedback

Provides feedback during AI analysis operations.
        `,
      },
    },
  },
  args: {
    buyoutRecords: mockBuyoutRecords,
    materialRecords: mockMaterialRecords,
    projectId: "proj_001",
    currentUser: mockUser,
  },
}

export const NoInsights: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**No Insights Available** - Optimal state with no issues detected.

Features:
- All systems optimal message
- Performance indicators
- Preventive recommendations
- Monitoring status
- Success metrics

Shows when all procurement activities are performing well.
        `,
      },
    },
  },
  args: {
    buyoutRecords: [],
    materialRecords: [],
    projectId: "proj_001",
    currentUser: mockUser,
  },
}

export const AutoRefreshEnabled: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Auto-Refresh Enabled** - Insights with automatic refresh capability.

Features:
- Real-time updates
- Refresh indicators
- Update notifications
- Fresh data alerts
- Continuous monitoring

Ensures insights stay current with real-time data changes.
        `,
      },
    },
  },
  args: {
    buyoutRecords: mockBuyoutRecords,
    materialRecords: mockMaterialRecords,
    projectId: "proj_001",
    currentUser: mockUser,
    autoRefresh: true,
    refreshInterval: 60000, // 1 minute for demo
  },
}

export const FilteredInsights: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Filtered Insights** - Insights filtered by category and priority.

Demonstrates:
- Category filtering (compliance, safety, cost, etc.)
- Priority filtering (critical, high, medium, low)
- Search functionality
- Custom filters
- Saved filter sets

Helps users focus on specific types of insights.
        `,
      },
    },
  },
  args: {
    buyoutRecords: mockBuyoutRecords,
    materialRecords: mockMaterialRecords,
    projectId: "proj_001",
    currentUser: mockUser,
  },
}
