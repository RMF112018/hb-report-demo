import type { Meta, StoryObj } from "@storybook/react"
import { MaterialProcurementTable } from "../../components/buyout/MaterialProcurementTable"

const meta: Meta<typeof MaterialProcurementTable> = {
  title: "Buyout/MaterialProcurementTable",
  component: MaterialProcurementTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Material Procurement Table

Advanced table component for managing material procurement records with real-time API integrations,
filtering, sorting, and comprehensive material lifecycle tracking.

## Features
- **Real-time API Integration**: BuildingConnected, SiteMate, Compass, Procore, Sage 300
- **Advanced Filtering**: Search, vendor, status, compliance filters
- **Sorting**: Multi-column sorting with visual indicators
- **Expandable Rows**: Detailed material information and annotations
- **Quality Management**: SiteMate integration for quality status tracking
- **Compliance Monitoring**: Compass integration for compliance verification
- **Annotation System**: Notes and comments for material tracking
- **Export Capabilities**: Excel and PDF export options

## API Integrations
- **BuildingConnected**: Vendor verification and performance data
- **SiteMate**: Quality inspections and safety compliance
- **Compass**: Regulatory compliance and risk assessment
- **Procore**: Requisitions and material tracking
- **Sage 300**: Purchase orders and financial data

## Material Lifecycle
1. **Quote Requested**: Initial material specification
2. **Quote Received**: Vendor pricing received
3. **PO Issued**: Purchase order generated
4. **Ordered**: Material ordered from vendor
5. **Delivered**: Material received on site

## Quality Statuses
- **Pending**: Awaiting quality inspection
- **Under Review**: Quality review in progress
- **Approved**: Material approved for use
- **Rejected**: Material rejected, replacement needed
        `,
      },
    },
  },
  argTypes: {
    projectId: {
      control: { type: "text" },
      description: "Project identifier for filtering materials",
    },
    projectEndDate: {
      control: { type: "text" },
      description: "Project end date for delivery validation",
    },
    onItemUpdate: {
      action: "itemUpdate",
      description: "Callback when material item is updated",
    },
    onItemDelete: {
      action: "itemDelete",
      description: "Callback when material item is deleted",
    },
    onItemAdd: {
      action: "itemAdd",
      description: "Callback when new material item is added",
    },
  },
}

export default meta
type Story = StoryObj<typeof MaterialProcurementTable>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Default Material Table** - Standard view with all materials and API integrations.

Features:
- Complete material listing
- API connection status
- Search and filter capabilities
- Sortable columns
- Expandable row details
- Action buttons for CRUD operations

This is the primary view for managing material procurement.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    projectEndDate: "2024-12-31",
    onItemUpdate: (item) => console.log("Material updated:", item),
    onItemDelete: (itemId) => console.log("Material deleted:", itemId),
    onItemAdd: (item) => console.log("Material added:", item),
  },
}

export const WithFilters: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Filtered View** - Table with active filters applied.

Demonstrates:
- Search functionality
- Vendor filtering
- Status filtering
- Compliance filtering
- Real-time filter updates
- Filter persistence

Users can quickly find specific materials using multiple filter criteria.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    projectEndDate: "2024-12-31",
  },
}

export const APIConnected: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**API Connected** - Table with all external APIs connected and providing data.

Shows:
- Real-time vendor verification (BuildingConnected)
- Quality status updates (SiteMate)
- Compliance monitoring (Compass)
- Purchase order tracking (Procore)
- Financial data (Sage 300)
- Connection status indicators

This represents the optimal state with full API integration.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    projectEndDate: "2024-12-31",
  },
}

export const APIDisconnected: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**API Disconnected** - Table operating with limited API connectivity.

Features:
- Offline mode indicators
- Cached data usage
- Manual data entry options
- Connection retry functionality
- Degraded feature warnings

Shows graceful degradation when external APIs are unavailable.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    projectEndDate: "2024-12-31",
  },
}

export const QualityIssues: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Quality Issues** - Materials with quality problems requiring attention.

Highlights:
- Rejected materials
- Quality review items
- Inspection failures
- Replacement requirements
- Vendor performance issues

Critical for maintaining construction quality standards.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    projectEndDate: "2024-12-31",
  },
}

export const DeliveryDelays: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Delivery Delays** - Materials with delivery schedule issues.

Shows:
- Overdue deliveries
- Schedule impact warnings
- Expediting options
- Alternative supplier suggestions
- Critical path analysis

Essential for project schedule management.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    projectEndDate: "2024-06-30", // Earlier end date to show delays
  },
}

export const ComplianceAlerts: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Compliance Alerts** - Materials with compliance issues.

Features:
- Non-compliant materials
- Regulatory violations
- Certification requirements
- Approval workflows
- Risk mitigation

Critical for regulatory compliance and risk management.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    projectEndDate: "2024-12-31",
  },
}

export const ExpandedRows: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Expanded Rows** - Detailed view with expanded material information.

Shows:
- Complete material specifications
- Vendor contact details
- Annotation history
- Integration data
- Quality metrics
- Delivery tracking

Provides comprehensive material details in an expandable interface.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    projectEndDate: "2024-12-31",
  },
}

export const AddMaterialDialog: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Add Material Dialog** - Creating new material procurement records.

Features:
- Material specification form
- Vendor selection
- Cost estimation
- Delivery scheduling
- Quality requirements
- Compliance verification

Used for adding new materials to the procurement list.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    projectEndDate: "2024-12-31",
  },
}

export const AnnotationSystem: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Annotation System** - Material tracking with notes and comments.

Features:
- Add/edit annotations
- User attribution
- Timestamp tracking
- Annotation types (Note, Issue, Update, Approval)
- Search annotations
- Export annotations

Essential for maintaining material procurement history and communication.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    projectEndDate: "2024-12-31",
  },
}

export const LoadingState: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Loading State** - Table loading material data.

Shows:
- Loading indicators
- Skeleton animations
- API connection progress
- Data fetch status
- Progressive loading

Provides feedback during data loading operations.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    projectEndDate: "2024-12-31",
  },
}

export const EmptyState: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Empty State** - No materials in the project.

Features:
- Empty state messaging
- Getting started guidance
- Add material call-to-action
- Template suggestions
- Import options

Guides users through adding their first materials.
        `,
      },
    },
  },
  args: {
    projectId: "proj_new",
    projectEndDate: "2024-12-31",
  },
}

export const ExportOptions: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Export Options** - Material data export capabilities.

Features:
- Excel export with formatting
- PDF reports with charts
- Custom report templates
- Filtered data export
- Scheduled exports

Enables data sharing and reporting for stakeholders.
        `,
      },
    },
  },
  args: {
    projectId: "proj_001",
    projectEndDate: "2024-12-31",
  },
}
