"use client"

import { useSession } from "next-auth/react"
import { useEffect, useRef } from "react"
import { apiClient } from "@/lib/api-client"

interface SessionSyncProviderProps {
  children: React.ReactNode
}

export function SessionSyncProvider({ children }: SessionSyncProviderProps) {
  const { data: session, status } = useSession()
  const lastSyncedUserId = useRef<string | null>(null)
  const isSyncing = useRef(false)

  useEffect(() => {
    const syncUserData = async () => {
      // Only sync if we have a session and user data
      if (!session?.user || status !== "authenticated") {
        return
      }

      const userId = session.user.id
      
      // Prevent duplicate syncs for the same user
      if (lastSyncedUserId.current === userId || isSyncing.current) {
        return
      }

      isSyncing.current = true

      try {
        console.log("Syncing user data to database:", session.user)
        
        // Use the API client to sync user data
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          role: session.user.role,
          provider: session.user.provider || 'credentials',
          // Add additional OAuth data if available
          ...(session.user.provider && {
            oauthId: session.user.id, // OAuth provider's user ID
            oauthProvider: session.user.provider
          })
        }

        const result = await apiClient.syncUser(userData)
        console.log("User data synced successfully:", result)
        lastSyncedUserId.current = userId
        
      } catch (error) {
        console.error("Error syncing user data:", error)
      } finally {
        isSyncing.current = false
      }
    }

    // Sync when session changes
    if (status === "authenticated" && session?.user) {
      syncUserData()
    }
  }, [session, status])

  return <>{children}</>
} 