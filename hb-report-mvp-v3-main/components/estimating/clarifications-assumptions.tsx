"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PlusCircle, Trash2, Edit, FileText, Search } from "lucide-react"
import { useEstimating } from "./estimating-context"
import type { Clarification } from "@/types/estimating" // Assuming Clarification type is here
import { useDebounce } from "@/hooks/use-debounce"
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
 * @since 2025-06-17
 */

/**
 * Validates if a string matches the CSI Division format (e.g., "XX XX XX").
 * @param csi - The CSI division string to validate.
 * @returns True if the CSI is valid, false otherwise.
 */
const validateCsiDivision = (csi: string): boolean => {
  // Regex for XX XX XX format, allowing optional spaces
  return /^\d{2}\s?\d{2}\s?\d{2}$/.test(csi.trim())
}

export default function ClarificationsAssumptions() {
  const { projectEstimate, addClarification, updateClarification, deleteClarification } = useEstimating()

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState<string>("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // State for dialog and form management
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [editingClarification, setEditingClarification] = useState<Clarification | null>(null)
  const [clarificationForm, setClarificationForm] = useState<Omit<Clarification, "id" | "createdAt" | "updatedAt">>({
    csiDivision: "",
    description: "",
    type: "Assumption",
    notes: "",
  })
  const [csiError, setCsiError] = useState<string | null>(null)

  /**
   * Filters clarifications based on the debounced search term.
   */
  const filteredClarifications = useMemo(() => {
    if (!debouncedSearchTerm) {
      return projectEstimate.clarifications
    }
    const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase()
    return projectEstimate.clarifications.filter(
      (clar) =>
        clar.csiDivision.toLowerCase().includes(lowerCaseSearchTerm) ||
        clar.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        clar.type.toLowerCase().includes(lowerCaseSearchTerm) ||
        clar.notes.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }, [projectEstimate.clarifications, debouncedSearchTerm])

  /**
   * Handles opening the dialog for adding a new clarification.
   */
  const handleAddClarificationClick = useCallback(() => {
    setEditingClarification(null)
    setClarificationForm({
      csiDivision: "",
      description: "",
      type: "Assumption",
      notes: "",
    })
    setCsiError(null)
    setIsDialogOpen(true)
  }, [])

  /**
   * Handles opening the dialog for editing an existing clarification.
   * @param clarification - The clarification object to edit.
   */
  const handleEditClarificationClick = useCallback((clarification: Clarification) => {
    setEditingClarification(clarification)
    setClarificationForm({
      csiDivision: clarification.csiDivision,
      description: clarification.description,
      type: clarification.type,
      notes: clarification.notes,
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
    [deleteClarification],
  )

  /**
   * Exports the current clarifications to a CSV file.
   */
  const handleExportClarifications = useCallback(() => {
    const headers = ["CSI Division", "Description", "Type", "Notes", "Created At", "Updated At"]
    const rows = projectEstimate.clarifications.map((clar) => [
      clar.csiDivision,
      clar.description,
      clar.type,
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
      link.setAttribute("download", "clarifications_assumptions.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [projectEstimate.clarifications])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Clarifications & Assumptions</CardTitle>
        <CardDescription>Document all project clarifications, assumptions, and exclusions.</CardDescription>
      </CardHeader>
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
                <TableHead className="min-w-[150px]">Notes</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClarifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No clarifications found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClarifications.map((clar) => (
                  <TableRow key={clar.id}>
                    <TableCell className="font-medium">{clar.csiDivision}</TableCell>
                    <TableCell>{clar.description}</TableCell>
                    <TableCell>{clar.type}</TableCell>
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
                  : "Add a new clarification or assumption to your project estimate."}
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
