import { sql } from "./db"
import type { Service, TechStack, Project, Testimonial } from "./cms"

// Education type to match the database schema
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

// Add this Experience interface near the top with other interfaces
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

// Helper function to check if database is available
async function checkDatabase() {
  if (!sql) {
    throw new Error("Database not configured")
  }
  return sql
}

// Education functions
export async function getEducation(): Promise<Education[]> {
  try {
    const db = await checkDatabase()
    const education = await db`
      SELECT * FROM education 
      WHERE is_active = true 
      ORDER BY order_index ASC, id ASC
    `
    return education as Education[]
  } catch (error) {
    console.error("Error fetching education:", error)
    return []
  }
}

export async function getAllEducation(): Promise<Education[]> {
  try {
    const db = await checkDatabase()
    const education = await db`
      SELECT * FROM education 
      ORDER BY order_index ASC, id ASC
    `
    return education as Education[]
  } catch (error) {
    console.error("Error fetching all education:", error)
    return []
  }
}

export async function createEducation(data: Omit<Education, "id">): Promise<Education> {
  const db = await checkDatabase()
  const [education] = await db`
    INSERT INTO education (degree, institution, years, description, icon, order_index, is_active)
    VALUES (${data.degree}, ${data.institution}, ${data.years}, ${data.description}, ${data.icon}, ${data.order_index}, ${data.is_active})
    RETURNING *
  `
  return education as Education
}

export async function updateEducation(id: number, data: Partial<Education>): Promise<Education | null> {
  try {
    const db = await checkDatabase()
    const [education] = await db`
      UPDATE education 
      SET degree = COALESCE(${data.degree}, degree),
          institution = COALESCE(${data.institution}, institution),
          years = COALESCE(${data.years}, years),
          description = COALESCE(${data.description}, description),
          icon = COALESCE(${data.icon}, icon),
          order_index = COALESCE(${data.order_index}, order_index),
          is_active = COALESCE(${data.is_active}, is_active)
      WHERE id = ${id}
      RETURNING *
    `
    return (education as Education) || null
  } catch (error) {
    console.error("Error updating education:", error)
    return null
  }
}

export async function deleteEducation(id: number): Promise<boolean> {
  try {
    const db = await checkDatabase()
    const result = await db`DELETE FROM education WHERE id = ${id}`
    return result.count > 0
  } catch (error) {
    console.error("Error deleting education:", error)
    return false
  }
}

export async function getEducationById(id: number): Promise<Education | null> {
  try {
    const db = await checkDatabase()
    const [education] = await db`
      SELECT * FROM education 
      WHERE id = ${id}
    `
    return (education as Education) || null
  } catch (error) {
    console.error("Error fetching education by ID:", error)
    return null
  }
}

// Services
export async function getServices(): Promise<Service[]> {
  try {
    const db = await checkDatabase()
    const services = await db`
      SELECT * FROM services 
      WHERE is_active = true 
      ORDER BY order_index ASC, id ASC
    `
    return services as Service[]
  } catch (error) {
    console.error("Error fetching services:", error)
    return []
  }
}

export async function getAllServices(): Promise<Service[]> {
  try {
    const db = await checkDatabase()
    const services = await db`
      SELECT * FROM services 
      ORDER BY order_index ASC, id ASC
    `
    return services as Service[]
  } catch (error) {
    console.error("Error fetching all services:", error)
    return []
  }
}

export async function createService(data: Omit<Service, "id">): Promise<Service> {
  try {
    const db = await checkDatabase()
    const [service] = await db`
      INSERT INTO services (title, description, icon, order_index, is_active)
      VALUES (${data.title}, ${data.description}, ${data.icon}, ${data.order_index}, ${data.is_active})
      RETURNING *
    `
    return service as Service
  } catch (error) {
    console.error("Error creating service:", error)
    throw error
  }
}

export async function updateService(id: number, data: Partial<Service>): Promise<Service | null> {
  try {
    const db = await checkDatabase()
    const [service] = await db`
      UPDATE services 
      SET title = COALESCE(${data.title}, title),
          description = COALESCE(${data.description}, description),
          icon = COALESCE(${data.icon}, icon),
          order_index = COALESCE(${data.order_index}, order_index),
          is_active = COALESCE(${data.is_active}, is_active)
      WHERE id = ${id}
      RETURNING *
    `
    return (service as Service) || null
  } catch (error) {
    console.error("Error updating service:", error)
    return null
  }
}

export async function deleteService(id: number): Promise<boolean> {
  try {
    const db = await checkDatabase()
    const result = await db`DELETE FROM services WHERE id = ${id}`
    return result.count > 0
  } catch (error) {
    console.error("Error deleting service:", error)
    return false
  }
}

