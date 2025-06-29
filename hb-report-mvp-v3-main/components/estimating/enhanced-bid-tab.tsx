"use client"

import React from "react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, Calculator, AlertTriangle, FileText, DollarSign, Building, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
/**
 * @fileoverview Enhanced Bid Tab Component for Construction Trade Bidding
 *
 * This component provides a comprehensive interface for managing construction trade
 * bids in a tabulated format. It supports multiple CSI divisions, real-time
 * calculations, validation, and category-based organization.
 *
 * Key Features:
 * - Multi-trade tabbed interface with CSI division support
 * - Real-time bid calculations and validation
 * - Category-based item grouping within trades
 * - Comprehensive error handling and user feedback
 * - Performance-optimized for large datasets (50+ items)
 * - Guided tour integration with data attributes
 *
 * @author HB Report Development Team
 * @version 2.0.0
 * @since 2024-12-16
 */

// ============================================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================================

/**
 * Request for Proposal (RFP) interface
 *
 * @interface RFP
 * @description Represents a construction project RFP with associated trades
 */
export interface RFP {
  /** Unique identifier for the RFP */
  id: string
  /** Project title/name */
  title: string
  /** RFP submission due date */
  dueDate: Date
  /** Array of trade codes/names included in this RFP */
  trades: string[]
  /** Optional project description */
  description?: string
  /** Optional client/owner information */
  client?: string
  /** Optional project location */
  location?: string
  /** Optional estimated project value */
  estimatedValue?: number
}

/**
 * Base bid item interface
 *
 * @interface BidItem
 * @description Core structure for a bid line item
 */
export interface BidItem {
  /** Unique identifier for the bid item */
  id: string
  /** Trade/CSI division this item belongs to */
  trade: string
  /** Item description */
  description: string
  /** Quantity of items */
  quantity: number
  /** Unit of measurement */
  unit: string
  /** Price per unit */
  unitPrice: number
  /** Total price (calculated: quantity * unitPrice) */
  totalPrice: number
}

/**
 * Enhanced bid line item interface
 *
 * @interface BidLineItem
 * @extends {BidItem}
 * @description Extended bid item with additional metadata and state
 */
export interface BidLineItem extends BidItem {
  /** Whether this item is selected for bulk operations */
  isSelected?: boolean
  /** Whether this item has validation errors */
  hasError?: boolean
  /** Error message if validation fails */
  errorMessage?: string
  /** Mathematical formula for calculation (future enhancement) */
  formula?: string
  /** CSI category for grouping (e.g., "Site Preparation", "Concrete Work") */
  category: string
  /** Additional notes or specifications */
  notes?: string
  /** Priority level for sorting (1 = highest) */
  priority?: number
  /** Whether item is locked from editing */
  isLocked?: boolean
  /** Last modified timestamp */
  lastModified?: Date
}

/**
 * Category summary interface for grouping and totals
 *
 * @interface CategorySummary
 */
interface CategorySummary {
  /** Category name */
  name: string
  /** Number of items in category */
  itemCount: number
  /** Total value of all items in category */
  totalValue: number
  /** Whether category is expanded in UI */
  isExpanded: boolean
}

/**
 * Trade summary interface for tab badges and totals
 *
 * @interface TradeSummary
 */
