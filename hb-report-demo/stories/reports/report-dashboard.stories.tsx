import type { Meta, StoryObj } from "@storybook/react"
import { ReportDashboard } from "../../components/reports/report-dashboard"
import { mockReports } from "../../public/data/mock-reports.json"
import { mockProjects } from "../../public/data/mock-projects.json"

const meta: Meta<typeof ReportDashboard> = {
  title: "Reports/ReportDashboard",
  component: ReportDashboard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Main dashboard for managing construction project reports. Provides different views and capabilities based on user role (PM, PX, Executive).",
      },
    },
  },
  argTypes: {
    userRole: {
      control: "select",
      options: ["PM", "PX", "Executive"],
      description: "User role determining available actions and views",
    },
    userId: {
      control: "text",
      description: "Current user ID for permission checking",
    },
  },
}

export default meta
type Story = StoryObj<typeof ReportDashboard>

// PM Role - Can create, edit, and submit reports
export const ProjectManagerView: Story = {
  args: {
    userRole: "PM",
    userId: "user-001",
    reports: mockReports.reports.filter((r) => r.creatorId === "user-001"),
    projects: mockProjects.projects.filter((p) => p.projectManager === "user-001"),
  },
  parameters: {
    docs: {
      description: {
        story: "Project Manager view showing reports they can create, edit, and submit for approval.",
      },
    },
  },
}

// PX Role - Can approve/reject reports and view all project reports
export const ProjectExecutiveView: Story = {
  args: {
    userRole: "PX",
    userId: "user-005",
    reports: mockReports.reports.filter((r) => r.approverId === "user-005"),
    projects: mockProjects.projects.filter((p) => p.projectExecutive === "user-005"),
  },
  parameters: {
    docs: {
      description: {
        story: "Project Executive view with approval workflow and oversight capabilities.",
      },
    },
  },
}

// Executive Role - Read-only access to all reports
export const ExecutiveView: Story = {
  args: {
    userRole: "Executive",
    userId: "user-008",
    reports: mockReports.reports,
    projects: mockProjects.projects,
  },
  parameters: {
    docs: {
      description: {
        story: "Executive view providing read-only access to all reports across projects.",
      },
    },
  },
}

// Empty State
export const EmptyState: Story = {
  args: {
    userRole: "PM",
    userId: "user-999",
    reports: [],
    projects: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Dashboard state when no reports or projects are available.",
      },
    },
  },
}
