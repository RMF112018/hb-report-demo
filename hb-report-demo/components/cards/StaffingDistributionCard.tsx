"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

// Import the JSON data
import staffingData from "@/data/mock/staffing/staffing.json";
import spcrData from "@/data/mock/staffing/spcr.json";

interface StaffingDistributionCardProps {
  config?: any;
  span?: { cols: number; rows: number };
  isCompact?: boolean;
  userRole?: string;
}

const StaffingDistributionCard: React.FC<StaffingDistributionCardProps> = ({
  config = {},
  span = { cols: 8, rows: 6 },
  isCompact = false,
  userRole = "executive"
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Process staffing data by role
  const staffingByRole = staffingData.reduce((acc: any, person: any) => {
    acc[person.position] = (acc[person.position] || 0) + 1;
    return acc;
  }, {});

  // Process SPCR data
  const spcrStats = spcrData.reduce((acc: any, spcr: any) => {
    acc.total++;
    acc[spcr.status] = (acc[spcr.status] || 0) + 1;
    acc[spcr.type] = (acc[spcr.type] || 0) + 1;
    return acc;
  }, { total: 0 });

  // Chart data for role distribution
  const roleChartData = Object.entries(staffingByRole)
    .map(([role, count]) => ({
      role: role.replace(/^(Senior |Assistant |General )?/, ''),
      count,
      fullRole: role
    }))
    .sort((a, b) => (b.count as number) - (a.count as number))
    .slice(0, 8);

  // SPCR status data
  const spcrStatusData = [
    { name: 'Approved', value: spcrStats.approved || 0, color: 'hsl(var(--chart-1))' },
    { name: 'Pending', value: spcrStats.pending || 0, color: 'hsl(var(--chart-3))' },
    { name: 'Rejected', value: spcrStats.rejected || 0, color: 'hsl(var(--chart-4))' }
  ];

  // Experience level analysis
  const experienceLevels = staffingData.reduce((acc: any, person: any) => {
    if (person.experience <= 5) acc.junior++;
    else if (person.experience <= 15) acc.mid++;
    else acc.senior++;
    return acc;
  }, { junior: 0, mid: 0, senior: 0 });

  // Utilization rate calculation (mock data based on assignments)
  const utilizationRate = Math.round((staffingData.filter((p: any) => p.assignments?.length > 0).length / staffingData.length) * 100);

  return (
    <div 
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 rounded-lg">
        {/* Header Metrics */}
        <div className="grid grid-cols-4 gap-1 sm:gap-1.5 lg:gap-2 mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2">
          <div className="text-center">
            <div className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-orange-900">{staffingData.length}</div>
            <div className="text-xs text-orange-600">Total Staff</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-orange-900">{utilizationRate}%</div>
            <div className="text-xs text-orange-600">Utilization</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-orange-900">{spcrStats.total}</div>
            <div className="text-xs text-orange-600">SPCRs Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-green-700">{spcrStats.approved || 0}</div>
            <div className="text-xs text-orange-600">SPCR Approved</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 h-[calc(100%-120px)]">
          {/* Role Distribution Chart */}
          <div className="bg-white/70 dark:bg-black/70 rounded-lg p-1.5 sm:p-2 lg:p-2.5">
            <h4 className="text-sm font-semibold text-orange-900 mb-2">Staff by Role</h4>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={roleChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="role" type="category" tick={{ fontSize: 9 }} width={60} />
                <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Experience & SPCR Status */}
          <div className="space-y-2">
            {/* Experience Distribution */}
            <div className="bg-white/70 dark:bg-black/70 rounded-lg p-1.5 sm:p-2 lg:p-2.5 h-1/2">
              <h4 className="text-sm font-semibold text-orange-900 mb-2">Experience Levels</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground">Junior (≤5yr)</span>
                  <span className="text-sm font-medium">{experienceLevels.junior}</span>
                </div>
                <Progress value={(experienceLevels.junior / staffingData.length) * 100} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground">Mid-Level (6-15yr)</span>
                  <span className="text-sm font-medium">{experienceLevels.mid}</span>
                </div>
                <Progress value={(experienceLevels.mid / staffingData.length) * 100} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground">Senior (15+yr)</span>
                  <span className="text-sm font-medium">{experienceLevels.senior}</span>
                </div>
                <Progress value={(experienceLevels.senior / staffingData.length) * 100} className="h-2" />
              </div>
            </div>

            {/* SPCR Status */}
            <div className="bg-white/70 dark:bg-black/70 rounded-lg p-1.5 sm:p-2 lg:p-2.5 h-1/2">
              <h4 className="text-sm font-semibold text-orange-900 mb-2">SPCR Status</h4>
              <div className="h-full">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={spcrStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={40}
                      dataKey="value"
                    >
                      {spcrStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 text-xs">
                  {spcrStatusData.map((item) => (
                    <div key={item.name} className="flex items-center">
                      <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: item.color }}></div>
                      <span>{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-orange-900/95 backdrop-blur-sm rounded-lg p-2 sm:p-1.5 sm:p-2 lg:p-2.5 lg:p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 text-white transition-all duration-300 ease-in-out overflow-y-auto">
          <div className="h-full">
            <h3 className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 text-center">Staffing Deep Dive Analysis</h3>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-1 sm:gap-1.5 lg:gap-2 lg:gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 h-[calc(100%-60px)]">
              {/* Staffing Metrics */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Workforce Composition
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Project Executives:</span>
                      <span className="font-medium">{staffingByRole['Project Executive'] || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Project Managers:</span>
                      <span className="font-medium">
                        {(staffingByRole['Senior Project Manager'] || 0) + 
                         (staffingByRole['Project Manager III'] || 0) + 
                         (staffingByRole['Project Manager II'] || 0) + 
                         (staffingByRole['Project Manager I'] || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Superintendents:</span>
                      <span className="font-medium">
                        {(staffingByRole['General Superintendent'] || 0) + 
                         (staffingByRole['Superintendent III'] || 0) + 
                         (staffingByRole['Superintendent II'] || 0) + 
                         (staffingByRole['Superintendent I'] || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Support Staff:</span>
                      <span className="font-medium">
                        {(staffingByRole['Assistant Project Manager'] || 0) + 
                         (staffingByRole['Project Administrator'] || 0) + 
                         (staffingByRole['Project Accountant'] || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Performance Indicators
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Avg Experience:</span>
                      <span className="font-medium">
                        {Math.round(staffingData.reduce((sum: number, p: any) => sum + p.experience, 0) / staffingData.length)} years
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Labor Rate:</span>
                      <span className="font-medium">
                        ${Math.round(staffingData.reduce((sum: number, p: any) => sum + p.laborRate, 0) / staffingData.length)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Billable Rate Margin:</span>
                      <span className="font-medium text-green-400">
                        {Math.round(((staffingData.reduce((sum: number, p: any) => sum + p.billableRate, 0) / staffingData.length) / 
                        (staffingData.reduce((sum: number, p: any) => sum + p.laborRate, 0) / staffingData.length) - 1) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Multi-Project Staff:</span>
                      <span className="font-medium">
                        {staffingData.filter((p: any) => p.assignments?.length > 1).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SPCR Analysis */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    SPCR Request Analysis
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Increase Requests:</span>
                      <span className="font-medium text-blue-400">{spcrStats.increase || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Decrease Requests:</span>
                      <span className="font-medium text-yellow-400">{spcrStats.decrease || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Approval Rate:</span>
                      <span className="font-medium text-green-400">
                        {spcrStats.total > 0 ? Math.round((spcrStats.approved / spcrStats.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Review:</span>
                      <span className="font-medium text-orange-400">{spcrStats.pending || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Staffing Health
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Utilization Rate</span>
                        <span className="font-medium">{utilizationRate}%</span>
                      </div>
                      <div className="w-full bg-white/20 dark:bg-black/20 rounded-full h-2">
                        <div 
                          className="bg-green-400 h-2 rounded-full" 
                          style={{ width: `${utilizationRate}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Senior Staff Ratio</span>
                        <span className="font-medium">
                          {Math.round((experienceLevels.senior / staffingData.length) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/20 dark:bg-black/20 rounded-full h-2">
                        <div 
                          className="bg-blue-400 h-2 rounded-full" 
                          style={{ width: `${(experienceLevels.senior / staffingData.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/20 dark:border-black/20">
                      <p className="text-xs text-orange-200">
                        High utilization with balanced experience levels. 
                        SPCR approval rate indicates effective resource planning.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffingDistributionCard; 