import type { Meta, StoryObj } from "@storybook/react"
import { within, userEvent, expect } from "@storybook/test"
import { PermitForm } from "@/components/permit-log/PermitForm"
import mockPermits from "@/data/mock-permits.json"
import type { Permit } from "@/types/permit-log"

const meta: Meta<typeof PermitForm> = {
  title: "Permits/PermitForm",
  component: PermitForm,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Permit Form Component

A comprehensive form for creating and editing permits with inspection management capabilities.

## Features
- **Permit Information**: Basic permit details (number, type, status, authority)
- **Date Management**: Application, approval, and expiration dates
- **Cost Tracking**: Permit fees and bond amounts
- **Inspection Management**: Add, edit, and remove inspections
- **Issue Tracking**: Manage inspection issues and resolutions
- **Document Attachments**: Support for permit documents
- **Validation**: Form validation with error handling
- **Auto-save**: Periodic saving of form data

## Form Sections
1. **Basic Information**: Permit number, type, status, authority
2. **Dates**: Application, approval, expiration dates
3. **Financial**: Costs and bond amounts
4. **Comments**: Additional notes and conditions
5. **Inspections**: Detailed inspection management
6. **Documents**: File attachments and references

## Inspection Management
- Add multiple inspections per permit
- Track inspection types, dates, and inspectors
- Record results and compliance scores
- Manage issues and resolutions
- Photo and document attachments

## Validation Rules
- Required fields marked with asterisks
- Date validation and logical ordering
- Email format validation for contacts
- Numeric validation for costs and scores
        `,
      },
    },
  },
  argTypes: {
    permit: {
      description: "Existing permit data for editing (null for new permit)",
    },
    onSave: {
      description: "Callback function when form is saved",
    },
    onClose: {
      description: "Callback function when form is closed",
    },
  },
}

export default meta
type Story = StoryObj<typeof PermitForm>

const samplePermit = mockPermits[0] as Permit

export const NewPermit: Story = {
  args: {
    permit: null,
    onSave: (permitData) => console.log("Save new permit:", permitData),
    onClose: () => console.log("Close form"),
  },
  parameters: {
    docs: {
      description: {
        story: "Form for creating a new permit with empty fields.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify form title
    await expect(canvas.getByText("Create New Permit")).toBeInTheDocument()

    // Test required field validation
    const permitNumberInput = canvas.getByLabelText(/permit number/i)
    await userEvent.type(permitNumberInput, "TEST-2024-001")

    // Test permit type selection
    const typeSelect = canvas.getByRole("combobox", { name: /permit type/i })
    await userEvent.click(typeSelect)

    const buildingOption = canvas.getByText("Building")
    await userEvent.click(buildingOption)

    // Test authority input
    const authorityInput = canvas.getByLabelText(/issuing authority/i)
    await userEvent.type(authorityInput, "City Building Department")
  },
}

export const EditExistingPermit: Story = {
  args: {
    permit: samplePermit,
    onSave: (permitData) => console.log("Update permit:", permitData),
    onClose: () => console.log("Close form"),
  },
  parameters: {
    docs: {
      description: {
        story: "Form for editing an existing permit with pre-populated data.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify form title
    await expect(canvas.getByText("Edit Permit")).toBeInTheDocument()

    // Verify pre-populated data
    await expect(canvas.getByDisplayValue("BLDG-2024-001")).toBeInTheDocument()

    // Test inspection section
    await expect(canvas.getByText("Inspections")).toBeInTheDocument()

    // Test adding new inspection
    const addInspectionButton = canvas.getByText("Add Inspection")
    await userEvent.click(addInspectionButton)

    await expect(canvas.getByText("Add New Inspection")).toBeInTheDocument()
  },
}

export const ApprovedPermit: Story = {
  args: {
    permit: {
      ...samplePermit,
      status: "approved",
      approvalDate: "2024-02-01T14:30:00Z",
    },
    onSave: (permitData) => console.log("Update approved permit:", permitData),
    onClose: () => console.log("Close form"),
  },
  parameters: {
    docs: {
      description: {
        story: "Form for an approved permit showing approval date field.",
      },
    },
  },
}

export const PendingPermit: Story = {
  args: {
    permit: {
      ...samplePermit,
      status: "pending",
      approvalDate: undefined,
    },
    onSave: (permitData) => console.log("Update pending permit:", permitData),
    onClose: () => console.log("Close form"),
  },
  parameters: {
    docs: {
      description: {
        story: "Form for a pending permit without approval date.",
      },
    },
  },
}

export const WithMultipleInspections: Story = {
  args: {
    permit: {
      ...samplePermit,
      inspections: [
        ...samplePermit.inspections,
        {
          id: "insp-new",
          permitId: samplePermit.id,
          type: "Final Inspection",
          scheduledDate: "2024-03-15T10:00:00Z",
          inspector: "Jane Smith",
          inspectorContact: {
            phone: "(555) 123-4567",
            email: "j.smith@inspections.gov",
            badge: "INS-003",
          },
          result: "pending",
          complianceScore: 0,
          issues: [],
          comments: "Final inspection scheduled",
          followUpRequired: false,
          duration: null,
          createdAt: "2024-03-10T08:00:00Z",
          updatedAt: null,
        },
      ],
    },
    onSave: (permitData) => console.log("Update permit with inspections:", permitData),
    onClose: () => console.log("Close form"),
  },
  parameters: {
    docs: {
      description: {
        story: "Form showing permit with multiple inspections.",
      },
    },
  },
}

export const WithInspectionIssues: Story = {
  args: {
    permit: {
      ...samplePermit,
      inspections: [
        {
          ...samplePermit.inspections[0],
          result: "failed",
          issues: [
            {
              id: "issue-1",
              description: "Missing fire blocking in wall cavity",
              severity: "medium",
              status: "open",
              location: "East wall, bay 3",
              code: "IBC 718.2.1",
              resolutionDate: null,
              resolutionNotes: "Contractor notified",
            },
          ],
        },
      ],
    },
    onSave: (permitData) => console.log("Update permit with issues:", permitData),
    onClose: () => console.log("Close form"),
  },
  parameters: {
    docs: {
      description: {
        story: "Form showing permit with inspection issues that need resolution.",
      },
    },
  },
}
