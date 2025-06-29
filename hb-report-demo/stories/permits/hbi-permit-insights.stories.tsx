import type { Meta, StoryObj } from "@storybook/react"
import { within, userEvent, expect } from "@storybook/test"
import { HBIPermitInsights } from "@/components/permit-log/HBIPermitInsights"
import mockPermits from "@/data/mock-permits.json"
import type { Permit } from "@/types/permit-log"

const meta: Meta<typeof HBIPermitInsights> = {
  title: "Permits/HBIPermitInsights",
  component: HBIPermitInsights,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# HBI Permit Insights Component

AI-powered insights and recommendations for permit management, providing intelligent analysis and actionable recommendations.

## Features
- **AI-Generated Insights**: Machine learning analysis of permit data
- **Risk Assessment**: Identification of potential issues and delays
- **Opportunity Detection**: Suggestions for process improvements
- **Compliance Alerts**: Warnings for regulatory compliance issues
- **Performance Recommendations**: Optimization suggestions
- **Confidence Scoring**: AI confidence levels for each insight

## Insight Types
- **Warnings**: Permits expiring soon, processing delays
- **Alerts**: Failed inspections, compliance violations
- **Recommendations**: Process improvements, best practices
- **Opportunities**: Cost savings, efficiency gains
- **Forecasts**: Predictive analysis and trends

## AI Analysis
- **Pattern Recognition**: Identifies trends and anomalies
- **Predictive Modeling**: Forecasts potential issues
- **Benchmarking**: Compares against industry standards
- **Risk Scoring**: Quantifies potential risks
- **Impact Assessment**: Evaluates business impact

## Visual Design
- Follows HBIInsightsCard styling patterns
- Color-coded insight types
- Confidence indicators
- Action buttons for each insight
- Expandable detail views

## Integration
- Real-time data analysis
- Configurable alert thresholds
- Integration with notification systems
- Export capabilities for reports
        `,
      },
    },
  },
  argTypes: {
    permits: {
      description: "Array of permit objects to analyze",
    },
  },
}

export default meta
type Story = StoryObj<typeof HBIPermitInsights>

const samplePermits = mockPermits.slice(0, 20) as Permit[]

// Create permits with specific conditions for different insights
const expiringPermits = samplePermits.map((permit, index) => ({
  ...permit,
  status: "approved" as const,
  expirationDate: new Date(Date.now() + (index < 3 ? 15 : 60) * 24 * 60 * 60 * 1000).toISOString(),
}))

const failedInspectionPermits = samplePermits.map((permit, index) => ({
  ...permit,
  inspections:
    index < 2
      ? [
          {
            ...permit.inspections[0],
            result: "failed" as const,
            issues: [
              {
                id: "issue-1",
                description: "Code violation found",
                severity: "high" as const,
                status: "open" as const,
                location: "Main structure",
                code: "IBC 123.4",
                resolutionDate: null,
                resolutionNotes: "Requires immediate attention",
              },
            ],
          },
        ]
      : permit.inspections,
}))

export const Default: Story = {
  args: {
    permits: samplePermits,
  },
  parameters: {
    docs: {
      description: {
        story: "Default insights view with standard permit data analysis.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify insights panel
    await expect(canvas.getByText("HBI Permit Insights")).toBeInTheDocument()

    // Check for AI branding
    const aiIcon = canvas.getByRole("img", { hidden: true }) // Lucide icons are hidden from screen readers
    expect(aiIcon).toBeInTheDocument()

    // Test action buttons if insights are present
    const actionButtons = canvas.queryAllByText("Take Action")
    if (actionButtons.length > 0) {
      await userEvent.click(actionButtons[0])
    }
  },
}

export const WithExpiringPermits: Story = {
  args: {
    permits: expiringPermits,
  },
  parameters: {
    docs: {
      description: {
        story: "Insights showing permits expiring soon with high-priority alerts.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Should show expiring permits warning
    await expect(canvas.getByText(/expiring soon/i)).toBeInTheDocument()

    // Check for high priority badge
    await expect(canvas.getByText(/high priority/i)).toBeInTheDocument()
  },
}

export const WithFailedInspections: Story = {
  args: {
    permits: failedInspectionPermits,
  },
  parameters: {
    docs: {
      description: {
        story: "Insights highlighting permits with failed inspections requiring attention.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Should show failed inspection alert
    await expect(canvas.getByText(/failed inspection/i)).toBeInTheDocument()

    // Check for alert type indicator
    const alertBadges = canvas.queryAllByText(/alert/i)
    expect(alertBadges.length).toBeGreaterThan(0)
  },
}

export const LowApprovalRate: Story = {
  args: {
    permits: samplePermits.map((permit) => ({
      ...permit,
      status: Math.random() > 0.3 ? ("rejected" as const) : permit.status,
    })),
  },
  parameters: {
    docs: {
      description: {
        story: "Insights showing low approval rate with recommendations for improvement.",
      },
    },
  },
}

export const HighCompliance: Story = {
  args: {
    permits: samplePermits.map((permit) => ({
      ...permit,
      inspections: permit.inspections.map((inspection) => ({
        ...inspection,
        result: "passed" as const,
        complianceScore: 95 + Math.random() * 5,
      })),
    })),
  },
  parameters: {
    docs: {
      description: {
        story: "Insights showing excellent compliance performance with positive feedback.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Should show positive compliance insight
    await expect(canvas.getByText(/excellent compliance/i)).toBeInTheDocument()

    // Check for opportunity type
    const opportunityBadges = canvas.queryAllByText(/opportunity/i)
    expect(opportunityBadges.length).toBeGreaterThan(0)
  },
}

export const NoInsights: Story = {
  args: {
    permits: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Insights panel when no critical issues are detected.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Should show "all clear" message
    await expect(canvas.getByText(/all clear/i)).toBeInTheDocument()
    await expect(canvas.getByText(/no critical issues/i)).toBeInTheDocument()
  },
}

export const MultipleInsightTypes: Story = {
  args: {
    permits: [...expiringPermits.slice(0, 2), ...failedInspectionPermits.slice(0, 1), ...samplePermits.slice(0, 5)],
  },
  parameters: {
    docs: {
      description: {
        story: "Insights panel showing multiple types of insights and recommendations.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Should show multiple insight types
    const insightCards = canvas.getAllByRole("article") // Assuming insights are in article elements
    expect(insightCards.length).toBeGreaterThan(1)

    // Test "View All" button if present
    const viewAllButton = canvas.queryByText(/view all/i)
    if (viewAllButton) {
      await userEvent.click(viewAllButton)
    }
  },
}

export const HighConfidenceInsights: Story = {
  args: {
    permits: expiringPermits,
  },
  parameters: {
    docs: {
      description: {
        story: "Insights with high AI confidence scores.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check for confidence indicators
    const confidenceIndicators = canvas.queryAllByText(/\d+% confidence/i)
    expect(confidenceIndicators.length).toBeGreaterThan(0)
  },
}
