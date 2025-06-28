import type { Meta, StoryObj } from "@storybook/react"
import { ResponsibilitySettings } from "@/components/responsibility/ResponsibilitySettings"
import { mockRoles, mockCategories } from "./mock-data"

const meta: Meta<typeof ResponsibilitySettings> = {
  title: "Responsibility/ResponsibilitySettings",
  component: ResponsibilitySettings,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The ResponsibilitySettings component provides administrative controls for
managing project roles, task categories, and standard task templates
within the responsibility matrix system.

## Features
- Role management with color coding and descriptions
- Task category creation and organization
- Standard task templates for common responsibilities
- Role enable/disable functionality
- Bulk operations for efficiency

## Role Management
- Create custom roles with colors and descriptions
- Enable/disable roles for project phases
- Edit role properties and assignments
- Delete unused roles with validation

## Category Management
- Create task categories for organization
- Delete unused categories
- Organize tasks by functional areas

## Standard Tasks
- Pre-defined task templates
- Default role assignments
- Category-based organization
- Enable/disable task templates

## Usage
Accessed from the main ResponsibilityMatrixPage settings button
for project administrators and executives.
        `,
      },
    },
  },
  argTypes: {
    roles: {
      description: "Array of project roles to manage",
    },
    categories: {
      description: "Array of task categories",
    },
    onRoleUpdate: {
      description: "Callback when role is updated",
    },
    onRoleCreate: {
      description: "Callback when new role is created",
    },
    onRoleDelete: {
      description: "Callback when role is deleted",
    },
    onCategoryCreate: {
      description: "Callback when new category is created",
    },
    onCategoryDelete: {
      description: "Callback when category is deleted",
    },
  },
}

export default meta
type Story = StoryObj<typeof ResponsibilitySettings>

export const DefaultSettings: Story = {
  args: {
    roles: mockRoles,
    categories: mockCategories,
    onRoleUpdate: (role) => console.log("Role updated:", role),
    onRoleCreate: (role) => console.log("Role created:", role),
    onRoleDelete: (roleKey) => console.log("Role deleted:", roleKey),
    onCategoryCreate: (category) => console.log("Category created:", category),
    onCategoryDelete: (category) => console.log("Category deleted:", category),
  },
  parameters: {
    docs: {
      description: {
        story: "Default settings view with standard project roles and categories.",
      },
    },
  },
}

export const MinimalSetup: Story = {
  args: {
    roles: mockRoles.slice(0, 3),
    categories: mockCategories.slice(0, 5),
    onRoleUpdate: (role) => console.log("Role updated:", role),
    onRoleCreate: (role) => console.log("Role created:", role),
    onRoleDelete: (roleKey) => console.log("Role deleted:", roleKey),
    onCategoryCreate: (category) => console.log("Category created:", category),
    onCategoryDelete: (category) => console.log("Category deleted:", category),
  },
  parameters: {
    docs: {
      description: {
        story: "Minimal setup with few roles and categories for small projects.",
      },
    },
  },
}

export const ExtensiveSetup: Story = {
  args: {
    roles: [
      ...mockRoles,
      {
        key: "QM",
        name: "Quality Manager",
        color: "#9333EA",
        enabled: true,
        description: "Quality assurance and control oversight",
      },
      {
        key: "SM",
        name: "Safety Manager",
        color: "#DC2626",
        enabled: true,
        description: "Safety compliance and risk management",
      },
      {
        key: "CM",
        name: "Contract Manager",
        color: "#059669",
        enabled: false,
        description: "Contract administration and compliance",
      },
    ],
    categories: [
      ...mockCategories,
      "Environmental Compliance",
      "Technology Integration",
      "Vendor Management",
      "Training & Development",
    ],
    onRoleUpdate: (role) => console.log("Role updated:", role),
    onRoleCreate: (role) => console.log("Role created:", role),
    onRoleDelete: (roleKey) => console.log("Role deleted:", roleKey),
    onCategoryCreate: (category) => console.log("Category created:", category),
    onCategoryDelete: (category) => console.log("Category deleted:", category),
  },
  parameters: {
    docs: {
      description: {
        story: "Extensive setup with many roles and categories for large, complex projects.",
      },
    },
  },
}
