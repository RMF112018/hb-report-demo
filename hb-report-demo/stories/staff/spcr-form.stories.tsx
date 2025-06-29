import type { Meta, StoryObj } from "@storybook/react"
import { SPCRForm } from "../../components/staff/SPCRForm"
import { AuthProvider } from "../../lib/auth-context"

const meta: Meta<typeof SPCRForm> = {
  title: "Staff Planning/SPCRForm",
  component: SPCRForm,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# SPCR Form Component

A comprehensive form for creating and editing Staffing Plan Change Requests (SPCRs) with AI-powered suggestions and validation.

## Features

- **Smart Form Validation**: Real-time validation with helpful error messages
- **AI Suggestions**: HBI-powered recommendations for positions and employees
- **Project Context**: Automatic project information and schedule integration
- **Budget Calculation**: Automatic budget impact calculations
- **Schedule Integration**: Integration with project schedules and milestones

## Form Fields

- Request type (increase/decrease)
- Position selection from predefined list
- Project and schedule reference
- Date range with validation
- Budget impact calculation
- Detailed justification
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <div className="p-6 bg-gray-50 min-h-screen">
          <Story />
        </div>
      </AuthProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SPCRForm>

const mockOnSubmit = (data: any) => {
  console.log("SPCR Submitted:", data)
  alert("SPCR submitted successfully!")
}

const mockOnCancel = () => {
  console.log("SPCR form cancelled")
  alert("Form cancelled")
}

export const NewSPCR: Story = {
  args: {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
  },
  parameters: {
    docs: {
      description: {
        story: "New SPCR form with empty fields ready for user input.",
      },
    },
  },
}

export const StaffIncrease: Story = {
  args: {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    initialData: {
      type: "increase",
      position: "Project Manager II",
      projectId: "401001",
      startDate: "2024-06-01",
      endDate: "2024-12-31",
      scheduleRef: "MEP Coordination Phase",
      budget: 85000,
      explanation:
        "Additional PM support needed for complex MEP coordination and increased scope due to client change orders.",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "SPCR form pre-filled for a staff increase request.",
      },
    },
  },
}

export const StaffDecrease: Story = {
  args: {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    initialData: {
      type: "decrease",
      position: "Estimator II",
      projectId: "401004",
      startDate: "2024-09-01",
      endDate: "2024-12-31",
      scheduleRef: "Unit Fit-out Phase",
      budget: -45000,
      explanation: "Estimating work completed ahead of schedule, resources can be reallocated to other projects.",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "SPCR form pre-filled for a staff decrease request.",
      },
    },
  },
}

export const WithAISuggestions: Story = {
  args: {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    initialData: {
      projectId: "401003",
      position: "VDC Manager",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "SPCR form showing AI suggestions panel with relevant recommendations.",
      },
    },
  },
}

export const WithValidationErrors: Story = {
  args: {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    initialData: {
      type: "increase",
      position: "Project Manager",
      // Missing required fields to trigger validation
    },
  },
  parameters: {
    docs: {
      description: {
        story: "SPCR form demonstrating validation errors and user guidance.",
      },
    },
  },
}

export const EditMode: Story = {
  args: {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    initialData: {
      type: "increase",
      position: "Construction Manager",
      projectId: "401007",
      startDate: "2024-08-01",
      endDate: "2025-01-31",
      scheduleRef: "Pre-engineered Building Erection",
      budget: 88000,
      explanation: "Large warehouse complex requires additional foreman for concurrent construction activities.",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "SPCR form in edit mode with existing data loaded.",
      },
    },
  },
}
