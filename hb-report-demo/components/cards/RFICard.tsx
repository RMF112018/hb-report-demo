"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MessageSquare, Clock, AlertCircle, DollarSign, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { DashboardCard } from "@/types/dashboard"
import { useState } from "react"

interface RFICardProps {
  card: DashboardCard
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

const COLORS = [
  'hsl(var(--chart-1))', 
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))', 
  'hsl(var(--chart-5))'
]

export function RFICard({ card, config, span, isCompact, userRole }: RFICardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Mock data based on role
  const getRoleBasedData = () => {
    const role = userRole || 'project-manager'
    
    const baseData = {
      'project-manager': {
        totalRFIs: 24,
        pendingRFIs: 6,
        resolvedRFIs: 18,
        avgResolutionDays: 8.3,
        targetResolutionDays: 7.0,
        costImpact: 245000,
        scheduleImpact: 12,
        performanceScore: 82.5,
        overdue: 2,
        resolutionTrend: [
          { month: 'Jan', submitted: 8, resolved: 6, avgDays: 9.2 },
          { month: 'Feb', submitted: 5, resolved: 7, avgDays: 8.8 },
          { month: 'Mar', submitted: 7, resolved: 5, avgDays: 7.9 },
          { month: 'Apr', submitted: 4, resolved: 6, avgDays: 8.1 },
          { month: 'May', submitted: 6, resolved: 4, avgDays: 8.5 }
        ],
        categoryBreakdown: [
          { category: 'Design Clarification', count: 9, avgResolution: 7.2, costImpact: 125000 },
          { category: 'Material Specs', count: 8, avgResolution: 8.9, costImpact: 78000 },
          { category: 'Field Conditions', count: 4, avgResolution: 9.8, costImpact: 32000 },
          { category: 'Code Compliance', count: 3, avgResolution: 6.5, costImpact: 10000 }
        ],
        pendingDetails: [
          { rfiNumber: 'RFI-024', subject: 'HVAC Control Sequence', priority: 'high', daysPending: 12, costImpact: 45000 },
          { rfiNumber: 'RFI-023', subject: 'Exterior Wall Detail', priority: 'medium', daysPending: 8, costImpact: 28000 },
          { rfiNumber: 'RFI-022', subject: 'Fire Protection Layout', priority: 'high', daysPending: 6, costImpact: 15000 },
          { rfiNumber: 'RFI-021', subject: 'Flooring Transition', priority: 'low', daysPending: 4, costImpact: 5000 },
          { rfiNumber: 'RFI-020', subject: 'Lighting Control Panel', priority: 'medium', daysPending: 3, costImpact: 8000 },
          { rfiNumber: 'RFI-019', subject: 'Plumbing Fixture Schedule', priority: 'low', daysPending: 2, costImpact: 2000 }
        ]
      },
      'project-executive': {
        totalRFIs: 186,
        pendingRFIs: 38,
        resolvedRFIs: 148,
        avgResolutionDays: 9.7,
        targetResolutionDays: 8.0,
        costImpact: 1850000,
        scheduleImpact: 89,
        performanceScore: 76.3,
        overdue: 15,
        resolutionTrend: [
          { month: 'Jan', submitted: 45, resolved: 38, avgDays: 10.2 },
          { month: 'Feb', submitted: 32, resolved: 41, avgDays: 9.8 },
          { month: 'Mar', submitted: 38, resolved: 35, avgDays: 9.3 },
          { month: 'Apr', submitted: 42, resolved: 39, avgDays: 9.5 },
          { month: 'May', submitted: 29, resolved: 33, avgDays: 10.1 }
        ],
        categoryBreakdown: [
          { category: 'Design Clarification', count: 68, avgResolution: 8.9, costImpact: 890000 },
          { category: 'Material Specs', count: 52, avgResolution: 10.2, costImpact: 625000 },
          { category: 'Field Conditions', count: 38, avgResolution: 11.1, costImpact: 245000 },
          { category: 'Code Compliance', count: 28, avgResolution: 7.8, costImpact: 90000 }
        ],
        projectBreakdown: [
          { project: 'Medical Center East', rfis: 42, pending: 8, avgResolution: 8.2, costImpact: 450000 },
          { project: 'Tech Campus Phase 2', rfis: 35, pending: 7, avgResolution: 9.8, costImpact: 380000 },
          { project: 'Marina Bay Plaza', rfis: 28, pending: 6, avgResolution: 10.5, costImpact: 320000 },
          { project: 'Tropical World', rfis: 31, pending: 5, avgResolution: 9.1, costImpact: 275000 },
          { project: 'Grandview Heights', rfis: 26, pending: 7, avgResolution: 11.2, costImpact: 235000 },
          { project: 'Riverside Plaza', rfis: 24, pending: 5, avgResolution: 8.9, costImpact: 190000 }
        ]
      },
      'executive': {
        totalRFIs: 524,
        pendingRFIs: 89,
        resolvedRFIs: 435,
        avgResolutionDays: 10.8,
        targetResolutionDays: 8.5,
        costImpact: 5240000,
        scheduleImpact: 287,
        performanceScore: 71.2,
        overdue: 28,
        resolutionTrend: [
          { month: 'Jan', submitted: 125, resolved: 98, avgDays: 11.5 },
          { month: 'Feb', submitted: 89, resolved: 115, avgDays: 10.9 },
          { month: 'Mar', submitted: 108, resolved: 92, avgDays: 10.2 },
          { month: 'Apr', submitted: 95, resolved: 102, avgDays: 10.6 },
          { month: 'May', submitted: 107, resolved: 98, avgDays: 11.2 }
        ],
        categoryBreakdown: [
          { category: 'Design Clarification', count: 195, avgResolution: 10.2, costImpact: 2450000 },
          { category: 'Material Specs', count: 158, avgResolution: 11.8, costImpact: 1680000 },
          { category: 'Field Conditions', count: 102, avgResolution: 12.1, costImpact: 845000 },
          { category: 'Code Compliance', count: 69, avgResolution: 8.9, costImpact: 265000 }
        ]
      }
    }

    return baseData[role as keyof typeof baseData]
  }

  const data = getRoleBasedData()
  const closureRate = (data.resolvedRFIs / data.totalRFIs) * 100
  const performanceGrade = data.performanceScore >= 85 ? 'A' : data.performanceScore >= 75 ? 'B' : data.performanceScore >= 65 ? 'C' : 'D'
  const gradeColor = data.performanceScore >= 85 ? 'text-green-600 dark:text-green-400' : data.performanceScore >= 75 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'

  const statusData = [
    { name: 'Resolved', value: data.resolvedRFIs, color: 'hsl(var(--chart-1))' },
    { name: 'Pending', value: data.pendingRFIs, color: 'hsl(var(--chart-3))' },
    { name: 'Overdue', value: data.overdue, color: 'hsl(var(--chart-4))' }
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200 dark:border-red-800">High</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:border-yellow-800">Medium</Badge>
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:border-green-800">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getDaysBadge = (days: number) => {
    if (days <= 5) return <Badge className="bg-green-100 text-green-800">On Track</Badge>
    if (days <= 10) return <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>
    return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
  }

  const role = userRole || 'project-manager'

  return (
    <div 
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 hover:shadow-xl transition-all duration-300 h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-orange-600" />
              {card.title}
            </div>
            <Badge className={`${gradeColor} bg-card border-orange-200`}>
              Grade {performanceGrade}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 lg:gap-2">
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-white/60 dark:bg-black/60 rounded-lg border border-orange-100">
              <div className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-orange-600">{data.totalRFIs}</div>
              <div className="text-xs text-muted-foreground">Total RFIs</div>
              <div className="text-xs text-orange-600">{data.pendingRFIs} pending</div>
            </div>
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-white/60 dark:bg-black/60 rounded-lg border border-orange-100">
              <div className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-orange-600">{data.avgResolutionDays}</div>
              <div className="text-xs text-muted-foreground">Avg Resolution</div>
              <div className="text-xs text-orange-600">Target: {data.targetResolutionDays} days</div>
            </div>
          </div>

          {/* Status Chart */}
          <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-orange-100 p-1.5 sm:p-2 lg:p-2.5">
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
          <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-orange-100 p-1.5 sm:p-2 lg:p-2.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Performance Score</span>
              <div className="text-right">
                <div className={`text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium ${gradeColor}`}>{data.performanceScore.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">{closureRate.toFixed(1)}% closure rate</div>
              </div>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-orange-100 p-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                Cost Impact
              </div>
              <div className="font-semibold text-orange-600">{formatCurrency(data.costImpact)}</div>
            </div>
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-orange-100 p-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Schedule Impact
              </div>
              <div className="font-semibold text-orange-600">{data.scheduleImpact} days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hover Drill-down */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 rounded-lg shadow-2xl z-10 overflow-auto">
          <div className="p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 space-y-4">
            <div className="flex items-center justify-between border-b border-orange-200 pb-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-orange-600" />
                RFI Analytics
              </h3>
              <Badge className={`${gradeColor} bg-card border-orange-200`}>
                Grade {performanceGrade}
              </Badge>
            </div>

            {/* Resolution Trend */}
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-orange-100 p-1.5 sm:p-2 lg:p-2.5">
              <h4 className="font-semibold mb-2 text-foreground">Resolution Trend</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.resolutionTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }} 
                    />
                    <Line type="monotone" dataKey="submitted" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Submitted" />
                    <Line type="monotone" dataKey="resolved" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Resolved" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-orange-100 p-1.5 sm:p-2 lg:p-2.5">
              <h4 className="font-semibold mb-2 text-foreground">Category Performance</h4>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.categoryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="category" fontSize={9} stroke="hsl(var(--muted-foreground))" />
                    <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }} 
                    />
                    <Bar dataKey="count" fill="hsl(var(--chart-3))" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Role-specific details */}
            {role === 'project-executive' && 'projectBreakdown' in data && (
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-orange-100 p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-2 text-foreground">Project Performance</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {data.projectBreakdown.map((project: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded bg-white/40 dark:bg-black/40 border border-orange-100">
                      <div>
                        <div className="text-sm font-medium text-foreground">{project.project}</div>
                        <div className="text-xs text-muted-foreground">{project.rfis} RFIs, {project.pending} pending</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-orange-600">{project.avgResolution} days</div>
                        <div className="text-xs text-muted-foreground">{formatCurrency(project.costImpact)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {role === 'project-manager' && (
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-orange-100 p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-2 text-foreground">Pending RFIs</h4>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {data.pendingDetails.map((rfi: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded bg-white/40 dark:bg-black/40 border border-orange-100">
                      <div>
                        <div className="text-sm font-medium text-foreground">{rfi.rfiNumber}</div>
                        <div className="text-xs text-muted-foreground">{rfi.subject}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(rfi.priority)}
                        {getDaysBadge(rfi.daysPending)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-orange-100 p-2 text-center">
                <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-orange-600">{data.overdue}</div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-orange-100 p-2 text-center">
                <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-orange-600">{closureRate.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Closure Rate</div>
              </div>
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-orange-100 p-2 text-center">
                <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-orange-600">{data.categoryBreakdown.length}</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 