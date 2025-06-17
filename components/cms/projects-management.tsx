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
import { Plus, Edit, Trash2, ExternalLink, Github } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Project {
  id: number
  title: string
  description: string
  tech_stack: string[]
  live_link?: string
  github_link?: string
  image_url?: string
  is_featured: boolean
  order_index: number
  is_active: boolean
}

export function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tech_stack: "",
    live_link: "",
    github_link: "",
    image_url: "",
    is_featured: false,
    order_index: 0,
    is_active: true,
  })
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/cms/projects", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const techStackArray = formData.tech_stack
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech)

      const projectData = {
        ...formData,
        tech_stack: techStackArray,
      }

      const url = editingProject ? `/api/cms/projects/${editingProject.id}` : "/api/cms/projects"
      const method = editingProject ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        await fetchProjects()
        setIsDialogOpen(false)
        resetForm()
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save project")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack.join(", "),
      live_link: project.live_link || "",
      github_link: project.github_link || "",
      image_url: project.image_url || "",
      is_featured: project.is_featured,
      order_index: project.order_index,
      is_active: project.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/cms/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        await fetchProjects()
      }
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tech_stack: "",
      live_link: "",
      github_link: "",
      image_url: "",
      is_featured: false,
      order_index: 0,
      is_active: true,
    })
    setEditingProject(null)
    setError("")
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Projects Management</h3>
          <p className="text-sm text-muted-foreground">Manage your portfolio projects and case studies</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
              <DialogDescription>
                {editingProject ? "Update the project details below." : "Fill in the details for the new project."}
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
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
                  <Input
                    id="tech_stack"
                    value={formData.tech_stack}
                    onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                    placeholder="React, Next.js, TypeScript"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="live_link">Live Link</Label>
                    <Input
                      id="live_link"
                      value={formData.live_link}
                      onChange={(e) => setFormData({ ...formData, live_link: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github_link">GitHub Link</Label>
                    <Input
                      id="github_link"
                      value={formData.github_link}
                      onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image_url && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                      <img
                        src={formData.image_url || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full max-w-sm h-32 object-cover rounded-md border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
                      />
                      <Label htmlFor="is_featured">Featured Project</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingProject ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{project.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={project.is_active ? "default" : "secondary"}>
                      {project.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {project.is_featured && <Badge variant="outline">Featured</Badge>}
                    <span className="text-xs text-muted-foreground">Order: {project.order_index}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.tech_stack.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                {project.live_link && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.live_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Live Demo
                    </a>
                  </Button>
                )}
                {project.github_link && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                      <Github className="h-3 w-3 mr-1" />
                      Code
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found. Add your first project to get started.</p>
        </div>
      )}
    </div>
  )
}
