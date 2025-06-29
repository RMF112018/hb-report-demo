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
import { useToast } from "@/hooks/use-toast"
import { useEstimating, type Allowance } from "./estimating-context"
import { DollarSign, Plus, Search, Edit, Trash2, Download, Calculator } from "lucide-react"
import type { JSX } from "react/jsx-runtime"

/**
 * @fileoverview Allowances Component for Managing Project Allowances
 *
 * This component provides a comprehensive interface for managing project allowances
 * within the Pre-Construction estimating workflow. It allows users to track, add,
 * edit, and delete allowance items organized by CSI divisions.
 *
 * @version 1.0.0
 * @author HB Report Development Team
 * @since 2025-06-17
 *
 * @features
 * - Searchable allowances table with CSI Division, Description, Value, and Actions
 * - Add/Edit dialog with form validation for CSI Division format and non-negative values
 * - Export functionality to CSV format
 * - Real-time total allowances calculation
 * - Integration with EstimatingContext for centralized state management
 * - Guided tour integration for user onboarding
 *
 * @dependencies
 * - shadcn/ui components: Card, Table, Dialog, Input, Button, Badge, Label, Textarea
 * - Lucide icons: DollarSign, Plus, Search, Edit, Trash2, Download, Calculator
 * - EstimatingContext: for accessing project allowances and management actions
 * - useToast: for displaying user notifications
 *
 * @maintenance
 * To extend this component:
 * 1. Add new fields to the Allowance interface in estimating-context.tsx
 * 2. Update the form state and validation logic accordingly
 * 3. Modify the table columns to display new fields
 * 4. Update export functionality to include new fields
 * 5. Add corresponding guided tour steps if needed
 */

/**
 * Form state interface for allowance add/edit operations
 */
interface AllowanceFormState {
  csiDivision: string
  description: string
  value: string
  notes: string
}

/**
 * Initial form state for new allowances
 */
const initialFormState: AllowanceFormState = {
  csiDivision: "",
  description: "",
  value: "",
  notes: "",
}

/**
 * Validates CSI Division format
 *
 * @param division - The CSI division string to validate
 * @returns {boolean} True if valid format (e.g., "033000", "03 30 00"), false otherwise
 *
 * @example
 * \`\`\`typescript
 * const isValid = validateCSIDivision("033000") // true
 * const isInvalid = validateCSIDivision("invalid") // false
 * \`\`\`
 */
const validateCSIDivision = (division: string): boolean => {
  // Remove spaces and check if it's a 6-digit number or has valid spacing
  const cleaned = division.replace(/\s/g, "")
  return /^\d{6}$/.test(cleaned) || /^\d{2}\s\d{2}\s\d{2}$/.test(division)
}

/**
 * Validates allowance value
 *
 * @param value - The allowance value to validate
 * @returns {boolean} True if valid non-negative number, false otherwise
 *
 * @example
 * \`\`\`typescript
 * const isValid = validateAllowanceValue("25000") // true
 * const isInvalid = validateAllowanceValue("-100") // false
 * \`\`\`
 */
const validateAllowanceValue = (value: string): boolean => {
  const numValue = Number.parseFloat(value)
  return !isNaN(numValue) && numValue >= 0
}

/**
 * Formats currency values for display
 *
 * @param value - The numeric value to format
 * @returns {string} Formatted currency string
 *
 * @example
 * \`\`\`typescript
 * const formatted = formatCurrency(25000) // "$25,000.00"
 * \`\`\`
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

/**
 * Exports allowances data to CSV format
 *
 * @param allowances - Array of allowance items to export
 * @returns {void}
 *
 * @example
 * \`\`\`typescript
 * exportAllowancesToCSV(projectAllowances)
 * \`\`\`
 */
