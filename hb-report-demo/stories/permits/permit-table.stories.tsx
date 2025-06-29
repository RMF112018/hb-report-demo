import type { Meta, StoryObj } from "@storybook/react"
import { within, userEvent, expect } from "@storybook/test"
import { PermitTable } from "@/components/permit-log/PermitTable"
import mockPermits from "@/data/mock-permits.json"
import type { Permit } from "@/types/permit-log"

const meta: Meta<typeof PermitTable> = {
  title: "Permits/PermitTable",
  component: PermitTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Permit Table Component

A comprehensive data table for displaying and managing permits with advanced filtering, sorting, and action capabilities.

## Features
- **Sortable Columns**: Click column headers to sort data
- **Search Functionality**: Real-time search across permit fields
- **Action Menu**: Edit, view, schedule inspections, generate reports
- **Status Indicators**: Color-coded status badges and inspection results
- **Responsive Design**: Adapts to different screen sizes
- **Compact Mode**: Reduced information for dashboard views
- **Inspection View**: Toggle to show inspection-focused data

## Column Information
- **Permit Number**: Unique identifier with sorting
- **Type**: Permit category (Building, Electrical, Plumbing, etc.)
- **Status**: Current permit status with color coding
- **Authority**: Issuing authority information
- **Dates**: Application, approval, and expiration dates
- **Cost**: Permit fees and bond amounts
- **Inspections**: Count and status indicators

## Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
        `,
      },
    },
  },
  argTypes: {
    permits: {
      description: "Array of permit objects to display",
    },
    onEdit: {
      description: "Callback function when edit action is triggered",
    },
    onView: {
      description: "Callback function when view action is triggered",
    },
    compact: {
      control: "boolean",
      description: "Enable compact mode for dashboard views",
    },
    showInspections: {
      control: "boolean",
      description: "Show inspection-focused view instead of permits",
    },
  },
}

export default meta
type Story = StoryObj<typeof PermitTable>

const samplePermits = mockPermits.slice(0, 10) as Permit[]

export const Default: Story = {
  args: {
    permits: samplePermits,
    onEdit: (permit) => console.log("Edit permit:", permit.number),
    onView: (permit) => console.log("View permit:", permit.number),
    compact: false,
    showInspections: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Standard permit table with all columns and full functionality.",
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Test search functionality
    const searchInput = canvas.getByPlaceholderText("Search permits...")
    await userEvent.type(searchInput, "BLDG")

    // Verify filtering works
    await expect(canvas.getByText("BLDG-2024-001")).toBeInTheDocument()

    // Test sorting
    const numberHeader = canvas.getByText("Permit Number")
    await userEvent.click(numberHeader)

    // Test action menu
    const actionButtons = canvas.getAllByRole("button", { name: "" })
    if (actionButtons.length > 0) {
      await userEvent.click(actionButtons[0])
    }
  },
}

export const CompactMode: Story = {
  args: {
    permits: samplePermits,
    onEdit: (permit) => console.log("Edit permit:", permit.number),
    onView: (permit) => console.log("View permit:", permit.number),
    compact: true,
    showInspections: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Compact table view suitable for dashboard widgets and smaller spaces.",
      },
    },
  },
}

export const InspectionView: Story = {
  args: {
    permits: samplePermits,
    onEdit: (permit) => console.log("Edit permit:", permit.number),
    onView: (permit) => console.log("View permit:", permit.number),
    compact: false,
    showInspections: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Inspection-focused view showing inspection details and results.",
      },
    },
  },
}

export const ApprovedPermits: Story = {
  args: {
    permits: samplePermits.filter((p) => p.status === "approved"),
    onEdit: (permit) => console.log("Edit permit:", permit.number),
    onView: (permit) => console.log("View permit:", permit.number),
    compact: false,
    showInspections: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Table showing only approved permits.",
      },
    },
  },
}

export const PendingPermits: Story = {
  args: {
    permits: samplePermits.filter((p) => p.status === "pending"),
    onEdit: (permit) => console.log("Edit permit:", permit.number),
    onView: (permit) => console.log("View permit:", permit.number),
    compact: false,
    showInspections: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Table showing permits awaiting approval.",
      },
    },
  },
}

export const EmptyState: Story = {
  args: {
    permits: [],
    onEdit: (permit) => console.log("Edit permit:", permit.number),
    onView: (permit) => console.log("View permit:", permit.number),
    compact: false,
    showInspections: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when no permits match the current criteria.",
      },
    },
  },
}

export const WithFailedInspections: Story = {
  args: {
    permits: samplePermits.filter((p) => p.inspections.some((i) => i.result === "failed")),
    onEdit: (permit) => console.log("Edit permit:", permit.number),
    onView: (permit) => console.log("View permit:", permit.number),
    compact: false,
    showInspections: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Permits with failed inspections requiring attention.",
      },
    },
  },
}
