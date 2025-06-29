"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, Ruler } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useEstimating } from "./estimating-context"
import { useDebounce } from "@/hooks/use-debounce"
import type { AreaCalculation } from "./estimating-context"
import { useToast } from "@/hooks/use-toast"

/**
 * @fileoverview Quantity Takeoff Component
 *
 * This component allows users to input, manage, and view area calculations
 * and key project metrics for a construction estimate. It provides a table
 * for detailed area entries, summary inputs for overall project dimensions,
 * and integrates with the EstimatingContext for state management.
 *
 * @version 1.0.0
 * @author HB Report Development Team
 * @since 2025-06-17
 *
 * @features
 * - **Area Calculation Table**: Displays individual area entries with building,
 *   level, area type, square footage, and notes.
 * - **Add/Delete Functionality**: Users can add new area calculations and
 *   delete existing ones directly from the table.
 * - **Search/Filter**: A search input allows filtering the area calculations
 *   by any text content.
 * - **Project Metrics Summary**: Inputs for Total Gross SF, Total AC SF,
 *   Site Acres, and Parking Spaces, which update the overall project estimate.
 * - **Input Validation**: Square footage inputs are validated to be non-negative
 *   and within a reasonable maximum limit (1,000,000 SF).
 *
 * @state
 * - `newCalculation`: Partial<AreaCalculation> - Stores data for the new row being added.
 * - `searchTerm`: string - Stores the current value of the search input.
 *
 * @dependencies
 * - `useEstimating`: Custom hook from `./estimating-context` for accessing
 *   `projectEstimate`, `updateAreaCalculations`, and `updateProjectMetrics`.
 * - `useDebounce`: Custom hook from `@/hooks/use-debounce` for debouncing
 *   the search input.
 * - shadcn/ui components: Card, Input, Label, Table, Button, Select, Separator.
 * - Lucide icons: PlusCircle, Trash2, Ruler.
 * - `useToast`: for displaying notifications.
 *
 * @maintenance
 * - To add new area types, update the `SelectItem` components within the `Select`
 *   for `areaType`.
 * - Validation logic for square footage is handled internally; for more complex
 *   validations, consider adding them to `estimating-context.ts` or a dedicated
 *   validation utility.
 */
