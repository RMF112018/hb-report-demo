"use client";

import React, { useState } from "react";
import { 
  Droplets, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  AlertTriangle,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomLineChart } from "@/components/charts/LineChart";
import { CustomBarChart } from "@/components/charts/BarChart";
import { PieChartCard } from "@/components/charts/PieChart";

interface CashFlowAnalysisProps {
  userRole: string;
  projectData: any;
}

export default function CashFlowAnalysis({ userRole, projectData }: CashFlowAnalysisProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("12months");

  // Role-based cash flow data
  const getCashFlowData = () => {
    switch (userRole) {
      case 'project-manager':
        return {
          currentBalance: 9732503.32,
          netCashFlow: 8215006.64,
          totalInflows: 53476271.19,
          totalOutflows: 45261264.55,
          projectedFlow: 2850000,
          workingCapital: 9732503.32,
          daysOutstanding: 35,
          retentionHeld: 2861632.74,
          monthlyTrend: [
            { month: "Jul", inflow: 4200000, outflow: 3800000, net: 400000 },
            { month: "Aug", inflow: 3800000, outflow: 3900000, net: -100000 },
            { month: "Sep", inflow: 4500000, outflow: 3600000, net: 900000 },
            { month: "Oct", inflow: 4800000, outflow: 4100000, net: 700000 },
            { month: "Nov", inflow: 5200000, outflow: 4300000, net: 900000 },
            { month: "Dec", inflow: 4800000, outflow: 4200000, net: 600000 },
            { month: "Jan", inflow: 5500000, outflow: 4600000, net: 900000 }
          ],
          forecast: [
            { month: "Feb", projected: 5200000, confidence: 85 },
            { month: "Mar", projected: 5800000, confidence: 82 },
            { month: "Apr", projected: 4900000, confidence: 78 },
            { month: "May", projected: 5600000, confidence: 75 },
            { month: "Jun", projected: 5100000, confidence: 72 }
          ],
          sources: [
            { category: "Contract Payments", amount: 45200000, percentage: 84.5 },
            { category: "Change Orders", amount: 4800000, percentage: 9.0 },
            { category: "Retention Release", amount: 2200000, percentage: 4.1 },
            { category: "Other", amount: 1276271.19, percentage: 2.4 }
          ],
          uses: [
            { category: "Subcontractor Payments", amount: 28500000, percentage: 63.0 },
            { category: "Material Costs", amount: 12200000, percentage: 27.0 },
            { category: "Labor", amount: 3200000, percentage: 7.1 },
            { category: "Equipment", amount: 1361264.55, percentage: 2.9 }
          ]
        };
      case 'project-executive':
        return {
          currentBalance: 48200000,
          netCashFlow: 42630000,
          totalInflows: 285480000,
          totalOutflows: 242850000,
          projectedFlow: 14250000,
          workingCapital: 48200000,
          daysOutstanding: 38,
          retentionHeld: 14274000,
          monthlyTrend: [
            { month: "Jul", inflow: 21000000, outflow: 19000000, net: 2000000 },
            { month: "Aug", inflow: 19000000, outflow: 19500000, net: -500000 },
            { month: "Sep", inflow: 22500000, outflow: 18000000, net: 4500000 },
            { month: "Oct", inflow: 24000000, outflow: 20500000, net: 3500000 },
            { month: "Nov", inflow: 26000000, outflow: 21500000, net: 4500000 },
            { month: "Dec", inflow: 24000000, outflow: 21000000, net: 3000000 },
            { month: "Jan", inflow: 27500000, outflow: 23000000, net: 4500000 }
          ],
          forecast: [
            { month: "Feb", projected: 26000000, confidence: 88 },
            { month: "Mar", projected: 29000000, confidence: 85 },
            { month: "Apr", projected: 24500000, confidence: 81 },
            { month: "May", projected: 28000000, confidence: 78 },
            { month: "Jun", projected: 25500000, confidence: 75 }
          ],
          sources: [
            { category: "Contract Payments", amount: 241000000, percentage: 84.4 },
            { category: "Change Orders", amount: 24000000, percentage: 8.4 },
            { category: "Retention Release", amount: 14200000, percentage: 5.0 },
            { category: "Other", amount: 6280000, percentage: 2.2 }
          ],
          uses: [
            { category: "Subcontractor Payments", amount: 152800000, percentage: 62.9 },
            { category: "Material Costs", amount: 65400000, percentage: 26.9 },
            { category: "Labor", amount: 17200000, percentage: 7.1 },
            { category: "Equipment", percentage: 3.1, amount: 7450000 }
          ]
        };
      default:
        return {
          currentBalance: 82500000,
          netCashFlow: 72830000,
          totalInflows: 485280000,
          totalOutflows: 412450000,
          projectedFlow: 24140000,
          workingCapital: 82500000,
          daysOutstanding: 42,
          retentionHeld: 24264000,
          monthlyTrend: [
            { month: "Jul", inflow: 35000000, outflow: 32000000, net: 3000000 },
            { month: "Aug", inflow: 32000000, outflow: 33000000, net: -1000000 },
            { month: "Sep", inflow: 38000000, outflow: 30000000, net: 8000000 },
            { month: "Oct", inflow: 40000000, outflow: 34000000, net: 6000000 },
            { month: "Nov", inflow: 44000000, outflow: 36000000, net: 8000000 },
            { month: "Dec", inflow: 41000000, outflow: 35000000, net: 6000000 },
            { month: "Jan", inflow: 48000000, outflow: 39000000, net: 9000000 }
          ],
          forecast: [
            { month: "Feb", projected: 44000000, confidence: 89 },
            { month: "Mar", projected: 49000000, confidence: 86 },
            { month: "Apr", projected: 41500000, confidence: 82 },
            { month: "May", projected: 47000000, confidence: 79 },
            { month: "Jun", projected: 43500000, confidence: 76 }
          ],
          sources: [
            { category: "Contract Payments", amount: 410000000, percentage: 84.5 },
            { category: "Change Orders", amount: 40800000, percentage: 8.4 },
            { category: "Retention Release", amount: 24100000, percentage: 5.0 },
            { category: "Other", amount: 10380000, percentage: 2.1 }
          ],
          uses: [
            { category: "Subcontractor Payments", amount: 259400000, percentage: 62.9 },
            { category: "Material Costs", amount: 111000000, percentage: 26.9 },
            { category: "Labor", amount: 29200000, percentage: 7.1 },
            { category: "Equipment", amount: 12850000, percentage: 3.1 }
          ]
        };
    }
  };

  const data = getCashFlowData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getFlowColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getFlowIcon = (value: number) => {
    return value >= 0 ? <ArrowUpCircle className="h-4 w-4 text-green-600" /> : <ArrowDownCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(data.currentBalance)}</div>
            <div className="text-xs text-muted-foreground">
              Available working capital
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getFlowColor(data.netCashFlow)}`}>
              {formatCurrency(data.netCashFlow)}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getFlowIcon(data.netCashFlow)}
              <span>{data.netCashFlow >= 0 ? 'Positive' : 'Negative'} flow</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Flow</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(data.projectedFlow)}</div>
            <div className="text-xs text-muted-foreground">
              Next 30 days forecast
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Outstanding</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.daysOutstanding}</div>
            <div className="text-xs text-muted-foreground">
              Average collection period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Trend Analysis</CardTitle>
          <CardDescription>
            Monthly cash inflows, outflows, and net position over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomLineChart 
            data={data.monthlyTrend.map(item => ({
              name: item.month,
              value: item.net
            }))}
            title="Net Cash Flow Trend"
            color="#3B82F6"
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Flow Analysis</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="sources">Sources & Uses</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpCircle className="h-5 w-5 text-green-600" />
                  Cash Inflows
                </CardTitle>
                <CardDescription>
                  Total: {formatCurrency(data.totalInflows)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{source.category}</span>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(source.amount)}</div>
                        <div className="text-xs text-muted-foreground">{source.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownCircle className="h-5 w-5 text-red-600" />
                  Cash Outflows
                </CardTitle>
                <CardDescription>
                  Total: {formatCurrency(data.totalOutflows)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.uses.map((use, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{use.category}</span>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(use.amount)}</div>
                        <div className="text-xs text-muted-foreground">{use.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cash Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(365 / data.daysOutstanding).toFixed(1)}x</div>
                <div className="text-xs text-muted-foreground">
                  Annual cash turnover rate
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Retention Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.retentionHeld)}</div>
                <div className="text-xs text-muted-foreground">
                  {((data.retentionHeld / data.totalInflows) * 100).toFixed(1)}% of total inflows
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Flow Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {((data.netCashFlow / data.totalInflows) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Net margin on cash flows
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Forecast</CardTitle>
              <CardDescription>
                5-month projection with confidence intervals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.forecast.map((forecast, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium">{forecast.month}</div>
                      <div className="text-sm text-muted-foreground">
                        {forecast.confidence}% confidence
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{formatCurrency(forecast.projected)}</div>
                      <Badge 
                        variant={forecast.confidence >= 80 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {forecast.confidence >= 80 ? "High" : "Medium"} Confidence
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forecast Assumptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Based on historical payment patterns</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Includes approved change orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Excludes potential weather delays</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Does not account for market volatility</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cash Inflow Sources</CardTitle>
                <CardDescription>Distribution of cash inflows by category</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChartCard 
                  data={data.sources.map(item => ({
                    name: item.category,
                    value: item.amount
                  }))}
                  title="Inflow Sources"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cash Outflow Uses</CardTitle>
                <CardDescription>Distribution of cash outflows by category</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChartCard 
                  data={data.uses.map(item => ({
                    name: item.category,
                    value: item.amount
                  }))}
                  title="Outflow Uses"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 