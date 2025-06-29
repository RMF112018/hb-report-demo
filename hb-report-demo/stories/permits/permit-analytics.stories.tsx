import type { Meta, StoryObj } from "@storybook/react"
import { PermitAnalytics } from "@/components/permit-log/PermitAnalytics"
import mockPermits from "@/data/mock-permits.json"
import type { Permit } from "@/types/permit-log"

const meta: Meta<typeof PermitAnalytics> = {
  title: "Permits/PermitAnalytics",
  component: PermitAnalytics,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Permit Analytics Component

Provides comprehensive analytics and visualizations for permit data, including approval rates, processing times, inspection results, and trend analysis.

## Features
- **Key Performance Indicators**: Approval rates, processing times, compliance scores
- **Interactive Charts**: Bar charts, pie charts, line graphs for trend analysis
- **Inspection Analytics**: Pass rates, compliance scores, issue tracking
- **Time-based Analysis**: Monthly trends, seasonal patterns
- **Comparative Metrics**: Performance against targets and benchmarks

## Chart Types
- **Status Distribution**: Pie chart showing permit status breakdown
- **Type Analysis**: Bar chart of permits by type and approval rates
- **Monthly Trends**: Line chart showing permit applications over time
- **Inspection Results**: Pie chart of inspection outcomes
- **Processing Time**: Analysis of average approval times

## Responsive Design
- Adapts to different screen sizes
- Mobile-friendly chart interactions
- Accessible color schemes and labels
        `,
      },
    },
  },
  argTypes: {
    permits: {
      description: "Array of permit objects to analyze",
    },
    detailed: {
      control: "boolean",
      description: "Show detailed analytics with additional charts and metrics",
    },
  },
}

export default meta
type Story = StoryObj<typeof PermitAnalytics>

const samplePermits = mockPermits.slice(0, 20) as Permit[]

export const Default: Story = {
  args: {
    permits: samplePermits,
    detailed: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Basic analytics view with key metrics and essential charts.",
      },
    },
  },
}

export const DetailedView: Story = {
  args: {
    permits: samplePermits,
    detailed: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Comprehensive analytics with all available charts and detailed metrics.",
      },
    },
  },
}

export const HighVolumeData: Story = {
  args: {
    permits: mockPermits as Permit[],
    detailed: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics with full dataset showing performance with larger data volumes.",
      },
    },
  },
}

export const ApprovedPermitsOnly: Story = {
  args: {
    permits: samplePermits.filter((p) => p.status === "approved"),
    detailed: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics focused on approved permits only.",
      },
    },
  },
}

export const PendingPermitsAnalysis: Story = {
  args: {
    permits: samplePermits.filter((p) => p.status === "pending"),
    detailed: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Analysis of pending permits to identify bottlenecks.",
      },
    },
  },
}

export const EmptyDataState: Story = {
  args: {
    permits: [],
    detailed: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics component with no data to display.",
      },
    },
  },
}
