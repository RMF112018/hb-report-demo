"use client"

import React, { useState, useCallback, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { 
  Ruler, 
  Calculator, 
  Building2, 
  Layers, 
  Save, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Target,
  BarChart3,
  PieChart,
  Home,
  MapPin
} from "lucide-react"

// Types for Area Calculations
export interface AreaCalculationItem {
  id: string
  floor: string
  area: string
  areaType: 'AC SF' | 'Gross SF' | 'LSF' | 'Covered Patio' | 'Covered Service' | 'Uncovered Patio' | 'Equipment' | 'Other'
  acSF: number
  grossSF: number
  lsf: number
  notes?: string
  lastModified: string
}

export interface ProjectMetrics {
  grossSF: number
  acSF: number
  leasableSF: number
  siteAcres: number
  parkingSpaces: number
  numberOfUnits: number
  buildDuration: number
  siteSF: number
}

export interface AreaCalculationsData {
  projectId: string
  projectName: string
  projectMetrics: ProjectMetrics
  areaItems: AreaCalculationItem[]
  lastModified: string
}

interface AreaCalculationsModuleProps {
  projectId: string
  projectName: string
  onSave?: (data: AreaCalculationsData) => void
  onExport?: (format: 'pdf' | 'csv') => void
}

export function AreaCalculationsModule({ 
  projectId, 
  projectName, 
  onSave, 
  onExport 
}: AreaCalculationsModuleProps) {
  const { toast } = useToast()
  
  // State management
  const [activeTab, setActiveTab] = useState('summary')
  const [areaItems, setAreaItems] = useState<AreaCalculationItem[]>([])
  const [projectMetrics, setProjectMetrics] = useState<ProjectMetrics>({
    grossSF: 0,
    acSF: 0,
    leasableSF: 0,
    siteAcres: 0,
    parkingSpaces: 0,
    numberOfUnits: 0,
    buildDuration: 0,
    siteSF: 0
  })
  const [editingField, setEditingField] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Initialize data based on Excel structure
  useEffect(() => {
    const mockAreaItems: AreaCalculationItem[] = [
      // Level 00
      {
        id: '1',
        floor: 'LEVEL 00',
        area: 'DINING - LOWER LEVEL',
        areaType: 'AC SF',
        acSF: 7078,
        grossSF: 7078,
        lsf: 0,
        lastModified: new Date().toISOString()
      },
      {
        id: '2',
        floor: 'LEVEL 00',
        area: 'DINING - LOWER LEVEL - COVERED PATIO',
        areaType: 'Covered Patio',
        acSF: 0,
        grossSF: 511,
        lsf: 0,
        lastModified: new Date().toISOString()
      },
      {
        id: '3',
        floor: 'LEVEL 00',
        area: 'DINING - LOWER LEVEL - COVERED SERVICE',
        areaType: 'Covered Service',
        acSF: 0,
        grossSF: 1078,
        lsf: 0,
        lastModified: new Date().toISOString()
      },
      {
        id: '4',
        floor: 'LEVEL 00',
        area: 'FITNESS - LOWER LEVEL',
        areaType: 'AC SF',
        acSF: 4746,
        grossSF: 4746,
        lsf: 0,
        lastModified: new Date().toISOString()
      },
      {
        id: '5',
        floor: 'LEVEL 00',
        area: 'POOL EQUIPMENT 01',
        areaType: 'Equipment',
        acSF: 0,
        grossSF: 889,
        lsf: 0,
        lastModified: new Date().toISOString()
      },
      {
        id: '6',
        floor: 'LEVEL 00',
        area: 'POOL EQUIPMENT 02',
        areaType: 'Equipment',
        acSF: 0,
        grossSF: 1413,
        lsf: 0,
        lastModified: new Date().toISOString()
      },
      {
        id: '7',
        floor: 'LEVEL 00',
        area: 'WELLNESS - LOWER LEVEL',
        areaType: 'AC SF',
        acSF: 12861,
        grossSF: 12861,
        lsf: 0,
        lastModified: new Date().toISOString()
      },
      // Level 01
      {
        id: '8',
        floor: 'LEVEL 01',
        area: 'DINING - LEVEL 01',
        areaType: 'AC SF',
        acSF: 10905,
        grossSF: 10905,
        lsf: 0,
        lastModified: new Date().toISOString()
      },
      {
        id: '9',
        floor: 'LEVEL 01',
        area: 'DINING - LEVEL 01 - COVERED PATIO',
        areaType: 'Covered Patio',
        acSF: 0,
        grossSF: 3621,
        lsf: 0,
        lastModified: new Date().toISOString()
      },
      {
        id: '10',
        floor: 'LEVEL 01',
        area: 'FITNESS - LEVEL 01',
        areaType: 'AC SF',
        acSF: 7857,
        grossSF: 7857,
        lsf: 0,
        lastModified: new Date().toISOString()
      },
      {
        id: '11',
        floor: 'LEVEL 01',
        area: 'WELLNESS - LEVEL 01',
        areaType: 'AC SF',
        acSF: 14954,
        grossSF: 14954,
        lsf: 0,
        lastModified: new Date().toISOString()
      },
      // Level 02
      {
        id: '12',
        floor: 'LEVEL 02',
        area: 'DINING - LEVEL 02',
        areaType: 'AC SF',
        acSF: 3386,
        grossSF: 3386,
        lsf: 0,
        lastModified: new Date().toISOString()
      },
      {
        id: '13',
        floor: 'LEVEL 02',
        area: 'WELLNESS - LEVEL 02',
        areaType: 'AC SF',
        acSF: 8314,
        grossSF: 8314,
        lsf: 0,
        lastModified: new Date().toISOString()
      }
    ]

    setAreaItems(mockAreaItems)
    
    // Set project metrics to match Excel totals
    setProjectMetrics({
      grossSF: 86144,
      acSF: 70101,
      leasableSF: 0,
      siteAcres: 1.00,
      parkingSpaces: 0,
      numberOfUnits: 0,
      buildDuration: 0,
      siteSF: 0
    })
  }, [])

  // Calculate totals
  const calculations = useMemo(() => {
    const totalACSF = areaItems.reduce((sum, item) => sum + item.acSF, 0)
    const totalGrossSF = areaItems.reduce((sum, item) => sum + item.grossSF, 0)
    const totalLSF = areaItems.reduce((sum, item) => sum + item.lsf, 0)
    
    // Group by floor for breakdown
    const floorBreakdown = areaItems.reduce((acc, item) => {
      if (!acc[item.floor]) {
        acc[item.floor] = { acSF: 0, grossSF: 0, lsf: 0, count: 0 }
      }
      acc[item.floor].acSF += item.acSF
      acc[item.floor].grossSF += item.grossSF
      acc[item.floor].lsf += item.lsf
      acc[item.floor].count += 1
      return acc
    }, {} as Record<string, { acSF: number, grossSF: number, lsf: number, count: number }>)

    // Group by area type
    const areaTypeBreakdown = areaItems.reduce((acc, item) => {
      if (!acc[item.areaType]) {
        acc[item.areaType] = { acSF: 0, grossSF: 0, lsf: 0, count: 0 }
      }
      acc[item.areaType].acSF += item.acSF
      acc[item.areaType].grossSF += item.grossSF
      acc[item.areaType].lsf += item.lsf
      acc[item.areaType].count += 1
      return acc
    }, {} as Record<string, { acSF: number, grossSF: number, lsf: number, count: number }>)
    
    return {
      totalACSF,
      totalGrossSF,
      totalLSF,
      floorBreakdown,
      areaTypeBreakdown,
      totalAreas: areaItems.length
    }
  }, [areaItems])

  // Format number with commas
  const formatNumber = (value: number) => {
    return value.toLocaleString()
  }

  // Get area type color
  const getAreaTypeColor = (areaType: string) => {
    switch (areaType) {
      case 'AC SF': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Gross SF': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'LSF': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'Covered Patio': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'Covered Service': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Equipment': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Inline edit component for numbers
  const InlineEdit = ({ 
    value, 
    onSave, 
    type = 'number', 
    className = ''
  }: {
    value: number;
    onSave: (value: number) => void;
    type?: 'number';
    className?: string;
  }) => {
    const fieldKey = `${type}-${value}-${Date.now()}`
    const isEditing = editingField === fieldKey
    const [editValue, setEditValue] = useState(value)

    const handleSave = () => {
      onSave(editValue)
      setEditingField(null)
      setHasUnsavedChanges(true)
    }

    const handleCancel = () => {
      setEditValue(value)
      setEditingField(null)
    }

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(Number(e.target.value))}
            className="w-24 h-8 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') handleCancel()
            }}
            autoFocus
          />
          <Button size="sm" onClick={handleSave} className="h-6 w-6 p-0">
            <CheckCircle className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-6 w-6 p-0">
            ✕
          </Button>
        </div>
      )
    }

    return (
      <div 
        className={`flex items-center gap-1 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group ${className}`}
        onClick={() => setEditingField(fieldKey)}
      >
        <span className="text-sm font-medium">{formatNumber(value)}</span>
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
      </div>
    )
  }

  // Update area item
  const updateAreaItem = useCallback((itemId: string, field: keyof AreaCalculationItem, value: any) => {
    setAreaItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, [field]: value, lastModified: new Date().toISOString() }
      }
      return item
    }))
    setHasUnsavedChanges(true)
  }, [])

  // Add new area item
  const addAreaItem = useCallback(() => {
    const newItem: AreaCalculationItem = {
      id: Date.now().toString(),
      floor: 'LEVEL 00',
      area: 'New Area',
      areaType: 'AC SF',
      acSF: 0,
      grossSF: 0,
      lsf: 0,
      lastModified: new Date().toISOString()
    }
    setAreaItems(prev => [...prev, newItem])
    setHasUnsavedChanges(true)
  }, [])

  // Remove area item
  const removeAreaItem = useCallback((itemId: string) => {
    setAreaItems(prev => prev.filter(item => item.id !== itemId))
    setHasUnsavedChanges(true)
  }, [])

  // Update project metric
  const updateProjectMetric = useCallback((field: keyof ProjectMetrics, value: number) => {
    setProjectMetrics(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }, [])

  // Save data
  const handleSave = useCallback(async () => {
    const areaCalculationsData: AreaCalculationsData = {
      projectId,
      projectName,
      projectMetrics,
      areaItems,
      lastModified: new Date().toISOString()
    }

    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (onSave) {
      onSave(areaCalculationsData)
    }
    
    setHasUnsavedChanges(false)
    toast({
      title: "Area Calculations Saved",
      description: "All changes have been saved successfully.",
    })
  }, [projectId, projectName, projectMetrics, areaItems, onSave, toast])

  // Export data
  const handleExport = useCallback(async (format: 'pdf' | 'csv') => {
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      if (onExport) {
        onExport(format)
      }
      toast({
        title: "Export Successful",
        description: `Area calculations exported as ${format.toUpperCase()}.`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }, [onExport, toast])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Ruler className="h-6 w-6 text-blue-600" />
            Project Area Calculations - {projectName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Square footage calculations and project metrics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <Alert className="w-auto py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">Unsaved changes</AlertDescription>
            </Alert>
          )}
          
          <Button onClick={handleSave} disabled={!hasUnsavedChanges} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleExport('pdf')} 
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Gross SF</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatNumber(calculations.totalGrossSF)}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Project total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total AC SF</CardTitle>
            <Home className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {formatNumber(calculations.totalACSF)}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Air conditioned
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Site Acres</CardTitle>
            <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {projectMetrics.siteAcres.toFixed(2)}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Total site area
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Areas</CardTitle>
            <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {calculations.totalAreas}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Total areas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Project Summary</TabsTrigger>
          <TabsTrigger value="areas">Area Details</TabsTrigger>
          <TabsTrigger value="breakdown">Floor Breakdown</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Project Metrics Summary
              </CardTitle>
              <CardDescription>
                Overall project measurements and key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="grossSF">Gross SF</Label>
                  <InlineEdit
                    value={projectMetrics.grossSF}
                    onSave={(value) => updateProjectMetric('grossSF', value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acSF">AC SF</Label>
                  <InlineEdit
                    value={projectMetrics.acSF}
                    onSave={(value) => updateProjectMetric('acSF', value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leasableSF">Leasable SF</Label>
                  <InlineEdit
                    value={projectMetrics.leasableSF}
                    onSave={(value) => updateProjectMetric('leasableSF', value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteAcres">Site (acres)</Label>
                  <InlineEdit
                    value={projectMetrics.siteAcres}
                    onSave={(value) => updateProjectMetric('siteAcres', value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parkingSpaces">Parking Spaces</Label>
                  <InlineEdit
                    value={projectMetrics.parkingSpaces}
                    onSave={(value) => updateProjectMetric('parkingSpaces', value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfUnits">No. of Units</Label>
                  <InlineEdit
                    value={projectMetrics.numberOfUnits}
                    onSave={(value) => updateProjectMetric('numberOfUnits', value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buildDuration">Build Duration (months)</Label>
                  <InlineEdit
                    value={projectMetrics.buildDuration}
                    onSave={(value) => updateProjectMetric('buildDuration', value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteSF">Site SF</Label>
                  <InlineEdit
                    value={projectMetrics.siteSF}
                    onSave={(value) => updateProjectMetric('siteSF', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Detailed Area Calculations
                  </CardTitle>
                  <CardDescription>
                    Floor-by-floor area breakdown with square footage details
                  </CardDescription>
                </div>
                <Button onClick={addAreaItem} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Area
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 bg-muted/50">
                      <th className="text-left p-3 w-32">Floor</th>
                      <th className="text-left p-3 w-48">Area</th>
                      <th className="text-left p-3 w-32">Area Type</th>
                      <th className="text-left p-3 w-24">AC SF</th>
                      <th className="text-left p-3 w-24">Gross SF</th>
                      <th className="text-left p-3 w-24">LSF</th>
                      <th className="text-left p-3 w-48">Notes</th>
                      <th className="text-left p-3 w-16">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {areaItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div 
                            className="font-medium cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group"
                            onClick={() => {
                              const newValue = prompt("Enter floor name:", item.floor)
                              if (newValue) updateAreaItem(item.id, 'floor', newValue)
                            }}
                          >
                            {item.floor}
                            <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity inline ml-1" />
                          </div>
                        </td>
                        <td className="p-3">
                          <div 
                            className="cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group"
                            onClick={() => {
                              const newValue = prompt("Enter area name:", item.area)
                              if (newValue) updateAreaItem(item.id, 'area', newValue)
                            }}
                          >
                            {item.area}
                            <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity inline ml-1" />
                          </div>
                        </td>
                        <td className="p-3">
                          <Select
                            value={item.areaType}
                            onValueChange={(value) => updateAreaItem(item.id, 'areaType', value)}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AC SF">AC SF</SelectItem>
                              <SelectItem value="Gross SF">Gross SF</SelectItem>
                              <SelectItem value="LSF">LSF</SelectItem>
                              <SelectItem value="Covered Patio">Covered Patio</SelectItem>
                              <SelectItem value="Covered Service">Covered Service</SelectItem>
                              <SelectItem value="Equipment">Equipment</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <InlineEdit
                            value={item.acSF}
                            onSave={(value) => updateAreaItem(item.id, 'acSF', value)}
                          />
                        </td>
                        <td className="p-3">
                          <InlineEdit
                            value={item.grossSF}
                            onSave={(value) => updateAreaItem(item.id, 'grossSF', value)}
                          />
                        </td>
                        <td className="p-3">
                          <InlineEdit
                            value={item.lsf}
                            onSave={(value) => updateAreaItem(item.id, 'lsf', value)}
                          />
                        </td>
                        <td className="p-3">
                          <div 
                            className="cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group text-xs"
                            onClick={() => {
                              const newValue = prompt("Enter notes:", item.notes || '')
                              if (newValue !== null) updateAreaItem(item.id, 'notes', newValue)
                            }}
                          >
                            {item.notes || 'Click to add notes'}
                            <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity inline ml-1" />
                          </div>
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAreaItem(item.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    
                    {/* Total Row */}
                    <tr className="border-t-2 bg-blue-50 dark:bg-blue-950 font-semibold">
                      <td colSpan={3} className="p-3 text-right">TOTAL:</td>
                      <td className="p-3 text-lg font-bold text-blue-900 dark:text-blue-100">
                        {formatNumber(calculations.totalACSF)}
                      </td>
                      <td className="p-3 text-lg font-bold text-blue-900 dark:text-blue-100">
                        {formatNumber(calculations.totalGrossSF)}
                      </td>
                      <td className="p-3 text-lg font-bold text-blue-900 dark:text-blue-100">
                        {formatNumber(calculations.totalLSF)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Floor Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-green-600" />
                  Floor Breakdown
                </CardTitle>
                <CardDescription>
                  Square footage summary by floor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(calculations.floorBreakdown).map(([floor, data]) => (
                    <div key={floor} className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">{floor}</h4>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">AC SF:</span>
                          <div className="font-medium">{formatNumber(data.acSF)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gross SF:</span>
                          <div className="font-medium">{formatNumber(data.grossSF)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">LSF:</span>
                          <div className="font-medium">{formatNumber(data.lsf)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Areas:</span>
                          <div className="font-medium">{data.count}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Area Type Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-orange-600" />
                  Area Type Breakdown
                </CardTitle>
                <CardDescription>
                  Square footage summary by area type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(calculations.areaTypeBreakdown).map(([type, data]) => (
                    <div key={type} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{type}</h4>
                        <Badge className={getAreaTypeColor(type)}>
                          {data.count} areas
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">AC SF:</span>
                          <div className="font-medium">{formatNumber(data.acSF)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gross SF:</span>
                          <div className="font-medium">{formatNumber(data.grossSF)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">LSF:</span>
                          <div className="font-medium">{formatNumber(data.lsf)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-600" />
                Area Analysis
              </CardTitle>
              <CardDescription>
                Key metrics and ratios for the project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Efficiency Ratio</h4>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {((calculations.totalACSF / calculations.totalGrossSF) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">AC SF / Gross SF</p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Site Utilization</h4>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {projectMetrics.siteAcres > 0 ? (calculations.totalGrossSF / (projectMetrics.siteAcres * 43560)).toFixed(2) : '0.00'}
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">FAR (Floor Area Ratio)</p>
                </div>
                
                <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Average Floor Size</h4>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {formatNumber(Math.round(calculations.totalGrossSF / Object.keys(calculations.floorBreakdown).length))}
                  </div>
                  <p className="text-sm text-orange-600 dark:text-orange-400">SF per floor</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 