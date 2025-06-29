"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, Share2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const reportHistory = [
  {
    id: "rpt-001",
    name: "Weekly Progress Report - Week 3",
    type: "Progress",
    project: "Downtown Office Complex",
    createdBy: "John Smith",
    createdAt: "2024-01-15 14:30",
    status: "Completed",
    size: "2.4 MB",
  },
  {
    id: "rpt-002",
    name: "Financial Summary - Q1",
    type: "Financial",
    project: "Residential Tower A",
    createdBy: "Sarah Johnson",
    createdAt: "2024-01-14 09:15",
    status: "Completed",
    size: "1.8 MB",
  },
  {
    id: "rpt-003",
    name: "Safety Compliance Report",
    type: "Safety",
    project: "Industrial Warehouse",
    createdBy: "Mike Davis",
    createdAt: "2024-01-13 16:45",
    status: "Completed",
    size: "3.1 MB",
  },
  {
    id: "rpt-004",
    name: "Schedule Analysis - January",
    type: "Schedule",
    project: "Downtown Office Complex",
    createdBy: "Emily Chen",
    createdAt: "2024-01-12 11:20",
    status: "Processing",
    size: "1.2 MB",
  },
  {
    id: "rpt-005",
    name: "Monthly Executive Summary",
    type: "Executive",
    project: "All Projects",
    createdBy: "David Wilson",
    createdAt: "2024-01-11 08:00",
    status: "Completed",
    size: "4.5 MB",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Completed":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Completed
        </Badge>
      )
    case "Processing":
      return (
        <Badge variant="default" className="bg-yellow-100 text-yellow-800">
          Processing
        </Badge>
      )
    case "Failed":
      return <Badge variant="destructive">Failed</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function ReportHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report History</CardTitle>
        <CardDescription>View and manage previously generated reports</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportHistory.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{report.type}</Badge>
                </TableCell>
                <TableCell>{report.project}</TableCell>
                <TableCell>{report.createdBy}</TableCell>
                <TableCell>{report.createdAt}</TableCell>
                <TableCell>{getStatusBadge(report.status)}</TableCell>
                <TableCell>{report.size}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
