export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  tech: string[]
  category: "web" | "mobile" | "backend" | "fullstack"
  github?: string
  demo?: string
  image: string
  featured: boolean
  year: number
}

export const projects: Project[] = [
  {
    id: "saas-dashboard",
    title: "SaaS Analytics Dashboard",
    description:
      "Real-time analytics platform for B2B SaaS companies with custom chart components and WebSocket data streaming.",
    longDescription:
      "Built a full-stack analytics dashboard for a SaaS startup serving 50k+ users. Features real-time data visualization, custom D3.js charts, role-based access control, and automated report generation. Reduced client reporting time by 70%.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "WebSocket", "D3.js", "Tailwind CSS"],
    category: "fullstack",
    github: "https://github.com/TomoyaRT",
    demo: "https://github.com/TomoyaRT",
    image: "/images/project-dashboard.jpg",
    featured: true,
    year: 2024,
  },
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description:
      "High-performance storefront with headless CMS, Stripe payments, and inventory management system.",
    longDescription:
      "Designed and developed a headless e-commerce platform with custom CMS integration. Implemented SSR for SEO optimization, achieving 98/100 Lighthouse score. Integrated Stripe for secure payments and built an admin inventory system.",
    tech: ["Next.js", "TypeScript", "Stripe", "Sanity CMS", "Vercel", "Tailwind CSS", "Zod"],
    category: "fullstack",
    github: "https://github.com/TomoyaRT",
    demo: "https://github.com/TomoyaRT",
    image: "/images/project-ecommerce.jpg",
    featured: true,
    year: 2024,
  },
  {
    id: "ai-writing-tool",
    title: "AI Writing Assistant",
    description:
      "Browser extension and web app that integrates Claude API for context-aware writing suggestions and tone adjustments.",
    longDescription:
      "Built a productivity tool integrating Claude API for intelligent writing assistance. Features include tone adjustment, grammar correction, and context-aware suggestions. Available as both a web app and Chrome extension with 2000+ active users.",
    tech: ["React", "TypeScript", "Claude API", "Chrome Extension", "Node.js", "Express", "Redis"],
    category: "fullstack",
    github: "https://github.com/TomoyaRT",
    demo: "https://github.com/TomoyaRT",
    image: "/images/project-ai-tool.jpg",
    featured: false,
    year: 2023,
  },
  {
    id: "devops-dashboard",
    title: "DevOps Monitoring Hub",
    description:
      "Centralized monitoring dashboard aggregating metrics from multiple cloud providers with alerting and on-call scheduling.",
    longDescription:
      "Developed an internal DevOps tool aggregating metrics from AWS, GCP, and Azure. Built custom alert rules engine, on-call rotation scheduler, and incident timeline. Saved the team 3+ hours per week in context-switching between monitoring tools.",
    tech: ["React", "TypeScript", "Go", "PostgreSQL", "Grafana API", "Prometheus", "Docker"],
    category: "fullstack",
    github: "https://github.com/TomoyaRT",
    demo: "https://github.com/TomoyaRT",
    image: "/images/project-devops.jpg",
    featured: false,
    year: 2023,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
