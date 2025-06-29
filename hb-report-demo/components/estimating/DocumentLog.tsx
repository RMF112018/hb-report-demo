"use client"

import React, { useState, useRef, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useEstimating } from "./EstimatingProvider"
import type { Document } from "@/types/estimating-tracker"
import { 
  PlusCircle, 
  Trash2, 
  Edit, 
  Upload, 
  Download, 
  Search, 
  Eye, 
  FileText,
  Filter,
  RefreshCcw,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Building2,
  Settings,
  ExternalLink,
  Info,
  X
} from "lucide-react"

interface DocumentFormData extends Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> {}

export default function DocumentLog() {
  const { 
    documents, 
    addDocument, 
    updateDocument, 
    deleteDocument, 
    getDocumentsByProject,
    importDocumentsFromFile,
    exportDocumentsToCSV,
    generateDocumentTemplate,
    selectedProject,
    isLoading 
  } = useEstimating()
  
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State management
  const [searchTerm, setSearchTerm] = useState("")
  const [disciplineFilter, setDisciplineFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [phaseFilter, setPhaseFilter] = useState<string>("all")
  
  // Dialog states
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null)
  
  // Import state
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState<any>(null)
  
  // Form state
  const [documentForm, setDocumentForm] = useState<DocumentFormData>({
    projectId: selectedProject?.id || "2525840", // Default project
    sheetNumber: "",
    description: "",
    discipline: "Architectural",
    category: "Other",
    dateIssued: "",
    dateReceived: "",
    revision: "",
    phase: "BID",
    status: "Current",
    notes: ""
  })

  // Get filtered documents
  const filteredDocuments = useMemo(() => {
    let docs = selectedProject 
      ? getDocumentsByProject(selectedProject.id) 
      : documents

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      docs = docs.filter(doc => 
        doc.sheetNumber.toLowerCase().includes(lowerSearch) ||
        doc.description.toLowerCase().includes(lowerSearch) ||
        doc.notes?.toLowerCase().includes(lowerSearch)
      )
    }

    if (disciplineFilter !== "all") {
      docs = docs.filter(doc => doc.discipline === disciplineFilter)
    }

    if (categoryFilter !== "all") {
      docs = docs.filter(doc => doc.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      docs = docs.filter(doc => doc.status === statusFilter)
    }

    if (phaseFilter !== "all") {
      docs = docs.filter(doc => doc.phase === phaseFilter)
    }

    return docs.sort((a, b) => a.sheetNumber.localeCompare(b.sheetNumber))
  }, [documents, getDocumentsByProject, selectedProject, searchTerm, disciplineFilter, categoryFilter, statusFilter, phaseFilter])

  // Group documents by discipline for better organization
  const groupedDocuments = useMemo(() => {
    return filteredDocuments.reduce((acc, doc) => {
      const discipline = doc.discipline
      if (!acc[discipline]) {
        acc[discipline] = []
      }
      acc[discipline].push(doc)
      return acc
    }, {} as Record<string, Document[]>)
  }, [filteredDocuments])

  // Document statistics
  const documentStats = useMemo(() => {
    const projectDocs = selectedProject 
      ? getDocumentsByProject(selectedProject.id) 
      : documents

    return {
      total: projectDocs.length,
      current: projectDocs.filter(d => d.status === 'Current').length,
      superseded: projectDocs.filter(d => d.status === 'Superseded').length,
      withRevisions: projectDocs.filter(d => d.revision && d.revision.trim()).length,
      byDiscipline: projectDocs.reduce((acc, doc) => {
        acc[doc.discipline] = (acc[doc.discipline] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  }, [documents, getDocumentsByProject, selectedProject])

  // Form handlers
  const resetForm = useCallback(() => {
    setDocumentForm({
      projectId: selectedProject?.id || "2525840",
      sheetNumber: "",
      description: "",
      discipline: "Architectural",
      category: "Other",
      dateIssued: "",
      dateReceived: "",
      revision: "",
      phase: "BID",
      status: "Current",
      notes: ""
    })
    setEditingDocument(null)
  }, [selectedProject])

  const handleOpenAddEditDialog = useCallback((doc?: Document) => {
    if (doc) {
      setEditingDocument(doc)
      setDocumentForm({
        projectId: doc.projectId,
        sheetNumber: doc.sheetNumber,
        description: doc.description,
        discipline: doc.discipline,
        category: doc.category,
        dateIssued: doc.dateIssued,
        dateReceived: doc.dateReceived,
        revision: doc.revision || "",
        phase: doc.phase || "BID",
        status: doc.status,
        notes: doc.notes || ""
      })
    } else {
      resetForm()
    }
    setIsAddEditDialogOpen(true)
  }, [resetForm])

  const handleSaveDocument = useCallback(() => {
    // Validation
    if (!documentForm.sheetNumber.trim() || !documentForm.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Sheet Number and Description are required fields.",
        variant: "destructive"
      })
      return
    }

    // Check for duplicate sheet numbers
    const existingDoc = documents.find(d => 
      d.sheetNumber === documentForm.sheetNumber && 
      d.projectId === documentForm.projectId &&
      d.id !== editingDocument?.id
    )
    
    if (existingDoc) {
      toast({
        title: "Duplicate Sheet Number",
        description: "A document with this sheet number already exists for this project.",
        variant: "destructive"
      })
      return
    }

    if (editingDocument) {
      updateDocument(editingDocument.id, documentForm)
      toast({
        title: "Document Updated",
        description: `Document ${documentForm.sheetNumber} has been updated successfully.`
      })
    } else {
      addDocument(documentForm)
      toast({
        title: "Document Added",
        description: `Document ${documentForm.sheetNumber} has been added successfully.`
      })
    }

    setIsAddEditDialogOpen(false)
    resetForm()
  }, [documentForm, editingDocument, documents, addDocument, updateDocument, toast, resetForm])

  const handleDeleteDocument = useCallback((doc: Document) => {
    if (window.confirm(`Are you sure you want to delete document "${doc.sheetNumber}"?`)) {
      deleteDocument(doc.id)
      toast({
        title: "Document Deleted",
        description: `Document ${doc.sheetNumber} has been removed.`
      })
    }
  }, [deleteDocument, toast])

  const handleViewDocument = useCallback((doc: Document) => {
    setViewingDocument(doc)
    setIsViewDialogOpen(true)
  }, [])

  // Import handlers
  const handleFileImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['.csv', '.xlsx', '.xls']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    if (!validTypes.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV or Excel file (.csv, .xlsx, .xls)",
        variant: "destructive"
      })
      return
    }

    setImportProgress(0)
    setIsImportDialogOpen(true)

    try {
      const results = await importDocumentsFromFile(file, selectedProject?.id || "2525840")
      setImportResults(results)
      
      if (results.errorRows > 0) {
        toast({
          title: "Import Completed with Errors",
          description: `${results.successfulRows} documents imported successfully. ${results.errorRows} rows had errors.`,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${results.successfulRows} documents.`
        })
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "An error occurred while importing the file.",
        variant: "destructive"
      })
    }

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [selectedProject, importDocumentsFromFile, toast])

  const handleExport = useCallback(() => {
    exportDocumentsToCSV(selectedProject?.id)
    toast({
      title: "Export Successful",
      description: "Document log has been exported to CSV."
    })
  }, [selectedProject, exportDocumentsToCSV, toast])

  const handleDownloadTemplate = useCallback(() => {
    generateDocumentTemplate()
    toast({
      title: "Template Downloaded",
      description: "Document import template has been downloaded."
    })
  }, [generateDocumentTemplate, toast])

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchTerm("")
    setDisciplineFilter("all")
    setCategoryFilter("all")
    setStatusFilter("all")
    setPhaseFilter("all")
  }, [])

  const getStatusBadgeVariant = (status: Document['status']) => {
    switch (status) {
      case 'Current': return 'default'
      case 'Superseded': return 'secondary'
      case 'Void': return 'destructive'
      case 'Under Review': return 'outline'
      default: return 'secondary'
    }
  }

  const getPhaseBadgeColor = (phase: Document['phase']) => {
    switch (phase) {
      case 'SD': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'DD': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'CD': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'BID': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'CA': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Document Log
              </CardTitle>
              <CardDescription>
                Manage and track project bid documents and drawings
                {selectedProject && ` for ${selectedProject.project_name}`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{documentStats.total}</div>
                <div className="text-sm text-muted-foreground">Total Documents</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                {documentStats.current}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Current</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {documentStats.superseded}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Superseded</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                {documentStats.withRevisions}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">With Revisions</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                {Object.keys(documentStats.byDiscipline).length}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Disciplines</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search documents..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Discipline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Disciplines</SelectItem>
                <SelectItem value="Architectural">Architectural</SelectItem>
                <SelectItem value="Structural">Structural</SelectItem>
                <SelectItem value="MEP">MEP</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Plumbing">Plumbing</SelectItem>
                <SelectItem value="Civil">Civil</SelectItem>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Cover Sheet">Cover Sheet</SelectItem>
                <SelectItem value="Plans">Plans</SelectItem>
                <SelectItem value="Elevations">Elevations</SelectItem>
                <SelectItem value="Sections">Sections</SelectItem>
                <SelectItem value="Details">Details</SelectItem>
                <SelectItem value="Schedules">Schedules</SelectItem>
                <SelectItem value="Reports">Reports</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Current">Current</SelectItem>
                <SelectItem value="Superseded">Superseded</SelectItem>
                <SelectItem value="Void">Void</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters} className="w-full">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => handleOpenAddEditDialog()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Document
            </Button>
            
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Import from File
            </Button>
            
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
            
            <Button variant="outline" onClick={handleDownloadTemplate}>
              <Settings className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileImport}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Documents ({filteredDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Documents Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || disciplineFilter !== "all" || categoryFilter !== "all" 
                  ? "Try adjusting your search criteria or filters."
                  : "Start by adding your first document or importing from a file."
                }
              </p>
              <Button onClick={() => handleOpenAddEditDialog()}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add First Document
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Sheet No.</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-32">Discipline</TableHead>
                    <TableHead className="w-28">Category</TableHead>
                    <TableHead className="w-28">Date Issued</TableHead>
                    <TableHead className="w-28">Date Received</TableHead>
                    <TableHead className="w-24">Revision</TableHead>
                    <TableHead className="w-20">Phase</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-medium">
                        {doc.sheetNumber}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={doc.description}>
                          {doc.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {doc.discipline}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {doc.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {doc.dateIssued}
                      </TableCell>
                      <TableCell className="text-sm">
                        {doc.dateReceived}
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {doc.revision || '—'}
                      </TableCell>
                      <TableCell>
                        {doc.phase && (
                          <Badge className={`text-xs ${getPhaseBadgeColor(doc.phase)}`}>
                            {doc.phase}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(doc.status)} className="text-xs">
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDocument(doc)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenAddEditDialog(doc)}
                            title="Edit Document"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteDocument(doc)}
                            title="Delete Document"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Document Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDocument ? 'Edit Document' : 'Add New Document'}
            </DialogTitle>
            <CardDescription>
              {editingDocument 
                ? 'Update the document information below.' 
                : 'Enter the details for the new document.'
              }
            </CardDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="sheetNumber">Sheet Number *</Label>
              <Input
                id="sheetNumber"
                placeholder="e.g., A2.11"
                value={documentForm.sheetNumber}
                onChange={(e) => setDocumentForm(prev => ({ ...prev, sheetNumber: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="discipline">Discipline *</Label>
              <Select
                value={documentForm.discipline}
                onValueChange={(value: Document['discipline']) => 
                  setDocumentForm(prev => ({ ...prev, discipline: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Architectural">Architectural</SelectItem>
                  <SelectItem value="Structural">Structural</SelectItem>
                  <SelectItem value="MEP">MEP</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Civil">Civil</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="e.g., Level 00 - Life Safety Overall"
                value={documentForm.description}
                onChange={(e) => setDocumentForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={documentForm.category}
                onValueChange={(value: Document['category']) => 
                  setDocumentForm(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cover Sheet">Cover Sheet</SelectItem>
                  <SelectItem value="Plans">Plans</SelectItem>
                  <SelectItem value="Elevations">Elevations</SelectItem>
                  <SelectItem value="Sections">Sections</SelectItem>
                  <SelectItem value="Details">Details</SelectItem>
                  <SelectItem value="Schedules">Schedules</SelectItem>
                  <SelectItem value="Reports">Reports</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={documentForm.status}
                onValueChange={(value: Document['status']) => 
                  setDocumentForm(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Current">Current</SelectItem>
                  <SelectItem value="Superseded">Superseded</SelectItem>
                  <SelectItem value="Void">Void</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateIssued">Date Issued</Label>
              <Input
                id="dateIssued"
                type="date"
                value={documentForm.dateIssued}
                onChange={(e) => setDocumentForm(prev => ({ ...prev, dateIssued: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="dateReceived">Date Received</Label>
              <Input
                id="dateReceived"
                type="date"
                value={documentForm.dateReceived}
                onChange={(e) => setDocumentForm(prev => ({ ...prev, dateReceived: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="revision">Revision</Label>
              <Input
                id="revision"
                placeholder="e.g., Rev 1 or 03/07/25"
                value={documentForm.revision}
                onChange={(e) => setDocumentForm(prev => ({ ...prev, revision: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="phase">Phase</Label>
              <Select
                value={documentForm.phase}
                onValueChange={(value: Document['phase']) => 
                  setDocumentForm(prev => ({ ...prev, phase: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SD">Schematic Design</SelectItem>
                  <SelectItem value="DD">Design Development</SelectItem>
                  <SelectItem value="CD">Construction Documents</SelectItem>
                  <SelectItem value="BID">Bid Documents</SelectItem>
                  <SelectItem value="CA">Construction Administration</SelectItem>
                  <SelectItem value="Record">Record Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this document..."
                value={documentForm.notes}
                onChange={(e) => setDocumentForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDocument}>
              {editingDocument ? 'Update Document' : 'Add Document'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Details: {viewingDocument?.sheetNumber}
            </DialogTitle>
          </DialogHeader>
          
          {viewingDocument && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Sheet Number</Label>
                <p className="font-mono font-medium">{viewingDocument.sheetNumber}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Discipline</Label>
                <Badge variant="outline">{viewingDocument.discipline}</Badge>
              </div>
              
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p>{viewingDocument.description}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                <Badge variant="secondary">{viewingDocument.category}</Badge>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <Badge variant={getStatusBadgeVariant(viewingDocument.status)}>
                  {viewingDocument.status}
                </Badge>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date Issued</Label>
                <p className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {viewingDocument.dateIssued}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date Received</Label>
                <p className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {viewingDocument.dateReceived}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Revision</Label>
                <p className="font-mono">{viewingDocument.revision || 'No revision'}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Phase</Label>
                {viewingDocument.phase && (
                  <Badge className={getPhaseBadgeColor(viewingDocument.phase)}>
                    {viewingDocument.phase}
                  </Badge>
                )}
              </div>
              
              {viewingDocument.notes && (
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                  <p className="text-sm bg-muted p-3 rounded-md">{viewingDocument.notes}</p>
                </div>
              )}
              
              <div className="md:col-span-2 pt-4 border-t">
                <Label className="text-sm font-medium text-muted-foreground">Metadata</Label>
                <div className="text-xs text-muted-foreground space-y-1 mt-1">
                  <p>Created: {viewingDocument.createdAt?.toLocaleDateString()}</p>
                  <p>Updated: {viewingDocument.updatedAt?.toLocaleDateString()}</p>
                  <p>Created by: {viewingDocument.createdBy}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Results Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Results
            </DialogTitle>
          </DialogHeader>
          
          {importResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                    {importResults.successfulRows}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Imported</div>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className="text-lg font-semibold text-red-700 dark:text-red-300">
                    {importResults.errorRows}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">Errors</div>
                </div>
              </div>
              
              {importResults.errors && importResults.errors.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Errors:</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1 mt-2">
                    {importResults.errors.slice(0, 5).map((error: any, index: number) => (
                      <Alert key={index} variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3" />
                        <AlertDescription>
                          Row {error.row}: {error.message}
                        </AlertDescription>
                      </Alert>
                    ))}
                    {importResults.errors.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        ... and {importResults.errors.length - 5} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsImportDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 