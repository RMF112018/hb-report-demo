"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export function PermitsSidebar() {
  return (
    <div className="p-4 space-y-4">
      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Plus className="h-4 w-4 mr-2" />
            Submit Permit
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Inspection
          </Button>
        </CardContent>
      </Card>

      {/* Permit Status Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Approved
            </span>
            <Badge className="bg-green-100 text-green-800">12</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <Clock className="h-3 w-3 text-yellow-500" />
              Pending
            </span>
            <Badge className="bg-yellow-100 text-yellow-800">5</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <AlertTriangle className="h-3 w-3 text-red-500" />
              Rejected
            </span>
            <Badge className="bg-red-100 text-red-800">2</Badge>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-2 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm font-medium text-red-900">Building Permit</p>
            <p className="text-xs text-red-700">Due: Tomorrow</p>
            <Badge variant="destructive" className="mt-1 text-xs">
              Urgent
            </Badge>
          </div>

          <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm font-medium text-yellow-900">Fire Safety Inspection</p>
            <p className="text-xs text-yellow-700">Due: Dec 18</p>
            <Badge variant="secondary" className="mt-1 text-xs bg-yellow-100 text-yellow-800">
              Soon
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-900">Electrical approved</span>
              <span className="text-gray-500 text-xs ml-auto">1h ago</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-900">Plumbing submitted</span>
              <span className="text-gray-500 text-xs ml-auto">3h ago</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-900">HVAC rejected</span>
              <span className="text-gray-500 text-xs ml-auto">1d ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
