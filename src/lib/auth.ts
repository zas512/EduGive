import NextAuth from "next-auth"
import { customAuthProvider } from "./auth-provider"

export const { handlers, auth, signIn, signOut } = NextAuth(customAuthProvider) 