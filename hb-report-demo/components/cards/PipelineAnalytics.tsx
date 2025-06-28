"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign, 
  Building2, 
  Home,
  MapPin,
  Clock,
  Trophy,
  X
} from "lucide-react";
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

// Import the pipeline data
import pipelineData from "@/data/mock/precon/pipeline.json";

interface PipelineAnalyticsProps {
  config?: any;
  span?: { cols: number; rows: number };
  isCompact?: boolean;
}

const COLORS = {
  primary: "hsl(var(--chart-2))",
  secondary: "hsl(var(--chart-5))",
  success: "hsl(var(--chart-1))",
  warning: "hsl(var(--chart-3))",
  danger: "hsl(var(--chart-4))",
  residential: "#06b6d4",
  commercial: "hsl(var(--chart-5))"
};

const STAGE_COLORS = ["hsl(var(--chart-4))", "hsl(var(--chart-3))", "hsl(var(--chart-2))", "hsl(var(--chart-1))"];

export function PipelineAnalytics({ config = {}, span, isCompact = false }: PipelineAnalyticsProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const analytics = useMemo(() => {
    // Aggregate all pipeline data
    const totalValue = pipelineData.reduce((sum, project) => sum + project.config.pipelineValue, 0);
    const totalWeightedValue = pipelineData.reduce((sum, project) => sum + project.config.probabilityWeighted, 0);
    
    // Stage aggregation
    const stageData = pipelineData.reduce((acc, project) => {
      project.config.stages.forEach(stage => {
        if (!acc[stage.stage]) {
          acc[stage.stage] = { count: 0, value: 0, name: stage.stage };
        }
        acc[stage.stage].count += stage.count;
        acc[stage.stage].value += stage.value;
      });
      return acc;
    }, {} as Record<string, any>);
    
    const funnelData = Object.values(stageData).map((stage: any, index) => ({
      ...stage,
      fill: STAGE_COLORS[index]
    }));
    
    // Division breakdown
    const divisionData = pipelineData.reduce((acc, project) => {
      if (!acc[project.division]) {
        acc[project.division] = { count: 0, value: 0, weightedValue: 0 };
      }
      acc[project.division].count += 1;
      acc[project.division].value += project.config.pipelineValue;
      acc[project.division].weightedValue += project.config.probabilityWeighted;
      return acc;
    }, {} as Record<string, any>);
    
    const divisionChartData = Object.entries(divisionData).map(([division, data]: [string, any]) => ({
      name: division,
      value: data.value,
      weightedValue: data.weightedValue,
      count: data.count,
      fill: division === "Residential" ? COLORS.residential : COLORS.commercial
    }));
    
    // Recent wins and losses
    const allWins = pipelineData.flatMap(project => project.config.recentWins);
    const allLosses = pipelineData.flatMap(project => project.config.recentLosses);
    
    const totalWins = allWins.reduce((sum, win) => sum + win.value, 0);
    const totalLosses = allLosses.reduce((sum, loss) => sum + loss.value, 0);
    const winRate = totalWins / (totalWins + totalLosses) * 100;
    
    // Size distribution
    const sizeData = pipelineData.reduce((acc, project) => {
      if (!acc[project.size]) {
        acc[project.size] = { count: 0, value: 0 };
      }
      acc[project.size].count += 1;
      acc[project.size].value += project.config.pipelineValue;
      return acc;
    }, {} as Record<string, any>);
    
    return {
      totalValue,
      totalWeightedValue,
      conversionRate: (totalWeightedValue / totalValue) * 100,
      projectCount: pipelineData.length,
      funnelData,
      divisionChartData,
      winRate,
      totalWins,
      totalLosses,
      recentWins: allWins.slice(0, 3),
      recentLosses: allLosses.slice(0, 3),
      sizeData
    };
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div 
      className="relative h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Pipeline</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(analytics.totalValue)}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Weighted Value</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(analytics.totalWeightedValue)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Win Rate</p>
                  <p className="text-2xl font-bold text-purple-900">{analytics.winRate.toFixed(1)}%</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/40 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Active Projects</p>
                  <p className="text-2xl font-bold text-orange-900">{analytics.projectCount}</p>
                </div>
                <Building2 className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pipeline Funnel */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Pipeline Stages
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          name === 'value' ? formatCurrency(value) : value,
                          name === 'value' ? 'Value' : 'Count'
                        ]}
                      />
                      <Funnel
                        dataKey="value"
                        data={analytics.funnelData}
                        isAnimationActive
                      >
                        <LabelList position="center" fill="hsl(var(--background))" stroke="none" fontSize={12} />
                        {analytics.funnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Division Breakdown */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  Division Analysis
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.divisionChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Bar dataKey="value" name="Total Value" opacity={0.8} />
                      <Bar dataKey="weightedValue" name="Weighted Value" opacity={0.6} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Win/Loss Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Wins */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Recent Wins
                </h3>
                <div className="space-y-3">
                  {analytics.recentWins.map((win, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{win.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {win.division}
                        </Badge>
                      </div>
                      <p className="font-semibold text-green-700">{formatCurrency(win.value)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Losses */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  Recent Losses
                </h3>
                <div className="space-y-3">
                  {analytics.recentLosses.map((loss, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{loss.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {loss.division}
                        </Badge>
                      </div>
                      <p className="font-semibold text-red-700">{formatCurrency(loss.value)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Rate Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Pipeline Conversion Rate
                </h3>
                <Badge variant="outline" className="text-sm">
                  {analytics.conversionRate.toFixed(1)}%
                </Badge>
              </div>
              <Progress value={analytics.conversionRate} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Total Pipeline: {formatCurrency(analytics.totalValue)}</span>
                <span>Weighted Value: {formatCurrency(analytics.totalWeightedValue)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-orange-900/95 backdrop-blur-sm rounded-lg p-6 text-white transition-all duration-300 ease-in-out overflow-y-auto">
          <div className="h-full">
            <h3 className="text-xl font-bold mb-4 text-center">Pipeline Deep Analysis</h3>
            
            <div className="grid grid-cols-2 gap-6 h-[calc(100%-60px)]">
              {/* Pipeline Health */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Pipeline Health Metrics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Conversion Efficiency:</span>
                      <span className="font-medium text-green-400">{analytics.conversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Deal Size:</span>
                      <span className="font-medium">{formatCurrency(analytics.totalValue / analytics.projectCount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stage Velocity:</span>
                      <span className="font-medium text-yellow-400">18 days avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quality Score:</span>
                      <span className="font-medium text-green-400">87/100</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    Win/Loss Analysis
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Wins:</span>
                      <span className="font-medium text-green-400">{formatCurrency(analytics.totalWins)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Losses:</span>
                      <span className="font-medium text-red-400">{formatCurrency(analytics.totalLosses)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win Rate:</span>
                      <span className="font-medium text-green-400">{analytics.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Competitive Wins:</span>
                      <span className="font-medium text-blue-400">73%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Analysis */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    Market Positioning
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="border-b border-white/20 dark:border-black/20 pb-2">
                      <div className="flex justify-between">
                        <span>Commercial Sector:</span>
                        <span className="font-medium">{analytics.divisionChartData.find(d => d.name === 'Commercial')?.count || 0} projects</span>
                      </div>
                      <div className="text-xs text-orange-200">
                        {formatCurrency(analytics.divisionChartData.find(d => d.name === 'Commercial')?.value || 0)} total value
                      </div>
                    </div>
                    <div className="border-b border-white/20 dark:border-black/20 pb-2">
                      <div className="flex justify-between">
                        <span>Residential Sector:</span>
                        <span className="font-medium">{analytics.divisionChartData.find(d => d.name === 'Residential')?.count || 0} projects</span>
                      </div>
                      <div className="text-xs text-orange-200">
                        {formatCurrency(analytics.divisionChartData.find(d => d.name === 'Residential')?.value || 0)} total value
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-orange-200">
                        <span>Pipeline Strength:</span>
                        <span className="font-medium">Strong</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Time-to-Close Analysis
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Avg Sales Cycle:</span>
                      <span className="font-medium">45 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fastest Close:</span>
                      <span className="font-medium text-green-400">12 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Longest Active:</span>
                      <span className="font-medium text-yellow-400">89 days</span>
                    </div>
                    <div className="pt-2 border-t border-white/20 dark:border-black/20">
                      <p className="text-xs text-orange-200">
                        Pipeline velocity has improved 15% over last quarter.
                        Focus on proposal stage optimization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PipelineAnalytics; 