"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { InteractiveAssignmentCell } from "./InteractiveAssignmentCell"
import { Edit, Trash2, MessageSquare, ChevronDown, ChevronRight, Plus, Filter, Download, Search } from "lucide-react"
import type { ResponsibilityTask, ResponsibilityRole } from "@/types/responsibility"

// Import mock data
import responsibilityRawData from "@/data/mock/responsibility.json"

interface ResponsibilityMatrixProps {
  userRole?: "executive" | "project_executive" | "project_manager"
  className?: string
}

// Sparkline component for assignment trends
const AssignmentSparkline = ({ data, height = 48 }: { data: number[]; height?: number }) => {
  const max = Math.max(...data, 1)
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - (value / max) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="w-24 h-12 flex items-center">
      <svg width="100%" height={height} className="text-blue-500">
        <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" />
        <defs>
          <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <polygon fill="url(#sparklineGradient)" points={`0,100 ${points} 100,100`} />
      </svg>
    </div>
  )
}

export function ResponsibilityMatrixIntegration({ 
  userRole = "project_manager", 
  className = "" 
}: ResponsibilityMatrixProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [expandedAnnotations, setExpandedAnnotations] = useState<Set<string>>(new Set())
  const [bulkAssignmentRole, setBulkAssignmentRole] = useState<string>("")
  const [bulkAssignmentType, setBulkAssignmentType] = useState<"Approve" | "Primary" | "Support" | "None">("None")
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)
  const [currentMatrixType, setCurrentMatrixType] = useState<"team" | "prime-contract" | "subcontract">("team")

  // Role colors matching previous implementation
  const roleColors: { [key: string]: string } = {
    PX: "#1890ff", // blue
    PM1: "#52c41a", // green
    PM2: "#13c2c2", // cyan
    PM3: "#722ed1", // purple
    PA: "#fa8c16", // orange
    QAQC: "#f5222d", // red
    SPM: "#eb2f96", // magenta
    "Proj Acct": "#fadb14", // gold
    O: "#a0d911", // lime
    A: "#f57734", // contractor orange
    C: "#fa541c", // volcano
    S: "#722ed1", // purple
  }

  // Transform raw data into ResponsibilityTask format
  const transformedTasks: ResponsibilityTask[] = useMemo(() => {
    return responsibilityRawData
      .filter(item => item["Task Category"] && item["Tasks/Role"])
      .map((item, index) => {
        const randomAssignments: { [key: string]: "Approve" | "Primary" | "Support" | "None" } = {}
        
        // Create some realistic assignments based on category
        const category = item["Task Category"] || "General"
        Object.keys(roleColors).forEach(role => {
          if (role === category) {
            randomAssignments[role] = Math.random() > 0.3 ? "Primary" : "Support"
          } else if (["PX", "SPM"].includes(role)) {
            randomAssignments[role] = Math.random() > 0.7 ? "Approve" : "None"
          } else {
            randomAssignments[role] = Math.random() > 0.8 ? "Support" : "None"
          }
        })

        return {
          id: `task-${index}`,
          projectId: "palm-beach-luxury",
          type: currentMatrixType,
          category: category,
          task: item["Tasks/Role"] || "",
          page: Math.random() > 0.5 ? `${Math.floor(Math.random() * 50) + 1}` : "",
          article: Math.random() > 0.5 ? `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 20) + 1}` : "",
          responsible: category === "PX" ? "PX" : category === "SPM" ? "SPM" : Object.keys(randomAssignments).find(role => randomAssignments[role] === "Primary") || "",
          assignments: randomAssignments,
          status: ["active", "pending", "completed"][Math.floor(Math.random() * 3)] as "active" | "pending" | "completed",
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          annotations: Math.random() > 0.8 ? [
            {
              id: `annotation-${index}`,
              user: ["Mike Davis", "Sarah Johnson", "John Smith"][Math.floor(Math.random() * 3)],
              timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
              comment: [
                "Need clarification on scope requirements",
                "Updated per latest drawing revision",
                "Coordination required with MEP contractor",
                "Awaiting owner approval"
              ][Math.floor(Math.random() * 4)]
            }
          ] : []
        }
      })
  }, [currentMatrixType])

  // Define roles with proper structure
  const roles: ResponsibilityRole[] = useMemo(() => {
    return Object.entries(roleColors).map(([key, color]) => ({
      key,
      name: key === "Proj Acct" ? "Project Accountant" : 
            key === "QAQC" ? "Quality Control" :
            key === "SPM" ? "Senior Project Manager" :
            key,
      color,
      enabled: true,
      description: `${key} role responsibilities`
    }))
  }, [])

  // Group tasks by category
  const groupedTasks = useMemo(() => {
    const filtered = transformedTasks.filter(task => {
      const matchesSearch = task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || task.category === selectedCategory
      const matchesRole = selectedRole === "all" ||
                         Object.entries(task.assignments).some(
                           ([roleKey, assignment]) => roleKey === selectedRole && assignment !== "None"
                         )
      return matchesSearch && matchesCategory && matchesRole
    })

    const grouped = filtered.reduce((acc, task) => {
      const category = task.category || "Uncategorized"
      if (!acc[category]) acc[category] = []
      acc[category].push(task)
      return acc
    }, {} as { [key: string]: ResponsibilityTask[] })

    return Object.entries(grouped).map(([category, categoryTasks]) => ({
      category,
      tasks: categoryTasks,
      isExpanded: expandedCategories.has(category),
    }))
  }, [transformedTasks, searchTerm, selectedCategory, selectedRole, expandedCategories])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(transformedTasks.map(task => task.category))]
    return cats.sort()
  }, [transformedTasks])

  // Get enabled roles
  const enabledRoles = roles.filter(role => role.enabled)

  // Generate mock sparkline data for assignment trends
  const generateSparklineData = () => {
    return Array.from({ length: 30 }, () => Math.floor(Math.random() * 10))
  }

  const handleAssignmentChange = (
    taskId: string,
    roleKey: string,
    assignment: "Approve" | "Primary" | "Support" | "None",
  ) => {
    // Update task assignment logic
    console.log(`Updating task ${taskId}, role ${roleKey} to ${assignment}`)
  }

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks([...selectedTasks, taskId])
    } else {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    const allTaskIds = groupedTasks.flatMap(group => group.tasks.map(task => task.id))
    if (checked) {
      setSelectedTasks(allTaskIds)
    } else {
      setSelectedTasks([])
    }
  }

  const handleBulkAssignment = () => {
    if (!bulkAssignmentRole || selectedTasks.length === 0) return

    selectedTasks.forEach(taskId => {
      handleAssignmentChange(taskId, bulkAssignmentRole, bulkAssignmentType)
    })

    setSelectedTasks([])
    setBulkAssignmentRole("")
    setBulkAssignmentType("None")
  }

  const toggleCategoryExpansion = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleAnnotations = (taskId: string) => {
    const newExpanded = new Set(expandedAnnotations)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedAnnotations(newExpanded)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Active
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRoleColor = (roleKey: string) => {
    return roleColors[roleKey] || "#6B7280"
  }

  const getMatrixTypeTitle = () => {
    switch (currentMatrixType) {
      case "team":
        return "Team Responsibility Matrix"
      case "prime-contract":
        return "Prime Contract Matrix"
      case "subcontract":
        return "Subcontract Matrix"
      default:
        return "Responsibility Matrix"
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getMatrixTypeTitle()}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={currentMatrixType} onValueChange={(value) => setCurrentMatrixType(value as any)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">Team Matrix</SelectItem>
                <SelectItem value="prime-contract">Prime Contract</SelectItem>
                <SelectItem value="subcontract">Subcontract</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tasks or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {enabledRoles.map(role => (
                  <SelectItem key={role.key} value={role.key}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Assignment Controls */}
          {selectedTasks.length > 0 && (
            <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium">
                {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
              </span>
              <Select value={bulkAssignmentRole} onValueChange={setBulkAssignmentRole}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {enabledRoles.map(role => (
                    <SelectItem key={role.key} value={role.key}>
                      {role.key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={bulkAssignmentType} onValueChange={(value) => setBulkAssignmentType(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approve">Approve</SelectItem>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleBulkAssignment} size="sm">
                Assign
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedTasks([])}>
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Matrix Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto border rounded-lg">
            {/* Table Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
              <div className="grid gap-2 p-3 text-sm font-medium text-[#003087]" style={{
                gridTemplateColumns: `auto 1fr repeat(${enabledRoles.length}, 48px) auto auto auto auto`
              }}>
                <div className="flex items-center">
                  <Checkbox
                    checked={
                      selectedTasks.length === groupedTasks.flatMap(g => g.tasks).length &&
                      groupedTasks.flatMap(g => g.tasks).length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </div>
                <div>Task</div>
                {enabledRoles.map((role) => (
                  <div key={role.key} className="text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: getRoleColor(role.key) }} />
                      <span className="text-xs">{role.key}</span>
                    </div>
                  </div>
                ))}
                <div className="text-center">Status</div>
                <div className="text-center">Trends</div>
                <div className="text-center">Page</div>
                <div className="text-center">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {groupedTasks.map((group) => (
                <div key={group.category}>
                  {/* Category Header */}
                  <div
                    className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleCategoryExpansion(group.category)}
                  >
                    <div className="flex items-center space-x-2">
                      {group.isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      )}
                      <span className="font-semibold text-[#003087]">{group.category}</span>
                      <Badge variant="outline" className="ml-2">
                        {group.tasks.length}
                      </Badge>
                    </div>
                  </div>

                  {/* Category Tasks */}
                  {group.isExpanded && (
                    <div className="divide-y divide-gray-100">
                      {group.tasks.map((task, index) => (
                        <div key={task.id}>
                          <div
                            className={`grid gap-2 p-3 hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-25"
                            }`}
                            style={{
                              gridTemplateColumns: `auto 1fr repeat(${enabledRoles.length}, 48px) auto auto auto auto`
                            }}
                          >
                            <div className="flex items-center">
                              <Checkbox
                                checked={selectedTasks.includes(task.id)}
                                onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="font-medium text-gray-900 text-sm">{task.task}</div>
                              {task.annotations.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                                  onClick={() => toggleAnnotations(task.id)}
                                >
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                  {task.annotations.length} annotation{task.annotations.length !== 1 ? "s" : ""}
                                </Button>
                              )}
                            </div>

                            {enabledRoles.map((role) => (
                              <div key={role.key} className="flex justify-center items-center">
                                <InteractiveAssignmentCell
                                  taskId={task.id}
                                  roleKey={role.key}
                                  role={role}
                                  assignment={task.assignments[role.key] || "None"}
                                  onAssignmentChange={handleAssignmentChange}
                                />
                              </div>
                            ))}

                            <div className="flex items-center justify-center">{getStatusBadge(task.status)}</div>

                            <div className="flex items-center justify-center">
                              <AssignmentSparkline data={generateSparklineData()} />
                            </div>

                            <div className="text-sm text-gray-600 flex items-center justify-center">
                              {task.page || "-"}
                            </div>

                            <div className="flex justify-center items-center">
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-8 h-8 p-0 hover:bg-blue-50"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Annotations Panel */}
                          {expandedAnnotations.has(task.id) && task.annotations.length > 0 && (
                            <div className="bg-gray-50 border-t border-gray-200 p-4">
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-900">Annotations</h4>
                                {task.annotations.map((annotation) => (
                                  <div key={annotation.id} className="bg-white rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-gray-900">{annotation.user}</span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(annotation.timestamp).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700">{annotation.comment}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {groupedTasks.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No tasks found</div>
                <div className="text-gray-400 text-sm">
                  {searchTerm || selectedCategory !== "all" || selectedRole !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first task to get started"}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 