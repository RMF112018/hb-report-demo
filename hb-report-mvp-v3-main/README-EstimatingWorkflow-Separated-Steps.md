# EstimatingWorkflow - Separated Clarifications and RFI Steps

## Overview

The EstimatingWorkflow component has been refactored to separate Clarifications & Assumptions and RFIs into distinct workflow steps, creating a comprehensive 7-step estimating process for the Atlantic Fields Club project.

## Architecture

### Workflow Steps

1. **Quantity Takeoff** - Area calculations and project metrics
2. **Clarifications & Assumptions** - Project clarifications management  
3. **RFIs** - Requests for information management
4. **Document Log** - Document management (placeholder)
5. **Subcontractors** - Vendor management (placeholder)
6. **Cost Estimating** - Cost calculations (placeholder)
7. **General Conditions** - Project conditions (placeholder)

### Key Components

#### EstimatingWorkflow
- **Purpose**: Main orchestrator component managing the 7-step workflow
- **Features**: Navigation, state management, URL routing, save/export functionality
- **Integration**: BuildingConnected API, EstimatingContext

#### ClarificationsAssumptions
- **Purpose**: Manages project clarifications and assumptions
- **Data Source**: 02_Clarifications&Assumptions.pdf (Atlantic Fields Club)
- **Features**: CRUD operations, search/filter, validation, export
- **Columns**: CSI Division, Description, Type (Assumption/Exclusion), Actions

#### RFI
- **Purpose**: Manages requests for information
- **Data Source**: 03_RequestsForInformation.pdf (Atlantic Fields Club)
- **Features**: CRUD operations, search/filter, validation, export
- **Columns**: RFI Number, Question, Status (Pending/Answered), Date Submitted, Response, Actions

## Data Structures

