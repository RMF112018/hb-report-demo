'use client'; // Marks this component as client-side only to handle dynamic rendering and chart interactions

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { DashboardCard } from '@/types/dashboard';
import { formatCurrency } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Shield,
  Clock,
  Target,
  DollarSign,
  Activity,
} from 'lucide-react';
import {
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

/**
 * DashboardCard Component
 * @description A reusable card component for displaying various dashboard metrics and visualizations.
 *              Supports different card types (e.g., financial overview, health overview) with dynamic
 *              content rendering. Includes optional interactivity for removal and selection.
 *              Designed for client-side rendering to manage charts and animations.
 */
interface DashboardCardProps {
  card: DashboardCard; // The card data object containing title, type, config, and other properties
  className?: string; // Optional additional CSS classes for custom styling
  onRemove?: (cardId: string) => void; // Optional callback to remove the card
  onSelect?: (cardId: string) => void; // Optional callback to select the card
  isSelected?: boolean; // Indicates if the card is currently selected for styling or behavior
}

export function DashboardCardComponent({
  card,
  className,
  onRemove,
  onSelect,
  isSelected,
}: DashboardCardProps) {
  /**
   * renderCardContent Function
   * @description Dynamically renders the content based on the card's type, delegating to specialized
   *              card components. Falls back to a default card if the type is unrecognized.
   * @returns {JSX.Element} The rendered content for the card
   */
  const renderCardContent = () => {
    switch (card.type) {
      case 'financial-overview':
        return <FinancialOverviewCard config={card.config} />;
      case 'budget-variance':
        return <BudgetVarianceCard config={card.config} />;
      case 'cash-flow':
        return <CashFlowCard config={card.config} />;
      case 'profitability':
        return <ProfitabilityCard config={card.config} />;
      case 'health-overview':
        return <HealthOverviewCard config={card.config} />;
      case 'risk-assessment':
        return <RiskAssessmentCard config={card.config} />;
      case 'schedule-overview':
        return <ScheduleOverviewCard config={card.config} />;
      case 'milestone-tracker':
        return <MilestoneTrackerCard config={card.config} />;
      case 'critical-path':
        return <CriticalPathCard config={card.config} />;
      case 'quality-metrics':
        return <QualityMetricsCard config={card.config} />;
      case 'safety-dashboard':
        return <SafetyDashboardCard config={card.config} />;
      case 'performance-score':
        return <PerformanceScoreCard config={card.config} />;
      default:
        return <DefaultCard type={card.type} />;
    }
  };

  // Special styling for financial overview to limit width
  const cardClassName = card.type === 'financial-overview' ? 'h-full max-w-[50%] min-w-[400px]' : 'h-full';
  const cardContainerClass = `relative ${cardClassName} ${className || ''} ${
    isSelected ? 'border-2 border-blue-500 shadow-lg' : ''
  }`; // Add border and shadow when selected

  return (
    <Card className={cardContainerClass}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold truncate flex items-center gap-2">
            {card.type === 'financial-overview' && <DollarSign className="h-4 w-4" />}
            {card.title}
          </CardTitle>
          {onRemove && (
            <button
              onClick={() => onRemove(card.id)}
              className="text-red-500 hover:text-red-700 text-xs p-1 rounded-full hover:bg-red-100 transition-colors"
              aria-label={`Remove ${card.title}`}
            >
              ✕
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        {renderCardContent()}
        {onSelect && (
          <button
            onClick={() => onSelect(card.id)}
            className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-sm p-1 rounded transition-colors"
          >
            {isSelected ? 'Selected' : 'Select'}
          </button>
        )}
      </CardContent>
    </Card>
  );
}

// Enhanced Financial Overview Card with comprehensive charts
function FinancialOverviewCard({ config }: { config?: any }) {
  // Extended data with projections
  const monthlyData = [
    { month: 'Jan', revenue: 2400000, costs: 1800000, projected: 2600000, profit: 600000 },
    { month: 'Feb', revenue: 2800000, costs: 2100000, projected: 2900000, profit: 700000 },
    { month: 'Mar', revenue: 3200000, costs: 2400000, projected: 3300000, profit: 800000 },
    { month: 'Apr', revenue: 2900000, costs: 2200000, projected: 3100000, profit: 700000 },
    { month: 'May', revenue: 3500000, costs: 2600000, projected: 3600000, profit: 900000 },
    { month: 'Jun', revenue: 3800000, costs: 2800000, projected: 3900000, profit: 1000000 },
    { month: 'Jul', revenue: 4100000, costs: 3000000, projected: 4200000, profit: 1100000 },
    { month: 'Aug', revenue: 3900000, costs: 2900000, projected: 4000000, profit: 1000000 },
  ];

  // Cost breakdown data for pie chart
  const costBreakdown = [
    { name: 'Labor', value: 8500000, color: '#3b82f6' },
    { name: 'Materials', value: 6200000, color: '#10b981' },
    { name: 'Equipment', value: 2800000, color: '#f59e0b' },
    { name: 'Overhead', value: 1900000, color: '#ef4444' },
  ];

  // Performance metrics
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCosts = monthlyData.reduce((sum, item) => sum + item.costs, 0);
  const totalProjected = monthlyData.reduce((sum, item) => sum + item.projected, 0);
  const profitMargin = (((totalRevenue - totalCosts) / totalRevenue) * 100).toFixed(1);
  const projectedGrowth = (((totalProjected - totalRevenue) / totalRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
          <div className="text-xs text-gray-500">Total Revenue</div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{formatCurrency(totalCosts)}</div>
          <div className="text-xs text-gray-500">Total Costs</div>
        </div>
        <div className="text-center p-2 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">{formatCurrency(totalProjected)}</div>
          <div className="text-xs text-gray-500">Projected</div>
        </div>
        <div className="text-center p-2 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{profitMargin}%</div>
          <div className="text-xs text-gray-500">Margin</div>
        </div>
      </div>

      {/* Revenue vs Costs Trend */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold flex items-center gap-1">
          <Activity className="h-3 w-3" />
          Revenue vs Costs Trend
        </h4>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <Tooltip
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
              labelStyle={{ fontSize: '12px' }}
              contentStyle={{ fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="costs"
              stackId="2"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.6}
              name="Costs"
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Projected"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row: Cost Breakdown and Projections */}
      <div className="grid grid-cols-2 gap-4">
        {/* Cost Breakdown Pie Chart */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Cost Breakdown</h4>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {costBreakdown.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Profit Trend */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Monthly Profit</h4>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ fontSize: '12px' }} />
              <Bar dataKey="profit" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-xs text-gray-600">
            <span>
              Avg: {formatCurrency(monthlyData.reduce((sum, item) => sum + item.profit, 0) / monthlyData.length)}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />+{projectedGrowth}% projected
            </span>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t">
        <div className="text-center">
          <div className="text-sm font-bold text-green-600">
            {((monthlyData[monthlyData.length - 1].revenue / monthlyData[0].revenue - 1) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Revenue Growth</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-blue-600">{((totalCosts / totalRevenue) * 100).toFixed(1)}%</div>
          <div className="text-xs text-gray-500">Cost Ratio</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-purple-600">{formatCurrency(totalProjected - totalRevenue)}</div>
          <div className="text-xs text-gray-500">Proj. Increase</div>
        </div>
      </div>
    </div>
  );
}

// Keep all other card components the same but more compact
function BudgetVarianceCard({ config }: { config?: any }) {
  const projects = [
    { name: 'Metro Office', budget: 5000000, actual: 5200000, variance: 4 },
    { name: 'Panther Tower', budget: 8500000, actual: 8100000, variance: -4.7 },
    { name: 'Sandbox Test', budget: 2000000, actual: 2150000, variance: 7.5 },
  ];

  return (
    <div className="space-y-2">
      {projects.map((project, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-xs truncate">{project.name}</div>
            <div className="text-xs text-gray-500 truncate">
              {formatCurrency(project.actual)} / {formatCurrency(project.budget)}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-none">
            {project.variance > 0 ? (
              <TrendingUp className="h-3 w-3 text-red-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-green-500" />
            )}
            <span className={`text-xs font-medium ${project.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {project.variance > 0 ? '+' : ''}
              {project.variance}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CashFlowCard({ config }: { config?: any }) {
  const data = [
    { month: 'Jul', inflow: 3200000, outflow: 2800000 },
    { month: 'Aug', inflow: 2900000, outflow: 3100000 },
    { month: 'Sep', inflow: 3500000, outflow: 2900000 },
    { month: 'Oct', inflow: 3800000, outflow: 3200000 },
    { month: 'Nov', inflow: 3600000, outflow: 3000000 },
    { month: 'Dec', inflow: 4100000, outflow: 3400000 },
  ];

  return (
    <div className="space-y-2">
      <div className="text-center">
        <div className="text-lg font-bold text-green-600">+$2.4M</div>
        <div className="text-xs text-gray-500">Net Cash Flow</div>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={data}>
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip formatter={(value) => formatCurrency(value as number)} />
          <Bar dataKey="inflow" fill="#10b981" name="Inflow" />
          <Bar dataKey="outflow" fill="#ef4444" name="Outflow" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProfitabilityCard({ config }: { config?: any }) {
  const projects = [
    { name: 'Panther Tower', margin: 18.5, status: 'excellent' },
    { name: 'Metro Office', margin: 12.3, status: 'good' },
    { name: 'Sandbox Test', margin: 8.7, status: 'fair' },
  ];

  return (
    <div className="space-y-2">
      <div className="text-center mb-2">
        <div className="text-lg font-bold">14.2%</div>
        <div className="text-xs text-gray-500">Avg Margin</div>
      </div>
      {projects.map((project, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-xs truncate">{project.name}</div>
            <Progress value={project.margin} className="mt-1 h-1" />
          </div>
          <div className="ml-2 text-right flex-none">
            <div className="text-xs font-medium">{project.margin}%</div>
            <Badge
              variant={
                project.status === 'excellent'
                  ? 'default'
                  : project.status === 'good'
                    ? 'secondary'
                    : 'outline'
              }
              className="text-xs px-1 py-0"
            >
              {project.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function HealthOverviewCard({ config }: { config?: any }) {
  const healthData = [
    { name: 'Schedule', value: 85, color: '#10b981' },
    { name: 'Budget', value: 78, color: '#3b82f6' },
    { name: 'Quality', value: 92, color: '#8b5cf6' },
    { name: 'Safety', value: 96, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-2">
      <div className="text-center">
        <div className="text-xl font-bold text-green-600">88%</div>
        <div className="text-xs text-gray-500">Health Score</div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {healthData.map((item, index) => (
          <div key={index} className="text-center p-1.5 bg-gray-50 rounded">
            <div className="text-sm font-bold" style={{ color: item.color }}>
              {item.value}%
            </div>
            <div className="text-xs text-gray-500">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskAssessmentCard({ config }: { config?: any }) {
  const risks = [
    { type: 'Schedule Delay', level: 'high', impact: 'High', probability: 'Medium' },
    { type: 'Budget Overrun', level: 'medium', impact: 'Medium', probability: 'Low' },
    { type: 'Weather Impact', level: 'low', impact: 'Low', probability: 'High' },
  ];

  return (
    <div className="space-y-2">
      {risks.map((risk, index) => (
        <div key={index} className="p-2 border rounded">
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium text-xs truncate">{risk.type}</div>
            <Badge
              variant={risk.level === 'high' ? 'destructive' : risk.level === 'medium' ? 'default' : 'secondary'}
              className="text-xs px-1 py-0"
            >
              {risk.level}
            </Badge>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Impact: {risk.impact}</span>
            <span>Prob: {risk.probability}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScheduleOverviewCard({ config }: { config?: any }) {
  const milestones = [
    { name: 'Foundation Complete', date: '2024-02-15', status: 'completed' },
    { name: 'Framing Complete', date: '2024-03-30', status: 'in-progress' },
    { name: 'MEP Rough-in', date: '2024-05-15', status: 'upcoming' },
    { name: 'Final Inspection', date: '2024-07-01', status: 'upcoming' },
  ];

  return (
    <div className="space-y-2">
      <div className="text-center mb-2">
        <div className="text-lg font-bold">67%</div>
        <div className="text-xs text-gray-500">Progress</div>
        <Progress value={67} className="mt-1 h-1" />
      </div>
      {milestones.slice(0, 3).map((milestone, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full flex-none ${
              milestone.status === 'completed'
                ? 'bg-green-500'
                : milestone.status === 'in-progress'
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
            }`}
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">{milestone.name}</div>
            <div className="text-xs text-gray-500">{milestone.date}</div>
          </div>
          <Badge
            variant={
              milestone.status === 'completed'
                ? 'default'
                : milestone.status === 'in-progress'
                  ? 'secondary'
                  : 'outline'
            }
            className="text-xs px-1 py-0 flex-none"
          >
            {milestone.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function MilestoneTrackerCard({ config }: { config?: any }) {
  const upcomingMilestones = [
    { name: 'MEP Rough-in Complete', project: 'Metro Office', daysLeft: 12 },
    { name: 'Exterior Envelope', project: 'Panther Tower', daysLeft: 18 },
    { name: 'Final Walkthrough', project: 'Sandbox Test', daysLeft: 25 },
  ];

  return (
    <div className="space-y-2">
      <div className="text-center mb-2">
        <Calendar className="h-6 w-6 mx-auto text-blue-500 mb-1" />
        <div className="text-xs text-gray-500">Upcoming</div>
      </div>
      {upcomingMilestones.slice(0, 2).map((milestone, index) => (
        <div key={index} className="p-2 bg-blue-50 rounded">
          <div className="font-medium text-xs truncate">{milestone.name}</div>
          <div className="text-xs text-gray-600 mt-1 truncate">{milestone.project}</div>
          <div className="flex items-center justify-between mt-1">
            <Badge variant="outline" className="text-xs px-1 py-0">
              {milestone.daysLeft} days
            </Badge>
            <Clock className="h-3 w-3 text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CriticalPathCard({ config }: { config?: any }) {
  const criticalTasks = [
    { name: 'Foundation Pour', float: 0, duration: 5 },
    { name: 'Steel Erection', float: 2, duration: 12 },
    { name: 'Roof Installation', float: 0, duration: 8 },
  ];

  return (
    <div className="space-y-2">
      <div className="text-center mb-2">
        <Target className="h-6 w-6 mx-auto text-red-500 mb-1" />
        <div className="text-xs text-gray-500">Critical Path</div>
      </div>
      {criticalTasks.slice(0, 2).map((task, index) => (
        <div
          key={index}
          className={`p-2 rounded ${
            task.float === 0 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
          }`}
        >
          <div className="font-medium text-xs truncate">{task.name}</div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-600">{task.duration} days</span>
            <Badge variant={task.float === 0 ? 'destructive' : 'default'} className="text-xs px-1 py-0">
              {task.float} float
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function QualityMetricsCard({ config }: { config?: any }) {
  return (
    <div className="space-y-2">
      <div className="text-center">
        <div className="text-xl font-bold text-green-600">94%</div>
        <div className="text-xs text-gray-500">Quality Score</div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs">Inspections</span>
          <span className="font-medium text-xs">47/50</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs">Rework Rate</span>
          <span className="font-medium text-green-600 text-xs">2.1%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs">Defects</span>
          <span className="font-medium text-xs">0.8/1000</span>
        </div>
      </div>
    </div>
  );
}

function SafetyDashboardCard({ config }: { config?: any }) {
  return (
    <div className="space-y-2">
      <div className="text-center">
        <Shield className="h-6 w-6 mx-auto text-green-500 mb-1" />
        <div className="text-lg font-bold text-green-600">45</div>
        <div className="text-xs text-gray-500">Days Safe</div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div className="text-center p-1.5 bg-green-50 rounded">
          <div className="text-sm font-bold text-green-600">0</div>
          <div className="text-xs text-gray-500">Incidents</div>
        </div>
        <div className="text-center p-1.5 bg-blue-50 rounded">
          <div className="text-sm font-bold text-blue-600">98%</div>
          <div className="text-xs text-gray-500">Training</div>
        </div>
      </div>
    </div>
  );
}

function PerformanceScoreCard({ config }: { config?: any }) {
  return (
    <div className="text-center space-y-2">
      <div className="relative">
        <div className="text-2xl font-bold text-blue-600">8.7</div>
        <div className="text-xs text-gray-500">Performance</div>
      </div>
      <div className="flex justify-center">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((star) => (
            <div key={star} className={`w-1.5 h-1.5 rounded-full ${star <= 8 ? 'bg-blue-500' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>
      <Badge variant="secondary" className="text-xs px-1 py-0">
        Above Average
      </Badge>
    </div>
  );
}

function DefaultCard({ type }: { type: string }) {
  return (
    <div className="flex items-center justify-center h-20 text-gray-400">
      <div className="text-center">
        <BarChart3 className="h-6 w-6 mx-auto mb-1" />
        <div className="text-xs">Card: {type}</div>
      </div>
    </div>
  );
}

// Export the component with the default name expected by DashboardGrid
export { DashboardCardComponent as DashboardCard };