import type { Meta, StoryObj } from "@storybook/react"
import { StaffPlanningPage } from "../../app/dashboard/staff-planning/page"
import { AuthProvider } from "../../lib/auth-context"

const meta: Meta<typeof StaffPlanningPage> = {
  title: "Staff Planning/StaffPlanningPage",
  component: StaffPlanningPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Staff Planning Page

The main staff planning dashboard that provides comprehensive workforce management capabilities including:

- **Staff Overview**: Current assignments and availability
- **SPCR Management**: Create, review, and approve staffing change requests
- **Analytics**: Resource utilization and performance metrics
- **HBI Insights**: AI-powered staffing recommendations

## Features

- Role-based access control (Admin, Executive, Project Executive, PM)
- Interactive Gantt chart for schedule visualization
- Real-time analytics and reporting
- AI-driven staffing insights and recommendations
- Bulk operations for efficient workforce management

## Usage

The page automatically adapts based on user role and permissions, showing relevant tools and data for each user type.
        `,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Story />
        </div>
      </AuthProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof StaffPlanningPage>

// Mock user contexts
const mockUsers = {
  admin: {
    id: "user-admin",
    email: "admin@hbreport.com",
    name: "Admin User",
    firstName: "Admin",
    lastName: "User",
    role: "admin" as const,
  },
  executive: {
    id: "user-exec",
    email: "executive@hbreport.com",
    name: "Executive User",
    firstName: "Executive",
    lastName: "User",
    role: "executive" as const,
  },
  projectExecutive: {
    id: "emp-001",
    email: "pe@hbreport.com",
    name: "Sarah Johnson",
    firstName: "Sarah",
    lastName: "Johnson",
    role: "project-executive" as const,
  },
  projectManager: {
    id: "emp-003",
    email: "pm@hbreport.com",
    name: "Jennifer Liu",
    firstName: "Jennifer",
    lastName: "Liu",
    role: "project-manager" as const,
  },
}

export const AdminView: Story = {
  name: "Admin View",
  parameters: {
    docs: {
      description: {
        story:
          "Admin users have full access to all staff planning features including bulk operations, system settings, and comprehensive analytics.",
      },
    },
    mockData: [
      {
        url: "/api/auth/user",
        method: "GET",
        status: 200,
        response: mockUsers.admin,
      },
    ],
  },
}

export const ExecutiveView: Story = {
  name: "Executive View",
  parameters: {
    docs: {
      description: {
        story:
          "Executive users can view all projects, approve SPCRs, and access strategic analytics across the organization.",
      },
    },
    mockData: [
      {
        url: "/api/auth/user",
        method: "GET",
        status: 200,
        response: mockUsers.executive,
      },
    ],
  },
}

export const ProjectExecutiveView: Story = {
  name: "Project Executive View",
  parameters: {
    docs: {
      description: {
        story:
          "Project Executives can manage their assigned projects, approve SPCRs for their projects, and view project-specific analytics.",
      },
    },
    mockData: [
      {
        url: "/api/auth/user",
        method: "GET",
        status: 200,
        response: mockUsers.projectExecutive,
      },
    ],
  },
}

export const ProjectManagerView: Story = {
  name: "Project Manager View",
  parameters: {
    docs: {
      description: {
        story:
          "Project Managers can create SPCRs, view their project assignments, and access AI insights for their projects.",
      },
    },
    mockData: [
      {
        url: "/api/auth/user",
        method: "GET",
        status: 200,
        response: mockUsers.projectManager,
      },
    ],
  },
}

export const WithHighActivityData: Story = {
  name: "High Activity Scenario",
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the interface with high activity - multiple pending SPCRs, active insights, and busy schedules.",
      },
    },
    mockData: [
      {
        url: "/api/auth/user",
        method: "GET",
        status: 200,
        response: mockUsers.admin,
      },
    ],
  },
}

export const EmptyState: Story = {
  name: "Empty State",
  parameters: {
    docs: {
      description: {
        story:
          "Shows the interface when no data is available - useful for new installations or filtered views with no results.",
      },
    },
    mockData: [
      {
        url: "/api/auth/user",
        method: "GET",
        status: 200,
        response: mockUsers.admin,
      },
    ],
  },
}
