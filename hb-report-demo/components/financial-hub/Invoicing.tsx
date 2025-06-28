"use client";

import React, { useState } from "react";
import { FileText, Clock, CheckCircle, AlertTriangle, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InvoicingProps {
  userRole: string;
  projectData: any;
}

export default function Invoicing({ userRole, projectData }: InvoicingProps) {
  const [filter, setFilter] = useState("all");

  const getInvoiceData = () => {
    switch (userRole) {
      case 'project-manager':
        return {
          totalInvoiced: 45200000,
          outstanding: 2850000,
          overdue: 0,
          collected: 42350000,
          collectionRate: 93.7,
          avgDaysToPay: 35,
          invoices: [
            { id: "INV-2024-001", amount: 2850000, status: "pending", dueDate: "2024-02-15", client: "Tropical World", daysOld: 5 },
            { id: "INV-2024-002", amount: 1200000, status: "paid", dueDate: "2024-01-30", client: "Tropical World", daysOld: 0 },
            { id: "INV-2024-003", amount: 1800000, status: "paid", dueDate: "2024-01-15", client: "Tropical World", daysOld: 0 }
          ]
        };
      case 'project-executive':
        return {
          totalInvoiced: 241000000,
          outstanding: 8200000,
          overdue: 1200000,
          collected: 231600000,
          collectionRate: 96.1,
          avgDaysToPay: 38,
          invoices: [
            { id: "INV-2024-001", amount: 4200000, status: "pending", dueDate: "2024-02-15", client: "Medical Center East", daysOld: 5 },
            { id: "INV-2024-002", amount: 2400000, status: "pending", dueDate: "2024-02-10", client: "Tech Campus", daysOld: 10 },
            { id: "INV-2024-003", amount: 1200000, status: "overdue", dueDate: "2024-01-25", client: "Marina Bay", daysOld: 25 },
            { id: "INV-2024-004", amount: 3200000, status: "paid", dueDate: "2024-01-30", client: "Grandview Heights", daysOld: 0 }
          ]
        };
      default:
        return {
          totalInvoiced: 410000000,
          outstanding: 12500000,
          overdue: 2800000,
          collected: 394700000,
          collectionRate: 96.3,
          avgDaysToPay: 42,
          invoices: [
            { id: "INV-2024-001", amount: 4200000, status: "pending", dueDate: "2024-02-15", client: "Medical Center East", daysOld: 5 },
            { id: "INV-2024-002", amount: 2400000, status: "pending", dueDate: "2024-02-10", client: "Tech Campus", daysOld: 10 },
            { id: "INV-2024-003", amount: 1200000, status: "overdue", dueDate: "2024-01-25", client: "Marina Bay", daysOld: 25 },
            { id: "INV-2024-004", amount: 1600000, status: "overdue", dueDate: "2024-01-20", client: "Riverside Plaza", daysOld: 30 },
            { id: "INV-2024-005", amount: 3100000, status: "pending", dueDate: "2024-02-20", client: "Corporate Center", daysOld: 0 }
          ]
        };
    }
  };

  const data = getInvoiceData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "overdue": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredInvoices = filter === "all" 
    ? data.invoices 
    : data.invoices.filter(invoice => invoice.status === filter);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalInvoiced)}</div>
            <div className="text-xs text-muted-foreground">
              Lifetime invoicing volume
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(data.outstanding)}</div>
            <div className="text-xs text-muted-foreground">
              Pending collection
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(data.overdue)}</div>
            <div className="text-xs text-muted-foreground">
              Requires attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.collectionRate}%</div>
            <div className="text-xs text-muted-foreground">
              {data.avgDaysToPay} days average
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Invoice Management
            <div className="flex items-center gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={filter === "overdue" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("overdue")}
              >
                Overdue
              </Button>
              <Button
                variant={filter === "paid" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("paid")}
              >
                Paid
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Track and manage invoice status and collections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days Old</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>{invoice.daysOld || '-'}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(invoice.status)} text-xs`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
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
            <CardTitle className="text-sm">Collection Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Collected</span>
                <span className="font-medium">{formatCurrency(data.collected)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Rate</span>
                <span className="font-medium text-green-600">{data.collectionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Payment Timing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avgDaysToPay}</div>
            <div className="text-xs text-muted-foreground">Average days to payment</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.overdue > 0 ? (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Overdue invoices require attention</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">All invoices current</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 