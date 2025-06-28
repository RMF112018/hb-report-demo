import type { Meta, StoryObj } from "@storybook/react"
import { BrowserRouter } from "react-router-dom"
import FieldReportsPage from "@/app/dashboard/field-reports/page"
import { AuthProvider } from "@/lib/auth-context"
import { mockUsers } from "./mock-data"

const meta: Meta<typeof FieldReportsPage> = {
  title: "Field Reports/FieldReportsPage",
  component: FieldReportsPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The FieldReportsPage is the main dashboard for field operations management.
It provides a comprehensive view of daily logs, manpower, safety audits, and quality inspections.

## Page Structure
- **Component Title Container**: Sticky header with title, description, and actions
- **Component Content Container**: Scrollable content area with analytics and data tables
- **Analytics Section**: Performance metrics and KPI cards
- **HBI Insights Section**: AI-powered analysis and recommendations
- **Main Content Area**: Tabbed interface for different data types

## Features
- **Role-based Access**: Data filtering based on user permissions
- **Advanced Filtering**: Search, project, status, contractor, and date filters
- **Real-time Analytics**: Live performance metrics and compliance tracking
- **Export Functionality**: Comprehensive report generation and distribution
- **Responsive Design**: Optimized for desktop and mobile devices

## User Roles
- **Admin**: Full access to all data and management functions
- **Executive**: High-level view across all projects
- **Project Executive**: Access to oversight projects
- **Project Manager**: Limited to assigned project data

## Data Integration
Integrates with Procore and SiteMate for:
- Daily activity logs and progress tracking
- Manpower allocation and efficiency metrics
- Safety audit results and compliance monitoring
- Quality inspection outcomes and defect tracking
        `,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <BrowserRouter>
        <AuthProvider>
          <div style={{ height: "100vh" }}>
            <Story {...context} />
          </div>
        </AuthProvider>
      </BrowserRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FieldReportsPage>

// Mock auth context wrapper
const withMockAuth = (user: any) => (Story: any) => {
  // Mock the useAuth hook
  const mockUseAuth = () => ({ user, login: () => {}, logout: () => {} })

  return (
    <div className="h-screen">
      <Story />
    </div>
  )
}

export const AdminDashboard: Story = {
  decorators: [withMockAuth(mockUsers.admin)],
  parameters: {
    docs: {
      description: {
        story: "Complete field reports dashboard for admin user with full data access and management capabilities.",
      },
    },
  },
}

export const ExecutiveDashboard: Story = {
  decorators: [withMockAuth(mockUsers.executive)],
  parameters: {
    docs: {
      description: {
        story: "Executive view of field reports dashboard focused on high-level performance metrics.",
      },
    },
  },
}

export const ProjectExecutiveDashboard: Story = {
  decorators: [withMockAuth(mockUsers.projectExecutive)],
  parameters: {
    docs: {
      description: {
        story: "Project executive dashboard with access to oversight projects and team management.",
      },
    },
  },
}

export const ProjectManagerDashboard: Story = {
  decorators: [withMockAuth(mockUsers.projectManager)],
  parameters: {
    docs: {
      description: {
        story: "Project manager dashboard focused on specific project data and operational details.",
      },
    },
  },
}

export const MobileView: Story = {
  decorators: [withMockAuth(mockUsers.projectManager)],
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Field reports dashboard optimized for mobile devices with responsive layout.",
      },
    },
  },
}

export const TabletView: Story = {
  decorators: [withMockAuth(mockUsers.projectExecutive)],
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story: "Field reports dashboard on tablet devices with adapted layout and navigation.",
      },
    },
  },
}
