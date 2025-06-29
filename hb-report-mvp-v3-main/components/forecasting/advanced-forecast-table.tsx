"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Search, Filter, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, CalendarIcon } from "lucide-react"
import type { DualRowData } from "@/lib/forecast-data"
import { formatCurrency, cn } from "@/lib/utils"
import { format, differenceInBusinessDays } from "date-fns"

interface AdvancedForecastTableProps {
  data: DualRowData[]
  onRowSelect?: (rowId: string) => void
  onDataUpdate?: (rowId: string, updates: Partial<DualRowData>) => void
  editMode?: boolean
  lastUpdated?: Date
}

// Generate monthly columns for 18-month project duration
const generateMonthlyColumns = () => {
  const months = []
  const startDate = new Date(2024, 9, 1) // October 2024

  for (let i = 0; i < 22; i++) {
    // 22 months to match the PDF
    const date = new Date(startDate)
    date.setMonth(startDate.getMonth() + i)
    const monthYear = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
    months.push({
      key: `month_${i}`,
      label: monthYear,
      fullDate: date,
    })
  }

  return months
}

const MONTHLY_COLUMNS = generateMonthlyColumns()

// Forecast method options
const FORECAST_METHODS = [
  { value: "bell-curve", label: "Bell Curve" },
  { value: "s-curve", label: "S-Curve" },
  { value: "linear", label: "Linear" },
  { value: "manual", label: "Manual" },
]

// Generate mock monthly data for each cost code
const generateMockMonthlyData = (costCode: string, totalBudget: number) => {
  const monthlyData: { [key: string]: { projected: number; actual: number } } = {}

  // Create a realistic distribution pattern based on cost code type
  const isLaborIntensive = costCode.includes("LAB") || costCode.includes("308") || costCode.includes("312")
  const isFrontLoaded = costCode.includes("100") || costCode.includes("025") // Preconstruction, Plans
  const isBackLoaded = costCode.includes("340") || costCode.includes("870") // Scheduling, Photos

  MONTHLY_COLUMNS.forEach((month, index) => {
    let projectedFactor = 0
    let actualFactor = 0

    if (isFrontLoaded) {
      // Front-loaded activities
      projectedFactor = index < 6 ? 0.8 - index * 0.1 : 0.1
      actualFactor = projectedFactor * (0.8 + Math.random() * 0.4)
    } else if (isBackLoaded) {
      // Back-loaded activities
      projectedFactor = index > 15 ? 0.6 : 0.02
      actualFactor = index > 15 ? projectedFactor * (0.9 + Math.random() * 0.2) : projectedFactor * 1.1
    } else if (isLaborIntensive) {
      // Bell curve distribution for labor
      const midPoint = MONTHLY_COLUMNS.length / 2
      const distance = Math.abs(index - midPoint)
      projectedFactor = Math.max(0.01, 0.15 - distance * 0.01)
      actualFactor = projectedFactor * (0.85 + Math.random() * 0.3)
    } else {
      // Linear distribution for materials/equipment
      projectedFactor = 1 / MONTHLY_COLUMNS.length
      actualFactor = index < 8 ? projectedFactor * (0.9 + Math.random() * 0.2) : 0
    }

    monthlyData[month.key] = {
      projected: totalBudget * projectedFactor,
      actual: index < 8 ? totalBudget * actualFactor : 0, // Only show actuals for past months
    }
  })

  return monthlyData
}

// Generate mock previous forecast data (slightly different from current projected)
const generateMockPreviousForecastData = (costCode: string, totalBudget: number) => {
  const monthlyData: { [key: string]: number } = {}

  // Create variance from current projected (typically 5-15% different)
  const varianceFactor = 0.85 + Math.random() * 0.3 // 0.85 to 1.15

  MONTHLY_COLUMNS.forEach((month, index) => {
    let projectedFactor = 0

    // Similar pattern to current but with some variance
    const isLaborIntensive = costCode.includes("LAB") || costCode.includes("308") || costCode.includes("312")
    const isFrontLoaded = costCode.includes("100") || costCode.includes("025")
    const isBackLoaded = costCode.includes("340") || costCode.includes("870")

    if (isFrontLoaded) {
      projectedFactor = index < 6 ? 0.8 - index * 0.1 : 0.1
    } else if (isBackLoaded) {
      projectedFactor = index > 15 ? 0.6 : 0.02
    } else if (isLaborIntensive) {
      const midPoint = MONTHLY_COLUMNS.length / 2
      const distance = Math.abs(index - midPoint)
      projectedFactor = Math.max(0.01, 0.15 - distance * 0.01)
    } else {
      projectedFactor = 1 / MONTHLY_COLUMNS.length
    }

    monthlyData[month.key] = totalBudget * projectedFactor * varianceFactor
  })

  return monthlyData
}

