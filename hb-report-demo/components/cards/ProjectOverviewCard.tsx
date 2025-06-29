"use client";

import { useState } from "react";
import { Building2, Calendar, DollarSign, TrendingUp, ChevronRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectOverviewCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function ProjectOverviewCard({ config, span, isCompact, userRole }: ProjectOverviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          totalProjects: 1,
          activeProjects: 1,
          completedThisMonth: 0,
          totalContractValue: 57235491,
          avgProjectSize: 57235491,
          projectTypes: {
            newConstruction: 1,
            renovation: 0,
            expansion: 0
          },
          drillDown: {
            largestProject: { name: "Tropical World Nursery", value: 57235491 },
            riskProjects: 0,
            upcomingMilestones: 3,
            regionBreakdown: { north: 0, central: 1, spaceCoast: 0, southeast: 0, southwest: 0 },
            avgDuration: 24, // months
            onTimePct: 85
          }
        };
      case 'project-executive':
        // Limited to 7 projects
        return {
          totalProjects: 7,
          activeProjects: 5,
          completedThisMonth: 1,
          totalContractValue: 285480000,
          avgProjectSize: 40782857,
          projectTypes: {
            newConstruction: 4,
            renovation: 2,
            expansion: 1
          },
          drillDown: {
            largestProject: { name: "Tropical World Nursery", value: 57235491 },
            riskProjects: 1,
            upcomingMilestones: 4,
            regionBreakdown: { north: 2, central: 2, spaceCoast: 1, southeast: 1, southwest: 1 },
            avgDuration: 20, // months
            onTimePct: 78
          }
        };
      default:
        // Executive - all projects
        return {
          totalProjects: 12,
          activeProjects: 8,
          completedThisMonth: 2,
          totalContractValue: 485280000,
          avgProjectSize: 40440000,
          projectTypes: {
            newConstruction: 7,
            renovation: 3,
            expansion: 2
          },
          drillDown: {
            largestProject: { name: "Tropical World Nursery", value: 57235491 },
            riskProjects: 2,
            upcomingMilestones: 5,
            regionBreakdown: { north: 3, central: 4, spaceCoast: 2, southeast: 2, southwest: 1 },
            avgDuration: 18, // months
            onTimePct: 75
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

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 overflow-hidden relative transition-all duration-300 backdrop-blur-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Header Stats with better hierarchy */}
      <div className="flex-shrink-0 p-3 sm:p-4 lg:p-5 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-blue-200/60 dark:border-blue-800/60 shadow-sm">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="text-center p-2 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/40 dark:border-blue-800/40">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-700 dark:text-blue-400">{data.totalProjects}</div>
            <div className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-300 mt-1">Total Projects</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-green-50/80 dark:bg-green-950/40 border border-green-200/40 dark:border-green-800/40">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-700 dark:text-green-400">{data.activeProjects}</div>
            <div className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-300 mt-1">Active</div>
          </div>
        </div>
      </div>

      {/* Enhanced Content with better spacing */}
      <div className="flex-1 p-3 sm:p-4 lg:p-5 space-y-3 sm:space-y-4 lg:space-y-5 overflow-y-auto">
        {/* Contract Value Summary with enhanced styling */}
        <div className="bg-white/80 dark:bg-black/80 rounded-xl p-3 sm:p-4 border border-blue-200/60 dark:border-blue-800/60 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-foreground">Portfolio Value</span>
          </div>
          <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-foreground">
            {formatCurrency(data.totalContractValue)}
          </div>
          <div className="text-xs text-muted-foreground">
            Avg: {formatCurrency(data.avgProjectSize)}
          </div>
        </div>

        {/* Project Types */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-foreground">Project Types</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">New Construction</span>
              <Badge variant="outline" className="text-xs">{data.projectTypes.newConstruction}</Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Renovation</span>
              <Badge variant="outline" className="text-xs">{data.projectTypes.renovation}</Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Expansion</span>
              <Badge variant="outline" className="text-xs">{data.projectTypes.expansion}</Badge>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-foreground">This Month</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span className="text-sm text-foreground">{data.completedThisMonth} Completed</span>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-blue-900/95 backdrop-blur-sm p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 flex flex-col justify-center text-white animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2">
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-sm">Portfolio Deep Dive</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-blue-200">Largest Project:</span>
                <span className="font-medium">{data.drillDown.largestProject.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Value:</span>
                <span className="font-medium">{formatCurrency(data.drillDown.largestProject.value)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Risk Projects:</span>
                <span className="font-medium text-yellow-300">{data.drillDown.riskProjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Upcoming Milestones:</span>
                <span className="font-medium">{data.drillDown.upcomingMilestones}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Avg Duration:</span>
                <span className="font-medium">{data.drillDown.avgDuration} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">On-Time Performance:</span>
                <span className="font-medium text-green-300">{data.drillDown.onTimePct}%</span>
              </div>
            </div>

            <div className="mt-1.5 sm:mt-2 lg:mt-1 sm:mt-1.5 lg:mt-2 pt-3 border-t border-blue-700">
              <div className="flex items-center gap-1 mb-2">
                <MapPin className="h-3 w-3" />
                <span className="text-xs font-medium text-blue-200">Regional Distribution</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="text-center">
                  <div className="font-bold">{data.drillDown.regionBreakdown.north}</div>
                  <div className="text-blue-300">North FL</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{data.drillDown.regionBreakdown.central}</div>
                  <div className="text-blue-300">Central FL</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{data.drillDown.regionBreakdown.spaceCoast}</div>
                  <div className="text-blue-300">Space Coast</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{data.drillDown.regionBreakdown.southeast}</div>
                  <div className="text-blue-300">Southeast FL</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{data.drillDown.regionBreakdown.southwest}</div>
                  <div className="text-blue-300">Southwest FL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 