// Tech Stack
export async function getTechStack(): Promise<TechStack[]> {
  try {
    const db = await checkDatabase()
    const techStack = await db`
      SELECT * FROM tech_stack 
      WHERE is_active = true 
      ORDER BY order_index ASC, id ASC
    `
    return techStack as TechStack[]
  } catch (error) {
    console.error("Error fetching tech stack:", error)
    return []
  }
}

export async function getAllTechStack(): Promise<TechStack[]> {
  try {
    const db = await checkDatabase()
    const techStack = await db`
      SELECT * FROM tech_stack 
      ORDER BY order_index ASC, id ASC
    `
    return techStack as TechStack[]
  } catch (error) {
    console.error("Error fetching all tech stack:", error)
    return []
  }
}

export async function createTechStack(data: Omit<TechStack, "id">): Promise<TechStack> {
  try {
    const db = await checkDatabase()
    const [techStack] = await db`
      INSERT INTO tech_stack (name, icon, category, order_index, is_active)
      VALUES (${data.name}, ${data.icon}, ${data.category}, ${data.order_index}, ${data.is_active})
      RETURNING *
    `
    return techStack as TechStack
  } catch (error) {
    console.error("Error creating tech stack:", error)
    throw error
  }
}

export async function updateTechStack(id: number, data: Partial<TechStack>): Promise<TechStack | null> {
  try {
    const db = await checkDatabase()
    const [techStack] = await db`
      UPDATE tech_stack 
      SET name = COALESCE(${data.name}, name),
          icon = COALESCE(${data.icon}, icon),
          category = COALESCE(${data.category}, category),
          order_index = COALESCE(${data.order_index}, order_index),
          is_active = COALESCE(${data.is_active}, is_active)
      WHERE id = ${id}
      RETURNING *
    `
    return (techStack as TechStack) || null
  } catch (error) {
    console.error("Error updating tech stack:", error)
    return null
  }
}

export async function deleteTechStack(id: number): Promise<boolean> {
  try {
    const db = await checkDatabase()
    const result = await db`DELETE FROM tech_stack WHERE id = ${id}`
    return result.count > 0
  } catch (error) {
    console.error("Error deleting tech stack:", error)
    return false
  }
}

// Projects
export async function getProjects(featuredOnly = false): Promise<Project[]> {
  try {
    const db = await checkDatabase()
    const projects = featuredOnly
      ? await db`
          SELECT * FROM projects 
          WHERE is_active = true AND is_featured = true 
          ORDER BY order_index ASC, id ASC
        `
      : await db`
          SELECT * FROM projects 
          WHERE is_active = true 
          ORDER BY order_index ASC, id ASC
        `
    return projects as Project[]
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const db = await checkDatabase()
    const projects = await db`
      SELECT * FROM projects 
      ORDER BY order_index ASC, id ASC
    `
    return projects as Project[]
  } catch (error) {
    console.error("Error fetching all projects:", error)
    return []
  }
}

export async function createProject(data: Omit<Project, "id">): Promise<Project> {
  try {
    const db = await checkDatabase()
    const [project] = await db`
      INSERT INTO projects (title, description, tech_stack, live_link, github_link, image_url, is_featured, order_index, is_active)
      VALUES (${data.title}, ${data.description}, ${data.tech_stack}, ${data.live_link}, ${data.github_link}, ${data.image_url}, ${data.is_featured}, ${data.order_index}, ${data.is_active})
      RETURNING *
    `
    return project as Project
  } catch (error) {
    console.error("Error creating project:", error)
    throw error
  }
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project | null> {
  try {
    const db = await checkDatabase()
    const [project] = await db`
      UPDATE projects 
      SET title = COALESCE(${data.title}, title),
          description = COALESCE(${data.description}, description),
          tech_stack = COALESCE(${data.tech_stack}, tech_stack),
          live_link = COALESCE(${data.live_link}, live_link),
          github_link = COALESCE(${data.github_link}, github_link),
          image_url = COALESCE(${data.image_url}, image_url),
          is_featured = COALESCE(${data.is_featured}, is_featured),
          order_index = COALESCE(${data.order_index}, order_index),
          is_active = COALESCE(${data.is_active}, is_active)
      WHERE id = ${id}
      RETURNING *
    `
    return (project as Project) || null
  } catch (error) {
    console.error("Error updating project:", error)
    return null
  }
}

export async function deleteProject(id: number): Promise<boolean> {
  try {
    const db = await checkDatabase()
    const result = await db`DELETE FROM projects WHERE id = ${id}`
    return result.count > 0
  } catch (error) {
    console.error("Error deleting project:", error)
    return false
  }
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const db = await checkDatabase()
    const testimonials = await db`
      SELECT * FROM testimonials 
      WHERE is_active = true 
      ORDER BY order_index ASC, id ASC
    `
    return testimonials as Testimonial[]
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const db = await checkDatabase()
    const testimonials = await db`
      SELECT * FROM testimonials 
      ORDER BY order_index ASC, id ASC
    `
    return testimonials as Testimonial[]
  } catch (error) {
    console.error("Error fetching all testimonials:", error)
    return []
  }
}

