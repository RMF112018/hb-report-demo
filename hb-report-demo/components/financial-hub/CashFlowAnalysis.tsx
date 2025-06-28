"use client";

import { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Droplets,
  PieChart as PieChartIcon,
  BarChart3,
  Target,
  Activity,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Building2,
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
} from "recharts";

interface CashFlowAnalysisProps {
  userRole: string;
  projectData: any;
}

// Mock cash flow data - in production this would come from the API
const cashFlowData = {
  projects: [
    {
      project_id: 2525840,
      name: "Palm Beach Luxury Estate",
      cashFlowData: {
        summary: {
          totalInflows: 53476271.19,
          totalOutflows: 45261264.55,
          netCashFlow: 8215006.64,
          peakCashRequirement: 132675.42,
          cashFlowAtRisk: 0,
          workingCapital: 9732503.32,
          lastUpdated: "2025-06-24T07:24:59Z"
        },
        monthlyData: [
          {
            month: "2024-06",
            inflows: { ownerPayments: 133320.63, loans: 0.0, changeOrders: 0.0, retentionRelease: 0.0, other: 14813.4, total: 148134.03 },
            outflows: { subcontractorPayments: 112323.78, materialCosts: 84242.84, laborCosts: 42121.42, equipmentCosts: 28080.95, overhead: 14040.47, other: -0.01, total: 280809.45 },
            netCashFlow: -132675.42,
            cumulativeCashFlow: -132675.42,
            workingCapital: 5558662.29,
            retentionHeld: 6666.03,
            forecastAccuracy: 0.86
          },
          {
            month: "2024-07",
            inflows: { ownerPayments: 316085.54, loans: 0.0, changeOrders: 0.0, retentionRelease: 0.0, other: 35120.61, total: 351206.15 },
            outflows: { subcontractorPayments: 99730.83, materialCosts: 74798.12, laborCosts: 37399.06, equipmentCosts: 24932.71, overhead: 12466.35, other: 0.01, total: 249327.08 },
            netCashFlow: 101879.07,
            cumulativeCashFlow: -30796.35,
            workingCapital: 5609601.83,
            retentionHeld: 22470.31,
            forecastAccuracy: 0.92
          },
          {
            month: "2024-08",
            inflows: { ownerPayments: 617104.99, loans: 0.0, changeOrders: 0.0, retentionRelease: 0.0, other: 68567.22, total: 685672.21 },
            outflows: { subcontractorPayments: 189872.59, materialCosts: 142404.44, laborCosts: 71202.22, equipmentCosts: 47468.15, overhead: 23734.07, other: 0.01, total: 474681.48 },
            netCashFlow: 210990.73,
            cumulativeCashFlow: 180194.38,
            workingCapital: 5715097.19,
            retentionHeld: 53325.56,
            forecastAccuracy: 0.92
          },
          {
            month: "2024-09",
            inflows: { ownerPayments: 825770.46, loans: 0.0, changeOrders: 0.0, retentionRelease: 0.0, other: 91752.27, total: 917522.73 },
            outflows: { subcontractorPayments: 284976.9, materialCosts: 213732.67, laborCosts: 106866.34, equipmentCosts: 71244.22, overhead: 35622.11, other: 0.0, total: 712442.24 },
            netCashFlow: 205080.49,
            cumulativeCashFlow: 385274.87,
            workingCapital: 5817637.44,
            retentionHeld: 94614.08,
            forecastAccuracy: 0.93
          },
          {
            month: "2024-10",
            inflows: { ownerPayments: 987607.7, loans: 0.0, changeOrders: 0.0, retentionRelease: 0.0, other: 109734.19, total: 1097341.89 },
            outflows: { subcontractorPayments: 409038.98, materialCosts: 306779.24, laborCosts: 153389.62, equipmentCosts: 102259.75, overhead: 51129.87, other: 0.0, total: 1022597.46 },
            netCashFlow: 74744.43,
            cumulativeCashFlow: 460019.3,
            workingCapital: 5855009.65,
            retentionHeld: 143994.47,
            forecastAccuracy: 0.94
          },
          {
            month: "2024-11",
            inflows: { ownerPayments: 1140582.92, loans: 0.0, changeOrders: 10595.76, retentionRelease: 0.0, other: 116135.67, total: 1267314.35 },
            outflows: { subcontractorPayments: 453275.24, materialCosts: 339956.43, laborCosts: 169978.21, equipmentCosts: 113318.81, overhead: 56659.41, other: 0.0, total: 1133188.1 },
            netCashFlow: 134126.25,
            cumulativeCashFlow: 594145.55,
            workingCapital: 5922072.78,
            retentionHeld: 201023.62,
            forecastAccuracy: 0.94
          }
        ]
      }
    }
  ]
};

