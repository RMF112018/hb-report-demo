"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { EnhancedBuyoutForm } from "@/components/buyout/enhanced-buyout-form"
import { BuyoutDashboard } from "@/components/buyout/buyout-dashboard"
import { BuyoutTable } from "@/components/buyout/buyout-table"
import { AIBuyoutInsights } from "@/components/buyout/ai-buyout-insights"
import { Plus, RefreshCw, Download, Share2, BarChart3, Brain, FileText } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Enhanced mock buyout data with forecasting integration
const mockBuyoutData = [
  {
    id: 1,
    procore_id: 1001,
    division_description: "01 - General Requirements",
    title: "General Conditions",
    number: "1699901-001",
    vendor: "ABC Construction Services",
    status: "Contract Executed",
    bic: "HB",
    contract_start_date: "2024-01-15",
    grand_total: 125000,
    budget: 130000,
    allowances: 5000,
    savings_loss: 5000,
    ownerApproval: "Approved",
    signed_contract_received_date: "2024-01-10",
    comments: "Contract fully executed and ready to proceed",
    progress: 85,
    riskLevel: "low",
    costCode: "15-02-010",
    forecastData: {
      previousForecast: 128000,
      actualToDate: 106250,
      remainingForecast: 18750,
      estimatedCompletion: 125000,
      variance: -3000,
    },
    changeOrders: [{ id: "CO-001", amount: 2500, status: "Approved", description: "Additional excavation" }],
    documents: [
      { id: "DOC-001", name: "Signed Contract.pdf", type: "contract", uploadDate: "2024-01-10" },
      { id: "DOC-002", name: "Insurance Certificate.pdf", type: "insurance", uploadDate: "2024-01-08" },
    ],
    tasks: [
      { id: "TASK-001", title: "Submit insurance", assignee: "pm", dueDate: "2024-01-20", status: "completed" },
      { id: "TASK-002", title: "Schedule kickoff meeting", assignee: "px", dueDate: "2024-01-25", status: "pending" },
    ],
    comments: [
      {
        id: "COMMENT-001",
        user: "John Smith",
        timestamp: "2024-01-15T10:30:00Z",
        content: "Contract executed successfully. Ready to proceed with mobilization.",
        mentions: ["@jane.doe"],
      },
    ],
    supplierRating: 4.5,
    riskAssessment: {
      financialStability: "low",
      deliveryRisk: "low",
      qualityRisk: "medium",
      mitigationActions: ["Regular quality inspections", "Weekly progress meetings"],
    },
  },
  {
    id: 2,
    procore_id: 1002,
    division_description: "03 - Concrete",
    title: "Structural Concrete",
    number: "1699901-002",
    vendor: "Concrete Solutions LLC",
    status: "In Progress",
    bic: "Vendor",
    contract_start_date: "2024-02-01",
    grand_total: 450000,
    budget: 440000,
    allowances: 15000,
    savings_loss: -10000,
    ownerApproval: "Pending",
    signed_contract_received_date: null,
    comments: "Awaiting owner approval for scope changes",
    progress: 45,
    riskLevel: "medium",
    costCode: "03-30-000",
    forecastData: {
      previousForecast: 445000,
      actualToDate: 202500,
      remainingForecast: 247500,
      estimatedCompletion: 450000,
      variance: 5000,
    },
    changeOrders: [{ id: "CO-002", amount: 15000, status: "Pending", description: "Additional reinforcement" }],
    documents: [{ id: "DOC-003", name: "LOI.pdf", type: "loi", uploadDate: "2024-01-25" }],
    tasks: [
      { id: "TASK-003", title: "Owner approval", assignee: "px", dueDate: "2024-02-10", status: "overdue" },
      { id: "TASK-004", title: "Submit shop drawings", assignee: "vendor", dueDate: "2024-02-15", status: "pending" },
    ],
    comments: [
      {
        id: "COMMENT-002",
        user: "Jane Doe",
        timestamp: "2024-02-05T14:20:00Z",
        content: "Scope changes require owner approval. Holding up progress.",
        mentions: ["@john.smith"],
      },
    ],
    supplierRating: 4.2,
    riskAssessment: {
      financialStability: "low",
      deliveryRisk: "medium",
      qualityRisk: "low",
      mitigationActions: ["Expedite owner approval", "Prepare alternative suppliers"],
    },
  },
  // Add more mock data as needed...
]

