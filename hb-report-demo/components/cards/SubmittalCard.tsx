"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp, XCircle, Calendar } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { DashboardCard } from "@/types/dashboard"
import { useState } from "react"

interface SubmittalCardProps {
  card: DashboardCard
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-2))', 'hsl(var(--chart-5))']

export function SubmittalCard({ card, config, span, isCompact, userRole }: SubmittalCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Mock data based on role
  const getRoleBasedData = () => {
    const role = userRole || 'project-manager'
    
    const baseData = {
      'project-manager': {
        totalSubmittals: 42,
        approvedSubmittals: 35,
        pendingSubmittals: 5,
        rejectedSubmittals: 2,
        avgReviewDays: 12.8,
        targetReviewDays: 14.0,
        scheduleCompliance: 87.2,
        performanceScore: 89.5,
        overdue: 3,
        reviewTrend: [
          { month: 'Jan', submitted: 12, approved: 10, avgDays: 13.2 },
          { month: 'Feb', submitted: 8, approved: 9, avgDays: 11.8 },
          { month: 'Mar', submitted: 10, approved: 8, avgDays: 12.1 },
          { month: 'Apr', submitted: 7, approved: 8, avgDays: 13.5 },
          { month: 'May', submitted: 5, approved: 6, avgDays: 12.3 }
        ],
        categoryBreakdown: [
          { category: 'Shop Drawings', count: 18, avgReview: 14.2, approved: 16, pending: 1, rejected: 1 },
          { category: 'Material Samples', count: 12, avgReview: 10.5, approved: 11, pending: 1, rejected: 0 },
          { category: 'Product Data', count: 8, avgReview: 8.9, approved: 6, pending: 2, rejected: 0 },
          { category: 'Test Reports', count: 4, avgReview: 15.6, approved: 2, pending: 1, rejected: 1 }
        ],
        pendingDetails: [
          { submittalNumber: 'SUB-042', description: 'HVAC Unit Shop Drawings', priority: 'high', daysPending: 18, reviewer: 'Architect', dueDate: '2025-01-20' },
          { submittalNumber: 'SUB-041', description: 'Exterior Cladding Samples', priority: 'medium', daysPending: 12, reviewer: 'Owner', dueDate: '2025-01-22' },
          { submittalNumber: 'SUB-040', description: 'Fire Safety Product Data', priority: 'high', daysPending: 8, reviewer: 'Engineer', dueDate: '2025-01-18' },
          { submittalNumber: 'SUB-039', description: 'Flooring Material Samples', priority: 'low', daysPending: 6, reviewer: 'Architect', dueDate: '2025-01-25' },
          { submittalNumber: 'SUB-038', description: 'Steel Connection Details', priority: 'medium', daysPending: 4, reviewer: 'Engineer', dueDate: '2025-01-24' }
        ]
      },
      'project-executive': {
        totalSubmittals: 248,
        approvedSubmittals: 195,
        pendingSubmittals: 38,
        rejectedSubmittals: 15,
        avgReviewDays: 14.6,
        targetReviewDays: 15.0,
        scheduleCompliance: 82.8,
        performanceScore: 84.3,
        overdue: 18,
        reviewTrend: [
          { month: 'Jan', submitted: 58, approved: 45, avgDays: 15.2 },
          { month: 'Feb', submitted: 42, approved: 52, avgDays: 14.1 },
          { month: 'Mar', submitted: 48, approved: 44, avgDays: 13.8 },
          { month: 'Apr', submitted: 52, approved: 49, avgDays: 14.9 },
          { month: 'May', submitted: 48, approved: 47, avgDays: 15.3 }
        ],
        categoryBreakdown: [
          { category: 'Shop Drawings', count: 98, avgReview: 16.2, approved: 78, pending: 15, rejected: 5 },
          { category: 'Material Samples', count: 72, avgReview: 12.8, approved: 58, pending: 12, rejected: 2 },
          { category: 'Product Data', count: 52, avgReview: 11.5, approved: 42, pending: 8, rejected: 2 },
          { category: 'Test Reports', count: 26, avgReview: 18.9, approved: 17, pending: 3, rejected: 6 }
        ],
        projectBreakdown: [
          { project: 'Medical Center East', submittals: 58, pending: 12, avgReview: 13.2, compliance: 89.5 },
          { project: 'Tech Campus Phase 2', submittals: 45, pending: 8, avgReview: 15.8, compliance: 82.1 },
          { project: 'Marina Bay Plaza', submittals: 38, pending: 6, avgReview: 16.2, compliance: 78.9 },
          { project: 'Tropical World', submittals: 42, pending: 4, avgReview: 12.9, compliance: 88.2 },
          { project: 'Grandview Heights', submittals: 35, pending: 5, avgReview: 17.1, compliance: 75.8 },
          { project: 'Riverside Plaza', submittals: 30, pending: 3, avgReview: 13.8, compliance: 85.4 }
        ]
      },
      'executive': {
        totalSubmittals: 684,
        approvedSubmittals: 512,
        pendingSubmittals: 118,
        rejectedSubmittals: 54,
        avgReviewDays: 16.2,
        targetReviewDays: 16.0,
        scheduleCompliance: 78.4,
        performanceScore: 79.8,
        overdue: 42,
        reviewTrend: [
          { month: 'Jan', submitted: 158, approved: 125, avgDays: 17.1 },
          { month: 'Feb', submitted: 128, approved: 142, avgDays: 15.9 },
          { month: 'Mar', submitted: 142, approved: 138, avgDays: 15.2 },
          { month: 'Apr', submitted: 135, approved: 129, avgDays: 16.8 },
          { month: 'May', submitted: 121, approved: 118, avgDays: 17.3 }
        ],
        categoryBreakdown: [
          { category: 'Shop Drawings', count: 268, avgReview: 18.2, approved: 198, pending: 48, rejected: 22 },
          { category: 'Material Samples', count: 195, avgReview: 14.8, approved: 152, pending: 32, rejected: 11 },
          { category: 'Product Data', count: 142, avgReview: 13.5, approved: 118, pending: 18, rejected: 6 },
          { category: 'Test Reports', count: 79, avgReview: 21.2, approved: 44, pending: 20, rejected: 15 }
        ]
      }
    }

    return baseData[role as keyof typeof baseData]
  }

  const data = getRoleBasedData()
  const approvalRate = (data.approvedSubmittals / data.totalSubmittals) * 100
  const performanceGrade = data.performanceScore >= 90 ? 'A' : data.performanceScore >= 80 ? 'B' : data.performanceScore >= 70 ? 'C' : 'D'
  const gradeColor = data.performanceScore >= 90 ? 'text-green-600 dark:text-green-400' : data.performanceScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : data.performanceScore >= 70 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'

  const statusData = [
    { name: 'Approved', value: data.approvedSubmittals, color: 'hsl(var(--chart-1))' },
    { name: 'Pending', value: data.pendingSubmittals, color: 'hsl(var(--chart-3))' },
    { name: 'Rejected', value: data.rejectedSubmittals, color: 'hsl(var(--chart-4))' }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200 dark:border-red-800">High Priority</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:border-yellow-800">Medium</Badge>
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:border-green-800">Low</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getReviewerBadge = (reviewer: string) => {
    const colors = {
      'Architect': 'bg-blue-100 text-blue-800',
      'Engineer': 'bg-purple-100 text-purple-800',
      'Owner': 'bg-orange-100 text-orange-800'
    }
    return <Badge className={colors[reviewer as keyof typeof colors] || 'bg-muted text-foreground'}>{reviewer}</Badge>
  }

  const getDaysBadge = (days: number) => {
    if (days <= 7) return <Badge className="bg-green-100 text-green-800">On Track</Badge>
    if (days <= 14) return <Badge className="bg-yellow-100 text-yellow-800">Watch</Badge>
    return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
  }

  const role = userRole || 'project-manager'

  return (
    <div 
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800 hover:shadow-xl transition-all duration-300 h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              {card.title}
            </div>
            <Badge className={`${gradeColor} bg-card border-emerald-200 dark:border-emerald-800`}>
              Grade {performanceGrade}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white/60 dark:bg-black/60 rounded-lg border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{data.totalSubmittals}</div>
              <div className="text-xs text-muted-foreground">Total Submittals</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">{data.pendingSubmittals} pending</div>
            </div>
            <div className="text-center p-3 bg-white/60 dark:bg-black/60 rounded-lg border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{data.avgReviewDays}</div>
              <div className="text-xs text-muted-foreground">Avg Review Time</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">Target: {data.targetReviewDays} days</div>
            </div>
          </div>

          {/* Status Chart */}
          <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-emerald-100 p-3">
            <h4 className="font-semibold mb-2 text-foreground">Status Overview</h4>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Score */}
          <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-emerald-100 p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">Schedule Compliance</span>
              <div className="text-right">
                <div className={`text-lg font-bold ${gradeColor}`}>{data.scheduleCompliance.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">{approvalRate.toFixed(1)}% approval rate</div>
              </div>
            </div>
            <Progress value={data.scheduleCompliance} className="h-2" />
          </div>

          {/* Review Time vs Target */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-emerald-100 p-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Avg Review Time
              </div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400">{data.avgReviewDays} days</div>
            </div>
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-emerald-100 p-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                Overdue
              </div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400">{data.overdue}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hover Drill-down */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg shadow-2xl z-10 overflow-auto">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Submittal Analytics
              </h3>
              <Badge className={`${gradeColor} bg-card border-emerald-200 dark:border-emerald-800`}>
                Grade {performanceGrade}
              </Badge>
            </div>

            {/* Review Trend */}
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-emerald-100 p-3">
              <h4 className="font-semibold mb-2 text-foreground">Review Trend</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.reviewTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-1) / 0.3)" />
                    <XAxis dataKey="month" fontSize={10} stroke="#059669" />
                    <YAxis fontSize={10} stroke="#059669" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid hsl(var(--chart-1) / 0.3)',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }} 
                    />
                    <Line type="monotone" dataKey="submitted" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Submitted" />
                    <Line type="monotone" dataKey="approved" stroke="#059669" strokeWidth={2} name="Approved" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-emerald-100 p-3">
              <h4 className="font-semibold mb-2 text-foreground">Category Performance</h4>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.categoryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-1) / 0.3)" />
                    <XAxis dataKey="category" fontSize={9} stroke="#059669" />
                    <YAxis fontSize={10} stroke="#059669" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid hsl(var(--chart-1) / 0.3)',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }} 
                    />
                    <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Role-specific details */}
            {role === 'project-executive' && 'projectBreakdown' in data && (
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-emerald-100 p-3">
                <h4 className="font-semibold mb-2 text-foreground">Project Performance</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {data.projectBreakdown.map((project: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded bg-white/40 dark:bg-black/40 border border-emerald-100">
                      <div>
                        <div className="text-sm font-medium text-foreground">{project.project}</div>
                        <div className="text-xs text-muted-foreground">{project.submittals} submittals, {project.pending} pending</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{project.avgReview} days</div>
                        <div className="text-xs text-muted-foreground">{project.compliance.toFixed(1)}% compliance</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {role === 'project-manager' && (
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-emerald-100 p-3">
                <h4 className="font-semibold mb-2 text-foreground">Pending Submittals</h4>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {data.pendingDetails.map((submittal: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded bg-white/40 dark:bg-black/40 border border-emerald-100">
                      <div>
                        <div className="text-sm font-medium text-foreground">{submittal.submittalNumber}</div>
                        <div className="text-xs text-muted-foreground">{submittal.description}</div>
                        <div className="text-xs text-muted-foreground">Due: {submittal.dueDate}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getStatusBadge(submittal.priority)}
                        {getReviewerBadge(submittal.reviewer)}
                        {getDaysBadge(submittal.daysPending)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-emerald-100 p-2 text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{data.rejectedSubmittals}</div>
                <div className="text-xs text-muted-foreground">Rejected</div>
              </div>
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-emerald-100 p-2 text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{approvalRate.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Approval Rate</div>
              </div>
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-emerald-100 p-2 text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{data.categoryBreakdown.length}</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 