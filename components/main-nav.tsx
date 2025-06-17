"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MainNavProps {
  items?: {
    title: string
    href: string
  }[]
  className?: string
}

export function MainNav({ items, className }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex gap-6 md:gap-10", className)}>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  )
}
