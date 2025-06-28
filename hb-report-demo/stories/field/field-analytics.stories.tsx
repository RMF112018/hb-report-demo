import type { Meta, StoryObj } from "@storybook/react"
import { FieldAnalytics } from "@/components/field-reports/FieldAnalytics"
import { mockMetrics, stateVariations } from "./mock-data"

const meta: Meta<typeof FieldAnalytics> = {
  title: "Field Reports/FieldAnalytics",
  component: FieldAnalytics,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The FieldAnalytics component displays key performance indicators and metrics for field operations.
It provides visual representations of compliance rates, efficiency metrics, and safety performance.

## Features
- **KPI Cards**: Display key metrics with trend indicators
- **Progress Indicators**: Visual progress bars for compliance tracking
- **Alert Summary**: Overview of critical issues requiring attention
- **Role-based Display**: Metrics adapt based on user permissions

## Usage
Used in the Field Reports dashboard to provide at-a-glance performance insights.
        `,
      },
    },
  },
  argTypes: {
    metrics: {
      description: "Field metrics data including compliance rates, worker counts, and performance indicators",
      control: { type: "object" },
    },
    className: {
      description: "Additional CSS classes for styling",
      control: { type: "text" },
    },
  },
}

export default meta
type Story = StoryObj<typeof FieldAnalytics>

export const Default: Story = {
  args: {
    metrics: mockMetrics,
  },
}

export const HighPerformance: Story = {
  args: {
    metrics: stateVariations.highCompliance,
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics showing excellent performance across all metrics with high compliance rates.",
      },
    },
  },
}

export const LowPerformance: Story = {
  args: {
    metrics: stateVariations.lowCompliance,
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics showing below-target performance requiring management attention.",
      },
    },
  },
}

export const CriticalIssues: Story = {
  args: {
    metrics: stateVariations.criticalIssues,
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics showing critical performance issues requiring immediate intervention.",
      },
    },
  },
}

export const WithCustomStyling: Story = {
  args: {
    metrics: mockMetrics,
    className: "bg-gray-50 p-4 rounded-lg",
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics component with custom styling applied.",
      },
    },
  },
}

export const ZeroData: Story = {
  args: {
    metrics: {
      totalLogs: 0,
      logComplianceRate: 0,
      totalWorkers: 0,
      averageEfficiency: 0,
      safetyViolations: 0,
      safetyComplianceRate: 0,
      qualityDefects: 0,
      qualityPassRate: 0,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics component with no data, showing how it handles empty states.",
      },
    },
  },
}
