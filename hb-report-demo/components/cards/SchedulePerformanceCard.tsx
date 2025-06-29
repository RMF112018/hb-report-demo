"use client";

import { useState } from "react";
import { Calendar, Clock, AlertTriangle, CheckCircle, TrendingDown, ChevronRight, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SchedulePerformanceCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function SchedulePerformanceCard({ config, span, isCompact, userRole }: SchedulePerformanceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          projectsAhead: 0,
          projectsOnTime: 1,
          projectsBehind: 0,
          avgVarianceDays: -3, // negative means ahead
          totalDamagesRealized: 0,
          totalDamagesForecasted: 0,
          criticalProjects: 0,
          scheduleHealthScore: 85,
          drillDown: {
            criticalPath: ["MEP Rough-in", "Exterior Finishing", "Final Inspections"],
            weatherDelays: 1,
            permitDelays: 0,
            materialDelays: 1,
            topPerformer: "Tropical World Nursery",
            worstPerformer: "N/A",
            avgRecoveryTime: 5, // days
            milestoneHits: 92 // percentage
          }
        };
      case 'project-executive':
        // Limited to 7 projects
        return {
          projectsAhead: 3,
          projectsOnTime: 2,
          projectsBehind: 2,
          avgVarianceDays: -8, // negative means ahead
          totalDamagesRealized: 0,
          totalDamagesForecasted: 75000,
          criticalProjects: 1,
          scheduleHealthScore: 81,
          drillDown: {
            criticalPath: ["Foundation Pour", "Steel Erection", "MEP Rough-in"],
            weatherDelays: 2,
            permitDelays: 1,
            materialDelays: 1,
            topPerformer: "Riverside Plaza",
            worstPerformer: "Tech Campus Phase 2",
            avgRecoveryTime: 7, // days
            milestoneHits: 88 // percentage
          }
        };
      default:
        // Executive - all projects
        return {
          projectsAhead: 5,
          projectsOnTime: 2,
          projectsBehind: 3,
          avgVarianceDays: -12, // negative means ahead
          totalDamagesRealized: 0,
          totalDamagesForecasted: 125000,
          criticalProjects: 2,
          scheduleHealthScore: 78,
          drillDown: {
            criticalPath: ["Foundation Pour", "Steel Erection", "MEP Rough-in"],
            weatherDelays: 3,
            permitDelays: 1,
            materialDelays: 2,
            topPerformer: "Riverside Plaza",
            worstPerformer: "Tech Campus Phase 2",
            avgRecoveryTime: 8, // days
            milestoneHits: 85 // percentage
          }
        };
    }
  };

  const data = getDataByRole();

  const getVarianceColor = (days: number) => {
    if (days <= -7) return "text-green-600 dark:text-green-400";
    if (days <= 7) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getVarianceBadge = (days: number) => {
    if (days <= -7) return "bg-green-100 text-green-700";
    if (days <= 7) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-orange-200">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-green-700">{data.projectsAhead}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Ahead</div>
          </div>
          <div className="text-center">
            <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-yellow-700">{data.projectsOnTime}</div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">On Time</div>
          </div>
          <div className="text-center">
            <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-red-700">{data.projectsBehind}</div>
            <div className="text-xs text-red-600 dark:text-red-400">Behind</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 space-y-4 overflow-y-auto">
        {/* Schedule Health Score */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-foreground">Schedule Health</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Overall Score</span>
              <Badge className={getVarianceBadge(data.avgVarianceDays)}>{data.scheduleHealthScore}%</Badge>
            </div>
            <Progress value={data.scheduleHealthScore} className="h-2" />
          </div>
        </div>

        {/* Average Variance */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-foreground">Avg Variance</span>
          </div>
          <div className="flex items-center justify-between">
            <div className={`text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium ${getVarianceColor(data.avgVarianceDays)}`}>
              {Math.abs(data.avgVarianceDays)} Days
            </div>
            <Badge className={getVarianceBadge(data.avgVarianceDays)}>
              {data.avgVarianceDays < 0 ? 'Ahead' : data.avgVarianceDays > 0 ? 'Behind' : 'On Time'}
            </Badge>
          </div>
        </div>

        {/* Damages */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-foreground">Damages</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Realized</span>
              <span className="font-medium">${data.totalDamagesRealized.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Forecasted</span>
              <span className="font-medium text-red-600 dark:text-red-400">${data.totalDamagesForecasted.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Critical Projects */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-foreground">Critical Projects</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-red-700">{data.criticalProjects}</span>
            <Badge variant="destructive" className="text-xs">Needs Attention</Badge>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-orange-900/95 backdrop-blur-sm p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 flex flex-col justify-center text-white animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2">
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-sm">Schedule Deep Analysis</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-orange-200">Best Performer:</span>
                <span className="font-medium text-green-300">{data.drillDown.topPerformer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-200">Needs Attention:</span>
                <span className="font-medium text-red-300">{data.drillDown.worstPerformer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-200">Milestone Hit Rate:</span>
                <span className="font-medium">{data.drillDown.milestoneHits}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-200">Avg Recovery Time:</span>
                <span className="font-medium">{data.drillDown.avgRecoveryTime} days</span>
              </div>
            </div>

            <div className="mt-1.5 sm:mt-2 lg:mt-1 sm:mt-1.5 lg:mt-2 pt-3 border-t border-orange-700">
              <div className="flex items-center gap-1 mb-2">
                <Activity className="h-3 w-3" />
                <span className="text-xs font-medium text-orange-200">Delay Analysis</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-bold">{data.drillDown.weatherDelays}</div>
                  <div className="text-orange-300">Weather</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{data.drillDown.permitDelays}</div>
                  <div className="text-orange-300">Permits</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{data.drillDown.materialDelays}</div>
                  <div className="text-orange-300">Materials</div>
                </div>
              </div>
            </div>

            <div className="mt-1.5 sm:mt-2 lg:mt-1 sm:mt-1.5 lg:mt-2 pt-3 border-t border-orange-700">
              <div className="text-xs font-medium text-orange-200 mb-2">Critical Path Activities</div>
              <div className="space-y-1">
                {data.drillDown.criticalPath.map((activity, index) => (
                  <div key={index} className="text-xs flex items-center gap-2">
                    <div className="w-1 h-1 bg-orange-300 rounded-full"></div>
                    <span>{activity}</span>
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