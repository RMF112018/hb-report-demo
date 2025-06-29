"use client";

import { useState } from "react";
import {
  Eye,
  Plus,
  Calendar,
  Clock,
  Users,
  Wrench,
  MapPin,
  Target,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  FileText,
  Save,
  Download,
  Edit,
  Trash2,
  Copy,
  Filter,
  Search,
  Settings,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  GanttChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Timeline,
} from "recharts";

interface LookAheadProps {
  userRole: string;
  projectData: any;
}

// Mock Frag Net Data
const fragNets = [
  {
    id: "FN001",
    name: "MEP Coordination Level 3",
    summary: "Detailed coordination activities for MEP systems on Level 3",
    parentActivity: "MEP Rough-in Level 3", 
    status: "active",
    startDate: "2024-07-01",
    endDate: "2024-07-18",
    progress: 45,
    location: "Level 3 - East Wing",
    crew: "MEP Coordination Team",
    priority: "high"
  },
  {
    id: "FN002", 
    name: "Exterior Facade Installation",
    summary: "Detailed sequence for curtain wall and glazing installation",
    parentActivity: "Building Envelope",
    status: "planning",
    startDate: "2024-08-15",
    endDate: "2024-09-30",
    progress: 0,
    location: "South Elevation",
    crew: "Facade Crew A",
    priority: "medium"
  },
  {
    id: "FN003",
    name: "Interior Finishes - Executive Floors",
    summary: "Detailed finish work for floors 15-17",
    parentActivity: "Interior Finishes",
    status: "completed",
    startDate: "2024-05-01",
    endDate: "2024-06-15",
    progress: 100,
    location: "Floors 15-17",
    crew: "Finish Crew B",
    priority: "high"
  }
];

// Mock Detailed Activities for Frag Net
const fragNetActivities = [
  {
    id: "FN001-A01",
    name: "MEP Layout Review",
    duration: 2,
    startDate: "2024-07-01",
    endDate: "2024-07-02",
    predecessors: [],
    resources: ["MEP Engineer", "Coordinator"],
    location: "Level 3 - Zone A",
    status: "completed",
    progress: 100
  },
  {
    id: "FN001-A02", 
    name: "Electrical Rough-in",
    duration: 5,
    startDate: "2024-07-03",
    endDate: "2024-07-09",
    predecessors: ["FN001-A01"],
    resources: ["Electrician Lead", "Electrician x2"],
    location: "Level 3 - Zone A", 
    status: "in-progress",
    progress: 80
  },
  {
    id: "FN001-A03",
    name: "Plumbing Rough-in",
    duration: 4,
    startDate: "2024-07-05",
    endDate: "2024-07-10",
    predecessors: ["FN001-A01"],
    resources: ["Plumber Lead", "Plumber"],
    location: "Level 3 - Zone A",
    status: "in-progress", 
    progress: 60
  },
  {
    id: "FN001-A04",
    name: "HVAC Ductwork",
    duration: 6,
    startDate: "2024-07-11",
    endDate: "2024-07-18",
    predecessors: ["FN001-A02", "FN001-A03"],
    resources: ["HVAC Tech Lead", "HVAC Tech x2"],
    location: "Level 3 - Zone A",
    status: "not-started",
    progress: 0
  }
];

// Mock Resource Allocation
const resourceAllocation = [
  {
    resource: "MEP Engineer",
    allocation: 40,
    availability: 100,
    currentAssignments: ["FN001", "FN004"],
    skillLevel: "Senior"
  },
  {
    resource: "Electrician Lead", 
    allocation: 85,
    availability: 90,
    currentAssignments: ["FN001", "FN002"],
    skillLevel: "Lead"
  },
  {
    resource: "Plumber Lead",
    allocation: 70,
    availability: 100, 
    currentAssignments: ["FN001"],
    skillLevel: "Lead"
  },
  {
    resource: "HVAC Tech Lead",
    allocation: 55,
    availability: 80,
    currentAssignments: ["FN001", "FN003"],
    skillLevel: "Senior"
  }
];

// Mock Look Ahead Metrics
const lookAheadMetrics = [
  { metric: "Active Frag Nets", value: 5, change: "+2", trend: "up" },
  { metric: "Planned Activities", value: 47, change: "+8", trend: "up" },
  { metric: "Resource Utilization", value: "78%", change: "+5%", trend: "up" },
  { metric: "On Schedule", value: "82%", change: "-3%", trend: "down" }
];

