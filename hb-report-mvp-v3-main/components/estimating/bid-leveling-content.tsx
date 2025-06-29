"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertTriangle, TrendingUp, TrendingDown, CheckCircle, ArrowRight, Brain, Zap } from "lucide-react"
import type { RFP, VendorBid } from "@/types/estimating" // Import VendorBid type

/**
 * @fileoverview BidLevelingContent Component
 *
 * This component displays the detailed bid leveling interface, allowing users to compare,
 * select, and manage bids for different trades. It is designed to be a presentational
 * component that receives all necessary data and callbacks via props.
 *
 * @version 1.0.0
 * @author HB Report Development Team
 * @since 2025-06-17
 *
 * @interface BidLevelingContentProps
 * @property {RFP | null} selectedRFP - The currently selected Request for Proposal.
 * @property {VendorBid[]} tradeBids - An array of vendor bids organized by trade.
 * @property {Record<string, VendorBid>} selectedBids - A record of currently selected bids by trade ID.
 * @property {(tradeId: string, bidId: string) => void} onSelectBid - Callback function to select a bid for a trade.
 * @property {(bidId: string, updates: Partial<VendorBid>) => void} onUpdateVendorBid - Callback to update a specific vendor bid.
 * @property {string} levelingNotes - Current value of the leveling notes textarea.
 * @property {(notes: string) => void} onLevelingNotesChange - Callback to update leveling notes.
 *
 * @features
 * - Displays a summary of trades with bid counts, risk levels, and variance.
 * - Provides a detailed table for bids within a selected trade, including amounts, confidence, inclusions, and exclusions.
 * - Allows selection of a preferred bid for each trade.
 * - Includes AI insights/recommendations (mocked).
 * - Supports adding general leveling notes.
 * - Offers a "Compare All" dialog for side-by-side bid comparison.
 * - Integrates with shadcn/ui components for consistent styling.
 *
 * @dependencies
 * - shadcn/ui components: Card, Button, Badge, Table, Dialog, Alert, Progress, Textarea, Label
 * - Lucide icons: AlertTriangle, TrendingUp, TrendingDown, CheckCircle, ArrowRight, Brain, Zap
 * - Types: RFP, VendorBid
 *
 * @notes
 * - The `tradeBids` prop is expected to be an array of `VendorBid` objects, where each `VendorBid`
 *   represents a bid from a specific vendor for a specific trade. The component groups these
 *   by trade for display.
 * - The `selectedBids` prop is a map of `tradeId` to the `VendorBid` object that has been selected
 *   for that trade.
 * - The `onSelectBid` and `onUpdateVendorBid` callbacks are crucial for external state management.
 */
interface BidLevelingContentProps {
  selectedRFP: RFP | null
  tradeBids: VendorBid[]
  selectedBids: Record<string, VendorBid>
  onSelectBid: (tradeId: string, bidId: string) => void
  onUpdateVendorBid: (bidId: string, updates: Partial<VendorBid>) => void
  levelingNotes: string
  onLevelingNotesChange: (notes: string) => void
}

