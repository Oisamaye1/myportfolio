import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DatabaseStatus } from "@/components/database-status"
import { getArticles } from "@/lib/cms"
import { siteConfig } from "@/config/site"
import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Clock, User, BookOpen, FileText, Star } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and insights about web development and technology.",
  openGraph: {
    title: `Blog - ${siteConfig.name}`,
    description: "Thoughts, tutorials, and insights about web development and technology.",
    url: `${siteConfig.url}/blog`,
  },
}

export default async function BlogPage() {
  let articles: any[] = []
  let error = null

  try {
    // Get ALL articles, not just featured ones
    articles = await getArticles()
    console.log("Fetched articles:", articles.length)
  } catch (err) {
    console.error("Failed to fetch articles:", err)
    error = "Failed to load articles"
  }

  // Filter for published articles and sort by date (newest first)
  const publishedArticles = articles
    .filter((article) => article.is_published)
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at)
      const dateB = new Date(b.updated_at || b.created_at)
      return dateB.getTime() - dateA.getTime()
    })

  // Separate featured and regular articles
  const featuredArticles = publishedArticles.filter((article) => article.is_featured)
  const regularArticles = publishedArticles.filter((article) => !article.is_featured)

  console.log("Published articles:", publishedArticles.length)
  console.log("Featured articles:", featuredArticles.length)
  console.log("Regular articles:", regularArticles.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Thoughts, tutorials, and insights about web development, technology, and my journey as a developer.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {publishedArticles.length} articles published
              </span>
              {featuredArticles.length > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {featuredArticles.length} featured
                  </span>
                </>
              )}
            </div>
          </div>
          <DatabaseStatus />
        </div>

        {error ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-destructive mb-4">{error}</p>
              <p className="text-sm text-muted-foreground">
                Please check your database connection or try refreshing the page.
              </p>
            </CardContent>
          </Card>
        ) : publishedArticles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">No articles published yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Articles will appear here once they are published in the CMS.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Go to the{" "}
                    <a href="/cms" className="text-primary hover:underline font-medium">
                      Content Management System
                    </a>{" "}
                    to create and publish your first article.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {/* Featured Articles Section */}
            {featuredArticles.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-8">
                  <h2 className="text-3xl font-bold">Featured Articles</h2>
                  <Badge variant="secondary" className="px-3 py-1">
                    Featured
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredArticles.map((article) => (
                    <Card
                      key={article.id}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-primary/20"
                    >
                      <Link href={`/blog/${article.slug}`}>
                        {article.featured_image && (
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={article.featured_image || "/placeholder.svg"}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge variant="default" className="bg-primary/90 backdrop-blur">
                                Featured
                              </Badge>
                            </div>
                          </div>
                        )}
                        <CardHeader className="pb-3">
                          <div className="space-y-2">
                            <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                              {article.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-3">{article.description}</CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                <span>
                                  {new Date(article.updated_at || article.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              {article.read_time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{article.read_time}</span>
                                </div>
                              )}
                            </div>
                            {article.category && <Badge variant="outline">{article.category}</Badge>}
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* All Articles Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">
                  {featuredArticles.length > 0 ? "All Articles" : "Latest Articles"}
                </h2>
                <div className="text-sm text-muted-foreground">
                  Showing {publishedArticles.length} article{publishedArticles.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Show ALL published articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <Link href={`/blog/${article.slug}`}>
                      {article.featured_image && (
                        <div className="relative h-40 w-full overflow-hidden">
                          <Image
                            src={article.featured_image || "/placeholder.svg"}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          {article.is_featured && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="default" className="text-xs bg-primary/90 backdrop-blur">
                                Featured
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">{article.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              <span>
                                {new Date(article.updated_at || article.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            {article.read_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{article.read_time}</span>
                              </div>
                            )}
                          </div>
                          {article.category && (
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Call to Action */}
        {publishedArticles.length > 0 && (
          <section className="mt-16">
            <Card className="text-center py-12 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardContent>
                <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Get notified when I publish new articles about web development, technology trends, and programming
                  insights.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/contact">
                    <Badge
                      variant="outline"
                      className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    >
                      Get in Touch
                    </Badge>
                  </Link>
                  <Link href="/">
                    <Badge
                      variant="outline"
                      className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    >
                      View Portfolio
                    </Badge>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  )
}
