import type { Metadata } from "next"
import { ProjectReportsHub } from "@/components/reports/project-reports-hub"

export const metadata: Metadata = {
  title: "Project Reports - HB Report",
  description: "Central hub for report customization, generation, and management",
}

export default function ProjectReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectReportsHub />
    </div>
  )
}
