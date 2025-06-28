"use client";

/**
 * PX Dashboard - Project Executive Dashboard (Enhanced with Comprehensive Cards and Charts)
 *
 * This dashboard provides a comprehensive view of project metrics specifically designed
 * for Project Executives. It includes detailed cards with comprehensive data visualizations,
 * financial forecasting, schedule tracking, and AI-driven insights.
 *
 * Features:
 * - Comprehensive cards with detailed project data and charts
 * - Data integration from Tropical World Nursery project
 * - Interactive project filtering and drill-down visualizations
 * - Portfolio-level metrics and insights with charts
 * - Real-time performance tracking
 * - AI-powered insights and recommendations
 * - Responsive design with hover interactions
 *
 * @author HB Report Development Team
 * @version 4.1.0
 * @since 2024-12-19
 * @updated 2025-06-17 - Enhanced with charts using recharts
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DollarSign,
  Calendar,
  Building,
  ChevronDown,
  ChevronUp,
  XCircle,
  Wrench,
  PiggyBank,
  Target,
  Shield,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Import data from JSON files
import pxDashboardData from "@/data/px-dashboard-data.json";

/**
 * Complete Tropical World Nursery Project Data
 * Source: Financial Forecast Memo dated 6.5.25
 * Project No. 23-435-01
 */
const TROPICAL_WORLD_DATA = {
  projectNo: "23-435-01",
  projectName: "Tropical World Nursery",
  pm: "Andrew/Boris",
  superintendent: "Fred Mangum",
  contractType: "GMP",
  projectType: "New",
  hbSdiDate: "10/29/2024",
  nocDate: "10/14/2024",
  memoDate: "6.5.25",

  schedule: {
    originalContractCompletion: "5/11/2026",
    revisedContractCompletion: "7/15/2026",
    currentCompletionDate: "7/15/2026",
    currentScheduleStartDate: "10/29/2024",
    approvedDays: 45,
    currentDamageCosts: 0.0,
    delayDescription: "2 months, 5 days delay",
    masterPermitApproved: "2/27/2025",
  },

  financial: {
    originalContractValue: 57235491.0,
    currentApprovedValue: 55966743.24,
    originalCost: 54914477.9,
    currentCostToComplete: 53692071.24,
    originalProfit: 2321013.1,
    originalProfitPercent: 4.0,
    currentProfit: 2274672.0,
    buyoutSavings: 656884.85,
    buyoutSavingsPercent: 1.17,
    potentialTotalProfit: 2931556.85,
    potentialTotalProfitPercent: 5.24,
    previousMonthPotentialProfit: 2905496.54,
  },

  generalConditions: {
    originalEstimate: 2879047.2,
    estimateAtCompletion: 2501859.69,
    varianceFromOriginal: 378187.51,
    variancePercent: 0.68,
  },

  contingencies: {
    originalContingency: 700000.0,
    currentContingency: 663327.93,
    damageLds: 3500.0,
    damageClauseDescription: "$3,500.00 per month, per phase",
  },

  profitForecast: {
    status: "Project is underway and buyout is at 99% complete.",
    buyoutCompletion: 99,
    remainingItems: ["brick pavers", "expansion joint covers", "misc. site furniture"],
    changeOrdersStatus: "Change Orders are profitable.",
  },

  problemsExposures: {
    schedule: {
      status: "Master permit approved on 2.27.25. Updated schedule shows a 2 month, 5day delay.",
      issues: ["2 month, 5 day delay", "Master permit approval delay"],
    },
    budget: {
      status: "On Budget. General condition profit variance improved.",
      issues: [],
    },
    payment: {
      status: "Payments are current.",
      issues: [],
    },
    safety: {
      status: "No problems/exposures as of yet.",
      issues: [],
    },
    riskManagement: {
      status: "Tracking potential issues with Tariffs. Price increases anticipated.",
      issues: ["Tariff-related price increases", "Material cost volatility"],
      affectedMaterials: ["lumber", "appliances", "cement", "steel", "aluminum"],
    },
    rfiLog: {
      status: "15 RFI'S open out of 118.",
      openRfis: 15,
      totalRfis: 118,
      completionRate: ((118 - 15) / 118) * 100,
    },
    criticalIssues: {
      status: "Dealing with a few design errors. Fire Department requested additional holding tank.",
      issues: [
        "Design errors (not affecting critical path)",
        "Fire Department requested additional holding tank",
        "Latite Roofing holding up approvals to start LWIC",
        "Default letter issued on 6.4",
      ],
    },
  },

  changeOrders: {
    totalValue: 1250000.0,
    primeContractValue: 55966743.24,
    changeOrderRatio: 2.23,
    submitted: 8,
    approved: 6,
    pending: 2,
    rejected: 1,
    pendingApproval: 3,
    pendingSubmission: 4,
    orders: [
      {
        id: "CO-001",
        description: "Additional HVAC modifications",
        value: 185000,
        status: "approved",
        submittedDate: "2024-11-15",
        approvedDate: "2024-12-01",
      },
      {
        id: "CO-002",
        description: "Site drainage improvements",
        value: 95000,
        status: "approved",
        submittedDate: "2024-10-20",
        approvedDate: "2024-11-05",
      },
      {
        id: "CO-003",
        description: "Electrical panel upgrades",
        value: 125000,
        status: "pending",
        submittedDate: "2024-12-10",
      },
      {
        id: "CO-004",
        description: "Landscape modifications",
        value: 75000,
        status: "pending",
        submittedDate: "2024-12-05",
      },
      {
        id: "CO-005",
        description: "Fire sprinkler additions",
        value: 220000,
        status: "approved",
        submittedDate: "2024-09-15",
        approvedDate: "2024-10-01",
      },
    ],
  },

  submittals: {
    totalSubmittals: 156,
    received: 142,
    reviewed: 128,
    approved: 115,
    rejected: 8,
    pending: 13,
    onSchedule: 89,
    delayed: 39,
    averageReviewTime: 8.5,
    scheduleCompliance: 73.2,
    criticalPath: 5,
    recentSubmittals: [
      {
        id: "SUB-145",
        description: "Roofing materials",
        status: "approved",
        receivedDate: "2024-12-01",
        reviewedDate: "2024-12-08",
        scheduledDate: "2024-11-28",
        daysLate: 3,
      },
      {
        id: "SUB-146",
        description: "HVAC equipment specs",
        status: "pending",
        receivedDate: "2024-12-10",
        scheduledDate: "2024-12-05",
        daysLate: 5,
      },
      {
        id: "SUB-147",
        description: "Electrical fixtures",
        status: "reviewed",
        receivedDate: "2024-12-12",
        reviewedDate: "2024-12-15",
        scheduledDate: "2024-12-10",
        daysLate: 2,
      },
    ],
  },

  rfis: {
    totalRfis: 118,
    open: 15,
    closed: 103,
    averageClosureTime: 12.3,
    costImpact: 85000.0,
    scheduleImpact: 18,
    byCategory: {
      design: 45,
      coordination: 32,
      clarification: 28,
      specification: 13,
    },
    recentRfis: [
      {
        id: "RFI-115",
        description: "Foundation detail clarification",
        status: "open",
        submittedDate: "2024-12-08",
        category: "design",
        daysOpen: 8,
      },
      {
        id: "RFI-116",
        description: "HVAC coordination with structure",
        status: "open",
        submittedDate: "2024-12-05",
        category: "coordination",
        daysOpen: 11,
      },
      {
        id: "RFI-117",
        description: "Electrical panel specifications",
        status: "closed",
        submittedDate: "2024-11-20",
        closedDate: "2024-12-02",
        category: "specification",
        closureTime: 12,
      },
    ],
    performance: {
      grade: "B+",
      score: 78.5,
      benchmarkComparison: "Above industry average",
    },
  },
};

/**
 * Mock data for other projects
 */
