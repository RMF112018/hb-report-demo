"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Handshake,
  FileText,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Building2,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Eye,
  Star,
  MessageSquare,
  Target,
  BarChart3,
  Activity,
  Award,
  Briefcase
} from 'lucide-react'

interface BidData {
  id: string
  projectId: string
  projectName: string
  tradeCategory: string
  vendorName: string
  vendorContact: {
    name: string
    email: string
    phone: string
  }
  bidAmount: number
  status: 'received' | 'reviewed' | 'selected' | 'rejected' | 'pending'
  submissionDate: string
  validUntil: string
  notes: string
  rating: number
  lineItems: {
    description: string
    quantity: number
    unit: string
    unitPrice: number
    totalPrice: number
  }[]
  attachments: string[]
  evaluationScore: number
  riskLevel: 'low' | 'medium' | 'high'
  pastPerformance: {
    projectsCompleted: number
    avgRating: number
    onTimeDelivery: number
  }
}

interface RFPData {
  id: string
  projectId: string
  projectName: string
  title: string
  description: string
  tradeCategory: string
  status: 'draft' | 'sent' | 'responses-due' | 'under-review' | 'awarded'
  issueDate: string
  dueDate: string
  bidders: string[]
  responseCount: number
  estimatedValue: number
  requirements: string[]
  attachments: string[]
}

interface VendorData {
  id: string
  name: string
  category: string[]
  contact: {
    name: string
    email: string
    phone: string
    address: string
  }
  rating: number
  certifications: string[]
  capacity: string
  pastProjects: number
  avgBidAmount: number
  status: 'active' | 'inactive' | 'blacklisted'
  lastActivity: string
}

interface BidManagementProps {
  userRole: string
}

// Mock data
const mockBidData: BidData[] = [
  {
    id: 'bid-001',
    projectId: 'PROJECT-001',
    projectName: 'Atlantic Fields Club Expansion',
    tradeCategory: 'Concrete',
    vendorName: 'Superior Concrete Solutions',
    vendorContact: {
      name: 'John Martinez',
      email: 'j.martinez@superiorconcrete.com',
      phone: '(555) 123-4567'
    },
    bidAmount: 2450000,
    status: 'selected',
    submissionDate: '2025-01-20',
    validUntil: '2025-02-20',
    notes: 'Excellent past performance, competitive pricing',
    rating: 4.5,
    lineItems: [
      { description: 'Concrete footings', quantity: 450, unit: 'CY', unitPrice: 180, totalPrice: 81000 },
      { description: 'Slab on grade', quantity: 12500, unit: 'SF', unitPrice: 8.50, totalPrice: 106250 }
    ],
    attachments: ['concrete-specs.pdf', 'material-list.xlsx'],
    evaluationScore: 92,
    riskLevel: 'low',
    pastPerformance: {
      projectsCompleted: 24,
      avgRating: 4.5,
      onTimeDelivery: 96
    }
  },
  {
    id: 'bid-002',
    projectId: 'PROJECT-001',
    projectName: 'Atlantic Fields Club Expansion',
    tradeCategory: 'Steel',
    vendorName: 'American Steel Fabricators',
    vendorContact: {
      name: 'Sarah Williams',
      email: 's.williams@amsteelfab.com',
      phone: '(555) 234-5678'
    },
    bidAmount: 1950000,
    status: 'reviewed',
    submissionDate: '2025-01-18',
    validUntil: '2025-02-18',
    notes: 'Competitive bid, good timeline',
    rating: 4.2,
    lineItems: [
      { description: 'Structural steel framing', quantity: 85, unit: 'TON', unitPrice: 2400, totalPrice: 204000 }
    ],
    attachments: ['steel-drawings.pdf'],
    evaluationScore: 88,
    riskLevel: 'low',
    pastPerformance: {
      projectsCompleted: 18,
      avgRating: 4.2,
      onTimeDelivery: 94
    }
  },
  {
    id: 'bid-003',
    projectId: 'PROJECT-015',
    projectName: 'Downtown Medical Center',
    tradeCategory: 'MEP',
    vendorName: 'Elite Mechanical Systems',
    vendorContact: {
      name: 'Michael Chen',
      email: 'm.chen@elitemech.com',
      phone: '(555) 345-6789'
    },
    bidAmount: 8900000,
    status: 'under-review',
    submissionDate: '2025-01-22',
    validUntil: '2025-02-22',
    notes: 'Specialized medical equipment experience',
    rating: 4.8,
    lineItems: [
      { description: 'HVAC systems', quantity: 1, unit: 'LS', unitPrice: 3500000, totalPrice: 3500000 },
      { description: 'Medical gas systems', quantity: 1, unit: 'LS', unitPrice: 2800000, totalPrice: 2800000 }
    ],
    attachments: ['mep-specifications.pdf', 'equipment-catalog.pdf'],
    evaluationScore: 95,
    riskLevel: 'medium',
    pastPerformance: {
      projectsCompleted: 12,
      avgRating: 4.8,
      onTimeDelivery: 92
    }
  }
]

