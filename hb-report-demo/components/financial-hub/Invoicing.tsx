"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  DollarSign,
  FileText,
  Brain,
  Shield,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  XCircle,
  MessageSquare,
  Edit3,
  Save,
  X,
  User,
  Pause,
  Ban,
} from "lucide-react";

// Local type definitions
interface PaymentComment {
  id: string;
  payAppId: string;
  userId: string;
  userName: string;
  comment: string;
  timestamp: string;
  type: "general" | "approval" | "verification" | "compliance";
}

interface PaymentApproval {
  id: string;
  payAppId: string;
  reviewerId: string;
  reviewerName: string;
  status: "approved" | "pending" | "hold" | "rejected";
  verifiedAmount: number;
  originalAmount: number;
  comments: string;
  timestamp: string;
  reason?: string;
}

interface ComplianceItem {
  id: string;
  payAppId: string;
  type: "coi" | "lien_waiver" | "partial_lien_release" | "progress_photos" | "change_orders" | "safety_compliance" | "prevailing_wage" | "certified_payroll";
  label: string;
  required: boolean;
  status: "pending" | "submitted" | "approved" | "rejected" | "expired";
  description: string;
  dueDate?: string;
  submittedDate?: string;
  approvedDate?: string;
  externalSystemId?: string;
  documentUrl?: string;
  notes?: string;
}

interface PayApplication {
  id: string;
  period: string;
  amount: number;
  status: "draft" | "submitted" | "approved" | "paid";
  date: string;
  retentionAmount: number;
  netAmount: number;
  percentComplete: number;
  contractor: string;
  complianceItems: ComplianceItem[];
  comments: PaymentComment[];
  approvals: PaymentApproval[];
  currentApprovalStatus?: "approved" | "pending" | "hold" | "rejected";
  verifiedAmount?: number;
}

interface InvoicingProps {
  userRole: string;
  projectData: any;
}

