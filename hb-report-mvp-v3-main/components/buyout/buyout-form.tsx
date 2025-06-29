"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Save, X, Plus, Trash2, Edit } from "lucide-react"
import { cn } from "@/lib/utils"

interface BuyoutFormProps {
  projectId: string
  commitmentId?: number
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  activeTab: string
  onTabChange: (tab: string) => void
  isLoading?: boolean
}

const BUYOUT_STATUSES = ["Pending", "In Progress", "LOI Sent", "Contract Sent", "Contract Executed", "On Hold"]

const BIC_OPTIONS = ["HB", "Vendor", "Owner", "N/A"]

const APPROVAL_STATUSES = ["Approved", "Disapproved", "Pending", "Not Required"]

export function BuyoutForm({
  projectId,
  commitmentId,
  initialData,
  onSubmit,
  onCancel,
  activeTab,
  onTabChange,
  isLoading = false,
}: BuyoutFormProps) {
  const [formData, setFormData] = useState({
    number: "",
    vendor: "",
    title: "",
    status: "Pending",
    bic: "HB",
    executed: false,
    retainage_percent: 0,
    contract_start_date: null as Date | null,
    contract_estimated_completion_date: null as Date | null,
    actual_completion_date: null as Date | null,
    contract_date: null as Date | null,
    signed_contract_received_date: null as Date | null,
    issued_on_date: null as Date | null,
    owner_approval_required: false,
    owner_approval_status: "",
    owner_meeting_required: false,
    owner_meeting_date: null as Date | null,
    owner_approval_date: null as Date | null,
    allowance_included: false,
    total_contract_allowances: 0,
    allowance_reconciliation_total: 0,
    allowance_variance: 0,
    ve_offered: false,
    total_ve_presented: 0,
    total_ve_accepted: 0,
    total_ve_rejected: 0,
    net_ve_savings: 0,
    long_lead_included: false,
    long_lead_released: false,
    budget: 0,
    contract_value: 0,
    savings_overage: 0,
    comments: "",
    allowances: [] as any[],
    veItems: [] as any[],
    leadTimes: [] as any[],
    // Contract workflow fields
    scope_review_meeting_date: null as Date | null,
    spm_review_date: null as Date | null,
    spm_approval_status: "",
    px_review_date: null as Date | null,
    px_approval_status: "",
    vp_review_date: null as Date | null,
    vp_approval_status: "",
    loi_sent_date: null as Date | null,
    loi_returned_date: null as Date | null,
    subcontract_agreement_sent_date: null as Date | null,
    fully_executed_sent_date: null as Date | null,
    // Subcontract checklist fields
    contract_status: "N",
    schedule_a_status: "N",
    schedule_b_status: "N",
    exhibit_a_status: "N",
    exhibit_b_status: "N",
    exhibit_i_status: "N",
    labor_rates_status: "N",
    unit_rates_status: "N",
    exhibits_status: "N",
    schedule_of_values_status: "N",
    p_and_p_bond_status: "N",
    w_9_status: "N",
    license_status: "N",
    insurance_general_liability_status: "N",
    insurance_auto_status: "N",
    insurance_umbrella_liability_status: "N",
    insurance_workers_comp_status: "N",
    special_requirements_status: "N",
    compliance_manager_status: "N",
    scanned_returned_status: "N",
    // Compliance waiver fields
    px: "",
    pm: "",
    pa: "",
    compliance_manager: "",
    insurance_requirements_to_waive: [] as string[],
    insurance_explanation: "",
    insurance_risk_justification: "",
    insurance_risk_reduction_actions: "",
    insurance_waiver_level: "",
    licensing_requirements_to_waive: { state: false, local: false, county: "" },
    licensing_risk_justification: "",
    licensing_risk_reduction_actions: "",
    licensing_waiver_level: "",
    subcontract_scope: "",
    employees_on_site: "",
    subcontract_value: 0,
    project_executive: "",
    project_executive_date: null as Date | null,
    cfo: "",
    cfo_date: null as Date | null,
    additional_notes_comments: "",
  })

  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({})

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        // Convert date strings to Date objects
        contract_start_date: initialData.contract_start_date ? new Date(initialData.contract_start_date) : null,
        contract_estimated_completion_date: initialData.contract_estimated_completion_date
          ? new Date(initialData.contract_estimated_completion_date)
          : null,
        actual_completion_date: initialData.actual_completion_date
          ? new Date(initialData.actual_completion_date)
          : null,
        contract_date: initialData.contract_date ? new Date(initialData.contract_date) : null,
        signed_contract_received_date: initialData.signed_contract_received_date
          ? new Date(initialData.signed_contract_received_date)
          : null,
        issued_on_date: initialData.issued_on_date ? new Date(initialData.issued_on_date) : null,
        owner_meeting_date: initialData.owner_meeting_date ? new Date(initialData.owner_meeting_date) : null,
        owner_approval_date: initialData.owner_approval_date ? new Date(initialData.owner_approval_date) : null,
        scope_review_meeting_date: initialData.scope_review_meeting_date
          ? new Date(initialData.scope_review_meeting_date)
          : null,
        spm_review_date: initialData.spm_review_date ? new Date(initialData.spm_review_date) : null,
        px_review_date: initialData.px_review_date ? new Date(initialData.px_review_date) : null,
        vp_review_date: initialData.vp_review_date ? new Date(initialData.vp_review_date) : null,
        loi_sent_date: initialData.loi_sent_date ? new Date(initialData.loi_sent_date) : null,
        loi_returned_date: initialData.loi_returned_date ? new Date(initialData.loi_returned_date) : null,
        subcontract_agreement_sent_date: initialData.subcontract_agreement_sent_date
          ? new Date(initialData.subcontract_agreement_sent_date)
          : null,
        fully_executed_sent_date: initialData.fully_executed_sent_date
          ? new Date(initialData.fully_executed_sent_date)
          : null,
        project_executive_date: initialData.project_executive_date
          ? new Date(initialData.project_executive_date)
          : null,
        cfo_date: initialData.cfo_date ? new Date(initialData.cfo_date) : null,
      }))
    }
  }, [initialData])

  const handleSubmit = async () => {
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const toggleEdit = (section: string) => {
    setEditingSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const addAllowanceItem = () => {
    setFormData((prev) => ({
      ...prev,
      allowances: [...prev.allowances, { item: "", value: 0, reconciled: false, reconciliation_value: 0, variance: 0 }],
    }))
  }

  const removeAllowanceItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      allowances: prev.allowances.filter((_, i) => i !== index),
    }))
  }

  const addVeItem = () => {
    setFormData((prev) => ({
      ...prev,
      veItems: [...prev.veItems, { description: "", value: 0, originalScope: 0, savings: 0, status: "Pending" }],
    }))
  }

  const removeVeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      veItems: prev.veItems.filter((_, i) => i !== index),
    }))
  }

  const addLeadTimeItem = () => {
    setFormData((prev) => ({
      ...prev,
      leadTimes: [...prev.leadTimes, { item: "", time: 0, procured: false }],
    }))
  }

  const removeLeadTimeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      leadTimes: prev.leadTimes.filter((_, i) => i !== index),
    }))
  }

  const DatePicker = ({
    value,
    onChange,
    placeholder,
  }: { value: Date | null; onChange: (date: Date | null) => void; placeholder?: string }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "MM/dd/yyyy") : <span>{placeholder || "mm/dd/yyyy"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value || undefined} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  )

  const renderField = (label: string, children: React.ReactNode, isEditing = true) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {isEditing ? children : <div className="text-sm text-gray-600">View only</div>}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="buyout-details">Buyout Details</TabsTrigger>
          <TabsTrigger value="contract-workflow">Contract Workflow</TabsTrigger>
          <TabsTrigger value="subcontract-checklist">Subcontract Checklist</TabsTrigger>
          <TabsTrigger value="compliance-waiver">Compliance Waiver</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="buyout-details" className="space-y-6">
          {/* General Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>General Information</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("general")}>
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField(
                  "Contract #",
                  <Input
                    value={formData.number}
                    onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
                    placeholder="1699901-001"
                  />,
                  editingSections.general,
                )}

                {renderField(
                  "Status",
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUYOUT_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>,
                  editingSections.general,
                )}

                {renderField(
                  "Contract Company",
                  <Input
                    value={formData.vendor}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vendor: e.target.value }))}
                    placeholder="Select a company"
                  />,
                  editingSections.general,
                )}

                {renderField(
                  "Title",
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Structural Shell"
                  />,
                  editingSections.general,
                )}

                {renderField(
                  "BIC",
                  <Select
                    value={formData.bic}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, bic: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BIC_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>,
                  editingSections.general,
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Executed</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.executed}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, executed: !!checked }))}
                      disabled={!editingSections.general}
                    />
                    <span className="text-sm">{formData.executed ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financials */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Financials</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("financials")}>
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField(
                  "Budget",
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, budget: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />,
                  editingSections.financials,
                )}

                {renderField(
                  "Contract Value",
                  <Input
                    type="number"
                    value={formData.contract_value}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, contract_value: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />,
                  editingSections.financials,
                )}

                {renderField(
                  "Savings / Overage",
                  <Input
                    type="number"
                    value={formData.savings_overage}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, savings_overage: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />,
                  editingSections.financials,
                )}

                {renderField(
                  "Retainage %",
                  <Input
                    type="number"
                    value={formData.retainage_percent}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, retainage_percent: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />,
                  editingSections.financials,
                )}
              </div>
            </CardContent>
          </Card>

          {/* Owner Approval */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Owner Approval</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("owner-approval")}>
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Owner Approval Required</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.owner_approval_required}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, owner_approval_required: !!checked }))
                      }
                      disabled={!editingSections["owner-approval"]}
                    />
                    <span className="text-sm">{formData.owner_approval_required ? "Yes" : "No"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Owner Meeting Required</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.owner_meeting_required}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, owner_meeting_required: !!checked }))
                      }
                      disabled={!editingSections["owner-approval"]}
                    />
                    <span className="text-sm">{formData.owner_meeting_required ? "Yes" : "No"}</span>
                  </div>
                </div>

                {renderField(
                  "Approval Status",
                  <Select
                    value={formData.owner_approval_status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, owner_approval_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPROVAL_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>,
                  editingSections["owner-approval"],
                )}

                {renderField(
                  "Meeting Date",
                  <DatePicker
                    value={formData.owner_meeting_date}
                    onChange={(date) => setFormData((prev) => ({ ...prev, owner_meeting_date: date }))}
                  />,
                  editingSections["owner-approval"],
                )}
              </div>
            </CardContent>
          </Card>

          {/* Allowances */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Allowances</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("allowances")}>
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Allowance Included in Contract</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.allowance_included}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, allowance_included: !!checked }))}
                    disabled={!editingSections.allowances}
                  />
                  <span className="text-sm">{formData.allowance_included ? "Yes" : "No"}</span>
                </div>
              </div>

              {formData.allowance_included && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderField(
                      "Total Contract Allowances",
                      <Input
                        type="number"
                        value={formData.total_contract_allowances}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            total_contract_allowances: Number.parseFloat(e.target.value) || 0,
                          }))
                        }
                      />,
                      editingSections.allowances,
                    )}

                    {renderField(
                      "Reconciliation Total",
                      <Input
                        type="number"
                        value={formData.allowance_reconciliation_total}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            allowance_reconciliation_total: Number.parseFloat(e.target.value) || 0,
                          }))
                        }
                      />,
                      editingSections.allowances,
                    )}

                    {renderField(
                      "Allowance Variance",
                      <Input
                        type="number"
                        value={formData.allowance_variance}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            allowance_variance: Number.parseFloat(e.target.value) || 0,
                          }))
                        }
                      />,
                      editingSections.allowances,
                    )}
                  </div>

                  {editingSections.allowances && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium">Allowance Items</Label>
                        <Button size="sm" onClick={addAllowanceItem}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>

                      {formData.allowances.map((allowance, index) => (
                        <div key={index} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Input
                              placeholder="Allowance Item"
                              value={allowance.item}
                              onChange={(e) => {
                                const newAllowances = [...formData.allowances]
                                newAllowances[index].item = e.target.value
                                setFormData((prev) => ({ ...prev, allowances: newAllowances }))
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Value"
                              value={allowance.value}
                              onChange={(e) => {
                                const newAllowances = [...formData.allowances]
                                newAllowances[index].value = Number.parseFloat(e.target.value) || 0
                                setFormData((prev) => ({ ...prev, allowances: newAllowances }))
                              }}
                            />
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => removeAllowanceItem(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Value Engineering */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Value Engineering</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("value-engineering")}>
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Value Engineering Offered to Owner</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.ve_offered}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, ve_offered: !!checked }))}
                    disabled={!editingSections["value-engineering"]}
                  />
                  <span className="text-sm">{formData.ve_offered ? "Yes" : "No"}</span>
                </div>
              </div>

              {formData.ve_offered && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {renderField(
                      "Total VE Presented",
                      <Input
                        type="number"
                        value={formData.total_ve_presented}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            total_ve_presented: Number.parseFloat(e.target.value) || 0,
                          }))
                        }
                      />,
                      editingSections["value-engineering"],
                    )}

                    {renderField(
                      "Total VE Accepted",
                      <Input
                        type="number"
                        value={formData.total_ve_accepted}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            total_ve_accepted: Number.parseFloat(e.target.value) || 0,
                          }))
                        }
                      />,
                      editingSections["value-engineering"],
                    )}

                    {renderField(
                      "Total VE Rejected",
                      <Input
                        type="number"
                        value={formData.total_ve_rejected}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            total_ve_rejected: Number.parseFloat(e.target.value) || 0,
                          }))
                        }
                      />,
                      editingSections["value-engineering"],
                    )}

                    {renderField(
                      "Net VE Savings",
                      <Input
                        type="number"
                        value={formData.net_ve_savings}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            net_ve_savings: Number.parseFloat(e.target.value) || 0,
                          }))
                        }
                      />,
                      editingSections["value-engineering"],
                    )}
                  </div>

                  {editingSections["value-engineering"] && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium">VE Items</Label>
                        <Button size="sm" onClick={addVeItem}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add VE Item
                        </Button>
                      </div>

                      {formData.veItems.map((veItem, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                          <div>
                            <Input
                              placeholder="VE Description"
                              value={veItem.description}
                              onChange={(e) => {
                                const newVeItems = [...formData.veItems]
                                newVeItems[index].description = e.target.value
                                setFormData((prev) => ({ ...prev, veItems: newVeItems }))
                              }}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Value"
                              value={veItem.value}
                              onChange={(e) => {
                                const newVeItems = [...formData.veItems]
                                newVeItems[index].value = Number.parseFloat(e.target.value) || 0
                                setFormData((prev) => ({ ...prev, veItems: newVeItems }))
                              }}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Original Scope"
                              value={veItem.originalScope}
                              onChange={(e) => {
                                const newVeItems = [...formData.veItems]
                                newVeItems[index].originalScope = Number.parseFloat(e.target.value) || 0
                                setFormData((prev) => ({ ...prev, veItems: newVeItems }))
                              }}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Savings"
                              value={veItem.savings}
                              onChange={(e) => {
                                const newVeItems = [...formData.veItems]
                                newVeItems[index].savings = Number.parseFloat(e.target.value) || 0
                                setFormData((prev) => ({ ...prev, veItems: newVeItems }))
                              }}
                            />
                            <Button size="sm" variant="ghost" onClick={() => removeVeItem(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Long Lead Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Long Lead Items</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("long-lead")}>
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contract Scope Includes Long Lead Items</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.long_lead_included}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, long_lead_included: !!checked }))}
                    disabled={!editingSections["long-lead"]}
                  />
                  <span className="text-sm">{formData.long_lead_included ? "Yes" : "No"}</span>
                </div>
              </div>

              {formData.long_lead_included && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Long Lead Released</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.long_lead_released}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, long_lead_released: !!checked }))
                        }
                        disabled={!editingSections["long-lead"]}
                      />
                      <span className="text-sm">{formData.long_lead_released ? "Yes" : "No"}</span>
                    </div>
                  </div>

                  {editingSections["long-lead"] && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium">Long Lead Items</Label>
                        <Button size="sm" onClick={addLeadTimeItem}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Lead Time Item
                        </Button>
                      </div>

                      {formData.leadTimes.map((leadTime, index) => (
                        <div key={index} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Input
                              placeholder="Long Lead Item"
                              value={leadTime.item}
                              onChange={(e) => {
                                const newLeadTimes = [...formData.leadTimes]
                                newLeadTimes[index].item = e.target.value
                                setFormData((prev) => ({ ...prev, leadTimes: newLeadTimes }))
                              }}
                            />
                          </div>
                          <div className="w-24">
                            <Input
                              type="number"
                              placeholder="Time"
                              value={leadTime.time}
                              onChange={(e) => {
                                const newLeadTimes = [...formData.leadTimes]
                                newLeadTimes[index].time = Number.parseInt(e.target.value) || 0
                                setFormData((prev) => ({ ...prev, leadTimes: newLeadTimes }))
                              }}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={leadTime.procured}
                              onCheckedChange={(checked) => {
                                const newLeadTimes = [...formData.leadTimes]
                                newLeadTimes[index].procured = !!checked
                                setFormData((prev) => ({ ...prev, leadTimes: newLeadTimes }))
                              }}
                            />
                            <span className="text-xs">Procured</span>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => removeLeadTimeItem(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Comments</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("comments")}>
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {renderField(
                "Comments",
                <Textarea
                  value={formData.comments}
                  onChange={(e) => setFormData((prev) => ({ ...prev, comments: e.target.value }))}
                  placeholder="Add comments..."
                  rows={4}
                />,
                editingSections.comments,
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contract-workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Workflow Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scope Review Meeting */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Scope Review Meeting</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "Scope Review Meeting Date",
                    <DatePicker
                      value={formData.scope_review_meeting_date}
                      onChange={(date) => setFormData((prev) => ({ ...prev, scope_review_meeting_date: date }))}
                    />,
                  )}
                </div>
              </div>

              <Separator />

              {/* Contract Review and Approval */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contract Review and Approval</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "SPM Review Date",
                    <DatePicker
                      value={formData.spm_review_date}
                      onChange={(date) => setFormData((prev) => ({ ...prev, spm_review_date: date }))}
                    />,
                  )}

                  {renderField(
                    "SPM Approval Status",
                    <Select
                      value={formData.spm_approval_status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, spm_approval_status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {APPROVAL_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>,
                  )}

                  {renderField(
                    "PX Review Date",
                    <DatePicker
                      value={formData.px_review_date}
                      onChange={(date) => setFormData((prev) => ({ ...prev, px_review_date: date }))}
                    />,
                  )}

                  {renderField(
                    "PX Approval Status",
                    <Select
                      value={formData.px_approval_status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, px_approval_status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {APPROVAL_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>,
                  )}
                </div>
              </div>

              <Separator />

              {/* Contract Execution */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contract Execution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "Contract Award Date",
                    <DatePicker
                      value={formData.contract_date}
                      onChange={(date) => setFormData((prev) => ({ ...prev, contract_date: date }))}
                    />,
                  )}

                  {renderField(
                    "LOI Sent Date",
                    <DatePicker
                      value={formData.loi_sent_date}
                      onChange={(date) => setFormData((prev) => ({ ...prev, loi_sent_date: date }))}
                    />,
                  )}

                  {renderField(
                    "LOI Returned Date",
                    <DatePicker
                      value={formData.loi_returned_date}
                      onChange={(date) => setFormData((prev) => ({ ...prev, loi_returned_date: date }))}
                    />,
                  )}

                  {renderField(
                    "Subcontract Agreement Sent",
                    <DatePicker
                      value={formData.subcontract_agreement_sent_date}
                      onChange={(date) => setFormData((prev) => ({ ...prev, subcontract_agreement_sent_date: date }))}
                    />,
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subcontract-checklist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subcontract Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {[
                    { key: "contract_status", label: "Contract" },
                    { key: "schedule_a_status", label: "Schedule A (General Conditions)" },
                    { key: "schedule_b_status", label: "Schedule B (Scope of Work)" },
                    { key: "exhibit_a_status", label: "Exhibit A (Drawings)" },
                    { key: "exhibit_b_status", label: "Exhibit B (Project Schedule)" },
                    { key: "exhibit_i_status", label: "Exhibit I (OCIP Addendum)" },
                    { key: "labor_rates_status", label: "Labor Rates" },
                    { key: "unit_rates_status", label: "Unit Rates" },
                    { key: "exhibits_status", label: "Exhibits" },
                    { key: "schedule_of_values_status", label: "Schedule of Values" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="text-sm font-medium flex-1">{label}</Label>
                      <div className="w-32">
                        <Select
                          value={formData[key as keyof typeof formData] as string}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, [key]: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="N">Not Started</SelectItem>
                            <SelectItem value="P">In Progress</SelectItem>
                            <SelectItem value="C">Complete</SelectItem>
                            <SelectItem value="NA">N/A</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {[
                    { key: "p_and_p_bond_status", label: "P&P Bond" },
                    { key: "w_9_status", label: "W-9" },
                    { key: "license_status", label: "License" },
                    { key: "insurance_general_liability_status", label: "Insurance - General Liability" },
                    { key: "insurance_auto_status", label: "Insurance - Auto" },
                    { key: "insurance_umbrella_liability_status", label: "Insurance - Umbrella Liability" },
                    { key: "insurance_workers_comp_status", label: "Insurance - Workers Comp" },
                    { key: "special_requirements_status", label: "Special Requirements (See Reverse)" },
                    { key: "compliance_manager_status", label: "Compliance Manager (approved compliance)" },
                    { key: "scanned_returned_status", label: "Scanned & Returned to Sub" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="text-sm font-medium flex-1">{label}</Label>
                      <div className="w-32">
                        <Select
                          value={formData[key as keyof typeof formData] as string}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, [key]: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="N">Not Started</SelectItem>
                            <SelectItem value="P">In Progress</SelectItem>
                            <SelectItem value="C">Complete</SelectItem>
                            <SelectItem value="NA">N/A</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Project Roles */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Project Roles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "PX (Project Executive)",
                    <Input
                      value={formData.px}
                      onChange={(e) => setFormData((prev) => ({ ...prev, px: e.target.value }))}
                      placeholder="Project Executive Name"
                    />,
                  )}

                  {renderField(
                    "PM (Project Manager)",
                    <Input
                      value={formData.pm}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pm: e.target.value }))}
                      placeholder="Project Manager Name"
                    />,
                  )}

                  {renderField(
                    "PA (Project Administrator)",
                    <Input
                      value={formData.pa}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pa: e.target.value }))}
                      placeholder="Project Administrator Name"
                    />,
                  )}

                  {renderField(
                    "Compliance Manager",
                    <Input
                      value={formData.compliance_manager}
                      onChange={(e) => setFormData((prev) => ({ ...prev, compliance_manager: e.target.value }))}
                      placeholder="Compliance Manager Name"
                    />,
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Additional Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Notes / Comments</h3>
                <Textarea
                  value={formData.additional_notes_comments || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, additional_notes_comments: e.target.value }))}
                  placeholder="Add additional notes or comments..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance-waiver" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Waiver</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Insurance Waiver */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Insurance Waiver</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "Insurance Explanation",
                    <Textarea
                      value={formData.insurance_explanation}
                      onChange={(e) => setFormData((prev) => ({ ...prev, insurance_explanation: e.target.value }))}
                      placeholder="Explain insurance waiver requirements..."
                    />,
                  )}

                  {renderField(
                    "Risk Justification",
                    <Textarea
                      value={formData.insurance_risk_justification}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, insurance_risk_justification: e.target.value }))
                      }
                      placeholder="Justify the risk..."
                    />,
                  )}
                </div>
              </div>

              <Separator />

              {/* Licensing Waiver */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Licensing Waiver</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "Licensing Risk Justification",
                    <Textarea
                      value={formData.licensing_risk_justification}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, licensing_risk_justification: e.target.value }))
                      }
                      placeholder="Justify licensing risk..."
                    />,
                  )}

                  {renderField(
                    "Risk Reduction Actions",
                    <Textarea
                      value={formData.licensing_risk_reduction_actions}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, licensing_risk_reduction_actions: e.target.value }))
                      }
                      placeholder="Describe risk reduction actions..."
                    />,
                  )}
                </div>
              </div>

              <Separator />

              {/* Approval */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Approval</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "Project Executive",
                    <Input
                      value={formData.project_executive}
                      onChange={(e) => setFormData((prev) => ({ ...prev, project_executive: e.target.value }))}
                      placeholder="Project Executive Name"
                    />,
                  )}

                  {renderField(
                    "Project Executive Date",
                    <DatePicker
                      value={formData.project_executive_date}
                      onChange={(date) => setFormData((prev) => ({ ...prev, project_executive_date: date }))}
                    />,
                  )}

                  {renderField(
                    "CFO",
                    <Input
                      value={formData.cfo}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cfo: e.target.value }))}
                      placeholder="CFO Name"
                    />,
                  )}

                  {renderField(
                    "CFO Date",
                    <DatePicker
                      value={formData.cfo_date}
                      onChange={(date) => setFormData((prev) => ({ ...prev, cfo_date: date }))}
                    />,
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-gray-500 py-8">
                  <p>No history records available</p>
                  <p className="text-sm">History will be tracked as changes are made to this buyout record</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
