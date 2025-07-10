"use client"

import { useSession } from "next-auth/react"
import { useApi } from "@/hooks/use-api"
import { useState } from "react"

export function SyncStatus() {
  const { data: session } = useSession()
  const { syncUser, loading, error } = useApi()
  const [lastSync, setLastSync] = useState<string | null>(null)

  const handleManualSync = async () => {
    if (!session?.user) return

    const userData = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      role: session.user.role,
      provider: session.user.provider || 'credentials',
      ...(session.user.provider && {
        oauthId: session.user.id,
        oauthProvider: session.user.provider
      })
    }

    const result = await syncUser(userData)
    if (result) {
      setLastSync(new Date().toLocaleString())
      console.log("Manual sync completed:", result)
    }
  }

  if (!session?.user) {
    return (
      <div className="p-4 bg-gray-50 border rounded">
        <p className="text-gray-600">No user session available</p>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded space-y-4">
      <h3 className="font-semibold">User Sync Status</h3>
      
      <div className="space-y-2">
        <p><strong>User ID:</strong> {session.user.id}</p>
        <p><strong>Email:</strong> {session.user.email}</p>
        <p><strong>Name:</strong> {session.user.name}</p>
        <p><strong>Provider:</strong> {session.user.provider || 'credentials'}</p>
        {session.user.role && <p><strong>Role:</strong> {session.user.role}</p>}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleManualSync}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Syncing...' : 'Sync to Database'}
        </button>
        
        {lastSync && (
          <span className="text-sm text-gray-600">
            Last sync: {lastSync}
          </span>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 text-sm">Error: {error}</p>
        </div>
      )}

      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-blue-800 text-sm">
          💡 User data is automatically synced when you sign in. 
          You can also manually sync using the button above.
        </p>
      </div>
    </div>
  )
} 