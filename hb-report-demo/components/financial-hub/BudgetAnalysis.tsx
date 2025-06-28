"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Activity,
  PieChart as PieChartIcon,
  BarChart3,
  Layers,
  DollarSign,
  Percent,
  Calendar,
  Settings,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  FileText,
  Zap,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
} from "recharts";

interface BudgetAnalysisProps {
  userRole: string;
  projectData: any;
}

// Enhanced role-based budget data with realistic scaling
const getRoleBasedBudgetData = (role: string) => {
  const baseData = {
    'project-manager': {
      totalOriginalBudget: 57235491,
      totalRevisedBudget: 58100000,
      totalActualCosts: 45250000,
      totalCommittedCosts: 52800000,
      totalForecastToComplete: 8950000,
      totalEstimatedAtCompletion: 54200000,
      contingencyAvailable: 3900000,
      changeOrderTotal: 864509,
      budgetVariance: 3900000,
      utilizationRate: 0.785,
      completionPercentage: 0.778,
      costPerformanceIndex: 1.072,
      schedulePerformanceIndex: 0.965,
      projectCount: 1
    },
    'project-executive': {
      totalOriginalBudget: 285476455,
      totalRevisedBudget: 290500000,
      totalActualCosts: 226250000,
      totalCommittedCosts: 264000000,
      totalForecastToComplete: 44750000,
      totalEstimatedAtCompletion: 271000000,
      contingencyAvailable: 19500000,
      changeOrderTotal: 5024509,
      budgetVariance: 19500000,
      utilizationRate: 0.778,
      completionPercentage: 0.765,
      costPerformanceIndex: 1.068,
      schedulePerformanceIndex: 0.951,
      projectCount: 6
    },
    'executive': {
      totalOriginalBudget: 485280760,
      totalRevisedBudget: 492500000,
      totalActualCosts: 384200000,
      totalCommittedCosts: 448800000,
      totalForecastToComplete: 76000000,
      totalEstimatedAtCompletion: 460200000,
      contingencyAvailable: 32300000,
      changeOrderTotal: 7219240,
      budgetVariance: 32300000,
      utilizationRate: 0.780,
      completionPercentage: 0.772,
      costPerformanceIndex: 1.070,
      schedulePerformanceIndex: 0.958,
      projectCount: 12
    }
  };
  
  return baseData[role as keyof typeof baseData] || baseData['executive'];
};

// Mock budget breakdown by categories
const budgetCategories = [
  {
    category: "General Conditions",
    budgeted: 8500000,
    actual: 7200000,
    committed: 7800000,
    forecast: 8100000,
    variance: 400000,
    variancePercent: 4.7,
    color: "#3b82f6"
  },
  {
    category: "Main Construction",
    budgeted: 32500000,
    actual: 28200000,
    committed: 30800000,
    forecast: 31200000,
    variance: 1300000,
    variancePercent: 4.0,
    color: "#10b981"
  },
  {
    category: "Materials",
    budgeted: 12800000,
    actual: 10950000,
    committed: 12100000,
    forecast: 12400000,
    variance: 400000,
    variancePercent: 3.1,
    color: "#f59e0b"
  },
  {
    category: "Labor",
    budgeted: 15200000,
    actual: 13500000,
    committed: 14800000,
    forecast: 15000000,
    variance: 200000,
    variancePercent: 1.3,
    color: "#ef4444"
  },
  {
    category: "Equipment",
    budgeted: 6800000,
    actual: 5950000,
    committed: 6400000,
    forecast: 6600000,
    variance: 200000,
    variancePercent: 2.9,
    color: "#8b5cf6"
  },
  {
    category: "Subcontractors",
    budgeted: 18500000,
    actual: 16200000,
    committed: 17800000,
    forecast: 18100000,
    variance: 400000,
    variancePercent: 2.2,
    color: "#06b6d4"
  }
];

