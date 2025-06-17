import { NextResponse } from "next/server"
import { testDatabaseConnection, getDatabaseInfo } from "@/lib/db"

export async function GET() {
  try {
    const dbInfo = getDatabaseInfo()
    const isConnected = dbInfo.canConnect ? await testDatabaseConnection() : false

    return NextResponse.json({
      connected: isConnected,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasUrl: dbInfo.hasUrl,
      isPlaceholder: dbInfo.isPlaceholder,
      isValid: dbInfo.isValid,
      canConnect: dbInfo.canConnect,
    })
  } catch (error) {
    const dbInfo = getDatabaseInfo()

    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasUrl: dbInfo.hasUrl,
      isPlaceholder: dbInfo.isPlaceholder,
      isValid: dbInfo.isValid,
      canConnect: dbInfo.canConnect,
    })
  }
}
