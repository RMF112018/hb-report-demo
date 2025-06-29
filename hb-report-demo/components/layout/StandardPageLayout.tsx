import React from "react"
import { AppHeader } from "@/components/layout/app-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface StandardPageLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  badges?: Array<{
    label: string
    variant?: "default" | "secondary" | "destructive" | "outline"
    className?: string
  }>
  className?: string
  headerContent?: React.ReactNode
}

export function StandardPageLayout({
  children,
  title,
  description,
  breadcrumbs = [],
  actions,
  badges = [],
  className = "",
  headerContent,
}: StandardPageLayoutProps) {
  return (
    <>
      <AppHeader />
      <div className={`space-y-6 p-6 ${className}`}>
        {/* Breadcrumb Navigation */}
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {breadcrumb.href ? (
                      <BreadcrumbLink href={breadcrumb.href} className="flex items-center gap-1">
                        {breadcrumb.icon}
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="flex items-center gap-1">
                        {breadcrumb.icon}
                        {breadcrumb.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              {description && (
                <p className="text-muted-foreground mt-1">{description}</p>
              )}
              {badges.length > 0 && (
                <div className="flex items-center gap-4 mt-2">
                  {badges.map((badge, index) => (
                    <Badge
                      key={index}
                      variant={badge.variant || "outline"}
                      className={`px-3 py-1 ${badge.className || ""}`}
                    >
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </div>
          {headerContent}
        </div>

        {/* Main Content */}
        {children}
      </div>
    </>
  )
}

// Helper function to create standard dashboard breadcrumbs
export function createDashboardBreadcrumbs(currentPage: string, parentPath?: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-3 w-3" />,
    },
  ]

  if (parentPath) {
    breadcrumbs.push({
      label: parentPath,
      href: `/${parentPath.toLowerCase().replace(/\s+/g, "-")}`,
    })
  }

  breadcrumbs.push({
    label: currentPage,
  })

  return breadcrumbs
}

// Helper function to create standard pre-construction breadcrumbs
export function createPreconBreadcrumbs(currentPage: string): BreadcrumbItem[] {
  return [
    {
      label: "Pre-Construction",
      href: "/pre-con",
      icon: <Home className="h-3 w-3" />,
    },
    {
      label: currentPage,
    },
  ]
} 