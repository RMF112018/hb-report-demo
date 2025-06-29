# Pre-Construction Dashboard Documentation

## Overview

The `PreConDashboard` component serves as the central hub for all pre-construction activities within the HB Report application. It provides a comprehensive overview of RFPs, estimates, performance metrics, and team collaboration tools.

## Features

### 🎯 Core Functionality
- **RFP Management**: Track and manage incoming requests for proposals
- **Performance Analytics**: Monitor win rates, bid accuracy, and team performance
- **Active Projects**: Oversee projects from pursuit through mobilization
- **Deadline Tracking**: Stay on top of critical dates and milestones
- **Trade Participation**: Monitor subcontractor engagement and bidding

### 🔐 Role-Based Features
- **Estimator Greeting**: Personalized welcome message for estimators
- **Quick Actions**: Role-appropriate action buttons and shortcuts
- **Contextual Information**: Relevant metrics based on user permissions

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Grid Layout**: Adaptive grid system for different viewport sizes
- **Touch-Friendly**: Large touch targets for mobile interaction

## Component Architecture

### File Structure
\`\`\`
components/precon/
├── precon-dashboard.tsx     # Main dashboard component
├── rfp-management.tsx       # RFP tracking (future)
├── performance-metrics.tsx  # Analytics (future)
├── active-projects.tsx      # Project management (future)
├── deadline-tracker.tsx     # Calendar integration (future)
└── trade-participation.tsx  # Subcontractor management (future)
\`\`\`

### TypeScript Interfaces

#### User Interface
\`\`\`typescript
interface User {
  id: string
  firstName: string
  lastName: string
  role: "estimator" | "project-manager" | "c-suite" | ...
  email: string
  company: string
}
\`\`\`

#### RFP Interface
\`\`\`typescript
interface RFP {
  id: string
  projectName: string
  client: string
  status: "received" | "in-progress" | "submitted" | "awarded" | "declined"
  dateReceived: string
  dueDate: string
  estimatedValue: number
  location: string
  projectType: "commercial" | "residential" | "industrial" | "infrastructure"
  priority: "low" | "medium" | "high" | "critical"
  assignedEstimator?: string
  completionPercentage?: number
}
\`\`\`

## Implementation Guide

### Basic Usage
\`\`\`tsx
import { PreConDashboard } from '@/components/precon/precon-dashboard'

export default function PreConPage() {
  return <PreConDashboard />
}
\`\`\`

### With Layout Integration
\`\`\`tsx
import { PreConDashboard } from '@/components/precon/precon-dashboard'
import { ContextualSidebar } from '@/components/layout/contextual-sidebar'

export default function PreConPage() {
  return (
    <div className="relative">
      <div className="pr-12">
        <PreConDashboard />
      </div>
      <ContextualSidebar>
        <PreConSidebar />
      </ContextualSidebar>
    </div>
  )
}
\`\`\`

## Styling Guidelines

### Color Scheme
- **Primary Blue**: `#003087` (buttons, accents)
- **Secondary Blue**: `#002066` (hover states)
- **Success Green**: `text-green-600` (positive metrics)
- **Warning Orange**: `text-orange-600` (deadlines)
- **Background**: `bg-gray-50` (main background)

### Typography
- **Headers**: `text-3xl font-bold` for main title
- **Subheaders**: `text-lg font-semibold` for section titles
- **Body Text**: `text-sm text-gray-600` for descriptions
- **Metrics**: `text-2xl font-bold` for key numbers

### Spacing
- **Container**: `container mx-auto px-6 py-8`
- **Sections**: `space-y-8` between major sections
- **Cards**: `gap-8` in grid layouts
- **Content**: `space-y-4` within cards

## Future Development

### Planned Features

#### Phase 1: Core Functionality
- [ ] RFP import and management system
- [ ] Basic performance metrics dashboard
- [ ] Project status tracking
- [ ] Deadline calendar integration

#### Phase 2: Advanced Features
- [ ] AI-powered bid recommendations
- [ ] Automated trade participation tracking
- [ ] Advanced analytics and reporting
- [ ] Integration with external estimating tools

#### Phase 3: Collaboration
- [ ] Team collaboration tools
- [ ] Real-time notifications
- [ ] Document sharing and version control
- [ ] Mobile app integration

### API Integration Points

#### RFP Management
\`\`\`typescript
// GET /api/rfps - Fetch all RFPs
// POST /api/rfps - Create new RFP
// PUT /api/rfps/:id - Update RFP
// DELETE /api/rfps/:id - Delete RFP
\`\`\`

#### Performance Metrics
\`\`\`typescript
// GET /api/metrics/performance - Get performance data
// GET /api/metrics/win-rate - Get win rate analytics
// GET /api/metrics/bid-accuracy - Get bid accuracy data
\`\`\`

#### Project Management
\`\`\`typescript
// GET /api/projects/active - Get active projects
// POST /api/projects - Create new project
// PUT /api/projects/:id/status - Update project status
\`\`\`

## Maintenance Guidelines

### Code Quality
- **TypeScript**: Maintain strict type checking
- **ESLint**: Follow established linting rules
- **Prettier**: Consistent code formatting
- **Comments**: Document complex logic and interfaces

### Performance
- **Lazy Loading**: Implement for heavy components
- **Memoization**: Use React.memo for expensive renders
- **Bundle Size**: Monitor and optimize imports
- **API Calls**: Implement proper caching strategies

### Testing
- **Unit Tests**: Test individual component functions
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Accessibility**: Ensure WCAG compliance

### Security
- **Input Validation**: Sanitize all user inputs
- **Authentication**: Verify user permissions
- **Data Protection**: Encrypt sensitive information
- **Audit Logging**: Track user actions

## Troubleshooting

### Common Issues

#### Authentication Errors
\`\`\`typescript
// Check if user is properly authenticated
const { user } = useAuth()
if (!user) {
  // Handle unauthenticated state
  router.push('/login')
}
\`\`\`

#### Navigation Issues
\`\`\`typescript
// Ensure router is properly imported
import { useRouter } from 'next/navigation'
const router = useRouter()

// Use proper navigation methods
router.push('/pre-con/estimating')
\`\`\`

#### Styling Problems
\`\`\`css
/* Ensure Tailwind classes are properly applied */
.container {
  @apply mx-auto px-6 py-8;
}

/* Check for conflicting styles */
.card-override {
  @apply !bg-white; /* Use !important sparingly */
}
\`\`\`

### Performance Optimization

#### Component Optimization
\`\`\`typescript
// Use React.memo for expensive components
export const PreConDashboard = React.memo(() => {
  // Component logic
})

// Implement proper dependency arrays
useEffect(() => {
  fetchData()
}, [dependency1, dependency2])
\`\`\`

#### Bundle Optimization
\`\`\`typescript
// Use dynamic imports for large components
const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <Skeleton />
})
\`\`\`

## Support and Resources

### Documentation Links
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [Next.js App Router](https://nextjs.org/docs/app)

### Team Contacts
- **Frontend Team**: frontend@hbreport.com
- **Backend Team**: backend@hbreport.com
- **Design Team**: design@hbreport.com
- **Product Team**: product@hbreport.com

### Version History
- **v1.0.0**: Initial dashboard implementation
- **v1.1.0**: Added role-based greetings
- **v1.2.0**: Enhanced responsive design
- **v2.0.0**: Planned - Full RFP management integration
