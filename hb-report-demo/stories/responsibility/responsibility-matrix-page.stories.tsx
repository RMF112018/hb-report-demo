import type { Meta, StoryObj } from "@storybook/react"
import ResponsibilityMatrixPage from "@/app/dashboard/responsibility-matrix/page"

const meta: Meta<typeof ResponsibilityMatrixPage> = {
  title: "Responsibility/ResponsibilityMatrixPage",
  component: ResponsibilityMatrixPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The ResponsibilityMatrixPage is the main container component for the
HB Report Responsibility Matrix feature, providing a comprehensive
interface for managing project responsibilities and accountability.

## Page Structure
- **Component Title Container**: Sticky header with actions and metrics
- **Analytics Section**: Key performance indicators and insights
- **HBI Insights**: AI-powered recommendations and risk analysis
- **Filter Controls**: Search and filtering capabilities
- **Matrix Tabs**: Team, Prime Contract, and Subcontract matrices
- **Settings Panel**: Role and category management

## Key Features
- Role-based access control (PM, PX, Executive)
- Real-time task management with CRUD operations
- Interactive RACI assignment system
- Comprehensive analytics and reporting
- Export capabilities with multiple formats
- AIA compliance validation and formatting

## User Roles
- **Project Manager (PM)**: Create and manage tasks, submit for approval
- **Project Executive (PX)**: Review and approve tasks, manage settings
- **Executive**: View approved tasks and reports (read-only)

## Data Integration
- Loads from /data/mock-responsibility-tasks.json
- Supports role assignments from /data/mock-role-assignments.json
- Real-time updates with optimistic UI patterns

## Navigation
Accessed via the main dashboard navigation under Project Management
or directly at /dashboard/responsibility-matrix
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ResponsibilityMatrixPage>

export const ProjectManagerView: Story = {
  parameters: {
    docs: {
      description: {
        story: "Full page view for Project Managers with task creation and management capabilities.",
      },
    },
    mockData: {
      user: {
        role: "PM",
        name: "John Smith",
        permissions: ["create", "edit", "submit"],
      },
    },
  },
}

export const ProjectExecutiveView: Story = {
  parameters: {
    docs: {
      description: {
        story: "Full page view for Project Executives with approval and settings access.",
      },
    },
    mockData: {
      user: {
        role: "PX",
        name: "Sarah Johnson",
        permissions: ["create", "edit", "approve", "settings"],
      },
    },
  },
}

export const ExecutiveView: Story = {
  parameters: {
    docs: {
      description: {
        story: "Read-only view for Executives showing approved tasks and analytics.",
      },
    },
    mockData: {
      user: {
        role: "Executive",
        name: "Michael Chen",
        permissions: ["view"],
      },
    },
  },
}

export const NewProject: Story = {
  parameters: {
    docs: {
      description: {
        story: "Page view for a new project with minimal data and setup guidance.",
      },
    },
    mockData: {
      tasks: [],
      showOnboarding: true,
    },
  },
}

export const ProjectWithIssues: Story = {
  parameters: {
    docs: {
      description: {
        story: "Page view showing a project with issues requiring attention.",
      },
    },
    mockData: {
      hasUnassignedTasks: true,
      hasOverloadedRoles: true,
      lowCompletionRate: true,
    },
  },
}
