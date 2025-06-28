"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Plus,
  Star,
  MapPin,
  Eye,
  Edit,
  TrendingUp,
  CheckCircle,
  Award,
  Settings,
  Home,
  RefreshCw,
  Download,
  Users,
  Building,
  FileText,
  Filter
} from "lucide-react"

// Import components
import { TradePartnerScorecard } from "@/components/trade-partners/TradePartnerScorecard"
import { TradePartnerReviews } from "@/components/trade-partners/TradePartnerReviews"

// Mock data for trade partners
const mockTradePartners = [
  {
    id: "tp-001",
    companyName: "Apex Electrical Solutions",
    tradeType: "Electrical",
    primaryContact: {
      name: "John Martinez",
      title: "Project Manager",
      phone: "(555) 123-4567",
      email: "j.martinez@apexelectrical.com"
    },
    location: {
      address: "1234 Industrial Blvd",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90028"
    },
    businessInfo: {
      licenseNumber: "C-10-987654",
      insuranceExpiry: "2024-12-31",
      bondingCapacity: "$2,000,000",
      yearsInBusiness: 15,
      employeeCount: 45
    },
    performance: {
      overallRating: 4.7,
      totalProjects: 23,
      activeProjects: 3,
      completionRate: 98.5,
      onTimeDelivery: 94.2,
      budgetAdherence: 96.8,
      qualityScore: 4.8,
      safetyScore: 4.9,
      lastUpdated: "2024-01-20T10:30:00Z"
    },
    certifications: ["OSHA 30", "NECA Member", "IBEW Local 11"],
    specialties: ["High Voltage", "Industrial Controls", "Smart Building Systems"],
    status: "Active",
    tier: "Preferred",
    lastProjectDate: "2024-01-15",
    nextProjectDate: "2024-02-01"
  },
  {
    id: "tp-002", 
    companyName: "Precision Plumbing Corp",
    tradeType: "Plumbing",
    primaryContact: {
      name: "Sarah Chen",
      title: "Operations Director",
      phone: "(555) 987-6543",
      email: "s.chen@precisionplumbing.com"
    },
    location: {
      address: "5678 Commerce Way",
      city: "Irvine",
      state: "CA",
      zipCode: "92618"
    },
    businessInfo: {
      licenseNumber: "C-36-123456",
      insuranceExpiry: "2024-10-15",
      bondingCapacity: "$1,500,000",
      yearsInBusiness: 12,
      employeeCount: 28
    },
    performance: {
      overallRating: 4.3,
      totalProjects: 18,
      activeProjects: 2,
      completionRate: 94.4,
      onTimeDelivery: 88.9,
      budgetAdherence: 92.1,
      qualityScore: 4.5,
      safetyScore: 4.2,
      lastUpdated: "2024-01-18T14:20:00Z"
    },
    certifications: ["OSHA 10", "Green Plumber Certified", "Backflow Prevention"],
    specialties: ["Medical Gas Systems", "Hydronic Heating", "Water Treatment"],
    status: "Active",
    tier: "Standard",
    lastProjectDate: "2024-01-10",
    nextProjectDate: "2024-01-25"
  },
  {
    id: "tp-003",
    companyName: "Elite HVAC Systems",
    tradeType: "HVAC",
    primaryContact: {
      name: "Michael Rodriguez",
      title: "Senior Estimator",
      phone: "(555) 456-7890",
      email: "m.rodriguez@elitehvac.com"
    },
    location: {
      address: "9876 Technology Dr",
      city: "San Diego",
      state: "CA",
      zipCode: "92127"
    },
    businessInfo: {
      licenseNumber: "C-20-456789",
      insuranceExpiry: "2024-08-30",
      bondingCapacity: "$3,000,000",
      yearsInBusiness: 22,
      employeeCount: 67
    },
    performance: {
      overallRating: 4.9,
      totalProjects: 35,
      activeProjects: 5,
      completionRate: 99.1,
      onTimeDelivery: 97.3,
      budgetAdherence: 98.7,
      qualityScore: 4.9,
      safetyScore: 5.0,
      lastUpdated: "2024-01-19T16:45:00Z"
    },
    certifications: ["NATE Certified", "OSHA 30", "EPA 608", "LEED AP"],
    specialties: ["Variable Refrigerant Flow", "Building Automation", "Energy Recovery"],
    status: "Active",
    tier: "Premier",
    lastProjectDate: "2024-01-20",
    nextProjectDate: "2024-01-28"
  },
  {
    id: "tp-004",
    companyName: "Foundation Masters Inc",
    tradeType: "Concrete",
    primaryContact: {
      name: "David Kim",
      title: "Project Coordinator",
      phone: "(555) 234-5678",
      email: "d.kim@foundationmasters.com"
    },
    location: {
      address: "2468 Industrial Ave",
      city: "Riverside",
      state: "CA",
      zipCode: "92505"
    },
    businessInfo: {
      licenseNumber: "C-8-789012",
      insuranceExpiry: "2024-11-20",
      bondingCapacity: "$2,500,000",
      yearsInBusiness: 18,
      employeeCount: 52
    },
    performance: {
      overallRating: 4.1,
      totalProjects: 29,
      activeProjects: 4,
      completionRate: 91.4,
      onTimeDelivery: 85.2,
      budgetAdherence: 89.6,
      qualityScore: 4.3,
      safetyScore: 4.0,
      lastUpdated: "2024-01-17T11:15:00Z"
    },
    certifications: ["ACI Certified", "OSHA 10", "Concrete Finisher"],
    specialties: ["Post-Tension Slabs", "Structural Concrete", "Decorative Finishes"],
    status: "Under Review",
    tier: "Standard",
    lastProjectDate: "2024-01-05",
    nextProjectDate: "2024-02-10"
  }
]

