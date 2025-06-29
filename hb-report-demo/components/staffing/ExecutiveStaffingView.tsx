'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Building2,
  DollarSign,
  Calendar,
  UserCheck,
  UserX,
  Edit3,
  Eye
} from 'lucide-react'

// Import mock data
import staffingData from '@/data/mock/staffing/staffing.json'
import projectsData from '@/data/mock/projects.json'
import spcrData from '@/data/mock/staffing/spcr.json'

interface StaffMember {
  id: string
  name: string
  position: string
  laborRate: number
  billableRate: number
  experience: number
  strengths: string[]
  weaknesses: string[]
  assignments: Array<{
    project_id: number
    role: string
    startDate: string
    endDate: string
  }>
}

interface Project {
  project_id: number
  name: string
  project_stage_name: string
  active: boolean
}

export const ExecutiveStaffingView = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [showStaffModal, setShowStaffModal] = useState(false)

  useEffect(() => {
    setStaffMembers(staffingData as StaffMember[])
    setProjects(projectsData as Project[])
  }, [])

  // Get unique positions for filter
  const positions = useMemo(() => {
    const uniquePositions = [...new Set(staffMembers.map(staff => staff.position))]
    return uniquePositions.sort()
  }, [staffMembers])

  // Filter staff members
  const filteredStaff = useMemo(() => {
    return staffMembers.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           staff.position.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesPosition = positionFilter === 'all' || staff.position === positionFilter
      
      const matchesProject = projectFilter === 'all' || 
                            staff.assignments.some(assignment => 
                              assignment.project_id.toString() === projectFilter
                            )
      
      return matchesSearch && matchesPosition && matchesProject
    })
  }, [staffMembers, searchTerm, positionFilter, projectFilter])

  // Calculate staff analytics
  const staffAnalytics = useMemo(() => {
    const totalStaff = staffMembers.length
    const assignedStaff = staffMembers.filter(staff => staff.assignments.length > 0).length
    const unassignedStaff = totalStaff - assignedStaff
    const utilizationRate = totalStaff > 0 ? (assignedStaff / totalStaff) * 100 : 0
    
    const totalLaborCost = staffMembers.reduce((sum, staff) => sum + staff.laborRate, 0)
    const avgExperience = staffMembers.reduce((sum, staff) => sum + staff.experience, 0) / totalStaff
    
    const positionDistribution = staffMembers.reduce((acc, staff) => {
      acc[staff.position] = (acc[staff.position] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalStaff,
      assignedStaff,
      unassignedStaff,
      utilizationRate,
      totalLaborCost,
      avgExperience,
      positionDistribution
    }
  }, [staffMembers])

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.project_id === projectId)
    return project ? project.name : 'Unknown Project'
  }

  const getStaffStatusBadge = (staff: StaffMember) => {
    if (staff.assignments.length === 0) {
      return <Badge variant="secondary">Unassigned</Badge>
    }
    
    const activeAssignments = staff.assignments.filter(assignment => {
      const endDate = new Date(assignment.endDate)
      return endDate > new Date()
    })
    
    if (activeAssignments.length === 0) {
      return <Badge variant="outline">Available</Badge>
    }
    
    return <Badge variant="default">Assigned</Badge>
  }

  const handleReassignStaff = (staff: StaffMember) => {
    setSelectedStaff(staff)
    setShowStaffModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Staff Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Assigned: {staffAnalytics.assignedStaff}</span>
                <span>Available: {staffAnalytics.unassignedStaff}</span>
              </div>
              <Progress value={staffAnalytics.utilizationRate} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {staffAnalytics.utilizationRate.toFixed(1)}% utilization rate
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Labor Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Weekly Cost: ${(staffAnalytics.totalLaborCost * 40).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Avg Experience: {staffAnalytics.avgExperience.toFixed(1)} years</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Position Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.entries(staffAnalytics.positionDistribution)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([position, count]) => (
                  <div key={position} className="flex justify-between text-xs">
                    <span className="truncate">{position}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Staff Management
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Building2 className="h-4 w-4 mr-1" />
                Bulk Reassign
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                Analytics
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map(position => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.filter(p => p.active).map(project => (
                  <SelectItem key={project.project_id} value={project.project_id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Staff Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Current Assignment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Labor Rate</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {staff.strengths.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{staff.position}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{staff.experience} yrs</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {staff.assignments.length > 0 ? (
                        <div className="text-sm">
                          <div className="font-medium">
                            {getProjectName(staff.assignments[0].project_id)}
                          </div>
                          <div className="text-muted-foreground">
                            {staff.assignments[0].role}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStaffStatusBadge(staff)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>${staff.laborRate}/hr</div>
                        <div className="text-muted-foreground text-xs">
                          Bill: ${staff.billableRate}/hr
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReassignStaff(staff)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Staff Assignment Modal */}
      <Dialog open={showStaffModal} onOpenChange={setShowStaffModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reassign Staff Member</DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {selectedStaff.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedStaff.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedStaff.position}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">New Project</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.filter(p => p.active).map(project => (
                        <SelectItem key={project.project_id} value={project.project_id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Input placeholder="e.g., Project Manager" />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Input type="date" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowStaffModal(false)}>
                  Cancel
                </Button>
                <Button>
                  Assign
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 