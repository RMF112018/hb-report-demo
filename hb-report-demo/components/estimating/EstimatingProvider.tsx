"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// Types for estimating data
export interface EstimateData {
  id: string
  projectId: string
  projectName: string
  client: string
  estimator: string
  status: 'draft' | 'in-progress' | 'review' | 'approved' | 'submitted' | 'awarded' | 'lost'
  phase: string
  dateCreated: string
  lastModified: string
  dueDate: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  totalEstimatedValue: number
  actualCost?: number | null
  confidence: number
  accuracy?: number | null
  grossSF: number
  costPerSF: number
  trades: {
    name: string
    estimatedCost: number
    status: 'pending' | 'in-progress' | 'complete'
  }[]
  milestones: {
    name: string
    status: 'pending' | 'in-progress' | 'complete'
    completedDate?: string
    dueDate?: string
  }[]
  riskFactors: string[]
  contingency: number
  overhead: number
  profit: number
  lossReason?: string
}

export interface ProjectData {
  id: string
  project_name: string
  project_stage_name: string
  active: boolean
  client_name?: string
  project_value?: number
  start_date?: string
  completion_date?: string
}

export interface QuantityTakeoff {
  id: string
  projectId: string
  category: string
  description: string
  quantity: number
  unit: string
  unitCost: number
  totalCost: number
  notes?: string
  dateCreated: string
  lastModified: string
}

export interface BidData {
  id: string
  projectId: string
  tradeCategory: string
  vendorName: string
  bidAmount: number
  status: 'received' | 'reviewed' | 'selected' | 'rejected'
  submissionDate: string
  validUntil: string
  notes?: string
  lineItems: {
    description: string
    quantity: number
    unit: string
    unitPrice: number
    totalPrice: number
  }[]
}

export interface CostAnalysis {
  projectId: string
  totalCost: number
  costBreakdown: {
    category: string
    amount: number
    percentage: number
  }[]
  variance: {
    estimated: number
    actual: number
    difference: number
    percentageVariance: number
  }
  trends: {
    month: string
    estimatedValue: number
    actualValue: number
  }[]
}

// Context interface
interface EstimatingContextType {
  // Data
  estimates: EstimateData[]
  projects: ProjectData[]
  selectedProject: ProjectData | null
  selectedEstimate: EstimateData | null
  takeoffs: QuantityTakeoff[]
  bids: BidData[]
  costAnalyses: CostAnalysis[]
  
  // Loading states
  isLoading: boolean
  isSaving: boolean
  
  // Actions
  setSelectedProject: (project: ProjectData | null) => void
  setSelectedEstimate: (estimate: EstimateData | null) => void
  updateEstimate: (estimateId: string, updates: Partial<EstimateData>) => void
  createNewEstimate: (projectId: string, estimateData: Partial<EstimateData>) => void
  deleteEstimate: (estimateId: string) => void
  
  // Takeoff actions
  addTakeoffItem: (takeoff: Omit<QuantityTakeoff, 'id' | 'dateCreated' | 'lastModified'>) => void
  updateTakeoffItem: (takeoffId: string, updates: Partial<QuantityTakeoff>) => void
  deleteTakeoffItem: (takeoffId: string) => void
  
  // Bid actions
  addBid: (bid: Omit<BidData, 'id'>) => void
  updateBid: (bidId: string, updates: Partial<BidData>) => void
  deleteBid: (bidId: string) => void
  selectBid: (bidId: string) => void
  
  // Utility functions
  getProjectEstimates: (projectId: string) => EstimateData[]
  getEstimatesByStatus: (status: EstimateData['status']) => EstimateData[]
  calculateProjectMetrics: (projectId: string) => {
    totalValue: number
    averageAccuracy: number
    completionRate: number
  }
  
  // Export functions
  exportEstimateData: (estimateId: string, format: 'csv' | 'pdf') => void
  exportProjectSummary: (projectId: string, format: 'csv' | 'pdf') => void
}

// Create context
const EstimatingContext = createContext<EstimatingContextType | undefined>(undefined)

