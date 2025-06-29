"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Ruler,
  Users,
  Target,
  Activity,
  Brain,
  Zap,
  Home,
  Building2,
  RefreshCw,
  Download,
  Plus,
  BarChart3,
  PieChart,
  Trophy,
  Eye,
  Percent,
  HelpCircle,
  Upload,
  MessageSquare,
  Building,
  Grid,
  Search,
  ArrowLeft,
  Settings,
  Layers,
  ClipboardList,
  Hammer,
  DollarSign as Money,
  UserCheck,
  Package,
  Gavel,
  Scale
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Import all estimating components
import { EstimatingProvider } from "@/components/estimating/EstimatingProvider"
import { QuantityTakeoffDashboard } from "@/components/estimating/QuantityTakeoffDashboard"
import { BidManagementCenter } from "@/components/estimating/BidManagementCenter"
import { CostAnalyticsDashboard } from "@/components/estimating/CostAnalyticsDashboard"
import { EstimatingIntelligence } from "@/components/estimating/EstimatingIntelligence"
import { ProjectEstimateOverview } from "@/components/estimating/ProjectEstimateOverview"
import ClarificationsAssumptions from "@/components/estimating/ClarificationsAssumptions"
import DocumentLog from "@/components/estimating/DocumentLog"
import TradePartnerLog from '@/components/estimating/TradePartnerLog'
import AllowancesLog from '@/components/estimating/AllowancesLog'
import GCGRLog from '@/components/estimating/GCGRLog'
import { BidLeveling } from '@/components/estimating/BidLeveling'
import BidTabManagement from '@/components/estimating/BidTabManagement'
import { CostSummaryModule } from '@/components/estimating/CostSummaryModule'
import { AreaCalculationsModule } from '@/components/estimating/AreaCalculationsModule'

// Import mock data
import projectsData from "@/data/mock/projects.json"

