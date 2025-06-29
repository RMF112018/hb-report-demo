"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DashboardCard } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { GripVertical, X, Settings2, Briefcase, Brain, BarChart3, Target, TrendingUp, Building2, Calendar, DollarSign, Wrench, Shield, Droplets, Package, Eye, AlertTriangle as AlertTriangleIcon, Users, FileText, ClipboardCheck, Play, CalendarDays, MessageSquare, Heart, PieChart, Activity, Coins, Zap, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DashboardCardWrapper } from "./DashboardCardWrapper";

// Modern card components
import PortfolioOverview from "@/components/cards/PortfolioOverview";
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights";
import { FinancialReviewPanel } from "@/components/cards/FinancialReviewPanel";
import PipelineAnalytics from "@/components/cards/PipelineAnalytics";
import MarketIntelligence from "@/components/cards/MarketIntelligence";
import ProjectOverviewCard from "@/components/cards/ProjectOverviewCard";
import SchedulePerformanceCard from "@/components/cards/SchedulePerformanceCard";
import FinancialStatusCard from "@/components/cards/FinancialStatusCard";
import GeneralConditionsCard from "@/components/cards/GeneralConditionsCard";
import ContingencyAnalysisCard from "@/components/cards/ContingencyAnalysisCard";
import CashFlowCard from "@/components/cards/CashFlowCard";
import ProcurementCard from "@/components/cards/ProcurementCard";
import DrawForecastCard from "@/components/cards/DrawForecastCard";
import QualityControlCard from "@/components/cards/QualityControlCard";
import SafetyCard from "@/components/cards/SafetyCard";
import StaffingDistributionCard from "@/components/cards/StaffingDistributionCard";
import ChangeOrderAnalysisCard from "@/components/cards/ChangeOrderAnalysisCard";
import CloseoutCard from "@/components/cards/CloseoutCard";
import StartupCard from "@/components/cards/StartupCard";
import CriticalDatesCard from "@/components/cards/CriticalDatesCard";
import FieldReportsCard from "@/components/cards/FieldReportsCard";
import { RFICard } from "@/components/cards/RFICard";
import { SubmittalCard } from "@/components/cards/SubmittalCard";
import { HealthCard } from "@/components/cards/HealthCard";
import { ScheduleMonitorCard } from "@/components/cards/ScheduleMonitorCard";
import { BDOpportunitiesCard } from "@/components/cards/BDOpportunitiesCard";

/**
 * DashboardGrid
 * -------------
 * Renders dashboard cards in a modern, responsive grid layout with full editing capabilities.
 * - Responsive width using a container ref.
 * - Increased row height and card padding for a premium feel.
 * - Modern card styles: glassmorphism, soft shadow, prominent header, minHeight.
 * - Full editing features: move, resize, add, remove, configure cards.
 */

interface DashboardGridProps {
  cards: DashboardCard[];
  onLayoutChange?: (layout: any[]) => void;
  onCardRemove?: (cardId: string) => void;
  onCardConfigure?: (cardId: string, configUpdate?: Partial<DashboardCard>) => void;
  onCardAdd?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  isEditing?: boolean;
  isCompact?: boolean;
  spacingClass?: string;
  userRole?: string;
}

