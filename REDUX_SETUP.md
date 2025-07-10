# Redux Toolkit Setup Guide

This project has been configured with Redux Toolkit, Redux Persist, Redux Logger, and encryption for state persistence.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install @reduxjs/toolkit react-redux redux-persist redux-logger crypto-js
   npm install --save-dev @types/redux-logger @types/crypto-js
   ```

2. **Environment Variables**
   Add to your `.env.local` file:
   ```env
   # Redux Persist Encryption Key (generate a secure key)
   NEXT_PUBLIC_REDUX_ENCRYPTION_KEY=your-secure-encryption-key-here
   ```

3. **Generate Encryption Key**
   ```bash
   # Generate a secure encryption key
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## Features

### 🔐 **Encrypted Persistence**
- All Redux state is encrypted before being stored in localStorage
- Uses AES encryption with a configurable key
- Automatic decryption on app startup

### 📝 **Development Logging**
- Redux Logger only runs in development mode
- Beautiful console output with colors and timing
- Collapsed by default for cleaner logs

### 🛠 **Redux Toolkit**
- Modern Redux with createSlice and configureStore
- Built-in TypeScript support
- DevTools integration

### 💾 **State Persistence**
- Automatic state persistence across browser sessions
- Configurable whitelist/blacklist for specific reducers
- Loading states during rehydration

## Key Files

- `src/lib/redux/store.ts` - Main Redux store configuration
- `src/lib/redux/slices/authSlice.ts` - Authentication state management
- `src/lib/redux/slices/userSlice.ts` - User profile state management
- `src/components/providers/redux-provider.tsx` - Redux provider with persistence
- `src/hooks/use-redux.ts` - Typed Redux hooks
- `src/types/redux-logger.d.ts` - TypeScript declarations
- `src/types/crypto-js.d.ts` - TypeScript declarations

## Usage Examples

### **Using Redux in Components**
```tsx
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { setUser, logout } from '@/lib/redux/slices/authSlice'

export function MyComponent() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  
  const handleLogin = () => {
    dispatch(setUser({ id: '1', email: 'user@example.com', name: 'John' }))
  }
  
  const handleLogout = () => {
    dispatch(logout())
  }
  
  return (
    <div>
      {auth.isAuthenticated ? (
        <p>Welcome, {auth.user?.name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  )
}
```

### **Creating New Slices**
```tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MyState {
  data: string[]
  loading: boolean
  error: string | null
}

const initialState: MyState = {
  data: [],
  loading: false,
  error: null
}

const mySlice = createSlice({
  name: 'my',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<string[]>) => {
      state.data = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    }
  }
})

export const { setData, setLoading, setError } = mySlice.actions
export default mySlice.reducer
```

### **Adding Slices to Store**
```tsx
// In src/lib/redux/store.ts
import myReducer from './slices/mySlice'

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  my: myReducer, // Add your new slice
})
```

## Redux DevTools

### **Browser Extension**
1. Install [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)
2. Open browser DevTools (F12)
3. Go to "Redux" tab
4. See real-time state changes and actions

### **Features Available**
- State inspection
- Action history
- Time-travel debugging
- State diffs
- Action replay

## Persistence Configuration

### **Whitelist/Blacklist**
```tsx
const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptTransform],
  whitelist: ['auth', 'user'], // Only persist these reducers
  blacklist: ['temp'], // Don't persist these reducers
}
```

### **Custom Storage**
```tsx
// Use sessionStorage instead of localStorage
import storage from 'redux-persist/lib/storage/session'

const persistConfig = {
  storage: storage, // sessionStorage
  // ... other config
}
```

## Security Notes

- **Encryption Key**: Always use a strong, unique encryption key
- **Environment Variables**: Store the key in environment variables, not in code
- **Key Rotation**: Consider rotating the encryption key periodically
- **Sensitive Data**: Be careful about what data you persist

## Performance Tips

- **Selective Persistence**: Only persist necessary data
- **Debouncing**: Debounce frequent state updates
- **Memoization**: Use React.memo and useMemo for expensive components
- **Action Optimization**: Batch related actions together

## Troubleshooting

### **State Not Persisting**
- Check if the reducer is in the whitelist
- Verify encryption key is set correctly
- Check browser console for errors

### **Logger Not Working**
- Ensure NODE_ENV is set to 'development'
- Check if Redux DevTools extension is installed
- Verify middleware configuration

### **TypeScript Errors**
- Install type definitions: `@types/redux-logger @types/crypto-js`
- Check import paths and type declarations
- Verify slice type definitions 