export default function LookAhead({ userRole, projectData }: LookAheadProps) {
  const [selectedFragNet, setSelectedFragNet] = useState(fragNets[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "in-progress": return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
      case "not-started": return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30";
      case "active": return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
      case "planning": return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
      default: return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? 
      <TrendingUp className="h-3 w-3 text-green-500" /> : 
      <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
  };

  const filteredFragNets = fragNets.filter(fragNet => {
    const matchesSearch = fragNet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fragNet.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || fragNet.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {lookAheadMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {getTrendIcon(metric.trend)}
                <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {metric.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Frag Net List */}
        <Card className="lg:col-span-1" data-tour="lookahead-frag-nets">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Frag Net Schedules
              </CardTitle>
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Frag Net</DialogTitle>
                    <DialogDescription>
                      Create a detailed fragment network schedule for focused execution tracking
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fragnet-name">Frag Net Name</Label>
                      <Input id="fragnet-name" placeholder="Enter frag net name" />
                    </div>
                    <div>
                      <Label htmlFor="parent-activity">Parent Activity</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent activity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mep-roughin">MEP Rough-in</SelectItem>
                          <SelectItem value="structural">Structural Work</SelectItem>
                          <SelectItem value="finishes">Interior Finishes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe the scope of work" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input id="start-date" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="end-date">End Date</Label>
                        <Input id="end-date" type="date" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowCreateModal(false)}>
                        Create Frag Net
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription>
              Fragment networks for detailed field execution
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="space-y-4 mb-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search frag nets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Frag Net List */}
            <div className="space-y-3">
              {filteredFragNets.map((fragNet) => (
                <div 
                  key={fragNet.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedFragNet.id === fragNet.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedFragNet(fragNet)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{fragNet.name}</h4>
                    <Badge className={getStatusColor(fragNet.status)}>
                      {fragNet.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{fragNet.summary}</p>
                  <div className="flex items-center justify-between text-xs">
                    <Badge className={getPriorityColor(fragNet.priority)}>
                      {fragNet.priority}
                    </Badge>
                    <span className="text-muted-foreground">{fragNet.progress}%</span>
                  </div>
                  <Progress value={fragNet.progress} className="h-1 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Frag Net Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  {selectedFragNet.name}
                </CardTitle>
                <CardDescription>{selectedFragNet.summary}</CardDescription>
              </div>
              <div className="flex gap-2" data-tour="lookahead-controls">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Clone
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activities" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="activities" className="space-y-4">
                {/* Frag Net Info */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-medium">
                      {calculateDuration(selectedFragNet.startDate, selectedFragNet.endDate)} days
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium">{selectedFragNet.location}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Crew</div>
                    <div className="font-medium">{selectedFragNet.crew}</div>
                  </div>
                </div>

                {/* Activities Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Resources</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fragNetActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{activity.name}</div>
                            <div className="text-xs text-muted-foreground">{activity.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{activity.duration} days</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(activity.startDate)}</div>
                            <div className="text-muted-foreground">{formatDate(activity.endDate)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {activity.resources.map((resource, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {resource}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(activity.status)}>
                            {activity.status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={activity.progress} className="w-16 h-2" />
                            <span className="text-sm">{activity.progress}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div className="space-y-4">
                  {resourceAllocation.map((resource, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{resource.resource}</h4>
                          <p className="text-sm text-muted-foreground">{resource.skillLevel}</p>
                        </div>
                        <Badge variant="outline">
                          {resource.allocation}% allocated
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Current Allocation</div>
                          <Progress value={resource.allocation} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Availability</div>
                          <Progress value={resource.availability} className="h-2" />
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Current Assignments</div>
                        <div className="flex gap-1">
                          {resource.currentAssignments.map((assignment, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {assignment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Interactive Gantt Chart</p>
                    <p className="text-sm text-muted-foreground">Timeline visualization would be rendered here</p>
                  </div>
                </div>
                
                {/* Timeline Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Critical Path</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">15 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Activities:</span>
                          <span className="font-medium">4</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Float:</span>
                          <span className="font-medium text-red-600">0 days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Progress Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Completed:</span>
                          <span className="font-medium text-green-600">2 activities</span>
                        </div>
                        <div className="flex justify-between">
                          <span>In Progress:</span>
                          <span className="font-medium text-blue-600">2 activities</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Not Started:</span>
                          <span className="font-medium text-gray-600">0 activities</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 