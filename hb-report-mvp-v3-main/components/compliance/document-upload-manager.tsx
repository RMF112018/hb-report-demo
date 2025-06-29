"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, X, Check, AlertCircle, Folder, Plus, Download } from "lucide-react"

interface DocumentUploadManagerProps {
  onUpload: (document: any) => void
}

export function DocumentUploadManager({ onUpload }: DocumentUploadManagerProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadQueue, setUploadQueue] = useState<any[]>([])
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "",
    priority: "medium",
    description: "",
    tags: "",
    reviewer: "",
    project: "",
    contractValue: "",
    effectiveDate: "",
    expirationDate: "",
  })

  const documentTypes = [
    { value: "prime-contract", label: "Prime Contract" },
    { value: "subcontract", label: "Subcontract" },
    { value: "specification", label: "Specification" },
    { value: "building-code", label: "Building Code" },
    { value: "insurance", label: "Insurance Document" },
    { value: "permit", label: "Permit" },
    { value: "change-order", label: "Change Order" },
    { value: "other", label: "Other" },
  ]

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFiles = (files: File[]) => {
    const newFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: newDocument.type || "other",
      status: "pending",
      progress: 0,
    }))

    setUploadQueue((prev) => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((fileData) => {
      simulateUpload(fileData.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadQueue((prev) =>
          prev.map((file) => (file.id === fileId ? { ...file, status: "completed", progress: 100 } : file)),
        )
      }
      setUploadProgress((prev) => ({ ...prev, [fileId]: progress }))
    }, 200)
  }

  const removeFromQueue = (fileId: string) => {
    setUploadQueue((prev) => prev.filter((file) => file.id !== fileId))
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileId]
      return newProgress
    })
  }

  const handleSubmit = () => {
    const completedFiles = uploadQueue.filter((file) => file.status === "completed")

    completedFiles.forEach((file) => {
      const document = {
        id: file.id,
        name: newDocument.name || file.name,
        type: newDocument.type || "other",
        status: "pending",
        priority: newDocument.priority,
        uploadDate: new Date().toISOString().split("T")[0],
        reviewer: newDocument.reviewer || "Unassigned",
        riskLevel: "medium",
        completionRate: 0,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        version: "1.0",
        tags: newDocument.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        comments: 0,
        tasks: 0,
        description: newDocument.description,
        project: newDocument.project,
        contractValue: newDocument.contractValue,
        effectiveDate: newDocument.effectiveDate,
        expirationDate: newDocument.expirationDate,
      }

      onUpload(document)
    })

    // Reset form
    setUploadQueue([])
    setUploadProgress({})
    setNewDocument({
      name: "",
      type: "",
      priority: "medium",
      description: "",
      tags: "",
      reviewer: "",
      project: "",
      contractValue: "",
      effectiveDate: "",
      expirationDate: "",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Upload Documents</CardTitle>
              <CardDescription>Upload contracts, specifications, and compliance documents for review</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowBulkUpload(!showBulkUpload)} className="gap-2">
                <Folder className="h-4 w-4" />
                Bulk Upload
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Template
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-700 mb-2">Drop files here or click to browse</p>
            <p className="text-sm text-gray-500 mb-4">Supports PDF, DOC, DOCX files up to 50MB</p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Select Files
              </label>
            </Button>
          </div>

          {/* Upload Queue */}
          {uploadQueue.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Upload Queue ({uploadQueue.length} files)</h4>
              {uploadQueue.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    {file.status === "pending" && (
                      <Progress value={uploadProgress[file.id] || 0} className="mt-1 h-1" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === "completed" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : file.status === "error" ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    <Button variant="ghost" size="sm" onClick={() => removeFromQueue(file.id)} className="h-6 w-6 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Document Metadata Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-3">
              <div>
                <Label htmlFor="doc-name" className="text-sm font-medium">
                  Document Name
                </Label>
                <Input
                  id="doc-name"
                  placeholder="Enter document name"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-8"
                />
              </div>

              <div>
                <Label htmlFor="doc-type" className="text-sm font-medium">
                  Document Type
                </Label>
                <Select
                  value={newDocument.type}
                  onValueChange={(value) => setNewDocument((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </Label>
                <Select
                  value={newDocument.priority}
                  onValueChange={(value) => setNewDocument((prev) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reviewer" className="text-sm font-medium">
                  Assigned Reviewer
                </Label>
                <Input
                  id="reviewer"
                  placeholder="Enter reviewer name"
                  value={newDocument.reviewer}
                  onChange={(e) => setNewDocument((prev) => ({ ...prev, reviewer: e.target.value }))}
                  className="h-8"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="project" className="text-sm font-medium">
                  Project
                </Label>
                <Input
                  id="project"
                  placeholder="Enter project name"
                  value={newDocument.project}
                  onChange={(e) => setNewDocument((prev) => ({ ...prev, project: e.target.value }))}
                  className="h-8"
                />
              </div>

              <div>
                <Label htmlFor="contract-value" className="text-sm font-medium">
                  Contract Value
                </Label>
                <Input
                  id="contract-value"
                  placeholder="$0.00"
                  value={newDocument.contractValue}
                  onChange={(e) => setNewDocument((prev) => ({ ...prev, contractValue: e.target.value }))}
                  className="h-8"
                />
              </div>

              <div>
                <Label htmlFor="effective-date" className="text-sm font-medium">
                  Effective Date
                </Label>
                <Input
                  id="effective-date"
                  type="date"
                  value={newDocument.effectiveDate}
                  onChange={(e) => setNewDocument((prev) => ({ ...prev, effectiveDate: e.target.value }))}
                  className="h-8"
                />
              </div>

              <div>
                <Label htmlFor="tags" className="text-sm font-medium">
                  Tags
                </Label>
                <Input
                  id="tags"
                  placeholder="Enter tags (comma separated)"
                  value={newDocument.tags}
                  onChange={(e) => setNewDocument((prev) => ({ ...prev, tags: e.target.value }))}
                  className="h-8"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter document description"
                value={newDocument.description}
                onChange={(e) => setNewDocument((prev) => ({ ...prev, description: e.target.value }))}
                className="h-20 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          {uploadQueue.some((file) => file.status === "completed") && (
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSubmit} className="gap-2">
                <Upload className="h-4 w-4" />
                Upload {uploadQueue.filter((file) => file.status === "completed").length} Documents
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Upload Section */}
      {showBulkUpload && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Bulk Upload</CardTitle>
            <CardDescription>Upload multiple documents with batch metadata assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Bulk upload functionality coming soon</p>
              <p className="text-sm">Upload entire project folders with automated metadata detection</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
