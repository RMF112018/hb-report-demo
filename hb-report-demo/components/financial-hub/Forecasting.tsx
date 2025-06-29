"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  TrendingUp,
  Bot,
  Settings,
  Download,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Target,
  BarChart3,
  Send,
  MessageSquare,
  Lightbulb,
  Brain,
  Maximize,
  Minimize,
  ChevronDown,
  ChevronUp,
  Edit3,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ForecastingProps {
  userRole: string;
  projectData: any;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ForecastAcknowledgment {
  recordId: string;
  userId: string;
  timestamp: Date;
  acknowledged: boolean;
  previousMethod: string;
  reasoning: string;
}

// Enhanced forecast data structure with all required fields
interface ForecastRecord {
  id: string;
  project_id: number;
  forecast_type: "gcgr" | "draw";
  cost_code?: string;
  cost_code_description?: string;
  csi_code?: string;
  csi_description?: string;
  budget: number;
  cost_to_complete: number;
  estimated_at_completion: number;
  variance: number;
  start_date: string;
  end_date: string;
  forecast_method: "Manual" | "HBI Forecast" | "Linear" | "S Curve" | "Bell Curve";
  weight: number;
  actual_remaining_forecast: { [month: string]: number };
  previous_forecast: { [month: string]: number };
  variance_amounts: { [month: string]: number };
}

// Generate monthly columns for the next 12 months
const generateMonthlyColumns = () => {
  const columns = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: '2-digit' });
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    columns.push({ label: monthYear, key: monthKey });
  }
  
  return columns;
};

// Mock enhanced forecast data with all required fields
const generateMockForecastData = (): ForecastRecord[] => {
  const monthlyColumns = generateMonthlyColumns();
  const mockData: ForecastRecord[] = [];

  // GC & GR Records
  const gcgrRecords = [
    {
      cost_code: "01-00-000",
      cost_code_description: "Presentation/Proposal/Rfq",
      budget: 125000,
      forecast_method: "Manual" as const,
    },
    {
      cost_code: "01-01-000", 
      cost_code_description: "General Conditions",
      budget: 2500000,
      forecast_method: "HBI Forecast" as const,
    },
    {
      cost_code: "01-01-022",
      cost_code_description: "Contingency", 
      budget: 1800000,
      forecast_method: "Linear" as const,
    },
    {
      cost_code: "15-02-227",
      cost_code_description: "Waste Material Disposal",
      budget: 450000,
      forecast_method: "S Curve" as const,
    },
    {
      cost_code: "10-01-571",
      cost_code_description: "Erosion & Sediment Control",
      budget: 320000,
      forecast_method: "HBI Forecast" as const,
    }
  ];

  // Draw Records
  const drawRecords = [
    {
      csi_code: "27 26 00",
      csi_description: "Data Communications Programming and Integration",
      budget: 850000,
      forecast_method: "Manual" as const,
    },
    {
      csi_code: "23 05 00",
      csi_description: "Common Work Results for HVAC",
      budget: 1200000,
      forecast_method: "Linear" as const,
    },
    {
      csi_code: "03 30 00",
      csi_description: "Cast-in-Place Concrete",
      budget: 2800000,
      forecast_method: "HBI Forecast" as const,
    },
    {
      csi_code: "07 84 00",
      csi_description: "Firestopping",
      budget: 425000,
      forecast_method: "Bell Curve" as const,
    },
    {
      csi_code: "26 27 00",
      csi_description: "Low-Voltage Distribution Equipment",
      budget: 675000,
      forecast_method: "HBI Forecast" as const,
    }
  ];

  // Generate GC & GR records
  gcgrRecords.forEach((record, index) => {
    const cost_to_complete = record.budget * (0.3 + Math.random() * 0.4);
    const estimated_at_completion = record.budget + (Math.random() - 0.5) * record.budget * 0.1;
    
    // Generate monthly data
    const actual_remaining_forecast: { [key: string]: number } = {};
    const previous_forecast: { [key: string]: number } = {};
    const variance_amounts: { [key: string]: number } = {};
    
    monthlyColumns.forEach((month, monthIndex) => {
      const baseAmount = record.budget / 12;
      const currentAmount = baseAmount * (0.8 + Math.random() * 0.4);
      const previousAmount = baseAmount * (0.9 + Math.random() * 0.2);
      
      actual_remaining_forecast[month.key] = currentAmount;
      previous_forecast[month.key] = previousAmount;
      variance_amounts[month.key] = currentAmount - previousAmount;
    });

    mockData.push({
      id: `gcgr-${index}`,
      project_id: 2525840,
      forecast_type: "gcgr",
      cost_code: record.cost_code,
      cost_code_description: record.cost_code_description,
      budget: record.budget,
      cost_to_complete,
      estimated_at_completion,
      variance: estimated_at_completion - record.budget,
      start_date: "01/15/2024",
      end_date: "12/30/2024",
      forecast_method: record.forecast_method,
      weight: Math.floor(Math.random() * 10) + 1,
      actual_remaining_forecast,
      previous_forecast,
      variance_amounts,
    });
  });

  // Generate Draw records
  drawRecords.forEach((record, index) => {
    const cost_to_complete = record.budget * (0.2 + Math.random() * 0.5);
    const estimated_at_completion = record.budget + (Math.random() - 0.5) * record.budget * 0.15;
    
    const actual_remaining_forecast: { [key: string]: number } = {};
    const previous_forecast: { [key: string]: number } = {};
    const variance_amounts: { [key: string]: number } = {};
    
    monthlyColumns.forEach((month, monthIndex) => {
      const baseAmount = record.budget / 12;
      const currentAmount = baseAmount * (0.7 + Math.random() * 0.6);
      const previousAmount = baseAmount * (0.85 + Math.random() * 0.3);
      
      actual_remaining_forecast[month.key] = currentAmount;
      previous_forecast[month.key] = previousAmount;
      variance_amounts[month.key] = currentAmount - previousAmount;
    });

    mockData.push({
      id: `draw-${index}`,
      project_id: 2525840,
      forecast_type: "draw",
      csi_code: record.csi_code,
      csi_description: record.csi_description,
      budget: record.budget,
      cost_to_complete,
      estimated_at_completion,
      variance: estimated_at_completion - record.budget,
      start_date: "02/01/2024",
      end_date: "11/15/2024",
      forecast_method: record.forecast_method,
      weight: Math.floor(Math.random() * 10) + 1,
      actual_remaining_forecast,
      previous_forecast,
      variance_amounts,
    });
  });

  return mockData;
};

