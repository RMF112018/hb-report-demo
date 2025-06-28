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
import { useProjectFilter } from "@/hooks/use-project-filter"
import { mockProjects } from "@/data/mock-projects"
import {
  Plus,
  Users,
  Clock,
  MapPin,
  TrendingUp,
  Download,
  Edit,
  Trash2,
  Filter,
  Search,
  BarChart3,
  Activity,
  AlertTriangle,
} from "lucide-react"
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import {
  Line,
  LineChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart as RechartsPieChart,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AiInsightsCard } from "@/components/dashboard/ai-insights-card"

/**
 * ManpowerRecord interface for type safety
 * Extends the base ManpowerRecord from types/index.ts with additional UI properties
 */
interface ExtendedManpowerRecord {
  id: string
  projectId: string // Changed to string to match mockProjects
  contractor: string
  workers: number
  hours: number
  date: string
  trade: string
  location?: string
  comments?: string
  createdAt: string
  // Additional calculated fields
  totalManHours?: number
  efficiency?: number
  costPerHour?: number
  status?: "active" | "completed" | "pending"
}

/**
 * Chart data interface for visualization
 */
interface ChartDataPoint {
  date: string
  contractor: string
  workers: number
  hours: number
  totalManHours: number
}

/**
 * Summary statistics interface
 */
interface ManpowerSummary {
  totalWorkers: number
  totalHours: number
  totalManHours: number
  activeContractors: number
  averageWorkersPerDay: number
  peakWorkers: number
  efficiency: number
  topContractor: string
}

/**
 * Manpower Tracking Page Component
 *
 * Comprehensive manpower tracking system with:
 * - Real-time data visualization and analytics
 * - CRUD operations for manpower records
 * - Advanced filtering and search capabilities
 * - Export functionality for reporting
 * - Mobile-responsive design
 * - Integration with project management system
 * - AI-generated insights (HBI Insights)
 *
 * @returns {JSX.Element} Manpower tracking interface
 */
