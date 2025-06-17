"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LogOut,
  Code,
  Briefcase,
  Star,
  FileText,
  GraduationCap,
  User,
  Settings,
  ExternalLink,
  Home,
} from "lucide-react"
import { ServicesManagement } from "@/components/cms/services-management"
import { EducationManagement } from "@/components/cms/education-management"
import { ProjectsManagement } from "@/components/cms/projects-management"
import { TechStackManagement } from "@/components/cms/tech-stack-management"
import { TestimonialsManagement } from "@/components/cms/testimonials-management"
import { ArticlesManagement } from "@/components/cms/articles-management"
import { SettingsManagement } from "@/components/cms/settings-management"
import { ExperienceManagement } from "@/components/cms/experience-management"

export default function CMSDashboard() {
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    articles: 0,
    testimonials: 0,
    education: 0,
    techStack: 0,
    experience: 0,
  })
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...")

        // Add a small delay to ensure cookies are available
        await new Promise((resolve) => setTimeout(resolve, 100))

        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        console.log("Auth response status:", response.status)

        // Check if response is JSON
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Response is not JSON:", await response.text())
          router.push("/cms/login")
          return
        }

        const data = await response.json()
        console.log("Auth response data:", data.message || "authenticated")

        if (response.ok && data.authenticated) {
          setUser(data.user)
          // Fetch stats
          fetchStats()
        } else {
          console.log("Authentication failed:", data.message)
          router.push("/cms/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/cms/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const fetchStats = async () => {
    try {
      const [servicesRes, projectsRes, articlesRes, testimonialsRes, educationRes, techStackRes, experienceRes] =
        await Promise.all([
          fetch("/api/cms/services", { credentials: "include" }),
          fetch("/api/cms/projects", { credentials: "include" }),
          fetch("/api/cms/articles", { credentials: "include" }),
          fetch("/api/cms/testimonials", { credentials: "include" }),
          fetch("/api/cms/education", { credentials: "include" }),
          fetch("/api/cms/tech-stack", { credentials: "include" }),
          fetch("/api/cms/experience", { credentials: "include" }),
        ])

      const [services, projects, articles, testimonials, education, techStack, experience] = await Promise.all([
        servicesRes.json(),
        projectsRes.json(),
        articlesRes.json(),
        testimonialsRes.json(),
        educationRes.json(),
        techStackRes.json(),
        experienceRes.json(),
      ])

      setStats({
        services: services.filter((s: any) => s.is_active).length,
        projects: projects.filter((p: any) => p.is_active).length,
        articles: articles.filter((a: any) => a.is_published).length,
        testimonials: testimonials.filter((t: any) => t.is_active).length,
        education: education.filter((e: any) => e.is_active).length,
        techStack: techStack.filter((t: any) => t.is_active).length,
        experience: experience.filter((e: any) => e.is_active).length,
      })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      router.push("/cms/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Force redirect even if logout fails
      router.push("/cms/login")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading CMS...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Content Management System
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, <span className="font-medium">{user.username}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  View Website
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild className="sm:hidden">
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <Home className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-9 h-auto p-1 min-w-[800px]">
              <TabsTrigger value="overview" className="text-xs px-3 py-2">
                Overview
              </TabsTrigger>
              <TabsTrigger value="services" className="text-xs px-3 py-2">
                Services
              </TabsTrigger>
              <TabsTrigger value="experience" className="text-xs px-3 py-2">
                Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="text-xs px-3 py-2">
                Education
              </TabsTrigger>
              <TabsTrigger value="tech" className="text-xs px-3 py-2">
                Tech Stack
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs px-3 py-2">
                Projects
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="text-xs px-3 py-2">
                Testimonials
              </TabsTrigger>
              <TabsTrigger value="articles" className="text-xs px-3 py-2">
                Articles
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs px-3 py-2">
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Services</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.services}</div>
                  <p className="text-xs text-muted-foreground">Active services</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Experience</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.experience}</div>
                  <p className="text-xs text-muted-foreground">Work experiences</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projects</CardTitle>
                  <Code className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.projects}</div>
                  <p className="text-xs text-muted-foreground">Active projects</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.articles}</div>
                  <p className="text-xs text-muted-foreground">Published articles</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Education</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.education}</div>
                  <p className="text-xs text-muted-foreground">Education entries</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.testimonials}</div>
                  <p className="text-xs text-muted-foreground">Client testimonials</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tech Stack</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.techStack}</div>
                  <p className="text-xs text-muted-foreground">Technologies</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Content</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.services +
                      stats.projects +
                      stats.articles +
                      stats.testimonials +
                      stats.education +
                      stats.techStack +
                      stats.experience}
                  </div>
                  <p className="text-xs text-muted-foreground">Total entries</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎉 Portfolio CMS Dashboard
                  <Button variant="outline" size="sm" asChild>
                    <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      View Live
                    </a>
                  </Button>
                </CardTitle>
                <CardDescription>Manage all your portfolio content from one centralized location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Your content management system is fully operational and connected to your Neon database. Use the
                    tabs above to manage different sections of your portfolio.
                  </p>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">✅ Content Sections</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Services & offerings</li>
                          <li>Work experience</li>
                          <li>Education & certifications</li>
                          <li>Technical skills</li>
                          <li>Portfolio projects</li>
                          <li>Client testimonials</li>
                          <li>Blog articles</li>
                          <li>Site settings</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">🚀 Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Real-time content updates</li>
                          <li>Image upload support</li>
                          <li>SEO optimization</li>
                          <li>Responsive design</li>
                          <li>Database backup</li>
                          <li>User authentication</li>
                          <li>Content validation</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">📊 Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" asChild className="w-full justify-start">
                            <a href="/" target="_blank" rel="noopener noreferrer">
                              <Home className="mr-2 h-4 w-4" />
                              View Homepage
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild className="w-full justify-start">
                            <a href="/blog" target="_blank" rel="noopener noreferrer">
                              <FileText className="mr-2 h-4 w-4" />
                              View Blog
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild className="w-full justify-start">
                            <a href="/projects" target="_blank" rel="noopener noreferrer">
                              <Code className="mr-2 h-4 w-4" />
                              View Projects
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild className="w-full justify-start">
                            <a href="/experience" target="_blank" rel="noopener noreferrer">
                              <User className="mr-2 h-4 w-4" />
                              View Experience
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <ServicesManagement />
            </div>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <ExperienceManagement />
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <EducationManagement />
            </div>
          </TabsContent>

          <TabsContent value="tech" className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <TechStackManagement />
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <ProjectsManagement />
            </div>
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <TestimonialsManagement />
            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <ArticlesManagement />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <SettingsManagement />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
