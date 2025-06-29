"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/context/auth-context"
import {
  Upload,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Zap,
  Shield,
  BookOpen,
  Building,
  FileCheck,
  TrendingUp,
  Users,
  Calendar,
  Tag,
  Archive,
  Settings,
  MoreHorizontal,
  ChevronRight,
  AlertCircle,
  XCircle
} from "lucide-react"
import { format } from "date-fns"

// Mock data for documents
const mockDocuments = [
  {
    id: "doc-001",
    name: "Prime Contract - Wilshire Tower",
    type: "Prime Contract",
    status: "Under Review",
    uploadDate: "2024-01-15",
    reviewer: "Sarah Chen",
    priority: "High",
    complianceScore: 85,
    riskLevel: "Medium",
    aiAnalysisStatus: "Complete",
    tags: ["Contract", "High Value", "Risk Assessment"],
    size: "2.3 MB",
    pages: 47,
    keyRisks: ["Payment Terms", "Change Order Process", "Liquidated Damages"],
    opportunities: ["Early Completion Bonus", "Material Escalation"],
    project: "Wilshire Tower Construction"
  },
  {
    id: "doc-002", 
    name: "Electrical Subcontract Agreement",
    type: "Subcontract",
    status: "Approved",
    uploadDate: "2024-01-12",
    reviewer: "Mike Johnson",
    priority: "Medium",
    complianceScore: 92,
    riskLevel: "Low",
    aiAnalysisStatus: "Complete",
    tags: ["Subcontract", "Electrical", "Approved"],
    size: "1.8 MB",
    pages: 32,
    keyRisks: ["Performance Bond", "Insurance Requirements"],
    opportunities: ["Volume Discount", "Extended Warranty"],
    project: "Downtown Office Complex"
  },
  {
    id: "doc-003",
    name: "Building Code Updates - 2024",
    type: "Regulatory",
    status: "Action Required",
    uploadDate: "2024-01-10",
    reviewer: "Alex Rodriguez",
    priority: "High",
    complianceScore: 78,
    riskLevel: "High",
    aiAnalysisStatus: "In Progress",
    tags: ["Building Code", "Regulatory", "Compliance"],
    size: "5.2 MB",
    pages: 156,
    keyRisks: ["Code Compliance", "Retrofit Requirements", "Timeline Impact"],
    opportunities: ["Energy Efficiency Credits", "Tax Incentives"],
    project: "Multiple Projects"
  }
]

const mockAnalytics = {
  totalDocuments: 247,
  pendingReview: 18,
  highRiskDocuments: 12,
  complianceRate: 94,
  avgReviewTime: 3.2,
  aiInsightsGenerated: 156,
  costSavingsIdentified: 485000,
  riskItemsResolved: 89
}

