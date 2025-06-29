"use client"

import React, { useState, useCallback, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { 
  DollarSign, 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Save, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Edit3,
  Plus,
  Trash2,
  Eye,
  Send,
  Target,
  BarChart3,
  Building2,
  Users,
  Clock,
  Award,
  RefreshCw
} from "lucide-react"

// Types for Cost Summary
export interface CostCategory {
  id: string
  category: string
  description: string
  csiCode?: string
  selectedBidAmount: number
  originalBidAmount: number
  buyoutSavings: number
  adjustments: number
  finalAmount: number
  status: 'pending' | 'selected' | 'committed' | 'approved'
  bidder?: string
  notes?: string
  lastModified: string
}

export interface GeneralConditions {
  supervision: number
  temporaryFacilities: number
  equipment: number
  utilities: number
  permits: number
  insurance: number
  bonds: number
  other: number
}

export interface GeneralRequirements {
  projectManagement: number
  qualityControl: number
  safety: number
  testing: number
  cleanup: number
  mobilization: number
  demobilization: number
  other: number
}

export interface ApprovalStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'complete' | 'skipped'
  approver: string
  completedBy?: string
  completedAt?: Date
  required: boolean
}

export interface CostSummaryData {
  projectId: string
  projectName: string
  costCategories: CostCategory[]
  generalConditions: GeneralConditions
  generalRequirements: GeneralRequirements
  approvalSteps: ApprovalStep[]
  subtotal: number
  overhead: number
  profit: number
  contingency: number
  total: number
  approvalStatus: 'draft' | 'pending' | 'approved' | 'submitted'
  approvalProgress: number
  lastModified: string
}

interface CostSummaryModuleProps {
  projectId: string
  projectName: string
  onSave?: (data: CostSummaryData) => void
  onExport?: (format: 'pdf' | 'csv') => void
  onSubmit?: (data: CostSummaryData) => void
}

