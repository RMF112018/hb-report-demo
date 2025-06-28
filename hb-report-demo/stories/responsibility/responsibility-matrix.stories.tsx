import type { Meta, StoryObj } from "@storybook/react"
import { ResponsibilityMatrix } from "@/components/responsibility/ResponsibilityMatrix"
import { mockResponsibilityTasks, mockRoles } from "./mock-data"

const meta: Meta<typeof ResponsibilityMatrix> = {
  title: "Responsibility/ResponsibilityMatrix",
  component: ResponsibilityMatrix,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The ResponsibilityMatrix component displays tasks in a tabular format with role assignments.
It supports RACI (Responsible, Accountable, Consulted, Informed) methodology with interactive
assignment cells, filtering, and bulk operations.

## Features
- Interactive RACI assignment cells
- Task filtering by category, role, and status
- Bulk assignment operations
- Sparkline trends for assignment history
- Expandable annotations
- AIA-compliant contract task display

## Usage
Used within the ResponsibilityMatrixPage for displaying and managing task assignments
across different matrix types (Team, Prime Contract, Subcontract).
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["team", "prime-contract", "subcontract"],
      description: "Matrix type determines which tasks are displayed",
    },
    tasks: {
      description: "Array of responsibility tasks to display",
    },
    roles: {
      description: "Array of project roles with assignments",
    },
    onTaskUpdate: {
      description: "Callback when task is updated",
    },
    onTaskDelete: {
      description: "Callback when task is deleted",
    },
    onTaskCreate: {
      description: "Callback to create new task",
    },
    onTaskEdit: {
      description: "Callback to edit existing task",
    },
    onExport: {
      description: "Callback to trigger export modal",
    },
  },
}

export default meta
type Story = StoryObj<typeof ResponsibilityMatrix>

export const TeamMatrix: Story = {
  args: {
    tasks: mockResponsibilityTasks.filter((task) => task.type === "team"),
    roles: mockRoles,
    type: "team",
    onTaskUpdate: (task) => console.log("Task updated:", task),
    onTaskDelete: (taskId) => console.log("Task deleted:", taskId),
    onTaskCreate: () => console.log("Create new task"),
    onTaskEdit: (task) => console.log("Edit task:", task),
    onExport: () => console.log("Export matrix"),
  },
  parameters: {
    docs: {
      description: {
        story: "Team matrix showing internal project team responsibilities and assignments.",
      },
    },
  },
}

export const PrimeContractMatrix: Story = {
  args: {
    tasks: mockResponsibilityTasks.filter((task) => task.type === "prime-contract"),
    roles: mockRoles,
    type: "prime-contract",
    onTaskUpdate: (task) => console.log("Task updated:", task),
    onTaskDelete: (taskId) => console.log("Task deleted:", taskId),
    onTaskCreate: () => console.log("Create new task"),
    onTaskEdit: (task) => console.log("Edit task:", task),
    onExport: () => console.log("Export matrix"),
  },
  parameters: {
    docs: {
      description: {
        story: "Prime contract matrix with AIA-compliant page and article references for contract tasks.",
      },
    },
  },
}

export const SubcontractMatrix: Story = {
  args: {
    tasks: mockResponsibilityTasks.filter((task) => task.type === "subcontract"),
    roles: mockRoles,
    type: "subcontract",
    onTaskUpdate: (task) => console.log("Task updated:", task),
    onTaskDelete: (taskId) => console.log("Task deleted:", taskId),
    onTaskCreate: () => console.log("Create new task"),
    onTaskEdit: (task) => console.log("Edit task:", task),
    onExport: () => console.log("Export matrix"),
  },
  parameters: {
    docs: {
      description: {
        story: "Subcontract matrix for managing contractor responsibilities and deliverables.",
      },
    },
  },
}

export const WithManyTasks: Story = {
  args: {
    tasks: mockResponsibilityTasks,
    roles: mockRoles,
    type: "team",
    onTaskUpdate: (task) => console.log("Task updated:", task),
    onTaskDelete: (taskId) => console.log("Task deleted:", taskId),
    onTaskCreate: () => console.log("Create new task"),
    onTaskEdit: (task) => console.log("Edit task:", task),
    onExport: () => console.log("Export matrix"),
  },
  parameters: {
    docs: {
      description: {
        story: "Matrix with many tasks demonstrating scrolling and category grouping.",
      },
    },
  },
}

export const EmptyMatrix: Story = {
  args: {
    tasks: [],
    roles: mockRoles,
    type: "team",
    onTaskUpdate: (task) => console.log("Task updated:", task),
    onTaskDelete: (taskId) => console.log("Task deleted:", taskId),
    onTaskCreate: () => console.log("Create new task"),
    onTaskEdit: (task) => console.log("Edit task:", task),
    onExport: () => console.log("Export matrix"),
  },
  parameters: {
    docs: {
      description: {
        story: "Empty matrix state encouraging users to create their first task.",
      },
    },
  },
}