export default function ManpowerTrackingPage() {
  const { user } = useAuth()
  const { selectedProject, getProjectContext } = useProjectFilter()
  const projectContext = getProjectContext()

  // Core state management
  const [records, setRecords] = useState<ExtendedManpowerRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<ExtendedManpowerRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UI state management
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ExtendedManpowerRecord | null>(null)

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContractor, setSelectedContractor] = useState<string>("all")
  const [selectedTrade, setSelectedTrade] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })

  // Form state for create/edit operations
  const [formData, setFormData] = useState({
    contractor: "",
    workers: "",
    hours: "",
    date: format(new Date(), "yyyy-MM-dd"),
    trade: "",
    location: "",
    comments: "",
  })

  /**
   * Generate comprehensive mock data for manpower tracking
   * In production, this would be replaced with API calls
   * Data is generated for all mock projects.
   */
  const generateMockData = useCallback((): ExtendedManpowerRecord[] => {
    const contractors = [
      "ABC Construction",
      "BuildRight LLC",
      "Premier Contractors",
      "Elite Construction",
      "Skyline Builders",
      "Foundation Pro",
      "Steel Works Inc",
      "Concrete Masters",
      "Electrical Solutions",
    ]

    const trades = [
      "General Labor",
      "Electrical",
      "Plumbing",
      "HVAC",
      "Concrete",
      "Steel",
      "Carpentry",
      "Roofing",
      "Painting",
    ]

    const locations = [
      "Building A - Floor 1",
      "Building A - Floor 2",
      "Building B - Basement",
      "Parking Garage",
      "Site Preparation",
      "Utility Installation",
      "Main Entrance",
      "Loading Dock",
      "Mechanical Room",
    ]

    const mockRecords: ExtendedManpowerRecord[] = []
    const today = new Date()

    mockProjects.forEach((project) => {
      // Generate 90 days of historical data for each project
      for (let i = 0; i < 90; i++) {
        const recordDate = new Date(today)
        recordDate.setDate(today.getDate() - i)

        // Generate 3-8 records per day per project
        const recordsPerDay = Math.floor(Math.random() * 6) + 3

        for (let j = 0; j < recordsPerDay; j++) {
          const contractor = contractors[Math.floor(Math.random() * contractors.length)]
          const trade = trades[Math.floor(Math.random() * trades.length)]
          const workers = Math.floor(Math.random() * 15) + 1
          const hours = Math.floor(Math.random() * 4) + 6 // 6-10 hours
          const totalManHours = workers * hours

          mockRecords.push({
            id: `manpower-${project.id}-${Date.now()}-${i}-${j}`,
            projectId: project.id.toString(), // Explicitly convert to string
            contractor,
            workers,
            hours,
            date: format(recordDate, "yyyy-MM-dd"),
            trade,
            location: locations[Math.floor(Math.random() * locations.length)],
            comments: Math.random() > 0.7 ? "Additional notes about work performed" : "",
            createdAt: recordDate.toISOString(),
            totalManHours,
            efficiency: Math.floor(Math.random() * 30) + 70, // 70-100% efficiency
            costPerHour: Math.floor(Math.random() * 20) + 25, // $25-45 per hour
            status: Math.random() > 0.1 ? "completed" : "active",
          })
        }
      }
    })

    return mockRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [])

  /**
   * Load manpower data on component mount and filter by selected project
   * Simulates API call with loading state
   */
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const allMockData = generateMockData()
        setRecords(allMockData)

        toast({
          title: "Data Loaded",
          description: `Loaded ${allMockData.length} manpower records successfully.`,
        })
      } catch (err) {
        setError("Failed to load manpower data")
        toast({
          title: "Error",
          description: "Failed to load manpower data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [generateMockData])

  /**
   * Filter records based on selected project from useProjectFilter hook
   */
  useEffect(() => {
    if (selectedProject === "all") {
      setFilteredRecords(records)
    } else {
      setFilteredRecords(records.filter((record) => record.projectId === selectedProject))
    }
  }, [records, selectedProject])

  /**
   * Apply additional filters to records based on search term, contractor, trade, and date range
   */
  useEffect(() => {
    let currentFiltered = records.filter((record) =>
      selectedProject === "all" ? true : record.projectId === selectedProject,
    )

    // Apply search filter
    if (searchTerm) {
      currentFiltered = currentFiltered.filter(
        (record) =>
          record.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.comments?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply contractor filter
    if (selectedContractor !== "all") {
      currentFiltered = currentFiltered.filter((record) => record.contractor === selectedContractor)
    }

    // Apply trade filter
    if (selectedTrade !== "all") {
      currentFiltered = currentFiltered.filter((record) => record.trade === selectedTrade)
    }

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      currentFiltered = currentFiltered.filter((record) => {
        const recordDate = parseISO(record.date)
        return isWithinInterval(recordDate, { start: dateRange.from!, end: dateRange.to! })
      })
    }

    setFilteredRecords(currentFiltered)
  }, [records, searchTerm, selectedContractor, selectedTrade, dateRange, selectedProject])

  /**
   * Calculate summary statistics from filtered records
   */
  const summaryStats = useMemo((): ManpowerSummary => {
    if (filteredRecords.length === 0) {
      return {
        totalWorkers: 0,
        totalHours: 0,
        totalManHours: 0,
        activeContractors: 0,
        averageWorkersPerDay: 0,
        peakWorkers: 0,
        efficiency: 0,
        topContractor: "N/A",
      }
    }

    const totalWorkers = filteredRecords.reduce((sum, record) => sum + record.workers, 0)
    const totalHours = filteredRecords.reduce((sum, record) => sum + record.hours, 0)
    const totalManHours = filteredRecords.reduce((sum, record) => sum + (record.totalManHours || 0), 0)
    const uniqueContractors = new Set(filteredRecords.map((record) => record.contractor))
    const uniqueDates = new Set(filteredRecords.map((record) => record.date))

    // Calculate peak workers per day
    const dailyWorkers = new Map<string, number>()
    filteredRecords.forEach((record) => {
      const current = dailyWorkers.get(record.date) || 0
      dailyWorkers.set(record.date, current + record.workers)
    })
    const peakWorkers = Math.max(...Array.from(dailyWorkers.values()))

    // Find top contractor by total man-hours
    const contractorHours = new Map<string, number>()
    filteredRecords.forEach((record) => {
      const current = contractorHours.get(record.contractor) || 0
      contractorHours.set(record.contractor, current + (record.totalManHours || 0))
    })
    const topContractor = Array.from(contractorHours.entries()).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"

    // Calculate average efficiency
    const avgEfficiency =
      filteredRecords.reduce((sum, record) => sum + (record.efficiency || 0), 0) / filteredRecords.length

    return {
      totalWorkers,
      totalHours,
      totalManHours,
      activeContractors: uniqueContractors.size,
      averageWorkersPerDay: Math.round(totalWorkers / uniqueDates.size),
      peakWorkers,
      efficiency: Math.round(avgEfficiency),
      topContractor,
    }
  }, [filteredRecords])

  /**
   * Generate mock HBI Insights based on current summary statistics.
   * @returns {string[]} An array of AI-generated insights.
   */
  const generateHbiInsights = useCallback((): string[] => {
    const insights: string[] = []

    if (summaryStats.totalWorkers === 0) {
      insights.push("No manpower data available for the selected filters. Consider adding new records.")
      return insights
    }

    insights.push(
      `The project currently has a total of ${summaryStats.totalWorkers.toLocaleString()} workers recorded, contributing ${summaryStats.totalManHours.toLocaleString()} man-hours.`,
    )

    if (summaryStats.averageWorkersPerDay > 0) {
      insights.push(
        `On average, ${summaryStats.averageWorkersPerDay} workers are active daily, indicating consistent resource allocation.`,
      )
    }

    if (summaryStats.peakWorkers > 0) {
      insights.push(
        `Peak worker count reached ${summaryStats.peakWorkers} workers on a single day, highlighting periods of high activity.`,
      )
    }

    if (summaryStats.efficiency < 80) {
      insights.push(
        `Current efficiency is ${summaryStats.efficiency}%. Consider reviewing processes for potential productivity improvements.`,
      )
    } else {
      insights.push(
        `Excellent efficiency at ${summaryStats.efficiency}%, indicating strong productivity and resource management.`,
      )
    }

    if (summaryStats.activeContractors > 1) {
      insights.push(
        `There are ${summaryStats.activeContractors} active contractors. ${summaryStats.topContractor} is the top contributor by man-hours.`,
      )
    } else if (summaryStats.activeContractors === 1) {
      insights.push(`Only one contractor (${summaryStats.topContractor}) is currently active.`)
    }

    // Add more complex insights based on trends or specific conditions
    const recentRecords = filteredRecords.filter((record) =>
      isWithinInterval(parseISO(record.date), {
        start: new Date(new Date().setDate(new Date().getDate() - 7)),
        end: new Date(),
      }),
    )
    if (recentRecords.length === 0 && filteredRecords.length > 0) {
      insights.push("No recent manpower entries in the last 7 days. Ensure data is up-to-date.")
    } else if (recentRecords.length > 0 && recentRecords.length < filteredRecords.length / 2) {
      insights.push("Manpower activity has decreased recently. Investigate potential reasons for the slowdown.")
    }

    return insights
  }, [summaryStats, filteredRecords])

  /**
   * Get unique contractors for filter dropdown
   */
  const uniqueContractors = useMemo(() => {
    return Array.from(new Set(records.map((record) => record.contractor))).sort()
  }, [records])

  /**
   * Get unique trades for filter dropdown
   */
  const uniqueTrades = useMemo(() => {
    return Array.from(new Set(records.map((record) => record.trade))).sort()
  }, [records])

  /**
   * Prepare chart data for visualization
   */
  const chartData = useMemo((): ChartDataPoint[] => {
    const dailyData = new Map<string, Map<string, ChartDataPoint>>()

    filteredRecords.forEach((record) => {
      if (!dailyData.has(record.date)) {
        dailyData.set(record.date, new Map())
      }

      const dayData = dailyData.get(record.date)!
      const existing = dayData.get(record.contractor)

      if (existing) {
        existing.workers += record.workers
        existing.hours += record.hours
        existing.totalManHours += record.totalManHours || 0
      } else {
        dayData.set(record.contractor, {
          date: record.date,
          contractor: record.contractor,
          workers: record.workers,
          hours: record.hours,
          totalManHours: record.totalManHours || 0,
        })
      }
    })

    const result: ChartDataPoint[] = []
    dailyData.forEach((dayData) => {
      dayData.forEach((point) => result.push(point))
    })

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [filteredRecords])

  /**
   * Prepare daily worker count data for line chart
   */
  const dailyWorkerData = useMemo(() => {
    const dailyTotals = new Map<string, number>()

    filteredRecords.forEach((record) => {
      const current = dailyTotals.get(record.date) || 0
      dailyTotals.set(record.date, current + record.workers)
    })

    return Array.from(dailyTotals.entries())
      .map(([date, workers]) => ({
        date: format(parseISO(date), "MMM dd"),
        workers,
        fullDate: date,
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
      .slice(-30) // Show last 30 days
  }, [filteredRecords])

  /**
   * Prepare contractor distribution data for pie chart
   */
  const contractorDistributionData = useMemo(() => {
    const contractorTotals = new Map<string, number>()

    filteredRecords.forEach((record) => {
      const current = contractorTotals.get(record.contractor) || 0
      contractorTotals.set(record.contractor, current + record.workers)
    })

    return Array.from(contractorTotals.entries())
      .map(([contractor, workers]) => ({
        contractor: contractor.length > 15 ? contractor.substring(0, 15) + "..." : contractor,
        workers,
        percentage: 0, // Will be calculated below
      }))
      .sort((a, b) => b.workers - a.workers)
      .slice(0, 8) // Top 8 contractors
      .map((item, index, array) => {
        const total = array.reduce((sum, i) => sum + i.workers, 0)
        return {
          ...item,
          percentage: Math.round((item.workers / total) * 100),
        }
      })
  }, [filteredRecords])

  /**
   * Handle form input changes
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  /**
   * Handle create new manpower record
   */
  const handleCreate = async () => {
    try {
      const newRecord: ExtendedManpowerRecord = {
        id: `manpower-${Date.now()}`,
        projectId: selectedProject, // Assign to current selected project
        contractor: formData.contractor,
        workers: Number.parseInt(formData.workers),
        hours: Number.parseInt(formData.hours),
        date: formData.date,
        trade: formData.trade,
        location: formData.location,
        comments: formData.comments,
        createdAt: new Date().toISOString(),
        totalManHours: Number.parseInt(formData.workers) * Number.parseInt(formData.hours),
        efficiency: Math.floor(Math.random() * 30) + 70,
        costPerHour: Math.floor(Math.random() * 20) + 25,
        status: "active",
      }

      setRecords((prev) => [newRecord, ...prev])
      setIsCreateDialogOpen(false)
      setFormData({
        contractor: "",
        workers: "",
        hours: "",
        date: format(new Date(), "yyyy-MM-dd"),
        trade: "",
        location: "",
        comments: "",
      })

      toast({
        title: "Record Created",
        description: "Manpower record has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create manpower record. Please try again.",
        variant: "destructive",
      })
    }
  }

  /**
   * Handle edit existing manpower record
   */
  const handleEdit = (record: ExtendedManpowerRecord) => {
    setEditingRecord(record)
    setFormData({
      contractor: record.contractor,
      workers: record.workers.toString(),
      hours: record.hours.toString(),
      date: record.date,
      trade: record.trade,
      location: record.location || "",
      comments: record.comments || "",
    })
    setIsEditDialogOpen(true)
  }

  /**
   * Handle update existing manpower record
   */
  const handleUpdate = async () => {
    if (!editingRecord) return

    try {
      const updatedRecord: ExtendedManpowerRecord = {
        ...editingRecord,
        contractor: formData.contractor,
        workers: Number.parseInt(formData.workers),
        hours: Number.parseInt(formData.hours),
        date: formData.date,
        trade: formData.trade,
        location: formData.location,
        comments: formData.comments,
        totalManHours: Number.parseInt(formData.workers) * Number.parseInt(formData.hours),
      }

      setRecords((prev) => prev.map((record) => (record.id === editingRecord.id ? updatedRecord : record)))
      setIsEditDialogOpen(false)
      setEditingRecord(null)
      setFormData({
        contractor: "",
        workers: "",
        hours: "",
        date: format(new Date(), "yyyy-MM-dd"),
        trade: "",
        location: "",
        comments: "",
      })

      toast({
        title: "Record Updated",
        description: "Manpower record has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update manpower record. Please try again.",
        variant: "destructive",
      })
    }
  }

  /**
   * Handle delete manpower record
   */
  const handleDelete = async (recordId: string) => {
    try {
      setRecords((prev) => prev.filter((record) => record.id !== recordId))

      toast({
        title: "Record Deleted",
        description: "Manpower record has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete manpower record. Please try again.",
        variant: "destructive",
      })
    }
  }

  /**
   * Handle export data to CSV
   */
  const handleExport = () => {
    const headers = ["Date", "Contractor", "Trade", "Workers", "Hours", "Total Man-Hours", "Location", "Comments"]

    const csvData = filteredRecords.map((record) => [
      record.date,
      record.contractor,
      record.trade,
      record.workers.toString(),
      record.hours.toString(),
      (record.totalManHours || 0).toString(),
      record.location || "",
      record.comments || "",
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `manpower-report-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: "Manpower data has been exported to CSV successfully.",
    })
  }

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedContractor("all")
    setSelectedTrade("all")
    setDateRange({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    })
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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C"]

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">Manpower Tracking</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Track workforce allocation, productivity, and resource utilization across{" "}
              {selectedProject === "all" ? "all projects" : projectContext.name}
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <Button variant="outline" onClick={handleExport} className="gap-2 text-sm">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#FF6B35] hover:bg-[#E55A2B] gap-2 text-sm">
                  <Plus className="h-4 w-4" />
                  Add Record
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Manpower Record</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contractor">Contractor</Label>
                      <Select
                        value={formData.contractor}
                        onValueChange={(value) => handleInputChange("contractor", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select contractor" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueContractors.map((contractor) => (
                            <SelectItem key={contractor} value={contractor}>
                              {contractor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trade">Trade</Label>
                      <Select value={formData.trade} onValueChange={(value) => handleInputChange("trade", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trade" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueTrades.map((trade) => (
                            <SelectItem key={trade} value={trade}>
                              {trade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workers">Workers</Label>
                      <Input
                        id="workers"
                        type="number"
                        min="1"
                        value={formData.workers}
                        onChange={(e) => handleInputChange("workers", e.target.value)}
                        placeholder="Number of workers"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hours">Hours</Label>
                      <Input
                        id="hours"
                        type="number"
                        min="1"
                        max="24"
                        value={formData.hours}
                        onChange={(e) => handleInputChange("hours", e.target.value)}
                        placeholder="Hours worked"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Work location"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      value={formData.comments}
                      onChange={(e) => handleInputChange("comments", e.target.value)}
                      placeholder="Additional notes"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreate}>Create Record</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalWorkers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Avg {summaryStats.averageWorkersPerDay}/day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Man-Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalManHours.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{summaryStats.totalHours.toLocaleString()} total hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contractors</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.activeContractors}</div>
            <p className="text-xs text-muted-foreground">Peak: {summaryStats.peakWorkers} workers/day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.efficiency}%</div>
            <p className="text-xs text-muted-foreground">Top: {summaryStats.topContractor}</p>
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
                  placeholder="Search contractors, trades, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Select value={selectedContractor} onValueChange={setSelectedContractor}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contractors</SelectItem>
                    {uniqueContractors.map((contractor) => (
                      <SelectItem key={contractor} value={contractor}>
                        {contractor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Trades</SelectItem>
                    {uniqueTrades.map((trade) => (
                      <SelectItem key={trade} value={trade}>
                        {trade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleClearFilters} size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Showing {filteredRecords.length} of{" "}
                {
                  records.filter((record) => (selectedProject === "all" ? true : record.projectId === selectedProject))
                    .length
                }{" "}
                records
              </span>
              {(searchTerm || selectedContractor !== "all" || selectedTrade !== "all") && (
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
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Daily Worker Count
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ChartContainer
                        config={{
                          workers: {
                            label: "Workers",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                      >
                        <LineChart data={dailyWorkerData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis fontSize={12} tickLine={false} axisLine={false} />
                          <ChartTooltip
                            content={<ChartTooltipContent />}
                            formatter={(value, name) => [value, "Workers"]}
                            labelFormatter={(label, payload) => {
                              if (payload && payload[0]) {
                                return format(parseISO(payload[0].payload.fullDate), "MMMM dd, yyyy")
                              }
                              return label
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="workers"
                            stroke="var(--color-workers)"
                            strokeWidth={2}
                            dot={{ fill: "var(--color-workers)", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">Contractor Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ChartContainer
                        config={{
                          workers: {
                            label: "Workers",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                      >
                        <RechartsPieChart>
                          <Pie
                            data={contractorDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ contractor, workers, percentage }) =>
                              `${contractor}: ${workers} (${percentage}%)`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="workers"
                          >
                            {contractorDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                  <div className="bg-white p-3 border rounded-lg shadow-lg">
                                    <p className="font-medium">{data.contractor}</p>
                                    <p className="text-sm text-gray-600">
                                      {data.workers} workers ({data.percentage}%)
                                    </p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                        </RechartsPieChart>
                      </ChartContainer>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
            <AiInsightsCard title="HBI Manpower Insights" insights={generateHbiInsights()} />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Productivity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center text-gray-500">
                  Advanced analytics charts would be implemented here
                  <br />
                  (Productivity metrics, efficiency trends, cost analysis)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Workers/Day</span>
                    <span className="font-medium">{summaryStats.averageWorkersPerDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Peak Workers</span>
                    <span className="font-medium">{summaryStats.peakWorkers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Efficiency Rate</span>
                    <span className="font-medium">{summaryStats.efficiency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Man-Hours</span>
                    <span className="font-medium">{summaryStats.totalManHours.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <AiInsightsCard title="HBI Performance Insights" insights={generateHbiInsights()} />
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manpower Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No records found matching your criteria</div>
                ) : (
                  <div className="space-y-2">
                    {filteredRecords.slice(0, 20).map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-4">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 truncate">{record.contractor}</p>
                              <p className="text-sm text-gray-600">
                                {record.trade} • {format(parseISO(record.date), "MMM dd, yyyy")}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {record.workers}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {record.hours}h
                              </div>
                              {record.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {record.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredRecords.length > 20 && (
                      <div className="text-center py-4 text-gray-500">
                        Showing first 20 of {filteredRecords.length} records
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Generate comprehensive manpower reports for project management and analysis.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Download className="h-5 w-5" />
                    <span>Daily Summary Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Download className="h-5 w-5" />
                    <span>Contractor Performance</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Download className="h-5 w-5" />
                    <span>Productivity Analysis</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Download className="h-5 w-5" />
                    <span>Cost Analysis Report</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Manpower Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-contractor">Contractor</Label>
                <Select value={formData.contractor} onValueChange={(value) => handleInputChange("contractor", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contractor" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueContractors.map((contractor) => (
                      <SelectItem key={contractor} value={contractor}>
                        {contractor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-trade">Trade</Label>
                <Select value={formData.trade} onValueChange={(value) => handleInputChange("trade", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTrades.map((trade) => (
                      <SelectItem key={trade} value={trade}>
                        {trade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-workers">Workers</Label>
                <Input
                  id="edit-workers"
                  type="number"
                  min="1"
                  value={formData.workers}
                  onChange={(e) => handleInputChange("workers", e.target.value)}
                  placeholder="Number of workers"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-hours">Hours</Label>
                <Input
                  id="edit-hours"
                  type="number"
                  min="1"
                  max="24"
                  value={formData.hours}
                  onChange={(e) => handleInputChange("hours", e.target.value)}
                  placeholder="Hours worked"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Work location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-comments">Comments</Label>
              <Textarea
                id="edit-comments"
                value={formData.comments}
                onChange={(e) => handleInputChange("comments", e.target.value)}
                placeholder="Additional notes"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update Record</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
