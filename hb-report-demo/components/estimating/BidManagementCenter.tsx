"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Handshake, 
  FileText, 
  Users, 
  Building2,
  Zap,
  Wrench
} from 'lucide-react'

interface BidManagementCenterProps {
  userRole: string
}

export function BidManagementCenter({ userRole }: BidManagementCenterProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-800">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <Handshake className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            Bid Management Center
          </CardTitle>
          <p className="text-blue-700 dark:text-blue-300 mt-2">
            Advanced bid management, RFP processing, and vendor relationship tools
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white/50 dark:bg-gray-900/50 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">RFP Management</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Create, distribute, and track RFPs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-gray-900/50 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Vendor Relations</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Manage vendor performance and relationships
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-gray-900/50 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Bid Evaluation</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Advanced bid analysis and selection tools
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-4 py-2">
              <Wrench className="h-4 w-4 mr-2" />
              Coming Soon
            </Badge>
            <p className="text-muted-foreground">
              The Bid Management Center is currently under development. This comprehensive module will include:
            </p>
            <div className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                RFP creation and distribution workflow
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Automated bid comparison tools
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                Vendor performance tracking
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                Risk assessment and evaluation
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Contract management integration
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                Real-time bid status tracking
              </div>
            </div>
            <Button className="mt-6" disabled>
              <Zap className="h-4 w-4 mr-2" />
              Request Early Access
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BidManagementCenter 