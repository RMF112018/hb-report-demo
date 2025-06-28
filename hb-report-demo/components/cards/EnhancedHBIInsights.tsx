"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Brain,
  Zap,
  Target,
  Activity,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HBIInsight {
  id: string;
  type: "forecast" | "risk" | "opportunity" | "performance" | "alert";
  severity: "low" | "medium" | "high";
  title: string;
  text: string;
  action: string;
  confidence: number;
  relatedMetrics: string[];
  project_id?: string;
}

interface EnhancedHBIInsightsProps {
  config: HBIInsight[] | any;
  cardId?: string;
}

export function EnhancedHBIInsights({ config, cardId }: EnhancedHBIInsightsProps) {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Handle both array and object config formats
  const insights = Array.isArray(config) ? config : [];

  // Financial-specific insights if this is a financial review card
  const financialInsights: HBIInsight[] = [
    {
      id: "fin-1",
      type: "risk",
      severity: "high",
      title: "Cash Flow Risk Detected",
      text: "3 projects showing potential cash flow constraints in Q2 2025.",
      action: "Accelerate billing schedules and negotiate improved payment terms.",
      confidence: 89,
      relatedMetrics: ["Cash Flow", "Billing Schedule", "Payment Terms"],
      project_id: "global",
    },
    {
      id: "fin-2",
      type: "opportunity",
      severity: "medium",
      title: "Profit Margin Enhancement",
      text: "AI identifies $1.2M additional profit through GC optimization.",
      action: "Implement recommended general conditions adjustments.",
      confidence: 91,
      relatedMetrics: ["Profit Margin", "General Conditions", "Cost Control"],
      project_id: "global",
    },
    {
      id: "fin-3",
      type: "alert",
      severity: "high",
      title: "Contingency Utilization Alert",
      text: "Project TW-2024 has exceeded 75% contingency threshold.",
      action: "Review project scope and implement cost control measures.",
      confidence: 96,
      relatedMetrics: ["Contingency", "Cost Control", "Project Scope"],
      project_id: "TW-2024",
    },
    {
      id: "fin-4",
      type: "forecast",
      severity: "medium",
      title: "Revenue Recognition Optimization",
      text: "Predictive models suggest 8% improvement in revenue timing.",
      action: "Adjust milestone billing to optimize revenue recognition.",
      confidence: 83,
      relatedMetrics: ["Revenue Recognition", "Milestone Billing", "Contract Value"],
      project_id: "global",
    },
    {
      id: "fin-5",
      type: "performance",
      severity: "low",
      title: "Buyout Savings Trend",
      text: "Current buyout performance tracking 15% above target.",
      action: "Continue current procurement strategy and expand to similar projects.",
      confidence: 94,
      relatedMetrics: ["Buyout Savings", "Procurement", "Cost Management"],
      project_id: "global",
    },
  ];

  // Mock data for executive dashboard if no insights provided
  const mockInsights: HBIInsight[] = [
    {
      id: "exec-1",
      type: "risk",
      severity: "high",
      title: "Supply Chain Risk Alert",
      text: "Material cost volatility detected across 3 major projects.",
      action: "Diversify supplier base and implement strategic stockpiling.",
      confidence: 92,
      relatedMetrics: ["Material Costs", "Project Margins", "Supply Chain"],
      project_id: "global",
    },
    {
      id: "exec-2",
      type: "opportunity",
      severity: "medium",
      title: "Market Expansion Opportunity",
      text: "15% growth potential identified in Austin commercial sector.",
      action: "Consider expanding commercial division partnerships.",
      confidence: 88,
      relatedMetrics: ["Market Growth", "Commercial Projects", "Revenue"],
      project_id: "global",
    },
    {
      id: "exec-3",
      type: "performance",
      severity: "high",
      title: "Resource Optimization Alert",
      text: "AI analysis shows 12% efficiency gain possible through reallocation.",
      action: "Implement resource optimization across critical projects.",
      confidence: 94,
      relatedMetrics: ["Resource Allocation", "Efficiency", "Critical Path"],
      project_id: "global",
    },
    {
      id: "exec-4",
      type: "forecast",
      severity: "medium",
      title: "Cash Flow Optimization",
      text: "Predictive models suggest 18% improvement through payment scheduling.",
      action: "Implement automated payment scheduling system.",
      confidence: 79,
      relatedMetrics: ["Cash Flow", "Payment Terms", "Working Capital"],
      project_id: "global",
    },
  ];

  // Determine which insights to use based on card context
  const isFinancialReview = cardId?.includes('financial') || cardId?.includes('fin-');
  const defaultInsights = isFinancialReview ? financialInsights : mockInsights;
  const displayInsights = insights.length > 0 ? insights : defaultInsights;
  const visibleInsights = showAll ? displayInsights : displayInsights.slice(0, 4);
  const avgConfidence = Math.round(
    displayInsights.reduce((sum, insight) => sum + insight.confidence, 0) / displayInsights.length,
  );
  const highSeverityCount = displayInsights.filter((insight) => insight.severity === "high").length;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "forecast":
        return <TrendingUp className="h-3 w-3" />;
      case "risk":
        return <AlertTriangle className="h-3 w-3" />;
      case "opportunity":
        return <CheckCircle className="h-3 w-3" />;
      case "performance":
        return <Target className="h-3 w-3" />;
      default:
        return <Sparkles className="h-3 w-3" />;
    }
  };

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 hover:bg-red-100";
      case "medium":
        return "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30 hover:bg-yellow-100";
      case "low":
        return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 hover:bg-green-100";
      default:
        return "border-border bg-muted/50";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 dark:text-red-400 bg-red-100";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100";
      case "low":
        return "text-green-600 dark:text-green-400 bg-green-100";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div 
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-tour="hbi-insights"
    >
      <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 overflow-hidden">
      {/* AI Stats Header */}
      <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-purple-200">
        <div className="flex items-center justify-between mb-1 sm:mb-1.5 lg:mb-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-600 text-white border-purple-600 text-xs">
              <Activity className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
            <div className="text-sm text-purple-700 font-medium">
              {avgConfidence}% Avg Confidence
            </div>
          </div>
        </div>
        
        {/* Compact Stats */}
        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 lg:gap-2">
          <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
            <div className="font-bold text-lg text-red-700">{highSeverityCount}</div>
            <div className="text-xs text-red-600 dark:text-red-400">Critical</div>
          </div>
          <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
            <div className="font-bold text-lg text-green-700">
              {displayInsights.filter((i) => i.type === "opportunity").length}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">Opportunities</div>
          </div>
          <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="font-bold text-lg text-blue-700">
              {displayInsights.filter((i) => i.type === "forecast").length}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Forecasts</div>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 overflow-y-auto">
        <div className="space-y-2">
          {visibleInsights.map((insight) => (
            <div
              key={insight.id}
              className={cn(
                "p-2 rounded-lg border cursor-pointer transition-all duration-200 shadow-sm",
                getInsightColor(insight.severity),
                selectedInsight === insight.id && "ring-2 ring-purple-400"
              )}
              onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-foreground leading-tight">
                      {insight.title}
                    </h4>
                    <Badge className={cn("text-xs px-2 py-0.5", getSeverityColor(insight.severity))}>
                      {insight.confidence}%
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-foreground mb-1 leading-snug">
                    {insight.text}
                  </p>

                  {selectedInsight === insight.id && (
                    <div className="mt-2 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg border border-white/50 dark:border-black/50">
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 text-purple-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground font-medium">
                          {insight.action}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show More/Less Button */}
      {displayInsights.length > 4 && (
        <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-2.5 border-t border-purple-200 bg-white/60 dark:bg-black/60">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-sm text-purple-600 hover:text-purple-800 flex items-center justify-center gap-2 font-medium py-1"
          >
            <span>{showAll ? "Show Less" : `+${displayInsights.length - 4} More Insights`}</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", showAll && "rotate-180")} />
          </button>
        </div>
      )}
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-purple-900/95 backdrop-blur-sm rounded-lg p-2 sm:p-1.5 sm:p-2 lg:p-2.5 lg:p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 text-white transition-all duration-300 ease-in-out overflow-y-auto">
          <div className="h-full">
            <h3 className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 text-center">AI Intelligence Deep Analysis</h3>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-1 sm:gap-1.5 lg:gap-2 lg:gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 h-[calc(100%-60px)]">
              {/* AI Performance Metrics */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    AI Performance Analytics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Model Accuracy:</span>
                      <span className="font-medium text-purple-300">{avgConfidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prediction Reliability:</span>
                      <span className="font-medium text-green-400">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Processing Speed:</span>
                      <span className="font-medium text-blue-400">47ms avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Learning Efficiency:</span>
                      <span className="font-medium text-yellow-400">High</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Real-Time Insights
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="border-b border-white/20 dark:border-black/20 pb-2">
                      <div className="flex justify-between">
                        <span>Active Monitoring:</span>
                        <span className="font-medium text-green-400">{displayInsights.length} sources</span>
                      </div>
                      <div className="text-xs text-purple-200">Last updated: 2 minutes ago</div>
                    </div>
                    <div className="border-b border-white/20 dark:border-black/20 pb-2">
                      <div className="flex justify-between">
                        <span>Pattern Recognition:</span>
                        <span className="font-medium text-blue-400">12 trends identified</span>
                      </div>
                      <div className="text-xs text-purple-200">Cross-project correlations detected</div>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-purple-200">
                        <span>Recommendation Engine:</span>
                        <span className="font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight Categories Analysis */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Insight Categories Breakdown
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Risk Alerts:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-red-400">
                          {displayInsights.filter(i => i.type === 'risk').length}
                        </span>
                        <span className="text-xs text-purple-200">
                          ({highSeverityCount} high)
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Opportunities:</span>
                      <span className="font-medium text-green-400">
                        {displayInsights.filter(i => i.type === 'opportunity').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Forecasts:</span>
                      <span className="font-medium text-blue-400">
                        {displayInsights.filter(i => i.type === 'forecast').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance:</span>
                      <span className="font-medium text-yellow-400">
                        {displayInsights.filter(i => i.type === 'performance').length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Strategic Recommendations
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-purple-200">
                      <p className="font-medium mb-1">Priority Actions:</p>
                      <ul className="text-xs space-y-1 list-disc list-inside">
                        <li>Address {highSeverityCount} critical risk alerts immediately</li>
                        <li>Capitalize on {displayInsights.filter(i => i.type === 'opportunity').length} identified opportunities</li>
                        <li>Monitor forecast accuracy for strategic planning</li>
                        <li>Optimize performance based on AI recommendations</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-white/20 dark:border-black/20">
                      <p className="text-xs text-purple-200">
                        AI confidence level: {avgConfidence}% average. 
                        System learning from {isFinancialReview ? 'financial' : 'operational'} patterns across all projects.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 