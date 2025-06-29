import type { Meta, StoryObj } from "@storybook/react"
import { ReportDistribution } from "../../components/reports/report-distribution"
import { mockProjects } from "../../public/data/mock-projects.json"
import { mockReports } from "../../public/data/mock-reports.json"

const meta: Meta<typeof ReportDistribution> = {
  title: "Reports/ReportDistribution",
  component: ReportDistribution,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Email distribution configuration for Monthly Owner Reports with recipient management, section selection, and email preview.",
      },
    },
  },
  argTypes: {
    projectId: {
      control: "text",
      description: "Project ID for distribution settings",
    },
    reportId: {
      control: "text",
      description: "Report ID being configured for distribution",
    },
    isOpen: {
      control: "boolean",
      description: "Whether the distribution dialog is open",
    },
  },
}

export default meta
type Story = StoryObj<typeof ReportDistribution>

// New Distribution Setup
export const NewDistributionSetup: Story = {
  args: {
    projectId: "proj-001",
    project: mockProjects.projects[0],
    reportId: "rpt-new",
    reportType: "monthly-owner",
    isOpen: true,
    onClose: () => console.log("Distribution closed"),
    onSave: (config) => console.log("Distribution saved:", config),
    onSend: (config) => console.log("Distribution sent:", config),
  },
  parameters: {
    docs: {
      description: {
        story: "Setting up email distribution for a new Monthly Owner report.",
      },
    },
  },
}

// Existing Distribution Edit
export const ExistingDistributionEdit: Story = {
  args: {
    projectId: "proj-002",
    project: mockProjects.projects[1],
    reportId: "rpt-005",
    report: mockReports.reports[4],
    reportType: "monthly-owner",
    isOpen: true,
    existingDistribution: mockReports.reports[4].distributionSettings,
    onClose: () => console.log("Distribution closed"),
    onSave: (config) => console.log("Distribution updated:", config),
    onSend: (config) => console.log("Distribution sent:", config),
  },
  parameters: {
    docs: {
      description: {
        story: "Editing distribution settings for an existing published report.",
      },
    },
  },
}

// Preview Mode
export const PreviewMode: Story = {
  args: {
    projectId: "proj-003",
    project: mockProjects.projects[2],
    reportId: "rpt-003",
    report: mockReports.reports[2],
    reportType: "monthly-owner",
    isOpen: true,
    mode: "preview",
    onClose: () => console.log("Distribution closed"),
  },
  parameters: {
    docs: {
      description: {
        story: "Preview mode showing email content and recipient list before sending.",
      },
    },
  },
}

// Distribution with Custom Recipients
export const CustomRecipients: Story = {
  args: {
    projectId: "proj-001",
    project: mockProjects.projects[0],
    reportId: "rpt-001",
    reportType: "monthly-owner",
    isOpen: true,
    customRecipients: [
      "owner@riversidemedical.com",
      "architect@designpartners.com",
      "consultant@structuraleng.com",
      "custom@recipient.com",
    ],
    onClose: () => console.log("Distribution closed"),
    onSave: (config) => console.log("Distribution saved:", config),
  },
  parameters: {
    docs: {
      description: {
        story: "Distribution setup with custom recipient list beyond project defaults.",
      },
    },
  },
}

// Scheduled Distribution
export const ScheduledDistribution: Story = {
  args: {
    projectId: "proj-002",
    project: mockProjects.projects[1],
    reportId: "rpt-002",
    reportType: "monthly-owner",
    isOpen: true,
    scheduledDelivery: "2024-12-25T09:00:00Z",
    autoDistribute: true,
    onClose: () => console.log("Distribution closed"),
    onSchedule: (config) => console.log("Distribution scheduled:", config),
  },
  parameters: {
    docs: {
      description: {
        story: "Setting up scheduled automatic distribution for monthly reports.",
      },
    },
  },
}
