"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Copy } from "lucide-react"

const templates = [
  {
    id: "weekly-progress",
    name: "Weekly Progress Report",
    description: "Comprehensive weekly project status and progress tracking",
    category: "Progress",
    lastUsed: "2024-01-15",
    usage: 45,
  },
  {
    id: "financial-summary",
    name: "Financial Summary",
    description: "Budget tracking, costs, and financial projections",
    category: "Financial",
    lastUsed: "2024-01-14",
    usage: 32,
  },
  {
    id: "safety-report",
    name: "Safety & Compliance Report",
    description: "Safety incidents, compliance status, and risk assessment",
    category: "Safety",
    lastUsed: "2024-01-13",
    usage: 28,
  },
  {
    id: "schedule-analysis",
    name: "Schedule Analysis",
    description: "Timeline tracking, milestones, and schedule variance",
    category: "Schedule",
    lastUsed: "2024-01-12",
    usage: 38,
  },
]

export function ReportTemplates() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Report Templates</h3>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="text-sm mt-1">{template.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>Used {template.usage} times</span>
                <span>Last used: {template.lastUsed}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
