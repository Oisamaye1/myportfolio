import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getAllProjects, createProject } from "@/lib/cms-db"

export async function GET() {
  try {
    const projects = await getAllProjects()
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      tech_stack,
      live_link,
      github_link,
      image_url,
      is_featured = false,
      order_index = 0,
      is_active = true,
    } = body

    if (!title || !description || !tech_stack) {
      return NextResponse.json({ error: "Title, description, and tech stack are required" }, { status: 400 })
    }

    const newProject = await createProject({
      title,
      description,
      tech_stack,
      live_link,
      github_link,
      image_url,
      is_featured,
      order_index,
      is_active,
    })

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
