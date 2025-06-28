'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@/types'

export type DemoRole = 'executive' | 'project-executive' | 'project-manager' | 'estimator' | 'admin'
export type DemoUser = User

interface AuthContextType {
  user: DemoUser | null
  login: (email: string, password: string) => Promise<{ redirectTo: string }>
  logout: () => void
}

const demoUsers: DemoUser[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@hedrickbrothers.com',
    role: 'executive',
    company: 'Hedrick Brothers',
    createdAt: new Date().toISOString(),
    isActive: true,
    avatar: '/avatars/john-smith.png',
    permissions: { preConAccess: true },
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@hedrickbrothers.com',
    role: 'project-executive',
    company: 'Hedrick Brothers',
    createdAt: new Date().toISOString(),
    isActive: true,
    avatar: '/avatars/sarah-johnson.png',
    permissions: { preConAccess: true },
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Davis',
    email: 'mike.davis@hedrickbrothers.com',
    role: 'project-manager',
    company: 'Hedrick Brothers',
    createdAt: new Date().toISOString(),
    isActive: true,
    avatar: '/avatars/mike-davis.png',
    permissions: { preConAccess: false },
  },
  {
    id: '4',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@hedrickbrothers.com',
    role: 'estimator',
    company: 'Hedrick Brothers',
    createdAt: new Date().toISOString(),
    isActive: true,
    avatar: '/avatars/john-doe.png',
    permissions: { preConAccess: true },
  },
  {
    id: '5',
    firstName: 'Lisa',
    lastName: 'Wilson',
    email: 'lisa.wilson@hedrickbrothers.com',
    role: 'admin',
    company: 'Hedrick Brothers',
    createdAt: new Date().toISOString(),
    isActive: true,
    avatar: '/avatars/lisa-wilson.png',
    permissions: { preConAccess: true },
  },
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DemoUser | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('hb-demo-user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ redirectTo: string }> => {
    const match = demoUsers.find((u) => u.email === email)
    if (!match || password !== 'demo123') {
      throw new Error('Invalid credentials')
    }

    const redirectTo = '/dashboard'
      /* match.role === 'estimator'
        ? '/pre-con'
        : match.role === 'project-executive'
        ? '/dashboard'
        : match.role === 'project-manager'
        ? '/dashboard'
        : `/dashboard/${match.role}` */

    localStorage.setItem('hb-demo-user', JSON.stringify(match))
    setUser(match)

    return { redirectTo }
  }

  const logout = () => {
    localStorage.removeItem('hb-demo-user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}