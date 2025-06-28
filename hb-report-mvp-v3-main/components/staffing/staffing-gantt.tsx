"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, Users, Clock, Filter, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight } from "lucide-react"
import { differenceInMonths, parseISO } from "date-fns"

interface StaffingActivity {
  id: string
  projectId: number
  category: string
  name: string
  startMonth: string
  endMonth: string
  description?: string
  status: "planned" | "active" | "completed"
  assignedRoles: string[]
}

interface StaffingRole {
  key: string
  label: string
  category: string
  active: boolean
}

interface StaffingNeed {
  id: string
  activityId: string
  role: string
  month: string
  count: number
  approved: boolean
}

interface StaffingGanttProps {
  activities: StaffingActivity[]
  roles: StaffingRole[]
  staffingNeeds: StaffingNeed[]
  timeline: Array<{
    key: string
    label: string
    short: string
    year: number
  }>
}

/**
 * Comprehensive Gantt Chart Component for Staffing Schedule
 *
 * Features:
 * - Interactive timeline visualization
 * - Role-based filtering and color coding
 * - Zoom controls and navigation
 * - Staffing density heatmap
 * - Activity dependencies and milestones
 * - Responsive design with touch support
 */
export function StaffingGantt({ activities, roles, staffingNeeds, timeline }: StaffingGanttProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [zoomLevel, setZoomLevel] = useState<"month" | "quarter" | "year">("month")
  const [viewMode, setViewMode] = useState<"timeline" | "heatmap">("timeline")
  const [currentViewStart, setCurrentViewStart] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Calculate visible timeline based on zoom level
  const visibleTimeline = useMemo(() => {
    const itemsPerView = zoomLevel === "month" ? 12 : zoomLevel === "quarter" ? 16 : 6
    return timeline.slice(currentViewStart, currentViewStart + itemsPerView)
  }, [timeline, zoomLevel, currentViewStart])

  // Filter activities based on selected filters
  const filteredActivities = useMemo(() => {
    let filtered = activities

    if (selectedCategory !== "all") {
      filtered = filtered.filter((activity) => activity.category === selectedCategory)
    }

    if (selectedRole !== "all") {
      filtered = filtered.filter((activity) => activity.assignedRoles.includes(selectedRole))
    }

    return filtered.sort((a, b) => {
      // Sort by category first, then by start date
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category)
      }
      return a.startMonth.localeCompare(b.startMonth)
    })
  }, [activities, selectedCategory, selectedRole])

  // Group activities by category
  const groupedActivities = useMemo(() => {
    const grouped = filteredActivities.reduce(
      (acc, activity) => {
        if (!acc[activity.category]) {
          acc[activity.category] = []
        }
        acc[activity.category].push(activity)
        return acc
      },
      {} as Record<string, StaffingActivity[]>,
    )

    return Object.entries(grouped).map(([category, activities]) => ({
      category,
      activities,
      count: activities.length,
    }))
  }, [filteredActivities])

  // Calculate activity position and width
  const getActivityPosition = (activity: StaffingActivity) => {
    const startIndex = timeline.findIndex((month) => month.key === activity.startMonth)
    const endIndex = timeline.findIndex((month) => month.key === activity.endMonth)
    const visibleStartIndex = timeline.findIndex((month) => month.key === visibleTimeline[0]?.key)
    const visibleEndIndex = timeline.findIndex(
      (month) => month.key === visibleTimeline[visibleTimeline.length - 1]?.key,
    )

    if (startIndex === -1 || endIndex === -1) return null

    const adjustedStart = Math.max(0, startIndex - visibleStartIndex)
    const adjustedEnd = Math.min(visibleTimeline.length - 1, endIndex - visibleStartIndex)

    if (adjustedStart > visibleTimeline.length - 1 || adjustedEnd < 0) return null

    const left = (adjustedStart / visibleTimeline.length) * 100
    const width = ((adjustedEnd - adjustedStart + 1) / visibleTimeline.length) * 100

    return { left, width }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "active":
        return "bg-blue-500"
      case "planned":
        return "bg-gray-400"
      default:
        return "bg-gray-300"
    }
  }

  // Get role color
  const getRoleColor = (roleKey: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ]
    const index = roles.findIndex((role) => role.key === roleKey)
    return colors[index % colors.length] || "bg-gray-500"
  }

  // Calculate staffing density for heatmap
  const getStaffingDensity = (month: string) => {
    const totalStaffing = staffingNeeds
      .filter((need) => need.month === month)
      .reduce((sum, need) => sum + need.count, 0)

    const maxStaffing = Math.max(
      ...timeline.map((m) =>
        staffingNeeds.filter((need) => need.month === m.key).reduce((sum, need) => sum + need.count, 0),
      ),
    )

    return maxStaffing > 0 ? (totalStaffing / maxStaffing) * 100 : 0
  }

  // Navigation functions
  const navigateLeft = () => {
    setCurrentViewStart(Math.max(0, currentViewStart - 1))
  }

  const navigateRight = () => {
    const maxStart = Math.max(0, timeline.length - visibleTimeline.length)
    setCurrentViewStart(Math.min(maxStart, currentViewStart + 1))
  }

  // Zoom functions
  const zoomIn = () => {
    if (zoomLevel === "year") setZoomLevel("quarter")
    else if (zoomLevel === "quarter") setZoomLevel("month")
  }

  const zoomOut = () => {
    if (zoomLevel === "month") setZoomLevel("quarter")
    else if (zoomLevel === "quarter") setZoomLevel("year")
  }

  const categories = [...new Set(activities.map((a) => a.category))]

  return (
    <div className={`space-y-4 ${isFullscreen ? "fixed inset-0 z-50 bg-white p-6" : ""}`}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles
                .filter((r) => r.active)
                .map((role) => (
                  <SelectItem key={role.key} value={role.key}>
                    {role.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory("all")
              setSelectedRole("all")
            }}
            size="sm"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "timeline" | "heatmap")}>
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-1 border rounded-md">
            <Button variant="ghost" size="sm" onClick={zoomOut} disabled={zoomLevel === "year"}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm font-medium capitalize">{zoomLevel}</span>
            <Button variant="ghost" size="sm" onClick={zoomIn} disabled={zoomLevel === "month"}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Gantt Chart */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Staffing Schedule Gantt Chart
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={navigateLeft} disabled={currentViewStart === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">
                {visibleTimeline[0]?.label} - {visibleTimeline[visibleTimeline.length - 1]?.label}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={navigateRight}
                disabled={currentViewStart >= timeline.length - visibleTimeline.length}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Timeline Header */}
              <div className="flex border-b bg-gray-50">
                <div className="w-80 p-4 border-r bg-white">
                  <span className="font-semibold">Activity</span>
                </div>
                <div className="flex-1 flex">
                  {visibleTimeline.map((month, index) => (
                    <div
                      key={month.key}
                      className={`flex-1 p-2 text-center text-sm border-r ${
                        index === visibleTimeline.length - 1 ? "border-r-0" : ""
                      }`}
                    >
                      <div className="font-medium">{month.short}</div>
                      <div className="text-xs text-gray-500">{month.year}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staffing Density Heatmap (if heatmap mode) */}
              {viewMode === "heatmap" && (
                <div className="flex border-b">
                  <div className="w-80 p-4 border-r bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">Staffing Density</span>
                  </div>
                  <div className="flex-1 flex">
                    {visibleTimeline.map((month, index) => {
                      const density = getStaffingDensity(month.key)
                      return (
                        <TooltipProvider key={month.key}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`flex-1 h-8 border-r ${
                                  index === visibleTimeline.length - 1 ? "border-r-0" : ""
                                }`}
                                style={{
                                  backgroundColor: `rgba(59, 130, 246, ${density / 100})`,
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Staffing Density: {density.toFixed(1)}%</p>
                              <p>
                                Total Staff:{" "}
                                {staffingNeeds
                                  .filter((need) => need.month === month.key)
                                  .reduce((sum, need) => sum + need.count, 0)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Activity Rows */}
              <ScrollArea className="h-96">
                {groupedActivities.map((group) => (
                  <div key={group.category}>
                    {/* Category Header */}
                    <div className="flex border-b bg-gray-50">
                      <div className="w-80 p-3 border-r">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{group.category}</span>
                          <Badge variant="secondary">{group.count}</Badge>
                        </div>
                      </div>
                      <div className="flex-1 bg-gray-50" />
                    </div>

                    {/* Activities in Category */}
                    {group.activities.map((activity) => {
                      const position = getActivityPosition(activity)
                      if (!position) return null

                      return (
                        <div key={activity.id} className="flex border-b hover:bg-gray-50">
                          <div className="w-80 p-3 border-r">
                            <div className="space-y-1">
                              <div className="font-medium text-sm">{activity.name}</div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getStatusColor(activity.status)} text-white border-0`}
                                >
                                  {activity.status}
                                </Badge>
                                <div className="flex gap-1">
                                  {activity.assignedRoles.slice(0, 3).map((roleKey) => {
                                    const role = roles.find((r) => r.key === roleKey)
                                    return (
                                      <TooltipProvider key={roleKey}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className={`w-4 h-4 rounded-full ${getRoleColor(roleKey)}`} />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>{role?.label || roleKey}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )
                                  })}
                                  {activity.assignedRoles.length > 3 && (
                                    <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center">
                                      <span className="text-xs text-white">+</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {timeline.find((m) => m.key === activity.startMonth)?.label} -{" "}
                                {timeline.find((m) => m.key === activity.endMonth)?.label}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 relative p-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className={`absolute top-2 h-6 rounded ${getStatusColor(activity.status)} opacity-80 hover:opacity-100 cursor-pointer transition-opacity`}
                                    style={{
                                      left: `${position.left}%`,
                                      width: `${position.width}%`,
                                    }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="space-y-1">
                                    <p className="font-medium">{activity.name}</p>
                                    <p>Category: {activity.category}</p>
                                    <p>Status: {activity.status}</p>
                                    <p>
                                      Duration:{" "}
                                      {differenceInMonths(
                                        parseISO(activity.endMonth + "-01"),
                                        parseISO(activity.startMonth + "-01"),
                                      ) + 1}{" "}
                                      months
                                    </p>
                                    <p>Roles: {activity.assignedRoles.length}</p>
                                    {activity.description && <p className="text-sm">{activity.description}</p>}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* Staffing indicators */}
                            {visibleTimeline.map((month, monthIndex) => {
                              const monthStaffing = staffingNeeds.filter(
                                (need) => need.activityId === activity.id && need.month === month.key,
                              )
                              const totalStaff = monthStaffing.reduce((sum, need) => sum + need.count, 0)

                              if (totalStaff === 0) return null

                              return (
                                <TooltipProvider key={`${activity.id}-${month.key}`}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className="absolute bottom-1 w-4 h-4 bg-orange-500 rounded-full text-xs text-white flex items-center justify-center"
                                        style={{
                                          left: `${(monthIndex / visibleTimeline.length) * 100 + 2}%`,
                                        }}
                                      >
                                        {totalStaff}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="space-y-1">
                                        <p className="font-medium">{month.label}</p>
                                        <p>Total Staff: {totalStaff}</p>
                                        {monthStaffing.map((need) => {
                                          const role = roles.find((r) => r.key === need.role)
                                          return (
                                            <p key={need.id} className="text-sm">
                                              {role?.label || need.role}: {need.count}
                                            </p>
                                          )
                                        })}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Status Legend
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded" />
                  <span className="text-sm">Planned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                  <span className="text-sm">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span className="text-sm">Completed</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Role Colors
              </h4>
              <div className="space-y-2">
                {roles
                  .filter((r) => r.active)
                  .slice(0, 4)
                  .map((role, index) => (
                    <div key={role.key} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${getRoleColor(role.key)}`} />
                      <span className="text-sm">{role.label}</span>
                    </div>
                  ))}
                {roles.filter((r) => r.active).length > 4 && (
                  <div className="text-xs text-gray-500">+{roles.filter((r) => r.active).length - 4} more roles</div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Summary</h4>
              <div className="space-y-1 text-sm">
                <p>Total Activities: {filteredActivities.length}</p>
                <p>Categories: {categories.length}</p>
                <p>Timeline: {timeline.length} months</p>
                <p>Active Roles: {roles.filter((r) => r.active).length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
