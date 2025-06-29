"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { usePathname } from "next/navigation"
import Joyride, { type CallBackProps, STATUS, EVENTS } from "react-joyride"
import type { Step } from "react-joyride"
import {
  Info,
  Navigation,
  Calculator,
  Building,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Ruler,
  FileText,
  PlusCircle,
  HelpCircle,
  Upload,
  BarChart3,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEstimating } from "@/components/estimating/estimating-context"

/**
 * @fileoverview Enhanced Guided Tour System with Bid Management Integration
 *
 * This file provides a comprehensive guided tour system for the Pre-Construction
 * application with enhanced support for the new bid management workflow including
 * bid tabulation, bid leveling, and cost summary features.
 *
 * @version 3.0.0
 * @author HB Report Development Team
 * @since 2024-12-16
 */

// ============================================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================================

/**
 * Enhanced Joyride step interface with additional metadata
 */
interface JoyrideStep extends Step {
  /** Unique identifier for the step */
  id: string
  /** Step title for display */
  title: string
  /** JSX content for the step */
  content: React.ReactNode
  /** CSS selector for target element */
  target: string
  /** Tooltip placement */
  placement?: "top" | "bottom" | "left" | "right" | "center" | "auto"
  /** Whether to disable the beacon */
  disableBeacon?: boolean
  /** Routes where this step should be shown */
  routes?: string[]
  /** Step category for organization */
  category?: "navigation" | "workflow" | "bid-management" | "general"
  /** Priority for step ordering (1 = highest) */
  priority?: number
  /** Whether step requires specific conditions */
  conditional?: boolean
  /** Function to check if step should be shown */
  shouldShow?: () => boolean
  /** Custom styling for the step */
  styles?: {
    tooltip?: React.CSSProperties
    beacon?: React.CSSProperties
  }
}

/**
 * Tour context state interface
 */
interface TourContextType {
  /** Whether tour is currently active */
  isTourActive: boolean
  /** Current step index */
  currentStep: number
  /** Whether user has seen the tour before */
  hasSeenTour: boolean
  /** All available tour steps */
  steps: JoyrideStep[]
  /** Filtered steps for current route */
  filteredSteps: JoyrideStep[]
  /** Tour version for migration handling */
  tourVersion: string
  /** Whether tour is paused */
  isPaused: boolean
  /** Debug mode for development */
  debugMode: boolean

  // Actions
  /** Start the tour */
  startTour: () => void
  /** Stop the tour */
  stopTour: () => void
  /** Pause/resume the tour */
  togglePause: () => void
  /** Skip to next step */
  nextStep: () => void
  /** Go to previous step */
  previousStep: () => void
  /** Skip the entire tour */
  skipTour: () => void
  /** Reset tour progress */
  resetTour: () => void
  /** Update steps dynamically */
  updateSteps: (newSteps: JoyrideStep[]) => void
  /** Mark tour as seen */
  markTourAsSeen: () => void
}

/**
 * Tour provider props interface
 */
