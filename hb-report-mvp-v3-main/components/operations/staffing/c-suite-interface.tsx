"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Users, TrendingUp, Building2, Download, DotIcon as DragHandleDots2, Brain, Filter, Search } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

// Import data
import staffingData from "@/data/staffingTestData.json"

interface Employee {
  id: string
  firstName: string
  lastName: string
  position: string
  positionTitle: string
  currentProjectId: string | null
  skillLevel: string
  hourlyRate: number
  availability: string
  certifications: string[]
  isActive: boolean
}

interface Project {
  id: string
  name: string
  status: string
  phase: string
  progress: number
  requiredStaffing: Record<string, number>
  currentStaffing: Record<string, number>
}

interface AIForecast {
  projectId: string
  projectName: string
  recommendedStaffing: Record<string, number>
  confidence: number
  reasoning: string
  timeline: string
}

/**
 * C-Suite Staffing Interface
 *
 * Provides executive-level staffing management with:
 * - Company-wide employee allocation view
 * - Drag-and-drop employee reassignment
 * - AI-powered forecasting and recommendations
 * - Pipeline project staffing planning
 * - Real-time utilization analytics
 */
export function CSuiteStaffingInterface() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [forecasts, setForecasts] = useState<AIForecast[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPosition, setSelectedPosition] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [isGeneratingForecast, setIsGeneratingForecast] = useState(false)
  const [activeTab, setActiveTab] = useState("allocation")

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setEmployees(staffingData.employees as Employee[])
        setProjects(staffingData.projects as Project[])

        // Generate initial AI forecasts
        generateAIForecasts()

        toast({
          title: "Data Loaded",
          description: "C-Suite staffing interface ready.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load staffing data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Generate AI forecasts
  const generateAIForecasts = useCallback(async () => {
    setIsGeneratingForecast(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockForecasts: AIForecast[] = staffingData.projects.map((project) => ({
        projectId: project.id,
        projectName: project.name,
        recommendedStaffing: {
          PM1: Math.max(1, Math.floor(Math.random() * 2) + 1),
          SE: Math.max(1, Math.floor(Math.random() * 3) + 1),
          QC: Math.max(1, Math.floor(Math.random() * 2) + 1),
          SF: 1,
          SU: project.phase === "Foundation" || project.phase === "Structure" ? 1 : 0,
        },
        confidence: Math.floor(Math.random() * 20) + 80,
        reasoning: `Based on project phase (${project.phase}), contract value ($${(project.contractValue / 1000000).toFixed(1)}M), and historical data`,
        timeline: `${project.phase} phase - ${project.progress}% complete`,
      }))

      setForecasts(mockForecasts)

      toast({
        title: "AI Forecast Generated",
        description: "Staffing recommendations updated based on current project data.",
      })
    } catch (error) {
      toast({
        title: "Forecast Error",
        description: "Failed to generate AI forecast.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingForecast(false)
    }
  }, [])

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId) return

    const employeeId = draggableId
    const newProjectId = destination.droppableId === "unassigned" ? null : destination.droppableId

    // Update employee assignment
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === employeeId ? { ...emp, currentProjectId: newProjectId } : emp)),
    )

    const employee = employees.find((emp) => emp.id === employeeId)
    const project = projects.find((proj) => proj.id === newProjectId)

    toast({
      title: "Employee Reassigned",
      description: `${employee?.firstName} ${employee?.lastName} ${newProjectId ? `assigned to ${project?.name}` : "unassigned"}`,
    })
  }

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.positionTitle}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesPosition = selectedPosition === "all" || emp.position === selectedPosition
    const matchesProject = selectedProject === "all" || emp.currentProjectId === selectedProject

    return matchesSearch && matchesPosition && matchesProject
  })

  // Group employees by project
  const employeesByProject = filteredEmployees.reduce(
    (acc, emp) => {
      const projectId = emp.currentProjectId || "unassigned"
      if (!acc[projectId]) acc[projectId] = []
      acc[projectId].push(emp)
      return acc
    },
    {} as Record<string, Employee[]>,
  )

  // Calculate utilization metrics
  const utilizationMetrics = {
    totalEmployees: employees.length,
    assignedEmployees: employees.filter((emp) => emp.currentProjectId).length,
    utilizationRate: (employees.filter((emp) => emp.currentProjectId).length / employees.length) * 100,
    averageRate: employees.reduce((sum, emp) => sum + emp.hourlyRate, 0) / employees.length,
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Utilization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationMetrics.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active workforce</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationMetrics.utilizationRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{utilizationMetrics.assignedEmployees} assigned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${utilizationMetrics.averageRate.toFixed(0)}/hr</div>
            <p className="text-xs text-muted-foreground">Blended hourly rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">Requiring staffing</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="allocation">Employee Allocation</TabsTrigger>
            <TabsTrigger value="forecasting">AI Forecasting</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline Planning</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={generateAIForecasts} disabled={isGeneratingForecast}>
              <Brain className="h-4 w-4 mr-2" />
              {isGeneratingForecast ? "Generating..." : "AI Forecast"}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Employee Allocation Tab */}
        <TabsContent value="allocation" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    {staffingData.positions.map((pos) => (
                      <SelectItem key={pos.code} value={pos.code}>
                        {pos.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {projects.map((proj) => (
                      <SelectItem key={proj.id} value={proj.id}>
                        {proj.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedPosition("all")
                    setSelectedProject("all")
                  }}
                  size="sm"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Drag and Drop Interface */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {/* Unassigned Employees */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Unassigned ({employeesByProject.unassigned?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Droppable droppableId="unassigned">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-32 p-2 rounded-lg border-2 border-dashed transition-colors ${
                          snapshot.isDraggingOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
                        }`}
                      >
                        {employeesByProject.unassigned?.map((employee, index) => (
                          <Draggable key={employee.id} draggableId={employee.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 mb-2 bg-white border rounded-lg shadow-sm cursor-move transition-shadow ${
                                  snapshot.isDragging ? "shadow-lg" : "hover:shadow-md"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">
                                      {employee.firstName} {employee.lastName}
                                    </div>
                                    <div className="text-xs text-gray-600">{employee.positionTitle}</div>
                                    <div className="text-xs text-gray-500">
                                      ${employee.hourlyRate}/hr • {employee.skillLevel}
                                    </div>
                                  </div>
                                  <DragHandleDots2 className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {(!employeesByProject.unassigned || employeesByProject.unassigned.length === 0) && (
                          <div className="text-center text-gray-500 text-sm py-8">No unassigned employees</div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>

              {/* Project Assignments */}
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{project.name}</div>
                        <div className="text-xs font-normal text-gray-600">
                          {project.phase} • {project.progress}% complete
                        </div>
                      </div>
                      <Badge variant="secondary">{employeesByProject[project.id]?.length || 0}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Droppable droppableId={project.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-32 p-2 rounded-lg border-2 border-dashed transition-colors ${
                            snapshot.isDraggingOver ? "border-green-400 bg-green-50" : "border-gray-300"
                          }`}
                        >
                          {employeesByProject[project.id]?.map((employee, index) => (
                            <Draggable key={employee.id} draggableId={employee.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-3 mb-2 bg-white border rounded-lg shadow-sm cursor-move transition-shadow ${
                                    snapshot.isDragging ? "shadow-lg" : "hover:shadow-md"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium text-sm">
                                        {employee.firstName} {employee.lastName}
                                      </div>
                                      <div className="text-xs text-gray-600">{employee.positionTitle}</div>
                                      <div className="text-xs text-gray-500">
                                        ${employee.hourlyRate}/hr • {employee.skillLevel}
                                      </div>
                                    </div>
                                    <DragHandleDots2 className="h-4 w-4 text-gray-400" />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {(!employeesByProject[project.id] || employeesByProject[project.id].length === 0) && (
                            <div className="text-center text-gray-500 text-sm py-8">Drop employees here</div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DragDropContext>
        </TabsContent>

        {/* AI Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Staffing Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecasts.map((forecast) => (
                  <div key={forecast.projectId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{forecast.projectName}</h4>
                        <p className="text-sm text-gray-600">{forecast.timeline}</p>
                      </div>
                      <Badge
                        variant={
                          forecast.confidence >= 90 ? "default" : forecast.confidence >= 80 ? "secondary" : "outline"
                        }
                      >
                        {forecast.confidence}% confidence
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      {Object.entries(forecast.recommendedStaffing).map(([position, count]) => (
                        <div key={position} className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-medium">{count}</div>
                          <div className="text-xs text-gray-600">{position}</div>
                        </div>
                      ))}
                    </div>

                    <p className="text-sm text-gray-700">{forecast.reasoning}</p>

                    <div className="flex justify-end mt-3">
                      <Button size="sm" variant="outline">
                        Apply Recommendations
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pipeline Planning Tab */}
        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Pipeline Project Staffing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffingData.pipelineProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-gray-600">
                          {project.location} • ${(project.estimatedValue / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{project.probabilityOfWin}% Win Probability</Badge>
                        <div className="text-sm text-gray-600 mt-1">
                          Expected Start: {new Date(project.expectedStartDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      {Object.entries(project.estimatedStaffing).map(([position, count]) => (
                        <div key={position} className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-medium">{count}</div>
                          <div className="text-xs text-gray-600">{position}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Phase: {project.phase} • Duration: {project.expectedDuration} months
                      </span>
                      <Button size="sm" variant="outline">
                        Plan Staffing
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
