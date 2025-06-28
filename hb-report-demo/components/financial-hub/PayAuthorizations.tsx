"use client";

import React from "react";
import { CheckCircle, Clock, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PayAuthorizationsProps {
  userRole: string;
  projectData: any;
}

export default function PayAuthorizations({ userRole, projectData }: PayAuthorizationsProps) {
  const getPayAuthData = () => {
    switch (userRole) {
      case 'project-manager':
        return {
          pendingApprovals: 3,
          totalRequests: 12,
          approvedAmount: 8500000,
          pendingAmount: 2850000
        };
      case 'project-executive':
        return {
          pendingApprovals: 12,
          totalRequests: 48,
          approvedAmount: 45200000,
          pendingAmount: 8200000
        };
      default:
        return {
          pendingApprovals: 23,
          totalRequests: 89,
          approvedAmount: 85600000,
          pendingAmount: 12500000
        };
    }
  };

  const data = getPayAuthData();

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
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.pendingApprovals}</div>
            <div className="text-xs text-muted-foreground">Awaiting approval</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRequests}</div>
            <div className="text-xs text-muted-foreground">This month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Amount</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(data.approvedAmount)}</div>
            <div className="text-xs text-muted-foreground">YTD approved</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(data.pendingAmount)}</div>
            <div className="text-xs text-muted-foreground">Requires approval</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Authorization Workflow</CardTitle>
          <CardDescription>
            Streamlined approval process for payment authorizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Payment Authorization Management</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This module provides comprehensive payment authorization workflows, approval tracking, 
              and automated routing based on user roles and project requirements.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
              <Badge variant="outline" className="p-2">
                Approval Routing
              </Badge>
              <Badge variant="outline" className="p-2">
                Status Tracking
              </Badge>
              <Badge variant="outline" className="p-2">
                Audit Trail
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 