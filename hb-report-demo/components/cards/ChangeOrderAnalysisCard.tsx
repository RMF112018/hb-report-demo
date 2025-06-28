"use client";

import { useState, useMemo } from "react";
import { FileText, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, DollarSign, Percent, ChevronRight, Calculator, Target, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ChangeOrderAnalysisCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function ChangeOrderAnalysisCard({ config, span, isCompact, userRole }: ChangeOrderAnalysisCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          totalChangeOrders: 8,
          approved: 5,
          pending: 2,
          rejected: 1,
          totalValue: 1250000,
          approvedValue: 875000,
          pendingValue: 325000,
          rejectedValue: 50000,
          contractValue: 57235491,
          changeOrderRatio: 2.18, // percentage of contract
          averageProcessingTime: 12, // days
          approvalRate: 87.5, // percentage
          impactScore: 85, // custom score
          riskLevel: "Low",
          drillDown: {
            byCategory: [
              { name: "Owner Requested", count: 3, value: 675000, avgDays: 8 },
              { name: "Design Changes", count: 2, value: 325000, avgDays: 15 },
              { name: "Field Conditions", count: 2, value: 200000, avgDays: 10 },
              { name: "Code Requirements", count: 1, value: 50000, avgDays: 20 }
            ],
            timeline: [
              { month: "Jan", submitted: 1, approved: 1, value: 125000 },
              { month: "Feb", submitted: 2, approved: 1, value: 275000 },
              { month: "Mar", submitted: 1, approved: 1, value: 150000 },
              { month: "Apr", submitted: 2, approved: 1, value: 425000 },
              { month: "May", submitted: 1, approved: 1, value: 200000 },
              { month: "Jun", submitted: 1, approved: 0, value: 75000 }
            ],
            projectDetails: {
              name: "Tropical World Nursery",
              phase: "Construction",
              completion: 85
            },
            topChangeOrder: {
              description: "HVAC System Upgrade",
              value: 325000,
              status: "Approved",
              reason: "Owner Requested"
            },
            risks: [
              "2 pending COs over 30 days",
              "Design coordination needed"
            ]
          }
        };
      case 'project-executive':
        // Limited to 6 projects
        return {
          totalChangeOrders: 42,
          approved: 28,
          pending: 10,
          rejected: 4,
          totalValue: 6800000,
          approvedValue: 4950000,
          pendingValue: 1650000,
          rejectedValue: 200000,
          contractValue: 285480000,
          changeOrderRatio: 2.38, // percentage of contract
          averageProcessingTime: 14, // days
          approvalRate: 80.9, // percentage
          impactScore: 78, // custom score
          riskLevel: "Medium",
          drillDown: {
            byCategory: [
              { name: "Owner Requested", count: 18, value: 3200000, avgDays: 12 },
              { name: "Design Changes", count: 12, value: 2100000, avgDays: 18 },
              { name: "Field Conditions", count: 8, value: 1200000, avgDays: 10 },
              { name: "Code Requirements", count: 4, value: 300000, avgDays: 25 }
            ],
            timeline: [
              { month: "Jan", submitted: 6, approved: 4, value: 850000 },
              { month: "Feb", submitted: 8, approved: 6, value: 1200000 },
              { month: "Mar", submitted: 7, approved: 5, value: 950000 },
              { month: "Apr", submitted: 9, approved: 7, value: 1650000 },
              { month: "May", submitted: 6, approved: 4, value: 1100000 },
              { month: "Jun", submitted: 6, approved: 2, value: 1050000 }
            ],
            projectPerformance: [
              { project: "Medical Center East", cos: 8, ratio: 3.2, status: "High" },
              { project: "Tech Campus Phase 2", cos: 12, ratio: 4.1, status: "High" },
              { project: "Marina Bay Plaza", cos: 6, ratio: 1.8, status: "Low" },
              { project: "Tropical World", cos: 8, ratio: 2.2, status: "Medium" },
              { project: "Grandview Heights", cos: 5, ratio: 1.5, status: "Low" },
              { project: "Riverside Plaza", cos: 3, ratio: 0.9, status: "Low" }
            ],
            topChangeOrder: {
              description: "Structural Steel Upgrade",
              value: 850000,
              status: "Approved",
              reason: "Design Changes",
              project: "Medical Center East"
            },
            risks: [
              "3 projects over 3% CO ratio",
              "12 pending COs over 30 days",
              "Design coordination backlog"
            ]
          }
        };
      default:
        // Executive - all projects view
        return {
          totalChangeOrders: 89,
          approved: 61,
          pending: 20,
          rejected: 8,
          totalValue: 14200000,
          approvedValue: 10350000,
          pendingValue: 3200000,
          rejectedValue: 650000,
          contractValue: 485280000,
          changeOrderRatio: 2.93, // percentage of contract
          averageProcessingTime: 16, // days
          approvalRate: 76.4, // percentage
          impactScore: 72, // custom score
          riskLevel: "Medium",
          drillDown: {
            byCategory: [
              { name: "Owner Requested", count: 38, value: 6800000, avgDays: 14 },
              { name: "Design Changes", count: 25, value: 4200000, avgDays: 20 },
              { name: "Field Conditions", count: 18, value: 2400000, avgDays: 12 },
              { name: "Code Requirements", count: 8, value: 800000, avgDays: 28 }
            ],
            timeline: [
              { month: "Jan", submitted: 12, approved: 8, value: 1800000 },
              { month: "Feb", submitted: 16, approved: 12, value: 2400000 },
              { month: "Mar", submitted: 14, approved: 10, value: 2100000 },
              { month: "Apr", submitted: 18, approved: 14, value: 3200000 },
              { month: "May", submitted: 15, approved: 10, value: 2500000 },
              { month: "Jun", submitted: 14, approved: 7, value: 2200000 }
            ],
            portfolioRisks: [
              "5 projects exceeding 3.5% CO ratio",
              "28 pending COs over 30 days",
              "Design team capacity constraint",
              "Owner approval delays"
            ],
            topPerformers: [
              { project: "Corporate Headquarters", ratio: 0.8 },
              { project: "Retail Complex West", ratio: 1.2 },
              { project: "Office Tower Downtown", ratio: 1.4 }
            ],
            riskProjects: [
              { project: "Medical Center East", ratio: 4.2 },
              { project: "Tech Campus Phase 2", ratio: 3.8 },
              { project: "Manufacturing Facility", ratio: 3.6 }
            ]
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

  const getGrade = (ratio: number) => {
    if (ratio <= 1.5) return "A+";
    if (ratio <= 2.0) return "A";
    if (ratio <= 2.5) return "B+";
    if (ratio <= 3.0) return "B";
    if (ratio <= 4.0) return "C";
    return "D";
  };

  const getGradeColor = (ratio: number) => {
    if (ratio <= 2.0) return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30";
    if (ratio <= 3.0) return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30";
    return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30";
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  // Chart data
  const statusData = [
    { name: "Approved", value: data.approved, color: "hsl(var(--chart-1))" },
    { name: "Pending", value: data.pending, color: "hsl(var(--chart-3))" },
    { name: "Rejected", value: data.rejected, color: "hsl(var(--chart-4))" },
  ];

  const valueData = [
    { name: "Approved", value: data.approvedValue, color: "hsl(var(--chart-1))" },
    { name: "Pending", value: data.pendingValue, color: "hsl(var(--chart-3))" },
    { name: "Rejected", value: data.rejectedValue, color: "hsl(var(--chart-4))" },
  ];

  const categoryData = data.drillDown.byCategory.map(cat => ({
    name: cat.name.split(' ')[0], // Shorten for display
    value: cat.value,
    count: cat.count
  }));

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-orange-200">
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2">
          <div className="text-center">
            <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-orange-700">{formatPercentage(data.changeOrderRatio)}</div>
            <div className="text-xs text-orange-600">CO Ratio</div>
          </div>
          <div className="text-center">
            <div className={`text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium ${getRiskColor(data.riskLevel)}`}>{data.impactScore}</div>
            <div className="text-xs text-muted-foreground">Impact Score</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 space-y-4 overflow-y-auto">
        {/* CO Status Overview */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-orange-200">
          <div className="flex items-center gap-2 mb-1 sm:mb-1.5 lg:mb-2">
            <FileText className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-foreground">Change Order Status</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2">
            <div className="w-20 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={15}
                    outerRadius={35}
                    dataKey="value"
                  >
                    {statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={statusData[index].color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-1 text-xs">
              <div className="text-center p-2 bg-green-50 dark:bg-green-950/30 rounded">
                <div className="font-bold text-green-600 dark:text-green-400">{data.approved}</div>
                <div className="text-muted-foreground">Approved</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded">
                <div className="font-bold text-yellow-600 dark:text-yellow-400">{data.pending}</div>
                <div className="text-muted-foreground">Pending</div>
              </div>
              <div className="text-center p-2 bg-red-50 dark:bg-red-950/30 rounded">
                <div className="font-bold text-red-600 dark:text-red-400">{data.rejected}</div>
                <div className="text-muted-foreground">Rejected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Impact */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-foreground">Financial Impact</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total Value</span>
              <span className="font-medium">{formatCurrency(data.totalValue)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Approved</span>
              <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(data.approvedValue)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-medium text-yellow-600 dark:text-yellow-400">{formatCurrency(data.pendingValue)}</span>
            </div>
            <div className="text-center mt-2">
              <div className={`inline-block px-1.5 sm:px-2 lg:px-2.5 py-1 rounded-lg ${getGradeColor(data.changeOrderRatio)}`}>
                <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium">{getGrade(data.changeOrderRatio)}</div>
                <div className="text-xs">Performance Grade</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-foreground">Performance</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Approval Rate</span>
              <span className="font-medium">{formatPercentage(data.approvalRate)}</span>
            </div>
            <Progress value={data.approvalRate} className="h-2" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avg Processing</span>
              <Badge variant="outline" className="text-xs">{data.averageProcessingTime} days</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-orange-900/95 backdrop-blur-sm p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 flex flex-col text-white animate-in fade-in duration-200 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2">
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-lg">Change Order Deep Dive</span>
            </div>
            
            {/* Categories Breakdown */}
            <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
              <h4 className="font-semibold mb-2 flex items-center text-sm">
                <Calculator className="w-4 h-4 mr-2" />
                By Category
              </h4>
              <div className="space-y-2 text-xs">
                {data.drillDown.byCategory.map((cat) => (
                  <div key={cat.name} className="flex justify-between items-center">
                    <span className="text-orange-200">{cat.name}:</span>
                    <div className="text-right">
                      <div className="font-medium">{cat.count} COs • {formatCurrency(cat.value)}</div>
                      <div className="text-orange-300">Avg: {cat.avgDays} days</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Trends */}
            <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
              <h4 className="font-semibold mb-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                6-Month Trend
              </h4>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.drillDown.timeline}>
                    <Bar dataKey="submitted" fill="hsl(var(--chart-3))" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="approved" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--border))' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none', 
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Project Performance or Portfolio Risks */}
            {userRole === 'project-manager' ? (
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-2 flex items-center text-sm">
                  <Building2 className="w-4 h-4 mr-2" />
                  Project: {data.drillDown.projectDetails?.name}
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-orange-200">Completion:</span>
                    <span className="font-medium">{data.drillDown.projectDetails?.completion}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-200">Largest CO:</span>
                    <span className="font-medium">{formatCurrency(data.drillDown.topChangeOrder.value)}</span>
                  </div>
                  <div className="pt-2 border-t border-orange-700">
                    <div className="text-orange-200 mb-1">Current Risks:</div>
                    {data.drillDown.risks?.map((risk, index) => (
                      <div key={index} className="text-orange-300 text-xs">• {risk}</div>
                    ))}
                  </div>
                </div>
              </div>
            ) : userRole === 'project-executive' ? (
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-2 flex items-center text-sm">
                  <Building2 className="w-4 h-4 mr-2" />
                  Project Performance (6 Projects)
                </h4>
                <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
                  {data.drillDown.projectPerformance?.map((project, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-orange-800 pb-1">
                      <div className="flex-1">
                        <div className="font-medium text-orange-200">{project.project}</div>
                        <div className="text-orange-300">{project.cos} COs • {formatPercentage(project.ratio)} ratio</div>
                      </div>
                      <Badge className={`text-xs ${
                        project.status === 'High' ? 'bg-red-200 text-red-800' :
                        project.status === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-2 flex items-center text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Portfolio Risks
                </h4>
                <div className="space-y-1 text-xs">
                  {data.drillDown.portfolioRisks?.map((risk, index) => (
                    <div key={index} className="text-orange-300">• {risk}</div>
                  )) || data.drillDown.risks?.map((risk, index) => (
                    <div key={index} className="text-orange-300">• {risk}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Project Executive Section */}
            {userRole === 'project-executive' && (
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-2 flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Critical CO Status
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-orange-200">Highest Value CO:</span>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(data.drillDown.topChangeOrder.value)}</div>
                      <div className="text-orange-300">{data.drillDown.topChangeOrder.project}</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-orange-700">
                    <div className="text-orange-200 mb-1">Portfolio Risks:</div>
                    {data.drillDown.risks?.slice(0, 2).map((risk, index) => (
                      <div key={index} className="text-orange-300 text-xs">• {risk}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Key Insights */}
            <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
              <h4 className="font-semibold mb-2 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Key Insights
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-orange-200">Contract Impact:</span>
                  <span className="font-medium">{formatPercentage(data.changeOrderRatio)} of contract value</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-200">Risk Level:</span>
                  <Badge className={`${getRiskColor(data.riskLevel)} bg-white/20 dark:bg-black/20 text-xs`}>
                    {data.riskLevel}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-200">Top Category:</span>
                  <span className="font-medium">{data.drillDown.byCategory[0].name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 