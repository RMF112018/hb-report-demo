"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FileText,
  Download,
  CalendarIcon,
  Clock,
  Share,
  Plus,
  BarChart3,
  PieChart,
  TrendingUp,
  Settings,
} from "lucide-react"
import { format } from "date-fns"

interface ReportsManagerProps {
  filters: {
    project: string
    phase: string
    department: string
    metricType: string
  }
  onExport: (format: string, data: any) => void
}

export function ReportsManager({ filters, onExport }: ReportsManagerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newReportName, setNewReportName] = useState("")
  const [newReportDescription, setNewReportDescription] = useState("")
  const [selectedReportType, setSelectedReportType] = useState("")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])

  const existingReports = [
    {
      id: "weekly-progress",
      name: "Weekly Progress Report",
      description: "Comprehensive weekly project status and progress tracking",
      type: "Progress",
      lastGenerated: "2024-01-15",
      frequency: "Weekly",
      status: "Active",
      format: "PDF",
    },
    {
      id: "financial-summary",
      name: "Financial Summary",
      description: "Budget analysis and cost performance metrics",
      type: "Financial",
      lastGenerated: "2024-01-14",
      frequency: "Monthly",
      status: "Active",
      format: "Excel",
    },
    {
      id: "safety-report",
      name: "Safety & Compliance Report",
      description: "Safety incidents, training, and compliance status",
      type: "Safety",
      lastGenerated: "2024-01-13",
      frequency: "Weekly",
      status: "Active",
      format: "PDF",
    },
    {
      id: "risk-assessment",
      name: "Risk Assessment Report",
      description: "Current risks, mitigation strategies, and impact analysis",
      type: "Risk",
      lastGenerated: "2024-01-12",
      frequency: "Bi-weekly",
      status: "Draft",
      format: "PDF",
    },
  ]

  const reportTemplates = [
    {
      id: "executive-summary",
      name: "Executive Summary",
      description: "High-level overview for C-suite and stakeholders",
      icon: <TrendingUp className="h-5 w-5" />,
      metrics: ["progress", "budget", "risks", "timeline"],
    },
    {
      id: "detailed-progress",
      name: "Detailed Progress Report",
      description: "Comprehensive project progress with task-level details",
      icon: <BarChart3 className="h-5 w-5" />,
      metrics: ["tasks", "milestones", "resources", "quality"],
    },
    {
      id: "financial-analysis",
      name: "Financial Analysis",
      description: "Budget performance, cost analysis, and forecasting",
      icon: <PieChart className="h-5 w-5" />,
      metrics: ["budget", "costs", "variance", "forecast"],
    },
    {
      id: "custom-report",
      name: "Custom Report",
      description: "Build your own report with selected metrics",
      icon: <Settings className="h-5 w-5" />,
      metrics: [],
    },
  ]

  const availableMetrics = [
    { id: "progress", label: "Project Progress", category: "Performance" },
    { id: "budget", label: "Budget Analysis", category: "Financial" },
    { id: "schedule", label: "Schedule Performance", category: "Performance" },
    { id: "quality", label: "Quality Metrics", category: "Quality" },
    { id: "safety", label: "Safety Statistics", category: "Safety" },
    { id: "risks", label: "Risk Assessment", category: "Risk" },
    { id: "resources", label: "Resource Utilization", category: "Resources" },
    { id: "costs", label: "Cost Breakdown", category: "Financial" },
  ]

  const handleCreateReport = () => {
    // Logic to create new report
    console.log("Creating report:", {
      name: newReportName,
      description: newReportDescription,
      type: selectedReportType,
      metrics: selectedMetrics,
    })
    setShowCreateDialog(false)
    setNewReportName("")
    setNewReportDescription("")
    setSelectedReportType("")
    setSelectedMetrics([])
  }

  const handleExportReport = (reportId: string, format: string) => {
    const report = existingReports.find((r) => r.id === reportId)
    if (report) {
      onExport(format, report)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Report Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reports Manager</h2>
          <p className="text-gray-600">Generate, schedule, and manage project reports</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Report</DialogTitle>
              <DialogDescription>
                Choose a template or create a custom report with your selected metrics
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Report Templates */}
              <div>
                <Label className="text-base font-medium">Choose Template</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  {reportTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedReportType === template.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setSelectedReportType(template.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          {template.icon}
                          <CardTitle className="text-sm">{template.name}</CardTitle>
                        </div>
                        <CardDescription className="text-xs">{template.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Report Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input
                    id="report-name"
                    value={newReportName}
                    onChange={(e) => setNewReportName(e.target.value)}
                    placeholder="Enter report name"
                  />
                </div>
                <div>
                  <Label htmlFor="report-frequency">Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="report-description">Description</Label>
                <Textarea
                  id="report-description"
                  value={newReportDescription}
                  onChange={(e) => setNewReportDescription(e.target.value)}
                  placeholder="Describe the purpose and content of this report"
                  rows={3}
                />
              </div>

              {/* Custom Metrics Selection */}
              {selectedReportType === "custom-report" && (
                <div>
                  <Label className="text-base font-medium">Select Metrics</Label>
                  <div className="grid grid-cols-2 gap-3 mt-3 max-h-48 overflow-y-auto">
                    {availableMetrics.map((metric) => (
                      <div key={metric.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={metric.id}
                          checked={selectedMetrics.includes(metric.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedMetrics([...selectedMetrics, metric.id])
                            } else {
                              setSelectedMetrics(selectedMetrics.filter((m) => m !== metric.id))
                            }
                          }}
                        />
                        <Label htmlFor={metric.id} className="text-sm">
                          {metric.label}
                          <span className="text-xs text-gray-500 block">{metric.category}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateReport} disabled={!newReportName || !selectedReportType}>
                  Create Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="existing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="existing">Existing Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="mt-4">
          <div className="space-y-4">
            {existingReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{report.name}</CardTitle>
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        <Badge variant="outline">{report.type}</Badge>
                      </div>
                      <CardDescription>{report.description}</CardDescription>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Last generated: {report.lastGenerated}
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {report.frequency}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {report.format}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportReport(report.id, "pdf")}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Share className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Manage automated report generation and delivery schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {existingReports
                  .filter((r) => r.status === "Active")
                  .map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-gray-500">
                          Next generation: {format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "PPP")}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {report.frequency}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit Schedule
                        </Button>
                        <Button variant="outline" size="sm">
                          Pause
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    {template.icon}
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {template.metrics.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Included Metrics:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.metrics.map((metric) => (
                            <Badge key={metric} variant="secondary" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedReportType(template.id)
                        setShowCreateDialog(true)
                      }}
                    >
                      Use Template
                    </Button>
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
