"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { ConstraintWidgets } from "@/components/constraints/ConstraintWidgets"
import { HbiInsightsPanel } from "@/components/constraints/HbiInsightsPanel"
import { GanttChart } from "@/components/constraints/GanttChart"
import { EnhancedConstraintTable } from "@/components/constraints/EnhancedConstraintTable"
import { ConstraintForm } from "@/components/constraints/ConstraintForm"
import { ConstraintExportUtils } from "@/components/constraints/ExportUtils"
import { ExportModal } from "@/components/constraints/ExportModal"
import { 
  Plus, 
  RefreshCw, 
  Download, 
  Clock, 
  CheckCircle, 
  Home, 
  Maximize, 
  Minimize,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  FileText,
  Filter
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import constraintsData from "@/data/mock/logs/constraints.json"
import type { Constraint, ConstraintProject, ConstraintStats, ConstraintFilters } from "@/types/constraint"

export default function ConstraintsLogPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  // State management
  const [projects] = useState<ConstraintProject[]>(constraintsData as ConstraintProject[])
  const [allConstraints, setAllConstraints] = useState<Constraint[]>([])
  const [filteredConstraints, setFilteredConstraints] = useState<Constraint[]>([])
  const [activeTab, setActiveTab] = useState("open")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingConstraint, setEditingConstraint] = useState<Constraint | null>(null)
  const [deleteConstraint, setDeleteConstraint] = useState<Constraint | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Filter state
  const [filters, setFilters] = useState<ConstraintFilters>({
    search: "",
    status: "all",
    category: "all",
    assigned: "all",
    dateRange: { start: null, end: null },
  })

  // Initialize constraints from all projects
  useEffect(() => {
    const constraints = projects.flatMap((project) => project.constraints)
    setAllConstraints(constraints)
  }, [projects])

  // Apply filters and group by category
  useEffect(() => {
    let filtered = allConstraints

    // Filter by tab (open/closed)
    if (activeTab === "open") {
      filtered = filtered.filter((c) => c.completionStatus !== "Closed")
    } else {
      filtered = filtered.filter((c) => c.completionStatus === "Closed")
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.description.toLowerCase().includes(searchLower) ||
          c.category.toLowerCase().includes(searchLower) ||
          c.assigned.toLowerCase().includes(searchLower) ||
          c.reference.toLowerCase().includes(searchLower) ||
          c.no.toLowerCase().includes(searchLower),
      )
    }

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((c) => c.completionStatus === filters.status)
    }

    // Apply category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((c) => c.category === filters.category)
    }

    // Apply assignee filter
    if (filters.assigned !== "all") {
      filtered = filtered.filter((c) => c.assigned === filters.assigned)
    }

    // Apply date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter((c) => {
        if (!c.dateIdentified) return false
        const constraintDate = new Date(c.dateIdentified)

        if (filters.dateRange.start && constraintDate < filters.dateRange.start) return false
        if (filters.dateRange.end && constraintDate > filters.dateRange.end) return false

        return true
      })
    }

    setFilteredConstraints(filtered)
  }, [allConstraints, filters, activeTab])

  // Calculate statistics
  const stats = useMemo((): ConstraintStats => {
    const total = allConstraints.length
    const open = allConstraints.filter((c) => c.completionStatus !== "Closed").length
    const closed = allConstraints.filter((c) => c.completionStatus === "Closed").length
    const overdue = allConstraints.filter((c) => {
      if (c.completionStatus === "Closed") return false
      if (!c.dueDate) return false
      return new Date(c.dueDate) < new Date()
    }).length

    const byCategory = allConstraints.reduce(
      (acc, constraint) => {
        acc[constraint.category] = (acc[constraint.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const byStatus = allConstraints.reduce(
      (acc, constraint) => {
        acc[constraint.completionStatus] = (acc[constraint.completionStatus] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return { total, open, closed, overdue, byCategory, byStatus }
  }, [allConstraints])

  // Get unique values for filters
  const categories = useMemo(() => {
    return [...new Set(allConstraints.map((c) => c.category))].sort()
  }, [allConstraints])

  const assignees = useMemo(() => {
    return [...new Set(allConstraints.map((c) => c.assigned).filter(Boolean))].sort()
  }, [allConstraints])

  // Handle constraint creation
  const handleCreateConstraint = (constraintData: Omit<Constraint, "id" | "no" | "daysElapsed">) => {
    const newConstraint: Constraint = {
      ...constraintData,
      id: Date.now().toString(),
      no: `C-${allConstraints.length + 1}`,
      daysElapsed: constraintData.dateIdentified
        ? Math.floor((new Date().getTime() - new Date(constraintData.dateIdentified).getTime()) / (1000 * 60 * 60 * 24))
        : 0,
    }

    setAllConstraints((prev) => [...prev, newConstraint])
    setIsCreateModalOpen(false)
    toast({
      title: "Success",
      description: "Constraint created successfully",
    })
  }

  // Handle constraint updates
  const handleUpdateConstraint = (constraintData: Omit<Constraint, "id" | "no" | "daysElapsed">) => {
    if (!editingConstraint) return

    setAllConstraints((prev) =>
      prev.map((c) =>
        c.id === editingConstraint.id
          ? {
              ...constraintData,
              id: editingConstraint.id,
              no: editingConstraint.no,
              daysElapsed: constraintData.dateIdentified
                ? Math.floor(
                    (new Date().getTime() - new Date(constraintData.dateIdentified).getTime()) / (1000 * 60 * 60 * 24),
                  )
                : 0,
            }
          : c,
      ),
    )
    setEditingConstraint(null)
    toast({
      title: "Success",
      description: "Constraint updated successfully",
    })
  }

  // Handle constraint deletion
  const handleDeleteConstraint = () => {
    if (deleteConstraint) {
      setAllConstraints((prev) => prev.filter((c) => c.id !== deleteConstraint.id))
      setDeleteConstraint(null)
      toast({
        title: "Success",
        description: "Constraint deleted successfully",
      })
    }
  }

  // Handle bulk actions
  const handleBulkAction = (action: string, constraintIds: string[]) => {
    toast({
      title: "Bulk Action",
      description: `${action} applied to ${constraintIds.length} constraints`,
    })
  }

  const handleExportSubmit = (options: { format: "pdf" | "excel" | "csv"; fileName: string; filePath: string }) => {
    try {
      switch (options.format) {
        case "pdf":
          ConstraintExportUtils.exportToPDF(filteredConstraints, stats, "All Projects", options.fileName)
          break
        case "excel":
          ConstraintExportUtils.exportToExcel(filteredConstraints, stats, "All Projects", options.fileName)
          break
        case "csv":
          ConstraintExportUtils.exportToCSV(filteredConstraints, "All Projects", options.fileName)
          break
      }

      toast({
        title: "Export Started",
        description: `Constraints data exported to ${options.format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      })
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Constraints data has been updated",
      })
    }, 1000)
  }

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isFullScreen])

  // Get role-specific scope
  const getProjectScope = () => {
    if (!user) return { scope: "all", projectCount: 0, description: "All Projects" }
    
    switch (user.role) {
      case "project-manager":
        return { 
          scope: "single", 
          projectCount: 1, 
          description: "Single Project View"
        }
      case "project-executive":
        return { 
          scope: "portfolio", 
          projectCount: 6, 
          description: "Portfolio View (6 Projects)"
        }
      default:
        return { 
          scope: "enterprise", 
          projectCount: 12, 
          description: "Enterprise View (All Projects)"
        }
    }
  }

  const projectScope = getProjectScope()

  const ConstraintsTableCard = () => (
    <Card className={isFullScreen ? "fixed inset-0 z-[130] rounded-none" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Constraints
        </CardTitle>
        <Button variant="outline" size="sm" onClick={toggleFullScreen} className="flex items-center gap-2">
          {isFullScreen ? (
            <>
              <Minimize className="h-4 w-4" />
              Exit Full Screen
            </>
          ) : (
            <>
              <Maximize className="h-4 w-4" />
              Full Screen
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className={isFullScreen ? "h-[calc(100vh-80px)] overflow-y-auto" : ""}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2" data-tour="constraints-log-tabs">
            <TabsTrigger value="open" className="flex items-center gap-2" data-tour="constraints-tab">
              <Clock className="h-4 w-4" />
              Open Constraints ({stats.open})
            </TabsTrigger>
            <TabsTrigger value="closed" className="flex items-center gap-2" data-tour="overview-tab">
              <CheckCircle className="h-4 w-4" />
              Closed Constraints ({stats.closed})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="mt-6">
            <div data-tour="constraints-table">
              <EnhancedConstraintTable
                constraints={filteredConstraints}
                onEdit={setEditingConstraint}
                onDelete={setDeleteConstraint}
                onBulkAction={handleBulkAction}
                showClosed={false}
                groupByCategory={true}
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
                assignees={assignees}
              />
            </div>
          </TabsContent>

          <TabsContent value="closed" className="mt-6">
            <div data-tour="overview-key-metrics">
              <EnhancedConstraintTable
                constraints={filteredConstraints}
                onEdit={setEditingConstraint}
                onDelete={setDeleteConstraint}
                onBulkAction={handleBulkAction}
                showClosed={true}
                groupByCategory={true}
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
                assignees={assignees}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  return (
    <>
      <AppHeader />
      <div className="space-y-6 p-6">
        {!isFullScreen && (
          <>
            {/* Breadcrumb Navigation */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard" className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Constraints Log</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header Section */}
            <div className="flex flex-col gap-4" data-tour="constraints-log-page-header">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Constraints Log</h1>
                  <p className="text-muted-foreground mt-1">Track and manage project constraints and resolutions</p>
                  <div className="flex items-center gap-4 mt-2" data-tour="constraints-log-scope-badges">
                    <Badge variant="outline" className="px-3 py-1">
                      {projectScope.description}
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      {stats.total} Total Constraints
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Constraint
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Constraint</DialogTitle>
                      </DialogHeader>
                      <ConstraintForm
                        onSubmit={handleCreateConstraint}
                        onCancel={() => setIsCreateModalOpen(false)}
                        categories={categories}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Statistics Widgets */}
              <div data-tour="constraints-log-quick-stats">
                <ConstraintWidgets stats={stats} />
              </div>
            </div>

            {/* HBI Insights Panel */}
            <div data-tour="overview-hbi-insights">
              <HbiInsightsPanel constraints={allConstraints} />
            </div>

            {/* Gantt Chart */}
            <div data-tour="gantt-visualization">
              <GanttChart constraints={allConstraints} />
            </div>
          </>
        )}

        {/* Constraints Table with Tabs */}
        <ConstraintsTableCard />

        {/* Edit Modal */}
        {editingConstraint && (
          <Dialog open={!!editingConstraint} onOpenChange={() => setEditingConstraint(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Constraint</DialogTitle>
              </DialogHeader>
              <ConstraintForm
                constraint={editingConstraint}
                onSubmit={handleUpdateConstraint}
                onCancel={() => setEditingConstraint(null)}
                categories={categories}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteConstraint} onOpenChange={() => setDeleteConstraint(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Constraint</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this constraint? This action cannot be undone.
                <br />
                <strong>{deleteConstraint?.description}</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConstraint} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div data-tour="reports-distribution">
          <ExportModal
            open={isExportModalOpen}
            onOpenChange={setIsExportModalOpen}
            onExport={handleExportSubmit}
            defaultFileName="ConstraintsLog"
          />
        </div>
      </div>
    </>
  )
} 