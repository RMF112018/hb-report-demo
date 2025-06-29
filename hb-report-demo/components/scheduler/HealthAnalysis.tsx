"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Eye,
  BarChart3,
  PieChart,
  Calendar,
  Link,
  Unlink,
  RefreshCw,
  Settings,
  FileText,
  Search,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface HealthAnalysisProps {
  userRole: string;
  projectData: any;
}

// Schedule Health Scoring Data
const healthScoreData = [
  { category: "Logic Integrity", score: 92, maxScore: 100, status: "excellent" },
  { category: "Constraint Validity", score: 87, maxScore: 100, status: "good" },
  { category: "Duration Reasonableness", score: 78, maxScore: 100, status: "fair" },
  { category: "Resource Loading", score: 85, maxScore: 100, status: "good" },
  { category: "Calendar Compliance", score: 94, maxScore: 100, status: "excellent" },
  { category: "Progress Integrity", score: 89, maxScore: 100, status: "good" },
];

// Logic Issues Data
const logicIssuesData = [
  {
    id: "LI001",
    severity: "high",
    type: "Missing Predecessor",
    activity: "MEP Rough-in Level 3",
    description: "Activity has no predecessor relationships defined",
    impact: "Critical path calculation error",
    recommendation: "Add logical tie to 'Structural Complete Level 3'"
  },
  {
    id: "LI002", 
    severity: "medium",
    type: "Redundant Logic",
    activity: "Drywall Installation",
    description: "Multiple redundant finish-to-start relationships",
    impact: "Schedule inflation and complexity",
    recommendation: "Remove redundant ties, keep most critical path"
  },
  {
    id: "LI003",
    severity: "high",
    type: "Logic Loop",
    activity: "MEP Coordination",
    description: "Circular dependency detected in coordination activities",
    impact: "Schedule calculation failure",
    recommendation: "Break loop by removing circular relationship"
  },
  {
    id: "LI004",
    severity: "low",
    type: "Unusual Lag",
    activity: "Concrete Cure Wait",
    description: "28-day lag seems excessive for this activity type",
    impact: "Potential schedule delay",
    recommendation: "Verify cure time requirements with engineering"
  },
];

// Constraints & Gaps Analysis
const constraintsData = [
  {
    type: "Hard Constraint",
    count: 12,
    issues: 2,
    description: "Must finish by dates that may be unrealistic"
  },
  {
    type: "Resource Constraint",
    count: 8,
    issues: 1,
    description: "Activities constrained by resource availability"
  },
  {
    type: "External Dependency",
    count: 15,
    issues: 3,
    description: "Dependencies on external parties or approvals"
  },
  {
    type: "Calendar Exception",
    count: 6,
    issues: 0,
    description: "Special calendar rules and exceptions"
  },
];

// Duration Analysis Data
const durationAnalysisData = [
  { range: "< 1 day", count: 45, percentage: 12, concern: "low" },
  { range: "1-5 days", count: 156, percentage: 42, concern: "optimal" },
  { range: "6-20 days", count: 98, percentage: 26, concern: "optimal" },
  { range: "21-60 days", count: 67, percentage: 18, concern: "review" },
  { range: "> 60 days", count: 8, percentage: 2, concern: "high" },
];

// Health Trends Data
const healthTrendsData = [
  { period: "Week 1", logicHealth: 85, constraintHealth: 90, durationHealth: 82 },
  { period: "Week 2", logicHealth: 88, constraintHealth: 87, durationHealth: 85 },
  { period: "Week 3", logicHealth: 92, constraintHealth: 89, durationHealth: 78 },
  { period: "Week 4", logicHealth: 90, constraintHealth: 91, durationHealth: 81 },
  { period: "Week 5", logicHealth: 93, constraintHealth: 88, durationHealth: 83 },
  { period: "Week 6", logicHealth: 92, constraintHealth: 87, durationHealth: 78 },
];

// Activities with Issues
const activitiesWithIssues = [
  {
    id: "A1024",
    name: "MEP Coordination Level 3",
    issues: ["Missing Predecessor", "Unusual Duration"],
    severity: "high",
    daysImpact: 8,
    healthScore: 45
  },
  {
    id: "A1156",
    name: "Structural Steel Erection", 
    issues: ["Resource Overallocation"],
    severity: "medium",
    daysImpact: 3,
    healthScore: 72
  },
  {
    id: "A1289",
    name: "Foundation Cure Period",
    issues: ["Excessive Duration", "Hard Constraint"],
    severity: "medium",
    daysImpact: 5,
    healthScore: 68
  },
  {
    id: "A1445",
    name: "Permit Approval Wait",
    issues: ["Missing Logic", "External Dependency"],
    severity: "high",
    daysImpact: 12,
    healthScore: 38
  },
];

const issueTypeColors = {
  "Missing Predecessor": "#ef4444",
  "Logic Loop": "#dc2626", 
  "Redundant Logic": "#f59e0b",
  "Unusual Lag": "#eab308",
  "Unusual Duration": "#f59e0b",
  "Resource Overallocation": "#3b82f6",
  "Hard Constraint": "#8b5cf6",
  "External Dependency": "#06b6d4",
  "Missing Logic": "#ef4444"
};

