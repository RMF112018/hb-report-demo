"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PlusCircle, Trash2, Edit, FileText, Search, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { useEstimating } from "./EstimatingProvider"
import type { Clarification } from "@/types/estimating-tracker"
import { Separator } from "@/components/ui/separator"

/**
 * @fileoverview Clarifications & Assumptions Component
 *
 * This component provides a comprehensive interface for managing project clarifications,
 * assumptions, and exclusions. It features a searchable table, an add/edit dialog,
 * and an export functionality.
 *
 * @version 1.0.0
 * @author HB Report Development Team
 * @since 2025-01-26
 */

interface ClarificationsAssumptionsProps {
  projectId?: string
  showHeader?: boolean
  className?: string
}

/**
 * Validates if a string matches the CSI Division format (e.g., "XX XX XX").
 * @param csi - The CSI division string to validate.
 * @returns True if the CSI is valid, false otherwise.
 */
const validateCsiDivision = (csi: string): boolean => {
  // Regex for XX XX XX format, allowing optional spaces
  return /^\d{2}\s?\d{2}\s?\d{2}$/.test(csi.trim())
}

export default function ClarificationsAssumptions({ 
  projectId, 
  showHeader = true, 
  className = "" 
}: ClarificationsAssumptionsProps) {
  const { 
    clarifications, 
    selectedProject, 
    addClarification, 
    updateClarification, 
    deleteClarification,
    getClarificationsByProject 
  } = useEstimating()

  // Use projectId prop or selected project
  const currentProjectId = projectId || selectedProject?.id || ""
  
  // Get clarifications for current project
  const projectClarifications = useMemo(() => {
    if (!currentProjectId) return clarifications
    return getClarificationsByProject(currentProjectId)
  }, [clarifications, currentProjectId, getClarificationsByProject])

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState<string>("")

  // State for dialog and form management
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [editingClarification, setEditingClarification] = useState<Clarification | null>(null)
  const [clarificationForm, setClarificationForm] = useState<Omit<Clarification, "id" | "createdAt" | "updatedAt">>({
    projectId: currentProjectId,
    csiDivision: "",
    description: "",
    type: "Assumption",
    notes: "",
    reviewStatus: "pending",
    priority: "medium",
    resolved: false
  })
  const [csiError, setCsiError] = useState<string | null>(null)

  /**
   * Filters clarifications based on the search term.
   */
  const filteredClarifications = useMemo(() => {
    if (!searchTerm) {
      return projectClarifications
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return projectClarifications.filter(
      (clar) =>
        clar.csiDivision.toLowerCase().includes(lowerCaseSearchTerm) ||
        clar.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        clar.type.toLowerCase().includes(lowerCaseSearchTerm) ||
        clar.notes.toLowerCase().includes(lowerCaseSearchTerm)
    )
  }, [projectClarifications, searchTerm])

  /**
   * Handles opening the dialog for adding a new clarification.
   */
  const handleAddClarificationClick = useCallback(() => {
    setEditingClarification(null)
    setClarificationForm({
      projectId: currentProjectId,
      csiDivision: "",
      description: "",
      type: "Assumption",
      notes: "",
      reviewStatus: "pending",
      priority: "medium",
      resolved: false
    })
    setCsiError(null)
    setIsDialogOpen(true)
  }, [currentProjectId])

  /**
   * Handles opening the dialog for editing an existing clarification.
   * @param clarification - The clarification object to edit.
   */
  const handleEditClarificationClick = useCallback((clarification: Clarification) => {
    setEditingClarification(clarification)
    setClarificationForm({
      projectId: clarification.projectId,
      csiDivision: clarification.csiDivision,
      description: clarification.description,
      type: clarification.type,
      notes: clarification.notes,
      reviewStatus: clarification.reviewStatus || "pending",
      priority: clarification.priority || "medium",
      resolved: clarification.resolved || false,
      category: clarification.category,
      affectedTrades: clarification.affectedTrades,
      estimatedImpact: clarification.estimatedImpact,
      createdBy: clarification.createdBy
    })
    setCsiError(null)
    setIsDialogOpen(true)
  }, [])

  /**
   * Handles saving or updating a clarification.
   */
  const handleSaveClarification = useCallback(() => {
    if (!validateCsiDivision(clarificationForm.csiDivision)) {
      setCsiError("CSI Division must be in XX XX XX format (e.g., 01 00 00)")
      return
    }
    setCsiError(null)

    if (clarificationForm.csiDivision && clarificationForm.description && clarificationForm.type) {
      if (editingClarification) {
        updateClarification(editingClarification.id, clarificationForm)
      } else {
        addClarification(clarificationForm)
      }
      setIsDialogOpen(false)
    }
  }, [clarificationForm, editingClarification, addClarification, updateClarification])

  /**
   * Handles deleting a clarification.
   * @param id - The ID of the clarification to delete.
   */
  const handleDeleteClarification = useCallback(
    (id: string) => {
      if (window.confirm("Are you sure you want to delete this clarification?")) {
        deleteClarification(id)
      }
    },
    [deleteClarification]
  )

  /**
   * Exports the current clarifications to a CSV file.
   */
  const handleExportClarifications = useCallback(() => {
    const headers = ["CSI Division", "Description", "Type", "Priority", "Status", "Notes", "Created At", "Updated At"]
    const rows = filteredClarifications.map((clar) => [
      clar.csiDivision,
      clar.description,
      clar.type,
      clar.priority || "medium",
      clar.reviewStatus || "pending",
      clar.notes,
      clar.createdAt.toLocaleString(),
      clar.updatedAt.toLocaleString(),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `clarifications_assumptions_${currentProjectId || 'all'}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [filteredClarifications, currentProjectId])

  // Get status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    }
  }

  // Get priority color
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  // Get status icon
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <AlertCircle className="h-4 w-4" />
      case "pending":
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Card className={`w-full ${className}`}>
      {showHeader && (
        <CardHeader>
          <CardTitle>Clarifications & Assumptions</CardTitle>
          <CardDescription>
            Document all project clarifications, assumptions, and exclusions for {selectedProject?.project_name || 'the current project'}.
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search clarifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={handleAddClarificationClick}
              className="w-full sm:w-auto"
              data-tour="add-clarification-btn"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Clarification
            </Button>
            <Button onClick={handleExportClarifications} variant="outline" className="w-full sm:w-auto">
              <FileText className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
        </div>

        <Separator />

        <div className="overflow-x-auto" data-tour="clarifications-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">CSI Division</TableHead>
                <TableHead className="min-w-[200px]">Description</TableHead>
                <TableHead className="min-w-[100px]">Type</TableHead>
                <TableHead className="min-w-[100px]">Priority</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="min-w-[150px]">Notes</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClarifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm ? "No clarifications found matching your search." : "No clarifications found. Add your first clarification to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredClarifications.map((clar) => (
                  <TableRow key={clar.id}>
                    <TableCell className="font-medium">{clar.csiDivision}</TableCell>
                    <TableCell>{clar.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{clar.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(clar.priority)}>
                        {clar.priority || "medium"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(clar.reviewStatus)}
                        <Badge className={getStatusColor(clar.reviewStatus)}>
                          {clar.reviewStatus || "pending"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{clar.notes || "-"}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClarificationClick(clar)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClarification(clar.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingClarification ? "Edit Clarification" : "Add New Clarification"}</DialogTitle>
              <DialogDescription>
                {editingClarification
                  ? "Make changes to this clarification here. Click save when you're done."
                  : "Add a new clarification, assumption, or exclusion to your project estimate."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="csiDivision" className="text-right">
                  CSI Division
                </Label>
                <Input
                  id="csiDivision"
                  placeholder="e.g., 01 00 00"
                  value={clarificationForm.csiDivision}
                  onChange={(e) => {
                    setClarificationForm({ ...clarificationForm, csiDivision: e.target.value })
                    setCsiError(null) // Clear error on change
                  }}
                  className="col-span-3"
                />
                {csiError && <p className="col-span-4 text-right text-red-500 text-sm">{csiError}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={clarificationForm.type}
                  onValueChange={(value: Clarification["type"]) =>
                    setClarificationForm({ ...clarificationForm, type: value })
                  }
                >
                  <SelectTrigger id="type" className="col-span-3">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assumption">Assumption</SelectItem>
                    <SelectItem value="Exclusion">Exclusion</SelectItem>
                    <SelectItem value="Clarification">Clarification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select
                  value={clarificationForm.priority || "medium"}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setClarificationForm({ ...clarificationForm, priority: value })
                  }
                >
                  <SelectTrigger id="priority" className="col-span-3">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the clarification or assumption"
                  value={clarificationForm.description}
                  onChange={(e) => setClarificationForm({ ...clarificationForm, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes (optional)"
                  value={clarificationForm.notes}
                  onChange={(e) => setClarificationForm({ ...clarificationForm, notes: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveClarification}>
                {editingClarification ? "Save Changes" : "Add Clarification"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
} 