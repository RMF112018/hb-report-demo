"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEstimating, type ValueAnalysis } from "./estimating-context"
import { useToast } from "@/hooks/use-toast"
import { BarChart3, Plus, Search, Edit, Trash2, Download } from "lucide-react"

/**
 * @fileoverview ValueAnalysis Component
 *
 * This component provides a comprehensive interface for managing value analysis items
 * within the Estimating Workflow. Value analysis is a systematic approach to improving
 * the value of a project by examining the function of various components and identifying
 * opportunities for cost reduction or performance improvement.
 *
 * @version 1.0.0
 * @author HB Report Development Team
 * @since 2025-06-17
 *
 * @features
 * - Searchable table displaying all value analysis items with Item Number, Description, and Notes
 * - Add/Edit dialog for creating and modifying value analysis entries
 * - Export functionality to CSV format for external analysis
 * - Real-time item count tracking with badge display
 * - Input validation ensuring data quality and consistency
 * - Integration with EstimatingContext for centralized state management
 * - Responsive design optimized for various screen sizes
 * - Professional UI using shadcn/ui components and Tailwind CSS
 *
 * @state
 * - `searchTerm`: string - Controls the search filter for value analysis items
 * - `isAddingValueAnalysis`: boolean - Controls the visibility of the add dialog
 * - `isEditingValueAnalysis`: boolean - Controls the visibility of the edit dialog
 * - `valueAnalysisForm`: Partial<ValueAnalysis> - Manages form data for add/edit operations
 *
 * @dependencies
 * - EstimatingContext: for accessing and modifying value analysis data
 * - shadcn/ui components: Card, Table, Dialog, Button, Input, Badge, Label, Textarea
 * - Lucide icons: BarChart3, Plus, Search, Edit, Trash2, Download
 * - useToast: for displaying user notifications
 *
 * @validation
 * - Description: Required field, cannot be empty or whitespace only
 * - Item Number: Optional but recommended for organization
 * - Notes: Optional field for additional context
 *
 * @maintenance
 * To extend this component:
 * 1. Add new fields to the ValueAnalysis interface in estimating-context.tsx
 * 2. Update the form state and validation logic accordingly
 * 3. Modify the table columns and dialog form to include new fields
 * 4. Update the CSV export functionality to include new data
 * 5. Add corresponding JSDoc documentation for any new features
 */

/**
 * Form validation for value analysis items
 *
 * @param valueAnalysis - The value analysis item to validate
 * @returns {object} Validation result with isValid flag and error message
 *
 * @example
 * \`\`\`typescript
 * const result = validateValueAnalysis({
 *   itemNumber: "VA-001",
 *   description: "Exterior Wall System Analysis",
 *   notes: "Evaluate alternative cladding materials"
 * })
 * \`\`\`
 */
const validateValueAnalysis = (valueAnalysis: Partial<ValueAnalysis>): { isValid: boolean; error?: string } => {
  if (!valueAnalysis.description?.trim()) {
    return { isValid: false, error: "Description is required" }
  }

  if (valueAnalysis.description.trim().length < 3) {
    return { isValid: false, error: "Description must be at least 3 characters long" }
  }

  return { isValid: true }
}

/**
 * Exports value analysis data to CSV format
 *
 * @param valueAnalysisItems - Array of value analysis items to export
 * @returns {void} Triggers browser download of CSV file
 *
 * @example
 * \`\`\`typescript
 * exportToCSV(projectEstimate.valueAnalysis)
 * \`\`\`
 */
