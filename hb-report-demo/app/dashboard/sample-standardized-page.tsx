"use client"

import React, { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { StandardPageLayout, createDashboardBreadcrumbs } from "@/components/layout/StandardPageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  RefreshCw, 
  Download, 
  Plus,
  FileText,
  TrendingUp,
  Users,
  AlertTriangle
} from "lucide-react"

export default function SampleStandardizedPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Sample data
  const stats = {
    total: 142,
    active: 89,
    completed: 53,
    overdue: 7
  }

  // Get role-specific scope information
  const getProjectScope = () => {
    if (!user) return { description: "All Projects" }
    
    switch (user.role) {
      case "project-manager":
        return { description: "Single Project View" }
      case "project-executive":
        return { description: "Portfolio View (6 Projects)" }
      default:
        return { description: "Enterprise View (All Projects)" }
    }
  }

  const projectScope = getProjectScope()

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleExport = () => {
    console.log("Export functionality")
  }

  const handleCreate = () => {
    console.log("Create functionality")
  }

  return (
    <StandardPageLayout
      title="Sample Page Title"
      description="This demonstrates the standardized page layout structure"
      breadcrumbs={createDashboardBreadcrumbs("Sample Page")}
      badges={[
        { label: projectScope.description, variant: "outline" },
        { label: `${stats.total} Total Items`, variant: "secondary" }
      ]}
      actions={
        <>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreate} className="bg-[#FF6B35] hover:bg-[#E55A2B]">
            <Plus className="h-4 w-4 mr-2" />
            Create Item
          </Button>
        </>
      }
    >
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All tracked items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Successfully finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              Past deadline
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>Main Content Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <h3 className="font-semibold mb-2">Standardized Layout Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Consistent header structure with title, description, and actions</li>
                <li>Standardized breadcrumb navigation</li>
                <li>Proper spacing and typography using theme-aware classes</li>
                <li>Role-based badge system showing project scope</li>
                <li>Consistent action button placement and styling</li>
                <li>Proper z-index hierarchy for modals and overlays</li>
                <li>Theme-compatible colors throughout</li>
              </ul>
            </div>
            
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Implementation Notes:</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Use the StandardPageLayout component for all new pages to ensure consistency. 
                Replace existing page layouts gradually to maintain uniformity across the application.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </StandardPageLayout>
  )
} 