"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Monitor,
  Users,
  CheckCircle,
  Bug,
  Activity,
  Database,
  Shield,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Server,
  UserCheck,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"

// Import data from the new JSON file
import adminDashboardData from "@/data/admin-dashboard-data.json"

/**
 * Admin Card Component with enhanced visualizations
 *
 * @param title - Card title
 * @param value - Primary metric value
 * @param icon - Lucide icon component
 * @param trend - Trend direction ('up' | 'down' | 'stable')
 * @param trendValue - Trend percentage
 * @param chartType - Type of chart to render
 * @param chartData - Data for the chart
 * @param chartConfig - Chart configuration
 * @param hoverData - Additional data shown on hover
 * @param status - Status indicator ('good' | 'warning' | 'critical')
 */
interface AdminCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend?: "up" | "down" | "stable"
  trendValue?: number
  chartType?: "line" | "area" | "bar" | "pie" | "radial" | "none"
  chartData?: any[]
  chartConfig?: any
  hoverData?: Array<{ label: string; value: string | number; status?: string }>
  status?: "good" | "warning" | "critical"
  className?: string
}

/**
 * AdminCard Component
 *
 * Renders individual metric cards with charts and interactive hover data
 */
const AdminCard: React.FC<AdminCardProps> = ({
  title,
  value,
  icon: Icon,
  trend = "stable",
  trendValue,
  chartType = "none",
  chartData = [],
  chartConfig = {},
  hoverData = [],
  status = "good",
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const renderChart = () => {
    if (chartType === "none" || !chartData.length) return null

    const chartHeight = 120

    switch (chartType) {
      case "line":
        return (
          <ChartContainer config={chartConfig} className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey={chartConfig.xKey || "x"} fontSize={10} />
                <YAxis fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey={chartConfig.yKey || "y"}
                  stroke={chartConfig.color || "#3b82f6"}
                  strokeWidth={2}
                  dot={{ fill: chartConfig.color || "#3b82f6", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "area":
        return (
          <ChartContainer config={chartConfig} className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height={chartHeight}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey={chartConfig.xKey || "x"} fontSize={10} />
                <YAxis fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey={chartConfig.yKey || "y"}
                  stroke={chartConfig.color || "#3b82f6"}
                  fill={chartConfig.fillColor || "#3b82f620"}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "bar":
        return (
          <ChartContainer config={chartConfig} className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey={chartConfig.xKey || "x"} fontSize={10} />
                <YAxis fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey={chartConfig.yKey || "y"} fill={chartConfig.color || "#3b82f6"} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "pie":
        return (
          <ChartContainer config={chartConfig} className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={40}
                  paddingAngle={2}
                  dataKey={chartConfig.valueKey || "value"}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || chartConfig.colors?.[index] || "#3b82f6"} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "radial":
        return (
          <ChartContainer config={chartConfig} className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height={chartHeight}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={chartData}>
                <RadialBar
                  dataKey={chartConfig.valueKey || "value"}
                  cornerRadius={10}
                  fill={chartConfig.color || "#3b82f6"}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "transition-all duration-200 hover:shadow-lg cursor-pointer relative group",
          getStatusColor(status),
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="article"
        aria-label={`${title} metric card`}
        tabIndex={0}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate">{title}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{title}</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              {trendValue && (
                <span className={cn("text-xs font-medium", trend === "up" ? "text-green-600" : "text-red-600")}>
                  {trendValue > 0 ? "+" : ""}
                  {trendValue}%
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>

            {renderChart()}

            {/* Hover Data Overlay */}
            {isHovered && hoverData.length > 0 && (
              <div className="absolute inset-0 bg-white bg-opacity-98 p-4 rounded-lg z-10 border shadow-lg">
                <h4 className="font-semibold mb-3 text-gray-900">Detailed Metrics</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {hoverData.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex justify-between items-center p-2 rounded border text-sm",
                        item.status ? getStatusColor(item.status) : "bg-gray-50 border-gray-200",
                      )}
                    >
                      <span className="font-medium">{item.label}</span>
                      <span className="font-mono">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

/**
 * Project Health Card for Admin Dashboard
 *
 * Shows overall application health score with radial gauge
 */
const AdminProjectHealthCard: React.FC = () => {
  const healthScore = 94.2
  const healthData = [{ value: healthScore, fill: "#22c55e" }]

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 75) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  return (
    <Card className={cn("relative", getHealthColor(healthScore))}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Application Health
          <Badge variant="outline" className="ml-auto">
            System Status
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div>
            <p className="text-4xl font-bold">{healthScore}%</p>
            <p className="text-sm text-gray-600">Overall Health Score</p>
          </div>

          <ChartContainer
            config={{
              health: {
                label: "Health Score",
                color: "#22c55e",
              },
            }}
            className="h-[100px] w-full"
          >
            <ResponsiveContainer width="100%" height={100}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={healthData}>
                <RadialBar dataKey="value" cornerRadius={10} fill="#22c55e" />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-white rounded border">
              <div className="font-semibold">Uptime</div>
              <div className="text-green-600">{adminDashboardData.performanceData.uptime}%</div>
            </div>
            <div className="text-center p-2 bg-white rounded border">
              <div className="font-semibold">Response</div>
              <div className="text-blue-600">{adminDashboardData.performanceData.responseTime}ms</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * HBI Insights Card for Admin Dashboard
 *
 * Shows AI-powered insights for system administration
 */
const AdminHBIInsights: React.FC = () => {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "performance":
        return <Zap className="h-4 w-4" />
      case "growth":
        return <TrendingUp className="h-4 w-4" />
      case "risk":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "low":
        return "border-green-200 bg-green-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <Card className="bg-purple-50 border-purple-200 col-span-full lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-purple-700 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          HBI Admin Insights
          <Badge variant="outline" className="ml-auto bg-purple-100 text-purple-700">
            AI-Powered
          </Badge>
        </CardTitle>
        <CardDescription className="text-purple-600">
          Advanced system analytics and optimization recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {adminDashboardData.adminInsights.map((insight) => (
            <div
              key={insight.id}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                getInsightColor(insight.severity),
                selectedInsight === insight.id && "ring-2 ring-purple-300",
              )}
              onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{getInsightIcon(insight.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <Badge variant={insight.severity === "high" ? "destructive" : "secondary"} className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{insight.text}</p>
                  {selectedInsight === insight.id && (
                    <div className="mt-3 p-2 bg-white rounded border">
                      <p className="text-xs font-medium text-gray-600 mb-1">Recommended Action:</p>
                      <p className="text-sm text-gray-800">{insight.action}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Admin Dashboard Component
 *
 * Main dashboard component for system administrators with comprehensive
 * application performance metrics, user statistics, and system health indicators.
 *
 * Features:
 * - Real-time performance monitoring
 * - User analytics and onboarding metrics
 * - Bug tracking and resolution statistics
 * - Security monitoring and threat detection
 * - Database performance optimization
 * - AI-powered insights and recommendations
 *
 * @returns JSX.Element - The complete admin dashboard
 */
export default function AdminDashboard() {
  // The entire content of the previous AdminDashboard component function goes here.
  // All internal logic, `useMemo`, and the return JSX remain the same.

  const adminCards = useMemo(
    () => [
      {
        title: "System Uptime",
        value: `${adminDashboardData.performanceData.uptime}%`,
        icon: Monitor,
        trend: "up" as const,
        trendValue: 0.02,
        chartType: "line" as const,
        chartData: adminDashboardData.performanceData.hourlyMetrics.map((item) => ({
          x: item.hour,
          y: item.uptime,
        })),
        chartConfig: {
          xKey: "x",
          yKey: "y",
          color: "#22c55e",
        },
        hoverData: [
          { label: "Response Time", value: `${adminDashboardData.performanceData.responseTime}ms`, status: "good" },
          { label: "Throughput", value: `${adminDashboardData.performanceData.throughput}/min`, status: "good" },
          { label: "Error Rate", value: `${adminDashboardData.performanceData.errorRate}%`, status: "good" },
        ],
        status: "good" as const,
      },
      {
        title: "Active Users",
        value: adminDashboardData.userStats.activeUsers.toLocaleString(),
        icon: Users,
        trend: "up" as const,
        trendValue: adminDashboardData.userStats.userGrowth,
        chartType: "area" as const,
        chartData: adminDashboardData.userStats.dailyActiveUsers.map((item) => ({
          x: item.date,
          y: item.users,
        })),
        chartConfig: {
          xKey: "x",
          yKey: "y",
          color: "#3b82f6",
          fillColor: "#3b82f620",
        },
        hoverData: [
          { label: "Total Users", value: adminDashboardData.userStats.totalUsers.toLocaleString(), status: "good" },
          { label: "New Users", value: adminDashboardData.userStats.newUsers.toLocaleString(), status: "good" },
          { label: "Churn Rate", value: `${adminDashboardData.userStats.churnRate}%`, status: "warning" },
        ],
        status: "good" as const,
      },
      {
        title: "User Distribution",
        value: `${adminDashboardData.userStats.usersByRole.length} Roles`,
        icon: UserCheck,
        trend: "stable" as const,
        chartType: "pie" as const,
        chartData: adminDashboardData.userStats.usersByRole.map((role) => ({
          name: role.role,
          value: role.count,
          color: role.color,
        })),
        chartConfig: {
          valueKey: "value",
        },
        hoverData: adminDashboardData.userStats.usersByRole.map((role) => ({
          label: role.role,
          value: role.count.toLocaleString(),
          status: "good",
        })),
        status: "good" as const,
      },
      {
        title: "Onboarding Rate",
        value: `${adminDashboardData.onboardingData.completionRate}%`,
        icon: CheckCircle,
        trend: "up" as const,
        trendValue: 5.2,
        chartType: "bar" as const,
        chartData: adminDashboardData.onboardingData.monthlyOnboarding.map((item) => ({
          x: item.month,
          y: (item.completed / item.started) * 100,
        })),
        chartConfig: {
          xKey: "x",
          yKey: "y",
          color: "#10b981",
        },
        hoverData: [
          { label: "Avg. Time", value: `${adminDashboardData.onboardingData.averageTime} days`, status: "good" },
          { label: "Drop-off Rate", value: `${adminDashboardData.onboardingData.dropoffRate}%`, status: "warning" },
          { label: "This Month", value: "234 completed", status: "good" },
        ],
        status: "good" as const,
      },
      {
        title: "Open Bugs",
        value: adminDashboardData.bugData.openBugs.toString(),
        icon: Bug,
        trend: "down" as const,
        trendValue: -12.5,
        chartType: "pie" as const,
        chartData: adminDashboardData.bugData.bugsByPriority.map((bug) => ({
          name: bug.priority,
          value: bug.count,
          color: bug.color,
        })),
        chartConfig: {
          valueKey: "value",
        },
        hoverData: [
          { label: "Critical", value: adminDashboardData.bugData.criticalBugs.toString(), status: "critical" },
          { label: "Resolved", value: adminDashboardData.bugData.resolvedBugs.toString(), status: "good" },
          {
            label: "Avg. Resolution",
            value: `${adminDashboardData.bugData.averageResolutionTime} days`,
            status: "good",
          },
        ],
        status: adminDashboardData.bugData.criticalBugs > 0 ? ("warning" as const) : ("good" as const),
      },
      {
        title: "Security Score",
        value: `${adminDashboardData.securityData.securityScore}%`,
        icon: Shield,
        trend: "up" as const,
        trendValue: 2.1,
        chartType: "radial" as const,
        chartData: [{ value: adminDashboardData.securityData.securityScore }],
        chartConfig: {
          valueKey: "value",
          color: "#8b5cf6",
        },
        hoverData: [
          {
            label: "Blocked Attacks",
            value: adminDashboardData.securityData.blockedAttacks.toLocaleString(),
            status: "good",
          },
          {
            label: "Vulnerabilities",
            value: adminDashboardData.securityData.vulnerabilities.toString(),
            status: "warning",
          },
          { label: "Last Scan", value: adminDashboardData.securityData.lastScan, status: "good" },
        ],
        status: adminDashboardData.securityData.vulnerabilities > 5 ? ("warning" as const) : ("good" as const),
      },
      {
        title: "Database Performance",
        value: `${adminDashboardData.databaseData.queryTime}ms`,
        icon: Database,
        trend: "stable" as const,
        chartType: "bar" as const,
        chartData: adminDashboardData.databaseData.performanceMetrics.map((metric) => ({
          x: metric.metric.split(" ")[0],
          y: metric.value,
        })),
        chartConfig: {
          xKey: "x",
          yKey: "y",
          color: "#f59e0b",
        },
        hoverData: [
          {
            label: "Connections",
            value: `${adminDashboardData.databaseData.connections}/${adminDashboardData.databaseData.maxConnections}`,
            status: "good",
          },
          { label: "Cache Hit Rate", value: `${adminDashboardData.databaseData.cacheHitRate}%`, status: "good" },
          {
            label: "Storage Used",
            value: `${adminDashboardData.databaseData.storageUsed}/${adminDashboardData.databaseData.storageTotal} TB`,
            status: "good",
          },
        ],
        status: "good" as const,
      },
      {
        title: "System Resources",
        value: `${adminDashboardData.performanceData.cpuUsage}%`,
        icon: Server,
        trend: "up" as const,
        trendValue: 8.3,
        chartType: "line" as const,
        chartData: [
          { x: "CPU", y: adminDashboardData.performanceData.cpuUsage },
          { x: "Memory", y: adminDashboardData.performanceData.memoryUsage },
          { x: "Disk", y: adminDashboardData.performanceData.diskUsage },
        ],
        chartConfig: {
          xKey: "x",
          yKey: "y",
          color: "#ef4444",
        },
        hoverData: [
          {
            label: "CPU Usage",
            value: `${adminDashboardData.performanceData.cpuUsage}%`,
            status: adminDashboardData.performanceData.cpuUsage > 80 ? "warning" : "good",
          },
          {
            label: "Memory Usage",
            value: `${adminDashboardData.performanceData.memoryUsage}%`,
            status: adminDashboardData.performanceData.memoryUsage > 80 ? "warning" : "good",
          },
          { label: "Disk Usage", value: `${adminDashboardData.performanceData.diskUsage}%`, status: "good" },
        ],
        status:
          adminDashboardData.performanceData.cpuUsage > 80 || adminDashboardData.performanceData.memoryUsage > 80
            ? ("warning" as const)
            : ("good" as const),
      },
    ],
    [],
  )

  return (
    <TooltipProvider>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            System performance monitoring and application analytics • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {/* Application Health Card */}
          <AdminProjectHealthCard />

          {/* Dynamic Admin Cards */}
          {adminCards.map((card, index) => (
            <AdminCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              trend={card.trend}
              trendValue={card.trendValue}
              chartType={card.chartType}
              chartData={card.chartData}
              chartConfig={card.chartConfig}
              hoverData={card.hoverData}
              status={card.status}
            />
          ))}

          {/* HBI Insights Card */}
          <AdminHBIInsights />
        </div>
      </div>
    </TooltipProvider>
  )
}
