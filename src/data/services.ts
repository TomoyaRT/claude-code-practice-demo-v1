export interface ServiceFeature {
  text: string
  included: boolean
}

export interface Service {
  id: string
  name: string
  tagline: string
  description: string
  price: number
  currency: string
  unit: string
  features: ServiceFeature[]
  recommended: boolean
  deliveryDays: number
  cta: string
}

export const services: Service[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Perfect for landing pages and small projects",
    description:
      "Ideal for startups and small businesses needing a fast, polished web presence.",
    price: 150000,
    currency: "JPY",
    unit: "project",
    recommended: false,
    deliveryDays: 14,
    cta: "Get Started",
    features: [
      { text: "Up to 5 pages", included: true },
      { text: "Responsive design", included: true },
      { text: "Basic SEO setup", included: true },
      { text: "Contact form", included: true },
      { text: "2 rounds of revisions", included: true },
      { text: "Custom animations", included: false },
      { text: "CMS integration", included: false },
      { text: "API development", included: false },
      { text: "Post-launch support (30 days)", included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Full-featured web application",
    description:
      "For businesses that need a complete web application with custom functionality and integrations.",
    price: 400000,
    currency: "JPY",
    unit: "project",
    recommended: true,
    deliveryDays: 30,
    cta: "Most Popular",
    features: [
      { text: "Unlimited pages", included: true },
      { text: "Responsive design", included: true },
      { text: "Advanced SEO + performance", included: true },
      { text: "Contact form + email", included: true },
      { text: "5 rounds of revisions", included: true },
      { text: "Custom animations", included: true },
      { text: "CMS integration", included: true },
      { text: "API development", included: true },
      { text: "Post-launch support (30 days)", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Complex systems and long-term partnership",
    description:
      "For organizations requiring ongoing development, complex architecture, or a dedicated technical partner.",
    price: 0,
    currency: "JPY",
    unit: "month",
    recommended: false,
    deliveryDays: 0,
    cta: "Let's Talk",
    features: [
      { text: "Everything in Professional", included: true },
      { text: "Dedicated development hours", included: true },
      { text: "Architecture consulting", included: true },
      { text: "Code review + mentoring", included: true },
      { text: "Priority response time", included: true },
      { text: "Monthly strategy calls", included: true },
      { text: "Unlimited revisions", included: true },
      { text: "24/7 emergency support", included: true },
      { text: "Custom SLA", included: true },
    ],
  },
]
