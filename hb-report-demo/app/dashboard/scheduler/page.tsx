"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useProjectContext } from "@/context/project-context";
import { 
  Calendar, 
  Monitor, 
  Activity,
  Eye,
  Zap,
  BarChart3,
  FileText,
  Upload,
  Download,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Brain,
  Target,
  Clock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/layout/app-header";

// Scheduler Module Components
import SchedulerOverview from "@/components/scheduler/SchedulerOverview";
import ScheduleMonitor from "@/components/scheduler/ScheduleMonitor";
import HealthAnalysis from "@/components/scheduler/HealthAnalysis";
import LookAhead from "@/components/scheduler/LookAhead";
import ScheduleGenerator from "@/components/scheduler/ScheduleGenerator";

interface SchedulerModuleTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  component: React.ComponentType<{ userRole: string; projectData: any }>;
  requiredRoles?: string[];
}

export default function SchedulerPage() {
  const { user } = useAuth();
  const { projectId, selectedProject } = useProjectContext();
  const [activeTab, setActiveTab] = useState("overview");

  // Role-based data filtering helper
  const getProjectScope = () => {
    if (!user) return { scope: "all", projectCount: 0, description: "All Projects" };
    
    // If a specific project is selected, show single project view
    if (selectedProject) {
      return {
        scope: "single",
        projectCount: 1,
        description: `Project View: ${selectedProject.name}`,
        projects: [selectedProject.name],
        selectedProject
      };
    }
    
    // Default role-based views when no specific project is selected
    switch (user.role) {
      case "project-manager":
        return { 
          scope: "single", 
          projectCount: 1, 
          description: "Single Project View",
          projects: ["Tropical World Nursery"]
        };
      case "project-executive":
        return { 
          scope: "portfolio", 
          projectCount: 6, 
          description: "Portfolio View (6 Projects)",
          projects: ["Medical Center East", "Tech Campus Phase 2", "Marina Bay Plaza", "Tropical World", "Grandview Heights", "Riverside Plaza"]
        };
      default:
        return { 
          scope: "enterprise", 
          projectCount: 12, 
          description: "Enterprise View (All Projects)",
          projects: []
        };
    }
  };

  const projectScope = getProjectScope();

  // Define available scheduler modules
  const schedulerModules: SchedulerModuleTab[] = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      description: "Dashboard analytics and HBI insights for schedule performance analysis",
      component: SchedulerOverview,
    },
    {
      id: "schedule-monitor",
      label: "Schedule Monitor",
      icon: Monitor,
      description: "Compare current and historical schedules with milestone tracking",
      component: ScheduleMonitor,
    },
    {
      id: "health-analysis",
      label: "Health Analysis",
      icon: Activity,
      description: "Deep schedule logic analysis including ties, errors, and gaps",
      component: HealthAnalysis,
    },
    {
      id: "look-ahead",
      label: "Look Ahead",
      icon: Eye,
      description: "Create frag net schedules for detailed field execution tracking",
      component: LookAhead,
    },
    {
      id: "generator",
      label: "Generator",
      icon: Zap,
      description: "HBI-powered construction schedule generation with AI optimization",
      component: ScheduleGenerator,
    },
  ];

  // Filter modules based on user role (all users can access all scheduler modules)
  const availableModules = schedulerModules;

  // Get role-specific summary data based on current view
  const getSummaryData = () => {
    const scope = getProjectScope();
    
    // If viewing a single project (either by role or selection)
    if (scope.scope === "single") {
      return {
        totalActivities: 1247,
        criticalPathDuration: 312,
        scheduleHealth: 87,
        currentVariance: -8,
        upcomingMilestones: 5
      };
    }
    
    // Portfolio or enterprise views
    switch (user?.role) {
      case "project-executive":
        return {
          totalActivities: 7890,
          criticalPathDuration: 284,
          scheduleHealth: 84,
          currentVariance: -12,
          upcomingMilestones: 23
        };
      default:
        return {
          totalActivities: 12456,
          criticalPathDuration: 297,
          scheduleHealth: 82,
          currentVariance: -15,
          upcomingMilestones: 47
        };
    }
  };

  const summaryData = getSummaryData();

  const formatDuration = (days: number) => {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    return `${months}m ${remainingDays}d`;
  };

  return (
    <>
      <AppHeader />
      <div className="space-y-6" data-tour="scheduler-page-content">
        {/* Page Header */}
        <div className="flex items-center justify-between" data-tour="scheduler-page-header">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Scheduler</h1>
            <p className="text-sm text-muted-foreground mt-1">
              AI-powered project scheduling and optimization platform
            </p>
          </div>
          <div className="flex items-center gap-4" data-tour="scheduler-scope-badges">
            <Badge variant="outline" className="px-3 py-1">
              {projectScope.description}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
              <Activity className="h-3 w-3" />
              Health Score: {summaryData.scheduleHealth}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4" data-tour="scheduler-quick-stats">
          <Card className="p-4 border-border bg-card">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Total Activities</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {summaryData.totalActivities.toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-border bg-card">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Critical Path</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatDuration(summaryData.criticalPathDuration)}
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-border bg-card">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Schedule Health</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {summaryData.scheduleHealth}%
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-border bg-card">
            <div className="flex items-center gap-3">
              {summaryData.currentVariance >= 0 ? 
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" /> :
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              }
              <div>
                <div className="text-sm font-medium text-muted-foreground">Variance</div>
                <div className={`text-2xl font-bold ${summaryData.currentVariance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {summaryData.currentVariance > 0 ? '+' : ''}{summaryData.currentVariance}d
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-border bg-card">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Milestones</div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {summaryData.upcomingMilestones}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Scheduler Modules */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-5 h-12 bg-muted border-border" data-tour="scheduler-tabs">
            {availableModules.map((module) => (
              <TabsTrigger
                key={module.id}
                value={module.id}
                className="flex items-center gap-2 text-xs font-medium px-3 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                data-tour={`${module.id}-tab`}
              >
                <module.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{module.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          {availableModules.map((module) => {
            const ModuleComponent = module.component;
            
            return (
              <TabsContent key={module.id} value={module.id} className="space-y-6">
                {/* Module Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="p-2 rounded-lg bg-primary/10 border-primary/20">
                    <module.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{module.label}</h2>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                </div>

                {/* Module Content */}
                <ModuleComponent 
                  userRole={projectScope.scope === "single" ? "project-manager" : user?.role || "executive"}
                  projectData={projectScope}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </>
  );
} 