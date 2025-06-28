"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  FileText,
  DollarSign,
  TrendingUp,
  Eye,
  Send,
  Shield,
} from "lucide-react"
import type { RFP } from "@/types/estimating"
import type { CostCategory, ApprovalStep } from "./estimating-context"

/**
 * @fileoverview CostSummaryContent Component
 *
 * This component displays the detailed cost summary, including cost breakdown,
 * approval workflow, project metrics, and actions for previewing, exporting,
 * and submitting the bid. It is a presentational component that receives all
 * necessary data and callbacks via props.
 *
 * @version 1.0.0
 * @author HB Report Development Team
 * @since 2025-06-17
 *
 * @interface CostSummaryContentProps
 * @property {RFP | null} selectedRFP - The currently selected Request for Proposal.
 * @property {CostCategory[]} costCategories - Array of cost categories with their amounts and statuses.
 * @property {ApprovalStep[]} approvalSteps - Array of approval steps with their statuses.
 * @property {number} subtotal - The calculated subtotal of all cost categories.
 * @property {number} overhead - The calculated overhead amount.
 * @property {number} profit - The calculated profit amount.
 * @property {number} contingency - The calculated contingency amount.
 * @property {number} totalBid - The final calculated total bid amount.
 * @property {number} approvalProgress - The percentage of approval steps completed.
 * @property {(stepId: string, action: "approve" | "reject") => void} onApprovalStep - Callback for approving or rejecting an approval step.
 * @property {() => Promise<void>} onExportPDF - Callback for exporting the bid summary as a PDF.
 * @property {boolean} isExporting - Flag indicating if the PDF export is in progress.
 * @property {boolean} isSubmitting - Flag indicating if the bid submission is in progress.
 * @property {() => void} onShowPreview - Callback to show the bid package preview dialog.
 * @property {boolean} showPreview - Flag indicating if the preview dialog is open.
 * @property {(show: boolean) => void} onSetShowPreview - Callback to set the preview dialog visibility.
 * @property {boolean} isBidApproved - Flag indicating if all approval steps are complete.
 */
interface CostSummaryContentProps {
  selectedRFP: RFP | null
  costCategories: CostCategory[]
  approvalSteps: ApprovalStep[]
  subtotal: number
  overhead: number
  profit: number
  contingency: number
  totalBid: number
  approvalProgress: number
  onApprovalStep: (stepId: string, action: "approve" | "reject") => void
  onExportPDF: () => Promise<void>
  isExporting: boolean
  isSubmitting: boolean
  onShowPreview: () => void
  showPreview: boolean
  onSetShowPreview: (show: boolean) => void
  isBidApproved: boolean
}

export function CostSummaryContent({
  selectedRFP,
  costCategories,
  approvalSteps,
  subtotal,
  overhead,
  profit,
  contingency,
  totalBid,
  approvalProgress,
  onApprovalStep,
  onExportPDF,
  isExporting,
  isSubmitting,
  onShowPreview,
  showPreview,
  onSetShowPreview,
  isBidApproved,
}: CostSummaryContentProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "skipped":
        return <AlertCircle className="h-4 w-4 text-gray-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-green-100 text-green-800">Complete</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (!selectedRFP) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
          <p className="text-gray-500">Please select an RFP to view cost summary.</p>
        </div>
      </div>
    )
  }

  const completedStepsCount = approvalSteps.filter((step) => step.status === "complete").length

  return (
    <div className="space-y-6" data-tour="cost-summary">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cost Summary</h2>
          <p className="text-gray-600">Final cost breakdown and approval workflow</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Approval Progress</div>
            <div className="flex items-center space-x-2">
              <Progress value={approvalProgress} className="w-24" />
              <span className="text-sm font-medium">{Math.round(approvalProgress)}%</span>
            </div>
          </div>
          <Badge variant="outline" className="px-3 py-1 text-lg">
            <DollarSign className="h-4 w-4 mr-1" />
            {totalBid.toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {costCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      {getStatusBadge(category.status)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {category.items} items • Updated {category.lastUpdated.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-semibold text-lg">${category.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Overhead (10%)</span>
                  <span>${overhead.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Profit (8%)</span>
                  <span>${profit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Contingency (5%)</span>
                  <span>${contingency.toLocaleString()}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold text-green-600">
                  <span>Total Bid Amount</span>
                  <span>${totalBid.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Workflow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Approval Workflow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvalSteps.map((step, index) => (
                <div key={step.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">{getStatusIcon(step.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{step.title}</h4>
                      {step.status === "pending" && index === completedStepsCount && (
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => onApprovalStep(step.id, "approve")}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => onApprovalStep(step.id, "reject")}>
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    {step.completedBy && (
                      <div className="text-xs text-gray-500 mt-2">
                        Completed by {step.completedBy} on {step.completedAt?.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isBidApproved && (
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>All approvals complete! Ready for bid submission.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Project Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Project Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${(totalBid / (selectedRFP.grossSF || 75000)).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Cost per Gross SF</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${(totalBid / (selectedRFP.netSF || 65000)).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Cost per Net SF</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {(((overhead + profit + contingency) / subtotal) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Markup Percentage</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{selectedRFP.duration || 14}</div>
              <div className="text-sm text-gray-600">Months Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Export & Submit</h3>
              <p className="text-sm text-gray-600 mt-1">Generate final bid package and submit proposal</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onShowPreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" onClick={onExportPDF} disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
              <Button disabled={!isBidApproved || isSubmitting} className="bg-green-600 hover:bg-green-700">
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Bid"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={onSetShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bid Package Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Project Header */}
            <div className="text-center border-b pb-4">
              <h1 className="text-2xl font-bold">{selectedRFP.projectName}</h1>
              <p className="text-gray-600">
                {selectedRFP.client} • {selectedRFP.location}
              </p>
              <p className="text-sm text-gray-500">Bid Due: {selectedRFP.dueDate.toLocaleDateString()}</p>
            </div>

            {/* Cost Summary Table */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Cost Summary</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell className="text-right">${category.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-medium">Subtotal</TableCell>
                    <TableCell className="text-right font-medium">${subtotal.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Overhead (10%)</TableCell>
                    <TableCell className="text-right">${overhead.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Profit (8%)</TableCell>
                    <TableCell className="text-right">${profit.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Contingency (5%)</TableCell>
                    <TableCell className="text-right">${contingency.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow className="border-t-2">
                    <TableCell className="font-bold text-lg">Total Bid Amount</TableCell>
                    <TableCell className="text-right font-bold text-lg text-green-600">
                      ${totalBid.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Project Metrics */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Project Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded">
                  <div className="font-medium">Cost per Gross SF</div>
                  <div className="text-xl font-bold text-blue-600">
                    ${(totalBid / (selectedRFP.grossSF || 75000)).toFixed(2)}
                  </div>
                </div>
                <div className="p-3 border rounded">
                  <div className="font-medium">Cost per Net SF</div>
                  <div className="text-xl font-bold text-green-600">
                    ${(totalBid / (selectedRFP.netSF || 65000)).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Approval History */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Approval History</h3>
              <div className="space-y-2">
                {approvalSteps
                  .filter((step) => step.status === "complete")
                  .map((step) => (
                    <div key={step.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span>{step.title}</span>
                      <span className="text-sm text-gray-600">
                        {step.completedBy} • {step.completedAt?.toLocaleDateString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
