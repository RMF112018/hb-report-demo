// components/charts/LineChart.tsx
'use client'

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'

interface CustomLineChartProps {
  data: any[]
  title?: string
  color?: string
}

export function CustomLineChart({ data, title = 'Line Chart', color = 'hsl(var(--chart-2))' }: CustomLineChartProps) {
  return (
    <Card className="h-full">
      <CardContent className="h-full p-4">
        <h3 className="text-md font-semibold mb-2">{title}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3 }} />
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip wrapperStyle={{ fontSize: '0.75rem' }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}