"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

/**
 * Loading component for Manpower Tracking page
 *
 * Provides skeleton loading states that match the main page layout:
 * - Header with title and action buttons
 * - Summary statistics cards
 * - Filter controls
 * - Main content area with tabs
 * - Data table/list skeleton
 *
 * @returns {JSX.Element} Loading skeleton interface
 */
export default function ManpowerTrackingLoading() {
  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Summary Statistics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 min-w-0">
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="grid w-full grid-cols-4 gap-1 bg-gray-100 p-1 rounded-lg">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>

        {/* Tab Content Skeleton */}
        <div className="space-y-4">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          </div>

          {/* Records List Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
