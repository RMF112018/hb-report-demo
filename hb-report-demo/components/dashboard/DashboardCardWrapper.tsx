'use client'

import { cn } from '@/lib/utils'
import { X, Move, Settings2 } from 'lucide-react'
import { DashboardCard } from '@/types/dashboard'
import { ReactNode } from 'react'

interface DashboardCardWrapperProps {
  card: DashboardCard
  children: ReactNode
  onRemove?: (id: string) => void
  onConfigure?: (id: string) => void
  dragHandleClass?: string
}

export const DashboardCardWrapper = ({
  card,
  children,
  onRemove,
  onConfigure,
  dragHandleClass,
}: DashboardCardWrapperProps) => {
  return children;
}
