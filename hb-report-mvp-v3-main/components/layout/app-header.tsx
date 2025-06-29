"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Search, Bell, Moon, Sun, ChevronDown, Building, Wrench, Briefcase } from "lucide-react"
import { useTheme } from "next-themes"

/**
 * Enhanced AppHeader Component with Mega-Menu Navigation
 *
 * Features horizontal mega-menu layouts similar to Procore's interface:
 * - Department mega-menu with role-based filtering
 * - Project stage mega-menu with 4-column layout
 * - Tool category mega-menu with 3-column categorization
 * - Enhanced UX with full-width expandable menus
 *
 * @returns {JSX.Element} Enhanced navigation header with mega-menus
 */
export function AppHeader() {
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

  // Refs for click outside detection
  const headerRef = useRef<HTMLElement>(null)
  const departmentMenuRef = useRef<HTMLDivElement>(null)
  const projectMenuRef = useRef<HTMLDivElement>(null)
  const toolMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const departmentMenuContentRef = useRef<HTMLDivElement>(null)
  const projectMenuContentRef = useRef<HTMLDivElement>(null)
  const toolMenuContentRef = useRef<HTMLDivElement>(null)

  // Enhanced project data with realistic construction projects
  const projects = useMemo(
    () => [
      { id: "all", name: "All Projects", status: "active", stage: "active", budget: "$0", completion: 0 },
      {
        id: "1000",
        name: "Tropical World Nursery",
        status: "active",
        stage: "construction",
        budget: "$2.4M",
        completion: 65,
      },
      {
        id: "2000",
        name: "Metro Office Complex",
        status: "active",
        stage: "construction",
        budget: "$8.7M",
        completion: 42,
      },
      { id: "3000", name: "Panther Tower", status: "planning", stage: "startup", budget: "$15.2M", completion: 8 },
      { id: "4000", name: "Aviation Hangar", status: "on-hold", stage: "closeout", budget: "$5.1M", completion: 88 },
      {
        id: "5000",
        name: "Residential Complex",
        status: "completed",
        stage: "closed",
        budget: "$12.3M",
        completion: 100,
      },
      { id: "6000", name: "Downtown Plaza", status: "planning", stage: "startup", budget: "$22.8M", completion: 12 },
      { id: "7000", name: "Industrial Park", status: "on-hold", stage: "closeout", budget: "$18.5M", completion: 92 },
      { id: "8000", name: "Medical Center", status: "completed", stage: "closed", budget: "$35.7M", completion: 100 },
    ],
    [],
  )

  /**
   * Enhanced tool categorization with more realistic construction tools.
   * All new placeholder pages now point to a single 'Coming Soon' page.
   * @type {Array<Object>}
   */
  const tools = useMemo(
    () => [
      // Core Tools
      { name: "Dashboard", href: "/dashboard", category: "Core Tools", description: "Project overview and analytics" },
      { name: "Reports", href: "/project-reports", category: "Core Tools", description: "Custom reporting suite" },
      {
        name: "User Settings",
        href: "/tools/coming-soon", // Redirected to generic Coming Soon page
        category: "Core Tools",
        description: "Account preferences",
      },
      {
        name: "Analytics",
        href: "/tools/coming-soon", // Redirected to generic Coming Soon page
        category: "Core Tools",
        description: "Advanced data insights",
      },
      {
        name: "Directory",
        href: "/tools/coming-soon", // Redirected to generic Coming Soon page
        category: "Core Tools",
        description: "Team and contact management",
      },

      // Project Management
      {
        name: "Schedule Monitor",
        href: "/dashboard/schedule-monitor",
        category: "Project Management",
        description: "Timeline tracking",
      },
      {
        name: "Manpower Tracking",
        href: "/dashboard/manpower-tracking",
        category: "Project Management",
        description: "Labor management",
      },
      {
        name: "Staffing Schedule",
        href: "/dashboard/staffing-schedule",
        category: "Project Management",
        description: "Resource planning",
      },
      {
        name: "Responsibility Matrix",
        href: "/dashboard/responsibility-matrix",
        category: "Project Management",
        description: "Role assignments",
      },
      {
        name: "Constraints Log",
        href: "/dashboard/constraints-log",
        category: "Project Management",
        description: "Issue tracking",
      },
      {
        name: "Document Compliance",
        href: "/dashboard/document-compliance",
        category: "Project Management",
        description: "Document management",
      },
      {
        name: "Permit Log",
        href: "/dashboard/permit-log",
        category: "Project Management",
        description: "Permit tracking",
      },
      {
        name: "Daily Log",
        href: "/tools/coming-soon", // Redirected to generic Coming Soon page
        category: "Project Management",
        description: "Daily activity reports",
      },
      {
        name: "Inspections",
        href: "/tools/coming-soon", // Redirected to generic Coming Soon page
        category: "Project Management",
        description: "Quality control",
      },

      // Financial Management
      {
        name: "Buyout Schedule",
        href: "/dashboard/buyout-schedule",
        category: "Financial Management",
        description: "Procurement planning",
      },
      {
        name: "Financial Forecasting",
        href: "/dashboard/financial-forecasting",
        category: "Financial Management",
        description: "Budget projections",
      },
      {
        name: "Change Management",
        href: "/tools/coming-soon", // Redirected to generic Coming Soon page
        category: "Financial Management",
        description: "Change order tracking",
      },
      {
        name: "Cost Control",
        href: "/dashboard/cost-control",
        category: "Financial Management",
        description: "Budget monitoring",
      },
      {
        name: "Prime Contracts",
        href: "/tools/coming-soon", // Redirected to generic Coming Soon page
        category: "Financial Management",
        description: "Contract management",
      },
      {
        name: "Commitments",
        href: "/tools/coming-soon", // Redirected to generic Coming Soon page
        category: "Financial Management",
        description: "Subcontractor agreements",
      },
      {
        name: "Invoicing",
        href: "/tools/coming-soon", // Redirected to generic Coming Soon page
        category: "Financial Management",
        description: "Billing and payments",
      },

      // Pre-Construction (filtered by department)
      {
        name: "Business Development",
        href: "/tools/coming-soon", // Redirected to generic Coming Soon page
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
        href: "/tools/coming-soon", // Redirected to generic Coming Soon page
        category: "Pre-Construction",
        description: "Virtual design and construction",
      },
      {
        name: "Pre-Con Dashboard",
        href: "/pre-con",
        category: "Pre-Construction",
        description: "Pre-construction overview",
      },
      // Removed 'Bidding' tool link as per previous requirement
    ],
    [],
  )

  // Utility functions
  const getUserInitials = useCallback(() => {
    if (!user) return "U"
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
  }, [user])

  const hasPreConAccess = useCallback(() => {
    if (!user) return false
    if (["c-suite", "project-executive", "estimator", "admin"].includes(user.role)) return true
    if (user.role === "project-manager") return user.permissions?.preConAccess === true
    return false
  }, [user])

  const getProjectStage = useCallback((status: string) => {
    switch (status) {
      case "planning":
        return "Start-Up"
      case "active":
        return "Under Construction"
      case "on-hold":
        return "Close-Out"
      case "completed":
        return "Closed"
      default:
        return "Under Construction"
    }
  }, [])

  const getProjectStatusColor = useCallback((status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "planning":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }, [])

  // Enhanced filtered tools with department-based filtering
  const filteredTools = useMemo(() => {
    console.log("Filtering tools for department:", selectedDepartment)
    if (selectedDepartment === "pre-construction") {
      return tools.filter((tool) => tool.category === "Pre-Construction")
    }
    return tools.filter((tool) => tool.category !== "Pre-Construction")
  }, [selectedDepartment, tools])

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
      window.dispatchEvent(
        new CustomEvent("departmentChanged", {
          detail: { department, timestamp: new Date().toISOString() },
        }),
      )
    },
    [router],
  )

  const handleProjectChange = useCallback(
    (projectId: string) => {
      console.log("Project changed to:", projectId)
      setSelectedProject(projectId)
      setShowProjectMenu(false)

      localStorage.setItem("selectedProject", projectId)

      // Navigate to project-specific view if not "all"
      if (projectId !== "all") {
        const targetPath = `/dashboard/project/${projectId}`
        console.log("Navigating to project:", targetPath)
        router.push(targetPath)
      }

      // Dispatch event with enhanced details
      window.dispatchEvent(
        new CustomEvent("projectChanged", {
          detail: {
            projectId,
            projectName: projects.find((p) => p.id === projectId)?.name || "All Projects",
            timestamp: new Date().toISOString(),
          },
        }),
      )
    },
    [projects, router],
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
    const savedProject = localStorage.getItem("selectedProject")
    if (savedProject) {
      setSelectedProject(savedProject)
    }
  }, [])

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-[100] flex h-16 items-center justify-between border-b border-gray-200 bg-gradient-to-r from-[#1e3a8a] to-[#2a5298] px-6 shadow-lg"
      >
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded bg-white">
              <span className="text-sm font-bold text-[#1e3a8a]">HB</span>
            </div>
            <span className="text-lg font-bold text-white">HB Report</span>
          </div>

          {/* Department Picker */}
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 px-4 py-2 text-white transition-colors hover:bg-white/20 ${
              showDepartmentMenu ? "bg-white/20" : ""
            } ${selectedDepartment !== "operations" ? "bg-white/10" : ""}`}
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
            <span className="hidden capitalize font-medium md:inline">
              {selectedDepartment === "operations" ? "Operations" : "Pre-Construction"}
            </span>
            <ChevronDown className={`h-3 w-3 transition-transform ${showDepartmentMenu ? "rotate-180" : ""}`} />
          </Button>

          {/* Project Picker */}
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 max-w-56 px-4 py-2 text-white transition-colors hover:bg-white/20 ${
              showProjectMenu ? "bg-white/20" : ""
            } ${selectedProject !== "all" ? "bg-white/10" : ""}`}
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
            <span className="hidden truncate font-medium md:inline">
              {projects.find((p) => p.id === selectedProject)?.name || "All Projects"}
            </span>
            {selectedProject !== "all" && (
              <Badge variant="secondary" className="ml-1 border-white/30 bg-white/20 text-xs text-white">
                Filtered
              </Badge>
            )}
            <ChevronDown className={`h-3 w-3 transition-transform ${showProjectMenu ? "rotate-180" : ""}`} />
          </Button>

          {/* Tool Picker */}
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 px-4 py-2 text-white transition-colors hover:bg-white/20 ${
              showToolMenu ? "bg-white/20" : ""
            }`}
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
            <span className="hidden font-medium lg:inline">Tools</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${showToolMenu ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {/* Right Section - Search, Notifications, User Menu */}
        <div className="flex items-center space-x-4">
          {/* Beta Badge */}
          <Badge variant="secondary" className="hidden text-xs font-medium text-blue-800 sm:inline-flex bg-blue-100">
            Beta
          </Badge>

          {/* Desktop Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search projects, tools..."
              className="w-72 border-white/20 bg-white/10 pl-10 placeholder:text-gray-300 focus:border-white/40 focus:bg-white/20 text-white"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const query = (e.target as HTMLInputElement).value
                  router.push(`/search?q=${encodeURIComponent(query)}`)
                }
              }}
            />
          </div>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 lg:hidden"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            aria-label="Toggle search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="touch-target text-white hover:bg-white/20"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative touch-target text-white hover:bg-white/20"
            onClick={() => router.push("/notifications")}
            aria-label={`Notifications ${notifications > 0 ? `(${notifications} unread)` : ""}`}
          >
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center p-0 text-xs text-white bg-red-500">
                {notifications}
              </Badge>
            )}
          </Button>

          {/* User Dropdown */}
          {user && (
            <div className="relative">
              <Button
                variant="ghost"
                className="touch-target h-8 w-8 p-0 text-white hover:bg-white/20 lg:h-10 lg:w-10"
                onClick={() => {
                  setShowUserMenu(!showUserMenu)
                  setShowDepartmentMenu(false)
                  setShowProjectMenu(false)
                  setShowToolMenu(false)
                }}
                aria-label="User menu"
                aria-expanded={showUserMenu}
              >
                <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.firstName} />
                  <AvatarFallback className="bg-white text-[#1e3a8a]">{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 z-[95] mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-xl">
                  <div className="rounded-t-lg border-b bg-gray-50 px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs capitalize text-gray-500">{user.role}</div>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        router.push("/profile")
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        router.push("/settings")
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      Account Settings
                    </button>
                    <div className="my-1 border-t"></div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        handleLogout()
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Department Mega Menu */}
      {showDepartmentMenu && (
        <div
          ref={departmentMenuContentRef}
          className="absolute left-0 right-0 top-16 z-[90] border-b border-gray-200 bg-white shadow-xl"
        >
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">Operations</h3>
                <button
                  onClick={() => handleDepartmentChange("operations")}
                  className={`w-full text-left rounded-lg border p-4 transition-colors ${
                    selectedDepartment === "operations"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Operations Dashboard</div>
                      <div className="text-sm text-gray-500">Project management and execution tools</div>
                    </div>
                  </div>
                </button>
              </div>

              {hasPreConAccess() && (
                <div className="space-y-4">
                  <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">Pre-Construction</h3>
                  <button
                    onClick={() => handleDepartmentChange("pre-construction")}
                    className={`w-full text-left rounded-lg border p-4 transition-colors ${
                      selectedDepartment === "pre-construction"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Pre-Construction Suite</div>
                        <div className="text-sm text-gray-500">Estimating, VDC, and business development</div>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Project Mega Menu */}
      {showProjectMenu && (
        <div
          ref={projectMenuContentRef}
          className="absolute left-0 right-0 top-16 z-[90] border-b border-gray-200 bg-white shadow-xl"
        >
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Select Project by Stage</h2>
              <p className="mt-1 text-sm text-gray-600">Choose from active projects organized by construction phase</p>
            </div>

            <div className="grid grid-cols-4 gap-8">
              {["Start-Up", "Under Construction", "Close-Out", "Closed"].map((stage) => (
                <div key={stage} className="space-y-4">
                  <h3 className="border-b pb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">{stage}</h3>
                  <div className="space-y-2">
                    {projects
                      .filter((p) => p.id === "all" || getProjectStage(p.status) === stage)
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
                              ? "border-blue-200 bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="truncate font-medium text-gray-900">{project.name}</span>
                              {project.id !== "all" && (
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${getProjectStatusColor(project.status)}`}
                                >
                                  {project.status}
                                </Badge>
                              )}
                            </div>
                            {project.id !== "all" && (
                              <div className="space-y-1 text-xs text-gray-500">
                                <div>Project #{project.id}</div>
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

      {/* Tools Mega Menu */}
      {showToolMenu && (
        <div
          ref={toolMenuContentRef}
          className="absolute left-0 right-0 top-16 z-[90] border-b border-gray-200 bg-white shadow-xl"
        >
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Select a Tool</h2>
                <p className="mt-1 text-sm text-gray-600">Access construction management tools by category</p>
              </div>
              {selectedDepartment === "pre-construction" && (
                <Badge variant="secondary" className="text-sm text-blue-800 bg-blue-100">
                  Pre-Construction Tools
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-3 gap-12">
              {/* Core Tools / Home Column */}
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {selectedDepartment === "pre-construction" ? "Pre-Construction" : "Core Tools"}
                </h3>
                <div className="space-y-2">
                  {filteredTools
                    .filter((tool) =>
                      selectedDepartment === "pre-construction"
                        ? tool.category === "Pre-Construction"
                        : tool.category === "Core Tools",
                    )
                    .map((tool) => (
                      <button
                        key={tool.href}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log("Navigating to tool:", tool.name, "at", tool.href)
                          handleToolNavigation(tool.href)
                        }}
                        className="w-full text-left rounded-lg border border-transparent p-3 transition-colors hover:border-gray-200 hover:bg-gray-50"
                      >
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{tool.name}</div>
                          <div className="text-xs text-gray-500">{tool.description}</div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Project Management Column */}
              {selectedDepartment !== "pre-construction" && (
                <div className="space-y-4">
                  <h3 className="border-b pb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Project Management
                  </h3>
                  <div className="space-y-2">
                    {filteredTools
                      .filter((tool) => tool.category === "Project Management")
                      .map((tool) => (
                        <button
                          key={tool.href}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log("Navigating to tool:", tool.name, "at", tool.href)
                            handleToolNavigation(tool.href)
                          }}
                          className="w-full text-left rounded-lg border border-transparent p-3 transition-colors hover:border-gray-200 hover:bg-gray-50"
                        >
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{tool.name}</div>
                            <div className="text-xs text-gray-500">{tool.description}</div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Financial Management Column */}
              {selectedDepartment !== "pre-construction" && (
                <div className="space-y-4">
                  <h3 className="border-b pb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Financial Management
                  </h3>
                  <div className="space-y-2">
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
                          className="w-full text-left rounded-lg border border-transparent p-3 transition-colors hover:border-gray-200 hover:bg-gray-50"
                        >
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{tool.name}</div>
                            <div className="text-xs text-gray-500">{tool.description}</div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="absolute left-0 right-0 top-16 z-[85] border-b border-white/20 bg-[#1e3a8a] p-4 lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search projects, tools..."
              className="w-full border-white/20 bg-white/10 pl-10 placeholder:text-gray-300 text-white"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const query = (e.target as HTMLInputElement).value
                  router.push(`/search?q=${encodeURIComponent(query)}`)
                  setShowMobileSearch(false)
                }
              }}
              onBlur={() => setShowMobileSearch(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}
