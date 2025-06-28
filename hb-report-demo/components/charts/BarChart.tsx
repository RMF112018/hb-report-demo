// components/charts/BarChart.tsx
'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { FC } from 'react'

interface BarChartProps {
  data: { name: string; value: number }[]
  title?: string
  color?: string
}

export const CustomBarChart: FC<BarChartProps> = ({ data, title, color = 'hsl(var(--chart-2))' }) => {
  return (
    <div className="w-full h-full">
      {title && <h2 className="text-sm font-medium text-muted-foreground mb-2">{title}</h2>}
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
