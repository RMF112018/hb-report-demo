'use client'

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface AreaChartProps {
  data: { name: string; value: number }[]
  title?: string
  color?: string
  compact?: boolean
}

/**
 * AreaChart
 * ---------
 * Renders a modern, compact area chart for analytics dashboards. Supports a 'compact' mode for smaller font and margin.
 */
export function AreaChart({ data, title, color = 'hsl(var(--chart-1))', compact = false }: AreaChartProps) {
  return (
    <div className={compact ? 'h-full w-full' : 'h-full w-full'}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={compact ? { top: 2, right: 8, bottom: 2, left: 0 } : { top: 10, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill="url(#colorValue)" />
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tick={{ fontSize: compact ? 10 : 12 }} />
          <YAxis tick={{ fontSize: compact ? 10 : 12 }} />
          <Tooltip wrapperStyle={{ fontSize: compact ? '0.65rem' : '0.75rem' }} />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
