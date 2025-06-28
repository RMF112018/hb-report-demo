"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockBuildingConnectedAPI } from "@/data/mock-buildingconnected"
import { Send, Users, Star, Phone, Mail, Building } from "lucide-react"
import type { RFP, Vendor } from "@/types/estimating"

interface BidInvitationProps {
  selectedRFP: RFP | null
}

export function BidInvitation({ selectedRFP }: BidInvitationProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [activeTradeTab, setActiveTradeTab] = useState("")

  useEffect(() => {
    if (selectedRFP && selectedRFP.trades.length > 0) {
      setActiveTradeTab(selectedRFP.trades[0])
      loadVendors()
    }
  }, [selectedRFP])

  const loadVendors = async () => {
    if (!selectedRFP) return

    setIsLoading(true)
    try {
      const allVendors: Vendor[] = []
      for (const trade of selectedRFP.trades) {
        const tradeVendors = await mockBuildingConnectedAPI.getVendorsByTrade(trade)
        allVendors.push(...tradeVendors)
      }
      setVendors(allVendors)
    } catch (error) {
      console.error("Failed to load vendors:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVendorSelection = (vendorId: string, checked: boolean) => {
    if (checked) {
      setSelectedVendors((prev) => [...prev, vendorId])
    } else {
      setSelectedVendors((prev) => prev.filter((id) => id !== vendorId))
    }
  }

  const handleSendInvitations = async () => {
    if (!selectedRFP || selectedVendors.length === 0) return

    setIsSending(true)
    try {
      await mockBuildingConnectedAPI.submitBidInvitation(selectedRFP.id, selectedVendors)
      alert(`Bid invitations sent to ${selectedVendors.length} vendors successfully!`)
      setSelectedVendors([])
    } catch (error) {
      console.error("Failed to send invitations:", error)
      alert("Failed to send bid invitations. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const getVendorsByTrade = (trade: string) => {
    return vendors.filter((vendor) => vendor.trade === trade)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  if (!selectedRFP) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
        <p className="text-gray-600">Please select an RFP to manage bid invitations.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bid Invitation</h2>
          <p className="text-gray-600 mt-1">Invite qualified vendors to submit bids via BuildingConnected</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="px-3 py-1">
            <Users className="h-4 w-4 mr-2" />
            {selectedVendors.length} Selected
          </Badge>
          <Button
            onClick={handleSendInvitations}
            disabled={selectedVendors.length === 0 || isSending}
            className="bg-[#FF6B35] hover:bg-[#E55A2B]"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSending ? "Sending..." : "Send Invitations"}
          </Button>
        </div>
      </div>

      {/* Vendor Selection by Trade */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Selection by Trade</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTradeTab} onValueChange={setActiveTradeTab}>
            <TabsList className="grid w-full grid-cols-4">
              {selectedRFP.trades.map((trade) => (
                <TabsTrigger key={trade} value={trade} className="text-sm">
                  {trade}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {getVendorsByTrade(trade).length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {selectedRFP.trades.map((trade) => (
              <TabsContent key={trade} value={trade} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{trade} Vendors</h3>
                    <Badge variant="outline">
                      {getVendorsByTrade(trade).filter((v) => selectedVendors.includes(v.id)).length} of{" "}
                      {getVendorsByTrade(trade).length} selected
                    </Badge>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Select</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Projects</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getVendorsByTrade(trade).map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedVendors.includes(vendor.id)}
                              onCheckedChange={(checked) => handleVendorSelection(vendor.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-semibold flex items-center">
                                <Building className="h-4 w-4 mr-2 text-gray-400" />
                                {vendor.name}
                              </div>
                              <div className="text-sm text-gray-500">{vendor.trade}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="h-3 w-3 mr-2 text-gray-400" />
                                {vendor.email}
                              </div>
                              <div className="flex items-center text-sm">
                                <Phone className="h-3 w-3 mr-2 text-gray-400" />
                                {vendor.phone}
                              </div>
                              <div className="text-sm font-medium">{vendor.contactPerson}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="flex">{renderStars(Math.floor(vendor.rating))}</div>
                              <span className="text-sm text-gray-600">{vendor.rating.toFixed(1)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{vendor.previousProjects} projects</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                vendor.isPrequalified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {vendor.isPrequalified ? "Prequalified" : "Pending"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Invitation Summary */}
      {selectedVendors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Invitation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedVendors.length}</div>
                  <div className="text-sm text-blue-600">Vendors Selected</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedRFP.trades.length}</div>
                  <div className="text-sm text-green-600">Trades Covered</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.ceil((selectedRFP.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-orange-600">Days Until Due</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
