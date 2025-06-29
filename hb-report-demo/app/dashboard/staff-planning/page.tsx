'use client'

import { useAuth } from '@/context/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, AlertTriangle, TrendingUp, Building2, FileText, CheckCircle2, Clock } from 'lucide-react'
import { AppHeader } from '@/components/layout/app-header'

// Import role-specific components
import { ExecutiveStaffingView } from '@/components/staffing/ExecutiveStaffingView'
import { ProjectExecutiveStaffingView } from '@/components/staffing/ProjectExecutiveStaffingView'
import { ProjectManagerStaffingView } from '@/components/staffing/ProjectManagerStaffingView'

// Import shared components
import { StaffingOverview } from '@/components/staffing/StaffingOverview'
import { SpcrManagement } from '@/components/staffing/SpcrManagement'


export default function StaffPlanningPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading staffing data...</p>
        </div>
      </div>
    )
  }

  const getPageTitle = () => {
    switch (user.role) {
      case 'executive':
        return 'Global Staffing Management'
      case 'project-executive':
        return 'Portfolio Staffing Dashboard'
      case 'project-manager':
        return 'Project Staffing Management'
      default:
        return 'Staffing Management'
    }
  }

  const getPageDescription = () => {
    switch (user.role) {
      case 'executive':
        return 'Comprehensive staffing oversight across all projects and resources'
      case 'project-executive':
        return 'Manage staffing for your portfolio of projects with performance analytics'
      case 'project-manager':
        return 'Detailed team management for your assigned project with responsibility tracking'
      default:
        return 'Staff planning and resource management'
    }
  }

  const getRoleBadge = () => {
    switch (user.role) {
      case 'executive':
        return <Badge variant="default" className="bg-purple-500">Executive</Badge>
      case 'project-executive':
        return <Badge variant="default" className="bg-blue-500">Project Executive</Badge>
      case 'project-manager':
        return <Badge variant="default" className="bg-green-500">Project Manager</Badge>
      default:
        return <Badge variant="outline">{user.role}</Badge>
    }
  }

  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case 'executive':
        return (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="staffing">Staff Management</TabsTrigger>
              <TabsTrigger value="spcr">SPCR Approvals</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <StaffingOverview userRole={user.role} />
            </TabsContent>

            <TabsContent value="staffing">
              <ExecutiveStaffingView />
            </TabsContent>

            <TabsContent value="spcr">
              <SpcrManagement userRole={user.role} />
            </TabsContent>
          </Tabs>
        )

      case 'project-executive':
        return (
          <Tabs defaultValue="portfolio" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="portfolio">Portfolio Overview</TabsTrigger>
              <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
              <TabsTrigger value="spcr">SPCR Management</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio">
              <div className="space-y-6">
                <StaffingOverview userRole={user.role} />
                <ProjectExecutiveStaffingView />
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <ProjectExecutiveStaffingView />
            </TabsContent>

            <TabsContent value="spcr">
              <SpcrManagement userRole={user.role} />
            </TabsContent>
          </Tabs>
        )

      case 'project-manager':
        return (
          <Tabs defaultValue="team" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="team">Team Management</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="spcr">SPCRs</TabsTrigger>
            </TabsList>

            <TabsContent value="team">
              <div className="space-y-6">
                <StaffingOverview userRole={user.role} />
                <ProjectManagerStaffingView />
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <ProjectManagerStaffingView />
            </TabsContent>

            <TabsContent value="spcr">
              <SpcrManagement userRole={user.role} />
            </TabsContent>
          </Tabs>
        )

      default:
        return (
          <div className="space-y-6">
            <StaffingOverview userRole={user.role} />
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Limited Access</h3>
                  <p className="text-muted-foreground">
                    Your current role has limited access to staffing management features. 
                    Contact your administrator for additional permissions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* App Header */}
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{getPageTitle()}</h1>
                {getRoleBadge()}
              </div>
              <p className="text-muted-foreground text-lg">{getPageDescription()}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Card className="px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Logged in as:</span>
                  <span>{user.firstName} {user.lastName}</span>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {renderRoleSpecificContent()}
        </div>

        {/* Help Section */}
        <div className="mt-12 border-t pt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Getting Started</h4>
                  <p className="text-muted-foreground">
                    Learn how to use the staffing management features and understand your role-specific capabilities.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">SPCR Process</h4>
                  <p className="text-muted-foreground">
                    Understand the Staffing Plan Change Request workflow and approval process.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Support</h4>
                  <p className="text-muted-foreground">
                    Contact your system administrator for additional permissions or technical support.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 