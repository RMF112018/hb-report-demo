"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  BarChart3,
  Filter,
  Search,
  Eye,
  Edit,
  FileText,
  Download,
  Target,
  Brain,
  Activity,
  Zap
} from 'lucide-react'

interface EstimateData {
  id: string
  projectId: string
  projectName: string
  client: string
  estimator: string
  status: 'draft' | 'in-progress' | 'review' | 'approved' | 'submitted' | 'awarded' | 'lost'
  phase: string
  dateCreated: string
  lastModified: string
  dueDate: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  totalEstimatedValue: number
  actualCost?: number | null
  confidence: number
  accuracy?: number | null
  grossSF: number
  costPerSF: number
  trades: {
    name: string
    estimatedCost: number
    status: 'pending' | 'in-progress' | 'complete'
  }[]
  milestones: {
    name: string
    status: 'pending' | 'in-progress' | 'complete'
    completedDate?: string
    dueDate?: string
  }[]
  riskFactors: string[]
  contingency: number
  overhead: number
  profit: number
  lossReason?: string
}

interface ProjectData {
  id: string
  project_name: string
  project_stage_name: string
  active: boolean
  client_name?: string
  project_value?: number
  start_date?: string
  completion_date?: string
}

interface SummaryStats {
  totalEstimates: number
  activeEstimates: number
  completedEstimates: number
  totalEstimateValue: number
  averageProjectValue: number
  winRate: number
  averageAccuracy: number
  avgTimeToComplete: number
  projectsInPipeline: number
  estimatorWorkload: number
  pendingReviews: number
  urgentDeadlines: number
}

interface ProjectEstimateOverviewProps {
  estimatingData?: EstimateData[]
  projectsData?: ProjectData[]
  summaryStats?: SummaryStats
  userRole?: string
  viewMode?: 'overview' | 'projects'
}

// Default mock data
const defaultEstimatingData: EstimateData[] = [
  {
    id: 'est-001',
    projectId: '2525841',
    projectName: 'Miami Commercial Tower',
    client: 'Meridian Development',
    estimator: 'John Smith',
    status: 'in-progress',
    phase: 'Bidding',
    dateCreated: '2024-01-15',
    lastModified: '2024-01-22',
    dueDate: '2024-02-15',
    priority: 'high',
    totalEstimatedValue: 250000000,
    actualCost: null,
    confidence: 85,
    accuracy: null,
    grossSF: 500000,
    costPerSF: 500,
    trades: [
      { name: 'Structural', estimatedCost: 45000000, status: 'complete' },
      { name: 'Mechanical', estimatedCost: 35000000, status: 'in-progress' },
      { name: 'Electrical', estimatedCost: 28000000, status: 'pending' },
      { name: 'Plumbing', estimatedCost: 22000000, status: 'pending' },
      { name: 'Fire Protection', estimatedCost: 15000000, status: 'pending' }
    ],
    milestones: [
      { name: 'Initial Estimate', status: 'complete', completedDate: '2024-01-20' },
      { name: 'Trade Pricing', status: 'in-progress', dueDate: '2024-02-10' },
      { name: 'Final Review', status: 'pending', dueDate: '2024-02-15' }
    ],
    riskFactors: ['Weather delays', 'Material price volatility', 'Permit timeline uncertainty'],
    contingency: 12500000,
    overhead: 15000000,
    profit: 18750000
  },
  {
    id: 'est-002',
    projectId: '2525840',
    projectName: 'Palm Beach Luxury Estate',
    client: 'Private Owner',
    estimator: 'Sarah Johnson',
    status: 'review',
    phase: 'Pre-Construction',
    dateCreated: '2024-01-10',
    lastModified: '2024-01-25',
    dueDate: '2024-02-05',
    priority: 'medium',
    totalEstimatedValue: 75000000,
    actualCost: null,
    confidence: 92,
    accuracy: null,
    grossSF: 25000,
    costPerSF: 3000,
    trades: [
      { name: 'General Construction', estimatedCost: 35000000, status: 'complete' },
      { name: 'Finishes', estimatedCost: 25000000, status: 'complete' },
      { name: 'Landscaping', estimatedCost: 8000000, status: 'in-progress' }
    ],
    milestones: [
      { name: 'Conceptual Estimate', status: 'complete', completedDate: '2024-01-15' },
      { name: 'Detailed Takeoff', status: 'complete', completedDate: '2024-01-22' },
      { name: 'Final Approval', status: 'in-progress', dueDate: '2024-02-05' }
    ],
    riskFactors: ['High-end finishes availability', 'Site access challenges'],
    contingency: 3750000,
    overhead: 4500000,
    profit: 5625000
  }
]

const defaultSummaryStats: SummaryStats = {
  totalEstimates: 2,
  activeEstimates: 2,
  completedEstimates: 0,
  totalEstimateValue: 325000000,
  averageProjectValue: 162500000,
  winRate: 85,
  averageAccuracy: 89,
  avgTimeToComplete: 21,
  projectsInPipeline: 8,
  estimatorWorkload: 75,
  pendingReviews: 1,
  urgentDeadlines: 1
}

