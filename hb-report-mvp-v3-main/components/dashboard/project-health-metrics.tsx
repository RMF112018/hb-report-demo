"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Clock, DollarSign, Shield, Target, AlertTriangle, CheckCircle } from "lucide-react"

interface ProjectHealthMetricsProps {
  filters: {
    project: string
    phase: string
    department: string
    metricType: string
  }
  searchQuery: string
}

export function ProjectHealthMetrics({ filters, searchQuery }: ProjectHealthMetricsProps) {
  const healthKPIs = [
    {
      id: "schedule-adherence",
      title: "Schedule",
      value: 87,
      target: 90,
      trend: "up",
      change: "+2.3%",
      status: "warning",
      description: "On-time completion rate",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "cost-performance",
      title: "Cost",
      value: 102,
      target: 100,
      trend: "up",
      change: "+1.8%",
      status: "good",
      description: "Cost Performance Index",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "quality-score",
      title: "Quality",
      value: 94,
      target: 95,
      trend: "up",
      change: "+0.5%",
      status: "good",
      description: "Overall quality rating",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      id: "safety-rating",
      title: "Safety",
      value: 96,
      target: 100,
      trend: "stable",
      change: "0%",
      status: "excellent",
      description: "Safety performance score",
      icon: Shield,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
  ]

  const projectOverview = [
    {
      id: "panther-tower",
      name: "Panther Tower South",
      phase: "Construction",
      progress: 68,
      health: "good",
      budget: { used: 8.5, total: 12.0, variance: -5 },
      timeline: { daysRemaining: 145, status: "on-track" },
      team: 45,
      risks: 2,
      milestones: { completed: 8, total: 12 },
    },
    {
      id: "metro-office",
      name: "Metro Office Complex",
      phase: "Planning",
      progress: 23,
      health: "warning",
      budget: { used: 1.2, total: 8.5, variance: +3 },
      timeline: { daysRemaining: 280, status: "at-risk" },
      team: 12,
      risks: 4,
      milestones: { completed: 2, total: 15 },
    },
    {
      id: "sandbox-test",
      name: "Sandbox Test Project",
      phase: "Closeout",
      progress: 95,
      health: "excellent",
      budget: { used: 2.8, total: 3.0, variance: -7 },
      timeline: { daysRemaining: 15, status: "ahead" },
      team: 8,
      risks: 0,
      milestones: { completed: 9, total: 10 },
    },
  ]

  const weeklyProgressData = [
    { week: "W1", planned: 10, actual: 8, quality: 92 },
    { week: "W2", planned: 20, actual: 18, quality: 94 },
    { week: "W3", planned: 30, actual: 28, quality: 93 },
    { week: "W4", planned: 40, actual: 38, quality: 95 },
    { week: "W5", planned: 50, actual: 47, quality: 94 },
    { week: "W6", planned: 60, actual: 58, quality: 96 },
  ]

  const riskDistribution = [
    { name: "Low", value: 65, color: "#22c55e" },
    { name: "Medium", value: 25, color: "#f59e0b" },
    { name: "High", value: 10, color: "#ef4444" },
  ]

  const getProjectHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "text-emerald-600 bg-emerald-100"
      case "good":
        return "text-green-600 bg-green-100"
      case "warning":
        return "text-yellow-600 bg-yellow-100"
      case "critical":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-track":
      case "ahead":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "at-risk":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "behind":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Project Health Dashboard</h2>
        <p className="text-sm text-gray-600">Real-time construction KPIs and performance metrics</p>
      </div>

      {/* Compact Health Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {healthKPIs.map((kpi) => {
          const IconComponent = kpi.icon
          return (
            <Card
              key={kpi.id}
              className={`${kpi.bgColor} ${kpi.borderColor} border hover:shadow-lg transition-all duration-200`}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-full ${kpi.bgColor} ${kpi.borderColor} border`}>
                      <IconComponent className={`h-3.5 w-3.5 ${kpi.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{kpi.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {kpi.trend === "up" ? (
                      <TrendingUp className={`h-3 w-3 ${kpi.color}`} />
                    ) : kpi.trend === "down" ? (
                      <TrendingDown className={`h-3 w-3 ${kpi.color}`} />
                    ) : null}
                    <span className={`text-xs font-medium ${kpi.color}`}>{kpi.change}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-xl font-bold ${kpi.color}`}>
                      {kpi.value}
                      {kpi.id.includes("score") || kpi.id.includes("adherence") || kpi.id.includes("rating") ? "%" : ""}
                    </span>
                    <span className="text-xs text-gray-500">
                      / {kpi.target}
                      {kpi.id.includes("score") || kpi.id.includes("adherence") || kpi.id.includes("rating") ? "%" : ""}
                    </span>
                  </div>
                  <Progress value={(kpi.value / kpi.target) * 100} className="h-1.5" />
                  <p className="text-xs text-gray-600">{kpi.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Compact Health Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-9">
          <TabsTrigger value="overview" className="text-xs">
            Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-xs">
            Projects
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-xs">
            Trends
          </TabsTrigger>
          <TabsTrigger value="risks" className="text-xs">
            Risks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          {/* Health Summary Cards - More Compact */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Schedule Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">87%</div>
                    <p className="text-xs text-gray-500">On-time completion rate</p>
                  </div>
                  <Progress value={87} className="h-2" />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-blue-600 font-semibold">-2 days</p>
                      <p className="text-gray-500 text-xs">Behind schedule</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <p className="text-green-600 font-semibold">8/12</p>
                      <p className="text-gray-500 text-xs">Milestones hit</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Financial Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">102%</div>
                    <p className="text-xs text-gray-500">Cost Performance Index</p>
                  </div>
                  <Progress value={102} className="h-2" />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <p className="text-green-600 font-semibold">$8.5M</p>
                      <p className="text-gray-500 text-xs">Spent to date</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-blue-600 font-semibold">$3.5M</p>
                      <p className="text-gray-500 text-xs">Remaining</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  Safety & Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">96%</div>
                    <p className="text-xs text-gray-500">Safety performance score</p>
                  </div>
                  <Progress value={96} className="h-2" />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center p-2 bg-emerald-50 rounded">
                      <p className="text-emerald-600 font-semibold">0</p>
                      <p className="text-gray-500 text-xs">Incidents</p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <p className="text-purple-600 font-semibold">94%</p>
                      <p className="text-gray-500 text-xs">Quality score</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <div className="space-y-4">
            {projectOverview.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.phase} Phase</p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getProjectHealthColor(project.health)}`}
                    >
                      {project.health}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Progress</p>
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="h-2 flex-1" />
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500 mb-1">Budget</p>
                      <p className="font-medium">
                        ${project.budget.used}M / ${project.budget.total}M
                      </p>
                      <p className={`text-xs ${project.budget.variance < 0 ? "text-green-600" : "text-red-600"}`}>
                        {project.budget.variance > 0 ? "+" : ""}
                        {project.budget.variance}% variance
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 mb-1">Timeline</p>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(project.timeline.status)}
                        <span className="font-medium">{project.timeline.daysRemaining} days</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500 mb-1">Team & Risks</p>
                      <p className="font-medium">{project.team} members</p>
                      <p className="text-xs text-gray-600">{project.risks} active risks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyProgressData.map((week) => (
                  <div key={week.week} className="flex items-center gap-4">
                    <div className="w-8 text-sm font-medium">{week.week}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Planned: {week.planned}%</span>
                        <span>Actual: {week.actual}%</span>
                      </div>
                      <div className="relative">
                        <Progress value={week.planned} className="h-2 bg-gray-200" />
                        <Progress value={week.actual} className="h-2 absolute top-0 bg-blue-200" />
                      </div>
                    </div>
                    <div className="text-sm font-medium text-purple-600">Q: {week.quality}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {riskDistribution.map((risk) => (
                    <div key={risk.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: risk.color }} />
                        <span className="text-sm font-medium">{risk.name} Risk</span>
                      </div>
                      <span className="text-sm font-bold">{risk.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Risk Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Weather Delays</p>
                      <p className="text-xs text-gray-600">High impact on schedule</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Material Shortage</p>
                      <p className="text-xs text-gray-600">Medium impact on cost</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Permit Delays</p>
                      <p className="text-xs text-gray-600">Medium impact on timeline</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
