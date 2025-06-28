"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Permit, Project } from "@/types"
import { TrendingUp, Building, FileText } from "lucide-react"

interface PermitAnalyticsProps {
  permits: Permit[]
  projects: Project[]
}

export function PermitAnalytics({ permits, projects }: PermitAnalyticsProps) {
  // Authority Performance Analysis
  const authorityAnalysis = permits.reduce(
    (acc, permit) => {
      if (!acc[permit.authority]) {
        acc[permit.authority] = {
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
          avgProcessingTime: 0,
          totalCost: 0,
        }
      }

      acc[permit.authority].total++
      acc[permit.authority][permit.status]++
      acc[permit.authority].totalCost += permit.cost || 0

      if (permit.status === "approved" && permit.applicationDate && permit.approvalDate) {
        const appDate = new Date(permit.applicationDate)
        const approvalDate = new Date(permit.approvalDate)
        const processingTime = (approvalDate.getTime() - appDate.getTime()) / (1000 * 60 * 60 * 24)
        acc[permit.authority].avgProcessingTime += processingTime
      }

      return acc
    },
    {} as Record<string, any>,
  )

  // Calculate averages
  Object.keys(authorityAnalysis).forEach((authority) => {
    const data = authorityAnalysis[authority]
    data.approvalRate = data.total > 0 ? Math.round((data.approved / data.total) * 100) : 0
    data.avgProcessingTime = data.approved > 0 ? Math.round(data.avgProcessingTime / data.approved) : 0
  })

  // Permit Type Analysis
  const typeAnalysis = permits.reduce(
    (acc, permit) => {
      if (!acc[permit.type]) {
        acc[permit.type] = { total: 0, approved: 0, pending: 0, rejected: 0, expired: 0 }
      }
      acc[permit.type].total++
      acc[permit.type][permit.status]++
      return acc
    },
    {} as Record<string, any>,
  )

  // Monthly Trends
  const monthlyTrends = permits.reduce(
    (acc, permit) => {
      const date = new Date(permit.applicationDate)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!acc[monthKey]) {
        acc[monthKey] = { applications: 0, approvals: 0, rejections: 0 }
      }

      acc[monthKey].applications++
      if (permit.status === "approved") acc[monthKey].approvals++
      if (permit.status === "rejected") acc[monthKey].rejections++

      return acc
    },
    {} as Record<string, any>,
  )

  const sortedMonths = Object.keys(monthlyTrends).sort().slice(-6) // Last 6 months

  return (
    <div className="space-y-6">
      {/* Authority Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Authority Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(authorityAnalysis).map(([authority, data]: [string, any]) => (
              <div key={authority} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{authority}</h3>
                  <Badge variant="outline">{data.total} permits</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Approval Rate</div>
                    <div className="font-semibold text-green-600">{data.approvalRate}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Avg Processing</div>
                    <div className="font-semibold text-blue-600">{data.avgProcessingTime} days</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Total Cost</div>
                    <div className="font-semibold text-purple-600">${(data.totalCost / 1000).toFixed(1)}K</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Pending</div>
                    <div className="font-semibold text-yellow-600">{data.pending}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <div className="bg-green-500" style={{ width: `${(data.approved / data.total) * 100}%` }} />
                    <div className="bg-yellow-500" style={{ width: `${(data.pending / data.total) * 100}%` }} />
                    <div className="bg-red-500" style={{ width: `${(data.rejected / data.total) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permit Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Permit Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(typeAnalysis).map(([type, data]: [string, any]) => (
              <div key={type} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{type}</h3>
                  <Badge variant="secondary">{data.total}</Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Approved:</span>
                    <span className="text-green-600 font-medium">{data.approved}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pending:</span>
                    <span className="text-yellow-600 font-medium">{data.pending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rejected:</span>
                    <span className="text-red-600 font-medium">{data.rejected}</span>
                  </div>
                </div>

                <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${(data.approved / data.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Trends (Last 6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedMonths.map((month) => {
              const data = monthlyTrends[month]
              const maxValue = Math.max(...sortedMonths.map((m) => monthlyTrends[m].applications))

              return (
                <div key={month} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{month}</span>
                    <div className="flex gap-4 text-xs">
                      <span className="text-blue-600">{data.applications} applied</span>
                      <span className="text-green-600">{data.approvals} approved</span>
                      <span className="text-red-600">{data.rejections} rejected</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${(data.applications / maxValue) * 100}%` }}
                      />
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${data.applications > 0 ? (data.approvals / data.applications) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
