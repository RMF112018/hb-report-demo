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
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import {
  CalendarIcon,
  Save,
  X,
  Plus,
  Trash2,
  Edit,
  Upload,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Share2,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedBuyoutFormProps {
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
const FORECAST_METHODS = ["Bell Curve", "S-Curve", "Linear", "Manual"]
const RISK_LEVELS = ["Low", "Medium", "High", "Critical"]

export function EnhancedBuyoutForm({
  projectId,
  commitmentId,
  initialData,
  onSubmit,
  onCancel,
  activeTab,
  onTabChange,
  isLoading = false,
}: EnhancedBuyoutFormProps) {
  const [formData, setFormData] = useState({
    // Basic fields
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

    // Financial fields
    budget: 0,
    contract_value: 0,
    savings_overage: 0,

    // Owner approval fields
    owner_approval_required: false,
    owner_approval_status: "",
    owner_meeting_required: false,
    owner_meeting_date: null as Date | null,
    owner_approval_date: null as Date | null,

    // Allowances
    allowance_included: false,
    total_contract_allowances: 0,
    allowance_reconciliation_total: 0,
    allowance_variance: 0,
    allowances: [] as any[],

    // Value Engineering
    ve_offered: false,
    total_ve_presented: 0,
    total_ve_accepted: 0,
    total_ve_rejected: 0,
    net_ve_savings: 0,
    veItems: [] as any[],

    // Long Lead Items
    long_lead_included: false,
    long_lead_released: false,
    leadTimes: [] as any[],

    // Comments and collaboration
    comments: "",
    commentThread: [] as any[],
    tasks: [] as any[],

    // Forecasting
    costCode: "",
    forecastMethod: "Bell Curve",
    forecastData: {
      previousForecast: 0,
      actualToDate: 0,
      remainingForecast: 0,
      estimatedCompletion: 0,
      variance: 0,
    },

    // Change Orders
    changeOrders: [] as any[],

    // Documents
    documents: [] as any[],

    // Risk Assessment
    riskLevel: "Low",
    riskAssessment: {
      financialStability: "low",
      deliveryRisk: "low",
      qualityRisk: "low",
      mitigationActions: [] as string[],
    },

    // Supplier Management
    supplierRating: 0,
    supplierNotes: "",

    // Workflow fields
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

    // Checklist fields
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

    // History tracking
    history: [] as any[],
  })

  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({})
  const [newComment, setNewComment] = useState("")
  const [newTask, setNewTask] = useState({ title: "", assignee: "", dueDate: null as Date | null })
  const [showTemplates, setShowTemplates] = useState(false)

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
      // Add history entry
      const historyEntry = {
        id: Date.now(),
        user: "Current User", // Would come from auth context
        timestamp: new Date(),
        action: initialData ? "Updated" : "Created",
        changes: "Buyout record modified",
      }

      const submitData = {
        ...formData,
        history: [...formData.history, historyEntry],
      }

      await onSubmit(submitData)
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

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: "Current User",
        timestamp: new Date(),
        content: newComment,
        mentions: [],
      }
      setFormData((prev) => ({
        ...prev,
        commentThread: [...prev.commentThread, comment],
      }))
      setNewComment("")
    }
  }

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        title: newTask.title,
        assignee: newTask.assignee,
        dueDate: newTask.dueDate,
        status: "pending",
        createdBy: "Current User",
        createdAt: new Date(),
      }
      setFormData((prev) => ({
        ...prev,
        tasks: [...prev.tasks, task],
      }))
      setNewTask({ title: "", assignee: "", dueDate: null })
    }
  }

  const addChangeOrder = () => {
    const changeOrder = {
      id: `CO-${Date.now()}`,
      amount: 0,
      status: "Draft",
      description: "",
      createdDate: new Date(),
    }
    setFormData((prev) => ({
      ...prev,
      changeOrders: [...prev.changeOrders, changeOrder],
    }))
  }

  const addDocument = () => {
    // In real implementation, this would open a file picker
    const document = {
      id: `DOC-${Date.now()}`,
      name: "New Document.pdf",
      type: "contract",
      uploadDate: new Date(),
      size: "1.2 MB",
    }
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, document],
    }))
  }

  const calculateChecklistCompletion = () => {
    const checklistFields = [
      "contract_status",
      "schedule_a_status",
      "schedule_b_status",
      "exhibit_a_status",
      "exhibit_b_status",
      "exhibit_i_status",
      "labor_rates_status",
      "unit_rates_status",
      "exhibits_status",
      "schedule_of_values_status",
      "p_and_p_bond_status",
      "w_9_status",
      "license_status",
      "insurance_general_liability_status",
      "insurance_auto_status",
      "insurance_umbrella_liability_status",
      "insurance_workers_comp_status",
      "special_requirements_status",
      "compliance_manager_status",
      "scanned_returned_status",
    ]

    const completed = checklistFields.filter((field) => formData[field as keyof typeof formData] === "C").length
    return (completed / checklistFields.length) * 100
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
          className={cn("w-full justify-start text-left font-normal text-xs", !value && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-3 w-3" />
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
      <Label className="text-xs font-medium">{label}</Label>
      {isEditing ? children : <div className="text-xs text-gray-600">View only</div>}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Form Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowTemplates(!showTemplates)}>
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button variant="outline" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Templates Panel */}
      {showTemplates && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-sm">Quick Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" size="sm" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Standard Subcontract
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Material Supply
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Equipment Rental
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span>Checklist Completion</span>
              <span>{calculateChecklistCompletion().toFixed(0)}%</span>
            </div>
            <Progress value={calculateChecklistCompletion()} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Tasks: {formData.tasks.filter((t) => t.status === "completed").length}/{formData.tasks.length}
              </span>
              <span>Documents: {formData.documents.length}</span>
              <span>Change Orders: {formData.changeOrders.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="buyout-details" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            Details
          </TabsTrigger>
          <TabsTrigger value="forecasting" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            Forecasting
          </TabsTrigger>
          <TabsTrigger value="contract-workflow" className="text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="subcontract-checklist" className="text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Checklist
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            Collaboration
          </TabsTrigger>
          <TabsTrigger value="compliance-waiver" className="text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buyout-details" className="space-y-6">
          {/* General Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">General Information</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("general")}>
                <Edit className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderField(
                  "Contract #",
                  <Input
                    value={formData.number}
                    onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
                    placeholder="1699901-001"
                    className="text-xs"
                  />,
                  editingSections.general,
                )}

                {renderField(
                  "Cost Code",
                  <Input
                    value={formData.costCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, costCode: e.target.value }))}
                    placeholder="15-02-010"
                    className="text-xs"
                  />,
                  editingSections.general,
                )}

                {renderField(
                  "Status",
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="text-xs">
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
                    className="text-xs"
                  />,
                  editingSections.general,
                )}

                {renderField(
                  "Title",
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Structural Shell"
                    className="text-xs"
                  />,
                  editingSections.general,
                )}

                {renderField(
                  "BIC",
                  <Select
                    value={formData.bic}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, bic: value }))}
                  >
                    <SelectTrigger className="text-xs">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField(
                  "Start Date",
                  <DatePicker
                    value={formData.contract_start_date}
                    onChange={(date) => setFormData((prev) => ({ ...prev, contract_start_date: date }))}
                    placeholder="Start Date"
                  />,
                  editingSections.general,
                )}

                {renderField(
                  "Estimated Completion",
                  <DatePicker
                    value={formData.contract_estimated_completion_date}
                    onChange={(date) => setFormData((prev) => ({ ...prev, contract_estimated_completion_date: date }))}
                    placeholder="Completion Date"
                  />,
                  editingSections.general,
                )}
              </div>
            </CardContent>
          </Card>

          {/* Financials */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Financials</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("financials")}>
                <Edit className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderField(
                  "Budget",
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, budget: Number.parseFloat(e.target.value) || 0 }))
                    }
                    className="text-xs"
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
                    className="text-xs"
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
                    className="text-xs"
                  />,
                  editingSections.financials,
                )}
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Risk Assessment</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("risk")}>
                <Edit className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField(
                  "Overall Risk Level",
                  <Select
                    value={formData.riskLevel}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, riskLevel: value }))}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RISK_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>,
                  editingSections.risk,
                )}

                {renderField(
                  "Supplier Rating",
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.supplierRating}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, supplierRating: Number.parseFloat(e.target.value) || 0 }))
                    }
                    className="text-xs"
                  />,
                  editingSections.risk,
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderField(
                  "Financial Stability",
                  <Select
                    value={formData.riskAssessment.financialStability}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        riskAssessment: { ...prev.riskAssessment, financialStability: value },
                      }))
                    }
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>,
                  editingSections.risk,
                )}

                {renderField(
                  "Delivery Risk",
                  <Select
                    value={formData.riskAssessment.deliveryRisk}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        riskAssessment: { ...prev.riskAssessment, deliveryRisk: value },
                      }))
                    }
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>,
                  editingSections.risk,
                )}

                {renderField(
                  "Quality Risk",
                  <Select
                    value={formData.riskAssessment.qualityRisk}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        riskAssessment: { ...prev.riskAssessment, qualityRisk: value },
                      }))
                    }
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>,
                  editingSections.risk,
                )}
              </div>
            </CardContent>
          </Card>

          {/* Change Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Change Orders</CardTitle>
              <Button variant="ghost" size="sm" onClick={addChangeOrder}>
                <Plus className="h-3 w-3 mr-1" />
                Add CO
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.changeOrders.map((co, index) => (
                  <div key={co.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Input
                      placeholder="CO Number"
                      value={co.id}
                      className="w-32 text-xs"
                      onChange={(e) => {
                        const newCOs = [...formData.changeOrders]
                        newCOs[index].id = e.target.value
                        setFormData((prev) => ({ ...prev, changeOrders: newCOs }))
                      }}
                    />
                    <Input
                      placeholder="Description"
                      value={co.description}
                      className="flex-1 text-xs"
                      onChange={(e) => {
                        const newCOs = [...formData.changeOrders]
                        newCOs[index].description = e.target.value
                        setFormData((prev) => ({ ...prev, changeOrders: newCOs }))
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={co.amount}
                      className="w-32 text-xs"
                      onChange={(e) => {
                        const newCOs = [...formData.changeOrders]
                        newCOs[index].amount = Number.parseFloat(e.target.value) || 0
                        setFormData((prev) => ({ ...prev, changeOrders: newCOs }))
                      }}
                    />
                    <Select
                      value={co.status}
                      onValueChange={(value) => {
                        const newCOs = [...formData.changeOrders]
                        newCOs[index].status = value
                        setFormData((prev) => ({ ...prev, changeOrders: newCOs }))
                      }}
                    >
                      <SelectTrigger className="w-32 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newCOs = formData.changeOrders.filter((_, i) => i !== index)
                        setFormData((prev) => ({ ...prev, changeOrders: newCOs }))
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {formData.changeOrders.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-xs">No change orders yet</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Documents</CardTitle>
              <Button variant="ghost" size="sm" onClick={addDocument}>
                <Upload className="h-3 w-3 mr-1" />
                Upload
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-xs font-medium">{doc.name}</div>
                      <div className="text-xs text-gray-500">
                        {doc.type} • {doc.size} • {new Date(doc.uploadDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {formData.documents.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-xs">No documents uploaded yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Cost Forecasting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField(
                  "Forecast Method",
                  <Select
                    value={formData.forecastMethod}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, forecastMethod: value }))}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FORECAST_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>,
                )}

                {renderField(
                  "Cost Code",
                  <Input
                    value={formData.costCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, costCode: e.target.value }))}
                    placeholder="15-02-010"
                    className="text-xs"
                  />,
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Forecast Data</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-blue-600">Previous Period Forecast</div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-700">
                        ${formData.forecastData.previousForecast.toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-600">Last period's estimate</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-medium text-green-600">Actual / Remaining</div>
                    <div className="space-y-2">
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-sm font-bold text-green-700">
                          ${formData.forecastData.actualToDate.toLocaleString()}
                        </div>
                        <div className="text-xs text-green-600">Actual to date</div>
                      </div>
                      <div className="p-2 bg-yellow-50 rounded">
                        <div className="text-sm font-bold text-yellow-700">
                          ${formData.forecastData.remainingForecast.toLocaleString()}
                        </div>
                        <div className="text-xs text-yellow-600">Remaining forecast</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-700">
                      ${formData.forecastData.estimatedCompletion.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Estimated at completion</div>
                  </div>

                  <div className="p-3 bg-red-50 rounded-lg">
                    <div
                      className={`text-lg font-bold ${formData.forecastData.variance >= 0 ? "text-red-700" : "text-green-700"}`}
                    >
                      {formData.forecastData.variance >= 0 ? "+" : ""}${formData.forecastData.variance.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Variance from budget</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Comments & Discussion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {formData.commentThread.map((comment) => (
                  <div key={comment.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs font-medium">{comment.user}</div>
                      <div className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="text-xs text-gray-700">{comment.content}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment... Use @username to mention team members"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="text-xs"
                  rows={3}
                />
                <Button size="sm" onClick={addComment} disabled={!newComment.trim()}>
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tasks & Assignments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {formData.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Checkbox checked={task.status === "completed"} />
                    <div className="flex-1">
                      <div className="text-xs font-medium">{task.title}</div>
                      <div className="text-xs text-gray-500">
                        Assigned to: {task.assignee} • Due:{" "}
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                      </div>
                    </div>
                    <Badge
                      variant={
                        task.status === "overdue"
                          ? "destructive"
                          : task.status === "completed"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
                <div className="text-xs font-medium">Add New Task</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                    className="text-xs"
                  />
                  <Select
                    value={newTask.assignee}
                    onValueChange={(value) => setNewTask((prev) => ({ ...prev, assignee: value }))}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Assign to" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pm">Project Manager</SelectItem>
                      <SelectItem value="px">Project Executive</SelectItem>
                      <SelectItem value="pa">Project Administrator</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                  <DatePicker
                    value={newTask.dueDate}
                    onChange={(date) => setNewTask((prev) => ({ ...prev, dueDate: date }))}
                    placeholder="Due date"
                  />
                </div>
                <Button size="sm" onClick={addTask} disabled={!newTask.title.trim()}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contract-workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Contract Workflow Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scope Review Meeting */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Scope Review Meeting</h3>
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
                <h3 className="text-sm font-medium">Contract Review and Approval</h3>
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
                      <SelectTrigger className="text-xs">
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
                      <SelectTrigger className="text-xs">
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
                <h3 className="text-sm font-medium">Contract Execution</h3>
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
              <CardTitle className="text-sm">Subcontract Checklist</CardTitle>
              <div className="flex items-center gap-2">
                <Progress value={calculateChecklistCompletion()} className="flex-1 h-2" />
                <span className="text-xs text-gray-600">{calculateChecklistCompletion().toFixed(0)}% Complete</span>
              </div>
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
                      <Label className="text-xs font-medium flex-1">{label}</Label>
                      <div className="w-32">
                        <Select
                          value={formData[key as keyof typeof formData] as string}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, [key]: value }))}
                        >
                          <SelectTrigger className="text-xs">
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
                    { key: "special_requirements_status", label: "Special Requirements" },
                    { key: "compliance_manager_status", label: "Compliance Manager" },
                    { key: "scanned_returned_status", label: "Scanned & Returned to Sub" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="text-xs font-medium flex-1">{label}</Label>
                      <div className="w-32">
                        <Select
                          value={formData[key as keyof typeof formData] as string}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, [key]: value }))}
                        >
                          <SelectTrigger className="text-xs">
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
                <h3 className="text-sm font-medium">Project Roles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "PX (Project Executive)",
                    <Input
                      value={formData.px}
                      onChange={(e) => setFormData((prev) => ({ ...prev, px: e.target.value }))}
                      placeholder="Project Executive Name"
                      className="text-xs"
                    />,
                  )}

                  {renderField(
                    "PM (Project Manager)",
                    <Input
                      value={formData.pm}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pm: e.target.value }))}
                      placeholder="Project Manager Name"
                      className="text-xs"
                    />,
                  )}

                  {renderField(
                    "PA (Project Administrator)",
                    <Input
                      value={formData.pa}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pa: e.target.value }))}
                      placeholder="Project Administrator Name"
                      className="text-xs"
                    />,
                  )}

                  {renderField(
                    "Compliance Manager",
                    <Input
                      value={formData.compliance_manager}
                      onChange={(e) => setFormData((prev) => ({ ...prev, compliance_manager: e.target.value }))}
                      placeholder="Compliance Manager Name"
                      className="text-xs"
                    />,
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance-waiver" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Compliance Waiver</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Insurance Waiver */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Insurance Waiver</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "Insurance Explanation",
                    <Textarea
                      value={formData.insurance_explanation}
                      onChange={(e) => setFormData((prev) => ({ ...prev, insurance_explanation: e.target.value }))}
                      placeholder="Explain insurance waiver requirements..."
                      className="text-xs"
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
                      className="text-xs"
                    />,
                  )}
                </div>
              </div>

              <Separator />

              {/* Licensing Waiver */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Licensing Waiver</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "Licensing Risk Justification",
                    <Textarea
                      value={formData.licensing_risk_justification}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, licensing_risk_justification: e.target.value }))
                      }
                      placeholder="Justify licensing risk..."
                      className="text-xs"
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
                      className="text-xs"
                    />,
                  )}
                </div>
              </div>

              <Separator />

              {/* Approval */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Approval</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "Project Executive",
                    <Input
                      value={formData.project_executive}
                      onChange={(e) => setFormData((prev) => ({ ...prev, project_executive: e.target.value }))}
                      placeholder="Project Executive Name"
                      className="text-xs"
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
                      className="text-xs"
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
              <CardTitle className="text-sm">Change History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.history.length > 0 ? (
                  formData.history.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="text-xs font-medium">
                            {entry.action} by {entry.user}
                          </div>
                          <div className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{entry.changes}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No history records available</p>
                    <p className="text-xs">History will be tracked as changes are made to this buyout record</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
