"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calculator, FileText, TrendingUp, Clock, Users, Building, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { RFPManagement } from "@/components/estimating/rfp-management"
import { PreConMetrics } from "@/components/precon/precon-metrics"
import { ActiveProjects } from "@/components/precon/active-projects"
import { UpcomingDeadlines } from "@/components/precon/upcoming-deadlines"

/**
 * PreConDashboard Component - Complete Pre-Construction Management System
 *
 * A comprehensive pre-construction dashboard that provides an overview of all pre-construction
 * activities with integrated RFP management, performance metrics, active projects tracking,
 * and upcoming deadlines monitoring. This component serves as the central hub for
 * pre-construction teams with real-time tracking, analytics, and comprehensive project management.
 *
 * Features:
 * - Integrated RFP Management with searchable table and sync functionality
 * - Performance Overview with detailed metrics and time frame analysis
 * - Active Projects tracking with deadline urgency indicators
 * - Upcoming Deadlines monitoring with status-based prioritization
 * - Role-based personalized greeting for estimators
 * - Quick access to new estimate creation and project navigation
 * - Real-time filtering, selection, and status updates
 * - Comprehensive analytics with time-based filtering
 * - Responsive design that works on all screen sizes
 * - Mock data integration for development and testing
 *
 * @returns {JSX.Element} The complete pre-construction dashboard interface with full functionality
 */

// TypeScript Interfaces for Type Safety and Future Development
interface User {
  id: string
  firstName: string
  lastName: string
  role: "c-suite" | "project-executive" | "project-manager" | "estimator" | "admin" | "field-supervisor" | "accountant"
  email: string
  company: string
}

interface RFP {
  id: string
  projectName: string
  client: string
  status: "active" | "submitted" | "awarded" | "lost"
  dateReceived: Date
  dueDate: Date
  estimatedValue: number
  location: string
  projectType: "commercial" | "residential" | "industrial" | "infrastructure"
  priority?: "low" | "medium" | "high" | "critical"
  assignedEstimator?: string
  completionPercentage?: number
}

/**
 * EstimateMetrics Interface
 *
 * Comprehensive metrics interface for tracking pre-construction performance
 * across different time periods and key performance indicators.
 */
interface EstimateMetrics {
  totalEstimates: number
  estimatesLastYear: number
  estimatesThisYear: number
  estimatesThisQuarter: number
  estimatesThisMonth: number
  winRate: number
  totalAwarded: number
  totalSubmitted: number
  averageEstimateValue: number
  averageSubcontractorParticipation: number
}

/**
 * PreConProject Interface
 *
 * Comprehensive interface for tracking active pre-construction projects
 * including all relevant project details and status information.
 */
interface PreConProject {
  id: string
  name: string
  client: string
  status: "active" | "awarded" | "lost" | "submitted" | "in-progress"
  estimateDeadline: Date
  submissionDate?: Date
  awardDate?: Date
  estimator: string
  trades: string[]
  subcontractorCount: number
  participationByTrade: Record<string, number>
  createdAt: Date
  updatedAt: Date
  estimatedValue: number
  projectType: string
}

/**
 * UpcomingDeadline Interface
 *
 * Interface for tracking upcoming project deadlines with
 * priority status and assignment information.
 */
interface UpcomingDeadline {
  id: string
  projectName: string
  client: string
  deadline: Date
  daysRemaining: number
  estimator: string
  status: "urgent" | "warning" | "normal"
}

interface TradeParticipation {
  trade: string
  activeRFPs: number
  responseRate: number
  averageBidValue: number
  topContractors: string[]
}

/**
 * Mock RFP Data for Development and Testing
 *
 * This mock data represents various RFP scenarios including different statuses,
 * project types, and value ranges to test the RFP management functionality.
 */
