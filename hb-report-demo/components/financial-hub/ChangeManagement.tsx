"use client";

import React from "react";
import { GitBranch, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChangeManagementProps {
  userRole: string;
  projectData: any;
}

export default function ChangeManagement({ userRole, projectData }: ChangeManagementProps) {
  const getChangeOrderData = () => {
    switch (userRole) {
      case 'project-manager':
        return {
          approved: 5,
          pending: 2,
          rejected: 1,
          totalValue: 864509,
          approvedValue: 685000,
          pendingValue: 179509
        };
      case 'project-executive':
        return {
          approved: 15,
          pending: 7,
          rejected: 3,
          totalValue: 4440000,
          approvedValue: 3200000,
          pendingValue: 1240000
        };
      default:
        return {
          approved: 28,
          pending: 12,
          rejected: 6,
          totalValue: 6870000,
          approvedValue: 5100000,
          pendingValue: 1770000
        };
    }
  };

  const data = getChangeOrderData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.approved}</div>
            <div className="text-xs text-muted-foreground">{formatCurrency(data.approvedValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{data.pending}</div>
            <div className="text-xs text-muted-foreground">{formatCurrency(data.pendingValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.rejected}</div>
            <div className="text-xs text-muted-foreground">Denied requests</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalValue)}</div>
            <div className="text-xs text-muted-foreground">All change orders</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Change Order Management
          </CardTitle>
          <CardDescription>
            Track and manage change orders and their financial impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Change Order Tracking</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Comprehensive change order management system with approval workflows, 
              financial impact analysis, and real-time status tracking.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 