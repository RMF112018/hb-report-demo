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
 * Enhanced Dashboard Layout
 * -------------------------
 * Modern dashboard layout with improved visual hierarchy, backgrounds, and spacing
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
  // Determine spacing based on layout density - consistent horizontal and vertical
  const getSpacingClass = () => {
    switch (layoutDensity) {
      case 'compact': return 'gap-3 sm:gap-3 lg:gap-4';
      case 'spacious': return 'gap-6 sm:gap-6 lg:gap-8';
      default: return 'gap-4 sm:gap-4 lg:gap-6';
    }
  };

  const isCompact = layoutDensity === 'compact';
  
  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Enhanced Background with depth and texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--chart-1),0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--chart-2),0.05),transparent_50%)]" />
      
      {/* Subtle grid pattern for texture */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="h-full w-full bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>
      
      {/* Edit mode overlay */}
      {isEditing && (
        <div className="absolute inset-0 bg-primary/5 backdrop-blur-[0.5px] pointer-events-none" />
      )}
      
      <div className="relative z-10">
        {/* KPI Row with enhanced styling */}
        <div data-tour="kpi-widgets" className="mb-6">
          <div className="px-3 sm:px-4 lg:px-6 xl:px-8 2xl:px-10 pt-4 sm:pt-6">
            <div className="mx-auto max-w-[1920px]">
              <KPIRow userRole={userRole} />
            </div>
          </div>
        </div>
        
        {/* Dashboard Content with better container */}
        <div className="px-3 sm:px-4 lg:px-6 xl:px-8 2xl:px-10 pb-8">
          <div className="mx-auto max-w-[1920px]">
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
      </div>

      {/* Enhanced Edit Mode Indicator */}
      {isEditing && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-xl border border-primary/20 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-foreground/80 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Edit Mode Active</span>
              <span className="sm:hidden">Editing</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Visual enhancement: Floating elements for depth */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl pointer-events-none opacity-60" />
    </div>
  );
}
