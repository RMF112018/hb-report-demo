"use client";

import { useState, useCallback } from "react";
import {
  Monitor,
  Upload,
  Download,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  FileText,
  RefreshCw,
  Eye,
  Settings,
  Filter,
  BarChart3,
  Activity,
  Target,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";
import { useDropzone } from 'react-dropzone';

interface ScheduleMonitorProps {
  userRole: string;
  projectData: any;
}

// Mock milestone comparison data
const milestoneComparisonData = [
  {
    milestone: "Foundation Complete",
    baseline: "2024-02-15",
    current: "2024-02-17",
    actual: "2024-02-16",
    variance: 1,
    status: "completed",
    criticality: "high"
  },
  {
    milestone: "Structure Complete",
    baseline: "2024-04-30",
    current: "2024-05-03",
    actual: null,
    variance: 3,
    status: "at-risk",
    criticality: "high"
  },
  {
    milestone: "MEP Rough Complete",
    baseline: "2024-07-15",
    current: "2024-07-18",
    actual: null,
    variance: 3,
    status: "on-track",
    criticality: "medium"
  },
  {
    milestone: "Substantial Completion",
    baseline: "2024-12-01",
    current: "2024-12-08",
    actual: null,
    variance: 7,
    status: "at-risk",
    criticality: "high"
  },
];

// Mock schedule comparison data
const scheduleComparisonData = [
  { period: "Week 1", current: 95, previous: 92, baseline: 90 },
  { period: "Week 2", current: 88, previous: 91, baseline: 85 },
  { period: "Week 3", current: 92, previous: 89, baseline: 88 },
  { period: "Week 4", current: 85, previous: 87, baseline: 82 },
  { period: "Week 5", current: 90, previous: 85, baseline: 86 },
  { period: "Week 6", current: 87, previous: 88, baseline: 84 },
];

// Mock float analysis data
const floatAnalysisData = [
  { activity: "Excavation", totalFloat: 5, freeFloat: 2, status: "safe" },
  { activity: "Foundation Pour", totalFloat: 0, freeFloat: 0, status: "critical" },
  { activity: "Steel Erection", totalFloat: 8, freeFloat: 5, status: "safe" },
  { activity: "MEP Layout", totalFloat: 2, freeFloat: 1, status: "near-critical" },
  { activity: "Drywall Install", totalFloat: 12, freeFloat: 8, status: "safe" },
];

// Mock delay analysis data
const delayAnalysisData = [
  {
    category: "Weather",
    impact: 8,
    frequency: 12,
    avgDuration: 2.3,
    trend: "increasing"
  },
  {
    category: "Material Delays",
    impact: 15,
    frequency: 8,
    avgDuration: 4.2,
    trend: "stable"
  },
  {
    category: "Labor Shortage",
    impact: 6,
    frequency: 5,
    avgDuration: 3.1,
    trend: "decreasing"
  },
  {
    category: "Design Changes",
    impact: 12,
    frequency: 7,
    avgDuration: 5.8,
    trend: "increasing"
  },
];

const acceptedFileTypes = ['.xer', '.mpp', '.xml', '.csv'];

export default function ScheduleMonitor({ userRole, projectData }: ScheduleMonitorProps) {
  const [selectedComparison, setSelectedComparison] = useState("current-vs-baseline");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("2024-06-15 10:30 AM");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    setIsProcessing(true);
    
    // Simulate file processing
    setTimeout(() => {
      setIsProcessing(false);
      setLastUpdate(new Date().toLocaleString());
    }, 3000);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/xml': ['.xml'],
      'text/csv': ['.csv'],
      'application/octet-stream': ['.xer', '.mpp'],
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "on-track": return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
      case "at-risk": return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30";
      case "critical": return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      case "near-critical": return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
      default: return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const getFloatStatusColor = (status: string) => {
    switch (status) {
      case "safe": return "text-green-600 dark:text-green-400";
      case "near-critical": return "text-yellow-600 dark:text-yellow-400";
      case "critical": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing": return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "decreasing": return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateVarianceDays = (baseline: string, current: string) => {
    const baselineDate = new Date(baseline);
    const currentDate = new Date(current);
    return Math.ceil((currentDate.getTime() - baselineDate.getTime()) / (1000 * 3600 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card data-tour="monitor-file-upload">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Schedule File Upload
          </CardTitle>
          <CardDescription>
            Upload schedule files (.xer, .mpp, .xml, .csv) for comparison and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' 
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              {isDragActive ? (
                <p className="text-blue-600">Drop files here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    Drag & drop schedule files here, or click to select
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Supported formats: {acceptedFileTypes.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* File List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Uploaded Files:</Label>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {(file.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Processing Status */}
            {isProcessing && (
              <div className="flex items-center gap-2 text-blue-600">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processing schedule files...</span>
              </div>
            )}

            {/* Last Update */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdate}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Controls */}
      <Card data-tour="monitor-comparison">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-green-600" />
            Schedule Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="comparison-type">Comparison Type</Label>
              <Select value={selectedComparison} onValueChange={setSelectedComparison}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-vs-baseline">Current vs Baseline</SelectItem>
                  <SelectItem value="current-vs-previous">Current vs Previous Update</SelectItem>
                  <SelectItem value="trend-analysis">Trend Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Schedule Performance Chart */}
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={scheduleComparisonData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                formatter={(value: number, name: string) => [`${value}%`, name]}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="#94a3b8" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Baseline"
              />
              <Line 
                type="monotone" 
                dataKey="previous" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Previous Update"
              />
              <Line 
                type="monotone" 
                dataKey="current" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Current Schedule"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="milestones" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="milestones" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Milestones
          </TabsTrigger>
          <TabsTrigger value="float" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Float Analysis
          </TabsTrigger>
          <TabsTrigger value="delays" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Delay Analysis
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Milestone Comparison</CardTitle>
              <CardDescription>
                Compare milestone dates across baseline, current schedule, and actuals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestoneComparisonData.map((milestone, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(milestone.status)}`}>
                          {milestone.status === "completed" ? <CheckCircle className="h-4 w-4" /> :
                           milestone.status === "at-risk" ? <AlertTriangle className="h-4 w-4" /> :
                           <Clock className="h-4 w-4" />}
                        </div>
                        <div>
                          <h4 className="font-medium">{milestone.milestone}</h4>
                          <Badge variant={milestone.criticality === "high" ? "destructive" : "secondary"} className="text-xs">
                            {milestone.criticality} priority
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          milestone.variance > 0 ? 'text-red-600' : 
                          milestone.variance < 0 ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {milestone.variance > 0 ? '+' : ''}{milestone.variance} days
                        </div>
                        <div className="text-xs text-muted-foreground">variance</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Baseline</div>
                        <div className="font-medium">{formatDate(milestone.baseline)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Current</div>
                        <div className="font-medium">{formatDate(milestone.current)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Actual</div>
                        <div className="font-medium">
                          {milestone.actual ? formatDate(milestone.actual) : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="float" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Float Analysis</CardTitle>
              <CardDescription>
                Critical path and float analysis for schedule optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {floatAnalysisData.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.status === "critical" ? "bg-red-500" :
                        activity.status === "near-critical" ? "bg-yellow-500" :
                        "bg-green-500"
                      }`} />
                      <div>
                        <h4 className="font-medium">{activity.activity}</h4>
                        <p className={`text-sm ${getFloatStatusColor(activity.status)}`}>
                          {activity.status.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{activity.totalFloat}</div>
                        <div className="text-muted-foreground">Total Float</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{activity.freeFloat}</div>
                        <div className="text-muted-foreground">Free Float</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delays" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delay Analysis</CardTitle>
              <CardDescription>
                Analysis of delay patterns and their impact on schedule performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {delayAnalysisData.map((delay, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{delay.category}</h4>
                      {getTrendIcon(delay.trend)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Impact Days:</span>
                        <span className="font-medium">{delay.impact}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Frequency:</span>
                        <span className="font-medium">{delay.frequency} instances</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Avg Duration:</span>
                        <span className="font-medium">{delay.avgDuration} days</span>
                      </div>
                      <div className="mt-2">
                        <Progress value={(delay.impact / 20) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Key Findings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">Performance Improvement</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Schedule performance has improved 12% over the last reporting period with better resource coordination.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900 dark:text-orange-100">Critical Path Extension</p>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      MEP coordination delays have extended the critical path by 8 days, impacting substantial completion.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">Early Milestones</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Foundation and structural work completed 2 days ahead of schedule due to favorable weather.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950/30">
                  <p className="font-medium text-purple-900 dark:text-purple-100">Resource Reallocation</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Shift 2 MEP coordinators from Level 1 to Level 3 to expedite critical coordination work.
                  </p>
                </div>
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30">
                  <p className="font-medium text-blue-900 dark:text-blue-100">Buffer Utilization</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Utilize 5-day weather buffer for MEP rough-in to maintain milestone dates.
                  </p>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/30">
                  <p className="font-medium text-green-900 dark:text-green-100">Proactive Measures</p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Schedule weekly BIM coordination meetings to prevent future delays in finish work phases.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 