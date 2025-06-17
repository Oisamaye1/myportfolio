import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getAllServices, createService } from "@/lib/cms-db"

export async function GET() {
  try {
    const services = await getAllServices()
    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, icon = "Code", order_index = 0, is_active = true } = body

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const newService = await createService({
      title,
      description,
      icon,
      order_index,
      is_active,
    })

    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
