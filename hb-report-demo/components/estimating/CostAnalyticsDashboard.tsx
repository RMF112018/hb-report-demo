"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  Brain,
  Zap,
  Download,
  Filter,
  Calendar,
  Building2,
  Users,
  Clock,
  Award,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

interface CostAnalyticsDashboardProps {
  userRole: string
}

interface CostTrendData {
  month: string
  estimated: number
  actual: number
  variance: number
  projects: number
}

interface CategoryAnalysis {
  category: string
  estimatedCost: number
  actualCost: number
  variance: number
  variancePercentage: number
  accuracy: number
  projects: number
}

interface ProjectPerformance {
  projectName: string
  estimatedValue: number
  actualValue: number
  variance: number
  variancePercentage: number
  accuracy: number
  status: string
  completionDate: string
}

interface CostMetrics {
  totalEstimatedValue: number
  totalActualValue: number
  overallVariance: number
  averageAccuracy: number
  completedProjects: number
  onBudgetProjects: number
  overBudgetProjects: number
  underBudgetProjects: number
  estimatingEfficiency: number
  costSavings: number
}

// Mock data
const mockTrendData: CostTrendData[] = [
  { month: 'Jan', estimated: 12500000, actual: 12800000, variance: -300000, projects: 3 },
  { month: 'Feb', estimated: 8200000, actual: 7950000, variance: 250000, projects: 2 },
  { month: 'Mar', estimated: 15600000, actual: 15100000, variance: 500000, projects: 4 },
  { month: 'Apr', estimated: 11800000, actual: 12200000, variance: -400000, projects: 3 },
  { month: 'May', estimated: 18200000, actual: 17800000, variance: 400000, projects: 5 },
  { month: 'Jun', estimated: 22500000, actual: 22100000, variance: 400000, projects: 6 },
  { month: 'Jul', estimated: 19800000, actual: 20300000, variance: -500000, projects: 4 },
  { month: 'Aug', estimated: 16400000, actual: 15900000, variance: 500000, projects: 4 },
  { month: 'Sep', estimated: 21200000, actual: 20800000, variance: 400000, projects: 5 },
  { month: 'Oct', estimated: 17900000, actual: 18400000, variance: -500000, projects: 4 },
  { month: 'Nov', estimated: 14600000, actual: 14200000, variance: 400000, projects: 3 },
  { month: 'Dec', estimated: 20100000, actual: 19600000, variance: 500000, projects: 5 }
]

const mockCategoryAnalysis: CategoryAnalysis[] = [
  {
    category: 'Concrete',
    estimatedCost: 45000000,
    actualCost: 44200000,
    variance: 800000,
    variancePercentage: 1.8,
    accuracy: 98.2,
    projects: 15
  },
  {
    category: 'Steel',
    estimatedCost: 38500000,
    actualCost: 39800000,
    variance: -1300000,
    variancePercentage: -3.4,
    accuracy: 96.6,
    projects: 12
  },
  {
    category: 'MEP',
    estimatedCost: 62000000,
    actualCost: 60200000,
    variance: 1800000,
    variancePercentage: 2.9,
    accuracy: 97.1,
    projects: 18
  },
  {
    category: 'Finishes',
    estimatedCost: 28000000,
    actualCost: 29500000,
    variance: -1500000,
    variancePercentage: -5.4,
    accuracy: 94.6,
    projects: 20
  },
  {
    category: 'Roofing',
    estimatedCost: 12500000,
    actualCost: 12100000,
    variance: 400000,
    variancePercentage: 3.2,
    accuracy: 96.8,
    projects: 8
  }
]

