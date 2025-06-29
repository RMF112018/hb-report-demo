"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  FileText,
  Calendar,
  Target
} from "lucide-react"

interface Report {
  id: string
  name: string
  type: "financial-review" | "monthly-progress" | "monthly-owner"
  projectId: string
  projectName: string
  status: "draft" | "submitted" | "approved" | "rejected" | "published"
  creatorId: string
  creatorName: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
  distributedAt?: string
  sectionCount: number
  pageCount: number
  size: string
  version: number
  tags: string[]
}

interface ReportAnalyticsProps {
  reports: Report[]
}

interface AnalyticsData {
  totalReports: number
  reportsByStatus: Record<string, number>
  reportsByType: Record<string, number>
  averageProcessingTime: number
  approvalRate: number
  monthlyTrends: Array<{
    month: string
    created: number
    approved: number
    rejected: number
  }>
  topProjects: Array<{
    projectName: string
    reportCount: number
    approvalRate: number
  }>
  userActivity: Array<{
    userName: string
    reportsCreated: number
    avgProcessingTime: number
  }>
  performanceMetrics: {
    onTimeDelivery: number
    avgRevisions: number
    qualityScore: number
  }
}

export function ReportAnalytics({ reports }: ReportAnalyticsProps) {
  const analyticsData: AnalyticsData = useMemo(() => {
    const now = new Date()
    const totalReports = reports.length

    // Reports by status
    const reportsByStatus = reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Reports by type
    const reportsByType = reports.reduce((acc, report) => {
      const typeLabels = {
        "financial-review": "Financial Review",
        "monthly-progress": "Monthly Progress",
        "monthly-owner": "Monthly Owner"
      }
      const label = typeLabels[report.type] || report.type
      acc[label] = (acc[label] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Calculate approval rate
    const processedReports = reports.filter(r => 
      r.status === "approved" || r.status === "rejected" || r.status === "published"
    )
    const approvedReports = reports.filter(r => 
      r.status === "approved" || r.status === "published"
    )
    const approvalRate = processedReports.length > 0 
      ? (approvedReports.length / processedReports.length) * 100 
      : 0

    // Calculate average processing time (mock calculation)
    const averageProcessingTime = reports
      .filter(r => r.approvedAt || r.rejectedAt)
      .reduce((total, report) => {
        const created = new Date(report.createdAt)
        const processed = new Date(report.approvedAt || report.rejectedAt || report.createdAt)
        const diffDays = Math.ceil((processed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
        return total + diffDays
      }, 0) / Math.max(processedReports.length, 1)

    // Monthly trends (last 6 months)
    const monthlyTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toISOString().slice(0, 7)
      
      const monthReports = reports.filter(r => r.createdAt.startsWith(monthKey))
      
      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        created: monthReports.length,
        approved: monthReports.filter(r => r.status === 'approved' || r.status === 'published').length,
        rejected: monthReports.filter(r => r.status === 'rejected').length
      })
    }

    // Top projects by report count
    const projectStats = reports.reduce((acc, report) => {
      if (!acc[report.projectName]) {
        acc[report.projectName] = { total: 0, approved: 0 }
      }
      acc[report.projectName].total++
      if (report.status === 'approved' || report.status === 'published') {
        acc[report.projectName].approved++
      }
      return acc
    }, {} as Record<string, { total: number; approved: number }>)

    const topProjects = Object.entries(projectStats)
      .map(([projectName, stats]) => ({
        projectName,
        reportCount: stats.total,
        approvalRate: stats.total > 0 ? (stats.approved / stats.total) * 100 : 0
      }))
      .sort((a, b) => b.reportCount - a.reportCount)
      .slice(0, 5)

    // User activity
    const userStats = reports.reduce((acc, report) => {
      if (!acc[report.creatorName]) {
        acc[report.creatorName] = { created: 0, totalProcessingTime: 0 }
      }
      acc[report.creatorName].created++
      
      // Mock processing time calculation
      if (report.approvedAt || report.rejectedAt) {
        const created = new Date(report.createdAt)
        const processed = new Date(report.approvedAt || report.rejectedAt || report.createdAt)
        const diffDays = Math.ceil((processed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
        acc[report.creatorName].totalProcessingTime += diffDays
      }
      return acc
    }, {} as Record<string, { created: number; totalProcessingTime: number }>)

    const userActivity = Object.entries(userStats)
      .map(([userName, stats]) => ({
        userName,
        reportsCreated: stats.created,
        avgProcessingTime: stats.created > 0 ? stats.totalProcessingTime / stats.created : 0
      }))
      .sort((a, b) => b.reportsCreated - a.reportsCreated)
      .slice(0, 5)

    // Performance metrics (calculated/mock values)
    const onTimeReports = reports
      .filter(r => r.dueDate)
      .filter(r => {
        if (!r.approvedAt && !r.rejectedAt) return false
        const dueDate = new Date(r.dueDate!)
        const completedDate = new Date(r.approvedAt || r.rejectedAt!)
        return completedDate <= dueDate
      })
    
    const reportsWithDueDates = reports.filter(r => r.dueDate && (r.approvedAt || r.rejectedAt))
    const onTimeDelivery = reportsWithDueDates.length > 0 
      ? (onTimeReports.length / reportsWithDueDates.length) * 100 
      : 95 // Mock value

    const performanceMetrics = {
      onTimeDelivery,
      avgRevisions: 1.2, // Mock value
      qualityScore: 87 // Mock value
    }

    return {
      totalReports,
      reportsByStatus,
      reportsByType,
      averageProcessingTime,
      approvalRate,
      monthlyTrends,
      topProjects,
      userActivity,
      performanceMetrics
    }
  }, [reports])

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-slate-500 dark:bg-slate-400",
      submitted: "bg-amber-500 dark:bg-amber-400",
      approved: "bg-emerald-500 dark:bg-emerald-400",
      rejected: "bg-rose-500 dark:bg-rose-400",
      published: "bg-blue-500 dark:bg-blue-400"
    }
    return colors[status as keyof typeof colors] || "bg-slate-500 dark:bg-slate-400"
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: "Excellent", color: "text-emerald-600 dark:text-emerald-400" }
    if (score >= 75) return { level: "Good", color: "text-blue-600 dark:text-blue-400" }
    if (score >= 60) return { level: "Fair", color: "text-amber-600 dark:text-amber-400" }
    return { level: "Needs Improvement", color: "text-rose-600 dark:text-rose-400" }
  }

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.approvalRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.averageProcessingTime.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              days to approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.performanceMetrics.onTimeDelivery.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Meeting deadlines
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Report Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Report Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analyticsData.reportsByStatus).map(([status, count]) => (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                          <span className="text-sm capitalize">{status}</span>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                      <Progress 
                        value={(count / analyticsData.totalReports) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Report Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Report Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analyticsData.reportsByType).map(([type, count]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{type}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                      <Progress 
                        value={(count / analyticsData.totalReports) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Report Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.monthlyTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium w-16">{trend.month}</div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                          <span>Created: {trend.created}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
                          <span>Approved: {trend.approved}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-rose-500 dark:bg-rose-400 rounded-full"></div>
                          <span>Rejected: {trend.rejected}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trend.created > 0 ? `${((trend.approved / trend.created) * 100).toFixed(0)}% approval` : 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Projects by Report Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topProjects.map((project, index) => (
                  <div key={project.projectName} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{project.projectName}</div>
                        <div className="text-sm text-muted-foreground">
                          {project.reportCount} reports
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {project.approvalRate.toFixed(0)}% approval
                      </div>
                      <Progress 
                        value={project.approvalRate} 
                        className="h-2 w-20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Report Creators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.userActivity.map((user, index) => (
                  <div key={user.userName} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-full">
                        <span className="text-sm font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{user.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.reportsCreated} reports created
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        Avg: {user.avgProcessingTime.toFixed(1)} days
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">On-Time Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {analyticsData.performanceMetrics.onTimeDelivery.toFixed(1)}%
                </div>
                <Progress value={analyticsData.performanceMetrics.onTimeDelivery} className="mb-2" />
                <p className={`text-sm ${getPerformanceLevel(analyticsData.performanceMetrics.onTimeDelivery).color}`}>
                  {getPerformanceLevel(analyticsData.performanceMetrics.onTimeDelivery).level}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Avg Revisions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {analyticsData.performanceMetrics.avgRevisions}
                </div>
                <p className="text-sm text-muted-foreground">
                  Lower is better
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quality Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {analyticsData.performanceMetrics.qualityScore}%
                </div>
                <Progress value={analyticsData.performanceMetrics.qualityScore} className="mb-2" />
                <p className={`text-sm ${getPerformanceLevel(analyticsData.performanceMetrics.qualityScore).color}`}>
                  {getPerformanceLevel(analyticsData.performanceMetrics.qualityScore).level}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900 dark:text-blue-100">
                      Approval Rate Trending Up
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      Your approval rate has improved by 12% this month, indicating better report quality.
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-emerald-900 dark:text-emerald-100">
                      Excellent On-Time Performance
                    </div>
                    <div className="text-sm text-emerald-700 dark:text-emerald-300">
                      {analyticsData.performanceMetrics.onTimeDelivery.toFixed(0)}% of reports are delivered on time, exceeding industry standards.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-amber-900 dark:text-amber-100">
                      Processing Time Opportunity
                    </div>
                    <div className="text-sm text-amber-700 dark:text-amber-300">
                      Average processing time is {analyticsData.averageProcessingTime.toFixed(1)} days. Consider streamlining workflows for faster approvals.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 