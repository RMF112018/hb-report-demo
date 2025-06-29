"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Target,
  Lightbulb,
  BarChart3,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface AIBuyoutInsightsProps {
  summaryMetrics: any
  buyoutData: any[]
}

interface Insight {
  id: string
  type: "warning" | "success" | "info" | "critical"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  confidence: number
  recommendation?: string
  action?: string
}

interface Prediction {
  id: string
  category: string
  prediction: string
  probability: number
  timeframe: string
  impact: number
}

export function AIBuyoutInsights({ summaryMetrics, buyoutData }: AIBuyoutInsightsProps) {
  const [activeTab, setActiveTab] = useState("insights")

  // Generate AI insights based on the buyout data
  const insights = useMemo((): Insight[] => {
    if (!summaryMetrics || !buyoutData.length) return []

    const insights: Insight[] = []

    // Budget variance analysis
    if (summaryMetrics.variancePercentage > 10) {
      insights.push({
        id: "budget-variance",
        type: "critical",
        title: "Significant Budget Overrun Detected",
        description: `Procurement is ${summaryMetrics.variancePercentage.toFixed(1)}% over budget with ${formatCurrency(summaryMetrics.totalVariance)} variance.`,
        impact: "high",
        confidence: 95,
        recommendation:
          "Immediate cost control measures required. Review high-variance buyouts and implement corrective actions.",
        action: "Schedule procurement review meeting",
      })
    }

    // Overdue tasks analysis
    if (summaryMetrics.overdueTasks > 5) {
      insights.push({
        id: "overdue-tasks",
        type: "warning",
        title: "Multiple Overdue Tasks",
        description: `${summaryMetrics.overdueTasks} tasks are overdue across active buyouts.`,
        impact: "medium",
        confidence: 90,
        recommendation: "Prioritize task completion and improve workflow management.",
        action: "Review task assignments",
      })
    }

    // Supplier performance analysis
    const lowRatedSuppliers = buyoutData.filter((b) => b.supplierRating < 3.0).length
    if (lowRatedSuppliers > 0) {
      insights.push({
        id: "supplier-performance",
        type: "warning",
        title: "Low-Performing Suppliers Detected",
        description: `${lowRatedSuppliers} suppliers have ratings below 3.0.`,
        impact: "medium",
        confidence: 85,
        recommendation: "Consider alternative suppliers for future contracts.",
        action: "Review supplier performance",
      })
    }

    // Change order analysis
    const totalChangeOrders = buyoutData.reduce((sum, item) => sum + (item.changeOrders?.length || 0), 0)
    if (totalChangeOrders > buyoutData.length * 0.5) {
      insights.push({
        id: "change-orders",
        type: "info",
        title: "High Change Order Activity",
        description: `${totalChangeOrders} change orders across ${buyoutData.length} buyouts.`,
        impact: "medium",
        confidence: 80,
        recommendation: "Review scope definition and contract clarity to reduce change orders.",
        action: "Analyze change order patterns",
      })
    }

    // Positive insights
    if (summaryMetrics.executedCount > summaryMetrics.totalCount * 0.7) {
      insights.push({
        id: "execution-performance",
        type: "success",
        title: "Strong Contract Execution Rate",
        description: `${summaryMetrics.executedCount} out of ${summaryMetrics.totalCount} contracts executed.`,
        impact: "low",
        confidence: 95,
        recommendation: "Continue current procurement practices.",
        action: "Document best practices",
      })
    }

    // Risk assessment
    if (summaryMetrics.atRiskCount > summaryMetrics.totalCount * 0.3) {
      insights.push({
        id: "risk-assessment",
        type: "warning",
        title: "High-Risk Buyouts Require Attention",
        description: `${summaryMetrics.atRiskCount} buyouts are classified as high-risk.`,
        impact: "high",
        confidence: 88,
        recommendation: "Implement risk mitigation strategies for high-risk contracts.",
        action: "Develop risk mitigation plans",
      })
    }

    return insights
  }, [summaryMetrics, buyoutData])

  // Generate AI predictions
  const predictions = useMemo((): Prediction[] => {
    if (!summaryMetrics || !buyoutData.length) return []

    return [
      {
        id: "completion-forecast",
        category: "Schedule",
        prediction: `${Math.round(summaryMetrics.completionRate * 100)}% of buyouts will complete on schedule`,
        probability: 82,
        timeframe: "Next 90 days",
        impact: 0,
      },
      {
        id: "budget-forecast",
        category: "Budget",
        prediction: `Final procurement cost will be ${formatCurrency(summaryMetrics.totalForecast)}`,
        probability: 78,
        timeframe: "Project completion",
        impact: summaryMetrics.totalVariance,
      },
      {
        id: "supplier-risk",
        category: "Risk",
        prediction: "2-3 suppliers may experience delivery delays",
        probability: 65,
        timeframe: "Next 60 days",
        impact: 50000,
      },
      {
        id: "change-order-trend",
        category: "Change Orders",
        prediction: "Change order volume will increase by 15-20%",
        probability: 70,
        timeframe: "Next 30 days",
        impact: 75000,
      },
    ]
  }, [summaryMetrics, buyoutData])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "info":
        return <Brain className="h-5 w-5 text-blue-500" />
      default:
        return <Brain className="h-5 w-5 text-gray-500" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "success":
        return "border-green-200 bg-green-50"
      case "info":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  if (!summaryMetrics || !buyoutData.length) {
    return (
      <div className="text-center py-8">
        <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Loading procurement insights...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="insights">
            <Lightbulb className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="predictions">
            <Target className="h-4 w-4 mr-2" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <CheckCircle className="h-4 w-4 mr-2" />
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <Card key={insight.id} className={`border-2 ${getInsightColor(insight.type)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <CardTitle className="text-sm font-semibold">{insight.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {insight.impact} impact
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                  {insight.recommendation && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-600">Recommendation:</p>
                      <p className="text-xs text-gray-600">{insight.recommendation}</p>
                      {insight.action && (
                        <Button size="sm" variant="outline" className="text-xs">
                          {insight.action}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {prediction.category}
                      </Badge>
                      <h4 className="font-medium text-sm">{prediction.prediction}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{prediction.probability}%</div>
                      <div className="text-xs text-gray-500">probability</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Progress value={prediction.probability} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {prediction.timeframe}
                      </span>
                      {prediction.impact !== 0 && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {prediction.impact > 0 ? "+" : ""}
                          {formatCurrency(prediction.impact)} impact
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Procurement Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium mb-1">Immediate Actions:</p>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• Review supplier performance metrics</li>
                    <li>• Negotiate better contract terms</li>
                    <li>• Streamline approval workflows</li>
                  </ul>
                </div>
                <Button size="sm" className="w-full">
                  Generate Procurement Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Schedule Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium mb-1">Recommended Actions:</p>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• Accelerate contract execution processes</li>
                    <li>• Implement automated task reminders</li>
                    <li>• Update project timelines regularly</li>
                  </ul>
                </div>
                <Button size="sm" className="w-full">
                  Update Schedule
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Risk Mitigation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium mb-1">Priority Actions:</p>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• Monitor high-risk suppliers closely</li>
                    <li>• Develop backup supplier options</li>
                    <li>• Implement early warning systems</li>
                  </ul>
                </div>
                <Button size="sm" className="w-full">
                  Risk Assessment
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  Performance Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium mb-1">Monitoring Setup:</p>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• Set up automated procurement alerts</li>
                    <li>• Weekly variance reports</li>
                    <li>• Supplier performance dashboards</li>
                  </ul>
                </div>
                <Button size="sm" className="w-full">
                  Configure Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
