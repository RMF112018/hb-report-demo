"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Save, 
  Send, 
  Download, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle,
  Calculator,
  Calendar,
  FileText,
  Building
} from "lucide-react"
import type { AiaPayApplication, AiaLineItem } from "@/types/aia-pay-application"

interface AiaPayApplicationFormProps {
  application?: AiaPayApplication | null
  projectId: string
  onSave: (application: AiaPayApplication) => void
  onCancel: () => void
}

export function AiaPayApplicationForm({ application, projectId, onSave, onCancel }: AiaPayApplicationFormProps) {
  const [formData, setFormData] = useState<Partial<AiaPayApplication>>({})
  const [lineItems, setLineItems] = useState<AiaLineItem[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isDraft, setIsDraft] = useState(true)

  useEffect(() => {
    if (application) {
      setFormData(application)
      setLineItems(application.lineItems || [])
      setIsDraft(application.status === "draft")
    } else {
      // Initialize new application
      const newApp: Partial<AiaPayApplication> = {
        projectId,
        projectName: "Downtown Mixed-Use Development", // This would come from project context
        contractorName: "Summit Construction LLC",
        architectName: "Richardson Architecture Group",
        ownerName: "Metro Development Partners",
        contractSum: 18500000,
        changeOrdersApproved: 0,
        retentionPercentage: 5.0,
        status: "draft",
        periodStartDate: new Date().toISOString().split('T')[0],
        periodEndDate: new Date().toISOString().split('T')[0],
        applicationDate: new Date().toISOString().split('T')[0]
      }
      setFormData(newApp)
      loadLineItemsFromProcore()
    }
  }, [application, projectId])

  const loadLineItemsFromProcore = async () => {
    // Simulate loading line items from Procore API
    setIsLoading(true)
    try {
      // Mock data that would come from Procore
      const mockLineItems: AiaLineItem[] = [
        {
          id: "li_new_001",
          costCode: "03100",
          description: "Cast-in-Place Concrete - Foundations",
          scheduledValue: 2450000,
          workCompletedPrevious: 2450000,
          workCompletedThisPeriod: 0,
          workCompletedToDate: 2450000,
          materialsStoredPrevious: 0,
          materialsStoredThisPeriod: 0,
          materialsStoredToDate: 0,
          totalCompleted: 2450000,
          percentComplete: 100.0,
          balanceToFinish: 0,
          retentionAmount: 122500,
          procoreData: {
            budgetCode: "03100",
            committedCost: 2450000,
            lastSync: new Date().toISOString()
          },
          annotations: [],
          hasDiscrepancy: false
        },
        {
          id: "li_new_002",
          costCode: "05120",
          description: "Structural Steel - Building Frame",
          scheduledValue: 3850000,
          workCompletedPrevious: 2695000,
          workCompletedThisPeriod: 0,
          workCompletedToDate: 2695000,
          materialsStoredPrevious: 150000,
          materialsStoredThisPeriod: 0,
          materialsStoredToDate: 150000,
          totalCompleted: 2845000,
          percentComplete: 73.9,
          balanceToFinish: 1005000,
          retentionAmount: 142250,
          procoreData: {
            budgetCode: "05120",
            committedCost: 2845000,
            lastSync: new Date().toISOString()
          },
          annotations: [],
          hasDiscrepancy: false
        }
      ]
      setLineItems(mockLineItems)
    } catch (error) {
      console.error("Error loading line items from Procore:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotals = () => {
    const workCompletedToDate = lineItems.reduce((sum, item) => sum + item.workCompletedToDate, 0)
    const workCompletedThisPeriod = lineItems.reduce((sum, item) => sum + item.workCompletedThisPeriod, 0)
    const materialsStoredToDate = lineItems.reduce((sum, item) => sum + item.materialsStoredToDate, 0)
    const totalEarned = workCompletedToDate + materialsStoredToDate
    const retentionAmount = totalEarned * ((formData.retentionPercentage || 0) / 100)
    const revisedContractSum = (formData.contractSum || 0) + (formData.changeOrdersApproved || 0)
    const balanceToFinish = revisedContractSum - totalEarned
    const currentPaymentDue = totalEarned - retentionAmount - (formData.previousPayments || 0)

    return {
      workCompletedToDate,
      workCompletedThisPeriod,
      materialsStoredToDate,
      totalEarned,
      retentionAmount,
      revisedContractSum,
      balanceToFinish,
      currentPaymentDue,
      netAmountDue: currentPaymentDue
    }
  }

  const totals = calculateTotals()

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleLineItemChange = (itemId: string, field: string, value: number) => {
    setLineItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            [field]: value,
            workCompletedToDate: field === "workCompletedThisPeriod" 
              ? item.workCompletedPrevious + value 
              : item.workCompletedToDate,
            totalCompleted: field === "workCompletedThisPeriod" || field === "materialsStoredThisPeriod"
              ? (item.workCompletedPrevious + (field === "workCompletedThisPeriod" ? value : item.workCompletedThisPeriod)) + 
                (item.materialsStoredPrevious + (field === "materialsStoredThisPeriod" ? value : item.materialsStoredThisPeriod))
              : item.totalCompleted,
            percentComplete: item.scheduledValue > 0 
              ? ((item.workCompletedPrevious + (field === "workCompletedThisPeriod" ? value : item.workCompletedThisPeriod)) / item.scheduledValue) * 100
              : 0,
            balanceToFinish: item.scheduledValue - (item.workCompletedPrevious + (field === "workCompletedThisPeriod" ? value : item.workCompletedThisPeriod))
          }
        : item
    ))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.applicationNumber) newErrors.applicationNumber = "Application number is required"
    if (!formData.periodEndDate) newErrors.periodEndDate = "Period end date is required"
    if (!formData.contractSum || formData.contractSum <= 0) newErrors.contractSum = "Valid contract sum is required"

    // Validate line items
    const hasWorkThisPeriod = lineItems.some(item => item.workCompletedThisPeriod > 0 || item.materialsStoredThisPeriod > 0)
    if (!hasWorkThisPeriod && !isDraft) {
      newErrors.lineItems = "At least one line item must have work completed this period"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (submit = false) => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const applicationData: AiaPayApplication = {
        ...formData,
        ...totals,
        lineItems,
        status: submit ? "submitted" : "draft",
        submittedDate: submit ? new Date().toISOString() : undefined,
        lastModifiedDate: new Date().toISOString(),
        version: (formData.version || 0) + 1
      } as AiaPayApplication

      onSave(applicationData)
    } catch (error) {
      console.error("Error saving application:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {application ? `Edit Application #${application.applicationNumber}` : "New Pay Application"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="applicationNumber" className="text-sm font-medium text-foreground">Application Number</Label>
              <Input
                id="applicationNumber"
                type="number"
                value={formData.applicationNumber || ""}
                onChange={(e) => handleInputChange("applicationNumber", parseInt(e.target.value))}
                placeholder="Auto-generated"
                className={`${errors.applicationNumber ? "border-destructive focus:ring-destructive" : "border-input focus:ring-ring"} bg-background text-foreground`}
              />
              {errors.applicationNumber && (
                <p className="text-sm text-destructive mt-1">{errors.applicationNumber}</p>
              )}
            </div>

            <div>
              <Label htmlFor="periodEndDate" className="text-sm font-medium text-foreground">Period Ending</Label>
              <Input
                id="periodEndDate"
                type="date"
                value={formData.periodEndDate || ""}
                onChange={(e) => handleInputChange("periodEndDate", e.target.value)}
                className={`${errors.periodEndDate ? "border-destructive focus:ring-destructive" : "border-input focus:ring-ring"} bg-background text-foreground`}
              />
              {errors.periodEndDate && (
                <p className="text-sm text-destructive mt-1">{errors.periodEndDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="applicationDate" className="text-sm font-medium text-foreground">Application Date</Label>
              <Input
                id="applicationDate"
                type="date"
                value={formData.applicationDate || ""}
                onChange={(e) => handleInputChange("applicationDate", e.target.value)}
                className="bg-background text-foreground border-input focus:ring-ring"
              />
            </div>

            <div>
              <Label htmlFor="contractSum" className="text-sm font-medium text-foreground">Original Contract Sum</Label>
              <Input
                id="contractSum"
                type="number"
                value={formData.contractSum || ""}
                onChange={(e) => handleInputChange("contractSum", parseFloat(e.target.value))}
                className={`${errors.contractSum ? "border-destructive focus:ring-destructive" : "border-input focus:ring-ring"} bg-background text-foreground`}
              />
              {errors.contractSum && (
                <p className="text-sm text-destructive mt-1">{errors.contractSum}</p>
              )}
            </div>

            <div>
              <Label htmlFor="changeOrders" className="text-sm font-medium text-foreground">Change Orders Approved</Label>
              <Input
                id="changeOrders"
                type="number"
                value={formData.changeOrdersApproved || 0}
                onChange={(e) => handleInputChange("changeOrdersApproved", parseFloat(e.target.value))}
                className="bg-background text-foreground border-input focus:ring-ring"
              />
            </div>

            <div>
              <Label htmlFor="retention" className="text-sm font-medium text-foreground">Retention %</Label>
              <Input
                id="retention"
                type="number"
                step="0.1"
                value={formData.retentionPercentage || 5.0}
                onChange={(e) => handleInputChange("retentionPercentage", parseFloat(e.target.value))}
                className="bg-background text-foreground border-input focus:ring-ring"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Line Items (G703)
            </CardTitle>
            <Button onClick={loadLineItemsFromProcore} variant="outline" size="sm" disabled={isLoading}>
              Sync from Procore
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {errors.lineItems && (
            <Alert className="mb-4 border-destructive">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">{errors.lineItems}</AlertDescription>
            </Alert>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground">Cost Code</TableHead>
                  <TableHead className="text-foreground">Description</TableHead>
                  <TableHead className="text-right text-foreground">Scheduled Value</TableHead>
                  <TableHead className="text-right text-foreground">Work Complete Previous</TableHead>
                  <TableHead className="text-right text-foreground">Work Complete This Period</TableHead>
                  <TableHead className="text-right text-foreground">Work Complete to Date</TableHead>
                  <TableHead className="text-right text-foreground">Materials Stored</TableHead>
                  <TableHead className="text-right text-foreground">Total Completed</TableHead>
                  <TableHead className="text-right text-foreground">% Complete</TableHead>
                  <TableHead className="text-right text-foreground">Balance to Finish</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item) => (
                  <TableRow key={item.id} className="border-border">
                    <TableCell className="font-mono text-foreground">{item.costCode}</TableCell>
                    <TableCell className="max-w-xs text-foreground">
                      <div className="truncate" title={item.description}>
                        {item.description}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-foreground">{formatCurrency(item.scheduledValue)}</TableCell>
                    <TableCell className="text-right text-foreground">{formatCurrency(item.workCompletedPrevious)}</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={item.workCompletedThisPeriod}
                        onChange={(e) => handleLineItemChange(item.id, "workCompletedThisPeriod", parseFloat(e.target.value) || 0)}
                        className="w-24 text-right bg-background text-foreground border-input focus:ring-ring"
                        min="0"
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">{formatCurrency(item.workCompletedToDate)}</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={item.materialsStoredThisPeriod}
                        onChange={(e) => handleLineItemChange(item.id, "materialsStoredThisPeriod", parseFloat(e.target.value) || 0)}
                        className="w-24 text-right bg-background text-foreground border-input focus:ring-ring"
                        min="0"
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">{formatCurrency(item.totalCompleted)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={item.percentComplete === 100 ? "default" : "secondary"}>
                        {item.percentComplete.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-foreground">{formatCurrency(item.balanceToFinish)}</TableCell>
                  </TableRow>
                ))}
                
                {/* Totals Row */}
                <TableRow className="border-t-2 border-primary/20 bg-muted/50">
                  <TableCell colSpan={3} className="font-bold text-foreground">TOTALS</TableCell>
                  <TableCell className="text-right font-bold text-foreground">{formatCurrency(totals.workCompletedToDate - totals.workCompletedThisPeriod)}</TableCell>
                  <TableCell className="text-right font-bold text-foreground">{formatCurrency(totals.workCompletedThisPeriod)}</TableCell>
                  <TableCell className="text-right font-bold text-foreground">{formatCurrency(totals.workCompletedToDate)}</TableCell>
                  <TableCell className="text-right font-bold text-foreground">{formatCurrency(totals.materialsStoredToDate)}</TableCell>
                  <TableCell className="text-right font-bold text-foreground">{formatCurrency(totals.totalEarned)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default">
                      {totals.revisedContractSum > 0 ? ((totals.totalEarned / totals.revisedContractSum) * 100).toFixed(1) : 0}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-foreground">{formatCurrency(totals.balanceToFinish)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Payment Summary (G702)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-foreground">Original Contract Sum:</span>
                <span className="font-medium text-foreground">{formatCurrency(formData.contractSum || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Change Orders Approved:</span>
                <span className="font-medium text-foreground">{formatCurrency(formData.changeOrdersApproved || 0)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-medium text-foreground">Revised Contract Sum:</span>
                <span className="font-bold text-foreground">{formatCurrency(totals.revisedContractSum)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Total Earned to Date:</span>
                <span className="font-medium text-foreground">{formatCurrency(totals.totalEarned)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Retention ({formData.retentionPercentage}%):</span>
                <span className="font-medium text-destructive">-{formatCurrency(totals.retentionAmount)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-foreground">Previous Payments:</span>
                <span className="font-medium text-foreground">{formatCurrency(formData.previousPayments || 0)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-medium text-foreground">Current Payment Due:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(totals.currentPaymentDue)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-bold text-lg text-foreground">Net Amount Due:</span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">{formatCurrency(totals.netAmountDue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Balance to Finish:</span>
                <span className="font-medium text-foreground">{formatCurrency(totals.balanceToFinish)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>

          <Button
            onClick={() => handleSave(true)}
            disabled={isLoading || totals.netAmountDue <= 0}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit for Approval
          </Button>
        </div>
      </div>
    </div>
  )
} 