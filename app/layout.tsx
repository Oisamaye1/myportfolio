import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { siteConfig } from "@/config/site"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Oisamaye's Portfolio",
    template: `%s - Oisamaye's Portfolio`,
  },
  description: "A passionate Web Developer building beautiful and functional web experiences.",
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: "Ovioisa Oisamaye Benjamin",
  metadataBase: siteConfig.metadataBase,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "Oisamaye's Portfolio",
    description: siteConfig.description,
    siteName: "Oisamaye's Portfolio",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oisamaye's Portfolio",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.author.twitter,
  },
  icons: {
    icon: "https://res.cloudinary.com/du2dk0zua/image/upload/v1750166915/hero_ekswna.jpg",
    shortcut: "https://res.cloudinary.com/du2dk0zua/image/upload/v1750166915/hero_ekswna.jpg",
    apple: "https://res.cloudinary.com/du2dk0zua/image/upload/v1750166915/hero_ekswna.jpg",
  },
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
