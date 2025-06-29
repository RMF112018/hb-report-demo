"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AppHeader } from "@/components/layout/app-header"
import { useAuth } from "@/context/auth-context"
import {
  Download,
  Settings,
  Search,
  Filter,
  CalendarIcon,
  X,
  FileText,
  Users,
  Shield,
  CheckCircle,
  BarChart3,
  FileSpreadsheet,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Target,
  Building,
  User,
  Brain,
  Lightbulb,
  ArrowRight,
  MoreHorizontal,
  Eye,
  Edit,
  ChevronDown,
  ChevronUp,
  DollarSign,
} from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, isToday, isBefore } from "date-fns"

// Mock data imports
import dailyLogsData from "@/data/mock/logs/daily-log-sample.json"
import qualityControlData from "@/data/mock/inspections/quality-control.json"
import safetyData from "@/data/mock/inspections/safety.json"

interface FilterState {
  project: string
  status: string
  dateRange: { from: Date | undefined; to: Date | undefined }
  contractor: string
  trade: string
  search: string
}

interface FieldMetrics {
  totalLogs: number
  logComplianceRate: number
  expectedLogs: number
  completedLogs: number
  totalWorkers: number
  averageEfficiency: number
  safetyViolations: number
  safetyComplianceRate: number
  qualityDefects: number
  qualityPassRate: number
  totalInspections: number
  atRiskSafetyItems: number
  businessDaysInMonth: number
  businessDaysToDate: number
}

interface DashboardData {
  dailyLogs: any[]
  qualityControl: any[]
  safety: any[]
  manpower: any[]
}

interface InsightItem {
  type: "critical" | "warning" | "positive" | "info"
  category: string
  title: string
  description: string
  recommendation: string
  impact: "Critical" | "High" | "Medium" | "Low"
  priority: "urgent" | "high" | "medium" | "low"
}

