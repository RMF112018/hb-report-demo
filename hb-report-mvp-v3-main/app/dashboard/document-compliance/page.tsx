"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/auth-context"
import { ContextualSidebar } from "@/components/layout/contextual-sidebar"
import { DocumentComplianceDashboard } from "@/components/compliance/document-compliance-dashboard"
import { DocumentUploadManager } from "@/components/compliance/document-upload-manager"
import { DocumentReviewInterface } from "@/components/compliance/document-review-interface"
import { CompliancePlaybook } from "@/components/compliance/compliance-playbook"
import { DocumentViewer } from "@/components/compliance/document-viewer"
import { RiskAssessmentTool } from "@/components/compliance/risk-assessment-tool"
import { ComplianceSidebar } from "@/components/sidebars/compliance-sidebar"
import { FileText, Search, Clock, Users, Download, Share, Plus, Eye, Edit3 } from "lucide-react"

export default function DocumentCompliancePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [reviewMode, setReviewMode] = useState(false)
  const [documents, setDocuments] = useState([
    {
      id: "1",
      name: "Prime Contract - Tropical World Nursery",
      type: "prime-contract",
      status: "under-review",
      priority: "high",
      uploadDate: "2024-06-10",
      reviewer: "John Smith",
      riskLevel: "medium",
      completionRate: 65,
      size: "2.4 MB",
      version: "1.2",
      tags: ["construction", "nursery", "prime"],
      comments: 8,
      tasks: 3,
    },
    {
      id: "2",
      name: "Subcontract - Electrical Work",
      type: "subcontract",
      status: "approved",
      priority: "medium",
      uploadDate: "2024-06-08",
      reviewer: "Sarah Johnson",
      riskLevel: "low",
      completionRate: 100,
      size: "1.8 MB",
      version: "2.0",
      tags: ["electrical", "subcontract"],
      comments: 12,
      tasks: 0,
    },
    {
      id: "3",
      name: "Building Code Requirements - Fire Safety",
      type: "building-code",
      status: "pending",
      priority: "high",
      uploadDate: "2024-06-12",
      reviewer: "Mike Davis",
      riskLevel: "high",
      completionRate: 25,
      size: "3.1 MB",
      version: "1.0",
      tags: ["fire-safety", "code", "compliance"],
      comments: 5,
      tasks: 7,
    },
  ])

  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    priority: "all",
    riskLevel: "all",
  })

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filters.type === "all" || doc.type === filters.type
    const matchesStatus = filters.status === "all" || doc.status === filters.status
    const matchesPriority = filters.priority === "all" || doc.priority === filters.priority
    const matchesRisk = filters.riskLevel === "all" || doc.riskLevel === filters.riskLevel

    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesRisk
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "under-review":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex-none bg-white border-b border-gray-200 px-3 py-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="h-5 w-5 text-blue-600" />
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">Document Compliance</h1>
              <p className="text-sm text-gray-500 truncate">
                {filteredDocuments.length} documents • {documents.filter((d) => d.status === "under-review").length}{" "}
                under review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-none">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search and Filters */}
          <div className="flex-none bg-white border-b border-gray-100 px-3 py-2">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md w-full">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search documents, tags, reviewers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm bg-white h-8"
                >
                  <option value="all">All Types</option>
                  <option value="prime-contract">Prime Contracts</option>
                  <option value="subcontract">Subcontracts</option>
                  <option value="specification">Specifications</option>
                  <option value="building-code">Building Codes</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm bg-white h-8"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="draft">Draft</option>
                </select>

                <select
                  value={filters.priority}
                  onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm bg-white h-8"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabs Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-6 h-10 mx-3 mt-2">
                <TabsTrigger value="dashboard" className="text-xs">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-xs">
                  Documents
                </TabsTrigger>
                <TabsTrigger value="review" className="text-xs">
                  Review Queue
                </TabsTrigger>
                <TabsTrigger value="compliance" className="text-xs">
                  Compliance
                </TabsTrigger>
                <TabsTrigger value="playbook" className="text-xs">
                  Playbook
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs">
                  Analytics
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-3 space-y-3">
                    <TabsContent value="dashboard" className="mt-0">
                      <DocumentComplianceDashboard documents={documents} />
                    </TabsContent>

                    <TabsContent value="documents" className="mt-0">
                      <div className="space-y-3">
                        <DocumentUploadManager onUpload={(doc) => setDocuments((prev) => [...prev, doc])} />

                        {/* Documents Grid */}
                        <div className="grid gap-3">
                          {filteredDocuments.map((doc) => (
                            <Card key={doc.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="font-semibold text-sm truncate">{doc.name}</h3>
                                      <Badge variant="outline" className="text-xs">
                                        v{doc.version}
                                      </Badge>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                      <Badge className={getStatusColor(doc.status)}>
                                        {doc.status.replace("-", " ")}
                                      </Badge>
                                      <Badge className={getPriorityColor(doc.priority)}>{doc.priority} priority</Badge>
                                      <Badge className={getRiskColor(doc.riskLevel)}>{doc.riskLevel} risk</Badge>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-600">
                                      <div>
                                        <span className="font-medium">Reviewer:</span>
                                        <br />
                                        {doc.reviewer}
                                      </div>
                                      <div>
                                        <span className="font-medium">Upload Date:</span>
                                        <br />
                                        {doc.uploadDate}
                                      </div>
                                      <div>
                                        <span className="font-medium">Size:</span>
                                        <br />
                                        {doc.size}
                                      </div>
                                      <div>
                                        <span className="font-medium">Progress:</span>
                                        <br />
                                        {doc.completionRate}%
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                      <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {doc.comments} comments
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {doc.tasks} tasks
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col gap-2 ml-4">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setSelectedDocument(doc)}
                                      className="gap-1 text-xs h-7"
                                    >
                                      <Eye className="h-3 w-3" />
                                      View
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        setSelectedDocument(doc)
                                        setReviewMode(true)
                                      }}
                                      className="gap-1 text-xs h-7"
                                    >
                                      <Edit3 className="h-3 w-3" />
                                      Review
                                    </Button>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-3">
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Review Progress</span>
                                    <span>{doc.completionRate}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${doc.completionRate}%` }}
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="review" className="mt-0">
                      <DocumentReviewInterface
                        documents={documents.filter((d) => d.status === "under-review" || d.status === "pending")}
                        onUpdateDocument={(id, updates) => {
                          setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)))
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="compliance" className="mt-0">
                      <CompliancePlaybook documents={documents} />
                    </TabsContent>

                    <TabsContent value="playbook" className="mt-0">
                      <RiskAssessmentTool documents={documents} />
                    </TabsContent>

                    <TabsContent value="analytics" className="mt-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Analytics & Reporting</CardTitle>
                          <CardDescription>Document compliance analytics and performance metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Analytics dashboard coming soon</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </ScrollArea>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Contextual Sidebar */}
        <ContextualSidebar>
          <ComplianceSidebar
            selectedDocument={selectedDocument}
            documents={documents}
            onDocumentSelect={setSelectedDocument}
          />
        </ContextualSidebar>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          reviewMode={reviewMode}
          onClose={() => {
            setSelectedDocument(null)
            setReviewMode(false)
          }}
          onUpdate={(updates) => {
            setDocuments((prev) => prev.map((doc) => (doc.id === selectedDocument.id ? { ...doc, ...updates } : doc)))
          }}
        />
      )}
    </div>
  )
}
