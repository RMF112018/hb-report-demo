import type { Meta, StoryObj } from "@storybook/react"
import { ReportHistory } from "../../components/reports/report-history"
import { mockReports } from "../../public/data/mock-reports.json"

const meta: Meta<typeof ReportHistory> = {
  title: "Reports/ReportHistory",
  component: ReportHistory,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Historical view of all reports with filtering, searching, and timeline visualization.",
      },
    },
  },
  argTypes: {
    userRole: {
      control: "select",
      options: ["PM", "PX", "Executive"],
      description: "User role determining visible reports and actions",
    },
    projectId: {
      control: "text",
      description: "Filter reports by specific project (optional)",
    },
    timeRange: {
      control: "select",
      options: ["7d", "30d", "90d", "1y", "all"],
      description: "Time range filter for report history",
    },
  },
}

export default meta
type Story = StoryObj<typeof ReportHistory>

// PM Project History
export const PMProjectHistory: Story = {
  args: {
    userRole: "PM",
    userId: "user-001",
    projectId: "proj-001",
    reports: mockReports.reports.filter((r) => r.projectId === "proj-001"),
    timeRange: "90d",
  },
  parameters: {
    docs: {
      description: {
        story: "PM viewing history of reports for their assigned project.",
      },
    },
  },
}

// PX Multi-Project Overview
export const PXMultiProjectOverview: Story = {
  args: {
    userRole: "PX",
    userId: "user-005",
    reports: mockReports.reports.filter((r) => r.approverId === "user-005"),
    timeRange: "30d",
    showApprovalMetrics: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Project Executive viewing approval history across multiple projects.",
      },
    },
  },
}

// Executive Company-Wide View
export const ExecutiveCompanyWideView: Story = {
  args: {
    userRole: "Executive",
    userId: "user-008",
    reports: mockReports.reports,
    timeRange: "1y",
    showAnalytics: true,
    showTrends: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Executive viewing company-wide report history with analytics and trends.",
      },
    },
  },
}

// Filtered by Report Type
export const FilteredByReportType: Story = {
  args: {
    userRole: "PM",
    userId: "user-002",
    reports: mockReports.reports.filter((r) => r.type === "monthly-owner"),
    reportTypeFilter: "monthly-owner",
    timeRange: "90d",
  },
  parameters: {
    docs: {
      description: {
        story: "History view filtered to show only Monthly Owner reports.",
      },
    },
  },
}

// Search Results
export const SearchResults: Story = {
  args: {
    userRole: "PX",
    userId: "user-006",
    reports: mockReports.reports.filter(
      (r) => r.name.toLowerCase().includes("downtown") || r.projectName?.toLowerCase().includes("downtown"),
    ),
    searchQuery: "downtown",
    timeRange: "all",
  },
  parameters: {
    docs: {
      description: {
        story: 'History view showing search results for "downtown" across all reports.',
      },
    },
  },
}
