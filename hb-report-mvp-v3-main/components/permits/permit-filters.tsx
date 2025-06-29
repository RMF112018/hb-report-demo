"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Permit, Project } from "@/types"
import { Search, X } from "lucide-react"

interface PermitFiltersProps {
  filters: {
    status: string
    type: string
    project: string
    authority: string
    dateRange: string
    search: string
  }
  onFiltersChange: (filters: any) => void
  permits: Permit[]
  projects: Project[]
}

export function PermitFilters({ filters, onFiltersChange, permits, projects }: PermitFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      status: "all",
      type: "all",
      project: "all",
      authority: "all",
      dateRange: "all",
      search: "",
    })
  }

  // Get unique values for filter options
  const uniqueTypes = [...new Set(permits.map((p) => p.type))].sort()
  const uniqueAuthorities = [...new Set(permits.map((p) => p.authority))].sort()

  const hasActiveFilters = Object.values(filters).some((f) => f !== "all" && f !== "")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filter Permits</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search"
              placeholder="Search permits..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Project */}
        <div className="space-y-2">
          <Label>Project</Label>
          <Select value={filters.project} onValueChange={(value) => updateFilter("project", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Authority */}
        <div className="space-y-2">
          <Label>Authority</Label>
          <Select value={filters.authority} onValueChange={(value) => updateFilter("authority", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authorities</SelectItem>
              {uniqueAuthorities.map((authority) => (
                <SelectItem key={authority} value={authority}>
                  {authority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
