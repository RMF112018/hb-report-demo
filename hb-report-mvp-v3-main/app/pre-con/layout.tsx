import type React from "react"

export default function PreConLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 relative">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