const exportToCSV = (valueAnalysisItems: ValueAnalysis[]): void => {
  const headers = ["Item Number", "Description", "Notes", "Created Date", "Last Modified"]
  const csvContent = [
    headers.join(","),
    ...valueAnalysisItems.map((item) =>
      [
        `"${item.itemNumber || ""}"`,
        `"${item.description}"`,
        `"${item.notes || ""}"`,
        `"${item.createdAt.toLocaleDateString()}"`,
        `"${item.updatedAt.toLocaleDateString()}"`,
      ].join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `value-analysis-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Main component for managing value analysis items within the estimating workflow.
 * Provides a comprehensive interface for creating, editing, searching, and exporting
 * value analysis data.
 *
 * @returns {JSX.Element} The rendered ValueAnalysis component
 */
export default function ValueAnalysisComponent(): JSX.Element {
  const { projectEstimate, addValueAnalysis, updateValueAnalysis, deleteValueAnalysis } = useEstimating()
  const { toast } = useToast()

  // Local state management
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingValueAnalysis, setIsAddingValueAnalysis] = useState(false)
  const [isEditingValueAnalysis, setIsEditingValueAnalysis] = useState(false)
  const [valueAnalysisForm, setValueAnalysisForm] = useState<Partial<ValueAnalysis>>({})

  /**
   * Filtered value analysis items based on search term
   * Searches across item number, description, and notes fields
   */
  const filteredValueAnalysis = useMemo(() => {
    if (!searchTerm.trim()) return projectEstimate.valueAnalysis

    const searchLower = searchTerm.toLowerCase()
    return projectEstimate.valueAnalysis.filter(
      (item) =>
        item.itemNumber?.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.notes?.toLowerCase().includes(searchLower),
    )
  }, [projectEstimate.valueAnalysis, searchTerm])

  /**
   * Handles adding a new value analysis item
   */
  const handleAddValueAnalysis = useCallback(() => {
    const validation = validateValueAnalysis(valueAnalysisForm)
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.error,
        variant: "destructive",
      })
      return
    }

    addValueAnalysis({
      itemNumber: valueAnalysisForm.itemNumber || "",
      description: valueAnalysisForm.description!,
      notes: valueAnalysisForm.notes || "",
    })

    setValueAnalysisForm({})
    setIsAddingValueAnalysis(false)
    toast({
      title: "Value Analysis Added",
      description: "The value analysis item has been successfully added.",
    })
  }, [valueAnalysisForm, addValueAnalysis, toast])

  /**
   * Handles updating an existing value analysis item
   */
  const handleUpdateValueAnalysis = useCallback(() => {
    if (!valueAnalysisForm.id) return

    const validation = validateValueAnalysis(valueAnalysisForm)
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.error,
        variant: "destructive",
      })
      return
    }

    updateValueAnalysis(valueAnalysisForm.id, {
      itemNumber: valueAnalysisForm.itemNumber || "",
      description: valueAnalysisForm.description!,
      notes: valueAnalysisForm.notes || "",
    })

    setValueAnalysisForm({})
    setIsEditingValueAnalysis(false)
    toast({
      title: "Value Analysis Updated",
      description: "The value analysis item has been successfully updated.",
    })
  }, [valueAnalysisForm, updateValueAnalysis, toast])

  /**
   * Handles deleting a value analysis item
   */
  const handleDeleteValueAnalysis = useCallback(
    (id: string) => {
      deleteValueAnalysis(id)
      toast({
        title: "Value Analysis Deleted",
        description: "The value analysis item has been successfully deleted.",
      })
    },
    [deleteValueAnalysis, toast],
  )

  /**
   * Opens the edit dialog with pre-populated data
   */
  const openEditDialog = useCallback((item: ValueAnalysis) => {
    setValueAnalysisForm(item)
    setIsEditingValueAnalysis(true)
  }, [])

  /**
   * Resets form state and closes dialogs
   */
  const resetForm = useCallback(() => {
    setValueAnalysisForm({})
    setIsAddingValueAnalysis(false)
    setIsEditingValueAnalysis(false)
  }, [])

  /**
   * Handles CSV export
   */
  const handleExport = useCallback(() => {
    exportToCSV(projectEstimate.valueAnalysis)
    toast({
      title: "Export Successful",
      description: "Value analysis data has been exported to CSV.",
    })
  }, [projectEstimate.valueAnalysis, toast])

  return (
    <Card className="w-full" data-tour="value-analysis">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-xl font-semibold">Value Analysis</CardTitle>
          <Badge variant="secondary" className="ml-2">
            {projectEstimate.valueAnalysis.length} items
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isAddingValueAnalysis} onOpenChange={setIsAddingValueAnalysis}>
            <DialogTrigger asChild>
              <Button size="sm" className="add-value-analysis-btn" data-tour="add-value-analysis">
                <Plus className="h-4 w-4 mr-2" />
                Add Value Analysis
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Value Analysis Item</DialogTitle>
                <DialogDescription>
                  Create a new value analysis item to track cost optimization opportunities and performance
                  improvements.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="itemNumber" className="text-right">
                    Item Number
                  </Label>
                  <Input
                    id="itemNumber"
                    placeholder="VA-001"
                    className="col-span-3"
                    value={valueAnalysisForm.itemNumber || ""}
                    onChange={(e) => setValueAnalysisForm((prev) => ({ ...prev, itemNumber: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description *
                  </Label>
                  <Input
                    id="description"
                    placeholder="Exterior Wall System Analysis"
                    className="col-span-3"
                    value={valueAnalysisForm.description || ""}
                    onChange={(e) => setValueAnalysisForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="notes" className="text-right pt-2">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional details about the value analysis..."
                    className="col-span-3"
                    rows={3}
                    value={valueAnalysisForm.notes || ""}
                    onChange={(e) => setValueAnalysisForm((prev) => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleAddValueAnalysis}>Add Value Analysis</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search value analysis items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border value-analysis-table" data-tour="value-analysis-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Item Number</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[300px]">Notes</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredValueAnalysis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    {searchTerm ? "No value analysis items match your search." : "No value analysis items found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredValueAnalysis.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.itemNumber || "—"}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {item.notes ? (
                        <span className="line-clamp-2">{item.notes}</span>
                      ) : (
                        <span className="text-gray-400">No notes</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit value analysis</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteValueAnalysis(item.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete value analysis</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditingValueAnalysis} onOpenChange={setIsEditingValueAnalysis}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Value Analysis Item</DialogTitle>
            <DialogDescription>
              Update the value analysis item details to reflect current analysis and recommendations.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-itemNumber" className="text-right">
                Item Number
              </Label>
              <Input
                id="edit-itemNumber"
                placeholder="VA-001"
                className="col-span-3"
                value={valueAnalysisForm.itemNumber || ""}
                onChange={(e) => setValueAnalysisForm((prev) => ({ ...prev, itemNumber: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description *
              </Label>
              <Input
                id="edit-description"
                placeholder="Exterior Wall System Analysis"
                className="col-span-3"
                value={valueAnalysisForm.description || ""}
                onChange={(e) => setValueAnalysisForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-notes" className="text-right pt-2">
                Notes
              </Label>
              <Textarea
                id="edit-notes"
                placeholder="Additional details about the value analysis..."
                className="col-span-3"
                rows={3}
                value={valueAnalysisForm.notes || ""}
                onChange={(e) => setValueAnalysisForm((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleUpdateValueAnalysis}>Update Value Analysis</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
