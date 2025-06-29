"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Target,
  Calendar,
  Users
} from "lucide-react"
import type { ConstraintStats } from "@/types/constraint"

interface ConstraintWidgetsProps {
  stats: ConstraintStats
}

export function ConstraintWidgets({ stats }: ConstraintWidgetsProps) {
  // Calculate derived metrics
  const completionRate = stats.total > 0 ? (stats.closed / stats.total) * 100 : 0
  const overdueRate = stats.open > 0 ? (stats.overdue / stats.open) * 100 : 0
  const avgDaysOpen = 28 // Mock value - in production would calculate from actual data
  const trendsDirection = completionRate > 70 ? "up" : "down"

  // Get top categories
  const topCategories = Object.entries(stats.byCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Constraints */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Constraints</CardTitle>
          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
              {stats.open} Open
            </Badge>
            <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300">
              {stats.closed} Closed
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Overdue Constraints */}
      <Card className={`bg-gradient-to-br ${stats.overdue > 0 ? 
        "from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border-red-200 dark:border-red-800" : 
        "from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800"}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${stats.overdue > 0 ? 
            "text-red-700 dark:text-red-300" : 
            "text-green-700 dark:text-green-300"}`}>
            Overdue Constraints
          </CardTitle>
          <AlertTriangle className={`h-4 w-4 ${stats.overdue > 0 ? 
            "text-red-600 dark:text-red-400" : 
            "text-green-600 dark:text-green-400"}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.overdue > 0 ? 
            "text-red-900 dark:text-red-100" : 
            "text-green-900 dark:text-green-100"}`}>
            {stats.overdue}
          </div>
          <p className={`text-xs mt-1 ${stats.overdue > 0 ? 
            "text-red-600 dark:text-red-400" : 
            "text-green-600 dark:text-green-400"}`}>
            {overdueRate.toFixed(1)}% of open constraints
          </p>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Completion Rate</CardTitle>
          <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {completionRate.toFixed(1)}%
          </div>
          <div className="mt-2">
            <Progress value={completionRate} className="h-2" />
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            {stats.closed} of {stats.total} constraints resolved
          </p>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border-amber-200 dark:border-amber-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">Avg Days to Resolve</CardTitle>
          <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{avgDaysOpen}</div>
            {trendsDirection === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            {trendsDirection === "up" ? "Improving" : "Needs attention"}
          </p>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Top Constraint Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCategories.map(([category, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{count}</span>
                        <Badge variant="outline" className="text-xs">
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(stats.byStatus).map(([status, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
              const getStatusColor = (status: string) => {
                switch (status) {
                  case "Closed":
                    return "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
                  case "In Progress":
                    return "bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                  case "Pending":
                    return "bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800"
                  case "Identified":
                    return "bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
                  default:
                    return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800"
                }
              }

              return (
                <div key={status} className="text-center">
                  <div className="text-2xl font-bold text-foreground">{count}</div>
                  <Badge className={`text-xs mt-1 ${getStatusColor(status)}`}>
                    {status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {percentage.toFixed(1)}%
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 