// Monthly budget performance data
const monthlyPerformance = [
  { month: "Jan", budgeted: 2800000, actual: 2650000, forecast: 2750000, variance: 150000, cpi: 1.06 },
  { month: "Feb", budgeted: 3200000, actual: 3100000, forecast: 3150000, variance: 100000, cpi: 1.03 },
  { month: "Mar", budgeted: 4100000, actual: 3950000, forecast: 4050000, variance: 150000, cpi: 1.04 },
  { month: "Apr", budgeted: 5200000, actual: 4980000, forecast: 5100000, variance: 220000, cpi: 1.04 },
  { month: "May", budgeted: 6800000, actual: 6450000, forecast: 6650000, variance: 350000, cpi: 1.05 },
  { month: "Jun", budgeted: 8500000, actual: 8100000, forecast: 8300000, variance: 400000, cpi: 1.05 },
  { month: "Jul", budgeted: 10200000, actual: 9750000, forecast: 10000000, variance: 450000, cpi: 1.05 },
  { month: "Aug", budgeted: 12100000, actual: 11600000, forecast: 11900000, variance: 500000, cpi: 1.04 },
];

// Risk factors and insights
const budgetRisks = [
  {
    category: "Material Cost Escalation",
    impact: "high",
    probability: 0.7,
    potentialCost: 2500000,
    mitigation: "Lock in supplier contracts, bulk purchasing"
  },
  {
    category: "Schedule Delays",
    impact: "medium", 
    probability: 0.4,
    potentialCost: 1200000,
    mitigation: "Enhanced project controls, resource optimization"
  },
  {
    category: "Change Order Volume",
    impact: "medium",
    probability: 0.6,
    potentialCost: 1800000,
    mitigation: "Improved design documentation, stakeholder alignment"
  },
  {
    category: "Weather Impact",
    impact: "low",
    probability: 0.3,
    potentialCost: 600000,
    mitigation: "Seasonal planning, contingency buffers"
  }
];

// Cost control metrics
const costControlMetrics = [
  { metric: "Budget Adherence", current: 96.2, target: 95.0, trend: "improving" },
  { metric: "Change Order Control", current: 2.1, target: 3.0, trend: "stable" },
  { metric: "Cost Forecast Accuracy", current: 94.8, target: 92.0, trend: "improving" },
  { metric: "Contingency Utilization", current: 23.5, target: 30.0, trend: "controlled" }
];

/**
 * Budget Analysis Component
 *
 * Provides comprehensive budget analysis including:
 * - Real-time budget vs actual performance tracking
 * - Cost category breakdown and variance analysis
 * - Predictive cost modeling and risk assessment
 * - Role-based data views and insights
 *
 * @param userRole - Current user role for data filtering
 * @param projectData - Project context data
 */
