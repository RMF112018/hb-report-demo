"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Project } from "@/types"
import { formatCurrency } from "@/lib/utils"
import {
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
  FileText,
  Camera,
  ClipboardList,
  BarChart3,
  Shield,
  Truck,
  HardHat,
} from "lucide-react"

interface DashboardMetricsProps {
  projects: Project[]
  userRole?: string
  selectedProject?: number | null
  onProjectClick: (projectId: number) => void
  onFeatureClick: (feature: string, projectId?: number) => void
}

export function DashboardMetrics({
  projects,
  userRole,
  selectedProject,
  onProjectClick,
  onFeatureClick,
}: DashboardMetricsProps) {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null)

  const getProjectStats = () => {
    const totalValue = projects.reduce((sum, project) => sum + project.contractValue, 0)
    const activeProjects = projects.filter((p) => p.status === "Active").length
    const avgValue = projects.length > 0 ? totalValue / projects.length : 0
    const atRiskProjects = projects.filter((p) => p.riskLevel === "high").length

    return {
      totalProjects: projects.length,
      activeProjects,
      totalValue,
      avgValue,
      atRiskProjects,
    }
  }

  const stats = getProjectStats()

  // Feature metrics with project-specific data
  const getFeatureMetrics = () => {
    return [
      {
        id: "financial",
        title: "Financial Forecasting",
        icon: DollarSign,
        value: formatCurrency(stats.totalValue),
        description: "Total Contract Value",
        projects: projects.map((p) => ({ id: p.id, name: p.name, value: formatCurrency(p.contractValue) })),
        route: "financial-forecasting",
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        id: "schedule",
        title: "Schedule Monitor",
        icon: Calendar,
        value: `${Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)}%`,
        description: "Average Progress",
        projects: projects.map((p) => ({ id: p.id, name: p.name, value: `${p.progress || 0}% Complete` })),
        route: "schedule-monitor",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        id: "issues",
        title: "Constraints Log",
        icon: AlertTriangle,
        value: stats.atRiskProjects.toString(),
        description: "High Risk Projects",
        projects: projects
          .filter((p) => p.riskLevel === "high")
          .map((p) => ({ id: p.id, name: p.name, value: "High Risk" })),
        route: "constraints-log",
        color: "text-red-600",
        bgColor: "bg-red-50",
      },
      {
        id: "manpower",
        title: "Manpower Tracking",
        icon: Users,
        value: (projects.length * 25).toString(),
        description: "Total Workers",
        projects: projects.map((p) => ({ id: p.id, name: p.name, value: "25 Workers" })),
        route: "manpower-tracking",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        id: "buyout",
        title: "Buyout Schedule",
        icon: Truck,
        value: "15",
        description: "Active Commitments",
        projects: projects.map((p) => ({ id: p.id, name: p.name, value: "3 Commitments" })),
        route: "buyout-schedule",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
      {
        id: "permits",
        title: "Permit Log",
        icon: FileText,
        value: "12",
        description: "Active Permits",
        projects: projects.map((p) => ({ id: p.id, name: p.name, value: "2-3 Permits" })),
        route: "permit-log",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
      },
      {
        id: "photos",
        title: "Progress Photos",
        icon: Camera,
        value: "48",
        description: "Recent Photos",
        projects: projects.map((p) => ({ id: p.id, name: p.name, value: "8-12 Photos" })),
        route: "progress-photographs",
        color: "text-pink-600",
        bgColor: "bg-pink-50",
      },
      {
        id: "reports",
        title: "Report Generation",
        icon: BarChart3,
        value: "5",
        description: "Published Reports",
        projects: projects.map((p) => ({ id: p.id, name: p.name, value: "1 Report" })),
        route: "report-generation",
        color: "text-cyan-600",
        bgColor: "bg-cyan-50",
      },
      {
        id: "scorecard",
        title: "Subcontractor Scorecard",
        icon: ClipboardList,
        value: "A-",
        description: "Average Grade",
        projects: projects.map((p) => ({ id: p.id, name: p.name, value: "A- Grade" })),
        route: "subcontractor-scorecard",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
      },
      {
        id: "staffing",
        title: "Staffing Schedule",
        icon: HardHat,
        value: "85%",
        description: "Staffing Level",
        projects: projects.map((p) => ({ id: p.id, name: p.name, value: "85% Staffed" })),
        route: "staffing-schedule",
        color: "text-teal-600",
        bgColor: "bg-teal-50",
      },
      {
        id: "responsibility",
        title: "Responsibility Matrix",
        icon: CheckCircle,
        value: "78%",
        description: "Tasks Complete",
        projects: projects.map((p) => ({ id: p.id, name: p.name, value: "78% Complete" })),
        route: "responsibility-matrix",
        color: "text-lime-600",
        bgColor: "bg-lime-50",
      },
      {
        id: "safety",
        title: "Safety Metrics",
        icon: Shield,
        value: "0",
        description: "Incidents This Month",
        projects: projects.map((p) => ({ id: p.id, name: p.name, value: "0 Incidents" })),
        route: "safety-metrics",
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
    ]
  }

  const featureMetrics = getFeatureMetrics()

  return (
    <TooltipProvider>
      <div className="space-y-4 md:space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs md:text-sm">Total Projects</CardDescription>
              <CardTitle className="text-xl md:text-2xl">{stats.totalProjects}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs md:text-sm">Active Projects</CardDescription>
              <CardTitle className="text-xl md:text-2xl text-green-600">{stats.activeProjects}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs md:text-sm">Total Value</CardDescription>
              <CardTitle className="text-xl md:text-2xl">${(stats.totalValue / 1000000).toFixed(1)}M</CardTitle>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs md:text-sm">At Risk</CardDescription>
              <CardTitle className="text-xl md:text-2xl text-red-600">{stats.atRiskProjects}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Feature Metrics Grid - Mobile First Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {featureMetrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Tooltip key={metric.id}>
                <TooltipTrigger asChild>
                  <Card
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 touch-target w-full"
                    onMouseEnter={() => setHoveredMetric(metric.id)}
                    onMouseLeave={() => setHoveredMetric(null)}
                    onClick={() => onFeatureClick(metric.route, selectedProject || undefined)}
                  >
                    <CardContent className="p-4 md:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 md:p-2.5 rounded-lg ${metric.bgColor}`}>
                          <Icon className={`h-5 w-5 md:h-6 md:w-6 ${metric.color}`} />
                        </div>
                        <Badge variant="secondary" className="text-xs md:text-sm">
                          {projects.length}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm md:text-base leading-tight">{metric.title}</h3>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-lg md:text-xl font-bold ${metric.color}`}>{metric.value}</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500">{metric.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-2">
                    <h4 className="font-medium">{metric.title}</h4>
                    <div className="space-y-1">
                      {metric.projects.slice(0, 3).map((project) => (
                        <div
                          key={project.id}
                          className="flex justify-between text-sm cursor-pointer hover:bg-gray-100 p-1 rounded touch-target"
                          onClick={(e) => {
                            e.stopPropagation()
                            onProjectClick(project.id)
                          }}
                        >
                          <span className="truncate">{project.name}</span>
                          <span className="text-gray-500 ml-2">{project.value}</span>
                        </div>
                      ))}
                      {metric.projects.length > 3 && (
                        <div className="text-xs text-gray-400 pt-1">+{metric.projects.length - 3} more projects</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 pt-1 border-t">Click to view {metric.title}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}