const mockRFPs: RFP[] = [
  {
    id: "rfp-001",
    projectName: "Downtown Office Complex",
    client: "Metro Development Corp",
    status: "active",
    dateReceived: new Date("2024-01-15"),
    dueDate: new Date("2024-02-15"),
    estimatedValue: 12500000,
    location: "Seattle, WA",
    projectType: "commercial",
    priority: "high",
    assignedEstimator: "John Smith",
    completionPercentage: 65,
  },
  {
    id: "rfp-002",
    projectName: "Residential Tower Phase 2",
    client: "Urban Living LLC",
    status: "submitted",
    dateReceived: new Date("2024-01-10"),
    dueDate: new Date("2024-02-01"),
    estimatedValue: 8750000,
    location: "Portland, OR",
    projectType: "residential",
    priority: "medium",
    assignedEstimator: "Sarah Johnson",
    completionPercentage: 100,
  },
  {
    id: "rfp-003",
    projectName: "Manufacturing Facility Expansion",
    client: "TechCorp Industries",
    status: "awarded",
    dateReceived: new Date("2023-12-20"),
    dueDate: new Date("2024-01-20"),
    estimatedValue: 15200000,
    location: "Tacoma, WA",
    projectType: "industrial",
    priority: "critical",
    assignedEstimator: "Mike Davis",
    completionPercentage: 100,
  },
  {
    id: "rfp-004",
    projectName: "Community Health Center",
    client: "City of Bellevue",
    status: "lost",
    dateReceived: new Date("2023-12-15"),
    dueDate: new Date("2024-01-15"),
    estimatedValue: 6800000,
    location: "Bellevue, WA",
    projectType: "commercial",
    priority: "medium",
    assignedEstimator: "Lisa Chen",
    completionPercentage: 100,
  },
  {
    id: "rfp-005",
    projectName: "Highway Bridge Replacement",
    client: "Washington State DOT",
    status: "active",
    dateReceived: new Date("2024-01-20"),
    dueDate: new Date("2024-03-01"),
    estimatedValue: 22000000,
    location: "Spokane, WA",
    projectType: "infrastructure",
    priority: "critical",
    assignedEstimator: "Robert Wilson",
    completionPercentage: 25,
  },
  {
    id: "rfp-006",
    projectName: "Luxury Condominiums",
    client: "Premier Properties",
    status: "active",
    dateReceived: new Date("2024-01-25"),
    dueDate: new Date("2024-02-25"),
    estimatedValue: 18500000,
    location: "Vancouver, WA",
    projectType: "residential",
    priority: "high",
    assignedEstimator: "Emily Rodriguez",
    completionPercentage: 40,
  },
]

/**
 * Mock Estimate Metrics Data for Development and Testing
 *
 * Comprehensive performance metrics covering different time periods and KPIs
 * to demonstrate the performance overview functionality.
 */
const mockEstimateMetrics: EstimateMetrics = {
  totalEstimates: 127,
  estimatesLastYear: 89,
  estimatesThisYear: 38,
  estimatesThisQuarter: 15,
  estimatesThisMonth: 6,
  winRate: 68.5,
  totalAwarded: 37,
  totalSubmitted: 54,
  averageEstimateValue: 14750000,
  averageSubcontractorParticipation: 12,
}

/**
 * Mock Active Projects Data for Development and Testing
 *
 * Representative active projects in various stages with different
 * deadlines, values, and complexity levels.
 */
