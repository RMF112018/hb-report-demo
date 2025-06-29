"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  DollarSign,
  Users,
  CheckCircle
} from "lucide-react"

interface BuildingConnectedMetricsProps {
  partnerId: string
}

// Mock BuildingConnected API data
const mockBuildingConnectedData = {
  "tp-001": {
    biddingPerformance: {
      totalBids: 47,
      wonBids: 23,
      winRate: 48.9,
      avgBidAccuracy: 94.2,
      avgResponseTime: 4.8 // days
    },
    procurementMetrics: {
      onTimeSubmissions: 92.3,
      documentCompleteness: 96.7,
      changeOrderFrequency: 8.2, // percentage
      valueEngineering: 145000, // dollars saved
      avgLeadTime: 12.5 // days
    },
    bidAnalytics: {
      competitivenessScore: 87.5,
      pricingAccuracy: 91.2,
      technicalScore: 94.1,
      proposalQuality: 89.7
    },
    relationshipMetrics: {
      gcRelationships: 18,
      repeatBusinessRate: 78.3,
      referralScore: 4.6,
      communicationRating: 4.4
    }
  },
  "tp-002": {
    biddingPerformance: {
      totalBids: 32,
      wonBids: 14,
      winRate: 43.8,
      avgBidAccuracy: 88.9,
      avgResponseTime: 6.2
    },
    procurementMetrics: {
      onTimeSubmissions: 85.7,
      documentCompleteness: 91.2,
      changeOrderFrequency: 12.8,
      valueEngineering: 89000,
      avgLeadTime: 15.2
    },
    bidAnalytics: {
      competitivenessScore: 82.1,
      pricingAccuracy: 86.4,
      technicalScore: 88.9,
      proposalQuality: 84.2
    },
    relationshipMetrics: {
      gcRelationships: 12,
      repeatBusinessRate: 66.7,
      referralScore: 4.1,
      communicationRating: 4.0
    }
  }
}

export function BuildingConnectedMetrics({ partnerId }: BuildingConnectedMetricsProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // Simulate API call to BuildingConnected
    const fetchBuildingConnectedData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1300))
      
      const partnerData = mockBuildingConnectedData[partnerId as keyof typeof mockBuildingConnectedData] || mockBuildingConnectedData["tp-001"]
      setData(partnerData)
      setLoading(false)
    }

    fetchBuildingConnectedData()
  }, [partnerId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            BuildingConnected Metrics
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
          <FileText className="h-5 w-5" />
          BuildingConnected Metrics
          <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Live Data
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bidding Performance */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Bidding Performance
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Win Rate</span>
              <span className="font-medium">{data.biddingPerformance.winRate}%</span>
            </div>
            <Progress value={data.biddingPerformance.winRate} className="h-2" />
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-muted-foreground">Total Bids</div>
                <div className="font-medium">{data.biddingPerformance.totalBids}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Won Bids</div>
                <div className="font-medium text-green-600">{data.biddingPerformance.wonBids}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Bid Accuracy</div>
                <div className="font-medium">{data.biddingPerformance.avgBidAccuracy}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Avg Response Time</div>
                <div className="font-medium flex items-center gap-1">
                  {data.biddingPerformance.avgResponseTime} days
                  {data.biddingPerformance.avgResponseTime <= 5 ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Clock className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Procurement Metrics */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Procurement Performance
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>On-Time Submissions</span>
              <span className="font-medium">{data.procurementMetrics.onTimeSubmissions}%</span>
            </div>
            <Progress value={data.procurementMetrics.onTimeSubmissions} className="h-2" />
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-muted-foreground">Document Completeness</div>
                <div className="font-medium">{data.procurementMetrics.documentCompleteness}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Change Order Frequency</div>
                <div className="font-medium">{data.procurementMetrics.changeOrderFrequency}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Value Engineering Savings</div>
                <div className="font-medium text-green-600">
                  ${(data.procurementMetrics.valueEngineering / 1000).toFixed(0)}K
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Avg Lead Time</div>
                <div className="font-medium">{data.procurementMetrics.avgLeadTime} days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bid Analytics */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Bid Analytics
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <div className="text-muted-foreground">Competitiveness Score</div>
              <div className="flex items-center gap-2">
                <Progress value={data.bidAnalytics.competitivenessScore} className="h-1 flex-1" />
                <span className="font-medium">{data.bidAnalytics.competitivenessScore}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Pricing Accuracy</div>
              <div className="flex items-center gap-2">
                <Progress value={data.bidAnalytics.pricingAccuracy} className="h-1 flex-1" />
                <span className="font-medium">{data.bidAnalytics.pricingAccuracy}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Technical Score</div>
              <div className="flex items-center gap-2">
                <Progress value={data.bidAnalytics.technicalScore} className="h-1 flex-1" />
                <span className="font-medium">{data.bidAnalytics.technicalScore}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Proposal Quality</div>
              <div className="flex items-center gap-2">
                <Progress value={data.bidAnalytics.proposalQuality} className="h-1 flex-1" />
                <span className="font-medium">{data.bidAnalytics.proposalQuality}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Relationship Metrics */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Relationship Metrics
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-muted-foreground">GC Relationships</div>
              <div className="font-medium">{data.relationshipMetrics.gcRelationships}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Repeat Business Rate</div>
              <div className="font-medium">{data.relationshipMetrics.repeatBusinessRate}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Referral Score</div>
              <div className="font-medium flex items-center gap-1">
                {data.relationshipMetrics.referralScore}/5
                {data.relationshipMetrics.referralScore >= 4.5 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : data.relationshipMetrics.referralScore >= 3.5 ? (
                  <TrendingUp className="h-3 w-3 text-yellow-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Communication Rating</div>
              <div className="font-medium">{data.relationshipMetrics.communicationRating}/5</div>
            </div>
          </div>
        </div>

        <div className="pt-2 text-xs text-muted-foreground border-t">
          <div className="flex items-center justify-between">
            <span>Data Source: BuildingConnected API</span>
            <span>Last Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 