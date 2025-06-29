import type { Metadata } from "next"
import { Suspense } from "react"
import { ReportCustomizer } from "@/components/reports/report-customizer"

export const metadata: Metadata = {
  title: "Customize Report - HB Report",
  description: "Advanced report customization interface",
}

function ReportCustomizerWrapper() {
  return <ReportCustomizer />
}

export default function CustomizeReportPage() {
  return (
    <div className="min-h-screen bg-gray-50 container mx-auto px-6 py-8 space-y-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <ReportCustomizerWrapper />
      </Suspense>
    </div>
  )
}
