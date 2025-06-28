"use client";

import { useState } from "react";
import { Package, TrendingDown, ChevronRight, Clock, DollarSign, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProcurementCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function ProcurementCard({ config, span, isCompact, userRole }: ProcurementCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          totalContracts: 28,
          contractsExecuted: 18,
          totalContractValue: 57235491,
          pendingValue: 12850000,
          veSavings: 185000,
          allowanceVariance: -45000, // savings
          longLeadItems: 8,
          longLeadOnTime: 6,
          executionRate: 64.3,
          avgLeadTime: 89,
          drillDown: {
            largestContract: { title: "CONVENTIONAL FRAMING", amount: 6819886.91 },
            criticalItems: ["MEP Rough-in", "Steel Delivery"],
            veApproved: 3,
            vePending: 2,
            allowancesReconciled: 5,
            procurementTrend: "On Track"
          }
        };
      case 'project-executive':
        // Limited to 7 projects
        return {
          totalContracts: 142,
          contractsExecuted: 89,
          totalContractValue: 285480000,
          pendingValue: 42800000,
          veSavings: 850000,
          allowanceVariance: -185000, // savings
          longLeadItems: 34,
          longLeadOnTime: 28,
          executionRate: 62.7,
          avgLeadTime: 95,
          drillDown: {
            largestContract: { title: "MEP SYSTEMS", amount: 28500000 },
            criticalItems: ["Steel Delivery", "Glazing Systems", "MEP Equipment"],
            veApproved: 12,
            vePending: 8,
            allowancesReconciled: 28,
            procurementTrend: "Accelerating"
          }
        };
      default:
        // Executive - all projects
        return {
          totalContracts: 285,
          contractsExecuted: 178,
          totalContractValue: 485280000,
          pendingValue: 82500000,
          veSavings: 1425000,
          allowanceVariance: -285000, // savings
          longLeadItems: 68,
          longLeadOnTime: 52,
          executionRate: 62.5,
          avgLeadTime: 98,
          drillDown: {
            largestContract: { title: "STRUCTURAL STEEL", amount: 48500000 },
            criticalItems: ["Steel Delivery", "Glazing Systems", "MEP Equipment", "Elevators"],
            veApproved: 24,
            vePending: 15,
            allowancesReconciled: 58,
            procurementTrend: "Strong Pipeline"
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

  const getVarianceColor = (variance: number) => {
    return variance < 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  };

  const getLeadTimeColor = (onTime: number, total: number) => {
    const percentage = (onTime / total) * 100;
    if (percentage >= 85) return "text-green-600 dark:text-green-400";
    if (percentage >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-amber-200 dark:border-amber-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-amber-700">{data.contractsExecuted}/{data.totalContracts}</div>
            <div className="text-xs text-amber-600 dark:text-amber-400">Executed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-700">{formatPercentage(data.executionRate)}</div>
            <div className="text-xs text-orange-600">Rate</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Contract Value */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-foreground">Contract Value</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{formatCurrency(data.totalContractValue)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-medium text-amber-600 dark:text-amber-400">{formatCurrency(data.pendingValue)}</span>
            </div>
          </div>
        </div>

        {/* Value Engineering */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-foreground">Value Engineering</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-green-700">
              {formatCurrency(data.veSavings)}
            </div>
            <Badge className="bg-green-100 text-green-700 text-xs">
              Savings
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {data.drillDown.veApproved} approved, {data.drillDown.vePending} pending
          </div>
        </div>

        {/* Allowance Management */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-foreground">Allowances</span>
          </div>
          <div className="flex items-center justify-between">
            <div className={`text-lg font-bold ${getVarianceColor(data.allowanceVariance)}`}>
              {formatCurrency(Math.abs(data.allowanceVariance))}
            </div>
            <Badge className={data.allowanceVariance < 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
              {data.allowanceVariance < 0 ? 'Under' : 'Over'}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {data.drillDown.allowancesReconciled} reconciled items
          </div>
        </div>

        {/* Long Lead Items */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-foreground">Long Lead Items</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">On Schedule</span>
              <span className={`text-sm font-bold ${getLeadTimeColor(data.longLeadOnTime, data.longLeadItems)}`}>
                {data.longLeadOnTime}/{data.longLeadItems}
              </span>
            </div>
            <Progress value={(data.longLeadOnTime / data.longLeadItems) * 100} className="h-2" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avg Lead Time</span>
              <span className="font-medium">{data.avgLeadTime} days</span>
            </div>
          </div>
        </div>

        {/* Execution Progress */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-foreground">Execution Progress</span>
          </div>
          <div className="space-y-2">
            <Progress value={data.executionRate} className="h-2" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Completion Rate</span>
              <Badge className="bg-amber-100 text-amber-700">{formatPercentage(data.executionRate)}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-amber-900/95 backdrop-blur-sm p-4 flex flex-col justify-center text-white animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-sm">Procurement Analysis</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-amber-200">Largest Contract:</span>
                <span className="font-medium text-amber-300">{data.drillDown.largestContract.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200">Value:</span>
                <span className="font-medium">{formatCurrency(data.drillDown.largestContract.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200">VE Savings:</span>
                <span className="font-medium text-green-300">{formatCurrency(data.veSavings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200">Trend:</span>
                <span className="font-medium text-green-300">{data.drillDown.procurementTrend}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-700">
              <div className="flex items-center gap-1 mb-2">
                <AlertTriangle className="h-3 w-3" />
                <span className="text-xs font-medium text-amber-200">Critical Items</span>
              </div>
              <div className="space-y-1">
                {data.drillDown.criticalItems.map((item, index) => (
                  <div key={index} className="text-xs flex items-center gap-2">
                    <div className="w-1 h-1 bg-amber-300 rounded-full"></div>
                    <span>{item}</span>
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