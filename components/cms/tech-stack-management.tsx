"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Edit, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TechStack {
  id: number
  name: string
  icon: string
  category?: string
  order_index: number
  is_active: boolean
}

export function TechStackManagement() {
  const [techStack, setTechStack] = useState<TechStack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTech, setEditingTech] = useState<TechStack | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    category: "",
    order_index: 0,
    is_active: true,
  })
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTechStack()
  }, [])

  const fetchTechStack = async () => {
    try {
      const response = await fetch("/api/cms/tech-stack", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setTechStack(data)
      }
    } catch (error) {
      console.error("Failed to fetch tech stack:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const url = editingTech ? `/api/cms/tech-stack/${editingTech.id}` : "/api/cms/tech-stack"
      const method = editingTech ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchTechStack()
        setIsDialogOpen(false)
        resetForm()
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save tech stack")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handleEdit = (tech: TechStack) => {
    setEditingTech(tech)
    setFormData({
      name: tech.name,
      icon: tech.icon,
      category: tech.category || "",
      order_index: tech.order_index,
      is_active: tech.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tech stack item?")) return

    try {
      const response = await fetch(`/api/cms/tech-stack/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        await fetchTechStack()
      }
    } catch (error) {
      console.error("Failed to delete tech stack:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      icon: "",
      category: "",
      order_index: 0,
      is_active: true,
    })
    setEditingTech(null)
    setError("")
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading tech stack...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Tech Stack Management</h3>
          <p className="text-sm text-muted-foreground">Manage the technologies and tools you work with</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Technology
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingTech ? "Edit Technology" : "Add New Technology"}</DialogTitle>
              <DialogDescription>
                {editingTech ? "Update the technology details below." : "Fill in the details for the new technology."}
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
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (emoji or text)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="⚛️ or React"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Frontend, Backend, Database, etc."
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
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingTech ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {techStack.map((tech) => (
          <Card key={tech.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="text-center flex-1">
                  <div className="text-2xl mb-2">{tech.icon}</div>
                  <CardTitle className="text-sm">{tech.name}</CardTitle>
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <Badge variant={tech.is_active ? "default" : "secondary"} className="text-xs">
                      {tech.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {tech.category && (
                      <Badge variant="outline" className="text-xs">
                        {tech.category}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">Order: {tech.order_index}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(tech)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(tech.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {techStack.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No technologies found. Add your first technology to get started.</p>
        </div>
      )}
    </div>
  )
}
