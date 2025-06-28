import type { Meta, StoryObj } from "@storybook/react"
import { ApprovalWorkflow } from "../../components/staff/ApprovalWorkflow"
import { AuthProvider } from "../../lib/auth-context"

// Mock data
import mockSpcrs from "../../data/mock-spcrs.json"

const meta: Meta<typeof ApprovalWorkflow> = {
  title: "Staff Planning/ApprovalWorkflow",
  component: ApprovalWorkflow,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Approval Workflow Component

A comprehensive workflow interface for reviewing and approving/rejecting SPCRs with detailed context and approval history.

## Features

- **Detailed Review**: Complete SPCR information with project context
- **Approval History**: Track of all approval actions and comments
- **Bulk Operations**: Approve or reject multiple SPCRs at once
- **Comment System**: Required comments for all approval decisions
- **Role-based Access**: Only authorized users can approve/reject

## Workflow States

- **Single SPCR**: Review individual requests
- **Bulk Mode**: Process multiple requests simultaneously
- **History View**: Track approval progression
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
type Story = StoryObj<typeof ApprovalWorkflow>

const mockActions = {
  onApprove: (spcrId: string, comment: string) => {
    console.log(`Approved SPCR ${spcrId} with comment: ${comment}`)
    alert(`SPCR ${spcrId} approved!`)
  },
  onReject: (spcrId: string, comment: string) => {
    console.log(`Rejected SPCR ${spcrId} with comment: ${comment}`)
    alert(`SPCR ${spcrId} rejected!`)
  },
  onClose: () => {
    console.log("Approval workflow closed")
  },
}

export const PendingSPCR: Story = {
  args: {
    spcr: mockSpcrs.spcrs.find((spcr) => spcr.status === "submitted") || mockSpcrs.spcrs[0],
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Single SPCR pending approval with full workflow interface.",
      },
    },
  },
}

export const StaffIncrease: Story = {
  args: {
    spcr: mockSpcrs.spcrs.find((spcr) => spcr.type === "increase" && spcr.status === "submitted") || {
      ...mockSpcrs.spcrs[0],
      type: "increase",
      status: "submitted",
      budget: 85000,
    },
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Approval workflow for a staff increase request.",
      },
    },
  },
}

export const StaffDecrease: Story = {
  args: {
    spcr: mockSpcrs.spcrs.find((spcr) => spcr.type === "decrease") || {
      ...mockSpcrs.spcrs[0],
      type: "decrease",
      status: "submitted",
      budget: -45000,
    },
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Approval workflow for a staff decrease request.",
      },
    },
  },
}

export const AlreadyApproved: Story = {
  args: {
    spcr: {
      ...mockSpcrs.spcrs[0],
      status: "approved",
    },
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Workflow view for an already approved SPCR (read-only mode).",
      },
    },
  },
}

export const RejectedSPCR: Story = {
  args: {
    spcr: {
      ...mockSpcrs.spcrs[0],
      status: "rejected",
    },
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Workflow view for a rejected SPCR showing rejection status.",
      },
    },
  },
}

export const BulkApproval: Story = {
  args: {
    spcr: mockSpcrs.spcrs[0],
    mode: "bulk",
    selectedSpcrs: mockSpcrs.spcrs.filter((spcr) => spcr.status === "submitted").slice(0, 3),
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Bulk approval workflow for processing multiple SPCRs simultaneously.",
      },
    },
  },
}

export const HighBudgetImpact: Story = {
  args: {
    spcr: {
      ...mockSpcrs.spcrs[0],
      budget: 150000,
      position: "General Superintendent",
      explanation:
        "Critical project phase requires experienced general superintendent to ensure quality and schedule compliance. High-value project with significant risk exposure.",
      status: "submitted",
    },
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Approval workflow for high-budget impact SPCR requiring careful review.",
      },
    },
  },
}

export const UrgentRequest: Story = {
  args: {
    spcr: {
      ...mockSpcrs.spcrs[0],
      position: "Safety Manager",
      explanation:
        "URGENT: Safety incident requires immediate additional safety oversight. Critical for project continuation and regulatory compliance.",
      status: "submitted",
      createdAt: new Date().toISOString(), // Just created
    },
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Urgent SPCR requiring immediate attention and fast-track approval.",
      },
    },
  },
}
