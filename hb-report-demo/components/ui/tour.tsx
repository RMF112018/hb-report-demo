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

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [target, mounted, targetElement])

  const calculatePositions = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Create overlay with cutout for the target element
    const padding = 8
    const overlayStyle: React.CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9998,
      clipPath: `polygon(
        0% 0%, 
        0% 100%, 
        ${rect.left - padding}px 100%, 
        ${rect.left - padding}px ${rect.top - padding}px, 
        ${rect.right + padding}px ${rect.top - padding}px, 
        ${rect.right + padding}px ${rect.bottom + padding}px, 
        ${rect.left - padding}px ${rect.bottom + padding}px, 
        ${rect.left - padding}px 100%, 
        100% 100%, 
        100% 0%
      )`,
    }

    // Calculate tooltip position
    let tooltipStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      maxWidth: '400px',
      minWidth: '300px',
    }

    if (placement === 'center') {
      tooltipStyle = {
        ...tooltipStyle,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    } else {
      const tooltipWidth = 350
      const tooltipHeight = 200

      switch (placement) {
        case 'top':
          tooltipStyle = {
            ...tooltipStyle,
            top: Math.max(20, rect.top - tooltipHeight - 20),
            left: Math.min(
              Math.max(20, rect.left + rect.width / 2 - tooltipWidth / 2),
              viewportWidth - tooltipWidth - 20
            ),
          }
          break
        case 'bottom':
          tooltipStyle = {
            ...tooltipStyle,
            top: Math.min(viewportHeight - tooltipHeight - 20, rect.bottom + 20),
            left: Math.min(
              Math.max(20, rect.left + rect.width / 2 - tooltipWidth / 2),
              viewportWidth - tooltipWidth - 20
            ),
          }
          break
        case 'left':
          tooltipStyle = {
            ...tooltipStyle,
            top: Math.min(
              Math.max(20, rect.top + rect.height / 2 - tooltipHeight / 2),
              viewportHeight - tooltipHeight - 20
            ),
            left: Math.max(20, rect.left - tooltipWidth - 20),
          }
          break
        case 'right':
          tooltipStyle = {
            ...tooltipStyle,
            top: Math.min(
              Math.max(20, rect.top + rect.height / 2 - tooltipHeight / 2),
              viewportHeight - tooltipHeight - 20
            ),
            left: Math.min(rect.right + 20, viewportWidth - tooltipWidth - 20),
          }
          break
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
        onClick={onClose}
      />
      
      {/* Tooltip */}
      <Card style={tooltipStyle} className="tour-tooltip shadow-2xl border-2">
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

  if (!isActive || !step) return null

  return (
    <TourOverlay
      target={step.target}
      placement={step.placement}
      onClose={() => {}}
    />
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
        <Card className="absolute right-0 top-full mt-2 w-64 shadow-lg z-50">
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