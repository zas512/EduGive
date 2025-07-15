"use client"

import { useApi } from "@/hooks/use-api"
import { useState } from "react"

export function ApiExample() {
  const { 
    session, 
    isAuthenticated, 
    loading, 
    error, 
    clearError,
    getProfile, 
    updateProfile,
    getUsers 
  } = useApi()
  
  const [profileData, setProfileData] = useState<Record<string, unknown> | null>(null)
  const [users, setUsers] = useState<Record<string, unknown>[]>([])
  const [updateForm, setUpdateForm] = useState({
    name: '',
    email: ''
  })

  const handleGetProfile = async () => {
    const profile = await getProfile()
    if (profile) {
      setProfileData(profile as Record<string, unknown>)
    }
  }

  const handleUpdateProfile = async () => {
    const result = await updateProfile(updateForm)
    if (result) {
      setProfileData(result as Record<string, unknown>)
      setUpdateForm({ name: '', email: '' })
    }
  }

  const handleGetUsers = async () => {
    const usersData = await getUsers()
    if (usersData) {
      setUsers(usersData as Record<string, unknown>[])
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p>Please sign in to access the API examples.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold mb-2">Current Session</h3>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={clearError}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Clear Error
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-4">Profile Management</h3>
          
          <button
            onClick={handleGetProfile}
            disabled={loading}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Get Profile'}
          </button>

          {profileData && (
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">Profile Data:</h4>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(profileData, null, 2)}
              </pre>
            </div>
          )}

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Name"
              value={updateForm.name}
              onChange={(e) => setUpdateForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={updateForm.email}
              onChange={(e) => setUpdateForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </div>

        {/* Users Section */}
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-4">Users Management</h3>
          
          <button
            onClick={handleGetUsers}
            disabled={loading}
            className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Get Users'}
          </button>

          {users.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Users:</h4>
              {users.map((user: Record<string, unknown>, index: number) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                  <p><strong>Name:</strong> {String(user.name || 'N/A')}</p>
                  <p><strong>Email:</strong> {String(user.email || 'N/A')}</p>
                  {typeof user.role === 'string' || typeof user.role === 'number' || typeof user.role === 'boolean' ? (
                    <p><strong>Role:</strong> {String(user.role)}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 