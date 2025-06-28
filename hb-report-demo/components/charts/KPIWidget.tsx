'use client'

import { cn } from '@/lib/utils'

interface KPIWidgetProps {
  icon?: React.ElementType
  label?: string
  value: string | number
  sublabel?: string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  caption?: string
  emphasisColor?: string
  compact?: boolean
  performance?: 'good' | 'ok' | 'warning' | 'bad'
}

/**
 * KPIWidget
 * ---------
 * Displays a KPI metric in a compact, modern tile. Supports a 'compact' mode for smaller font and padding.
 */
export function KPIWidget({
  icon: Icon,
  label,
  value,
  sublabel,
  unit,
  trend,
  caption,
  emphasisColor = 'text-primary',
  compact = false,
  performance = 'ok',
}: KPIWidgetProps) {
  const trendSymbol = trend === 'up' ? '\u25b2' : trend === 'down' ? '\u25bc' : '\u25cf'
  const trendColor =
    trend === 'up' ? 'text-green-500 dark:text-green-400' : trend === 'down' ? 'text-red-500 dark:text-red-400' : 'text-muted-foreground'

  // Performance-based color coding
  const getPerformanceStyles = () => {
    switch (performance) {
      case 'good':
        return 'bg-green-50/80 dark:bg-green-950/50 border-green-200 dark:border-green-800 dark:border-green-800 shadow-green-100 dark:shadow-green-900/20'
      case 'warning':
        return 'bg-amber-50/80 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 dark:border-amber-800 shadow-amber-100 dark:shadow-amber-900/20'
      case 'bad':
        return 'bg-red-50/80 dark:bg-red-950/50 border-red-200 dark:border-red-800 dark:border-red-800 shadow-red-100 dark:shadow-red-900/20'
      default: // 'ok'
        return 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 dark:border-blue-800 shadow-blue-100 dark:shadow-blue-900/20'
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-lg shadow-sm border',
        getPerformanceStyles(),
        compact ? 'p-2 text-xs min-h-[60px]' : 'p-4 text-base min-h-[90px]'
      )}
    >
      {Icon && <div className={compact ? 'mb-0.5' : 'mb-1'}><Icon className={compact ? 'h-3 w-3' : 'h-4 w-4'} /></div>}
      <div className={compact ? 'text-[11px] text-muted-foreground' : 'text-sm text-muted-foreground'}>{label}</div>
      <div className={cn(compact ? 'text-lg' : 'text-3xl', 'font-bold', emphasisColor)}>
        {value}
        {unit && <span className={compact ? 'text-xs ml-0.5' : 'text-base ml-1'}>{unit}</span>}
      </div>
      {sublabel && <div className={compact ? 'text-[10px] mt-0.5' : 'text-xs mt-1'}>{sublabel}</div>}
      {caption && (
        <div className={compact ? 'flex items-center mt-0.5 text-[10px]' : 'flex items-center mt-1 text-xs'}>
          <span className={`${trendColor} mr-1`}>{trendSymbol}</span>
          <span className="text-muted-foreground">{caption}</span>
        </div>
      )}
    </div>
  )
}
