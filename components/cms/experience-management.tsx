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
import { Plus, Edit, Trash2, Loader2, Building, MapPin, Calendar, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

interface Experience {
  id: number
  company: string
  position: string
  location?: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
  responsibilities: string[]
  technologies: string[]
  achievements: string[]
  company_logo?: string
  company_website?: string
  order_index: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export function ExperienceManagement() {
  const [experience, setExperience] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
    responsibilities: [] as string[],
    technologies: [] as string[],
    achievements: [] as string[],
    company_logo: "",
    company_website: "",
    order_index: 0,
    is_active: true,
  })
  const [error, setError] = useState("")
  const { toast } = useToast()

  // Form helpers for array fields
  const [responsibilitiesText, setResponsibilitiesText] = useState("")
  const [technologiesText, setTechnologiesText] = useState("")
  const [achievementsText, setAchievementsText] = useState("")

  useEffect(() => {
    fetchExperience()
  }, [])

  const fetchExperience = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/cms/experience")
      if (response.ok) {
        const data = await response.json()
        setExperience(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to fetch experience data")
        toast({
          title: "Error",
          description: "Failed to fetch experience data. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch experience:", error)
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
      // Convert text fields to arrays
      const processedData = {
        ...formData,
        responsibilities: responsibilitiesText
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
        technologies: technologiesText
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
        achievements: achievementsText
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
      }

      const url = editingExperience ? `/api/cms/experience/${editingExperience.id}` : "/api/cms/experience"
      const method = editingExperience ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      })

      if (response.ok) {
        await fetchExperience()
        setIsDialogOpen(false)
        resetForm()
        toast({
          title: editingExperience ? "Experience Updated" : "Experience Added",
          description: editingExperience
            ? "Experience entry has been updated successfully."
            : "New experience entry has been added successfully.",
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save experience")
        toast({
          title: "Error",
          description: errorData.error || "Failed to save experience. Please try again.",
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

  const handleEdit = (exp: Experience) => {
    setEditingExperience(exp)
    setFormData({
      company: exp.company,
      position: exp.position,
      location: exp.location || "",
      start_date: exp.start_date,
      end_date: exp.end_date || "",
      is_current: exp.is_current,
      description: exp.description || "",
      responsibilities: exp.responsibilities,
      technologies: exp.technologies,
      achievements: exp.achievements,
      company_logo: exp.company_logo || "",
      company_website: exp.company_website || "",
      order_index: exp.order_index,
      is_active: exp.is_active,
    })
    setResponsibilitiesText(exp.responsibilities.join("\n"))
    setTechnologiesText(exp.technologies.join(", "))
    setAchievementsText(exp.achievements.join("\n"))
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/cms/experience/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchExperience()
        toast({
          title: "Experience Deleted",
          description: "Experience entry has been deleted successfully.",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete experience. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to delete experience:", error)
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
      company: "",
      position: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      responsibilities: [],
      technologies: [],
      achievements: [],
      company_logo: "",
      company_website: "",
      order_index: 0,
      is_active: true,
    })
    setResponsibilitiesText("")
    setTechnologiesText("")
    setAchievementsText("")
    setEditingExperience(null)
    setError("")
  }

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetForm()
    }
    setIsDialogOpen(open)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Experience Management</h3>
          <p className="text-sm text-muted-foreground">Manage your work experience and career history</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingExperience ? "Edit Experience" : "Add New Experience"}</DialogTitle>
              <DialogDescription>
                {editingExperience
                  ? "Update the experience details below."
                  : "Fill in the details for the new experience entry."}
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
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      placeholder="Jan 2022"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      placeholder="Dec 2023"
                      disabled={formData.is_current}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="is_current"
                        checked={formData.is_current}
                        onCheckedChange={(checked) => {
                          setFormData({
                            ...formData,
                            is_current: !!checked,
                            end_date: checked ? "" : formData.end_date,
                          })
                        }}
                      />
                      <Label htmlFor="is_current">Current Position</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Brief overview of your role and responsibilities..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Key Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    value={responsibilitiesText}
                    onChange={(e) => setResponsibilitiesText(e.target.value)}
                    rows={4}
                    placeholder="Enter each responsibility on a new line..."
                  />
                  <p className="text-xs text-muted-foreground">Enter each responsibility on a new line</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies Used</Label>
                  <Textarea
                    id="technologies"
                    value={technologiesText}
                    onChange={(e) => setTechnologiesText(e.target.value)}
                    rows={2}
                    placeholder="React, Next.js, TypeScript, Node.js..."
                  />
                  <p className="text-xs text-muted-foreground">Separate technologies with commas</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="achievements">Key Achievements</Label>
                  <Textarea
                    id="achievements"
                    value={achievementsText}
                    onChange={(e) => setAchievementsText(e.target.value)}
                    rows={3}
                    placeholder="Enter each achievement on a new line..."
                  />
                  <p className="text-xs text-muted-foreground">Enter each achievement on a new line</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_logo">Company Logo URL</Label>
                    <Input
                      id="company_logo"
                      value={formData.company_logo}
                      onChange={(e) => setFormData({ ...formData, company_logo: e.target.value })}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_website">Company Website</Label>
                    <Input
                      id="company_website"
                      value={formData.company_website}
                      onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                      placeholder="https://company.com"
                    />
                  </div>
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
                    <Label>Visibility</Label>
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
                      {editingExperience ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingExperience ? "Update" : "Create"}</>
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
          <span className="ml-2">Loading experience data...</span>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {experience.map((exp) => (
              <Card key={exp.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {exp.company_logo && (
                        <img
                          src={exp.company_logo || "/placeholder.svg"}
                          alt={`${exp.company} logo`}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{exp.position}</CardTitle>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Building className="h-4 w-4" />
                          {exp.company_website ? (
                            <a
                              href={exp.company_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors"
                            >
                              {exp.company} <ExternalLink className="h-3 w-3 inline ml-1" />
                            </a>
                          ) : (
                            exp.company
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {exp.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {exp.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {exp.is_current && <Badge variant="default">Current</Badge>}
                          <Badge variant={exp.is_active ? "default" : "secondary"}>
                            {exp.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(exp)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(exp.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {exp.description && <p className="text-sm text-muted-foreground mb-4">{exp.description}</p>}

                  {exp.responsibilities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Key Responsibilities:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {exp.responsibilities.slice(0, 3).map((resp, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {resp}
                          </li>
                        ))}
                        {exp.responsibilities.length > 3 && (
                          <li className="text-xs text-muted-foreground">
                            +{exp.responsibilities.length - 3} more responsibilities
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {exp.technologies.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-1">
                        {exp.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {exp.achievements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Achievements:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {exp.achievements.slice(0, 2).map((achievement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1">★</span>
                            {achievement}
                          </li>
                        ))}
                        {exp.achievements.length > 2 && (
                          <li className="text-xs text-muted-foreground">
                            +{exp.achievements.length - 2} more achievements
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Order: {exp.order_index}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {experience.length === 0 && (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-medium mb-2">No Experience Entries</h3>
              <p className="text-muted-foreground mb-4">
                Add your first work experience to showcase your professional journey.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
