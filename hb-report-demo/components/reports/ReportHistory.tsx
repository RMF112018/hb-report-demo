"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  Eye,
  Edit3,
  Download,
  Share2,
  Copy,
  Calendar,
  User,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Trash2
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
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
  distributedAt?: string
  sectionCount: number
  pageCount: number
  size: string
  version: number
  tags: string[]
}

interface ReportHistoryProps {
  reports: Report[]
  onViewReport: (report: Report) => void
  onEditReport: (report: Report) => void
  userRole: string
}

export function ReportHistory({ reports, onViewReport, onEditReport, userRole }: ReportHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"name" | "created" | "updated" | "status">("updated")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    let filtered = [...reports]

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(report => 
        report.name.toLowerCase().includes(search) ||
        report.projectName.toLowerCase().includes(search) ||
        report.creatorName.toLowerCase().includes(search) ||
        report.tags.some(tag => tag.toLowerCase().includes(search))
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(report => report.status === statusFilter)
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(report => report.type === typeFilter)
    }

    // Sort reports
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "created":
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case "updated":
          aValue = new Date(a.updatedAt).getTime()
          bValue = new Date(b.updatedAt).getTime()
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          return 0
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      } else {
        return sortOrder === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
      }
    })

    return filtered
  }, [reports, searchTerm, statusFilter, typeFilter, sortBy, sortOrder])

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "submitted":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</Badge>
      case "published":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Published</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeLabel = (type: Report["type"]) => {
    switch (type) {
      case "financial-review":
        return "Financial Review"
      case "monthly-progress":
        return "Monthly Progress"
      case "monthly-owner":
        return "Monthly Owner"
      default:
        return type
    }
  }

  const canEdit = (report: Report) => {
    return userRole === "project-manager" && (report.status === "draft" || report.status === "rejected")
  }

  const canDelete = (report: Report) => {
    return userRole === "project-manager" && report.status === "draft"
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return time.toLocaleDateString()
  }

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const getSortIcon = (field: typeof sortBy) => {
    if (sortBy !== field) return null
    return sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Search and Filters Row */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="financial-review">Financial Review</SelectItem>
                  <SelectItem value="monthly-progress">Monthly Progress</SelectItem>
                  <SelectItem value="monthly-owner">Monthly Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>{filteredAndSortedReports.length} of {reports.length} reports</span>
                <Separator orientation="vertical" className="h-4" />
                <span>{reports.filter(r => r.status === "draft").length} drafts</span>
                <span>{reports.filter(r => r.status === "submitted").length} pending</span>
                <span>{reports.filter(r => r.status === "approved").length} approved</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  Table
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      {viewMode === "table" ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Report Name
                      {getSortIcon("name")}
                    </div>
                  </TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {getSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort("updated")}
                  >
                    <div className="flex items-center gap-2">
                      Last Updated
                      {getSortIcon("updated")}
                    </div>
                  </TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No reports found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.name}</div>
                          <div className="text-sm text-muted-foreground">
                            by {report.creatorName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{report.projectName}</TableCell>
                      <TableCell>{getTypeLabel(report.type)}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatTimeAgo(report.updatedAt)}</div>
                          <div className="text-muted-foreground">
                            {new Date(report.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{report.pageCount}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onViewReport(report)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Report
                            </DropdownMenuItem>
                            {canEdit(report) && (
                              <DropdownMenuItem onClick={() => onEditReport(report)}>
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit Report
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share Link
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            {canDelete(report) && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        /* Grid View */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedReports.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No reports found</p>
            </div>
          ) : (
            filteredAndSortedReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{report.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(report.status)}
                        <Badge variant="outline" className="text-xs">{getTypeLabel(report.type)}</Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewReport(report)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        {canEdit(report) && (
                          <DropdownMenuItem onClick={() => onEditReport(report)}>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{report.projectName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{report.creatorName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimeAgo(report.updatedAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{report.pageCount} pages</span>
                      <span className="text-muted-foreground">{report.size}</span>
                    </div>

                    {report.rejectionReason && (
                      <div className="p-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded text-xs">
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                          <span className="font-medium text-red-800 dark:text-red-200">Rejected</span>
                        </div>
                        <p className="text-red-700 dark:text-red-300 mt-1 line-clamp-2">
                          {report.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
} 