import type { Meta, StoryObj } from "@storybook/react"
import { BuyoutDistributionModal } from "../../components/buyout/BuyoutDistributionModal"

const meta: Meta<typeof BuyoutDistributionModal> = {
  title: "Buyout/BuyoutDistributionModal",
  component: BuyoutDistributionModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Buyout Distribution Modal

Comprehensive email distribution system for buyout contracts and material procurement documentation.
Features AIA-compliant PDF generation, customizable email templates, and multi-recipient management.

## Features
- **AIA-Compliant PDF Generation**: Automatic generation of AIA-standard contract documents
- **Email Template System**: Customizable templates with variable substitution
- **Multi-Recipient Management**: Support for internal, vendor, owner, and architect recipients
- **Bulk Distribution**: Send to multiple recipients simultaneously
- **Document Attachments**: PDF contracts, schedules, and compliance documents
- **Delivery Scheduling**: Schedule emails for future delivery
- **Read Receipts**: Track email delivery and read status
- **Digital Signatures**: Include digital signatures for authenticity

## Recipient Types
- **Internal**: Project team members and company staff
- **Vendor**: Subcontractors and suppliers
- **Owner**: Project owners and representatives
- **Architect**: Design team and consultants

## Email Templates
- **Subject Line**: Customizable with project variables
- **Body Content**: Rich text with conditional sections
- **Variable Substitution**: Dynamic content based on project data
- **Conditional Sections**: Include/exclude content based on settings

## Document Generation
- **AIA G702**: Application and Certificate for Payment
- **AIA G703**: Continuation Sheet
- **Schedule of Values**: Detailed cost breakdown
- **Compliance Documentation**: Insurance, bonding, licensing
- **Contract Amendments**: Change orders and modifications

## Distribution Settings
- **Priority Levels**: Normal, high, urgent
- **Delivery Options**: Immediate or scheduled
- **Security Features**: Read receipts, digital signatures
- **Export Formats**: PDF, Excel spreadsheets
        `,
      },
    },
  },
  argTypes: {
    open: {
      control: { type: "boolean" },
      description: "Controls modal visibility",
    },
    onOpenChange: {
      action: "openChange",
      description: "Callback when modal open state changes",
    },
    buyoutRecord: {
      description: "Buyout record data for distribution",
    },
    projectId: {
      control: { type: "text" },
      description: "Project identifier",
    },
    projectName: {
      control: { type: "text" },
      description: "Project name for email templates",
    },
  },
}

export default meta
type Story = StoryObj<typeof BuyoutDistributionModal>

const mockBuyoutRecord = {
  id: "bo_001",
  name: "Structural Steel Package",
  vendorName: "Steel Fabricators Inc.",
  currentAmount: 2480000,
  startDate: "2024-02-01",
  endDate: "2024-08-15",
  type: "subcontract",
  status: "active",
  retentionPercentage: 5.0,
  complianceStatus: "compliant",
  milestones: [
    {
      name: "Shop Drawings",
      dueDate: "2024-03-01",
      status: "completed",
    },
    {
      name: "Material Delivery",
      dueDate: "2024-04-15",
      status: "in-progress",
    },
  ],
  complianceChecks: [
    {
      requirement: "General Liability Insurance",
      status: "approved",
    },
    {
      requirement: "Performance Bond",
      status: "approved",
    },
  ],
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Default Distribution Modal** - Standard email distribution setup.

Features:
- Pre-configured recipient list
- Default email template
- PDF attachment generation
- Standard distribution settings
- AIA-compliant documentation

This is the typical use case for distributing buyout contracts to project stakeholders.
        `,
      },
    },
  },
  args: {
    open: true,
    buyoutRecord: mockBuyoutRecord,
    projectId: "proj_001",
    projectName: "Downtown Office Complex",
    onOpenChange: (open) => console.log("Modal open state:", open),
  },
}

export const RecipientsTab: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Recipients Management** - Adding and managing email recipients.

Features:
- Add new recipients by type
- Edit existing recipient information
- Remove recipients from distribution
- Recipient type categorization
- Contact validation

Demonstrates the recipient management interface for building distribution lists.
        `,
      },
    },
  },
  args: {
    open: true,
    buyoutRecord: mockBuyoutRecord,
    projectId: "proj_001",
    projectName: "Downtown Office Complex",
    onOpenChange: (open) => console.log("Recipients modal:", open),
  },
}

export const TemplateCustomization: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Template Customization** - Customizing email templates and content.

Features:
- Subject line customization
- Email body editing
- Variable substitution
- Conditional content sections
- Template preview
- Content validation

Shows how users can customize email templates for different distribution scenarios.
        `,
      },
    },
  },
  args: {
    open: true,
    buyoutRecord: mockBuyoutRecord,
    projectId: "proj_001",
    projectName: "Downtown Office Complex",
    onOpenChange: (open) => console.log("Template modal:", open),
  },
}

export const EmailPreview: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Email Preview** - Previewing the final email before distribution.

Features:
- Rendered email preview
- Variable substitution display
- Attachment list
- Recipient-specific preview
- Content validation
- Send confirmation

