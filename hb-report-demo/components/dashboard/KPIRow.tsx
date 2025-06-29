"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, Target, Activity, PieChart, BarChart3, Users, Calendar, Heart, Shield, Zap, Coins, ChevronDown, ChevronUp } from "lucide-react"
import { KPIWidget } from "@/components/charts/KPIWidget"
import { Button } from "@/components/ui/button"

interface KPIRowProps {
  userRole?: string
}

// Helper function to determine performance level based on value and type
const getPerformanceLevel = (value: string | number, type: string, trend?: string): 'good' | 'ok' | 'warning' | 'bad' => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value

  switch (type) {
    case 'health':
    case 'performance':
    case 'satisfaction':
    case 'quality':
    case 'completion':
      if (numValue >= 90) return 'good'
      if (numValue >= 75) return 'ok'
      if (numValue >= 60) return 'warning'
      return 'bad'
    
    case 'budget':
      if (numValue <= 95) return 'good'  // Under budget is good
      if (numValue <= 100) return 'ok'
      if (numValue <= 105) return 'warning'
      return 'bad'
    
    case 'margin':
      if (numValue >= 18) return 'good'
      if (numValue >= 15) return 'ok'
      if (numValue >= 10) return 'warning'
      return 'bad'
    
    case 'variance':
      if (numValue <= 3) return 'good'
      if (numValue <= 5) return 'ok'
      if (numValue <= 8) return 'warning'
      return 'bad'
    
    case 'safety':
      if (numValue >= 100) return 'good'  // Days incident-free
      if (numValue >= 60) return 'ok'
      if (numValue >= 30) return 'warning'
      return 'bad'
    
    case 'schedule':
      if (trend === 'up' && numValue >= 85) return 'good'
      if (numValue >= 75) return 'ok'
      if (numValue >= 65) return 'warning'
      return 'bad'
    
    default:
      return 'ok'
  }
}

