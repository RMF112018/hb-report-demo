"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { useEstimating } from "./EstimatingProvider"
import { BidLevelingContent } from "./BidLevelingContent"

export function BidLeveling() {
  const { 
    tradeBids, 
    bidComparisons, 
    bidLevelingNotes,
    addTradeBids,
    updateTradeBids,
    deleteTradeBids,
    addBidToTrade,
    updateBid,
    deleteBid,
    selectBid,
    getBidLevelingSummary,
    createBidComparison,
    importBidLevelingFromFile,
    exportBidLevelingToCSV,
    generateBidLevelingTemplate,
    updateBidLevelingNotes
  } = useEstimating()

  return (
    <Card className="p-6" data-tour="bid-leveling-tab">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6" /> Bid Leveling
        </CardTitle>
        <CardDescription>
          Compare and analyze vendor bids to make informed selection decisions for each trade.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BidLevelingContent
          tradeBids={tradeBids}
          bidComparisons={bidComparisons}
          bidLevelingNotes={bidLevelingNotes}
          onAddTradeBids={addTradeBids}
          onUpdateTradeBids={updateTradeBids}
          onDeleteTradeBids={deleteTradeBids}
          onAddBidToTrade={addBidToTrade}
          onUpdateBid={updateBid}
          onDeleteBid={deleteBid}
          onSelectBid={selectBid}
          onGetSummary={getBidLevelingSummary}
          onCreateComparison={createBidComparison}
          onImportFromFile={importBidLevelingFromFile}
          onExportToCSV={exportBidLevelingToCSV}
          onGenerateTemplate={generateBidLevelingTemplate}
          onUpdateNotes={updateBidLevelingNotes}
        />
      </CardContent>
    </Card>
  )
}

export default BidLeveling 