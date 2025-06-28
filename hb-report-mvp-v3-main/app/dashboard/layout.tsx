"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const hasPreConAccess = () => {
    if (!user) return false
    if (["c-suite", "project-executive", "estimator", "admin"].includes(user.role)) return true
    if (user.role === "project-manager") return user.permissions?.preConAccess === true
    return false
  }

  useEffect(() => {
    if (pathname.startsWith("/pre-con") && !hasPreConAccess()) {
      router.push("/dashboard")
    }
  }, [pathname, user, router])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#003087]"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-y-auto relative">{children}</div>
    </div>
  )
}

export default DashboardLayout
