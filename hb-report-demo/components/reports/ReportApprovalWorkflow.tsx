"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  AlertTriangle,
  User,
  Calendar,
  Building,
  MessageSquare,
  Send,
  Filter,
  SortAsc,
  MoreHorizontal
} from "lucide-react"

interface Report {
  id: string
  name: string
  type: "financial-review" | "monthly-progress" | "monthly-owner"
  projectId: string
  projectName: string
  status: "draft" | "submitted" | "approved" | "rejected" | "published"
  creatorId: string
  creatorName: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  sectionCount: number
  pageCount: number
  size: string
  version: number
  tags: string[]
}

interface ReportApprovalWorkflowProps {
  userRole: string
  reports: Report[]
  onReportUpdate: () => void
}

interface ApprovalAction {
  type: "approve" | "reject" | "request-changes"
  comments: string
  changes?: string[]
}

export function ReportApprovalWorkflow({ userRole, reports, onReportUpdate }: ReportApprovalWorkflowProps) {
  const { toast } = useToast()
  
  const [pendingReports, setPendingReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [approvalAction, setApprovalAction] = useState<ApprovalAction>({
    type: "approve",
    comments: "",
    changes: []
  })
  const [filterBy, setFilterBy] = useState<"all" | "overdue" | "urgent">("all")
  const [sortBy, setSortBy] = useState<"dueDate" | "created" | "priority">("dueDate")

  useEffect(() => {
    // Filter reports that need approval
    const pending = reports.filter(report => report.status === "submitted")
    setPendingReports(pending)
  }, [reports])

  const getReportPriority = (report: Report): "high" | "medium" | "low" => {
    if (!report.dueDate) return "low"
    
    const dueDate = new Date(report.dueDate)
    const now = new Date()
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilDue < 0) return "high" // Overdue
    if (daysUntilDue <= 2) return "high" // Due soon
    if (daysUntilDue <= 5) return "medium"
    return "low"
  }

  const getPriorityBadge = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium Priority</Badge>
      case "low":
        return <Badge variant="secondary">Low Priority</Badge>
    }
  }

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending Review</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatTimeRemaining = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays === 0) return "Due today"
    if (diffDays === 1) return "Due tomorrow"
    return `${diffDays} days remaining`
  }

  const handleApproval = (report: Report, action: "approve" | "reject") => {
    setSelectedReport(report)
    setApprovalAction({
      type: action,
      comments: "",
      changes: []
    })
    setShowApprovalDialog(true)
  }

  const submitApproval = async () => {
    if (!selectedReport) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const actionText = approvalAction.type === "approve" ? "approved" : "rejected"
      
      toast({
        title: `Report ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
        description: `${selectedReport.name} has been ${actionText} successfully.`
      })

      setShowApprovalDialog(false)
      setSelectedReport(null)
      onReportUpdate() // Refresh the reports list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process approval. Please try again.",
        variant: "destructive"
      })
    }
  }

  const filteredReports = pendingReports.filter(report => {
    switch (filterBy) {
      case "overdue":
        return report.dueDate && new Date(report.dueDate) < new Date()
      case "urgent":
        return getReportPriority(report) === "high"
      default:
        return true
    }
  })

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[getReportPriority(b)] - priorityOrder[getReportPriority(a)]
      default:
        return 0
    }
  })

  if (userRole !== "project-executive") {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">You don't have permission to approve reports.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Report Approval Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium">{pendingReports.length}</span> reports pending approval
              </div>
              <div className="text-sm text-muted-foreground">
                {pendingReports.filter(r => r.dueDate && new Date(r.dueDate) < new Date()).length} overdue
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={filterBy === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterBy("all")}
              >
                All ({pendingReports.length})
              </Button>
              <Button
                variant={filterBy === "urgent" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterBy("urgent")}
              >
                Urgent ({pendingReports.filter(r => getReportPriority(r) === "high").length})
              </Button>
              <Button
                variant={filterBy === "overdue" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterBy("overdue")}
              >
                Overdue ({pendingReports.filter(r => r.dueDate && new Date(r.dueDate) < new Date()).length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {sortedReports.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="text-foreground font-medium">All caught up!</p>
              <p className="text-muted-foreground">No reports pending approval.</p>
            </CardContent>
          </Card>
        ) : (
          sortedReports.map((report) => {
            const priority = getReportPriority(report)
            return (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{report.name}</h3>
                        {getStatusBadge(report.status)}
                        {getPriorityBadge(priority)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{report.projectName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{report.creatorName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created {new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{report.pageCount} pages</span>
                        </div>
                      </div>

                      {report.dueDate && (
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4" />
                          <span className={priority === "high" ? "text-red-600 font-medium" : "text-muted-foreground"}>
                            {formatTimeRemaining(report.dueDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproval(report, "approve")}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleApproval(report, "reject")}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="!w-[85vw] !max-w-[85vw] !h-[90vh] !max-h-[90vh] p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <DialogHeader className="flex-shrink-0 px-6 py-4 border-b">
              <DialogTitle>
                {approvalAction.type === "approve" ? "Approve Report" : "Reject Report"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-auto px-6 py-4">
              {selectedReport && (
                <div className="space-y-6">
                  {/* Report Summary */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">{selectedReport.name}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Project:</span> {selectedReport.projectName}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created by:</span> {selectedReport.creatorName}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span> {selectedReport.type.replace('-', ' ')}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pages:</span> {selectedReport.pageCount}
                      </div>
                    </div>
                  </div>

                  {/* Action Selection */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={approvalAction.type === "approve" ? "default" : "outline"}
                        onClick={() => setApprovalAction({ ...approvalAction, type: "approve" })}
                        className="justify-start"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Report
                      </Button>
                      <Button
                        variant={approvalAction.type === "reject" ? "destructive" : "outline"}
                        onClick={() => setApprovalAction({ ...approvalAction, type: "reject" })}
                        className="justify-start"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Report
                      </Button>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="space-y-2">
                    <Label htmlFor="comments">
                      {approvalAction.type === "approve" ? "Approval Notes (Optional)" : "Rejection Reason (Required)"}
                    </Label>
                    <Textarea
                      id="comments"
                      placeholder={
                        approvalAction.type === "approve" 
                          ? "Add any notes about the approval..."
                          : "Please explain why this report is being rejected..."
                      }
                      value={approvalAction.comments}
                      onChange={(e) => setApprovalAction({ ...approvalAction, comments: e.target.value })}
                      rows={4}
                    />
                  </div>

                  {/* Required Changes (for rejections) */}
                  {approvalAction.type === "reject" && (
                    <div className="space-y-2">
                      <Label>Required Changes</Label>
                      <div className="space-y-2">
                        <Input
                          placeholder="Add a required change..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                              const newChanges = [...(approvalAction.changes || []), e.currentTarget.value.trim()]
                              setApprovalAction({ ...approvalAction, changes: newChanges })
                              e.currentTarget.value = ""
                            }
                          }}
                        />
                        {approvalAction.changes && approvalAction.changes.length > 0 && (
                          <div className="space-y-1">
                            {approvalAction.changes.map((change, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-sm">{change}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newChanges = approvalAction.changes?.filter((_, i) => i !== index)
                                    setApprovalAction({ ...approvalAction, changes: newChanges })
                                  }}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="flex-shrink-0 px-6 py-4 border-t">
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitApproval}
              disabled={approvalAction.type === "reject" && !approvalAction.comments.trim()}
              className={approvalAction.type === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
              variant={approvalAction.type === "reject" ? "destructive" : "default"}
            >
              <Send className="h-4 w-4 mr-2" />
              {approvalAction.type === "approve" ? "Approve" : "Reject"} Report
            </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 