"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
import type { Project } from "@/data/projects"

interface ProjectCardProps {
  project: Project
  index: number
}

function CheckMarkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  )
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 20 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current || shouldReduceMotion) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      style={{
        perspective: 800,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: index * 0.1 }}
    >
      <motion.article
        style={shouldReduceMotion ? {} : { rotateX, rotateY }}
        whileHover={shouldReduceMotion ? {} : { y: -4 }}
        transition={{ y: { duration: 0.3 } }}
        className={cn(
          "group relative flex flex-col",
          "bg-[--color-bg-card] rounded-lg overflow-hidden",
          "border border-[--color-border]",
          "transition-[border-color,box-shadow] duration-300",
          "hover:border-[--color-accent]",
          "hover:shadow-[0_0_30px_rgba(100,255,218,0.06)]",
          "focus-within:border-[--color-accent]"
        )}
      >
        {/* Accent top bar */}
        <div className="h-0.5 w-full bg-[--color-border] transition-colors duration-300 group-hover:bg-[--color-accent]" />

        <div className="flex flex-col flex-1 p-6 gap-4">
          {/* Meta row */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[--color-text-faint]">
              {project.category}
            </span>
            <span className="font-mono text-[11px] text-[--color-text-faint]">
              {project.year}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-[family-name:--font-heading] text-xl font-bold text-[--color-text] transition-colors duration-300 group-hover:text-[--color-accent] leading-snug">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-[--color-text-muted] leading-relaxed flex-1">
            {project.description}
          </p>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 5).map((tech) => (
              <Badge key={tech} variant="default">{tech}</Badge>
            ))}
            {project.tech.length > 5 && (
              <Badge variant="outline">+{project.tech.length - 5}</Badge>
            )}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 pt-2 border-t border-[--color-border]">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[--color-text-muted] hover:text-[--color-accent] transition-colors duration-150 flex items-center gap-1.5"
                aria-label={`View ${project.title} on GitHub`}
              >
                <CheckMarkIcon />
                GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[--color-text-muted] hover:text-[--color-accent] transition-colors duration-150 flex items-center gap-1.5"
                aria-label={`View live demo of ${project.title}`}
              >
                <ExternalLinkIcon />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}