interface TourProviderProps {
  /** Child components */
  children: React.ReactNode
  /** Whether to auto-start tour for new users */
  autoStart?: boolean
  /** Custom tour steps */
  customSteps?: JoyrideStep[]
  /** Debug mode */
  debug?: boolean
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/**
 * Tour configuration constants
 */
const TOUR_CONFIG = {
  /** Current tour version for migration */
  VERSION: "3.0.0",
  /** LocalStorage key for tour state */
  STORAGE_KEY: "hb-report-tour-state",
  /** Debounce delay for route changes */
  ROUTE_DEBOUNCE_MS: 300,
  /** Default step duration */
  DEFAULT_STEP_DURATION: 5000,
  /** Maximum steps per tour session */
  MAX_STEPS_PER_SESSION: 20,
} as const

/**
 * Enhanced tour steps with comprehensive bid management coverage
 */
const ENHANCED_TOUR_STEPS: JoyrideStep[] = [
  // Welcome & Overview
  {
    id: "welcome",
    title: "Welcome to HB Report Pre-Construction",
    target: "body",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Building className="h-8 w-8 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold">Welcome to the Pre-Construction App!</h3>
            <p className="text-gray-600">Your complete solution for construction estimating and bid management</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm">This tour will guide you through:</p>
          <ul className="text-sm space-y-1 ml-4">
            <li>• Project setup and quantity takeoffs</li>
            <li>• Document management and RFI tracking</li>
            <li>
              • <strong>Enhanced bid tabulation with CSI divisions</strong>
            </li>
            <li>
              • <strong>Vendor bid leveling and comparison</strong>
            </li>
            <li>
              • <strong>Cost summary and approval workflow</strong>
            </li>
          </ul>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <Info className="h-4 w-4 inline mr-1" />
            You can navigate freely during the tour - it will adapt to your current page!
          </p>
        </div>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
    category: "general",
    priority: 1,
  },

  // Navigation & Sidebar
  {
    id: "sidebar-navigation",
    title: "Navigation Menu",
    target: ".sidebar-menu, [data-tour='sidebar-menu']",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Main Navigation
        </h4>
        <p>Use the sidebar to navigate between different sections:</p>
        <ul className="space-y-1 text-sm">
          <li>
            • <strong>Dashboard</strong> - Project overview and metrics
          </li>
          <li>
            • <strong>Estimating</strong> - Complete bid workflow
          </li>
          <li>
            • <strong>Financial Forecasting</strong> - Budget planning
          </li>
          <li>
            • <strong>Reports</strong> - Generate project reports
          </li>
        </ul>
        <div className="bg-green-50 p-2 rounded">
          <p className="text-sm text-green-800">
            💡 <strong>Tip:</strong> Click any menu item to jump to that section - the tour will follow you!
          </p>
        </div>
      </div>
    ),
    placement: "right",
    category: "navigation",
    priority: 2,
  },