// Define content-aware heights for different card types
const getCardHeight = (card: DashboardCard, isCompact: boolean): number | "auto" => {
  const baseHeight = isCompact ? 300 : 350;
  
  switch (card.type) {
    case "portfolio-overview":
      return isCompact ? 420 : 480; // Increased height to show all content
    case "enhanced-hbi-insights":
      return "auto"; // Auto height to fit content
    case "financial-review-panel":
      return isCompact ? 400 : 460; // Increased height for metrics + charts
    case "pipeline-analytics":
      return "auto"; // Auto height to fit content
    case "market-intelligence":
      return "auto"; // Auto height to fit content
    case "project-overview":
      return "auto"; // Auto height to fit all content
    case "schedule-performance":
      return "auto"; // Auto height to fit all content
    case "financial-status":
      return "auto"; // Auto height to fit all content
    case "general-conditions":
      return "auto"; // Auto height to fit all content
    case "contingency-analysis":
      return "auto"; // Auto height to fit all content
    case "cash-flow":
      return "auto"; // Auto height to fit all content
    case "procurement":
      return "auto"; // Auto height to fit all content
    case "draw-forecast":
      return "auto"; // Auto height to fit all content
    case "quality-control":
      return "auto"; // Auto height to fit all content
    case "safety":
      return "auto"; // Auto height to fit all content
    case "staffing-distribution":
      return "auto"; // Auto height to fit all content
    case "change-order-analysis":
      return "auto"; // Auto height to fit all content
    case "closeout":
      return "auto"; // Auto height to fit all content
    case "startup":
      return "auto"; // Auto height to fit all content
    case "critical-dates":
      return "auto"; // Auto height to fit all content
    case "field-reports":
      return "auto"; // Auto height to fit all content
    case "rfi":
      return "auto"; // Auto height to fit all content
    case "submittal":
      return "auto"; // Auto height to fit all content
    case "health":
      return "auto"; // Auto height to fit all content
    case "schedule-monitor":
      return "auto"; // Auto height to fit all content
    case "bd-opportunities":
      return "auto"; // Auto height to fit all content

    default:
      return baseHeight;
  }
};

// Define card widths - some cards span multiple columns
const getCardColSpan = (card: DashboardCard): string => {
  switch (card.type) {
    case "enhanced-hbi-insights":
    case "market-intelligence":
      return "sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2"; // These cards are 2x width on larger screens
    default:
      return "col-span-1"; // Standard single column width
  }
};

