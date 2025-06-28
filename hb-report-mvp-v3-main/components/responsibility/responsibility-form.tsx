"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { ResponsibilityTask, ProjectRole, ContractRole } from "@/types/responsibility"

interface ResponsibilityFormProps {
  type: "team" | "contract"
  initialData?: ResponsibilityTask | null
  projectRoles: ProjectRole[]
  contractRoles: ContractRole[]
  onSave: (data: Partial<ResponsibilityTask>) => void
  onCancel: () => void
}

const roleColors: Record<string, string> = {
  PX: "#3b82f6",
  PM1: "#10b981",
  PM2: "#06b6d4",
  PM3: "#8b5cf6",
  PA: "#f59e0b",
  QAC: "#ef4444",
  ProjAcct: "#ec4899",
  O: "#eab308",
  A: "#84cc16",
  C: "#f97316",
  S: "#f43f5e",
}

export function ResponsibilityForm({
  type,
  initialData,
  projectRoles,
  contractRoles,
  onSave,
  onCancel,
}: ResponsibilityFormProps) {
  const [formData, setFormData] = useState<Partial<ResponsibilityTask>>({
    task: "",
    category: "",
    page: "",
    article: "",
    responsible: "",
    assignments: {},
    ...initialData,
  })

  const [contractType, setContractType] = useState<"prime" | "sub">("prime")

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      if (initialData.type === "prime-contract") {
        setContractType("prime")
      } else if (initialData.type === "subcontract") {
        setContractType("sub")
      }
    }
  }, [initialData])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleRoleAssignment = (roleKey: string, assignment: string) => {
    setFormData((prev) => ({
      ...prev,
      assignments: {
        ...prev.assignments,
        [roleKey]: assignment,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submit:", formData)

    const dataToSave = {
      ...formData,
      type: type === "team" ? "team" : contractType === "prime" ? "prime-contract" : "subcontract",
    }

    console.log("Saving task data:", dataToSave)
    onSave(dataToSave)
  }

  const currentRoles = type === "team" ? projectRoles : contractRoles

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        {type === "contract" && (
          <div className="space-y-2">
            <Label>Contract Type</Label>
            <Select value={contractType} onValueChange={(value: "prime" | "sub") => setContractType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prime">Prime Contract</SelectItem>
                <SelectItem value="sub">Subcontract</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {type === "contract" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="page">Contract Page #</Label>
              <Input
                id="page"
                value={formData.page || ""}
                onChange={(e) => handleInputChange("page", e.target.value)}
                placeholder="e.g., 15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="article">Contract Article</Label>
              <Input
                id="article"
                value={formData.article || ""}
                onChange={(e) => handleInputChange("article", e.target.value)}
                placeholder="e.g., 3.2.1"
              />
            </div>
          </div>
        )}

        {type === "team" && (
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category || ""}
              onChange={(e) => handleInputChange("category", e.target.value)}
              placeholder="e.g., Planning, Execution, Quality Control"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="task">Task Description *</Label>
          <Textarea
            id="task"
            value={formData.task || ""}
            onChange={(e) => handleInputChange("task", e.target.value)}
            placeholder="Enter detailed task description..."
            rows={3}
            required
          />
        </div>
      </div>

      <Separator />

      {/* Role Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentRoles.map((role) => (
              <div key={role.key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    style={{
                      backgroundColor: roleColors[role.key] || "#6b7280",
                      color: "white",
                    }}
                  >
                    {role.key}
                  </Badge>
                  <span className="text-sm font-medium">{role.label}</span>
                </div>
                <Select
                  value={formData.assignments?.[role.key] || "None"}
                  onValueChange={(value) => handleRoleAssignment(role.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="X">Primary (X)</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#003087] hover:bg-[#002066]">
          {initialData ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  )
}
