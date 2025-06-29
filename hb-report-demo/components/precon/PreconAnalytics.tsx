"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Building2,
  Users,
  Calendar,
  Lightbulb,
  Zap,
  Award,
  Timer,
  FileText,
  Calculator,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  ScatterChart,
  Scatter
} from "recharts"

interface PreconAnalyticsProps {
  pipelineData: any[]
  preconProjects: any[]
  summaryStats: any
  userRole: string
}

export function PreconAnalytics({ pipelineData, preconProjects, summaryStats, userRole }: PreconAnalyticsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("12months")
  const [selectedView, setSelectedView] = useState("performance")

  // Performance analytics data
  const performanceData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months.map((month, index) => ({
      month,
      bidsSubmitted: Math.floor(Math.random() * 12) + 5,
      winRate: (Math.random() * 25) + 15,
      avgMargin: (Math.random() * 8) + 4,
      pipelineValue: Math.floor(Math.random() * 50000000) + 20000000,
      accuracy: (Math.random() * 15) + 85
    }))
  }, [])

  // Regional performance analysis
  const regionalData = useMemo(() => {
    return [
      { region: "Southeast", projects: 8, value: 125000000, winRate: 32, fill: "#3b82f6" },
      { region: "Central", projects: 6, value: 98000000, winRate: 28, fill: "#10b981" },
      { region: "North", projects: 4, value: 67000000, winRate: 35, fill: "#f59e0b" },
      { region: "Southwest", projects: 3, value: 45000000, winRate: 25, fill: "#ef4444" }
    ]
  }, [])

  // Project type analysis
  const projectTypeData = useMemo(() => {
    return [
      { type: "Commercial", count: 12, avgValue: 15000000, successRate: 68, fill: "#3b82f6" },
      { type: "Residential", count: 8, avgValue: 8500000, successRate: 72, fill: "#10b981" },
      { type: "Industrial", count: 5, avgValue: 22000000, successRate: 58, fill: "#f59e0b" },
      { type: "Healthcare", count: 3, avgValue: 35000000, successRate: 45, fill: "#ef4444" }
    ]
  }, [])

  // Risk assessment data
  const riskFactors = useMemo(() => {
    return [
      { factor: "Market Competition", level: 75, impact: "High", trend: "Increasing" },
      { factor: "Material Costs", level: 68, impact: "Medium", trend: "Stable" },
      { factor: "Labor Availability", level: 82, impact: "High", trend: "Increasing" },
      { factor: "Economic Uncertainty", level: 45, impact: "Medium", trend: "Decreasing" },
      { factor: "Regulatory Changes", level: 35, impact: "Low", trend: "Stable" }
    ]
  }, [])

  // Forecasting data
  const forecastData = useMemo(() => {
    const quarters = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025", "Q2 2025"]
    return quarters.map((quarter, index) => ({
      quarter,
      pipelineValue: 80000000 + (index * 12000000) + (Math.random() * 20000000),
      expectedWins: 15 + Math.floor(Math.random() * 8),
      confidence: 85 + (Math.random() * 10)
    }))
  }, [])

  // Efficiency metrics
  const efficiencyMetrics = useMemo(() => {
    return {
      avgTimeToProposal: 14, // days
      avgTimeToDecision: 28, // days
      proposalSuccessRate: 35, // %
      resourceUtilization: 87, // %
      costPerProposal: 8500, // $
      revenuePerEmployee: 485000 // $
    }
  }, [])

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Performance Score</CardTitle>
            <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              87/100
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              +5 points this quarter
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Efficiency Rating</CardTitle>
            <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {efficiencyMetrics.resourceUtilization}%
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Resource utilization
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {efficiencyMetrics.proposalSuccessRate}%
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Proposal win rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              2.8x
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Return on investment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="forecasting" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Forecasting
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Risk Analysis
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        {/* Performance Analytics */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Performance Trends
                </CardTitle>
                <CardDescription>Key metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="bidsSubmitted" fill="#3b82f6" name="Bids Submitted" />
                    <Line yAxisId="right" type="monotone" dataKey="winRate" stroke="#10b981" name="Win Rate %" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="avgMargin" stroke="#f59e0b" name="Avg Margin %" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Regional Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Regional Performance
                </CardTitle>
                <CardDescription>Performance by geographic region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionalData.map((region, index) => (
                    <div key={region.region} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: region.fill }}
                        />
                        <div>
                          <div className="font-medium text-sm">{region.region}</div>
                          <div className="text-xs text-muted-foreground">
                            {region.projects} projects
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatCurrency(region.value)}
                        </div>
                        <div className="text-xs text-green-600">
                          {region.winRate}% win rate
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Type Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                Project Type Performance Analysis
              </CardTitle>
              <CardDescription>Success rates and values by project category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={projectTypeData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="avgValue" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis dataKey="successRate" tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'successRate') return [`${value}%`, 'Success Rate']
                      if (name === 'avgValue') return [formatCurrency(value), 'Avg Value']
                      return [value, name]
                    }}
                  />
                  <Scatter dataKey="successRate" fill="#8b5cf6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forecasting Analytics */}
        <TabsContent value="forecasting" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pipeline Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Pipeline Value Forecast
                </CardTitle>
                <CardDescription>Projected pipeline growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="quarter" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), "Pipeline Value"]} />
                    <Area 
                      type="monotone" 
                      dataKey="pipelineValue" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Forecast Confidence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Forecast Confidence
                </CardTitle>
                <CardDescription>Confidence levels in pipeline projections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {forecastData.map((item, index) => (
                  <div key={item.quarter} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.quarter}</span>
                      <span className="text-muted-foreground">{item.confidence.toFixed(0)}% confidence</span>
                    </div>
                    <Progress value={item.confidence} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Expected wins: {item.expectedWins} • Value: {formatCurrency(item.pipelineValue)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Analysis */}
        <TabsContent value="risk" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Risk Factor Assessment
                </CardTitle>
                <CardDescription>Current risk levels and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {riskFactors.map((risk, index) => (
                  <div key={risk.factor} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{risk.factor}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={risk.impact === "High" ? "destructive" : risk.impact === "Medium" ? "secondary" : "default"}>
                          {risk.impact}
                        </Badge>
                        <span className="text-muted-foreground">{risk.trend}</span>
                      </div>
                    </div>
                    <Progress value={risk.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Risk Mitigation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Risk Mitigation Status
                </CardTitle>
                <CardDescription>Active mitigation strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                    <div className="text-sm">
                      <p className="font-medium">Diversified Pipeline</p>
                      <p className="text-muted-foreground">Spread across multiple sectors to reduce market risk</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                    <div className="text-sm">
                      <p className="font-medium">Vendor Partnerships</p>
                      <p className="text-muted-foreground">Strong relationships mitigate material cost volatility</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-orange-600 mt-1" />
                    <div className="text-sm">
                      <p className="font-medium">Skills Development</p>
                      <p className="text-muted-foreground">Training programs to address labor shortages</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-1">
            {/* HBI Intelligence Summary */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                  <Brain className="h-5 w-5" />
                  HBI Advanced Analytics Intelligence
                </CardTitle>
                <CardDescription className="text-purple-700 dark:text-purple-300">
                  AI-powered insights and recommendations for preconstruction optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Key Insights */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Key Insights</h4>
                    
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-4 w-4 text-yellow-600 mt-1" />
                      <div className="text-sm">
                        <p className="font-medium text-purple-900 dark:text-purple-100">Optimal Timing</p>
                        <p className="text-purple-700 dark:text-purple-300">Q2 shows highest win rates - focus major proposals during this period</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Zap className="h-4 w-4 text-blue-600 mt-1" />
                      <div className="text-sm">
                        <p className="font-medium text-purple-900 dark:text-purple-100">Resource Allocation</p>
                        <p className="text-purple-700 dark:text-purple-300">Healthcare projects offer 2.3x ROI but require specialized expertise</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Target className="h-4 w-4 text-green-600 mt-1" />
                      <div className="text-sm">
                        <p className="font-medium text-purple-900 dark:text-purple-100">Strategic Focus</p>
                        <p className="text-purple-700 dark:text-purple-300">Southeast region underperforming - investigate market dynamics</p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">AI Recommendations</h4>
                    
                    <div className="flex items-start gap-3">
                      <ArrowUpRight className="h-4 w-4 text-green-600 mt-1" />
                      <div className="text-sm">
                        <p className="font-medium text-purple-900 dark:text-purple-100">Increase Healthcare Focus</p>
                        <p className="text-purple-700 dark:text-purple-300">Allocate 15% more resources to healthcare sector</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Award className="h-4 w-4 text-orange-600 mt-1" />
                      <div className="text-sm">
                        <p className="font-medium text-purple-900 dark:text-purple-100">Optimize Proposals</p>
                        <p className="text-purple-700 dark:text-purple-300">Implement AI-assisted proposal review process</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-purple-600 mt-1" />
                      <div className="text-sm">
                        <p className="font-medium text-purple-900 dark:text-purple-100">Team Training</p>
                        <p className="text-purple-700 dark:text-purple-300">Upskill estimating team in emerging technologies</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-200 dark:border-purple-700">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">94%</div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">Prediction Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">$2.8M</div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">Potential Savings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">18%</div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">Efficiency Gain</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 