"use client"

import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  CalendarIcon, 
  Save, 
  X 
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Constraint } from "@/types/constraint"

interface ConstraintFormProps {
  constraint?: Constraint
  onSubmit: (constraintData: Omit<Constraint, "id" | "no" | "daysElapsed">) => void
  onCancel: () => void
  categories: string[]
}

export function ConstraintForm({
  constraint,
  onSubmit,
  onCancel,
  categories
}: ConstraintFormProps) {
  const [formData, setFormData] = useState({
    category: constraint?.category || "",
    description: constraint?.description || "",
    dateIdentified: constraint?.dateIdentified || format(new Date(), "yyyy-MM-dd"),
    reference: constraint?.reference || "",
    closureDocument: constraint?.closureDocument || "",
    assigned: constraint?.assigned || "",
    bic: constraint?.bic || "",
    dueDate: constraint?.dueDate || "",
    completionStatus: constraint?.completionStatus || "Identified" as const,
    dateClosed: constraint?.dateClosed || "",
    comments: constraint?.comments || ""
  })

  const [dateIdentifiedOpen, setDateIdentifiedOpen] = useState(false)
  const [dueDateOpen, setDueDateOpen] = useState(false)
  const [dateClosedOpen, setDateClosedOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleDateSelect = (field: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [field]: format(date, "yyyy-MM-dd")
      }))
    }
    // Close the respective popover
    if (field === "dateIdentified") setDateIdentifiedOpen(false)
    if (field === "dueDate") setDueDateOpen(false)
    if (field === "dateClosed") setDateClosedOpen(false)
  }

  const isFormValid = () => {
    return formData.category && 
           formData.description && 
           formData.dateIdentified && 
           formData.assigned
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="completionStatus">Status</Label>
          <Select 
            value={formData.completionStatus} 
            onValueChange={(value) => setFormData(prev => ({...prev, completionStatus: value as any}))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Identified">Identified</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
          placeholder="Describe the constraint..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reference */}
        <div className="space-y-2">
          <Label htmlFor="reference">Reference</Label>
          <Input
            id="reference"
            value={formData.reference}
            onChange={(e) => setFormData(prev => ({...prev, reference: e.target.value}))}
            placeholder="Reference document/ID"
          />
        </div>

        {/* Closure Document */}
        <div className="space-y-2">
          <Label htmlFor="closureDocument">Closure Document</Label>
          <Input
            id="closureDocument"
            value={formData.closureDocument}
            onChange={(e) => setFormData(prev => ({...prev, closureDocument: e.target.value}))}
            placeholder="Closure document reference"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Assigned */}
        <div className="space-y-2">
          <Label htmlFor="assigned">Assigned To *</Label>
          <Input
            id="assigned"
            value={formData.assigned}
            onChange={(e) => setFormData(prev => ({...prev, assigned: e.target.value}))}
            placeholder="Person responsible"
          />
        </div>

        {/* BIC */}
        <div className="space-y-2">
          <Label htmlFor="bic">BIC</Label>
          <Input
            id="bic"
            value={formData.bic}
            onChange={(e) => setFormData(prev => ({...prev, bic: e.target.value}))}
            placeholder="BIC reference"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Identified */}
        <div className="space-y-2">
          <Label>Date Identified *</Label>
          <Popover open={dateIdentifiedOpen} onOpenChange={setDateIdentifiedOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dateIdentified && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateIdentified ? format(new Date(formData.dateIdentified), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.dateIdentified ? new Date(formData.dateIdentified) : undefined}
                onSelect={(date) => handleDateSelect("dateIdentified", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label>Due Date</Label>
          <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dueDate ? format(new Date(formData.dueDate), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                onSelect={(date) => handleDateSelect("dueDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Closed - only show if status is Closed */}
        {formData.completionStatus === "Closed" && (
          <div className="space-y-2">
            <Label>Date Closed</Label>
            <Popover open={dateClosedOpen} onOpenChange={setDateClosedOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dateClosed && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateClosed ? format(new Date(formData.dateClosed), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dateClosed ? new Date(formData.dateClosed) : undefined}
                  onSelect={(date) => handleDateSelect("dateClosed", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="space-y-2">
        <Label htmlFor="comments">Comments</Label>
        <Textarea
          id="comments"
          value={formData.comments}
          onChange={(e) => setFormData(prev => ({...prev, comments: e.target.value}))}
          placeholder="Additional comments..."
          rows={3}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!isFormValid()}
          className="bg-[#FF6B35] hover:bg-[#E55A2B]"
        >
          <Save className="mr-2 h-4 w-4" />
          {constraint ? "Update" : "Create"} Constraint
        </Button>
      </div>
    </form>
  )
} 