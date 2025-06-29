"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Filter, Clock, AlertTriangle, CheckCircle } from "lucide-react"

export function ConstraintsSidebar() {
  return (
    <div className="space-y-4">
      {/* Quick Add Constraint */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Quick Add</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Constraint description..." className="text-sm" />
          <Select>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Constraint
          </Button>
        </CardContent>
      </Card>

      {/* Priority Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
            High Priority
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-red-900">Permit Delay</p>
              <Badge variant="destructive" className="text-xs">
                Critical
              </Badge>
            </div>
            <p className="text-xs text-red-700">Building permit pending approval</p>
            <p className="text-xs text-red-600 mt-1">Blocking foundation work</p>
          </div>

          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-red-900">Material Shortage</p>
              <Badge variant="destructive" className="text-xs">
                Critical
              </Badge>
            </div>
            <p className="text-xs text-red-700">Steel beams delayed 2 weeks</p>
            <p className="text-xs text-red-600 mt-1">Affects structural timeline</p>
          </div>
        </CardContent>
      </Card>

      {/* Filter Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button size="sm" className="w-full justify-start" variant="outline">
            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
            Critical Only
          </Button>
          <Button size="sm" className="w-full justify-start" variant="outline">
            <Clock className="h-4 w-4 mr-2 text-yellow-500" />
            Overdue
          </Button>
          <Button size="sm" className="w-full justify-start" variant="outline">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            Resolved
          </Button>
        </CardContent>
      </Card>

      {/* Resolution Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Resolution Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>3 resolved this week</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>5 in progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>2 overdue</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
