"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Search,
  Filter,
  X,
  Calendar as CalendarIcon,
  AlertTriangle,
  FileText,
  Building,
  Clock,
  Users,
  Settings2
} from "lucide-react"
import { format, addDays, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns"
import type { PermitFilters as PermitFiltersType } from "@/types/permit-log"

interface PermitFiltersProps {
  filters: PermitFiltersType
  onFiltersChange: (filters: PermitFiltersType) => void
  onClose?: () => void
  searchTerm?: string
  onSearchChange?: (term: string) => void
  className?: string
  compact?: boolean
}

const permitStatuses = [
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "approved", label: "Approved", color: "green" },
  { value: "expired", label: "Expired", color: "red" },
  { value: "rejected", label: "Rejected", color: "red" },
  { value: "renewed", label: "Renewed", color: "blue" }
]

const permitTypes = [
  "Building",
  "Electrical",
  "Plumbing",
  "Mechanical",
  "Fire Safety",
  "Demolition",
  "Excavation",
  "Environmental",
  "Zoning",
  "Occupancy"
]

const permitPriorities = [
  { value: "low", label: "Low", color: "green" },
  { value: "medium", label: "Medium", color: "yellow" },
  { value: "high", label: "High", color: "orange" },
  { value: "urgent", label: "Urgent", color: "red" },
  { value: "critical", label: "Critical", color: "red" }
]

const inspectionResults = [
  { value: "passed", label: "Passed", color: "green" },
  { value: "failed", label: "Failed", color: "red" },
  { value: "conditional", label: "Conditional", color: "yellow" },
  { value: "pending", label: "Pending", color: "blue" }
]

const datePresets = [
  { label: "Today", getValue: () => ({ start: format(new Date(), "yyyy-MM-dd"), end: format(new Date(), "yyyy-MM-dd") }) },
  { label: "This Week", getValue: () => ({ start: format(subDays(new Date(), 7), "yyyy-MM-dd"), end: format(new Date(), "yyyy-MM-dd") }) },
  { label: "This Month", getValue: () => ({ start: format(startOfMonth(new Date()), "yyyy-MM-dd"), end: format(endOfMonth(new Date()), "yyyy-MM-dd") }) },
  { label: "Last 30 Days", getValue: () => ({ start: format(subDays(new Date(), 30), "yyyy-MM-dd"), end: format(new Date(), "yyyy-MM-dd") }) },
  { label: "Last 90 Days", getValue: () => ({ start: format(subDays(new Date(), 90), "yyyy-MM-dd"), end: format(new Date(), "yyyy-MM-dd") }) },
  { label: "This Year", getValue: () => ({ start: format(new Date(new Date().getFullYear(), 0, 1), "yyyy-MM-dd"), end: format(new Date(), "yyyy-MM-dd") }) }
]

