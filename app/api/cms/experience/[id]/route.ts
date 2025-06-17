import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const experience = await sql`
      SELECT * FROM experience 
      WHERE id = ${id}
    `

    if (experience.length === 0) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }

    return NextResponse.json(experience[0])
  } catch (error) {
    console.error("Error fetching experience by ID:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch experience data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const data = await request.json()

    const updatedExperience = await sql`
      UPDATE experience 
      SET company = COALESCE(${data.company}, company),
          position = COALESCE(${data.position}, position),
          location = COALESCE(${data.location}, location),
          start_date = COALESCE(${data.start_date}, start_date),
          end_date = COALESCE(${data.end_date}, end_date),
          is_current = COALESCE(${data.is_current}, is_current),
          description = COALESCE(${data.description}, description),
          responsibilities = COALESCE(${data.responsibilities}, responsibilities),
          technologies = COALESCE(${data.technologies}, technologies),
          achievements = COALESCE(${data.achievements}, achievements),
          company_logo = COALESCE(${data.company_logo}, company_logo),
          company_website = COALESCE(${data.company_website}, company_website),
          order_index = COALESCE(${data.order_index}, order_index),
          is_active = COALESCE(${data.is_active}, is_active)
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedExperience.length === 0) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }

    return NextResponse.json(updatedExperience[0])
  } catch (error) {
    console.error("Error updating experience:", error)
    return NextResponse.json(
      {
        error: "Failed to update experience entry",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const result = await sql`DELETE FROM experience WHERE id = ${id}`

    if (result.count === 0) {
      return NextResponse.json({ error: "Experience not found or could not be deleted" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting experience:", error)
    return NextResponse.json(
      {
        error: "Failed to delete experience entry",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