  // Estimating Workflow Overview
  {
    id: "estimating-workflow",
    title: "Enhanced Estimating Workflow",
    target: "[data-tour='estimating-workflow'], .estimating-workflow",
    content: (
      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          7-Step Estimating Process
        </h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>Quantity Takeoff</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>Clarifications & Assumptions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>RFIs & Document Log</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-bold">
              4
            </span>
            <span>
              <strong>Bid Tabulation (NEW)</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-bold">
              5
            </span>
            <span>
              <strong>Bid Leveling (NEW)</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-bold">
              6
            </span>
            <span>
              <strong>Cost Summary (NEW)</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs font-bold">
              7
            </span>
            <span>Final Approval & Handoff</span>
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-800">
            ✨ <strong>New Features:</strong> Enhanced bid management with CSI division organization and automated
            leveling!
          </p>
        </div>
      </div>
    ),
    placement: "right",
    routes: ["/pre-con/estimating"],
    category: "workflow",
    priority: 3,
  },
  // Tab Overview
  {
    id: "tab-overview",
    title: "Estimating Workflow Tabs",
    target: "[data-tour='estimating-tabs'] .MuiTabs-root, [data-tour='estimating-tabs'] .flex-wrap", // Target the Tabs component
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold">🔄 Random Access Navigation</h4>
        <p className="text-sm">
          Instead of a linear stepper, you can now jump directly to any section of the estimating workflow using these
          tabs.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Click any tab to navigate instantly.</li>
          <li>• All your data is preserved as you switch.</li>
        </ul>
        <div className="bg-blue-50 p-2 rounded">
          <p className="text-xs text-blue-800">💡 This allows for more flexible and efficient workflow management.</p>
        </div>
      </div>
    ),
    placement: "bottom",
    routes: ["/pre-con/estimating"],
    category: "workflow",
    priority: 3.5, // Place it after workflow overview
  },
  // Full-Screen Toggle
  {
    id: "full-screen-toggle",
    title: "Full-Screen View",
    target: ".full-screen-toggle",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold">🖥️ Maximize Your Workspace</h4>
        <p className="text-sm">
          Click this button to toggle full-screen mode for the estimating interface. This provides a distraction-free
          environment for detailed work.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Ideal for detailed quantity takeoffs or bid leveling.</li>
          <li>• Press `Esc` or click again to exit.</li>
        </ul>
      </div>
    ),
    placement: "left",
    routes: ["/pre-con/estimating"],
    category: "general",
    priority: 3.6, // Place it after tab overview
  },
  // Quantity Takeoff Table
  {
    id: "quantity-takeoff-table",
    title: "Area Calculations Table",
    target: "[data-tour='quantity-takeoff-table']",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <Ruler className="h-5 w-5" /> Input Detailed Areas
        </h4>
        <p className="text-sm">
          Use this table to enter and manage individual area calculations for different buildings, levels, and area
          types.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Add new rows with specific building, level, and area details.</li>
          <li>• Search and filter existing entries for quick access.</li>
          <li>• Delete entries that are no longer needed.</li>
        </ul>
      </div>
    ),
    placement: "top",
    routes: ["/pre-con/estimating"],
    category: "workflow",
    priority: 3.7, // After full-screen, before bid management
  },
  // Quantity Takeoff Summary
  {
    id: "quantity-takeoff-summary",
    title: "Project Metrics Summary",
    target: "[data-tour='quantity-takeoff-summary']",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <Info className="h-5 w-5" /> Overall Project Dimensions
        </h4>
        <p className="text-sm">
          These fields provide a high-level overview of the project's total square footage, site area, and parking
          capacity.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Update these metrics to reflect the overall project scope.</li>
          <li>• Changes here will be reflected in other parts of the estimate.</li>
        </ul>
      </div>
    ),
    placement: "bottom",
    routes: ["/pre-con/estimating"],
    category: "workflow",
    priority: 3.8, // After quantity-takeoff-table
  },
  // Clarifications Table
  {
    id: "clarifications-table",
    title: "Manage Clarifications & Assumptions",
    target: "[data-tour='clarifications-table']",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" /> Document Project Details
        </h4>
        <p className="text-sm">
          This table allows you to meticulously record all clarifications, assumptions, and exclusions related to your
          project estimate.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Add new entries with CSI divisions, descriptions, and notes.</li>
          <li>• Edit existing clarifications to update details.</li>
          <li>• Search and filter entries for efficient management.</li>
        </ul>
      </div>
    ),
    placement: "top",
    routes: ["/pre-con/estimating"],
    category: "workflow",
    priority: 3.9, // After quantity-takeoff-summary
  },
  // Add Clarification Button
  {
    id: "add-clarification-btn",
    title: "Add New Clarification",
    target: "[data-tour='add-clarification-btn']",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Quick Entry
        </h4>
        <p className="text-sm">
          Click this button to open a dialog and quickly add a new clarification or assumption to your project.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Fill in the details in the pop-up form.</li>
          <li>• Ensure CSI Division is in the correct format (e.g., `01 00 00`).</li>
        </ul>
      </div>
    ),
    placement: "left",
    routes: ["/pre-con/estimating"],
    category: "workflow",
    priority: 3.95, // After clarifications-table
  },
  // RFI Table
  {
    id: "rfi-table",
    title: "Track Requests for Information (RFIs)",
    target: "[data-tour='rfi-table']",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <HelpCircle className="h-5 w-5" /> Manage Project Queries
        </h4>
        <p className="text-sm">
          This table provides a centralized log for all Requests for Information (RFIs), helping you track questions and
          responses.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Record RFI numbers, questions, statuses, and responses.</li>
          <li>• Ensure RFI numbers are unique for clear tracking.</li>
          <li>• Filter and export RFI data as needed.</li>
        </ul>
      </div>
    ),
    placement: "top",
    routes: ["/pre-con/estimating"],
    category: "workflow",
    priority: 3.96, // After add-clarification-btn
  },
  // Add RFI Button
  {
    id: "add-rfi-btn",
    title: "Add New RFI",
    target: "[data-tour='add-rfi-btn']",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Submit a New Query
        </h4>
        <p className="text-sm">
          Click this button to open a dialog and submit a new Request for Information to project stakeholders.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Fill in the RFI details, including question and assigned party.</li>
          <li>• The system will validate for unique RFI numbers.</li>
        </ul>
      </div>
    ),
    placement: "left",
    routes: ["/pre-con/estimating"],
    category: "workflow",
    priority: 3.97, // After rfi-table
  },
  // Document Log Table
  {
    id: "document-log-table",
    title: "Manage Project Documents",
    target: "[data-tour='document-log-table']",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" /> Centralized Document Repository
        </h4>
        <p className="text-sm">
          This table provides a comprehensive log of all project documents, including drawings, specifications, and
          other critical files.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Track sheet numbers, descriptions, issue/receive dates, and categories.</li>
          <li>• Search and filter documents for easy access.</li>
          <li>• Add, edit, or delete document entries.</li>
        </ul>
      </div>
    ),
    placement: "top",
    routes: ["/pre-con/estimating"],
    category: "workflow",
    priority: 3.98, // After add-rfi-btn
  },
  // Import Documents Button
  {
    id: "import-csv-btn",
    title: "Import Documents from CSV",
    target: "[data-tour='import-csv-btn']",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <Upload className="h-5 w-5" /> Bulk Upload
        </h4>
        <p className="text-sm">
          Use this button to import multiple document entries at once from a CSV file. This is ideal for populating the
          log quickly.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Ensure your CSV file matches the expected format.</li>
          <li>• The system will validate data during import.</li>
        </ul>
      </div>
    ),
    placement: "left",
    routes: ["/pre-con/estimating"],
    category: "workflow",
    priority: 3.99, // After document-log-table
  },
  // GC & GR Tab
  {
    id: "gc-and-gr-tab",
    title: "Manage General Conditions & General Requirements",
    target: "[data-tour='gc-and-gr-tab']",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <Building className="h-5 w-5" /> Track Project Overhead Items
        </h4>
        <p className="text-sm">
          This section allows you to manage general conditions and general requirements that are essential for project
          planning and cost estimation.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Add items like site security, temporary utilities, and project management</li>
          <li>• Track estimated costs and include/exclude items from estimates</li>
          <li>• Organize by General Conditions (GC) vs General Requirements (GR)</li>
        </ul>
      </div>
    ),
    placement: "top",
    routes: ["/pre-con/estimating"],
    category: "workflow",
    priority: 3.9925, // After import-csv-btn
  },
  // Add GC & GR Button
  {
    id: "add-gc-and-gr-btn",
    title: "Add New GC & GR Item",
    target: "[data-tour='add-gc-and-gr-btn']",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Quick Entry
        </h4>
        <p className="text-sm">
          Click this button to open a dialog and add a new general condition or general requirement item to your
          project.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Fill in item details including number, description, and estimated cost</li>
          <li>• Choose between General Conditions or General Requirements category</li>
          <li>• Toggle inclusion in the project estimate</li>
        </ul>
      </div>
    ),
    placement: "left",
    routes: ["/pre-con/estimating"],
    category: "workflow",
    priority: 3.993, // After gc-and-gr-tab
  },
  // Allowances Table
  {
    id: "allowances-table",
    title: "Manage Project Allowances",
    target: "[data-tour='allowances-table']",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" /> Track Allowance Items
        </h4>
        <p className="text-sm">
          This table allows you to manage project allowances organized by CSI divisions. Allowances help account for
          potential cost variations and contingencies.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Add allowances for different CSI divisions and project components</li>
          <li>• Track estimated values and include detailed descriptions</li>
          <li>• Search and filter allowances for quick access</li>
          <li>• Monitor total allowances value in real-time</li>
        </ul>
      </div>
    ),
    placement: "top",
    routes: ["/pre-con/estimating"],
    category: "workflow",
    priority: 3.994, // After add-gc-and-gr-btn
  },
  // Add Allowance Button
  {
    id: "add-allowance-btn",
    title: "Add New Allowance",
    target: "[data-tour='add-allowance-btn']",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Quick Entry
        </h4>
        <p className="text-sm">
          Click this button to open a dialog and add a new allowance item to your project estimate.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Fill in CSI Division, description, and estimated value</li>
          <li>• CSI Division format: XXXXXX or XX XX XX (e.g., 033000)</li>
          <li>• Values must be non-negative numbers</li>
          <li>• Add optional notes for additional context</li>
        </ul>
      </div>
    ),
    placement: "left",
    routes: ["/pre-con/estimating"],
    category: "workflow",
    priority: 3.9945, // After allowances-table
  },
  // Bid Tabulation Tab
  {
    id: "bid-tabulation-tab",
    title: "Bid Tabulation Tab",
    target: "[data-tour='bid-tabulation-tab']",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" /> Manage Bid Tabs and Items
        </h4>
        <p className="text-sm">
          This section allows you to create and manage detailed bid tabs for each trade, organizing line items by CSI
          divisions.
        </p>
        <ul className="text-sm space-y-1 ml-4">
          <li>• Input quantities, unit prices, and descriptions for each bid item.</li>
          <li>• Group items by CSI categories for better organization.</li>
          <li>• Real-time calculations help you track totals.</li>
        </ul>
      </div>
    ),
    placement: "top", // Assuming the tab is at the top
    routes: ["/pre-con/estimating"],
    category: "bid-management",
    priority: 3.995, // Placed just before the detailed bid-tabulation content tour step
  },
  // Bid Tabulation (Existing, now for content)
  {
    id: "bid-tabulation",
    title: "Bid Tabulation with CSI Divisions",
    target: "[data-tour='enhanced-bid-tab'], .bid-tabulation", // Target the EnhancedBidTab component itself
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold">📊 Enhanced Bid Tabulation</h4>
        <p className="text-sm">Organize and compare vendor bids by CSI divisions:</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>
            • <strong>CSI Division Organization</strong> - Automatic categorization
          </li>
          <li>
            • <strong>Multi-Vendor Comparison</strong> - Side-by-side analysis
          </li>
          <li>
            • <strong>Scope Gap Detection</strong> - Identify missing items
          </li>
          <li>
            • <strong>Real-time Calculations</strong> - Instant totals and variances
          </li>
        </ul>
        <div className="bg-blue-50 p-2 rounded">
          <p className="text-xs text-blue-800">💡 Click on any CSI division to expand and see detailed line items</p>
        </div>
      </div>
    ),
    placement: "top",
    routes: ["/pre-con/estimating"],
    category: "bid-management",
    priority: 4, // Keep its original priority relative to other content steps
  },

  // Bid Leveling
  {
    id: "bid-leveling",
    title: "Intelligent Bid Leveling",
    target: "[data-tour='bid-leveling'], .bid-leveling",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold">⚖️ Automated Bid Leveling</h4>
        <p className="text-sm">Ensure fair comparison across all vendors:</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>
            • <strong>Scope Normalization</strong> - Adjust for different inclusions
          </li>
          <li>
            • <strong>Add/Deduct Items</strong> - Level the playing field
          </li>
          <li>
            • <strong>Risk Adjustments</strong> - Factor in vendor reliability
          </li>
          <li>
            • <strong>Final Recommendations</strong> - AI-powered suggestions
          </li>
        </ul>
        <div className="bg-yellow-50 p-2 rounded">
          <p className="text-xs text-yellow-800">⚠️ Review all adjustments before finalizing recommendations</p>
        </div>
      </div>
    ),
    placement: "top",
    routes: ["/pre-con/estimating"],
    category: "bid-management",
    priority: 5,
  },

  // Cost Summary
  {
    id: "cost-summary",
    title: "Cost Summary & Approval",
    target: "[data-tour='cost-summary'], .cost-summary",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold">📋 Final Cost Summary</h4>
        <p className="text-sm">Review and approve the final estimate:</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>
            • <strong>Executive Summary</strong> - High-level cost breakdown
          </li>
          <li>
            • <strong>Vendor Selections</strong> - Recommended awards by trade
          </li>
          <li>
            • <strong>Risk Analysis</strong> - Identified concerns and mitigations
          </li>
          <li>
            • <strong>Approval Workflow</strong> - Multi-level sign-off process
          </li>
        </ul>
        <div className="bg-green-50 p-2 rounded">
          <p className="text-xs text-green-800">✅ Once approved, the estimate moves to project execution phase</p>
        </div>
      </div>
    ),
    placement: "top",
    routes: ["/pre-con/estimating"],
    category: "bid-management",
    priority: 6,
  },

  // Dashboard Overview
  {
    id: "dashboard-overview",
    title: "Project Dashboard",
    target: "[data-tour='dashboard'], .dashboard-main",
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold">📊 Project Dashboard</h4>
        <p className="text-sm">Monitor all your projects from one central location:</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>
            • <strong>Project Health Metrics</strong> - Real-time status indicators
          </li>
          <li>
            • <strong>Financial Performance</strong> - Budget vs. actual tracking
          </li>
          <li>
            • <strong>Schedule Monitoring</strong> - Critical path analysis
          </li>
          <li>
            • <strong>Risk Alerts</strong> - Proactive issue identification
          </li>
        </ul>
      </div>
    ),
    placement: "bottom",
    routes: ["/dashboard"],
    category: "navigation",
    priority: 7,
  },
]

