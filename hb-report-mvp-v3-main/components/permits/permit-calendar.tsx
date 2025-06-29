"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Permit, Project } from "@/types"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

interface PermitCalendarProps {
  permits: Permit[]
  projects: Project[]
  onEditPermit: (permit: Permit) => void
  onCreatePermit: () => void
}

export function PermitCalendar({ permits, projects, onEditPermit, onCreatePermit }: PermitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getProjectName = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId)
    return project?.name || `Project ${projectId}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "expired":
        return "bg-red-100 text-red-800 border-red-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Generate calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const currentDay = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      const dayPermits = permits.filter((permit) => {
        const permitDate = new Date(permit.applicationDate)
        return permitDate.toDateString() === currentDay.toDateString()
      })

      const expiringPermits = permits.filter((permit) => {
        if (!permit.expirationDate) return false
        const expirationDate = new Date(permit.expirationDate)
        return expirationDate.toDateString() === currentDay.toDateString()
      })

      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === new Date().toDateString(),
        permits: dayPermits,
        expiringPermits,
      })

      currentDay.setDate(currentDay.getDate() + 1)
    }

    return days
  }, [currentDate, permits])

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Permit Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-gray-200 ${
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                } ${day.isToday ? "ring-2 ring-blue-500" : ""}`}
              >
                <div
                  className={`text-sm font-medium mb-2 ${
                    day.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                  } ${day.isToday ? "text-blue-600" : ""}`}
                >
                  {day.date.getDate()}
                </div>

                <div className="space-y-1">
                  {/* Application Permits */}
                  {day.permits.slice(0, 2).map((permit) => (
                    <button
                      key={permit.id}
                      onClick={() => onEditPermit(permit)}
                      className={`w-full text-left p-1 rounded text-xs border ${getStatusColor(permit.status)} hover:shadow-sm transition-shadow`}
                    >
                      <div className="font-medium truncate">{permit.number}</div>
                      <div className="text-xs opacity-75 truncate">{permit.type}</div>
                    </button>
                  ))}

                  {/* Expiring Permits */}
                  {day.expiringPermits.slice(0, 1).map((permit) => (
                    <button
                      key={`exp-${permit.id}`}
                      onClick={() => onEditPermit(permit)}
                      className="w-full text-left p-1 rounded text-xs border border-red-300 bg-red-50 text-red-800 hover:shadow-sm transition-shadow"
                    >
                      <div className="font-medium truncate">⚠️ {permit.number}</div>
                      <div className="text-xs opacity-75">Expires</div>
                    </button>
                  ))}

                  {/* Show more indicator */}
                  {day.permits.length + day.expiringPermits.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{day.permits.length + day.expiringPermits.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border bg-green-100 border-green-200"></div>
              <span className="text-sm">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border bg-yellow-100 border-yellow-200"></div>
              <span className="text-sm">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border bg-red-100 border-red-200"></div>
              <span className="text-sm">Expired/Rejected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border bg-red-50 border-red-300"></div>
              <span className="text-sm">Expiring Soon</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
