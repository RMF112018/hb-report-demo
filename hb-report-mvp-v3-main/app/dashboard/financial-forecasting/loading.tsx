/**
 * Loading Component for Financial Forecasting Page
 *
 * Provides skeleton loading states while the main forecasting data is being fetched.
 * Includes placeholders for:
 * - Header section with navigation
 * - Summary metric cards
 * - Main data table/tree structure
 * - Action buttons and controls
 *
 * @component
 */
export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex space-x-1 border-b">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-32 bg-gray-200 rounded-t animate-pulse"></div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="border rounded-lg">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="grid grid-cols-12 gap-4 p-3 border rounded">
                      <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="col-span-1 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="col-span-1 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
