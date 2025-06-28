export interface ReportSection {
  id: string
  title: string
  contentType: string
  paperSize: "letter" | "tabloid"
  orientation: "portrait" | "landscape"
  order: number
  required: boolean
  enabled: boolean
  lastUpdated?: string
  dataSource?: string
  pageCount?: number
  reviewed?: boolean
}

export interface ReportTemplate {
  id: string
  name: string
  type: "financial-review" | "monthly-progress" | "monthly-owner"
  sections: ReportSection[]
  distributionSettings?: DistributionSettings
}

export interface DistributionSettings {
  emailEnabled: boolean
  recipients: string[]
  subject: string
  message: string
  attachPdf: boolean
  scheduledDelivery?: string
  autoDistribute: boolean
}

export interface ReportConfiguration {
  id: string
  name: string
  type: "financial-review" | "monthly-progress" | "monthly-owner"
  projectId: string
  projectName: string
  sections: ReportSection[]
  distributionSettings?: DistributionSettings
  createdAt: string
  updatedAt: string
  isDefault?: boolean
}

export interface AIsuggestion {
  id: string
  type: "section-addition" | "layout-improvement" | "content-enhancement"
  title: string
  description: string
  impact: "low" | "medium" | "high"
  suggestedSection?: Partial<ReportSection>
  reasoning: string
}

export interface SectionTemplate {
  contentType: string
  title: string
  defaultPaperSize: "letter" | "tabloid"
  defaultOrientation: "portrait" | "landscape"
  category: string
  description: string
  dataSource: string
  estimatedPages: number
  requiredFor: string[]
}

export interface ReviewChecklistItem {
  sectionId: string
  sectionTitle: string
  reviewed: boolean
  hasContent: boolean
  lastUpdated?: string
  issues?: string[]
}

export interface CustomizerState {
  currentReport: ReportConfiguration | null
  availableSections: SectionTemplate[]
  aiSuggestions: AIsuggestion[]
  reviewChecklist: ReviewChecklistItem[]
  previewMode: boolean
  isDirty: boolean
  lastSaved?: string
}
