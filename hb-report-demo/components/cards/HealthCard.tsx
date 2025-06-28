"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Shield, Clock, DollarSign } from "lucide-react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import type { DashboardCard } from "@/types/dashboard"
import { useState } from "react"

interface HealthCardProps {
  card: DashboardCard
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

const HEALTH_COLORS = [
  'hsl(var(--chart-1))', 
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))', 
  'hsl(var(--chart-5))'
]

export function HealthCard({ card, config, span, isCompact, userRole }: HealthCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Mock data based on role
  const getRoleBasedData = () => {
    const role = userRole || 'project-manager'
    
    const baseData = {
      'project-manager': {
        overallHealth: 84.2,
        healthGrade: 'B+',
        trendDirection: 'up',
        trendValue: 2.3,
        healthDimensions: {
          schedule: 87.5,
          budget: 82.1,
          quality: 91.2,
          safety: 95.8,
          risk: 76.4,
          communication: 88.9
        },
        healthTrend: [
          { month: 'Jan', overall: 78.2, schedule: 82.1, budget: 85.3, quality: 89.1, safety: 94.2, risk: 71.8 },
          { month: 'Feb', overall: 80.5, schedule: 84.3, budget: 83.7, quality: 90.2, safety: 95.1, risk: 73.5 },
          { month: 'Mar', overall: 82.8, schedule: 86.1, budget: 81.9, quality: 90.8, safety: 95.6, risk: 74.9 },
          { month: 'Apr', overall: 83.6, schedule: 87.2, budget: 82.0, quality: 91.0, safety: 95.7, risk: 75.8 },
          { month: 'May', overall: 84.2, schedule: 87.5, budget: 82.1, quality: 91.2, safety: 95.8, risk: 76.4 }
        ],
        alerts: [
          { type: 'warning', category: 'Budget', message: 'Labor costs trending 3% over forecast', severity: 'medium' },
          { type: 'info', category: 'Schedule', message: 'Weather delays resolved, back on track', severity: 'low' },
          { type: 'success', category: 'Quality', message: '15 consecutive days without rework', severity: 'positive' }
        ],
        keyMetrics: {
          scheduleVariance: -2.1, // days behind
          budgetVariance: 1.8, // % over
          qualityScore: 91.2,
          safetyDays: 127, // days without incident
          riskExposure: 245000,
          stakeholderSatisfaction: 88.9
        },
        projectName: "Tropical World Nursery"
      },
      'project-executive': {
        overallHealth: 81.7,
        healthGrade: 'B',
        trendDirection: 'down',
        trendValue: -1.2,
        healthDimensions: {
          schedule: 83.2,
          budget: 79.8,
          quality: 88.5,
          safety: 92.1,
          risk: 74.8,
          communication: 85.6
        },
        healthTrend: [
          { month: 'Jan', overall: 84.1, schedule: 85.8, budget: 82.3, quality: 87.9, safety: 91.2, risk: 76.8 },
          { month: 'Feb', overall: 83.5, schedule: 84.6, budget: 81.1, quality: 88.2, safety: 91.8, risk: 75.9 },
          { month: 'Mar', overall: 82.9, schedule: 83.9, budget: 80.5, quality: 88.6, safety: 92.0, risk: 75.2 },
          { month: 'Apr', overall: 82.1, schedule: 83.4, budget: 79.9, quality: 88.4, safety: 92.1, risk: 74.9 },
          { month: 'May', overall: 81.7, schedule: 83.2, budget: 79.8, quality: 88.5, safety: 92.1, risk: 74.8 }
        ],
        portfolioBreakdown: [
          { project: 'Medical Center East', health: 89.3, schedule: 92.1, budget: 87.5, quality: 94.2, risk: 82.1, trend: 'up' },
          { project: 'Tech Campus Phase 2', health: 85.7, schedule: 88.9, budget: 83.2, quality: 91.1, risk: 78.5, trend: 'stable' },
          { project: 'Marina Bay Plaza', health: 78.2, schedule: 76.8, budget: 74.9, quality: 85.3, risk: 71.2, trend: 'down' },
          { project: 'Tropical World', health: 84.2, schedule: 87.5, budget: 82.1, quality: 91.2, risk: 76.4, trend: 'up' },
          { project: 'Grandview Heights', health: 76.9, schedule: 73.2, budget: 75.8, quality: 82.4, risk: 69.8, trend: 'down' },
          { project: 'Riverside Plaza', health: 82.8, schedule: 85.1, budget: 81.2, quality: 87.6, risk: 77.3, trend: 'stable' }
        ],
        keyMetrics: {
          avgScheduleVariance: -3.8,
          avgBudgetVariance: 2.4,
          portfolioRisk: 1850000,
          criticalProjects: 2,
          onTrackProjects: 4,
          stakeholderSatisfaction: 85.6
        }
      },
      'executive': {
        overallHealth: 79.4,
        healthGrade: 'B-',
        trendDirection: 'stable',
        trendValue: 0.2,
        healthDimensions: {
          schedule: 81.5,
          budget: 77.2,
          quality: 85.8,
          safety: 89.7,
          risk: 72.1,
          communication: 82.9
        },
        healthTrend: [
          { month: 'Jan', overall: 78.9, schedule: 81.2, budget: 76.8, quality: 85.1, safety: 89.2, risk: 71.5 },
          { month: 'Feb', overall: 79.1, schedule: 81.3, budget: 77.0, quality: 85.4, safety: 89.5, risk: 71.8 },
          { month: 'Mar', overall: 79.3, schedule: 81.4, budget: 77.1, quality: 85.6, safety: 89.6, risk: 72.0 },
          { month: 'Apr', overall: 79.2, schedule: 81.4, budget: 77.0, quality: 85.7, safety: 89.7, risk: 72.1 },
          { month: 'May', overall: 79.4, schedule: 81.5, budget: 77.2, quality: 85.8, safety: 89.7, risk: 72.1 }
        ],
        companyMetrics: {
          totalProjects: 12,
          healthyProjects: 7,
          atRiskProjects: 4,
          criticalProjects: 1,
          totalRiskExposure: 5240000,
          avgStakeholderSatisfaction: 82.9,
          companyReputation: 87.2
        }
      }
    }

    return baseData[role as keyof typeof baseData]
  }

  const data = getRoleBasedData()
  const healthGradeColor = data.overallHealth >= 90 ? 'text-green-600 dark:text-green-400 dark:text-green-400' : 
                          data.overallHealth >= 80 ? 'text-blue-600 dark:text-blue-400 dark:text-blue-400' : 
                          data.overallHealth >= 70 ? 'text-yellow-600 dark:text-yellow-400 dark:text-yellow-400' : 'text-red-600 dark:text-red-400 dark:text-red-400'

  const radarData = Object.entries(data.healthDimensions).map(([key, value]) => ({
    dimension: key.charAt(0).toUpperCase() + key.slice(1),
    value: value,
    fullMark: 100
  }))

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 dark:text-green-400" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400 dark:text-red-400" />
      default:
        return <div className="h-4 w-4 rounded-full bg-muted-foreground" />
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600 dark:text-green-400 dark:text-green-400'
    if (health >= 80) return 'text-blue-600 dark:text-blue-400 dark:text-blue-400'
    if (health >= 70) return 'text-yellow-600 dark:text-yellow-400 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400 dark:text-red-400'
  }

  const getHealthBadge = (health: number) => {
    if (health >= 90) return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Excellent</Badge>
    if (health >= 80) return <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">Good</Badge>
    if (health >= 70) return <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">Fair</Badge>
    return <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">Poor</Badge>
  }

  const role = userRole || 'project-manager'

  return (
    <div 
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800 dark:border-cyan-800 hover:shadow-xl transition-all duration-300 h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              {card.title}
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(data.trendDirection)}
              <Badge className={`${healthGradeColor} bg-card dark:bg-card border-cyan-200 dark:border-cyan-800 dark:border-cyan-800`}>
                {data.healthGrade}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Health Score Circle */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 flex items-center justify-center border-4 border-cyan-200 dark:border-cyan-800 dark:border-cyan-700">
                <div className="text-center">
                  <div className={`text-xl font-bold ${healthGradeColor}`}>{data.overallHealth.toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">Health</div>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1">
                {getTrendIcon(data.trendDirection)}
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {data.trendDirection === 'up' ? '+' : data.trendDirection === 'down' ? '-' : '±'}{Math.abs(data.trendValue)}% vs last month
            </div>
          </div>

          {/* Health Dimensions */}
          <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-cyan-100 p-3">
            <h4 className="font-semibold mb-2 text-foreground text-sm">Health Dimensions</h4>
            <div className="space-y-2">
              {Object.entries(data.healthDimensions).slice(0, 4).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground capitalize">{key}</span>
                  <div className="flex items-center gap-2 flex-1 ml-2">
                    <Progress value={value} className="h-1 flex-1" />
                    <span className={`text-xs font-semibold ${getHealthColor(value)} min-w-[2rem]`}>
                      {value.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-cyan-100 p-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Schedule
              </div>
              <div className="font-semibold text-cyan-600 dark:text-cyan-400 text-sm">
                {role === 'project-manager' ? 
                  `${data.keyMetrics?.scheduleVariance > 0 ? '+' : ''}${data.keyMetrics?.scheduleVariance} days` :
                  `${data.keyMetrics?.avgScheduleVariance > 0 ? '+' : ''}${data.keyMetrics?.avgScheduleVariance} avg`
                }
              </div>
            </div>
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-cyan-100 p-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                Budget
              </div>
              <div className="font-semibold text-cyan-600 dark:text-cyan-400 text-sm">
                {role === 'project-manager' ? 
                  `${data.keyMetrics?.budgetVariance > 0 ? '+' : ''}${data.keyMetrics?.budgetVariance}%` :
                  `${data.keyMetrics?.avgBudgetVariance > 0 ? '+' : ''}${data.keyMetrics?.avgBudgetVariance}% avg`
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hover Drill-down */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg shadow-2xl z-10 overflow-auto">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-200 dark:border-cyan-800 pb-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Heart className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                Health Analytics
              </h3>
              <div className="flex items-center gap-2">
                {getTrendIcon(data.trendDirection)}
                <Badge className={`${healthGradeColor} bg-card border-cyan-200 dark:border-cyan-800`}>
                  {data.healthGrade}
                </Badge>
              </div>
            </div>

            {/* Health Radar */}
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-cyan-100 p-3">
              <h4 className="font-semibold mb-2 text-foreground">Health Dimensions</h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#bfdbfe" />
                    <PolarAngleAxis dataKey="dimension" fontSize={10} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} />
                    <Radar
                      name="Health"
                      dataKey="value"
                      stroke="#0891b2"
                      fill="#0891b2"
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

            {/* Health Trend */}
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-cyan-100 p-3">
              <h4 className="font-semibold mb-2 text-foreground">Health Trend</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.healthTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#bfdbfe" />
                    <XAxis dataKey="month" fontSize={10} stroke="#0891b2" />
                    <YAxis domain={[60, 100]} fontSize={10} stroke="#0891b2" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }} 
                    />
                    <Line type="monotone" dataKey="overall" stroke="#0891b2" strokeWidth={3} name="Overall Health" />
                    <Line type="monotone" dataKey="schedule" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Schedule" />
                    <Line type="monotone" dataKey="budget" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Budget" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Role-specific details */}
            {role === 'project-executive' && 'portfolioBreakdown' in data && (
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-cyan-100 p-3">
                <h4 className="font-semibold mb-2 text-foreground">Portfolio Health</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {data.portfolioBreakdown.map((project: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded bg-white/40 dark:bg-black/40 border border-cyan-100">
                      <div>
                        <div className="text-sm font-medium text-foreground">{project.project}</div>
                        <div className="text-xs text-muted-foreground">
                          S: {project.schedule}% | B: {project.budget}% | Q: {project.quality}%
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-sm font-semibold ${getHealthColor(project.health)}`}>
                          {project.health.toFixed(0)}%
                        </div>
                        {getTrendIcon(project.trend)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {role === 'project-manager' && 'alerts' in data && (
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-cyan-100 p-3">
                <h4 className="font-semibold mb-2 text-foreground">Health Alerts</h4>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {data.alerts.map((alert: any, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-2 rounded bg-white/40 dark:bg-black/40 border border-cyan-100">
                      <div className="flex-shrink-0 mt-1">
                        {alert.type === 'warning' && <AlertTriangle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />}
                        {alert.type === 'success' && <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />}
                        {alert.type === 'info' && <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{alert.category}</div>
                        <div className="text-xs text-muted-foreground">{alert.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-cyan-100 p-2 text-center">
                <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                  {role === 'executive' ? data.companyMetrics?.healthyProjects : 
                   role === 'project-executive' ? data.keyMetrics?.onTrackProjects : 
                   data.keyMetrics?.qualityScore.toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {role === 'executive' ? 'Healthy' : 
                   role === 'project-executive' ? 'On Track' : 'Quality Score'}
                </div>
              </div>
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-cyan-100 p-2 text-center">
                <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                  {role === 'executive' ? data.companyMetrics?.atRiskProjects : 
                   role === 'project-executive' ? data.keyMetrics?.criticalProjects : 
                   data.keyMetrics?.safetyDays}
                </div>
                <div className="text-xs text-muted-foreground">
                  {role === 'executive' ? 'At Risk' : 
                   role === 'project-executive' ? 'Critical' : 'Safety Days'}
                </div>
              </div>
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-cyan-100 p-2 text-center">
                <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                  {role === 'executive' ? data.companyMetrics?.avgStakeholderSatisfaction.toFixed(0) : 
                   role === 'project-executive' ? data.keyMetrics?.stakeholderSatisfaction.toFixed(0) : 
                   data.keyMetrics?.stakeholderSatisfaction.toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 