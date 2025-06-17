import { NextResponse } from "next/server"

export async function GET() {
  // Check if Resend API key is configured (server-side only)
  const hasResendApiKey = !!process.env.RESEND_API_KEY || !!process.env.HAS_RESEND_API_KEY

  return NextResponse.json({ hasResendApiKey })
}