// ============================================================================
// CONTEXT IMPLEMENTATION
// ============================================================================

const TourContext = createContext<TourContextType | undefined>(undefined)

/**
 * Custom hook to use tour context
 */
export const useTour = (): TourContextType => {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider")
  }
  return context
}

/**
 * Tour Provider Component
 */
export const TourProvider: React.FC<TourProviderProps> = ({
  children,
  autoStart = false,
  customSteps = [],
  debug = false,
}) => {
  const pathname = usePathname()
  const { currentTab, setCurrentTab } = useEstimating()

  // State management
  const [isTourActive, setIsTourActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasSeenTour, setHasSeenTour] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [tourVersion, setTourVersion] = useState(TOUR_CONFIG.VERSION)

  // Combine default and custom steps
  const allSteps = useMemo(() => {
    return [...ENHANCED_TOUR_STEPS, ...customSteps].sort((a, b) => (a.priority || 999) - (b.priority || 999))
  }, [customSteps])

  // Filter steps based on current route
  const filteredSteps = useMemo(() => {
    return allSteps.filter((step) => {
      if (!step.routes || step.routes.length === 0) return true
      return step.routes.some((route) => pathname.startsWith(route))
    })
  }, [allSteps, pathname])

  // Load tour state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(TOUR_CONFIG.STORAGE_KEY)
      if (savedState) {
        const parsed = JSON.parse(savedState)
        setHasSeenTour(parsed.hasSeenTour || false)
        setTourVersion(parsed.tourVersion || TOUR_CONFIG.VERSION)

        // Auto-start for new users if enabled
        if (autoStart && !parsed.hasSeenTour) {
          setIsTourActive(true)
        }
      }
    } catch (error) {
      console.warn("Failed to load tour state:", error)
    }
  }, [autoStart])

  // Save tour state to localStorage
  const saveTourState = useCallback(() => {
    try {
      const state = {
        hasSeenTour,
        tourVersion,
        lastUpdated: Date.now(),
      }
      localStorage.setItem(TOUR_CONFIG.STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.warn("Failed to save tour state:", error)
    }
  }, [hasSeenTour, tourVersion])

  // Save state when it changes
  useEffect(() => {
    saveTourState()
  }, [saveTourState])

  // Tour control functions
  const startTour = useCallback(() => {
    setIsTourActive(true)
    setCurrentStep(0)
    setIsPaused(false)
  }, [])

  const stopTour = useCallback(() => {
    setIsTourActive(false)
    setCurrentStep(0)
    setIsPaused(false)
  }, [])

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, filteredSteps.length - 1))
  }, [filteredSteps.length])

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const skipTour = useCallback(() => {
    setIsTourActive(false)
    setHasSeenTour(true)
  }, [])

  const resetTour = useCallback(() => {
    setCurrentStep(0)
    setHasSeenTour(false)
    setIsPaused(false)
    localStorage.removeItem(TOUR_CONFIG.STORAGE_KEY)
  }, [])

  const updateSteps = useCallback((newSteps: JoyrideStep[]) => {
    // This would be implemented to dynamically update steps
    console.log("Update steps:", newSteps)
  }, [])

  const markTourAsSeen = useCallback(() => {
    setHasSeenTour(true)
  }, [])

  // Context value
  const contextValue: TourContextType = {
    isTourActive,
    currentStep,
    hasSeenTour,
    steps: allSteps,
    filteredSteps,
    tourVersion,
    isPaused,
    debugMode: debug,
    startTour,
    stopTour,
    togglePause,
    nextStep,
    previousStep,
    skipTour,
    resetTour,
    updateSteps,
    markTourAsSeen,
  }

  return <TourContext.Provider value={contextValue}>{children}</TourContext.Provider>
}

