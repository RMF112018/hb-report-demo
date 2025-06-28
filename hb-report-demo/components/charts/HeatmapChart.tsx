'use client'

import { ResponsiveContainer, ScatterChart, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Scatter } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'

interface HeatmapChartProps {
  title?: string
  data: { x: number; y: number; z: number }[]
}

export function HeatmapChart({ title = 'Heatmap Chart', data }: HeatmapChartProps) {
  return (
    <Card className="h-full">
      <CardContent className="h-full p-4">
        <h3 className="text-md font-semibold mb-2">{title}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="X Axis" />
            <YAxis type="number" dataKey="y" name="Y Axis" />
            <ZAxis type="number" dataKey="z" range={[0, 1000]} name="Heat" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={data} fill="hsl(var(--chart-4))" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
