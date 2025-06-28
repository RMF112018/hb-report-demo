"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Users, Info } from "lucide-react"
import type { TradeParticipationType } from "@/types/precon"

interface TradeParticipationProps {
  trades: TradeParticipationType[]
}

export function TradeParticipation({ trades }: TradeParticipationProps) {
  const maxParticipation = Math.max(...trades.map((t) => t.averageParticipation))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Average Subcontractor Participation by Trade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trades.map((trade) => (
            <div key={trade.trade} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{trade.trade}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <div className="font-medium">Top Subcontractors:</div>
                          {trade.topSubcontractors.map((sub, index) => (
                            <div key={index} className="text-sm">
                              {index + 1}. {sub}
                            </div>
                          ))}
                          <div className="text-sm text-muted-foreground mt-2">{trade.totalProjects} total projects</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-sm font-medium">{trade.averageParticipation.toFixed(1)} avg</span>
              </div>
              <Progress value={(trade.averageParticipation / maxParticipation) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
