import type { Meta, StoryObj } from "@storybook/react"
import { StaffTable } from "../../components/staff/StaffTable"
import { AuthProvider } from "../../lib/auth-context"

// Mock data
import mockEmployees from "../../data/mock-employees.json"
import mockProjects from "../../data/mock-projects.json"

const meta: Meta<typeof StaffTable> = {
  title: "Staff Planning/StaffTable",
  component: StaffTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Staff Table Component

A comprehensive table for displaying and managing staff assignments with advanced filtering, sorting, and bulk operations.

## Features

- **Advanced Filtering**: Filter by position, project, assignment status
- **Sorting**: Sort by any column with visual indicators
- **Bulk Operations**: Select multiple employees for bulk actions
- **Grouping**: Group by position or project for better organization
- **Export**: Export filtered data to various formats
- **Role-based Actions**: Different actions available based on user role

## Props

- \`employees\`: Array of employee data
- \`projects\`: Array of project data for cross-referencing
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <div className="p-6 bg-gray-50 min-h-screen">
          <Story />
        </div>
      </AuthProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof StaffTable>

export const Default: Story = {
  args: {
    employees: mockEmployees.employees.slice(0, 20),
    projects: mockProjects.projects,
  },
  parameters: {
    docs: {
      description: {
        story: "Default staff table with standard employee data and project assignments.",
      },
    },
  },
}

export const LargeDataset: Story = {
  args: {
    employees: mockEmployees.employees,
    projects: mockProjects.projects,
  },
  parameters: {
    docs: {
      description: {
        story: "Staff table with full dataset showing pagination and performance with larger data sets.",
      },
    },
  },
}

export const FilteredByPosition: Story = {
  args: {
    employees: mockEmployees.employees.filter(
      (emp) => emp.position.includes("Project Manager") || emp.position.includes("Superintendent"),
    ),
    projects: mockProjects.projects,
  },
  parameters: {
    docs: {
      description: {
        story: "Staff table filtered to show only Project Managers and Superintendents.",
      },
    },
  },
}

export const GroupedByProject: Story = {
  args: {
    employees: mockEmployees.employees.slice(0, 30),
    projects: mockProjects.projects,
  },
  parameters: {
    docs: {
      description: {
        story: "Staff table with employees grouped by their assigned projects.",
      },
    },
  },
}

export const WithUnassignedStaff: Story = {
  args: {
    employees: [
      ...mockEmployees.employees.slice(0, 15),
      {
        id: "emp-unassigned-1",
        name: "John Unassigned",
        position: "Project Manager I",
        assignment: {
          projectId: "unassigned",
          role: "Available",
          startDate: "2024-01-01T00:00:00Z",
          endDate: "2024-12-31T23:59:59Z",
        },
        laborRate: 65.0,
        billableRate: 130.0,
        experience: 5,
        strengths: ["Organization", "Communication"],
        weaknesses: ["Experience", "Leadership"],
      },
      {
        id: "emp-unassigned-2",
        name: "Jane Available",
        position: "Superintendent I",
        assignment: {
          projectId: "unassigned",
          role: "Available",
          startDate: "2024-01-01T00:00:00Z",
          endDate: "2024-12-31T23:59:59Z",
        },
        laborRate: 70.0,
        billableRate: 140.0,
        experience: 8,
        strengths: ["Field Operations", "Safety"],
        weaknesses: ["Technology", "Paperwork"],
      },
    ],
    projects: mockProjects.projects,
  },
  parameters: {
    docs: {
      description: {
        story: "Staff table showing both assigned and unassigned employees, useful for resource allocation.",
      },
    },
  },
}

export const EmptyState: Story = {
  args: {
    employees: [],
    projects: mockProjects.projects,
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when no employees match the current filters or no data is available.",
      },
    },
  },
}