export function ProjectEstimateOverview({
  estimatingData = defaultEstimatingData,
  projectsData = [],
  summaryStats = defaultSummaryStats,
  userRole = 'estimator',
  viewMode = 'overview'
}: ProjectEstimateOverviewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [estimatorFilter, setEstimatorFilter] = useState('all')

  // Get unique estimators for filter
  const uniqueEstimators = useMemo(() => {
    const estimators = [...new Set(estimatingData.map(est => est.estimator))]
    return estimators.filter(Boolean)
  }, [estimatingData])

  // Filter estimates based on search and filters
  const filteredEstimates = useMemo(() => {
    return estimatingData.filter(estimate => {
      const matchesSearch = estimate.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           estimate.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           estimate.estimator.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || estimate.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || estimate.priority === priorityFilter
      const matchesEstimator = estimatorFilter === 'all' || estimate.estimator === estimatorFilter

      return matchesSearch && matchesStatus && matchesPriority && matchesEstimator
    })
  }, [estimatingData, searchTerm, statusFilter, priorityFilter, estimatorFilter])

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toLocaleString()}`
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { variant: 'secondary' as const, label: 'Draft' },
      'in-progress': { variant: 'default' as const, label: 'In Progress' },
      'review': { variant: 'secondary' as const, label: 'Under Review' },
      'approved': { variant: 'default' as const, label: 'Approved' },
      'submitted': { variant: 'default' as const, label: 'Submitted' },
      'awarded': { variant: 'default' as const, label: 'Awarded' },
      'lost': { variant: 'destructive' as const, label: 'Lost' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'low': { variant: 'outline' as const, label: 'Low', color: 'text-green-600' },
      'medium': { variant: 'secondary' as const, label: 'Medium', color: 'text-yellow-600' },
      'high': { variant: 'default' as const, label: 'High', color: 'text-orange-600' },
      'urgent': { variant: 'destructive' as const, label: 'Urgent', color: 'text-red-600' }
    }

    const config = priorityConfig[priority as keyof typeof priorityConfig] || { variant: 'outline' as const, label: priority, color: '' }
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>
  }

  // Get completion percentage for milestones
  const getMilestoneProgress = (milestones: EstimateData['milestones']) => {
    const completed = milestones.filter(m => m.status === 'complete').length
    return (completed / milestones.length) * 100
  }

  // Recent activity and insights
  const recentActivity = useMemo(() => {
    return estimatingData
      .filter(est => {
        const daysSinceModified = (new Date().getTime() - new Date(est.lastModified).getTime()) / (1000 * 60 * 60 * 24)
        return daysSinceModified <= 7
      })
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .slice(0, 5)
  }, [estimatingData])

  if (viewMode === 'projects') {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Project Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="awarded">Awarded</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={estimatorFilter} onValueChange={setEstimatorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by estimator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Estimators</SelectItem>
                  {uniqueEstimators.map(estimator => (
                    <SelectItem key={estimator} value={estimator}>{estimator}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEstimates.map((estimate) => (
            <Card key={estimate.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {estimate.projectName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{estimate.client}</p>
                  </div>
                  {getPriorityBadge(estimate.priority)}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(estimate.status)}
                  <Badge variant="outline" className="text-xs">
                    {estimate.confidence}% confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Value:</span>
                    <p className="font-semibold text-lg">{formatCurrency(estimate.totalEstimatedValue)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Cost/SF:</span>
                    <p className="font-semibold">${estimate.costPerSF.toFixed(0)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Estimator:</span>
                    <p className="font-medium">{estimate.estimator}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Due Date:</span>
                    <p className="font-medium">{new Date(estimate.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Progress</span>
                    <span>{getMilestoneProgress(estimate.milestones).toFixed(0)}%</span>
                  </div>
                  <Progress value={getMilestoneProgress(estimate.milestones)} className="h-2" />
                </div>

                {/* Trade Status */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Trade Status</span>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    {estimate.trades.slice(0, 6).map((trade, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          trade.status === 'complete' ? 'bg-green-500' :
                          trade.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                        }`} />
                        <span className="truncate">{trade.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEstimates.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Estimates Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || estimatorFilter !== 'all'
                  ? "Try adjusting your filters to see more results."
                  : "No estimates have been created yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Estimates</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{summaryStats.activeEstimates}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Win Rate</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{summaryStats.winRate.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Pending Reviews</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{summaryStats.pendingReviews}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Urgent Items</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{summaryStats.urgentDeadlines}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((estimate) => (
                <div key={estimate.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{estimate.projectName}</h4>
                      {getStatusBadge(estimate.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Updated by {estimate.estimator} • {new Date(estimate.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(estimate.totalEstimatedValue)}</p>
                    <p className="text-sm text-muted-foreground">{estimate.confidence}% confidence</p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-muted-foreground py-8">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Intelligence */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                HBI Intelligence Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">Market Trend Alert</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Steel prices trending 8% higher than last quarter. Consider adjusting estimates accordingly.
                </p>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm">Accuracy Insight</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your estimates are 5% more accurate than team average this quarter.
                </p>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-sm">Timeline Optimization</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  3 estimates approaching deadlines require immediate attention.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                New Estimate
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Team Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProjectEstimateOverview 