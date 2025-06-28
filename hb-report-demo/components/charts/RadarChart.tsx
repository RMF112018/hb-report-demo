'use client'

import { ResponsiveContainer, RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  title?: string
  data: any[]
  dataKey: string
  valueKey: string
  strokeColor?: string
  fillColor?: string
}

export function RadarChart({
  title = 'Radar Chart',
  data,
  dataKey,
  valueKey,
  strokeColor = 'hsl(var(--chart-1))',
  fillColor = 'rgba(16, 185, 129, 0.4)',
}: Props) {
  return (
    <Card className="h-full">
      <CardContent className="h-full p-4">
        <h3 className="text-md font-semibold mb-2">{title}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ReRadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey={dataKey} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
            <Tooltip />
            <Radar
              name={valueKey}
              dataKey={valueKey}
              stroke={strokeColor}
              fill={fillColor}
              fillOpacity={0.6}
            />
          </ReRadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
