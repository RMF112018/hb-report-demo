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
  startTour: (tourId: string) => void
  stopTour: () => void
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
  goToStep: (stepIndex: number) => void
  toggleTourAvailability: () => void
  isTourAvailable: boolean
  getCurrentTourDefinition: () => TourDefinition | null
  getCurrentStep: () => TourStep | null
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
        content: 'Click this button to see available demo accounts. Each account represents a different user role with specific permissions and dashboard configurations.',
        target: '[data-tour="demo-accounts-toggle"]',
        placement: 'top',
        nextButton: 'Show Me',
        onNext: () => {
          // Trigger demo accounts dropdown
          const button = document.querySelector('[data-tour="demo-accounts-toggle"]') as HTMLButtonElement
          if (button) button.click()
        }
      },
      {
        id: 'role-selection',
        title: 'Choose Your Role',
        content: 'Select from different user roles to experience the application from various perspectives. Each role has access to different tools and dashboard layouts:<br/><br/><strong>Executive:</strong> High-level portfolio overview<br/><strong>Project Executive:</strong> Multi-project management<br/><strong>Project Manager:</strong> Detailed project controls<br/><strong>Estimator:</strong> Pre-construction focus<br/><strong>Admin:</strong> System administration',
        target: '[data-tour="demo-accounts-list"]',
        placement: 'right',
        nextButton: 'Understood'
      },
      {
        id: 'login-process',
        title: 'Automatic Login',
        content: 'Once you select a demo account, you\'ll be automatically logged in and redirected to the appropriate dashboard for that role. The dashboard content and available tools will vary based on your selected role.',
        target: '.login-form',
        placement: 'left',
        nextButton: 'Start Exploring'
      }
    ]
  },
  {
    id: 'dashboard-overview',
    name: 'Dashboard Overview',
    description: 'Explore the main dashboard features and navigation',
    page: 'dashboard',
    steps: [
      {
        id: 'dashboard-welcome',
        title: 'Welcome to Your Dashboard!',
        content: 'This dashboard is customized for your role and provides the most relevant information and tools for your daily work.',
        target: '[data-tour="dashboard-content"]',
        placement: 'center',
        nextButton: 'Explore Features'
      },
      {
        id: 'navigation-header',
        title: 'Main Navigation',
        content: 'The header provides access to all major sections of the application. You can switch between different project views, access tools, and manage your account settings.',
        target: '[data-tour="app-header"]',
        placement: 'bottom',
        nextButton: 'Continue'
      },
      {
        id: 'dashboard-selector',
        title: 'Dashboard Layouts',
        content: 'Different dashboard layouts are available based on your role. You can customize the layout and add/remove cards to match your workflow.',
        target: '[data-tour="dashboard-selector"]',
        placement: 'bottom',
        nextButton: 'Next'
      },
      {
        id: 'tour-controls',
        title: 'Tour Controls',
        content: 'You can restart this tour or explore other guided tours anytime using the tour controls in the header. Tours are contextual based on the page you\'re viewing.',
        target: '[data-tour="tour-controls"]',
        placement: 'bottom',
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
      setIsTourAvailable(JSON.parse(tourPref))
    }
  }, [])

  // Get available tours based on user role and current page
  const availableTours = TOUR_DEFINITIONS.filter(tour => {
    if (tour.userRoles && user) {
      return tour.userRoles.includes(user.role)
    }
    return true
  })

  const getCurrentTourDefinition = (): TourDefinition | null => {
    if (!currentTour) return null
    return TOUR_DEFINITIONS.find(tour => tour.id === currentTour) || null
  }

  const getCurrentStep = (): TourStep | null => {
    const tour = getCurrentTourDefinition()
    if (!tour || currentStep >= tour.steps.length) return null
    return tour.steps[currentStep]
  }

  const startTour = (tourId: string) => {
    const tour = TOUR_DEFINITIONS.find(t => t.id === tourId)
    if (tour) {
      setCurrentTour(tourId)
      setCurrentStep(0)
      setIsActive(true)
    }
  }

  const stopTour = () => {
    setIsActive(false)
    setCurrentTour(null)
    setCurrentStep(0)
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