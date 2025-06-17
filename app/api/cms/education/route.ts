import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Check if database is available
    if (!sql) {
      return NextResponse.json(
        {
          error: "Database not configured",
          fallback: [],
        },
        { status: 503 },
      )
    }

    // Check if education table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'education'
      );
    `

    if (!tableExists[0]?.exists) {
      return NextResponse.json(
        {
          error: "Education table does not exist. Please run database setup scripts.",
          fallback: [],
        },
        { status: 503 },
      )
    }

    const education = await sql`
      SELECT * FROM education 
      ORDER BY order_index ASC, id ASC
    `

    return NextResponse.json(education)
  } catch (error) {
    console.error("Error fetching education:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch education data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if database is available
    if (!sql) {
      return NextResponse.json(
        {
          error: "Database not configured",
        },
        { status: 503 },
      )
    }

    const data = await request.json()

    // Validate required fields
    if (!data.degree || !data.institution || !data.years || !data.icon) {
      return NextResponse.json(
        { error: "Missing required fields: degree, institution, years, and icon are required" },
        { status: 400 },
      )
    }

    const newEducation = await sql`
      INSERT INTO education (degree, institution, years, description, icon, order_index, is_active)
      VALUES (
        ${data.degree}, 
        ${data.institution}, 
        ${data.years}, 
        ${data.description || ""}, 
        ${data.icon}, 
        ${data.order_index || 0}, 
        ${data.is_active !== false}
      )
      RETURNING *
    `

    return NextResponse.json(newEducation[0], { status: 201 })
  } catch (error) {
    console.error("Error creating education:", error)
    return NextResponse.json(
      {
        error: "Failed to create education entry",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
