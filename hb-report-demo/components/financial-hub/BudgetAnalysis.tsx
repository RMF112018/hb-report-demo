"use client";

import React, { useState } from "react";
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Target,
  DollarSign,
  Percent,
  Filter
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomBarChart } from "@/components/charts/BarChart";

interface BudgetAnalysisProps {
  userRole: string;
  projectData: any;
}

export default function BudgetAnalysis({ userRole, projectData }: BudgetAnalysisProps) {
  const [filterCategory, setFilterCategory] = useState("all");

  // Role-based budget data
  const getBudgetData = () => {
    switch (userRole) {
      case 'project-manager':
        return {
          totalBudget: 57235491,
          actualCosts: 45261264.55,
          variance: 11974226.45,
          variancePercent: 20.9,
          commitments: 48500000,
          forecasted: 55800000,
          contingency: 860000,
          contingencyUsed: 35000,
          categories: [
            {
              id: "labor",
              name: "Labor",
              budgeted: 18500000,
              actual: 16200000,
              committed: 17800000,
              variance: 2300000,
              variancePercent: 12.4,
              status: "under"
            },
            {
              id: "materials",
              name: "Materials",
              budgeted: 22800000,
              actual: 20100000,
              committed: 21500000,
              variance: 2700000,
              variancePercent: 11.8,
              status: "under"
            },
            {
              id: "equipment",
              name: "Equipment",
              budgeted: 8200000,
              actual: 7800000,
              committed: 7900000,
              variance: 400000,
              variancePercent: 4.9,
              status: "under"
            },
            {
              id: "overhead",
              name: "Overhead",
              budgeted: 7735491,
              actual: 7761264.55,
              committed: 7800000,
              variance: -25773.55,
              variancePercent: -0.3,
              status: "over"
            }
          ]
        };
      case 'project-executive':
        return {
          totalBudget: 285480000,
          actualCosts: 242850000,
          variance: 42630000,
          variancePercent: 14.9,
          commitments: 268500000,
          forecasted: 278800000,
          contingency: 4280000,
          contingencyUsed: 185000,
          categories: [
            {
              id: "labor",
              name: "Labor",
              budgeted: 92500000,
              actual: 78200000,
              committed: 86800000,
              variance: 14300000,
              variancePercent: 15.5,
              status: "under"
            },
            {
              id: "materials",
              name: "Materials",
              budgeted: 114000000,
              actual: 108100000,
              committed: 112500000,
              variance: 5900000,
              variancePercent: 5.2,
              status: "under"
            },
            {
              id: "equipment",
              name: "Equipment",
              budgeted: 41000000,
              actual: 38800000,
              committed: 39900000,
              variance: 2200000,
              variancePercent: 5.4,
              status: "under"
            },
            {
              id: "overhead",
              name: "Overhead",
              budgeted: 37980000,
              actual: 38850000,
              committed: 38200000,
              variance: -870000,
              variancePercent: -2.3,
              status: "over"
            }
          ]
        };
      default:
        return {
          totalBudget: 485280000,
          actualCosts: 412450000,
          variance: 72830000,
          variancePercent: 15.0,
          commitments: 458500000,
          forecasted: 472800000,
          contingency: 7280000,
          contingencyUsed: 485000,
          categories: [
            {
              id: "labor",
              name: "Labor",
              budgeted: 156800000,
              actual: 133200000,
              committed: 148800000,
              variance: 23600000,
              variancePercent: 15.1,
              status: "under"
            },
            {
              id: "materials",
              name: "Materials",
              budgeted: 193200000,
              actual: 183100000,
              committed: 188500000,
              variance: 10100000,
              variancePercent: 5.2,
              status: "under"
            },
            {
              id: "equipment",
              name: "Equipment",
              budgeted: 69400000,
              actual: 65800000,
              committed: 67900000,
              variance: 3600000,
              variancePercent: 5.2,
              status: "under"
            },
            {
              id: "overhead",
              name: "Overhead",
              budgeted: 65880000,
              actual: 66050000,
              committed: 66200000,
              variance: -170000,
              variancePercent: -0.3,
              status: "over"
            }
          ]
        };
    }
  };

  const data = getBudgetData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getVarianceColor = (status: string) => {
    return status === "under" ? "text-green-600" : "text-red-600";
  };

  const getVarianceIcon = (status: string) => {
    return status === "under" ? <TrendingDown className="h-4 w-4 text-green-600" /> : <TrendingUp className="h-4 w-4 text-red-600" />;
  };

  const filteredCategories = filterCategory === "all" 
    ? data.categories 
    : data.categories.filter(cat => cat.status === filterCategory);

  const chartData = data.categories.map(cat => ({
    name: cat.name,
    budgeted: cat.budgeted,
    actual: cat.actual,
    committed: cat.committed
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalBudget)}</div>
            <div className="text-xs text-muted-foreground">
              Original contract amount
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actual Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.actualCosts)}</div>
            <div className="text-xs text-muted-foreground">
              {((data.actualCosts / data.totalBudget) * 100).toFixed(1)}% of budget
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Variance</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getVarianceColor(data.variance > 0 ? "under" : "over")}`}>
              {data.variance > 0 ? '+' : ''}{formatCurrency(data.variance)}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getVarianceIcon(data.variance > 0 ? "under" : "over")}
              <span>{Math.abs(data.variancePercent).toFixed(1)}% {data.variance > 0 ? 'under' : 'over'} budget</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contingency</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.contingency - data.contingencyUsed)}</div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(data.contingencyUsed)} used of {formatCurrency(data.contingency)}
            </div>
            <Progress 
              value={(data.contingencyUsed / data.contingency) * 100} 
              className="h-2 mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Actual Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual by Category</CardTitle>
          <CardDescription>
            Comparison of budgeted amounts, committed costs, and actual expenditures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomBarChart 
            data={chartData.map(item => ({
              name: item.name,
              value: item.budgeted
            }))}
            title="Budget vs Actual"
            color="#3B82F6"
          />
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Budget Category Analysis
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <div className="flex gap-2">
                <Button
                  variant={filterCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterCategory === "under" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory("under")}
                >
                  Under Budget
                </Button>
                <Button
                  variant={filterCategory === "over" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory("over")}
                >
                  Over Budget
                </Button>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            Detailed breakdown of budget performance by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Budgeted</TableHead>
                <TableHead className="text-right">Committed</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Variance</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-right">{formatCurrency(category.budgeted)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(category.committed)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(category.actual)}</TableCell>
                  <TableCell className={`text-right ${getVarianceColor(category.status)}`}>
                    {category.variance > 0 ? '+' : ''}{formatCurrency(category.variance)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={category.status === "under" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {category.status === "under" ? "Under Budget" : "Over Budget"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Budget Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Spent</span>
                <span className="font-medium">{((data.actualCosts / data.totalBudget) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(data.actualCosts / data.totalBudget) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Committed</span>
                <span className="font-medium">{((data.commitments / data.totalBudget) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(data.commitments / data.totalBudget) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Forecast Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.forecasted)}</div>
            <div className="text-xs text-muted-foreground">Forecasted total cost</div>
            <div className={`text-sm mt-2 ${data.forecasted <= data.totalBudget ? 'text-green-600' : 'text-red-600'}`}>
              {data.forecasted <= data.totalBudget ? '✓' : '⚠'} 
              {data.forecasted <= data.totalBudget 
                ? ` ${formatCurrency(data.totalBudget - data.forecasted)} under budget`
                : ` ${formatCurrency(data.forecasted - data.totalBudget)} over budget`
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.categories.filter(cat => cat.status === "over").length > 0 ? (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">
                    {data.categories.filter(cat => cat.status === "over").length} categories over budget
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">All categories within budget</span>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Contingency utilization: {((data.contingencyUsed / data.contingency) * 100).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 