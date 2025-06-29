'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Filter, 
  Download, 
  Search, 
  Calendar, 
  DollarSign, 
  User, 
  Building2,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { EstimatingProject, EstimatingTrackingSummary, EstimatingFilters } from '@/types/estimating-tracker';
import ProjectForm from './ProjectForm';

// Mock data import - in real app this would come from API
import estimatingData from '@/data/mock/estimating/estimating-tracking.json';

interface EstimatingTrackerProps {
  className?: string;
  onCreateProject?: () => void;
  showNewOpportunityForm?: boolean;
  onNewOpportunityFormChange?: (show: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-blue-500/10 text-blue-600 border-blue-200';
    case 'AWARDED':
      return 'bg-green-500/10 text-green-600 border-green-200';
    case 'NOT AWARDED':
      return 'bg-red-500/10 text-red-600 border-red-200';
    case 'PENDING':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
    case 'ON HOLD':
      return 'bg-gray-500/10 text-gray-600 border-gray-200';
    case 'CLOSED':
      return 'bg-gray-500/10 text-gray-600 border-gray-200';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-200';
  }
};

const getDeliverableColor = (deliverable: string) => {
  switch (deliverable) {
    case 'GMP':
      return 'bg-purple-500/10 text-purple-600 border-purple-200';
    case 'CONCEPTUAL EST':
      return 'bg-blue-500/10 text-blue-600 border-blue-200';
    case 'LUMP SUM PROPOSAL':
      return 'bg-green-500/10 text-green-600 border-green-200';
    case 'DESIGN BUILD':
      return 'bg-orange-500/10 text-orange-600 border-orange-200';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-200';
  }
};

