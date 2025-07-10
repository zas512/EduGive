"use client"

import { useSession } from "next-auth/react"
import { apiClient } from "@/lib/api-client"
import { useState } from "react"

export function useApi() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeRequest = async <T>(
    requestFn: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true)
    setError(null)

    try {
      const result = await requestFn()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    session,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
    loading,
    error,
    clearError: () => setError(null),
    
    // API methods
    login: (email: string, password: string) => 
      executeRequest(() => apiClient.login(email, password)),
    
    register: (userData: Record<string, unknown>) => 
      executeRequest(() => apiClient.register(userData)),
    
    logout: () => 
      executeRequest(() => apiClient.logout()),
    
    getProfile: () => 
      executeRequest(() => apiClient.getProfile()),
    
    updateProfile: (userData: Record<string, unknown>) => 
      executeRequest(() => apiClient.updateProfile(userData)),
    
    getUsers: () => 
      executeRequest(() => apiClient.getUsers()),
    
    getUserById: (id: string) => 
      executeRequest(() => apiClient.getUserById(id)),
    
    syncUser: (userData: Record<string, unknown>) => 
      executeRequest(() => apiClient.syncUser(userData)),
  }
} 