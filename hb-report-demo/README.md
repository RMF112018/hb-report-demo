# HB Report Platform - Storybook Documentation

## Overview

This directory contains Storybook stories and documentation for the HB Report Platform's Subcontract Buyout and Material Procurement feature. The stories demonstrate component usage across different user roles and scenarios with comprehensive AIA compliance support.

## Quick Start

### Prerequisites
- Node.js 18+
- Storybook 7+
- All project dependencies installed

### Running Storybook

\`\`\`bash
# Install Storybook (if not already installed)
npx storybook@latest init

# Start Storybook development server
npm run storybook
\`\`\`

### Building Storybook

\`\`\`bash
# Build static Storybook for deployment
npm run build-storybook
\`\`\`

## Story Structure

### Buyout Stories (`/stories/buyout/`)

1. **buyout-schedule.stories.tsx** - Main dashboard interface
2. **buyout-analytics.stories.tsx** - Analytics and performance metrics
3. **enhanced-buyout-form.stories.tsx** - Comprehensive buyout form
4. **material-procurement-table.stories.tsx** - Material management table
5. **bid-comparison-tool.stories.tsx** - Vendor bid analysis tool
6. **hbi-buyout-insights.stories.tsx** - AI-powered insights
7. **buyout-distribution-modal.stories.tsx** - Email distribution system

## User Role Scenarios

### Project Manager (PM) Stories
- Creating new buyout records from templates
- Managing material procurement and specifications
- Using bid comparison tools for vendor selection
- Submitting records for approval workflow
- Distributing contracts and documentation

### Project Executive (PX) Stories
- Reviewing submitted buyout records
- Approving/rejecting with detailed comments
- Managing multi-project oversight
- Monitoring compliance and risk metrics
- Accessing approval analytics

### Executive Stories
- Company-wide buyout overview
- Read-only access to approved records
- Portfolio analytics and trend visualization
- Strategic insights and market intelligence
- Executive dashboard exports

## Mock Data

Stories use realistic mock data from:
- `/data/mock-buyout-records.json` - Buyout data and metadata
- `/data/mock-material-procurement.json` - Material procurement records

### Mock Data Structure

**Buyout Records**:
\`\`\`json
{
  "buyoutRecords": [
    {
      "id": "bo_001",
      "projectId": "proj_001",
      "name": "Site Work & Excavation",
      "vendorName": "Pacific Excavation Inc.",
      "status": "active",
      "contractAmount": 1180000,
      "budgetAmount": 1200000,
      "complianceStatus": "compliant"
    }
  ]
}
\`\`\`

**Material Procurement**:
\`\`\`json
{
  "materialProcurementRecords": [
    {
      "id": "mp_001",
      "projectId": "proj_001",
      "item": {
        "name": "Structural Steel Beams",
        "quantity": 50,
        "unit": "tons"
      },
      "vendor": {
        "name": "Steel Supply Co"
      },
      "orderedStatus": "Delivered"
    }
  ]
}
\`\`\`

## Component Props Documentation

Each story includes comprehensive props documentation with:
- **Control types** for interactive testing
- **Description text** explaining prop usage
- **Default values** and expected formats
- **Validation rules** and constraints
- **AIA compliance** requirements

### Example Props Documentation

\`\`\`typescript
interface BuyoutAnalyticsProps {
  buyoutRecords: BuyoutRecord[]
  materialRecords: MaterialProcurement[]
  onDrillDown?: (metric: string, filters: any) => void
  className?: string
}
\`\`\`

## Interactive Features

### Controls Panel
Use Storybook's Controls panel to:
- Switch between user roles (PM, PX, Executive)
- Modify component props in real-time
- Test different data scenarios
- Simulate API connection states
- Adjust compliance settings

### Actions Panel
Monitor component interactions:
- Form submissions and validations
- API call simulations
- State changes and updates
- Error handling scenarios
- Approval workflow actions

## AIA Compliance Testing

### Compliance Scenarios

Stories include specific scenarios for testing AIA compliance:

1. **Complete Compliance**: All requirements met
2. **Partial Compliance**: Some requirements pending
3. **Non-Compliance**: Critical requirements missing
4. **Waiver Scenarios**: Approved compliance waivers

### AIA Document Generation

Test AIA-compliant document generation:
- **G702 Forms**: Application and Certificate for Payment
- **G703 Forms**: Continuation Sheet
- **Schedule of Values**: Detailed cost breakdown
- **Retention Calculations**: Proper retention handling
- **Lien Waivers**: Conditional and unconditional waivers

### Compliance Validation

Stories demonstrate compliance validation:
\`\`\`typescript
// Example compliance check
const complianceChecks = [
  { requirement: 'General Liability Insurance', status: 'approved' },
  { requirement: 'Performance Bond', status: 'pending' },
  { requirement: 'W-9 Form', status: 'missing' }
]
\`\`\`

## API Integration Testing

### Mock API Responses

Stories simulate various API integration states:

**BuildingConnected API**:
- Vendor performance data
- Bid history and win rates
- Project completion metrics

**Compass API**:
- Compliance status monitoring
- Risk assessment scores
- Documentation tracking

**SiteMate API**:
- Safety incident reports
- Quality inspection results
- Performance ratings

**Procore API**:
- Cost code integration
- Budget variance tracking
- Progress monitoring

**Sage 300 API**:
- Financial data integration
- Payment history tracking
- Vendor credit ratings

### Connection States

Test different API connection scenarios:
- **Connected**: Full API integration active
- **Disconnected**: Offline mode with cached data
- **Loading**: Connection in progress
- **Error**: API connection failures

## Development Workflow

### Adding New Stories

1. **Create Story File**
\`\`\`typescript
// stories/buyout/new-component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { NewComponent } from '../../components/buyout/new-component'

const meta: Meta<typeof NewComponent> = {
  title: 'Buyout/NewComponent',
  component: NewComponent,
  parameters: {
    docs: {
      description: {
        component: 'Component description here'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof NewComponent>

export const Default: Story = {
  args: {
    // Default props
  }
}
\`\`\`

2. **Add Role-Based Variations**
\`\`\`typescript
export const PMView: Story = {
  args: {
    userRole: 'PM',
    // PM-specific props
  }
}

export const PXView: Story = {
  args: {
    userRole: 'PX',
    // PX-specific props
  }
}

export const ExecutiveView: Story = {
  args: {
    userRole: 'Executive',
    // Executive-specific props
  }
}
\`\`\`

3. **Include AIA Compliance Scenarios**
\`\`\`typescript
export const AIACompliant: Story = {
  args: {
    complianceStatus: 'compliant',
    aiaDocuments: {
      g702: true,
      g703: true,
      scheduleOfValues: true
    }
  }
}

export const AIANonCompliant: Story = {
  args: {
    complianceStatus: 'non-compliant',
    missingDocuments: ['insurance', 'bond']
  }
}
\`\`\`

### Testing Stories

\`\`\`bash
# Run story tests
npm run test-storybook

# Visual regression testing
npm run chromatic

# Accessibility testing
npm run test-storybook -- --testNamePattern="a11y"
\`\`\`

## Deployment

### Static Build
\`\`\`bash
# Build for deployment
npm run build-storybook

# Deploy to hosting service
# (Configure based on your deployment target)
\`\`\`

### Integration with CI/CD
Add Storybook builds to your CI pipeline:

\`\`\`yaml
# .github/workflows/storybook.yml
name: Build Storybook
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build-storybook
      - run: npm run test-storybook
\`\`\`

## Best Practices

### Story Organization
- Group related stories by feature area
- Use consistent naming conventions
- Include comprehensive prop documentation
- Provide realistic mock data
- Test all user role scenarios

### Documentation
- Write clear component descriptions
- Include usage examples and code snippets
- Document AIA compliance requirements
- Explain complex interactions
- Provide troubleshooting guidance

### Testing
- Cover all major user scenarios
- Test error states and edge cases
- Include accessibility testing
- Validate responsive behavior
- Test API integration states

### AIA Compliance
- Test all compliance scenarios
- Validate document generation
- Check retention calculations
- Verify lien waiver processing
- Test approval workflows

## Troubleshooting

### Common Issues

**Stories Not Loading**
- Check import paths are correct
- Verify component exports match imports
- Ensure mock data files exist
- Check TypeScript compilation errors

**Controls Not Working**
- Verify argTypes configuration
- Check prop types match controls
- Ensure component accepts props correctly
- Review default values

**Mock Data Issues**
- Validate JSON syntax in data files
- Check file paths in story imports
- Verify data structure matches interfaces
- Ensure all required fields are present

**AIA Compliance Issues**
- Check compliance data structure
- Verify document generation logic
- Test retention calculations
- Validate approval workflows

### Debug Mode

Enable Storybook debug logging:
\`\`\`bash
DEBUG=storybook:* npm run storybook
\`\`\`

### Performance Issues

Optimize large datasets:
\`\`\`typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component implementation
})

// Implement virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window'
\`\`\`

## Contributing

1. Follow established story patterns
2. Include comprehensive documentation
3. Test stories across different viewports
4. Ensure AIA compliance scenarios
5. Update this README for new features

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Component Documentation](/docs/buyout-procurement.md)
- [TypeScript Interfaces](/types/procurement.ts)
- [Mock Data Schemas](/data/)
- [AIA Standards](https://www.aia.org/resources/6076-standard-form-documents)

## Support

For questions about Storybook setup or story development:
1. Check the troubleshooting section above
2. Review existing stories for patterns
3. Consult the main project documentation
4. Contact the development team

---

## Story Examples

### Basic Story Structure
\`\`\`typescript
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Description of what this story demonstrates'
      }
    }
  },
  args: {
    // Component props
  }
}
\`\`\`

### Role-Based Story
\`\`\`typescript
export const ProjectManagerView: Story = {
  parameters: {
    docs: {
      description: {
        story: 'PM-specific functionality and permissions'
      }
    },
    mockData: {
      user: { role: 'PM', permissions: ['create', 'edit'] }
    }
  },
  args: {
    userRole: 'PM'
  }
}
\`\`\`

### AIA Compliance Story
\`\`\`typescript
export const AIACompliantBuyout: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Buyout record meeting all AIA requirements'
      }
    }
  },
  args: {
    buyoutRecord: {
      complianceStatus: 'compliant',
      aiaDocuments: {
        g702: true,
        g703: true,
        scheduleOfValues: true,
        insurance: true,
        bond: true
      }
    }
  }
}
\`\`\`

### API Integration Story
\`\`\`typescript
export const WithAPIIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Component with full API integration'
      }
    },
    mockData: {
      apiStatus: {
        buildingConnected: 'connected',
        compass: 'connected',
        siteMate: 'connected',
        procore: 'connected',
        sage300: 'connected'
      }
    }
  },
  args: {
    // Component props
  }
}
\`\`\`

This comprehensive Storybook setup provides thorough testing and documentation for the HB Report Platform's Buyout & Procurement features, ensuring proper functionality across all user roles and AIA compliance scenarios.
