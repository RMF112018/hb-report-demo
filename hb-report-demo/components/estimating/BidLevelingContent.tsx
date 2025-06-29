"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  Search, 
  Plus, 
  Download, 
  Upload, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Star,
  DollarSign,
  Calendar,
  Users,
  Building,
  Award,
  Filter,
  X,
  BarChart3,
  Target,
  Clock,
  Shield
} from "lucide-react"
import type { 
  TradeBids, 
  Bid, 
  BidLevelingSummary, 
  BidLevelingFilters, 
  BidLevelingExportOptions,
  BidLevelingImportResult,
  BidComparison
} from "@/types/estimating-tracker"

interface BidLevelingContentProps {
  tradeBids: TradeBids[]
  bidComparisons: BidComparison[]
  bidLevelingNotes: string
  onAddTradeBids: (tradeBids: Omit<TradeBids, 'createdAt' | 'updatedAt'>) => void
  onUpdateTradeBids: (id: string, updates: Partial<TradeBids>) => void
  onDeleteTradeBids: (id: string) => void
  onAddBidToTrade: (tradeId: string, bid: Omit<Bid, 'id'>) => void
  onUpdateBid: (tradeId: string, bidId: string, updates: Partial<Bid>) => void
  onDeleteBid: (tradeId: string, bidId: string) => void
  onSelectBid: (tradeId: string, bidId: string) => void
  onGetSummary: () => BidLevelingSummary
  onCreateComparison: (comparison: Omit<BidComparison, 'totalScores' | 'recommendation'>) => void
  onImportFromFile: (file: File) => Promise<BidLevelingImportResult>
  onExportToCSV: (options: BidLevelingExportOptions) => void
  onGenerateTemplate: () => void
  onUpdateNotes: (notes: string) => void
}

