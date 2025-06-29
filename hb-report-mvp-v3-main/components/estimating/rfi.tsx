"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useEstimating } from "./estimating-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, Edit, Search, Download, HelpCircle } from "lucide-react"
import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useDebounce } from "@/hooks/use-debounce"
import type { RFI as RFI_Type } from "@/types/estimating" // Renamed to avoid conflict with component name

/**
 * @fileoverview RFI (Request for Information) Component
 *
 * This component allows users to manage Requests for Information (RFIs) for the project.
 * It integrates with the EstimatingContext for state management, provides search,
 * add/edit functionality via a dialog, and export capabilities.
 *
 * @version 1.0.0
 * @author HB Report Development Team
 * @since 2025-06-17
 */

export default function RFI() {
  const { projectEstimate, addRFI, updateRFI, deleteRFI } = useEstimating()
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRFI, setEditingRFI] = useState<RFI_Type | null>(null)
  const [rfiForm, setRfiForm] = useState<Omit<RFI_Type, "id">>({
    number: "",
    question: "",
    status: "Pending",
    dateSubmitted: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    response: "",
    dateAnswered: "",
    assignedTo: "",
    priority: "Medium",
  })
  const [rfiNumberError, setRfiNumberError] = useState<string | null>(null)

  /**
   * Resets the RFI form to its initial empty state.
   */
  const resetForm = () => {
    setRfiForm({
      number: "",
      question: "",
      status: "Pending",
      dateSubmitted: new Date().toISOString().split("T")[0],
      response: "",
      dateAnswered: "",
      assignedTo: "",
      priority: "Medium",
    })
    setEditingRFI(null)
    setRfiNumberError(null)
  }

  /**
   * Handles opening the dialog for adding a new RFI.
   */
  const handleAddRFI = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  /**
   * Handles opening the dialog for editing an existing RFI.
   * @param rfi - The RFI object to be edited.
   */
  const handleEditRFI = (rfi: RFI_Type) => {
    setEditingRFI(rfi)
    setRfiForm({
      number: rfi.number,
      question: rfi.question,
      status: rfi.status,
      dateSubmitted: rfi.dateSubmitted,
      response: rfi.response || "",
      dateAnswered: rfi.dateAnswered || "",
      assignedTo: rfi.assignedTo || "",
      priority: rfi.priority || "Medium",
    })
    setIsDialogOpen(true)
  }

  /**
   * Validates the RFI number for uniqueness.
   * @param number - The RFI number to validate.
   * @returns True if the number is unique, false otherwise.
   */
  const validateRfiNumberUniqueness = (number: string): boolean => {
    const isDuplicate = projectEstimate.rfis.some((rfi) => rfi.number === number && rfi.id !== editingRFI?.id)
    if (isDuplicate) {
      setRfiNumberError("RFI number must be unique.")
      return false
    }
    setRfiNumberError(null)
    return true
  }

  /**
   * Handles form submission for adding or updating an RFI.
   */
  const handleSubmit = () => {
    if (!rfiForm.number || !rfiForm.question || !rfiForm.dateSubmitted) {
      alert("Please fill in all required fields (RFI Number, Question, Date Submitted).")
      return
    }

    if (!validateRfiNumberUniqueness(rfiForm.number)) {
      return
    }

    if (editingRFI) {
      updateRFI(editingRFI.id, rfiForm)
    } else {
      addRFI(rfiForm)
    }
    setIsDialogOpen(false)
    resetForm()
  }

  /**
   * Filters RFIs based on the debounced search term.
   */
  const filteredRFIs = useMemo(() => {
    if (!debouncedSearchTerm) {
      return projectEstimate.rfis
    }
    const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase()
    return projectEstimate.rfis.filter(
      (rfi) =>
        rfi.number.toLowerCase().includes(lowerCaseSearchTerm) ||
        rfi.question.toLowerCase().includes(lowerCaseSearchTerm) ||
        rfi.status.toLowerCase().includes(lowerCaseSearchTerm) ||
        rfi.assignedTo?.toLowerCase().includes(lowerCaseSearchTerm) ||
        rfi.response?.toLowerCase().includes(lowerCaseSearchTerm) ||
        rfi.priority?.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }, [projectEstimate.rfis, debouncedSearchTerm])

  /**
   * Handles exporting RFIs to a CSV file.
   */
  const handleExportCSV = () => {
    const headers = [
      "RFI Number",
      "Question",
      "Status",
      "Date Submitted",
      "Response",
      "Date Answered",
      "Assigned To",
      "Priority",
    ]
    const rows = filteredRFIs.map((rfi) => [
      rfi.number,
      `"${rfi.question.replace(/"/g, '""')}"`, // Escape double quotes
      rfi.status,
      rfi.dateSubmitted,
      `"${(rfi.response || "").replace(/"/g, '""')}"`,
      rfi.dateAnswered || "",
      rfi.assignedTo || "",
      rfi.priority || "",
    ])

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "rfis.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6" /> Requests for Information (RFIs)
        </CardTitle>
        <CardDescription>Track and manage all project RFIs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search RFIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={handleAddRFI} className="w-full sm:w-auto" data-tour="add-rfi-btn">
              <PlusCircle className="h-4 w-4 mr-2" /> Add RFI
            </Button>
            <Button onClick={handleExportCSV} variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto" data-tour="rfi-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">RFI Number</TableHead>
                <TableHead className="min-w-[200px]">Question</TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
                <TableHead className="min-w-[150px]">Date Submitted</TableHead>
                <TableHead className="min-w-[200px]">Response</TableHead>
                <TableHead className="min-w-[120px]">Date Answered</TableHead>
                <TableHead className="min-w-[120px]">Assigned To</TableHead>
                <TableHead className="min-w-[100px]">Priority</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRFIs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500 py-4">
                    No RFIs found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRFIs.map((rfi) => (
                  <TableRow key={rfi.id}>
                    <TableCell className="font-medium">{rfi.number}</TableCell>
                    <TableCell>{rfi.question}</TableCell>
                    <TableCell>{rfi.status}</TableCell>
                    <TableCell>{rfi.dateSubmitted}</TableCell>
                    <TableCell className="text-wrap max-w-[200px]">{rfi.response || "-"}</TableCell>
                    <TableCell>{rfi.dateAnswered || "-"}</TableCell>
                    <TableCell>{rfi.assignedTo || "-"}</TableCell>
                    <TableCell>{rfi.priority || "-"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditRFI(rfi)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit RFI</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteRFI(rfi.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete RFI</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingRFI ? "Edit RFI" : "Add New RFI"}</DialogTitle>
            <CardDescription>
              {editingRFI ? "Update the details of this RFI." : "Enter the details for the new RFI."}
            </CardDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rfiNumber" className="text-right">
                RFI Number
              </Label>
              <Input
                id="rfiNumber"
                placeholder="e.g., #001"
                value={rfiForm.number}
                onChange={(e) => {
                  setRfiForm({ ...rfiForm, number: e.target.value })
                  validateRfiNumberUniqueness(e.target.value)
                }}
                className="col-span-3"
              />
              {rfiNumberError && <p className="col-span-4 text-right text-red-500 text-sm">{rfiNumberError}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={rfiForm.status}
                onValueChange={(value: RFI_Type["status"]) => setRfiForm({ ...rfiForm, status: value })}
              >
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="Select Status" />
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
                onChange={(e) => setRfiForm({ ...rfiForm, dateSubmitted: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedTo" className="text-right">
                Assigned To
              </Label>
              <Input
                id="assignedTo"
                placeholder="e.g., Architect"
                value={rfiForm.assignedTo}
                onChange={(e) => setRfiForm({ ...rfiForm, assignedTo: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={rfiForm.priority}
                onValueChange={(value: RFI_Type["priority"]) => setRfiForm({ ...rfiForm, priority: value })}
              >
                <SelectTrigger id="priority" className="col-span-3">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {rfiForm.status === "Answered" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dateAnswered" className="text-right">
                  Date Answered
                </Label>
                <Input
                  id="dateAnswered"
                  type="date"
                  value={rfiForm.dateAnswered}
                  onChange={(e) => setRfiForm({ ...rfiForm, dateAnswered: e.target.value })}
                  className="col-span-3"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="question" className="text-right">
                Question
              </Label>
              <Textarea
                id="question"
                placeholder="Enter RFI question"
                value={rfiForm.question}
                onChange={(e) => setRfiForm({ ...rfiForm, question: e.target.value })}
                className="col-span-3"
              />
            </div>
            {rfiForm.status === "Answered" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="response" className="text-right">
                  Response
                </Label>
                <Textarea
                  id="response"
                  placeholder="Enter RFI response"
                  value={rfiForm.response}
                  onChange={(e) => setRfiForm({ ...rfiForm, response: e.target.value })}
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!!rfiNumberError}>
              {editingRFI ? "Save Changes" : "Add RFI"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