const MOCK_PROJECTS_DATA = [
  {
    id: "23-435-01",
    name: "Tropical World Nursery",
    data: TROPICAL_WORLD_DATA,
  },
  {
    id: "24-102-03",
    name: "Metro Office Complex",
    data: {
      projectNo: "24-102-03",
      projectName: "Metro Office Complex",
      pm: "Sarah Wilson",
      superintendent: "Mike Johnson",
      contractType: "Lump Sum",
      projectType: "Renovation",
      financial: {
        originalContractValue: 45000000.0,
        currentApprovedValue: 44500000.0,
        currentProfit: 1800000.0,
        potentialTotalProfitPercent: 4.2,
        originalProfit: 1750000.0,
        buyoutSavings: 125000.0,
      },
      schedule: {
        delayDays: 0,
        onSchedule: true,
        originalContractCompletion: "8/15/2025",
        currentCompletionDate: "8/15/2025",
      },
      status: {
        buyoutCompletion: 85,
        openRfis: 8,
        totalRfis: 95,
      },
      generalConditions: {
        originalEstimate: 1200000.0,
        estimateAtCompletion: 1150000.0,
        varianceFromOriginal: 50000.0,
        variancePercent: 4.17,
      },
      contingencies: {
        originalContingency: 450000.0,
        currentContingency: 425000.0,
      },
      changeOrders: {
        totalValue: 890000.0,
        primeContractValue: 44500000.0,
        changeOrderRatio: 2.0,
        approved: 4,
        pending: 1,
        rejected: 0,
      },
      submittals: {
        totalSubmittals: 89,
        approved: 76,
        pending: 8,
        scheduleCompliance: 85.4,
        averageReviewTime: 6.2,
      },
      rfis: {
        totalRfis: 95,
        open: 8,
        closed: 87,
        averageClosureTime: 9.8,
        costImpact: 45000.0,
        performance: { grade: "A-", score: 85.2 },
      },
    },
  },
  {
    id: "24-205-07",
    name: "Panther Tower South",
    data: {
      projectNo: "24-205-07",
      projectName: "Panther Tower South",
      pm: "David Chen",
      superintendent: "Robert Martinez",
      contractType: "GMP",
      projectType: "New",
      financial: {
        originalContractValue: 78000000.0,
        currentApprovedValue: 79200000.0,
        currentProfit: 3500000.0,
        potentialTotalProfitPercent: 4.8,
        originalProfit: 3200000.0,
        buyoutSavings: 450000.0,
      },
      schedule: {
        delayDays: 15,
        onSchedule: false,
        originalContractCompletion: "12/20/2025",
        currentCompletionDate: "1/10/2026",
      },
      status: {
        buyoutCompletion: 92,
        openRfis: 12,
        totalRfis: 156,
      },
      generalConditions: {
        originalEstimate: 2100000.0,
        estimateAtCompletion: 2050000.0,
        varianceFromOriginal: 50000.0,
        variancePercent: 2.38,
      },
      contingencies: {
        originalContingency: 780000.0,
        currentContingency: 745000.0,
      },
      changeOrders: {
        totalValue: 1850000.0,
        primeContractValue: 79200000.0,
        changeOrderRatio: 2.34,
        approved: 7,
        pending: 3,
        rejected: 1,
      },
      submittals: {
        totalSubmittals: 203,
        approved: 165,
        pending: 18,
        scheduleCompliance: 68.9,
        averageReviewTime: 11.4,
      },
      rfis: {
        totalRfis: 156,
        open: 12,
        closed: 144,
        averageClosureTime: 14.2,
        costImpact: 125000.0,
        performance: { grade: "B", score: 72.8 },
      },
    },
  },
];

const CURRENT_PERIOD = "June 2025";

