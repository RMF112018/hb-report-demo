"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Permit } from "@/types"
import { FileText, Clock, CheckCircle, AlertTriangle, XCircle, TrendingUp, DollarSign } from "lucide-react"

interface PermitMetricsProps {
  permits: Permit[]
}

export function PermitMetrics({ permits }: PermitMetricsProps) {
  const getMetrics = () => {
    const total = permits.length
    const pending = permits.filter((p) => p.status === "pending").length
    const approved = permits.filter((p) => p.status === "approved").length
    const expired = permits.filter((p) => p.status === "expired").length
    const rejected = permits.filter((p) => p.status === "rejected").length

    // Calculate expiring soon (within 30 days)
    const expiringSoon = permits.filter((p) => {
      if (!p.expirationDate) return false
      const expirationDate = new Date(p.expirationDate)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      return expirationDate <= thirtyDaysFromNow && p.status === "approved"
    }).length

    // Calculate average processing time for approved permits
    const approvedWithDates = permits.filter((p) => p.status === "approved" && p.applicationDate && p.approvalDate)

    const avgProcessingTime =
      approvedWithDates.length > 0
        ? approvedWithDates.reduce((sum, permit) => {
            const appDate = new Date(permit.applicationDate)
            const approvalDate = new Date(permit.approvalDate!)
            return sum + (approvalDate.getTime() - appDate.getTime())
          }, 0) /
          approvedWithDates.length /
          (1000 * 60 * 60 * 24) // Convert to days
        : 0

    // Calculate total cost
    const totalCost = permits.reduce((sum, permit) => sum + (permit.cost || 0), 0)

    // Calculate approval rate
    const approvalRate = total > 0 ? Math.round((approved / (approved + rejected)) * 100) : 0

    return {
      total,
      pending,
      approved,
      expired,
      rejected,
      expiringSoon,
      avgProcessingTime: Math.round(avgProcessingTime),
      totalCost,
      approvalRate,
    }
  }

  const metrics = getMetrics()

  const metricCards = [
    {
      title: "Total Permits",
      value: metrics.total,
      icon: FileText,
      description: "All permits",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Pending",
      value: metrics.pending,
      icon: Clock,
      description: "Awaiting approval",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      title: "Approved",
      value: metrics.approved,
      icon: CheckCircle,
      description: "Active permits",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Expiring Soon",
      value: metrics.expiringSoon,
      icon: AlertTriangle,
      description: "Within 30 days",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      title: "Expired/Rejected",
      value: metrics.expired + metrics.rejected,
      icon: XCircle,
      description: "Inactive permits",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon
          return (
            <Card
              key={metric.title}
              className={`hover:shadow-md transition-all duration-200 border-l-4 ${metric.borderColor}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {metrics.total > 0 ? ((metric.value / metrics.total) * 100).toFixed(0) : 0}%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{metric.title}</p>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">{metrics.avgProcessingTime}</span>
              <span className="text-sm text-gray-600">days average</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Average time from application to approval</p>
            <div className="mt-3 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((metrics.avgProcessingTime / 60) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Approval Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">{metrics.approvalRate}%</span>
              <span className="text-sm text-gray-600">success rate</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Permits approved vs total applications</p>
            <div className="mt-3 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-green-600 rounded-full transition-all duration-500"
                style={{ width: `${metrics.approvalRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-purple-600">${(metrics.totalCost / 1000).toFixed(0)}K</span>
              <span className="text-sm text-gray-600">permit fees</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Total permit and inspection costs</p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-gray-500">Avg per permit:</span>
              <span className="font-medium text-purple-600">
                ${metrics.total > 0 ? Math.round(metrics.totalCost / metrics.total) : 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
