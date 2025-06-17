// Simple environment configuration without database dependencies
export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV || "development",
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  HAS_RESEND_API_KEY: process.env.HAS_RESEND_API_KEY,
}

// Helper functions for environment checks
export function getNodeEnv(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_NODE_ENV || "development"
  }
  return process.env.NODE_ENV || "development"
}

export function isDevelopment(): boolean {
  return getNodeEnv() === "development"
}

export function isProduction(): boolean {
  return getNodeEnv() === "production"
}

export function hasResendApiKey(): boolean {
  return !!process.env.RESEND_API_KEY || !!process.env.HAS_RESEND_API_KEY
}
