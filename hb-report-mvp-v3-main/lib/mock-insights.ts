import type { AIInsight, DashboardCard } from "@/types/dashboard"

export function generateMockInsights(visibleCards: DashboardCard[]): AIInsight[] {
  const insights: AIInsight[] = []
  const cardTypes = visibleCards.map((c) => c.type)

  // Financial insights
  if (cardTypes.includes("financial-overview") || cardTypes.includes("budget-variance")) {
    insights.push({
      id: "financial-trend-1",
      type: "trend",
      title: "Revenue Growth Acceleration",
      description: "Revenue has increased 23% over the last quarter, outpacing industry average by 8%.",
      severity: "medium",
      confidence: 0.87,
      relatedCards: ["financial-overview-1"],
      actionable: false,
      dismissed: false,
      createdAt: new Date(),
    })

    insights.push({
      id: "budget-alert-1",
      type: "alert",
      title: "Metro Office Budget Variance",
      description: "Metro Office project is 4% over budget. Consider reviewing material costs and labor allocation.",
      severity: "high",
      confidence: 0.92,
      relatedCards: ["budget-variance-1"],
      actionable: true,
      dismissed: false,
      createdAt: new Date(),
    })
  }

  // Schedule insights
  if (cardTypes.includes("schedule-overview") || cardTypes.includes("critical-path")) {
    insights.push({
      id: "schedule-prediction-1",
      type: "prediction",
      title: "Potential Schedule Delay",
      description:
        "Based on current progress, Panther Tower may experience a 2-week delay. Weather conditions are a contributing factor.",
      severity: "high",
      confidence: 0.78,
      relatedCards: ["schedule-overview-1", "critical-path-1"],
      actionable: true,
      dismissed: false,
      createdAt: new Date(),
    })
  }

  // Health insights
  if (cardTypes.includes("health-overview") || cardTypes.includes("safety-dashboard")) {
    insights.push({
      id: "safety-trend-1",
      type: "trend",
      title: "Excellent Safety Record",
      description: "45 days without incidents across all projects. Safety training completion rate is at 98%.",
      severity: "low",
      confidence: 0.95,
      relatedCards: ["safety-dashboard-1"],
      actionable: false,
      dismissed: false,
      createdAt: new Date(),
    })

    insights.push({
      id: "quality-recommendation-1",
      type: "recommendation",
      title: "Quality Process Optimization",
      description: "Consider implementing automated quality checks to reduce rework rate from 2.1% to target 1.5%.",
      severity: "medium",
      confidence: 0.73,
      relatedCards: ["quality-metrics-1"],
      actionable: true,
      dismissed: false,
      createdAt: new Date(),
    })
  }

  // General insights
  insights.push({
    id: "performance-insight-1",
    type: "recommendation",
    title: "Dashboard Optimization",
    description: "Based on your viewing patterns, consider adding a Cash Flow card to monitor liquidity trends.",
    severity: "low",
    confidence: 0.65,
    relatedCards: [],
    actionable: true,
    dismissed: false,
    createdAt: new Date(),
  })

  return insights.slice(0, 6) // Limit to 6 insights
}
