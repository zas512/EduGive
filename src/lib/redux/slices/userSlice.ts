import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserProfile {
  id: string
  email: string
  name: string
  image?: string
  role?: string
  bio?: string
  phone?: string
  address?: string
  preferences?: Record<string, unknown>
  lastSync?: string
}

interface UserState {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload
      state.lastUpdated = new Date().toISOString()
      state.error = null
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
        state.lastUpdated = new Date().toISOString()
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearError: (state) => {
      state.error = null
    },
    clearProfile: (state) => {
      state.profile = null
      state.lastUpdated = null
      state.error = null
    },
    setLastSync: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.lastSync = action.payload
      }
    },
  },
})

export const {
  setProfile,
  updateProfile,
  setLoading,
  setError,
  clearError,
  clearProfile,
  setLastSync,
} = userSlice.actions

export default userSlice.reducer 