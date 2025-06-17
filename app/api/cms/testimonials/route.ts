import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getAllTestimonials, createTestimonial } from "@/lib/cms-db"

export async function GET() {
  try {
    const testimonials = await getAllTestimonials()
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, title, company, quote, rating = 5, avatar_url, order_index = 0, is_active = true } = body

    if (!name || !title || !quote) {
      return NextResponse.json({ error: "Name, title, and quote are required" }, { status: 400 })
    }

    const newTestimonial = await createTestimonial({
      name,
      title,
      company,
      quote,
      rating,
      avatar_url,
      order_index,
      is_active,
    })

    return NextResponse.json(newTestimonial, { status: 201 })
  } catch (error) {
    console.error("Error creating testimonial:", error)
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
  }
}
