"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/types"
import { mockUsers } from "@/lib/mock-data"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock authentication check
    const checkAuth = () => {
      // In a real app, this would check for a valid token
      const mockUser = mockUsers[0] // Administrator user
      setUser(mockUser)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // Mock login
    setTimeout(() => {
      const mockUser = mockUsers.find((u) => u.email === email) || mockUsers[0]
      setUser(mockUser)
      setIsLoading(false)
    }, 1000)
  }

  const logout = () => {
    setUser(null)
    // In a real app, clear tokens and redirect
  }

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  }
}
