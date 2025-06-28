'use client'

import {
  FunnelChart as ReFunnelChart,
  Funnel,
  Tooltip,
  LabelList,
  ResponsiveContainer
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'

interface ChartProps {
  title?: string
  data: any[]
  xKey: string
  yKey: string
}

export function FunnelChart({ title = 'Funnel Chart', data, xKey, yKey }: ChartProps) {
  return (
    <Card className="h-full">
      <CardContent className="h-full p-4">
        <h3 className="text-md font-semibold mb-2">{title}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ReFunnelChart>
            <Tooltip />
            <Funnel dataKey={yKey} data={data} isAnimationActive>
              <LabelList position="right" fill="#000" stroke="none" dataKey={xKey} />
            </Funnel>
          </ReFunnelChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
