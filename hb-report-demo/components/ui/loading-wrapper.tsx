'use client'

import { Loader2 } from 'lucide-react'
import React from 'react'
import clsx from 'clsx'

type LoadingWrapperProps = {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  overlay?: boolean // for cards or modals
}

export const LoadingWrapper = ({
  isLoading,
  children,
  className = '',
  size = 'md',
  overlay = false,
}: LoadingWrapperProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  if (!isLoading) return <>{children}</>

  const spinner = (
    <div className="flex items-center justify-center">
      <Loader2 className={clsx('animate-spin text-muted-foreground', sizeClasses[size])} />
    </div>
  )

  if (overlay) {
    return (
      <div className={clsx('relative', className)}>
        <div className="opacity-50 pointer-events-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/60 backdrop-blur-sm z-10">
          {spinner}
        </div>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'flex h-full w-full items-center justify-center',
        className,
        'text-muted-foreground'
      )}
    >
      {spinner}
    </div>
  )
}