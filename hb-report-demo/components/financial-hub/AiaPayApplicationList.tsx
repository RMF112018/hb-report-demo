"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Download, Send, Search } from "lucide-react"
import type { AiaPayApplication } from "@/types/aia-pay-application"

interface AiaPayApplicationListProps {
  applications: AiaPayApplication[]
  onSelectApplication: (application: AiaPayApplication) => void
  onRefresh: () => void
}

export function AiaPayApplicationList({ applications, onSelectApplication, onRefresh }: AiaPayApplicationListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("applicationNumber")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-muted text-muted-foreground border-muted-foreground/20"
      case "submitted":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      case "pm_approved":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
      case "px_approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
      case "executive_approved":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
      case "paid":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
      default:
        return "bg-muted text-muted-foreground border-muted-foreground/20"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pm_approved":
        return "PM Approved"
      case "px_approved":
        return "PX Approved"
      case "executive_approved":
        return "Executive Approved"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  // Filter and sort applications
  const filteredApplications = applications
    .filter((app) => {
      const matchesSearch =
        searchTerm === "" ||
        app.applicationNumber.toString().includes(searchTerm) ||
        app.contractorName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || app.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof AiaPayApplication]
      let bValue: any = b[sortBy as keyof AiaPayApplication]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  const handleViewApplication = (application: AiaPayApplication) => {
    onSelectApplication(application)
  }

  const handleEditApplication = (application: AiaPayApplication) => {
    // Only allow editing of draft applications
    if (application.status === "draft") {
      onSelectApplication(application)
    }
  }

  const handleDownloadPdf = (application: AiaPayApplication) => {
    // Implement PDF download
    console.log("Download PDF for application:", application.id)
  }

  const handleDistribute = (application: AiaPayApplication) => {
    // Implement distribution
    console.log("Distribute application:", application.id)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Pay Applications</CardTitle>
          <Button onClick={onRefresh} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background text-foreground border-input"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-background text-foreground border-input">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="pm_approved">PM Approved</SelectItem>
              <SelectItem value="px_approved">PX Approved</SelectItem>
              <SelectItem value="executive_approved">Executive Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-background text-foreground border-input">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="applicationNumber">Application #</SelectItem>
              <SelectItem value="applicationDate">Date</SelectItem>
              <SelectItem value="netAmountDue">Amount</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground">Application #</TableHead>
                <TableHead className="text-foreground">Period Ending</TableHead>
                <TableHead className="text-foreground">Contractor</TableHead>
                <TableHead className="text-right text-foreground">Amount Due</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-foreground">Submitted Date</TableHead>
                <TableHead className="text-right text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id} className="hover:bg-muted/50 border-border">
                  <TableCell className="font-medium text-foreground">#{application.applicationNumber}</TableCell>
                  <TableCell className="text-foreground">{formatDate(application.periodEndDate)}</TableCell>
                  <TableCell className="text-foreground">{application.contractorName}</TableCell>
                  <TableCell className="text-right font-medium text-foreground">{formatCurrency(application.netAmountDue)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(application.status)}>{getStatusLabel(application.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-foreground">{application.submittedDate ? formatDate(application.submittedDate) : "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewApplication(application)}
                        title="View Application"
                        className="hover:bg-muted"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {application.status === "draft" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditApplication(application)}
                          title="Edit Application"
                          className="hover:bg-muted"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}

                      {["px_approved", "executive_approved", "paid"].includes(application.status) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadPdf(application)}
                          title="Download PDF"
                          className="hover:bg-muted"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}

                      {["px_approved", "executive_approved"].includes(application.status) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDistribute(application)}
                          title="Distribute"
                          className="hover:bg-muted"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No applications found matching your criteria.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 