import { auth } from "@/lib/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  // Protect routes that require authentication
  if (nextUrl.pathname.startsWith("/dashboard") && !isLoggedIn) {
    return Response.redirect(new URL("/auth/signin", nextUrl))
  }

  // Redirect authenticated users away from auth pages
  if (nextUrl.pathname.startsWith("/auth") && isLoggedIn) {
    return Response.redirect(new URL("/", nextUrl))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
} 