const mockProjectPerformance: ProjectPerformance[] = [
  {
    projectName: 'Tech Campus Phase II',
    estimatedValue: 68000000,
    actualValue: 71500000,
    variance: -3500000,
    variancePercentage: -5.1,
    accuracy: 94.9,
    status: 'complete',
    completionDate: '2024-11-30'
  },
  {
    projectName: 'Education Center Renovation',
    estimatedValue: 22000000,
    actualValue: 21800000,
    variance: 200000,
    variancePercentage: 0.9,
    accuracy: 99.1,
    status: 'complete',
    completionDate: '2024-12-15'
  },
  {
    projectName: 'Downtown Medical Center',
    estimatedValue: 28500000,
    actualValue: 27900000,
    variance: 600000,
    variancePercentage: 2.1,
    accuracy: 97.9,
    status: 'complete',
    completionDate: '2025-01-20'
  }
]

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function CostAnalyticsDashboard({ userRole }: CostAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('12months')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Calculate metrics
  const metrics: CostMetrics = useMemo(() => {
    const totalEstimatedValue = mockTrendData.reduce((sum, item) => sum + item.estimated, 0)
    const totalActualValue = mockTrendData.reduce((sum, item) => sum + item.actual, 0)
    const overallVariance = totalEstimatedValue - totalActualValue
    const averageAccuracy = mockCategoryAnalysis.reduce((sum, cat) => sum + cat.accuracy, 0) / mockCategoryAnalysis.length
    const completedProjects = mockProjectPerformance.length
    const onBudgetProjects = mockProjectPerformance.filter(p => Math.abs(p.variancePercentage) <= 2).length
    const overBudgetProjects = mockProjectPerformance.filter(p => p.variancePercentage < -2).length
    const underBudgetProjects = mockProjectPerformance.filter(p => p.variancePercentage > 2).length
    const estimatingEfficiency = (onBudgetProjects / completedProjects) * 100
    const costSavings = overallVariance > 0 ? overallVariance : 0

    return {
      totalEstimatedValue,
      totalActualValue,
      overallVariance,
      averageAccuracy,
      completedProjects,
      onBudgetProjects,
      overBudgetProjects,
      underBudgetProjects,
      estimatingEfficiency,
      costSavings
    }
  }, [])

  // Format currency
  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value)
    if (absValue >= 1000000000) {
      return `${value < 0 ? '-' : ''}$${(absValue / 1000000000).toFixed(1)}B`
    } else if (absValue >= 1000000) {
      return `${value < 0 ? '-' : ''}$${(absValue / 1000000).toFixed(1)}M`
    } else if (absValue >= 1000) {
      return `${value < 0 ? '-' : ''}$${(absValue / 1000).toFixed(0)}K`
    }
    return `${value < 0 ? '-' : ''}$${absValue.toLocaleString()}`
  }

  // Get variance indicator
  const getVarianceIndicator = (variance: number) => {
    if (variance > 0) {
      return <div className="flex items-center gap-1 text-green-600"><ArrowUp className="h-4 w-4" />Under Budget</div>
    } else if (variance < 0) {
      return <div className="flex items-center gap-1 text-red-600"><ArrowDown className="h-4 w-4" />Over Budget</div>
    } else {
      return <div className="flex items-center gap-1 text-gray-600"><Minus className="h-4 w-4" />On Budget</div>
    }
  }

  // Get accuracy badge
  const getAccuracyBadge = (accuracy: number) => {
    if (accuracy >= 98) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Excellent</Badge>
    } else if (accuracy >= 95) {
      return <Badge variant="default" className="bg-blue-100 text-blue-800">Good</Badge>
    } else if (accuracy >= 90) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Fair</Badge>
    } else {
      return <Badge variant="destructive" className="bg-red-100 text-red-800">Poor</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Cost Analytics & Performance Intelligence
            </h2>
            <p className="text-muted-foreground mt-1">
              Advanced cost analysis, variance tracking, and predictive estimating insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="12months">Last 12 Months</SelectItem>
                <SelectItem value="24months">Last 24 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Variance</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(metrics.overallVariance)}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {metrics.overallVariance > 0 ? 'Under budget' : 'Over budget'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Avg Accuracy</CardTitle>
            <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {metrics.averageAccuracy.toFixed(1)}%
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">On Budget</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {metrics.onBudgetProjects}/{metrics.completedProjects}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {metrics.estimatingEfficiency.toFixed(1)}% efficiency
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Cost Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {formatCurrency(metrics.costSavings)}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              From accurate estimates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-muted border-border">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Cost Variance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Cost Variance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="estimated" fill="#0088FE" name="Estimated" />
                    <Bar dataKey="actual" fill="#00C49F" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Accuracy by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Accuracy by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockCategoryAnalysis}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, accuracy }) => `${name}: ${accuracy.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="accuracy"
                    >
                      {mockCategoryAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{metrics.underBudgetProjects}</div>
                    <div className="text-sm text-green-600">Under Budget</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{metrics.onBudgetProjects}</div>
                    <div className="text-sm text-blue-600">On Budget</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{metrics.overBudgetProjects}</div>
                    <div className="text-sm text-red-600">Over Budget</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Efficiency</span>
                    <span className="text-sm">{metrics.estimatingEfficiency.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.estimatingEfficiency} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* HBI Intelligence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  HBI Cost Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">Cost Optimization</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Steel estimates show 3% variance. Consider adjusting factor for future projects.
                  </p>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-sm">Accuracy Improvement</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Concrete estimates improved 2.1% accuracy over last quarter.
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-sm">Risk Alert</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Finishes category showing higher variance. Review pricing models.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6">
            {/* Variance Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Variance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={mockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="variance" stroke="#FF8042" name="Variance" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Accuracy Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Accuracy Trends by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={mockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[85, 100]} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="projects" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid gap-6">
            {mockCategoryAnalysis.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {category.category}
                    </CardTitle>
                    {getAccuracyBadge(category.accuracy)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Estimated Cost</span>
                      <p className="text-lg font-semibold">{formatCurrency(category.estimatedCost)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Actual Cost</span>
                      <p className="text-lg font-semibold">{formatCurrency(category.actualCost)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Variance</span>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold">{formatCurrency(category.variance)}</p>
                        {getVarianceIndicator(category.variance)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold">{category.accuracy.toFixed(1)}%</p>
                        <Progress value={category.accuracy} className="h-2 w-16" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on {category.projects} completed projects
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid gap-6">
            {mockProjectPerformance.map((project) => (
              <Card key={project.projectName}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      {project.projectName}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getAccuracyBadge(project.accuracy)}
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Estimated Value</span>
                      <p className="text-lg font-semibold">{formatCurrency(project.estimatedValue)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Actual Value</span>
                      <p className="text-lg font-semibold">{formatCurrency(project.actualValue)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Variance</span>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold">{formatCurrency(project.variance)}</p>
                        {getVarianceIndicator(project.variance)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold">{project.accuracy.toFixed(1)}%</p>
                        <Progress value={project.accuracy} className="h-2 w-16" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Completed: {new Date(project.completionDate).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Variance: {project.variancePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CostAnalyticsDashboard 