export function KPIRow({ userRole }: KPIRowProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // KPI configurations by role
  function getKPIsForRole() {
    switch (userRole) {
      case 'executive':
        return [
          {
            icon: DollarSign,
            label: "Total Revenue",
            value: "$47.8M",
            trend: "up" as const,
            caption: "+8.2% YTD",
            performance: getPerformanceLevel(47.8, 'revenue', 'up')
          },
          {
            icon: Heart,
            label: "Portfolio Health",
            value: "77.6",
            unit: "%",
            trend: "stable" as const,
            caption: "±0.2% vs Q3",
            performance: getPerformanceLevel(77.6, 'health', 'stable')
          },
          {
            icon: Target,
            label: "Active Projects",
            value: "12",
            trend: "up" as const,
            caption: "+2 this quarter",
            performance: getPerformanceLevel(12, 'projects', 'up')
          },
          {
            icon: TrendingUp,
            label: "Profit Margin",
            value: "18.4",
            unit: "%",
            trend: "up" as const,
            caption: "+2.1% vs target",
            performance: getPerformanceLevel(18.4, 'margin', 'up')
          },
          {
            icon: PieChart,
            label: "Backlog",
            value: "$89.2M",
            trend: "up" as const,
            caption: "12.4 months",
            performance: getPerformanceLevel(89.2, 'backlog', 'up')
          },
          {
            icon: Shield,
            label: "Safety Score",
            value: "89.7",
            unit: "%",
            trend: "up" as const,
            caption: "247 days incident-free",
            performance: getPerformanceLevel(247, 'safety', 'up')
          }
        ]

      case 'project-executive':
        return [
          {
            icon: DollarSign,
            label: "Portfolio Value",
            value: "$28.4M",
            trend: "up" as const,
            caption: "6 active projects",
            performance: getPerformanceLevel(28.4, 'revenue', 'up')
          },
          {
            icon: Calendar,
            label: "Schedule Performance",
            value: "79.8",
            unit: "%",
            trend: "down" as const,
            caption: "-15.7 days avg",
            performance: getPerformanceLevel(79.8, 'schedule', 'down')
          },
          {
            icon: Target,
            label: "Budget Performance",
            value: "94.2",
            unit: "%",
            trend: "up" as const,
            caption: "+1.8% under budget",
            performance: getPerformanceLevel(94.2, 'budget', 'up')
          },
          {
            icon: Users,
            label: "Client Satisfaction",
            value: "85.6",
            unit: "%",
            trend: "stable" as const,
            caption: "6/6 projects rated",
            performance: getPerformanceLevel(85.6, 'satisfaction', 'stable')
          },
          {
            icon: Activity,
            label: "Change Orders",
            value: "42",
            trend: "up" as const,
            caption: "$6.8M value",
            performance: getPerformanceLevel(42, 'change_orders', 'up')
          },
          {
            icon: Shield,
            label: "Risk Exposure",
            value: "$1.85M",
            trend: "down" as const,
            caption: "74% mitigated",
            performance: getPerformanceLevel(1.85, 'risk', 'down')
          }
        ]

      case 'project-manager':
        return [
          {
            icon: DollarSign,
            label: "Project Value",
            value: "$4.2M",
            trend: "stable" as const,
            caption: "Tropical World",
            performance: getPerformanceLevel(4.2, 'revenue', 'stable')
          },
          {
            icon: Calendar,
            label: "Schedule Health",
            value: "82.4",
            unit: "%",
            trend: "up" as const,
            caption: "12.3 days behind",
            performance: getPerformanceLevel(82.4, 'schedule', 'up')
          },
          {
            icon: Target,
            label: "Budget Status",
            value: "97.2",
            unit: "%",
            trend: "down" as const,
            caption: "1.8% over forecast",
            performance: getPerformanceLevel(97.2, 'budget', 'down')
          },
          {
            icon: Zap,
            label: "Quality Score",
            value: "91.2",
            unit: "%",
            trend: "up" as const,
            caption: "15 days no rework",
            performance: getPerformanceLevel(91.2, 'quality', 'up')
          },
          {
            icon: Shield,
            label: "Safety Days",
            value: "127",
            trend: "up" as const,
            caption: "incident-free",
            performance: getPerformanceLevel(127, 'safety', 'up')
          },
          {
            icon: BarChart3,
            label: "Completion",
            value: "68.4",
            unit: "%",
            trend: "up" as const,
            caption: "142 days remain",
            performance: getPerformanceLevel(68.4, 'completion', 'up')
          }
        ]

      default: // financial or other roles
        return [
          {
            icon: DollarSign,
            label: "Contract Value",
            value: "$47.8M",
            trend: "up" as const,
            caption: "Active portfolio",
            performance: getPerformanceLevel(47.8, 'revenue', 'up')
          },
          {
            icon: Activity,
            label: "Cash Flow",
            value: "$2.8M",
            trend: "up" as const,
            caption: "Monthly avg",
            performance: getPerformanceLevel(2.8, 'cash_flow', 'up')
          },
          {
            icon: Coins,
            label: "Receivables",
            value: "$3.4M",
            trend: "down" as const,
            caption: "32 days avg",
            performance: getPerformanceLevel(3.4, 'receivables', 'down')
          },
          {
            icon: TrendingUp,
            label: "Profit Margin",
            value: "18.4",
            unit: "%",
            trend: "up" as const,
            caption: "+2.1% vs budget",
            performance: getPerformanceLevel(18.4, 'margin', 'up')
          },
          {
            icon: Target,
            label: "Cost Variance",
            value: "2.3",
            unit: "%",
            trend: "down" as const,
            caption: "Under budget",
            performance: getPerformanceLevel(2.3, 'variance', 'down')
          },
          {
            icon: Shield,
            label: "Contingency",
            value: "8.7",
            unit: "%",
            trend: "stable" as const,
            caption: "Remaining",
            performance: getPerformanceLevel(8.7, 'contingency', 'stable')
          }
        ]
    }
  }

  // Get responsive KPI count based on screen size and collapse state
  const getResponsiveKPICount = (kpis: any[]) => {
    if (isCollapsed) {
      return {
        mobile: [],                   // Hide all when collapsed
        tablet: [],                   // Hide all when collapsed
        desktop: []                   // Hide all when collapsed
      }
    }
    
    return {
      mobile: kpis.slice(0, 3),      // Show 3 on mobile (full width)
      tablet: kpis.slice(0, 4),      // Show 4 on tablet
      desktop: kpis                  // Show all on desktop
    }
  }

  // Get KPIs for the current user role
  const kpis = getKPIsForRole()
  
  // Get responsive KPI distribution
  const responsiveKpis = getResponsiveKPICount(kpis)

  return (
    <div className="bg-card border-b border-border">
      {/* Header with collapse toggle - always visible */}
      <div className="flex items-center justify-between px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xs sm:text-sm font-medium text-muted-foreground">Key Metrics</h2>
          <span className="text-xs text-muted-foreground/60">
            ({kpis.length} indicators)
          </span>
        </div>
        
        {/* Collapse toggle - visible on tablet and mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-6 w-6 p-0 lg:hidden hover:bg-muted/50"
          title={isCollapsed ? "Show metrics" : "Hide metrics"}
        >
          {isCollapsed ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronUp className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* KPI Content - collapsible on smaller screens */}
      <div className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-[200px] opacity-100'
      } lg:max-h-none lg:opacity-100`}>
        <div className="px-2 sm:px-3 lg:px-4 pb-2 sm:pb-3 lg:pb-4">
          {/* Mobile Layout - 3 KPIs filling full width */}
          {responsiveKpis.mobile.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5 sm:hidden">
              {responsiveKpis.mobile.map((kpi, index) => (
                <div key={index} className="min-w-0">
                  <KPIWidget
                    icon={kpi.icon}
                    label={kpi.label}
                    value={kpi.value}
                    unit={kpi.unit}
                    trend={kpi.trend}
                    caption={kpi.caption}
                    compact={true}
                    performance={kpi.performance}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tablet Layout - 4 KPIs filling full width */}
          {responsiveKpis.tablet.length > 0 && (
            <div className="hidden sm:grid lg:hidden grid-cols-4 gap-2">
              {responsiveKpis.tablet.map((kpi, index) => (
                <div key={index} className="min-w-0">
                  <KPIWidget
                    icon={kpi.icon}
                    label={kpi.label}
                    value={kpi.value}
                    unit={kpi.unit}
                    trend={kpi.trend}
                    caption={kpi.caption}
                    compact={true}
                    performance={kpi.performance}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Desktop Layout - All KPIs in responsive grid */}
          {responsiveKpis.desktop.length > 0 && (
            <div className="hidden lg:grid gap-2 xl:gap-3" style={{
              gridTemplateColumns: `repeat(${Math.min(responsiveKpis.desktop.length, 6)}, 1fr)`
            }}>
              {responsiveKpis.desktop.map((kpi, index) => (
                <div key={index} className="min-w-0">
                  <KPIWidget
                    icon={kpi.icon}
                    label={kpi.label}
                    value={kpi.value}
                    unit={kpi.unit}
                    trend={kpi.trend}
                    caption={kpi.caption}
                    compact={true}
                    performance={kpi.performance}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 