const tradeTypes = ["All", "Electrical", "Plumbing", "HVAC", "Concrete", "Roofing", "Drywall", "Flooring", "Painting"]
const tierTypes = ["All", "Premier", "Preferred", "Standard", "Probationary"]
const statusTypes = ["All", "Active", "Under Review", "Inactive", "Suspended"]

export default function TradePartnersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("database")
  const [selectedPartner, setSelectedPartner] = useState<any>(null)
  const [showScorecardModal, setShowScorecardModal] = useState(false)
  const [showReviewsModal, setShowReviewsModal] = useState(false)
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false)
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTrade, setFilterTrade] = useState("All")
  const [filterTier, setFilterTier] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [sortBy, setSortBy] = useState("rating")
  const [sortOrder, setSortOrder] = useState("desc")

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLoading(false)
    }
    loadData()
  }, [])

  // Filtered and sorted partners
  const filteredPartners = useMemo(() => {
    let filtered = mockTradePartners.filter(partner => {
      const matchesSearch = partner.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           partner.tradeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           partner.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           partner.primaryContact.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTrade = filterTrade === "All" || partner.tradeType === filterTrade
      const matchesTier = filterTier === "All" || partner.tier === filterTier
      const matchesStatus = filterStatus === "All" || partner.status === filterStatus
      
      return matchesSearch && matchesTrade && matchesTier && matchesStatus
    })

    // Sort partners
    filtered.sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "rating":
          aValue = a.performance.overallRating
          bValue = b.performance.overallRating
          break
        case "name":
          aValue = a.companyName
          bValue = b.companyName
          break
        case "projects":
          aValue = a.performance.totalProjects
          bValue = b.performance.totalProjects
          break
        case "completion":
          aValue = a.performance.completionRate
          bValue = b.performance.completionRate
          break
        default:
          return 0
      }

      if (typeof aValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    })

    return filtered
  }, [searchTerm, filterTrade, filterTier, filterStatus, sortBy, sortOrder])

  const openScorecard = useCallback((partner: any) => {
    setSelectedPartner(partner)
    setShowScorecardModal(true)
  }, [])

  const openReviews = useCallback((partner: any) => {
    setSelectedPartner(partner)
    setShowReviewsModal(true)
  }, [])

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Premier":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "Preferred":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Standard":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "Probationary":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "Inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
      case "Suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  // Get role-specific scope
  const getProjectScope = () => {
    if (!user) return { scope: "all", partnerCount: 0, description: "All Partners" }
    
    switch (user.role) {
      case "project-manager":
        return { 
          scope: "single", 
          partnerCount: 12, 
          description: "Project Partners"
        }
      case "project-executive":
        return { 
          scope: "portfolio", 
          partnerCount: 28, 
          description: "Portfolio Partners"
        }
      default:
        return { 
          scope: "enterprise", 
          partnerCount: mockTradePartners.length, 
          description: "Enterprise Database"
        }
    }
  }

  const projectScope = getProjectScope()

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Trade partners data has been updated",
      })
    }, 1000)
  }

  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Trade partners data is being exported",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003087] mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading trade partners database...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <AppHeader />
      <div className="space-y-6 p-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Trade Partners Database</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Trade Partners Database</h1>
              <p className="text-muted-foreground mt-1">Comprehensive subcontractor and vendor management system</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="px-3 py-1">
                  {projectScope.description}
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  {mockTradePartners.length} Total Partners
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                onClick={() => setShowAddPartnerModal(true)}
                className="bg-[#FF6B35] hover:bg-[#E55A2B]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Partner
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-[#003087]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#003087] dark:text-white">
                  {mockTradePartners.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12% this quarter
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {mockTradePartners.filter(p => p.status === "Active").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Ready for projects
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#FF6B35]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#FF6B35]">
                  {(mockTradePartners.reduce((sum, p) => sum + p.performance.overallRating, 0) / mockTradePartners.length).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <Star className="h-3 w-3 inline mr-1" />
                  Out of 5.0 stars
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Premier Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {mockTradePartners.filter(p => p.tier === "Premier").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <Award className="h-3 w-3 inline mr-1" />
                  Top performers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trade Partner Insights Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              HBI Trade Partner Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Performance Trends</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Overall Rating Trend</span>
                    <span className="text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +0.3 this quarter
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>On-Time Performance</span>
                    <span className="text-green-600">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Safety Score</span>
                    <span className="text-blue-600">4.6/5.0</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Recommendations</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Consider promoting 2 Standard partners to Preferred tier</p>
                  <p>• Review partnerships with 1 under-performing partner</p>
                  <p>• Schedule quarterly reviews for 5 partners</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Performance Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Review Partner Contracts
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Trade Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="database">Database</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              {/* Database Tab */}
              <TabsContent value="database" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search partners..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <select
                        value={filterTrade}
                        onChange={(e) => setFilterTrade(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background"
                      >
                        {tradeTypes.map(trade => (
                          <option key={trade} value={trade}>{trade} Trade</option>
                        ))}
                      </select>
                      <select
                        value={filterTier}
                        onChange={(e) => setFilterTier(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background"
                      >
                        {tierTypes.map(tier => (
                          <option key={tier} value={tier}>{tier} Tier</option>
                        ))}
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background"
                      >
                        {statusTypes.map(status => (
                          <option key={status} value={status}>{status} Status</option>
                        ))}
                      </select>
                      <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                          const [sort, order] = e.target.value.split('-')
                          setSortBy(sort)
                          setSortOrder(order)
                        }}
                        className="px-3 py-2 border rounded-md bg-background"
                      >
                        <option value="rating-desc">Rating (High to Low)</option>
                        <option value="rating-asc">Rating (Low to High)</option>
                        <option value="name-asc">Name (A to Z)</option>
                        <option value="name-desc">Name (Z to A)</option>
                        <option value="projects-desc">Projects (Most)</option>
                        <option value="completion-desc">Completion Rate</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Partners Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Trade</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Projects</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPartners.map((partner) => (
                        <TableRow key={partner.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-[#003087] text-white text-xs">
                                  {partner.companyName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{partner.companyName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {partner.primaryContact.name}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{partner.tradeType}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{partner.location.city}, {partner.location.state}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(partner.performance.overallRating)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium">
                                {partner.performance.overallRating}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{partner.performance.totalProjects}</div>
                              <div className="text-xs text-muted-foreground">
                                {partner.performance.activeProjects} active
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getStatusColor(partner.status)}>
                              {partner.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getTierColor(partner.tier)}>
                              {partner.tier}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openScorecard(partner)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openReviews(partner)}
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#003087] dark:text-white">Performance Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {tradeTypes.slice(1).map(trade => {
                          const tradePartners = mockTradePartners.filter(p => p.tradeType === trade)
                          const avgRating = tradePartners.length > 0 
                            ? tradePartners.reduce((sum, p) => sum + p.performance.overallRating, 0) / tradePartners.length 
                            : 0
                          return (
                            <div key={trade} className="flex items-center justify-between">
                              <span className="text-sm font-medium">{trade}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={avgRating * 20} className="w-20" />
                                <span className="text-sm">{avgRating.toFixed(1)}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#003087] dark:text-white">Tier Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {tierTypes.slice(1).map(tier => {
                          const count = mockTradePartners.filter(p => p.tier === tier).length
                          const percentage = (count / mockTradePartners.length) * 100
                          return (
                            <div key={tier} className="flex items-center justify-between">
                              <span className="text-sm font-medium">{tier}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={percentage} className="w-20" />
                                <span className="text-sm">{count}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#003087] dark:text-white">Performance Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Comprehensive performance analysis across all trade partners
                      </p>
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#003087] dark:text-white">Compliance Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        License, insurance, and certification status summary
                      </p>
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#003087] dark:text-white">Vendor Directory</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Complete contact directory for all trade partners
                      </p>
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Scorecard Modal */}
        {selectedPartner && (
          <Dialog open={showScorecardModal} onOpenChange={setShowScorecardModal}>
            <DialogContent className="w-[80vw] max-w-none max-h-[90vh] overflow-y-auto" style={{ zIndex: 9999 }}>
              <div style={{ zIndex: 9999 }}>
                <DialogHeader>
                  <DialogTitle className="text-[#003087] dark:text-white">
                    {selectedPartner.companyName} - Performance Scorecard
                  </DialogTitle>
                </DialogHeader>
                <TradePartnerScorecard partner={selectedPartner} />
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Reviews Modal */}
        {selectedPartner && (
          <Dialog open={showReviewsModal} onOpenChange={setShowReviewsModal}>
            <DialogContent className="w-[70vw] max-w-none max-h-[90vh] overflow-y-auto" style={{ zIndex: 9999 }}>
              <div style={{ zIndex: 9999 }}>
                <DialogHeader>
                  <DialogTitle className="text-[#003087] dark:text-white">
                    {selectedPartner.companyName} - Reviews & Ratings
                  </DialogTitle>
                </DialogHeader>
                <TradePartnerReviews partner={selectedPartner} />
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Add Partner Modal */}
        {showAddPartnerModal && (
          <Dialog open={showAddPartnerModal} onOpenChange={setShowAddPartnerModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-[#003087] dark:text-white">Add New Trade Partner</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Company Name</label>
                    <Input placeholder="Enter company name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Trade Type</label>
                    <select className="w-full px-3 py-2 border rounded-md bg-background">
                      {tradeTypes.slice(1).map(trade => (
                        <option key={trade} value={trade}>{trade}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Primary Contact</label>
                    <Input placeholder="Contact name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="Phone number" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input placeholder="Email address" />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowAddPartnerModal(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white">
                    Add Partner
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  )
} 