import type { Meta, StoryObj } from "@storybook/react"
import { ResponsibilityAnalytics } from "@/components/responsibility/ResponsibilityAnalytics"
import { mockMetrics, mockRoles, mockResponsibilityTasks } from "./mock-data"

const meta: Meta<typeof ResponsibilityAnalytics> = {
  title: "Responsibility/ResponsibilityAnalytics",
  component: ResponsibilityAnalytics,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The ResponsibilityAnalytics component provides comprehensive metrics and visualizations
for responsibility matrix data, including workload distribution, completion rates,
and actionable insights.

## Features
- Key performance metrics cards
- Role workload distribution charts
- Task category breakdown
- Assignment trends over time
- Action items for critical issues
- Interactive drill-down capabilities

## Metrics Displayed
- Total tasks and unassigned tasks
- Completion rates and overloaded roles
- Category distribution and trends
- Role workload balance analysis

## Usage
Displayed at the top of the ResponsibilityMatrixPage to provide overview
insights before users interact with detailed task matrices.
        `,
      },
    },
  },
  argTypes: {
    metrics: {
      description: "Calculated metrics from responsibility data",
    },
    roles: {
      description: "Array of project roles for workload analysis",
    },
    tasks: {
      description: "Optional tasks array for detailed analysis",
    },
    onDrillDown: {
      description: "Callback for drilling down into specific metrics",
    },
  },
}

export default meta
type Story = StoryObj<typeof ResponsibilityAnalytics>

export const HealthyProject: Story = {
  args: {
    metrics: {
      ...mockMetrics,
      unassignedTasks: 0,
      completionRate: 85,
    },
    roles: mockRoles,
    tasks: mockResponsibilityTasks,
    onDrillDown: (filterType, filterValue) => console.log(`Drill down: ${filterType} = ${filterValue}`),
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics for a healthy project with good completion rates and balanced workload.",
      },
    },
  },
}

export const ProjectWithIssues: Story = {
  args: {
    metrics: {
      ...mockMetrics,
      unassignedTasks: 8,
      completionRate: 45,
      roleWorkload: {
        PX: 12,
        PM1: 15,
        PM2: 3,
        QAC: 8,
        ProjAcct: 2,
      },
    },
    roles: mockRoles,
    tasks: mockResponsibilityTasks,
    onDrillDown: (filterType, filterValue) => console.log(`Drill down: ${filterType} = ${filterValue}`),
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics showing project issues: unassigned tasks, low completion rate, and overloaded roles.",
      },
    },
  },
}

export const NewProject: Story = {
  args: {
    metrics: {
      totalTasks: 5,
      unassignedTasks: 3,
      completedTasks: 0,
      pendingTasks: 2,
      roleWorkload: {
        PX: 1,
        PM1: 1,
      },
      categoryDistribution: {
        "Contract Management": 2,
        "Quality Control": 2,
        "Safety Management": 1,
      },
      completionRate: 0,
      averageTasksPerRole: 0.4,
    },
    roles: mockRoles,
    tasks: mockResponsibilityTasks.slice(0, 5),
    onDrillDown: (filterType, filterValue) => console.log(`Drill down: ${filterType} = ${filterValue}`),
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics for a new project just getting started with minimal task assignments.",
      },
    },
  },
}

export const CompletedProject: Story = {
  args: {
    metrics: {
      ...mockMetrics,
      completedTasks: mockMetrics.totalTasks,
      pendingTasks: 0,
      completionRate: 100,
      unassignedTasks: 0,
    },
    roles: mockRoles,
    tasks: mockResponsibilityTasks.map((task) => ({ ...task, status: "completed" as const })),
    onDrillDown: (filterType, filterValue) => console.log(`Drill down: ${filterType} = ${filterValue}`),
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics for a completed project with 100% completion rate.",
      },
    },
  },
}