export function BidLevelingContent({
  selectedRFP,
  tradeBids,
  selectedBids,
  onSelectBid,
  onUpdateVendorBid,
  levelingNotes,
  onLevelingNotesChange,
}: BidLevelingContentProps) {
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null)
  const [showComparison, setShowComparison] = useState(false)

  // Group bids by trade for display in the trade selection cards
  const groupedTradeBids = tradeBids.reduce(
    (acc, bid) => {
      if (!acc[bid.trade]) {
        acc[bid.trade] = {
          tradeId: bid.trade, // Using trade name as ID for grouping
          tradeName: bid.trade,
          bids: [],
          selectedBid: undefined,
          aiRecommendation: undefined, // This would come from a more complex AI integration
          riskLevel: "low", // Placeholder, would be calculated
          variance: 0, // Placeholder, would be calculated
        }
      }
      acc[bid.trade].bids.push(bid)
      return acc
    },
    {} as Record<
      string,
      {
        tradeId: string
        tradeName: string
        bids: VendorBid[]
        selectedBid?: string
        aiRecommendation?: string
        riskLevel: "low" | "medium" | "high"
        variance: number
      }
    >,
  )

  // Calculate variance and risk level for grouped trades (mocked for now)
  Object.values(groupedTradeBids).forEach((tradeGroup) => {
    const amounts = tradeGroup.bids.map((b) => b.totalAmount)
    if (amounts.length > 1) {
      const min = Math.min(...amounts)
      const max = Math.max(...amounts)
      tradeGroup.variance = ((max - min) / min) * 100
      if (tradeGroup.variance > 30) tradeGroup.riskLevel = "high"
      else if (tradeGroup.variance > 15) tradeGroup.riskLevel = "medium"
      else tradeGroup.riskLevel = "low"
    } else {
      tradeGroup.variance = 0
      tradeGroup.riskLevel = "low"
    }
    // Set selected bid from context
    tradeGroup.selectedBid = selectedBids[tradeGroup.tradeId]?.id

    // Mock AI recommendation for demo
    if (tradeGroup.tradeId === "Concrete") {
      tradeGroup.aiRecommendation = "ABC Concrete offers the best value with proven track record"
    } else if (tradeGroup.tradeId === "Plumbing") {
      tradeGroup.aiRecommendation = "Pro Plumbing recommended despite higher cost due to schedule reliability"
    }
  })

  const currentTradeGroup = selectedTradeId ? groupedTradeBids[selectedTradeId] : undefined

  // Set initial selected trade to the first one if available
  useState(() => {
    if (!selectedTradeId && Object.keys(groupedTradeBids).length > 0) {
      setSelectedTradeId(Object.keys(groupedTradeBids)[0])
    }
  })

  const getVarianceColor = (variance: number) => {
    if (variance < 15) return "text-green-600"
    if (variance < 30) return "text-yellow-600"
    return "text-red-600"
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalSelectedBids = Object.values(selectedBids).reduce((sum, bid) => sum + bid.totalAmount, 0)

  const completionRate = (Object.keys(selectedBids).length / Object.keys(groupedTradeBids).length) * 100

  if (!selectedRFP) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
          <p className="text-gray-500">Please select an RFP to begin bid leveling.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6" data-tour="bid-leveling">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bid Leveling & Analysis</h2>
          <p className="text-gray-600">Compare and select the best bids for each trade</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Completion</div>
            <div className="flex items-center space-x-2">
              <Progress value={completionRate} className="w-24" />
              <span className="text-sm font-medium">{Math.round(completionRate)}%</span>
            </div>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            Selected Total: ${totalSelectedBids.toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* AI Insights Alert */}
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>AI Analysis:</strong> {Object.keys(groupedTradeBids).length} trades analyzed with risk assessment.
          {Object.values(groupedTradeBids)
            .filter((t) => t.aiRecommendation)
            .map((t) => t.aiRecommendation)
            .join(". ")}
        </AlertDescription>
      </Alert>

      {/* Trade Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(groupedTradeBids).map((trade) => (
          <Card
            key={trade.tradeId}
            className={`cursor-pointer transition-all ${selectedTradeId === trade.tradeId ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => setSelectedTradeId(trade.tradeId)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{trade.tradeName}</CardTitle>
                <Badge className={getRiskBadgeColor(trade.riskLevel)}>{trade.riskLevel} risk</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{trade.bids.length} bids</span>
                <span className={`font-medium ${getVarianceColor(trade.variance)}`}>
                  {trade.variance.toFixed(1)}% variance
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {trade.bids.slice(0, 2).map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between text-sm">
                    <span className="truncate">{bid.vendorName}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">${(bid.totalAmount / 1000).toFixed(0)}K</span>
                      {selectedBids[trade.tradeId]?.id === bid.id && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                ))}
                {trade.bids.length > 2 && (
                  <div className="text-xs text-gray-500">+{trade.bids.length - 2} more bids</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Bid Analysis */}
      {currentTradeGroup && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{currentTradeGroup.tradeName} Bids</CardTitle>
                <p className="text-gray-600 mt-1">
                  {currentTradeGroup.bids.length} bids received • {currentTradeGroup.variance.toFixed(1)}% variance
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => setShowComparison(true)}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Compare All
                </Button>
                <Button>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Mirror to Cost Summary
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* AI Recommendation */}
            {currentTradeGroup.aiRecommendation && (
              <Alert className="mb-6">
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Recommendation:</strong> {currentTradeGroup.aiRecommendation}
                </AlertDescription>
              </Alert>
            )}

            {/* Bids Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Inclusions</TableHead>
                    <TableHead>Exclusions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTradeGroup.bids.map((bid) => (
                    <TableRow
                      key={bid.id}
                      className={selectedBids[currentTradeGroup.tradeId]?.id === bid.id ? "bg-green-50" : ""}
                    >
                      <TableCell className="font-medium">{bid.vendorName}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">${bid.totalAmount.toLocaleString()}</span>
                          {bid.totalAmount === Math.min(...currentTradeGroup.bids.map((b) => b.totalAmount)) && (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          )}
                          {bid.totalAmount === Math.max(...currentTradeGroup.bids.map((b) => b.totalAmount)) && (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={bid.confidence} className="w-16" />
                          <span className="text-sm">{bid.confidence}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-48">
                          {bid.inclusions.slice(0, 2).map((item) => (
                            <Badge key={item} variant="secondary" className="mr-1 mb-1 text-xs">
                              {item}
                            </Badge>
                          ))}
                          {bid.inclusions.length > 2 && (
                            <span className="text-xs text-gray-500">+{bid.inclusions.length - 2} more</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-48">
                          {bid.exclusions.slice(0, 2).map((item) => (
                            <Badge key={item} variant="outline" className="mr-1 mb-1 text-xs">
                              {item}
                            </Badge>
                          ))}
                          {bid.exclusions.length > 2 && (
                            <span className="text-xs text-gray-500">+{bid.exclusions.length - 2} more</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            selectedBids[currentTradeGroup.tradeId]?.id === bid.id
                              ? "default"
                              : bid.status === "reviewed"
                                ? "secondary"
                                : bid.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {selectedBids[currentTradeGroup.tradeId]?.id === bid.id ? "selected" : bid.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={selectedBids[currentTradeGroup.tradeId]?.id === bid.id ? "default" : "outline"}
                          onClick={() => onSelectBid(currentTradeGroup.tradeId, bid.id)}
                        >
                          {selectedBids[currentTradeGroup.tradeId]?.id === bid.id ? "Selected" : "Select"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Leveling Notes */}
            <div className="mt-6">
              <Label htmlFor="levelingNotes">Leveling Notes</Label>
              <Textarea
                id="levelingNotes"
                value={levelingNotes}
                onChange={(e) => onLevelingNotesChange(e.target.value)}
                placeholder="Add notes about bid leveling decisions, adjustments, or concerns..."
                rows={3}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Dialog */}
      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Bid Comparison - {currentTradeGroup?.tradeName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentTradeGroup?.bids.map((bid) => (
                <Card
                  key={bid.id}
                  className={selectedBids[currentTradeGroup.tradeId]?.id === bid.id ? "ring-2 ring-green-500" : ""}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{bid.vendorName}</CardTitle>
                    <div className="text-2xl font-bold text-green-600">${bid.totalAmount.toLocaleString()}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-700">Confidence</div>
                        <Progress value={bid.confidence} className="mt-1" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Inclusions</div>
                        <div className="mt-1 space-y-1">
                          {bid.inclusions.map((item) => (
                            <Badge key={item} variant="secondary" className="mr-1 text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Exclusions</div>
                        <div className="mt-1 space-y-1">
                          {bid.exclusions.map((item) => (
                            <Badge key={item} variant="outline" className="mr-1 text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
