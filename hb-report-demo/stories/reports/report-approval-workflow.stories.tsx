import type { Meta, StoryObj } from "@storybook/react"
import { ReportApprovalWorkflow } from "../../components/reports/report-approval-workflow"
import { mockReports } from "../../public/data/mock-reports.json"

const meta: Meta<typeof ReportApprovalWorkflow> = {
  title: "Reports/ReportApprovalWorkflow",
  component: ReportApprovalWorkflow,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Workflow component for approving or rejecting reports with comments and status tracking.",
      },
    },
  },
  argTypes: {
    reportId: {
      control: "text",
      description: "ID of the report in the approval workflow",
    },
    userRole: {
      control: "select",
      options: ["PM", "PX", "Executive"],
      description: "User role determining approval permissions",
    },
    currentStatus: {
      control: "select",
      options: ["draft", "pending", "approved", "rejected", "published"],
      description: "Current status of the report",
    },
  },
}

export default meta
type Story = StoryObj<typeof ReportApprovalWorkflow>

// PX Approving Report
export const PXApprovingReport: Story = {
  args: {
    reportId: "rpt-002",
    report: mockReports.reports[1],
    userRole: "PX",
    userId: "user-006",
    currentStatus: "pending",
    onApprove: (reportId, comment) => console.log("Approved:", reportId, comment),
    onReject: (reportId, comment) => console.log("Rejected:", reportId, comment),
  },
  parameters: {
    docs: {
      description: {
        story: "Project Executive reviewing and approving a pending report.",
      },
    },
  },
}

// Report with Rejection Comments
export const ReportWithRejection: Story = {
  args: {
    reportId: "rpt-004",
    report: mockReports.reports[3],
    userRole: "PM",
    userId: "user-003",
    currentStatus: "rejected",
    showHistory: true,
  },
  parameters: {
    docs: {
      description: {
        story: "PM viewing a rejected report with feedback comments for revision.",
      },
    },
  },
}

// Approved Report History
export const ApprovedReportHistory: Story = {
  args: {
    reportId: "rpt-001",
    report: mockReports.reports[0],
    userRole: "Executive",
    userId: "user-008",
    currentStatus: "approved",
    showHistory: true,
    readOnly: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Executive viewing the approval history of a completed report.",
      },
    },
  },
}

// PM Submitting for Approval
export const PMSubmittingReport: Story = {
  args: {
    reportId: "rpt-003",
    report: mockReports.reports[2],
    userRole: "PM",
    userId: "user-001",
    currentStatus: "draft",
    onSubmit: (reportId) => console.log("Submitted for approval:", reportId),
  },
  parameters: {
    docs: {
      description: {
        story: "PM submitting a draft report for approval workflow.",
      },
    },
  },
}