export async function createTestimonial(data: Omit<Testimonial, "id">): Promise<Testimonial> {
  try {
    const db = await checkDatabase()
    const [testimonial] = await db`
      INSERT INTO testimonials (name, title, company, quote, rating, avatar_url, order_index, is_active)
      VALUES (${data.name}, ${data.title}, ${data.company}, ${data.quote}, ${data.rating}, ${data.avatar_url}, ${data.order_index}, ${data.is_active})
      RETURNING *
    `
    return testimonial as Testimonial
  } catch (error) {
    console.error("Error creating testimonial:", error)
    throw error
  }
}

export async function updateTestimonial(id: number, data: Partial<Testimonial>): Promise<Testimonial | null> {
  try {
    const db = await checkDatabase()
    const [testimonial] = await db`
      UPDATE testimonials 
      SET name = COALESCE(${data.name}, name),
          title = COALESCE(${data.title}, title),
          company = COALESCE(${data.company}, company),
          quote = COALESCE(${data.quote}, quote),
          rating = COALESCE(${data.rating}, rating),
          avatar_url = COALESCE(${data.avatar_url}, avatar_url),
          order_index = COALESCE(${data.order_index}, order_index),
          is_active = COALESCE(${data.is_active}, is_active)
      WHERE id = ${id}
      RETURNING *
    `
    return (testimonial as Testimonial) || null
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return null
  }
}

export async function deleteTestimonial(id: number): Promise<boolean> {
  try {
    const db = await checkDatabase()
    const result = await db`DELETE FROM testimonials WHERE id = ${id}`
    return result.count > 0
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return false
  }
}

// Articles
// Update the Article type to include featured_image
export interface ArticleType {
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

export async function getArticles(publishedOnly = false, featuredOnly = false): Promise<ArticleType[]> {
  try {
    const db = await checkDatabase()
    let query

    if (publishedOnly && featuredOnly) {
      query = db`
        SELECT * FROM articles 
        WHERE is_published = true AND is_featured = true 
        ORDER BY order_index ASC, created_at DESC
      `
    } else if (publishedOnly) {
      query = db`
        SELECT * FROM articles 
        WHERE is_published = true 
        ORDER BY order_index ASC, created_at DESC
      `
    } else if (featuredOnly) {
      query = db`
        SELECT * FROM articles 
        WHERE is_featured = true 
        ORDER BY order_index ASC, created_at DESC
      `
    } else {
      query = db`
        SELECT * FROM articles 
        ORDER BY order_index ASC, created_at DESC
      `
    }

    const articles = await query
    return articles as ArticleType[]
  } catch (error) {
    console.error("Error fetching articles:", error)
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<ArticleType | null> {
  try {
    const db = await checkDatabase()
    const [article] = await db`
      SELECT * FROM articles 
      WHERE slug = ${slug} AND is_published = true
    `
    return (article as ArticleType) || null
  } catch (error) {
    console.error("Error fetching article by slug:", error)
    return null
  }
}

// Update createArticle function
export async function createArticle(data: Omit<ArticleType, "id" | "created_at" | "updated_at">): Promise<ArticleType> {
  try {
    const db = await checkDatabase()
    const [article] = await db`
      INSERT INTO articles (title, slug, description, content, category, read_time, featured_image, is_published, is_featured, order_index)
      VALUES (${data.title}, ${data.slug}, ${data.description}, ${data.content}, ${data.category}, ${data.read_time}, ${data.featured_image}, ${data.is_published}, ${data.is_featured}, ${data.order_index})
      RETURNING *
    `
    return article as ArticleType
  } catch (error) {
    console.error("Error creating article:", error)
    throw error
  }
}

// Update updateArticle function
export async function updateArticle(id: number, data: Partial<ArticleType>): Promise<ArticleType | null> {
  try {
    const db = await checkDatabase()
    const [article] = await db`
      UPDATE articles 
      SET title = COALESCE(${data.title}, title),
          slug = COALESCE(${data.slug}, slug),
          description = COALESCE(${data.description}, description),
          content = COALESCE(${data.content}, content),
          category = COALESCE(${data.category}, category),
          read_time = COALESCE(${data.read_time}, read_time),
          featured_image = COALESCE(${data.featured_image}, featured_image),
          is_published = COALESCE(${data.is_published}, is_published),
          is_featured = COALESCE(${data.is_featured}, is_featured),
          order_index = COALESCE(${data.order_index}, order_index)
      WHERE id = ${id}
      RETURNING *
    `
    return (article as ArticleType) || null
  } catch (error) {
    console.error("Error updating article:", error)
    return null
  }
}

export async function deleteArticle(id: number): Promise<boolean> {
  try {
    const db = await checkDatabase()
    const result = await db`DELETE FROM articles WHERE id = ${id}`
    return result.count > 0
  } catch (error) {
    console.error("Error deleting article:", error)
    return false
  }
}

// Site Settings
export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const db = await checkDatabase()
    const settings = await db`SELECT key, value FROM site_settings`
    return settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      },
      {} as Record<string, string>,
    )
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return {}
  }
}