export default function HealthAnalysis({ userRole, projectData }: HealthAnalysisProps) {
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
    if (score >= 80) return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
    return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
  };

  const getHealthStatus = (score: number) => {
    if (score >= 90) return "excellent";
    if (score >= 80) return "good";
    if (score >= 70) return "fair";
    return "poor";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return <XCircle className="h-4 w-4" />;
      case "medium": return <AlertTriangle className="h-4 w-4" />;
      case "low": return <Clock className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const overallHealthScore = Math.round(
    healthScoreData.reduce((sum, item) => sum + item.score, 0) / healthScoreData.length
  );

  const filteredIssues = logicIssuesData.filter(issue => {
    const matchesSeverity = selectedSeverity === "all" || issue.severity === selectedSeverity;
    const matchesSearch = issue.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30" data-tour="health-overall-score">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Schedule Health Score
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of schedule logic, constraints, and structural integrity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
              <div 
                className="absolute inset-0 w-32 h-32 rounded-full border-8 border-blue-600 border-t-transparent"
                style={{
                  background: `conic-gradient(from 0deg, #3b82f6 ${overallHealthScore * 3.6}deg, transparent ${overallHealthScore * 3.6}deg)`
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{overallHealthScore}</div>
                  <div className="text-sm text-muted-foreground">Health Score</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {healthScoreData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className={`text-sm px-2 py-1 rounded ${getHealthColor(item.score)}`}>
                    {item.score}%
                  </span>
                </div>
                <Progress value={item.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tabs */}
      <Tabs defaultValue="logic-issues" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logic-issues" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Logic Issues
          </TabsTrigger>
          <TabsTrigger value="constraints" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Constraints
          </TabsTrigger>
          <TabsTrigger value="durations" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Durations
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logic-issues" className="space-y-6">
          {/* Controls */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search activities or issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select 
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Analysis
            </Button>
          </div>

          {/* Logic Issues Table */}
          <Card data-tour="health-logic-issues">
            <CardHeader>
              <CardTitle>Schedule Logic Issues ({filteredIssues.length})</CardTitle>
              <CardDescription>
                Detailed analysis of logical inconsistencies and structural problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-mono text-sm">{issue.id}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(issue.severity)}>
                          {getSeverityIcon(issue.severity)}
                          <span className="ml-1">{issue.severity}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" style={{ borderColor: issueTypeColors[issue.type as keyof typeof issueTypeColors] }}>
                          {issue.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{issue.activity}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm">{issue.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Impact: {issue.impact}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          {issue.recommendation}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Activities with Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Activities Requiring Attention</CardTitle>
              <CardDescription>
                Activities with multiple issues or significant health concerns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activitiesWithIssues.map((activity, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{activity.name}</h4>
                        <p className="text-sm text-muted-foreground">ID: {activity.id}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">Health Score</div>
                          <div className={`text-lg font-bold ${
                            activity.healthScore >= 70 ? 'text-green-600' :
                            activity.healthScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {activity.healthScore}%
                          </div>
                        </div>
                        <Badge className={getSeverityColor(activity.severity)}>
                          {activity.severity}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {activity.issues.map((issue, issueIndex) => (
                        <Badge 
                          key={issueIndex} 
                          variant="outline"
                          style={{ borderColor: issueTypeColors[issue as keyof typeof issueTypeColors] }}
                        >
                          {issue}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Estimated impact: {activity.daysImpact} days delay potential
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="constraints" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Constraint Analysis</CardTitle>
                <CardDescription>
                  Review of schedule constraints and their validity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {constraintsData.map((constraint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{constraint.type}</h4>
                        <p className="text-sm text-muted-foreground">{constraint.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{constraint.count}</span>
                          {constraint.issues > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {constraint.issues} issues
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Constraint Impact Analysis</CardTitle>
                <CardDescription>
                  Visual breakdown of constraint types and their frequency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={constraintsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      nameKey="type"
                      label={(entry) => entry.count}
                    >
                      {constraintsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 90}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="durations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Duration Analysis</CardTitle>
              <CardDescription>
                Analysis of activity duration reasonableness and distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={durationAnalysisData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`${value} activities`, "Count"]}
                    labelFormatter={(label) => `Duration Range: ${label}`}
                  />
                  <Bar 
                    dataKey="count" 
                    fill={(entry) => {
                      switch (entry?.concern) {
                        case "high": return "#ef4444";
                        case "review": return "#f59e0b";
                        case "optimal": return "#10b981";
                        default: return "#3b82f6";
                      }
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {durationAnalysisData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{item.range}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.count}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        item.concern === "high" ? "bg-red-500" :
                        item.concern === "review" ? "bg-yellow-500" :
                        item.concern === "optimal" ? "bg-green-500" : "bg-blue-500"
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Trend Analysis</CardTitle>
              <CardDescription>
                Schedule health metrics over time showing improvement areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={healthTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="period" />
                  <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="logicHealth" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Logic Health"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="constraintHealth" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Constraint Health"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="durationHealth" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    name="Duration Health"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 dark:text-green-400">Improving</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Logic integrity up 8%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Calendar compliance steady</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-600 dark:text-yellow-400">Stable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Constraint health maintaining</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Resource loading consistent</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Needs Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Duration health declining</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">More long-duration activities</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 