"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { FieldExportModal } from "@/components/field-reports/FieldExportModal"
import { Button } from "@/components/ui/button"
import { mockFieldData, getFilteredDataByRole } from "./mock-data"

const meta: Meta<typeof FieldExportModal> = {
  title: "Field Reports/FieldExportModal",
  component: FieldExportModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The FieldExportModal component provides comprehensive export functionality for field reports data.
It allows users to customize export formats, select data sections, and configure distribution options.

## Features
- **Multiple Formats**: PDF, Excel, and CSV export options
- **Section Selection**: Choose which data types to include
- **Date Range Filtering**: Export data for specific time periods
- **Email Distribution**: Send reports directly to stakeholders
- **Custom Titles**: Personalize report titles and add notes
- **Role-based Options**: Export options adapt to user permissions

## Export Formats
- **PDF**: Formatted reports with charts and analytics
- **Excel**: Structured data with multiple worksheets
- **CSV**: Raw data for further analysis

## Data Sections
- Daily Logs with activity details
- Manpower records and efficiency metrics
- Safety audit results and violations
- Quality inspection outcomes and defects
- Analytics and performance summaries
        `,
      },
    },
  },
  argTypes: {
    data: {
      description: "Field reports data to be exported",
      control: { type: "object" },
    },
    userRole: {
      description: "Current user role for permission-based features",
      control: { type: "select" },
      options: ["admin", "executive", "project-executive", "project-manager"],
    },
    onClose: {
      description: "Callback function when modal is closed",
      action: "closed",
    },
  },
}

export default meta
type Story = StoryObj<typeof FieldExportModal>

// Wrapper component to handle modal state
const ModalWrapper = ({ userRole, data }: { userRole: string; data: any }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Export Modal</Button>
      {isOpen && <FieldExportModal data={data} userRole={userRole} onClose={() => setIsOpen(false)} />}
    </div>
  )
}

export const AdminExport: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    data: mockFieldData,
    userRole: "admin",
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal for admin user with full data access and email distribution options.",
      },
    },
  },
}

export const ExecutiveExport: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    data: mockFieldData,
    userRole: "executive",
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal for executive user with comprehensive reporting options.",
      },
    },
  },
}

export const ProjectExecutiveExport: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    data: getFilteredDataByRole("project-executive"),
    userRole: "project-executive",
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal for project executive with filtered data for their oversight projects.",
      },
    },
  },
}

export const ProjectManagerExport: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    data: getFilteredDataByRole("project-manager"),
    userRole: "project-manager",
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal for project manager with limited data and no email distribution.",
      },
    },
  },
}

export const LimitedData: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    data: {
      dailyLogs: mockFieldData.dailyLogs.slice(0, 2),
      manpower: mockFieldData.manpower.slice(0, 2),
      safetyAudits: mockFieldData.safetyAudits.slice(0, 1),
      qualityInspections: mockFieldData.qualityInspections.slice(0, 1),
    },
    userRole: "admin",
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal with limited data showing how record counts are displayed.",
      },
    },
  },
}

export const EmptyData: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    data: {
      dailyLogs: [],
      manpower: [],
      safetyAudits: [],
      qualityInspections: [],
    },
    userRole: "project-manager",
  },
  parameters: {
    docs: {
      description: {
        story: "Export modal with no data, showing how empty states are handled.",
      },
    },
  },
}
