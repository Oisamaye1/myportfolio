import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { getArticleBySlug, getSiteSettings } from "@/lib/cms"
import { notFound } from "next/navigation"

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const [article, siteSettings] = await Promise.all([getArticleBySlug(params.slug), getSiteSettings()])

  if (!article) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4 md:px-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/blog" aria-label="Go back to blog" prefetch={false}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <span className="font-semibold text-gradient-primary line-clamp-1">{article.title}</span>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            {article.featured_image && (
              <div className="w-full max-w-4xl mx-auto mb-8">
                <img
                  src={article.featured_image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
            <div className="flex justify-center gap-2 mb-4">
              <Badge className="bg-primary text-primary-foreground">{article.category}</Badge>
              {article.is_featured && <Badge variant="secondary">Featured</Badge>}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter animate-fade-in-up">
              {article.title}
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-in-up delay-100">{article.description}</p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in-up delay-200">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(article.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {article.read_time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {article.read_time}
                </div>
              )}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {siteSettings.site_title?.replace("'s Portfolio", "") || "Author"}
              </div>
            </div>
          </div>

          <div
            className="prose dark:prose-invert max-w-none mx-auto text-base md:text-lg leading-relaxed animate-fade-in-up delay-300"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="pt-8 text-center border-t">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/blog" prefetch={false}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Articles
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

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
    },
  }
}
