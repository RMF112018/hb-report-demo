'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => setMounted(true), [])

  return (
    <NextThemesProvider {...props}>
      {mounted && children}
    </NextThemesProvider>
  )
}