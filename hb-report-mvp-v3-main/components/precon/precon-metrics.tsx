"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { TrendingUp, Users, Target, Award } from "lucide-react"
import { useState } from "react"
import type { EstimateMetrics } from "@/types/precon"

interface PreConMetricsProps {
  metrics: EstimateMetrics
}

export function PreConMetrics({ metrics }: PreConMetricsProps) {
  const [timeFrame, setTimeFrame] = useState("all")

  const getEstimateCount = () => {
    switch (timeFrame) {
      case "last-year":
        return metrics.estimatesLastYear
      case "this-year":
        return metrics.estimatesThisYear
      case "this-quarter":
        return metrics.estimatesThisQuarter
      case "this-month":
        return metrics.estimatesThisMonth
      default:
        return metrics.totalEstimates
    }
  }

  const getTimeFrameLabel = () => {
    switch (timeFrame) {
      case "last-year":
        return "Last Year"
      case "this-year":
        return "This Year"
      case "this-quarter":
        return "This Quarter"
      case "this-month":
        return "This Month"
      default:
        return "All Time"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Estimates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold">{formatNumber(getEstimateCount())}</div>
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="this-quarter">This Quarter</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">{getTimeFrameLabel()}</p>
        </CardContent>
      </Card>

      {/* Win Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{metrics.winRate}%</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            {metrics.totalAwarded} of {metrics.totalSubmitted} awarded
          </div>
        </CardContent>
      </Card>

      {/* Average Estimate Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Estimate Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.averageEstimateValue)}</div>
          <p className="text-xs text-muted-foreground">Per project estimate</p>
        </CardContent>
      </Card>

      {/* Average Subcontractor Participation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Sub Participation</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.averageSubcontractorParticipation}</div>
          <p className="text-xs text-muted-foreground">Subcontractors per project</p>
        </CardContent>
      </Card>
    </div>
  )
}
