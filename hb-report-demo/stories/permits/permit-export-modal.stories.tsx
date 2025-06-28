import type { Meta, StoryObj } from "@storybook/react"
import { within, userEvent, expect } from "@storybook/test"
import { PermitExportModal } from "@/components/permits/PermitExportModal"
import mockPermits from "@/data/mock-permits.json"
import type { Permit } from "@/types/permit-log"

const meta: Meta<typeof PermitExportModal> = {
  title: "Permits/PermitExportModal",
  component: PermitExportModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Permit Export Modal Component

Comprehensive export interface for generating AIA-compliant reports with email distribution capabilities.

## Features
- **Multiple Export Formats**: PDF, Excel, CSV with format-specific options
- **AIA Compliance**: Professional formatting meeting industry standards
- **Advanced Filtering**: Export specific subsets of permit data
- **Email Distribution**: Automated report delivery to stakeholders
- **Template Management**: Customizable email templates with variables
- **Progress Tracking**: Real-time export progress with error handling
- **Preview Mode**: Review export configuration before generation

## Export Formats
- **PDF Reports**: AIA-compliant with headers, footers, TOC
- **Excel Workbooks**: Multi-sheet with analytics and raw data
- **CSV Files**: Raw data export for external analysis

## Configuration Options
- **Data Selection**: Choose permits, inspections, analytics, insights
- **Date Filtering**: Specific date ranges and criteria
- **Project Filtering**: Single or multiple project exports
- **Status Filtering**: Filter by permit status and inspection results

## Email Distribution
- **Recipient Management**: Add/remove email recipients
- **Template Customization**: Editable email templates with placeholders
- **Variable Substitution**: Dynamic content insertion
- **Delivery Simulation**: Console logging for development/testing

## PDF Options
- **Paper Sizes**: Letter, Tabloid formats
- **Orientation**: Portrait/Landscape options
- **Headers/Footers**: Customizable document headers
- **Table of Contents**: Automatic TOC generation
- **Page Numbering**: Professional page numbering

## Accessibility
- WCAG 2.1 AA compliant interface
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
        `,
      },
    },
  },
  argTypes: {
    permits: {
      description: "Array of permit objects to export",
    },
    onClose: {
      description: "Callback function when modal is closed",
    },
    defaultFilters: {
      description: "Default filter configuration",
    },
    projectId: {
      description: "Current project identifier",
    },
    projectName: {
      description: "Current project name",
    },
  },
}

export default meta
type Story = StoryObj<typeof PermitExportModal>

const samplePermits = mockPermits.slice(0, 15) as Permit[]

export const Default: Story = {
  args: {
    permits: samplePermits,
    onClose: () => console.log("Close export modal"),
    projectId: "401001",
    projectName: "Tropical World Nursery",
  },
  parameters: {
    docs: {
      description: {
        story: "Default export modal with standard configuration options.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify modal title
    await expect(canvas.getByText("Export Permits & Inspections")).toBeInTheDocument()

    // Test format selection
    const pdfButton = canvas.getByText("PDF Report")
    await userEvent.click(pdfButton)

    // Test tab navigation
    const filtersTab = canvas.getByRole("tab", { name: /filters/i })
    await userEvent.click(filtersTab)

    await expect(canvas.getByText("Export Filters")).toBeInTheDocument()
  },
}

export const PDFExport: Story = {
  args: {
    permits: samplePermits,
    onClose: () => console.log("Close export modal"),
    projectId: "401001",
    projectName: "Tropical World Nursery",
  },
  parameters: {
    docs: {
      description: {
        story: "PDF export configuration with AIA-compliant options.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Select PDF format
    const pdfButton = canvas.getByText("PDF Report")
    await userEvent.click(pdfButton)

    // Test PDF options
    const paperSizeSelect = canvas.getByRole("combobox", { name: /paper size/i })
    await userEvent.click(paperSizeSelect)

    const tabloidOption = canvas.getByText('Tabloid (11" x 17")')
    await userEvent.click(tabloidOption)

    // Test orientation
    const orientationSelect = canvas.getByRole("combobox", { name: /orientation/i })
    await userEvent.click(orientationSelect)

    const landscapeOption = canvas.getByText("Landscape")
    await userEvent.click(landscapeOption)
  },
}

export const ExcelExport: Story = {
  args: {
    permits: samplePermits,
    onClose: () => console.log("Close export modal"),
    projectId: "401001",
    projectName: "Tropical World Nursery",
  },
  parameters: {
    docs: {
      description: {
        story: "Excel export configuration with multi-sheet options.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Select Excel format
    const excelButton = canvas.getByText("Excel Workbook")
    await userEvent.click(excelButton)

    // Test data selection options
    const includeAnalytics = canvas.getByLabelText(/include analytics/i)
    await userEvent.click(includeAnalytics)

    const includeInsights = canvas.getByLabelText(/include hbi insights/i)
    await userEvent.click(includeInsights)
  },
}

export const WithFilters: Story = {
  args: {
    permits: samplePermits,
    onClose: () => console.log("Close export modal"),
    defaultFilters: {
      status: "approved",
      type: "Building",
    },
    projectId: "401001",
    projectName: "Tropical World Nursery",
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal with pre-applied filters.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Navigate to filters tab
    const filtersTab = canvas.getByRole("tab", { name: /filters/i })
    await userEvent.click(filtersTab)

    // Verify pre-applied filters
    await expect(canvas.getByDisplayValue("approved")).toBeInTheDocument()

    // Test additional filter
    const typeSelect = canvas.getByRole("combobox", { name: /type/i })
    await userEvent.click(typeSelect)

    const electricalOption = canvas.getByText("Electrical")
    await userEvent.click(electricalOption)
  },
}

export const WithEmailDistribution: Story = {
  args: {
    permits: samplePermits,
    onClose: () => console.log("Close export modal"),
    projectId: "401001",
    projectName: "Tropical World Nursery",
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal with email distribution configuration.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Navigate to email tab
    const emailTab = canvas.getByRole("tab", { name: /email/i })
    await userEvent.click(emailTab)

    // Enable email distribution
    const enableEmailCheckbox = canvas.getByLabelText(/enable email distribution/i)
    await userEvent.click(enableEmailCheckbox)

    // Test adding recipient
    const nameInput = canvas.getByPlaceholderText("Name")
    await userEvent.type(nameInput, "John Doe")

    const emailInput = canvas.getByPlaceholderText("Email")
    await userEvent.type(emailInput, "john.doe@company.com")

    const roleInput = canvas.getByPlaceholderText("Role")
    await userEvent.type(roleInput, "Inspector")

    const addButton = canvas.getByRole("button", { name: /add/i })
    await userEvent.click(addButton)
  },
}

export const PreviewMode: Story = {
  args: {
    permits: samplePermits,
    onClose: () => console.log("Close export modal"),
    projectId: "401001",
    projectName: "Tropical World Nursery",
  },
  parameters: {
    docs: {
      description: {
        story: "Export preview showing configuration summary.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Navigate to preview tab
    const previewTab = canvas.getByRole("tab", { name: /preview/i })
    await userEvent.click(previewTab)

    // Verify export summary
    await expect(canvas.getByText("Export Summary")).toBeInTheDocument()
    await expect(canvas.getByText("Tropical World Nursery")).toBeInTheDocument()

    // Test export generation
    const generateButton = canvas.getByText("Generate Export")
    await userEvent.click(generateButton)
  },
}

export const LargeDataset: Story = {
  args: {
    permits: mockPermits as Permit[],
    onClose: () => console.log("Close export modal"),
    projectId: "401001",
    projectName: "Large Project Dataset",
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal with large dataset showing performance considerations.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Navigate to preview to see large dataset stats
    const previewTab = canvas.getByRole("tab", { name: /preview/i })
    await userEvent.click(previewTab)

    // Should show large permit count
    const permitCount = canvas.getByText(/\d+ permits/)
    expect(permitCount).toBeInTheDocument()
  },
}

export const EmptyDataset: Story = {
  args: {
    permits: [],
    onClose: () => console.log("Close export modal"),
    projectId: "401001",
    projectName: "Empty Project",
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal with no permits to export.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Navigate to preview
    const previewTab = canvas.getByRole("tab", { name: /preview/i })
    await userEvent.click(previewTab)

    // Export button should be disabled
    const generateButton = canvas.getByText("Generate Export")
    expect(generateButton).toBeDisabled()
  },
}

export const ExportInProgress: Story = {
  args: {
    permits: samplePermits,
    onClose: () => console.log("Close export modal"),
    projectId: "401001",
    projectName: "Tropical World Nursery",
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal showing progress during export generation.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Navigate to preview and start export
    const previewTab = canvas.getByRole("tab", { name: /preview/i })
    await userEvent.click(previewTab)

    const generateButton = canvas.getByText("Generate Export")
    await userEvent.click(generateButton)

    // Should show progress indicator
    await expect(canvas.getByText(/generating export/i)).toBeInTheDocument()
  },
}
