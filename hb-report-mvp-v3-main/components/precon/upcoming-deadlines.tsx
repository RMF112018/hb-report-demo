"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Clock, AlertTriangle, Calendar } from "lucide-react"
import type { UpcomingDeadline } from "@/types/precon"

interface UpcomingDeadlinesProps {
  deadlines: UpcomingDeadline[]
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Calendar className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "urgent":
        return "destructive" as const
      case "warning":
        return "default" as const
      default:
        return "secondary" as const
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {deadlines.map((deadline) => (
            <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(deadline.status)}
                <div>
                  <div className="font-medium">{deadline.projectName}</div>
                  <div className="text-sm text-muted-foreground">{deadline.client}</div>
                  <div className="text-xs text-muted-foreground">Estimator: {deadline.estimator}</div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm font-medium">{formatDate(deadline.deadline.toISOString())}</div>
                <Badge variant={getStatusVariant(deadline.status)}>{deadline.daysRemaining} days</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
