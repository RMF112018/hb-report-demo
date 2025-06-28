"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Wrench,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react"

interface SiteMateMetricsProps {
  partnerId: string
}

// Mock SiteMate API data
const mockSiteMateData = {
  "tp-001": {
    safetyMetrics: {
      ltir: 0.8, // Lost Time Injury Rate
      trir: 1.2, // Total Recordable Incident Rate
      nearMissReports: 23,
      safetyMeetingsAttendance: 96.7,
      incidentReports: 2,
      safetyTrainingHours: 1240
    },
    operationalMetrics: {
      workforceProductivity: 94.2,
      equipmentUtilization: 87.5,
      materialWasteReduction: 12.8,
      energyEfficiency: 89.3,
      digitalAdoption: 78.9
    },
    qualityMetrics: {
      defectRate: 2.1,
      reworkPercentage: 3.8,
      customerSatisfaction: 4.7,
      firstTimeQuality: 94.2,
      qualityAuditsScore: 91.5
    },
    fieldReporting: {
      dailyReportsSubmitted: 98.5,
      photoDocumentation: 96.8,
      timelyReporting: 94.1,
      reportAccuracy: 92.7,
      communicationScore: 4.6
    }
  },
  "tp-002": {
    safetyMetrics: {
      ltir: 1.4,
      trir: 2.1,
      nearMissReports: 18,
      safetyMeetingsAttendance: 89.2,
      incidentReports: 4,
      safetyTrainingHours: 890
    },
    operationalMetrics: {
      workforceProductivity: 86.7,
      equipmentUtilization: 82.1,
      materialWasteReduction: 8.9,
      energyEfficiency: 83.5,
      digitalAdoption: 65.2
    },
    qualityMetrics: {
      defectRate: 3.7,
      reworkPercentage: 6.2,
      customerSatisfaction: 4.2,
      firstTimeQuality: 87.8,
      qualityAuditsScore: 85.3
    },
    fieldReporting: {
      dailyReportsSubmitted: 91.3,
      photoDocumentation: 88.9,
      timelyReporting: 86.7,
      reportAccuracy: 87.2,
      communicationScore: 4.1
    }
  }
}

export function SiteMateMetrics({ partnerId }: SiteMateMetricsProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // Simulate API call to SiteMate
    const fetchSiteMateData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1400))
      
      const partnerData = mockSiteMateData[partnerId as keyof typeof mockSiteMateData] || mockSiteMateData["tp-001"]
      setData(partnerData)
      setLoading(false)
    }

    fetchSiteMateData()
  }, [partnerId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            SiteMate Metrics
            <Badge variant="secondary" className="ml-auto">Loading...</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-2 bg-muted rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-2 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getSafetyRating = (ltir: number) => {
    if (ltir <= 1.0) return { label: "Excellent", color: "text-green-600" }
    if (ltir <= 2.0) return { label: "Good", color: "text-blue-600" }
    if (ltir <= 3.0) return { label: "Fair", color: "text-yellow-600" }
    return { label: "Needs Improvement", color: "text-red-600" }
  }

  const safetyRating = getSafetyRating(data.safetyMetrics.ltir)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
          <Activity className="h-5 w-5" />
          SiteMate Metrics
          <Badge variant="secondary" className="ml-auto bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
            Live Data
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Safety Metrics */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Safety Performance
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Safety Rating</span>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${safetyRating.color}`}>
                  {safetyRating.label}
                </span>
                <Badge variant="secondary" className={
                  data.safetyMetrics.ltir <= 1.0 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : data.safetyMetrics.ltir <= 2.0
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                }>
                  LTIR: {data.safetyMetrics.ltir}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-muted-foreground">TRIR</div>
                <div className="font-medium">{data.safetyMetrics.trir}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Near Miss Reports</div>
                <div className="font-medium text-green-600">{data.safetyMetrics.nearMissReports}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Safety Meeting Attendance</div>
                <div className="font-medium">{data.safetyMetrics.safetyMeetingsAttendance}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Incident Reports</div>
                <div className="font-medium flex items-center gap-1">
                  {data.safetyMetrics.incidentReports}
                  {data.safetyMetrics.incidentReports <= 2 ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Safety Training Hours</div>
                <div className="font-medium">{data.safetyMetrics.safetyTrainingHours}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Metrics */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Operational Performance
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Workforce Productivity</span>
              <span className="font-medium">{data.operationalMetrics.workforceProductivity}%</span>
            </div>
            <Progress value={data.operationalMetrics.workforceProductivity} className="h-2" />
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-muted-foreground">Equipment Utilization</div>
                <div className="flex items-center gap-2">
                  <Progress value={data.operationalMetrics.equipmentUtilization} className="h-1 flex-1" />
                  <span className="font-medium">{data.operationalMetrics.equipmentUtilization}%</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Energy Efficiency</div>
                <div className="flex items-center gap-2">
                  <Progress value={data.operationalMetrics.energyEfficiency} className="h-1 flex-1" />
                  <span className="font-medium">{data.operationalMetrics.energyEfficiency}%</span>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Material Waste Reduction</div>
                <div className="font-medium text-green-600">{data.operationalMetrics.materialWasteReduction}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Digital Adoption</div>
                <div className="font-medium">{data.operationalMetrics.digitalAdoption}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Metrics */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Quality Performance
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-muted-foreground">Defect Rate</div>
              <div className="font-medium flex items-center gap-1">
                {data.qualityMetrics.defectRate}%
                {data.qualityMetrics.defectRate <= 3 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Rework Percentage</div>
              <div className="font-medium">{data.qualityMetrics.reworkPercentage}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Customer Satisfaction</div>
              <div className="font-medium">{data.qualityMetrics.customerSatisfaction}/5</div>
            </div>
            <div>
              <div className="text-muted-foreground">First Time Quality</div>
              <div className="font-medium">{data.qualityMetrics.firstTimeQuality}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Quality Audits Score</div>
              <div className="font-medium">{data.qualityMetrics.qualityAuditsScore}%</div>
            </div>
          </div>
        </div>

        {/* Field Reporting */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Field Reporting
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-muted-foreground">Daily Reports Submitted</div>
              <div className="font-medium">{data.fieldReporting.dailyReportsSubmitted}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Photo Documentation</div>
              <div className="font-medium">{data.fieldReporting.photoDocumentation}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Timely Reporting</div>
              <div className="font-medium">{data.fieldReporting.timelyReporting}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Report Accuracy</div>
              <div className="font-medium">{data.fieldReporting.reportAccuracy}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Communication Score</div>
              <div className="font-medium flex items-center gap-1">
                {data.fieldReporting.communicationScore}/5
                {data.fieldReporting.communicationScore >= 4.5 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : data.fieldReporting.communicationScore >= 3.5 ? (
                  <TrendingUp className="h-3 w-3 text-yellow-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 text-xs text-muted-foreground border-t">
          <div className="flex items-center justify-between">
            <span>Data Source: SiteMate API</span>
            <span>Last Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 