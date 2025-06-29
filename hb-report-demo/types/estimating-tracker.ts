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