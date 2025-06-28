"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Download, Upload, AlertCircle } from "lucide-react"
import type { RFP } from "@/types/estimating"

interface EnhancedGCsGRsFormProps {
  selectedRFP: RFP | null
}

interface LaborRate {
  id: string
  position: string
  qty: number
  unitOfMeasure: string
  unitCost: number
  totalCost: number
  percentTime: number
  customLaborRate: number
  flsaOvertime: number
  category: "construction" | "closeout"
}

interface FieldOfficeItem {
  id: string
  category: string
  description: string
  qty: number
  unitOfMeasure: string
  unitCost: number
  totalCost: number
  remarks?: string
}

interface GeneralConditionItem {
  id: string
  contractRef: string
  description: string
  qty: number
  unitOfMeasure: string
  unitCost: number
  totalCost: number
  remarks?: string
}

const mockLaborRates: LaborRate[] = [
  {
    id: "lr1",
    position: "Project Executive",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 157.67,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 253.0,
    flsaOvertime: 212.85,
    category: "construction",
  },
  {
    id: "lr2",
    position: "Senior Project Manager",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 130.67,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 195.0,
    flsaOvertime: 176.41,
    category: "construction",
  },
  {
    id: "lr3",
    position: "Project Manager - Level 3",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 120.34,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 0,
    flsaOvertime: 162.46,
    category: "construction",
  },
  {
    id: "lr4",
    position: "Project Manager - Level 2",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 110.14,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 185.0,
    flsaOvertime: 148.7,
    category: "construction",
  },
  {
    id: "lr5",
    position: "Project Manager - Level 1",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 94.27,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 163.0,
    flsaOvertime: 127.26,
    category: "construction",
  },
  {
    id: "lr6",
    position: "Project Administrator",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 66.51,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 95.0,
    flsaOvertime: 89.78,
    category: "construction",
  },
  {
    id: "lr7",
    position: "Project Accountant",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 85.81,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 81.0,
    flsaOvertime: 115.84,
    category: "construction",
  },
  {
    id: "lr8",
    position: "Assistant Project Manager",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 85.81,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 118.0,
    flsaOvertime: 111.69,
    category: "construction",
  },
  {
    id: "lr9",
    position: "Superintendent - Level 3",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 131.75,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 183.0,
    flsaOvertime: 177.87,
    category: "construction",
  },
  {
    id: "lr10",
    position: "Superintendent - Level 2",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 110.59,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 161.0,
    flsaOvertime: 149.3,
    category: "construction",
  },
  {
    id: "lr11",
    position: "Superintendent - Level 1",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 90.51,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 121.0,
    flsaOvertime: 122.19,
    category: "construction",
  },
  {
    id: "lr12",
    position: "Assistant Superintendent",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 59.92,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 84.0,
    flsaOvertime: 80.89,
    category: "construction",
  },
  {
    id: "lr13",
    position: "Quality Control Manager",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 102.93,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 0,
    flsaOvertime: 138.96,
    category: "construction",
  },
  {
    id: "lr14",
    position: "Foreman",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 41.53,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 65.0,
    flsaOvertime: 56.06,
    category: "construction",
  },
  {
    id: "lr15",
    position: "Accounting",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 115.94,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 80.0,
    flsaOvertime: 156.52,
    category: "construction",
  },
  {
    id: "lr16",
    position: "VDC Manager",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 102.73,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 101.0,
    flsaOvertime: 138.68,
    category: "construction",
  },
  {
    id: "lr17",
    position: "Safety Supervisor/Inspector",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 79.73,
    totalCost: 0,
    percentTime: 0,
    customLaborRate: 96.0,
    flsaOvertime: 107.64,
    category: "construction",
  },
]

