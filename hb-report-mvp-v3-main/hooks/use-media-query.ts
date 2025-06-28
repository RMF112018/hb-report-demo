"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQueryList = window.matchMedia(query)
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches)
      }

      // Initial check
      setMatches(mediaQueryList.matches)

      // Listen for changes
      mediaQueryList.addEventListener("change", listener)

      // Cleanup
      return () => {
        mediaQueryList.removeEventListener("change", listener)
      }
    }
  }, [query])

  return matches
}
