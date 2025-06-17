// In-memory data store for CMS content
// This will be replaced with a database in the future

import type {
  Service as CMSService,
  Education as CMSEducation,
  Project as CMSProject,
  TechStack as CMSTechStack,
  Testimonial as CMSTestimonial,
  Article as CMSArticle,
} from "./cms"

// Types
export interface Service extends CMSService {}
export interface Education extends CMSEducation {}
export interface Project extends CMSProject {}
export interface TechStack extends CMSTechStack {}
export interface Testimonial extends CMSTestimonial {}
export interface Article extends CMSArticle {}

// In-memory store
class Store {
  private services: Service[] = []
  private education: Education[] = []
  private projects: Project[] = []
  private techStack: TechStack[] = []
  private testimonials: Testimonial[] = []
  private articles: Article[] = []

  constructor() {
    // Initialize with dummy data that matches the CMS structure
    this.services = [
      {
        id: 1,
        title: "Full-Stack Development",
        description: "Building robust and scalable web applications from front-end to back-end.",
        icon: "Code",
        order_index: 1,
        is_active: true,
      },
      {
        id: 2,
        title: "Front-End Development",
        description: "Crafting intuitive and responsive user interfaces with modern frameworks.",
        icon: "Layout",
        order_index: 2,
        is_active: true,
      },
    ]

    this.education = [
      {
        id: 1,
        degree: "Master of Science in Computer Science",
        institution: "University of Technology",
        years: "2020 - 2022",
        description: "Specialization in Web Technologies and Artificial Intelligence.",
        icon: "GraduationCap",
        order_index: 1,
        is_active: true,
      },
    ]

    this.projects = []
    this.techStack = []
    this.testimonials = []
    this.articles = []
  }

  // Services
  getServices() {
    return [...this.services]
  }

  getService(id: string) {
    return this.services.find((service) => service.id === id)
  }

  addService(service: Omit<Service, "id">) {
    const id = Math.random().toString(36).substring(2, 9)
    const newService = { ...service, id }
    this.services.push(newService)
    return newService
  }

  updateService(id: string, service: Partial<Service>) {
    const index = this.services.findIndex((s) => s.id === id)
    if (index !== -1) {
      this.services[index] = { ...this.services[index], ...service }
      return this.services[index]
    }
    return null
  }

  deleteService(id: string) {
    const index = this.services.findIndex((s) => s.id === id)
    if (index !== -1) {
      const deleted = this.services[index]
      this.services.splice(index, 1)
      return deleted
    }
    return null
  }

  // Education
  getEducation() {
    return [...this.education]
  }

  getEducationItem(id: string) {
    return this.education.find((edu) => edu.id === id)
  }

  addEducation(education: Omit<Education, "id">) {
    const id = Math.random().toString(36).substring(2, 9)
    const newEducation = { ...education, id }
    this.education.push(newEducation)
    return newEducation
  }

  updateEducation(id: string, education: Partial<Education>) {
    const index = this.education.findIndex((e) => e.id === id)
    if (index !== -1) {
      this.education[index] = { ...this.education[index], ...education }
      return this.education[index]
    }
    return null
  }

  deleteEducation(id: string) {
    const index = this.education.findIndex((e) => e.id === id)
    if (index !== -1) {
      const deleted = this.education[index]
      this.education.splice(index, 1)
      return deleted
    }
    return null
  }

  // Projects
  getProjects() {
    return [...this.projects]
  }

  // Tech Stack
  getTechStack() {
    return [...this.techStack]
  }

  // Testimonials
  getTestimonials() {
    return [...this.testimonials]
  }

  // Articles
  getArticles() {
    return [...this.articles]
  }
}

// Create a singleton instance
export const store = new Store()

// Export the educationStore for compatibility
export const educationStore = {
  getAll: () => store.getEducation(),
  getById: (id: string) => store.getEducationItem(id),
  create: (data: Omit<Education, "id">) => store.addEducation(data),
  update: (id: string, data: Partial<Education>) => store.updateEducation(id, data),
  delete: (id: string) => store.deleteEducation(id),
}
