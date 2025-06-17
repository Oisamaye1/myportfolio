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
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Education } from "@/lib/cms"
import { useToast } from "@/hooks/use-toast"

export function EducationManagement() {
  const [education, setEducation] = useState<Education[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    years: "",
    description: "",
    icon: "",
    order_index: 0,
    is_active: true,
  })
  const [error, setError] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/cms/education")
      if (response.ok) {
        const data = await response.json()
        setEducation(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to fetch education data")
        toast({
          title: "Error",
          description: "Failed to fetch education data. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch education:", error)
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const url = editingEducation ? `/api/cms/education/${editingEducation.id}` : "/api/cms/education"
      const method = editingEducation ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchEducation()
        setIsDialogOpen(false)
        resetForm()
        toast({
          title: editingEducation ? "Education Updated" : "Education Added",
          description: editingEducation
            ? "Education entry has been updated successfully."
            : "New education entry has been added successfully.",
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save education")
        toast({
          title: "Error",
          description: errorData.error || "Failed to save education. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setError("Network error occurred")
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (edu: Education) => {
    setEditingEducation(edu)
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      years: edu.years,
      description: edu.description || "",
      icon: edu.icon,
      order_index: edu.order_index,
      is_active: edu.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/cms/education/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchEducation()
        toast({
          title: "Education Deleted",
          description: "Education entry has been deleted successfully.",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete education. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to delete education:", error)
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      degree: "",
      institution: "",
      years: "",
      description: "",
      icon: "",
      order_index: 0,
      is_active: true,
    })
    setEditingEducation(null)
    setError("")
  }

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetForm()
    }
    setIsDialogOpen(open)
  }

  const iconOptions = ["GraduationCap", "Laptop", "BookOpen", "Award", "Book", "Certificate", "School"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Education Management</h3>
          <p className="text-sm text-muted-foreground">Manage your educational background</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingEducation ? "Edit Education" : "Add New Education"}</DialogTitle>
              <DialogDescription>
                {editingEducation
                  ? "Update the education details below."
                  : "Fill in the details for the new education entry."}
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
                  <Label htmlFor="degree">Degree/Certification</Label>
                  <Input
                    id="degree"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="years">Years</Label>
                  <Input
                    id="years"
                    value={formData.years}
                    onChange={(e) => setFormData({ ...formData, years: e.target.value })}
                    placeholder="2020 - 2022"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <select
                    id="icon"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    required
                  >
                    <option value="">Select an icon</option>
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order_index">Display Order</Label>
                    <Input
                      id="order_index"
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: !!checked })}
                      />
                      <Label htmlFor="is_active">Active (visible on website)</Label>
                    </div>
                  </div>
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
                      {editingEducation ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingEducation ? "Update" : "Create"}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading education data...</span>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {education.map((edu) => (
              <Card key={edu.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{edu.degree}</CardTitle>
                      <p className="text-sm font-medium">{edu.institution}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{edu.years}</Badge>
                        <Badge variant={edu.is_active ? "default" : "secondary"}>
                          {edu.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(edu)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(edu.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{edu.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs font-medium">Icon:</span>
                    <Badge variant="outline">{edu.icon}</Badge>
                    <span className="text-xs text-muted-foreground">Order: {edu.order_index}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {education.length === 0 && (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-medium mb-2">No Education Entries</h3>
              <p className="text-muted-foreground mb-4">
                Add your first education entry to display your academic background on your website.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