export default function BudgetAnalysis({ userRole, projectData }: BudgetAnalysisProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("YTD");
  const [viewMode, setViewMode] = useState<"summary" | "detailed" | "forecast">("summary");

  // Get role-based budget data
  const budgetData = getRoleBasedBudgetData(userRole);

  // Calculate key performance indicators
  const budgetUtilization = (budgetData.totalActualCosts / budgetData.totalRevisedBudget) * 100;
  const remainingBudget = budgetData.totalRevisedBudget - budgetData.totalActualCosts;
  const projectedVariance = budgetData.totalRevisedBudget - budgetData.totalEstimatedAtCompletion;
  const changeOrderImpact = (budgetData.changeOrderTotal / budgetData.totalOriginalBudget) * 100;

  // Performance status
  const getPerformanceStatus = (variance: number) => {
    if (variance > 0) return { status: "under", color: "text-green-600", icon: CheckCircle };
    if (variance > -500000) return { status: "on-track", color: "text-yellow-600", icon: AlertTriangle };
    return { status: "over", color: "text-red-600", icon: XCircle };
  };

  const performanceStatus = getPerformanceStatus(projectedVariance);

  // Risk level assessment
  const riskLevel = budgetData.costPerformanceIndex < 0.95 ? "high" : 
                   budgetData.costPerformanceIndex < 1.05 ? "medium" : "low";

  return (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Total Budget</CardTitle>
            <Calculator className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              ${(budgetData.totalRevisedBudget / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Original: ${(budgetData.totalOriginalBudget / 1000000).toFixed(1)}M
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Actual Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              ${(budgetData.totalActualCosts / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {budgetUtilization.toFixed(1)}% utilized
            </p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${projectedVariance >= 0 ? 
          "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800" : 
          "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${projectedVariance >= 0 ? 
              "text-green-700 dark:text-green-300" : 
              "text-red-700 dark:text-red-300"}`}>
              Budget Variance
            </CardTitle>
            {projectedVariance >= 0 ? 
              <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" /> :
              <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
            }
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${projectedVariance >= 0 ? 
              "text-green-900 dark:text-green-100" : 
              "text-red-900 dark:text-red-100"}`}>
              {projectedVariance >= 0 ? '+' : ''}${(projectedVariance / 1000000).toFixed(1)}M
            </div>
            <p className={`text-xs ${projectedVariance >= 0 ? 
              "text-green-600 dark:text-green-400" : 
              "text-red-600 dark:text-red-400"}`}>
              {((projectedVariance / budgetData.totalRevisedBudget) * 100).toFixed(1)}% vs budget
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">CPI Score</CardTitle>
            <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {budgetData.costPerformanceIndex.toFixed(2)}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {budgetData.costPerformanceIndex > 1 ? 'Under' : 'Over'} budget performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* HBI Budget Intelligence */}
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
            <Zap className="h-5 w-5" />
            HBI Budget Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-start gap-3">
              <performanceStatus.icon className={`h-5 w-5 mt-0.5 ${performanceStatus.color}`} />
              <div>
                <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Budget Status</p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  Currently tracking {performanceStatus.status} budget with CPI of {budgetData.costPerformanceIndex.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Percent className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Completion Rate</p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  {(budgetData.completionPercentage * 100).toFixed(1)}% complete with optimal resource utilization
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Risk Level</p>
                <Badge variant={riskLevel === "high" ? "destructive" : riskLevel === "medium" ? "secondary" : "default"}>
                  {riskLevel.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Portfolio Scope</p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  Analyzing {budgetData.projectCount} project{budgetData.projectCount > 1 ? 's' : ''} totaling ${(budgetData.totalRevisedBudget / 1000000).toFixed(0)}M
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="variance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Variance
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Forecast
          </TabsTrigger>
          <TabsTrigger value="controls" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Controls
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Budget Performance Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Budget vs Actual Performance
                </CardTitle>
                <CardDescription>Monthly budget tracking and performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip 
                      formatter={(value: number) => [`$${(value / 1000000).toFixed(1)}M`, ""]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar dataKey="budgeted" fill="#3b82f6" name="Budgeted" opacity={0.6} />
                    <Bar dataKey="actual" fill="#10b981" name="Actual" opacity={0.8} />
                    <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={3} name="Forecast" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Budget Utilization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-green-600" />
                  Budget Utilization
                </CardTitle>
                <CardDescription>Current budget consumption analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Utilization</span>
                    <span className="text-2xl font-bold text-green-600">
                      {budgetUtilization.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={budgetUtilization} className="h-4" />
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining Budget</p>
                      <p className="text-lg font-semibold">${(remainingBudget / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Burn Rate</p>
                      <p className="text-lg font-semibold">${(budgetData.totalActualCosts / 8 / 1000000).toFixed(1)}M/mo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Performance Index Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Performance Trends
                </CardTitle>
                <CardDescription>Cost and schedule performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cost Performance Index</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={budgetData.costPerformanceIndex >= 1 ? "default" : "destructive"}>
                        {budgetData.costPerformanceIndex.toFixed(2)}
                      </Badge>
                      {budgetData.costPerformanceIndex >= 1 ? 
                        <TrendingUp className="h-4 w-4 text-green-600" /> :
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      }
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Schedule Performance Index</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={budgetData.schedulePerformanceIndex >= 1 ? "default" : "secondary"}>
                        {budgetData.schedulePerformanceIndex.toFixed(2)}
                      </Badge>
                      {budgetData.schedulePerformanceIndex >= 1 ? 
                        <TrendingUp className="h-4 w-4 text-green-600" /> :
                        <TrendingDown className="h-4 w-4 text-yellow-600" />
                      }
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Change Order Impact</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={changeOrderImpact <= 3 ? "default" : "destructive"}>
                        {changeOrderImpact.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Category Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-indigo-600" />
                  Budget by Category
                </CardTitle>
                <CardDescription>Budget allocation across cost categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={budgetCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="budgeted"
                    >
                      {budgetCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {budgetCategories.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.category}</span>
                      </div>
                      <span className="font-medium">${(item.budgeted / 1000000).toFixed(1)}M</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Category Performance
                </CardTitle>
                <CardDescription>Budget vs actual by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetCategories} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                    <YAxis dataKey="category" type="category" width={100} />
                    <Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Bar dataKey="budgeted" fill="#3b82f6" name="Budgeted" />
                    <Bar dataKey="actual" fill="#10b981" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Category Details Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                Detailed Category Analysis
              </CardTitle>
              <CardDescription>Comprehensive breakdown of budget performance by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Category</th>
                      <th className="text-right p-2">Budgeted</th>
                      <th className="text-right p-2">Actual</th>
                      <th className="text-right p-2">Forecast</th>
                      <th className="text-right p-2">Variance</th>
                      <th className="text-right p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetCategories.map((category, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{category.category}</td>
                        <td className="text-right p-2">${(category.budgeted / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-2">${(category.actual / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-2">${(category.forecast / 1000000).toFixed(1)}M</td>
                        <td className={`text-right p-2 font-medium ${
                          category.variance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {category.variance >= 0 ? '+' : ''}${(category.variance / 1000000).toFixed(1)}M
                        </td>
                        <td className="text-right p-2">
                          <Badge variant={category.variancePercent >= 0 ? "default" : Math.abs(category.variancePercent) <= 5 ? "secondary" : "destructive"}>
                            {category.variancePercent >= 0 ? '+' : ''}{category.variancePercent.toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Variance Analysis Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  Budget Variance Analysis
                </CardTitle>
                <CardDescription>Monthly variance tracking and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
                    <Line 
                      type="monotone" 
                      dataKey="variance" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      name="Budget Variance"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* CPI Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  CPI Tracking
                </CardTitle>
                <CardDescription>Cost Performance Index over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0.95, 1.1]} tickFormatter={(value) => value.toFixed(2)} />
                    <Tooltip formatter={(value: number) => value.toFixed(2)} />
                    <Line 
                      type="monotone" 
                      dataKey="cpi" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="CPI"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Variances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Top Variances
                </CardTitle>
                <CardDescription>Categories with highest budget variances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {budgetCategories
                    .sort((a, b) => Math.abs(b.variancePercent) - Math.abs(a.variancePercent))
                    .slice(0, 4)
                    .map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{category.category}</p>
                          <p className="text-sm text-muted-foreground">
                            ${(category.variance / 1000000).toFixed(1)}M variance
                          </p>
                        </div>
                        <Badge variant={category.variancePercent >= 0 ? "default" : "destructive"}>
                          {category.variancePercent >= 0 ? '+' : ''}{category.variancePercent.toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Budget Risk Assessment
                </CardTitle>
                <CardDescription>Potential budget risks and impact analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetRisks.map((risk, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{risk.category}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={risk.impact === "high" ? "destructive" : risk.impact === "medium" ? "secondary" : "default"}>
                            {risk.impact}
                          </Badge>
                          <span className="text-muted-foreground">${(risk.potentialCost / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>
                      <Progress value={risk.probability * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">{risk.mitigation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Forecast Accuracy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Forecast Performance
                </CardTitle>
                <CardDescription>Budget forecasting accuracy metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">94.8%</div>
                    <p className="text-sm text-muted-foreground">Forecast Accuracy</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-semibold">${(budgetData.totalEstimatedAtCompletion / 1000000).toFixed(1)}M</div>
                      <p className="text-xs text-muted-foreground">Est. at Completion</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold">${(budgetData.totalForecastToComplete / 1000000).toFixed(1)}M</div>
                      <p className="text-xs text-muted-foreground">Forecast to Complete</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projected Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Project Completion Forecast
              </CardTitle>
              <CardDescription>Projected budget performance at completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ${(budgetData.totalRevisedBudget / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    ${(budgetData.totalEstimatedAtCompletion / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-sm text-muted-foreground">Estimated at Completion</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className={`text-2xl font-bold ${projectedVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {projectedVariance >= 0 ? '+' : ''}${(projectedVariance / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-sm text-muted-foreground">Projected Variance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          {/* Cost Control Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {costControlMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{metric.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metric.current.toFixed(1)}%
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Target: {metric.target.toFixed(1)}%</span>
                    <Badge variant={metric.trend === "improving" ? "default" : "secondary"}>
                      {metric.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Control Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-600" />
                Budget Control Actions
              </CardTitle>
              <CardDescription>Recommended actions for budget optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Performing Well</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Cost performance index above target</li>
                    <li>• Change order control within limits</li>
                    <li>• Forecast accuracy exceeding expectations</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Attention Needed</h4>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Material cost escalation monitoring</li>
                    <li>• Schedule performance improvement</li>
                    <li>• Enhanced change order documentation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 