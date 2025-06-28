import type { Meta, StoryObj } from "@storybook/react"
import { BidComparisonTool } from "../../components/buyout/BidComparisonTool"

const meta: Meta<typeof BidComparisonTool> = {
  title: "Buyout/BidComparisonTool",
  component: BidComparisonTool,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Bid Comparison Tool

Advanced bid analysis and comparison tool with weighted scoring methodology and multi-API integration.
Helps project teams make informed vendor selection decisions based on comprehensive criteria.

## Features
- **Weighted Scoring System**: Customizable criteria weights (cost, compliance, safety, rating, delivery)
- **Multi-API Integration**: Real-time data from BuildingConnected, Compass, SiteMate, Procore, Sage 300
- **Side-by-Side Comparison**: Detailed vendor comparison with charts and metrics
- **Risk Assessment**: Comprehensive risk analysis for each vendor
- **Performance Metrics**: Historical performance and reliability data
- **Export Capabilities**: PDF and Excel export for documentation

## Scoring Criteria
- **Cost (40%)**: Bid amount and value engineering
- **Compliance (20%)**: Insurance, licensing, and regulatory compliance
- **Safety (20%)**: Safety record and incident history
- **Rating (15%)**: Overall vendor rating and reviews
- **Delivery (5%)**: Delivery time and reliability

## API Data Sources
- **BuildingConnected**: Vendor performance, win rates, project history
- **Compass**: Compliance status, risk metrics, documentation
- **SiteMate**: Safety ratings, incident history, quality scores
- **Procore**: Vendor performance, project history, ratings
- **Sage 300**: Financial stability, payment history, credit ratings

## Comparison Features
- **Interactive Charts**: Visual comparison of scores and metrics
- **Detailed Breakdowns**: Line-by-line comparison of vendor capabilities
- **Risk Analysis**: Financial, delivery, and quality risk assessment
- **Recommendation Engine**: AI-powered vendor recommendations
        `,
      },
    },
  },
  argTypes: {
    projectId: {
      control: { type: "text" },
      description: "Project identifier for bid comparison",
    },
    buyoutId: {
      control: { type: "text" },
      description: "Optional buyout ID for specific package comparison",
    },
    materialId: {
      control: { type: "text" },
      description: "Optional material ID for material vendor comparison",
    },
    isOpen: {
      control: { type: "boolean" },
      description: "Controls dialog visibility",
    },
    onClose: {
      action: "close",
      description: "Callback when dialog is closed",
    },
    onSelectBid: {
      action: "selectBid",
      description: "Callback when a bid is selected",
    },
  },
}

export default meta
type Story = StoryObj<typeof BidComparisonTool>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Default Bid Comparison** - Standard bid comparison with multiple vendors.

Features:
- 4 vendor bids with different strengths
- Default weighted scoring (Cost 40%, Compliance 20%, Safety 20%, Rating 15%, Delivery 5%)
- API integration status indicators
- Sortable comparison table
- Interactive scoring system

This shows the typical use case for comparing vendor bids on a construction package.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    buyoutId: "bo_001",
    isOpen: true,
    onClose: () => console.log("Bid comparison closed"),
    onSelectBid: (bidId) => console.log("Selected bid:", bidId),
  },
}

export const MaterialVendorComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Material Vendor Comparison** - Comparing vendors for material procurement.

Features:
- Material-specific vendor comparison
- Delivery time emphasis
- Quality score integration
- Supplier reliability metrics
- Cost per unit analysis

Used when selecting vendors for specific materials or equipment.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    materialId: "mat_001",
    isOpen: true,
    onClose: () => console.log("Material vendor comparison closed"),
    onSelectBid: (bidId) => console.log("Selected material vendor:", bidId),
  },
}

export const CustomWeighting: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Custom Weighting** - Bid comparison with adjusted scoring weights.

Demonstrates:
- Safety-focused weighting (Safety 40%, Cost 30%, Compliance 20%, Rating 10%)
- Real-time score recalculation
- Impact of weighting changes
- Scenario analysis capabilities

Useful for high-risk projects where safety is the primary concern.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    buyoutId: "bo_safety_critical",
    isOpen: true,
    onClose: () => console.log("Custom weighted comparison closed"),
    onSelectBid: (bidId) => console.log("Selected safety-focused bid:", bidId),
  },
}

export const APIConnected: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Full API Integration** - All external APIs connected and providing real-time data.

Shows:
- BuildingConnected vendor performance data
- Compass compliance verification
- SiteMate safety metrics
- Procore project history
- Sage 300 financial stability
- Real-time data updates

This represents the optimal state with complete API integration.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    buyoutId: "bo_001",
    isOpen: true,
    onClose: () => console.log("API-connected comparison closed"),
    onSelectBid: (bidId) => console.log("Selected bid with API data:", bidId),
  },
}

export const ComplianceIssues: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Compliance Issues** - Vendors with compliance problems highlighted.

Features:
- Non-compliant vendor warnings
- Missing documentation alerts
- Risk score adjustments
- Compliance remediation suggestions
- Regulatory requirement tracking

Critical for ensuring all vendors meet project requirements.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    buyoutId: "bo_compliance_issues",
    isOpen: true,
    onClose: () => console.log("Compliance comparison closed"),
    onSelectBid: (bidId) => console.log("Selected compliant bid:", bidId),
  },
}

export const SafetyFocused: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Safety-Focused Comparison** - Emphasizing safety performance and history.

Highlights:
- Safety incident history
- Safety training records
- Safety equipment requirements
- Safety performance trends
- Risk mitigation capabilities

Essential for high-risk construction activities.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    buyoutId: "bo_high_risk",
    isOpen: true,
    onClose: () => console.log("Safety-focused comparison closed"),
    onSelectBid: (bidId) => console.log("Selected safe vendor:", bidId),
  },
}

export const CostOptimized: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Cost-Optimized Comparison** - Focusing on cost efficiency and value.

Features:
- Cost breakdown analysis
- Value engineering opportunities
- Total cost of ownership
- Payment terms comparison
- Cost risk assessment

Used when cost is the primary selection criterion.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    buyoutId: "bo_cost_critical",
    isOpen: true,
    onClose: () => console.log("Cost-optimized comparison closed"),
    onSelectBid: (bidId) => console.log("Selected cost-effective bid:", bidId),
  },
}

export const SideBySideComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Side-by-Side Comparison** - Detailed vendor comparison dialog.

Features:
- Multi-vendor comparison charts
- Detailed criteria breakdown
- Performance metrics visualization
- Risk assessment matrix
- Recommendation summary

Provides comprehensive analysis for final vendor selection.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    buyoutId: "bo_001",
    isOpen: true,
    onClose: () => console.log("Side-by-side comparison closed"),
    onSelectBid: (bidId) => console.log("Selected from comparison:", bidId),
  },
}

export const FilteredResults: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Filtered Results** - Bid comparison with active filters applied.

Demonstrates:
- Vendor name filtering
- Compliance status filtering
- Score range filtering
- Geographic filtering
- Capability filtering

Helps narrow down vendor options based on specific criteria.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    buyoutId: "bo_001",
    isOpen: true,
    onClose: () => console.log("Filtered comparison closed"),
    onSelectBid: (bidId) => console.log("Selected filtered bid:", bidId),
  },
}

export const ExportCapabilities: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Export Capabilities** - Bid comparison with export options.

Features:
- PDF comparison reports
- Excel data export
- Custom report templates
- Executive summaries
- Detailed analysis reports

Enables documentation and sharing of vendor selection decisions.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    buyoutId: "bo_001",
    isOpen: true,
    onClose: () => console.log("Export comparison closed"),
    onSelectBid: (bidId) => console.log("Selected bid for export:", bidId),
  },
}

export const LoadingState: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Loading State** - Bid comparison while loading vendor data.

Shows:
- Loading indicators
- API connection progress
- Data fetch status
- Progressive loading
- Skeleton animations

Provides feedback during data loading operations.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    buyoutId: "bo_001",
    isOpen: true,
    onClose: () => console.log("Loading comparison closed"),
    onSelectBid: (bidId) => console.log("Selected loading bid:", bidId),
  },
}

export const NoBidsAvailable: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**No Bids Available** - Empty state when no vendor bids exist.

Features:
- Empty state messaging
- Vendor invitation options
- Bid solicitation guidance
- Timeline recommendations
- Market research suggestions

Guides users through the vendor solicitation process.
        `,
      },
    },
  },
  args: {
    projectId: "proj_new",
    buyoutId: "bo_new",
    isOpen: true,
    onClose: () => console.log("Empty comparison closed"),
    onSelectBid: (bidId) => console.log("No bids to select:", bidId),
  },
}
