import type React from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DatabaseStatus } from "@/components/database-status"
import { getTechStack } from "@/lib/cms"
import { siteConfig } from "@/config/site"
import * as Icons from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Tech Stack",
  description: "Technologies and tools I use to build amazing web experiences.",
  openGraph: {
    title: `Tech Stack - ${siteConfig.name}`,
    description: "Technologies and tools I use to build amazing web experiences.",
    url: `${siteConfig.url}/tech-stack`,
  },
}

export default async function TechStackPage() {
  const techStack = await getTechStack()

  const categories = Array.from(new Set(techStack.map((item) => item.category)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Tech Stack</h1>
            <p className="text-xl text-muted-foreground">
              Technologies and tools I use to build amazing web experiences
            </p>
          </div>
          <DatabaseStatus />
        </div>

        {techStack.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No tech stack items found.</p>
              <p className="text-sm text-muted-foreground">
                Add some technologies in the{" "}
                <a href="/cms" className="text-primary hover:underline">
                  CMS
                </a>{" "}
                to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryItems = techStack.filter((item) => item.category === category)
              return (
                <div key={category}>
                  <h2 className="text-2xl font-semibold mb-6 capitalize">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryItems.map((item) => {
                      const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{
                        className?: string
                      }>

                      return (
                        <Card key={item.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              {IconComponent && <IconComponent className="h-8 w-8 text-primary" />}
                              <div>
                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                <Badge variant="secondary" className="mt-1">
                                  {item.proficiency}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          {item.description && (
                            <CardContent>
                              <CardDescription>{item.description}</CardDescription>
                            </CardContent>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
