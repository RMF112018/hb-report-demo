# HB Report Platform - Layout & Design Standards

## Overview

This document outlines the standardized layout, styling, and design patterns implemented across the HB Report Platform to ensure consistency, accessibility, and maintainability.

## Key Improvements Made

### 1. Standardized Page Layout Structure

All pages now follow a consistent structure using the `StandardPageLayout` component:

```tsx
<StandardPageLayout
  title="Page Title"
  description="Page description"
  breadcrumbs={breadcrumbsArray}
  badges={badgesArray}
  actions={actionButtons}
>
  {/* Page content */}
</StandardPageLayout>
```

### 2. Z-Index Hierarchy

Fixed layering issues with a standardized z-index system:

- **App Header**: `z-[100]` - Main navigation header
- **Mega Menus**: `z-[105]` - Department/project/tool dropdowns
- **Modal Overlays**: `z-[110]` - Dialog and sheet overlays
- **Modal Content**: `z-[120]` - Dialog and sheet content
- **Fullscreen Components**: `z-[130]` - Fullscreen views and overlays
- **Tour Tooltips**: `z-[140]` - Product tour elements
- **Toast Notifications**: `z-[150]` - Toast messages (highest priority)

### 3. Theme Compatibility

All components now use theme-aware styling:
- Replaced hardcoded colors with theme variables
- Added proper dark mode support
- Used semantic color classes (e.g., `text-foreground`, `bg-background`)

### 4. Typography Standards

Standardized heading and text styling:
- Page titles: `text-3xl font-bold text-foreground`
- Descriptions: `text-muted-foreground mt-1`
- Consistent font weights and sizes across components

## Component Standards

### Page Layout Structure

```tsx
import { StandardPageLayout, createDashboardBreadcrumbs } from "@/components/layout/StandardPageLayout"

export default function YourPage() {
  return (
    <StandardPageLayout
      title="Your Page Title"
      description="Brief description of the page functionality"
      breadcrumbs={createDashboardBreadcrumbs("Your Page")}
      badges={[
        { label: "Project Scope", variant: "outline" },
        { label: "Status Badge", variant: "secondary" }
      ]}
      actions={
        <>
          <Button variant="outline">Secondary Action</Button>
          <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]">Primary Action</Button>
        </>
      }
    >
      {/* Your page content here */}
    </StandardPageLayout>
  )
}
```

### Breadcrumb Helpers

Use the provided helper functions for consistent breadcrumb structures:

```tsx
// For dashboard pages
createDashboardBreadcrumbs("Page Name")

// For pre-construction pages
createPreconBreadcrumbs("Page Name")

// Custom breadcrumbs
[
  { label: "Dashboard", href: "/dashboard", icon: <Home className="h-3 w-3" /> },
  { label: "Current Page" }
]
```

### Color Standards

#### Theme-Aware Colors
```css
/* Use these instead of hardcoded colors */
text-foreground          /* Primary text */
text-muted-foreground   /* Secondary text */
bg-background           /* Background */
bg-card                 /* Card background */
border-border           /* Borders */

/* Status colors with dark mode support */
text-blue-600 dark:text-blue-400     /* Information */
text-green-600 dark:text-green-400   /* Success */
text-red-600 dark:text-red-400       /* Error/Warning */
text-orange-600 dark:text-orange-400 /* Accent */
```

#### Brand Colors
- Primary Orange: `#FF6B35` (buttons, accents)
- Hover Orange: `#E55A2B`
- Header Blue: `#1e3a8a` to `#2a5298` (gradient)

### Modal and Dialog Standards

All modals use the updated z-index system and proper positioning:

```tsx
<Dialog>
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
    {/* Modal content */}
  </DialogContent>
</Dialog>
```

- Overlays: `z-[110]`
- Content: `z-[120]`
- Proper scroll handling for tall content
- Consistent sizing and spacing

### Card Component Standards

```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Title</CardTitle>
    <Icon className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-foreground">Value</div>
    <p className="text-xs text-muted-foreground">Description</p>
  </CardContent>
</Card>
```

## File Structure

### New Components Created

- `components/layout/StandardPageLayout.tsx` - Main layout component
- `app/dashboard/sample-standardized-page.tsx` - Reference implementation

### Modified Components

- All UI components in `components/ui/` - Updated z-index values
- Various page components - Consistent title styling
- CSS utilities - Added z-index hierarchy classes

## Implementation Checklist

### For New Pages
- [ ] Use `StandardPageLayout` component
- [ ] Implement proper breadcrumbs
- [ ] Use theme-aware color classes
- [ ] Follow z-index hierarchy for modals
- [ ] Test in both light and dark themes

### For Existing Pages
- [ ] Replace custom layout with `StandardPageLayout`
- [ ] Update hardcoded colors to theme variables
- [ ] Fix any z-index conflicts
- [ ] Standardize title styling
- [ ] Ensure consistent spacing (`space-y-6 p-6`)

## Quality Assurance

### Visual Consistency Checklist
- [ ] Page titles use `text-3xl font-bold text-foreground`
- [ ] Descriptions use `text-muted-foreground mt-1`
- [ ] Consistent spacing throughout pages
- [ ] Proper breadcrumb navigation
- [ ] Action buttons aligned to the right
- [ ] Cards follow standard structure

### Accessibility Checklist
- [ ] Proper color contrast in both themes
- [ ] Semantic HTML structure
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Focus indicators visible

### Technical Checklist
- [ ] No z-index conflicts
- [ ] Modals appear above header
- [ ] Responsive design maintained
- [ ] Performance not impacted
- [ ] No console errors

## Development Guidelines

### When Creating New Components

1. **Follow the established patterns** - Use existing components as reference
2. **Use theme variables** - Never hardcode colors
3. **Consider dark mode** - Test in both themes
4. **Maintain z-index hierarchy** - Use established levels
5. **Include proper TypeScript types** - Ensure type safety

### When Modifying Existing Components

1. **Test thoroughly** - Check all pages using the component
2. **Maintain backward compatibility** - Don't break existing implementations
3. **Update documentation** - Keep this file current
4. **Consider performance** - Avoid unnecessary re-renders

## Common Patterns

### Statistics Cards
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Metric Name</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">Value</div>
      <p className="text-xs text-muted-foreground">Description</p>
    </CardContent>
  </Card>
</div>
```

### Action Button Groups
```tsx
<div className="flex items-center gap-3">
  <Button variant="outline" disabled={isLoading}>
    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
    Refresh
  </Button>
  <Button variant="outline">
    <Download className="h-4 w-4 mr-2" />
    Export
  </Button>
  <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]">
    <Plus className="h-4 w-4 mr-2" />
    Create
  </Button>
</div>
```

### HBI Intelligence Panels
```tsx
<Card className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900 border-indigo-200 dark:border-indigo-800">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
      <Brain className="h-5 w-5" />
      HBI Intelligence Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Intelligence content */}
  </CardContent>
</Card>
```

## Maintenance

This document should be updated whenever:
- New design patterns are established
- Z-index hierarchy changes
- Theme variables are modified
- New layout components are created

## References

- Design System: Tailwind CSS + shadcn/ui
- Theme Management: next-themes
- Icons: Lucide React
- Color Palette: Custom HB brand colors with theme variants 