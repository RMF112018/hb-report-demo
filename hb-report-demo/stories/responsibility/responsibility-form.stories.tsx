import type { Meta, StoryObj } from "@storybook/react"
import { ResponsibilityForm } from "@/components/responsibility/ResponsibilityForm"
import { mockRoles, mockCategories, mockResponsibilityTasks } from "./mock-data"

const meta: Meta<typeof ResponsibilityForm> = {
  title: "Responsibility/ResponsibilityForm",
  component: ResponsibilityForm,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The ResponsibilityForm component provides a comprehensive interface for creating
and editing responsibility matrix tasks with role assignments, annotations,
and AIA compliance validation.

## Features
- Task type selection (Team, Prime Contract, Subcontract)
- Category management with custom category creation
- Interactive role assignment with visual feedback
- Annotation system for task comments
- AIA compliance validation for contract tasks
- Real-time form validation and error handling

## Task Types
- **Team Matrix**: Internal project team responsibilities
- **Prime Contract**: Owner-contractor relationship tasks
- **Subcontract**: Contractor-subcontractor tasks

## Role Assignments
- **X (Responsible)**: Primary accountability for task completion
- **Support**: Provides assistance and backup support
- **None**: No assignment for this role

## Usage
Opened as a modal dialog from the ResponsibilityMatrix component
for creating new tasks or editing existing ones.
        `,
      },
    },
  },
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Controls modal visibility",
    },
    task: {
      description: "Existing task for editing (undefined for new task)",
    },
    roles: {
      description: "Available project roles for assignment",
    },
    categories: {
      description: "Available task categories",
    },
    onSave: {
      description: "Callback when task is saved",
    },
    onCancel: {
      description: "Callback when form is cancelled",
    },
  },
}

export default meta
type Story = StoryObj<typeof ResponsibilityForm>

export const CreateNewTask: Story = {
  args: {
    isOpen: true,
    roles: mockRoles,
    categories: mockCategories,
    onSave: (task) => console.log("Task saved:", task),
    onCancel: () => console.log("Form cancelled"),
  },
  parameters: {
    docs: {
      description: {
        story: "Form for creating a new responsibility task with empty fields.",
      },
    },
  },
}

export const EditExistingTask: Story = {
  args: {
    isOpen: true,
    task: mockResponsibilityTasks[0],
    roles: mockRoles,
    categories: mockCategories,
    onSave: (task) => console.log("Task updated:", task),
    onCancel: () => console.log("Form cancelled"),
  },
  parameters: {
    docs: {
      description: {
        story: "Form pre-populated with existing task data for editing.",
      },
    },
  },
}

export const ContractTaskForm: Story = {
  args: {
    isOpen: true,
    task: {
      ...mockResponsibilityTasks.find((t) => t.type === "prime-contract"),
      type: "prime-contract" as const,
    },
    roles: mockRoles,
    categories: mockCategories,
    onSave: (task) => console.log("Contract task saved:", task),
    onCancel: () => console.log("Form cancelled"),
  },
  parameters: {
    docs: {
      description: {
        story: "Form for contract tasks showing required page and article reference fields.",
      },
    },
  },
}

export const TaskWithAnnotations: Story = {
  args: {
    isOpen: true,
    task: {
      ...mockResponsibilityTasks[0],
      annotations: [
        {
          id: "ann-1",
          user: "John Smith",
          timestamp: "2024-01-15T10:00:00Z",
          comment: "This task requires coordination with the design team.",
        },
        {
          id: "ann-2",
          user: "Sarah Johnson",
          timestamp: "2024-01-16T14:30:00Z",
          comment: "Updated timeline based on material delivery schedule.",
        },
      ],
    },
    roles: mockRoles,
    categories: mockCategories,
    onSave: (task) => console.log("Task with annotations saved:", task),
    onCancel: () => console.log("Form cancelled"),
  },
  parameters: {
    docs: {
      description: {
        story: "Form showing task with existing annotations and comment history.",
      },
    },
  },
}

export const FormClosed: Story = {
  args: {
    isOpen: false,
    roles: mockRoles,
    categories: mockCategories,
    onSave: (task) => console.log("Task saved:", task),
    onCancel: () => console.log("Form cancelled"),
  },
  parameters: {
    docs: {
      description: {
        story: "Form in closed state (not visible).",
      },
    },
  },
}
