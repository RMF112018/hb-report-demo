'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type ProjectContextType = {
  projectId: string
  setProjectId: (id: string) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projectId, setProjectIdState] = useState<string>('all')

  useEffect(() => {
    const saved = localStorage.getItem('selectedProject')
    if (saved) setProjectIdState(saved)
  }, [])

  const setProjectId = (id: string) => {
    localStorage.setItem('selectedProject', id)
    setProjectIdState(id)
  }

  return (
    <ProjectContext.Provider value={{ projectId, setProjectId }}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProjectContext = (): ProjectContextType => {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProjectContext must be used within a ProjectProvider')
  return ctx
}
