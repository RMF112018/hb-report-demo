"use client";

import React from "react";
import { PieChart, DollarSign, TrendingUp, BarChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CostTrackingProps {
  userRole: string;
  projectData: any;
}

export default function CostTracking({ userRole, projectData }: CostTrackingProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Cost Tracking & Analysis
          </CardTitle>
          <CardDescription>
            Real-time cost tracking and expense categorization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Advanced Cost Tracking</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Real-time cost monitoring with automated categorization, variance analysis, 
              and predictive cost modeling for better project financial control.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 