const mockRFPData: RFPData[] = [
  {
    id: 'rfp-001',
    projectId: 'PROJECT-001',
    projectName: 'Atlantic Fields Club Expansion',
    title: 'Masonry Work - Exterior Walls',
    description: 'Brick and stone masonry work for exterior walls including foundations and decorative elements',
    tradeCategory: 'Masonry',
    status: 'responses-due',
    issueDate: '2025-01-15',
    dueDate: '2025-02-01',
    bidders: ['Premium Masonry Inc', 'Craftsman Stone Works', 'Heritage Brick & Stone'],
    responseCount: 2,
    estimatedValue: 780000,
    requirements: ['Licensed masonry contractor', 'Minimum 5 years experience', 'Bonded and insured'],
    attachments: ['masonry-plans.pdf', 'material-specifications.pdf']
  },
  {
    id: 'rfp-002',
    projectId: 'PROJECT-001',
    projectName: 'Atlantic Fields Club Expansion',
    title: 'Roofing System Installation',
    description: 'Complete roofing system including membrane, insulation, and accessories',
    tradeCategory: 'Roofing',
    status: 'draft',
    issueDate: '2025-01-25',
    dueDate: '2025-02-15',
    bidders: ['All Weather Roofing', 'Premium Roof Systems', 'Commercial Roofing Solutions'],
    responseCount: 0,
    estimatedValue: 650000,
    requirements: ['Commercial roofing experience', 'Manufacturer certifications', 'Warranty minimum 10 years'],
    attachments: ['roofing-specifications.pdf']
  }
]

const mockVendorData: VendorData[] = [
  {
    id: 'vendor-001',
    name: 'Superior Concrete Solutions',
    category: ['Concrete', 'Foundation'],
    contact: {
      name: 'John Martinez',
      email: 'j.martinez@superiorconcrete.com',
      phone: '(555) 123-4567',
      address: '123 Industrial Blvd, Construction City, CC 12345'
    },
    rating: 4.5,
    certifications: ['NRMCA Certified', 'OSHA 30-Hour'],
    capacity: 'Large Commercial Projects',
    pastProjects: 24,
    avgBidAmount: 2200000,
    status: 'active',
    lastActivity: '2025-01-20'
  },
  {
    id: 'vendor-002',
    name: 'Elite Mechanical Systems',
    category: ['MEP', 'HVAC', 'Plumbing'],
    contact: {
      name: 'Michael Chen',
      email: 'm.chen@elitemech.com',
      phone: '(555) 345-6789',
      address: '456 Tech Drive, Metro City, MC 67890'
    },
    rating: 4.8,
    certifications: ['NECA Member', 'Medical Gas Certified'],
    capacity: 'Healthcare & Commercial',
    pastProjects: 12,
    avgBidAmount: 5500000,
    status: 'active',
    lastActivity: '2025-01-22'
  }
]

