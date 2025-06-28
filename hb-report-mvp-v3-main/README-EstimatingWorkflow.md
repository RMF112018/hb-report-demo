# EstimatingWorkflow Component Documentation

## Overview

The `EstimatingWorkflow` component provides a comprehensive pre-construction estimating application with a stepper-based workflow. It implements quantity takeoff functionality based on area calculations and provides a foundation for a complete estimating process.

## Architecture

### Component Structure
\`\`\`
EstimatingWorkflowWithProvider (Main Export)
├── EstimatingProvider (Context Provider)
└── EstimatingWorkflow (Main Component)
    ├── Header with Actions
    ├── Workflow Stepper (Tabs)
    └── Step Components
        ├── QuantityTakeoff (Implemented)
        ├── ClarificationsRFIs (Placeholder)
        ├── DocumentLog (Placeholder)
        ├── Subcontractors (Placeholder)
        ├── CostEstimating (Placeholder)
        └── GeneralConditions (Placeholder)
\`\`\`

### Context Management
The component uses React Context (`EstimatingContext`) to manage state across all workflow steps:

\`\`\`typescript
interface EstimatingContextType {
  projectEstimate: ProjectEstimate
  currentStep: string
  setCurrentStep: (step: string) => void
  updateAreaCalculations: (calculations: AreaCalculation[]) => void
  updateProjectMetrics: (metrics: Partial<ProjectEstimate>) => void
  saveEstimate: () => Promise<void>
  exportData: (format: 'csv' | 'pdf') => Promise<void>
}
\`\`\`

## Features

### 1. Quantity Takeoff (Implemented)
- **Area Calculations Table**: Based on 01_AreaCalculations.pdf structure
- **Search Functionality**: Filter by building, level, or area type
- **Editable Rows**: Add/edit square footage with validation
- **Summary Metrics**: Total Gross SF, AC SF, Site Acres, Parking Spaces
- **Real-time Calculations**: Automatic totals recalculation

#### Area Types Supported
- AC SF (Air Conditioned Square Feet)
- Gross SF (Gross Square Feet)
- Covered Patio
- Uncovered Patio
- Parking

### 2. Workflow Steps
1. **Quantity Takeoff** ✅ Implemented
2. **Clarifications & RFIs** 🚧 Placeholder
3. **Document Log** 🚧 Placeholder
4. **Subcontractors** 🚧 Placeholder
5. **Cost Estimating** 🚧 Placeholder
6. **General Conditions** 🚧 Placeholder

### 3. Performance Optimizations
- **Debounced Search**: 300ms delay for search input
- **Memoized Filtering**: `useMemo` for filtered calculations
- **Optimized Re-renders**: `useCallback` for event handlers

## Data Structures

### AreaCalculation Interface
\`\`\`typescript
interface AreaCalculation {
  id: string
  building: string
  level: string
  areaType: 'AC SF' | 'Gross SF' | 'Covered Patio' | 'Uncovered Patio' | 'Parking'
  squareFootage: number
  notes?: string
}
\`\`\`

### ProjectEstimate Interface
\`\`\`typescript
interface ProjectEstimate {
  id: string
  name: string
  projectNumber?: string
  client: string
  estimator: string
  dateCreated: Date
  lastModified: Date
  status: 'draft' | 'in-progress' | 'review' | 'approved' | 'submitted'
  
  // Quantity Takeoff Data
  areaCalculations: AreaCalculation[]
  totalGrossSF: number
  totalACSF: number
  siteAcres: number
  parkingSpaces: number
  
  // Future Step Data (Placeholders)
  clarifications: any[]
  rfis: any[]
  documents: any[]
  subcontractors: any[]
  costs: any[]
  conditions: any[]
}
\`\`\`

## Usage

### Basic Implementation
\`\`\`typescript
import EstimatingWorkflow from '@/components/estimating/estimating-workflow'

export default function EstimatingPage() {
  return <EstimatingWorkflow />
}
\`\`\`

### Using Context in Child Components
\`\`\`typescript
import { useEstimating } from '@/components/estimating/estimating-workflow'

function CustomComponent() {
  const { projectEstimate, updateAreaCalculations } = useEstimating()
  
  // Use context data and methods
  return <div>{/* Component content */}</div>
}
\`\`\`

## Mock Data

The component includes comprehensive mock data for testing:

\`\`\`typescript
const mockAreaCalculations: AreaCalculation[] = [
  {
    id: '1',
    building: 'Dining',
    level: 'Lower Level',
    areaType: 'AC SF',
    squareFootage: 2450,
    notes: 'Main dining area with kitchen'
  },
  // ... more calculations
]
\`\`\`

## API Integration Points

### Save Estimate
\`\`\`typescript
// Current: Mock implementation
const saveEstimate = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('Estimate saved:', projectEstimate)
}

// Future: API integration
const saveEstimate = async () => {
  const response = await fetch('/api/estimates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectEstimate)
  })
  return response.json()
}
\`\`\`

### Export Data
\`\`\`typescript
// Current: Mock implementation
const exportData = async (format: 'csv' | 'pdf') => {
  console.log(`Exporting as ${format}`)
}

// Future: File generation
const exportData = async (format: 'csv' | 'pdf') => {
  const response = await fetch(`/api/estimates/${projectEstimate.id}/export?format=${format}`)
  const blob = await response.blob()
  // Trigger download
}
\`\`\`

## Styling

### Design System
- **Colors**: Primary blue (#003087), hover (#002066)
- **Typography**: Tailwind CSS classes (text-3xl, font-bold, etc.)
- **Spacing**: Consistent gap-* and p-* classes
- **Components**: shadcn/ui components with custom styling

### Responsive Design
- **Mobile**: Stacked layout, single column grids
- **Tablet**: 2-column grids, horizontal tabs
- **Desktop**: Full 6-column stepper, 4-column metrics

## Future Development

### Phase 1: Core Functionality
- [ ] Implement Clarifications & RFIs management
- [ ] Add Document Log with file upload
- [ ] Create Subcontractor management interface

### Phase 2: Advanced Features
- [ ] Cost Estimating with trade breakdowns
- [ ] General Conditions configuration
- [ ] Advanced reporting and analytics

### Phase 3: Integration
- [ ] API backend integration
- [ ] Real-time collaboration features
- [ ] Advanced export formats (Excel, PDF reports)

## Testing

### Unit Tests
\`\`\`typescript
// Test area calculation updates
test('should update area calculations correctly', () => {
  // Test implementation
})

// Test metric calculations
test('should recalculate totals when areas change', () => {
  // Test implementation
})
\`\`\`

### Integration Tests
\`\`\`typescript
// Test workflow navigation
test('should navigate between workflow steps', () => {
  // Test implementation
})

// Test data persistence
test('should maintain data across step changes', () => {
  // Test implementation
})
\`\`\`

## Performance Considerations

### Optimization Strategies
1. **Debounced Search**: Prevents excessive filtering operations
2. **Memoized Calculations**: Reduces unnecessary recalculations
3. **Lazy Loading**: Future implementation for large datasets
4. **Virtual Scrolling**: For tables with 100+ rows

### Memory Management
- Context state is properly managed with useCallback
- Component unmounting cleans up event listeners
- Large datasets should implement pagination

## Security Considerations

### Data Validation
- Input validation for square footage (non-negative numbers)
- Type checking with TypeScript interfaces
- Sanitization of user inputs

### Access Control
- Future implementation of role-based permissions
- Audit logging for estimate changes
- Secure API endpoints for data operations

## Troubleshooting

### Common Issues

#### Context Not Available
\`\`\`
Error: useEstimating must be used within an EstimatingProvider
\`\`\`
**Solution**: Ensure components using `useEstimating` are wrapped in `EstimatingProvider`

#### Performance Issues
**Symptoms**: Slow search or table updates
**Solutions**:
- Check debounce implementation
- Verify memoization is working
- Consider pagination for large datasets

#### State Not Persisting
**Symptoms**: Data lost when switching steps
**Solutions**:
- Verify context provider is at correct level
- Check state update functions are called properly
- Ensure no unnecessary re-renders

## Maintenance

### Regular Tasks
1. **Update Dependencies**: Keep shadcn/ui and other packages current
2. **Performance Monitoring**: Track component render times
3. **Data Validation**: Ensure mock data stays realistic
4. **Documentation**: Keep README updated with changes

### Code Quality
- Follow TypeScript strict mode
- Maintain consistent naming conventions
- Add JSDoc comments for complex functions
- Regular code reviews for new features

## Support

For technical support or feature requests:
1. Check this documentation first
2. Review component source code
3. Test with mock data
4. Contact development team with specific issues

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Maintainer**: Development Team
