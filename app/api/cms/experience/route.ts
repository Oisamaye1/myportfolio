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

    // Check if experience table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'experience'
      );
    `

    if (!tableExists[0]?.exists) {
      return NextResponse.json(
        {
          error: "Experience table does not exist. Please run database setup scripts.",
          fallback: [],
        },
        { status: 503 },
      )
    }

    const experience = await sql`
      SELECT * FROM experience 
      ORDER BY order_index ASC, start_date DESC
    `

    return NextResponse.json(experience)
  } catch (error) {
    console.error("Error fetching experience:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch experience data",
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
    if (!data.company || !data.position || !data.start_date) {
      return NextResponse.json(
        { error: "Missing required fields: company, position, and start_date are required" },
        { status: 400 },
      )
    }

    const newExperience = await sql`
      INSERT INTO experience (
        company, 
        position, 
        location, 
        start_date, 
        end_date, 
        is_current, 
        description, 
        responsibilities, 
        technologies, 
        achievements,
        company_logo,
        company_website,
        order_index, 
        is_active
      )
      VALUES (
        ${data.company}, 
        ${data.position}, 
        ${data.location || ""}, 
        ${data.start_date}, 
        ${data.end_date || null}, 
        ${data.is_current || false}, 
        ${data.description || ""}, 
        ${data.responsibilities || []}, 
        ${data.technologies || []}, 
        ${data.achievements || []},
        ${data.company_logo || ""},
        ${data.company_website || ""},
        ${data.order_index || 0}, 
        ${data.is_active !== false}
      )
      RETURNING *
    `

    return NextResponse.json(newExperience[0], { status: 201 })
  } catch (error) {
    console.error("Error creating experience:", error)
    return NextResponse.json(
      {
        error: "Failed to create experience entry",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
