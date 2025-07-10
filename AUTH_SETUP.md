# Authentication Setup Guide

This project has been configured with Next.js Auth.js for session-based authentication.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install next-auth@beta
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory with:
   ```env
   # Generate a random secret: openssl rand -base64 32
   NEXTAUTH_SECRET=your-secret-key-here
   
   # Your app URL
   NEXTAUTH_URL=http://localhost:3000
   
   # Express Server API (Required for custom login)
   API_BASE_URL=http://localhost:3001
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   
   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Facebook OAuth (Optional)
   FACEBOOK_CLIENT_ID=your-facebook-client-id
   FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

## How It Works

### Authentication Flow
1. Users visit `/auth/signin` to log in
2. Users can choose between:
   - Google OAuth (if configured)
   - Facebook OAuth (if configured)
   - Email/Password credentials (calls your Express server)
3. For email/password: Next.js Auth.js calls your Express server's `/auth/login` endpoint
4. Your Express server validates credentials and returns user data
5. User data (including profile image from OAuth) is stored in the session
6. **User Sync:** Session listener automatically calls `/user-sync` to store user data in your database
7. Protected routes are handled by middleware
8. Subsequent API calls use the access token from your Express server

### Key Files
- `src/lib/auth.ts` - Main authentication configuration
- `src/lib/auth-provider.ts` - Custom credentials provider with Express server integration
- `src/lib/api-client.ts` - API client for making authenticated requests to Express server
- `src/app/api/auth/[...nextauth]/route.ts` - API routes for auth
- `src/components/providers/session-provider.tsx` - Session provider wrapper
- `src/components/providers/session-sync-provider.tsx` - Session listener for user data sync
- `src/hooks/use-auth.ts` - Custom hook for auth state
- `src/hooks/use-api.ts` - Custom hook for API calls with authentication
- `src/middleware.ts` - Route protection

### Usage Examples

**In any component:**
```tsx
import { useAuth } from "@/hooks/use-auth"

export default function MyComponent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  
  if (isAuthenticated) {
    return <div>Welcome, {user?.name}!</div>
  }
  
  return <div>Please sign in</div>
}
```

**Server-side session access:**
```tsx
import { auth } from "@/lib/auth"

export default async function ServerComponent() {
  const session = await auth()
  
  if (session?.user) {
    return <div>Hello, {session.user.name}</div>
  }
  
  return <div>Not authenticated</div>
}
```

**Using the API client:**
```tsx
import { useApi } from "@/hooks/use-api"

export default function MyComponent() {
  const { getProfile, updateProfile, loading, error } = useApi()
  
  const handleGetProfile = async () => {
    const profile = await getProfile()
    console.log('Profile:', profile)
  }
  
  return (
    <div>
      <button onClick={handleGetProfile} disabled={loading}>
        Get Profile
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  )
}
```

## Customization

### Setting Up OAuth Providers

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env.local`

#### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Go to Settings → Basic
5. Add OAuth redirect URI: `http://localhost:3000/api/auth/callback/facebook`
6. Copy App ID and App Secret to your `.env.local`

### Express Server Integration

Your Express server should have these endpoints:

#### Login Endpoint (`POST /auth/login`)
```javascript
// Express server example
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body
  
  try {
    // Validate credentials against your database
    const user = await User.findOne({ email })
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Generate access token (optional)
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
    
    // Return user data in the format Next.js Auth.js expects
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      accessToken: accessToken
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})
```

#### User Sync Endpoint (`POST /user-sync`)
```javascript
// This endpoint syncs user data from OAuth providers to your database
app.post('/user-sync', async (req, res) => {
  const { id, email, name, image, role, provider, oauthId, oauthProvider } = req.body
  
  try {
    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email: email },
        { oauthId: oauthId, oauthProvider: oauthProvider }
      ]
    })
    
    if (user) {
      // Update existing user
      user.name = name
      user.image = image
      user.role = role || user.role
      user.lastLogin = new Date()
      await user.save()
    } else {
      // Create new user
      user = new User({
        id: id,
        email: email,
        name: name,
        image: image,
        role: role || 'user',
        provider: provider,
        oauthId: oauthId,
        oauthProvider: oauthProvider,
        createdAt: new Date(),
        lastLogin: new Date()
      })
      await user.save()
    }
    
    res.json({ 
      success: true, 
      user: user,
      message: user.isNew ? 'User created' : 'User updated'
    })
  } catch (error) {
    console.error('User sync error:', error)
    res.status(500).json({ error: 'Failed to sync user data' })
  }
})
```

#### Protected Endpoints
```javascript
// Middleware to verify access token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = user
    next()
  })
}

// Protected route example
app.get('/user/profile', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId)
  res.json(user)
})
```

### Adding More User Fields
Update the User interface in `src/lib/auth-provider.ts`:

```tsx
export interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  // Add more fields as needed
}
```

## Security Notes

- Always use HTTPS in production
- Store sensitive data in environment variables
- Implement proper password hashing
- Add rate limiting for auth endpoints
- Consider adding 2FA for additional security 