"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Brain, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  BarChart3,
  Zap,
  Lightbulb,
  Wrench,
  Activity,
  Eye,
  CheckCircle
} from 'lucide-react'

interface EstimatingIntelligenceProps {
  userRole: string
  estimatingData?: any[]
  projectsData?: any[]
}

export function EstimatingIntelligence({ userRole, estimatingData = [], projectsData = [] }: EstimatingIntelligenceProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900 border-purple-200 dark:border-purple-800">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            HBI Estimating Intelligence
          </CardTitle>
          <p className="text-purple-700 dark:text-purple-300 mt-2">
            AI-powered insights, predictive analytics, and smart recommendations for construction estimating
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white/50 dark:bg-gray-900/50 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Predictive Analytics</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  AI-driven cost forecasting and trends
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-gray-900/50 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Accuracy Optimization</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Smart recommendations to improve estimates
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-gray-900/50 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Risk Assessment</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Automated risk identification and mitigation
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-gray-900/50 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Market Intelligence</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Real-time market data and pricing trends
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-gray-900/50 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <Activity className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Performance Tracking</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Continuous learning from project outcomes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-gray-900/50 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <Lightbulb className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Smart Insights</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Actionable recommendations and alerts
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
              HBI Estimating Intelligence is currently under development. This AI-powered module will provide:
            </p>
            <div className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Machine learning-based cost predictions
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Historical data pattern recognition
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                Real-time market data integration
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                Automated variance analysis
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Risk factor identification
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                Continuous accuracy improvement
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full" />
                Smart benchmarking and comparisons
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full" />
                Predictive maintenance cost models
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span>Visual Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Accuracy Validation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Real-time Processing</span>
                </div>
              </div>
              
              <Button className="mt-4" disabled>
                <Brain className="h-4 w-4 mr-2" />
                Request Beta Access
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Intelligence Panels */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Sample Intelligence Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Cost Optimization</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Steel estimates trending 8% higher than historical averages. Consider adjusting pricing models.
              </p>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="font-medium text-sm">Accuracy Alert</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Concrete estimates show 95% accuracy - excellent performance maintained.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Predictive Analytics Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-sm">Trend Forecast</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on current data, Q2 estimates likely to be 12% more accurate with AI assistance.
              </p>
            </div>
            
            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-sm">Risk Analysis</span>
              </div>
              <p className="text-sm text-muted-foreground">
                3 projects flagged for potential cost overruns based on historical patterns.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EstimatingIntelligence 