const mockActiveProjects: PreConProject[] = [
  {
    id: "proj-001",
    name: "Downtown Office Complex",
    client: "Metro Development Corp",
    status: "active",
    estimateDeadline: new Date("2024-02-15"),
    estimator: "John Smith",
    trades: ["Electrical", "Plumbing", "HVAC", "Structural", "Concrete"],
    subcontractorCount: 8,
    participationByTrade: {
      Electrical: 3,
      Plumbing: 2,
      HVAC: 2,
      Structural: 1,
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-28"),
    estimatedValue: 12500000,
    projectType: "Commercial Office",
  },
  {
    id: "proj-002",
    name: "Highway Bridge Replacement",
    client: "Washington State DOT",
    status: "active",
    estimateDeadline: new Date("2024-02-08"),
    estimator: "Robert Wilson",
    trades: ["Structural", "Concrete", "Earthwork", "Utilities"],
    subcontractorCount: 6,
    participationByTrade: {
      Structural: 2,
      Concrete: 2,
      Earthwork: 1,
      Utilities: 1,
    },
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-29"),
    estimatedValue: 22000000,
    projectType: "Infrastructure",
  },
  {
    id: "proj-003",
    name: "Luxury Condominiums",
    client: "Premier Properties",
    status: "active",
    estimateDeadline: new Date("2024-02-20"),
    estimator: "Emily Rodriguez",
    trades: ["Electrical", "Plumbing", "HVAC", "Flooring", "Drywall", "Painting"],
    subcontractorCount: 12,
    participationByTrade: {
      Electrical: 4,
      Plumbing: 3,
      HVAC: 2,
      Flooring: 2,
      Drywall: 1,
    },
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-30"),
    estimatedValue: 18500000,
    projectType: "Residential",
  },
]

/**
 * Mock Upcoming Deadlines Data for Development and Testing
 *
 * Various upcoming deadlines with different urgency levels
 * to demonstrate deadline tracking functionality.
 */
const mockUpcomingDeadlines: UpcomingDeadline[] = [
  {
    id: "deadline-001",
    projectName: "Highway Bridge Replacement",
    client: "Washington State DOT",
    deadline: new Date("2024-02-08"),
    daysRemaining: 5,
    estimator: "Robert Wilson",
    status: "urgent",
  },
  {
    id: "deadline-002",
    projectName: "Downtown Office Complex",
    client: "Metro Development Corp",
    deadline: new Date("2024-02-15"),
    daysRemaining: 12,
    estimator: "John Smith",
    status: "warning",
  },
  {
    id: "deadline-003",
    projectName: "Luxury Condominiums",
    client: "Premier Properties",
    deadline: new Date("2024-02-20"),
    daysRemaining: 17,
    estimator: "Emily Rodriguez",
    status: "normal",
  },
]

export function PreConDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  // State Management for Dashboard and All Functionality
  const [isLoading, setIsLoading] = useState(false)
  const [dashboardMetrics, setDashboardMetrics] = useState<any | null>(null)
  const [tradeParticipation, setTradeParticipation] = useState<TradeParticipation[]>([])

  // RFP Management State
  const [rfps, setRfps] = useState<RFP[]>(mockRFPs)
  const [selectedRFP, setSelectedRFP] = useState<RFP | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Performance Metrics State
  const [estimateMetrics, setEstimateMetrics] = useState<EstimateMetrics>(mockEstimateMetrics)
  const [timeFrame, setTimeFrame] = useState("all")

  // Active Projects and Deadlines State
  const [projects, setProjects] = useState<PreConProject[]>(mockActiveProjects)
  const [deadlines, setDeadlines] = useState<UpcomingDeadline[]>(mockUpcomingDeadlines)

  // Initialize dashboard data on component mount
  useEffect(() => {
    initializeDashboardData()
  }, [])

  /**
   * Initialize Dashboard Data
   *
   * Simulates API calls to load dashboard metrics and data.
   * In production, this would fetch real data from your backend services.
   */
  const initializeDashboardData = async () => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Calculate metrics based on current RFP data
      const activeRFPs = rfps.filter((rfp) => rfp.status === "active")
      const submittedRFPs = rfps.filter((rfp) => rfp.status === "submitted")
      const awardedRFPs = rfps.filter((rfp) => rfp.status === "awarded")
      const totalSubmitted = submittedRFPs.length + awardedRFPs.length
      const winRate = totalSubmitted > 0 ? (awardedRFPs.length / totalSubmitted) * 100 : 0

      setDashboardMetrics({
        totalRFPs: rfps.length,
        activeEstimates: activeRFPs.length,
        winRate: Math.round(winRate * 10) / 10,
        averageBidValue: Math.round(rfps.reduce((sum, rfp) => sum + rfp.estimatedValue, 0) / rfps.length),
        pendingDeadlines: activeRFPs.filter(
          (rfp) => new Date(rfp.dueDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000,
        ).length,
        monthlyRevenue: awardedRFPs.reduce((sum, rfp) => sum + rfp.estimatedValue, 0),
      })

      // Initialize estimate metrics, projects, and deadlines
      setEstimateMetrics(mockEstimateMetrics)
      setProjects(mockActiveProjects)
      setDeadlines(mockUpcomingDeadlines)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle RFP Selection
   *
   * Updates the selected RFP state and could trigger additional actions
   * like loading detailed RFP information or updating the UI focus.
   *
   * @param {RFP} rfp - The RFP object to select
   */
  const handleSelectRFP = (rfp: RFP) => {
    setSelectedRFP(rfp)
    console.log(`Selected RFP: ${rfp.projectName} for ${rfp.client}`)

    // Future implementation: Load detailed RFP data
    // await loadRFPDetails(rfp.id)
  }

  /**
   * Handle RFP Data Refresh
   *
   * Simulates syncing with BuildingConnected or other external systems.
   * In production, this would make API calls to refresh RFP data.
   */
  const handleRefreshRFPs = async () => {
    setIsRefreshing(true)

    try {
      // Simulate API call to BuildingConnected
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In production, this would fetch updated RFP data
      // const updatedRFPs = await fetchRFPsFromBuildingConnected()
      // setRfps(updatedRFPs)

      console.log("RFP data refreshed successfully")

      // Refresh metrics after RFP update
      await initializeDashboardData()
    } catch (error) {
      console.error("Error refreshing RFP data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  /**
   * Handle Performance Analytics Navigation
   *
   * Navigates to detailed performance analytics page.
   * Future implementation will include deep-dive analytics.
   */
  const handleViewAnalytics = () => {
    console.log("Navigating to performance analytics")
    // Future implementation: router.push("/pre-con/analytics")
  }

  /**
   * Handle Project Navigation
   *
   * Navigates to detailed project view or project listing.
   * Supports both individual project details and full project listing.
   */
  const handleViewAllProjects = () => {
    console.log("Navigating to all projects")
    router.push("/pre-con/projects")
  }

  const handleProjectClick = (projectId: string) => {
    console.log(`Navigating to project: ${projectId}`)
    router.push(`/pre-con/projects/${projectId}`)
  }

  /**
   * Handle Calendar View Navigation
   *
   * Opens the calendar view for deadline management.
   * Future implementation will include calendar integration.
   */
  const handleCalendarView = () => {
    console.log("Opening calendar view")
    // Future implementation: router.push("/pre-con/calendar")
  }

  // Navigation handlers for future section implementations
  const handleNewEstimate = () => {
    router.push("/pre-con/estimating")
  }

  const handleNavigateToSection = (section: string) => {
    console.log(`Navigating to ${section} section`)
    // Future implementation for section-specific navigation
    // router.push(`/pre-con/${section}`)
  }

  // Utility functions for data formatting
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getGreeting = (): string => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Container */}
      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title and Description */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Pre-Construction Dashboard</h1>
              <p className="text-gray-600 text-lg">
                Monitor pre-construction activities, estimates, and performance metrics
              </p>

              {/* Personalized Greeting for Estimators */}
              {user?.role === "estimator" && (
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Estimator
                  </Badge>
                  <span className="text-gray-700 font-medium">
                    {getGreeting()}, {user.firstName}! Ready to create winning estimates?
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleNewEstimate}
                className="bg-[#003087] hover:bg-[#002066] text-white font-medium px-6 py-2.5"
                size="lg"
              >
                <Calculator className="h-5 w-5 mr-2" />
                New Estimate
              </Button>

              <Button
                variant="outline"
                onClick={() => handleNavigateToSection("rfp-management")}
                className="border-gray-300 hover:bg-gray-50"
                size="lg"
              >
                <FileText className="h-5 w-5 mr-2" />
                View All RFPs
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          {/* Quick Stats Row */}
          {dashboardMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Active RFPs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{dashboardMetrics.totalRFPs}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {rfps.filter((rfp) => rfp.status === "active").length} in progress
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Win Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{dashboardMetrics.winRate}%</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {rfps.filter((rfp) => rfp.status === "awarded").length} awarded projects
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Bid Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardMetrics.averageBidValue)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Across all RFPs</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{dashboardMetrics.pendingDeadlines}</div>
                  <p className="text-xs text-gray-500 mt-1">Next 7 days</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* RFP Management Section - Integrated Component */}
          <div className="space-y-6">
            <Card className="border rounded-lg shadow-sm">
              <CardContent className="p-0">
                <RFPManagement
                  rfps={rfps}
                  selectedRFP={selectedRFP}
                  onSelectRFP={handleSelectRFP}
                  onRefresh={handleRefreshRFPs}
                />
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview Section - Integrated Component */}
          <div className="space-y-6">
            <Card className="border rounded-lg shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">Performance Overview</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        Key metrics and performance analytics across all estimates
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleViewAnalytics} className="border-gray-300 hover:bg-gray-50">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <PreConMetrics metrics={estimateMetrics} />
              </CardContent>
            </Card>
          </div>

          {/* Active Projects and Upcoming Deadlines Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Projects Section - Integrated Component */}
            <Card className="border rounded-lg shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Building className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">Active Projects</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        Projects currently in estimation phase
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleViewAllProjects}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <Building className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ActiveProjects projects={projects} />
              </CardContent>
            </Card>

            {/* Upcoming Deadlines Section - Integrated Component */}
            <Card className="border rounded-lg shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">Upcoming Deadlines</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        Critical dates and submission deadlines
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleCalendarView} className="border-gray-300 hover:bg-gray-50">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar View
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <UpcomingDeadlines deadlines={deadlines} />
              </CardContent>
            </Card>
          </div>

          {/* Trade Participation Section */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleNavigateToSection("trade-participation")}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Trade Participation</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Subcontractor engagement and bidding analytics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                Track subcontractor participation rates, response times, and bid quality across all trades.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Electrical", "Plumbing", "HVAC"].map((trade) => (
                  <div key={trade} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">{trade}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      <div className="flex justify-between">
                        <span>Response Rate:</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Active Bids:</span>
                        <span className="font-medium">{projects.length}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNavigateToSection("trade-participation")
                }}
              >
                View Trade Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Getting Started Section */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Getting Started with Pre-Construction</h3>
                  <p className="text-blue-800 text-sm mb-4">
                    New to the pre-construction dashboard? Here are some quick actions to get you started:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() => router.push("/pre-con/estimating")}
                    >
                      Create First Estimate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() => handleRefreshRFPs()}
                    >
                      Sync RFPs
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() => handleViewAnalytics()}
                    >
                      View Analytics
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() => handleCalendarView()}
                    >
                      View Calendar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/**
 * Export the component as default for easy importing
 *
 * Usage:
 * import { PreConDashboard } from '@/components/precon/precon-dashboard'
 *
 * Or in a page:
 * import PreConDashboard from '@/components/precon/precon-dashboard'
 */
export default PreConDashboard
