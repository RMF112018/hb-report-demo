"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ResponsibilityTask, ProjectRole } from "@/types/responsibility"

interface ResponsibilitySettingsProps {
  projectRoles: ProjectRole[]
  activeRoles: string[]
  onActiveRolesChange: (roles: string[]) => void
  teamData: ResponsibilityTask[]
  onTeamDataChange: (data: ResponsibilityTask[]) => void
  onClose: () => void
}

const roleColors: Record<string, string> = {
  PX: "#3b82f6",
  PM1: "#10b981",
  PM2: "#06b6d4",
  PM3: "#8b5cf6",
  PA: "#f59e0b",
  QAC: "#ef4444",
  ProjAcct: "#ec4899",
}

export function ResponsibilitySettings({
  projectRoles,
  activeRoles,
  onActiveRolesChange,
  teamData,
  onTeamDataChange,
  onClose,
}: ResponsibilitySettingsProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<ResponsibilityTask | null>(null)
  const { toast } = useToast()

  const handleRoleToggle = (roleKey: string, enabled: boolean) => {
    if (enabled) {
      onActiveRolesChange([...activeRoles, roleKey])
    } else {
      onActiveRolesChange(activeRoles.filter((r) => r !== roleKey))
    }
  }

  const handleAddTask = () => {
    console.log("Add task clicked:", { title: newTaskTitle, category: newTaskCategory })

    if (!newTaskTitle.trim()) {
      toast({
        title: "Task Title Required",
        description: "Please enter a task title.",
        variant: "destructive",
      })
      return
    }

    const newTask: ResponsibilityTask = {
      id: `task-${Date.now()}`,
      type: "team",
      category: newTaskCategory.trim() || "Uncategorized",
      task: newTaskTitle.trim(),
      assignments: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("Adding new task:", newTask)
    onTeamDataChange([...teamData, newTask])
    setNewTaskTitle("")
    setNewTaskCategory("")

    toast({
      title: "Task Added",
      description: "New task has been added successfully.",
    })
  }

  const handleDeleteTask = () => {
    if (!taskToDelete) return

    console.log("Deleting task from settings:", taskToDelete.id)
    onTeamDataChange(teamData.filter((task) => task.id !== taskToDelete.id))
    setShowDeleteDialog(false)
    setTaskToDelete(null)

    toast({
      title: "Task Deleted",
      description: "Task has been deleted successfully.",
    })
  }

  const confirmDeleteTask = (task: ResponsibilityTask) => {
    setTaskToDelete(task)
    setShowDeleteDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#003087]">Responsibility Matrix Settings</h2>
          <p className="text-gray-600 mt-1">Configure team roles and manage standard tasks</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Close Settings
        </Button>
      </div>

      {/* Team Roles Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Team Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Enable or disable team roles that will appear in the responsibility matrix.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectRoles.map((role) => (
                <div key={role.key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge
                      style={{
                        backgroundColor: roleColors[role.key] || "#6b7280",
                        color: "white",
                      }}
                    >
                      {role.key}
                    </Badge>
                    <div>
                      <p className="font-medium">{role.label}</p>
                      {role.description && <p className="text-xs text-gray-500">{role.description}</p>}
                    </div>
                  </div>
                  <Switch
                    checked={activeRoles.includes(role.key)}
                    onCheckedChange={(checked) => handleRoleToggle(role.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Standard Tasks Management */}
      <Card>
        <CardHeader>
          <CardTitle>Standard Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Manage standard tasks that can be reused across projects.</p>

            {/* Add New Task */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
              <div className="space-y-2">
                <Label htmlFor="new-task-title">Task Title</Label>
                <Input
                  id="new-task-title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter task title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-task-category">Category</Label>
                <Input
                  id="new-task-category"
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  placeholder="Enter category..."
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddTask} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No standard tasks defined. Add your first task above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    teamData.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">
                          <div className="max-w-[300px]">
                            <p className="truncate" title={task.task}>
                              {task.task}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{task.category || "Uncategorized"}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => confirmDeleteTask(task)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {taskToDelete && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{taskToDelete.task}</p>
              <p className="text-sm text-gray-500 mt-1">Category: {taskToDelete.category || "Uncategorized"}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTask}>
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
