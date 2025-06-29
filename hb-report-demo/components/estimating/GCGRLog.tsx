"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Building2, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign,
  Calendar,
  Users,
  Wrench,
  Shield,
  Sparkles,
  Settings,
  FileText,
  TestTube,
  Car,
  Plane,
  Filter,
  X,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useEstimating } from './EstimatingProvider';
import { useToast } from '@/hooks/use-toast';
import type { GCGRItem, GCGRFilters, GCGRExportOptions } from '@/types/estimating-tracker';

interface GCGRFormData {
  contractRef: string;
  category: GCGRItem['category'];
  description: string;
  position?: string;
  qty: string;
  unitOfMeasure: string;
  unitCost: string;
  percentTime?: string;
  customLaborRate?: string;
  flsaOvertime?: string;
  remarks?: string;
  isIncluded: boolean;
  startDate?: string;
  endDate?: string;
}

const initialFormData: GCGRFormData = {
  contractRef: '',
  category: 'Field Labor - Construction',
  description: '',
  position: '',
  qty: '0',
  unitOfMeasure: 'ea',
  unitCost: '0',
  percentTime: '',
  customLaborRate: '',
  flsaOvertime: '',
  remarks: '',
  isIncluded: true,
  startDate: '',
  endDate: ''
};

const categories = [
  { value: 'Field Labor - Construction', label: 'Field Labor - Construction', icon: Users },
  { value: 'Field Labor - Close Out', label: 'Field Labor - Close Out', icon: Users },
  { value: 'Field Office - Contractor', label: 'Field Office', icon: Building2 },
  { value: 'Temporary Utilities', label: 'Temporary Utilities', icon: Wrench },
  { value: 'Equipment', label: 'Equipment', icon: Wrench },
  { value: 'Security', label: 'Security', icon: Shield },
  { value: 'Cleaning', label: 'Cleaning', icon: Sparkles },
  { value: 'Services', label: 'Services', icon: Settings },
  { value: 'Drawings', label: 'Drawings', icon: FileText },
  { value: 'Testing', label: 'Testing', icon: TestTube },
  { value: 'Permits', label: 'Permits', icon: FileText },
  { value: 'Travel', label: 'Travel', icon: Plane },
  { value: 'Other', label: 'Other', icon: Settings }
];

const unitOfMeasureOptions = [
  'ea', 'ls', 'lf', 'sf', 'sy', 'cf', 'cy', 'lb', 'ton', 'gal', 'hr', 'day', 'wks', 'mos'
];

