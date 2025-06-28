"use client"

import React, { useState, useMemo } from "react"
import { format } from "date-fns"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import type { Constraint, ConstraintFilters } from "@/types/constraint"

interface EnhancedConstraintTableProps {
  constraints: Constraint[]
  onEdit: (constraint: Constraint) => void
  onDelete: (constraint: Constraint) => void
  onBulkAction: (action: string, constraintIds: string[]) => void
  showClosed: boolean
  groupByCategory: boolean
  filters: ConstraintFilters
  onFiltersChange: (filters: ConstraintFilters) => void
  categories: string[]
  assignees: string[]
}

export function EnhancedConstraintTable({
  constraints,
  onEdit,
  onDelete,
  onBulkAction,
  showClosed,
  groupByCategory,
  filters,
  onFiltersChange,
  categories,
  assignees
}: EnhancedConstraintTableProps) {
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([])

  const getStatusBadge = (status: string) => {
    const variants = {
      "Identified": "secondary",
      "Pending": "outline", 
      "In Progress": "default",
      "Closed": "destructive"
    } as const

    const colors = {
      "Identified": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "Pending": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", 
      "Closed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    }

    return (
      <Badge 
        variant={variants[status as keyof typeof variants] || "secondary"}
        className={colors[status as keyof typeof colors]}
      >
        {status}
      </Badge>
    )
  }

  const isOverdue = (constraint: Constraint) => {
    if (constraint.completionStatus === "Closed" || !constraint.dueDate) return false
    return new Date(constraint.dueDate) < new Date()
  }

  const groupedConstraints = useMemo(() => {
    if (!groupByCategory) {
      return { "All": constraints }
    }

    return constraints.reduce((acc, constraint) => {
      const category = constraint.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(constraint)
      return acc
    }, {} as Record<string, Constraint[]>)
  }, [constraints, groupByCategory])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedConstraints(constraints.map(c => c.id))
    } else {
      setSelectedConstraints([])
    }
  }

  const handleSelectConstraint = (constraintId: string, checked: boolean) => {
    if (checked) {
      setSelectedConstraints(prev => [...prev, constraintId])
    } else {
      setSelectedConstraints(prev => prev.filter(id => id !== constraintId))
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedConstraints.length > 0) {
      onBulkAction(action, selectedConstraints)
      setSelectedConstraints([])
    }
  }

  const ConstraintRow = ({ constraint }: { constraint: Constraint }) => (
    <TableRow key={constraint.id} className="hover:bg-muted/50">
      <TableCell>
        <Checkbox
          checked={selectedConstraints.includes(constraint.id)}
          onCheckedChange={(checked) => handleSelectConstraint(constraint.id, checked as boolean)}
        />
      </TableCell>
      <TableCell className="font-medium">{constraint.no}</TableCell>
      <TableCell className="max-w-md">
        <div className="space-y-1">
          <p className="font-medium line-clamp-2">{constraint.description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-3 w-3" />
            {constraint.reference}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {constraint.category.replace(/^\d+\.\s*/, "")}
        </Badge>
      </TableCell>
      <TableCell>{getStatusBadge(constraint.completionStatus)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{constraint.assigned}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {constraint.dateIdentified && format(new Date(constraint.dateIdentified), "MMM dd, yyyy")}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {constraint.dueDate && (
            <>
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className={`text-sm ${isOverdue(constraint) ? 'text-red-600 font-medium' : ''}`}>
                {format(new Date(constraint.dueDate), "MMM dd, yyyy")}
              </span>
              {isOverdue(constraint) && (
                <AlertTriangle className="h-3 w-3 text-red-600" />
              )}
            </>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{constraint.daysElapsed} days</span>
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(constraint)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(constraint)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search constraints..."
                  value={filters.search}
                  onChange={(e) => onFiltersChange({...filters, search: e.target.value})}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => onFiltersChange({...filters, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Identified">Identified</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select 
                value={filters.category} 
                onValueChange={(value) => onFiltersChange({...filters, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/^\d+\.\s*/, "")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned To</label>
              <Select 
                value={filters.assigned} 
                onValueChange={(value) => onFiltersChange({...filters, assigned: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {assignees.map((assignee) => (
                    <SelectItem key={assignee} value={assignee}>
                      {assignee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedConstraints.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedConstraints.length} constraint(s) selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("export")}
                >
                  Export Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("close")}
                >
                  Mark Closed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Constraints Table */}
      <div className="space-y-6">
        {Object.entries(groupedConstraints).map(([category, categoryConstraints]) => (
          <Card key={category}>
            {groupByCategory && (
              <CardHeader>
                <CardTitle className="text-lg">
                  {category === "All" ? "All Constraints" : category.replace(/^\d+\.\s*/, "")}
                  <Badge variant="secondary" className="ml-2">
                    {categoryConstraints.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
            )}
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedConstraints.length === constraints.length && constraints.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>No.</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Identified</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Elapsed</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryConstraints.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                          No constraints found
                        </TableCell>
                      </TableRow>
                    ) : (
                      categoryConstraints.map((constraint) => (
                        <ConstraintRow key={constraint.id} constraint={constraint} />
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 