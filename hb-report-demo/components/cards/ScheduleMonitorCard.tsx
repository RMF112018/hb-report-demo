"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Target, BarChart3, Activity } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar, ComposedChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import type { DashboardCard } from "@/types/dashboard"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ScheduleMonitorCardProps {
  card: DashboardCard
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

export function ScheduleMonitorCard({ card, config, span, isCompact, userRole }: ScheduleMonitorCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Mock data based on role
  const getRoleBasedData = () => {
    const role = userRole || 'project-manager'
    
    const baseData = {
      'project-manager': {
        scheduleHealth: 82.4,
        scheduleGrade: 'B',
        totalActivities: 1847,
        criticalPath: {
          duration: 284,
          activities: 47,
          float: 0,
          health: 78.5
        },
        variance: {
          scheduleVariance: -12.3, // days behind
          schedulePerformanceIndex: 0.89,
          costScheduleIndex: 0.92
        },
        logicHealth: {
          score: 85.2,
          issues: 8,
          missingLogic: 3,
          danglingActivities: 2,
          invalidConstraints: 3
        },
        updateMetrics: {
          lastUpdate: '2024-01-15',
          frequency: 'Weekly',
          dataQuality: 91.7,
          progressUpdates: 156,
          missedUpdates: 4
        },
        delayAnalysis: {
          totalDelay: 18,
          weatherDelay: 12,
          permitDelay: 4,
          designDelay: 2,
          recoveryPlan: 'Accelerated schedule with overtime'
        },
        monthlyTrends: [
          { month: 'Sep', health: 88.2, spi: 0.94, variance: -8.1, activities: 1823, updates: 38 },
          { month: 'Oct', health: 86.7, spi: 0.91, variance: -9.7, activities: 1834, updates: 41 },
          { month: 'Nov', health: 84.9, spi: 0.89, variance: -11.2, activities: 1841, updates: 39 },
          { month: 'Dec', health: 83.1, spi: 0.88, variance: -12.8, activities: 1845, updates: 42 },
          { month: 'Jan', health: 82.4, spi: 0.89, variance: -12.3, activities: 1847, updates: 40 }
        ],
        milestones: [
          { name: 'Foundation Complete', status: 'completed', date: '2024-01-10', variance: 2 },
          { name: 'Steel Erection', status: 'in-progress', date: '2024-02-15', variance: -3 },
          { name: 'Envelope Complete', status: 'upcoming', date: '2024-04-20', variance: -5 },
          { name: 'MEP Rough-in', status: 'upcoming', date: '2024-06-15', variance: -8 }
        ],
        alerts: [
          { type: 'critical', message: 'Critical path delayed by weather - 12 days impact', category: 'Weather' },
          { type: 'warning', message: 'Steel delivery behind schedule - monitoring vendor', category: 'Procurement' },
          { type: 'info', message: 'Foundation work ahead of schedule by 2 days', category: 'Progress' }
        ],
        projectName: "Tropical World Nursery"
      },
      'project-executive': {
        scheduleHealth: 79.8,
        scheduleGrade: 'B-',
        totalProjects: 6,
        portfolioMetrics: {
          onSchedule: 2,
          slightlyBehind: 3,
          criticallyBehind: 1,
          avgVariance: -15.7,
          avgSPI: 0.85
        },
        criticalPath: {
          avgDuration: 312,
          avgFloat: 2.3,
          healthScore: 75.8
        },
        logicHealth: {
          avgScore: 81.4,
          totalIssues: 42,
          projectsWithIssues: 4
        },
        monthlyTrends: [
          { month: 'Sep', health: 83.2, avgSPI: 0.91, variance: -11.4, totalActivities: 8947, updates: 224 },
          { month: 'Oct', health: 81.8, avgSPI: 0.88, variance: -13.2, totalActivities: 9156, updates: 238 },
          { month: 'Nov', health: 80.5, avgSPI: 0.86, variance: -14.8, totalActivities: 9298, updates: 241 },
          { month: 'Dec', health: 79.9, avgSPI: 0.85, variance: -15.9, totalActivities: 9412, updates: 247 },
          { month: 'Jan', health: 79.8, avgSPI: 0.85, variance: -15.7, totalActivities: 9456, updates: 251 }
        ],
        projectBreakdown: [
          { project: 'Medical Center East', health: 91.2, spi: 0.98, variance: -2.1, activities: 2156, status: 'on-track' },
          { project: 'Tech Campus Phase 2', health: 87.4, spi: 0.93, variance: -6.8, activities: 1876, status: 'slight-delay' },
          { project: 'Marina Bay Plaza', health: 71.3, spi: 0.78, variance: -28.4, activities: 1654, status: 'critical' },
          { project: 'Tropical World', health: 82.4, spi: 0.89, variance: -12.3, activities: 1847, status: 'slight-delay' },
          { project: 'Grandview Heights', health: 74.2, spi: 0.81, variance: -24.7, activities: 1423, status: 'behind' },
          { project: 'Riverside Plaza', health: 86.8, spi: 0.91, variance: -8.9, activities: 1500, status: 'slight-delay' }
        ],
        riskProjects: [
          { project: 'Marina Bay Plaza', risk: 'High', issue: 'Foundation redesign required' },
          { project: 'Grandview Heights', risk: 'Medium', issue: 'Permit approval delays' }
        ]
      },
      'executive': {
        scheduleHealth: 77.6,
        scheduleGrade: 'C+',
        totalProjects: 12,
        companyMetrics: {
          onSchedule: 4,
          slightlyBehind: 6,
          criticallyBehind: 2,
          avgVariance: -18.9,
          avgSPI: 0.82,
          totalActivities: 18947
        },
        logicHealth: {
          companyScore: 78.9,
          totalIssues: 89,
          projectsWithIssues: 8
        },
        monthlyTrends: [
          { month: 'Sep', health: 81.2, avgSPI: 0.88, variance: -14.2, projects: 12, updates: 445 },
          { month: 'Oct', health: 79.8, avgSPI: 0.85, variance: -16.1, projects: 12, updates: 468 },
          { month: 'Nov', health: 78.5, avgSPI: 0.83, variance: -17.8, projects: 12, updates: 471 },
          { month: 'Dec', health: 77.9, avgSPI: 0.82, variance: -18.5, projects: 12, updates: 489 },
          { month: 'Jan', health: 77.6, avgSPI: 0.82, variance: -18.9, projects: 12, updates: 495 }
        ],
        regionalPerformance: [
          { region: 'West Coast', health: 84.2, projects: 4, variance: -8.3 },
          { region: 'Southeast', health: 76.8, projects: 5, variance: -22.1 },
          { region: 'Northeast', health: 71.4, projects: 3, variance: -28.7 }
        ]
      }
    }

    return baseData[role as keyof typeof baseData]
  }

  const data = getRoleBasedData()
  
  const getHealthColor = (health: number) => {
    if (health >= 85) return 'text-green-600 dark:text-green-400'
    if (health >= 70) return 'text-blue-600 dark:text-blue-400'
    if (health >= 55) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getHealthBadgeColor = (health: number) => {
    if (health >= 85) return 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
    if (health >= 70) return 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'
    if (health >= 55) return 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800'
    return 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
  }

  const getBackgroundGradient = (health: number) => {
    if (health >= 85) return 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800'
    if (health >= 70) return 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800'
    if (health >= 55) return 'from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200 dark:border-yellow-800'
    return 'from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-red-200 dark:border-red-800'
  }

  const getTrendIcon = (variance: number) => {
    if (variance > -5) return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
    if (variance > -15) return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
    return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-track':
        return <Badge className="bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200">On Track</Badge>
      case 'slight-delay':
        return <Badge className="bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200">Slight Delay</Badge>
      case 'behind':
        return <Badge className="bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200">Behind</Badge>
      case 'critical':
        return <Badge className="bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-200">Critical</Badge>
      default:
        return <Badge className="bg-muted text-foreground">Unknown</Badge>
    }
  }

  const role = userRole || 'project-manager'

  // Radar chart data for schedule health dimensions
  const radarData = [
    { dimension: 'Logic Health', value: data.logicHealth?.score || data.logicHealth?.avgScore || data.logicHealth?.companyScore || 80 },
    { dimension: 'Progress Updates', value: role === 'project-manager' ? data.updateMetrics?.dataQuality || 90 : 85 },
    { dimension: 'Critical Path', value: data.criticalPath?.health || data.criticalPath?.healthScore || 78 },
    { dimension: 'Milestone Performance', value: Math.max(0, 100 + (data.variance?.scheduleVariance || data.portfolioMetrics?.avgVariance || data.companyMetrics?.avgVariance || -10) * 2) },
    { dimension: 'Schedule Adherence', value: (data.variance?.schedulePerformanceIndex || data.portfolioMetrics?.avgSPI || data.companyMetrics?.avgSPI || 0.85) * 100 }
  ]

  return (
    <div 
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={cn("bg-gradient-to-br border-l-4 hover:shadow-xl transition-all duration-300 h-full", 
        getBackgroundGradient(data.scheduleHealth),
        data.scheduleHealth >= 85 ? "border-l-green-500" :
        data.scheduleHealth >= 70 ? "border-l-blue-500" :
        data.scheduleHealth >= 55 ? "border-l-yellow-500" : "border-l-red-500"
      )}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className={cn("h-4 w-4", getHealthColor(data.scheduleHealth))} />
              {card.title}
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(data.variance?.scheduleVariance || data.portfolioMetrics?.avgVariance || data.companyMetrics?.avgVariance || -10)}
              <Badge className={getHealthBadgeColor(data.scheduleHealth)}>
                {data.scheduleGrade}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Schedule Health Score */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40 flex items-center justify-center border-4 border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <div className={`text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium ${getHealthColor(data.scheduleHealth)}`}>
                    {data.scheduleHealth.toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Health</div>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1">
                {getTrendIcon(data.variance?.scheduleVariance || data.portfolioMetrics?.avgVariance || data.companyMetrics?.avgVariance || -10)}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 dark:border-blue-800 p-1.5 sm:p-2 lg:p-2.5">
            <h4 className="font-semibold mb-2 text-foreground text-sm">Key Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Schedule Variance</span>
                <span className={`text-xs font-semibold ${
                  (data.variance?.scheduleVariance || data.portfolioMetrics?.avgVariance || data.companyMetrics?.avgVariance || 0) > -5 
                    ? 'text-green-600 dark:text-green-400' 
                    : (data.variance?.scheduleVariance || data.portfolioMetrics?.avgVariance || data.companyMetrics?.avgVariance || 0) > -15 
                      ? 'text-yellow-600 dark:text-yellow-400' 
                      : 'text-red-600 dark:text-red-400'
                }`}>
                  {(data.variance?.scheduleVariance || data.portfolioMetrics?.avgVariance || data.companyMetrics?.avgVariance || 0).toFixed(1)} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Performance Index</span>
                <span className={`text-xs font-semibold ${
                  (data.variance?.schedulePerformanceIndex || data.portfolioMetrics?.avgSPI || data.companyMetrics?.avgSPI || 0) >= 0.95 
                    ? 'text-green-600 dark:text-green-400' 
                    : (data.variance?.schedulePerformanceIndex || data.portfolioMetrics?.avgSPI || data.companyMetrics?.avgSPI || 0) >= 0.85 
                      ? 'text-yellow-600 dark:text-yellow-400' 
                      : 'text-red-600 dark:text-red-400'
                }`}>
                  {(data.variance?.schedulePerformanceIndex || data.portfolioMetrics?.avgSPI || data.companyMetrics?.avgSPI || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Logic Health</span>
                <span className={`text-xs font-semibold ${getHealthColor(data.logicHealth?.score || data.logicHealth?.avgScore || data.logicHealth?.companyScore || 80)}`}>
                  {(data.logicHealth?.score || data.logicHealth?.avgScore || data.logicHealth?.companyScore || 80).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 dark:border-blue-800 p-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Target className="h-3 w-3" />
                {role === 'project-manager' ? 'Activities' : role === 'project-executive' ? 'Projects' : 'Total Projects'}
              </div>
              <div className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
                {role === 'project-manager' ? data.totalActivities : 
                 role === 'project-executive' ? data.totalProjects : 
                 data.totalProjects}
              </div>
            </div>
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 dark:border-blue-800 p-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                {role === 'project-manager' ? 'Critical Path' : 'On Schedule'}
              </div>
              <div className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
                {role === 'project-manager' ? `${data.criticalPath?.activities} acts` : 
                 role === 'project-executive' ? `${data.portfolioMetrics?.onSchedule}/${data.totalProjects}` : 
                 `${data.companyMetrics?.onSchedule}/${data.totalProjects}`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hover Drill-down */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-lg shadow-2xl z-10 overflow-auto">
          <div className="p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-200 dark:border-blue-800 pb-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Schedule Analytics
              </h3>
              <div className="flex items-center gap-2">
                {getTrendIcon(data.variance?.scheduleVariance || data.portfolioMetrics?.avgVariance || data.companyMetrics?.avgVariance || -10)}
                <Badge className={getHealthBadgeColor(data.scheduleHealth)}>
                  {data.scheduleGrade}
                </Badge>
              </div>
            </div>

            {/* Schedule Health Radar */}
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 dark:border-blue-800 p-1.5 sm:p-2 lg:p-2.5">
              <h4 className="font-semibold mb-2 text-foreground">Schedule Health Dimensions</h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#bfdbfe" />
                    <PolarAngleAxis dataKey="dimension" fontSize={10} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} />
                    <Radar
                      name="Schedule Health"
                      dataKey="value"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Trends */}
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 dark:border-blue-800 p-1.5 sm:p-2 lg:p-2.5">
              <h4 className="font-semibold mb-2 text-foreground">Performance Trends</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#bfdbfe" />
                    <XAxis dataKey="month" fontSize={10} stroke="hsl(var(--chart-2))" />
                    <YAxis fontSize={10} stroke="hsl(var(--chart-2))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }} 
                    />
                    <Area
                      type="monotone"
                      dataKey="health"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.3}
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      name="Schedule Health"
                    />
                    <Line
                      type="monotone"
                      dataKey={role === 'project-manager' ? 'spi' : 'avgSPI'}
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      name="Performance Index"
                      yAxisId="right"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Role-specific details */}
            {role === 'project-manager' && 'milestones' in data && (
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 dark:border-blue-800 p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-2 text-foreground">Key Milestones</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {data.milestones.map((milestone: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded bg-white/40 dark:bg-black/40 border border-blue-100 dark:border-blue-800">
                      <div>
                        <div className="text-sm font-medium text-foreground">{milestone.name}</div>
                        <div className="text-xs text-muted-foreground">{milestone.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${
                          milestone.variance > 0 ? 'text-green-600 dark:text-green-400' : 
                          milestone.variance > -5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {milestone.variance > 0 ? '+' : ''}{milestone.variance}d
                        </span>
                        {milestone.status === 'completed' && <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />}
                        {milestone.status === 'in-progress' && <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />}
                        {milestone.status === 'upcoming' && <Target className="h-3 w-3 text-muted-foreground" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {role === 'project-executive' && 'projectBreakdown' in data && (
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 dark:border-blue-800 p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-2 text-foreground">Project Portfolio</h4>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {data.projectBreakdown.map((project: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded bg-white/40 dark:bg-black/40 border border-blue-100 dark:border-blue-800">
                      <div>
                        <div className="text-sm font-medium text-foreground">{project.project}</div>
                        <div className="text-xs text-muted-foreground">
                          SPI: {project.spi.toFixed(2)} | {project.activities} activities
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-sm font-semibold ${getHealthColor(project.health)}`}>
                          {project.health.toFixed(0)}%
                        </div>
                        {getStatusBadge(project.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {role === 'project-manager' && 'alerts' in data && (
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 dark:border-blue-800 p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-2 text-foreground">Schedule Alerts</h4>
                <div className="space-y-2 max-h-24 overflow-y-auto">
                  {data.alerts.map((alert: any, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-2 rounded bg-white/40 dark:bg-black/40 border border-blue-100 dark:border-blue-800">
                      <div className="flex-shrink-0 mt-1">
                        {alert.type === 'critical' && <AlertTriangle className="h-3 w-3 text-red-600 dark:text-red-400" />}
                        {alert.type === 'warning' && <AlertTriangle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />}
                        {alert.type === 'info' && <CheckCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />}
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">{alert.category}</div>
                        <div className="text-xs font-medium text-foreground">{alert.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 dark:border-blue-800 p-2 text-center">
                <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-blue-600 dark:text-blue-400">
                  {role === 'executive' ? data.companyMetrics?.onSchedule : 
                   role === 'project-executive' ? data.portfolioMetrics?.onSchedule : 
                   data.criticalPath?.duration}
                </div>
                <div className="text-xs text-muted-foreground">
                  {role === 'executive' ? 'On Schedule' : 
                   role === 'project-executive' ? 'On Track' : 'CP Duration'}
                </div>
              </div>
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 dark:border-blue-800 p-2 text-center">
                <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-blue-600 dark:text-blue-400">
                  {role === 'executive' ? data.companyMetrics?.criticallyBehind : 
                   role === 'project-executive' ? data.portfolioMetrics?.criticallyBehind : 
                   data.logicHealth?.issues}
                </div>
                <div className="text-xs text-muted-foreground">
                  {role === 'executive' ? 'Critical' : 
                   role === 'project-executive' ? 'Behind' : 'Logic Issues'}
                </div>
              </div>
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 dark:border-blue-800 p-2 text-center">
                <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-blue-600 dark:text-blue-400">
                  {role === 'project-manager' ? data.updateMetrics?.frequency : 
                   role === 'project-executive' ? data.logicHealth?.projectsWithIssues : 
                   data.logicHealth?.projectsWithIssues}
                </div>
                <div className="text-xs text-muted-foreground">
                  {role === 'project-manager' ? 'Updates' : 'Issues'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 