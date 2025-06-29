"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock,
  Building2,
  Users,
  Shield,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  Award,
  Bell,
  Archive
} from "lucide-react"

interface ContractTrackingProps {
  userRole: string
  dataScope: any
  summaryMetrics: any
}

interface Contract {
  id: string
  title: string
  vendor: {
    name: string
    contact: {
      name: string
      email: string
      phone: string
    }
  }
  project: {
    id: string
    name: string
  }
  type: string
  status: string
  value: number
  executionDate: string
  startDate: string
  completionDate: string
  progress: number
  milestones: Array<{
    name: string
    date: string
    status: string
    completed: boolean
  }>
  changeOrders: Array<{
    id: string
    description: string
    amount: number
    status: string
    date: string
  }>
  compliance: {
    insurance: {
      status: string
      expiryDate: string
    }
    bonds: {
      status: string
      amount: number
    }
    certifications: string[]
    safety: {
      score: number
      incidents: number
    }
  }
  payments: Array<{
    id: string
    amount: number
    dueDate: string
    paidDate: string | null
    status: string
  }>
  documents: Array<{
    type: string
    name: string
    status: string
    uploadDate: string
  }>
  performance: {
    qualityScore: number
    scheduleAdherence: number
    budgetAdherence: number
  }
}

export function ContractTracking({ userRole, dataScope, summaryMetrics }: ContractTrackingProps) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showContractModal, setShowContractModal] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      // Generate comprehensive contract data
      const mockContracts: Contract[] = [
        {
          id: "ct001",
          title: "Structural Steel Package - Phase 1",
          vendor: {
            name: "ABC Steel Works",
            contact: {
              name: "John Smith",
              email: "john.smith@abcsteel.com",
              phone: "(555) 123-4567"
            }
          },
          project: {
            id: "proj_001",
            name: "Palm Beach Luxury Estate"
          },
          type: "Subcontract",
          status: "active",
          value: 2650000,
          executionDate: "2024-01-05",
          startDate: "2024-01-15",
          completionDate: "2024-06-30",
          progress: 65,
          milestones: [
            { name: "Foundation Ready", date: "2024-02-15", status: "completed", completed: true },
            { name: "Frame 50% Complete", date: "2024-04-01", status: "completed", completed: true },
            { name: "Frame 100% Complete", date: "2024-05-15", status: "in-progress", completed: false },
            { name: "Final Inspection", date: "2024-06-25", status: "pending", completed: false }
          ],
          changeOrders: [
            { id: "co001", description: "Additional beam reinforcement", amount: 45000, status: "approved", date: "2024-03-15" },
            { id: "co002", description: "Schedule acceleration", amount: 25000, status: "pending", date: "2024-04-10" }
          ],
          compliance: {
            insurance: { status: "valid", expiryDate: "2024-12-31" },
            bonds: { status: "active", amount: 265000 },
            certifications: ["OSHA 30", "AWS D1.1", "AISC Certified"],
            safety: { score: 95, incidents: 0 }
          },
          payments: [
            { id: "pay001", amount: 265000, dueDate: "2024-02-15", paidDate: "2024-02-14", status: "paid" },
            { id: "pay002", amount: 530000, dueDate: "2024-04-15", paidDate: "2024-04-12", status: "paid" },
            { id: "pay003", amount: 397500, dueDate: "2024-06-15", paidDate: null, status: "pending" }
          ],
          documents: [
            { type: "Contract", name: "Executed Contract", status: "approved", uploadDate: "2024-01-05" },
            { type: "Insurance", name: "Certificate of Insurance", status: "approved", uploadDate: "2024-01-03" },
            { type: "Bond", name: "Performance Bond", status: "approved", uploadDate: "2024-01-04" }
          ],
          performance: {
            qualityScore: 92,
            scheduleAdherence: 88,
            budgetAdherence: 97
          }
        },
        {
          id: "ct002",
          title: "MEP Systems Installation",
          vendor: {
            name: "Advanced MEP Solutions",
            contact: {
              name: "Sarah Johnson",
              email: "sarah@advancedmep.com",
              phone: "(555) 234-5678"
            }
          },
          project: {
            id: "proj_002",
            name: "Healthcare Facility Expansion"
          },
          type: "Subcontract",
          status: "active",
          value: 1850000,
          executionDate: "2024-01-20",
          startDate: "2024-02-01",
          completionDate: "2024-08-30",
          progress: 35,
          milestones: [
            { name: "Rough-in Complete", date: "2024-04-30", status: "in-progress", completed: false },
            { name: "Testing Phase", date: "2024-07-15", status: "pending", completed: false },
            { name: "Final Commissioning", date: "2024-08-25", status: "pending", completed: false }
          ],
          changeOrders: [
            { id: "co003", description: "Additional HVAC capacity", amount: 75000, status: "approved", date: "2024-03-20" }
          ],
          compliance: {
            insurance: { status: "valid", expiryDate: "2024-12-31" },
            bonds: { status: "active", amount: 185000 },
            certifications: ["EPA Certified", "NECA Member", "Medical Gas Certified"],
            safety: { score: 89, incidents: 1 }
          },
          payments: [
            { id: "pay004", amount: 185000, dueDate: "2024-03-15", paidDate: "2024-03-12", status: "paid" },
            { id: "pay005", amount: 370000, dueDate: "2024-05-15", paidDate: null, status: "pending" }
          ],
          documents: [
            { type: "Contract", name: "Executed Contract", status: "approved", uploadDate: "2024-01-20" },
            { type: "Insurance", name: "Certificate of Insurance", status: "approved", uploadDate: "2024-01-18" },
            { type: "Permit", name: "Electrical Permit", status: "pending", uploadDate: "2024-02-10" }
          ],
          performance: {
            qualityScore: 88,
            scheduleAdherence: 85,
            budgetAdherence: 94
          }
        },
        {
          id: "ct003",
          title: "Finishes Package - Interior",
          vendor: {
            name: "XYZ Contractors LLC",
            contact: {
              name: "Mike Rodriguez",
              email: "mike@xyzcontractors.com",
              phone: "(555) 345-6789"
            }
          },
          project: {
            id: "proj_003",
            name: "Corporate Tower"
          },
          type: "Subcontract",
          status: "completed",
          value: 850000,
          executionDate: "2023-09-15",
          startDate: "2023-10-01",
          completionDate: "2024-02-28",
          progress: 100,
          milestones: [
            { name: "Rough Finishes", date: "2023-12-15", status: "completed", completed: true },
            { name: "Final Finishes", date: "2024-02-15", status: "completed", completed: true },
            { name: "Punch List Complete", date: "2024-02-25", status: "completed", completed: true }
          ],
          changeOrders: [],
          compliance: {
            insurance: { status: "valid", expiryDate: "2024-12-31" },
            bonds: { status: "released", amount: 85000 },
            certifications: ["State Licensed", "MBE Certified"],
            safety: { score: 94, incidents: 0 }
          },
          payments: [
            { id: "pay006", amount: 170000, dueDate: "2023-11-15", paidDate: "2023-11-12", status: "paid" },
            { id: "pay007", amount: 340000, dueDate: "2024-01-15", paidDate: "2024-01-10", status: "paid" },
            { id: "pay008", amount: 340000, dueDate: "2024-03-15", paidDate: "2024-03-08", status: "paid" }
          ],
          documents: [
            { type: "Contract", name: "Executed Contract", status: "approved", uploadDate: "2023-09-15" },
            { type: "Warranty", name: "Materials Warranty", status: "approved", uploadDate: "2024-02-28" },
            { type: "Closeout", name: "Final Lien Waiver", status: "approved", uploadDate: "2024-03-05" }
          ],
          performance: {
            qualityScore: 95,
            scheduleAdherence: 98,
            budgetAdherence: 100
          }
        }
      ]

      setContracts(mockContracts)
      setFilteredContracts(mockContracts)
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter contracts based on search and filters
  useEffect(() => {
    let filtered = contracts

    if (searchTerm) {
      filtered = filtered.filter(contract =>
        contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.project.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(contract => contract.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(contract => contract.type === typeFilter)
    }

    setFilteredContracts(filtered)
  }, [contracts, searchTerm, statusFilter, typeFilter])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; label: string } } = {
      active: { color: "bg-green-100 text-green-800 border-green-200", label: "Active" },
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
      completed: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Completed" },
      suspended: { color: "bg-red-100 text-red-800 border-red-200", label: "Suspended" }
    }
    const config = statusConfig[status] || statusConfig.pending
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getComplianceIndicator = (contract: Contract) => {
    const issues = []
    if (contract.compliance.insurance.status !== "valid") issues.push("Insurance")
    if (contract.compliance.bonds.status !== "active" && contract.status === "active") issues.push("Bonds")
    if (contract.compliance.safety.score < 85) issues.push("Safety")

    if (issues.length === 0) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    } else {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const contractStats = useMemo(() => {
    const totalValue = filteredContracts.reduce((sum, contract) => sum + contract.value, 0)
    const activeContracts = filteredContracts.filter(c => c.status === "active").length
    const completedContracts = filteredContracts.filter(c => c.status === "completed").length
    const averageProgress = filteredContracts.reduce((sum, c) => sum + c.progress, 0) / filteredContracts.length || 0
    const pendingPayments = filteredContracts.reduce((sum, contract) => {
      return sum + contract.payments.filter(p => p.status === "pending").reduce((pSum, p) => pSum + p.amount, 0)
    }, 0)

    return {
      totalValue,
      activeContracts,
      completedContracts,
      averageProgress,
      pendingPayments
    }
  }, [filteredContracts])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
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
      {/* Contract Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Value</p>
                <p className="text-xl font-bold text-blue-900">{formatCurrency(contractStats.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Contracts</p>
                <p className="text-2xl font-bold text-green-900">{contractStats.activeContracts}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg Progress</p>
                <p className="text-2xl font-bold text-orange-900">{contractStats.averageProgress.toFixed(0)}%</p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Completed</p>
                <p className="text-2xl font-bold text-purple-900">{contractStats.completedContracts}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-rose-600">Pending Payments</p>
                <p className="text-lg font-bold text-rose-900">{formatCurrency(contractStats.pendingPayments)}</p>
              </div>
              <Clock className="h-8 w-8 text-rose-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#FF6B35]" />
            Contract Management & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contracts, vendors, or projects..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Subcontract">Subcontract</SelectItem>
                <SelectItem value="Purchase Order">Purchase Order</SelectItem>
                <SelectItem value="Service Agreement">Service Agreement</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Contracts Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Contract / Vendor</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-center">Progress</TableHead>
                  <TableHead className="text-center">Compliance</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.map((contract) => (
                  <TableRow key={contract.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{contract.title}</div>
                        <div className="text-sm text-gray-500">{contract.vendor.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{contract.project.name}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(contract.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">{formatCurrency(contract.value)}</div>
                      {contract.changeOrders.length > 0 && (
                        <div className="text-xs text-gray-500">
                          +{contract.changeOrders.length} CO
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="w-full space-y-1">
                        <Progress value={contract.progress} className="h-2" />
                        <span className="text-sm">{contract.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {getComplianceIndicator(contract)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{contract.completionDate}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedContract(contract)
                            setShowContractModal(true)
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

          {filteredContracts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No contracts found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contract Detail Modal */}
      {selectedContract && (
        <Dialog open={showContractModal} onOpenChange={setShowContractModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#FF6B35]" />
                {selectedContract.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Contract Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500">Contract Value</p>
                    <p className="text-xl font-bold">{formatCurrency(selectedContract.value)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500">Progress</p>
                    <p className="text-xl font-bold">{selectedContract.progress}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex justify-center">
                      {getStatusBadge(selectedContract.status)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500">Performance</p>
                    <p className="text-xl font-bold">{selectedContract.performance.qualityScore}%</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Information Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                  <TabsTrigger value="changes">Changes</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contract Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Contract Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Contract ID:</span>
                            <div className="font-medium">{selectedContract.id}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <div className="font-medium">{selectedContract.type}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Execution Date:</span>
                            <div className="font-medium">{selectedContract.executionDate}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Start Date:</span>
                            <div className="font-medium">{selectedContract.startDate}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Completion Date:</span>
                            <div className="font-medium">{selectedContract.completionDate}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Project:</span>
                            <div className="font-medium">{selectedContract.project.name}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Vendor Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Vendor Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Company:</span>
                            <div className="font-medium">{selectedContract.vendor.name}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Contact:</span>
                            <div className="font-medium">{selectedContract.vendor.contact.name}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Email:</span>
                            <div className="font-medium">{selectedContract.vendor.contact.email}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Phone:</span>
                            <div className="font-medium">{selectedContract.vendor.contact.phone}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">Quality Score</span>
                            <span className="text-sm font-medium">{selectedContract.performance.qualityScore}%</span>
                          </div>
                          <Progress value={selectedContract.performance.qualityScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">Schedule Adherence</span>
                            <span className="text-sm font-medium">{selectedContract.performance.scheduleAdherence}%</span>
                          </div>
                          <Progress value={selectedContract.performance.scheduleAdherence} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">Budget Adherence</span>
                            <span className="text-sm font-medium">{selectedContract.performance.budgetAdherence}%</span>
                          </div>
                          <Progress value={selectedContract.performance.budgetAdherence} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="milestones" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Project Milestones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedContract.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {milestone.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : milestone.status === "in-progress" ? (
                                <Clock className="h-5 w-5 text-orange-500" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-gray-400" />
                              )}
                              <div>
                                <div className="font-medium">{milestone.name}</div>
                                <div className="text-sm text-gray-500">{milestone.date}</div>
                              </div>
                            </div>
                            {getStatusBadge(milestone.status)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="compliance" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Insurance & Bonds */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Insurance & Bonds</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Insurance Certificate</div>
                            <div className="text-sm text-gray-500">Expires: {selectedContract.compliance.insurance.expiryDate}</div>
                          </div>
                          {selectedContract.compliance.insurance.status === "valid" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Performance Bond</div>
                            <div className="text-sm text-gray-500">Amount: {formatCurrency(selectedContract.compliance.bonds.amount)}</div>
                          </div>
                          {selectedContract.compliance.bonds.status === "active" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Certifications & Safety */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Certifications & Safety</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <span className="text-sm text-gray-500">Certifications:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedContract.compliance.certifications.map((cert, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">Safety Record</div>
                              <div className="text-sm text-gray-500">
                                Score: {selectedContract.compliance.safety.score}% • 
                                Incidents: {selectedContract.compliance.safety.incidents}
                              </div>
                            </div>
                            {selectedContract.compliance.safety.score >= 85 ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="payments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payment Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedContract.payments.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <div className="font-medium">{formatCurrency(payment.amount)}</div>
                              <div className="text-sm text-gray-500">
                                Due: {payment.dueDate}
                                {payment.paidDate && ` • Paid: ${payment.paidDate}`}
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                payment.status === "paid"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-orange-100 text-orange-800 border-orange-200"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="changes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Change Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedContract.changeOrders.length > 0 ? (
                        <div className="space-y-3">
                          {selectedContract.changeOrders.map((co) => (
                            <div key={co.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <div className="font-medium">{co.description}</div>
                                <div className="text-sm text-gray-500">
                                  {co.id} • {co.date}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{formatCurrency(co.amount)}</div>
                                <Badge
                                  variant="outline"
                                  className={
                                    co.status === "approved"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : "bg-orange-100 text-orange-800 border-orange-200"
                                  }
                                >
                                  {co.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No change orders recorded
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contract Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedContract.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="font-medium">{doc.name}</div>
                                <div className="text-sm text-gray-500">
                                  {doc.type} • {doc.uploadDate}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={
                                  doc.status === "approved"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-orange-100 text-orange-800 border-orange-200"
                                }
                              >
                                {doc.status}
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 