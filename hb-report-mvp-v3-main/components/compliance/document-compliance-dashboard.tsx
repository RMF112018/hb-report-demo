"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertTriangle, CheckCircle, Clock, TrendingUp, Users, Calendar } from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

interface DocumentComplianceDashboardProps {
  documents: any[]
}

export function DocumentComplianceDashboard({ documents }: DocumentComplianceDashboardProps) {
  // Calculate metrics
  const totalDocuments = documents.length
  const approvedDocuments = documents.filter((d) => d.status === "approved").length
  const underReviewDocuments = documents.filter((d) => d.status === "under-review").length
  const pendingDocuments = documents.filter((d) => d.status === "pending").length
  const highRiskDocuments = documents.filter((d) => d.riskLevel === "high").length
  const averageCompletionRate = documents.reduce((sum, doc) => sum + doc.completionRate, 0) / documents.length

  // Chart data
  const statusData = [
    { name: "Approved", value: approvedDocuments, color: "#10b981" },
    { name: "Under Review", value: underReviewDocuments, color: "#f59e0b" },
    { name: "Pending", value: pendingDocuments, color: "#ef4444" },
    { name: "Draft", value: documents.filter((d) => d.status === "draft").length, color: "#6b7280" },
  ]

  const typeData = [
    { name: "Prime Contracts", count: documents.filter((d) => d.type === "prime-contract").length },
    { name: "Subcontracts", count: documents.filter((d) => d.type === "subcontract").length },
    { name: "Specifications", count: documents.filter((d) => d.type === "specification").length },
    { name: "Building Codes", count: documents.filter((d) => d.type === "building-code").length },
  ]

  const riskTrendData = [
    { month: "Jan", high: 2, medium: 5, low: 8 },
    { month: "Feb", high: 3, medium: 4, low: 9 },
    { month: "Mar", high: 1, medium: 6, low: 10 },
    { month: "Apr", high: 4, medium: 3, low: 7 },
    { month: "May", high: 2, medium: 7, low: 11 },
    {
      month: "Jun",
      high: highRiskDocuments,
      medium: documents.filter((d) => d.riskLevel === "medium").length,
      low: documents.filter((d) => d.riskLevel === "low").length,
    },
  ]

  const upcomingDeadlines = [
    { document: "Fire Safety Code Review", deadline: "2024-06-15", priority: "high" },
    { document: "Electrical Subcontract", deadline: "2024-06-18", priority: "medium" },
    { document: "HVAC Specifications", deadline: "2024-06-20", priority: "low" },
  ]

  const recentActivity = [
    { action: "Document approved", document: "Electrical Subcontract", user: "Sarah Johnson", time: "2 hours ago" },
    { action: "Risk identified", document: "Fire Safety Code", user: "Mike Davis", time: "4 hours ago" },
    { action: "Review completed", document: "Prime Contract", user: "John Smith", time: "1 day ago" },
  ]

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-lg font-bold text-blue-600">{totalDocuments}</p>
              <p className="text-xs text-gray-600">Total Documents</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3">
            <div className="text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-lg font-bold text-green-600">{approvedDocuments}</p>
              <p className="text-xs text-gray-600">Approved</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-3">
            <div className="text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <p className="text-lg font-bold text-yellow-600">{underReviewDocuments}</p>
              <p className="text-xs text-gray-600">Under Review</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-3">
            <div className="text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <p className="text-lg font-bold text-red-600">{highRiskDocuments}</p>
              <p className="text-xs text-gray-600">High Risk</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-3">
            <div className="text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-lg font-bold text-purple-600">{Math.round(averageCompletionRate)}%</p>
              <p className="text-xs text-gray-600">Avg Progress</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="p-3">
            <div className="text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
              <p className="text-lg font-bold text-indigo-600">{upcomingDeadlines.length}</p>
              <p className="text-xs text-gray-600">Due Soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Document Status Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Document Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Types */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Document Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={typeData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Trend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Risk Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={riskTrendData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={2} name="High Risk" />
                <Line type="monotone" dataKey="medium" stroke="#f59e0b" strokeWidth={2} name="Medium Risk" />
                <Line type="monotone" dataKey="low" stroke="#10b981" strokeWidth={2} name="Low Risk" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.document}</p>
                    <p className="text-xs text-gray-500">{item.deadline}</p>
                  </div>
                  <Badge
                    className={
                      item.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : item.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }
                  >
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-600 truncate">{activity.document}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
