"use client"

import { useEffect, useCallback, useState } from "react"

interface UseKeyboardNavigationProps {
  items: any[]
  onSelect?: (index: number, item: any) => void
  onAction?: (action: string, index: number, item: any) => void
  enabled?: boolean
}

export function useKeyboardNavigation({ items, onSelect, onAction, enabled = true }: UseKeyboardNavigationProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [isActive, setIsActive] = useState(false)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || !isActive) return

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault()
          setFocusedIndex((prev) => Math.min(prev + 1, items.length - 1))
          break

        case "ArrowLeft":
          event.preventDefault()
          setFocusedIndex((prev) => Math.max(prev - 1, 0))
          break

        case "ArrowDown":
          event.preventDefault()
          // Move down by estimated grid columns
          const columnsDown = Math.min(4, Math.ceil(window.innerWidth / 320))
          setFocusedIndex((prev) => Math.min(prev + columnsDown, items.length - 1))
          break

        case "ArrowUp":
          event.preventDefault()
          // Move up by estimated grid columns
          const columnsUp = Math.min(4, Math.ceil(window.innerWidth / 320))
          setFocusedIndex((prev) => Math.max(prev - columnsUp, 0))
          break

        case "Enter":
        case " ":
          event.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < items.length) {
            onSelect?.(focusedIndex, items[focusedIndex])
          }
          break

        case "Escape":
          event.preventDefault()
          setFocusedIndex(-1)
          setIsActive(false)
          break

        default:
          // Handle custom action keys
          if (onAction && focusedIndex >= 0 && focusedIndex < items.length) {
            const actionKey = event.key.toLowerCase()
            onAction(actionKey, focusedIndex, items[focusedIndex])
          }
          break
      }
    },
    [enabled, isActive, focusedIndex, items, onSelect, onAction],
  )

  useEffect(() => {
    if (enabled) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [enabled, handleKeyDown])

  const activate = useCallback(() => {
    setIsActive(true)
    if (focusedIndex === -1 && items.length > 0) {
      setFocusedIndex(0)
    }
  }, [focusedIndex, items.length])

  const deactivate = useCallback(() => {
    setIsActive(false)
    setFocusedIndex(-1)
  }, [])

  return {
    focusedIndex,
    isActive,
    activate,
    deactivate,
    setFocusedIndex,
  }
}
