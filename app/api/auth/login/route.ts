import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, signToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log("Login attempt for username:", username)

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 })
    }

    const user = await authenticateUser(username, password)

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    const token = await signToken(user)
    console.log("Login successful for user:", user.username)
    console.log("Generated token length:", token.length)

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        username: user.username,
        role: user.role,
      },
    })

    // Set HTTP-only cookie with proper settings
    const cookieValue = `auth-token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`

    response.headers.set("Set-Cookie", cookieValue)
    console.log("Cookie set with value length:", token.length)

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
