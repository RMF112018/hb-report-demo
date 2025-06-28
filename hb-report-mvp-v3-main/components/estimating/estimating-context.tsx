"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { enhancedBuildingConnectedAPI } from "@/data/enhanced-buildingconnected-api"
import type { RFP, Vendor, Proposal } from "@/types/estimating"
import type { BidLineItem } from "./enhanced-bid-tab" // Assuming this type is defined in enhanced-bid-tab

/**
 * @fileoverview Centralized State Management for Estimating Workflow
 *
 * This module provides the `EstimatingContext` and `EstimatingProvider` for managing
 * the entire estimating process state across the application. It includes interfaces
 * for various data entities, mock data, utility functions, and a comprehensive
 * provider component with action methods.
 *
 * @version 1.0.0
 * @author HB Report MVP Team
 * @since 2025-06-17
 *
 * @overview
 * The `EstimatingContext` and `EstimatingProvider` encapsulate all state and logic
 * related to the construction project estimating workflow. This includes:
 * - Quantity Takeoff data
 * - Clarifications and Assumptions
 * - Requests for Information (RFIs)
 * - Document Log
 * - Bid Tabulation data
 * - Bid Leveling selections
 * - Cost Summary
 *
 * It is designed to be easily extendable and maintainable, with clear interfaces
 * and JSDoc documentation for all properties and methods.
 *
 * @architecture
 * - `EstimatingContext`: React Context object for state sharing.
 * - `useEstimating`: Custom hook to consume the context.
 * - `EstimatingProvider`: React component that manages the state and provides it
 *   to its children. It initializes state with mock data and implements all
 *   state-modifying actions.
 *
 * @maintenance
 * To add new state properties or actions:
 * 1. Update the `ProjectEstimate` interface with the new data structure.
 * 2. Update the `EstimatingContextType` interface to include new state properties
 *    and their corresponding action methods (e.g., `setNewProperty`, `updateNewData`).
 * 3. Initialize the new state property in the `useState` hook within `EstimatingProvider`.
 * 4. Implement the new action methods within `EstimatingProvider` using `useCallback`
 *    to ensure stability and prevent unnecessary re-renders.
 * 5. Ensure proper JSDoc documentation for all new additions.
 * 6. If the new state needs to be persisted or loaded, integrate it into `saveEstimate`
 *    and initial state loading logic.
 */

/**
 * Interface for individual area calculations
 * Based on 01_AreaCalculations.pdf structure for Atlantic Fields Club project
 */
export interface AreaCalculation {
  id: string
  building: string
  level: string
  areaType: "AC SF" | "Gross SF" | "Covered Patio" | "Covered Service" | "Uncovered Patio" | "Parking"
  squareFootage: number
  notes?: string
}

/**
 * Interface for clarifications and assumptions
 * Based on 02_Clarifications&Assumptions.pdf structure
 */
export interface Clarification {
  id: string
  csiDivision: string
  description: string
  type: "Assumption" | "Exclusion"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Interface for requests for information
 * Based on 03_RequestsForInformation.pdf structure
 */
export interface RFI {
  id: string
  number: string
  question: string
  status: "Pending" | "Answered"
  dateSubmitted: string
  response: string
  dateAnswered?: string
  assignedTo?: string
  priority?: "Low" | "Medium" | "High"
}

/**
 * Interface for project documents
 * Based on 04_DocumentLog.pdf structure
 */
export interface Document {
  id: string
  sheetNumber: string
  description: string
  dateIssued: string
  dateReceived: string
  category: "Architectural" | "Structural" | "MEP" | "Electrical" | "Plumbing" | "Civil" | "Landscape" | "Other"
  notes?: string
  revision?: string
}

/**
 * Interface for general conditions and general requirements items
 */
export interface GCAndGRItem {
  id: string
  itemNumber: string
  description: string
  notes?: string
  category: "General Conditions" | "General Requirements"
  estimatedCost?: number
  isIncluded: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Interface for project allowances
 */
export interface Allowance {
  id: string
  csiDivision: string
  description: string
  value: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Interface for value analysis items
 */
export interface ValueAnalysis {
  id: string
  itemNumber: string
  description: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Interface for vendor bid information
 * Used in bid leveling process
 */
export interface VendorBid {
  id: string
  vendorId: string
  vendorName: string
  trade: string
  totalAmount: number
  lineItems: BidLineItem[]
  submissionDate: Date
  status: "received" | "reviewed" | "selected" | "rejected"
  confidence: number
  notes?: string
  inclusions: string[]
  exclusions: string[]
}

/**
 * Interface for individual cost categories in the cost summary.
 */
export interface CostCategory {
  id: string
  name: string
  amount: number
  status: "complete" | "pending" | "draft"
  lastUpdated: Date
  items?: number
}

/**
 * Interface for individual approval steps in the cost summary workflow.
 */
export interface ApprovalStep {
  id: string
  title: string
  description: string
  status: "pending" | "complete" | "skipped"
  completedBy?: string
  completedAt?: Date
}

/**
 * Interface for cost summary and approval
 */
export interface CostSummary {
  id: string
  rfpId: string
  // bidTabData: Record<string, BidLineItem[]>; // This is already in ProjectEstimate
  // selectedBids: Record<string, VendorBid>; // This is already in ProjectEstimate
  costCategories: CostCategory[] // New: to hold the breakdown
  approvalSteps: ApprovalStep[] // New: to hold the approval workflow
  subtotal: number
  overhead: number
  profit: number
  contingency: number // Renamed from bondInsurance to match prompt
  total: number
  approvalStatus: "draft" | "pending" | "approved" | "rejected" | "submitted"
  approvedBy?: string
  approvedDate?: Date
  notes?: string
}

/**
 * Interface for CSV import results
 */
export interface CSVImportResult {
  totalRows: number
  successfulRows: number
  errorRows: number
  errors: string[]
  importedDocuments: Document[]
}

/**
 * Interface for project estimate data with enhanced bid management
 */
export interface ProjectEstimate {
  id: string
  name: string
  projectNumber?: string
  client: string
  estimator: string
  dateCreated: Date
  lastModified: Date
  status: "draft" | "in-progress" | "review" | "approved" | "submitted"