export default function ContractDocumentsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLoading(false)
    }
    loadData()
  }, [])

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.project.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || doc.status === filterStatus
      const matchesType = filterType === "all" || doc.type === filterType
      return matchesSearch && matchesStatus && matchesType
    })
  }, [searchTerm, filterStatus, filterType])

  const openDocumentModal = useCallback((document: any) => {
    setSelectedDocument(document)
    setShowDocumentModal(true)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "Under Review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Action Required":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "text-red-600 dark:text-red-400"
      case "Medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "Low":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003087] mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading document compliance platform...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Contract Documents
              </h1>
              <p className="text-muted-foreground mt-1">
                AI-powered document compliance and risk analysis platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="bg-[#FF6B35] hover:bg-[#FF5722] text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="border-l-4 border-l-[#003087]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#003087] dark:text-white">
                  {mockAnalytics.totalDocuments}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +15% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#FF6B35]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#FF6B35]">
                  {mockAnalytics.pendingReview}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Avg {mockAnalytics.avgReviewTime} days
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  High Risk Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {mockAnalytics.highRiskDocuments}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  Require attention
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Compliance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {mockAnalytics.complianceRate}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Above target
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockDocuments.slice(0, 3).map((doc, index) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.type}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Insights Summary */}
                <Card className="border-l-4 border-l-[#FF6B35]">
                  <CardHeader>
                    <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                      <Brain className="h-5 w-5 text-[#FF6B35]" />
                      HBI AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-l-blue-500">
                        <div className="font-medium text-sm text-blue-800 dark:text-blue-300">
                          Cost Optimization Opportunity
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          3 contracts show potential for $125K savings through renegotiation
                        </div>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-l-red-500">
                        <div className="font-medium text-sm text-red-800 dark:text-red-300">
                          Risk Alert
                        </div>
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                          New building code changes affect 5 active contracts
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-l-green-500">
                        <div className="font-medium text-sm text-green-800 dark:text-green-300">
                          Compliance Achievement
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                          All safety documentation is up to date
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#003087] dark:text-white">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-2">
                        ${(mockAnalytics.costSavingsIdentified / 1000).toFixed(0)}K
                      </div>
                      <p className="text-sm text-muted-foreground">Cost Savings Identified</p>
                      <Progress value={75} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                        {mockAnalytics.aiInsightsGenerated}
                      </div>
                      <p className="text-sm text-muted-foreground">AI Insights Generated</p>
                      <Progress value={85} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {mockAnalytics.riskItemsResolved}
                      </div>
                      <p className="text-sm text-muted-foreground">Risk Items Resolved</p>
                      <Progress value={92} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="all">All Status</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Action Required">Action Required</option>
                    </select>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="all">All Types</option>
                      <option value="Prime Contract">Prime Contract</option>
                      <option value="Subcontract">Subcontract</option>
                      <option value="Regulatory">Regulatory</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#003087] dark:text-white">Document Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Compliance</TableHead>
                        <TableHead>Reviewer</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.project}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{doc.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getStatusColor(doc.status)}>
                              {doc.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${getRiskColor(doc.riskLevel)}`}>
                              {doc.riskLevel}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={doc.complianceScore} className="w-16" />
                              <span className="text-sm">{doc.complianceScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{doc.reviewer}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDocumentModal(doc)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-[#FF6B35]">
                  <CardHeader>
                    <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                      <Brain className="h-5 w-5 text-[#FF6B35]" />
                      HBI Analysis Engine
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Zap className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-blue-800 dark:text-blue-300">
                            Real-time Analysis
                          </span>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          Our HBI engine continuously monitors document changes and provides instant risk assessments.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Risk Detection</span>
                          <span className="text-sm font-medium">98.5% Accuracy</span>
                        </div>
                        <Progress value={98.5} />
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Compliance Checking</span>
                          <span className="text-sm font-medium">96.2% Accuracy</span>
                        </div>
                        <Progress value={96.2} />
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Cost Analysis</span>
                          <span className="text-sm font-medium">94.8% Accuracy</span>
                        </div>
                        <Progress value={94.8} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#003087] dark:text-white">Analysis Queue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF6B35]"></div>
                          <span className="text-sm">Analyzing Building Code Updates</span>
                        </div>
                        <Badge variant="secondary">In Progress</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">HVAC Subcontract Review</span>
                        </div>
                        <Badge variant="outline">Queued</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Prime Contract Analysis</span>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          Complete
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Regulatory Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Building Codes</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Safety Standards</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Environmental</span>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Labor Laws</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                      <FileCheck className="h-5 w-5" />
                      Contract Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment Terms</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Performance Bonds</span>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Insurance Requirements</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Change Orders</span>
                        <XCircle className="h-4 w-4 text-red-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Documentation Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Contract Signing</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Legal Review</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Final Approval</span>
                        <Clock className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Archive</span>
                        <Clock className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
          <DialogContent className="w-[80vw] max-w-none max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedDocument.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Document Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium">{selectedDocument.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant="secondary" className={getStatusColor(selectedDocument.status)}>
                        {selectedDocument.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                      <span className={`font-medium ${getRiskColor(selectedDocument.riskLevel)}`}>
                        {selectedDocument.riskLevel}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Key Risks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Key Risks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedDocument.keyRisks.map((risk: string, index: number) => (
                        <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-l-red-500">
                          <p className="text-sm font-medium text-red-800 dark:text-red-300">{risk}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Opportunities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedDocument.opportunities.map((opportunity: string, index: number) => (
                        <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-l-green-500">
                          <p className="text-sm font-medium text-green-800 dark:text-green-300">{opportunity}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* HBI Analysis */}
              <Card className="border-l-4 border-l-[#FF6B35]">
                <CardHeader>
                  <CardTitle className="text-[#003087] dark:text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-[#FF6B35]" />
                    HBI AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Compliance Score</p>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedDocument.complianceScore} className="flex-1" />
                        <span className="text-sm font-medium">{selectedDocument.complianceScore}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Analysis Status</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {selectedDocument.aiAnalysisStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>AI Recommendation:</strong> This document shows medium risk due to payment term complexity. 
                      Consider renegotiating clause 12.3 for clearer milestone definitions. Potential cost savings of $45K identified 
                      through early completion incentives.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDocumentModal(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Mark Reviewed
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#003087] dark:text-white">Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your documents here, or click to browse
                </p>
                <Button variant="outline" size="sm">
                  Choose Files
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Type</label>
                <select className="w-full px-3 py-2 border rounded-md bg-background">
                  <option>Prime Contract</option>
                  <option>Subcontract</option>
                  <option>Specification</option>
                  <option>Regulatory Document</option>
                  <option>Building Code</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white">
                  Upload & Analyze
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 