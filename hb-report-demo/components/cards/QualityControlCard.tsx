"use client";

import { useState } from "react";
import { CheckCircle, AlertTriangle, ChevronRight, Eye, FileText, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface QualityControlCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function QualityControlCard({ config, span, isCompact, userRole }: QualityControlCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          totalInspections: 32,
          openInspections: 8,
          closedInspections: 24,
          passRate: 87.5,
          avgResolutionTime: 3.2,
          criticalIssues: 2,
          tradeBreakdown: {
            electrical: 8,
            plumbing: 6,
            hvac: 7,
            framing: 5,
            glazing: 6
          },
          drillDown: {
            topTrade: { name: "Electrical", passRate: 92.3 },
            worstTrade: { name: "Glazing", passRate: 78.5 },
            recentInspection: "QA/QC - Fire Sprinkler",
            averageScore: 87.5,
            upcomingInspections: 5,
            qualityTrend: "Improving"
          }
        };
      case 'project-executive':
        // Limited to 7 projects
        return {
          totalInspections: 185,
          openInspections: 42,
          closedInspections: 143,
          passRate: 84.2,
          avgResolutionTime: 4.1,
          criticalIssues: 8,
          tradeBreakdown: {
            electrical: 38,
            plumbing: 32,
            hvac: 35,
            framing: 28,
            glazing: 25,
            structural: 27
          },
          drillDown: {
            topTrade: { name: "Structural", passRate: 91.2 },
            worstTrade: { name: "Waterproofing", passRate: 76.8 },
            recentInspection: "QA/QC - MEP Systems",
            averageScore: 84.2,
            upcomingInspections: 18,
            qualityTrend: "Stable"
          }
        };
      default:
        // Executive - all projects
        return {
          totalInspections: 385,
          openInspections: 85,
          closedInspections: 300,
          passRate: 82.8,
          avgResolutionTime: 4.8,
          criticalIssues: 15,
          tradeBreakdown: {
            electrical: 68,
            plumbing: 58,
            hvac: 62,
            framing: 52,
            glazing: 48,
            structural: 45,
            waterproofing: 52
          },
          drillDown: {
            topTrade: { name: "Electrical", passRate: 89.5 },
            worstTrade: { name: "Waterproofing", passRate: 74.2 },
            recentInspection: "QA/QC - Structural Steel",
            averageScore: 82.8,
            upcomingInspections: 28,
            qualityTrend: "Needs Attention"
          }
        };
    }
  };

  const data = getDataByRole();

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getPassRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-600 dark:text-green-400";
    if (rate >= 80) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getStatusColor = (openCount: number, totalCount: number) => {
    const openRate = (openCount / totalCount) * 100;
    if (openRate <= 15) return "text-green-600 dark:text-green-400";
    if (openRate <= 25) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-emerald-200 dark:border-emerald-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className={`text-lg font-bold ${getPassRateColor(data.passRate)}`}>{formatPercentage(data.passRate)}</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">Pass Rate</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${getStatusColor(data.openInspections, data.totalInspections)}`}>{data.openInspections}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Open</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Inspection Status */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-foreground">Inspection Status</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800">
              <div className="text-sm font-bold text-green-700">{data.closedInspections}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Closed</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded border border-yellow-200 dark:border-yellow-800">
              <div className="text-sm font-bold text-yellow-700">{data.openInspections}</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">Open</div>
            </div>
          </div>
        </div>

        {/* Quality Performance */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-foreground">Quality Performance</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Overall Pass Rate</span>
              <Badge className={`${getPassRateColor(data.passRate) === 'text-green-600 dark:text-green-400' ? 'bg-green-100 text-green-700' : 
                getPassRateColor(data.passRate) === 'text-yellow-600 dark:text-yellow-400' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {formatPercentage(data.passRate)}
              </Badge>
            </div>
            <Progress value={data.passRate} className="h-2" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avg Resolution Time</span>
              <span className="font-medium">{data.avgResolutionTime} days</span>
            </div>
          </div>
        </div>

        {/* Critical Issues */}
        {data.criticalIssues > 0 && (
          <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-foreground">Critical Issues</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-red-700">
                {data.criticalIssues}
              </div>
              <Badge variant="destructive" className="text-xs">
                Needs Attention
              </Badge>
            </div>
          </div>
        )}

        {/* Trade Performance */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-foreground">By Trade</span>
          </div>
          <div className="space-y-1">
            {Object.entries(data.tradeBreakdown).slice(0, 5).map(([trade, count]) => (
              <div key={trade} className="flex justify-between text-xs">
                <span className="text-muted-foreground capitalize">{trade}</span>
                <Badge variant="outline" className="text-xs">{count}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Resolution Performance */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-foreground">Resolution Metrics</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total Inspections</span>
              <span className="font-medium">{data.totalInspections}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Resolution Rate</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatPercentage((data.closedInspections / data.totalInspections) * 100)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-emerald-900/95 backdrop-blur-sm p-4 flex flex-col justify-center text-white animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-sm">Quality Control Analysis</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-emerald-200">Top Performer:</span>
                <span className="font-medium text-green-300">{data.drillDown.topTrade.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-200">Pass Rate:</span>
                <span className="font-medium">{formatPercentage(data.drillDown.topTrade.passRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-200">Needs Focus:</span>
                <span className="font-medium text-red-300">{data.drillDown.worstTrade.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-200">Pass Rate:</span>
                <span className="font-medium">{formatPercentage(data.drillDown.worstTrade.passRate)}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-700">
              <div className="text-xs font-medium text-emerald-200 mb-2">Performance Insights</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-emerald-300">Quality Trend:</span>
                  <span className="font-medium">{data.drillDown.qualityTrend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300">Recent Inspection:</span>
                  <span className="font-medium">{data.drillDown.recentInspection}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300">Upcoming:</span>
                  <span className="font-medium text-emerald-300">{data.drillDown.upcomingInspections} scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 