export function BidLevelingContent({
  tradeBids,
  bidComparisons,
  bidLevelingNotes,
  onAddTradeBids,
  onUpdateTradeBids,
  onDeleteTradeBids,
  onAddBidToTrade,
  onUpdateBid,
  onDeleteBid,
  onSelectBid,
  onGetSummary,
  onCreateComparison,
  onImportFromFile,
  onExportToCSV,
  onGenerateTemplate,
  onUpdateNotes
}: BidLevelingContentProps) {
  const { toast } = useToast()
  const [filters, setFilters] = useState<BidLevelingFilters>({})
  const [selectedTrade, setSelectedTrade] = useState<TradeBids | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<BidLevelingImportResult | null>(null)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showAddTradeDialog, setShowAddTradeDialog] = useState(false)
  const [showBidDialog, setShowBidDialog] = useState<{ trade: TradeBids; bid?: Bid } | null>(null)

  // Get summary statistics
  const summary = useMemo(() => onGetSummary(), [tradeBids, onGetSummary])

  // Filter trade bids
  const filteredTradeBids = useMemo(() => {
    return tradeBids.filter(trade => {
      if (filters.search && !trade.tradeName.toLowerCase().includes(filters.search.toLowerCase()) &&
          !trade.csiDivision?.toLowerCase().includes(filters.search.toLowerCase()) &&
          !trade.bids.some(bid => bid.vendor.toLowerCase().includes(filters.search.toLowerCase()))) {
        return false
      }
      if (filters.riskLevel && trade.riskLevel !== filters.riskLevel) return false
      if (filters.biddingStatus && trade.biddingStatus !== filters.biddingStatus) return false
      if (filters.amountMin && trade.averageBid && trade.averageBid < filters.amountMin) return false
      if (filters.amountMax && trade.averageBid && trade.averageBid > filters.amountMax) return false
      return true
    })
  }, [tradeBids, filters])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const result = await onImportFromFile(file)
      setImportResult(result)
      
      if (result.success) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${result.successfulImports} trade bids.`,
        })
      } else {
        toast({
          title: "Import Failed",
          description: "There were errors importing the file. Please check the format.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to import file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
      setShowImportDialog(false)
    }
  }

  const handleExport = (options: BidLevelingExportOptions) => {
    onExportToCSV(options)
    setShowExportDialog(false)
    toast({
      title: "Export Successful",
      description: "Bid leveling data has been exported successfully.",
    })
  }

  const handleSelectBid = (tradeId: string, bidId: string) => {
    onSelectBid(tradeId, bidId)
    toast({
      title: "Bid Selected",
      description: "Selected bid has been updated for this trade.",
    })
  }

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'high': return <Shield className="h-4 w-4 text-red-500" />
      default: return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'received': 'secondary',
      'reviewed': 'outline',
      'selected': 'default',
      'rejected': 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    )
  }

  const getBiddingStatusBadge = (status: string) => {
    const variants = {
      'pending': 'secondary',
      'open': 'outline',
      'closed': 'default',
      'awarded': 'default'
    } as const

    const colors = {
      'pending': 'bg-gray-100 text-gray-800',
      'open': 'bg-blue-100 text-blue-800',
      'closed': 'bg-yellow-100 text-yellow-800',
      'awarded': 'bg-green-100 text-green-800'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} 
             className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{summary.totalTrades}</p>
              </div>
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bids</p>
                <p className="text-2xl font-bold">{summary.totalBids}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Selected Bids</p>
                <p className="text-2xl font-bold">{summary.selectedBids}</p>
              </div>
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Selected Value</p>
                <p className="text-2xl font-bold">${(summary.selectedValue / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trades, vendors, or CSI divisions..."
              value={filters.search || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-8"
            />
          </div>
          
          <Select value={filters.riskLevel || 'all'} onValueChange={(value) => 
            setFilters(prev => ({ ...prev, riskLevel: value === 'all' ? undefined : value }))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.biddingStatus || 'all'} onValueChange={(value) => 
            setFilters(prev => ({ ...prev, biddingStatus: value === 'all' ? undefined : value }))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="awarded">Awarded</SelectItem>
            </SelectContent>
          </Select>

          {Object.keys(filters).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({})}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Bid Leveling Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    disabled={isImporting}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload CSV or Excel file with bid leveling data
                  </p>
                </div>
                <Button onClick={onGenerateTemplate} variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Bid Leveling Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Button 
                  onClick={() => handleExport({
                    format: 'csv',
                    includeNotes: true,
                    includeAIRecommendations: true,
                    selectedOnly: false,
                    groupByTrade: true
                  })} 
                  className="w-full"
                >
                  Export All Data
                </Button>
                <Button 
                  onClick={() => handleExport({
                    format: 'csv',
                    includeNotes: false,
                    includeAIRecommendations: false,
                    selectedOnly: true,
                    groupByTrade: true
                  })} 
                  variant="outline" 
                  className="w-full"
                >
                  Export Selected Bids Only
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={() => setShowAddTradeDialog(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Trade
          </Button>
        </div>
      </div>

      {/* Trade Bids Grid */}
      <div className="grid gap-6">
        {filteredTradeBids.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Trade Bids</h3>
              <p className="text-muted-foreground text-center mb-4">
                {tradeBids.length === 0 
                  ? "Get started by adding trade bids or importing from a file."
                  : "No trade bids match your current filters."
                }
              </p>
              {tradeBids.length === 0 && (
                <div className="flex gap-2">
                  <Button onClick={() => setShowAddTradeDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Trade
                  </Button>
                  <Button variant="outline" onClick={() => setShowImportDialog(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTradeBids.map((trade) => (
            <Card key={trade.tradeId} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg">{trade.tradeName}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{trade.csiDivision}</Badge>
                        {getRiskLevelIcon(trade.riskLevel)}
                        <span className="text-sm text-muted-foreground capitalize">{trade.riskLevel} risk</span>
                        {getBiddingStatusBadge(trade.biddingStatus)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Variance</p>
                    <p className="text-lg font-semibold">{trade.variance.toFixed(1)}%</p>
                  </div>
                </div>
                {trade.scopeDescription && (
                  <p className="text-sm text-muted-foreground mt-2">{trade.scopeDescription}</p>
                )}
                {trade.aiRecommendation && (
                  <Alert className="mt-3">
                    <Target className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>AI Recommendation:</strong> {trade.aiRecommendation}
                    </AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <CardContent>
                {trade.bids.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-2">No bids received yet</p>
                    <Button size="sm" onClick={() => setShowBidDialog({ trade })}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Bid
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trade.bids.map((bid) => (
                      <div key={bid.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{bid.vendor}</h4>
                            {getStatusBadge(bid.status)}
                            {bid.status === 'selected' && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                              ${bid.amount.toLocaleString()}
                            </span>
                            <span>Confidence: {bid.confidence}%</span>
                            {bid.schedule?.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {bid.schedule.duration} days
                              </span>
                            )}
                          </div>
                          {bid.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{bid.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowBidDialog({ trade, bid })}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {bid.status !== 'selected' && (
                            <Button
                              size="sm"
                              onClick={() => handleSelectBid(trade.tradeId, bid.id)}
                            >
                              Select
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="text-sm text-muted-foreground">
                        {trade.bids.length} bid{trade.bids.length !== 1 ? 's' : ''} received
                        {trade.selectedBid && ' • 1 selected'}
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setShowBidDialog({ trade })}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Bid
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Leveling Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leveling Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add notes about the bid leveling process, decisions made, and rationale..."
            value={bidLevelingNotes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  )
} 