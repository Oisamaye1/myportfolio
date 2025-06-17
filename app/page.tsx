import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Linkedin,
  ExternalLink,
  ArrowRight,
  Code,
  Layout,
  Palette,
  Users,
  GraduationCap,
  Laptop,
  Zap,
  Star,
  Sparkles,
  Calendar,
  MapPin,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { ContactForm } from "@/components/contact-form"
import { EmailStatus } from "@/components/email-status"
import { DatabaseStatus } from "@/components/database-status"
import {
  getServices,
  getEducation,
  getExperience,
  getTechStack,
  getProjects,
  getTestimonials,
  getArticles,
  getSiteSettings,
} from "@/lib/cms"

// Icon mapping for dynamic icons
const iconMap: Record<string, any> = {
  Code,
  Layout,
  Palette,
  Users,
  GraduationCap,
  Laptop,
}

// Disable caching for this page to ensure fresh data
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Component() {
  // Fetch all content from CMS
  const [services, education, experience, techStack, projects, testimonials, articles, siteSettings] =
    await Promise.all([
      getServices(),
      getEducation(),
      getExperience(),
      getTechStack(),
      getProjects(true), // Featured projects only
      getTestimonials(),
      getArticles(true, true), // Published and featured articles only
      getSiteSettings(),
    ])

  // Check if Resend API key is configured (server-side only)
  const hasResendApiKey = !!process.env.RESEND_API_KEY || !!process.env.HAS_RESEND_API_KEY

  // Filter only active services
  const activeServices = services.filter((service) => service.is_active)

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Email Status Component */}
      <EmailStatus hasResendApiKey={hasResendApiKey} />

      {/* Database Status Component */}
      <DatabaseStatus />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-float-reverse"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="#" className="flex items-center gap-2 font-bold text-xl" prefetch={false}>
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <span>{siteSettings.site_title || "Portfolio"}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[
              "About",
              "Services",
              "Education",
              "Experience",
              "Tech Stack",
              "Projects",
              "Testimonials",
              "Articles",
              "Contact",
            ].map((item, index) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="relative hover:text-primary transition-all duration-300 group"
                prefetch={false}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="icon" className="hover:animate-wiggle" asChild>
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
              <Button variant="ghost" size="icon" className="hover:animate-wiggle" asChild>
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
              <ThemeToggle />
            </div>
            <MobileNav siteSettings={siteSettings} />
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative w-full py-20 md:py-32 lg:py-40 xl:py-48 flex items-center justify-center text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background"></div>
          <div className="container px-4 md:px-6 z-10">
            <div className="space-y-8">
              <div className="animate-bounce-in">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-gradient-primary">
                  {siteSettings.hero_title || "Welcome to My Portfolio"}
                </h1>
              </div>
              <div className="animate-slide-up-fade" style={{ animationDelay: "0.3s" }}>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-lg sm:text-xl lg:text-2xl">
                  {siteSettings.hero_subtitle || "Building amazing web experiences"}
                </p>
              </div>
              <div
                className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up-fade"
                style={{ animationDelay: "0.6s" }}
              >
                <Button
                  asChild
                  className="px-6 py-3 text-base sm:text-lg bg-primary text-primary-foreground hover:bg-primary/90 transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="#projects" prefetch={false}>
                    <Sparkles className="mr-2 h-5 w-5" />
                    View Projects
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="px-6 py-3 text-base sm:text-lg border-2 border-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="#contact" prefetch={false}>
                    <Zap className="mr-2 h-5 w-5" />
                    Contact Me
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section id="about" className="w-full py-20 md:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
              <div className="flex justify-center lg:justify-start animate-rotate-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary rounded-full animate-morph opacity-20"></div>
                  <Avatar className="h-48 w-48 sm:h-64 sm:w-64 md:h-80 md:w-80 border-4 border-primary shadow-2xl transform hover:scale-105 transition-all duration-500 animate-glow">
                    <AvatarImage
                      src={siteSettings.profile_image || "/placeholder.svg?height=320&width=320&text=Profile+Image"}
                      alt="Profile"
                    />
                    <AvatarFallback className="text-4xl">{siteSettings.site_title?.charAt(0) || "P"}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="space-y-8 text-center lg:text-left animate-slide-in-diagonal">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gradient-primary">
                  About Me
                </h2>
                <div className="space-y-6">
                  {siteSettings.about_me ? (
                    <div className="max-w-[800px] text-muted-foreground text-base md:text-lg leading-relaxed whitespace-pre-line">
                      {siteSettings.about_me}
                    </div>
                  ) : (
                    <>
                      <p className="max-w-[800px] text-muted-foreground text-base md:text-lg leading-relaxed">
                        I'm a dedicated web developer with a strong passion for creating intuitive and dynamic user
                        experiences. With a background in computer science and a keen eye for design, I specialize in
                        crafting responsive, high-performance web applications.
                      </p>
                      <p className="max-w-[800px] text-muted-foreground text-base md:text-lg leading-relaxed">
                        I thrive on learning new technologies and solving complex problems, always striving to write
                        clean, efficient, and maintainable code. Outside of coding, I enjoy hiking, playing guitar, and
                        exploring new coffee shops.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="w-full py-20 md:py-32 relative">
          <div className="container px-4 md:px-6">
            <div className="space-y-12 text-center">
              <div className="animate-bounce-in">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gradient-primary">
                  My Services
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-base md:text-lg mt-4">
                  I offer a range of services to help bring your digital ideas to life.
                </p>
              </div>

              {activeServices.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 pt-12">
                  {activeServices.map((service, index) => {
                    const IconComponent = iconMap[service.icon] || Code
                    return (
                      <div
                        key={service.id}
                        className={`group relative p-8 rounded-3xl bg-primary text-primary-foreground transform hover:scale-110 hover:rotate-3 transition-all duration-500 animate-elastic cursor-pointer`}
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        <div className="absolute inset-0 bg-black/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="mb-6 flex justify-center transform group-hover:scale-125 transition-transform duration-300">
                            <IconComponent className="h-12 w-12" />
                          </div>
                          <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                          <p className="text-sm opacity-90">{service.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <h3 className="text-lg font-medium mb-2">No Active Services</h3>
                  <p className="text-muted-foreground mb-4">
                    Add and activate services in the CMS to showcase what you offer.
                  </p>
                  <Button asChild>
                    <Link href="/cms">Manage Services</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="w-full py-20 md:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="space-y-12 text-center">
              <div className="animate-slide-up-fade">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gradient-primary">
                  Education Journey
                </h2>
              </div>
              <div className="relative max-w-4xl mx-auto">
                {/* Timeline Line - Hidden on mobile */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary rounded-full hidden md:block"></div>

                <div className="space-y-12">
                  {education.map((edu, index) => {
                    const IconComponent = iconMap[edu.icon] || GraduationCap
                    return (
                      <div
                        key={edu.id}
                        className={`flex flex-col md:flex-row items-center ${
                          index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                        } animate-slide-in-diagonal`}
                        style={{ animationDelay: `${index * 300}ms` }}
                      >
                        <div
                          className={`w-full max-w-md ${index % 2 === 0 ? "md:mr-8" : "md:ml-8"} ${
                            index !== 0 ? "mt-8 md:mt-0" : ""
                          }`}
                        >
                          <div
                            className={`relative p-6 rounded-2xl bg-primary text-primary-foreground transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
                          >
                            <div className="flex items-center gap-4 mb-3">
                              <div className="p-2 bg-white/20 rounded-lg">
                                <IconComponent className="h-8 w-8" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">{edu.degree}</h3>
                                <p className="text-sm opacity-90">{edu.institution}</p>
                              </div>
                            </div>
                            <p className="text-xs opacity-80">{edu.years}</p>
                            {edu.description && <p className="text-sm opacity-90 mt-2">{edu.description}</p>}

                            {/* Timeline Dot - Hidden on mobile */}
                            <div
                              className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full border-4 border-primary ${
                                index % 2 === 0 ? "-right-10" : "-left-10"
                              } hidden md:block`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex justify-center pt-8">
                <Button
                  asChild
                  variant="outline"
                  className="border-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/education" prefetch={false}>
                    View All Education <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="w-full py-20 md:py-32 relative">
          <div className="container px-4 md:px-6">
            <div className="space-y-12 text-center">
              <div className="animate-bounce-in">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gradient-primary">
                  Professional Journey
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-base md:text-lg mt-4">
                  My career path and professional experiences that shaped my expertise.
                </p>
              </div>

              {experience.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-12">
                  {experience.slice(0, 3).map((exp, index) => (
                    <div
                      key={exp.id}
                      className={`group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transform hover:scale-105 hover:-translate-y-4 transition-all duration-500 animate-slide-in-diagonal cursor-pointer`}
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <div className="absolute top-4 right-4">
                        {exp.is_current && (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                            Current
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        {exp.company_logo && (
                          <img
                            src={exp.company_logo || "/placeholder.svg"}
                            alt={`${exp.company} logo`}
                            className="w-12 h-12 rounded-lg object-cover border-2 border-primary/20"
                          />
                        )}
                        <div className="text-left">
                          <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
                            {exp.position}
                          </h3>
                          <p className="text-sm font-medium text-muted-foreground">{exp.company}</p>
                        </div>
                      </div>

                      <div className="text-left space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}
                        </div>

                        {exp.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {exp.location}
                          </div>
                        )}

                        {exp.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">{exp.description}</p>
                        )}

                        {exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-4">
                            {exp.technologies.slice(0, 4).map((tech, techIndex) => (
                              <Badge key={techIndex} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                            {exp.technologies.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{exp.technologies.length - 4}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <h3 className="text-lg font-medium mb-2">No Experience Data</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your work experience in the CMS to showcase your professional journey.
                  </p>
                  <Button asChild>
                    <Link href="/cms">Go to CMS</Link>
                  </Button>
                </div>
              )}

              <div className="flex justify-center pt-8">
                <Button
                  asChild
                  variant="outline"
                  className="border-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/experience" prefetch={false}>
                    View Full Experience <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech-stack" className="w-full py-20 md:py-32 relative overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="space-y-12 text-center">
              <div className="animate-bounce-in">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gradient-primary">
                  Tech Arsenal
                </h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6 pt-12">
                {techStack.map((tech, index) => (
                  <div
                    key={tech.id}
                    className={`group relative flex flex-col items-center space-y-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:scale-110 hover:-translate-y-2 animate-float cursor-pointer`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationDuration: `${6 + (index % 3)}s`,
                    }}
                  >
                    <div className="relative">
                      <div className="text-3xl group-hover:animate-wiggle">{tech.icon}</div>
                    </div>
                    <span className="text-xs font-medium text-center group-hover:text-primary transition-colors duration-300">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center pt-8">
                <Button
                  asChild
                  variant="outline"
                  className="border-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/tech-stack" prefetch={false}>
                    View All Technologies <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="w-full py-20 md:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="space-y-12 text-center">
              <div className="animate-slide-up-fade">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gradient-primary">
                  Featured Projects
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-base md:text-lg mt-4">
                  A showcase of my best work and most impactful projects.
                </p>
              </div>

              {projects.length > 0 ? (
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 pt-12">
                  {projects.map((project, index) => {
                    return (
                      <div
                        key={project.id}
                        className="group relative perspective-1000 animate-rotate-in"
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        <div className="relative preserve-3d group-hover:rotate-y-12 transition-transform duration-700">
                          <div className="relative overflow-hidden rounded-3xl bg-primary p-1 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                            <div className="bg-card rounded-3xl overflow-hidden">
                              <div className="relative overflow-hidden">
                                <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700">
                                  {project.image_url ? (
                                    <img
                                      src={project.image_url || "/placeholder.svg"}
                                      alt={project.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-muted-foreground text-sm">Project Preview</span>
                                  )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                              <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                                    {project.title}
                                  </h3>
                                  {project.is_featured && (
                                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {project.tech_stack.map((techItem, techIndex) => (
                                    <Badge
                                      key={techItem}
                                      variant="secondary"
                                      className="transform hover:scale-110 transition-transform duration-200"
                                      style={{ animationDelay: `${techIndex * 50}ms` }}
                                    >
                                      {techItem}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="text-muted-foreground text-sm mb-6">{project.description}</p>
                                <div className="flex gap-3">
                                  {project.live_link && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-300"
                                      asChild
                                    >
                                      <Link
                                        href={project.live_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        prefetch={false}
                                      >
                                        Live Demo <ExternalLink className="ml-2 h-4 w-4" />
                                      </Link>
                                    </Button>
                                  )}
                                  {project.github_link && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-300"
                                      asChild
                                    >
                                      <Link
                                        href={project.github_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        prefetch={false}
                                      >
                                        GitHub <Github className="ml-2 h-4 w-4" />
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <h3 className="text-lg font-medium mb-2">No Featured Projects</h3>
                  <p className="text-muted-foreground mb-4">
                    Add featured projects in the CMS to showcase your best work.
                  </p>
                  <Button asChild>
                    <Link href="/cms">Go to CMS</Link>
                  </Button>
                </div>
              )}

              <div className="flex justify-center pt-8">
                <Button
                  asChild
                  variant="outline"
                  className="border-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/projects" prefetch={false}>
                    View All Projects <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-20 md:py-32 relative overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="space-y-12 text-center">
              <div className="animate-bounce-in">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gradient-primary">
                  Client Love
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-base md:text-lg mt-4">
                  Hear from those I've had the pleasure of working with.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-12">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transform hover:scale-105 hover:-translate-y-4 transition-all duration-500 animate-float cursor-pointer`}
                    style={{
                      animationDelay: `${index * 200}ms`,
                      animationDuration: `${5 + index}s`,
                    }}
                  >
                    <div className="absolute top-4 right-4 flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>

                    <blockquote className="text-lg italic text-muted-foreground mb-6 relative">
                      <span className="absolute -top-2 -left-2 text-6xl text-primary/20 font-serif">"</span>
                      {testimonial.quote}
                      <span className="absolute -bottom-4 -right-2 text-6xl text-primary/20 font-serif">"</span>
                    </blockquote>

                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/50 group-hover:border-primary transition-colors duration-300">
                        <AvatarImage
                          src={
                            testimonial.avatar_url || `/placeholder.svg?height=64&width=64&query=professional avatar`
                          }
                          alt={testimonial.name}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-bold group-hover:text-primary transition-colors duration-300">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.title}
                          {testimonial.company && `, ${testimonial.company}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Latest Articles Section */}
        <section id="articles" className="w-full py-20 md:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="space-y-12 text-center">
              <div className="animate-slide-up-fade">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gradient-primary">
                  Latest Insights
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-base md:text-lg mt-4">
                  My thoughts and insights on web development and technology.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-12">
                {articles.map((article, index) => (
                  <div
                    key={article.id}
                    className={`group relative overflow-hidden rounded-3xl bg-card border border-border hover:border-primary/50 transform hover:scale-105 hover:rotate-1 transition-all duration-500 animate-slide-in-diagonal cursor-pointer`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-primary text-primary-foreground border-0">{article.category}</Badge>
                    </div>

                    <div className="absolute top-4 right-4 z-10">
                      <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-full backdrop-blur-sm">
                        {article.read_time}
                      </span>
                    </div>

                    <div className="p-8 pt-16">
                      <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{article.description}</p>
                      <div className="flex justify-end">
                        <Button
                          variant="link"
                          className="p-0 h-auto text-primary hover:text-primary/80 group-hover:translate-x-2 transition-transform duration-300"
                          asChild
                        >
                          <Link href={`/blog/${article.slug}`} prefetch={false}>
                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center pt-8">
                <Button
                  asChild
                  variant="outline"
                  className="border-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/blog" prefetch={false}>
                    View All Articles <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="space-y-12 text-center">
              <div className="animate-bounce-in">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gradient-primary">
                  Let's Create Magic
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-base md:text-lg mt-4">
                  Have a project in mind or just want to say hello? Feel free to reach out!
                </p>
              </div>
              <div className="animate-slide-up-fade" style={{ animationDelay: "0.3s" }}>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative py-8 w-full border-t bg-background/80 backdrop-blur-xl">
        <div className="container flex flex-col gap-4 sm:flex-row items-center justify-between px-4 md:px-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteSettings.site_title || "Portfolio"}. All rights reserved. Made with ❤️
            and lots of ☕
          </p>
          <nav className="flex gap-6">
            <Link
              href="#hero"
              className="text-sm hover:text-primary transition-colors duration-300 hover:underline"
              prefetch={false}
            >
              Back to Top
            </Link>
            <Link
              href="#"
              className="text-sm hover:text-primary transition-colors duration-300 hover:underline"
              prefetch={false}
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
