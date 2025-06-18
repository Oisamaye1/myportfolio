"use client"

import Link from "next/link"
import { siteConfig } from "@/config/site"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"

export function SiteHeader() {
  const items = [
    { title: "Home", href: "/" },
    { title: "Projects", href: "/projects" },
    { title: "Experience", href: "/experience" },
    { title: "Tech Stack", href: "/tech-stack" },
    { title: "Education", href: "/education" },
    { title: "Blog", href: "/blog" },
    //{ title: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
          </Link>
          <MainNav items={items} />
        </div>
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <span className="font-bold">{siteConfig.name}</span>
            </Link>
          </div>
          <nav className="flex items-center">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
