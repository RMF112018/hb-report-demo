"use client"

/**
 * Project Reports Hub Component
 *
 * Central hub for all report-related activities in HB Report platform.
 * Updated to match the main dashboard design parameters and layout.
 */

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Plus,
  Search,
  Download,
  Share2,
  Eye,
  Send,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  Edit,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { mockReportData, mockUsers } from "@/data/mock-report-data"
import { sendNotification } from "@/lib/email-service"
import type { GeneratedReport, ReportStatus } from "@/types/reports"

const mockUser = {
  email: "jane.smith@hb.com",
  role: "project-manager",
  projects: ["Downtown Office Complex", "Riverside Residential", "Tech Campus Phase 1"],
}

export function ProjectReportsHub() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [reports, setReports] = useState<GeneratedReport[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const userReports = mockReportData.generatedReports.filter((report) =>
        mockUser.role === "project-manager" ? report.createdBy === mockUser.email : true,
      )
      setReports(userReports)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredReports = useMemo(() => {
    return reports.filter(
      (report) =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === "all" || report.status === filterStatus),
    )
  }, [reports, searchTerm, filterStatus])

  const getStatusIcon = (status: ReportStatus) =>
    ({
      completed: <CheckCircle className="h-4 w-4 text-green-500" />,
      pending: <Clock className="h-4 w-4 text-yellow-500" />,
      draft: <Edit className="h-4 w-4 text-blue-500" />,
      review: <AlertCircle className="h-4 w-4 text-orange-500" />,
    })[status] || <FileText className="h-4 w-4 text-gray-500" />

  const getStatusColor = (status: ReportStatus) =>
    ({
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      draft: "bg-blue-100 text-blue-800",
      review: "bg-orange-100 text-orange-800",
    })[status] || "bg-gray-100 text-gray-800"

  const handleViewReport = useCallback((reportId: string) => router.push(`/project-reports/view/${reportId}`), [router])
  const handleSubmitForReview = useCallback(
    async (reportId: string) => {
      setLoading(true)
      const updatedReports = reports.map((report) =>
        report.id === reportId ? { ...report, status: "review" as ReportStatus } : report,
      )
      setReports(updatedReports)
      const executives = mockUsers.filter((u) => u.role === "project-executive")
      executives.forEach((executive) =>
        sendNotification(executive.email, {
          type: "report-review-request",
          reportId,
          reportName: reports.find((r) => r.id === reportId)?.name || "",
          submittedBy: mockUser.email,
        }),
      )
      setLoading(false)
    },
    [reports],
  )

  const analytics = useMemo(() => {
    const total = reports.length
    const completed = reports.filter((r) => r.status === "completed").length
    const pending = reports.filter((r) => r.status === "review" || r.status === "pending").length
    const draft = reports.filter((r) => r.status === "draft").length

    // Mock time and cost savings for analytics
    const avgTimePerReport = 8 // hours
    const timeSaved = completed * avgTimePerReport * 0.85 // 85% efficiency gain
    const costSavings = timeSaved * 50 // $50/hour average rate

    return {
      total,
      completed,
      pending,
      draft,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      timeSaved: Math.round(timeSaved),
      costSavings: Math.round(costSavings),
    }
  }, [reports])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="text-gray-600">Loading your reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Matching dashboard layout */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Reports</h1>
            <p className="text-gray-600 mt-1">Central hub for report customization, generation, and management</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {mockUser.role.replace("-", " ").toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {analytics.total} Reports
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button
              onClick={() => router.push("/project-reports/customize")}
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
            <Button variant="outline" className="hover:bg-gray-100 transition-colors">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Analytics Cards - Matching dashboard grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.completed}</p>
                  <div className="flex items-center mt-1">
                    <Progress value={analytics.completionRate} className="w-16 h-2 mr-2" />
                    <span className="text-xs text-gray-500">{Math.round(analytics.completionRate)}%</span>
                  </div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">{analytics.pending}</p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Time Saved</p>
                  <p className="text-2xl font-bold text-purple-600">{analytics.timeSaved}h</p>
                  <p className="text-xs text-green-600 mt-1">${analytics.costSavings.toLocaleString()} value</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation - Matching dashboard style */}
        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generated Reports
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Generated Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg border border-gray-200">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reports, projects, or creators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="hover:bg-gray-100 transition-colors">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Reports Grid - Matching dashboard card layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-all duration-200 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        {getStatusIcon(report.status)}
                        <CardTitle className="text-lg font-semibold truncate">{report.name}</CardTitle>
                      </div>
                      <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{report.project}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Created:</span>
                        <br />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Pages:</span>
                        <br />
                        {report.pageCount}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span>
                        <br />
                        {report.fileSize}
                      </div>
                      <div>
                        <span className="font-medium">Creator:</span>
                        <br />
                        <span className="truncate">{report.createdBy.split("@")[0]}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewReport(report.id)}
                        className="flex-1 hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>

                      {report.downloadUrl && (
                        <Button size="sm" variant="outline" className="hover:bg-gray-100 transition-colors">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}

                      <Button size="sm" variant="outline" className="hover:bg-gray-100 transition-colors">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Role-Specific Actions */}
                    {mockUser.role === "project-manager" && report.status === "draft" && (
                      <Button
                        size="sm"
                        onClick={() => handleSubmitForReview(report.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit for Review
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredReports.length === 0 && (
              <Card className="text-center p-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your filters or search terms."
                    : "Get started by creating your first report."}
                </p>
                <Button
                  onClick={() => router.push("/project-reports/customize")}
                  className="bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Report
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <Card className="p-12 text-center">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Report Templates</h3>
              <p className="text-gray-600 mb-4">Explore and use pre-defined report templates to get started quickly.</p>
              <Button
                onClick={() => router.push("/project-reports/customize")}
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Browse Templates
              </Button>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Report Generation Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-semibold text-gray-900">24 reports</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Month</span>
                    <span className="font-semibold text-gray-900">18 reports</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Growth</span>
                    <span className="font-semibold text-green-600">+33%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    ROI & Cost Savings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hours Saved</span>
                    <span className="font-semibold text-gray-900">{analytics.timeSaved}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cost Savings</span>
                    <span className="font-semibold text-gray-900">${analytics.costSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Efficiency Gain</span>
                    <span className="font-semibold text-green-600">85%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