export default function ProjectEstimatePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const projectId = params.projectId as string

  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)

  // Find the specific project
  const project = useMemo(() => {
    return projectsData.find(p => p.project_id?.toString() === projectId)
  }, [projectId])

  // Handle URL hash navigation
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && [
      'overview', 'takeoff', 'bidding', 'cost-summary', 'area-calc', 'analytics', 
      'intelligence', 'clarifications', 'documents', 'trade-partners', 'allowances', 
      'gc-gr', 'bid-leveling', 'bid-tabs'
    ].includes(hash)) {
      setActiveTab(hash)
    }
  }, [])

  // Update URL when tab changes
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue)
    window.history.replaceState(null, '', `#${tabValue}`)
  }

  // Handle back navigation
  const handleBackToProjects = () => {
    router.push('/projects')
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    window.location.reload()
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  The project with ID "{projectId}" could not be found.
                </p>
                <Button onClick={handleBackToProjects}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Calculate project status and progress
  const projectProgress = useMemo(() => {
    const stage = project.project_stage_name
    let progress = 0
    let status = 'In Progress'
    
    switch (stage) {
      case 'Pre-Construction':
        progress = 25
        status = 'Planning'
        break
      case 'Bidding':
        progress = 60
        status = 'Bidding'
        break
      case 'BIM Coordination':
        progress = 80
        status = 'Coordination'
        break
      case 'Construction':
        progress = 100
        status = 'Awarded'
        break
      default:
        progress = 10
        status = 'Initial'
    }
    
    return { progress, status }
  }, [project])

  return (
    <EstimatingProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <AppHeader />
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={handleBackToProjects}
                  className="cursor-pointer hover:text-primary"
                >
                  Projects
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Project Estimate</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Project Header */}
          <div className="mb-8">
            <Card className="border-2 border-primary/10 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="h-6 w-6 text-primary" />
                      <h1 className="text-2xl font-bold text-foreground">
                        {project.name || project.display_name || 'Untitled Project'}
                      </h1>
                      <Badge variant="secondary" className="ml-2">
                        {project.project_stage_name}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium">{project.project_type_name || project.work_scope || 'N/A'}</p>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Value:</span>
                        <p className="font-medium">
                          {project.contract_value ? `$${project.contract_value.toLocaleString()}` : 'TBD'}
                        </p>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Location:</span>
                        <p className="font-medium">
                          {`${project.city || ''} ${project.state_code || ''}`.trim() || 'N/A'}
                        </p>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Square Footage:</span>
                        <p className="font-medium">
                          {project.square_feet ? `${project.square_feet.toLocaleString()} SF` : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Estimate Progress</span>
                        <span className="font-medium">{projectProgress.progress}% Complete</span>
                      </div>
                      <Progress value={projectProgress.progress} className="h-2" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleRefresh}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button onClick={handleBackToProjects} variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Projects
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Estimating Interface */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid grid-cols-7 lg:grid-cols-14 w-full mb-6">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="takeoff" className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    <span className="hidden sm:inline">Takeoff</span>
                  </TabsTrigger>
                  <TabsTrigger value="bidding" className="flex items-center gap-2">
                    <Gavel className="h-4 w-4" />
                    <span className="hidden sm:inline">Bidding</span>
                  </TabsTrigger>
                  <TabsTrigger value="cost-summary" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    <span className="hidden sm:inline">Cost Summary</span>
                  </TabsTrigger>
                  <TabsTrigger value="area-calc" className="flex items-center gap-2">
                    <Grid className="h-4 w-4" />
                    <span className="hidden sm:inline">Area Calc</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="intelligence" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span className="hidden sm:inline">AI Insights</span>
                  </TabsTrigger>
                  <TabsTrigger value="clarifications" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Clarifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Documents</span>
                  </TabsTrigger>
                  <TabsTrigger value="trade-partners" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Trade Partners</span>
                  </TabsTrigger>
                  <TabsTrigger value="allowances" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="hidden sm:inline">Allowances</span>
                  </TabsTrigger>
                  <TabsTrigger value="gc-gr" className="flex items-center gap-2">
                    <Hammer className="h-4 w-4" />
                    <span className="hidden sm:inline">GC/GR</span>
                  </TabsTrigger>
                  <TabsTrigger value="bid-leveling" className="flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    <span className="hidden sm:inline">Bid Leveling</span>
                  </TabsTrigger>
                  <TabsTrigger value="bid-tabs" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    <span className="hidden sm:inline">Bid Tabs</span>
                  </TabsTrigger>
                </TabsList>

                {/* Tab Content */}
                <TabsContent value="overview" className="space-y-6">
                  <ProjectEstimateOverview />
                </TabsContent>

                <TabsContent value="takeoff" className="space-y-6">
                  <QuantityTakeoffDashboard />
                </TabsContent>

                <TabsContent value="bidding" className="space-y-6">
                  <BidManagementCenter />
                </TabsContent>

                <TabsContent value="cost-summary" className="space-y-6">
                  <CostSummaryModule />
                </TabsContent>

                <TabsContent value="area-calc" className="space-y-6">
                  <AreaCalculationsModule />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <CostAnalyticsDashboard />
                </TabsContent>

                <TabsContent value="intelligence" className="space-y-6">
                  <EstimatingIntelligence />
                </TabsContent>

                <TabsContent value="clarifications" className="space-y-6">
                  <ClarificationsAssumptions />
                </TabsContent>

                <TabsContent value="documents" className="space-y-6">
                  <DocumentLog />
                </TabsContent>

                <TabsContent value="trade-partners" className="space-y-6">
                  <TradePartnerLog />
                </TabsContent>

                <TabsContent value="allowances" className="space-y-6">
                  <AllowancesLog />
                </TabsContent>

                <TabsContent value="gc-gr" className="space-y-6">
                  <GCGRLog />
                </TabsContent>

                <TabsContent value="bid-leveling" className="space-y-6">
                  <BidLeveling />
                </TabsContent>

                <TabsContent value="bid-tabs" className="space-y-6">
                  <BidTabManagement />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </EstimatingProvider>
  )
} 