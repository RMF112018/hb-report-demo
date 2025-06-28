"use client";

import { AreaChart } from "@/components/charts/AreaChart";
import { TrendingUp, DollarSign, CalendarCheck, BarChart3, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { CustomBarChart } from "@/components/charts/BarChart";

// Props: pass in all relevant data already filtered for stage 4 projects and month 2024-12
export function FinancialReviewPanel({
  forecastIndex,
  budgetHealth,
  cashflowData,
  scheduleHealth,
  cashflowChartData,
  cashflowMetrics,
  scheduleMetrics,
}: {
  forecastIndex: number;
  budgetHealth: number;
  cashflowData: any;
  scheduleHealth: number;
  cashflowChartData: { name: string; value: number }[];
  cashflowMetrics: { label: string; value: string | number }[];
  scheduleMetrics: { label: string; value: string | number }[];
}) {
  // Determine trends (mock logic)
  const trends = {
    forecast: forecastIndex > 8.5 ? ArrowUpRight : forecastIndex < 7.5 ? ArrowDownRight : Minus,
    budget: budgetHealth > 8.0 ? ArrowUpRight : budgetHealth < 7.0 ? ArrowDownRight : Minus,
    schedule: scheduleHealth > 9.0 ? ArrowUpRight : scheduleHealth < 8.0 ? ArrowDownRight : Minus,
  };

  const trendColors = {
    forecast: forecastIndex > 8.5 ? "text-green-600 dark:text-green-400" : forecastIndex < 7.5 ? "text-red-600 dark:text-red-400" : "text-muted-foreground",
    budget: budgetHealth > 8.0 ? "text-green-600 dark:text-green-400" : budgetHealth < 7.0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground",
    schedule: scheduleHealth > 9.0 ? "text-green-600 dark:text-green-400" : scheduleHealth < 8.0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground",
  };

  // Create simplified chart data for schedule
  const scheduleChartData = [
    { name: 'Jan', value: 85 },
    { name: 'Feb', value: 88 },
    { name: 'Mar', value: 82 },
    { name: 'Apr', value: 89 },
    { name: 'May', value: 91 },
    { name: 'Jun', value: scheduleHealth * 10 },
  ];

  return (
    <div className="h-full w-full flex flex-col bg-card overflow-hidden">
      {/* Key Metrics Row */}
      <div className="p-4">
        <div className="grid grid-cols-4 gap-3">
          {/* Forecast Index */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-700">Forecast</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-bold text-blue-900">{forecastIndex.toFixed(1)}</span>
              <trends.forecast className={`h-3 w-3 ${trendColors.forecast}`} />
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400">Index</span>
          </div>

          {/* Budget Health */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700">Budget</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-bold text-green-900">{budgetHealth.toFixed(1)}</span>
              <trends.budget className={`h-3 w-3 ${trendColors.budget}`} />
            </div>
            <span className="text-xs text-green-600 dark:text-green-400">Health</span>
          </div>

          {/* Schedule Health */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/40 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CalendarCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-medium text-indigo-700">Schedule</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-bold text-indigo-900">{scheduleHealth.toFixed(1)}</span>
              <trends.schedule className={`h-3 w-3 ${trendColors.schedule}`} />
            </div>
            <span className="text-xs text-indigo-600 dark:text-indigo-400">Score</span>
          </div>

          {/* Net Cash Flow */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">Cash Flow</span>
            </div>
            <div className="text-lg font-bold text-purple-900">
              {cashflowMetrics[0]?.value || '$0'}
            </div>
            <span className="text-xs text-purple-600">Net</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex-1 px-4 pb-4 min-h-0">
        <div className="grid grid-cols-2 gap-4 h-full">
          {/* Cashflow Trend */}
          <div className="bg-muted/50 rounded-lg p-3 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-sm text-foreground">Cash Flow Trend</span>
            </div>
            <div className="flex-1 min-h-20">
              <AreaChart data={cashflowChartData} color="hsl(var(--chart-2))" compact />
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {cashflowMetrics.slice(1, 3).map((metric, i) => (
                <div key={i} className="px-2 py-1 bg-blue-100 rounded text-xs text-blue-800">
                  <span className="font-semibold">{metric.value}</span> {metric.label}
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Performance */}
          <div className="bg-muted/50 rounded-lg p-3 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <CalendarCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-medium text-sm text-foreground">Schedule Performance</span>
            </div>
            <div className="flex-1 min-h-20">
              <AreaChart data={scheduleChartData} color="hsl(var(--chart-1))" compact />
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {scheduleMetrics.slice(0, 2).map((metric, i) => (
                <div key={i} className="px-2 py-1 bg-indigo-100 rounded text-xs text-indigo-800">
                  <span className="font-semibold">{metric.value}</span> {metric.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 