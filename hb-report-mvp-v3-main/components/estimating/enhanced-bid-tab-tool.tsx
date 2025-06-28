"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Plus, AlertCircle, CheckCircle, Users } from "lucide-react"
import type { RFP } from "@/types/estimating"

interface BidTabToolProps {
  selectedRFP: RFP | null
  trade?: string
  onSave?: (data: any) => void
}

interface BidderData {
  id: string
  name: string
  contact: string
  phone: string
  email: string
  isPrequalified: boolean
  rating: number
}

interface GeneralInclusion {
  id: string
  description: string
  bidders: Record<string, { included: boolean; price: number }>
}

interface BaseBidItem {
  id: string
  description: string
  qty: number
  unit: string
  unitCost: number
  subtotal: number
  bidders: Record<string, number>
}

interface Alternate {
  id: string
  description: string
  bidders: Record<string, number>
}

interface VEProposal {
  id: string
  description: string
  costSavings: number
  bidder: string
  status: "proposed" | "approved" | "rejected"
}

interface LaborRate {
  id: string
  role: string
  bidders: Record<string, number>
}

interface ScheduleItem {
  id: string
  milestone: string
  bidders: Record<string, string>
}

const mockBidders: BidderData[] = [
  {
    id: "b1",
    name: "Precision Site Works",
    contact: "Mike Johnson",
    phone: "(561) 555-0101",
    email: "mike@precisionsite.com",
    isPrequalified: true,
    rating: 4.8,
  },
  {
    id: "b2",
    name: "Atlantic Contractors",
    contact: "Sarah Chen",
    phone: "(561) 555-0102",
    email: "sarah@atlanticcontractors.com",
    isPrequalified: true,
    rating: 4.5,
  },
  {
    id: "b3",
    name: "Coastal Construction",
    contact: "David Rodriguez",
    phone: "(561) 555-0103",
    email: "david@coastalconstruction.com",
    isPrequalified: true,
    rating: 4.7,
  },
  {
    id: "b4",
    name: "Premier Site Services",
    contact: "Lisa Martinez",
    phone: "(561) 555-0104",
    email: "lisa@premiersite.com",
    isPrequalified: false,
    rating: 4.2,
  },
  {
    id: "b5",
    name: "Elite Earthworks",
    contact: "Robert Wilson",
    phone: "(561) 555-0105",
    email: "robert@eliteearthworks.com",
    isPrequalified: true,
    rating: 4.6,
  },
  {
    id: "b6",
    name: "Superior Site Prep",
    contact: "Amanda Taylor",
    phone: "(561) 555-0106",
    email: "amanda@superiorsite.com",
    isPrequalified: true,
    rating: 4.4,
  },
]

