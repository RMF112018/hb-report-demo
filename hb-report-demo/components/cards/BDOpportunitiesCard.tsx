"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, Star, MapPin, Clock, TrendingUp, Building2, ChevronRight } from "lucide-react"
import type { DashboardCard } from "@/types/dashboard"
import { useState } from "react"

interface BDOpportunitiesCardProps {
  card: DashboardCard
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

interface BDEvent {
  id: string
  name: string
  date: string
  location: string
  type: 'Golf' | 'Networking' | 'Dinner' | 'Polo' | 'Conference' | 'Awards'
  totalSeats: number
  availableSeats: number
  priority: 'High' | 'Medium' | 'Low'
  potentialValue: number
  attendees: string[]
  description: string
}

export function BDOpportunitiesCard({ card, config, span, isCompact, userRole }: BDOpportunitiesCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getRoleBasedData = () => {
    const role = userRole || 'project-executive'
    
    const baseEvents: BDEvent[] = [
      {
        id: 'bd-1',
        name: 'Austin Builders Golf Outing',
        date: '2025-01-15',
        location: 'Austin Country Club',
        type: 'Golf',
        totalSeats: 4,
        availableSeats: 2,
        priority: 'High',
        potentialValue: 2500000,
        attendees: ['John Smith', 'Mike Davis'],
        description: 'Annual golf tournament with major Austin developers and GCs'
      },
      {
        id: 'bd-2',
        name: 'AGC Austin Chapter Dinner',
        date: '2025-01-22',
        location: 'Four Seasons Austin',
        type: 'Dinner',
        totalSeats: 8,
        availableSeats: 3,
        priority: 'High',
        potentialValue: 5000000,
        attendees: ['Sarah Johnson', 'Tom Wilson', 'Alex Chen', 'Maria Rodriguez', 'David Kim'],
        description: 'Quarterly AGC dinner with industry leaders and potential clients'
      },
      {
        id: 'bd-3',
        name: 'Houston Polo Match',
        date: '2025-01-28',
        location: 'Houston Polo Club',
        type: 'Polo',
        totalSeats: 6,
        availableSeats: 1,
        priority: 'Medium',
        potentialValue: 3200000,
        attendees: ['Robert Lee', 'Jennifer Liu', 'Mark Brown', 'Lisa Wang', 'Chris Taylor'],
        description: 'Exclusive polo event with high-net-worth clients and investors'
      },
      {
        id: 'bd-4',
        name: 'Texas Construction Awards',
        date: '2025-02-05',
        location: 'Austin Convention Center',
        type: 'Awards',
        totalSeats: 10,
        availableSeats: 4,
        priority: 'High',
        potentialValue: 8000000,
        attendees: ['Emily Foster', 'James Parker', 'Susan Davis', 'Michael Chang', 'Amanda White', 'Kevin Johnson'],
        description: 'Annual awards ceremony recognizing excellence in Texas construction'
      },
      {
        id: 'bd-5',
        name: 'Dallas Networking Mixer',
        date: '2025-02-12',
        location: 'The Joule Hotel',
        type: 'Networking',
        totalSeats: 5,
        availableSeats: 2,
        priority: 'Medium',
        potentialValue: 1800000,
        attendees: ['Ryan Mitchell', 'Nicole Garcia', 'Brandon Lee'],
        description: 'Monthly networking event for Dallas-area construction professionals'
      },
      {
        id: 'bd-6',
        name: 'Commercial Real Estate Conference',
        date: '2025-02-18',
        location: 'Dallas Convention Center',
        type: 'Conference',
        totalSeats: 12,
        availableSeats: 5,
        priority: 'High',
        potentialValue: 12000000,
        attendees: ['Daniel Torres', 'Rachel Adams', 'Andrew Kim', 'Stephanie Young', 'Jason Lee', 'Michelle Chen', 'Tyler Davis'],
        description: 'Premier commercial real estate conference with developers and investors'
      }
    ]

    // Sort events by date
    return baseEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const events = getRoleBasedData()
  const totalSeats = events.reduce((sum, event) => sum + event.totalSeats, 0)
  const totalAvailable = events.reduce((sum, event) => sum + event.availableSeats, 0)
  const utilizationRate = ((totalSeats - totalAvailable) / totalSeats) * 100
  const totalPotentialValue = events.reduce((sum, event) => sum + event.potentialValue, 0)
  const highPriorityEvents = events.filter(event => event.priority === 'High')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Golf': return '⛳'
      case 'Polo': return '🏇'
      case 'Dinner': return '🍽️'
      case 'Networking': return '🤝'
      case 'Conference': return '🏢'
      case 'Awards': return '🏆'
      default: return '📅'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800 dark:border-red-800'
      case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 dark:border-yellow-800'
      case 'Low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800 dark:border-green-800'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <div 
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800 dark:border-blue-800 hover:shadow-xl transition-all duration-300 h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              {card.title}
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:border-blue-800">
              {totalAvailable} Available
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 lg:gap-2">
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100">
              <div className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-blue-600 dark:text-blue-400 dark:text-blue-400">{events.length}</div>
              <div className="text-xs text-muted-foreground">Upcoming Events</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 dark:text-blue-400">{highPriorityEvents.length} high priority</div>
            </div>
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100">
              <div className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-blue-600 dark:text-blue-400 dark:text-blue-400">{utilizationRate.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Seat Utilization</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 dark:text-blue-400">{totalAvailable} of {totalSeats} available</div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-card/60 dark:bg-card/40 rounded-lg border border-blue-100 dark:border-blue-800 p-1.5 sm:p-2 lg:p-2.5">
            <h4 className="font-semibold mb-2 text-foreground">Next 3 Events</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {events.slice(0, 3).map((event) => (
                <div key={event.id} className="flex justify-between items-center p-2 rounded bg-card/40 dark:bg-card/20 border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getEventIcon(event.type)}</span>
                    <div>
                      <div className="text-sm font-medium text-foreground">{event.name}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(event.date)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 dark:text-blue-400">
                      {event.availableSeats}/{event.totalSeats}
                    </div>
                    <Badge className={`text-xs ${getPriorityColor(event.priority)}`}>
                      {event.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Value */}
          <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 p-1.5 sm:p-2 lg:p-2.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Pipeline Value</span>
              <div className="text-right">
                <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-blue-600 dark:text-blue-400">{formatCurrency(totalPotentialValue)}</div>
                <div className="text-xs text-muted-foreground">Total opportunity</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-lg shadow-2xl z-10 overflow-auto">
          <div className="p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-200 dark:border-blue-800 pb-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                BD Opportunities Dashboard
              </h3>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:border-blue-800">
                {formatCurrency(totalPotentialValue)} Pipeline
              </Badge>
            </div>

            {/* All Events */}
            <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 p-1.5 sm:p-2 lg:p-2.5">
              <h4 className="font-semibold mb-2 text-foreground">All Upcoming Events</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {events.map((event) => (
                  <div key={event.id} className="p-1.5 sm:p-2 lg:p-2.5 rounded bg-white/40 dark:bg-black/40 border border-blue-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getEventIcon(event.type)}</span>
                        <div>
                          <div className="text-sm font-medium text-foreground">{event.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {formatDate(event.date)}
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-xs ${getPriorityColor(event.priority)}`}>
                          {event.priority}
                        </Badge>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          {formatCurrency(event.potentialValue)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-2">{event.description}</div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {event.totalSeats - event.availableSeats} attending, {event.availableSeats} available
                        </span>
                      </div>
                      <Progress 
                        value={((event.totalSeats - event.availableSeats) / event.totalSeats) * 100} 
                        className="w-16 h-2"
                      />
                    </div>
                    
                    {event.attendees.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium">Attendees:</span> {event.attendees.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 p-2 text-center">
                <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-blue-600 dark:text-blue-400">{highPriorityEvents.length}</div>
                <div className="text-xs text-muted-foreground">High Priority</div>
              </div>
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 p-2 text-center">
                <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-blue-600 dark:text-blue-400">{utilizationRate.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Utilization</div>
              </div>
              <div className="bg-white/60 dark:bg-black/60 rounded-lg border border-blue-100 p-2 text-center">
                <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-blue-600 dark:text-blue-400">{events.filter(e => new Date(e.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}</div>
                <div className="text-xs text-muted-foreground">This Week</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 