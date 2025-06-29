'use client'; // Marks this component as client-side only to handle dynamic image loading and fallback rendering

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

/**
 * Avatar Component
 * @description A circular avatar component for displaying user images or fallbacks, built with
 *              Radix UI. Supports image loading with a fallback for when the image fails.
 *              Addresses rendering degradation by ensuring consistent Tailwind styling and rounded shape.
 * @features
 * - Displays user images or fallback initials
 * - Responsive design with fixed dimensions
 * - Client-side rendering for dynamic image handling
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

/**
 * AvatarImage Component
 * @description The image element within the avatar, displaying the user's profile picture.
 * @param {React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>} props - Props for the image
 * @param {React.Ref<React.ElementRef<typeof AvatarPrimitive.Image>>} ref - Ref for the image element
 * @returns {JSX.Element} The image element with aspect ratio and sizing
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

/**
 * AvatarFallback Component
 * @description The fallback element within the avatar, displaying initials when the image fails.
 * @param {React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>} props - Props for the fallback
 * @param {React.Ref<React.ElementRef<typeof AvatarPrimitive.Fallback>>} ref - Ref for the fallback element
 * @returns {JSX.Element} The fallback element with centered content
 */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };