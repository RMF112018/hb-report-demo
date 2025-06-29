"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DollarSign,
  HeartPulse,
  CheckCircle,
  CalendarCheck,
  MessageSquareWarning,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Import data from the new JSON file
import pxDashboardData from "@/data/px-dashboard-data.json"
import generalDashboardData from "@/data/general-dashboard-data.json" // For mockProjects

/**
 * @fileoverview PX Dashboard Content Component
 *
 * This component provides a Project Executive (PX) level dashboard with key metrics
 * and insights relevant to portfolio oversight and high-level project health.
 *
 * Features:
 * - Overview of portfolio value and project health
 * - Tracking of key milestones and open items (RFIs)
 * - AI-powered insights for strategic decision-making
 * - Interactive cards with project-specific drill-down on hover
 * - Responsive design
 */

/**
 * PXCardProps Interface
 * Defines the props for the PXCard component.
 */
interface PXCardProps {
  card: {
    id: string
    title: string
    data: string | number
    trend?: "up" | "down" | "stable"
    priority?: "high" | "medium" | "low"
    icon: React.ElementType
    projects?: { id: string; name: string; value: string | number; status?: string }[]
  }
  selectedProject: string | null
  onProjectClick: (projectId: string) => void
  className?: string
}

/**
 * PXCard Component
 * Displays a single metric card for the PX Dashboard.
 * Features: project-specific data on hover, trend indicators.
 */
const PXCard = React.memo<PXCardProps>(({ card, selectedProject, onProjectClick, className }) => {
  const [isHovered, setIsHovered] = useState(false)

  const displayData = selectedProject ? card.projects?.find((p) => p.id === selectedProject)?.value || "N/A" : card.data

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getTrendIcon = (trend?: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend === "down") return <AlertTriangle className="h-4 w-4 text-red-500" />
    return null
  }

  return (
    <TooltipProvider>
      <Card
        className={cn("transition-all duration-200 hover:shadow-lg cursor-pointer relative group", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="article"
        aria-label={`${card.title} metric card`}
        tabIndex={0}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              {card.icon && <card.icon className="h-4 w-4" />}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate">{card.title}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{card.title}</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            {getTrendIcon(card.trend)}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-gray-900">{displayData}</p>
            {card.priority && (
              <Badge
                variant={
                  card.priority === "high" ? "destructive" : card.priority === "medium" ? "default" : "secondary"
                }
                className="text-xs"
              >
                {card.priority} priority
              </Badge>
            )}
          </div>

          {/* Project Summary Overlay */}
          {isHovered && card.projects && (
            <div className="absolute inset-0 bg-white bg-opacity-98 p-4 rounded-lg z-10 border shadow-lg">
              <h4 className="font-semibold mb-3 text-gray-900">Project Breakdown</h4>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {card.projects.map((project: any) => (
                    <div
                      key={project.id}
                      className={cn(
                        "flex justify-between items-center p-2 rounded border",
                        getStatusColor(project.status || "default"),
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="text-left font-medium hover:underline truncate block w-full"
                              onClick={() => onProjectClick(project.id)}
                            >
                              {project.name}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to filter by {project.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="font-mono text-sm ml-2">{project.value}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
})

PXCard.displayName = "PXCard"

/**
 * PXHBIInsights Component
 * Displays AI-driven insights relevant to Project Executives.
 */
const PXHBIInsights = React.memo(() => {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "forecast":
        return <TrendingUp className="h-4 w-4" />
      case "risk":
        return <AlertTriangle className="h-4 w-4" />
      case "opportunity":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "low":
        return "border-green-200 bg-green-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <Card className="bg-blue-50 border-blue-200 col-span-full lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-blue-700 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          HBI Insights
          <Badge variant="outline" className="ml-auto bg-blue-100 text-blue-700">
            AI-Powered
          </Badge>
        </CardTitle>
        <CardDescription className="text-blue-600">
          Advanced analytics and forecasting for your projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pxDashboardData.pxInsights.map((insight) => (
            <div
              key={insight.id}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                getInsightColor(insight.severity),
                selectedInsight === insight.id && "ring-2 ring-blue-300",
              )}
              onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{getInsightIcon(insight.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <Badge variant={insight.severity === "high" ? "destructive" : "secondary"} className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{insight.text}</p>
                  {selectedInsight === insight.id && (
                    <div className="mt-3 p-2 bg-white rounded border">
                      <p className="text-xs font-medium text-gray-600 mb-1">Recommended Action:</p>
                      <p className="text-sm text-gray-800">{insight.action}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})

PXHBIInsights.displayName = "PXHBIInsights"

/**
 * PXDashboardContent Component
 * Main component for the Project Executive Dashboard.
 * Displays a grid of interactive cards with portfolio-level metrics.
 */
interface PXDashboardContentProps {
  selectedProject: string | null
  onProjectClick: (projectId: string) => void
  editMode: boolean
  searchQuery: string
}

export default function PXDashboardContent({
  selectedProject,
  onProjectClick,
  editMode,
  searchQuery,
}: PXDashboardContentProps) {
  // Map string icon names to Lucide React components
  const pxCardsWithIcons = useMemo(() => {
    const iconMap: { [key: string]: React.ElementType } = {
      DollarSign: DollarSign,
      HeartPulse: HeartPulse,
      CheckCircle: CheckCircle,
      CalendarCheck: CalendarCheck,
      MessageSquareWarning: MessageSquareWarning,
      ShieldAlert: ShieldAlert,
    }
    return pxDashboardData.pxMetrics.map((card) => ({
      ...card,
      icon: iconMap[card.icon as string] || DollarSign, // Default to DollarSign if not found
    }))
  }, [])

  // Filter projects based on search query (using generalDashboardData.dashboardProjectsSummary)
  const filteredProjects = useMemo(() => {
    return generalDashboardData.dashboardProjectsSummary.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Executive Overview</h2>
        <p className="text-gray-600">High-level portfolio performance and strategic insights.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {/* PX Metrics Cards */}
        {pxCardsWithIcons.map((card) => (
          <PXCard key={card.id} card={card} selectedProject={selectedProject} onProjectClick={onProjectClick} />
        ))}

        {/* PX HBI Insights Card */}
        <PXHBIInsights />

        {/* Placeholder for Project List or other PX-specific content */}
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Portfolio Projects</CardTitle>
            <CardDescription>Overview of all active projects in your portfolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <ul className="space-y-2">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <li key={project.id} className="flex items-center justify-between p-2 border rounded-md">
                      <span className="font-medium">{project.name}</span>
                      <Badge variant="secondary">{project.status}</Badge>
                    </li>
                  ))
                ) : (
                  <p className="text-muted-foreground">No projects found matching your search.</p>
                )}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
