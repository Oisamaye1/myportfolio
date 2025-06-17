import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getArticles, createArticle } from "@/lib/cms-db"

export async function GET() {
  try {
    const articles = await getArticles()
    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
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
      slug,
      description,
      content,
      category,
      read_time,
      is_published = false,
      is_featured = false,
      order_index = 0,
    } = body

    if (!title || !slug || !description || !content || !category) {
      return NextResponse.json(
        { error: "Title, slug, description, content, and category are required" },
        { status: 400 },
      )
    }

    const newArticle = await createArticle({
      title,
      slug,
      description,
      content,
      category,
      read_time,
      is_published,
      is_featured,
      order_index,
    })

    return NextResponse.json(newArticle, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
