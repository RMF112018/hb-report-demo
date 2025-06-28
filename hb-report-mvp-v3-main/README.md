# HB Report MVP v2 Main

This project is a comprehensive construction management dashboard, focusing on various aspects of project lifecycle, from pre-construction to financial forecasting and reporting.

## Project Structure

The application is structured into several key directories:

-   `app/`: Contains Next.js pages and layouts for different routes (e.g., `/dashboard`, `/pre-con`, `/project-reports`).
-   `components/`: Houses reusable React components, categorized by their domain (e.g., `estimating`, `layout`, `dashboard`, `tools`).
-   `data/`: Mock data and API interfaces for simulating backend operations.
-   `hooks/`: Custom React hooks for shared logic.
-   `lib/`: Utility functions and context providers.
-   `public/`: Static assets like images.
-   `styles/`: Global CSS and module-specific styles.
-   `types/`: TypeScript type definitions.

## Key Features

-   **Dynamic Dashboard:** Customizable project overview with various metrics and analytics.
-   **Pre-Construction Suite:** Tools for estimating, bid tabulation, and pre-construction planning.
-   **Financial Management:** Features for buyout schedules, financial forecasting, and cost control.
-   **Project Management:** Modules for schedule monitoring, manpower tracking, and document compliance.
-   **Responsive Design:** Optimized for various screen sizes using Tailwind CSS.
-   **Mega-Menu Navigation:** Enhanced header with multi-column dropdown menus for intuitive navigation.
-   **Theming:** Dark/light mode toggle.
-   **Guided Tour:** Interactive tour for new users to explore features.

## C-Suite Dashboard

### Overview

The C-Suite Dashboard (`components/dashboards/c-suite-dashboard.tsx`) provides executive-level visibility into key business metrics and performance indicators. It's designed for large displays and offers interactive cards with detailed hover data.

### Key Features

**Interactive Cards:**
- **Business Development:** Pursuits tracking, win rates, and pipeline visualization
- **Estimating Performance:** Proposal success rates and turnaround times
- **VDC/BIM Status:** Model accuracy, coordination issues, and adoption rates
- **Staffing Overview:** Headcount, turnover rates, and department breakdowns
- **Fiscal Year Finances:** Revenue tracking, profit margins, and target progress
- **Project Health Gauge:** Overall project performance with radial gauge chart
- **Active Projects:** Portfolio overview with health distribution
- **HBI Insights:** AI-powered business intelligence with forecasts and alerts

**Technical Implementation:**

- **Data Sources:** Mock data representing API responses from Procore, Unanet, and Building Connected
- **Charts:** Utilizes Recharts for bar charts, line charts, and radial gauge charts
- **Interactivity:** Hover overlays show detailed project data and metrics
- **Responsive Design:** Grid layout adapts from 1 column on mobile to 4 columns on large displays
- **TypeScript:** Fully typed components with comprehensive JSDoc documentation

**Chart Types:**
- **Bar Charts:** Business development pipeline, monthly revenue
- **Line Charts:** Financial trends over time
- **Radial Gauge:** Project health score (0-100)
- **Progress Bars:** Various completion and performance metrics

### Usage Example

