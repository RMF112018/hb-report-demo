import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DashboardLayout, DashboardCard } from '@/types/dashboard';
import executiveLayout from '@/data/mock/layouts/executive-layout.json';
import projectExecutiveLayout from '@/data/mock/layouts/project-executive-layout.json';
import projectManagerLayout from '@/data/mock/layouts/project-manager-layout.json';
import financialReviewLayout from '@/data/mock/layouts/financial-review-layout.json';

/**
 * DashboardContext
 * ----------------
 * Provides state and actions for user-personalized dashboards, including:
 * - List of dashboards (per user)
 * - Current dashboard (active tab)
 * - Template dashboard (per role)
 * - CRUD operations (add, remove, update, reset)
 *
 * This context enables a Power BI/Oracle-style dashboard experience with tabs and full customization.
 */

// Helper function to get default span based on card size
function getDefaultSpan(size?: DashboardCard["size"]): { cols: number; rows: number } {
  switch (size) {
    case "small": return { cols: 3, rows: 3 };
    case "medium": return { cols: 4, rows: 4 };
    case "large": return { cols: 6, rows: 6 };
    case "wide": return { cols: 8, rows: 4 };
    case "tall": return { cols: 4, rows: 8 };
    case "extra-large": return { cols: 8, rows: 8 };
    default: return { cols: 4, rows: 4 };
  }
}

// Helper function to ensure cards have span properties
function normalizeCards(cards: DashboardCard[]): DashboardCard[] {
  return cards.map(card => ({
    ...card,
    span: card.span || getDefaultSpan(card.size)
  }));
}

interface DashboardContextType {
  dashboards: DashboardLayout[];
  currentDashboardId: string | null;
  setCurrentDashboardId: (id: string) => void;
  addDashboard: (dashboard: DashboardLayout) => void;
  updateDashboard: (dashboard: DashboardLayout) => void;
  removeDashboard: (id: string) => void;
  resetDashboard: (id: string) => void;
  templateDashboard: DashboardLayout | null;
  loading: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboardContext() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboardContext must be used within DashboardProvider');
  return ctx;
}

export function DashboardProvider({ userId, role, children }: { userId: string; role: string; children: ReactNode }) {
  const [dashboards, setDashboards] = useState<DashboardLayout[]>([]);
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null);
  const [templateDashboard, setTemplateDashboard] = useState<DashboardLayout | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboards and template on mount
  useEffect(() => {
    async function fetchDashboards() {
      setLoading(true);
      
      // DEMO: Use static JSON for templates based on user role
      let template: DashboardLayout | null = null;
      const userDashboards: DashboardLayout[] = [];
      
      if (role === 'executive') {
        template = { 
          ...executiveLayout, 
          name: 'Executive Overview',
          cards: normalizeCards(executiveLayout.cards as DashboardCard[])
        };
        
        // Create Executive Overview dashboard
        userDashboards.push({ 
          ...template, 
          id: `${role}-executive-overview`, 
          name: 'Executive Overview',
          cards: normalizeCards(template.cards)
        });
        
        // Create Financial Review dashboard
        userDashboards.push({
          ...financialReviewLayout,
          id: `${role}-financial-review`,
          name: 'Financial Review',
          cards: normalizeCards(financialReviewLayout.cards as DashboardCard[])
        });
      } else if (role === 'project-executive') {
        template = {
          ...projectExecutiveLayout,
          cards: normalizeCards(projectExecutiveLayout.cards as DashboardCard[])
        };
        
        userDashboards.push({ 
          ...template, 
          id: `${role}-user-dashboard`, 
          name: template?.name || 'My Dashboard',
          cards: normalizeCards(template.cards)
        });

        // Add Financial Review dashboard for Project Executive (filtered to 7 projects max)
        userDashboards.push({
          ...financialReviewLayout,
          id: `${role}-financial-review`,
          name: 'Financial Review',
          cards: normalizeCards(financialReviewLayout.cards as DashboardCard[])
        });
      } else if (role === 'project-manager') {
        template = {
          ...projectManagerLayout,
          cards: normalizeCards(projectManagerLayout.cards as DashboardCard[])
        };
        
        userDashboards.push({ 
          ...template, 
          id: `${role}-user-dashboard`, 
          name: template?.name || 'My Dashboard',
          cards: normalizeCards(template.cards)
        });

        // Add Financial Review dashboard for Project Manager (filtered to 1 project max)
        // Remove Portfolio Overview card for Project Manager
        const projectManagerFinancialCards = (financialReviewLayout.cards as DashboardCard[]).filter(
          card => card.type !== 'project-overview'
        );
        userDashboards.push({
          ...financialReviewLayout,
          id: `${role}-financial-review`,
          name: 'Financial Review',
          cards: normalizeCards(projectManagerFinancialCards)
        });
      }
      
      setDashboards(userDashboards);
      setTemplateDashboard(template);
      setCurrentDashboardId(userDashboards[0]?.id || null);
      setLoading(false);
    }
    fetchDashboards();
  }, [userId, role]);

  function addDashboard(dashboard: DashboardLayout) {
    const normalizedDashboard = {
      ...dashboard,
      cards: normalizeCards(dashboard.cards)
    };
    setDashboards(prev => [...prev, normalizedDashboard]);
    // TODO: Persist to backend
  }
  function updateDashboard(dashboard: DashboardLayout) {
    const normalizedDashboard = {
      ...dashboard,
      cards: normalizeCards(dashboard.cards)
    };
    setDashboards(prev => prev.map(d => d.id === dashboard.id ? normalizedDashboard : d));
    // TODO: Persist to backend
  }
  function removeDashboard(id: string) {
    setDashboards(prev => prev.filter(d => d.id !== id));
    // TODO: Persist to backend
  }
  function resetDashboard(id: string) {
    if (!templateDashboard) return;
    const resetDash = { 
      ...templateDashboard, 
      id, 
      name: dashboards.find(d => d.id === id)?.name || templateDashboard.name,
      cards: normalizeCards(templateDashboard.cards)
    };
    setDashboards(prev => prev.map(d => d.id === id ? resetDash : d));
    // TODO: Persist to backend
  }

  return (
    <DashboardContext.Provider value={{
      dashboards,
      currentDashboardId,
      setCurrentDashboardId,
      addDashboard,
      updateDashboard,
      removeDashboard,
      resetDashboard,
      templateDashboard,
      loading,
    }}>
      {children}
    </DashboardContext.Provider>
  );
} 