"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Download, Share, MessageSquare, Save, Plus, User, FileText, AlertTriangle, CheckCircle } from "lucide-react"

interface DocumentViewerProps {
  document: any
  reviewMode: boolean
  onClose: () => void
  onUpdate: (updates: any) => void
}

export function DocumentViewer({ document, reviewMode, onClose, onUpdate }: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState("document")
  const [annotations, setAnnotations] = useState([
    {
      id: "1",
      page: 1,
      x: 150,
      y: 200,
      text: "Review payment terms - 30 days may be too long",
      author: "John Smith",
      date: "2024-06-14",
      type: "comment",
      resolved: false,
    },
    {
      id: "2",
      page: 1,
      x: 300,
      y: 400,
      text: "Insurance requirements need verification",
      author: "Sarah Johnson",
      date: "2024-06-13",
      type: "issue",
      resolved: false,
    },
  ])

  const [comments, setComments] = useState([
    {
      id: "1",
      author: "John Smith",
      date: "2024-06-14 10:30 AM",
      text: "Initial review completed. Found several areas that need attention.",
      type: "comment",
    },
    {
      id: "2",
      author: "Sarah Johnson",
      date: "2024-06-14 2:15 PM",
      text: "Insurance certificates have been updated and verified.",
      type: "update",
    },
  ])

  const [newComment, setNewComment] = useState("")
  const [documentSummary, setDocumentSummary] = useState({
    keyTerms: [
      { term: "Contract Value", value: "$2,450,000" },
      { term: "Payment Terms", value: "Net 30 days" },
      { term: "Completion Date", value: "December 15, 2024" },
      { term: "Retainage", value: "5%" },
    ],
    risks: [
      { risk: "Payment terms longer than standard", severity: "medium" },
      { risk: "Insurance requirements unclear", severity: "high" },
      { risk: "Change order process undefined", severity: "low" },
    ],
    obligations: [
      "Provide monthly progress reports",
      "Maintain $2M general liability insurance",
      "Complete work within 180 days",
      "Submit lien waivers with each payment request",
    ],
  })

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        author: "Current User",
        date: new Date().toLocaleString(),
        text: newComment,
        type: "comment",
      }
      setComments((prev) => [...prev, comment])
      setNewComment("")
      onUpdate({ comments: document.comments + 1 })
    }
  }

  const addAnnotation = (x: number, y: number, text: string, type: string) => {
    const annotation = {
      id: Date.now().toString(),
      page: 1,
      x,
      y,
      text,
      author: "Current User",
      date: new Date().toISOString().split("T")[0],
      type,
      resolved: false,
    }
    setAnnotations((prev) => [...prev, annotation])
  }

  const resolveAnnotation = (annotationId: string) => {
    setAnnotations((prev) =>
      prev.map((annotation) => (annotation.id === annotationId ? { ...annotation, resolved: true } : annotation)),
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold">{document.name}</h2>
              <p className="text-sm text-gray-500">
                Version {document.version} • {document.size} • Uploaded {document.uploadDate}
              </p>
            </div>
            <Badge
              className={
                document.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : document.status === "under-review"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }
            >
              {document.status.replace("-", " ")}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share className="h-4 w-4" />
              Share
            </Button>
            {reviewMode && (
              <Button size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Save Review
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Document View */}
          <div className="flex-1 bg-gray-100 relative overflow-auto">
            <div className="p-8">
              {/* Simulated Document Content */}
              <div className="bg-white shadow-lg mx-auto max-w-4xl min-h-[800px] p-8 relative">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">CONSTRUCTION CONTRACT</h1>
                  <p className="text-gray-600">Tropical World Nursery Construction Project</p>
                </div>

                <div className="space-y-6 text-sm leading-relaxed">
                  <section>
                    <h2 className="text-lg font-semibold mb-3">1. PROJECT SCOPE</h2>
                    <p>
                      This contract covers the complete construction of a commercial nursery facility including
                      greenhouse structures, irrigation systems, and administrative buildings as detailed in the
                      attached specifications.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-lg font-semibold mb-3">2. CONTRACT VALUE</h2>
                    <p>
                      The total contract value is <strong>$2,450,000</strong> (Two Million Four Hundred Fifty Thousand
                      Dollars) including all labor, materials, and equipment.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-lg font-semibold mb-3">3. PAYMENT TERMS</h2>
                    <p>
                      Payment shall be made within <strong>30 days</strong> of receipt of properly submitted invoices. A
                      retainage of <strong>5%</strong> will be held until final completion and acceptance.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-lg font-semibold mb-3">4. INSURANCE REQUIREMENTS</h2>
                    <p>
                      Contractor shall maintain general liability insurance of not less than
                      <strong>$2,000,000</strong> per occurrence and workers compensation insurance as required by law.
                    </p>
                  </section>
                </div>

                {/* Annotations Overlay */}
                {annotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className={`absolute w-4 h-4 rounded-full cursor-pointer ${
                      annotation.type === "issue" ? "bg-red-500" : "bg-blue-500"
                    } ${annotation.resolved ? "opacity-50" : ""}`}
                    style={{ left: annotation.x, top: annotation.y }}
                    title={annotation.text}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l bg-white flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 m-2">
                <TabsTrigger value="document" className="text-xs">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="comments" className="text-xs">
                  Comments
                </TabsTrigger>
                <TabsTrigger value="annotations" className="text-xs">
                  Notes
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto">
                <TabsContent value="document" className="m-2 space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Key Terms</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {documentSummary.keyTerms.map((term, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{term.term}:</span>
                          <span className="font-medium">{term.value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {documentSummary.risks.map((risk, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <AlertTriangle
                            className={`h-4 w-4 mt-0.5 ${
                              risk.severity === "high"
                                ? "text-red-500"
                                : risk.severity === "medium"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm">{risk.risk}</p>
                            <Badge
                              className={`text-xs ${
                                risk.severity === "high"
                                  ? "bg-red-100 text-red-800"
                                  : risk.severity === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {risk.severity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Key Obligations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {documentSummary.obligations.map((obligation, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                            {obligation}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="comments" className="m-2 space-y-4">
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <User className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{comment.author}</span>
                                <span className="text-xs text-gray-500">{comment.date}</span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.text}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardContent className="p-3">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mb-2 h-20 resize-none"
                      />
                      <Button onClick={addComment} size="sm" className="gap-2">
                        <MessageSquare className="h-3 w-3" />
                        Add Comment
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="annotations" className="m-2 space-y-4">
                  <div className="space-y-3">
                    {annotations.map((annotation) => (
                      <Card key={annotation.id} className={annotation.resolved ? "opacity-60" : ""}>
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <div
                              className={`w-3 h-3 rounded-full mt-1 ${
                                annotation.type === "issue" ? "bg-red-500" : "bg-blue-500"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-1">{annotation.text}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <span>{annotation.author}</span>
                                <span>•</span>
                                <span>{annotation.date}</span>
                              </div>
                              {!annotation.resolved && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => resolveAnnotation(annotation.id)}
                                  className="h-6 text-xs"
                                >
                                  Mark Resolved
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {reviewMode && (
                    <Card className="border-dashed">
                      <CardContent className="p-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => addAnnotation(200, 300, "New annotation", "comment")}
                        >
                          <Plus className="h-3 w-3" />
                          Add Note
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
