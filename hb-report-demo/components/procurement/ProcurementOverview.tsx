"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend
} from "recharts"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Award,
  Activity,
  Users,
  Calendar,
  FileText,
  Zap,
  ArrowUp,
  ArrowDown,
  Star
} from "lucide-react"

interface ProcurementOverviewProps {
  userRole: string
  dataScope: {
    scope: string
    projectCount: number
    description: string
    canCreate: boolean
    canApprove: boolean
    canEdit: boolean
  }
  summaryMetrics: {
    totalProcurementValue: number
    activeBuyouts: number
    pendingContracts: number
    avgSavings: number
    vendorCount: number
    completedBuyouts: number
  }
}

export function ProcurementOverview({ userRole, dataScope, summaryMetrics }: ProcurementOverviewProps) {
  const [loading, setLoading] = useState(true)
  const [procurementData, setProcurementData] = useState<any>(null)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      // Generate role-specific mock data
      setProcurementData(generateMockData(dataScope.scope))
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [dataScope.scope])

  const generateMockData = (scope: string) => {
    const baseData = {
      monthlySavings: [
        { month: "Jan", savings: 145000, budget: 2100000 },
        { month: "Feb", savings: 132000, budget: 1980000 },
        { month: "Mar", savings: 178000, budget: 2340000 },
        { month: "Apr", savings: 156000, budget: 2120000 },
        { month: "May", savings: 189000, budget: 2450000 },
        { month: "Jun", savings: 201000, budget: 2580000 }
      ],
      categoryDistribution: [
        { name: "Structural", value: 35, amount: 8540000, color: "#FF6B35" },
        { name: "MEP", value: 28, amount: 6850000, color: "#4F46E5" },
        { name: "Finishes", value: 18, amount: 4400000, color: "#10B981" },
        { name: "Site Work", value: 12, amount: 2930000, color: "#F59E0B" },
        { name: "Specialty", value: 7, amount: 1710000, color: "#EF4444" }
      ],
      vendorPerformance: [
        { name: "ABC Construction", rating: 4.8, projects: 12, onTime: 95, satisfaction: 4.9 },
        { name: "BuildRight Inc", rating: 4.6, projects: 8, onTime: 92, satisfaction: 4.7 },
        { name: "XYZ Contractors", rating: 4.4, projects: 15, onTime: 88, satisfaction: 4.5 },
        { name: "Elite Builders", rating: 4.2, projects: 6, onTime: 90, satisfaction: 4.3 },
        { name: "Pro Construction", rating: 4.0, projects: 9, onTime: 85, satisfaction: 4.1 }
      ],
      recentActivities: [
        { id: 1, type: "contract_executed", vendor: "ABC Construction", amount: 1250000, date: "2024-12-20" },
        { id: 2, type: "bid_received", vendor: "BuildRight Inc", amount: 890000, date: "2024-12-19" },
        { id: 3, type: "loi_sent", vendor: "XYZ Contractors", amount: 750000, date: "2024-12-18" },
        { id: 4, type: "contract_pending", vendor: "Elite Builders", amount: 1100000, date: "2024-12-17" }
      ],
      upcomingMilestones: [
        { title: "Steel Subcontract Execution", date: "2024-12-22", priority: "high" },
        { title: "MEP Bid Review", date: "2024-12-24", priority: "medium" },
        { title: "Finishes LOI Response", date: "2024-12-26", priority: "medium" },
        { title: "Site Work Contract Award", date: "2024-12-28", priority: "low" }
      ]
    }

    // Scale data based on scope
    const multiplier = scope === "enterprise" ? 2.5 : scope === "portfolio" ? 1.5 : 1
    
    return {
      ...baseData,
      monthlySavings: baseData.monthlySavings.map(item => ({
        ...item,
        savings: Math.round(item.savings * multiplier),
        budget: Math.round(item.budget * multiplier)
      })),
      categoryDistribution: baseData.categoryDistribution.map(item => ({
        ...item,
        amount: Math.round(item.amount * multiplier)
      }))
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "contract_executed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "bid_received":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "loi_sent":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "contract_pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  if (loading || !procurementData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700">
                +12.5%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-600 mb-1">Savings Rate</p>
              <p className="text-2xl font-bold text-emerald-900">{summaryMetrics.avgSavings}%</p>
              <p className="text-xs text-emerald-600 mt-1">Above target of 6.0%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700">
                {Math.round((summaryMetrics.completedBuyouts / summaryMetrics.activeBuyouts) * 100)}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Buyout Progress</p>
              <p className="text-2xl font-bold text-blue-900">{summaryMetrics.completedBuyouts}</p>
              <p className="text-xs text-blue-600 mt-1">of {summaryMetrics.activeBuyouts} active buyouts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-700">
                -3 days
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-600 mb-1">Avg Cycle Time</p>
              <p className="text-2xl font-bold text-orange-900">28 days</p>
              <p className="text-xs text-orange-600 mt-1">3 days faster than target</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-700">
                4.6/5.0
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Vendor Rating</p>
              <p className="text-2xl font-bold text-purple-900">4.6</p>
              <p className="text-xs text-purple-600 mt-1">Average vendor performance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Savings Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#FF6B35]" />
              Monthly Savings & Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={procurementData.monthlySavings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Area 
                  type="monotone" 
                  dataKey="budget" 
                  stackId="1" 
                  stroke="#E5E7EB" 
                  fill="#F3F4F6" 
                  name="Budget"
                />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stackId="2" 
                  stroke="#FF6B35" 
                  fill="#FF6B35" 
                  name="Savings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#FF6B35]" />
              Procurement by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={procurementData.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {procurementData.categoryDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Vendor Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-[#FF6B35]" />
              Top Vendor Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {procurementData.vendorPerformance.map((vendor: any, index: number) => (
                <div key={vendor.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                      <span className="text-sm font-semibold text-gray-600">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{vendor.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{vendor.projects} projects</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{vendor.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500">{vendor.onTime}% on-time</div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {vendor.satisfaction}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities & Upcoming Milestones */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#FF6B35]" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {procurementData.recentActivities.map((activity: any) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{activity.vendor}</div>
                      <div className="text-xs text-gray-500">
                        {activity.type.replace('_', ' ')} • {formatCurrency(activity.amount)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{activity.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#FF6B35]" />
                Upcoming Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {procurementData.upcomingMilestones.map((milestone: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{milestone.title}</div>
                      <div className="text-xs text-gray-500">{milestone.date}</div>
                    </div>
                    <Badge variant="outline" className={getPriorityColor(milestone.priority)}>
                      {milestone.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Items & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#FF6B35]" />
              Action Items Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="font-medium text-red-900">3 Contracts Awaiting Signature</div>
                    <div className="text-sm text-red-600">Total value: {formatCurrency(3420000)}</div>
                  </div>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Review
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="font-medium text-orange-900">5 Bids Due This Week</div>
                    <div className="text-sm text-orange-600">Requires evaluation and response</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                  View Bids
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-blue-900">12 Change Orders in Review</div>
                    <div className="text-sm text-blue-600">Impact assessment needed</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                  Assess
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#FF6B35]" />
              Financial Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Budget Utilization</span>
                  <span className="text-sm text-gray-500">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Savings Target</span>
                  <span className="text-sm text-gray-500">117%</span>
                </div>
                <Progress value={117} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Contract Execution</span>
                  <span className="text-sm text-gray-500">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">A+</div>
                  <div className="text-sm text-gray-500">Overall Health Score</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 