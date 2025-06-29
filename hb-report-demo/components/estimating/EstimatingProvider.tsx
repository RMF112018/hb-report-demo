"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import type { Clarification, RFI, Document, DocumentImportResult } from '@/types/estimating-tracker'

// Sample data will be loaded from API endpoints

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

export interface TradePartner {
  id: string
  projectId: string
  number: number
  csiDivision: string
  csiDescription?: string
  contractorName: string
  status: 'pending' | 'selected'
  contractValue?: number
  notes?: string
  createdAt: string
  updatedAt: string
  bidDate?: string
  awardDate?: string
  contactInfo?: {
    primaryContact: string
    email: string
    phone: string
    address: string
  }
}

export interface TradePartnerImportResult {
  success: boolean
  totalRows: number
  successfulImports: number
  errors: { row: number; field: string; message: string }[]
  duplicates: number
}

export interface TradePartnerExportOptions {
  selectedOnly: boolean
  includeFinancials: boolean
  includeContactInfo: boolean
}

export interface CSICode {
  csi_code: string
  csi_code_description: string
}

export interface Allowance {
  id: string
  projectId: string
  number: number
  csiDivision: string
  csiDescription?: string
  description: string
  value: number
  notes?: string
  status: 'active' | 'inactive' | 'pending'
  category: string
  createdAt: string
  updatedAt: string
}

export interface AllowanceSummary {
  totalAllowances: number
  activeAllowances: number
  totalValue: number
  activeValue: number
  averageValue: number
  categoryBreakdown: Record<string, { count: number; value: number }>
  csiBreakdown: Record<string, { count: number; value: number }>
}

export interface AllowanceImportResult {
  success: boolean
  totalRows: number
  successfulImports: number
  errors: { row: number; field: string; message: string }[]
  duplicates: number
}

export interface AllowanceExportOptions {
  selectedOnly: boolean
  includeInactive: boolean
  includeNotes: boolean
}

// GC & GR types
export interface GCGRItem {
  id: string
  projectId: string
  contractRef?: string
  category: string
  description: string
  position?: string
  qty: number
  unitOfMeasure: string
  unitCost: number
  totalCost: number
  percentTime?: number
  customLaborRate?: number
  flsaOvertime?: number
  remarks?: string
  isIncluded: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectPhase {
  name: string
  startDate: string
  endDate: string
  days: number
  weeks: number
  months: number
}

export interface GCGRSummary {
  totalItems: number
  includedItems: number
  totalCost: number
  includedCost: number
  averageCost: number
  categoryBreakdown: Record<string, { count: number; cost: number }>
  laborCost: number
  fieldOfficeCost: number
  otherCost: number
  constructionDuration: {
    days: number
    weeks: number
    months: number
  }
  closeOutDuration: {
    days: number
    weeks: number
    months: number
  }
}

export interface GCGRImportResult {
  success: boolean
  totalRows: number
  successfulImports: number
  errors: { row: number; field: string; message: string }[]
  duplicates: number
}

export interface GCGRExportOptions {
  selectedOnly: boolean
  includeInactive: boolean
  groupByCategory: boolean
  includeRemarks: boolean
}

// Bid Leveling Types
export interface Bid {
  id: string
  vendor: string
  amount: number
  status: 'received' | 'reviewed' | 'selected' | 'rejected'
  confidence: number
  submissionDate: string
  validUntil?: string
  inclusions: string[]
  exclusions: string[]
  notes?: string
  attachments?: string[]
}

export interface TradeBids {
  tradeId: string
  tradeName: string
  csiDivision?: string
  projectId: string
  bids: Bid[]
  selectedBid?: string
  variance: number
  averageBid: number
  lowestBid: number
  highestBid: number
  riskLevel: 'low' | 'medium' | 'high'
  biddingStatus: 'pending' | 'soliciting' | 'reviewing' | 'awarded' | 'rejected'
  aiRecommendation?: string
  createdAt: string
  updatedAt: string
}

export interface BidComparison {
  id: string
  projectId: string
  tradeId: string
  bidIds: string[]
  criteria: {
    name: string
    weight: number
    scores: Record<string, number>
  }[]
  totalScores: Record<string, number>
  recommendation: string
  createdAt: string
  notes?: string
}

export interface BidLevelingSummary {
  totalTrades: number
  totalBids: number
  selectedBids: number
  pendingReviews: number
  totalValue: number
  selectedValue: number
  averageBidsPerTrade: number
  riskBreakdown: Record<string, number>
  statusBreakdown: Record<string, number>
  varianceAnalysis: {
    highVariance: number
    mediumVariance: number
    lowVariance: number
  }
}

export interface BidLevelingImportResult {
  success: boolean
  totalRows: number
  successfulImports: number
  errors: { row: number; field: string; message: string }[]
  duplicates: number
}

export interface BidLevelingExportOptions {
  selectedOnly: boolean
  includeNotes: boolean
  includeAIRecommendations: boolean
}

// Bid Tab Types
export interface BidTabItem {
  id: string
  category: string
  description: string
  quantity: number
  unitOfMeasure: string
  unitCost: number
  subtotal: number
  isIncluded: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface VendorBid {
  id: string
  vendorName: string
  contactInfo?: {
    name: string
    email: string
    phone: string
  }
  totalBid: number
  bondRate: number
  bondAmount: number
  adjustedTotal: number
  submissionDate: string
  isWinner: boolean
  notes?: string
  status: 'pending' | 'received' | 'reviewed' | 'selected'
}

export interface BidTab {
  id: string
  projectId: string
  tradeName: string
  csiCode: string
  csiDescription: string
  isActive: boolean
  items: BidTabItem[]
  vendors: VendorBid[]
  generalInclusions: string[]
  scopeRequirements: string[]
  subtotal: number
  bondRate: number
  bondAmount: number
  adjustedTotal: number
  squareFootage?: number
  costPerSF?: number
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface BidTabTemplate {
  id: string
  name: string
  csiCode: string
  description: string
  defaultItems: Omit<BidTabItem, 'id' | 'createdAt' | 'updatedAt'>[]
  defaultInclusions: string[]
  defaultScopeRequirements: string[]
  category: string
  isPublic: boolean
  createdBy: string
}

export interface BidTabSummary {
  totalTabs: number
  activeTabs: number
  totalValue: number
  averageTabValue: number
  tabsWithVendors: number
  totalVendors: number
  completedTabs: number
  csiDivisionBreakdown: Record<string, number>
  valueByDivision: Record<string, number>
}

export interface BidTabImportResult {
  success: boolean
  totalRows: number
  successfulImports: number
  errors: { row: number; field: string; message: string }[]
  duplicates: number
}

export interface BidTabExportOptions {
  selectedOnly: boolean
  includeItems: boolean
  includeVendors: boolean
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
  clarifications: Clarification[]
  rfis: RFI[]
  documents: Document[]
  tradePartners: TradePartner[]
  csiCodes: CSICode[]
  allowances: Allowance[]
  gcgrItems: GCGRItem[]
  projectPhases: ProjectPhase[]
  
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
  deleteBidData: (bidId: string) => void
  selectBidData: (bidId: string) => void
  
