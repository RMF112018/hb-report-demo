"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { AppHeader } from "@/components/layout/app-header"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import FloatingButton from "@/components/messaging/floating-button"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login" || pathname === "/signup"

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <AuthProvider>
        {!isLoginPage && <AppHeader />}
        <main className={isLoginPage ? "" : "flex-1"}>{children}</main>
        <Toaster />
        {!isLoginPage && <FloatingButton />}
      </AuthProvider>
    </ThemeProvider>
  )
}
