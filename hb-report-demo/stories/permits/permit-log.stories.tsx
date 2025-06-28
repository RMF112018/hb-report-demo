import type { Meta, StoryObj } from "@storybook/react"
import { within, userEvent, expect } from "@storybook/test"
import PermitLogPage from "@/app/dashboard/permit-log/page"
import { AuthProvider } from "@/lib/auth-context"

const meta: Meta<typeof PermitLogPage> = {
  title: "Permits/PermitLogPage",
  component: PermitLogPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Permit Log & Tracking Page

The main dashboard page for comprehensive permit management and inspection tracking. Features role-based access control, real-time analytics, and AIA-compliant reporting capabilities.

## Features
- **Role-based Access Control**: Different views for Admin, Executive, Project Executive, and PM roles
- **Real-time Analytics**: Live permit statistics and performance metrics
- **Interactive Calendar**: Visual timeline of permits and inspections
- **Advanced Filtering**: Multi-criteria filtering with saved filter sets
- **HBI AI Insights**: Intelligent recommendations and alerts
- **Export Capabilities**: AIA-compliant PDF, Excel, and CSV exports
- **Email Distribution**: Automated report distribution to stakeholders

## Page Structure
- **Component Title Container**: Sticky header with title, stats, and action buttons
- **Analytics Section**: Key metrics and performance indicators
- **Filter Panel**: Collapsible advanced filtering options
- **Tabbed Content**: Overview, Permits, Inspections, Calendar, Analytics, Reports
- **Modal Overlays**: Forms, exports, and detailed views

## AIA Compliance
- Follows AIA document standards for construction reporting
- Includes proper headers, footers, and certification information
- Maintains audit trails and approval workflows
        `,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const userRole = context.args.userRole || "admin"
      const mockUser = {
        id: "user-1",
        name: "Test User",
        email: "test@company.com",
        role: userRole,
        avatar: "/placeholder-user.jpg",
      }

      return (
        <AuthProvider initialUser={mockUser}>
          <div className="min-h-screen bg-gray-50">
            <Story />
          </div>
        </AuthProvider>
      )
    },
  ],
  argTypes: {
    userRole: {
      control: "select",
      options: ["admin", "executive", "project-executive", "project-manager"],
      description: "User role for access control testing",
    },
  },
}

export default meta
type Story = StoryObj<typeof PermitLogPage>

export const AdminView: Story = {
  args: {
    userRole: "admin",
  },
  parameters: {
    docs: {
      description: {
        story: "Admin view with full access to all permits, analytics, and management features.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify admin-specific elements
    await expect(canvas.getByText("New Permit")).toBeInTheDocument()
    await expect(canvas.getByText("Export")).toBeInTheDocument()
    await expect(canvas.getByText("Settings")).toBeInTheDocument()

    // Check analytics section
    await expect(canvas.getByText("Total Permits")).toBeInTheDocument()
    await expect(canvas.getByText("Approved")).toBeInTheDocument()

    // Test tab navigation
    const inspectionsTab = canvas.getByRole("tab", { name: /inspections/i })
    await userEvent.click(inspectionsTab)

    // Verify inspection view loads
    await expect(canvas.getByText("Inspection Management")).toBeInTheDocument()
  },
}

export const ExecutiveView: Story = {
  args: {
    userRole: "executive",
  },
  parameters: {
    docs: {
      description: {
        story: "Executive view with access to all projects and high-level analytics.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify executive dashboard elements
    await expect(canvas.getByText("Permit Log & Tracking")).toBeInTheDocument()
    await expect(canvas.getByText("Analytics")).toBeInTheDocument()

    // Test analytics tab
    const analyticsTab = canvas.getByRole("tab", { name: /analytics/i })
    await userEvent.click(analyticsTab)
  },
}

export const ProjectExecutiveView: Story = {
  args: {
    userRole: "project-executive",
  },
  parameters: {
    docs: {
      description: {
        story: "Project Executive view with access to assigned projects only.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify limited access
    await expect(canvas.getByText("New Permit")).toBeInTheDocument()

    // Test calendar view
    const calendarTab = canvas.getByRole("tab", { name: /calendar/i })
    await userEvent.click(calendarTab)

    await expect(canvas.getByText("Permit & Inspection Calendar")).toBeInTheDocument()
  },
}

export const ProjectManagerView: Story = {
  args: {
    userRole: "project-manager",
  },
  parameters: {
    docs: {
      description: {
        story: "Project Manager view with access to single active project.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify PM-specific view
    await expect(canvas.getByText("Permit Log & Tracking")).toBeInTheDocument()

    // Test filtering
    const filtersButton = canvas.getByText("Filters")
    await userEvent.click(filtersButton)

    // Verify filter panel opens
    await expect(canvas.getByText("Filter Permits")).toBeInTheDocument()
  },
}

export const WithActiveFilters: Story = {
  args: {
    userRole: "admin",
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates the interface with active filters applied.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Open filters
    const filtersButton = canvas.getByText("Filters")
    await userEvent.click(filtersButton)

    // Apply status filter
    const statusSelect = canvas.getByRole("combobox", { name: /status/i })
    await userEvent.click(statusSelect)

    // Select approved status
    const approvedOption = canvas.getByText("Approved")
    await userEvent.click(approvedOption)

    // Verify active filter badge
    await expect(canvas.getByText(/active/i)).toBeInTheDocument()
  },
}

export const EmptyState: Story = {
  args: {
    userRole: "project-manager",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the empty state when no permits match the current filters.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Apply restrictive filter to show empty state
    const filtersButton = canvas.getByText("Filters")
    await userEvent.click(filtersButton)

    // Set a date range that excludes all permits
    const startDateInput = canvas.getByLabelText("Start Date")
    await userEvent.type(startDateInput, "2030-01-01")

    const endDateInput = canvas.getByLabelText("End Date")
    await userEvent.type(endDateInput, "2030-12-31")
  },
}