export default function FieldReportsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [reportModalType, setReportModalType] = useState<"daily-log" | "quality" | "safety" | null>(null)

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    project: "all",
    status: "all",
    dateRange: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    contractor: "all",
    trade: "all",
    search: "",
  })

  // Data state
  const [fieldData, setFieldData] = useState<DashboardData>({
    dailyLogs: [],
    qualityControl: [],
    safety: [],
    manpower: [],
  })

  // Load and transform data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Transform daily logs data
        const transformedDailyLogs = Array.isArray(dailyLogsData) ? dailyLogsData.map((log: any) => ({
          id: `log-${log.project_id}-${log.date}`,
          projectId: log.project_id?.toString() || "unknown",
          projectName: log.project_name || "Unknown Project",
          date: log.date,
          submittedBy: log.created_by || "System",
          status: determineLogStatus(log.date),
          totalWorkers: log.manpower_log?.total_workers || 0,
          totalHours: log.manpower_log?.total_hours || 0,
          weatherConditions: log.weather_report,
          manpowerEntries: log.manpower_log?.entries || [],
          activities: log.activities || [],
          comments: log.comments || "",
        })) : []

        // Transform quality control data
        const transformedQualityControl = Array.isArray(qualityControlData) ? qualityControlData.map((qc: any) => ({
          id: `qc-${qc.inspection_id}`,
          projectId: qc.project_id?.toString() || "unknown",
          projectName: qc.project_name || "Unknown Project",
          date: qc.inspection_date,
          type: qc.inspection_type,
          trade: qc.trade,
          status: qc.status?.toLowerCase() === "closed" ? "pass" : "pending",
          location: qc.location,
          createdBy: qc.created_by,
          description: qc.description,
          checklist: qc.checklist || [],
          defects: calculateDefects(qc.checklist),
          issues: extractIssues(qc.checklist),
          attachments: qc.attachments || [],
        })) : []

        // Transform safety data
        const transformedSafety = Array.isArray(safetyData) ? safetyData.map((safety: any) => ({
          id: `safety-${safety.inspection_id}`,
          projectId: safety.project_id?.toString() || "unknown",
          projectName: safety.project_name || "Unknown Project",
          date: safety.inspection_date,
          type: safety.inspection_type,
          trade: safety.trade,
          status: safety.status?.toLowerCase() === "closed" ? "pass" : (safety.responses?.some((r: any) => r.response === "At Risk") ? "fail" : "pass"),
          location: safety.location,
          createdBy: safety.created_by,
          description: safety.description,
          responses: safety.responses || [],
          violations: countViolations(safety.responses),
          atRiskItems: countAtRiskItems(safety.responses),
          complianceScore: calculateComplianceScore(safety.responses),
          attachments: safety.attachments || [],
        })) : []

        // Extract manpower data from daily logs
        const transformedManpower = transformedDailyLogs.flatMap((log: any) => 
          log.manpowerEntries.map((entry: any, index: number) => ({
            id: `manpower-${log.id}-${index}`,
            projectId: log.projectId,
            projectName: log.projectName,
            date: log.date,
            contractor: entry.contact_company || "Unknown Contractor",
            workers: entry.workers || 0,
            hours: entry.hours || 0,
            totalHours: entry.total_hours || 0,
            location: entry.location || "Unknown Location",
            comments: entry.comments || "",
            trade: inferTradeFromCompany(entry.contact_company),
            efficiency: calculateEfficiency(entry),
            costPerHour: estimateCostPerHour(entry.contact_company),
          }))
        )

        setFieldData({
          dailyLogs: transformedDailyLogs,
          qualityControl: transformedQualityControl,
          safety: transformedSafety,
          manpower: transformedManpower,
        })
      } catch (error) {
        console.error("Failed to load field data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Helper functions for data transformation
  const determineLogStatus = (date: string) => {
    const logDate = new Date(date)
    const today = new Date()
    if (isBefore(logDate, today)) {
      return Math.random() > 0.3 ? "submitted" : "overdue"
    }
    return "pending"
  }

  const calculateDefects = (checklist: any[]) => {
    if (!Array.isArray(checklist)) return 0
    return checklist.filter(item => item.response === "No").length
  }

  const extractIssues = (checklist: any[]) => {
    if (!Array.isArray(checklist)) return []
    return checklist.filter(item => item.response === "No").map(item => item.question)
  }

  const countViolations = (responses: any[]) => {
    if (!Array.isArray(responses)) return 0
    return responses.filter(r => r.response === "At Risk").length
  }

  const countAtRiskItems = (responses: any[]) => {
    if (!Array.isArray(responses)) return 0
    return responses.filter(r => r.response === "At Risk").length
  }

  const calculateComplianceScore = (responses: any[]) => {
    if (!Array.isArray(responses) || responses.length === 0) return 100
    const safeCount = responses.filter(r => r.response === "Safe").length
    return Math.round((safeCount / responses.length) * 100)
  }

  const inferTradeFromCompany = (company: string) => {
    if (!company) return "General"
    const lowercaseCompany = company.toLowerCase()
    if (lowercaseCompany.includes("electric")) return "Electrical"
    if (lowercaseCompany.includes("plumb")) return "Plumbing"
    if (lowercaseCompany.includes("hvac") || lowercaseCompany.includes("air")) return "HVAC"
    if (lowercaseCompany.includes("concrete")) return "Concrete"
    if (lowercaseCompany.includes("steel") || lowercaseCompany.includes("metal")) return "Steel"
    if (lowercaseCompany.includes("paint")) return "Painting"
    if (lowercaseCompany.includes("roof")) return "Roofing"
    return "General"
  }

  const calculateEfficiency = (entry: any) => {
    const baseEfficiency = 85
    const variation = Math.random() * 20 - 10 // -10 to +10
    return Math.max(60, Math.min(100, Math.round(baseEfficiency + variation)))
  }

  const estimateCostPerHour = (company: string) => {
    const baseCosts = {
      electrical: 65,
      plumbing: 60,
      hvac: 58,
      concrete: 45,
      steel: 70,
      general: 50,
    }
    const trade = inferTradeFromCompany(company).toLowerCase()
    const baseCost = baseCosts[trade as keyof typeof baseCosts] || baseCosts.general
    const variation = Math.random() * 20 - 10 // -10 to +10
    return Math.round(baseCost + variation)
  }

  // Role-based data filtering
  const filteredData = useMemo(() => {
    let filtered = { ...fieldData }

    // Apply role-based filtering
    if (user?.role === "project-manager") {
      const activeProject = "2525840" // This would come from user context
      filtered.dailyLogs = filtered.dailyLogs.filter((log) => log.projectId === activeProject)
      filtered.qualityControl = filtered.qualityControl.filter((qc) => qc.projectId === activeProject)
      filtered.safety = filtered.safety.filter((sa) => sa.projectId === activeProject)
      filtered.manpower = filtered.manpower.filter((mp) => mp.projectId === activeProject)
    } else if (user?.role === "project-executive") {
      const overseeProjects = ["2525840", "2525841", "2525842"]
      filtered.dailyLogs = filtered.dailyLogs.filter((log) => overseeProjects.includes(log.projectId))
      filtered.qualityControl = filtered.qualityControl.filter((qc) => overseeProjects.includes(qc.projectId))
      filtered.safety = filtered.safety.filter((sa) => overseeProjects.includes(sa.projectId))
      filtered.manpower = filtered.manpower.filter((mp) => overseeProjects.includes(mp.projectId))
    }

    // Apply user filters
    if (filters.project !== "all") {
      filtered.dailyLogs = filtered.dailyLogs.filter((log) => log.projectId === filters.project)
      filtered.qualityControl = filtered.qualityControl.filter((qc) => qc.projectId === filters.project)
      filtered.safety = filtered.safety.filter((sa) => sa.projectId === filters.project)
      filtered.manpower = filtered.manpower.filter((mp) => mp.projectId === filters.project)
    }

    if (filters.status !== "all") {
      filtered.dailyLogs = filtered.dailyLogs.filter((log) => log.status === filters.status)
      filtered.qualityControl = filtered.qualityControl.filter((qc) => qc.status === filters.status)
      filtered.safety = filtered.safety.filter((sa) => sa.status === filters.status)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered.dailyLogs = filtered.dailyLogs.filter((log) =>
        log.comments?.toLowerCase().includes(searchLower) ||
        log.projectName?.toLowerCase().includes(searchLower)
      )
      filtered.qualityControl = filtered.qualityControl.filter((qc) =>
        qc.description?.toLowerCase().includes(searchLower) ||
        qc.trade?.toLowerCase().includes(searchLower)
      )
      filtered.safety = filtered.safety.filter((sa) =>
        sa.description?.toLowerCase().includes(searchLower) ||
        sa.trade?.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }, [fieldData, filters, user])

  // Generate AI-powered insights
  const generateInsights = useCallback((data: DashboardData, metrics: FieldMetrics): InsightItem[] => {
    const insights: InsightItem[] = []

    // Daily log compliance insights
    if (metrics.logComplianceRate < 85) {
      insights.push({
        type: "warning",
        category: "Compliance",
        title: "Daily Log Completion Below Target",
        description: `Only ${metrics.logComplianceRate}% of expected daily logs have been submitted. Target is 95%.`,
        recommendation: "Implement automated reminders and streamline the log submission process.",
        impact: "High",
        priority: "high",
      })
    } else if (metrics.logComplianceRate >= 95) {
      insights.push({
        type: "positive",
        category: "Compliance",
        title: "Excellent Daily Log Compliance",
        description: `${metrics.logComplianceRate}% compliance rate exceeds target performance.`,
        recommendation: "Document and share best practices with other projects.",
        impact: "Medium",
        priority: "low",
      })
    }

    // Safety insights
    if (metrics.atRiskSafetyItems > 5) {
      insights.push({
        type: "critical",
        category: "Safety",
        title: "Multiple Safety Risks Identified",
        description: `${metrics.atRiskSafetyItems} at-risk safety items require immediate attention.`,
        recommendation: "Schedule immediate safety meetings and increase inspection frequency.",
        impact: "Critical",
        priority: "urgent",
      })
    }

    // Quality insights
    if (metrics.qualityDefects > 10) {
      insights.push({
        type: "warning",
        category: "Quality",
        title: "Quality Defects Trending Up",
        description: `${metrics.qualityDefects} defects identified across quality inspections.`,
        recommendation: "Review quality control processes and increase inspection checkpoints.",
        impact: "Medium",
        priority: "high",
      })
    }

    // Efficiency insights
    if (metrics.averageEfficiency < 80) {
      insights.push({
        type: "warning",
        category: "Productivity",
        title: "Workforce Efficiency Below Benchmark",
        description: `Average efficiency at ${metrics.averageEfficiency}% is below the 85% target.`,
        recommendation: "Analyze workflow bottlenecks and consider additional training or equipment.",
        impact: "High",
        priority: "medium",
      })
    }

    return insights
  }, [])

  // Helper function to calculate business days
  const calculateBusinessDays = (start: Date, end: Date): number => {
    const days = eachDayOfInterval({ start, end })
    return days.filter(day => !isWeekend(day)).length
  }

  // Calculate comprehensive metrics
  const metrics: FieldMetrics = useMemo(() => {
    const currentMonth = new Date()
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const businessDaysInMonth = calculateBusinessDays(monthStart, monthEnd)
    const businessDaysToDate = calculateBusinessDays(monthStart, new Date())

    const totalLogs = filteredData.dailyLogs.length
    const completedLogs = filteredData.dailyLogs.filter((log) => log.status === "submitted").length
    const expectedLogs = businessDaysToDate * (filteredData.dailyLogs.length > 0 ? 
      new Set(filteredData.dailyLogs.map(log => log.projectId)).size : 1)
    const logComplianceRate = expectedLogs > 0 ? Math.round((completedLogs / expectedLogs) * 100) : 100

    const totalWorkers = filteredData.manpower.reduce((sum, mp) => sum + mp.workers, 0)
    const totalEfficiency = filteredData.manpower.reduce((sum, mp) => sum + mp.efficiency, 0)
    const averageEfficiency = filteredData.manpower.length > 0 ? Math.round(totalEfficiency / filteredData.manpower.length) : 0

    const safetyViolations = filteredData.safety.reduce((sum, sa) => sum + sa.violations, 0)
    const atRiskSafetyItems = filteredData.safety.reduce((sum, sa) => sum + sa.atRiskItems, 0)
    const passedSafetyAudits = filteredData.safety.filter((sa) => sa.status === "pass").length
    const safetyComplianceRate = filteredData.safety.length > 0 ? Math.round((passedSafetyAudits / filteredData.safety.length) * 100) : 100

    const qualityDefects = filteredData.qualityControl.reduce((sum, qc) => sum + qc.defects, 0)
    const passedInspections = filteredData.qualityControl.filter((qc) => qc.status === "pass").length
    const qualityPassRate = filteredData.qualityControl.length > 0 ? Math.round((passedInspections / filteredData.qualityControl.length) * 100) : 100

    return {
      totalLogs,
      logComplianceRate,
      expectedLogs,
      completedLogs,
      totalWorkers,
      averageEfficiency,
      safetyViolations,
      safetyComplianceRate,
      qualityDefects,
      qualityPassRate,
      totalInspections: filteredData.qualityControl.length + filteredData.safety.length,
      atRiskSafetyItems,
      businessDaysInMonth,
      businessDaysToDate,
    }
  }, [filteredData])

  // Generate insights based on current metrics
  const insights = useMemo(() => generateInsights(filteredData, metrics), [generateInsights, filteredData, metrics])

  // Modal handlers
  const openReportModal = (report: any, type: "daily-log" | "quality" | "safety") => {
    setSelectedReport(report)
    setReportModalType(type)
  }

  const closeReportModal = () => {
    setSelectedReport(null)
    setReportModalType(null)
  }

  // Generate report-specific insights
  const generateReportInsights = (report: any, type: string) => {
    const insights = []

    if (type === "daily-log") {
      if (report.status === "overdue") {
        insights.push({
          type: "warning",
          title: "Overdue Daily Log",
          description: "This daily log was submitted late, potentially affecting project tracking accuracy.",
          recommendation: "Implement automated reminders for timely submissions."
        })
      }
      
      if (report.totalWorkers > 50) {
        insights.push({
          type: "info",
          title: "High Workforce Deployment",
          description: `${report.totalWorkers} workers deployed - above average for this project type.`,
          recommendation: "Monitor productivity metrics and coordination efficiency."
        })
      }

      if (report.weatherConditions?.precipitation_since?.midnight !== "0.00 in.") {
        insights.push({
          type: "warning",
          title: "Weather Impact",
          description: "Precipitation detected - may affect outdoor work productivity.",
          recommendation: "Consider weather delays and safety protocols."
        })
      }
    }

    if (type === "safety") {
      if (report.atRiskItems > 3) {
        insights.push({
          type: "critical",
          title: "Multiple Safety Risks",
          description: `${report.atRiskItems} at-risk items identified in this audit.`,
          recommendation: "Immediate safety meeting and corrective actions required."
        })
      }

      if (report.complianceScore < 80) {
        insights.push({
          type: "warning",
          title: "Low Safety Compliance",
          description: `Compliance score of ${report.complianceScore}% is below acceptable threshold.`,
          recommendation: "Comprehensive safety training and process review needed."
        })
      }
    }

    if (type === "quality") {
      if (report.defects > 5) {
        insights.push({
          type: "warning",
          title: "High Defect Count",
          description: `${report.defects} defects found in this inspection.`,
          recommendation: "Review work quality processes and increase supervision."
        })
      }

      if (report.trade === "Electrical" && report.defects > 0) {
        insights.push({
          type: "critical",
          title: "Electrical Safety Concern",
          description: "Electrical defects pose safety risks and code compliance issues.",
          recommendation: "Immediate electrical contractor review and correction required."
        })
      }
    }

    return insights
  }

  // Get unique values for filters
  const uniqueProjects = useMemo(() => {
    const projects = new Set([
      ...filteredData.dailyLogs.map((log) => log.projectId),
      ...filteredData.qualityControl.map((qc) => qc.projectId),
      ...filteredData.safety.map((sa) => sa.projectId),
    ])
    return Array.from(projects)
  }, [filteredData])

  const uniqueContractors = useMemo(() => {
    const contractors = new Set(filteredData.manpower.map((mp) => mp.contractor))
    return Array.from(contractors)
  }, [filteredData.manpower])

  const uniqueTrades = useMemo(() => {
    const trades = new Set([
      ...filteredData.qualityControl.map((qc) => qc.trade),
      ...filteredData.safety.map((sa) => sa.trade),
      ...filteredData.manpower.map((mp) => mp.trade),
    ])
    return Array.from(trades)
  }, [filteredData])

  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading field reports...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <AppHeader />
      
      {/* Page Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#003087] dark:text-white mb-1">Field Reports</h1>
              <p className="text-muted-foreground text-sm">
                Daily logs, quality control, safety audits, and manpower tracking across all projects
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-background/50">
                {metrics.totalLogs + metrics.totalInspections} Total Records
              </Badge>
              <Badge variant="outline" className="bg-background/50">
                {uniqueProjects.length} Projects
              </Badge>
              <Button size="sm" className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Button>
              <Button onClick={() => setShowExportModal(true)} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Log Compliance</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#003087] dark:text-white flex items-center gap-2">
                    {metrics.logComplianceRate}%
                    {metrics.logComplianceRate >= 95 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : metrics.logComplianceRate < 85 ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : (
                      <Target className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.completedLogs} of {metrics.expectedLogs} expected logs ({metrics.businessDaysToDate} business days)
                  </p>
                  <Progress value={metrics.logComplianceRate} className="mt-3 h-2" />
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 rounded-bl-full" />
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Safety Compliance</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#003087] dark:text-white flex items-center gap-2">
                    {metrics.safetyComplianceRate}%
                    {metrics.atRiskSafetyItems <= 2 ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : metrics.atRiskSafetyItems > 5 ? (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.atRiskSafetyItems} at-risk items • {filteredData.safety.length} audits
                  </p>
                  <Progress value={metrics.safetyComplianceRate} className="mt-3 h-2" />
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/20 rounded-bl-full" />
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quality Pass Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#003087] dark:text-white flex items-center gap-2">
                    {metrics.qualityPassRate}%
                    {metrics.qualityPassRate >= 90 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : metrics.qualityPassRate < 80 ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : (
                      <Target className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.qualityDefects} defects • {filteredData.qualityControl.length} inspections
                  </p>
                  <Progress value={metrics.qualityPassRate} className="mt-3 h-2" />
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/20 rounded-bl-full" />
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Workforce Efficiency</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#003087] dark:text-white flex items-center gap-2">
                    {metrics.averageEfficiency}%
                    {metrics.averageEfficiency >= 85 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : metrics.averageEfficiency < 75 ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : (
                      <Target className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.totalWorkers} workers • {filteredData.manpower.reduce((sum, mp) => sum + mp.totalHours, 0)} total hours
                  </p>
                  <Progress value={metrics.averageEfficiency} className="mt-3 h-2" />
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-900/20 rounded-bl-full" />
                </CardContent>
              </Card>
            </div>

            {/* AI Insights Panel */}
            {insights.length > 0 && (
              <Card className="border-l-4 border-l-[#FF6B35]">
                <CardHeader>
                  <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-[#FF6B35]" />
                    AI-Powered Field Insights
                    <Badge variant="secondary" className="bg-[#FF6B35] text-white text-xs">
                      {insights.length} insights
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Real-time analysis of field operations performance and recommendations for improvement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insights.slice(0, 3).map((insight, index) => (
                    <div
                      key={index}
                      className={`border-l-4 p-4 rounded-r-lg ${
                        insight.type === "critical"
                          ? "border-l-red-500 bg-red-50 dark:bg-red-900/10"
                          : insight.type === "warning"
                          ? "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10"
                          : insight.type === "positive"
                          ? "border-l-green-500 bg-green-50 dark:bg-green-900/10"
                          : "border-l-blue-500 bg-blue-50 dark:bg-blue-900/10"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {insight.type === "critical" && <AlertTriangle className="h-5 w-5 text-red-600" />}
                          {insight.type === "warning" && <Clock className="h-5 w-5 text-yellow-600" />}
                          {insight.type === "positive" && <CheckCircle className="h-5 w-5 text-green-600" />}
                          {insight.type === "info" && <Lightbulb className="h-5 w-5 text-blue-600" />}
                          <span className="font-semibold text-foreground">{insight.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={
                              insight.priority === "urgent"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                : insight.priority === "high"
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                : insight.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            }
                          >
                            {insight.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {insight.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                      <div className="bg-background/50 p-3 rounded border-l-2 border-l-muted">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-[#FF6B35] mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-foreground">Recommendation: </span>
                            <span className="text-sm text-muted-foreground">{insight.recommendation}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {user?.role === "project-manager" && insights.some(i => i.priority === "urgent") && (
                    <div className="bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8A65]/10 p-4 rounded-lg border border-[#FF6B35]/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-[#003087] dark:text-white mb-1">Action Required</h4>
                          <p className="text-sm text-muted-foreground">
                            {insights.filter((i) => i.priority === "urgent").length} urgent items require immediate attention
                          </p>
                        </div>
                        <Button size="sm" className="bg-[#FF6B35] hover:bg-[#FF5722] text-white">
                          Create Action Plan
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Main Tabs */}
            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="daily-logs" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Daily Logs ({filteredData.dailyLogs.length})
                    </TabsTrigger>
                    <TabsTrigger value="quality" className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Quality ({filteredData.qualityControl.length})
                    </TabsTrigger>
                    <TabsTrigger value="safety" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Safety ({filteredData.safety.length})
                    </TabsTrigger>
                    <TabsTrigger value="manpower" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Manpower ({filteredData.manpower.length})
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent>
                  <TabsContent value="overview" className="space-y-6">
                    {/* Overview Dashboard */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Monthly Progress Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Monthly Progress Tracking
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Business Days Completed</span>
                              <span className="text-sm text-muted-foreground">
                                {metrics.businessDaysToDate} / {metrics.businessDaysInMonth}
                              </span>
                            </div>
                            <Progress 
                              value={(metrics.businessDaysToDate / metrics.businessDaysInMonth) * 100} 
                              className="h-3"
                            />
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Expected Daily Logs</span>
                              <span className="text-sm text-muted-foreground">
                                {metrics.completedLogs} / {metrics.expectedLogs}
                              </span>
                            </div>
                            <Progress value={metrics.logComplianceRate} className="h-3" />
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Safety Compliance</span>
                              <span className="text-sm text-muted-foreground">{metrics.safetyComplianceRate}%</span>
                            </div>
                            <Progress value={metrics.safetyComplianceRate} className="h-3" />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Project Summary */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Project Activity Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {uniqueProjects.slice(0, 3).map((projectId) => {
                              const projectLogs = filteredData.dailyLogs.filter(log => log.projectId === projectId)
                              const projectName = projectLogs[0]?.projectName || `Project ${projectId}`
                              const projectCompliance = projectLogs.length > 0 
                                ? Math.round((projectLogs.filter(log => log.status === "submitted").length / projectLogs.length) * 100)
                                : 100
                              
                              return (
                                <div key={projectId} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium truncate">{projectName}</span>
                                    <span className="text-xs text-muted-foreground">{projectCompliance}%</span>
                                  </div>
                                  <Progress value={projectCompliance} className="h-2" />
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="daily-logs" className="space-y-4">
                    {/* Filters Bar */}
                    <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="relative min-w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search daily logs..."
                          value={filters.search}
                          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                      <Select
                        value={filters.status}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Daily Logs Table */}
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Project</TableHead>
                              <TableHead>Submitted By</TableHead>
                              <TableHead>Workers</TableHead>
                              <TableHead>Hours</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="w-12"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredData.dailyLogs.slice(0, 10).map((log) => (
                              <TableRow key={log.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                    {format(new Date(log.date), "MMM dd, yyyy")}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{log.projectName}</div>
                                    <div className="text-xs text-muted-foreground">ID: {log.projectId}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    {log.submittedBy}
                                  </div>
                                </TableCell>
                                <TableCell>{log.totalWorkers}</TableCell>
                                <TableCell>{log.totalHours}h</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className={
                                      log.status === "submitted"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                        : log.status === "overdue"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                    }
                                  >
                                    {log.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => openReportModal(log, "daily-log")}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="quality" className="space-y-4">
                    {/* Quality Control Table */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-[#003087] dark:text-white">Quality Control Inspections</CardTitle>
                        <CardDescription>
                          Track quality inspections, identify defects, and monitor compliance across all trades
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Project</TableHead>
                              <TableHead>Trade</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Defects</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Inspector</TableHead>
                              <TableHead className="w-12">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredData.qualityControl.slice(0, 10).map((qc) => (
                              <TableRow key={qc.id}>
                                <TableCell>{format(new Date(qc.date), "MMM dd")}</TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div className="font-medium">{qc.projectName}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{qc.trade}</Badge>
                                </TableCell>
                                <TableCell>{qc.location}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {qc.defects > 0 ? (
                                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    )}
                                    {qc.defects}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className={
                                      qc.status === "pass"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                    }
                                  >
                                    {qc.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>{qc.createdBy}</TableCell>
                                <TableCell>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => openReportModal(qc, "quality")}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="safety" className="space-y-4">
                    {/* Safety Audits Table */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-[#003087] dark:text-white">Safety Audits</CardTitle>
                        <CardDescription>
                          Monitor safety compliance, track violations, and ensure workplace safety standards
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Project</TableHead>
                              <TableHead>Trade</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>At Risk Items</TableHead>
                              <TableHead>Compliance</TableHead>
                              <TableHead>Auditor</TableHead>
                              <TableHead className="w-12">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredData.safety.slice(0, 10).map((safety) => (
                              <TableRow key={safety.id}>
                                <TableCell>{format(new Date(safety.date), "MMM dd")}</TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div className="font-medium">{safety.projectName}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{safety.trade}</Badge>
                                </TableCell>
                                <TableCell>{safety.location}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {safety.atRiskItems > 0 ? (
                                      <AlertTriangle className="h-4 w-4 text-red-500" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    )}
                                    {safety.atRiskItems}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        safety.complianceScore >= 90
                                          ? "bg-green-500"
                                          : safety.complianceScore >= 80
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      }`}
                                    />
                                    {safety.complianceScore}%
                                  </div>
                                </TableCell>
                                <TableCell>{safety.createdBy}</TableCell>
                                <TableCell>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => openReportModal(safety, "safety")}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="manpower" className="space-y-4">
                    {/* Manpower Table */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-[#003087] dark:text-white">Manpower Tracking</CardTitle>
                        <CardDescription>
                          Monitor workforce deployment, productivity, and resource allocation across projects
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Contractor</TableHead>
                              <TableHead>Trade</TableHead>
                              <TableHead>Workers</TableHead>
                              <TableHead>Hours</TableHead>
                              <TableHead>Efficiency</TableHead>
                              <TableHead>Cost/Hour</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredData.manpower.slice(0, 10).map((mp) => (
                              <TableRow key={mp.id}>
                                <TableCell>{format(new Date(mp.date), "MMM dd")}</TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div className="font-medium">{mp.contractor}</div>
                                    <div className="text-xs text-muted-foreground">{mp.location}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{mp.trade}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    {mp.workers}
                                  </div>
                                </TableCell>
                                <TableCell>{mp.totalHours}h</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        mp.efficiency >= 90
                                          ? "bg-green-500"
                                          : mp.efficiency >= 80
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      }`}
                                    />
                                    {mp.efficiency}%
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    ${mp.costPerHour}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </ScrollArea>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Field Reports
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Export Format</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel (.xlsx)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      PDF Report
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Data Selection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Daily Logs ({filteredData.dailyLogs.length})</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Quality Control ({filteredData.qualityControl.length})</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Safety Audits ({filteredData.safety.length})</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Manpower ({filteredData.manpower.length})</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setShowExportModal(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-[#FF6B35] hover:bg-[#FF5722] text-white"
                  onClick={() => {
                    // Export logic would go here
                    console.log("Exporting field reports...")
                    setShowExportModal(false)
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Detailed Report Modals */}
      {selectedReport && reportModalType && (
        <div className="relative z-[9999]">
          <Dialog open={!!selectedReport} onOpenChange={closeReportModal}>
            <DialogContent className="w-[70vw] max-w-none max-h-[90vh] overflow-y-auto" style={{ zIndex: 9999 }}>
            <DialogHeader>
              <DialogTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                {reportModalType === "daily-log" && <FileText className="h-5 w-5" />}
                {reportModalType === "quality" && <CheckCircle className="h-5 w-5" />}
                {reportModalType === "safety" && <Shield className="h-5 w-5" />}
                {reportModalType === "daily-log" && "Daily Log Details"}
                {reportModalType === "quality" && "Quality Control Inspection"}
                {reportModalType === "safety" && "Safety Audit Report"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Report Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedReport.projectName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(selectedReport.date), "EEEE, MMMM dd, yyyy")} • 
                        Project ID: {selectedReport.projectId}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        selectedReport.status === "submitted" || selectedReport.status === "pass"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : selectedReport.status === "overdue" || selectedReport.status === "fail"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }
                    >
                      {selectedReport.status}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Daily Log Content */}
                  {reportModalType === "daily-log" && (
                    <>
                      {/* Weather Conditions */}
                      {selectedReport.weatherConditions && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                              <CalendarIcon className="h-5 w-5" />
                              Weather Conditions
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-[#003087] dark:text-white">
                                  {selectedReport.weatherConditions.temperature?.avg || "N/A"}
                                </div>
                                <div className="text-xs text-muted-foreground">Average Temp</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-[#003087] dark:text-white">
                                  {selectedReport.weatherConditions.humidity?.avg || "N/A"}
                                </div>
                                <div className="text-xs text-muted-foreground">Humidity</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-[#003087] dark:text-white">
                                  {selectedReport.weatherConditions.windspeed?.avg || "N/A"}
                                </div>
                                <div className="text-xs text-muted-foreground">Wind Speed</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-[#003087] dark:text-white">
                                  {selectedReport.weatherConditions.precipitation_since?.midnight || "N/A"}
                                </div>
                                <div className="text-xs text-muted-foreground">Precipitation</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Manpower Breakdown */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Manpower Deployment
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center p-4 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-[#003087] dark:text-white">
                                  {selectedReport.totalWorkers}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Workers</div>
                              </div>
                              <div className="text-center p-4 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-[#003087] dark:text-white">
                                  {selectedReport.totalHours}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Hours</div>
                              </div>
                            </div>
                            
                            {selectedReport.manpowerEntries && selectedReport.manpowerEntries.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-[#003087] dark:text-white">Contractor Breakdown</h4>
                                {selectedReport.manpowerEntries.map((entry: any, index: number) => (
                                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                                    <div>
                                      <div className="font-medium text-sm">{entry.contact_company}</div>
                                      <div className="text-xs text-muted-foreground">{entry.location}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium">{entry.workers} workers</div>
                                      <div className="text-xs text-muted-foreground">{entry.total_hours}h total</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Activities */}
                      {selectedReport.activities && selectedReport.activities.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                              <BarChart3 className="h-5 w-5" />
                              Daily Activities
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {selectedReport.activities.map((activity: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{activity.description}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {activity.type} • {activity.responsible_party}
                                    </div>
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className={
                                      activity.status === "completed"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                        : activity.status === "in-progress"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                    }
                                  >
                                    {activity.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}

                  {/* Quality Control Content */}
                  {reportModalType === "quality" && (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Inspection Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-[#003087] dark:text-white">
                                {selectedReport.trade}
                              </div>
                              <div className="text-sm text-muted-foreground">Trade</div>
                            </div>
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-[#003087] dark:text-white">
                                {selectedReport.location}
                              </div>
                              <div className="text-sm text-muted-foreground">Location</div>
                            </div>
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-[#003087] dark:text-white">
                                {selectedReport.defects}
                              </div>
                              <div className="text-sm text-muted-foreground">Defects Found</div>
                            </div>
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-[#003087] dark:text-white">
                                {selectedReport.createdBy}
                              </div>
                              <div className="text-sm text-muted-foreground">Inspector</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Checklist */}
                      {selectedReport.checklist && selectedReport.checklist.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-[#003087] dark:text-white">Quality Checklist</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {selectedReport.checklist.map((item: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded">
                                  <span className="text-sm">{item.question}</span>
                                  <Badge
                                    variant="secondary"
                                    className={
                                      item.response === "Yes"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                        : item.response === "No"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                    }
                                  >
                                    {item.response}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}

                  {/* Safety Content */}
                  {reportModalType === "safety" && (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Safety Audit Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-[#003087] dark:text-white">
                                {selectedReport.trade}
                              </div>
                              <div className="text-sm text-muted-foreground">Trade</div>
                            </div>
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-[#003087] dark:text-white">
                                {selectedReport.location}
                              </div>
                              <div className="text-sm text-muted-foreground">Location</div>
                            </div>
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-[#003087] dark:text-white">
                                {selectedReport.atRiskItems}
                              </div>
                              <div className="text-sm text-muted-foreground">At Risk Items</div>
                            </div>
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-[#003087] dark:text-white">
                                {selectedReport.complianceScore}%
                              </div>
                              <div className="text-sm text-muted-foreground">Compliance Score</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Safety Responses */}
                      {selectedReport.responses && selectedReport.responses.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-[#003087] dark:text-white">Safety Assessment</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {selectedReport.responses.map((response: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded">
                                  <span className="text-sm">{response.question}</span>
                                  <Badge
                                    variant="secondary"
                                    className={
                                      response.response === "Safe"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                        : response.response === "At Risk"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                    }
                                  >
                                    {response.response}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}

                  {/* Comments */}
                  {selectedReport.comments && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-[#003087] dark:text-white">Comments & Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
                          {selectedReport.comments}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar - Analytics & Insights */}
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#003087] dark:text-white text-sm">Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {reportModalType === "daily-log" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Efficiency</span>
                            <span className="font-medium">
                              {selectedReport.totalHours > 0 
                                ? Math.round((selectedReport.totalWorkers * 8) / selectedReport.totalHours * 100)
                                : 0}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Avg Workers/Hour</span>
                            <span className="font-medium">
                              {selectedReport.totalHours > 0 
                                ? (selectedReport.totalWorkers / (selectedReport.totalHours / selectedReport.totalWorkers)).toFixed(1)
                                : "0"}
                            </span>
                          </div>
                        </>
                      )}
                      
                      {reportModalType === "quality" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Pass Rate</span>
                            <span className="font-medium">
                              {selectedReport.checklist 
                                ? Math.round((selectedReport.checklist.filter((item: any) => item.response === "Yes").length / selectedReport.checklist.length) * 100)
                                : 0}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Items Checked</span>
                            <span className="font-medium">{selectedReport.checklist?.length || 0}</span>
                          </div>
                        </>
                      )}

                      {reportModalType === "safety" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Safe Items</span>
                            <span className="font-medium">
                              {selectedReport.responses?.filter((r: any) => r.response === "Safe").length || 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Assessed</span>
                            <span className="font-medium">{selectedReport.responses?.length || 0}</span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* AI Insights */}
                  <Card className="border-l-4 border-l-[#FF6B35]">
                    <CardHeader>
                      <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2 text-sm">
                        <Brain className="h-4 w-4 text-[#FF6B35]" />
                        AI Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {generateReportInsights(selectedReport, reportModalType).length > 0 ? (
                        <div className="space-y-3">
                          {generateReportInsights(selectedReport, reportModalType).map((insight: any, index: number) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border-l-4 ${
                                insight.type === "critical"
                                  ? "border-l-red-500 bg-red-50 dark:bg-red-900/10"
                                  : insight.type === "warning"
                                  ? "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10"
                                  : insight.type === "info"
                                  ? "border-l-blue-500 bg-blue-50 dark:bg-blue-900/10"
                                  : "border-l-green-500 bg-green-50 dark:bg-green-900/10"
                              }`}
                            >
                              <div className="font-medium text-sm mb-1">{insight.title}</div>
                              <div className="text-xs text-muted-foreground mb-2">{insight.description}</div>
                              <div className="text-xs font-medium text-[#FF6B35]">
                                💡 {insight.recommendation}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No issues detected. Report meets all standards.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Attachments */}
                  {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-[#003087] dark:text-white text-sm">Attachments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedReport.attachments.map((attachment: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{attachment}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={closeReportModal}>
                  Close
                </Button>
                {user?.role === "project-manager" && (
                  <>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Report
                    </Button>
                    <Button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      )}
    </div>
  )
} 