// Advanced analytics data for insights
const advancedMetrics = {
  forecastAccuracy: {
    current: 0.92,
    trend: "improving",
    target: 0.95
  },
  liquidityRatio: 4.2,
  daysOfCashOnHand: 45,
  burnRate: 850000,
  riskFactors: [
    { factor: "Seasonal Fluctuations", impact: "medium", probability: 0.6 },
    { factor: "Payment Delays", impact: "high", probability: 0.3 },
    { factor: "Cost Overruns", impact: "medium", probability: 0.4 }
  ]
};

const inflowBreakdown = [
  { name: "Owner Payments", value: 4719691.76, color: "#3b82f6", percentage: 88.2 },
  { name: "Change Orders", value: 10595.76, color: "#10b981", percentage: 0.2 },
  { name: "Other", value: 614351.98, color: "#f59e0b", percentage: 11.6 },
];

const outflowBreakdown = [
  { name: "Subcontractors", value: 2023661.32, color: "#ef4444", percentage: 45.2 },
  { name: "Materials", value: 1591761.76, color: "#8b5cf6", percentage: 35.6 },
  { name: "Labor", value: 795880.88, color: "#06b6d4", percentage: 17.8 },
  { name: "Equipment", value: 530587.25, color: "#f97316", percentage: 11.9 },
  { name: "Overhead", value: 265293.62, color: "#84cc16", percentage: 5.9 },
];

/**
 * Cash Flow Analysis Component
 *
 * Provides comprehensive cash flow analysis including:
 * - Real-time cash flow monitoring
 * - Predictive analytics and forecasting
 * - Risk assessment and liquidity analysis
 * - Interactive visualizations
 *
 * @param userRole - Current user role for permissions
 * @param projectData - Project context data
 */
