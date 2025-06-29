'use client'

import { useState, useMemo } from 'react'
import { useEstimating } from './EstimatingProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'
import { 
  Upload, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  X, 
  Eye, 
  Edit, 
  Trash2, 
  FileText,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Building2,
  Target,
  TrendingUp
} from 'lucide-react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { TradePartner, TradePartnerFilters, TradePartnerExportOptions, TradePartnerImportResult } from '@/types/estimating-tracker'

const TradePartnerLog = () => {
  const { 
    tradePartners, 
    addTradePartner, 
    updateTradePartner, 
    deleteTradePartner,
    importTradePartnersFromFile,
    exportTradePartnersToCSV,
    generateTradePartnerTemplate,
    csiCodes
  } = useEstimating()

  const { toast } = useToast()
  
  // State management
  const [filters, setFilters] = useState<TradePartnerFilters>({})
  const [selectedPartner, setSelectedPartner] = useState<TradePartner | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<TradePartnerImportResult | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<Partial<TradePartner>>({
    projectId: 'palm-beach-luxury-estate',
    status: 'selected'
  })

  // Export options
  const [exportOptions, setExportOptions] = useState<TradePartnerExportOptions>({
    format: 'csv',
    includeContactInfo: true,
    includeFinancials: true,
    selectedOnly: false
  })

  // Filtered and sorted data
  const filteredPartners = useMemo(() => {
    let result = [...tradePartners]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(partner => 
        partner.contractorName.toLowerCase().includes(searchLower) ||
        partner.csiDivision.toLowerCase().includes(searchLower) ||
        partner.csiDescription?.toLowerCase().includes(searchLower) ||
        partner.notes?.toLowerCase().includes(searchLower)
      )
    }

    if (filters.csiDivision) {
      result = result.filter(partner => partner.csiDivision === filters.csiDivision)
    }

    if (filters.status) {
      result = result.filter(partner => partner.status === filters.status)
    }

    if (filters.contractValueMin) {
      result = result.filter(partner => 
        partner.contractValue && partner.contractValue >= filters.contractValueMin!
      )
    }

    if (filters.contractValueMax) {
      result = result.filter(partner => 
        partner.contractValue && partner.contractValue <= filters.contractValueMax!
      )
    }

    return result.sort((a, b) => a.number - b.number)
  }, [tradePartners, filters])

  // Statistics
  const stats = useMemo(() => {
    const total = tradePartners.length
    const selected = tradePartners.filter(tp => tp.status === 'selected').length
    const pending = tradePartners.filter(tp => tp.status === 'pending').length
    const backup = tradePartners.filter(tp => tp.status === 'backup').length
    const rejected = tradePartners.filter(tp => tp.status === 'rejected').length
    
    const totalValue = tradePartners
      .filter(tp => tp.contractValue)
      .reduce((sum, tp) => sum + (tp.contractValue || 0), 0)
    
    const selectedValue = tradePartners
      .filter(tp => tp.status === 'selected' && tp.contractValue)
      .reduce((sum, tp) => sum + (tp.contractValue || 0), 0)

    const uniqueDivisions = new Set(tradePartners.map(tp => tp.csiDivision)).size

    return {
      total,
      selected,
      pending,
      backup,
      rejected,
      totalValue,
      selectedValue,
      uniqueDivisions
    }
  }, [tradePartners])

  // Unique CSI divisions for filtering
  const uniqueCSIDivisions = useMemo(() => {
    const divisions = new Set(tradePartners.map(tp => tp.csiDivision))
    return Array.from(divisions).sort()
  }, [tradePartners])

  // Clear filters
  const clearFilters = () => {
    setFilters({})
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.csiDivision || !formData.contractorName) {
      toast({
        title: "Error",
        description: "CSI Division and Contractor Name are required",
        variant: "destructive"
      })
      return
    }

    // Check for duplicate
    const existingPartner = tradePartners.find(tp => 
      tp.csiDivision === formData.csiDivision && 
      tp.contractorName === formData.contractorName &&
      tp.id !== selectedPartner?.id
    )

    if (existingPartner) {
      toast({
        title: "Error",
        description: "A trade partner with this CSI Division and contractor name already exists",
        variant: "destructive"
      })
      return
    }

    // Find CSI description
    const csiMatch = csiCodes.find(code => code.csi_code === formData.csiDivision)

    const partnerData = {
      ...formData,
      projectId: formData.projectId || 'palm-beach-luxury-estate',
      number: formData.number || (Math.max(...tradePartners.map(tp => tp.number), 0) + 1),
      csiDescription: csiMatch?.csi_code_description || formData.csiDescription,
      status: formData.status || 'selected'
    } as Omit<TradePartner, 'id' | 'createdAt' | 'updatedAt'>

    if (isEditDialogOpen && selectedPartner) {
      updateTradePartner(selectedPartner.id, partnerData)
      toast({
        title: "Success",
        description: "Trade partner updated successfully"
      })
      setIsEditDialogOpen(false)
    } else {
      addTradePartner(partnerData)
      toast({
        title: "Success",
        description: "Trade partner added successfully"
      })
      setIsAddDialogOpen(false)
    }

    setFormData({ projectId: 'palm-beach-luxury-estate', status: 'selected' })
    setSelectedPartner(null)
  }

  // Handle file import
  const handleImport = async () => {
    if (!importFile) return

    setIsImporting(true)
    try {
      const result = await importTradePartnersFromFile(importFile)
      setImportResult(result)
      
      if (result.success) {
        toast({
          title: "Import Successful",
          description: `${result.successfulImports} trade partners imported successfully`
        })
      } else {
        toast({
          title: "Import Failed",
          description: "Failed to import trade partners",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Import Error",
        description: "An error occurred during import",
        variant: "destructive"
      })
    } finally {
      setIsImporting(false)
    }
  }

  // Handle export
  const handleExport = () => {
    exportTradePartnersToCSV(exportOptions)
    toast({
      title: "Export Successful",
      description: "Trade partners exported to CSV"
    })
    setIsExportDialogOpen(false)
  }

  // Handle delete
  const handleDelete = (partner: TradePartner) => {
    deleteTradePartner(partner.id)
    toast({
      title: "Success",
      description: "Trade partner deleted successfully"
    })
  }

  // Open edit dialog
  const openEditDialog = (partner: TradePartner) => {
    setSelectedPartner(partner)
    setFormData({
      ...partner,
      contractValue: partner.contractValue || undefined
    })
    setIsEditDialogOpen(true)
  }

  // Open view dialog
  const openViewDialog = (partner: TradePartner) => {
    setSelectedPartner(partner)
    setIsViewDialogOpen(true)
  }

  const getStatusBadge = (status: TradePartner['status']) => {
    const variants = {
      selected: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      backup: { variant: 'outline' as const, icon: Target, color: 'text-blue-600' },
      rejected: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' }
    }
    
    const config = variants[status]
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="capitalize">
        <Icon className={`w-3 h-3 mr-1 ${config.color}`} />
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.uniqueDivisions} CSI divisions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.selected}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pending} pending, {stats.backup} backup
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contract Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.selectedValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Selected contracts only
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All contracts combined
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Trade Partner Management</CardTitle>
          <CardDescription>
            Manage subcontractors selected after bid leveling by CSI Division
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search partners, CSI divisions, or descriptions..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filters.csiDivision || 'all'} onValueChange={(value) => setFilters({ ...filters, csiDivision: value === 'all' ? undefined : value })}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by CSI Division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Divisions</SelectItem>
                  {uniqueCSIDivisions.map(division => (
                    <SelectItem key={division} value={division}>{division}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.status || 'all'} onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? undefined : value as TradePartner['status'] })}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="selected">Selected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="backup">Backup</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {(filters.search || filters.csiDivision || filters.status) && (
                <Button variant="outline" onClick={clearFilters} size="icon">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Trade Partner</DialogTitle>
                  <DialogDescription>
                    Add a new subcontractor to the project
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="number">Number</Label>
                      <Input
                        id="number"
                        type="number"
                        value={formData.number || ''}
                        onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || undefined })}
                        placeholder="Auto-generated"
                      />
                    </div>
                    <div>
                      <Label htmlFor="csi-division">CSI Division *</Label>
                      <Input
                        id="csi-division"
                        value={formData.csiDivision || ''}
                        onChange={(e) => setFormData({ ...formData, csiDivision: e.target.value })}
                        placeholder="e.g., 02 21 00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contractor-name">Contractor Name *</Label>
                    <Input
                      id="contractor-name"
                      value={formData.contractorName || ''}
                      onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}
                      placeholder="Enter contractor name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status || 'selected'} onValueChange={(value) => setFormData({ ...formData, status: value as TradePartner['status'] })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="selected">Selected</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="backup">Backup</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="contract-value">Contract Value</Label>
                      <Input
                        id="contract-value"
                        type="number"
                        value={formData.contractValue || ''}
                        onChange={(e) => setFormData({ ...formData, contractValue: parseFloat(e.target.value) || undefined })}
                        placeholder="Enter contract value"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes"
                      rows={3}
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Partner</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Trade Partners</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file to import multiple trade partners
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="import-file">CSV File</Label>
                    <Input
                      id="import-file"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports CSV, Excel (.xlsx, .xls) files
                    </p>
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={generateTradePartnerTemplate}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>

                  {importResult && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Import Results</h4>
                      <div className="text-sm space-y-1">
                        <p>Total rows: {importResult.totalRows}</p>
                        <p className="text-green-600">Successful: {importResult.successfulImports}</p>
                        <p className="text-yellow-600">Duplicates: {importResult.duplicates}</p>
                        <p className="text-red-600">Errors: {importResult.errors.length}</p>
                      </div>
                      {importResult.errors.length > 0 && (
                        <div className="max-h-32 overflow-y-auto">
                          {importResult.errors.map((error, index) => (
                            <p key={index} className="text-sm text-red-600">
                              Row {error.row}: {error.message} ({error.field})
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsImportDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleImport} 
                    disabled={!importFile || isImporting}
                  >
                    {isImporting ? 'Importing...' : 'Import'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Trade Partners</DialogTitle>
                  <DialogDescription>
                    Configure export options for trade partners data
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Export Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="selected-only"
                          checked={exportOptions.selectedOnly}
                          onChange={(e) => setExportOptions({ ...exportOptions, selectedOnly: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="selected-only" className="text-sm">Selected partners only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="include-financials"
                          checked={exportOptions.includeFinancials}
                          onChange={(e) => setExportOptions({ ...exportOptions, includeFinancials: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="include-financials" className="text-sm">Include financial data</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="include-contact"
                          checked={exportOptions.includeContactInfo}
                          onChange={(e) => setExportOptions({ ...exportOptions, includeContactInfo: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="include-contact" className="text-sm">Include contact information</Label>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleExport}>Export CSV</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Trade Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trade Partners ({filteredPartners.length})</CardTitle>
          <CardDescription>
            List of subcontractors organized by CSI Division
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPartners.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Trade Partners Found</h3>
              <p className="text-muted-foreground mb-4">
                {tradePartners.length === 0 
                  ? "Get started by adding your first trade partner or importing from a spreadsheet."
                  : "No partners match your current filters. Try adjusting your search criteria."
                }
              </p>
              {tradePartners.length === 0 && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Partner
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>CSI Division</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Contractor Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contract Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">{partner.number}</TableCell>
                      <TableCell>
                        <code className="text-sm">{partner.csiDivision}</code>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {partner.csiDescription || '-'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {partner.contractorName}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(partner.status)}
                      </TableCell>
                      <TableCell>
                        {partner.contractValue 
                          ? `$${partner.contractValue.toLocaleString()}`
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openViewDialog(partner)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(partner)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Trade Partner</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{partner.contractorName}"? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(partner)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Trade Partner</DialogTitle>
            <DialogDescription>
              Update trade partner information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-number">Number</Label>
                <Input
                  id="edit-number"
                  type="number"
                  value={formData.number || ''}
                  onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || undefined })}
                />
              </div>
              <div>
                <Label htmlFor="edit-csi-division">CSI Division *</Label>
                <Input
                  id="edit-csi-division"
                  value={formData.csiDivision || ''}
                  onChange={(e) => setFormData({ ...formData, csiDivision: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-contractor-name">Contractor Name *</Label>
              <Input
                id="edit-contractor-name"
                value={formData.contractorName || ''}
                onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status || 'selected'} onValueChange={(value) => setFormData({ ...formData, status: value as TradePartner['status'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="selected">Selected</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="backup">Backup</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-contract-value">Contract Value</Label>
                <Input
                  id="edit-contract-value"
                  type="number"
                  value={formData.contractValue || ''}
                  onChange={(e) => setFormData({ ...formData, contractValue: parseFloat(e.target.value) || undefined })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Partner</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Trade Partner Details</DialogTitle>
            <DialogDescription>
              View complete trade partner information
            </DialogDescription>
          </DialogHeader>
          {selectedPartner && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Number</Label>
                  <p className="text-sm font-medium">{selectedPartner.number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedPartner.status)}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">CSI Division</Label>
                <p className="text-sm">
                  <code>{selectedPartner.csiDivision}</code>
                  {selectedPartner.csiDescription && (
                    <span className="ml-2 text-muted-foreground">
                      - {selectedPartner.csiDescription}
                    </span>
                  )}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Contractor Name</Label>
                <p className="text-sm font-medium">{selectedPartner.contractorName}</p>
              </div>

              {selectedPartner.contractValue && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Contract Value</Label>
                  <p className="text-sm font-medium text-green-600">
                    ${selectedPartner.contractValue.toLocaleString()}
                  </p>
                </div>
              )}

              {selectedPartner.contactInfo && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Contact Information</Label>
                    <div className="space-y-1 mt-1">
                      {selectedPartner.contactInfo.primaryContact && (
                        <p className="text-sm">
                          <span className="font-medium">Contact:</span> {selectedPartner.contactInfo.primaryContact}
                        </p>
                      )}
                      {selectedPartner.contactInfo.email && (
                        <p className="text-sm">
                          <span className="font-medium">Email:</span> {selectedPartner.contactInfo.email}
                        </p>
                      )}
                      {selectedPartner.contactInfo.phone && (
                        <p className="text-sm">
                          <span className="font-medium">Phone:</span> {selectedPartner.contactInfo.phone}
                        </p>
                      )}
                      {selectedPartner.contactInfo.address && (
                        <p className="text-sm">
                          <span className="font-medium">Address:</span> {selectedPartner.contactInfo.address}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {(selectedPartner.bidDate || selectedPartner.awardDate || selectedPartner.contractSignedDate) && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Key Dates</Label>
                    <div className="space-y-1 mt-1">
                      {selectedPartner.bidDate && (
                        <p className="text-sm">
                          <span className="font-medium">Bid Date:</span> {new Date(selectedPartner.bidDate).toLocaleDateString()}
                        </p>
                      )}
                      {selectedPartner.awardDate && (
                        <p className="text-sm">
                          <span className="font-medium">Award Date:</span> {new Date(selectedPartner.awardDate).toLocaleDateString()}
                        </p>
                      )}
                      {selectedPartner.contractSignedDate && (
                        <p className="text-sm">
                          <span className="font-medium">Contract Signed:</span> {new Date(selectedPartner.contractSignedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {selectedPartner.notes && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                    <p className="text-sm mt-1">{selectedPartner.notes}</p>
                  </div>
                </>
              )}

              <Separator />
              <div className="text-xs text-muted-foreground">
                <p>Created: {new Date(selectedPartner.createdAt).toLocaleString()}</p>
                <p>Updated: {new Date(selectedPartner.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false)
              if (selectedPartner) openEditDialog(selectedPartner)
            }}>
              Edit Partner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TradePartnerLog 