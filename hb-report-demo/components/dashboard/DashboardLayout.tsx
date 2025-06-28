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
      case 'compact': return 'gap-3';
      case 'spacious': return 'gap-8';
      default: return 'gap-6';
    }
  };

  const isCompact = layoutDensity === 'compact';
  
  return (
    <div className={`w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/20 ${
      isEditing ? 'bg-primary/5' : ''
    }`}>
      {/* KPI Row */}
      <KPIRow userRole={userRole} />
      
      {/* Dashboard Content - Full Width */}
      <div className="w-full">
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

      {/* Edit Mode Indicator */}
      {isEditing && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-foreground/70 rounded-full animate-pulse"></div>
              Edit Mode Active
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
