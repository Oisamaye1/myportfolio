"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, Github, Linkedin, Code2 } from "lucide-react"

const navigation = [
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Education", href: "#education" },
  { name: "Experience", href: "#experience" },
  { name: "Tech Stack", href: "#tech-stack" },
  { name: "Projects", href: "#projects" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Articles", href: "#articles" },
  { name: "Contact", href: "#contact" },
]

export function SiteHeader() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/cms/settings")
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error)
      }
    }
    fetchSettings()
  }, [])

  const siteName = settings.site_name || "Oisamaye"
  const githubUrl = settings.github_url || "https://github.com/Oisamaye1"
  const linkedinUrl = settings.linkedin_url || "https://www.linkedin.com/in/ovioisa-oisamaye-benjamin-93998019b/"
  const twitterUrl = settings.twitter_url

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <Code2 className="h-6 w-6" />
          <span className="font-bold text-xl">{siteName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60 hover:underline underline-offset-4"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          {githubUrl && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
          )}
          {linkedinUrl && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-4">
              <div className="flex items-center space-x-2 pb-4 border-b">
                <Code2 className="h-6 w-6" />
                <span className="font-bold text-xl">{siteName}</span>
              </div>

              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2 px-2 rounded-md hover:bg-accent"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-2 pt-4 border-t">
                {githubUrl && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </Link>
                  </Button>
                )}
                {linkedinUrl && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                  </Button>
                )}
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
