'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTour } from '@/context/tour-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { X, ArrowLeft, ArrowRight, SkipForward, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TourOverlayProps {
  target: string
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center'
  onClose: () => void
}

const TourOverlay: React.FC<TourOverlayProps> = ({ target, placement, onClose }) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({})
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const [mounted, setMounted] = useState(false)

  const {
    getCurrentStep,
    getCurrentTourDefinition,
    currentStep,
    nextStep,
    prevStep,
    skipTour,
    stopTour,
  } = useTour()

  const step = getCurrentStep()
  const tour = getCurrentTourDefinition()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const findTargetElement = () => {
      const element = document.querySelector(target) as HTMLElement
      if (element) {
        setTargetElement(element)
        calculatePositions(element)
      } else {
        // Retry after a short delay if element not found
        setTimeout(findTargetElement, 100)
      }
    }

    findTargetElement()

    const handleResize = () => {
      if (targetElement) {
        calculatePositions(targetElement)
      }
    }

    // Reduced MutationObserver frequency to prevent glitchy behavior
    let resizeTimeout: NodeJS.Timeout
    const observer = new MutationObserver(() => {
      if (targetElement && document.contains(targetElement)) {
        // Debounce position calculations
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          calculatePositions(targetElement)
        }, 150)
      }
    })

    if (targetElement) {
      observer.observe(document.body, {
        childList: true,
        subtree: false, // Reduce scope to prevent excessive triggers
        attributes: true,
        attributeFilter: ['class', 'style']
      })
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
      clearTimeout(resizeTimeout)
    }
  }, [target, mounted, targetElement])

  const calculatePositions = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Special handling for demo accounts dropdown
    let expandedArea = rect
    let skipOverlay = false

    // Check for open dropdowns that might interfere
    const openDropdowns = document.querySelectorAll('[data-tour="demo-accounts-list"]:not([style*="display: none"])')
    
    if (openDropdowns.length > 0 && target === '[data-tour="demo-accounts-list"]') {
      const dropdown = openDropdowns[0] as HTMLElement
      const dropdownRect = dropdown.getBoundingClientRect()
      
      // For dropdown, don't create overlay to allow interaction
      skipOverlay = true
      
      // Use the dropdown bounds for positioning
      expandedArea = dropdownRect
    } else if (target === '[data-tour="demo-accounts-toggle"]') {
      // For the toggle button, use normal behavior but lighter overlay
      expandedArea = rect
    }

    // Create overlay with cutout for the target element (skip for dropdown)
    const padding = skipOverlay ? 0 : 8
    let overlayStyle: React.CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: skipOverlay ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.5)',
      zIndex: skipOverlay ? 9990 : 9998, // Lower z-index for dropdown interaction
      pointerEvents: skipOverlay ? 'none' : 'auto', // Allow clicks through for dropdown
    }

    if (!skipOverlay) {
      overlayStyle.clipPath = `polygon(
        0% 0%, 
        0% 100%, 
        ${expandedArea.left - padding}px 100%, 
        ${expandedArea.left - padding}px ${expandedArea.top - padding}px, 
        ${expandedArea.right + padding}px ${expandedArea.top - padding}px, 
        ${expandedArea.right + padding}px ${expandedArea.bottom + padding}px, 
        ${expandedArea.left - padding}px ${expandedArea.bottom + padding}px, 
        ${expandedArea.left - padding}px 100%, 
        100% 100%, 
        100% 0%
      )`
    }

    // Calculate tooltip position with better collision detection
    const tooltipWidth = Math.min(400, viewportWidth - 40) // Responsive width
    const tooltipHeight = 250 // Estimated height with content
    const margin = 20

    let tooltipStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: skipOverlay ? 10000 : 9999, // Higher z-index when dropdown is involved
      maxWidth: `${tooltipWidth}px`,
      minWidth: Math.min(300, viewportWidth - 40) + 'px',
    }

    if (placement === 'center') {
      tooltipStyle = {
        ...tooltipStyle,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    } else {
      // Smart positioning with fallback options
      let finalPlacement = placement
      let top = 0
      let left = 0

      // Use expanded area for positioning if dropdown is involved
      const positionRect = expandedArea

      // Special positioning for demo accounts dropdown to avoid overlap
      if (target === '[data-tour="demo-accounts-list"]') {
        // Position to the side of the dropdown, not over it
        if (viewportWidth > 768) {
          // Desktop: position to the right of dropdown
          left = positionRect.right + margin
          top = positionRect.top
          
          // If not enough space on right, try left
          if (left + tooltipWidth > viewportWidth - margin) {
            left = positionRect.left - tooltipWidth - margin
          }
          
          // If still not enough space, position above or below
          if (left < margin) {
            left = margin
            top = positionRect.bottom + margin
            if (top + tooltipHeight > viewportHeight - margin) {
              top = positionRect.top - tooltipHeight - margin
            }
          }
        } else {
          // Mobile: position at top or bottom of screen
          left = margin
          top = margin + 60
          tooltipStyle.maxWidth = `${viewportWidth - 2 * margin}px`
        }
      } else {
        // Normal positioning logic for other elements
        switch (placement) {
          case 'top':
            top = positionRect.top - tooltipHeight - margin
            left = positionRect.left + positionRect.width / 2 - tooltipWidth / 2
            if (top < margin) {
              finalPlacement = 'bottom'
              top = positionRect.bottom + margin
            }
            break
          case 'bottom':
            top = positionRect.bottom + margin
            left = positionRect.left + positionRect.width / 2 - tooltipWidth / 2
            if (top + tooltipHeight > viewportHeight - margin) {
              finalPlacement = 'top'
              top = positionRect.top - tooltipHeight - margin
            }
            break
          case 'left':
            top = positionRect.top + positionRect.height / 2 - tooltipHeight / 2
            left = positionRect.left - tooltipWidth - margin
            if (left < margin) {
              finalPlacement = 'right'
              left = positionRect.right + margin
            }
            break
          case 'right':
            top = positionRect.top + positionRect.height / 2 - tooltipHeight / 2
            left = positionRect.right + margin
            if (left + tooltipWidth > viewportWidth - margin) {
              finalPlacement = 'left'
              left = positionRect.left - tooltipWidth - margin
            }
            break
        }

        // Ensure tooltip stays within viewport bounds
        left = Math.max(margin, Math.min(left, viewportWidth - tooltipWidth - margin))
        top = Math.max(margin, Math.min(top, viewportHeight - tooltipHeight - margin))

        // For mobile devices, position at bottom of screen if element is in upper half
        if (viewportWidth <= 768) {
          if (positionRect.top < viewportHeight / 2) {
            // Element in upper half - position tooltip at bottom
            top = viewportHeight - tooltipHeight - margin - 80 // Account for mobile chrome bars
            left = margin
            tooltipStyle.maxWidth = `${viewportWidth - 2 * margin}px`
          } else {
            // Element in lower half - position tooltip at top
            top = margin + 60 // Account for mobile status bar
            left = margin
            tooltipStyle.maxWidth = `${viewportWidth - 2 * margin}px`
          }
        }
      }

      tooltipStyle = {
        ...tooltipStyle,
        top: `${top}px`,
        left: `${left}px`,
      }
    }

    setOverlayStyle(overlayStyle)
    setTooltipStyle(tooltipStyle)
  }

  if (!mounted || !step || !tour) return null

  const progress = ((currentStep + 1) / tour.steps.length) * 100

  return createPortal(
    <div className="tour-container">
      {/* Overlay with cutout */}
      <div 
        style={overlayStyle} 
        className="tour-overlay"
        onClick={(e) => {
          e.stopPropagation()
          stopTour()
        }}
      />
      
      {/* Tooltip */}
      <Card style={tooltipStyle} className="tour-tooltip shadow-2xl border-2 bg-background text-foreground">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              Step {currentStep + 1} of {tour.steps.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={stopTour}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
          <CardTitle className="text-lg mt-3">{step.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          <CardDescription 
            className="text-sm mb-6 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: step.content }}
          />
          
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {step.prevButton || 'Previous'}
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              {step.showSkip && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipTour}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <SkipForward className="h-4 w-4" />
                  Skip Tour
                </Button>
              )}
              
              <Button
                onClick={nextStep}
                size="sm"
                className="flex items-center gap-2"
              >
                {step.nextButton || 'Next'}
                {currentStep < tour.steps.length - 1 && (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body
  )
}

export const Tour: React.FC = () => {
  const { isActive, getCurrentStep } = useTour()
  const step = getCurrentStep()
  const [isLoginPage, setIsLoginPage] = useState(false)

  // Detect if we're on the login page to force light theme
  useEffect(() => {
    const checkPage = () => {
      setIsLoginPage(window.location.pathname === '/login')
    }
    
    checkPage()
    window.addEventListener('popstate', checkPage)
    
    return () => window.removeEventListener('popstate', checkPage)
  }, [])

  if (!isActive || !step) return null

  return (
    <div className={isLoginPage ? 'light' : ''}>
      <TourOverlay
        target={step.target}
        placement={step.placement}
        onClose={() => {}} // Not used - handled in overlay click
      />
    </div>
  )
}

interface TourControlsProps {
  className?: string
}

export const TourControls: React.FC<TourControlsProps> = ({ className }) => {
  const {
    isActive,
    isTourAvailable,
    availableTours,
    startTour,
    stopTour,
    toggleTourAvailability,
    currentTour,
  } = useTour()

  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!isTourAvailable) return null

  return (
    <div className={cn("relative", className)} data-tour="tour-controls" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2"
      >
        <Play className="h-4 w-4" />
        Tours
      </Button>

      {showMenu && (
        <Card className="absolute right-0 top-full mt-2 w-64 shadow-lg z-50 bg-background text-foreground border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Guided Tours</CardTitle>
            <CardDescription className="text-xs">
              Interactive guides to help you explore the application
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-2">
              {availableTours.map((tour) => (
                <Button
                  key={tour.id}
                  variant={currentTour === tour.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    startTour(tour.id)
                    setShowMenu(false)
                  }}
                  className="w-full justify-start text-left"
                  disabled={isActive && currentTour === tour.id}
                >
                  <div>
                    <div className="font-medium">{tour.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {tour.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            
            {isActive && (
              <div className="pt-3 mt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    stopTour()
                    setShowMenu(false)
                  }}
                  className="w-full"
                >
                  Stop Current Tour
                </Button>
              </div>
            )}
            
            <div className="pt-3 mt-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toggleTourAvailability()
                  setShowMenu(false)
                }}
                className="w-full text-xs text-muted-foreground"
              >
                Disable Tours
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 