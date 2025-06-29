"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Ruler,
  Calculator,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Building2,
  FileText,
  BarChart3,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  Eye,
  Target,
  Layers,
  Square,
  Home
} from 'lucide-react'
import { useEstimating } from './EstimatingProvider'

interface ProjectData {
  id: string
  project_name: string
  project_stage_name: string
  active: boolean
  client_name?: string
  project_value?: number
  start_date?: string
  completion_date?: string
}

interface QuantityTakeoffDashboardProps {
  estimatingProjects: ProjectData[]
  userRole: string
}

interface TakeoffItem {
  id: string
  projectId: string
  csiDivision: string
  category: string
  description: string
  quantity: number
  unit: string
  unitCost: number
  totalCost: number
  notes: string
  status: 'pending' | 'in-progress' | 'complete' | 'review'
  assignedTo: string
  lastModified: string
  accuracy: number
}

// Mock takeoff data
const mockTakeoffData: TakeoffItem[] = [
  {
    id: 'to-001',
    projectId: 'PROJECT-001',
    csiDivision: '03 30 00',
    category: 'Concrete',
    description: 'Cast-in-place concrete footings',
    quantity: 450,
    unit: 'CY',
    unitCost: 180,
    totalCost: 81000,
    notes: 'Includes rebar and forming',
    status: 'complete',
    assignedTo: 'Sarah Johnson',
    lastModified: '2025-01-23',
    accuracy: 95
  },
  {
    id: 'to-002',
    projectId: 'PROJECT-001',
    csiDivision: '03 30 00',
    category: 'Concrete',
    description: 'Concrete slab on grade - 6" thick',
    quantity: 12500,
    unit: 'SF',
    unitCost: 8.50,
    totalCost: 106250,
    notes: 'Includes vapor barrier and mesh',
    status: 'complete',
    assignedTo: 'Sarah Johnson',
    lastModified: '2025-01-22',
    accuracy: 92
  },
  {
    id: 'to-003',
    projectId: 'PROJECT-001',
    csiDivision: '05 12 00',
    category: 'Steel',
    description: 'Structural steel framing',
    quantity: 85,
    unit: 'TON',
    unitCost: 2400,
    totalCost: 204000,
    notes: 'Wide flange beams and columns',
    status: 'in-progress',
    assignedTo: 'Michael Chen',
    lastModified: '2025-01-23',
    accuracy: 88
  },
  {
    id: 'to-004',
    projectId: 'PROJECT-001',
    csiDivision: '06 10 00',
    category: 'Carpentry',
    description: 'Rough carpentry framing',
    quantity: 8500,
    unit: 'LF',
    unitCost: 12.75,
    totalCost: 108375,
    notes: '2x10 and 2x12 framing lumber',
    status: 'pending',
    assignedTo: 'Jennifer Lopez',
    lastModified: '2025-01-20',
    accuracy: 0
  },
  {
    id: 'to-005',
    projectId: 'PROJECT-001',
    csiDivision: '07 21 00',
    category: 'Roofing',
    description: 'Built-up roofing system',
    quantity: 6800,
    unit: 'SF',
    unitCost: 18.50,
    totalCost: 125800,
    notes: 'Modified bitumen membrane',
    status: 'pending',
    assignedTo: 'Robert Kim',
    lastModified: '2025-01-18',
    accuracy: 0
  }
]

