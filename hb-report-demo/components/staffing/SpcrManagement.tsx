'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter,
  Eye,
  Edit3,
  Calendar,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Building
} from 'lucide-react'

// Import mock data
import spcrData from '@/data/mock/staffing/spcr.json'
import projectsData from '@/data/mock/projects.json'

interface SpcrManagementProps {
  userRole: string
}

interface SpcrComment {
  id: string
  author: string
  role: string
  comment: string
  action: 'approved' | 'rejected' | 'forwarded' | 'revised'
  timestamp: string
}

interface Spcr {
  id: string
  project_id: number
  type: string
  position: string
  startDate: string
  endDate: string
  schedule_activity: string
  scheduleRef: string
  budget: number
  explanation: string
  status: string
  workflowStage: 'submitted' | 'pe-review' | 'pe-approved' | 'pe-rejected' | 'executive-review' | 'final-approved' | 'final-rejected' | 'withdrawn'
  createdBy: string
  createdAt: string
  updatedAt: string
  comments?: SpcrComment[]
}

export const SpcrManagement = ({ userRole }: SpcrManagementProps) => {
  const [spcrs, setSpcrs] = useState<Spcr[]>([])
  const [filteredSpcrs, setFilteredSpcrs] = useState<Spcr[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedSpcr, setSelectedSpcr] = useState<Spcr | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'forward'>('approve')
  const [actionComment, setActionComment] = useState('')

  useEffect(() => {
    // Filter SPCRs based on user role and add workflow stages
    let filteredData = spcrData.map(spcr => ({
      ...spcr,
      workflowStage: getWorkflowStage(spcr.status, spcr.createdBy),
      comments: []
    })) as Spcr[]
    
    if (userRole === 'project-manager') {
      // PM only sees SPCRs for their project (Palm Beach Luxury Estate - 2525840)
      filteredData = filteredData.filter(spcr => spcr.project_id === 2525840)
    } else if (userRole === 'project-executive') {
      // PE sees SPCRs for their portfolio (6 projects) - only those needing PE review or that they've acted on
      const portfolioProjects = [2525840, 2525841, 2525842, 2525843, 2525844, 2525845]
      filteredData = filteredData.filter(spcr => 
        portfolioProjects.includes(spcr.project_id) && 
        ['pe-review', 'pe-approved', 'pe-rejected', 'executive-review', 'final-approved', 'final-rejected'].includes(spcr.workflowStage)
      )
    }
    // Executive sees all SPCRs that have been approved by PE

    setSpcrs(filteredData)
    setFilteredSpcrs(filteredData)
  }, [userRole])

  // Convert old status to workflow stage
  const getWorkflowStage = (status: string, createdBy: string): 'submitted' | 'pe-review' | 'pe-approved' | 'pe-rejected' | 'executive-review' | 'final-approved' | 'final-rejected' => {
    if (status === 'pending') return 'pe-review'
    if (status === 'approved') return 'final-approved'
    if (status === 'rejected') return 'pe-rejected'
    return 'submitted'
  }

  useEffect(() => {
    // Apply status filter
    if (statusFilter === 'all') {
      setFilteredSpcrs(spcrs)
    } else {
      setFilteredSpcrs(spcrs.filter(spcr => spcr.workflowStage === statusFilter))
    }
  }, [statusFilter, spcrs])

  const spcrCounts = useMemo(() => {
    return {
      total: spcrs.length,
      pending: spcrs.filter(s => ['submitted', 'pe-review'].includes(s.workflowStage)).length,
      approved: spcrs.filter(s => s.workflowStage === 'final-approved').length,
      rejected: spcrs.filter(s => ['pe-rejected', 'final-rejected'].includes(s.workflowStage)).length,
      needsAction: spcrs.filter(s => 
        (userRole === 'project-executive' && s.workflowStage === 'pe-review') ||
        (userRole === 'executive' && s.workflowStage === 'executive-review')
      ).length
    }
  }, [spcrs, userRole])

  const getProjectName = (projectId: number) => {
    const project = projectsData.find(p => p.project_id === projectId)
    return project ? project.name : 'Unknown Project'
  }

  const getWorkflowBadge = (stage: string) => {
    switch (stage) {
      case 'submitted':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          Submitted
        </Badge>
      case 'pe-review':
        return <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-700">
          <Clock className="h-3 w-3" />
          PE Review
        </Badge>
      case 'pe-approved':
        return <Badge variant="default" className="bg-green-500 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          PE Approved
        </Badge>
      case 'pe-rejected':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          PE Rejected
        </Badge>
      case 'executive-review':
        return <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-700">
          <Building className="h-3 w-3" />
          Executive Review
        </Badge>
      case 'final-approved':
        return <Badge variant="default" className="bg-green-600 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Final Approved
        </Badge>
      case 'final-rejected':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Final Rejected
        </Badge>
      case 'withdrawn':
        return <Badge variant="outline" className="flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          Withdrawn
        </Badge>
      default:
        return <Badge variant="outline">{stage}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    return type === 'increase' 
      ? <Badge variant="default" className="bg-blue-500">Add Staff</Badge>
      : <Badge variant="outline">Remove Staff</Badge>
  }

  const handleViewDetails = (spcr: Spcr) => {
    setSelectedSpcr(spcr)
    setShowDetailModal(true)
  }

  const handleAction = (spcr: Spcr, action: 'approve' | 'reject' | 'forward') => {
    setSelectedSpcr(spcr)
    setActionType(action)
    setActionComment('')
    setShowActionModal(true)
  }

  const submitAction = () => {
    if (!selectedSpcr) return

    const timestamp = new Date().toISOString()
    const newComment: SpcrComment = {
      id: `comment-${Date.now()}`,
      author: getCurrentUserName(),
      role: userRole,
      comment: actionComment,
      action: actionType === 'forward' ? 'approved' : actionType,
      timestamp
    }

    let newWorkflowStage: Spcr['workflowStage']
    
    if (userRole === 'project-executive') {
      newWorkflowStage = actionType === 'approve' ? 'executive-review' : 'pe-rejected'
    } else if (userRole === 'executive') {
      newWorkflowStage = actionType === 'approve' ? 'final-approved' : 'final-rejected'
    } else {
      newWorkflowStage = selectedSpcr.workflowStage
    }

    setSpcrs(prev => prev.map(spcr => 
      spcr.id === selectedSpcr.id ? { 
        ...spcr, 
        workflowStage: newWorkflowStage,
        updatedAt: timestamp,
        comments: [...(spcr.comments || []), newComment]
      } : spcr
    ))

    setShowActionModal(false)
    setShowDetailModal(false)
  }

  const getCurrentUserName = () => {
    switch (userRole) {
      case 'project-manager': return 'Mike Davis'
      case 'project-executive': return 'Sarah Johnson'
      case 'executive': return 'Robert Smith'
      default: return 'System User'
    }
  }

  const canApprove = (spcr: Spcr) => {
    if (userRole === 'executive' && spcr.workflowStage === 'executive-review') return true
    if (userRole === 'project-executive' && spcr.workflowStage === 'pe-review') return true
    return false
  }

  const getTitle = () => {
    switch (userRole) {
      case 'executive':
        return 'Executive SPCR Approval'
      case 'project-executive':
        return 'Portfolio SPCR Review'
      case 'project-manager':
        return 'Project SPCRs'
      default:
        return 'SPCR Management'
    }
  }

  const getFilterOptions = () => {
    const baseOptions = [
      { value: 'all', label: 'All Status' }
    ]

    if (userRole === 'project-manager') {
      return [
        ...baseOptions,
        { value: 'submitted', label: 'Submitted' },
        { value: 'pe-review', label: 'PE Review' },
        { value: 'pe-approved', label: 'PE Approved' },
        { value: 'pe-rejected', label: 'PE Rejected' },
        { value: 'executive-review', label: 'Executive Review' },
        { value: 'final-approved', label: 'Final Approved' },
        { value: 'final-rejected', label: 'Final Rejected' }
      ]
    } else if (userRole === 'project-executive') {
      return [
        ...baseOptions,
        { value: 'pe-review', label: 'Awaiting Review' },
        { value: 'pe-approved', label: 'Approved by Me' },
        { value: 'pe-rejected', label: 'Rejected by Me' },
        { value: 'executive-review', label: 'Executive Review' },
        { value: 'final-approved', label: 'Final Approved' },
        { value: 'final-rejected', label: 'Final Rejected' }
      ]
    } else {
      return [
        ...baseOptions,
        { value: 'executive-review', label: 'Awaiting Review' },
        { value: 'final-approved', label: 'Approved' },
        { value: 'final-rejected', label: 'Rejected' }
      ]
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {getTitle()}
          </CardTitle>
          {userRole === 'project-manager' && (
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Create SPCR
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{spcrCounts.pending}</div>
            <div className="text-xs text-blue-600">In Progress</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">{spcrCounts.approved}</div>
            <div className="text-xs text-green-600">Approved</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-xl font-bold text-red-600">{spcrCounts.rejected}</div>
            <div className="text-xs text-red-600">Rejected</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-xl font-bold text-yellow-600">{spcrCounts.needsAction}</div>
            <div className="text-xs text-yellow-600">Needs Action</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getFilterOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SPCR List */}
        <div className="space-y-3">
          {filteredSpcrs.length > 0 ? (
            filteredSpcrs.slice(0, 8).map((spcr) => (
              <div key={spcr.id} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">SPCR-{spcr.id.split('-')[1]}</span>
                    {getWorkflowBadge(spcr.workflowStage)}
                    {spcr.comments && spcr.comments.length > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {spcr.comments.length}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(spcr)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    {canApprove(spcr) && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAction(spcr, 'approve')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAction(spcr, 'reject')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-1">
                  {getProjectName(spcr.project_id)}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  {getTypeBadge(spcr.type)}
                  <span className="text-sm font-medium">{spcr.position}</span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {spcr.explanation.slice(0, 60)}...
                </div>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    ${spcr.budget.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(spcr.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">No SPCRs found</div>
              {userRole === 'project-manager' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create First SPCR
                </Button>
              )}
            </div>
          )}
        </div>

        {filteredSpcrs.length > 8 && (
          <div className="mt-3 text-center">
            <Button variant="outline" size="sm">
              View All ({filteredSpcrs.length})
            </Button>
          </div>
        )}
      </CardContent>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>SPCR Details</DialogTitle>
          </DialogHeader>
          {selectedSpcr && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">SPCR-{selectedSpcr.id.split('-')[1]}</span>
                {getWorkflowBadge(selectedSpcr.workflowStage)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Project</label>
                  <div className="text-sm">{getProjectName(selectedSpcr.project_id)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div className="text-sm">{selectedSpcr.type === 'increase' ? 'Add Staff' : 'Remove Staff'}</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Position</label>
                <div className="text-sm font-medium">{selectedSpcr.position}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                  <div className="text-sm">{new Date(selectedSpcr.startDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">End Date</label>
                  <div className="text-sm">{new Date(selectedSpcr.endDate).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Schedule Reference</label>
                <div className="text-sm">{selectedSpcr.scheduleRef}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Budget Impact</label>
                <div className="text-lg font-bold">${selectedSpcr.budget.toLocaleString()}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Justification</label>
                <div className="text-sm">{selectedSpcr.explanation}</div>
              </div>

              {/* Workflow History / Comments */}
              {selectedSpcr.comments && selectedSpcr.comments.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Workflow History</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedSpcr.comments.map((comment) => (
                      <div key={comment.id} className="border rounded p-2 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={comment.action === 'approved' ? 'default' : 'destructive'} className="text-xs">
                            {comment.action}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{comment.role}</span>
                        </div>
                        <div className="text-muted-foreground">{comment.comment}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <span>Created: {new Date(selectedSpcr.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span>Updated: {new Date(selectedSpcr.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              {canApprove(selectedSpcr) && (
                <div className="flex gap-2">
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleAction(selectedSpcr, 'approve')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {userRole === 'project-executive' ? 'Approve & Forward' : 'Final Approve'}
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleAction(selectedSpcr, 'reject')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Modal (Approve/Reject with Comments) */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' 
                ? (userRole === 'project-executive' ? 'Approve & Forward to Executive' : 'Final Approval')
                : 'Reject SPCR'
              }
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {actionType === 'approve' ? 'Approval Comments' : 'Rejection Reason'}
              </label>
              <Textarea
                placeholder={actionType === 'approve' 
                  ? "Add any comments for the approval..."
                  : "Please provide a reason for rejection..."
                }
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowActionModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={submitAction}
                className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {actionType === 'approve' 
                  ? (userRole === 'project-executive' ? 'Approve & Forward' : 'Final Approve')
                  : 'Reject'
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create SPCR Modal - Enhanced for workflow */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Staffing Plan Change Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Request Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">Add Staff</SelectItem>
                    <SelectItem value="decrease">Remove Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Position</label>
                <Input placeholder="e.g., Project Manager" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input type="date" />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input type="date" />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Schedule Activity</label>
              <Input placeholder="e.g., Foundation Work - Task 152" />
            </div>
            
            <div>
              <label className="text-sm font-medium">Budget Impact</label>
              <Input type="number" placeholder="0.00" />
            </div>
            
            <div>
              <label className="text-sm font-medium">Justification</label>
              <Textarea placeholder="Explain the reason for this staffing change request..." rows={3} />
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-1">Workflow Information</div>
              <div className="text-xs text-blue-600">
                Your request will be sent to the Project Executive for review. If approved, it will be forwarded to Executive level for final approval.
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button>
                Submit for Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
} 