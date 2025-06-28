"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  DollarSign,
  Calendar,
  Building,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Target,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface BuyoutDashboardProps {
  summaryStats: any
  buyoutData: any[]
  onBuyoutSelect: (buyout: any) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
}

export function BuyoutDashboard({
  summaryStats,
  buyoutData,
  onBuyoutSelect,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: BuyoutDashboardProps) {
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")

  // Calculate additional metrics
  const additionalMetrics = useMemo(() => {
    const totalChangeOrders = buyoutData.reduce((sum, item) => sum + (item.changeOrders?.length || 0), 0)
    const totalChangeOrderValue = buyoutData.reduce(
      (sum, item) => sum + (item.changeOrders?.reduce((coSum: number, co: any) => coSum + co.amount, 0) || 0),
      0,
    )
    const avgSupplierRating = buyoutData.reduce((sum, item) => sum + (item.supplierRating || 0), 0) / buyoutData.length
    const documentsCount = buyoutData.reduce((sum, item) => sum + (item.documents?.length || 0), 0)

    return {
      totalChangeOrders,
      totalChangeOrderValue,
      avgSupplierRating,
      documentsCount,
    }
  }, [buyoutData])

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    "LOI Sent": "bg-purple-100 text-purple-800",
    "Contract Sent": "bg-orange-100 text-orange-800",
    "Contract Executed": "bg-green-100 text-green-800",
    "On Hold": "bg-red-100 text-red-800",
  }

  const riskColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
    critical: "bg-red-200 text-red-900",
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Contract Executed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "On Hold":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Total Value</p>
                <p className="text-sm md:text-lg font-bold">{formatCurrency(summaryStats.totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Total Budget</p>
                <p className="text-sm md:text-lg font-bold">{formatCurrency(summaryStats.totalBudget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Executed</p>
                <p className="text-sm md:text-lg font-bold">{summaryStats.executedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-sm md:text-lg font-bold">{summaryStats.pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-xs text-gray-600">At Risk</p>
                <p className="text-sm md:text-lg font-bold">{summaryStats.atRiskCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Completion</p>
                <p className="text-sm md:text-lg font-bold">{(summaryStats.completionRate * 100).toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600">Change Orders</p>
                <p className="text-sm md:text-lg font-bold">{additionalMetrics.totalChangeOrders}</p>
                <p className="text-xs text-gray-500">{formatCurrency(additionalMetrics.totalChangeOrderValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Avg Rating</p>
                <p className="text-sm md:text-lg font-bold">{additionalMetrics.avgSupplierRating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Supplier performance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Documents</p>
                <p className="text-sm md:text-lg font-bold">{additionalMetrics.documentsCount}</p>
                <p className="text-xs text-gray-500">Total uploaded</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-xs text-gray-600">Overdue Tasks</p>
                <p className="text-sm md:text-lg font-bold">{summaryStats.overdueTasks}</p>
                <p className="text-xs text-gray-500">Require attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search buyouts..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="LOI Sent">LOI Sent</SelectItem>
                  <SelectItem value="Contract Sent">Contract Sent</SelectItem>
                  <SelectItem value="Contract Executed">Contract Executed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                >
                  Cards
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buyout Cards/List */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buyoutData.map((buyout) => (
            <Card
              key={buyout.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onBuyoutSelect(buyout)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-sm font-semibold">{buyout.title}</CardTitle>
                    <p className="text-xs text-gray-600">{buyout.number}</p>
                  </div>
                  <div className="flex items-center gap-1">{getStatusIcon(buyout.status)}</div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Vendor:</span>
                    <span className="text-xs font-medium">{buyout.vendor}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Value:</span>
                    <span className="text-xs font-medium">{formatCurrency(buyout.grand_total)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Progress:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={buyout.progress} className="w-16 h-2" />
                      <span className="text-xs">{buyout.progress}%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Badge className={statusColors[buyout.status as keyof typeof statusColors]} variant="secondary">
                      {buyout.status}
                    </Badge>
                    <Badge className={riskColors[buyout.riskLevel as keyof typeof riskColors]} variant="secondary">
                      {buyout.riskLevel} risk
                    </Badge>
                  </div>

                  {buyout.forecastData && (
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Forecast Variance:</span>
                        <span
                          className={`text-xs font-medium ${buyout.forecastData.variance >= 0 ? "text-red-600" : "text-green-600"}`}
                        >
                          {buyout.forecastData.variance >= 0 ? "+" : ""}
                          {formatCurrency(buyout.forecastData.variance)}
                        </span>
                      </div>
                    </div>
                  )}

                  {(buyout.tasks?.length > 0 || buyout.changeOrders?.length > 0) && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        Tasks: {buyout.tasks?.filter((t: any) => t.status === "completed").length || 0}/
                        {buyout.tasks?.length || 0}
                      </span>
                      <span>COs: {buyout.changeOrders?.length || 0}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 text-xs font-medium">Contract</th>
                    <th className="text-left p-3 text-xs font-medium">Vendor</th>
                    <th className="text-left p-3 text-xs font-medium">Status</th>
                    <th className="text-right p-3 text-xs font-medium">Value</th>
                    <th className="text-center p-3 text-xs font-medium">Progress</th>
                    <th className="text-center p-3 text-xs font-medium">Risk</th>
                    <th className="text-right p-3 text-xs font-medium">Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {buyoutData.map((buyout) => (
                    <tr
                      key={buyout.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => onBuyoutSelect(buyout)}
                    >
                      <td className="p-3">
                        <div>
                          <div className="text-xs font-medium">{buyout.title}</div>
                          <div className="text-xs text-gray-500">{buyout.number}</div>
                        </div>
                      </td>
                      <td className="p-3 text-xs">{buyout.vendor}</td>
                      <td className="p-3">
                        <Badge className={statusColors[buyout.status as keyof typeof statusColors]} variant="secondary">
                          {buyout.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs text-right font-mono">{formatCurrency(buyout.grand_total)}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Progress value={buyout.progress} className="w-16 h-2" />
                          <span className="text-xs">{buyout.progress}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className={riskColors[buyout.riskLevel as keyof typeof riskColors]} variant="secondary">
                          {buyout.riskLevel}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs text-right font-mono">
                        {buyout.forecastData && (
                          <span className={buyout.forecastData.variance >= 0 ? "text-red-600" : "text-green-600"}>
                            {buyout.forecastData.variance >= 0 ? "+" : ""}
                            {formatCurrency(buyout.forecastData.variance)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {buyoutData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Building className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No buyouts match your current filters</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              onSearchChange("")
              onStatusFilterChange("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
