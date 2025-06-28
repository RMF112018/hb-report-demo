"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  Calendar,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  Shield,
  Sparkles,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"

// Import data from the new JSON file
import pmDashboardData from "@/data/pm-dashboard-data.json"

/**
 * PMCardProps Interface
 * Defines the props for the PMCard component.
 */
interface PMCardProps {
  card: {
    id: string
    title: string
    data: string | number
    trend?: "up" | "down" | "stable"
    priority?: "high" | "medium" | "low"
    icon: React.ElementType
    projects?: { id: string; name: string; value: string | number; status?: string }[]
    chartData?: any[]
    chartType?: "line" | "bar" | "gauge" | "pie" | "area"
    chartConfig?: Record<string, { label: string; color: string }>
  }
  selectedProject: string | null
  onProjectClick: (projectId: string) => void
  className?: string
}

/**
 * PMCard Component
 * Displays a single metric card for the PM Dashboard.
 * Features: project-specific data on hover, trend indicators, optional charts.
 */
const PMCard = React.memo<PMCardProps>(({ card, selectedProject, onProjectClick, className }) => {
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
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />
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

          {/* Enhanced Chart Area */}
          {card.chartData && card.chartType && (
            <div className="mt-4 h-[120px] w-full">
              <ChartContainer config={card.chartConfig || {}} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {card.chartType === "line" && (
                    <LineChart data={card.chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis dataKey="month" hide />
                      <YAxis hide />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      {Object.keys(card.chartConfig || {}).map((key, index) => (
                        <Line
                          key={key}
                          dataKey={key}
                          stroke={card.chartConfig?.[key]?.color}
                          type="monotone"
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  )}
                  {card.chartType === "area" && (
                    <AreaChart data={card.chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis dataKey="week" hide />
                      <YAxis hide />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Area
                        dataKey="planned"
                        stackId="1"
                        stroke={card.chartConfig?.planned?.color}
                        fill={card.chartConfig?.planned?.color}
                        fillOpacity={0.3}
                      />
                      <Area
                        dataKey="actual"
                        stackId="1"
                        stroke={card.chartConfig?.actual?.color}
                        fill={card.chartConfig?.actual?.color}
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  )}
                  {card.chartType === "bar" && (
                    <BarChart data={card.chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis
                        dataKey={card.id === "pm_safety" ? "type" : card.id === "pm_staffing" ? "role" : "name"}
                        hide
                      />
                      <YAxis hide />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      {card.id === "pm_staffing" ? (
                        <>
                          <Bar dataKey="allocated" fill={card.chartConfig?.allocated?.color} />
                          <Bar dataKey="available" fill={card.chartConfig?.available?.color} />
                        </>
                      ) : (
                        <Bar dataKey="count" fill={card.chartConfig?.count?.color} />
                      )}
                    </BarChart>
                  )}
                  {card.chartType === "pie" && (
                    <PieChart>
                      <Pie
                        data={card.chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={40}
                        paddingAngle={2}
                        dataKey={card.id === "pm_rfis" ? "value" : "count"}
                      >
                        {card.chartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  )}
                  {card.chartType === "gauge" && (
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="90%"
                      barSize={15}
                      data={card.chartData}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar minAngle={15} background clockWise dataKey="value" />
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-lg font-bold"
                        fill="hsl(var(--foreground))"
                      >
                        {card.chartData?.[0]?.value}%
                      </text>
                    </RadialBarChart>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}

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

PMCard.displayName = "PMCard"

/**
 * HBI Insights Component for PM Dashboard
 * Displays AI-driven insights relevant to project managers.
 */
const PMHBIInsights = React.memo(() => {
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
          {pmDashboardData.pmInsights.map((insight) => (
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

PMHBIInsights.displayName = "PMHBIInsights"

/**
 * PMDashboard Component
 * Main component for the Project Manager Dashboard.
 * Displays a grid of interactive cards with project-specific metrics.
 */
export default function PMDashboard() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const handleProjectClick = useCallback(
    (projectId: string) => {
      setSelectedProject(selectedProject === projectId ? null : projectId)
    },
    [selectedProject],
  )

  const pmCards = useMemo(
    () => [
      {
        id: "pm_health",
        title: "Project Health Score",
        data: selectedProject
          ? pmDashboardData.projects.find((p) => p.id === selectedProject)?.healthScore
          : (
              pmDashboardData.projects.reduce((sum, p) => sum + p.healthScore, 0) / pmDashboardData.projects.length
            ).toFixed(0),
        icon: BarChart3,
        chartType: "gauge",
        chartData: [
          {
            name: "Health",
            value: selectedProject
              ? pmDashboardData.projects.find((p) => p.id === selectedProject)?.healthScore || 0
              : Math.round(
                  pmDashboardData.projects.reduce((sum, p) => sum + p.healthScore, 0) / pmDashboardData.projects.length,
                ),
            fill: "hsl(var(--chart-1))",
          },
        ],
        chartConfig: {
          value: {
            label: "Health Score",
            color: "hsl(var(--chart-1))",
          },
        },
        projects: pmDashboardData.projects.map((p) => ({
          id: p.id,
          name: p.name,
          value: `${p.healthScore}%`,
          status: p.healthScore >= 85 ? "good" : p.healthScore >= 70 ? "warning" : "critical",
        })),
      },
      {
        id: "pm_schedule",
        title: "Schedule Progress",
        data: selectedProject
          ? `${pmDashboardData.projects.find((p) => p.id === selectedProject)?.scheduleProgress}%`
          : `${(pmDashboardData.projects.reduce((sum, p) => sum + p.scheduleProgress, 0) / pmDashboardData.projects.length).toFixed(0)}%`,
        trend: "up",
        priority: "medium",
        icon: Calendar,
        chartData: pmDashboardData.scheduleTrendData,
        chartType: "area",
        chartConfig: {
          planned: {
            label: "Planned",
            color: "hsl(var(--chart-2))",
          },
          actual: {
            label: "Actual",
            color: "hsl(var(--chart-3))",
          },
        },
        projects: pmDashboardData.projects.map((p) => ({
          id: p.id,
          name: p.name,
          value: `${p.scheduleProgress}%`,
          status: p.scheduleProgress >= 70 ? "good" : "warning",
        })),
      },
      {
        id: "pm_financial",
        title: "Budget Tracking",
        data: selectedProject
          ? `${pmDashboardData.projects.find((p) => p.id === selectedProject)?.budgetSpent}%`
          : `${(pmDashboardData.projects.reduce((sum, p) => sum + p.budgetSpent, 0) / pmDashboardData.projects.length).toFixed(0)}%`,
        trend: "down",
        priority: "high",
        icon: DollarSign,
        chartData: pmDashboardData.budgetTrackingData,
        chartType: "line",
        chartConfig: {
          budget: {
            label: "Budget",
            color: "hsl(var(--chart-1))",
          },
          spent: {
            label: "Spent",
            color: "hsl(var(--chart-2))",
          },
          forecast: {
            label: "Forecast",
            color: "hsl(var(--chart-3))",
          },
        },
        projects: pmDashboardData.projects.map((p) => ({
          id: p.id,
          name: p.name,
          value: `${p.budgetSpent}%`,
          status: p.budgetSpent <= 80 ? "good" : "critical",
        })),
      },
      {
        id: "pm_submittals",
        title: "Submittal Status",
        data: selectedProject
          ? pmDashboardData.projects.find((p) => p.id === selectedProject)?.submittalPending
          : pmDashboardData.projects.reduce((sum, p) => sum + p.submittalPending, 0),
        trend: "up",
        priority: "medium",
        icon: FileText,
        chartData: pmDashboardData.submittalStatusData,
        chartType: "pie",
        chartConfig: {
          count: {
            label: "Count",
            color: "hsl(var(--chart-1))",
          },
        },
        projects: pmDashboardData.projects.map((p) => ({
          id: p.id,
          name: p.name,
          value: p.submittalPending,
          status: p.submittalPending < 15 ? "good" : "warning",
        })),
      },
      {
        id: "pm_rfis",
        title: "RFI Distribution",
        data: selectedProject
          ? pmDashboardData.projects.find((p) => p.id === selectedProject)?.rfiOpen
          : pmDashboardData.projects.reduce((sum, p) => sum + p.rfiOpen, 0),
        trend: "up",
        priority: "high",
        icon: AlertTriangle,
        chartData: pmDashboardData.rfiStatusData,
        chartType: "pie",
        chartConfig: {
          value: {
            label: "RFIs",
            color: "hsl(var(--chart-1))",
          },
        },
        projects: pmDashboardData.projects.map((p) => ({
          id: p.id,
          name: p.name,
          value: p.rfiOpen,
          status: p.rfiOpen < 10 ? "good" : "critical",
        })),
      },
      {
        id: "pm_quality",
        title: "Quality Trends",
        data: selectedProject
          ? `${pmDashboardData.projects.find((p) => p.id === selectedProject)?.qualityPassRate}%`
          : `${(pmDashboardData.projects.reduce((sum, p) => sum + p.qualityPassRate, 0) / pmDashboardData.projects.length).toFixed(0)}%`,
        trend: "up",
        priority: "low",
        icon: CheckCircle,
        chartData: pmDashboardData.qualityTrendData,
        chartType: "line",
        chartConfig: {
          passRate: {
            label: "Pass Rate %",
            color: "hsl(var(--chart-1))",
          },
          inspections: {
            label: "Inspections",
            color: "hsl(var(--chart-2))",
          },
        },
        projects: pmDashboardData.projects.map((p) => ({
          id: p.id,
          name: p.name,
          value: `${p.qualityPassRate}%`,
          status: p.qualityPassRate >= 90 ? "good" : "warning",
        })),
      },
      {
        id: "pm_safety",
        title: "Safety Incidents",
        data: selectedProject
          ? pmDashboardData.projects.find((p) => p.id === selectedProject)?.safetyIncidents
          : pmDashboardData.projects.reduce((sum, p) => sum + p.safetyIncidents, 0),
        trend: "down",
        priority: "high",
        icon: Shield,
        chartData: pmDashboardData.safetyIncidentData,
        chartType: "bar",
        chartConfig: {
          count: {
            label: "Incidents",
            color: "hsl(var(--chart-1))",
          },
        },
        projects: pmDashboardData.projects.map((p) => ({
          id: p.id,
          name: p.name,
          value: p.safetyIncidents,
          status: p.safetyIncidents === 0 ? "good" : "critical",
        })),
      },
      {
        id: "pm_staffing",
        title: "Team Utilization",
        data: selectedProject
          ? pmDashboardData.projects.find((p) => p.id === selectedProject)?.teamSize
          : pmDashboardData.projects.reduce((sum, p) => sum + p.teamSize, 0),
        trend: "stable",
        priority: "medium",
        icon: Users,
        chartData: pmDashboardData.teamUtilizationData,
        chartType: "bar",
        chartConfig: {
          allocated: {
            label: "Allocated",
            color: "hsl(var(--chart-1))",
          },
          available: {
            label: "Available",
            color: "hsl(var(--chart-2))",
          },
        },
        projects: pmDashboardData.projects.map((p) => ({ id: p.id, name: p.name, value: p.teamSize, status: "good" })),
      },
    ],
    [selectedProject],
  )

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {pmCards.map((card) => (
          <PMCard key={card.id} card={card} selectedProject={selectedProject} onProjectClick={handleProjectClick} />
        ))}
        <PMHBIInsights />
      </div>
    </div>
  )
}
