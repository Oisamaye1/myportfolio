import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("Logging out user...")

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })

    // Clear the auth cookie by setting it to expire immediately
    const cookieValue = `auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`

    response.headers.set("Set-Cookie", cookieValue)
    console.log("Auth cookie cleared")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Logout failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
