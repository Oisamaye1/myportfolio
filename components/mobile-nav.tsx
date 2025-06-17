"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Github, Linkedin } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

interface MobileNavProps {
  siteSettings?: Record<string, string>
}

export function MobileNav({ siteSettings = {} }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const navItems = [
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b">
            <span className="font-semibold text-lg">Menu</span>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>

          <nav className="flex flex-col gap-4 py-6 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
                prefetch={false}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="border-t pt-4">
            <div className="flex items-center gap-4 justify-center">
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href={siteSettings.github_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  prefetch={false}
                >
                  <Github className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href={siteSettings.linkedin_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  prefetch={false}
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
