"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Upload,
  Brain,
  BarChart3,
  AlertTriangle,
} from "lucide-react"
import { mockProjects } from "@/data/mock-projects"
import { fetchForecastData, transformToDualRowData, calculateProjectTotals } from "@/lib/forecast-data"
import { AdvancedForecastTable } from "@/components/forecasting/advanced-forecast-table"
import { AIForecastInsights } from "@/components/forecasting/ai-forecast-insights"

export default function FinancialForecastingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const projectId = searchParams.get("project")

  // State management
  const [activeTab, setActiveTab] = useState("budget-forecast")
  const [forecastData, setForecastData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string>("all")

  // Get project information
  const project = projectId ? mockProjects.find((p) => p.id === Number.parseInt(projectId)) : null

  // Listen for project changes from header
  useEffect(() => {
    const handleProjectChange = (event: CustomEvent) => {
      const { projectId } = event.detail
      setSelectedProject(projectId)
    }

    window.addEventListener("projectChanged", handleProjectChange as EventListener)

    // Initialize from localStorage on mount
    const savedProject = localStorage.getItem("selectedProject")
    if (savedProject) {
      setSelectedProject(savedProject)
    }

    return () => {
      window.removeEventListener("projectChanged", handleProjectChange as EventListener)
    }
  }, [])

  /**
   * Load forecast data on component mount and tab change
   */
  useEffect(() => {
    const loadForecastData = async () => {
      setIsLoading(true)
      try {
        // Use the selected project for filtering
        const projectId = selectedProject === "all" ? undefined : Number.parseInt(selectedProject)
        const rawData = await fetchForecastData(projectId)
        const transformedData = transformToDualRowData(rawData)
        setForecastData(transformedData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load forecast data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadForecastData()
  }, [activeTab, selectedProject, toast])

  /**
   * Handle data refresh with loading state
   */
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Simulate API refresh delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const projectId = selectedProject === "all" ? undefined : Number.parseInt(selectedProject)
      const rawData = await fetchForecastData(projectId)
      const transformedData = transformToDualRowData(rawData)
      setForecastData(transformedData)
      toast({
        title: "Success",
        description: "Budget data refreshed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh budget data",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  /**
   * Calculate summary metrics for AI insights
   */
  const summaryMetrics = useMemo(() => {
    if (!forecastData.length) return null

    const totals = calculateProjectTotals(forecastData)
    const completionRate = totals.totalActual / totals.totalBudget
    const variancePercentage = Math.abs(totals.totalVariance / totals.totalBudget) * 100
    const highRiskItems = forecastData.filter(
      (item) => item.status === "over-budget" || item.status === "at-risk",
    ).length
    const onTrackItems = forecastData.filter((item) => item.status === "on-track").length
    const overBudgetItems = forecastData.filter((item) => item.status === "over-budget").length

    return {
      totalBudget: totals.totalBudget,
      totalActual: totals.totalActual,
      totalProjected: totals.totalProjected,
      totalVariance: totals.totalVariance,
      totalRemaining: totals.totalBudget - totals.totalActual,
      completionRate,
      variancePercentage,
      highRiskItems,
      totalCostCodes: forecastData.length,
      onTrackItems,
      overBudgetItems,
    }
  }, [forecastData])

  /**
   * Format currency values for display
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  /**
   * Get status color based on variance
   */
  const getVarianceColor = (variance: number): string => {
    if (variance > 0) return "text-red-600"
    if (variance < 0) return "text-green-600"
    return "text-gray-600"
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Forecasting</h1>
            {project && (
              <p className="text-gray-600 mt-1">
                Project: {project.name} (ID: {project.id})
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Forecasting</h1>
            {project && selectedProject !== "all" && (
              <p className="text-gray-600 mt-1">
                Project: {project.name} (ID: {project.id})
              </p>
            )}
            {selectedProject === "all" && <p className="text-gray-600 mt-1">Showing data for all active projects</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summaryMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summaryMetrics.totalBudget)}</div>
              <p className="text-xs text-muted-foreground">Revised budget including COs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actual Costs</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summaryMetrics.totalActual)}</div>
              <p className="text-xs text-muted-foreground">Job to date costs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projected Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summaryMetrics.totalProjected)}</div>
              <p className="text-xs text-muted-foreground">Estimated cost at completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Variance</CardTitle>
              {summaryMetrics.totalVariance >= 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getVarianceColor(summaryMetrics.totalVariance)}`}>
                {formatCurrency(Math.abs(summaryMetrics.totalVariance))}
              </div>
              <p className="text-xs text-muted-foreground">
                {summaryMetrics.totalVariance >= 0 ? "Over budget" : "Under budget"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="budget-forecast">Budget Forecast</TabsTrigger>
          <TabsTrigger value="ai-insights">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="variance-analysis">Variance Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="budget-forecast" className="space-y-4">
          <AdvancedForecastTable
            data={forecastData}
            editMode={true}
            lastUpdated={new Date()}
            onDataUpdate={(rowId, updates) => {
              // Handle data updates
              console.log("Data update:", rowId, updates)
            }}
            onRowSelect={(rowId) => {
              // Handle row selection
              console.log("Row selected:", rowId)
            }}
          />
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Forecast Analysis
              </CardTitle>
              <CardDescription>Intelligent insights and predictions based on your project data</CardDescription>
            </CardHeader>
            <CardContent>
              <AIForecastInsights summaryMetrics={summaryMetrics} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Cash Flow Analysis
              </CardTitle>
              <CardDescription>Monthly cash flow projections and actual spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Cash Flow Module</h3>
                <p className="text-gray-500 mb-4">
                  This section will contain detailed cash flow analysis, monthly projections, and spending patterns.
                </p>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variance-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Variance Analysis
              </CardTitle>
              <CardDescription>Detailed analysis of budget variances and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Variance Analysis Module</h3>
                <p className="text-gray-500 mb-4">
                  This section will contain variance analysis, performance metrics, and trend analysis.
                </p>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