export default function EnhancedBuyoutSchedulePage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("project")

  const [buyoutData, setBuyoutData] = useState(mockBuyoutData)
  const [filteredData, setFilteredData] = useState(mockBuyoutData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [view, setView] = useState<"dashboard" | "table" | "form">("dashboard")
  const [selectedBuyout, setSelectedBuyout] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("buyout-details")
  const [showAIInsights, setShowAIInsights] = useState(false)

  // Filter data based on search and status
  useEffect(() => {
    let filtered = buyoutData

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.division_description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    setFilteredData(filtered)
  }, [buyoutData, searchTerm, statusFilter])

  // Calculate summary statistics for dashboard
  const summaryStats = useMemo(() => {
    const totalValue = filteredData.reduce((sum, item) => sum + item.grand_total, 0)
    const totalBudget = filteredData.reduce((sum, item) => sum + item.budget, 0)
    const totalActual = filteredData.reduce((sum, item) => sum + (item.forecastData?.actualToDate || 0), 0)
    const totalForecast = filteredData.reduce((sum, item) => sum + (item.forecastData?.estimatedCompletion || 0), 0)
    const totalVariance = filteredData.reduce((sum, item) => sum + (item.forecastData?.variance || 0), 0)
    const executedCount = filteredData.filter((item) => item.status === "Contract Executed").length
    const pendingCount = filteredData.filter((item) => item.status === "Pending").length
    const atRiskCount = filteredData.filter((item) => item.riskLevel === "high").length
    const overdueTasks = filteredData.reduce(
      (sum, item) => sum + (item.tasks?.filter((task) => task.status === "overdue").length || 0),
      0,
    )
    const completionRate = filteredData.reduce((sum, item) => sum + item.progress, 0) / filteredData.length / 100

    return {
      totalValue,
      totalBudget,
      totalActual,
      totalForecast,
      totalVariance,
      executedCount,
      pendingCount,
      atRiskCount,
      overdueTasks,
      completionRate,
      totalCount: filteredData.length,
      variancePercentage: totalBudget > 0 ? (totalVariance / totalBudget) * 100 : 0,
    }
  }, [filteredData])

  const handleCreateNew = () => {
    setSelectedBuyout(null)
    setView("form")
    setActiveTab("buyout-details")
  }

  const handleEdit = (buyout: any) => {
    setSelectedBuyout(buyout)
    setView("form")
    setActiveTab("buyout-details")
  }

  const handleDelete = (buyout: any) => {
    if (confirm(`Are you sure you want to delete buyout ${buyout.number}?`)) {
      setBuyoutData((prev) => prev.filter((item) => item.id !== buyout.id))
    }
  }

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (selectedBuyout) {
        // Update existing
        setBuyoutData((prev) => prev.map((item) => (item.id === selectedBuyout.id ? { ...item, ...formData } : item)))
      } else {
        // Create new
        const newBuyout = {
          id: Date.now(),
          procore_id: Date.now(),
          ...formData,
          progress: 0,
          riskLevel: "low",
          forecastData: {
            previousForecast: formData.budget || 0,
            actualToDate: 0,
            remainingForecast: formData.budget || 0,
            estimatedCompletion: formData.budget || 0,
            variance: 0,
          },
          changeOrders: [],
          documents: [],
          tasks: [],
          comments: [],
          supplierRating: 0,
          riskAssessment: {
            financialStability: "low",
            deliveryRisk: "low",
            qualityRisk: "low",
            mitigationActions: [],
          },
        }
        setBuyoutData((prev) => [...prev, newBuyout])
      }

      setView("dashboard")
      setSelectedBuyout(null)
    } catch (error) {
      console.error("Error saving buyout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setView("dashboard")
    setSelectedBuyout(null)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API refresh
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // In real app, would refetch data
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    // Simulate export functionality
    console.log("Exporting buyout data...")
  }

  const handleShare = () => {
    // Generate shareable link
    const shareUrl = `${window.location.origin}/shared/buyout/${projectId}`
    navigator.clipboard.writeText(shareUrl)
    alert("Share link copied to clipboard!")
  }

  if (view === "form") {
    return (
      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {selectedBuyout ? `Edit Buyout - ${selectedBuyout.number}` : "Create New Buyout"}
            </h1>
            <p className="text-gray-600 mt-1">
              {selectedBuyout ? "Update buyout schedule details" : "Add a new buyout schedule record"}
            </p>
          </div>
        </div>

        <EnhancedBuyoutForm
          projectId={projectId || "1"}
          commitmentId={selectedBuyout?.procore_id}
          initialData={selectedBuyout}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isLoading={isLoading}
        />
      </div>
    )
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Procurement Management</h1>
          <p className="text-gray-600 mt-1">Advanced buyout schedule and procurement analytics</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline ml-2">Refresh</span>
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Export</span>
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Share</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAIInsights(!showAIInsights)}
            className={showAIInsights ? "bg-blue-50 border-blue-200" : ""}
          >
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">AI Insights</span>
          </Button>
          <Button onClick={handleCreateNew} className="bg-[#FF6B35] hover:bg-[#E55A2B]">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Create New</span>
          </Button>
        </div>
      </div>

      {/* AI Insights Panel */}
      {showAIInsights && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI Procurement Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AIBuyoutInsights summaryMetrics={summaryStats} buyoutData={filteredData} />
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={view} onValueChange={(value) => setView(value as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Detailed View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <BuyoutDashboard
            summaryStats={summaryStats}
            buyoutData={filteredData}
            onBuyoutSelect={handleEdit}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </TabsContent>

        <TabsContent value="table" className="space-y-6">
          <BuyoutTable
            data={filteredData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
