'use client'; // Marks this component as client-side only to handle dynamic collapse/expand states

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

/**
 * Collapsible Component
 * @description A collapsible content component built with Radix UI, allowing expandable sections.
 *              Designed for client-side rendering to manage interactive states and animations.
 *              Addresses rendering degradation by ensuring consistent Tailwind styling (to be applied by parent).
 * @features
 * - Supports collapsible and trigger elements
 * - Customizable content area
 * - Responsive design with dynamic height
 */
const Collapsible = CollapsiblePrimitive.Root;

/**
 * CollapsibleTrigger Component
 * @description The trigger element that toggles the collapsible content.
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

/**
 * CollapsibleContent Component
 * @description The content area that expands or collapses based on the trigger state.
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };