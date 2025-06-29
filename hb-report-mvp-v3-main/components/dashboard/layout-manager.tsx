"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { DashboardLayout } from "@/types/dashboard"
import { getAvailableCardTypes } from "@/lib/dashboard-templates"
import { Layout, Plus, ChevronDown } from "lucide-react"

interface LayoutManagerProps {
  layouts: DashboardLayout[]
  currentLayoutId: string
  onCreateLayout: (name: string, description: string, templateType?: string) => void
  onDeleteLayout: (layoutId: string) => void
  onSwitchLayout: (layoutId: string) => void
  onAddCard: (cardType: string, size: string) => void
}

export function LayoutManager({
  layouts,
  currentLayoutId,
  onCreateLayout,
  onDeleteLayout,
  onSwitchLayout,
  onAddCard,
}: LayoutManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showAddCardDialog, setShowAddCardDialog] = useState(false)
  const [newLayoutName, setNewLayoutName] = useState("")
  const [newLayoutDescription, setNewLayoutDescription] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")

  const currentLayout = layouts.find((l) => l.id === currentLayoutId)
  const availableCardTypes = getAvailableCardTypes()

  const handleCreateLayout = () => {
    if (newLayoutName.trim()) {
      onCreateLayout(newLayoutName, newLayoutDescription, selectedTemplate)
      setNewLayoutName("")
      setNewLayoutDescription("")
      setSelectedTemplate("")
      setShowCreateDialog(false)
    }
  }

  const handleAddCard = (cardType: string, size: string) => {
    onAddCard(cardType, size)
    setShowAddCardDialog(false)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Layout Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Layout className="h-4 w-4" />
            {currentLayout?.name || "Select Layout"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2">CURRENT LAYOUTS</div>
            {layouts.map((layout) => (
              <DropdownMenuItem
                key={layout.id}
                onClick={() => onSwitchLayout(layout.id)}
                className={`flex items-center justify-between ${layout.id === currentLayoutId ? "bg-blue-50" : ""}`}
              >
                <div className="flex-1">
                  <div className="font-medium">{layout.name}</div>
                  <div className="text-xs text-gray-500">{layout.cards.length} cards</div>
                </div>
                {layout.isTemplate && (
                  <Badge variant="secondary" className="text-xs">
                    Template
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Layout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Card Button */}
      <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Card
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Dashboard Card</DialogTitle>
            <DialogDescription>Choose a card type to add to your dashboard</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {availableCardTypes.map((cardType) => (
              <Card
                key={cardType.type}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleAddCard(cardType.type, cardType.defaultSize)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{cardType.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {cardType.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{cardType.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Default: {cardType.defaultSize}</span>
                    {cardType.configurable && (
                      <Badge variant="secondary" className="text-xs">
                        Configurable
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Layout Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Dashboard Layout</DialogTitle>
            <DialogDescription>Create a custom dashboard layout or start from a template</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="layout-name">Layout Name</Label>
              <Input
                id="layout-name"
                value={newLayoutName}
                onChange={(e) => setNewLayoutName(e.target.value)}
                placeholder="My Custom Dashboard"
              />
            </div>
            <div>
              <Label htmlFor="layout-description">Description</Label>
              <Textarea
                id="layout-description"
                value={newLayoutDescription}
                onChange={(e) => setNewLayoutDescription(e.target.value)}
                placeholder="Describe what this dashboard will be used for..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="template-type">Template (Optional)</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Start from scratch or choose a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Blank Dashboard</SelectItem>
                  <SelectItem value="financial">Financial Review Template</SelectItem>
                  <SelectItem value="health">Project Health Template</SelectItem>
                  <SelectItem value="schedule">Schedule Review Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateLayout} disabled={!newLayoutName.trim()}>
                Create Layout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