const mockFieldOfficeItems: FieldOfficeItem[] = [
  {
    id: "fo1",
    category: "Field Office - Contractor",
    description: "Field Office Set Up / Removal - Double Wide",
    qty: 0.0,
    unitOfMeasure: "ea",
    unitCost: 16000,
    totalCost: 0,
  },
  {
    id: "fo2",
    category: "Field Office - Contractor",
    description: "Field Office - Double Wide",
    qty: 0.0,
    unitOfMeasure: "mos",
    unitCost: 3500,
    totalCost: 0,
  },
  {
    id: "fo3",
    category: "Field Office - Contractor",
    description: "Field Office Set Up / Removal - Single Wide",
    qty: 0.0,
    unitOfMeasure: "ea",
    unitCost: 15958,
    totalCost: 0,
    remarks: "WILLSCOT 4/16/2024 (36x10 mobile office)",
  },
  {
    id: "fo4",
    category: "Field Office - Contractor",
    description: "Field Office - Single Wide",
    qty: 0.0,
    unitOfMeasure: "mos",
    unitCost: 1732,
    totalCost: 0,
    remarks: "WILLSCOT 4/16/2024 (36x10 mobile office)",
  },
  {
    id: "fo5",
    category: "Temporary Utilities",
    description: "Temporary Toilets",
    qty: 0.0,
    unitOfMeasure: "mos",
    unitCost: 407,
    totalCost: 0,
    remarks: "04/15/2024 united site services",
  },
  {
    id: "fo6",
    category: "Equipment",
    description: "Small Tools",
    qty: 0.0,
    unitOfMeasure: "mos",
    unitCost: 1500,
    totalCost: 0,
  },
  {
    id: "fo7",
    category: "Security",
    description: "Temporary Fence - 6' Post Driven w/ windscreen",
    qty: 0.0,
    unitOfMeasure: "lf",
    unitCost: 8,
    totalCost: 0,
    remarks: "rent national 4/15/2024",
  },
  {
    id: "fo8",
    category: "Cleaning",
    description: "Trash Removal - 10yd dumpsters",
    qty: 0.0,
    unitOfMeasure: "wks",
    unitCost: 350,
    totalCost: 0,
    remarks: "4/15/2024 Coastal Waste *see 02 10 Site Prep",
  },
  {
    id: "fo9",
    category: "Services",
    description: "CPM Schedule - Set Up",
    qty: 0.0,
    unitOfMeasure: "ls",
    unitCost: 10000,
    totalCost: 0,
    remarks: "Call Assaf Newmark (Spectrum Consulting) 404-819-4663",
  },
  {
    id: "fo10",
    category: "Testing",
    description: "Concrete Testing",
    qty: 0.0,
    unitOfMeasure: "ls",
    unitCost: 0,
    totalCost: 0,
    remarks: "by owner",
  },
]

const mockGeneralConditions: GeneralConditionItem[] = [
  {
    id: "gc1",
    contractRef: "01 10",
    description: "Mobilization",
    qty: 1.0,
    unitOfMeasure: "ls",
    unitCost: 18000,
    totalCost: 18000,
  },
  {
    id: "gc2",
    contractRef: "01 20",
    description: "Erosion Control",
    qty: 1.0,
    unitOfMeasure: "ls",
    unitCost: 8500,
    totalCost: 8500,
  },
  {
    id: "gc3",
    contractRef: "01 30",
    description: "Site Security",
    qty: 12.0,
    unitOfMeasure: "mos",
    unitCost: 1200,
    totalCost: 14400,
  },
  {
    id: "gc4",
    contractRef: "01 40",
    description: "Project Management",
    qty: 18.0,
    unitOfMeasure: "mos",
    unitCost: 2500,
    totalCost: 45000,
  },
  {
    id: "gc5",
    contractRef: "01 50",
    description: "Quality Control",
    qty: 1.0,
    unitOfMeasure: "ls",
    unitCost: 12000,
    totalCost: 12000,
  },
]

