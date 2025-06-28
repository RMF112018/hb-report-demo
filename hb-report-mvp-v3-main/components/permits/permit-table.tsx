"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Permit, Project } from "@/types"
import { formatDate } from "@/lib/utils"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"

interface PermitTableProps {
  permits: Permit[]
  projects: Project[]
  onEdit: (permit: Permit) => void
  onDelete: (permitId: string) => void
  userRole?: string
}

export function PermitTable({ permits, projects, onEdit, onDelete, userRole }: PermitTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const getProjectName = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId)
    return project?.name || `Project ${projectId}`
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800", icon: Clock },
      approved: { variant: "default" as const, color: "bg-green-100 text-green-800", icon: CheckCircle },
      expired: { variant: "destructive" as const, color: "bg-red-100 text-red-800", icon: XCircle },
      rejected: { variant: "destructive" as const, color: "bg-red-100 text-red-800", icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const toggleRowExpansion = (permitId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(permitId)) {
      newExpanded.delete(permitId)
    } else {
      newExpanded.add(permitId)
    }
    setExpandedRows(newExpanded)
  }

  const getInspectionStatusBadge = (result: string) => {
    const statusConfig = {
      passed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      failed: { color: "bg-red-100 text-red-800", icon: XCircle },
      conditional: { color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
    }

    const config = statusConfig[result as keyof typeof statusConfig] || statusConfig.conditional
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {result.charAt(0).toUpperCase() + result.slice(1)}
      </Badge>
    )
  }

  if (permits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Permits Found</CardTitle>
          <CardDescription>No permits match your current filters. Try adjusting your search criteria.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No permits to display</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permits ({permits.length})</CardTitle>
        <CardDescription>Manage construction permits and track their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Permit #</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Authority</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permits.map((permit) => (
                <>
                  <TableRow key={permit.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(permit.id)}
                        className="h-6 w-6 p-0"
                      >
                        {expandedRows.has(permit.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{permit.number}</TableCell>
                    <TableCell>{permit.type}</TableCell>
                    <TableCell>{getProjectName(permit.projectId)}</TableCell>
                    <TableCell>{getStatusBadge(permit.status)}</TableCell>
                    <TableCell>{permit.authority}</TableCell>
                    <TableCell>{formatDate(permit.applicationDate)}</TableCell>
                    <TableCell>{permit.expirationDate ? formatDate(permit.expirationDate) : "-"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(permit)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {(userRole === "admin" || userRole === "project-manager") && (
                            <DropdownMenuItem onClick={() => onDelete(permit.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row - Inspections */}
                  {expandedRows.has(permit.id) && (
                    <TableRow>
                      <TableCell colSpan={9} className="p-0">
                        <div className="bg-gray-50 p-4 border-t">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">Inspections</h4>
                              <Badge variant="outline">{permit.inspections?.length || 0} inspections</Badge>
                            </div>

                            {permit.inspections && permit.inspections.length > 0 ? (
                              <div className="space-y-2">
                                {permit.inspections.map((inspection) => (
                                  <div
                                    key={inspection.id}
                                    className="bg-white p-3 rounded-lg border flex items-center justify-between"
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-1">
                                        <span className="font-medium text-sm">{inspection.type}</span>
                                        {getInspectionStatusBadge(inspection.result)}
                                      </div>
                                      <div className="text-xs text-gray-600 space-y-1">
                                        <p>Inspector: {inspection.inspector}</p>
                                        <p>Date: {formatDate(inspection.date)}</p>
                                        {inspection.comments && <p>Comments: {inspection.comments}</p>}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-500">
                                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm">No inspections scheduled</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
