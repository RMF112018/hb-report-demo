'use client'; // Marks this component as client-side only to handle dynamic logic and avoid SSR mismatches

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/lib/auth-context'; // Custom hook for authentication logic
import { useToast } from '@/hooks/use-toast'; // Custom hook for toast notifications
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
} from 'lucide-react';
import Link from 'next/link';

/**
 * LoginPage Component
 * @description The main login page component for the HB Report Platform. Handles user authentication,
 *              showcases platform features, and provides demo account functionality. Designed to be
 *              responsive and client-side rendered to manage dynamic styles and window-based calculations.
 */
export default function LoginPage() {
  // State management for form inputs and UI controls
  const [email, setEmail] = useState(''); // User's email input for login
  const [password, setPassword] = useState(''); // User's password input for login
  const [showPassword, setShowPassword] = useState(false); // Toggles password visibility
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state during authentication
  const [currentFeature, setCurrentFeature] = useState(0); // Index of the currently displayed feature
  const [showDemoAccounts, setShowDemoAccounts] = useState(false); // Toggles visibility of demo accounts
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 }); // Tracks window dimensions, initialized to 0 to avoid SSR issues

  // Hooks for authentication and routing
  const { login } = useAuth(); // Provides login function from AuthContext
  const router = useRouter(); // Next.js router for navigation
  const { toast } = useToast(); // Custom toast notification hook

  /**
   * Feature Data
   * @description Array of feature objects displayed on the left panel, each with an icon, title,
   *              description, highlight, and gradient color for styling.
   */
  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track project performance with live dashboards and comprehensive insights',
      highlight: '20% faster decisions',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamlessly coordinate across all project stakeholders and teams',
      highlight: '30% better communication',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with SSO integration and full compliance',
      highlight: 'SOC 2 Type II certified',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: Zap,
      title: 'Automated Reporting',
      description: 'Generate comprehensive reports and insights with a single click',
      highlight: 'Save 5+ hours weekly',
      color: 'from-orange-500 to-red-500',
    },
  ];

  /**
   * Benefit Data
   * @description Array of benefit statements displayed in the left panel to highlight platform advantages.
   */
  const benefits = [
    'Reduce project delays by 5-10%',
    'Increase team productivity by 20-30%',
    'Real-time project visibility',
    'Automated compliance tracking',
    'Integrated cost management',
    'Advanced risk analytics',
  ];

  /**
   * Demo Account Data
   * @description Array of demo account objects, each with a key, label, email, and icon for testing purposes.
   */
  const demoAccounts = [
    { key: 'c-suite', label: 'C-Suite Executive', email: 'john.smith@hedrickbrothers.com', icon: Monitor },
    { key: 'project-executive', label: 'Project Executive', email: 'sarah.johnson@hedrickbrothers.com', icon: Users },
    { key: 'project-manager', label: 'Project Manager', email: 'mike.davis@hedrickbrothers.com', icon: BarChart3 },
    { key: 'estimator', label: 'Estimator', email: 'john.doe@hedrickbrothers.com', icon: Zap },
    { key: 'admin', label: 'System Admin', email: 'lisa.wilson@hedrickbrothers.com', icon: Shield },
  ];

  /**
   * useEffect for Window Resize
   * @description Sets up an event listener to update windowSize state on resize, ensuring responsive design.
   *              Initializes with current window dimensions on mount. Cleans up on unmount.
   */
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize(); // Set initial size on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * useEffect for Feature Rotation
   * @description Rotates the displayed feature every 5 seconds using setInterval. Cleans up on unmount.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  /**
   * handleSubmit Function
   * @description Handles form submission for user login. Calls the login function from AuthContext,
   *              displays success or error toasts, and redirects on success.
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { redirectTo } = await login(email, password);
      toast({
        title: 'Welcome back!',
        description: 'Successfully logged in to HB Report Platform.',
      });
      router.push(redirectTo);
    } catch (error) {
      toast({
        title: 'Login failed',
        description:
          error instanceof Error ? error.message : 'Invalid credentials. Please check your email and password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * handleSSOLogin Function
   * @description Handles SSO login by simulating a redirect to the specified provider. Displays a toast
   *              and mocks a redirect after a delay.
   * @param {string} provider - The SSO provider (e.g., 'Okta', 'Azure AD')
   */
  const handleSSOLogin = async (provider: string) => {
    setIsLoading(true);
    toast({
      title: 'SSO Authentication',
      description: `Redirecting to ${provider} login portal...`,
    });

    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard'); // Mock redirect
    }, 2000);
  };

  /**
   * handleDemoLogin Function
   * @description Populates email and password fields with demo account credentials and hides the demo
   *              accounts panel. Displays a toast notification.
   * @param {typeof demoAccounts[0]} account - The selected demo account object
   */
  const handleDemoLogin = (account: (typeof demoAccounts)[0]) => {
    setEmail(account.email);
    setPassword('demo123'); // Standard demo password
    setShowDemoAccounts(false);

    toast({
      title: `Demo Account Selected`,
      description: `Loaded ${account.label} credentials. Click Sign In to continue.`,
    });
  };

  // Derived state for responsive design
  const CurrentFeatureIcon = features[currentFeature].icon;
  const isSmallScreen = windowSize.width < 768;
  const isMediumScreen = windowSize.width >= 768 && windowSize.width < 1024;
  const isLargeScreen = windowSize.width >= 1024;

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Background Grid Overlay - Enhances visual depth with a subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      {/* Animated Floating Elements - Use fallback values until windowSize is set */}
      <div
        className="absolute bg-blue-200 rounded-full opacity-20 animate-pulse"
        style={{
          top: windowSize.height ? windowSize.height * 0.15 : '15vh',
          left: windowSize.width ? windowSize.width * 0.05 : '5vw',
          width: windowSize.width ? Math.min(windowSize.width * 0.08, 80) : 80,
          height: windowSize.width ? Math.min(windowSize.width * 0.08, 80) : 80,
        }}
      />
      <div
        className="absolute bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"
        style={{
          top: windowSize.height ? windowSize.height * 0.25 : '25vh',
          right: windowSize.width ? windowSize.width * 0.1 : '10vw',
          width: windowSize.width ? Math.min(windowSize.width * 0.12, 120) : 120,
          height: windowSize.width ? Math.min(windowSize.width * 0.12, 120) : 120,
        }}
      />
      <div
        className="absolute bg-orange-200 rounded-full opacity-20 animate-pulse delay-2000"
        style={{
          bottom: windowSize.height ? windowSize.height * 0.15 : '15vh',
          left: windowSize.width ? windowSize.width * 0.08 : '8vw',
          width: windowSize.width ? Math.min(windowSize.width * 0.06, 60) : 60,
          height: windowSize.width ? Math.min(windowSize.width * 0.06, 60) : 60,
        }}
      />

      <div className="h-full flex">
        {/* Left Side - Branding & Features (Hidden on mobile) */}
        {!isSmallScreen && (
          <div
            className="bg-gradient-to-br from-[#003087] via-[#1e3a8a] to-[#1e40af] text-white relative overflow-hidden flex flex-col"
            style={{
              width: isMediumScreen ? '45%' : '60%',
              padding: windowSize.height ? `${Math.max(windowSize.height * 0.04, 24)}px` : '24px',
            }}
          >
            {/* Enhanced Background Pattern - Adds subtle visual layers */}
            <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]" />
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-1/6 translate-x-1/6" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-1/6 -translate-x-1/6" />

            {/* Header - Responsive sizing with branding */}
            <div className="relative z-10 flex-shrink-0">
              <div className="flex items-center mb-6 lg:mb-8">
                <div className="bg-white p-2 lg:p-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <Building2 className={`text-[#003087] ${isLargeScreen ? 'h-8 w-8' : 'h-6 w-6'}`} />
                </div>
                <div className="ml-3 lg:ml-4">
                  <h1 className={`font-bold tracking-tight ${isLargeScreen ? 'text-2xl' : 'text-xl'}`}>
                    HEDRICK BROTHERS
                  </h1>
                  <p className={`text-blue-200 font-medium ${isLargeScreen ? 'text-base' : 'text-sm'}`}>
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
                    isLargeScreen ? 'text-4xl xl:text-5xl' : 'text-2xl lg:text-3xl'
                  }`}
                >
                  Build Smarter with Dynamic Project Solutions
                </h2>
                <p
                  className={`text-blue-100 leading-relaxed ${isLargeScreen ? 'text-xl max-w-lg' : 'text-base max-w-md'}`}
                >
                  Streamline operations, boost productivity, and deliver projects on time with our comprehensive
                  analytics platform.
                </p>
              </div>
            </div>

            {/* Feature Showcase - Flexible height with rotating content */}
            <div className="relative z-10 flex-1 flex items-center min-h-0">
              <div className="w-full">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 xl:p-8 border border-white/20 shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
                  <div className="flex items-start mb-4 lg:mb-6">
                    <div
                      className={`bg-gradient-to-r ${features[currentFeature].color} p-3 lg:p-4 rounded-xl mr-4 lg:mr-6 transform transition-transform duration-300 hover:rotate-6`}
                    >
                      <CurrentFeatureIcon className={`text-white ${isLargeScreen ? 'h-8 w-8' : 'h-6 w-6'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold mb-2 ${isLargeScreen ? 'text-2xl' : 'text-lg lg:text-xl'}`}>
                        {features[currentFeature].title}
                      </h3>
                      <p
                        className={`text-blue-200 leading-relaxed mb-3 ${isLargeScreen ? 'text-lg' : 'text-sm lg:text-base'}`}
                      >
                        {features[currentFeature].description}
                      </p>
                      <div className="inline-flex items-center bg-green-500/20 text-green-300 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium">
                        <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                        {features[currentFeature].highlight}
                      </div>
                    </div>
                  </div>

                  {/* Feature indicators - Interactive dots for manual selection */}
                  <div className="flex space-x-2 lg:space-x-3 mt-6 lg:mt-8">
                    {features.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-500 cursor-pointer hover:scale-110 ${
                          index === currentFeature
                            ? 'w-8 lg:w-12 bg-white shadow-lg'
                            : 'w-2 lg:w-3 bg-white/40 hover:bg-white/60'
                        }`}
                        onClick={() => setCurrentFeature(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits List - Responsive grid layout */}
            <div className="relative z-10 flex-shrink-0 mt-6 lg:mt-8">
              <h3 className={`font-bold mb-4 lg:mb-6 ${isLargeScreen ? 'text-xl' : 'text-lg'}`}>
                Why teams choose HB Report:
              </h3>
              <div className={`grid gap-2 lg:gap-4 ${isLargeScreen ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {benefits.slice(0, isLargeScreen ? 6 : 4).map((benefit, index) => (
                  <div key={index} className="flex items-center group">
                    <div className="bg-green-500/20 p-1 rounded-full mr-2 lg:mr-3 group-hover:bg-green-500/30 transition-colors flex-shrink-0">
                      <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-green-400" />
                    </div>
                    <span
                      className={`text-blue-100 group-hover:text-white transition-colors ${isLargeScreen ? 'text-sm' : 'text-xs'}`}
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
            isSmallScreen ? 'w-full' : isMediumScreen ? 'w-[55%]' : 'w-[40%]'
          }`}
          style={{
            padding: windowSize.height ? `${Math.max(windowSize.height * 0.02, 16)}px` : '16px',
          }}
        >
          <ScrollArea className="h-full w-full">
            <div className="flex items-center justify-center min-h-full py-4">
              <div className="w-full max-w-md mx-auto">
                {/* Mobile Header - Shown only on small screens */}
                {isSmallScreen && (
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-gradient-to-r from-[#003087] to-[#1e3a8a] p-3 rounded-2xl shadow-xl">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#003087] to-[#1e3a8a] bg-clip-text text-transparent mb-2">
                      HEDRICK BROTHERS
                    </h1>
                    <p className="text-gray-600 font-medium text-sm">Construction Analytics Platform</p>
                  </div>
                )}

                <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4 lg:pb-6">
                    <CardTitle
                      className={`font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 ${
                        isSmallScreen ? 'text-2xl' : 'text-2xl lg:text-3xl'
                      }`}
                    >
                      Welcome Back
                    </CardTitle>
                    <CardDescription
                      className={`text-gray-600 leading-relaxed ${isSmallScreen ? 'text-sm' : 'text-base'}`}
                    >
                      Sign in to access your construction analytics dashboard
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 lg:space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your work email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-11 lg:h-12 border-2 border-gray-200 focus:border-[#003087] focus:ring-[#003087] transition-all duration-200"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center">
                          <Lock className="h-4 w-4 mr-2" />
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 lg:h-12 pr-12 border-2 border-gray-200 focus:border-[#003087] focus:ring-[#003087] transition-all duration-200"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-11 lg:h-12 px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-11 lg:h-12 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:from-[#E55A2B] hover:to-[#D14D20] text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Signing in...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        )}
                      </Button>
                    </form>

                    {/* SSO Options - Alternative login methods */}
                    <div className="space-y-3 lg:space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-3 text-gray-500 font-semibold">Or continue with</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          onClick={() => handleSSOLogin('Okta')}
                          disabled={isLoading}
                          className="h-10 lg:h-11 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-sm"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Shield className="h-4 w-4 mr-2" />
                          )}
                          Okta
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleSSOLogin('Azure AD')}
                          disabled={isLoading}
                          className="h-10 lg:h-11 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-sm"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Shield className="h-4 w-4 mr-2" />
                          )}
                          Azure AD
                        </Button>
                      </div>
                    </div>

                    {/* Demo Accounts - Collapsible section for testing */}
                    <div className="space-y-3 lg:space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-3 text-gray-500 font-semibold">Demo Accounts</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                        className="w-full h-10 lg:h-11 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Try Demo Accounts
                        <ChevronDown
                          className={`h-4 w-4 ml-2 transition-transform duration-200 ${showDemoAccounts ? 'rotate-180' : ''}`}
                        />
                      </Button>

                      {showDemoAccounts && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                          {demoAccounts.map((account) => {
                            const IconComponent = account.icon;
                            return (
                              <Button
                                key={account.key}
                                variant="outline"
                                size="sm"
                                onClick={() => handleDemoLogin(account)}
                                disabled={isLoading}
                                className="w-full h-auto p-3 text-left border border-blue-100 text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 flex items-center justify-start"
                              >
                                <IconComponent className="h-4 w-4 mr-3 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-sm truncate">{account.label}</div>
                                  <div className="text-xs text-blue-600 opacity-75 truncate">{account.email}</div>
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Footer Links - Navigation to related pages */}
                    <div className="space-y-3 text-center text-sm">
                      <Link
                        href="/forgot-password"
                        className="text-[#003087] hover:text-[#002066] hover:underline font-semibold transition-colors"
                      >
                        Forgot your password?
                      </Link>
                      <div className="text-gray-600">
                        {'Don\'t have an account? '}
                        <Link
                          href="/signup"
                          className="text-[#003087] hover:text-[#002066] hover:underline font-semibold transition-colors"
                        >
                          Request Access
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Indicators - Displays platform credibility */}
                <div className="mt-6 lg:mt-8 text-center">
                  <p className="text-xs lg:text-sm text-gray-600 mb-2 lg:mb-3 font-medium">
                    Trusted by construction teams nationwide
                  </p>
                  <div className="flex items-center justify-center space-x-4 lg:space-x-6 text-xs lg:text-sm text-gray-500">
                    <span className="flex items-center bg-gray-50 px-2 lg:px-3 py-1 lg:py-2 rounded-full">
                      <Shield className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 text-green-600" />
                      SOC 2 Compliant
                    </span>
                    <span className="flex items-center bg-gray-50 px-2 lg:px-3 py-1 lg:py-2 rounded-full">
                      <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 text-green-600" />
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
  );
}