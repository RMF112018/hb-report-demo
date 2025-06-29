"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Project } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { MoreHorizontal, Eye, Edit, FileText, Calendar, MapPin, DollarSign, TableIcon, Grid3X3 } from "lucide-react"

interface ProjectTableProps {
  projects: Project[]
  viewMode: "table" | "cards"
  onViewModeChange: (mode: "table" | "cards") => void
  userRole?: string
  onProjectSelect?: (projectId: number) => void
}

export function ProjectTable({ projects, viewMode, onViewModeChange, userRole, onProjectSelect }: ProjectTableProps) {
  const [sortField, setSortField] = useState<keyof Project>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedProjects = [...projects].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Active: { variant: "default" as const, className: "bg-green-100 text-green-800" },
      Completed: { variant: "secondary" as const, className: "bg-blue-100 text-blue-800" },
      "On Hold": { variant: "outline" as const, className: "bg-yellow-100 text-yellow-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Active"]

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    )
  }

  const canEdit = (project: Project) => {
    if (userRole === "admin") return true
    if (userRole === "project-manager") return project.managerId === "current-user-id"
    if (userRole === "project-executive") return true
    return false
  }

  if (viewMode === "cards") {
    return (
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold">Projects ({projects.length})</h3>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("table")}
                className="touch-target"
              >
                <TableIcon className="h-4 w-4" />
                <span className="hidden sm:ml-2 sm:inline">Table</span>
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("cards")}
                className="touch-target"
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:ml-2 sm:inline">Cards</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {sortedProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow w-full">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-base md:text-lg truncate">{project.name}</h4>
                      <p className="text-sm md:text-base text-gray-500">ID: {project.id}</p>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm md:text-base text-gray-600">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                      <span className="truncate">
                        {project.city}, {project.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm md:text-base text-gray-600">
                      <DollarSign className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                      <span className="truncate">{formatCurrency(project.contractValue)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm md:text-base text-gray-600">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                      <span className="truncate">
                        {formatDate(project.startDate)} - {formatDate(project.contractEndDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 touch-target"
                      onClick={() => onProjectSelect?.(project.id)}
                    >
                      <Eye className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      <span className="text-sm md:text-base">View</span>
                    </Button>
                    {canEdit(project) && (
                      <Button size="sm" variant="outline" className="touch-target">
                        <Edit className="h-4 w-4 md:h-5 md:w-5" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-4 md:pt-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-semibold">Projects ({projects.length})</h3>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("table")}
              className="touch-target"
            >
              <TableIcon className="h-4 w-4" />
              <span className="hidden sm:ml-2 sm:inline">Table</span>
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("cards")}
              className="touch-target"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:ml-2 sm:inline">Cards</span>
            </Button>
          </div>
        </div>

        {/* Mobile: Horizontal scroll for table */}
        <div className="mobile-scroll">
          <div className="rounded-md border mobile-table">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                    onClick={() => handleSort("id")}
                  >
                    Project ID
                    {sortField === "id" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                    onClick={() => handleSort("name")}
                  >
                    Name
                    {sortField === "name" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </TableHead>
                  <TableHead className="text-xs md:text-sm">Status</TableHead>
                  <TableHead className="text-xs md:text-sm">Address</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                    onClick={() => handleSort("city")}
                  >
                    City
                    {sortField === "city" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </TableHead>
                  <TableHead className="text-xs md:text-sm">State</TableHead>
                  <TableHead className="text-xs md:text-sm">Zip</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                    onClick={() => handleSort("startDate")}
                  >
                    Start Date
                    {sortField === "startDate" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                    onClick={() => handleSort("contractEndDate")}
                  >
                    End Date
                    {sortField === "contractEndDate" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 text-right text-xs md:text-sm"
                    onClick={() => handleSort("contractValue")}
                  >
                    Contract Value
                    {sortField === "contractValue" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-xs md:text-sm">{project.id}</TableCell>
                    <TableCell className="font-medium text-xs md:text-sm">{project.name}</TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell className="text-xs md:text-sm">{project.streetAddress || "-"}</TableCell>
                    <TableCell className="text-xs md:text-sm">{project.city}</TableCell>
                    <TableCell className="text-xs md:text-sm">{project.state}</TableCell>
                    <TableCell className="text-xs md:text-sm">{project.zip || "-"}</TableCell>
                    <TableCell className="text-xs md:text-sm">{formatDate(project.startDate)}</TableCell>
                    <TableCell className="text-xs md:text-sm">{formatDate(project.contractEndDate)}</TableCell>
                    <TableCell className="text-right font-medium text-xs md:text-sm">
                      {formatCurrency(project.contractValue)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 touch-target">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onProjectSelect?.(project.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Project Dashboard
                          </DropdownMenuItem>
                          {canEdit(project) && (
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Project
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm md:text-base">
            No projects found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
