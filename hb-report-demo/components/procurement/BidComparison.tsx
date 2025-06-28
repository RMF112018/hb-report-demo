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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Scale,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  FileText,
  Star,
  Award,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building2,
  Calendar,
  Target,
  BarChart3,
  Users,
  Shield,
  Zap
} from "lucide-react"

interface BidComparisonProps {
  userRole: string
  dataScope: any
  summaryMetrics: any
}

interface BidPackage {
  id: string
  title: string
  trade: string
  project: string
  status: string
  dueDate: string
  estimatedValue: number
  bids: Bid[]
  evaluationCriteria: {
    price: number
    schedule: number
    experience: number
    quality: number
    safety: number
  }
  recommendedBid?: string
  notes: string
}

interface Bid {
  id: string
  vendorName: string
  vendorId: string
  amount: number
  submissionDate: string
  status: string
  bondRequired: boolean
  alternates: Array<{
    description: string
    amount: number
  }>
  schedule: {
    startDate: string
    duration: number
    milestones: string[]
  }
  scores: {
    price: number
    schedule: number
    experience: number
    quality: number
    safety: number
    total: number
  }
  vendorRating: number
  references: string[]
  exclusions: string[]
  clarifications: string[]
}

export function BidComparison({ userRole, dataScope, summaryMetrics }: BidComparisonProps) {
  const [bidPackages, setBidPackages] = useState<BidPackage[]>([])
  const [filteredPackages, setFilteredPackages] = useState<BidPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [tradeFilter, setTradeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPackage, setSelectedPackage] = useState<BidPackage | null>(null)
  const [showComparisonModal, setShowComparisonModal] = useState(false)
  const [selectedBids, setSelectedBids] = useState<string[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      // Generate comprehensive bid comparison data
      const mockBidPackages: BidPackage[] = [
        {
          id: "bp001",
          title: "Structural Steel Package",
          trade: "Structural",
          project: "Palm Beach Luxury Estate",
          status: "evaluation",
          dueDate: "2024-12-22",
          estimatedValue: 2800000,
          evaluationCriteria: {
            price: 40,
            schedule: 20,
            experience: 20,
            quality: 15,
            safety: 5
          },
          recommendedBid: "bid001",
          notes: "Priority on schedule adherence and quality finish requirements",
          bids: [
            {
              id: "bid001",
              vendorName: "ABC Steel Works",
              vendorId: "v001",
              amount: 2650000,
              submissionDate: "2024-12-15",
              status: "compliant",
              bondRequired: true,
              alternates: [
                { description: "Premium finish upgrade", amount: 85000 },
                { description: "Expedited delivery", amount: 125000 }
              ],
              schedule: {
                startDate: "2024-01-15",
                duration: 120,
                milestones: ["Foundation Ready", "Frame Complete", "Final Inspection"]
              },
              scores: {
                price: 85,
                schedule: 90,
                experience: 95,
                quality: 92,
                safety: 88,
                total: 89.5
              },
              vendorRating: 4.8,
              references: ["Downtown Tower Project", "Residential Complex Phase 1"],
              exclusions: ["Temporary heating", "Site security"],
              clarifications: ["Crane rental specifications", "Weather delay provisions"]
            },
            {
              id: "bid002",
              vendorName: "BuildRight Steel",
              vendorId: "v002",
              amount: 2720000,
              submissionDate: "2024-12-16",
              status: "clarification_needed",
              bondRequired: true,
              alternates: [
                { description: "Enhanced coating system", amount: 95000 }
              ],
              schedule: {
                startDate: "2024-01-20",
                duration: 115,
                milestones: ["Fabrication Complete", "Installation Start", "Final Completion"]
              },
              scores: {
                price: 82,
                schedule: 85,
                experience: 88,
                quality: 89,
                safety: 92,
                total: 86.1
              },
              vendorRating: 4.6,
              references: ["Industrial Complex", "Healthcare Facility"],
              exclusions: ["Material testing", "Engineering stamps"],
              clarifications: ["Connection details", "Delivery schedule"]
            },
            {
              id: "bid003",
              vendorName: "Elite Structural",
              vendorId: "v003",
              amount: 2890000,
              submissionDate: "2024-12-17",
              status: "compliant",
              bondRequired: true,
              alternates: [],
              schedule: {
                startDate: "2024-01-10",
                duration: 110,
                milestones: ["Material Delivery", "Erection Complete", "Quality Sign-off"]
              },
              scores: {
                price: 75,
                schedule: 95,
                experience: 90,
                quality: 95,
                safety: 95,
                total: 87.5
              },
              vendorRating: 4.4,
              references: ["Corporate Headquarters", "Mixed-Use Development"],
              exclusions: ["Permit fees", "Utility coordination"],
              clarifications: ["Schedule acceleration options"]
            }
          ]
        },
        {
          id: "bp002",
          title: "MEP Systems Installation",
          trade: "MEP",
          project: "Healthcare Facility Expansion",
          status: "bidding",
          dueDate: "2024-12-28",
          estimatedValue: 1900000,
          evaluationCriteria: {
            price: 35,
            schedule: 25,
            experience: 25,
            quality: 10,
            safety: 5
          },
          notes: "Healthcare facility requirements - critical system redundancy needed",
          bids: [
            {
              id: "bid004",
              vendorName: "Advanced MEP Solutions",
              vendorId: "v004",
              amount: 1850000,
              submissionDate: "2024-12-18",
              status: "under_review",
              bondRequired: true,
              alternates: [
                { description: "Backup generator upgrade", amount: 150000 },
                { description: "Smart building controls", amount: 85000 }
              ],
              schedule: {
                startDate: "2024-02-01",
                duration: 180,
                milestones: ["Rough-in Complete", "Testing Phase", "Final Commissioning"]
              },
              scores: {
                price: 88,
                schedule: 85,
                experience: 95,
                quality: 90,
                safety: 85,
                total: 89.0
              },
              vendorRating: 4.7,
              references: ["Regional Hospital", "Medical Center Phase 2"],
              exclusions: ["Final commissioning", "Training programs"],
              clarifications: ["Equipment warranties", "Maintenance requirements"]
            },
            {
              id: "bid005",
              vendorName: "ProMech Contractors",
              vendorId: "v005",
              amount: 1920000,
              submissionDate: "2024-12-19",
              status: "compliant",
              bondRequired: true,
              alternates: [
                { description: "Energy efficiency package", amount: 120000 }
              ],
              schedule: {
                startDate: "2024-02-05",
                duration: 175,
                milestones: ["Infrastructure Complete", "System Integration", "Performance Testing"]
              },
              scores: {
                price: 85,
                schedule: 88,
                experience: 90,
                quality: 92,
                safety: 90,
                total: 88.3
              },
              vendorRating: 4.5,
              references: ["Office Complex", "Retail Development"],
              exclusions: ["Permits and fees", "Special testing"],
              clarifications: ["Coordination requirements", "Access limitations"]
            }
          ]
        }
      ]

      setBidPackages(mockBidPackages)
      setFilteredPackages(mockBidPackages)
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter packages based on search and filters
  useEffect(() => {
    let filtered = bidPackages

    if (searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.project.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (tradeFilter !== "all") {
      filtered = filtered.filter(pkg => pkg.trade === tradeFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(pkg => pkg.status === statusFilter)
    }

    setFilteredPackages(filtered)
  }, [bidPackages, searchTerm, tradeFilter, statusFilter])

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
      bidding: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Bidding" },
      evaluation: { color: "bg-orange-100 text-orange-800 border-orange-200", label: "Evaluation" },
      awarded: { color: "bg-green-100 text-green-800 border-green-200", label: "Awarded" },
      cancelled: { color: "bg-red-100 text-red-800 border-red-200", label: "Cancelled" }
    }
    const config = statusConfig[status] || statusConfig.bidding
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getBidStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; label: string } } = {
      compliant: { color: "bg-green-100 text-green-800 border-green-200", label: "Compliant" },
      clarification_needed: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Clarification Needed" },
      under_review: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Under Review" },
      rejected: { color: "bg-red-100 text-red-800 border-red-200", label: "Rejected" }
    }
    const config = statusConfig[status] || statusConfig.under_review
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50"
    if (score >= 80) return "text-yellow-600 bg-yellow-50"
    if (score >= 70) return "text-orange-600 bg-orange-50"
    return "text-red-600 bg-red-50"
  }

  const bidStats = useMemo(() => {
    const totalPackages = filteredPackages.length
    const totalEstimatedValue = filteredPackages.reduce((sum, pkg) => sum + pkg.estimatedValue, 0)
    const totalBids = filteredPackages.reduce((sum, pkg) => sum + pkg.bids.length, 0)
    const avgBidsPerPackage = totalPackages > 0 ? totalBids / totalPackages : 0

    return {
      totalPackages,
      totalEstimatedValue,
      totalBids,
      avgBidsPerPackage
    }
  }, [filteredPackages])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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
      {/* Bid Analysis Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active Packages</p>
                <p className="text-2xl font-bold text-blue-900">{bidStats.totalPackages}</p>
              </div>
              <Scale className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Value</p>
                <p className="text-xl font-bold text-green-900">{formatCurrency(bidStats.totalEstimatedValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Bids</p>
                <p className="text-2xl font-bold text-orange-900">{bidStats.totalBids}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Bids/Package</p>
                <p className="text-2xl font-bold text-purple-900">{bidStats.avgBidsPerPackage.toFixed(1)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bid Packages Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-[#FF6B35]" />
              Bid Analysis & Comparison
            </CardTitle>
            
            {dataScope.canCreate && (
              <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                <Plus className="h-4 w-4 mr-2" />
                New Bid Package
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
                placeholder="Search bid packages, trades, or projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={tradeFilter} onValueChange={setTradeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by trade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                <SelectItem value="Structural">Structural</SelectItem>
                <SelectItem value="MEP">MEP</SelectItem>
                <SelectItem value="Finishes">Finishes</SelectItem>
                <SelectItem value="Site Work">Site Work</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="bidding">Bidding</SelectItem>
                <SelectItem value="evaluation">Evaluation</SelectItem>
                <SelectItem value="awarded">Awarded</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Bid Packages Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Package / Project</TableHead>
                  <TableHead>Trade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Estimated Value</TableHead>
                  <TableHead className="text-center">Bids Received</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Recommended</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.map((pkg) => (
                  <TableRow key={pkg.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{pkg.title}</div>
                        <div className="text-sm text-gray-500">{pkg.project}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{pkg.trade}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(pkg.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(pkg.estimatedValue)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg font-semibold">{pkg.bids.length}</span>
                        <FileText className="h-4 w-4 text-gray-400" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{pkg.dueDate}</div>
                    </TableCell>
                    <TableCell>
                      {pkg.recommendedBid ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Selected</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">Pending</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedPackage(pkg)
                            setShowComparisonModal(true)
                          }}
                        >
                          <Scale className="h-3 w-3 mr-1" />
                          Compare
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPackages.length === 0 && (
            <div className="text-center py-12">
              <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No bid packages found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bid Comparison Modal */}
      {selectedPackage && (
        <Dialog open={showComparisonModal} onOpenChange={setShowComparisonModal}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#FF6B35]" />
                {selectedPackage.title} - Bid Analysis
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Package Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500">Estimated Value</p>
                    <p className="text-xl font-bold">{formatCurrency(selectedPackage.estimatedValue)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500">Bids Received</p>
                    <p className="text-xl font-bold">{selectedPackage.bids.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="text-xl font-bold">{selectedPackage.dueDate}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex justify-center">
                      {getStatusBadge(selectedPackage.status)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Evaluation Criteria */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evaluation Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(selectedPackage.evaluationCriteria).map(([criterion, weight]) => (
                      <div key={criterion} className="text-center p-3 border rounded-lg">
                        <div className="font-medium text-sm capitalize">{criterion}</div>
                        <div className="text-2xl font-bold text-[#FF6B35]">{weight}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bid Comparison Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bid Comparison Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Vendor</TableHead>
                          <TableHead className="text-right">Bid Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-center">Overall Score</TableHead>
                          <TableHead className="text-center">Price Score</TableHead>
                          <TableHead className="text-center">Schedule Score</TableHead>
                          <TableHead className="text-center">Experience</TableHead>
                          <TableHead className="text-center">Quality</TableHead>
                          <TableHead className="text-center">Safety</TableHead>
                          <TableHead className="text-center">Rating</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPackage.bids
                          .sort((a, b) => b.scores.total - a.scores.total)
                          .map((bid, index) => (
                          <TableRow key={bid.id} className={index === 0 ? "bg-green-50" : ""}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {index === 0 && <Award className="h-4 w-4 text-yellow-500" />}
                                <div>
                                  <div className="font-medium">{bid.vendorName}</div>
                                  <div className="text-sm text-gray-500">{bid.submissionDate}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-medium">{formatCurrency(bid.amount)}</div>
                              <div className="text-sm text-gray-500">
                                {((bid.amount - selectedPackage.estimatedValue) / selectedPackage.estimatedValue * 100).toFixed(1)}%
                              </div>
                            </TableCell>
                            <TableCell>
                              {getBidStatusBadge(bid.status)}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(bid.scores.total)}`}>
                                {bid.scores.total.toFixed(1)}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getScoreColor(bid.scores.price)}`}>
                                {bid.scores.price}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getScoreColor(bid.scores.schedule)}`}>
                                {bid.scores.schedule}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getScoreColor(bid.scores.experience)}`}>
                                {bid.scores.experience}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getScoreColor(bid.scores.quality)}`}>
                                {bid.scores.quality}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getScoreColor(bid.scores.safety)}`}>
                                {bid.scores.safety}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-sm">{bid.vendorRating}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Bid Information */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Bid Details</TabsTrigger>
                  <TabsTrigger value="alternates">Alternates</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="evaluation">Evaluation Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {selectedPackage.bids.map((bid) => (
                      <Card key={bid.id}>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center justify-between">
                            {bid.vendorName}
                            {getBidStatusBadge(bid.status)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Bid Amount:</span>
                              <div className="font-medium">{formatCurrency(bid.amount)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Bond Required:</span>
                              <div className="font-medium">{bid.bondRequired ? "Yes" : "No"}</div>
                            </div>
                          </div>
                          
                          {bid.exclusions.length > 0 && (
                            <div>
                              <span className="text-gray-500 text-sm">Exclusions:</span>
                              <ul className="text-sm mt-1 space-y-1">
                                {bid.exclusions.map((exclusion, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-red-500">•</span>
                                    <span>{exclusion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {bid.clarifications.length > 0 && (
                            <div>
                              <span className="text-gray-500 text-sm">Clarifications Needed:</span>
                              <ul className="text-sm mt-1 space-y-1">
                                {bid.clarifications.map((clarification, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-orange-500">•</span>
                                    <span>{clarification}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="alternates" className="space-y-4">
                  {selectedPackage.bids.map((bid) => (
                    <Card key={bid.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{bid.vendorName} - Alternates</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {bid.alternates.length > 0 ? (
                          <div className="space-y-3">
                            {bid.alternates.map((alternate, i) => (
                              <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                                <span>{alternate.description}</span>
                                <span className="font-medium">{formatCurrency(alternate.amount)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No alternates provided
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  {selectedPackage.bids.map((bid) => (
                    <Card key={bid.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{bid.vendorName} - Schedule</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <span className="text-gray-500 text-sm">Start Date:</span>
                            <div className="font-medium">{bid.schedule.startDate}</div>
                          </div>
                          <div>
                            <span className="text-gray-500 text-sm">Duration:</span>
                            <div className="font-medium">{bid.schedule.duration} days</div>
                          </div>
                          <div>
                            <span className="text-gray-500 text-sm">Milestones:</span>
                            <div className="font-medium">{bid.schedule.milestones.length}</div>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-gray-500 text-sm">Key Milestones:</span>
                          <ul className="mt-2 space-y-1">
                            {bid.schedule.milestones.map((milestone, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{milestone}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="evaluation" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Evaluation Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <span className="text-gray-500 text-sm">Package Notes:</span>
                          <p className="mt-1">{selectedPackage.notes}</p>
                        </div>
                        
                        <div>
                          <span className="text-gray-500 text-sm">Recommendation:</span>
                          {selectedPackage.recommendedBid ? (
                            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="font-medium">
                                  {selectedPackage.bids.find(b => b.id === selectedPackage.recommendedBid)?.vendorName} recommended
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-orange-500" />
                                <span>Evaluation in progress</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              {dataScope.canApprove && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline">
                    Export Analysis
                  </Button>
                  <Button variant="outline">
                    Request Clarification
                  </Button>
                  <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                    Award Contract
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 