// Color palette for charts
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// Card Components with Chart Enhancements
const ProjectOverviewCard = React.memo<{ selectedProject: string | null }>(
  ({ selectedProject }) => {
    const projectData = useMemo(() => {
      if (selectedProject) {
        const project = MOCK_PROJECTS_DATA.find((p) => p.id === selectedProject);
        return project?.data || null;
      }
      return null;
    }, [selectedProject]);

    const chartData = useMemo(() => {
      if (!projectData) {
        return MOCK_PROJECTS_DATA.map((p) => ({
          name: p.name,
          projects: 1,
        }));
      }
      return [
        { name: "PM", value: 1 },
        { name: "Superintendent", value: 1 },
        { name: "Contract Type", value: 1 },
        { name: "Project Type", value: 1 },
      ];
    }, [projectData]);

    if (!selectedProject || !projectData) {
      return (
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Building className="h-4 w-4" />
              Project Overview
              <Badge variant="outline" className="text-xs">
                All Projects
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="projects" fill={COLORS[0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">
                Select a specific project to view details
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {MOCK_PROJECTS_DATA.length} projects available
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building className="h-4 w-4" />
            Project Overview
            <Badge variant="secondary" className="text-xs">
              {projectData.projectNo}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg text-blue-600">
                {projectData.projectName}
              </h3>
              <p className="text-sm text-gray-600">
                Project No. {projectData.projectNo}
              </p>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="font-medium text-gray-700">PM</div>
                      <div className="text-blue-600">{projectData.pm}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Project Manager: {projectData.pm}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="font-medium text-gray-700">
                        Superintendent
                      </div>
                      <div className="text-blue-600">
                        {projectData.superintendent}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Superintendent: {projectData.superintendent}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="font-medium text-gray-700">
                        Contract Type
                      </div>
                      <div className="text-blue-600">
                        {projectData.contractType}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Contract Type: {projectData.contractType}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="font-medium text-gray-700">
                        Project Type
                      </div>
                      <div className="text-blue-600">{projectData.projectType}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Project Type: {projectData.projectType}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {projectData.hbSdiDate && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="font-medium text-gray-700">
                          HB SDI Date
                        </div>
                        <div className="text-blue-600">{projectData.hbSdiDate}</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>HB SDI Date: {projectData.hbSdiDate}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {projectData.nocDate && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="font-medium text-gray-700">NOC Date</div>
                        <div className="text-blue-600">{projectData.nocDate}</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Notice of Commencement Date: {projectData.nocDate}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

const ScheduleOverviewCard = React.memo<{ selectedProject: string | null }>(
  ({ selectedProject }) => {
    const scheduleData = useMemo(() => {
      if (selectedProject) {
        const project = MOCK_PROJECTS_DATA.find((p) => p.id === selectedProject);
        return project?.data.schedule || null;
      }

      const projects = MOCK_PROJECTS_DATA.filter((p) => p.data.schedule);
      const totalDelayDays = projects.reduce((sum, p) => {
        if (p.id === "23-435-01") return sum + 65;
        return sum + (p.data.schedule?.delayDays || 0);
      }, 0);
      const onTimeProjects = projects.filter(
        (p) => p.data.schedule?.onSchedule !== false && p.id !== "23-435-01",
      ).length;

      return {
        isAggregate: true,
        averageDelay: Math.round(totalDelayDays / projects.length),
        onTimePercentage: Math.round((onTimeProjects / projects.length) * 100),
        totalProjects: projects.length,
      };
    }, [selectedProject]);

    const chartData = useMemo(() => {
      if (selectedProject && !scheduleData?.isAggregate) {
        return [
          { name: "Approved Days", value: scheduleData?.approvedDays || 0 },
          {
            name: "Delay Days",
            value: selectedProject === "23-435-01" ? 65 : scheduleData?.delayDays || 0,
          },
        ];
      }
      return [
        { name: "On Time", value: scheduleData?.onTimePercentage || 0 },
        { name: "Delayed", value: 100 - (scheduleData?.onTimePercentage || 0) },
      ];
    }, [scheduleData, selectedProject]);

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Overview
            {selectedProject === "23-435-01" && (
              <Badge variant="destructive" className="text-xs">
                Delayed
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) =>
                    `${name}: ${value}${selectedProject ? " days" : "%"}`
                  }
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {selectedProject && !scheduleData?.isAggregate ? (
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">65 days</div>
                <div className="text-xs text-gray-500">Total Delay</div>
                <div className="text-xs text-red-600 mt-1">2 months, 5 days</div>
              </div>

              <div className="space-y-2 text-xs">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-between cursor-pointer">
                        <span>Original Completion:</span>
                        <span className="font-mono">
                          {scheduleData?.originalContractCompletion || "N/A"}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Original Contract Completion Date</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-between cursor-pointer">
                        <span>Revised Completion:</span>
                        <span className="font-mono">
                          {scheduleData?.revisedContractCompletion || "N/A"}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Revised Contract Completion (Substantial)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="flex justify-between">
                  <span>Current Completion:</span>
                  <span className="font-mono">
                    {scheduleData?.currentCompletionDate || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Schedule Start:</span>
                  <span className="font-mono">
                    {scheduleData?.currentScheduleStartDate || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Approved Days:</span>
                  <span className="font-mono">
                    {scheduleData?.approvedDays || 0} working days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Damage Costs:</span>
                  <span className="font-mono text-green-600">
                    ${scheduleData?.currentDamageCosts?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>

              {selectedProject === "23-435-01" && (
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-600">
                    <strong>Master Permit:</strong> Approved{" "}
                    {TROPICAL_WORLD_DATA.schedule.masterPermitApproved}
                  </div>
                  <div className="text-xs text-red-600 mt-1">
                    <strong>Delay Cause:</strong> Master permit approval delay
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {scheduleData?.onTimePercentage || 0}%
                </div>
                <div className="text-xs text-gray-500">On Schedule</div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Average Delay:</span>
                  <span className="font-mono">{scheduleData?.averageDelay || 0} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Projects:</span>
                  <span className="font-mono">{scheduleData?.totalProjects || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Projects On Time:</span>
                  <span className="font-mono">
                    {Math.round(
                      ((scheduleData?.onTimePercentage || 0) / 100) *
                        (scheduleData?.totalProjects || 0),
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
);

const FinancialOverviewCard = React.memo<{ selectedProject: string | null }>(
  ({ selectedProject }) => {
    const [activeView, setActiveView] = useState<"summary" | "details">("summary");

    const financialData = useMemo(() => {
      if (selectedProject) {
        const project = MOCK_PROJECTS_DATA.find((p) => p.id === selectedProject);
        return project?.data.financial || null;
      }

      const totalOriginalValue = MOCK_PROJECTS_DATA.reduce(
        (sum, p) => sum + (p.data.financial?.originalContractValue || 0),
        0,
      );
      const totalCurrentValue = MOCK_PROJECTS_DATA.reduce(
        (sum, p) => sum + (p.data.financial?.currentApprovedValue || 0),
        0,
      );
      const totalCurrentProfit = MOCK_PROJECTS_DATA.reduce(
        (sum, p) => sum + (p.data.financial?.currentProfit || 0),
        0,
      );
      const totalOriginalProfit = MOCK_PROJECTS_DATA.reduce(
        (sum, p) => sum + (p.data.financial?.originalProfit || 0),
        0,
      );
      const totalBuyoutSavings = MOCK_PROJECTS_DATA.reduce(
        (sum, p) => sum + (p.data.financial?.buyoutSavings || 0),
        0,
      );

      return {
        isAggregate: true,
        originalContractValue: totalOriginalValue,
        currentApprovedValue: totalCurrentValue,
        currentProfit: totalCurrentProfit,
        originalProfit: totalOriginalProfit,
        buyoutSavings: totalBuyoutSavings,
        potentialTotalProfitPercent: (totalCurrentProfit / totalCurrentValue) * 100,
        buyoutSavingsPercent: (totalBuyoutSavings / totalOriginalValue) * 100,
      };
    }, [selectedProject]);

    const chartData = useMemo(() => {
      if (selectedProject && !financialData?.isAggregate) {
        return [
          {
            name: "Original Contract",
            value: financialData?.originalContractValue || 0,
          },
          {
            name: "Current Approved",
            value: financialData?.currentApprovedValue || 0,
          },
          { name: "Current Profit", value: financialData?.currentProfit || 0 },
          { name: "Buyout Savings", value: financialData?.buyoutSavings || 0 },
        ];
      }
      return MOCK_PROJECTS_DATA.map((p) => ({
        name: p.name,
        profitMargin: p.data.financial?.potentialTotalProfitPercent || 0,
      }));
    }, [financialData, selectedProject]);

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial Overview
            {selectedProject === "23-435-01" && (
              <Badge variant="secondary" className="text-xs">
                Tropical World
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs
            value={activeView}
            onValueChange={(v) => setActiveView(v as "summary" | "details")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="summary" className="text-xs">
                Summary
              </TabsTrigger>
              <TabsTrigger value="details" className="text-xs">
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-3">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={(value) => `$${value / 1e6}M`} />
                    <RechartsTooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Bar
                      dataKey={selectedProject ? "value" : "profitMargin"}
                      fill={COLORS[0]}
                      name={selectedProject ? "Amount" : "Profit Margin (%)"}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-center p-2 bg-blue-50 rounded-lg cursor-pointer">
                        <div className="text-sm font-bold text-blue-600">
                          {formatCurrency(financialData?.currentApprovedValue || 0)}
                        </div>
                        <div className="text-xs text-gray-500">Contract Value</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Current Approved Contract Value</p>
                      {!financialData?.isAggregate && (
                        <p className="text-xs">
                          Original:{" "}
                          {formatCurrency(financialData?.originalContractValue || 0)}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-center p-2 bg-green-50 rounded-lg cursor-pointer">
                        <div className="text-sm font-bold text-green-600">
                          {formatCurrency(financialData?.currentProfit || 0)}
                        </div>
                        <div className="text-xs text-gray-500">Current Profit</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Current Profit Amount</p>
                      {!financialData?.isAggregate && (
                        <p className="text-xs">
                          Original: {formatCurrency(financialData?.originalProfit || 0)}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {financialData?.potentialTotalProfitPercent?.toFixed(2) || "0.00"}%
                </div>
                <div className="text-xs text-gray-500">Profit Margin</div>
              </div>

              {financialData?.buyoutSavings && (
                <div className="text-center p-2 bg-yellow-50 rounded-lg">
                  <div className="text-sm font-bold text-yellow-600">
                    {formatCurrency(financialData.buyoutSavings)} (
                    {financialData.buyoutSavingsPercent?.toFixed(2)}%)
                  </div>
                  <div className="text-xs text-gray-500">Buyout Savings</div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-2">
              {selectedProject && !financialData?.isAggregate ? (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Original Contract:</span>
                    <span className="font-mono">
                      {formatCurrency(financialData?.originalContractValue || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Approved:</span>
                    <span className="font-mono">
                      {formatCurrency(financialData?.currentApprovedValue || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Original Cost:</span>
                    <span className="font-mono">
                      {formatCurrency((financialData as any)?.originalCost || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost to Complete:</span>
                    <span className="font-mono">
                      {formatCurrency((financialData as any)?.currentCostToComplete || 0)}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-green-600">
                      <span>Buyout Savings:</span>
                      <span className="font-mono">
                        {formatCurrency(financialData?.buyoutSavings || 0)} (
                        {financialData?.buyoutSavingsPercent?.toFixed(2)}%)
                      </span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Potential Total:</span>
                      <span className="font-mono">
                        {formatCurrency((financialData as any)?.potentialTotalProfit || 0)}
                      </span>
                    </div>
                    {selectedProject === "23-435-01" && (
                      <div className="flex justify-between text-gray-600">
                        <span>Previous Month:</span>
                        <span className="font-mono">
                          {formatCurrency(
                            TROPICAL_WORLD_DATA.financial.previousMonthPotentialProfit,
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 text-center py-4">
                  {financialData?.isAggregate
                    ? "Aggregate financial data across all projects"
                    : "Select a specific project to view detailed financial breakdown"}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  },
);

const GeneralConditionsCard = React.memo<{ selectedProject: string | null }>(
  ({ selectedProject }) => {
    const gcData = useMemo(() => {
      if (selectedProject) {
        const project = MOCK_PROJECTS_DATA.find((p) => p.id === selectedProject);
        return project?.data.generalConditions || null;
      }

      const projects = MOCK_PROJECTS_DATA.filter((p) => p.data.generalConditions);
      const totalOriginal = projects.reduce(
        (sum, p) => sum + (p.data.generalConditions?.originalEstimate || 0),
        0,
      );
      const totalEAC = projects.reduce(
        (sum, p) => sum + (p.data.generalConditions?.estimateAtCompletion || 0),
        0,
      );
      const totalVariance = projects.reduce(
        (sum, p) => sum + (p.data.generalConditions?.varianceFromOriginal || 0),
        0,
      );

      return {
        isAggregate: true,
        originalEstimate: totalOriginal,
        estimateAtCompletion: totalEAC,
        varianceFromOriginal: totalVariance,
        variancePercent: (totalVariance / totalOriginal) * 100,
        projectCount: projects.length,
      };
    }, [selectedProject]);

    const getVarianceColor = (variance: number) => {
      return variance > 0 ? "text-green-600" : "text-red-600";
    };

    const chartData = useMemo(() => {
      if (selectedProject) {
        return [
          { name: "Original Estimate", value: gcData?.originalEstimate || 0 },
          {
            name: "Estimate at Completion",
            value: gcData?.estimateAtCompletion || 0,
          },
        ];
      }
      return [
        { name: "Original Estimate", value: gcData?.originalEstimate || 0 },
        { name: "Variance", value: Math.abs(gcData?.varianceFromOriginal || 0) },
      ];
    }, [gcData, selectedProject]);

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            General Conditions
            {gcData?.variancePercent && gcData.variancePercent > 0 && (
              <Badge variant="outline" className="text-xs text-green-600">
                Improved
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(value) => `$${value / 1e6}M`} />
                <RechartsTooltip
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Bar dataKey="value" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <div className="text-center">
              <div
                className={cn(
                  "text-2xl font-bold",
                  getVarianceColor(gcData?.varianceFromOriginal || 0),
                )}
              >
                {gcData?.variancePercent?.toFixed(2) || "0.00"}%
              </div>
              <div className="text-xs text-gray-500">Variance from Original</div>
              <div
                className={cn(
                  "text-xs mt-1",
                  getVarianceColor(gcData?.varianceFromOriginal || 0),
                )}
              >
                {gcData?.varianceFromOriginal && gcData.varianceFromOriginal > 0
                  ? "+"
                  : ""}
                {formatCurrency(gcData?.varianceFromOriginal || 0)}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between cursor-pointer">
                      <span>Original Estimate:</span>
                      <span className="font-mono">
                        {formatCurrency(gcData?.originalEstimate || 0)}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Original General Conditions Estimate</p>
                    {gcData?.isAggregate && (
                      <p className="text-xs">Across {gcData.projectCount} projects</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between cursor-pointer">
                      <span>Estimate at Completion:</span>
                      <span className="font-mono">
                        {formatCurrency(gcData?.estimateAtCompletion || 0)}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current Estimate at Completion</p>
                    {gcData?.isAggregate && (
                      <p className="text-xs">Aggregate across all projects</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {selectedProject === "23-435-01" && (
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-600">
                  <strong>Notes:</strong> Variance improved due to Boris splitting time
                  with FC, executives reducing hours, APM reduced to one person.
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

const ContingenciesCard = React.memo<{ selectedProject: string | null }>(
  ({ selectedProject }) => {
    const contingencyData = useMemo(() => {
      if (selectedProject) {
        const project = MOCK_PROJECTS_DATA.find((p) => p.id === selectedProject);
        return project?.data.contingencies || null;
      }

      const projects = MOCK_PROJECTS_DATA.filter((p) => p.data.contingencies);
      const totalOriginal = projects.reduce(
        (sum, p) => sum + (p.data.contingencies?.originalContingency || 0),
        0,
      );
      const totalCurrent = projects.reduce(
        (sum, p) => sum + (p.data.contingencies?.currentContingency || 0),
        0,
      );

      return {
        isAggregate: true,
        originalContingency: totalOriginal,
        currentContingency: totalCurrent,
        utilizationPercent: ((totalOriginal - totalCurrent) / totalOriginal) * 100,
        projectCount: projects.length,
      };
    }, [selectedProject]);

    const utilizationPercent = contingencyData?.isAggregate
      ? contingencyData.utilizationPercent
      : (((contingencyData?.originalContingency || 0) -
          (contingencyData?.currentContingency || 0)) /
          (contingencyData?.originalContingency || 1)) *
        100;

    const chartData = useMemo(
      () => [
        { name: "Used", value: utilizationPercent },
        { name: "Remaining", value: 100 - utilizationPercent },
      ],
      [utilizationPercent],
    );

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <PiggyBank className="h-4 w-4" />
            Contingencies
            {utilizationPercent < 20 && (
              <Badge variant="outline" className="text-xs text-green-600">
                Low Usage
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {utilizationPercent?.toFixed(1) || "0.0"}%
              </div>
              <div className="text-xs text-gray-500">Utilized</div>
              <Progress value={utilizationPercent || 0} className="mt-2 h-2" />
            </div>

            <div className="space-y-2 text-xs">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between cursor-pointer">
                      <span>Original Contingency:</span>
                      <span className="font-mono">
                        {formatCurrency(contingencyData?.originalContingency || 0)}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Original Contingency Amount</p>
                    {contingencyData?.isAggregate && (
                      <p className="text-xs">
                        Across {contingencyData.projectCount} projects
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between cursor-pointer">
                      <span>Current Contingency:</span>
                      <span className="font-mono">
                        {formatCurrency(contingencyData?.currentContingency || 0)}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remaining Contingency Amount</p>
                    {contingencyData?.isAggregate && (
                      <p className="text-xs">Aggregate remaining balance</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex justify-between">
                <span>Amount Used:</span>
                <span className="font-mono text-red-600">
                  {formatCurrency(
                    (contingencyData?.originalContingency || 0) -
                      (contingencyData?.currentContingency || 0),
                  )}
                </span>
              </div>
            </div>

            {selectedProject === "23-435-01" && (
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-600">
                  <strong>Damage Clause/LD's:</strong>{" "}
                  {TROPICAL_WORLD_DATA.contingencies.damageClauseDescription}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

const ProfitForecastCard = React.memo<{ selectedProject: string | null }>(
  ({ selectedProject }) => {
    const forecastData = useMemo(() => {
      if (selectedProject === "23-435-01") {
        return TROPICAL_WORLD_DATA.profitForecast;
      }

      if (selectedProject) {
        const project = MOCK_PROJECTS_DATA.find((p) => p.id === selectedProject);
        return {
          status: "Project in progress",
          buyoutCompletion: project?.data.status?.buyoutCompletion || 0,
          remainingItems: ["Various items pending"],
          changeOrdersStatus: "Under review",
        };
      }

      const avgBuyout =
        MOCK_PROJECTS_DATA.reduce(
          (sum, p) =>
            sum +
            (p.data.status?.buyoutCompletion ||
              p.data.profitForecast?.buyoutCompletion ||
              0),
          0,
        ) / MOCK_PROJECTS_DATA.length;

      return {
        isAggregate: true,
        status: "Portfolio in progress",
        buyoutCompletion: Math.round(avgBuyout),
        projectCount: MOCK_PROJECTS_DATA.length,
      };
    }, [selectedProject]);

    const chartData = useMemo(
      () => [
        { name: "Completed", value: forecastData?.buyoutCompletion || 0 },
        {
          name: "Remaining",
          value: 100 - (forecastData?.buyoutCompletion || 0),
        },
      ],
      [forecastData],
    );

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Target className="h-4 w-4" />
            Profit Forecast Summary
            {forecastData?.buyoutCompletion >= 95 && (
              <Badge variant="outline" className="text-xs text-green-600">
                Near Complete
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {forecastData?.buyoutCompletion || 0}%
              </div>
              <div className="text-xs text-gray-500">Buyout Complete</div>
              <Progress
                value={forecastData?.buyoutCompletion || 0}
                className="mt-2 h-2"
              />
            </div>

            <div className="text-sm text-gray-700">
              <p>{forecastData?.status}</p>
            </div>

            {selectedProject === "23-435-01" && forecastData?.remainingItems && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-pointer">
                      <div className="text-xs font-medium text-gray-700 mb-2">
                        Remaining Items:
                      </div>
                      <div className="space-y-1">
                        {forecastData.remainingItems.map((item, index) => (
                          <div
                            key={index}
                            className="text-xs bg-yellow-50 p-2 rounded flex items-center gap-2"
                          >
                            <Clock className="h-3 w-3 text-yellow-600" />
                            <span className="capitalize">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Items pending completion for buyout</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {selectedProject === "23-435-01" && (
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                <CheckCircle className="h-3 w-3 inline mr-1" />
                {TROPICAL_WORLD_DATA.profitForecast.changeOrdersStatus}
              </div>
            )}

            {forecastData?.isAggregate && (
              <div className="text-xs text-gray-500 text-center">
                Average across {forecastData.projectCount} projects
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

const ProblemsExposuresCard = React.memo<{ selectedProject: string | null }>(
  ({ selectedProject }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const exposuresData = useMemo(() => {
      if (selectedProject === "23-435-01") {
        return TROPICAL_WORLD_DATA.problemsExposures;
      }

      return {
        isAggregate: true,
        summary: "Multiple projects with various risk factors",
        totalIssues: 8,
        criticalIssues: 2,
        projectCount: MOCK_PROJECTS_DATA.length,
      };
    }, [selectedProject]);

    const getTotalIssues = () => {
      if (exposuresData.isAggregate) return exposuresData.totalIssues;

      let count = 0;
      if (exposuresData.schedule?.issues?.length)
        count += exposuresData.schedule.issues.length;
      if (exposuresData.riskManagement?.issues?.length)
        count += exposuresData.riskManagement.issues.length;
      if (exposuresData.criticalIssues?.issues?.length)
        count += exposuresData.criticalIssues.issues.length;
      return count;
    };

    const chartData = useMemo(() => {
      if (selectedProject === "23-435-01") {
        return [
          {
            name: "Schedule Issues",
            value: exposuresData.schedule?.issues?.length || 0,
          },
          {
            name: "Risk Management",
            value: exposuresData.riskManagement?.issues?.length || 0,
          },
          {
            name: "Critical Issues",
            value: exposuresData.criticalIssues?.issues?.length || 0,
          },
          { name: "Open RFIs", value: exposuresData.rfiLog?.openRfis || 0 },
        ];
      }
      return [
        { name: "Total Issues", value: exposuresData.totalIssues || 0 },
        { name: "Critical Issues", value: exposuresData.criticalIssues || 0 },
      ];
    }, [exposuresData, selectedProject]);

    return (
      <Card className="hover:shadow-md transition-shadow duration-200 col-span-full lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Problems/Exposures Overview
            <Badge variant="outline" className="text-xs">
              {getTotalIssues()} Issues
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="value" fill={COLORS[3]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-2 bg-red-50 rounded-lg">
                <div className="text-lg font-bold text-red-600">
                  {getTotalIssues()}
                </div>
                <div className="text-xs text-gray-500">Total Issues</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-600">
                  {exposuresData.isAggregate
                    ? exposuresData.criticalIssues
                    : exposuresData.criticalIssues?.issues?.length || 0}
                </div>
                <div className="text-xs text-gray-500">Critical</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">0</div>
                <div className="text-xs text-gray-500">Safety Issues</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {selectedProject === "23-435-01"
                    ? exposuresData.rfiLog?.openRfis
                    : "N/A"}
                </div>
                <div className="text-xs text-gray-500">Open RFIs</div>
              </div>
            </div>

            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  {isExpanded ? "Hide Details" : "Show Details"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                {selectedProject === "23-435-01" ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-700">Schedule</span>
                      </div>
                      <p className="text-xs text-gray-700">
                        {exposuresData.schedule?.status}
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-700">Budget</span>
                      </div>
                      <p className="text-xs text-gray-700">
                        {exposuresData.budget?.status}
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-700">Payment</span>
                      </div>
                      <p className="text-xs text-gray-700">
                        {exposuresData.payment?.status}
                      </p>
                    </div>

                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-700">
                          Risk Management
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">
                        {exposuresData.riskManagement?.status}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {exposuresData.riskManagement?.affectedMaterials?.map(
                          (material, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {material}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-700">RFI Log</span>
                      </div>
                      <p className="text-xs text-gray-700">
                        {exposuresData.rfiLog?.status}
                      </p>
                      <div className="mt-2">
                        <Progress
                          value={exposuresData.rfiLog?.completionRate}
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {exposuresData.rfiLog?.completionRate?.toFixed(1)}%
                          Complete
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-700">
                          Critical Issues
                        </span>
                      </div>
                      <div className="space-y-1">
                        {exposuresData.criticalIssues?.issues?.map(
                          (issue, index) => (
                            <div
                              key={index}
                              className="text-xs bg-white p-2 rounded border-l-2 border-red-300"
                            >
                              {issue}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      {exposuresData.isAggregate
                        ? `Aggregate risk data across ${exposuresData.projectCount} projects`
                        : "Select Tropical World Nursery for detailed problems/exposures breakdown"}
                    </p>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>
    );
  },
);

const ChangeOrderImpactsCard = React.memo<{ selectedProject: string | null }>(
  ({ selectedProject }) => {
    const changeOrderData = useMemo(() => {
      if (selectedProject) {
        const project = MOCK_PROJECTS_DATA.find((p) => p.id === selectedProject);
        return project?.data.changeOrders || null;
      }

      const projects = MOCK_PROJECTS_DATA.filter((p) => p.data.changeOrders);
      const totalValue = projects.reduce(
        (sum, p) => sum + (p.data.changeOrders?.totalValue || 0),
        0,
      );
      const totalContractValue = projects.reduce(
        (sum, p) => sum + (p.data.changeOrders?.primeContractValue || 0),
        0,
      );
      const totalApproved = projects.reduce(
        (sum, p) => sum + (p.data.changeOrders?.approved || 0),
        0,
      );
      const totalPending = projects.reduce(
        (sum, p) => sum + (p.data.changeOrders?.pending || 0),
        0,
      );
      const totalRejected = projects.reduce(
        (sum, p) => sum + (p.data.changeOrders?.rejected || 0),
        0,
      );

      return {
        isAggregate: true,
        totalValue,
        changeOrderRatio: (totalValue / totalContractValue) * 100,
        approved: totalApproved,
        pending: totalPending,
        rejected: totalRejected,
        projectCount: projects.length,
      };
    }, [selectedProject]);

    const getGradeColor = (ratio: number) => {
      if (ratio <= 2.0) return "text-green-600 bg-green-50";
      if (ratio <= 3.0) return "text-yellow-600 bg-yellow-50";
      return "text-red-600 bg-red-50";
    };

    const getGrade = (ratio: number) => {
      if (ratio <= 1.5) return "A+";
      if (ratio <= 2.0) return "A";
      if (ratio <= 2.5) return "B+";
      if (ratio <= 3.0) return "B";
      if (ratio <= 4.0) return "C";
      return "D";
    };

    const chartData = useMemo(
      () => [
        { name: "Approved", value: changeOrderData?.approved || 0 },
        {
          name: "Pending",
          value:
            (changeOrderData as any)?.pendingApproval ||
            changeOrderData?.pending ||
            0,
        },
        { name: "Rejected", value: changeOrderData?.rejected || 0 },
      ],
      [changeOrderData],
    );

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Change Order Impacts
            <Badge variant="outline" className="text-xs">
              {getGrade(changeOrderData?.changeOrderRatio || 0)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <div
              className={cn(
                "text-center p-3 rounded-lg",
                getGradeColor(changeOrderData?.changeOrderRatio || 0),
              )}
            >
              <div className="text-2xl font-bold">
                {changeOrderData?.changeOrderRatio?.toFixed(2) || "0.00"}%
              </div>
              <div className="text-xs">CO to Contract Ratio</div>
              <div className="text-xs mt-1">
                {formatCurrency(changeOrderData?.totalValue || 0)} total
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-green-50 rounded cursor-pointer">
                      <div className="font-bold text-green-600">
                        {changeOrderData?.approved || 0}
                      </div>
                      <div className="text-gray-500">Approved</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Change Orders Approved</p>
                    {changeOrderData?.isAggregate && (
                      <p className="text-xs">Across all projects</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-yellow-50 rounded cursor-pointer">
                      <div className="font-bold text-yellow-600">
                        {(changeOrderData as any)?.pendingApproval ||
                          changeOrderData?.pending ||
                          0}
                      </div>
                      <div className="text-gray-500">Pending</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Change Orders Pending Approval</p>
                    {selectedProject === "23-435-01" && (
                      <p className="text-xs">Requiring approval</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-red-50 rounded cursor-pointer">
                      <div className="font-bold text-red-600">
                        {changeOrderData?.rejected || 0}
                      </div>
                      <div className="text-gray-500">Rejected</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Change Orders Rejected</p>
                    {changeOrderData?.isAggregate && (
                      <p className="text-xs">Total across portfolio</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {selectedProject === "23-435-01" &&
              (changeOrderData as any)?.pendingSubmission && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-xs">
                    <span>Pending Submission:</span>
                    <span className="font-medium text-blue-600">
                      {(changeOrderData as any).pendingSubmission}
                    </span>
                  </div>
                </div>
              )}

            {selectedProject === "23-435-01" &&
              (changeOrderData as any)?.orders && (
                <div className="pt-2 border-t">
                  <div className="text-xs font-medium text-gray-700 mb-2">
                    Recent Change Orders:
                  </div>
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {(changeOrderData as any).orders
                      .slice(0, 3)
                      .map((order: any, index: number) => (
                        <div
                          key={index}
                          className="text-xs bg-gray-50 p-2 rounded"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium truncate">{order.id}</span>
                            <Badge
                              variant={
                                order.status === "approved"
                                  ? "default"
                                  : order.status === "pending"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs ml-1"
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div className="text-gray-600 truncate">
                            {order.description}
                          </div>
                          <div className="text-blue-600 font-medium">
                            {formatCurrency(order.value)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

const SubmittalAnalysisCard = React.memo<{ selectedProject: string | null }>(
  ({ selectedProject }) => {
    const submittalData = useMemo(() => {
      if (selectedProject) {
        const project = MOCK_PROJECTS_DATA.find((p) => p.id === selectedProject);
        return project?.data.submittals || null;
      }

      const projects = MOCK_PROJECTS_DATA.filter((p) => p.data.submittals);
      const totalSubmittals = projects.reduce(
        (sum, p) => sum + (p.data.submittals?.totalSubmittals || 0),
        0,
      );
      const totalApproved = projects.reduce(
        (sum, p) => sum + (p.data.submittals?.approved || 0),
        0,
      );
      const totalPending = projects.reduce(
        (sum, p) => sum + (p.data.submittals?.pending || 0),
        0,
      );
      const avgCompliance =
        projects.reduce(
          (sum, p) => sum + (p.data.submittals?.scheduleCompliance || 0),
          0,
        ) / projects.length;
      const avgReviewTime =
        projects.reduce(
          (sum, p) => sum + (p.data.submittals?.averageReviewTime || 0),
          0,
        ) / projects.length;

      return {
        isAggregate: true,
        totalSubmittals,
        approved: totalApproved,
        pending: totalPending,
        scheduleCompliance: avgCompliance,
        averageReviewTime: avgReviewTime,
        projectCount: projects.length,
      };
    }, [selectedProject]);

    const getComplianceGrade = (compliance: number) => {
      if (compliance >= 90) return "A+";
      if (compliance >= 85) return "A";
      if (compliance >= 80) return "B+";
      if (compliance >= 75) return "B";
      if (compliance >= 70) return "C+";
      return "C";
    };

    const getComplianceColor = (compliance: number) => {
      if (compliance >= 85) return "text-green-600 bg-green-50";
      if (compliance >= 75) return "text-yellow-600 bg-yellow-50";
      return "text-red-600 bg-red-50";
    };

    const chartData = useMemo(() => {
      if (selectedProject && !submittalData?.isAggregate) {
        return [
          { name: "Approved", value: submittalData?.approved || 0 },
          { name: "Pending", value: submittalData?.pending || 0 },
          { name: "Rejected", value: submittalData?.rejected || 0 },
        ];
      }
      return [
        {
          name: "Schedule Compliance",
          value: submittalData?.scheduleCompliance || 0,
        },
        {
          name: "Non-Compliant",
          value: 100 - (submittalData?.scheduleCompliance || 0),
        },
      ];
    }, [submittalData, selectedProject]);

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Submittal Analysis
            <Badge variant="outline" className="text-xs">
              {getComplianceGrade(submittalData?.scheduleCompliance || 0)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) =>
                    `${name}: ${value}${selectedProject ? "" : "%"}`
                  }
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value) =>
                    selectedProject ? `${value}` : `${value}%`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <div
              className={cn(
                "text-center p-3 rounded-lg",
                getComplianceColor(submittalData?.scheduleCompliance || 0),
              )}
            >
              <div className="text-2xl font-bold">
                {submittalData?.scheduleCompliance?.toFixed(1) || "0.0"}%
              </div>
              <div className="text-xs">Schedule Compliance</div>
              <Progress
                value={submittalData?.scheduleCompliance || 0}
                className="mt-2 h-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-bold text-blue-600">
                  {submittalData?.totalSubmittals || 0}
                </div>
                <div className="text-gray-500">Total Submittals</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-bold text-green-600">
                  {submittalData?.approved || 0}
                </div>
                <div className="text-gray-500">Approved</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between cursor-pointer">
                      <span>Avg Review Time:</span>
                      <span className="font-mono">
                        {submittalData?.averageReviewTime?.toFixed(1) || "0.0"} days
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Average time from receipt to review completion</p>
                    {submittalData?.isAggregate && (
                      <p className="text-xs">
                        Across {submittalData.projectCount} projects
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex justify-between">
                <span>Pending Review:</span>
                <span className="font-mono text-yellow-600">
                  {submittalData?.pending || 0}
                </span>
              </div>

              {selectedProject === "23-435-01" &&
                (submittalData as any)?.onSchedule && (
                  <>
                    <div className="flex justify-between">
                      <span>On Schedule:</span>
                      <span className="font-mono text-green-600">
                        {(submittalData as any).onSchedule}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delayed:</span>
                      <span className="font-mono text-red-600">
                        {(submittalData as any).delayed}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical Path:</span>
                      <span className="font-mono text-orange-600">
                        {(submittalData as any).criticalPath}
                      </span>
                    </div>
                  </>
                )}
            </div>

            {selectedProject === "23-435-01" &&
              (submittalData as any)?.recentSubmittals && (
                <div className="pt-2 border-t">
                  <div className="text-xs font-medium text-gray-700 mb-2">
                    Recent Submittals:
                  </div>
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {(submittalData as any).recentSubmittals
                      .slice(0, 3)
                      .map((submittal: any, index: number) => (
                        <div
                          key={index}
                          className="text-xs bg-gray-50 p-2 rounded"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium truncate">
                              {submittal.id}
                            </span>
                            <Badge
                              variant={
                                submittal.status === "approved"
                                  ? "default"
                                  : submittal.status === "pending"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs ml-1"
                            >
                              {submittal.status}
                            </Badge>
                          </div>
                          <div className="text-gray-600 truncate">
                            {submittal.description}
                          </div>
                          {submittal.daysLate > 0 && (
                            <div className="text-red-600 text-xs">
                              {submittal.daysLate} days late
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

const RFIOverviewCard = React.memo<{ selectedProject: string | null }>(
  ({ selectedProject }) => {
    const rfiData = useMemo(() => {
      if (selectedProject) {
        const project = MOCK_PROJECTS_DATA.find((p) => p.id === selectedProject);
        return project?.data.rfis || null;
      }

      const projects = MOCK_PROJECTS_DATA.filter((p) => p.data.rfis);
      const totalRfis = projects.reduce(
        (sum, p) => sum + (p.data.rfis?.totalRfis || 0),
        0,
      );
      const totalOpen = projects.reduce(
        (sum, p) => sum + (p.data.rfis?.open || 0),
        0,
      );
      const totalClosed = projects.reduce(
        (sum, p) => sum + (p.data.rfis?.closed || 0),
        0,
      );
      const avgClosureTime =
        projects.reduce(
          (sum, p) => sum + (p.data.rfis?.averageClosureTime || 0),
          0,
        ) / projects.length;
      const totalCostImpact = projects.reduce(
        (sum, p) => sum + (p.data.rfis?.costImpact || 0),
        0,
      );
      const avgScore =
        projects.reduce(
          (sum, p) => sum + (p.data.rfis?.performance?.score || 0),
          0,
        ) / projects.length;

      return {
        isAggregate: true,
        totalRfis,
        open: totalOpen,
        closed: totalClosed,
        averageClosureTime: avgClosureTime,
        costImpact: totalCostImpact,
        performance: { score: avgScore },
        projectCount: projects.length,
      };
    }, [selectedProject]);

    const getPerformanceGrade = (score: number) => {
      if (score >= 90) return "A+";
      if (score >= 85) return "A";
      if (score >= 80) return "B+";
      if (score >= 75) return "B";
      if (score >= 70) return "C+";
      return "C";
    };

    const getPerformanceColor = (score: number) => {
      if (score >= 85) return "text-green-600 bg-green-50";
      if (score >= 75) return "text-yellow-600 bg-yellow-50";
      return "text-red-600 bg-red-50";
    };

    const closureRate = ((rfiData?.closed || 0) / (rfiData?.totalRfis || 1)) * 100;

    const chartData = useMemo(() => {
      if (selectedProject && !rfiData?.isAggregate) {
        return [
          { name: "Open", value: rfiData?.open || 0 },
          { name: "Closed", value: rfiData?.closed || 0 },
        ];
      }
      return [
        { name: "Open RFIs", value: rfiData?.open || 0 },
        { name: "Closed RFIs", value: rfiData?.closed || 0 },
      ];
    }, [rfiData, selectedProject]);

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            RFI Overview
            <Badge variant="outline" className="text-xs">
              {getPerformanceGrade(rfiData?.performance?.score || 0)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <div
              className={cn(
                "text-center p-3 rounded-lg",
                getPerformanceColor(rfiData?.performance?.score || 0),
              )}
            >
              <div className="text-2xl font-bold">
                {rfiData?.performance?.score?.toFixed(1) || "0.0"}
              </div>
              <div className="text-xs">Performance Score</div>
              <div className="text-xs mt-1">{closureRate.toFixed(1)}% closure rate</div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-bold text-blue-600">
                  {rfiData?.totalRfis || 0}
                </div>
                <div className="text-gray-500">Total RFIs</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="font-bold text-yellow-600">{rfiData?.open || 0}</div>
                <div className="text-gray-500">Open</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-bold text-green-600">
                  {rfiData?.closed || 0}
                </div>
                <div className="text-gray-500">Closed</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between cursor-pointer">
                      <span>Avg Closure Time:</span>
                      <span className="font-mono">
                        {rfiData?.averageClosureTime?.toFixed(1) || "0.0"} days
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Average time from RFI submission to closure</p>
                    {rfiData?.isAggregate && (
                      <p className="text-xs">Across {rfiData.projectCount} projects</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between cursor-pointer">
                      <span>Cost Impact:</span>
                      <span className="font-mono text-red-600">
                        {formatCurrency(rfiData?.costImpact || 0)}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total cost impact from RFI-related changes</p>
                    {rfiData?.isAggregate && (
                      <p className="text-xs">Aggregate across all projects</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {selectedProject === "23-435-01" &&
                (rfiData as any)?.scheduleImpact && (
                  <div className="flex justify-between">
                    <span>Schedule Impact:</span>
                    <span className="font-mono text-orange-600">
                      {(rfiData as any).scheduleImpact} days
                    </span>
                  </div>
                )}
            </div>

            {selectedProject === "23-435-01" && (rfiData as any)?.byCategory && (
              <div className="pt-2 border-t">
                <div className="text-xs font-medium text-gray-700 mb-2">
                  By Category:
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {Object.entries((rfiData as any).byCategory).map(
                    ([category, count]) => (
                      <div
                        key={category}
                        className="flex justify-between"
                      >
                        <span className="capitalize">{category}:</span>
                        <span className="font-mono">{count as number}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {selectedProject === "23-435-01" && (rfiData as any)?.recentRfis && (
              <div className="pt-2 border-t">
                <div className="text-xs font-medium text-gray-700 mb-2">
                  Recent RFIs:
                </div>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {(rfiData as any).recentRfis
                    .slice(0, 3)
                    .map((rfi: any, index: number) => (
                      <div
                        key={index}
                        className="text-xs bg-gray-50 p-2 rounded"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium truncate">{rfi.id}</span>
                          <Badge
                            variant={rfi.status === "closed" ? "default" : "secondary"}
                            className="text-xs ml-1"
                          >
                            {rfi.status}
                          </Badge>
                        </div>
                        <div className="text-gray-600 truncate">
                          {rfi.description}
                        </div>
                        <div className="text-blue-600 text-xs capitalize">
                          {rfi.category}
                        </div>
                        {rfi.status === "open" && (
                          <div className="text-red-600 text-xs">
                            {rfi.daysOpen} days open
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

const ProjectHealthCard = React.memo<{
  selectedProject: string | null;
  onProjectClick: (projectId: string) => void;
}>(({ selectedProject, onProjectClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculateHealthScore = useCallback((projectData: any) => {
    const profitMargin = projectData.financial?.potentialTotalProfitPercent || 0;
    const financialScore = Math.min(100, (profitMargin / 6) * 100);

    let scheduleScore = 90;
    if (
      projectData.schedule?.delayDays > 0 ||
      projectData.schedule?.onSchedule === false
    ) {
      scheduleScore = Math.max(50, 90 - (projectData.schedule?.delayDays || 30));
    }

    const buyoutCompletion =
      projectData.status?.buyoutCompletion ||
      projectData.profitForecast?.buyoutCompletion ||
      0;
    const executionScore = buyoutCompletion;

    const weightedScore =
      financialScore * 0.4 + scheduleScore * 0.35 + executionScore * 0.25;
    return Math.round(weightedScore);
  }, []);

  const overallHealth = useMemo(() => {
    if (selectedProject) {
      const project = MOCK_PROJECTS_DATA.find((p) => p.id === selectedProject);
      return project ? calculateHealthScore(project.data) : 85;
    }

    const totalScore = MOCK_PROJECTS_DATA.reduce((sum, project) => {
      return sum + calculateHealthScore(project.data);
    }, 0);

    return Math.round(totalScore / MOCK_PROJECTS_DATA.length);
  }, [selectedProject, calculateHealthScore]);

  const getHealthColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const chartData = useMemo(() => {
    if (selectedProject) {
      const project = MOCK_PROJECTS_DATA.find((p) => p.id === selectedProject);
      if (project) {
        const profitMargin =
          project.data.financial?.potentialTotalProfitPercent || 0;
        const financialScore = Math.min(100, (profitMargin / 6) * 100);
        let scheduleScore = 90;
        if (
          project.data.schedule?.delayDays > 0 ||
          project.data.schedule?.onSchedule === false
        ) {
          scheduleScore = Math.max(
            50,
            90 - (project.data.schedule?.delayDays || 30),
          );
        }
        const executionScore =
          project.data.status?.buyoutCompletion ||
          project.data.profitForecast?.buyoutCompletion ||
          0;
        return [
          { name: "Financial", value: financialScore },
          { name: "Schedule", value: scheduleScore },
          { name: "Execution", value: executionScore },
        ];
      }
    }
    return MOCK_PROJECTS_DATA.map((p) => ({
      name: p.name,
      healthScore: calculateHealthScore(p.data),
    }));
  }, [selectedProject, calculateHealthScore]);

  return (
    <Card className={cn("relative transition-all duration-200", getHealthColor(overallHealth))}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Project Health
          <Badge variant="outline" className="ml-auto">
            Pinned
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <RechartsTooltip />
              <Bar
                dataKey={selectedProject ? "value" : "healthScore"}
                fill={COLORS[0]}
                name="Score"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center space-y-4">
          <div>
            <p className="text-4xl font-bold">{overallHealth}</p>
            <p className="text-sm text-gray-600">Overall Score</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full"
          >
            {selectedProject ? "Change Project" : "View Projects"}
          </Button>

          {isExpanded && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-lg border z-20 p-4">
              <h4 className="font-semibold mb-3">Project Details</h4>
              <ScrollArea className="max-h-64">
                <div className="space-y-3">
                  {MOCK_PROJECTS_DATA.map((project) => (
                    <div
                      key={project.id}
                      className={cn(
                        "p-3 rounded border transition-colors cursor-pointer",
                        selectedProject === project.id
                          ? "bg-blue-50 border-blue-200"
                          : "hover:bg-gray-50",
                      )}
                      onClick={() => {
                        onProjectClick(project.id);
                        setIsExpanded(false);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-blue-600">
                          {project.name}
                        </span>
                        <span className="text-lg font-bold">
                          {calculateHealthScore(project.data)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Project No: {project.id}
                      </div>
                      <div className="text-xs text-gray-500">
                        PM: {project.data.pm || "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

const ReportingStatusCard = React.memo<{ selectedProject: string | null }>(
  ({ selectedProject }) => {
    const reportingData = useMemo(() => {
      if (selectedProject === "23-435-01") {
        return {
          period: CURRENT_PERIOD,
          submitted: 1,
          totalDue: 3,
          completionRate: 33,
          reports: [
            {
              name: "Financial Forecast",
              status: "submitted",
              dueDate: "6/5/2025",
              submittedDate: "6/5/2025",
            },
            { name: "Schedule Update", status: "pending", dueDate: "6/15/2025" },
            { name: "Safety Report", status: "pending", dueDate: "6/30/2025" },
          ],
        };
      }

      return {
        period: CURRENT_PERIOD,
        submitted: 8,
        totalDue: 12,
        completionRate: 67,
        projects: MOCK_PROJECTS_DATA.length,
      };
    }, [selectedProject]);

    const chartData = useMemo(() => [
      { name: "Submitted", value: reportingData.submitted },
      { name: "Pending", value: reportingData.totalDue - reportingData.submitted },
    ], [reportingData]);

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reporting Status
            <Badge variant="outline" className="text-xs">
              {reportingData.period}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reportingData.submitted}/{reportingData.totalDue}
              </div>
              <div className="text-xs text-gray-500">Reports Submitted</div>
              <Progress
                value={reportingData.completionRate}
                className="mt-2 h-2"
              />
              <div className="text-xs text-gray-600 mt-1">
                {reportingData.completionRate}% Complete
              </div>
            </div>

            {selectedProject === "23-435-01" && reportingData.reports && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700">
                  Report Breakdown:
                </div>
                {reportingData.reports.map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="truncate">{report.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{report.dueDate}</span>
                      {report.status === "submitted" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Clock className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

/**
 * Enhanced HBI Insights Component (Preserved as Original)
 */
const EnhancedHBIInsights = React.memo(() => {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "forecast":
        return <TrendingUp className="h-4 w-4" />;
      case "risk":
        return <AlertTriangle className="h-4 w-4" />;
      case "opportunity":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <Card className="bg-blue-50 border-blue-200 col-span-full lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-blue-700 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          HBI AI Insights
          <Badge variant="outline" className="ml-auto bg-blue-100 text-blue-700">
            AI-Powered
          </Badge>
        </CardTitle>
        <CardDescription className="text-blue-600">
          Advanced analytics and forecasting for your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pxDashboardData.pxInsights.map((insight) => (
            <div
              key={insight.id}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                getInsightColor(insight.severity),
                selectedInsight === insight.id && "ring-2 ring-blue-300",
              )}
              onClick={() =>
                setSelectedInsight(
                  selectedInsight === insight.id ? null : insight.id,
                )
              }
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <Badge
                      variant={
                        insight.severity === "high" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{insight.text}</p>
                  {selectedInsight === insight.id && (
                    <div className="mt-3 p-2 bg-white rounded border">
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        Recommended Action:
                      </p>
                      <p className="text-sm text-gray-800">{insight.action}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

EnhancedHBIInsights.displayName = "EnhancedHBIInsights";

/**
 * Main Enhanced PX Dashboard Component
 */
export default function EnhancedPXDashboard() {
  const [selectedProject, setSelectedProject] = useState<string | null>(
    "23-435-01",
  );

  const handleProjectClick = useCallback(
    (projectId: string) => {
      setSelectedProject(projectId === selectedProject ? null : projectId);
    },
    [selectedProject],
  );

  const project = useMemo(() => {
    return MOCK_PROJECTS_DATA.find((p) => p.id === selectedProject);
  }, [selectedProject]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Project Executive Dashboard</h1>
          <p className="text-gray-600">
            Enhanced portfolio oversight with advanced analytics and insights •{" "}
            {CURRENT_PERIOD}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={selectedProject || "all"}
            onValueChange={(value) => handleProjectClick(value)}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {MOCK_PROJECTS_DATA.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Enhanced Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        <ProjectHealthCard
          selectedProject={selectedProject}
          onProjectClick={handleProjectClick}
        />
        <ProjectOverviewCard selectedProject={selectedProject} />
        <ScheduleOverviewCard selectedProject={selectedProject} />
        <FinancialOverviewCard selectedProject={selectedProject} />
        <GeneralConditionsCard selectedProject={selectedProject} />
        <ContingenciesCard selectedProject={selectedProject} />
        <ProfitForecastCard selectedProject={selectedProject} />
        <ReportingStatusCard selectedProject={selectedProject} />
        <ProblemsExposuresCard selectedProject={selectedProject} />
        <ChangeOrderImpactsCard selectedProject={selectedProject} />
        <SubmittalAnalysisCard selectedProject={selectedProject} />
        <RfiPerformanceCard selectedProject={selectedProject} />

        {/* Enhanced HBI Insights Card */}
        <EnhancedHBIInsights />
      </div>
    </div>
  );
}