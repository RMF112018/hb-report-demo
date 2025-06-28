"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, ChevronLeft, ChevronRight, X } from "lucide-react"

export function GuidedTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const tourSteps = [
    {
      title: "Welcome to Your Dashboard",
      description:
        "This is your construction management analytics dashboard. Let's take a quick tour of the key features.",
      highlight: "dashboard-header",
    },
    {
      title: "Search and Filters",
      description:
        "Use the search bar to find specific projects or metrics. Apply filters to focus on relevant data by project, phase, or department.",
      highlight: "search-filters",
    },
    {
      title: "Dashboard Tabs",
      description:
        "Navigate between different views: Overview for general metrics, Project Health for KPIs, Analytics for detailed insights, and Reports for generating custom reports.",
      highlight: "dashboard-tabs",
    },
    {
      title: "Edit Mode",
      description:
        "Click the Edit button to customize your dashboard. You can drag cards to reorder them, toggle visibility, and configure settings.",
      highlight: "edit-button",
    },
    {
      title: "AI Insights Panel",
      description:
        "The sidebar shows AI-powered insights and recommendations. Click refresh to get the latest analysis of your project data.",
      highlight: "insights-panel",
    },
    {
      title: "Layout Manager",
      description:
        "Create multiple dashboard layouts for different roles (Field View, Financial View, etc.) and switch between them easily.",
      highlight: "layout-manager",
    },
    {
      title: "Share and Export",
      description:
        "Share your dashboard views with team members or export data for reports. Perfect for stakeholder meetings and project reviews.",
      highlight: "share-export",
    },
  ]

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const closeTour = () => {
    setIsOpen(false)
    setCurrentStep(0)
  }

  const currentTourStep = tourSteps[currentStep]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle>{currentTourStep.title}</DialogTitle>
              <Badge variant="outline">
                {currentStep + 1} of {tourSteps.length}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={closeTour}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-left">{currentTourStep.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress indicator */}
          <div className="flex gap-1">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full ${index <= currentStep ? "bg-blue-600" : "bg-gray-200"}`}
              />
            ))}
          </div>

          {/* Tour content based on current step */}
          <div className="p-4 bg-gray-50 rounded-lg">
            {currentStep === 0 && (
              <div className="text-center">
                <h3 className="font-medium mb-2">Key Features You'll Learn:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Searching and filtering project data</li>
                  <li>• Customizing your dashboard layout</li>
                  <li>• Using AI insights for better decisions</li>
                  <li>• Sharing reports with your team</li>
                </ul>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h3 className="font-medium mb-2">Search Tips:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Search by project name, metric, or insight</li>
                  <li>• Use filters to narrow down results</li>
                  <li>• Combine multiple filters for precise data</li>
                </ul>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="font-medium mb-2">Tab Overview:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • <strong>Overview:</strong> Main dashboard with customizable cards
                  </li>
                  <li>
                    • <strong>Project Health:</strong> KPIs and performance metrics
                  </li>
                  <li>
                    • <strong>Analytics:</strong> Detailed trends and forecasting
                  </li>
                  <li>
                    • <strong>Reports:</strong> Generate and schedule reports
                  </li>
                </ul>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="font-medium mb-2">Edit Mode Features:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Drag and drop cards to reorder</li>
                  <li>• Click the eye icon to hide/show cards</li>
                  <li>• Use the settings icon to configure cards</li>
                  <li>• Changes are saved automatically</li>
                </ul>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h3 className="font-medium mb-2">AI Insights Include:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Delay predictions and risk alerts</li>
                  <li>• Cost overrun warnings</li>
                  <li>• Resource optimization suggestions</li>
                  <li>• Performance improvement recommendations</li>
                </ul>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h3 className="font-medium mb-2">Layout Examples:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • <strong>Field View:</strong> Focus on schedule and safety
                  </li>
                  <li>
                    • <strong>Financial View:</strong> Budget and cost analysis
                  </li>
                  <li>
                    • <strong>Executive View:</strong> High-level KPIs
                  </li>
                  <li>
                    • <strong>Custom:</strong> Create your own layout
                  </li>
                </ul>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <h3 className="font-medium mb-2">Sharing Options:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Generate shareable links with filters</li>
                  <li>• Export data as PDF or CSV</li>
                  <li>• Send via email with custom messages</li>
                  <li>• Set expiration dates for security</li>
                </ul>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep === tourSteps.length - 1 ? (
              <Button onClick={closeTour} className="gap-2">
                Get Started
              </Button>
            ) : (
              <Button onClick={nextStep} className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
