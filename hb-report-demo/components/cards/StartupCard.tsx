"use client";

import { useState } from "react";
import { Play, Clock, AlertCircle, FileCheck, Building2, ClipboardCheck, Users, CalendarCheck, ChevronRight, TrendingUp, Target, Award, FileText, Shield, Wrench, Settings, Users2, Clipboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface StartupCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function StartupCard({ config, span, isCompact, userRole }: StartupCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          overallCompletion: 85.5,
          totalItems: 55,
          completedItems: 47,
          pendingItems: 6,
          criticalItems: 2,
          daysToMobilization: 5,
          lastActivity: "1 hour ago",
          projectPhase: "Pre-Construction",
          riskLevel: "Low",
          categories: [
            { name: "Contract Review", total: 4, completed: 4, pending: 0, critical: 0, completion: 100 },
            { name: "Job Start-up", total: 33, completed: 28, pending: 4, critical: 1, completion: 84.8 },
            { name: "Services & Equipment", total: 6, completed: 5, pending: 1, critical: 0, completion: 83.3 },
            { name: "Permits", total: 12, completed: 10, pending: 1, critical: 1, completion: 83.3 }
          ],
          drillDown: {
            projectDetails: {
              name: "Tropical World Nursery",
              phase: "Pre-Construction",
              mobDate: "2025-01-20",
              contractValue: 57235491,
              noticeSentDate: "2025-01-08"
            },
            criticalTasks: [
              { task: "Fire Sprinklers permit", category: "Permits", daysOverdue: 2 },
              { task: "Prepare Project Schedule", category: "Job Start-up", daysOverdue: 0 }
            ],
            recentActivity: [
              { date: "2025-01-10", action: "Notice of Commencement recorded", status: "completed" },
              { date: "2025-01-09", action: "Project signs ordered", status: "completed" },
              { date: "2025-01-08", action: "Bond application submitted", status: "completed" }
            ],
            upcomingMilestones: [
              { milestone: "Mobilization", dueDate: "2025-01-20", status: "pending" },
              { milestone: "Pre-Construction Meeting", dueDate: "2025-01-18", status: "scheduled" },
              { milestone: "Final Permit Approval", dueDate: "2025-01-15", status: "pending" }
            ]
          }
        };
      case 'project-executive':
        // Limited to 6 projects
        return {
          overallCompletion: 78.2,
          totalItems: 330, // 55 items × 6 projects
          completedItems: 258,
          pendingItems: 52,
          criticalItems: 20,
          daysToMobilization: 12,
          lastActivity: "45 minutes ago",
          projectPhase: "Mixed",
          riskLevel: "Medium",
          categories: [
            { name: "Contract Review", total: 24, completed: 22, pending: 2, critical: 0, completion: 91.7 },
            { name: "Job Start-up", total: 198, completed: 155, pending: 30, critical: 13, completion: 78.3 },
            { name: "Services & Equipment", total: 36, completed: 28, pending: 6, critical: 2, completion: 77.8 },
            { name: "Permits", total: 72, completed: 53, pending: 14, critical: 5, completion: 73.6 }
          ],
          drillDown: {
            projectPerformance: [
              { project: "Medical Center East", completion: 95.2, status: "Excellent", phase: "Ready to Mobilize", critical: 0 },
              { project: "Tech Campus Phase 2", completion: 89.1, status: "Good", phase: "Permits Pending", critical: 2 },
              { project: "Marina Bay Plaza", completion: 83.6, status: "Good", phase: "Pre-Construction", critical: 1 },
              { project: "Tropical World", completion: 85.5, status: "Good", phase: "Pre-Construction", critical: 2 },
              { project: "Grandview Heights", completion: 67.3, status: "Attention", phase: "Contract Review", critical: 8 },
              { project: "Riverside Plaza", completion: 58.2, status: "Behind", phase: "Setup", critical: 7 }
            ],
            portfolioRisks: [
              "2 projects behind schedule on mobilization",
              "8 permits pending approval across portfolio",
              "Contract review delays on newer awards",
              "Subcontractor insurance compliance lagging"
            ],
            upcomingDeadlines: [
              { project: "Medical Center East", milestone: "Mobilization", dueDate: "2025-01-15" },
              { project: "Tech Campus", milestone: "Final Permits", dueDate: "2025-01-18" },
              { project: "Tropical World", milestone: "Pre-Con Meeting", dueDate: "2025-01-18" }
            ]
          }
        };
      default:
        // Executive - all projects view
        return {
          overallCompletion: 73.8,
          totalItems: 660, // 55 items × 12 projects
          completedItems: 487,
          pendingItems: 125,
          criticalItems: 48,
          daysToMobilization: 18,
          lastActivity: "15 minutes ago",
          projectPhase: "Mixed",
          riskLevel: "High",
          categories: [
            { name: "Contract Review", total: 48, completed: 42, pending: 4, critical: 2, completion: 87.5 },
            { name: "Job Start-up", total: 396, completed: 285, pending: 75, critical: 36, completion: 72.0 },
            { name: "Services & Equipment", total: 72, completed: 52, pending: 15, critical: 5, completion: 72.2 },
            { name: "Permits", total: 144, completed: 108, pending: 31, critical: 5, completion: 75.0 }
          ],
          drillDown: {
            portfolioMetrics: {
              avgMobilizationTime: 21, // days
              onTimeStartups: 67, // percentage
              permitSuccess: 89, // percentage
              contractCompliance: 94 // percentage
            },
            topPerformers: [
              { project: "Corporate Headquarters", completion: 98.2 },
              { project: "Retail Complex West", completion: 95.5 },
              { project: "Office Tower Downtown", completion: 92.7 }
            ],
            riskProjects: [
              { project: "Manufacturing Facility", completion: 45.5, critical: 12 },
              { project: "Hospital Wing B", completion: 52.7, critical: 10 },
              { project: "School District Admin", completion: 58.2, critical: 8 }
            ],
            portfolioRisks: [
              "5 projects significantly behind startup timeline",
              "18 permits pending approval across portfolio",
              "Contract review bottleneck on new awards",
              "Subcontractor insurance processing delays",
              "Resource constraints in pre-construction phase"
            ]
          }
        };
    }
  };

  const data = getDataByRole();

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (completion: number) => {
    if (completion >= 90) return "text-green-600 dark:text-green-400";
    if (completion >= 75) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getStatusBadge = (completion: number) => {
    if (completion >= 90) return "bg-green-100 text-green-700";
    if (completion >= 75) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
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
  const categoryData = data.categories.map(cat => ({
    name: cat.name.split(' ')[0], // Shorten for display
    completion: cat.completion,
    completed: cat.completed,
    pending: cat.pending,
    critical: cat.critical
  }));

  const statusData = [
    { name: "Completed", value: data.completedItems, color: "hsl(var(--chart-1))" },
    { name: "Pending", value: data.pendingItems, color: "hsl(var(--chart-3))" },
    { name: "Critical", value: data.criticalItems, color: "hsl(var(--chart-4))" },
  ];

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-emerald-200 dark:border-emerald-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className={`text-lg font-bold ${getStatusColor(data.overallCompletion)}`}>
              {formatPercentage(data.overallCompletion)}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">Ready</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-700">{data.daysToMobilization}</div>
            <div className="text-xs text-muted-foreground">Days to Mob</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Status Overview */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-3">
            <Play className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-foreground">Startup Status</span>
          </div>
          <div className="flex items-center gap-4">
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
                <div className="font-bold text-green-600 dark:text-green-400">{data.completedItems}</div>
                <div className="text-muted-foreground">Complete</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded">
                <div className="font-bold text-yellow-600 dark:text-yellow-400">{data.pendingItems}</div>
                <div className="text-muted-foreground">Pending</div>
              </div>
              <div className="text-center p-2 bg-red-50 dark:bg-red-950/30 rounded">
                <div className="font-bold text-red-600 dark:text-red-400">{data.criticalItems}</div>
                <div className="text-muted-foreground">Critical</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress by Category */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-foreground">Category Progress</span>
          </div>
          <div className="space-y-2">
            {data.categories.slice(0, 3).map((category) => (
              <div key={category.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{category.name}</span>
                  <span className="font-medium">{formatPercentage(category.completion)}</span>
                </div>
                <Progress value={category.completion} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <CalendarCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-foreground">Timeline</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Est. Mobilization</span>
              <Badge variant="outline" className="text-xs">{data.daysToMobilization} days</Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Current Phase</span>
              <Badge className={`${getStatusBadge(data.overallCompletion)} text-xs`}>
                {data.projectPhase}
              </Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Last Activity</span>
              <span className="font-medium">{data.lastActivity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-emerald-900/95 backdrop-blur-sm p-4 flex flex-col text-white animate-in fade-in duration-200 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-lg">Startup Deep Dive</span>
            </div>
            
            {/* Categories Breakdown */}
            <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3">
              <h4 className="font-semibold mb-2 flex items-center text-sm">
                <Clipboard className="w-4 h-4 mr-2" />
                Category Details
              </h4>
              <div className="space-y-2 text-xs">
                {data.categories.map((cat) => (
                  <div key={cat.name} className="flex justify-between items-center">
                    <span className="text-emerald-200">{cat.name}:</span>
                    <div className="text-right">
                      <div className="font-medium">{cat.completed}/{cat.total} • {formatPercentage(cat.completion)}</div>
                      {cat.critical > 0 && (
                        <div className="text-red-300">⚠ {cat.critical} critical</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Progress Chart */}
            <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3">
              <h4 className="font-semibold mb-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Category Completion
              </h4>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <Bar dataKey="completion" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
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

            {/* Project Details or Portfolio View */}
            {userRole === 'project-manager' ? (
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3">
                <h4 className="font-semibold mb-2 flex items-center text-sm">
                  <Building2 className="w-4 h-4 mr-2" />
                  Project: {data.drillDown.projectDetails?.name}
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-emerald-200">Mob Target:</span>
                    <span className="font-medium">{data.drillDown.projectDetails?.mobDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-200">Contract Value:</span>
                    <span className="font-medium">{formatCurrency(data.drillDown.projectDetails?.contractValue)}</span>
                  </div>
                  <div className="pt-2 border-t border-emerald-700">
                    <div className="text-emerald-200 mb-1">Critical Tasks:</div>
                    {data.drillDown.criticalTasks?.map((task, index) => (
                      <div key={index} className="text-emerald-300 text-xs">
                        • {task.task} {task.daysOverdue > 0 && `(${task.daysOverdue}d overdue)`}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : userRole === 'project-executive' ? (
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3">
                <h4 className="font-semibold mb-2 flex items-center text-sm">
                  <Building2 className="w-4 h-4 mr-2" />
                  Project Status (6 Projects)
                </h4>
                <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
                  {data.drillDown.projectPerformance?.map((project, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-emerald-800 pb-1">
                      <div className="flex-1">
                        <div className="font-medium text-emerald-200">{project.project}</div>
                        <div className="text-emerald-300">{formatPercentage(project.completion)} • {project.phase}</div>
                        {project.critical > 0 && (
                          <div className="text-red-300">⚠ {project.critical} critical items</div>
                        )}
                      </div>
                      <Badge className={`text-xs ${
                        project.status === 'Excellent' ? 'bg-green-200 text-green-800' :
                        project.status === 'Good' ? 'bg-blue-200 text-blue-800' :
                        project.status === 'Attention' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3">
                <h4 className="font-semibold mb-2 flex items-center text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Portfolio Risks
                </h4>
                <div className="space-y-1 text-xs">
                  {(data.drillDown.portfolioRisks || []).map((risk, index) => (
                    <div key={index} className="text-emerald-300">• {risk}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Project Executive Section */}
            {userRole === 'project-executive' && (
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3">
                <h4 className="font-semibold mb-2 flex items-center text-sm">
                  <CalendarCheck className="w-4 h-4 mr-2" />
                  Upcoming Milestones
                </h4>
                <div className="space-y-1 text-xs">
                  {data.drillDown.upcomingDeadlines?.map((deadline, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium text-emerald-200">{deadline.project}</div>
                        <div className="text-emerald-300">{deadline.milestone}</div>
                      </div>
                      <span className="text-yellow-300 text-xs">{deadline.dueDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Insights */}
            <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3">
              <h4 className="font-semibold mb-2 flex items-center text-sm">
                <Award className="w-4 h-4 mr-2" />
                Key Insights
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-emerald-200">Startup Health:</span>
                  <Badge className={`${getStatusColor(data.overallCompletion)} bg-white/20 dark:bg-black/20 text-xs`}>
                    {data.overallCompletion >= 90 ? 'Excellent' : data.overallCompletion >= 75 ? 'Good' : 'Needs Attention'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-200">Risk Level:</span>
                  <span className={`font-medium ${getRiskColor(data.riskLevel)}`}>{data.riskLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-200">Days to Mobilize:</span>
                  <span className="font-medium">{data.daysToMobilization} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}