"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  FileText,
  Download,
  Share2,
  Printer,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  User,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  ExternalLink,
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  Image,
  Table,
  Type
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

interface ReportViewerProps {
  report: Report | null
  onClose: () => void
  userRole: string
}

interface SectionPreview {
  id: string
  title: string
  contentType: string
  pages: number
  preview: string
  status: "complete" | "pending" | "error"
}

export function ReportViewer({ report, onClose, userRole }: ReportViewerProps) {
  const { toast } = useToast()
  
  const [currentPage, setCurrentPage] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [viewMode, setViewMode] = useState<"single" | "facing" | "continuous">("single")
  const [sections, setSections] = useState<SectionPreview[]>([])
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock section data generation
  useEffect(() => {
    if (report) {
      generateSectionPreviews(report)
    }
  }, [report])

  const generateSectionPreviews = (report: Report) => {
    const mockSections: SectionPreview[] = [
      {
        id: "sec-1",
        title: "Cover Page",
        contentType: "cover-page",
        pages: 1,
        preview: "Professional cover page with project logo and information",
        status: "complete"
      },
      {
        id: "sec-2",
        title: "Executive Summary",
        contentType: "executive-summary",
        pages: 2,
        preview: "High-level overview of project status and key metrics",
        status: "complete"
      },
      {
        id: "sec-3",
        title: "Financial Forecast Memo",
        contentType: "financial-forecast-memo",
        pages: 3,
        preview: "Detailed financial analysis and projections",
        status: "complete"
      },
      {
        id: "sec-4",
        title: "Schedule Performance",
        contentType: "schedule-performance",
        pages: 4,
        preview: "Project schedule analysis and milestone tracking",
        status: "complete"
      },
      {
        id: "sec-5",
        title: "Budget Snapshot",
        contentType: "procore-budget-snapshot",
        pages: 5,
        preview: "Current budget status with detailed breakdown",
        status: "complete"
      },
      {
        id: "sec-6",
        title: "Progress Photos",
        contentType: "progress-photos",
        pages: 6,
        preview: "Visual documentation of project progress",
        status: "complete"
      }
    ]

    setSections(mockSections.slice(0, report.sectionCount))
  }

  const getSectionIcon = (contentType: string) => {
    switch (contentType) {
      case "financial-forecast-memo":
      case "financial-summary":
        return <DollarSign className="h-4 w-4" />
      case "schedule-performance":
      case "schedule-monitor":
        return <Calendar className="h-4 w-4" />
      case "progress-photos":
        return <Image className="h-4 w-4" />
      case "procore-budget-snapshot":
      case "sage-job-cost-history":
        return <Table className="h-4 w-4" />
      case "cover-page":
      case "executive-summary":
        return <Type className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

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

  const handleDownload = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Download Started",
        description: "Your report PDF is being generated and will download shortly."
      })
    }, 2000)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/reports/${report?.id}`)
    toast({
      title: "Link Copied",
      description: "Report link has been copied to clipboard."
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const canApprove = userRole === "project-executive" && report?.status === "submitted"
  const canReject = userRole === "project-executive" && report?.status === "submitted"
  const canEdit = userRole === "project-manager" && (report?.status === "draft" || report?.status === "rejected")

  if (!report) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No report selected</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{report.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{report.projectName}</span>
                <Separator orientation="vertical" className="h-4" />
                <User className="h-4 w-4" />
                <span>{report.creatorName}</span>
                <Separator orientation="vertical" className="h-4" />
                <Calendar className="h-4 w-4" />
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusBadge(report.status)}
            <Badge variant="outline">{report.pageCount} pages</Badge>
            <Badge variant="outline">{report.size}</Badge>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              {isLoading ? "Generating..." : "Download PDF"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border rounded-md">
              <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="px-2 text-sm">{zoomLevel}%</span>
              <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-1 border rounded-md">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-2 text-sm">{currentPage} of {report.pageCount}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentPage(Math.min(report.pageCount, currentPage + 1))}
                disabled={currentPage === report.pageCount}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Approval Actions */}
        {(canApprove || canReject || canEdit) && (
          <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {canApprove && (
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Report
              </Button>
            )}
            {canReject && (
              <Button size="sm" variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Reject Report
              </Button>
            )}
            {canEdit && (
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Edit Report
              </Button>
            )}
          </div>
        )}

        {/* Rejection Notice */}
        {report.status === "rejected" && report.rejectionReason && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">Report Rejected</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{report.rejectionReason}</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Rejected by {report.rejectedBy} on {report.rejectedAt && new Date(report.rejectedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 border-r bg-gray-50 dark:bg-gray-800 p-4">
          <h3 className="font-medium mb-4">Report Sections</h3>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2">
              {sections.map((section, index) => (
                <Card 
                  key={section.id}
                  className={`cursor-pointer transition-colors ${
                    selectedSection === section.id ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedSection(section.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {getSectionIcon(section.contentType)}
                      <span className="font-medium text-sm">{section.title}</span>
                      <Badge variant="outline" className="text-xs ml-auto">
                        {section.pages} pages
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{section.preview}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        {section.status === "complete" && <CheckCircle className="h-3 w-3 text-green-500" />}
                        {section.status === "pending" && <Clock className="h-3 w-3 text-yellow-500" />}
                        {section.status === "error" && <XCircle className="h-3 w-3 text-red-500" />}
                        <span className="text-xs text-muted-foreground capitalize">{section.status}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Page {index + 1}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Viewer */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-auto" style={{ 
            width: `${8.5 * (zoomLevel / 100)}in`,
            minHeight: `${11 * (zoomLevel / 100)}in`,
            maxWidth: "100%"
          }}>
            {/* Report Content Preview */}
            <div className="p-8">
              {/* Cover Page Simulation */}
              {currentPage === 1 && (
                <div className="text-center space-y-8">
                  <div className="border-b pb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-4">{report.name}</h1>
                    <h2 className="text-2xl text-muted-foreground">{report.projectName}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="text-left">
                        <h3 className="font-semibold mb-2">Report Information</h3>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Type:</span> {report.type.replace('-', ' ').toUpperCase()}</p>
                          <p><span className="font-medium">Version:</span> {report.version}</p>
                          <p><span className="font-medium">Created:</span> {new Date(report.createdAt).toLocaleDateString()}</p>
                          <p><span className="font-medium">Status:</span> {report.status.toUpperCase()}</p>
                        </div>
                      </div>
                      
                      <div className="text-left">
                        <h3 className="font-semibold mb-2">Project Details</h3>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Project:</span> {report.projectName}</p>
                          <p><span className="font-medium">Created By:</span> {report.creatorName}</p>
                          <p><span className="font-medium">Pages:</span> {report.pageCount}</p>
                          <p><span className="font-medium">Size:</span> {report.size}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-16">
                    <div className="border rounded-lg p-6">
                      <h3 className="font-semibold mb-4">Table of Contents</h3>
                      <div className="space-y-2 text-sm text-left">
                        {sections.map((section, index) => (
                          <div key={section.id} className="flex justify-between">
                            <span>{section.title}</span>
                            <span>{index + 2}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Content Simulation */}
              {currentPage > 1 && selectedSection && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-2xl font-bold text-foreground">
                      {sections.find(s => s.id === selectedSection)?.title}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Mock content based on section type */}
                    <div className="grid grid-cols-1 gap-6">
                      <Card>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="h-5 w-5 text-blue-600" />
                              <h3 className="font-semibold">Key Metrics</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">94%</div>
                                <div className="text-sm text-muted-foreground">Schedule Progress</div>
                              </div>
                              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">$2.1M</div>
                                <div className="text-sm text-muted-foreground">Budget Remaining</div>
                              </div>
                              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">15</div>
                                <div className="text-sm text-muted-foreground">Days Ahead</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-green-600" />
                              <h3 className="font-semibold">Performance Summary</h3>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Budget Performance</span>
                                  <span>92%</span>
                                </div>
                                <Progress value={92} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Schedule Performance</span>
                                  <span>94%</span>
                                </div>
                                <Progress value={94} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Quality Score</span>
                                  <span>96%</span>
                                </div>
                                <Progress value={96} className="h-2" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* Default content for other pages */}
              {currentPage > 1 && !selectedSection && (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Select a section from the sidebar to view its content</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 