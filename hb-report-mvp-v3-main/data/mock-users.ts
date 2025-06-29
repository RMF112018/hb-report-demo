export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "admin" | "project_manager" | "estimator" | "field_supervisor" | "accountant"
  company: string
  createdAt: string
  isActive: boolean
  phone?: string
  department?: string
}

export const mockUsers: User[] = [
  {
    id: "1",
    firstName: "Michael",
    lastName: "Rodriguez",
    email: "mrodriguez@hb.com",
    role: "project_manager",
    company: "Hedrick Brothers",
    phone: "(561) 555-0101",
    department: "Construction Management",
    createdAt: "2023-01-15T00:00:00.000Z",
    isActive: true,
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Chen",
    email: "schen@hb.com",
    role: "project_manager",
    company: "Hedrick Brothers",
    phone: "(561) 555-0102",
    department: "Construction Management",
    createdAt: "2023-02-01T00:00:00.000Z",
    isActive: true,
  },
  {
    id: "3",
    firstName: "David",
    lastName: "Thompson",
    email: "dthompson@hb.com",
    role: "project_manager",
    company: "Hedrick Brothers",
    phone: "(561) 555-0103",
    department: "Construction Management",
    createdAt: "2023-03-10T00:00:00.000Z",
    isActive: true,
  },
  {
    id: "4",
    firstName: "Lisa",
    lastName: "Martinez",
    email: "lmartinez@hb.com",
    role: "estimator",
    company: "Hedrick Brothers",
    phone: "(561) 555-0104",
    department: "Preconstruction",
    createdAt: "2023-01-20T00:00:00.000Z",
    isActive: true,
  },
  {
    id: "5",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@hb.com",
    role: "estimator",
    company: "Hedrick Brothers",
    phone: "(561) 555-0105",
    department: "Preconstruction",
    createdAt: "2024-01-01T00:00:00.000Z",
    isActive: true,
  },
  {
    id: "6",
    firstName: "Amanda",
    lastName: "Wilson",
    email: "awilson@hb.com",
    role: "field_supervisor",
    company: "Hedrick Brothers",
    phone: "(561) 555-0106",
    department: "Field Operations",
    createdAt: "2023-05-15T00:00:00.000Z",
    isActive: true,
  },
  {
    id: "7",
    firstName: "Robert",
    lastName: "Johnson",
    email: "rjohnson@hb.com",
    role: "accountant",
    company: "Hedrick Brothers",
    phone: "(561) 555-0107",
    department: "Finance",
    createdAt: "2023-04-01T00:00:00.000Z",
    isActive: true,
  },
  {
    id: "8",
    firstName: "Jennifer",
    lastName: "Davis",
    email: "jdavis@hb.com",
    role: "admin",
    company: "Hedrick Brothers",
    phone: "(561) 555-0108",
    department: "Administration",
    createdAt: "2022-12-01T00:00:00.000Z",
    isActive: true,
  },
]
