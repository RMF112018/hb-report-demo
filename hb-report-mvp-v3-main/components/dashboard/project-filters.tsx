"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"

interface ProjectFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  groupBy: string
  onGroupByChange: (value: string) => void
  onClearFilters: () => void
  activeFiltersCount: number
}

export function ProjectFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  groupBy,
  onGroupByChange,
  onClearFilters,
  activeFiltersCount,
}: ProjectFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">Group By:</span>
              <Select value={groupBy} onValueChange={onGroupByChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">Status:</span>
              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Badge */}
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Filter className="h-3 w-3" />
                {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}
              </Badge>
            )}

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={onClearFilters}
              size="sm"
              className="gap-1"
              disabled={activeFiltersCount === 0}
            >
              <X className="h-3 w-3" />
              Clear All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
