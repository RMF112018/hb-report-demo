import type { Meta, StoryObj } from "@storybook/react"
import { EnhancedReportCustomizer } from "../../components/reports/enhanced-report-customizer"
import { mockReports } from "../../public/data/mock-reports.json"

const meta: Meta<typeof EnhancedReportCustomizer> = {
  title: "Reports/EnhancedReportCustomizer",
  component: EnhancedReportCustomizer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Advanced report customization interface allowing users to configure report sections, formatting, and content based on templates.",
      },
    },
  },
  argTypes: {
    reportType: {
      control: "select",
      options: ["financial-review", "monthly-progress", "monthly-owner"],
      description: "Type of report being customized",
    },
    projectId: {
      control: "text",
      description: "Project ID for report context",
    },
    isOpen: {
      control: "boolean",
      description: "Whether the customizer dialog is open",
    },
  },
}

export default meta
type Story = StoryObj<typeof EnhancedReportCustomizer>

// Financial Review Report Creation
export const FinancialReviewCreation: Story = {
  args: {
    reportType: "financial-review",
    projectId: "proj-001",
    isOpen: true,
    onClose: () => console.log("Customizer closed"),
    onSave: (config) => console.log("Report saved:", config),
  },
  parameters: {
    docs: {
      description: {
        story: "Creating a new Financial Review report with section customization.",
      },
    },
  },
}

// Monthly Progress Report with Template
export const MonthlyProgressFromTemplate: Story = {
  args: {
    reportType: "monthly-progress",
    projectId: "proj-002",
    templateId: "template-002",
    isOpen: true,
    onClose: () => console.log("Customizer closed"),
    onSave: (config) => console.log("Report saved:", config),
  },
  parameters: {
    docs: {
      description: {
        story: "Creating a Monthly Progress report using a predefined template.",
      },
    },
  },
}

// Monthly Owner Report with Distribution
export const MonthlyOwnerWithDistribution: Story = {
  args: {
    reportType: "monthly-owner",
    projectId: "proj-003",
    isOpen: true,
    showDistribution: true,
    onClose: () => console.log("Customizer closed"),
    onSave: (config) => console.log("Report saved:", config),
  },
  parameters: {
    docs: {
      description: {
        story: "Creating a Monthly Owner report with email distribution configuration.",
      },
    },
  },
}

// Editing Existing Report
export const EditingExistingReport: Story = {
  args: {
    reportType: "financial-review",
    projectId: "proj-001",
    reportId: "rpt-001",
    existingReport: mockReports.reports[0],
    isOpen: true,
    onClose: () => console.log("Customizer closed"),
    onSave: (config) => console.log("Report updated:", config),
  },
  parameters: {
    docs: {
      description: {
        story: "Editing an existing report with pre-populated configuration.",
      },
    },
  },
}
