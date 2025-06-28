"use client";

import React, { useState } from "react";
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

// Financial Module Components
import FinancialOverview from "@/components/financial-hub/FinancialOverview";
import BudgetAnalysis from "@/components/financial-hub/BudgetAnalysis";
import CashFlowAnalysis from "@/components/financial-hub/CashFlowAnalysis";
import Forecasting from "@/components/financial-hub/Forecasting";
import Invoicing from "@/components/financial-hub/Invoicing";
import PayAuthorizations from "@/components/financial-hub/PayAuthorizations";
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
  const { projectId } = useProjectContext();
  const [activeTab, setActiveTab] = useState("overview");

  // Role-based data filtering helper
  const getProjectScope = () => {
    if (!user) return { scope: "all", projectCount: 0, description: "All Projects" };
    
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
      id: "invoicing",
      label: "Invoicing",
      icon: FileText,
      description: "Invoice management and billing oversight",
      component: Invoicing,
    },
    {
      id: "pay-authorizations",
      label: "Pay Applications",
      icon: CheckCircle,
      description: "Payment authorization and approval workflows",
      component: PayAuthorizations,
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

  // Get role-specific summary data
  const getSummaryData = () => {
    switch (user?.role) {
      case "project-manager":
        return {
          totalContractValue: 57235491,
          netCashFlow: 8215006.64,
          profitMargin: 6.8,
          pendingApprovals: 3,
          healthScore: 88
        };
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
    <div className="h-screen flex flex-col bg-background">
      {/* Header Section */}
      <div className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Financial Hub</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive financial management and analysis suite
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                {projectScope.description}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                Health Score: {summaryData.healthScore}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium">Contract Value</div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(summaryData.totalContractValue)}
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-sm font-medium">Net Cash Flow</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(summaryData.netCashFlow)}
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="text-sm font-medium">Profit Margin</div>
                  <div className="text-lg font-bold text-purple-600">
                    {summaryData.profitMargin}%
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-orange-600" />
                <div>
                  <div className="text-sm font-medium">Pending Approvals</div>
                  <div className="text-lg font-bold text-orange-600">
                    {summaryData.pendingApprovals}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Available Financial Modules Notice */}
      <div className="flex-shrink-0 bg-muted/30 border-b border-border">
        <div className="px-6 py-3">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Available Financial Modules</span>
            <Badge variant="outline" className="text-xs">
              {availableModules.length} modules
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
          {/* Tab Navigation */}
          <div className="flex-shrink-0 border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 h-12 bg-transparent p-0">
                {availableModules.map((module) => (
                  <TabsTrigger
                    key={module.id}
                    value={module.id}
                    className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                  >
                    <module.icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{module.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-hidden">
            {availableModules.map((module) => {
              const ModuleComponent = module.component;
              
              return (
                <TabsContent
                  key={module.id}
                  value={module.id}
                  className="h-full overflow-y-auto data-[state=active]:flex data-[state=active]:flex-col mt-0 focus-visible:outline-none"
                >
                  <div className="flex-1 p-6 space-y-6">
                    {/* Module Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <module.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">{module.label}</h2>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                    </div>

                    {/* Module Content */}
                    <ModuleComponent 
                      userRole={user?.role || "executive"} 
                      projectData={projectScope}
                    />
                  </div>
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </div>
    </div>
  );
} 