export function QuantityTakeoffDashboard({ estimatingProjects, userRole }: QuantityTakeoffDashboardProps) {
  const { selectedProject, setSelectedProject } = useEstimating()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedTakeoff, setSelectedTakeoff] = useState<TakeoffItem | null>(null)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItem, setNewItem] = useState({
    csiDivision: '',
    category: '',
    description: '',
    quantity: 0,
    unit: '',
    unitCost: 0,
    notes: '',
    assignedTo: ''
  })

  // Filter takeoff data
  const filteredTakeoffs = useMemo(() => {
    return mockTakeoffData.filter(item => {
      const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.csiDivision.includes(searchTerm)
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchTerm, categoryFilter, statusFilter])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalItems = mockTakeoffData.length
    const completedItems = mockTakeoffData.filter(item => item.status === 'complete').length
    const inProgressItems = mockTakeoffData.filter(item => item.status === 'in-progress').length
    const pendingItems = mockTakeoffData.filter(item => item.status === 'pending').length
    const totalValue = mockTakeoffData.reduce((sum, item) => sum + item.totalCost, 0)
    const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0
    const avgAccuracy = mockTakeoffData.filter(item => item.accuracy > 0).reduce((sum, item, _, arr) => 
      sum + item.accuracy / arr.length, 0) || 0

    return {
      totalItems,
      completedItems,
      inProgressItems,
      pendingItems,
      totalValue,
      completionRate,
      avgAccuracy
    }
  }, [])

  // Get unique categories
  const uniqueCategories = useMemo(() => {
    return [...new Set(mockTakeoffData.map(item => item.category))]
  }, [])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { variant: 'secondary' as const, label: 'Pending', color: 'bg-gray-100 text-gray-800' },
      'in-progress': { variant: 'default' as const, label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
      'complete': { variant: 'default' as const, label: 'Complete', color: 'bg-green-100 text-green-800' },
      'review': { variant: 'secondary' as const, label: 'Review', color: 'bg-yellow-100 text-yellow-800' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status, color: '' }
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>
  }

  // Handle adding new item
  const handleAddItem = () => {
    // In a real app, this would integrate with the context
    console.log('Adding new takeoff item:', newItem)
    setIsAddingItem(false)
    setNewItem({
      csiDivision: '',
      category: '',
      description: '',
      quantity: 0,
      unit: '',
      unitCost: 0,
      notes: '',
      assignedTo: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Ruler className="h-6 w-6" />
              Quantity Takeoff Intelligence Center
            </h2>
            <p className="text-muted-foreground mt-1">
              Advanced quantity takeoff management with AI-powered accuracy insights and cost optimization
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Plans
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Takeoffs
            </Button>
            <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:from-[#E55A2B] hover:to-[#D04A1F] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Takeoff Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Takeoff Item</DialogTitle>
                  <DialogDescription>
                    Add a new quantity takeoff item to the project estimate.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="csi-division" className="text-right">CSI Division</Label>
                    <Input
                      id="csi-division"
                      value={newItem.csiDivision}
                      onChange={(e) => setNewItem({...newItem, csiDivision: e.target.value})}
                      placeholder="e.g., 03 30 00"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                    <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Concrete">Concrete</SelectItem>
                        <SelectItem value="Steel">Steel</SelectItem>
                        <SelectItem value="Masonry">Masonry</SelectItem>
                        <SelectItem value="Carpentry">Carpentry</SelectItem>
                        <SelectItem value="Roofing">Roofing</SelectItem>
                        <SelectItem value="MEP">MEP</SelectItem>
                        <SelectItem value="Finishes">Finishes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Input
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder="Enter description"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                      className="col-span-1"
                    />
                    <Label htmlFor="unit" className="text-right">Unit</Label>
                    <Input
                      id="unit"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                      placeholder="e.g., CY, SF, LF"
                      className="col-span-1"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="unit-cost" className="text-right">Unit Cost</Label>
                    <Input
                      id="unit-cost"
                      type="number"
                      step="0.01"
                      value={newItem.unitCost}
                      onChange={(e) => setNewItem({...newItem, unitCost: Number(e.target.value)})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newItem.notes}
                      onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                      placeholder="Additional notes..."
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddItem}>Add Takeoff Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Value</CardTitle>
            <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(summaryStats.totalValue)}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {summaryStats.totalItems} takeoff items
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {summaryStats.completionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              {summaryStats.completedItems} of {summaryStats.totalItems} complete
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg Accuracy</CardTitle>
            <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {summaryStats.avgAccuracy.toFixed(1)}%
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Based on completed items
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {summaryStats.inProgressItems}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {summaryStats.pendingItems} pending items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-muted border-border">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Takeoff Items
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Square className="h-4 w-4" />
            By Category
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Overview */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Takeoff Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Overall Completion</span>
                    <span>{summaryStats.completionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={summaryStats.completionRate} className="h-3" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{summaryStats.completedItems}</div>
                    <div className="text-sm text-green-600">Complete</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{summaryStats.inProgressItems}</div>
                    <div className="text-sm text-blue-600">In Progress</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{summaryStats.pendingItems}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uniqueCategories.map(category => {
                    const categoryItems = mockTakeoffData.filter(item => item.category === category)
                    const categoryValue = categoryItems.reduce((sum, item) => sum + item.totalCost, 0)
                    const categoryPercentage = (categoryValue / summaryStats.totalValue) * 100

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category}</span>
                          <span className="text-sm">{formatCurrency(categoryValue)}</span>
                        </div>
                        <Progress value={categoryPercentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search takeoffs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Filtered
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Takeoff Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Takeoff Items ({filteredTakeoffs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CSI Division</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Cost</TableHead>
                      <TableHead className="text-right">Total Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTakeoffs.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.csiDivision}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity.toLocaleString()} {item.unit}</TableCell>
                        <TableCell className="text-right">${item.unitCost.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(item.totalCost)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.assignedTo}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setSelectedTakeoff(item)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {uniqueCategories.map(category => {
              const categoryItems = mockTakeoffData.filter(item => item.category === category)
              const categoryValue = categoryItems.reduce((sum, item) => sum + item.totalCost, 0)
              const completedItems = categoryItems.filter(item => item.status === 'complete').length
              const completionRate = categoryItems.length > 0 ? (completedItems / categoryItems.length) * 100 : 0

              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {category}
                      <Badge variant="outline">{categoryItems.length} items</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Total Value</span>
                        <span className="font-semibold">{formatCurrency(categoryValue)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Completion</span>
                        <span className="text-sm">{completionRate.toFixed(0)}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2 mt-2" />
                    </div>
                    <div className="space-y-2">
                      {categoryItems.slice(0, 3).map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="truncate flex-1">{item.description}</span>
                          {getStatusBadge(item.status)}
                        </div>
                      ))}
                      {categoryItems.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{categoryItems.length - 3} more items
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Accuracy Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{summaryStats.avgAccuracy.toFixed(1)}%</div>
                    <p className="text-muted-foreground">Average Accuracy</p>
                  </div>
                  <div className="space-y-3">
                    {mockTakeoffData.filter(item => item.accuracy > 0).map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm flex-1 truncate">{item.description}</span>
                        <span className="text-sm font-medium">{item.accuracy}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uniqueCategories.map(category => {
                    const categoryItems = mockTakeoffData.filter(item => item.category === category)
                    const categoryValue = categoryItems.reduce((sum, item) => sum + item.totalCost, 0)
                    const percentage = (categoryValue / summaryStats.totalValue) * 100

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="h-2 flex-1" />
                          <span className="text-sm font-medium w-20 text-right">
                            {formatCurrency(categoryValue)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Takeoff Detail Modal */}
      {selectedTakeoff && (
        <Dialog open={!!selectedTakeoff} onOpenChange={() => setSelectedTakeoff(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Takeoff Item Details</DialogTitle>
              <DialogDescription>
                {selectedTakeoff.csiDivision} - {selectedTakeoff.category}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm mt-1">{selectedTakeoff.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedTakeoff.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Quantity</Label>
                  <p className="text-sm mt-1">{selectedTakeoff.quantity.toLocaleString()} {selectedTakeoff.unit}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Unit Cost</Label>
                  <p className="text-sm mt-1">${selectedTakeoff.unitCost.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Cost</Label>
                  <p className="text-lg font-semibold mt-1">{formatCurrency(selectedTakeoff.totalCost)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assigned To</Label>
                  <p className="text-sm mt-1">{selectedTakeoff.assignedTo}</p>
                </div>
              </div>
              {selectedTakeoff.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selectedTakeoff.notes}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Last Modified</Label>
                <p className="text-sm mt-1">{new Date(selectedTakeoff.lastModified).toLocaleDateString()}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTakeoff(null)}>Close</Button>
              <Button>Edit Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default QuantityTakeoffDashboard 