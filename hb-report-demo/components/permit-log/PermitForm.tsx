"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import {
  Save,
  X,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Building,
  FileText,
  DollarSign,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  User,
  Clock,
  CheckCircle,
  Tag
} from "lucide-react"
import { format, addDays } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Permit, PermitFormData, AuthorityContact, Inspection } from "@/types/permit-log"

// Form validation schema
const permitFormSchema = z.object({
  number: z.string().min(1, "Permit number is required"),
  type: z.string().min(1, "Permit type is required"),
  status: z.enum(["pending", "approved", "expired", "rejected", "renewed"]),
  priority: z.enum(["low", "medium", "high", "urgent", "critical"]).optional(),
  authority: z.string().min(1, "Authority is required"),
  applicationDate: z.string().min(1, "Application date is required"),
  approvalDate: z.string().optional(),
  expirationDate: z.string().min(1, "Expiration date is required"),
  renewalDate: z.string().optional(),
  cost: z.number().min(0).optional(),
  bondAmount: z.number().min(0).optional(),
  description: z.string().min(1, "Description is required"),
  comments: z.string().optional(),
  authorityContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().optional(),
  }).optional(),
  conditions: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof permitFormSchema>

interface PermitFormProps {
  permit?: Permit | null
  open: boolean
  onClose: () => void
  onSave: (data: PermitFormData) => void
  userRole?: string
}

const permitTypes = [
  "Building",
  "Electrical",
  "Plumbing",
  "Mechanical",
  "Fire Safety",
  "Demolition",
  "Excavation",
  "Environmental",
  "Zoning",
  "Occupancy"
]

const permitStatuses = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "expired", label: "Expired" },
  { value: "rejected", label: "Rejected" },
  { value: "renewed", label: "Renewed" }
]

const permitPriorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
  { value: "critical", label: "Critical" }
]

const commonAuthorities = [
  "City Building Department",
  "County Planning Commission",
  "State Environmental Agency",
  "Fire Department",
  "Health Department",
  "Zoning Board",
  "Public Works Department"
]

