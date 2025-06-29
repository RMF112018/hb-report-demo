"use client"

import React, { useState, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Edit, Trash2, MoreHorizontal, ChevronDown, Users, Clock } from "lucide-react"
import { InteractiveAssignmentCell } from "./interactive-assignment-cell"
import type { ResponsibilityTask, ProjectRole, ContractRole } from "@/types/responsibility"

interface ResponsibilityMatrixProps {
  data: ResponsibilityTask[]
  roles: (ProjectRole | ContractRole)[]
  type: "team" | "contract" | "subcontract"
  selectedTasks: string[]
  onTaskSelection: (taskIds: string[]) => void
  onRoleAssignment: (taskId: string, role: string, assignment: string) => void
  onEditTask: (task: ResponsibilityTask) => void
  onDeleteTask: (taskId: string) => void
}

const roleColors: Record<string, string> = {
  PX: "#3b82f6", // blue
  PM1: "#10b981", // green
  PM2: "#06b6d4", // cyan
  PM3: "#8b5cf6", // purple
  PA: "#f59e0b", // orange
  QAC: "#ef4444", // red
  ProjAcct: "#ec4899", // pink
  O: "#eab308", // yellow
  A: "#84cc16", // lime
  C: "#f97316", // orange
  S: "#f43f5e", // rose
}

/**
 * Enhanced Responsibility Matrix Component
 *
 * Fully interactive matrix with click-to-assign functionality, bulk operations,
 * and comprehensive task management. Optimized with React.memo for performance.
 */
