"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Calendar, Clock, Users, TrendingUp, BarChart3, PieChart } from "lucide-react"
import { useState } from "react"

interface ReportsSectionProps {
  filters: {
    project: string
    phase: string
    department: string
    metricType: string
  }
  onExport: (format: string, data: any) => void
}

export function ReportsSection({ filters, onExport }: ReportsSectionProps) {
  const [selectedReportType, setSelectedReportType] = useState("all")
  const [selectedFormat, setSelectedFormat] = useState("pdf")

  const reportTemplates = [
    {
      id: "weekly-progress",
      title: "Weekly Progress Report",
      description: "Comprehensive weekly project status and milestone tracking",
      icon: Calendar,
      category: "Progress",
      frequency: "Weekly",
      lastGenerated: "2024-06-10",
      size: "2.3 MB",
      recipients: 12,
    },
    {
      id: "financial-summary",
      title: "Financial Summary",
      description: "Budget utilization, cost variance, and financial forecasting",
      icon: TrendingUp,
      category: "Financial",
      frequency: "Monthly",
      lastGenerated: "2024-06-01",
      size: "1.8 MB",
      recipients: 8,
    },
    {
      id: "safety-dashboard",
      title: "Safety Performance Report",
      description: "Safety incidents, training compliance, and risk assessments",
      icon: Users,
      category: "Safety",
      frequency: "Weekly",
      lastGenerated: "2024-06-08",
      size: "1.2 MB",
      recipients: 15,
    },
    {
      id: "quality-metrics",
      title: "Quality Metrics Report",
      description: "Quality scores, inspection results, and compliance tracking",
      icon: BarChart3,
      category: "Quality",
      frequency: "Bi-weekly",
      lastGenerated: "2024-06-05",
      size: "3.1 MB",
      recipients: 6,
    },
    {
      id: "resource-utilization",
      title: "Resource Utilization",
      description: "Equipment usage, labor allocation, and productivity metrics",
      icon: PieChart,
      category: "Operations",
      frequency: "Monthly",
      lastGenerated: "2024-06-01",
      size: "2.7 MB",
      recipients: 10,
    },
    {
      id: "executive-summary",
      title: "Executive Summary",
      description: "High-level project overview for stakeholders and executives",
      icon: FileText,
      category: "Executive",
      frequency: "Monthly",
      lastGenerated: "2024-06-01",
      size: "1.5 MB",
      recipients: 5,
    },
  ]

  const scheduledReports = [
    {
      id: "auto-weekly",
      name: "Weekly Progress Auto-Report",
      schedule: "Every Monday 8:00 AM",
      recipients: ["project.manager@company.com", "site.supervisor@company.com"],
      format: "PDF",
      status: "Active",
    },
    {
      id: "auto-monthly",
      name: "Monthly Financial Summary",
      schedule: "1st of every month 9:00 AM",
      recipients: ["finance@company.com", "executives@company.com"],
      format: "Excel",
      status: "Active",
    },
    {
      id: "auto-safety",
      name: "Safety Weekly Report",
      schedule: "Every Friday 5:00 PM",
      recipients: ["safety@company.com", "hr@company.com"],
      format: "PDF",
      status: "Paused",
    },
  ]

  const recentReports = [
    {
      id: "report-001",
      name: "Weekly Progress - Week 24",
      type: "Progress",
      generatedDate: "2024-06-10",
      size: "2.3 MB",
      format: "PDF",
      status: "Completed",
    },
    {
      id: "report-002",
      name: "Safety Performance - May 2024",
      type: "Safety",
      generatedDate: "2024-06-08",
      size: "1.2 MB",
      format: "PDF",
      status: "Completed",
    },
    {
      id: "report-003",
      name: "Financial Summary - May 2024",
      type: "Financial",
      generatedDate: "2024-06-01",
      size: "1.8 MB",
      format: "Excel",
      status: "Completed",
    },
    {
      id: "report-004",
      name: "Quality Metrics - Bi-weekly",
      type: "Quality",
      generatedDate: "2024-06-05",
      size: "3.1 MB",
      format: "PDF",
      status: "Processing",
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Progress":
        return "text-blue-600 bg-blue-100"
      case "Financial":
        return "text-green-600 bg-green-100"
      case "Safety":
        return "text-red-600 bg-red-100"
      case "Quality":
        return "text-purple-600 bg-purple-100"
      case "Operations":
        return "text-orange-600 bg-orange-100"
      case "Executive":
        return "text-gray-600 bg-gray-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-100"
      case "Paused":
        return "text-yellow-600 bg-yellow-100"
      case "Completed":
        return "text-blue-600 bg-blue-100"
      case "Processing":
        return "text-orange-600 bg-orange-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports Manager</h2>
          <p className="text-gray-600">Generate, schedule, and manage project reports</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={selectedReportType} onValueChange={setSelectedReportType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Reports Tabs */}
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="templates" className="text-xs sm:text-sm">
            Report Templates
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="text-xs sm:text-sm">
            Scheduled Reports
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-xs sm:text-sm">
            Recent Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTemplates.map((template) => {
              const IconComponent = template.icon
              return (
                <Card key={template.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-base truncate">{template.title}</CardTitle>
                          <Badge className={`${getCategoryColor(template.category)} text-xs mt-1`}>
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm">{template.description}</CardDescription>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-500">Frequency</p>
                        <p className="font-medium">{template.frequency}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Recipients</p>
                        <p className="font-medium">{template.recipients} users</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Last Generated</p>
                        <p className="font-medium">{template.lastGenerated}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Size</p>
                        <p className="font-medium">{template.size}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1" onClick={() => onExport(selectedFormat, template)}>
                        <Download className="h-3 w-3 mr-1" />
                        Generate
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <div className="space-y-4">
            {scheduledReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{report.name}</h3>
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">Schedule</p>
                          <p className="font-medium">{report.schedule}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Format</p>
                          <p className="font-medium">{report.format}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Recipients</p>
                          <p className="font-medium">{report.recipients.length} recipients</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-gray-500 text-sm">Recipients:</p>
                        <div className="flex flex-wrap gap-1">
                          {report.recipients.map((email, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {email}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant={report.status === "Active" ? "destructive" : "default"}>
                        {report.status === "Active" ? "Pause" : "Activate"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="space-y-4">
            {recentReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">{report.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>Generated: {report.generatedDate}</span>
                          <span>Size: {report.size}</span>
                          <span>Format: {report.format}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-none">
                      <Badge className={getCategoryColor(report.type)}>{report.type}</Badge>
                      <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                      <Button size="sm" variant="outline" disabled={report.status === "Processing"}>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
