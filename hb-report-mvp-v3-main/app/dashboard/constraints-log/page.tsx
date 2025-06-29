"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ConstraintForm } from "@/components/constraints/constraint-form"
import { ConstraintTable } from "@/components/constraints/constraint-table"
import { Plus, Search, Filter, Download, RefreshCw, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data - replace with actual API calls
const mockConstraints = [
  {
    id: "1",
    no: "1.1",
    category: "1. DESIGN",
    description: "Structural drawings incomplete for Level 3",
    dateIdentified: "2024-01-15",
    daysElapsed: 45,
    reference: "RFI-001",
    closureDocument: "",
    assigned: "John Smith",
    bic: "Design Team",
    dueDate: "2024-02-15",
    completionStatus: "In Progress",
    dateClosed: "",
    comments: "Waiting for structural engineer review",
  },
  {
    id: "2",
    no: "1.2",
    category: "1. DESIGN",
    description: "MEP coordination conflicts in mechanical room",
    dateIdentified: "2024-01-20",
    daysElapsed: 40,
    reference: "RFI-002",
    closureDocument: "",
    assigned: "Jane Doe",
    bic: "MEP Team",
    dueDate: "2024-02-20",
    completionStatus: "Pending",
    dateClosed: "",
    comments: "Coordination meeting scheduled",
  },
  {
    id: "3",
    no: "2.1",
    category: "2. PERMITS",
    description: "Building permit approval delayed",
    dateIdentified: "2024-01-10",
    daysElapsed: 50,
    reference: "PERMIT-001",
    closureDocument: "BP-2024-001",
    assigned: "Mike Johnson",
    bic: "Permits Team",
    dueDate: "2024-01-30",
    completionStatus: "Closed",
    dateClosed: "2024-02-05",
    comments: "Permit approved and received",
  },
]

export default function ConstraintsLogPage() {
  const { toast } = useToast()
  const [constraints, setConstraints] = useState(mockConstraints)
  const [filteredConstraints, setFilteredConstraints] = useState(mockConstraints)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("open")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingConstraint, setEditingConstraint] = useState(null)
  const [deleteConstraint, setDeleteConstraint] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter constraints based on tab, search, and filters
  useEffect(() => {
    let filtered = constraints

    // Filter by tab (open/closed)
    if (activeTab === "open") {
      filtered = filtered.filter((c) => c.completionStatus !== "Closed")
    } else {
      filtered = filtered.filter((c) => c.completionStatus === "Closed")
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.assigned.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.reference.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.completionStatus === statusFilter)
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((c) => c.category === categoryFilter)
    }

    setFilteredConstraints(filtered)
  }, [constraints, searchTerm, statusFilter, categoryFilter, activeTab])

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(constraints.map((c) => c.category))]
    return uniqueCategories.sort()
  }, [constraints])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = constraints.length
    const open = constraints.filter((c) => c.completionStatus !== "Closed").length
    const closed = constraints.filter((c) => c.completionStatus === "Closed").length
    const overdue = constraints.filter((c) => {
      if (c.completionStatus === "Closed") return false
      if (!c.dueDate) return false
      return new Date(c.dueDate) < new Date()
    }).length

    return { total, open, closed, overdue }
  }, [constraints])

  const handleCreateConstraint = (constraintData) => {
    const newConstraint = {
      ...constraintData,
      id: Date.now().toString(),
      daysElapsed: constraintData.dateIdentified
        ? Math.floor((new Date() - new Date(constraintData.dateIdentified)) / (1000 * 60 * 60 * 24))
        : 0,
    }

    setConstraints((prev) => [...prev, newConstraint])
    setIsCreateModalOpen(false)
    toast({
      title: "Success",
      description: "Constraint created successfully",
    })
  }

  const handleUpdateConstraint = (constraintData) => {
    setConstraints((prev) =>
      prev.map((c) =>
        c.id === editingConstraint.id
          ? {
              ...constraintData,
              id: editingConstraint.id,
              daysElapsed: constraintData.dateIdentified
                ? Math.floor((new Date() - new Date(constraintData.dateIdentified)) / (1000 * 60 * 60 * 24))
                : 0,
            }
          : c,
      ),
    )
    setEditingConstraint(null)
    toast({
      title: "Success",
      description: "Constraint updated successfully",
    })
  }

  const handleDeleteConstraint = () => {
    if (deleteConstraint) {
      setConstraints((prev) => prev.filter((c) => c.id !== deleteConstraint.id))
      setDeleteConstraint(null)
      toast({
        title: "Success",
        description: "Constraint deleted successfully",
      })
    }
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setCategoryFilter("all")
  }

  const handleExport = () => {
    // Mock export functionality
    toast({
      title: "Export Started",
      description: "Constraints data is being exported...",
    })
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Mock refresh - in real app, refetch from API
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Constraints data has been updated",
      })
    }, 1000)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Constraints Log</h1>
            <p className="text-gray-600 mt-1">Track and manage project constraints and resolutions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Constraint
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Constraint</DialogTitle>
                </DialogHeader>
                <ConstraintForm
                  onSubmit={handleCreateConstraint}
                  onCancel={() => setIsCreateModalOpen(false)}
                  categories={categories}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Constraints</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Open Constraints</p>
                  <p className="text-2xl font-bold">{stats.open}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Closed Constraints</p>
                  <p className="text-2xl font-bold">{stats.closed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold">{stats.overdue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search constraints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Identified">Identified</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleClearFilters} size="sm">
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Constraints Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Constraints</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="open" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Open Constraints ({stats.open})
              </TabsTrigger>
              <TabsTrigger value="closed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Closed Constraints ({stats.closed})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="open" className="mt-6">
              <ConstraintTable
                constraints={filteredConstraints}
                onEdit={setEditingConstraint}
                onDelete={setDeleteConstraint}
                showClosed={false}
              />
            </TabsContent>

            <TabsContent value="closed" className="mt-6">
              <ConstraintTable
                constraints={filteredConstraints}
                onEdit={setEditingConstraint}
                onDelete={setDeleteConstraint}
                showClosed={true}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingConstraint && (
        <Dialog open={!!editingConstraint} onOpenChange={() => setEditingConstraint(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Constraint</DialogTitle>
            </DialogHeader>
            <ConstraintForm
              constraint={editingConstraint}
              onSubmit={handleUpdateConstraint}
              onCancel={() => setEditingConstraint(null)}
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConstraint} onOpenChange={() => setDeleteConstraint(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Constraint</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this constraint? This action cannot be undone.
              <br />
              <strong>"{deleteConstraint?.description}"</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConstraint} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
