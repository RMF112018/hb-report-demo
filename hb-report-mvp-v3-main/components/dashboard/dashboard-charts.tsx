"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Project } from "@/types"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

interface DashboardChartsProps {
  projects: Project[]
  userRole: string
}

export function DashboardCharts({ projects, userRole }: DashboardChartsProps) {
  // Prepare data for charts
  const statusData = projects.reduce(
    (acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    status,
    count,
    value: count,
  }))

  const valueByCity = projects.reduce(
    (acc, project) => {
      acc[project.city] = (acc[project.city] || 0) + project.contractValue
      return acc
    },
    {} as Record<string, number>,
  )

  const cityChartData = Object.entries(valueByCity).map(([city, value]) => ({
    city,
    value: value / 1000000, // Convert to millions
  }))

  // Mock cost variance data
  const costVarianceData = projects.map((project) => ({
    name: project.name.substring(0, 15) + "...",
    budget: project.contractValue / 1000000,
    actual: (project.contractValue * (0.95 + Math.random() * 0.1)) / 1000000, // Mock actual costs
    variance: (project.contractValue * (0.95 + Math.random() * 0.1) - project.contractValue) / 1000000,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  // Role-based chart visibility
  const showExecutiveCharts = userRole === "c-suite" || userRole === "project-executive"
  const showDetailedCharts = userRole === "project-manager"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Project Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Project Status Distribution</CardTitle>
          <CardDescription>Overview of project statuses across portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Contract Value by City */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Value by Location</CardTitle>
          <CardDescription>Total contract value distribution by city (in millions)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}M`, "Contract Value"]} />
              <Bar dataKey="value" fill="#003087" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cost Variance Analysis - Executive Level */}
      {showExecutiveCharts && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cost Variance Analysis</CardTitle>
            <CardDescription>Budget vs actual costs across projects (in millions)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costVarianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}M`, ""]} />
                <Legend />
                <Bar dataKey="budget" fill="#003087" name="Budget" />
                <Bar dataKey="actual" fill="#FF6B35" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Project Timeline - Manager Level */}
      {showDetailedCharts && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Timeline Overview</CardTitle>
            <CardDescription>Project progress and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={projects.map((p) => ({
                  name: p.name.substring(0, 15) + "...",
                  progress: Math.floor(Math.random() * 100),
                  planned: Math.floor(Math.random() * 100),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="progress" stroke="#00C49F" name="Actual Progress" />
                <Line type="monotone" dataKey="planned" stroke="#0088FE" name="Planned Progress" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
