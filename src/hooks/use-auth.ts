"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/auth/signin")
  }

  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
    logout,
  }
} 