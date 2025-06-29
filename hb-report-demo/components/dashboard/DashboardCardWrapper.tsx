'use client'

import { cn } from '@/lib/utils'
import { X, Move, Settings2, MoreVertical, Maximize2, Minimize2 } from 'lucide-react'
import { DashboardCard } from '@/types/dashboard'
import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface DashboardCardWrapperProps {
  card: DashboardCard
  children: ReactNode
  onRemove?: (id: string) => void
  onConfigure?: (id: string) => void
  dragHandleClass?: string
  isEditing?: boolean
  isCompact?: boolean
}

// Define card categories for theming
const getCardCategory = (cardType: string): 'financial' | 'operational' | 'analytics' | 'project' | 'schedule' => {
  const financialCards = ['financial-status', 'cash-flow', 'financial-review-panel', 'procurement', 'draw-forecast', 'contingency-analysis']
  const operationalCards = ['safety', 'quality-control', 'field-reports', 'staffing-distribution']
  const analyticsCards = ['enhanced-hbi-insights', 'pipeline-analytics', 'market-intelligence']
  const projectCards = ['project-overview', 'portfolio-overview', 'bd-opportunities']
  const scheduleCards = ['schedule-performance', 'schedule-monitor', 'critical-dates']
  
  if (financialCards.includes(cardType)) return 'financial'
  if (operationalCards.includes(cardType)) return 'operational'  
  if (analyticsCards.includes(cardType)) return 'analytics'
  if (projectCards.includes(cardType)) return 'project'
  if (scheduleCards.includes(cardType)) return 'schedule'
  
  return 'project' // default
}

const getCategoryTheme = (category: string) => {
  const themes = {
    financial: {
      border: 'border-green-200/60 dark:border-green-800/60',
      shadow: 'shadow-green-100/50 dark:shadow-green-900/30',
      gradient: 'from-green-50/80 via-emerald-50/40 to-green-50/80 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-green-950/20',
      accent: 'border-l-4 border-l-green-500 dark:border-l-green-400'
    },
    operational: {
      border: 'border-orange-200/60 dark:border-orange-800/60',
      shadow: 'shadow-orange-100/50 dark:shadow-orange-900/30', 
      gradient: 'from-orange-50/80 via-amber-50/40 to-orange-50/80 dark:from-orange-950/20 dark:via-amber-950/10 dark:to-orange-950/20',
      accent: 'border-l-4 border-l-orange-500 dark:border-l-orange-400'
    },
    analytics: {
      border: 'border-purple-200/60 dark:border-purple-800/60',
      shadow: 'shadow-purple-100/50 dark:shadow-purple-900/30',
      gradient: 'from-purple-50/80 via-indigo-50/40 to-purple-50/80 dark:from-purple-950/20 dark:via-indigo-950/10 dark:to-purple-950/20',
      accent: 'border-l-4 border-l-purple-500 dark:border-l-purple-400'
    },
    project: {
      border: 'border-blue-200/60 dark:border-blue-800/60',
      shadow: 'shadow-blue-100/50 dark:shadow-blue-900/30',
      gradient: 'from-blue-50/80 via-indigo-50/40 to-blue-50/80 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-blue-950/20',
      accent: 'border-l-4 border-l-blue-500 dark:border-l-blue-400'
    },
    schedule: {
      border: 'border-cyan-200/60 dark:border-cyan-800/60',
      shadow: 'shadow-cyan-100/50 dark:shadow-cyan-900/30',
      gradient: 'from-cyan-50/80 via-sky-50/40 to-cyan-50/80 dark:from-cyan-950/20 dark:via-sky-950/10 dark:to-cyan-950/20',
      accent: 'border-l-4 border-l-cyan-500 dark:border-l-cyan-400'
    }
  }
  
  return themes[category as keyof typeof themes] || themes.project
}

export const DashboardCardWrapper = ({
  card,
  children,
  onRemove,
  onConfigure,
  dragHandleClass,
  isEditing = false,
  isCompact = false
}: DashboardCardWrapperProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  const category = getCardCategory(card.type)
  const theme = getCategoryTheme(category)
  
  return (
    <div
      className={cn(
        // Base structure
        "group relative rounded-xl transition-all duration-300 ease-out",
        // Background with category theming
        `bg-gradient-to-br ${theme.gradient}`,
        // Enhanced borders and shadows
        `border-2 ${theme.border}`,
        `shadow-lg hover:shadow-xl ${theme.shadow}`,
        // Category accent border
        theme.accent,
        // Hover and interaction states
        "hover:scale-[1.02] hover:-translate-y-1",
        // Edit mode styling
        isEditing && "ring-2 ring-primary/20 ring-offset-2 ring-offset-background",
        // Focus states
        "focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2",
        // Compact sizing
        isCompact ? "min-h-[280px]" : "min-h-[320px]",
        dragHandleClass
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Controls Overlay */}
      {isEditing && (
        <div className={cn(
          "absolute -top-2 -right-2 z-20 flex gap-1 transition-all duration-200",
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          <Button
            size="sm"
            variant="secondary"
            className="h-6 w-6 p-0 bg-background/90 backdrop-blur-sm shadow-md border border-border/60"
            onClick={() => onConfigure?.(card.id)}
          >
            <Settings2 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-6 w-6 p-0 bg-destructive/90 backdrop-blur-sm shadow-md"
            onClick={() => onRemove?.(card.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {/* Drag Handle */}
      {isEditing && (
        <div className={cn(
          "absolute top-2 right-2 z-10 transition-all duration-200 cursor-move",
          isHovered ? "opacity-100" : "opacity-60"
        )}>
          <div className="p-1 rounded bg-background/40 backdrop-blur-sm">
            <Move className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
      )}
      
      {/* Card Actions Menu (Non-edit mode) */}
      {!isEditing && (
        <div className={cn(
          "absolute top-3 right-3 z-10 transition-all duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 bg-background/60 backdrop-blur-sm hover:bg-background/80"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? (
                  <>
                    <Minimize2 className="h-3 w-3 mr-2" />
                    Minimize
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3 w-3 mr-2" />
                    Focus
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onConfigure?.(card.id)}>
                <Settings2 className="h-3 w-3 mr-2" />
                Configure
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      {/* Enhanced content wrapper with better padding and overflow handling */}
      <div className={cn(
        "relative h-full rounded-xl overflow-hidden",
        // Add subtle inner shadow for depth
        "shadow-inner shadow-black/5",
        // Expanded state styling
        isExpanded && "fixed inset-4 z-50 bg-background/95 backdrop-blur-md shadow-2xl"
      )}>
        {children}
      </div>
      
      {/* Category indicator */}
      <div className="absolute bottom-2 left-2 z-10">
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
          "bg-background/60 text-foreground/70 border border-border/40"
        )}>
          {category}
        </div>
      </div>
      
      {/* Loading shimmer effect for empty states */}
      {card.type === 'placeholder' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      )}
    </div>
  )
}