export const ResponsibilityMatrix = memo(function ResponsibilityMatrix({
  data,
  roles,
  type,
  selectedTasks,
  onTaskSelection,
  onRoleAssignment,
  onEditTask,
  onDeleteTask,
}: ResponsibilityMatrixProps) {
  const [sortField, setSortField] = useState<string>("task")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  console.log("ResponsibilityMatrix render:", { dataLength: data.length, rolesLength: roles.length, selectedTasks })

  /**
   * Handle select all tasks functionality
   */
  const handleSelectAll = (checked: boolean) => {
    console.log("Select all clicked:", checked)
    if (checked) {
      onTaskSelection(data.map((task) => task.id))
    } else {
      onTaskSelection([])
    }
  }

  /**
   * Handle individual task selection
   */
  const handleSelectTask = (taskId: string, checked: boolean) => {
    console.log("Task selection:", { taskId, checked })
    if (checked) {
      onTaskSelection([...selectedTasks, taskId])
    } else {
      onTaskSelection(selectedTasks.filter((id) => id !== taskId))
    }
  }

  /**
   * Handle column sorting with visual feedback
   */
  const handleSort = (field: string) => {
    console.log("Sort clicked:", field)
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  /**
   * Sort data based on current sort configuration
   */
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => {
      let aValue = a[sortField as keyof ResponsibilityTask] as string
      let bValue = b[sortField as keyof ResponsibilityTask] as string

      if (typeof aValue === "string") aValue = aValue.toLowerCase()
      if (typeof bValue === "string") bValue = bValue.toLowerCase()

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [data, sortField, sortDirection])

  /**
   * Group data by category for team matrix
   */
  const groupedData = React.useMemo(() => {
    if (type === "team") {
      return sortedData.reduce(
        (acc, task) => {
          const category = task.category || "Uncategorized"
          if (!acc[category]) acc[category] = []
          acc[category].push(task)
          return acc
        },
        {} as Record<string, ResponsibilityTask[]>,
      )
    }
    return { "All Tasks": sortedData }
  }, [sortedData, type])

  /**
   * Render responsible roles badge component
   */
  const ResponsibleCell = React.memo(({ task }: { task: ResponsibilityTask }) => {
    const responsibleRoles = roles.filter(
      (role) => task.assignments?.[role.key] === "X" || task.assignments?.[role.key] === "L",
    )
    const supportRoles = roles.filter((role) => task.assignments?.[role.key] === "S")

    return (
      <div className="flex flex-wrap gap-1">
        {responsibleRoles.map((role) => (
          <Badge
            key={role.key}
            style={{
              backgroundColor: roleColors[role.key] || "#6b7280",
              color: "white",
            }}
            className="text-xs"
          >
            {role.key}
          </Badge>
        ))}
        {supportRoles.map((role) => (
          <Badge
            key={role.key}
            variant="outline"
            style={{
              borderColor: roleColors[role.key] || "#6b7280",
              color: roleColors[role.key] || "#6b7280",
            }}
            className="text-xs"
          >
            {role.key}
          </Badge>
        ))}
        {responsibleRoles.length === 0 && supportRoles.length === 0 && (
          <span className="text-gray-400 text-sm">Unassigned</span>
        )}
      </div>
    )
  })

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {type === "team" && <Users className="h-5 w-5" />}
            {type !== "team" && <Clock className="h-5 w-5" />}
            {type === "team" ? "Team Matrix" : type === "contract" ? "Prime Contract" : "Subcontract"}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{data.length} tasks</Badge>
            {selectedTasks.length > 0 && (
              <Badge variant="secondary" className="bg-[#FF6B35] text-white">
                {selectedTasks.length} selected
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-auto max-h-[600px]">
          {Object.entries(groupedData).map(([category, tasks]) => (
            <div key={category}>
              {type === "team" && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 border-b border-blue-200">
                  <h3 className="font-semibold text-[#003087] flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {category}
                    <Badge variant="outline" className="ml-2">
                      {tasks.length} tasks
                    </Badge>
                  </h3>
                </div>
              )}

              <Table>
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={tasks.length > 0 && tasks.every((task) => selectedTasks.includes(task.id))}
                        onCheckedChange={(checked) => {
                          console.log("Header checkbox clicked:", checked)
                          handleSelectAll(checked as boolean)
                        }}
                        aria-label="Select all tasks"
                      />
                    </TableHead>
                    <TableHead className="w-32">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("responsible")}
                        className="h-auto p-0 font-medium hover:text-[#003087]"
                        aria-label="Sort by responsible roles"
                      >
                        Responsible
                        <ChevronDown
                          className={`h-4 w-4 ml-1 transition-transform ${
                            sortField === "responsible" && sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[300px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("task")}
                        className="h-auto p-0 font-medium hover:text-[#003087]"
                        aria-label="Sort by task name"
                      >
                        Task
                        <ChevronDown
                          className={`h-4 w-4 ml-1 transition-transform ${
                            sortField === "task" && sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </TableHead>
                    {type !== "team" && (
                      <>
                        <TableHead className="w-16 text-center">Page</TableHead>
                        <TableHead className="w-20 text-center">Article</TableHead>
                      </>
                    )}
                    {roles.map((role) => (
                      <TableHead key={role.key} className="w-20 text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge
                                style={{
                                  backgroundColor: roleColors[role.key] || "#6b7280",
                                  color: "white",
                                }}
                                className="text-xs cursor-help"
                              >
                                {role.key}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-medium">{role.label}</p>
                              {role.description && <p className="text-sm text-gray-600 mt-1">{role.description}</p>}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableHead>
                    ))}
                    <TableHead className="w-16">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {tasks.map((task, index) => (
                    <TableRow
                      key={task.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedTasks.includes(task.id) ? "bg-blue-50" : ""
                      }`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                          aria-label={`Select task: ${task.task}`}
                        />
                      </TableCell>
                      <TableCell>
                        <ResponsibleCell task={task} />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-[300px]">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="truncate cursor-help">{task.task}</p>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <p>{task.task}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {task.category && type === "team" && (
                            <p className="text-xs text-gray-500 mt-1">{task.category}</p>
                          )}
                        </div>
                      </TableCell>
                      {type !== "team" && (
                        <>
                          <TableCell className="text-center text-sm">{task.page || "-"}</TableCell>
                          <TableCell className="text-center text-sm">{task.article || "-"}</TableCell>
                        </>
                      )}
                      {roles.map((role) => (
                        <TableCell key={role.key} className="text-center p-1">
                          <InteractiveAssignmentCell
                            taskId={task.id}
                            roleKey={role.key}
                            currentAssignment={task.assignments?.[role.key] || ""}
                            onAssignmentChange={onRoleAssignment}
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" aria-label={`Actions for task: ${task.task}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log("Edit task clicked:", task.id)
                                onEditTask(task)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log("Delete task clicked:", task.id)
                                onDeleteTask(task.id)
                              }}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
