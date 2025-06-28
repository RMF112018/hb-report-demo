import type { Meta, StoryObj } from "@storybook/react"
import { HbiResponsibilityInsights } from "@/components/responsibility/HbiResponsibilityInsights"
import { mockMetrics, mockRoles, mockResponsibilityTasks } from "./mock-data"

const meta: Meta<typeof HbiResponsibilityInsights> = {
  title: "Responsibility/HbiResponsibilityInsights",
  component: HbiResponsibilityInsights,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The HbiResponsibilityInsights component provides AI-powered analysis and
recommendations for responsibility matrix optimization, identifying risks,
opportunities, and actionable improvements.

## AI-Powered Features
- Risk detection for unassigned tasks and overloaded roles
- Opportunity identification for workload optimization
- Compliance analysis for AIA standards
- Performance recommendations based on completion rates
- Workload distribution analysis

## Insight Types
- **Risk**: Critical issues requiring immediate attention
- **Alert**: Important warnings about project health
- **Recommendation**: Suggestions for improvement
- **Opportunity**: Areas for optimization
- **Success**: Recognition of good performance

## Confidence Scoring
Each insight includes an AI confidence score (0-100%) indicating
the reliability of the analysis and recommendations.

## Usage
Displayed prominently in the ResponsibilityMatrixPage to provide
proactive guidance and early warning of potential issues.
        `,
      },
    },
  },
  argTypes: {
    tasks: {
      description: "Array of responsibility tasks for analysis",
    },
    roles: {
      description: "Array of project roles",
    },
    metrics: {
      description: "Calculated metrics from responsibility data",
    },
  },
}

export default meta
type Story = StoryObj<typeof HbiResponsibilityInsights>

export const HealthyProject: Story = {
  args: {
    tasks: mockResponsibilityTasks.map((task) => ({ ...task, status: "completed" as const })),
    roles: mockRoles,
    metrics: {
      ...mockMetrics,
      unassignedTasks: 0,
      completionRate: 95,
      roleWorkload: {
        PX: 5,
        PM1: 6,
        PM2: 4,
        QAC: 5,
        ProjAcct: 3,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Insights for a healthy project with excellent performance metrics.",
      },
    },
  },
}

export const ProjectWithRisks: Story = {
  args: {
    tasks: mockResponsibilityTasks,
    roles: mockRoles,
    metrics: {
      ...mockMetrics,
      unassignedTasks: 12,
      completionRate: 35,
      roleWorkload: {
        PX: 15,
        PM1: 18,
        PM2: 2,
        QAC: 12,
        ProjAcct: 1,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Insights showing multiple risks: unassigned tasks, low completion rate, and overloaded roles.",
      },
    },
  },
}

export const NewProjectSetup: Story = {
  args: {
    tasks: mockResponsibilityTasks.slice(0, 8),
    roles: mockRoles,
    metrics: {
      totalTasks: 8,
      unassignedTasks: 5,
      completedTasks: 0,
      pendingTasks: 3,
      roleWorkload: {
        PX: 2,
        PM1: 1,
      },
      categoryDistribution: {
        "Contract Management": 3,
        "Quality Control": 2,
        "Safety Management": 2,
        "Schedule Management": 1,
      },
      completionRate: 0,
      averageTasksPerRole: 0.6,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Insights for a new project in setup phase with recommendations for task assignment.",
      },
    },
  },
}

export const NoInsights: Story = {
  args: {
    tasks: mockResponsibilityTasks.map((task) => ({
      ...task,
      status: "completed" as const,
      responsible: task.responsible || "PM1",
    })),
    roles: mockRoles,
    metrics: {
      ...mockMetrics,
      unassignedTasks: 0,
      completionRate: 100,
      roleWorkload: {
        PX: 6,
        PM1: 7,
        PM2: 5,
        QAC: 6,
        ProjAcct: 4,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Perfect project state with no insights needed - shows success message.",
      },
    },
  },
}