export function PermitForm({ permit, open, onClose, onSave, userRole = "user" }: PermitFormProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [newCondition, setNewCondition] = useState("")
  const [newTag, setNewTag] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!permit
  const canEdit = ["admin", "project-manager", "project-executive"].includes(userRole)

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(permitFormSchema),
    defaultValues: {
      number: "",
      type: "",
      status: "pending",
      priority: "medium",
      authority: "",
      applicationDate: format(new Date(), "yyyy-MM-dd"),
      approvalDate: "",
      expirationDate: format(addDays(new Date(), 365), "yyyy-MM-dd"),
      renewalDate: "",
      cost: 0,
      bondAmount: 0,
      description: "",
      comments: "",
      authorityContact: {
        name: "",
        phone: "",
        email: "",
        address: "",
      },
      conditions: [],
      tags: [],
    }
  })

  // Reset form when permit changes
  useEffect(() => {
    if (permit) {
      form.reset({
        number: permit.number,
        type: permit.type,
        status: permit.status,
        priority: permit.priority || "medium",
        authority: permit.authority,
        applicationDate: format(new Date(permit.applicationDate), "yyyy-MM-dd"),
        approvalDate: permit.approvalDate ? format(new Date(permit.approvalDate), "yyyy-MM-dd") : "",
        expirationDate: format(new Date(permit.expirationDate), "yyyy-MM-dd"),
        renewalDate: permit.renewalDate ? format(new Date(permit.renewalDate), "yyyy-MM-dd") : "",
        cost: permit.cost || 0,
        bondAmount: permit.bondAmount || 0,
        description: permit.description || "",
        comments: permit.comments || "",
        authorityContact: permit.authorityContact || {
          name: "",
          phone: "",
          email: "",
          address: "",
        },
        conditions: permit.conditions || [],
        tags: permit.tags || [],
      })
    } else {
      form.reset({
        number: "",
        type: "",
        status: "pending",
        priority: "medium",
        authority: "",
        applicationDate: format(new Date(), "yyyy-MM-dd"),
        approvalDate: "",
        expirationDate: format(addDays(new Date(), 365), "yyyy-MM-dd"),
        renewalDate: "",
        cost: 0,
        bondAmount: 0,
        description: "",
        comments: "",
        authorityContact: {
          name: "",
          phone: "",
          email: "",
          address: "",
        },
        conditions: [],
        tags: [],
      })
    }
  }, [permit, form])

  // Handle form submission
  const handleSubmit = useCallback(async (data: FormData) => {
    if (!canEdit) return
    
    setIsSubmitting(true)
    try {
      const formattedData: PermitFormData = {
        ...data,
        cost: data.cost || undefined,
        bondAmount: data.bondAmount || undefined,
        approvalDate: data.approvalDate || undefined,
        renewalDate: data.renewalDate || undefined,
        authorityContact: data.authorityContact?.name || data.authorityContact?.phone || data.authorityContact?.email || data.authorityContact?.address
          ? data.authorityContact
          : undefined,
      }

      if (isEditing) {
        formattedData.id = permit.id
      }

      await onSave(formattedData)
      onClose()
    } catch (error) {
      console.error("Error saving permit:", error)
    } finally {
      setIsSubmitting(false)
    }
  }, [canEdit, isEditing, permit?.id, onSave, onClose])

  // Handle adding conditions
  const handleAddCondition = useCallback(() => {
    if (!newCondition.trim()) return
    
    const currentConditions = form.getValues("conditions") || []
    form.setValue("conditions", [...currentConditions, newCondition.trim()])
    setNewCondition("")
  }, [newCondition, form])

  // Handle removing conditions
  const handleRemoveCondition = useCallback((index: number) => {
    const currentConditions = form.getValues("conditions") || []
    form.setValue("conditions", currentConditions.filter((_, i) => i !== index))
  }, [form])

  // Handle adding tags
  const handleAddTag = useCallback(() => {
    if (!newTag.trim()) return
    
    const currentTags = form.getValues("tags") || []
    if (!currentTags.includes(newTag.trim())) {
      form.setValue("tags", [...currentTags, newTag.trim()])
    }
    setNewTag("")
  }, [newTag, form])

  // Handle removing tags
  const handleRemoveTag = useCallback((index: number) => {
    const currentTags = form.getValues("tags") || []
    form.setValue("tags", currentTags.filter((_, i) => i !== index))
  }, [form])

  if (!canEdit) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Denied</DialogTitle>
            <DialogDescription>
              You don't have permission to create or edit permits.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {isEditing ? "Edit Permit" : "Create New Permit"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Update permit information and details" : "Enter the details for the new permit"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="dates">Dates & Status</TabsTrigger>
                  <TabsTrigger value="contact">Authority Contact</TabsTrigger>
                  <TabsTrigger value="details">Additional Details</TabsTrigger>
                </TabsList>

                <ScrollArea className="h-96 pr-4">
                  {/* Basic Information Tab */}
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Permit Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., BLDG-2024-001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Permit Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select permit type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {permitTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="authority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Permit Authority *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., City Building Department" 
                                list="authorities"
                                {...field} 
                              />
                            </FormControl>
                            <datalist id="authorities">
                              {commonAuthorities.map((authority) => (
                                <option key={authority} value={authority} />
                              ))}
                            </datalist>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {permitPriorities.map((priority) => (
                                  <SelectItem key={priority.value} value={priority.value}>
                                    {priority.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the work or project covered by this permit..."
                              className="min-h-20"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Permit Cost</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                  className="pl-10"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bondAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bond Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                  className="pl-10"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Dates & Status Tab */}
                  <TabsContent value="dates" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {permitStatuses.map((status) => (
                                  <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="applicationDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Application Date *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="approvalDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Approval Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormDescription>
                              Leave empty if not yet approved
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expirationDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiration Date *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="renewalDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Renewal Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormDescription>
                              Date when permit was last renewed
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Authority Contact Tab */}
                  <TabsContent value="contact" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="authorityContact.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="Contact person name"
                                  className="pl-10"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="authorityContact.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="(555) 123-4567"
                                  className="pl-10"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="authorityContact.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  type="email"
                                  placeholder="contact@authority.gov"
                                  className="pl-10"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="authorityContact.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Textarea 
                                placeholder="Authority office address"
                                className="pl-10 min-h-16"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  {/* Additional Details Tab */}
                  <TabsContent value="details" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comments & Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Additional comments, notes, or special instructions..."
                              className="min-h-20"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Conditions */}
                    <div className="space-y-3">
                      <Label>Permit Conditions</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a permit condition..."
                          value={newCondition}
                          onChange={(e) => setNewCondition(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCondition())}
                        />
                        <Button type="button" variant="outline" onClick={handleAddCondition}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {form.watch("conditions")?.map((condition, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm">{condition}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCondition(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                      <Label>Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                        />
                        <Button type="button" variant="outline" onClick={handleAddTag}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Tag
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.watch("tags")?.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => handleRemoveTag(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#003087] hover:bg-[#002066] text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? "Update Permit" : "Create Permit"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this permit? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 