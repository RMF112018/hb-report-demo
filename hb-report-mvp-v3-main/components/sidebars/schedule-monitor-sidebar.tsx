"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, AlertTriangle, Users, Cloud, Zap } from "lucide-react"

export function ScheduleMonitorSidebar() {
  return (
    <div className="space-y-4">
      {/* Timeline Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Timeline Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button size="sm" className="w-full justify-start" variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            This Week
          </Button>
          <Button size="sm" className="w-full justify-start" variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Next 30 Days
          </Button>
          <Button size="sm" className="w-full justify-start" variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Critical Path
          </Button>
        </CardContent>
      </Card>

      {/* Critical Milestones */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
            Critical Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-red-900">Foundation Pour</p>
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            </div>
            <p className="text-xs text-red-700">Metro Office Complex</p>
            <p className="text-xs text-red-600 mt-1">Due: 2 days ago</p>
          </div>

          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-yellow-900">Steel Delivery</p>
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                Tomorrow
              </Badge>
            </div>
            <p className="text-xs text-yellow-700">Panther Tower South</p>
            <p className="text-xs text-yellow-600 mt-1">Due: Dec 15</p>
          </div>
        </CardContent>
      </Card>

      {/* Resource Conflicts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="h-4 w-4 mr-2 text-orange-500" />
            Resource Conflicts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs space-y-2">
            <div className="p-2 bg-orange-50 rounded border border-orange-200">
              <p className="font-medium text-orange-900">Crane Operator</p>
              <p className="text-orange-700">Double-booked Dec 16</p>
              <p className="text-orange-600">2 projects affected</p>
            </div>

            <div className="p-2 bg-orange-50 rounded border border-orange-200">
              <p className="font-medium text-orange-900">Concrete Crew</p>
              <p className="text-orange-700">Unavailable Dec 18-20</p>
              <p className="text-orange-600">Holiday schedule</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Cloud className="h-4 w-4 mr-2 text-blue-500" />
            Weather Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="p-2 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm font-medium text-blue-900">Rain Expected</p>
            <p className="text-xs text-blue-700">Dec 17-18, 70% chance</p>
            <p className="text-xs text-blue-600">May affect concrete work</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
