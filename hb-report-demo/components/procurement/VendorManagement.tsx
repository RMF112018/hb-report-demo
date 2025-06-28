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
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Star,
  Award,
  TrendingUp,
  TrendingDown,
  Calendar,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  Activity,
  Shield,
  Target
} from "lucide-react"

interface VendorManagementProps {
  userRole: string
  dataScope: any
  summaryMetrics: any
}

interface Vendor {
  id: string
  name: string
  category: string
  contact: {
    name: string
    title: string
    email: string
    phone: string
  }
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  rating: number
  performance: {
    onTimeDelivery: number
    qualityScore: number
    safetyRecord: number
    customerSatisfaction: number
  }
  financial: {
    totalContracts: number
    activeContracts: number
    totalValue: number
    averageProjectSize: number
  }
  certifications: string[]
  lastActivity: string
  status: string
  projects: Array<{
    id: string
    name: string
    value: number
    status: string
    startDate: string
    endDate: string
  }>
}

export function VendorManagement({ userRole, dataScope, summaryMetrics }: VendorManagementProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [showVendorModal, setShowVendorModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      // Generate comprehensive vendor data
      const mockVendors: Vendor[] = [
        {
          id: "v001",
          name: "ABC Construction Co.",
          category: "Structural",
          contact: {
            name: "John Smith",
            title: "Project Manager",
            email: "john.smith@abcconstruction.com",
            phone: "(555) 123-4567"
          },
          address: {
            street: "123 Construction Blvd",
            city: "Miami",
            state: "FL",
            zip: "33101"
          },
          rating: 4.8,
          performance: {
            onTimeDelivery: 95,
            qualityScore: 92,
            safetyRecord: 98,
            customerSatisfaction: 4.7
          },
          financial: {
            totalContracts: 24,
            activeContracts: 3,
            totalValue: 15400000,
            averageProjectSize: 641666
          },
          certifications: ["OSHA 30", "LEED AP", "DBE Certified"],
          lastActivity: "2024-12-20",
          status: "active",
          projects: [
            { id: "p001", name: "Palm Beach Estate", value: 2800000, status: "active", startDate: "2024-01-15", endDate: "2024-06-30" },
            { id: "p002", name: "Corporate Tower", value: 4200000, status: "completed", startDate: "2023-08-01", endDate: "2024-02-15" }
          ]
        },
        {
          id: "v002", 
          name: "BuildRight Inc.",
          category: "MEP",
          contact: {
            name: "Sarah Johnson",
            title: "Business Development",
            email: "sarah.j@buildright.com",
            phone: "(555) 234-5678"
          },
          address: {
            street: "456 Industrial Way",
            city: "Fort Lauderdale",
            state: "FL",
            zip: "33301"
          },
          rating: 4.6,
          performance: {
            onTimeDelivery: 92,
            qualityScore: 89,
            safetyRecord: 94,
            customerSatisfaction: 4.5
          },
          financial: {
            totalContracts: 18,
            activeContracts: 2,
            totalValue: 8900000,
            averageProjectSize: 494444
          },
          certifications: ["EPA Certified", "NECA Member"],
          lastActivity: "2024-12-19",
          status: "active",
          projects: [
            { id: "p003", name: "Healthcare Facility", value: 1900000, status: "active", startDate: "2024-03-01", endDate: "2024-08-15" }
          ]
        },
        {
          id: "v003",
          name: "XYZ Contractors LLC",
          category: "Finishes",
          contact: {
            name: "Mike Rodriguez",
            title: "Owner",
            email: "mike@xyzcontractors.com",
            phone: "(555) 345-6789"
          },
          address: {
            street: "789 Business Park Dr",
            city: "West Palm Beach",
            state: "FL",
            zip: "33401"
          },
          rating: 4.4,
          performance: {
            onTimeDelivery: 88,
            qualityScore: 91,
            safetyRecord: 89,
            customerSatisfaction: 4.3
          },
          financial: {
            totalContracts: 31,
            activeContracts: 4,
            totalValue: 12300000,
            averageProjectSize: 396774
          },
          certifications: ["MBE Certified", "State Licensed"],
          lastActivity: "2024-12-18",
          status: "active",
          projects: [
            { id: "p004", name: "Retail Plaza", value: 850000, status: "bidding", startDate: "2024-04-01", endDate: "2024-09-30" }
          ]
        },
        {
          id: "v004",
          name: "Elite Builders Group",
          category: "Site Work",
          contact: {
            name: "David Chen",
            title: "Operations Manager",
            email: "d.chen@elitebuilders.com",
            phone: "(555) 456-7890"
          },
          address: {
            street: "321 Commerce Blvd",
            city: "Boca Raton",
            state: "FL",
            zip: "33431"
          },
          rating: 4.2,
          performance: {
            onTimeDelivery: 90,
            qualityScore: 87,
            safetyRecord: 92,
            customerSatisfaction: 4.1
          },
          financial: {
            totalContracts: 12,
            activeContracts: 1,
            totalValue: 5600000,
            averageProjectSize: 466666
          },
          certifications: ["Utility Certified", "Environmental Compliance"],
          lastActivity: "2024-12-17",
          status: "active",
          projects: []
        },
        {
          id: "v005",
          name: "Pro Construction Services",
          category: "Specialty",
          contact: {
            name: "Lisa Thompson",
            title: "Account Manager",
            email: "lisa@proconstruction.com",
            phone: "(555) 567-8901"
          },
          address: {
            street: "654 Professional Way",
            city: "Delray Beach", 
            state: "FL",
            zip: "33444"
          },
          rating: 4.0,
          performance: {
            onTimeDelivery: 85,
            qualityScore: 83,
            safetyRecord: 88,
            customerSatisfaction: 3.9
          },
          financial: {
            totalContracts: 16,
            activeContracts: 2,
            totalValue: 7200000,
            averageProjectSize: 450000
          },
          certifications: ["Specialty Trade License"],
          lastActivity: "2024-12-16",
          status: "review",
          projects: []
        }
      ]

      setVendors(mockVendors)
      setFilteredVendors(mockVendors)
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter vendors based on search and filters
  useEffect(() => {
    let filtered = vendors

    if (searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(vendor => vendor.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(vendor => vendor.status === statusFilter)
    }

    setFilteredVendors(filtered)
  }, [vendors, searchTerm, categoryFilter, statusFilter])

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
      review: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Under Review" },
      inactive: { color: "bg-gray-100 text-gray-800 border-gray-200", label: "Inactive" },
      suspended: { color: "bg-red-100 text-red-800 border-red-200", label: "Suspended" }
    }
    const config = statusConfig[status] || statusConfig.active
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 text-yellow-400" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const vendorStats = useMemo(() => {
    return {
      totalVendors: filteredVendors.length,
      averageRating: filteredVendors.reduce((sum, v) => sum + v.rating, 0) / filteredVendors.length || 0,
      totalValue: filteredVendors.reduce((sum, v) => sum + v.financial.totalValue, 0),
      activeContracts: filteredVendors.reduce((sum, v) => sum + v.financial.activeContracts, 0),
      topPerformers: filteredVendors.filter(v => v.rating >= 4.5).length
    }
  }, [filteredVendors])

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
      {/* Vendor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Vendors</p>
                <p className="text-2xl font-bold text-blue-900">{vendorStats.totalVendors}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Avg Rating</p>
                <p className="text-2xl font-bold text-green-900">{vendorStats.averageRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Value</p>
                <p className="text-xl font-bold text-orange-900">{formatCurrency(vendorStats.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Contracts</p>
                <p className="text-2xl font-bold text-purple-900">{vendorStats.activeContracts}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-rose-600">Top Performers</p>
                <p className="text-2xl font-bold text-rose-900">{vendorStats.topPerformers}</p>
              </div>
              <Award className="h-8 w-8 text-rose-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#FF6B35]" />
              Vendor Directory
            </CardTitle>
            
            {dataScope.canCreate && (
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-[#FF6B35] hover:bg-[#E55A2B]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
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
                placeholder="Search vendors, contacts, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Structural">Structural</SelectItem>
                <SelectItem value="MEP">MEP</SelectItem>
                <SelectItem value="Finishes">Finishes</SelectItem>
                <SelectItem value="Site Work">Site Work</SelectItem>
                <SelectItem value="Specialty">Specialty</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vendors Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Vendor / Contact</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead>Active Contracts</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-gray-500">
                          {vendor.contact.name} • {vendor.contact.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{vendor.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex">{getRatingStars(vendor.rating)}</div>
                        <span className="text-sm">{vendor.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className={`font-medium ${getPerformanceColor(vendor.performance.onTimeDelivery)}`}>
                          {vendor.performance.onTimeDelivery}% On-Time
                        </div>
                        <div className="text-gray-500">
                          Quality: {vendor.performance.qualityScore}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium">{formatCurrency(vendor.financial.totalValue)}</div>
                        <div className="text-sm text-gray-500">{vendor.financial.totalContracts} contracts</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{vendor.financial.activeContracts}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(vendor.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedVendor(vendor)
                            setShowVendorModal(true)
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

          {filteredVendors.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No vendors found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <Dialog open={showVendorModal} onOpenChange={setShowVendorModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#FF6B35]" />
                {selectedVendor.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Vendor Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-2">{getRatingStars(selectedVendor.rating)}</div>
                    <p className="text-2xl font-bold">{selectedVendor.rating}</p>
                    <p className="text-sm text-gray-500">Overall Rating</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedVendor.performance.onTimeDelivery}%</p>
                    <p className="text-sm text-gray-500">On-Time Delivery</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{formatCurrency(selectedVendor.financial.totalValue)}</p>
                    <p className="text-sm text-gray-500">Total Contract Value</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{selectedVendor.financial.activeContracts}</p>
                    <p className="text-sm text-gray-500">Active Contracts</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact & Company Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Primary Contact</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{selectedVendor.contact.name} - {selectedVendor.contact.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{selectedVendor.contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{selectedVendor.contact.phone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Address</h4>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <div>{selectedVendor.address.street}</div>
                          <div>{selectedVendor.address.city}, {selectedVendor.address.state} {selectedVendor.address.zip}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVendor.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">On-Time Delivery</span>
                        <span className="text-sm font-medium">{selectedVendor.performance.onTimeDelivery}%</span>
                      </div>
                      <Progress value={selectedVendor.performance.onTimeDelivery} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Quality Score</span>
                        <span className="text-sm font-medium">{selectedVendor.performance.qualityScore}%</span>
                      </div>
                      <Progress value={selectedVendor.performance.qualityScore} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Safety Record</span>
                        <span className="text-sm font-medium">{selectedVendor.performance.safetyRecord}%</span>
                      </div>
                      <Progress value={selectedVendor.performance.safetyRecord} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Customer Satisfaction</span>
                        <span className="text-sm font-medium">{selectedVendor.performance.customerSatisfaction}/5.0</span>
                      </div>
                      <Progress value={(selectedVendor.performance.customerSatisfaction / 5) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Projects & Financial Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedVendor.projects.length > 0 ? (
                      <div className="space-y-3">
                        {selectedVendor.projects.map((project) => (
                          <div key={project.id} className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{project.name}</div>
                              <div className="text-sm text-gray-500">{project.startDate} - {project.endDate}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(project.value)}</div>
                              {getStatusBadge(project.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No recent projects found
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Financial Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold">{selectedVendor.financial.totalContracts}</div>
                        <div className="text-sm text-gray-500">Total Contracts</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold">{selectedVendor.financial.activeContracts}</div>
                        <div className="text-sm text-gray-500">Active Contracts</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Contract Value:</span>
                        <span className="font-medium">{formatCurrency(selectedVendor.financial.totalValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Project Size:</span>
                        <span className="font-medium">{formatCurrency(selectedVendor.financial.averageProjectSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Activity:</span>
                        <span className="font-medium">{selectedVendor.lastActivity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Vendor Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#FF6B35]" />
              Add New Vendor
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Company Name</label>
                <Input placeholder="Enter company name" />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="structural">Structural</SelectItem>
                    <SelectItem value="mep">MEP</SelectItem>
                    <SelectItem value="finishes">Finishes</SelectItem>
                    <SelectItem value="sitework">Site Work</SelectItem>
                    <SelectItem value="specialty">Specialty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Contact Name</label>
                <Input placeholder="Primary contact name" />
              </div>
              <div>
                <label className="text-sm font-medium">Contact Email</label>
                <Input placeholder="contact@company.com" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input placeholder="(555) 123-4567" />
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>
              <Textarea placeholder="Company address..." />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                Add Vendor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 