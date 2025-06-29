"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, AlertTriangle, TrendingUp, Clock } from "lucide-react"

interface ProjectManagerInterfaceProps {
  projects?: any[]
  staffingData?: any[]
}

export function ProjectManagerInterface({ projects = [], staffingData = [] }: ProjectManagerInterfaceProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  // Mock data for demonstration
  const mockProjects = [
    {
      id: "1",
      name: "Downtown Office Complex",
      status: "Active",
      progress: 75,
      staffingLevel: 85,
      criticalRoles: ["Site Supervisor", "Safety Manager"],
      teamSize: 24,
      budget: "$2.5M",
      deadline: "2024-08-15",
    },
    {
      id: "2",
      name: "Residential Tower Phase 2",
      status: "Planning",
      progress: 30,
      staffingLevel: 60,
      criticalRoles: ["Project Engineer", "Quality Control"],
      teamSize: 18,
      budget: "$1.8M",
      deadline: "2024-10-30",
    },
  ]

  const mockTeamMembers = [
    {
      id: "1",
      name: "John Smith",
      role: "Site Supervisor",
      availability: "Available",
      skills: ["Leadership", "Safety", "Scheduling"],
      projects: 2,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Safety Manager",
      availability: "Assigned",
      skills: ["OSHA", "Risk Assessment", "Training"],
      projects: 1,
      rating: 4.9,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Manager Dashboard</h2>
          <p className="text-muted-foreground">Manage project staffing and resource allocation</p>
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Request Staff
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staffing Level</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Above target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Roles</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="resources">Resource Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4">
            {mockProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>
                        Team Size: {project.teamSize} | Budget: {project.budget}
                      </CardDescription>
                    </div>
                    <Badge variant={project.status === "Active" ? "default" : "secondary"}>{project.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Project Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Staffing Level</span>
                      <span>{project.staffingLevel}%</span>
                    </div>
                    <Progress value={project.staffingLevel} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Due: {project.deadline}</span>
                    </div>
                    <div className="flex space-x-2">
                      {project.criticalRoles.map((role) => (
                        <Badge key={role} variant="outline" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm">Manage Staff</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4">
            {mockTeamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`/placeholder-user.jpg`} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{member.name}</h3>
                        <Badge variant={member.availability === "Available" ? "default" : "secondary"}>
                          {member.availability}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Rating: {member.rating}/5</span>
                        <span className="text-sm">Projects: {member.projects}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      <Button size="sm">Assign</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Planning</CardTitle>
              <CardDescription>Plan and allocate resources across projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Resource planning interface coming soon...</p>
                <Button className="mt-4">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Resource Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
