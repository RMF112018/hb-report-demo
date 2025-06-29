"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  Eye,
  Edit
} from "lucide-react"
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  parseISO,
  isBefore,
  isAfter,
  differenceInDays
} from "date-fns"
import type { Permit, Inspection, CalendarEvent } from "@/types/permit-log"

interface PermitCalendarProps {
  permits: Permit[]
  onEditPermit?: (permit: Permit) => void
  onViewPermit?: (permit: Permit) => void
  onCreatePermit?: () => void
  userRole?: string
  className?: string
}

type CalendarView = "month" | "week"
type EventType = "permit-application" | "permit-approval" | "permit-expiration" | "inspection"

const eventTypeColors = {
  "permit-application": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200",
  "permit-approval": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200",
  "permit-expiration": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200",
  "inspection": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200"
}

const eventTypeIcons = {
  "permit-application": FileText,
  "permit-approval": CheckCircle,
  "permit-expiration": AlertTriangle,
  "inspection": Users
}

export function PermitCalendar({
  permits,
  onEditPermit,
  onViewPermit,
  onCreatePermit,
  userRole = "user",
  className = ""
}: PermitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>("month")
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([
    "permit-application",
    "permit-approval", 
    "permit-expiration",
    "inspection"
  ])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const canEdit = useMemo(() => {
    return ["admin", "project-manager", "project-executive"].includes(userRole)
  }, [userRole])

  // Generate calendar events from permits
  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = []

    permits.forEach(permit => {
      // Application date event
      if (selectedEventTypes.includes("permit-application")) {
        events.push({
          id: `app-${permit.id}`,
          type: "permit-application",
          date: parseISO(permit.applicationDate),
          title: `Applied: ${permit.number}`,
          status: permit.status,
          permit,
          priority: permit.priority
        })
      }

      // Approval date event
      if (permit.approvalDate && selectedEventTypes.includes("permit-approval")) {
        events.push({
          id: `approval-${permit.id}`,
          type: "permit-approval",
          date: parseISO(permit.approvalDate),
          title: `Approved: ${permit.number}`,
          status: permit.status,
          permit,
          priority: permit.priority
        })
      }

      // Expiration date event
      if (selectedEventTypes.includes("permit-expiration")) {
        const expirationDate = parseISO(permit.expirationDate)
        const daysUntilExpiration = differenceInDays(expirationDate, new Date())
        
        // Only show if within 60 days or already expired
        if (daysUntilExpiration <= 60) {
          events.push({
            id: `exp-${permit.id}`,
            type: "permit-expiration",
            date: expirationDate,
            title: `Expires: ${permit.number}`,
            status: permit.status,
            permit,
            priority: daysUntilExpiration <= 30 ? "high" : permit.priority
          })
        }
      }

      // Inspection events
      if (permit.inspections && selectedEventTypes.includes("inspection")) {
        permit.inspections.forEach(inspection => {
          const inspectionDate = inspection.scheduledDate ? 
            parseISO(inspection.scheduledDate) : 
            inspection.completedDate ? parseISO(inspection.completedDate) : null

          if (inspectionDate) {
            events.push({
              id: `insp-${inspection.id}`,
              type: "inspection",
              date: inspectionDate,
              title: `${inspection.type}: ${permit.number}`,
              status: inspection.result,
              permit,
              inspection,
              priority: inspection.result === "failed" ? "high" : permit.priority
            })
          }
        })
      }
    })

    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [permits, selectedEventTypes])

  // Get calendar days to display
  const calendarDays = useMemo(() => {
    if (view === "month") {
      const start = startOfWeek(startOfMonth(currentDate))
      const end = endOfWeek(endOfMonth(currentDate))
      return eachDayOfInterval({ start, end })
    } else {
      const start = startOfWeek(currentDate)
      const end = endOfWeek(currentDate)
      return eachDayOfInterval({ start, end })
    }
  }, [currentDate, view])

  // Get events for a specific date
  const getEventsForDate = useCallback((date: Date) => {
    return calendarEvents.filter(event => isSameDay(event.date, date))
  }, [calendarEvents])

  // Navigation handlers
  const navigatePrevious = useCallback(() => {
    setCurrentDate(prev => view === "month" ? subMonths(prev, 1) : new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000))
  }, [view])

  const navigateNext = useCallback(() => {
    setCurrentDate(prev => view === "month" ? addMonths(prev, 1) : new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000))
  }, [view])

  const goToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  // Event type filter handler
  const toggleEventType = useCallback((eventType: EventType) => {
    setSelectedEventTypes(prev => 
      prev.includes(eventType) 
        ? prev.filter(t => t !== eventType)
        : [...prev, eventType]
    )
  }, [])

  // Render calendar header
  const renderCalendarHeader = () => (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
        
        <h2 className="text-lg font-semibold">
          {view === "month" 
            ? format(currentDate, "MMMM yyyy")
            : `Week of ${format(startOfWeek(currentDate), "MMM dd, yyyy")}`
          }
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter Events
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              <h4 className="font-medium">Event Types</h4>
              {Object.entries(eventTypeIcons).map(([type, Icon]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm capitalize">
                      {type.replace("-", " ")}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedEventTypes.includes(type as EventType)}
                    onChange={() => toggleEventType(type as EventType)}
                    className="rounded"
                  />
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Select value={view} onValueChange={(value: CalendarView) => setView(value)}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
          </SelectContent>
        </Select>

        {canEdit && onCreatePermit && (
          <Button size="sm" onClick={onCreatePermit} className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Permit
          </Button>
        )}
      </div>
    </div>
  )

  // Render calendar grid
  const renderCalendarGrid = () => (
    <div className="flex-1 overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b bg-muted/50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {calendarDays.map(day => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isDayToday = isToday(day)
          const isSelected = selectedDate && isSameDay(day, selectedDate)

          return (
            <div
              key={day.toISOString()}
              className={`
                border-r border-b p-2 min-h-24 cursor-pointer transition-colors
                ${isCurrentMonth ? "bg-background" : "bg-muted/20"}
                ${isDayToday ? "bg-blue-50 dark:bg-blue-950" : ""}
                ${isSelected ? "bg-accent" : ""}
                hover:bg-accent/50
              `}
              onClick={() => setSelectedDate(day)}
            >
              <div className={`
                text-sm font-medium mb-1
                ${isCurrentMonth ? "text-foreground" : "text-muted-foreground"}
                ${isDayToday ? "text-blue-600 font-bold" : ""}
              `}>
                {format(day, "d")}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => {
                  const Icon = eventTypeIcons[event.type]
                  return (
                    <TooltipProvider key={event.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`
                              text-xs px-2 py-1 rounded border cursor-pointer
                              ${eventTypeColors[event.type]}
                              ${event.priority === "high" || event.priority === "urgent" || event.priority === "critical" ? "ring-1 ring-red-400" : ""}
                            `}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (event.type === "inspection" && event.inspection) {
                                // Handle inspection click
                                onViewPermit?.(event.permit)
                              } else {
                                onViewPermit?.(event.permit)
                              }
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <Icon className="h-3 w-3" />
                              <span className="truncate">{event.title}</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <div className="font-medium">{event.title}</div>
                            <div className="text-xs">
                              Type: {event.permit.type}
                            </div>
                            <div className="text-xs">
                              Authority: {event.permit.authority}
                            </div>
                            {event.inspection && (
                              <div className="text-xs">
                                Inspector: {event.inspection.inspector}
                              </div>
                            )}
                            <div className="text-xs">
                              Status: {event.status}
                            </div>
                            {event.priority && (
                              <div className="text-xs">
                                Priority: {event.priority}
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
                
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // Render event details sidebar
  const renderEventDetails = () => {
    if (!selectedDate) return null

    const dayEvents = getEventsForDate(selectedDate)

    return (
      <Card className="w-80 flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </CardTitle>
          <CardDescription>
            {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""} scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dayEvents.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No events scheduled</p>
              {canEdit && onCreatePermit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCreatePermit}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Permit
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {dayEvents.map(event => {
                const Icon = eventTypeIcons[event.type]
                return (
                  <div
                    key={event.id}
                    className={`
                      p-3 rounded-lg border
                      ${eventTypeColors[event.type]}
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-4 w-4" />
                          <span className="font-medium text-sm">{event.title}</span>
                        </div>
                        <div className="text-xs space-y-1">
                          <div>Type: {event.permit.type}</div>
                          <div>Authority: {event.permit.authority}</div>
                          {event.inspection && (
                            <>
                              <div>Inspector: {event.inspection.inspector}</div>
                              <div>Result: {event.inspection.result}</div>
                            </>
                          )}
                          <div>Status: {event.status}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewPermit?.(event.permit)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditPermit?.(event.permit)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <Card className="flex-1 flex flex-col">
        {renderCalendarHeader()}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            {renderCalendarGrid()}
          </div>
          {renderEventDetails()}
        </div>
      </Card>
    </div>
  )
} 