export default function QuantityTakeoff() {
  const { projectEstimate, updateAreaCalculations, updateProjectMetrics } = useEstimating()
  const { toast } = useToast()

  const [newCalculation, setNewCalculation] = useState<Partial<AreaCalculation>>({
    building: "",
    level: "",
    areaType: "AC SF", // Default value
    squareFootage: 0,
    notes: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  /**
   * Validates square footage input.
   * @param value - The square footage value to validate.
   * @returns {boolean} True if valid, false otherwise.
   */
  const validateSquareFootage = (value: number): boolean => {
    return !isNaN(value) && value >= 0 && value <= 1000000 // Max 1M sq ft
  }

  /**
   * Handles adding a new area calculation to the project estimate.
   */
  const handleAddCalculation = useCallback(() => {
    if (
      !newCalculation.building?.trim() ||
      !newCalculation.level?.trim() ||
      newCalculation.squareFootage === undefined ||
      !validateSquareFootage(newCalculation.squareFootage)
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Building, Level, Square Footage) and ensure SF is valid.",
        variant: "destructive",
      })
      return
    }

    const id = `calc-${Date.now()}`
    const updatedCalculations = [...projectEstimate.areaCalculations, { ...newCalculation, id } as AreaCalculation]
    updateAreaCalculations(updatedCalculations)
    setNewCalculation({
      building: "",
      level: "",
      areaType: "AC SF",
      squareFootage: 0,
      notes: "",
    })
    toast({
      title: "Calculation Added",
      description: "New area calculation has been added.",
    })
  }, [newCalculation, projectEstimate.areaCalculations, updateAreaCalculations, toast])

  /**
   * Handles deleting an area calculation from the project estimate.
   * @param id - The ID of the calculation to delete.
   */
  const handleDeleteCalculation = useCallback(
    (id: string) => {
      const updatedCalculations = projectEstimate.areaCalculations.filter((calc) => calc.id !== id)
      updateAreaCalculations(updatedCalculations)
      toast({
        title: "Calculation Deleted",
        description: "Area calculation has been removed.",
      })
    },
    [projectEstimate.areaCalculations, updateAreaCalculations, toast],
  )

  /**
   * Handles updating a specific project metric (e.g., totalGrossSF).
   * @param field - The field name to update in `projectEstimate`.
   * @param value - The new value for the field.
   */
  const handleMetricUpdate = useCallback(
    (field: keyof typeof projectEstimate, value: number) => {
      if (field === "totalGrossSF" || field === "totalACSF") {
        if (!validateSquareFootage(value)) {
          toast({
            title: "Validation Error",
            description: "Square footage must be non-negative and less than 1,000,000.",
            variant: "destructive",
          })
          return
        }
      } else if (field === "siteAcres" && value < 0) {
        toast({
          title: "Validation Error",
          description: "Site acres cannot be negative.",
          variant: "destructive",
        })
        return
      } else if (field === "parkingSpaces" && value < 0) {
        toast({
          title: "Validation Error",
          description: "Parking spaces cannot be negative.",
          variant: "destructive",
        })
        return
      }

      updateProjectMetrics({ [field]: value })
    },
    [updateProjectMetrics, toast],
  )

  /**
   * Filters area calculations based on the debounced search term.
   */
  const filteredCalculations = useMemo(() => {
    if (!debouncedSearchTerm) {
      return projectEstimate.areaCalculations
    }
    const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase()
    return projectEstimate.areaCalculations.filter(
      (calc) =>
        calc.building.toLowerCase().includes(lowerCaseSearchTerm) ||
        calc.level.toLowerCase().includes(lowerCaseSearchTerm) ||
        calc.areaType.toLowerCase().includes(lowerCaseSearchTerm) ||
        calc.notes?.toLowerCase().includes(lowerCaseSearchTerm) ||
        calc.squareFootage.toString().includes(lowerCaseSearchTerm),
    )
  }, [projectEstimate.areaCalculations, debouncedSearchTerm])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-6 w-6" /> Quantity Takeoff
        </CardTitle>
        <CardDescription>Manage area calculations and key project metrics for your estimate.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Project Metrics Summary */}
        <div className="space-y-4 quantity-takeoff-summary" data-tour="quantity-takeoff-summary">
          <h3 className="text-lg font-semibold">Project Metrics Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="totalGrossSF">Total Gross SF</Label>
              <Input
                id="totalGrossSF"
                type="number"
                value={projectEstimate.totalGrossSF}
                onChange={(e) => handleMetricUpdate("totalGrossSF", Number.parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="totalACSF">Total AC SF</Label>
              <Input
                id="totalACSF"
                type="number"
                value={projectEstimate.totalACSF}
                onChange={(e) => handleMetricUpdate("totalACSF", Number.parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="siteAcres">Site Acres</Label>
              <Input
                id="siteAcres"
                type="number"
                value={projectEstimate.siteAcres}
                onChange={(e) => handleMetricUpdate("siteAcres", Number.parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="parkingSpaces">Parking Spaces</Label>
              <Input
                id="parkingSpaces"
                type="number"
                value={projectEstimate.parkingSpaces}
                onChange={(e) => handleMetricUpdate("parkingSpaces", Number.parseInt(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Area Calculations Table */}
        <div className="space-y-4 quantity-takeoff-table" data-tour="quantity-takeoff-table">
          <h3 className="text-lg font-semibold">Detailed Area Calculations</h3>
          <Input
            placeholder="Search calculations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Input
              placeholder="Building (e.g., DINING)"
              value={newCalculation.building}
              onChange={(e) => setNewCalculation({ ...newCalculation, building: e.target.value })}
            />
            <Input
              placeholder="Level (e.g., LOWER LEVEL)"
              value={newCalculation.level}
              onChange={(e) => setNewCalculation({ ...newCalculation, level: e.target.value })}
            />
            <Select
              value={newCalculation.areaType}
              onValueChange={(value: AreaCalculation["areaType"]) =>
                setNewCalculation({ ...newCalculation, areaType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Area Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AC SF">AC SF</SelectItem>
                <SelectItem value="Gross SF">Gross SF</SelectItem>
                <SelectItem value="Covered Patio">Covered Patio</SelectItem>
                <SelectItem value="Covered Service">Covered Service</SelectItem>
                <SelectItem value="Uncovered Patio">Uncovered Patio</SelectItem>
                <SelectItem value="Parking">Parking</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Square Footage"
              value={newCalculation.squareFootage === 0 ? "" : newCalculation.squareFootage}
              onChange={(e) =>
                setNewCalculation({ ...newCalculation, squareFootage: Number.parseFloat(e.target.value) })
              }
            />
            <Input
              placeholder="Notes (Optional)"
              value={newCalculation.notes}
              onChange={(e) => setNewCalculation({ ...newCalculation, notes: e.target.value })}
            />
            <Button onClick={handleAddCalculation} className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Calculation
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Building</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Area Type</TableHead>
                <TableHead>SF</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCalculations.length > 0 ? (
                filteredCalculations.map((calc) => (
                  <TableRow key={calc.id}>
                    <TableCell>{calc.building}</TableCell>
                    <TableCell>{calc.level}</TableCell>
                    <TableCell>{calc.areaType}</TableCell>
                    <TableCell>{calc.squareFootage}</TableCell>
                    <TableCell>{calc.notes}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteCalculation(calc.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                    No area calculations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
