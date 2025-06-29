'use client'; // Marks this component as client-side only to handle dynamic chart rendering, interactive elements, and state management

import { useState } from 'react';
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
import { TrendingUp, BarChart3, PieChart, LineChart, Calendar, Target } from 'lucide-react';

/**
 * AdvancedAnalytics Component
 * @description A comprehensive analytics dashboard component providing detailed insights, trends, and
 *              forecasting for construction projects. Utilizes client-side rendering for dynamic data
 *              visualization and user interactions. Addresses rendering degradation by ensuring consistent
 *              styling with Tailwind CSS and fallback designs for charts.
 * @features
 * - Interactive tabs for trend analysis, forecasting, performance metrics, and comparisons
 * - Filterable by time range and metric type
 * - Mock data with placeholders for future chart integration
 * - Responsive design with color-coded status indicators
 */
interface AdvancedAnalyticsProps {
  filters: {
    project: string; // Selected project filter
    phase: string; // Selected phase filter
    department: string; // Selected department filter
    metricType: string; // Selected metric type filter
  }; // Object containing filter criteria
  searchQuery: string; // Search query to filter data
}

export function AdvancedAnalytics({ filters, searchQuery }: AdvancedAnalyticsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('3months'); // State for time range filter, default to 3 months
  const [selectedMetric, setSelectedMetric] = useState('progress'); // State for metric type filter, default to progress

  /**
   * Trend Analysis Data
   * @description Mock data array for trend analysis, including titles, descriptions, chart types,
   *              timeframes, insights, and status indicators.
   */
  const trendAnalysisData = [
    {
      id: 'progress-trend',
      title: 'Project Progress Trend',
      description: 'Overall project completion rate over time',
      type: 'line',
      timeframe: 'Last 6 months',
      insight: 'Progress has accelerated by 15% in the last quarter',
      status: 'positive',
    },
    {
      id: 'cost-trend',
      title: 'Cost Performance Trend',
      description: 'Budget utilization and variance tracking',
      type: 'area',
      timeframe: 'Last 12 months',
      insight: 'Cost variance reduced from 8% to 2.3% over 6 months',
      status: 'positive',
    },
    {
      id: 'resource-trend',
      title: 'Resource Utilization Trend',
      description: 'Equipment and labor utilization rates',
      type: 'bar',
      timeframe: 'Last 3 months',
      insight: 'Equipment utilization peaked at 94% in construction phase',
      status: 'neutral',
    },
  ];

  /**
   * Forecasting Data
   * @description Mock data array for forecasting metrics, including titles, predicted values,
   *              confidence levels, factors, and risk assessments.
   */
  const forecastingData = [
    {
      id: 'completion-forecast',
      title: 'Project Completion Forecast',
      predictedDate: '2024-08-15',
      confidence: 87,
      factors: ['Current progress rate', 'Resource availability', 'Weather patterns'],
      risk: 'low',
    },
    {
      id: 'cost-forecast',
      title: 'Final Cost Forecast',
      predictedCost: '$11.8M',
      variance: '-1.7%',
      confidence: 92,
      factors: ['Material price trends', 'Labor costs', 'Change orders'],
      risk: 'low',
    },
    {
      id: 'resource-forecast',
      title: 'Resource Demand Forecast',
      peakDemand: 'June 2024',
      confidence: 78,
      factors: ['Project timeline', 'Seasonal availability', 'Market conditions'],
      risk: 'medium',
    },
  ];

  /**
   * Performance Metrics
   * @description Mock data array for performance metrics, categorized by schedule, cost, and quality,
   *              with individual metric names, values, targets, and status.
   */
  const performanceMetrics = [
    {
      category: 'Schedule Performance',
      metrics: [
        { name: 'Schedule Performance Index (SPI)', value: 1.05, target: 1.0, status: 'good' },
        { name: 'Critical Path Variance', value: '-2 days', target: '0 days', status: 'good' },
        { name: 'Milestone Achievement Rate', value: '89%', target: '90%', status: 'warning' },
      ],
    },
    {
      category: 'Cost Performance',
      metrics: [
        { name: 'Cost Performance Index (CPI)', value: 1.02, target: 1.0, status: 'good' },
        { name: 'Budget Utilization Rate', value: '71%', target: '68%', status: 'warning' },
        { name: 'Cost Variance', value: '-2.3%', target: '0%', status: 'good' },
      ],
    },
    {
      category: 'Quality Performance',
      metrics: [
        { name: 'Quality Score', value: '94%', target: '95%', status: 'warning' },
        { name: 'Rework Rate', value: '3.2%', target: '5%', status: 'good' },
        { name: 'Inspection Pass Rate', value: '96%', target: '95%', status: 'good' },
      ],
    },
  ];

  /**
   * getStatusColor Function
   * @description Determines the text and background color based on the status of a metric.
   * @param {string} status - The status of the metric (good, warning, critical, or default)
   * @returns {string} Tailwind CSS classes for text and background colors
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  /**
   * getRiskColor Function
   * @description Determines the text and background color based on the risk level.
   * @param {string} risk - The risk level (low, medium, high, or default)
   * @returns {string} Tailwind CSS classes for text and background colors
   */
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  /**
   * getChartIcon Function
   * @description Returns the appropriate Lucide icon based on the chart type.
   * @param {string} type - The type of chart (line, bar, area, or default)
   * @returns {React.ReactNode} The corresponding icon component
   */
  const getChartIcon = (type: string) => {
    switch (type) {
      case 'line':
        return <LineChart className="h-5 w-5" />;
      case 'bar':
        return <BarChart3 className="h-5 w-5" />;
      case 'area':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <PieChart className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section - Displays title and filters with responsive layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <p className="text-gray-600">Detailed insights, trends, and forecasting for construction projects</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="cost">Cost</SelectItem>
              <SelectItem value="schedule">Schedule</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="comparisons">Comparisons</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-6">
          <div className="space-y-6">
            {trendAnalysisData.map((trend) => (
              <Card key={trend.id} className="rounded-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getChartIcon(trend.type)}
                      <div>
                        <CardTitle className="text-lg">{trend.title}</CardTitle>
                        <CardDescription>{trend.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded">{trend.timeframe}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Placeholder for chart - To be replaced with recharts integration */}
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="text-lg font-medium mb-2">{trend.title} Chart</div>
                        <p className="text-sm">Interactive chart visualization would be displayed here</p>
                        <p className="text-xs mt-1">
                          Integration with charting library (e.g., Recharts) needed for production
                        </p>
                      </div>
                    </div>

                    {/* Insight Section - Highlights key trends */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-900">Key Insight</div>
                        <div className="text-sm text-blue-700">{trend.insight}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {forecastingData.map((forecast) => (
                <Card key={forecast.id} className="rounded-lg">
                  <CardHeader>
                    <CardTitle className="text-base">{forecast.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {forecast.predictedDate || forecast.predictedCost || forecast.peakDemand}
                        </div>
                        {forecast.variance && (
                          <div className="text-sm text-green-600">{forecast.variance} under budget</div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${forecast.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{forecast.confidence}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Risk Level</span>
                        <Badge className={getRiskColor(forecast.risk)}>{forecast.risk}</Badge>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Key Factors</div>
                        <div className="space-y-1">
                          {forecast.factors.map((factor, index) => (
                            <div key={index} className="text-xs text-gray-600 flex items-center gap-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              {factor}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Forecasting Chart - Placeholder for integrated timeline */}
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>Integrated Forecast Timeline</CardTitle>
                <CardDescription>Combined view of schedule, cost, and resource forecasts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <div className="text-lg font-medium mb-2">Integrated Forecast Timeline</div>
                    <p className="text-sm">Interactive timeline with multiple forecast layers</p>
                    <p className="text-xs mt-1">Would show schedule, cost, and resource predictions over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="space-y-6">
            {performanceMetrics.map((category) => (
              <Card key={category.category} className="rounded-lg">
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {category.metrics.map((metric, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">{metric.name}</div>
                          <Badge className={getStatusColor(metric.status)}>{metric.status}</Badge>
                        </div>
                        <div className="text-2xl font-bold mb-1">
                          {typeof metric.value === 'number' ? metric.value.toFixed(2) : metric.value}
                        </div>
                        <div className="text-xs text-gray-500">
                          Target: {typeof metric.target === 'number' ? metric.target.toFixed(2) : metric.target}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparisons" className="mt-6">
          <div className="space-y-6">
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>Project Comparison Matrix</CardTitle>
                <CardDescription>Compare performance across multiple projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <div className="text-lg font-medium mb-2">Project Comparison Matrix</div>
                    <p className="text-sm">Side-by-side comparison of key metrics across projects</p>
                    <p className="text-xs mt-1">Would show performance benchmarking and relative rankings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-lg">
                <CardHeader>
                  <CardTitle>Industry Benchmarks</CardTitle>
                  <CardDescription>Compare your performance against industry standards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Schedule Performance</div>
                        <div className="text-sm text-gray-500">Your: 87% | Industry: 82%</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Above Average</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Cost Control</div>
                        <div className="text-sm text-gray-500">Your: 2.3% | Industry: 5.1%</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Safety Record</div>
                        <div className="text-sm text-gray-500">Your: 2 incidents | Industry: 1.5</div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Below Average</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-lg">
                <CardHeader>
                  <CardTitle>Historical Performance</CardTitle>
                  <CardDescription>Track improvement over previous projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Historical performance trends</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}