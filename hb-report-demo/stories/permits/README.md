# Permit Log & Tracking Storybook Stories

This directory contains comprehensive Storybook stories for the HB Report Permit Log and Tracking feature components.

## Story Files

### Core Components
- `permit-log.stories.tsx` - Main dashboard page with role-based views
- `permit-analytics.stories.tsx` - Analytics and visualization components
- `permit-table.stories.tsx` - Data table with sorting and filtering
- `permit-form.stories.tsx` - Create/edit permit forms
- `permit-calendar.stories.tsx` - Calendar timeline view
- `permit-filters.stories.tsx` - Advanced filtering interface
- `hbi-permit-insights.stories.tsx` - AI-powered insights panel
- `permit-export-modal.stories.tsx` - Export and reporting modal

## Running Stories

1. **Start Storybook**
   \`\`\`bash
   npm run storybook
   \`\`\`

2. **Navigate to Permits Section**
   - Open http://localhost:6006
   - Expand "Permits" in the sidebar
   - Select individual component stories

## Story Features

### Role-Based Testing
Each story includes variations for different user roles:
- **Admin**: Full access to all features
- **Executive**: High-level analytics and reporting
- **Project Executive**: Multi-project access
- **Project Manager**: Single project focus

### State Variations
Stories demonstrate different data states:
- **Default**: Standard operating conditions
- **Empty State**: No data scenarios
- **High Volume**: Large dataset performance
- **Error States**: Validation and error handling
- **Loading States**: Async operation feedback

### Interactive Testing
Stories include automated interaction tests:
- Form validation and submission
- Filter application and clearing
- Modal opening and closing
- Tab navigation and content switching
- Export configuration and generation

## Mock Data

Stories use mock data from:
- `/data/mock-permits.json` - Sample permit records
- `/data/permit-log-schema.json` - Data structure definitions

## Accessibility Testing

All stories include accessibility features:
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

## Development Guidelines

### Adding New Stories
1. Create story file in `/stories/permits/`
2. Follow naming convention: `component-name.stories.tsx`
3. Include comprehensive documentation
4. Add interaction tests where applicable
5. Test multiple user roles and states

### Story Structure
\`\`\`tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from '@/components/path/ComponentName'

const meta: Meta<typeof ComponentName> = {
  title: 'Permits/ComponentName',
  component: ComponentName,
  parameters: {
    docs: {
      description: {
        component: 'Detailed component description'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof ComponentName>

export const Default: Story = {
  args: {
    // Component props
  },
  parameters: {
    docs: {
      description: {
        story: 'Story-specific description'
      }
    }
  }
}
\`\`\`

### Testing Guidelines
- Include play functions for interaction testing
- Test both success and error scenarios
- Verify accessibility features
- Test responsive behavior
- Document expected behaviors

## AIA Compliance

Stories demonstrate AIA-compliant features:
- Professional document formatting
- Proper headers and footers
- Standardized report structures
- Certification requirements
- Audit trail maintenance

## AI Integration

HBI Insights stories showcase:
- Pattern recognition capabilities
- Risk assessment features
- Optimization recommendations
- Confidence scoring systems
- Actionable insights generation

For detailed documentation, see `/docs/permit-log.md`.
