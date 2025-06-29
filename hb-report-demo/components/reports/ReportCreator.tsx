"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
  Save,
  Upload,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  FileText,
  Layout,
  Zap,
  Clock,
  Settings,
  Brain,
  Target,
  BarChart3,
  PieChart,
  Image,
  Table,
  Type,
  Calendar,
  DollarSign
} from "lucide-react"
import type { Report, ReportSection } from "@/types/report-types"

interface SortableSectionProps {
  section: ReportSection
  onUpdate: (section: ReportSection) => void
  onRemove: (sectionId: string) => void
  isRequired: boolean
}

function SortableSection({ section, onUpdate, onRemove, isRequired }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getSectionIcon = (contentType: string) => {
    switch (contentType) {
      case "financial-forecast-memo":
      case "financial-summary":
        return <DollarSign className="h-4 w-4" />
      case "schedule-performance":
      case "schedule-monitor":
        return <Calendar className="h-4 w-4" />
      case "progress-photos":
        return <Image className="h-4 w-4" />
      case "procore-budget-snapshot":
      case "sage-job-cost-history":
        return <Table className="h-4 w-4" />
      case "cover-page":
      case "executive-summary":
        return <Type className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`bg-white dark:bg-gray-800 border rounded-lg p-4 transition-all ${
        isDragging ? "opacity-50 shadow-lg" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            {getSectionIcon(section.contentType)}
            <h4 className="font-medium text-foreground">{section.title}</h4>
            {isRequired && (
              <Badge variant="secondary" className="text-xs">
                Required
              </Badge>
            )}
            {section.reviewed && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch 
            checked={section.enabled} 
            onCheckedChange={(enabled) => onUpdate({ ...section, enabled })} 
          />
          {!isRequired && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(section.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-muted-foreground">Paper Size</Label>
          <Select
            value={section.paperSize}
            onValueChange={(paperSize: "letter" | "tabloid") => onUpdate({ ...section, paperSize })}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="letter">Letter (8.5" × 11")</SelectItem>
              <SelectItem value="tabloid">Tabloid (11" × 17")</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Orientation</Label>
          <Select
            value={section.orientation}
            onValueChange={(orientation: "portrait" | "landscape") => onUpdate({ ...section, orientation })}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Source: {section.dataSource || "Manual"}</span>
        <span>
          {section.pageCount || 1} page{(section.pageCount || 1) !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  )
}

interface ReportCreatorProps {
  reportId?: string
  templateId?: string
  onSave?: (report: Report) => void
  onCancel?: () => void
}

export function ReportCreator({ reportId, templateId, onSave, onCancel }: ReportCreatorProps) {
  const { toast } = useToast()
  
  // State management
  const [currentReport, setCurrentReport] = useState<Partial<Report> | null>(null)
  const [availableSections, setAvailableSections] = useState<any[]>([])
  const [isDirty, setIsDirty] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>()
  const [loading, setLoading] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Available section templates
  const sectionTemplates = [
    {
      id: "financial-forecast-memo",
      title: "Financial Forecast Memo",
      contentType: "financial-forecast-memo",
      description: "Executive summary of project financial performance and forecast",
      category: "Financial",
      defaultPaperSize: "letter" as const,
      defaultOrientation: "portrait" as const,
      dataSource: "Procore",
      estimatedPages: 3,
      requiredFor: ["financial-review", "monthly-progress"]
    },
    {
      id: "procore-budget-snapshot",
      title: "Budget Snapshot",
      contentType: "procore-budget-snapshot",
      description: "Current project budget status with cost breakdown",
      category: "Financial",
      defaultPaperSize: "tabloid" as const,
      defaultOrientation: "landscape" as const,
      dataSource: "Procore API",
      estimatedPages: 4,
      requiredFor: ["financial-review", "monthly-progress"]
    },
    {
      id: "sage-job-cost-history",
      title: "Job Cost History",
      contentType: "sage-job-cost-history",
      description: "Historical cost analysis and trends",
      category: "Financial",
      defaultPaperSize: "tabloid" as const,
      defaultOrientation: "landscape" as const,
      dataSource: "Sage Integration",
      estimatedPages: 3,
      requiredFor: ["financial-review"]
    },
    {
      id: "gc-gr-forecast",
      title: "GC & GR Forecast",
      contentType: "gc-gr-forecast",
      description: "General conditions and general requirements forecast",
      category: "Financial",
      defaultPaperSize: "tabloid" as const,
      defaultOrientation: "landscape" as const,
      dataSource: "Financial Hub",
      estimatedPages: 2,
      requiredFor: ["financial-review", "monthly-progress"]
    },
    {
      id: "cover-page",
      title: "Cover Page",
      contentType: "cover-page",
      description: "Professional report cover with project information",
      category: "General",
      defaultPaperSize: "letter" as const,
      defaultOrientation: "portrait" as const,
      dataSource: "Manual",
      estimatedPages: 1,
      requiredFor: ["monthly-progress", "monthly-owner"]
    },
    {
      id: "executive-summary",
      title: "Executive Summary",
      contentType: "executive-summary",
      description: "High-level project overview and key metrics",
      category: "General",
      defaultPaperSize: "letter" as const,
      defaultOrientation: "portrait" as const,
      dataSource: "AI Generated",
      estimatedPages: 2,
      requiredFor: ["monthly-progress"]
    },
    {
      id: "schedule-performance",
      title: "Schedule Performance",
      contentType: "schedule-performance",
      description: "Detailed schedule analysis and milestone tracking",
      category: "Schedule",
      defaultPaperSize: "tabloid" as const,
      defaultOrientation: "landscape" as const,
      dataSource: "P6 Integration",
      estimatedPages: 4,
      requiredFor: ["monthly-progress"]
    },
    {
      id: "progress-photos",
      title: "Progress Photos",
      contentType: "progress-photos",
      description: "Visual documentation of project progress",
      category: "Visual",
      defaultPaperSize: "letter" as const,
      defaultOrientation: "landscape" as const,
      dataSource: "Photo Management",
      estimatedPages: 6,
      requiredFor: ["monthly-owner"]
    },
    {
      id: "schedule-monitor",
      title: "Schedule Monitor",
      contentType: "schedule-monitor",
      description: "High-level schedule status and critical path analysis",
      category: "Schedule",
      defaultPaperSize: "tabloid" as const,
      defaultOrientation: "landscape" as const,
      dataSource: "P6 Integration",
      estimatedPages: 3,
      requiredFor: ["monthly-owner"]
    },
    {
      id: "safety-summary",
      title: "Safety Summary",
      contentType: "safety-summary",
      description: "Safety performance metrics and incident reports",
      category: "Safety",
      defaultPaperSize: "letter" as const,
      defaultOrientation: "portrait" as const,
      dataSource: "Safety Database",
      estimatedPages: 2,
      requiredFor: []
    },
    {
      id: "quality-control",
      title: "Quality Control",
      contentType: "quality-control",
      description: "Quality metrics and inspection results",
      category: "Quality",
      defaultPaperSize: "letter" as const,
      defaultOrientation: "portrait" as const,
      dataSource: "QC System",
      estimatedPages: 3,
      requiredFor: []
    },
    {
      id: "procurement-status",
      title: "Procurement Status",
      contentType: "procurement-status",
      description: "Material procurement and delivery status",
      category: "Procurement",
      defaultPaperSize: "tabloid" as const,
      defaultOrientation: "landscape" as const,
      dataSource: "Procurement System",
      estimatedPages: 5,
      requiredFor: []
    }
  ]

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setAvailableSections(sectionTemplates)

        // Create new report or load existing
        if (reportId) {
          // Load existing report - in a real app, this would be an API call
          // For demo, we'll create a basic structure
          setCurrentReport({
            id: reportId,
            name: "Existing Report",
            type: "financial-review",
            projectId: "1",
            projectName: "Demo Project",
            sections: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
            tags: [],
            metadata: {
              sectionCount: 0,
              pageCount: 0,
              size: "0 MB",
              automationLevel: 0
            }
          })
        } else if (templateId) {
          // Create from template
          const templateSections = getTemplateSections(templateId)
          setCurrentReport({
            id: `rpt-${Date.now()}`,
            name: `New ${getTemplateName(templateId)} Report`,
            type: templateId as any,
            projectId: "1",
            projectName: "Select Project",
            sections: templateSections,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
            tags: [],
            metadata: {
              sectionCount: templateSections.length,
              pageCount: templateSections.reduce((sum, s) => sum + (s.pageCount || 1), 0),
              size: "0 MB",
              automationLevel: 0
            }
          })
        } else {
          // Create blank report
          setCurrentReport({
            id: `rpt-${Date.now()}`,
            name: "New Report",
            type: "financial-review",
            projectId: "1",
            projectName: "Select Project",
            sections: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
            tags: [],
            metadata: {
              sectionCount: 0,
              pageCount: 0,
              size: "0 MB",
              automationLevel: 0
            }
          })
        }
      } catch (error) {
        console.error("Failed to load data:", error)
        toast({
          title: "Error",
          description: "Failed to load report data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [reportId, templateId, toast])

  const getTemplateName = (templateId: string) => {
    switch (templateId) {
      case "financial-review":
        return "Financial Review"
      case "monthly-progress":
        return "Monthly Progress"
      case "monthly-owner":
        return "Monthly Owner"
      default:
        return "Report"
    }
  }

  const getTemplateSections = (templateId: string): ReportSection[] => {
    const requiredSections = sectionTemplates.filter(template => 
      template.requiredFor.includes(templateId)
    )

    return requiredSections.map((template, index) => ({
      id: `sec-${Date.now()}-${index}`,
      title: template.title,
      contentType: template.contentType,
      paperSize: template.defaultPaperSize,
      orientation: template.defaultOrientation,
      order: index + 1,
      required: true,
      enabled: true,
      lastUpdated: new Date().toISOString(),
      dataSource: template.dataSource,
      pageCount: template.estimatedPages,
      reviewed: false
    }))
  }

  // Auto-save functionality
  useEffect(() => {
    if (isDirty) {
      const autoSaveTimer = setTimeout(() => {
        saveToLocalStorage()
      }, 2000)

      return () => clearTimeout(autoSaveTimer)
    }
  }, [isDirty])

  const saveToLocalStorage = useCallback(() => {
    if (currentReport) {
      const key = `report-config-${currentReport.id}`
      localStorage.setItem(key, JSON.stringify(currentReport))
      setLastSaved(new Date().toISOString())
      setIsDirty(false)

      toast({
        title: "Auto-saved",
        description: "Report configuration saved automatically"
      })
    }
  }, [currentReport, toast])

  const handleSectionUpdate = useCallback(
    (updatedSection: ReportSection) => {
      if (!currentReport) return

      const updatedSections = currentReport.sections?.map((section) =>
        section.id === updatedSection.id ? updatedSection : section
      ) || []

      setCurrentReport({
        ...currentReport,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
        metadata: {
          ...currentReport.metadata!,
          sectionCount: updatedSections.length,
          pageCount: updatedSections.reduce((sum, s) => sum + (s.pageCount || 1), 0)
        }
      })
      setIsDirty(true)
    },
    [currentReport]
  )

  const handleSectionRemove = useCallback(
    (sectionId: string) => {
      if (!currentReport) return

      const updatedSections = currentReport.sections?.filter((section) => section.id !== sectionId) || []

      setCurrentReport({
        ...currentReport,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
        metadata: {
          ...currentReport.metadata!,
          sectionCount: updatedSections.length,
          pageCount: updatedSections.reduce((sum, s) => sum + (s.pageCount || 1), 0)
        }
      })
      setIsDirty(true)
    },
    [currentReport]
  )

  const handleAddSection = useCallback(
    (template: any) => {
      if (!currentReport) return

      const newSection: ReportSection = {
        id: `sec-${Date.now()}`,
        title: template.title,
        contentType: template.contentType,
        paperSize: template.defaultPaperSize,
        orientation: template.defaultOrientation,
        order: (currentReport.sections?.length || 0) + 1,
        required: template.requiredFor.includes(currentReport.type),
        enabled: true,
        lastUpdated: new Date().toISOString(),
        dataSource: template.dataSource,
        pageCount: template.estimatedPages,
        reviewed: false
      }

      const updatedSections = [...(currentReport.sections || []), newSection]

      setCurrentReport({
        ...currentReport,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
        metadata: {
          ...currentReport.metadata!,
          sectionCount: updatedSections.length,
          pageCount: updatedSections.reduce((sum, s) => sum + (s.pageCount || 1), 0)
        }
      })
      setIsDirty(true)
    },
    [currentReport]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id && currentReport && currentReport.sections) {
        const oldIndex = currentReport.sections.findIndex((section) => section.id === active.id)
        const newIndex = currentReport.sections.findIndex((section) => section.id === over.id)

        const reorderedSections = arrayMove(currentReport.sections, oldIndex, newIndex).map((section, index) => ({
          ...section,
          order: index + 1
        }))

        setCurrentReport({
          ...currentReport,
          sections: reorderedSections,
          updatedAt: new Date().toISOString()
        })
        setIsDirty(true)
      }
    },
    [currentReport]
  )

  const handleSave = useCallback(() => {
    if (currentReport) {
      saveToLocalStorage()
      onSave?.(currentReport as Report)

      toast({
        title: "Report Saved",
        description: "Your report configuration has been saved successfully"
      })
    }
  }, [currentReport, onSave, saveToLocalStorage, toast])

  const completionPercentage = useMemo(() => {
    if (!currentReport?.sections?.length) return 0
    const reviewedCount = currentReport.sections.filter((section) => section.reviewed).length
    return Math.round((reviewedCount / currentReport.sections.length) * 100)
  }, [currentReport])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading report creator...</p>
        </div>
      </div>
    )
  }

  if (!currentReport) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Failed to load report configuration</p>
          <Button onClick={onCancel}>Close</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Report Configuration Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="report-name">Report Name</Label>
              <Input
                id="report-name"
                value={currentReport.name || ""}
                onChange={(e) => {
                  setCurrentReport({
                    ...currentReport,
                    name: e.target.value,
                    updatedAt: new Date().toISOString()
                  })
                  setIsDirty(true)
                }}
              />
            </div>
            <div>
              <Label htmlFor="report-type">Report Type</Label>
              <Select 
                value={currentReport.type} 
                onValueChange={(type: any) => {
                  setCurrentReport({
                    ...currentReport,
                    type,
                    updatedAt: new Date().toISOString()
                  })
                  setIsDirty(true)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial-review">Financial Review</SelectItem>
                  <SelectItem value="monthly-progress">Monthly Progress Report</SelectItem>
                  <SelectItem value="monthly-owner">Monthly Owner Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {currentReport.sections?.length || 0} sections • {currentReport.metadata?.pageCount || 0} pages
              </span>
              {lastSaved && (
                <span className="text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Saved {new Date(lastSaved).toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Progress value={completionPercentage} className="w-24 h-2" />
              <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sections Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Report Sections
              </CardTitle>
              <CardDescription>
                Drag and drop to reorder sections. Configure paper size and orientation for each section.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext 
                  items={currentReport.sections?.map((s) => s.id) || []} 
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {currentReport.sections?.map((section) => (
                      <SortableSection
                        key={section.id}
                        section={section}
                        onUpdate={handleSectionUpdate}
                        onRemove={handleSectionRemove}
                        isRequired={section.required}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {!currentReport.sections?.length && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No sections added yet. Add sections from the available templates.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Available Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Available Sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {sectionTemplates
                    .filter(
                      (template) =>
                        !currentReport.sections?.some((section) => section.contentType === template.contentType)
                    )
                    .map((template) => (
                      <div
                        key={template.contentType}
                        className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        onClick={() => handleAddSection(template)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{template.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {template.defaultPaperSize}/{template.defaultOrientation}
                          </span>
                          <span>{template.estimatedPages} pages</span>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900 border-indigo-200 dark:border-indigo-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
                <Brain className="h-5 w-5" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium text-sm text-indigo-800 dark:text-indigo-200">Content Optimization</span>
                </div>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-2">
                  Consider adding a Safety Summary section for better stakeholder engagement
                </p>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Apply Suggestion
                </Button>
              </div>
              
              <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium text-sm text-indigo-800 dark:text-indigo-200">Layout Improvement</span>
                </div>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-2">
                  Budget sections perform better in landscape orientation
                </p>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Apply Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t pt-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} className="bg-[#FF6B35] hover:bg-[#E55A2B]">
            <Save className="h-4 w-4 mr-2" />
            Save Report
          </Button>
        </div>
      </div>
    </div>
  )
} 