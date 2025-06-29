"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const completionStatuses = ["Identified", "Pending", "In Progress", "Closed"]

export function ConstraintForm({ constraint, onSubmit, onCancel, categories }) {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    dateIdentified: null,
    reference: "",
    closureDocument: "",
    assigned: "",
    bic: "",
    dueDate: null,
    completionStatus: "Identified",
    dateClosed: null,
    comments: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (constraint) {
      setFormData({
        category: constraint.category || "",
        description: constraint.description || "",
        dateIdentified: constraint.dateIdentified ? new Date(constraint.dateIdentified) : null,
        reference: constraint.reference || "",
        closureDocument: constraint.closureDocument || "",
        assigned: constraint.assigned || "",
        bic: constraint.bic || "",
        dueDate: constraint.dueDate ? new Date(constraint.dueDate) : null,
        completionStatus: constraint.completionStatus || "Identified",
        dateClosed: constraint.dateClosed ? new Date(constraint.dateClosed) : null,
        comments: constraint.comments || "",
      })
    }
  }, [constraint])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.category) {
      newErrors.category = "Category is required"
    }
    if (!formData.description) {
      newErrors.description = "Description is required"
    }
    if (formData.completionStatus === "Closed" && !formData.dateClosed) {
      newErrors.dateClosed = "Date Closed is required when status is Closed"
    }
    if (formData.completionStatus === "Closed" && !formData.closureDocument) {
      newErrors.closureDocument = "Closure Document is required when status is Closed"
    }
    if (formData.dateClosed && formData.dateClosed > new Date()) {
      newErrors.dateClosed = "Date Closed cannot be in the future"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData = {
      ...formData,
      dateIdentified: formData.dateIdentified ? format(formData.dateIdentified, "yyyy-MM-dd") : "",
      dueDate: formData.dueDate ? format(formData.dueDate, "yyyy-MM-dd") : "",
      dateClosed: formData.dateClosed ? format(formData.dateClosed, "yyyy-MM-dd") : "",
    }

    onSubmit(submitData)
  }

  const handleStatusChange = (status) => {
    setFormData((prev) => ({
      ...prev,
      completionStatus: status,
      dateClosed: status === "Closed" && !prev.dateClosed ? new Date() : prev.dateClosed,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
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
              <SelectItem value="1. DESIGN">1. DESIGN</SelectItem>
              <SelectItem value="2. PERMITS">2. PERMITS</SelectItem>
              <SelectItem value="3. PROCUREMENT">3. PROCUREMENT</SelectItem>
              <SelectItem value="4. LABOR">4. LABOR</SelectItem>
              <SelectItem value="5. WEATHER">5. WEATHER</SelectItem>
              <SelectItem value="6. OTHER">6. OTHER</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="completionStatus">Completion Status</Label>
          <Select value={formData.completionStatus} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {completionStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Enter constraint description"
          rows={3}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date Identified</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dateIdentified && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateIdentified ? format(formData.dateIdentified, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dateIdentified}
                onSelect={(date) => setFormData((prev) => ({ ...prev, dateIdentified: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dueDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dueDate}
                onSelect={(date) => setFormData((prev) => ({ ...prev, dueDate: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {formData.completionStatus === "Closed" && (
        <div className="space-y-2">
          <Label>Date Closed *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dateClosed && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateClosed ? format(formData.dateClosed, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dateClosed}
                onSelect={(date) => setFormData((prev) => ({ ...prev, dateClosed: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dateClosed && <p className="text-sm text-red-600">{errors.dateClosed}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assigned">Assigned</Label>
          <Input
            id="assigned"
            value={formData.assigned}
            onChange={(e) => setFormData((prev) => ({ ...prev, assigned: e.target.value }))}
            placeholder="Enter assigned person"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bic">B.I.C.</Label>
          <Input
            id="bic"
            value={formData.bic}
            onChange={(e) => setFormData((prev) => ({ ...prev, bic: e.target.value }))}
            placeholder="Enter B.I.C."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reference">Reference</Label>
          <Input
            id="reference"
            value={formData.reference}
            onChange={(e) => setFormData((prev) => ({ ...prev, reference: e.target.value }))}
            placeholder="Enter reference"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="closureDocument">Closure Document {formData.completionStatus === "Closed" && "*"}</Label>
          <Input
            id="closureDocument"
            value={formData.closureDocument}
            onChange={(e) => setFormData((prev) => ({ ...prev, closureDocument: e.target.value }))}
            placeholder="Enter closure document"
          />
          {errors.closureDocument && <p className="text-sm text-red-600">{errors.closureDocument}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comments</Label>
        <Textarea
          id="comments"
          value={formData.comments}
          onChange={(e) => setFormData((prev) => ({ ...prev, comments: e.target.value }))}
          placeholder="Enter comments"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#FF6B35] hover:bg-[#E55A2B]">
          {constraint ? "Update" : "Create"} Constraint
        </Button>
      </div>
    </form>
  )
}
