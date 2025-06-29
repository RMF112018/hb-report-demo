"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Zap,
  Users,
  DollarSign,
  Eye,
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
} from "recharts";
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights";

interface SchedulerOverviewProps {
  userRole: string;
  projectData: any;
}

// Mock schedule performance data
const schedulePerformanceData = [
  { month: "Jan 2024", planned: 85, actual: 82, variance: -3, activities: 156 },
  { month: "Feb 2024", planned: 78, actual: 81, variance: 3, activities: 143 },
  { month: "Mar 2024", planned: 92, actual: 89, variance: -3, activities: 167 },
  { month: "Apr 2024", planned: 88, actual: 91, variance: 3, activities: 158 },
  { month: "May 2024", planned: 95, actual: 92, variance: -3, activities: 174 },
  { month: "Jun 2024", planned: 90, actual: 94, variance: 4, activities: 162 },
];

const milestoneProgressData = [
  { name: "Foundation", progress: 100, status: "completed", daysVariance: 2 },
  { name: "Structure", progress: 85, status: "active", daysVariance: -3 },
  { name: "MEP Rough-in", progress: 60, status: "active", daysVariance: 0 },
  { name: "Interior Finishes", progress: 25, status: "upcoming", daysVariance: 0 },
  { name: "Final Inspections", progress: 0, status: "upcoming", daysVariance: 0 },
];

const criticalPathMetrics = [
  { metric: "Total Duration", value: "312 days", change: "+8 days", trend: "up" },
  { metric: "Critical Activities", value: "47", change: "-2", trend: "down" },
  { metric: "Total Float", value: "14 days", change: "-3 days", trend: "down" },
  { metric: "Near Critical", value: "23", change: "+5", trend: "up" },
];

const resourceUtilizationData = [
  { resource: "Project Manager", utilization: 95, availability: 100, efficiency: 88 },
  { resource: "Superintendent", utilization: 88, availability: 100, efficiency: 92 },
  { resource: "Foremen", utilization: 92, availability: 85, efficiency: 85 },
  { resource: "Skilled Labor", utilization: 78, availability: 90, efficiency: 82 },
  { resource: "Equipment", utilization: 85, availability: 95, efficiency: 90 },
];

const activityStatusData = [
  { name: "Completed", value: 425, color: "#10b981" },
  { name: "In Progress", value: 156, color: "#3b82f6" },
  { name: "Not Started", value: 666, color: "#f59e0b" },
  { name: "On Hold", value: 23, color: "#ef4444" },
];

// HBI Schedule Insights
const scheduleInsights = [
  {
    id: "sched-1",
    type: "risk",
    severity: "high",
    title: "Critical Path Delay Risk",
    text: "Weather-dependent activities show 78% probability of 5-day delay in Q2.",
    action: "Implement weather contingency plan and reschedule non-critical activities.",
    confidence: 92,
    relatedMetrics: ["Critical Path", "Weather Risk", "Float Management"],
  },
  {
    id: "sched-2",
    type: "opportunity",
    severity: "medium",
    title: "Resource Optimization Potential",
    text: "AI identifies opportunity to reduce project duration by 12 days through resource reallocation.",
    action: "Implement recommended resource shifts during weeks 15-18.",
    confidence: 87,
    relatedMetrics: ["Resource Allocation", "Critical Path", "Cost Efficiency"],
  },
  {
    id: "sched-3",
    type: "alert",
    severity: "high",
    title: "MEP Coordination Bottleneck",
    text: "Complex MEP coordination in Level 3 showing potential 8-day impact to milestone.",
    action: "Expedite BIM coordination sessions and increase engineering support.",
    confidence: 94,
    relatedMetrics: ["MEP Progress", "BIM Coordination", "Milestone Risk"],
  },
  {
    id: "sched-4",
    type: "forecast",
    severity: "medium",
    title: "Substantial Completion Forecast",
    text: "Predictive models indicate 89% probability of on-time substantial completion.",
    action: "Monitor critical activities and maintain current resource allocation.",
    confidence: 89,
    relatedMetrics: ["Completion Date", "Resource Planning", "Risk Mitigation"],
  },
];

