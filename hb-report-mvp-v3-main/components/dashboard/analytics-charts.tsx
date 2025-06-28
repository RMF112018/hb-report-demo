'use client'; // Marks this component as client-side only to handle dynamic chart rendering and interactive elements

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Legend,
  Scatter,
  ScatterChart,
  ZAxis,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useState } from 'react';

/**
 * AnalyticsCharts Component
 * @description A dynamic analytics dashboard component that displays various project performance metrics
 *              using interactive charts and filters. Utilizes recharts for visualizations and is designed
 *              for client-side rendering to handle dynamic data and user interactions. Addresses rendering
 *              degradation by ensuring consistent styling and fallback colors.
 * @features
 * - Interactive tabs for trends, performance, forecasting, and risks
 * - Filterable by time range and metric type
 * - Responsive charts with tooltips and legends
 * - Mock data for comprehensive analytics
 */
interface AnalyticsChartsProps {
  filters: {
    project: string; // Selected project filter
    phase: string; // Selected phase filter
    department: string; // Selected department filter
    metricType: string; // Selected metric type filter
  }; // Object containing filter criteria
  searchQuery: string; // Search query to filter data
}

/**
 * Custom Color Configuration
 * @description Defines a set of colors for chart elements to ensure consistency and fallback rendering.
 */
const COLORS = {
  primary: '#3b82f6', // Blue for primary data
  secondary: '#10b981', // Green for secondary data
  accent: '#f59e0b', // Orange for accents
  danger: '#ef4444', // Red for warnings
  warning: '#f97316', // Dark orange for cautions
  success: '#22c55e', // Green for success
  info: '#06b6d4', // Cyan for info
  purple: '#8b5cf6', // Purple for highlights
};

