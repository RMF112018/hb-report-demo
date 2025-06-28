"use client";

import { useState } from "react";
import { Wrench, TrendingUp, TrendingDown, Calculator, Target, ChevronRight, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface GeneralConditionsCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function GeneralConditionsCard({ config, span, isCompact, userRole }: GeneralConditionsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          originalGCEstimate: 2294000, // single project
          currentGCEstimate: 2050000,
          gcVariance: -244000, // savings
          gcUtilizationRate: 89,
          projectsWithSavings: 1,
          projectsOverBudget: 0,
          avgSavingsPercent: 10.6,
          totalSavings: 244000,
          drillDown: {
            categories: {
              supervision: { budget: 850000, actual: 760000, variance: -90000 },
              equipment: { budget: 620000, actual: 580000, variance: -40000 },
              temporary: { budget: 480000, actual: 420000, variance: -60000 }
            },
            topSavingsProject: "Tropical World Nursery",
            biggestOverrun: "N/A",
            efficiencyGains: ["Prefab temporary structures", "Efficient supervision", "Equipment sharing"],
            avgCostPerSqFt: 11.80,
            benchmarkComparison: 15.2 // industry average
          }
        };
      case 'project-executive':
        // Limited to 7 projects
        return {
          originalGCEstimate: 10654000, // 7 projects
          currentGCEstimate: 9250000,
          gcVariance: -1404000, // savings
          gcUtilizationRate: 87,
          projectsWithSavings: 5,
          projectsOverBudget: 1,
          avgSavingsPercent: 13.2,
          totalSavings: 1404000,
          drillDown: {
            categories: {
              supervision: { budget: 2650000, actual: 2400000, variance: -250000 },
              equipment: { budget: 1850000, actual: 1700000, variance: -150000 },
              temporary: { budget: 1600000, actual: 1450000, variance: -150000 }
            },
            topSavingsProject: "Medical Center East",
            biggestOverrun: "Tech Campus Phase 2",
            efficiencyGains: ["Prefab temporary structures", "Shared equipment fleet", "Optimized supervision"],
            avgCostPerSqFt: 12.20,
            benchmarkComparison: 15.2 // industry average
          }
        };
      default:
        // Executive - all projects
        return {
          originalGCEstimate: 18364000, // sum across projects
          currentGCEstimate: 15943000,
          gcVariance: -2421000, // savings
          gcUtilizationRate: 87,
          projectsWithSavings: 7,
          projectsOverBudget: 2,
          avgSavingsPercent: 13.2,
          totalSavings: 2421000,
          drillDown: {
            categories: {
              supervision: { budget: 4500000, actual: 4200000, variance: -300000 },
              equipment: { budget: 3200000, actual: 2950000, variance: -250000 },
              temporary: { budget: 2800000, actual: 2600000, variance: -200000 }
            },
            topSavingsProject: "Medical Center East",
            biggestOverrun: "Tech Campus Phase 2",
            efficiencyGains: ["Prefab temporary structures", "Shared equipment fleet", "Optimized supervision"],
            avgCostPerSqFt: 12.50,
            benchmarkComparison: 15.2 // industry average
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getVarianceIcon = (variance: number) => {
    return variance < 0 ? <TrendingDown className="h-3 w-3 text-green-600 dark:text-green-400" /> : <TrendingUp className="h-3 w-3 text-red-600 dark:text-red-400" />;
  };

  const getVarianceColor = (variance: number) => {
    return variance < 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  };

  const getVarianceBadge = (variance: number) => {
    return variance < 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-blue-200 dark:border-blue-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-700">{formatPercentage(data.avgSavingsPercent)}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Avg Savings</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-700">{data.gcUtilizationRate}%</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Utilization</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* GC Estimate Comparison */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-foreground">GC Estimates</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Original</span>
              <span className="font-medium">{formatCurrency(data.originalGCEstimate)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Current</span>
              <span className="font-medium">{formatCurrency(data.currentGCEstimate)}</span>
            </div>
          </div>
        </div>

        {/* Variance Analysis */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-foreground">Variance Analysis</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {getVarianceIcon(data.gcVariance)}
              <span className={`text-lg font-bold ${getVarianceColor(data.gcVariance)}`}>
                {formatCurrency(Math.abs(data.gcVariance))}
              </span>
            </div>
            <Badge className={getVarianceBadge(data.gcVariance)}>
              {data.gcVariance < 0 ? 'Savings' : 'Overrun'}
            </Badge>
          </div>
          <div className="mt-2">
            <Progress value={data.gcUtilizationRate} className="h-2" />
          </div>
        </div>

        {/* Project Performance */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-foreground">Project Performance</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800">
              <div className="text-sm font-bold text-green-700">{data.projectsWithSavings}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Under Budget</div>
            </div>
            <div className="text-center p-2 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-800">
              <div className="text-sm font-bold text-red-700">{data.projectsOverBudget}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Over Budget</div>
            </div>
          </div>
        </div>

        {/* Total Impact */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-foreground">Total Impact</span>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-700">
              {formatCurrency(data.totalSavings)}
            </div>
            <div className="text-xs text-muted-foreground">Total Portfolio Savings</div>
            <Badge className="bg-green-100 text-green-700 text-xs mt-1">
              {formatPercentage((Math.abs(data.gcVariance) / data.originalGCEstimate) * 100)} Reduction
            </Badge>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-blue-900/95 backdrop-blur-sm p-4 flex flex-col justify-center text-white animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-sm">GC Cost Breakdown</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-blue-200">Best Performer:</span>
                <span className="font-medium text-green-300">{data.drillDown.topSavingsProject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Needs Attention:</span>
                <span className="font-medium text-red-300">{data.drillDown.biggestOverrun}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Cost per Sq Ft:</span>
                <span className="font-medium">${data.drillDown.avgCostPerSqFt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Industry Benchmark:</span>
                <span className="font-medium text-green-300">${data.drillDown.benchmarkComparison} (17% better)</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-700">
              <div className="flex items-center gap-1 mb-2">
                <Settings className="h-3 w-3" />
                <span className="text-xs font-medium text-blue-200">Category Analysis</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-300">Supervision:</span>
                  <span className="text-green-300">{formatCurrency(Math.abs(data.drillDown.categories.supervision.variance))} saved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Equipment:</span>
                  <span className="text-green-300">{formatCurrency(Math.abs(data.drillDown.categories.equipment.variance))} saved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Temporary:</span>
                  <span className="text-green-300">{formatCurrency(Math.abs(data.drillDown.categories.temporary.variance))} saved</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-700">
              <div className="text-xs font-medium text-blue-200 mb-2">Key Efficiency Gains</div>
              <div className="space-y-1">
                {data.drillDown.efficiencyGains.map((gain, index) => (
                  <div key={index} className="text-xs flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                    <span>{gain}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 