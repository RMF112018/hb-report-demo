"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Check, Users, Star, X } from "lucide-react"

interface InteractiveAssignmentCellProps {
  taskId: string
  roleKey: string
  currentAssignment: string
  onAssignmentChange: (taskId: string, roleKey: string, assignment: string) => void
}

const roleColors: Record<string, string> = {
  X: "#10b981", // green for Approve
  L: "#3b82f6", // blue for Lead
  S: "#f59e0b", // orange for Support
  "": "#6b7280", // gray for None
}

const assignmentIcons: { [key: string]: JSX.Element } = {
  X: <Check className="h-3 w-3" />,
  L: <Star className="h-3 w-3" />,
  S: <Users className="h-3 w-3" />,
  "": <X className="h-3 w-3" />,
}

/**
 * Interactive Assignment Cell Component
 *
 * Provides clickable matrix cells for role assignment with dropdown selection.
 * Supports Approve (X), Lead (L), Support (S), and None assignments.
 */
export function InteractiveAssignmentCell({
  taskId,
  roleKey,
  currentAssignment,
  onAssignmentChange,
}: InteractiveAssignmentCellProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleAssignmentChange = (assignment: string) => {
    console.log(`Assignment change: Task ${taskId}, Role ${roleKey}, Assignment ${assignment}`)
    onAssignmentChange(taskId, roleKey, assignment)
    setIsOpen(false)
  }

  const getAssignmentLabel = (assignment: string) => {
    switch (assignment) {
      case "X":
        return "Approve"
      case "L":
        return "Lead"
      case "S":
        return "Support"
      default:
        return "None"
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 px-2 hover:scale-105 transition-transform"
          onClick={(e) => {
            console.log(`Cell clicked: Task ${taskId}, Role ${roleKey}`)
            e.stopPropagation()
          }}
          aria-label={`Assign ${roleKey} role for task. Current: ${getAssignmentLabel(currentAssignment)}`}
        >
          <Badge
            style={{
              backgroundColor: roleColors[currentAssignment] || "#6b7280",
              color: "white",
            }}
            className="text-xs flex items-center gap-1"
          >
            {assignmentIcons[currentAssignment] || assignmentIcons[""]}
            {currentAssignment || "None"}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-[120px]">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            handleAssignmentChange("X")
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Check className="h-4 w-4 text-green-600" />
          Approve (X)
          {currentAssignment === "X" && (
            <Badge variant="secondary" className="ml-auto">
              Current
            </Badge>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            handleAssignmentChange("L")
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Star className="h-4 w-4 text-blue-600" />
          Lead (L)
          {currentAssignment === "L" && (
            <Badge variant="secondary" className="ml-auto">
              Current
            </Badge>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            handleAssignmentChange("S")
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Users className="h-4 w-4 text-orange-600" />
          Support (S)
          {currentAssignment === "S" && (
            <Badge variant="secondary" className="ml-auto">
              Current
            </Badge>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            handleAssignmentChange("")
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <X className="h-4 w-4 text-gray-400" />
          None
          {!currentAssignment && (
            <Badge variant="secondary" className="ml-auto">
              Current
            </Badge>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
