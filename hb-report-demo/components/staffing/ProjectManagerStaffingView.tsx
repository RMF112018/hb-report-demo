'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Search,
  MoreHorizontal,
  UserCheck,
  AlertTriangle,
  Calendar,
  FileText,
  Settings
} from 'lucide-react'

// Import mock data
import staffingData from '@/data/mock/staffing/staffing.json'
import projectsData from '@/data/mock/projects.json'
import spcrData from '@/data/mock/staffing/spcr.json'

interface ProjectManagerStaffingViewProps {
  userRole?: string
}

interface StaffMember {
  id: string
  name: string
  role: string
  project_id: number
  allocation: number
  start_date: string
  end_date: string
  cost_per_hour: number
  productivity_score: number
  status: string
}

export const ProjectManagerStaffingView = ({ userRole }: ProjectManagerStaffingViewProps) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Project Manager oversees Palm Beach Luxury Estate (project_id: 2525840)
  const projectId = 2525840
  const project = projectsData.find(p => p.project_id === projectId)

  useEffect(() => {
    // Filter staff for this specific project
    const projectStaff = staffingData.filter(staff => staff.project_id === projectId)
    setStaffMembers(projectStaff)
  }, [])

  const filteredStaff = useMemo(() => {
    if (!searchTerm) return staffMembers
    return staffMembers.filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [staffMembers, searchTerm])

  const teamAnalytics = useMemo(() => {
    const totalMembers = staffMembers.length
    const totalCost = staffMembers.reduce((sum, member) => 
      sum + (member.cost_per_hour * member.allocation * 40), 0) // Weekly cost
    const avgProductivity = staffMembers.length > 0 
      ? staffMembers.reduce((sum, member) => sum + member.productivity_score, 0) / staffMembers.length
      : 0
    const atRiskMembers = staffMembers.filter(member => member.productivity_score < 70).length

    return {
      totalMembers,
      totalCost,
      avgProductivity,
      atRiskMembers
    }
  }, [staffMembers])

  const getProductivityBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-500">Excellent</Badge>
    if (score >= 80) return <Badge className="bg-blue-500">Good</Badge>
    if (score >= 70) return <Badge variant="secondary">Average</Badge>
    return <Badge variant="destructive">Needs Attention</Badge>
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>
      case 'on-leave':
        return <Badge variant="outline">On Leave</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewDetails = (member: StaffMember) => {
    setSelectedMember(member)
    setShowDetailModal(true)
  }

  const pendingSpcrs = spcrData.filter(spcr => 
    spcr.project_id === projectId && spcr.status === 'pending'
  ).length

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {project?.name || 'Project Overview'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{teamAnalytics.totalMembers}</div>
              <div className="text-xs text-blue-600">Team Members</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">{teamAnalytics.avgProductivity.toFixed(0)}%</div>
              <div className="text-xs text-green-600">Avg Productivity</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-xl font-bold text-yellow-600">${teamAnalytics.totalCost.toLocaleString()}</div>
              <div className="text-xs text-yellow-600">Weekly Cost</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-xl font-bold text-red-600">{teamAnalytics.atRiskMembers}</div>
              <div className="text-xs text-red-600">At Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline">
              <Users className="h-4 w-4 mr-1" />
              Request Staff
            </Button>
            <Button size="sm" variant="outline">
              <Calendar className="h-4 w-4 mr-1" />
              Schedule Review
            </Button>
            <Button size="sm" variant="outline">
              <TrendingUp className="h-4 w-4 mr-1" />
              Performance Report
            </Button>
            {pendingSpcrs > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {pendingSpcrs} Pending SPCRs
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Team Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Management
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((member) => (
                <div key={member.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{member.name}</div>
                      {getStatusBadge(member.status)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(member)}>
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span className="font-medium text-foreground">{member.role}</span>
                    <span>{member.allocation}% allocation</span>
                    <span>${member.cost_per_hour}/hr</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getProductivityBadge(member.productivity_score)}
                      <span className="text-sm text-muted-foreground">
                        Productivity: {member.productivity_score}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(member.start_date).toLocaleDateString()} - {new Date(member.end_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div className="text-sm">No team members found</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Staff Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Staff Member Details</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg">{selectedMember.name}</span>
                {getStatusBadge(selectedMember.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <div className="text-sm font-medium">{selectedMember.role}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Allocation</label>
                  <div className="text-sm">{selectedMember.allocation}%</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cost per Hour</label>
                  <div className="text-sm">${selectedMember.cost_per_hour}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Productivity</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{selectedMember.productivity_score}%</span>
                    {getProductivityBadge(selectedMember.productivity_score)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                  <div className="text-sm">{new Date(selectedMember.start_date).toLocaleDateString()}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">End Date</label>
                  <div className="text-sm">{new Date(selectedMember.end_date).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <UserCheck className="h-4 w-4 mr-1" />
                  Assign Task
                </Button>
                <Button size="sm" variant="outline">
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule Meeting
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