export function BidManagement({ userRole }: BidManagementProps) {
  const [activeTab, setActiveTab] = useState('bids')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedBid, setSelectedBid] = useState<BidData | null>(null)
  const [selectedRFP, setSelectedRFP] = useState<RFPData | null>(null)
  const [selectedVendor, setSelectedVendor] = useState<VendorData | null>(null)
  const [isCreatingRFP, setIsCreatingRFP] = useState(false)

  // Filter bids
  const filteredBids = useMemo(() => {
    return mockBidData.filter(bid => {
      const matchesSearch = bid.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bid.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bid.tradeCategory.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || bid.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || bid.tradeCategory === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [searchTerm, statusFilter, categoryFilter])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalBids = mockBidData.length
    const pendingBids = mockBidData.filter(bid => bid.status === 'received').length
    const selectedBids = mockBidData.filter(bid => bid.status === 'selected').length
    const totalValue = mockBidData.reduce((sum, bid) => sum + bid.bidAmount, 0)
    const avgBidValue = totalBids > 0 ? totalValue / totalBids : 0
    const avgEvaluationScore = mockBidData.reduce((sum, bid) => sum + bid.evaluationScore, 0) / totalBids
    const activeRFPs = mockRFPData.filter(rfp => rfp.status === 'responses-due').length
    const activeVendors = mockVendorData.filter(vendor => vendor.status === 'active').length

    return {
      totalBids,
      pendingBids,
      selectedBids,
      totalValue,
      avgBidValue,
      avgEvaluationScore,
      activeRFPs,
      activeVendors
    }
  }, [])

  // Get unique categories
  const uniqueCategories = useMemo(() => {
    return [...new Set(mockBidData.map(bid => bid.tradeCategory))]
  }, [])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'received': { variant: 'secondary' as const, label: 'Received', color: 'bg-blue-100 text-blue-800' },
      'reviewed': { variant: 'default' as const, label: 'Reviewed', color: 'bg-yellow-100 text-yellow-800' },
      'selected': { variant: 'default' as const, label: 'Selected', color: 'bg-green-100 text-green-800' },
      'rejected': { variant: 'destructive' as const, label: 'Rejected', color: 'bg-red-100 text-red-800' },
      'pending': { variant: 'outline' as const, label: 'Pending', color: 'bg-gray-100 text-gray-800' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status, color: '' }
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>
  }

  // Get RFP status badge
  const getRFPStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { variant: 'secondary' as const, label: 'Draft' },
      'sent': { variant: 'default' as const, label: 'Sent' },
      'responses-due': { variant: 'default' as const, label: 'Responses Due' },
      'under-review': { variant: 'secondary' as const, label: 'Under Review' },
      'awarded': { variant: 'default' as const, label: 'Awarded' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  // Get risk level badge
  const getRiskBadge = (risk: string) => {
    const riskConfig = {
      'low': { variant: 'default' as const, label: 'Low Risk', color: 'bg-green-100 text-green-800' },
      'medium': { variant: 'secondary' as const, label: 'Medium Risk', color: 'bg-yellow-100 text-yellow-800' },
      'high': { variant: 'destructive' as const, label: 'High Risk', color: 'bg-red-100 text-red-800' }
    }

    const config = riskConfig[risk as keyof typeof riskConfig] || { variant: 'outline' as const, label: risk, color: '' }
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>
  }

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star key={star} className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        ))}
        <span className="text-sm ml-1">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Handshake className="h-6 w-6" />
              Bid Management & Vendor Relations
            </h2>
            <p className="text-muted-foreground mt-1">
              Comprehensive bid management, RFP processing, and vendor relationship management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Bids
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:from-[#E55A2B] hover:to-[#D04A1F] text-white"
                    onClick={() => setIsCreatingRFP(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create RFP
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Bids</CardTitle>
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{summaryStats.totalBids}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {summaryStats.pendingBids} pending review
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Bid Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(summaryStats.totalValue)}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Avg: {formatCurrency(summaryStats.avgBidValue)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Active RFPs</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{summaryStats.activeRFPs}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Responses due soon
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Vendors</CardTitle>
            <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{summaryStats.activeVendors}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Active partners
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-muted border-border">
          <TabsTrigger value="bids" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Bids
          </TabsTrigger>
          <TabsTrigger value="rfps" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            RFPs
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bids" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search bids..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="selected">Selected</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Filtered
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bids Table */}
          <Card>
            <CardHeader>
              <CardTitle>Bids ({filteredBids.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Bid Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBids.map((bid) => (
                      <TableRow key={bid.id}>
                        <TableCell className="font-medium">{bid.projectName}</TableCell>
                        <TableCell>{bid.vendorName}</TableCell>
                        <TableCell>{bid.tradeCategory}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(bid.bidAmount)}</TableCell>
                        <TableCell>{getStatusBadge(bid.status)}</TableCell>
                        <TableCell>{getRiskBadge(bid.riskLevel)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${bid.evaluationScore}%` }}
                              />
                            </div>
                            <span className="text-sm">{bid.evaluationScore}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(bid.validUntil).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setSelectedBid(bid)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rfps" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockRFPData.map((rfp) => (
              <Card key={rfp.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {rfp.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{rfp.projectName}</p>
                    </div>
                    {getRFPStatusBadge(rfp.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{rfp.tradeCategory}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {rfp.responseCount}/{rfp.bidders.length} responses
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{rfp.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Estimated Value:</span>
                      <p className="font-semibold">{formatCurrency(rfp.estimatedValue)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Due Date:</span>
                      <p className="font-medium">{new Date(rfp.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Bidders</span>
                    <div className="flex flex-wrap gap-1">
                      {rfp.bidders.slice(0, 3).map((bidder, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {bidder}
                        </Badge>
                      ))}
                      {rfp.bidders.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{rfp.bidders.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedRFP(rfp)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockVendorData.map((vendor) => (
              <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold">
                        {vendor.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-1">
                        {vendor.category.slice(0, 2).map((cat, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                      {vendor.status}
                    </Badge>
                  </div>
                  {renderStarRating(vendor.rating)}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{vendor.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{vendor.contact.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Projects:</span>
                      <p className="font-semibold">{vendor.pastProjects}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Avg Bid:</span>
                      <p className="font-semibold">{formatCurrency(vendor.avgBidAmount)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Certifications</span>
                    <div className="flex flex-wrap gap-1">
                      {vendor.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedVendor(vendor)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Award className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bid Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{summaryStats.avgEvaluationScore.toFixed(1)}</div>
                    <p className="text-muted-foreground">Average Evaluation Score</p>
                  </div>
                  <div className="space-y-3">
                    {mockBidData.map(bid => (
                      <div key={bid.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{bid.vendorName}</div>
                          <div className="text-sm text-muted-foreground">{bid.tradeCategory}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{bid.evaluationScore}</div>
                          <div className="text-sm text-muted-foreground">{formatCurrency(bid.bidAmount)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uniqueCategories.map(category => {
                    const categoryBids = mockBidData.filter(bid => bid.tradeCategory === category)
                    const categoryValue = categoryBids.reduce((sum, bid) => sum + bid.bidAmount, 0)
                    const percentage = (categoryValue / summaryStats.totalValue) * 100

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="h-2 flex-1" />
                          <span className="text-sm font-medium w-24 text-right">
                            {formatCurrency(categoryValue)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bid Detail Modal */}
      {selectedBid && (
        <Dialog open={!!selectedBid} onOpenChange={() => setSelectedBid(null)}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{selectedBid.vendorName} - {selectedBid.tradeCategory}</DialogTitle>
              <DialogDescription>
                {selectedBid.projectName} • Bid Amount: {formatCurrency(selectedBid.bidAmount)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedBid.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Evaluation Score</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Progress value={selectedBid.evaluationScore} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{selectedBid.evaluationScore}/100</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Risk Level</Label>
                    <div className="mt-1">{getRiskBadge(selectedBid.riskLevel)}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Vendor Rating</Label>
                    <div className="mt-1">{renderStarRating(selectedBid.rating)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Valid Until</Label>
                    <p className="text-sm mt-1">{new Date(selectedBid.validUntil).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Past Performance</Label>
                    <div className="text-sm mt-1 space-y-1">
                      <p>Projects: {selectedBid.pastPerformance.projectsCompleted}</p>
                      <p>On-time Delivery: {selectedBid.pastPerformance.onTimeDelivery}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBid.lineItems.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Line Items</Label>
                  <div className="mt-2 rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBid.lineItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right">{item.quantity.toLocaleString()} {item.unit}</TableCell>
                            <TableCell className="text-right">${item.unitPrice.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(item.totalPrice)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {selectedBid.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selectedBid.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedBid(null)}>Close</Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Vendor
              </Button>
              <Button>
                <CheckCircle className="h-4 w-4 mr-2" />
                Select Bid
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default BidManagement 