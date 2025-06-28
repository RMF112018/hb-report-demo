'use client'

import {
  ComposedChart,
  Line,
  Area,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'

interface ChartProps {
  title?: string
  data: any[]
  xKey: string
  yKey: string
}

export function ComposedKPIChart({ title = 'Composed Chart', data, xKey, yKey }: ChartProps) {
  return (
    <Card className="h-full">
      <CardContent className="h-full p-4">
        <h3 className="text-md font-semibold mb-2">{title}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={yKey} fill="hsl(var(--chart-1) / 0.3)" stroke="hsl(var(--chart-1))" />
            <Bar dataKey={yKey} barSize={20} fill="hsl(var(--chart-2))" />
            <Line type="monotone" dataKey={yKey} stroke="hsl(var(--chart-1))" />
            <Scatter dataKey={yKey} fill="hsl(var(--chart-4))" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