### Clarification Interface
\`\`\`typescript
interface Clarification {
  id: string
  csiDivision: string
  description: string
  type: 'Assumption' | 'Exclusion'
  notes?: string
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### RFI Interface
\`\`\`typescript
interface RFI {
  id: string
  number: string
  question: string
  status: 'Pending' | 'Answered'
  dateSubmitted: string
  response: string
  dateAnswered?: string
  assignedTo?: string
  priority?: 'Low' | 'Medium' | 'High'
}
\`\`\`

## Features

### Search & Filtering
- **Clarifications**: Filter by CSI Division, Description, or Type
- **RFIs**: Filter by RFI Number, Question, Status, or Response
- **Performance**: 300ms debounced search for optimal performance

### Validation
- **Clarifications**: CSI Division format validation, required fields
- **RFIs**: Unique RFI number validation, required fields
- **Error Handling**: Toast notifications for validation errors

### CRUD Operations
- **Create**: Add new clarifications/RFIs via dialog forms
- **Read**: Display in responsive tables with pagination support
- **Update**: Edit existing items with pre-populated forms
- **Delete**: Remove items with confirmation

### Export Functionality
- **Format**: CSV export (mock implementation)
- **Feedback**: Toast notifications for success/failure
- **Future**: PDF export capability planned

## State Management

### EstimatingContext
- **Centralized State**: Manages all workflow data
- **Persistence**: Integrates with BuildingConnected API
- **Performance**: Optimized with useCallback and useMemo

### Context Methods
\`\`\`typescript
// Clarifications
addClarification(clarification: Omit<Clarification, "id" | "createdAt" | "updatedAt">)
updateClarification(id: string, clarification: Partial<...>)
deleteClarification(id: string)

// RFIs
addRFI(rfi: Omit<RFI, "id">)
updateRFI(id: string, rfi: Partial<...>)
deleteRFI(id: string)
\`\`\`

## Navigation & Routing

### URL Structure
- `/pre-con/estimating?step=1` - Quantity Takeoff
- `/pre-con/estimating?step=2` - Clarifications & Assumptions
- `/pre-con/estimating?step=3` - RFIs
- `/pre-con/estimating?step=4` - Document Log
- `/pre-con/estimating?step=5` - Subcontractors
- `/pre-con/estimating?step=6` - Cost Estimating
- `/pre-con/estimating?step=7` - General Conditions

### Navigation Features
- **Deep Linking**: Direct access to specific steps via URL
- **State Persistence**: Maintains data across navigation
- **Responsive Design**: Mobile-friendly stepper navigation

## Performance Optimizations

### React Optimizations
- **useMemo**: Filtered data calculations
- **useCallback**: Event handlers and API calls
- **Debounced Search**: 300ms delay for search inputs
- **Virtualization Ready**: Supports react-virtuoso for large datasets

### Data Management
- **Efficient Updates**: Immutable state updates
- **Batch Operations**: Grouped API calls where possible
- **Caching**: BuildingConnected data caching

## Styling & UI

### Design System
- **Framework**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Theme**: Consistent with Pre-Con dashboard aesthetic

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg responsive breakpoints
- **Tables**: Horizontal scroll on mobile
- **Forms**: Stacked layout on small screens

## Mock Data

### Clarifications (10 items)
Based on Atlantic Fields Club project documentation:
- Division 1: General requirements and exclusions
- Division 3: Concrete work assumptions
- Division 5: Steel framing discrepancies
- Division 7: Roofing system assumptions
- Division 8: Glazing system compliance
- Division 32: Site work conditions

### RFIs (10 items)
Based on Master RFI Log from project documentation:
- Bid requirements and contract terms
- Site conditions and access
- Technical specifications
- Material and system clarifications
- Coordination requirements

## Testing Strategy

### Unit Tests
- Component rendering and props
- Form validation logic
- State management functions
- Search and filter functionality

### Integration Tests
- Context provider functionality
- API integration points
- Navigation and routing
- Data persistence

### E2E Tests
- Complete workflow navigation
- CRUD operations end-to-end
- Export functionality
- Error handling scenarios

## Future Enhancements

### Phase 1 (Immediate)
- Complete Document Log implementation
- Enhanced Subcontractors management
- Cost Estimating tools integration

### Phase 2 (Short-term)
- Real-time collaboration features
- Advanced filtering and sorting
- Bulk operations support
- PDF export functionality

### Phase 3 (Long-term)
- AI-powered suggestions
- Template management
- Advanced reporting
- Mobile app integration

## Maintenance Guidelines

### Adding New Clarification Types
1. Update `Clarification` interface type property
2. Add new type to Select options in dialog form
3. Update `getClarificationTypeBadge` function
4. Test validation logic

### Adding New RFI Statuses
1. Update `RFI` interface status property
2. Add new status to Select options in dialog form
3. Update `getRFIStatusBadge` function
4. Test status transitions

### Extending Validation Rules
1. Update validation functions in component
2. Add new error messages to toast notifications
3. Update form submission logic
4. Add corresponding tests

### Performance Monitoring
- Monitor component render times
- Track search performance with large datasets
- Monitor API response times
- Optimize based on usage patterns

## Troubleshooting

### Common Issues
1. **Context Not Available**: Ensure component is wrapped with EstimatingProvider
2. **Search Performance**: Check debounce implementation and dataset size
3. **Form Validation**: Verify validation functions and error handling
4. **Navigation Issues**: Check URL routing and step configuration

### Debug Tools
- React Developer Tools for component inspection
- Network tab for API call monitoring
- Console logs for state changes
- Performance profiler for optimization

## API Integration

### BuildingConnected Integration
- **Authentication**: Handled by enhancedBuildingConnectedAPI
- **Data Sync**: Automatic synchronization with external systems
- **Error Handling**: Comprehensive error handling and retry logic
- **Caching**: Intelligent caching for improved performance

### Data Persistence
- **Auto-save**: Automatic saving of changes
- **Conflict Resolution**: Handles concurrent editing scenarios
- **Backup**: Regular data backups and recovery
- **Versioning**: Change tracking and history

This documentation provides comprehensive guidance for maintaining and extending the EstimatingWorkflow component with separated Clarifications and RFI steps.
