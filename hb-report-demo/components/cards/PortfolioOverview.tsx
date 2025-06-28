'use client'

import { useEffect, useState, useMemo } from 'react'
import { TrendingUp, DollarSign, Building2, Layers3, Users, Calendar, Briefcase, MapPin, Target, Award } from 'lucide-react'
import { AreaChart } from '@/components/charts/AreaChart'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { CustomBarChart } from '@/components/charts/BarChart'

interface PortfolioOverviewProps {
  config: {
    totalProjects: number
    activeProjects: number
    completedThisYear: number
    averageDuration: number
    averageContractValue: number
    totalSqFt: number
    totalValue: number
    netCashFlow: number
    averageWorkingCapital: number
  }
  span: { cols: number; rows: number }
  isCompact?: boolean
}

/**
 * Compact Portfolio Overview Card
 * ------------------------------
 * Modern, efficient design with key metrics and smart visualizations
 * Adapts content based on available space
 */

const formatCurrency = (value?: number, compact = true) => {
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0
  if (compact) {
    if (safeValue >= 1_000_000) return `$${(safeValue / 1_000_000).toFixed(1)}M`
    if (safeValue >= 1_000) return `$${(safeValue / 1_000).toFixed(1)}K`
    return `$${safeValue.toLocaleString()}`
  }
  return `$${safeValue.toLocaleString()}`
}

const formatNumber = (value?: number) => {
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0
  return safeValue.toLocaleString()
}

