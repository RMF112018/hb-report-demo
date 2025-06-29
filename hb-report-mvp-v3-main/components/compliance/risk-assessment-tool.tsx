"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Shield, TrendingUp, Clock, Plus, CheckCircle } from "lucide-react"

interface RiskAssessmentToolProps {
  documents: any[]
}

export function RiskAssessmentTool({ documents }: RiskAssessmentToolProps) {
  const [risks, setRisks] = useState([
    {
      id: "1",
      title: "Payment Terms Extended",
      description: "30-day payment terms exceed standard 15-day terms",
      category: "financial",
      severity: "medium",
      probability: "high",
      impact: "medium",
      status: "active",
      documentId: "1",
      mitigationActions: [
        { id: "1", action: "Negotiate shorter payment terms", status: "pending", assignee: "Legal Team" },
        { id: "2", action: "Request payment guarantees", status: "completed", assignee: "Finance" },
      ],
      createdDate: "2024-06-14",
      dueDate: "2024-06-20",
    },
    {
      id: "2",
      title: "Insurance Coverage Gap",
      description: "Professional liability coverage not specified",
      category: "insurance",
      severity: "high",
      probability: "medium",
      impact: "high",
      status: "active",
      documentId: "1",
      mitigationActions: [
        { id: "1", action: "Verify insurance requirements", status: "in-progress", assignee: "Risk Manager" },
        { id: "2", action: "Update contract language", status: "pending", assignee: "Legal Team" },
      ],
      createdDate: "2024-06-13",
      dueDate: "2024-06-18",
    },
  ])

  const [newRisk, setNewRisk] = useState({
    title: "",
    description: "",
    category: "contractual",
    severity: "medium",
    probability: "medium",
    impact: "medium",
    documentId: "",
    dueDate: "",
  })

  const [showAddRisk, setShowAddRisk] = useState(false)

  const riskCategories = [
    { value: "contractual", label: "Contractual" },
    { value: "financial", label: "Financial" },
    { value: "insurance", label: "Insurance" },
    { value: "regulatory", label: "Regulatory" },
    { value: "operational", label: "Operational" },
    { value: "technical", label: "Technical" },
  ]

  const severityLevels = [
    { value: "low", label: "Low", color: "green" },
    { value: "medium", label: "Medium", color: "yellow" },
    { value: "high", label: "High", color: "red" },
    { value: "critical", label: "Critical", color: "red" },
  ]

  const calculateRiskScore = (severity: string, probability: string, impact: string) => {
    const scores = { low: 1, medium: 2, high: 3, critical: 4 }
    return (
      scores[severity as keyof typeof scores] *
      scores[probability as keyof typeof scores] *
      scores[impact as keyof typeof scores]
    )
  }

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const addRisk = () => {
    if (newRisk.title && newRisk.description) {
      const risk = {
        id: Date.now().toString(),
        ...newRisk,
        status: "active",
        mitigationActions: [],
        createdDate: new Date().toISOString().split("T")[0],
      }
      setRisks((prev) => [...prev, risk])
      setNewRisk({
        title: "",
        description: "",
        category: "contractual",
        severity: "medium",
        probability: "medium",
        impact: "medium",
        documentId: "",
        dueDate: "",
      })
      setShowAddRisk(false)
    }
  }

  const addMitigationAction = (riskId: string, action: string, assignee: string) => {
    setRisks((prev) =>
      prev.map((risk) => {
        if (risk.id === riskId) {
          const newAction = {
            id: Date.now().toString(),
            action,
            status: "pending",
            assignee,
          }
          return {
            ...risk,
            mitigationActions: [...risk.mitigationActions, newAction],
          }
        }
        return risk
      }),
    )
  }

  const updateActionStatus = (riskId: string, actionId: string, status: string) => {
    setRisks((prev) =>
      prev.map((risk) => {
        if (risk.id === riskId) {
          return {
            ...risk,
            mitigationActions: risk.mitigationActions.map((action) =>
              action.id === actionId ? { ...action, status } : action,
            ),
          }
        }
        return risk
      }),
    )
  }

  const activeRisks = risks.filter((risk) => risk.status === "active")
  const highRisks = activeRisks.filter((risk) => risk.severity === "high" || risk.severity === "critical")
  const avgRiskScore =
    activeRisks.reduce((sum, risk) => sum + calculateRiskScore(risk.severity, risk.probability, risk.impact), 0) /
      activeRisks.length || 0

  return (
    <div className="space-y-4">
      {/* Risk Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-3 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-600" />
            <p className="text-lg font-bold text-red-600">{activeRisks.length}</p>
            <p className="text-xs text-gray-600">Active Risks</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-3 text-center">
            <Shield className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <p className="text-lg font-bold text-orange-600">{highRisks.length}</p>
            <p className="text-xs text-gray-600">High/Critical</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-lg font-bold text-blue-600">{avgRiskScore.toFixed(1)}</p>
            <p className="text-xs text-gray-600">Avg Risk Score</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-lg font-bold text-green-600">{risks.filter((r) => r.status === "resolved").length}</p>
            <p className="text-xs text-gray-600">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Risk Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Risk Register</h3>
        <Button onClick={() => setShowAddRisk(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Risk
        </Button>
      </div>

      {/* Add Risk Form */}
      {showAddRisk && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Add New Risk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Input
                  placeholder="Risk title"
                  value={newRisk.title}
                  onChange={(e) => setNewRisk((prev) => ({ ...prev, title: e.target.value }))}
                  className="h-8"
                />
              </div>
              <div>
                <Select
                  value={newRisk.category}
                  onValueChange={(value) => setNewRisk((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {riskCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Textarea
              placeholder="Risk description"
              value={newRisk.description}
              onChange={(e) => setNewRisk((prev) => ({ ...prev, description: e.target.value }))}
              className="h-20 resize-none"
            />

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Severity</label>
                <Select
                  value={newRisk.severity}
                  onValueChange={(value) => setNewRisk((prev) => ({ ...prev, severity: value }))}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Probability</label>
                <Select
                  value={newRisk.probability}
                  onValueChange={(value) => setNewRisk((prev) => ({ ...prev, probability: value }))}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.slice(0, 3).map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Impact</label>
                <Select
                  value={newRisk.impact}
                  onValueChange={(value) => setNewRisk((prev) => ({ ...prev, impact: value }))}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.slice(0, 3).map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addRisk} className="gap-2">
                <Plus className="h-3 w-3" />
                Add Risk
              </Button>
              <Button variant="outline" onClick={() => setShowAddRisk(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk List */}
      <div className="space-y-3">
        {risks.map((risk) => (
          <Card key={risk.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-sm">{risk.title}</h4>
                    <Badge className={getRiskColor(risk.severity)}>{risk.severity}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {risk.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{risk.description}</p>

                  <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Probability:</span> {risk.probability}
                    </div>
                    <div>
                      <span className="font-medium">Impact:</span> {risk.impact}
                    </div>
                    <div>
                      <span className="font-medium">Risk Score:</span>{" "}
                      {calculateRiskScore(risk.severity, risk.probability, risk.impact)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">{risk.dueDate}</span>
                </div>
              </div>

              {/* Mitigation Actions */}
              {risk.mitigationActions.length > 0 && (
                <div className="border-t pt-3">
                  <h5 className="font-medium text-sm mb-2">Mitigation Actions</h5>
                  <div className="space-y-2">
                    {risk.mitigationActions.map((action) => (
                      <div key={action.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="text-sm">{action.action}</p>
                          <p className="text-xs text-gray-500">Assigned to: {action.assignee}</p>
                        </div>
                        <Badge
                          className={
                            action.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : action.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {action.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