// Provider component
export function EstimatingProvider({ children }: { children: ReactNode }) {
  // State
  const [estimates, setEstimates] = useState<EstimateData[]>([])
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [selectedEstimate, setSelectedEstimate] = useState<EstimateData | null>(null)
  const [takeoffs, setTakeoffs] = useState<QuantityTakeoff[]>([])
  const [bids, setBids] = useState<BidData[]>([])
  const [costAnalyses, setCostAnalyses] = useState<CostAnalysis[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Estimate actions
  const updateEstimate = useCallback((estimateId: string, updates: Partial<EstimateData>) => {
    setEstimates(prev => prev.map(est => 
      est.id === estimateId 
        ? { ...est, ...updates, lastModified: new Date().toISOString() }
        : est
    ))
  }, [])

  const createNewEstimate = useCallback((projectId: string, estimateData: Partial<EstimateData>) => {
    const newEstimate: EstimateData = {
      id: `est-${Date.now()}`,
      projectId,
      projectName: estimateData.projectName || 'New Estimate',
      client: estimateData.client || '',
      estimator: estimateData.estimator || '',
      status: 'draft',
      phase: 'pre-construction',
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      dueDate: estimateData.dueDate || '',
      priority: 'medium',
      totalEstimatedValue: 0,
      confidence: 50,
      grossSF: 0,
      costPerSF: 0,
      trades: [],
      milestones: [
        { name: 'Quantity Takeoff', status: 'pending' },
        { name: 'Trade Pricing', status: 'pending' },
        { name: 'Cost Summary', status: 'pending' }
      ],
      riskFactors: [],
      contingency: 5.0,
      overhead: 8.0,
      profit: 10.0,
      ...estimateData
    }
    
    setEstimates(prev => [...prev, newEstimate])
    setSelectedEstimate(newEstimate)
  }, [])

  const deleteEstimate = useCallback((estimateId: string) => {
    setEstimates(prev => prev.filter(est => est.id !== estimateId))
    if (selectedEstimate?.id === estimateId) {
      setSelectedEstimate(null)
    }
  }, [selectedEstimate])

  // Takeoff actions
  const addTakeoffItem = useCallback((takeoff: Omit<QuantityTakeoff, 'id' | 'dateCreated' | 'lastModified'>) => {
    const newTakeoff: QuantityTakeoff = {
      ...takeoff,
      id: `to-${Date.now()}`,
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
    setTakeoffs(prev => [...prev, newTakeoff])
  }, [])

  const updateTakeoffItem = useCallback((takeoffId: string, updates: Partial<QuantityTakeoff>) => {
    setTakeoffs(prev => prev.map(to => 
      to.id === takeoffId 
        ? { ...to, ...updates, lastModified: new Date().toISOString() }
        : to
    ))
  }, [])

  const deleteTakeoffItem = useCallback((takeoffId: string) => {
    setTakeoffs(prev => prev.filter(to => to.id !== takeoffId))
  }, [])

  // Bid actions
  const addBid = useCallback((bid: Omit<BidData, 'id'>) => {
    const newBid: BidData = {
      ...bid,
      id: `bid-${Date.now()}`
    }
    setBids(prev => [...prev, newBid])
  }, [])

  const updateBid = useCallback((bidId: string, updates: Partial<BidData>) => {
    setBids(prev => prev.map(bid => 
      bid.id === bidId ? { ...bid, ...updates } : bid
    ))
  }, [])

  const deleteBid = useCallback((bidId: string) => {
    setBids(prev => prev.filter(bid => bid.id !== bidId))
  }, [])

  const selectBid = useCallback((bidId: string) => {
    setBids(prev => prev.map(bid => ({
      ...bid,
      status: bid.id === bidId ? 'selected' : 
              bid.status === 'selected' ? 'reviewed' : bid.status
    })))
  }, [])

  // Utility functions
  const getProjectEstimates = useCallback((projectId: string) => {
    return estimates.filter(est => est.projectId === projectId)
  }, [estimates])

  const getEstimatesByStatus = useCallback((status: EstimateData['status']) => {
    return estimates.filter(est => est.status === status)
  }, [estimates])

  const calculateProjectMetrics = useCallback((projectId: string) => {
    const projectEstimates = getProjectEstimates(projectId)
    
    const totalValue = projectEstimates.reduce((sum, est) => sum + est.totalEstimatedValue, 0)
    
    const estimatesWithAccuracy = projectEstimates.filter(est => est.accuracy !== null)
    const averageAccuracy = estimatesWithAccuracy.length > 0
      ? estimatesWithAccuracy.reduce((sum, est) => sum + (est.accuracy || 0), 0) / estimatesWithAccuracy.length
      : 0
    
    const completedEstimates = projectEstimates.filter(est => 
      ['approved', 'submitted', 'awarded'].includes(est.status)
    )
    const completionRate = projectEstimates.length > 0 
      ? (completedEstimates.length / projectEstimates.length) * 100 
      : 0

    return {
      totalValue,
      averageAccuracy,
      completionRate
    }
  }, [getProjectEstimates])

  // Export functions
  const exportEstimateData = useCallback((estimateId: string, format: 'csv' | 'pdf') => {
    const estimate = estimates.find(est => est.id === estimateId)
    if (!estimate) return

    // Mock export functionality
    console.log(`Exporting estimate ${estimate.projectName} as ${format}`)
    
    // In a real application, this would generate and download the file
    if (format === 'csv') {
      // Generate CSV content
      const csvContent = [
        'Project,Client,Estimator,Status,Total Value,Confidence',
        `${estimate.projectName},${estimate.client},${estimate.estimator},${estimate.status},${estimate.totalEstimatedValue},${estimate.confidence}%`
      ].join('\n')
      
      // Create download
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `estimate-${estimate.id}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    }
  }, [estimates])

  const exportProjectSummary = useCallback((projectId: string, format: 'csv' | 'pdf') => {
    const projectEstimates = getProjectEstimates(projectId)
    console.log(`Exporting project summary for ${projectId} as ${format}`)
    
    // Mock export functionality for project summary
  }, [getProjectEstimates])

  // Context value
  const contextValue: EstimatingContextType = {
    // Data
    estimates,
    projects,
    selectedProject,
    selectedEstimate,
    takeoffs,
    bids,
    costAnalyses,
    
    // Loading states
    isLoading,
    isSaving,
    
    // Actions
    setSelectedProject,
    setSelectedEstimate,
    updateEstimate,
    createNewEstimate,
    deleteEstimate,
    
    // Takeoff actions
    addTakeoffItem,
    updateTakeoffItem,
    deleteTakeoffItem,
    
    // Bid actions
    addBid,
    updateBid,
    deleteBid,
    selectBid,
    
    // Utility functions
    getProjectEstimates,
    getEstimatesByStatus,
    calculateProjectMetrics,
    
    // Export functions
    exportEstimateData,
    exportProjectSummary
  }

  return (
    <EstimatingContext.Provider value={contextValue}>
      {children}
    </EstimatingContext.Provider>
  )
}

// Hook to use the context
export function useEstimating() {
  const context = useContext(EstimatingContext)
  if (context === undefined) {
    throw new Error('useEstimating must be used within an EstimatingProvider')
  }
  return context
}

export default EstimatingProvider 