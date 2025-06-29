"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PermitMetrics } from "@/components/permits/permit-metrics"
import { PermitTable } from "@/components/permits/permit-table"
import { PermitForm } from "@/components/permits/permit-form"
import { PermitFilters } from "@/components/permits/permit-filters"
import { PermitCalendar } from "@/components/permits/permit-calendar"
import { PermitAnalytics } from "@/components/permits/permit-analytics"
import { mockPermits } from "@/data/mock-permits"
import { mockProjects } from "@/data/mock-projects"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { Permit } from "@/types"
import {
  Plus,
  Download,
  Upload,
  Filter,
  Calendar,
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

/**
 * Enhanced Permit Log Page
 *
 * Comprehensive permit management system for construction projects featuring:
 * - Real-time permit tracking and status monitoring
 * - Advanced analytics and performance metrics
 * - Interactive calendar view for scheduling
 * - Document management and compliance tracking
 * - Mobile-responsive design with touch optimization
 *
 * @returns {JSX.Element} Enhanced permit log interface
 */
export default function PermitLogPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  // State management
  const [permits, setPermits] = useState<Permit[]>(mockPermits)
  const [filteredPermits, setFilteredPermits] = useState<Permit[]>(mockPermits)
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null)
  const [showPermitForm, setShowPermitForm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showFilters, setShowFilters] = useState(false)

  // Filter state
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    project: "all",
    authority: "all",
    dateRange: "all",
    search: "",
  })

  // Apply filters to permits
  useEffect(() => {
    let filtered = permits

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((permit) => permit.status === filters.status)
    }

    // Type filter
    if (filters.type !== "all") {
      filtered = filtered.filter((permit) => permit.type === filters.type)
    }

    // Project filter
    if (filters.project !== "all") {
      filtered = filtered.filter((permit) => permit.projectId.toString() === filters.project)
    }

    // Authority filter
    if (filters.authority !== "all") {
      filtered = filtered.filter((permit) => permit.authority === filters.authority)
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (permit) =>
          permit.number.toLowerCase().includes(searchLower) ||
          permit.type.toLowerCase().includes(searchLower) ||
          permit.authority.toLowerCase().includes(searchLower) ||
          permit.comments?.toLowerCase().includes(searchLower),
      )
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (filters.dateRange) {
        case "30days":
          filterDate.setDate(now.getDate() - 30)
          break
        case "90days":
          filterDate.setDate(now.getDate() - 90)
          break
        case "6months":
          filterDate.setMonth(now.getMonth() - 6)
          break
        case "1year":
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }

      if (filters.dateRange !== "all") {
        filtered = filtered.filter((permit) => new Date(permit.applicationDate) >= filterDate)
      }
    }

    setFilteredPermits(filtered)
  }, [permits, filters])

  // Quick stats for header
  const quickStats = useMemo(() => {
    const total = filteredPermits.length
    const pending = filteredPermits.filter((p) => p.status === "pending").length
    const approved = filteredPermits.filter((p) => p.status === "approved").length
    const expiringSoon = filteredPermits.filter((p) => {
      if (!p.expirationDate) return false
      const expirationDate = new Date(p.expirationDate)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      return expirationDate <= thirtyDaysFromNow && p.status === "approved"
    }).length

    return { total, pending, approved, expiringSoon }
  }, [filteredPermits])

  // Event handlers
  const handleCreatePermit = () => {
    console.log("Creating new permit")
    setSelectedPermit(null)
    setShowPermitForm(true)
  }

  const handleEditPermit = (permit: Permit) => {
    console.log("Editing permit:", permit.number)
    setSelectedPermit(permit)
    setShowPermitForm(true)
  }

  const handleDeletePermit = (permitId: string) => {
    console.log("Deleting permit:", permitId)
    setPermits((prev) => prev.filter((p) => p.id !== permitId))
    toast({
      title: "Permit Deleted",
      description: "The permit has been successfully removed.",
    })
  }

  const handleSavePermit = (permitData: Partial<Permit>) => {
    console.log("Saving permit:", permitData)

    if (selectedPermit) {
      // Update existing permit
      setPermits((prev) => prev.map((p) => (p.id === selectedPermit.id ? { ...p, ...permitData } : p)))
      toast({
        title: "Permit Updated",
        description: `Permit ${permitData.number} has been updated successfully.`,
      })
    } else {
      // Create new permit
      const newPermit: Permit = {
        id: `permit-${Date.now()}`,
        ...permitData,
        applicationDate: permitData.applicationDate || new Date().toISOString(),
        status: permitData.status || "pending",
      } as Permit

      setPermits((prev) => [newPermit, ...prev])
      toast({
        title: "Permit Created",
        description: `Permit ${permitData.number} has been created successfully.`,
      })
    }

    setShowPermitForm(false)
    setSelectedPermit(null)
  }

  const handleExport = () => {
    console.log("Exporting permits data")
    // Create CSV data
    const csvData = filteredPermits.map((permit) => ({
      "Permit Number": permit.number,
      Type: permit.type,
      Status: permit.status,
      Project: mockProjects.find((p) => p.id === permit.projectId)?.name || `Project ${permit.projectId}`,
      Authority: permit.authority,
      "Application Date": permit.applicationDate,
      "Approval Date": permit.approvalDate || "",
      "Expiration Date": permit.expirationDate || "",
      Comments: permit.comments || "",
    }))

    // Convert to CSV string
    const headers = Object.keys(csvData[0] || {})
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => headers.map((header) => `"${row[header as keyof typeof row]}"`).join(",")),
    ].join("\n")

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `permits-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: `Exported ${filteredPermits.length} permits to CSV file.`,
    })
  }

  const handleImport = () => {
    console.log("Importing permits data")
    toast({
      title: "Import Feature",
      description: "Import functionality will be available in the next update.",
    })
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Permit Log</h1>
          <p className="text-gray-600 mt-1">Manage construction permits and track compliance across all projects</p>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">{quickStats.total} Total</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg">
            <Clock className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">{quickStats.pending} Pending</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">{quickStats.approved} Approved</span>
          </div>
          {quickStats.expiringSoon > 0 && (
            <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">{quickStats.expiringSoon} Expiring</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleCreatePermit} className="bg-[#FF6B35] hover:bg-[#E55A2B]">
            <Plus className="h-4 w-4 mr-2" />
            New Permit
          </Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {Object.values(filters).some((f) => f !== "all" && f !== "") && (
              <Badge variant="secondary" className="ml-2">
                Active
              </Badge>
            )}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <PermitFilters filters={filters} onFiltersChange={setFilters} permits={permits} projects={mockProjects} />
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Table</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PermitMetrics permits={filteredPermits} />
          <PermitTable
            permits={filteredPermits.slice(0, 10)}
            projects={mockProjects}
            onEdit={handleEditPermit}
            onDelete={handleDeletePermit}
            userRole={user?.role}
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <PermitCalendar
            permits={filteredPermits}
            projects={mockProjects}
            onEditPermit={handleEditPermit}
            onCreatePermit={handleCreatePermit}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PermitAnalytics permits={filteredPermits} projects={mockProjects} />
        </TabsContent>

        <TabsContent value="table" className="space-y-6">
          <PermitTable
            permits={filteredPermits}
            projects={mockProjects}
            onEdit={handleEditPermit}
            onDelete={handleDeletePermit}
            userRole={user?.role}
          />
        </TabsContent>
      </Tabs>

      {/* Permit Form Dialog */}
      {showPermitForm && (
        <PermitForm
          permit={selectedPermit}
          projects={mockProjects}
          onSave={handleSavePermit}
          onCancel={() => {
            setShowPermitForm(false)
            setSelectedPermit(null)
          }}
        />
      )}
    </div>
  )
}
