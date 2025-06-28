"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Users,
  Calendar,
  Download,
  Edit,
  Trash2,
  Filter,
  Search,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { format, addMonths } from "date-fns"
import { StaffingGantt } from "@/components/staffing/staffing-gantt"

/**
 * Staffing Plan interface for type safety
 */
interface StaffingPlan {
  id: string
  projectId: number
  role: string
  headcount: number
  startDate: string
  endDate: string
  status: "planned" | "approved" | "active"
  approvedBy?: string
  approvalDate?: string
  comments?: string
}

/**
 * Activity interface for staffing activities
 */
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

/**
 * Staffing Need interface for monthly requirements
 */
interface StaffingNeed {
  id: string
  activityId: string
  role: string
  month: string
  count: number
  approved: boolean
}

/**
 * Role definition interface
 */
interface StaffingRole {
  key: string
  label: string
  category: string
  active: boolean
}

/**
 * Staffing Schedule Page Component
 *
 * Comprehensive staffing management system with:
 * - Activity management with Gantt visualization
 * - Role-based staffing requirements tracking
 * - Approval workflow for different user roles
 * - Export functionality and filtering
 * - Resizable layout for optimal viewing
 *
 * @returns {JSX.Element} Staffing schedule interface
 */
export default function StaffingSchedulePage() {
  const { user } = useAuth()

  // Core state management
  const [activities, setActivities] = useState<StaffingActivity[]>([])
  const [staffingPlans, setStaffingPlans] = useState<StaffingPlan[]>([])
  const [staffingNeeds, setStaffingNeeds] = useState<StaffingNeed[]>([])
  const [roles, setRoles] = useState<StaffingRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UI state management
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<StaffingActivity | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  // Form state for create/edit operations
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    startMonth: "",
    endMonth: "",
    description: "",
    assignedRoles: [] as string[],
  })

  /**
   * Generate timeline months for the staffing schedule (2025-2027)
   */
  const timeline = useMemo(() => {
    const months = []
    const start = new Date(2025, 2, 1) // March 2025
    const end = new Date(2027, 11, 31) // December 2027

    let current = new Date(start)
    while (current <= end) {
      months.push({
        key: format(current, "yyyy-MM"),
        label: format(current, "MMM yyyy"),
        short: format(current, "MMM"),
        year: current.getFullYear(),
      })
      current = addMonths(current, 1)
    }

    return months
  }, [])

  /**
   * Generate comprehensive mock data for staffing management
   */
  const generateMockData = useCallback(() => {
    const mockRoles: StaffingRole[] = [
      { key: "PM1", label: "Project Manager I", category: "Management", active: true },
      { key: "PM2", label: "Project Manager II", category: "Management", active: true },
      { key: "PX", label: "Project Executive", category: "Executive", active: true },
      { key: "SE", label: "Site Engineer", category: "Engineering", active: true },
      { key: "QC", label: "Quality Control", category: "Quality", active: true },
      { key: "SF", label: "Safety Officer", category: "Safety", active: true },
      { key: "SU", label: "Superintendent", category: "Field", active: true },
      { key: "FE", label: "Field Engineer", category: "Engineering", active: true },
    ]

    const categories = ["Pre-Construction", "Foundation", "Structure", "MEP", "Finishes", "Close-out"]

    const mockActivities: StaffingActivity[] = []
    const mockStaffingNeeds: StaffingNeed[] = []

    categories.forEach((category, categoryIndex) => {
      // Generate 2-3 activities per category
      const activitiesPerCategory = Math.floor(Math.random() * 2) + 2

      for (let i = 0; i < activitiesPerCategory; i++) {
        const startMonthIndex = categoryIndex * 4 + i * 2
        const duration = Math.floor(Math.random() * 8) + 4 // 4-12 months

        const activity: StaffingActivity = {
          id: `activity-${categoryIndex}-${i}`,
          projectId: 1,
          category,
          name: `${category} Phase ${i + 1}`,
          startMonth: timeline[Math.min(startMonthIndex, timeline.length - duration - 1)]?.key || timeline[0].key,
          endMonth:
            timeline[Math.min(startMonthIndex + duration, timeline.length - 1)]?.key ||
            timeline[timeline.length - 1].key,
          description: `${category} activities including planning, execution, and quality control`,
          status: Math.random() > 0.7 ? "completed" : Math.random() > 0.4 ? "active" : "planned",
          assignedRoles: mockRoles.slice(0, Math.floor(Math.random() * 4) + 2).map((r) => r.key),
        }

        mockActivities.push(activity)

        // Generate staffing needs for this activity
        const activityStart = timeline.findIndex((m) => m.key === activity.startMonth)
        const activityEnd = timeline.findIndex((m) => m.key === activity.endMonth)

        activity.assignedRoles.forEach((roleKey) => {
          for (let monthIndex = activityStart; monthIndex <= activityEnd; monthIndex++) {
            if (monthIndex >= 0 && monthIndex < timeline.length) {
              const baseCount = roleKey.includes("PM") || roleKey === "PX" ? 1 : Math.floor(Math.random() * 3) + 1
              const need: StaffingNeed = {
                id: `need-${activity.id}-${roleKey}-${timeline[monthIndex].key}`,
                activityId: activity.id,
                role: roleKey,
                month: timeline[monthIndex].key,
                count: baseCount,
                approved: Math.random() > 0.3,
              }
              mockStaffingNeeds.push(need)
            }
          }
        })
      }
    })

    const mockStaffingPlans: StaffingPlan[] = mockRoles.map((role) => ({
      id: `plan-${role.key}`,
      projectId: 1,
      role: role.key,
      headcount: Math.floor(Math.random() * 5) + 1,
      startDate: timeline[0].key,
      endDate: timeline[timeline.length - 1].key,
      status: Math.random() > 0.5 ? "approved" : "planned",
      approvedBy: Math.random() > 0.5 ? "John Executive" : undefined,
      approvalDate: Math.random() > 0.5 ? new Date().toISOString() : undefined,
      comments: "Standard staffing allocation for project duration",
    }))

    return {
      activities: mockActivities,
      staffingPlans: mockStaffingPlans,
      staffingNeeds: mockStaffingNeeds,
      roles: mockRoles,
    }
  }, [timeline])

  /**
   * Load staffing data on component mount
   */
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockData = generateMockData()
        setActivities(mockData.activities)
        setStaffingPlans(mockData.staffingPlans)
        setStaffingNeeds(mockData.staffingNeeds)
        setRoles(mockData.roles)

        toast({
          title: "Data Loaded",
          description: `Loaded ${mockData.activities.length} activities and ${mockData.staffingPlans.length} staffing plans.`,
        })
      } catch (err) {
        setError("Failed to load staffing data")
        toast({
          title: "Error",
          description: "Failed to load staffing data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [generateMockData])

  /**
   * Filter activities based on search and filter criteria
   */
  const filteredActivities = useMemo(() => {
    let filtered = activities

    if (searchTerm) {
      filtered = filtered.filter(
        (activity) =>
          activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedRole !== "all") {
      filtered = filtered.filter((activity) => activity.assignedRoles.includes(selectedRole))
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((activity) => activity.status === selectedStatus)
    }

    return filtered
  }, [activities, searchTerm, selectedRole, selectedStatus])

  /**
   * Group activities by category
   */
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
      activities: activities.sort((a, b) => a.name.localeCompare(b.name)),
      count: activities.length,
    }))
  }, [filteredActivities])

  /**
   * Calculate summary statistics
   */
  const summaryStats = useMemo(() => {
    const totalActivities = activities.length
    const activeActivities = activities.filter((a) => a.status === "active").length
    const completedActivities = activities.filter((a) => a.status === "completed").length
    const totalRoles = roles.filter((r) => r.active).length
    const approvedPlans = staffingPlans.filter((p) => p.status === "approved").length

    return {
      totalActivities,
      activeActivities,
      completedActivities,
      totalRoles,
      approvedPlans,
      pendingApproval: staffingPlans.length - approvedPlans,
    }
  }, [activities, roles, staffingPlans])

  /**
   * Handle form input changes
   */
  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  /**
   * Handle create new activity
   */
  const handleCreate = async () => {
    try {
      const newActivity: StaffingActivity = {
        id: `activity-${Date.now()}`,
        projectId: selectedProject || 1,
        category: formData.category,
        name: formData.name,
        startMonth: formData.startMonth,
        endMonth: formData.endMonth,
        description: formData.description,
        status: "planned",
        assignedRoles: formData.assignedRoles,
      }

      // Validate dates
      const startIndex = timeline.findIndex((m) => m.key === formData.startMonth)
      const endIndex = timeline.findIndex((m) => m.key === formData.endMonth)

      if (startIndex >= endIndex) {
        toast({
          title: "Validation Error",
          description: "End date must be after start date.",
          variant: "destructive",
        })
        return
      }

      setActivities((prev) => [...prev, newActivity])
      setIsCreateDialogOpen(false)
      setFormData({
        category: "",
        name: "",
        startMonth: "",
        endMonth: "",
        description: "",
        assignedRoles: [],
      })

      toast({
        title: "Activity Created",
        description: "Staffing activity has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  /**
   * Handle edit activity
   */
  const handleEdit = (activity: StaffingActivity) => {
    setEditingActivity(activity)
    setFormData({
      category: activity.category,
      name: activity.name,
      startMonth: activity.startMonth,
      endMonth: activity.endMonth,
      description: activity.description || "",
      assignedRoles: activity.assignedRoles,
    })
    setIsEditDialogOpen(true)
  }

  /**
   * Handle update activity
   */
  const handleUpdate = async () => {
    if (!editingActivity) return

    try {
      const updatedActivity: StaffingActivity = {
        ...editingActivity,
        category: formData.category,
        name: formData.name,
        startMonth: formData.startMonth,
        endMonth: formData.endMonth,
        description: formData.description,
        assignedRoles: formData.assignedRoles,
      }

      setActivities((prev) => prev.map((activity) => (activity.id === editingActivity.id ? updatedActivity : activity)))
      setIsEditDialogOpen(false)
      setEditingActivity(null)
      setFormData({
        category: "",
        name: "",
        startMonth: "",
        endMonth: "",
        description: "",
        assignedRoles: [],
      })

      toast({
        title: "Activity Updated",
        description: "Staffing activity has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  /**
   * Handle delete activity
   */
  const handleDelete = async (activityId: string) => {
    try {
      setActivities((prev) => prev.filter((activity) => activity.id !== activityId))
      setStaffingNeeds((prev) => prev.filter((need) => need.activityId !== activityId))

      toast({
        title: "Activity Deleted",
        description: "Staffing activity has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  /**
   * Handle export data to CSV
   */
  const handleExport = (type: "activities" | "staffing" | "all") => {
    let csvContent = ""

    if (type === "activities" || type === "all") {
      const activityHeaders = [
        "Category",
        "Activity",
        "Start Month",
        "End Month",
        "Status",
        "Assigned Roles",
        "Description",
      ]
      const activityData = filteredActivities.map((activity) => [
        activity.category,
        activity.name,
        timeline.find((m) => m.key === activity.startMonth)?.label || activity.startMonth,
        timeline.find((m) => m.key === activity.endMonth)?.label || activity.endMonth,
        activity.status,
        activity.assignedRoles.join("; "),
        activity.description || "",
      ])

      csvContent += "Activities\n"
      csvContent += activityHeaders.join(",") + "\n"
      csvContent += activityData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
      csvContent += "\n\n"
    }

    if (type === "staffing" || type === "all") {
      const staffingHeaders = ["Role", "Activity", "Month", "Count", "Approved"]
      const staffingData = staffingNeeds
        .filter((need) => filteredActivities.some((a) => a.id === need.activityId))
        .map((need) => {
          const activity = activities.find((a) => a.id === need.activityId)
          const role = roles.find((r) => r.key === need.role)
          const month = timeline.find((m) => m.key === need.month)

          return [
            role?.label || need.role,
            activity?.name || "Unknown Activity",
            month?.label || need.month,
            need.count.toString(),
            need.approved ? "Yes" : "No",
          ]
        })

      csvContent += "Staffing Needs\n"
      csvContent += staffingHeaders.join(",") + "\n"
      csvContent += staffingData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `staffing-schedule-${type}-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: `Staffing ${type} data has been exported successfully.`,
    })
  }

  /**
   * Toggle category expansion
   */
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  /**
   * Get status badge component
   */
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planned: { variant: "outline" as const, className: "bg-blue-100 text-blue-800" },
      active: { variant: "default" as const, className: "bg-green-100 text-green-800" },
      completed: { variant: "secondary" as const, className: "bg-gray-100 text-gray-800" },
      approved: { variant: "default" as const, className: "bg-green-100 text-green-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planned

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  /**
   * Check if user can edit based on role
   */
  const canEdit = () => {
    return user?.role === "project-manager" || user?.role === "c-suite" || user?.role === "admin"
  }

  /**
   * Check if user can approve
   */
  const canApprove = () => {
    return user?.role === "project-executive" || user?.role === "c-suite"
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">Staffing Schedule</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Manage staffing plans, activities, and resource allocation across project timelines
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <Button variant="outline" onClick={() => handleExport("all")} className="gap-2 text-sm">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            {canEdit() && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#FF6B35] hover:bg-[#E55A2B] gap-2 text-sm">
                    <Plus className="h-4 w-4" />
                    Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create Staffing Activity</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pre-Construction">Pre-Construction</SelectItem>
                            <SelectItem value="Foundation">Foundation</SelectItem>
                            <SelectItem value="Structure">Structure</SelectItem>
                            <SelectItem value="MEP">MEP</SelectItem>
                            <SelectItem value="Finishes">Finishes</SelectItem>
                            <SelectItem value="Close-out">Close-out</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Activity Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter activity name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startMonth">Start Month</Label>
                        <Select
                          value={formData.startMonth}
                          onValueChange={(value) => handleInputChange("startMonth", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select start month" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeline.map((month) => (
                              <SelectItem key={month.key} value={month.key}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endMonth">End Month</Label>
                        <Select
                          value={formData.endMonth}
                          onValueChange={(value) => handleInputChange("endMonth", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select end month" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeline.map((month) => (
                              <SelectItem key={month.key} value={month.key}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedRoles">Assigned Roles</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {roles
                          .filter((r) => r.active)
                          .map((role) => (
                            <label key={role.key} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.assignedRoles.includes(role.key)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleInputChange("assignedRoles", [...formData.assignedRoles, role.key])
                                  } else {
                                    handleInputChange(
                                      "assignedRoles",
                                      formData.assignedRoles.filter((r) => r !== role.key),
                                    )
                                  }
                                }}
                                className="rounded"
                              />
                              <span className="text-sm">{role.label}</span>
                            </label>
                          ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Activity description"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreate}>Create Activity</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalActivities}</div>
            <p className="text-xs text-muted-foreground">
              {summaryStats.activeActivities} active, {summaryStats.completedActivities} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalRoles}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Plans</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.approvedPlans}</div>
            <p className="text-xs text-muted-foreground">{summaryStats.pendingApproval} pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeline.length}</div>
            <p className="text-xs text-muted-foreground">Months (Mar 2025 - Dec 2027)</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search activities, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2 items-center">
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

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedRole("all")
                    setSelectedStatus("all")
                  }}
                  size="sm"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Showing {filteredActivities.length} of {activities.length} activities
              </span>
              {(searchTerm || selectedRole !== "all" || selectedStatus !== "all") && (
                <Badge variant="secondary">Filtered</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="staffing">Staffing Needs</TabsTrigger>
          <TabsTrigger value="gantt">Gantt View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Activities by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupedActivities.map((group) => (
                    <div key={group.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{group.category}</h4>
                        <p className="text-sm text-gray-600">{group.count} activities</p>
                      </div>
                      <Badge variant="secondary">{group.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Role Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roles
                    .filter((r) => r.active)
                    .map((role) => {
                      const assignedActivities = activities.filter((a) => a.assignedRoles.includes(role.key)).length
                      return (
                        <div key={role.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{role.label}</h4>
                            <p className="text-sm text-gray-600">{role.category}</p>
                          </div>
                          <Badge variant="secondary">{assignedActivities}</Badge>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupedActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No activities found matching your criteria</div>
                ) : (
                  groupedActivities.map((group) => (
                    <div key={group.category} className="border rounded-lg">
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleCategory(group.category)}
                      >
                        <div className="flex items-center gap-2">
                          {expandedCategories.has(group.category) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <h3 className="font-semibold">{group.category}</h3>
                          <Badge variant="secondary">{group.count}</Badge>
                        </div>
                      </div>

                      {expandedCategories.has(group.category) && (
                        <div className="border-t">
                          {group.activities.map((activity) => (
                            <div key={activity.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-4">
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-medium text-gray-900 truncate">{activity.name}</h4>
                                      <p className="text-sm text-gray-600">
                                        {timeline.find((m) => m.key === activity.startMonth)?.label} -{" "}
                                        {timeline.find((m) => m.key === activity.endMonth)?.label}
                                      </p>
                                      {activity.description && (
                                        <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {getStatusBadge(activity.status)}
                                      <div className="flex flex-wrap gap-1">
                                        {activity.assignedRoles.slice(0, 3).map((roleKey) => {
                                          const role = roles.find((r) => r.key === roleKey)
                                          return (
                                            <Badge key={roleKey} variant="outline" className="text-xs">
                                              {role?.label || roleKey}
                                            </Badge>
                                          )
                                        })}
                                        {activity.assignedRoles.length > 3 && (
                                          <Badge variant="outline" className="text-xs">
                                            +{activity.assignedRoles.length - 3}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {canEdit() && (
                                  <div className="flex items-center gap-2 ml-4">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(activity)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(activity.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staffing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staffing Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48 sticky left-0 bg-white">Role</TableHead>
                      {timeline.slice(0, 12).map((month) => (
                        <TableHead key={month.key} className="text-center min-w-20">
                          {month.short} {month.year}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles
                      .filter((r) => r.active)
                      .map((role) => (
                        <TableRow key={role.key}>
                          <TableCell className="font-medium sticky left-0 bg-white">{role.label}</TableCell>
                          {timeline.slice(0, 12).map((month) => {
                            const totalNeeds = staffingNeeds
                              .filter((need) => need.role === role.key && need.month === month.key)
                              .reduce((sum, need) => sum + need.count, 0)

                            return (
                              <TableCell key={month.key} className="text-center">
                                {totalNeeds > 0 ? (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                    {totalNeeds}
                                  </Badge>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Showing first 12 months. Use export function to view complete timeline.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gantt" className="space-y-4">
          <StaffingGantt
            activities={filteredActivities}
            roles={roles}
            staffingNeeds={staffingNeeds}
            timeline={timeline}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Staffing Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pre-Construction">Pre-Construction</SelectItem>
                    <SelectItem value="Foundation">Foundation</SelectItem>
                    <SelectItem value="Structure">Structure</SelectItem>
                    <SelectItem value="MEP">MEP</SelectItem>
                    <SelectItem value="Finishes">Finishes</SelectItem>
                    <SelectItem value="Close-out">Close-out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Activity Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter activity name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startMonth">Start Month</Label>
                <Select value={formData.startMonth} onValueChange={(value) => handleInputChange("startMonth", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select start month" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeline.map((month) => (
                      <SelectItem key={month.key} value={month.key}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endMonth">End Month</Label>
                <Select value={formData.endMonth} onValueChange={(value) => handleInputChange("endMonth", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select end month" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeline.map((month) => (
                      <SelectItem key={month.key} value={month.key}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-assignedRoles">Assigned Roles</Label>
              <div className="grid grid-cols-2 gap-2">
                {roles
                  .filter((r) => r.active)
                  .map((role) => (
                    <label key={role.key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.assignedRoles.includes(role.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange("assignedRoles", [...formData.assignedRoles, role.key])
                          } else {
                            handleInputChange(
                              "assignedRoles",
                              formData.assignedRoles.filter((r) => r !== role.key),
                            )
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{role.label}</span>
                    </label>
                  ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Activity description"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update Activity</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