export default function CashFlowAnalysis({ userRole, projectData }: CashFlowAnalysisProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [viewType, setViewType] = useState<"monthly" | "cumulative" | "forecast">("monthly");

  // Get project-specific data
  const projectCashFlow = cashFlowData.projects[0]; // In production, filter by project
  const summary = projectCashFlow.cashFlowData.summary;
  const monthlyData = projectCashFlow.cashFlowData.monthlyData;

  // Calculate key metrics
  const totalInflows = summary.totalInflows;
  const totalOutflows = summary.totalOutflows;
  const netCashFlow = summary.netCashFlow;
  const workingCapital = summary.workingCapital;
  const peakRequirement = summary.peakCashRequirement;

  // Calculate performance metrics
  const cashFlowMargin = ((netCashFlow / totalInflows) * 100);
  const averageMonthlyInflow = totalInflows / monthlyData.length;
  const averageMonthlyOutflow = totalOutflows / monthlyData.length;
  const forecastAccuracy = monthlyData.reduce((sum, m) => sum + m.forecastAccuracy, 0) / monthlyData.length;

  // Transform data for charts
  const chartData = monthlyData.map(month => ({
    month: new Date(month.month).toLocaleDateString('en-US', { month: 'short' }),
    inflows: month.inflows.total,
    outflows: month.outflows.total,
    netCashFlow: month.netCashFlow,
    cumulativeCashFlow: month.cumulativeCashFlow,
    workingCapital: month.workingCapital,
    retentionHeld: month.retentionHeld,
    forecastAccuracy: month.forecastAccuracy * 100,
  }));

  // Risk assessment
  const riskLevel = peakRequirement > 200000 ? "high" : 
                   peakRequirement > 100000 ? "medium" : "low";

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Inflows</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              ${(totalInflows / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Avg: ${(averageMonthlyInflow / 1000).toFixed(0)}K/month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Total Outflows</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              ${(totalOutflows / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-red-600 dark:text-red-400">
              Avg: ${(averageMonthlyOutflow / 1000).toFixed(0)}K/month
            </p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${netCashFlow >= 0 ? 
          "from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800" : 
          "from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${netCashFlow >= 0 ? 
              "text-emerald-700 dark:text-emerald-300" : 
              "text-amber-700 dark:text-amber-300"}`}>
              Net Cash Flow
            </CardTitle>
            <Droplets className={`h-4 w-4 ${netCashFlow >= 0 ? 
              "text-emerald-600 dark:text-emerald-400" : 
              "text-amber-600 dark:text-amber-400"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netCashFlow >= 0 ? 
              "text-emerald-900 dark:text-emerald-100" : 
              "text-amber-900 dark:text-amber-100"}`}>
              ${(netCashFlow / 1000000).toFixed(1)}M
            </div>
            <p className={`text-xs ${netCashFlow >= 0 ? 
              "text-emerald-600 dark:text-emerald-400" : 
              "text-amber-600 dark:text-amber-400"}`}>
              Margin: {cashFlowMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Working Capital</CardTitle>
            <Banknote className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              ${(workingCapital / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Liquidity ratio: {advancedMetrics.liquidityRatio}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics */}
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
            <Activity className="h-5 w-5" />
            HBI Cash Flow Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Forecast Accuracy</p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  Current accuracy at {(forecastAccuracy * 100).toFixed(1)}% with improving trend. Target: 95%
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Cash Runway</p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  {advancedMetrics.daysOfCashOnHand} days of operations covered by current working capital
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
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Forecast
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Breakdown
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Cash Flow Trends */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  Cash Flow Trends
                </CardTitle>
                <CardDescription>Monthly inflows, outflows, and net cash flow</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip 
                      formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, ""]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar dataKey="inflows" fill="#10b981" name="Inflows" opacity={0.8} />
                    <Bar dataKey="outflows" fill="#ef4444" name="Outflows" opacity={0.8} />
                    <Line type="monotone" dataKey="netCashFlow" stroke="#3b82f6" strokeWidth={3} name="Net Flow" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cumulative Cash Flow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Cumulative Position
                </CardTitle>
                <CardDescription>Running cash flow balance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, ""]} />
                    <Area 
                      type="monotone" 
                      dataKey="cumulativeCashFlow" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name="Cumulative Flow"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Working Capital */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  Working Capital
                </CardTitle>
                <CardDescription>Available liquidity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, ""]} />
                    <Area 
                      type="monotone" 
                      dataKey="workingCapital" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.6}
                      name="Working Capital"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Forecast Accuracy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Forecast Accuracy
                </CardTitle>
                <CardDescription>Monthly prediction accuracy trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, ""]} />
                    <Line 
                      type="monotone" 
                      dataKey="forecastAccuracy" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Accuracy"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Risk Assessment
                </CardTitle>
                <CardDescription>Potential cash flow risk factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {advancedMetrics.riskFactors.map((risk, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{risk.factor}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={risk.impact === "high" ? "destructive" : risk.impact === "medium" ? "secondary" : "default"}>
                            {risk.impact}
                          </Badge>
                          <span className="text-muted-foreground">{(risk.probability * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <Progress value={risk.probability * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Inflow Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                  Inflow Sources
                </CardTitle>
                <CardDescription>Revenue stream distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={inflowBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {inflowBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {inflowBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">${(item.value / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Outflow Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownRight className="h-5 w-5 text-red-600" />
                  Outflow Categories
                </CardTitle>
                <CardDescription>Expense category distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={outflowBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {outflowBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {outflowBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">${(item.value / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Burn Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(advancedMetrics.burnRate / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground">Monthly spending rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cash Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{advancedMetrics.daysOfCashOnHand}</div>
                <p className="text-xs text-muted-foreground">Days of operations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Peak Requirement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(peakRequirement / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground">Maximum negative flow</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Efficiency Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{(forecastAccuracy * 100).toFixed(0)}%</div>
                <p className="text-xs text-muted-foreground">Forecast accuracy</p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Monthly Performance Summary
              </CardTitle>
              <CardDescription>Detailed monthly cash flow analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Month</th>
                      <th className="text-right p-2">Inflows</th>
                      <th className="text-right p-2">Outflows</th>
                      <th className="text-right p-2">Net Flow</th>
                      <th className="text-right p-2">Cumulative</th>
                      <th className="text-right p-2">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((month, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{month.month}</td>
                        <td className="text-right p-2 text-green-600">
                          ${(month.inflows / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right p-2 text-red-600">
                          ${(month.outflows / 1000).toFixed(0)}K
                        </td>
                        <td className={`text-right p-2 font-medium ${
                          month.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${(month.netCashFlow / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right p-2">
                          ${(month.cumulativeCashFlow / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right p-2">
                          <Badge variant={month.forecastAccuracy >= 95 ? "default" : month.forecastAccuracy >= 90 ? "secondary" : "destructive"}>
                            {month.forecastAccuracy.toFixed(0)}%
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
      </Tabs>
    </div>
  );
} 