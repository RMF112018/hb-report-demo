import type { Meta, StoryObj } from "@storybook/react"
import { FieldTable } from "@/components/field-reports/FieldTable"
import { mockDailyLogs, mockManpower, mockSafetyAudits, mockQualityInspections } from "./mock-data"

const meta: Meta<typeof FieldTable> = {
  title: "Field Reports/FieldTable",
  component: FieldTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The FieldTable component displays field data in a tabular format with sorting, filtering, and interaction capabilities.
It supports different data types including daily logs, manpower records, safety audits, and quality inspections.

## Features
- **Multi-type Support**: Handles different field data types with appropriate columns
- **Sorting**: Click column headers to sort data
- **Expandable Rows**: Daily logs can be expanded to show detailed activities
- **Role-based Actions**: Actions menu adapts based on user permissions
- **Status Indicators**: Visual badges for different statuses and priorities

## Data Types
- \`daily-logs\`: Daily activity logs with expandable details
- \`manpower\`: Worker allocation and efficiency tracking
- \`safety\`: Safety audit results and violations
- \`quality\`: Quality inspection outcomes and defects
        `,
      },
    },
  },
  argTypes: {
    data: {
      description: "Array of field data records to display",
      control: { type: "object" },
    },
    type: {
      description: "Type of field data being displayed",
      control: { type: "select" },
      options: ["daily-logs", "manpower", "safety", "quality"],
    },
    userRole: {
      description: "Current user role for permission-based features",
      control: { type: "select" },
      options: ["admin", "executive", "project-executive", "project-manager"],
    },
  },
}

export default meta
type Story = StoryObj<typeof FieldTable>

export const DailyLogsAdmin: Story = {
  args: {
    data: mockDailyLogs,
    type: "daily-logs",
    userRole: "admin",
  },
  parameters: {
    docs: {
      description: {
        story: "Daily logs table with admin permissions showing all available actions.",
      },
    },
  },
}

export const DailyLogsProjectManager: Story = {
  args: {
    data: mockDailyLogs.filter((log) => log.projectId === "401001"),
    type: "daily-logs",
    userRole: "project-manager",
  },
  parameters: {
    docs: {
      description: {
        story: "Daily logs table filtered for project manager view with limited actions.",
      },
    },
  },
}

export const ManpowerRecords: Story = {
  args: {
    data: mockManpower,
    type: "manpower",
    userRole: "project-executive",
  },
  parameters: {
    docs: {
      description: {
        story: "Manpower records showing worker allocation, efficiency, and cost tracking.",
      },
    },
  },
}

export const SafetyAudits: Story = {
  args: {
    data: mockSafetyAudits,
    type: "safety",
    userRole: "admin",
  },
  parameters: {
    docs: {
      description: {
        story: "Safety audit results with violation tracking and compliance scoring.",
      },
    },
  },
}

export const SafetyAuditsWithViolations: Story = {
  args: {
    data: mockSafetyAudits.filter((audit) => audit.violations > 0),
    type: "safety",
    userRole: "project-manager",
  },
  parameters: {
    docs: {
      description: {
        story: "Safety audits filtered to show only those with violations.",
      },
    },
  },
}

export const QualityInspections: Story = {
  args: {
    data: mockQualityInspections,
    type: "quality",
    userRole: "executive",
  },
  parameters: {
    docs: {
      description: {
        story: "Quality inspection results with defect tracking and resolution notes.",
      },
    },
  },
}

export const QualityInspectionsFailed: Story = {
  args: {
    data: mockQualityInspections.filter((inspection) => inspection.status === "fail"),
    type: "quality",
    userRole: "project-executive",
  },
  parameters: {
    docs: {
      description: {
        story: "Quality inspections filtered to show only failed inspections requiring attention.",
      },
    },
  },
}

export const EmptyState: Story = {
  args: {
    data: [],
    type: "daily-logs",
    userRole: "project-manager",
  },
  parameters: {
    docs: {
      description: {
        story: "Table showing empty state when no data matches current filters.",
      },
    },
  },
}

export const LimitedPermissions: Story = {
  args: {
    data: mockDailyLogs.slice(0, 3),
    type: "daily-logs",
    userRole: "project-manager",
  },
  parameters: {
    docs: {
      description: {
        story: "Table with limited permissions showing restricted action menu options.",
      },
    },
  },
}
