"use client";

import { useState } from "react";
import { FileText, Users, Calendar, ChevronRight, TrendingUp, Target, Award, Building2, AlertTriangle, CheckCircle, Clock, User, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

interface FieldReportsCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function FieldReportsCard({ config, span, isCompact, userRole }: FieldReportsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate business days since start of month
  const getBusinessDaysSinceMonthStart = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let count = 0;
    
    for (let d = new Date(startOfMonth); d <= now; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
        count++;
      }
    }
    return count;
  };

  const businessDaysThisMonth = getBusinessDaysSinceMonthStart();

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          projectName: "Tropical World Nursery",
          totalReports: businessDaysThisMonth,
          submittedReports: Math.floor(businessDaysThisMonth * 0.91), // 91% completion
          completionRate: 91.3,
          avgSubmissionTime: "10:45 AM",
          lastSubmission: "Today at 9:32 AM",
          superintendent: "Mike Rodriguez",
          businessDaysThisMonth,
          recentReports: [
            {
              date: "2025-01-13",
              weather: "Partly Cloudy, 72°F",
              crewSize: 24,
              visitors: 3,
              delays: 0,
              safetyIssues: 0,
              workCompleted: "Foundation pour zone 3, steel delivery inspection",
              submissionTime: "9:32 AM",
              quality: "good"
            },
            {
              date: "2025-01-12",
              weather: "Clear, 68°F",
              crewSize: 26,
              visitors: 1,
              delays: 1,
              safetyIssues: 0,
              workCompleted: "Foundation forms installation, MEP rough-in",
              submissionTime: "10:15 AM",
              quality: "good"
            },
            {
              date: "2025-01-11",
              weather: "Overcast, 65°F",
              crewSize: 22,
              visitors: 2,
              delays: 0,
              safetyIssues: 1,
              workCompleted: "Site preparation, utility connections",
              submissionTime: "11:20 AM",
              quality: "excellent"
            }
          ],
          weeklyTrends: [
            { week: "Week 1", reports: 5, completion: 100 },
            { week: "Week 2", reports: 4, completion: 80 },
            { week: "Week 3", reports: 3, completion: 100 }
          ],
          keyMetrics: {
            avgCrewSize: 24.2,
            avgVisitors: 2.1,
            totalDelays: 3,
            safetyIncidents: 1,
            onTimeSubmissions: 89
          },
          riskLevel: "Low"
        };
        
      case 'project-executive':
        // 6 projects view
        return {
          projectName: "Portfolio Overview",
          totalReports: businessDaysThisMonth * 6,
          submittedReports: Math.floor(businessDaysThisMonth * 6 * 0.847), // 84.7% completion
          completionRate: 84.7,
          avgSubmissionTime: "11:12 AM",
          lastSubmission: "38 minutes ago",
          superintendent: "Portfolio Team",
          businessDaysThisMonth,
          projectReports: [
            {
              project: "Medical Center East",
              superintendent: "Sarah Chen",
              reports: businessDaysThisMonth,
              submitted: Math.floor(businessDaysThisMonth * 0.95),
              completion: 95.2,
              lastSubmission: "Today 8:45 AM",
              avgCrewSize: 32,
              issues: 0
            },
            {
              project: "Tech Campus Phase 2",
              superintendent: "Jake Miller",
              reports: businessDaysThisMonth,
              submitted: Math.floor(businessDaysThisMonth * 0.89),
              completion: 89.1,
              lastSubmission: "Today 9:15 AM",
              avgCrewSize: 28,
              issues: 1
            },
            {
              project: "Marina Bay Plaza",
              superintendent: "Elena Vasquez",
              reports: businessDaysThisMonth,
              submitted: Math.floor(businessDaysThisMonth * 0.87),
              completion: 87.3,
              lastSubmission: "Today 10:30 AM",
              avgCrewSize: 24,
              issues: 2
            },
            {
              project: "Tropical World",
              superintendent: "Mike Rodriguez",
              reports: businessDaysThisMonth,
              submitted: Math.floor(businessDaysThisMonth * 0.91),
              completion: 91.3,
              lastSubmission: "Today 9:32 AM",
              avgCrewSize: 24,
              issues: 1
            },
            {
              project: "Grandview Heights",
              superintendent: "David Park",
              reports: businessDaysThisMonth,
              submitted: Math.floor(businessDaysThisMonth * 0.78),
              completion: 78.2,
              lastSubmission: "Yesterday 4:20 PM",
              avgCrewSize: 18,
              issues: 3
            },
            {
              project: "Riverside Plaza",
              superintendent: "Maria Santos",
              reports: businessDaysThisMonth,
              submitted: Math.floor(businessDaysThisMonth * 0.82),
              completion: 82.6,
              lastSubmission: "Today 11:45 AM",
              avgCrewSize: 21,
              issues: 2
            }
          ],
          weeklyTrends: [
            { week: "Week 1", reports: 28, completion: 93.3 },
            { week: "Week 2", reports: 26, completion: 86.7 },
            { week: "Week 3", reports: 24, completion: 80.0 }
          ],
          keyMetrics: {
            avgCrewSize: 24.5,
            totalDelays: 12,
            safetyIncidents: 4,
            onTimeSubmissions: 78.3,
            lateSubmissions: 15
          },
          riskLevel: "Medium"
        };
        
      default:
        // Executive - all projects view
        return {
          projectName: "Company Portfolio",
          totalReports: businessDaysThisMonth * 12,
          submittedReports: Math.floor(businessDaysThisMonth * 12 * 0.812), // 81.2% completion
          completionRate: 81.2,
          avgSubmissionTime: "11:38 AM",
          lastSubmission: "15 minutes ago",
          superintendent: "All Superintendents",
          businessDaysThisMonth,
          portfolioMetrics: {
            totalProjects: 12,
            avgCrewSize: 26.8,
            totalDelays: 28,
            safetyIncidents: 9,
            onTimeSubmissions: 76.2,
            lateSubmissions: 38,
            missedReports: 22
          },
          topPerformers: [
            { project: "Corporate Headquarters", completion: 98.5, superintendent: "Alex Thompson" },
            { project: "Medical Center East", completion: 95.2, superintendent: "Sarah Chen" },
            { project: "Retail Complex West", completion: 92.8, superintendent: "Tom Wilson" }
          ],
          underPerformers: [
            { project: "Manufacturing Facility", completion: 65.4, superintendent: "Chris Johnson" },
            { project: "School District Admin", completion: 69.8, superintendent: "Pat Lee" },
            { project: "Hospital Wing B", completion: 72.1, superintendent: "Lisa Rodriguez" }
          ],
          weeklyTrends: [
            { week: "Week 1", reports: 56, completion: 87.5 },
            { week: "Week 2", reports: 52, completion: 81.3 },
            { week: "Week 3", reports: 48, completion: 75.0 }
          ],
          riskLevel: "High"
        };
    }
  };

  const data = getDataByRole();

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 90) return "text-green-600 dark:text-green-400";
    if (completion >= 80) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getCompletionBadge = (completion: number) => {
    if (completion >= 90) return "bg-green-100 text-green-700";
    if (completion >= 80) return "bg-yellow-100 text-yellow-700";
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
  const statusData = [
    { name: "Submitted", value: data.submittedReports, color: "hsl(var(--chart-1))" },
    { name: "Missing", value: data.totalReports - data.submittedReports, color: "hsl(var(--chart-4))" },
  ];

  const weeklyData = data.weeklyTrends || [];

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-green-200 dark:border-green-800">
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2">
          <div className="text-center">
            <div className={`text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium ${getCompletionColor(data.completionRate)}`}>
              {formatPercentage(data.completionRate)}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-green-700">{data.submittedReports}/{data.totalReports}</div>
            <div className="text-xs text-muted-foreground">Reports</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 space-y-4 overflow-y-auto">
        {/* Completion Overview */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-1 sm:mb-1.5 lg:mb-2">
            <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-foreground">Report Status</span>
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
            <div className="flex-1 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected Reports:</span>
                <span className="font-medium">{data.totalReports}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted:</span>
                <span className="font-medium text-green-600 dark:text-green-400">{data.submittedReports}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Missing:</span>
                <span className="font-medium text-red-600 dark:text-red-400">{data.totalReports - data.submittedReports}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Business Days:</span>
                <span className="font-medium">{data.businessDaysThisMonth}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracking */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-foreground">Progress</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Monthly Completion</span>
              <span className="font-medium">{formatPercentage(data.completionRate)}</span>
            </div>
            <Progress value={data.completionRate} className="h-2" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Last Submission</span>
              <span className="font-medium">{data.lastSubmission}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-foreground">Recent Activity</span>
          </div>
          <div className="space-y-2 text-xs">
            {userRole === 'project-manager' && data.recentReports ? (
              data.recentReports.slice(0, 2).map((report: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white/50 dark:bg-black/50 rounded">
                  <div>
                    <div className="font-medium">{report.date}</div>
                    <div className="text-muted-foreground">Crew: {report.crewSize}, Issues: {report.delays + report.safetyIssues}</div>
                  </div>
                  <Badge className={`${getCompletionBadge(report.quality === 'excellent' ? 95 : 85)} text-xs`}>
                    {report.submissionTime}
                  </Badge>
                </div>
              ))
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Submission Time:</span>
                  <span className="font-medium">{data.avgSubmissionTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Superintendent:</span>
                  <span className="font-medium">{data.superintendent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <Badge className={`${getRiskColor(data.riskLevel)} bg-white/20 dark:bg-black/20 text-xs`}>
                    {data.riskLevel}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-green-900/95 backdrop-blur-sm p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 flex flex-col text-white animate-in fade-in duration-200 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2">
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-lg">Field Reports Analysis</span>
            </div>
            
            {/* Weekly Trends Chart */}
            <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
              <h4 className="font-semibold mb-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Weekly Completion Trends
              </h4>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <Line 
                      type="monotone" 
                      dataKey="completion" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 3 }}
                    />
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#065f46" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Project-Specific or Portfolio View */}
            {userRole === 'project-manager' ? (
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-2 flex items-center text-sm">
                  <Building2 className="w-4 h-4 mr-2" />
                  Project: {data.projectName}
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-green-200">Superintendent:</span>
                    <span className="font-medium">{data.superintendent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-200">Avg Crew Size:</span>
                    <span className="font-medium">{data.keyMetrics?.avgCrewSize || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-200">Total Delays:</span>
                    <span className="font-medium">{data.keyMetrics?.totalDelays || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-200">Safety Incidents:</span>
                    <span className="font-medium">{data.keyMetrics?.safetyIncidents || 0}</span>
                  </div>
                  <div className="pt-2 border-t border-green-700">
                    <div className="text-green-200 mb-1">Recent Reports Quality:</div>
                    {data.recentReports?.slice(0, 3).map((report: any, index: number) => (
                      <div key={index} className="text-green-300 text-xs">
                        • {report.date}: {report.workCompleted.slice(0, 30)}...
                      </div>
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
                  {data.projectReports?.map((project: any, index: number) => (
                    <div key={index} className="flex justify-between items-center border-b border-green-800 pb-1">
                      <div className="flex-1">
                        <div className="font-medium text-green-200">{project.project}</div>
                        <div className="text-green-300">{project.submitted}/{project.reports} • {formatPercentage(project.completion)}</div>
                        <div className="text-green-400">Supt: {project.superintendent.split(' ')[0]}</div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-xs ${
                          project.completion >= 90 ? 'bg-green-200 text-green-800' :
                          project.completion >= 80 ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {formatPercentage(project.completion)}
                        </Badge>
                        {project.issues > 0 && (
                          <div className="text-red-300 text-xs">⚠ {project.issues} issues</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-2 flex items-center text-sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Portfolio Metrics
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-green-200">Total Projects:</span>
                    <span className="font-medium">{data.portfolioMetrics?.totalProjects || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-200">Avg Crew Size:</span>
                    <span className="font-medium">{data.portfolioMetrics?.avgCrewSize || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-200">Total Delays:</span>
                    <span className="font-medium">{data.portfolioMetrics?.totalDelays || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-200">Safety Incidents:</span>
                    <span className="font-medium">{data.portfolioMetrics?.safetyIncidents || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-200">Missed Reports:</span>
                    <span className="font-medium">{data.portfolioMetrics?.missedReports || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Insights */}
            {userRole !== 'project-manager' && (
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-2 flex items-center text-sm">
                  <Award className="w-4 h-4 mr-2" />
                  Performance Insights
                </h4>
                <div className="space-y-1 text-xs">
                  {userRole === 'project-executive' ? (
                    <>
                      <div className="text-green-200 mb-1">Top Performers:</div>
                      {data.projectReports?.slice(0, 3)
                        .sort((a: any, b: any) => b.completion - a.completion)
                        .map((project: any, index: number) => (
                          <div key={index} className="text-green-300">
                            • {project.project}: {formatPercentage(project.completion)}
                          </div>
                        ))}
                    </>
                  ) : (
                    <>
                      <div className="text-green-200 mb-1">Top Performers:</div>
                      {data.topPerformers?.map((project: any, index: number) => (
                        <div key={index} className="text-green-300">
                          • {project.project}: {formatPercentage(project.completion)}
                        </div>
                      ))}
                      <div className="text-green-200 mb-1 mt-2">Needs Attention:</div>
                      {data.underPerformers?.map((project: any, index: number) => (
                        <div key={index} className="text-red-300">
                          • {project.project}: {formatPercentage(project.completion)}
                        </div>
                      ))}
                    </>
                  )}
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
                  <span className="text-green-200">Overall Health:</span>
                  <Badge className={`${getCompletionColor(data.completionRate)} bg-white/20 dark:bg-black/20 text-xs`}>
                    {data.completionRate >= 90 ? 'Excellent' : data.completionRate >= 80 ? 'Good' : 'Needs Attention'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-200">Risk Level:</span>
                  <span className={`font-medium ${getRiskColor(data.riskLevel)}`}>{data.riskLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-200">Completion Rate:</span>
                  <span className="font-medium">{formatPercentage(data.completionRate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}