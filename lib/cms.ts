import { isDatabaseAvailable } from "./db"
import * as dbFunctions from "./cms-db"

// Types
export interface Service {
  id: number
  title: string
  description: string
  icon: string
  order_index: number
  is_active: boolean
}

export interface Education {
  id: number
  degree: string
  institution: string
  years: string
  description?: string
  icon: string
  order_index: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface TechStack {
  id: number
  name: string
  icon: string
  category?: string
  order_index: number
  is_active: boolean
}

export interface Project {
  id: number
  title: string
  description: string
  tech_stack: string[]
  live_link?: string
  github_link?: string
  image_url?: string
  is_featured: boolean
  order_index: number
  is_active: boolean
}

export interface Testimonial {
  id: number
  name: string
  title: string
  company?: string
  quote: string
  rating: number
  avatar_url?: string
  order_index: number
  is_active: boolean
}

export interface Article {
  id: number
  title: string
  slug: string
  description: string
  content: string
  category: string
  read_time?: string
  featured_image?: string
  is_published: boolean
  is_featured: boolean
  order_index: number
  created_at: string
  updated_at: string
}

// Add this interface near the top with other interfaces
export interface Experience {
  id: number
  company: string
  position: string
  location?: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
  responsibilities: string[]
  technologies: string[]
  achievements: string[]
  company_logo?: string
  company_website?: string
  order_index: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

// Fallback static data (minimal, only used when database is completely unavailable)
const staticServices: Service[] = [
  {
    id: 1,
    title: "Web Development",
    description: "Building modern web applications with the latest technologies.",
    icon: "Code",
    order_index: 1,
    is_active: true,
  },
]

const staticEducation: Education[] = [
  {
    id: 1,
    degree: "Computer Science Degree",
    institution: "University",
    years: "2020 - 2024",
    description: "Focused on web development and software engineering.",
    icon: "GraduationCap",
    order_index: 1,
    is_active: true,
  },
]

const staticTechStack: TechStack[] = [
  { id: 1, name: "React", icon: "⚛️", category: "Frontend", order_index: 1, is_active: true },
  { id: 2, name: "Next.js", icon: "▲", category: "Frontend", order_index: 2, is_active: true },
  { id: 3, name: "TypeScript", icon: "🔷", category: "Language", order_index: 3, is_active: true },
]

const staticProjects: Project[] = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "A modern portfolio website built with Next.js and TypeScript.",
    tech_stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    live_link: "#",
    github_link: "#",
    is_featured: true,
    order_index: 1,
    is_active: true,
  },
]

const staticTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Client Name",
    title: "CEO",
    company: "Company",
    quote: "Excellent work and professional service.",
    rating: 5,
    order_index: 1,
    is_active: true,
  },
]

const staticArticles: Article[] = [
  {
    id: 1,
    title: "Getting Started with Web Development",
    slug: "getting-started-web-development",
    description: "A beginner's guide to modern web development.",
    content: "<p>Welcome to web development...</p>",
    category: "Tutorial",
    read_time: "5 min read",
    featured_image: "/placeholder.svg?height=400&width=800&text=Featured+Image",
    is_published: true,
    is_featured: true,
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const staticSiteSettings: Record<string, string> = {
  site_title: "Developer Portfolio",
  site_description: "A passionate developer building amazing web experiences.",
  hero_title: "Hi, I'm a Developer",
  hero_subtitle: "Building amazing web experiences with modern technologies.",
  about_me:
    "I'm a passionate web developer with expertise in modern technologies. I love creating beautiful, functional, and user-friendly applications that solve real-world problems.",
  profile_image: "/placeholder.svg?height=320&width=320&text=Profile+Image",
  contact_email: "contact@example.com",
  github_url: "https://github.com",
  linkedin_url: "https://linkedin.com",
}

// Add static fallback data near other static data
const staticExperience: Experience[] = [
  {
    id: 1,
    company: "Tech Company",
    position: "Software Developer",
    location: "Remote",
    start_date: "Jan 2022",
    end_date: "",
    is_current: true,
    description: "Building amazing web applications",
    responsibilities: ["Develop web applications", "Collaborate with team"],
    technologies: ["React", "Node.js", "TypeScript"],
    achievements: ["Delivered 5 major projects", "Improved performance by 40%"],
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Main functions with database integration and fallback
export async function getServices(): Promise<Service[]> {
  try {
    if (await isDatabaseAvailable()) {
      const services = await dbFunctions.getServices()
      return services.length > 0 ? services : staticServices
    }
  } catch (error) {
    console.error("Error fetching services from database, using fallback:", error)
  }
  return staticServices
}

export async function getEducation(): Promise<Education[]> {
  try {
    if (await isDatabaseAvailable()) {
      const education = await dbFunctions.getEducation()
      return education.length > 0 ? education : staticEducation
    }
  } catch (error) {
    console.error("Error fetching education from database, using fallback:", error)
  }
  return staticEducation
}

export async function getTechStack(): Promise<TechStack[]> {
  try {
    if (await isDatabaseAvailable()) {
      const techStack = await dbFunctions.getTechStack()
      return techStack.length > 0 ? techStack : staticTechStack
    }
  } catch (error) {
    console.error("Error fetching tech stack from database, using fallback:", error)
  }
  return staticTechStack
}

export async function getProjects(featuredOnly = false): Promise<Project[]> {
  try {
    if (await isDatabaseAvailable()) {
      const projects = await dbFunctions.getProjects(featuredOnly)
      return projects.length > 0 ? projects : staticProjects
    }
  } catch (error) {
    console.error("Error fetching projects from database, using fallback:", error)
  }
  return staticProjects
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    if (await isDatabaseAvailable()) {
      const testimonials = await dbFunctions.getTestimonials()
      return testimonials.length > 0 ? testimonials : staticTestimonials
    }
  } catch (error) {
    console.error("Error fetching testimonials from database, using fallback:", error)
  }
  return staticTestimonials
}

export async function getArticles(publishedOnly = false, featuredOnly = false): Promise<Article[]> {
  try {
    if (await isDatabaseAvailable()) {
      const articles = await dbFunctions.getArticles(publishedOnly, featuredOnly)
      return articles.length > 0 ? articles : staticArticles
    }
  } catch (error) {
    console.error("Error fetching articles from database, using fallback:", error)
  }
  return staticArticles
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    if (await isDatabaseAvailable()) {
      return await dbFunctions.getArticleBySlug(slug)
    }
  } catch (error) {
    console.error("Error fetching article by slug from database:", error)
  }
  return staticArticles.find((a) => a.slug === slug && a.is_published) || null
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    if (await isDatabaseAvailable()) {
      const settings = await dbFunctions.getSiteSettings()
      return Object.keys(settings).length > 0 ? settings : staticSiteSettings
    }
  } catch (error) {
    console.error("Error fetching site settings from database, using fallback:", error)
  }
  return staticSiteSettings
}

// Add this function near the end with other main functions
export async function getExperience(): Promise<Experience[]> {
  try {
    if (await isDatabaseAvailable()) {
      const experience = await dbFunctions.getExperience()
      return experience.length > 0 ? experience : staticExperience
    }
  } catch (error) {
    console.error("Error fetching experience from database, using fallback:", error)
  }
  return staticExperience
}
