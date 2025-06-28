'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './auth-context'

export interface TourStep {
  id: string
  title: string
  content: string
  target: string // CSS selector for the element to highlight
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center'
  nextButton?: string
  prevButton?: string
  showSkip?: boolean
  onNext?: () => void
  onPrev?: () => void
  onSkip?: () => void
}

export interface TourDefinition {
  id: string
  name: string
  description: string
  steps: TourStep[]
  userRoles?: string[] // Which user roles can see this tour
  page?: string // Which page this tour is for
}

interface TourContextType {
  isActive: boolean
  currentTour: string | null
  currentStep: number
  availableTours: TourDefinition[]
  startTour: (tourId: string, isAutoStart?: boolean) => void
  stopTour: () => void
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
  goToStep: (stepIndex: number) => void
  toggleTourAvailability: () => void
  isTourAvailable: boolean
  getCurrentTourDefinition: () => TourDefinition | null
  getCurrentStep: () => TourStep | null
  resetTourState: () => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

// Tour definitions
const TOUR_DEFINITIONS: TourDefinition[] = [
  {
    id: 'login-demo-accounts',
    name: 'Demo Account Selection',
    description: 'Learn how to select different user roles and access demo accounts',
    page: 'login',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to HB Report Demo!',
        content: 'This guided tour will show you how to explore the application with different user roles. Each role provides access to different features and dashboard layouts.',
        target: '.login-card',
        placement: 'center',
        nextButton: 'Get Started',
        showSkip: true
      },
      {
        id: 'demo-accounts-button',
        title: 'Demo Account Access',
        content: 'Click this button to see available demo accounts. Each account represents a different user role with specific permissions and dashboard configurations.<br/><br/><strong>Go ahead and click it now!</strong>',
        target: '[data-tour="demo-accounts-toggle"]',
        placement: 'left',
        nextButton: 'Continue',
        onNext: () => {
          // Ensure demo accounts dropdown is open for next step
          const button = document.querySelector('[data-tour="demo-accounts-toggle"]') as HTMLButtonElement
          const dropdown = document.querySelector('[data-tour="demo-accounts-list"]')
          
          if (button && !dropdown) {
            button.click()
          }
          
          // Small delay to allow DOM to update
          setTimeout(() => {
            const newDropdown = document.querySelector('[data-tour="demo-accounts-list"]')
            if (newDropdown) {
              newDropdown.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }
          }, 300)
        }
      },
      {
        id: 'role-selection',
        title: 'Choose Your Role',
        content: 'Each demo account represents a different user role with unique dashboard layouts and features.<br/><br/><strong>💼 Executive</strong> - Portfolio overview<br/><strong>👥 Project Executive</strong> - Multi-project management<br/><strong>📊 Project Manager</strong> - Detailed controls<br/><strong>🏗️ Estimator</strong> - Pre-construction focus<br/><strong>⚙️ Admin</strong> - System administration<br/><br/><em>Click any account to log in and explore!</em>',
        target: '[data-tour="demo-accounts-list"]',
        placement: 'left',
        nextButton: 'Got it!'
      },
      {
        id: 'login-process',
        title: 'Automatic Login',
        content: 'Once you select a demo account, you\'ll be automatically logged in and redirected to the appropriate dashboard for that role. The dashboard content and available tools will vary based on your selected role.',
        target: '.login-form',
        placement: 'right',
        nextButton: 'Start Exploring',
        onNext: () => {
          // Close demo accounts dropdown if open
          const button = document.querySelector('[data-tour="demo-accounts-toggle"]') as HTMLButtonElement
          const dropdown = document.querySelector('[data-tour="demo-accounts-list"]')
          if (button && dropdown) {
            button.click()
          }
        }
      }
    ]
  },
  {
    id: 'dashboard-overview',
    name: 'Complete Dashboard Tour',
    description: 'Comprehensive guide to all dashboard features and navigation elements',
    page: 'dashboard',
    steps: [
      {
        id: 'dashboard-welcome',
        title: 'Welcome to Your Dashboard!',
        content: 'This dashboard is customized for your role and provides the most relevant information and tools for your daily work. Let\'s explore all the features available to you.',
        target: '[data-tour="dashboard-content"]',
        placement: 'center',
        nextButton: 'Start Tour'
      },
      {
        id: 'environment-menu',
        title: 'Environment Navigation',
        content: 'Switch between different work environments:<br/><br/><strong>📊 Operations</strong> - Active project management<br/><strong>🏗️ Pre-Construction</strong> - Planning and estimation<br/><strong>📁 Archive</strong> - Completed projects<br/><br/>Each environment provides specialized tools and views for different phases of work.',
        target: '[data-tour="environment-menu"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'projects-menu',
        title: 'Project Selection',
        content: 'Access and switch between your active projects. This dropdown shows all projects you have permissions to view and manage. Click to change your current project context.',
        target: '[data-tour="projects-menu"]',
        placement: 'bottom',
        nextButton: 'Next'
      },
      {
        id: 'tools-menu',
        title: 'Tools & Utilities',
        content: 'Access powerful tools and utilities for project management:<br/><br/>• Document management<br/>• Reporting tools<br/>• Import/export functions<br/>• Integration settings<br/>• Custom workflows',
        target: '[data-tour="tools-menu"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'search-bar',
        title: 'Global Search',
        content: 'Quickly find projects, documents, contacts, or any information across the platform. Use keywords, project names, or specific data to locate what you need instantly.',
        target: '[data-tour="search-bar"]',
        placement: 'bottom',
        nextButton: 'Next'
      },
      {
        id: 'tours-menu',
        title: 'Guided Tours',
        content: 'Access interactive tours and help resources. Tours are contextual - different tours are available based on your current page and role permissions.',
        target: '[data-tour="tour-controls"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'dashboard-selector',
        title: 'Dashboard Views',
        content: 'Switch between different dashboard layouts optimized for your role:<br/><br/>• Executive summary view<br/>• Detailed project controls<br/>• Financial overview<br/>• Custom layouts<br/><br/>Each view presents the most relevant information for your workflow.',
        target: '[data-tour="dashboard-selector"]',
        placement: 'left',
        nextButton: 'Next'
      },
      {
        id: 'dashboard-controls',
        title: 'Dashboard Controls',
        content: 'Customize your dashboard experience:<br/><br/><strong>✏️ Edit</strong> - Modify card layouts and content<br/><strong>📐 Layout</strong> - Adjust spacing and arrangement<br/><strong>⛶ Fullscreen</strong> - Maximize dashboard view<br/><br/>Make your dashboard work exactly how you need it.',
        target: '[data-tour="dashboard-controls"]',
        placement: 'right',
        nextButton: 'Continue'
      },
      {
        id: 'kpi-widgets',
        title: 'Key Performance Indicators',
        content: 'Monitor critical project metrics at a glance. These KPI widgets show real-time data for budget health, schedule performance, safety metrics, and other key indicators relevant to your role.',
        target: '[data-tour="kpi-widgets"]',
        placement: 'bottom',
        nextButton: 'Next'
      },
      {
        id: 'hbi-insights',
        title: 'HB Intelligence Insights',
        content: 'AI-powered insights and recommendations based on your project data. Get predictive analytics, risk assessments, and actionable recommendations to improve project outcomes.',
        target: '[data-tour="hbi-insights"]',
        placement: 'left',
        nextButton: 'Finish Tour'
      }
    ]
  }
]

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false)
  const [currentTour, setCurrentTour] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isTourAvailable, setIsTourAvailable] = useState(true)
  const { user } = useAuth()

  // Load tour availability preference
  useEffect(() => {
    const tourPref = localStorage.getItem('hb-tour-available')
    if (tourPref !== null) {
      const available = JSON.parse(tourPref)
      console.log('Tour availability from localStorage:', available)
      setIsTourAvailable(available)
    } else {
      console.log('No tour preference found, defaulting to true')
      setIsTourAvailable(true)
    }
  }, [])

  // Clean up completed tours
  useEffect(() => {
    if (!isActive && currentTour) {
      const timer = setTimeout(() => {
        setCurrentTour(null)
        setCurrentStep(0)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [isActive, currentTour])

  // Get available tours based on user role and current page
  const availableTours = TOUR_DEFINITIONS.filter(tour => {
    if (tour.userRoles && user) {
      return tour.userRoles.includes(user.role)
    }
    return true
  })

  // Debug available tours
  useEffect(() => {
    console.log('Available tours:', availableTours.map(t => t.id))
    console.log('Tour availability state:', isTourAvailable)
    console.log('Current user:', user?.role || 'no user')
  }, [availableTours, isTourAvailable, user])

  const getCurrentTourDefinition = (): TourDefinition | null => {
    if (!currentTour) return null
    return TOUR_DEFINITIONS.find(tour => tour.id === currentTour) || null
  }

  const getCurrentStep = (): TourStep | null => {
    const tour = getCurrentTourDefinition()
    if (!tour || currentStep >= tour.steps.length) return null
    return tour.steps[currentStep]
  }

  const startTour = (tourId: string, isAutoStart: boolean = false) => {
    console.log('Starting tour:', tourId, 'Auto-start:', isAutoStart)
    
    // If this is an auto-start, check if we've already shown this tour in this session
    if (isAutoStart) {
      const sessionKey = `hb-tour-shown-${tourId}`
      const hasShownInSession = sessionStorage.getItem(sessionKey)
      
      if (hasShownInSession) {
        console.log(`Tour ${tourId} already shown in this session, skipping auto-start`)
        return
      }
      
      // Mark as shown in this session
      sessionStorage.setItem(sessionKey, 'true')
    }
    
    const tour = TOUR_DEFINITIONS.find(t => t.id === tourId)
    console.log('Found tour:', tour)
    if (tour) {
      console.log('Setting tour active:', tourId)
      setCurrentTour(tourId)
      setCurrentStep(0)
      setIsActive(true)
    } else {
      console.error('Tour not found:', tourId)
    }
  }

  const stopTour = () => {
    console.log('Stopping tour')
    setIsActive(false)
    setCurrentTour(null)
    setCurrentStep(0)
    
    // Close any open dropdowns that might have been triggered by tour
    const demoAccountsButton = document.querySelector('[data-tour="demo-accounts-toggle"]') as HTMLButtonElement
    const dropdown = document.querySelector('[data-tour="demo-accounts-list"]')
    if (demoAccountsButton && dropdown) {
      demoAccountsButton.click()
    }
  }

  const nextStep = () => {
    const tour = getCurrentTourDefinition()
    if (!tour) return

    const step = getCurrentStep()
    if (step?.onNext) {
      step.onNext()
    }

    if (currentStep < tour.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      stopTour()
    }
  }

  const prevStep = () => {
    const step = getCurrentStep()
    if (step?.onPrev) {
      step.onPrev()
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTour = () => {
    console.log('Skipping tour')
    const step = getCurrentStep()
    if (step?.onSkip) {
      step.onSkip()
    }
    stopTour()
  }

  const goToStep = (stepIndex: number) => {
    const tour = getCurrentTourDefinition()
    if (tour && stepIndex >= 0 && stepIndex < tour.steps.length) {
      setCurrentStep(stepIndex)
    }
  }

  const toggleTourAvailability = () => {
    const newAvailability = !isTourAvailable
    setIsTourAvailable(newAvailability)
    localStorage.setItem('hb-tour-available', JSON.stringify(newAvailability))
    
    if (!newAvailability && isActive) {
      stopTour()
    }
  }

  // Add resetTourState function to context
  const resetTourState = () => {
    console.log('Resetting all tour state')
    setIsActive(false)
    setCurrentTour(null)
    setCurrentStep(0)
    
    // Clear all session-based tour tracking
    const keysToRemove = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && (key.startsWith('hb-tour-') || key.startsWith('hb-welcome-'))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key))
    
    // Reset tour availability preference
    localStorage.removeItem('hb-tour-available')
    setIsTourAvailable(true)
    
    console.log('Tour state completely reset')
  }

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentTour,
        currentStep,
        availableTours,
        startTour,
        stopTour,
        nextStep,
        prevStep,
        skipTour,
        goToStep,
        toggleTourAvailability,
        isTourAvailable,
        getCurrentTourDefinition,
        getCurrentStep,
        resetTourState,
      }}
    >
      {children}
    </TourContext.Provider>
  )
}

export const useTour = (): TourContextType => {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
} 