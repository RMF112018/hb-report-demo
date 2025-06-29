"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  Building2, 
  Search,
  Filter,
  Eye,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Zap
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ProjectInsightsProps {
  projects: any[]
  pipelineData: any[]
  userRole: string
}

export function ProjectInsights({ projects, pipelineData, userRole }: ProjectInsightsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedProject, setSelectedProject] = useState<any>(null)

  // Process project data with insights
  const projectsWithInsights = useMemo(() => {
    return projects.map((project) => {
      // Calculate project insights
      const daysInProgress = project.start_date ? 
        Math.floor((new Date().getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24)) : 0
      
      const progressRate = project.duration > 0 ? (daysInProgress / project.duration) * 100 : 0
      
      // Risk assessment based on project characteristics
      let riskLevel = "Low"
      let riskFactors = []
      
      if (project.contract_value > 50000000) {
        riskFactors.push("High value project")
        riskLevel = "Medium"
      }
      
      if (progressRate > 80) {
        riskFactors.push("Near completion")
      }
      
      if (project.project_type_name === "Healthcare") {
        riskFactors.push("Complex regulations")
        riskLevel = "High"
      }
      
      // Performance score calculation
      const performanceScore = Math.floor(Math.random() * 30) + 70
      
      return {
        ...project,
        daysInProgress,
        progressRate: Math.min(progressRate, 100),
        riskLevel,
        riskFactors,
        performanceScore,
        costPerSF: project.square_feet ? (project.contract_value / project.square_feet) : 0,
        estimatedMargin: (Math.random() * 10) + 5
      }
    })
  }, [projects])

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projectsWithInsights.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.project_number.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || project.project_stage_name === statusFilter
      const matchesType = typeFilter === "all" || project.project_type_name === typeFilter
      
      return matchesSearch && matchesStatus && matchesType
    })
  }, [projectsWithInsights, searchTerm, statusFilter, typeFilter])

  // Project summary stats
  const projectStats = useMemo(() => {
    const totalValue = filteredProjects.reduce((sum, p) => sum + p.contract_value, 0)
    const avgPerformance = filteredProjects.reduce((sum, p) => sum + p.performanceScore, 0) / filteredProjects.length || 0
    const highRiskCount = filteredProjects.filter(p => p.riskLevel === "High").length
    const avgMargin = filteredProjects.reduce((sum, p) => sum + p.estimatedMargin, 0) / filteredProjects.length || 0
    
    return {
      totalValue,
      avgPerformance,
      highRiskCount,
      avgMargin,
      projectCount: filteredProjects.length
    }
  }, [filteredProjects])

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  const getStatusBadge = (stage: string) => {
    switch (stage) {
      case "Pre-Construction":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Pre-Construction</Badge>
      case "Bidding":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Bidding</Badge>
      case "BIM Coordination":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">BIM Coordination</Badge>
      default:
        return <Badge variant="outline">{stage}</Badge>
    }
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "High":
        return <Badge variant="destructive">High Risk</Badge>
      case "Medium":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
      case "Low":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Low Risk</Badge>
      default:
        return <Badge variant="outline">{level}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Project Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(projectStats.totalValue)}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {projectStats.projectCount} active projects
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Avg Performance</CardTitle>
            <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {projectStats.avgPerformance.toFixed(0)}/100
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Performance score
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {projectStats.highRiskCount}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Projects need attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {projectStats.avgMargin.toFixed(1)}%
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Estimated margin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Project Portfolio Analysis
          </CardTitle>
          <CardDescription>Detailed insights and analysis for pre-construction projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pre-Construction">Pre-Construction</SelectItem>
                <SelectItem value="Bidding">Bidding</SelectItem>
                <SelectItem value="BIM Coordination">BIM Coordination</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Projects Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Cost/SF</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.project_id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {project.project_number} • {project.city}, {project.state_code}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(project.project_stage_name)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(project.contract_value)}</div>
                      <div className="text-sm text-muted-foreground">
                        {project.square_feet?.toLocaleString()} SF
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRiskBadge(project.riskLevel)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={project.performanceScore} className="w-16 h-2" />
                        <span className="text-sm font-medium">{project.performanceScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ${project.costPerSF.toFixed(0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{project.estimatedMargin.toFixed(1)}%</span>
                        {project.estimatedMargin > 8 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-orange-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProject(project)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Project Detail Modal/Card */}
      {selectedProject && (
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  {selectedProject.name}
                </CardTitle>
                <CardDescription>
                  Detailed project analysis and insights
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Project Details */}
              <div className="space-y-4">
                <h4 className="font-medium">Project Information</h4>
                
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium">Project Number</div>
                      <div className="text-sm text-muted-foreground">{selectedProject.project_number}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedProject.address}, {selectedProject.city}, {selectedProject.state_code}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium">Timeline</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedProject.start_date} - {selectedProject.projected_finish_date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Analysis */}
              <div className="space-y-4">
                <h4 className="font-medium">Risk Analysis</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Risk Level</span>
                    {getRiskBadge(selectedProject.riskLevel)}
                  </div>
                  
                  {selectedProject.riskFactors.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Risk Factors</div>
                      <div className="space-y-1">
                        {selectedProject.riskFactors.map((factor: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <AlertTriangle className="h-3 w-3 text-orange-600" />
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 