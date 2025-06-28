"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Legend,
  ComposedChart,
  ScatterChart,
  Scatter
} from "recharts"
import {
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Award,
  Clock,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Filter,
  Download,
  Zap,
  Activity,
  Building2,
  Scale
} from "lucide-react"

interface ProcurementAnalyticsProps {
  userRole: string
  dataScope: any
  summaryMetrics: any
}

export function ProcurementAnalytics({ userRole, dataScope, summaryMetrics }: ProcurementAnalyticsProps) {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("12months")
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      // Generate comprehensive analytics data
      const mockAnalyticsData = {
        monthlyTrends: [
          { month: "Jan", spending: 2400000, savings: 145000, contracts: 12, avgCycle: 32 },
          { month: "Feb", spending: 2100000, savings: 132000, contracts: 8, avgCycle: 28 },
          { month: "Mar", spending: 2850000, savings: 178000, contracts: 15, avgCycle: 30 },
          { month: "Apr", spending: 2650000, savings: 156000, contracts: 11, avgCycle: 26 },
          { month: "May", spending: 3100000, savings: 189000, contracts: 18, avgCycle: 29 },
          { month: "Jun", spending: 2900000, savings: 201000, contracts: 14, avgCycle: 25 },
          { month: "Jul", spending: 3300000, savings: 225000, contracts: 16, avgCycle: 27 },
          { month: "Aug", spending: 2800000, savings: 195000, contracts: 13, avgCycle: 24 },
          { month: "Sep", spending: 3450000, savings: 248000, contracts: 19, avgCycle: 26 },
          { month: "Oct", spending: 3200000, savings: 235000, contracts: 17, avgCycle: 23 },
          { month: "Nov", spending: 2950000, savings: 210000, contracts: 15, avgCycle: 25 },
          { month: "Dec", spending: 3600000, savings: 285000, contracts: 21, avgCycle: 22 }
        ],
        categoryBreakdown: [
          { category: "Structural", amount: 15400000, percentage: 35, contracts: 45, avgSavings: 8.2, color: "#FF6B35" },
          { category: "MEP", amount: 12300000, percentage: 28, contracts: 38, avgSavings: 7.8, color: "#4F46E5" },
          { category: "Finishes", amount: 7900000, percentage: 18, contracts: 52, avgSavings: 6.5, color: "#10B981" },
          { category: "Site Work", amount: 5300000, percentage: 12, contracts: 28, avgSavings: 9.1, color: "#F59E0B" },
          { category: "Specialty", amount: 3100000, percentage: 7, contracts: 19, avgSavings: 5.8, color: "#EF4444" }
        ],
        vendorPerformance: [
          { vendor: "ABC Construction", contracts: 24, totalValue: 15400000, avgRating: 4.8, onTimeDelivery: 95, qualityScore: 92 },
          { vendor: "BuildRight Inc", contracts: 18, totalValue: 8900000, avgRating: 4.6, onTimeDelivery: 92, qualityScore: 89 },
          { vendor: "XYZ Contractors", contracts: 31, totalValue: 12300000, avgRating: 4.4, onTimeDelivery: 88, qualityScore: 91 },
          { vendor: "Elite Builders", contracts: 12, totalValue: 5600000, avgRating: 4.2, onTimeDelivery: 90, qualityScore: 87 },
          { vendor: "Pro Construction", contracts: 16, totalValue: 7200000, avgRating: 4.0, onTimeDelivery: 85, qualityScore: 83 }
        ],
        savingsAnalysis: [
          { category: "Structural", budgeted: 16800000, actual: 15400000, savings: 1400000, percentage: 8.3 },
          { category: "MEP", budgeted: 13200000, actual: 12300000, savings: 900000, percentage: 6.8 },
          { category: "Finishes", budgeted: 8400000, actual: 7900000, savings: 500000, percentage: 6.0 },
          { category: "Site Work", budgeted: 5800000, actual: 5300000, savings: 500000, percentage: 8.6 },
          { category: "Specialty", budgeted: 3300000, actual: 3100000, savings: 200000, percentage: 6.1 }
        ],
        cycleTimeAnalysis: [
          { trade: "Structural", avgDays: 28, targetDays: 30, improvement: 7 },
          { trade: "MEP", avgDays: 32, targetDays: 35, improvement: 9 },
          { trade: "Finishes", avgDays: 25, targetDays: 28, improvement: 11 },
          { trade: "Site Work", avgDays: 30, targetDays: 32, improvement: 6 },
          { trade: "Specialty", avgDays: 35, targetDays: 40, improvement: 13 }
        ],
        riskAnalysis: [
          { risk: "Vendor Concentration", level: "High", impact: "Financial", probability: 75, mitigation: "Diversify vendor base" },
          { risk: "Schedule Delays", level: "Medium", impact: "Schedule", probability: 45, mitigation: "Early engagement and incentives" },
          { risk: "Cost Overruns", level: "Medium", impact: "Budget", probability: 35, mitigation: "Enhanced cost controls" },
          { risk: "Quality Issues", level: "Low", impact: "Quality", probability: 15, mitigation: "Vendor qualification program" }
        ],
        marketTrends: [
          { period: "Q1", laborCost: 100, materialCost: 100, competition: 100 },
          { period: "Q2", laborCost: 103, materialCost: 98, competition: 105 },
          { period: "Q3", laborCost: 105, materialCost: 102, competition: 108 },
          { period: "Q4", laborCost: 108, materialCost: 106, competition: 112 }
        ]
      }

      setAnalyticsData(mockAnalyticsData)
      setLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [timeRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const keyMetrics = useMemo(() => {
    if (!analyticsData) return null

    const totalSpending = analyticsData.monthlyTrends.reduce((sum: number, month: any) => sum + month.spending, 0)
    const totalSavings = analyticsData.monthlyTrends.reduce((sum: number, month: any) => sum + month.savings, 0)
    const totalContracts = analyticsData.monthlyTrends.reduce((sum: number, month: any) => sum + month.contracts, 0)
    const avgCycleTime = analyticsData.monthlyTrends.reduce((sum: number, month: any) => sum + month.avgCycle, 0) / analyticsData.monthlyTrends.length
    const savingsRate = (totalSavings / totalSpending) * 100

    return {
      totalSpending,
      totalSavings,
      totalContracts,
      avgCycleTime,
      savingsRate
    }
  }, [analyticsData])

  if (loading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Procurement Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Advanced insights and performance metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="24months">Last 24 Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700">
                +12.5%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Spending</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(keyMetrics.totalSpending)}</p>
              <p className="text-xs text-blue-600 mt-1">Year over year growth</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-700">
                {formatPercent(keyMetrics.savingsRate)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Total Savings</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(keyMetrics.totalSavings)}</p>
              <p className="text-xs text-green-600 mt-1">Above target of 6.0%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-700">
                {keyMetrics.totalContracts}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-600 mb-1">Contracts Executed</p>
              <p className="text-2xl font-bold text-orange-900">{keyMetrics.totalContracts}</p>
              <p className="text-xs text-orange-600 mt-1">Across all projects</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-700">
                -3 days
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Avg Cycle Time</p>
              <p className="text-2xl font-bold text-purple-900">{Math.round(keyMetrics.avgCycleTime)} days</p>
              <p className="text-xs text-purple-600 mt-1">Faster than target</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-rose-100 rounded-lg">
                <Award className="h-6 w-6 text-rose-600" />
              </div>
              <Badge className="bg-rose-100 text-rose-700">
                Top 10%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-rose-600 mb-1">Performance Score</p>
              <p className="text-2xl font-bold text-rose-900">A+</p>
              <p className="text-xs text-rose-600 mt-1">Industry benchmark</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Spending Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#FF6B35]" />
                  Monthly Spending Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value / 1000000}M`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Area 
                      type="monotone" 
                      dataKey="spending" 
                      stroke="#FF6B35" 
                      fill="#FF6B35" 
                      fillOpacity={0.3}
                      name="Spending"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Savings & Cycle Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#FF6B35]" />
                  Savings & Cycle Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={analyticsData.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `$${value / 1000}k`} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="savings" fill="#10B981" name="Savings" />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="avgCycle" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      name="Avg Cycle (days)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Contract Volume */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#FF6B35]" />
                Contract Execution Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="contracts" fill="#4F46E5" name="Contracts" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-[#FF6B35]" />
                  Spending by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="amount"
                      label={({ category, percentage }) => `${category} ${percentage}%`}
                    >
                      {analyticsData.categoryBreakdown.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#FF6B35]" />
                  Category Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.categoryBreakdown.map((category: any) => (
                    <div key={category.category} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{category.category}</span>
                        <Badge variant="outline" style={{ backgroundColor: category.color + '20', color: category.color }}>
                          {category.contracts} contracts
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Total Value:</span>
                          <div className="font-medium">{formatCurrency(category.amount)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Avg Savings:</span>
                          <div className="font-medium text-green-600">{formatPercent(category.avgSavings)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          {/* Top Vendor Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#FF6B35]" />
                Vendor Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.vendorPerformance.map((vendor: any, index: number) => (
                  <div key={vendor.vendor} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                          <span className="text-sm font-semibold text-gray-600">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{vendor.vendor}</div>
                          <div className="text-sm text-gray-500">{vendor.contracts} contracts</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(vendor.totalValue)}</div>
                        <div className="text-sm text-gray-500">Total Value</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">{vendor.avgRating}</div>
                        <div className="text-xs text-blue-500">Rating</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">{vendor.onTimeDelivery}%</div>
                        <div className="text-xs text-green-500">On-Time</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-600">{vendor.qualityScore}%</div>
                        <div className="text-xs text-purple-500">Quality</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#FF6B35]" />
                Vendor Portfolio Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={analyticsData.vendorPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="totalValue" tickFormatter={(value) => `$${value / 1000000}M`} />
                  <YAxis dataKey="avgRating" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === "totalValue" ? formatCurrency(value as number) : value,
                      name === "totalValue" ? "Total Value" : "Rating"
                    ]}
                    labelFormatter={(label) => `Vendor: ${label}`}
                  />
                  <Scatter dataKey="totalValue" fill="#FF6B35" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Savings by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#FF6B35]" />
                  Savings Analysis by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.savingsAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => `$${value / 1000000}M`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="budgeted" fill="#E5E7EB" name="Budgeted" />
                    <Bar dataKey="actual" fill="#10B981" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Savings Percentage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#FF6B35]" />
                  Savings Percentage by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.savingsAnalysis.map((item: any) => (
                    <div key={item.category} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{item.category}</span>
                        <Badge 
                          variant="outline" 
                          className={item.percentage >= 8 ? "bg-green-100 text-green-800" : item.percentage >= 6 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}
                        >
                          {formatPercent(item.percentage)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Savings Amount:</span>
                          <div className="font-medium text-green-600">{formatCurrency(item.savings)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Budget vs Actual:</span>
                          <div className="font-medium">{formatCurrency(item.budgeted)} → {formatCurrency(item.actual)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cycle Time Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#FF6B35]" />
                  Cycle Time Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.cycleTimeAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="trade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="targetDays" fill="#E5E7EB" name="Target Days" />
                    <Bar dataKey="avgDays" fill="#4F46E5" name="Actual Days" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Process Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#FF6B35]" />
                  Process Improvement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.cycleTimeAnalysis.map((item: any) => (
                    <div key={item.trade} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{item.trade}</span>
                        <Badge 
                          variant="outline" 
                          className="bg-green-100 text-green-800"
                        >
                          -{item.improvement}% improvement
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Average Days:</span>
                          <div className="font-medium">{item.avgDays} days</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Target:</span>
                          <div className="font-medium">{item.targetDays} days</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#FF6B35]" />
                Market Trends Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analyticsData.marketTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="laborCost" stroke="#FF6B35" strokeWidth={2} name="Labor Cost Index" />
                  <Line type="monotone" dataKey="materialCost" stroke="#4F46E5" strokeWidth={2} name="Material Cost Index" />
                  <Line type="monotone" dataKey="competition" stroke="#10B981" strokeWidth={2} name="Competition Index" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#FF6B35]" />
                Procurement Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.riskAnalysis.map((risk: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium">{risk.risk}</div>
                        <div className="text-sm text-gray-500">{risk.impact} Impact</div>
                      </div>
                      <Badge variant="outline" className={getRiskColor(risk.level)}>
                        {risk.level} Risk
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Probability:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ width: `${risk.probability}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{risk.probability}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Mitigation:</span>
                        <div className="text-sm font-medium mt-1">{risk.mitigation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#FF6B35]" />
                Risk Impact vs Probability Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 h-64">
                {/* High Impact */}
                <div className="bg-red-50 border border-red-200 p-3 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-red-700">High Impact</div>
                    <div className="text-xs text-red-600">Critical Action</div>
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 p-3 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-orange-700">High Impact</div>
                    <div className="text-xs text-orange-600">Monitor Closely</div>
                  </div>
                </div>
                <div className="bg-red-100 border border-red-300 p-3 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-red-800">High Impact</div>
                    <div className="text-xs text-red-700">Immediate Action</div>
                  </div>
                </div>

                {/* Medium Impact */}
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-yellow-700">Medium Impact</div>
                    <div className="text-xs text-yellow-600">Plan Response</div>
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 p-3 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-orange-700">Medium Impact</div>
                    <div className="text-xs text-orange-600">Monitor</div>
                  </div>
                </div>
                <div className="bg-orange-100 border border-orange-300 p-3 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-orange-800">Medium Impact</div>
                    <div className="text-xs text-orange-700">Active Management</div>
                  </div>
                </div>

                {/* Low Impact */}
                <div className="bg-green-50 border border-green-200 p-3 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-700">Low Impact</div>
                    <div className="text-xs text-green-600">Accept</div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-yellow-700">Low Impact</div>
                    <div className="text-xs text-yellow-600">Review Periodic</div>
                  </div>
                </div>
                <div className="bg-yellow-100 border border-yellow-300 p-3 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-yellow-800">Low Impact</div>
                    <div className="text-xs text-yellow-700">Monitor</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <span>Low Probability</span>
                <span>Medium Probability</span>
                <span>High Probability</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 