// HBI AI Forecast explanations
const getHBIForecastExplanation = (record: ForecastRecord) => {
  const explanations = {
    "01-01-000": {
      reasoning: "Based on historical general conditions spending patterns and current project velocity, HBI recommends front-loading expenditures by 15% due to accelerated schedule requirements.",
      factors: ["Historical billing trend analysis shows 23% variance in Q3", "Project acceleration requiring additional supervision", "Weather delays requiring extended site presence"]
    },
    "10-01-571": {
      reasoning: "Erosion control spending should follow precipitation patterns and earthwork activities. Recent permit amendments require enhanced controls.",
      factors: ["Seasonal precipitation forecast indicates heavy rainfall in months 4-6", "Earthwork activities concentrated in early phases", "Recent EPA compliance requirements"]
    },
    "27 26 00": {
      reasoning: "Data communications installation follows structural completion with typical 2-month lag. Vendor delivery schedules indicate potential delays.",
      factors: ["Structural completion tracking 3 weeks behind schedule", "Primary vendor reporting 6-week lead times", "Integration testing requires 4-week window"]
    },
    "26 27 00": {
      reasoning: "Electrical distribution equipment installation shows historical front-loading due to long lead times and early rough-in requirements.",
      factors: ["Equipment procurement requires 12-week lead time", "Rough-in activities drive early installation", "Coordination with structural steel completion"]
    },
    "03 30 00": {
      reasoning: "Concrete placement follows weather-dependent S-curve with peak activity in months 3-7. Material escalation factored into forecast.",
      factors: ["Weather window optimization for pour schedules", "Material cost escalation of 4.2% projected", "Subcontractor capacity constraints in peak period"]
    }
  };

  const key = record.cost_code || record.csi_code || "";
  return explanations[key as keyof typeof explanations] || {
    reasoning: "HBI analysis indicates standard spending curve based on project phase and historical patterns.",
    factors: ["Standard project progression patterns", "Historical spending velocity", "Resource availability optimization"]
  };
};

/**
 * Forecasting Component
 *
 * Provides advanced forecasting capabilities with:
 * - Interactive GC & GR and Draw tables
 * - Dynamic monthly columns
 * - AI-powered HBI forecasting
 * - Real-time editing and calculations
 * - Local storage persistence
 *
 * @param userRole - Current user role for permissions
 * @param projectData - Project context data
 */
