"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, Clock, ArrowRight, Download, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import data
import staffingData from "@/data/staffingTestData.json"

interface SPCR {
  id: string
  projectId: string
  requestType: "add" | "remove"
  position: string
  currentHeadcount: number
  requestedHeadcount: number
  startDate: string
  endDate: string
  status: "pending" | "approved" | "rejected"
  priority: "low" | "medium" | "high"
  justification: string
  businessImpact: string
  estimatedCost: number
  submittedBy: string
  submittedAt: string
  reviewedBy?: string
  reviewedAt?: string
  approvalComments?: string
  rejectionReason?: string
  comments: Array<{
    id: string
    author: string
    content: string
    timestamp: string
  }>
}

interface Project {
  id: string
  name: string
  status: string
  phase: string
  progress: number
}

/**
 * Project Executive Interface
 *
 * Provides SPCR review and approval workflow with:
 * - Pending SPCR review queue
 * - Detailed SPCR analysis and approval/rejection
 * - Revision request capability
 * - Action item integration for C-Suite
 * - Project staffing oversight
 */
export function ProjectExecutiveInterface() {
  const [spcrs, setSpcrs] = useState<SPCR[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSPCR, setSelectedSPCR] = useState<SPCR | null>(null)
  const [reviewComments, setReviewComments] = useState("")
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | "revise" | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("pending")

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setSpcrs(staffingData.spcrs as SPCR[])
        setProjects(staffingData.projects as Project[])

        toast({
          title: "Data Loaded",
          description: "SPCR review interface ready.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load SPCR data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter SPCRs
  const filteredSPCRs = spcrs.filter((spcr) => {
    const project = projects.find((p) => p.id === spcr.projectId)
    const projectName = project?.name || ""

    const matchesSearch = `${projectName} ${spcr.position} ${spcr.justification}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || spcr.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || spcr.priority === selectedPriority
    const matchesProject = selectedProject === "all" || spcr.projectId === selectedProject

    return matchesSearch && matchesStatus && matchesPriority && matchesProject
  })

  // Group SPCRs by status
  const spcrsByStatus = {
    pending: filteredSPCRs.filter((spcr) => spcr.status === "pending"),
    approved: filteredSPCRs.filter((spcr) => spcr.status === "approved"),
    rejected: filteredSPCRs.filter((spcr) => spcr.status === "rejected"),
  }

  // Handle SPCR review
  const handleReview = async (action: "approve" | "reject" | "revise") => {
    if (!selectedSPCR) return

    try {
      // Update SPCR status
      const updatedSPCR = {
        ...selectedSPCR,
        status: action === "revise" ? "pending" : action === "approve" ? "approved" : "rejected",
        reviewedBy: "john-doe-px-001",
        reviewedAt: new Date().toISOString(),
        ...(action === "approve" && { approvalComments: reviewComments }),
        ...(action === "reject" && { rejectionReason: reviewComments }),
      }

      setSpcrs((prev) => prev.map((spcr) => (spcr.id === selectedSPCR.id ? updatedSPCR : spcr)))

      // Add comment
      if (reviewComments) {
        const newComment = {
          id: `comment-${Date.now()}`,
          author: "john-doe-px-001",
          content: reviewComments,
          timestamp: new Date().toISOString(),
        }

        updatedSPCR.comments.push(newComment)
      }

      setIsReviewDialogOpen(false)
      setSelectedSPCR(null)
      setReviewComments("")
      setReviewAction(null)

      toast({
        title: `SPCR ${action.charAt(0).toUpperCase() + action.slice(1)}d`,
        description: `SPCR ${selectedSPCR.id} has been ${action}d successfully.`,
      })

      // If approved, create C-Suite action item (mock)
      if (action === "approve") {
        toast({
          title: "Action Item Created",
          description: "C-Suite action item created for staffing allocation.",
          variant: "default",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} SPCR.`,
        variant: "destructive",
      })
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const config = {
      pending: { variant: "outline" as const, className: "bg-yellow-100 text-yellow-800", icon: Clock },
      approved: { variant: "default" as const, className: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { variant: "secondary" as const, className: "bg-red-100 text-red-800", icon: XCircle },
    }

    const { variant, className, icon: Icon } = config[status as keyof typeof config] || config.pending

    return (
      <Badge variant={variant} className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    const config = {
      low: { variant: "outline" as const, className: "bg-gray-100 text-gray-800" },
      medium: { variant: "secondary" as const, className: "bg-blue-100 text-blue-800" },
      high: { variant: "destructive" as const, className: "bg-red-100 text-red-800" },
    }

    const { variant, className } = config[priority as keyof typeof config] || config.medium

    return (
      <Badge variant={variant} className={className}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spcrsByStatus.pending.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spcrsByStatus.approved.length}</div>
            <p className="text-xs text-muted-foreground">Ready for implementation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spcrsByStatus.rejected.length}</div>
            <p className="text-xs text-muted-foreground">Require revision</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cost Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.abs(spcrsByStatus.approved.reduce((sum, spcr) => sum + spcr.estimatedCost, 0)).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Approved changes</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({spcrsByStatus.pending.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved ({spcrsByStatus.approved.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Rejected ({spcrsByStatus.rejected.length})
            </TabsTrigger>
            <TabsTrigger value="all">All SPCRs</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search SPCRs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((proj) => (
                    <SelectItem key={proj.id} value={proj.id}>
                      {proj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedProject("all")
                  setSelectedPriority("all")
                }}
                size="sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SPCR Tables */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending SPCRs - Require Review</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Request</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Cost Impact</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spcrsByStatus.pending.map((spcr) => {
                    const project = projects.find((p) => p.id === spcr.projectId)
                    return (
                      <TableRow key={spcr.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{project?.name}</div>
                            <div className="text-sm text-gray-600">{project?.phase}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {spcr.requestType === "add" ? "Add" : "Remove"} {spcr.position}
                            </div>
                            <div className="text-sm text-gray-600">
                              {spcr.currentHeadcount} → {spcr.requestedHeadcount}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(spcr.priority)}</TableCell>
                        <TableCell>
                          <div className={`font-medium ${spcr.estimatedCost >= 0 ? "text-red-600" : "text-green-600"}`}>
                            {spcr.estimatedCost >= 0 ? "+" : ""}${spcr.estimatedCost.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{new Date(spcr.submittedAt).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedSPCR(spcr)
                                setReviewAction("approve")
                                setIsReviewDialogOpen(true)
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedSPCR(spcr)
                                setReviewAction("reject")
                                setIsReviewDialogOpen(true)
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedSPCR(spcr)
                                setReviewAction("revise")
                                setIsReviewDialogOpen(true)
                              }}
                            >
                              <ArrowRight className="h-4 w-4 mr-1" />
                              Revise
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {spcrsByStatus.pending.length === 0 && (
                <div className="text-center py-8 text-gray-500">No pending SPCRs requiring review</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved SPCRs - Ready for Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Request</TableHead>
                    <TableHead>Cost Impact</TableHead>
                    <TableHead>Approved Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spcrsByStatus.approved.map((spcr) => {
                    const project = projects.find((p) => p.id === spcr.projectId)
                    return (
                      <TableRow key={spcr.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{project?.name}</div>
                            <div className="text-sm text-gray-600">{project?.phase}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {spcr.requestType === "add" ? "Add" : "Remove"} {spcr.position}
                            </div>
                            <div className="text-sm text-gray-600">
                              {spcr.currentHeadcount} → {spcr.requestedHeadcount}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${spcr.estimatedCost >= 0 ? "text-red-600" : "text-green-600"}`}>
                            {spcr.estimatedCost >= 0 ? "+" : ""}${spcr.estimatedCost.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {spcr.reviewedAt ? new Date(spcr.reviewedAt).toLocaleDateString() : "-"}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(spcr.status)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {spcrsByStatus.approved.length === 0 && (
                <div className="text-center py-8 text-gray-500">No approved SPCRs</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected SPCRs - Require Revision</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Request</TableHead>
                    <TableHead>Rejection Reason</TableHead>
                    <TableHead>Rejected Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spcrsByStatus.rejected.map((spcr) => {
                    const project = projects.find((p) => p.id === spcr.projectId)
                    return (
                      <TableRow key={spcr.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{project?.name}</div>
                            <div className="text-sm text-gray-600">{project?.phase}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {spcr.requestType === "add" ? "Add" : "Remove"} {spcr.position}
                            </div>
                            <div className="text-sm text-gray-600">
                              {spcr.currentHeadcount} → {spcr.requestedHeadcount}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm max-w-xs">{spcr.rejectionReason || "No reason provided"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {spcr.reviewedAt ? new Date(spcr.reviewedAt).toLocaleDateString() : "-"}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(spcr.status)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {spcrsByStatus.rejected.length === 0 && (
                <div className="text-center py-8 text-gray-500">No rejected SPCRs</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All SPCRs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Request</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost Impact</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSPCRs.map((spcr) => {
                    const project = projects.find((p) => p.id === spcr.projectId)
                    return (
                      <TableRow key={spcr.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{project?.name}</div>
                            <div className="text-sm text-gray-600">{project?.phase}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {spcr.requestType === "add" ? "Add" : "Remove"} {spcr.position}
                            </div>
                            <div className="text-sm text-gray-600">
                              {spcr.currentHeadcount} → {spcr.requestedHeadcount}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(spcr.priority)}</TableCell>
                        <TableCell>{getStatusBadge(spcr.status)}</TableCell>
                        <TableCell>
                          <div className={`font-medium ${spcr.estimatedCost >= 0 ? "text-red-600" : "text-green-600"}`}>
                            {spcr.estimatedCost >= 0 ? "+" : ""}${spcr.estimatedCost.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{new Date(spcr.submittedAt).toLocaleDateString()}</div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {filteredSPCRs.length === 0 && (
                <div className="text-center py-8 text-gray-500">No SPCRs found matching your criteria</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve"
                ? "Approve SPCR"
                : reviewAction === "reject"
                  ? "Reject SPCR"
                  : "Request Revision"}
            </DialogTitle>
          </DialogHeader>

          {selectedSPCR && (
            <div className="space-y-6">
              {/* SPCR Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Project</Label>
                  <div className="text-sm">{projects.find((p) => p.id === selectedSPCR.projectId)?.name}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Request Type</Label>
                  <div className="text-sm">
                    {selectedSPCR.requestType === "add" ? "Add" : "Remove"} {selectedSPCR.position}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Headcount Change</Label>
                  <div className="text-sm">
                    {selectedSPCR.currentHeadcount} → {selectedSPCR.requestedHeadcount}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Cost Impact</Label>
                  <div
                    className={`text-sm font-medium ${selectedSPCR.estimatedCost >= 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {selectedSPCR.estimatedCost >= 0 ? "+" : ""}${selectedSPCR.estimatedCost.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Justification */}
              <div>
                <Label className="text-sm font-medium">Justification</Label>
                <div className="text-sm mt-1 p-3 bg-gray-50 rounded">{selectedSPCR.justification}</div>
              </div>

              {/* Business Impact */}
              <div>
                <Label className="text-sm font-medium">Business Impact</Label>
                <div className="text-sm mt-1 p-3 bg-gray-50 rounded">{selectedSPCR.businessImpact}</div>
              </div>

              {/* Review Comments */}
              <div>
                <Label htmlFor="reviewComments" className="text-sm font-medium">
                  {reviewAction === "approve"
                    ? "Approval Comments"
                    : reviewAction === "reject"
                      ? "Rejection Reason"
                      : "Revision Notes"}
                </Label>
                <Textarea
                  id="reviewComments"
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder={
                    reviewAction === "approve"
                      ? "Optional approval comments..."
                      : reviewAction === "reject"
                        ? "Please provide reason for rejection..."
                        : "Please specify what needs to be revised..."
                  }
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReview(reviewAction!)}
                  variant={
                    reviewAction === "approve" ? "default" : reviewAction === "reject" ? "destructive" : "secondary"
                  }
                >
                  {reviewAction === "approve"
                    ? "Approve SPCR"
                    : reviewAction === "reject"
                      ? "Reject SPCR"
                      : "Request Revision"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
