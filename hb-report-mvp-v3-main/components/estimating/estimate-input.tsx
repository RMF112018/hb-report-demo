"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle } from "lucide-react"
import { EnhancedBidTabTool } from "./enhanced-bid-tab-tool"
import type { RFP } from "@/types/estimating"

interface EstimateInputProps {
  selectedRFP: RFP | null
}

interface Trade {
  id: string
  name: string
  csiCode: string
  status: "not_started" | "in_progress" | "complete"
  progress: number
  estimatedValue: number
  currentBids: number
}

const mockTrades: Trade[] = [
  {
    id: "site-prep",
    name: "Site Preparation",
    csiCode: "02 100",
    status: "in_progress",
    progress: 75,
    estimatedValue: 125000,
    currentBids: 6,
  },
  {
    id: "concrete",
    name: "Concrete",
    csiCode: "03 300",
    status: "in_progress",
    progress: 60,
    estimatedValue: 485000,
    currentBids: 4,
  },
  {
    id: "masonry",
    name: "Masonry",
    csiCode: "04 200",
    status: "not_started",
    progress: 0,
    estimatedValue: 275000,
    currentBids: 0,
  },
  {
    id: "structural-steel",
    name: "Structural Steel",
    csiCode: "05 120",
    status: "not_started",
    progress: 0,
    estimatedValue: 650000,
    currentBids: 0,
  },
  {
    id: "electrical",
    name: "Electrical",
    csiCode: "26 000",
    status: "in_progress",
    progress: 45,
    estimatedValue: 420000,
    currentBids: 3,
  },
  {
    id: "plumbing",
    name: "Plumbing",
    csiCode: "22 000",
    status: "complete",
    progress: 100,
    estimatedValue: 320000,
    currentBids: 5,
  },
]

export function EstimateInput({ selectedRFP }: EstimateInputProps) {
  const [trades] = useState<Trade[]>(mockTrades)
  const [activeTrade, setActiveTrade] = useState<string>("site-prep")
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "error">("saved")

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      setAutoSaveStatus("saving")
      // Simulate API call
      setTimeout(() => {
        setAutoSaveStatus("saved")
      }, 1000)
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSave)
  }, [])

  const currentTrade = trades.find((t) => t.id === activeTrade)
  const totalEstimate = trades.reduce((sum, trade) => sum + trade.estimatedValue, 0)
  const completedTrades = trades.filter((t) => t.status === "complete").length
  const overallProgress = trades.reduce((sum, trade) => sum + trade.progress, 0) / trades.length

  if (!selectedRFP) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
          <p className="text-gray-500">Please select an RFP to begin estimate input.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Auto-save Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trade Estimates</h2>
          <p className="text-gray-600">Build detailed cost estimates using the Bid Tab tool</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                autoSaveStatus === "saved"
                  ? "bg-green-500"
                  : autoSaveStatus === "saving"
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-600">
              {autoSaveStatus === "saved"
                ? "All changes saved"
                : autoSaveStatus === "saving"
                  ? "Saving..."
                  : "Error saving"}
            </span>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            Total: ${totalEstimate.toLocaleString()}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {completedTrades}/{trades.length} Complete
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Estimate Progress</h3>
            <span className="text-sm text-gray-600">{Math.round(overallProgress)}% Complete</span>
          </div>
          <Progress value={overallProgress} className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trades.map((trade) => (
              <div
                key={trade.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  activeTrade === trade.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setActiveTrade(trade.id)}
              >
                <div className="text-sm font-medium truncate">{trade.name}</div>
                <div className="text-xs text-gray-500 mb-2">{trade.csiCode}</div>
                <Progress value={trade.progress} className="h-1 mb-2" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{trade.progress}%</span>
                  <Badge
                    variant={
                      trade.status === "complete" ? "default" : trade.status === "in_progress" ? "secondary" : "outline"
                    }
                    className="text-xs"
                  >
                    {trade.currentBids} bids
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Bid Tab Tool */}
      {currentTrade && (
        <EnhancedBidTabTool
          selectedRFP={selectedRFP}
          trade={currentTrade.name}
          onSave={(data) => {
            console.log("Saving bid tab data:", data)
            // Handle save logic here
          }}
        />
      )}
    </div>
  )
}
