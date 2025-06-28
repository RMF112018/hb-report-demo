"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Calendar,
  MessageSquare,
  FileText,
  Eye,
  Edit3,
  Flag,
} from "lucide-react"

interface DocumentReviewInterfaceProps {
  documents: any[]
  onUpdateDocument: (id: string, updates: any) => void
}

export function DocumentReviewInterface({ documents, onUpdateDocument }: DocumentReviewInterfaceProps) {
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [sortBy, setSortBy] = useState("priority")
  const [filterBy, setFilterBy] = useState("all")

  // Sort documents by priority and deadline
  const sortedDocuments = [...documents].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return (
        priorityOrder[b.priority as keyof typeof priorityOrder] -
        priorityOrder[a.priority as keyof typeof priorityOrder]
      )
    }
    if (sortBy === "deadline") {
      return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
    }
    if (sortBy === "risk") {
      const riskOrder = { high: 3, medium: 2, low: 1 }
      return riskOrder[b.riskLevel as keyof typeof riskOrder] - riskOrder[a.riskLevel as keyof typeof riskOrder]
    }
    return 0
  })

  const filteredDocuments = sortedDocuments.filter((doc) => {
    if (filterBy === "all") return true
    if (filterBy === "high-priority") return doc.priority === "high"
    if (filterBy === "high-risk") return doc.riskLevel === "high"
    if (filterBy === "overdue") return doc.tasks > 0
    return true
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "under-review":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  const handleStartReview = (document: any) => {
    onUpdateDocument(document.id, {
      status: "under-review",
      reviewStartDate: new Date().toISOString().split("T")[0],
    })
  }

  const handleCompleteReview = (document: any) => {
    onUpdateDocument(document.id, {
      status: "approved",
      completionRate: 100,
      reviewCompletedDate: new Date().toISOString().split("T")[0],
    })
  }

  const handleFlagIssue = (document: any) => {
    onUpdateDocument(document.id, {
      riskLevel: "high",
      tasks: document.tasks + 1,
    })
  }

  return (
    <div className="space-y-4">
      {/* Review Queue Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Review Queue</CardTitle>
              <CardDescription>{filteredDocuments.length} documents awaiting review</CardDescription>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm bg-white h-8"
              >
                <option value="priority">Sort by Priority</option>
                <option value="deadline">Sort by Deadline</option>
                <option value="risk">Sort by Risk</option>
              </select>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm bg-white h-8"
              >
                <option value="all">All Documents</option>
                <option value="high-priority">High Priority</option>
                <option value="high-risk">High Risk</option>
                <option value="overdue">Has Issues</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Review Queue List */}
      <div className="space-y-3">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(document.status)}
                    <h3 className="font-semibold text-sm truncate">{document.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      v{document.version}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getPriorityColor(document.priority)}>{document.priority} priority</Badge>
                    <Badge className={getRiskColor(document.riskLevel)}>{document.riskLevel} risk</Badge>
                    {document.tasks > 0 && (
                      <Badge variant="destructive" className="gap-1">
                        <Flag className="h-3 w-3" />
                        {document.tasks} issues
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{document.reviewer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{document.uploadDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{document.comments} comments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>{document.size}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Review Progress</span>
                      <span>{document.completionRate}%</span>
                    </div>
                    <Progress value={document.completionRate} className="h-2" />
                  </div>

                  {/* Action Items */}
                  {document.status === "pending" && (
                    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                      <p className="font-medium text-yellow-800">Action Required:</p>
                      <p className="text-yellow-700">Document uploaded and awaiting initial review</p>
                    </div>
                  )}

                  {document.status === "under-review" && document.tasks > 0 && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                      <p className="font-medium text-red-800">Issues Identified:</p>
                      <p className="text-red-700">{document.tasks} items require attention</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedDocument(document)}
                    className="gap-1 text-xs h-7"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </Button>

                  {document.status === "pending" && (
                    <Button size="sm" onClick={() => handleStartReview(document)} className="gap-1 text-xs h-7">
                      <Edit3 className="h-3 w-3" />
                      Start Review
                    </Button>
                  )}

                  {document.status === "under-review" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleCompleteReview(document)}
                        className="gap-1 text-xs h-7 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFlagIssue(document)}
                        className="gap-1 text-xs h-7 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Flag className="h-3 w-3" />
                        Flag Issue
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-blue-600">{documents.length}</p>
            <p className="text-xs text-gray-600">Total in Queue</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-yellow-600">
              {documents.filter((d) => d.status === "under-review").length}
            </p>
            <p className="text-xs text-gray-600">In Review</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-red-600">{documents.filter((d) => d.priority === "high").length}</p>
            <p className="text-xs text-gray-600">High Priority</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-green-600">
              {Math.round(documents.reduce((sum, doc) => sum + doc.completionRate, 0) / documents.length)}%
            </p>
            <p className="text-xs text-gray-600">Avg Progress</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
