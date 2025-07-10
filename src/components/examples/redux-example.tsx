"use client"

import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { setUser, logout, updateUser } from '@/lib/redux/slices/authSlice'
import { setProfile, updateProfile } from '@/lib/redux/slices/userSlice'
import { useState } from 'react'

export function ReduxExample() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  const user = useAppSelector((state) => state.user)
  
  const [newName, setNewName] = useState('')

  const handleLogin = () => {
    const mockUser = {
      id: '1',
      email: 'user@example.com',
      name: 'John Doe',
      image: 'https://via.placeholder.com/150',
      role: 'user',
      provider: 'credentials'
    }
    
    dispatch(setUser(mockUser))
    dispatch(setProfile({
      ...mockUser,
      bio: 'Software Developer',
      phone: '+1234567890',
      address: '123 Main St',
      preferences: { theme: 'dark', notifications: true }
    }))
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleUpdateName = () => {
    if (newName.trim()) {
      dispatch(updateUser({ name: newName }))
      dispatch(updateProfile({ name: newName }))
      setNewName('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-4">Redux State Example</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Auth State */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-medium mb-2">Auth State</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Authenticated:</strong> {auth.isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>Loading:</strong> {auth.isLoading ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {auth.user?.name || 'None'}</p>
              <p><strong>Email:</strong> {auth.user?.email || 'None'}</p>
              <p><strong>Role:</strong> {auth.user?.role || 'None'}</p>
              {auth.error && <p className="text-red-600"><strong>Error:</strong> {auth.error}</p>}
            </div>
          </div>

          {/* User State */}
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <h4 className="font-medium mb-2">User Profile State</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Profile:</strong> {user.profile?.name || 'None'}</p>
              <p><strong>Bio:</strong> {user.profile?.bio || 'None'}</p>
              <p><strong>Phone:</strong> {user.profile?.phone || 'None'}</p>
              <p><strong>Last Updated:</strong> {user.lastUpdated ? new Date(user.lastUpdated).toLocaleString() : 'Never'}</p>
              {user.error && <p className="text-red-600"><strong>Error:</strong> {user.error}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={handleLogin}
              disabled={auth.isAuthenticated}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Login
            </button>
            <button
              onClick={handleLogout}
              disabled={!auth.isAuthenticated}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Logout
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-3 py-2 border rounded flex-1"
            />
            <button
              onClick={handleUpdateName}
              disabled={!auth.isAuthenticated || !newName.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Update Name
            </button>
          </div>
        </div>

        {/* Redux DevTools Info */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800 text-sm">
            💡 Open Redux DevTools (F12 → Redux tab) to see state changes and actions in real-time!
          </p>
        </div>
      </div>
    </div>
  )
} 