"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Shield,
  Award,
  AlertTriangle,
  Building,
  Users,
  FileText,
  ChevronUp,
  ChevronDown
} from "lucide-react"

// Import utility components for API integration
import { ProcoreMetrics } from "./api-integrations/ProcoreMetrics"
import { CompassMetrics } from "./api-integrations/CompassMetrics"
import { BuildingConnectedMetrics } from "./api-integrations/BuildingConnectedMetrics"
import { SiteMateMetrics } from "./api-integrations/SiteMateMetrics"

interface TradePartnerScorecardProps {
  partner: any
}

export function TradePartnerScorecard({ partner }: TradePartnerScorecardProps) {
  const [activeMetricTab, setActiveMetricTab] = useState("overview")

  // Performance trend calculations
  const getPerformanceTrend = (current: number, historical: number) => {
    const trend = ((current - historical) / historical) * 100
    return {
      value: Math.abs(trend).toFixed(1),
      isPositive: trend > 0,
      icon: trend > 0 ? ChevronUp : ChevronDown,
      color: trend > 0 ? "text-green-500" : "text-red-500"
    }
  }

  // Mock historical data for trend calculations
  const historicalMetrics = {
    overallRating: 4.5,
    completionRate: 95.0,
    onTimeDelivery: 90.0,
    budgetAdherence: 94.0,
    qualityScore: 4.6,
    safetyScore: 4.7
  }

  const performanceMetrics = [
    {
      label: "Overall Rating",
      current: partner.performance.overallRating,
      max: 5,
      unit: "/5",
      trend: getPerformanceTrend(partner.performance.overallRating, historicalMetrics.overallRating),
      color: "text-[#FF6B35]",
      bgColor: "bg-[#FF6B35]"
    },
    {
      label: "Completion Rate",
      current: partner.performance.completionRate,
      max: 100,
      unit: "%",
      trend: getPerformanceTrend(partner.performance.completionRate, historicalMetrics.completionRate),
      color: "text-green-600",
      bgColor: "bg-green-600"
    },
    {
      label: "On-Time Delivery",
      current: partner.performance.onTimeDelivery,
      max: 100,
      unit: "%",
      trend: getPerformanceTrend(partner.performance.onTimeDelivery, historicalMetrics.onTimeDelivery),
      color: "text-blue-600",
      bgColor: "bg-blue-600"
    },
    {
      label: "Budget Adherence",
      current: partner.performance.budgetAdherence,
      max: 100,
      unit: "%",
      trend: getPerformanceTrend(partner.performance.budgetAdherence, historicalMetrics.budgetAdherence),
      color: "text-purple-600",
      bgColor: "bg-purple-600"
    },
    {
      label: "Quality Score",
      current: partner.performance.qualityScore,
      max: 5,
      unit: "/5",
      trend: getPerformanceTrend(partner.performance.qualityScore, historicalMetrics.qualityScore),
      color: "text-indigo-600",
      bgColor: "bg-indigo-600"
    },
    {
      label: "Safety Score",
      current: partner.performance.safetyScore,
      max: 5,
      unit: "/5",
      trend: getPerformanceTrend(partner.performance.safetyScore, historicalMetrics.safetyScore),
      color: "text-red-600",
      bgColor: "bg-red-600"
    }
  ]

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-yellow-600"
    if (percentage >= 70) return "text-orange-600"
    return "text-red-600"
  }

  const getRatingStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
            ? "text-yellow-400 fill-current opacity-50"
            : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <Card className="border-l-4 border-l-[#003087]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-[#003087] dark:text-white">
                Performance Scorecard
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {new Date(partner.performance.lastUpdated).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                {getRatingStars(partner.performance.overallRating)}
                <span className="text-lg font-bold text-[#FF6B35]">
                  {partner.performance.overallRating}
                </span>
              </div>
              <Badge variant="secondary" className="bg-[#003087] text-white">
                {partner.tier} Partner
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </p>
                <div className={`flex items-center gap-1 ${metric.trend.color}`}>
                  <metric.trend.icon className="h-3 w-3" />
                  <span className="text-xs">{metric.trend.value}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${getScoreColor(metric.current, metric.max)}`}>
                    {metric.current}{metric.unit}
                  </span>
                </div>
                <Progress 
                  value={(metric.current / metric.max) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Metrics Tabs */}
      <Tabs value={activeMetricTab} onValueChange={setActiveMetricTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Portfolio */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Project Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Projects</span>
                    <span className="font-medium">{partner.performance.totalProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Projects</span>
                    <span className="font-medium text-green-600">{partner.performance.activeProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">{partner.performance.completionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Years in Business</span>
                    <span className="font-medium">{partner.businessInfo.yearsInBusiness}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Employee Count</span>
                    <span className="font-medium">{partner.businessInfo.employeeCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications & Specialties */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certifications & Specialties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {partner.certifications.map((cert: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {partner.specialties.map((specialty: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">License Number</p>
                  <p className="font-medium">{partner.businessInfo.licenseNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Insurance Expiry</p>
                  <p className="font-medium">{partner.businessInfo.insuranceExpiry}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Bonding Capacity</p>
                  <p className="font-medium">{partner.businessInfo.bondingCapacity}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Trade Type</p>
                  <Badge variant="outline">{partner.tradeType}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Procore Financial Metrics */}
            <ProcoreMetrics partnerId={partner.id} />
            
            {/* Compass Financial Data */}
            <CompassMetrics partnerId={partner.id} />
          </div>
        </TabsContent>

        {/* Operational Tab */}
        <TabsContent value="operational" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BuildingConnected Metrics */}
            <BuildingConnectedMetrics partnerId={partner.id} />
            
            {/* SiteMate Operational Data */}
            <SiteMateMetrics partnerId={partner.id} />
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Safety Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">OSHA Compliance</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Safety Training</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Insurance Current</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">License Valid</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">W-9 Form</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Certificate of Insurance</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">License Documentation</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bonding Documents</span>
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Renewals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-l-yellow-500">
                    <p className="text-sm font-medium">Insurance Renewal</p>
                    <p className="text-xs text-muted-foreground">{partner.businessInfo.insuranceExpiry}</p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-l-green-500">
                    <p className="text-sm font-medium">License Renewal</p>
                    <p className="text-xs text-muted-foreground">Valid through 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 