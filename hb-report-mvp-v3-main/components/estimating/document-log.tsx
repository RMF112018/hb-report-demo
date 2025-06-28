"use client"

import type React from "react"
import { useState, useRef, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, Trash2, Edit, Upload, Download, Search, Eye, ChevronDown } from "lucide-react"
import { useEstimating } from "./estimating-context"
import type { Document } from "@/types/estimating" // Assuming Document type is in types/estimating.ts
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"
import { FileText } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

/**
 * @fileoverview Document Log Component
 *
 * This component allows users to manage project documents, including adding, updating,
 * deleting, importing from CSV, exporting to CSV, and viewing document details.
 * It integrates with the EstimatingContext for state management and includes
 * search, filter, and validation features. Documents are grouped by category
 * and displayed in collapsible sections.
 *
 * @version 1.1.0
 * @author HB Report Development Team
 * @since 2025-06-17
 */

/**
 * Represents the structure for a new or edited document in the form.
 */
interface DocumentFormState extends Omit<Document, "id"> {}

export default function DocumentLog() {
  const { projectEstimate, addDocument, updateDocument, deleteDocument, importDocumentsFromCSV } = useEstimating()
  const { toast } = useToast()

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [categoryFilter, setCategoryFilter] = useState<Document["category"] | "all">("all")

  // State for Add/Edit Dialog
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [documentForm, setDocumentForm] = useState<DocumentFormState>({
    sheetNumber: "",
    description: "",
    dateIssued: "",
    dateReceived: "",
    category: "Architectural",
    notes: "",
    revision: "",
  })

  // State for View Dialog
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null)

  // State for CSV Import
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Resets the document form state.
   */
  const resetDocumentForm = useCallback(() => {
    setDocumentForm({
      sheetNumber: "",
      description: "",
      dateIssued: "",
      dateReceived: "",
      category: "Architectural",
      notes: "",
      revision: "",
    })
    setEditingDocument(null)
  }, [])

  /**
   * Handles opening the add/edit dialog.
   * @param doc - The document to edit, or null for a new document.
   */
  const handleOpenAddEditDialog = useCallback(
    (doc: Document | null = null) => {
      if (doc) {
        setEditingDocument(doc)
        setDocumentForm({
          sheetNumber: doc.sheetNumber,
          description: doc.description,
          dateIssued: doc.dateIssued,
          dateReceived: doc.dateReceived,
          category: doc.category,
          notes: doc.notes || "",
          revision: doc.revision || "",
        })
      } else {
        resetDocumentForm()
      }
      setIsAddEditDialogOpen(true)
    },
    [resetDocumentForm],
  )

  /**
   * Handles closing the add/edit dialog.
   */
  const handleCloseAddEditDialog = useCallback(() => {
    setIsAddEditDialogOpen(false)
    resetDocumentForm()
  }, [resetDocumentForm])

  /**
   * Validates the document form data.
   * @returns True if the form is valid, false otherwise.
   */
  const validateDocumentForm = useCallback((): boolean => {
    if (
      !documentForm.sheetNumber ||
      !documentForm.description ||
      !documentForm.dateIssued ||
      !documentForm.dateReceived ||
      !documentForm.category
    ) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in all required fields (Sheet Number, Description, Date Issued, Date Received, Category).",
        variant: "destructive",
      })
      return false
    }

    // Check for sheet number uniqueness (only if adding or if sheet number changed during edit)
    const isSheetNumberDuplicate = projectEstimate.documents.some(
      (doc) => doc.sheetNumber === documentForm.sheetNumber && doc.id !== editingDocument?.id,
    )
    if (isSheetNumberDuplicate) {
      toast({
        title: "Duplicate Sheet Number",
        description: "A document with this sheet number already exists. Please use a unique sheet number.",
        variant: "destructive",
      })
      return false
    }

    return true
  }, [documentForm, editingDocument?.id, projectEstimate.documents, toast])

  /**
   * Handles adding or updating a document.
   */
  const handleSaveDocument = useCallback(() => {
    if (!validateDocumentForm()) {
      return
    }

    if (editingDocument) {
      updateDocument(editingDocument.id, documentForm)
      toast({
        title: "Document Updated",
        description: `Document "${documentForm.sheetNumber}" has been updated.`,
      })
    } else {
      addDocument(documentForm)
      toast({
        title: "Document Added",
        description: `Document "${documentForm.sheetNumber}" has been added.`,
      })
    }
    handleCloseAddEditDialog()
  }, [
    addDocument,
    documentForm,
    editingDocument,
    handleCloseAddEditDialog,
    toast,
    updateDocument,
    validateDocumentForm,
  ])

  /**
   * Handles opening the view dialog for a document.
   * @param doc - The document to view.
   */
  const handleViewDocument = useCallback((doc: Document) => {
    setViewingDocument(doc)
    setIsViewDialogOpen(true)
  }, [])

  /**
   * Handles closing the view dialog.
   */
  const handleCloseViewDialog = useCallback(() => {
    setIsViewDialogOpen(false)
    setViewingDocument(null)
  }, [])

  /**
   * Handles CSV file selection and import.
   * @param event - The change event from the file input.
   */
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== "text/csv") {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        })
        return
      }

      setIsImporting(true)
      setImportProgress(0) // Reset progress

      const reader = new FileReader()
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100
          setImportProgress(progress)
        }
      }
      reader.onload = async (e) => {
        const csvData = e.target?.result as string
        const result = await importDocumentsFromCSV(csvData)

        if (result.errorRows > 0) {
          toast({
            title: "CSV Import with Errors",
            description: `Successfully imported ${result.successfulRows} documents. ${result.errorRows} rows had errors. Check console for details.`,
            variant: "destructive",
            duration: 5000,
          })
          result.errors.forEach((error) => console.error("CSV Import Error:", error)) // Log errors for debugging
        } else {
          toast({
            title: "CSV Import Successful",
            description: `Successfully imported ${result.successfulRows} documents.`,
            duration: 3000,
          })
        }
        setIsImporting(false)
        setImportProgress(100)
        if (fileInputRef.current) {
          fileInputRef.current.value = "" // Clear the file input
        }
      }
      reader.onerror = () => {
        toast({
          title: "File Read Error",
          description: "Failed to read the CSV file.",
          variant: "destructive",
        })
        setIsImporting(false)
        setImportProgress(0)
      }
      reader.readAsText(file)
    }
  }

  /**
   * Handles exporting documents to a CSV file.
   */
  const handleExportCSV = useCallback(() => {
    if (projectEstimate.documents.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no documents to export.",
        variant: "default",
      })
      return
    }

    const headers = ["id", "sheetNumber", "description", "dateIssued", "dateReceived", "category", "notes", "revision"]
    const csvRows = []

    // Add headers
    csvRows.push(headers.join(","))

    // Add data rows
    projectEstimate.documents.forEach((doc) => {
      const values = headers.map((header) => {
        const value = doc[header as keyof Document]
        // Handle commas and quotes in string values
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      })
      csvRows.push(values.join(","))
    })

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `document_log_${new Date().toISOString().slice(0, 10)}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast({
        title: "Export Successful",
        description: "Document log exported to CSV.",
        duration: 3000,
      })
    } else {
      toast({
        title: "Export Failed",
        description: "Your browser does not support downloading files directly.",
        variant: "destructive",
      })
    }
  }, [projectEstimate.documents, toast])

  /**
   * Filters documents based on current search term and category filter.
   */
  const filteredDocuments = useMemo(() => {
    let docs = projectEstimate.documents

    if (categoryFilter !== "all") {
      docs = docs.filter((doc) => doc.category === categoryFilter)
    }

    if (debouncedSearchTerm) {
      const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase()
      docs = docs.filter(
        (doc) =>
          doc.sheetNumber.toLowerCase().includes(lowerCaseSearchTerm) ||
          doc.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          doc.category.toLowerCase().includes(lowerCaseSearchTerm) ||
          doc.notes?.toLowerCase().includes(lowerCaseSearchTerm) ||
          doc.revision?.toLowerCase().includes(lowerCaseSearchTerm),
      )
    }
    return docs
  }, [projectEstimate.documents, categoryFilter, debouncedSearchTerm])

  /**
   * Groups filtered documents by category.
   */
  const groupedDocuments = useMemo(() => {
    return filteredDocuments.reduce(
      (acc, doc) => {
        const category = doc.category || "Uncategorized" // Handle potential missing category
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(doc)
        return acc
      },
      {} as Record<Document["category"] | "Uncategorized", Document[]>,
    )
  }, [filteredDocuments])

  const sortedCategories = useMemo(() => {
    return Object.keys(groupedDocuments).sort()
  }, [groupedDocuments])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" /> Document Log
        </CardTitle>
        <CardDescription>Maintain a log of all project documents and revisions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search documents..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value: Document["category"] | "all") => setCategoryFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Architectural">Architectural</SelectItem>
              <SelectItem value="Structural">Structural</SelectItem>
              <SelectItem value="MEP">MEP</SelectItem>
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Plumbing">Plumbing</SelectItem>
              <SelectItem value="Civil">Civil</SelectItem>
              <SelectItem value="Landscape">Landscape</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => handleOpenAddEditDialog()} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" /> Add New Document
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto"
            variant="outline"
            data-tour="import-csv-btn"
            disabled={isImporting}
          >
            <Upload className="h-4 w-4 mr-2" /> {isImporting ? "Importing..." : "Import from CSV"}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
          </Button>
          <Button onClick={handleExportCSV} className="w-full sm:w-auto" variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export to CSV
          </Button>
        </div>

        {isImporting && (
          <div className="space-y-2">
            <Label>Import Progress</Label>
            <Progress value={importProgress} className="w-full" />
            <p className="text-sm text-gray-500">{Math.round(importProgress)}%</p>
          </div>
        )}

        <Separator />

        {/* Grouped Documents Table */}
        <h3 className="text-lg font-semibold">Existing Documents ({filteredDocuments.length})</h3>
        {filteredDocuments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No documents found matching your criteria.</p>
        ) : (
          <div className="space-y-4">
            {sortedCategories.map((category) => (
              <Collapsible key={category} className="border rounded-md">
                <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-semibold text-left bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span>
                    {category} ({groupedDocuments[category]?.length || 0})
                  </span>
                  <ChevronDown className="h-5 w-5 data-[state=open]:rotate-180 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="overflow-x-auto">
                    <Table className="min-w-full" data-tour="document-log-table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sheet No.</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Issued</TableHead>
                          <TableHead>Received</TableHead>
                          <TableHead>Revision</TableHead>
                          <TableHead className="w-[120px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupedDocuments[category]?.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.sheetNumber}</TableCell>
                            <TableCell>{doc.description}</TableCell>
                            <TableCell>{doc.dateIssued}</TableCell>
                            <TableCell>{doc.dateReceived}</TableCell>
                            <TableCell>{doc.revision || "N/A"}</TableCell>
                            <TableCell className="flex gap-1 justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDocument(doc)}
                                aria-label="View document"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenAddEditDialog(doc)}
                                aria-label="Edit document"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (
                                    window.confirm(`Are you sure you want to delete document "${doc.sheetNumber}"?`)
                                  ) {
                                    deleteDocument(doc.id)
                                    toast({
                                      title: "Document Deleted",
                                      description: `Document "${doc.sheetNumber}" has been removed.`,
                                      variant: "default",
                                    })
                                  }
                                }}
                                aria-label="Delete document"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add/Edit Document Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingDocument ? "Edit Document" : "Add New Document"}</DialogTitle>
            <CardDescription>
              {editingDocument ? "Update the details of this document." : "Enter the details for the new document."}
            </CardDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
            <div className="col-span-full">
              <Label htmlFor="sheetNumber">Sheet Number *</Label>
              <Input
                id="sheetNumber"
                placeholder="e.g., A2.11"
                value={documentForm.sheetNumber}
                onChange={(e) => setDocumentForm({ ...documentForm, sheetNumber: e.target.value })}
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="e.g., Floor Plan - Level 2"
                value={documentForm.description}
                onChange={(e) => setDocumentForm({ ...documentForm, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={documentForm.category}
                onValueChange={(value: Document["category"]) => setDocumentForm({ ...documentForm, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Architectural">Architectural</SelectItem>
                  <SelectItem value="Structural">Structural</SelectItem>
                  <SelectItem value="MEP">MEP</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Civil">Civil</SelectItem>
                  <SelectItem value="Landscape">Landscape</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="revision">Revision (Optional)</Label>
              <Input
                id="revision"
                placeholder="e.g., Rev 1"
                value={documentForm.revision}
                onChange={(e) => setDocumentForm({ ...documentForm, revision: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="dateIssued">Date Issued *</Label>
              <Input
                id="dateIssued"
                type="date"
                value={documentForm.dateIssued}
                onChange={(e) => setDocumentForm({ ...documentForm, dateIssued: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="dateReceived">Date Received *</Label>
              <Input
                id="dateReceived"
                type="date"
                value={documentForm.dateReceived}
                onChange={(e) => setDocumentForm({ ...documentForm, dateReceived: e.target.value })}
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this document..."
                value={documentForm.notes}
                onChange={(e) => setDocumentForm({ ...documentForm, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAddEditDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveDocument}>{editingDocument ? "Save Changes" : "Add Document"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Document Details: {viewingDocument?.sheetNumber}</DialogTitle>
            <CardDescription>Detailed information for this project document.</CardDescription>
          </DialogHeader>
          {viewingDocument && (
            <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
              <div>
                <Label>Sheet Number</Label>
                <p className="font-medium">{viewingDocument.sheetNumber}</p>
              </div>
              <div className="col-span-full">
                <Label>Description</Label>
                <p>{viewingDocument.description}</p>
              </div>
              <div>
                <Label>Category</Label>
                <p>{viewingDocument.category}</p>
              </div>
              <div>
                <Label>Revision</Label>
                <p>{viewingDocument.revision || "N/A"}</p>
              </div>
              <div>
                <Label>Date Issued</Label>
                <p>{viewingDocument.dateIssued}</p>
              </div>
              <div>
                <Label>Date Received</Label>
                <p>{viewingDocument.dateReceived}</p>
              </div>
              <div className="col-span-full">
                <Label>Notes</Label>
                <p className="text-sm text-gray-600">{viewingDocument.notes || "No notes."}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleCloseViewDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
