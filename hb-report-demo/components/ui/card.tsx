import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  elevation?: 'sm' | 'md' | 'lg' | 'xl'
}>(({ className, variant = 'default', elevation = 'md', ...props }, ref) => {
  const baseClasses = "rounded-xl border bg-card text-card-foreground transition-all duration-200"
  
  const variantClasses = {
    default: "shadow-sm hover:shadow-md border-border/50",
    elevated: "shadow-lg hover:shadow-xl border-border/30 bg-card/95 backdrop-blur-sm",
    outlined: "border-2 border-border shadow-none hover:shadow-sm",
    ghost: "border-transparent shadow-none hover:bg-accent/50"
  }
  
  const elevationClasses = {
    sm: "shadow-sm hover:shadow-md",
    md: "shadow-md hover:shadow-lg",
    lg: "shadow-lg hover:shadow-xl",
    xl: "shadow-xl hover:shadow-2xl"
  }
  
  return (
    <div 
      ref={ref} 
      className={cn(
        baseClasses,
        variantClasses[variant],
        elevationClasses[elevation],
        className
      )} 
      {...props} 
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'gradient' | 'accent'
}>(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: "bg-muted/30",
    gradient: "bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5",
    accent: "bg-accent/20 border-b border-accent/30"
  }
  
  return (
    <div 
      ref={ref} 
      className={cn(
        "flex flex-col space-y-1.5 p-4 sm:p-5 lg:p-6 rounded-t-xl",
        variantClasses[variant],
        className
      )} 
      {...props} 
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement> & {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>(({ className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: "text-lg font-semibold",
    md: "text-xl font-semibold", 
    lg: "text-2xl font-bold",
    xl: "text-3xl font-bold"
  }
  
  return (
    <h3 
      ref={ref} 
      className={cn(
        "leading-none tracking-tight text-foreground",
        sizeClasses[size],
        className
      )} 
      {...props} 
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p 
      ref={ref} 
      className={cn("text-sm text-muted-foreground leading-relaxed", className)} 
      {...props} 
    />
  ),
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}>(({ className, padding = 'md', ...props }, ref) => {
  const paddingClasses = {
    none: "p-0",
    sm: "p-3 pt-0",
    md: "p-4 sm:p-5 lg:p-6 pt-0",
    lg: "p-6 sm:p-7 lg:p-8 pt-0"
  }
  
  return (
    <div 
      ref={ref} 
      className={cn(paddingClasses[padding], className)} 
      {...props} 
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("flex items-center p-4 sm:p-5 lg:p-6 pt-0 border-t border-border/30 mt-auto", className)} 
      {...props} 
    />
  ),
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
