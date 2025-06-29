'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Save, X, ClipboardCheck } from 'lucide-react';
import { EstimatingProject } from '@/types/estimating-tracker';
import { PreConstructionResponsibilityMatrix } from '@/components/precon/PreConstructionResponsibilityMatrix';

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: EstimatingProject | null;
  onSave: (project: Partial<EstimatingProject>) => void;
  mode: 'create' | 'edit';
}

const PROJECT_SOURCES = [
  'CLIENT REQUEST',
  'RFQ', 
  'DESIGN/BUILD RFP',
  'HARD BID',
  'LUMP SUM PROPOSAL'
];

const DELIVERABLE_TYPES = [
  'CONCEPTUAL EST',
  'GMP',
  'LUMP SUM PROPOSAL', 
  'DESIGN BUILD',
  'DD ESTIMATE',
  'ROM',
  'SD ESTIMATE',
  'SCHEMATIC ESTIMATE',
  'GMP EST'
];

const PROJECT_STATUSES = [
  'ACTIVE',
  'ON HOLD',
  'PENDING', 
  'AWARDED',
  'NOT AWARDED',
  'CLOSED'
];

const CURRENT_STAGES = [
  'DD',
  'GMP',
  'CLOSED',
  'ON HOLD',
  '50% CD',
  'Schematic'
];

const TEAM_MEMBERS = [
  'SAM',
  'BILL', 
  'VITO',
  'HANK',
  'CLAUDIA',
  'RYAN',
  'HUNTER',
  'JAYDEN',
  'GARRET',
  'BOB',
  'JOE K.',
  'ART'
];

