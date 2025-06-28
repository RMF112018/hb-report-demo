"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types"
import { mockUsers } from "@/data/mock-users"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ redirectTo: string }>
  register: (userData: Omit<User, "id" | "createdAt" | "lastLogin" | "isActive">) => Promise<User>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
AuthContext.displayName = "AuthContext" // Optional: for React DevTools

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem("auth-token")
    const userData = localStorage.getItem("user-data")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error)
        localStorage.removeItem("auth-token")
        localStorage.removeItem("user-data")
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo account credentials - accept "demo123" as password for any demo account
    const demoEmails = [
      "john.smith@hedrickbrothers.com",
      "sarah.johnson@hedrickbrothers.com",
      "mike.davis@hedrickbrothers.com",
      "john.doe@hedrickbrothers.com",
      "lisa.wilson@hedrickbrothers.com",
    ]

    if (demoEmails.includes(email) && password === "demo123") {
      let demoUser: User | undefined
      // Simplified demo user creation based on email
      const baseUser = {
        company: "Hedrick Brothers",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true,
      }
      if (email === "john.smith@hedrickbrothers.com") {
        demoUser = { ...baseUser, id: "demo-1", firstName: "John", lastName: "Smith", email, role: "c-suite" }
      } else if (email === "sarah.johnson@hedrickbrothers.com") {
        demoUser = {
          ...baseUser,
          id: "demo-2",
          firstName: "Sarah",
          lastName: "Johnson",
          email,
          role: "project-executive",
        }
      } else if (email === "mike.davis@hedrickbrothers.com") {
        demoUser = {
          ...baseUser,
          id: "demo-3",
          firstName: "Mike",
          lastName: "Davis",
          email,
          role: "project-manager",
          permissions: { preConAccess: false },
        }
      } else if (email === "john.doe@hedrickbrothers.com") {
        demoUser = { ...baseUser, id: "demo-4", firstName: "John", lastName: "Doe", email, role: "estimator" }
      } else if (email === "lisa.wilson@hedrickbrothers.com") {
        demoUser = { ...baseUser, id: "demo-5", firstName: "Lisa", lastName: "Wilson", email, role: "admin" }
      }

      // Enhanced redirect logic for Project Executives
      if (demoUser) {
        const token = `mock-jwt-token-${demoUser.id}`
        localStorage.setItem("auth-token", token)
        localStorage.setItem("user-data", JSON.stringify(demoUser))
        setUser(demoUser)
        setIsLoading(false)

        // Enhanced routing for different roles
        let redirectTo = "/dashboard"
        if (demoUser.role === "estimator") {
          redirectTo = "/pre-con/estimating"
        } else if (demoUser.role === "c-suite") {
          redirectTo = "/dashboard"
        } else if (demoUser.role === "project-executive") {
          // Set Dashboard with PX Dashboard tab as default for Project Executives
          redirectTo = "/dashboard"
        }

        return { redirectTo }
      }
    }

    // Check mock users from data file
    let foundUser = mockUsers.find((u) => u.email === email)

    // If not found in mock users, check localStorage for newly created accounts
    if (!foundUser) {
      const newUsersData = localStorage.getItem("new-users")
      if (newUsersData) {
        try {
          const newUsersList = JSON.parse(newUsersData) as User[]
          foundUser = newUsersList.find((u) => u.email === email)
        } catch (error) {
          console.error("Error parsing new users data:", error)
        }
      }
    }

    if (!foundUser) {
      setIsLoading(false)
      throw new Error("Invalid credentials")
    }

    const token = `mock-jwt-token-${foundUser.id}`
    localStorage.setItem("auth-token", token)
    localStorage.setItem("user-data", JSON.stringify(foundUser))
    setUser(foundUser)
    setIsLoading(false)

    // Enhanced routing based on role
    let redirectTo = "/dashboard"
    if (foundUser.role === "estimator") {
      redirectTo = "/pre-con/estimating"
    } else if (foundUser.role === "project-executive") {
      redirectTo = "/dashboard"
    }

    return { redirectTo }
  }

  const register = async (userData: Omit<User, "id" | "createdAt" | "lastLogin" | "isActive">) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    const existingNewUsers = localStorage.getItem("new-users")
    let newUsersList: User[] = []

    if (existingNewUsers) {
      try {
        newUsersList = JSON.parse(existingNewUsers) as User[]
      } catch (error) {
        console.error("Error parsing existing new users:", error)
      }
    }

    const userExists =
      newUsersList.some((u) => u.email === userData.email) || mockUsers.some((u) => u.email === userData.email)

    if (userExists) {
      setIsLoading(false)
      throw new Error("User with this email already exists")
    }

    newUsersList.push(newUser)
    localStorage.setItem("new-users", JSON.stringify(newUsersList))
    setIsLoading(false)
    return newUser
  }

  const logout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-data")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
