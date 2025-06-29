"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, Clock, MapPin, Phone, Search, Filter } from "lucide-react"

interface OperationsStaffInterfaceProps {
  assignments?: any[]
  schedules?: any[]
}

export function OperationsStaffInterface({ assignments = [], schedules = [] }: OperationsStaffInterfaceProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock data for demonstration
  const mockAssignments = [
    {
      id: "1",
      projectName: "Downtown Office Complex",
      location: "123 Main St, Downtown",
      shift: "Day Shift (7:00 AM - 3:00 PM)",
      date: "2024-01-15",
      status: "Confirmed",
      supervisor: "Mike Johnson",
      contact: "(555) 123-4567",
      specialInstructions: "Safety briefing at 6:45 AM",
    },
    {
      id: "2",
      projectName: "Residential Tower Phase 2",
      location: "456 Oak Ave, Midtown",
      shift: "Night Shift (11:00 PM - 7:00 AM)",
      date: "2024-01-16",
      status: "Pending",
      supervisor: "Sarah Davis",
      contact: "(555) 987-6543",
      specialInstructions: "Bring hard hat and safety vest",
    },
  ]

  const mockSchedule = [
    {
      date: "2024-01-15",
      assignments: [
        { time: "07:00", project: "Downtown Office Complex", role: "General Labor" },
        { time: "15:30", project: "Site Cleanup", role: "Cleanup Crew" },
      ],
    },
    {
      date: "2024-01-16",
      assignments: [{ time: "23:00", project: "Residential Tower Phase 2", role: "Night Security" }],
    },
  ]

  const mockTimesheet = [
    {
      date: "2024-01-14",
      project: "Downtown Office Complex",
      hoursWorked: 8,
      overtime: 0,
      status: "Submitted",
    },
    {
      date: "2024-01-13",
      project: "Residential Tower Phase 2",
      hoursWorked: 8,
      overtime: 2,
      status: "Approved",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Operations Staff Portal</h2>
          <p className="text-muted-foreground">Manage your assignments and schedule</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Clock In/Out
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            View Schedule
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Assignments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 confirmed, 1 pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">8 hours remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Across different sites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assignments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assignments">Current Assignments</TabsTrigger>
          <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="timesheet">Timesheet</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {mockAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{assignment.projectName}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="mr-1 h-4 w-4" />
                        {assignment.location}
                      </CardDescription>
                    </div>
                    <Badge variant={assignment.status === "Confirmed" ? "default" : "secondary"}>
                      {assignment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{assignment.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{assignment.shift}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Supervisor: {assignment.supervisor}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{assignment.contact}</span>
                      </div>
                    </div>
                  </div>

                  {assignment.specialInstructions && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Special Instructions:</p>
                      <p className="text-sm text-muted-foreground">{assignment.specialInstructions}</p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm">Confirm Assignment</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid gap-4">
            {mockSchedule.map((day, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{day.date}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {day.assignments.map((assignment, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium">{assignment.time}</div>
                          <div>
                            <p className="font-medium">{assignment.project}</p>
                            <p className="text-sm text-muted-foreground">{assignment.role}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timesheet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timesheet Entries</CardTitle>
              <CardDescription>Track your work hours and overtime</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTimesheet.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{entry.project}</p>
                      <p className="text-sm text-muted-foreground">{entry.date}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm">
                        Regular: {entry.hoursWorked}h | Overtime: {entry.overtime}h
                      </p>
                      <Badge variant={entry.status === "Approved" ? "default" : "secondary"}>{entry.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">John Smith</h3>
                  <p className="text-muted-foreground">Operations Staff</p>
                  <p className="text-sm text-muted-foreground">Employee ID: EMP001</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value="john.smith@company.com" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input id="emergency" value="Jane Smith - (555) 987-6543" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills/Certifications</Label>
                  <Input id="skills" value="OSHA 10, Forklift Certified" />
                </div>
              </div>

              <Button>Update Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
