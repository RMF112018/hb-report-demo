"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Calendar,
  Brain,
  Lightbulb,
  Award,
  Eye,
  Edit,
  ArrowRight,
  Home,
  MapPin,
  Percent,
  Star
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts"

// Import existing components and data
import { PreConstructionResponsibilityMatrix } from "@/components/precon/PreConstructionResponsibilityMatrix"
import { CostSummaryModule } from "@/components/estimating/CostSummaryModule"
import { AreaCalculationsModule } from "@/components/estimating/AreaCalculationsModule"
import projectsData from "@/data/mock/projects.json"
import estimatingData from "@/data/mock/estimating/estimating-tracking.json"
import responsibilityData from "@/data/mock/precon/responsibility-matrix.json"

interface ProjectSpecificDashboardProps {
  projectId: string
  onNavigateToTracker?: () => void
  onNavigateToResponsibility?: () => void
}

const COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981", 
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  cyan: "#06b6d4"
}

export function ProjectSpecificDashboard({ 
  projectId, 
  onNavigateToTracker, 
  onNavigateToResponsibility 
}: ProjectSpecificDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Find the specific project data, fallback to first project as sample data
  const projectData = useMemo(() => {
    const foundProject = projectsData.find(p => p.project_id.toString() === projectId)
    // Always return a project - use the first one as sample data if not found
    return foundProject || projectsData[0]
  }, [projectId])

  // Find estimating data for this project
  const estimatingProjectData = useMemo(() => {
    if (!projectData) return null
    
    // Look in all estimating data sources for this project
    const allEstimatingProjects = [
      ...estimatingData.currentPursuits,
      ...estimatingData.currentPreconstruction,
      ...estimatingData.estimateTrackingLog
    ]
    
    return allEstimatingProjects.find(p => 
      p.projectName.toLowerCase().includes(projectData.name.toLowerCase()) ||
      p.projectNumber === projectData.project_number
    )
  }, [projectData])

  // Responsibility matrix data (in production would be project-specific)
  const responsibilityStats = useMemo(() => {
    const tasks = responsibilityData.managingInformation
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === "completed").length
    const inProgressTasks = tasks.filter(task => task.status === "in-progress").length
    const highPriorityTasks = tasks.filter(task => task.priority === "high").length
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      highPriorityTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    }
  }, [])

  // Generate project lifecycle data based on current stage
  const lifecycleData = useMemo(() => {
    if (!projectData) return []
    
    const stages = [
      { name: "Pre-Construction", status: "completed", progress: 100 },
      { name: "Operations", status: "current", progress: 65 },
      { name: "Warranty", status: "upcoming", progress: 0 },
      { name: "Archive", status: "upcoming", progress: 0 }
    ]

    // Adjust based on current project stage
    switch (projectData.project_stage_name) {
      case "Bidding":
      case "Pre-Construction":
        stages[0].status = "current"
        stages[0].progress = 45
        stages[1].status = "upcoming"
        stages[1].progress = 0
        break
      case "Construction":
        stages[1].status = "current"
        stages[1].progress = 65
        break
      case "Closeout":
        stages[1].progress = 95
        stages[2].status = "current"
        stages[2].progress = 25
        break
      case "Warranty":
        stages[1].progress = 100
        stages[2].status = "current"
        stages[2].progress = 60
        break
      case "Closed":
        stages[1].progress = 100
        stages[2].progress = 100
        stages[3].status = "completed"
        stages[3].progress = 100
        break
    }

    return stages
  }, [projectData])





  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  // Get stage status color
  const getStageStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "current": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "upcoming": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Project data is always available due to fallback logic above

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <CardTitle className="text-xl text-blue-800 dark:text-blue-200">
                    {projectData.name}
                  </CardTitle>
                  <CardDescription className="text-blue-600 dark:text-blue-400">
                    Project #{projectData.project_number} • {projectData.project_type_name}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <Badge className={getStageStatusColor("current")}>
                  {projectData.project_stage_name}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-blue-700 dark:text-blue-300">
                  <MapPin className="h-3 w-3" />
                  {projectData.city}, {projectData.state_code}
                </div>
                <div className="flex items-center gap-1 text-sm text-blue-700 dark:text-blue-300">
                  <Calendar className="h-3 w-3" />
                  {new Date(projectData.start_date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(projectData.contract_value)}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Contract Value
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Project Lifecycle Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Project Lifecycle Status
          </CardTitle>
          <CardDescription>
            Track progress through Pre-Construction, Operations, Warranty, and Archive phases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lifecycleData.map((stage, index) => (
              <div key={stage.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      stage.status === "completed" ? "bg-green-500" :
                      stage.status === "current" ? "bg-blue-500" : "bg-gray-300"
                    }`} />
                    <span className="font-medium">{stage.name}</span>
                    <Badge className={getStageStatusColor(stage.status)}>
                      {stage.status === "completed" ? "Complete" :
                       stage.status === "current" ? "In Progress" : "Upcoming"}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{stage.progress}%</span>
                </div>
                <Progress value={stage.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Square Footage</CardTitle>
            <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {projectData.square_feet?.toLocaleString() || "N/A"}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              {projectData.square_feet ? `$${Math.round(projectData.contract_value / projectData.square_feet)}/SF` : "Cost/SF N/A"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Duration</CardTitle>
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {projectData.duration || "TBD"} days
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Scheduled duration
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Responsibility Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {responsibilityStats.completedTasks}/{responsibilityStats.totalTasks}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {responsibilityStats.completionRate.toFixed(0)}% Complete
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Delivery Method</CardTitle>
            <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
              {projectData.delivery_method}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Contract type
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="costs">Cost Summary</TabsTrigger>
          <TabsTrigger value="areas">Area Calc</TabsTrigger>
          <TabsTrigger value="estimating">Estimating</TabsTrigger>
          <TabsTrigger value="responsibility">Responsibility</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Project Details */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Project Type:</span>
                    <p>{projectData.project_type_name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Sector:</span>
                    <p>{projectData.sector}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Work Scope:</span>
                    <p>{projectData.work_scope}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">County:</span>
                    <p>{projectData.county}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-muted-foreground">Description:</span>
                    <p>{projectData.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* HBI Project Intelligence */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900 border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
                  <Brain className="h-5 w-5" />
                  HBI Project Intelligence
                </CardTitle>
                <CardDescription className="text-indigo-600 dark:text-indigo-400">
                  AI-powered insights for this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Schedule Optimization</p>
                      <p className="text-xs text-indigo-700 dark:text-indigo-300">
                        Consider parallel MEP rough-in to reduce critical path by 8 days
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Cost Opportunity</p>
                      <p className="text-xs text-indigo-700 dark:text-indigo-300">
                        Market conditions suggest 3-5% savings on structural steel if ordered this month
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Risk Alert</p>
                      <p className="text-xs text-indigo-700 dark:text-indigo-300">
                        High priority: 5 responsibility matrix items require immediate attention
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Navigate to key project tools and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <Button 
                  variant="outline" 
                  className="justify-start gap-2"
                  onClick={onNavigateToTracker}
                >
                  <Calculator className="h-4 w-4" />
                  Estimating Tracker
                  <ArrowRight className="h-3 w-3 ml-auto" />
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start gap-2"
                  onClick={onNavigateToResponsibility}
                >
                  <CheckCircle className="h-4 w-4" />
                  Responsibility Matrix
                  <ArrowRight className="h-3 w-3 ml-auto" />
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Financial Hub
                  <ArrowRight className="h-3 w-3 ml-auto" />
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule
                  <ArrowRight className="h-3 w-3 ml-auto" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estimating" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Estimating Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-green-600" />
                  Estimating Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {estimatingProjectData ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {estimatingProjectData.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Lead Estimator:</span>
                      <span>{estimatingProjectData.leadEstimator}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Deliverable:</span>
                      <span>{estimatingProjectData.deliverable}</span>
                    </div>
                    {estimatingProjectData.estimatedValue && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Estimated Value:</span>
                        <span className="font-semibold">
                          {formatCurrency(estimatingProjectData.estimatedValue)}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No estimating data found for this project.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Estimating Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Estimating Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                {estimatingProjectData?.checklist ? (
                  <div className="space-y-3">
                    {Object.entries(estimatingProjectData.checklist).map(([key, completed]) => (
                      <div key={key} className="flex items-center gap-2">
                        <CheckCircle className={`h-4 w-4 ${
                          completed ? "text-green-600" : "text-gray-400"
                        }`} />
                        <span className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Checklist data not available.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="responsibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Responsibility Matrix Summary
              </CardTitle>
              <CardDescription>
                Key tasks and deliverables for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {responsibilityStats.completedTasks}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-warning">
                    {responsibilityStats.inProgressTasks}
                  </div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-danger">
                    {responsibilityStats.highPriorityTasks}
                  </div>
                  <div className="text-sm text-muted-foreground">High Priority</div>
                </div>
              </div>
              <Button 
                onClick={onNavigateToResponsibility}
                className="w-full"
              >
                View Full Responsibility Matrix
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="space-y-6">
          <AreaCalculationsModule
            projectId={projectId}
            projectName={projectData.name}
            onSave={(data) => {
              // Handle save to backend/storage
              console.log('Area calculations saved:', data)
            }}
            onExport={(format) => {
              // Handle export functionality
              console.log('Export format:', format)
            }}
          />
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <CostSummaryModule
            projectId={projectId}
            projectName={projectData.name}
            onSave={(data) => {
              // Handle save functionality
              console.log('Cost summary saved:', data)
            }}
            onExport={(format) => {
              // Handle export functionality
              console.log('Exporting cost summary as:', format)
            }}
            onSubmit={(data) => {
              // Handle submit functionality
              console.log('Cost summary submitted:', data)
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 