const exportAllowancesToCSV = (allowances: Allowance[]): void => {
  const headers = ["CSI Division", "Description", "Value", "Notes", "Created Date", "Updated Date"]
  const csvContent = [
    headers.join(","),
    ...allowances.map((allowance) =>
      [
        `"${allowance.csiDivision}"`,
        `"${allowance.description}"`,
        allowance.value,
        `"${allowance.notes || ""}"`,
        `"${allowance.createdAt.toLocaleDateString()}"`,
        `"${allowance.updatedAt.toLocaleDateString()}"`,
      ].join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `project-allowances-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Main Allowances Component
 *
 * @description Provides a comprehensive interface for managing project allowances
 * including search, add, edit, delete, and export functionality.
 *
 * @returns {JSX.Element} The rendered Allowances component
 */
export default function Allowances(): JSX.Element {
  const { projectEstimate, addAllowance, updateAllowance, deleteAllowance } = useEstimating()
  const { toast } = useToast()

  // Local state management
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingAllowance, setIsAddingAllowance] = useState(false)
  const [isEditingAllowance, setIsEditingAllowance] = useState(false)
  const [editingAllowanceId, setEditingAllowanceId] = useState<string | null>(null)
  const [allowanceForm, setAllowanceForm] = useState<AllowanceFormState>(initialFormState)

  /**
   * Filtered allowances based on search term
   */
  const filteredAllowances = useMemo(() => {
    if (!searchTerm.trim()) return projectEstimate.allowances

    const searchLower = searchTerm.toLowerCase()
    return projectEstimate.allowances.filter(
      (allowance) =>
        allowance.csiDivision.toLowerCase().includes(searchLower) ||
        allowance.description.toLowerCase().includes(searchLower) ||
        allowance.notes?.toLowerCase().includes(searchLower),
    )
  }, [projectEstimate.allowances, searchTerm])

  /**
   * Calculate total allowances value
   */
  const totalAllowances = useMemo(() => {
    return projectEstimate.allowances.reduce((sum, allowance) => sum + allowance.value, 0)
  }, [projectEstimate.allowances])

  /**
   * Handles form input changes
   */
  const handleFormChange = useCallback((field: keyof AllowanceFormState, value: string) => {
    setAllowanceForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  /**
   * Validates the current form state
   */
  const validateForm = useCallback((): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!allowanceForm.csiDivision.trim()) {
      errors.push("CSI Division is required")
    } else if (!validateCSIDivision(allowanceForm.csiDivision)) {
      errors.push("CSI Division must be in format XXXXXX or XX XX XX (e.g., 033000 or 03 30 00)")
    }

    if (!allowanceForm.description.trim()) {
      errors.push("Description is required")
    }

    if (!allowanceForm.value.trim()) {
      errors.push("Value is required")
    } else if (!validateAllowanceValue(allowanceForm.value)) {
      errors.push("Value must be a non-negative number")
    }

    return { isValid: errors.length === 0, errors }
  }, [allowanceForm])

  /**
   * Handles adding a new allowance
   */
  const handleAddAllowance = useCallback(async () => {
    const validation = validateForm()
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(", "),
        variant: "destructive",
      })
      return
    }

    try {
      addAllowance({
        csiDivision: allowanceForm.csiDivision.trim(),
        description: allowanceForm.description.trim(),
        value: Number.parseFloat(allowanceForm.value),
        notes: allowanceForm.notes.trim() || undefined,
      })

      setAllowanceForm(initialFormState)
      setIsAddingAllowance(false)

      toast({
        title: "Allowance Added",
        description: "The allowance has been successfully added to the project.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add allowance. Please try again.",
        variant: "destructive",
      })
    }
  }, [allowanceForm, addAllowance, validateForm, toast])

  /**
   * Handles editing an existing allowance
   */
  const handleEditAllowance = useCallback(async () => {
    if (!editingAllowanceId) return

    const validation = validateForm()
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(", "),
        variant: "destructive",
      })
      return
    }

    try {
      updateAllowance(editingAllowanceId, {
        csiDivision: allowanceForm.csiDivision.trim(),
        description: allowanceForm.description.trim(),
        value: Number.parseFloat(allowanceForm.value),
        notes: allowanceForm.notes.trim() || undefined,
      })

      setAllowanceForm(initialFormState)
      setIsEditingAllowance(false)
      setEditingAllowanceId(null)

      toast({
        title: "Allowance Updated",
        description: "The allowance has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update allowance. Please try again.",
        variant: "destructive",
      })
    }
  }, [editingAllowanceId, allowanceForm, updateAllowance, validateForm, toast])

  /**
   * Handles deleting an allowance
   */
  const handleDeleteAllowance = useCallback(
    (id: string) => {
      try {
        deleteAllowance(id)
        toast({
          title: "Allowance Deleted",
          description: "The allowance has been successfully deleted.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete allowance. Please try again.",
          variant: "destructive",
        })
      }
    },
    [deleteAllowance, toast],
  )

  /**
   * Opens edit dialog with pre-filled data
   */
  const openEditDialog = useCallback((allowance: Allowance) => {
    setAllowanceForm({
      csiDivision: allowance.csiDivision,
      description: allowance.description,
      value: allowance.value.toString(),
      notes: allowance.notes || "",
    })
    setEditingAllowanceId(allowance.id)
    setIsEditingAllowance(true)
  }, [])

  /**
   * Closes dialogs and resets form
   */
  const closeDialogs = useCallback(() => {
    setIsAddingAllowance(false)
    setIsEditingAllowance(false)
    setEditingAllowanceId(null)
    setAllowanceForm(initialFormState)
  }, [])

  /**
   * Handles CSV export
   */
  const handleExport = useCallback(() => {
    try {
      exportAllowancesToCSV(projectEstimate.allowances)
      toast({
        title: "Export Successful",
        description: "Allowances data has been exported to CSV.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export allowances data. Please try again.",
        variant: "destructive",
      })
    }
  }, [projectEstimate.allowances, toast])

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-green-600" />
              <div>
                <CardTitle className="text-xl font-semibold">Project Allowances</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Manage allowances for various project components and contingencies
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calculator className="h-3 w-3" />
                Total: {formatCurrency(totalAllowances)}
              </Badge>
              <Badge variant="outline">
                {projectEstimate.allowances.length} {projectEstimate.allowances.length === 1 ? "Item" : "Items"}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Controls Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search allowances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Dialog open={isAddingAllowance} onOpenChange={setIsAddingAllowance}>
                <DialogTrigger asChild>
                  <Button size="sm" className="add-allowance-btn" data-tour="add-allowance-btn">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Allowance
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Allowance</DialogTitle>
                    <DialogDescription>Add a new allowance item to the project estimate.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="csiDivision">CSI Division</Label>
                      <Input
                        id="csiDivision"
                        placeholder="e.g., 033000 or 03 30 00"
                        value={allowanceForm.csiDivision}
                        onChange={(e) => handleFormChange("csiDivision", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="e.g., Additional Reinforcing Steel"
                        value={allowanceForm.description}
                        onChange={(e) => handleFormChange("description", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="value">Value ($)</Label>
                      <Input
                        id="value"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g., 25000"
                        value={allowanceForm.value}
                        onChange={(e) => handleFormChange("value", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes about this allowance..."
                        value={allowanceForm.notes}
                        onChange={(e) => handleFormChange("notes", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={closeDialogs}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAllowance}>Add Allowance</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allowances Table */}
      <Card>
        <CardContent className="p-0">
          <div className="allowances-table" data-tour="allowances-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">CSI Division</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-32 text-right">Value</TableHead>
                  <TableHead className="w-24 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAllowances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      {searchTerm ? "No allowances match your search criteria." : "No allowances added yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAllowances.map((allowance) => (
                    <TableRow key={allowance.id}>
                      <TableCell className="font-mono text-sm">{allowance.csiDivision}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{allowance.description}</div>
                          {allowance.notes && <div className="text-sm text-gray-500 mt-1">{allowance.notes}</div>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(allowance.value)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(allowance)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit allowance</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAllowance(allowance.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete allowance</span>
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
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditingAllowance} onOpenChange={setIsEditingAllowance}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Allowance</DialogTitle>
            <DialogDescription>Update the allowance item details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-csiDivision">CSI Division</Label>
              <Input
                id="edit-csiDivision"
                placeholder="e.g., 033000 or 03 30 00"
                value={allowanceForm.csiDivision}
                onChange={(e) => handleFormChange("csiDivision", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="e.g., Additional Reinforcing Steel"
                value={allowanceForm.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-value">Value ($)</Label>
              <Input
                id="edit-value"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 25000"
                value={allowanceForm.value}
                onChange={(e) => handleFormChange("value", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-notes">Notes (Optional)</Label>
              <Textarea
                id="edit-notes"
                placeholder="Additional notes about this allowance..."
                value={allowanceForm.notes}
                onChange={(e) => handleFormChange("notes", e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialogs}>
              Cancel
            </Button>
            <Button onClick={handleEditAllowance}>Update Allowance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
