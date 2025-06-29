"use client"

import { useState, useEffect, useCallback } from "react"
import type { DashboardCard, DashboardPreferences } from "@/types/dashboard"

interface UseDashboardPreferencesOptions {
  storageKey: string
  defaultCards: DashboardCard[]
}

export function useDashboardPreferences({ storageKey, defaultCards }: UseDashboardPreferencesOptions) {
  const [preferences, setPreferences] = useState<DashboardPreferences>({
    layout: defaultCards,
    hiddenCards: [],
    filterBy: "all",
    sortBy: "default",
    lastSaved: new Date().toISOString(),
  })

  const [isLoaded, setIsLoaded] = useState(false)

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          const parsedPreferences = JSON.parse(saved) as DashboardPreferences

          // Merge with default cards to handle new cards
          const cardMap = new Map(defaultCards.map((card) => [card.id, card]))
          const mergedLayout = parsedPreferences.layout
            .map((savedCard) => ({
              ...cardMap.get(savedCard.id),
              ...savedCard,
              config: cardMap.get(savedCard.id)?.config || savedCard.config,
            }))
            .filter(Boolean) as DashboardCard[]

          // Add new cards that weren't in saved layout
          const savedIds = new Set(parsedPreferences.layout.map((c) => c.id))
          const newCards = defaultCards.filter((card) => !savedIds.has(card.id))

          setPreferences({
            ...parsedPreferences,
            layout: [...mergedLayout, ...newCards],
          })
        } else {
          setPreferences((prev) => ({ ...prev, layout: defaultCards }))
        }
      } catch (error) {
        console.warn("Failed to load dashboard preferences:", error)
        setPreferences((prev) => ({ ...prev, layout: defaultCards }))
      }
      setIsLoaded(true)
    }
  }, [storageKey, defaultCards])

  // Save preferences to localStorage
  const savePreferences = useCallback(
    (newPreferences: Partial<DashboardPreferences>) => {
      if (typeof window !== "undefined") {
        try {
          const updated = {
            ...preferences,
            ...newPreferences,
            lastSaved: new Date().toISOString(),
          }
          localStorage.setItem(storageKey, JSON.stringify(updated))
          setPreferences(updated)
          return true
        } catch (error) {
          console.error("Failed to save dashboard preferences:", error)
          return false
        }
      }
      return false
    },
    [preferences, storageKey],
  )

  // Reset to defaults
  const resetPreferences = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey)
      setPreferences({
        layout: defaultCards,
        hiddenCards: [],
        filterBy: "all",
        sortBy: "default",
        lastSaved: new Date().toISOString(),
      })
    }
  }, [storageKey, defaultCards])

  // Update specific preference
  const updatePreference = useCallback(
    <K extends keyof DashboardPreferences>(key: K, value: DashboardPreferences[K]) => {
      savePreferences({ [key]: value })
    },
    [savePreferences],
  )

  return {
    preferences,
    isLoaded,
    savePreferences,
    resetPreferences,
    updatePreference,
  }
}
