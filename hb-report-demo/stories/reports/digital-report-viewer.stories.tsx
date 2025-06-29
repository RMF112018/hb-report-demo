import type { Meta, StoryObj } from "@storybook/react"
import { DigitalReportViewer } from "../../components/reports/digital-report-viewer"
import { mockReports } from "../../public/data/mock-reports.json"

const meta: Meta<typeof DigitalReportViewer> = {
  title: "Reports/DigitalReportViewer",
  component: DigitalReportViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Digital report viewer with PDF export capabilities and interactive navigation.",
      },
    },
  },
  argTypes: {
    reportId: {
      control: "text",
      description: "ID of the report to display",
    },
    isOpen: {
      control: "boolean",
      description: "Whether the viewer dialog is open",
    },
    userRole: {
      control: "select",
      options: ["PM", "PX", "Executive"],
      description: "User role for permission-based features",
    },
  },
}

export default meta
type Story = StoryObj<typeof DigitalReportViewer>

// Approved Financial Review
export const ApprovedFinancialReview: Story = {
  args: {
    reportId: "rpt-001",
    report: mockReports.reports[0],
    isOpen: true,
    userRole: "PM",
    onClose: () => console.log("Viewer closed"),
  },
  parameters: {
    docs: {
      description: {
        story: "Viewing an approved Financial Review report with full content and export options.",
      },
    },
  },
}

// Pending Monthly Progress Report
export const PendingMonthlyProgress: Story = {
  args: {
    reportId: "rpt-002",
    report: mockReports.reports[1],
    isOpen: true,
    userRole: "PX",
    onClose: () => console.log("Viewer closed"),
  },
  parameters: {
    docs: {
      description: {
        story: "Project Executive viewing a pending Monthly Progress report for approval.",
      },
    },
  },
}

// Published Owner Report
export const PublishedOwnerReport: Story = {
  args: {
    reportId: "rpt-005",
    report: mockReports.reports[4],
    isOpen: true,
    userRole: "Executive",
    onClose: () => console.log("Viewer closed"),
  },
  parameters: {
    docs: {
      description: {
        story: "Executive viewing a published Monthly Owner report with distribution details.",
      },
    },
  },
}

// Draft Report (PM View)
export const DraftReportPMView: Story = {
  args: {
    reportId: "rpt-003",
    report: mockReports.reports[2],
    isOpen: true,
    userRole: "PM",
    canEdit: true,
    onClose: () => console.log("Viewer closed"),
    onEdit: () => console.log("Edit report"),
  },
  parameters: {
    docs: {
      description: {
        story: "PM viewing their draft report with edit capabilities.",
      },
    },
  },
}
