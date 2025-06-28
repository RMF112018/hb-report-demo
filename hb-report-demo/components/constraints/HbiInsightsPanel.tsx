"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Info, 
  TrendingUp,
  Target,
  Clock,
  Users,
  BarChart3,
  ArrowRight
} from "lucide-react"
import type { Constraint, HbiInsight } from "@/types/constraint"

interface HbiInsightsPanelProps {
  constraints: Constraint[]
}

export function HbiInsightsPanel({ constraints }: HbiInsightsPanelProps) {
  // Generate AI-driven insights based on constraint data
  const insights = useMemo((): HbiInsight[] => {
    const openConstraints = constraints.filter(c => c.completionStatus !== "Closed")
    const overdueConstraints = constraints.filter(c => {
      if (c.completionStatus === "Closed") return false
      if (!c.dueDate) return false
      return new Date(c.dueDate) < new Date()
    })

    const categoryDistribution = constraints.reduce((acc, constraint) => {
      acc[constraint.category] = (acc[constraint.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const assigneeWorkload = constraints.reduce((acc, constraint) => {
      if (constraint.completionStatus !== "Closed" && constraint.assigned) {
        acc[constraint.assigned] = (acc[constraint.assigned] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const generatedInsights: HbiInsight[] = []

    // Overdue constraints insight
    if (overdueConstraints.length > 0) {
      generatedInsights.push({
        id: "overdue-critical",
        type: "warning",
        title: `${overdueConstraints.length} Constraints Overdue`,
        description: `There are ${overdueConstraints.length} constraints past their due date. Immediate attention required to prevent project delays and cost overruns.`,
        priority: "high",
        confidence: 0.95,
        actionable: true,
        relatedConstraints: overdueConstraints.slice(0, 5).map(c => c.id)
      })
    }

    // Category concentration insight
    const topCategory = Object.entries(categoryDistribution).sort(([,a], [,b]) => b - a)[0]
    if (topCategory && topCategory[1] > constraints.length * 0.3) {
      generatedInsights.push({
        id: "category-concentration",
        type: "recommendation",
        title: `High Concentration in ${topCategory[0]}`,
        description: `${topCategory[1]} constraints (${((topCategory[1] / constraints.length) * 100).toFixed(1)}%) are in ${topCategory[0]}. Consider dedicated resources or process improvements for this category.`,
        priority: "medium",
        confidence: 0.88,
        actionable: true,
        relatedConstraints: constraints.filter(c => c.category === topCategory[0]).slice(0, 3).map(c => c.id)
      })
    }

    // Workload distribution insight
    const overloadedAssignees = Object.entries(assigneeWorkload).filter(([,count]) => count > 5)
    if (overloadedAssignees.length > 0) {
      const assignee = overloadedAssignees[0]
      generatedInsights.push({
        id: "workload-imbalance",
        type: "warning",
        title: "Workload Imbalance Detected",
        description: `${assignee[0]} has ${assignee[1]} open constraints. Consider redistributing workload to improve resolution efficiency.`,
        priority: "medium",
        confidence: 0.82,
        actionable: true,
        relatedConstraints: constraints.filter(c => c.assigned === assignee[0] && c.completionStatus !== "Closed").slice(0, 3).map(c => c.id)
      })
    }

    // Positive trend insight
    const completionRate = constraints.length > 0 ? (constraints.filter(c => c.completionStatus === "Closed").length / constraints.length) * 100 : 0
    if (completionRate > 70) {
      generatedInsights.push({
        id: "positive-trend",
        type: "success",
        title: "Strong Resolution Performance",
        description: `${completionRate.toFixed(1)}% constraint resolution rate indicates effective project management. Continue current practices.`,
        priority: "low",
        confidence: 0.91,
        actionable: false,
        relatedConstraints: []
      })
    }

    // Aging constraints insight
    const longRunningConstraints = openConstraints.filter(c => c.daysElapsed > 30)
    if (longRunningConstraints.length > 0) {
      generatedInsights.push({
        id: "aging-constraints",
        type: "recommendation",
        title: `${longRunningConstraints.length} Long-Running Constraints`,
        description: `Constraints open for 30+ days may indicate systemic issues. Review these constraints for escalation opportunities.`,
        priority: "medium",
        confidence: 0.78,
        actionable: true,
        relatedConstraints: longRunningConstraints.slice(0, 3).map(c => c.id)
      })
    }

    // Process improvement insight
    if (constraints.length > 20) {
      generatedInsights.push({
        id: "process-improvement",
        type: "info",
        title: "Process Optimization Opportunity",
        description: "With growing constraint volume, consider implementing automated escalation rules and constraint categorization workflows.",
        priority: "low",
        confidence: 0.75,
        actionable: true,
        relatedConstraints: []
      })
    }

    return generatedInsights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }, [constraints])

  const getInsightIcon = (type: HbiInsight["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      case "recommendation":
        return <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      case "info":
        return <Info className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      default:
        return <Info className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    }
  }

  const getInsightColor = (type: HbiInsight["type"]) => {
    switch (type) {
      case "warning":
        return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
      case "success":
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
      case "recommendation":
        return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
      case "info":
        return "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800"
      default:
        return "bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800"
    }
  }

  const getPriorityColor = (priority: HbiInsight["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
      case "medium":
        return "bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800"
      case "low":
        return "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
      default:
        return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800"
    }
  }

  if (insights.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30 border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
            <Brain className="h-5 w-5" />
            HBI Intelligence Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-indigo-900 dark:text-indigo-100 mb-2">
              All Systems Operating Optimally
            </h3>
            <p className="text-indigo-700 dark:text-indigo-300">
              No critical insights or recommendations at this time. Your constraint management is performing well.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30 border-indigo-200 dark:border-indigo-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
          <Brain className="h-5 w-5" />
          HBI Intelligence Insights
          <Badge variant="outline" className="ml-auto bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300">
            {insights.length} insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      {insight.title}
                    </h4>
                    <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                      {insight.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {(insight.confidence * 100).toFixed(0)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {insight.relatedConstraints.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {insight.relatedConstraints.length} related
                        </Badge>
                      )}
                    </div>
                    {insight.actionable && (
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        Take Action
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Summary */}
        <div className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <h5 className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
            Recommended Actions
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs text-indigo-700 dark:text-indigo-300">
                Address {insights.filter(i => i.priority === "high").length} high-priority items
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs text-indigo-700 dark:text-indigo-300">
                Review aging constraints (30+ days)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs text-indigo-700 dark:text-indigo-300">
                Balance workload distribution
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 