export function CostSummaryModule({ 
  projectId, 
  projectName, 
  onSave, 
  onExport, 
  onSubmit 
}: CostSummaryModuleProps) {
  const { toast } = useToast()
  
  // State management
  const [activeTab, setActiveTab] = useState('categories')
  const [costCategories, setCostCategories] = useState<CostCategory[]>([])
  const [generalConditions, setGeneralConditions] = useState<GeneralConditions>({
    supervision: 0,
    temporaryFacilities: 0,
    equipment: 0,
    utilities: 0,
    permits: 0,
    insurance: 0,
    bonds: 0,
    other: 0
  })
  const [generalRequirements, setGeneralRequirements] = useState<GeneralRequirements>({
    projectManagement: 0,
    qualityControl: 0,
    safety: 0,
    testing: 0,
    cleanup: 0,
    mobilization: 0,
    demobilization: 0,
    other: 0
  })
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Initialize data
  useEffect(() => {
    // Mock initial data - in production this would come from API
    const mockCostCategories: CostCategory[] = [
      {
        id: '1',
        category: 'Site Work',
        description: 'Earthwork, utilities, paving',
        csiCode: '02000',
        selectedBidAmount: 850000,
        originalBidAmount: 900000,
        buyoutSavings: 50000,
        adjustments: 0,
        finalAmount: 850000,
        status: 'selected',
        bidder: 'ABC Excavation',
        notes: 'Includes 15% rock allowance',
        lastModified: new Date().toISOString()
      },
      {
        id: '2',
        category: 'Concrete',
        description: 'Structural concrete, foundations',
        csiCode: '03000',
        selectedBidAmount: 2100000,
        originalBidAmount: 2200000,
        buyoutSavings: 100000,
        adjustments: 0,
        finalAmount: 2100000,
        status: 'committed',
        bidder: 'Solid Concrete Co',
        notes: 'Best value with strong references',
        lastModified: new Date().toISOString()
      },
      {
        id: '3',
        category: 'Steel',
        description: 'Structural steel, misc metals',
        csiCode: '05000',
        selectedBidAmount: 3200000,
        originalBidAmount: 3400000,
        buyoutSavings: 200000,
        adjustments: 0,
        finalAmount: 3200000,
        status: 'approved',
        bidder: 'Premier Steel',
        notes: 'Market pricing locked through Q2',
        lastModified: new Date().toISOString()
      },
      {
        id: '4',
        category: 'MEP',
        description: 'Mechanical, electrical, plumbing',
        csiCode: '15000-16000',
        selectedBidAmount: 4800000,
        originalBidAmount: 5000000,
        buyoutSavings: 200000,
        adjustments: 0,
        finalAmount: 4800000,
        status: 'pending',
        bidder: 'Total MEP Solutions',
        notes: 'Contingent on final drawings',
        lastModified: new Date().toISOString()
      },
      {
        id: '5',
        category: 'Finishes',
        description: 'Flooring, painting, ceilings',
        csiCode: '09000',
        selectedBidAmount: 1800000,
        originalBidAmount: 1850000,
        buyoutSavings: 50000,
        adjustments: 0,
        finalAmount: 1800000,
        status: 'selected',
        bidder: 'Elite Finishes',
        notes: 'Upgraded tile selection',
        lastModified: new Date().toISOString()
      }
    ]

    const mockApprovalSteps: ApprovalStep[] = [
      {
        id: '1',
        title: 'Cost Review',
        description: 'Senior estimator review of all cost categories',
        status: 'complete',
        approver: 'Senior Estimator',
        completedBy: 'John Smith',
        completedAt: new Date(),
        required: true
      },
      {
        id: '2',
        title: 'Project Manager Approval',
        description: 'PM approval of final cost summary',
        status: 'pending',
        approver: 'Project Manager',
        required: true
      },
      {
        id: '3',
        title: 'Executive Review',
        description: 'Executive approval for submission',
        status: 'pending',
        approver: 'Project Executive',
        required: true
      }
    ]

    setCostCategories(mockCostCategories)
    setApprovalSteps(mockApprovalSteps)
    
    // Mock general conditions and requirements
    setGeneralConditions({
      supervision: 450000,
      temporaryFacilities: 320000,
      equipment: 180000,
      utilities: 75000,
      permits: 45000,
      insurance: 85000,
      bonds: 55000,
      other: 40000
    })

    setGeneralRequirements({
      projectManagement: 280000,
      qualityControl: 120000,
      safety: 95000,
      testing: 65000,
      cleanup: 85000,
      mobilization: 110000,
      demobilization: 90000,
      other: 35000
    })
  }, [])

  // Calculate totals
  const calculations = useMemo(() => {
    const subtotal = costCategories.reduce((sum, category) => sum + category.finalAmount, 0)
    const gcTotal = Object.values(generalConditions).reduce((sum, value) => sum + value, 0)
    const grTotal = Object.values(generalRequirements).reduce((sum, value) => sum + value, 0)
    
    const baseTotal = subtotal + gcTotal + grTotal
    const overhead = baseTotal * 0.08 // 8% overhead
    const profit = baseTotal * 0.10 // 10% profit
    const contingency = baseTotal * 0.05 // 5% contingency
    const total = baseTotal + overhead + profit + contingency

    const totalBuyoutSavings = costCategories.reduce((sum, category) => sum + category.buyoutSavings, 0)
    const completedSteps = approvalSteps.filter(step => step.status === 'complete').length
    const approvalProgress = (completedSteps / approvalSteps.length) * 100
    
    return {
      subtotal,
      gcTotal,
      grTotal,
      baseTotal,
      overhead,
      profit,
      contingency,
      total,
      totalBuyoutSavings,
      approvalProgress,
      markupPercentage: ((overhead + profit + contingency) / baseTotal) * 100
    }
  }, [costCategories, generalConditions, generalRequirements, approvalSteps])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'selected': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'committed': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Inline edit component
  const InlineEdit = ({ 
    value, 
    onSave, 
    type = 'number', 
    className = '',
    prefix = '$'
  }: {
    value: number;
    onSave: (value: number) => void;
    type?: 'number';
    className?: string;
    prefix?: string;
  }) => {
    const fieldKey = `${type}-${value}-${Date.now()}`
    const isEditing = editingField === fieldKey
    const [editValue, setEditValue] = useState(value)

    const handleSave = () => {
      onSave(editValue)
      setEditingField(null)
      setHasUnsavedChanges(true)
    }

    const handleCancel = () => {
      setEditValue(value)
      setEditingField(null)
    }

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(Number(e.target.value))}
            className="w-28 h-8 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') handleCancel()
            }}
            autoFocus
          />
          <Button size="sm" onClick={handleSave} className="h-6 w-6 p-0">
            <CheckCircle className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-6 w-6 p-0">
            ✕
          </Button>
        </div>
      )
    }

    return (
      <div 
        className={`flex items-center gap-1 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group ${className}`}
        onClick={() => setEditingField(fieldKey)}
      >
        <span className="text-sm font-medium">{formatCurrency(value)}</span>
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
      </div>
    )
  }

  // Update cost category
  const updateCostCategory = useCallback((categoryId: string, field: keyof CostCategory, value: any) => {
    setCostCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        const updated = { ...category, [field]: value, lastModified: new Date().toISOString() }
        
        // Recalculate final amount when relevant fields change
        if (field === 'selectedBidAmount' || field === 'adjustments') {
          updated.finalAmount = updated.selectedBidAmount + (updated.adjustments || 0)
        }
        
        return updated
      }
      return category
    }))
    setHasUnsavedChanges(true)
  }, [])

  // Add new cost category
  const addCostCategory = useCallback(() => {
    const newCategory: CostCategory = {
      id: Date.now().toString(),
      category: 'New Category',
      description: '',
      selectedBidAmount: 0,
      originalBidAmount: 0,
      buyoutSavings: 0,
      adjustments: 0,
      finalAmount: 0,
      status: 'pending',
      lastModified: new Date().toISOString()
    }
    setCostCategories(prev => [...prev, newCategory])
    setHasUnsavedChanges(true)
  }, [])

  // Remove cost category
  const removeCostCategory = useCallback((categoryId: string) => {
    setCostCategories(prev => prev.filter(category => category.id !== categoryId))
    setHasUnsavedChanges(true)
  }, [])

  // Handle approval step
  const handleApprovalStep = useCallback((stepId: string, action: 'approve' | 'reject') => {
    setApprovalSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          status: action === 'approve' ? 'complete' : 'skipped',
          completedBy: action === 'approve' ? 'Current User' : undefined,
          completedAt: action === 'approve' ? new Date() : undefined,
        }
      }
      return step
    }))
    
    toast({
      title: "Approval Status Updated",
      description: `Step marked as ${action === 'approve' ? 'approved' : 'rejected'}.`,
    })
  }, [toast])

  // Save data
  const handleSave = useCallback(async () => {
    const costSummaryData: CostSummaryData = {
      projectId,
      projectName,
      costCategories,
      generalConditions,
      generalRequirements,
      approvalSteps,
      subtotal: calculations.subtotal,
      overhead: calculations.overhead,
      profit: calculations.profit,
      contingency: calculations.contingency,
      total: calculations.total,
      approvalStatus: 'pending',
      approvalProgress: calculations.approvalProgress,
      lastModified: new Date().toISOString()
    }

    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (onSave) {
      onSave(costSummaryData)
    }
    
    setHasUnsavedChanges(false)
    toast({
      title: "Cost Summary Saved",
      description: "All changes have been saved successfully.",
    })
  }, [projectId, projectName, costCategories, generalConditions, generalRequirements, approvalSteps, calculations, onSave, toast])

  // Export data
  const handleExport = useCallback(async (format: 'pdf' | 'csv') => {
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      if (onExport) {
        onExport(format)
      }
      toast({
        title: "Export Successful",
        description: `Cost summary exported as ${format.toUpperCase()}.`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }, [onExport, toast])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            Cost Summary - {projectName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Selected bid costs and project estimate compilation
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <Alert className="w-auto py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">Unsaved changes</AlertDescription>
            </Alert>
          )}
          
          <Button onClick={handleSave} disabled={!hasUnsavedChanges} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleExport('pdf')} 
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Estimate</CardTitle>
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(calculations.total)}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {calculations.markupPercentage.toFixed(1)}% markup
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Buyout Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(calculations.totalBuyoutSavings)}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Negotiated savings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Categories</CardTitle>
            <Building2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {costCategories.length}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Cost categories
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Approval</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {calculations.approvalProgress.toFixed(0)}%
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Complete
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Cost Categories</TabsTrigger>
          <TabsTrigger value="conditions">General Conditions</TabsTrigger>
          <TabsTrigger value="requirements">General Requirements</TabsTrigger>
          <TabsTrigger value="summary">Final Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Selected Bid Costs
                  </CardTitle>
                  <CardDescription>
                    Editable cost categories with buyout savings and adjustments
                  </CardDescription>
                </div>
                <Button onClick={addCostCategory} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 bg-muted/50">
                      <th className="text-left p-3 w-32">Category</th>
                      <th className="text-left p-3 w-48">Description</th>
                      <th className="text-left p-3 w-24">CSI Code</th>
                      <th className="text-left p-3 w-32">Original Bid</th>
                      <th className="text-left p-3 w-32">Selected Bid</th>
                      <th className="text-left p-3 w-32">Buyout Savings</th>
                      <th className="text-left p-3 w-32">Adjustments</th>
                      <th className="text-left p-3 w-32">Final Amount</th>
                      <th className="text-left p-3 w-24">Status</th>
                      <th className="text-left p-3 w-32">Bidder</th>
                      <th className="text-left p-3 w-16">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costCategories.map((category) => (
                      <tr key={category.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div 
                            className="font-medium cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group"
                            onClick={() => {
                              const newValue = prompt("Enter category name:", category.category)
                              if (newValue) updateCostCategory(category.id, 'category', newValue)
                            }}
                          >
                            {category.category}
                            <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity inline ml-1" />
                          </div>
                        </td>
                        <td className="p-3">
                          <div 
                            className="cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group"
                            onClick={() => {
                              const newValue = prompt("Enter description:", category.description)
                              if (newValue !== null) updateCostCategory(category.id, 'description', newValue)
                            }}
                          >
                            {category.description || 'Click to add description'}
                            <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity inline ml-1" />
                          </div>
                        </td>
                        <td className="p-3">
                          <div 
                            className="cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group"
                            onClick={() => {
                              const newValue = prompt("Enter CSI code:", category.csiCode || '')
                              if (newValue !== null) updateCostCategory(category.id, 'csiCode', newValue)
                            }}
                          >
                            {category.csiCode || 'N/A'}
                            <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity inline ml-1" />
                          </div>
                        </td>
                        <td className="p-3">
                          <InlineEdit
                            value={category.originalBidAmount}
                            onSave={(value) => updateCostCategory(category.id, 'originalBidAmount', value)}
                          />
                        </td>
                        <td className="p-3">
                          <InlineEdit
                            value={category.selectedBidAmount}
                            onSave={(value) => updateCostCategory(category.id, 'selectedBidAmount', value)}
                          />
                        </td>
                        <td className="p-3">
                          <InlineEdit
                            value={category.buyoutSavings}
                            onSave={(value) => updateCostCategory(category.id, 'buyoutSavings', value)}
                            className="text-green-600"
                          />
                        </td>
                        <td className="p-3">
                          <InlineEdit
                            value={category.adjustments}
                            onSave={(value) => updateCostCategory(category.id, 'adjustments', value)}
                          />
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-blue-900 dark:text-blue-100">
                            {formatCurrency(category.finalAmount)}
                          </div>
                        </td>
                        <td className="p-3">
                          <Select
                            value={category.status}
                            onValueChange={(value) => updateCostCategory(category.id, 'status', value)}
                          >
                            <SelectTrigger className="w-24 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="selected">Selected</SelectItem>
                              <SelectItem value="committed">Committed</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <div 
                            className="cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group text-xs"
                            onClick={() => {
                              const newValue = prompt("Enter bidder name:", category.bidder || '')
                              if (newValue !== null) updateCostCategory(category.id, 'bidder', newValue)
                            }}
                          >
                            {category.bidder || 'TBD'}
                            <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity inline ml-1" />
                          </div>
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCostCategory(category.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    
                    {/* Subtotal Row */}
                    <tr className="border-t-2 bg-blue-50 dark:bg-blue-950 font-semibold">
                      <td colSpan={7} className="p-3 text-right">Subtotal:</td>
                      <td className="p-3 text-lg font-bold text-blue-900 dark:text-blue-100">
                        {formatCurrency(calculations.subtotal)}
                      </td>
                      <td colSpan={3}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                General Conditions
              </CardTitle>
              <CardDescription>
                Project management and site-related costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(generalConditions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <InlineEdit
                      value={value}
                      onSave={(newValue) => {
                        setGeneralConditions(prev => ({ ...prev, [key]: newValue }))
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>
                ))}
                <div className="col-span-2 pt-3 border-t">
                  <div className="flex items-center justify-between font-semibold text-lg">
                    <span>General Conditions Total:</span>
                    <span className="text-green-900 dark:text-green-100">
                      {formatCurrency(calculations.gcTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                General Requirements
              </CardTitle>
              <CardDescription>
                Administrative and operational requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(generalRequirements).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <InlineEdit
                      value={value}
                      onSave={(newValue) => {
                        setGeneralRequirements(prev => ({ ...prev, [key]: newValue }))
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>
                ))}
                <div className="col-span-2 pt-3 border-t">
                  <div className="flex items-center justify-between font-semibold text-lg">
                    <span>General Requirements Total:</span>
                    <span className="text-orange-900 dark:text-orange-100">
                      {formatCurrency(calculations.grTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Final Cost Summary */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <Calculator className="h-5 w-5" />
                  Final Cost Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Direct Costs:</span>
                    <span className="font-semibold">{formatCurrency(calculations.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>General Conditions:</span>
                    <span className="font-semibold">{formatCurrency(calculations.gcTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>General Requirements:</span>
                    <span className="font-semibold">{formatCurrency(calculations.grTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(calculations.baseTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Overhead (8%):</span>
                    <span className="font-semibold">{formatCurrency(calculations.overhead)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Profit (10%):</span>
                    <span className="font-semibold">{formatCurrency(calculations.profit)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Contingency (5%):</span>
                    <span className="font-semibold">{formatCurrency(calculations.contingency)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t-2 pt-3 text-lg">
                    <span className="font-bold text-blue-800 dark:text-blue-200">Total Bid:</span>
                    <span className="font-bold text-2xl text-blue-900 dark:text-blue-100">
                      {formatCurrency(calculations.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Approval Workflow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Approval Workflow
                </CardTitle>
                <CardDescription>
                  Review and approval status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {approvalSteps.map((step) => (
                    <div key={step.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{step.title}</div>
                        <div className="text-sm text-muted-foreground">{step.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Approver: {step.approver}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          step.status === 'complete' ? 'bg-green-100 text-green-800' :
                          step.status === 'skipped' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {step.status === 'complete' ? 'Approved' :
                           step.status === 'skipped' ? 'Rejected' : 'Pending'}
                        </Badge>
                        {step.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => handleApprovalStep(step.id, 'approve')}
                              className="h-7 w-7 p-0 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleApprovalStep(step.id, 'reject')}
                              className="h-7 w-7 p-0"
                            >
                              ✕
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Approval Progress:</span>
                    <span className="font-medium">{calculations.approvalProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={calculations.approvalProgress} className="h-2" />
                </div>

                {calculations.approvalProgress === 100 && (
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => {
                      if (onSubmit) {
                        const costSummaryData: CostSummaryData = {
                          projectId,
                          projectName,
                          costCategories,
                          generalConditions,
                          generalRequirements,
                          approvalSteps,
                          subtotal: calculations.subtotal,
                          overhead: calculations.overhead,
                          profit: calculations.profit,
                          contingency: calculations.contingency,
                          total: calculations.total,
                          approvalStatus: 'approved',
                          approvalProgress: calculations.approvalProgress,
                          lastModified: new Date().toISOString()
                        }
                        onSubmit(costSummaryData)
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    Submit for Client Review
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 