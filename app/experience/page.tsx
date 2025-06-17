import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Building, MapPin, Calendar, ExternalLink, Star } from "lucide-react"
import { getExperience } from "@/lib/cms"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: `Experience | ${siteConfig.name}`,
  description: `Professional work experience and career journey of ${siteConfig.name}. Explore my roles, responsibilities, and achievements.`,
  openGraph: {
    title: `Experience | ${siteConfig.name}`,
    description: `Professional work experience and career journey of ${siteConfig.name}. Explore my roles, responsibilities, and achievements.`,
    url: `${siteConfig.url}/experience`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Experience | ${siteConfig.name}`,
    description: `Professional work experience and career journey of ${siteConfig.name}. Explore my roles, responsibilities, and achievements.`,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
  },
}

// Disable caching for this page to ensure fresh data
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ExperiencePage() {
  const experience = await getExperience()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-gradient-primary mb-6">
            Professional Experience
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
            My career journey, roles, and professional growth over the years.
          </p>
        </div>

        {experience.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line - Hidden on mobile */}
              <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-primary/20 rounded-full hidden sm:block"></div>

              <div className="space-y-12">
                {experience.map((exp, index) => (
                  <div
                    key={exp.id}
                    className={`relative flex flex-col md:flex-row items-start ${
                      index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                    } animate-slide-in-diagonal`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {/* Timeline Dot - Hidden on mobile */}
                    <div
                      className={`absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10 ${
                        index === 0 ? "top-8" : "top-8"
                      } hidden sm:block`}
                    ></div>

                    <div
                      className={`w-full max-w-lg ${
                        index % 2 === 0 ? "md:mr-8 pl-16 sm:pl-0" : "md:ml-8 pl-16 sm:pl-0"
                      }`}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        <CardHeader className="pb-4">
                          <div className="flex items-start gap-4">
                            {exp.company_logo && (
                              <img
                                src={exp.company_logo || "/placeholder.svg"}
                                alt={`${exp.company} logo`}
                                className="w-16 h-16 rounded-lg object-cover border-2 border-primary/20"
                              />
                            )}
                            <div className="flex-1 space-y-2">
                              <CardTitle className="text-xl text-primary">{exp.position}</CardTitle>
                              <div className="flex items-center gap-2 text-lg font-semibold">
                                <Building className="h-5 w-5 text-muted-foreground" />
                                {exp.company_website ? (
                                  <a
                                    href={exp.company_website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors flex items-center gap-1"
                                  >
                                    {exp.company}
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                ) : (
                                  exp.company
                                )}
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                {exp.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {exp.location}
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {exp.is_current && (
                                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                    Current
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {exp.description && (
                            <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                          )}

                          {exp.responsibilities.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-3 text-primary">Key Responsibilities</h4>
                              <ul className="space-y-2">
                                {exp.responsibilities.map((resp, respIndex) => (
                                  <li key={respIndex} className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <span className="text-primary mt-1 text-lg">•</span>
                                    <span className="leading-relaxed">{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {exp.achievements.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-3 text-primary">Key Achievements</h4>
                              <ul className="space-y-2">
                                {exp.achievements.map((achievement, achIndex) => (
                                  <li key={achIndex} className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <span className="leading-relaxed">{achievement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {exp.technologies.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-3 text-primary">Technologies Used</h4>
                              <div className="flex flex-wrap gap-2">
                                {exp.technologies.map((tech, techIndex) => (
                                  <Badge
                                    key={techIndex}
                                    variant="secondary"
                                    className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">No Experience Data</h2>
            <p className="text-muted-foreground mb-8">
              Experience information will be displayed here once it's added to the CMS.
            </p>
            <Button asChild>
              <Link href="/cms">Go to CMS</Link>
            </Button>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
