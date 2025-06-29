import type { Meta, StoryObj } from "@storybook/react"
import { HBIStaffingInsights } from "../../components/staff/HBIStaffingInsights"
import { AuthProvider } from "../../lib/auth-context"

// Mock data
import mockProjects from "../../data/mock-projects.json"
import mockEmployees from "../../data/mock-employees.json"

const meta: Meta<typeof HBIStaffingInsights> = {
  title: "Staff Planning/HBIStaffingInsights",
  component: HBIStaffingInsights,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# HBI Staffing Insights Component

AI-powered staffing insights component that provides intelligent recommendations for workforce optimization, conflict detection, and resource allocation.

## Features

- **AI-Driven Insights**: Machine learning powered staffing recommendations
- **Conflict Detection**: Identifies scheduling overlaps and resource conflicts
- **Employee Suggestions**: Recommends specific employees for positions
- **Confidence Scoring**: Shows AI confidence levels for each recommendation
- **Action Integration**: Direct integration with SPCR creation workflow

## Insight Types

- **Staffing Need**: Identifies when additional staff is required
- **Schedule Overlap**: Detects conflicting assignments
- **Employee Suggestion**: Recommends specific employees for roles

## Styling

Follows HBI design patterns with orange gradient backgrounds and confidence indicators.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <div className="p-6 bg-gray-50">
          <Story />
        </div>
      </AuthProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof HBIStaffingInsights>

export const Default: Story = {
  args: {
    projects: mockProjects.projects,
    employees: mockEmployees.employees,
    maxInsights: 8,
  },
  parameters: {
    docs: {
      description: {
        story: "Default HBI insights panel with AI-generated staffing recommendations.",
      },
    },
  },
}

export const HighPriorityInsights: Story = {
  args: {
    projects: mockProjects.projects,
    employees: mockEmployees.employees,
    maxInsights: 5,
  },
  parameters: {
    docs: {
      description: {
        story: "Insights panel showing high-priority staffing needs and conflicts.",
      },
    },
  },
}

export const StaffingNeedsOnly: Story = {
  args: {
    projects: mockProjects.projects,
    employees: mockEmployees.employees,
    maxInsights: 6,
  },
  parameters: {
    docs: {
      description: {
        story: "Insights filtered to show only staffing need recommendations.",
      },
    },
  },
}

export const ScheduleConflicts: Story = {
  args: {
    projects: mockProjects.projects,
    employees: mockEmployees.employees,
    maxInsights: 4,
  },
  parameters: {
    docs: {
      description: {
        story: "Insights focused on schedule overlaps and resource conflicts.",
      },
    },
  },
}

export const EmployeeSuggestions: Story = {
  args: {
    projects: mockProjects.projects,
    employees: mockEmployees.employees,
    maxInsights: 6,
  },
  parameters: {
    docs: {
      description: {
        story: "Insights showing specific employee recommendations for positions.",
      },
    },
  },
}

export const LowConfidenceInsights: Story = {
  args: {
    projects: mockProjects.projects,
    employees: mockEmployees.employees,
    maxInsights: 10,
  },
  parameters: {
    docs: {
      description: {
        story: "Insights with lower confidence scores requiring human review.",
      },
    },
  },
}

export const EmptyState: Story = {
  args: {
    projects: mockProjects.projects,
    employees: mockEmployees.employees,
    maxInsights: 10,
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when no insights are available or all have been dismissed.",
      },
    },
  },
}

export const LoadingState: Story = {
  args: {
    projects: [],
    employees: [],
    maxInsights: 10,
  },
  parameters: {
    docs: {
      description: {
        story: "Loading state while insights are being generated.",
      },
    },
  },
}

export const WithSPCRIntegration: Story = {
  args: {
    projects: mockProjects.projects,
    employees: mockEmployees.employees,
    maxInsights: 5,
  },
  parameters: {
    docs: {
      description: {
        story: "Insights panel with SPCR creation integration for Project Managers.",
      },
    },
  },
}

export const ExecutiveView: Story = {
  args: {
    projects: mockProjects.projects,
    employees: mockEmployees.employees,
    maxInsights: 8,
  },
  parameters: {
    docs: {
      description: {
        story: "Executive view with dismiss and action capabilities.",
      },
    },
  },
}