export function AnalyticsCharts({ filters, searchQuery }: AnalyticsChartsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months'); // State for time range filter
  const [selectedMetric, setSelectedMetric] = useState('all'); // State for metric type filter

  /**
   * Progress Trend Data
   * @description Mock data for tracking planned, actual, and forecasted progress with budget metrics.
   */
  const progressTrendData = [
    { month: 'Jan', planned: 15, actual: 12, forecast: 14, budget: 1200000, spent: 1100000 },
    { month: 'Feb', planned: 30, actual: 28, forecast: 32, budget: 2400000, spent: 2200000 },
    { month: 'Mar', planned: 45, actual: 43, forecast: 47, budget: 3600000, spent: 3400000 },
    { month: 'Apr', planned: 60, actual: 55, forecast: 58, budget: 4800000, spent: 4600000 },
    { month: 'May', planned: 75, actual: 68, forecast: 72, budget: 6000000, spent: 5800000 },
    { month: 'Jun', planned: 90, actual: 87, forecast: 89, budget: 7200000, spent: 7000000 },
  ];

  /**
   * Cost Breakdown Data
   * @description Mock data for cost distribution across categories with budget comparisons.
   */
  const costBreakdownData = [
    { category: 'Labor', amount: 4200000, percentage: 42, budget: 4500000 },
    { category: 'Materials', amount: 3450000, percentage: 34.5, budget: 3200000 },
    { category: 'Equipment', amount: 1650000, percentage: 16.5, budget: 1800000 },
    { category: 'Overhead', amount: 700000, percentage: 7, budget: 900000 },
  ];

  /**
   * Performance Metrics Data
   * @description Mock data for project performance metrics, including schedule, cost, quality, and safety.
   */
  const performanceMetricsData = [
    { project: 'Panther Tower', schedule: 0.95, cost: 1.02, quality: 0.94, safety: 0.98, size: 12000000 },
    { project: 'Metro Office', schedule: 1.05, cost: 0.98, quality: 0.96, safety: 0.95, size: 8500000 },
    { project: 'Sandbox Test', schedule: 0.88, cost: 1.08, quality: 0.92, safety: 1.0, size: 3000000 },
    { project: 'Harbor View', schedule: 1.12, cost: 0.94, quality: 0.98, safety: 0.97, size: 15000000 },
  ];

  /**
   * Risk Analysis Data
   * @description Mock data for risk distribution across categories with high, medium, and low levels.
   */
  const riskAnalysisData = [
    { name: 'Schedule', high: 2, medium: 5, low: 8 },
    { name: 'Budget', high: 1, medium: 3, low: 12 },
    { name: 'Quality', high: 0, medium: 2, low: 14 },
    { name: 'Safety', high: 1, medium: 1, low: 15 },
    { name: 'Weather', high: 3, medium: 4, low: 6 },
  ];

  /**
   * Productivity Trend Data
   * @description Mock data for tracking weekly productivity, target, and efficiency metrics.
   */
  const productivityTrendData = [
    { week: 'W1', productivity: 85, target: 100, efficiency: 78 },
    { week: 'W2', productivity: 92, target: 100, efficiency: 85 },
    { week: 'W3', productivity: 105, target: 100, efficiency: 95 },
    { week: 'W4', productivity: 112, target: 100, efficiency: 102 },
    { week: 'W5', productivity: 108, target: 100, efficiency: 98 },
    { week: 'W6', productivity: 115, target: 100, efficiency: 108 },
    { week: 'W7', productivity: 118, target: 100, efficiency: 112 },
    { week: 'W8', productivity: 122, target: 100, efficiency: 115 },
  ];

  return (
    <div className="space-y-4">
      {/* Compact Analytics Header - Displays title and filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-sm text-gray-600">Performance insights and forecasting</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-full sm:w-32 h-8 text-xs">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-full sm:w-32 h-8 text-xs">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="cost">Cost</SelectItem>
              <SelectItem value="schedule">Schedule</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Compact KPIs - Key performance indicators with gradient backgrounds */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 rounded-lg">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-700">Schedule Performance</p>
                <p className="text-xl font-bold text-blue-900">0.97</p>
                <p className="text-xs text-blue-600">SPI Index</p>
              </div>
              <div className="p-1.5 bg-blue-200 rounded-full">
                <Calendar className="h-4 w-4 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 rounded-lg">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-700">Cost Performance</p>
                <p className="text-xl font-bold text-green-900">1.02</p>
                <p className="text-xs text-green-600">CPI Index</p>
              </div>
              <div className="p-1.5 bg-green-200 rounded-full">
                <TrendingUp className="h-4 w-4 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 rounded-lg">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-700">Quality Index</p>
                <p className="text-xl font-bold text-purple-900">94%</p>
                <p className="text-xs text-purple-600">Above Target</p>
              </div>
              <div className="p-1.5 bg-purple-200 rounded-full">
                <CheckCircle className="h-4 w-4 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 rounded-lg">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-700">Risk Level</p>
                <p className="text-xl font-bold text-orange-900">Medium</p>
                <p className="text-xs text-orange-600">5 Active</p>
              </div>
              <div className="p-1.5 bg-orange-200 rounded-full">
                <AlertCircle className="h-4 w-4 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compact Analytics Tabs - Switchable views for different metrics */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-9">
          <TabsTrigger value="trends" className="text-xs">
            Trends
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-xs">
            Performance
          </TabsTrigger>
          <TabsTrigger value="forecasting" className="text-xs">
            Forecasting
          </TabsTrigger>
          <TabsTrigger value="risks" className="text-xs">
            Risks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-4 space-y-4">
          {/* Progress vs Budget Trend - More Compact */}
          <Card className="rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Project Progress & Budget</CardTitle>
              <CardDescription className="text-sm">Planned vs actual progress with budget tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  planned: { label: 'Planned Progress', color: COLORS.primary },
                  actual: { label: 'Actual Progress', color: COLORS.secondary },
                  forecast: { label: 'Forecast', color: COLORS.accent },
                  budget: { label: 'Budget', color: COLORS.info },
                  spent: { label: 'Spent', color: COLORS.warning },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={progressTrendData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#666" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar
                      yAxisId="right"
                      dataKey="budget"
                      fill={COLORS.info}
                      opacity={0.3}
                      name="Budget ($M)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="spent"
                      fill={COLORS.warning}
                      opacity={0.7}
                      name="Spent ($M)"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="planned"
                      stroke={COLORS.primary}
                      strokeWidth={2}
                      name="Planned %"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="actual"
                      stroke={COLORS.secondary}
                      strokeWidth={2}
                      name="Actual %"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="forecast"
                      stroke={COLORS.accent}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Forecast %"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Cost Breakdown and Productivity - Responsive Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card className="rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Cost Breakdown</CardTitle>
                <CardDescription className="text-sm">Budget vs actual by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    amount: { label: 'Actual', color: COLORS.primary },
                    budget: { label: 'Budget', color: COLORS.secondary },
                  }}
                  className="h-48"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costBreakdownData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" fontSize={12} />
                      <YAxis fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="budget" fill={COLORS.secondary} opacity={0.6} name="Budget" />
                      <Bar dataKey="amount" fill={COLORS.primary} name="Actual" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Productivity Trends</CardTitle>
                <CardDescription className="text-sm">Weekly productivity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    productivity: { label: 'Productivity', color: COLORS.primary },
                    target: { label: 'Target', color: COLORS.danger },
                    efficiency: { label: 'Efficiency', color: COLORS.secondary },
                  }}
                  className="h-48"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={productivityTrendData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" fontSize={12} />
                      <YAxis fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="efficiency"
                        stackId="1"
                        stroke={COLORS.secondary}
                        fill={COLORS.secondary}
                        opacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="productivity"
                        stackId="2"
                        stroke={COLORS.primary}
                        fill={COLORS.primary}
                        opacity={0.6}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke={COLORS.danger}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-4 space-y-4">
          {/* Project Performance Matrix - Compact */}
          <Card className="rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Project Performance Matrix</CardTitle>
              <CardDescription className="text-sm">
                Schedule vs Cost performance (bubble size = project value)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  schedule: { label: 'Schedule Performance', color: COLORS.primary },
                  cost: { label: 'Cost Performance', color: COLORS.secondary },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="schedule" name="Schedule Performance" domain={[0.8, 1.2]} fontSize={12} />
                    <YAxis dataKey="cost" name="Cost Performance" domain={[0.8, 1.2]} fontSize={12} />
                    <ZAxis dataKey="size" range={[50, 400]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Scatter data={performanceMetricsData} fill={COLORS.primary} />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics Grid - Compact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {performanceMetricsData.map((project, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow rounded-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm truncate">{project.project}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span>Schedule</span>
                      <Badge
                        variant={project.schedule >= 1 ? 'default' : 'destructive'}
                        className="text-xs px-1.5 py-0.5"
                      >
                        {(project.schedule * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Cost</span>
                      <Badge variant={project.cost <= 1 ? 'default' : 'destructive'} className="text-xs px-1.5 py-0.5">
                        {(project.cost * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Quality</span>
                      <Badge
                        variant={project.quality >= 0.95 ? 'default' : 'secondary'}
                        className="text-xs px-1.5 py-0.5"
                      >
                        {(project.quality * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Safety</span>
                      <Badge
                        variant={project.safety >= 0.95 ? 'default' : 'destructive'}
                        className="text-xs px-1.5 py-0.5"
                      >
                        {(project.safety * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Completion Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-900">Aug 15, 2024</div>
                  <p className="text-xs text-blue-700">Predicted completion</p>
                  <Badge variant="outline" className="text-blue-700 border-blue-300 text-xs">
                    87% confidence
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Cost Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-900">$11.8M</div>
                  <p className="text-xs text-green-700">Final cost estimate</p>
                  <Badge variant="outline" className="text-green-700 border-green-300 text-xs">
                    $200K under budget
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Risk Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-orange-900">Medium</div>
                  <p className="text-xs text-orange-700">Overall risk level</p>
                  <Badge variant="outline" className="text-orange-700 border-orange-300 text-xs">
                    Weather dependent
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forecast Timeline - Compact */}
          <Card className="rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Integrated Forecast Timeline</CardTitle>
              <CardDescription className="text-sm">Projected milestones and resource requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Target className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <div className="text-base font-medium mb-1">Integrated Timeline Forecast</div>
                  <p className="text-xs">Advanced predictive modeling with milestone tracking</p>
                  <p className="text-xs mt-1">Monte Carlo simulation and scenario planning</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="mt-4 space-y-4">
          {/* Risk Distribution - Compact */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card className="rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Risk Distribution</CardTitle>
                <CardDescription className="text-sm">Current risk levels by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    high: { label: 'High Risk', color: COLORS.danger },
                    medium: { label: 'Medium Risk', color: COLORS.warning },
                    low: { label: 'Low Risk', color: COLORS.success },
                  }}
                  className="h-48"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskAnalysisData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="high" stackId="a" fill={COLORS.danger} />
                      <Bar dataKey="medium" stackId="a" fill={COLORS.warning} />
                      <Bar dataKey="low" stackId="a" fill={COLORS.success} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Risk Impact Matrix</CardTitle>
                <CardDescription className="text-sm">Risk assessment for active projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 rounded-lg flex items-center justify-center relative">
                  <div className="absolute top-1 left-1 text-xs text-gray-500">High Impact</div>
                  <div className="absolute bottom-1 left-1 text-xs text-gray-500">Low Impact</div>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                    Low Probability
                  </div>
                  <div className="absolute bottom-1 right-1 text-xs text-gray-500">High Probability</div>

                  {/* Sample risk points */}
                  <div
                    className="absolute top-1/4 right-1/3 w-2.5 h-2.5 bg-red-500 rounded-full"
                    title="Weather Delays"
                  ></div>
                  <div
                    className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-yellow-500 rounded-full"
                    title="Material Costs"
                  ></div>
                  <div
                    className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-green-500 rounded-full"
                    title="Minor Delays"
                  ></div>

                  <div className="text-center text-gray-600">
                    <AlertCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Interactive Risk Matrix</p>
                    <p className="text-xs">Click for mitigation plans</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Mitigation Status - Compact */}
          <Card className="rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Risk Mitigation Progress</CardTitle>
              <CardDescription className="text-sm">Active risk mitigation strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    risk: 'Weather Delays',
                    status: 'In Progress',
                    progress: 60,
                    priority: 'High',
                    owner: 'Site Manager',
                  },
                  {
                    risk: 'Material Cost Increase',
                    status: 'Monitoring',
                    progress: 30,
                    priority: 'Medium',
                    owner: 'Procurement',
                  },
                  {
                    risk: 'Permit Approval Delay',
                    status: 'Resolved',
                    progress: 100,
                    priority: 'High',
                    owner: 'Project Manager',
                  },
                  { risk: 'Labor Shortage', status: 'Planning', progress: 15, priority: 'Medium', owner: 'HR Manager' },
                ].map((item, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{item.risk}</h4>
                        <Badge
                          variant={
                            item.priority === 'High'
                              ? 'destructive'
                              : item.priority === 'Medium'
                                ? 'default'
                                : 'secondary'
                          }
                          className="text-xs px-1.5 py-0.5"
                        >
                          {item.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">Owner: {item.owner}</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          item.progress === 100
                            ? 'bg-green-500'
                            : item.progress >= 50
                              ? 'bg-blue-500'
                              : 'bg-yellow-500'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{item.progress}% Complete</span>
                      <span>Target: End of month</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}