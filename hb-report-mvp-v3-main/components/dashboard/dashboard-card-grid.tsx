"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * MetricData interface for dashboard card metrics
 *
 * @interface MetricData
 * @property {string} title - Display title of the metric
 * @property {string} value - Formatted value to display
 * @property {string} change - Change indicator (e.g., "+8.2%")
 * @property {"up" | "down"} trend - Trend direction for icon display
 * @property {string} color - Tailwind text color class
 * @property {string} bgColor - Tailwind background color class
 * @property {string} borderColor - Tailwind border color class
 * @property {"primary" | "secondary" | "compact"} priority - Card sizing priority
 * @property {React.ReactNode} [content] - Optional custom content for complex cards
 */
export interface MetricData {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  color: string
  bgColor: string
  borderColor: string
  priority: "primary" | "secondary" | "compact"
  content?: React.ReactNode
}

/**
 * DashboardCardGridProps interface
 *
 * @interface DashboardCardGridProps
 * @property {MetricData[]} metrics - Array of metric data to display
 * @property {boolean} [editMode=false] - Whether edit mode is active
 * @property {(fromIndex: number, toIndex: number) => void} [onCardDrag] - Callback for card reordering
 * @property {string} [className] - Additional CSS classes
 */
interface DashboardCardGridProps {
  metrics: MetricData[]
  editMode?: boolean
  onCardDrag?: (fromIndex: number, toIndex: number) => void
  className?: string
}

/**
 * Individual dashboard card component with enhanced accessibility and UX
 *
 * @param {Object} props - Component props
 * @param {MetricData} props.metric - Metric data to display
 * @param {boolean} props.editMode - Whether edit mode is active
 * @param {number} props.index - Card index for drag operations
 * @param {string} props.className - Additional CSS classes
 */
const DashboardCard = React.memo<{
  metric: MetricData
  editMode: boolean
  index: number
  className?: string
}>(({ metric, editMode, index, className }) => {
  const [isHovered, setIsHovered] = React.useState(false)

  /**
   * Get CSS classes for card sizing based on priority
   * Uses CSS custom properties for responsive behavior
   */
  const getCardSizeClasses = (priority: MetricData["priority"]) => {
    switch (priority) {
      case "primary":
        return "dashboard-card-primary"
      case "secondary":
        return "dashboard-card-secondary"
      case "compact":
        return "dashboard-card-compact"
      default:
        return "dashboard-card-secondary"
    }
  }

  const cardId = `dashboard-card-${index}`
  const ariaLabel = `${metric.title} card showing ${metric.value} with ${metric.change} change`

  return (
    <TooltipProvider>
      <Card
        id={cardId}
        className={cn(
          "dashboard-card",
          getCardSizeClasses(metric.priority),
          metric.bgColor,
          metric.borderColor,
          "border hover:shadow-md transition-all duration-200 ease-in-out",
          "focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2",
          editMode && "cursor-move",
          className,
        )}
        tabIndex={0}
        role="article"
        aria-label={ariaLabel}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={(e) => {
          // Keyboard navigation support
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            // Handle card selection/interaction
          }
        }}
      >
        <CardHeader className="pb-2 relative">
          {editMode && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
          )}
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate">{metric.title}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{metric.title}</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-2 flex-1 flex flex-col justify-center">
          {metric.content ? (
            // Custom content for complex cards
            <div className="dashboard-card-content h-full">{metric.content}</div>
          ) : (
            // Standard metric display
            <div className="text-center space-y-1 sm:space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p
                    className={cn(
                      metric.color,
                      "text-sm sm:text-base lg:text-lg xl:text-xl font-bold truncate leading-tight",
                    )}
                  >
                    {metric.value}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{metric.value}</p>
                </TooltipContent>
              </Tooltip>
              <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                <Badge variant={metric.trend === "up" ? "default" : "secondary"} className="text-xs px-1 py-0">
                  {metric.change}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
})

DashboardCard.displayName = "DashboardCard"

/**
 * DashboardCardGrid Component
 *
 * A responsive grid layout for dashboard metric cards using CSS Grid with auto-fill.
 * Implements industry-standard spacing, accessibility features, and smooth animations.
 *
 * Layout Strategy:
 * - Uses CSS Grid with auto-fill for responsive behavior
 * - Variable card sizing based on content priority
 * - Smooth transitions and hover effects
 * - Accessibility-compliant focus states
 *
 * Responsive Breakpoints:
 * - Mobile (320px+): 1-2 columns, 0.5rem gap
 * - Small (640px+): 2-3 columns, 0.75rem gap
 * - Medium (768px+): 3-4 columns, 1rem gap
 * - Large (1024px+): 4-6 columns, 1.25rem gap
 * - XL (1280px+): 6+ columns, 1.5rem gap
 *
 * Card Sizing:
 * - Primary: 2 columns on md+, 1 column on sm-
 * - Secondary: 1 column across all breakpoints
 * - Compact: 1 column with reduced height
 *
 * Maintenance Guidelines:
 * - Adjust minmax values in CSS for different card sizes
 * - Modify gap values in CSS for spacing changes
 * - Update priority logic in getCardSizeClasses for new card types
 * - Add new metric types by extending MetricData interface
 *
 * @param {DashboardCardGridProps} props - Component props
 * @returns {JSX.Element} Rendered dashboard card grid
 */
export const DashboardCardGrid = React.memo<DashboardCardGridProps>(
  ({ metrics, editMode = false, onCardDrag, className }) => {
    const gridRef = React.useRef<HTMLDivElement>(null)

    /**
     * Handle drag start for card reordering
     */
    const handleDragStart = React.useCallback(
      (e: React.DragEvent, index: number) => {
        if (!editMode) return
        e.dataTransfer.setData("text/plain", index.toString())
        e.dataTransfer.effectAllowed = "move"
      },
      [editMode],
    )

    /**
     * Handle drag over for drop zone
     */
    const handleDragOver = React.useCallback(
      (e: React.DragEvent) => {
        if (!editMode) return
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
      },
      [editMode],
    )

    /**
     * Handle drop for card reordering
     */
    const handleDrop = React.useCallback(
      (e: React.DragEvent, dropIndex: number) => {
        if (!editMode || !onCardDrag) return
        e.preventDefault()

        const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))
        if (dragIndex !== dropIndex) {
          onCardDrag(dragIndex, dropIndex)
        }
      },
      [editMode, onCardDrag],
    )

    return (
      <div
        ref={gridRef}
        className={cn("dashboard-card-grid", className)}
        role="grid"
        aria-label="Dashboard metrics grid"
      >
        {metrics.map((metric, index) => (
          <div
            key={`${metric.title}-${index}`}
            draggable={editMode}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="dashboard-card-wrapper"
            role="gridcell"
          >
            <DashboardCard metric={metric} editMode={editMode} index={index} />
          </div>
        ))}
      </div>
    )
  },
)

DashboardCardGrid.displayName = "DashboardCardGrid"

export default DashboardCardGrid
