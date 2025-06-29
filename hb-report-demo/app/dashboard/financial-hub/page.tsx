"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useProjectContext } from "@/context/project-context";
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Calculator, 
  FileText, 
  CheckCircle, 
  GitBranch,
  PieChart,
  CreditCard,
  Building2,
  Banknote,
  Receipt
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/layout/app-header";

// Financial Module Components
import FinancialOverview from "@/components/financial-hub/FinancialOverview";
import BudgetAnalysis from "@/components/financial-hub/BudgetAnalysis";
import CashFlowAnalysis from "@/components/financial-hub/CashFlowAnalysis";
import Forecasting from "@/components/financial-hub/Forecasting";
import { PayApplication } from "@/components/financial-hub/PayApplication";

import ChangeManagement from "@/components/financial-hub/ChangeManagement";
import CostTracking from "@/components/financial-hub/CostTracking";
import ContractManagement from "@/components/financial-hub/ContractManagement";
import RetentionManagement from "@/components/financial-hub/RetentionManagement";

interface FinancialModuleTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  component: React.ComponentType<{ userRole: string; projectData: any }>;
  requiredRoles?: string[];
}

export default function FinancialHubPage() {
  const { user } = useAuth();
  const { projectId, selectedProject } = useProjectContext();
  const [activeTab, setActiveTab] = useState("overview");

  // Role-based data filtering helper
  const getProjectScope = () => {
    if (!user) return { scope: "all", projectCount: 0, description: "All Projects" };
    
    // If a specific project is selected, show single project view
    if (selectedProject) {
      return {
        scope: "single",
        projectCount: 1,
        description: `Project View: ${selectedProject.name}`,
        projects: [selectedProject.name],
        selectedProject
      };
    }
    
    // Default role-based views when no specific project is selected
    switch (user.role) {
      case "project-manager":
        return { 
          scope: "single", 
          projectCount: 1, 
          description: "Single Project View",
          projects: ["Tropical World Nursery"]
        };
      case "project-executive":
        return { 
          scope: "portfolio", 
          projectCount: 6, 
          description: "Portfolio View (6 Projects)",
          projects: ["Medical Center East", "Tech Campus Phase 2", "Marina Bay Plaza", "Tropical World", "Grandview Heights", "Riverside Plaza"]
        };
      default:
        return { 
          scope: "enterprise", 
          projectCount: 12, 
          description: "Enterprise View (All Projects)",
          projects: []
        };
    }
  };

  const projectScope = getProjectScope();

  // Define available financial modules
  const financialModules: FinancialModuleTab[] = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      description: "Comprehensive financial dashboard with key metrics and insights",
      component: FinancialOverview,
    },
    {
      id: "budget-analysis",
      label: "Budget Analysis",
      icon: Calculator,
      description: "Detailed budget tracking, variance analysis, and performance metrics",
      component: BudgetAnalysis,
    },
    {
      id: "cash-flow",
      label: "Cash Flow",
      icon: DollarSign,
      description: "Cash flow management, forecasting, and liquidity analysis",
      component: CashFlowAnalysis,
    },
    {
      id: "cost-tracking",
      label: "Cost Tracking",
      icon: PieChart,
      description: "Real-time cost tracking and expense categorization",
      component: CostTracking,
    },
    {
      id: "forecasting",
      label: "Forecasting",
      icon: TrendingUp,
      description: "Financial forecasting and predictive analytics",
      component: Forecasting,
    },
    {
      id: "pay-authorization",
      label: "Pay Application",
      icon: Receipt,
      description: "Generate and manage formal AIA G702/G703 payment applications",
      component: PayApplication,
    },

    {
      id: "change-management",
      label: "Change Orders",
      icon: GitBranch,
      description: "Change order tracking and financial impact analysis",
      component: ChangeManagement,
    },
    {
      id: "contract-management",
      label: "Contracts",
      icon: Building2,
      description: "Contract value tracking and commitment management",
      component: ContractManagement,
      requiredRoles: ["executive", "project-executive", "admin"],
    },
    {
      id: "retention-management",
      label: "Retention",
      icon: Banknote,
      description: "Retention tracking and release management",
      component: RetentionManagement,
    },
  ];

  // Filter modules based on user role
  const availableModules = financialModules.filter(module => {
    if (!module.requiredRoles) return true;
    return user?.role && module.requiredRoles.includes(user.role);
  });

  // Get role-specific summary data based on current view
  const getSummaryData = () => {
    const scope = getProjectScope();
    
    // If viewing a single project (either by role or selection)
    if (scope.scope === "single") {
      return {
        totalContractValue: 57235491,
        netCashFlow: 8215006.64,
        profitMargin: 6.8,
        pendingApprovals: 3,
        healthScore: 88
      };
    }
    
    // Portfolio or enterprise views
    switch (user?.role) {
      case "project-executive":
        return {
          totalContractValue: 285480000,
          netCashFlow: 42630000,
          profitMargin: 6.8,
          pendingApprovals: 12,
          healthScore: 86
        };
      default:
        return {
          totalContractValue: 485280000,
          netCashFlow: 72830000,
          profitMargin: 6.4,
          pendingApprovals: 23,
          healthScore: 85
        };
    }
  };

  const summaryData = getSummaryData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <AppHeader />
      <div className="space-y-6" data-tour="financial-hub-content">
        {/* Page Header */}
      <div className="flex items-center justify-between" data-tour="financial-hub-header">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive financial management and analysis suite
          </p>
        </div>
        <div className="flex items-center gap-4" data-tour="financial-hub-scope">
          <Badge variant="outline" className="px-3 py-1">
            {projectScope.description}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            Health Score: {summaryData.healthScore}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-tour="financial-hub-quick-stats">
        <Card className="p-4 border-border bg-card" data-tour="financial-hub-contract-value">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Contract Value</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(summaryData.totalContractValue)}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-border bg-card" data-tour="financial-hub-cash-flow">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Net Cash Flow</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(summaryData.netCashFlow)}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-border bg-card" data-tour="financial-hub-profit-margin">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Profit Margin</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {summaryData.profitMargin}%
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-border bg-card" data-tour="financial-hub-pending-approvals">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Pending Approvals</div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {summaryData.pendingApprovals}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Tab Navigation */}
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 h-12 bg-muted border-border" data-tour="financial-hub-navigation">
          {availableModules.map((module) => (
            <TabsTrigger
              key={module.id}
              value={module.id}
              className="flex items-center gap-2 text-xs font-medium px-3 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
              data-tour={`financial-hub-tab-${module.id}`}
            >
              <module.icon className="h-3 w-3" />
              <span className="hidden sm:inline">{module.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        {availableModules.map((module) => {
          const ModuleComponent = module.component;
          
          return (
            <TabsContent key={module.id} value={module.id} className="space-y-6" data-tour={`financial-hub-content-${module.id}`}>
              {/* Module Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border" data-tour={`financial-hub-header-${module.id}`}>
                <div className="p-2 rounded-lg bg-primary/10 border-primary/20">
                  <module.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{module.label}</h2>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              </div>

              {/* Module Content */}
              <ModuleComponent 
                userRole={projectScope.scope === "single" ? "project-manager" : user?.role || "executive"}
                projectData={projectScope}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
    </>
  );
} 