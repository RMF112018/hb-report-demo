"use client"

import React from "react"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useCallback } from "react"

// Create a separate component for handling search params
function SearchParamsHandler({ onParamsChange }: { onParamsChange: (params: URLSearchParams) => void }) {
  const searchParams = useSearchParams()

  React.useEffect(() => {
    onParamsChange(searchParams)
  }, [searchParams, onParamsChange])

  return null
}

// Update the main ReportCustomizer component to use the SearchParamsHandler
export function ReportCustomizer() {
  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null)

  const handleParamsChange = useCallback((params: URLSearchParams) => {
    setUrlParams(params)
  }, [])

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <SearchParamsHandler onParamsChange={handleParamsChange} />
      </Suspense>

      {/* Rest of the component remains the same, but use urlParams instead of direct useSearchParams */}
      {/* ... existing component code ... */}
    </div>
  )
}
