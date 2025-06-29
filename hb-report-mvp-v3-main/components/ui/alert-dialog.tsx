'use client'; // Marks this component as client-side only to handle dynamic overlay and content animations

import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

/**
 * AlertDialog Component
 * @description A modal dialog component for displaying critical alerts or confirmations, built with
 *              Radix UI. Provides a customizable overlay and content area with animations. Designed
 *              for client-side rendering to manage interactive states and transitions. Addresses
 *              rendering degradation by ensuring consistent Tailwind styling.
 * @features
 * - Customizable overlay with fade and zoom animations
 * - Header and footer sections for structured content
 * - Action and cancel buttons with variant support
 * - Responsive design with rounded corners
 */
const AlertDialog = AlertDialogPrimitive.Root;

/**
 * AlertDialogTrigger Component
 * @description The trigger element that opens the alert dialog when interacted with.
 */
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

/**
 * AlertDialogPortal Component
 * @description The portal that renders the dialog content into the DOM, separate from the trigger.
 */
const AlertDialogPortal = AlertDialogPrimitive.Portal;

/**
 * AlertDialogOverlay Component
 * @description The overlay backdrop for the alert dialog, providing a semi-transparent background.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>} props - Props for the overlay
 * @param {React.Ref<React.ElementRef<typeof AlertDialogPrimitive.Overlay>>} ref - Ref for the overlay element
 * @returns {JSX.Element} The overlay element with animation and styling
 */
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

/**
 * AlertDialogContent Component
 * @description The main content area of the alert dialog, centered and animated.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>} props - Props for the content
 * @param {React.Ref<React.ElementRef<typeof AlertDialogPrimitive.Content>>} ref - Ref for the content element
 * @returns {JSX.Element} The content element with positioning and animation
 */
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

/**
 * AlertDialogHeader Component
 * @description The header section of the alert dialog, supporting text alignment options.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML attributes for the header
 * @returns {JSX.Element} The header div with flexible layout
 */
const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
    {...props}
  />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

/**
 * AlertDialogFooter Component
 * @description The footer section of the alert dialog, supporting action buttons.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML attributes for the footer
 * @returns {JSX.Element} The footer div with flexible layout
 */
const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

/**
 * AlertDialogTitle Component
 * @description The title element within the alert dialog header.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>} props - Props for the title
 * @param {React.Ref<React.ElementRef<typeof AlertDialogPrimitive.Title>>} ref - Ref for the title element
 * @returns {JSX.Element} The title element with styling
 */
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

/**
 * AlertDialogDescription Component
 * @description The description element within the alert dialog content.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>} props - Props for the description
 * @param {React.Ref<React.ElementRef<typeof AlertDialogPrimitive.Description>>} ref - Ref for the description element
 * @returns {JSX.Element} The description element with styling
 */
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

/**
 * AlertDialogAction Component
 * @description The action button for confirming the alert dialog action.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>} props - Props for the action button
 * @param {React.Ref<React.ElementRef<typeof AlertDialogPrimitive.Action>>} ref - Ref for the action button
 * @returns {JSX.Element} The action button with button variant styling
 */
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

/**
 * AlertDialogCancel Component
 * @description The cancel button for dismissing the alert dialog.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>} props - Props for the cancel button
 * @param {React.Ref<React.ElementRef<typeof AlertDialogPrimitive.Cancel>>} ref - Ref for the cancel button
 * @returns {JSX.Element} The cancel button with outline variant styling
 */
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: 'outline' }),
      'mt-2 sm:mt-0',
      className,
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};