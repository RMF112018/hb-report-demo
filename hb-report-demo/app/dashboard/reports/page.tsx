"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { StandardPageLayout, createDashboardBreadcrumbs } from "@/components/layout/StandardPageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  FileText, 
  Plus, 
  Download, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity,
  Eye,
  Edit3,
  Send,
  Calendar as CalendarIcon,
  Filter,
  Search,
  Brain,
  Lightbulb,
  Target,
  Users,
  AlertTriangle,
  DollarSign,
  Building,
  Timer
} from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

// Import report components
import { ReportCreator } from "@/components/reports/ReportCreator"
import { ReportViewer } from "@/components/reports/ReportViewer"
import { ReportApprovalWorkflow } from "@/components/reports/ReportApprovalWorkflow"
import { ReportHistory } from "@/components/reports/ReportHistory"
import { ReportAnalytics } from "@/components/reports/ReportAnalytics"

// Mock data imports
import reportsData from "@/data/mock/reports/reports.json"
import projectsData from "@/data/mock/projects.json"

interface Report {
  id: string
  name: string
  type: "financial-review" | "monthly-progress" | "monthly-owner"
  projectId: string
  projectName: string
  status: "draft" | "submitted" | "approved" | "rejected" | "published"
  creatorId: string
  creatorName: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
  distributedAt?: string
  sectionCount: number
  pageCount: number
  size: string
  version: number
  tags: string[]
}

interface DashboardStats {
  totalReports: number
  pendingApproval: number
  approved: number
  rejected: number
  thisMonth: number
  approvalRate: number
  avgProcessingTime: number
  timeSaved: number
  overdue: number
}

interface RecentActivity {
  id: string
  type: "created" | "submitted" | "approved" | "rejected" | "distributed"
  reportName: string
  projectName: string
  userName: string
  timestamp: string
  icon: React.ReactNode
}

export default function ReportsPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  // State management
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showReportCreator, setShowReportCreator] = useState(false)
  const [showReportViewer, setShowReportViewer] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  // Filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

  // Report templates
  const reportTemplates = [
    {
      id: "financial-review",
      name: "Monthly Financial Review",
      type: "financial-review" as const,
      description: "Comprehensive financial analysis with forecast memo, budget snapshots, and cost tracking",
      icon: <DollarSign className="h-6 w-6" />,
      sections: 4,
      estimatedTime: "45 min",
      workflow: "PM → PE → Executive",
      color: "bg-green-50 border-green-200 text-green-800"
    },
    {
      id: "monthly-progress",
      name: "Monthly Progress Report",
      type: "monthly-progress" as const,
      description: "Complete project status update with schedule, milestones, and performance metrics",
      icon: <BarChart3 className="h-6 w-6" />,
      sections: 12,
      estimatedTime: "60 min",
      workflow: "PM → PE → Published",
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      id: "monthly-owner",
      name: "Monthly Owner Report",
      type: "monthly-owner" as const,
      description: "Client-focused report with progress photos, schedule updates, and executive summary",
      icon: <Building className="h-6 w-6" />,
      sections: 6,
      estimatedTime: "30 min",
      workflow: "PM → PE → Client Distribution",
      color: "bg-purple-50 border-purple-200 text-purple-800"
    }
  ]

  // Initialize data
  useEffect(() => {
    loadReports()
  }, [user])

  // Apply filters
  useEffect(() => {
    applyFilters()
  }, [reports, searchTerm, statusFilter, typeFilter, projectFilter, dateRange])

  const loadReports = async () => {
    try {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Transform mock data
      const transformedReports: Report[] = reportsData.reports.map(report => ({
        ...report,
        projectName: projectsData.find(p => p.project_id.toString() === report.projectId)?.name || "Unknown Project"
      }))

      // Filter based on user role
      let userReports = transformedReports
      if (user?.role === "project-manager") {
        userReports = transformedReports.filter(report => report.creatorId === user.id)
      } else if (user?.role === "project-executive") {
        // PEs see reports from their assigned projects
        const assignedProjects = ["1", "2", "3"] // Mock assigned projects
        userReports = transformedReports.filter(report => assignedProjects.includes(report.projectId))
      }

      setReports(userReports)
    } catch (error) {
      console.error("Failed to load reports:", error)
      toast({
        title: "Error",
        description: "Failed to load reports. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...reports]

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(report => 
        report.name.toLowerCase().includes(search) ||
        report.projectName.toLowerCase().includes(search) ||
        report.creatorName.toLowerCase().includes(search)
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(report => report.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(report => report.type === typeFilter)
    }

    // Project filter
    if (projectFilter !== "all") {
      filtered = filtered.filter(report => report.projectId === projectFilter)
    }

    // Date range filter
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.createdAt)
        if (dateRange.from && reportDate < dateRange.from) return false
        if (dateRange.to && reportDate > dateRange.to) return false
        return true
      })
    }

    setFilteredReports(filtered)
  }

  // Calculate dashboard statistics
  const stats = useMemo((): DashboardStats => {
    const total = reports.length
    const pending = reports.filter(r => r.status === "submitted").length
    const approved = reports.filter(r => r.status === "approved" || r.status === "published").length
    const rejected = reports.filter(r => r.status === "rejected").length
    
    const thisMonth = reports.filter(r => {
      const reportDate = new Date(r.createdAt)
      const now = new Date()
      return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear()
    }).length

    const processedReports = approved + rejected
    const approvalRate = processedReports > 0 ? Math.round((approved / processedReports) * 100) : 0

    const overdue = reports.filter(r => {
      if (!r.dueDate || r.status === "approved" || r.status === "published") return false
      return new Date(r.dueDate) < new Date()
    }).length

    return {
      totalReports: total,
      pendingApproval: pending,
      approved,
      rejected,
      thisMonth,
      approvalRate,
      avgProcessingTime: 2.5,
      timeSaved: total * 4,
      overdue
    }
  }, [reports])

  // Generate recent activity
  const recentActivity = useMemo((): RecentActivity[] => {
    return reports
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 8)
      .map(report => {
        let type: RecentActivity["type"] = "created"
        let icon = <FileText className="h-4 w-4 text-blue-500" />

        switch (report.status) {
          case "submitted":
            type = "submitted"
            icon = <Clock className="h-4 w-4 text-yellow-500" />
            break
          case "approved":
          case "published":
            type = "approved"
            icon = <CheckCircle className="h-4 w-4 text-green-500" />
            break
          case "rejected":
            type = "rejected"
            icon = <XCircle className="h-4 w-4 text-red-500" />
            break
        }

        return {
          id: `activity-${report.id}`,
          type,
          reportName: report.name,
          projectName: report.projectName,
          userName: report.creatorName,
          timestamp: report.updatedAt,
          icon
        }
      })
  }, [reports])

  // Get user role specific project scope
  const getProjectScope = () => {
    if (!user) return { description: "All Reports" }
    
    switch (user.role) {
      case "project-manager":
        return { description: "My Reports" }
      case "project-executive":
        return { description: "Portfolio Reports" }
      case "executive":
        return { description: "All Published Reports" }
      default:
        return { description: "All Reports" }
    }
  }

  const projectScope = getProjectScope()

  // Event handlers
  const handleCreateReport = (templateId?: string) => {
    setSelectedTemplate(templateId || "")
    setSelectedReport(null)
    setShowReportCreator(true)
  }

  const handleEditReport = (report: Report) => {
    setSelectedReport(report)
    setSelectedTemplate("")
    setShowReportCreator(true)
  }

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setShowReportViewer(true)
  }

  const handleRefresh = async () => {
    await loadReports()
    toast({
      title: "Success",
      description: "Reports refreshed successfully"
    })
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return time.toLocaleDateString()
  }

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "submitted":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</Badge>
      case "published":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Published</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTabsForRole = () => {
    switch (user?.role) {
      case "project-manager":
        return ["overview", "create", "templates", "my-reports", "analytics"]
      case "project-executive":
        return ["overview", "approval", "reports", "analytics"]
      case "executive":
        return ["overview", "reports", "analytics"]
      default:
        return ["overview"]
    }
  }

  const availableTabs = getTabsForRole()

  return (
    <StandardPageLayout
      title="Reports Dashboard"
      description="Generate, manage, and distribute construction project reports with AI-powered insights"
      breadcrumbs={createDashboardBreadcrumbs("Reports")}
      badges={[
        { label: projectScope.description, variant: "outline" },
        { label: `${stats.totalReports} Total Reports`, variant: "secondary" },
        ...(stats.overdue > 0 ? [{ label: `${stats.overdue} Overdue`, variant: "destructive" as const }] : [])
      ]}
      actions={
        <>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {user?.role === "project-manager" && (
            <Button onClick={() => handleCreateReport()} className="bg-[#FF6B35] hover:bg-[#E55A2B]">
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          )}
        </>
      }
    >
      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {availableTabs.includes("overview") && <TabsTrigger value="overview">Overview</TabsTrigger>}
          {availableTabs.includes("create") && <TabsTrigger value="create">Create</TabsTrigger>}
          {availableTabs.includes("templates") && <TabsTrigger value="templates">Templates</TabsTrigger>}
          {availableTabs.includes("approval") && <TabsTrigger value="approval">Approval</TabsTrigger>}
          {availableTabs.includes("my-reports") && <TabsTrigger value="my-reports">My Reports</TabsTrigger>}
          {availableTabs.includes("reports") && <TabsTrigger value="reports">Reports</TabsTrigger>}
          {availableTabs.includes("analytics") && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalReports}</div>
                <p className="text-xs text-muted-foreground">+{stats.thisMonth} this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingApproval}</div>
                <p className="text-xs text-muted-foreground">Avg {stats.avgProcessingTime} days to process</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approvalRate}%</div>
                <Progress value={stats.approvalRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.timeSaved}h</div>
                <p className="text-xs text-muted-foreground">Through automation</p>
              </CardContent>
            </Card>
          </div>

          {/* HBI Intelligence Panel */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900 border-indigo-200 dark:border-indigo-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
                <Brain className="h-5 w-5" />
                HBI Report Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium text-indigo-800 dark:text-indigo-200">Smart Insights</span>
                  </div>
                  <ul className="space-y-2 text-sm text-indigo-700 dark:text-indigo-300">
                    <li>• {stats.pendingApproval} reports await approval - avg processing time trending down</li>
                    <li>• Financial reviews show 15% faster completion with new templates</li>
                    <li>• Owner reports have 95% approval rate when photos are included</li>
                    <li>• Schedule section accuracy improved 23% with automated data integration</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium text-indigo-800 dark:text-indigo-200">Recommendations</span>
                  </div>
                  <ul className="space-y-2 text-sm text-indigo-700 dark:text-indigo-300">
                    <li>• Schedule monthly progress reports for the 3rd business day</li>
                    <li>• Include financial forecast memo in all owner reports</li>
                    <li>• Set up automated reminders 3 days before report due dates</li>
                    <li>• Consider batch processing for faster approvals</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts and Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Report Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Report Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
                      <span className="text-sm">Approved</span>
                    </div>
                    <span className="text-sm font-medium">{stats.approved}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 dark:bg-amber-400 rounded-full"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <span className="text-sm font-medium">{stats.pendingApproval}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-rose-500 dark:bg-rose-400 rounded-full"></div>
                      <span className="text-sm">Rejected</span>
                    </div>
                    <span className="text-sm font-medium">{stats.rejected}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-slate-500 dark:bg-slate-400 rounded-full"></div>
                      <span className="text-sm">Draft</span>
                    </div>
                    <span className="text-sm font-medium">{reports.filter(r => r.status === "draft").length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.slice(0, 6).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          {activity.type === "created" && `${activity.userName} created "${activity.reportName}"`}
                          {activity.type === "submitted" && `${activity.userName} submitted "${activity.reportName}"`}
                          {activity.type === "approved" && `"${activity.reportName}" was approved`}
                          {activity.type === "rejected" && `"${activity.reportName}" was rejected`}
                          {activity.type === "distributed" && `"${activity.reportName}" was distributed`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.projectName} • {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        {availableTabs.includes("templates") && (
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
                <CardContent className="text-muted-foreground">
                  Choose from standardized report templates optimized for construction project reporting
                </CardContent>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                  {reportTemplates.map((template) => (
                    <Card 
                      key={template.id} 
                      className={`cursor-pointer hover:shadow-lg transition-all duration-200 border-2 ${template.color}`}
                      onClick={() => handleCreateReport(template.id)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-background/50 border">
                            {template.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{template.workflow}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm mb-4">{template.description}</p>
                        <div className="flex justify-between items-center text-xs">
                          <Badge variant="secondary">{template.sections} sections</Badge>
                          <span className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {template.estimatedTime}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Other tabs would be implemented similarly */}
        {availableTabs.includes("my-reports") && (
          <TabsContent value="my-reports">
            <ReportHistory 
              reports={filteredReports}
              onViewReport={handleViewReport}
              onEditReport={handleEditReport}
              userRole={user?.role || "project-manager"}
            />
          </TabsContent>
        )}

        {availableTabs.includes("approval") && (
          <TabsContent value="approval">
            <ReportApprovalWorkflow 
              userRole={user?.role || "project-executive"}
              reports={reports.filter(r => r.status === "submitted")}
              onReportUpdate={loadReports}
            />
          </TabsContent>
        )}

        {availableTabs.includes("analytics") && (
          <TabsContent value="analytics">
            <ReportAnalytics reports={reports} />
          </TabsContent>
        )}
      </Tabs>

      {/* Report Creator Dialog */}
      <Dialog open={showReportCreator} onOpenChange={setShowReportCreator}>
        <DialogContent className="!w-[95vw] !max-w-[95vw] !h-[95vh] !max-h-[95vh] p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <DialogHeader className="flex-shrink-0 px-6 py-4 border-b">
              <DialogTitle>
                {selectedReport ? `Edit ${selectedReport.name}` : 
                 selectedTemplate ? `Create ${reportTemplates.find(t => t.id === selectedTemplate)?.name} Report` : 
                 "Create New Report"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto px-6 py-4">
              <ReportCreator
                reportId={selectedReport?.id}
                templateId={selectedTemplate}
                onSave={() => {
                  setShowReportCreator(false)
                  loadReports()
                }}
                onCancel={() => setShowReportCreator(false)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Viewer Dialog */}
      <Dialog open={showReportViewer} onOpenChange={setShowReportViewer}>
        <DialogContent className="!w-[90vw] !max-w-[90vw] !h-[95vh] !max-h-[95vh] p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <DialogHeader className="flex-shrink-0 px-6 py-4 border-b">
              <DialogTitle>{selectedReport?.name}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto px-6 py-4">
              <ReportViewer
                report={selectedReport}
                onClose={() => setShowReportViewer(false)}
                userRole={user?.role || "project-manager"}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </StandardPageLayout>
  )
}