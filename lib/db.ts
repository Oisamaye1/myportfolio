import { neon } from "@neondatabase/serverless"

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL

// Validate database URL format
function isValidDatabaseUrl(url: string | undefined): boolean {
  if (!url || url === "your_neon_database_url_here") {
    return false
  }

  try {
    new URL(url)
    return url.startsWith("postgresql://") || url.startsWith("postgres://")
  } catch {
    return false
  }
}

// Create the SQL client only if DATABASE_URL is valid
export const sql = isValidDatabaseUrl(databaseUrl) ? neon(databaseUrl!) : null

// Database connection test
export async function testDatabaseConnection(): Promise<boolean> {
  if (!sql) {
    console.warn("Database client not initialized - DATABASE_URL missing or invalid")
    return false
  }

  try {
    await sql`SELECT 1 as test`
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

// Helper function to check if database is available
export async function isDatabaseAvailable(): Promise<boolean> {
  if (!sql) {
    return false
  }

  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.warn("Database not available:", error)
    return false
  }
}

// Helper to get database status info
export function getDatabaseInfo() {
  const hasUrl = !!databaseUrl
  const isPlaceholder = databaseUrl === "your_neon_database_url_here"
  const isValid = isValidDatabaseUrl(databaseUrl)

  return {
    hasUrl,
    isPlaceholder,
    isValid,
    canConnect: !!sql,
  }
}
