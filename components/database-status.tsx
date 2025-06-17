"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Database, ChevronDown, ChevronUp, CheckCircle, XCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface DatabaseStatusData {
  connected: boolean
  timestamp: string
  environment: string
  hasUrl: boolean
  isPlaceholder?: boolean
  isValid?: boolean
  canConnect?: boolean
  error?: string
}

export function DatabaseStatus({ isDatabaseConnected }: { isDatabaseConnected?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [statusData, setStatusData] = useState<DatabaseStatusData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/database-status")
      const data = await response.json()
      setStatusData(data)
    } catch (error) {
      console.error("Failed to check database status:", error)
      setStatusData({
        connected: false,
        timestamp: new Date().toISOString(),
        environment: "unknown",
        hasUrl: false,
        error: "Failed to check status",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Only show in development or when database is not connected
  if (!isClient) return null

  const connected = statusData?.connected ?? isDatabaseConnected ?? false
  const shouldShow = process.env.NODE_ENV !== "production" || !connected

  if (!shouldShow) {
    return null
  }

  const getStatusIcon = () => {
    if (isLoading) return <Database className="h-4 w-4 animate-pulse text-blue-500" />
    if (connected) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (statusData?.isPlaceholder) return <Info className="h-4 w-4 text-amber-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusMessage = () => {
    if (isLoading) return "Checking database connection..."
    if (connected) return "Database is connected and working properly."

    if (statusData?.isPlaceholder) {
      return (
        <>
          Database URL is not configured. Using fallback data.
          <div className="mt-2 text-xs">
            <strong>Setup Required:</strong> Replace the placeholder DATABASE_URL in your environment variables with
            your actual Neon database connection string.
          </div>
        </>
      )
    }

    if (!statusData?.hasUrl) {
      return (
        <>
          Database URL is missing. Using fallback data.
          <div className="mt-2 text-xs">
            <strong>Setup Required:</strong> Add DATABASE_URL environment variable with your Neon database connection
            string.
          </div>
        </>
      )
    }

    if (!statusData?.isValid) {
      return (
        <>
          Database URL is invalid. Using fallback data.
          <div className="mt-2 text-xs">
            <strong>Format Required:</strong> DATABASE_URL should start with postgresql:// or postgres://
          </div>
        </>
      )
    }

    return (
      <>
        Database connection failed. Using fallback data.
        {statusData?.error && (
          <div className="mt-2 text-xs">
            <strong>Error:</strong> {statusData.error}
          </div>
        )}
      </>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-card shadow-lg border-border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {getStatusIcon()}
        Database Status
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <Alert className="absolute bottom-12 left-0 w-80 bg-card border-border shadow-lg">
          {getStatusIcon()}
          <AlertTitle>Database Connection</AlertTitle>
          <AlertDescription>
            {getStatusMessage()}
            {statusData && (
              <div className="mt-2 text-xs text-muted-foreground">
                Environment: {statusData.environment} | Last checked:{" "}
                {new Date(statusData.timestamp).toLocaleTimeString()}
              </div>
            )}
          </AlertDescription>
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="outline" onClick={checkDatabaseStatus}>
              Refresh Status
            </Button>
            {statusData?.isPlaceholder && (
              <Button size="sm" variant="default" onClick={() => window.open("https://neon.tech", "_blank")}>
                Get Neon DB
              </Button>
            )}
          </div>
        </Alert>
      )}
    </div>
  )
}
