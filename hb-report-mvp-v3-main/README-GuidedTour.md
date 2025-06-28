# Guided Tour System

## Overview

The Guided Tour System provides a comprehensive, non-linear tour experience for the Pre-Construction application using `react-joyride`. It features context-based state management, route-aware step filtering, and persistent user preferences.

## Architecture

### Core Components

1. **TourProvider** - Context provider managing tour state and persistence
2. **GuidedTour** - Main component wrapping react-joyride with custom styling
3. **StartTourButton** - Trigger button for starting tours
4. **TourControlPanel** - Floating control panel for tour navigation
5. **useTour** - Custom hook for accessing tour context

### Key Features

- ✅ Non-linear navigation (users can navigate freely)
- ✅ Route-aware step filtering
- ✅ Persistent user preferences via localStorage
- ✅ Responsive design with mobile optimization
- ✅ Comprehensive accessibility support
- ✅ TypeScript with full type safety
- ✅ Extensive JSDoc documentation

## Installation & Setup

### Prerequisites

\`\`\`bash
npm install react-joyride
\`\`\`

### Basic Implementation

\`\`\`tsx
// app/layout.tsx or main app component
import { TourProvider, GuidedTour } from '@/components/guided-tour/guided-tour'

export default function App() {
  return (
    <TourProvider autoStart={false}>
      <GuidedTour />
      {/* Your app components */}
      <YourAppContent />
    </TourProvider>
  )
}
\`\`\`

### Adding Tour Trigger Button

\`\`\`tsx
// In your header or dashboard component
import { StartTourButton } from '@/components/guided-tour/guided-tour'

export function Header() {
  return (
    <header>
      {/* Other header content */}
      <StartTourButton 
        variant="outline" 
        size="sm" 
        className="ml-auto" 
      />
    </header>
  )
}
\`\`\`

## Tour Step Configuration

### Step Definition Structure

\`\`\`tsx
interface TourStep {
  id: string                    // Unique identifier
  target: string               // CSS selector for target element
  title: string                // Step title
  content: ReactNode           // JSX content for step body
  placement?: Placement        // Tooltip placement
  disableBeacon?: boolean      // Disable beacon animation
  route?: string               // Route where step should be active
  category?: string            // Step category for organization
  priority?: number            // Step ordering priority
  requiresInteraction?: boolean // Whether step requires user interaction
  styles?: object              // Custom styling
}
\`\`\`

### Adding New Tour Steps

1. **Define the step** in `createTourSteps()` function:

\`\`\`tsx
{
  id: 'new-feature',
  target: '[data-tour="new-feature"]', // Use data attributes for reliability
  title: 'New Feature',
  content: (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-700 mb-2">
            Description of the new feature and how to use it.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs">
            <strong>Pro Tip:</strong> Additional helpful information.
          </div>
        </div>
      </div>
    </div>
  ),
  placement: 'right',
  route: '/specific-route', // Optional: only show on specific routes
  category: 'feature',
  priority: 7, // Lower numbers appear first
}
\`\`\`

2. **Add data attribute** to target element:

\`\`\`tsx
<div data-tour="new-feature" className="feature-container">
  {/* Feature content */}
</div>
\`\`\`

### Route-Specific Steps

Steps can be filtered by route using the `route` property:

\`\`\`tsx
{
  id: 'estimating-specific',
  target: '.estimating-workflow',
  title: 'Estimating Workflow',
  route: '/pre-con/estimating', // Only shows on estimating page
  // ... other properties
}
\`\`\`

## Targeting Strategy

### Recommended Selectors (in order of preference)

1. **Data attributes** (most reliable):
   \`\`\`tsx
   target: '[data-tour="element-id"]'
   \`\`\`

2. **Specific CSS classes**:
   \`\`\`tsx
   target: '.specific-component-class'
   \`\`\`

3. **Component-specific selectors**:
   \`\`\`tsx
   target: '.sidebar-menu, [data-tour="sidebar-menu"]' // Fallback approach
   \`\`\`

### Avoiding Fragile Selectors

❌ **Avoid these selectors:**
- Generic classes: `.btn`, `.card`, `.container`
- Positional selectors: `:nth-child()`, `:first-child`
- Styling-based classes: `.text-blue-500`, `.p-4`

✅ **Use these instead:**
- Semantic data attributes: `[data-tour="feature-name"]`
- Component-specific classes: `.estimating-workflow`, `.project-dashboard`
- Unique IDs: `#unique-element-id`

## State Management

### Tour Context State

