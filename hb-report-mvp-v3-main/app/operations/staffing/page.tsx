"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Users, Building2, TrendingUp, CheckCircle, Clock, FileText, Settings } from "lucide-react"

// Import role-specific components
import { CSuiteStaffingInterface } from "@/components/operations/staffing/c-suite-interface"
import { ProjectExecutiveInterface } from "@/components/operations/staffing/project-executive-interface"
import { ProjectManagerInterface } from "@/components/operations/staffing/project-manager-interface"
import { OperationsStaffInterface } from "@/components/operations/staffing/operations-staff-interface"
import { AdminInterface } from "@/components/operations/staffing/admin-interface"

// Import data and types
import staffingData from "@/data/staffingTestData.json"

interface StaffingSummary {
  totalEmployees: number
  activeProjects: number
  pendingSPCRs: number
  approvedSPCRs: number
  rejectedSPCRs: number
  utilizationRate: number
  forecastAccuracy: number
}

/**
 * Operations Staffing Main Page
 *
 * Role-based staffing management system with:
 * - C-Suite: Company-wide employee allocation and forecasting
 * - Project Executive: SPCR review and approval workflow
 * - Project Manager: Staffing planning and SPCR creation
 * - Operations Staff: Read-only staffing data access
 * - Admin: System configuration and user management
 */
export default function OperationsStaffingPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<StaffingSummary | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Load staffing summary data
  useEffect(() => {
    const loadSummaryData = async () => {
      setIsLoading(true)

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Calculate summary statistics from mock data
        const totalEmployees = staffingData.employees.filter((emp) => emp.isActive).length
        const activeProjects = staffingData.projects.filter((proj) => proj.status === "active").length
        const pendingSPCRs = staffingData.spcrs.filter((spcr) => spcr.status === "pending").length
        const approvedSPCRs = staffingData.spcrs.filter((spcr) => spcr.status === "approved").length
        const rejectedSPCRs = staffingData.spcrs.filter((spcr) => spcr.status === "rejected").length

        // Calculate utilization rate (employees assigned / total employees)
        const assignedEmployees = staffingData.employees.filter((emp) => emp.currentProjectId).length
        const utilizationRate = (assignedEmployees / totalEmployees) * 100

        // Mock forecast accuracy
        const forecastAccuracy = 87.5

        setSummary({
          totalEmployees,
          activeProjects,
          pendingSPCRs,
          approvedSPCRs,
          rejectedSPCRs,
          utilizationRate,
          forecastAccuracy,
        })

        toast({
          title: "Data Loaded",
          description: `Loaded staffing data for ${activeProjects} active projects and ${totalEmployees} employees.`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load staffing data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSummaryData()
  }, [])

  // Determine default tab based on user role
  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case "c-suite":
          setActiveTab("c-suite")
          break
        case "project-executive":
          setActiveTab("executive")
          break
        case "project-manager":
          setActiveTab("manager")
          break
        case "admin":
          setActiveTab("admin")
          break
        default:
          setActiveTab("operations")
      }
    }
  }, [user?.role])

  // Check user permissions
  const canAccessCSuite = user?.role === "c-suite"
  const canAccessExecutive = user?.role === "project-executive" || user?.role === "c-suite"
  const canAccessManager = ["project-manager", "project-executive", "c-suite"].includes(user?.role || "")
  const canAccessAdmin = user?.role === "admin" || user?.role === "c-suite"

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mt-2" />
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

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-16 z-30 bg-white border-b shadow-sm -mx-3 md:-mx-6 px-3 md:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">Operations Staffing</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Manage staffing allocations, approvals, and forecasting across active projects
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {user?.role?.replace("-", " ").toUpperCase()}
              </Badge>
              <Badge variant="outline">{summary?.activeProjects} Active Projects</Badge>
              <Badge variant="outline">{summary?.totalEmployees} Employees</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            {canAccessAdmin && (
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">{summary.utilizationRate.toFixed(1)}% utilization rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.activeProjects}</div>
              <p className="text-xs text-muted-foreground">Across multiple locations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending SPCRs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.pendingSPCRs}</div>
              <p className="text-xs text-muted-foreground">
                {summary.approvedSPCRs} approved, {summary.rejectedSPCRs} rejected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.forecastAccuracy}%</div>
              <p className="text-xs text-muted-foreground">AI-powered predictions</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Role-Based Interface Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          {canAccessCSuite && (
            <TabsTrigger value="c-suite" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">C-Suite</span>
            </TabsTrigger>
          )}
          {canAccessExecutive && (
            <TabsTrigger value="executive" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Executive</span>
            </TabsTrigger>
          )}
          {canAccessManager && (
            <TabsTrigger value="manager" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Manager</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="operations" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Operations</span>
          </TabsTrigger>
          {canAccessAdmin && (
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* C-Suite Interface */}
        {canAccessCSuite && (
          <TabsContent value="c-suite" className="space-y-4">
            <CSuiteStaffingInterface />
          </TabsContent>
        )}

        {/* Project Executive Interface */}
        {canAccessExecutive && (
          <TabsContent value="executive" className="space-y-4">
            <ProjectExecutiveInterface />
          </TabsContent>
        )}

        {/* Project Manager Interface */}
        {canAccessManager && (
          <TabsContent value="manager" className="space-y-4">
            <ProjectManagerInterface />
          </TabsContent>
        )}

        {/* Operations Staff Interface */}
        <TabsContent value="operations" className="space-y-4">
          <OperationsStaffInterface />
        </TabsContent>

        {/* Admin Interface */}
        {canAccessAdmin && (
          <TabsContent value="admin" className="space-y-4">
            <AdminInterface />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
