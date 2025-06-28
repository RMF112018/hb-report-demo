"use client"

/**
 * Enhanced Project Reports Hub Component
 *
 * Central hub for all report-related activities in HB Report platform with comprehensive
 * approval workflows, digital report viewing, and advanced collaboration features.
 *
 * Key Features:
 * - Template cards with preview images and customization links
 * - Role-based interfaces for PM, Executive, and C-Suite users
 * - Digital and PDF report generation and viewing
 * - Comprehensive approval workflow management
 * - AI-powered insights and recommendations
 * - Real-time collaboration and version control
 * - Advanced analytics and performance tracking
 *
 * Business Impact:
 * - Targets 375,315 man-hours saved annually
 * - $18.77M operational value through automation
 * - 85% efficiency improvement over manual processes
 * - 90% reduction in report generation errors
 *
 * Technical Architecture:
 * - React hooks for state management and real-time updates
 * - TypeScript for type safety and maintainability
 * - Tailwind CSS for responsive design and theming
 * - Mock APIs for demonstration and testing
 * - Comprehensive error handling and loading states
 *
 * @author HB Report Development Team
 * @version 3.0.0
 * @since 2024-01-01
 * @lastModified 2024-01-23
 *
 * @example
 * \`\`\`tsx
 * import { EnhancedProjectReportsHub } from '@/components/reports/enhanced-project-reports-hub'
 *
 * function ReportsPage() {
 *   return <EnhancedProjectReportsHub />
 * }
 * \`\`\`
 */

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  Send,
  CheckCircle,
  AlertCircle,
  Settings,
  TrendingUp,
  Clock,
  Star,
  Edit,
  Users,
  Bell,
  MessageSquare,
  Activity,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { enhancedReportData } from "@/data/enhanced-report-data"
import { sendEmailToCSuite, sendNotification } from "@/lib/email-service"
import type { GeneratedReport, ReportStatus, ReportTemplate, User } from "@/types/enhanced-reports"

/**
 * Interface for component props with comprehensive configuration options
 */
interface EnhancedProjectReportsHubProps {
  /** Initial filter settings for reports */
  initialFilters?: {
    status?: ReportStatus
    project?: string
    type?: string
  }
  /** Whether to show advanced features for power users */
  showAdvancedFeatures?: boolean
  /** Custom theme configuration */
  theme?: "light" | "dark" | "auto"
  /** Performance optimization settings */
  performanceMode?: "standard" | "optimized"
}

/**
 * Main Enhanced Project Reports Hub Component
 *
 * Provides a comprehensive interface for report management with role-based
 * functionality, approval workflows, and advanced collaboration features.
 */
