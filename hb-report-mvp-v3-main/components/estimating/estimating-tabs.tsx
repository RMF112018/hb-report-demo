"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, Save, Download, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useEstimating } from "./estimating-context"
import { Badge } from "@/components/ui/badge"
import QuantityTakeoff from "./quantity-takeoff"
import ClarificationsAssumptions from "./clarifications-assumptions"
import RFIComponent from "./rfi" // Renamed to RFIComponent to avoid conflict with type RFI
import DocumentLog from "./document-log"
import { EnhancedBidTabTool } from "./enhanced-bid-tab-tool"
import BidLeveling from "./bid-leveling"
import CostSummary from "./cost-summary" // Updated import to the new wrapper component
import { useToast } from "@/hooks/use-toast"
import GCAndGR from "./gc-and-gr"
import Allowances from "./allowances"
import ValueAnalysis from "./value-analysis"

/**
 * @fileoverview EstimatingTabs Component
 *
 * This component provides a tabbed interface for the various stages of the
 * pre-construction estimating workflow. It includes a full-screen toggle,
 * displays RFP details, and offers actions like saving and exporting data.
 *
 * @version 1.0.0
 * @author HB Report Development Team
 * @since 2025-06-17
 *
 * @features
 * - Tabbed navigation for Quantity Takeoff, Clarifications & Assumptions, RFIs, Document Log,
 *   Bid Tabulation, Bid Leveling, and Cost Summary.
 * - Full-screen mode toggle for an immersive view of the current tab's content.
 * - Displays selected RFP details (Project Name, Client, Location, Due Date, Status).
 * - Action buttons for saving the estimate and exporting data (CSV/PDF).
 * - Integrates with `EstimatingContext` for centralized state management.
 *
 * @state
 * - `currentTab`: string - Controls the currently active tab.
 * - `isFullScreen`: boolean - Tracks whether the component is in full-screen mode.
 *
 * @dependencies
 * - shadcn/ui components: Card, Tabs, Button, Badge
 * - Lucide icons: Maximize2, Minimize2, Save, Download, FileText, Clock, CheckCircle, AlertCircle
 * - EstimatingContext: for accessing project data and actions.
 * - Workflow step components: QuantityTakeoff, ClarificationsAssumptions, RFIComponent, DocumentLog,
 *   EnhancedBidTabTool, BidLeveling, CostSummary.
 * - useToast: for displaying notifications.
 *
 * @maintenance
 * To add a new tab to the Estimating Workflow:
 * 1. Create a new React component for the new workflow step (e.g., `NewStepComponent.tsx`).
 * 2. Import `NewStepComponent` into `estimating-tabs.tsx`.
 * 3. Add a new `TabsTrigger` to the `TabsList` with a unique `value` and display name.
 * 4. Add a corresponding `TabsContent` for the new tab, rendering `NewStepComponent`.
 * 5. Update the `tabDefinitions` array to include the new tab's details.
 * 6. If the new tab requires specific tour steps, update `components/guided-tour/guided-tour.tsx`.
 */
export default function EstimatingTabs() {
  const { projectEstimate, selectedRFP, saveEstimate, exportData, isLoading, currentTab, setCurrentTab } =
    useEstimating()
  const { toast } = useToast()
  const [isFullScreen, setIsFullScreen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  /**
   * Toggles full-screen mode for the main estimating card.
   * Uses the Fullscreen API (`requestFullscreen`, `exitFullscreen`).
   */
  const toggleFullScreen = useCallback(() => {
    if (cardRef.current) {
      if (!document.fullscreenElement) {
        cardRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
          toast({
            title: "Full-screen Error",
            description: "Failed to enter full-screen mode. Your browser might restrict it.",
            variant: "destructive",
          })
        })
      } else {
        document.exitFullscreen()
      }
    }
  }, [toast])

  /**
   * Handles the `fullscreenchange` event to update `isFullScreen` state.
   */
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullScreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
    }
  }, [])

  /**
   * Handles saving the estimate.
   */
  const handleSaveEstimate = useCallback(async () => {
    try {
      await saveEstimate()
      toast({
        title: "Estimate Saved",
        description: "Your project estimate has been successfully saved.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your estimate. Please try again.",
        variant: "destructive",
      })
    }
  }, [saveEstimate, toast])

  /**
   * Handles exporting project data.
   * @param format - The desired export format ("csv" or "pdf").
   */
  const handleExportData = useCallback(
    async (format: "csv" | "pdf") => {
      try {
        await exportData(format)
        toast({
          title: "Export Successful",
          description: `Project data exported as ${format.toUpperCase()}.`,
        })
      } catch (error) {
        toast({
          title: "Export Failed",
          description: `There was an error exporting data as ${format.toUpperCase()}. Please try again.`,
          variant: "destructive",
        })
      }
    },
    [exportData, toast],
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "submitted":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "awarded":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "lost":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "submitted":
        return "bg-green-100 text-green-800"
      case "awarded":
        return "bg-green-100 text-green-800"
      case "lost":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const tabDefinitions = [
    { value: "quantity-takeoff", label: "Quantity Takeoff", component: <QuantityTakeoff /> },
    {
      value: "clarifications-assumptions",
      label: "Clarifications & Assumptions",
      component: <ClarificationsAssumptions />,
    },
    { value: "rfis", label: "RFIs", component: <RFIComponent /> },
    { value: "document-log", label: "Document Log", component: <DocumentLog /> },
    { value: "gc-and-gr", label: "GC & GR", component: <GCAndGR /> },
    { value: "allowances", label: "Allowances", component: <Allowances /> },
    { value: "value-analysis", label: "Value Analysis", component: <ValueAnalysis /> },
    { value: "bid-tabulation", label: "Bid Tabulation", component: <EnhancedBidTabTool /> },
    { value: "bid-leveling", label: "Bid Leveling", component: <BidLeveling /> },
    { value: "cost-summary", label: "Cost Summary", component: <CostSummary /> }, // Using the new wrapper
  ]

  return (
    <Card
      ref={cardRef}
      className={`container mx-auto px-6 py-8 bg-gray-50 shadow-lg ${isFullScreen ? "fixed inset-0 z-[9999] rounded-none overflow-auto" : ""}`}
      data-tour="estimating-tabs"
    >
      <CardHeader className="pb-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex-1">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {selectedRFP?.projectName || projectEstimate.name}
          </CardTitle>
          <CardDescription className="flex items-center mt-1 text-gray-600">
            {selectedRFP && getStatusIcon(selectedRFP.status)}
            <span className="ml-2">
              {selectedRFP?.client || projectEstimate.client} • {selectedRFP?.location || "N/A"}
            </span>
            {selectedRFP && (
              <Badge className={`ml-3 ${getStatusColor(selectedRFP.status)}`}>{selectedRFP.status.toUpperCase()}</Badge>
            )}
          </CardDescription>
          {selectedRFP && (
            <div className="text-sm text-gray-500 mt-2">
              Due Date: <span className="font-medium">{selectedRFP.dueDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button onClick={handleSaveEstimate} disabled={isLoading} variant="outline" className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" /> Save Estimate
          </Button>
          <Button
            onClick={() => handleExportData("csv")}
            disabled={isLoading}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={toggleFullScreen} variant="ghost" size="icon" className="full-screen-toggle">
            {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            <span className="sr-only">{isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1 h-auto flex-wrap">
            {tabDefinitions.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="whitespace-nowrap">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabDefinitions.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
