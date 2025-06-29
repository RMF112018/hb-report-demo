'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Users, TrendingUp, AlertTriangle, Clock, DollarSign, Calendar, Target, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'

// Import mock data
import staffingData from '@/data/mock/staffing/staffing.json'
import spcrData from '@/data/mock/staffing/spcr.json'
import projectsData from '@/data/mock/projects.json'

interface StaffingOverviewProps {
  userRole: string
}

export const StaffingOverview = ({ userRole }: StaffingOverviewProps) => {
  const [metrics, setMetrics] = useState({
    totalStaff: 0,
    activeProjects: 0,
    pendingSpcrs: 0,
    utilizationRate: 0,
    totalLaborCost: 0,
    avgExperience: 0,
    criticalPositions: 0,
    approvalRate: 0
  })

  useEffect(() => {
    // Calculate metrics based on role
    const activeProjects = projectsData.filter(p => p.active).length
    const pendingSpcrs = spcrData.filter(s => s.status === 'pending').length
    const approvedSpcrs = spcrData.filter(s => s.status === 'approved').length
    const totalSpcrs = spcrData.length
    const approvalRate = totalSpcrs > 0 ? (approvedSpcrs / totalSpcrs) * 100 : 0

    // Staff calculations
    const totalStaff = staffingData.length
    const totalLaborCost = staffingData.reduce((sum, staff) => sum + staff.laborRate, 0)
    const avgExperience = staffingData.reduce((sum, staff) => sum + staff.experience, 0) / totalStaff

    // Utilization calculation (simplified)
    const assignedStaff = staffingData.filter(staff => 
      staff.assignments && staff.assignments.length > 0
    ).length
    const utilizationRate = (assignedStaff / totalStaff) * 100

    // Critical positions (those with high labor rates or key roles)
    const criticalPositions = staffingData.filter(staff => 
      staff.position.includes('Executive') || staff.laborRate > 75
    ).length

    setMetrics({
      totalStaff,
      activeProjects,
      pendingSpcrs,
      utilizationRate,
      totalLaborCost,
      avgExperience,
      criticalPositions,
      approvalRate
    })
  }, [])

  const getMetricsForRole = () => {
    switch (userRole) {
      case 'executive':
        return [
          {
            title: 'Total Staff',
            value: metrics.totalStaff.toString(),
            icon: Users,
            change: '+2.5%',
            changeType: 'positive' as const,
            description: 'Across all projects'
          },
          {
            title: 'Active Projects',
            value: metrics.activeProjects.toString(),
            icon: Target,
            change: '+1 project',
            changeType: 'positive' as const,
            description: 'Currently staffed'
          },
          {
            title: 'Pending SPCRs',
            value: metrics.pendingSpcrs.toString(),
            icon: AlertTriangle,
            change: '-3 from last week',
            changeType: 'positive' as const,
            description: 'Require approval'
          },
          {
            title: 'Approval Rate',
            value: `${metrics.approvalRate.toFixed(1)}%`,
            icon: CheckCircle2,
            change: '+5.2%',
            changeType: 'positive' as const,
            description: 'SPCR approval rate'
          }
        ]
      case 'project-executive':
        return [
          {
            title: 'Portfolio Staff',
            value: '47',
            icon: Users,
            change: '+3 this month',
            changeType: 'positive' as const,
            description: 'Across 6 projects'
          },
          {
            title: 'Utilization Rate',
            value: `${metrics.utilizationRate.toFixed(1)}%`,
            icon: TrendingUp,
            change: '+2.1%',
            changeType: 'positive' as const,
            description: 'Resource efficiency'
          },
          {
            title: 'Labor Cost/Week',
            value: `$${(metrics.totalLaborCost * 40 / 1000).toFixed(0)}K`,
            icon: DollarSign,
            change: '-$15K',
            changeType: 'positive' as const,
            description: 'Weekly labor costs'
          },
          {
            title: 'Team Requests',
            value: '12',
            icon: Clock,
            change: '4 pending',
            changeType: 'neutral' as const,
            description: 'SPCRs to review'
          }
        ]
      case 'project-manager':
        return [
          {
            title: 'Project Staff',
            value: '8',
            icon: Users,
            change: '+1 this week',
            changeType: 'positive' as const,
            description: 'Palm Beach Luxury Estate'
          },
          {
            title: 'Productivity',
            value: '94%',
            icon: TrendingUp,
            change: '+3.2%',
            changeType: 'positive' as const,
            description: 'Team performance'
          },
          {
            title: 'Avg Experience',
            value: `${metrics.avgExperience.toFixed(1)} yrs`,
            icon: Target,
            change: 'Team level',
            changeType: 'neutral' as const,
            description: 'Project team average'
          },
          {
            title: 'Open Requests',
            value: '2',
            icon: Clock,
            change: '1 approved',
            changeType: 'positive' as const,
            description: 'SPCRs in progress'
          }
        ]
      default:
        return []
    }
  }

  const metricsToShow = getMetricsForRole()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsToShow.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center space-x-2 text-xs">
              <Badge 
                variant={
                  metric.changeType === 'positive' ? 'default' : 
                  metric.changeType === 'negative' ? 'destructive' : 'secondary'
                }
                className="text-xs"
              >
                {metric.change}
              </Badge>
              <span className="text-muted-foreground">{metric.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 