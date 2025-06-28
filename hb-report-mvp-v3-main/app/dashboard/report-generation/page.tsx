"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { ReportCustomizer } from "@/components/reports/report-customizer"
import { ReportTemplates } from "@/components/reports/report-templates"
import { ReportHistory } from "@/components/reports/report-history"
import { ReportPreview } from "@/components/reports/report-preview"
import { mockReportData } from "@/data/mock-report-data"
import type { ReportTemplate } from "@/types/reports"
import { FileText, Plus, Settings, Download, Eye, Clock, Users, BarChart3, PieChart, TrendingUp } from "lucide-react"

export default function ReportGenerationPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [recentReports, setRecentReports] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    loadReportData()
  }, [])

  const loadReportData = async () => {
    try {
      setIsLoading(true)
      const data = await mockReportData.getTemplates()
      const reports = await mockReportData.getRecentReports()
      setTemplates(data)
      setRecentReports(reports)
    } catch (error) {
      console.error("Failed to load report data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateReport = (template?: ReportTemplate) => {
    setSelectedTemplate(template || null)
    setActiveTab("customize")
  }

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "bid-package":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "cost-summary":
        return <PieChart className="h-5 w-5 text-green-600" />
      case "project-update":
        return <TrendingUp className="h-5 w-5 text-purple-600" />
      case "financial-forecast":
        return <BarChart3 className="h-5 w-5 text-orange-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || template.category === filterType
    return matchesSearch && matchesFilter
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003087]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report Generation</h1>
          <p className="text-gray-600 mt-1">Create, customize, and manage professional construction reports</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="px-3 py-1">
            <Users className="h-4 w-4 mr-2" />
            {user?.role === "project-manager" ? "3 Projects" : "5 Projects"}
          </Badge>
          <Button onClick={() => handleCreateReport()} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">+3 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">18</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">75% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">4</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">2 due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Saved</p>
                <p className="text-2xl font-bold text-purple-600">156h</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Reports</Label>
                <Input
                  id="search"
                  placeholder="Search by name, type, or project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="w-full sm:w-48">
                <Label htmlFor="filter">Filter by Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="bid-package">Bid Package</SelectItem>
                    <SelectItem value="cost-summary">Cost Summary</SelectItem>
                    <SelectItem value="project-update">Project Update</SelectItem>
                    <SelectItem value="financial-forecast">Financial Forecast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Your latest report generation activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.slice(0, 5).map((report: any) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        {getReportTypeIcon(report.type)}
                        <div>
                          <h4 className="font-medium">{report.name}</h4>
                          <p className="text-sm text-gray-500">
                            {report.project} • Generated {report.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCreateReport()}>
                <CardContent className="p-6 text-center">
                  <Plus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Create New Report</h3>
                  <p className="text-sm text-gray-600">Start from scratch or use a template</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setActiveTab("templates")}
              >
                <CardContent className="p-6 text-center">
                  <Settings className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Manage Templates</h3>
                  <p className="text-sm text-gray-600">Create and edit report templates</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setActiveTab("history")}
              >
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">View History</h3>
                  <p className="text-sm text-gray-600">Browse all generated reports</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <ReportTemplates
            templates={filteredTemplates}
            onSelectTemplate={handleCreateReport}
            onCreateTemplate={() => handleCreateReport()}
          />
        </TabsContent>

        <TabsContent value="customize" className="mt-6">
          <ReportCustomizer
            selectedTemplate={selectedTemplate}
            onSave={(config) => {
              console.log("Saving report config:", config)
              setActiveTab("preview")
            }}
            onCancel={() => setActiveTab("overview")}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <ReportHistory
            reports={recentReports}
            onViewReport={(report) => {
              console.log("Viewing report:", report)
              setActiveTab("preview")
            }}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <ReportPreview
            config={selectedTemplate}
            onEdit={() => setActiveTab("customize")}
            onPublish={(report) => {
              console.log("Publishing report:", report)
              setActiveTab("overview")
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
