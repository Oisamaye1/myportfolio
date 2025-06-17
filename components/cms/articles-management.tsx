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
import { Plus, Edit, Trash2, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Article {
  id: number
  title: string
  slug: string
  description: string
  content: string
  category: string
  read_time?: string
  is_published: boolean
  is_featured: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export function ArticlesManagement() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    category: "",
    read_time: "",
    featured_image: "",
    is_published: false,
    is_featured: false,
    order_index: 0,
  })
  const [error, setError] = useState("")

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/cms/articles", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const url = editingArticle ? `/api/cms/articles/${editingArticle.id}` : "/api/cms/articles"
      const method = editingArticle ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchArticles()
        setIsDialogOpen(false)
        resetForm()
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save article")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      slug: article.slug,
      description: article.description,
      content: article.content,
      category: article.category,
      read_time: article.read_time || "",
      featured_image: "",
      is_published: article.is_published,
      is_featured: article.is_featured,
      order_index: article.order_index,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const response = await fetch(`/api/cms/articles/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        await fetchArticles()
      }
    } catch (error) {
      console.error("Failed to delete article:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      content: "",
      category: "",
      read_time: "",
      featured_image: "",
      is_published: false,
      is_featured: false,
      order_index: 0,
    })
    setEditingArticle(null)
    setError("")
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: editingArticle ? formData.slug : generateSlug(title),
    })
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading articles...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Articles Management</h3>
          <p className="text-sm text-muted-foreground">Manage your blog posts and articles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArticle ? "Edit Article" : "Add New Article"}</DialogTitle>
              <DialogDescription>
                {editingArticle ? "Update the article details below." : "Fill in the details for the new article."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content (HTML)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featured_image">Featured Image URL (optional)</Label>
                  <Input
                    id="featured_image"
                    value={formData.featured_image || ""}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    placeholder="https://example.com/featured-image.jpg"
                  />
                  {formData.featured_image && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Featured Image Preview:</p>
                      <img
                        src={formData.featured_image || "/placeholder.svg"}
                        alt="Featured Image Preview"
                        className="w-full max-w-md h-48 object-cover rounded-md border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="read_time">Read Time</Label>
                    <Input
                      id="read_time"
                      value={formData.read_time}
                      onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                      placeholder="5 min read"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order_index">Order</Label>
                    <Input
                      id="order_index"
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_published"
                        checked={formData.is_published}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked as boolean })}
                      />
                      <Label htmlFor="is_published">Published</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
                      />
                      <Label htmlFor="is_featured">Featured</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingArticle ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <Badge className="text-xs">{article.category}</Badge>
                  </div>
                  <CardTitle className="text-base line-clamp-2">{article.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={article.is_published ? "default" : "secondary"} className="text-xs">
                      {article.is_published ? "Published" : "Draft"}
                    </Badge>
                    {article.is_featured && (
                      <Badge variant="outline" className="text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(article)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(article.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{article.description}</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Order: {article.order_index}</span>
                {article.read_time && <span>{article.read_time}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found. Add your first article to get started.</p>
        </div>
      )}
    </div>
  )
}
