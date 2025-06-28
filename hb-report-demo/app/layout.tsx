import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { AuthProvider } from "@/context/auth-context"
import { ProjectProvider } from "@/context/project-context"
import { TourProvider } from "@/context/tour-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Tour } from "@/components/ui/tour"
import { AppHeader } from '@/components/layout/app-header'
import { AppLayoutShell } from '@/components/layout/AppLayoutShell'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HB Report Platform | Hedrick Brothers Construction",
  description: "Advanced construction analytics and project management platform for Hedrick Brothers Construction",
  keywords: ["construction", "analytics", "project management", "reporting", "hedrick brothers"],
  authors: [{ name: "Hedrick Brothers Construction" }],
  creator: "Hedrick Brothers Construction",
  publisher: "Hedrick Brothers Construction",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://report.hedrickbrothers.com"),
  openGraph: {
    title: "HB Report Platform | Construction Analytics",
    description: "Advanced construction analytics and project management platform",
    url: "https://report.hedrickbrothers.com",
    siteName: "HB Report Platform",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <AuthProvider>
          <TourProvider>
            <ProjectProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <AppLayoutShell showHeader={false}>
                  {children}
                </AppLayoutShell>
                <Tour />
                <Toaster />
              </ThemeProvider>
            </ProjectProvider>
          </TourProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
