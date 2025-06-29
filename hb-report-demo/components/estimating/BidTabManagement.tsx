"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Building2, Plus, Edit, Trash2, DollarSign, Users, FileText, Trophy, Upload, Download, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEstimating } from './EstimatingProvider';
import { BidTab, BidTabItem, VendorBid, CSICode } from '@/types/estimating-tracker';

interface BidTabManagementProps {
  className?: string;
}

export function BidTabManagement({ className }: BidTabManagementProps) {
  const {
    bidTabs,
    bidTabTemplates,
    csiCodes,
    addBidTab,
    updateBidTab,
    deleteBidTab,
    duplicateBidTab,
    addBidTabItem,
    updateBidTabItem,
    deleteBidTabItem,
    addVendorBid,
    updateVendorBid,
    deleteVendorBid,
    selectWinningBid,
    getBidTabSummary,
    exportBidTabsToCSV,
    generateBidTabTemplate,
    importBidTabsFromFile
  } = useEstimating();

  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [showVendorDialog, setShowVendorDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<BidTabItem | null>(null);
  const [editingVendor, setEditingVendor] = useState<VendorBid | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [csiFilter, setCsiFilter] = useState<string>('all');

  // Form states
  const [newBidTab, setNewBidTab] = useState({
    tradeName: '',
    csiCode: '',
    csiDescription: '',
    squareFootage: 0,
    generalInclusions: [] as string[],
    scopeRequirements: [] as string[]
  });

  const [newItem, setNewItem] = useState<Partial<BidTabItem>>({
    description: '',
    category: '',
    quantity: 1,
    unitOfMeasure: 'LS',
    unitCost: 0,
    isIncluded: true,
    notes: ''
  });

  const [newVendor, setNewVendor] = useState<Partial<VendorBid>>({
    vendorName: '',
    contactPerson: '',
    phone: '',
    email: '',
    totalBid: 0,
    bondRate: 0,
    isPrequalified: false,
    needsPrequalification: false,
    notes: ''
  });

  // Get summary data
  const summary = getBidTabSummary();

  // Filtered bid tabs
  const filteredBidTabs = useMemo(() => {
    return bidTabs.filter(tab => {
      const matchesSearch = tab.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tab.csiCode.includes(searchTerm) ||
                           tab.csiDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && tab.isActive) ||
                           (statusFilter === 'inactive' && !tab.isActive) ||
                           (statusFilter === 'completed' && tab.items.length > 0 && tab.vendors.length > 0);
      
      const matchesCSI = csiFilter === 'all' || tab.csiCode.startsWith(csiFilter);
      
      return matchesSearch && matchesStatus && matchesCSI;
    });
  }, [bidTabs, searchTerm, statusFilter, csiFilter]);

  // Available categories for selected CSI code
  const availableCategories = useMemo(() => {
    if (!selectedTab) return [];
    const tab = bidTabs.find(t => t.id === selectedTab);
    if (!tab) return [];
    
    const uniqueCategories = [...new Set(tab.items.map(item => item.category))];
    return uniqueCategories.length > 0 ? uniqueCategories : ['General'];
  }, [selectedTab, bidTabs]);

  // Units of measure
  const unitsOfMeasure = ['LS', 'EA', 'SF', 'LF', 'CY', 'SY', 'TON', 'LB', 'GAL', 'HR'];

  const handleCreateBidTab = () => {
    if (!newBidTab.tradeName || !newBidTab.csiCode) return;

    const selectedCSI = csiCodes.find(code => code.code === newBidTab.csiCode);
    
    addBidTab({
      projectId: 'proj-001', // Default project ID
      tradeName: newBidTab.tradeName,
      csiCode: newBidTab.csiCode,
      csiDescription: selectedCSI?.description || newBidTab.csiDescription,
      isActive: true,
      generalInclusions: newBidTab.generalInclusions,
      scopeRequirements: newBidTab.scopeRequirements,
      squareFootage: newBidTab.squareFootage,
      createdBy: 'Current User'
    });

    setNewBidTab({
      tradeName: '',
      csiCode: '',
      csiDescription: '',
      squareFootage: 0,
      generalInclusions: [],
      scopeRequirements: []
    });
    setShowCreateDialog(false);
  };

  const handleAddItem = () => {
    if (!selectedTab || !newItem.description) return;

    addBidTabItem(selectedTab, {
      description: newItem.description!,
      category: newItem.category || 'General',
      quantity: newItem.quantity || 1,
      unitOfMeasure: newItem.unitOfMeasure || 'LS',
      unitCost: newItem.unitCost || 0,
      isIncluded: newItem.isIncluded ?? true,
      notes: newItem.notes || ''
    });

    setNewItem({
      description: '',
      category: '',
      quantity: 1,
      unitOfMeasure: 'LS',
      unitCost: 0,
      isIncluded: true,
      notes: ''
    });
    setShowItemDialog(false);
  };

  const handleEditItem = (item: BidTabItem) => {
    setEditingItem(item);
    setNewItem({
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      unitOfMeasure: item.unitOfMeasure,
      unitCost: item.unitCost,
      isIncluded: item.isIncluded,
      notes: item.notes
    });
    setShowItemDialog(true);
  };

  const handleUpdateItem = () => {
    if (!selectedTab || !editingItem || !newItem.description) return;

    updateBidTabItem(selectedTab, editingItem.id, {
      description: newItem.description,
      category: newItem.category || 'General',
      quantity: newItem.quantity || 1,
      unitOfMeasure: newItem.unitOfMeasure || 'LS',
      unitCost: newItem.unitCost || 0,
      isIncluded: newItem.isIncluded ?? true,
      notes: newItem.notes || ''
    });

    setEditingItem(null);
    setNewItem({
      description: '',
      category: '',
      quantity: 1,
      unitOfMeasure: 'LS',
      unitCost: 0,
      isIncluded: true,
      notes: ''
    });
    setShowItemDialog(false);
  };

  const handleAddVendor = () => {
    if (!selectedTab || !newVendor.vendorName || !newVendor.totalBid) return;

    const bondAmount = (newVendor.totalBid * (newVendor.bondRate || 0)) / 100;
    const adjustedTotal = newVendor.totalBid + bondAmount;

    addVendorBid(selectedTab, {
      vendorName: newVendor.vendorName,
      contactPerson: newVendor.contactPerson || '',
      phone: newVendor.phone || '',
      email: newVendor.email || '',
      totalBid: newVendor.totalBid,
      bondRate: newVendor.bondRate || 0,
      bondAmount,
      adjustedTotal,
      isWinner: false,
      isPrequalified: newVendor.isPrequalified || false,
      needsPrequalification: newVendor.needsPrequalification || false,
      submittedAt: new Date().toISOString(),
      notes: newVendor.notes || ''
    });

    setNewVendor({
      vendorName: '',
      contactPerson: '',
      phone: '',
      email: '',
      totalBid: 0,
      bondRate: 0,
      isPrequalified: false,
      needsPrequalification: false,
      notes: ''
    });
    setShowVendorDialog(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const selectedBidTab = selectedTab ? bidTabs.find(t => t.id === selectedTab) : null;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Bid Tabs</p>
                <p className="text-2xl font-bold">{summary.totalTabs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold">{summary.totalVendors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{summary.completedTabs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Bid Tab Management
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button onClick={() => generateBidTabTemplate()} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Template
              </Button>
              <Button onClick={() => exportBidTabsToCSV({ format: 'csv', includeVendors: true, includeItems: true, includeNotes: true, selectedTabsOnly: false })} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Bid Tab
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Bid Tab</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tradeName">Trade Name</Label>
                        <Input
                          id="tradeName"
                          value={newBidTab.tradeName}
                          onChange={(e) => setNewBidTab(prev => ({ ...prev, tradeName: e.target.value }))}
                          placeholder="e.g., Surveying - Atlantic Fields"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="csiCode">CSI Code</Label>
                        <Select value={newBidTab.csiCode} onValueChange={(value) => {
                          const selectedCSI = csiCodes.find(code => code.code === value);
                          setNewBidTab(prev => ({ 
                            ...prev, 
                            csiCode: value,
                            csiDescription: selectedCSI?.description || ''
                          }));
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select CSI Code" />
                          </SelectTrigger>
                          <SelectContent>
                            {csiCodes.map((code) => (
                              <SelectItem key={code.code} value={code.code}>
                                {code.code} - {code.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="squareFootage">Square Footage (Optional)</Label>
                      <Input
                        id="squareFootage"
                        type="number"
                        value={newBidTab.squareFootage || ''}
                        onChange={(e) => setNewBidTab(prev => ({ ...prev, squareFootage: Number(e.target.value) }))}
                        placeholder="Enter project square footage"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateBidTab}>
                        Create Bid Tab
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search bid tabs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={csiFilter} onValueChange={setCsiFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All CSI</SelectItem>
                <SelectItem value="02">02 - Existing</SelectItem>
                <SelectItem value="03">03 - Concrete</SelectItem>
                <SelectItem value="04">04 - Masonry</SelectItem>
                <SelectItem value="05">05 - Metals</SelectItem>
                <SelectItem value="06">06 - Wood</SelectItem>
                <SelectItem value="07">07 - Thermal</SelectItem>
                <SelectItem value="08">08 - Openings</SelectItem>
                <SelectItem value="09">09 - Finishes</SelectItem>
                <SelectItem value="26">26 - Electrical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bid Tabs List */}
          <div className="space-y-4">
            {filteredBidTabs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No bid tabs found</p>
                <p className="text-sm">Create your first bid tab to get started</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredBidTabs.map((tab) => (
                  <Card key={tab.id} className={cn(
                    'cursor-pointer transition-colors hover:bg-gray-50',
                    selectedTab === tab.id && 'ring-2 ring-blue-500'
                  )} onClick={() => setSelectedTab(tab.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="font-semibold">{tab.tradeName}</h3>
                              <p className="text-sm text-gray-600">{tab.csiCode} - {tab.csiDescription}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={tab.isActive ? "default" : "secondary"}>
                                {tab.isActive ? "Active" : "Inactive"}
                              </Badge>
                              {tab.items.length > 0 && tab.vendors.length > 0 && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <Trophy className="h-3 w-3 mr-1" />
                                  Complete
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">{formatCurrency(tab.adjustedTotal)}</p>
                          <p className="text-sm text-gray-600">
                            {tab.items.length} items • {tab.vendors.length} vendors
                          </p>
                          {tab.costPerSF && (
                            <p className="text-xs text-gray-500">${tab.costPerSF.toFixed(2)}/SF</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Bid Tab Details */}
      {selectedBidTab && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedBidTab.tradeName}</CardTitle>
              <div className="flex items-center gap-2">
                <Button onClick={() => duplicateBidTab(selectedBidTab.id)} variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                <Button onClick={() => deleteBidTab(selectedBidTab.id)} variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="items">
              <TabsList>
                <TabsTrigger value="items">Line Items ({selectedBidTab.items.length})</TabsTrigger>
                <TabsTrigger value="vendors">Vendors ({selectedBidTab.vendors.length})</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Line Items</h3>
                  <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit' : 'Add'} Line Item</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            value={newItem.description || ''}
                            onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Item description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                              id="category"
                              value={newItem.category || ''}
                              onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                              placeholder="Category"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                              id="quantity"
                              type="number"
                              step="0.01"
                              value={newItem.quantity || ''}
                              onChange={(e) => setNewItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="unitOfMeasure">Unit</Label>
                            <Select value={newItem.unitOfMeasure} onValueChange={(value) => setNewItem(prev => ({ ...prev, unitOfMeasure: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {unitsOfMeasure.map(unit => (
                                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="unitCost">Unit Cost</Label>
                            <Input
                              id="unitCost"
                              type="number"
                              step="0.01"
                              value={newItem.unitCost || ''}
                              onChange={(e) => setNewItem(prev => ({ ...prev, unitCost: Number(e.target.value) }))}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isIncluded"
                            checked={newItem.isIncluded}
                            onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, isIncluded: !!checked }))}
                          />
                          <Label htmlFor="isIncluded">Include in total</Label>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            id="notes"
                            value={newItem.notes || ''}
                            onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Additional notes"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => {
                            setShowItemDialog(false);
                            setEditingItem(null);
                            setNewItem({
                              description: '',
                              category: '',
                              quantity: 1,
                              unitOfMeasure: 'LS',
                              unitCost: 0,
                              isIncluded: true,
                              notes: ''
                            });
                          }}>
                            Cancel
                          </Button>
                          <Button onClick={editingItem ? handleUpdateItem : handleAddItem}>
                            {editingItem ? 'Update' : 'Add'} Item
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Unit Cost</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead>Included</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedBidTab.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell>{item.unitOfMeasure}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitCost)}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.subtotal)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.isIncluded ? "default" : "secondary"}>
                              {item.isIncluded ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditItem(item)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteBidTabItem(selectedBidTab.id, item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {selectedBidTab.items.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            No line items yet. Add your first item to get started.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {selectedBidTab.items.length > 0 && (
                  <div className="flex justify-end">
                    <Card className="w-80">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-medium">{formatCurrency(selectedBidTab.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Bond ({selectedBidTab.bondRate}%):</span>
                            <span className="font-medium">{formatCurrency(selectedBidTab.bondAmount)}</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between text-lg font-bold">
                              <span>Total:</span>
                              <span>{formatCurrency(selectedBidTab.adjustedTotal)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="vendors" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Vendor Bids</h3>
                  <Dialog open={showVendorDialog} onOpenChange={setShowVendorDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vendor
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Vendor Bid</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="vendorName">Vendor Name</Label>
                            <Input
                              id="vendorName"
                              value={newVendor.vendorName || ''}
                              onChange={(e) => setNewVendor(prev => ({ ...prev, vendorName: e.target.value }))}
                              placeholder="Company name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactPerson">Contact Person</Label>
                            <Input
                              id="contactPerson"
                              value={newVendor.contactPerson || ''}
                              onChange={(e) => setNewVendor(prev => ({ ...prev, contactPerson: e.target.value }))}
                              placeholder="Contact name"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={newVendor.phone || ''}
                              onChange={(e) => setNewVendor(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="Phone number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newVendor.email || ''}
                              onChange={(e) => setNewVendor(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="Email address"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="totalBid">Total Bid</Label>
                            <Input
                              id="totalBid"
                              type="number"
                              step="0.01"
                              value={newVendor.totalBid || ''}
                              onChange={(e) => setNewVendor(prev => ({ ...prev, totalBid: Number(e.target.value) }))}
                              placeholder="0.00"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bondRate">Bond Rate (%)</Label>
                            <Input
                              id="bondRate"
                              type="number"
                              step="0.1"
                              value={newVendor.bondRate || ''}
                              onChange={(e) => setNewVendor(prev => ({ ...prev, bondRate: Number(e.target.value) }))}
                              placeholder="0.0"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="isPrequalified"
                              checked={newVendor.isPrequalified}
                              onCheckedChange={(checked) => setNewVendor(prev => ({ ...prev, isPrequalified: !!checked }))}
                            />
                            <Label htmlFor="isPrequalified">Prequalified</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="needsPrequalification"
                              checked={newVendor.needsPrequalification}
                              onCheckedChange={(checked) => setNewVendor(prev => ({ ...prev, needsPrequalification: !!checked }))}
                            />
                            <Label htmlFor="needsPrequalification">Needs Prequalification</Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vendorNotes">Notes</Label>
                          <Textarea
                            id="vendorNotes"
                            value={newVendor.notes || ''}
                            onChange={(e) => setNewVendor(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Additional notes"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => {
                            setShowVendorDialog(false);
                            setNewVendor({
                              vendorName: '',
                              contactPerson: '',
                              phone: '',
                              email: '',
                              totalBid: 0,
                              bondRate: 0,
                              isPrequalified: false,
                              needsPrequalification: false,
                              notes: ''
                            });
                          }}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddVendor}>
                            Add Vendor
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">Total Bid</TableHead>
                        <TableHead className="text-right">Bond</TableHead>
                        <TableHead className="text-right">Adjusted Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedBidTab.vendors.map((vendor) => (
                        <TableRow key={vendor.id} className={vendor.isWinner ? 'bg-green-50' : ''}>
                          <TableCell>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {vendor.vendorName}
                                {vendor.isWinner && <Trophy className="h-4 w-4 text-yellow-500" />}
                              </div>
                              {vendor.contactPerson && (
                                <div className="text-sm text-gray-600">{vendor.contactPerson}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {vendor.phone && <div>{vendor.phone}</div>}
                              {vendor.email && <div className="text-gray-600">{vendor.email}</div>}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(vendor.totalBid)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(vendor.bondAmount)} ({vendor.bondRate}%)
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(vendor.adjustedTotal)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {vendor.isPrequalified && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  Prequalified
                                </Badge>
                              )}
                              {vendor.needsPrequalification && (
                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Needs Prequalification
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {!vendor.isWinner && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => selectWinningBid(selectedBidTab.id, vendor.id)}
                                  title="Select as winner"
                                >
                                  <Trophy className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteVendorBid(selectedBidTab.id, vendor.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {selectedBidTab.vendors.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No vendor bids yet. Add vendors to compare pricing.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>General Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Trade Name</Label>
                        <p className="mt-1">{selectedBidTab.tradeName}</p>
                      </div>
                      <div>
                        <Label>CSI Code</Label>
                        <p className="mt-1">{selectedBidTab.csiCode} - {selectedBidTab.csiDescription}</p>
                      </div>
                      <div>
                        <Label>Created By</Label>
                        <p className="mt-1">{selectedBidTab.createdBy}</p>
                      </div>
                      <div>
                        <Label>Created Date</Label>
                        <p className="mt-1">{new Date(selectedBidTab.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label>Last Updated</Label>
                        <p className="mt-1">{new Date(selectedBidTab.updatedAt).toLocaleDateString()}</p>
                      </div>
                      {selectedBidTab.squareFootage && (
                        <div>
                          <Label>Square Footage</Label>
                          <p className="mt-1">{selectedBidTab.squareFootage.toLocaleString()} SF</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Line Items:</span>
                        <span className="font-medium">{selectedBidTab.items.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vendors:</span>
                        <span className="font-medium">{selectedBidTab.vendors.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">{formatCurrency(selectedBidTab.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bond Amount:</span>
                        <span className="font-medium">{formatCurrency(selectedBidTab.bondAmount)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Adjusted Total:</span>
                          <span>{formatCurrency(selectedBidTab.adjustedTotal)}</span>
                        </div>
                      </div>
                      {selectedBidTab.costPerSF && (
                        <div className="flex justify-between">
                          <span>Cost per SF:</span>
                          <span className="font-medium">${selectedBidTab.costPerSF.toFixed(2)}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {selectedBidTab.generalInclusions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>General Inclusions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedBidTab.generalInclusions.map((inclusion, index) => (
                          <li key={index} className="text-sm">{inclusion}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {selectedBidTab.scopeRequirements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Scope Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedBidTab.scopeRequirements.map((requirement, index) => (
                          <li key={index} className="text-sm">{requirement}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BidTabManagement; 