import type * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badge Component
 * @description A compact, inline badge component for displaying status indicators or labels, built with
 *              class-variance-authority (cva) for variant styling. Supports multiple variants for different
 *              use cases. Addresses rendering degradation by ensuring consistent Tailwind styling and rounded shape.
 * @features
 * - Supports default, secondary, destructive, and outline variants
 * - Inline-flex design for flexible placement
 * - Hover and focus states with transitions
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * BadgeProps Interface
 * @description Extends React HTML attributes with variant props for the Badge component.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };