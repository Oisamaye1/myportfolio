import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { DatabaseStatus } from "@/components/database-status"
import { getProjects, getSiteSettings } from "@/lib/cms"

// Disable caching to ensure fresh data
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProjectsPage() {
  const [projects, siteSettings] = await Promise.all([
    getProjects(false), // Get all projects, not just featured
    getSiteSettings(),
  ])

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4 md:px-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/" aria-label="Go back to home" prefetch={false}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <span className="font-semibold text-gradient-primary">Projects</span>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <MobileNav siteSettings={siteSettings} />
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 text-center space-y-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter animate-fade-in-up text-gradient-primary">
            All Projects
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-base md:text-xl animate-fade-in-up delay-100">
            A collection of my work, showcasing my skills and passion for web development.
          </p>

          {/* Database status indicator */}
          <div className="flex justify-center">
            <DatabaseStatus />
          </div>

          {projects.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-8">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`flex flex-col rounded-3xl bg-card border border-border hover:border-primary/50 overflow-hidden shadow-lg transform hover:scale-[1.02] hover:shadow-xl animate-zoom-in transition-all duration-500`}
                  style={{ animationDelay: `${100 + index * 100}ms` }}
                >
                  <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                    {project.image_url ? (
                      <img
                        src={project.image_url || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">Project Preview</span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      {project.is_featured && (
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.slice(0, 3).map((techItem) => (
                        <Badge key={techItem} variant="secondary">
                          {techItem}
                        </Badge>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <Badge variant="secondary">+{project.tech_stack.length - 3} more</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm flex-1 line-clamp-3 mb-6">{project.description}</p>

                    {/* Action buttons with proper CMS links */}
                    <div className="flex gap-3 mt-auto">
                      {project.live_link && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-primary hover:text-primary-foreground"
                          asChild
                        >
                          <Link href={project.live_link} target="_blank" rel="noopener noreferrer" prefetch={false}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Live Demo
                          </Link>
                        </Button>
                      )}
                      {project.github_link && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-primary hover:text-primary-foreground"
                          asChild
                        >
                          <Link href={project.github_link} target="_blank" rel="noopener noreferrer" prefetch={false}>
                            <Github className="mr-2 h-4 w-4" />
                            Code
                          </Link>
                        </Button>
                      )}
                      {!project.live_link && !project.github_link && (
                        <div className="flex-1 text-center text-sm text-muted-foreground py-2">Links coming soon</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-medium mb-2">No Projects Found</h3>
              <p className="text-muted-foreground mb-4">Add projects in the CMS to display your work here.</p>
              <Button asChild>
                <Link href="/cms">Go to CMS</Link>
              </Button>
            </div>
          )}

          <div className="pt-8">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/" prefetch={false}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteSettings.site_title || "Portfolio"}. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#top" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Back to Top
          </Link>
        </nav>
      </footer>
    </div>
  )
}