export function PermitFilters({
  filters,
  onFiltersChange,
  onClose,
  searchTerm = "",
  onSearchChange,
  className = "",
  compact = false
}: PermitFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PermitFiltersType>(filters)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: filters.dateRange ? new Date(filters.dateRange.start) : undefined,
    to: filters.dateRange ? new Date(filters.dateRange.end) : undefined
  })

  // Update local state when props change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof PermitFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }, [localFilters, onFiltersChange])

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchTerm(value)
    if (onSearchChange) {
      onSearchChange(value)
    }
  }, [onSearchChange])

  const handleDateRangeChange = useCallback((range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range)
    if (range.from && range.to) {
      handleFilterChange('dateRange', {
        start: format(range.from, "yyyy-MM-dd"),
        end: format(range.to, "yyyy-MM-dd")
      })
    } else {
      handleFilterChange('dateRange', undefined)
    }
  }, [handleFilterChange])

  const handleDatePreset = useCallback((preset: typeof datePresets[0]) => {
    const range = preset.getValue()
    const from = new Date(range.start)
    const to = new Date(range.end)
    setDateRange({ from, to })
    handleFilterChange('dateRange', range)
  }, [handleFilterChange])

  const clearAllFilters = useCallback(() => {
    setLocalFilters({})
    setLocalSearchTerm("")
    setDateRange({ from: undefined, to: undefined })
    onFiltersChange({})
    if (onSearchChange) {
      onSearchChange("")
    }
  }, [onFiltersChange, onSearchChange])

  const clearFilter = useCallback((key: keyof PermitFiltersType) => {
    const newFilters = { ...localFilters }
    delete newFilters[key]
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
    
    if (key === 'dateRange') {
      setDateRange({ from: undefined, to: undefined })
    }
  }, [localFilters, onFiltersChange])

  const getActiveFilterCount = useCallback(() => {
    let count = 0
    if (localFilters.status) count++
    if (localFilters.type) count++
    if (localFilters.authority) count++
    if (localFilters.projectId) count++
    if (localFilters.dateRange) count++
    if (localFilters.inspectionResult) count++
    if (localFilters.expiringWithin) count++
    if (localFilters.priority) count++
    if (localSearchTerm) count++
    return count
  }, [localFilters, localSearchTerm])

  if (compact) {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search permits..."
            value={localSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={localFilters.status || ""} onValueChange={(value) => handleFilterChange('status', value || undefined)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            {permitStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${status.color}-500`} />
                  {status.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={localFilters.type || ""} onValueChange={(value) => handleFilterChange('type', value || undefined)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {permitTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {getActiveFilterCount() > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear ({getActiveFilterCount()})
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#003087] dark:text-blue-400 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Permit Filters
            </CardTitle>
            <CardDescription>Filter and search permits by various criteria</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary">{getActiveFilterCount()} active</Badge>
            )}
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by permit number, type, authority, or description..."
              value={localSearchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Status
            </Label>
            <Select value={localFilters.status || ""} onValueChange={(value) => handleFilterChange('status', value || undefined)}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                {permitStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-${status.color}-500`} />
                      {status.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Type
            </Label>
            <Select value={localFilters.type || ""} onValueChange={(value) => handleFilterChange('type', value || undefined)}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {permitTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Priority
            </Label>
            <Select value={localFilters.priority || ""} onValueChange={(value) => handleFilterChange('priority', value || undefined)}>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                {permitPriorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-${priority.color}-500`} />
                      {priority.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Inspection Result Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Inspection Result
            </Label>
            <Select value={localFilters.inspectionResult || ""} onValueChange={(value) => handleFilterChange('inspectionResult', value || undefined)}>
              <SelectTrigger>
                <SelectValue placeholder="All Results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Results</SelectItem>
                {inspectionResults.map((result) => (
                  <SelectItem key={result.value} value={result.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-${result.color}-500`} />
                      {result.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Advanced Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Advanced Filters
            </Label>
            <Switch
              checked={showAdvanced}
              onCheckedChange={setShowAdvanced}
            />
          </div>

          {showAdvanced && (
            <div className="space-y-4">
              {/* Authority Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Authority</Label>
                <Input
                  placeholder="Filter by permit authority..."
                  value={localFilters.authority || ""}
                  onChange={(e) => handleFilterChange('authority', e.target.value || undefined)}
                />
              </div>

              {/* Project ID Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Project ID</Label>
                <Input
                  placeholder="Filter by project ID..."
                  value={localFilters.projectId || ""}
                  onChange={(e) => handleFilterChange('projectId', e.target.value || undefined)}
                />
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Application Date Range
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {datePresets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => handleDatePreset(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={handleDateRangeChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Expiring Within Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Expiring Within (Days)
                </Label>
                <Select 
                  value={localFilters.expiringWithin?.toString() || ""} 
                  onValueChange={(value) => handleFilterChange('expiringWithin', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Not filtered" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not filtered</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-medium">Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {localSearchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {localSearchTerm}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => handleSearchChange("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {localFilters.status && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {permitStatuses.find(s => s.value === localFilters.status)?.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => clearFilter('status')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {localFilters.type && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {localFilters.type}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => clearFilter('type')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {localFilters.priority && (
                  <Badge variant="secondary" className="gap-1">
                    Priority: {permitPriorities.find(p => p.value === localFilters.priority)?.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => clearFilter('priority')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {localFilters.inspectionResult && (
                  <Badge variant="secondary" className="gap-1">
                    Inspection: {inspectionResults.find(r => r.value === localFilters.inspectionResult)?.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => clearFilter('inspectionResult')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {localFilters.authority && (
                  <Badge variant="secondary" className="gap-1">
                    Authority: {localFilters.authority}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => clearFilter('authority')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {localFilters.dateRange && (
                  <Badge variant="secondary" className="gap-1">
                    Date: {format(new Date(localFilters.dateRange.start), "MMM dd")} - {format(new Date(localFilters.dateRange.end), "MMM dd")}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => clearFilter('dateRange')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {localFilters.expiringWithin && (
                  <Badge variant="secondary" className="gap-1">
                    Expiring: {localFilters.expiringWithin} days
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => clearFilter('expiringWithin')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
} 