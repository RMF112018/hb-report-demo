import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ResponsibilityMatrixLoading() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-10 w-64" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-12" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 p-6">
        {/* Tabs Skeleton */}
        <div className="flex space-x-1 mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-8 gap-4 pb-2 border-b">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Table Rows */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="grid grid-cols-8 gap-4 py-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-8" />
                  <Skeleton className="h-6 w-8" />
                  <Skeleton className="h-6 w-8" />
                  <Skeleton className="h-6 w-8" />
                  <Skeleton className="h-6 w-8" />
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
