"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Service {
  id: string
  title: string
  description: string
  icon: string
  active: boolean
  order: number
}

export function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    active: true,
    order: 0,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch services
  const fetchServices = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cms/services")
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error("Error fetching services:", error)
      toast.error("Failed to load services")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle switch changes
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }))
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "",
      active: true,
      order: 0,
    })
    setEditingService(null)
  }

  // Open dialog for editing
  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      active: service.active,
      order: service.order,
    })
    setIsDialogOpen(true)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let response

      if (editingService) {
        // Update existing service
        response = await fetch(`/api/cms/services/${editingService.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      } else {
        // Create new service
        response = await fetch("/api/cms/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      }

      if (response.ok) {
        toast.success(editingService ? "Service updated successfully" : "Service created successfully")
        fetchServices()
        setIsDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to save service")
      }
    } catch (error) {
      console.error("Error saving service:", error)
      toast.error("An error occurred while saving the service")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle service deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return
    }

    try {
      const response = await fetch(`/api/cms/services/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Service deleted successfully")
        fetchServices()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to delete service")
      }
    } catch (error) {
      console.error("Error deleting service:", error)
      toast.error("An error occurred while deleting the service")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
              <DialogDescription>
                {editingService ? "Update the details of this service." : "Add a new service to your portfolio."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    placeholder="e.g., code, design, server"
                  />
                  <p className="text-xs text-muted-foreground">Enter a Lucide icon name (see lucide.dev for options)</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input id="order" name="order" type="number" value={formData.order} onChange={handleChange} />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="active" checked={formData.active} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className={!service.active ? "opacity-60" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{service.title}</span>
                  {!service.active && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Inactive</span>
                  )}
                </CardTitle>
                <CardDescription>Order: {service.order}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{service.description}</p>
                <div className="mt-4">
                  <span className="text-xs font-medium">Icon:</span>{" "}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{service.icon}</code>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}

          {services.length === 0 && (
            <div className="col-span-full text-center py-12 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">No services found. Add your first service to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
