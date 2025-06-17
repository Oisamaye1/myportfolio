"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Star, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Testimonial {
  id: number
  name: string
  title: string
  company?: string
  quote: string
  rating: number
  avatar_url?: string
  order_index: number
  is_active: boolean
}

export function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    quote: "",
    rating: 5,
    avatar_url: "",
    order_index: 0,
    is_active: true,
  })
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/cms/testimonials", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const url = editingTestimonial ? `/api/cms/testimonials/${editingTestimonial.id}` : "/api/cms/testimonials"
      const method = editingTestimonial ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchTestimonials()
        setIsDialogOpen(false)
        resetForm()
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save testimonial")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      title: testimonial.title,
      company: testimonial.company || "",
      quote: testimonial.quote,
      rating: testimonial.rating,
      avatar_url: testimonial.avatar_url || "",
      order_index: testimonial.order_index,
      is_active: testimonial.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return

    try {
      const response = await fetch(`/api/cms/testimonials/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        await fetchTestimonials()
      }
    } catch (error) {
      console.error("Failed to delete testimonial:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      company: "",
      quote: "",
      rating: 5,
      avatar_url: "",
      order_index: 0,
      is_active: true,
    })
    setEditingTestimonial(null)
    setError("")
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading testimonials...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Testimonials Management</h3>
          <p className="text-sm text-muted-foreground">Manage client testimonials and reviews</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
              <DialogDescription>
                {editingTestimonial
                  ? "Update the testimonial details below."
                  : "Fill in the details for the new testimonial."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company (optional)</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quote">Quote</Label>
                  <Textarea
                    id="quote"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar_url">Avatar Image URL (optional)</Label>
                  <Input
                    id="avatar_url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {formData.avatar_url && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Avatar Preview:</p>
                      <img
                        src={formData.avatar_url || "/placeholder.svg"}
                        alt="Avatar Preview"
                        className="w-16 h-16 rounded-full object-cover border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number.parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order_index">Order</Label>
                    <Input
                      id="order_index"
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingTestimonial ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {testimonial.avatar_url ? (
                      <img
                        src={testimonial.avatar_url || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{testimonial.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.title}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                    <div className="flex items-center gap-1 mt-1">{renderStars(testimonial.rating)}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(testimonial)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(testimonial.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">"{testimonial.quote}"</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                  {testimonial.is_active ? "Active" : "Inactive"}
                </Badge>
                <span>Order: {testimonial.order_index}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No testimonials found. Add your first testimonial to get started.</p>
        </div>
      )}
    </div>
  )
}