  // BuildingConnected Integration
  rfpId?: string
  rfpData?: RFP
  buildingConnectedSync: boolean
  lastSyncDate?: Date

  // Step 1: Quantity Takeoff
  areaCalculations: AreaCalculation[]
  totalGrossSF: number
  totalACSF: number
  siteAcres: number
  parkingSpaces: number

  // Step 2: Clarifications & Assumptions
  clarifications: Clarification[]

  // Step 3: RFIs
  rfis: RFI[]

  // Step 4: Document Log
  documents: Document[]
  gcAndGRItems: GCAndGRItem[]
  allowances: Allowance[]
  valueAnalysis: ValueAnalysis[]

  // Step 5: Bid Tabulation (Enhanced)
  bidTabData: Record<string, BidLineItem[]>
  bidTabLastModified?: Date

  // Step 6: Bid Leveling (Enhanced)
  vendorBids: VendorBid[]
  selectedBids: Record<string, VendorBid>
  bidLevelingNotes?: string // Added for bid leveling notes

  // Step 7: Cost Summary
  costSummary?: CostSummary // Updated to use the new CostSummary interface

  // Legacy fields for compatibility
  selectedVendors: Vendor[]
  invitedVendors: string[]
  proposals: Proposal[]
  costs: any[]
  conditions: any[]
}

/**
 * Enhanced context interface for estimating workflow state management
 */
export interface EstimatingContextType {
  // Core State
  projectEstimate: ProjectEstimate
  currentTab: string // Renamed from currentStep to currentTab
  selectedRFP: RFP | null
  availableRFPs: RFP[]
  isLoading: boolean

  // Actions
  setCurrentTab: (tab: string) => void // Renamed from setCurrentStep
  setSelectedRFP: (rfp: RFP | null) => void

  // BuildingConnected Integration
  syncWithBuildingConnected: () => Promise<void>
  loadRFPs: () => Promise<void>

  // Quantity Takeoff
  updateAreaCalculations: (calculations: AreaCalculation[]) => void
  updateProjectMetrics: (
    metrics: Partial<Pick<ProjectEstimate, "totalGrossSF" | "totalACSF" | "siteAcres" | "parkingSpaces">>,
  ) => void

  // Clarifications Management
  addClarification: (clarification: Omit<Clarification, "id" | "createdAt" | "updatedAt">) => void
  updateClarification: (
    id: string,
    clarification: Partial<Omit<Clarification, "id" | "createdAt" | "updatedAt">>,
  ) => void
  deleteClarification: (id: string) => void

  // RFI Management
  addRFI: (rfi: Omit<RFI, "id">) => void
  updateRFI: (id: string, rfi: Partial<Omit<RFI, "id">>) => void
  deleteRFI: (id: string) => void

  // Document Log Management
  addDocument: (document: Omit<Document, "id">) => void
  updateDocument: (id: string, document: Partial<Omit<Document, "id">>) => void
  deleteDocument: (id: string) => void
  importDocumentsFromCSV: (file: File) => Promise<CSVImportResult>

  // GC & GR Management
  addGCAndGRItem: (item: Omit<GCAndGRItem, "id" | "createdAt" | "updatedAt">) => void
  updateGCAndGRItem: (id: string, item: Partial<Omit<GCAndGRItem, "id" | "createdAt" | "updatedAt">>) => void
  deleteGCAndGRItem: (id: string) => void

  // Allowances Management
  addAllowance: (allowance: Omit<Allowance, "id" | "createdAt" | "updatedAt">) => void
  updateAllowance: (id: string, allowance: Partial<Omit<Allowance, "id" | "createdAt" | "updatedAt">>) => void
  deleteAllowance: (id: string) => void

  // Value Analysis Management
  addValueAnalysis: (item: Omit<ValueAnalysis, "id" | "createdAt" | "updatedAt">) => void
  updateValueAnalysis: (id: string, item: Partial<Omit<ValueAnalysis, "id" | "createdAt" | "updatedAt">>) => void
  deleteValueAnalysis: (id: string) => void

  // Bid Tabulation (Enhanced)
  updateBidTabulation: (trade: string, lineItems: BidLineItem[]) => void
  getBidTabulationForTrade: (trade: string) => BidLineItem[]

