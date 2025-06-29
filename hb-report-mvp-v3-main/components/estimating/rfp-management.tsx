"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, RefreshCw, FileText, Calendar, DollarSign } from "lucide-react"
import type { RFP } from "@/types/estimating"

interface RFPManagementProps {
  rfps: RFP[]
  selectedRFP: RFP | null
  onSelectRFP: (rfp: RFP) => void
  onRefresh: () => void
}

export function RFPManagement({ rfps, selectedRFP, onSelectRFP, onRefresh }: RFPManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredRFPs = rfps.filter(
    (rfp) =>
      rfp.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.client.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh()
    setIsRefreshing(false)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">RFP Management</h2>
          <p className="text-gray-600 mt-1">Manage and track Request for Proposals from BuildingConnected</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Sync with BuildingConnected
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search RFPs by project name or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline" className="px-3 py-2">
              <FileText className="h-4 w-4 mr-2" />
              {filteredRFPs.length} RFPs
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* RFP Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active RFPs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Received</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Est. Value</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRFPs.map((rfp) => (
                <TableRow key={rfp.id} className={selectedRFP?.id === rfp.id ? "bg-blue-50" : ""}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{rfp.projectName}</div>
                      <div className="text-sm text-gray-500">{rfp.projectType}</div>
                    </div>
                  </TableCell>
                  <TableCell>{rfp.client}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(rfp.status)}>{rfp.status.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {rfp.dateReceived.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {rfp.dueDate.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                      {formatCurrency(rfp.estimatedValue)}
                    </div>
                  </TableCell>
                  <TableCell>{rfp.location}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={selectedRFP?.id === rfp.id ? "default" : "outline"}
                      onClick={() => onSelectRFP(rfp)}
                    >
                      {selectedRFP?.id === rfp.id ? "Selected" : "Select"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
