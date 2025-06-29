"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Trophy,
  AlertTriangle,
  Clock,
  MapPin,
  Building2,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  ExternalLink,
  Star,
  Award,
  Lightbulb,
  Zap,
  Brain
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
  ScatterChart,
  Scatter,
  ComposedChart
} from "recharts"

interface BusinessDevelopmentProps {
  pipelineData: any[]
  summaryStats: any
  userRole: string
}

export function BusinessDevelopment({ pipelineData, summaryStats, userRole }: BusinessDevelopmentProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")
  const [selectedView, setSelectedView] = useState("leads")

  // Generate lead generation data
  const leadGenerationData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((month, index) => ({
      month,
      newLeads: Math.floor(Math.random() * 15) + 8,
      qualifiedLeads: Math.floor(Math.random() * 12) + 5,
      proposals: Math.floor(Math.random() * 8) + 3,
      wins: Math.floor(Math.random() * 4) + 1,
      conversionRate: (Math.random() * 20) + 15
    }))
  }, [])

  // Business development metrics
  const bdMetrics = useMemo(() => {
    const totalLeads = leadGenerationData.reduce((sum, month) => sum + month.newLeads, 0)
    const totalProposals = leadGenerationData.reduce((sum, month) => sum + month.proposals, 0)
    const totalWins = leadGenerationData.reduce((sum, month) => sum + month.wins, 0)
    const avgConversionRate = leadGenerationData.reduce((sum, month) => sum + month.conversionRate, 0) / leadGenerationData.length
    
    const pipelineValue = summaryStats.totalPipelineValue
    const weightedValue = summaryStats.probabilityWeightedValue
    
    return {
      totalLeads,
      totalProposals,
      totalWins,
      avgConversionRate,
      pipelineValue,
      weightedValue,
      winRate: summaryStats.winRate || 0,
      avgDealSize: pipelineValue / totalLeads || 0
    }
  }, [leadGenerationData, summaryStats])

  // Market sector analysis
  const marketSectorData = useMemo(() => {
    const sectors = [
      { name: "Healthcare", leads: 12, value: 45000000, growth: 15.2, fill: "#3b82f6" },
      { name: "Education", leads: 8, value: 32000000, growth: 8.7, fill: "#10b981" },
      { name: "Commercial", leads: 15, value: 68000000, growth: 12.4, fill: "#f59e0b" },
      { name: "Industrial", leads: 6, value: 28000000, growth: -2.1, fill: "#ef4444" },
      { name: "Residential", leads: 10, value: 35000000, growth: 18.9, fill: "#8b5cf6" }
    ]
    
    return sectors.sort((a, b) => b.value - a.value)
  }, [])

  // Lead source analysis
  const leadSourceData = useMemo(() => {
    return [
      { source: "Referrals", count: 25, value: 48000000, cost: 2500, roi: 1920 },
      { source: "Digital Marketing", count: 18, value: 34000000, cost: 15000, roi: 227 },
      { source: "Trade Shows", count: 12, value: 28000000, cost: 25000, roi: 112 },
      { source: "Cold Outreach", count: 8, value: 15000000, cost: 8000, roi: 188 },
      { source: "Partnerships", count: 15, value: 42000000, cost: 5000, roi: 840 }
    ]
  }, [])

  // Competitive analysis data
  const competitorData = useMemo(() => {
    return [
      { name: "ABC Construction", winRate: 35, avgBidRatio: 0.92, marketShare: 18 },
      { name: "XYZ Builders", winRate: 28, avgBidRatio: 0.95, marketShare: 15 },
      { name: "Premium Contractors", winRate: 32, avgBidRatio: 1.08, marketShare: 12 },
      { name: "Elite Building Co", winRate: 25, avgBidRatio: 0.88, marketShare: 10 },
      { name: "Others", winRate: 22, avgBidRatio: 0.98, marketShare: 45 }
    ]
  }, [])

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Business Development Performance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">New Leads</CardTitle>
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {bdMetrics.totalLeads}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {bdMetrics.avgConversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Lead to proposal rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {formatCurrency(bdMetrics.avgDealSize)}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Average opportunity
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Win Rate</CardTitle>
            <Trophy className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {bdMetrics.winRate.toFixed(1)}%
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Historical average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Lead Gen
          </TabsTrigger>
          <TabsTrigger value="markets" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Markets
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Sources
          </TabsTrigger>
          <TabsTrigger value="competitive" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Competitive
          </TabsTrigger>
        </TabsList>

        {/* Lead Generation Analysis */}
        <TabsContent value="leads" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Lead Funnel Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Lead Generation Funnel
                </CardTitle>
                <CardDescription>Monthly lead generation and conversion performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={leadGenerationData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="newLeads" fill="#3b82f6" name="New Leads" />
                    <Bar yAxisId="left" dataKey="qualifiedLeads" fill="#10b981" name="Qualified" />
                    <Bar yAxisId="left" dataKey="proposals" fill="#f59e0b" name="Proposals" />
                    <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="#ef4444" name="Conversion Rate %" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* HBI Business Intelligence Panel */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900 border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
                  <Brain className="h-5 w-5" />
                  HBI BD Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-1" />
                    <div className="text-sm">
                      <p className="font-medium text-indigo-900 dark:text-indigo-100">Market Opportunity</p>
                      <p className="text-indigo-700 dark:text-indigo-300">Healthcare sector showing 15.2% growth - consider increasing focus</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Zap className="h-4 w-4 text-blue-600 mt-1" />
                    <div className="text-sm">
                      <p className="font-medium text-indigo-900 dark:text-indigo-100">Lead Quality</p>
                      <p className="text-indigo-700 dark:text-indigo-300">Referral leads have 8x higher conversion rate than cold outreach</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-1" />
                    <div className="text-sm">
                      <p className="font-medium text-indigo-900 dark:text-indigo-100">Action Required</p>
                      <p className="text-indigo-700 dark:text-indigo-300">5 high-value proposals need follow-up this week</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-indigo-200 dark:border-indigo-700">
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 mb-2">BD Health Score</div>
                  <div className="flex items-center gap-2">
                    <Progress value={87} className="flex-1" />
                    <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lead Performance Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pipeline Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32 days</div>
                <p className="text-xs text-muted-foreground">Average lead to proposal</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDownRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">-5 days vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quality Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.2/10</div>
                <p className="text-xs text-muted-foreground">Lead qualification rating</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+0.4 improvement</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Follow-up Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">Response within 24hrs</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+2% this month</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Market Analysis */}
        <TabsContent value="markets" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Market Sector Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Market Sector Analysis
                </CardTitle>
                <CardDescription>Pipeline value and growth by market sector</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marketSectorData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), "Pipeline Value"]} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Market Growth Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Growth Opportunities
                </CardTitle>
                <CardDescription>Market sectors with highest growth potential</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketSectorData.map((sector, index) => (
                  <div key={sector.name} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: sector.fill }}
                      />
                      <div>
                        <div className="font-medium text-sm">{sector.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {sector.leads} active leads
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatCurrency(sector.value)}
                      </div>
                      <div className={`text-xs flex items-center gap-1 ${
                        sector.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {sector.growth > 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {Math.abs(sector.growth)}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Lead Sources Analysis */}
        <TabsContent value="sources" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Lead Source ROI */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Lead Source ROI Analysis
                </CardTitle>
                <CardDescription>Return on investment by lead generation channel</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={leadSourceData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="cost" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <YAxis dataKey="roi" tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      formatter={(value: any, name: string) => {
                        if (name === 'roi') return [`${value}%`, 'ROI']
                        if (name === 'cost') return [`$${(value / 1000).toFixed(1)}K`, 'Cost']
                        return [value, name]
                      }}
                    />
                    <Scatter dataKey="roi" fill="#8b5cf6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Source Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Source Performance Summary
                </CardTitle>
                <CardDescription>Lead generation effectiveness by channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leadSourceData.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium text-sm">{source.source}</div>
                        <div className="text-xs text-muted-foreground">
                          {source.count} leads • {formatCurrency(source.value)} value
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {source.roi}% ROI
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Cost: {formatCurrency(source.cost)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Competitive Analysis */}
        <TabsContent value="competitive" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Competitive Positioning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  Competitive Win Rate Analysis
                </CardTitle>
                <CardDescription>Performance vs key competitors</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={competitorData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => [`${value}%`, "Win Rate"]} />
                    <Bar dataKey="winRate" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Market Share Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-indigo-600" />
                  Market Share Distribution
                </CardTitle>
                <CardDescription>Competitive landscape overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={competitorData}
                      dataKey="marketShare"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                    >
                      {competitorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Competitive Intelligence Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Competitive Intelligence Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Market Position</div>
                  <div className="text-2xl font-bold text-blue-600">#2</div>
                  <div className="text-xs text-muted-foreground">By win rate</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Avg Bid Ratio</div>
                  <div className="text-2xl font-bold text-green-600">0.94</div>
                  <div className="text-xs text-muted-foreground">Competitive pricing</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Key Advantage</div>
                  <div className="text-2xl font-bold text-purple-600">Quality</div>
                  <div className="text-xs text-muted-foreground">Premium positioning</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 