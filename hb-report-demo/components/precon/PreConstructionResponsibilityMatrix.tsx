"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Building2, 
  Users, 
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Edit3,
  Save,
  X,
  Plus,
  Filter,
  Search,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Brain,
  Lightbulb,
  Award,
  TrendingUp,
  DollarSign
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
import { Progress } from "@/components/ui/progress"

// Import data
import responsibilityData from "@/data/mock/precon/responsibility-matrix.json"

interface EditableFieldProps {
  value: string
  onSave: (value: string) => void
  placeholder?: string
  multiline?: boolean
  className?: string
}

function EditableField({ value, onSave, placeholder, multiline = false, className = "" }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        {multiline ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className={`min-h-[60px] ${className}`}
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className={className}
          />
        )}
        <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
          <Save className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 w-8 p-0">
          <X className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <div 
      className={`flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded ${className}`}
      onClick={() => setIsEditing(true)}
    >
      <span className={`flex-1 ${!value ? 'text-muted-foreground italic' : ''}`}>
        {value || placeholder || "Click to edit"}
      </span>
      <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100 text-muted-foreground" />
    </div>
  )
}

interface PreConstructionResponsibilityMatrixProps {
  userRole?: string
}

export function PreConstructionResponsibilityMatrix({ userRole = "viewer" }: PreConstructionResponsibilityMatrixProps) {
  const [data, setData] = useState(responsibilityData)
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showCompletedTasks, setShowCompletedTasks] = useState(true)

  // Calculate summary statistics
  const taskStats = useMemo(() => {
    const tasks = data.managingInformation
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === "completed").length
    const inProgressTasks = tasks.filter(task => task.status === "in-progress").length
    const highPriorityTasks = tasks.filter(task => task.priority === "high").length
    const overdueTasks = tasks.filter(task => 
      task.deadline && new Date(task.deadline) < new Date() && task.status !== "completed"
    ).length

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      highPriorityTasks,
      overdueTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    }
  }, [data.managingInformation])

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return data.managingInformation.filter(task => {
      const matchesSearch = task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.responsible.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
      const matchesCompleted = showCompletedTasks || task.status !== "completed"
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCompleted
    })
  }, [data.managingInformation, searchTerm, statusFilter, priorityFilter, showCompletedTasks])

  // Update task data
  const updateTask = (taskId: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      managingInformation: prev.managingInformation.map(task =>
        task.id === taskId ? { ...task, [field]: value } : task
      )
    }))
  }

  // Update project info
  const updateProjectInfo = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      projectInfo: {
        ...prev.projectInfo,
        [field]: value
      }
    }))
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">In Progress</Badge>
      case "on-hold":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">On Hold</Badge>
      case "not-started":
      default:
        return <Badge variant="secondary">Not Started</Badge>
    }
  }

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Project Information Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Building2 className="h-5 w-5" />
            Project Information
          </CardTitle>
          <CardDescription className="text-blue-600 dark:text-blue-400">
            Pre-Construction project details and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Job Name</label>
              <EditableField
                value={data.projectInfo.jobName}
                onSave={(value) => updateProjectInfo("jobName", value)}
                placeholder="Enter job name"
                className="font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Job Number</label>
              <EditableField
                value={data.projectInfo.jobNumber}
                onSave={(value) => updateProjectInfo("jobNumber", value)}
                placeholder="Enter job number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Architect</label>
              <EditableField
                value={data.projectInfo.architect}
                onSave={(value) => updateProjectInfo("architect", value)}
                placeholder="Enter architect name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Proposal Due Date</label>
              <EditableField
                value={data.projectInfo.proposalDueDate}
                onSave={(value) => updateProjectInfo("proposalDueDate", value)}
                placeholder="Enter due date"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Project Executive</label>
              <EditableField
                value={data.projectInfo.projectExecutive}
                onSave={(value) => updateProjectInfo("projectExecutive", value)}
                placeholder="Enter project executive"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Type of Proposal</label>
              <EditableField
                value={data.projectInfo.typeOfProposal}
                onSave={(value) => updateProjectInfo("typeOfProposal", value)}
                placeholder="Enter proposal type"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Tasks</CardTitle>
            <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {taskStats.totalTasks}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Responsibility items
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {taskStats.completedTasks}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {taskStats.completionRate.toFixed(1)}% complete
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {taskStats.inProgressTasks}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Active tasks
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {taskStats.highPriorityTasks}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400">
              Critical items
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Overdue</CardTitle>
            <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {taskStats.overdueTasks}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Past deadline
            </p>
          </CardContent>
        </Card>
      </div>

      {/* HBI Intelligence Panel */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900 border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
            <Brain className="h-5 w-5" />
            HBI Pre-Construction Intelligence
          </CardTitle>
          <CardDescription className="text-indigo-600 dark:text-indigo-400">
            AI-powered insights and recommendations for responsibility matrix optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-indigo-600" />
                <span className="font-medium text-indigo-800 dark:text-indigo-200">Key Insights</span>
              </div>
              <ul className="space-y-2 text-sm text-indigo-700 dark:text-indigo-300">
                <li>• {taskStats.highPriorityTasks} high-priority tasks require immediate attention</li>
                <li>• {Math.round((taskStats.inProgressTasks / taskStats.totalTasks) * 100)}% of tasks are currently in progress</li>
                <li>• RFI management and subcontractor bid coordination are critical path items</li>
                <li>• Consider assigning backup resources for overdue tasks</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-indigo-600" />
                <span className="font-medium text-indigo-800 dark:text-indigo-200">Recommendations</span>
              </div>
              <ul className="space-y-2 text-sm text-indigo-700 dark:text-indigo-300">
                <li>• Prioritize Building Connected subcontractor outreach</li>
                <li>• Schedule weekly check-ins for financial document requests</li>
                <li>• Set up automated reminders for permit log updates</li>
                <li>• Consider parallel processing for bid form requirements</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <span className="font-medium text-indigo-800 dark:text-indigo-200">Progress Health Score</span>
            </div>
            <Progress value={taskStats.completionRate} className="h-2" />
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
              {taskStats.completionRate.toFixed(1)}% complete - {taskStats.completionRate >= 75 ? "On Track" : taskStats.completionRate >= 50 ? "Needs Attention" : "Behind Schedule"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Responsibility Matrix
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:from-[#E55A2B] hover:to-[#D04A1F] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
              className="flex items-center gap-2"
            >
              {showCompletedTasks ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {showCompletedTasks ? "Hide" : "Show"} Completed
            </Button>
          </div>

          {/* Responsibility Matrix Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead className="min-w-[300px]">Task</TableHead>
                  <TableHead className="w-20">Required</TableHead>
                  <TableHead className="w-40">Status</TableHead>
                  <TableHead className="w-20">Priority</TableHead>
                  <TableHead className="w-48">Responsible</TableHead>
                  <TableHead className="w-32">Deadline</TableHead>
                  <TableHead className="w-32">Frequency</TableHead>
                  <TableHead className="min-w-[200px]">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task, index) => (
                  <TableRow key={task.id} className="group">
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{task.task}</div>
                        {task.required === "YES" && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={task.required === "YES" ? "destructive" : "secondary"}>
                        {task.required}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={task.status} 
                        onValueChange={(value) => updateTask(task.id, "status", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={task.priority} 
                        onValueChange={(value) => updateTask(task.id, "priority", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <EditableField
                        value={task.responsible}
                        onSave={(value) => updateTask(task.id, "responsible", value)}
                        placeholder="Assign to..."
                      />
                    </TableCell>
                    <TableCell>
                      <EditableField
                        value={task.deadline}
                        onSave={(value) => updateTask(task.id, "deadline", value)}
                        placeholder="Set deadline..."
                      />
                    </TableCell>
                    <TableCell>
                      <EditableField
                        value={task.frequency}
                        onSave={(value) => updateTask(task.id, "frequency", value)}
                        placeholder="Set frequency..."
                      />
                    </TableCell>
                    <TableCell>
                      <EditableField
                        value={task.notes}
                        onSave={(value) => updateTask(task.id, "notes", value)}
                        placeholder="Add notes..."
                        multiline
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tasks match your current filters.</p>
              <p className="text-sm">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 