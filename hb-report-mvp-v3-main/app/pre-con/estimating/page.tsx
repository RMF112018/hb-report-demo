"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { mockBuildingConnectedAPI } from "@/data/mock-buildingconnected"
import type { RFP } from "@/types/estimating"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { EstimatingProvider } from "@/components/estimating/estimating-context"
import EstimatingTabs from "@/components/estimating/estimating-tabs" // Import the new component

export default function EstimatingPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("rfp-management") // This state is now managed by EstimatingTabs
  const [selectedRFP, setSelectedRFP] = useState<RFP | null>(null)
  const [rfps, setRFPs] = useState<RFP[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRFPs()
  }, [])

  const loadRFPs = async () => {
    try {
      setIsLoading(true)
      const data = await mockBuildingConnectedAPI.getOpportunities()
      setRFPs(data)
      if (data.length > 0 && !selectedRFP) {
        setSelectedRFP(data[0])
      }
    } catch (error) {
      console.error("Failed to load RFPs:", error)
    } finally {
      setIsLoading(false)
    }
  }

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

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003087]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pre-Construction Estimating</h1>
          <p className="text-gray-600 mt-1">
            Manage bid processes and generate cost summaries with BuildingConnected integration
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="px-3 py-1">
            <FileText className="h-4 w-4 mr-2" />
            {rfps.length} Active RFPs
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Estimator: {user?.firstName} {user?.lastName}
          </Badge>
        </div>
      </div>

      {/* Project Selection - This card is now redundant as EstimatingTabs has its own header */}
      {/* You might choose to remove this section if the EstimatingTabs header is sufficient */}
      {selectedRFP && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{selectedRFP.projectName}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  {getStatusIcon(selectedRFP.status)}
                  <span className="ml-2">
                    {selectedRFP.client} • {selectedRFP.location}
                  </span>
                </CardDescription>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getStatusColor(selectedRFP.status)}>{selectedRFP.status.toUpperCase()}</Badge>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Due Date</div>
                  <div className="font-medium">{selectedRFP.dueDate.toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Main Estimating Interface */}
      <EstimatingProvider>
        <EstimatingTabs /> {/* Use the new EstimatingTabs component */}
      </EstimatingProvider>
    </div>
  )
}
