"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, FileText, Clock, CheckCircle, DollarSign, Building, Users, Calendar, TrendingUp } from "lucide-react"
import { AiaPayApplicationList } from "./AiaPayApplicationList"
import { AiaPayApplicationForm } from "./AiaPayApplicationForm"
import { AiaInsightsPanel } from "./AiaInsightsPanel"
import type { AiaPayApplication, AiaApplicationSummary } from "@/types/aia-pay-application"

interface PayApplicationProps {
  userRole: string
  projectData: any
}

export function PayApplication({ userRole, projectData }: PayApplicationProps) {
  const [applications, setApplications] = useState<AiaPayApplication[]>([])
  const [summary, setSummary] = useState<AiaApplicationSummary | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<AiaPayApplication | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<'list' | 'form'>('list')

  // Role-based data scaling
  const roleMultiplier = useMemo(() => {
    switch (userRole) {
      case "project-manager": return 1 // Single project
      case "project-executive": return 6 // Six projects
      case "executive": return 10 // All projects
      default: return 1
    }
  }, [userRole])

  // Extract selected project from projectData
  const selectedProject = projectData?.selectedProject
  const projectId = selectedProject?.id || "proj_001"
  const projectName = selectedProject?.name || "Downtown Mixed-Use Development"

  useEffect(() => {
    loadApplications()
  }, [userRole, selectedProject])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch("/data/mock/financial/aia-pay-applications.json")
      const data = await response.json()

      // Apply role-based filtering and scaling
      let filteredApplications = data.applications || []
      
      // If a specific project is selected (for Executive/Project Executive), filter to that project
      if (selectedProject && (userRole === "executive" || userRole === "project-executive")) {
        filteredApplications = filteredApplications.filter((app: AiaPayApplication) => 
          app.projectId === selectedProject.id
        )
      }

      // Scale data based on role
      const scaledApplications = []
      for (let i = 0; i < roleMultiplier; i++) {
        filteredApplications.forEach((app: AiaPayApplication) => {
          const scaledApp = {
            ...app,
            id: `${app.id}_${i}`,
            projectName: i === 0 ? app.projectName : `${app.projectName} ${i + 1}`,
            applicationNumber: app.applicationNumber + (i * 10),
            contractSum: app.contractSum * (0.8 + Math.random() * 0.4), // Vary amounts
            netAmountDue: app.netAmountDue * (0.8 + Math.random() * 0.4),
            totalEarned: app.totalEarned * (0.8 + Math.random() * 0.4),
          }
          scaledApplications.push(scaledApp)
        })
      }

      setApplications(scaledApplications)

      // Calculate summary
      const summaryData: AiaApplicationSummary = {
        totalApplications: scaledApplications.length,
        pendingApproval: scaledApplications.filter(app => 
          ["submitted", "pm_approved"].includes(app.status)
        ).length,
        approvedThisMonth: scaledApplications.filter(app => 
          app.status === "px_approved" && 
          new Date(app.lastModifiedDate).getMonth() === new Date().getMonth()
        ).length,
        totalAmountRequested: scaledApplications.reduce((sum, app) => sum + app.netAmountDue, 0),
        totalAmountApproved: scaledApplications
          .filter(app => ["px_approved", "executive_approved", "paid"].includes(app.status))
          .reduce((sum, app) => sum + app.netAmountDue, 0),
        averageApprovalTime: 3.2 + Math.random() * 2, // Vary approval time
        statusBreakdown: {
          draft: scaledApplications.filter(app => app.status === "draft").length,
          submitted: scaledApplications.filter(app => app.status === "submitted").length,
          pmApproved: scaledApplications.filter(app => app.status === "pm_approved").length,
          pxApproved: scaledApplications.filter(app => app.status === "px_approved").length,
          executiveApproved: scaledApplications.filter(app => app.status === "executive_approved").length,
          rejected: scaledApplications.filter(app => app.status === "rejected").length,
          paid: scaledApplications.filter(app => app.status === "paid").length,
        },
        recentApplications: scaledApplications
          .sort((a, b) => new Date(b.lastModifiedDate).getTime() - new Date(a.lastModifiedDate).getTime())
          .slice(0, 5)
          .map(app => ({
            id: app.id,
            applicationNumber: app.applicationNumber,
            status: app.status,
            amount: app.netAmountDue,
            submittedDate: app.submittedDate || app.createdDate,
          })),
      }

      setSummary(summaryData)
    } catch (error) {
      console.error("Error loading AIA applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectApplication = (application: AiaPayApplication) => {
    setSelectedApplication(application)
    setActiveView('form')
  }

  const handleCreateApplication = () => {
    setSelectedApplication(null)
    setActiveView('form')
  }

  const handleSaveApplication = async (application: AiaPayApplication) => {
    // In a real app, this would save to the backend
    if (selectedApplication) {
      // Update existing application
      setApplications(prev => prev.map(app => 
        app.id === selectedApplication.id ? application : app
      ))
    } else {
      // Add new application
      const newApp = {
        ...application,
        id: `aia_${Date.now()}`,
        createdDate: new Date().toISOString(),
        createdBy: "current_user@example.com"
      }
      setApplications(prev => [...prev, newApp])
    }
    
    setActiveView('list')
    setSelectedApplication(null)
    loadApplications() // Refresh data
  }

  const handleCancelForm = () => {
    setActiveView('list')
    setSelectedApplication(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading AIA Pay Applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between" data-tour="pay-app-header">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            AIA Pay Applications
          </h2>
          <p className="text-muted-foreground mt-1">
            Generate and manage formal AIA G702/G703 payment applications for {projectName}
          </p>
        </div>
        {activeView === 'list' && (
          <Button 
            onClick={handleCreateApplication} 
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            data-tour="pay-app-create-button"
          >
            <Plus className="h-4 w-4" />
            New Application
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      {summary && activeView === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-tour="pay-app-summary-cards">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800" data-tour="pay-app-total-applications">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Applications</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{summary.totalApplications}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Across all projects</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800" data-tour="pay-app-pending-approval">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Pending Approval</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{summary.pendingApproval}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Awaiting review</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800" data-tour="pay-app-approved-month">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Approved This Month</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{summary.approvedThisMonth}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">Ready for payment</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800" data-tour="pay-app-total-approved">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Approved</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {formatCurrency(summary.totalAmountApproved)}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Current period</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* HBI AI Insights */}
      {activeView === 'list' && (
        <div data-tour="pay-app-hbi-insights">
          <AiaInsightsPanel 
            applications={applications}
            projectId={projectId}
          />
        </div>
      )}

      {/* Main Content */}
      {activeView === 'list' ? (
        <div data-tour="pay-app-applications-list">
          <AiaPayApplicationList
            applications={applications}
            onSelectApplication={handleSelectApplication}
            onRefresh={loadApplications}
          />
        </div>
      ) : (
        <div data-tour="pay-app-application-form">
          <AiaPayApplicationForm
            application={selectedApplication}
            projectId={projectId}
            onSave={handleSaveApplication}
            onCancel={handleCancelForm}
          />
        </div>
      )}
    </div>
  )
} 