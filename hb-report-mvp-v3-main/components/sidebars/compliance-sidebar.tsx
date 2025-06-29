"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  MessageSquare,
  Flag,
  TrendingUp,
  Shield,
} from "lucide-react"

interface ComplianceSidebarProps {
  selectedDocument: any
  documents: any[]
  onDocumentSelect: (document: any) => void
}

export function ComplianceSidebar({ selectedDocument, documents, onDocumentSelect }: ComplianceSidebarProps) {
  const pendingReviews = documents.filter((doc) => doc.status === "pending" || doc.status === "under-review")
  const highRiskDocuments = documents.filter((doc) => doc.riskLevel === "high")
  const recentActivity = [
    { type: "review", document: "Prime Contract", user: "John Smith", time: "2h ago" },
    { type: "comment", document: "Fire Safety Code", user: "Sarah Johnson", time: "4h ago" },
    { type: "approval", document: "Electrical Subcontract", user: "Mike Davis", time: "1d ago" },
  ]

  const upcomingDeadlines = [
    { document: "Building Code Review", deadline: "2024-06-16", priority: "high" },
    { document: "Insurance Verification", deadline: "2024-06-18", priority: "medium" },
    { document: "Permit Application", deadline: "2024-06-20", priority: "low" },
  ]

  return (
    <div className="p-4 space-y-4">
      {/* Selected Document Info */}
      {selectedDocument && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Document Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-1">{selectedDocument.name}</h4>
              <p className="text-xs text-gray-500">Version {selectedDocument.version}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Review Progress</span>
                <span>{selectedDocument.completionRate}%</span>
              </div>
              <Progress value={selectedDocument.completionRate} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Status:</span>
                <br />
                <Badge
                  className={
                    selectedDocument.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : selectedDocument.status === "under-review"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {selectedDocument.status.replace("-", " ")}
                </Badge>
              </div>
              <div>
                <span className="text-gray-500">Risk Level:</span>
                <br />
                <Badge
                  className={
                    selectedDocument.riskLevel === "high"
                      ? "bg-red-100 text-red-800"
                      : selectedDocument.riskLevel === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }
                >
                  {selectedDocument.riskLevel}
                </Badge>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-gray-400" />
                <span>{selectedDocument.reviewer}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-gray-400" />
                <span>{selectedDocument.uploadDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3 w-3 text-gray-400" />
                <span>{selectedDocument.comments} comments</span>
              </div>
              {selectedDocument.tasks > 0 && (
                <div className="flex items-center gap-2">
                  <Flag className="h-3 w-3 text-red-400" />
                  <span>{selectedDocument.tasks} issues</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-blue-50 rounded">
              <FileText className="h-4 w-4 mx-auto mb-1 text-blue-600" />
              <p className="text-sm font-bold text-blue-600">{documents.length}</p>
              <p className="text-xs text-gray-600">Total Docs</p>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded">
              <Clock className="h-4 w-4 mx-auto mb-1 text-yellow-600" />
              <p className="text-sm font-bold text-yellow-600">{pendingReviews.length}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <AlertTriangle className="h-4 w-4 mx-auto mb-1 text-red-600" />
              <p className="text-sm font-bold text-red-600">{highRiskDocuments.length}</p>
              <p className="text-xs text-gray-600">High Risk</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <CheckCircle className="h-4 w-4 mx-auto mb-1 text-green-600" />
              <p className="text-sm font-bold text-green-600">
                {documents.filter((d) => d.status === "approved").length}
              </p>
              <p className="text-xs text-gray-600">Approved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Reviews */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pendingReviews.slice(0, 3).map((doc) => (
              <div
                key={doc.id}
                className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onDocumentSelect(doc)}
              >
                <p className="font-medium text-xs truncate">{doc.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{doc.reviewer}</span>
                  <Badge
                    className={
                      doc.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : doc.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }
                  >
                    {doc.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* High Risk Documents */}
      {highRiskDocuments.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              High Risk Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {highRiskDocuments.slice(0, 2).map((doc) => (
                <div
                  key={doc.id}
                  className="p-2 bg-red-50 border border-red-200 rounded cursor-pointer hover:bg-red-100 transition-colors"
                  onClick={() => onDocumentSelect(doc)}
                >
                  <p className="font-medium text-xs truncate">{doc.name}</p>
                  <p className="text-xs text-red-600 mt-1">Requires immediate attention</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {upcomingDeadlines.map((item, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded">
                <p className="font-medium text-xs truncate">{item.document}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{item.deadline}</span>
                  <Badge
                    className={
                      item.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : item.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }
                  >
                    {item.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 ${
                    activity.type === "approval"
                      ? "bg-green-500"
                      : activity.type === "review"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{activity.document}</p>
                  <p className="text-xs text-gray-500">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
