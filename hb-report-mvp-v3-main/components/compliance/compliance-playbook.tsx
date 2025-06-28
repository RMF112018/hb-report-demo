"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, CheckCircle, Plus, Edit3, Download, Upload, Shield, FileText, Building } from "lucide-react"

interface CompliancePlaybookProps {
  documents: any[]
}

export function CompliancePlaybook({ documents }: CompliancePlaybookProps) {
  const [activePlaybook, setActivePlaybook] = useState("contracts")
  const [customChecklists, setCustomChecklists] = useState([
    {
      id: "1",
      name: "Prime Contract Review",
      category: "contracts",
      items: [
        { id: "1", text: "Verify contract scope and deliverables", completed: true, required: true },
        { id: "2", text: "Review payment terms and schedule", completed: true, required: true },
        { id: "3", text: "Check insurance requirements", completed: false, required: true },
        { id: "4", text: "Validate change order procedures", completed: false, required: true },
        { id: "5", text: "Confirm dispute resolution process", completed: false, required: false },
      ],
      completionRate: 40,
      lastUpdated: "2024-06-14",
    },
    {
      id: "2",
      name: "Subcontract Compliance",
      category: "contracts",
      items: [
        { id: "1", text: "Verify subcontractor licensing", completed: true, required: true },
        { id: "2", text: "Check insurance certificates", completed: true, required: true },
        { id: "3", text: "Review safety requirements", completed: true, required: true },
        { id: "4", text: "Validate bonding requirements", completed: false, required: true },
        { id: "5", text: "Confirm lien waiver procedures", completed: false, required: true },
      ],
      completionRate: 60,
      lastUpdated: "2024-06-13",
    },
  ])

  const [newChecklist, setNewChecklist] = useState({
    name: "",
    category: "contracts",
    items: [""],
  })

  const playbookCategories = [
    { id: "contracts", name: "Contracts", icon: FileText, color: "blue" },
    { id: "building-codes", name: "Building Codes", icon: Building, color: "green" },
    { id: "safety", name: "Safety & Insurance", icon: Shield, color: "red" },
    { id: "permits", name: "Permits & Licenses", icon: BookOpen, color: "purple" },
  ]

  const buildingCodeChecklists = [
    {
      id: "fire-safety",
      name: "Fire Safety Compliance",
      items: [
        "Fire alarm system specifications",
        "Emergency exit requirements",
        "Sprinkler system compliance",
        "Fire-rated materials verification",
        "Occupancy load calculations",
      ],
    },
    {
      id: "structural",
      name: "Structural Code Review",
      items: [
        "Foundation design compliance",
        "Load-bearing calculations",
        "Seismic requirements",
        "Wind load specifications",
        "Material grade verification",
      ],
    },
  ]

  const safetyChecklists = [
    {
      id: "insurance",
      name: "Insurance Requirements",
      items: [
        "General liability coverage",
        "Workers compensation",
        "Professional liability",
        "Builder's risk insurance",
        "Certificate of insurance validity",
      ],
    },
    {
      id: "safety-protocols",
      name: "Safety Protocols",
      items: [
        "OSHA compliance verification",
        "Safety training documentation",
        "Personal protective equipment",
        "Hazard communication plan",
        "Emergency response procedures",
      ],
    },
  ]

  const handleChecklistItemToggle = (checklistId: string, itemId: string) => {
    setCustomChecklists((prev) =>
      prev.map((checklist) => {
        if (checklist.id === checklistId) {
          const updatedItems = checklist.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item,
          )
          const completedCount = updatedItems.filter((item) => item.completed).length
          const completionRate = Math.round((completedCount / updatedItems.length) * 100)

          return {
            ...checklist,
            items: updatedItems,
            completionRate,
            lastUpdated: new Date().toISOString().split("T")[0],
          }
        }
        return checklist
      }),
    )
  }

  const addNewChecklistItem = (checklistId: string) => {
    setCustomChecklists((prev) =>
      prev.map((checklist) => {
        if (checklist.id === checklistId) {
          const newItem = {
            id: Date.now().toString(),
            text: "New checklist item",
            completed: false,
            required: false,
          }
          return {
            ...checklist,
            items: [...checklist.items, newItem],
          }
        }
        return checklist
      }),
    )
  }

  const createNewChecklist = () => {
    if (newChecklist.name && newChecklist.items.filter((item) => item.trim()).length > 0) {
      const checklist = {
        id: Date.now().toString(),
        name: newChecklist.name,
        category: newChecklist.category,
        items: newChecklist.items
          .filter((item) => item.trim())
          .map((text, index) => ({
            id: (index + 1).toString(),
            text: text.trim(),
            completed: false,
            required: true,
          })),
        completionRate: 0,
        lastUpdated: new Date().toISOString().split("T")[0],
      }

      setCustomChecklists((prev) => [...prev, checklist])
      setNewChecklist({ name: "", category: "contracts", items: [""] })
    }
  }

  const getCategoryColor = (category: string) => {
    const categoryData = playbookCategories.find((cat) => cat.id === category)
    return categoryData?.color || "gray"
  }

  return (
    <div className="space-y-4">
      {/* Playbook Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Compliance Playbook
              </CardTitle>
              <CardDescription>
                Customizable checklists and compliance workflows for construction documents
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Category Tabs */}
      <Tabs value={activePlaybook} onValueChange={setActivePlaybook}>
        <TabsList className="grid w-full grid-cols-4 h-10">
          {playbookCategories.map((category) => {
            const Icon = category.icon
            return (
              <TabsTrigger key={category.id} value={category.id} className="text-xs gap-1">
                <Icon className="h-3 w-3" />
                {category.name}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="mt-4 space-y-4">
          <div className="grid gap-4">
            {customChecklists
              .filter((checklist) => checklist.category === "contracts")
              .map((checklist) => (
                <Card key={checklist.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{checklist.name}</CardTitle>
                        <CardDescription>
                          {checklist.items.filter((item) => item.completed).length} of {checklist.items.length} items
                          completed
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`bg-${getCategoryColor(checklist.category)}-100 text-${getCategoryColor(checklist.category)}-800`}
                        >
                          {checklist.completionRate}% Complete
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Progress value={checklist.completionRate} className="h-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {checklist.items.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50">
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() => handleChecklistItemToggle(checklist.id, item.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <p className={`text-sm ${item.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                              {item.text}
                            </p>
                            {item.required && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Required
                              </Badge>
                            )}
                          </div>
                          {item.completed && <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />}
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addNewChecklistItem(checklist.id)}
                        className="gap-2 text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="h-3 w-3" />
                        Add Item
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* Create New Checklist */}
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="checklist-name" className="text-sm font-medium">
                      Checklist Name
                    </Label>
                    <Input
                      id="checklist-name"
                      placeholder="Enter checklist name"
                      value={newChecklist.name}
                      onChange={(e) => setNewChecklist((prev) => ({ ...prev, name: e.target.value }))}
                      className="h-8"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Checklist Items</Label>
                    {newChecklist.items.map((item, index) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <Input
                          placeholder={`Item ${index + 1}`}
                          value={item}
                          onChange={(e) => {
                            const newItems = [...newChecklist.items]
                            newItems[index] = e.target.value
                            setNewChecklist((prev) => ({ ...prev, items: newItems }))
                          }}
                          className="h-8"
                        />
                        {index === newChecklist.items.length - 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setNewChecklist((prev) => ({ ...prev, items: [...prev.items, ""] }))}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button onClick={createNewChecklist} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Checklist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Building Codes Tab */}
        <TabsContent value="building-codes" className="mt-4 space-y-4">
          <div className="grid gap-4">
            {buildingCodeChecklists.map((checklist) => (
              <Card key={checklist.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{checklist.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {checklist.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                        <Checkbox />
                        <p className="text-sm text-gray-900">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="mt-4 space-y-4">
          <div className="grid gap-4">
            {safetyChecklists.map((checklist) => (
              <Card key={checklist.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{checklist.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {checklist.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                        <Checkbox />
                        <p className="text-sm text-gray-900">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Permits Tab */}
        <TabsContent value="permits" className="mt-4">
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Permits & Licenses</h3>
              <p className="text-gray-500 mb-4">Permit compliance checklists coming soon</p>
              <Button variant="outline">Create Permit Checklist</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
