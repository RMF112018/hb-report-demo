import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Date utility functions
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function differenceInBusinessDays(laterDate: Date, earlierDate: Date): number {
  const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((laterDate.getTime() - earlierDate.getTime()) / oneDay))

  // Simple business days calculation (excluding weekends)
  let businessDays = 0
  const currentDate = new Date(earlierDate)

  for (let i = 0; i < diffDays; i++) {
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not Sunday (0) or Saturday (6)
      businessDays++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return businessDays
}

export function format(date: Date, formatString: string): string {
  // Simple date formatting function
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  switch (formatString) {
    case "MM/dd/yy":
      return `${month}/${day}/${String(year).slice(-2)}`
    case "yyyy-MM-dd":
      return `${year}-${month}-${day}`
    case "MMM dd, yyyy":
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return `${monthNames[date.getMonth()]} ${day}, ${year}`
    default:
      return date.toLocaleDateString()
  }
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}
