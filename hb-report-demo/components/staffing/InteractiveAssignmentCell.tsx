"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CheckCircle2, User, Users, Shield, X } from "lucide-react"
import type { ResponsibilityRole } from "@/types/responsibility"

interface InteractiveAssignmentCellProps {
  taskId: string
  roleKey: string
  role: ResponsibilityRole
  assignment: "Approve" | "Primary" | "Support" | "None"
  onAssignmentChange: (
    taskId: string,
    roleKey: string,
    assignment: "Approve" | "Primary" | "Support" | "None"
  ) => void
}

const assignmentConfig = {
  Approve: {
    icon: Shield,
    color: "bg-purple-500 hover:bg-purple-600 text-white",
    darkColor: "dark:bg-purple-600 dark:hover:bg-purple-700",
    label: "A",
    description: "Approve",
  },
  Primary: {
    icon: CheckCircle2,
    color: "bg-green-500 hover:bg-green-600 text-white",
    darkColor: "dark:bg-green-600 dark:hover:bg-green-700",
    label: "P",
    description: "Primary",
  },
  Support: {
    icon: Users,
    color: "bg-blue-500 hover:bg-blue-600 text-white",
    darkColor: "dark:bg-blue-600 dark:hover:bg-blue-700",
    label: "S",
    description: "Support",
  },
  None: {
    icon: X,
    color: "bg-gray-200 hover:bg-gray-300 text-gray-600",
    darkColor: "dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300",
    label: "-",
    description: "None",
  },
}

export function InteractiveAssignmentCell({
  taskId,
  roleKey,
  role,
  assignment,
  onAssignmentChange,
}: InteractiveAssignmentCellProps) {
  const [isOpen, setIsOpen] = useState(false)

  const config = assignmentConfig[assignment]
  const Icon = config.icon

  const handleAssignmentSelect = (newAssignment: "Approve" | "Primary" | "Support" | "None") => {
    onAssignmentChange(taskId, roleKey, newAssignment)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`w-8 h-8 p-0 rounded-full transition-all ${config.color} ${config.darkColor}`}
        >
          {assignment === "None" ? (
            <span className="text-xs font-medium">{config.label}</span>
          ) : (
            <Icon className="w-4 h-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" align="center">
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 px-2">
            Assign {role.name}
          </div>
          {Object.entries(assignmentConfig).map(([key, config]) => {
            const OptionIcon = config.icon
            return (
              <Button
                key={key}
                variant={assignment === key ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start gap-2 h-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleAssignmentSelect(key as "Approve" | "Primary" | "Support" | "None")}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${config.color} ${config.darkColor}`}>
                  {key === "None" ? (
                    <span className="text-xs font-medium">{config.label}</span>
                  ) : (
                    <OptionIcon className="w-3 h-3" />
                  )}
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300">{config.description}</span>
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
} 