  // Bid Leveling (Enhanced)
  addVendorBid: (bid: Omit<VendorBid, "id" | "submissionDate">) => void
  updateVendorBid: (bidId: string, updates: Partial<VendorBid>) => void
  deleteVendorBid: (bidId: string) => void
  selectVendorBid: (tradeId: string, bidId: string) => void
  updateBidLevelingNotes: (notes: string) => void // New action for leveling notes

  // Cost Summary
  updateCostSummary: (summary: Partial<CostSummary>) => void
  generateCostSummary: () => void
  updateApprovalStep: (stepId: string, action: "approve" | "reject") => void // New action for approval steps

  // General Actions
  saveEstimate: () => Promise<void>
  exportData: (format: "csv" | "pdf") => Promise<void>
  resetEstimate: () => void
}

// Mock Data for initial state
const MOCK_RFPS: RFP[] = [
  {
    id: "rfp-1",
    projectName: "Downtown Office Tower",
    client: "Tech Solutions Inc.",
    location: "San Francisco, CA",
    dueDate: new Date("2025-07-15"),
    status: "active",
    description: "Construction of a new 20-story office building.",
    estimatedValue: 150000000,
    tradesRequired: ["Concrete", "Steel", "MEP", "Finishes"],
    grossSF: 200000,
    netSF: 180000,
    duration: 24,
  },
  {
    id: "rfp-2",
    projectName: "Suburban Retail Center",
    client: "Retail Holdings LLC",
    location: "Pleasantville, NY",
    dueDate: new Date("2025-08-01"),
    status: "submitted",
    description: "Development of a new shopping complex with multiple retail units.",
    estimatedValue: 75000000,
    tradesRequired: ["Site Work", "Masonry", "Roofing", "Landscaping"],
    grossSF: 100000,
    netSF: 90000,
    duration: 18,
  },
  {
    id: "rfp-3",
    projectName: "Coastal Residential Complex",
    client: "Oceanfront Developers",
    location: "Miami, FL",
    dueDate: new Date("2025-09-10"),
    status: "awarded",
    description: "Luxury residential complex with ocean views.",
    estimatedValue: 200000000,
    tradesRequired: ["Foundation", "Framing", "Plumbing", "Electrical", "HVAC"],
    grossSF: 300000,
    netSF: 270000,
    duration: 30,
  },
]

const MOCK_COST_CATEGORIES: CostCategory[] = [
  {
    id: "trades",
    name: "Trade Work",
    amount: 1425000,
    status: "complete",
    lastUpdated: new Date("2024-01-21"),
    items: 15,
  },
  {
    id: "gc",
    name: "General Conditions",
    amount: 63500,
    status: "complete",
    lastUpdated: new Date("2024-01-20"),
    items: 4,
  },
  {
    id: "gr",
    name: "General Requirements",
    amount: 56000,
    status: "complete",
    lastUpdated: new Date("2024-01-20"),
    items: 3,
  },
  {
    id: "allowances",
    name: "Allowances & Contingencies",
    amount: 285000,
    status: "pending",
    lastUpdated: new Date("2024-01-19"),
    items: 3,
  },
]

const MOCK_APPROVAL_STEPS: ApprovalStep[] = [
  {
    id: "estimator_review",
    title: "Estimator Review",
    description: "Initial estimate review and validation",
    status: "complete",
    completedBy: "John Doe",
    completedAt: new Date("2024-01-21"),
  },
  {
    id: "chief_estimator",
    title: "Chief Estimator Approval",
    description: "Senior estimator review and approval",
    status: "complete",
    completedBy: "Sarah Johnson",
    completedAt: new Date("2024-01-22"),
  },
  {
    id: "project_executive",
    title: "Project Executive Review",
    description: "Executive review of project viability",
    status: "pending",
  },
  {
    id: "c_suite",
    title: "C-Suite Final Approval",
    description: "Final approval for bid submission",
    status: "pending",
  },
]

const MOCK_INITIAL_PROJECT_ESTIMATE: ProjectEstimate = {
  id: "est-1",
  name: "Downtown Office Tower Estimate",
  projectNumber: "PROJ-001",
  client: "Tech Solutions Inc.",
  estimator: "John Doe",
  dateCreated: new Date("2025-06-01"),
  lastModified: new Date("2025-06-17"),
  status: "in-progress",
  buildingConnectedSync: false,
  areaCalculations: [
    { id: "a1", building: "Tower A", level: "Ground", areaType: "Gross SF", squareFootage: 20000 },
    { id: "a2", building: "Tower A", level: "Ground", areaType: "AC SF", squareFootage: 18000 },
    { id: "a3", building: "Tower A", level: "Level 1", areaType: "Gross SF", squareFootage: 15000 },
    { id: "a4", building: "Tower A", level: "Level 1", areaType: "AC SF", squareFootage: 14000 },
  ],
  totalGrossSF: 35000,
  totalACSF: 32000,
  siteAcres: 2.5,
  parkingSpaces: 150,
  clarifications: [
    {
      id: "c1",
      csiDivision: "03 00 00",
      description: "Concrete mix design assumes standard 4000 PSI.",
      type: "Assumption",
      createdAt: new Date("2025-06-05"),
      updatedAt: new Date("2025-06-05"),
    },
  ],
  rfis: [
    {
      id: "rfi-001",
      number: "RFI-001",
      question: "Clarification on foundation waterproofing details.",
      status: "Pending",
      dateSubmitted: "2025-06-10",
      response: "",
    },
  ],
  documents: [
    {
      id: "doc-001",
      sheetNumber: "A-101",
      description: "Ground Floor Plan",
      dateIssued: "2025-05-20",
      dateReceived: "2025-05-22",
      category: "Architectural",
    },
  ],
  gcAndGRItems: [
    {
      id: "gcgr-1",
      itemNumber: "GC-001",
      description: "Project Management Staff",
      category: "General Conditions",
      estimatedCost: 150000,
      isIncluded: true,
      createdAt: new Date("2025-06-01"),
      updatedAt: new Date("2025-06-01"),
    },
  ],
  allowances: [
    {
      id: "allow-1",
      csiDivision: "09 00 00",
      description: "Flooring Allowance",
      value: 50000,
      createdAt: new Date("2025-06-01"),
      updatedAt: new Date("2025-06-01"),
    },
  ],
  valueAnalysis: [
    {
      id: "va-1",
      itemNumber: "VA-001",
      description: "Alternative HVAC system for cost savings.",
      createdAt: new Date("2025-06-01"),
      updatedAt: new Date("2025-06-01"),
    },
  ],
  bidTabData: {
    Concrete: [
      { id: "c1", description: "Footings", unit: "CY", quantity: 500, unitCost: 120, totalCost: 60000 },
      { id: "c2", description: "Slab on Grade", unit: "SF", quantity: 10000, unitCost: 10, totalCost: 100000 },
    ],
    Plumbing: [
      { id: "p1", description: "Rough-in per fixture", unit: "EA", quantity: 50, unitCost: 800, totalCost: 40000 },
      { id: "p2", description: "Water Heater Installation", unit: "EA", quantity: 5, unitCost: 1500, totalCost: 7500 },
    ],
  },
  vendorBids: [
    {
      id: "vbid-1",
      vendorId: "vend-abc",
      vendorName: "ABC Concrete",
      trade: "Concrete",
      totalAmount: 485000,
      lineItems: [
        { id: "c1", description: "Footings", unit: "CY", quantity: 500, unitCost: 120, totalCost: 60000 },
        { id: "c2", description: "Slab on Grade", unit: "SF", quantity: 10000, unitCost: 10, totalCost: 100000 },
        { id: "c3", description: "Formwork", unit: "LF", quantity: 2000, unitCost: 15, totalCost: 30000 },
      ],
      submissionDate: new Date("2025-06-10"),
      status: "received",
      confidence: 95,
      inclusions: ["Materials", "Labor", "Equipment", "Cleanup"],
      exclusions: ["Permits", "Site prep"],
    },
    {
      id: "vbid-2",
      vendorId: "vend-xyz",
      vendorName: "XYZ Construction",
      trade: "Concrete",
      totalAmount: 520000,
      lineItems: [
        { id: "c1", description: "Footings", unit: "CY", quantity: 500, unitCost: 130, totalCost: 65000 },
        { id: "c2", description: "Slab on Grade", unit: "SF", quantity: 10000, unitCost: 11, totalCost: 110000 },
        { id: "c3", description: "Formwork", unit: "LF", quantity: 2000, unitCost: 16, totalCost: 32000 },
      ],
      submissionDate: new Date("2025-06-11"),
      status: "received",
      confidence: 88,
      inclusions: ["Materials", "Labor", "Basic cleanup"],
      exclusions: ["Permits", "Site prep", "Equipment rental"],
    },
    {
      id: "vbid-3",
      vendorId: "vend-pro",
      vendorName: "Pro Plumbing",
      trade: "Plumbing",
      totalAmount: 320000,
      lineItems: [
        { id: "p1", description: "Rough-in per fixture", unit: "EA", quantity: 50, unitCost: 800, totalCost: 40000 },
        {
          id: "p2",
          description: "Water Heater Installation",
          unit: "EA",
          quantity: 5,
          unitCost: 1500,
          totalCost: 7500,
        },
      ],
      submissionDate: new Date("2025-06-12"),
      status: "received",
      confidence: 92,
      inclusions: ["Materials", "Labor", "Permits", "Testing"],
      exclusions: ["Fixtures above standard grade"],
    },
    {
      id: "vbid-4",
      vendorId: "vend-budget",
      vendorName: "Budget Plumbing",
      trade: "Plumbing",
      totalAmount: 285000,
      lineItems: [
        { id: "p1", description: "Rough-in per fixture", unit: "EA", quantity: 50, unitCost: 700, totalCost: 35000 },
        {
          id: "p2",
          description: "Water Heater Installation",
          unit: "EA",
          quantity: 5,
          unitCost: 1200,
          totalCost: 6000,
        },
      ],
      submissionDate: new Date("2025-06-13"),
      status: "received",
      confidence: 65,
      inclusions: ["Basic materials", "Labor"],
      exclusions: ["Permits", "Testing", "Premium fixtures", "Warranty"],
    },
  ],
  selectedBids: {}, // Initially no bids selected
  bidLevelingNotes: "", // Initial empty notes
  costSummary: {
    id: "cs-mock-1",
    rfpId: "rfp-1",
    costCategories: MOCK_COST_CATEGORIES,
    approvalSteps: MOCK_APPROVAL_STEPS,
    subtotal: 0, // Will be calculated
    overhead: 0, // Will be calculated
    profit: 0, // Will be calculated
    contingency: 0, // Will be calculated
    total: 0, // Will be calculated
    approvalStatus: "draft",
    notes: "",
  },
  selectedVendors: [],
  invitedVendors: [],
  proposals: [],
  costs: [],
  conditions: [],
}

const EstimatingContext = createContext<EstimatingContextType | undefined>(undefined)

/**
 * Custom hook to use the EstimatingContext.
 * Throws an error if used outside of an EstimatingProvider.
 * @returns {EstimatingContextType} The estimating context.
 */
export function useEstimating() {
  const context = useContext(EstimatingContext)
  if (context === undefined) {
    throw new Error("useEstimating must be used within an EstimatingProvider")
  }
  return context
}

/**
 * Provides the estimating context to its children.
 * Manages all estimating-related state and actions.
 * @param {React.PropsWithChildren} { children } - React children to render within the provider.
 */
export function EstimatingProvider({ children }: React.PropsWithChildren) {
  const [projectEstimate, setProjectEstimate] = useState<ProjectEstimate>(MOCK_INITIAL_PROJECT_ESTIMATE)
  const [currentTab, setCurrentTab] = useState<string>("quantity-takeoff")
  const [selectedRFP, setSelectedRFP] = useState<RFP | null>(MOCK_RFPS[0]) // Default to first RFP
  const [availableRFPs, setAvailableRFPs] = useState<RFP[]>(MOCK_RFPS)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  /**
   * Simulates syncing with BuildingConnected to fetch RFP data.
   */
  const syncWithBuildingConnected = useCallback(async () => {
    setIsLoading(true)
    try {
      const rfps = await enhancedBuildingConnectedAPI.getRFPs()
      setAvailableRFPs(rfps)
      // Optionally, set the first RFP as selected if none is
      if (!selectedRFP && rfps.length > 0) {
        setSelectedRFP(rfps[0])
      }
      console.log("Synced with BuildingConnected:", rfps)
    } catch (error) {
      console.error("Failed to sync with BuildingConnected:", error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedRFP])

  /**
   * Loads available RFPs.
   */
  const loadRFPs = useCallback(async () => {
    setIsLoading(true)
    try {
      // In a real app, this would fetch from a backend
      setAvailableRFPs(MOCK_RFPS)
      if (!selectedRFP && MOCK_RFPS.length > 0) {
        setSelectedRFP(MOCK_RFPS[0])
      }
    } catch (error) {
      console.error("Failed to load RFPs:", error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedRFP])

  // Initial load of RFPs
  useEffect(() => {
    loadRFPs()
  }, [loadRFPs])

  /**
   * Updates area calculations in the project estimate.
   * @param {AreaCalculation[]} calculations - The updated array of area calculations.
   */
  const updateAreaCalculations = useCallback((calculations: AreaCalculation[]) => {
    setProjectEstimate((prev) => ({ ...prev, areaCalculations: calculations }))
  }, [])

  /**
   * Updates general project metrics like SF, acres, and parking spaces.
   * @param {Partial<Pick<ProjectEstimate, "totalGrossSF" | "totalACSF" | "siteAcres" | "parkingSpaces">>} metrics - Partial object of metrics to update.
   */
  const updateProjectMetrics = useCallback(
    (metrics: Partial<Pick<ProjectEstimate, "totalGrossSF" | "totalACSF" | "siteAcres" | "parkingSpaces">>) => {
      setProjectEstimate((prev) => ({ ...prev, ...metrics }))
    },
    [],
  )

  /**
   * Adds a new clarification/assumption.
   * @param {Omit<Clarification, "id" | "createdAt" | "updatedAt">} clarification - The clarification object to add.
   */
  const addClarification = useCallback((clarification: Omit<Clarification, "id" | "createdAt" | "updatedAt">) => {
    setProjectEstimate((prev) => ({
      ...prev,
      clarifications: [
        ...prev.clarifications,
        { ...clarification, id: `c-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() },
      ],
    }))
  }, [])

  /**
   * Updates an existing clarification/assumption.
   * @param {string} id - The ID of the clarification to update.
   * @param {Partial<Omit<Clarification, "id" | "createdAt" | "updatedAt">>} updates - Partial object of updates.
   */
  const updateClarification = useCallback(
    (id: string, updates: Partial<Omit<Clarification, "id" | "createdAt" | "updatedAt">>) => {
      setProjectEstimate((prev) => ({
        ...prev,
        clarifications: prev.clarifications.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c)),
      }))
    },
  )

  /**
   * Deletes a clarification/assumption.
   * @param {string} id - The ID of the clarification to delete.
   */
  const deleteClarification = useCallback((id: string) => {
    setProjectEstimate((prev) => ({
      ...prev,
      clarifications: prev.clarifications.filter((c) => c.id !== id),
    }))
  }, [])

  /**
   * Adds a new RFI.
   * @param {Omit<RFI, "id">} rfi - The RFI object to add.
   */
  const addRFI = useCallback((rfi: Omit<RFI, "id">) => {
    setProjectEstimate((prev) => ({
      ...prev,
      rfis: [...prev.rfis, { ...rfi, id: `rfi-${Date.now()}` }],
    }))
  }, [])

  /**
   * Updates an existing RFI.
   * @param {string} id - The ID of the RFI to update.
   * @param {Partial<Omit<RFI, "id">>} updates - Partial object of updates.
   */
  const updateRFI = useCallback((id: string, updates: Partial<Omit<RFI, "id">>) => {
    setProjectEstimate((prev) => ({
      ...prev,
      rfis: prev.rfis.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }))
  }, [])

  /**
   * Deletes an RFI.
   * @param {string} id - The ID of the RFI to delete.
   */
  const deleteRFI = useCallback((id: string) => {
    setProjectEstimate((prev) => ({
      ...prev,
      rfis: prev.rfis.filter((r) => r.id !== id),
    }))
  }, [])

  /**
   * Adds a new document to the log.
   * @param {Omit<Document, "id">} document - The document object to add.
   */
  const addDocument = useCallback((document: Omit<Document, "id">) => {
    setProjectEstimate((prev) => ({
      ...prev,
      documents: [...prev.documents, { ...document, id: `doc-${Date.now()}` }],
    }))
  }, [])

  /**
   * Updates an existing document in the log.
   * @param {string} id - The ID of the document to update.
   * @param {Partial<Omit<Document, "id">>} updates - Partial object of updates.
   */
  const updateDocument = useCallback((id: string, updates: Partial<Omit<Document, "id">>) => {
    setProjectEstimate((prev) => ({
      ...prev,
      documents: prev.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }))
  }, [])

  /**
   * Deletes a document from the log.
   * @param {string} id - The ID of the document to delete.
   */
  const deleteDocument = useCallback((id: string) => {
    setProjectEstimate((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
    }))
  }, [])

  /**
   * Simulates importing documents from a CSV file.
   * @param {File} file - The CSV file to import.
   * @returns {Promise<CSVImportResult>} The result of the import operation.
   */
  const importDocumentsFromCSV = useCallback(async (file: File): Promise<CSVImportResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const lines = text.split("\n").filter(Boolean)
        const importedDocuments: Document[] = []
        const errors: string[] = []
        let successfulRows = 0

        // Skip header row if present
        const dataLines = lines[0].includes("sheetNumber") ? lines.slice(1) : lines

        dataLines.forEach((line, index) => {
          const [sheetNumber, description, dateIssued, dateReceived, category, notes, revision] = line.split(",")
          if (sheetNumber && description && dateIssued && dateReceived && category) {
            importedDocuments.push({
              id: `doc-csv-${Date.now()}-${index}`,
              sheetNumber,
              description,
              dateIssued,
              dateReceived,
              category: category as Document["category"],
              notes,
              revision,
            })
            successfulRows++
          } else {
            errors.push(`Row ${index + 1}: Missing required fields.`)
          }
        })

        setProjectEstimate((prev) => ({
          ...prev,
          documents: [...prev.documents, ...importedDocuments],
        }))

        resolve({
          totalRows: dataLines.length,
          successfulRows,
          errorRows: errors.length,
          errors,
          importedDocuments,
        })
      }
      reader.readAsText(file)
    })
  }, [])

  /**
   * Adds a new GC & GR item.
   * @param {Omit<GCAndGRItem, "id" | "createdAt" | "updatedAt">} item - The item to add.
   */
  const addGCAndGRItem = useCallback((item: Omit<GCAndGRItem, "id" | "createdAt" | "updatedAt">) => {
    setProjectEstimate((prev) => ({
      ...prev,
      gcAndGRItems: [
        ...prev.gcAndGRItems,
        { ...item, id: `gcgr-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() },
      ],
    }))
  }, [])

  /**
   * Updates an existing GC & GR item.
   * @param {string} id - The ID of the item to update.
   * @param {Partial<Omit<GCAndGRItem, "id" | "createdAt" | "updatedAt">>} updates - Partial object of updates.
   */
  const updateGCAndGRItem = useCallback(
    (id: string, updates: Partial<Omit<GCAndGRItem, "id" | "createdAt" | "updatedAt">>) => {
      setProjectEstimate((prev) => ({
        ...prev,
        gcAndGRItems: prev.gcAndGRItems.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item,
        ),
      }))
    },
  )

  /**
   * Deletes a GC & GR item.
   * @param {string} id - The ID of the item to delete.
   */
  const deleteGCAndGRItem = useCallback((id: string) => {
    setProjectEstimate((prev) => ({
      ...prev,
      gcAndGRItems: prev.gcAndGRItems.filter((item) => item.id !== id),
    }))
  }, [])

  /**
   * Adds a new allowance.
   * @param {Omit<Allowance, "id" | "createdAt" | "updatedAt">} allowance - The allowance to add.
   */
  const addAllowance = useCallback((allowance: Omit<Allowance, "id" | "createdAt" | "updatedAt">) => {
    setProjectEstimate((prev) => ({
      ...prev,
      allowances: [
        ...prev.allowances,
        { ...allowance, id: `allow-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() },
      ],
    }))
  }, [])

  /**
   * Updates an existing allowance.
   * @param {string} id - The ID of the allowance to update.
   * @param {Partial<Omit<Allowance, "id" | "createdAt" | "updatedAt">>} updates - Partial object of updates.
   */
  const updateAllowance = useCallback(
    (id: string, updates: Partial<Omit<Allowance, "id" | "createdAt" | "updatedAt">>) => {
      setProjectEstimate((prev) => ({
        ...prev,
        allowances: prev.allowances.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item,
        ),
      }))
    },
  )

  /**
   * Deletes an allowance.
   * @param {string} id - The ID of the allowance to delete.
   */
  const deleteAllowance = useCallback((id: string) => {
    setProjectEstimate((prev) => ({
      ...prev,
      allowances: prev.allowances.filter((item) => item.id !== id),
    }))
  }, [])

  /**
   * Adds a new value analysis item.
   * @param {Omit<ValueAnalysis, "id" | "createdAt" | "updatedAt">} item - The item to add.
   */
  const addValueAnalysis = useCallback((item: Omit<ValueAnalysis, "id" | "createdAt" | "updatedAt">) => {
    setProjectEstimate((prev) => ({
      ...prev,
      valueAnalysis: [
        ...prev.valueAnalysis,
        { ...item, id: `va-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() },
      ],
    }))
  }, [])

  /**
   * Updates an existing value analysis item.
   * @param {string} id - The ID of the item to update.
   * @param {Partial<Omit<ValueAnalysis, "id" | "createdAt" | "updatedAt">>} updates - Partial object of updates.
   */
  const updateValueAnalysis = useCallback(
    (id: string, updates: Partial<Omit<ValueAnalysis, "id" | "createdAt" | "updatedAt">>) => {
      setProjectEstimate((prev) => ({
        ...prev,
        valueAnalysis: prev.valueAnalysis.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item,
        ),
      }))
    },
  )

  /**
   * Deletes a value analysis item.
   * @param {string} id - The ID of the item to delete.
   */
  const deleteValueAnalysis = useCallback((id: string) => {
    setProjectEstimate((prev) => ({
      ...prev,
      valueAnalysis: prev.valueAnalysis.filter((item) => item.id !== id),
    }))
  }, [])

  /**
   * Updates the bid tabulation data for a specific trade.
   * @param {string} trade - The trade name (e.g., "Concrete").
   * @param {BidLineItem[]} lineItems - The array of line items for that trade.
   */
  const updateBidTabulation = useCallback((trade: string, lineItems: BidLineItem[]) => {
    setProjectEstimate((prev) => ({
      ...prev,
      bidTabData: {
        ...prev.bidTabData,
        [trade]: lineItems,
      },
      bidTabLastModified: new Date(),
    }))
  }, [])

  /**
   * Retrieves bid tabulation line items for a given trade.
   * @param {string} trade - The trade name.
   * @returns {BidLineItem[]} An array of bid line items for the specified trade.
   */
  const getBidTabulationForTrade = useCallback(
    (trade: string): BidLineItem[] => {
      return projectEstimate.bidTabData[trade] || []
    },
    [projectEstimate.bidTabData],
  )

  /**
   * Adds a new vendor bid.
   * @param {Omit<VendorBid, "id" | "submissionDate">} bid - The bid object to add.
   */
  const addVendorBid = useCallback((bid: Omit<VendorBid, "id" | "submissionDate">) => {
    setProjectEstimate((prev) => ({
      ...prev,
      vendorBids: [...prev.vendorBids, { ...bid, id: `vbid-${Date.now()}`, submissionDate: new Date() }],
    }))
  }, [])

  /**
   * Updates an existing vendor bid.
   * @param {string} bidId - The ID of the bid to update.
   * @param {Partial<VendorBid>} updates - Partial object of updates.
   */
  const updateVendorBid = useCallback((bidId: string, updates: Partial<VendorBid>) => {
    setProjectEstimate((prev) => ({
      ...prev,
      vendorBids: prev.vendorBids.map((bid) => (bid.id === bidId ? { ...bid, ...updates } : bid)),
    }))
  }, [])

  /**
   * Deletes a vendor bid.
   * @param {string} bidId - The ID of the bid to delete.
   */
  const deleteVendorBid = useCallback((bidId: string) => {
    setProjectEstimate((prev) => ({
      ...prev,
      vendorBids: prev.vendorBids.filter((bid) => bid.id !== bidId),
      selectedBids: Object.fromEntries(
        Object.entries(prev.selectedBids).filter(([, selectedBid]) => selectedBid.id !== bidId),
      ),
    }))
  }, [])

  /**
   * Selects a specific vendor bid for a given trade.
   * @param {string} tradeId - The ID of the trade (e.g., "Concrete").
   * @param {string} bidId - The ID of the bid to select.
   */
  const selectVendorBid = useCallback((tradeId: string, bidId: string) => {
    setProjectEstimate((prev) => {
      const selectedBid = prev.vendorBids.find((bid) => bid.id === bidId)
      if (selectedBid) {
        return {
          ...prev,
          selectedBids: {
            ...prev.selectedBids,
            [tradeId]: selectedBid,
          },
        }
      }
      return prev
    })
  }, [])

  /**
   * Updates the general leveling notes for bid leveling.
   * @param {string} notes - The new leveling notes string.
   */
  const updateBidLevelingNotes = useCallback((notes: string) => {
    setProjectEstimate((prev) => ({
      ...prev,
      bidLevelingNotes: notes,
    }))
  }, [])

  /**
   * Updates the cost summary.
   * @param {Partial<CostSummary>} summary - Partial object of cost summary updates.
   */
  const updateCostSummary = useCallback((summary: Partial<CostSummary>) => {
    setProjectEstimate((prev) => ({
      ...prev,
      costSummary: prev.costSummary ? { ...prev.costSummary, ...summary } : { ...summary, id: `cs-${Date.now()}` },
    }))
  }, [])

  /**
   * Generates the cost summary based on selected bids and other project data.
   */
  const generateCostSummary = useCallback(() => {
    setProjectEstimate((prev) => {
      const currentCostCategories = prev.costSummary?.costCategories || MOCK_COST_CATEGORIES
      const subtotal = currentCostCategories.reduce((sum, category) => sum + category.amount, 0)
      const overhead = subtotal * 0.1 // 10% overhead
      const profit = subtotal * 0.08 // 8% profit
      const contingency = subtotal * 0.05 // 5% contingency
      const total = subtotal + overhead + profit + contingency

      return {
        ...prev,
        costSummary: {
          id: prev.costSummary?.id || `cs-${Date.now()}`,
          rfpId: prev.selectedRFP?.id || "N/A",
          costCategories: currentCostCategories,
          approvalSteps: prev.costSummary?.approvalSteps || MOCK_APPROVAL_STEPS,
          subtotal,
          overhead,
          profit,
          contingency,
          total,
          approvalStatus: prev.costSummary?.approvalStatus || "draft",
          notes: prev.costSummary?.notes || "",
        },
      }
    })
  }, [])

  /**
   * Updates the status of an approval step within the cost summary.
   * @param {string} stepId - The ID of the approval step to update.
   * @param {"approve" | "reject"} action - The action to perform (approve or reject).
   */
  const updateApprovalStep = useCallback((stepId: string, action: "approve" | "reject") => {
    setProjectEstimate((prev) => {
      if (!prev.costSummary) return prev

      const updatedApprovalSteps = prev.costSummary.approvalSteps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            status: action === "approve" ? "complete" : "skipped",
            completedBy: action === "approve" ? "Current User" : undefined,
            completedAt: action === "approve" ? new Date() : undefined,
          }
        }
        return step
      })

      const allApproved = updatedApprovalSteps.every((step) => step.status === "complete")
      const newApprovalStatus = allApproved ? "approved" : "pending"

      return {
        ...prev,
        costSummary: {
          ...prev.costSummary,
          approvalSteps: updatedApprovalSteps,
          approvalStatus: newApprovalStatus,
        },
      }
    })
  }, [])

