"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import { useTour } from "@/context/tour-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout as DashboardLayoutComponent } from "@/components/dashboard/DashboardLayout";
import { DashboardProvider, useDashboardContext } from "@/context/dashboard-context";
import type { DashboardCard, DashboardLayout } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, ChevronDown, LayoutDashboard, Layout, Maximize2, Minimize2 } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";

// Mock data imports for cards
import projectsData from "@/data/mock/projects.json";
import cashFlowData from "@/data/mock/financial/cash-flow.json";

/**
 * Modern Dashboard Page
 * --------------------
 * Full-width dashboard implementation with popover dashboard selector
 * Features:
 * - Full window width utilization
 * - Popover menu for dashboard selection
 * - Controls moved to second row
 * - Dynamic card sizing based on content
 */

function DashboardContent({ user }: { user: any }) {
  const {
    dashboards,
    currentDashboardId,
    setCurrentDashboardId,
    updateDashboard,
    loading,
  } = useDashboardContext();
  const { startTour, isTourAvailable } = useTour();
  const [isEditing, setIsEditing] = useState(false);
  const [dashboardPopoverOpen, setDashboardPopoverOpen] = useState(false);
  const [layoutPopoverOpen, setLayoutPopoverOpen] = useState(false);
  const [layoutDensity, setLayoutDensity] = useState<'compact' | 'normal' | 'spacious'>('normal');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentDashboard = dashboards.find(d => d.id === currentDashboardId);

  // Auto-start dashboard tour for new visitors
  useEffect(() => {
    if (typeof window !== 'undefined' && isTourAvailable && user) {
      const hasSeenDashboardTour = localStorage.getItem('hb-tour-dashboard-seen')
      if (!hasSeenDashboardTour) {
        // Delay to ensure dashboard is fully loaded
        setTimeout(() => {
          startTour('dashboard-overview')
          localStorage.setItem('hb-tour-dashboard-seen', 'true')
        }, 2000)
      }
    }
  }, [isTourAvailable, startTour, user])

  // Simplified data preparation
  const stage4Projects = projectsData.filter(p => p.project_stage_id === 4);
  const targetMonth = "2024-12";
  const cashflowProject = cashFlowData.projects.find(p => 
    stage4Projects.some(sp => sp.project_id === p.project_id)
  );
  const cashflowMonth = cashflowProject?.cashFlowData.monthlyData.find(m => m.month === targetMonth);

  // Simplified handlers
  const handleLayoutChange = (newLayout: any[]) => {
    if (!currentDashboard) return;
    
    // Update card order based on layout
    const newCards = newLayout.map(layoutItem => {
      const card = currentDashboard.cards.find(c => c.id === layoutItem.i);
      return card ? { ...card } : null;
    }).filter(Boolean) as DashboardCard[];
    
    updateDashboard({
      ...currentDashboard,
      cards: newCards,
    });
  };

  const handleCardRemove = (cardId: string) => {
    if (!currentDashboard) return;
    const updatedCards = currentDashboard.cards.filter(card => card.id !== cardId);
    updateDashboard({
      ...currentDashboard,
      cards: updatedCards,
    });
  };

  const handleCardConfigure = (cardId: string, configUpdate?: Partial<DashboardCard>) => {
    if (!currentDashboard) return;
    
    if (configUpdate) {
      const updatedCards = currentDashboard.cards.map(card => 
        card.id === cardId ? { ...card, ...configUpdate } : card
      );
      updateDashboard({
        ...currentDashboard,
        cards: updatedCards,
      });
    } else {
      console.log('Configure card:', cardId);
    }
  };

  const handleCardAdd = () => {
    if (!currentDashboard) return;
    const newCard: DashboardCard = {
      id: `card-${Date.now()}`,
      type: 'placeholder',
      title: 'New Card',
      size: 'medium',
      position: { x: 0, y: 0 },
      span: { cols: 4, rows: 4 },
      visible: true,
    };
    updateDashboard({
      ...currentDashboard,
      cards: [...currentDashboard.cards, newCard],
    });
  };

  const handleSave = () => {
    console.log('Saving dashboard changes...');
    setIsEditing(false);
  };

  const handleReset = () => {
    console.log('Resetting dashboard to template...');
  };

  const handleDashboardSelect = (dashboardId: string) => {
    setCurrentDashboardId(dashboardId);
    setDashboardPopoverOpen(false);
  };

  const handleLayoutDensityChange = (density: 'compact' | 'normal' | 'spacious') => {
    setLayoutDensity(density);
    setLayoutPopoverOpen(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Inject data into specific card types
  if (currentDashboard) {
    currentDashboard.cards = currentDashboard.cards.map(card => {
      switch (card.type) {
        case "financial-review-panel":
          return { 
            ...card, 
            config: { 
              ...card.config, 
              panelProps: { 
                forecastIndex: 8.75,
                budgetHealth: 8.2,
                cashflowData: cashflowMonth,
                scheduleHealth: 9.1,
                cashflowChartData: cashflowProject?.cashFlowData.monthlyData.map(m => ({ 
                  name: m.month, 
                  value: m.netCashFlow 
                })) || [],
                cashflowMetrics: cashflowMonth ? [
                  { label: "Net Cash Flow", value: `$${cashflowMonth.netCashFlow.toLocaleString()}` },
                  { label: "Inflows", value: `$${cashflowMonth.inflows.total.toLocaleString()}` },
                  { label: "Outflows", value: `$${cashflowMonth.outflows.total.toLocaleString()}` },
                ] : [],
                scheduleMetrics: [
                  { label: "Delays", value: 0 },
                  { label: "Total Float", value: 6 },
                ]
              } 
            } 
          };
        case "portfolio-overview":
          return {
            ...card,
            config: {
              totalProjects: 24,
              activeProjects: 7,
              completedThisYear: 5,
              averageDuration: 214,
              averageContractValue: 3100000,
              totalSqFt: 880000,
              totalValue: 75000000,
              netCashFlow: 12500000,
              averageWorkingCapital: 4200000
            }
          };
        default:
          return card;
      }
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboards...</p>
        </div>
      </div>
    );
  }

  if (!dashboards.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No dashboards found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      {/* App Header */}
      <AppHeader />
      
      {/* Dashboard Content - Full Width */}
      <div className="w-full">
        {/* Dashboard Header */}
        <div className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* First Row - Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
            </div>
            
            {/* Second Row - Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                {/* Dashboard Selector Popover */}
                <Popover open={dashboardPopoverOpen} onOpenChange={setDashboardPopoverOpen} data-tour="dashboard-selector">
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>{currentDashboard?.name || 'Select Dashboard'}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0" align="start">
                    <div className="p-2">
                      <div className="text-sm font-medium text-foreground px-2 py-1 mb-1">
                        Available Dashboards
                      </div>
                      {dashboards.map(dashboard => (
                        <button
                          key={dashboard.id}
                          onClick={() => handleDashboardSelect(dashboard.id)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            currentDashboardId === dashboard.id
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'hover:bg-muted text-muted-foreground'
                          }`}
                        >
                          <div className="font-medium">{dashboard.name}</div>
                          {dashboard.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">{dashboard.description}</div>
                          )}
                        </button>
                      ))}
                                              <div className="border-t border-border mt-2 pt-2">
                        <button
                          onClick={() => {/* TODO: Add new dashboard */}}
                          className="w-full text-left px-3 py-2 rounded text-sm text-primary hover:bg-primary/10 flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add New Dashboard
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                  size="sm"
                >
                  {isEditing ? "Exit Edit" : "Edit"}
                </Button>
                
                {isEditing && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      className="text-green-600 dark:text-green-400 border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950"
                    >
                      Reset
                    </Button>
                  </>
                )}

                {/* Layout Options Popover */}
                <Popover open={layoutPopoverOpen} onOpenChange={setLayoutPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      <span className="hidden sm:inline">{layoutDensity.charAt(0).toUpperCase() + layoutDensity.slice(1)}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0" align="end">
                    <div className="p-2">
                      <div className="text-sm font-medium text-foreground px-2 py-1 mb-1">
                        Layout Density
                      </div>
                      {[
                        { value: 'compact' as const, label: 'Compact', description: 'Dense layout' },
                        { value: 'normal' as const, label: 'Normal', description: 'Balanced spacing' },
                        { value: 'spacious' as const, label: 'Spacious', description: 'Generous spacing' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleLayoutDensityChange(option.value)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            layoutDensity === option.value
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'hover:bg-muted text-muted-foreground'
                          }`}
                        >
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{option.description}</div>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Fullscreen Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="flex items-center gap-2"
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                  <span className="hidden md:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {currentDashboard && (
          <div data-tour="dashboard-content">
            <DashboardLayoutComponent 
            cards={currentDashboard.cards}
            onLayoutChange={handleLayoutChange}
            onCardRemove={handleCardRemove}
            onCardConfigure={handleCardConfigure}
            onCardAdd={handleCardAdd}
            onSave={handleSave}
            onReset={handleReset}
            isEditing={isEditing}
            onToggleEdit={() => setIsEditing(!isEditing)}
            layoutDensity={layoutDensity}
            userRole={user.role}
          />
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      router.push("/login");
      return;
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <DashboardProvider userId={user.id} role={user.role}>
      <DashboardContent user={user} />
    </DashboardProvider>
  );
}