export function EnhancedGCsGRsForm({ selectedRFP }: EnhancedGCsGRsFormProps) {
  const [laborRates, setLaborRates] = useState<LaborRate[]>(mockLaborRates)
  const [fieldOfficeItems, setFieldOfficeItems] = useState<FieldOfficeItem[]>(mockFieldOfficeItems)
  const [generalConditions, setGeneralConditions] = useState<GeneralConditionItem[]>(mockGeneralConditions)
  const [remarks, setRemarks] = useState("")
  const [activeTab, setActiveTab] = useState("labor-rates")
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")
  const [lastSaved, setLastSaved] = useState<Date>(new Date())

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoSaveStatus === "unsaved") {
        setAutoSaveStatus("saving")
        // Simulate save
        setTimeout(() => {
          setAutoSaveStatus("saved")
          setLastSaved(new Date())
        }, 1000)
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(interval)
  }, [autoSaveStatus])

  // Calculate totals
  const laborTotal = laborRates.reduce((sum, rate) => sum + rate.totalCost, 0)
  const fieldOfficeTotal = fieldOfficeItems.reduce((sum, item) => sum + item.totalCost, 0)
  const generalConditionsTotal = generalConditions.reduce((sum, item) => sum + item.totalCost, 0)
  const subtotal = laborTotal + fieldOfficeTotal + generalConditionsTotal
  const gmpMarkup = subtotal * 0.25 // 25% markup
  const grandTotal = subtotal + gmpMarkup

  const updateLaborRate = (id: string, field: keyof LaborRate, value: number) => {
    setLaborRates((prev) =>
      prev.map((rate) => {
        if (rate.id === id) {
          const updated = { ...rate, [field]: value }
          if (field === "qty" || field === "unitCost") {
            updated.totalCost = updated.qty * updated.unitCost
          }
          return updated
        }
        return rate
      }),
    )
    setAutoSaveStatus("unsaved")
  }

  const updateFieldOfficeItem = (id: string, field: keyof FieldOfficeItem, value: number | string) => {
    setFieldOfficeItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "qty" || field === "unitCost") {
            updated.totalCost = (updated.qty as number) * (updated.unitCost as number)
          }
          return updated
        }
        return item
      }),
    )
    setAutoSaveStatus("unsaved")
  }

  const updateGeneralCondition = (id: string, field: keyof GeneralConditionItem, value: number | string) => {
    setGeneralConditions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "qty" || field === "unitCost") {
            updated.totalCost = (updated.qty as number) * (updated.unitCost as number)
          }
          return updated
        }
        return item
      }),
    )
    setAutoSaveStatus("unsaved")
  }

  const exportToExcel = () => {
    // Simulate Excel export
    console.log("Exporting to Excel...")
  }

  const importFromExcel = () => {
    // Simulate Excel import
    console.log("Importing from Excel...")
  }

  if (!selectedRFP) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
          <p className="text-gray-500">Please select an RFP to manage GCs & GRs.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">General Conditions & General Requirements</h2>
          <p className="text-gray-600">FY 2025 Labor Rates - Updated 09.26.24</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className={`h-2 w-2 rounded-full ${
                autoSaveStatus === "saved"
                  ? "bg-green-500"
                  : autoSaveStatus === "saving"
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-600">
              {autoSaveStatus === "saved"
                ? `Saved ${lastSaved.toLocaleTimeString()}`
                : autoSaveStatus === "saving"
                  ? "Saving..."
                  : "Unsaved changes"}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={importFromExcel}>
            <Upload className="h-4 w-4 mr-2" />
            Import Excel
          </Button>
          <Button variant="outline" size="sm" onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Badge variant="outline" className="px-3 py-1">
            Total: ${grandTotal.toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200 px-6 pt-6">
              <TabsList className="grid w-full grid-cols-4 h-auto p-1">
                <TabsTrigger value="labor-rates" className="text-sm py-2">
                  Labor Rates (${laborTotal.toLocaleString()})
                </TabsTrigger>
                <TabsTrigger value="field-office" className="text-sm py-2">
                  Field Office (${fieldOfficeTotal.toLocaleString()})
                </TabsTrigger>
                <TabsTrigger value="general-conditions" className="text-sm py-2">
                  General Conditions (${generalConditionsTotal.toLocaleString()})
                </TabsTrigger>
                <TabsTrigger value="summary" className="text-sm py-2">
                  Summary & Totals
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              {/* Labor Rates Tab */}
              <TabsContent value="labor-rates" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Field Labor - Construction & Close Out</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Miami/Ft. Lauderdale Rates</Badge>
                      <Badge variant="outline">Central Florida Rates</Badge>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-48">Position</TableHead>
                          <TableHead className="w-20">Qty</TableHead>
                          <TableHead className="w-16">U/M</TableHead>
                          <TableHead className="w-24">Unit Cost</TableHead>
                          <TableHead className="w-24">Total Cost</TableHead>
                          <TableHead className="w-20">% Time</TableHead>
                          <TableHead className="w-28">Custom Rate</TableHead>
                          <TableHead className="w-28">FLSA Overtime</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {laborRates.map((rate) => (
                          <TableRow key={rate.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{rate.position}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.1"
                                value={rate.qty}
                                onChange={(e) =>
                                  updateLaborRate(rate.id, "qty", Number.parseFloat(e.target.value) || 0)
                                }
                                className="w-full text-center"
                              />
                            </TableCell>
                            <TableCell className="text-center text-sm text-gray-600">{rate.unitOfMeasure}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                value={rate.unitCost}
                                onChange={(e) =>
                                  updateLaborRate(rate.id, "unitCost", Number.parseFloat(e.target.value) || 0)
                                }
                                className="w-full text-right"
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">${rate.totalCost.toLocaleString()}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                max="100"
                                value={rate.percentTime}
                                onChange={(e) =>
                                  updateLaborRate(rate.id, "percentTime", Number.parseFloat(e.target.value) || 0)
                                }
                                className="w-full text-center"
                              />
                            </TableCell>
                            <TableCell className="text-right">${rate.customLaborRate.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${rate.flsaOvertime.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Labor Rates Subtotal:</span>
                      <span className="text-2xl font-bold text-blue-600">${laborTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Field Office Tab */}
              <TabsContent value="field-office" className="mt-0">
                <div className="space-y-6">
                  {Object.entries(
                    fieldOfficeItems.reduce(
                      (acc, item) => {
                        if (!acc[item.category]) acc[item.category] = []
                        acc[item.category].push(item)
                        return acc
                      },
                      {} as Record<string, FieldOfficeItem[]>,
                    ),
                  ).map(([category, items]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-md font-medium text-gray-900 border-b pb-2">{category}</h4>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>Description</TableHead>
                              <TableHead className="w-20">Qty</TableHead>
                              <TableHead className="w-16">U/M</TableHead>
                              <TableHead className="w-24">Unit Cost</TableHead>
                              <TableHead className="w-24">Total Cost</TableHead>
                              <TableHead className="w-48">Remarks</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.description}</TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    value={item.qty}
                                    onChange={(e) =>
                                      updateFieldOfficeItem(item.id, "qty", Number.parseFloat(e.target.value) || 0)
                                    }
                                    className="w-full text-center"
                                  />
                                </TableCell>
                                <TableCell className="text-center text-sm text-gray-600">
                                  {item.unitOfMeasure}
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={item.unitCost}
                                    onChange={(e) =>
                                      updateFieldOfficeItem(item.id, "unitCost", Number.parseFloat(e.target.value) || 0)
                                    }
                                    className="w-full text-right"
                                  />
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  ${item.totalCost.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={item.remarks || ""}
                                    onChange={(e) => updateFieldOfficeItem(item.id, "remarks", e.target.value)}
                                    className="w-full text-sm"
                                    placeholder="Add remarks..."
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))}

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Field Office Subtotal:</span>
                      <span className="text-2xl font-bold text-green-600">${fieldOfficeTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* General Conditions Tab */}
              <TabsContent value="general-conditions" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">General Conditions</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-20">Contract Ref</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-20">Qty</TableHead>
                          <TableHead className="w-16">U/M</TableHead>
                          <TableHead className="w-24">Unit Cost</TableHead>
                          <TableHead className="w-24">Total Cost</TableHead>
                          <TableHead className="w-48">Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generalConditions.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-sm">{item.contractRef}</TableCell>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.1"
                                value={item.qty}
                                onChange={(e) =>
                                  updateGeneralCondition(item.id, "qty", Number.parseFloat(e.target.value) || 0)
                                }
                                className="w-full text-center"
                              />
                            </TableCell>
                            <TableCell className="text-center text-sm text-gray-600">{item.unitOfMeasure}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                value={item.unitCost}
                                onChange={(e) =>
                                  updateGeneralCondition(item.id, "unitCost", Number.parseFloat(e.target.value) || 0)
                                }
                                className="w-full text-right"
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">${item.totalCost.toLocaleString()}</TableCell>
                            <TableCell>
                              <Input
                                value={item.remarks || ""}
                                onChange={(e) => updateGeneralCondition(item.id, "remarks", e.target.value)}
                                className="w-full text-sm"
                                placeholder="Add remarks..."
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">General Conditions Subtotal:</span>
                      <span className="text-2xl font-bold text-purple-600">
                        ${generalConditionsTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Summary Tab */}
              <TabsContent value="summary" className="mt-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Cost Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Labor Rates:</span>
                          <span className="font-medium">${laborTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Field Office:</span>
                          <span className="font-medium">${fieldOfficeTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>General Conditions:</span>
                          <span className="font-medium">${generalConditionsTotal.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-medium">
                            <span>Subtotal:</span>
                            <span>${subtotal.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-blue-600">
                          <span>25% GMP Markup:</span>
                          <span className="font-medium">${gmpMarkup.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between text-xl font-bold">
                            <span>Grand Total:</span>
                            <span className="text-green-600">${grandTotal.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Project Remarks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={remarks}
                          onChange={(e) => {
                            setRemarks(e.target.value)
                            setAutoSaveStatus("unsaved")
                          }}
                          placeholder="Add project-specific notes and remarks..."
                          rows={8}
                          className="w-full"
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-medium mb-4">Cost Analysis</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          ${(grandTotal / (selectedRFP.grossSF || 1)).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Cost per Gross SF</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {((gmpMarkup / subtotal) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Markup Percentage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {((laborTotal / subtotal) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Labor Percentage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          ${(grandTotal / (selectedRFP.buildDuration || 1)).toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-600">Cost per Month</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
