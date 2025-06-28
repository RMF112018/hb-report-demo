"use client"

import { useState, useEffect, useCallback } from "react"
import { CostSummaryContent } from "./cost-summary-content"
import { useEstimating } from "./estimating-context"
import { useToast } from "@/hooks/use-toast"
import type { CostCategory, ApprovalStep } from "./estimating-context"

/**
 * @fileoverview CostSummary Component
 *
 * This component acts as a wrapper for the CostSummaryContent, managing the state
 * and logic related to the cost compilation and approval process. It fetches
 * necessary data from the `EstimatingContext` and performs calculations for
 * subtotal, overhead, profit, and contingency. It also handles the approval
 * workflow and export/submission actions.
 *
 * @version 1.0.0
 * @author HB Report Development Team
 * @since 2025-06-17
 *
 * @dependencies
 * - `CostSummaryContent`: The presentational component for displaying the cost summary.
 * - `useEstimating`: Custom hook to access the global estimating state.
 * - `useToast`: Hook for displaying toast notifications.
 *
 * @state
 * - `showPreview`: boolean - Controls the visibility of the bid package preview dialog.
 * - `isExporting`: boolean - Indicates if the PDF export process is active.
 * - `isSubmitting`: boolean - Indicates if the bid submission process is active.
 *
 * @calculations
 * - **Subtotal**: Sum of all `amount` from `costCategories`.
 * - **Overhead**: 10% of the `subtotal`.
 * - **Profit**: 8% of the `subtotal`.
 * - **Contingency**: 5% of the `subtotal`.
 * - **Total Bid**: `subtotal + overhead + profit + contingency`.
 * - **Approval Progress**: Percentage of `complete` approval steps.
 * - **Markup Percentage**: `((overhead + profit + contingency) / subtotal) * 100`.
 * - **Cost per Gross SF**: `totalBid / selectedRFP.grossSF`.
 * - **Cost per Net SF**: `totalBid / selectedRFP.netSF`.
 *
 * @integration
 * - Integrates with `EstimatingContext` to get `selectedRFP`, `projectEstimate.costSummary`,
 *   `updateCostSummary`, `saveEstimate`, and `exportData`.
 * - Updates `projectEstimate.costSummary.approvalSteps` and `projectEstimate.costSummary.approvalStatus`
 *   based on user actions.
 * - Triggers `saveEstimate` and `exportData` from the context.
 */
export default function CostSummary() {
  const { projectEstimate, selectedRFP, updateCostSummary, saveEstimate, exportData } = useEstimating()
  const { toast } = useToast()

  const [showPreview, setShowPreview] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Derive state from context's projectEstimate.costSummary
  const costCategories: CostCategory[] = projectEstimate.costSummary?.costCategories || []
  const approvalSteps: ApprovalStep[] = projectEstimate.costSummary?.approvalSteps || []

  // Calculate totals based on current cost categories
  const subtotal = costCategories.reduce((sum, category) => sum + category.amount, 0)
  const overhead = subtotal * 0.1 // 10% overhead
  const profit = subtotal * 0.08 // 8% profit
  const contingency = subtotal * 0.05 // 5% contingency
  const totalBid = subtotal + overhead + profit + contingency

  const completedSteps = approvalSteps.filter((step) => step.status === "complete").length
  const approvalProgress = (completedSteps / approvalSteps.length) * 100
  const isBidApproved = approvalProgress === 100

  /**
   * Handles the approval or rejection of an approval step.
   * Updates the `approvalSteps` in the `EstimatingContext`.
   * @param {string} stepId - The ID of the approval step to update.
   * @param {"approve" | "reject"} action - The action to perform (approve or reject).
   */
  const handleApprovalStep = useCallback(
    (stepId: string, action: "approve" | "reject") => {
      const updatedApprovalSteps = approvalSteps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            status: action === "approve" ? "complete" : "skipped",
            completedBy: action === "approve" ? "Current User" : undefined, // Replace with actual user
            completedAt: action === "approve" ? new Date() : undefined,
          }
        }
        return step
      })

      const allApproved = updatedApprovalSteps.every((step) => step.status === "complete")
      const newApprovalStatus = allApproved ? "approved" : "pending"

      updateCostSummary({
        approvalSteps: updatedApprovalSteps,
        approvalStatus: newApprovalStatus,
      })

      toast({
        title: "Approval Status Updated",
        description: `Step "${
          approvalSteps.find((s) => s.id === stepId)?.title
        }" marked as ${action === "approve" ? "approved" : "rejected"}.`,
      })
    },
    [approvalSteps, updateCostSummary, toast],
  )

  /**
   * Handles the export of the bid summary as a PDF.
   * Simulates a delay and then triggers the context's export function.
   */
  const handleExportPDF = useCallback(async () => {
    setIsExporting(true)
    try {
      // Simulate PDF generation
      await new Promise((resolve) => setTimeout(resolve, 1500))
      await exportData("pdf") // Use the context's exportData
      toast({
        title: "Export Successful",
        description: "Bid package exported as PDF.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }, [exportData, toast])

  /**
   * Handles the submission of the bid.
   * Simulates a delay and then triggers the context's save function.
   */
  const handleSubmitBid = useCallback(async () => {
    setIsSubmitting(true)
    try {
      // Simulate bid submission
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await saveEstimate() // Save the final estimate
      updateCostSummary({ approvalStatus: "submitted" }) // Update status in context
      toast({
        title: "Bid Submitted",
        description: "Your project bid has been successfully submitted.",
      })
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting the bid. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [saveEstimate, updateCostSummary, toast])

  // Update cost summary in context whenever calculated values change
  useEffect(() => {
    updateCostSummary({
      subtotal,
      overhead,
      profit,
      contingency,
      total: totalBid,
      approvalProgress,
      // Do not update costCategories or approvalSteps here to avoid infinite loops
      // They are updated directly by handleApprovalStep or initialized from context
    })
  }, [subtotal, overhead, profit, contingency, totalBid, approvalProgress, updateCostSummary])

  return (
    <CostSummaryContent
      selectedRFP={selectedRFP}
      costCategories={costCategories}
      approvalSteps={approvalSteps}
      subtotal={subtotal}
      overhead={overhead}
      profit={profit}
      contingency={contingency}
      totalBid={totalBid}
      approvalProgress={approvalProgress}
      onApprovalStep={handleApprovalStep}
      onExportPDF={handleExportPDF}
      isExporting={isExporting}
      isSubmitting={isSubmitting}
      onShowPreview={() => setShowPreview(true)}
      showPreview={showPreview}
      onSetShowPreview={setShowPreview}
      isBidApproved={isBidApproved}
    />
  )
}
