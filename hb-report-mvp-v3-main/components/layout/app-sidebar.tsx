"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Building, Plane, Home, Factory, CheckCircle, Filter, ChevronLeft, ChevronRight, X } from "lucide-react"

const projectTypes = [
  { id: "active", label: "Active", icon: CheckCircle, count: 3, color: "text-green-600" },
  { id: "aviation", label: "Aviation", icon: Plane, count: 1, color: "text-blue-600" },
  { id: "residential", label: "Residential", icon: Home, count: 2, color: "text-purple-600" },
  { id: "commercial", label: "Commercial", icon: Building, count: 1, color: "text-orange-600" },
  { id: "industrial", label: "Industrial", icon: Factory, count: 1, color: "text-gray-600" },
]

const statusFilters = [
  { id: "all", label: "All Projects", count: 5 },
  { id: "active", label: "Active", count: 3, color: "bg-green-100 text-green-800" },
  { id: "completed", label: "Completed", count: 1, color: "bg-blue-100 text-blue-800" },
  { id: "on-hold", label: "On Hold", count: 1, color: "bg-yellow-100 text-yellow-800" },
]

interface AppSidebarProps {
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function AppSidebar({ isMobile, isOpen, onClose }: AppSidebarProps) {
  const { user } = useAuth()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Filter project types based on user role
  const getVisibleProjectTypes = () => {
    if (user?.role === "project-manager") {
      return projectTypes.filter((type) => ["active", "residential", "commercial"].includes(type.id))
    }
    return projectTypes
  }

  const sidebarWidth = isMobile ? "w-80" : isCollapsed ? "w-16" : "w-80"

  return (
    <aside
      className={cn(
        "bg-gray-50 border-l border-gray-200 transition-all duration-300 overflow-y-auto flex flex-col",
        sidebarWidth,
        isMobile && "h-full",
      )}
    >
      {/* Header with Close/Collapse Toggle */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {isMobile ? (
          <Button variant="ghost" size="sm" onClick={onClose} className="touch-target">
            <X className="h-4 w-4" />
            <span className="ml-2">Close</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full justify-center"
          >
            {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {!isCollapsed && <span className="ml-2">Collapse</span>}
          </Button>
        )}
      </div>

      {(!isCollapsed || isMobile) && (
        <div className="p-4 space-y-6 flex-1">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Quick Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Projects</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active</span>
                <Badge className="bg-green-100 text-green-800">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">At Risk</span>
                <Badge className="bg-red-100 text-red-800">1</Badge>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Status Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <h3 className="font-medium text-gray-900">Filter by Status</h3>
            </div>
            <div className="space-y-1">
              {statusFilters.map((status) => (
                <Button
                  key={status.id}
                  variant={selectedStatus === status.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-between h-auto py-3 px-3 touch-target",
                    selectedStatus === status.id && "bg-blue-50 text-blue-700 border-blue-200",
                  )}
                  onClick={() => setSelectedStatus(status.id)}
                >
                  <span className="text-sm">{status.label}</span>
                  <Badge variant="secondary" className={cn("ml-2", status.color || "bg-gray-100 text-gray-700")}>
                    {status.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Project Types */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Project Types</h3>
            <div className="space-y-1">
              {getVisibleProjectTypes().map((type) => {
                const Icon = type.icon
                return (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between h-auto py-3 px-3 touch-target",
                      selectedType === type.id && "bg-blue-50 text-blue-700 border-blue-200",
                    )}
                    onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("h-4 w-4", type.color)} />
                      <span className="text-sm font-medium">{type.label}</span>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {type.count}
                    </Badge>
                  </Button>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Recent Activity */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border touch-target">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Report Published</p>
                  <p className="text-xs text-gray-500 truncate">Panther Tower South - Weekly Report</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border touch-target">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Budget Updated</p>
                  <p className="text-xs text-gray-500 truncate">Sandbox Test Project</p>
                  <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border touch-target">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Schedule Risk</p>
                  <p className="text-xs text-gray-500 truncate">Metro Office Complex</p>
                  <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Role Info */}
          {user && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-900">
                    {user.role === "c-suite" && "C-Suite Access"}
                    {user.role === "project-executive" && "Executive Access"}
                    {user.role === "project-manager" && "Manager Access"}
                    {user.role === "admin" && "Admin Access"}
                    {user.role === "estimator" && "Estimator Access"}
                  </span>
                </div>
                <p className="text-xs text-blue-700">
                  {user.role === "c-suite" && "View all projects and reports"}
                  {user.role === "project-executive" && "Manage up to 5 projects"}
                  {user.role === "project-manager" && "Full access to assigned projects"}
                  {user.role === "admin" && "System configuration and user management"}
                  {user.role === "estimator" &&
                    "Manage bid setup, input, leveling, and aggregation for all Pre-Construction projects assigned"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Collapsed state indicators - Desktop only */}
      {isCollapsed && !isMobile && (
        <div className="p-2 space-y-2">
          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center touch-target">
            <span className="text-xs font-bold text-green-800">3</span>
          </div>
          <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center touch-target">
            <span className="text-xs font-bold text-red-800">1</span>
          </div>
        </div>
      )}
    </aside>
  )
}