  // Clarification actions
  addClarification: (clarification: Omit<Clarification, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateClarification: (clarificationId: string, updates: Partial<Clarification>) => void
  deleteClarification: (clarificationId: string) => void
  getClarificationsByProject: (projectId: string) => Clarification[]
  getClarificationsByType: (type: Clarification['type']) => Clarification[]
  
  // RFI actions
  addRFI: (rfi: Omit<RFI, 'id' | 'dateCreated'>) => void
  updateRFI: (rfiId: string, updates: Partial<RFI>) => void
  deleteRFI: (rfiId: string) => void
  getRFIsByProject: (projectId: string) => RFI[]
  getRFIsByStatus: (status: RFI['status']) => RFI[]
  getRFIsByAssignee: (assignedTo: string) => RFI[]
  distributeRFI: (rfiId: string, distributionList: string[]) => void
  generateRFINumber: (projectId: string) => string
  
  // Document actions
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateDocument: (documentId: string, updates: Partial<Document>) => void
  deleteDocument: (documentId: string) => void
  getDocumentsByProject: (projectId: string) => Document[]
  getDocumentsByDiscipline: (discipline: Document['discipline']) => Document[]
  getDocumentsByCategory: (category: Document['category']) => Document[]
  importDocumentsFromFile: (file: File, projectId: string) => Promise<DocumentImportResult>
  exportDocumentsToCSV: (projectId?: string) => void
  generateDocumentTemplate: () => void
  
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
  
  // Trade Partners
  addTradePartner: (tradePartner: Omit<TradePartner, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTradePartner: (id: string, updates: Partial<TradePartner>) => void
  deleteTradePartner: (id: string) => void
  getTradePartnersByProject: (projectId: string) => TradePartner[]
  getTradePartnersByDivision: (csiDivision: string) => TradePartner[]
  getTradePartnersByStatus: (status: TradePartner['status']) => TradePartner[]
  importTradePartnersFromFile: (file: File) => Promise<TradePartnerImportResult>
  exportTradePartnersToCSV: (options: TradePartnerExportOptions) => void
  generateTradePartnerTemplate: () => void
  
  // Allowances
  addAllowance: (allowance: Omit<Allowance, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateAllowance: (id: string, updates: Partial<Allowance>) => void
  deleteAllowance: (id: string) => void
  getAllowancesByProject: (projectId: string) => Allowance[]
  getAllowancesByDivision: (csiDivision: string) => Allowance[]
  getAllowancesByCategory: (category: Allowance['category']) => Allowance[]
  getAllowancesSummary: (projectId?: string) => AllowanceSummary
  importAllowancesFromFile: (file: File) => Promise<AllowanceImportResult>
  exportAllowancesToCSV: (options: AllowanceExportOptions) => void
  generateAllowanceTemplate: () => void
  
  // GC & GR
  addGCGRItem: (item: Omit<GCGRItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateGCGRItem: (id: string, updates: Partial<GCGRItem>) => void
  deleteGCGRItem: (id: string) => void
  getGCGRItemsByProject: (projectId: string) => GCGRItem[]
  getGCGRSummary: (projectId?: string) => GCGRSummary
  importGCGRFromFile: (file: File) => Promise<GCGRImportResult>
  exportGCGRToCSV: (options: GCGRExportOptions) => void
  generateGCGRTemplate: () => void
  
  // Bid Leveling
  tradeBids: TradeBids[]
  bidComparisons: BidComparison[]
  bidLevelingNotes: string
  addTradeBids: (tradeBids: Omit<TradeBids, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTradeBids: (id: string, updates: Partial<TradeBids>) => void
  deleteTradeBids: (id: string) => void
  addBidToTrade: (tradeId: string, bid: Omit<Bid, 'id'>) => void
  updateTradeBid: (tradeId: string, bidId: string, updates: Partial<Bid>) => void
  deleteTradeBid: (tradeId: string, bidId: string) => void
  selectTradeBid: (tradeId: string, bidId: string) => void
  getBidLevelingSummary: () => BidLevelingSummary
  createBidComparison: (comparison: Omit<BidComparison, 'totalScores' | 'recommendation'>) => void
  importBidLevelingFromFile: (file: File) => Promise<BidLevelingImportResult>
  exportBidLevelingToCSV: (options: BidLevelingExportOptions) => void
  generateBidLevelingTemplate: () => void
  updateBidLevelingNotes: (notes: string) => void
  
  // Bid Tabs
  bidTabs: BidTab[]
  bidTabTemplates: BidTabTemplate[]
  addBidTab: (bidTab: Omit<BidTab, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBidTab: (id: string, updates: Partial<BidTab>) => void
  deleteBidTab: (id: string) => void
  duplicateBidTab: (id: string) => void
  addBidTabItem: (tabId: string, item: Omit<BidTabItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBidTabItem: (tabId: string, itemId: string, updates: Partial<BidTabItem>) => void
  deleteBidTabItem: (tabId: string, itemId: string) => void
  addVendorBid: (tabId: string, vendor: Omit<VendorBid, 'id'>) => void
  updateVendorBid: (tabId: string, vendorId: string, updates: Partial<VendorBid>) => void
  deleteVendorBid: (tabId: string, vendorId: string) => void
  selectWinningBid: (tabId: string, vendorId: string) => void
  getBidTabSummary: () => BidTabSummary
  getBidTabsByCSI: (csiCode: string) => BidTab[]
  createBidTabFromTemplate: (templateId: string, projectId: string) => void
  importBidTabsFromFile: (file: File) => Promise<BidTabImportResult>
  exportBidTabsToCSV: (options: BidTabExportOptions) => void
  generateBidTabTemplate: () => void
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
  const [clarifications, setClarifications] = useState<Clarification[]>([])
  const [rfis, setRfis] = useState<RFI[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [tradePartners, setTradePartners] = useState<TradePartner[]>([])
  const [csiCodes, setCsiCodes] = useState<CSICode[]>([])
  const [allowances, setAllowances] = useState<Allowance[]>([])
  const [gcgrItems, setGcgrItems] = useState<GCGRItem[]>([])
  const [projectPhases, setProjectPhases] = useState<ProjectPhase[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load sample data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          estimatesResponse,
          rfisResponse,
          clarificationsResponse,
          documentsResponse,
          tradePartnersResponse,
          allowancesResponse,
          gcgrResponse,
          bidLevelingResponse,
          bidTabsResponse,
          csiCodesResponse
        ] = await Promise.all([
          fetch('/data/mock/estimating/estimates.json'),
          fetch('/data/mock/estimating/rfis.json'),
          fetch('/data/mock/estimating/clarifications.json'),
          fetch('/data/mock/estimating/documents.json'),
          fetch('/data/mock/estimating/trade-partners.json'),
          fetch('/data/mock/estimating/allowances.json'),
          fetch('/data/mock/estimating/gc-gr.json'),
          fetch('/data/mock/estimating/bid-leveling.json'),
          fetch('/data/mock/estimating/bid-tabs.json'),
          fetch('/data/mock/csi-codes.json')
        ]);

        if (estimatesResponse.ok) {
          const estimatesData = await estimatesResponse.json();
          setEstimates(estimatesData);
        }

        if (rfisResponse.ok) {
          const rfisData = await rfisResponse.json();
          setRfis(rfisData);
        }

        if (clarificationsResponse.ok) {
          const clarificationsData = await clarificationsResponse.json();
          setClarifications(clarificationsData);
        }

        if (documentsResponse.ok) {
          const documentsData = await documentsResponse.json();
          setDocuments(documentsData);
        }

        if (tradePartnersResponse.ok) {
          const tradePartnersData = await tradePartnersResponse.json();
          setTradePartners(tradePartnersData);
        }

        if (allowancesResponse.ok) {
          const allowancesData = await allowancesResponse.json();
          setAllowances(allowancesData);
        }

        if (gcgrResponse.ok) {
          const gcgrData = await gcgrResponse.json();
          setGcgrItems(gcgrData.items || []);
          setProjectPhases(gcgrData.phases || []);
        }

        if (bidLevelingResponse.ok) {
          const bidLevelingData = await bidLevelingResponse.json();
          setTradeBids(bidLevelingData.tradeBids || []);
          setBidComparisons(bidLevelingData.comparisons || []);
          setBidLevelingNotes(bidLevelingData.notes || '');
        }

        if (bidTabsResponse.ok) {
          const bidTabsData = await bidTabsResponse.json();
          setBidTabs(bidTabsData.bidTabs || []);
          setBidTabTemplates(bidTabsData.templates || []);
        }

        if (csiCodesResponse.ok) {
          const csiCodesData = await csiCodesResponse.json();
          setCsiCodes(csiCodesData);
        }
      } catch (error) {
        console.error('Error loading estimating data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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

  const deleteBidData = useCallback((bidId: string) => {
    setBids(prev => prev.filter(bid => bid.id !== bidId))
  }, [])

  const selectBidData = useCallback((bidId: string) => {
    setBids(prev => prev.map(bid => ({
      ...bid,
      status: bid.id === bidId ? 'selected' : 
              bid.status === 'selected' ? 'reviewed' : bid.status
    })))
  }, [])

  // Clarification actions
  const addClarification = useCallback((clarification: Omit<Clarification, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClarification: Clarification = {
      ...clarification,
      id: `clar-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setClarifications(prev => [...prev, newClarification])
  }, [])

  const updateClarification = useCallback((clarificationId: string, updates: Partial<Clarification>) => {
    setClarifications(prev => prev.map(clar => 
      clar.id === clarificationId 
        ? { ...clar, ...updates, updatedAt: new Date() }
        : clar
    ))
  }, [])

  const deleteClarification = useCallback((clarificationId: string) => {
    setClarifications(prev => prev.filter(clar => clar.id !== clarificationId))
  }, [])

  const getClarificationsByProject = useCallback((projectId: string) => {
    return clarifications.filter(clar => clar.projectId === projectId)
  }, [clarifications])

  const getClarificationsByType = useCallback((type: Clarification['type']) => {
    return clarifications.filter(clar => clar.type === type)
  }, [])

  // RFI actions
  const generateRFINumber = useCallback((projectId: string) => {
    const projectRFIs = rfis.filter(rfi => rfi.projectId === projectId)
    const nextNumber = (projectRFIs.length + 1).toString().padStart(3, '0')
    return nextNumber
  }, [rfis])

  const addRFI = useCallback((rfi: Omit<RFI, 'id' | 'dateCreated'>) => {
    const newRFI: RFI = {
      ...rfi,
      id: `rfi-${Date.now()}`,
      dateCreated: new Date()
    }
    setRfis(prev => [...prev, newRFI])
  }, [])

  const updateRFI = useCallback((rfiId: string, updates: Partial<RFI>) => {
    setRfis(prev => prev.map(rfi => 
      rfi.id === rfiId ? { ...rfi, ...updates } : rfi
    ))
  }, [])

  const deleteRFI = useCallback((rfiId: string) => {
    setRfis(prev => prev.filter(rfi => rfi.id !== rfiId))
  }, [])

  const getRFIsByProject = useCallback((projectId: string) => {
    return rfis.filter(rfi => rfi.projectId === projectId)
  }, [rfis])

  const getRFIsByStatus = useCallback((status: RFI['status']) => {
    return rfis.filter(rfi => rfi.status === status)
  }, [rfis])

  const getRFIsByAssignee = useCallback((assignedTo: string) => {
    return rfis.filter(rfi => rfi.assignedTo === assignedTo)
  }, [rfis])

  const distributeRFI = useCallback((rfiId: string, distributionList: string[]) => {
    setRfis(prev => prev.map(rfi => 
      rfi.id === rfiId 
        ? { ...rfi, distributionList: [...(rfi.distributionList || []), ...distributionList] }
        : rfi
    ))
    // In a real application, this would trigger email notifications
    console.log(`RFI ${rfiId} distributed to:`, distributionList)
  }, [])

  // Document actions
  const addDocument = useCallback((document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDocument: Document = {
      ...document,
      id: `doc-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setDocuments(prev => [...prev, newDocument])
  }, [])

  const updateDocument = useCallback((documentId: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, ...updates, updatedAt: new Date() }
        : doc
    ))
  }, [])

  const deleteDocument = useCallback((documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
  }, [])

  const getDocumentsByProject = useCallback((projectId: string) => {
    return documents.filter(doc => doc.projectId === projectId)
  }, [documents])

  const getDocumentsByDiscipline = useCallback((discipline: Document['discipline']) => {
    return documents.filter(doc => doc.discipline === discipline)
  }, [documents])

  const getDocumentsByCategory = useCallback((category: Document['category']) => {
    return documents.filter(doc => doc.category === category)
  }, [documents])

  const importDocumentsFromFile = useCallback(async (file: File, projectId: string): Promise<DocumentImportResult> => {
    setIsLoading(true)
    
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const rows = content.split('\n').map(row => row.split(','))
          
          if (rows.length < 2) {
            resolve({
              successfulRows: 0,
              errorRows: 1,
              totalRows: rows.length,
              errors: [{ row: 1, field: 'general', value: '', message: 'File must contain headers and at least one data row' }]
            })
            return
          }

          const headers = rows[0].map(h => h.trim().toLowerCase())
          const dataRows = rows.slice(1)
          
          let successfulRows = 0
          let errorRows = 0
          const errors: DocumentImportResult['errors'] = []

          dataRows.forEach((row, index) => {
            const rowNumber = index + 2 // +2 because we start from 1 and skip header
            
            try {
              // Skip empty rows
              if (row.every(cell => !cell.trim())) {
                return
              }

              const sheetNumberIndex = headers.findIndex(h => h.includes('sheet') || h.includes('number'))
              const descriptionIndex = headers.findIndex(h => h.includes('description') || h.includes('title'))
              const disciplineIndex = headers.findIndex(h => h.includes('discipline') || h.includes('trade'))
              const categoryIndex = headers.findIndex(h => h.includes('category') || h.includes('type'))
              const dateIssuedIndex = headers.findIndex(h => h.includes('issued') || h.includes('date'))
              const dateReceivedIndex = headers.findIndex(h => h.includes('received') || h.includes('rec'))

              if (sheetNumberIndex === -1 || descriptionIndex === -1) {
                errors.push({
                  row: rowNumber,
                  field: 'required',
                  value: row.join(','),
                  message: 'Missing required fields: Sheet Number and Description are mandatory'
                })
                errorRows++
                return
              }

              const newDocument: Document = {
                id: `doc-${Date.now()}-${index}`,
                projectId,
                sheetNumber: row[sheetNumberIndex]?.trim() || '',
                description: row[descriptionIndex]?.trim() || '',
                discipline: (row[disciplineIndex]?.trim() as Document['discipline']) || 'Other',
                category: (row[categoryIndex]?.trim() as Document['category']) || 'Other',
                dateIssued: row[dateIssuedIndex]?.trim() || new Date().toISOString().split('T')[0],
                dateReceived: row[dateReceivedIndex]?.trim() || new Date().toISOString().split('T')[0],
                status: 'Current' as const,
                revision: row[headers.findIndex(h => h.includes('revision'))]?.trim() || '',
                phase: (row[headers.findIndex(h => h.includes('phase'))]?.trim() as Document['phase']) || 'BID',
                notes: row[headers.findIndex(h => h.includes('notes') || h.includes('comment'))]?.trim() || '',
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 'System Import'
              }

              setDocuments(prev => [...prev, newDocument])
              successfulRows++
            } catch (error) {
              errors.push({
                row: rowNumber,
                field: 'general',
                value: row.join(','),
                message: `Error processing row: ${error instanceof Error ? error.message : 'Unknown error'}`
              })
              errorRows++
            }
          })

          resolve({
            successfulRows,
            errorRows,
            totalRows: dataRows.length,
            errors
          })
        } catch (error) {
          resolve({
            successfulRows: 0,
            errorRows: 1,
            totalRows: 1,
            errors: [{ row: 1, field: 'file', value: file.name, message: 'Failed to parse file content' }]
          })
        } finally {
          setIsLoading(false)
        }
      }
      
      reader.onerror = () => {
        resolve({
          successfulRows: 0,
          errorRows: 1,
          totalRows: 1,
          errors: [{ row: 1, field: 'file', value: file.name, message: 'Failed to read file' }]
        })
        setIsLoading(false)
      }
      
      reader.readAsText(file)
    })
  }, [])

  const exportDocumentsToCSV = useCallback((projectId?: string) => {
    const docsToExport = projectId ? getDocumentsByProject(projectId) : documents
    
    if (docsToExport.length === 0) {
      console.log('No documents to export')
      return
    }

    const headers = [
      'Sheet Number', 'Description', 'Discipline', 'Category', 
      'Date Issued', 'Date Received', 'Revision', 'Phase', 
      'Status', 'Notes'
    ]
    
    const csvContent = [
      headers.join(','),
      ...docsToExport.map(doc => [
        doc.sheetNumber,
        `"${doc.description.replace(/"/g, '""')}"`,
        doc.discipline,
        doc.category,
        doc.dateIssued,
        doc.dateReceived,
        doc.revision || '',
        doc.phase || '',
        doc.status,
        `"${(doc.notes || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `document-log-${projectId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [documents, getDocumentsByProject])

  const generateDocumentTemplate = useCallback(() => {
    const templateHeaders = [
      'Sheet Number', 'Description', 'Discipline', 'Category', 
      'Date Issued', 'Date Received', 'Revision', 'Phase', 'Notes'
    ]
    
    const sampleData = [
      ['CVR', 'Cover Sheet', 'Architectural', 'Cover Sheet', '2025-01-24', '2025-02-20', '', 'BID', 'Project cover sheet'],
      ['A0.00', 'Sheet Index', 'Architectural', 'Other', '2025-01-24', '2025-02-20', '', 'BID', 'Drawing index'],
      ['A2.11', 'Level 00 - Life Safety Overall', 'Architectural', 'Plans', '2025-01-24', '2025-02-20', '', 'BID', 'Life safety plan for ground level']
    ]

    const csvContent = [
      templateHeaders.join(','),
      ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'document-log-template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  // Trade Partner Functions
  const addTradePartner = (tradePartner: Omit<TradePartner, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTradePartner: TradePartner = {
      ...tradePartner,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTradePartners(prev => [...prev, newTradePartner]);
  };

  const updateTradePartner = (id: string, updates: Partial<TradePartner>) => {
    setTradePartners(prev => 
      prev.map(tp => 
        tp.id === id 
          ? { ...tp, ...updates, updatedAt: new Date().toISOString() }
          : tp
      )
    );
  };

  const deleteTradePartner = (id: string) => {
    setTradePartners(prev => prev.filter(tp => tp.id !== id));
  };

  const getTradePartnersByProject = (projectId: string) => {
    return tradePartners.filter(tp => tp.projectId === projectId);
  };

  const getTradePartnersByDivision = (csiDivision: string) => {
    return tradePartners.filter(tp => tp.csiDivision === csiDivision);
  };

  const getTradePartnersByStatus = (status: TradePartner['status']) => {
    return tradePartners.filter(tp => tp.status === status);
  };

  const importTradePartnersFromFile = async (file: File): Promise<TradePartnerImportResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          
          const result: TradePartnerImportResult = {
            success: true,
            totalRows: lines.length - 1,
            successfulImports: 0,
            errors: [],
            duplicates: 0
          };

          const importedTradePartners: TradePartner[] = [];

          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const rowData: any = {};
            
            headers.forEach((header, index) => {
              const value = values[index] || '';
              
              switch (header.toLowerCase()) {
                case 'number':
                case 'no.':
                  rowData.number = parseInt(value) || i;
                  break;
                case 'csi div':
                case 'csi division':
                case 'division':
                  rowData.csiDivision = value;
                  break;
                case 'name':
                case 'contractor name':
                case 'contractor':
                  rowData.contractorName = value;
                  break;
                case 'status':
                  rowData.status = value.toLowerCase() === 'pending' ? 'pending' : 'selected';
                  break;
                case 'contract value':
                case 'value':
                  rowData.contractValue = parseFloat(value.replace(/[$,]/g, '')) || undefined;
                  break;
                default:
                  rowData[header] = value;
              }
            });

            // Basic validation
            if (!rowData.csiDivision || !rowData.contractorName) {
              result.errors.push({
                row: i + 1,
                field: !rowData.csiDivision ? 'csiDivision' : 'contractorName',
                message: 'Required field is missing'
              });
              continue;
            }

            // Check for duplicates
            const existingPartner = tradePartners.find(tp => 
              tp.csiDivision === rowData.csiDivision && 
              tp.contractorName === rowData.contractorName
            );

            if (existingPartner) {
              result.duplicates++;
              continue;
            }

            // Find CSI description
            const csiMatch = csiCodes.find(code => 
              code.csi_code === rowData.csiDivision
            );

            const newTradePartner: TradePartner = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              projectId: 'palm-beach-luxury-estate',
              number: rowData.number || (i),
              csiDivision: rowData.csiDivision,
              csiDescription: csiMatch?.csi_code_description || undefined,
              contractorName: rowData.contractorName,
              status: rowData.status || 'selected',
              contractValue: rowData.contractValue,
              notes: rowData.notes || undefined,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            importedTradePartners.push(newTradePartner);
            result.successfulImports++;
          }

          setTradePartners(prev => [...prev, ...importedTradePartners]);
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            totalRows: 0,
            successfulImports: 0,
            errors: [{ row: 0, field: 'file', message: 'Failed to parse file' }],
            duplicates: 0
          });
        }
      };
      reader.readAsText(file);
    });
  };

  const exportTradePartnersToCSV = (options: TradePartnerExportOptions) => {
    const filteredPartners = options.selectedOnly 
      ? tradePartners.filter(tp => tp.status === 'selected')
      : tradePartners;

    const headers = ['Number', 'CSI Division', 'CSI Description', 'Contractor Name', 'Status'];
    
    if (options.includeFinancials) {
      headers.push('Contract Value', 'Bid Date', 'Award Date');
    }
    
    if (options.includeContactInfo) {
      headers.push('Contact Name', 'Email', 'Phone', 'Address');
    }
    
    headers.push('Notes', 'Created At');

    const csvContent = [
      headers.join(','),
      ...filteredPartners.map(tp => {
        const row = [
          tp.number,
          `"${tp.csiDivision}"`,
          `"${tp.csiDescription || ''}"`,
          `"${tp.contractorName}"`,
          tp.status
        ];
        
        if (options.includeFinancials) {
          row.push(
            tp.contractValue ? `$${tp.contractValue.toLocaleString()}` : '',
            tp.bidDate || '',
            tp.awardDate || ''
          );
        }
        
        if (options.includeContactInfo) {
          row.push(
            tp.contactInfo?.primaryContact || '',
            tp.contactInfo?.email || '',
            tp.contactInfo?.phone || '',
            `"${tp.contactInfo?.address || ''}"`
          );
        }
        
        row.push(
          `"${tp.notes || ''}"`,
          new Date(tp.createdAt).toLocaleDateString()
        );
        
        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trade-partners-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateTradePartnerTemplate = () => {
    const headers = [
      'Number',
      'CSI Division',
      'Contractor Name',
      'Status',
      'Contract Value',
      'Contact Name',
      'Email',
      'Phone',
      'Notes'
    ];

    const sampleData = [
      [
        '1',
        '02 21 00',
        'Sample Surveying Co.',
        'selected',
        '15000',
        'John Smith',
        'john@samplesurvey.com',
        '555-0123',
        'Primary surveyor for site work'
      ]
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trade-partners-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Allowance Functions
  const addAllowance = (allowance: Omit<Allowance, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAllowance: Allowance = {
      ...allowance,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAllowances(prev => [...prev, newAllowance]);
  };

  const updateAllowance = (id: string, updates: Partial<Allowance>) => {
    setAllowances(prev => 
      prev.map(allowance => 
        allowance.id === id 
          ? { ...allowance, ...updates, updatedAt: new Date().toISOString() }
          : allowance
      )
    );
  };

  const deleteAllowance = (id: string) => {
    setAllowances(prev => prev.filter(allowance => allowance.id !== id));
  };

  const getAllowancesByProject = (projectId: string) => {
    return allowances.filter(allowance => allowance.projectId === projectId);
  };

  const getAllowancesByDivision = (csiDivision: string) => {
    return allowances.filter(allowance => allowance.csiDivision === csiDivision);
  };

  const getAllowancesByCategory = (category: Allowance['category']) => {
    return allowances.filter(allowance => allowance.category === category);
  };

  const getAllowancesSummary = (projectId?: string): AllowanceSummary => {
    const filteredAllowances = projectId 
      ? allowances.filter(a => a.projectId === projectId)
      : allowances;

    const activeAllowances = filteredAllowances.filter(a => a.status === 'active');
    
    const totalValue = filteredAllowances.reduce((sum, a) => sum + a.value, 0);
    const activeValue = activeAllowances.reduce((sum, a) => sum + a.value, 0);
    
    const categoryBreakdown: Record<string, { count: number; value: number }> = {};
    const csiBreakdown: Record<string, { count: number; value: number }> = {};

    filteredAllowances.forEach(allowance => {
      // Category breakdown
      const category = allowance.category || 'other';
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { count: 0, value: 0 };
      }
      categoryBreakdown[category].count++;
      categoryBreakdown[category].value += allowance.value;

      // CSI breakdown
      const csiMajor = allowance.csiDivision.substring(0, 2);
      if (!csiBreakdown[csiMajor]) {
        csiBreakdown[csiMajor] = { count: 0, value: 0 };
      }
      csiBreakdown[csiMajor].count++;
      csiBreakdown[csiMajor].value += allowance.value;
    });

    return {
      totalAllowances: filteredAllowances.length,
      activeAllowances: activeAllowances.length,
      totalValue,
      activeValue,
      averageValue: filteredAllowances.length > 0 ? totalValue / filteredAllowances.length : 0,
      categoryBreakdown,
      csiBreakdown
    };
  };

  const importAllowancesFromFile = async (file: File): Promise<AllowanceImportResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          
          const result: AllowanceImportResult = {
            success: true,
            totalRows: lines.length - 1,
            successfulImports: 0,
            errors: [],
            duplicates: 0
          };

          const importedAllowances: Allowance[] = [];

          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const rowData: any = {};
            
            headers.forEach((header, index) => {
              const value = values[index] || '';
              
              switch (header.toLowerCase()) {
                case 'number':
                case 'no.':
                  rowData.number = parseInt(value) || i;
                  break;
                case 'csi div':
                case 'csi division':
                case 'division':
                  rowData.csiDivision = value;
                  break;
                case 'description':
                  rowData.description = value;
                  break;
                case 'value':
                case 'amount':
                  rowData.value = parseFloat(value.replace(/[$,]/g, '')) || 0;
                  break;
                case 'notes':
                case 'comments':
                  rowData.notes = value;
                  break;
                case 'status':
                  rowData.status = ['active', 'inactive', 'pending'].includes(value.toLowerCase()) 
                    ? value.toLowerCase() : 'active';
                  break;
                case 'category':
                  rowData.category = value.toLowerCase();
                  break;
                default:
                  rowData[header] = value;
              }
            });

            // Basic validation
            if (!rowData.csiDivision || !rowData.description) {
              result.errors.push({
                row: i + 1,
                field: !rowData.csiDivision ? 'csiDivision' : 'description',
                message: 'Required field is missing'
              });
              continue;
            }

            // Check for duplicates
            const existingAllowance = allowances.find(a => 
              a.csiDivision === rowData.csiDivision && 
              a.description === rowData.description
            );

            if (existingAllowance) {
              result.duplicates++;
              continue;
            }

            // Find CSI description
            const csiMatch = csiCodes.find(code => 
              code.csi_code === rowData.csiDivision
            );

            // Determine category from CSI division
            const determineCategory = (csi: string): Allowance['category'] => {
              const majorGroup = csi.substring(0, 2);
              switch (majorGroup) {
                case '03': return 'structural';
                case '04': return 'structural';
                case '05': return 'structural';
                case '06': return 'architectural';
                case '07': return 'architectural';
                case '08': return 'architectural';
                case '09': return 'finishes';
                case '10': return 'specialties';
                case '11': return 'specialties';
                case '12': return 'finishes';
                case '13': return 'specialties';
                case '14': return 'specialties';
                case '21': return 'mechanical';
                case '22': return 'plumbing';
                case '23': return 'mechanical';
                case '26': return 'electrical';
                case '27': return 'electrical';
                case '28': return 'electrical';
                case '31': return 'sitework';
                case '32': return 'sitework';
                case '33': return 'sitework';
                default: return 'other';
              }
            };

            const newAllowance: Allowance = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              projectId: 'palm-beach-luxury-estate',
              number: rowData.number || (i),
              csiDivision: rowData.csiDivision,
              csiDescription: csiMatch?.csi_code_description || undefined,
              description: rowData.description,
              value: rowData.value || 0,
              notes: rowData.notes || undefined,
              status: rowData.status || 'active',
              category: rowData.category || determineCategory(rowData.csiDivision),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            importedAllowances.push(newAllowance);
            result.successfulImports++;
          }

          setAllowances(prev => [...prev, ...importedAllowances]);
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            totalRows: 0,
            successfulImports: 0,
            errors: [{ row: 0, field: 'file', message: 'Failed to parse file' }],
            duplicates: 0
          });
        }
      };
      reader.readAsText(file);
    });
  };

  const exportAllowancesToCSV = (options: AllowanceExportOptions) => {
    const filteredAllowances = options.selectedOnly 
      ? allowances.filter(a => a.status === 'active')
      : options.includeInactive 
        ? allowances 
        : allowances.filter(a => a.status !== 'inactive');

    const headers = ['Number', 'CSI Division', 'CSI Description', 'Description', 'Value', 'Status', 'Category'];
    
    if (options.includeNotes) {
      headers.push('Notes');
    }
    
    headers.push('Created At', 'Updated At');

    const csvContent = [
      headers.join(','),
      ...filteredAllowances.map(allowance => {
        const row = [
          allowance.number,
          `"${allowance.csiDivision}"`,
          `"${allowance.csiDescription || ''}"`,
          `"${allowance.description}"`,
          allowance.value,
          allowance.status,
          allowance.category || 'other'
        ];
        
        if (options.includeNotes) {
          row.push(`"${allowance.notes || ''}"`);
        }
        
        row.push(
          new Date(allowance.createdAt).toLocaleDateString(),
          new Date(allowance.updatedAt).toLocaleDateString()
        );
        
        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `allowances-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateAllowanceTemplate = () => {
    const headers = [
      'Number',
      'CSI Division',
      'Description',
      'Value',
      'Status',
      'Category',
      'Notes'
    ];

    const sampleData = [
      [
        '1',
        '03 30 00',
        'Additional Reinforcing Steel Allowance',
        '25000',
        'active',
        'structural',
        'Contractor shall include cost for additional reinforcing steel as directed'
      ]
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'allowances-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // GC & GR
  const addGCGRItem = (item: Omit<GCGRItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: GCGRItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setGcgrItems(prev => [...prev, newItem]);
  };

  const updateGCGRItem = (id: string, updates: Partial<GCGRItem>) => {
    setGcgrItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteGCGRItem = (id: string) => {
    setGcgrItems(prev => prev.filter(item => item.id !== id));
  };

  const getGCGRItemsByProject = (projectId: string) => {
    return gcgrItems.filter(item => item.projectId === projectId);
  };

  const getGCGRSummary = (projectId?: string): GCGRSummary => {
    const items = projectId ? getGCGRItemsByProject(projectId) : gcgrItems;
    
    const totalItems = items.length;
    const includedItems = items.filter(item => item.isIncluded).length;
    const totalCost = items.reduce((sum, item) => sum + item.totalCost, 0);
    const includedCost = items.filter(item => item.isIncluded).reduce((sum, item) => sum + item.totalCost, 0);
    const averageCost = totalItems > 0 ? totalCost / totalItems : 0;
    
    const laborCost = items.reduce((sum, item) => sum + (item.customLaborRate || 0), 0);
    const fieldOfficeCost = items.reduce((sum, item) => sum + (item.percentTime || 0), 0);
    const otherCost = totalCost - laborCost - fieldOfficeCost;
    
    const constructionDuration = {
      days: Math.round(totalItems / fieldOfficeCost * 30),
      weeks: Math.round(totalItems / fieldOfficeCost * 4),
      months: Math.round(totalItems / fieldOfficeCost / 30)
    };
    
    const closeOutDuration = {
      days: Math.round(totalItems / fieldOfficeCost * 30),
      weeks: Math.round(totalItems / fieldOfficeCost * 4),
      months: Math.round(totalItems / fieldOfficeCost / 30)
    };
    
    return {
      totalItems,
      includedItems,
      totalCost,
      includedCost,
      averageCost,
      categoryBreakdown: items.reduce((acc, item) => {
        const category = item.category || 'other';
        if (!acc[category]) acc[category] = { count: 0, cost: 0 };
        acc[category].count++;
        acc[category].cost += item.totalCost;
        return acc;
      }, {} as Record<string, { count: number; cost: number }>),
      laborCost,
      fieldOfficeCost,
      otherCost,
      constructionDuration,
      closeOutDuration
    };
  };

  const importGCGRFromFile = async (file: File): Promise<GCGRImportResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          
          const result: GCGRImportResult = {
            success: true,
            totalRows: lines.length - 1,
            successfulImports: 0,
            errors: [],
            duplicates: 0
          };

          const importedItems: GCGRItem[] = [];

          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const rowData: any = {};
            
            headers.forEach((header, index) => {
              const value = values[index] || '';
              
              switch (header.toLowerCase()) {
                case 'category':
                  rowData.category = value;
                  break;
                case 'description':
                  rowData.description = value;
                  break;
                case 'position':
                  rowData.position = value;
                  break;
                case 'qty':
                  rowData.qty = parseFloat(value);
                  break;
                case 'unit of measure':
                  rowData.unitOfMeasure = value;
                  break;
                case 'unit cost':
                  rowData.unitCost = parseFloat(value);
                  break;
                case 'total cost':
                  rowData.totalCost = parseFloat(value);
                  break;
                case 'percent time':
                  rowData.percentTime = parseFloat(value);
                  break;
                case 'custom labor rate':
                  rowData.customLaborRate = parseFloat(value);
                  break;
                case 'flsa overtime':
                  rowData.flsaOvertime = parseFloat(value);
                  break;
                case 'remarks':
                  rowData.remarks = value;
                  break;
                case 'is included':
                  rowData.isIncluded = value.toLowerCase() === 'true';
                  break;
                default:
                  rowData[header] = value;
              }
            });

            // Basic validation
            if (!rowData.category || !rowData.description) {
              result.errors.push({
                row: i + 1,
                field: !rowData.category ? 'category' : 'description',
                message: 'Required field is missing'
              });
              continue;
            }

            // Check for duplicates
            const existingItem = gcgrItems.find(item => 
              item.category === rowData.category && 
              item.description === rowData.description &&
              item.position === rowData.position
            );

            if (existingItem) {
              result.duplicates++;
              continue;
            }

            const newItem: GCGRItem = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              projectId: 'palm-beach-luxury-estate',
              category: rowData.category,
              description: rowData.description,
              position: rowData.position,
              qty: rowData.qty,
              unitOfMeasure: rowData.unitOfMeasure,
              unitCost: rowData.unitCost,
              totalCost: rowData.totalCost,
              percentTime: rowData.percentTime,
              customLaborRate: rowData.customLaborRate,
              flsaOvertime: rowData.flsaOvertime,
              remarks: rowData.remarks,
              isIncluded: rowData.isIncluded,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            importedItems.push(newItem);
            result.successfulImports++;
          }

          setGcgrItems(prev => [...prev, ...importedItems]);
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            totalRows: 0,
            successfulImports: 0,
            errors: [{ row: 0, field: 'file', message: 'Failed to parse file' }],
            duplicates: 0
          });
        }
      };
      reader.readAsText(file);
    });
  };

  const exportGCGRToCSV = (options: GCGRExportOptions) => {
    const headers = [
      'Category',
      'Description',
      'Position',
      'Qty',
      'Unit of Measure',
      'Unit Cost',
      'Total Cost',
      'Is Included',
      'Remarks'
    ];
    
    if (options.includeRemarks) {
      headers.push('Remarks');
    }
    
    const rows: string[] = [];
    
    gcgrItems.forEach(item => {
      if (options.selectedOnly && !item.isIncluded) return;
      
      const row = [
        `"${item.category}"`,
        `"${item.description}"`,
        `"${item.position || ''}"`,
        item.qty,
        `"${item.unitOfMeasure}"`,
        item.unitCost,
        item.totalCost,
        item.isIncluded,
        `"${item.remarks || ''}"`
      ];
      
      if (options.includeRemarks) {
        row.push(`"${item.remarks || ''}"`);
      }
      
      rows.push(row.join(','));
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gc-gr-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateGCGRTemplate = () => {
    const headers = [
      'Category',
      'Description',
      'Position',
      'Qty',
      'Unit of Measure',
      'Unit Cost',
      'Total Cost',
      'Is Included',
      'Remarks'
    ];

    const sampleData = [
      [
        'Concrete',
        '03 30 00',
        'ABC Concrete',
        '485000',
        'LS',
        '1500.00',
        'true',
        'Materials, Labor, Equipment, Cleanup'
      ],
      [
        'Plumbing',
        '22 00 00',
        'Pro Plumbing',
        '320000',
        'LS',
        '2500.00',
        'true',
        'Materials, Labor, Permits, Testing'
      ]
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gc-gr-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Bid Leveling Functions
  const [tradeBids, setTradeBids] = useState<TradeBids[]>([]);
  const [bidComparisons, setBidComparisons] = useState<BidComparison[]>([]);
  const [bidLevelingNotes, setBidLevelingNotes] = useState<string>('');

  const addTradeBids = (tradeData: Omit<TradeBids, 'createdAt' | 'updatedAt'>) => {
    const newTrade: TradeBids = {
      ...tradeData,
      tradeId: tradeData.tradeId || Date.now().toString(),
      bids: [],
      variance: 0,
      averageBid: 0,
      lowestBid: 0,
      highestBid: 0,
      biddingStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTradeBids(prev => [...prev, newTrade]);
  };

  const updateTradeBids = (id: string, updates: Partial<TradeBids>) => {
    setTradeBids(prev => 
      prev.map(trade => {
        if (trade.tradeId === id) {
          const updated = { ...trade, ...updates, updatedAt: new Date().toISOString() };
          
          // Recalculate statistics if bids changed
          if (updated.bids.length > 0) {
            const amounts = updated.bids.map(bid => bid.amount);
            updated.averageBid = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
            updated.lowestBid = Math.min(...amounts);
            updated.highestBid = Math.max(...amounts);
            updated.variance = amounts.length > 1 
              ? ((updated.highestBid - updated.lowestBid) / updated.lowestBid) * 100 
              : 0;
          }
          
          return updated;
        }
        return trade;
      })
    );
  };

  const deleteTradeBids = (id: string) => {
    setTradeBids(prev => prev.filter(trade => trade.tradeId !== id));
  };

  const addBidToTrade = (tradeId: string, bidData: Omit<Bid, 'id'>) => {
    const newBid: Bid = {
      ...bidData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    };

    setTradeBids(prev => 
      prev.map(trade => {
        if (trade.tradeId === tradeId) {
          const updatedBids = [...trade.bids, newBid];
          const amounts = updatedBids.map(bid => bid.amount);
          
          return {
            ...trade,
            bids: updatedBids,
            averageBid: amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length,
            lowestBid: Math.min(...amounts),
            highestBid: Math.max(...amounts),
            variance: amounts.length > 1 
              ? ((Math.max(...amounts) - Math.min(...amounts)) / Math.min(...amounts)) * 100 
              : 0,
            updatedAt: new Date().toISOString()
          };
        }
        return trade;
      })
    );
  };

  const updateTradeBid = (tradeId: string, bidId: string, updates: Partial<Bid>) => {
    setTradeBids(prev => 
      prev.map(trade => {
        if (trade.tradeId === tradeId) {
          const updatedBids = trade.bids.map(bid => 
            bid.id === bidId ? { ...bid, ...updates } : bid
          );
          
          const amounts = updatedBids.map(bid => bid.amount);
          
          return {
            ...trade,
            bids: updatedBids,
            averageBid: amounts.length > 0 ? amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length : 0,
            lowestBid: amounts.length > 0 ? Math.min(...amounts) : 0,
            highestBid: amounts.length > 0 ? Math.max(...amounts) : 0,
            variance: amounts.length > 1 
              ? ((Math.max(...amounts) - Math.min(...amounts)) / Math.min(...amounts)) * 100 
              : 0,
            updatedAt: new Date().toISOString()
          };
        }
        return trade;
      })
    );
  };

  const deleteTradeBid = (tradeId: string, bidId: string) => {
    setTradeBids(prev => 
      prev.map(trade => {
        if (trade.tradeId === tradeId) {
          const updatedBids = trade.bids.filter(bid => bid.id !== bidId);
          const amounts = updatedBids.map(bid => bid.amount);
          
          return {
            ...trade,
            bids: updatedBids,
            selectedBid: trade.selectedBid === bidId ? undefined : trade.selectedBid,
            averageBid: amounts.length > 0 ? amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length : 0,
            lowestBid: amounts.length > 0 ? Math.min(...amounts) : 0,
            highestBid: amounts.length > 0 ? Math.max(...amounts) : 0,
            variance: amounts.length > 1 
              ? ((Math.max(...amounts) - Math.min(...amounts)) / Math.min(...amounts)) * 100 
              : 0,
            updatedAt: new Date().toISOString()
          };
        }
        return trade;
      })
    );
  };

  const selectTradeBid = (tradeId: string, bidId: string) => {
    setTradeBids(prev => 
      prev.map(trade => {
        if (trade.tradeId === tradeId) {
          const updatedBids = trade.bids.map(bid => ({
            ...bid,
            status: bid.id === bidId ? 'selected' as const : 
                   bid.status === 'selected' ? 'reviewed' as const : bid.status
          }));
          
          return {
            ...trade,
            bids: updatedBids,
            selectedBid: bidId,
            biddingStatus: 'awarded',
            updatedAt: new Date().toISOString()
          };
        }
        return trade;
      })
    );
  };

  const getBidLevelingSummary = (): BidLevelingSummary => {
    const totalTrades = tradeBids.length;
    const totalBids = tradeBids.reduce((sum, trade) => sum + trade.bids.length, 0);
    const selectedBids = tradeBids.filter(trade => trade.selectedBid).length;
    const pendingReviews = tradeBids.filter(trade => 
      trade.bids.some(bid => bid.status === 'received')
    ).length;

    const totalValue = tradeBids.reduce((sum, trade) => 
      sum + trade.bids.reduce((bidSum, bid) => bidSum + bid.amount, 0), 0
    );
    
    const selectedValue = tradeBids.reduce((sum, trade) => {
      const selectedBid = trade.bids.find(bid => bid.id === trade.selectedBid);
      return sum + (selectedBid?.amount || 0);
    }, 0);

    const averageBidsPerTrade = totalTrades > 0 ? totalBids / totalTrades : 0;

    const riskBreakdown: Record<string, number> = {};
    const statusBreakdown: Record<string, number> = {};
    const varianceAnalysis = { highVariance: 0, mediumVariance: 0, lowVariance: 0 };

    tradeBids.forEach(trade => {
      // Risk breakdown
      riskBreakdown[trade.riskLevel] = (riskBreakdown[trade.riskLevel] || 0) + 1;
      
      // Status breakdown
      statusBreakdown[trade.biddingStatus] = (statusBreakdown[trade.biddingStatus] || 0) + 1;
      
      // Variance analysis
      if (trade.variance > 30) varianceAnalysis.highVariance++;
      else if (trade.variance > 15) varianceAnalysis.mediumVariance++;
      else varianceAnalysis.lowVariance++;
    });

    return {
      totalTrades,
      totalBids,
      selectedBids,
      pendingReviews,
      totalValue,
      selectedValue,
      averageBidsPerTrade,
      riskBreakdown,
      statusBreakdown,
      varianceAnalysis
    };
  };

  const createBidComparison = (comparisonData: Omit<BidComparison, 'totalScores' | 'recommendation'>) => {
    // Calculate total scores based on criteria and weights
    const totalScores: Record<string, number> = {};
    
    comparisonData.bidIds.forEach(bidId => {
      totalScores[bidId] = comparisonData.criteria.reduce((score, criterion) => {
        return score + (criterion.scores[bidId] || 0) * criterion.weight;
      }, 0);
    });

    // Generate recommendation based on highest score
    const highestScoreBid = Object.entries(totalScores).reduce((best, [bidId, score]) => 
      score > best.score ? { bidId, score } : best, 
      { bidId: '', score: -1 }
    );

    const newComparison: BidComparison = {
      ...comparisonData,
      totalScores,
      recommendation: `Recommended: Bid ${highestScoreBid.bidId} with score ${highestScoreBid.score.toFixed(1)}`
    };

    setBidComparisons(prev => [...prev, newComparison]);
  };

  const importBidLevelingFromFile = async (file: File): Promise<BidLevelingImportResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          
          const result: BidLevelingImportResult = {
            success: true,
            totalRows: lines.length - 1,
            successfulImports: 0,
            errors: [],
            duplicates: 0
          };

          // Implementation similar to other import functions
          // This would parse CSV data and create TradeBids entries
          
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            totalRows: 0,
            successfulImports: 0,
            errors: [{ row: 0, field: 'file', message: 'Failed to parse file' }],
            duplicates: 0
          });
        }
      };
      reader.readAsText(file);
    });
  };

  const exportBidLevelingToCSV = (options: BidLevelingExportOptions) => {
    const headers = [
      'Trade ID',
      'Trade Name',
      'CSI Division',
      'Vendor',
      'Bid Amount',
      'Status',
      'Confidence',
      'Variance %',
      'Risk Level',
      'Bidding Status'
    ];
    
    if (options.includeNotes) {
      headers.push('Notes');
    }
    
    if (options.includeAIRecommendations) {
      headers.push('AI Recommendation');
    }

    const rows: string[] = [];
    
    tradeBids.forEach(trade => {
      if (options.selectedOnly && !trade.selectedBid) return;
      
      trade.bids.forEach(bid => {
        if (options.selectedOnly && bid.id !== trade.selectedBid) return;
        
        const row = [
          `"${trade.tradeId}"`,
          `"${trade.tradeName}"`,
          `"${trade.csiDivision || ''}"`,
          `"${bid.vendor}"`,
          bid.amount,
          `"${bid.status}"`,
          bid.confidence,
          trade.variance.toFixed(1),
          `"${trade.riskLevel}"`,
          `"${trade.biddingStatus}"`
        ];
        
        if (options.includeNotes) {
          row.push(`"${bid.notes || ''}"`);
        }
        
        if (options.includeAIRecommendations) {
          row.push(`"${trade.aiRecommendation || ''}"`);
        }
        
        rows.push(row.join(','));
      });
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bid-leveling-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateBidLevelingTemplate = () => {
    const headers = [
      'Trade ID',
      'Trade Name',
      'CSI Division',
      'Vendor',
      'Bid Amount',
      'Confidence',
      'Inclusions',
      'Exclusions',
      'Notes',
      'Risk Level'
    ];

    const sampleData = [
      [
        'concrete',
        'Concrete',
        '03 30 00',
        'ABC Concrete',
        '485000',
        '95',
        'Materials, Labor, Equipment, Cleanup',
        'Permits, Site prep',
        'Reliable contractor with good track record',
        'low'
      ],
      [
        'plumbing',
        'Plumbing',
        '22 00 00',
        'Pro Plumbing',
        '320000',
        '92',
        'Materials, Labor, Permits, Testing',
        'Fixtures above standard grade',
        'Premium service provider',
        'medium'
      ]
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bid-leveling-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateBidLevelingNotes = (notes: string) => {
    setBidLevelingNotes(notes);
  };

  // Bid Tab Functions
  const [bidTabs, setBidTabs] = useState<BidTab[]>([]);
  const [bidTabTemplates, setBidTabTemplates] = useState<BidTabTemplate[]>([]);

  const addBidTab = (bidTabData: Omit<BidTab, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBidTab: BidTab = {
      ...bidTabData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      items: [],
      vendors: [],
      subtotal: 0,
      bondRate: 0,
      bondAmount: 0,
      adjustedTotal: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setBidTabs(prev => [...prev, newBidTab]);
  };

  const updateBidTab = (id: string, updates: Partial<BidTab>) => {
    setBidTabs(prev => 
      prev.map(tab => {
        if (tab.id === id) {
          const updated = { ...tab, ...updates, updatedAt: new Date().toISOString() };
          
          // Recalculate totals if items or bond rate changed
          if (updates.items || updates.bondRate) {
            const subtotal = updated.items.reduce((sum, item) => sum + (item.isIncluded ? item.subtotal : 0), 0);
            updated.subtotal = subtotal;
            updated.bondAmount = subtotal * (updated.bondRate / 100);
            updated.adjustedTotal = subtotal + updated.bondAmount;
            
            if (updated.squareFootage && updated.squareFootage > 0) {
              updated.costPerSF = updated.adjustedTotal / updated.squareFootage;
            }
          }
          
          return updated;
        }
        return tab;
      })
    );
  };

  const deleteBidTab = (id: string) => {
    setBidTabs(prev => prev.filter(tab => tab.id !== id));
  };

  const duplicateBidTab = (id: string) => {
    const originalTab = bidTabs.find(tab => tab.id === id);
    if (!originalTab) return;

    const duplicatedTab: BidTab = {
      ...originalTab,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      tradeName: `${originalTab.tradeName} (Copy)`,
      items: originalTab.items.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })),
      vendors: [], // Don't copy vendors
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBidTabs(prev => [...prev, duplicatedTab]);
  };

  const addBidTabItem = (tabId: string, itemData: Omit<BidTabItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: BidTabItem = {
      ...itemData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      subtotal: itemData.quantity * itemData.unitCost,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBidTabs(prev => 
      prev.map(tab => {
        if (tab.id === tabId) {
          const updatedItems = [...tab.items, newItem];
          const subtotal = updatedItems.reduce((sum, item) => sum + (item.isIncluded ? item.subtotal : 0), 0);
          const bondAmount = subtotal * (tab.bondRate / 100);
          const adjustedTotal = subtotal + bondAmount;

          return {
            ...tab,
            items: updatedItems,
            subtotal,
            bondAmount,
            adjustedTotal,
            costPerSF: tab.squareFootage ? adjustedTotal / tab.squareFootage : undefined,
            updatedAt: new Date().toISOString()
          };
        }
        return tab;
      })
    );
  };

  const updateBidTabItem = (tabId: string, itemId: string, updates: Partial<BidTabItem>) => {
    setBidTabs(prev => 
      prev.map(tab => {
        if (tab.id === tabId) {
          const updatedItems = tab.items.map(item => {
            if (item.id === itemId) {
              const updated = { ...item, ...updates, updatedAt: new Date().toISOString() };
              
              // Recalculate subtotal if quantity or unit cost changed
              if (updates.quantity !== undefined || updates.unitCost !== undefined) {
                updated.subtotal = updated.quantity * updated.unitCost;
              }
              
              return updated;
            }
            return item;
          });

          const subtotal = updatedItems.reduce((sum, item) => sum + (item.isIncluded ? item.subtotal : 0), 0);
          const bondAmount = subtotal * (tab.bondRate / 100);
          const adjustedTotal = subtotal + bondAmount;

          return {
            ...tab,
            items: updatedItems,
            subtotal,
            bondAmount,
            adjustedTotal,
            costPerSF: tab.squareFootage ? adjustedTotal / tab.squareFootage : undefined,
            updatedAt: new Date().toISOString()
          };
        }
        return tab;
      })
    );
  };

  const deleteBidTabItem = (tabId: string, itemId: string) => {
    setBidTabs(prev => 
      prev.map(tab => {
        if (tab.id === tabId) {
          const updatedItems = tab.items.filter(item => item.id !== itemId);
          const subtotal = updatedItems.reduce((sum, item) => sum + (item.isIncluded ? item.subtotal : 0), 0);
          const bondAmount = subtotal * (tab.bondRate / 100);
          const adjustedTotal = subtotal + bondAmount;

          return {
            ...tab,
            items: updatedItems,
            subtotal,
            bondAmount,
            adjustedTotal,
            costPerSF: tab.squareFootage ? adjustedTotal / tab.squareFootage : undefined,
            updatedAt: new Date().toISOString()
          };
        }
        return tab;
      })
    );
  };

  const addVendorBid = (tabId: string, vendorData: Omit<VendorBid, 'id'>) => {
    const newVendor: VendorBid = {
      ...vendorData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    };

    setBidTabs(prev => 
      prev.map(tab => {
        if (tab.id === tabId) {
          // If this is the first vendor or they're marked as winner, make them winner
          const updatedVendors = tab.vendors.map(v => ({ ...v, isWinner: false }));
          if (newVendor.isWinner || tab.vendors.length === 0) {
            newVendor.isWinner = true;
          }

          return {
            ...tab,
            vendors: [...updatedVendors, newVendor],
            updatedAt: new Date().toISOString()
          };
        }
        return tab;
      })
    );
  };

  const updateVendorBid = (tabId: string, vendorId: string, updates: Partial<VendorBid>) => {
    setBidTabs(prev => 
      prev.map(tab => {
        if (tab.id === tabId) {
          const updatedVendors = tab.vendors.map(vendor => {
            if (vendor.id === vendorId) {
              const updated = { ...vendor, ...updates };
              
              // Recalculate adjusted total if total bid or bond rate changed
              if (updates.totalBid !== undefined || updates.bondRate !== undefined) {
                updated.bondAmount = updated.totalBid * (updated.bondRate / 100);
                updated.adjustedTotal = updated.totalBid + updated.bondAmount;
              }
              
              return updated;
            }
            return vendor;
          });

          return {
            ...tab,
            vendors: updatedVendors,
            updatedAt: new Date().toISOString()
          };
        }
        return tab;
      })
    );
  };

  const deleteVendorBid = (tabId: string, vendorId: string) => {
    setBidTabs(prev => 
      prev.map(tab => {
        if (tab.id === tabId) {
          const updatedVendors = tab.vendors.filter(vendor => vendor.id !== vendorId);
          
          // If we deleted the winner, make the first remaining vendor the winner
          if (updatedVendors.length > 0 && !updatedVendors.some(v => v.isWinner)) {
            updatedVendors[0].isWinner = true;
          }

          return {
            ...tab,
            vendors: updatedVendors,
            updatedAt: new Date().toISOString()
          };
        }
        return tab;
      })
    );
  };

  const selectWinningBid = (tabId: string, vendorId: string) => {
    setBidTabs(prev => 
      prev.map(tab => {
        if (tab.id === tabId) {
          const updatedVendors = tab.vendors.map(vendor => ({
            ...vendor,
            isWinner: vendor.id === vendorId
          }));

          return {
            ...tab,
            vendors: updatedVendors,
            updatedAt: new Date().toISOString()
          };
        }
        return tab;
      })
    );
  };

  const getBidTabSummary = (): BidTabSummary => {
    const totalTabs = bidTabs.length;
    const activeTabs = bidTabs.filter(tab => tab.isActive).length;
    const totalValue = bidTabs.reduce((sum, tab) => sum + tab.adjustedTotal, 0);
    const averageTabValue = totalTabs > 0 ? totalValue / totalTabs : 0;
    const tabsWithVendors = bidTabs.filter(tab => tab.vendors.length > 0).length;
    const totalVendors = bidTabs.reduce((sum, tab) => sum + tab.vendors.length, 0);
    const completedTabs = bidTabs.filter(tab => tab.items.length > 0 && tab.vendors.length > 0).length;

    const csiDivisionBreakdown: Record<string, number> = {};
    const valueByDivision: Record<string, number> = {};

    bidTabs.forEach(tab => {
      const division = tab.csiCode.substring(0, 2);
      csiDivisionBreakdown[division] = (csiDivisionBreakdown[division] || 0) + 1;
      valueByDivision[division] = (valueByDivision[division] || 0) + tab.adjustedTotal;
    });

    return {
      totalTabs,
      activeTabs,
      totalValue,
      averageTabValue,
      tabsWithVendors,
      totalVendors,
      completedTabs,
      csiDivisionBreakdown,
      valueByDivision
    };
  };

  const getBidTabsByCSI = (csiCode: string): BidTab[] => {
    return bidTabs.filter(tab => tab.csiCode.startsWith(csiCode));
  };

  const createBidTabFromTemplate = (templateId: string, projectId: string) => {
    const template = bidTabTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newBidTab: BidTab = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      projectId,
      tradeName: template.name,
      csiCode: template.csiCode,
      csiDescription: template.description,
      isActive: true,
      items: template.defaultItems.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        subtotal: item.quantity * item.unitCost,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })),
      vendors: [],
      generalInclusions: [...template.defaultInclusions],
      scopeRequirements: [...template.defaultScopeRequirements],
      subtotal: 0,
      bondRate: 0,
      bondAmount: 0,
      adjustedTotal: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User'
    };

    // Calculate totals
    const subtotal = newBidTab.items.reduce((sum, item) => sum + (item.isIncluded ? item.subtotal : 0), 0);
    newBidTab.subtotal = subtotal;
    newBidTab.adjustedTotal = subtotal;

    setBidTabs(prev => [...prev, newBidTab]);
  };

  const importBidTabsFromFile = async (file: File): Promise<BidTabImportResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          
          const result: BidTabImportResult = {
            success: true,
            totalRows: lines.length - 1,
            successfulImports: 0,
            errors: [],
            duplicates: 0
          };

          // Implementation would parse CSV data and create BidTab entries
          
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            totalRows: 0,
            successfulImports: 0,
            errors: [{ row: 0, field: 'file', message: 'Failed to parse file' }],
            duplicates: 0
          });
        }
      };
      reader.readAsText(file);
    });
  };

  const exportBidTabsToCSV = (options: BidTabExportOptions) => {
    const headers = [
      'Trade Name',
      'CSI Code',
      'CSI Description',
      'Subtotal',
      'Bond Rate',
      'Bond Amount',
      'Adjusted Total',
      'Active',
      'Item Count',
      'Vendor Count'
    ];

    const rows: string[] = [];
    
    bidTabs.forEach(tab => {
      const row = [
        `"${tab.tradeName}"`,
        `"${tab.csiCode}"`,
        `"${tab.csiDescription}"`,
        tab.subtotal,
        tab.bondRate,
        tab.bondAmount,
        tab.adjustedTotal,
        tab.isActive,
        tab.items.length,
        tab.vendors.length
      ];
      
      rows.push(row.join(','));
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bid-tabs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateBidTabTemplate = () => {
    const headers = [
      'Trade Name',
      'CSI Code',
      'CSI Description',
      'Category',
      'Item Description',
      'Quantity',
      'Unit of Measure',
      'Unit Cost',
      'Is Included',
      'Notes'
    ];

    const sampleData = [
      [
        'Surveying',
        '02 21 00',
        'Surveys',
        'Site Surveys',
        'Set up digital files',
        '1',
        'LS',
        '1500.00',
        'true',
        'Initial setup and calibration'
      ],
      [
        'Surveying',
        '02 21 00',
        'Surveys',
        'Site Surveys',
        'Topographic survey',
        '1',
        'LS',
        '2500.00',
        'true',
        'Complete site topography'
      ]
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bid-tab-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

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
    clarifications,
    rfis,
    documents,
    tradePartners,
    csiCodes,
    allowances,
    gcgrItems,
    projectPhases,
    
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
    deleteBidData,
    selectBidData,
    
    // Clarification actions
    addClarification,
    updateClarification,
    deleteClarification,
    getClarificationsByProject,
    getClarificationsByType,
    
    // RFI actions
    addRFI,
    updateRFI,
    deleteRFI,
    getRFIsByProject,
    getRFIsByStatus,
    getRFIsByAssignee,
    distributeRFI,
    generateRFINumber,
    
    // Document actions
    addDocument,
    updateDocument,
    deleteDocument,
    getDocumentsByProject,
    getDocumentsByDiscipline,
    getDocumentsByCategory,
    importDocumentsFromFile,
    exportDocumentsToCSV,
    generateDocumentTemplate,
    
    // Utility functions
    getProjectEstimates,
    getEstimatesByStatus,
    calculateProjectMetrics,
    
    // Export functions
    exportEstimateData,
    exportProjectSummary,
    
    // Trade Partners
    addTradePartner,
    updateTradePartner,
    deleteTradePartner,
    getTradePartnersByProject,
    getTradePartnersByDivision,
    getTradePartnersByStatus,
    importTradePartnersFromFile,
    exportTradePartnersToCSV,
    generateTradePartnerTemplate,
    
    // Allowances
    addAllowance,
    updateAllowance,
    deleteAllowance,
    getAllowancesByProject,
    getAllowancesByDivision,
    getAllowancesByCategory,
    getAllowancesSummary,
    importAllowancesFromFile,
    exportAllowancesToCSV,
    generateAllowanceTemplate,
    
    // GC & GR
    addGCGRItem,
    updateGCGRItem,
    deleteGCGRItem,
    getGCGRItemsByProject,
    getGCGRSummary,
    importGCGRFromFile,
    exportGCGRToCSV,
    generateGCGRTemplate,
    
    // Bid Leveling
    tradeBids,
    bidComparisons,
    bidLevelingNotes,
    addTradeBids,
    updateTradeBids,
    deleteTradeBids,
    addBidToTrade,
    updateTradeBid,
    deleteTradeBid,
    selectTradeBid,
    getBidLevelingSummary,
    createBidComparison,
    importBidLevelingFromFile,
    exportBidLevelingToCSV,
    generateBidLevelingTemplate,
    updateBidLevelingNotes,
    
    // Bid Tabs
    bidTabs,
    bidTabTemplates,
    addBidTab,
    updateBidTab,
    deleteBidTab,
    duplicateBidTab,
    addBidTabItem,
    updateBidTabItem,
    deleteBidTabItem,
    addVendorBid,
    updateVendorBid,
    deleteVendorBid,
    selectWinningBid,
    getBidTabSummary,
    getBidTabsByCSI,
    createBidTabFromTemplate,
    importBidTabsFromFile,
    exportBidTabsToCSV,
    generateBidTabTemplate
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