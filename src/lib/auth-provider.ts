import { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id: string
      email: string
      name: string
      image?: string
      role?: string
      provider?: string
    }
  }
  
  interface User {
    id: string
    email: string
    name: string
    image?: string
    role?: string
    accessToken?: string
    provider?: string
  }
}

export interface User {
  id: string
  email: string
  name: string
  image?: string
  role?: string
  accessToken?: string
  // Add any other user fields from your Express server
}

export const customAuthProvider: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          try {
            // Call your Express server login API
            const response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            })

            if (!response.ok) {
              console.error('Login failed:', response.statusText)
              return null
            }

            const userData = await response.json()
            
            // Return user data in the format Next.js Auth.js expects
            return {
              id: userData.id || userData.userId,
              email: userData.email,
              name: userData.name || userData.username,
              image: userData.avatar || userData.profileImage,
              // Add any other fields from your API response
              role: userData.role,
              accessToken: userData.accessToken, // If your API returns a token
            }
          } catch (error) {
            console.error('Error calling login API:', error)
            return null
          }
        }
        return null
      }
    }
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
        token.role = user.role
        token.accessToken = user.accessToken
        // Add provider information
        if (account) {
          token.provider = account.provider
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
        session.user.role = token.role as string
        session.user.provider = token.provider as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
  },
} 