interface TradeSummary {
  /** Trade code/name */
  trade: string
  /** Total number of line items */
  itemCount: number
  /** Subtotal for this trade */
  subtotal: number
  /** Number of categories in this trade */
  categoryCount: number
  /** Whether trade has validation errors */
  hasErrors: boolean
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/**
 * Available units of measurement for construction items
 *
 * @constant {readonly string[]}
 */
const AVAILABLE_UNITS = [
  "EA", // Each
  "SF", // Square Feet
  "LF", // Linear Feet
  "CY", // Cubic Yards
  "SY", // Square Yards
  "TON", // Tons
  "LB", // Pounds
  "GAL", // Gallons
  "HR", // Hours
  "LS", // Lump Sum
] as const

/**
 * CSI Division categories for organizing bid items
 *
 * @constant {Record<string, string[]>}
 */
const CSI_CATEGORIES: Record<string, string[]> = {
  "02 21 Survey": ["Site Survey", "Boundary Survey", "Topographic Survey"],
  "03 30 CIP Concrete": ["Footings", "Foundations", "Slabs", "Walls", "Columns"],
  "04 40 Stone Veneer": ["Natural Stone", "Manufactured Stone", "Installation"],
  "05 10 Structural Steel": ["Beams", "Columns", "Connections", "Fabrication"],
  "05 52 Railings": ["Handrails", "Guardrails", "Balusters"],
  "06 10 Rough Carpentry": ["Framing", "Sheathing", "Blocking"],
  "07 50 Roofing": ["Membrane", "Shingles", "Flashing", "Insulation"],
  "08 10 DFH": ["Doors", "Frames", "Hardware"],
  "09 90 Painting": ["Interior Paint", "Exterior Paint", "Primer", "Specialty Coatings"],
  "21 13 Fire Protection": ["Sprinkler System", "Fire Pumps", "Standpipes"],
  "22 00 Plumbing": ["Fixtures", "Piping", "Water Systems", "Waste Systems"],
  "23 00 HVAC": ["Equipment", "Ductwork", "Controls", "Ventilation"],
  "26 00 Electrical": ["Panels", "Conduit", "Wiring", "Fixtures", "Controls"],
  "31 30 Site Work": ["Excavation", "Grading", "Utilities", "Paving"],
}

/**
 * Default validation rules for bid items
 *
 * @constant {object}
 */
const VALIDATION_RULES = {
  quantity: {
    min: 0,
    max: 999999,
    required: true,
  },
  unitPrice: {
    min: 0,
    max: 999999,
    required: true,
  },
  description: {
    minLength: 3,
    maxLength: 200,
    required: true,
  },
} as const

// ============================================================================
// MOCK DATA FOR TESTING
// ============================================================================

/**
 * Generate mock bid items for testing purposes
 *
 * @function createMockBidItems
 * @param {string} trade - Trade code to generate items for
 * @returns {BidLineItem[]} Array of mock bid items
 */
const createMockBidItems = (trade: string): BidLineItem[] => {
  const categories = CSI_CATEGORIES[trade] || ["General Work"]
  const mockItems: BidLineItem[] = []

  categories.forEach((category, categoryIndex) => {
    // Generate 2-3 items per category
    const itemCount = Math.floor(Math.random() * 2) + 2

    for (let i = 0; i < itemCount; i++) {
      const itemId = `${trade.replace(/\s+/g, "-").toLowerCase()}-${categoryIndex}-${i}`

      mockItems.push({
        id: itemId,
        trade,
        description: `${category} Item ${i + 1}`,
        category,
        quantity: Math.floor(Math.random() * 100) + 10,
        unit: AVAILABLE_UNITS[Math.floor(Math.random() * AVAILABLE_UNITS.length)],
        unitPrice: Math.round((Math.random() * 100 + 10) * 100) / 100,
        totalPrice: 0, // Will be calculated
        notes: i === 0 ? `Sample note for ${category}` : "",
        isSelected: false,
        hasError: false,
        priority: categoryIndex + 1,
        lastModified: new Date(),
      })
    }
  })

  // Calculate total prices
  return mockItems.map((item) => ({
    ...item,
    totalPrice: item.quantity * item.unitPrice,
  }))
}

/**
 * Mock RFP data for testing
 *
 * @constant {RFP}
 */
const MOCK_RFP: RFP = {
  id: "rfp-2024-001",
  title: "Luxury Resort Development - Phase 1",
  dueDate: new Date("2024-12-30"),
  description: "Construction of luxury resort facilities including main building, amenities, and site work",
  client: "Resort Development Group",
  location: "Miami Beach, FL",
  estimatedValue: 15000000,
  trades: [
    "02 21 Survey",
    "03 30 CIP Concrete",
    "05 10 Structural Steel",
    "06 10 Rough Carpentry",
    "07 50 Roofing",
    "09 90 Painting",
    "22 00 Plumbing",
    "26 00 Electrical",
    "31 30 Site Work",
  ],
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format currency values for display
 *
 * @function formatCurrency
 * @param {number} value - Numeric value to format
 * @returns {string} Formatted currency string
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Validate bid item field values
 *
 * @function validateBidItem
 * @param {Partial<BidLineItem>} item - Item to validate
 * @param {keyof BidLineItem} field - Specific field to validate
 * @returns {{isValid: boolean, errorMessage?: string}} Validation result
 */
const validateBidItem = (
  item: Partial<BidLineItem>,
  field: keyof BidLineItem,
): { isValid: boolean; errorMessage?: string } => {
  switch (field) {
    case "quantity":
      const quantity = Number(item.quantity)
      if (isNaN(quantity) || quantity < VALIDATION_RULES.quantity.min) {
        return { isValid: false, errorMessage: "Quantity must be a positive number" }
      }
      if (quantity > VALIDATION_RULES.quantity.max) {
        return { isValid: false, errorMessage: "Quantity exceeds maximum allowed value" }
      }
      break

    case "unitPrice":
      const unitPrice = Number(item.unitPrice)
      if (isNaN(unitPrice) || unitPrice < VALIDATION_RULES.unitPrice.min) {
        return { isValid: false, errorMessage: "Unit price must be a positive number" }
      }
      if (unitPrice > VALIDATION_RULES.unitPrice.max) {
        return { isValid: false, errorMessage: "Unit price exceeds maximum allowed value" }
      }
      break

    case "description":
      const description = String(item.description || "").trim()
      if (description.length < VALIDATION_RULES.description.minLength) {
        return { isValid: false, errorMessage: "Description is too short" }
      }
      if (description.length > VALIDATION_RULES.description.maxLength) {
        return { isValid: false, errorMessage: "Description is too long" }
      }
      break

    default:
      break
  }

  return { isValid: true }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Enhanced Bid Tab Component Props
 *
 * @interface EnhancedBidTabProps
 */
interface EnhancedBidTabProps {
  /** Selected RFP to create bids for (null shows placeholder) */
  selectedRFP?: RFP | null
  /** Callback when bid data is saved */
  onSave?: (bidData: Record<string, BidLineItem[]>) => void
  /** Callback when bid item is updated */
  onItemUpdate?: (trade: string, itemId: string, updates: Partial<BidLineItem>) => void
  /** Whether component is in read-only mode */
  readOnly?: boolean
  /** Custom CSS class name */
  className?: string
}

/**
 * Enhanced Bid Tab Component
 *
 * A comprehensive bidding interface for construction trades that provides:
 * - Multi-trade tabbed organization with CSI division support
 * - Real-time calculation and validation
 * - Category-based grouping within trades
 * - Performance optimization for large datasets
 * - Guided tour integration
 *
 * @component EnhancedBidTab
 * @param {EnhancedBidTabProps} props - Component props
 * @returns {JSX.Element} Rendered bid tab interface
 *
 * @example
 * \`\`\`tsx
 * <EnhancedBidTab
 *   selectedRFP={currentRFP}
 *   onSave={(bidData) => console.log('Saved:', bidData)}
 *   onItemUpdate={(trade, id, updates) => console.log('Updated:', trade, id, updates)}
 * />
 * \`\`\`
 */
export const EnhancedBidTab: React.FC<EnhancedBidTabProps> = ({
  selectedRFP = MOCK_RFP, // Use mock data if no RFP provided
  onSave,
  onItemUpdate,
  readOnly = false,
  className,
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * Currently active trade tab
   * @state {string}
   */
  const [activeTradeTab, setActiveTradeTab] = useState<string>("")

  /**
   * Bid items organized by trade
   * @state {Record<string, BidLineItem[]>}
   */
  const [bidItems, setBidItems] = useState<Record<string, BidLineItem[]>>({})

  /**
   * Selected items for bulk operations
   * @state {string[]}
   */
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  /**
   * Expanded categories for UI state
   * @state {Record<string, boolean>}
   */
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize bid items when RFP changes
   */
  useEffect(() => {
    if (selectedRFP && selectedRFP.trades.length > 0) {
      // Set first trade as active
      setActiveTradeTab(selectedRFP.trades[0])

      // Initialize bid items for each trade
      const initialBidItems: Record<string, BidLineItem[]> = {}
      selectedRFP.trades.forEach((trade) => {
        initialBidItems[trade] = createMockBidItems(trade)
      })

      setBidItems(initialBidItems)

      // Expand all categories by default
      const initialExpanded: Record<string, boolean> = {}
      Object.values(initialBidItems)
        .flat()
        .forEach((item) => {
          const key = `${item.trade}-${item.category}`
          initialExpanded[key] = true
        })
      setExpandedCategories(initialExpanded)
    }
  }, [selectedRFP])

  // ============================================================================
  // MEMOIZED CALCULATIONS
  // ============================================================================

  /**
   * Calculate trade summaries for tab badges and totals
   *
   * @computed {Record<string, TradeSummary>}
   */
  const tradeSummaries = useMemo((): Record<string, TradeSummary> => {
    const summaries: Record<string, TradeSummary> = {}

    Object.entries(bidItems).forEach(([trade, items]) => {
      const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
      const categories = new Set(items.map((item) => item.category))
      const hasErrors = items.some((item) => item.hasError)

      summaries[trade] = {
        trade,
        itemCount: items.length,
        subtotal,
        categoryCount: categories.size,
        hasErrors,
      }
    })

    return summaries
  }, [bidItems])

  /**
   * Calculate grand total across all trades
   *
   * @computed {number}
   */
  const grandTotal = useMemo((): number => {
    return Object.values(tradeSummaries).reduce((sum, summary) => sum + summary.subtotal, 0)
  }, [tradeSummaries])

  /**
   * Group items by category for current trade
   *
   * @computed {Record<string, BidLineItem[]>}
   */
  const itemsByCategory = useMemo((): Record<string, BidLineItem[]> => {
    if (!activeTradeTab || !bidItems[activeTradeTab]) {
      return {}
    }

    const items = bidItems[activeTradeTab]
    const grouped: Record<string, BidLineItem[]> = {}

    items.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })

    // Sort items within each category by priority, then by description
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => {
        if (a.priority !== b.priority) {
          return (a.priority || 999) - (b.priority || 999)
        }
        return a.description.localeCompare(b.description)
      })
    })

    return grouped
  }, [activeTradeTab, bidItems])

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Update a specific field of a bid line item
   *
   * @function updateLineItem
   * @param {string} trade - Trade code
   * @param {string} itemId - Item identifier
   * @param {keyof BidLineItem} field - Field to update
   * @param {any} value - New value
   */
  const updateLineItem = useCallback(
    (trade: string, itemId: string, field: keyof BidLineItem, value: any): void => {
      setBidItems((prevItems) => {
        const updatedItems = { ...prevItems }

        if (!updatedItems[trade]) {
          return prevItems
        }

        updatedItems[trade] = updatedItems[trade].map((item) => {
          if (item.id !== itemId) {
            return item
          }

          const updatedItem = { ...item, [field]: value }

          // Recalculate total price if quantity or unit price changed
          if (field === "quantity" || field === "unitPrice") {
            const quantity = Number(updatedItem.quantity) || 0
            const unitPrice = Number(updatedItem.unitPrice) || 0
            updatedItem.totalPrice = quantity * unitPrice
          }

          // Validate the updated field
          const validation = validateBidItem(updatedItem, field)
          updatedItem.hasError = !validation.isValid
          updatedItem.errorMessage = validation.errorMessage || ""

          // Update last modified timestamp
          updatedItem.lastModified = new Date()

          // Call external update handler if provided
          if (onItemUpdate) {
            onItemUpdate(trade, itemId, { [field]: value })
          }

          return updatedItem
        })

        return updatedItems
      })
    },
    [onItemUpdate],
  )

  /**
   * Add a new line item to the current trade
   *
   * @function addLineItem
   */
  const addLineItem = useCallback((): void => {
    if (!activeTradeTab) return

    const categories = CSI_CATEGORIES[activeTradeTab] || ["General Work"]
    const defaultCategory = categories[0]

    const newItem: BidLineItem = {
      id: `${activeTradeTab}-${Date.now()}`,
      trade: activeTradeTab,
      description: "",
      category: defaultCategory,
      quantity: 0,
      unit: "EA",
      unitPrice: 0,
      totalPrice: 0,
      notes: "",
      isSelected: false,
      hasError: false,
      priority: 999,
      lastModified: new Date(),
    }

    setBidItems((prevItems) => ({
      ...prevItems,
      [activeTradeTab]: [...(prevItems[activeTradeTab] || []), newItem],
    }))
  }, [activeTradeTab])

  /**
   * Remove selected line items
   *
   * @function removeSelectedItems
   */
  const removeSelectedItems = useCallback((): void => {
    if (!activeTradeTab || selectedItems.length === 0) return

    setBidItems((prevItems) => ({
      ...prevItems,
      [activeTradeTab]: prevItems[activeTradeTab]?.filter((item) => !selectedItems.includes(item.id)) || [],
    }))

    setSelectedItems([])
  }, [activeTradeTab, selectedItems])

  /**
   * Toggle item selection for bulk operations
   *
   * @function toggleItemSelection
   * @param {string} itemId - Item to toggle
   */
  const toggleItemSelection = useCallback((itemId: string): void => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }, [])

  /**
   * Toggle category expansion
   *
   * @function toggleCategoryExpansion
   * @param {string} categoryKey - Category to toggle
   */
  const toggleCategoryExpansion = useCallback((categoryKey: string): void => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }))
  }, [])

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * Render category header row
   *
   * @function renderCategoryHeader
   * @param {string} category - Category name
   * @param {BidLineItem[]} items - Items in category
   * @returns {JSX.Element} Category header row
   */
  const renderCategoryHeader = (category: string, items: BidLineItem[]): JSX.Element => {
    const categoryKey = `${activeTradeTab}-${category}`
    const isExpanded = expandedCategories[categoryKey]
    const categoryTotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)

    return (
      <TableRow
        key={`category-${categoryKey}`}
        className="bg-gray-50 hover:bg-gray-100 cursor-pointer border-b-2"
        onClick={() => toggleCategoryExpansion(categoryKey)}
        data-tour={`category-${category.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <TableCell colSpan={8} className="font-semibold text-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn("transition-transform", isExpanded ? "rotate-90" : "")}>▶</span>
              <span>{category}</span>
              <Badge variant="secondary" className="text-xs">
                {items.length} items
              </Badge>
            </div>
            <div className="text-sm font-medium">{formatCurrency(categoryTotal)}</div>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  /**
   * Render bid item row
   *
   * @function renderBidItemRow
   * @param {BidLineItem} item - Item to render
   * @returns {JSX.Element} Bid item row
   */
  const renderBidItemRow = (item: BidLineItem): JSX.Element => {
    const isSelected = selectedItems.includes(item.id)

    return (
      <TableRow
        key={item.id}
        className={cn(
          "hover:bg-gray-50 transition-colors",
          item.hasError && "bg-red-50 border-red-200",
          isSelected && "bg-blue-50 border-blue-200",
        )}
        data-tour={`bid-item-${item.id}`}
      >
        {/* Selection Checkbox */}
        <TableCell className="w-12">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleItemSelection(item.id)}
            disabled={readOnly}
            aria-label={`Select ${item.description}`}
          />
        </TableCell>

        {/* Description */}
        <TableCell className="min-w-[200px]">
          <Input
            value={item.description}
            onChange={(e) => updateLineItem(activeTradeTab, item.id, "description", e.target.value)}
            placeholder="Enter item description"
            disabled={readOnly}
            className={cn(
              "border-0 bg-transparent p-1 focus:bg-white focus:border-input",
              item.hasError && item.errorMessage?.includes("Description") && "border-red-500",
            )}
            aria-label="Item description"
          />
          {item.hasError && item.errorMessage?.includes("Description") && (
            <p className="text-xs text-red-600 mt-1">{item.errorMessage}</p>
          )}
        </TableCell>

        {/* Category */}
        <TableCell className="min-w-[150px]">
          <Select
            value={item.category}
            onValueChange={(value) => updateLineItem(activeTradeTab, item.id, "category", value)}
            disabled={readOnly}
          >
            <SelectTrigger className="border-0 bg-transparent focus:bg-white focus:border-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(CSI_CATEGORIES[activeTradeTab] || ["General Work"]).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>

        {/* Quantity */}
        <TableCell className="w-24">
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => updateLineItem(activeTradeTab, item.id, "quantity", Number(e.target.value))}
            placeholder="0"
            disabled={readOnly}
            min="0"
            step="0.01"
            className={cn(
              "border-0 bg-transparent p-1 text-right focus:bg-white focus:border-input",
              item.hasError && item.errorMessage?.includes("Quantity") && "border-red-500",
            )}
            aria-label="Quantity"
          />
          {item.hasError && item.errorMessage?.includes("Quantity") && (
            <p className="text-xs text-red-600 mt-1">{item.errorMessage}</p>
          )}
        </TableCell>

        {/* Unit */}
        <TableCell className="w-20">
          <Select
            value={item.unit}
            onValueChange={(value) => updateLineItem(activeTradeTab, item.id, "unit", value)}
            disabled={readOnly}
          >
            <SelectTrigger className="border-0 bg-transparent focus:bg-white focus:border-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_UNITS.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>

        {/* Unit Price */}
        <TableCell className="w-32">
          <Input
            type="number"
            value={item.unitPrice}
            onChange={(e) => updateLineItem(activeTradeTab, item.id, "unitPrice", Number(e.target.value))}
            placeholder="0.00"
            disabled={readOnly}
            min="0"
            step="0.01"
            className={cn(
              "border-0 bg-transparent p-1 text-right focus:bg-white focus:border-input",
              item.hasError && item.errorMessage?.includes("Unit price") && "border-red-500",
            )}
            aria-label="Unit price"
          />
          {item.hasError && item.errorMessage?.includes("Unit price") && (
            <p className="text-xs text-red-600 mt-1">{item.errorMessage}</p>
          )}
        </TableCell>

        {/* Total Price */}
        <TableCell className="w-32 text-right font-medium">
          <div className="flex items-center justify-end gap-1">
            <DollarSign className="h-3 w-3 text-gray-400" />
            {formatCurrency(item.totalPrice || 0)}
          </div>
        </TableCell>

        {/* Notes */}
        <TableCell className="min-w-[150px]">
          <Textarea
            value={item.notes || ""}
            onChange={(e) => updateLineItem(activeTradeTab, item.id, "notes", e.target.value)}
            placeholder="Add notes..."
            disabled={readOnly}
            className="border-0 bg-transparent p-1 min-h-[32px] resize-none focus:bg-white focus:border-input"
            rows={1}
            aria-label="Item notes"
          />
        </TableCell>
      </TableRow>
    )
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  // Show placeholder if no RFP selected
  if (!selectedRFP) {
    return (
      <div
        className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
        data-tour="no-rfp-placeholder"
      >
        <div className="text-center space-y-3">
          <FileText className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900">No RFP Selected</h3>
          <p className="text-gray-500 max-w-sm">
            Select an RFP from the project list to begin creating bid tabs and managing trade estimates.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)} data-tour="enhanced-bid-tab">
      {/* Header Section */}
      <Card data-tour="bid-tab-header">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Building className="h-6 w-6 text-blue-600" />
                {selectedRFP.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due: {selectedRFP.dueDate.toLocaleDateString()}
                </div>
                {selectedRFP.client && <div>Client: {selectedRFP.client}</div>}
                {selectedRFP.location && <div>Location: {selectedRFP.location}</div>}
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-sm text-gray-600">Grand Total</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(grandTotal)}</div>
              <div className="text-xs text-gray-500">
                {Object.values(tradeSummaries).reduce((sum, s) => sum + s.itemCount, 0)} items
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Action Bar */}
      {!readOnly && (
        <div className="flex items-center justify-between" data-tour="bid-tab-actions">
          <div className="flex items-center gap-2">
            <Button onClick={addLineItem} disabled={!activeTradeTab} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Line Item
            </Button>
            {selectedItems.length > 0 && (
              <Button onClick={removeSelectedItems} variant="destructive" size="sm" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Remove Selected ({selectedItems.length})
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => onSave?.(bidItems)} variant="outline" size="sm" className="gap-2">
              <Calculator className="h-4 w-4" />
              Save Bid
            </Button>
          </div>
        </div>
      )}

      {/* Trade Tabs */}
      <Card data-tour="trade-tabs">
        <CardContent className="p-0">
          <Tabs value={activeTradeTab} onValueChange={setActiveTradeTab}>
            {/* Tab List */}
            <div className="border-b border-gray-200 px-6 pt-6">
              <TabsList
                className="grid w-full h-auto p-1"
                style={{ gridTemplateColumns: `repeat(${selectedRFP.trades.length}, 1fr)` }}
              >
                {selectedRFP.trades.map((trade) => {
                  const summary = tradeSummaries[trade]
                  return (
                    <TabsTrigger
                      key={trade}
                      value={trade}
                      className="flex flex-col items-center gap-1 py-3 px-2 text-xs"
                      data-tour={`trade-tab-${trade.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <span className="font-medium truncate max-w-full">{trade}</span>
                      <div className="flex items-center gap-1">
                        <Badge variant={summary?.hasErrors ? "destructive" : "secondary"} className="text-xs px-1 py-0">
                          {formatCurrency(summary?.subtotal || 0)}
                        </Badge>
                        {summary?.hasErrors && <AlertTriangle className="h-3 w-3 text-red-500" />}
                      </div>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            {/* Tab Content */}
            {selectedRFP.trades.map((trade) => (
              <TabsContent key={trade} value={trade} className="p-6 mt-0">
                <div className="space-y-4">
                  {/* Trade Summary */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{trade} - Line Items</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{tradeSummaries[trade]?.itemCount || 0} items</span>
                      <span>{tradeSummaries[trade]?.categoryCount || 0} categories</span>
                      <span className="font-medium">
                        Subtotal: {formatCurrency(tradeSummaries[trade]?.subtotal || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Validation Alerts */}
                  {tradeSummaries[trade]?.hasErrors && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        This trade has validation errors. Please review and correct the highlighted items.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Items Table */}
                  <div
                    className="border rounded-lg overflow-hidden"
                    data-tour={`${trade.toLowerCase().replace(/\s+/g, "-")}-table`}
                  >
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-12">
                            <Checkbox
                              checked={
                                selectedItems.length > 0 &&
                                bidItems[trade]?.every((item) => selectedItems.includes(item.id))
                              }
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedItems(bidItems[trade]?.map((item) => item.id) || [])
                                } else {
                                  setSelectedItems([])
                                }
                              }}
                              disabled={readOnly}
                              aria-label="Select all items"
                            />
                          </TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(itemsByCategory).map(([category, items]) => {
                          const categoryKey = `${trade}-${category}`
                          const isExpanded = expandedCategories[categoryKey]

                          return (
                            <React.Fragment key={category}>
                              {renderCategoryHeader(category, items)}
                              {isExpanded && items.map((item) => renderBidItemRow(item))}
                            </React.Fragment>
                          )
                        })}

                        {/* Empty State */}
                        {Object.keys(itemsByCategory).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                              No items in this trade. Click "Add Line Item" to get started.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Trade Total */}
                  <div className="flex justify-end">
                    <div className="bg-gray-50 rounded-lg p-4 min-w-[200px]">
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span>{trade} Total:</span>
                        <span className="text-green-600">{formatCurrency(tradeSummaries[trade]?.subtotal || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default EnhancedBidTab