export async function updateSiteSettings(settings: Record<string, string>): Promise<boolean> {
  try {
    const db = await checkDatabase()
    for (const [key, value] of Object.entries(settings)) {
      await db`
        INSERT INTO site_settings (key, value) 
        VALUES (${key}, ${value})
        ON CONFLICT (key) 
        DO UPDATE SET value = EXCLUDED.value
      `
    }
    return true
  } catch (error) {
    console.error("Error updating site settings:", error)
    return false
  }
}

// Add these Experience functions at the end of the file, before the export statements

// Experience functions
export async function getExperience(): Promise<Experience[]> {
  try {
    const db = await checkDatabase()
    const experience = await db`
      SELECT * FROM experience 
      WHERE is_active = true 
      ORDER BY order_index ASC, start_date DESC
    `
    return experience as Experience[]
  } catch (error) {
    console.error("Error fetching experience:", error)
    return []
  }
}

export async function getAllExperience(): Promise<Experience[]> {
  try {
    const db = await checkDatabase()
    const experience = await db`
      SELECT * FROM experience 
      ORDER BY order_index ASC, start_date DESC
    `
    return experience as Experience[]
  } catch (error) {
    console.error("Error fetching all experience:", error)
    return []
  }
}

export async function createExperience(data: Omit<Experience, "id">): Promise<Experience> {
  const db = await checkDatabase()
  const [experience] = await db`
    INSERT INTO experience (
      company, position, location, start_date, end_date, is_current, 
      description, responsibilities, technologies, achievements, 
      company_logo, company_website, order_index, is_active
    )
    VALUES (
      ${data.company}, ${data.position}, ${data.location}, ${data.start_date}, 
      ${data.end_date}, ${data.is_current}, ${data.description}, 
      ${data.responsibilities}, ${data.technologies}, ${data.achievements},
      ${data.company_logo}, ${data.company_website}, ${data.order_index}, ${data.is_active}
    )
    RETURNING *
  `
  return experience as Experience
}

export async function updateExperience(id: number, data: Partial<Experience>): Promise<Experience | null> {
  try {
    const db = await checkDatabase()
    const [experience] = await db`
      UPDATE experience 
      SET company = COALESCE(${data.company}, company),
          position = COALESCE(${data.position}, position),
          location = COALESCE(${data.location}, location),
          start_date = COALESCE(${data.start_date}, start_date),
          end_date = COALESCE(${data.end_date}, end_date),
          is_current = COALESCE(${data.is_current}, is_current),
          description = COALESCE(${data.description}, description),
          responsibilities = COALESCE(${data.responsibilities}, responsibilities),
          technologies = COALESCE(${data.technologies}, technologies),
          achievements = COALESCE(${data.achievements}, achievements),
          company_logo = COALESCE(${data.company_logo}, company_logo),
          company_website = COALESCE(${data.company_website}, company_website),
          order_index = COALESCE(${data.order_index}, order_index),
          is_active = COALESCE(${data.is_active}, is_active)
      WHERE id = ${id}
      RETURNING *
    `
    return (experience as Experience) || null
  } catch (error) {
    console.error("Error updating experience:", error)
    return null
  }
}

export async function deleteExperience(id: number): Promise<boolean> {
  try {
    const db = await checkDatabase()
    const result = await db`DELETE FROM experience WHERE id = ${id}`
    return result.count > 0
  } catch (error) {
    console.error("Error deleting experience:", error)
    return false
  }
}

export async function getExperienceById(id: number): Promise<Experience | null> {
  try {
    const db = await checkDatabase()
    const [experience] = await db`
      SELECT * FROM experience 
      WHERE id = ${id}
    `
    return (experience as Experience) || null
  } catch (error) {
    console.error("Error fetching experience by ID:", error)
    return null
  }
}