\`\`\`tsx
import CSuiteDashboard from '@/components/dashboards/c-suite-dashboard'

export default function ExecutivePage() {
  return <CSuiteDashboard />
}
\`\`\`

### Data Integration

The dashboard uses mock data structures that mirror real API responses:

\`\`\`typescript
// Business Development Data (Building Connected API)
const mockBusinessDevelopment = {
  pursuits: { total: 47, winRate: 60, totalValue: 125000000 },
  pipeline: [/* monthly data */],
  recentWins: [/* recent project wins */]
}

// Financial Data (Unanet API)
const mockFinances = {
  fiscalYear: { revenue: 285000000, profit: 22800000, margin: 8.0 },
  monthlyRevenue: [/* monthly financial data */]
}

// Project Data (Procore API)
const mockProjects = {
  active: 18, totalValue: 425000000, avgHealth: 87,
  recentProjects: [/* project details with health scores */]
}
\`\`\`

### Maintenance Tips

**Adding New Metrics:**
1. Update the relevant mock data structure
2. Add new card component following the `CSuiteCard` pattern
3. Include hover data for detailed information
4. Update grid layout if needed

**Updating Chart Data:**
1. Modify the mock data arrays (e.g., `monthlyRevenue`, `pipeline`)
2. Ensure data structure matches chart component expectations
3. Update chart configuration if adding new data series

**Customizing Hover Interactions:**
1. Extend the `hoverData` prop structure in `CSuiteCard`
2. Add new data transformations for hover content
3. Update styling for different data types

**Performance Optimization:**
- Use `useMemo` for expensive calculations
- Implement data caching for API responses
- Consider virtualization for large datasets

**Real Data Integration:**
1. Replace mock data with actual API calls
2. Add error handling and loading states
3. Implement data refresh mechanisms
4. Add real-time updates where appropriate

### Accessibility

The dashboard implements WCAG 2.1 AA compliance:
- Proper ARIA labels for charts and interactive elements
- Keyboard navigation support
- High contrast color schemes
- Screen reader compatible tooltips

### Browser Support

- Modern browsers with ES2020 support
- Responsive design for tablets and large displays
- Optimized for executive presentation scenarios

## PM Dashboard

### Overview

The PM Dashboard (`components/dashboards/pm-dashboard.tsx`) provides project-specific metrics and performance indicators tailored for project managers. It offers a detailed view of schedule, financial, and operational health for individual projects.

### Key Features

**Interactive Cards:**
- **Project Health:** Overall project health score with a radial gauge chart.
- **Schedule Progress:** Current schedule completion rate with a line chart showing progress over time.
- **Budget vs. Spent:** Financial performance indicating budget utilization with a line chart.
- **Pending Submittals:** Count of outstanding submittals.
- **Open RFIs:** Number of open Requests for Information.
- **Quality Pass Rate:** Percentage of quality checks passed.
- **Safety Incidents:** Number of safety incidents recorded.
- **Current Team Size:** Total personnel assigned to the project.
- **HBI Insights:** AI-powered insights relevant to project management (e.g., schedule delay alerts, cost savings opportunities).

**Technical Implementation:**

- **Data Sources:** Mock data simulating project management systems (e.g., Procore, Primavera).
- **Charts:** Utilizes Recharts for line charts and radial gauge charts, wrapped in `ChartContainer` for proper rendering.
- **Interactivity:** Hover overlays display project-specific breakdowns for each metric.
- **Responsive Design:** Grid layout adapts to various screen sizes (1 to 5 columns).
- **TypeScript:** Fully typed components with comprehensive JSDoc documentation.

**Chart Types:**
- **Line Charts:** Schedule progress, budget vs. spent trends.
- **Radial Gauge:** Project health score.

### Usage Example

The `PMDashboard` is integrated as a tab within the main `app/dashboard/page.tsx`.

\`\`\`tsx
import PMDashboard from '@/components/dashboards/pm-dashboard'

export default function ProjectManagerPage() {
  return <PMDashboard />
}
\`\`\`

### Data Integration

The dashboard uses mock data structures for project metrics:

\`\`\`typescript
// Mock Project Data
const mockProjects = [
  {
    id: "proj1",
    name: "Downtown Office Tower",
    scheduleProgress: 75,
    budgetSpent: 80,
    rfiOpen: 15,
    submittalPending: 22,
    qualityPassRate: 92,
    safetyIncidents: 1,
    teamSize: 45,
    healthScore: 85,
    startDate: "2023-03-01",
    endDate: "2025-06-30",
    status: "active",
  },
  // ... more projects
]

// Mock Schedule Data for charts
const mockScheduleData = [
  { month: "Jan", progress: 10 },
  { month: "Feb", progress: 15 },
  // ... more months
]

// Mock Financial Data for charts
const mockFinancialData = [
  { month: "Jan", budget: 10, spent: 8 },
  { month: "Feb", budget: 20, spent: 18 },
  // ... more months
]

// Mock HBI Insights for PM
const mockPmInsights = [
  {
    id: "pm_insight1",
    type: "risk",
    severity: "high",
    title: "Schedule Delay Alert",
    text: "Downtown Office Tower project is at risk of a 2-week delay due to critical path activities falling behind.",
    action: "Expedite material deliveries and reallocate resources to critical tasks.",
    confidence: 90,
  },
  // ... more insights
]
\`\`\`

### Maintenance Tips

**Updating Project Data:**
1. Modify the `mockProjects` array to update project-specific metrics.
2. Adjust `mockScheduleData` and `mockFinancialData` for chart trends.

**Adding New PM Metrics:**
1. Define new data fields in `mockProjects` or create new mock data arrays.
2. Create a new `PMCard` entry in the `pmCards` array within `PMDashboard`.
3. Ensure appropriate `icon`, `chartType`, and `chartConfig` are provided.

**Customizing AI Insights:**
1. Update the `mockPmInsights` array to add, remove, or modify AI-driven recommendations.
2. Adjust `severity`, `title`, `text`, `action`, and `confidence` as needed.

**Real Data Integration:**
1. Replace mock data imports with actual API calls to your project management system.
2. Implement robust error handling and loading states for data fetching.

## Components Overview

### AppHeader (components/layout/app-header.tsx)

The `AppHeader` component provides the main navigation for the application, featuring a logo, department picker, project picker, tool picker, search functionality, notifications, and a user menu. It implements a mega-menu pattern for departments, projects, and tools, similar to professional construction management platforms.

**Key Features:**

-   **Department Picker:** Allows switching between "Operations" and "Pre-Construction" dashboards, dynamically updating the available tools.
-   **Project Picker:** Enables filtering the dashboard view by specific projects, displaying project status, budget, and completion.
-   **Tool Picker (Mega-Menu):** A comprehensive dropdown menu categorizing various tools (Core Tools, Project Management, Financial Management, Pre-Construction).
-   **Search Bar:** Integrated search functionality for projects and tools.
-   **Notifications:** Displays unread notification count.
-   **User Menu:** Provides access to profile settings, account settings, and logout.
-   **Responsive Design:** Adapts layout for mobile and desktop views, including a mobile-specific search toggle.

**Technical Implementation:**

-   Uses `useState`, `useEffect`, `useRef`, `useMemo`, and `useCallback` for efficient state management and performance.
-   `useAuth` context for user authentication and role-based access.
-   `next-themes` for theme toggling.
-   Click-outside detection for closing mega-menus.
-   Dynamic filtering of tools based on the selected department.
-   JSDoc comments for comprehensive documentation.

**Usage Example:**

The `AppHeader` is integrated into the main application layout (`app/layout.tsx` or `app/client-layout.tsx`) to provide consistent navigation across all pages.

**Styling:**

-   Utilizes Tailwind CSS for responsive and modern styling.
-   Custom gradients and shades of blue for a professional look.
-   Shadcn/ui components like `Button`, `Input`, `Badge`, `Avatar` are used for consistent UI elements.

**Maintenance Tips:**

-   **Adding New Tools:** To add a new tool, update the `tools` array in `AppHeader.tsx` with the `name`, `href`, `category`, and `description`. Ensure the `href` points to the correct page.
-   **Updating Categories:** Modify the `tools` array and the rendering logic within the tool mega-menu to adjust categories or column layouts.
-   **Role-Based Access:** Extend the `hasPreConAccess` function or similar logic to implement more granular role-based access control for specific tools or departments.

### Estimating Workflow (components/estimating/estimating-workflow.tsx)

The `EstimatingWorkflow` component provides a structured, multi-step process for managing project estimates. It guides users through various stages of the pre-construction estimating process, from project setup to bid tabulation and cost summary.

**Key Features:**

-   **Step-by-Step Navigation:** Uses a tab-based interface to guide users through distinct estimating steps.
-   **Context-Based State Management:** Leverages `EstimatingContext` to manage and share estimating data across all steps.
-   **Dynamic Content:** Each tab renders a specific component relevant to that estimating step (e.g., `ProjectSetup`, `QuantityTakeoff`, `EnhancedBidTab`, `CostSummary`).
-   **Guided Tour Integration:** Provides tour steps for each major section, enhancing user onboarding and feature discovery.

**Technical Implementation:**

-   Uses `Tabs` and `TabsContent` from shadcn/ui for the step navigation.
-   `EstimatingProvider` wraps the workflow to provide a shared state.
-   `useEstimating` hook is used within child components to interact with the estimating data.
-   `useGuidedTour` hook integrates with the application's guided tour system.
-   JSDoc comments for comprehensive documentation.

**Usage Example:**

The `EstimatingWorkflow` is typically rendered on the `/pre-con/estimating` page, serving as the central hub for all estimating activities.

**Styling:**

-   Tailwind CSS for layout and styling.
-   Shadcn/ui components ensure a consistent and modern look.

**Maintenance Tips:**

-   **Adding New Steps:** To add a new step, create a new tab in the `Tabs` component, define its content in `TabsContent`, and create a corresponding React component for the step's UI. Update `EstimatingContext` if new data fields are required.
-   **Updating Tour Steps:** Modify the `tourSteps` array within the `useGuidedTour` hook to add, remove, or update tour guidance for new or existing steps.

### Guided Tour (components/dashboard/guided-tour.tsx)

The `GuidedTour` component provides an interactive, step-by-step tour of the application's features using `react-joyride`. It helps new users understand the layout and functionality of the dashboard and various tools.

**Key Features:**

-   **Context-Driven:** Uses `GuidedTourProvider` to manage tour state and steps globally.
-   **Dynamic Steps:** Tour steps are defined within the context and can be updated or extended by different components.
-   **User Control:** Allows users to start, stop, skip, and navigate through the tour.
-   **Persistence:** Remembers if the tour has been completed to avoid re-showing it unnecessarily.

**Technical Implementation:**

-   `react-joyride` library for tour functionality.
-   `GuidedTourProvider` (lib/guided-tour-context.tsx) manages the tour's state and provides methods to register and update steps.
-   `useGuidedTour` hook allows components to interact with the tour (e.g., register new steps, start the tour).
-   Uses `localStorage` to persist the tour completion status.
-   JSDoc comments for comprehensive documentation.

**Usage Example:**

Components can register their specific tour steps using `useGuidedTour().registerStep()`. The main `GuidedTour` component is typically rendered once at a high level in the application (e.g., `app/client-layout.tsx`).

**Maintenance Tips:**

-   **Adding New Tour Steps:** To add new tour steps for a component, use the `registerStep` function from the `useGuidedTour` hook within that component. Ensure the `target` CSS selector is unique and correctly identifies the element to highlight.
-   **Updating Tour Logic:** Modify the `GuidedTourProvider` to change how the tour behaves (e.g., auto-start, different styling).
-   **Conditional Tours:** Implement logic to show different tours based on user roles, first-time login, or specific feature access.

### Pre-Con Dashboard (components/precon/precon-dashboard.tsx)

The `PreConDashboard` component serves as the central hub for pre-construction activities. It provides an overview of key metrics, upcoming deadlines, active projects, and trade participation relevant to the pre-construction phase.

**Key Features:**

-   **Overview Metrics:** Displays critical pre-construction metrics such as total bids, awarded projects, and win rate.
-   **Upcoming Deadlines:** Highlights important deadlines for bids and proposals.
-   **Active Projects:** Lists projects currently in the pre-construction phase.
-   **Trade Participation:** Visualizes trade engagement and bid coverage.
-   **Responsive Layout:** Adapts to different screen sizes using a grid system.

**Technical Implementation:**

-   Uses `Card` components from shadcn/ui for organizing information.
-   Integrates with mock data (`mock-precon.ts`) to populate dashboard elements.
-   Utilizes `Chart` components (e.g., `BarChart`, `PieChart`) for data visualization.
-   JSDoc comments for comprehensive documentation.

**Usage Example:**

The `PreConDashboard` is typically rendered on the `/pre-con` page, providing a quick summary for pre-construction teams.

**Styling:**

-   Tailwind CSS for layout, spacing, and typography.
-   Shadcn/ui components ensure a consistent and modern look.

**Maintenance Tips:**

-   **Updating Metrics:** Modify the data fetching logic or mock data in `mock-precon.ts` to update the displayed metrics.
-   **Adding New Sections:** Extend the grid layout and add new `Card` components to introduce additional sections or insights.
-   **Integrating Real Data:** Replace mock data imports with actual API calls to a backend system for live data.

### Bid Tabulation (components/estimating/bid-tabulation.tsx)

The `BidTabulation` component provides a dedicated interface for comparing and analyzing bids from various subcontractors. It integrates with the `EstimatingContext` to manage bid data and allows for detailed review and selection.

**Key Features:**

-   **Tabbed Interface:** Organizes bid-related functionalities into distinct tabs (e.g., Bid Tabulation, Bid Leveling).
-   **Enhanced Bid Tabulation Table:** Displays a comprehensive table of bids, allowing for comparison of line items and overall costs.
-   **Bid Leveling Tool:** Provides a dedicated section for leveling bids, ensuring fair comparison and identifying discrepancies.
-   **Context Integration:** Utilizes `EstimatingContext` to access and update bid-related data, ensuring data consistency across the estimating workflow.
-   **Guided Tour Step:** Includes a specific tour step to guide users through the Bid Tabulation tab.

**Technical Implementation:**

-   Uses `Tabs` and `TabsContent` from shadcn/ui for the tabbed navigation.
-   Imports and utilizes `EnhancedBidTab` and `BidLeveling` components for core functionality.
-   `useEstimating` hook is used to interact with the global estimating state.
-   `useGuidedTour` hook registers a tour step for this component.
-   Comprehensive JSDoc documentation for component props, state, and functions.

**Usage Example:**

The `BidTabulation` component is rendered as a tab within the `EstimatingWorkflow` on the `/pre-con/estimating` page.

**Styling:**

-   Tailwind CSS for layout and styling.
-   Shadcn/ui components for consistent UI elements.

**Maintenance Tips:**

-   **Adding New Bid Features:** Extend the tabbed interface with new tabs and components for additional bid management functionalities (e.g., bid analysis, vendor communication).
-   **Enhancing Bid Data:** Update the `EstimatingContext` and mock data (`enhanced-estimating-data.json`) to include more complex bid structures or metadata.
-   **Improving Bid Leveling:** Refine the `BidLeveling` component to support more advanced leveling criteria or automated suggestions.

### Cost Summary (components/estimating/cost-summary.tsx)

The `CostSummary` component provides a comprehensive overview of the project's estimated costs, including selected bids, various cost breakdowns, and actions for approval and export. It integrates seamlessly with the `EstimatingContext` to reflect real-time changes in the estimate.

**Key Features:**

-   **Cost Compilation:** Aggregates costs from selected bids and applies overhead, profit, and contingency percentages.
-   **Detailed Breakdown:** Presents a clear breakdown of subtotal, overhead, profit, contingency, and total project cost.
-   **Approval Workflow:** Includes "Approve Estimate" and "Reject Estimate" buttons to simulate an approval process.
-   **Export Functionality:** Provides an option to export the cost summary as a PDF.
-   **Context Integration:** Leverages `EstimatingContext` to access and update the project estimate data.
-   **Guided Tour Step:** Integrates with the guided tour to highlight this crucial step in the estimating workflow.

**Technical Implementation:**

-   Uses `Card`, `Button`, `Badge`, `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` from shadcn/ui for structured display.
-   `useEstimating` hook is used to retrieve and update the `projectEstimate` from the global context.
-   Calculations for overhead, profit, contingency, and total are performed dynamically based on the subtotal.
-   `useGuidedTour` hook registers a tour step for the Cost Summary tab.
-   Comprehensive JSDoc documentation for component, calculations, and tour steps.

**Usage Example:**

The `CostSummary` component is rendered as a tab within the `EstimatingWorkflow` on the `/pre-con/estimating` page, serving as the final review and approval stage.

**Styling:**

-   Tailwind CSS for layout, spacing, and typography.
-   Shadcn/ui components ensure a consistent and professional appearance.

**Maintenance Tips:**

-   **Adjusting Percentages:** Easily modify the `OVERHEAD_PERCENTAGE`, `PROFIT_PERCENTAGE`, and `CONTINGENCY_PERCENTAGE` constants to reflect different business rules.
-   **Enhancing Approval Workflow:** Integrate with a backend API for actual approval status updates and user permissions.
-   **Advanced Export:** Implement a more robust PDF generation library for richer report customization.
-   **Adding New Cost Categories:** Extend the `CostBreakdown` section to include additional cost categories as needed.

### Placeholder Pages (components/tools/coming-soon-page.tsx)

To provide a consistent user experience for features under development, a single `ComingSoonPage` component has been created. All links in the `AppHeader` that lead to unreleased features now redirect to this generic placeholder.

**Key Features:**

-   **Centralized Placeholder:** A single component serves as a "Coming Soon" page for multiple features.
-   **Consistent Design:** Displays a standardized message with a generic icon, title, and description.
-   **Reusability:** Designed to be a universal landing page for any feature that is not yet implemented.

**Technical Implementation:**

-   Uses `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardDescription` from shadcn/ui.
-   Employs a `Clock` icon from `lucide-react` to visually indicate a future release.
-   Styled with Tailwind CSS for centering and a clean background.

**Usage Example:**

Instead of creating individual placeholder components for each unreleased tool, the `AppHeader`'s `tools` array now points the `href` of these items to `/tools/coming-soon`. This simplifies maintenance and ensures a uniform message for all placeholder links.

**Maintenance Tips:**

-   **Adding New Unreleased Tools:** When adding a new tool that is not yet implemented, simply set its `href` in the `AppHeader`'s `tools` array to `/tools/coming-soon`. No new placeholder component is needed.
-   **Implementing a Feature:** Once a feature is ready for development, create its dedicated page/component and update its `href` in the `AppHeader` to the new, specific path.
-   **Customizing Message:** The `ComingSoonPage` can be easily modified to update the generic message or styling for all placeholder links.

### Messaging and Task Management Floating Button (components/messaging/floating-button.tsx)

The `FloatingButton` component provides omnipresent access to a messaging and task management demo. It is designed to be a persistent UI element that opens a modal with collaborative features.

**Key Features:**

-   **Omnipresent Access:** Fixed position at the bottom-right of the screen, visible across all application pages.
-   **Modal Interface:** Clicking the button opens a `Dialog` (modal) containing the messaging and task management interface.
-   **Tabbed Content:** The modal uses `Tabs` to switch between 'Messages' and 'Tasks' views.
-   **Responsive Design:**
    -   The floating button is hidden on screens smaller than `sm` (640px).
    -   On mobile, the modal expands to full screen for better usability.
    -   On desktop, the modal maintains a standard `max-w-lg` size.
-   **Clear Placeholders:** Initial tab content provides clear instructions to the user.

**Technical Implementation:**

-   Uses `useState` to manage the open/close state of the modal.
-   Leverages `useMediaQuery` hook (from `hooks/use-media-query.ts`) to apply responsive styling to the modal content.
-   Utilizes `shadcn/ui` components: `Button`, `Dialog`, `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.
-   Icons from `lucide-react`: `MessageSquare` for messaging and `List` for tasks.
-   Tailwind CSS for positioning, sizing, and styling, including custom blue background and shadow.