export default function SchedulerOverview({ userRole, projectData }: SchedulerOverviewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  // Calculate key metrics
  const totalActivities = activityStatusData.reduce((sum, item) => sum + item.value, 0);
  const completedActivities = activityStatusData.find(item => item.name === "Completed")?.value || 0;
  const progressPercentage = Math.round((completedActivities / totalActivities) * 100);
  const avgUtilization = Math.round(
    resourceUtilizationData.reduce((sum, item) => sum + item.utilization, 0) / resourceUtilizationData.length
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 dark:text-green-400";
      case "active": return "text-blue-600 dark:text-blue-400";
      case "upcoming": return "text-gray-600 dark:text-gray-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? 
      <TrendingUp className="h-3 w-3 text-red-500" /> : 
      <TrendingDown className="h-3 w-3 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-tour="overview-key-metrics">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Schedule Progress</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {progressPercentage}%
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {completedActivities.toLocaleString()} of {totalActivities.toLocaleString()} activities
            </p>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Critical Path</CardTitle>
            <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              312 days
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">+8 days from baseline</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Resource Utilization</CardTitle>
            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {avgUtilization}%
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">Average across all resources</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Schedule Health</CardTitle>
            <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              87%
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">Overall schedule health score</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* HBI Schedule Insights */}
        <Card className="lg:col-span-1" data-tour="overview-hbi-insights">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              HBI Schedule Insights
            </CardTitle>
            <CardDescription>AI-powered schedule analysis and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <EnhancedHBIInsights config={scheduleInsights} cardId="scheduler-insights" />
          </CardContent>
        </Card>

        {/* Schedule Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Schedule Performance Trend
            </CardTitle>
            <CardDescription>Planned vs actual progress with variance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={schedulePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" tickFormatter={(value) => `${value}%`} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}`} />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "activities") return [`${value}`, "Activities"];
                    return [`${value}%`, name];
                  }}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="planned"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  name="Planned"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="actual"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                  name="Actual"
                />
                <Bar
                  yAxisId="right"
                  dataKey="activities"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                  name="Activities"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <Tabs defaultValue="milestones" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="milestones" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Milestones
          </TabsTrigger>
          <TabsTrigger value="critical-path" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Critical Path
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Milestone Progress</CardTitle>
              <CardDescription>Key project milestones and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestoneProgressData.map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        milestone.status === "completed" ? "bg-green-100 text-green-600" :
                        milestone.status === "active" ? "bg-blue-100 text-blue-600" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {milestone.status === "completed" ? <CheckCircle className="h-4 w-4" /> :
                         milestone.status === "active" ? <Clock className="h-4 w-4" /> :
                         <Calendar className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{milestone.name}</h4>
                        <p className={`text-sm ${getStatusColor(milestone.status)}`}>
                          {milestone.daysVariance !== 0 && 
                            `${milestone.daysVariance > 0 ? '+' : ''}${milestone.daysVariance} days variance`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right min-w-[100px]">
                        <div className="text-sm font-medium">{milestone.progress}%</div>
                        <Progress value={milestone.progress} className="w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical-path" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {criticalPathMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{metric.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {getTrendIcon(metric.trend)}
                    <span className={metric.trend === "up" ? "text-red-600" : "text-green-600"}>
                      {metric.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Utilization Analysis</CardTitle>
              <CardDescription>Current resource allocation and efficiency metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resourceUtilizationData.map((resource, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{resource.resource}</span>
                      <span className="text-sm text-muted-foreground">
                        {resource.utilization}% utilized
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Utilization</div>
                        <Progress value={resource.utilization} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Availability</div>
                        <Progress value={resource.availability} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                        <Progress value={resource.efficiency} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Status Distribution</CardTitle>
              <CardDescription>Current status breakdown of all project activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={activityStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {activityStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 