"use client";

import React, { useState } from "react";
import { TrendingUp, Target, AlertTriangle, Calculator, BarChart3, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CustomLineChart } from "@/components/charts/LineChart";

interface ForecastingProps {
  userRole: string;
  projectData: any;
}

export default function Forecasting({ userRole, projectData }: ForecastingProps) {
  const [scenario, setScenario] = useState("base");

  const getForecastData = () => {
    switch (userRole) {
      case 'project-manager':
        return {
          scenarios: {
            base: { totalCost: 55800000, profit: 2300000, margin: 4.1, confidence: 85 },
            optimistic: { totalCost: 53200000, profit: 4900000, margin: 8.4, confidence: 65 },
            pessimistic: { totalCost: 58600000, profit: -500000, margin: -0.9, confidence: 75 }
          },
          monthlyForecast: [
            { month: "Feb", base: 4800000, optimistic: 4600000, pessimistic: 5200000 },
            { month: "Mar", base: 5200000, optimistic: 4900000, pessimistic: 5600000 },
            { month: "Apr", base: 4900000, optimistic: 4700000, pessimistic: 5300000 },
            { month: "May", base: 5400000, optimistic: 5100000, pessimistic: 5800000 },
            { month: "Jun", base: 5100000, optimistic: 4800000, pessimistic: 5500000 }
          ]
        };
      case 'project-executive':
        return {
          scenarios: {
            base: { totalCost: 278800000, profit: 11120000, margin: 3.9, confidence: 82 },
            optimistic: { totalCost: 265200000, profit: 24720000, margin: 8.5, confidence: 68 },
            pessimistic: { totalCost: 295600000, profit: -6680000, margin: -2.3, confidence: 78 }
          },
          monthlyForecast: [
            { month: "Feb", base: 24000000, optimistic: 22800000, pessimistic: 26000000 },
            { month: "Mar", base: 26000000, optimistic: 24500000, pessimistic: 28000000 },
            { month: "Apr", base: 24500000, optimistic: 23200000, pessimistic: 26500000 },
            { month: "May", base: 27000000, optimistic: 25500000, pessimistic: 29000000 },
            { month: "Jun", base: 25500000, optimistic: 24000000, pessimistic: 27500000 }
          ]
        };
      default:
        return {
          scenarios: {
            base: { totalCost: 472800000, profit: 19350000, margin: 3.9, confidence: 79 },
            optimistic: { totalCost: 450200000, profit: 42950000, margin: 8.7, confidence: 65 },
            pessimistic: { totalCost: 502600000, profit: -10450000, margin: -2.1, confidence: 82 }
          },
          monthlyForecast: [
            { month: "Feb", base: 40000000, optimistic: 38000000, pessimistic: 43000000 },
            { month: "Mar", base: 44000000, optimistic: 41500000, pessimistic: 47000000 },
            { month: "Apr", base: 41500000, optimistic: 39200000, pessimistic: 44500000 },
            { month: "May", base: 45000000, optimistic: 42500000, pessimistic: 48000000 },
            { month: "Jun", base: 42500000, optimistic: 40000000, pessimistic: 45500000 }
          ]
        };
    }
  };

  const data = getForecastData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const currentScenario = data.scenarios[scenario as keyof typeof data.scenarios];

  return (
    <div className="space-y-6">
      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Forecast Scenarios
          </CardTitle>
          <CardDescription>
            Select a scenario to view detailed financial projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              variant={scenario === "optimistic" ? "default" : "outline"}
              onClick={() => setScenario("optimistic")}
              size="sm"
            >
              Optimistic
            </Button>
            <Button
              variant={scenario === "base" ? "default" : "outline"}
              onClick={() => setScenario("base")}
              size="sm"
            >
              Base Case
            </Button>
            <Button
              variant={scenario === "pessimistic" ? "default" : "outline"}
              onClick={() => setScenario("pessimistic")}
              size="sm"
            >
              Pessimistic
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Forecasted Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(currentScenario.totalCost)}</div>
                <Badge variant={scenario === "optimistic" ? "default" : scenario === "pessimistic" ? "destructive" : "secondary"}>
                  {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Case
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Projected Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${currentScenario.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(currentScenario.profit)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentScenario.margin}% margin
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Confidence Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{currentScenario.confidence}%</div>
                <Progress value={currentScenario.confidence} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Cost Forecast Comparison</CardTitle>
          <CardDescription>
            Projected monthly costs across different scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomLineChart 
            data={data.monthlyForecast.map(item => ({
              name: item.month,
              value: item.base
            }))}
            title="Forecast Trend (Base Case)"
            color="#3B82F6"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Assumptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Key Assumptions
            </CardTitle>
            <CardDescription>
              Factors influencing the {scenario} scenario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scenario === "optimistic" && (
                <>
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">No weather delays</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Material cost stability</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Efficient labor productivity</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Early project completion</span>
                  </div>
                </>
              )}
              {scenario === "base" && (
                <>
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Normal weather patterns</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Moderate material inflation</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Standard productivity rates</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">On-schedule completion</span>
                  </div>
                </>
              )}
              {scenario === "pessimistic" && (
                <>
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Significant weather delays</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">High material cost inflation</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Labor shortage impacts</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Schedule overruns</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Factors
            </CardTitle>
            <CardDescription>
              Potential risks affecting forecast accuracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="font-medium text-sm">Material Price Volatility</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Steel and concrete prices remain unstable
                </div>
                <Badge variant="outline" className="mt-2 text-xs">Medium Risk</Badge>
              </div>
              
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-medium text-sm">Labor Availability</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Skilled labor shortage in region
                </div>
                <Badge variant="destructive" className="mt-2 text-xs">High Risk</Badge>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-medium text-sm">Weather Patterns</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Hurricane season approaching
                </div>
                <Badge variant="outline" className="mt-2 text-xs">Medium Risk</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Accuracy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Forecast Performance
          </CardTitle>
          <CardDescription>
            Historical accuracy of financial projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">92.3%</div>
              <div className="text-sm text-muted-foreground">Revenue Accuracy</div>
              <Progress value={92.3} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">88.7%</div>
              <div className="text-sm text-muted-foreground">Cost Accuracy</div>
              <Progress value={88.7} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">85.4%</div>
              <div className="text-sm text-muted-foreground">Timeline Accuracy</div>
              <Progress value={85.4} className="h-2 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 