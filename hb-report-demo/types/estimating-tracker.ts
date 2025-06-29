export interface EstimatingProject {
  id: string;
  projectNumber: string;
  projectName: string;
  source: 'CLIENT REQUEST' | 'RFQ' | 'DESIGN/BUILD RFP' | 'HARD BID' | 'LUMP SUM PROPOSAL';
  deliverable: 'CONCEPTUAL EST' | 'GMP' | 'LUMP SUM PROPOSAL' | 'DESIGN BUILD' | 'DD ESTIMATE' | 'ROM' | 'SD ESTIMATE' | 'SCHEMATIC ESTIMATE' | 'GMP EST';
  subBidsDue?: string;
  presubmissionReview?: string;
  winStrategyMeeting?: string;
  dueDateOutTheDoor?: string;
  leadEstimator: string;
  contributors?: string;
  px?: string;
  status: 'ACTIVE' | 'ON HOLD' | 'PENDING' | 'AWARDED' | 'NOT AWARDED' | 'CLOSED';
  
  // Checklist items
  checklist: {
    bidBond: boolean;
    ppBond: boolean;
    schedule: boolean;
    logistics: boolean;
    bimProposal: boolean;
    preconProposal: boolean;
    proposalTabs: boolean;
    coordinateWithMarketing: boolean;
  };
  
  // Financial data
  costPerGsf?: number;
  costPerUnit?: number;
  estimatedValue?: number;
  submittedDate?: string;
  
  // Project stage specific data
  currentStage?: 'DD' | 'GMP' | 'CLOSED' | 'ON HOLD' | '50% CD' | 'Schematic';
  preconBudget?: number;
  designBudget?: number;
  billedToDate?: number;
  
  // Notes and outcome
  notes?: string;
  outcome?: 'AWARDED W/O PRECON' | 'AWARDED W/ PRECON' | 'NOT AWARDED' | 'PENDING';
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface EstimatingTrackingSummary {
  totalProjects: number;
  activeProjects: number;
  totalValue: number;
  awardedValue: number;
  pendingValue: number;
  notAwardedValue: number;
  winRate: number;
  avgProjectValue: number;
}

export interface EstimatingFilters {
  status?: string[];
  leadEstimator?: string[];
  source?: string[];
  deliverable?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  valueRange?: {
    min: number;
    max: number;
  };
}

export interface EstimatingExportOptions {
  format: 'CSV' | 'EXCEL' | 'PDF';
  includeChecklist: boolean;
  includeFinancials: boolean;
  includeNotes: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface EstimatingWorkflowStage {
  id: string;
  name: string;
  description: string;
  requiredFields: string[];
  nextStages: string[];
  color: string;
}

export interface EstimatingTeamMember {
  id: string;
  name: string;
  role: 'LEAD_ESTIMATOR' | 'CONTRIBUTOR' | 'PX';
  email: string;
  workload: number; // Current number of active projects
  specialties: string[];
}

export interface Clarification {
  id: string;
  projectId: string;
  csiDivision: string;
  description: string;
  type: 'Assumption' | 'Exclusion' | 'Clarification';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  reviewStatus?: 'pending' | 'approved' | 'rejected';
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  affectedTrades?: string[];
  estimatedImpact?: number;
  resolved?: boolean;
}

export interface ClarificationFilters {
  type?: string[];
  csiDivision?: string[];
  reviewStatus?: string[];
  priority?: string[];
  category?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ClarificationExportOptions {
  format: 'CSV' | 'EXCEL' | 'PDF';
  includeNotes: boolean;
  includeMetadata: boolean;
  groupBy?: 'type' | 'csiDivision' | 'priority';
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface RFI {
  id: string;
  projectId: string;
  number: string;
  subject: string;
  reference: string;
  question: string;
  status: 'Pending' | 'In Review' | 'Answered' | 'Closed' | 'Superseded';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dateCreated: Date;
  dateDue?: Date;
  dateAnswered?: Date;
  response?: string;
  createdBy: string;
  assignedTo: string;
  reviewedBy?: string;
  discipline?: 'Architectural' | 'Structural' | 'MEP' | 'Civil' | 'General' | 'Interior Design';
  category?: 'Design Clarification' | 'Specification' | 'Material' | 'Coordination' | 'Code Compliance' | 'Other';
  csiDivision?: string;
  drawingReference?: string;
  specSection?: string;
  costImpact?: 'None' | 'TBD' | 'Minor' | 'Major';
  scheduleImpact?: 'None' | 'TBD' | 'Minor' | 'Major';
  estimatedCostImpact?: number;
  estimatedScheduleImpact?: number; // days
  distributionList?: string[];
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  relatedRFIs?: string[]; // RFI IDs
  closeoutNotes?: string;
  revisionsRequired?: boolean;
  originalRFI?: string; // For revised RFIs
  supersededBy?: string; // RFI ID that supersedes this one
}

export interface RFIFilters {
  status?: string[];
  priority?: string[];
  assignedTo?: string[];
  discipline?: string[];
  category?: string[];
  costImpact?: string[];
  scheduleImpact?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface RFIExportOptions {
  format: 'CSV' | 'EXCEL' | 'PDF';
  includeResponses: boolean;
  includeAttachments: boolean;
  includeDistribution: boolean;
  filterBy?: RFIFilters;
  groupBy?: 'status' | 'priority' | 'assignedTo' | 'discipline';
  template?: 'Standard' | 'Executive Summary' | 'Detailed';
}

export interface RFIDistribution {
  id: string;
  rfiId: string;
  recipient: string;
  email: string;
  role: string;
  dateDistributed: Date;
  deliveryMethod: 'Email' | 'Portal' | 'Hard Copy';
  status: 'Sent' | 'Delivered' | 'Read' | 'Acknowledged';
  readDate?: Date;
  acknowledgedDate?: Date;
}

export interface RFITemplate {
  id: string;
  name: string;
  description: string;
  fields: {
    subject: string;
    reference: string;
    question: string;
    priority: RFI['priority'];
    discipline: RFI['discipline'];
    category: RFI['category'];
  };
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
}

// Document Log Types
export interface Document {
  id: string;
  projectId: string;
  sheetNumber: string;
  description: string;
  discipline: 'Architectural' | 'Structural' | 'MEP' | 'Electrical' | 'Plumbing' | 'Civil' | 'Landscape' | 'Fire Protection' | 'Telecommunications' | 'Security' | 'General' | 'Other';
  category: 'Cover Sheet' | 'Plans' | 'Elevations' | 'Sections' | 'Details' | 'Schedules' | 'Specifications' | 'Calculations' | 'Reports' | 'Addenda' | 'Other';
  dateIssued: string;
  dateReceived: string;
  revision?: string;
  phase?: 'SD' | 'DD' | 'CD' | 'BID' | 'CA' | 'Record';
  status: 'Current' | 'Superseded' | 'Void' | 'Under Review';
  fileSize?: number; // in bytes
  fileName?: string;
  notes?: string;
  issuedBy?: string;
  reviewedBy?: string;
  approvedBy?: string;
  addendum?: number; // Addendum number if applicable
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface DocumentFilters {
  discipline?: string[];
  category?: string[];
  status?: string[];
  phase?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  revisionRange?: {
    start: string;
    end: string;
  };
  addendumNumber?: number[];
}

export interface DocumentExportOptions {
  format: 'CSV' | 'EXCEL' | 'PDF';
  includeNotes: boolean;
  includeMetadata: boolean;
  includeFileInfo: boolean;
  groupBy?: 'discipline' | 'category' | 'phase' | 'status';
  sortBy?: 'sheetNumber' | 'dateIssued' | 'dateReceived' | 'description';
  filterBy?: DocumentFilters;
}

export interface DocumentImportResult {
  successfulRows: number;
  errorRows: number;
  totalRows: number;
  errors: {
    row: number;
    field: string;
    value: string;
    message: string;
  }[];
  warnings?: {
    row: number;
    field: string;
    value: string;
    message: string;
  }[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  headers: {
    sheetNumber: string;
    description: string;
    discipline: string;
    category: string;
    dateIssued: string;
    dateReceived: string;
    revision?: string;
    phase?: string;
    notes?: string;
  };
  sampleData: any[];
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
}

// Trade Partner Types
export interface TradePartner {
  id: string;
  projectId: string;
  number: number;
  csiDivision: string;
  csiDescription?: string;
  contractorName: string;
  status: 'selected' | 'pending' | 'rejected' | 'backup';
  contractValue?: number;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
    primaryContact?: string;
  };
  bidDate?: string;
  awardDate?: string;
  contractSignedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradePartnerFilters {
  search?: string;
  csiDivision?: string;
  status?: TradePartner['status'];
  contractValueMin?: number;
  contractValueMax?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface TradePartnerExportOptions {
  format: 'csv' | 'excel';
  includeContactInfo: boolean;
  includeFinancials: boolean;
  selectedOnly: boolean;
}

export interface TradePartnerImportResult {
  success: boolean;
  totalRows: number;
  successfulImports: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
    value?: any;
  }>;
  duplicates: number;
}

export interface CSICode {
  csi_code: string;
  csi_code_description: string;
}

// Allowance Types
export interface Allowance {
  id: string;
  projectId: string;
  number: number;
  csiDivision: string;
  csiDescription?: string;
  description: string;
  value: number;
  notes?: string;
  status: 'active' | 'inactive' | 'pending';
  category?: 'structural' | 'architectural' | 'mechanical' | 'electrical' | 'plumbing' | 'sitework' | 'finishes' | 'specialties' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface AllowanceFilters {
  search?: string;
  csiDivision?: string;
  status?: Allowance['status'];
  category?: Allowance['category'];
  valueMin?: number;
  valueMax?: number;
}

export interface AllowanceExportOptions {
  format: 'csv' | 'excel';
  includeNotes: boolean;
  includeInactive: boolean;
  selectedOnly: boolean;
}

export interface AllowanceImportResult {
  success: boolean;
  totalRows: number;
  successfulImports: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
    value?: any;
  }>;
  duplicates: number;
}

export interface AllowanceSummary {
  totalAllowances: number;
  activeAllowances: number;
  totalValue: number;
  activeValue: number;
  averageValue: number;
  categoryBreakdown: Record<string, { count: number; value: number }>;
  csiBreakdown: Record<string, { count: number; value: number }>;
}

// GC & GR Types
export interface GCGRItem {
  id: string;
  projectId: string;
  contractRef?: string;
  category: 'Field Labor - Construction' | 'Field Labor - Close Out' | 'Field Office - Contractor' | 'Temporary Utilities' | 'Equipment' | 'Security' | 'Cleaning' | 'Services' | 'Drawings' | 'Testing' | 'Permits' | 'Travel' | 'Other';
  subcategory?: string;
  description: string;
  position?: string; // For labor items
  qty: number;
  unitOfMeasure: string;
  unitCost: number;
  totalCost: number;
  percentTime?: number; // For labor items
  customLaborRate?: number; // For labor items
  flsaOvertime?: number; // For labor items
  remarks?: string;
  isIncluded: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GCGRFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  isIncluded?: boolean;
  costMin?: number;
  costMax?: number;
}

export interface GCGRExportOptions {
  format: 'csv' | 'excel';
  includeInactive: boolean;
  includeRemarks: boolean;
  selectedOnly: boolean;
  groupByCategory: boolean;
}

export interface GCGRImportResult {
  success: boolean;
  totalRows: number;
  successfulImports: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
    value?: any;
  }>;
  duplicates: number;
}

export interface GCGRSummary {
  totalItems: number;
  includedItems: number;
  totalCost: number;
  includedCost: number;
  averageCost: number;
  categoryBreakdown: Record<string, { count: number; cost: number }>;
  laborCost: number;
  fieldOfficeCost: number;
  otherCost: number;
  constructionDuration: {
    days: number;
    weeks: number;
    months: number;
  };
  closeOutDuration: {
    days: number;
    weeks: number;
    months: number;
  };
}

export interface ProjectPhase {
  name: string;
  startDate: string;
  endDate: string;
  days: number;
  weeks: number;
  months: number;
}

// Bid Leveling Types
export interface Bid {
  id: string;
  vendor: string;
  amount: number;
  status: "received" | "reviewed" | "selected" | "rejected";
  confidence: number;
  notes?: string;
  inclusions: string[];
  exclusions: string[];
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adjustedAmount?: number;
  adjustmentReason?: string;
  schedule?: {
    startDate?: string;
    duration?: number;
    milestones?: string[];
  };
  qualifications?: {
    bondCapacity?: number;
    insurance?: boolean;
    references?: string[];
    experience?: number;
  };
  alternates?: Array<{
    description: string;
    amount: number;
  }>;
}

export interface TradeBids {
  tradeId: string;
  tradeName: string;
  csiDivision?: string;
  bids: Bid[];
  selectedBid?: string;
  aiRecommendation?: string;
  riskLevel: "low" | "medium" | "high";
  variance: number;
  averageBid?: number;
  lowestBid?: number;
  highestBid?: number;
  bidDueDate?: string;
  scopeDescription?: string;
  biddingStatus: "pending" | "open" | "closed" | "awarded";
  createdAt: string;
  updatedAt: string;
}

export interface BidLevelingFilters {
  search?: string;
  tradeId?: string;
  status?: string;
  riskLevel?: string;
  amountMin?: number;
  amountMax?: number;
  biddingStatus?: string;
}

export interface BidLevelingExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includeNotes: boolean;
  includeAIRecommendations: boolean;
  selectedOnly: boolean;
  groupByTrade: boolean;
}

export interface BidLevelingImportResult {
  success: boolean;
  totalRows: number;
  successfulImports: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
    value?: any;
  }>;
  duplicates: number;
}

export interface BidLevelingSummary {
  totalTrades: number;
  totalBids: number;
  selectedBids: number;
  pendingReviews: number;
  totalValue: number;
  selectedValue: number;
  averageBidsPerTrade: number;
  riskBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
  varianceAnalysis: {
    highVariance: number;
    mediumVariance: number;
    lowVariance: number;
  };
}

export interface BidComparison {
  tradeId: string;
  bidIds: string[];
  criteria: Array<{
    name: string;
    weight: number;
    scores: Record<string, number>;
  }>;
  totalScores: Record<string, number>;
  recommendation: string;
  notes?: string;
}

// Bid Tab Types
export interface BidTabItem {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unitOfMeasure: string;
  unitCost: number;
  subtotal: number;
  notes?: string;
  isIncluded: boolean;
  priority?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VendorBid {
  id: string;
  vendorName: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  totalBid: number;
  bondRate: number;
  bondAmount: number;
  adjustedTotal: number;
  costPerSF?: number;
  isWinner: boolean;
  isPrequalified: boolean;
  needsPrequalification: boolean;
  submittedAt: string;
  notes?: string;
}

export interface BidTab {
  id: string;
  projectId: string;
  tradeName: string;
  csiCode: string;
  csiDescription: string;
  isActive: boolean;
  items: BidTabItem[];
  vendors: VendorBid[];
  generalInclusions: string[];
  scopeRequirements: string[];
  subtotal: number;
  bondRate: number;
  bondAmount: number;
  adjustedTotal: number;
  costPerSF?: number;
  squareFootage?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface BidTabFilters {
  search?: string;
  csiCode?: string;
  tradeName?: string;
  isActive?: boolean;
  hasVendors?: boolean;
  priceMin?: number;
  priceMax?: number;
}

export interface BidTabExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includeVendors: boolean;
  includeItems: boolean;
  includeNotes: boolean;
  selectedTabsOnly: boolean;
}

export interface BidTabImportResult {
  success: boolean;
  totalRows: number;
  successfulImports: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
    value?: any;
  }>;
  duplicates: number;
}

export interface BidTabSummary {
  totalTabs: number;
  activeTabs: number;
  totalValue: number;
  averageTabValue: number;
  tabsWithVendors: number;
  totalVendors: number;
  completedTabs: number;
  csiDivisionBreakdown: Record<string, number>;
  valueByDivision: Record<string, number>;
}

export interface BidTabTemplate {
  id: string;
  name: string;
  csiCode: string;
  description: string;
  defaultItems: Omit<BidTabItem, 'id' | 'createdAt' | 'updatedAt'>[];
  defaultInclusions: string[];
  defaultScopeRequirements: string[];
  isSystemTemplate: boolean;
  createdBy: string;
  createdAt: string;
}