export function EnhancedBidTabTool({ selectedRFP, trade = "Site Preparation", onSave }: BidTabToolProps) {
  // State management
  const [activeTab, setActiveTab] = useState("general-inclusions")
  const [bidders] = useState<BidderData[]>(mockBidders)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "error">("saved")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [projectSF, setProjectSF] = useState(75000) // Mock project square footage

  // General Inclusions State
  const [generalInclusions, setGeneralInclusions] = useState<GeneralInclusion[]>([
    {
      id: "gi1",
      description: "INCLUDES ALL SALES TAX",
      bidders: Object.fromEntries(bidders.map((b) => [b.id, { included: false, price: 0 }])),
    },
    {
      id: "gi2",
      description: "ALL HOISTING & RIGGING REQUIRED TO COMPLETE THIS SCOPE",
      bidders: Object.fromEntries(bidders.map((b) => [b.id, { included: false, price: 0 }])),
    },
    {
      id: "gi3",
      description: "PROVIDE P&P BONDS",
      bidders: Object.fromEntries(bidders.map((b) => [b.id, { included: false, price: 2500 }])),
    },
    {
      id: "gi4",
      description: "FLORIDA STATE CONTRACTORS LIC.",
      bidders: Object.fromEntries(bidders.map((b) => [b.id, { included: true, price: 0 }])),
    },
    {
      id: "gi5",
      description: "GENERAL LIABILITY AND WORKERS COMP. INSURANCE LIMITS",
      bidders: Object.fromEntries(bidders.map((b) => [b.id, { included: true, price: 0 }])),
    },
  ])

  // Base Bid Items State
  const [baseBidItems, setBaseBidItems] = useState<BaseBidItem[]>([
    {
      id: "bb1",
      description: "Construction fence",
      qty: 120,
      unit: "LF",
      unitCost: 0,
      subtotal: 0,
      bidders: { b1: 8400, b2: 7800, b3: 8200, b4: 9000, b5: 7600, b6: 8600 },
    },
    {
      id: "bb2",
      description: "Construction gates",
      qty: 1,
      unit: "EA",
      unitCost: 0,
      subtotal: 0,
      bidders: { b1: 2500, b2: 2200, b3: 2400, b4: 2800, b5: 2100, b6: 2600 },
    },
    {
      id: "bb3",
      description: "Maintenance during construction",
      qty: 1,
      unit: "LS",
      unitCost: 0,
      subtotal: 0,
      bidders: { b1: 15000, b2: 12000, b3: 14000, b4: 16000, b5: 11500, b6: 15500 },
    },
    {
      id: "bb4",
      description: "Street Maintenance & Cleaning",
      qty: 1,
      unit: "LS",
      unitCost: 0,
      subtotal: 0,
      bidders: { b1: 8000, b2: 7500, b3: 8200, b4: 9000, b5: 7200, b6: 8500 },
    },
    {
      id: "bb5",
      description: "Final Cleaning",
      qty: 75000,
      unit: "SF",
      unitCost: 0.35,
      subtotal: 26250,
      bidders: { b1: 28000, b2: 25500, b3: 27000, b4: 30000, b5: 24800, b6: 28500 },
    },
  ])

  // Bond rates and totals
  const [bondRates, setBondRates] = useState<Record<string, number>>(
    Object.fromEntries(bidders.map((b) => [b.id, 1.5])),
  )

  // Alternates State
  const [alternates, setAlternates] = useState<Alternate[]>([
    {
      id: "alt1",
      description: "Add for Steel pipe inside units",
      bidders: { b1: 15000, b2: 12500, b3: 14000, b4: 16500, b5: 12000, b6: 15500 },
    },
    {
      id: "alt2",
      description: "Underground Fire Main Certification",
      bidders: { b1: 3500, b2: 3200, b3: 3400, b4: 3800, b5: 3100, b6: 3600 },
    },
    {
      id: "alt3",
      description: "Furnish and install sprinkler heads in guestroom bathrooms (if over 55sf)",
      bidders: { b1: 8500, b2: 7800, b3: 8200, b4: 9200, b5: 7500, b6: 8800 },
    },
  ])

  // VE Proposals State
  const [veProposals, setVEProposals] = useState<VEProposal[]>([
    {
      id: "ve1",
      description: "Use alternative fencing material (vinyl vs chain link)",
      costSavings: 2500,
      bidder: "Precision Site Works",
      status: "proposed",
    },
    {
      id: "ve2",
      description: "Combine cleaning operations for efficiency",
      costSavings: 1800,
      bidder: "Atlantic Contractors",
      status: "approved",
    },
  ])

  // Labor Rates State
  const [laborRates, setLaborRates] = useState<LaborRate[]>([
    {
      id: "lr1",
      role: "Laborer",
      bidders: { b1: 28, b2: 26, b3: 27, b4: 30, b5: 25, b6: 29 },
    },
    {
      id: "lr2",
      role: "Equipment Operator",
      bidders: { b1: 45, b2: 42, b3: 44, b4: 48, b5: 41, b6: 46 },
    },
    {
      id: "lr3",
      role: "Foreman",
      bidders: { b1: 55, b2: 52, b3: 54, b4: 58, b5: 51, b6: 56 },
    },
    {
      id: "lr4",
      role: "Superintendent",
      bidders: { b1: 75, b2: 70, b3: 73, b4: 78, b5: 68, b6: 76 },
    },
    {
      id: "lr5",
      role: "Project Manager",
      bidders: { b1: 95, b2: 88, b3: 92, b4: 98, b5: 85, b6: 96 },
    },
  ])

  // Schedule State
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: "sch1",
      milestone: "Prepared shop drawings/submittals",
      bidders: { b1: "2 weeks", b2: "3 weeks", b3: "2 weeks", b4: "4 weeks", b5: "2 weeks", b6: "3 weeks" },
    },
    {
      id: "sch2",
      milestone: "Mobilization",
      bidders: { b1: "1 week", b2: "1 week", b3: "1 week", b4: "2 weeks", b5: "1 week", b6: "1 week" },
    },
    {
      id: "sch3",
      milestone: "Total duration to complete scope of work",
      bidders: { b1: "6 weeks", b2: "8 weeks", b3: "7 weeks", b4: "10 weeks", b5: "6 weeks", b6: "7 weeks" },
    },
  ])

  // Auto-save functionality
  const autoSaveInterval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    autoSaveInterval.current = setInterval(() => {
      handleAutoSave()
    }, 30000) // Auto-save every 30 seconds

    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current)
      }
    }
  }, [])

  const handleAutoSave = useCallback(async () => {
    setAutoSaveStatus("saving")
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setLastSaved(new Date())
      setAutoSaveStatus("saved")

      if (onSave) {
        onSave({
          generalInclusions,
          baseBidItems,
          bondRates,
          alternates,
          veProposals,
          laborRates,
          scheduleItems,
        })
      }
    } catch (error) {
      console.error("Auto-save failed:", error)
      setAutoSaveStatus("error")
    }
  }, [generalInclusions, baseBidItems, bondRates, alternates, veProposals, laborRates, scheduleItems, onSave])

  // Calculate totals for each bidder
  const calculateBidderTotals = useCallback(() => {
    const totals: Record<
      string,
      {
        subtotal: number
        bondAmount: number
        adjustedTotal: number
        costPerSF: number
        costPerUnit: number
      }
    > = {}

    bidders.forEach((bidder) => {
      const subtotal = baseBidItems.reduce((sum, item) => sum + (item.bidders[bidder.id] || 0), 0)
      const bondAmount = subtotal * (bondRates[bidder.id] / 100)
      const adjustedTotal = subtotal + bondAmount
      const costPerSF = adjustedTotal / projectSF
      const costPerUnit = adjustedTotal / baseBidItems.reduce((sum, item) => sum + item.qty, 0)

      totals[bidder.id] = {
        subtotal,
        bondAmount,
        adjustedTotal,
        costPerSF,
        costPerUnit,
      }
    })

    return totals
  }, [baseBidItems, bondRates, bidders, projectSF])

  const bidderTotals = calculateBidderTotals()

  // Update general inclusion
  const updateGeneralInclusion = (
    inclusionId: string,
    bidderId: string,
    field: "included" | "price",
    value: boolean | number,
  ) => {
    setGeneralInclusions((prev) =>
      prev.map((inclusion) => {
        if (inclusion.id === inclusionId) {
          return {
            ...inclusion,
            bidders: {
              ...inclusion.bidders,
              [bidderId]: {
                ...inclusion.bidders[bidderId],
                [field]: value,
              },
            },
          }
        }
        return inclusion
      }),
    )
  }

  // Update base bid item
  const updateBaseBidItem = (itemId: string, bidderId: string, value: number) => {
    setBaseBidItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            bidders: {
              ...item.bidders,
              [bidderId]: value,
            },
          }
        }
        return item
      }),
    )
  }

  // Update bond rate
  const updateBondRate = (bidderId: string, rate: number) => {
    setBondRates((prev) => ({
      ...prev,
      [bidderId]: rate,
    }))
  }

  if (!selectedRFP) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
          <p className="text-gray-500">Please select an RFP to begin bid analysis.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bid Tab Tool</h2>
          <p className="text-gray-600">Trade: {trade} • CSI Code: 02 100</p>
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
            <Users className="h-4 w-4 mr-2" />
            {bidders.length} Bidders
          </Badge>
        </div>
      </div>

      {/* Bidder Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {bidders.map((bidder) => {
          const totals = bidderTotals[bidder.id]
          return (
            <Card key={bidder.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium truncate">{bidder.name}</CardTitle>
                  {bidder.isPrequalified && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
                <div className="text-xs text-gray-500">{bidder.contact}</div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  <div className="text-lg font-bold text-green-600">
                    ${totals?.adjustedTotal.toLocaleString() || "0"}
                  </div>
                  <div className="text-xs text-gray-500">${totals?.costPerSF.toFixed(2) || "0.00"}/SF</div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < Math.floor(bidder.rating) ? "★" : "☆"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">{bidder.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Bid Tab Interface */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-gray-200 px-6 pt-6">
              <TabsList className="grid w-full grid-cols-7 h-auto p-1">
                <TabsTrigger value="general-inclusions" className="text-xs py-2">
                  General Inclusions
                </TabsTrigger>
                <TabsTrigger value="base-bid" className="text-xs py-2">
                  Base Bid
                </TabsTrigger>
                <TabsTrigger value="totals" className="text-xs py-2">
                  Totals & Analysis
                </TabsTrigger>
                <TabsTrigger value="alternates" className="text-xs py-2">
                  Alternates
                </TabsTrigger>
                <TabsTrigger value="ve-proposals" className="text-xs py-2">
                  VE Proposals
                </TabsTrigger>
                <TabsTrigger value="labor-rates" className="text-xs py-2">
                  Labor Rates
                </TabsTrigger>
                <TabsTrigger value="schedule" className="text-xs py-2">
                  Schedule
                </TabsTrigger>
              </TabsList>
            </div>

            {/* General Inclusions Tab */}
            <TabsContent value="general-inclusions" className="p-6 mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">General Inclusions</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Inclusion
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">Description</TableHead>
                        {bidders.map((bidder) => (
                          <TableHead key={bidder.id} className="text-center min-w-32">
                            <div className="space-y-1">
                              <div className="font-medium text-xs">{bidder.name}</div>
                              <div className="text-xs text-gray-500">Yes/No | Price</div>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generalInclusions.map((inclusion) => (
                        <TableRow key={inclusion.id}>
                          <TableCell className="font-medium">{inclusion.description}</TableCell>
                          {bidders.map((bidder) => (
                            <TableCell key={bidder.id} className="text-center">
                              <div className="space-y-2">
                                <Checkbox
                                  checked={inclusion.bidders[bidder.id]?.included || false}
                                  onCheckedChange={(checked) =>
                                    updateGeneralInclusion(inclusion.id, bidder.id, "included", !!checked)
                                  }
                                />
                                <Input
                                  type="number"
                                  value={inclusion.bidders[bidder.id]?.price || 0}
                                  onChange={(e) =>
                                    updateGeneralInclusion(inclusion.id, bidder.id, "price", Number(e.target.value))
                                  }
                                  className="w-20 text-xs"
                                  placeholder="$0"
                                />
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* Base Bid Tab */}
            <TabsContent value="base-bid" className="p-6 mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Base Bid - Specific Trade Scope</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-20">Qty</TableHead>
                        <TableHead className="w-16">U/M</TableHead>
                        <TableHead className="w-24">Unit Cost</TableHead>
                        <TableHead className="w-24">Subtotal</TableHead>
                        {bidders.map((bidder) => (
                          <TableHead key={bidder.id} className="text-center min-w-24">
                            <div className="space-y-1">
                              <div className="font-medium text-xs">{bidder.name}</div>
                              <div className="text-xs text-gray-500">Bid Amount</div>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {baseBidItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.description}</TableCell>
                          <TableCell>{item.qty.toLocaleString()}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                          <TableCell className="font-medium">${item.subtotal.toLocaleString()}</TableCell>
                          {bidders.map((bidder) => (
                            <TableCell key={bidder.id}>
                              <Input
                                type="number"
                                value={item.bidders[bidder.id] || 0}
                                onChange={(e) => updateBaseBidItem(item.id, bidder.id, Number(e.target.value))}
                                className="w-full text-sm"
                                placeholder="$0"
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* Totals & Analysis Tab */}
            <TabsContent value="totals" className="p-6 mt-0">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Subtotal, Bond Rate, Adjusted Total & Cost Analysis</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Totals Table */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Bid Totals</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Bidder</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                            <TableHead className="text-center">Bond %</TableHead>
                            <TableHead className="text-right">Bond Amount</TableHead>
                            <TableHead className="text-right">Adjusted Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bidders.map((bidder) => {
                            const totals = bidderTotals[bidder.id]
                            return (
                              <TableRow key={bidder.id}>
                                <TableCell className="font-medium">{bidder.name}</TableCell>
                                <TableCell className="text-right">${totals?.subtotal.toLocaleString()}</TableCell>
                                <TableCell className="text-center">
                                  <Input
                                    type="number"
                                    value={bondRates[bidder.id] || 0}
                                    onChange={(e) => updateBondRate(bidder.id, Number(e.target.value))}
                                    className="w-16 text-center"
                                    step="0.1"
                                  />
                                  %
                                </TableCell>
                                <TableCell className="text-right">${totals?.bondAmount.toLocaleString()}</TableCell>
                                <TableCell className="text-right font-bold text-green-600">
                                  ${totals?.adjustedTotal.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Cost Analysis */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Cost Analysis</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Bidder</TableHead>
                            <TableHead className="text-right">Cost per SF</TableHead>
                            <TableHead className="text-right">Cost per Unit</TableHead>
                            <TableHead className="text-center">Rank</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bidders
                            .sort(
                              (a, b) =>
                                (bidderTotals[a.id]?.adjustedTotal || 0) - (bidderTotals[b.id]?.adjustedTotal || 0),
                            )
                            .map((bidder, index) => {
                              const totals = bidderTotals[bidder.id]
                              return (
                                <TableRow key={bidder.id} className={index === 0 ? "bg-green-50" : ""}>
                                  <TableCell className="font-medium">{bidder.name}</TableCell>
                                  <TableCell className="text-right">${totals?.costPerSF.toFixed(2)}</TableCell>
                                  <TableCell className="text-right">${totals?.costPerUnit.toFixed(2)}</TableCell>
                                  <TableCell className="text-center">
                                    <Badge variant={index === 0 ? "default" : "outline"}>#{index + 1}</Badge>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Alternates Tab */}
            <TabsContent value="alternates" className="p-6 mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Alternates</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Alternate
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">Description</TableHead>
                        {bidders.map((bidder) => (
                          <TableHead key={bidder.id} className="text-center min-w-24">
                            {bidder.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alternates.map((alternate) => (
                        <TableRow key={alternate.id}>
                          <TableCell className="font-medium">{alternate.description}</TableCell>
                          {bidders.map((bidder) => (
                            <TableCell key={bidder.id} className="text-center">
                              <Input
                                type="number"
                                value={alternate.bidders[bidder.id] || 0}
                                onChange={(e) => {
                                  setAlternates((prev) =>
                                    prev.map((alt) =>
                                      alt.id === alternate.id
                                        ? { ...alt, bidders: { ...alt.bidders, [bidder.id]: Number(e.target.value) } }
                                        : alt,
                                    ),
                                  )
                                }}
                                className="w-24 text-sm"
                                placeholder="$0"
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* VE Proposals Tab */}
            <TabsContent value="ve-proposals" className="p-6 mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Proposed Value Engineering</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add VE Proposal
                  </Button>
                </div>

                <div className="grid gap-4">
                  {veProposals.map((ve) => (
                    <Card key={ve.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Textarea
                              value={ve.description}
                              onChange={(e) => {
                                setVEProposals((prev) =>
                                  prev.map((v) => (v.id === ve.id ? { ...v, description: e.target.value } : v)),
                                )
                              }}
                              className="mb-2"
                              placeholder="Provide clear description of VE proposal"
                            />
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Proposed by: {ve.bidder}</span>
                              <span>Cost Savings: ${ve.costSavings.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Select
                              value={ve.status}
                              onValueChange={(value: "proposed" | "approved" | "rejected") => {
                                setVEProposals((prev) =>
                                  prev.map((v) => (v.id === ve.id ? { ...v, status: value } : v)),
                                )
                              }}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="proposed">Proposed</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Labor Rates Tab */}
            <TabsContent value="labor-rates" className="p-6 mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fully Loaded Labor Rates</h3>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        {bidders.map((bidder) => (
                          <TableHead key={bidder.id} className="text-center">
                            <div className="space-y-1">
                              <div className="font-medium text-xs">{bidder.name}</div>
                              <div className="text-xs text-gray-500">$/Hour</div>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {laborRates.map((rate) => (
                        <TableRow key={rate.id}>
                          <TableCell className="font-medium">{rate.role}</TableCell>
                          {bidders.map((bidder) => (
                            <TableCell key={bidder.id} className="text-center">
                              <Input
                                type="number"
                                value={rate.bidders[bidder.id] || 0}
                                onChange={(e) => {
                                  setLaborRates((prev) =>
                                    prev.map((r) =>
                                      r.id === rate.id
                                        ? { ...r, bidders: { ...r.bidders, [bidder.id]: Number(e.target.value) } }
                                        : r,
                                    ),
                                  )
                                }}
                                className="w-20 text-sm"
                                placeholder="$0"
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="p-6 mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Schedule</h3>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Milestone</TableHead>
                        {bidders.map((bidder) => (
                          <TableHead key={bidder.id} className="text-center">
                            <div className="space-y-1">
                              <div className="font-medium text-xs">{bidder.name}</div>
                              <div className="text-xs text-gray-500">Duration</div>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduleItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.milestone}</TableCell>
                          {bidders.map((bidder) => (
                            <TableCell key={bidder.id} className="text-center">
                              <Input
                                value={item.bidders[bidder.id] || ""}
                                onChange={(e) => {
                                  setScheduleItems((prev) =>
                                    prev.map((s) =>
                                      s.id === item.id
                                        ? { ...s, bidders: { ...s.bidders, [bidder.id]: e.target.value } }
                                        : s,
                                    ),
                                  )
                                }}
                                className="w-24 text-sm"
                                placeholder="Duration"
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