  /**
   * Simulates saving the current estimate state.
   */
  const saveEstimate = useCallback(async () => {
    setIsLoading(true)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Estimate saved:", projectEstimate)
        setProjectEstimate((prev) => ({ ...prev, lastModified: new Date() }))
        setIsLoading(false)
        resolve()
      }, 1000) // Simulate API call
    })
  }, [projectEstimate])

  /**
   * Simulates exporting project data to CSV or PDF.
   * @param {"csv" | "pdf"} format - The desired export format.
   */
  const exportData = useCallback(
    async (format: "csv" | "pdf") => {
      setIsLoading(true)
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log(`Exporting project data as ${format}:`, projectEstimate)
          setIsLoading(false)
          resolve()
        }, 1000) // Simulate API call
      })
    },
    [projectEstimate],
  )

  /**
   * Resets the project estimate to its initial mock state.
   */
  const resetEstimate = useCallback(() => {
    setProjectEstimate(MOCK_INITIAL_PROJECT_ESTIMATE)
    setSelectedRFP(MOCK_RFPS[0])
    setCurrentTab("quantity-takeoff")
  }, [])

  // Generate cost summary on initial load or when selectedRFP changes
  useEffect(() => {
    if (selectedRFP) {
      generateCostSummary()
    }
  }, [selectedRFP, generateCostSummary])

  const contextValue = {
    projectEstimate,
    currentTab,
    selectedRFP,
    availableRFPs,
    isLoading,
    setCurrentTab,
    setSelectedRFP,
    syncWithBuildingConnected,
    loadRFPs,
    updateAreaCalculations,
    updateProjectMetrics,
    addClarification,
    updateClarification,
    deleteClarification,
    addRFI,
    updateRFI,
    deleteRFI,
    addDocument,
    updateDocument,
    deleteDocument,
    importDocumentsFromCSV,
    addGCAndGRItem,
    updateGCAndGRItem,
    deleteGCAndGRItem,
    addAllowance,
    updateAllowance,
    deleteAllowance,
    addValueAnalysis,
    updateValueAnalysis,
    deleteValueAnalysis,
    updateBidTabulation,
    getBidTabulationForTrade,
    addVendorBid,
    updateVendorBid,
    deleteVendorBid,
    selectVendorBid,
    updateBidLevelingNotes, // Added to context
    updateCostSummary,
    generateCostSummary,
    updateApprovalStep, // Added to context
    saveEstimate,
    exportData,
    resetEstimate,
  }

  return <EstimatingContext.Provider value={contextValue}>{children}</EstimatingContext.Provider>
}
