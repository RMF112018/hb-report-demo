"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Calendar, TrendingUp, Users, FileText, AlertCircle } from "lucide-react"

export function PreConSidebar() {
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
            <FileText className="h-4 w-4 mr-2" />
            New RFP
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            Invite Trades
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Walkthrough
          </Button>
        </CardContent>
      </Card>

      {/* Active Bids */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Active Bids
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900">Metro Office Complex</p>
            <p className="text-xs text-blue-700">15 trades invited</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="text-xs bg-blue-100 text-blue-800">8 responses</Badge>
              <span className="text-xs text-blue-600">Due: Dec 20</span>
            </div>
          </div>

          <div className="p-2 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-900">Residential Phase 2</p>
            <p className="text-xs text-green-700">12 trades invited</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="text-xs bg-green-100 text-green-800">12 responses</Badge>
              <span className="text-xs text-green-600">Complete</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Bid Deadlines */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-2 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm font-medium text-red-900">Electrical Bids</p>
            <p className="text-xs text-red-700">Due: Tomorrow 5PM</p>
            <Badge variant="destructive" className="mt-1 text-xs">
              Urgent
            </Badge>
          </div>

          <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm font-medium text-yellow-900">HVAC Proposals</p>
            <p className="text-xs text-yellow-700">Due: Dec 18</p>
            <Badge variant="secondary" className="mt-1 text-xs bg-yellow-100 text-yellow-800">
              2 days
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Trade Participation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Trade Participation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Electrical</span>
            <Badge className="bg-green-100 text-green-800">5/5</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Plumbing</span>
            <Badge className="bg-yellow-100 text-yellow-800">3/4</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">HVAC</span>
            <Badge className="bg-red-100 text-red-800">1/3</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Concrete</span>
            <Badge className="bg-green-100 text-green-800">4/4</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Response Rate</span>
            <Badge className="bg-green-100 text-green-800">87%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Avg Bid Time</span>
            <Badge className="bg-blue-100 text-blue-800">12 days</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Cost Variance</span>
            <Badge className="bg-yellow-100 text-yellow-800">-2.3%</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
