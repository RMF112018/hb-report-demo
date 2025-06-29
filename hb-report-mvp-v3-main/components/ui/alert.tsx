import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Alert Component
 * @description A versatile alert component for displaying notifications or warnings, built with
 *              class-variance-authority (cva) for variant styling. Supports default and destructive
 *              variants with customizable content. Addresses rendering degradation by ensuring
 *              consistent Tailwind styling and rounded corners.
 * @features
 * - Supports default and destructive variants
 * - Includes title and description sections
 * - Responsive design with flexible layout
 */
const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

/**
 * AlertTitle Component
 * @description The title element within the alert, providing a prominent heading.
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props - HTML attributes for the title
 * @param {React.Ref<HTMLParagraphElement>} ref - Ref for the title element
 * @returns {JSX.Element} The title element with styling
 */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

/**
 * AlertDescription Component
 * @description The description element within the alert, providing additional details.
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - HTML attributes for the description
 * @param {React.Ref<HTMLParagraphElement>} ref - Ref for the description element
 * @returns {JSX.Element} The description element with styling
 */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };