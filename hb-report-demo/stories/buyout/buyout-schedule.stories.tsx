import type { Meta, StoryObj } from "@storybook/react"
import { BuyoutSchedulePage } from "../../app/dashboard/buyout-schedule/page"
import { AuthProvider } from "../../lib/auth-context"

const meta: Meta<typeof BuyoutSchedulePage> = {
  title: "Buyout/BuyoutSchedulePage",
  component: BuyoutSchedulePage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Buyout Schedule Page

The main dashboard for managing subcontract buyouts and material procurement across all projects. 
This component provides comprehensive oversight of the procurement process with role-based access control.

## Features
- **Multi-project overview** with filtering and search capabilities
- **Role-based access control** (PM, PX, Executive)
- **Real-time analytics** and insights
- **Material procurement tracking** with delivery schedules
- **Vendor management** and performance metrics
- **AIA compliance** monitoring and reporting

## User Roles
- **PM (Project Manager)**: Full CRUD access, can create and edit buyouts
- **PX (Project Executive)**: Review and approval capabilities
- **Executive**: Read-only access for oversight

## Data Sources
- Buyout records from mock-buyout-records.json
- Material procurement from mock-material-procurement.json
- Real-time API integrations (BuildingConnected, Compass, SiteMate, Procore, Sage 300)
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Story />
        </div>
      </AuthProvider>
    ),
  ],
  argTypes: {
    userRole: {
      control: { type: "select" },
      options: ["PM", "PX", "Executive"],
      description: "User role determining access level and available actions",
    },
    projectFilter: {
      control: { type: "text" },
      description: "Filter buyouts by project ID or name",
    },
    statusFilter: {
      control: { type: "select" },
      options: ["all", "active", "pending", "completed", "on-hold"],
      description: "Filter buyouts by status",
    },
  },
}

export default meta
type Story = StoryObj<typeof BuyoutSchedulePage>

// Mock user context for stories
const mockUsers = {
  pm: {
    id: "user_pm_001",
    name: "Sarah Johnson",
    role: "PM" as const,
    email: "sarah.johnson@hbconstruction.com",
    projects: ["proj_001", "proj_002"],
  },
  px: {
    id: "user_px_001",
    name: "Michael Chen",
    role: "PX" as const,
    email: "michael.chen@hbconstruction.com",
    projects: ["proj_001", "proj_002", "proj_003"],
  },
  executive: {
    id: "user_exec_001",
    name: "Jennifer Liu",
    role: "Executive" as const,
    email: "jennifer.liu@hbconstruction.com",
    projects: ["proj_001", "proj_002", "proj_003"],
  },
}

export const ProjectManagerView: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Project Manager View** - Full access to create, edit, and manage buyout records.

Features available:
- Create new buyout records
- Edit existing records
- Add material procurement items
- Submit for PX approval
- View analytics and insights
- Export reports

The PM has full CRUD capabilities and can manage all aspects of the buyout process.
        `,
      },
    },
    mockData: {
      user: mockUsers.pm,
      permissions: ["create", "read", "update", "delete", "submit"],
    },
  },
  args: {
    userRole: "PM",
  },
}

export const ProjectExecutiveView: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Project Executive View** - Review and approval capabilities with oversight features.

Features available:
- Review submitted buyout records
- Approve or reject submissions
- View detailed analytics
- Monitor compliance status
- Access cross-project insights
- Generate executive reports

The PX focuses on approval workflows and strategic oversight.
        `,
      },
    },
    mockData: {
      user: mockUsers.px,
      permissions: ["read", "approve", "reject", "review"],
    },
  },
  args: {
    userRole: "PX",
  },
}

export const ExecutiveView: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Executive View** - Read-only access for high-level oversight and reporting.

Features available:
- View all approved buyout records
- Access company-wide analytics
- Monitor portfolio performance
- Review compliance metrics
- Export executive dashboards

Executives have read-only access focused on strategic insights and portfolio oversight.
        `,
      },
    },
    mockData: {
      user: mockUsers.executive,
      permissions: ["read", "view_analytics", "export"],
    },
  },
  args: {
    userRole: "Executive",
  },
}

export const WithActiveFilters: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Filtered View** - Demonstrates the filtering and search capabilities.

This story shows how users can filter buyouts by:
- Project selection
- Status (active, pending, completed)
- Vendor name
- Date ranges
- Compliance status

The filtering system helps users focus on relevant records and improves workflow efficiency.
        `,
      },
    },
  },
  args: {
    userRole: "PM",
    projectFilter: "proj_001",
    statusFilter: "active",
  },
}

export const LoadingState: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Loading State** - Shows the loading experience while data is being fetched.

Features:
- Skeleton loading animations
- Progress indicators
- API connection status
- Graceful loading transitions

This ensures users have feedback during data loading operations.
        `,
      },
    },
    mockData: {
      loading: true,
      apiConnections: {
        buildingConnected: "loading",
        compass: "loading",
        siteMate: "loading",
        procore: "connected",
        sage300: "connected",
      },
    },
  },
  args: {
    userRole: "PM",
  },
}

export const ErrorState: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Error State** - Demonstrates error handling and recovery options.

Features:
- Clear error messaging
- Retry functionality
- Fallback data display
- User guidance for resolution

This ensures robust error handling and user experience continuity.
        `,
      },
    },
    mockData: {
      error: "Failed to load buyout data. Please check your connection and try again.",
      hasRetry: true,
    },
  },
  args: {
    userRole: "PM",
  },
}

export const EmptyState: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Empty State** - Shows the experience when no buyout records exist.

Features:
- Helpful empty state messaging
- Call-to-action buttons
- Getting started guidance
- Template suggestions

This guides new users through creating their first buyout records.
        `,
      },
    },
    mockData: {
      buyoutRecords: [],
      materialRecords: [],
      isEmpty: true,
    },
  },
  args: {
    userRole: "PM",
  },
}