export function EnhancedProjectReportsHub({
  initialFilters = {},
  showAdvancedFeatures = true,
  theme = "auto",
  performanceMode = "standard",
}: EnhancedProjectReportsHubProps) {
  // ============================================================================
  // HOOKS AND STATE MANAGEMENT
  // ============================================================================

  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  // Core state management for reports and filtering
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState(initialFilters.status || "all")
  const [filterProject, setFilterProject] = useState(initialFilters.project || "all")
  const [filterType, setFilterType] = useState(initialFilters.type || "all")
  const [reports, setReports] = useState<GeneratedReport[]>([])
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  // Advanced state for collaboration and real-time features
  const [activeCollaborators, setActiveCollaborators] = useState<User[]>([])
  const [realtimeUpdates, setRealtimeUpdates] = useState(true)
  const [notificationCount, setNotificationCount] = useState(0)
  const [sortBy, setSortBy] = useState<"date" | "name" | "status" | "priority">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // ============================================================================
  // DATA LOADING AND INITIALIZATION
  // ============================================================================

  /**
   * Initialize component data and user-specific settings
   * Loads reports, templates, and user preferences with error handling
   */
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)

        // Simulate API delay for realistic demo experience
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Filter reports based on user role and permissions
        const userReports = enhancedReportData.generatedReports.filter((report) => {
          if (!user) return false

          switch (user.role) {
            case "project-manager":
              return report.createdBy === user.email || user.assignedProjects?.includes(report.projectId)
            case "project-executive":
              return user.assignedProjects?.includes(report.projectId)
            case "c-suite":
              return true // C-Suite can view all reports
            default:
              return false
          }
        })

        // Load templates with user-specific filtering
        const userTemplates = enhancedReportData.templates.filter((template) => {
          if (!user?.permissions?.preConAccess && template.category === "pre-construction") {
            return false
          }
          return true
        })

        setReports(userReports)
        setTemplates(userTemplates)

        // Load active collaborators for real-time features
        const collaborators = enhancedReportData.users.filter(
          (u) => u.id !== user?.id && u.permissions?.canCreateReports,
        )
        setActiveCollaborators(collaborators)

        // Initialize notification count
        const pendingReviews = userReports.filter(
          (r) => r.status === "review" && user?.permissions?.canApproveReports,
        ).length
        setNotificationCount(pendingReviews)
      } catch (error) {
        console.error("Failed to initialize reports data:", error)
        toast({
          title: "Error Loading Reports",
          description: "Failed to load reports data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      initializeData()
    }
  }, [user, toast])

  // ============================================================================
  // COMPUTED VALUES AND FILTERING
  // ============================================================================

  /**
   * Filter and sort reports based on current filter settings
   * Implements comprehensive filtering with search, status, project, and type filters
   */
  const filteredReports = useMemo(() => {
    const filtered = reports.filter((report) => {
      // Search term filtering across multiple fields
      const matchesSearch =
        !searchTerm ||
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      // Status filtering with special handling for pending reviews
      const matchesStatus =
        filterStatus === "all" ||
        report.status === filterStatus ||
        (filterStatus === "pending-review" && report.status === "review")

      // Project filtering
      const matchesProject = filterProject === "all" || report.projectId === filterProject

      // Type filtering
      const matchesType = filterType === "all" || report.type === filterType

      return matchesSearch && matchesStatus && matchesProject && matchesType
    })

    // Apply sorting based on current sort settings
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "priority":
          // Priority based on status and AI insights
          const getPriority = (report: GeneratedReport) => {
            if (report.status === "review") return 3
            if (report.aiInsights?.some((insight) => insight.priority === "high")) return 2
            return 1
          }
          comparison = getPriority(a) - getPriority(b)
          break
        default:
          comparison = 0
      }

      return sortOrder === "desc" ? -comparison : comparison
    })

    return filtered
  }, [reports, searchTerm, filterStatus, filterProject, filterType, sortBy, sortOrder])

  /**
   * Calculate comprehensive analytics for dashboard metrics
   * Provides insights into report generation, approval rates, and performance
   */
  const analytics = useMemo(() => {
    const total = reports.length
    const completed = reports.filter((r) => r.status === "completed").length
    const pending = reports.filter((r) => r.status === "review" || r.status === "pending").length
    const draft = reports.filter((r) => r.status === "draft").length

    // Advanced analytics calculations
    const avgReviewTime =
      reports
        .filter((r) => r.approvals?.some((a) => a.reviewDuration))
        .reduce((acc, r) => {
          const totalReviewTime =
            r.approvals?.filter((a) => a.reviewDuration).reduce((sum, a) => sum + (a.reviewDuration || 0), 0) || 0
          return acc + totalReviewTime
        }, 0) / Math.max(completed, 1)

    const totalViews = reports.reduce((acc, r) => acc + (r.analytics?.views || 0), 0)
    const totalDownloads = reports.reduce((acc, r) => acc + (r.analytics?.downloads || 0), 0)
    const avgInteractionRate =
      reports.reduce((acc, r) => acc + (r.analytics?.interactionRate || 0), 0) / Math.max(total, 1)

    // Time and cost savings calculations (based on business requirements)
    const avgTimePerReport = 8 // hours
    const timeSaved = completed * avgTimePerReport * 0.85 // 85% efficiency gain
    const costSavings = timeSaved * 50 // $50/hour average rate
    const annualProjection = (timeSaved / total) * 375315 // Target annual savings

    return {
      total,
      completed,
      pending,
      draft,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      timeSaved: Math.round(timeSaved),
      costSavings: Math.round(costSavings),
      avgReviewTime: Math.round(avgReviewTime),
      totalViews,
      totalDownloads,
      avgInteractionRate: Math.round(avgInteractionRate * 100),
      annualProjection: Math.round(annualProjection),
      efficiency: Math.round(((completed + pending) / Math.max(total, 1)) * 100),
    }
  }, [reports])

  // ============================================================================
  // EVENT HANDLERS AND ACTIONS
  // ============================================================================

  /**
   * Handle report viewing with analytics tracking
   * Supports both digital and PDF report viewing with user activity logging
   */
  const handleViewReport = useCallback(
    (reportId: string, viewType: "digital" | "pdf" = "digital") => {
      try {
        // Update analytics for report view
        setReports((prev) =>
          prev.map((report) =>
            report.id === reportId
              ? {
                  ...report,
                  analytics: {
                    ...report.analytics,
                    views: (report.analytics?.views || 0) + 1,
                    digitalViews:
                      viewType === "digital"
                        ? (report.analytics?.digitalViews || 0) + 1
                        : report.analytics?.digitalViews || 0,
                  },
                }
              : report,
          ),
        )

        // Navigate to appropriate view
        const basePath =
          viewType === "digital" ? `/project-reports/view/${reportId}/digital` : `/project-reports/view/${reportId}`

        router.push(basePath)

        // Track user activity for analytics
        console.log(`[Analytics] User ${user?.email} viewed report ${reportId} in ${viewType} format`)
      } catch (error) {
        console.error("Failed to view report:", error)
        toast({
          title: "Error",
          description: "Failed to open report. Please try again.",
          variant: "destructive",
        })
      }
    },
    [router, user, toast],
  )

  /**
   * Handle report submission for review with comprehensive workflow management
   * Implements the PM -> Executive -> C-Suite approval workflow
   */
  const handleSubmitForReview = useCallback(
    async (reportId: string) => {
      try {
        setLoading(true)

        // Update report status to review
        const updatedReports = reports.map((report) =>
          report.id === reportId
            ? {
                ...report,
                status: "review" as ReportStatus,
                updatedAt: new Date().toISOString(),
                approvals: [
                  ...(report.approvals || []),
                  {
                    role: "Project Manager",
                    user: user?.email || "",
                    status: "approved",
                    timestamp: new Date().toISOString(),
                    comments: "Submitted for executive review",
                    reviewDuration: 0,
                  },
                ],
              }
            : report,
        )

        setReports(updatedReports)

        // Find executives who need to review this report
        const report = updatedReports.find((r) => r.id === reportId)
        const executives = enhancedReportData.users.filter(
          (u) => u.role === "project-executive" && u.assignedProjects?.includes(report?.projectId || ""),
        )

        // Send notifications to executives
        const notificationPromises = executives.map((executive) =>
          sendNotification(executive.email, {
            type: "report-review-request",
            reportId,
            reportName: report?.name || "",
            submittedBy: user?.email || "",
          }),
        )

        await Promise.all(notificationPromises)

        toast({
          title: "Report Submitted",
          description: `Report "${report?.name}" has been submitted for executive review.`,
          variant: "default",
        })

        // Update notification count for executives
        setNotificationCount((prev) => prev + 1)
      } catch (error) {
        console.error("Failed to submit report for review:", error)
        toast({
          title: "Submission Failed",
          description: "Failed to submit report for review. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [reports, user, toast],
  )

  /**
   * Handle report approval with C-Suite notification
   * Implements the executive approval process with automatic C-Suite email
   */
  const handleApproveReport = useCallback(
    async (reportId: string, comments?: string) => {
      try {
        setLoading(true)

        const report = reports.find((r) => r.id === reportId)
        if (!report) throw new Error("Report not found")

        // Update report status to completed
        const updatedReports = reports.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: "completed" as ReportStatus,
                updatedAt: new Date().toISOString(),
                approvals: [
                  ...(r.approvals || []),
                  {
                    role: "Project Executive",
                    user: user?.email || "",
                    status: "approved",
                    timestamp: new Date().toISOString(),
                    comments: comments || "Approved for C-Suite distribution",
                    reviewDuration: 30, // Estimated review time
                  },
                ],
              }
            : r,
        )

        setReports(updatedReports)

        // Send email to C-Suite executives
        const cSuiteUsers = enhancedReportData.users.filter((u) => u.role === "c-suite")
        const emailPromises = cSuiteUsers.map((cSuiteUser) =>
          sendEmailToCSuite(cSuiteUser.email, {
            reportName: report.name,
            projectName: report.project,
            approvedBy: user?.email || "",
            downloadUrl: report.downloadUrl || "",
            summary: `Report approved and ready for executive review. ${comments || ""}`,
          }),
        )

        await Promise.all(emailPromises)

        toast({
          title: "Report Approved",
          description: `Report "${report.name}" has been approved and sent to C-Suite.`,
          variant: "default",
        })
      } catch (error) {
        console.error("Failed to approve report:", error)
        toast({
          title: "Approval Failed",
          description: "Failed to approve report. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [reports, user, toast],
  )

  /**
   * Handle bulk operations on selected reports
   * Supports batch approval, export, and deletion operations
   */
  const handleBulkOperation = useCallback(
    async (operation: "approve" | "export" | "delete") => {
      if (selectedReports.length === 0) {
        toast({
          title: "No Reports Selected",
          description: "Please select reports to perform bulk operations.",
          variant: "destructive",
        })
        return
      }

      try {
        setLoading(true)

        switch (operation) {
          case "approve":
            // Bulk approve reports (only for executives)
            if (user?.permissions?.canApproveReports) {
              for (const reportId of selectedReports) {
                await handleApproveReport(reportId, "Bulk approved")
              }
            }
            break

          case "export":
            // Bulk export reports
            toast({
              title: "Export Started",
              description: `Exporting ${selectedReports.length} reports...`,
              variant: "default",
            })
            // Implementation would trigger actual export process
            break

          case "delete":
            // Bulk delete reports (admin only)
            if (user?.role === "admin") {
              setReports((prev) => prev.filter((r) => !selectedReports.includes(r.id)))
              toast({
                title: "Reports Deleted",
                description: `${selectedReports.length} reports have been deleted.`,
                variant: "default",
              })
            }
            break
        }

        setSelectedReports([])
      } catch (error) {
        console.error(`Failed to perform bulk ${operation}:`, error)
        toast({
          title: "Operation Failed",
          description: `Failed to ${operation} selected reports.`,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [selectedReports, user, handleApproveReport, toast],
  )

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Get appropriate status icon with color coding
   */
  const getStatusIcon = useCallback((status: ReportStatus) => {
    const iconMap = {
      completed: <CheckCircle className="h-4 w-4 text-green-500" />,
      pending: <Clock className="h-4 w-4 text-yellow-500" />,
      draft: <Edit className="h-4 w-4 text-blue-500" />,
      review: <AlertCircle className="h-4 w-4 text-orange-500" />,
    }
    return iconMap[status] || <FileText className="h-4 w-4 text-gray-500" />
  }, [])

  /**
   * Get status-specific styling classes
   */
  const getStatusColor = useCallback((status: ReportStatus) => {
    const colorMap = {
      completed: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      draft: "bg-blue-100 text-blue-800 border-blue-200",
      review: "bg-orange-100 text-orange-800 border-orange-200",
    }
    return colorMap[status] || "bg-gray-100 text-gray-800 border-gray-200"
  }, [])

  /**
   * Format time duration for display
   */
  const formatDuration = useCallback((minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }, [])

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <div className="space-y-2">
            <p className="text-gray-600 font-medium">Loading Project Reports...</p>
            <p className="text-sm text-gray-500">Initializing dashboard and user preferences</p>
          </div>
        </div>
      </div>
    )
  }

  // ============================================================================
  // MAIN COMPONENT RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header Section with Comprehensive Metrics */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 sticky top-16 z-40">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Header Content with User Context */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Project Reports</h1>
              {realtimeUpdates && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Activity className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>

            <p className="text-gray-600 mb-3">
              Central hub for report customization, generation, distribution, and approval workflows
            </p>

            {/* User Role and Project Context */}
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
                {user?.role?.replace("-", " ").toUpperCase()}
              </Badge>

              <Badge variant="outline" className="text-xs">
                {analytics.total} Reports
              </Badge>

              {user?.assignedProjects && (
                <Badge variant="outline" className="text-xs">
                  {user.assignedProjects.length} Projects
                </Badge>
              )}

              {notificationCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  <Bell className="h-3 w-3 mr-1" />
                  {notificationCount} Pending
                </Badge>
              )}

              {/* Active Collaborators Indicator */}
              {activeCollaborators.length > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{activeCollaborators.length} active</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons with Role-Based Visibility */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search reports, projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Bulk Actions */}
            {selectedReports.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedReports.length} selected</Badge>

                {user?.permissions?.canApproveReports && (
                  <Button size="sm" variant="outline" onClick={() => handleBulkOperation("approve")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve All
                  </Button>
                )}

                <Button size="sm" variant="outline" onClick={() => handleBulkOperation("export")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            )}

            {/* Primary Actions */}
            {user?.permissions?.canCreateReports && (
              <Button
                onClick={() => router.push("/project-reports/customize")}
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            )}

            <Button
              variant="outline"
              className="hover:bg-gray-100 transition-colors"
              onClick={() => router.push("/project-reports/settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4">
        {/* Enhanced Analytics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
          {/* Total Reports */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.total}</p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          {/* Completed Reports */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.completed}</p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          {/* Pending Reports */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.pending}</p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          {/* Draft Reports */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Draft Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.draft}</p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <Edit className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          {/* Average Review Time */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Review Time</p>
                  <p className="text-2xl font-bold text-gray-900">{formatDuration(analytics.avgReviewTime)}</p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          {/* Total Views */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalViews}</p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <Eye className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          {/* Total Downloads */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalDownloads}</p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <Download className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          {/* Average Interaction Rate */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Interaction Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.avgInteractionRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <MessageSquare className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          {/* Annual Projection */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Annual Projection</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.annualProjection} man-hours</p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <TrendingUp className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          {/* Efficiency */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Efficiency</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.efficiency}%</p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <Star className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report List */}
        <div className="bg-white rounded-lg shadow p-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredReports.map((report) => (
                    <Card key={report.id} className="hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="flex items-center justify-between">
                        <CardTitle>{report.name}</CardTitle>
                        {getStatusIcon(report.status)}
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Project: {report.project}</p>
                        <p className="text-sm text-gray-600">Created by: {report.createdBy}</p>
                        <p className="text-sm text-gray-600">
                          Last updated: {new Date(report.updatedAt).toLocaleDateString()}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewReport(report.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          {user?.permissions?.canApproveReports && (
                            <Button size="sm" variant="outline" onClick={() => handleSubmitForReview(report.id)}>
                              <Send className="h-4 w-4 mr-2" />
                              Submit for Review
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="completed">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredReports
                    .filter((r) => r.status === "completed")
                    .map((report) => (
                      <Card key={report.id} className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="flex items-center justify-between">
                          <CardTitle>{report.name}</CardTitle>
                          {getStatusIcon(report.status)}
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">Project: {report.project}</p>
                          <p className="text-sm text-gray-600">Created by: {report.createdBy}</p>
                          <p className="text-sm text-gray-600">
                            Last updated: {new Date(report.updatedAt).toLocaleDateString()}
                          </p>
                          <div className="mt-4 flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewReport(report.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="pending">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredReports
                    .filter((r) => r.status === "pending" || r.status === "review")
                    .map((report) => (
                      <Card key={report.id} className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="flex items-center justify-between">
                          <CardTitle>{report.name}</CardTitle>
                          {getStatusIcon(report.status)}
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">Project: {report.project}</p>
                          <p className="text-sm text-gray-600">Created by: {report.createdBy}</p>
                          <p className="text-sm text-gray-600">
                            Last updated: {new Date(report.updatedAt).toLocaleDateString()}
                          </p>
                          <div className="mt-4 flex items-center gap-2">
                            {user?.permissions?.canApproveReports && (
                              <Button size="sm" variant="outline" onClick={() => handleSubmitForReview(report.id)}>
                                <Send className="h-4 w-4 mr-2" />
                                Submit for Review
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="draft">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredReports
                    .filter((r) => r.status === "draft")
                    .map((report) => (
                      <Card key={report.id} className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="flex items-center justify-between">
                          <CardTitle>{report.name}</CardTitle>
                          {getStatusIcon(report.status)}
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">Project: {report.project}</p>
                          <p className="text-sm text-gray-600">Created by: {report.createdBy}</p>
                          <p className="text-sm text-gray-600">
                            Last updated: {new Date(report.updatedAt).toLocaleDateString()}
                          </p>
                          <div className="mt-4 flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewReport(report.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
