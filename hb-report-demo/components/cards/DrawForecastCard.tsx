"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, ChevronRight, Calendar, Target, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface DrawForecastCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function DrawForecastCard({ config, span, isCompact, userRole }: DrawForecastCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          currentMonthForecast: 2850000,
          actualAmount: 2650000,
          variance: -200000, // under forecast
          forecastAccuracy: 93.0,
          nextMonthForecast: 3200000,
          totalYearForecast: 28500000,
          actualYTD: 24800000,
          forecastMethods: { manual: 35, bellCurve: 45, linear: 20 },
          drillDown: {
            largestVariance: { category: "General Conditions", amount: -150000 },
            bestAccuracy: { category: "MEP", accuracy: 97.5 },
            forecastTrend: "Stable",
            methodPerformance: "Bell Curve leading",
            upcomingDraw: 3200000
          }
        };
      case 'project-executive':
        // Limited to 7 projects
        return {
          currentMonthForecast: 15800000,
          actualAmount: 14500000,
          variance: -1300000, // under forecast
          forecastAccuracy: 91.8,
          nextMonthForecast: 17200000,
          totalYearForecast: 185000000,
          actualYTD: 168000000,
          forecastMethods: { manual: 40, bellCurve: 35, linear: 25 },
          drillDown: {
            largestVariance: { category: "Structural Steel", amount: -850000 },
            bestAccuracy: { category: "Electrical", accuracy: 95.2 },
            forecastTrend: "Improving",
            methodPerformance: "Manual leading",
            upcomingDraw: 17200000
          }
        };
      default:
        // Executive - all projects
        return {
          currentMonthForecast: 28500000,
          actualAmount: 25800000,
          variance: -2700000, // under forecast
          forecastAccuracy: 90.5,
          nextMonthForecast: 31200000,
          totalYearForecast: 325000000,
          actualYTD: 295000000,
          forecastMethods: { manual: 42, bellCurve: 33, linear: 25 },
          drillDown: {
            largestVariance: { category: "MEP Systems", amount: -1500000 },
            bestAccuracy: { category: "Site Work", accuracy: 94.8 },
            forecastTrend: "Variable",
            methodPerformance: "Mixed results",
            upcomingDraw: 31200000
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

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return "text-green-600 dark:text-green-400";
    if (accuracy >= 90) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-indigo-200 dark:border-indigo-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-700">{formatCurrency(data.currentMonthForecast)}</div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400">Current Forecast</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${getAccuracyColor(data.forecastAccuracy)}`}>{formatPercentage(data.forecastAccuracy)}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Current Month Performance */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-foreground">Current Month</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Forecasted</span>
              <span className="font-medium">{formatCurrency(data.currentMonthForecast)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Actual</span>
              <span className="font-medium">{formatCurrency(data.actualAmount)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Variance</span>
              <span className={`font-medium ${getVarianceColor(data.variance)}`}>
                {formatCurrency(data.variance)}
              </span>
            </div>
          </div>
        </div>

        {/* Next Month Forecast */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-foreground">Next Month</span>
          </div>
          <div className="text-lg font-bold text-blue-700">
            {formatCurrency(data.nextMonthForecast)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Projected draw amount
          </div>
        </div>

        {/* Year to Date */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-foreground">Year to Date</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Forecasted</span>
              <span className="font-medium">{formatCurrency(data.totalYearForecast)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Actual</span>
              <span className="font-medium">{formatCurrency(data.actualYTD)}</span>
            </div>
            <Progress value={(data.actualYTD / data.totalYearForecast) * 100} className="h-2" />
          </div>
        </div>

        {/* Forecast Methods */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-foreground">Forecast Methods</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Manual</span>
              <Badge variant="outline" className="text-xs">{data.forecastMethods.manual}%</Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Bell Curve</span>
              <Badge variant="outline" className="text-xs">{data.forecastMethods.bellCurve}%</Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Linear</span>
              <Badge variant="outline" className="text-xs">{data.forecastMethods.linear}%</Badge>
            </div>
          </div>
        </div>

        {/* Accuracy Score */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-foreground">Forecast Accuracy</span>
          </div>
          <div className="space-y-2">
            <Progress value={data.forecastAccuracy} className="h-2" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Overall Performance</span>
              <Badge className={`${getAccuracyColor(data.forecastAccuracy) === 'text-green-600 dark:text-green-400' ? 'bg-green-100 text-green-700' : 
                getAccuracyColor(data.forecastAccuracy) === 'text-yellow-600 dark:text-yellow-400' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {formatPercentage(data.forecastAccuracy)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-indigo-900/95 backdrop-blur-sm p-4 flex flex-col justify-center text-white animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-sm">Forecast Deep Dive</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-indigo-200">Best Category:</span>
                <span className="font-medium text-green-300">{data.drillDown.bestAccuracy.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-200">Accuracy:</span>
                <span className="font-medium">{formatPercentage(data.drillDown.bestAccuracy.accuracy)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-200">Largest Variance:</span>
                <span className="font-medium text-red-300">{data.drillDown.largestVariance.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-200">Amount:</span>
                <span className="font-medium">{formatCurrency(data.drillDown.largestVariance.amount)}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-700">
              <div className="text-xs font-medium text-indigo-200 mb-2">Performance Insights</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-indigo-300">Trend:</span>
                  <span className="font-medium">{data.drillDown.forecastTrend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-300">Method Performance:</span>
                  <span className="font-medium">{data.drillDown.methodPerformance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-300">Next Draw:</span>
                  <span className="font-medium text-blue-300">{formatCurrency(data.drillDown.upcomingDraw)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 