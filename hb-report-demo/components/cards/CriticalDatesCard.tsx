"use client";

import { useState } from "react";
import { CalendarDays, AlertTriangle, CheckCircle, Clock, ChevronRight, TrendingUp, Target, Award, FileText, Shield, Wrench, Settings, Users2, Building2, Calendar, User, AlertCircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

interface CriticalDatesCardProps {
  config?: any;
  span?: any;
  isCompact?: boolean;
  userRole?: string;
}

export default function CriticalDatesCard({ config, span, isCompact, userRole }: CriticalDatesCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Role-based data filtering
  const getDataByRole = () => {
    const currentDate = new Date();
    const addDays = (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    switch (userRole) {
      case 'project-manager':
        // Single project view
        return {
          totalEvents: 12,
          criticalEvents: 3,
          upcomingEvents: 7,
          overdueEvents: 2,
          nextCriticalDays: 3,
          lastUpdated: "2 hours ago",
          projectName: "Tropical World Nursery",
          events: [
            {
              id: 1,
              project: "Tropical World Nursery",
              event: "Building Permit Renewal",
              type: "permit",
              date: addDays(currentDate, 3),
              daysUntil: 3,
              priority: "critical",
              responsible: "Project Manager",
              status: "pending",
              notes: "Must renew before construction continues"
            },
            {
              id: 2,
              project: "Tropical World Nursery",
              event: "Fire Sprinkler Inspection",
              type: "inspection",
              date: addDays(currentDate, 5),
              daysUntil: 5,
              priority: "high",
              responsible: "Fire Safety Contractor",
              status: "scheduled",
              notes: "Final inspection before occupancy"
            },
            {
              id: 3,
              project: "Tropical World Nursery",
              event: "General Liability Renewal",
              type: "insurance",
              date: addDays(currentDate, 7),
              daysUntil: 7,
              priority: "critical",
              responsible: "Insurance Agent",
              status: "pending",
              notes: "Required for continuous coverage"
            },
            {
              id: 4,
              project: "Tropical World Nursery",
              event: "Substantial Completion Target",
              type: "milestone",
              date: addDays(currentDate, 14),
              daysUntil: 14,
              priority: "high",
              responsible: "Project Team",
              status: "on-track",
              notes: "Target date for substantial completion"
            },
            {
              id: 5,
              project: "Tropical World Nursery",
              event: "OSHA Compliance Audit",
              type: "compliance",
              date: addDays(currentDate, 21),
              daysUntil: 21,
              priority: "medium",
              responsible: "Safety Manager",
              status: "scheduled",
              notes: "Quarterly safety compliance review"
            }
          ],
          categories: [
            { name: "Permits", count: 4, critical: 2, upcoming: 2 },
            { name: "Inspections", count: 3, critical: 1, upcoming: 2 },
            { name: "Insurance", count: 2, critical: 1, upcoming: 1 },
            { name: "Milestones", count: 2, critical: 0, upcoming: 2 },
            { name: "Compliance", count: 1, critical: 0, upcoming: 1 }
          ],
          riskLevel: "Medium",
          onTimePerformance: 85.7
        };
        
      case 'project-executive':
        // 6 projects view
        return {
          totalEvents: 72,
          criticalEvents: 18,
          upcomingEvents: 42,
          overdueEvents: 12,
          nextCriticalDays: 2,
          lastUpdated: "30 minutes ago",
          projectName: "Portfolio Overview",
          events: [
            {
              id: 1,
              project: "Medical Center East",
              event: "Certificate of Occupancy Due",
              type: "permit",
              date: addDays(currentDate, 2),
              daysUntil: 2,
              priority: "critical",
              responsible: "Building Department",
              status: "pending",
              notes: "Final step before handover"
            },
            {
              id: 2,
              project: "Tech Campus Phase 2",
              event: "Workers' Comp Audit",
              type: "insurance",
              date: addDays(currentDate, 4),
              daysUntil: 4,
              priority: "critical",
              responsible: "HR Department",
              status: "scheduled",
              notes: "Annual workers compensation audit"
            },
            {
              id: 3,
              project: "Marina Bay Plaza",
              event: "Environmental Compliance Review",
              type: "compliance",
              date: addDays(currentDate, 6),
              daysUntil: 6,
              priority: "high",
              responsible: "Environmental Consultant",
              status: "pending",
              notes: "Stormwater management compliance"
            },
            {
              id: 4,
              project: "Tropical World",
              event: "Building Permit Renewal",
              type: "permit",
              date: addDays(currentDate, 3),
              daysUntil: 3,
              priority: "critical",
              responsible: "Project Manager",
              status: "pending",
              notes: "Must renew before construction continues"
            },
            {
              id: 5,
              project: "Grandview Heights",
              event: "Bonding Requirement Update",
              type: "insurance",
              date: addDays(currentDate, 8),
              daysUntil: 8,
              priority: "medium",
              responsible: "Surety Company",
              status: "in-progress",
              notes: "Update bond amount for scope changes"
            },
            {
              id: 6,
              project: "Riverside Plaza",
              event: "Structural Steel Delivery",
              type: "milestone",
              date: addDays(currentDate, 10),
              daysUntil: 10,
              priority: "high",
              responsible: "Steel Fabricator",
              status: "confirmed",
              notes: "Critical path delivery date"
            }
          ],
          categories: [
            { name: "Permits", count: 24, critical: 8, upcoming: 14 },
            { name: "Inspections", count: 18, critical: 4, upcoming: 12 },
            { name: "Insurance", count: 12, critical: 3, upcoming: 8 },
            { name: "Milestones", count: 12, critical: 2, upcoming: 6 },
            { name: "Compliance", count: 6, critical: 1, upcoming: 2 }
          ],
          projectBreakdown: [
            { project: "Medical Center East", critical: 2, upcoming: 5, overdue: 0, performance: 95 },
            { project: "Tech Campus Phase 2", critical: 3, upcoming: 7, overdue: 1, performance: 88 },
            { project: "Marina Bay Plaza", critical: 4, upcoming: 6, overdue: 2, performance: 82 },
            { project: "Tropical World", critical: 3, upcoming: 8, overdue: 2, performance: 85 },
            { project: "Grandview Heights", critical: 3, upcoming: 9, overdue: 4, performance: 72 },
            { project: "Riverside Plaza", critical: 3, upcoming: 7, overdue: 3, performance: 78 }
          ],
          riskLevel: "High",
          onTimePerformance: 83.3
        };
        
      default:
        // Executive - all projects view
        return {
          totalEvents: 144,
          criticalEvents: 36,
          upcomingEvents: 84,
          overdueEvents: 24,
          nextCriticalDays: 1,
          lastUpdated: "15 minutes ago",
          projectName: "Company Portfolio",
          events: [
            {
              id: 1,
              project: "Corporate Headquarters",
              event: "Final Building Inspection",
              type: "inspection",
              date: addDays(currentDate, 1),
              daysUntil: 1,
              priority: "critical",
              responsible: "Building Inspector",
              status: "scheduled",
              notes: "Final inspection before certificate of occupancy"
            },
            {
              id: 2,
              project: "Manufacturing Facility",
              event: "Environmental Impact Report Due",
              type: "compliance",
              date: addDays(currentDate, 2),
              daysUntil: 2,
              priority: "critical",
              responsible: "Environmental Consultant",
              status: "in-review",
              notes: "Required for EPA compliance"
            },
            {
              id: 3,
              project: "Hospital Wing B",
              event: "Medical Equipment Installation Permit",
              type: "permit",
              date: addDays(currentDate, 3),
              daysUntil: 3,
              priority: "critical",
              responsible: "Medical Equipment Vendor",
              status: "pending",
              notes: "Specialized permit for medical gas systems"
            }
          ],
          categories: [
            { name: "Permits", count: 48, critical: 16, upcoming: 28 },
            { name: "Inspections", count: 36, critical: 8, upcoming: 24 },
            { name: "Insurance", count: 24, critical: 6, upcoming: 16 },
            { name: "Milestones", count: 24, critical: 4, upcoming: 12 },
            { name: "Compliance", count: 12, critical: 2, upcoming: 4 }
          ],
          portfolioMetrics: {
            avgDaysToCompletion: 12.5,
            onTimeCompletion: 78,
            criticalPathEvents: 36,
            riskProjects: 5
          },
          riskLevel: "High",
          onTimePerformance: 78.2
        };
    }
  };

  const data = getDataByRole();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200 dark:border-red-800';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-green-100 text-green-700 border-green-200 dark:border-green-800';
      default: return 'bg-muted text-foreground border-border';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'permit': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'insurance': return <Shield className="h-4 w-4 text-purple-500" />;
      case 'compliance': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'milestone': return <Target className="h-4 w-4 text-orange-500" />;
      case 'inspection': return <Settings className="h-4 w-4 text-indigo-500" />;
      default: return <CalendarDays className="h-4 w-4 text-muted-foreground" />;
    }
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
    { name: "Critical", value: data.criticalEvents, color: "hsl(var(--chart-4))" },
    { name: "Upcoming", value: data.upcomingEvents, color: "hsl(var(--chart-3))" },
    { name: "Overdue", value: data.overdueEvents, color: "#dc2626" },
  ];

  const categoryData = data.categories.map(cat => ({
    name: cat.name,
    critical: cat.critical,
    upcoming: cat.upcoming,
    total: cat.count
  }));

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-blue-200 dark:border-blue-800">
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2">
          <div className="text-center">
            <div className={`text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium ${getPriorityColor('critical')}`}>
              {data.nextCriticalDays}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Days to Next Critical</div>
          </div>
          <div className="text-center">
            <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-blue-700">{data.criticalEvents}</div>
            <div className="text-xs text-muted-foreground">Critical Events</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 space-y-4 overflow-y-auto">
        {/* Status Overview */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-1 sm:mb-1.5 lg:mb-2">
            <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-foreground">Event Status</span>
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
              <div className="text-center p-2 bg-red-50 dark:bg-red-950/30 rounded">
                <div className="font-bold text-red-600 dark:text-red-400">{data.criticalEvents}</div>
                <div className="text-muted-foreground">Critical</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded">
                <div className="font-bold text-yellow-600 dark:text-yellow-400">{data.upcomingEvents}</div>
                <div className="text-muted-foreground">Upcoming</div>
              </div>
              <div className="text-center p-2 bg-red-100 rounded">
                <div className="font-bold text-red-700">{data.overdueEvents}</div>
                <div className="text-muted-foreground">Overdue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Critical Events */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-foreground">Next Critical Events</span>
          </div>
          <div className="space-y-2">
            {data.events.slice(0, 3).map((event) => (
              <TooltipProvider key={event.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-black/50 rounded border hover:bg-white/80 dark:bg-black/80 transition-colors cursor-pointer">
                      {getTypeIcon(event.type)}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{event.event}</div>
                        <div className="text-xs text-muted-foreground">{event.project}</div>
                      </div>
                      <Badge className={`${getPriorityBadge(event.priority)} text-xs`}>
                        {event.daysUntil}d
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card text-foreground p-1.5 sm:p-2 lg:p-2.5 rounded-md shadow-lg border">
                    <div className="space-y-1">
                      <p className="font-semibold">{event.event}</p>
                      <p className="text-sm">Project: {event.project}</p>
                      <p className="text-sm">Date: {formatDate(event.date)}</p>
                      <p className="text-sm">Responsible: {event.responsible}</p>
                      <p className="text-sm">Priority: {event.priority}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white/60 dark:bg-black/60 rounded-lg p-1.5 sm:p-2 lg:p-2.5 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-foreground">Performance</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">On-Time Performance</span>
              <span className="font-medium">{data.onTimePerformance.toFixed(1)}%</span>
            </div>
            <Progress value={data.onTimePerformance} className="h-2" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Risk Level</span>
              <Badge className={`${getRiskColor(data.riskLevel)} bg-white/20 dark:bg-black/20 text-xs`}>
                {data.riskLevel}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-blue-900/95 backdrop-blur-sm p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 flex flex-col text-white animate-in fade-in duration-200 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2">
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-lg">Critical Dates Analysis</span>
            </div>
            
            {/* Categories Breakdown */}
            <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
              <h4 className="font-semibold mb-2 flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Event Categories
              </h4>
              <div className="space-y-2 text-xs">
                {data.categories.map((cat) => (
                  <div key={cat.name} className="flex justify-between items-center">
                    <span className="text-blue-200">{cat.name}:</span>
                    <div className="text-right">
                      <div className="font-medium">{cat.count} total • {cat.critical} critical</div>
                      <div className="text-blue-300">{cat.upcoming} upcoming</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Category Chart */}
            <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
              <h4 className="font-semibold mb-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Category Distribution
              </h4>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <Bar dataKey="critical" fill="hsl(var(--chart-4))" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="upcoming" fill="hsl(var(--chart-3))" radius={[2, 2, 0, 0]} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#93c5fd' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#93c5fd' }} />
                  </BarChart>
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
                    <span className="text-blue-200">Total Events:</span>
                    <span className="font-medium">{data.totalEvents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Next Critical:</span>
                    <span className="font-medium">{data.nextCriticalDays} days</span>
                  </div>
                  <div className="pt-2 border-t border-blue-700">
                    <div className="text-blue-200 mb-1">Immediate Actions:</div>
                    {data.events.slice(0, 3).map((event, index) => (
                      <div key={index} className="text-blue-300 text-xs">
                        • {event.event} ({event.daysUntil}d)
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : userRole === 'project-executive' ? (
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-2 flex items-center text-sm">
                  <Building2 className="w-4 h-4 mr-2" />
                  Project Portfolio (6 Projects)
                </h4>
                <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
                  {(data as any).projectBreakdown?.map((project: any, index: number) => (
                    <div key={index} className="flex justify-between items-center border-b border-blue-800 pb-1">
                      <div className="flex-1">
                        <div className="font-medium text-blue-200">{project.project}</div>
                        <div className="text-blue-300">{project.critical} critical • {project.upcoming} upcoming</div>
                        {project.overdue > 0 && (
                          <div className="text-red-300">⚠ {project.overdue} overdue</div>
                        )}
                      </div>
                      <Badge className={`text-xs ${
                        project.performance >= 90 ? 'bg-green-200 text-green-800' :
                        project.performance >= 80 ? 'bg-blue-200 text-blue-800' :
                        project.performance >= 70 ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {project.performance}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-2 flex items-center text-sm">
                  <AlertCircleIcon className="w-4 h-4 mr-2" />
                  Portfolio Metrics
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Avg Days to Completion:</span>
                    <span className="font-medium">{(data as any).portfolioMetrics?.avgDaysToCompletion} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">On-Time Completion:</span>
                    <span className="font-medium">{(data as any).portfolioMetrics?.onTimeCompletion}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Critical Path Events:</span>
                    <span className="font-medium">{(data as any).portfolioMetrics?.criticalPathEvents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">High Risk Projects:</span>
                    <span className="font-medium">{(data as any).portfolioMetrics?.riskProjects}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Key Insights */}
            <div className="bg-white/10 dark:bg-black/10 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
              <h4 className="font-semibold mb-2 flex items-center text-sm">
                <Award className="w-4 h-4 mr-2" />
                Key Insights
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-200">Performance Score:</span>
                  <Badge className={`${data.onTimePerformance >= 90 ? 'bg-green-200 text-green-800' : 
                    data.onTimePerformance >= 80 ? 'bg-blue-200 text-blue-800' : 'bg-yellow-200 text-yellow-800'} text-xs`}>
                    {data.onTimePerformance >= 90 ? 'Excellent' : data.onTimePerformance >= 80 ? 'Good' : 'Needs Attention'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Risk Level:</span>
                  <span className={`font-medium ${getRiskColor(data.riskLevel)}`}>{data.riskLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Last Updated:</span>
                  <span className="font-medium">{data.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}