"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, ChevronRight, Droplets, Calendar, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CashFlowCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function CashFlowCard({ config, span, isCompact, userRole }: CashFlowCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view - Palm Beach Luxury Estate
        return {
          totalInflows: 53476271.19,
          totalOutflows: 45261264.55,
          netCashFlow: 8215006.64,
          workingCapital: 9732503.32,
          currentMonthFlow: 347467.29,
          forecastAccuracy: 93.2,
          cashFlowAtRisk: 0,
          projectsPositive: 1,
          projectsNegative: 0,
          drillDown: {
            largestInflow: { project: "Palm Beach Luxury Estate", amount: 1783577.35 },
            largestOutflow: { project: "Palm Beach Luxury Estate", amount: 1436110.06 },
            avgMonthlyFlow: 685834.22,
            peakRequirement: 132675.42,
            retentionHeld: 281284.60,
            flowTrend: "Improving"
          }
        };
      case 'project-executive':
        // Limited to 7 projects
        return {
          totalInflows: 285480000,
          totalOutflows: 242850000,
          netCashFlow: 42630000,
          workingCapital: 48200000,
          currentMonthFlow: 2850000,
          forecastAccuracy: 91.8,
          cashFlowAtRisk: 1250000,
          projectsPositive: 5,
          projectsNegative: 2,
          drillDown: {
            largestInflow: { project: "Medical Center East", amount: 8500000 },
            largestOutflow: { project: "Tech Campus Phase 2", amount: 6200000 },
            avgMonthlyFlow: 3560000,
            peakRequirement: 2850000,
            retentionHeld: 8540000,
            flowTrend: "Stable"
          }
        };
      default:
        // Executive - all projects
        return {
          totalInflows: 485280000,
          totalOutflows: 412450000,
          netCashFlow: 72830000,
          workingCapital: 82500000,
          currentMonthFlow: 4850000,
          forecastAccuracy: 89.5,
          cashFlowAtRisk: 2800000,
          projectsPositive: 8,
          projectsNegative: 4,
          drillDown: {
            largestInflow: { project: "Medical Center East", amount: 12500000 },
            largestOutflow: { project: "Tech Campus Phase 2", amount: 8900000 },
            avgMonthlyFlow: 6080000,
            peakRequirement: 4850000,
            retentionHeld: 15200000,
            flowTrend: "Strong Growth"
          }
        };
    }
  };

  const data = getDataByRole();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getFlowColor = (flow: number) => {
    return flow >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  };

  const getFlowIcon = (flow: number) => {
    return flow >= 0 ? <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" /> : <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />;
  };

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-cyan-200 dark:border-cyan-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-cyan-700">{formatCurrency(data.netCashFlow)}</div>
            <div className="text-xs text-cyan-600 dark:text-cyan-400">Net Cash Flow</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-700">{data.forecastAccuracy}%</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Current Month Flow */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span className="text-sm font-medium text-foreground">Current Month</span>
          </div>
          <div className="flex items-center justify-between">
            <div className={`text-lg font-bold ${getFlowColor(data.currentMonthFlow)}`}>
              {formatCurrency(data.currentMonthFlow)}
            </div>
            <div className="flex items-center gap-1">
              {getFlowIcon(data.currentMonthFlow)}
            </div>
          </div>
        </div>

        {/* Working Capital */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span className="text-sm font-medium text-foreground">Working Capital</span>
          </div>
          <div className="text-lg font-bold text-green-700">
            {formatCurrency(data.workingCapital)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Available liquidity
          </div>
        </div>

        {/* Project Cash Flow Status */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span className="text-sm font-medium text-foreground">Project Status</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800">
              <div className="text-sm font-bold text-green-700">{data.projectsPositive}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Positive</div>
            </div>
            <div className="text-center p-2 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-800">
              <div className="text-sm font-bold text-red-700">{data.projectsNegative}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Negative</div>
            </div>
          </div>
        </div>

        {/* Cash Flow at Risk */}
        {data.cashFlowAtRisk > 0 && (
          <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-foreground">At Risk</span>
            </div>
            <div className="text-lg font-bold text-red-700">
              {formatCurrency(data.cashFlowAtRisk)}
            </div>
            <Badge variant="destructive" className="text-xs mt-1">
              Needs Attention
            </Badge>
          </div>
        )}

        {/* Forecast Accuracy */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span className="text-sm font-medium text-foreground">Forecast Performance</span>
          </div>
          <div className="space-y-2">
            <Progress value={data.forecastAccuracy} className="h-2" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Accuracy</span>
              <Badge className="bg-cyan-100 text-cyan-700">{data.forecastAccuracy}%</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-cyan-900/95 backdrop-blur-sm p-4 flex flex-col justify-center text-white animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-sm">Cash Flow Analysis</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-cyan-200">Total Inflows:</span>
                <span className="font-medium text-green-300">{formatCurrency(data.totalInflows)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-200">Total Outflows:</span>
                <span className="font-medium text-red-300">{formatCurrency(data.totalOutflows)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-200">Avg Monthly Flow:</span>
                <span className="font-medium">{formatCurrency(data.drillDown.avgMonthlyFlow)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-200">Retention Held:</span>
                <span className="font-medium">{formatCurrency(data.drillDown.retentionHeld)}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-cyan-700">
              <div className="text-xs font-medium text-cyan-200 mb-2">Flow Performance</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-cyan-300">Largest Inflow:</span>
                  <span className="text-green-300">{data.drillDown.largestInflow.project}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">Amount:</span>
                  <span className="font-medium">{formatCurrency(data.drillDown.largestInflow.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">Trend:</span>
                  <span className="font-medium text-green-300">{data.drillDown.flowTrend}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 