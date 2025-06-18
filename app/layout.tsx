import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { getSiteSettings } from "@/lib/cms-db"

const inter = Inter({ subsets: ["latin"] })

// Function to get dynamic metadata from CMS
async function getMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  // Fallback values from original siteConfig
  const siteName = settings.site_name || "Oisamaye"
  const siteTitle = settings.site_title || "Oisamaye's Portfolio"
  const description =
    settings.site_description || "A passionate Web Developer building beautiful and functional web experiences."
  const siteUrl = settings.site_url || "https://oisamaye.vercel.app/"
  const ogImage = settings.og_image || "https://res.cloudinary.com/du2dk0zua/image/upload/v1750166915/hero_ekswna.jpg"
  const creator = settings.site_creator || "Ovioisa Oisamaye Benjamin"
  const twitterHandle = settings.twitter_handle || "@ovioisabenjamin"
  const keywords = settings.seo_keywords
    ? settings.seo_keywords.split(",").map((k) => k.trim())
    : [
        "web developer",
        "frontend developer",
        "react developer",
        "next.js developer",
        "portfolio",
        "web development",
        "javascript",
        "typescript",
      ]

  return {
    title: {
      default: siteTitle,
      template: `%s - ${siteName}'s Portfolio`,
    },
    description,
    keywords,
    authors: [
      {
        name: creator,
        url: siteUrl,
      },
    ],
    creator,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: siteTitle,
      description,
      siteName: siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteName}'s Portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description,
      images: [ogImage],
      creator: twitterHandle,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    metadataBase: new URL(siteUrl),
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return await getMetadata()
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

export const metadata = {
      generator: 'v0.dev'
    };
