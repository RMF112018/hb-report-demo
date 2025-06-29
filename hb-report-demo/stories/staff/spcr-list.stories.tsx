import type { Meta, StoryObj } from "@storybook/react"
import { SPCRList } from "../../components/staff/SPCRList"
import { AuthProvider } from "../../lib/auth-context"

// Mock data
import mockSpcrs from "../../data/mock-spcrs.json"
import mockProjects from "../../data/mock-projects.json"

const meta: Meta<typeof SPCRList> = {
  title: "Staff Planning/SPCRList",
  component: SPCRList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# SPCR List Component

A comprehensive list view for managing Staffing Plan Change Requests with advanced filtering, sorting, and bulk operations.

## Features

- **Advanced Filtering**: Filter by status, project, type, and search terms
- **Role-based Actions**: Different actions available based on user permissions
- **Status Management**: Visual status indicators and workflow management
- **Bulk Operations**: Select multiple SPCRs for bulk approval/rejection
- **Export Functionality**: Export filtered results to various formats

## SPCR Statuses

- **Draft**: Editable by creator
- **Submitted**: Pending approval
- **Approved**: Approved and ready for implementation
- **Rejected**: Rejected with feedback
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
type Story = StoryObj<typeof SPCRList>

const mockActions = {
  onEdit: (spcr: any) => console.log("Edit SPCR:", spcr.id),
  onApprove: (spcr: any) => console.log("Approve SPCR:", spcr.id),
  onReject: (spcr: any) => console.log("Reject SPCR:", spcr.id),
  onView: (spcr: any) => console.log("View SPCR:", spcr.id),
  onWithdraw: (spcr: any) => console.log("Withdraw SPCR:", spcr.id),
}

export const AllSPCRs: Story = {
  args: {
    spcrs: mockSpcrs.spcrs,
    projects: mockProjects.projects,
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Complete list of all SPCRs showing various statuses and types.",
      },
    },
  },
}

export const PendingApproval: Story = {
  args: {
    spcrs: mockSpcrs.spcrs.filter((spcr) => spcr.status === "submitted"),
    projects: mockProjects.projects,
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "SPCRs filtered to show only those pending approval.",
      },
    },
  },
}

export const ApprovedSPCRs: Story = {
  args: {
    spcrs: mockSpcrs.spcrs.filter((spcr) => spcr.status === "approved"),
    projects: mockProjects.projects,
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "SPCRs that have been approved and are ready for implementation.",
      },
    },
  },
}

export const DraftSPCRs: Story = {
  args: {
    spcrs: mockSpcrs.spcrs.filter((spcr) => spcr.status === "draft"),
    projects: mockProjects.projects,
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Draft SPCRs that are still being edited by their creators.",
      },
    },
  },
}

export const StaffIncreases: Story = {
  args: {
    spcrs: mockSpcrs.spcrs.filter((spcr) => spcr.type === "increase"),
    projects: mockProjects.projects,
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "SPCRs filtered to show only staff increase requests.",
      },
    },
  },
}

export const StaffDecreases: Story = {
  args: {
    spcrs: mockSpcrs.spcrs.filter((spcr) => spcr.type === "decrease"),
    projects: mockProjects.projects,
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "SPCRs filtered to show only staff decrease requests.",
      },
    },
  },
}

export const SingleProject: Story = {
  args: {
    spcrs: mockSpcrs.spcrs.filter((spcr) => spcr.projectId === "401001"),
    projects: mockProjects.projects,
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "SPCRs filtered to show only those for a specific project.",
      },
    },
  },
}

export const EmptyState: Story = {
  args: {
    spcrs: [],
    projects: mockProjects.projects,
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when no SPCRs match the current filters.",
      },
    },
  },
}

export const HighVolumeData: Story = {
  args: {
    spcrs: [
      ...mockSpcrs.spcrs,
      // Duplicate data to simulate high volume
      ...mockSpcrs.spcrs.map((spcr) => ({
        ...spcr,
        id: `${spcr.id}-dup`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      })),
    ],
    projects: mockProjects.projects,
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "SPCR list with high volume of data to test performance and pagination.",
      },
    },
  },
}
