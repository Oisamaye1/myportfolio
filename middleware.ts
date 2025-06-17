import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  try {
    // Get the pathname of the request
    const pathname = request.nextUrl.pathname

    // Only run this middleware for CMS routes (except login)
    if (pathname.startsWith("/cms") && !pathname.includes("/login")) {
      const authToken = request.cookies.get("auth-token")?.value

      // If no token, redirect to login
      if (!authToken) {
        console.log("No auth token found, redirecting to login")
        return NextResponse.redirect(new URL("/cms/login", request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: "/cms/:path*",
}
