"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  TrendingUp,
  TrendingDown,
  Target,
  Award
} from "lucide-react"

interface CompassMetricsProps {
  partnerId: string
}

// Mock Compass API data
const mockCompassData = {
  "tp-001": {
    riskAssessment: {
      overallRiskScore: 2.1, // Lower is better (1-5 scale)
      financialRisk: 1.8,
      operationalRisk: 2.3,
      complianceRisk: 2.2,
      insuranceRisk: 1.9
    },
    complianceMetrics: {
      safetyCompliance: 96.8,
      environmentalCompliance: 94.2,
      qualityCompliance: 97.5,
      regulatoryCompliance: 95.1,
      overallComplianceScore: 95.9
    },
    certificationStatus: {
      current: 8,
      expired: 0,
      expiringSoon: 2,
      total: 10
    },
    auditResults: {
      lastAuditScore: 92.5,
      improvementItems: 3,
      criticalFindings: 0,
      auditFrequency: "Quarterly"
    }
  },
  "tp-002": {
    riskAssessment: {
      overallRiskScore: 2.8,
      financialRisk: 3.1,
      operationalRisk: 2.7,
      complianceRisk: 2.5,
      insuranceRisk: 2.9
    },
    complianceMetrics: {
      safetyCompliance: 89.2,
      environmentalCompliance: 91.8,
      qualityCompliance: 88.6,
      regulatoryCompliance: 90.4,
      overallComplianceScore: 90.0
    },
    certificationStatus: {
      current: 6,
      expired: 1,
      expiringSoon: 1,
      total: 8
    },
    auditResults: {
      lastAuditScore: 87.3,
      improvementItems: 6,
      criticalFindings: 1,
      auditFrequency: "Semi-Annual"
    }
  }
}

export function CompassMetrics({ partnerId }: CompassMetricsProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // Simulate API call to Compass
    const fetchCompassData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      const partnerData = mockCompassData[partnerId as keyof typeof mockCompassData] || mockCompassData["tp-001"]
      setData(partnerData)
      setLoading(false)
    }

    fetchCompassData()
  }, [partnerId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compass Metrics
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

  const getRiskColor = (score: number) => {
    if (score <= 2) return "text-green-600"
    if (score <= 3) return "text-yellow-600"
    if (score <= 4) return "text-orange-600"
    return "text-red-600"
  }

  const getRiskLevel = (score: number) => {
    if (score <= 2) return "Low"
    if (score <= 3) return "Moderate"
    if (score <= 4) return "High"
    return "Critical"
  }

  const certificationCompletionRate = (data.certificationStatus.current / data.certificationStatus.total) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Compass Metrics
          <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            Live Data
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Assessment */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Risk Assessment
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Risk Score</span>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${getRiskColor(data.riskAssessment.overallRiskScore)}`}>
                  {data.riskAssessment.overallRiskScore}/5
                </span>
                <Badge variant="secondary" className={
                  data.riskAssessment.overallRiskScore <= 2 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : data.riskAssessment.overallRiskScore <= 3
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }>
                  {getRiskLevel(data.riskAssessment.overallRiskScore)}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-muted-foreground">Financial Risk</div>
                <div className={`font-medium ${getRiskColor(data.riskAssessment.financialRisk)}`}>
                  {data.riskAssessment.financialRisk}/5
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Operational Risk</div>
                <div className={`font-medium ${getRiskColor(data.riskAssessment.operationalRisk)}`}>
                  {data.riskAssessment.operationalRisk}/5
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Compliance Risk</div>
                <div className={`font-medium ${getRiskColor(data.riskAssessment.complianceRisk)}`}>
                  {data.riskAssessment.complianceRisk}/5
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Insurance Risk</div>
                <div className={`font-medium ${getRiskColor(data.riskAssessment.insuranceRisk)}`}>
                  {data.riskAssessment.insuranceRisk}/5
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Metrics */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Compliance Metrics
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Compliance Score</span>
              <span className="font-medium text-green-600">{data.complianceMetrics.overallComplianceScore}%</span>
            </div>
            <Progress value={data.complianceMetrics.overallComplianceScore} className="h-2" />
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-muted-foreground">Safety Compliance</div>
                <div className="font-medium">{data.complianceMetrics.safetyCompliance}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Environmental</div>
                <div className="font-medium">{data.complianceMetrics.environmentalCompliance}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Quality Compliance</div>
                <div className="font-medium">{data.complianceMetrics.qualityCompliance}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Regulatory</div>
                <div className="font-medium">{data.complianceMetrics.regulatoryCompliance}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Certification Status */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certification Status
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Active Certifications</span>
              <span className="font-medium">{data.certificationStatus.current}/{data.certificationStatus.total}</span>
            </div>
            <Progress value={certificationCompletionRate} className="h-2" />
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div className="text-center">
                <div className="text-green-600 font-medium">{data.certificationStatus.current}</div>
                <div>Current</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-600 font-medium">{data.certificationStatus.expiringSoon}</div>
                <div>Expiring Soon</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-medium">{data.certificationStatus.expired}</div>
                <div>Expired</div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Results */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Latest Audit Results
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-muted-foreground">Audit Score</div>
              <div className="font-medium flex items-center gap-1">
                {data.auditResults.lastAuditScore}%
                {data.auditResults.lastAuditScore >= 90 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-yellow-500" />
                )}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Audit Frequency</div>
              <div className="font-medium">{data.auditResults.auditFrequency}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Improvement Items</div>
              <div className="font-medium flex items-center gap-1">
                {data.auditResults.improvementItems}
                {data.auditResults.improvementItems <= 3 ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                )}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Critical Findings</div>
              <div className="font-medium flex items-center gap-1">
                {data.auditResults.criticalFindings}
                {data.auditResults.criticalFindings === 0 ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 text-xs text-muted-foreground border-t">
          <div className="flex items-center justify-between">
            <span>Data Source: Compass API</span>
            <span>Last Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 