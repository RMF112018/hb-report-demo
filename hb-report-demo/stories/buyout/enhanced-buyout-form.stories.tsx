import type { Meta, StoryObj } from "@storybook/react"
import { EnhancedBuyoutForm } from "../../components/buyout/enhanced-buyout-form"

const meta: Meta<typeof EnhancedBuyoutForm> = {
  title: "Buyout/EnhancedBuyoutForm",
  component: EnhancedBuyoutForm,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Enhanced Buyout Form

Comprehensive form for creating and editing subcontract buyout records with full AIA compliance support.
Features multi-tab interface, API integrations, and advanced workflow management.

## Features
- **Multi-tab Interface**: Organized sections for different aspects of buyout management
- **API Integrations**: Real-time data from BuildingConnected, Compass, SiteMate, Procore, Sage 300
- **AIA Compliance**: Built-in compliance checking and documentation
- **Material Procurement**: Integrated material management with drag-and-drop
- **Auto-save**: Automatic form saving with recovery
- **Workflow Management**: Complete approval and execution workflow
- **Document Management**: File uploads and document tracking
- **Risk Assessment**: Integrated risk analysis and mitigation

## Tabs
1. **Buyout Details**: Basic contract information and financials
2. **Materials**: Material procurement and specifications
3. **Forecasting**: Cost forecasting and budget analysis
4. **Workflow**: Contract execution and approval workflow
5. **Checklist**: AIA compliance checklist
6. **Compliance**: Compliance waivers and approvals
7. **Collaboration**: Comments, tasks, and team communication
8. **History**: Change tracking and audit trail

## API Integrations
- **BuildingConnected**: Vendor data and bid information
- **Compass**: Compliance and risk metrics
- **SiteMate**: Safety and quality data
- **Procore**: Cost codes and budget information
- **Sage 300**: Financial and payment data
        `,
      },
    },
  },
  argTypes: {
    projectId: {
      control: { type: "text" },
      description: "Project identifier for the buyout record",
    },
    commitmentId: {
      control: { type: "number" },
      description: "Optional commitment ID for existing records",
    },
    initialData: {
      description: "Initial form data for editing existing records",
    },
    onSubmit: {
      action: "submit",
      description: "Callback function when form is submitted",
    },
    onCancel: {
      action: "cancel",
      description: "Callback function when form is cancelled",
    },
    activeTab: {
      control: { type: "select" },
      options: [
        "buyout-details",
        "materials",
        "forecasting",
        "contract-workflow",
        "subcontract-checklist",
        "compliance-waiver",
        "collaboration",
        "history",
      ],
      description: "Currently active tab in the form",
    },
    onTabChange: {
      action: "tabChange",
      description: "Callback when user changes tabs",
    },
    isLoading: {
      control: { type: "boolean" },
      description: "Loading state for form submission",
    },
  },
}

export default meta
type Story = StoryObj<typeof EnhancedBuyoutForm>

const mockInitialData = {
  number: "1699901-001",
  vendor: "ABC Construction Inc.",
  title: "Structural Shell Package",
  status: "Pending",
  bic: "HB",
  budget: 2500000,
  contract_value: 2480000,
  savings_overage: 20000,
  contract_start_date: new Date("2024-02-01"),
  contract_estimated_completion_date: new Date("2024-08-15"),
  costCode: "03-300",
  riskLevel: "Low",
  supplierRating: 4.5,
  materials: [
    {
      id: "mat_001",
      name: "Ready-Mix Concrete",
      description: "4000 PSI concrete for foundation work",
      category: "Concrete",
      specifications: "4000 PSI, 6-inch slump, air entrained",
      quantity: 850,
      unit: "cubic yards",
      vendor: {
        id: "vendor_001",
        name: "Superior Ready Mix",
        contact: {
          name: "Jose Martinez",
          email: "jmartinez@superiorreadymix.com",
          phone: "(555) 222-3333",
        },
      },
      quoteValue: 95000,
      deliveryDate: "2024-02-15",
      leadTime: 7,
      orderedStatus: "Delivered" as const,
      qualityStatus: "Approved" as const,
      costCode: "03-300",
      annotations: [],
    },
  ],
}

export const NewBuyoutForm: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**New Buyout Form** - Creating a new subcontract buyout record from scratch.

Features:
- Empty form with default values
- Template suggestions
- API data population
- Auto-save functionality
- Validation and error handling

This is the primary use case for Project Managers creating new buyout records.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    activeTab: "buyout-details",
    onSubmit: async (data) => {
      console.log("New buyout submitted:", data)
      return Promise.resolve()
    },
    onCancel: () => console.log("Form cancelled"),
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
}

export const EditExistingBuyout: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Edit Existing Buyout** - Editing an existing buyout record with pre-populated data.

Features:
- Pre-filled form fields
- Change tracking
- Version history
- Approval workflow integration
- Collaborative editing

Used when modifying existing buyout records or updating information.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    commitmentId: 1001,
    initialData: mockInitialData,
    activeTab: "buyout-details",
    onSubmit: async (data) => {
      console.log("Buyout updated:", data)
      return Promise.resolve()
    },
    onCancel: () => console.log("Edit cancelled"),
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
}

export const MaterialsTab: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Materials Tab** - Managing material procurement within the buyout form.

Features:
- Add/edit/remove materials
- Drag-and-drop reordering
- Vendor management
- Delivery scheduling
- Quality status tracking
- Annotation system

This tab handles all material procurement aspects of the buyout.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    initialData: mockInitialData,
    activeTab: "materials",
    onSubmit: async (data) => {
      console.log("Materials updated:", data)
      return Promise.resolve()
    },
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
}

export const ComplianceChecklist: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Compliance Checklist** - AIA compliance verification and documentation.

Features:
- 21-point compliance checklist
- Progress tracking
- Document upload
- Waiver management
- Approval workflow
- Audit trail

Ensures all AIA requirements are met before contract execution.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    initialData: {
      ...mockInitialData,
      contract_status: "C",
      schedule_a_status: "C",
      insurance_general_liability_status: "P",
      w_9_status: "N",
    },
    activeTab: "subcontract-checklist",
    onSubmit: async (data) => {
      console.log("Compliance updated:", data)
      return Promise.resolve()
    },
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
}

export const WorkflowManagement: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Workflow Management** - Contract execution and approval workflow.

Features:
- Scope review scheduling
- Approval tracking (SPM, PX, VP)
- LOI management
- Contract execution timeline
- Milestone tracking
- Notification system

Manages the complete contract execution workflow from review to execution.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    initialData: {
      ...mockInitialData,
      scope_review_meeting_date: new Date("2024-01-15"),
      spm_review_date: new Date("2024-01-20"),
      spm_approval_status: "Approved",
      px_review_date: new Date("2024-01-25"),
      px_approval_status: "Pending",
    },
    activeTab: "contract-workflow",
    onSubmit: async (data) => {
      console.log("Workflow updated:", data)
      return Promise.resolve()
    },
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
}

export const CollaborationTab: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Collaboration Tab** - Team communication and task management.

Features:
- Comment threads with @mentions
- Task assignment and tracking
- File sharing
- Real-time notifications
- Activity feed
- Team coordination

Facilitates team collaboration throughout the buyout process.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    initialData: {
      ...mockInitialData,
      commentThread: [
        {
          id: 1,
          user: "Sarah Johnson",
          timestamp: new Date("2024-01-20T10:30:00"),
          content: "Please review the updated insurance requirements for this vendor.",
        },
      ],
      tasks: [
        {
          id: 1,
          title: "Verify insurance documentation",
          assignee: "Michael Chen",
          dueDate: new Date("2024-01-25"),
          status: "pending",
        },
      ],
    },
    activeTab: "collaboration",
    onSubmit: async (data) => {
      console.log("Collaboration updated:", data)
      return Promise.resolve()
    },
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
}

export const APIIntegrations: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**API Integrations** - Demonstrates real-time API data integration.

Features:
- BuildingConnected vendor data
- Compass compliance metrics
- SiteMate safety information
- Procore cost codes
- Sage 300 financial data
- Connection status indicators

Shows how external API data enhances the buyout form with real-time information.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    initialData: {
      ...mockInitialData,
      apiData: {
        buildingConnected: {
          vendorDetails: { name: "ABC Construction", rating: 4.5 },
          bidAmounts: [2480000, 2520000, 2450000],
          winRates: 0.75,
        },
        compass: {
          complianceChecklist: [
            { item: "Insurance", status: "complete" },
            { item: "W-9", status: "pending" },
          ],
          riskMetrics: { overall: "medium", financial: "low" },
        },
      },
    },
    activeTab: "buyout-details",
    onSubmit: async (data) => {
      console.log("API-enhanced buyout submitted:", data)
      return Promise.resolve()
    },
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
}

export const LoadingState: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Loading State** - Form in loading/saving state.

Features:
- Loading indicators
- Disabled form elements
- Progress feedback
- Auto-save status
- Connection indicators

Shows the user experience during form submission and API operations.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    initialData: mockInitialData,
    activeTab: "buyout-details",
    isLoading: true,
    onSubmit: async (data) => {
      console.log("Loading buyout submission:", data)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return Promise.resolve()
    },
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
}

export const ValidationErrors: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Validation Errors** - Form with validation errors and error handling.

Features:
- Field-level validation
- Error messaging
- Form validation summary
- Required field indicators
- Data integrity checks

Demonstrates comprehensive form validation and error handling.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    initialData: {
      ...mockInitialData,
      contract_value: 2800000, // Over budget
      materials: [
        {
          ...mockInitialData.materials[0],
          quoteValue: 0, // Invalid quote value
        },
      ],
    },
    activeTab: "buyout-details",
    onSubmit: async (data) => {
      console.log("Validation errors in submission:", data)
      throw new Error("Validation failed: Contract value exceeds budget")
    },
    onTabChange: (tab) => console.log("Tab changed to:", tab),
  },
}
