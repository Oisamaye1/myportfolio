import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { updateTechStack, deleteTechStack } from "@/lib/cms-db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const body = await request.json()

    const updatedTechStack = await updateTechStack(id, body)

    if (!updatedTechStack) {
      return NextResponse.json({ error: "Tech stack not found" }, { status: 404 })
    }

    return NextResponse.json(updatedTechStack)
  } catch (error) {
    console.error("Error updating tech stack:", error)
    return NextResponse.json({ error: "Failed to update tech stack" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const success = await deleteTechStack(id)

    if (!success) {
      return NextResponse.json({ error: "Tech stack not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tech stack:", error)
    return NextResponse.json({ error: "Failed to delete tech stack" }, { status: 500 })
  }
}
