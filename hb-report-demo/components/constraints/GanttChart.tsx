"use client"

import React, { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar, 
  BarChart3, 
  Filter, 
  ZoomIn, 
  ZoomOut,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target
} from "lucide-react"
import type { Constraint } from "@/types/constraint"
import { format, addDays, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"

interface GanttChartProps {
  constraints: Constraint[]
}

interface GanttItem {
  id: string
  name: string
  category: string
  startDate: Date
  endDate: Date
  status: string
  assigned: string
  isOverdue: boolean
  progress: number
}

export function GanttChart({ constraints }: GanttChartProps) {
  const [viewMode, setViewMode] = useState<"week" | "month" | "quarter">("month")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Convert constraints to Gantt items
  const ganttItems = useMemo((): GanttItem[] => {
    return constraints
      .filter(constraint => constraint.dateIdentified && constraint.dueDate)
      .map(constraint => {
        const startDate = new Date(constraint.dateIdentified)
        const endDate = new Date(constraint.dueDate)
        const now = new Date()
        const totalDays = differenceInDays(endDate, startDate)
        const elapsedDays = Math.min(differenceInDays(now, startDate), totalDays)
        const progress = totalDays > 0 ? Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100)) : 0

        return {
          id: constraint.id,
          name: `${constraint.no} - ${constraint.description.substring(0, 50)}${constraint.description.length > 50 ? '...' : ''}`,
          category: constraint.category,
          startDate,
          endDate,
          status: constraint.completionStatus,
          assigned: constraint.assigned,
          isOverdue: constraint.completionStatus !== "Closed" && endDate < now,
          progress: constraint.completionStatus === "Closed" ? 100 : progress
        }
      })
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  }, [constraints])

  // Filter items
  const filteredItems = useMemo(() => {
    return ganttItems.filter(item => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false
      if (selectedStatus !== "all" && item.status !== selectedStatus) return false
      return true
    })
  }, [ganttItems, selectedCategory, selectedStatus])

  // Calculate date range
  const dateRange = useMemo(() => {
    if (filteredItems.length === 0) {
      const now = new Date()
      return {
        start: startOfWeek(now),
        end: endOfWeek(addDays(now, 30))
      }
    }

    const minDate = new Date(Math.min(...filteredItems.map(item => item.startDate.getTime())))
    const maxDate = new Date(Math.max(...filteredItems.map(item => item.endDate.getTime())))
    
    // Add some padding
    const start = startOfWeek(addDays(minDate, -7))
    const end = endOfWeek(addDays(maxDate, 7))

    return { start, end }
  }, [filteredItems])

  // Generate time periods based on view mode
  const timePeriods = useMemo(() => {
    const { start, end } = dateRange
    const days = eachDayOfInterval({ start, end })
    
    switch (viewMode) {
      case "week":
        return days.filter((_, index) => index % 7 === 0)
      case "month":
        return days.filter(day => day.getDate() === 1)
      case "quarter":
        return days.filter(day => day.getDate() === 1 && day.getMonth() % 3 === 0)
      default:
        return days.filter(day => day.getDate() === 1)
    }
  }, [dateRange, viewMode])

  // Get unique categories and statuses
  const categories = useMemo(() => {
    return [...new Set(ganttItems.map(item => item.category))].sort()
  }, [ganttItems])

  const statuses = useMemo(() => {
    return [...new Set(ganttItems.map(item => item.status))].sort()
  }, [ganttItems])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Closed":
        return "bg-green-500 dark:bg-green-600"
      case "In Progress":
        return "bg-blue-500 dark:bg-blue-600"
      case "Pending":
        return "bg-amber-500 dark:bg-amber-600"
      case "Identified":
        return "bg-red-500 dark:bg-red-600"
      default:
        return "bg-gray-500 dark:bg-gray-600"
    }
  }

  const getProgressColor = (progress: number, isOverdue: boolean) => {
    if (isOverdue) return "bg-red-500 dark:bg-red-600"
    if (progress >= 100) return "bg-green-500 dark:bg-green-600"
    if (progress >= 75) return "bg-blue-500 dark:bg-blue-600"
    if (progress >= 50) return "bg-amber-500 dark:bg-amber-600"
    return "bg-gray-400 dark:bg-gray-500"
  }

  const calculatePosition = (date: Date) => {
    const { start, end } = dateRange
    const totalDays = differenceInDays(end, start)
    const daysSinceStart = differenceInDays(date, start)
    return Math.max(0, Math.min(100, (daysSinceStart / totalDays) * 100))
  }

  const calculateWidth = (startDate: Date, endDate: Date) => {
    const { start, end } = dateRange
    const totalDays = differenceInDays(end, start)
    const itemDays = differenceInDays(endDate, startDate)
    return Math.max(1, (itemDays / totalDays) * 100)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Constraint Timeline
            <Badge variant="outline" className="ml-2">
              {filteredItems.length} items
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(value: "week" | "month" | "quarter") => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No constraints to display
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Adjust your filters or check back when constraints have been added.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Timeline Header */}
            <div className="relative">
              <div className="flex border-b border-gray-200 dark:border-gray-700 pb-2">
                <div className="w-80 flex-shrink-0 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Constraint
                </div>
                <div className="flex-1 relative">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    {timePeriods.map((period, index) => (
                      <div key={index} style={{ left: `${calculatePosition(period)}%` }} className="absolute">
                        {format(period, viewMode === "week" ? "MMM dd" : viewMode === "month" ? "MMM yyyy" : "Qo yyyy")}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Rows */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center">
                  {/* Constraint Info */}
                  <div className="w-80 flex-shrink-0 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {item.status === "Closed" ? (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : item.isOverdue ? (
                          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        ) : (
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.category.split('.')[0]}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.assigned}
                      </span>
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="flex-1 relative h-8">
                    <div className="absolute inset-y-0 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
                    
                    {/* Constraint Bar */}
                    <div
                      className={`absolute inset-y-1 rounded ${getStatusColor(item.status)} opacity-80`}
                      style={{
                        left: `${calculatePosition(item.startDate)}%`,
                        width: `${calculateWidth(item.startDate, item.endDate)}%`,
                      }}
                    >
                      {/* Progress Indicator */}
                      <div
                        className={`h-full rounded ${getProgressColor(item.progress, item.isOverdue)}`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>

                    {/* Today Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 dark:bg-red-400 z-10"
                      style={{ left: `${calculatePosition(new Date())}%` }}
                    ></div>
                  </div>

                  {/* Progress Info */}
                  <div className="w-20 flex-shrink-0 text-right">
                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      {item.progress.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {differenceInDays(item.endDate, item.startDate)}d
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Overdue</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Active</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Showing {format(dateRange.start, "MMM dd")} - {format(dateRange.end, "MMM dd, yyyy")}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 