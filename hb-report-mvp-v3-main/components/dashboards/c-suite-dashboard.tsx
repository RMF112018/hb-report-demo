'use client'; // Marks this component as client-side only to handle dynamic chart rendering and hover interactions

import type React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase,
  FileText,
  Layers,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Building,
  Activity,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Line,
} from 'recharts';

// Import data from the JSON file
import cSuiteData from '@/data/c-suite-dashboard-data.json';

/**
 * CSuiteDashboard Component
 * @description The main dashboard component for C-Suite executives, providing a high-level overview of
 *              business development, estimating, VDC/BIM, staffing, finances, project health, and AI-powered
 *              insights. Utilizes client-side rendering for dynamic charts and hover effects, integrating
 *              mock data from Procore, Unanet, and Building Connected.
 * @features
 * - Interactive cards with hover data overlays
 * - Real-time metric visualizations using recharts
 * - Responsive design optimized for large displays
 * - AI-driven business insights
 */
interface CSuiteCardProps {
  title: string; // Title of the card
  description?: string; // Optional description for additional context
  icon: React.ReactNode; // Icon to display in the card header
  children: React.ReactNode; // Content to render inside the card
  className?: string; // Optional additional CSS classes for custom styling
  hoverData?: {
    title: string; // Title for the hover overlay
    items: Array<{ label: string; value: string | number; status?: string }>; // Data items to display on hover
  }; // Optional hover data configuration
}

/**
 * CSuiteCard Component
 * @description A reusable card component for the C-Suite dashboard, supporting hover-based data overlays
 *              and interactive styling. Manages hover state to toggle detailed information.
 */