// Custom Pie Chart Component without border/title
function SimplePieChart({ data }: { data: any[] }) {
  const COLORS = [
  'hsl(var(--chart-1))', 
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))'
]
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={15}
          outerRadius={40}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export default function PortfolioOverview({ config, span, isCompact = false }: PortfolioOverviewProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const {
    totalProjects,
    activeProjects,
    completedThisYear,
    averageDuration,
    averageContractValue,
    totalSqFt,
    totalValue,
    netCashFlow,
    averageWorkingCapital,
  } = config

  // Mock trend data for the last 6 months
  const trendData = useMemo(() => [
    { name: 'Jan', value: 18, completed: 2 },
    { name: 'Feb', value: 22, completed: 1 },
    { name: 'Mar', value: 28, completed: 3 },
    { name: 'Apr', value: 24, completed: 2 },
    { name: 'May', value: 26, completed: 1 },
    { name: 'Jun', value: totalProjects, completed: completedThisYear },
  ], [totalProjects, completedThisYear])

  // Project status distribution
  const projectStatusData = useMemo(() => [
    { name: 'Active', value: activeProjects, color: 'hsl(var(--chart-1))' },
    { name: 'Planning', value: 3, color: 'hsl(var(--chart-3))' },
    { name: 'On Hold', value: 2, color: 'hsl(var(--chart-4))' },
    { name: 'Completed', value: completedThisYear, color: 'hsl(var(--chart-1))' },
  ], [activeProjects, completedThisYear])

  // Determine layout based on span
  const isWide = span.cols >= 8
  const isTall = span.rows >= 6

  // Regional distribution data (Florida regions only)
  const regionalData = [
    { region: 'Central FL', projects: 4, value: 89.2 },
    { region: 'North FL', projects: 3, value: 67.8 },
    { region: 'Southeast FL', projects: 2, value: 45.3 },
    { region: 'Southwest FL', projects: 2, value: 38.9 },
    { region: 'Space Coast', projects: 1, value: 23.5 }
  ]

  return (
    <div 
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 overflow-hidden">
      {/* Key Metrics Header */}
      <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-blue-200 dark:border-blue-800">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
              <span className="text-xs font-medium text-muted-foreground">Total Projects</span>
            </div>
            <div className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium text-foreground">{totalProjects}</div>
            <div className="text-xs text-green-600 dark:text-green-400">{activeProjects} active</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
              <span className="text-xs font-medium text-muted-foreground">Portfolio Value</span>
            </div>
            <div className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium text-foreground">{formatCurrency(totalValue)}</div>
            <div className="text-xs text-muted-foreground">total value</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-1" />
              <span className="text-xs font-medium text-muted-foreground">Net Cash Flow</span>
            </div>
            <div className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium text-foreground">{formatCurrency(netCashFlow)}</div>
            <div className="text-xs text-muted-foreground">this month</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Layers3 className="h-4 w-4 text-purple-600 mr-1" />
              <span className="text-xs font-medium text-muted-foreground">Total Sq Ft</span>
            </div>
            <div className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium text-foreground">{formatNumber(totalSqFt)}</div>
            <div className="text-xs text-muted-foreground">square feet</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 overflow-hidden">
        {isWide ? (
          // Wide layout: side-by-side charts
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 h-full min-h-48">
            <div className="bg-card rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 shadow-sm">
              <h4 className="text-sm font-semibold text-foreground mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                Project Growth
              </h4>
              <div className="h-32">
                <AreaChart data={trendData} color="hsl(var(--chart-2))" compact />
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 shadow-sm">
              <h4 className="text-sm font-semibold text-foreground mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                <Building2 className="h-4 w-4 mr-1 text-indigo-600 dark:text-indigo-400" />
                Project Status
              </h4>
              <div className="h-32 flex items-center">
                <div className="w-24 h-24">
                  <SimplePieChart data={projectStatusData} />
                </div>
                <div className="flex-1 ml-4">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {projectStatusData.map(item => (
                      <div key={item.name} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3 flex-shrink-0" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Narrow layout: stacked charts
          <div className="space-y-4">
            <div className="bg-card rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 shadow-sm">
              <h4 className="text-sm font-semibold text-foreground mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                Growth Trend
              </h4>
              <div className="h-24">
                <AreaChart data={trendData.slice(-4)} color="hsl(var(--chart-2))" compact />
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 shadow-sm">
              <h4 className="text-sm font-semibold text-foreground mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                <Building2 className="h-4 w-4 mr-1 text-indigo-600 dark:text-indigo-400" />
                Status Distribution
              </h4>
              <div className="grid grid-cols-2 gap-1 sm:gap-1.5 lg:gap-2 text-sm">
                {projectStatusData.map(item => (
                  <div key={item.name} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with additional metrics */}
      <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-t border-blue-200 dark:border-blue-800">
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-muted-foreground">Avg Duration: </span>
            <span className="font-semibold text-foreground ml-1">{averageDuration} days</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-muted-foreground">Avg Contract: </span>
            <span className="font-semibold text-foreground ml-1">{formatCurrency(averageContractValue)}</span>
          </div>
        </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-blue-900/95 backdrop-blur-sm rounded-lg p-2 sm:p-1.5 sm:p-2 lg:p-2.5 lg:p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 text-white transition-all duration-300 ease-in-out overflow-y-auto">
          <div className="h-full">
            <h3 className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 text-center">Portfolio Deep Dive</h3>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-1 sm:gap-1.5 lg:gap-2 lg:gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 h-[calc(100%-60px)]">
              {/* Regional Distribution */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Florida Regional Distribution
                  </h4>
                  <div className="space-y-2 text-sm">
                    {regionalData.map((region) => (
                      <div key={region.region} className="flex justify-between items-center">
                        <span>{region.region}</span>
                        <div className="text-right">
                          <span className="font-medium">{region.projects} projects</span>
                          <div className="text-xs text-blue-200">${region.value}M</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Performance Metrics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Portfolio Health Score:</span>
                      <span className="font-medium text-green-400">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>On-Time Delivery Rate:</span>
                      <span className="font-medium text-green-400">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget Adherence:</span>
                      <span className="font-medium text-yellow-400">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Client Satisfaction:</span>
                      <span className="font-medium text-green-400">4.8/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Largest Projects
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="border-b border-white/20 dark:border-black/20 pb-2">
                      <div className="font-medium">Tropical World Nursery</div>
                      <div className="text-xs text-blue-200">Commercial • $89.2M • Central FL</div>
                      <div className="text-xs text-green-400">85% Complete</div>
                    </div>
                    <div className="border-b border-white/20 dark:border-black/20 pb-2">
                      <div className="font-medium">Grandview Heights</div>
                      <div className="text-xs text-blue-200">Residential • $67.8M • North FL</div>
                      <div className="text-xs text-yellow-400">Planning Phase</div>
                    </div>
                    <div className="pb-2">
                      <div className="font-medium">Marina Bay Plaza</div>
                      <div className="text-xs text-blue-200">Mixed-Use • $45.3M • Southeast FL</div>
                      <div className="text-xs text-green-400">95% Complete</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    Portfolio Composition
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Commercial Projects:</span>
                      <span className="font-medium">7 (58%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Residential Projects:</span>
                      <span className="font-medium">3 (25%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mixed-Use Projects:</span>
                      <span className="font-medium">2 (17%)</span>
                    </div>
                    <div className="pt-2 border-t border-white/20 dark:border-black/20">
                      <div className="flex justify-between text-blue-200">
                        <span>Total Portfolio Value:</span>
                        <span className="font-medium">{formatCurrency(totalValue)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}  