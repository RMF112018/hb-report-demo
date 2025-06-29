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
import { ResponsibilityMatrixIntegration } from "@/components/staffing/ResponsibilityMatrixIntegration"
import { 
  Plus, 
  RefreshCw, 
  Download, 
  Users, 
  CheckCircle, 
  Home, 
  Maximize, 
  Minimize,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  FileText,
  Filter,
  Target,
  Clock,
  Settings,
  Award
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import responsibilityRawData from "@/data/mock/responsibility.json"
import type { ResponsibilityTask, ResponsibilityRole, ResponsibilityMetrics } from "@/types/responsibility"

export default function ResponsibilityMatrixPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  // State management
  const [activeTab, setActiveTab] = useState("team")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<ResponsibilityTask | null>(null)
  const [deleteTask, setDeleteTask] = useState<ResponsibilityTask | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Role colors matching the component
  const roleColors: { [key: string]: string } = {
    PX: "#1890ff",
    PM1: "#52c41a", 
    PM2: "#13c2c2",
    PM3: "#722ed1",
    PA: "#fa8c16",
    QAQC: "#f5222d",
    SPM: "#eb2f96",
    "Proj Acct": "#fadb14",
    O: "#a0d911",
    A: "#f57734",
    C: "#fa541c", 
    S: "#722ed1",
  }

  // Transform raw data into ResponsibilityTask format
  const transformedTasks: ResponsibilityTask[] = useMemo(() => {
    return responsibilityRawData
      .filter(item => item["Task Category"] && item["Tasks/Role"])
      .map((item, index) => {
        const randomAssignments: { [key: string]: "Approve" | "Primary" | "Support" | "None" } = {}
        
        const category = item["Task Category"] || "General"
        Object.keys(roleColors).forEach(role => {
          if (role === category) {
            randomAssignments[role] = Math.random() > 0.3 ? "Primary" : "Support"
          } else if (["PX", "SPM"].includes(role)) {
            randomAssignments[role] = Math.random() > 0.7 ? "Approve" : "None"
          } else {
            randomAssignments[role] = Math.random() > 0.8 ? "Support" : "None"
          }
        })

        return {
          id: `task-${index}`,
          projectId: "palm-beach-luxury",
          type: activeTab as "team" | "prime-contract" | "subcontract",
          category: category,
          task: item["Tasks/Role"] || "",
          page: Math.random() > 0.5 ? `${Math.floor(Math.random() * 50) + 1}` : "",
          article: Math.random() > 0.5 ? `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 20) + 1}` : "",
          responsible: category === "PX" ? "PX" : category === "SPM" ? "SPM" : Object.keys(randomAssignments).find(role => randomAssignments[role] === "Primary") || "",
          assignments: randomAssignments,
          status: ["active", "pending", "completed"][Math.floor(Math.random() * 3)] as "active" | "pending" | "completed",
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          annotations: []
        }
      })
  }, [activeTab])

  // Define roles
  const roles: ResponsibilityRole[] = useMemo(() => {
    return Object.entries(roleColors).map(([key, color]) => ({
      key,
      name: key === "Proj Acct" ? "Project Accountant" : 
            key === "QAQC" ? "Quality Control" :
            key === "SPM" ? "Senior Project Manager" :
            key,
      color,
      enabled: true,
      description: `${key} role responsibilities`
    }))
  }, [])

  // Calculate metrics
  const metrics = useMemo((): ResponsibilityMetrics => {
    const total = transformedTasks.length
    const completed = transformedTasks.filter(t => t.status === "completed").length
    const pending = transformedTasks.filter(t => t.status === "pending").length
    const unassigned = transformedTasks.filter(t => !t.responsible || t.responsible === "").length

    const roleWorkload = transformedTasks.reduce((acc, task) => {
      Object.entries(task.assignments).forEach(([role, assignment]) => {
        if (assignment !== "None") {
          acc[role] = (acc[role] || 0) + 1
        }
      })
      return acc
    }, {} as { [roleKey: string]: number })

    const categoryDistribution = transformedTasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    }, {} as { [category: string]: number })

    return {
      totalTasks: total,
      unassignedTasks: unassigned,
      completedTasks: completed,
      pendingTasks: pending,
      roleWorkload,
      categoryDistribution,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      averageTasksPerRole: Object.keys(roleColors).length > 0 ? 
        Object.values(roleWorkload).reduce((sum, count) => sum + count, 0) / Object.keys(roleColors).length : 0
    }
  }, [transformedTasks])

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

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Responsibility matrix data has been updated",
      })
    }, 1000)
  }

  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Responsibility matrix exported successfully",
    })
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

  const ResponsibilityMatrixCard = () => (
    <Card className={isFullScreen ? "fixed inset-0 z-[130] rounded-none" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Responsibility Matrix
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
          <TabsList className="grid w-full grid-cols-3" data-tour="responsibility-matrix-tabs">
            <TabsTrigger value="team" className="flex items-center gap-2" data-tour="team-matrix-tab">
              <Users className="h-4 w-4" />
              Team Matrix
            </TabsTrigger>
            <TabsTrigger value="prime-contract" className="flex items-center gap-2" data-tour="prime-contract-tab">
              <FileText className="h-4 w-4" />
              Prime Contract
            </TabsTrigger>
            <TabsTrigger value="subcontract" className="flex items-center gap-2" data-tour="subcontract-tab">
              <Award className="h-4 w-4" />
              Subcontract
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="mt-6">
            <div data-tour="team-responsibility-matrix">
              <ResponsibilityMatrixIntegration 
                userRole={user?.role as any}
                className="border-0 shadow-none p-0"
              />
            </div>
          </TabsContent>

          <TabsContent value="prime-contract" className="mt-6">
            <div data-tour="prime-contract-matrix">
              <ResponsibilityMatrixIntegration 
                userRole={user?.role as any}
                className="border-0 shadow-none p-0"
              />
            </div>
          </TabsContent>

          <TabsContent value="subcontract" className="mt-6">
            <div data-tour="subcontract-matrix">
              <ResponsibilityMatrixIntegration 
                userRole={user?.role as any}
                className="border-0 shadow-none p-0"
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
                  <BreadcrumbPage>Responsibility Matrix</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header Section */}
            <div className="flex flex-col gap-4" data-tour="responsibility-matrix-page-header">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Responsibility Matrix</h1>
                  <p className="text-muted-foreground mt-1">Manage task assignments and accountability across project teams</p>
                  <div className="flex items-center gap-4 mt-2" data-tour="responsibility-matrix-scope-badges">
                    <Badge variant="outline" className="px-3 py-1">
                      {projectScope.description}
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      {metrics.totalTasks} Total Tasks
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                      </DialogHeader>
                      <div className="p-4">
                        <p className="text-muted-foreground">Task creation form would go here.</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Statistics Widgets */}
              <div data-tour="responsibility-matrix-quick-stats">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-200/60 dark:border-blue-800/60">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Tasks</CardTitle>
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{metrics.totalTasks}</div>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Across all categories
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/40 dark:to-emerald-950/40 border-green-200/60 dark:border-green-800/60">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Completed</CardTitle>
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-900 dark:text-green-100">{metrics.completedTasks}</div>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {metrics.completionRate.toFixed(1)}% completion rate
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-950/40 dark:to-amber-950/40 border-orange-200/60 dark:border-orange-800/60">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Pending</CardTitle>
                      <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{metrics.pendingTasks}</div>
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        Awaiting assignment
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50/80 to-violet-50/80 dark:from-purple-950/40 dark:to-violet-950/40 border-purple-200/60 dark:border-purple-800/60">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg. Load</CardTitle>
                      <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {metrics.averageTasksPerRole.toFixed(1)}
                      </div>
                      <p className="text-xs text-purple-600 dark:text-purple-400">
                        Tasks per role
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Role Analytics */}
            <div data-tour="role-analytics">
              <Card className="bg-gradient-to-br from-gray-50/80 to-slate-50/80 dark:from-gray-950/40 dark:to-slate-950/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    Role Workload Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(metrics.roleWorkload)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 6)
                      .map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between p-3 bg-white/60 dark:bg-black/60 rounded-lg border border-gray-200/60 dark:border-gray-800/60">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: roleColors[role] || "#6B7280" }}
                          />
                          <span className="text-sm font-medium">{role}</span>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Responsibility Matrix with Tabs */}
        <ResponsibilityMatrixCard />
      </div>
    </>
  )
} 