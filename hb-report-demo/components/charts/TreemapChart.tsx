'use client'

import { Treemap as ReTreemap, TreemapProps, ResponsiveContainer } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'

export function TreemapChart({ title = 'Treemap Chart', data }: { title?: string; data: TreemapProps['data'] }) {
  return (
    <Card className="h-full">
      <CardContent className="h-full p-4">
        <h3 className="text-md font-semibold mb-2">{title}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ReTreemap data={data} dataKey="size" aspectRatio={4 / 3} stroke="hsl(var(--background))" fill="hsl(var(--chart-2))" />
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
