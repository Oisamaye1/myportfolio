import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getAllTechStack, createTechStack } from "@/lib/cms-db"

export async function GET() {
  try {
    const techStack = await getAllTechStack()
    return NextResponse.json(techStack)
  } catch (error) {
    console.error("Error fetching tech stack:", error)
    return NextResponse.json({ error: "Failed to fetch tech stack" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, icon, category, order_index = 0, is_active = true } = body

    if (!name || !icon) {
      return NextResponse.json({ error: "Name and icon are required" }, { status: 400 })
    }

    const newTechStack = await createTechStack({
      name,
      icon,
      category,
      order_index,
      is_active,
    })

    return NextResponse.json(newTechStack, { status: 201 })
  } catch (error) {
    console.error("Error creating tech stack:", error)
    return NextResponse.json({ error: "Failed to create tech stack" }, { status: 500 })
  }
}
