"use client"

import React, { useState, useCallback, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Calendar as CalendarIcon,
  Mail,
  Settings,
  Users,
  BarChart3,
  Lightbulb,
  Clock,
  X,
  Plus,
  Trash2
} from "lucide-react"
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns"
import type { Permit, PermitExportOptions, PermitFilters } from "@/types/permit-log"

interface PermitExportModalProps {
  permits: Permit[]
  onClose: () => void
  className?: string
}

const exportFormats = [
  {
    value: "pdf",
    label: "PDF Report",
    description: "Professional formatted report with charts and summaries",
    icon: FileText,
    color: "text-red-600"
  },
  {
    value: "excel",
    label: "Excel Spreadsheet",
    description: "Detailed data in Excel format with multiple sheets",
    icon: FileSpreadsheet,
    color: "text-green-600"
  },
  {
    value: "csv",
    label: "CSV Data",
    description: "Raw data in CSV format for analysis",
    icon: File,
    color: "text-blue-600"
  }
]

const datePresets = [
  { 
    label: "Last 30 Days", 
    getValue: () => ({ 
      start: format(subDays(new Date(), 30), "yyyy-MM-dd"), 
      end: format(new Date(), "yyyy-MM-dd") 
    }) 
  },
  { 
    label: "Last 90 Days", 
    getValue: () => ({ 
      start: format(subDays(new Date(), 90), "yyyy-MM-dd"), 
      end: format(new Date(), "yyyy-MM-dd") 
    }) 
  },
  { 
    label: "This Month", 
    getValue: () => ({ 
      start: format(startOfMonth(new Date()), "yyyy-MM-dd"), 
      end: format(endOfMonth(new Date()), "yyyy-MM-dd") 
    }) 
  },
  { 
    label: "Last Month", 
    getValue: () => ({ 
      start: format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"), 
      end: format(endOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd") 
    }) 
  },
  { 
    label: "This Year", 
    getValue: () => ({ 
      start: format(new Date(new Date().getFullYear(), 0, 1), "yyyy-MM-dd"), 
      end: format(new Date(), "yyyy-MM-dd") 
    }) 
  }
]

export function PermitExportModal({ permits, onClose, className = "" }: PermitExportModalProps) {
  const [activeTab, setActiveTab] = useState("format")
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "excel" | "csv">("pdf")
  const [includeInspections, setIncludeInspections] = useState(true)
  const [includeAnalytics, setIncludeAnalytics] = useState(true)
  const [includeInsights, setIncludeInsights] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  })
  const [filters, setFilters] = useState<PermitFilters>({})
  const [emailDistribution, setEmailDistribution] = useState(false)
  const [emailRecipients, setEmailRecipients] = useState<string[]>([])
  const [newRecipient, setNewRecipient] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  // Calculate filtered permits based on export options
  const filteredPermits = useMemo(() => {
    let filtered = permits

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(permit => {
        const permitDate = new Date(permit.applicationDate)
        return permitDate >= dateRange.from! && permitDate <= dateRange.to!
      })
    }

    // Apply other filters
    if (filters.status) {
      filtered = filtered.filter(permit => permit.status === filters.status)
    }

    if (filters.type) {
      filtered = filtered.filter(permit => permit.type === filters.type)
    }

    if (filters.authority) {
      filtered = filtered.filter(permit => 
        permit.authority.toLowerCase().includes(filters.authority!.toLowerCase())
      )
    }

    return filtered
  }, [permits, dateRange, filters])

  // Generate export summary
  const exportSummary = useMemo(() => {
    const totalPermits = filteredPermits.length
    const totalInspections = filteredPermits.reduce((sum, p) => sum + (p.inspections?.length || 0), 0)
    const approvedPermits = filteredPermits.filter(p => p.status === "approved" || p.status === "renewed").length
    const totalCost = filteredPermits.reduce((sum, p) => sum + (p.cost || 0), 0)

    return {
      totalPermits,
      totalInspections,
      approvedPermits,
      totalCost,
      approvalRate: totalPermits > 0 ? Math.round((approvedPermits / totalPermits) * 100) : 0
    }
  }, [filteredPermits])

  // Handle date range preset selection
  const handleDatePreset = useCallback((preset: typeof datePresets[0]) => {
    const range = preset.getValue()
    setDateRange({
      from: new Date(range.start),
      to: new Date(range.end)
    })
  }, [])

  // Handle date range change
  const handleDateRangeChange = useCallback((range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range)
  }, [])

  // Handle email recipient management
  const handleAddRecipient = useCallback(() => {
    if (!newRecipient.trim() || emailRecipients.includes(newRecipient.trim())) return
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newRecipient.trim())) return

    setEmailRecipients(prev => [...prev, newRecipient.trim()])
    setNewRecipient("")
  }, [newRecipient, emailRecipients])

  const handleRemoveRecipient = useCallback((index: number) => {
    setEmailRecipients(prev => prev.filter((_, i) => i !== index))
  }, [])

  // Handle export
  const handleExport = useCallback(async () => {
    setIsExporting(true)
    
    try {
      const exportOptions: PermitExportOptions = {
        format: selectedFormat,
        includeInspections,
        includeAnalytics,
        includeInsights,
        dateRange: dateRange.from && dateRange.to ? {
          start: format(dateRange.from, "yyyy-MM-dd"),
          end: format(dateRange.to, "yyyy-MM-dd")
        } : undefined,
        filters,
        emailDistribution: emailDistribution ? {
          recipients: emailRecipients,
          subject: emailSubject || `Permit Report - ${format(new Date(), "MMM dd, yyyy")}`,
          message: emailMessage
        } : undefined
      }

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log("Export options:", exportOptions)
      console.log("Filtered permits:", filteredPermits)
      
      // In a real implementation, this would call an API to generate and download the export
      // For now, we'll just close the modal
      onClose()
      
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }, [
    selectedFormat,
    includeInspections,
    includeAnalytics,
    includeInsights,
    dateRange,
    filters,
    emailDistribution,
    emailRecipients,
    emailSubject,
    emailMessage,
    filteredPermits,
    onClose
  ])

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-hidden ${className}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Permit Data
          </DialogTitle>
          <DialogDescription>
            Configure export options for permit data and reports
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="format">Format & Content</TabsTrigger>
            <TabsTrigger value="filters">Data Filters</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="preview">Preview & Export</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-96 pr-4">
            {/* Format & Content Tab */}
            <TabsContent value="format" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Export Format</CardTitle>
                  <CardDescription>Choose the format for your export</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {exportFormats.map((format) => (
                      <div
                        key={format.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedFormat === format.value
                            ? "border-[#003087] bg-blue-50 dark:bg-blue-950"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedFormat(format.value as typeof selectedFormat)}
                      >
                        <div className="flex items-center gap-3">
                          <format.icon className={`h-6 w-6 ${format.color}`} />
                          <div>
                            <div className="font-medium">{format.label}</div>
                            <div className="text-xs text-muted-foreground">{format.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Content Options</CardTitle>
                  <CardDescription>Select what data to include in the export</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <Label>Include Inspection Details</Label>
                    </div>
                    <Switch
                      checked={includeInspections}
                      onCheckedChange={setIncludeInspections}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <Label>Include Analytics & Charts</Label>
                    </div>
                    <Switch
                      checked={includeAnalytics}
                      onCheckedChange={setIncludeAnalytics}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      <Label>Include HBI Insights</Label>
                    </div>
                    <Switch
                      checked={includeInsights}
                      onCheckedChange={setIncludeInsights}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Filters Tab */}
            <TabsContent value="filters" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Date Range
                  </CardTitle>
                  <CardDescription>Filter permits by application date</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Additional Filters</CardTitle>
                  <CardDescription>Further refine the data to export</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select 
                        value={filters.status || ""} 
                        onValueChange={(value) => setFilters(prev => ({ ...prev, status: value || undefined }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="renewed">Renewed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select 
                        value={filters.type || ""} 
                        onValueChange={(value) => setFilters(prev => ({ ...prev, type: value || undefined }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All types</SelectItem>
                          <SelectItem value="Building">Building</SelectItem>
                          <SelectItem value="Electrical">Electrical</SelectItem>
                          <SelectItem value="Plumbing">Plumbing</SelectItem>
                          <SelectItem value="Mechanical">Mechanical</SelectItem>
                          <SelectItem value="Fire Safety">Fire Safety</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Authority</Label>
                    <Input
                      placeholder="Filter by permit authority..."
                      value={filters.authority || ""}
                      onChange={(e) => setFilters(prev => ({ ...prev, authority: e.target.value || undefined }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Distribution Tab */}
            <TabsContent value="distribution" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Distribution
                  </CardTitle>
                  <CardDescription>Send the export directly via email</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable Email Distribution</Label>
                    <Switch
                      checked={emailDistribution}
                      onCheckedChange={setEmailDistribution}
                    />
                  </div>

                  {emailDistribution && (
                    <>
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label>Recipients</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter email address..."
                            value={newRecipient}
                            onChange={(e) => setNewRecipient(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddRecipient())}
                          />
                          <Button type="button" variant="outline" onClick={handleAddRecipient}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {emailRecipients.map((email, index) => (
                            <Badge key={index} variant="secondary" className="gap-1">
                              {email}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => handleRemoveRecipient(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input
                          placeholder="Email subject..."
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea
                          placeholder="Optional message to include with the export..."
                          value={emailMessage}
                          onChange={(e) => setEmailMessage(e.target.value)}
                          className="min-h-20"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preview & Export Tab */}
            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Export Summary</CardTitle>
                  <CardDescription>Review your export configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-2xl font-bold text-[#003087] dark:text-blue-400">
                        {exportSummary.totalPermits}
                      </div>
                      <div className="text-xs text-muted-foreground">Permits</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-2xl font-bold text-green-600">
                        {exportSummary.approvalRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">Approval Rate</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-2xl font-bold text-blue-600">
                        {exportSummary.totalInspections}
                      </div>
                      <div className="text-xs text-muted-foreground">Inspections</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-2xl font-bold text-orange-600">
                        ${exportSummary.totalCost.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Cost</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Export Configuration</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Format: {exportFormats.find(f => f.value === selectedFormat)?.label}</div>
                      <div>Include Inspections: {includeInspections ? "Yes" : "No"}</div>
                      <div>Include Analytics: {includeAnalytics ? "Yes" : "No"}</div>
                      <div>Include Insights: {includeInsights ? "Yes" : "No"}</div>
                      {dateRange.from && dateRange.to && (
                        <div>
                          Date Range: {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                        </div>
                      )}
                      {emailDistribution && (
                        <div>Email Distribution: {emailRecipients.length} recipients</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isExporting || (emailDistribution && emailRecipients.length === 0)}
            className="bg-[#003087] hover:bg-[#002066] text-white"
          >
            {isExporting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 