export default function Forecasting({ userRole, projectData }: ForecastingProps) {
  const [activeTable, setActiveTable] = useState<"gcgr" | "draw">("gcgr");
  const [forecastData, setForecastData] = useState<ForecastRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [showHBIDialog, setShowHBIDialog] = useState(false);
  const [hbiExplanation, setHBIExplanation] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Chat functionality state
  const [showHBIChat, setShowHBIChat] = useState(false);
  const [chatRecord, setChatRecord] = useState<ForecastRecord | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Acknowledgment system state
  const [previousMethodMap, setPreviousMethodMap] = useState<{ [recordId: string]: string }>({});
  const [acknowledgmentRequired, setAcknowledgmentRequired] = useState(false);
  const [acknowledgments, setAcknowledgments] = useState<ForecastAcknowledgment[]>([]);
  const [showExitAcknowledgment, setShowExitAcknowledgment] = useState(false);
  
  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInsightsCollapsed, setIsInsightsCollapsed] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const monthlyColumns = useMemo(() => generateMonthlyColumns(), []);

  // Initialize data
  useEffect(() => {
    const savedData = localStorage.getItem('hb-forecast-data');
    if (savedData) {
      setForecastData(JSON.parse(savedData));
    } else {
      const mockData = generateMockForecastData();
      setForecastData(mockData);
    }

    // Load acknowledgments from localStorage
    const savedAcknowledgments = localStorage.getItem('hb-forecast-acknowledgments');
    if (savedAcknowledgments) {
      const parsed = JSON.parse(savedAcknowledgments);
      // Convert timestamp strings back to Date objects
      const acknowledgementsWithDates = parsed.map((ack: any) => ({
        ...ack,
        timestamp: new Date(ack.timestamp)
      }));
      setAcknowledgments(acknowledgementsWithDates);
    }

    // Load previous method map from localStorage
    const savedPreviousMethods = localStorage.getItem('hb-forecast-previous-methods');
    if (savedPreviousMethods) {
      setPreviousMethodMap(JSON.parse(savedPreviousMethods));
    }
  }, []);

  // Save acknowledgments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hb-forecast-acknowledgments', JSON.stringify(acknowledgments));
  }, [acknowledgments]);

  // Save previous methods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hb-forecast-previous-methods', JSON.stringify(previousMethodMap));
  }, [previousMethodMap]);

  // Filter data by table type
  const filteredData = useMemo(() => {
    return forecastData.filter(record => record.forecast_type === activeTable);
  }, [forecastData, activeTable]);

  // Calculate totals
  const calculateTotals = useMemo(() => {
    const data = filteredData;
    const totals = {
      budget: 0,
      cost_to_complete: 0,
      estimated_at_completion: 0,
      variance: 0,
      monthly_actual: {} as { [key: string]: number },
      monthly_previous: {} as { [key: string]: number },
      monthly_variance: {} as { [key: string]: number },
    };

    data.forEach(record => {
      totals.budget += record.budget;
      totals.cost_to_complete += record.cost_to_complete;
      totals.estimated_at_completion += record.estimated_at_completion;
      totals.variance += record.variance;

      monthlyColumns.forEach(month => {
        if (!totals.monthly_actual[month.key]) totals.monthly_actual[month.key] = 0;
        if (!totals.monthly_previous[month.key]) totals.monthly_previous[month.key] = 0;
        if (!totals.monthly_variance[month.key]) totals.monthly_variance[month.key] = 0;

        totals.monthly_actual[month.key] += record.actual_remaining_forecast[month.key] || 0;
        totals.monthly_previous[month.key] += record.previous_forecast[month.key] || 0;
        totals.monthly_variance[month.key] += record.variance_amounts[month.key] || 0;
      });
    });

    return totals;
  }, [filteredData, monthlyColumns]);

  // Update record function
  const updateRecord = (recordId: string, field: string, value: any) => {
    setForecastData(prev => {
      const updated = prev.map(record => {
        if (record.id === recordId) {
          const updatedRecord = { ...record, [field]: value };
          
          // If forecast method or weight changes, recalculate monthly values
          if (field === 'forecast_method' || field === 'weight') {
            updatedRecord.actual_remaining_forecast = calculateMonthlyDistribution(updatedRecord);
            updatedRecord.variance_amounts = calculateVarianceAmounts(updatedRecord);
            
            // If HBI Forecast is selected, track previous method and start chat
            if (field === 'forecast_method' && value === 'HBI Forecast') {
              // Store the previous method for potential reversion
              setPreviousMethodMap(prevMap => ({
                ...prevMap,
                [recordId]: record.forecast_method
              }));
              setTimeout(() => startHBIChat(updatedRecord), 500);
            }
          }
          
          return updatedRecord;
        }
        return record;
      });
      
      setHasUnsavedChanges(true);
      return updated;
    });
  };

  // Calculate monthly distribution based on forecast method and weight
  const calculateMonthlyDistribution = (record: ForecastRecord) => {
    const distribution: { [key: string]: number } = {};
    const totalAmount = record.budget;
    const weight = record.weight / 10; // Convert 1-10 to 0.1-1.0
    
    monthlyColumns.forEach((month, index) => {
      let factor = 1; // Default for Manual
      
      switch (record.forecast_method) {
        case 'Linear':
          factor = 1; // Equal distribution
          break;
        case 'S Curve':
          factor = 1 / (1 + Math.exp(-0.5 * (index - 6))); // S-curve distribution
          break;
        case 'Bell Curve':
          factor = Math.exp(-0.5 * Math.pow((index - 6) / 3, 2)); // Bell curve
          break;
        case 'HBI Forecast':
          // AI-enhanced distribution based on various factors
          factor = 0.8 + 0.4 * Math.sin((index / 12) * Math.PI) + (Math.random() - 0.5) * 0.2;
          break;
      }
      
      // Apply weight (front-loading vs back-loading)
      const weightAdjustment = weight + (1 - weight) * (index / (monthlyColumns.length - 1));
      factor *= weightAdjustment;
      
      distribution[month.key] = (totalAmount / 12) * factor;
    });
    
    return distribution;
  };

  // Calculate variance amounts
  const calculateVarianceAmounts = (record: ForecastRecord) => {
    const variance: { [key: string]: number } = {};
    
    monthlyColumns.forEach(month => {
      const actual = record.actual_remaining_forecast[month.key] || 0;
      const previous = record.previous_forecast[month.key] || 0;
      variance[month.key] = actual - previous;
    });
    
    return variance;
  };

  // Start HBI chat session for specific record
  const startHBIChat = (record: ForecastRecord) => {
    setChatRecord(record);
    const explanation = getHBIForecastExplanation(record);
    const displayName = record.forecast_type === 'gcgr' 
      ? `${record.cost_code} - ${record.cost_code_description}`
      : `${record.csi_code} - ${record.csi_description}`;
    
    // Initialize chat with HBI's explanation
    const initialMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'assistant',
      content: `Hello! I'm the HBI AI agent for ${displayName}. Here's my forecast analysis:\n\n**${explanation.reasoning}**\n\nKey factors I analyzed:\n${explanation.factors.map((f: string) => `• ${f}`).join('\n')}\n\nFeel free to ask me questions about this forecast, explore alternative scenarios, or dive deeper into any aspect of my analysis! When you're ready to finalize this forecast, I'll guide you through the acknowledgment process.`,
      timestamp: new Date(),
    };
    
    setChatMessages([initialMessage]);
    
    // Check if this record already has an acknowledgment
    const existingAck = acknowledgments.find(a => a.recordId === record.id && a.acknowledged);
    setAcknowledgmentRequired(!existingAck);
    
    setShowHBIChat(true);
  };

  // Handle forecast acknowledgment
  const acknowledgeForecast = () => {
    if (!chatRecord) return;
    
    const acknowledgment: ForecastAcknowledgment = {
      recordId: chatRecord.id,
      userId: userRole, // In a real app, this would be the actual user ID
      timestamp: new Date(),
      acknowledged: true,
      previousMethod: previousMethodMap[chatRecord.id] || 'Manual',
      reasoning: getHBIForecastExplanation(chatRecord).reasoning,
    };
    
    setAcknowledgments(prev => [...prev, acknowledgment]);
    setAcknowledgmentRequired(false);
    
    // Add confirmation message to chat
    const confirmationMessage: ChatMessage = {
      id: `msg-${Date.now()}-ack`,
      type: 'assistant',
      content: `✅ **Forecast Acknowledged**\n\nThank you for acknowledging this HBI forecast. Your acknowledgment has been recorded with timestamp: ${acknowledgment.timestamp.toLocaleString()}.\n\nThe HBI forecast is now active for this cost code. You can continue chatting with me about optimizations, scenarios, or any questions you might have!`,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, confirmationMessage]);
  };

  // Handle forecast rejection - revert to previous method
  const rejectForecast = () => {
    if (!chatRecord) return;
    
    const previousMethod = previousMethodMap[chatRecord.id] || 'Manual';
    
    // Revert the forecast method
    updateRecord(chatRecord.id, 'forecast_method', previousMethod);
    
    // Record the rejection
    const rejection: ForecastAcknowledgment = {
      recordId: chatRecord.id,
      userId: userRole,
      timestamp: new Date(),
      acknowledged: false,
      previousMethod: previousMethod,
      reasoning: 'User rejected HBI forecast recommendation',
    };
    
    setAcknowledgments(prev => [...prev, rejection]);
    
    // Close the chat modal
    setShowHBIChat(false);
    setAcknowledgmentRequired(false);
    setShowExitAcknowledgment(false);
    setChatMessages([]);
    setChatRecord(null);
  };

  // Handle modal close attempt
  const handleModalClose = () => {
    if (acknowledgmentRequired) {
      // Show exit acknowledgment dialog instead of closing
      setShowExitAcknowledgment(true);
    } else {
      // Normal close
      setShowHBIChat(false);
      setChatMessages([]);
      setChatRecord(null);
    }
  };

  // Handle acknowledgment completion and close
  const acknowledgeAndClose = () => {
    acknowledgeForecast();
    setShowExitAcknowledgment(false);
    setShowHBIChat(false);
    setChatMessages([]);
    setChatRecord(null);
  };

  // Handle rejection and close  
  const rejectAndClose = () => {
    rejectForecast();
    setShowExitAcknowledgment(false);
  };

  // Send chat message
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      type: 'user',
      content: chatInput,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(chatInput, chatRecord);
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Generate contextual AI responses
  const generateAIResponse = (userInput: string, record: ForecastRecord | null): string => {
    const input = userInput.toLowerCase();
    
    // Context-aware responses based on user input
    if (input.includes('weather') || input.includes('season')) {
      return "Weather is a critical factor in my forecast model. For this cost code, I've analyzed:\n\n• **Seasonal patterns**: Historical data shows 23% variance during winter months\n• **Current forecast**: Extended winter predicted, suggesting front-loading of weather-sensitive work\n• **Risk mitigation**: I recommend a 15% contingency buffer for Q4 activities\n\nWould you like me to adjust the forecast assuming different weather scenarios?";
    }
    
    if (input.includes('cost') || input.includes('budget') || input.includes('price')) {
      return "Cost optimization is central to my recommendations. Here's my analysis:\n\n• **Material escalation**: 4.2% increase projected based on market trends\n• **Labor costs**: Skilled trades showing premium pricing in peak months\n• **Efficiency gains**: 8% savings possible through optimized scheduling\n\nI can model different cost scenarios - would you like to explore the impact of material price changes or labor rate adjustments?";
    }
    
    if (input.includes('risk') || input.includes('concern') || input.includes('problem')) {
      return "Risk assessment is one of my core strengths. For this forecast, I've identified:\n\n• **Schedule risk**: Medium (15% probability of delay)\n• **Cost overrun risk**: Low (3% variance expected)\n• **Quality risks**: Minimal with current parameters\n• **External risks**: Weather dependency rated as moderate\n\nWhich specific risks would you like me to analyze further or help you develop mitigation strategies for?";
    }
    
    if (input.includes('scenario') || input.includes('what if') || input.includes('alternative')) {
      return "I excel at scenario modeling! I can adjust this forecast based on:\n\n• **Schedule compression**: Up to 20% faster delivery\n• **Budget constraints**: Cost reduction scenarios\n• **Resource changes**: Different crew sizes or skill levels\n• **Market conditions**: Material cost fluctuations\n• **Weather variations**: Best/worst case climate scenarios\n\nWhat specific scenario would you like me to model? For example, 'What if we accelerate by 30 days?' or 'What if material costs increase by 10%?'";
    }
    
    if (input.includes('confidence') || input.includes('accuracy') || input.includes('sure')) {
      return "My confidence level for this forecast is **87%** based on:\n\n• **Historical accuracy**: 94.2% on similar projects\n• **Data quality**: High (127 comparable projects analyzed)\n• **Market stability**: Moderate (some volatility expected)\n• **Project specifics**: Well-defined scope and requirements\n\nThe 13% uncertainty primarily stems from external factors like weather and material availability. I can break down the confidence intervals for each forecast component if you'd like more detail.";
    }
    
    // Default response
    return "That's a great question! Based on my analysis of this cost code, I can provide insights on:\n\n• **Forecast methodology** and why I chose this approach\n• **Risk factors** and mitigation strategies\n• **Alternative scenarios** and their impact\n• **Cost optimization** opportunities\n• **Schedule implications** of different approaches\n\nCould you be more specific about what aspect you'd like to explore? I'm here to help you understand every detail of this forecast!";
  };

  // Show traditional HBI explanation (for detailed view)
  const showHBIExplanation = (record: ForecastRecord) => {
    setHbiExplanation(getHBIForecastExplanation(record));
    setShowHBIDialog(true);
  };

  // Save changes to local storage
  const saveChanges = () => {
    localStorage.setItem('hb-forecast-data', JSON.stringify(forecastData));
    setHasUnsavedChanges(false);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Inline editing component
  const InlineEdit = ({ 
    value, 
    onSave, 
    type = 'text', 
    className = '', 
    options = null 
  }: { 
    value: any; 
    onSave: (value: any) => void; 
    type?: 'text' | 'number' | 'select' | 'date';
    className?: string;
    options?: { value: string; label: string }[] | null;
  }) => {
    const fieldKey = `${type}-${value}`;
    const isEditing = editingField === fieldKey;
    const [editValue, setEditValue] = useState(value);

    const handleSave = () => {
      onSave(editValue);
      setEditingField(null);
    };

    const handleCancel = () => {
      setEditValue(value);
      setEditingField(null);
    };

    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <div className="flex items-center gap-1">
            <Select value={editValue} onValueChange={setEditValue}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleSave} className="h-6 w-6 p-0">
              <CheckCircle className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="h-6 w-6 p-0">
              ✕
            </Button>
          </div>
        );
      }
      
      return (
        <div className="flex items-center gap-1">
          <Input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(type === 'number' ? Number(e.target.value) : e.target.value)}
            className="w-24 h-8 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            autoFocus
          />
          <Button size="sm" onClick={handleSave} className="h-6 w-6 p-0">
            <CheckCircle className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-6 w-6 p-0">
            ✕
          </Button>
        </div>
      );
    }

    return (
      <div 
        className={`flex items-center gap-1 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group ${className}`}
        onClick={() => setEditingField(fieldKey)}
      >
        <span className="text-xs">{type === 'number' && typeof value === 'number' ? formatCurrency(value) : value}</span>
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
      </div>
    );
  };

  // Render table row (3 rows per record)
  const renderRecordRows = (record: ForecastRecord) => {
    const displayName = record.forecast_type === 'gcgr' 
      ? `${record.cost_code} - ${record.cost_code_description}`
      : `${record.csi_code} - ${record.csi_description}`;

    return (
      <React.Fragment key={record.id}>
        {/* Row 1: Actual / Remaining Forecast */}
        <tr className={`border-b hover:bg-muted/50 ${record.forecast_method === 'HBI Forecast' ? 'bg-gradient-to-r from-violet-50/30 to-blue-50/30 dark:from-violet-950/30 dark:to-blue-950/30 border-l-4 border-l-violet-500' : ''}`}>
          <td className="p-2 font-medium text-sm">
            <div className="flex items-center gap-2">
              {record.forecast_method === 'HBI Forecast' && (
                <div className="flex items-center gap-1">
                  {(() => {
                    const isAcknowledged = acknowledgments.find(a => a.recordId === record.id && a.acknowledged);
                    return isAcknowledged ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <Zap className="h-3 w-3 text-violet-600" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" title="Acknowledgment Required"></div>
                        <Zap className="h-3 w-3 text-violet-600" />
                      </div>
                    );
                  })()}
                </div>
              )}
              {displayName}
            </div>
          </td>
          <td className="p-1 text-xs">
            <Badge variant={record.forecast_method === 'HBI Forecast' ? 'default' : 'outline'} 
                   className={record.forecast_method === 'HBI Forecast' ? 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200' : ''}>
              Actual / Remaining Forecast
            </Badge>
          </td>
          <td className="p-1">
            <div className="w-24 h-8 px-2 py-1 bg-muted/50 rounded border text-xs flex items-center text-muted-foreground">
              {formatCurrency(record.budget)}
            </div>
          </td>
          <td className="p-1">
            <div className="w-24 h-8 px-2 py-1 bg-muted/50 rounded border text-xs flex items-center text-muted-foreground">
              {formatCurrency(record.cost_to_complete)}
            </div>
          </td>
          <td className="p-1">
            <div className="w-24 h-8 px-2 py-1 bg-muted/50 rounded border text-xs flex items-center text-muted-foreground">
              {formatCurrency(record.estimated_at_completion)}
            </div>
          </td>
          <td className={`p-1 text-xs font-medium ${record.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(record.variance)}
          </td>
          <td className="p-1">
            <InlineEdit
              value={record.start_date}
              onSave={(value) => updateRecord(record.id, 'start_date', value)}
              type="text"
            />
          </td>
          <td className="p-1">
            <InlineEdit
              value={record.end_date}
              onSave={(value) => updateRecord(record.id, 'end_date', value)}
              type="text"
            />
          </td>
          <td className="p-1">
            <div className="flex items-center gap-1">
              <InlineEdit
                value={record.forecast_method}
                onSave={(value) => updateRecord(record.id, 'forecast_method', value)}
                type="select"
                options={[
                  { value: 'Manual', label: 'Manual' },
                  { value: 'HBI Forecast', label: 'HBI Forecast' },
                  { value: 'Linear', label: 'Linear' },
                  { value: 'S Curve', label: 'S Curve' },
                  { value: 'Bell Curve', label: 'Bell Curve' }
                ]}
                className={record.forecast_method === 'HBI Forecast' ? 'border-violet-300 bg-violet-50 dark:border-violet-700 dark:bg-violet-950' : ''}
              />
              {record.forecast_method === 'HBI Forecast' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startHBIChat(record)}
                  className="h-8 w-8 p-0 border-violet-300 bg-violet-50 hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-950 dark:hover:bg-violet-900 animate-pulse"
                  title="Chat with HBI AI Agent"
                >
                  <MessageSquare className="h-3 w-3 text-violet-600" />
                </Button>
              )}
            </div>
          </td>
          <td className="p-1">
            <InlineEdit
              value={record.weight}
              onSave={(value) => updateRecord(record.id, 'weight', value)}
              type="number"
            />
          </td>
          {monthlyColumns.map(month => (
            <td key={`${record.id}-actual-${month.key}`} className="p-1">
              <InlineEdit
                value={record.actual_remaining_forecast[month.key] || 0}
                onSave={(value) => {
                  const newActual = { ...record.actual_remaining_forecast };
                  newActual[month.key] = Number(value);
                  updateRecord(record.id, 'actual_remaining_forecast', newActual);
                }}
                type="number"
              />
            </td>
          ))}
        </tr>

        {/* Row 2: Previous Forecast */}
        <tr className="border-b bg-muted/20">
          <td className="p-2"></td>
          <td className="p-1 text-xs">
            <Badge variant="secondary">Previous Forecast</Badge>
          </td>
          <td className="p-1 text-xs text-muted-foreground">{formatCurrency(record.budget * 0.95)}</td>
          <td className="p-1 text-xs text-muted-foreground">{formatCurrency(record.cost_to_complete * 1.05)}</td>
          <td className="p-1 text-xs text-muted-foreground">{formatCurrency(record.estimated_at_completion * 0.98)}</td>
          <td className="p-1 text-xs text-muted-foreground">{formatCurrency(record.variance * 0.85)}</td>
          <td className="p-1 text-xs text-muted-foreground">{record.start_date}</td>
          <td className="p-1 text-xs text-muted-foreground">{record.end_date}</td>
          <td className="p-1 text-xs text-muted-foreground">{record.forecast_method}</td>
          <td className="p-1 text-xs text-muted-foreground">{record.weight}</td>
          {monthlyColumns.map(month => (
            <td key={`${record.id}-previous-${month.key}`} className="p-1">
              <div className="text-xs text-muted-foreground text-center">
                {formatCurrency(record.previous_forecast[month.key] || 0)}
              </div>
            </td>
          ))}
        </tr>

        {/* Row 3: Variance */}
        <tr className="border-b bg-muted/10">
          <td className="p-2"></td>
          <td className="p-1 text-xs">
            <Badge variant="outline">Variance</Badge>
          </td>
          <td className="p-1 text-xs font-medium text-green-600">{formatCurrency(record.budget * 0.05)}</td>
          <td className="p-1 text-xs font-medium text-red-600">{formatCurrency(record.cost_to_complete * -0.05)}</td>
          <td className="p-1 text-xs font-medium text-green-600">{formatCurrency(record.estimated_at_completion * 0.02)}</td>
          <td className="p-1 text-xs font-medium text-green-600">{formatCurrency(record.variance * 0.15)}</td>
          <td className="p-1 text-xs text-center">-</td>
          <td className="p-1 text-xs text-center">-</td>
          <td className="p-1 text-xs text-center">-</td>
          <td className="p-1 text-xs text-center">-</td>
          {monthlyColumns.map(month => (
            <td key={`${record.id}-variance-${month.key}`} className="p-1">
              <div className={`text-xs font-medium text-center ${
                (record.variance_amounts[month.key] || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(record.variance_amounts[month.key] || 0)}
              </div>
            </td>
          ))}
        </tr>
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Financial Forecasting</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Interactive GC & GR and Draw forecasting with AI-powered predictions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <Alert className="w-auto py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">Unsaved changes</AlertDescription>
            </Alert>
          )}
          
          <Button onClick={saveChanges} disabled={!hasUnsavedChanges} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* HBI Forecast Insights - General Analysis */}
      <Card className="bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-50 dark:from-violet-950 dark:via-blue-950 dark:to-indigo-950 border-2 border-violet-200 dark:border-violet-800 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-violet-800 dark:text-violet-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-900">
                <Zap className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              HBI Forecast Insights
              <Badge variant="secondary" className="ml-2 bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200">
                AI-Powered
              </Badge>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsInsightsCollapsed(!isInsightsCollapsed)}
              className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              {isInsightsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </CardTitle>
          {!isInsightsCollapsed && (
            <CardDescription className="text-violet-600 dark:text-violet-400">
              Global AI analysis and strategic recommendations for project forecasting
            </CardDescription>
          )}
        </CardHeader>
        {!isInsightsCollapsed && (
          <CardContent className="space-y-4">
          {/* Key AI Insights */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                <strong>Market Volatility Alert:</strong> Construction material costs showing 8% increase trend. 
                HBI recommends adjusting Q4 forecasts accordingly.
              </AlertDescription>
            </Alert>
            
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Weather Impact:</strong> Extended winter forecast suggests front-loading exterior work. 
                Concrete operations optimal through month 6.
              </AlertDescription>
            </Alert>

            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>Labor Availability:</strong> Skilled trades showing improved availability Q2-Q3. 
                Opportunity for schedule acceleration.
              </AlertDescription>
            </Alert>
          </div>

          {/* Forecast Intelligence Summary */}
          <div className="space-y-3">
            <h4 className="font-medium text-violet-800 dark:text-violet-200 flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Portfolio-Wide Forecast Intelligence
            </h4>
            
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-violet-200 dark:border-violet-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm">Cash Flow Optimization</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  HBI identified $2.3M in potential cash flow improvements through strategic timing adjustments across 
                  {filteredData.length} cost codes.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-violet-200 dark:border-violet-700">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">Risk Mitigation</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Predictive analysis shows 15% schedule risk reduction possible through proactive resource reallocation 
                  in months 4-7.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950 dark:to-blue-950 border border-violet-200 dark:border-violet-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse"></div>
                    <span className="font-medium text-violet-800 dark:text-violet-200">Interactive HBI Agent Available</span>
                  </div>
                  <p className="text-sm text-violet-600 dark:text-violet-400">
                    Select "HBI Forecast" for any cost code to engage with our AI agent for detailed analysis and scenario planning.
                  </p>
                </div>
                <div className="text-2xl">🤖</div>
              </div>
            </div>
          </div>
        </CardContent>
        )}
      </Card>

      {/* Table Toggle and Summary */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Target className="h-5 w-5" />
            Forecast Summary - {activeTable.toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <Tabs value={activeTable} onValueChange={(value) => setActiveTable(value as "gcgr" | "draw")}>
              <TabsList>
                <TabsTrigger value="gcgr" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  GC & GR
                </TabsTrigger>
                <TabsTrigger value="draw" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Draw
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(calculateTotals.budget)}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Total Budget</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(calculateTotals.estimated_at_completion)}
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">Est. at Completion</p>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${calculateTotals.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(calculateTotals.variance)}
                </div>
                <p className="text-xs text-muted-foreground">Total Variance</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {filteredData.length}
                </div>
                <p className="text-xs text-muted-foreground">Cost Codes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Forecast Table */}
      <Card className={isFullscreen ? 'fixed inset-4 z-[130] overflow-auto' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              {activeTable === 'gcgr' ? 'GC & GR' : 'Draw'} Forecast Table
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-2"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
          </CardTitle>
          <CardDescription>
            Interactive forecasting with monthly distribution and AI-powered predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 bg-muted/50">
                  <th className="text-left p-2 w-48">Cost Code</th>
                  <th className="text-left p-2 w-32">Forecast / Actual</th>
                  <th className="text-left p-2 w-24">Budget</th>
                  <th className="text-left p-2 w-24">Cost to Complete</th>
                  <th className="text-left p-2 w-24">Est. at Completion</th>
                  <th className="text-left p-2 w-24">Variance</th>
                  <th className="text-left p-2 w-24">Start Date</th>
                  <th className="text-left p-2 w-24">End Date</th>
                  <th className="text-left p-2 w-32">Forecast Method</th>
                  <th className="text-left p-2 w-20">Weight</th>
                  {monthlyColumns.map(month => (
                    <th key={month.key} className="text-left p-2 w-20 text-center">
                      {month.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map(record => renderRecordRows(record))}
                
                {/* Total Rows */}
                <tr className="border-t-2 bg-blue-50 dark:bg-blue-950 font-medium">
                  <td className="p-2 font-bold">Previous Forecast Total</td>
                  <td className="p-2"></td>
                  <td className="p-2">{formatCurrency(calculateTotals.budget * 0.95)}</td>
                  <td className="p-2">{formatCurrency(calculateTotals.cost_to_complete * 1.05)}</td>
                  <td className="p-2">{formatCurrency(calculateTotals.estimated_at_completion * 0.98)}</td>
                  <td className="p-2">{formatCurrency(calculateTotals.variance * 0.85)}</td>
                  <td className="p-2">-</td>
                  <td className="p-2">-</td>
                  <td className="p-2">-</td>
                  <td className="p-2">-</td>
                  {monthlyColumns.map(month => (
                    <td key={`total-prev-${month.key}`} className="p-2 text-center">
                      {formatCurrency(calculateTotals.monthly_previous[month.key] || 0)}
                    </td>
                  ))}
                </tr>
                
                <tr className="bg-green-50 dark:bg-green-950 font-medium">
                  <td className="p-2 font-bold">Actual / Remaining Forecast Total</td>
                  <td className="p-2"></td>
                  <td className="p-2">{formatCurrency(calculateTotals.budget)}</td>
                  <td className="p-2">{formatCurrency(calculateTotals.cost_to_complete)}</td>
                  <td className="p-2">{formatCurrency(calculateTotals.estimated_at_completion)}</td>
                  <td className="p-2">{formatCurrency(calculateTotals.variance)}</td>
                  <td className="p-2">-</td>
                  <td className="p-2">-</td>
                  <td className="p-2">-</td>
                  <td className="p-2">-</td>
                  {monthlyColumns.map(month => (
                    <td key={`total-actual-${month.key}`} className="p-2 text-center font-medium">
                      {formatCurrency(calculateTotals.monthly_actual[month.key] || 0)}
                    </td>
                  ))}
                </tr>
                
                <tr className="bg-yellow-50 dark:bg-yellow-950 font-medium">
                  <td className="p-2 font-bold">Variance Total</td>
                  <td className="p-2"></td>
                  <td className={`p-2 ${calculateTotals.budget * 0.05 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(calculateTotals.budget * 0.05)}
                  </td>
                  <td className={`p-2 ${-calculateTotals.cost_to_complete * 0.05 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(-calculateTotals.cost_to_complete * 0.05)}
                  </td>
                  <td className={`p-2 ${calculateTotals.estimated_at_completion * 0.02 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(calculateTotals.estimated_at_completion * 0.02)}
                  </td>
                  <td className={`p-2 ${calculateTotals.variance * 0.15 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(calculateTotals.variance * 0.15)}
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2">-</td>
                  <td className="p-2">-</td>
                  <td className="p-2">-</td>
                  {monthlyColumns.map(month => (
                    <td key={`total-variance-${month.key}`} className={`p-2 text-center font-medium ${
                      (calculateTotals.monthly_variance[month.key] || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(calculateTotals.monthly_variance[month.key] || 0)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
              </Card>

      {/* HBI AI Chat Interface - Interactive */}
      <Dialog open={showHBIChat} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-5xl max-h-[85vh] p-0">
          {chatRecord && (
            <>
              <DialogHeader className="p-6 pb-3 border-b">
                <DialogTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900 dark:to-blue-900">
                    <Brain className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  HBI AI Agent Chat
                  <Badge variant="secondary" className="ml-2 bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200">
                    Live AI
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-base">
                  Interactive AI analysis for {chatRecord.forecast_type === 'gcgr' 
                    ? `${chatRecord.cost_code} - ${chatRecord.cost_code_description}`
                    : `${chatRecord.csi_code} - ${chatRecord.csi_description}`
                  }
                </DialogDescription>
              </DialogHeader>

              <div className="flex h-[60vh]">
                {/* Chat Messages Area */}
                <div className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] ${
                            message.type === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950 dark:to-blue-950 border border-violet-200 dark:border-violet-800'
                          } rounded-lg p-4`}>
                            <div className="flex items-start gap-3">
                              {message.type === 'assistant' && (
                                <div className="p-1 rounded-full bg-violet-100 dark:bg-violet-900 flex-shrink-0">
                                  <Bot className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className={`text-sm ${
                                  message.type === 'user' ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                                }`}>
                                  {message.content.split('\n').map((line, index) => (
                                    <div key={index}>
                                      {line.startsWith('• ') ? (
                                        <div className="ml-4 mb-1">{line}</div>
                                      ) : line.startsWith('**') && line.endsWith('**') ? (
                                        <div className="font-semibold mb-2">{line.slice(2, -2)}</div>
                                      ) : (
                                        <div className={line ? 'mb-2' : 'mb-1'}>{line}</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <div className={`text-xs mt-2 ${
                                  message.type === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                                }`}>
                                  {message.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950 dark:to-blue-950 border border-violet-200 dark:border-violet-800 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-1 rounded-full bg-violet-100 dark:bg-violet-900">
                                <Bot className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                              </div>
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>



                  {/* Chat Input */}
                  <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
                    <div className="flex gap-3">
                      <Textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendChatMessage();
                          }
                        }}
                        placeholder="Ask me about this forecast, explore scenarios, or discuss optimizations..."
                        className="flex-1 min-h-[60px] resize-none"
                        disabled={isTyping}
                      />
                      <Button 
                        onClick={sendChatMessage} 
                        disabled={!chatInput.trim() || isTyping}
                        className="bg-violet-600 hover:bg-violet-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Press Enter to send, Shift+Enter for new line
                      {acknowledgmentRequired && (
                        <span className="ml-2 text-yellow-600 font-medium">
                          • Acknowledgment required before closing
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Forecast Context Panel */}
                <div className="w-80 border-l bg-gray-50 dark:bg-gray-900 p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-violet-600" />
                    Forecast Context
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <div className="text-sm font-medium mb-1">Current Budget</div>
                      <div className="text-lg font-bold text-green-600">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(chatRecord.budget)}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <div className="text-sm font-medium mb-1">Est. at Completion</div>
                      <div className="text-lg font-bold text-blue-600">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(chatRecord.estimated_at_completion)}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <div className="text-sm font-medium mb-1">Variance</div>
                      <div className={`text-lg font-bold ${chatRecord.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(chatRecord.variance)}
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <div className="text-sm font-medium mb-1">Forecast Method</div>
                      <Badge variant="outline" className="bg-violet-50 text-violet-800 dark:bg-violet-950 dark:text-violet-200">
                        {chatRecord.forecast_method}
                      </Badge>
                    </div>

                    {/* Acknowledgment Status */}
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <div className="text-sm font-medium mb-2">Acknowledgment Status</div>
                      {(() => {
                        const ack = acknowledgments.find(a => a.recordId === chatRecord.id && a.acknowledged);
                        if (ack) {
                          return (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <Badge variant="outline" className="bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200">
                                  Acknowledged
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(ack.timestamp).toLocaleString()}
                              </div>
                            </div>
                          );
                        } else if (acknowledgmentRequired) {
                          return (
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
                                Pending
                              </Badge>
                            </div>
                          );
                        } else {
                          return (
                            <div className="flex items-center gap-2">
                              <Info className="h-4 w-4 text-gray-600" />
                              <Badge variant="outline" className="bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-200">
                                Not Required
                              </Badge>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                      Quick Questions
                    </h5>
                    <div className="space-y-2">
                      {[
                        "What weather risks affect this forecast?",
                        "How confident are you in these numbers?",
                        "What if we accelerate by 30 days?",
                        "Show me cost optimization opportunities"
                      ].map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setChatInput(suggestion)}
                          className="w-full text-left justify-start text-xs h-auto py-2 px-3"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
              </Dialog>

      {/* Exit Acknowledgment Dialog */}
      <Dialog open={showExitAcknowledgment} onOpenChange={() => setShowExitAcknowledgment(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              Acknowledgment Required
              <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Required
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-base">
              Before closing, you must acknowledge your understanding of this HBI forecast
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Forecast Summary */}
            {chatRecord && (
              <div className="p-4 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950 dark:to-blue-950 rounded-lg border border-violet-200 dark:border-violet-800">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-violet-600" />
                  <span className="font-medium text-violet-800 dark:text-violet-200">
                    {chatRecord.forecast_type === 'gcgr' 
                      ? `${chatRecord.cost_code} - ${chatRecord.cost_code_description}`
                      : `${chatRecord.csi_code} - ${chatRecord.csi_description}`
                    }
                  </span>
                </div>
                <p className="text-sm text-violet-700 dark:text-violet-300">
                  {getHBIForecastExplanation(chatRecord).reasoning}
                </p>
              </div>
            )}

            {/* Acknowledgment Requirements */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                By proceeding, you acknowledge that you have:
              </h4>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      Read and understood the forecast reasoning
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Reviewed the AI's methodology and analysis approach
                    </div>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      Reviewed the key influencing factors
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Understand the data points and variables considered
                    </div>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      Agree to apply this AI forecast
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Accept responsibility for implementing this forecast
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button 
                onClick={acknowledgeAndClose}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                I Acknowledge & Accept
              </Button>
              
              <Button 
                onClick={rejectAndClose}
                variant="outline"
                className="flex-1 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reject & Revert to {previousMethodMap[chatRecord?.id || ''] || 'Manual'}
              </Button>
            </div>

            {/* Legal Notice */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Audit Trail:</strong> Your acknowledgment will be recorded with timestamp and user identification 
                  for project documentation and compliance purposes. This record cannot be modified after submission.
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* HBI AI Forecast Dialog - Enhanced */}
      <Dialog open={showHBIDialog} onOpenChange={setShowHBIDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900 dark:to-blue-900">
                <Zap className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              HBI AI Forecast Analysis
              <Badge variant="secondary" className="ml-2 bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200">
                Advanced AI
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-base">
              Comprehensive AI-powered forecast reasoning and strategic recommendations
            </DialogDescription>
          </DialogHeader>
          
          {hbiExplanation && (
            <div className="space-y-6">
              {/* AI Reasoning Section */}
              <div className="p-6 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950 dark:to-blue-950 rounded-xl border-2 border-violet-200 dark:border-violet-800">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-5 w-5 text-violet-600" />
                  <h4 className="font-semibold text-violet-800 dark:text-violet-200">AI Reasoning & Strategy</h4>
                </div>
                <p className="text-violet-700 dark:text-violet-300 leading-relaxed">{hbiExplanation.reasoning}</p>
              </div>
              
              {/* Key Factors Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    Data Points Analyzed
                  </h4>
                  <div className="space-y-2">
                    {hbiExplanation.factors.map((factor: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    Risk Assessment
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="font-medium text-green-800 dark:text-green-200">Low Risk</span>
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-300">Forecast confidence: 87%</p>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        <span className="font-medium text-yellow-800 dark:text-yellow-200">Weather Dependency</span>
                      </div>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">External factor impact: 15%</p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="font-medium text-blue-800 dark:text-blue-200">Market Stability</span>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300">Material cost variance: ±2.3%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Model Performance */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  Model Performance & Confidence
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">94.2%</div>
                    <p className="text-xs text-muted-foreground">Historical Accuracy</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">$2.3M</div>
                    <p className="text-xs text-muted-foreground">Avg. Forecast Precision</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">127</div>
                    <p className="text-xs text-muted-foreground">Similar Projects Analyzed</p>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Information */}
              <Alert className="border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950">
                <Zap className="h-4 w-4 text-violet-600" />
                <AlertDescription className="text-violet-800 dark:text-violet-200">
                  <strong>HBI Advantage:</strong> This AI model continuously learns from project patterns, market conditions, 
                  weather data, and 50+ other variables to provide the most accurate forecast possible. The system has 
                  analyzed over 10,000 similar construction projects to generate these predictions.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 