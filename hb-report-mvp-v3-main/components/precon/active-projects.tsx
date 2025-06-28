"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Calendar, User, Building } from "lucide-react"
import type { PreConProject } from "@/types/precon"

interface ActiveProjectsProps {
  projects: PreConProject[]
}

export function ActiveProjects({ projects }: ActiveProjectsProps) {
  const activeProjects = projects.filter((p) => p.status === "active")

  const getDaysUntilDeadline = (deadline: Date) => {
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Active Pre-Construction Projects ({activeProjects.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeProjects.map((project) => {
            const daysRemaining = getDaysUntilDeadline(project.estimateDeadline)
            const isUrgent = daysRemaining <= 7
            const isWarning = daysRemaining <= 14 && daysRemaining > 7

            return (
              <div key={project.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{project.name}</h4>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {project.estimator}
                      </span>
                      <span>{project.projectType}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-semibold">{formatCurrency(project.estimatedValue)}</div>
                    <Badge variant={isUrgent ? "destructive" : isWarning ? "default" : "secondary"}>
                      {daysRemaining} days left
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Deadline: {formatDate(project.estimateDeadline.toISOString())}
                    </span>
                    <span>{project.subcontractorCount} subcontractors</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {project.trades.map((trade) => (
                      <Badge key={trade} variant="outline" className="text-xs">
                        {trade}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
