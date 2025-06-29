"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { StandardPageLayout, createPreconBreadcrumbs } from "@/components/layout/StandardPageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Building2, 
  DollarSign, 
  MapPin, 
  Calculator,
  Search,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users
} from "lucide-react"

// Import mock data
import projectsData from "@/data/mock/projects.json"

export default function ProjectsListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState("all")

  // Get pre-construction projects
  const preconProjects = useMemo(() => {
    return projectsData.filter(project => 
      ["Pre-Construction", "Bidding", "BIM Coordination"].includes(project.project_stage_name) &&
      project.active
    )
  }, [])

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    return preconProjects.filter(project => {
      const projectLocation = `${project.address || ''} ${project.city || ''} ${project.state_code || ''}`.trim()
      const matchesSearch = (project.name || project.display_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (project.work_scope || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (projectLocation || '').toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStage = stageFilter === "all" || (project.project_stage_name || '') === stageFilter
      
      return matchesSearch && matchesStage
    })
  }, [preconProjects, searchTerm, stageFilter])

  // Get stage badge variant
  const getStageVariant = (stage: string | undefined) => {
    switch (stage) {
      case 'Pre-Construction':
        return 'secondary'
      case 'Bidding':
        return 'default'
      case 'BIM Coordination':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  // Get stage icon
  const getStageIcon = (stage: string | undefined) => {
    switch (stage) {
      case 'Pre-Construction':
        return <Clock className="h-4 w-4" />
      case 'Bidding':
        return <TrendingUp className="h-4 w-4" />
      case 'BIM Coordination':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  // Navigate to project estimate
  const handleViewEstimate = (projectId: string) => {
    router.push(`/projects/${projectId}/estimate`)
  }

  // Calculate progress for each project
  const getProjectProgress = (stage: string | undefined) => {
    switch (stage) {
      case 'Pre-Construction':
        return 25
      case 'Bidding':
        return 60
      case 'BIM Coordination':
        return 80
      default:
        return 10
    }
  }

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toLocaleString()}`
  }

  return (
    <StandardPageLayout
      title="Pre-Construction Projects"
      description="Select a project to view and manage its estimate"
      breadcrumbs={createPreconBreadcrumbs("Projects")}
      badges={[{ label: `${filteredProjects.length} Projects`, variant: "outline" }]}
      headerContent={
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects, clients, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="Pre-Construction">Pre-Construction</SelectItem>
                  <SelectItem value="Bidding">Bidding</SelectItem>
                  <SelectItem value="BIM Coordination">BIM Coordination</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      }
    >
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <Card key={project.project_id || `project-${index}`} className="group hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <Badge variant={getStageVariant(project.project_stage_name)} className="flex items-center gap-1">
                    {getStageIcon(project.project_stage_name)}
                    {project.project_stage_name || 'Unknown Stage'}
                  </Badge>
                </div>
              </div>
              
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {project.name || project.display_name || 'Untitled Project'}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Project Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{project.project_type_name || project.work_scope || 'N/A'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Value:</span>
                  <span className="font-medium">
                    {project.contract_value && project.contract_value > 0 ? formatCurrency(project.contract_value) : 'TBD'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium truncate">
                    {`${project.city || ''} ${project.state_code || ''}`.trim() || 'N/A'}
                  </span>
                </div>

                {project.square_feet && project.square_feet > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">{project.square_feet.toLocaleString()} SF</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimate Progress</span>
                  <span className="font-medium">{getProjectProgress(project.project_stage_name)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${getProjectProgress(project.project_stage_name)}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => handleViewEstimate(project.project_id?.toString() || `project-${index}`)}
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                variant="outline"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Open Estimate
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchTerm || stageFilter !== "all" 
                ? "No projects match your current search or filter criteria. Try adjusting your search terms."
                : "No pre-construction projects are currently active."
              }
            </p>
            {(searchTerm || stageFilter !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("")
                  setStageFilter("all")
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </StandardPageLayout>
  )
} 