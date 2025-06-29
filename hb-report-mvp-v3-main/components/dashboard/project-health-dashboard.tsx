"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, AlertTriangle, Clock, DollarSign, Users, Calendar } from "lucide-react"

interface ProjectHealthDashboardProps {
  filters: {
    project: string
    phase: string
    department: string
    metricType: string
  }
  searchQuery: string
}

export function ProjectHealthDashboard({ filters, searchQuery }: ProjectHealthDashboardProps) {
  // Mock data for construction KPIs
  const healthMetrics = [
    {
      id: "schedule-adherence",
      title: "Schedule Adherence",
      value: 87,
      target: 90,
      trend: "up",
      status: "warning",
      description: "On-time completion rate for project milestones",
      unit: "%",
    },
    {
      id: "cost-variance",
      title: "Cost Variance",
      value: -2.3,
      target: 0,
      trend: "down",
      status: "good",
      description: "Percentage variance from approved budget",
      unit: "%",
    },
    {
      id: "quality-score",
      title: "Quality Score",
      value: 94,
      target: 95,
      trend: "up",
      status: "good",
      description: "Overall quality rating based on inspections",
      unit: "%",
    },
    {
      id: "safety-incidents",
      title: "Safety Incidents",
      value: 2,
      target: 0,
      trend: "up",
      status: "critical",
      description: "Number of safety incidents this month",
      unit: "incidents",
    },
  ]

  const projectOverview = [
    {
      id: "panther-tower",
      name: "Panther Tower South",
      phase: "Construction",
      progress: 68,
      budget: { used: 8.5, total: 12.0 },
      timeline: { current: "Foundation & Structure", daysRemaining: 145 },
      status: "on-track",
      risks: ["Weather delays", "Material delivery"],
      team: 45,
    },
    {
      id: "metro-office",
      name: "Metro Office Complex",
      phase: "Planning",
      progress: 23,
      budget: { used: 1.2, total: 8.5 },
      timeline: { current: "Design Development", daysRemaining: 280 },
      status: "at-risk",
      risks: ["Permit delays", "Design changes"],
      team: 12,
    },
    {
      id: "sandbox-test",
      name: "Sandbox Test Project",
      phase: "Closeout",
      progress: 95,
      budget: { used: 2.8, total: 3.0 },
      timeline: { current: "Final Inspections", daysRemaining: 15 },
      status: "ahead",
      risks: [],
      team: 8,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "text-green-600 bg-green-100"
      case "at-risk":
        return "text-yellow-600 bg-yellow-100"
      case "ahead":
        return "text-blue-600 bg-blue-100"
      case "delayed":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Project Health Dashboard</h2>
        <p className="text-gray-600">Key construction KPIs and project performance metrics</p>
      </div>

      <Tabs defaultValue="kpis" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kpis">Key Performance Indicators</TabsTrigger>
          <TabsTrigger value="projects">Project Overview</TabsTrigger>
          <TabsTrigger value="risks">Risk Management</TabsTrigger>
        </TabsList>

        <TabsContent value="kpis" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {healthMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    {getTrendIcon(metric.trend)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">
                        {metric.value}
                        {metric.unit}
                      </span>
                      <Badge className={getStatusColor(metric.status)}>{metric.status}</Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      Target: {metric.target}
                      {metric.unit}
                    </div>
                    <Progress
                      value={metric.status === "good" ? 100 : metric.status === "warning" ? 70 : 30}
                      className="h-2"
                    />
                    <p className="text-xs text-gray-600">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed KPI Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Performance Trend</CardTitle>
                <CardDescription>Weekly schedule adherence over the last 12 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Schedule trend chart would be displayed here</p>
                    <p className="text-sm">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Performance Analysis</CardTitle>
                <CardDescription>Budget utilization and variance tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Cost analysis chart would be displayed here</p>
                    <p className="text-sm">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <div className="space-y-4">
            {projectOverview.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline">{project.phase}</Badge>
                        <Badge className={getProjectStatusColor(project.status)}>
                          {project.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{project.progress}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={project.progress} className="h-3" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium">Budget</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          ${project.budget.used}M / ${project.budget.total}M
                        </div>
                        <Progress value={(project.budget.used / project.budget.total) * 100} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">Timeline</span>
                        </div>
                        <div className="text-sm text-gray-600">{project.timeline.current}</div>
                        <div className="text-xs text-gray-500">{project.timeline.daysRemaining} days remaining</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">Team</span>
                        </div>
                        <div className="text-sm text-gray-600">{project.team} active members</div>
                      </div>
                    </div>

                    {project.risks.length > 0 && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2 text-sm font-medium text-amber-600 mb-2">
                          <AlertTriangle className="h-4 w-4" />
                          Active Risks
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.risks.map((risk, index) => (
                            <Badge key={index} variant="outline" className="text-amber-600 border-amber-200">
                              {risk}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Matrix</CardTitle>
                <CardDescription>Current risks by probability and impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Risk matrix visualization would be displayed here</p>
                    <p className="text-sm">Integration with risk management system needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Mitigation Status</CardTitle>
                <CardDescription>Progress on risk mitigation strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Weather Delays</div>
                      <div className="text-sm text-gray-500">Mitigation: Schedule buffer added</div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Material Delivery</div>
                      <div className="text-sm text-gray-500">Mitigation: Alternative suppliers identified</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Permit Delays</div>
                      <div className="text-sm text-gray-500">Mitigation: Expedited review requested</div>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Critical</Badge>
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
