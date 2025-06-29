# Field Reports Storybook Stories

This directory contains Storybook stories for the Field Reports feature components of the HB Report Platform.

## Setup Instructions

### Prerequisites
- Node.js 18+
- Storybook 7+
- HB Report Platform dependencies installed

### Installation
1. Ensure Storybook is configured in your project:
\`\`\`bash
npx storybook@latest init
\`\`\`

2. Install required dependencies:
\`\`\`bash
npm install @storybook/addon-docs @storybook/addon-controls @storybook/addon-actions
\`\`\`

3. Add the stories to your Storybook configuration in `.storybook/main.ts`:
\`\`\`typescript
export default {
  stories: [
    '../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  // ... other config
}
\`\`\`

### Running Stories
\`\`\`bash
npm run storybook
\`\`\`

## Story Files

### `field-analytics.stories.tsx`
Stories for the FieldAnalytics component showcasing:
- Default performance metrics display
- High performance scenarios
- Low performance with warnings
- Critical issues requiring attention
- Custom styling variations
- Zero data handling

### `field-table.stories.tsx`
Stories for the FieldTable component demonstrating:
- Daily logs with expandable rows
- Manpower records with efficiency tracking
- Safety audits with violation indicators
- Quality inspections with defect tracking
- Role-based permission variations
- Empty state handling

### `hbi-field-insights.stories.tsx`
Stories for the HBIFieldInsights component featuring:
- AI-powered analysis for different user roles
- Performance state variations (high, low, critical)
- Smart recommendations and action items
- Role-based action capabilities
- Custom styling options

### `field-export-modal.stories.tsx`
Stories for the FieldExportModal component showing:
- Export format options (PDF, Excel, CSV)
- Section selection and customization
- Role-based export permissions
- Email distribution capabilities
- Data filtering and date ranges

### `field-reports-page.stories.tsx`
Stories for the complete FieldReportsPage demonstrating:
- Full dashboard for different user roles
- Responsive design on various devices
- Complete workflow interactions
- Data filtering and search capabilities

## Mock Data

### `mock-data.ts`
Centralized mock data management including:
- Sample daily logs, manpower, safety, and quality data
- Role-based data filtering functions
- Performance state variations
- User context mocking utilities

## Component Documentation

Each story includes comprehensive documentation covering:

### Props Documentation
- Complete TypeScript interface definitions
- Detailed prop descriptions and usage examples
- Control configurations for interactive testing

### Usage Examples
- Code snippets showing proper component usage
- Integration patterns with other components
- Best practices and common patterns

### Accessibility Guidelines
- WCAG 2.1 AA compliance information
- Keyboard navigation support
- Screen reader compatibility notes

### Visual Design Standards
- Color palette and theming guidelines
- Typography and spacing standards
- Component consistency patterns

## Testing Stories

### Interactive Testing
Use Storybook's controls panel to:
- Modify component props in real-time
- Test different data scenarios
- Validate role-based behaviors
- Experiment with styling variations

### Accessibility Testing
- Use the accessibility addon to check compliance
- Test keyboard navigation flows
- Verify screen reader compatibility
- Validate color contrast ratios

### Visual Regression Testing
\`\`\`bash
npm run test:storybook
\`\`\`

## Integration with Main Application

### Component Import Paths
\`\`\`typescript
import { FieldAnalytics } from '@/components/field-reports/FieldAnalytics'
import { FieldTable } from '@/components/field-reports/FieldTable'
import { HBIFieldInsights } from '@/components/field-reports/HBIFieldInsights'
import { FieldExportModal } from '@/components/field-reports/FieldExportModal'
\`\`\`

### Type Definitions
\`\`\`typescript
import type { 
  FieldMetrics, 
  FieldReportsData, 
  DailyLog, 
  ManpowerRecord, 
  SafetyAudit, 
  QualityInspection 
} from '@/types/field-reports'
\`\`\`

### Mock Data Usage
\`\`\`typescript
import { 
  mockFieldData, 
  mockMetrics, 
  getFilteredDataByRole, 
  stateVariations 
} from '@/stories/field/mock-data'
\`\`\`

## Customization

### Adding New Stories
1. Create new story files following the naming convention
2. Import required components and mock data
3. Define story metadata with proper documentation
4. Add interactive controls and variations
5. Include accessibility and usage documentation

### Extending Mock Data
1. Add new data scenarios to `mock-data.ts`
2. Create role-specific filtering functions
3. Define state variations for different scenarios
4. Update type definitions as needed

### Custom Styling Stories
1. Create stories showcasing different themes
2. Demonstrate responsive behavior
3. Show integration with design system
4. Validate accessibility compliance

## Best Practices

### Story Organization
- Group related stories by component
- Use descriptive story names
- Include comprehensive documentation
- Provide interactive controls

### Documentation Standards
- Include component purpose and features
- Provide usage examples and code snippets
- Document props and their expected values
- Explain accessibility considerations

### Testing Approach
- Cover all major use cases and edge cases
- Test role-based variations
- Validate responsive behavior
- Ensure accessibility compliance

### Performance Considerations
- Use efficient mock data structures
- Implement proper memoization
- Optimize story rendering
- Monitor bundle size impact

## Troubleshooting

### Common Issues
1. **Import Errors**: Verify component paths and exports
2. **Type Errors**: Check TypeScript definitions and imports
3. **Styling Issues**: Ensure Tailwind CSS is properly configured
4. **Mock Data Problems**: Validate data structure and types

### Debug Tips
- Use browser dev tools for component inspection
- Check Storybook console for error messages
- Verify mock data matches expected interfaces
- Test stories in isolation before integration

## Contributing

### Adding New Features
1. Create stories for new components
2. Update mock data as needed
3. Add comprehensive documentation
4. Test across different scenarios
5. Ensure accessibility compliance

### Updating Existing Stories
1. Maintain backward compatibility
2. Update documentation accordingly
3. Test all existing variations
4. Validate visual consistency
5. Check performance impact