// Date picker component
function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
}: {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const isValidDate = date && !isNaN(date.getTime())

  if (disabled) {
    return (
      <div className="w-[120px] px-3 py-2 text-xs border rounded-md bg-gray-50 text-gray-600">
        <CalendarIcon className="inline mr-2 h-3 w-3" />
        {isValidDate ? format(date, "MM/dd/yy") : placeholder}
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[120px] justify-start text-left font-normal text-xs",
            !isValidDate && "text-muted-foreground",
          )}
          onClick={() => setOpen(true)}
        >
          <CalendarIcon className="mr-2 h-3 w-3" />
          {isValidDate ? format(date, "MM/dd/yy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={isValidDate ? date : undefined}
          onSelect={(selectedDate) => {
            onDateChange?.(selectedDate)
            setOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

// Editable currency input component
function EditableCurrencyInput({
  value,
  onChange,
  className = "",
}: {
  value: number
  onChange: (value: number) => void
  className?: string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value.toString())

  const handleSave = () => {
    const numValue = Number.parseFloat(editValue.replace(/[^0-9.-]/g, ""))
    if (!isNaN(numValue)) {
      onChange(numValue)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      setEditValue(value.toString())
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <Input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn("w-20 h-6 text-xs font-mono text-right", className)}
        autoFocus
      />
    )
  }

  return (
    <div
      className={cn("cursor-pointer hover:bg-gray-100 px-1 py-1 rounded text-xs font-mono text-right", className)}
      onClick={() => {
        setIsEditing(true)
        setEditValue(value.toFixed(2))
      }}
    >
      {value > 0 ? formatCurrency(value).replace("$", "").replace(",", "") : "0.00"}
    </div>
  )
}

export function AdvancedForecastTable({
  data,
  onRowSelect,
  onDataUpdate,
  editMode = false,
  lastUpdated,
}: AdvancedForecastTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubJob, setSelectedSubJob] = useState<string>("all")
  const [selectedCostType, setSelectedCostType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [expandedRows, setExpandedRows] = new Set()
  const [selectedRows, setSelectedRows] = new Set()
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(null)

  // State for editable fields
  const [editableData, setEditableData] = useState<{
    [key: string]: {
      startDate?: Date
      finishDate?: Date
      forecastMethod?: string
      monthlyValues?: { [key: string]: number }
    }
  }>({})

  // Enhance data with monthly projections and default dates/methods
  const enhancedData = useMemo(() => {
    return data.map((item) => {
      // Parse dates safely
      let startDate: Date | undefined
      let endDate: Date | undefined
      let previousStartDate: Date | undefined
      let previousFinishDate: Date | undefined

      try {
        if (item.current.startDate) {
          startDate =
            typeof item.current.startDate === "string" ? new Date(item.current.startDate) : item.current.startDate
          if (isNaN(startDate.getTime())) {
            startDate = new Date() // fallback to current date
          }
        }

        if (item.current.endDate) {
          endDate = typeof item.current.endDate === "string" ? new Date(item.current.endDate) : item.current.endDate
          if (isNaN(endDate.getTime())) {
            endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // fallback to 1 year from now
          }
        }

        // Generate previous forecast dates (typically 1-30 days different)
        if (startDate) {
          previousStartDate = new Date(startDate)
          previousStartDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30) - 1)
        }

        if (endDate) {
          previousFinishDate = new Date(endDate)
          previousFinishDate.setDate(endDate.getDate() + Math.floor(Math.random() * 20) - 10)
        }
      } catch (error) {
        console.warn("Date parsing error:", error)
        startDate = new Date()
        endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        previousStartDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        previousFinishDate = new Date(Date.now() + 350 * 24 * 60 * 60 * 1000)
      }

      return {
        ...item,
        monthlyProjections: generateMockMonthlyData(item.costCode, item.current.estimatedCostAtCompletion),
        previousForecastData: generateMockPreviousForecastData(item.costCode, item.current.estimatedCostAtCompletion),
        startDate,
        endDate,
        previousStartDate,
        previousFinishDate,
        forecastMethod: item.current.forecastMethod
          ? item.current.forecastMethod.toLowerCase().replace(" ", "-")
          : "bell-curve",
      }
    })
  }, [data])

  // Get unique filter values
  const filterOptions = useMemo(
    () => ({
      subJobs: [...new Set(data.map((item) => item.costCode.split(".")[0]))],
      costTypes: [...new Set(data.map((item) => item.costCode.split(".").pop()?.split(".")[0] || "Unknown"))],
      statuses: ["on-track", "over-budget", "under-budget", "at-risk"],
    }),
    [data],
  )

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = enhancedData

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.costCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply dropdown filters
    if (selectedSubJob !== "all") {
      filtered = filtered.filter((item) => item.costCode.startsWith(selectedSubJob))
    }

    if (selectedCostType !== "all") {
      filtered = filtered.filter((item) => item.costCode.includes(selectedCostType))
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus)
    }

    return filtered
  }, [enhancedData, searchTerm, selectedSubJob, selectedCostType, selectedStatus])

  const handleDateChange = (itemId: string, field: "startDate" | "finishDate", date: Date | undefined) => {
    setEditableData((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: date,
      },
    }))

    if (onDataUpdate) {
      onDataUpdate(itemId, { [field]: date?.toISOString() })
    }
  }

  const handleForecastMethodChange = (itemId: string, method: string) => {
    setEditableData((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        forecastMethod: method,
      },
    }))

    if (onDataUpdate) {
      onDataUpdate(itemId, { forecastMethod: method })
    }
  }

  const handleMonthlyValueChange = (itemId: string, monthKey: string, value: number) => {
    setEditableData((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        monthlyValues: {
          ...prev[itemId]?.monthlyValues,
          [monthKey]: value,
        },
      },
    }))

    if (onDataUpdate) {
      onDataUpdate(itemId, { [`monthly_${monthKey}`]: value })
    }
  }

  const getMonthlyValue = (item: any, monthKey: string) => {
    return editableData[item.id]?.monthlyValues?.[monthKey] ?? item.monthlyProjections[monthKey]?.actual ?? 0
  }

  const calculateRowTotal = (item: any, rowType: "previous" | "actual") => {
    let total = 0
    MONTHLY_COLUMNS.forEach((month) => {
      if (rowType === "previous") {
        total += item.previousForecastData[month.key] || 0
      } else {
        total += getMonthlyValue(item, month.key)
      }
    })
    return total
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-track":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "over-budget":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "under-budget":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case "at-risk":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  // Calculate business days difference
  const calculateBusinessDaysDifference = (date1?: Date, date2?: Date) => {
    if (!date1 || !date2 || isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      return 0
    }
    return differenceInBusinessDays(date2, date1)
  }

  // Calculate totals for each month
  const monthlyTotals = useMemo(() => {
    const totals: { [key: string]: { projected: number; actual: number; previous: number; variance: number } } = {}

    MONTHLY_COLUMNS.forEach((month) => {
      totals[month.key] = { projected: 0, actual: 0, previous: 0, variance: 0 }
    })

    filteredData.forEach((item) => {
      MONTHLY_COLUMNS.forEach((month) => {
        const actualValue = getMonthlyValue(item, month.key)
        const previousData = item.previousForecastData[month.key] || 0

        totals[month.key].actual += actualValue
        totals[month.key].previous += previousData
        totals[month.key].variance += actualValue - previousData
      })
    })

    return totals
  }, [filteredData, editableData])

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">Construction Cost Forecast</CardTitle>
            {lastUpdated && <p className="text-sm text-gray-500 mt-1">Last updated: {lastUpdated.toLocaleString()}</p>}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cost codes, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedSubJob} onValueChange={setSelectedSubJob}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sub Job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sub Jobs</SelectItem>
                {filterOptions.subJobs.map((subJob) => (
                  <SelectItem key={subJob} value={subJob}>
                    {subJob.length > 30 ? `${subJob.substring(0, 30)}...` : subJob}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCostType} onValueChange={setSelectedCostType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Cost Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {filterOptions.costTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="sticky left-0 bg-gray-50 z-10 min-w-[300px] border-r-2 border-gray-200">
                  Description
                </TableHead>
                <TableHead className="text-right min-w-[120px]">Budget</TableHead>
                <TableHead className="text-right min-w-[120px]">Total</TableHead>
                <TableHead className="text-right min-w-[120px]">Variance</TableHead>
                <TableHead className="text-center min-w-[130px]">Start Date</TableHead>
                <TableHead className="text-center min-w-[130px]">Finish Date</TableHead>
                <TableHead className="text-center min-w-[130px]">Forecast Method</TableHead>
                {MONTHLY_COLUMNS.map((month) => (
                  <TableHead key={month.key} className="text-center min-w-[100px] text-xs">
                    {month.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <>
                  {/* Previous Forecast Row */}
                  <TableRow key={`${item.id}-previous`} className="bg-blue-50/30 hover:bg-blue-100/50 border-b-0">
                    <TableCell className="sticky left-0 bg-blue-50/30 z-10 border-r-2 border-gray-200">
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{item.costCode} - Previous Forecast</div>
                        <div className="text-xs text-gray-600 truncate max-w-[250px]" title={item.description}>
                          {item.description.split(".").pop() || item.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatCurrency(item.current.estimatedCostAtCompletion * 0.95)} {/* Previous budget estimate */}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatCurrency(calculateRowTotal(item, "previous"))}
                    </TableCell>
                    <TableCell className="text-right text-gray-400 text-sm">-</TableCell>
                    <TableCell className="text-center">
                      <DatePicker date={item.previousStartDate} placeholder="Start" disabled={true} />
                    </TableCell>
                    <TableCell className="text-center">
                      <DatePicker date={item.previousFinishDate} placeholder="Finish" disabled={true} />
                    </TableCell>
                    <TableCell className="text-center text-gray-400 text-sm">-</TableCell>
                    {MONTHLY_COLUMNS.map((month) => (
                      <TableCell key={month.key} className="text-right font-mono text-xs">
                        {item.previousForecastData[month.key] > 0
                          ? formatCurrency(item.previousForecastData[month.key]).replace("$", "").replace(",", "")
                          : "0.00"}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Actual / Remaining Forecast Row */}
                  <TableRow key={`${item.id}-actual`} className="hover:bg-gray-50 border-b-0">
                    <TableCell className="sticky left-0 bg-white z-10 border-r-2 border-gray-200">
                      <div className="space-y-1">
                        <div className="text-xs font-medium">Actual / Remaining Forecast</div>
                        <div className="flex items-center gap-2">{getStatusIcon(item.status)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-gray-400 text-sm">-</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatCurrency(calculateRowTotal(item, "actual"))}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      <span className={item.current.projectedOverUnder >= 0 ? "text-red-600" : "text-green-600"}>
                        {formatCurrency(item.current.projectedOverUnder)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <DatePicker
                        date={editableData[item.id]?.startDate || item.startDate}
                        onDateChange={(date) => handleDateChange(item.id, "startDate", date)}
                        placeholder="Start"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <DatePicker
                        date={editableData[item.id]?.finishDate || item.endDate}
                        onDateChange={(date) => handleDateChange(item.id, "finishDate", date)}
                        placeholder="Finish"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Select
                        value={editableData[item.id]?.forecastMethod || item.forecastMethod}
                        onValueChange={(value) => handleForecastMethodChange(item.id, value)}
                      >
                        <SelectTrigger className="w-[120px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FORECAST_METHODS.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    {MONTHLY_COLUMNS.map((month) => (
                      <TableCell key={month.key} className="text-right font-mono text-xs font-semibold">
                        <EditableCurrencyInput
                          value={getMonthlyValue(item, month.key)}
                          onChange={(value) => handleMonthlyValueChange(item.id, month.key, value)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Variance Row */}
                  <TableRow key={`${item.id}-variance`} className="bg-yellow-50/50 hover:bg-yellow-100/50 border-b-2">
                    <TableCell className="sticky left-0 bg-yellow-50/50 z-10 border-r-2 border-gray-200">
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-orange-700">Variance</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-gray-400 text-sm">-</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      <span
                        className={
                          calculateRowTotal(item, "actual") - calculateRowTotal(item, "previous") >= 0
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        {formatCurrency(calculateRowTotal(item, "actual") - calculateRowTotal(item, "previous"))}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-gray-400 text-sm">-</TableCell>
                    <TableCell className="text-center text-xs font-mono">
                      {calculateBusinessDaysDifference(
                        item.previousStartDate,
                        editableData[item.id]?.startDate || item.startDate,
                      )}{" "}
                      days
                    </TableCell>
                    <TableCell className="text-center text-xs font-mono">
                      {calculateBusinessDaysDifference(
                        item.previousFinishDate,
                        editableData[item.id]?.finishDate || item.endDate,
                      )}{" "}
                      days
                    </TableCell>
                    <TableCell className="text-center text-gray-400 text-sm">-</TableCell>
                    {MONTHLY_COLUMNS.map((month) => {
                      const actualValue = getMonthlyValue(item, month.key)
                      const previousValue = item.previousForecastData[month.key] || 0
                      const variance = actualValue - previousValue
                      return (
                        <TableCell key={month.key} className="text-right font-mono text-xs">
                          <span className={variance >= 0 ? "text-red-600" : "text-green-600"}>
                            {variance !== 0
                              ? `${variance >= 0 ? "+" : ""}${formatCurrency(variance)
                                  .replace("$", "")
                                  .replace(",", "")}`
                              : "0.00"}
                          </span>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                </>
              ))}

              {/* Totals Row */}
              <TableRow className="bg-gray-100 font-semibold border-t-4 border-gray-300">
                <TableCell className="sticky left-0 bg-gray-100 z-10 border-r-2 border-gray-200 font-bold">
                  Grand Totals
                </TableCell>
                <TableCell className="text-right font-mono font-bold">
                  {formatCurrency(filteredData.reduce((sum, item) => sum + item.current.estimatedCostAtCompletion, 0))}
                </TableCell>
                <TableCell className="text-right font-mono font-bold">
                  {formatCurrency(filteredData.reduce((sum, item) => sum + calculateRowTotal(item, "actual"), 0))}
                </TableCell>
                <TableCell className="text-right font-mono font-bold">
                  {formatCurrency(filteredData.reduce((sum, item) => sum + item.current.projectedOverUnder, 0))}
                </TableCell>
                <TableCell className="text-center text-gray-400">-</TableCell>
                <TableCell className="text-center text-gray-400">-</TableCell>
                <TableCell className="text-center text-gray-400">-</TableCell>
                {MONTHLY_COLUMNS.map((month) => (
                  <TableCell key={month.key} className="text-right font-mono font-bold text-xs">
                    <div className="space-y-1">
                      <div className="text-blue-700">
                        {formatCurrency(monthlyTotals[month.key]?.previous || 0)
                          .replace("$", "")
                          .replace(",", "")}
                      </div>
                      <div>
                        {formatCurrency(monthlyTotals[month.key]?.actual || 0)
                          .replace("$", "")
                          .replace(",", "")}
                      </div>
                      <div className={monthlyTotals[month.key]?.variance >= 0 ? "text-red-600" : "text-green-600"}>
                        {monthlyTotals[month.key]?.variance !== 0
                          ? `${monthlyTotals[month.key]?.variance >= 0 ? "+" : ""}${formatCurrency(
                              monthlyTotals[month.key]?.variance || 0,
                            )
                              .replace("$", "")
                              .replace(",", "")}`
                          : "0.00"}
                      </div>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No data matches your current filters</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                setSearchTerm("")
                setSelectedSubJob("all")
                setSelectedCostType("all")
                setSelectedStatus("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