// ============================================================================
// MAIN TOUR COMPONENT
// ============================================================================

/**
 * Main Guided Tour Component
 */
export const GuidedTour: React.FC = () => {
  const { isTourActive, currentStep, filteredSteps, stopTour, markTourAsSeen, debugMode } = useTour()

  // Handle tour callback events
  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status, type, action } = data

      if (debugMode) {
        console.log("Joyride callback:", { status, type, action })
      }

      if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
        // Handle step completion or target not found
      }

      if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
        stopTour()
        markTourAsSeen()
      }

      if (status === STATUS.ERROR) {
        console.error("Tour error:", data)
        stopTour()
      }
    },
    [stopTour, markTourAsSeen, debugMode],
  )

  if (!isTourActive || filteredSteps.length === 0) {
    return null
  }

  return (
    <Joyride
      steps={filteredSteps}
      stepIndex={currentStep}
      run={isTourActive}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          primaryColor: "#3b82f6",
          textColor: "#374151",
          backgroundColor: "#ffffff",
          overlayColor: "rgba(0, 0, 0, 0.4)",
          arrowColor: "#ffffff",
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: 8,
          fontSize: 14,
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "#3b82f6",
          fontSize: 14,
          padding: "8px 16px",
        },
        buttonBack: {
          color: "#6b7280",
          fontSize: 14,
          padding: "8px 16px",
        },
        buttonSkip: {
          color: "#6b7280",
          fontSize: 14,
        },
      }}
      locale={{
        back: "Previous",
        close: "Close",
        last: "Finish Tour",
        next: "Next",
        skip: "Skip Tour",
      }}
    />
  )
}

// ============================================================================
// TOUR CONTROL COMPONENTS
// ============================================================================

/**
 * Start Tour Button Component
 */
export const StartTourButton: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { startTour, isTourActive } = useTour()

  return (
    <Button onClick={startTour} disabled={isTourActive} variant="outline" size="sm" className={className}>
      <Play className="h-4 w-4 mr-2" />
      {isTourActive ? "Tour Active" : "Start Tour"}
    </Button>
  )
}

/**
 * Tour Control Panel Component
 */
export const TourControlPanel: React.FC = () => {
  const {
    isTourActive,
    isPaused,
    currentStep,
    filteredSteps,
    togglePause,
    nextStep,
    previousStep,
    stopTour,
    resetTour,
  } = useTour()

  if (!isTourActive) {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            Step {currentStep + 1} of {filteredSteps.length}
          </span>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={togglePause}>
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost" onClick={previousStep} disabled={currentStep === 0}>
              ←
            </Button>
            <Button size="sm" variant="ghost" onClick={nextStep} disabled={currentStep === filteredSteps.length - 1}>
              →
            </Button>
            <Button size="sm" variant="ghost" onClick={stopTour}>
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={resetTour}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export default GuidedTour
export type { JoyrideStep, TourContextType, TourProviderProps }