const formatCurrency = (amount: number | undefined) => {
  if (!amount) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const ChecklistIndicator = ({ checklist }: { checklist: any }) => {
  const completed = Object.values(checklist).filter(Boolean).length;
  const total = Object.keys(checklist).length;
  const percentage = (completed / total) * 100;

  return (
    <div className="flex items-center gap-2">
      <Progress value={percentage} className="w-16 h-2" />
      <span className="text-xs text-muted-foreground">{completed}/{total}</span>
    </div>
  );
};

export default function EstimatingTracker({ className, onCreateProject, showNewOpportunityForm, onNewOpportunityFormChange }: EstimatingTrackerProps) {
  const [activeTab, setActiveTab] = useState('pursuits');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<EstimatingFilters>({});

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingProject, setEditingProject] = useState<EstimatingProject | null>(null);

  // Calculate summary statistics
  const summary = useMemo((): EstimatingTrackingSummary => {
    const allProjects = [
      ...estimatingData.currentPursuits,
      ...estimatingData.currentPreconstruction,
      ...estimatingData.estimateTrackingLog
    ];

    const totalValue = allProjects.reduce((sum, p) => sum + (p.estimatedValue || 0), 0);
    const awardedProjects = allProjects.filter(p => p.outcome === 'AWARDED W/ PRECON' || p.outcome === 'AWARDED W/O PRECON');
    const awardedValue = awardedProjects.reduce((sum, p) => sum + (p.estimatedValue || 0), 0);
    const notAwardedValue = allProjects.filter(p => p.outcome === 'NOT AWARDED').reduce((sum, p) => sum + (p.estimatedValue || 0), 0);
    const pendingValue = allProjects.filter(p => p.status === 'PENDING' || p.status === 'ACTIVE').reduce((sum, p) => sum + (p.estimatedValue || 0), 0);

    return {
      totalProjects: allProjects.length,
      activeProjects: allProjects.filter(p => p.status === 'ACTIVE').length,
      totalValue,
      awardedValue,
      pendingValue,
      notAwardedValue,
      winRate: awardedProjects.length > 0 ? (awardedProjects.length / (awardedProjects.length + allProjects.filter(p => p.outcome === 'NOT AWARDED').length)) * 100 : 0,
      avgProjectValue: allProjects.length > 0 ? totalValue / allProjects.length : 0
    };
  }, []);

  const filteredCurrentPursuits = useMemo(() => {
    return estimatingData.currentPursuits.filter(project => {
      const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.leadEstimator.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filters.status?.length || filters.status.includes(project.status);
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filters]);

  const filteredPreconstruction = useMemo(() => {
    return estimatingData.currentPreconstruction.filter(project => {
      const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.leadEstimator.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [searchTerm]);

  const filteredTrackingLog = useMemo(() => {
    return estimatingData.estimateTrackingLog.filter(project => {
      const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.leadEstimator.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [searchTerm]);

  // Handle creating a new project
  const handleCreateProject = useCallback(() => {
    setFormMode('create');
    setEditingProject(null);
    setShowProjectForm(true);
  }, []);

  // Handle editing an existing project
  const handleEditProject = (project: EstimatingProject) => {
    setFormMode('edit');
    setEditingProject(project);
    setShowProjectForm(true);
  };

  // Handle saving a project (create or update)
  const handleSaveProject = (projectData: Partial<EstimatingProject>) => {
    if (formMode === 'create') {
      // In a real app, this would make an API call to create the project
      console.log('Creating new project:', projectData);
      // Show success message
      alert('Project created successfully!');
    } else {
      // In a real app, this would make an API call to update the project
      console.log('Updating project:', projectData);
      // Show success message
      alert('Project updated successfully!');
    }
    
    // Reset form state
    setShowProjectForm(false);
    setEditingProject(null);
    setFormMode('create');
  };

  // Handle external trigger for new opportunity form
  useEffect(() => {
    if (showNewOpportunityForm) {
      handleCreateProject()
      // Reset the external trigger
      if (onNewOpportunityFormChange) {
        onNewOpportunityFormChange(false)
      }
    }
  }, [showNewOpportunityForm, onNewOpportunityFormChange, handleCreateProject]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 lg:gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 rounded-lg flex-shrink-0">
                <Building2 className="h-3 w-3 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">Total Projects</p>
                <p className="text-base lg:text-lg font-bold text-blue-600">{summary.totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-500/10 rounded-lg flex-shrink-0">
                <Target className="h-3 w-3 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">Active Projects</p>
                <p className="text-base lg:text-lg font-bold text-green-600">{summary.activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/10 rounded-lg flex-shrink-0">
                <DollarSign className="h-3 w-3 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">Total Value</p>
                <p className="text-sm lg:text-base font-bold text-purple-600">{formatCurrency(summary.totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg flex-shrink-0">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">Awarded Value</p>
                <p className="text-sm lg:text-base font-bold text-emerald-600">{formatCurrency(summary.awardedValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-yellow-500/10 rounded-lg flex-shrink-0">
                <Clock className="h-3 w-3 text-yellow-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">Pending Value</p>
                <p className="text-sm lg:text-base font-bold text-yellow-600">{formatCurrency(summary.pendingValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-500/10 rounded-lg flex-shrink-0">
                <XCircle className="h-3 w-3 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">Not Awarded</p>
                <p className="text-sm lg:text-base font-bold text-red-600">{formatCurrency(summary.notAwardedValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/20 border-indigo-200 dark:border-indigo-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg flex-shrink-0">
                <Target className="h-3 w-3 text-indigo-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">Win Rate</p>
                <p className="text-base lg:text-lg font-bold text-indigo-600">{summary.winRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/20 dark:to-teal-900/20 border-teal-200 dark:border-teal-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-500/10 rounded-lg flex-shrink-0">
                <DollarSign className="h-3 w-3 text-teal-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">Avg Project</p>
                <p className="text-sm lg:text-base font-bold text-teal-600">{formatCurrency(summary.avgProjectValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="min-h-0 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="text-lg lg:text-xl">Estimating Project Tracker</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filters.status?.[0] || 'all'} onValueChange={(value) => setFilters({...filters, status: value === 'all' ? undefined : [value]})}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="AWARDED">Awarded</SelectItem>
                <SelectItem value="NOT AWARDED">Not Awarded</SelectItem>
                <SelectItem value="ON HOLD">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pursuits" className="text-xs sm:text-sm">
                  Current Pursuits ({filteredCurrentPursuits.length})
                </TabsTrigger>
                <TabsTrigger value="preconstruction" className="text-xs sm:text-sm">
                  Current Preconstruction ({filteredPreconstruction.length})
                </TabsTrigger>
                <TabsTrigger value="tracking" className="text-xs sm:text-sm">
                  Tracking Log ({filteredTrackingLog.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Current Pursuits Tab */}
            <TabsContent value="pursuits" className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
              <div className="rounded-md border overflow-hidden h-full">
                <div className="overflow-auto h-full max-h-[600px]">
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Deliverable</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Lead Estimator</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Checklist</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCurrentPursuits.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="min-w-[200px]">
                          <div>
                            <p className="font-medium text-sm truncate max-w-[180px]" title={project.projectName}>
                              {project.projectName}
                            </p>
                            <p className="text-xs text-muted-foreground">{project.projectNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {project.source}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[140px]">
                          <Badge variant="outline" className={`text-xs whitespace-nowrap ${getDeliverableColor(project.deliverable)}`}>
                            {project.deliverable}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[110px]">
                          {project.dueDateOutTheDoor ? (
                            <div className="flex items-center gap-1 text-xs whitespace-nowrap">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              {format(new Date(project.dueDateOutTheDoor), 'MMM dd, yyyy')}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 flex-shrink-0" />
                            <span className="text-sm font-medium truncate">{project.leadEstimator}</span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <Badge variant="outline" className={`text-xs whitespace-nowrap ${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <ChecklistIndicator checklist={project.checklist} />
                        </TableCell>
                        <TableCell className="min-w-[140px]">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </div>
            </TabsContent>

            {/* Current Preconstruction Tab */}
            <TabsContent value="preconstruction" className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
              <div className="rounded-md border overflow-hidden h-full">
                <div className="overflow-auto h-full max-h-[600px]">
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Current Stage</TableHead>
                      <TableHead>Lead Estimator</TableHead>
                      <TableHead>PX</TableHead>
                      <TableHead>Precon Budget</TableHead>
                      <TableHead>Billed to Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPreconstruction.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{project.projectName}</p>
                            <p className="text-xs text-muted-foreground">{project.projectNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {project.currentStage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="text-sm">{project.leadEstimator}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{project.px || '-'}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{formatCurrency(project.preconBudget)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{formatCurrency(project.billedToDate)}</span>
                        </TableCell>
                        <TableCell>
                          {project.preconBudget && project.billedToDate ? (
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={(project.billedToDate / project.preconBudget) * 100} 
                                className="w-16 h-2" 
                              />
                              <span className="text-xs text-muted-foreground">
                                {Math.round((project.billedToDate / project.preconBudget) * 100)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </div>
            </TabsContent>

            {/* Tracking Log Tab */}
            <TabsContent value="tracking" className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
              <div className="rounded-md border overflow-hidden h-full">
                <div className="overflow-auto h-full max-h-[600px]">
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Deliverable</TableHead>
                      <TableHead>Lead Estimator</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Estimated Value</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrackingLog.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{project.projectName}</p>
                            <p className="text-xs text-muted-foreground">{project.projectNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${getDeliverableColor(project.deliverable)}`}>
                            {project.deliverable}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="text-sm">{project.leadEstimator}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {project.submittedDate ? (
                            <div className="flex items-center gap-1 text-xs">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(project.submittedDate), 'MMM dd, yyyy')}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{formatCurrency(project.estimatedValue)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              project.outcome === 'AWARDED W/ PRECON' || project.outcome === 'AWARDED W/O PRECON' 
                                ? 'bg-green-500/10 text-green-600 border-green-200'
                                : project.outcome === 'NOT AWARDED'
                                ? 'bg-red-500/10 text-red-600 border-red-200'
                                : 'bg-yellow-500/10 text-yellow-600 border-yellow-200'
                            }`}
                          >
                            {project.outcome}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {project.notes ? (
                            <div className="max-w-xs">
                              <p className="text-xs text-muted-foreground truncate" title={project.notes}>
                                {project.notes}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>



      {/* Project Form Modal */}
      <ProjectForm
        open={showProjectForm}
        onOpenChange={setShowProjectForm}
        project={editingProject}
        onSave={handleSaveProject}
        mode={formMode}
      />
    </div>
  );
} 