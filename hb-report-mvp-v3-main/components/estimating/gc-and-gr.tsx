"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Building, Plus, Edit, Trash2, Search, Download, DollarSign } from "lucide-react"
import { useEstimating, type GCAndGRItem } from "./estimating-context"
import { useToast } from "@/hooks/use-toast"

/**
 * @fileoverview GCAndGR Component for Managing General Conditions and General Requirements
 *
 * This component provides a comprehensive interface for managing General Conditions (GC)
 * and General Requirements (GR) items within the Pre-Construction estimating workflow.
 * It allows users to add, edit, delete, and track various project overhead items that
 * are essential for construction project planning and cost estimation.
 *
 * @version 1.0.0
 * @author HB Report Development Team
 * @since 2025-01-28
 *
 * @features
 * - Searchable table of GC & GR items with filtering capabilities
 * - Add/Edit dialog for creating and modifying items
 * - Category-based organization (General Conditions vs General Requirements)
 * - Cost tracking with inclusion/exclusion toggles
 * - Export functionality for reporting
 * - Integration with EstimatingContext for centralized state management
 * - Guided tour integration for user onboarding
 *
 * @dependencies
 * - shadcn/ui components: Card, Table, Button, Input, Dialog, Badge, Select, Switch
 * - Lucide icons: Building, Plus, Edit, Trash2, Search, Download, DollarSign
 * - EstimatingContext: for accessing project data and GC & GR management actions
 * - useToast: for displaying notifications
 *
 * @maintenance
 * To extend this component:
 * 1. Add new fields to the GCAndGRItem interface in estimating-context.tsx
 * 2. Update the form fields in the add/edit dialog
 * 3. Modify the table columns to display new data
 * 4. Update validation logic in validateGCAndGRItem function
 * 5. Add corresponding tour steps if needed
 */

/**
 * Interface for the GC & GR form state
 */
interface GCAndGRForm {
  itemNumber: string
  description: string
  notes: string
  category: "General Conditions" | "General Requirements"
  estimatedCost: string
  isIncluded: boolean
}

/**
 * Initial form state for new GC & GR items
 */
const initialFormState: GCAndGRForm = {
  itemNumber: "",
  description: "",
  notes: "",
  category: "General Conditions",
  estimatedCost: "",
  isIncluded: true,
}

/**
 * Validates GC & GR item data
 * @param item - The GC & GR item to validate
 * @returns Validation result with isValid flag and error message
 */
const validateGCAndGRItem = (item: GCAndGRForm): { isValid: boolean; error?: string } => {
  if (!item.description.trim()) {
    return { isValid: false, error: "Description is required" }
  }

  if (!item.itemNumber.trim()) {
    return { isValid: false, error: "Item Number is required" }
  }

  if (item.estimatedCost && isNaN(Number(item.estimatedCost))) {
    return { isValid: false, error: "Estimated Cost must be a valid number" }
  }

  if (item.estimatedCost && Number(item.estimatedCost) < 0) {
    return { isValid: false, error: "Estimated Cost cannot be negative" }
  }

  return { isValid: true }
}

/**
 * Exports GC & GR data to CSV format
 * @param items - Array of GC & GR items to export
 * @returns CSV string
 */
const exportToCSV = (items: GCAndGRItem[]): string => {
  const headers = ["Item Number", "Description", "Category", "Estimated Cost", "Included", "Notes"]
  const csvContent = [
    headers.join(","),
    ...items.map((item) =>
      [
        `"${item.itemNumber}"`,
        `"${item.description}"`,
        `"${item.category}"`,
        item.estimatedCost || 0,
        item.isIncluded ? "Yes" : "No",
        `"${item.notes || ""}"`,
      ].join(","),
    ),
  ].join("\n")

  return csvContent
}

/**
 * Downloads CSV data as a file
 * @param csvContent - The CSV content to download
 * @param filename - The filename for the download
 */
const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

/**
 * GCAndGR Component
 *
 * Provides a comprehensive interface for managing General Conditions and General Requirements
 * items within the pre-construction estimating workflow.
 */
