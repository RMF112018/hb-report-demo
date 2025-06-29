"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Calendar, User, FileText } from "lucide-react"
import { format } from "date-fns"

const getStatusColor = (status) => {
  switch (status) {
    case "Closed":
      return "bg-green-100 text-green-800 border-green-200"
    case "In Progress":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Pending":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Identified":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const formatDate = (dateString) => {
  if (!dateString) return "-"
  try {
    return format(new Date(dateString), "MM/dd/yyyy")
  } catch {
    return dateString
  }
}

export function ConstraintTable({ constraints, onEdit, onDelete, showClosed = false }) {
  const [sortField, setSortField] = useState("dateIdentified")
  const [sortDirection, setSortDirection] = useState("desc")

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedConstraints = [...constraints].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    // Handle date sorting
    if (sortField.includes("date") || sortField.includes("Date")) {
      aValue = aValue ? new Date(aValue) : new Date(0)
      bValue = bValue ? new Date(bValue) : new Date(0)
    }

    // Handle numeric sorting
    if (sortField === "daysElapsed") {
      aValue = Number.parseInt(aValue) || 0
      bValue = Number.parseInt(bValue) || 0
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  if (constraints.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No {showClosed ? "closed" : "open"} constraints found
        </h3>
        <p className="text-gray-500">
          {showClosed ? "No constraints have been closed yet." : "Create your first constraint to get started."}
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("no")}>
              No.
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("category")}>
              Category
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-50 min-w-[300px]"
              onClick={() => handleSort("description")}
            >
              Description
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("dateIdentified")}>
              Date Identified
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("daysElapsed")}>
              Days Elapsed
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("assigned")}>
              Assigned
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("dueDate")}>
              Due Date
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("completionStatus")}>
              Status
            </TableHead>
            {showClosed && (
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("dateClosed")}>
                Date Closed
              </TableHead>
            )}
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedConstraints.map((constraint) => (
            <TableRow key={constraint.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{constraint.no}</TableCell>
              <TableCell>
                <div className="text-sm">{constraint.category}</div>
              </TableCell>
              <TableCell>
                <div className="max-w-[300px]">
                  <p className="text-sm font-medium line-clamp-2">{constraint.description}</p>
                  {constraint.reference && <p className="text-xs text-gray-500 mt-1">Ref: {constraint.reference}</p>}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  {formatDate(constraint.dateIdentified)}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {constraint.daysElapsed || 0} days
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <User className="h-3 w-3 text-gray-400" />
                  {constraint.assigned || "-"}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  {formatDate(constraint.dueDate)}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(constraint.completionStatus)}>{constraint.completionStatus}</Badge>
              </TableCell>
              {showClosed && (
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    {formatDate(constraint.dateClosed)}
                  </div>
                </TableCell>
              )}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(constraint)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(constraint)} className="text-red-600 focus:text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