export function DashboardGrid({
  cards,
  onLayoutChange,
  onCardRemove,
  onCardConfigure,
  isEditing = false,
  isCompact = false,
  spacingClass = "gap-6",
  userRole,
}: DashboardGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState(cards);
  const [focusedCard, setFocusedCard] = useState<DashboardCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    setItems(cards);
  }, [cards]);

  const handleDragStart = useCallback((event: any) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      
      if (onLayoutChange) {
        const layout = newItems.map((item, index) => ({
          i: item.id,
          x: 0,
          y: index,
          w: 12,
          h: 6,
        }));
        onLayoutChange(layout);
      }
    }
  }, [items, onLayoutChange]);

  const activeCard = activeId ? items.find((item) => item.id === activeId) : null;

  const handleCardFocus = useCallback((card: DashboardCard) => {
    setFocusedCard(card);
  }, []);

  const handleCardUnfocus = useCallback(() => {
    setFocusedCard(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
        {/* Enhanced Responsive Grid Layout with consistent spacing */}
        <div className={cn(
          // Enhanced background with subtle pattern
          "relative",
          // Improved grid structure with consistent row sizing
          "grid auto-rows-max",
          // Better responsive breakpoints - original structure
          "grid-cols-1",                    // Mobile: 1 column
          "sm:grid-cols-2",                 // Small tablet: 2 columns  
          "lg:grid-cols-3",                 // Large tablet/small desktop: 3 columns
          "xl:grid-cols-4",                 // Desktop: 4 columns
          "2xl:grid-cols-5",                // Large desktop: 5 columns
          // Consistent spacing - same horizontal and vertical
          spacingClass
        )}>
          {items.map((card) => (
            <div key={card.id} className={cn("w-full", getCardColSpan(card))}>
              <SortableCard
                card={card}
                isEditing={isEditing}
                isCompact={isCompact}
                onCardRemove={onCardRemove}
                onCardConfigure={onCardConfigure}
                onCardFocus={handleCardFocus}
                height={getCardHeight(card, isCompact)}
                userRole={userRole}
              />
            </div>
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeCard ? (
          <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-2xl opacity-90 transform rotate-2 scale-105 border-2 border-primary/20 w-80">
            <div className="p-4 sm:p-5">
              <h3 className="font-semibold text-lg text-foreground">{activeCard.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">Moving card...</p>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Focused Card Modal */}
      <Dialog open={!!focusedCard} onOpenChange={() => handleCardUnfocus()}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-fit h-fit p-0 overflow-hidden">
          {focusedCard && (
            <>
              <DialogHeader className="px-6 py-4 border-b border-border">
                <DialogTitle className="flex items-center justify-between">
                                     <div className="flex items-center gap-3">
                     {/* Card Icon - All Types */}
                     {focusedCard.type === "portfolio-overview" && <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                     {focusedCard.type === "enhanced-hbi-insights" && <Brain className="h-5 w-5 text-purple-600" />}
                     {focusedCard.type === "financial-review-panel" && <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                     {focusedCard.type === "pipeline-analytics" && <Target className="h-5 w-5 text-orange-600" />}
                     {focusedCard.type === "market-intelligence" && <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />}
                     {focusedCard.type === "project-overview" && <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                     {focusedCard.type === "schedule-performance" && <Calendar className="h-5 w-5 text-orange-600" />}
                     {focusedCard.type === "financial-status" && <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />}
                     {focusedCard.type === "general-conditions" && <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                     {focusedCard.type === "contingency-analysis" && <Shield className="h-5 w-5 text-purple-600" />}
                     {focusedCard.type === "cash-flow" && <Droplets className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />}
                     {focusedCard.type === "procurement" && <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                     {focusedCard.type === "draw-forecast" && <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
                     {focusedCard.type === "quality-control" && <Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                     {focusedCard.type === "safety" && <AlertTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />}
                     {focusedCard.type === "staffing-distribution" && <Users className="h-5 w-5 text-orange-600" />}
                     {focusedCard.type === "change-order-analysis" && <FileText className="h-5 w-5 text-orange-600" />}
                     {focusedCard.type === "closeout" && <ClipboardCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
                     {focusedCard.type === "startup" && <Play className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                     {focusedCard.type === "critical-dates" && <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                     {focusedCard.type === "field-reports" && <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />}
                     {focusedCard.type === "rfi" && <MessageSquare className="h-5 w-5 text-orange-600" />}
                     {focusedCard.type === "submittal" && <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                     {focusedCard.type === "health" && <Heart className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />}
                     {focusedCard.type === "schedule-monitor" && <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                     {focusedCard.type === "bd-opportunities" && <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                     <span className="text-lg font-semibold">{focusedCard.title}</span>
                   </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCardUnfocus}
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="Close focus view"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              
              {/* Focused Card Content */}
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <div className="min-w-[600px] min-h-[400px]">
                  <CardContent card={focusedCard} isCompact={false} userRole={userRole} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DndContext>
  );
}

interface SortableCardProps {
  card: DashboardCard;
  isEditing: boolean;
  isCompact: boolean;
  onCardRemove?: (cardId: string) => void;
  onCardConfigure?: (cardId: string, configUpdate?: Partial<DashboardCard>) => void;
  onCardFocus?: (card: DashboardCard) => void;
  height: number | "auto";
  userRole?: string;
}

function SortableCard({
  card,
  isEditing,
  isCompact,
  onCardRemove,
  onCardConfigure,
  onCardFocus,
  height,
  userRole,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isEditing ? listeners : {})}
      className={cn(
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-60 scale-105 shadow-2xl z-50",
        typeof height === "number" && `h-[${height}px]`,
        height === "auto" && "min-h-[320px]"
      )}
      onClick={() => onCardFocus?.(card)}
    >
      {/* Use enhanced DashboardCardWrapper */}
      <DashboardCardWrapper
        card={card}
        onRemove={onCardRemove}
        onConfigure={onCardConfigure}
        isEditing={isEditing}
        isCompact={isCompact}
        dragHandleClass="h-full"
      >
        <div className="h-full">
          {/* Enhanced card header with better typography and spacing */}
          <div className="px-4 sm:px-5 lg:px-6 py-3 sm:py-4 border-b border-border/30 bg-muted/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm sm:text-base lg:text-lg truncate pr-2">
                {card.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Focus/Expand Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCardFocus?.(card);
                  }}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent/60"
                  title="Focus card"
                >
                  <Maximize2 className="h-3 w-3 text-muted-foreground" />
                </Button>
                {/* Card type icon with better sizing */}
                {card.type === "portfolio-overview" && <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                {card.type === "enhanced-hbi-insights" && <Brain className="h-4 w-4 text-purple-600" />}
                {card.type === "financial-review-panel" && <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                {card.type === "pipeline-analytics" && <Target className="h-4 w-4 text-orange-600" />}
                {card.type === "market-intelligence" && <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />}
                {card.type === "project-overview" && <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                {card.type === "schedule-performance" && <Calendar className="h-4 w-4 text-orange-600" />}
                {card.type === "financial-status" && <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />}
                {card.type === "general-conditions" && <Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                {card.type === "contingency-analysis" && <Shield className="h-4 w-4 text-purple-600" />}
                {card.type === "cash-flow" && <Droplets className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />}
                {card.type === "procurement" && <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                {card.type === "draw-forecast" && <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                {card.type === "quality-control" && <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                {card.type === "safety" && <AlertTriangleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />}
                {card.type === "staffing-distribution" && <Users className="h-4 w-4 text-orange-600" />}
                {card.type === "change-order-analysis" && <FileText className="h-4 w-4 text-orange-600" />}
                {card.type === "closeout" && <ClipboardCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                {card.type === "startup" && <Play className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                {card.type === "critical-dates" && <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                {card.type === "field-reports" && <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />}
                {card.type === "rfi" && <MessageSquare className="h-4 w-4 text-orange-600" />}
                {card.type === "submittal" && <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                {card.type === "health" && <Heart className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />}
                {card.type === "schedule-monitor" && <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                {card.type === "bd-opportunities" && <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
              </div>
            </div>
          </div>

          {/* Enhanced card content area */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-2 sm:p-3 lg:p-4 h-full">
              <CardContent card={card} isCompact={isCompact} userRole={userRole} />
            </div>
          </div>
        </div>
      </DashboardCardWrapper>
    </div>
  );
}

function CardContent({ card, isCompact, userRole }: { card: DashboardCard; isCompact: boolean; userRole?: string }) {
  const baseSpan = { cols: 8, rows: 6 }; // Standard size for simplified grid
  
  switch (card.type) {
    case "portfolio-overview":
      return <PortfolioOverview config={card.config || {}} span={baseSpan} isCompact={isCompact} />;
    case "enhanced-hbi-insights":
      return <EnhancedHBIInsights config={card.config || {}} cardId={card.id} />;
    case "financial-review-panel":
      return card.config?.panelProps ? (
        <FinancialReviewPanel {...card.config.panelProps} />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground p-4">
          <p>Configure Financial Review Panel</p>
        </div>
      );
    case "pipeline-analytics":
      return <PipelineAnalytics config={card.config || {}} span={baseSpan} isCompact={isCompact} />;
    case "market-intelligence":
      return <MarketIntelligence config={card.config || {}} span={baseSpan} isCompact={isCompact} />;
    case "project-overview":
      return <ProjectOverviewCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "schedule-performance":
      return <SchedulePerformanceCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "financial-status":
      return <FinancialStatusCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "general-conditions":
      return <GeneralConditionsCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "contingency-analysis":
      return <ContingencyAnalysisCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "cash-flow":
      return <CashFlowCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "procurement":
      return <ProcurementCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "draw-forecast":
      return <DrawForecastCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "quality-control":
      return <QualityControlCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "safety":
      return <SafetyCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "staffing-distribution":
      return <StaffingDistributionCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "change-order-analysis":
      return <ChangeOrderAnalysisCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "closeout":
      return <CloseoutCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "startup":
      return <StartupCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "critical-dates":
      return <CriticalDatesCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "field-reports":
      return <FieldReportsCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "rfi":
      return <RFICard card={card} config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "submittal":
      return <SubmittalCard card={card} config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "health":
      return <HealthCard card={card} config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "schedule-monitor":
      return <ScheduleMonitorCard card={card} config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    case "bd-opportunities":
      return <BDOpportunitiesCard card={card} config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground p-4">
          <div className="text-center">
            <p className="text-sm">Card Type: {card.type}</p>
            <p className="text-xs mt-1">Configure this card to display content</p>
          </div>
        </div>
      );
  }
}
