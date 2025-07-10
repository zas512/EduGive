import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { createLogger } from 'redux-logger'
import CryptoJS from 'crypto-js'

// Import your reducers here
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'

// Encryption transform for redux-persist
const encryptTransform = {
  in: (state: unknown) => {
    if (typeof state === 'string') {
      return CryptoJS.AES.encrypt(state, process.env.NEXT_PUBLIC_REDUX_ENCRYPTION_KEY || 'your-secret-key').toString()
    }
    return CryptoJS.AES.encrypt(JSON.stringify(state), process.env.NEXT_PUBLIC_REDUX_ENCRYPTION_KEY || 'your-secret-key').toString()
  },
  out: (state: string) => {
    try {
      const bytes = CryptoJS.AES.decrypt(state, process.env.NEXT_PUBLIC_REDUX_ENCRYPTION_KEY || 'your-secret-key')
      const decrypted = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(decrypted)
    } catch (error) {
      console.error('Failed to decrypt persisted state:', error)
      return undefined
    }
  }
}

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  // Add more reducers here
})

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptTransform],
  whitelist: ['auth', 'user'], // Only persist these reducers
  blacklist: [], // Don't persist these reducers
}

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Create logger middleware (only in development)
const loggerMiddleware = process.env.NODE_ENV === 'development' 
  ? [createLogger({
      collapsed: true,
      duration: true,
      timestamp: true,
      colors: {
        title: () => '#139BFE',
        prevState: () => '#9C9C9C',
        action: () => '#149945',
        nextState: () => '#A47104',
        error: () => '#FF0000',
      },
    })]
  : []

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(loggerMiddleware),
  devTools: process.env.NODE_ENV === 'development',
})

// Create persistor
export const persistor = persistStore(store)

// Export types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 