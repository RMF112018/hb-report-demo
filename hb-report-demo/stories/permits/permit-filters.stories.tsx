import type { Meta, StoryObj } from "@storybook/react"
import { within, userEvent, expect } from "@storybook/test"
import { PermitFilters } from "@/components/permit-log/PermitFilters"
import type { PermitFilters as PermitFiltersType } from "@/types/permit-log"

const meta: Meta<typeof PermitFilters> = {
  title: "Permits/PermitFilters",
  component: PermitFilters,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Permit Filters Component

Advanced filtering interface for permits with multiple criteria and saved filter sets.

## Features
- **Multi-criteria Filtering**: Status, type, authority, project, date range
- **Date Range Selection**: Calendar-based date picker
- **Real-time Filtering**: Immediate results as filters are applied
- **Filter Persistence**: Save and load filter configurations
- **Active Filter Display**: Visual indicators for applied filters
- **Clear All**: Quick reset of all filters
- **Responsive Design**: Adapts to different screen sizes

## Filter Types
- **Status Filter**: Approved, pending, expired, rejected
- **Permit Type**: Building, electrical, plumbing, HVAC, fire safety
- **Authority**: Issuing authority search
- **Project ID**: Project-specific filtering
- **Date Range**: Application, approval, or expiration dates
- **Inspection Results**: Filter by inspection outcomes
- **Expiring Within**: Time-based expiration alerts

## Filter Combinations
- Multiple filters can be applied simultaneously
- Logical AND operation between different filter types
- Real-time count of matching permits
- Performance optimized for large datasets

## Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly labels
- High contrast mode support
        `,
      },
    },
  },
  argTypes: {
    filters: {
      description: "Current filter state object",
    },
    onFiltersChange: {
      description: "Callback function when filters are updated",
    },
    onClose: {
      description: "Callback function when filter panel is closed",
    },
  },
}

export default meta
type Story = StoryObj<typeof PermitFilters>

const defaultFilters: PermitFiltersType = {}

export const Default: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: (filters) => console.log("Filters changed:", filters),
    onClose: () => console.log("Close filters"),
  },
  parameters: {
    docs: {
      description: {
        story: "Default filter panel with no active filters.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify filter panel elements
    await expect(canvas.getByText("Filter Permits")).toBeInTheDocument()

    // Test status filter
    const statusSelect = canvas.getByRole("combobox", { name: /status/i })
    await userEvent.click(statusSelect)

    const approvedOption = canvas.getByText("Approved")
    await userEvent.click(approvedOption)

    // Test apply filters button
    const applyButton = canvas.getByText("Apply Filters")
    await userEvent.click(applyButton)
  },
}

export const WithActiveFilters: Story = {
  args: {
    filters: {
      status: "approved",
      type: "Building",
      projectId: "401001",
    },
    onFiltersChange: (filters) => console.log("Filters changed:", filters),
    onClose: () => console.log("Close filters"),
  },
  parameters: {
    docs: {
      description: {
        story: "Filter panel with several active filters applied.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify active filter badge
    await expect(canvas.getByText("3 active")).toBeInTheDocument()

    // Test clear all filters
    const clearButton = canvas.getByText("Clear All Filters")
    await userEvent.click(clearButton)
  },
}

export const DateRangeFilter: Story = {
  args: {
    filters: {
      dateRange: {
        start: "2024-01-01",
        end: "2024-12-31",
      },
    },
    onFiltersChange: (filters) => console.log("Filters changed:", filters),
    onClose: () => console.log("Close filters"),
  },
  parameters: {
    docs: {
      description: {
        story: "Filter panel with date range selection active.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test date range inputs
    const startDateButton = canvas.getByText(/start date/i)
    await userEvent.click(startDateButton)

    // Calendar should open (if implemented)
    // Test would depend on calendar implementation
  },
}

export const ExpirationFilter: Story = {
  args: {
    filters: {
      expiringWithin: 30,
    },
    onFiltersChange: (filters) => console.log("Filters changed:", filters),
    onClose: () => console.log("Close filters"),
  },
  parameters: {
    docs: {
      description: {
        story: "Filter showing permits expiring within 30 days.",
      },
    },
  },
}

export const ProjectSpecificFilter: Story = {
  args: {
    filters: {
      projectId: "401001",
      status: "approved",
    },
    onFiltersChange: (filters) => console.log("Filters changed:", filters),
    onClose: () => console.log("Close filters"),
  },
  parameters: {
    docs: {
      description: {
        story: "Filters for a specific project with approved permits.",
      },
    },
  },
}

export const InspectionResultFilter: Story = {
  args: {
    filters: {
      inspectionResult: "failed",
    },
    onFiltersChange: (filters) => console.log("Filters changed:", filters),
    onClose: () => console.log("Close filters"),
  },
  parameters: {
    docs: {
      description: {
        story: "Filter showing permits with failed inspections.",
      },
    },
  },
}

export const ComplexFilterCombination: Story = {
  args: {
    filters: {
      status: "approved",
      type: "Building",
      authority: "City Building Department",
      dateRange: {
        start: "2024-01-01",
        end: "2024-06-30",
      },
      expiringWithin: 60,
    },
    onFiltersChange: (filters) => console.log("Filters changed:", filters),
    onClose: () => console.log("Close filters"),
  },
  parameters: {
    docs: {
      description: {
        story: "Complex filter combination with multiple criteria.",
      },
    },
  },
}
