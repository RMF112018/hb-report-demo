import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Card Component
 * @description A flexible card component for displaying content with a border, background, and shadow.
 *              Supports various sections (header, title, description, content, footer) for structured layouts.
 *              Addresses rendering degradation by ensuring consistent Tailwind styling and rounded corners.
 * @features
 * - Customizable with additional classes
 * - Structured sections for header, title, description, content, and footer
 * - Responsive design with padding and spacing
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
    {...props}
  />
));
Card.displayName = 'Card';

/**
 * CardHeader Component
 * @description The header section of the card, providing a structured area for titles and descriptions.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML attributes for the header
 * @param {React.Ref<HTMLDivElement>} ref - Ref for the header element
 * @returns {JSX.Element} The header div with padding and spacing
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

/**
 * CardTitle Component
 * @description The title element within the card header, providing a prominent heading.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML attributes for the title
 * @param {React.Ref<HTMLDivElement>} ref - Ref for the title element
 * @returns {JSX.Element} The title div with typography styling
 */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

/**
 * CardDescription Component
 * @description The description element within the card, providing additional context.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML attributes for the description
 * @param {React.Ref<HTMLDivElement>} ref - Ref for the description element
 * @returns {JSX.Element} The description div with muted text styling
 */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/**
 * CardContent Component
 * @description The content section of the card, providing the main body area.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML attributes for the content
 * @param {React.Ref<HTMLDivElement>} ref - Ref for the content element
 * @returns {JSX.Element} The content div with padding
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

/**
 * CardFooter Component
 * @description The footer section of the card, providing a structured area for actions.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML attributes for the footer
 * @param {React.Ref<HTMLDivElement>} ref - Ref for the footer element
 * @returns {JSX.Element} The footer div with flexible layout
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };