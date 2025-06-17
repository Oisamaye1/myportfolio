"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// This component will be rendered on the client side
export function EmailStatus({ hasResendApiKey }: { hasResendApiKey: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only render on client and in development
  if (!isClient) return null

  // Only show in development
  const isDevelopment = typeof window !== "undefined" && window.location.hostname === "localhost"

  if (!isDevelopment) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-card shadow-lg border-border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {hasResendApiKey ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-amber-500" />
        )}
        Email Status
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <Alert className="absolute bottom-12 right-0 w-80 bg-card border-border shadow-lg">
          <AlertCircle className={hasResendApiKey ? "h-4 w-4 text-green-500" : "h-4 w-4 text-amber-500"} />
          <AlertTitle>Email Configuration</AlertTitle>
          <AlertDescription>
            {hasResendApiKey ? (
              "Resend API key is configured. Emails will be sent."
            ) : (
              <>
                Resend API key is not configured. Please add your Resend API key to the <code>.env.local</code> file.
              </>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
