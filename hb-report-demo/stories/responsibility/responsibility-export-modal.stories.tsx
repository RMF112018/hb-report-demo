import type { Meta, StoryObj } from "@storybook/react"
import { ResponsibilityExportModal } from "@/components/responsibility/ResponsibilityExportModal"
import { mockResponsibilityTasks, mockRoles } from "./mock-data"

const meta: Meta<typeof ResponsibilityExportModal> = {
  title: "Responsibility/ResponsibilityExportModal",
  component: ResponsibilityExportModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The ResponsibilityExportModal component provides comprehensive export
capabilities for responsibility matrix data with multiple formats,
filtering options, and email distribution features.

## Export Formats
- **PDF**: Professional reports with AIA-compliant formatting
- **Excel**: Spreadsheet format for analysis and manipulation
- **CSV**: Data format for import into other systems

## Features
- Multi-tab interface (Format, Content, Distribution, Preview)
- Advanced filtering by matrix type, roles, categories, and status
- Email distribution with customizable templates
- AIA compliance options for contract documentation
- Real-time export preview and validation
- Progress tracking during export operations

## Content Selection
- Matrix type filtering (Team, Prime Contract, Subcontract)
- Role-specific exports
- Category and status filtering
- Include/exclude annotations and metrics

## Email Distribution
- Recipient management with roles
- Template customization with variables
- Project-specific distribution lists
- Bulk email simulation

## Usage
Triggered from the ResponsibilityMatrix export button to provide
comprehensive export and distribution capabilities.
        `,
      },
    },
  },
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Controls modal visibility",
    },
    tasks: {
      description: "Array of responsibility tasks to export",
    },
    roles: {
      description: "Array of project roles for filtering",
    },
    onClose: {
      description: "Callback when modal is closed",
    },
    onExport: {
      description: "Callback when export is triggered",
    },
  },
}

export default meta
type Story = StoryObj<typeof ResponsibilityExportModal>

export const PDFExport: Story = {
  args: {
    isOpen: true,
    tasks: mockResponsibilityTasks,
    roles: mockRoles,
    onClose: () => console.log("Modal closed"),
    onExport: (options) => console.log("Export options:", options),
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal configured for PDF export with AIA compliance options.",
      },
    },
  },
}

export const ExcelExport: Story = {
  args: {
    isOpen: true,
    tasks: mockResponsibilityTasks,
    roles: mockRoles,
    onClose: () => console.log("Modal closed"),
    onExport: (options) => console.log("Export options:", options),
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal configured for Excel spreadsheet export.",
      },
    },
  },
}

export const WithEmailDistribution: Story = {
  args: {
    isOpen: true,
    tasks: mockResponsibilityTasks,
    roles: mockRoles,
    onClose: () => console.log("Modal closed"),
    onExport: (options) => console.log("Export with email:", options),
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal with email distribution setup and recipient management.",
      },
    },
  },
}

export const FilteredExport: Story = {
  args: {
    isOpen: true,
    tasks: mockResponsibilityTasks.filter((task) => task.type === "prime-contract"),
    roles: mockRoles.filter((role) => ["PX", "PM1", "A", "O"].includes(role.key)),
    onClose: () => console.log("Modal closed"),
    onExport: (options) => console.log("Filtered export:", options),
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal with pre-filtered data for specific matrix type and roles.",
      },
    },
  },
}

export const ModalClosed: Story = {
  args: {
    isOpen: false,
    tasks: mockResponsibilityTasks,
    roles: mockRoles,
    onClose: () => console.log("Modal closed"),
    onExport: (options) => console.log("Export options:", options),
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal in closed state (not visible).",
      },
    },
  },
}
