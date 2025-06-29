"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Share2, Edit, RefreshCw } from "lucide-react"

interface ReportPreviewProps {
  reportData?: {
    title: string
    type: string
    project: string
    dateRange: string
    generatedAt: string
    sections: Array<{
      title: string
      content: string
      charts?: number
      tables?: number
    }>
  }
}

const defaultReportData = {
  title: "Weekly Progress Report - Week 3",
  type: "Progress Report",
  project: "Downtown Office Complex",
  dateRange: "January 15-21, 2024",
  generatedAt: "January 22, 2024 at 2:30 PM",
  sections: [
    {
      title: "Executive Summary",
      content:
        "Project is on track with 68% completion. Key milestones achieved this week include foundation completion and steel frame installation.",
      charts: 2,
      tables: 1,
    },
    {
      title: "Schedule Performance",
      content:
        "Current schedule variance is +2 days ahead of baseline. Critical path activities are progressing as planned.",
      charts: 3,
      tables: 2,
    },
    {
      title: "Budget & Costs",
      content:
        "Budget utilization at 65% with actual costs tracking 3% under budget. No significant cost overruns identified.",
      charts: 2,
      tables: 3,
    },
    {
      title: "Quality & Safety",
      content: "Zero safety incidents reported. Quality inspections passed with 98% compliance rate.",
      charts: 1,
      tables: 2,
    },
    {
      title: "Issues & Risks",
      content:
        "2 medium-priority issues identified and mitigation plans in place. Weather delays potential risk for next week.",
      charts: 1,
      tables: 1,
    },
  ],
}

export function ReportPreview({ reportData = defaultReportData }: ReportPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{reportData.title}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex items-center gap-4 text-sm">
                  <span>
                    <strong>Project:</strong> {reportData.project}
                  </span>
                  <span>
                    <strong>Period:</strong> {reportData.dateRange}
                  </span>
                  <Badge variant="outline">{reportData.type}</Badge>
                </div>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Generated on {reportData.generatedAt}</p>
        </CardContent>
      </Card>

      {/* Report Sections Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Report Contents</CardTitle>
          <CardDescription>Preview of report sections and content structure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {reportData.sections.map((section, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-base">{section.title}</h4>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  {section.charts && (
                    <Badge variant="secondary" className="text-xs">
                      {section.charts} Charts
                    </Badge>
                  )}
                  {section.tables && (
                    <Badge variant="secondary" className="text-xs">
                      {section.tables} Tables
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              {index < reportData.sections.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Report Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Report Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{reportData.sections.length}</div>
              <div className="text-sm text-muted-foreground">Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {reportData.sections.reduce((acc, section) => acc + (section.charts || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Charts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {reportData.sections.reduce((acc, section) => acc + (section.tables || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Tables</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">~12</div>
              <div className="text-sm text-muted-foreground">Pages</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
