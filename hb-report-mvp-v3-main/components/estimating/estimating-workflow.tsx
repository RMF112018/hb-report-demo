"use client"

import type React from "react"
import { useState, useMemo, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Ruler,
  Save,
  Download,
  Plus,
  Search,
  Calculator,
  FileText,
  HelpCircle,
  RefreshCw,
  Building,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/hooks/use-toast"
import { EnhancedBidTab, type BidLineItem } from "./enhanced-bid-tab"
import { BidLeveling } from "./bid-leveling"
import {
  useEstimating,
  type AreaCalculation,
  type Clarification,
  type RFI as RFIType,
  type Document,
  type CSVImportResult,
} from "./estimating-context"

/**
 * @fileoverview Enhanced EstimatingWorkflow Component with Integrated Bid Management
 *
 * This file contains the complete estimating workflow system for construction projects,
 * featuring a comprehensive 7-step process with integrated bid tabulation and leveling
 * components for complete bid management. It now consumes state from a centralized
 * `EstimatingContext`.
 *
 * @version 4.1.0
 * @author HB Report MVP Team
 * @since 2025-06-17
 *
 * @overview
 * The EstimatingWorkflow component provides a comprehensive solution for construction project
 * estimation, integrating with BuildingConnected API and featuring:
 *
 * - Step 1: Quantity Takeoff (area calculations)
 * - Step 2: Clarifications & Assumptions (project clarifications)
 * - Step 3: RFIs (requests for information)
 * - Step 4: Document Log (drawings and specifications management)
 * - Step 5: Bid Tabulation (Enhanced Bid Tab with CSI divisions)
 * - Step 6: Bid Leveling (vendor bid comparison and selection)
 * - Step 7: Cost Summary (final cost compilation and approval)
 *
 * @new_features
 * - Centralized state management via `EstimatingContext` and `EstimatingProvider`.
 * - Improved modularity and maintainability.
 *
 * @architecture
 * The component now consumes state and actions from `EstimatingContext` via the `useEstimating` hook.
 * This separates state logic from UI rendering, making the component cleaner and more testable.
 *
 * @performance
 * - Leverages `useCallback` and `useMemo` within the context provider for efficient state updates.
 * - Debounced search inputs to prevent excessive re-renders.
 *
 * @maintenance
 * - All core estimating state and logic are now managed in `components/estimating/estimating-context.tsx`.
 * - Refer to `components/estimating/estimating-context.tsx` for adding new state properties or actions.
 */

/**
 * RFP Selection Component
 *
 * @description Handles project/RFP selection with BuildingConnected integration
 */
const RFPSelection: React.FC = () => {
  const { selectedRFP, availableRFPs, setSelectedRFP, syncWithBuildingConnected, isLoading } = useEstimating()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "submitted":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "awarded":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "lost":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "submitted":
        return "bg-green-100 text-green-800"
      case "awarded":
        return "bg-green-100 text-green-800"
      case "lost":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Project Selection
          </CardTitle>
          <Button onClick={syncWithBuildingConnected} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Sync BuildingConnected
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            value={selectedRFP?.id || ""}
            onValueChange={(value) => {
              const rfp = availableRFPs.find((r) => r.id === value)
              setSelectedRFP(rfp || null)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an RFP to estimate..." />
            </SelectTrigger>
            <SelectContent>
              {availableRFPs.map((rfp) => (
                <SelectItem key={rfp.id} value={rfp.id}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(rfp.status)}
                    <span>{rfp.projectName}</span>
                    <Badge className={getStatusColor(rfp.status)} variant="secondary">
                      {rfp.status.toUpperCase()}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedRFP && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Client:</span>
                  <p className="text-gray-900">{selectedRFP.client}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <p className="text-gray-900 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedRFP.location}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Due Date:</span>
                  <p className="text-gray-900 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {selectedRFP.dueDate.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Est. Value:</span>
                  <p className="text-gray-900 font-semibold">${selectedRFP.estimatedValue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Enhanced Quantity Takeoff Component
 *
 * @description Displays and manages area calculations based on 01_AreaCalculations.pdf
 * for the Atlantic Fields Club project in Hobe Sound. Provides comprehensive
 * area calculation management with search, filtering, and validation.
 *
 * @features
 * - Interactive table with editable square footage inputs
 * - Real-time search and filtering by building/level
 * - Summary metrics with live calculations
 * - Form validation with error handling
 * - Responsive design for mobile and desktop
 * - Integration with EstimatingContext for state persistence
 *
 * @component
 * @example
 * \`\`\`tsx
 * <QuantityTakeoff />
 * \`\`\`
 */
const QuantityTakeoff: React.FC = () => {
  const { toast } = useToast()
  const { projectEstimate, updateAreaCalculations, updateProjectMetrics, selectedRFP } = useEstimating()
  const [searchTerm, setSearchTerm] = useState("")

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const filteredCalculations = useMemo(() => {
    if (!debouncedSearchTerm) return projectEstimate.areaCalculations

    const searchLower = debouncedSearchTerm.toLowerCase()
    return projectEstimate.areaCalculations.filter(
      (calc) =>
        calc.building.toLowerCase().includes(searchLower) ||
        calc.level.toLowerCase().includes(searchLower) ||
        calc.areaType.toLowerCase().includes(searchLower),
    )
  }, [projectEstimate.areaCalculations, debouncedSearchTerm])

  /**
   * Validates square footage input
   *
   * @param value - The square footage value to validate
   * @returns {boolean} True if valid, false otherwise
   */
  const validateSquareFootage = (value: number): boolean => {
    return !isNaN(value) && value >= 0 && value <= 1000000 // Max 1M sq ft
  }

  /**
   * Handles updating square footage for a specific calculation with validation
   */
  const handleSquareFootageChange = useCallback(
    (id: string, value: number) => {
      if (!validateSquareFootage(value)) {
        toast({
          title: "Invalid Input",
          description: "Square footage must be a non-negative number less than 1,000,000.",
          variant: "destructive",
        })
        return
      }

      const updatedCalculations = projectEstimate.areaCalculations.map((calc) =>
        calc.id === id ? { ...calc, squareFootage: value } : calc,
      )
      updateAreaCalculations(updatedCalculations)
    },
    [projectEstimate.areaCalculations, updateAreaCalculations, toast],
  )

  const handleAddRow = useCallback(() => {
    const newCalculation: AreaCalculation = {
      id: `calc-${Date.now()}`,
      building: "",
      level: "",
      areaType: "AC SF",
      squareFootage: 0,
      notes: "",
    }

    const updatedCalculations = [...projectEstimate.areaCalculations, newCalculation]
    updateAreaCalculations(updatedCalculations)
  }, [projectEstimate.areaCalculations, updateAreaCalculations])

  const handleMetricChange = useCallback(
    (
      field: keyof Pick<typeof projectEstimate, "totalGrossSF" | "totalACSF" | "siteAcres" | "parkingSpaces">,
      value: number,
    ) => {
      if (value < 0) return
      updateProjectMetrics({ [field]: value })
    },
    [updateProjectMetrics],
  )

  /**
   * Handles saving the takeoff data with user feedback
   */
  const handleSaveTakeoff = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Takeoff Saved",
        description: "Area calculations have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save area calculations. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  /**
   * Handles CSV export with user feedback
   */
  const handleExportCSV = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Export Complete",
        description: "Area calculations exported to CSV successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  if (!selectedRFP) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Please select an RFP to begin quantity takeoff</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by building, level, or area type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSaveTakeoff} className="bg-[#003087] hover:bg-[#002066]">
            <Save className="h-4 w-4 mr-2" />
            Save Takeoff
          </Button>
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAddRow} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Area Calculations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Building</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Area Type</TableHead>
                  <TableHead className="text-right">Square Footage</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalculations.map((calc) => (
                  <TableRow key={calc.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{calc.building}</TableCell>
                    <TableCell>{calc.level}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          calc.areaType === "AC SF" ? "default" : calc.areaType === "Gross SF" ? "secondary" : "outline"
                        }
                      >
                        {calc.areaType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={calc.squareFootage}
                        onChange={(e) => handleSquareFootageChange(calc.id, Number(e.target.value))}
                        className="w-24 text-right"
                        min="0"
                      />
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{calc.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Project Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Total Gross SF</label>
              <Input
                type="number"
                value={projectEstimate.totalGrossSF}
                onChange={(e) => handleMetricChange("totalGrossSF", Number(e.target.value))}
                className="text-lg font-semibold"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Total AC SF</label>
              <Input
                type="number"
                value={projectEstimate.totalACSF}
                onChange={(e) => handleMetricChange("totalACSF", Number(e.target.value))}
                className="text-lg font-semibold"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Site Acres</label>
              <Input
                type="number"
                step="0.1"
                value={projectEstimate.siteAcres}
                onChange={(e) => handleMetricChange("siteAcres", Number(e.target.value))}
                className="text-lg font-semibold"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Parking Spaces</label>
              <Input
                type="number"
                value={projectEstimate.parkingSpaces}
                onChange={(e) => handleMetricChange("parkingSpaces", Number(e.target.value))}
                className="text-lg font-semibold"
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Clarifications & Assumptions Component
 *
 * @description Manages clarifications and assumptions based on 02_Clarifications&Assumptions.pdf
 * for the Atlantic Fields Club project. Provides comprehensive clarification management
 * with search, filtering, validation, and CRUD operations.
 *
 * @features
 * - Interactive table with CSI Division, Description, Type, and Actions columns
 * - Add/Edit clarifications via shadcn/ui Dialog forms
 * - Search functionality filtering by description (case-insensitive)
 * - Form validation with error handling via shadcn/ui Toast
 * - Export functionality (mock implementation)
 * - Row count badge display
 * - Responsive design for mobile and desktop
 *
 * @component
 * @example
 * \`\`\`tsx
 * <ClarificationsAssumptions />
 * \`\`\`
 *
 * @maintenance
 * To add new clarification types:
 * 1. Update the Clarification interface type property
 * 2. Add new type to the Select options in the dialog form
 * 3. Update the getClarificationTypeBadge function for styling
 * 4. Update validation if needed
 */
const ClarificationsAssumptions: React.FC = () => {
  const { toast } = useToast()
  const { projectEstimate, addClarification, updateClarification, deleteClarification } = useEstimating()

  // Component state
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingClarification, setIsAddingClarification] = useState(false)
  const [isEditingClarification, setIsEditingClarification] = useState<string | null>(null)

  // Form state
  const [clarificationForm, setClarificationForm] = useState<Omit<Clarification, "id" | "createdAt" | "updatedAt">>({
    csiDivision: "",
    description: "",
    type: "Assumption",
    notes: "",
  })

  // Debounced search for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  /**
   * Validates CSI Division format
   *
   * @param division - The CSI division string to validate
   * @returns {boolean} True if valid format, false otherwise
   */
  const validateCSIDivision = (division: string): boolean => {
    // Accepts formats like "01 00 00", "033000", "1", etc.
    return /^[\d\s]+$/.test(division) && division.trim().length > 0
  }

  /**
   * Filtered clarifications based on search term
   * Uses useMemo for performance optimization
   */
  const filteredClarifications = useMemo(() => {
    if (!debouncedSearchTerm) return projectEstimate.clarifications

    const searchLower = debouncedSearchTerm.toLowerCase()
    return projectEstimate.clarifications.filter(
      (item) =>
        item.csiDivision.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.type.toLowerCase().includes(searchLower),
    )
  }, [projectEstimate.clarifications, debouncedSearchTerm])

  /**
   * Handles form submission for adding/editing clarifications
   * Includes validation and error handling
   */
  const handleClarificationSubmit = useCallback(() => {
    // Validation
    if (!clarificationForm.csiDivision.trim()) {
      toast({
        title: "Validation Error",
        description: "CSI Division is required.",
        variant: "destructive",
      })
      return
    }

    if (!clarificationForm.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required.",
        variant: "destructive",
      })
      return
    }

    if (!validateCSIDivision(clarificationForm.csiDivision)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid CSI Division format.",
        variant: "destructive",
      })
      return
    }

    try {
      if (isEditingClarification) {
        updateClarification(isEditingClarification, clarificationForm)
        toast({
          title: "Clarification Updated",
          description: "The clarification has been updated successfully.",
        })
        setIsEditingClarification(null)
      } else {
        addClarification(clarificationForm)
        toast({
          title: "Clarification Added",
          description: "The clarification has been added successfully.",
        })
      }

      // Reset form
      setClarificationForm({
        csiDivision: "",
        description: "",
        type: "Assumption",
        notes: "",
      })
      setIsAddingClarification(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save clarification. Please try again.",
        variant: "destructive",
      })
    }
  }, [clarificationForm, isEditingClarification, addClarification, updateClarification, toast])

  /**
   * Handles editing a clarification
   * Populates form with existing data
   */
  const handleEditClarification = useCallback((clarification: Clarification) => {
    setClarificationForm({
      csiDivision: clarification.csiDivision,
      description: clarification.description,
      type: clarification.type,
      notes: clarification.notes || "",
    })
    setIsEditingClarification(clarification.id)
  }, [])

  /**
   * Handles deleting a clarification with confirmation
   */
  const handleDeleteClarification = useCallback(
    (id: string) => {
      try {
        deleteClarification(id)
        toast({
          title: "Clarification Deleted",
          description: "The clarification has been deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete clarification. Please try again.",
          variant: "destructive",
        })
      }
    },
    [deleteClarification, toast],
  )

  /**
   * Handles CSV export with mock implementation
   */
  const handleExportCSV = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Export Complete",
        description: "Clarifications exported to CSV successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  /**
   * Returns appropriate badge styling for clarification types
   */
  const getClarificationTypeBadge = useCallback((type: string) => {
    switch (type) {
      case "Assumption":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Assumption
          </Badge>
        )
      case "Exclusion":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Exclusion
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header with search and actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search clarifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Dialog
            open={isAddingClarification || isEditingClarification !== null}
            onOpenChange={(open) => {
              if (!open) {
                setIsAddingClarification(false)
                setIsEditingClarification(null)
                setClarificationForm({
                  csiDivision: "",
                  description: "",
                  type: "Assumption",
                  notes: "",
                })
              }
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddingClarification(true)} className="bg-[#003087] hover:bg-[#002066]">
                <Plus className="h-4 w-4 mr-2" />
                Add Clarification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{isEditingClarification ? "Edit Clarification" : "Add New Clarification"}</DialogTitle>
                <DialogDescription>
                  {isEditingClarification
                    ? "Update the clarification details below."
                    : "Add a new clarification or assumption to your estimate."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="csiDivision" className="text-right">
                    CSI Division
                  </Label>
                  <Input
                    id="csiDivision"
                    value={clarificationForm.csiDivision}
                    onChange={(e) => setClarificationForm((prev) => ({ ...prev, csiDivision: e.target.value }))}
                    placeholder="e.g., 01 00 00"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={clarificationForm.description}
                    onChange={(e) => setClarificationForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g., Permits by Owner"
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={clarificationForm.type}
                    onValueChange={(value) =>
                      setClarificationForm((prev) => ({
                        ...prev,
                        type: value as "Assumption" | "Exclusion",
                      }))
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assumption">Assumption</SelectItem>
                      <SelectItem value="Exclusion">Exclusion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="notes" className="text-right pt-2">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={clarificationForm.notes}
                    onChange={(e) => setClarificationForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional details..."
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" onClick={handleClarificationSubmit}>
                  {isEditingClarification ? "Update" : "Add"} Clarification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Clarifications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Clarifications & Assumptions
            <Badge variant="secondary" className="ml-2">
              {projectEstimate.clarifications.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CSI Division</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClarifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      No clarifications found. Add your first clarification to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClarifications.map((clarification) => (
                    <TableRow key={clarification.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{clarification.csiDivision}</TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate" title={clarification.description}>
                          {clarification.description}
                        </div>
                      </TableCell>
                      <TableCell>{getClarificationTypeBadge(clarification.type)}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate" title={clarification.notes || ""}>
                          {clarification.notes || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClarification(clarification)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClarification(clarification.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
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
    </div>
  )
}

/**
 * RFI (Requests for Information) Component
 *
 * @description Manages RFIs based on 03_RequestsForInformation.pdf
 * for the Atlantic Fields Club project. Provides comprehensive RFI management
 * with search, filtering, validation, and CRUD operations.
 *
 * @features
 * - Interactive table with RFI Number, Question, Status, Date Submitted, Response, and Actions columns
 * - Add/Edit RFIs via shadcn/ui Dialog forms
 * - Search functionality filtering by question or RFI number (case-insensitive)
 * - Form validation with error handling via shadcn/ui Toast
 * - Unique RFI number validation
 * - Export functionality (mock implementation)
 * - Row count badge display
 * - Status badges with appropriate styling
 * - Responsive design for mobile and desktop
 *
 * @component
 * @example
 * \`\`\`tsx
 * <RFI />
 * \`\`\`
 *
 * @maintenance
 * To add new RFI statuses:
 * 1. Update the RFI interface status property
 * 2. Add new status to the Select options in the dialog form
 * 3. Update the getRFIStatusBadge function for styling
 * 4. Update validation if needed
 *
 * To extend RFI functionality:
 * 1. Add new fields to the RFI interface
 * 2. Update the form state and dialog
 * 3. Add corresponding table columns
 * 4. Update validation and submission logic
 */
const RFIComponent: React.FC = () => {
  const { toast } = useToast()
  const { projectEstimate, addRFI, updateRFI, deleteRFI } = useEstimating()

  // Component state
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingRFI, setIsAddingRFI] = useState(false)
  const [isEditingRFI, setIsEditingRFI] = useState<string | null>(null)

  // Form state
  const [rfiForm, setRfiForm] = useState<Omit<RFIType, "id">>({
    number: "",
    question: "",
    status: "Pending",
    dateSubmitted: new Date().toISOString().split("T")[0],
    response: "",
    assignedTo: "",
    priority: "Medium",
  })

  // Debounced search for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  /**
   * Validates RFI number uniqueness
   *
   * @param number - The RFI number to validate
   * @param existingRFIs - Array of existing RFIs to check against
   * @param excludeId - ID to exclude from uniqueness check (for updates)
   * @returns {boolean} True if unique, false otherwise
   */
  const validateRFINumber = (number: string, existingRFIs: RFIType[], excludeId?: string): boolean => {
    return !existingRFIs.some((rfi) => rfi.number === number && rfi.id !== excludeId)
  }

  /**
   * Filtered RFIs based on search term
   * Uses useMemo for performance optimization
   */
  const filteredRFIs = useMemo(() => {
    if (!debouncedSearchTerm) return projectEstimate.rfis

    const searchLower = debouncedSearchTerm.toLowerCase()
    return projectEstimate.rfis.filter(
      (item) =>
        item.number.toLowerCase().includes(searchLower) ||
        item.question.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower) ||
        (item.response && item.response.toLowerCase().includes(searchLower)),
    )
  }, [projectEstimate.rfis, debouncedSearchTerm])

  /**
   * Handles form submission for adding/editing RFIs
   * Includes validation and error handling
   */
  const handleRFISubmit = useCallback(() => {
    // Validation
    if (!rfiForm.number.trim()) {
      toast({
        title: "Validation Error",
        description: "RFI Number is required.",
        variant: "destructive",
      })
      return
    }

    if (!rfiForm.question.trim()) {
      toast({
        title: "Validation Error",
        description: "Question is required.",
        variant: "destructive",
      })
      return
    }

    // Check for unique RFI number
    if (!validateRFINumber(rfiForm.number, projectEstimate.rfis, isEditingRFI || undefined)) {
      toast({
        title: "Validation Error",
        description: "RFI Number must be unique.",
        variant: "destructive",
      })
      return
    }

    try {
      if (isEditingRFI) {
        updateRFI(isEditingRFI, rfiForm)
        toast({
          title: "RFI Updated",
          description: "The RFI has been updated successfully.",
        })
        setIsEditingRFI(null)
      } else {
        addRFI(rfiForm)
        toast({
          title: "RFI Added",
          description: "The RFI has been added successfully.",
        })
      }

      // Reset form
      setRfiForm({
        number: "",
        question: "",
        status: "Pending",
        dateSubmitted: new Date().toISOString().split("T")[0],
        response: "",
        assignedTo: "",
        priority: "Medium",
      })
      setIsAddingRFI(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save RFI. Please try again.",
        variant: "destructive",
      })
    }
  }, [rfiForm, isEditingRFI, addRFI, updateRFI, projectEstimate.rfis, toast])

  /**
   * Handles editing an RFI
   * Populates form with existing data
   */
  const handleEditRFI = useCallback((rfi: RFIType) => {
    setRfiForm({
      number: rfi.number,
      question: rfi.question,
      status: rfi.status,
      dateSubmitted: rfi.dateSubmitted,
      response: rfi.response,
      dateAnswered: rfi.dateAnswered,
      assignedTo: rfi.assignedTo,
      priority: rfi.priority,
    })
    setIsEditingRFI(rfi.id)
  }, [])

  /**
   * Handles deleting an RFI with confirmation
   */
  const handleDeleteRFI = useCallback(
    (id: string) => {
      try {
        deleteRFI(id)
        toast({
          title: "RFI Deleted",
          description: "The RFI has been deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete RFI. Please try again.",
          variant: "destructive",
        })
      }
    },
    [deleteRFI, toast],
  )

  /**
   * Handles CSV export with mock implementation
   */
  const handleExportCSV = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Export Complete",
        description: "RFIs exported to CSV successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  /**
   * Returns appropriate badge styling for RFI statuses
   */
  const getRFIStatusBadge = useCallback((status: string) => {
    switch (status) {
      case "Answered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Answered
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header with search and actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search RFIs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Dialog
            open={isAddingRFI || isEditingRFI !== null}
            onOpenChange={(open) => {
              if (!open) {
                setIsAddingRFI(false)
                setIsEditingRFI(null)
                setRfiForm({
                  number: "",
                  question: "",
                  status: "Pending",
                  dateSubmitted: new Date().toISOString().split("T")[0],
                  response: "",
                  assignedTo: "",
                  priority: "Medium",
                })
              }
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddingRFI(true)} className="bg-[#003087] hover:bg-[#002066]">
                <Plus className="h-4 w-4 mr-2" />
                Add RFI
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{isEditingRFI ? "Edit RFI" : "Add New RFI"}</DialogTitle>
                <DialogDescription>
                  {isEditingRFI
                    ? "Update the RFI details below."
                    : "Add a new request for information to your estimate."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rfiNumber" className="text-right">
                    RFI Number
                  </Label>
                  <Input
                    id="rfiNumber"
                    value={rfiForm.number}
                    onChange={(e) => setRfiForm((prev) => ({ ...prev, number: e.target.value }))}
                    placeholder="e.g., #001"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="question" className="text-right pt-2">
                    Question
                  </Label>
                  <Textarea
                    id="question"
                    value={rfiForm.question}
                    onChange={(e) => setRfiForm((prev) => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter your question..."
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={rfiForm.status}
                    onValueChange={(value) =>
                      setRfiForm((prev) => ({
                        ...prev,
                        status: value as "Pending" | "Answered",
                      }))
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Answered">Answered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateSubmitted" className="text-right">
                    Date Submitted
                  </Label>
                  <Input
                    id="dateSubmitted"
                    type="date"
                    value={rfiForm.dateSubmitted}
                    onChange={(e) => setRfiForm((prev) => ({ ...prev, dateSubmitted: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assignedTo" className="text-right">
                    Assigned To
                  </Label>
                  <Input
                    id="assignedTo"
                    value={rfiForm.assignedTo || ""}
                    onChange={(e) => setRfiForm((prev) => ({ ...prev, assignedTo: e.target.value }))}
                    placeholder="e.g., Architect"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="response" className="text-right pt-2">
                    Response
                  </Label>
                  <Textarea
                    id="response"
                    value={rfiForm.response}
                    onChange={(e) => setRfiForm((prev) => ({ ...prev, response: e.target.value }))}
                    placeholder="Enter response..."
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" onClick={handleRFISubmit}>
                  {isEditingRFI ? "Update" : "Add"} RFI
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* RFIs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Requests for Information
            <Badge variant="secondary" className="ml-2">
              {projectEstimate.rfis.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RFI Number</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRFIs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      No RFIs found. Add your first RFI to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRFIs.map((rfi) => (
                    <TableRow key={rfi.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{rfi.number}</TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate" title={rfi.question}>
                          {rfi.question}
                        </div>
                      </TableCell>
                      <TableCell>{getRFIStatusBadge(rfi.status)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(rfi.dateSubmitted).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate" title={rfi.response}>
                          {rfi.response || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditRFI(rfi)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRFI(rfi.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
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
    </div>
  )
}

/**
 * Document Log Component
 *
 * @description Manages project documents based on 04_DocumentLog.pdf
 * for the Atlantic Fields Club project. Provides comprehensive document management
 * with CSV import, search, filtering, validation, and CRUD operations.
 *
 * @features
 * - Interactive table with Sheet Number, Description, Date Issued, Date Received, Category, and Actions columns
 * - Add/Edit documents via shadcn/ui Dialog forms
 * - CSV import functionality with validation and error handling
 * - Search functionality filtering by sheet number or description (case-insensitive)
 * - Category-based filtering with Select dropdown
 * - Document viewing dialog with mock document details
 * - Form validation with error handling via shadcn/ui Toast
 * - Export functionality (mock implementation)
 * - Row count badge display
 * - Responsive design for mobile and desktop
 * - CSV template download functionality
 *
 * @component
 * @example
 * \`\`\`tsx
 * <DocumentLog />
 * \`\`\`
 *
 * @csv_import
 * Expected CSV format:
 * \`\`\`csv
 * sheet_number,description,date_issued,date_received,category,notes,revision
 * A2.11,"Level 00 Fitness Floor Plan",2025-01-24,2025-02-20,Architectural,"Updated with latest revisions",Rev 1
 * \`\`\`
 *
 * @maintenance
 * To add new document categories:
 * 1. Update the Document interface category property
 * 2. Add new category to the Select options in the dialog form and filter
 * 3. Update the validateDocument function for new category validation
 * 4. Update the parseCSVData function for category validation
 *
 * To extend CSV import functionality:
 * 1. Update the parseCSVData function for new column handling
 * 2. Modify validation rules in validateDocument
 * 3. Update the CSV template in handleDownloadTemplate
 * 4. Test with large datasets (1000+ rows)
 */
const DocumentLog: React.FC = () => {
  const { toast } = useToast()
  const { projectEstimate, addDocument, updateDocument, deleteDocument, importDocumentsFromCSV, isLoading } =
    useEstimating()

  // Component state
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isAddingDocument, setIsAddingDocument] = useState(false)
  const [isEditingDocument, setIsEditingDocument] = useState<string | null>(null)
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<CSVImportResult | null>(null)

  // Form state
  const [documentForm, setDocumentForm] = useState<Omit<Document, "id">>({
    sheetNumber: "",
    description: "",
    dateIssued: "",
    dateReceived: "",
    category: "Architectural",
    notes: "",
    revision: "",
  })

  // File input ref for CSV import
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Debounced search for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  /**
   * Validates document data
   *
   * @param document - The document to validate
   * @returns {object} Validation result with isValid flag and error message
   */
  const validateDocument = (document: Partial<Document>): { isValid: boolean; error?: string } => {
    if (!document.sheetNumber?.trim()) {
      return { isValid: false, error: "Sheet Number is required" }
    }

    if (!document.description?.trim()) {
      return { isValid: false, error: "Description is required" }
    }

    if (!document.dateIssued) {
      return { isValid: false, error: "Date Issued is required" }
    }

    if (!document.dateReceived) {
      return { isValid: false, error: "Date Received is required" }
    }

    if (!document.category) {
      return { isValid: false, error: "Category is required" }
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(document.dateIssued)) {
      return { isValid: false, error: "Date Issued must be in YYYY-MM-DD format" }
    }

    if (!dateRegex.test(document.dateReceived)) {
      return { isValid: false, error: "Date Received must be in YYYY-MM-DD format" }
    }

    // Validate dates are valid
    const issuedDate = new Date(document.dateIssued)
    const receivedDate = new Date(document.dateReceived)

    if (isNaN(issuedDate.getTime())) {
      return { isValid: false, error: "Date Issued is not a valid date" }
    }

    if (isNaN(receivedDate.getTime())) {
      return { isValid: false, error: "Date Received is not a valid date" }
    }

    return { isValid: true }
  }

  /**
   * Validates sheet number uniqueness
   *
   * @param sheetNumber - The sheet number to validate
   * @param existingDocuments - Array of existing documents to check against
   * @param excludeId - ID to exclude from uniqueness check (for updates)
   * @returns {boolean} True if unique, false otherwise
   */
  const validateSheetNumberUniqueness = (
    sheetNumber: string,
    existingDocuments: Document[],
    excludeId?: string,
  ): boolean => {
    return !existingDocuments.some((doc) => doc.sheetNumber === sheetNumber && doc.id !== excludeId)
  }

  /**
   * Parses CSV data into document objects
   *
   * @param csvData - Raw CSV string data
   * @returns {object} Parsed documents and any errors encountered
   */
  const parseCSVData = (csvData: string): { documents: Partial<Document>[]; errors: string[] } => {
    const lines = csvData.trim().split("\n")
    const errors: string[] = []
    const documents: Partial<Document>[] = []

    if (lines.length < 2) {
      errors.push("CSV file must contain at least a header row and one data row")
      return { documents, errors }
    }

    // Parse header
    const header = lines[0].split(",").map((col) => col.trim().toLowerCase().replace(/"/g, ""))
    const requiredColumns = ["sheet_number", "description", "date_issued", "date_received", "category"]

    // Validate required columns
    for (const col of requiredColumns) {
      if (!header.includes(col)) {
        errors.push(`Missing required column: ${col}`)
      }
    }

    if (errors.length > 0) {
      return { documents, errors }
    }

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i]
      if (!row.trim()) continue // Skip empty rows

      try {
        // Simple CSV parsing (handles quoted values)
        const values: string[] = []
        let current = ""
        let inQuotes = false

        for (let j = 0; j < row.length; j++) {
          const char = row[j]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === "," && !inQuotes) {
            values.push(current.trim())
            current = ""
          } else {
            current += char
          }
        }
        values.push(current.trim()) // Add the last value

        if (values.length < requiredColumns.length) {
          errors.push(`Row ${i + 1}: Insufficient columns (expected ${requiredColumns.length}, got ${values.length})`)
          continue
        }

        const document: Partial<Document> = {
          sheetNumber: values[header.indexOf("sheet_number")]?.replace(/"/g, "") || "",
          description: values[header.indexOf("description")]?.replace(/"/g, "") || "",
          dateIssued: values[header.indexOf("date_issued")]?.replace(/"/g, "") || "",
          dateReceived: values[header.indexOf("date_received")]?.replace(/"/g, "") || "",
          category: values[header.indexOf("category")]?.replace(/"/g, "") as Document["category"],
          notes: values[header.indexOf("notes")]?.replace(/"/g, "") || "",
          revision: values[header.indexOf("revision")]?.replace(/"/g, "") || "",
        }

        // Validate category
        const validCategories = [
          "Architectural",
          "Structural",
          "MEP",
          "Electrical",
          "Plumbing",
          "Civil",
          "Landscape",
          "Other",
        ]
        if (!validCategories.includes(document.category as string)) {
          errors.push(
            `Row ${i + 1}: Invalid category "${document.category}". Must be one of: ${validCategories.join(", ")}`,
          )
          continue
        }

        documents.push(document)
      } catch (error) {
        errors.push(`Row ${i + 1}: Failed to parse row - ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    return { documents, errors }
  }

  /**
   * Filtered documents based on search term and category
   * Uses useMemo for performance optimization
   */
  const filteredDocuments = useMemo(() => {
    let filtered = projectEstimate.documents

    // Apply search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter(
        (doc) =>
          doc.sheetNumber.toLowerCase().includes(searchLower) ||
          doc.description.toLowerCase().includes(searchLower) ||
          doc.category.toLowerCase().includes(searchLower),
      )
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((doc) => doc.category === categoryFilter)
    }

    return filtered
  }, [projectEstimate.documents, debouncedSearchTerm, categoryFilter])

  /**
   * Handles form submission for adding/editing documents
   * Includes validation and error handling
   */
  const handleDocumentSubmit = useCallback(() => {
    // Validate document
    const validation = validateDocument(documentForm)
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.error,
        variant: "destructive",
      })
      return
    }

    // Check for duplicate sheet numbers
    if (
      !validateSheetNumberUniqueness(
        documentForm.sheetNumber,
        projectEstimate.documents,
        isEditingDocument || undefined,
      )
    ) {
      toast({
        title: "Validation Error",
        description: "Sheet number already exists. Please use a unique sheet number.",
        variant: "destructive",
      })
      return
    }

    try {
      if (isEditingDocument) {
        updateDocument(isEditingDocument, documentForm)
        toast({
          title: "Document Updated",
          description: "The document has been updated successfully.",
        })
        setIsEditingDocument(null)
      } else {
        addDocument(documentForm)
        toast({
          title: "Document Added",
          description: "The document has been added successfully.",
        })
      }

      // Reset form
      setDocumentForm({
        sheetNumber: "",
        description: "",
        dateIssued: "",
        dateReceived: "",
        category: "Architectural",
        notes: "",
        revision: "",
      })
      setIsAddingDocument(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save document. Please try again.",
        variant: "destructive",
      })
    }
  }, [documentForm, isEditingDocument, addDocument, updateDocument, projectEstimate.documents, toast])

  /**
   * Handles editing a document
   * Populates form with existing data
   */
  const handleEditDocument = useCallback((document: Document) => {
    setDocumentForm({
      sheetNumber: document.sheetNumber,
      description: document.description,
      dateIssued: document.dateIssued,
      dateReceived: document.dateReceived,
      category: document.category,
      notes: document.notes || "",
      revision: document.revision || "",
    })
    setIsEditingDocument(document.id)
  }, [])

  /**
   * Handles deleting a document with confirmation
   */
  const handleDeleteDocument = useCallback(
    (id: string) => {
      try {
        deleteDocument(id)
        toast({
          title: "Document Deleted",
          description: "The document has been deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete document. Please try again.",
        })
      }
    },
    [deleteDocument, toast],
  )

  /**
   * Handles viewing a document
   * Opens dialog with document details
   */
  const handleViewDocument = useCallback((document: Document) => {
    setViewingDocument(document)
  }, [])

  /**
   * Handles CSV file import
   * Processes file and imports documents with validation
   */
  const handleCSVImport = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.name.toLowerCase().endsWith(".csv")) {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV file.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      try {
        setIsImporting(true)

        // Read file content
        const fileContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.onerror = () => reject(new Error("Failed to read file"))
          reader.readAsText(file)
        })

        // Import documents
        const result = await importDocumentsFromCSV(fileContent)
        setImportResult(result)

        // Show success/error feedback
        if (result.successfulRows > 0) {
          toast({
            title: "Import Completed",
            description: `Successfully imported ${result.successfulRows} documents${
              result.errorRows > 0 ? ` with ${result.errorRows} errors` : ""
            }.`,
          })
        } else {
          toast({
            title: "Import Failed",
            description: "No documents were imported. Please check your CSV format.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: error instanceof Error ? error.message : "Failed to import CSV file.",
          variant: "destructive",
        })
      } finally {
        setIsImporting(false)
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    },
    [importDocumentsFromCSV, toast],
  )

  /**
   * Handles CSV export with mock implementation
   */
  const handleExportCSV = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Export Complete",
        description: "Documents exported to CSV successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  /**
   * Handles CSV template download
   * Provides sample CSV format for users
   */
  const handleDownloadTemplate = useCallback(() => {
    const csvTemplate = `sheet_number,description,date_issued,date_received,category,notes,revision
A2.11,"Level 00 Fitness Floor Plan",2025-01-24,2025-02-20,Architectural,"Updated with latest revisions",Rev 1
S-101,"Foundation Plan - Dining",2024-12-20,2025-01-06,Structural,"Structural foundation details",Rev 2
E001.10,"Electrical Cover Sheet - Club Core",2024-12-20,2025-02-20,Electrical,"Main electrical drawings",
M001.00,"Mechanical Cover Sheet",2024-12-20,2025-02-20,MEP,"Mechanical systems overview",
P001.00,"Plumbing Cover Sheet",2024-12-20,2025-02-20,Plumbing,"Plumbing systems overview",`

    const blob = new Blob([csvTemplate], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "document_log_template.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded successfully.",
    })
  }, [toast])

  /**
   * Returns appropriate badge styling for document categories
   */
  const getCategoryBadge = useCallback((category: string) => {
    switch (category) {
      case "Architectural":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Architectural
          </Badge>
        )
      case "Structural":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Structural
          </Badge>
        )
      case "MEP":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            MEP
          </Badge>
        )
      case "Electrical":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Electrical
          </Badge>
        )
      case "Plumbing":
        return (
          <Badge variant="outline" className="bg-cyan-100 text-cyan-800">
            Plumbing
          </Badge>
        )
      case "Civil":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            Civil
          </Badge>
        )
      case "Landscape":
        return (
          <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
            Landscape
          </Badge>
        )
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header with search, filters, and actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by sheet number or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
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
        <div className="flex flex-col sm:flex-row gap-3">
          <Dialog
            open={isAddingDocument || isEditingDocument !== null}
            onOpenChange={(open) => {
              if (!open) {
                setIsAddingDocument(false)
                setIsEditingDocument(null)
                setDocumentForm({
                  sheetNumber: "",
                  description: "",
                  dateIssued: "",
                  dateReceived: "",
                  category: "Architectural",
                  notes: "",
                  revision: "",
                })
              }
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddingDocument(true)} className="bg-[#003087] hover:bg-[#002066]">
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{isEditingDocument ? "Edit Document" : "Add New Document"}</DialogTitle>
                <DialogDescription>
                  {isEditingDocument ? "Update the document details below." : "Add a new document to your project log."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sheetNumber" className="text-right">
                    Sheet Number
                  </Label>
                  <Input
                    id="sheetNumber"
                    value={documentForm.sheetNumber}
                    onChange={(e) => setDocumentForm((prev) => ({ ...prev, sheetNumber: e.target.value }))}
                    placeholder="e.g., A2.11"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={documentForm.description}
                    onChange={(e) => setDocumentForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g., Level 00 Fitness Floor Plan"
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateIssued" className="text-right">
                    Date Issued
                  </Label>
                  <Input
                    id="dateIssued"
                    type="date"
                    value={documentForm.dateIssued}
                    onChange={(e) => setDocumentForm((prev) => ({ ...prev, dateIssued: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateReceived" className="text-right">
                    Date Received
                  </Label>
                  <Input
                    id="dateReceived"
                    type="date"
                    value={documentForm.dateReceived}
                    onChange={(e) => setDocumentForm((prev) => ({ ...prev, dateReceived: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={documentForm.category}
                    onValueChange={(value) =>
                      setDocumentForm((prev) => ({
                        ...prev,
                        category: value as Document["category"],
                      }))
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="revision" className="text-right">
                    Revision
                  </Label>
                  <Input
                    id="revision"
                    value={documentForm.revision}
                    onChange={(e) => setDocumentForm((prev) => ({ ...prev, revision: e.target.value }))}
                    placeholder="e.g., Rev 1"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="notes" className="text-right pt-2">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={documentForm.notes}
                    onChange={(e) => setDocumentForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes..."
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" onClick={handleDocumentSubmit}>
                  {isEditingDocument ? "Update" : "Add"} Document
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isImporting || isLoading} variant="outline">
            {isImporting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Import CSV
          </Button>
          <Button onClick={handleDownloadTemplate} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Import Results Dialog */}
      {importResult && (
        <Dialog open={!!importResult} onOpenChange={() => setImportResult(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>CSV Import Results</DialogTitle>
              <DialogDescription>Summary of the CSV import operation</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{importResult.totalRows}</div>
                  <div className="text-sm text-blue-600">Total Rows</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{importResult.successfulRows}</div>
                  <div className="text-sm text-green-600">Successful</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{importResult.errorRows}</div>
                  <div className="text-sm text-red-600">Errors</div>
                </div>
              </div>
              {importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Errors:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setImportResult(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Document Viewer Dialog */}
      {viewingDocument && (
        <Dialog open={!!viewingDocument} onOpenChange={() => setViewingDocument(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Document Details</DialogTitle>
              <DialogDescription>Viewing details for {viewingDocument.sheetNumber}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Sheet Number</Label>
                  <p className="text-sm text-gray-900 mt-1">{viewingDocument.sheetNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Category</Label>
                  <div className="mt-1">{getCategoryBadge(viewingDocument.category)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Date Issued</Label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(viewingDocument.dateIssued).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Date Received</Label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(viewingDocument.dateReceived).toLocaleDateString()}
                  </p>
                </div>
                {viewingDocument.revision && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Revision</Label>
                    <p className="text-sm text-gray-900 mt-1">{viewingDocument.revision}</p>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <p className="text-sm text-gray-900 mt-1">{viewingDocument.description}</p>
              </div>
              {viewingDocument.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Notes</Label>
                  <p className="text-sm text-gray-900 mt-1">{viewingDocument.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setViewingDocument(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Log
            <Badge variant="secondary" className="ml-2">
              {filteredDocuments.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sheet Number</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      No documents found. Add your first document or import from CSV to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((document) => (
                    <TableRow key={document.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{document.sheetNumber}</TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate" title={document.description}>
                          {document.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(document.dateIssued).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(document.dateReceived).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getCategoryBadge(document.category)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewDocument(document)}>
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditDocument(document)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(document.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
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
    </div>
  )
}

/**
 * Enhanced Bid Tabulation Step Component
 *
 * @description Integrates the Enhanced Bid Tab component into the workflow
 * with proper state management and guided tour integration
 */
const BidTabulation: React.FC = () => {
  const { selectedRFP, projectEstimate, updateBidTabData, updateBidLineItem } = useEstimating()

  /**
   * Handle bid data save from Enhanced Bid Tab
   */
  const handleBidSave = useCallback(
    (bidData: Record<string, BidLineItem[]>) => {
      updateBidTabData(bidData)
    },
    [updateBidTabData],
  )

  /**
   * Handle individual item updates
   */
  const handleItemUpdate = useCallback(
    (trade: string, itemId: string, updates: Partial<BidLineItem>) => {
      updateBidLineItem(trade, itemId, updates)
    },
    [updateBidLineItem],
  )

  return (
    <div className="space-y-6" data-tour="bid-tabulation-step">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bid Tabulation</h2>
          <p className="text-gray-600 mt-1">
            Create detailed bid tabs for each trade using CSI divisions and line item breakdowns
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Step 5 of 7
        </Badge>
      </div>

      <EnhancedBidTab
        selectedRFP={selectedRFP}
        onSave={handleBidSave}
        onItemUpdate={handleItemUpdate}
        className="bid-tabulation-component"
        data-tour="enhanced-bid-tab"
      />
    </div>
  )
}

/**
 * Enhanced Bid Leveling Step Component
 *
 * @description Integrates the Bid Leveling component with enhanced state management
 */
const BidLevelingStep: React.FC = () => {
  const { selectedRFP, projectEstimate, selectVendorBid, updateVendorBid } = useEstimating()

  return (
    <div className="space-y-6" data-tour="bid-leveling-step">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bid Leveling & Analysis</h2>
          <p className="text-gray-600 mt-1">
            Compare vendor bids, analyze pricing, and select the best value for each trade
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Step 6 of 7
        </Badge>
      </div>

      <BidLeveling
        selectedRFP={selectedRFP}
        vendorBids={projectEstimate.vendorBids}
        selectedBids={projectEstimate.selectedBids}
        onSelectBid={selectVendorBid}
        onUpdateBid={updateVendorBid}
        data-tour="bid-leveling-component"
      />
    </div>
  )
}

/**
 * Cost Summary Step Component
 *
 * @description Final step for cost compilation and approval workflow
 */
const CostSummaryComponent: React.FC = () => {
  const { projectEstimate, updateCostSummary, saveEstimate, exportData } = useEstimating()
  const { toast } = useToast()

  // Calculate totals from selected bids
  const subtotal = useMemo(() => {
    return Object.values(projectEstimate.selectedBids).reduce((sum, bid) => sum + bid.totalAmount, 0)
  }, [projectEstimate.selectedBids])

  const overhead = useMemo(() => subtotal * 0.1, [subtotal]) // 10% overhead
  const profit = useMemo(() => subtotal * 0.08, [subtotal]) // 8% profit
  const contingency = useMemo(() => subtotal * 0.05, [subtotal]) // 5% contingency
  const total = useMemo(() => subtotal + overhead + profit + contingency, [subtotal, overhead, profit, contingency])

  /**
   * Handle cost summary approval
   */
  const handleApproval = useCallback(
    async (status: "approved" | "rejected") => {
      try {
        updateCostSummary({
          subtotal,
          overhead,
          profit,
          contingency,
          total,
          approvalStatus: status,
          approvedBy: "Current User", // Would come from auth context
          approvedDate: new Date(),
        })

        await saveEstimate()

        toast({
          title: status === "approved" ? "Estimate Approved" : "Estimate Rejected",
          description: `The cost summary has been ${status} and saved.`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update approval status.",
          variant: "destructive",
        })
      }
    },
    [subtotal, overhead, profit, contingency, total, updateCostSummary, saveEstimate, toast],
  )

  return (
    <div className="space-y-6" data-tour="cost-summary-step">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cost Summary & Approval</h2>
          <p className="text-gray-600 mt-1">Review final costs, apply overhead and profit, and submit for approval</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Step 7 of 7
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Bids Summary */}
        <Card data-tour="selected-bids-summary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Selected Bids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(projectEstimate.selectedBids).map(([trade, bid]) => (
                <div key={trade} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{trade}</div>
                    <div className="text-sm text-gray-600">{bid.vendorName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${bid.totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-green-600">Selected</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card data-tour="cost-breakdown">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal (Selected Bids)</span>
                <span className="font-medium">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Overhead (10%)</span>
                <span className="font-medium">${overhead.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Profit (8%)</span>
                <span className="font-medium">${profit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Contingency (5%)</span>
                <span className="font-medium">${contingency.toLocaleString()}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Project Cost</span>
                  <span className="text-green-600">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Actions */}
      <Card data-tour="approval-actions">
        <CardHeader>
          <CardTitle>Approval Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Review the cost summary and selected bids before submitting for approval.</p>
              {projectEstimate.costSummary?.approvalStatus && (
                <div className="mt-2">
                  <Badge
                    variant={
                      projectEstimate.costSummary.approvalStatus === "approved"
                        ? "default"
                        : projectEstimate.costSummary.approvalStatus === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {projectEstimate.costSummary.approvalStatus.toUpperCase()}
                  </Badge>
                  {projectEstimate.costSummary.approvedBy && (
                    <span className="ml-2 text-sm text-gray-600">by {projectEstimate.costSummary.approvedBy}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button onClick={() => exportData("pdf")} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={() => handleApproval("rejected")} variant="destructive">
                Reject
              </Button>
              <Button onClick={() => handleApproval("approved")} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Keeping existing placeholder components for compatibility
const Subcontractors: React.FC = () => {
  const { selectedRFP, projectEstimate } = useEstimating()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Subcontractors (Legacy)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>This step has been replaced by Bid Tabulation and Bid Leveling</p>
          <p className="text-sm mt-2">Use Steps 5 and 6 for comprehensive bid management</p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Main EstimatingWorkflow Component with Enhanced Bid Management
 */
const EstimatingWorkflow: React.FC = () => {
  const { projectEstimate, currentTab, setCurrentTab, selectedRFP, saveEstimate, exportData, isLoading } =
    useEstimating()

  /**
   * Enhanced workflow steps configuration with bid management
   */
  const workflowSteps = [
    { id: "quantity-takeoff", label: "Quantity Takeoff", icon: Ruler, component: QuantityTakeoff },
    {
      id: "clarifications-assumptions",
      label: "Clarifications & Assumptions",
      icon: FileText,
      component: ClarificationsAssumptions,
    },
    { id: "rfis", label: "RFIs", icon: HelpCircle, component: RFIComponent },
    { id: "document-log", label: "Document Log", icon: FileText, component: DocumentLog },
    { id: "bid-tabulation", label: "Bid Tabulation", icon: BarChart3, component: BidTabulation },
    { id: "bid-leveling", label: "Bid Leveling", icon: TrendingUp, component: BidLevelingStep },
    { id: "cost-summary", label: "Cost Summary", icon: Calculator, component: CostSummaryComponent },
  ]

  /**
   * Handle saving with enhanced bid data
   */
  const handleSave = async () => {
    try {
      await saveEstimate()
      console.log("Enhanced estimate saved successfully")
    } catch (error) {
      console.error("Failed to save enhanced estimate:", error)
    }
  }

  /**
   * Handle export with bid data
   */
  const handleExport = async (format: "csv" | "pdf") => {
    try {
      await exportData(format)
      console.log(`Enhanced export completed: ${format}`)
    } catch (error) {
      console.error(`Failed to export enhanced data as ${format}:`, error)
    }
  }

  const CurrentStepComponent = workflowSteps.find((step) => step.id === currentTab)?.component || QuantityTakeoff

  return (
    <div className="container mx-auto px-6 py-8 bg-gray-50 min-h-screen" data-tour="estimating-workflow">
      {/* Enhanced Header with Bid Status */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enhanced Estimating Workflow</h1>
            <p className="text-gray-600 mt-2">
              Complete bid management with tabulation, leveling, and approval workflow
            </p>
            {selectedRFP && (
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>Project: {projectEstimate.name}</span>
                <span>•</span>
                <span>Client: {projectEstimate.client}</span>
                <span>•</span>
                <span>Estimator: {projectEstimate.estimator}</span>
                {projectEstimate.buildingConnectedSync && (
                  <>
                    <span>•</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      BuildingConnected
                    </Badge>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSave} disabled={isLoading} className="bg-[#003087] hover:bg-[#002066]">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Estimate"}
            </Button>
            <Button onClick={() => handleExport("csv")} disabled={isLoading} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {isLoading ? "Exporting..." : "Export CSV"}
            </Button>
          </div>
        </div>
      </div>

      {/* RFP Selection */}
      <RFPSelection />

      {/* Enhanced Workflow Stepper */}
      <Card className="mb-8" data-tour="workflow-stepper">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = step.id === currentTab
              const isCompleted = workflowSteps.findIndex((s) => s.id === currentTab) > index

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentTab(step.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#003087] text-white"
                      : isCompleted
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  data-tour={`workflow-step-${step.id}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium text-center leading-tight">{step.label}</span>
                  {isCompleted && <CheckCircle className="h-3 w-3" />}
                </button>
              )
            })}
          </div>

          {/* Enhanced Step Content */}
          <div className="mt-6">
            <CurrentStepComponent />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EstimatingWorkflow
