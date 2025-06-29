"use client"

import * as React from "react"
import {
  MessageSquare,
  List,
  X,
  Send,
  Search,
  Filter,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Paperclip,
  ChevronDown,
  MoreHorizontal,
  Smile,
  ImageIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

interface MessagingPanelProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  newTask?: { title: string; description: string } | null
  newMessage?: { text: string; context: string } | null
  clearNewContent: () => void
}

interface Message {
  id: string
  sender: {
    name: string
    avatar: string
    initials: string
    online: boolean
  }
  text: string
  time: string
  isMe: boolean
  attachments?: {
    type: "image" | "file" | "link" | "reference"
    name: string
    preview?: string
    url?: string
  }[]
  reactions?: {
    emoji: string
    count: number
    users: string[]
  }[]
}

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  assignee: {
    name: string
    avatar: string
    initials: string
  }
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  tags: string[]
  progress: number
  comments?: number
  attachments?: number
}

// Mock data for messages
const mockMessages: Message[] = [
  {
    id: "msg1",
    sender: {
      name: "John Doe",
      avatar: "",
      initials: "JD",
      online: true,
    },
    text: "Hey team, just a reminder about the Q3 budget review meeting tomorrow at 11 AM. Please come prepared with your department's latest projections.",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: "msg2",
    sender: {
      name: "You",
      avatar: "",
      initials: "ME",
      online: true,
    },
    text: "Got it, John! I'll have the Pre-Con numbers ready. Is there a specific format you prefer for the projections?",
    time: "10:35 AM",
    isMe: true,
  },
  {
    id: "msg3",
    sender: {
      name: "John Doe",
      avatar: "",
      initials: "JD",
      online: true,
    },
    text: "A simple summary of key line items and any significant variances from previous forecasts would be great. Thanks!",
    time: "10:38 AM",
    isMe: false,
  },
  {
    id: "msg4",
    sender: {
      name: "Jane Smith",
      avatar: "",
      initials: "JS",
      online: false,
    },
    text: "Confirming my attendance and will bring the Operations report. Looking forward to it!",
    time: "10:40 AM",
    isMe: false,
    reactions: [
      { emoji: "👍", count: 2, users: ["You", "John Doe"] },
      { emoji: "🎉", count: 1, users: ["You"] },
    ],
  },
  {
    id: "msg5",
    sender: {
      name: "Alex Johnson",
      avatar: "",
      initials: "AJ",
      online: true,
    },
    text: "I've attached the latest site photos from Project X. The foundation work is progressing well despite the rain last week.",
    time: "11:15 AM",
    isMe: false,
    attachments: [
      {
        type: "image",
        name: "site-photo-1.jpg",
        preview: "/placeholder.svg?height=80&width=120",
        url: "#",
      },
      {
        type: "image",
        name: "site-photo-2.jpg",
        preview: "/placeholder.svg?height=80&width=120",
        url: "#",
      },
    ],
  },
]

// Mock data for tasks
const mockTasks: Task[] = [
  {
    id: "task1",
    title: "Review Q3 Budget Projections",
    description:
      "Prepare detailed financial projections for the third quarter, focusing on cost variances and revenue forecasts.",
    dueDate: "2025-06-18",
    assignee: {
      name: "John Doe",
      avatar: "",
      initials: "JD",
    },
    status: "todo",
    priority: "high",
    tags: ["Finance", "Q3"],
    progress: 0,
    comments: 3,
  },
  {
    id: "task2",
    title: "Update Project X Schedule",
    description:
      "Incorporate recent changes to the Project X scope into the master schedule and distribute to stakeholders.",
    dueDate: "2025-06-20",
    assignee: {
      name: "Jane Smith",
      avatar: "",
      initials: "JS",
    },
    status: "in-progress",
    priority: "medium",
    tags: ["Project X", "Schedule"],
    progress: 60,
    comments: 2,
    attachments: 1,
  },
  {
    id: "task3",
    title: "Draft New Vendor Contract",
    description:
      "Prepare the initial draft of the contract for the new HVAC supplier, ensuring all legal clauses are included.",
    dueDate: "2025-06-25",
    assignee: {
      name: "You",
      avatar: "",
      initials: "ME",
    },
    status: "review",
    priority: "urgent",
    tags: ["Legal", "Procurement"],
    progress: 90,
    comments: 5,
    attachments: 2,
  },
  {
    id: "task4",
    title: "Safety Inspection Preparation",
    description:
      "Ensure all safety documentation is up to date and site conditions meet regulatory requirements before next week's inspection.",
    dueDate: "2025-06-19",
    assignee: {
      name: "Robert Chen",
      avatar: "",
      initials: "RC",
    },
    status: "done",
    priority: "high",
    tags: ["Safety", "Compliance"],
    progress: 100,
  },
]

