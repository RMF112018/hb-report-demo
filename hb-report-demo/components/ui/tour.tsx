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
  const [contentAreaHeight, setContentAreaHeight] = useState(120)
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
    
    // Theme-aware overlay colors
    const isDarkMode = document.documentElement.classList.contains('dark')
    const overlayColor = skipOverlay 
      ? (isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.2)')
      : (isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)')
    
    let overlayStyle: React.CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: overlayColor,
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
    
    // Calculate tooltip height with proper space for buttons
    const contentLength = step?.content?.length || 0
    const headerHeight = 120 // Space for progress bar, title, badge
    const buttonHeight = 80  // Space for navigation buttons and padding
    const contentBaseHeight = 150 // Minimum content area
    const extraContentHeight = Math.min(contentLength / 6, 100) // Additional space for longer content
    
    const calculatedHeight = headerHeight + contentBaseHeight + extraContentHeight + buttonHeight
    const maxTooltipHeight = Math.min(calculatedHeight, viewportHeight - 80) // Leave margin for viewport
    const tooltipHeight = Math.max(300, maxTooltipHeight) // Minimum 300px to ensure buttons are visible
    const margin = 20

    // Calculate and set dynamic content area height
    const dynamicContentAreaHeight = Math.max(120, tooltipHeight - 200)
    setContentAreaHeight(dynamicContentAreaHeight)

    let tooltipStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: skipOverlay ? 10000 : 9999, // Higher z-index when dropdown is involved
      maxWidth: `${tooltipWidth}px`,
      minWidth: Math.min(300, viewportWidth - 40) + 'px',
      height: `${tooltipHeight}px`, // Fixed height to ensure buttons are visible
      overflow: 'hidden', // Container should not scroll, content area will
      display: 'flex',
      flexDirection: 'column'
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
        // Always try to position intelligently to avoid covering the dropdown
        if (viewportWidth > 768) {
          // Desktop: try positioning to the left of the dropdown first
          left = positionRect.left - tooltipWidth - margin
          top = positionRect.top
          
          // If not enough space on left, try right
          if (left < margin) {
            left = positionRect.right + margin
            
            // If still not enough space on right, position above/below
            if (left + tooltipWidth > viewportWidth - margin) {
              left = Math.max(margin, viewportWidth - tooltipWidth - margin)
              
              // Try positioning above first
              top = positionRect.top - tooltipHeight - margin
              
              // If not enough space above, position below
              if (top < margin) {
                top = positionRect.bottom + margin
                
                // If tooltip would overflow bottom, constrain it
                if (top + tooltipHeight > viewportHeight - margin) {
                  top = viewportHeight - tooltipHeight - margin
                  // Make sure it doesn't go above the top
                  top = Math.max(margin, top)
                }
              }
            }
          }
          
          // Final viewport boundary check for top position
          if (top + tooltipHeight > viewportHeight - margin) {
            top = viewportHeight - tooltipHeight - margin
          }
          top = Math.max(margin, top)
          
        } else {
          // Mobile: position at top of screen with better constraints
          left = margin
          top = margin + 60
          // Ensure tooltip doesn't exceed mobile viewport
          const mobileMaxHeight = viewportHeight - 160 // Account for mobile UI elements
          tooltipStyle.maxHeight = `${Math.min(maxTooltipHeight, mobileMaxHeight)}px`
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
      <Card style={tooltipStyle} className="tour-tooltip shadow-2xl border-2 bg-background text-foreground flex flex-col dark:shadow-black/50">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground border-secondary-foreground/20">
              Step {currentStep + 1} of {tour.steps.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={stopTour}
              className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progress} className="h-2 bg-secondary" />
          <CardTitle className="text-lg mt-3 text-foreground">{step.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0 flex-1 flex flex-col">
          <div 
            className="overflow-y-auto pr-2 mb-4 flex-1"
            style={{ 
              maxHeight: `${contentAreaHeight}px` // Dynamic max height based on available space
            }}
          >
            <CardDescription 
              className="text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground [&_em]:text-foreground"
              dangerouslySetInnerHTML={{ __html: step.content }}
            />
          </div>
          
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-border bg-background flex-shrink-0">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  className="flex items-center gap-2 border-border hover:bg-accent hover:text-accent-foreground"
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
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <SkipForward className="h-4 w-4" />
                  Skip Tour
                </Button>
              )}
              
              <Button
                onClick={nextStep}
                size="sm"
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
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
  const [mounted, setMounted] = useState(false)

  // Detect if we're on the login page to force light theme
  useEffect(() => {
    setMounted(true)
    const checkPage = () => {
      setIsLoginPage(window.location.pathname === '/login')
    }
    
    checkPage()
    window.addEventListener('popstate', checkPage)
    
    return () => window.removeEventListener('popstate', checkPage)
  }, [])

  if (!mounted || !isActive || !step) return null

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
        className="flex items-center gap-2 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
      >
        <Play className="h-4 w-4" />
        Tours
      </Button>

      {showMenu && (
        <Card className="absolute right-0 top-full mt-2 w-80 shadow-lg z-50 bg-background text-foreground border border-border dark:shadow-black/50 dark:border-border">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm text-foreground">Guided Tours</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
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
                  className="w-full justify-start text-left h-auto p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                  disabled={isActive && currentTour === tour.id}
                >
                  <div className="text-left w-full">
                    <div className="font-medium text-sm text-foreground">{tour.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 whitespace-normal">
                      {tour.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            
            {isActive && (
              <div className="pt-3 mt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    stopTour()
                    setShowMenu(false)
                  }}
                  className="w-full border-border hover:bg-accent hover:text-accent-foreground"
                >
                  Stop Current Tour
                </Button>
              </div>
            )}
            
            <div className="pt-3 mt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toggleTourAvailability()
                  setShowMenu(false)
                }}
                className="w-full text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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