export default function ProjectForm({ open, onOpenChange, project, onSave, mode }: ProjectFormProps) {
  const [formData, setFormData] = useState<Partial<EstimatingProject>>({
    projectNumber: '',
    projectName: '',
    source: 'CLIENT REQUEST',
    deliverable: 'CONCEPTUAL EST',
    status: 'ACTIVE',
    leadEstimator: '',
    contributors: '',
    px: '',
    subBidsDue: '',
    presubmissionReview: '',
    winStrategyMeeting: '',
    dueDateOutTheDoor: '',
    estimatedValue: undefined,
    costPerGsf: undefined,
    costPerUnit: undefined,
    preconBudget: undefined,
    designBudget: undefined,
    billedToDate: undefined,
    currentStage: undefined,
    notes: '',
    checklist: {
      bidBond: false,
      ppBond: false,
      schedule: false,
      logistics: false,
      bimProposal: false,
      preconProposal: false,
      proposalTabs: false,
      coordinateWithMarketing: false
    }
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [showResponsibilityMatrix, setShowResponsibilityMatrix] = useState(false);

  // Reset form when dialog opens/closes or project changes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && project) {
        setFormData({
          ...project,
          // Ensure dates are formatted for input[type="date"]
          subBidsDue: project.subBidsDue ? project.subBidsDue.split('T')[0] : '',
          presubmissionReview: project.presubmissionReview ? project.presubmissionReview.split('T')[0] : '',
          winStrategyMeeting: project.winStrategyMeeting ? project.winStrategyMeeting.split('T')[0] : '',
          dueDateOutTheDoor: project.dueDateOutTheDoor ? project.dueDateOutTheDoor.split('T')[0] : '',
        });
      } else {
        // Reset to empty form for create mode
        setFormData({
          projectNumber: '',
          projectName: '',
          source: 'CLIENT REQUEST',
          deliverable: 'CONCEPTUAL EST',
          status: 'ACTIVE',
          leadEstimator: '',
          contributors: '',
          px: '',
          subBidsDue: '',
          presubmissionReview: '',
          winStrategyMeeting: '',
          dueDateOutTheDoor: '',
          estimatedValue: undefined,
          costPerGsf: undefined,
          costPerUnit: undefined,
          preconBudget: undefined,
          designBudget: undefined,
          billedToDate: undefined,
          currentStage: undefined,
          notes: '',
          checklist: {
            bidBond: false,
            ppBond: false,
            schedule: false,
            logistics: false,
            bimProposal: false,
            preconProposal: false,
            proposalTabs: false,
            coordinateWithMarketing: false
          }
        });
      }
      setActiveTab('basic');
    }
  }, [open, project, mode]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChecklistChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist!,
        [field]: checked
      }
    }));
  };

  const handleSave = () => {
    const projectData = {
      ...formData,
      // Convert dates back to ISO format
      subBidsDue: formData.subBidsDue ? new Date(formData.subBidsDue).toISOString() : undefined,
      presubmissionReview: formData.presubmissionReview ? new Date(formData.presubmissionReview).toISOString() : undefined,
      winStrategyMeeting: formData.winStrategyMeeting ? new Date(formData.winStrategyMeeting).toISOString() : undefined,
      dueDateOutTheDoor: formData.dueDateOutTheDoor ? new Date(formData.dueDateOutTheDoor).toISOString() : undefined,
      updatedAt: new Date().toISOString(),
      ...(mode === 'create' && {
        id: `${formData.projectNumber}-${Date.now()}`,
        createdAt: new Date().toISOString()
      })
    };

    onSave(projectData);
    onOpenChange(false);
  };

  const isFormValid = formData.projectNumber && formData.projectName && formData.leadEstimator;

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-5xl h-[90vh] flex flex-col z-[100]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            {mode === 'create' ? 'New Project Opportunity' : 'Edit Project'}
            {formData.projectNumber && (
              <span className="text-sm text-muted-foreground font-normal">
                - {formData.projectNumber}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="dates">Key Dates</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-6 space-y-6">
              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="projectNumber">Project Number *</Label>
                        <Input
                          id="projectNumber"
                          value={formData.projectNumber || ''}
                          onChange={(e) => handleInputChange('projectNumber', e.target.value)}
                          placeholder="e.g., 25-456-01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status || 'ACTIVE'} onValueChange={(value) => handleInputChange('status', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROJECT_STATUSES.map(status => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="projectName">Project Name *</Label>
                      <Input
                        id="projectName"
                        value={formData.projectName || ''}
                        onChange={(e) => handleInputChange('projectName', e.target.value)}
                        placeholder="Enter project name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="source">Source</Label>
                        <Select value={formData.source || 'CLIENT REQUEST'} onValueChange={(value) => handleInputChange('source', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROJECT_SOURCES.map(source => (
                              <SelectItem key={source} value={source}>{source}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="deliverable">Deliverable</Label>
                        <Select value={formData.deliverable || 'CONCEPTUAL EST'} onValueChange={(value) => handleInputChange('deliverable', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select deliverable" />
                          </SelectTrigger>
                          <SelectContent>
                            {DELIVERABLE_TYPES.map(deliverable => (
                              <SelectItem key={deliverable} value={deliverable}>{deliverable}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Team Assignment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="leadEstimator">Lead Estimator *</Label>
                        <Select value={formData.leadEstimator || 'select'} onValueChange={(value) => handleInputChange('leadEstimator', value === 'select' ? '' : value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select lead estimator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="select" disabled>Please select an estimator</SelectItem>
                            {TEAM_MEMBERS.map(member => (
                              <SelectItem key={member} value={member}>{member}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="contributors">Contributors</Label>
                        <Input
                          id="contributors"
                          value={formData.contributors || ''}
                          onChange={(e) => handleInputChange('contributors', e.target.value)}
                          placeholder="e.g., BILL/JAYDEN/CLAUDIA"
                        />
                      </div>
                      <div>
                        <Label htmlFor="px">Project Executive (PX)</Label>
                        <Select value={formData.px || 'none'} onValueChange={(value) => handleInputChange('px', value === 'none' ? '' : value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select PX" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {TEAM_MEMBERS.map(member => (
                              <SelectItem key={member} value={member}>{member}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {formData.status === 'ACTIVE' && (
                      <div>
                        <Label htmlFor="currentStage">Current Stage</Label>
                        <Select value={formData.currentStage || 'none'} onValueChange={(value) => handleInputChange('currentStage', value === 'none' ? '' : value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select current stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {CURRENT_STAGES.map(stage => (
                              <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Responsibility Matrix Access Card */}
                {(mode === 'edit' || (mode === 'create' && formData.projectNumber && formData.projectName)) && (
                  <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 dark:from-primary/10 dark:to-primary/5 dark:border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                        Pre-Construction Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Access the comprehensive responsibility matrix to manage project deliverables, deadlines, and team assignments.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowResponsibilityMatrix(true)}
                        className="bg-background hover:bg-muted border-primary/30 text-primary hover:text-primary/80"
                      >
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                        Open Responsibility Matrix
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Key Dates Tab */}
              <TabsContent value="dates" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Dates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subBidsDue">Sub Bids Due</Label>
                        <Input
                          id="subBidsDue"
                          type="date"
                          value={formData.subBidsDue || ''}
                          onChange={(e) => handleInputChange('subBidsDue', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="presubmissionReview">Presubmission Review</Label>
                        <Input
                          id="presubmissionReview"
                          type="date"
                          value={formData.presubmissionReview || ''}
                          onChange={(e) => handleInputChange('presubmissionReview', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="winStrategyMeeting">Win Strategy Meeting</Label>
                        <Input
                          id="winStrategyMeeting"
                          type="date"
                          value={formData.winStrategyMeeting || ''}
                          onChange={(e) => handleInputChange('winStrategyMeeting', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dueDateOutTheDoor">Due Date (Out the Door)</Label>
                        <Input
                          id="dueDateOutTheDoor"
                          type="date"
                          value={formData.dueDateOutTheDoor || ''}
                          onChange={(e) => handleInputChange('dueDateOutTheDoor', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Responsibility Matrix Access Card */}
                {(mode === 'edit' || (mode === 'create' && formData.projectNumber && formData.projectName)) && (
                  <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 dark:from-primary/10 dark:to-primary/5 dark:border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                        Timeline Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Manage project timelines, milestones, and key deliverable dates in the responsibility matrix.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowResponsibilityMatrix(true)}
                        className="bg-background hover:bg-muted border-primary/30 text-primary hover:text-primary/80"
                      >
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                        Open Responsibility Matrix
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Financial Tab */}
              <TabsContent value="financial" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="estimatedValue">Estimated Value ($)</Label>
                        <Input
                          id="estimatedValue"
                          type="number"
                          value={formData.estimatedValue || ''}
                          onChange={(e) => handleInputChange('estimatedValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="costPerGsf">Cost per GSF ($)</Label>
                        <Input
                          id="costPerGsf"
                          type="number"
                          step="0.01"
                          value={formData.costPerGsf || ''}
                          onChange={(e) => handleInputChange('costPerGsf', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="costPerUnit">Cost per Unit ($)</Label>
                        <Input
                          id="costPerUnit"
                          type="number"
                          step="0.01"
                          value={formData.costPerUnit || ''}
                          onChange={(e) => handleInputChange('costPerUnit', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    {(formData.status === 'ACTIVE' || formData.currentStage) && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="preconBudget">Precon Budget ($)</Label>
                          <Input
                            id="preconBudget"
                            type="number"
                            value={formData.preconBudget || ''}
                            onChange={(e) => handleInputChange('preconBudget', e.target.value ? parseFloat(e.target.value) : undefined)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="designBudget">Design Budget ($)</Label>
                          <Input
                            id="designBudget"
                            type="number"
                            value={formData.designBudget || ''}
                            onChange={(e) => handleInputChange('designBudget', e.target.value ? parseFloat(e.target.value) : undefined)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="billedToDate">Billed to Date ($)</Label>
                          <Input
                            id="billedToDate"
                            type="number"
                            value={formData.billedToDate || ''}
                            onChange={(e) => handleInputChange('billedToDate', e.target.value ? parseFloat(e.target.value) : undefined)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="notes">Project Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes || ''}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Enter any additional notes about this project..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Responsibility Matrix Access Card */}
                {(mode === 'edit' || (mode === 'create' && formData.projectNumber && formData.projectName)) && (
                  <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 dark:from-primary/10 dark:to-primary/5 dark:border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                        Financial Deliverables
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Track financial deliverables, budget approvals, and cost management responsibilities.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowResponsibilityMatrix(true)}
                        className="bg-background hover:bg-muted border-primary/30 text-primary hover:text-primary/80"
                      >
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                        Open Responsibility Matrix
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Checklist Tab */}
              <TabsContent value="checklist" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="bidBond"
                            checked={formData.checklist?.bidBond || false}
                            onCheckedChange={(checked) => handleChecklistChange('bidBond', checked as boolean)}
                          />
                          <Label htmlFor="bidBond">Bid Bond</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="ppBond"
                            checked={formData.checklist?.ppBond || false}
                            onCheckedChange={(checked) => handleChecklistChange('ppBond', checked as boolean)}
                          />
                          <Label htmlFor="ppBond">P&P Bond</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="schedule"
                            checked={formData.checklist?.schedule || false}
                            onCheckedChange={(checked) => handleChecklistChange('schedule', checked as boolean)}
                          />
                          <Label htmlFor="schedule">Schedule</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="logistics"
                            checked={formData.checklist?.logistics || false}
                            onCheckedChange={(checked) => handleChecklistChange('logistics', checked as boolean)}
                          />
                          <Label htmlFor="logistics">Logistics</Label>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="bimProposal"
                            checked={formData.checklist?.bimProposal || false}
                            onCheckedChange={(checked) => handleChecklistChange('bimProposal', checked as boolean)}
                          />
                          <Label htmlFor="bimProposal">BIM Proposal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="preconProposal"
                            checked={formData.checklist?.preconProposal || false}
                            onCheckedChange={(checked) => handleChecklistChange('preconProposal', checked as boolean)}
                          />
                          <Label htmlFor="preconProposal">Precon Proposal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="proposalTabs"
                            checked={formData.checklist?.proposalTabs || false}
                            onCheckedChange={(checked) => handleChecklistChange('proposalTabs', checked as boolean)}
                          />
                          <Label htmlFor="proposalTabs">Proposal Tabs</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="coordinateWithMarketing"
                            checked={formData.checklist?.coordinateWithMarketing || false}
                            onCheckedChange={(checked) => handleChecklistChange('coordinateWithMarketing', checked as boolean)}
                          />
                          <Label htmlFor="coordinateWithMarketing">Coordinate with Marketing</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Responsibility Matrix Access Card */}
                {(mode === 'edit' || (mode === 'create' && formData.projectNumber && formData.projectName)) && (
                  <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 dark:from-primary/10 dark:to-primary/5 dark:border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                        Deliverables Checklist
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Manage comprehensive project deliverables and responsibilities in the detailed matrix view.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowResponsibilityMatrix(true)}
                        className="bg-background hover:bg-muted border-primary/30 text-primary hover:text-primary/80"
                      >
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                        Open Responsibility Matrix
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </div>
          </div>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-between items-center gap-3 p-6 border-t bg-background flex-shrink-0">
          <div className="flex gap-3">
            {/* Empty space for left alignment */}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isFormValid}>
              <Save className="h-4 w-4 mr-2" />
              {mode === 'create' ? 'Create Project' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Pre-Construction Responsibility Matrix */}
    {showResponsibilityMatrix && (
      <div className="fixed inset-0 z-[150] bg-background">
        <PreConstructionResponsibilityMatrix
          project={{
            ...formData,
            id: formData.projectNumber || 'new-project',
            projectNumber: formData.projectNumber || '',
            projectName: formData.projectName || '',
          } as EstimatingProject}
          onClose={() => setShowResponsibilityMatrix(false)}
        />
      </div>
    )}
  </>
  );
} 