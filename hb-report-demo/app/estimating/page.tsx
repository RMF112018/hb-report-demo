"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { useProjectContext } from "@/context/project-context"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Ruler,
  Users,
  Target,
  Activity,
  Brain,
  Zap,
  Home,
  Building2,
  RefreshCw,
  Download,
  Plus,
  BarChart3,
  PieChart,
  Trophy,
  Eye,
  Percent,
  HelpCircle,
  Upload
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Import enhanced estimating components
import { EstimatingProvider } from "@/components/estimating/EstimatingProvider"
import { QuantityTakeoffDashboard } from "@/components/estimating/QuantityTakeoffDashboard"
import { BidManagementCenter } from "@/components/estimating/BidManagementCenter"
import { CostAnalyticsDashboard } from "@/components/estimating/CostAnalyticsDashboard"
import { EstimatingIntelligence } from "@/components/estimating/EstimatingIntelligence"
import { ProjectEstimateOverview } from "@/components/estimating/ProjectEstimateOverview"

// Import mock data
import projectsData from "@/data/mock/projects.json"
import estimatingData from "@/data/mock/estimating/estimates.json"

export default function EstimatingPage() {
  const { user } = useAuth()
  const { projectId } = useProjectContext()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")
  const [isLoading, setIsLoading] = useState(false)

  // Filter projects for estimating - active projects in pre-construction phases
  const estimatingProjects = useMemo(() => {
    return projectsData.filter(project => 
      ["Pre-Construction", "Bidding", "BIM Coordination"].includes(project.project_stage_name) &&
      project.active
    )
  }, [])

  // Calculate comprehensive estimating statistics
  const estimatingStats = useMemo(() => {
    const totalEstimates = estimatingData.length
    const activeEstimates = estimatingData.filter(est => est.status === "in-progress" || est.status === "review").length
    const completedEstimates = estimatingData.filter(est => est.status === "approved" || est.status === "submitted").length
    const totalEstimateValue = estimatingData.reduce((sum, est) => sum + (est.totalEstimatedValue || 0), 0)
    
    // Calculate win rate from submitted estimates
    const submittedEstimates = estimatingData.filter(est => est.status === "submitted" || est.status === "awarded" || est.status === "lost")
    const wonEstimates = estimatingData.filter(est => est.status === "awarded")
    const winRate = submittedEstimates.length > 0 ? (wonEstimates.length / submittedEstimates.length) * 100 : 0
    
    // Calculate average estimate accuracy
    const estimatesWithActuals = estimatingData.filter(est => est.actualCost && est.totalEstimatedValue)
    const averageAccuracy = estimatesWithActuals.length > 0 ? 
      estimatesWithActuals.reduce((sum, est) => {
        const variance = Math.abs(est.actualCost - est.totalEstimatedValue) / est.totalEstimatedValue
        return sum + (1 - variance)
      }, 0) / estimatesWithActuals.length * 100 : 0

    // Productivity metrics
    const avgTimeToComplete = estimatingData.reduce((sum, est) => {
      if (est.dateCreated && est.lastModified) {
        const days = (new Date(est.lastModified).getTime() - new Date(est.dateCreated).getTime()) / (1000 * 60 * 60 * 24)
        return sum + days
      }
      return sum
    }, 0) / estimatingData.length

    return {
      totalEstimates,
      activeEstimates,
      completedEstimates,
      totalEstimateValue,
      averageProjectValue: totalEstimateValue / Math.max(totalEstimates, 1),
      winRate,
      averageAccuracy,
      avgTimeToComplete: Math.round(avgTimeToComplete),
      projectsInPipeline: estimatingProjects.length,
      
      // Workload analysis
      estimatorWorkload: activeEstimates,
      pendingReviews: estimatingData.filter(est => est.status === "review").length,
      urgentDeadlines: estimatingData.filter(est => {
        if (!est.dueDate) return false
        const daysUntilDue = (new Date(est.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        return daysUntilDue <= 7 && daysUntilDue > 0
      }).length
    }
  }, [estimatingProjects, estimatingData])

  // Get role-specific scope information
  const getEstimatingScope = () => {
    if (!user) return { scope: "all", description: "All Estimating Projects" }
    
    switch (user.role) {
      case "project-manager":
        return { 
          scope: "assigned", 
          description: "Assigned Estimates",
          projectCount: Math.min(estimatingStats.activeEstimates, 3)
        }
      case "project-executive":
        return { 
          scope: "portfolio", 
          description: "Portfolio Estimates",
          projectCount: Math.min(estimatingStats.activeEstimates, 8)
        }
      case "estimator":
        return {
          scope: "estimating",
          description: "Estimator Dashboard",
          projectCount: estimatingStats.activeEstimates
        }
      case "executive":
        return {
          scope: "enterprise",
          description: "Enterprise Estimating View",
          projectCount: estimatingStats.totalEstimates
        }
      default:
        return { 
          scope: "enterprise", 
          description: "Enterprise Estimating View",
          projectCount: estimatingStats.totalEstimates
        }
    }
  }

  const estimatingScope = getEstimatingScope()

  // Format currency values
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toLocaleString()}`
  }

  // Handle URL hash navigation
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && ['overview', 'takeoff', 'bidding', 'analytics', 'intelligence', 'projects'].includes(hash)) {
      setActiveTab(hash)
    }
  }, [])

  // Handle refresh action
  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <>
      <AppHeader />
      <div className="space-y-6 p-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/pre-con" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Pre-Construction
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Estimating</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Estimating Intelligence Center</h1>
              <p className="text-muted-foreground mt-1">
                Advanced construction estimating with AI-powered insights, bid management, and cost intelligence
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="outline" className="px-3 py-1">
                  {estimatingScope.description}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className="px-3 py-1"
                >
                  {estimatingScope.projectCount} Active Estimates
                </Badge>
                <Badge 
                  variant="secondary" 
                  className="px-3 py-1"
                >
                  {estimatingStats.projectsInPipeline} Projects in Pipeline
                </Badge>
                <Badge 
                  variant={estimatingStats.averageAccuracy >= 90 ? "default" : estimatingStats.averageAccuracy >= 80 ? "secondary" : "destructive"}
                  className="px-3 py-1"
                >
                  Accuracy: {estimatingStats.averageAccuracy.toFixed(1)}%
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:from-[#E55A2B] hover:to-[#D04A1F] text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Estimate
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Value</CardTitle>
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(estimatingStats.totalEstimateValue)}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Across {estimatingStats.totalEstimates} estimates
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Win Rate</CardTitle>
              <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {estimatingStats.winRate.toFixed(1)}%
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                Historical success rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Accuracy</CardTitle>
              <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {estimatingStats.averageAccuracy.toFixed(1)}%
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Estimate vs actual
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Active Estimates</CardTitle>
              <Building2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {estimatingStats.activeEstimates}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                In progress
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Avg Timeline</CardTitle>
              <Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">
                {estimatingStats.avgTimeToComplete}
              </div>
              <p className="text-xs text-cyan-600 dark:text-cyan-400">
                Days to complete
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Urgent Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                {estimatingStats.urgentDeadlines}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Due within 7 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <EstimatingProvider>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 h-12 bg-muted border-border">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="takeoff"
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                <Ruler className="h-4 w-4" />
                <span className="hidden sm:inline">Quantity Takeoff</span>
              </TabsTrigger>
              <TabsTrigger
                value="bidding"
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Bid Management</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Cost Analytics</span>
              </TabsTrigger>
              <TabsTrigger
                value="intelligence"
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">AI Intelligence</span>
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Projects</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="overview" className="space-y-6">
              <ProjectEstimateOverview 
                estimatingData={estimatingData}
                projectsData={estimatingProjects}
                summaryStats={estimatingStats}
                userRole={user?.role || "viewer"}
              />
            </TabsContent>

            <TabsContent value="takeoff" className="space-y-6">
              <QuantityTakeoffDashboard 
                estimatingProjects={estimatingProjects}
                userRole={user?.role || "viewer"}
              />
            </TabsContent>

            <TabsContent value="bidding" className="space-y-6">
              <BidManagementCenter 
                estimatingData={estimatingData}
                projectsData={estimatingProjects}
                userRole={user?.role || "viewer"}
              />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <CostAnalyticsDashboard 
                estimatingData={estimatingData}
                summaryStats={estimatingStats}
                userRole={user?.role || "viewer"}
              />
            </TabsContent>

            <TabsContent value="intelligence" className="space-y-6">
              <EstimatingIntelligence 
                estimatingData={estimatingData}
                summaryStats={estimatingStats}
                userRole={user?.role || "viewer"}
              />
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <ProjectEstimateOverview 
                estimatingData={estimatingData}
                projectsData={estimatingProjects}
                summaryStats={estimatingStats}
                userRole={user?.role || "viewer"}
                viewMode="projects"
              />
            </TabsContent>
          </Tabs>
        </EstimatingProvider>
      </div>
    </>
  )
} 