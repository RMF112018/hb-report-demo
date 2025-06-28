"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Percent, BarChart3, ChevronRight, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface FinancialStatusCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function FinancialStatusCard({ config, span, isCompact, userRole }: FinancialStatusCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          originalContractValue: 57235491,
          currentApprovedValue: 58100000,
          originalProfit: 3434129,
          currentProfit: 3950000,
          potentialTotalProfit: 4150000,
          profitMargin: 6.8,
          profitVariance: 515871, // profit increase
          contractVariance: 864509, // contract value increase
          profitHealthScore: 88,
          drillDown: {
            cashFlow: { positive: 1, negative: 0, neutral: 0 },
            billing: { outstanding: 2850000, overdue: 0, collected: 95.2 },
            changeOrders: { approved: 3, pending: 1, value: 864509 },
            topProfitProject: "Tropical World Nursery",
            riskProjects: [],
            workingCapital: 3200000,
            dso: 35 // days sales outstanding
          }
        };
      case 'project-executive':
        // Limited to 7 projects
        return {
          originalContractValue: 285480000,
          currentApprovedValue: 289920000,
          originalProfit: 17128800,
          currentProfit: 19750000,
          potentialTotalProfit: 20850000,
          profitMargin: 6.8,
          profitVariance: 2621200, // profit increase
          contractVariance: 4440000, // contract value increase
          profitHealthScore: 86,
          drillDown: {
            cashFlow: { positive: 5, negative: 1, neutral: 1 },
            billing: { outstanding: 8200000, overdue: 1200000, collected: 91.8 },
            changeOrders: { approved: 9, pending: 4, value: 4440000 },
            topProfitProject: "Medical Center East",
            riskProjects: ["Tech Campus Phase 2"],
            workingCapital: 12800000,
            dso: 38 // days sales outstanding
          }
        };
      default:
        // Executive - all projects
        return {
          originalContractValue: 485280000,
          currentApprovedValue: 492150000,
          originalProfit: 28654000,
          currentProfit: 31250000,
          potentialTotalProfit: 33150000,
          profitMargin: 6.4,
          profitVariance: 2596000, // profit increase
          contractVariance: 6870000, // contract value increase
          profitHealthScore: 85,
          drillDown: {
            cashFlow: { positive: 8, negative: 2, neutral: 2 },
            billing: { outstanding: 12500000, overdue: 2800000, collected: 89.5 },
            changeOrders: { approved: 15, pending: 7, value: 6870000 },
            topProfitProject: "Medical Center East",
            riskProjects: ["Tech Campus Phase 2", "Riverside Plaza"],
            workingCapital: 18500000,
            dso: 42 // days sales outstanding
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

  const getProfitChangeIcon = (variance: number) => {
    return variance >= 0 ? <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" /> : <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />;
  };

  const getProfitChangeColor = (variance: number) => {
    return variance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  };

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-green-200 dark:border-green-800">
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2">
          <div className="text-center">
            <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-green-700">{formatPercentage(data.profitMargin)}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Profit Margin</div>
          </div>
          <div className="text-center">
            <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-blue-700">{data.profitHealthScore}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Health Score</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 space-y-4 overflow-y-auto">
        {/* Contract Value */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-foreground">Contract Value</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Original</span>
              <span className="font-medium">{formatCurrency(data.originalContractValue)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Current</span>
              <span className="font-medium">{formatCurrency(data.currentApprovedValue)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Variance</span>
              <span className={`font-medium ${getProfitChangeColor(data.contractVariance)}`}>
                +{formatCurrency(data.contractVariance)}
              </span>
            </div>
          </div>
        </div>

        {/* Profit Analysis */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-foreground">Profit Analysis</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Original</span>
              <span className="font-medium">{formatCurrency(data.originalProfit)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Current</span>
              <span className="font-medium">{formatCurrency(data.currentProfit)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Potential</span>
              <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(data.potentialTotalProfit)}</span>
            </div>
          </div>
        </div>

        {/* Profit Variance */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-foreground">Profit Change</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {getProfitChangeIcon(data.profitVariance)}
              <span className={`text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium ${getProfitChangeColor(data.profitVariance)}`}>
                {formatCurrency(data.profitVariance)}
              </span>
            </div>
            <Badge className="bg-green-100 text-green-700 text-xs">
              +{formatPercentage((data.profitVariance / data.originalProfit) * 100)}
            </Badge>
          </div>
        </div>

        {/* Financial Health */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-foreground">Financial Health</span>
          </div>
          <div className="space-y-2">
            <Progress value={data.profitHealthScore} className="h-2" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Portfolio Score</span>
              <Badge className="bg-green-100 text-green-700">{data.profitHealthScore}%</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-green-900/95 backdrop-blur-sm p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 flex flex-col justify-center text-white animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2">
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-sm">Financial Deep Dive</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-green-200">Top Performer:</span>
                <span className="font-medium text-green-300">{data.drillDown.topProfitProject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-200">Working Capital:</span>
                <span className="font-medium">{formatCurrency(data.drillDown.workingCapital)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-200">Days Sales Outstanding:</span>
                <span className="font-medium">{data.drillDown.dso} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-200">Collection Rate:</span>
                <span className="font-medium text-green-300">{data.drillDown.billing.collected}%</span>
              </div>
            </div>

            <div className="mt-1.5 sm:mt-2 lg:mt-1 sm:mt-1.5 lg:mt-2 pt-3 border-t border-green-700">
              <div className="flex items-center gap-1 mb-2">
                <CreditCard className="h-3 w-3" />
                <span className="text-xs font-medium text-green-200">Cash Flow Status</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-bold text-green-300">{data.drillDown.cashFlow.positive}</div>
                  <div className="text-green-300">Positive</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-yellow-300">{data.drillDown.cashFlow.neutral}</div>
                  <div className="text-green-300">Neutral</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-red-300">{data.drillDown.cashFlow.negative}</div>
                  <div className="text-green-300">Negative</div>
                </div>
              </div>
            </div>

            <div className="mt-1.5 sm:mt-2 lg:mt-1 sm:mt-1.5 lg:mt-2 pt-3 border-t border-green-700">
              <div className="text-xs font-medium text-green-200 mb-2">Billing Analysis</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-green-300">Outstanding:</span>
                  <span>{formatCurrency(data.drillDown.billing.outstanding)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300">Overdue:</span>
                  <span className="text-red-300">{formatCurrency(data.drillDown.billing.overdue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300">Change Orders:</span>
                  <span>{data.drillDown.changeOrders.approved} approved, {data.drillDown.changeOrders.pending} pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 