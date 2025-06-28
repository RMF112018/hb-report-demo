"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Brain, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  DollarSign,
  FileText
} from "lucide-react"
import type { AiaPayApplication } from "@/types/aia-pay-application"
import { Button } from "@/components/ui/button"

interface AiaInsightsPanelProps {
  applications: AiaPayApplication[]
  projectId: string
}

export function AiaInsightsPanel({ applications, projectId }: AiaInsightsPanelProps) {
  // Generate AI insights based on application data
  const generateInsights = () => {
    const insights = []
    
    // Drafts ready for submission
    const drafts = applications.filter(app => app.status === "draft")
    if (drafts.length > 0) {
      insights.push({
        type: "opportunity",
        severity: "medium",
        title: `${drafts.length} Draft Applications Ready`,
        description: `${drafts.length} draft applications can be submitted for approval.`,
        action: "Submit for Review",
        icon: FileText,
        color: "blue"
      })
    }

    // Pending approvals
    const pending = applications.filter(app => 
      ["submitted", "pm_approved"].includes(app.status)
    )
    if (pending.length > 2) {
      insights.push({
        type: "alert",
        severity: "high",
        title: "High Volume of Pending Approvals",
        description: `${pending.length} applications are awaiting approval. Consider batch processing to reduce turnaround time.`,
        action: "Review Batch Approval",
        icon: Clock,
        color: "orange"
      })
    }

    // Payment performance
    const totalRequested = applications.reduce((sum, app) => sum + app.netAmountDue, 0)
    const totalPaid = applications
      .filter(app => app.status === "paid")
      .reduce((sum, app) => sum + app.netAmountDue, 0)
    
    const paymentRate = totalRequested > 0 ? (totalPaid / totalRequested) * 100 : 0
    
    if (paymentRate > 85) {
      insights.push({
        type: "success",
        severity: "low",
        title: "Excellent Payment Performance",
        description: `${paymentRate.toFixed(1)}% of requested amounts have been approved and paid.`,
        action: "View Trends",
        icon: TrendingUp,
        color: "green"
      })
    } else if (paymentRate < 60) {
      insights.push({
        type: "warning",
        severity: "medium",
        title: "Payment Performance Needs Attention",
        description: `Only ${paymentRate.toFixed(1)}% of requested amounts have been processed. Review approval bottlenecks.`,
        action: "Analyze Workflow",
        icon: AlertTriangle,
        color: "red"
      })
    }

    // Retention opportunities
    const retentionHeld = applications.reduce((sum, app) => sum + (app.retentionAmount || 0), 0)
    if (retentionHeld > 500000) {
      insights.push({
        type: "opportunity",
        severity: "medium",
        title: "Retention Release Opportunity",
        description: `${formatCurrency(retentionHeld)} in retention could be released based on project milestones.`,
        action: "Review Releases",
        icon: DollarSign,
        color: "purple"
      })
    }

    // Data discrepancies
    const discrepancies = applications.filter(app => 
      app.lineItems?.some(item => item.hasDiscrepancy)
    )
    if (discrepancies.length > 0) {
      insights.push({
        type: "alert",
        severity: "medium",
        title: "Data Sync Issues Detected",
        description: `${discrepancies.length} applications have discrepancies between Procore and Sage data.`,
        action: "Review Variances",
        icon: AlertTriangle,
        color: "yellow"
      })
    }

    return insights.slice(0, 4) // Limit to 4 insights
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getIconColor = (color: string) => {
    switch (color) {
      case "blue": return "text-blue-600 dark:text-blue-400"
      case "green": return "text-green-600 dark:text-green-400"
      case "orange": return "text-orange-600 dark:text-orange-400"
      case "red": return "text-red-600 dark:text-red-400"
      case "purple": return "text-purple-600 dark:text-purple-400"
      case "yellow": return "text-yellow-600 dark:text-yellow-400"
      default: return "text-muted-foreground"
    }
  }

  const getBorderColor = (color: string) => {
    switch (color) {
      case "blue": return "border-blue-200 dark:border-blue-800"
      case "green": return "border-green-200 dark:border-green-800"
      case "orange": return "border-orange-200 dark:border-orange-800"
      case "red": return "border-red-200 dark:border-red-800"
      case "purple": return "border-purple-200 dark:border-purple-800"
      case "yellow": return "border-yellow-200 dark:border-yellow-800"
      default: return "border-border"
    }
  }

  const getBackgroundColor = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-50 dark:bg-blue-950/30"
      case "green": return "bg-green-50 dark:bg-green-950/30"
      case "orange": return "bg-orange-50 dark:bg-orange-950/30"
      case "red": return "bg-red-50 dark:bg-red-950/30"
      case "purple": return "bg-purple-50 dark:bg-purple-950/30"
      case "yellow": return "bg-yellow-50 dark:bg-yellow-950/30"
      default: return "bg-muted/50"
    }
  }

  const insights = generateInsights()

  if (insights.length === 0) {
    return (
      <Card className="border-violet-200 dark:border-violet-800 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-violet-800 dark:text-violet-300">
            <Brain className="h-5 w-5" />
            HBI Pay Application Intelligence
            <Badge variant="secondary" className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">All Systems Optimal</h3>
              <p className="text-muted-foreground">No critical insights or recommendations at this time.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-violet-200 dark:border-violet-800 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-violet-800 dark:text-violet-300">
          <Brain className="h-5 w-5" />
          HBI Pay Application Intelligence
          <Badge variant="secondary" className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon
            return (
              <Alert 
                key={index} 
                className={`${getBorderColor(insight.color)} ${getBackgroundColor(insight.color)}`}
              >
                <IconComponent className={`h-4 w-4 ${getIconColor(insight.color)}`} />
                <AlertDescription>
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={insight.severity === 'high' ? 'destructive' : insight.severity === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {insight.severity.toUpperCase()}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`text-xs hover:bg-background/50 ${getIconColor(insight.color)}`}
                      >
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-violet-200 dark:border-violet-800">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-violet-800 dark:text-violet-300">
                {applications.length}
              </div>
              <div className="text-sm text-violet-600 dark:text-violet-400">Total Applications</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-violet-800 dark:text-violet-300">
                {formatCurrency(applications.reduce((sum, app) => sum + app.netAmountDue, 0))}
              </div>
              <div className="text-sm text-violet-600 dark:text-violet-400">Total Value</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-violet-800 dark:text-violet-300">
                {applications.filter(app => ["px_approved", "paid"].includes(app.status)).length}
              </div>
              <div className="text-sm text-violet-600 dark:text-violet-400">Approved</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 