"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import Image from "next/image" // Import Image component

/**
 * ComingSoonPage Component
 *
 * A generic placeholder page for features that are currently under development.
 * Displays a "Coming Soon" message with a clock icon, a title, a brief description,
 * and a placeholder graphic.
 * This component is designed to be a single destination for multiple unreleased features.
 *
 * @returns {JSX.Element} A card displaying a "Coming Soon" message and a graphic.
 */
export default function ComingSoonPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="flex flex-col items-center justify-center">
          <Clock className="mb-4 h-12 w-12 text-gray-500" />
          <CardTitle className="text-2xl font-bold">Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <CardDescription className="text-gray-600">
            This feature is currently under development and will be available in a future update. Stay tuned for
            exciting new functionalities!
          </CardDescription>
          {/* Placeholder graphic */}
          <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-200">
            <Image
              src="/placeholder.svg?height=192&width=384"
              alt="Feature under development"
              layout="fill"
              objectFit="cover"
              className="opacity-70"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
