"use client"

import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Bell } from "lucide-react"
import { Search, Moon, Sun, ChevronDown, Building, Wrench, Briefcase, Archive } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useProjectContext } from "@/context/project-context"
import projectsData from "@/data/mock/projects.json"

/**
 * Enhanced AppHeader Component with Mega-Menu Navigation
 *
 * Features horizontal mega-menu layouts similar to Procore's interface:
 * - Department mega-menu with role-based filtering
 * - Project stage mega-menu with 4-column layout
 * - Tool category mega-menu with 4-column categorization
 * - Enhanced UX with full-width expandable menus
 *
 * @returns {JSX.Element} Enhanced navigation header with mega-menus
 */
export const AppHeader = () => {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  // State management
  const [notifications] = useState(3)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("operations")
  const [showDepartmentMenu, setShowDepartmentMenu] = useState(false)
  const [showProjectMenu, setShowProjectMenu] = useState(false)
  const [showToolMenu, setShowToolMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Refs for click outside detection
  const headerRef = useRef<HTMLElement>(null)
  const departmentMenuRef = useRef<HTMLDivElement>(null)
  const projectMenuRef = useRef<HTMLDivElement>(null)
  const toolMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const departmentMenuContentRef = useRef<HTMLDivElement>(null)
  const projectMenuContentRef = useRef<HTMLDivElement>(null)
  const toolMenuContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Real project data from JSON file
  const projects = useMemo(
    () => {
      const allProjects = { 
        id: "all", 
        name: "All Projects", 
        status: "active", 
        project_stage_name: "All",
        budget: "$0", 
        completion: 0 
      };
      
      const realProjects = projectsData.map((project: any) => ({
        id: project.project_id.toString(),
        name: project.name,
        status: project.active ? "active" : "inactive",
        project_stage_name: project.project_stage_name,
        budget: `$${(project.contract_value / 1000000).toFixed(1)}M`,
        completion: Math.round((project.duration > 0 ? 
          Math.min(100, ((new Date().getTime() - new Date(project.start_date).getTime()) / 
          (1000 * 60 * 60 * 24)) / project.duration * 100) : 0)),
        project_number: project.project_number
      }));
      
      return [allProjects, ...realProjects];
    },
    [],
  )

  // Filtered project stages based on selected department
  const projectStages = useMemo(() => {
    switch (selectedDepartment) {
      case "operations":
        return ["Construction", "Closeout", "Warranty"];
      case "pre-construction":
        return ["Bidding", "Pre-Construction"];
      case "archive":
        return ["Closed"];
      default:
        return ["Construction", "Closeout", "Warranty"];
    }
  }, [selectedDepartment])

  // Before the `tools` useMemo, add a helper function to determine the dashboard path:
  const getDashboardPath = useCallback(() => {
    if (!user) return "/dashboard" // Default or loading state
    switch (user.role) {
      case "admin":
        return "/dashboard/admin"
      case "executive":
        return "/dashboard/exec"
      case "project-executive":
        return "/dashboard/px"
      case "project-manager":
        return "/dashboard/pm"
      default:
        return "/dashboard" // Fallback for other roles or operations
    }
  }, [user])

  /**
   * Reorganized tool categorization into 4 columns as requested
   * @type {Array<Object>}
   */
  const tools = useMemo(
    () => [
      // Core Tools
      {
        name: "Dashboard",
        href: getDashboardPath(), // Dynamically set dashboard path
        category: "Core Tools",
        description: "Project overview and analytics",
      },
      {
        name: "Reports",
        href: "/dashboard/reports",
        category: "Core Tools",
        description: "Comprehensive reporting dashboard with approval workflows",
        visibleRoles: ["project-manager", "project-executive", "executive", "admin"],
      },
      // Removed: Analytics
      {
        name: "Staffing",
        href: "/dashboard/staff-planning",
        category: "Core Tools",
        description: "Resource planning and scheduling",
      },
      {
        name: "Responsibility Matrix",
        href: "/dashboard/responsibility-matrix",
        category: "Core Tools",
        description: "Role assignments and accountability",
      },

      // Financial Management
      {
        name: "Financial Hub",
        href: "/dashboard/financial-hub",
        category: "Financial Management",
        description: "Comprehensive financial management and analysis suite",
      },
      {
        name: "Procurement",
        href: "/dashboard/buyout-schedule",
        category: "Financial Management",
        description: "Subcontract buyout and material procurement management",
      },
      // Removed: Change Management

      // Field Management
      {
        name: "Scheduler",
        href: "/dashboard/scheduler",
        category: "Field Management",
        description: "AI-powered project schedule generation and optimization",
      },
      // Removed: Schedule Monitor
      {
        name: "Constraints Log",
        href: "/dashboard/constraints-log",
        category: "Field Management",
        description: "Track and manage project constraints and resolutions",
      },
      {
        name: "Permit Log",
        href: "/dashboard/permit-log",
        category: "Field Management",
        description: "Permit tracking and compliance",
      },
      {
        name: "Field Reports",
        href: "/dashboard/field-reports",
        category: "Field Management",
        description: "Daily logs, manpower, safety, and quality reporting",
      },
      // Removed: Safety
      // Removed: Quality Control

      // Compliance
      // Removed: Document Compliance
      // Removed: Prime Contracts
      // Removed: Commitments

      // Pre-Construction (filtered by department)
      {
        name: "Business Development",
        href: "/tools/coming-soon",
        category: "Pre-Construction",
        description: "Lead generation and pursuit",
      },
      {
        name: "Estimating",
        href: "/pre-con/estimating",
        category: "Pre-Construction",
        description: "Cost estimation tools",
      },
      {
        name: "VDC",
        href: "/tools/coming-soon",
        category: "Pre-Construction",
        description: "Virtual design and construction",
      },
      {
        name: "Pre-Con Dashboard",
        href: "/pre-con",
        category: "Pre-Construction",
        description: "Pre-construction overview",
      },
    ],
    [getDashboardPath], // Add getDashboardPath to dependencies
  )

  // Utility functions
  const getUserInitials = useCallback(() => {
    if (!user) return "U"
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
  }, [user])

  const hasPreConAccess = useCallback(() => {
    if (!user) return false
    // Corrected: Replaced 'c-suite' with 'executive'
    if (["executive", "project-executive", "estimator", "admin"].includes(user.role)) return true
    if (user.role === "project-manager") return user.permissions?.preConAccess === true
    return false
  }, [user])

  // Get project status color (keeping this for status badges)
  const getProjectStatusColor = useCallback((project: any) => {
    if (!project.active) {
      return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800"
    }
    
    // Color based on project stage
    switch (project.project_stage_name) {
      case "Pre-Construction":
      case "Bidding":
        return "bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
      case "BIM Coordination":
        return "bg-purple-100 dark:bg-purple-950/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800"
      case "Construction":
        return "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
      case "Closeout":
        return "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
      case "Warranty":
        return "bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800"
      case "Closed":
        return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800"
      default:
        return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800"
    }
  }, [])



  // Enhanced filtered tools with department-based and role-based filtering
  const filteredTools = useMemo(() => {
    const userRole = user?.role // Get current user's role
    return tools.filter((tool) => {
      // Filter by department (if applicable)
      const isDepartmentMatch =
        selectedDepartment === "pre-construction"
          ? tool.category === "Pre-Construction"
          : tool.category !== "Pre-Construction"

      // Filter by role visibility
      const isRoleVisible = !tool.visibleRoles || (userRole && tool.visibleRoles.includes(userRole))

      return isDepartmentMatch && isRoleVisible
    })
  }, [selectedDepartment, tools, user]) // Add user to dependencies

  // Utility functions
  // ... (getUserInitials, hasPreConAccess, getProjectStatusColor functions defined above)

  // Event handlers with debugging
  const handleDepartmentChange = useCallback(
    (department: string) => {
      console.log("Department changed to:", department)
      setSelectedDepartment(department)
      setShowDepartmentMenu(false)
      setShowProjectMenu(false)
      setShowToolMenu(false)
      setShowUserMenu(false)

      // Navigate to department-specific dashboard
      const targetPath = department === "operations" ? "/dashboard" : "/pre-con"
      console.log("Navigating to:", targetPath)
      router.push(targetPath)

      // Dispatch custom event for other components
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("departmentChanged", {
            detail: { department, timestamp: new Date().toISOString() },
          }),
        )
      }
    },
    [router],
  )

  const { projectId, setProjectId } = useProjectContext()

  const handleProjectChange = useCallback(
    (projectId: string) => {
      console.log("Project changed to:", projectId)
      setSelectedProject(projectId)
      setProjectId(projectId) // <-- Sync with context
      setShowProjectMenu(false)

      if (typeof window !== "undefined") {
        localStorage.setItem("selectedProject", projectId)
      }

      // Navigate to project-specific view if not "all"
      if (projectId !== "all") {
        const targetPath = `/dashboard/project/${projectId}`
        console.log("Navigating to:", targetPath)
        router.push(targetPath)
      }

      // Dispatch event with enhanced details
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("projectChanged", {
            detail: {
              projectId,
              projectName: projects.find((p) => p.id === projectId)?.name || "All Projects",
              timestamp: new Date().toISOString(),
            },
          }),
        )
      }
    },
    [projects, router, setProjectId]
  )

  const handleToolNavigation = useCallback(
    (href: string) => {
      console.log("Tool navigation triggered:", href)
      setShowToolMenu(false)
      setShowDepartmentMenu(false)
      setShowProjectMenu(false)
      setShowUserMenu(false)

      // Add a small delay to ensure menu closes before navigation
      setTimeout(() => {
        console.log("Executing navigation to:", href)
        router.push(href)
      }, 100)
    },
    [router],
  )

  const handleLogout = useCallback(() => {
    console.log("User logging out")
    logout()
    router.push("/login")
  }, [logout, router])

  // Close all menus
  const closeAllMenus = useCallback(() => {
    setShowDepartmentMenu(false)
    setShowProjectMenu(false)
    setShowToolMenu(false)
    setShowUserMenu(false)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Check if click is outside department menu
      if (
        showDepartmentMenu &&
        departmentMenuContentRef.current &&
        !departmentMenuContentRef.current.contains(target) &&
        !headerRef.current?.contains(target)
      ) {
        setShowDepartmentMenu(false)
      }

      // Check if click is outside project menu
      if (
        showProjectMenu &&
        projectMenuContentRef.current &&
        !projectMenuContentRef.current.contains(target) &&
        !headerRef.current?.contains(target)
      ) {
        setShowProjectMenu(false)
      }

      // Check if click is outside tool menu
      if (
        showToolMenu &&
        toolMenuContentRef.current &&
        !toolMenuContentRef.current.contains(target) &&
        !headerRef.current?.contains(target)
      ) {
        setShowToolMenu(false)
      }

      // Check if click is outside user menu
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDepartmentMenu, showProjectMenu, showToolMenu, showUserMenu])

  // Load saved project on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProject = localStorage.getItem("selectedProject")
      if (savedProject) {
        setSelectedProject(savedProject)
      }
    }
  }, [])

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-[100] flex h-20 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#1e3a8a] to-[#2a5298] px-8 shadow-lg backdrop-blur-sm"
      >
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
              <span className="text-base font-bold text-[#1e3a8a]">HB</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-tight">HB Report</span>
              <span className="text-xs text-blue-100 font-medium">Construction Intelligence</span>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="hidden lg:flex items-center space-x-2">
            {/* Department Picker */}
            <Button
              variant="ghost"
              size="default"
              className={`gap-3 px-5 py-2.5 text-white transition-all duration-200 hover:bg-white/20 hover:shadow-md ${
                showDepartmentMenu ? "bg-white/20 shadow-md" : ""
              } ${selectedDepartment !== "operations" ? "bg-white/10" : ""} rounded-lg font-medium`}
              onClick={() => {
                setShowDepartmentMenu(!showDepartmentMenu)
                setShowProjectMenu(false)
                setShowToolMenu(false)
                setShowUserMenu(false)
              }}
              aria-label="Select department"
              aria-expanded={showDepartmentMenu}
            >
              <Briefcase className="h-4 w-4" />
              <span className="capitalize">
                {selectedDepartment === "operations" 
                  ? "Operations" 
                  : selectedDepartment === "pre-construction" 
                    ? "Pre-Construction" 
                    : "Archive"
                }
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDepartmentMenu ? "rotate-180" : ""}`} />
            </Button>

            {/* Project Picker */}
            <Button
              variant="ghost"
              size="default"
              className={`gap-3 max-w-64 px-5 py-2.5 text-white transition-all duration-200 hover:bg-white/20 hover:shadow-md ${
                showProjectMenu ? "bg-white/20 shadow-md" : ""
              } ${selectedProject !== "all" ? "bg-white/10" : ""} rounded-lg font-medium`}
              onClick={() => {
                setShowProjectMenu(!showProjectMenu)
                setShowDepartmentMenu(false)
                setShowToolMenu(false)
                setShowUserMenu(false)
              }}
              aria-label="Select project"
              aria-expanded={showProjectMenu}
            >
              <Building className="h-4 w-4" />
              <span className="truncate">
                {(() => {
                  if (selectedProject.startsWith('all-')) {
                    const stageName = selectedProject.replace('all-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    return `All ${stageName} Projects`;
                  }
                  return projects.find((p) => p.id === selectedProject)?.name || "All Projects";
                })()}
              </span>
                              {selectedProject !== "all" && (
                  <Badge variant="secondary" className="ml-1 border-white/30 bg-white/20 text-xs text-white shadow-sm">
                    {selectedProject.startsWith('all-') ? 'Stage Filter' : 'Filtered'}
                  </Badge>
                )}
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showProjectMenu ? "rotate-180" : ""}`} />
            </Button>

            {/* Tool Picker */}
            <Button
              variant="ghost"
              size="default"
              className={`gap-3 px-5 py-2.5 text-white transition-all duration-200 hover:bg-white/20 hover:shadow-md ${
                showToolMenu ? "bg-white/20 shadow-md" : ""
              } rounded-lg font-medium`}
              onClick={() => {
                setShowToolMenu(!showToolMenu)
                setShowDepartmentMenu(false)
                setShowProjectMenu(false)
                setShowUserMenu(false)
              }}
              aria-label="Select tool"
              aria-expanded={showToolMenu}
            >
              <Wrench className="h-4 w-4" />
              <span>Tools</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showToolMenu ? "rotate-180" : ""}`} />
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="default"
            className="lg:hidden text-white hover:bg-white/20 px-3 py-2 rounded-lg"
            onClick={() => {
              // Toggle mobile menu - you can implement this later
              console.log("Mobile menu clicked")
            }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>

        {/* Right Section - Search, Actions, User Menu */}
        <div className="flex items-center space-x-4">
          {/* Beta Badge */}
          <Badge variant="secondary" className="hidden text-xs font-medium text-blue-800 dark:text-blue-200 sm:inline-flex bg-blue-100 dark:bg-blue-950/30 px-3 py-1 rounded-full">
            Beta v2.1
          </Badge>

          {/* Desktop Search */}
          <div className="relative hidden xl:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-white/60" />
            <Input
              placeholder="Search projects, tools, reports..."
              className="w-80 h-10 border-white/30 bg-white/15 pl-11 pr-4 placeholder:text-white/60 focus:border-white/50 focus:bg-white/25 text-white rounded-lg backdrop-blur-sm transition-all duration-200"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const query = (e.target as HTMLInputElement).value
                  router.push(`/search?q=${encodeURIComponent(query)}`)
                }
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 xl:hidden p-2.5 rounded-lg"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              aria-label="Toggle search"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-white hover:bg-white/20 p-2.5 rounded-lg transition-all duration-200"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-white hover:bg-white/20 p-2.5 rounded-lg transition-all duration-200"
              onClick={() => router.push("/notifications")}
              aria-label={`Notifications ${notifications > 0 ? `(${notifications} unread)` : ""}`}
            >
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs text-white bg-red-500 border-2 border-white rounded-full shadow-lg">
                  {notifications}
                </Badge>
              )}
            </Button>
          </div>

          {/* User Dropdown */}
          {user && (
            <div className="relative">
              <Button
                variant="ghost"
                className="h-11 px-3 text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                onClick={() => {
                  setShowUserMenu(!showUserMenu)
                  setShowDepartmentMenu(false)
                  setShowProjectMenu(false)
                  setShowToolMenu(false)
                }}
                aria-label="User menu"
                aria-expanded={showUserMenu}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8 ring-2 ring-white/20">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.firstName} />
                    <AvatarFallback className="bg-white text-[#1e3a8a] font-semibold">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-medium text-white">{user.firstName}</span>
                    <span className="text-xs text-blue-100 capitalize">{user.role}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
                </div>
              </Button>

              {showUserMenu && (
                <div className="fixed right-8 top-24 z-[110] w-72 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl backdrop-blur-lg">
                  <div className="rounded-t-xl border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.firstName} />
                        <AvatarFallback className="bg-blue-600 text-white font-semibold">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm capitalize text-gray-500 dark:text-gray-400">{user.role}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">Online</div>
                      </div>
                    </div>
                  </div>
                  <div className="py-3">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        router.push("/profile")
                      }}
                      className="w-full px-6 py-3 text-left text-sm text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-3"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        router.push("/settings")
                      }}
                      className="w-full px-6 py-3 text-left text-sm text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-3"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Account Settings</span>
                    </button>
                    <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        handleLogout()
                      }}
                      className="w-full px-6 py-3 text-left text-sm text-red-600 dark:text-red-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-3"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Menu Overlay */}
      {(showDepartmentMenu || showProjectMenu || showToolMenu) && (
        <div 
          className="fixed inset-0 top-20 z-[104] bg-black/20 backdrop-blur-sm"
          onClick={closeAllMenus}
        />
      )}

      {/* Department Mega Menu */}
      {showDepartmentMenu && (
        <div
          ref={departmentMenuContentRef}
          className="fixed left-0 right-0 top-20 z-[105] border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 shadow-xl backdrop-blur-lg animate-in slide-in-from-top-2 duration-300"
        >
          <div className="mx-auto max-w-7xl px-8 py-10">
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="border-b border-gray-200 dark:border-gray-700 pb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Operations</h3>
                <button
                  onClick={() => handleDepartmentChange("operations")}
                  className={`group w-full text-left rounded-xl border p-6 transition-all duration-200 ${
                    selectedDepartment === "operations"
                      ? "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 shadow-md"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      selectedDepartment === "operations" 
                        ? "bg-blue-100 dark:bg-blue-900/30" 
                        : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                    }`}>
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Operations Dashboard</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Project management and execution tools</div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="border-b border-gray-200 dark:border-gray-700 pb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Pre-Construction</h3>
                <button
                  onClick={() => handleDepartmentChange("pre-construction")}
                  className={`group w-full text-left rounded-xl border p-6 transition-all duration-200 ${
                    selectedDepartment === "pre-construction"
                      ? "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 shadow-md"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      selectedDepartment === "pre-construction" 
                        ? "bg-blue-100 dark:bg-blue-900/30" 
                        : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                    }`}>
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Pre-Construction Suite</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Estimating, VDC, and business development</div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="border-b border-gray-200 dark:border-gray-700 pb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Archive</h3>
                <button
                  onClick={() => handleDepartmentChange("archive")}
                  className={`group w-full text-left rounded-xl border p-6 transition-all duration-200 ${
                    selectedDepartment === "archive"
                      ? "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 shadow-md"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      selectedDepartment === "archive" 
                        ? "bg-blue-100 dark:bg-blue-900/30" 
                        : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                    }`}>
                      <Archive className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Project Archive</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed and closed projects</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Mega Menu */}
      {showProjectMenu && (
        <div
          ref={projectMenuContentRef}
          className="fixed left-0 right-0 top-20 z-[105] border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 shadow-xl backdrop-blur-lg animate-in slide-in-from-top-2 duration-300"
        >
          <div className="mx-auto max-w-7xl px-8 py-10">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {selectedDepartment === "archive" ? "Project Archive" : "Select Project by Stage"}
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {selectedDepartment === "archive" 
                  ? "View completed and closed projects" 
                  : selectedDepartment === "pre-construction"
                    ? "Choose from projects in pre-construction phases"
                    : "Choose from active projects organized by construction phase"
                }
              </p>
            </div>

            <div className={`grid gap-8 ${
              selectedDepartment === "archive" ? "grid-cols-1 max-w-md" :
              selectedDepartment === "pre-construction" ? "grid-cols-2 max-w-2xl" :
              "grid-cols-3"
            }`}>
              {projectStages.map((stage) => (
                <div key={stage} className="space-y-4">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{stage}</h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log("All projects button clicked for stage:", stage)
                        handleProjectChange(`all-${stage.toLowerCase().replace(/\s+/g, '-')}`)
                      }}
                      className={`mt-1 text-xs transition-colors underline-offset-2 hover:underline ${
                        selectedProject === `all-${stage.toLowerCase().replace(/\s+/g, '-')}`
                          ? "text-blue-800 dark:text-blue-200 font-medium underline"
                          : "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      }`}
                    >
                      All {stage} Projects
                    </button>
                  </div>
                  <div className="space-y-2">
                    {projects
                      .filter((p) => {
                        if (p.id === "all") return false; // Don't show "All Projects" in stage columns
                        
                        // Special handling for Pre-Construction stage to include BIM Coordination
                        if (stage === "Pre-Construction") {
                          return p.project_stage_name === "Pre-Construction" || p.project_stage_name === "BIM Coordination";
                        }
                        
                        return p.project_stage_name === stage;
                      })
                      .map((project) => (
                        <button
                          key={project.id}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log("Project button clicked:", project.name, project.id)
                            handleProjectChange(project.id)
                          }}
                          className={`w-full text-left rounded-lg border p-3 transition-colors ${
                            selectedProject === project.id
                              ? "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="truncate font-medium text-gray-900 dark:text-gray-100">{project.name}</span>
                              {project.id !== "all" && (
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${getProjectStatusColor(project)}`}
                                >
                                  {project.project_stage_name}
                                </Badge>
                              )}
                            </div>
                            {project.id !== "all" && (
                              <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                                <div>Project #{project.project_number || project.id}</div>
                                <div className="flex justify-between">
                                  <span>Budget: {project.budget}</span>
                                  <span>{project.completion}% Complete</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tools Mega Menu - Now with 4 columns */}
      {showToolMenu && (
        <div
          ref={toolMenuContentRef}
          className="fixed left-0 right-0 top-20 z-[105] border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 shadow-2xl backdrop-blur-lg animate-in slide-in-from-top-2 duration-300"
        >
          <div className="mx-auto max-w-7xl px-8 py-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Construction Tools</h2>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Access your project management suite</p>
              </div>
              {selectedDepartment === "pre-construction" && (
                <Badge variant="secondary" className="text-xs text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-950/30 px-2 py-1">
                  Pre-Construction Suite
                </Badge>
              )}
              {selectedDepartment === "archive" && (
                <Badge variant="secondary" className="text-xs text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-950/30 px-2 py-1">
                  Archive View
                </Badge>
              )}
            </div>

            {selectedDepartment === "pre-construction" ? (
              // Pre-Construction Tools - Single Column
              <div className="max-w-md">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <div className="w-2 h-2 bg-hb-blue rounded-full"></div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Pre-Construction</h3>
                  </div>
                  <div className="space-y-1">
                    {filteredTools
                      .filter((tool) => tool.category === "Pre-Construction")
                      .map((tool) => (
                        <button
                          key={tool.href}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log("Navigating to tool:", tool.name, "at", tool.href)
                            handleToolNavigation(tool.href)
                          }}
                          className="w-full text-left rounded-md border border-transparent p-2.5 transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm group"
                        >
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-hb-blue transition-colors">
                              {tool.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{tool.description}</div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            ) : selectedDepartment === "archive" ? (
              // Archive Tools - Limited Options
              <div className="max-w-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Archive Tools</h3>
                  </div>
                  <div className="space-y-1">
                    {[
                      { name: "Reports", href: "/dashboard/reports", description: "View historical project reports and documentation" },
                      { name: "Financial Reports", href: "/dashboard/financial-hub", description: "Access closed project financial data" },
                      { name: "Document Archive", href: "/tools/coming-soon", description: "Browse project documentation library" }
                    ].map((tool) => (
                      <button
                        key={tool.href}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log("Navigating to tool:", tool.name, "at", tool.href)
                          handleToolNavigation(tool.href)
                        }}
                        className="w-full text-left rounded-md border border-transparent p-2.5 transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm group"
                      >
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-hb-blue transition-colors">
                            {tool.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{tool.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Operations Tools - 4 Columns
              <div className="grid grid-cols-4 gap-8">
                {/* Column 1: Core Tools */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <div className="w-2 h-2 bg-hb-blue rounded-full"></div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Core Tools</h3>
                  </div>
                  <div className="space-y-1">
                    {filteredTools
                      .filter((tool) => tool.category === "Core Tools")
                      .map((tool) => (
                        <button
                          key={tool.href}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log("Navigating to tool:", tool.name, "at", tool.href)
                            handleToolNavigation(tool.href)
                          }}
                          className="w-full text-left rounded-md border border-transparent p-2.5 transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm group"
                        >
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-hb-blue transition-colors">
                              {tool.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{tool.description}</div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Column 2: Financial Management */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Financial Management
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {filteredTools
                      .filter((tool) => tool.category === "Financial Management")
                      .map((tool) => (
                        <button
                          key={tool.href}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log("Navigating to tool:", tool.name, "at", tool.href)
                            handleToolNavigation(tool.href)
                          }}
                          className="w-full text-left rounded-md border border-transparent p-2.5 transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm group"
                        >
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-hb-blue transition-colors">
                              {tool.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{tool.description}</div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Column 3: Field Management */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <div className="w-2 h-2 bg-hb-orange rounded-full"></div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Field Management</h3>
                  </div>
                  <div className="space-y-1">
                    {filteredTools
                      .filter((tool) => tool.category === "Field Management")
                      .map((tool) => (
                        <button
                          key={tool.href}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log("Navigating to tool:", tool.name, "at", tool.href)
                            handleToolNavigation(tool.href)
                          }}
                          className="w-full text-left rounded-md border border-transparent p-2.5 transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm group"
                        >
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-hb-blue transition-colors">
                              {tool.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{tool.description}</div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Column 4: Compliance */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Compliance</h3>
                  </div>
                  <div className="space-y-1">
                    {filteredTools
                      .filter((tool) => tool.category === "Compliance")
                      .map((tool) => (
                        <button
                          key={tool.href}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log("Navigating to tool:", tool.name, "at", tool.href)
                            handleToolNavigation(tool.href)
                          }}
                          className="w-full text-left rounded-md border border-transparent p-2.5 transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm group"
                        >
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-hb-blue transition-colors">
                              {tool.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{tool.description}</div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <>
          <div 
            className="fixed inset-0 top-20 z-[104] bg-black/20 backdrop-blur-sm"
            onClick={() => setShowMobileSearch(false)}
          />
          <div className="fixed left-0 right-0 top-20 z-[105] border-b border-white/20 bg-gradient-to-r from-[#1e3a8a] to-[#2a5298] p-6 xl:hidden backdrop-blur-lg animate-in slide-in-from-top-2 duration-300">
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white/60" />
              <Input
                placeholder="Search projects, tools, reports..."
                className="w-full h-12 border-white/30 bg-white/15 pl-12 pr-4 placeholder:text-white/60 focus:border-white/50 focus:bg-white/25 text-white rounded-lg backdrop-blur-sm transition-all duration-200"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const query = (e.target as HTMLInputElement).value
                    router.push(`/search?q=${encodeURIComponent(query)}`)
                    setShowMobileSearch(false)
                  }
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}
