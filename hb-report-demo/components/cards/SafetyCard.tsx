"use client";

import { useState } from "react";
import { Shield, AlertTriangle, ChevronRight, Clock, Users, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SafetyCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function SafetyCard({ config, span, isCompact, userRole }: SafetyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          totalInspections: 45,
          openInspections: 8,
          closedInspections: 37,
          safetyScore: 91.2,
          atRiskItems: 3,
          incidentRate: 0.0,
          daysWithoutIncident: 124,
          tradeBreakdown: {
            concrete: 12,
            electrical: 8,
            flooring: 9,
            plumbing: 7,
            framing: 9
          },
          drillDown: {
            safestTrade: { name: "Concrete", score: 95.8 },
            riskiestTrade: { name: "Flooring", score: 86.3 },
            recentInspection: "Safety Audit - Electrical",
            lastIncident: "None",
            safetyTrend: "Excellent",
            upcomingAudits: 3
          }
        };
      case 'project-executive':
        // Limited to 7 projects
        return {
          totalInspections: 248,
          openInspections: 35,
          closedInspections: 213,
          safetyScore: 88.5,
          atRiskItems: 12,
          incidentRate: 0.8,
          daysWithoutIncident: 45,
          tradeBreakdown: {
            concrete: 52,
            electrical: 38,
            flooring: 42,
            plumbing: 35,
            framing: 38,
            steel: 28,
            hvac: 15
          },
          drillDown: {
            safestTrade: { name: "HVAC", score: 94.2 },
            riskiestTrade: { name: "Steel", score: 82.1 },
            recentInspection: "Safety Audit - Steel Work",
            lastIncident: "Minor - Hand injury",
            safetyTrend: "Good",
            upcomingAudits: 12
          }
        };
      default:
        // Executive - all projects
        return {
          totalInspections: 485,
          openInspections: 68,
          closedInspections: 417,
          safetyScore: 86.8,
          atRiskItems: 25,
          incidentRate: 1.2,
          daysWithoutIncident: 28,
          tradeBreakdown: {
            concrete: 85,
            electrical: 72,
            flooring: 68,
            plumbing: 58,
            framing: 62,
            steel: 48,
            hvac: 35,
            excavation: 28,
            roofing: 29
          },
          drillDown: {
            safestTrade: { name: "HVAC", score: 93.5 },
            riskiestTrade: { name: "Roofing", score: 79.8 },
            recentInspection: "Safety Audit - Roofing Work",
            lastIncident: "OSHA Recordable - Fall protection",
            safetyTrend: "Needs Improvement",
            upcomingAudits: 24
          }
        };
    }
  };

  const data = getDataByRole();

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getSafetyScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 85) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getIncidentRateColor = (rate: number) => {
    if (rate === 0) return "text-green-600 dark:text-green-400";
    if (rate <= 1.0) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getRiskLevelColor = (count: number) => {
    if (count <= 5) return "text-green-600 dark:text-green-400";
    if (count <= 15) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-red-200 dark:border-red-800">
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2">
          <div className="text-center">
            <div className={`text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium ${getSafetyScoreColor(data.safetyScore)}`}>{formatPercentage(data.safetyScore)}</div>
            <div className="text-xs text-red-600 dark:text-red-400">Safety Score</div>
          </div>
          <div className="text-center">
            <div className={`text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium ${getIncidentRateColor(data.incidentRate)}`}>{data.incidentRate}</div>
            <div className="text-xs text-orange-600">Incident Rate</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 space-y-4 overflow-y-auto">
        {/* Incident Tracking */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-foreground">Incident Tracking</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Days Without Incident</span>
              <span className={`font-medium ${data.daysWithoutIncident >= 90 ? 'text-green-600 dark:text-green-400' : data.daysWithoutIncident >= 30 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                {data.daysWithoutIncident}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Incident Rate</span>
              <Badge className={`${getIncidentRateColor(data.incidentRate) === 'text-green-600 dark:text-green-400' ? 'bg-green-100 text-green-700' : 
                getIncidentRateColor(data.incidentRate) === 'text-yellow-600 dark:text-yellow-400' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {data.incidentRate}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Safety Score */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-foreground">Safety Performance</span>
          </div>
          <div className="space-y-2">
            <Progress value={data.safetyScore} className="h-2" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Overall Score</span>
              <Badge className={`${getSafetyScoreColor(data.safetyScore) === 'text-green-600 dark:text-green-400' ? 'bg-green-100 text-green-700' : 
                getSafetyScoreColor(data.safetyScore) === 'text-yellow-600 dark:text-yellow-400' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {formatPercentage(data.safetyScore)}
              </Badge>
            </div>
          </div>
        </div>

        {/* At Risk Items */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-foreground">At Risk Items</span>
          </div>
          <div className="flex items-center justify-between">
            <div className={`text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium ${getRiskLevelColor(data.atRiskItems)}`}>
              {data.atRiskItems}
            </div>
            <Badge className={`${getRiskLevelColor(data.atRiskItems) === 'text-green-600 dark:text-green-400' ? 'bg-green-100 text-green-700' : 
              getRiskLevelColor(data.atRiskItems) === 'text-yellow-600 dark:text-yellow-400' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
              {data.atRiskItems <= 5 ? 'Low Risk' : data.atRiskItems <= 15 ? 'Medium Risk' : 'High Risk'}
            </Badge>
          </div>
        </div>

        {/* Inspection Status */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-foreground">Inspections</span>
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

        {/* Trade Safety Performance */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
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
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-red-900/95 backdrop-blur-sm p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 flex flex-col justify-center text-white animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2">
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-sm">Safety Analysis</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-red-200">Safest Trade:</span>
                <span className="font-medium text-green-300">{data.drillDown.safestTrade.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-200">Score:</span>
                <span className="font-medium">{formatPercentage(data.drillDown.safestTrade.score)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-200">Needs Focus:</span>
                <span className="font-medium text-red-300">{data.drillDown.riskiestTrade.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-200">Score:</span>
                <span className="font-medium">{formatPercentage(data.drillDown.riskiestTrade.score)}</span>
              </div>
            </div>

            <div className="mt-1.5 sm:mt-2 lg:mt-1 sm:mt-1.5 lg:mt-2 pt-3 border-t border-red-700">
              <div className="text-xs font-medium text-red-200 mb-2">Safety Status</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-red-300">Last Incident:</span>
                  <span className="font-medium">{data.drillDown.lastIncident}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-300">Trend:</span>
                  <span className="font-medium">{data.drillDown.safetyTrend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-300">Upcoming Audits:</span>
                  <span className="font-medium text-red-300">{data.drillDown.upcomingAudits} scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 