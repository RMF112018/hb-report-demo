"use client"

import { useState, useEffect } from "react"
import { mockProjects } from "@/data/mock-projects"

export function useProjectFilter() {
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)

  // Listen for project changes from header
  useEffect(() => {
    const handleProjectChange = (event: CustomEvent) => {
      const { projectId } = event.detail
      setSelectedProject(projectId)
    }

    window.addEventListener("projectChanged", handleProjectChange as EventListener)

    // Initialize from localStorage on mount
    const savedProject = localStorage.getItem("selectedProject")
    if (savedProject) {
      setSelectedProject(savedProject)
    }

    return () => {
      window.removeEventListener("projectChanged", handleProjectChange as EventListener)
    }
  }, [])

  // Get current project info
  const currentProject =
    selectedProject === "all" ? null : mockProjects.find((p) => p.id.toString() === selectedProject)

  // Filter projects based on selection
  const getFilteredProjects = () => {
    if (selectedProject === "all") {
      return mockProjects
    }
    return mockProjects.filter((p) => p.id.toString() === selectedProject)
  }

  // Filter any data array by project
  const filterDataByProject = <T extends { projectId?: number | string }>(data: T[]): T[] => {
    if (selectedProject === "all") {
      return data
    }

    const projectId = Number.parseInt(selectedProject)
    return data.filter((item) => {
      if (typeof item.projectId === "string") {
        return Number.parseInt(item.projectId) === projectId
      }
      return item.projectId === projectId
    })
  }

  // Get project context for display
  const getProjectContext = () => {
    if (selectedProject === "all") {
      return {
        title: "All Projects",
        description: "Showing data across all projects",
        isFiltered: false,
      }
    }

    return {
      title: currentProject?.name || `Project ${selectedProject}`,
      description: `Filtered to show data for ${currentProject?.name || selectedProject} only`,
      isFiltered: true,
      project: currentProject,
    }
  }

  return {
    selectedProject,
    currentProject,
    isLoading,
    setIsLoading,
    getFilteredProjects,
    filterDataByProject,
    getProjectContext,
  }
}
