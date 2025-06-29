'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  DollarSign,
  Calendar,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'

// Import mock data
import staffingData from '@/data/mock/staffing/staffing.json'
import projectsData from '@/data/mock/projects.json'
import spcrData from '@/data/mock/staffing/spcr.json'

interface ProjectStaffing {
  project: {
    project_id: number
    name: string
    project_stage_name: string
    contract_value: number
    project_number: string
  }
  staffCount: number
  totalLaborCost: number
  avgExperience: number
  productivity: number
  pendingSpcrCount: number
  staffMembers: any[]
}

export const ProjectExecutiveStaffingView = () => {
  const [projectStaffing, setProjectStaffing] = useState<ProjectStaffing[]>([])
  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  // Demo projects for PE user (6 projects)
  const demoProjectIds = [2525840, 2525841, 2525842, 2525843, 2525844, 2525845]

  useEffect(() => {
    // Calculate staffing data for each project
    const projectsWithStaffing = demoProjectIds.map(projectId => {
      const project = projectsData.find(p => p.project_id === projectId)
      if (!project) return null

      const projectStaff = staffingData.filter(staff => 
        staff.assignments.some(assignment => assignment.project_id === projectId)
      )

      const totalLaborCost = projectStaff.reduce((sum, staff) => sum + staff.laborRate, 0)
      const avgExperience = projectStaff.length > 0 
        ? projectStaff.reduce((sum, staff) => sum + staff.experience, 0) / projectStaff.length 
        : 0

      const pendingSpcrCount = spcrData.filter(spcr => 
        spcr.project_id === projectId && spcr.status === 'pending'
      ).length

      // Simulate productivity based on project stage and staff experience
      const productivity = Math.min(100, 75 + (avgExperience * 2) + Math.random() * 10)

      return {
        project,
        staffCount: projectStaff.length,
        totalLaborCost,
        avgExperience,
        productivity,
        pendingSpcrCount,
        staffMembers: projectStaff
      } as ProjectStaffing
    }).filter(Boolean) as ProjectStaffing[]

    setProjectStaffing(projectsWithStaffing)
  }, [])

  // Portfolio analytics
  const portfolioAnalytics = useMemo(() => {
    const totalStaff = projectStaffing.reduce((sum, project) => sum + project.staffCount, 0)
    const totalLaborCost = projectStaffing.reduce((sum, project) => sum + project.totalLaborCost, 0)
    const avgProductivity = projectStaffing.length > 0 
      ? projectStaffing.reduce((sum, project) => sum + project.productivity, 0) / projectStaffing.length 
      : 0
    const totalPendingSpcrCount = projectStaffing.reduce((sum, project) => sum + project.pendingSpcrCount, 0)
    const totalContractValue = projectStaffing.reduce((sum, project) => sum + project.project.contract_value, 0)

    return {
      totalStaff,
      totalLaborCost,
      avgProductivity,
      totalPendingSpcrCount,
      totalContractValue,
      projectCount: projectStaffing.length
    }
  }, [projectStaffing])

  const getProductivityBadge = (productivity: number) => {
    if (productivity >= 90) return <Badge variant="default" className="bg-green-500">Excellent</Badge>
    if (productivity >= 80) return <Badge variant="default" className="bg-blue-500">Good</Badge>
    if (productivity >= 70) return <Badge variant="secondary">Average</Badge>
    return <Badge variant="destructive">Needs Attention</Badge>
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Construction': return 'bg-blue-500'
      case 'Bidding': return 'bg-yellow-500'
      case 'Pre-Construction': return 'bg-orange-500'
      case 'Closeout': return 'bg-green-500'
      case 'Warranty': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="h-3 w-3 text-green-500" />
    if (value < 0) return <ArrowDownRight className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-gray-500" />
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Portfolio Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{portfolioAnalytics.projectCount}</div>
              <div className="text-xs text-muted-foreground">Active Projects</div>
              <div className="text-sm">
                Total Value: ${(portfolioAnalytics.totalContractValue / 1000000).toFixed(1)}M
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{portfolioAnalytics.totalStaff}</div>
              <div className="text-xs text-muted-foreground">Staff Members</div>
              <div className="flex items-center gap-1 text-sm">
                {getTrendIcon(3)}
                <span>+3 this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg Productivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{portfolioAnalytics.avgProductivity.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Portfolio Average</div>
              <div className="flex items-center gap-1 text-sm">
                {getTrendIcon(2.1)}
                <span>+2.1% vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{portfolioAnalytics.totalPendingSpcrCount}</div>
              <div className="text-xs text-muted-foreground">SPCRs to Review</div>
              <div className="flex items-center gap-1 text-sm">
                {getTrendIcon(-2)}
                <span>-2 from last week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Project Overview</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="planning">Resource Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Project Staffing Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectStaffing.map((project) => (
                  <Card key={project.project.project_id} className="border-l-4" style={{borderLeftColor: getStageColor(project.project.project_stage_name)}}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div className="md:col-span-2">
                          <div className="font-medium">{project.project.name}</div>
                          <div className="text-sm text-muted-foreground">{project.project.project_number}</div>
                          <Badge variant="outline" className="mt-1">
                            {project.project.project_stage_name}
                          </Badge>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold">{project.staffCount}</div>
                          <div className="text-xs text-muted-foreground">Staff</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold">${(project.totalLaborCost * 40 / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-muted-foreground">Weekly Cost</div>
                        </div>
                        
                        <div className="text-center">
                          {getProductivityBadge(project.productivity)}
                          <div className="text-xs text-muted-foreground mt-1">{project.productivity.toFixed(1)}%</div>
                        </div>
                        
                        <div className="text-center">
                          {project.pendingSpcrCount > 0 ? (
                            <Badge variant="secondary" className="w-full">
                              {project.pendingSpcrCount} Pending
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="w-full">
                              No Requests
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Productivity Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectStaffing.map((project) => (
                    <div key={project.project.project_id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="truncate font-medium">{project.project.name}</span>
                        <span>{project.productivity.toFixed(1)}%</span>
                      </div>
                      <Progress value={project.productivity} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Labor Cost Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectStaffing.map((project) => (
                    <div key={project.project.project_id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">{project.project.name}</div>
                        <div className="text-xs text-muted-foreground">{project.staffCount} staff</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${(project.totalLaborCost * 40 / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-muted-foreground">per week</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Staffing Efficiency Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {projectStaffing.filter(p => p.productivity >= 90).length}
                  </div>
                  <div className="text-sm text-muted-foreground">High Performance</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {projectStaffing.filter(p => p.productivity >= 70 && p.productivity < 90).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Needs Optimization</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {projectStaffing.filter(p => p.productivity < 70).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Requires Attention</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Resource Planning & Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Upcoming Staffing Needs</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-2 border rounded">
                        <span className="text-sm">Palm Beach Luxury Estate</span>
                        <Badge variant="outline">+2 Superintendents (Mar 2025)</Badge>
                      </div>
                      <div className="flex justify-between p-2 border rounded">
                        <span className="text-sm">Miami Commercial Tower</span>
                        <Badge variant="outline">+5 Project Managers (Apr 2025)</Badge>
                      </div>
                      <div className="flex justify-between p-2 border rounded">
                        <span className="text-sm">Orlando Retail Complex</span>
                        <Badge variant="outline">-3 Staff (Closeout Q2)</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Resource Recommendations</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <div className="text-sm font-medium text-blue-800">Optimize Productivity</div>
                        <div className="text-xs text-blue-600">Consider additional QC staff for low-performing projects</div>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded">
                        <div className="text-sm font-medium text-green-800">Cost Efficiency</div>
                        <div className="text-xs text-green-600">Redistribute senior staff to maximize billable rates</div>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="text-sm font-medium text-yellow-800">Capacity Planning</div>
                        <div className="text-xs text-yellow-600">Prepare for Q2 project transitions</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-1" />
                      Staff Reallocation
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Performance Review
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule Forecast
                    </Button>
                    <Button variant="outline" size="sm">
                      <Target className="h-4 w-4 mr-1" />
                      Capacity Planning
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 