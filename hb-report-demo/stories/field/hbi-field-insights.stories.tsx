import type { Meta, StoryObj } from "@storybook/react"
import { HBIFieldInsights } from "@/components/field-reports/HBIFieldInsights"
import { mockFieldData, mockMetrics, stateVariations, getFilteredDataByRole, getMetricsByRole } from "./mock-data"

const meta: Meta<typeof HBIFieldInsights> = {
  title: "Field Reports/HBIFieldInsights",
  component: HBIFieldInsights,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The HBIFieldInsights component provides AI-powered analysis and recommendations for field operations.
It analyzes patterns in field data to generate actionable insights and recommendations.

## Features
- **AI-Powered Analysis**: Generates insights based on data patterns and trends
- **Performance KPIs**: Key performance indicators with trend analysis
- **Smart Recommendations**: Contextual suggestions for improvement
- **Role-based Actions**: Action items tailored to user permissions
- **Visual Indicators**: Color-coded alerts and status indicators

## AI Insights Categories
- **Compliance**: Daily log submission and safety compliance issues
- **Safety**: Violation trends and safety performance analysis
- **Productivity**: Worker efficiency and resource utilization
- **Quality**: Defect patterns and quality control recommendations
- **Overall Performance**: Holistic performance assessment

## Styling Reference
Follows the HBIInsightsCard.tsx pattern with:
- Orange accent colors (#FF6B35)
- Blue headers (#003087)
- AI-powered badge styling
- Gradient backgrounds for action items
        `,
      },
    },
  },
  argTypes: {
    data: {
      description: "Complete field reports data for analysis",
      control: { type: "object" },
    },
    metrics: {
      description: "Calculated field metrics for insight generation",
      control: { type: "object" },
    },
    userRole: {
      description: "Current user role for permission-based features",
      control: { type: "select" },
      options: ["admin", "executive", "project-executive", "project-manager"],
    },
    className: {
      description: "Additional CSS classes for styling",
      control: { type: "text" },
    },
  },
}

export default meta
type Story = StoryObj<typeof HBIFieldInsights>

export const AdminView: Story = {
  args: {
    data: mockFieldData,
    metrics: mockMetrics,
    userRole: "admin",
  },
  parameters: {
    docs: {
      description: {
        story: "HBI insights for admin user with full data access and management capabilities.",
      },
    },
  },
}

export const ExecutiveView: Story = {
  args: {
    data: mockFieldData,
    metrics: mockMetrics,
    userRole: "executive",
  },
  parameters: {
    docs: {
      description: {
        story: "HBI insights for executive user focused on high-level performance metrics.",
      },
    },
  },
}

export const ProjectExecutiveView: Story = {
  args: {
    data: getFilteredDataByRole("project-executive"),
    metrics: getMetricsByRole("project-executive"),
    userRole: "project-executive",
  },
  parameters: {
    docs: {
      description: {
        story: "HBI insights for project executive with filtered data for their oversight projects.",
      },
    },
  },
}

export const ProjectManagerView: Story = {
  args: {
    data: getFilteredDataByRole("project-manager"),
    metrics: getMetricsByRole("project-manager"),
    userRole: "project-manager",
  },
  parameters: {
    docs: {
      description: {
        story: "HBI insights for project manager focused on their specific project data.",
      },
    },
  },
}

export const HighPerformance: Story = {
  args: {
    data: mockFieldData,
    metrics: stateVariations.highCompliance,
    userRole: "admin",
  },
  parameters: {
    docs: {
      description: {
        story: "HBI insights showing excellent performance with positive recommendations.",
      },
    },
  },
}

export const LowPerformance: Story = {
  args: {
    data: mockFieldData,
    metrics: stateVariations.lowCompliance,
    userRole: "project-manager",
  },
  parameters: {
    docs: {
      description: {
        story: "HBI insights highlighting performance issues with improvement recommendations.",
      },
    },
  },
}

export const CriticalIssues: Story = {
  args: {
    data: mockFieldData,
    metrics: stateVariations.criticalIssues,
    userRole: "admin",
  },
  parameters: {
    docs: {
      description: {
        story: "HBI insights showing critical issues requiring immediate attention and action plans.",
      },
    },
  },
}

export const NoInsights: Story = {
  args: {
    data: {
      dailyLogs: [],
      manpower: [],
      safetyAudits: [],
      qualityInspections: [],
    },
    metrics: {
      totalLogs: 0,
      logComplianceRate: 100,
      totalWorkers: 0,
      averageEfficiency: 100,
      safetyViolations: 0,
      safetyComplianceRate: 100,
      qualityDefects: 0,
      qualityPassRate: 100,
    },
    userRole: "project-manager",
  },
  parameters: {
    docs: {
      description: {
        story: "HBI insights with no critical issues, showing positive performance state.",
      },
    },
  },
}

export const WithCustomStyling: Story = {
  args: {
    data: mockFieldData,
    metrics: mockMetrics,
    userRole: "admin",
    className: "shadow-lg",
  },
  parameters: {
    docs: {
      description: {
        story: "HBI insights component with custom styling applied.",
      },
    },
  },
}
