"use client";

import { DashboardCard } from "@/types/dashboard";
import { DashboardGrid } from "./DashboardGrid";
import { KPIRow } from "./KPIRow";

interface DashboardLayoutProps {
  cards: DashboardCard[];
  onLayoutChange?: (layout: any[]) => void;
  onCardRemove?: (cardId: string) => void;
  onCardConfigure?: (cardId: string, configUpdate?: Partial<DashboardCard>) => void;
  onCardAdd?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  isEditing?: boolean;
  onToggleEdit?: () => void;
  layoutDensity?: 'compact' | 'normal' | 'spacious';
  userRole?: string;
}

/**
 * Simplified Dashboard Layout
 * ---------------------------
 * Pure dashboard grid container without header controls
 * Header functionality has been moved to the main dashboard page
 */

export function DashboardLayout({ 
  cards,
  onLayoutChange,
  onCardRemove,
  onCardConfigure,
  onCardAdd,
  onSave,
  onReset,
  isEditing = false,
  onToggleEdit,
  layoutDensity = 'normal',
  userRole,
}: DashboardLayoutProps) {
  // Determine spacing based on layout density
  const getSpacingClass = () => {
    switch (layoutDensity) {
      case 'compact': return 'gap-2 sm:gap-2.5 lg:gap-3';
      case 'spacious': return 'gap-4 sm:gap-6 lg:gap-8';
      default: return 'gap-2.5 sm:gap-3 lg:gap-4';
    }
  };

  const isCompact = layoutDensity === 'compact';
  
  return (
    <div className={`w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/20 ${
      isEditing ? 'bg-primary/5' : ''
    }`}>
      {/* KPI Row */}
      <div data-tour="kpi-widgets">
        <KPIRow userRole={userRole} />
      </div>
      
      {/* Dashboard Content - Responsive Container */}
      <div className="w-full px-2 sm:px-3 lg:px-4 xl:px-6 2xl:px-8 pt-2 sm:pt-3 lg:pt-4">
        <div className="mx-auto max-w-[1920px]"> {/* Max width for ultra-wide screens */}
          <DashboardGrid 
          cards={cards}
          onLayoutChange={onLayoutChange}
          onCardRemove={onCardRemove}
          onCardConfigure={onCardConfigure}
          onCardAdd={onCardAdd}
          onSave={onSave}
          onReset={onReset}
          isEditing={isEditing}
          isCompact={isCompact}
          spacingClass={getSpacingClass()}
          userRole={userRole}
        />
        </div>
      </div>

      {/* Edit Mode Indicator */}
      {isEditing && (
        <div className="fixed bottom-3 right-3 z-40">
          <div className="bg-primary text-primary-foreground px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-foreground/70 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Edit Mode Active</span>
              <span className="sm:hidden">Edit</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
