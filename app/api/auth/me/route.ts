import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Try to get token from cookie header
    const cookieHeader = request.headers.get("cookie")
    console.log("Cookie header:", cookieHeader)

    let token: string | undefined

    if (cookieHeader) {
      // Parse the cookie header manually
      const cookies = cookieHeader.split(";").map((cookie) => cookie.trim())
      const authCookie = cookies.find((cookie) => cookie.startsWith("auth-token="))
      if (authCookie) {
        token = authCookie.split("=")[1]
      }
    }

    console.log("Auth check - token present:", !!token)
    console.log("Token length:", token?.length || 0)

    if (!token) {
      return NextResponse.json(
        {
          authenticated: false,
          message: "No token found",
        },
        { status: 401 },
      )
    }

    const user = await verifyToken(token)
    console.log("Token verification result:", !!user)

    if (!user) {
      return NextResponse.json(
        {
          authenticated: false,
          message: "Invalid token",
        },
        { status: 401 },
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json(
      {
        authenticated: false,
        error: "Authentication check failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
