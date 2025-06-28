"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, Calendar, DollarSign, Ruler } from "lucide-react"
import type { RFP } from "@/types/estimating"

interface ProjectSetupProps {
  selectedRFP: RFP | null
}

export function ProjectSetup({ selectedRFP }: ProjectSetupProps) {
  const [projectData, setProjectData] = useState({
    grossSF: "",
    acSF: "",
    floors: "",
    buildingHeight: "",
    constructionType: "",
    notes: "",
  })

  useEffect(() => {
    if (selectedRFP) {
      setProjectData({
        grossSF: selectedRFP.grossSF?.toString() || "",
        acSF: selectedRFP.acSF?.toString() || "",
        floors: "",
        buildingHeight: "",
        constructionType: "",
        notes: selectedRFP.description || "",
      })
    }
  }, [selectedRFP])

  const handleInputChange = (field: string, value: string) => {
    setProjectData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    console.log("Saving project data:", projectData)
    // Here you would typically save to your backend
  }

  if (!selectedRFP) {
    return (
      <div className="text-center py-12">
        <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
        <p className="text-gray-600">Please select an RFP from the RFP Management tab to set up project details.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Project Setup</h2>
        <p className="text-gray-600 mt-1">Configure project parameters and building specifications</p>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Location</div>
                <div className="font-medium">{selectedRFP.location}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Due Date</div>
                <div className="font-medium">{selectedRFP.dueDate.toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Est. Value</div>
                <div className="font-medium">${selectedRFP.estimatedValue.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="px-3 py-1">
                {selectedRFP.projectType}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Building Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ruler className="h-5 w-5 mr-2" />
            Building Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="gross-sf">Gross Square Feet</Label>
                <Input
                  id="gross-sf"
                  type="number"
                  placeholder="Enter Gross SF"
                  value={projectData.grossSF}
                  onChange={(e) => handleInputChange("grossSF", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ac-sf">Air Conditioned Square Feet</Label>
                <Input
                  id="ac-sf"
                  type="number"
                  placeholder="Enter AC SF"
                  value={projectData.acSF}
                  onChange={(e) => handleInputChange("acSF", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="floors">Number of Floors</Label>
                <Input
                  id="floors"
                  type="number"
                  placeholder="Enter number of floors"
                  value={projectData.floors}
                  onChange={(e) => handleInputChange("floors", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="building-height">Building Height (ft)</Label>
                <Input
                  id="building-height"
                  type="number"
                  placeholder="Enter building height"
                  value={projectData.buildingHeight}
                  onChange={(e) => handleInputChange("buildingHeight", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="construction-type">Construction Type</Label>
                <Input
                  id="construction-type"
                  placeholder="e.g., Type II, Steel Frame"
                  value={projectData.constructionType}
                  onChange={(e) => handleInputChange("constructionType", e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trades */}
      <Card>
        <CardHeader>
          <CardTitle>Project Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {selectedRFP.trades.map((trade) => (
              <Badge key={trade} variant="secondary" className="px-3 py-1">
                {trade}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Project Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter project notes, special requirements, or additional details..."
            value={projectData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset</Button>
        <Button onClick={handleSave} className="bg-[#003087] hover:bg-[#002066]">
          Save Project Data
        </Button>
      </div>
    </div>
  )
}
