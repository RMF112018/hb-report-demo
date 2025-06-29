import type { Meta, StoryObj } from "@storybook/react"
import { within, userEvent, expect } from "@storybook/test"
import { PermitCalendar } from "@/components/permit-log/PermitCalendar"
import mockPermits from "@/data/mock-permits.json"
import type { Permit } from "@/types/permit-log"

const meta: Meta<typeof PermitCalendar> = {
  title: "Permits/PermitCalendar",
  component: PermitCalendar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Permit Calendar Component

A visual calendar interface for tracking permit applications, approvals, expirations, and inspections.

## Features
- **Monthly View**: Full month calendar with event indicators
- **Event Types**: Different colors for applications, approvals, expirations, inspections
- **Event Details**: Sidebar showing detailed information for selected dates
- **Navigation**: Month-to-month navigation with today button
- **Event Filtering**: Filter by event type or permit status
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

## Event Types
- **Permit Applications**: Blue indicators for new applications
- **Permit Approvals**: Green indicators for approved permits
- **Permit Expirations**: Orange/red indicators for expiring permits
- **Inspections**: Purple indicators for scheduled inspections

## Calendar Features
- **Date Selection**: Click dates to view events
- **Event Overflow**: Shows "+X more" for dates with many events
- **Today Highlighting**: Current date highlighted
- **Weekend Styling**: Different styling for weekends
- **Month Navigation**: Previous/next month buttons

## Event Details
- **Permit Information**: Number, type, status, authority
- **Inspection Details**: Type, inspector, results, compliance scores
- **Financial Information**: Costs, bond amounts
- **Contact Information**: Authority and inspector contacts
        `,
      },
    },
  },
  argTypes: {
    permits: {
      description: "Array of permit objects to display on calendar",
    },
  },
}

export default meta
type Story = StoryObj<typeof PermitCalendar>

const samplePermits = mockPermits.slice(0, 15) as Permit[]

export const Default: Story = {
  args: {
    permits: samplePermits,
  },
  parameters: {
    docs: {
      description: {
        story: "Standard calendar view showing permits and inspections for the current month.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify calendar elements
    await expect(canvas.getByText(/\d{4}/)).toBeInTheDocument() // Year

    // Test navigation
    const todayButton = canvas.getByText("Today")
    await userEvent.click(todayButton)

    // Test month navigation
    const nextButton = canvas.getByRole("button", { name: /next/i })
    await userEvent.click(nextButton)

    const prevButton = canvas.getByRole("button", { name: /previous/i })
    await userEvent.click(prevButton)
  },
}

export const WithManyEvents: Story = {
  args: {
    permits: mockPermits as Permit[],
  },
  parameters: {
    docs: {
      description: {
        story: "Calendar with high event density showing overflow handling.",
      },
    },
  },
}

export const CurrentMonth: Story = {
  args: {
    permits: samplePermits.map((permit) => ({
      ...permit,
      applicationDate: new Date().toISOString(),
      approvalDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    })),
  },
  parameters: {
    docs: {
      description: {
        story: "Calendar focused on current month with recent permit activity.",
      },
    },
  },
}

export const InspectionFocused: Story = {
  args: {
    permits: samplePermits.filter((permit) => permit.inspections.length > 0),
  },
  parameters: {
    docs: {
      description: {
        story: "Calendar showing only permits with scheduled inspections.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Look for inspection events
    const inspectionEvents = canvas.getAllByText(/inspection/i)
    expect(inspectionEvents.length).toBeGreaterThan(0)
  },
}

export const ExpiringPermits: Story = {
  args: {
    permits: samplePermits.map((permit) => ({
      ...permit,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      status: "approved" as const,
    })),
  },
  parameters: {
    docs: {
      description: {
        story: "Calendar highlighting permits expiring soon.",
      },
    },
  },
}

export const EmptyCalendar: Story = {
  args: {
    permits: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Calendar with no events to display.",
      },
    },
  },
}

export const WeekView: Story = {
  args: {
    permits: samplePermits,
  },
  parameters: {
    docs: {
      description: {
        story: "Calendar in week view mode (if implemented).",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test view mode switching if available
    const weekButton = canvas.queryByText("Week")
    if (weekButton) {
      await userEvent.click(weekButton)
    }
  },
}
