"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, Clock, Plus, FileText, Calendar } from "lucide-react"

export function DashboardSidebar() {
  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button size="sm" className="w-full justify-start" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
          <Button size="sm" className="w-full justify-start" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button size="sm" className="w-full justify-start" variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Review
          </Button>
        </CardContent>
      </Card>

      {/* Alerts & Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
            Critical Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-red-900">Budget Overrun</p>
                <p className="text-xs text-red-700">Metro Office Complex</p>
                <p className="text-xs text-red-600 mt-1">15% over budget</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-yellow-900">Schedule Risk</p>
                <p className="text-xs text-yellow-700">Panther Tower South</p>
                <p className="text-xs text-yellow-600 mt-1">2 days behind</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>68%</span>
            </div>
            <Progress value={68} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Budget Utilization</span>
              <span>72%</span>
            </div>
            <Progress value={72} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Schedule Adherence</span>
              <span>85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <p className="font-medium">Report Published</p>
                <p className="text-gray-500">Panther Tower - Weekly</p>
                <p className="text-gray-400">2h ago</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <p className="font-medium">Budget Updated</p>
                <p className="text-gray-500">Metro Office Complex</p>
                <p className="text-gray-400">4h ago</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <p className="font-medium">Milestone Delayed</p>
                <p className="text-gray-500">Residential Complex A</p>
                <p className="text-gray-400">1d ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
