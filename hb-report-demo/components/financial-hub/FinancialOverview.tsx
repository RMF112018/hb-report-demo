"use client";

import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  Percent
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CustomLineChart } from "@/components/charts/LineChart";
import { CustomBarChart } from "@/components/charts/BarChart";
import { PieChartCard } from "@/components/charts/PieChart";

interface FinancialOverviewProps {
  userRole: string;
  projectData: any;
}

export default function FinancialOverview({ userRole, projectData }: FinancialOverviewProps) {
  
  // Role-based data filtering
  const getFinancialData = () => {
    switch (userRole) {
      case 'project-manager':
        return {
          totalContractValue: 57235491,
          currentApprovedValue: 58100000,
          netCashFlow: 8215006.64,
          totalCosts: 45261264.55,
          profitMargin: 6.8,
          profitValue: 3950000,
          workingCapital: 9732503.32,
          retention: 2861632.74,
          changeOrders: {
            approved: 5,
            pending: 2,
            totalValue: 864509
          },
          healthMetrics: {
            budgetHealth: 88,
            cashFlowHealth: 92,
            scheduleHealth: 85,
            overallHealth: 88
          },
          riskFactors: [
            { category: "Material Costs", risk: "Low", impact: 15000 },
            { category: "Weather Delays", risk: "Medium", impact: 45000 }
          ],
          monthlyTrend: [
            { month: "Oct", revenue: 4500000, costs: 3800000, profit: 700000 },
            { month: "Nov", revenue: 5200000, costs: 4300000, profit: 900000 },
            { month: "Dec", revenue: 4800000, costs: 4100000, profit: 700000 },
            { month: "Jan", revenue: 5500000, costs: 4600000, profit: 900000 }
          ],
          costBreakdown: [
            { category: "Labor", amount: 18500000, percentage: 32.3 },
            { category: "Materials", amount: 22800000, percentage: 39.8 },
            { category: "Equipment", amount: 8200000, percentage: 14.3 },
            { category: "Overhead", amount: 7761264.55, percentage: 13.6 }
          ]
        };
      case 'project-executive':
        return {
          totalContractValue: 285480000,
          currentApprovedValue: 289920000,
          netCashFlow: 42630000,
          totalCosts: 242850000,
          profitMargin: 6.8,
          profitValue: 19750000,
          workingCapital: 48200000,
          retention: 14476000,
          changeOrders: {
            approved: 15,
            pending: 7,
            totalValue: 4440000
          },
          healthMetrics: {
            budgetHealth: 86,
            cashFlowHealth: 88,
            scheduleHealth: 82,
            overallHealth: 85
          },
          riskFactors: [
            { category: "Material Costs", risk: "Medium", impact: 850000 },
            { category: "Weather Delays", risk: "Medium", impact: 650000 },
            { category: "Schedule Overrun", risk: "High", impact: 1200000 }
          ],
          monthlyTrend: [
            { month: "Oct", revenue: 22500000, costs: 18800000, profit: 3700000 },
            { month: "Nov", revenue: 26200000, costs: 21300000, profit: 4900000 },
            { month: "Dec", revenue: 24800000, costs: 20100000, profit: 4700000 },
            { month: "Jan", revenue: 28500000, costs: 22600000, profit: 5900000 }
          ],
          costBreakdown: [
            { category: "Labor", amount: 92500000, percentage: 32.3 },
            { category: "Materials", amount: 114000000, percentage: 39.8 },
            { category: "Equipment", amount: 41000000, percentage: 14.3 },
            { category: "Overhead", amount: 38850000, percentage: 13.6 }
          ]
        };
      default:
        return {
          totalContractValue: 485280000,
          currentApprovedValue: 492150000,
          netCashFlow: 72830000,
          totalCosts: 412450000,
          profitMargin: 6.4,
          profitValue: 31250000,
          workingCapital: 82500000,
          retention: 24264000,
          changeOrders: {
            approved: 28,
            pending: 12,
            totalValue: 6870000
          },
          healthMetrics: {
            budgetHealth: 85,
            cashFlowHealth: 89,
            scheduleHealth: 78,
            overallHealth: 84
          },
          riskFactors: [
            { category: "Material Costs", risk: "High", impact: 2800000 },
            { category: "Weather Delays", risk: "Medium", impact: 1200000 },
            { category: "Schedule Overrun", risk: "High", impact: 3400000 },
            { category: "Labor Shortage", risk: "Medium", impact: 1800000 }
          ],
          monthlyTrend: [
            { month: "Oct", revenue: 38500000, costs: 32800000, profit: 5700000 },
            { month: "Nov", revenue: 44200000, costs: 36300000, profit: 7900000 },
            { month: "Dec", revenue: 41800000, costs: 34100000, profit: 7700000 },
            { month: "Jan", revenue: 48500000, costs: 39600000, profit: 8900000 }
          ],
          costBreakdown: [
            { category: "Labor", amount: 156800000, percentage: 32.3 },
            { category: "Materials", amount: 193200000, percentage: 39.8 },
            { category: "Equipment", amount: 69400000, percentage: 14.3 },
            { category: "Overhead", amount: 66050000, percentage: 13.6 }
          ]
        };
    }
  };

  const data = getFinancialData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "text-red-600 bg-red-50 border-red-200";
      case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contract Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.currentApprovedValue)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>+{formatCurrency(data.currentApprovedValue - data.totalContractValue)} from original</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(data.netCashFlow)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Positive flow</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{data.profitMargin}%</div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(data.profitValue)} profit
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Working Capital</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(data.workingCapital)}</div>
            <div className="text-xs text-muted-foreground">
              Available liquidity
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Financial Health Metrics
          </CardTitle>
          <CardDescription>
            Real-time health indicators across key financial areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Budget Health</span>
                <span className={`text-sm font-bold ${getHealthColor(data.healthMetrics.budgetHealth)}`}>
                  {data.healthMetrics.budgetHealth}
                </span>
              </div>
              <Progress value={data.healthMetrics.budgetHealth} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Cash Flow Health</span>
                <span className={`text-sm font-bold ${getHealthColor(data.healthMetrics.cashFlowHealth)}`}>
                  {data.healthMetrics.cashFlowHealth}
                </span>
              </div>
              <Progress value={data.healthMetrics.cashFlowHealth} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Schedule Health</span>
                <span className={`text-sm font-bold ${getHealthColor(data.healthMetrics.scheduleHealth)}`}>
                  {data.healthMetrics.scheduleHealth}
                </span>
              </div>
              <Progress value={data.healthMetrics.scheduleHealth} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Health</span>
                <span className={`text-sm font-bold ${getHealthColor(data.healthMetrics.overallHealth)}`}>
                  {data.healthMetrics.overallHealth}
                </span>
              </div>
              <Progress value={data.healthMetrics.overallHealth} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Trend Analysis</CardTitle>
            <CardDescription>Monthly revenue, costs, and profit tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomLineChart 
              data={data.monthlyTrend.map(item => ({
                name: item.month,
                value: item.profit
              }))}
              title="Monthly Profit Trend"
              color="#10B981"
            />
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Distribution</CardTitle>
            <CardDescription>Current cost allocation across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartCard 
              data={data.costBreakdown.map(item => ({
                name: item.category,
                value: item.amount
              }))}
              title="Cost Distribution"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Orders Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Change Orders
            </CardTitle>
            <CardDescription>
              Change order status and financial impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Value</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(data.changeOrders.totalValue)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{data.changeOrders.approved}</div>
                  <div className="text-xs text-green-600">Approved</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-700">{data.changeOrders.pending}</div>
                  <div className="text-xs text-yellow-600">Pending</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
            <CardDescription>
              Financial risk factors and potential impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.riskFactors.map((risk, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getRiskColor(risk.risk)}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{risk.category}</span>
                    <Badge variant="outline" className={`text-xs ${risk.risk === 'High' ? 'border-red-300' : risk.risk === 'Medium' ? 'border-yellow-300' : 'border-green-300'}`}>
                      {risk.risk}
                    </Badge>
                  </div>
                  <div className="text-xs opacity-80">
                    Potential Impact: {formatCurrency(risk.impact)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Retention Held</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(data.retention)}</div>
            <div className="text-xs text-muted-foreground">
              {((data.retention / data.currentApprovedValue) * 100).toFixed(1)}% of contract
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Project Scope</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{projectData.projectCount}</div>
            <div className="text-xs text-muted-foreground">
              {projectData.scope === 'single' ? 'Project' : 'Projects'} in view
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cost Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {(((data.currentApprovedValue - data.totalCosts) / data.currentApprovedValue) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              Cost under budget
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 