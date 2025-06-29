import type { Meta, StoryObj } from "@storybook/react"
import { StaffAnalytics } from "../../components/staff/StaffAnalytics"
import { AuthProvider } from "../../lib/auth-context"

// Mock data
import mockEmployees from "../../data/mock-employees.json"
import mockProjects from "../../data/mock-projects.json"
import mockSpcrs from "../../data/mock-spcrs.json"

const meta: Meta<typeof StaffAnalytics> = {
  title: "Staff Planning/StaffAnalytics",
  component: StaffAnalytics,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Staff Analytics Component

Provides comprehensive analytics and insights for workforce management including utilization metrics, cost analysis, and performance indicators.

## Features

- **Key Metrics**: Total employees, allocation status, completion rates
- **Visual Charts**: Position distribution, project staffing, cost trends
- **Action Items**: Critical issues requiring attention
- **Interactive Elements**: Click-through for detailed views
- **Real-time Data**: Updates based on current assignments and schedules

## Analytics Provided

- Employee allocation and utilization
- Labor cost trends and projections
- Position distribution across projects
- Project completion rates
- Resource conflicts and recommendations
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
type Story = StoryObj<typeof StaffAnalytics>

export const Default: Story = {
  args: {
    employees: mockEmployees.employees,
    projects: mockProjects.projects,
    spcrs: mockSpcrs.spcrs,
  },
  parameters: {
    docs: {
      description: {
        story: "Default analytics view with standard metrics and charts.",
      },
    },
  },
}

export const HighUtilization: Story = {
  args: {
    employees: mockEmployees.employees.map((emp) => ({
      ...emp,
      laborRate: emp.laborRate * 1.2, // Increase rates to show high utilization
    })),
    projects: mockProjects.projects,
    spcrs: mockSpcrs.spcrs,
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics showing high resource utilization with potential overallocation warnings.",
      },
    },
  },
}

export const LowUtilization: Story = {
  args: {
    employees: mockEmployees.employees.slice(0, 30), // Fewer employees
    projects: mockProjects.projects,
    spcrs: mockSpcrs.spcrs,
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics showing low utilization with available capacity and underutilized resources.",
      },
    },
  },
}

export const WithActionItems: Story = {
  args: {
    employees: mockEmployees.employees,
    projects: mockProjects.projects,
    spcrs: [
      ...mockSpcrs.spcrs,
      // Add more SPCRs to trigger action items
      {
        id: "spcr-urgent-1",
        projectId: "401001",
        type: "increase",
        position: "Safety Manager",
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-12-31T23:59:59Z",
        scheduleRef: "Critical Phase",
        budget: 95000,
        explanation: "Urgent safety manager needed for high-risk phase",
        status: "submitted",
        createdBy: "emp-001",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics with multiple action items requiring immediate attention.",
      },
    },
  },
}

export const ProjectFocused: Story = {
  args: {
    employees: mockEmployees.employees.filter((emp) =>
      ["401001", "401002", "401003"].includes(emp.assignment.projectId),
    ),
    projects: mockProjects.projects.slice(0, 3),
    spcrs: mockSpcrs.spcrs.filter((spcr) => ["401001", "401002", "401003"].includes(spcr.projectId)),
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics focused on a subset of projects, useful for project-specific views.",
      },
    },
  },
}

export const EmptyState: Story = {
  args: {
    employees: [],
    projects: [],
    spcrs: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state analytics when no data is available.",
      },
    },
  },
}
