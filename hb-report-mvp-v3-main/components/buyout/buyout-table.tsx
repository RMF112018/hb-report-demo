"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface BuyoutTableProps {
  data: any[]
  onEdit: (buyout: any) => void
  onDelete: (buyout: any) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
}

export function BuyoutTable({
  data,
  onEdit,
  onDelete,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: BuyoutTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(null)

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
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "On Hold":
        return <AlertTriangle className="h-3 w-3 text-red-500" />
      default:
        return null
    }
  }

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="h-3 w-3 text-red-500" />
    if (variance < 0) return <TrendingDown className="h-3 w-3 text-green-500" />
    return null
  }

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
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

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Buyout Schedule ({data.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs font-medium cursor-pointer" onClick={() => handleSort("number")}>
                    Contract #
                  </TableHead>
                  <TableHead className="text-xs font-medium cursor-pointer" onClick={() => handleSort("title")}>
                    Title
                  </TableHead>
                  <TableHead className="text-xs font-medium cursor-pointer" onClick={() => handleSort("vendor")}>
                    Vendor
                  </TableHead>
                  <TableHead className="text-xs font-medium cursor-pointer" onClick={() => handleSort("status")}>
                    Status
                  </TableHead>
                  <TableHead
                    className="text-xs font-medium text-right cursor-pointer"
                    onClick={() => handleSort("grand_total")}
                  >
                    Contract Value
                  </TableHead>
                  <TableHead
                    className="text-xs font-medium text-right cursor-pointer"
                    onClick={() => handleSort("budget")}
                  >
                    Budget
                  </TableHead>
                  <TableHead className="text-xs font-medium text-center">Progress</TableHead>
                  <TableHead className="text-xs font-medium text-center">Risk</TableHead>
                  <TableHead className="text-xs font-medium text-right">Forecast Variance</TableHead>
                  <TableHead className="text-xs font-medium text-center">Tasks</TableHead>
                  <TableHead className="text-xs font-medium text-center">COs</TableHead>
                  <TableHead className="text-xs font-medium text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((buyout) => (
                  <TableRow key={buyout.id} className="hover:bg-gray-50">
                    <TableCell className="text-xs font-mono">{buyout.number}</TableCell>
                    <TableCell className="text-xs">
                      <div>
                        <div className="font-medium">{buyout.title}</div>
                        <div className="text-gray-500">{buyout.division_description}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{buyout.vendor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(buyout.status)}
                        <Badge className={statusColors[buyout.status as keyof typeof statusColors]} variant="secondary">
                          {buyout.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-right font-mono">{formatCurrency(buyout.grand_total)}</TableCell>
                    <TableCell className="text-xs text-right font-mono">{formatCurrency(buyout.budget)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Progress value={buyout.progress} className="w-12 h-2" />
                        <span className="text-xs">{buyout.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={riskColors[buyout.riskLevel as keyof typeof riskColors]} variant="secondary">
                        {buyout.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-right font-mono">
                      {buyout.forecastData && (
                        <div className="flex items-center justify-end gap-1">
                          {getVarianceIcon(buyout.forecastData.variance)}
                          <span className={buyout.forecastData.variance >= 0 ? "text-red-600" : "text-green-600"}>
                            {buyout.forecastData.variance >= 0 ? "+" : ""}
                            {formatCurrency(buyout.forecastData.variance)}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-xs">
                        <span className="text-green-600">
                          {buyout.tasks?.filter((t: any) => t.status === "completed").length || 0}
                        </span>
                        <span className="text-gray-400">/</span>
                        <span>{buyout.tasks?.length || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-xs">
                        <span className="text-blue-600">
                          {buyout.changeOrders?.filter((co: any) => co.status === "Approved").length || 0}
                        </span>
                        <span className="text-gray-400">/</span>
                        <span>{buyout.changeOrders?.length || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => onEdit(buyout)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onEdit(buyout)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onDelete(buyout)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
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
        </CardContent>
      </Card>
    </div>
  )
}
