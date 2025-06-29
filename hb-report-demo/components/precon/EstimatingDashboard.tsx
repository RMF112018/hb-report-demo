"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Building2,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Calendar,
  Zap,
  Timer,
  Award,
  Brain,
  Layers,
  LineChart,
  Eye,
  Settings,
  Percent,
  Star,
  ArrowUp,
  ArrowDown,
  TrendingRight
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
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ComposedChart
} from "recharts"

interface EstimatingDashboardProps {
  preconProjects: any[]
  pipelineData: any[]
  userRole: string
}

const COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981", 
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  cyan: "#06b6d4"
}

export function EstimatingDashboard({ preconProjects, pipelineData, userRole }: EstimatingDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")
  const [selectedView, setSelectedView] = useState("workload")

  // Generate comprehensive estimating workload data
  const workloadData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months.map((month, index) => {
      const baseActive = 8 + Math.sin(index * 0.5) * 3
      const baseCompleted = 4 + Math.sin(index * 0.7) * 2
      const basePending = 2 + Math.sin(index * 0.3) * 1
      return {
        month,
        active: Math.floor(baseActive + Math.random() * 2),
        completed: Math.floor(baseCompleted + Math.random() * 2),
        pending: Math.floor(basePending + Math.random() * 1),
        accuracy: 85 + Math.random() * 10,
        avgDuration: 12 + Math.random() * 8,
        totalValue: (50 + Math.random() * 30) * 1000000
      }
    })
  }, [])

  // Calculate comprehensive estimating metrics
  const estimatingMetrics = useMemo(() => {
    const totalEstimates = workloadData.reduce((sum, month) => sum + month.active + month.completed, 0)
    const completedEstimates = workloadData.reduce((sum, month) => sum + month.completed, 0)
    const averageAccuracy = workloadData.reduce((sum, month) => sum + month.accuracy, 0) / workloadData.length
    const currentWorkload = workloadData[workloadData.length - 1]?.active || 0
    const lastMonthWorkload = workloadData[workloadData.length - 2]?.active || 0
    const workloadTrend = ((currentWorkload - lastMonthWorkload) / lastMonthWorkload) * 100
    
    // Calculate cost per square foot trends
    const costPerSF = preconProjects.map(project => ({
      name: project.name,
      costPerSF: project.contract_value / (project.square_feet || 1),
      type: project.project_type_name,
      size: project.square_feet,
      duration: project.duration || 365
    }))

    const avgCostPerSF = costPerSF.reduce((sum, item) => sum + item.costPerSF, 0) / Math.max(costPerSF.length, 1)
    const avgDuration = workloadData.reduce((sum, month) => sum + month.avgDuration, 0) / workloadData.length
    const totalValueEstimated = workloadData.reduce((sum, month) => sum + month.totalValue, 0)

    // Team utilization simulation
    const teamMembers = [
      { name: "Senior Estimator", utilization: 85, projects: 3, efficiency: 92 },
      { name: "Estimator II", utilization: 78, projects: 4, efficiency: 88 },
      { name: "Junior Estimator", utilization: 65, projects: 2, efficiency: 82 },
      { name: "Cost Engineer", utilization: 90, projects: 5, efficiency: 95 }
    ]

    return {
      totalEstimates,
      completedEstimates,
      averageAccuracy,
      currentWorkload,
      workloadTrend,
      costPerSF: avgCostPerSF,
      projectTypes: costPerSF,
      avgDuration,
      totalValueEstimated,
      teamMembers,
      avgTeamUtilization: teamMembers.reduce((sum, member) => sum + member.utilization, 0) / teamMembers.length,
      completionRate: (completedEstimates / totalEstimates) * 100,
      cycleTimeImprovement: 18 // Percentage improvement in cycle time
    }
  }, [workloadData, preconProjects])

  // Generate enhanced cost breakdown data
  const costBreakdownData = useMemo(() => {
    return [
      { name: "Labor", value: 35, cost: 15750000, variance: 2.3, fill: COLORS.primary },
      { name: "Materials", value: 28, cost: 12600000, variance: -1.8, fill: COLORS.secondary },
      { name: "Equipment", value: 15, cost: 6750000, variance: 0.5, fill: COLORS.warning },
      { name: "Subcontractors", value: 18, cost: 8100000, variance: -3.2, fill: COLORS.danger },
      { name: "Overhead", value: 4, cost: 1800000, variance: 1.1, fill: COLORS.purple }
    ]
  }, [])

  // Enhanced accuracy tracking data
  const accuracyData = useMemo(() => {
    return [
      { period: "Q1 2024", estimated: 42500000, actual: 41800000, variance: -1.6, accuracy: 98.4 },
      { period: "Q2 2024", estimated: 38200000, actual: 39100000, variance: 2.4, accuracy: 97.6 },
      { period: "Q3 2024", estimated: 51300000, actual: 50200000, variance: -2.1, accuracy: 97.9 },
      { period: "Q4 2024", estimated: 47800000, actual: 48900000, variance: 2.3, accuracy: 97.7 },
      { period: "Q1 2025", estimated: 55200000, actual: 54100000, variance: -2.0, accuracy: 98.0 }
    ]
  }, [])

  // Active pre-construction projects with enhanced data
  const activeProjects = useMemo(() => {
    return preconProjects.slice(0, 8).map((project, index) => ({
      ...project,
      estimateStatus: ["In Progress", "Review", "Approved", "Pending"][index % 4],
      estimateProgress: Math.floor(Math.random() * 100),
      estimator: estimatingMetrics.teamMembers[index % estimatingMetrics.teamMembers.length].name,
      priority: ["High", "Medium", "Low"][index % 3],
      dueDate: new Date(Date.now() + (Math.random() * 30 + 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))
  }, [preconProjects, estimatingMetrics.teamMembers])

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Review": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Approved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Pending": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Performance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Estimates</CardTitle>
            <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {estimatingMetrics.currentWorkload}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {estimatingMetrics.workloadTrend > 0 ? (
                <ArrowUp className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-600" />
              )}
              <span className={estimatingMetrics.workloadTrend > 0 ? "text-green-600" : "text-red-600"}>
                {Math.abs(estimatingMetrics.workloadTrend).toFixed(1)}% vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Accuracy Rate</CardTitle>
            <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {estimatingMetrics.averageAccuracy.toFixed(1)}%
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              +3.2% improvement this quarter
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg Cost/SF</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              ${estimatingMetrics.costPerSF.toFixed(0)}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Market competitive range
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Team Utilization</CardTitle>
            <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {estimatingMetrics.avgTeamUtilization.toFixed(0)}%
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Optimal capacity range
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Enhanced Workload Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Estimating Workload & Performance
            </CardTitle>
            <CardDescription>
              Monthly estimate volume, completion rates, and accuracy trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="workload" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="workload">Workload</TabsTrigger>
                <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="workload">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workloadData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="active" name="Active" fill={COLORS.primary} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="completed" name="Completed" fill={COLORS.secondary} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="pending" name="Pending" fill={COLORS.warning} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="accuracy">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={accuracyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="period" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      yAxisId="left" 
                      dataKey="estimated" 
                      name="Estimated" 
                      fill={COLORS.primary} 
                      fillOpacity={0.6}
                    />
                    <Bar 
                      yAxisId="left" 
                      dataKey="actual" 
                      name="Actual" 
                      fill={COLORS.secondary} 
                      fillOpacity={0.6}
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke={COLORS.warning} 
                      strokeWidth={3}
                      name="Accuracy %"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="performance">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={workloadData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="totalValue"
                      stackId="1"
                      stroke={COLORS.cyan}
                      fill={COLORS.cyan}
                      fillOpacity={0.6}
                      name="Est. Value"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgDuration" 
                      stroke={COLORS.danger} 
                      strokeWidth={2}
                      name="Avg Duration (days)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Enhanced HBI Estimating Intelligence */}
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
              <Brain className="h-5 w-5" />
              HBI Estimating Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Accuracy Improvement</p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    Estimate accuracy improved 3.2% over last quarter with refined cost models
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Cycle Time Optimization</p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    Average estimate cycle reduced by {estimatingMetrics.cycleTimeImprovement}% through process improvements
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Cost Optimization</p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    Materials category optimization could save 2.1% on total project costs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Resource Allocation</p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    Workload distribution at optimal levels with {estimatingMetrics.avgTeamUtilization.toFixed(0)}% average utilization
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="pt-3 border-t border-indigo-200 dark:border-indigo-700">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-700 dark:text-indigo-300">Completion Rate</span>
                  <span className="font-medium text-indigo-900 dark:text-indigo-100">
                    {estimatingMetrics.completionRate.toFixed(1)}%
                  </span>
                </div>
                <Progress value={estimatingMetrics.completionRate} className="h-2" />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-700 dark:text-indigo-300">Value Estimated</span>
                  <span className="font-medium text-indigo-900 dark:text-indigo-100">
                    {formatCurrency(estimatingMetrics.totalValueEstimated)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis & Team Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enhanced Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600" />
              Cost Breakdown Analysis
            </CardTitle>
            <CardDescription>
              Cost distribution with variance analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-2">
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={costBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, "Percentage"]} />
                </RechartsPieChart>
              </ResponsiveContainer>
              
              <div className="space-y-3">
                {costBreakdownData.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.fill }}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{formatCurrency(category.cost)}</div>
                      <div className={`text-xs flex items-center gap-1 ${
                        category.variance > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {category.variance > 0 ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {Math.abs(category.variance).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Team Utilization & Performance
            </CardTitle>
            <CardDescription>
              Individual team member workload and efficiency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {estimatingMetrics.teamMembers.map((member, index) => (
                <div key={member.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {member.projects} active projects
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{member.utilization}%</div>
                      <div className="text-xs text-muted-foreground">
                        {member.efficiency}% efficiency
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress value={member.utilization} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Utilization</span>
                      <span className={member.utilization > 85 ? "text-orange-600" : "text-green-600"}>
                        {member.utilization > 85 ? "High" : member.utilization > 70 ? "Optimal" : "Available"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Team Summary */}
              <div className="pt-3 border-t border-border">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">
                      {estimatingMetrics.teamMembers.reduce((sum, member) => sum + member.projects, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Projects</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-secondary">
                      {estimatingMetrics.avgTeamUtilization.toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Utilization</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-warning">
                      {(estimatingMetrics.teamMembers.reduce((sum, member) => sum + member.efficiency, 0) / estimatingMetrics.teamMembers.length).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Efficiency</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Pre-Construction Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Active Pre-Construction Projects
          </CardTitle>
          <CardDescription>
            Current estimates in progress with status and timeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeProjects.map((project, index) => (
              <div key={project.project_id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="font-medium">{project.name}</div>
                    <Badge className={getStatusColor(project.estimateStatus)}>
                      {project.estimateStatus}
                    </Badge>
                    <Badge className={getPriorityColor(project.priority)} variant="outline">
                      {project.priority}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(project.contract_value)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.estimator}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due: {new Date(project.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {project.project_type_name}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{project.estimateProgress}%</span>
                    </div>
                    <Progress value={project.estimateProgress} className="h-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 