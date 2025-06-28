"use client"

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useAuth } from "@/context/auth-context"
import { useProjectContext } from "@/context/project-context"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  CalendarDays,
  FileText,
  BarChart3,
  Download,
  Plus,
  Filter,
  Settings,
  Maximize,
  Minimize,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Building,
  RefreshCw
} from "lucide-react"

// Import Permit Components
import { PermitAnalytics } from "@/components/permit-log/PermitAnalytics"
import { PermitFilters } from "@/components/permit-log/PermitFilters"
import { PermitForm } from "@/components/permit-log/PermitForm"
import { PermitExportModal } from "@/components/permit-log/PermitExportModal"
import { PermitTable } from "@/components/permit-log/PermitTable"
import { PermitCalendar } from "@/components/permit-log/PermitCalendar"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

import type { Permit, PermitFilters as PermitFiltersType, PermitAnalytics as PermitAnalyticsType } from "@/types/permit-log"

// Import mock data
import permitsData from "@/data/mock/logs/permits.json"

export default function PermitLogPage() {
  const { user } = useAuth()
  const { selectedProject } = useProjectContext()
  const { toast } = useToast()

  // State management
  const [permits, setPermits] = useState<Permit[]>([])
  const [filteredPermits, setFilteredPermits] = useState<Permit[]>([])
  const [filters, setFilters] = useState<PermitFiltersType>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showPermitForm, setShowPermitForm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Reference to the app header for sticky positioning
  const appHeaderRef = useRef<HTMLElement | null>(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  // Load permits data
  useEffect(() => {
    const loadPermits = async () => {
      try {
        setIsLoading(true)
        // Transform the imported data to match our interface
        const transformedPermits: Permit[] = permitsData.map((permit: any) => ({
          ...permit,
          inspections: permit.inspections || [],
          tags: permit.tags || [],
          conditions: permit.conditions || [],
          priority: permit.priority || "medium",
          authorityContact: permit.authorityContact || {},
        }))
        setPermits(transformedPermits)
      } catch (error) {
        console.error("Failed to load permits:", error)
        toast({
          title: "Error",
          description: "Failed to load permit data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPermits()
  }, [toast])

  // Set up header height tracking for sticky positioning
  useEffect(() => {
    const header = document.querySelector("header") || document.querySelector('[data-app-header]')
    if (header) {
      appHeaderRef.current = header as HTMLElement
      setHeaderHeight(header.getBoundingClientRect().height)
    }

    const handleResize = () => {
      if (appHeaderRef.current) {
        setHeaderHeight(appHeaderRef.current.getBoundingClientRect().height)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Role-based access control
  const hasCreateAccess = useMemo(() => {
    if (!user) return false
    return ["admin", "project-manager", "project-executive"].includes(user.role)
  }, [user])

  const hasFullAccess = useMemo(() => {
    if (!user) return false
    return ["admin", "executive"].includes(user.role)
  }, [user])

  const hasExportAccess = useMemo(() => {
    if (!user) return false
    return ["admin", "executive", "project-executive", "project-manager"].includes(user.role)
  }, [user])

  // Filter permits based on user role and permissions
  const accessiblePermits = useMemo(() => {
    if (!user) return []

    let filtered = permits

    // Apply project-based filtering if a specific project is selected
    if (selectedProject) {
      filtered = filtered.filter((permit) => permit.projectId.toString() === selectedProject.id)
    } else if (!hasFullAccess) {
      // Apply role-based filtering when no specific project is selected
      if (user.role === "project-executive") {
        // Show permits from assigned projects (mock data shows various project IDs)
        const assignedProjects = ["2525840", "2525841", "2525842"]
        filtered = filtered.filter((permit) => assignedProjects.includes(permit.projectId.toString()))
      } else if (user.role === "project-manager") {
        // Show permits from active project only
        const activeProject = "2525840"
        filtered = filtered.filter((permit) => permit.projectId.toString() === activeProject)
      }
    }

    return filtered
  }, [permits, user, hasFullAccess, selectedProject])

  // Apply filters and search
  useEffect(() => {
    let filtered = accessiblePermits

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (permit) =>
          permit.number.toLowerCase().includes(searchLower) ||
          permit.type.toLowerCase().includes(searchLower) ||
          permit.authority.toLowerCase().includes(searchLower) ||
          permit.description.toLowerCase().includes(searchLower)
      )
    }

    if (filters.status) {
      filtered = filtered.filter((permit) => permit.status === filters.status)
    }

    if (filters.type) {
      filtered = filtered.filter((permit) => permit.type === filters.type)
    }

    if (filters.authority) {
      filtered = filtered.filter((permit) => permit.authority.toLowerCase().includes(filters.authority!.toLowerCase()))
    }

    if (filters.projectId) {
      filtered = filtered.filter((permit) => permit.projectId.toString() === filters.projectId)
    }

    if (filters.dateRange) {
      filtered = filtered.filter((permit) => {
        const permitDate = new Date(permit.applicationDate)
        const startDate = new Date(filters.dateRange!.start)
        const endDate = new Date(filters.dateRange!.end)
        return permitDate >= startDate && permitDate <= endDate
      })
    }

    if (filters.expiringWithin) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() + filters.expiringWithin)
      filtered = filtered.filter((permit) => {
        const expirationDate = new Date(permit.expirationDate)
        return expirationDate <= cutoffDate && (permit.status === "approved" || permit.status === "renewed")
      })
    }

    setFilteredPermits(filtered)
  }, [accessiblePermits, filters, searchTerm])

  // Calculate summary metrics
  const metrics = useMemo(() => {
    const totalPermits = filteredPermits.length
    const approvedPermits = filteredPermits.filter((p) => p.status === "approved" || p.status === "renewed").length
    const pendingPermits = filteredPermits.filter((p) => p.status === "pending").length
    const expiredPermits = filteredPermits.filter((p) => p.status === "expired").length
    const rejectedPermits = filteredPermits.filter((p) => p.status === "rejected").length

    const totalInspections = filteredPermits.reduce((sum, p) => sum + (p.inspections?.length || 0), 0)
    const passedInspections = filteredPermits.reduce(
      (sum, p) => sum + (p.inspections?.filter((i) => i.result === "passed").length || 0),
      0
    )
    const failedInspections = filteredPermits.reduce(
      (sum, p) => sum + (p.inspections?.filter((i) => i.result === "failed").length || 0),
      0
    )
    const pendingInspections = filteredPermits.reduce(
      (sum, p) => sum + (p.inspections?.filter((i) => i.result === "pending").length || 0),
      0
    )

    const approvalRate = totalPermits > 0 ? (approvedPermits / totalPermits) * 100 : 0
    const inspectionPassRate = totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 0

    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    const expiringPermits = filteredPermits.filter((p) => {
      const expDate = new Date(p.expirationDate)
      return expDate <= thirtyDaysFromNow && expDate > new Date() && (p.status === "approved" || p.status === "renewed")
    }).length

    return {
      totalPermits,
      approvedPermits,
      pendingPermits,
      expiredPermits,
      rejectedPermits,
      totalInspections,
      passedInspections,
      failedInspections,
      pendingInspections,
      approvalRate,
      inspectionPassRate,
      expiringPermits,
    }
  }, [filteredPermits])

  // Generate permit-specific insights
  const generatePermitInsights = useCallback(() => {
    const insights = []

    if (metrics.expiringPermits > 0) {
      insights.push({
        id: "permit-expiring",
        type: "alert" as const,
        severity: "high" as const,
        title: "Permits Expiring Soon",
        text: `${metrics.expiringPermits} permits will expire within 30 days, requiring immediate renewal action.`,
        action: "Schedule renewal meetings with permit authorities and prepare required documentation.",
        confidence: 95,
        relatedMetrics: ["Permit Renewals", "Authority Relations", "Compliance Timeline"],
      })
    }

    if (metrics.approvalRate < 85 && metrics.totalPermits > 0) {
      insights.push({
        id: "approval-rate-risk",
        type: "risk" as const,
        severity: "medium" as const,
        title: "Below Average Approval Rate",
        text: `Current approval rate of ${Math.round(metrics.approvalRate)}% is below industry standard of 85%.`,
        action: "Review application processes and strengthen relationships with permit authorities.",
        confidence: 88,
        relatedMetrics: ["Application Quality", "Authority Relations", "Process Efficiency"],
      })
    }

    if (metrics.inspectionPassRate < 90 && metrics.totalInspections > 0) {
      insights.push({
        id: "inspection-improvement",
        type: "opportunity" as const,
        severity: "medium" as const,
        title: "Inspection Pass Rate Optimization",
        text: `${Math.round(metrics.inspectionPassRate)}% pass rate indicates potential for quality improvements.`,
        action: "Implement pre-inspection checklists and enhanced quality control measures.",
        confidence: 82,
        relatedMetrics: ["Quality Control", "Inspection Results", "Compliance Score"],
      })
    }

    if (metrics.pendingPermits > 3) {
      insights.push({
        id: "permit-backlog",
        type: "performance" as const,
        severity: "medium" as const,
        title: "Permit Processing Backlog",
        text: `${metrics.pendingPermits} permits are currently pending approval, indicating potential delays.`,
        action: "Prioritize follow-up communications and consider expedited processing options.",
        confidence: 90,
        relatedMetrics: ["Processing Time", "Authority Response", "Project Timeline"],
      })
    }

    if (metrics.totalPermits > 5) {
      const avgCost = filteredPermits.reduce((sum, p) => sum + (p.cost || 0), 0) / filteredPermits.length
      if (avgCost > 5000) {
        insights.push({
          id: "cost-optimization",
          type: "opportunity" as const,
          severity: "low" as const,
          title: "Permit Cost Optimization",
          text: `Average permit cost of $${Math.round(avgCost).toLocaleString()} suggests potential for bulk processing savings.`,
          action: "Explore bulk permit applications and negotiate volume discounts with authorities.",
          confidence: 75,
          relatedMetrics: ["Permit Costs", "Budget Management", "Process Efficiency"],
        })
      }
    }

    return insights
  }, [metrics, filteredPermits])

  // Event handlers
  const handleCreatePermit = useCallback(() => {
    if (!hasCreateAccess) return
    setSelectedPermit(null)
    setShowPermitForm(true)
  }, [hasCreateAccess])

  const handleEditPermit = useCallback((permit: Permit) => {
    setSelectedPermit(permit)
    setShowPermitForm(true)
  }, [])

  const handleViewPermit = useCallback((permit: Permit) => {
    setSelectedPermit(permit)
    // For now, just log - could open a view-only modal in the future
    console.log("View permit:", permit)
  }, [])

  const handleExportPermit = useCallback((permit: Permit) => {
    console.log("Export permit:", permit)
    toast({
      title: "Export Started",
      description: `Exporting permit ${permit.number}`,
    })
  }, [toast])

  const handleSavePermit = useCallback(
    (permitData: Partial<Permit>) => {
      if (selectedPermit) {
        // Update existing permit
        setPermits((prev) =>
          prev.map((p) =>
            p.id === selectedPermit.id 
              ? { ...p, ...permitData, updatedAt: new Date().toISOString() } 
              : p
          )
        )
        toast({
          title: "Success",
          description: "Permit updated successfully",
        })
      } else {
        // Create new permit
        const newPermit: Permit = {
          id: `perm-${Date.now()}`,
          projectId: selectedProject?.id || "2525840",
          createdBy: user?.id || "current-user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          inspections: [],
          tags: [],
          conditions: [],
          ...permitData,
        } as Permit
        setPermits((prev) => [...prev, newPermit])
        toast({
          title: "Success",
          description: "Permit created successfully",
        })
      }
      setShowPermitForm(false)
    },
    [selectedPermit, user, selectedProject, toast]
  )

  const handleClearFilters = useCallback(() => {
    setFilters({})
    setSearchTerm("")
  }, [])

  const getActiveFilterCount = useCallback(() => {
    let count = 0
    if (filters.status) count++
    if (filters.type) count++
    if (filters.authority) count++
    if (filters.projectId) count++
    if (filters.dateRange) count++
    if (filters.expiringWithin) count++
    if (searchTerm) count++
    return count
  }, [filters, searchTerm])

  const handleRefresh = useCallback(() => {
    setIsLoading(true)
    // Simulate refresh delay
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Success",
        description: "Permit data refreshed",
      })
    }, 1000)
  }, [toast])

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 p-4 border-b">
            <Button onClick={() => setIsFullScreen(false)}>
              <Minimize className="h-4 w-4 mr-2" />
              Exit Full Screen
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            {/* Full screen content would go here */}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      {/* Page Title Container - Sticky */}
      <div
        className="sticky z-40 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border-b border-blue-200 dark:border-slate-700 shadow-sm"
        style={{ top: `${headerHeight}px` }}
        data-tour="permit-log-page-header"
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#003087] dark:text-blue-400 mb-2">
                Permit Log & Tracking
              </h1>
              <p className="text-lg text-blue-700 dark:text-blue-300">
                Comprehensive permit management and inspection tracking system
              </p>
            </div>
                        <div className="flex items-center space-x-3" data-tour="permit-log-scope-badges">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white dark:border-blue-400 dark:text-blue-400"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white dark:border-blue-400 dark:text-blue-400"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>

              {hasExportAccess && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportModal(true)}
                  className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white dark:border-blue-400 dark:text-blue-400"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}

              <Sheet open={showSettings} onOpenChange={setShowSettings}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white dark:border-blue-400 dark:text-blue-400"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Permit Log Settings</SheetTitle>
                    <SheetDescription>Configure your permit tracking preferences</SheetDescription>
                  </SheetHeader>
                  <div className="py-6">
                    <p className="text-sm text-muted-foreground">Settings panel content would go here...</p>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white dark:border-blue-400 dark:text-blue-400"
              >
                <Maximize className="h-4 w-4 mr-2" />
                Full Screen
              </Button>

              {hasCreateAccess && (
                <Button 
                  size="sm" 
                  onClick={handleCreatePermit} 
                  className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Permit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page Content Container */}
      <div className="h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          {isLoading ? (
            // Loading skeletons
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Skeleton className="h-32 w-full" />
                        <div className="grid grid-cols-4 gap-4">
                          <Skeleton className="h-16" />
                          <Skeleton className="h-16" />
                          <Skeleton className="h-16" />
                          <Skeleton className="h-16" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-tour="permit-log-quick-stats">
                <div className="lg:col-span-2">
                  <PermitAnalytics permits={filteredPermits} />
                </div>
                <div data-tour="overview-hbi-insights">
                  <EnhancedHBIInsights config={generatePermitInsights()} cardId="permit-insights" />
                </div>
              </div>

              {/* Filters Section */}
              {showFilters && (
                <Card data-tour="permits-filters">
                  <CardContent className="p-6">
                    <PermitFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClose={() => setShowFilters(false)}
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Active Filters Display */}
              {getActiveFilterCount() > 0 && (
                <div className="bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-600 rounded-lg px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-[#003087] dark:text-blue-400">Active Filters:</span>
                      <div className="flex flex-wrap gap-2">
                        {searchTerm && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Search: {searchTerm}
                          </Badge>
                        )}
                        {filters.status && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Status: {filters.status}
                          </Badge>
                        )}
                        {filters.type && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Type: {filters.type}
                          </Badge>
                        )}
                        {filters.authority && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Authority: {filters.authority}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-[#003087] hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-slate-700"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              )}

              {/* Tabs Container */}
              <Card>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b">
                    <TabsList className="grid w-full grid-cols-6 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700" data-tour="permit-log-tabs">
                      <TabsTrigger
                        value="overview"
                        className="data-[state=active]:bg-[#003087] data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
                        data-tour="overview-tab"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="permits"
                        className="data-[state=active]:bg-[#003087] data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
                        data-tour="permits-tab"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Permits ({metrics.totalPermits})
                      </TabsTrigger>
                      <TabsTrigger
                        value="inspections"
                        className="data-[state=active]:bg-[#003087] data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
                        data-tour="inspections-tab"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Inspections ({metrics.totalInspections})
                      </TabsTrigger>
                      <TabsTrigger
                        value="calendar"
                        className="data-[state=active]:bg-[#003087] data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
                        data-tour="calendar-tab"
                      >
                        <CalendarDays className="h-4 w-4 mr-2" />
                        Calendar
                      </TabsTrigger>
                      <TabsTrigger
                        value="analytics"
                        className="data-[state=active]:bg-[#003087] data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
                        data-tour="analytics-tab"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </TabsTrigger>
                      <TabsTrigger
                        value="reports"
                        className="data-[state=active]:bg-[#003087] data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
                        data-tour="reports-tab"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Reports
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-0">
                    <div className="p-6 space-y-6">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-tour="overview-key-metrics">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Approval Rate</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-[#003087] dark:text-blue-400">
                              {Math.round(metrics.approvalRate)}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {metrics.approvedPermits} of {metrics.totalPermits} permits
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Inspection Pass Rate</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                              {Math.round(metrics.inspectionPassRate)}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {metrics.passedInspections} of {metrics.totalInspections} inspections
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Actions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                              {metrics.pendingPermits + metrics.pendingInspections}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {metrics.pendingPermits} permits, {metrics.pendingInspections} inspections
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Soon</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{metrics.expiringPermits}</div>
                            <p className="text-xs text-muted-foreground mt-1">Within 30 days</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Permit Table */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-[#003087] dark:text-blue-400">Recent Permit Activity</CardTitle>
                          <CardDescription>Latest updates and changes</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <PermitTable
                            permits={filteredPermits.slice(0, 10)}
                            onEdit={handleEditPermit}
                            onView={handleViewPermit}
                            onExport={handleExportPermit}
                            userRole={user?.role}
                            compact={true}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Permits Tab */}
                  <TabsContent value="permits" className="mt-0">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">Permit Management</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                              View and manage all construction permits and their details
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            {hasCreateAccess && (
                              <Button
                                size="sm"
                                onClick={handleCreatePermit}
                                className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                New Permit
                              </Button>
                            )}
                            {hasExportAccess && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowExportModal(true)}
                                className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white dark:border-blue-400 dark:text-blue-400"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Export All
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div data-tour="permits-table">
                        <PermitTable
                          permits={filteredPermits}
                          onEdit={handleEditPermit}
                          onView={handleViewPermit}
                          onExport={handleExportPermit}
                          userRole={user?.role}
                        />
                      </div>
                    </CardContent>
                  </TabsContent>

                  {/* Inspections Tab */}
                  <TabsContent value="inspections" className="mt-0">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">Inspection Management</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                              Track inspection schedules, results, and compliance scores
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            {hasExportAccess && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowExportModal(true)}
                                className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white dark:border-blue-400 dark:text-blue-400"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Export Inspections
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div data-tour="inspections-scheduling">
                        <PermitTable
                          permits={filteredPermits}
                          onEdit={handleEditPermit}
                          onView={handleViewPermit}
                          onExport={handleExportPermit}
                          userRole={user?.role}
                          showInspections={true}
                        />
                      </div>
                    </CardContent>
                  </TabsContent>

                  {/* Calendar Tab */}
                  <TabsContent value="calendar" className="mt-0">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">Permit & Inspection Calendar</h2>
                        <p className="text-sm text-muted-foreground mt-1">Visual timeline of permits and inspections</p>
                      </div>
                      <div data-tour="calendar-events">
                        <PermitCalendar
                          permits={filteredPermits}
                          onEditPermit={handleEditPermit}
                          onViewPermit={handleViewPermit}
                          onCreatePermit={handleCreatePermit}
                          userRole={user?.role}
                        />
                      </div>
                    </CardContent>
                  </TabsContent>

                  {/* Analytics Tab */}
                  <TabsContent value="analytics" className="mt-0">
                    <CardContent className="p-6">
                      <div data-tour="analytics-charts">
                        <PermitAnalytics permits={filteredPermits} detailed={true} />
                      </div>
                    </CardContent>
                  </TabsContent>

                  {/* Reports Tab */}
                  <TabsContent value="reports" className="mt-0">
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">Export Reports</h2>
                        <p className="text-sm text-muted-foreground mt-1">Generate comprehensive permit and inspection reports</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-tour="reports-templates">
                        <Button
                          variant="outline"
                          className="h-24 flex flex-col items-center justify-center space-y-2"
                          onClick={() => setShowExportModal(true)}
                        >
                          <FileText className="h-8 w-8 text-[#003087] dark:text-blue-400" />
                          <span>Permit Summary</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-24 flex flex-col items-center justify-center space-y-2"
                          onClick={() => setShowExportModal(true)}
                        >
                          <BarChart3 className="h-8 w-8 text-[#003087] dark:text-blue-400" />
                          <span>Analytics Report</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-24 flex flex-col items-center justify-center space-y-2"
                          onClick={() => setShowExportModal(true)}
                        >
                          <CalendarDays className="h-8 w-8 text-[#003087] dark:text-blue-400" />
                          <span>Inspection Log</span>
                        </Button>
                      </div>
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showExportModal && hasExportAccess && (
        <PermitExportModal permits={filteredPermits} onClose={() => setShowExportModal(false)} />
      )}

      {showPermitForm && hasCreateAccess && (
        <PermitForm 
          permit={selectedPermit} 
          open={showPermitForm}
          onSave={handleSavePermit} 
          onClose={() => setShowPermitForm(false)}
          userRole={user?.role}
        />
      )}
    </div>
  )
} 