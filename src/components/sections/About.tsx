"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Badge } from "@/components/ui/Badge"

gsap.registerPlugin(ScrollTrigger)

const skills = [
  "TypeScript", "Next.js", "React", "Node.js",
  "PostgreSQL", "Prisma", "GraphQL", "REST APIs",
  "Tailwind CSS", "Framer Motion", "Three.js", "GSAP",
  "Docker", "Vercel", "AWS", "Git",
  "Zod", "tRPC", "Stripe", "Resend",
]

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.from(textRef.current.children, {
          opacity: 0,
          x: -40,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            once: true,
          },
        })
      }

      if (badgesRef.current) {
        gsap.from(badgesRef.current.children, {
          opacity: 0,
          scale: 0.85,
          duration: 0.5,
          stagger: 0.04,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: badgesRef.current,
            start: "top 85%",
            once: true,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-32 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-[--color-text-faint] mb-12">
          {"// about"}
        </p>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Text column */}
          <div ref={textRef} className="flex flex-col gap-6">
            <h2 className="font-[family-name:--font-heading] text-4xl md:text-5xl font-bold text-[--color-text] tracking-tight">
              Who I Am
            </h2>
            <p className="text-[--color-text-muted] leading-relaxed text-lg">
              I&apos;m a software freelancer with 5+ years of experience building
              production-grade web applications for startups and scale-ups. I
              specialise in the full stack — from database schema to pixel-perfect UI.
            </p>
            <p className="text-[--color-text-muted] leading-relaxed">
              My focus is on delivering fast, accessible, and maintainable software.
              I work best as a technical partner: someone who understands both the
              business problem and the engineering tradeoffs needed to solve it well.
            </p>
            <p className="text-[--color-text-muted] leading-relaxed">
              Currently available for project-based engagements and long-term
              collaborations. Based in Japan, working with clients worldwide.
            </p>
          </div>

          {/* Skills column */}
          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-[--color-text-faint] mb-6">
              Tech Stack
            </p>
            <div ref={badgesRef} className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="default">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