**Usage Example:**

The `FloatingButton` is integrated directly into the `app/client-layout.tsx` to ensure it is rendered on every page of the application.

\`\`\`tsx
// app/client-layout.tsx
import FloatingButton from '@/components/messaging/floating-button'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* ... existing layout content ... */}
      {children}
      <FloatingButton /> {/* Render the floating button here */}
    </>
  )
}
\`\`\`

**Styling:**

-   `fixed bottom-4 right-4 z-50`: Positions the button.
-   `hidden sm:flex`: Hides the button on screens smaller than 640px.
-   `h-14 w-14 rounded-full`: Sets the button size and shape.
-   `bg-blue-600 hover:bg-blue-700 shadow-lg`: Applies the brand color and shadow.
-   Modal responsiveness is handled by dynamically applying Tailwind classes based on `isDesktop` state.

**Maintenance Tips:**

-   **Adding Real Functionality:** Replace the placeholder content within `TabsContent` with actual messaging and task management components (e.g., chat interfaces, task lists, forms).
-   **Integrating with Backend:** Connect the messaging and task components to a backend API for real-time data, user authentication, and persistence.
-   **Customizing Icons/Colors:** Easily change the `MessageSquare` and `List` icons or the `bg-blue-600` color to match evolving design requirements.
-   **Contextual Messaging:** Implement logic to dynamically load messages/tasks relevant to the currently viewed page or selected project.
-   **Notifications:** Add a badge to the floating button to display unread message or pending task counts.

## Getting Started

1.  **Clone the repository:**
    \`\`\`bash
    git clone <repository-url>
    cd HB-Report-MVP-v2-main
    \`\`\`
2.  **Install dependencies:**
    \`\`\`bash
    npm install
    \`\`\`
3.  **Run the development server:**
    \`\`\`bash
    npm run dev
    \`\`\`
4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

Contributions are welcome! Please follow the existing code style and submit pull requests for new features or bug fixes.

## License

This project is licensed under the MIT License.
