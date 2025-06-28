"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingWrapper } from "@/components/ui/loading-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/context/auth-context"
import { useTour } from "@/context/tour-context"
import { useToast } from "@/hooks/use-toast"
import {
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  BarChart3,
  Users,
  Zap,
  CheckCircle,
  Loader2,
  Mail,
  Lock,
  ChevronDown,
  Monitor,
} from "lucide-react"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)
  const [showDemoAccounts, setShowDemoAccounts] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { startTour, isTourAvailable, resetTourState } = useTour()

  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track project performance with live dashboards and comprehensive insights",
      highlight: "20% faster decisions",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamlessly coordinate across all project stakeholders and teams",
      highlight: "30% better communication",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SSO integration and full compliance",
      highlight: "SOC 2 Type II certified",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: Zap,
      title: "Automated Reporting",
      description: "Generate comprehensive reports and insights with a single click",
      highlight: "Save 5+ hours weekly",
      color: "from-orange-500 to-red-500",
    },
  ]

  const benefits = [
    "Reduce project delays by 5-10%",
    "Increase team productivity by 20-30%",
    "Real-time project visibility",
    "Automated compliance tracking",
    "Integrated cost management",
    "Advanced risk analytics",
  ]

  const demoAccounts = [
    {
      key: "executive",
      label: "Executive",
      email: "john.smith@hedrickbrothers.com",
      icon: Monitor,
      redirectTo: "/dashboard",
    },
    {
      key: "project-executive",
      label: "Project Executive",
      email: "sarah.johnson@hedrickbrothers.com",
      icon: Users,
      redirectTo: "/dashboard",
    },
    {
      key: "project-manager",
      label: "Project Manager",
      email: "mike.davis@hedrickbrothers.com",
      icon: BarChart3,
      redirectTo: "/dashboard",
    },
    {
      key: "estimator",
      label: "Estimator",
      email: "john.doe@hedrickbrothers.com",
      icon: Zap,
      redirectTo: "/pre-con", // or your precon landing
    },
    {
      key: "admin",
      label: "System Admin",
      email: "lisa.wilson@hedrickbrothers.com",
      icon: Shield,
      redirectTo: "/dashboard",
    },
  ]

  // Track window size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    if (typeof window !== "undefined") {
      handleResize() // Initial size
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Feature rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [features.length])

  // Auto-start tour and welcome message for new visitors
  useEffect(() => {
    if (typeof window !== 'undefined' && isTourAvailable) {
      // Check if user has disabled tours permanently
      const hasDisabledTours = localStorage.getItem('hb-tour-available') === 'false'
      
      if (hasDisabledTours) {
        console.log('Tours disabled by user preference')
        return
      }

      // Session-based tracking to ensure one-time display
      const hasShownWelcome = sessionStorage.getItem('hb-welcome-shown')
      const hasShownTour = sessionStorage.getItem('hb-tour-shown-login-demo-accounts')
      
      console.log('Tour auto-start check:', {
        isTourAvailable,
        hasShownWelcome,
        hasShownTour,
        hasDisabledTours
      })
      
      // Show welcome toast once per session
      if (!hasShownWelcome) {
        setTimeout(() => {
          toast({
            title: "Welcome to HB Report Demo! 👋",
            description: "Interactive tours are available to help you explore the platform.",
            duration: 6000,
          })
          sessionStorage.setItem('hb-welcome-shown', 'true')
        }, 1000)
      }
      
      // Auto-start login tour once per session
      if (!hasShownTour) {
        setTimeout(() => {
          console.log('Auto-starting login tour...')
          startTour('login-demo-accounts', true) // true indicates auto-start
        }, 3000)
      }
    }
  }, [isTourAvailable, startTour, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { redirectTo } = await login(email, password)
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to HB Report Platform.",
      })
      router.push(redirectTo)
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "Invalid credentials. Please check your email and password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSSOLogin = async (provider: string) => {
    setIsLoading(true)
    toast({
      title: "SSO Authentication",
      description: `Redirecting to ${provider} login portal...`,
    })

    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard") // Mock redirect
    }, 2000)
  }

  const handleDemoLogin = async (account: (typeof demoAccounts)[0]) => {
    setEmail(account.email)
    setPassword("demo123")
    setShowDemoAccounts(false)
    setIsLoading(true)

    try {
      await login(account.email, "demo123")
      toast({
        title: `Welcome, ${account.label}`,
        description: `You're logged in as a demo ${account.label}.`,
      })
      router.push(account.redirectTo)
    } catch (error) {
      toast({
        title: "Demo login failed",
        description: "Please try again or check your demo credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const CurrentFeatureIcon = features[currentFeature].icon
  const isSmallScreen = windowSize.width < 768
  const isMediumScreen = windowSize.width >= 768 && windowSize.width < 1024
  const isLargeScreen = windowSize.width >= 1024

  return (
    // Force light mode for the entire login page, regardless of global theme
    <div className="light">
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
      <div
        className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative"
        role="main"
        aria-label="Login Page"
      >
        {/* Responsive Background Elements */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        {/* Animated floating elements - scale with screen size */}
        <div
          className="absolute bg-blue-200 rounded-full opacity-20 animate-pulse"
          style={{
            top: windowSize.height * 0.15,
            left: windowSize.width * 0.05,
            width: Math.min(windowSize.width * 0.08, 80),
            height: Math.min(windowSize.width * 0.08, 80),
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"
          style={{
            top: windowSize.height * 0.25,
            right: windowSize.width * 0.1,
            width: Math.min(windowSize.width * 0.12, 120),
            height: Math.min(windowSize.width * 0.12, 120),
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bg-orange-200 rounded-full opacity-20 animate-pulse delay-2000"
          style={{
            bottom: windowSize.height * 0.15,
            left: windowSize.width * 0.08,
            width: Math.min(windowSize.width * 0.06, 60),
            height: Math.min(windowSize.width * 0.06, 60),
          }}
          aria-hidden="true"
        />

        <div className="h-full flex">
          {/* Left Side - Branding & Features (Hidden on mobile) */}
          {!isSmallScreen && (
            <div
              className="bg-gradient-to-br from-[#003087] via-[#1e3a8a] to-[#1e40af] text-white relative overflow-hidden flex flex-col"
              style={{
                width: isMediumScreen ? "45%" : "60%",
                padding: `${Math.max(windowSize.height * 0.04, 24)}px ${Math.max(windowSize.width * 0.02, 32)}px`,
              }}
              aria-label="Platform Features and Benefits"
            >
              {/* Enhanced Background Pattern */}
              <div
                className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]"
                aria-hidden="true"
              />
              <div
                className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-1/6 translate-x-1/6"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-1/6 -translate-x-1/6"
                aria-hidden="true"
              />

              {/* Header - Responsive sizing */}
              <div className="relative z-10 flex-shrink-0">
                <div className="flex items-center mb-6 lg:mb-8">
                  <div className="bg-white p-2 lg:p-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                    <Building2 className={`text-[#003087] ${isLargeScreen ? "h-8 w-8" : "h-6 w-6"}`} aria-hidden="true" />
                  </div>
                  <div className="ml-3 lg:ml-4">
                    <h1 className={`font-bold tracking-tight ${isLargeScreen ? "text-2xl" : "text-xl"}`}>
                      HEDRICK BROTHERS
                    </h1>
                    <p className={`text-blue-200 font-medium ${isLargeScreen ? "text-base" : "text-sm"}`}>
                      Construction Analytics Platform
                    </p>
                  </div>
                </div>

                <div className="mb-6 lg:mb-8">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white mb-3 lg:mb-4 px-2 lg:px-3 py-1 text-xs lg:text-sm font-medium">
                    ✨ Now in Beta
                  </Badge>
                  <h2
                    className={`font-bold mb-3 lg:mb-4 leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent ${
                      isLargeScreen ? "text-4xl xl:text-5xl" : "text-2xl lg:text-3xl"
                    }`}
                  >
                    Build Smarter with Dynamic Project Solutions
                  </h2>
                  <p
                    className={`text-blue-100 leading-relaxed ${isLargeScreen ? "text-xl max-w-lg" : "text-base max-w-md"}`}
                  >
                    Streamline operations, boost productivity, and deliver projects on time with our comprehensive
                    analytics platform.
                  </p>
                </div>
              </div>

              {/* Feature Showcase - Flexible height */}
              <div className="relative z-10 flex-1 flex items-center min-h-0">
                <div className="w-full">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 xl:p-8 border border-white/20 shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
                    <div className="flex items-start mb-4 lg:mb-6">
                      <div
                        className={`bg-gradient-to-r ${features[currentFeature].color} p-3 lg:p-4 rounded-xl mr-4 lg:mr-6 transform transition-transform duration-300 hover:rotate-6`}
                      >
                        <CurrentFeatureIcon
                          className={`text-white ${isLargeScreen ? "h-8 w-8" : "h-6 w-6"}`}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold mb-2 ${isLargeScreen ? "text-2xl" : "text-lg lg:text-xl"}`}>
                          {features[currentFeature].title}
                        </h3>
                        <p
                          className={`text-blue-200 leading-relaxed mb-3 ${isLargeScreen ? "text-lg" : "text-sm lg:text-base"}`}
                        >
                          {features[currentFeature].description}
                        </p>
                        <div className="inline-flex items-center bg-green-500/20 text-green-300 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium">
                          <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" aria-hidden="true" />
                          {features[currentFeature].highlight}
                        </div>
                      </div>
                    </div>

                    {/* Feature indicators */}
                    <div
                      className="flex space-x-2 lg:space-x-3 mt-6 lg:mt-8"
                      role="tablist"
                      aria-label="Feature Indicators"
                    >
                      {features.map((_, index) => (
                        <button
                          key={index}
                          role="tab"
                          aria-selected={index === currentFeature}
                          aria-controls={`feature-panel-${index}`}
                          className={`h-2 rounded-full transition-all duration-500 cursor-pointer hover:scale-110 ${
                            index === currentFeature
                              ? "w-8 lg:w-12 bg-white shadow-lg"
                              : "w-2 lg:w-3 bg-white/40 hover:bg-white/60"
                          }`}
                          onClick={() => setCurrentFeature(index)}
                          aria-label={`Show feature ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits List - Responsive grid */}
              <div className="relative z-10 flex-shrink-0 mt-6 lg:mt-8" aria-label="Why teams choose HB Report">
                <h3 className={`font-bold mb-4 lg:mb-6 ${isLargeScreen ? "text-xl" : "text-lg"}`}>
                  Why teams choose HB Report:
                </h3>
                <div className={`grid gap-2 lg:gap-4 ${isLargeScreen ? "grid-cols-2" : "grid-cols-1"}`}>
                  {benefits.slice(0, isLargeScreen ? 6 : 4).map((benefit, index) => (
                    <div key={index} className="flex items-center group">
                      <div className="bg-green-500/20 p-1 rounded-full mr-2 lg:mr-3 group-hover:bg-green-500/30 transition-colors flex-shrink-0">
                        <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-green-400" aria-hidden="true" />
                      </div>
                      <span
                        className={`text-blue-100 group-hover:text-white transition-colors ${isLargeScreen ? "text-sm" : "text-xs"}`}
                      >
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Right Side - Login Form */}
          <div
            className={`flex items-center justify-center relative ${
              isSmallScreen ? "w-full" : isMediumScreen ? "w-[55%]" : "w-[40%]"
            }`}
            style={{
              padding: `${Math.max(windowSize.height * 0.02, 16)}px ${Math.max(windowSize.width * 0.02, 16)}px`,
            }}
            aria-label="Login Form Section"
          >
            <ScrollArea className="h-full w-full">
              <div className="flex items-center justify-center min-h-full py-4">
                <div className="w-full max-w-md mx-auto">
                  {/* Mobile Header */}
                  {isSmallScreen && (
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-gradient-to-r from-[#003087] to-[#1e3a8a] p-3 rounded-2xl shadow-xl">
                          <Building2 className="h-8 w-8 text-white" aria-hidden="true" />
                        </div>
                      </div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-[#003087] to-[#1e3a8a] bg-clip-text text-transparent mb-2">
                        HEDRICK BROTHERS
                      </h1>
                      <p className="text-gray-600 font-medium text-sm">Construction Analytics Platform</p>
                    </div>
                  )}

                  <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm login-card">
                    <CardHeader className="text-center pb-4 lg:pb-6">
                      <CardTitle
                        className={`font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 ${
                          isSmallScreen ? "text-2xl" : "text-2xl lg:text-3xl"
                        }`}
                      >
                        Welcome Back
                      </CardTitle>
                      <CardDescription
                        className={`text-gray-600 leading-relaxed ${isSmallScreen ? "text-sm" : "text-base"}`}
                      >
                        Sign in to access your construction analytics dashboard
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 lg:space-y-6">
                      <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5 login-form" aria-label="User Login Form">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                            <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your work email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-11 lg:h-12 border-2 border-gray-200 focus:border-[#003087] focus:ring-[#003087] transition-all duration-200 bg-white text-gray-900"
                            required
                            aria-required="true"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center">
                            <Lock className="h-4 w-4 mr-2" aria-hidden="true" />
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="h-11 lg:h-12 pr-12 border-2 border-gray-200 focus:border-[#003087] focus:ring-[#003087] transition-all duration-200 bg-white text-gray-900"
                              required
                              aria-required="true"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-11 lg:h-12 px-3 hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              aria-pressed={showPassword}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" aria-hidden="true" />
                              ) : (
                                <Eye className="h-4 w-4" aria-hidden="true" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-11 lg:h-12 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:from-[#E55A2B] hover:to-[#D14D20] text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          disabled={isLoading}
                          aria-label={isLoading ? "Signing in..." : "Sign In"}
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <Loader2 className="animate-spin h-4 w-4 mr-2" aria-hidden="true" />
                              Signing in...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              Sign In
                              <ArrowRight
                                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                                aria-hidden="true"
                              />
                            </div>
                          )}
                        </Button>
                      </form>

                      {/* SSO Options */}
                      <div className="space-y-3 lg:space-y-4" aria-label="Single Sign-On Options">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-gray-600 font-semibold">Or continue with</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            onClick={() => handleSSOLogin("Okta")}
                            disabled={isLoading}
                            className="h-10 lg:h-11 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-sm bg-white text-gray-900"
                            aria-label="Login with Okta"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin text-gray-600" aria-hidden="true" />
                            ) : (
                              <Shield className="h-4 w-4 mr-2 text-gray-600" aria-hidden="true" />
                            )}
                            Okta
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleSSOLogin("Azure AD")}
                            disabled={isLoading}
                            className="h-10 lg:h-11 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-sm bg-white text-gray-900"
                            aria-label="Login with Azure AD"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin text-gray-600" aria-hidden="true" />
                            ) : (
                              <Shield className="h-4 w-4 mr-2 text-gray-600" aria-hidden="true" />
                            )}
                            Azure AD
                          </Button>
                        </div>
                      </div>

                      {/* Demo Accounts - Collapsible */}
                      <div className="space-y-3 lg:space-y-4" aria-label="Demo Accounts Section">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-gray-600 font-semibold">Demo Accounts</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                          className="w-full h-10 lg:h-11 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium bg-white"
                          aria-expanded={showDemoAccounts}
                          aria-controls="demo-accounts-list"
                          aria-label="Toggle demo accounts list"
                          data-tour="demo-accounts-toggle"
                        >
                          <Users className="h-4 w-4 mr-2 text-blue-600" aria-hidden="true" />
                          Try Demo Accounts
                          <ChevronDown
                            className={`h-4 w-4 ml-2 transition-transform duration-200 text-blue-600 ${showDemoAccounts ? "rotate-180" : ""}`}
                            aria-hidden="true"
                          />
                        </Button>

                        {showDemoAccounts && (
                          <div id="demo-accounts-list" className="space-y-2 animate-in slide-in-from-top-2 duration-200" data-tour="demo-accounts-list">
                            {demoAccounts.map((account) => {
                              const IconComponent = account.icon
                              return (
                                <Button
                                  key={account.key}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDemoLogin(account)}
                                  disabled={isLoading}
                                  className="w-full h-auto p-3 text-left border border-blue-100 text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 flex items-center justify-start bg-white"
                                  aria-label={`Login as ${account.label} demo account`}
                                >
                                  <IconComponent className="h-4 w-4 mr-3 flex-shrink-0 text-blue-600" aria-hidden="true" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm truncate text-blue-700">{account.label}</div>
                                    <div className="text-xs text-blue-600 opacity-75 truncate">{account.email}</div>
                                  </div>
                                </Button>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Footer Links */}
                      <div className="space-y-3 text-center text-sm" aria-label="Account Links">
                        <Link
                          href="/forgot-password"
                          className="text-[#003087] hover:text-[#002066] hover:underline font-semibold transition-colors"
                        >
                          Forgot your password?
                        </Link>
                        <div className="text-gray-600">
                          {"Don't have an account? "}
                          <Link
                            href="/signup"
                            className="text-[#003087] hover:text-[#002066] hover:underline font-semibold transition-colors"
                          >
                            Request Access
                          </Link>
                        </div>
                        {/* Debug button - remove in production */}
                        <button
                          onClick={resetTourState}
                          className="text-xs text-gray-500 hover:text-gray-700 transition-colors bg-transparent"
                          title="Reset tour state for testing"
                        >
                          Reset Tours
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trust Indicators */}
                  <div className="mt-6 lg:mt-8 text-center" aria-label="Trust Indicators">
                    <p className="text-xs lg:text-sm text-gray-600 mb-2 lg:mb-3 font-medium">
                      Trusted by construction teams nationwide
                    </p>
                    <div className="flex items-center justify-center space-x-4 lg:space-x-6 text-xs lg:text-sm text-gray-500">
                      <span className="flex items-center bg-gray-50 px-2 lg:px-3 py-1 lg:py-2 rounded-full">
                        <Shield className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 text-green-600" aria-hidden="true" />
                        SOC 2 Compliant
                      </span>
                      <span className="flex items-center bg-gray-50 px-2 lg:px-3 py-1 lg:py-2 rounded-full">
                        <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 text-green-600" aria-hidden="true" />
                        99.9% Uptime
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      </ThemeProvider>
    </div>
  )
}