export default function Invoicing({ userRole, projectData }: InvoicingProps) {
  const [selectedPayApp, setSelectedPayApp] = useState<PayApplication | null>(null);
  const [expandedPayApps, setExpandedPayApps] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingAmounts, setEditingAmounts] = useState<Set<string>>(new Set());
  const [tempAmounts, setTempAmounts] = useState<Record<string, number>>({});
  const [newComment, setNewComment] = useState("");
  const [approvalStatuses, setApprovalStatuses] = useState<Record<string, string>>({});
  const [approvalComments, setApprovalComments] = useState<Record<string, string>>({});

  // Mock current user (would come from auth context)
  const currentUser = {
    id: "user-001",
    name: "John Smith",
    role: "Project Manager",
  };

  // Role-based data generation
  const getPayApplicationData = (): PayApplication[] => {
    const baseApplications: Partial<PayApplication>[] = [
      {
        id: "PA-2024-001",
        period: "January 2024",
        status: "submitted",
        date: "2024-01-31",
        percentComplete: 25,
        contractor: "ABC Construction",
        currentApprovalStatus: "pending",
      },
      {
        id: "PA-2024-002",
        period: "February 2024",
        status: "approved",
        date: "2024-02-29",
        percentComplete: 45,
        contractor: "XYZ Builders",
        currentApprovalStatus: "approved",
      },
      {
        id: "PA-2024-003",
        period: "March 2024",
        status: "draft",
        date: "2024-03-31",
        percentComplete: 65,
        contractor: "DEF Contractors",
        currentApprovalStatus: "hold",
      },
    ];

    // Role-based scaling
    const getScaledAmount = (baseAmount: number) => {
      switch (userRole) {
        case 'project-manager':
          return baseAmount * 0.5; // Single project scale
        case 'project-executive':
          return baseAmount * 2.5; // Portfolio scale
        default:
          return baseAmount * 4.2; // Enterprise scale
      }
    };

    return baseApplications.map((app, index) => {
      const baseAmount = [125000, 150000, 175000][index];
      const amount = getScaledAmount(baseAmount);
      const retentionAmount = amount * 0.05;
      const netAmount = amount - retentionAmount;
      const verifiedAmount = index === 1 ? amount * 0.987 : amount; // Second one has adjustment

      return {
        ...app,
        amount,
        retentionAmount,
        netAmount,
        verifiedAmount,
        comments: generateComments(app.id!),
        approvals: generateApprovals(app.id!, amount, verifiedAmount),
        complianceItems: generateComplianceItems(app.id!),
      } as PayApplication;
    });
  };

  const generateComments = (payAppId: string): PaymentComment[] => {
    const commentSets = {
      "PA-2024-001": [
        {
          id: "comment-001",
          payAppId,
          userId: "user-002",
          userName: "Sarah Johnson",
          comment: "Foundation work looks good, but need to verify concrete testing results.",
          timestamp: "2024-02-01T10:30:00Z",
          type: "verification" as const,
        },
        {
          id: "comment-002",
          payAppId,
          userId: "user-003",
          userName: "Mike Davis",
          comment: "COI expires next month, need renewal before next pay app.",
          timestamp: "2024-02-01T14:15:00Z",
          type: "compliance" as const,
        },
      ],
      "PA-2024-002": [
        {
          id: "comment-003",
          payAppId,
          userId: "user-001",
          userName: "John Smith",
          comment: "Reduced amount by $2,000 due to incomplete electrical work.",
          timestamp: "2024-03-01T11:00:00Z",
          type: "approval" as const,
        },
      ],
      "PA-2024-003": [
        {
          id: "comment-004",
          payAppId,
          userId: "user-001",
          userName: "John Smith",
          comment: "On hold pending resolution of partial lien release rejection.",
          timestamp: "2024-04-01T09:30:00Z",
          type: "approval" as const,
        },
      ],
    };

    return commentSets[payAppId as keyof typeof commentSets] || [];
  };

  const generateApprovals = (payAppId: string, originalAmount: number, verifiedAmount: number): PaymentApproval[] => {
    return [
      {
        id: `approval-${payAppId}`,
        payAppId,
        reviewerId: "user-001",
        reviewerName: "John Smith",
        status: payAppId === "PA-2024-002" ? "approved" : payAppId === "PA-2024-003" ? "hold" : "pending",
        verifiedAmount,
        originalAmount,
        comments: payAppId === "PA-2024-002" ? "Approved with adjustment for incomplete electrical work" : 
                 payAppId === "PA-2024-003" ? "Hold pending compliance resolution" : "",
        timestamp: "2024-02-01T09:00:00Z",
        reason: payAppId === "PA-2024-003" ? "Compliance issues must be resolved" : undefined,
      },
    ];
  };

  const generateComplianceItems = (payAppId: string): ComplianceItem[] => {
    const baseItems = [
      {
        id: `comp-${payAppId}-coi`,
        payAppId,
        type: "coi" as const,
        label: "Certificate of Insurance",
        required: true,
        description: "Valid COI must be on file and current",
      },
      {
        id: `comp-${payAppId}-lien`,
        payAppId,
        type: "lien_waiver" as const,
        label: "Conditional Lien Waiver",
        required: true,
        description: "Conditional lien waiver for current period",
      },
    ];

    // Add conditional items based on pay app
    if (payAppId === "PA-2024-003") {
      baseItems.push({
        id: `comp-${payAppId}-partial`,
        payAppId,
        type: "partial_lien_release" as const,
        label: "Partial Lien Release",
        required: true,
        description: "Partial lien release for previous period work",
      });
    }

    return baseItems.map(item => ({
      ...item,
      status: payAppId === "PA-2024-003" && item.type === "partial_lien_release" ? "rejected" : 
              payAppId === "PA-2024-002" ? "approved" : 
              item.type === "coi" ? "approved" : "submitted",
      submittedDate: "2024-01-25",
      approvedDate: payAppId === "PA-2024-002" || item.type === "coi" ? "2024-01-26" : undefined,
      dueDate: item.type === "lien_waiver" ? "2024-02-05" : undefined,
      externalSystemId: `${item.type.toUpperCase()}-2024-001`,
      notes: payAppId === "PA-2024-003" && item.type === "partial_lien_release" ? 
             "Incorrect notarization, resubmission required" : undefined,
    }));
  };

  const enhancedPayApplications = useMemo(() => getPayApplicationData(), [userRole]);

  // Initialize approval statuses
  React.useEffect(() => {
    const initialStatuses: Record<string, string> = {};
    enhancedPayApplications.forEach((payApp) => {
      initialStatuses[payApp.id] = payApp.currentApprovalStatus || "pending";
    });
    setApprovalStatuses(initialStatuses);
  }, [enhancedPayApplications]);

  const handleAmountEdit = (payAppId: string) => {
    const payApp = enhancedPayApplications.find((pa) => pa.id === payAppId);
    if (payApp) {
      setTempAmounts({ ...tempAmounts, [payAppId]: payApp.verifiedAmount || payApp.amount });
      setEditingAmounts(new Set([...editingAmounts, payAppId]));
    }
  };

  const handleAmountSave = (payAppId: string) => {
    console.log(`Saving verified amount for ${payAppId}: ${tempAmounts[payAppId]}`);
    setEditingAmounts(new Set([...editingAmounts].filter((id) => id !== payAppId)));
  };

  const handleAmountCancel = (payAppId: string) => {
    const newTempAmounts = { ...tempAmounts };
    delete newTempAmounts[payAppId];
    setTempAmounts(newTempAmounts);
    setEditingAmounts(new Set([...editingAmounts].filter((id) => id !== payAppId)));
  };

  const handleAddComment = (payAppId: string) => {
    if (!newComment.trim()) return;

    const comment: PaymentComment = {
      id: `comment-${Date.now()}`,
      payAppId,
      userId: currentUser.id,
      userName: currentUser.name,
      comment: newComment,
      timestamp: new Date().toISOString(),
      type: "general",
    };

    console.log("Adding comment:", comment);
    setNewComment("");
  };

  const handleApprovalStatusChange = (payAppId: string, status: string) => {
    setApprovalStatuses({ ...approvalStatuses, [payAppId]: status });
  };

  const handleSubmitApproval = (payAppId: string) => {
    const payApp = enhancedPayApplications.find((pa) => pa.id === payAppId);
    if (!payApp) return;

    const approval: PaymentApproval = {
      id: `approval-${Date.now()}`,
      payAppId,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      status: approvalStatuses[payAppId] as any,
      verifiedAmount: tempAmounts[payAppId] || payApp.verifiedAmount || payApp.amount,
      originalAmount: payApp.amount,
      comments: approvalComments[payAppId] || "",
      timestamp: new Date().toISOString(),
    };

    console.log("Submitting approval:", approval);
    setApprovalComments({ ...approvalComments, [payAppId]: "" });
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "hold":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getApprovalIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "hold":
        return <Pause className="h-4 w-4 text-orange-600" />;
      case "rejected":
        return <Ban className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const togglePayAppExpansion = (payAppId: string) => {
    const newExpanded = new Set(expandedPayApps);
    if (newExpanded.has(payAppId)) {
      newExpanded.delete(payAppId);
    } else {
      newExpanded.add(payAppId);
    }
    setExpandedPayApps(newExpanded);
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "submitted":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "expired":
        return "text-red-600 bg-red-100 border-red-300";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "submitted":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleRefreshCompliance = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = enhancedPayApplications.length;
    const draft = enhancedPayApplications.filter((pa) => pa.status === "draft").length;
    const submitted = enhancedPayApplications.filter((pa) => pa.status === "submitted").length;
    const approved = enhancedPayApplications.filter((pa) => pa.currentApprovalStatus === "approved").length;
    const pending = enhancedPayApplications.filter((pa) => pa.currentApprovalStatus === "pending").length;
    const hold = enhancedPayApplications.filter((pa) => pa.currentApprovalStatus === "hold").length;
    const rejected = enhancedPayApplications.filter((pa) => pa.currentApprovalStatus === "rejected").length;
    const totalAmount = enhancedPayApplications.reduce((sum, pa) => sum + pa.amount, 0);
    const totalVerified = enhancedPayApplications.reduce((sum, pa) => sum + (pa.verifiedAmount || pa.amount), 0);

    return { total, draft, submitted, approved, pending, hold, rejected, totalAmount, totalVerified };
  }, [enhancedPayApplications]);

  return (
    <div className="space-y-6">
      {/* HBI AI Insights */}
      <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Brain className="h-5 w-5" />
            </div>
            <div className="flex-1">
              HBI Payment Approval Analysis
              <p className="text-xs font-normal text-blue-100 mt-0.5">AI-Powered Approval Workflow & Risk Assessment</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <Alert className="border-yellow-200 dark:border-yellow-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">HBI Approval Workflow Insights</p>
                <p className="text-sm text-muted-foreground">
                  {summaryStats.hold} payment{summaryStats.hold !== 1 ? 's' : ''} on hold due to compliance issues. Average approval time: 2.3 days.
                </p>
                <p className="text-sm font-medium">
                  Recommendation: {summaryStats.hold > 0 ? 'Expedite compliance resolution to maintain payment schedule.' : 'All payments are progressing normally.'}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{summaryStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{summaryStats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{summaryStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On Hold</p>
                <p className="text-2xl font-bold text-orange-600">{summaryStats.hold}</p>
              </div>
              <Pause className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Original Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(summaryStats.totalAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified Amount</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(summaryStats.totalVerified)}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Authorization & Approval</CardTitle>
              <CardDescription>Review, verify amounts, and approve payment applications</CardDescription>
            </div>
            <Button
              onClick={handleRefreshCompliance}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enhancedPayApplications.map((payApp) => (
              <Card key={payApp.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePayAppExpansion(payApp.id)}
                        className="p-1"
                      >
                        {expandedPayApps.has(payApp.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <h3 className="font-semibold">
                          {payApp.id} - {payApp.contractor}
                        </h3>
                        <p className="text-sm text-muted-foreground">{payApp.period}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {editingAmounts.has(payApp.id) ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={tempAmounts[payApp.id] || 0}
                                onChange={(e) =>
                                  setTempAmounts({
                                    ...tempAmounts,
                                    [payApp.id]: Number.parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-32 text-right"
                              />
                              <Button size="sm" onClick={() => handleAmountSave(payApp.id)}>
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleAmountCancel(payApp.id)}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="font-semibold">
                                  {formatCurrency(payApp.verifiedAmount || payApp.amount)}
                                </p>
                                {payApp.verifiedAmount !== payApp.amount && (
                                  <p className="text-xs text-muted-foreground">
                                    Original: {formatCurrency(payApp.amount)}
                                  </p>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleAmountEdit(payApp.id)}
                                className="p-1"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getApprovalStatusColor(payApp.currentApprovalStatus || "pending")}`}
                        >
                          {getApprovalIcon(payApp.currentApprovalStatus || "pending")}
                          {payApp.currentApprovalStatus || "pending"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Collapsible open={expandedPayApps.has(payApp.id)}>
                    <CollapsibleContent className="mt-4">
                      <div className="border-t pt-4 space-y-6">
                        {/* Approval Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Approval Controls */}
                          <div className="space-y-4">
                            <h4 className="font-medium flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Payment Approval
                            </h4>
                            <div className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                              <div>
                                <Label htmlFor={`approval-status-${payApp.id}`}>Approval Status</Label>
                                <Select
                                  value={approvalStatuses[payApp.id] || "pending"}
                                  onValueChange={(value) => handleApprovalStatusChange(payApp.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="hold">Hold</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor={`approval-comment-${payApp.id}`}>Approval Comments</Label>
                                <Textarea
                                  id={`approval-comment-${payApp.id}`}
                                  value={approvalComments[payApp.id] || ""}
                                  onChange={(e) =>
                                    setApprovalComments({
                                      ...approvalComments,
                                      [payApp.id]: e.target.value,
                                    })
                                  }
                                  placeholder="Add approval comments or reasons for hold/rejection..."
                                  rows={3}
                                />
                              </div>
                              <Button
                                onClick={() => handleSubmitApproval(payApp.id)}
                                className="w-full"
                                disabled={!approvalStatuses[payApp.id]}
                              >
                                Submit Approval Decision
                              </Button>
                            </div>
                          </div>

                          {/* Comments Section */}
                          <div className="space-y-4">
                            <h4 className="font-medium flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Comments & Notes
                            </h4>
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Input
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  placeholder="Add a comment..."
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleAddComment(payApp.id);
                                    }
                                  }}
                                />
                                <Button onClick={() => handleAddComment(payApp.id)} disabled={!newComment.trim()}>
                                  Add
                                </Button>
                              </div>
                              <ScrollArea className="h-32 border rounded-lg p-3">
                                <div className="space-y-2">
                                  {payApp.comments.map((comment) => (
                                    <div key={comment.id} className="text-sm">
                                      <div className="flex items-center gap-2 mb-1">
                                        <User className="h-3 w-3" />
                                        <span className="font-medium">{comment.userName}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {comment.type}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                          {formatDate(comment.timestamp)}
                                        </span>
                                      </div>
                                      <p className="text-muted-foreground ml-5">{comment.comment}</p>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Compliance Section */}
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Compliance Requirements
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {payApp.complianceItems.map((item) => (
                              <div
                                key={item.id}
                                className={`p-3 rounded-lg border ${getComplianceStatusColor(item.status)}`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-2">
                                    {getComplianceIcon(item.status)}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm">{item.label}</p>
                                        {item.required && (
                                          <Badge variant="outline" className="text-xs">
                                            Required
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                                      {item.notes && (
                                        <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">Note: {item.notes}</p>
                                      )}
                                    </div>
                                  </div>
                                  <Badge
                                    variant={item.status === "approved" ? "default" : "secondary"}
                                    className="text-xs"
                                  >
                                    {item.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 