import type React from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DatabaseStatus } from "@/components/database-status"
import { getEducation } from "@/lib/cms"
import { siteConfig } from "@/config/site"
import * as Icons from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Education",
  description: "My educational background and professional development journey.",
  openGraph: {
    title: `Education - ${siteConfig.name}`,
    description: "My educational background and professional development journey.",
    url: `${siteConfig.url}/education`,
  },
}

export default async function EducationPage() {
  const education = await getEducation()
  const visibleEducation = education.filter((item) => item.visible)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Education</h1>
            <p className="text-xl text-muted-foreground">
              My educational background and professional development journey
            </p>
          </div>
          <DatabaseStatus />
        </div>

        {visibleEducation.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No education entries found.</p>
              <p className="text-sm text-muted-foreground">
                Add your education in the{" "}
                <a href="/cms" className="text-primary hover:underline">
                  CMS
                </a>{" "}
                to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {visibleEducation.map((item) => {
              const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{
                className?: string
              }>

              return (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      {IconComponent && (
                        <div className="flex-shrink-0">
                          <IconComponent className="h-8 w-8 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{item.degree}</CardTitle>
                            <CardDescription className="text-lg font-medium text-foreground mt-1">
                              {item.institution}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">{item.years}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  {item.description && (
                    <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
