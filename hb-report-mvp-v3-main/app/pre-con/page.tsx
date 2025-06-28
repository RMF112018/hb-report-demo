import { PreConDashboard } from "@/components/precon/precon-dashboard"
import { ContextualSidebar } from "@/components/layout/contextual-sidebar"
import { PreConSidebar } from "@/components/sidebars/precon-sidebar"

/**
 * Pre-Construction Main Page
 *
 * This page serves as the entry point for all pre-construction activities.
 * It displays the comprehensive PreConDashboard component which provides
 * an overview of RFPs, estimates, deadlines, and performance metrics.
 *
 * The page maintains the existing layout structure with the contextual
 * sidebar for navigation while showcasing the new dashboard functionality.
 *
 * @returns {JSX.Element} The complete pre-construction page with dashboard
 */
export default function PreConPage() {
  return (
    <div className="relative">
      {/* Main Dashboard Content */}
      <div className="pr-12">
        <PreConDashboard />
      </div>

      {/* Contextual Sidebar for Navigation */}
      <ContextualSidebar>
        <PreConSidebar />
      </ContextualSidebar>
    </div>
  )
}
