"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Download,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  Star,
  Send,
  Archive,
  Activity,
  Target,
  Users,
  Scale
} from "lucide-react"

// Import mock data
import procurementData from "@/data/mock/financial/procurement/procurement.json"

interface BuyoutManagementProps {
  userRole: string
  dataScope: any
  summaryMetrics: any
}

interface BuyoutRecord {
  id: string
  projectId: string
  projectName: string
  trade: string
  vendor: {
    name: string
    contact: {
      name: string
      email: string
      phone: string
    }
    rating: number
    performance: number
  }
  status: string
  budgetAmount: number
  contractAmount: number
  variance: number
  variancePercent: number
  startDate: string
  endDate: string
  milestones: Array<{
    name: string
    date: string
    status: string
  }>
  documents: Array<{
    type: string
    name: string
    date: string
    status: string
  }>
  changeOrders: number
  lastActivity: string
}

export function BuyoutManagement({ userRole, dataScope, summaryMetrics }: BuyoutManagementProps) {
  const [buyoutRecords, setBuyoutRecords] = useState<BuyoutRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<BuyoutRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tradeFilter, setTradeFilter] = useState("all")
  const [selectedBuyout, setSelectedBuyout] = useState<BuyoutRecord | null>(null)
  const [showBuyoutModal, setShowBuyoutModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState("active")

  // Load and process procurement data
  useEffect(() => {
    const timer = setTimeout(() => {
      const processedData = procurementData.buyouts.map(buyout => ({
        ...buyout,
        variancePercent: buyout.budgetAmount > 0 
          ? ((buyout.contractAmount - buyout.budgetAmount) / buyout.budgetAmount) * 100 
          : 0,
        projectName: getProjectName(buyout.projectId)
      }))
      
      setBuyoutRecords(processedData)
      setFilteredRecords(processedData)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Filter records based on search and filters
  useEffect(() => {
    let filtered = buyoutRecords

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(record => record.status === statusFilter)
    }

    // Trade filter
    if (tradeFilter !== "all") {
      filtered = filtered.filter(record => record.trade === tradeFilter)
    }

    // Tab filter
    if (activeTab === "active") {
      filtered = filtered.filter(record => 
        ["bidding", "negotiation", "contract_review", "executed"].includes(record.status)
      )
    } else if (activeTab === "pending") {
      filtered = filtered.filter(record => 
        ["bidding", "negotiation", "contract_review"].includes(record.status)
      )
    } else if (activeTab === "completed") {
      filtered = filtered.filter(record => record.status === "completed")
    }

    setFilteredRecords(filtered)
  }, [buyoutRecords, searchTerm, statusFilter, tradeFilter, activeTab])

  const getProjectName = (projectId: string) => {
    const projectNames: { [key: string]: string } = {
      "proj_001": "Palm Beach Luxury Estate",
      "proj_002": "Downtown Corporate Tower",
      "proj_003": "Residential Complex Phase 2",
      "proj_004": "Healthcare Facility Expansion",
      "proj_005": "Retail Plaza Development",
      "proj_006": "Industrial Warehouse Complex"
    }
    return projectNames[projectId] || "Unknown Project"
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; label: string } } = {
      bidding: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Bidding" },
      negotiation: { color: "bg-orange-100 text-orange-800 border-orange-200", label: "Negotiation" },
      contract_review: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Contract Review" },
      executed: { color: "bg-green-100 text-green-800 border-green-200", label: "Executed" },
      completed: { color: "bg-gray-100 text-gray-800 border-gray-200", label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800 border-red-200", label: "Cancelled" }
    }
    const config = statusConfig[status] || statusConfig.bidding
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getVarianceIndicator = (variance: number, percentage: number) => {
    const isOverBudget = variance > 0
    const color = isOverBudget ? "text-red-600" : percentage < -5 ? "text-green-600" : "text-gray-600"
    const icon = isOverBudget ? <TrendingUp className="h-3 w-3" /> : percentage < -5 ? <TrendingDown className="h-3 w-3" /> : null

    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span className="text-sm font-medium">{percentage > 0 ? '+' : ''}{percentage.toFixed(1)}%</span>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getUniqueValues = (key: keyof BuyoutRecord) => {
    return [...new Set(buyoutRecords.map(record => record[key] as string))]
  }

  const buyoutStats = useMemo(() => {
    return {
      totalValue: filteredRecords.reduce((sum, record) => sum + record.contractAmount, 0),
      totalBudget: filteredRecords.reduce((sum, record) => sum + record.budgetAmount, 0),
      averageVariance: filteredRecords.length > 0 
        ? filteredRecords.reduce((sum, record) => sum + record.variancePercent, 0) / filteredRecords.length 
        : 0,
      overBudgetCount: filteredRecords.filter(record => record.variance > 0).length,
      onTrackCount: filteredRecords.filter(record => Math.abs(record.variancePercent) <= 5).length,
      underBudgetCount: filteredRecords.filter(record => record.variancePercent < -5).length
    }
  }, [filteredRecords])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Contract Value</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(buyoutStats.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Budget Variance</p>
                <p className={`text-2xl font-bold ${buyoutStats.averageVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {buyoutStats.averageVariance > 0 ? '+' : ''}{buyoutStats.averageVariance.toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">On Track</p>
                <p className="text-2xl font-bold text-orange-900">{buyoutStats.onTrackCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Buyouts</p>
                <p className="text-2xl font-bold text-purple-900">{filteredRecords.length}</p>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[#FF6B35]" />
              Buyout Management
            </CardTitle>
            
            {dataScope.canCreate && (
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-[#FF6B35] hover:bg-[#E55A2B]"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Buyout
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search trades, vendors, or projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="bidding">Bidding</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="contract_review">Contract Review</SelectItem>
                <SelectItem value="executed">Executed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tradeFilter} onValueChange={setTradeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by trade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                {getUniqueValues('trade').map(trade => (
                  <SelectItem key={trade} value={trade}>{trade}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Buyouts Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Trade / Vendor</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Contract</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((buyout) => (
                  <TableRow key={buyout.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{buyout.trade}</div>
                        <div className="text-sm text-gray-500">{buyout.vendor.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{buyout.projectName}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(buyout.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(buyout.budgetAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(buyout.contractAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {getVarianceIndicator(buyout.variance, buyout.variancePercent)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-sm">{buyout.vendor.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBuyout(buyout)
                            setShowBuyoutModal(true)
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {dataScope.canEdit && (
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No buyouts found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Buyout Detail Modal */}
      {selectedBuyout && (
        <Dialog open={showBuyoutModal} onOpenChange={setShowBuyoutModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[#FF6B35]" />
                {selectedBuyout.trade} - {selectedBuyout.vendor.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Summary Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Contract Value</p>
                      <p className="text-xl font-bold">{formatCurrency(selectedBuyout.contractAmount)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Budget Variance</p>
                      <p className={`text-xl font-bold ${selectedBuyout.variancePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedBuyout.variancePercent > 0 ? '+' : ''}{selectedBuyout.variancePercent.toFixed(1)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Vendor Rating</p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-xl font-bold">{selectedBuyout.vendor.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Details Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="vendor">Vendor Info</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Project Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Project:</span>
                          <span>{selectedBuyout.projectName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Trade:</span>
                          <span>{selectedBuyout.trade}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Start Date:</span>
                          <span>{selectedBuyout.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">End Date:</span>
                          <span>{selectedBuyout.endDate}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Financial Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Original Budget:</span>
                          <span>{formatCurrency(selectedBuyout.budgetAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Contract Amount:</span>
                          <span>{formatCurrency(selectedBuyout.contractAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Variance:</span>
                          <span className={selectedBuyout.variance > 0 ? 'text-red-600' : 'text-green-600'}>
                            {formatCurrency(selectedBuyout.variance)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Change Orders:</span>
                          <span>{selectedBuyout.changeOrders}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="milestones" className="space-y-4">
                  <div className="space-y-3">
                    {selectedBuyout.milestones?.map((milestone, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{milestone.name}</div>
                          <div className="text-sm text-gray-500">{milestone.date}</div>
                        </div>
                        {getStatusBadge(milestone.status)}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="space-y-3">
                    {selectedBuyout.documents?.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-gray-500">{doc.type} • {doc.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(doc.status)}
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="vendor" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Company:</span>
                          <span>{selectedBuyout.vendor.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Contact:</span>
                          <span>{selectedBuyout.vendor.contact.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span>{selectedBuyout.vendor.contact.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Phone:</span>
                          <span>{selectedBuyout.vendor.contact.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Performance Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Overall Rating:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{selectedBuyout.vendor.rating}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Performance Score:</span>
                          <span>{selectedBuyout.vendor.performance}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Last Activity:</span>
                          <span>{selectedBuyout.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Buyout Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#FF6B35]" />
              Create New Buyout
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Trade</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="structural">Structural</SelectItem>
                    <SelectItem value="mep">MEP</SelectItem>
                    <SelectItem value="finishes">Finishes</SelectItem>
                    <SelectItem value="sitework">Site Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Budget Amount</label>
                <Input placeholder="$0.00" />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Vendor</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abc">ABC Construction</SelectItem>
                  <SelectItem value="buildright">BuildRight Inc</SelectItem>
                  <SelectItem value="xyz">XYZ Contractors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Buyout description and scope details..." />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                Create Buyout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 