\`\`\`tsx
interface TourContextState {
  isTourActive: boolean      // Whether tour is running
  currentStep: number        // Current step index
  hasSeenTour: boolean      // Whether user has completed tour
  steps: TourStep[]         // Array of tour steps
  isPaused: boolean         // Whether tour is paused
  totalSteps: number        // Total number of steps
  currentRoute: string      // Current application route
}
\`\`\`

### Available Actions

\`\`\`tsx
const {
  startTour,           // Start the tour
  stopTour,            // Stop the tour
  togglePause,         // Pause/resume tour
  nextStep,            // Go to next step
  previousStep,        // Go to previous step
  skipTour,            // Skip entire tour
  resetTour,           // Reset tour state
  markTourAsSeen,      // Mark as completed
} = useTour()
\`\`\`

## Persistence

### localStorage Structure

\`\`\`json
{
  "hb-report-tour-preferences": {
    "hasSeenTour": true,
    "lastCompletedStep": 5,
    "tourVersion": "1.0.0"
  }
}
\`\`\`

### Managing Tour Versions

When updating tour steps significantly:

\`\`\`tsx
// In your tour step definitions
const TOUR_VERSION = '1.1.0'

// Check version and reset if needed
const checkTourVersion = () => {
  const stored = localStorage.getItem(TOUR_STORAGE_KEY)
  if (stored) {
    const prefs = JSON.parse(stored)
    if (prefs.tourVersion !== TOUR_VERSION) {
      resetTour()
      saveTourPreferences({ tourVersion: TOUR_VERSION })
    }
  }
}
\`\`\`

## Styling & Customization

### Default Styling

The tour uses shadcn/ui design tokens and Tailwind CSS:

\`\`\`tsx
const DEFAULT_JOYRIDE_STYLES = {
  options: {
    primaryColor: '#2563eb',     // Blue-600
    textColor: '#374151',        // Gray-700
    backgroundColor: '#ffffff',
    overlayColor: 'rgba(0, 0, 0, 0.4)',
  },
  tooltip: {
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    maxWidth: '400px',
  }
}
\`\`\`

### Custom Step Styling

\`\`\`tsx
{
  id: 'custom-styled-step',
  // ... other properties
  styles: {
    tooltip: {
      width: '500px',
      backgroundColor: '#f8fafc',
    },
    tooltipTitle: {
      color: '#1e40af',
      fontSize: '18px',
    }
  }
}
\`\`\`

### Responsive Behavior

The tour automatically adjusts placement on mobile devices:

\`\`\`tsx
// Placement automatically adjusts based on viewport
placement: 'auto' // Recommended for responsive behavior
\`\`\`

## Performance Optimization

### Memoization

- Steps are memoized with `useMemo` to prevent unnecessary re-renders
- Context value is memoized to optimize child component updates
- Route changes are debounced (300ms) to reduce context updates

### Bundle Size

- react-joyride adds ~50KB to bundle size
- Consider code splitting for tour functionality:

\`\`\`tsx
// Lazy load tour components
const GuidedTour = lazy(() => import('@/components/guided-tour/guided-tour'))
\`\`\`

## Accessibility

### ARIA Support

- All interactive elements include proper ARIA labels
- Tour steps are announced to screen readers
- Keyboard navigation is fully supported

### Keyboard Controls

- `Esc` - Close tour
- `Enter/Space` - Next step (when focused)
- `Tab` - Navigate between tour controls

### Screen Reader Support

\`\`\`tsx
// Example of accessible step content
content: (
  <div role="dialog" aria-labelledby="tour-title" aria-describedby="tour-content">
    <h3 id="tour-title">{step.title}</h3>
    <div id="tour-content">{step.description}</div>
  </div>
)
\`\`\`

## Testing

### Unit Testing

\`\`\`tsx
// Example test for tour context
import { renderHook, act } from '@testing-library/react'
import { TourProvider, useTour } from './guided-tour'

test('should start tour when startTour is called', () => {
  const wrapper = ({ children }) => <TourProvider>{children}</TourProvider>
  const { result } = renderHook(() => useTour(), { wrapper })

  act(() => {
    result.current.startTour()
  })

  expect(result.current.isTourActive).toBe(true)
})
\`\`\`

### Integration Testing

\`\`\`tsx
// Test tour step targeting
test('should highlight correct elements', () => {
  render(
    <TourProvider>
      <div data-tour="test-element">Test Element</div>
      <GuidedTour />
    </TourProvider>
  )

  // Verify tour targets correct elements
  expect(screen.getByTestId('joyride-step')).toBeInTheDocument()
})
\`\`\`

## Troubleshooting

### Common Issues

1. **Steps not appearing**
   - Verify target elements exist in DOM
   - Check CSS selector syntax
   - Ensure elements are visible (not `display: none`)

2. **Tour not starting**
   - Confirm TourProvider wraps your app
   - Check browser console for errors
   - Verify localStorage permissions

3. **Steps appearing on wrong routes**
   - Check route filtering logic
   - Verify pathname matching
   - Debug with console logs in development

### Debug Mode

Enable debug logging in development:

\`\`\`tsx
// In GuidedTour component
if (process.env.NODE_ENV === 'development') {
  console.log('Tour state:', { isTourActive, currentStep, steps })
}
\`\`\`

## Maintenance

### Regular Maintenance Tasks

1. **Update selectors** when UI components change
2. **Review step content** for accuracy and relevance
3. **Test tour flow** after major UI updates
4. **Monitor localStorage usage** and clean up old preferences
5. **Update tour version** when making significant changes

### Adding New Features

1. Define new tour steps in `createTourSteps()`
2. Add appropriate data attributes to target elements
3. Test on different screen sizes and routes
4. Update documentation and type definitions
5. Consider impact on existing tour flow

### Performance Monitoring

\`\`\`tsx
// Monitor tour performance
const tourMetrics = {
  startTime: Date.now(),
  completionRate: 0,
  averageStepTime: 0,
  dropOffPoints: []
}
\`\`\`

## Migration Guide

### From v1.0 to v1.1

1. Update import paths if changed
2. Review new step properties
3. Test existing customizations
4. Update localStorage version handling

### Breaking Changes

- None in current version
- Future breaking changes will be documented here

## Contributing

### Code Style

- Use TypeScript for all new code
- Include comprehensive JSDoc comments
- Follow existing naming conventions
- Add unit tests for new functionality

### Pull Request Checklist

- [ ] Tests pass
- [ ] Documentation updated
- [ ] Accessibility verified
- [ ] Performance impact assessed
- [ ] Cross-browser testing completed

---

For additional support or questions, please refer to the component documentation or create an issue in the project repository.
