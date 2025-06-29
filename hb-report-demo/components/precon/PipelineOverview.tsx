"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building2, 
  Trophy,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  PieChart,
  BarChart3,
  Zap,
  Lightbulb,
  Brain,
  ArrowRight,
  Filter,
  Calendar,
  MapPin,
  Award,
  Star,
  Eye,
  Info
} from "lucide-react"
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
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
  AreaChart
} from "recharts"

interface PipelineOverviewProps {
  pipelineData: any[]
  summaryStats: any
  userRole: string
}

const COLORS = {
  lead: "#ef4444",      // Red for Lead stage
  proposal: "#f59e0b",  // Amber for Proposal stage  
  negotiation: "#3b82f6", // Blue for Negotiation stage
  award: "#10b981",     // Green for Award stage
  residential: "#06b6d4", // Cyan for Residential
  commercial: "#8b5cf6"   // Purple for Commercial
}

export function PipelineOverview({ pipelineData, summaryStats, userRole }: PipelineOverviewProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")
  const [selectedDivision, setSelectedDivision] = useState("all")

  // Process pipeline funnel data
  const funnelData = useMemo(() => {
    const stages = ["Lead", "Proposal", "Negotiation", "Award"]
    return stages.map((stageName, index) => {
      const stageData = summaryStats.stageDistribution[stageName] || { count: 0, value: 0 }
      return {
        name: stageName,
        value: stageData.value,
        count: stageData.count,
        fill: Object.values(COLORS)[index]
      }
    }).filter(stage => stage.value > 0)
  }, [summaryStats])

  // Process division breakdown
  const divisionData = useMemo(() => {
    return Object.entries(summaryStats.divisionBreakdown || {}).map(([division, data]: [string, any]) => ({
      name: division,
      value: data.value,
      weightedValue: data.weightedValue,
      count: data.count,
      fill: division === "Residential" ? COLORS.residential : COLORS.commercial
    }))
  }, [summaryStats])

  // Generate trend data (mock historical data)
  const trendData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((month, index) => ({
      month,
      pipeline: summaryStats.totalPipelineValue * (0.8 + Math.random() * 0.4),
      weighted: summaryStats.probabilityWeightedValue * (0.8 + Math.random() * 0.4),
      winRate: summaryStats.winRate * (0.9 + Math.random() * 0.2)
    }))
  }, [summaryStats])

  // Top opportunities analysis
  const topOpportunities = useMemo(() => {
    return pipelineData
      .sort((a, b) => b.config.pipelineValue - a.config.pipelineValue)
      .slice(0, 5)
      .map((item, index) => ({
        rank: index + 1,
        title: item.title,
        division: item.division,
        value: item.config.pipelineValue,
        probability: item.config.probabilityWeighted / item.config.pipelineValue * 100,
        location: item.location,
        type: item.type,
        expectedStart: item.anticipated_start
      }))
  }, [pipelineData])

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Funnel Analysis */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Pipeline Funnel Analysis
            </CardTitle>
            <CardDescription>
              Opportunity progression through sales stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <FunnelChart>
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive
                  labelLine={false}
                >
                  <LabelList position="center" fill="#fff" fontSize={12} />
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Funnel>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), "Value"]}
                  labelFormatter={(label: string) => `${label} Stage`}
                />
              </FunnelChart>
            </ResponsiveContainer>
            
            {/* Stage Breakdown */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {funnelData.map((stage, index) => (
                <div key={stage.name} className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">{stage.name}</div>
                  <div className="text-lg font-bold" style={{ color: stage.fill }}>
                    {stage.count}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(stage.value)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* HBI Pipeline Intelligence */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
              <Brain className="h-5 w-5" />
              HBI Pipeline Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    Opportunity Focus
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    {divisionData.length > 0 && divisionData[0].name} division shows highest win probability at {summaryStats.winRate.toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    Pipeline Momentum
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    Weighted pipeline value at {formatCurrency(summaryStats.probabilityWeightedValue)} indicates strong momentum
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    Action Required
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    {funnelData.find(stage => stage.name === "Proposal")?.count || 0} proposals need immediate attention
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    Conversion Optimization
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    Focus on lead qualification to improve {summaryStats.conversionRate.toFixed(1)}% conversion rate
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-700 dark:text-purple-300">Pipeline Health</span>
                <Badge 
                  variant={summaryStats.pipelineHealth >= 75 ? "default" : "secondary"}
                  className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200"
                >
                  {summaryStats.pipelineHealth.toFixed(0)}%
                </Badge>
              </div>
              <Progress 
                value={summaryStats.pipelineHealth} 
                className="mt-2 h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Division & Size Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Division Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600" />
              Division Distribution
            </CardTitle>
            <CardDescription>
              Pipeline breakdown by division
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={divisionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {divisionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [formatCurrency(value), "Pipeline Value"]} />
              </RechartsPieChart>
            </ResponsiveContainer>
            
            {/* Division Metrics */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {divisionData.map((division, index) => (
                <div key={division.name} className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">{division.name}</div>
                  <div className="text-lg font-bold" style={{ color: division.fill }}>
                    {division.count}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(division.weightedValue)} weighted
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Pipeline Trends
            </CardTitle>
            <CardDescription>
              6-month pipeline and win rate trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === "winRate" ? `${value.toFixed(1)}%` : formatCurrency(value),
                    name === "pipeline" ? "Pipeline" : name === "weighted" ? "Weighted" : "Win Rate"
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="pipeline"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Total Pipeline"
                />
                <Area
                  type="monotone"
                  dataKey="weighted"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Weighted Value"
                />
                <Line 
                  type="monotone" 
                  dataKey="winRate" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  name="Win Rate %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Top Opportunities */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest wins and losses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="wins" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="wins" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Recent Wins ({summaryStats.recentWins?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="losses" className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Recent Losses ({summaryStats.recentLosses?.length || 0})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="wins" className="space-y-3">
                {summaryStats.recentWins?.map((win: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <div>
                      <div className="font-medium text-green-900 dark:text-green-100">{win.name}</div>
                      <div className="text-sm text-green-700 dark:text-green-300">{win.division}</div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                      {formatCurrency(win.value)}
                    </Badge>
                  </div>
                )) || (
                  <div className="text-center py-6 text-muted-foreground">
                    <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent wins to display</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="losses" className="space-y-3">
                {summaryStats.recentLosses?.map((loss: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <div>
                      <div className="font-medium text-red-900 dark:text-red-100">{loss.name}</div>
                      <div className="text-sm text-red-700 dark:text-red-300">{loss.division}</div>
                    </div>
                    <Badge variant="outline" className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200">
                      {formatCurrency(loss.value)}
                    </Badge>
                  </div>
                )) || (
                  <div className="text-center py-6 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent losses</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Top Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-600" />
              Top Opportunities
            </CardTitle>
            <CardDescription>
              Highest value opportunities in pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topOpportunities.map((opportunity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {opportunity.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-foreground truncate">
                        {opportunity.title}
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {formatCurrency(opportunity.value)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {opportunity.division}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {opportunity.location?.city}, {opportunity.location?.state}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(opportunity.expectedStart)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Probability</span>
                        <span className="font-medium">{opportunity.probability.toFixed(1)}%</span>
                      </div>
                      <Progress value={opportunity.probability} className="mt-1 h-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 