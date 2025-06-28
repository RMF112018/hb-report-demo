"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

interface ContextualSidebarProps {
  children: React.ReactNode
  className?: string
}

export function ContextualSidebar({ children, className }: ContextualSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsExpanded(false)
    }, 300)
    setHoverTimeout(timeout)
  }

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  return (
    <div
      className={cn(
        "fixed top-16 right-0 h-[calc(100vh-4rem)] bg-white border-l border-gray-200 shadow-lg transition-all duration-300 ease-in-out z-40",
        isExpanded ? "w-80" : "w-3",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Collapsed state indicator */}
      {!isExpanded && (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="w-2 h-8 bg-blue-500 rounded-full mb-2"></div>
          <div className="w-2 h-4 bg-gray-300 rounded-full mb-2"></div>
          <div className="w-2 h-4 bg-yellow-500 rounded-full"></div>
        </div>
      )}

      {/* Expanded content */}
      {isExpanded && (
        <div className="h-full overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Quick Actions</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
          <div className="p-4">{children}</div>
        </div>
      )}
    </div>
  )
}
