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

    const education = await sql`
      SELECT * FROM education 
      WHERE id = ${id}
    `

    if (education.length === 0) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 })
    }

    return NextResponse.json(education[0])
  } catch (error) {
    console.error("Error fetching education by ID:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch education data",
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

    const updatedEducation = await sql`
      UPDATE education 
      SET degree = COALESCE(${data.degree}, degree),
          institution = COALESCE(${data.institution}, institution),
          years = COALESCE(${data.years}, years),
          description = COALESCE(${data.description}, description),
          icon = COALESCE(${data.icon}, icon),
          order_index = COALESCE(${data.order_index}, order_index),
          is_active = COALESCE(${data.is_active}, is_active)
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedEducation.length === 0) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 })
    }

    return NextResponse.json(updatedEducation[0])
  } catch (error) {
    console.error("Error updating education:", error)
    return NextResponse.json(
      {
        error: "Failed to update education entry",
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

    const result = await sql`DELETE FROM education WHERE id = ${id}`

    if (result.count === 0) {
      return NextResponse.json({ error: "Education not found or could not be deleted" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting education:", error)
    return NextResponse.json(
      {
        error: "Failed to delete education entry",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
