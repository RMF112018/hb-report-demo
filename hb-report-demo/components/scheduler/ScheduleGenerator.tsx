"use client";

import { useState } from "react";
import {
  Zap,
  Brain,
  Wand2,
  Settings,
  Download,
  Upload,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  FileText,
  Save,
  Play,
  Pause,
  RotateCcw,
  Eye,
  BarChart3,
  Activity,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ScheduleGeneratorProps {
  userRole: string;
  projectData: any;
}

// Project Generation Form State
interface ProjectForm {
  name: string;
  description: string;
  projectType: string;
  complexity: string;
  startDate: string;
  duration: number;
  budget: number;
  teamSize: number;
  location: string;
  weatherDependent: boolean;
  criticalDeadline: boolean;
  mustFinishBy: string;
}

// Generation Options
interface GenerationOptions {
  optimizeFor: string;
  includeBuffer: boolean;
  bufferPercentage: number;
  considerWeather: boolean;
  resourceLeveling: boolean;
  prioritizeCriticalPath: boolean;
  includeRisks: boolean;
  detailLevel: string;
}

// Mock AI Generation Progress
const generationSteps = [
  { step: "Analyzing project requirements", status: "completed", duration: "2s" },
  { step: "Applying historical data patterns", status: "completed", duration: "5s" },
  { step: "Generating activity breakdown", status: "completed", duration: "8s" },
  { step: "Optimizing logic relationships", status: "in-progress", duration: "12s" },
  { step: "Resource allocation optimization", status: "pending", duration: "6s" },
  { step: "Risk analysis integration", status: "pending", duration: "4s" },
  { step: "Final schedule validation", status: "pending", duration: "3s" },
];

// Mock Generated Schedule Preview
const generatedActivities = [
  {
    id: "GEN001",
    name: "Site Preparation & Mobilization",
    duration: 5,
    type: "Mobilization",
    resources: ["Site Supervisor", "Equipment Operator"],
    cost: 15000,
    criticalPath: true,
    confidence: 95
  },
  {
    id: "GEN002", 
    name: "Foundation Excavation",
    duration: 8,
    type: "Earthwork",
    resources: ["Excavator", "Survey Crew"],
    cost: 45000,
    criticalPath: true,
    confidence: 92
  },
  {
    id: "GEN003",
    name: "Foundation Pour",
    duration: 12,
    type: "Concrete",
    resources: ["Concrete Crew", "Pump Operator"],
    cost: 85000,
    criticalPath: true,
    confidence: 88
  },
  {
    id: "GEN004",
    name: "Structural Steel Erection", 
    duration: 20,
    type: "Steel",
    resources: ["Iron Workers", "Crane Operator"],
    cost: 125000,
    criticalPath: true,
    confidence: 85
  }
];

// Mock AI Insights
const aiInsights = [
  {
    type: "optimization",
    title: "Duration Optimization",
    description: "AI identified opportunity to reduce project duration by 15 days through parallel activities",
    impact: "15 days saved",
    confidence: 87
  },
  {
    type: "risk",
    title: "Weather Risk Mitigation",
    description: "Recommended weather buffers added to outdoor activities based on historical data",
    impact: "23% risk reduction",
    confidence: 91
  },
  {
    type: "cost", 
    title: "Resource Efficiency",
    description: "Optimized resource allocation to reduce overall project cost while maintaining timeline",
    impact: "$47,000 savings",
    confidence: 83
  }
];

// Export Format Options
const exportFormats = [
  { value: "xer", label: "Primavera P6 (.xer)", description: "Native P6 format with full data" },
  { value: "mpp", label: "Microsoft Project (.mpp)", description: "Compatible with MS Project" },
  { value: "xml", label: "Project XML (.xml)", description: "Universal project exchange format" },
  { value: "csv", label: "CSV Data (.csv)", description: "Tabular data format" },
];

export default function ScheduleGenerator({ userRole, projectData }: ScheduleGeneratorProps) {
  const [currentTab, setCurrentTab] = useState("setup");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [projectForm, setProjectForm] = useState<ProjectForm>({
    name: "",
    description: "",
    projectType: "",
    complexity: "",
    startDate: "",
    duration: 365,
    budget: 0,
    teamSize: 10,
    location: "",
    weatherDependent: false,
    criticalDeadline: false,
    mustFinishBy: ""
  });

  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
    optimizeFor: "balanced",
    includeBuffer: true,
    bufferPercentage: 10,
    considerWeather: true,
    resourceLeveling: true,
    prioritizeCriticalPath: true,
    includeRisks: true,
    detailLevel: "standard"
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    setCurrentTab("generation");
    
    // Simulate AI generation process
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsGenerating(false);
        setCurrentTab("results");
      }
      setGenerationProgress(progress);
    }, 1000);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress": return <Activity className="h-4 w-4 text-blue-600 animate-pulse" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "optimization": return <TrendingUp className="h-5 w-5 text-green-600" />;
      case "risk": return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "cost": return <DollarSign className="h-5 w-5 text-blue-600" />;
      default: return <Brain className="h-5 w-5 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            HBI Schedule Generator
          </CardTitle>
          <CardDescription>
            AI-powered construction schedule generation with machine learning optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/60 dark:bg-black/60 rounded-lg">
              <Brain className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium">AI Models</div>
              <div className="text-xs text-muted-foreground">Neural Networks</div>
            </div>
            <div className="text-center p-3 bg-white/60 dark:bg-black/60 rounded-lg">
              <BarChart3 className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">Data Sources</div>
              <div className="text-xs text-muted-foreground">1,247 Projects</div>
            </div>
            <div className="text-center p-3 bg-white/60 dark:bg-black/60 rounded-lg">
              <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium">Accuracy</div>
              <div className="text-xs text-muted-foreground">94.2% Average</div>
            </div>
            <div className="text-center p-3 bg-white/60 dark:bg-black/60 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-sm font-medium">Generation</div>
              <div className="text-xs text-muted-foreground">~45 seconds</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Setup
          </TabsTrigger>
          <TabsTrigger value="options" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Options
          </TabsTrigger>
          <TabsTrigger value="generation" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Generation
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>

        {/* Project Setup */}
        <TabsContent value="setup" className="space-y-6">
          <Card data-tour="generator-project-setup">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>
                Provide basic project details for AI schedule generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input 
                    id="project-name"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <Label htmlFor="project-type">Project Type</Label>
                  <Select onValueChange={(value) => setProjectForm({...projectForm, projectType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial Building</SelectItem>
                      <SelectItem value="residential">Residential Complex</SelectItem>
                      <SelectItem value="industrial">Industrial Facility</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="renovation">Renovation/Remodel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="complexity">Project Complexity</Label>
                  <Select onValueChange={(value) => setProjectForm({...projectForm, complexity: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Standard construction</SelectItem>
                      <SelectItem value="medium">Medium - Some specialized work</SelectItem>
                      <SelectItem value="high">High - Complex systems/design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    value={projectForm.location}
                    onChange={(e) => setProjectForm({...projectForm, location: e.target.value})}
                    placeholder="Project location"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea 
                  id="description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  placeholder="Describe the project scope and key requirements"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input 
                    id="start-date"
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Target Duration (days)</Label>
                  <Input 
                    id="duration"
                    type="number"
                    value={projectForm.duration}
                    onChange={(e) => setProjectForm({...projectForm, duration: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input 
                    id="budget"
                    type="number"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm({...projectForm, budget: parseInt(e.target.value)})}
                    placeholder="Total project budget"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Team Size: {projectForm.teamSize} people</Label>
                  <Slider
                    value={[projectForm.teamSize]}
                    onValueChange={(value) => setProjectForm({...projectForm, teamSize: value[0]})}
                    max={50}
                    min={5}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="weather-dependent"
                      checked={projectForm.weatherDependent}
                      onCheckedChange={(checked) => setProjectForm({...projectForm, weatherDependent: checked as boolean})}
                    />
                    <Label htmlFor="weather-dependent">Weather dependent activities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="critical-deadline"
                      checked={projectForm.criticalDeadline}
                      onCheckedChange={(checked) => setProjectForm({...projectForm, criticalDeadline: checked as boolean})}
                    />
                    <Label htmlFor="critical-deadline">Critical completion deadline</Label>
                  </div>
                </div>

                {projectForm.criticalDeadline && (
                  <div>
                    <Label htmlFor="must-finish-by">Must Finish By</Label>
                    <Input 
                      id="must-finish-by"
                      type="date"
                      value={projectForm.mustFinishBy}
                      onChange={(e) => setProjectForm({...projectForm, mustFinishBy: e.target.value})}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generation Options */}
        <TabsContent value="options" className="space-y-6">
          <Card data-tour="generator-optimization">
            <CardHeader>
              <CardTitle>AI Generation Options</CardTitle>
              <CardDescription>
                Configure how the AI should optimize and generate your schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Optimize For</Label>
                  <Select value={generationOptions.optimizeFor} onValueChange={(value) => 
                    setGenerationOptions({...generationOptions, optimizeFor: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time">Time - Shortest duration</SelectItem>
                      <SelectItem value="cost">Cost - Lowest total cost</SelectItem>
                      <SelectItem value="quality">Quality - Best practices</SelectItem>
                      <SelectItem value="balanced">Balanced - Optimal mix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Detail Level</Label>
                  <Select value={generationOptions.detailLevel} onValueChange={(value) => 
                    setGenerationOptions({...generationOptions, detailLevel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High - Detailed activities</SelectItem>
                      <SelectItem value="standard">Standard - Normal detail</SelectItem>
                      <SelectItem value="summary">Summary - High level only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Include Schedule Buffer</Label>
                    <p className="text-sm text-muted-foreground">Add contingency time to activities</p>
                  </div>
                  <Checkbox 
                    checked={generationOptions.includeBuffer}
                    onCheckedChange={(checked) => 
                      setGenerationOptions({...generationOptions, includeBuffer: checked as boolean})}
                  />
                </div>

                {generationOptions.includeBuffer && (
                  <div>
                    <Label>Buffer Percentage: {generationOptions.bufferPercentage}%</Label>
                    <Slider
                      value={[generationOptions.bufferPercentage]}
                      onValueChange={(value) => 
                        setGenerationOptions({...generationOptions, bufferPercentage: value[0]})}
                      max={25}
                      min={5}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weather Considerations</Label>
                      <p className="text-sm text-muted-foreground">Factor in weather delays</p>
                    </div>
                    <Checkbox 
                      checked={generationOptions.considerWeather}
                      onCheckedChange={(checked) => 
                        setGenerationOptions({...generationOptions, considerWeather: checked as boolean})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Resource Leveling</Label>
                      <p className="text-sm text-muted-foreground">Smooth resource allocation</p>
                    </div>
                    <Checkbox 
                      checked={generationOptions.resourceLeveling}
                      onCheckedChange={(checked) => 
                        setGenerationOptions({...generationOptions, resourceLeveling: checked as boolean})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Prioritize Critical Path</Label>
                      <p className="text-sm text-muted-foreground">Focus on critical activities</p>
                    </div>
                    <Checkbox 
                      checked={generationOptions.prioritizeCriticalPath}
                      onCheckedChange={(checked) => 
                        setGenerationOptions({...generationOptions, prioritizeCriticalPath: checked as boolean})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Risk Analysis</Label>
                      <p className="text-sm text-muted-foreground">Generate risk assessments</p>
                    </div>
                    <Checkbox 
                      checked={generationOptions.includeRisks}
                      onCheckedChange={(checked) => 
                        setGenerationOptions({...generationOptions, includeRisks: checked as boolean})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleGenerate} className="px-8">
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generation Progress */}
        <TabsContent value="generation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
                AI Schedule Generation in Progress
              </CardTitle>
              <CardDescription>
                Advanced algorithms are analyzing your project and generating an optimized schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Overall Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">{Math.round(generationProgress)}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-3" />
                </div>

                {/* Generation Steps */}
                <div className="space-y-3">
                  {generationSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      {getStepIcon(step.status)}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{step.step}</div>
                        <div className="text-xs text-muted-foreground">
                          {step.status === "completed" ? `Completed in ${step.duration}` :
                           step.status === "in-progress" ? "Processing..." :
                           `Estimated ${step.duration}`}
                        </div>
                      </div>
                      {step.status === "in-progress" && (
                        <Activity className="h-4 w-4 text-blue-600 animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Live Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-muted-foreground">Training Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">94.2%</div>
                    <div className="text-sm text-muted-foreground">Model Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">47s</div>
                    <div className="text-sm text-muted-foreground">Avg Generation Time</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results */}
        <TabsContent value="results" className="space-y-6">
          {/* AI Insights */}
          <div className="grid gap-4 md:grid-cols-3">
            {aiInsights.map((insight, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {getInsightIcon(insight.type)}
                    {insight.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{insight.impact}</Badge>
                    <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Generated Schedule Preview */}
          <Card data-tour="generator-results">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Schedule Preview</CardTitle>
                  <CardDescription>
                    AI-generated schedule with {generatedActivities.length} activities
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Full Schedule
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedActivities.map((activity, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{activity.name}</h4>
                        <p className="text-sm text-muted-foreground">ID: {activity.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {activity.criticalPath && (
                          <Badge variant="destructive" className="text-xs">Critical</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {activity.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="ml-2 font-medium">{activity.duration} days</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-2 font-medium">{activity.type}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cost:</span>
                        <span className="ml-2 font-medium">${activity.cost.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Resources:</span>
                        <span className="ml-2 font-medium">{activity.resources.length}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1">Resources:</div>
                      <div className="flex gap-1 flex-wrap">
                        {activity.resources.map((resource, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-green-600" />
                Export Generated Schedule
              </CardTitle>
              <CardDescription>
                Download the AI-generated schedule in your preferred format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {exportFormats.map((format, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{format.label}</h4>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{format.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button className="px-8">
                  <Save className="h-4 w-4 mr-2" />
                  Save to Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 