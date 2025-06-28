"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CustomBarChart } from "@/components/charts/BarChart"
import { CustomLineChart } from "@/components/charts/LineChart"
import { PieChartCard } from "@/components/charts/PieChart"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  FileText,
  Shield,
  Calendar,
  Users
} from "lucide-react"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import type { Permit, PermitAnalytics as PermitAnalyticsType } from "@/types/permit-log"

interface PermitAnalyticsProps {
  permits: Permit[]
  detailed?: boolean
  className?: string
}

export function PermitAnalytics({ permits, detailed = false, className = "" }: PermitAnalyticsProps) {
  // Calculate analytics data
  const analytics = useMemo(() => {
    const totalPermits = permits.length
    const approvedPermits = permits.filter(p => p.status === "approved" || p.status === "renewed").length
    const pendingPermits = permits.filter(p => p.status === "pending").length
    const expiredPermits = permits.filter(p => p.status === "expired").length
    const rejectedPermits = permits.filter(p => p.status === "rejected").length

    const approvalRate = totalPermits > 0 ? (approvedPermits / totalPermits) * 100 : 0

    // Inspections analytics
    const allInspections = permits.flatMap(p => p.inspections || [])
    const totalInspections = allInspections.length
    const passedInspections = allInspections.filter(i => i.result === "passed").length
    const failedInspections = allInspections.filter(i => i.result === "failed").length
    const pendingInspections = allInspections.filter(i => i.result === "pending").length
    const inspectionPassRate = totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 0

    // Cost analytics
    const totalCost = permits.reduce((sum, p) => sum + (p.cost || 0), 0)
    const averageCost = totalPermits > 0 ? totalCost / totalPermits : 0

    // Processing time analytics
    const processedPermits = permits.filter(p => p.approvalDate && p.applicationDate)
    const averageProcessingTime = processedPermits.length > 0 
      ? processedPermits.reduce((sum, p) => {
          const appDate = new Date(p.applicationDate)
          const approvalDate = new Date(p.approvalDate!)
          return sum + (approvalDate.getTime() - appDate.getTime()) / (1000 * 60 * 60 * 24)
        }, 0) / processedPermits.length
      : 0

    // Expiring permits (within 30 days)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    const expiringPermits = permits.filter(p => {
      const expDate = new Date(p.expirationDate)
      return expDate <= thirtyDaysFromNow && expDate > new Date() && (p.status === "approved" || p.status === "renewed")
    }).length

    // Permits by type
    const permitsByType = permits.reduce((acc, permit) => {
      acc[permit.type] = (acc[permit.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Permits by status
    const permitsByStatus = permits.reduce((acc, permit) => {
      acc[permit.status] = (acc[permit.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Authority performance
    const authorityStats = permits.reduce((acc, permit) => {
      if (!acc[permit.authority]) {
        acc[permit.authority] = {
          total: 0,
          approved: 0,
          totalProcessingTime: 0,
          processedCount: 0
        }
      }
      
      acc[permit.authority].total++
      if (permit.status === "approved" || permit.status === "renewed") {
        acc[permit.authority].approved++
      }
      
      if (permit.approvalDate && permit.applicationDate) {
        const processingTime = (new Date(permit.approvalDate).getTime() - new Date(permit.applicationDate).getTime()) / (1000 * 60 * 60 * 24)
        acc[permit.authority].totalProcessingTime += processingTime
        acc[permit.authority].processedCount++
      }
      
      return acc
    }, {} as Record<string, any>)

    // Monthly trends (last 6 months)
    const monthlyTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const monthStart = startOfMonth(date)
      const monthEnd = endOfMonth(date)
      
      const monthPermits = permits.filter(p => {
        const appDate = new Date(p.applicationDate)
        return appDate >= monthStart && appDate <= monthEnd
      })
      
      const monthInspections = monthPermits.flatMap(p => p.inspections || [])
      const monthApproved = monthPermits.filter(p => p.status === "approved" || p.status === "renewed").length
      const monthPassed = monthInspections.filter(i => i.result === "passed").length
      
      monthlyTrends.push({
        month: format(date, "MMM yyyy"),
        permits: monthPermits.length,
        inspections: monthInspections.length,
        approvalRate: monthPermits.length > 0 ? (monthApproved / monthPermits.length) * 100 : 0,
        passRate: monthInspections.length > 0 ? (monthPassed / monthInspections.length) * 100 : 0
      })
    }

    return {
      totalPermits,
      approvedPermits,
      pendingPermits,
      expiredPermits,
      rejectedPermits,
      approvalRate,
      totalInspections,
      passedInspections,
      failedInspections,
      pendingInspections,
      inspectionPassRate,
      totalCost,
      averageCost,
      averageProcessingTime,
      expiringPermits,
      permitsByType,
      permitsByStatus,
      authorityStats,
      monthlyTrends
    }
  }, [permits])

  // Prepare chart data
  const permitStatusData = Object.entries(analytics.permitsByStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    percentage: analytics.totalPermits > 0 ? (count / analytics.totalPermits) * 100 : 0
  }))

  const permitTypeData = Object.entries(analytics.permitsByType).map(([type, count]) => ({
    name: type,
    value: count,
    percentage: analytics.totalPermits > 0 ? (count / analytics.totalPermits) * 100 : 0
  }))

  const inspectionResultData = [
    { name: "Passed", value: analytics.passedInspections, color: "#10B981" },
    { name: "Failed", value: analytics.failedInspections, color: "#EF4444" },
    { name: "Pending", value: analytics.pendingInspections, color: "#3B82F6" }
  ]

  const monthlyTrendData = analytics.monthlyTrends.map(trend => ({
    name: trend.month,
    value: trend.permits
  }))

  const authorityPerformanceData = Object.entries(analytics.authorityStats).map(([authority, stats]: [string, any]) => ({
    authority: authority.replace(/Governing Body$/, "").trim(),
    approvalRate: stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0,
    avgProcessingTime: stats.processedCount > 0 ? Math.round(stats.totalProcessingTime / stats.processedCount) : 0,
    permitCount: stats.total
  })).sort((a, b) => b.permitCount - a.permitCount)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Permits</p>
                <p className="text-2xl font-bold text-[#003087] dark:text-blue-400">{analytics.totalPermits}</p>
              </div>
              <FileText className="h-8 w-8 text-[#003087] dark:text-blue-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {analytics.approvedPermits} approved
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
                <p className="text-2xl font-bold text-green-600">{Math.round(analytics.approvalRate)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Progress value={analytics.approvalRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing Time</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(analytics.averageProcessingTime)}</p>
                <p className="text-xs text-muted-foreground">days average</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.expiringPermits}</p>
                <p className="text-xs text-muted-foreground">within 30 days</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Permit Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#003087] dark:text-blue-400 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Permit Status Distribution
            </CardTitle>
            <CardDescription>Current status of all permits in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartCard 
              data={permitStatusData}
              title=""
            />
          </CardContent>
        </Card>

        {/* Inspection Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#003087] dark:text-blue-400 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Inspection Results
            </CardTitle>
            <CardDescription>Pass/fail rate for all inspections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pass Rate</span>
                <span className="text-sm font-bold text-green-600">{Math.round(analytics.inspectionPassRate)}%</span>
              </div>
              <Progress value={analytics.inspectionPassRate} className="h-2" />
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                {inspectionResultData.map((item) => (
                  <div key={item.name} className="text-center">
                    <div className="text-lg font-bold" style={{ color: item.color }}>
                      {item.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {detailed && (
        <>
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003087] dark:text-blue-400 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                6-Month Trends
              </CardTitle>
              <CardDescription>Permits and inspections over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomLineChart 
                data={monthlyTrendData}
                title=""
                color="#003087"
              />
            </CardContent>
          </Card>

          {/* Permit Types Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003087] dark:text-blue-400 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Permits by Type
              </CardTitle>
              <CardDescription>Distribution of permit types</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomBarChart 
                data={permitTypeData}
                title=""
                color="#003087"
              />
            </CardContent>
          </Card>

          {/* Authority Performance */}
          {authorityPerformanceData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#003087] dark:text-blue-400 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authority Performance
                </CardTitle>
                <CardDescription>Processing efficiency by permit authority</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {authorityPerformanceData.map((authority, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{authority.authority}</div>
                        <div className="text-xs text-muted-foreground">
                          {authority.permitCount} permits • {authority.avgProcessingTime} days avg
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-bold text-green-600">{authority.approvalRate}%</div>
                          <div className="text-xs text-muted-foreground">Approval</div>
                        </div>
                        <Progress value={authority.approvalRate} className="w-16 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cost Analytics */}
          {analytics.totalCost > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#003087] dark:text-blue-400 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Analytics
                </CardTitle>
                <CardDescription>Financial overview of permit costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#003087] dark:text-blue-400">
                      ${analytics.totalCost.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${Math.round(analytics.averageCost).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Average Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.totalPermits}
                    </div>
                    <div className="text-sm text-muted-foreground">Permits</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
} 