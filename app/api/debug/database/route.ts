import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const info = {
      hasDatabase: !!sql,
      databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
      isPlaceholder: process.env.DATABASE_URL === "your_neon_database_url_here",
    }

    if (!sql) {
      return NextResponse.json({
        ...info,
        status: "Database not configured",
        tables: [],
      })
    }

    // Test connection
    await sql`SELECT 1`

    // Check tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Check education table specifically
    let educationColumns = []
    try {
      educationColumns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'education' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `
    } catch (e) {
      // Table doesn't exist
    }

    return NextResponse.json({
      ...info,
      status: "Connected",
      tables: tables.map((t) => t.table_name),
      educationTable: {
        exists: educationColumns.length > 0,
        columns: educationColumns,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "Error",
        error: error instanceof Error ? error.message : "Unknown error",
        hasDatabase: !!sql,
        databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
      },
      { status: 500 },
    )
  }
}