/**
 * MessagingPanel component provides a draggable and resizable floating window
 * for messaging and task management with enhanced UI and interactivity.
 */
export default function MessagingPanel({
  isOpen,
  setIsOpen,
  newTask,
  newMessage,
  clearNewContent,
}: MessagingPanelProps) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  // Initial position anchored to bottom-left, considering panel size and button offset
  const [position, setPosition] = React.useState({ x: 20, y: window.innerHeight - 600 - 20 })
  const [size, setSize] = React.useState({ width: 450, height: 600 }) // Initial size
  const [isDragging, setIsDragging] = React.useState(false)
  const [isResizing, setIsResizing] = React.useState(false)
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = React.useState("messages")
  const [messages, setMessages] = React.useState<Message[]>(mockMessages)
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks)
  const [messageInput, setMessageInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const [taskFilter, setTaskFilter] = React.useState<string>("all")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Handle new content from context menu
  React.useEffect(() => {
    if (newTask) {
      // Add the new task from context menu
      const newTaskObj: Task = {
        id: `task${tasks.length + 1}`,
        title: newTask.title,
        description: newTask.description,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 week from now
        assignee: {
          name: "You",
          avatar: "",
          initials: "ME",
        },
        status: "todo",
        priority: "medium",
        tags: ["New"],
        progress: 0,
      }
      setTasks([...tasks, newTaskObj])
      setActiveTab("tasks")
      clearNewContent()
    }

    if (newMessage) {
      // Add the new message from context menu
      const newMessageObj: Message = {
        id: `msg${messages.length + 1}`,
        sender: {
          name: "You",
          avatar: "",
          initials: "ME",
          online: true,
        },
        text: newMessage.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
        attachments: [
          {
            type: "reference",
            name: newMessage.context,
          },
        ],
      }
      setMessages([...messages, newMessageObj])
      setActiveTab("messages")
      clearNewContent()
    }
  }, [newTask, newMessage, tasks, messages, clearNewContent])

  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - panelRef.current.getBoundingClientRect().left,
        y: e.clientY - panelRef.current.getBoundingClientRect().top,
      })
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
  }

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragOffset.y)),
        })
      } else if (isResizing) {
        const newWidth = e.clientX - (panelRef.current?.getBoundingClientRect().left || 0)
        const newHeight = e.clientY - (panelRef.current?.getBoundingClientRect().top || 0)
        setSize({
          width: Math.max(350, Math.min(window.innerWidth - position.x, newWidth)),
          height: Math.max(400, Math.min(window.innerHeight - position.y, newHeight)),
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, position, size])

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMsg: Message = {
        id: `msg${messages.length + 1}`,
        sender: {
          name: "You",
          avatar: "",
          initials: "ME",
          online: true,
        },
        text: messageInput,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
      }
      setMessages([...messages, newMsg])
      setMessageInput("")

      // Simulate response after a delay
      setTimeout(() => {
        setIsTyping(true)

        setTimeout(() => {
          setIsTyping(false)
          const responseMsg: Message = {
            id: `msg${messages.length + 2}`,
            sender: {
              name: "John Doe",
              avatar: "",
              initials: "JD",
              online: true,
            },
            text: "Thanks for the update! I'll review this and get back to you soon.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isMe: false,
          }
          setMessages((prev) => [...prev, responseMsg])
        }, 3000)
      }, 1000)
    }
  }

  const handleCreateTask = () => {
    const newTaskObj: Task = {
      id: `task${tasks.length + 1}`,
      title: "New Task",
      description: "Task description goes here",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 week from now
      assignee: {
        name: "You",
        avatar: "",
        initials: "ME",
      },
      status: "todo",
      priority: "medium",
      tags: ["New"],
      progress: 0,
    }
    setTasks([...tasks, newTaskObj])
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "review":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTasks = taskFilter === "all" ? tasks : tasks.filter((task) => task.status === taskFilter)

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      className="fixed z-[100] bg-card text-card-foreground rounded-lg shadow-2xl flex flex-col overflow-hidden border border-border"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      {/* Panel Header (Draggable) */}
      <div
        className="flex items-center justify-between p-3 border-b border-border cursor-grab active:cursor-grabbing bg-primary text-primary-foreground"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">Collaboration Hub</h3>
          <Badge variant="outline" className="bg-primary-foreground/20 text-primary-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>3 Online
          </Badge>
        </div>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Users className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Team Members</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Panel Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-background p-1">
          <TabsList className="grid w-auto grid-cols-2 rounded-md bg-muted">
            <TabsTrigger
              value="messages"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
              <Badge className="ml-2 bg-blue-500 text-white">5</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <List className="mr-2 h-4 w-4" />
              Tasks
              <Badge className="ml-2 bg-blue-500 text-white">4</Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="messages" className="mt-0 flex-grow flex flex-col overflow-hidden p-0">
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
              {/* Online Users */}
              <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-border">
                <div className="text-sm text-muted-foreground">Online:</div>
                <div className="flex -space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-xs bg-blue-500 text-white">ME</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>You</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-xs bg-gray-500 text-white">JD</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>John Doe</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-xs bg-gray-500 text-white">AJ</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>Alex Johnson</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Messages */}
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start space-x-3 ${message.isMe ? "justify-end" : ""}`}>
                  {!message.isMe && (
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        {message.sender.avatar ? (
                          <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                        ) : (
                          <AvatarFallback
                            className={message.sender.online ? "bg-gray-500 text-white" : "bg-gray-300 text-gray-600"}
                          >
                            {message.sender.initials}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {message.sender.online && (
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white"></span>
                      )}
                    </div>
                  )}

                  <div className={`flex flex-col ${message.isMe ? "items-end" : "items-start"}`}>
                    <div
                      className={`p-3 rounded-lg max-w-[85%] ${
                        message.isMe ? "bg-blue-100 text-blue-900" : "bg-muted text-foreground"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold">{message.sender.name}</p>
                        <span className="text-xs text-muted-foreground ml-2">{message.time}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment, idx) => (
                            <div key={idx} className="rounded-md overflow-hidden">
                              {attachment.type === "image" && attachment.preview && (
                                <div className="mt-1">
                                  <img
                                    src={attachment.preview || "/placeholder.svg"}
                                    alt={attachment.name}
                                    className="rounded-md max-h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">{attachment.name}</p>
                                </div>
                              )}
                              {attachment.type === "reference" && (
                                <div className="bg-background/50 p-2 rounded-md border border-border text-xs text-muted-foreground">
                                  {attachment.name}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex mt-1 space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-background rounded-full px-2 py-0.5 text-xs border border-border flex items-center space-x-1 cursor-pointer hover:bg-muted">
                                <span>{message.reactions[0].emoji}</span>
                                <span>{message.reactions[0].count}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{message.reactions[0].users.join(", ")}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>

                  {message.isMe && (
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        {message.sender.avatar ? (
                          <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                        ) : (
                          <AvatarFallback className="bg-blue-500 text-white">{message.sender.initials}</AvatarFallback>
                        )}
                      </Avatar>
                      {message.sender.online && (
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white"></span>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-500 text-white">JD</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                        style={{ animationDelay: "600ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-2 mb-2">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Type your message..."
                className="flex-grow"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-0 flex-grow flex flex-col overflow-hidden p-0">
          <div className="border-b border-border p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    {taskFilter === "all"
                      ? "All Tasks"
                      : taskFilter === "todo"
                        ? "To Do"
                        : taskFilter === "in-progress"
                          ? "In Progress"
                          : taskFilter === "review"
                            ? "In Review"
                            : "Completed"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setTaskFilter("all")}>All Tasks</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTaskFilter("todo")}>To Do</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTaskFilter("in-progress")}>In Progress</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTaskFilter("review")}>In Review</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTaskFilter("done")}>Completed</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="text-sm text-muted-foreground">
                {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
              </div>
            </div>

            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-8" onClick={handleCreateTask}>
              New Task
            </Button>
          </div>

          <ScrollArea className="flex-grow">
            <div className="p-4 space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col p-3 border rounded-lg bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">{getStatusIcon(task.status)}</div>
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <p className="font-semibold text-sm">{task.title}</p>
                          <Badge className={`ml-2 text-xs ${getPriorityClass(task.priority)}`}>{task.priority}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()} | Assigned: {task.assignee.name}
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                        <DropdownMenuItem>Reassign</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-sm mt-2">{task.description}</p>

                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-1" />
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3">
                      {task.comments && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {task.comments}
                        </div>
                      )}

                      {task.attachments && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Paperclip className="h-3 w-3 mr-1" />
                          {task.attachments}
                        </div>
                      )}

                      <Avatar className="h-6 w-6">
                        {task.assignee.avatar ? (
                          <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                        ) : (
                          <AvatarFallback className="text-xs bg-gray-500 text-white">
                            {task.assignee.initials}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-primary-foreground cursor-nwse-resize rounded-tl-lg"
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  )
}