Allows users to review the final email content before distribution.
        `,
      },
    },
  },
  args: {
    open: true,
    buyoutRecord: mockBuyoutRecord,
    projectId: "proj_001",
    projectName: "Downtown Office Complex",
    onOpenChange: (open) => console.log("Preview modal:", open),
  },
}

export const DistributionSettings: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Distribution Settings** - Configuring advanced distribution options.

Features:
- Export format selection (PDF/Excel)
- Priority level setting
- Delivery scheduling
- Read receipt requirements
- Digital signature inclusion
- Security options

Demonstrates advanced configuration options for email distribution.
        `,
      },
    },
  },
  args: {
    open: true,
    buyoutRecord: mockBuyoutRecord,
    projectId: "proj_001",
    projectName: "Downtown Office Complex",
    onOpenChange: (open) => console.log("Settings modal:", open),
  },
}

export const MaterialProcurement: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Material Procurement Distribution** - Distributing material procurement documentation.

Features:
- Material-specific templates
- Vendor-focused distribution
- Delivery schedule inclusion
- Quality requirements
- Specification documents
- Procurement workflow

Used for distributing material procurement contracts and purchase orders.
        `,
      },
    },
  },
  args: {
    open: true,
    buyoutRecord: {
      id: "mp_001",
      name: "Structural Steel Materials",
      vendorName: "Steel Supply Co.",
      currentAmount: 125000,
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      type: "material",
      status: "ordered",
      item: {
        name: "W24x76 Steel Beams",
        quantity: 50,
        unit: "tons",
        specifications: "ASTM A992 Grade 50",
      },
    },
    projectId: "proj_001",
    projectName: "Downtown Office Complex",
    onOpenChange: (open) => console.log("Material distribution modal:", open),
  },
}

export const ScheduledDelivery: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Scheduled Delivery** - Setting up scheduled email delivery.

Features:
- Future delivery scheduling
- Time zone handling
- Delivery confirmation
- Schedule modification
- Batch scheduling
- Reminder notifications

Useful for coordinating email delivery with project milestones.
        `,
      },
    },
  },
  args: {
    open: true,
    buyoutRecord: mockBuyoutRecord,
    projectId: "proj_001",
    projectName: "Downtown Office Complex",
    onOpenChange: (open) => console.log("Scheduled modal:", open),
  },
}

export const HighPriorityDistribution: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**High Priority Distribution** - Urgent contract distribution.

Features:
- High priority marking
- Urgent delivery options
- Read receipt requirements
- Escalation procedures
- Emergency contacts
- Immediate notifications

Used for time-sensitive contract distributions requiring immediate attention.
        `,
      },
    },
  },
  args: {
    open: true,
    buyoutRecord: {
      ...mockBuyoutRecord,
      status: "urgent",
      name: "Emergency Structural Repairs",
    },
    projectId: "proj_001",
    projectName: "Downtown Office Complex",
    onOpenChange: (open) => console.log("High priority modal:", open),
  },
}

export const BulkDistribution: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Bulk Distribution** - Distributing multiple contracts simultaneously.

Features:
- Multiple contract selection
- Batch processing
- Progress tracking
- Error handling
- Delivery confirmation
- Summary reporting

Efficient for distributing multiple related contracts to the same recipient list.
        `,
      },
    },
  },
  args: {
    open: true,
    buyoutRecord: mockBuyoutRecord,
    projectId: "proj_001",
    projectName: "Downtown Office Complex",
    onOpenChange: (open) => console.log("Bulk distribution modal:", open),
  },
}

export const ComplianceDocumentation: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Compliance Documentation** - Distributing AIA-compliant contract packages.

Features:
- AIA G702/G703 forms
- Schedule of values
- Insurance certificates
- Bond documentation
- Lien waivers
- Compliance checklists

Ensures all required AIA documentation is included in contract distributions.
        `,
      },
    },
  },
  args: {
    open: true,
    buyoutRecord: {
      ...mockBuyoutRecord,
      aiaCompliance: {
        scheduleOfValues: [
          { item: "Structural Steel", amount: 1500000, completed: 25 },
          { item: "Erection", amount: 980000, completed: 10 },
        ],
        retentionCompliance: true,
        complianceFields: {
          g702Required: true,
          g703Required: true,
          scheduleOfValuesRequired: true,
        },
      },
    },
    projectId: "proj_001",
    projectName: "Downtown Office Complex",
    onOpenChange: (open) => console.log("Compliance modal:", open),
  },
}

export const ErrorHandling: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Error Handling** - Distribution modal with error states.

Features:
- Email validation errors
- PDF generation failures
- Network connectivity issues
- Recipient validation
- Template errors
- Recovery options

Demonstrates robust error handling and user guidance for distribution issues.
        `,
      },
    },
  },
  args: {
    open: true,
    buyoutRecord: mockBuyoutRecord,
    projectId: "proj_001",
    projectName: "Downtown Office Complex",
    onOpenChange: (open) => console.log("Error handling modal:", open),
  },
}

export const SuccessConfirmation: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Success Confirmation** - Successful distribution confirmation.

Features:
- Distribution summary
- Delivery confirmations
- Recipient list verification
- Document generation status
- Next steps guidance
- Follow-up actions

Shows the success state after successful email distribution.
        `,
      },
    },
  },
  args: {
    open: true,
    buyoutRecord: mockBuyoutRecord,
    projectId: "proj_001",
    projectName: "Downtown Office Complex",
    onOpenChange: (open) => console.log("Success modal:", open),
  },
}
