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

interface AIForecastInsightsProps {
  summaryMetrics: {
    totalBudget: number
    totalActual: number
    totalProjected: number
    totalVariance: number
    totalRemaining: number
    completionRate: number
    variancePercentage: number
    highRiskItems: number
    totalCostCodes: number
    onTrackItems: number
    overBudgetItems: number
  } | null
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

export function AIForecastInsights({ summaryMetrics }: AIForecastInsightsProps) {
  const [activeTab, setActiveTab] = useState("insights")

  // Generate AI insights based on the data
  const insights = useMemo((): Insight[] => {
    if (!summaryMetrics) return []

    const insights: Insight[] = []

    // Budget variance analysis
    if (summaryMetrics.variancePercentage > 10) {
      insights.push({
        id: "budget-variance",
        type: "critical",
        title: "Significant Budget Overrun Detected",
        description: `Project is ${summaryMetrics.variancePercentage.toFixed(1)}% over budget with ${formatCurrency(summaryMetrics.totalVariance)} variance.`,
        impact: "high",
        confidence: 95,
        recommendation:
          "Immediate cost control measures required. Review high-variance cost codes and implement corrective actions.",
        action: "Schedule budget review meeting",
      })
    } else if (summaryMetrics.variancePercentage > 5) {
      insights.push({
        id: "budget-warning",
        type: "warning",
        title: "Budget Variance Approaching Threshold",
        description: `Project variance is ${summaryMetrics.variancePercentage.toFixed(1)}%, approaching the 10% threshold.`,
        impact: "medium",
        confidence: 85,
        recommendation: "Monitor closely and prepare contingency plans.",
        action: "Review cost forecasting methods",
      })
    }

    // Completion rate analysis
    if (summaryMetrics.completionRate < 0.3 && summaryMetrics.totalActual > summaryMetrics.totalBudget * 0.5) {
      insights.push({
        id: "completion-concern",
        type: "warning",
        title: "Low Completion Rate vs Spend",
        description: `Only ${(summaryMetrics.completionRate * 100).toFixed(1)}% complete but ${((summaryMetrics.totalActual / summaryMetrics.totalBudget) * 100).toFixed(1)}% of budget spent.`,
        impact: "high",
        confidence: 90,
        recommendation: "Investigate productivity issues and resource allocation efficiency.",
        action: "Conduct productivity analysis",
      })
    }

    // High-risk items analysis
    if (summaryMetrics.highRiskItems > summaryMetrics.totalCostCodes * 0.2) {
      insights.push({
        id: "high-risk-items",
        type: "warning",
        title: "Multiple High-Risk Cost Codes",
        description: `${summaryMetrics.highRiskItems} out of ${summaryMetrics.totalCostCodes} cost codes are high-risk.`,
        impact: "medium",
        confidence: 80,
        recommendation: "Focus on risk mitigation for critical cost codes.",
        action: "Prioritize risk management",
      })
    }

    // Positive insights
    if (summaryMetrics.onTrackItems > summaryMetrics.totalCostCodes * 0.7) {
      insights.push({
        id: "on-track-performance",
        type: "success",
        title: "Strong Overall Performance",
        description: `${summaryMetrics.onTrackItems} out of ${summaryMetrics.totalCostCodes} cost codes are on track.`,
        impact: "low",
        confidence: 95,
        recommendation: "Continue current management practices.",
        action: "Document best practices",
      })
    }

    // Cash flow insights
    if (summaryMetrics.totalRemaining > summaryMetrics.totalBudget * 0.6) {
      insights.push({
        id: "cash-flow-planning",
        type: "info",
        title: "Significant Remaining Costs",
        description: `${formatCurrency(summaryMetrics.totalRemaining)} remaining to be spent.`,
        impact: "medium",
        confidence: 85,
        recommendation: "Ensure adequate cash flow planning for remaining project phases.",
        action: "Update cash flow projections",
      })
    }

    return insights
  }, [summaryMetrics])

  // Generate AI predictions
  const predictions = useMemo((): Prediction[] => {
    if (!summaryMetrics) return []

    return [
      {
        id: "final-cost",
        category: "Budget",
        prediction: `Final project cost will be ${formatCurrency(summaryMetrics.totalProjected)}`,
        probability: 85,
        timeframe: "Project completion",
        impact: summaryMetrics.totalVariance,
      },
      {
        id: "completion-date",
        category: "Schedule",
        prediction: "Project likely to complete 2-3 weeks behind schedule",
        probability: 72,
        timeframe: "Next 30 days",
        impact: 150000,
      },
      {
        id: "cost-overrun",
        category: "Risk",
        prediction: "Labor costs may exceed budget by 8-12%",
        probability: 68,
        timeframe: "Next 60 days",
        impact: 200000,
      },
      {
        id: "material-savings",
        category: "Opportunity",
        prediction: "Material costs trending 5% under budget",
        probability: 78,
        timeframe: "Ongoing",
        impact: -75000,
      },
    ]
  }, [summaryMetrics])

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

  if (!summaryMetrics) {
    return (
      <div className="text-center py-8">
        <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Loading AI insights...</p>
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
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {prediction.impact > 0 ? "+" : ""}
                        {formatCurrency(prediction.impact)} impact
                      </span>
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
                  Cost Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium mb-1">Immediate Actions:</p>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• Review labor productivity metrics</li>
                    <li>• Negotiate better material pricing</li>
                    <li>• Optimize resource allocation</li>
                  </ul>
                </div>
                <Button size="sm" className="w-full">
                  Generate Cost Report
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
                    <li>• Accelerate critical path activities</li>
                    <li>• Add resources to delayed tasks</li>
                    <li>• Update project timeline</li>
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
                    <li>• Monitor high-risk cost codes daily</li>
                    <li>• Implement early warning systems</li>
                    <li>• Prepare contingency plans</li>
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
                    <li>• Set up automated alerts</li>
                    <li>• Weekly variance reports</li>
                    <li>• KPI dashboard updates</li>
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