export default function GCAndGR() {
  const { projectEstimate, addGCAndGR, updateGCAndGR, deleteGCAndGR } = useEstimating()
  const { toast } = useToast()

  // Local state
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingGCAndGR, setIsAddingGCAndGR] = useState(false)
  const [isEditingGCAndGR, setIsEditingGCAndGR] = useState(false)
  const [editingItem, setEditingItem] = useState<GCAndGRItem | null>(null)
  const [gcAndGRForm, setGCAndGRForm] = useState<GCAndGRForm>(initialFormState)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  /**
   * Filtered GC & GR items based on search term and category filter
   */
  const filteredItems = useMemo(() => {
    return projectEstimate.gcAndGRItems.filter((item) => {
      const matchesSearch =
        item.itemNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [projectEstimate.gcAndGRItems, searchTerm, categoryFilter])

  /**
   * Calculate total estimated cost for included items
   */
  const totalEstimatedCost = useMemo(() => {
    return projectEstimate.gcAndGRItems
      .filter((item) => item.isIncluded && item.estimatedCost)
      .reduce((sum, item) => sum + (item.estimatedCost || 0), 0)
  }, [projectEstimate.gcAndGRItems])

  /**
   * Resets the form to initial state
   */
  const resetForm = useCallback(() => {
    setGCAndGRForm(initialFormState)
    setEditingItem(null)
  }, [])

  /**
   * Handles opening the add dialog
   */
  const handleAddClick = useCallback(() => {
    resetForm()
    setIsAddingGCAndGR(true)
  }, [resetForm])

  /**
   * Handles opening the edit dialog
   */
  const handleEditClick = useCallback((item: GCAndGRItem) => {
    setGCAndGRForm({
      itemNumber: item.itemNumber,
      description: item.description,
      notes: item.notes || "",
      category: item.category,
      estimatedCost: item.estimatedCost?.toString() || "",
      isIncluded: item.isIncluded,
    })
    setEditingItem(item)
    setIsEditingGCAndGR(true)
  }, [])

  /**
   * Handles form submission for both add and edit operations
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      const validation = validateGCAndGRItem(gcAndGRForm)
      if (!validation.isValid) {
        toast({
          title: "Validation Error",
          description: validation.error,
          variant: "destructive",
        })
        return
      }

      const itemData = {
        itemNumber: gcAndGRForm.itemNumber.trim(),
        description: gcAndGRForm.description.trim(),
        notes: gcAndGRForm.notes.trim(),
        category: gcAndGRForm.category,
        estimatedCost: gcAndGRForm.estimatedCost ? Number(gcAndGRForm.estimatedCost) : undefined,
        isIncluded: gcAndGRForm.isIncluded,
      }

      try {
        if (isEditingGCAndGR && editingItem) {
          updateGCAndGR(editingItem.id, itemData)
          toast({
            title: "Item Updated",
            description: "GC & GR item has been successfully updated.",
          })
        } else {
          addGCAndGR(itemData)
          toast({
            title: "Item Added",
            description: "New GC & GR item has been successfully added.",
          })
        }

        setIsAddingGCAndGR(false)
        setIsEditingGCAndGR(false)
        resetForm()
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error saving the GC & GR item. Please try again.",
          variant: "destructive",
        })
      }
    },
    [gcAndGRForm, isEditingGCAndGR, editingItem, updateGCAndGR, addGCAndGR, toast, resetForm],
  )

  /**
   * Handles deleting a GC & GR item
   */
  const handleDelete = useCallback(
    (item: GCAndGRItem) => {
      if (window.confirm(`Are you sure you want to delete "${item.description}"?`)) {
        try {
          deleteGCAndGR(item.id)
          toast({
            title: "Item Deleted",
            description: "GC & GR item has been successfully deleted.",
          })
        } catch (error) {
          toast({
            title: "Error",
            description: "There was an error deleting the GC & GR item. Please try again.",
            variant: "destructive",
          })
        }
      }
    },
    [deleteGCAndGR, toast],
  )

  /**
   * Handles exporting GC & GR data to CSV
   */
  const handleExport = useCallback(() => {
    try {
      const csvContent = exportToCSV(projectEstimate.gcAndGRItems)
      const filename = `gc-and-gr-items-${new Date().toISOString().split("T")[0]}.csv`
      downloadCSV(csvContent, filename)
      toast({
        title: "Export Successful",
        description: "GC & GR items have been exported to CSV.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive",
      })
    }
  }, [projectEstimate.gcAndGRItems, toast])

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl font-bold">General Conditions & General Requirements</CardTitle>
                <CardDescription>
                  Manage project overhead items, site conditions, and general requirements
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>${totalEstimatedCost.toLocaleString()}</span>
              </Badge>
              <Badge variant="secondary">{projectEstimate.gcAndGRItems.length} items</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search GC & GR items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="General Conditions">General Conditions</SelectItem>
                  <SelectItem value="General Requirements">General Requirements</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Dialog open={isAddingGCAndGR} onOpenChange={setIsAddingGCAndGR}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddClick} className="add-gc-and-gr-btn" data-tour="add-gc-and-gr-btn">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add GC & GR Item</DialogTitle>
                    <DialogDescription>
                      Add a new general condition or general requirement item to the project.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="itemNumber">Item Number</Label>
                        <Input
                          id="itemNumber"
                          value={gcAndGRForm.itemNumber}
                          onChange={(e) => setGCAndGRForm({ ...gcAndGRForm, itemNumber: e.target.value })}
                          placeholder="e.g., GC-001"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={gcAndGRForm.category}
                          onValueChange={(value: "General Conditions" | "General Requirements") =>
                            setGCAndGRForm({ ...gcAndGRForm, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Conditions">General Conditions</SelectItem>
                            <SelectItem value="General Requirements">General Requirements</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={gcAndGRForm.description}
                        onChange={(e) => setGCAndGRForm({ ...gcAndGRForm, description: e.target.value })}
                        placeholder="Enter item description"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimatedCost">Estimated Cost</Label>
                      <Input
                        id="estimatedCost"
                        type="number"
                        min="0"
                        step="0.01"
                        value={gcAndGRForm.estimatedCost}
                        onChange={(e) => setGCAndGRForm({ ...gcAndGRForm, estimatedCost: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={gcAndGRForm.notes}
                        onChange={(e) => setGCAndGRForm({ ...gcAndGRForm, notes: e.target.value })}
                        placeholder="Additional notes or details"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isIncluded"
                        checked={gcAndGRForm.isIncluded}
                        onCheckedChange={(checked) => setGCAndGRForm({ ...gcAndGRForm, isIncluded: checked })}
                      />
                      <Label htmlFor="isIncluded">Include in estimate</Label>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddingGCAndGR(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Item</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="gc-and-gr-table" data-tour="gc-and-gr-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Number</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Estimated Cost</TableHead>
                  <TableHead>Included</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {searchTerm || categoryFilter !== "all"
                        ? "No items match your search criteria"
                        : "No GC & GR items found. Click 'Add Item' to get started."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.itemNumber}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Badge variant={item.category === "General Conditions" ? "default" : "secondary"}>
                          {item.category === "General Conditions" ? "GC" : "GR"}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.estimatedCost ? `$${item.estimatedCost.toLocaleString()}` : "—"}</TableCell>
                      <TableCell>
                        <Badge variant={item.isIncluded ? "default" : "outline"}>
                          {item.isIncluded ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={item.notes}>
                        {item.notes || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditClick(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
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
      <Dialog open={isEditingGCAndGR} onOpenChange={setIsEditingGCAndGR}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit GC & GR Item</DialogTitle>
            <DialogDescription>Update the general condition or general requirement item details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-itemNumber">Item Number</Label>
                <Input
                  id="edit-itemNumber"
                  value={gcAndGRForm.itemNumber}
                  onChange={(e) => setGCAndGRForm({ ...gcAndGRForm, itemNumber: e.target.value })}
                  placeholder="e.g., GC-001"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={gcAndGRForm.category}
                  onValueChange={(value: "General Conditions" | "General Requirements") =>
                    setGCAndGRForm({ ...gcAndGRForm, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Conditions">General Conditions</SelectItem>
                    <SelectItem value="General Requirements">General Requirements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={gcAndGRForm.description}
                onChange={(e) => setGCAndGRForm({ ...gcAndGRForm, description: e.target.value })}
                placeholder="Enter item description"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-estimatedCost">Estimated Cost</Label>
              <Input
                id="edit-estimatedCost"
                type="number"
                min="0"
                step="0.01"
                value={gcAndGRForm.estimatedCost}
                onChange={(e) => setGCAndGRForm({ ...gcAndGRForm, estimatedCost: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={gcAndGRForm.notes}
                onChange={(e) => setGCAndGRForm({ ...gcAndGRForm, notes: e.target.value })}
                placeholder="Additional notes or details"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isIncluded"
                checked={gcAndGRForm.isIncluded}
                onCheckedChange={(checked) => setGCAndGRForm({ ...gcAndGRForm, isIncluded: checked })}
              />
              <Label htmlFor="edit-isIncluded">Include in estimate</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditingGCAndGR(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Item</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