const CSuiteCard: React.FC<CSuiteCardProps> = ({ title, description, icon, children, className, hoverData }) => {
  const [isHovered, setIsHovered] = useState(false); // Tracks hover state for data overlay

  return (
    <Card
      className={cn(
        'relative transition-all duration-300 hover:shadow-lg cursor-pointer group',
        className,
      )}
      onMouseEnter={() => setIsHovered(true)} // Enable hover overlay
      onMouseLeave={() => setIsHovered(false)} // Disable hover overlay
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
        </div>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>

      {/* Hover overlay with detailed data */}
      {hoverData && isHovered && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg border shadow-xl z-10 p-4">
          <h4 className="font-semibold mb-3 text-gray-900">{hoverData.title}</h4>
          <ScrollArea className="h-full max-h-48">
            <div className="space-y-2">
              {hoverData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.value}</span>
                    {item.status && (
                      <Badge
                        variant={
                          item.status === 'good'
                            ? 'default'
                            : item.status === 'warning'
                              ? 'secondary'
                              : 'destructive'
                        }
                        className="text-xs"
                      >
                        {item.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </Card>
  );
};

/**
 * ProjectHealthGauge Component
 * @description A radial bar chart component to visualize project health scores, with color-coded
 *              indicators based on the score range (green >= 85, yellow >= 70, red < 70).
 * @param {number} score - The health score (0-100)
 * @param {string} label - The label to display below the gauge
 */
interface ProjectHealthGaugeProps {
  score: number; // Health score value (0-100)
  label: string; // Label for the gauge
}

const ProjectHealthGauge: React.FC<ProjectHealthGaugeProps> = ({ score, label }) => {
  const data = [
    {
      name: 'Health',
      value: score,
      fill: score >= 85 ? '#22c55e' : score >= 70 ? '#eab308' : '#ef4444', // Color based on score threshold
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={data}>
            <RadialBar dataKey="value" cornerRadius={10} fill={data[0].fill} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{score}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
        </div>
      </div>
      <p className="text-sm text-center mt-2 text-muted-foreground">{label}</p>
    </div>
  );
};

/**
 * CSuiteDashboard Component
 * @description The main C-Suite dashboard providing executive-level visibility into key business metrics.
 *              Integrates data from c-suite-dashboard-data.json and uses recharts for visualizations.
 * @features
 * - Business Development: Pursuits and win rates
 * - Estimating: Proposal success and efficiency
 * - VDC/BIM: Model accuracy and coordination
 * - Staffing: Headcount and turnover
 * - Finances: Fiscal year performance
 * - Projects: Health and active project overview
 * - HBI Insights: AI-powered business intelligence
 */
export default function CSuiteDashboard() {
  // Destructure data from the imported JSON file
  const { businessDevelopment, estimating, vdcBIM, staffing, finances, projects, hbiInsights } = cSuiteData;

  // Define chart configurations for ChartContainer, using HSL for consistency with shadcn/ui
  const businessDevChartConfig = {
    value: {
      label: 'Pipeline Value',
      color: 'hsl(var(--chart-1))',
    },
  };

  const financeChartConfig = {
    revenue: {
      label: 'Revenue',
      color: 'hsl(var(--chart-1))',
    },
    profit: {
      label: 'Profit',
      color: 'hsl(var(--chart-2))',
    },
  };

  // Calculate derived metrics for dynamic display
  const revenueProgress = (finances.fiscalYear.revenue / finances.fiscalYear.target) * 100;
  const bimAdoption = (vdcBIM.projects.withBIM / vdcBIM.projects.total) * 100;
  const projectsOnTrack = ((projects.onTime + projects.onBudget) / (projects.active * 2)) * 100;

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header Section - Provides dashboard title and description */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Executive Dashboard</h1>
          <p className="text-gray-600">Real-time business intelligence and key performance indicators</p>
        </div>

        {/* Main Dashboard Grid - Responsive layout for cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Business Development Card */}
          <CSuiteCard
            title="Business Development"
            description="Pursuits and pipeline performance"
            icon={<Briefcase className="h-5 w-5 text-blue-600" />}
            className="xl:col-span-2"
            hoverData={{
              title: 'Recent Wins',
              items: businessDevelopment.recentWins.map((win) => ({
                label: win.name,
                value: `$${(win.value / 1000000).toFixed(1)}M`,
                status: win.probability >= 90 ? 'good' : 'warning',
              })),
            }}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{businessDevelopment.pursuits.total}</div>
                  <div className="text-sm text-muted-foreground">Total Pursuits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{businessDevelopment.pursuits.winRate}%</div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                </div>
              </div>
              <div className="h-32">
                <ChartContainer config={businessDevChartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={businessDevelopment.pipeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="var(--color-value)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </CSuiteCard>

          {/* Estimating Performance Card */}
          <CSuiteCard
            title="Estimating"
            description="Proposal success and efficiency"
            icon={<FileText className="h-5 w-5 text-purple-600" />}
            hoverData={{
              title: 'Recent Proposals',
              items: estimating.recentProposals.map((proposal) => ({
                label: proposal.name,
                value: `$${(proposal.value / 1000000).toFixed(1)}M`,
                status:
                  proposal.status === 'won'
                    ? 'good'
                    : proposal.status === 'pending'
                      ? 'warning'
                      : 'critical',
              })),
            }}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{estimating.proposals.submitted}</div>
                  <div className="text-sm text-muted-foreground">Proposals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{estimating.proposals.successRate}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Avg. Turnaround</span>
                  <span className="font-medium">{estimating.proposals.avgTurnaround} days</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
          </CSuiteCard>

          {/* VDC/BIM Status Card */}
          <CSuiteCard
            title="VDC/BIM"
            description="Model accuracy and coordination"
            icon={<Layers className="h-5 w-5 text-orange-600" />}
            hoverData={{
              title: 'Recent Models',
              items: vdcBIM.recentModels.map((model) => ({
                label: model.name,
                value: `${model.accuracy}%`,
                status: model.accuracy >= 95 ? 'good' : model.accuracy >= 90 ? 'warning' : 'critical',
              })),
            }}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{vdcBIM.projects.modelAccuracy}%</div>
                  <div className="text-sm text-muted-foreground">Model Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(bimAdoption)}%</div>
                  <div className="text-sm text-muted-foreground">BIM Adoption</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Coordination Issues</span>
                  <span className="font-medium">
                    {vdcBIM.projects.resolvedIssues}/{vdcBIM.projects.coordinationIssues}
                  </span>
                </div>
                <Progress
                  value={(vdcBIM.projects.resolvedIssues / vdcBIM.projects.coordinationIssues) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </CSuiteCard>

          {/* Staffing Overview Card */}
          <CSuiteCard
            title="Staffing"
            description="Headcount and turnover metrics"
            icon={<Users className="h-5 w-5 text-green-600" />}
            hoverData={{
              title: 'Department Breakdown',
              items: staffing.departmentData.map((dept) => ({
                label: dept.department,
                value: `${dept.headcount} (${dept.turnover}% turnover)`,
                status: dept.turnover <= 5 ? 'good' : dept.turnover <= 10 ? 'warning' : 'critical',
              })),
            }}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{staffing.headcount.total}</div>
                  <div className="text-sm text-muted-foreground">Total Headcount</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{staffing.turnover.rate}%</div>
                  <div className="text-sm text-muted-foreground">Turnover Rate</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Open Positions</span>
                  <span className="font-medium">{staffing.turnover.openPositions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>New Hires (YTD)</span>
                  <span className="font-medium">{staffing.turnover.newHires}</span>
                </div>
              </div>
            </div>
          </CSuiteCard>

          {/* Fiscal Year Finances Card */}
          <CSuiteCard
            title="Fiscal Year Finances"
            description="Revenue and profitability tracking"
            icon={<DollarSign className="h-5 w-5 text-green-600" />}
            className="xl:col-span-2"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${(finances.fiscalYear.revenue / 1000000).toFixed(0)}M
                  </div>
                  <div className="text-sm text-muted-foreground">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{finances.fiscalYear.margin}%</div>
                  <div className="text-sm text-muted-foreground">Profit Margin</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(revenueProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Target Progress</div>
                </div>
              </div>
              <div className="h-32">
                <ChartContainer config={financeChartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={finances.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                      <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </CSuiteCard>

          {/* Project Health Gauge Card */}
          <CSuiteCard
            title="Project Health"
            description="Overall project performance score"
            icon={<Activity className="h-5 w-5 text-red-600" />}
            hoverData={{
              title: 'Project Details',
              items: projects.recentProjects.map((project) => ({
                label: project.name,
                value: `${project.health} (${project.completion}% complete)`,
                status: project.health >= 85 ? 'good' : project.health >= 70 ? 'warning' : 'critical',
              })),
            }}
          >
            <div className="flex flex-col items-center space-y-4">
              <ProjectHealthGauge score={projects.avgHealth} label="Average Health Score" />
              <div className="grid grid-cols-2 gap-4 w-full text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{projects.onTime}</div>
                  <div className="text-xs text-muted-foreground">On Schedule</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">{projects.onBudget}</div>
                  <div className="text-xs text-muted-foreground">On Budget</div>
                </div>
              </div>
            </div>
          </CSuiteCard>

          {/* Active Projects Summary Card */}
          <CSuiteCard
            title="Active Projects"
            description="Portfolio overview and metrics"
            icon={<Building className="h-5 w-5 text-indigo-600" />}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{projects.active}</div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${(projects.totalValue / 1000000).toFixed(0)}M
                  </div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
              </div>
              <div className="space-y-2">
                {projects.healthDistribution.map((range, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{range.range} Health</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: range.color }} />
                      <span className="font-medium">{range.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CSuiteCard>

          {/* HBI Insights Card */}
          <CSuiteCard
            title="HBI Insights"
            description="AI-powered business intelligence"
            icon={<Sparkles className="h-5 w-5 text-purple-600" />}
            className="xl:col-span-2"
          >
            <div className="space-y-4">
              {hbiInsights.map((insight, index) => (
                <div
                  key={insight.id}
                  className={cn(
                    'p-3 rounded-lg border',
                    insight.impact === 'high'
                      ? 'bg-red-50 border-red-200'
                      : insight.impact === 'medium'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-green-50 border-green-200',
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {insight.type === 'forecast' && <TrendingUp className="h-4 w-4 text-blue-600" />}
                      {insight.type === 'alert' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                      {insight.type === 'opportunity' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                  <p className="text-xs text-gray-600 italic">{insight.recommendation}</p>
                </div>
              ))}
            </div>
          </CSuiteCard>
        </div>
      </div>
    </TooltipProvider>
  );
}