"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  Building,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

interface ProcoreMetricsProps {
  partnerId: string
}

// Mock Procore API data
const mockProcoreData = {
  "tp-001": {
    projectCompletions: {
      onTime: 18,
      late: 2,
      early: 3,
      total: 23
    },
    financialPerformance: {
      totalContractValue: 12500000,
      paidToDate: 9800000,
      outstandingAmount: 2700000,
      changeOrderValue: 1250000,
      avgPaymentDays: 28
    },
    schedulePerformance: {
      milestoneAdherence: 94.2,
      criticalPathVariance: 3.2,
      resourceUtilization: 87.5
    },
    qualityMetrics: {
      punchListItems: 45,
      rfiCount: 12,
      rfiResponseTime: 2.8,
      inspectionPassRate: 92.5
    }
  },
  "tp-002": {
    projectCompletions: {
      onTime: 14,
      late: 3,
      early: 1,
      total: 18
    },
    financialPerformance: {
      totalContractValue: 8900000,
      paidToDate: 7200000,
      outstandingAmount: 1700000,
      changeOrderValue: 890000,
      avgPaymentDays: 32
    },
    schedulePerformance: {
      milestoneAdherence: 88.9,
      criticalPathVariance: 5.1,
      resourceUtilization: 82.3
    },
    qualityMetrics: {
      punchListItems: 67,
      rfiCount: 18,
      rfiResponseTime: 3.5,
      inspectionPassRate: 87.2
    }
  }
}

export function ProcoreMetrics({ partnerId }: ProcoreMetricsProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // Simulate API call to Procore
    const fetchProcoreData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Get mock data or default values
      const partnerData = mockProcoreData[partnerId as keyof typeof mockProcoreData] || mockProcoreData["tp-001"]
      setData(partnerData)
      setLoading(false)
    }

    fetchProcoreData()
  }, [partnerId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
            <Building className="h-5 w-5" />
            Procore Metrics
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
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-2 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const onTimePercentage = (data.projectCompletions.onTime / data.projectCompletions.total) * 100
  const paymentCompletionPercentage = (data.financialPerformance.paidToDate / data.financialPerformance.totalContractValue) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
          <Building className="h-5 w-5" />
          Procore Metrics
          <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Live Data
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Completion Performance */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Project Completion Performance
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>On-Time Completions</span>
              <span className="font-medium">{data.projectCompletions.onTime}/{data.projectCompletions.total}</span>
            </div>
            <Progress value={onTimePercentage} className="h-2" />
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div className="text-center">
                <div className="text-green-600 font-medium">{data.projectCompletions.early}</div>
                <div>Early</div>
              </div>
              <div className="text-center">
                <div className="text-blue-600 font-medium">{data.projectCompletions.onTime}</div>
                <div>On Time</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-medium">{data.projectCompletions.late}</div>
                <div>Late</div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Performance */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial Performance
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Payment Completion</span>
              <span className="font-medium">{paymentCompletionPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={paymentCompletionPercentage} className="h-2" />
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-muted-foreground">Total Contract Value</div>
                <div className="font-medium">${(data.financialPerformance.totalContractValue / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <div className="text-muted-foreground">Outstanding</div>
                <div className="font-medium">${(data.financialPerformance.outstandingAmount / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <div className="text-muted-foreground">Change Orders</div>
                <div className="font-medium">${(data.financialPerformance.changeOrderValue / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <div className="text-muted-foreground">Avg Payment Days</div>
                <div className="font-medium flex items-center gap-1">
                  {data.financialPerformance.avgPaymentDays}
                  {data.financialPerformance.avgPaymentDays <= 30 ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Performance */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Schedule Performance
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Milestone Adherence</span>
              <span className="font-medium">{data.schedulePerformance.milestoneAdherence}%</span>
            </div>
            <Progress value={data.schedulePerformance.milestoneAdherence} className="h-2" />
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-muted-foreground">Critical Path Variance</div>
                <div className="font-medium flex items-center gap-1">
                  {data.schedulePerformance.criticalPathVariance} days
                  {data.schedulePerformance.criticalPathVariance <= 5 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Resource Utilization</div>
                <div className="font-medium">{data.schedulePerformance.resourceUtilization}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Metrics */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Quality Metrics
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-muted-foreground">Punch List Items</div>
              <div className="font-medium">{data.qualityMetrics.punchListItems}</div>
            </div>
            <div>
              <div className="text-muted-foreground">RFI Count</div>
              <div className="font-medium">{data.qualityMetrics.rfiCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground">RFI Response Time</div>
              <div className="font-medium">{data.qualityMetrics.rfiResponseTime} days</div>
            </div>
            <div>
              <div className="text-muted-foreground">Inspection Pass Rate</div>
              <div className="font-medium">{data.qualityMetrics.inspectionPassRate}%</div>
            </div>
          </div>
        </div>

        <div className="pt-2 text-xs text-muted-foreground border-t">
          <div className="flex items-center justify-between">
            <span>Data Source: Procore API</span>
            <span>Last Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 