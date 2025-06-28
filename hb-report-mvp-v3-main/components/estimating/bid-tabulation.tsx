"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { useEstimating } from "@/components/estimating/estimating-context"
import { EnhancedBidTab } from "@/components/estimating/enhanced-bid-tab"

/**
 * @fileoverview Bid Tabulation Component
 *
 * This component serves as a dedicated tab within the Estimating Workflow
 * for managing and reviewing bid items using the EnhancedBidTab interface.
 * It integrates with the central EstimatingContext to access and update
 * bid-related data.
 *
 * @component BidTabulation
 * @returns {JSX.Element} The rendered Bid Tabulation interface.
 *
 * @example
 * // Used as a tab content within EstimatingTabs:
 * <BidTabulation />
 */
export default function BidTabulation() {
  const { projectEstimate, selectedRFP, updateBidTabData, updateBidLineItem } = useEstimating()

  return (
    <Card className="h-full flex flex-col" data-tour="bid-tabulation-tab">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          Bid Tabulation
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <div className="p-6">
          <EnhancedBidTab
            selectedRFP={selectedRFP}
            bidTabData={projectEstimate.bidTabData}
            onSave={updateBidTabData}
            onItemUpdate={updateBidLineItem}
          />
        </div>
      </CardContent>
    </Card>
  )
}
