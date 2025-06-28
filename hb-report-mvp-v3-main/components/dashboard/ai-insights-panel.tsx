'use client'; // Marks this component as client-side only to handle dynamic insight rendering and user interactions

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AIInsight } from '@/types/dashboard';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  RefreshCw,
  X,
} from 'lucide-react';

/**
 * AIInsightsPanel Component
 * @description A panel component that displays a scrollable list of AI-generated insights, categorized by priority
 *              (high urgency first). Supports refreshing insights and dismissing individual items. Designed for
 *              client-side rendering to manage dynamic data and user interactions. Addresses rendering degradation
 *              by ensuring consistent Tailwind styling and rounded corners.
 * @features
 * - Categorizes insights into high-priority and other insights
 * - Includes a refresh button for updating insights
 * - Supports dismissing insights (placeholder functionality)
 * - Responsive design with scrollable area
 */
interface AIInsightsPanelProps {
  insights: AIInsight[]; // Array of AIInsight objects containing insight details
  onRefresh: () => void; // Callback function to refresh the insights list
}

/**
 * InsightCard Component
 * @description A sub-component that renders an individual insight card with icon, title, description,
 *              severity badge, and dismissal button.
 * @param {object} props - The props for the component.
 * @param {AIInsight} props.insight - The insight object to display.
 * @returns {JSX.Element} A card representing a single insight.
 */
function InsightCard({ insight }: { insight: AIInsight }) {
  /**
   * getInsightIcon Function
   * @description Returns the appropriate Lucide icon based on the insight type.
   * @param {string} type - The type of insight (trend, alert, recommendation, prediction, or default)
   * @returns {React.ReactNode} The corresponding icon component
   */
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4" />;
      case 'prediction':
        return <Target className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  /**
   * getSeverityColor Function
   * @description Determines the Badge variant based on the insight's severity level.
   * @param {string} severity - The severity level (high, medium, low, or default)
   * @returns {string} The corresponding Badge variant
   */
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div
      className={`p-3 rounded-lg border ${
        insight.severity === 'high'
          ? 'border-red-200 bg-red-50'
          : insight.severity === 'medium'
            ? 'border-blue-200 bg-blue-50'
            : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getInsightIcon(insight.type)}
          <span className="text-sm font-medium">{insight.title}</span>
        </div>
        <Badge variant={getSeverityColor(insight.severity) as any} className="text-xs">
          {insight.severity}
        </Badge>
      </div>

      <p className="text-xs text-gray-600 mb-2">{insight.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{Math.round(insight.confidence * 100)}% confidence</span>
          {insight.actionable && (
            <Badge variant="outline" className="text-xs">
              Actionable
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => console.log(`Dismiss insight ${insight.id}`)} // Placeholder for dismissal
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export function AIInsightsPanel({ insights, onRefresh }: AIInsightsPanelProps) {
  /**
   * getInsightIcon Function
   * @description Returns the appropriate Lucide icon based on the insight type.
   * @param {string} type - The type of insight (trend, alert, recommendation, prediction, or default)
   * @returns {React.ReactNode} The corresponding icon component
   */
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4" />;
      case 'prediction':
        return <Target className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  /**
   * getSeverityColor Function
   * @description Determines the Badge variant based on the insight's severity level.
   * @param {string} severity - The severity level (high, medium, low, or default)
   * @returns {string} The corresponding Badge variant
   */
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Filter insights into high-priority and other categories, excluding dismissed items
  const highPriorityInsights = insights.filter((i) => i.severity === 'high' && !i.dismissed);
  const otherInsights = insights.filter((i) => i.severity !== 'high' && !i.dismissed);

  return (
    <Card className="h-full rounded-lg"> {/* Ensure rounded corners */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            AI Insights
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {/* High Priority Insights Section - Displays urgent items first */}
            {highPriorityInsights.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-600 mb-2">Urgent Attention</h4>
                <div className="space-y-3">
                  {highPriorityInsights.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </div>
            )}

            {/* Other Insights Section - Displays non-urgent insights */}
            {otherInsights.length > 0 && (
              <div>
                {highPriorityInsights.length > 0 && (
                  <h4 className="text-sm font-medium text-gray-600 mb-2 mt-6">Additional Insights</h4>
                )}
                <div className="space-y-3">
                  {otherInsights.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </div>
            )}

            {/* No Insights Placeholder - Displayed when no insights are available */}
            {insights.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No insights available</p>
                <p className="text-xs mt-1">Add cards to your dashboard to generate insights</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}