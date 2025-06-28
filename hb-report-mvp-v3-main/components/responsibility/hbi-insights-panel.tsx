"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Brain, ChevronDown, ChevronUp, AlertTriangle, TrendingUp, Target, Lightbulb } from "lucide-react"
import type { ResponsibilityTask, ProjectRole } from "@/types/responsibility"

interface HBIInsight {
  id: string
  type: "recommendation" | "risk" | "trend" | "optimization"
  severity: "low" | "medium" | "high"
  title: string
  description: string
  action?: string
  taskId?: string
  roleKey?: string
  assignment?: string
  confidence: number
}

interface HBIInsightsPanelProps {
  tasks: ResponsibilityTask[]
  roles: ProjectRole[]
  activeTab: string
  onApplyRecommendation?: (taskId: string, role: string, assignment: string) => void
}

/**
 * HBI Insights Panel Component
 *
 * Provides AI-driven insights for responsibility matrix optimization including:
 * - Predictive role assignment recommendations
 * - Risk analysis for unassigned or conflicting roles
 * - Performance trends and optimization suggestions
 * - Task dependency and workload analysis
 *
 * @param {HBIInsightsPanelProps} props - Component props
 * @returns {JSX.Element} HBI Insights panel interface
 */
export function HBIInsightsPanel({ tasks, roles, activeTab, onApplyRecommendation }: HBIInsightsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedInsightType, setSelectedInsightType] = useState<string>("all")
  const [appliedInsights, setAppliedInsights] = useState<Set<string>>(new Set())

  /**
   * Generate AI-driven insights based on current task assignments and patterns
   */
  const insights = useMemo((): HBIInsight[] => {
    const generatedInsights: HBIInsight[] = []

    // Risk Analysis: Unassigned critical tasks with specific recommendations
    const unassignedTasks = tasks.filter((task) => {
      const assignedRoles = Object.values(task.assignments || {}).filter(Boolean)
      return assignedRoles.length === 0
    })

    unassignedTasks.slice(0, 3).forEach((task, index) => {
      const suggestedRole = roles[index % roles.length]
      if (suggestedRole) {
        generatedInsights.push({
          id: `risk-unassigned-${task.id}`,
          type: "risk",
          severity: "high",
          title: `Unassigned Task: ${task.task.substring(0, 30)}...`,
          description: `This critical task lacks role assignments. Recommend assigning ${suggestedRole.label} as primary owner to ensure accountability.`,
          action: `Assign ${suggestedRole.key} as Primary`,
          taskId: task.id,
          roleKey: suggestedRole.key,
          assignment: "X",
          confidence: 92,
        })
      }
    })

    // Recommendation: Workload balancing with specific actions
    const roleWorkload = new Map<string, number>()
    tasks.forEach((task) => {
      Object.entries(task.assignments || {}).forEach(([role, assignment]) => {
        if (assignment === "X") {
          roleWorkload.set(role, (roleWorkload.get(role) || 0) + 1)
        }
      })
    })

    if (roleWorkload.size > 1) {
      const workloadEntries = Array.from(roleWorkload.entries()).sort(([, a], [, b]) => b - a)
      const [overloadedRole, maxWorkload] = workloadEntries[0]
      const [underloadedRole, minWorkload] = workloadEntries[workloadEntries.length - 1]

      if (maxWorkload - minWorkload > 2) {
        // Find a task assigned to overloaded role that could be reassigned
        const reassignableTask = tasks.find((task) => task.assignments?.[overloadedRole] === "X")
        if (reassignableTask) {
          generatedInsights.push({
            id: "recommendation-balance",
            type: "recommendation",
            severity: "medium",
            title: "Workload Imbalance Detected",
            description: `${overloadedRole} has ${maxWorkload} primary assignments while ${underloadedRole} has ${minWorkload}. Consider reassigning "${reassignableTask.task.substring(0, 30)}..." to balance workload.`,
            action: `Reassign to ${underloadedRole}`,
            taskId: reassignableTask.id,
            roleKey: underloadedRole,
            assignment: "X",
            confidence: 87,
          })
        }
      }
    }

    // Trend Analysis: Support role recommendations
    const tasksWithoutSupport = tasks.filter((task) => {
      const hasSupport = Object.values(task.assignments || {}).includes("Support")
      const hasPrimary = Object.values(task.assignments || {}).includes("X")
      return hasPrimary && !hasSupport
    })

    if (tasksWithoutSupport.length > 0) {
      const taskNeedingSupport = tasksWithoutSupport[0]
      const availableRole = roles.find((role) => !taskNeedingSupport.assignments?.[role.key])
      if (availableRole) {
        generatedInsights.push({
          id: `trend-support-${taskNeedingSupport.id}`,
          type: "trend",
          severity: "low",
          title: "Support Role Opportunity",
          description: `Task "${taskNeedingSupport.task.substring(0, 30)}..." has primary assignment but lacks support. Adding ${availableRole.label} as support would improve collaboration.`,
          action: `Add ${availableRole.key} Support`,
          taskId: taskNeedingSupport.id,
          roleKey: availableRole.key,
          assignment: "Support",
          confidence: 78,
        })
      }
    }

    // Optimization: Multiple primary assignments
    const multiAssignedTasks = tasks.filter((task) => {
      const primaryRoles = Object.values(task.assignments || {}).filter((val) => val === "X")
      return primaryRoles.length > 1
    })

    if (multiAssignedTasks.length > 0) {
      const task = multiAssignedTasks[0]
      const primaryRoles = Object.entries(task.assignments || {}).filter(([, val]) => val === "X")
      if (primaryRoles.length > 1) {
        const [roleToChange] = primaryRoles[1] // Keep first, change second to support
        generatedInsights.push({
          id: `optimization-clarity-${task.id}`,
          type: "optimization",
          severity: "medium",
          title: "Multiple Primary Assignments",
          description: `Task "${task.task.substring(0, 30)}..." has multiple primary owners. Consider changing ${roleToChange} to support role for clarity.`,
          action: `Change ${roleToChange} to Support`,
          taskId: task.id,
          roleKey: roleToChange,
          assignment: "Support",
          confidence: 85,
        })
      }
    }

    return generatedInsights.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 }
      return severityOrder[b.severity] - severityOrder[a.severity]
    })
  }, [tasks, roles])

  const filteredInsights = useMemo(() => {
    if (selectedInsightType === "all") return insights
    return insights.filter((insight) => insight.type === selectedInsightType)
  }, [insights, selectedInsightType])

  /**
   * Handle applying a recommendation with proper validation
   */
  const handleApplyRecommendation = (insight: HBIInsight) => {
    console.log("Applying recommendation:", insight)

    if (onApplyRecommendation && insight.taskId && insight.roleKey && insight.assignment) {
      onApplyRecommendation(insight.taskId, insight.roleKey, insight.assignment)
      setAppliedInsights((prev) => new Set([...prev, insight.id]))
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "recommendation":
        return <Lightbulb className="h-4 w-4" />
      case "risk":
        return <AlertTriangle className="h-4 w-4" />
      case "trend":
        return <TrendingUp className="h-4 w-4" />
      case "optimization":
        return <Target className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "recommendation":
        return "text-green-600"
      case "risk":
        return "text-red-600"
      case "trend":
        return "text-blue-600"
      case "optimization":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className="border-l-4 border-[#FF6B35] bg-gradient-to-r from-blue-50 to-indigo-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-blue-100/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FF6B35] rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-[#003087]">HBI Insights</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">AI-powered recommendations and risk analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-[#FF6B35] text-white">
                  {insights.length} insights
                </Badge>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {["all", "recommendation", "risk", "trend", "optimization"].map((type) => (
                <Button
                  key={type}
                  variant={selectedInsightType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    console.log("Filter clicked:", type)
                    setSelectedInsightType(type)
                  }}
                  className="capitalize"
                >
                  {getInsightIcon(type)}
                  <span className="ml-1">{type === "all" ? "All" : type}</span>
                </Button>
              ))}
            </div>

            {/* Insights List */}
            <div className="space-y-3">
              {filteredInsights.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No insights available for the current selection.</p>
                </div>
              ) : (
                filteredInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={getTypeColor(insight.type)}>{getInsightIcon(insight.type)}</span>
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getSeverityColor(insight.severity)}>
                          {insight.severity}
                        </Badge>
                        <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>

                    {insight.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#003087] border-[#003087] hover:bg-[#003087] hover:text-white"
                        disabled={appliedInsights.has(insight.id)}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleApplyRecommendation(insight)
                        }}
                      >
                        {appliedInsights.has(insight.id) ? "Applied" : insight.action}
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 pt-4 border-t bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Matrix Health Score</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#003087]">
                    {tasks.length > 0
                      ? Math.round(
                          ((tasks.length -
                            tasks.filter((task) => Object.values(task.assignments || {}).filter(Boolean).length === 0)
                              .length) /
                            tasks.length) *
                            100,
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-xs text-gray-600">Assignment Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {insights.filter((i) => i.type === "recommendation").length}
                  </div>
                  <div className="text-xs text-gray-600">Recommendations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {insights.filter((i) => i.severity === "high").length}
                  </div>
                  <div className="text-xs text-gray-600">High Priority</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {insights.length > 0
                      ? Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)
                      : 0}
                  </div>
                  <div className="text-xs text-gray-600">Avg Confidence</div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
