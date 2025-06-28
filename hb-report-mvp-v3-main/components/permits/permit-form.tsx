"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Permit, Project, Inspection } from "@/types"
import { Calendar, Plus, Trash2 } from "lucide-react"

interface PermitFormProps {
  permit: Permit | null
  projects: Project[]
  onSave: (permit: Partial<Permit>) => void
  onCancel: () => void
}

export function PermitForm({ permit, projects, onSave, onCancel }: PermitFormProps) {
  const [formData, setFormData] = useState<Partial<Permit>>({
    number: "",
    type: "",
    status: "pending",
    projectId: projects[0]?.id || 1,
    applicationDate: new Date().toISOString().split("T")[0],
    authority: "",
    comments: "",
    inspections: [],
  })

  const [inspections, setInspections] = useState<Partial<Inspection>[]>([])

  useEffect(() => {
    if (permit) {
      setFormData({
        ...permit,
        applicationDate: permit.applicationDate ? permit.applicationDate.split("T")[0] : "",
        approvalDate: permit.approvalDate ? permit.approvalDate.split("T")[0] : "",
        expirationDate: permit.expirationDate ? permit.expirationDate.split("T")[0] : "",
      })
      setInspections(permit.inspections || [])
    }
  }, [permit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData = {
      ...formData,
      inspections: inspections.filter(
        (inspection) => inspection.type && inspection.date && inspection.inspector,
      ) as Inspection[],
    }

    onSave(submitData)
  }

  const handleInputChange = (field: keyof Permit, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addInspection = () => {
    setInspections((prev) => [
      ...prev,
      {
        id: `inspection-${Date.now()}`,
        permitId: permit?.id || "",
        type: "",
        date: new Date().toISOString().split("T")[0],
        result: "passed",
        inspector: "",
        comments: "",
      },
    ])
  }

  const updateInspection = (index: number, field: keyof Inspection, value: any) => {
    setInspections((prev) =>
      prev.map((inspection, i) => (i === index ? { ...inspection, [field]: value } : inspection)),
    )
  }

  const removeInspection = (index: number) => {
    setInspections((prev) => prev.filter((_, i) => i !== index))
  }

  const permitTypes = [
    "Building",
    "Electrical",
    "Plumbing",
    "Mechanical",
    "Fire",
    "Demolition",
    "Excavation",
    "Roofing",
    "Sign",
    "Other",
  ]

  const inspectionTypes = [
    "Foundation",
    "Framing",
    "Electrical Rough-in",
    "Plumbing Rough-in",
    "Mechanical Rough-in",
    "Insulation",
    "Drywall",
    "Final Electrical",
    "Final Plumbing",
    "Final Mechanical",
    "Final Building",
    "Certificate of Occupancy",
  ]

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{permit ? "Edit Permit" : "Add New Permit"}</DialogTitle>
          <DialogDescription>
            {permit ? "Update permit information and inspections" : "Create a new permit record"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Permit Details</TabsTrigger>
              <TabsTrigger value="inspections">Inspections ({inspections.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Permit Number *</Label>
                  <Input
                    id="number"
                    value={formData.number || ""}
                    onChange={(e) => handleInputChange("number", e.target.value)}
                    placeholder="Enter permit number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Permit Type *</Label>
                  <Select value={formData.type || ""} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select permit type" />
                    </SelectTrigger>
                    <SelectContent>
                      {permitTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project">Project *</Label>
                  <Select
                    value={formData.projectId?.toString() || ""}
                    onValueChange={(value) => handleInputChange("projectId", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status || "pending"}
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authority">Issuing Authority *</Label>
                  <Input
                    id="authority"
                    value={formData.authority || ""}
                    onChange={(e) => handleInputChange("authority", e.target.value)}
                    placeholder="e.g., City Building Department"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicationDate">Application Date</Label>
                  <Input
                    id="applicationDate"
                    type="date"
                    value={formData.applicationDate || ""}
                    onChange={(e) => handleInputChange("applicationDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approvalDate">Approval Date</Label>
                  <Input
                    id="approvalDate"
                    type="date"
                    value={formData.approvalDate || ""}
                    onChange={(e) => handleInputChange("approvalDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={formData.expirationDate || ""}
                    onChange={(e) => handleInputChange("expirationDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  value={formData.comments || ""}
                  onChange={(e) => handleInputChange("comments", e.target.value)}
                  placeholder="Additional notes or comments"
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="inspections" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Inspection Schedule</h3>
                <Button type="button" onClick={addInspection} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Inspection
                </Button>
              </div>

              {inspections.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No inspections scheduled</p>
                      <p className="text-sm">Add inspections to track progress</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {inspections.map((inspection, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Inspection {index + 1}</CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInspection(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Inspection Type</Label>
                            <Select
                              value={inspection.type || ""}
                              onValueChange={(value) => updateInspection(index, "type", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select inspection type" />
                              </SelectTrigger>
                              <SelectContent>
                                {inspectionTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Inspection Date</Label>
                            <Input
                              type="date"
                              value={inspection.date || ""}
                              onChange={(e) => updateInspection(index, "date", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Inspector</Label>
                            <Input
                              value={inspection.inspector || ""}
                              onChange={(e) => updateInspection(index, "inspector", e.target.value)}
                              placeholder="Inspector name"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Result</Label>
                            <Select
                              value={inspection.result || "passed"}
                              onValueChange={(value) => updateInspection(index, "result", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="passed">Passed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="conditional">Conditional Pass</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Comments</Label>
                          <Textarea
                            value={inspection.comments || ""}
                            onChange={(e) => updateInspection(index, "comments", e.target.value)}
                            placeholder="Inspection notes or comments"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#FF6B35] hover:bg-[#E55A2B]">
              {permit ? "Update Permit" : "Create Permit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
