"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Package, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Scale,
  Target,
  Zap,
  Activity,
  Calendar,
  Truck,
  Star,
  Award,
  Shield
} from "lucide-react"

// Import comprehensive procurement components
import { ProcurementOverview } from "@/components/procurement/ProcurementOverview"
import { BuyoutManagement } from "@/components/procurement/BuyoutManagement"
import { VendorManagement } from "@/components/procurement/VendorManagement"
import { ProcurementAnalytics } from "@/components/procurement/ProcurementAnalytics"
import { BidComparison } from "@/components/procurement/BidComparison"
import { ContractTracking } from "@/components/procurement/ContractTracking"

export default function ProcurementPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)

  // Role-based access control
  const userRole = user?.role || "project-manager"
  
  // Get role-specific data scope
  const getDataScope = () => {
    switch (userRole) {
      case "executive":
        return {
          scope: "enterprise",
          projectCount: 15,
          description: "Enterprise View - All Projects",
          canCreate: true,
          canApprove: true,
          canEdit: true
        }
      case "project-executive":
        return {
          scope: "portfolio",
          projectCount: 6,
          description: "Portfolio View - 6 Projects",
          canCreate: true,
          canApprove: true,
          canEdit: true
        }
      case "project-manager":
        return {
          scope: "single",
          projectCount: 1,
          description: "Single Project View",
          canCreate: true,
          canApprove: false,
          canEdit: true
        }
      default:
        return {
          scope: "limited",
          projectCount: 1,
          description: "Limited View",
          canCreate: false,
          canApprove: false,
          canEdit: false
        }
    }
  }

  const dataScope = getDataScope()

  // Simulated loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  // Define procurement modules based on role
  const procurementModules = useMemo(() => {
    const baseModules = [
      {
        id: "overview",
        label: "Overview",
        icon: BarChart3,
        description: "Comprehensive procurement dashboard with key metrics",
        component: ProcurementOverview,
        requiredRoles: ["project-manager", "project-executive", "executive", "admin"]
      },
      {
        id: "buyouts",
        label: "Buyout Management",
        icon: Package,
        description: "Subcontractor buyout tracking and management",
        component: BuyoutManagement,
        requiredRoles: ["project-manager", "project-executive", "executive", "admin"]
      },
      {
        id: "vendors",
        label: "Vendor Management",
        icon: Building2,
        description: "Vendor relationships and performance tracking",
        component: VendorManagement,
        requiredRoles: ["project-manager", "project-executive", "executive", "admin"]
      },
      {
        id: "bid-comparison",
        label: "Bid Comparison",
        icon: Scale,
        description: "Advanced bid analysis and comparison tools",
        component: BidComparison,
        requiredRoles: ["project-manager", "project-executive", "executive"]
      },
      {
        id: "contracts",
        label: "Contract Tracking",
        icon: FileText,
        description: "Contract status and compliance monitoring",
        component: ContractTracking,
        requiredRoles: ["project-executive", "executive", "admin"]
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: PieChart,
        description: "Advanced procurement analytics and insights",
        component: ProcurementAnalytics,
        requiredRoles: ["project-executive", "executive", "admin"]
      }
    ]

    // Filter modules based on user role
    return baseModules.filter(module => 
      !module.requiredRoles || module.requiredRoles.includes(userRole)
    )
  }, [userRole])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get role-specific summary metrics
  const getSummaryMetrics = () => {
    switch (dataScope.scope) {
      case "enterprise":
        return {
          totalProcurementValue: 145280000,
          activeBuyouts: 342,
          pendingContracts: 28,
          avgSavings: 8.2,
          vendorCount: 156,
          completedBuyouts: 89
        }
      case "portfolio":
        return {
          totalProcurementValue: 85640000,
          activeBuyouts: 187,
          pendingContracts: 15,
          avgSavings: 7.8,
          vendorCount: 94,
          completedBuyouts: 67
        }
      case "single":
        return {
          totalProcurementValue: 24850000,
          activeBuyouts: 45,
          pendingContracts: 6,
          avgSavings: 6.5,
          vendorCount: 28,
          completedBuyouts: 23
        }
      default:
        return {
          totalProcurementValue: 0,
          activeBuyouts: 0,
          pendingContracts: 0,
          avgSavings: 0,
          vendorCount: 0,
          completedBuyouts: 0
        }
    }
  }

  const summaryMetrics = getSummaryMetrics()

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-lg font-medium text-gray-600">Loading Procurement Dashboard...</div>
            <div className="text-sm text-gray-500">Gathering procurement data and analytics</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* App Header */}
      <AppHeader />
      
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] rounded-lg shadow-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  Procurement Management
                </h1>
              </div>
              <p className="text-gray-600">
                {dataScope.description} • Subcontractor buyout and vendor management
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1">
                <Users className="h-4 w-4 mr-2" />
                {user?.firstName} {user?.lastName}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-800">
                <Building2 className="h-4 w-4 mr-2" />
                {dataScope.projectCount} Project{dataScope.projectCount !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Value</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(summaryMetrics.totalProcurementValue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Buyouts</p>
                  <p className="text-2xl font-bold text-green-900">{summaryMetrics.activeBuyouts}</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Pending Contracts</p>
                  <p className="text-2xl font-bold text-orange-900">{summaryMetrics.pendingContracts}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg Savings</p>
                  <p className="text-2xl font-bold text-purple-900">{summaryMetrics.avgSavings}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-rose-600">Vendors</p>
                  <p className="text-2xl font-bold text-rose-900">{summaryMetrics.vendorCount}</p>
                </div>
                <Building2 className="h-8 w-8 text-rose-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-600">Completed</p>
                  <p className="text-2xl font-bold text-teal-900">{summaryMetrics.completedBuyouts}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className="border-0 shadow-xl bg-background/80 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border-b">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-background shadow-sm">
                {procurementModules.map((module) => (
                  <TabsTrigger 
                    key={module.id} 
                    value={module.id} 
                    className="flex items-center gap-2 data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white transition-all duration-200"
                  >
                    <module.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{module.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </CardHeader>

            <CardContent className="p-0">
              {procurementModules.map((module) => (
                <TabsContent key={module.id} value={module.id} className="mt-0">
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <module.icon className="h-5 w-5 text-[#FF6B35]" />
                        {module.label}
                      </h2>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                    
                    <module.component 
                      userRole={userRole}
                      dataScope={dataScope}
                      summaryMetrics={summaryMetrics}
                    />
                  </div>
                </TabsContent>
              ))}
            </CardContent>
          </Tabs>
        </Card>

        {/* Help & Support Section */}
        <Card className="mt-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">Procurement Management Help</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Access comprehensive tools for managing subcontractor buyouts, vendor relationships, and procurement analytics.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    Subcontractor Buyouts
                  </Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    Vendor Performance
                  </Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    Bid Analysis
                  </Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    Contract Tracking
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 