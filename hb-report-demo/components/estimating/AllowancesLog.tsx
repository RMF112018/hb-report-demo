"use client"

import { useState, useCallback, useMemo, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { useEstimating } from "./EstimatingProvider"
import { 
  DollarSign, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Download, 
  Calculator,
  Upload,
  Eye,
  Filter,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  TrendingUp
} from "lucide-react"
import type { Allowance } from "@/types/estimating-tracker"

/**
 * @fileoverview Allowances Component for Managing Project Allowances
 * 
 * Comprehensive interface for managing project allowances with:
 * - Search and filtering capabilities
 * - CRUD operations with validation
 * - CSV/Excel import functionality
 * - Export capabilities
 * - Statistics dashboard
 * - Professional UI with toast notifications
 */

interface AllowanceFormState {
  number: string
  csiDivision: string
  description: string
  value: string
  notes: string
  status: Allowance['status']
  category: Allowance['category']
}

interface AllowanceFilters {
  search: string
  csiDivision: string
  status: string
  category: string
  valueMin: string
  valueMax: string
}

const initialFormState: AllowanceFormState = {
  number: "",
  csiDivision: "",
  description: "",
  value: "",
  notes: "",
  status: "active",
  category: "other"
}

const initialFilters: AllowanceFilters = {
  search: "",
  csiDivision: "",
  status: "",
  category: "",
  valueMin: "",
  valueMax: ""
}

const statusOptions = [
  { value: "active", label: "Active", variant: "default" as const },
  { value: "inactive", label: "Inactive", variant: "secondary" as const },
  { value: "pending", label: "Pending", variant: "outline" as const }
]

const categoryOptions = [
  { value: "structural", label: "Structural" },
  { value: "architectural", label: "Architectural" },
  { value: "mechanical", label: "Mechanical" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "sitework", label: "Sitework" },
  { value: "finishes", label: "Finishes" },
  { value: "specialties", label: "Specialties" },
  { value: "other", label: "Other" }
]

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const validateCSIDivision = (division: string): boolean => {
  const cleaned = division.replace(/\s/g, "")
  return /^\d{6}$/.test(cleaned) || /^\d{2}\s\d{2}\s\d{2}$/.test(division)
}

export default function AllowancesLog() {
  const { 
    allowances, 
    addAllowance, 
    updateAllowance, 
    deleteAllowance,
    getAllowancesSummary,
    importAllowancesFromFile,
    exportAllowancesToCSV,
    generateAllowanceTemplate
  } = useEstimating()
  
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Local state
  const [filters, setFilters] = useState<AllowanceFilters>(initialFilters)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [selectedAllowance, setSelectedAllowance] = useState<Allowance | null>(null)
  const [allowanceForm, setAllowanceForm] = useState<AllowanceFormState>(initialFormState)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)

  // Filter allowances
  const filteredAllowances = useMemo(() => {
    return allowances.filter(allowance => {
      const searchMatch = !filters.search || 
        allowance.csiDivision.toLowerCase().includes(filters.search.toLowerCase()) ||
        allowance.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        allowance.notes?.toLowerCase().includes(filters.search.toLowerCase())

      const csiMatch = !filters.csiDivision || allowance.csiDivision.includes(filters.csiDivision)
      const statusMatch = !filters.status || allowance.status === filters.status
      const categoryMatch = !filters.category || allowance.category === filters.category
      
      const valueMinMatch = !filters.valueMin || allowance.value >= parseFloat(filters.valueMin)
      const valueMaxMatch = !filters.valueMax || allowance.value <= parseFloat(filters.valueMax)

      return searchMatch && csiMatch && statusMatch && categoryMatch && valueMinMatch && valueMaxMatch
    })
  }, [allowances, filters])

  // Get statistics
  const summary = useMemo(() => {
    return getAllowancesSummary('palm-beach-luxury-estate')
  }, [allowances, getAllowancesSummary])

  // Form handlers
  const handleFormChange = useCallback((field: keyof AllowanceFormState, value: string) => {
    setAllowanceForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleFilterChange = useCallback((field: keyof AllowanceFilters, value: string) => {
    // Convert "all" values to empty strings to maintain compatibility with filtering logic
    const filterValue = value === "all" ? "" : value
    setFilters(prev => ({ ...prev, [field]: filterValue }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  const validateForm = useCallback((): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!allowanceForm.number.trim()) {
      errors.push("Number is required")
    }

    if (!allowanceForm.csiDivision.trim()) {
      errors.push("CSI Division is required")
    } else if (!validateCSIDivision(allowanceForm.csiDivision)) {
      errors.push("CSI Division must be in format XXXXXX or XX XX XX")
    }

    if (!allowanceForm.description.trim()) {
      errors.push("Description is required")
    }

    if (!allowanceForm.value.trim()) {
      errors.push("Value is required")
    } else if (isNaN(parseFloat(allowanceForm.value)) || parseFloat(allowanceForm.value) < 0) {
      errors.push("Value must be a non-negative number")
    }

    return { isValid: errors.length === 0, errors }
  }, [allowanceForm])

  // CRUD operations
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
        projectId: 'palm-beach-luxury-estate',
        number: parseInt(allowanceForm.number),
        csiDivision: allowanceForm.csiDivision.trim(),
        description: allowanceForm.description.trim(),
        value: parseFloat(allowanceForm.value),
        notes: allowanceForm.notes.trim() || undefined,
        status: allowanceForm.status,
        category: allowanceForm.category
      })

      setAllowanceForm(initialFormState)
      setIsAddDialogOpen(false)

      toast({
        title: "Allowance Added",
        description: "The allowance has been successfully added.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add allowance. Please try again.",
        variant: "destructive",
      })
    }
  }, [allowanceForm, addAllowance, validateForm, toast])

  const handleUpdateAllowance = useCallback(async () => {
    if (!selectedAllowance) return

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
      updateAllowance(selectedAllowance.id, {
        number: parseInt(allowanceForm.number),
        csiDivision: allowanceForm.csiDivision.trim(),
        description: allowanceForm.description.trim(),
        value: parseFloat(allowanceForm.value),
        notes: allowanceForm.notes.trim() || undefined,
        status: allowanceForm.status,
        category: allowanceForm.category
      })

      setAllowanceForm(initialFormState)
      setIsEditDialogOpen(false)
      setSelectedAllowance(null)

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
  }, [selectedAllowance, allowanceForm, updateAllowance, validateForm, toast])

  const handleDeleteAllowance = useCallback((allowance: Allowance) => {
    if (window.confirm(`Are you sure you want to delete allowance #${allowance.number}?`)) {
      try {
        deleteAllowance(allowance.id)
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
    }
  }, [deleteAllowance, toast])

  // Dialog handlers
  const openAddDialog = useCallback(() => {
    setAllowanceForm(initialFormState)
    setIsAddDialogOpen(true)
  }, [])

  const openEditDialog = useCallback((allowance: Allowance) => {
    setAllowanceForm({
      number: allowance.number.toString(),
      csiDivision: allowance.csiDivision,
      description: allowance.description,
      value: allowance.value.toString(),
      notes: allowance.notes || "",
      status: allowance.status,
      category: allowance.category || "other"
    })
    setSelectedAllowance(allowance)
    setIsEditDialogOpen(true)
  }, [])

  const openViewDialog = useCallback((allowance: Allowance) => {
    setSelectedAllowance(allowance)
    setIsViewDialogOpen(true)
  }, [])

  // Import/Export handlers
  const handleFileImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.match(/\.(csv|xlsx|xls)$/)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a CSV or Excel file.",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    try {
      const result = await importAllowancesFromFile(file)
      setImportResult(result)
      
      if (result.success) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${result.successfulImports} allowances.`,
        })
      } else {
        toast({
          title: "Import Failed",
          description: "Failed to import allowances. Please check the file format.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Import Error",
        description: "An error occurred during import. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [importAllowancesFromFile, toast])

  const handleExport = useCallback(() => {
    try {
      exportAllowancesToCSV({
        selectedOnly: false,
        includeInactive: true,
        includeNotes: true
      })
      toast({
        title: "Export Successful",
        description: "Allowances exported to CSV successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export allowances. Please try again.",
        variant: "destructive",
      })
    }
  }, [exportAllowancesToCSV, toast])

  const handleGenerateTemplate = useCallback(() => {
    try {
      generateAllowanceTemplate()
      toast({
        title: "Template Generated",
        description: "Allowances template downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Template Error",
        description: "Failed to generate template. Please try again.",
        variant: "destructive",
      })
    }
  }, [generateAllowanceTemplate, toast])

  return (
    <div className="space-y-6">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Allowances</p>
                <p className="text-2xl font-bold">{summary.totalAllowances}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Allowances</p>
                <p className="text-2xl font-bold">{summary.activeAllowances}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Value</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.averageValue)}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-green-600" />
              <CardTitle>Project Allowances</CardTitle>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileImport}
                accept=".csv,.xlsx,.xls"
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isImporting ? "Importing..." : "Import"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleGenerateTemplate}>
                <FileText className="h-4 w-4 mr-2" />
                Template
              </Button>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Allowance
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search allowances..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="csi-filter">CSI Division</Label>
              <Input
                id="csi-filter"
                placeholder="e.g., 05 10 00"
                value={filters.csiDivision}
                onChange={(e) => handleFilterChange("csiDivision", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select value={filters.category || "all"} onValueChange={(value) => handleFilterChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value-min">Min Value</Label>
              <Input
                id="value-min"
                type="number"
                placeholder="Min"
                value={filters.valueMin}
                onChange={(e) => handleFilterChange("valueMin", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="value-max">Max Value</Label>
              <Input
                id="value-max"
                type="number"
                placeholder="Max"
                value={filters.valueMax}
                onChange={(e) => handleFilterChange("valueMax", e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allowances Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead className="w-32">CSI Division</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-32 text-right">Value</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-24">Category</TableHead>
                  <TableHead className="w-32 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAllowances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {filters.search || filters.csiDivision || filters.status || filters.category 
                        ? "No allowances match your search criteria." 
                        : "No allowances added yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAllowances.map((allowance) => (
                    <TableRow key={allowance.id}>
                      <TableCell className="font-medium">{allowance.number}</TableCell>
                      <TableCell className="font-mono text-sm">{allowance.csiDivision}</TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <div className="font-medium truncate">{allowance.description}</div>
                          {allowance.notes && (
                            <div className="text-sm text-gray-500 truncate mt-1">{allowance.notes}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(allowance.value)}</TableCell>
                      <TableCell>
                        <Badge variant={statusOptions.find(s => s.value === allowance.status)?.variant || "default"}>
                          {statusOptions.find(s => s.value === allowance.status)?.label || allowance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {categoryOptions.find(c => c.value === allowance.category)?.label || allowance.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewDialog(allowance)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(allowance)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAllowance(allowance)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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

      {/* Add Allowance Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Allowance</DialogTitle>
            <DialogDescription>
              Add a new allowance item to the project estimate.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="add-number">Number</Label>
              <Input
                id="add-number"
                type="number"
                placeholder="e.g., 1"
                value={allowanceForm.number}
                onChange={(e) => handleFormChange("number", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="add-csi">CSI Division</Label>
              <Input
                id="add-csi"
                placeholder="e.g., 03 30 00"
                value={allowanceForm.csiDivision}
                onChange={(e) => handleFormChange("csiDivision", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                placeholder="Detailed description of the allowance..."
                value={allowanceForm.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="add-value">Value ($)</Label>
              <Input
                id="add-value"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 25000"
                value={allowanceForm.value}
                onChange={(e) => handleFormChange("value", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="add-status">Status</Label>
              <Select value={allowanceForm.status} onValueChange={(value) => handleFormChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="add-category">Category</Label>
              <Select value={allowanceForm.category} onValueChange={(value) => handleFormChange("category", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="add-notes">Notes (Optional)</Label>
              <Textarea
                id="add-notes"
                placeholder="Additional notes..."
                value={allowanceForm.notes}
                onChange={(e) => handleFormChange("notes", e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAllowance}>
              Add Allowance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Allowance Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Allowance</DialogTitle>
            <DialogDescription>
              Update the allowance item details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-number">Number</Label>
              <Input
                id="edit-number"
                type="number"
                value={allowanceForm.number}
                onChange={(e) => handleFormChange("number", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-csi">CSI Division</Label>
              <Input
                id="edit-csi"
                value={allowanceForm.csiDivision}
                onChange={(e) => handleFormChange("csiDivision", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={allowanceForm.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-value">Value ($)</Label>
              <Input
                id="edit-value"
                type="number"
                min="0"
                step="0.01"
                value={allowanceForm.value}
                onChange={(e) => handleFormChange("value", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={allowanceForm.status} onValueChange={(value) => handleFormChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select value={allowanceForm.category} onValueChange={(value) => handleFormChange("category", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="edit-notes">Notes (Optional)</Label>
              <Textarea
                id="edit-notes"
                value={allowanceForm.notes}
                onChange={(e) => handleFormChange("notes", e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAllowance}>
              Update Allowance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Allowance Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Allowance Details</DialogTitle>
            <DialogDescription>
              View detailed information about this allowance.
            </DialogDescription>
          </DialogHeader>
          {selectedAllowance && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Number</Label>
                  <p className="font-medium">{selectedAllowance.number}</p>
                </div>
                <div>
                  <Label>CSI Division</Label>
                  <p className="font-mono">{selectedAllowance.csiDivision}</p>
                </div>
                <div>
                  <Label>Value</Label>
                  <p className="font-medium text-green-600">{formatCurrency(selectedAllowance.value)}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={statusOptions.find(s => s.value === selectedAllowance.status)?.variant || "default"}>
                    {statusOptions.find(s => s.value === selectedAllowance.status)?.label || selectedAllowance.status}
                  </Badge>
                </div>
                <div>
                  <Label>Category</Label>
                  <Badge variant="outline">
                    {categoryOptions.find(c => c.value === selectedAllowance.category)?.label || selectedAllowance.category}
                  </Badge>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedAllowance.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <p className="mt-1 text-sm">{selectedAllowance.description}</p>
              </div>
              {selectedAllowance.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="mt-1 text-sm text-gray-600">{selectedAllowance.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 