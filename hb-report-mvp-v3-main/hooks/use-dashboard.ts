"use client"

import { useState, useEffect, useCallback } from "react"
import type { DashboardLayout, DashboardCard, AIInsight } from "@/types/dashboard"
import { getDefaultLayouts } from "@/lib/dashboard-templates"
import { generateMockInsights } from "@/lib/mock-insights"

export function useDashboard(userId: string) {
  const [layouts, setLayouts] = useState<DashboardLayout[]>([])
  const [currentLayoutId, setCurrentLayoutId] = useState<string>("")
  const [editMode, setEditMode] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize layouts
  useEffect(() => {
    const initializeLayouts = () => {
      const savedLayouts = localStorage.getItem(`dashboard-layouts-${userId}`)
      const savedCurrentId = localStorage.getItem(`dashboard-current-${userId}`)

      if (savedLayouts) {
        const parsedLayouts = JSON.parse(savedLayouts)
        setLayouts(parsedLayouts)
        setCurrentLayoutId(savedCurrentId || parsedLayouts[0]?.id || "")
      } else {
        const defaultLayouts = getDefaultLayouts()
        setLayouts(defaultLayouts)
        setCurrentLayoutId(defaultLayouts[0]?.id || "")
      }

      setIsLoading(false)
    }

    if (userId) {
      initializeLayouts()
    }
  }, [userId])

  // Generate AI insights based on current layout
  useEffect(() => {
    if (currentLayoutId && layouts.length > 0) {
      const currentLayout = layouts.find((l) => l.id === currentLayoutId)
      if (currentLayout) {
        const visibleCards = currentLayout.cards.filter((c) => c.visible)
        const insights = generateMockInsights(visibleCards)
        setAiInsights(insights)
      }
    }
  }, [currentLayoutId, layouts])

  // Save to localStorage whenever layouts change
  useEffect(() => {
    if (layouts.length > 0 && userId) {
      localStorage.setItem(`dashboard-layouts-${userId}`, JSON.stringify(layouts))
      localStorage.setItem(`dashboard-current-${userId}`, currentLayoutId)
    }
  }, [layouts, currentLayoutId, userId])

  const currentLayout = layouts.find((l) => l.id === currentLayoutId)

  const createLayout = useCallback((name: string, description: string, templateType?: string) => {
    const newLayout: DashboardLayout = {
      id: `layout-${Date.now()}`,
      name,
      description,
      cards: [],
      isTemplate: false,
      templateType: templateType as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setLayouts((prev) => [...prev, newLayout])
    setCurrentLayoutId(newLayout.id)
  }, [])

  const deleteLayout = useCallback(
    (layoutId: string) => {
      setLayouts((prev) => {
        const filtered = prev.filter((l) => l.id !== layoutId)
        if (currentLayoutId === layoutId && filtered.length > 0) {
          setCurrentLayoutId(filtered[0].id)
        }
        return filtered
      })
    },
    [currentLayoutId],
  )

  const switchLayout = useCallback((layoutId: string) => {
    setCurrentLayoutId(layoutId)
    setEditMode(false)
    setSelectedCard(null)
  }, [])

  const addCard = useCallback((layoutId: string, card: Omit<DashboardCard, "id">) => {
    const newCard: DashboardCard = {
      ...card,
      id: `card-${Date.now()}`,
    }

    setLayouts((prev) =>
      prev.map((layout) =>
        layout.id === layoutId ? { ...layout, cards: [...layout.cards, newCard], updatedAt: new Date() } : layout,
      ),
    )
  }, [])

  const updateCard = useCallback((layoutId: string, cardId: string, updates: Partial<DashboardCard>) => {
    setLayouts((prev) =>
      prev.map((layout) =>
        layout.id === layoutId
          ? {
              ...layout,
              cards: layout.cards.map((card) => (card.id === cardId ? { ...card, ...updates } : card)),
              updatedAt: new Date(),
            }
          : layout,
      ),
    )
  }, [])

  const removeCard = useCallback((layoutId: string, cardId: string) => {
    setLayouts((prev) =>
      prev.map((layout) =>
        layout.id === layoutId
          ? {
              ...layout,
              cards: layout.cards.filter((card) => card.id !== cardId),
              updatedAt: new Date(),
            }
          : layout,
      ),
    )
  }, [])

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev)
    setSelectedCard(null)
  }, [])

  const selectCard = useCallback((cardId: string | null) => {
    setSelectedCard(cardId)
  }, [])

  const refreshInsights = useCallback(() => {
    if (currentLayout) {
      const visibleCards = currentLayout.cards.filter((c) => c.visible)
      const insights = generateMockInsights(visibleCards)
      setAiInsights(insights)
    }
  }, [currentLayout])

  return {
    layouts,
    currentLayout,
    currentLayoutId,
    editMode,
    selectedCard,
    aiInsights,
    isLoading,
    createLayout,
    deleteLayout,
    switchLayout,
    addCard,
    updateCard,
    removeCard,
    toggleEditMode,
    selectCard,
    refreshInsights,
  }
}