export default function GCGRLog() {
  const { 
    gcgrItems, 
    projectPhases,
    addGCGRItem, 
    updateGCGRItem, 
    deleteGCGRItem, 
    getGCGRSummary,
    importGCGRFromFile,
    exportGCGRToCSV,
    generateGCGRTemplate
  } = useEstimating();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<GCGRFilters>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<GCGRItem | null>(null);
  const [viewingItem, setViewingItem] = useState<GCGRItem | null>(null);
  const [formData, setFormData] = useState<GCGRFormData>(initialFormData);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  // Computed values
  const summary = useMemo(() => getGCGRSummary(), [gcgrItems]);
  
  const filteredItems = useMemo(() => {
    return gcgrItems.filter(item => {
      const matchesSearch = !searchTerm || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contractRef?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.remarks?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      const matchesIncluded = filters.isIncluded === undefined || item.isIncluded === filters.isIncluded;
      
      const matchesCostRange = (!filters.costMin || item.totalCost >= filters.costMin) &&
                               (!filters.costMax || item.totalCost <= filters.costMax);

      return matchesSearch && matchesCategory && matchesIncluded && matchesCostRange;
    });
  }, [gcgrItems, searchTerm, selectedCategory, filters]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, { count: number; cost: number; included: number }> = {};
    
    gcgrItems.forEach(item => {
      if (!totals[item.category]) {
        totals[item.category] = { count: 0, cost: 0, included: 0 };
      }
      totals[item.category].count++;
      totals[item.category].cost += item.totalCost;
      if (item.isIncluded) {
        totals[item.category].included += item.totalCost;
      }
    });

    return totals;
  }, [gcgrItems]);

  // Handlers
  const handleAddItem = () => {
    setFormData(initialFormData);
    setEditingItem(null);
    setShowAddDialog(true);
  };

  const handleEditItem = (item: GCGRItem) => {
    setFormData({
      contractRef: item.contractRef || '',
      category: item.category,
      description: item.description,
      position: item.position || '',
      qty: item.qty.toString(),
      unitOfMeasure: item.unitOfMeasure,
      unitCost: item.unitCost.toString(),
      percentTime: item.percentTime?.toString() || '',
      customLaborRate: item.customLaborRate?.toString() || '',
      flsaOvertime: item.flsaOvertime?.toString() || '',
      remarks: item.remarks || '',
      isIncluded: item.isIncluded,
      startDate: item.startDate || '',
      endDate: item.endDate || ''
    });
    setEditingItem(item);
    setShowEditDialog(true);
  };

  const handleViewItem = (item: GCGRItem) => {
    setViewingItem(item);
    setShowViewDialog(true);
  };

  const handleDeleteItem = async (item: GCGRItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.description}"?`)) {
      try {
        deleteGCGRItem(item.id);
        toast({
          title: "Success",
          description: "GC/GR item deleted successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete item",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const itemData = {
        projectId: 'palm-beach-luxury-estate',
        contractRef: formData.contractRef || undefined,
        category: formData.category,
        description: formData.description,
        position: formData.position || undefined,
        qty: parseFloat(formData.qty) || 0,
        unitOfMeasure: formData.unitOfMeasure,
        unitCost: parseFloat(formData.unitCost) || 0,
        totalCost: (parseFloat(formData.qty) || 0) * (parseFloat(formData.unitCost) || 0),
        percentTime: formData.percentTime ? parseFloat(formData.percentTime) : undefined,
        customLaborRate: formData.customLaborRate ? parseFloat(formData.customLaborRate) : undefined,
        flsaOvertime: formData.flsaOvertime ? parseFloat(formData.flsaOvertime) : undefined,
        remarks: formData.remarks || undefined,
        isIncluded: formData.isIncluded,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined
      };

      if (editingItem) {
        updateGCGRItem(editingItem.id, itemData);
        toast({
          title: "Success",
          description: "GC/GR item updated successfully"
        });
      } else {
        addGCGRItem(itemData);
        toast({
          title: "Success", 
          description: "GC/GR item added successfully"
        });
      }

      setShowAddDialog(false);
      setShowEditDialog(false);
      setFormData(initialFormData);
      setEditingItem(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save item",
        variant: "destructive"
      });
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    setIsImporting(true);
    setImportProgress(0);

    try {
      const result = await importGCGRFromFile(importFile);
      
      setImportProgress(100);
      
      toast({
        title: result.success ? "Import Successful" : "Import Failed",
        description: result.success 
          ? `Imported ${result.successfulImports} items`
          : `Failed to import items: ${result.errors[0]?.message || 'Unknown error'}`,
        variant: result.success ? "default" : "destructive"
      });

      if (result.success) {
        setShowImportDialog(false);
        setImportFile(null);
      }
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to process import file",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const handleExport = () => {
    const options: GCGRExportOptions = {
      format: 'csv',
      includeInactive: true,
      includeRemarks: true,
      selectedOnly: false,
      groupByCategory: true
    };
    
    exportGCGRToCSV(options);
    toast({
      title: "Export Successful",
      description: "GC/GR data exported to CSV"
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
    setSelectedCategory('all');
  };

  const isLaborCategory = (category: string) => {
    return category.startsWith('Field Labor');
  };

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{summary.totalItems}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Included Items</p>
                <p className="text-2xl font-bold">{summary.includedItems}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold">${summary.totalCost.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Project Duration</p>
                <p className="text-lg font-bold">{summary.constructionDuration.months.toFixed(1)} mos</p>
                <p className="text-xs text-muted-foreground">+ {summary.closeOutDuration.months.toFixed(1)} mos closeout</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchTerm || selectedCategory !== 'all' || Object.keys(filters).length > 0) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateGCGRTemplate()}
              >
                <Download className="h-4 w-4 mr-2" />
                Template
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImportDialog(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <div className="border-b border-gray-200 px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 xl:grid-cols-9 h-auto p-1">
                <TabsTrigger value="all" className="text-xs py-2">
                  All ({summary.totalItems})
                </TabsTrigger>
                {categories.slice(0, 8).map(cat => {
                  const total = categoryTotals[cat.value];
                  return (
                    <TabsTrigger key={cat.value} value={cat.value} className="text-xs py-2">
                      {cat.label.split(' ').slice(-1)[0]} ({total?.count || 0})
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value={selectedCategory} className="mt-0">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || selectedCategory !== 'all' 
                        ? "No items match your current filters"
                        : "Get started by adding your first GC/GR item"
                      }
                    </p>
                    <Button onClick={handleAddItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-20">Contract Ref</TableHead>
                          <TableHead>Description</TableHead>
                          {isLaborCategory(selectedCategory) && <TableHead>Position</TableHead>}
                          <TableHead className="w-16">Qty</TableHead>
                          <TableHead className="w-16">U/M</TableHead>
                          <TableHead className="w-24">Unit Cost</TableHead>
                          <TableHead className="w-24">Total Cost</TableHead>
                          {isLaborCategory(selectedCategory) && <TableHead className="w-20">% Time</TableHead>}
                          <TableHead className="w-20">Included</TableHead>
                          <TableHead className="w-32">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="font-mono text-xs">
                              {item.contractRef || '—'}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.description}</div>
                                {item.remarks && (
                                  <div className="text-xs text-gray-500 truncate max-w-xs">
                                    {item.remarks}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            {isLaborCategory(selectedCategory) && (
                              <TableCell className="text-sm">
                                {item.position || '—'}
                              </TableCell>
                            )}
                            <TableCell className="text-center">{item.qty}</TableCell>
                            <TableCell className="text-center text-xs text-gray-600">
                              {item.unitOfMeasure}
                            </TableCell>
                            <TableCell className="text-right">
                              ${item.unitCost.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${item.totalCost.toLocaleString()}
                            </TableCell>
                            {isLaborCategory(selectedCategory) && (
                              <TableCell className="text-center">
                                {item.percentTime ? `${item.percentTime}%` : '—'}
                              </TableCell>
                            )}
                            <TableCell>
                              <Badge variant={item.isIncluded ? 'default' : 'secondary'}>
                                {item.isIncluded ? 'Yes' : 'No'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewItem(item)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditItem(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteItem(item)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setShowEditDialog(false);
          setFormData(initialFormData);
          setEditingItem(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit GC/GR Item' : 'Add GC/GR Item'}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the GC/GR item details' : 'Add a new general condition or requirement item'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contractRef">Contract Reference</Label>
                <Input
                  id="contractRef"
                  value={formData.contractRef}
                  onChange={(e) => setFormData({ ...formData, contractRef: e.target.value })}
                  placeholder="e.g., 01 10"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: GCGRItem['category']) => 
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter item description"
                required
              />
            </div>

            {isLaborCategory(formData.category) && (
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g., Project Manager"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="qty">Quantity</Label>
                <Input
                  id="qty"
                  type="number"
                  step="0.1"
                  value={formData.qty}
                  onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="unitOfMeasure">Unit of Measure</Label>
                <Select
                  value={formData.unitOfMeasure}
                  onValueChange={(value) => setFormData({ ...formData, unitOfMeasure: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOfMeasureOptions.map(unit => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="unitCost">Unit Cost</Label>
                <Input
                  id="unitCost"
                  type="number"
                  step="0.01"
                  value={formData.unitCost}
                  onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {isLaborCategory(formData.category) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="percentTime">Percent Time (%)</Label>
                  <Input
                    id="percentTime"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.percentTime}
                    onChange={(e) => setFormData({ ...formData, percentTime: e.target.value })}
                    placeholder="100"
                  />
                </div>

                <div>
                  <Label htmlFor="customLaborRate">Custom Labor Rate</Label>
                  <Input
                    id="customLaborRate"
                    type="number"
                    step="0.01"
                    value={formData.customLaborRate}
                    onChange={(e) => setFormData({ ...formData, customLaborRate: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="flsaOvertime">FLSA Overtime</Label>
                  <Input
                    id="flsaOvertime"
                    type="number"
                    step="0.01"
                    value={formData.flsaOvertime}
                    onChange={(e) => setFormData({ ...formData, flsaOvertime: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Additional notes or details"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isIncluded"
                checked={formData.isIncluded}
                onCheckedChange={(checked) => setFormData({ ...formData, isIncluded: checked })}
              />
              <Label htmlFor="isIncluded">Include in estimate</Label>
            </div>

            <Separator />

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span>Calculated Total Cost:</span>
                <span className="font-bold text-lg">
                  ${((parseFloat(formData.qty) || 0) * (parseFloat(formData.unitCost) || 0)).toLocaleString()}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setShowEditDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>GC/GR Item Details</DialogTitle>
          </DialogHeader>
          
          {viewingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Contract Reference</Label>
                  <p className="font-mono">{viewingItem.contractRef || '—'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Category</Label>
                  <p>{viewingItem.category}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Description</Label>
                <p className="font-medium">{viewingItem.description}</p>
              </div>

              {viewingItem.position && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Position</Label>
                  <p>{viewingItem.position}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Quantity</Label>
                  <p>{viewingItem.qty}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Unit of Measure</Label>
                  <p>{viewingItem.unitOfMeasure}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Unit Cost</Label>
                  <p>${viewingItem.unitCost.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Cost:</span>
                  <span className="text-xl font-bold text-blue-600">
                    ${viewingItem.totalCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {(viewingItem.percentTime || viewingItem.customLaborRate || viewingItem.flsaOvertime) && (
                <div className="grid grid-cols-3 gap-4">
                  {viewingItem.percentTime && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Percent Time</Label>
                      <p>{viewingItem.percentTime}%</p>
                    </div>
                  )}
                  {viewingItem.customLaborRate && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Custom Labor Rate</Label>
                      <p>${viewingItem.customLaborRate.toFixed(2)}</p>
                    </div>
                  )}
                  {viewingItem.flsaOvertime && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">FLSA Overtime</Label>
                      <p>${viewingItem.flsaOvertime.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              )}

              {viewingItem.remarks && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Remarks</Label>
                  <p className="text-sm">{viewingItem.remarks}</p>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Included in Estimate</Label>
                  <Badge variant={viewingItem.isIncluded ? 'default' : 'secondary'}>
                    {viewingItem.isIncluded ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                  <p className="text-sm">{new Date(viewingItem.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import GC/GR Items</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import GC/GR items. Download the template for the correct format.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="importFile">Select CSV File</Label>
              <Input
                id="importFile"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                ref={fileInputRef}
              />
            </div>

            {isImporting && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Importing...</span>
                </div>
                <Progress value={importProgress} />
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle className="h-4 w-4" />
              <span>Supported formats: CSV, Excel (.xlsx, .xls)</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowImportDialog(false)}
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
    </div>
  );
} 