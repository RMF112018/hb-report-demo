"use client"

import type React from "react"

import { useState, useEffect } from "react"

/**
 * Custom hook for debouncing values
 * Delays updating the debounced value until after the specified delay
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 *
 * @example
 * ```typescript
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 300)
 *
 * useEffect(() => {
 *   // This will only run 300ms after the user stops typing
 *   if (debouncedSearchTerm) {
 *     performSearch(debouncedSearchTerm)
 *   }
 * }, [debouncedSearchTerm])
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timer if the value changes before the delay is complete
    // This ensures that the debounced value is only updated after the user
    // stops changing the input for the specified delay period
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Alternative implementation with immediate first call
 * Useful when you want the first call to execute immediately
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @param immediate - Whether to call immediately on first invocation
 * @returns The debounced value
 */
export function useDebounceImmediate<T>(value: T, delay: number, immediate = false): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const [isFirstCall, setIsFirstCall] = useState(true)

  useEffect(() => {
    // If immediate is true and this is the first call, update immediately
    if (immediate && isFirstCall) {
      setDebouncedValue(value)
      setIsFirstCall(false)
      return
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value)
      setIsFirstCall(false)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay, immediate, isFirstCall])

  return debouncedValue
}

/**
 * Hook for debouncing callback functions
 * Useful for debouncing API calls or expensive operations
 *
 * @param callback - The callback function to debounce
 * @param delay - The delay in milliseconds
 * @param deps - Dependencies array for the callback
 * @returns The debounced callback function
 *
 * @example
 * ```typescript
 * const debouncedSearch = useDebounceCallback(
 *   (searchTerm: string) => {
 *     performAPISearch(searchTerm)
 *   },
 *   300,
 *   []
 * )
 * ```
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList,
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(() => callback)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [callback, delay, ...deps])

  return debouncedCallback
}

export default useDebounce
